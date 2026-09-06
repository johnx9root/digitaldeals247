import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Car,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

import { BuybackHeroVisual } from "@/components/home/buyback-hero-visual";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { getProducts, usingDemoData } from "@/lib/data";
import { SITE } from "@/lib/constants";

export default async function HomePage() {
  const all = await getProducts();
  const products = (
    all.filter((p) => p.status === "available").length > 0
      ? all.filter((p) => p.status === "available")
      : all
  ).slice(0, 3);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[75vh] bg-[radial-gradient(ellipse_at_top_left,_#dbeafe_0%,_transparent_50%),radial-gradient(ellipse_at_top_right,_#dcfce7_0%,_transparent_45%)]"
      />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
            DigitalDeals<span className="text-brand-blue">24/7</span>
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-blue sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Quality pre-owned phones &amp; cars in {SITE.location.split(",")[0]}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Shop tested devices — or sell your broken Samsung / iPhone for cash
            the same day.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
              <Link href="/shop">
                Browse Phones &amp; Cars
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-green text-brand-green hover:bg-brand-green/10"
            >
              <Link href="/sell">Sell Broken Phone</Link>
            </Button>
          </div>
        </div>

        <BuybackHeroVisual />
      </section>

      <section className="border-y border-border bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Fast Process", text: "Quick quotes & handovers" },
            { icon: BadgeCheck, title: "Fair Prices", text: "Reasonable market rates" },
            { icon: Banknote, title: "Instant Cash", text: "Cash deals possible" },
            { icon: ShieldCheck, title: "Quality Checked", text: "Devices tested before sale" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-xl px-2 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-brand-blue">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: "100+", label: "Happy Customers", icon: BadgeCheck },
            { value: "50+", label: "Cars Sold", icon: Car },
            { value: "200+", label: "Phones Traded", icon: Smartphone },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-6 text-center"
            >
              <stat.icon className="mx-auto size-6 text-brand-green" />
              <p className="mt-3 font-display text-3xl font-bold text-brand-blue">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-blue sm:text-3xl">
              Featured stock
            </h2>
            <p className="mt-1 text-muted-foreground">
              Fresh phones &amp; cars ready to go.
              {usingDemoData() ? " (Demo inventory)" : ""}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">View all</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
