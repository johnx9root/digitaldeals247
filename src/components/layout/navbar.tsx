"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE, whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white"
          >
            <span className="flex gap-0.5">
              <span className="h-5 w-1.5 -skew-x-12 rounded-sm bg-brand-green" />
              <span className="h-5 w-1.5 -skew-x-12 rounded-sm bg-white/90" />
              <span className="h-5 w-1.5 -skew-x-12 rounded-sm bg-white/50" />
            </span>
          </span>
          <span className="font-display text-base font-bold tracking-tight text-brand-blue sm:text-lg">
            DigitalDeals
            <span className="text-brand-green">24/7</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
            <a
              href={whatsappUrl("Hi DigitalDeals24/7, I want to inquire.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="size-4" />
              WhatsApp
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={whatsappUrl("Hi DigitalDeals24/7, I want to inquire.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-md bg-[#25D366] px-3 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Chat on WhatsApp · {SITE.whatsapp.display}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
