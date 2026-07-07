import { NextResponse, type NextRequest } from "next/server";

// Cheap "is there even a session cookie" check — not the real security
// boundary. Next.js 16 runs proxy.ts on Node.js (not the old Edge-only
// Middleware runtime), but the framework still recommends keeping this
// file to lightweight network-level checks and pushing anything heavier
// (like verifying a session cryptographically against Firebase) into a
// Route Handler or Server Component's data-access layer — which is what
// app/admin/(dashboard)/layout.tsx does; that's the actual gate.
const SESSION_COOKIE_NAME = "admin_session";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
