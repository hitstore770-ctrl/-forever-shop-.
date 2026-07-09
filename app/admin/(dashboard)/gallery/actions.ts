"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, type ActionResult } from "@/lib/admin-actions";
import type { GalleryPhoto } from "@/lib/gallery-data";

export type GalleryInput = {
  caption: string;
  size: GalleryPhoto["size"];
  imageUrl: string;
};

// Revalidate the public gallery plus the admin tab.
function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryPhoto(input: GalleryInput): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  if (!input.imageUrl.trim()) return { ok: false, error: "יש להעלות תמונה תחילה." };
  try {
    await guard.db.collection("gallery").add({
      caption: input.caption.trim(),
      size: input.size,
      imageUrl: input.imageUrl.trim(),
      // Auto-assigned; the public gallery sorts by this descending so the
      // newest photo shows first.
      order: Date.now(),
    });
    revalidateGallery();
    return { ok: true };
  } catch (error) {
    console.error("createGalleryPhoto failed", error);
    return { ok: false, error: "שמירת התמונה נכשלה." };
  }
}

export async function deleteGalleryPhoto(id: string): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await guard.db.collection("gallery").doc(id).delete();
    revalidateGallery();
    return { ok: true };
  } catch (error) {
    console.error("deleteGalleryPhoto failed", error);
    return { ok: false, error: "מחיקת התמונה נכשלה." };
  }
}
