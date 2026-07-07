// Server-only Firebase Admin SDK setup — this is what actually enforces
// /admin access. Never import this from a "use client" component; it holds
// a service account private key and must only ever run on the server.
//
// Distinct from lib/firebase.ts (the public client SDK used for reads
// across the site): that one is safe to expose to the browser, this one
// is not. Follows the same "gracefully unconfigured" convention as the
// rest of the app — if the service account env vars aren't set, every
// helper here just returns/no-ops instead of throwing, and the admin
// login page shows a clear "not configured" message instead of a broken
// form.
import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Service account keys are exported with literal "\n" sequences; env vars
// can't hold real newlines, so this un-escapes them back to a real PEM.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasAllEnvVars = Boolean(projectId && clientEmail && privateKey);

// initializeApp/cert throw synchronously on a malformed key (a very easy
// copy-paste mistake — a missing quote, a mangled newline). Catching this
// means a bad key degrades to "not configured" instead of taking down
// every /admin route with an unhandled module-load error.
let app: App | null = null;
if (hasAllEnvVars) {
  try {
    app = getApps().length ? getApps()[0] : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (error) {
    console.error("Firebase Admin failed to initialize — check FIREBASE_PRIVATE_KEY formatting.", error);
  }
}

export const isFirebaseAdminConfigured = Boolean(app);

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

// The only accounts allowed to reach /admin, even with a valid Firebase
// login — a comma-separated allow-list, defense-in-depth on top of auth.
function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  return allowed.includes(email.toLowerCase());
}

// Exchanges a fresh client-side ID token (from signInWithEmailAndPassword)
// for a long-lived, httpOnly-cookie-friendly session cookie. Throws if the
// token is invalid/expired or the account isn't on the allow-list.
export async function createAdminSessionCookie(idToken: string): Promise<string> {
  if (!app) throw new Error("Firebase Admin isn't configured.");

  const decoded = await getAuth(app).verifyIdToken(idToken);
  if (!isAllowedAdminEmail(decoded.email)) {
    throw new Error("This account isn't authorized for admin access.");
  }

  return getAuth(app).createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
}

// The real security check — verifies the session cookie cryptographically
// against Firebase (not just "does it exist", which is all Middleware can
// cheaply check on the Edge runtime) and re-checks the allow-list, since
// an account could be removed from it after a session was already issued.
export async function verifyAdminSession(sessionCookie: string | undefined): Promise<DecodedIdToken | null> {
  if (!app || !sessionCookie) return null;

  try {
    const decoded = await getAuth(app).verifySessionCookie(sessionCookie, true);
    if (!isAllowedAdminEmail(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}
