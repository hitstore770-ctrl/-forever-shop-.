"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";

export type RsvpInput = { name: string; phone: string; attendees: number };
export type RsvpResult = { ok: true } | { ok: false; error: string };

// PUBLIC action: anyone can confirm attendance to an RSVP-enabled event. Runs
// server-side via the Admin SDK so it can enforce capacity (clients can't read
// the private rsvps collection). Validates input and re-checks the seat count
// authoritatively before writing.
//
// The capacity check is best-effort (not transactional) — fine for the low
// concurrency of a yeshiva event; a rare over-fill is acceptable.
export async function submitRsvp(eventId: string, input: RsvpInput): Promise<RsvpResult> {
  if (!adminDb) return { ok: false, error: "אישורי הגעה אינם זמינים כרגע." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  const attendees = Math.max(1, Math.min(50, Math.floor(input.attendees) || 1));
  if (!eventId) return { ok: false, error: "אירוע לא תקין." };
  if (!name || !phone) return { ok: false, error: "יש למלא שם וטלפון." };

  try {
    const eventSnap = await adminDb.collection("events").doc(eventId).get();
    if (!eventSnap.exists) return { ok: false, error: "האירוע לא נמצא." };
    const event = eventSnap.data() as { rsvpEnabled?: boolean; capacity?: number };
    if (!event.rsvpEnabled) return { ok: false, error: "אישורי הגעה סגורים לאירוע זה." };

    const capacity = Math.max(0, Number(event.capacity ?? 0));
    if (capacity > 0) {
      const existing = await adminDb.collection("rsvps").where("eventId", "==", eventId).get();
      let taken = 0;
      existing.docs.forEach((doc) => {
        taken += Number(doc.data().attendees ?? 1);
      });
      if (taken + attendees > capacity) {
        const left = Math.max(0, capacity - taken);
        return { ok: false, error: left > 0 ? `נותרו רק ${left} מקומות פנויים.` : "האירוע מלא." };
      }
    }

    await adminDb.collection("rsvps").add({ eventId, name, phone, attendees, createdAt: Date.now() });
    revalidatePath("/events");
    revalidatePath("/admin/rsvps");
    return { ok: true };
  } catch (error) {
    console.error("submitRsvp failed", error);
    return { ok: false, error: "שליחת האישור נכשלה. נסו שוב." };
  }
}

// ADMIN action: remove an RSVP (e.g. a cancellation). Passcode-gated.
export async function deleteRsvp(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("rsvps").doc(id).delete();
    revalidatePath("/admin/rsvps");
    revalidatePath("/events");
    return { ok: true };
  } catch (error) {
    console.error("deleteRsvp failed", error);
    return { ok: false, error: "מחיקת האישור נכשלה." };
  }
}
