// Server-only Firebase Admin SDK — used exclusively for admin WRITES to
// Firestore (schedule/staff CMS). The Admin SDK bypasses Firestore Security
// Rules, so it must only ever run on the server, behind the passcode gate
// (see the Server Actions that use it). Public reads do NOT go through here
// — they use the client SDK (lib/firebase.ts) governed by the rules.
//
// Distinct from admin authentication: the /admin passcode (lib/admin-auth.ts)
// decides WHO may write; this service account is HOW the write reaches the DB.
// Gracefully unconfigured — if the service-account env vars are missing, the
// write actions no-op with a clear message instead of throwing.
import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Bucket } from "@google-cloud/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Env vars can't hold real newlines; un-escape the "\n" sequences back to a
// real PEM.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
// The Cloud Storage bucket for admin image uploads. Reuses the same public
// bucket the client SDK already knows about (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// e.g. "my-project.appspot.com") — the bucket name isn't a secret; the service
// account above is what authorizes the writes.
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const hasAllEnvVars = Boolean(projectId && clientEmail && privateKey);

// cert()/initializeApp() throw synchronously on a malformed key — catch it so
// a bad key degrades to "not configured" instead of crashing the admin CMS.
let app: App | null = null;
if (hasAllEnvVars) {
  try {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), storageBucket });
  } catch (error) {
    console.error("Firebase Admin failed to initialize — check FIREBASE_PRIVATE_KEY formatting.", error);
  }
}

export const isFirebaseAdminConfigured = Boolean(app);
export const adminDb: Firestore | null = app ? getFirestore(app) : null;

// The default Storage bucket, or null if either the Admin SDK isn't configured
// or no bucket name was provided. getStorage().bucket() only throws lazily on
// use when unnamed, so we gate on `storageBucket` here to keep it null-safe.
export const adminBucket: Bucket | null = app && storageBucket ? getStorage(app).bucket() : null;
