import Link from "next/link";
import { MapPin, MessageCircle, Mail } from "lucide-react";

import { NAV_LINKS, SITE, whatsappUrl } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-brand-blue text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold tracking-tight">
            DigitalDeals<span className="text-brand-green">24/7</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
            Buying and selling quality pre-owned phones and cars in Windhoek,
            Namibia. We also buy broken Samsung &amp; iPhones for cash.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            Quick links
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" />
              <span>{SITE.location}</span>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 transition-colors hover:text-white"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-green" />
                <span>WhatsApp: {SITE.whatsapp.display}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-start gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-green" />
                <span>{SITE.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/55 sm:px-6">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
