import "server-only";
import { adminDb } from "@/lib/firebase-admin";

// RSVP entries ("אישורי הגעה"). This collection is private: the Firestore
// rules deny all client reads, so these admin reads go through the Admin SDK
// (service account), which bypasses the rules — same model as contact
// submissions.

export type RsvpEntry = {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  attendees: number;
  createdAt: number;
};

// Total confirmed attendees per event (sum of `attendees`), used to show
// remaining capacity on the public events board. Empty map when the Admin SDK
// isn't configured.
export async function getRsvpTakenByEvent(): Promise<Record<string, number>> {
  if (!adminDb) return {};
  try {
    const snapshot = await adminDb.collection("rsvps").get();
    const taken: Record<string, number> = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const eventId = String(data.eventId ?? "");
      const attendees = Number(data.attendees ?? 1);
      if (eventId) taken[eventId] = (taken[eventId] ?? 0) + (attendees > 0 ? attendees : 1);
    });
    return taken;
  } catch (error) {
    console.warn("getRsvpTakenByEvent failed", error);
    return {};
  }
}

// All RSVPs grouped by eventId (newest first within each group), for the admin
// participant list.
export async function getRsvpsGroupedByEvent(): Promise<Record<string, RsvpEntry[]>> {
  if (!adminDb) return {};
  try {
    const snapshot = await adminDb.collection("rsvps").orderBy("createdAt", "desc").get();
    const grouped: Record<string, RsvpEntry[]> = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const entry: RsvpEntry = {
        id: doc.id,
        eventId: String(data.eventId ?? ""),
        name: String(data.name ?? ""),
        phone: String(data.phone ?? ""),
        attendees: Number(data.attendees ?? 1),
        createdAt: Number(data.createdAt ?? 0),
      };
      (grouped[entry.eventId] ??= []).push(entry);
    });
    return grouped;
  } catch (error) {
    console.warn("getRsvpsGroupedByEvent failed", error);
    return {};
  }
}
