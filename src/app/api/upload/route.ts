import { NextResponse } from "next/server";

import { uploadImages } from "@/lib/data";

export async function POST(request: Request) {
  const form = await request.formData();
  const bucket = String(form.get("bucket") ?? "product-images") as
    | "product-images"
    | "buyback-photos";
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File);
  try {
    const urls = await uploadImages(bucket, files);
    return NextResponse.json({ urls });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    );
  }
}
