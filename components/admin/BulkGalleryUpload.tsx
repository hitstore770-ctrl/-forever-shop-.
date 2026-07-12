"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ImageUploadIcon } from "@/components/icons";
import { uploadImage } from "@/lib/upload-actions";
import { createGalleryPhotosBulk } from "@/app/admin/(dashboard)/gallery/actions";
import type { GalleryPhoto } from "@/lib/gallery-data";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
// Cycle display sizes so a bulk batch still looks varied on the photo wall.
const SIZES: GalleryPhoto["size"][] = ["md", "lg", "sm"];

// Client-side compression before upload: shrinks phone/drone photos to a
// web-friendly size, which saves Firebase Storage space and keeps every file
// comfortably under the Server Action body limit.
const COMPRESSION = { maxSizeMB: 1.5, maxWidthOrHeight: 1920, useWebWorker: true };

// Bulk gallery uploader: pick many images at once → each is compressed in the
// browser, uploaded via the existing passcode-gated uploadImage action, and
// then all the resulting docs are created in one batched write. Shows live
// progress and a summary toast; captions can be added per-photo later.
export default function BulkGalleryUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);

  async function handleFiles(files: File[]) {
    setBusy(true);
    setTotal(files.length);
    setDone(0);

    const uploaded: { imageUrl: string; size: GalleryPhoto["size"]; caption: string }[] = [];
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await imageCompression(files[i], COMPRESSION);
        const data = new FormData();
        data.append("file", compressed, compressed.name || files[i].name);
        const res = await uploadImage(data);
        if (res.ok) {
          uploaded.push({ imageUrl: res.url, size: SIZES[i % SIZES.length], caption: "" });
        } else {
          failed++;
        }
      } catch {
        failed++;
      } finally {
        setDone((d) => d + 1);
      }
    }

    if (uploaded.length > 0) {
      const res = await createGalleryPhotosBulk(uploaded);
      if (res.ok) {
        toast.success(`${uploaded.length} תמונות נוספו`, {
          description: failed > 0 ? `${failed} נכשלו ולא נוספו.` : undefined,
        });
        router.refresh();
      } else {
        toast.error("שמירת התמונות נכשלה", { description: res.error });
      }
    } else {
      toast.error("אף תמונה לא הועלתה", { description: "בדקו את הקבצים ונסו שוב." });
    }

    setBusy(false);
    setTotal(0);
    setDone(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        disabled={busy}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void handleFiles(files);
        }}
        className="hidden"
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 border-2 border-black bg-navy-900 px-4 py-2 text-sm font-semibold text-cream uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
      >
        <ImageUploadIcon className="h-4 w-4" />
        {busy ? `מעלה ${done}/${total}...` : "העלאה מרובה"}
      </button>

      {busy && (
        <div className="h-2 w-full max-w-xs border-2 border-black bg-cream" aria-hidden="true">
          <div className="h-full bg-copper-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
