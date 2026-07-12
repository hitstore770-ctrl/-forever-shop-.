"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";

export type EventInput = {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  rsvpEnabled: boolean;
  capacity: number;
};

// Revalidate the public events board plus the admin tab.
function revalidateEvents() {
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function createEvent(input: EventInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("events").add({
      title: input.title.trim(),
      date: input.date.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      rsvpEnabled: input.rsvpEnabled,
      capacity: Math.max(0, Math.floor(input.capacity) || 0),
      // Auto-assigned so new events sort to the end of the board.
      order: Date.now(),
    });
    revalidateEvents();
    return { ok: true };
  } catch (error) {
    console.error("createEvent failed", error);
    return { ok: false, error: "שמירת האירוע נכשלה." };
  }
}

export async function updateEvent(id: string, input: EventInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("events").doc(id).update({
      title: input.title.trim(),
      date: input.date.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      rsvpEnabled: input.rsvpEnabled,
      capacity: Math.max(0, Math.floor(input.capacity) || 0),
    });
    revalidateEvents();
    return { ok: true };
  } catch (error) {
    console.error("updateEvent failed", error);
    return { ok: false, error: "עדכון האירוע נכשל." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("events").doc(id).delete();
    revalidateEvents();
    return { ok: true };
  } catch (error) {
    console.error("deleteEvent failed", error);
    return { ok: false, error: "מחיקת האירוע נכשלה." };
  }
}
