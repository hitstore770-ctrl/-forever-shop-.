// Server-only admin authentication via a single shared passcode set in the
// environment (ADMIN_ACCESS_CODE) — designed so the admin can change the
// passcode straight from Vercel's Environment Variables without a code
// change or redeploy of the source.
//
// Security notes:
//  - ADMIN_ACCESS_CODE is a SERVER-ONLY var (never NEXT_PUBLIC_*), so the
//    passcode is never shipped to the browser bundle. All comparison happens
//    here, on the server.
//  - The login form doesn't get a persistent cookie of the passcode itself.
//    Instead, on a correct passcode we set an httpOnly cookie holding an
//    HMAC token derived FROM the passcode. The cookie can't be forged
//    without knowing the code, and because the token is keyed by the code,
//    rotating ADMIN_ACCESS_CODE in Vercel instantly invalidates every
//    existing session.
//  - All comparisons are constant-time (timingSafeEqual over SHA-256
//    digests) to avoid leaking the code via timing.
//
// This is a shared-secret model (one code, no per-user accounts) — simpler
// to operate than per-user auth, at the cost of no individual revocation.
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE;

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

// True once a passcode is configured. The login page shows a clear
// "not configured" message instead of a broken form when this is false.
export const isAdminConfigured = Boolean(ADMIN_ACCESS_CODE && ADMIN_ACCESS_CODE.length > 0);

// Constant-time string comparison. Hashing both sides to a fixed-length
// digest first means the comparison never throws on length mismatch and
// doesn't leak the code's length.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

// Does the submitted passcode match ADMIN_ACCESS_CODE?
export function checkAccessCode(input: string): boolean {
  if (!ADMIN_ACCESS_CODE) return false;
  return safeEqual(input, ADMIN_ACCESS_CODE);
}

// The value stored in the session cookie: an HMAC over a fixed payload,
// keyed by the current passcode. Unforgeable without the code, and tied to
// it (rotate the code -> all sessions invalid).
function sessionToken(): string {
  if (!ADMIN_ACCESS_CODE) return "";
  return createHmac("sha256", ADMIN_ACCESS_CODE).update("admin-session-v1").digest("hex");
}

export function createSessionToken(): string {
  return sessionToken();
}

// Is this cookie value a valid session for the current passcode?
export function verifySession(cookieValue: string | undefined): boolean {
  if (!isAdminConfigured || !cookieValue) return false;
  return safeEqual(cookieValue, sessionToken());
}
