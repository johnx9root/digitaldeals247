import type { Metadata } from "next";

import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getProducts, usingDemoData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
        Shop
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Browse quality pre-owned phones and cars in Windhoek. Chat on WhatsApp
        to reserve or buy.
        {usingDemoData()
          ? " Showing demo inventory until Supabase is connected."
          : ""}
      </p>
      <div className="mt-8">
        <ShopCatalog products={products} />
      </div>
    </div>
  );
}
