import { NextResponse } from "next/server";

import { createBuyback, getBuybacks, updateBuyback } from "@/lib/data";
import type { BuybackStatus } from "@/lib/types";

export async function GET() {
  const rows = await getBuybacks();
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createBuyback(body);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id: string;
    status?: BuybackStatus;
    commission_percent?: number;
    commission_agreed?: boolean;
  };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const ok = await updateBuyback(body.id, {
    status: body.status,
    commission_percent: body.commission_percent,
    commission_agreed: body.commission_agreed,
  });
  return NextResponse.json({ ok });
}
