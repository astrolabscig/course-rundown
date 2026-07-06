import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { password } = (body ?? {}) as { password?: unknown };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (typeof password !== "string" || !adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const submitted = Buffer.from(password);
  const expected = Buffer.from(adminPassword);

  const match =
    submitted.length === expected.length &&
    crypto.timingSafeEqual(submitted, expected);

  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
