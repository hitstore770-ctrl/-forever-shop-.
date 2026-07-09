"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";

export type ScheduleInput = {
  time: string;
  title: string;
  subtext: string;
  order: number;
};

// Revalidate both the public schedule (/join) and the admin tab so a change
// shows everywhere on the next request.
function revalidateSchedule() {
  revalidatePath("/join");
  revalidatePath("/admin/schedule");
}

export async function createScheduleItem(input: ScheduleInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("schedule").add({
      time: input.time.trim(),
      title: input.title.trim(),
      subtext: input.subtext.trim(),
      order: Number(input.order) || 0,
    });
    revalidateSchedule();
    return { ok: true };
  } catch (error) {
    console.error("createScheduleItem failed", error);
    return { ok: false, error: "שמירת הפריט נכשלה." };
  }
}

export async function updateScheduleItem(id: string, input: ScheduleInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("schedule").doc(id).update({
      time: input.time.trim(),
      title: input.title.trim(),
      subtext: input.subtext.trim(),
      order: Number(input.order) || 0,
    });
    revalidateSchedule();
    return { ok: true };
  } catch (error) {
    console.error("updateScheduleItem failed", error);
    return { ok: false, error: "עדכון הפריט נכשל." };
  }
}

export async function deleteScheduleItem(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("schedule").doc(id).delete();
    revalidateSchedule();
    return { ok: true };
  } catch (error) {
    console.error("deleteScheduleItem failed", error);
    return { ok: false, error: "מחיקת הפריט נכשלה." };
  }
}
