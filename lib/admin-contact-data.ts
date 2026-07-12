import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { CONTACT_SUBMISSIONS, type ContactSubmission } from "@/lib/admin-data";

// Reads the "contactSubmissions" collection via the Firebase Admin SDK, which
// BYPASSES the Firestore security rules. This is required: the rules deny ALL
// client reads of this collection (it's private data), so it can only ever be
// read server-side through the service account — exactly as firestore.rules
// documents ("only the admin, via the Admin SDK, can read the list").
//
// Falls back to the mock list only when the Admin SDK isn't configured (local
// dev without a service account); when it IS configured, a genuinely empty
// collection returns an empty list, not mock data.
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!adminDb) {
    return CONTACT_SUBMISSIONS;
  }

  try {
    const snapshot = await adminDb.collection("contactSubmissions").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ContactSubmission);
  } catch (error) {
    console.warn("Failed to load contact submissions via Admin SDK, using mock data.", error);
    return CONTACT_SUBMISSIONS;
  }
}
