"use client";

import { MessageCircle } from "lucide-react";

import { SITE, whatsappUrl } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(
        "Hi DigitalDeals24/7! I found you online and want to chat."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp ${SITE.whatsapp.display}`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-7 fill-white" />
      <span className="sr-only">WhatsApp {SITE.whatsapp.display}</span>
    </a>
  );
}
