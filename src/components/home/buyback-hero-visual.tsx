import Link from "next/link";
import type { ReactNode } from "react";
import { Ban, CheckCircle2, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE, whatsappUrl } from "@/lib/constants";

export function BuybackHeroVisual() {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] bg-brand-blue text-white shadow-[0_24px_60px_-20px_rgba(30,58,138,0.55)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,197,94,0.28),transparent_42%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.08),transparent_35%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full border border-brand-green/20"
      />

      <div className="relative space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Cash buyback
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85">
            <MapPin className="size-3 text-brand-green" />
            Windhoek
          </span>
        </div>

        <div>
          <p className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
            We buy{" "}
            <span className="text-brand-green">broken</span>
            <br />
            Samsung &amp; iPhones
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Damaged screens, water issues, battery faults — quality devices only.
            Fair wholesale prices. Instant cash possible.
          </p>
        </div>

        <BrokenPhoneRow />

        <ul className="grid gap-2 sm:grid-cols-2">
          {["Fast process", "Fair prices", "Instant cash", "Quality only"].map(
            (item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-white/90"
              >
                <CheckCircle2 className="size-4 shrink-0 text-brand-green" />
                {item}
              </li>
            )
          )}
        </ul>

        <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-3.5 py-3 text-sm">
          <p className="flex items-start gap-2 font-semibold text-red-100">
            <Ban className="mt-0.5 size-4 shrink-0" />
            We don&apos;t buy locked devices
          </p>
          <p className="mt-1 pl-6 text-xs text-red-100/75">
            No iCloud or Google account locks. Unlocked devices only.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-brand-green text-white hover:bg-brand-green/90"
          >
            <Link href="/sell">Get a cash estimate</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a
              href={whatsappUrl(
                "Hi DigitalDeals24/7, I want to sell a broken phone."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              {SITE.whatsapp.display}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function BrokenPhoneRow() {
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3" aria-hidden>
      <PhoneShell
        className="-rotate-6 bg-zinc-900"
        screenClassName="bg-black"
      >
        <span className="mt-6 block text-center text-[10px] font-bold text-red-500">
          ⚡ Low
        </span>
      </PhoneShell>
      <PhoneShell
        className="rotate-3 bg-zinc-100"
        screenClassName="bg-gradient-to-br from-zinc-200 to-zinc-400"
      >
        <CrackOverlay />
      </PhoneShell>
      <PhoneShell
        className="-rotate-2 bg-sky-900"
        screenClassName="bg-sky-950"
      >
        <CrackOverlay strong />
      </PhoneShell>
      <PhoneShell
        className="rotate-6 bg-zinc-800"
        screenClassName="bg-emerald-950"
      >
        <CrackOverlay />
      </PhoneShell>
    </div>
  );
}

function PhoneShell({
  className,
  screenClassName,
  children,
}: {
  className?: string;
  screenClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative h-28 w-[3.35rem] rounded-[0.85rem] border border-white/15 p-1 shadow-lg sm:h-32 sm:w-16 ${className ?? ""}`}
    >
      <div className="absolute left-1/2 top-1.5 h-1 w-5 -translate-x-1/2 rounded-full bg-black/40" />
      <div
        className={`relative h-full w-full overflow-hidden rounded-[0.65rem] ${screenClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function CrackOverlay({ strong = false }: { strong?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 70"
      className={`absolute inset-0 h-full w-full ${strong ? "opacity-90" : "opacity-70"}`}
    >
      <path
        d="M8 8 L18 28 L12 34 L22 52 L16 58 L28 68"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M30 10 L22 24 L32 40 L24 48"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M10 45 L20 55 L14 62"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}
