// Server-only admin authentication via a single shared passcode set in the
// environment (ADMIN_ACCESS_CODE) — designed so the admin can change the
// passcode straight from Vercel's Environment Variables without a code
// change or redeploy of the source.
//
// IMPORTANT: the passcode is read via accessCode() at CALL TIME, never
// captured into a module-level constant. A top-level `process.env.X` const
// would be frozen whenever the module is first evaluated — including during
// `next build`'s static prerender — which baked a stale "not configured"
// value into the statically generated /admin/login page. Reading it inside
// each function (combined with `export const dynamic = "force-dynamic"` on
// the login page) guarantees the live runtime env value is used.
//
// Security notes:
//  - ADMIN_ACCESS_CODE is a SERVER-ONLY var (never NEXT_PUBLIC_*), so the
//    passcode is never shipped to the browser bundle.
//  - On a correct passcode we set an httpOnly cookie holding an HMAC token
//    derived FROM the passcode — unforgeable without the code, and rotating
//    the code instantly invalidates every existing session.
//  - All comparisons are constant-time (timingSafeEqual over SHA-256).
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

// Read the passcode fresh from the environment on every call (see the
// module comment above for why this must not be a top-level const).
function accessCode(): string | undefined {
  return process.env.ADMIN_ACCESS_CODE;
}

// True once a passcode is configured. A FUNCTION (not a const) so callers
// evaluate it at request time — the login page shows a "not configured"
// message only when the passcode is genuinely absent at runtime.
export function isAdminConfigured(): boolean {
  const code = accessCode();
  return Boolean(code && code.length > 0);
}

// Constant-time string comparison over fixed-length SHA-256 digests (never
// throws on length mismatch, doesn't leak length).
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

// Does the submitted passcode match ADMIN_ACCESS_CODE?
export function checkAccessCode(input: string): boolean {
  const code = accessCode();
  if (!code) return false;
  return safeEqual(input, code);
}

// The session cookie value: an HMAC over a fixed payload, keyed by the
// current passcode. Unforgeable without the code, and tied to it.
function sessionToken(): string {
  const code = accessCode();
  if (!code) return "";
  return createHmac("sha256", code).update("admin-session-v1").digest("hex");
}

export function createSessionToken(): string {
  return sessionToken();
}

// Is this cookie value a valid session for the current passcode?
export function verifySession(cookieValue: string | undefined): boolean {
  if (!isAdminConfigured() || !cookieValue) return false;
  return safeEqual(cookieValue, sessionToken());
}
