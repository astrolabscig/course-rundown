import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, isDbConfigured } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, event } = (body ?? {}) as {
    sessionId?: unknown;
    event?: unknown;
  };

  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  if (event !== "open" && event !== "interact") {
    return NextResponse.json({ error: "event must be 'open' or 'interact'" }, { status: 400 });
  }

  if (!isDbConfigured()) {
    console.warn("POSTGRES_URL not set — skipping /api/track write");
    return NextResponse.json({ ok: true });
  }

  const userAgent = req.headers.get("user-agent") ?? "";

  try {
    await ensureTables();

    if (event === "open") {
      await sql`
        INSERT INTO app_access (session_id, user_agent)
        VALUES (${sessionId}, ${userAgent})
        ON CONFLICT (session_id) DO NOTHING
      `;
    } else {
      await sql`
        UPDATE app_access SET interacted = TRUE WHERE session_id = ${sessionId}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to record tracking event", err);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
