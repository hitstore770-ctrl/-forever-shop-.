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

// Creates many gallery photos in a single batched write — used by the bulk
// uploader, which has already uploaded each (client-compressed) image and just
// needs the resulting docs created. Ordered so the batch lands after existing
// photos, preserving selection order.
export async function createGalleryPhotosBulk(inputs: GalleryInput[]): Promise<ActionResult> {
  const guard = await getAdminDb();
  if ("error" in guard) return { ok: false, error: guard.error };

  const valid = inputs.filter((input) => input.imageUrl.trim());
  if (valid.length === 0) return { ok: false, error: "לא הועלו תמונות." };

  try {
    const batch = guard.db.batch();
    const base = Date.now();
    valid.forEach((input, i) => {
      const ref = guard.db.collection("gallery").doc();
      batch.set(ref, {
        caption: input.caption.trim(),
        size: input.size,
        imageUrl: input.imageUrl.trim(),
        order: base + i,
      });
    });
    await batch.commit();
    revalidateGallery();
    return { ok: true };
  } catch (error) {
    console.error("createGalleryPhotosBulk failed", error);
    return { ok: false, error: "שמירת התמונות נכשלה." };
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
