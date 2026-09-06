import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatNAD, mockStore } from "@/lib/mock-data";
import type {
  BuybackStatus,
  BuybackSubmission,
  CarSpecs,
  PhoneSpecs,
  Product,
  ProductCategory,
  ProductStatus,
  ProductWithSpecs,
} from "@/lib/types";
import {
  DEFAULT_COMMISSION_PERCENT,
  isPublicProduct,
  statusFromFlags,
} from "@/lib/types";

export { formatNAD };

export async function getProducts(options?: {
  category?: ProductCategory | "all";
  search?: string;
  /** Admin: include archived. Public shop uses available + sold. */
  includeUnavailable?: boolean;
}): Promise<ProductWithSpecs[]> {
  const category = options?.category ?? "all";
  const search = options?.search?.trim().toLowerCase() ?? "";
  const includeUnavailable = options?.includeUnavailable ?? false;

  const supabase = getSupabase();
  if (supabase) {
    let query = supabase
      .from("products")
      .select("*, phone_specs(*), car_specs(*)");
    if (!includeUnavailable) {
      query = query.in("status", ["available", "sold"]);
    }
    if (category !== "all") query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("getProducts", error);
      return [];
    }
    return (data ?? []).map(normalizeProductRow);
  }

  return mockStore.products
    .filter((p) => includeUnavailable || isPublicProduct(p.status))
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => !search || p.title.toLowerCase().includes(search))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getProductById(
  id: string
): Promise<ProductWithSpecs | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, phone_specs(*), car_specs(*)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return normalizeProductRow(data);
  }
  return mockStore.products.find((p) => p.id === id) ?? null;
}

function normalizeProductRow(row: Record<string, unknown>): ProductWithSpecs {
  const phone = row.phone_specs;
  const car = row.car_specs;
  const status = statusFromFlags(row.status, row.isAvailable, row.soldAt);
  return {
    id: String(row.id),
    category: row.category as ProductCategory,
    title: String(row.title),
    price: Number(row.price),
    description: String(row.description ?? ""),
    images: (row.images as string[]) ?? [],
    isAvailable: status === "available",
    status,
    soldAt: row.soldAt ? String(row.soldAt) : null,
    created_at: String(row.created_at),
    phone_specs: Array.isArray(phone)
      ? ((phone[0] as PhoneSpecs) ?? null)
      : ((phone as PhoneSpecs) ?? null),
    car_specs: Array.isArray(car)
      ? ((car[0] as CarSpecs) ?? null)
      : ((car as CarSpecs) ?? null),
  };
}

function productStatusFields(status: ProductStatus) {
  return {
    status,
    isAvailable: status === "available",
    soldAt: status === "sold" ? new Date().toISOString() : null,
  };
}

export async function createProduct(input: {
  product: Omit<Product, "id" | "created_at" | "soldAt" | "status" | "isAvailable"> & {
    status?: ProductStatus;
    isAvailable?: boolean;
    soldAt?: string | null;
  };
  phone_specs?: Omit<PhoneSpecs, "id" | "product_id">;
  car_specs?: Omit<CarSpecs, "id" | "product_id">;
}): Promise<{ id: string } | { error: string }> {
  const status =
    input.product.status ??
    (input.product.isAvailable === false ? "archived" : "available");
  const fields = productStatusFields(status);

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        category: input.product.category,
        title: input.product.title,
        price: input.product.price,
        description: input.product.description,
        images: input.product.images,
        ...fields,
      })
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Insert failed" };

    if (input.product.category === "phone" && input.phone_specs) {
      const { error: pe } = await supabase.from("phone_specs").insert({
        product_id: data.id,
        ...input.phone_specs,
      });
      if (pe) return { error: pe.message };
    }
    if (input.product.category === "car" && input.car_specs) {
      const { error: ce } = await supabase.from("car_specs").insert({
        product_id: data.id,
        ...input.car_specs,
      });
      if (ce) return { error: ce.message };
    }
    return { id: data.id };
  }

  const id = crypto.randomUUID();
  const created: ProductWithSpecs = {
    id,
    category: input.product.category,
    title: input.product.title,
    price: input.product.price,
    description: input.product.description,
    images: input.product.images,
    ...fields,
    created_at: new Date().toISOString(),
    phone_specs: input.phone_specs
      ? { id: crypto.randomUUID(), product_id: id, ...input.phone_specs }
      : null,
    car_specs: input.car_specs
      ? { id: crypto.randomUUID(), product_id: id, ...input.car_specs }
      : null,
  };
  mockStore.products = [created, ...mockStore.products];
  return { id };
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  const fields = productStatusFields(status);
  // Keep soldAt if already sold and re-marking sold without wiping history
  if (status === "sold") {
    const existing = await getProductById(id);
    if (existing?.soldAt) fields.soldAt = existing.soldAt;
  }

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("products").update(fields).eq("id", id);
    return !error;
  }
  mockStore.products = mockStore.products.map((p) =>
    p.id === id
      ? {
          ...p,
          ...fields,
          soldAt:
            status === "sold" ? (p.soldAt ?? fields.soldAt) : null,
        }
      : p
  );
  return true;
}

