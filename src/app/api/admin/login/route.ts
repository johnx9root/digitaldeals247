import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "dd247_admin";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  if (body.password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function GET() {
  const jar = await cookies();
  return NextResponse.json({ authed: jar.get(COOKIE)?.value === "1" });
}
