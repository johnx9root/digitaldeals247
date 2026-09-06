import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Price Guide",
};

const RATES = [
  { model: "iPhone 15 Pro Max", screen: "N$3,500 – N$5,000", water: "N$2,000 – N$3,500" },
  { model: "iPhone 14 Pro", screen: "N$2,500 – N$3,800", water: "N$1,500 – N$2,800" },
  { model: "iPhone 13 / 13 Pro", screen: "N$1,500 – N$2,500", water: "N$1,000 – N$2,000" },
  { model: "iPhone 12", screen: "N$1,000 – N$1,800", water: "N$700 – N$1,400" },
  { model: "iPhone 11", screen: "N$700 – N$1,200", water: "N$500 – N$900" },
  { model: "Galaxy S24 / S24 Ultra", screen: "N$2,800 – N$4,200", water: "N$1,800 – N$3,000" },
  { model: "Galaxy S23 / S23 Ultra", screen: "N$2,000 – N$3,200", water: "N$1,200 – N$2,400" },
  { model: "Galaxy S22 / A54", screen: "N$1,000 – N$2,000", water: "N$700 – N$1,500" },
];

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
        Price Guide
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Typical buyback ranges for common Samsung and iPhone models in Windhoek.
        Final offers depend on condition, photos, and market demand. We buy to
        resell — please offer a reasonable wholesale price.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-brand-blue text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">Broken screen</th>
              <th className="px-4 py-3 font-semibold">Water / other damage</th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((row) => (
              <tr key={row.model} className="border-b last:border-0 odd:bg-muted/30">
                <td className="px-4 py-3 font-medium text-brand-blue">{row.model}</td>
                <td className="px-4 py-3 text-brand-green">{row.screen}</td>
                <td className="px-4 py-3">{row.water}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        We don&apos;t buy locked devices (iCloud / Google account locks).
      </div>

      <div className="mt-8">
        <Button asChild className="bg-brand-blue">
          <Link href="/sell">Get your estimate</Link>
        </Button>
      </div>
    </div>
  );
}
