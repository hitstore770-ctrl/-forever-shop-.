import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAdminSessionCookie,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/firebase-admin";

// Exchanges a Firebase client-side ID token for an httpOnly admin session
// cookie. This is the one and only place that actually decides whether a
// login attempt succeeds — the login form itself just calls Firebase Auth
// and hands the resulting token here.
export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json({ error: "Firebase Admin אינו מוגדר בשרת." }, { status: 503 });
  }

  let body: { idToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  if (!body.idToken) {
    return NextResponse.json({ error: "חסר טוקן התחברות" }, { status: 400 });
  }

  try {
    const sessionCookie = await createAdminSessionCookie(body.idToken);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "אין הרשאה לחשבון זה." }, { status: 401 });
  }
}

// Logout — clears the session cookie.
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
