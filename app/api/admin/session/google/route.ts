import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSessionToken,
  isEmailAllowed,
  isAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/admin-auth";
import { adminAuth } from "@/lib/firebase-admin";

// Exchanges a Google sign-in ID token for an admin session cookie — but ONLY
// for an allow-listed email. The token is verified server-side with the
// Firebase Admin SDK (signature, expiry, issuing project), so a forged or
// third-party token is rejected before we ever trust the email inside it.
//
// On success we set the same httpOnly session cookie the passcode flow uses,
// so the rest of the admin gate (layout + Server Actions) is unchanged.
export async function POST(request: Request) {
  if (!adminAuth) {
    return NextResponse.json({ error: "כניסת גוגל אינה מוגדרת בשרת." }, { status: 503 });
  }
  // The session cookie is HMAC-keyed by the passcode, so a passcode must still
  // be configured for tokens to be mintable.
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "התחברות אינה מוגדרת בשרת." }, { status: 503 });
  }

  let body: { idToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  if (typeof body.idToken !== "string" || body.idToken.length === 0) {
    return NextResponse.json({ error: "חסר אסימון התחברות" }, { status: 400 });
  }

  let email: string | undefined;
  let emailVerified = false;
  try {
    const decoded = await adminAuth.verifyIdToken(body.idToken);
    email = decoded.email;
    emailVerified = decoded.email_verified ?? false;
  } catch {
    return NextResponse.json({ error: "אימות ההתחברות נכשל" }, { status: 401 });
  }

  if (!emailVerified || !isEmailAllowed(email)) {
    return NextResponse.json({ error: "חשבון הגוגל הזה אינו מורשה לניהול האתר." }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
  return NextResponse.json({ success: true });
}
