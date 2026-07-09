import "server-only";
import { cookies } from "next/headers";
import type { Firestore } from "firebase-admin/firestore";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/admin-auth";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

// Standard result shape returned by every admin write action, so the client
// managers can surface a success/error toast uniformly.
export type ActionResult = { ok: boolean; error?: string };

// The gate every write action passes through: the caller must (1) hold a
// valid admin passcode session, and (2) the Firebase service account must be
// configured. Returns the Admin Firestore instance on success, or an error
// message to bubble up as a toast. Re-checking the session here (not just in
// the layout) is essential — Server Actions are callable endpoints in their
// own right.
export async function getAdminDb(): Promise<{ db: Firestore } | { error: string }> {
  const store = await cookies();
  if (!verifySession(store.get(SESSION_COOKIE_NAME)?.value)) {
    return { error: "אין הרשאה. יש להתחבר מחדש." };
  }
  if (!isFirebaseAdminConfigured || !adminDb) {
    return { error: "כתיבה למסד הנתונים אינה מוגדרת (חסר חשבון שירות של Firebase)." };
  }
  return { db: adminDb };
}
