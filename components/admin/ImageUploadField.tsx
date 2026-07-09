"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageUploadIcon, TrashIcon } from "@/components/icons";
import { uploadImage } from "@/lib/upload-actions";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";

// Reusable admin image picker. Uploads the chosen file to Firebase Storage
// (server-side, via the passcode-gated uploadImage action) as soon as it's
// selected, then reports the resulting permanent URL back through onChange so
// the parent form can save it to Firestore alongside the rest of the document.
//
// Shows an "מעלה..." (Uploading...) state while in flight and toasts on error.
// A manual URL field stays available too, so an existing external image URL
// can still be pasted without uploading anything.
export default function ImageUploadField({
  value,
  onChange,
  disabled = false,
  label = "תמונה",
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("סוג קובץ לא נתמך", { description: "יש לבחור קובץ תמונה." });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("הקובץ גדול מדי", { description: "הגודל המרבי הוא 5MB." });
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await uploadImage(data);
      if (res.ok) {
        onChange(res.url);
        toast.success("התמונה הועלתה");
      } else {
        toast.error("העלאה נכשלה", { description: res.error });
      }
    } catch {
      toast.error("העלאה נכשלה", { description: "משהו השתבש. נסו שוב." });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = disabled || isUploading;

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-navy-950 uppercase">{label}</label>

      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-navy-900">
            {/* Arbitrary uploaded/external URL — a native lazy <img> avoids
                next/image's per-host allow-list. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="תצוגה מקדימה" loading="lazy" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-dashed border-navy-900/40 bg-cream text-navy-900/40">
            <ImageUploadIcon className="h-6 w-6" />
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
          className="hidden"
          id="image-upload-input"
        />

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <ImageUploadIcon className="h-4 w-4" />
          {isUploading ? "מעלה..." : value ? "החלפת תמונה" : "העלאת תמונה"}
        </button>

        {value && !isUploading && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChange("")}
            aria-label="הסרת התמונה"
            className="flex items-center gap-1 border-2 border-black bg-cream px-3 py-2 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={busy}
        placeholder="או הדביקו כתובת תמונה https://..."
        className={`${inputClass} mt-3 disabled:opacity-60`}
        dir="ltr"
      />
    </div>
  );
}
