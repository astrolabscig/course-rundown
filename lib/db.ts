import { sql } from "@vercel/postgres";

export function isDbConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

let tablesReady: Promise<void> | null = null;

async function createTables(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id         SERIAL PRIMARY KEY,
      useful     TEXT NOT NULL,
      comment    TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS app_access (
      id         SERIAL PRIMARY KEY,
      session_id TEXT UNIQUE NOT NULL,
      interacted BOOLEAN NOT NULL DEFAULT FALSE,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

// Runs CREATE TABLE IF NOT EXISTS once per server instance lifetime.
export async function ensureTables(): Promise<void> {
  if (!isDbConfigured()) return;
  if (!tablesReady) {
    tablesReady = createTables();
  }
  await tablesReady;
}

export { sql };
