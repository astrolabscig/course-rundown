// Uses the Web Crypto API (globalThis.crypto) rather than Node's `crypto` module
// so the same code runs in middleware (Edge runtime), API routes, and server
// components without a runtime-specific branch.

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

interface SessionPayload {
  iat: number;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createAdminSessionToken(): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = { iat: now, exp: now + SESSION_DURATION_MS };
  const payloadB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const signatureB64 = base64urlEncode(new Uint8Array(signature));

  return `${payloadB64}.${signatureB64}`;
}

export async function verifyAdminSession(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) return false;

  try {
    const key = await getHmacKey();
    const signatureBytes = base64urlDecode(signatureB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return false;

    const payload: SessionPayload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(payloadB64))
    );
    return typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}
