import "server-only";
import { cookies } from "next/headers";
import type { Firestore } from "firebase-admin/firestore";
import type { Bucket } from "@google-cloud/storage";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/admin-auth";
import { adminDb, adminBucket, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

// Standard result shape returned by every admin write action, so the client
// managers can surface a success/error toast uniformly.
export type ActionResult = { ok: boolean; error?: string };

// True once the caller holds a valid admin passcode session. Server Actions
// are independently-callable endpoints, so every one of them must re-check
// this itself — never trust that the admin layout already did.
async function hasAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE_NAME)?.value);
}

// The gate every Firestore write action passes through: the caller must (1)
// hold a valid admin passcode session, and (2) the Firebase service account
// must be configured. Returns the Admin Firestore instance on success, or an
// error message to bubble up as a toast.
export async function getAdminDb(): Promise<{ db: Firestore } | { error: string }> {
  if (!(await hasAdminSession())) {
    return { error: "אין הרשאה. יש להתחבר מחדש." };
  }
  if (!isFirebaseAdminConfigured || !adminDb) {
    return { error: "כתיבה למסד הנתונים אינה מוגדרת (חסר חשבון שירות של Firebase)." };
  }
  return { db: adminDb };
}

// Same gate for Storage uploads: valid passcode session + a configured
// Cloud Storage bucket. Returns the Admin SDK bucket, or a toast-ready error.
export async function getAdminBucket(): Promise<{ bucket: Bucket } | { error: string }> {
  if (!(await hasAdminSession())) {
    return { error: "אין הרשאה. יש להתחבר מחדש." };
  }
  if (!adminBucket) {
    return { error: "העלאת תמונות אינה מוגדרת (חסר חשבון שירות או Storage bucket של Firebase)." };
  }
  return { bucket: adminBucket };
}
