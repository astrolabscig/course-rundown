import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, isDbConfigured } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { useful, comment } = (body ?? {}) as {
    useful?: unknown;
    comment?: unknown;
  };

  if (useful !== "yes" && useful !== "no") {
    return NextResponse.json({ error: "useful must be 'yes' or 'no'" }, { status: 400 });
  }
  if (comment !== undefined && typeof comment !== "string") {
    return NextResponse.json({ error: "comment must be a string" }, { status: 400 });
  }

  if (!isDbConfigured()) {
    console.warn("POSTGRES_URL not set — skipping /api/feedback write");
    return NextResponse.json({ ok: true });
  }

  const userAgent = req.headers.get("user-agent") ?? "";

  try {
    await ensureTables();
    await sql`
      INSERT INTO feedback (useful, comment, user_agent)
      VALUES (${useful}, ${comment ?? null}, ${userAgent})
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save feedback", err);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
