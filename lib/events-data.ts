import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// Upcoming events / gatherings (אירועים). Reads come from the Firestore
// "events" collection via the client SDK (public read); writes (create/edit/
// delete, incl. cover-image upload) happen server-side through the admin SDK
// behind the passcode gate (see the events Server Actions). Falls back to the
// seed list below whenever Firebase isn't configured or the collection is
// empty.
//
// `order` is auto-assigned (not a CMS field) so newly-added events sort to the
// end of the board in a stable, predictable sequence.

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  order?: number;
  // RSVP: when enabled, the public events page shows an "אישור הגעה" form.
  // capacity is the total number of seats (0/undefined = unlimited).
  rsvpEnabled?: boolean;
  capacity?: number;
};

// Seed = the previously hardcoded events, ready to import into Firestore.
export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: "1", title: "התוועדות שבועית", date: "כל מוצ״ש · 21:00", description: "ניגונים, דברי תורה וכיבוד קל." },
  { id: "2", title: "טיול שנתי", date: "כ״ה תשרי", description: "יום מלא בטבע לכל תלמידי הישיבה." },
  { id: "3", title: "יום גיבוש", date: "י״ב חשון", description: "פעילויות גיבוש וספורט לתמימים." },
  { id: "4", title: "ערב הוקרה", date: "ג׳ כסלו", description: "ערב מיוחד לתורמים ולידידי הישיבה." },
];

// Reads the events from Firestore, ordered by `order`. Falls back to the seed
// list if Firebase isn't configured, the collection is empty, or the read
// fails.
export async function getEvents(): Promise<UpcomingEvent[]> {
  if (!isFirebaseConfigured || !db) {
    return UPCOMING_EVENTS;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "events"), orderBy("order", "asc")));
    if (snapshot.empty) return UPCOMING_EVENTS;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UpcomingEvent);
  } catch (error) {
    console.warn("Failed to load events from Firestore, using seed data.", error);
    return UPCOMING_EVENTS;
  }
}
