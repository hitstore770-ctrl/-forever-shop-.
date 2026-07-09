"use server";

import { randomUUID } from "node:crypto";
import { getAdminBucket } from "@/lib/admin-actions";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

// Accepted image types and the 5 MB ceiling. Enforced here on the server (the
// client component checks too, but that's only for fast UX feedback — this is
// the boundary that actually matters).
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

// Turn an original filename into a short, storage-safe slug (keep the
// extension, strip everything unusual). Falls back to "image".
function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase();
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
  return ext ? `${slug}.${ext}` : slug;
}

// Uploads a single image to Firebase Storage from the admin CMS and returns a
// permanent, publicly-fetchable download URL to store on the Firestore doc.
//
// Security: gated behind the admin passcode session (getAdminBucket) and runs
// only on the server via the Admin SDK — which is why Storage rules can deny
// all direct client writes. We attach a Firebase download token to the object
// so the returned URL works forever regardless of the bucket's public-access
// settings (no makePublic(), no short-lived signed URLs).
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const guard = await getAdminBucket();
  if ("error" in guard) return { ok: false, error: guard.error };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "לא נבחר קובץ תמונה." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "סוג קובץ לא נתמך. יש להעלות תמונה (JPG, PNG, WEBP, GIF)." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "הקובץ גדול מדי. הגודל המרבי הוא 5MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const token = randomUUID();
    const objectPath = `uploads/${Date.now()}-${safeName(file.name)}`;
    const object = guard.bucket.file(objectPath);

    await object.save(buffer, {
      resumable: false,
      contentType: file.type,
      metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${guard.bucket.name}/o/${encodeURIComponent(
      objectPath,
    )}?alt=media&token=${token}`;
    return { ok: true, url };
  } catch (error) {
    console.error("uploadImage failed", error);
    return { ok: false, error: "העלאת התמונה נכשלה. נסו שוב." };
  }
}
