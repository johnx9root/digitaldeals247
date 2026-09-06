"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProductCategory, ProductWithSpecs } from "@/lib/types";

type Filter = "all" | ProductCategory;

export function ShopCatalog({ products }: { products: ProductWithSpecs[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-border bg-white p-1">
          {(
            [
              ["all", "All"],
              ["phone", "Phones"],
              ["car", "Cars"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition",
                filter === value
                  ? "bg-brand-blue text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
