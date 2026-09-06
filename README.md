# DigitalDeals24/7

Full-stack website for **DigitalDeals24/7** — buy & sell pre-owned phones and cars in Windhoek, Namibia, plus broken Samsung/iPhone buyback.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Supabase (PostgreSQL + Storage) — optional; demo data works without it
- Cloudflare Workers deploy via OpenNext (`npm run deploy`)

## Features

| Area | Routes |
|------|--------|
| Home + trust badges + featured stock | `/` |
| Shop + filters + product detail | `/shop`, `/shop/[id]` |
| Multi-step buyback form | `/sell` |
| Buyback price guide | `/prices` |
| About + Windhoek map | `/about` |
| Contact | `/contact` |
| Admin (password: `admin123`) | `/admin` |

Floating WhatsApp button on every page: **+264 81 669 6885**

## Local development

```bash
# Node 22+ recommended (Wrangler 4 requires it)
nvm use 22

npm install
cp .env.local.example .env.local   # optional Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase keys, the app uses in-memory **demo inventory** and buyback submissions.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Create public storage buckets: `product-images`, `buyback-photos`.
4. Set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=admin123
```

5. Restart `npm run dev`.

## Admin

- URL: `/admin`
- Default password: `admin123` (override with `ADMIN_PASSWORD`)

## Deploy to Cloudflare Workers

```bash
nvm use 22
npx wrangler login
npm run deploy
```

This runs OpenNext build + `wrangler deploy`. Live URL will look like:

`https://digitaldeals247.<your-subdomain>.workers.dev`

### Or push to GitHub + Vercel

```bash
git init
git add .
git commit -m "Launch DigitalDeals24/7"
gh repo create digitaldeals247 --private --source=. --push
```

Then import the repo in [Vercel](https://vercel.com) and add the same env vars.

## Contact

- WhatsApp: +264 81 669 6885
- Email: loxionyasheinvestment@gmail.com
- Location: Windhoek, Namibia
