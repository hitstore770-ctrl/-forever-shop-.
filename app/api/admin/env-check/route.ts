import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/admin-auth";
import { isFirebaseAdminConfigured, adminBucket } from "@/lib/firebase-admin";

// Read fresh at request time — never cached/prerendered — so it reflects the
// real Production runtime environment.
export const dynamic = "force-dynamic";

// TEMPORARY diagnostic — reports WHICH env vars the live runtime can actually
// see, to pin down why Vercel Production is (or isn't) delivering them.
//
// Safety: gated behind the admin passcode session, and it returns ONLY
// booleans/lengths — never a single character of any secret value. Remove
// this route (and the SITE_PASSCODE hardcoded fallback) once the env vars are
// confirmed to load in Production.
export async function GET() {
  const store = await cookies();
  if (!verifySession(store.get(SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "אין הרשאה. יש להתחבר מחדש." }, { status: 401 });
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return NextResponse.json({
    // Is each variable present (non-empty) in the runtime environment?
    present: {
      SITE_PASSCODE: Boolean(process.env.SITE_PASSCODE),
      FIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_CLIENT_EMAIL: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
      FIREBASE_PRIVATE_KEY: Boolean(privateKey),
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
      NEXT_PUBLIC_FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    },
    // Private-key shape checks — no content, just enough to catch the common
    // "pasted wrong / truncated / surrounded by quotes" formatting mistakes.
    privateKeyShape: {
      length: privateKey?.length ?? 0,
      hasBeginMarker: privateKey?.includes("BEGIN PRIVATE KEY") ?? false,
      hasEndMarker: privateKey?.includes("END PRIVATE KEY") ?? false,
      hasEscapedNewlines: privateKey?.includes("\\n") ?? false,
      hasRealNewlines: privateKey?.includes("\n") ?? false,
    },
    // Derived results: did the Admin SDK actually initialize, and is the
    // Storage bucket ready? These being false while `present` is all true
    // points at a value/formatting problem rather than a missing var.
    derived: {
      isFirebaseAdminConfigured,
      storageBucketReady: adminBucket !== null,
    },
  });
}
