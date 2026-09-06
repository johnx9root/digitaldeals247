"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNAD } from "@/lib/data";
import {
  BUYBACK_STATUSES,
  COMMISSION_RATES,
  type BuybackSubmission,
  type ProductStatus,
  type ProductWithSpecs,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const ADMIN_COOKIE = "dd247_admin";

function statusLabel(status: ProductStatus) {
  if (status === "available") return "Available";
  if (status === "sold") return "Sold";
  return "Archived";
}

function statusClass(status: ProductStatus) {
  if (status === "available") return "text-brand-green";
  if (status === "sold") return "text-red-600 font-semibold";
  return "text-muted-foreground";
}

export function AdminPanel({ authed }: { authed: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<ProductWithSpecs[]>([]);
  const [buybacks, setBuybacks] = useState<BuybackSubmission[]>([]);
  const [loading, setLoading] = useState(authed);

  const pendingCount = useMemo(
    () => buybacks.filter((b) => b.status === "Pending").length,
    [buybacks]
  );

  async function refresh() {
    setLoading(true);
    const [pRes, bRes] = await Promise.all([
      fetch("/api/products?all=1"),
      fetch("/api/buybacks"),
    ]);
    setProducts((await pRes.json()) as ProductWithSpecs[]);
    setBuybacks((await bRes.json()) as BuybackSubmission[]);
    setLoading(false);
  }

  useEffect(() => {
    if (authed) void refresh();
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Wrong password");
      return;
    }
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function setProductStatus(id: string, status: ProductStatus) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  }

  if (!authed) {
    return (
      <form
        onSubmit={login}
        className="mx-auto mt-10 max-w-sm space-y-4 rounded-xl border border-border bg-white p-6"
      >
        <h2 className="font-display text-xl font-bold text-brand-blue">
          Admin login
        </h2>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
        </div>
        {loginError && <p className="text-sm text-red-600">{loginError}</p>}
        <Button type="submit" className="w-full bg-brand-blue">
          Enter dashboard
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading…"
            : `${products.length} products · ${buybacks.length} buybacks`}
          {pendingCount > 0 && (
            <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              {pendingCount} new
            </span>
          )}
        </p>
        <Button variant="outline" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>

      <Tabs defaultValue="add">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="add">Add New Product</TabsTrigger>
          <TabsTrigger value="inventory">Manage Inventory</TabsTrigger>
          <TabsTrigger value="buybacks">
            Buyback Requests
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-red-600 px-1.5 text-[10px] text-white">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddProductForm onCreated={refresh} />
        </TabsContent>

        <TabsContent value="inventory">
          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 capitalize">{p.category}</td>
                    <td className="px-4 py-3">{formatNAD(p.price)}</td>
                    <td className={cn("px-4 py-3", statusClass(p.status))}>
                      {statusLabel(p.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {p.status !== "available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProductStatus(p.id, "available")}
                          >
                            Mark available
                          </Button>
                        )}
                        {p.status !== "sold" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => setProductStatus(p.id, "sold")}
                          >
                            Mark sold
                          </Button>
                        )}
                        {p.status !== "archived" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProductStatus(p.id, "archived")}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="buybacks">
          <p className="mb-3 text-sm text-muted-foreground">
            Confirm or adjust the commission % with each seller — both sides of
            the deal should match once you mark it agreed.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Damage</th>
                  <th className="px-4 py-3">Estimate</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Photos</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {buybacks.map((b) => (
                  <BuybackRow key={b.id} buyback={b} onUpdated={refresh} />
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
      <p className="sr-only">{ADMIN_COOKIE}</p>
    </div>
  );
}

function BuybackRow({
  buyback,
  onUpdated,
}: {
  buyback: BuybackSubmission;
  onUpdated: () => Promise<void>;
}) {
  const [commission, setCommission] = useState(buyback.commission_percent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCommission(buyback.commission_percent);
  }, [buyback.commission_percent]);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/buybacks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: buyback.id, ...body }),
    });
    await onUpdated();
    setSaving(false);
  }

  return (
    <tr className="border-b last:border-0 align-top">
      <td className="px-4 py-3">
        {buyback.brand} {buyback.model}
      </td>
      <td className="px-4 py-3">{buyback.damage_type}</td>
      <td className="px-4 py-3">{buyback.estimated_price}</td>
      <td className="px-4 py-3">
        <div className="space-y-2 min-w-[9rem]">
          <select
            className="h-9 w-full rounded-md border border-input bg-white px-2 text-sm"
            value={commission}
            disabled={saving}
            onChange={(e) => setCommission(Number(e.target.value))}
          >
            {[...new Set([...COMMISSION_RATES, buyback.commission_percent])]
              .sort((a, b) => a - b)
              .map((rate) => (
                <option key={rate} value={rate}>
                  {rate}%
                </option>
              ))}
          </select>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={saving || commission === buyback.commission_percent}
              onClick={() =>
                patch({
                  commission_percent: commission,
                  commission_agreed: false,
                })
              }
            >
              Update
            </Button>
            <Button
              size="sm"
              className={
                buyback.commission_agreed
                  ? "bg-brand-green hover:bg-brand-green/90"
                  : "bg-brand-blue"
              }
              disabled={saving}
              onClick={() =>
                patch({
                  commission_percent: commission,
                  commission_agreed: true,
                })
              }
            >
              {buyback.commission_agreed ? "Agreed ✓" : "Confirm deal"}
            </Button>
          </div>
          <p
            className={cn(
              "text-xs font-medium",
              buyback.commission_agreed
                ? "text-brand-green"
                : "text-amber-700"
            )}
          >
            {buyback.commission_agreed
              ? `Agreed at ${buyback.commission_percent}%`
              : `Proposed ${buyback.commission_percent}% — awaiting confirm`}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">{buyback.whatsapp}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {buyback.photos.slice(0, 3).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-10 w-10 rounded object-cover"
            />
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <select
          className="h-9 rounded-md border border-input bg-white px-2 text-sm"
          value={buyback.status}
          disabled={saving}
          onChange={(e) => patch({ status: e.target.value })}
        >
          {BUYBACK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

function AddProductForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const [category, setCategory] = useState<"phone" | "car">("phone");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // phone
  const [brand, setBrand] = useState("Apple");
  const [phoneModel, setPhoneModel] = useState("");
  const [storage, setStorage] = useState("128GB");
  const [phoneColor, setPhoneColor] = useState("");
  const [battery, setBattery] = useState("85%");
  const [condition, setCondition] = useState("Good");

  // car
  const [make, setMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Automatic");
  const [carColor, setCarColor] = useState("");

  function setPhotoFiles(list: File[]) {
    setFiles(list);
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return list.map((f) => URL.createObjectURL(f));
    });
  }

  function removePhoto(index: number) {
    const next = files.filter((_, i) => i !== index);
    setPhotoFiles(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      if (files.length === 0) {
        setError(`Please upload at least one ${category} photo.`);
        return;
      }

      const form = new FormData();
      form.set("bucket", "product-images");
      files.forEach((f) => form.append("files", f));
      const up = await fetch("/api/upload", { method: "POST", body: form });
      const upJson = (await up.json()) as { urls?: string[]; error?: string };
      if (!up.ok || !upJson.urls?.length) {
        setError(upJson.error ?? "Image upload failed");
        return;
      }

      const autoTitle =
        title.trim() ||
        (category === "phone"
          ? `${brand} ${phoneModel} ${storage}`.trim()
          : `${make} ${carModel} ${year}`.trim());

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            category,
            title: autoTitle,
            price: Number(price),
            description,
            images: upJson.urls,
            status: "available",
            isAvailable: true,
          },
          phone_specs:
            category === "phone"
              ? {
                  brand,
                  model: phoneModel,
                  storage,
                  color: phoneColor,
                  battery_health: battery,
                  condition,
                }
              : undefined,
          car_specs:
            category === "car"
              ? {
                  make,
                  model: carModel,
                  year: Number(year),
                  mileage: Number(mileage),
                  fuel_type: fuel,
                  transmission,
                  color: carColor,
                }
              : undefined,
        }),
      });
      const result = (await res.json()) as { id?: string; error?: string };

      if (!res.ok || result.error) {
        setError(result.error ?? "Save failed");
        return;
      }
      setMessage("Product saved with photos.");
      setTitle("");
      setPrice("");
      setDescription("");
      setPhotoFiles([]);
      setPhoneModel("");
      setPhoneColor("");
      setMake("");
      setCarModel("");
      setYear("");
      setMileage("");
      setCarColor("");
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-border bg-white p-5"
    >
      <div className="rounded-lg border border-brand-blue/15 bg-brand-blue/5 px-4 py-3 text-sm text-muted-foreground">
        Upload clear {category === "phone" ? "phone" : "car"} photos, fill the
        description and specs, then save. Images are stored to product gallery
        (demo mode embeds them so previews still work without Supabase).
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as "phone" | "car")}
        >
          <option value="phone">Phone</option>
          <option value="car">Car</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title (optional — auto from specs if blank)</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              category === "phone"
                ? "e.g. iPhone 13 Pro 256GB"
                : "e.g. Toyota Corolla 2018"
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Price (NAD)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder={
            category === "phone"
              ? "Condition notes, battery, accessories…"
              : "Service history, mileage notes, extras…"
          }
          rows={4}
        />
      </div>

      {category === "phone" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={["Apple", "Samsung"]}
          />
          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={phoneModel}
              onChange={(e) => setPhoneModel(e.target.value)}
              required
            />
          </div>
          <Field
            label="Storage"
            value={storage}
            onChange={setStorage}
            options={["64GB", "128GB", "256GB", "512GB"]}
          />
          <div className="space-y-2">
            <Label>Color</Label>
            <Input
              value={phoneColor}
              onChange={(e) => setPhoneColor(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Battery health</Label>
            <Input
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
              required
            />
          </div>
          <Field
            label="Condition"
            value={condition}
            onChange={setCondition}
            options={["Excellent", "Good", "Fair"]}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Make</Label>
            <Input
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Mileage (km)</Label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </div>
          <Field
            label="Fuel"
            value={fuel}
            onChange={setFuel}
            options={["Petrol", "Diesel", "Electric"]}
          />
          <Field
            label="Transmission"
            value={transmission}
            onChange={setTransmission}
            options={["Manual", "Automatic"]}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label>Color</Label>
            <Input
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label>
          {category === "phone" ? "Phone photos" : "Car photos"} (required, up
          to 5)
        </Label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-8 hover:bg-muted/50">
          <ImagePlus className="size-8 text-brand-blue" />
          <span className="mt-2 text-sm font-medium text-brand-blue">
            Choose {category} pictures
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPG/PNG · front, back, and detail shots work best
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) =>
              setPhotoFiles(Array.from(e.target.files ?? []).slice(0, 5))
            }
          />
        </label>
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={src} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Upload ${i + 1}`}
                  className="h-20 w-20 rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 p-0.5 text-white"
                  aria-label="Remove photo"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-brand-green">{message}</p>}
      <Button type="submit" disabled={saving} className="bg-brand-blue">
        {saving ? "Uploading & saving…" : "Save product"}
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