export async function updateProductAvailability(
  id: string,
  isAvailable: boolean
) {
  return updateProductStatus(id, isAvailable ? "available" : "archived");
}

export async function deleteProduct(id: string) {
  return updateProductStatus(id, "archived");
}

function normalizeCommission(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) return DEFAULT_COMMISSION_PERCENT;
  return Math.round(n);
}

function normalizeBuybackRow(row: Record<string, unknown>): BuybackSubmission {
  return {
    id: String(row.id),
    brand: String(row.brand),
    model: String(row.model),
    damage_type: String(row.damage_type),
    is_locked: Boolean(row.is_locked),
    photos: (row.photos as string[]) ?? [],
    whatsapp: String(row.whatsapp),
    estimated_price: String(row.estimated_price),
    commission_percent: normalizeCommission(row.commission_percent),
    commission_agreed: Boolean(row.commission_agreed),
    status: row.status as BuybackStatus,
    created_at: String(row.created_at),
  };
}

export async function createBuyback(
  input: Omit<
    BuybackSubmission,
    "id" | "created_at" | "status" | "commission_agreed"
  > & {
    status?: BuybackStatus;
    commission_agreed?: boolean;
  }
): Promise<{ id: string } | { error: string }> {
  if (input.is_locked) {
    return { error: "We don't buy locked devices." };
  }

  const commission_percent = normalizeCommission(input.commission_percent);
  const commission_agreed = Boolean(input.commission_agreed);

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("buyback_submissions")
      .insert({
        brand: input.brand,
        model: input.model,
        damage_type: input.damage_type,
        is_locked: false,
        photos: input.photos,
        whatsapp: input.whatsapp,
        estimated_price: input.estimated_price,
        commission_percent,
        commission_agreed,
        status: input.status ?? "Pending",
      })
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Submit failed" };
    return { id: data.id };
  }

  const submission: BuybackSubmission = {
    id: crypto.randomUUID(),
    brand: input.brand,
    model: input.model,
    damage_type: input.damage_type,
    is_locked: false,
    photos: input.photos,
    whatsapp: input.whatsapp,
    estimated_price: input.estimated_price,
    commission_percent,
    commission_agreed,
    status: "Pending",
    created_at: new Date().toISOString(),
  };
  mockStore.buybacks = [submission, ...mockStore.buybacks];
  return { id: submission.id };
}

export async function getBuybacks(): Promise<BuybackSubmission[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("buyback_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map((row) =>
      normalizeBuybackRow(row as Record<string, unknown>)
    );
  }
  return [...mockStore.buybacks].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateBuyback(
  id: string,
  patch: {
    status?: BuybackStatus;
    commission_percent?: number;
    commission_agreed?: boolean;
  }
) {
  const updates: Record<string, unknown> = {};
  if (patch.status) updates.status = patch.status;
  if (patch.commission_percent !== undefined) {
    updates.commission_percent = normalizeCommission(patch.commission_percent);
  }
  if (patch.commission_agreed !== undefined) {
    updates.commission_agreed = patch.commission_agreed;
  }
  if (Object.keys(updates).length === 0) return false;

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("buyback_submissions")
      .update(updates)
      .eq("id", id);
    return !error;
  }
  mockStore.buybacks = mockStore.buybacks.map((b) =>
    b.id === id
      ? {
          ...b,
          ...(updates.status ? { status: updates.status as BuybackStatus } : {}),
          ...(updates.commission_percent !== undefined
            ? { commission_percent: updates.commission_percent as number }
            : {}),
          ...(updates.commission_agreed !== undefined
            ? { commission_agreed: updates.commission_agreed as boolean }
            : {}),
        }
      : b
  );
  return true;
}

export async function updateBuybackStatus(id: string, status: BuybackStatus) {
  return updateBuyback(id, { status });
}

async function fileToDataUrl(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function uploadImages(
  bucket: "product-images" | "buyback-photos",
  files: File[]
): Promise<string[]> {
  if (files.length === 0) return [];

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    const urls: string[] = [];
    for (const file of files) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: false,
      });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  // Demo mode: embed images as data URLs so admin/shop previews are real.
  return Promise.all(files.map(fileToDataUrl));
}

export function estimateBuybackPrice(brand: string, damageType: string): string {
  const base =
    brand === "Apple"
      ? { low: 1500, high: 2500 }
      : { low: 1000, high: 2000 };

  const modifiers: Record<string, number> = {
    "Broken Screen": 0,
    "Water Damage": -200,
    "Dead Motherboard": -500,
    "Camera Issue": -150,
    "Battery Issue": 100,
    Other: -100,
  };
  const mod = modifiers[damageType] ?? 0;
  const low = Math.max(500, base.low + mod);
  const high = Math.max(low + 500, base.high + mod);
  return `N$${low.toLocaleString("en-NA")} - N$${high.toLocaleString("en-NA")}`;
}

export function usingDemoData() {
  return !isSupabaseConfigured();
}
