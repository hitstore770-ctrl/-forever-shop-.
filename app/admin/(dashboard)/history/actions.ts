"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";

export type MilestoneInput = {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
};

// Revalidate the public About page (where the timeline lives) plus the admin tab.
function revalidateHistory() {
  revalidatePath("/yeshiva");
  revalidatePath("/admin/history");
}

export async function createMilestone(input: MilestoneInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("history").add({
      year: input.year.trim(),
      title: input.title.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      // Auto-assigned so new milestones sort to the end of the timeline.
      order: Date.now(),
    });
    revalidateHistory();
    return { ok: true };
  } catch (error) {
    console.error("createMilestone failed", error);
    return { ok: false, error: "שמירת האבן דרך נכשלה." };
  }
}

export async function updateMilestone(id: string, input: MilestoneInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("history").doc(id).update({
      year: input.year.trim(),
      title: input.title.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
    });
    revalidateHistory();
    return { ok: true };
  } catch (error) {
    console.error("updateMilestone failed", error);
    return { ok: false, error: "עדכון האבן דרך נכשל." };
  }
}

export async function deleteMilestone(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("history").doc(id).delete();
    revalidateHistory();
    return { ok: true };
  } catch (error) {
    console.error("deleteMilestone failed", error);
    return { ok: false, error: "מחיקת האבן דרך נכשלה." };
  }
}
