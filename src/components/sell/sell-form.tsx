"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estimateBuybackPrice } from "@/lib/data";
import {
  COMMISSION_RATES,
  DAMAGE_TYPES,
  DEFAULT_COMMISSION_PERCENT,
  PHONE_MODELS,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Brand",
  "Model",
  "Damage",
  "Deal",
  "Photos",
  "Contact",
] as const;

export function SellForm() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<"Samsung" | "Apple" | "">("");
  const [model, setModel] = useState("");
  const [damageType, setDamageType] = useState("");
  const [commission, setCommission] = useState(DEFAULT_COMMISSION_PERCENT);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [agreeCommission, setAgreeCommission] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const estimate = useMemo(
    () =>
      brand && damageType ? estimateBuybackPrice(brand, damageType) : "",
    [brand, damageType]
  );

  const models = brand ? PHONE_MODELS[brand] : [];

  function setPhotoFiles(list: File[]) {
    setFiles(list);
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return list.map((f) => URL.createObjectURL(f));
    });
  }

  async function onSubmit() {
    setError("");
    if (!brand || !model || !damageType || !whatsapp || !unlocked) {
      setError("Please complete all required fields.");
      return;
    }
    if (!agreeCommission) {
      setError("Please confirm the commission agreement.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.set("bucket", "buyback-photos");
      files.slice(0, 5).forEach((f) => form.append("files", f));
      const up = await fetch("/api/upload", { method: "POST", body: form });
      const upJson = (await up.json()) as { urls?: string[]; error?: string };
      if (!up.ok || !upJson.urls) {
        setError(upJson.error ?? "Upload failed");
        return;
      }
      const res = await fetch("/api/buybacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          model,
          damage_type: damageType,
          is_locked: false,
          photos: upJson.urls,
          whatsapp,
          estimated_price: estimate,
          commission_percent: commission,
          commission_agreed: false,
        }),
      });
      const result = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || result.error) {
        setError(result.error ?? "Submit failed");
        return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-brand-green/30 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand-green" />
        <h2 className="mt-4 font-display text-2xl font-bold text-brand-blue">
          We&apos;ll contact you within 24 hours!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Estimated range: <strong>{estimate}</strong>. Proposed commission:{" "}
          <strong>{commission}%</strong> (pending admin confirmation). Keep your
          WhatsApp open.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              i === step
                ? "bg-brand-blue text-white"
                : i < step
                  ? "bg-brand-green/15 text-brand-green"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(["Samsung", "Apple"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBrand(b);
                setModel("");
                setStep(1);
              }}
              className={cn(
                "rounded-xl border-2 p-8 text-left transition hover:border-brand-blue",
                brand === b ? "border-brand-blue bg-brand-blue/5" : "border-border"
              )}
            >
              <p className="font-display text-2xl font-bold text-brand-blue">{b}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {b === "Apple" ? "iPhone devices" : "Galaxy & Note devices"}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Label>Select model ({brand})</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {models.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setModel(m);
                  setStep(2);
                }}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-sm font-medium hover:border-brand-blue",
                  model === m
                    ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                    : "border-border"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setStep(0)}>
            Back
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Label htmlFor="damage">Damage type</Label>
          <select
            id="damage"
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
          >
            <option value="">Select damage…</option>
            {DAMAGE_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              disabled={!damageType}
              onClick={() => setStep(3)}
              className="bg-brand-blue"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estimated cash range</p>
            <p className="font-display text-3xl font-bold text-brand-green">
              {estimate}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {brand} · {model} · {damageType}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4 text-left">
            <Label className="text-base font-semibold text-brand-blue">
              Commission agreement
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              DigitalDeals24/7 earns a commission when your phone is resold. Pick
              a proposed rate — admin will confirm or adjust when they contact
              you.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {COMMISSION_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setCommission(rate)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-sm font-semibold transition",
                    commission === rate
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-border bg-white hover:border-brand-blue"
                  )}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-medium text-brand-blue">
              Your proposed commission: {commission}%
            </p>
          </div>

          <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            Final cash offer depends on photos &amp; inspection. Commission is
            part of the buyback/resale deal between you and DigitalDeals24/7.
          </p>

          <div className="flex justify-center gap-2">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="bg-brand-blue">
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Label htmlFor="photos">Upload photos (up to 5)</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 hover:bg-muted/50">
            <Upload className="size-8 text-brand-blue" />
            <span className="mt-2 text-sm text-muted-foreground">
              Tap to choose images
            </span>
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                setPhotoFiles(Array.from(e.target.files ?? []).slice(0, 5));
              }}
            />
          </label>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-16 w-16 rounded-md object-cover"
                />
              ))}
            </div>
          )}
          {files.length > 0 && (
            <p className="text-sm text-brand-green">
              {files.length} photo{files.length > 1 ? "s" : ""} selected
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              disabled={files.length === 0}
              onClick={() => setStep(5)}
              className="bg-brand-blue"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
            <p>
              <span className="text-muted-foreground">Device:</span>{" "}
              <strong>
                {brand} {model}
              </strong>
            </p>
            <p>
              <span className="text-muted-foreground">Estimate:</span>{" "}
              <strong>{estimate}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Proposed commission:</span>{" "}
              <strong>{commission}%</strong>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa">WhatsApp number</Label>
            <Input
              id="wa"
              placeholder="+264 81 …"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4">
            <Checkbox
              id="agree-commission"
              checked={agreeCommission}
              onCheckedChange={(v) => setAgreeCommission(v === true)}
            />
            <Label htmlFor="agree-commission" className="leading-relaxed">
              I propose a <strong>{commission}%</strong> commission for
              DigitalDeals24/7 on this buyback deal, subject to admin confirmation.
            </Label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <Checkbox
              id="unlocked"
              checked={unlocked}
              onCheckedChange={(v) => setUnlocked(v === true)}
            />
            <Label htmlFor="unlocked" className="leading-relaxed">
              I confirm this device is <strong>NOT</strong> iCloud / Google
              locked. We don&apos;t buy locked devices.
            </Label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(4)}>
              Back
            </Button>
            <Button
              disabled={
                submitting || !whatsapp || !unlocked || !agreeCommission
              }
              onClick={onSubmit}
              className="bg-brand-blue"
            >
              {submitting ? "Submitting…" : "Submit offer request"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
