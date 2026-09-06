import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jar = await cookies();
  const authed = jar.get("dd247_admin")?.value === "1";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue">
        Admin dashboard
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Inventory &amp; buyback management. Default password:{" "}
        <code className="rounded bg-muted px-1">admin123</code>
      </p>
      <div className="mt-8">
        <AdminPanel authed={authed} />
      </div>
    </div>
  );
}
