"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";

export type StaffInput = {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
};

// Revalidate every public surface that renders staff (/contact, /yeshiva)
// plus the admin tab.
function revalidateStaff() {
  revalidatePath("/contact");
  revalidatePath("/yeshiva");
  revalidatePath("/admin/staff");
}

export async function createStaff(input: StaffInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("staff").add({
      name: input.name.trim(),
      role: input.role.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      // Auto-assigned so new members sort to the end of the list.
      order: Date.now(),
    });
    revalidateStaff();
    return { ok: true };
  } catch (error) {
    console.error("createStaff failed", error);
    return { ok: false, error: "שמירת איש הצוות נכשלה." };
  }
}

export async function updateStaff(id: string, input: StaffInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("staff").doc(id).update({
      name: input.name.trim(),
      role: input.role.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
    });
    revalidateStaff();
    return { ok: true };
  } catch (error) {
    console.error("updateStaff failed", error);
    return { ok: false, error: "עדכון איש הצוות נכשל." };
  }
}

export async function deleteStaff(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("staff").doc(id).delete();
    revalidateStaff();
    return { ok: true };
  } catch (error) {
    console.error("deleteStaff failed", error);
    return { ok: false, error: "מחיקת איש הצוות נכשלה." };
  }
}
