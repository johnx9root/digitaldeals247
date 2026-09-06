import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE, whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
        About {SITE.name}
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        Based in {SITE.location}, {SITE.name} helps people buy quality
        pre-owned phones and cars — and sell broken Samsung &amp; iPhones for
        fair, instant cash. We focus on a fast process, honest pricing, and
        devices that are unlocked and ready to resell.
      </p>

      <ul className="mt-6 max-w-xl space-y-2 text-sm text-muted-foreground">
        <li>• Retail: quality-checked phones &amp; cars</li>
        <li>• Buyback: damaged Samsung &amp; Apple iPhones</li>
        <li>• Contact: WhatsApp {SITE.whatsapp.display}</li>
        <li>• Email: {SITE.email}</li>
      </ul>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <MapPin className="size-4 text-brand-green" />
          <p className="text-sm font-medium text-brand-blue">
            Windhoek, Namibia
          </p>
        </div>
        <iframe
          title="Windhoek, Namibia map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=17.00%2C-22.65%2C17.15%2C-22.50&amp;layer=mapnik&amp;marker=-22.5609%2C17.0658"
          className="h-72 w-full border-0 sm:h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="whatsapp">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            WhatsApp us
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Browse shop</Link>
        </Button>
      </div>
    </div>
  );
}
