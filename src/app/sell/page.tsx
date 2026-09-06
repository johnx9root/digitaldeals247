import type { Metadata } from "next";

import { SellForm } from "@/components/sell/sell-form";

export const metadata: Metadata = {
  title: "Sell Your Phone",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
        Sell Your Broken Phone
      </h1>
      <p className="mt-3 text-muted-foreground">
        Get a fair cash estimate for damaged Samsung and Apple iPhones in
        Windhoek. Instant WhatsApp follow-up.
      </p>
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <strong>Policy:</strong> We don&apos;t buy iCloud / Google locked devices.
      </div>
      <div className="mt-8">
        <SellForm />
      </div>
    </div>
  );
}
