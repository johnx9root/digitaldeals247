import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { ProductGallery } from "@/components/shop/product-gallery";
import { Button } from "@/components/ui/button";
import { formatNAD, getProductById } from "@/lib/data";
import { whatsappUrl } from "@/lib/constants";
import { isPublicProduct } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product?.title ?? "Product" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !isPublicProduct(product.status)) notFound();

  const sold = product.status === "sold";

  const specs =
    product.category === "phone" && product.phone_specs
      ? [
          ["Brand", product.phone_specs.brand],
          ["Model", product.phone_specs.model],
          ["Storage", product.phone_specs.storage],
          ["Color", product.phone_specs.color],
          ["Battery health", product.phone_specs.battery_health],
          ["Condition", product.phone_specs.condition],
        ]
      : product.category === "car" && product.car_specs
        ? [
            ["Make", product.car_specs.make],
            ["Model", product.car_specs.model],
            ["Year", String(product.car_specs.year)],
            ["Mileage", `${product.car_specs.mileage.toLocaleString()} km`],
            ["Fuel", product.car_specs.fuel_type],
            ["Transmission", product.car_specs.transmission],
            ["Color", product.car_specs.color],
          ]
        : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-blue"
      >
        <ArrowLeft className="size-4" />
        Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ProductGallery images={product.images} title={product.title} />
          {sold && (
            <span className="absolute left-4 top-4 z-10 rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white shadow">
              Sold
            </span>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              {product.category}
            </p>
            {sold && (
              <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                Sold
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-brand-blue sm:text-4xl">
            {product.title}
          </h1>
          <p
            className={`mt-3 text-3xl font-bold ${sold ? "text-muted-foreground line-through" : "text-brand-green"}`}
          >
            {formatNAD(product.price)}
          </p>
          {sold && (
            <p className="mt-1 text-base font-semibold text-red-600">
              This item has been sold
              {product.soldAt
                ? ` · ${new Date(product.soldAt).toLocaleDateString("en-NA")}`
                : ""}
            </p>
          )}
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {specs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-border bg-white px-3 py-2"
                >
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="font-medium text-brand-blue">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {sold ? (
            <Button disabled size="lg" variant="outline" className="mt-8 w-full sm:w-auto">
              Sold — no longer available
            </Button>
          ) : (
            <Button asChild size="lg" variant="whatsapp" className="mt-8 w-full sm:w-auto">
              <a
                href={whatsappUrl(`Hi, I'm interested in ${product.title}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-5" />
                Contact on WhatsApp to Buy
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
