// Server-only admin authentication via a single shared passcode set in the
// environment (SITE_PASSCODE) — designed so the admin can change the
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
//  - SITE_PASSCODE is a SERVER-ONLY var (never NEXT_PUBLIC_*), so the
//    passcode is never shipped to the browser bundle.
//  - On a correct passcode we set an httpOnly cookie holding an HMAC token
//    derived FROM the passcode — unforgeable without the code, and rotating
//    the code instantly invalidates every existing session.
//  - All comparisons are constant-time (timingSafeEqual over SHA-256).
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

// Google sign-in allow-list. Only these email addresses may exchange a Google
// ID token for an admin session. Defaults to the owner's address; override
// with ADMIN_ALLOWED_EMAILS (comma-separated) if the team ever grows. Not a
// secret — it's just an email — so it's safe to default in code (no extra
// Vercel var required).
const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_ALLOWED_EMAILS ?? "hitstore770@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

// Is this (verified) Google email permitted to hold an admin session?
export function isEmailAllowed(email: string | undefined): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// Read the passcode fresh from the environment on every call (see the
// module comment above for why this must not be a top-level const).
//
// TEMPORARY — the "yyh770mmh" fallback is a disposable throwaway code added
// only to work around a Vercel project-domain env-linking issue where the
// Production domain wasn't receiving SITE_PASSCODE. REMOVE this fallback once
// the Vercel env var is delivering correctly, and rotate the real passcode —
// this temporary value is now in git history permanently.
function accessCode(): string | undefined {
  // .trim() guards against a stray trailing space/newline in the env value —
  // a very common result of pasting the passcode into a dashboard on mobile,
  // which would otherwise make a correct-looking passcode silently mismatch.
  return process.env.SITE_PASSCODE?.trim() || "yyh770mmh";
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

// Does the submitted passcode match SITE_PASSCODE?
export function checkAccessCode(input: string): boolean {
  const code = accessCode();
  if (!code) return false;
  // Trim the submitted code too, symmetric with the trimmed env value above.
  return safeEqual(input.trim(), code);
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
