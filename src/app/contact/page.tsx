import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE, whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
        Contact
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Reach us anytime via WhatsApp or email. We&apos;re based in{" "}
        {SITE.location}.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6">
          <MessageCircle className="size-6 text-brand-green" />
          <p className="mt-3 font-semibold text-brand-blue">WhatsApp</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {SITE.whatsapp.display}
          </p>
          <Button asChild variant="whatsapp" className="mt-4 w-full">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Open chat
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <Mail className="size-6 text-brand-blue" />
          <p className="mt-3 font-semibold text-brand-blue">Email</p>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {SITE.email}
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <a href={`mailto:${SITE.email}`}>Send email</a>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <MapPin className="size-6 text-brand-green" />
          <p className="mt-3 font-semibold text-brand-blue">Location</p>
          <p className="mt-1 text-sm text-muted-foreground">{SITE.location}</p>
        </div>
      </div>
    </div>
  );
}
