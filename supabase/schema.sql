-- DigitalDeals24/7 schema for Supabase (PostgreSQL)
-- Run in Supabase SQL Editor, then create public buckets: product-images, buyback-photos

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('phone', 'car')),
  title text not null,
  price numeric not null,
  description text not null default '',
  images text[] not null default '{}',
  "isAvailable" boolean not null default true,
  status text not null default 'available'
    check (status in ('available', 'sold', 'archived')),
  "soldAt" timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.phone_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  brand text not null,
  model text not null,
  storage text not null,
  color text not null,
  battery_health text not null,
  condition text not null
);

create table if not exists public.car_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  make text not null,
  model text not null,
  year integer not null,
  mileage integer not null,
  fuel_type text not null,
  transmission text not null,
  color text not null
);

create table if not exists public.buyback_submissions (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  damage_type text not null,
  is_locked boolean not null default false,
  photos text[] not null default '{}',
  whatsapp text not null,
  estimated_price text not null,
  commission_percent numeric not null default 20
    check (commission_percent >= 0 and commission_percent <= 100),
  commission_agreed boolean not null default false,
  status text not null default 'Pending'
    check (status in ('Pending', 'Viewed', 'Counter-offered', 'Bought', 'Rejected')),
  created_at timestamptz not null default now()
);

-- Migrations for existing databases
alter table public.products
  add column if not exists status text;
alter table public.products
  add column if not exists "soldAt" timestamptz;
update public.products
set status = case
  when status in ('available', 'sold', 'archived') then status
  when "isAvailable" = true then 'available'
  else 'archived'
end
where status is null or status not in ('available', 'sold', 'archived');
alter table public.products
  alter column status set default 'available';
alter table public.products
  alter column status set not null;

alter table public.buyback_submissions
  add column if not exists commission_percent numeric;
alter table public.buyback_submissions
  add column if not exists commission_agreed boolean;
update public.buyback_submissions
set commission_percent = 20
where commission_percent is null;
update public.buyback_submissions
set commission_agreed = false
where commission_agreed is null;
alter table public.buyback_submissions
  alter column commission_percent set default 20;
alter table public.buyback_submissions
  alter column commission_percent set not null;
alter table public.buyback_submissions
  alter column commission_agreed set default false;
alter table public.buyback_submissions
  alter column commission_agreed set not null;

alter table public.products enable row level security;
alter table public.phone_specs enable row level security;
alter table public.car_specs enable row level security;
alter table public.buyback_submissions enable row level security;

-- Public read for shop listings (available + sold). Archived stays admin-only.
drop policy if exists "Public read available products" on public.products;
create policy "Public read shop products"
  on public.products for select
  using (status in ('available', 'sold'));

drop policy if exists "Public read phone specs" on public.phone_specs;
create policy "Public read phone specs"
  on public.phone_specs for select
  using (
    exists (
      select 1 from public.products p
      where p.id = phone_specs.product_id and p.status in ('available', 'sold')
    )
  );

drop policy if exists "Public read car specs" on public.car_specs;
create policy "Public read car specs"
  on public.car_specs for select
  using (
    exists (
      select 1 from public.products p
      where p.id = car_specs.product_id and p.status in ('available', 'sold')
    )
  );

-- Anyone can submit a buyback lead
drop policy if exists "Public insert buyback" on public.buyback_submissions;
create policy "Public insert buyback"
  on public.buyback_submissions for insert
  with check (true);

-- Admin operations use the service role key (bypasses RLS).
-- Optional: add authenticated policies if you switch to Supabase Auth later.

-- Storage (run after creating buckets in dashboard, or via API):
-- insert into storage.buckets (id, name, public) values
--   ('product-images', 'product-images', true),
--   ('buyback-photos', 'buyback-photos', true)
-- on conflict (id) do nothing;
