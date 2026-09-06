import { NextResponse } from "next/server";

import { deleteProduct, updateProductStatus } from "@/lib/data";
import type { ProductStatus } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  return NextResponse.json({ ok });
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const body = (await request.json()) as { status?: ProductStatus };
  if (!body.status || !["available", "sold", "archived"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const ok = await updateProductStatus(id, body.status);
  return NextResponse.json({ ok });
}
