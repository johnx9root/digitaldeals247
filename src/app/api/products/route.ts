import { NextResponse } from "next/server";

import { createProduct, getProducts } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as "phone" | "car" | "all" | null;
  const includeUnavailable = searchParams.get("all") === "1";
  const products = await getProducts({
    category: category ?? "all",
    includeUnavailable,
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createProduct(body);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
