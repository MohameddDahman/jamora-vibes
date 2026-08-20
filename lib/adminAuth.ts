// lib/adminAuth.ts
//
// Server-only by convention (not enforced via the `server-only` package,
// since this module is also imported from proxy.ts, which compiles
// separately from the rest of the app) — never import this from a
// "use client" component.
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "jamora_admin_session";

// A fixed, secret-derived token — not tied to the password itself, so
// verifying a session never needs to touch (or leak) the password.
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set. Add it to .env.local.");
  }
  return secret;
}

export function computeAdminSessionToken(): string {
  return createHmac("sha256", getSecret()).update("jamora-admin-authenticated").digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isValidAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    return timingSafeStringEqual(token, computeAdminSessionToken());
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local.");
  }
  if (!password) return false;
  return timingSafeStringEqual(password, expected);
}
