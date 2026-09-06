import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNAD } from "@/lib/data";
import { whatsappUrl } from "@/lib/constants";
import type { ProductWithSpecs } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithSpecs }) {
  const image =
    product.images[0] ??
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80";
  const buyMsg = `Hi, I'm interested in ${product.title}`;
  const sold = product.status === "sold";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/shop/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition duration-300 group-hover:scale-105",
            sold && "opacity-80 grayscale-[30%]"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={image.startsWith("data:")}
        />
        <span className="absolute left-3 top-3 rounded-md bg-brand-blue/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          {product.category}
        </span>
        {sold && (
          <span className="absolute right-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
            Sold
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={`/shop/${product.id}`}>
            <h3 className="font-display text-lg font-semibold text-brand-blue hover:underline">
              {product.title}
            </h3>
          </Link>
          <p
            className={cn(
              "mt-1 text-xl font-bold",
              sold ? "text-muted-foreground line-through" : "text-brand-green"
            )}
          >
            {formatNAD(product.price)}
          </p>
          {sold && (
            <p className="mt-1 text-sm font-semibold text-red-600">Sold</p>
          )}
        </div>
        {sold ? (
          <Button disabled variant="outline" className="mt-auto w-full">
            Sold — unavailable
          </Button>
        ) : (
          <Button asChild variant="whatsapp" className="mt-auto w-full">
            <a href={whatsappUrl(buyMsg)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Chat on WhatsApp to Buy
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
