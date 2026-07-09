import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkAccessCode,
  createSessionToken,
  isAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/admin-auth";

// Exchanges a correct admin passcode for an httpOnly session cookie. This
// is the one and only place a login attempt is decided — the passcode is
// compared here, on the server, against ADMIN_ACCESS_CODE.
export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "קוד הגישה אינו מוגדר בשרת." }, { status: 503 });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  if (typeof body.code !== "string" || body.code.length === 0) {
    return NextResponse.json({ error: "חסר קוד גישה" }, { status: 400 });
  }

  if (!checkAccessCode(body.code)) {
    return NextResponse.json({ error: "קוד גישה שגוי" }, { status: 401 });
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

// Logout — clears the session cookie.
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
