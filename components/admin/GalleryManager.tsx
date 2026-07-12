"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CameraIcon, TrashIcon } from "@/components/icons";
import ImageUploadField from "@/components/admin/ImageUploadField";
import BulkGalleryUpload from "@/components/admin/BulkGalleryUpload";
import type { GalleryPhoto } from "@/lib/gallery-data";
import { createGalleryPhoto, deleteGalleryPhoto, type GalleryInput } from "@/app/admin/(dashboard)/gallery/actions";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

const SIZE_LABEL: Record<GalleryPhoto["size"], string> = { sm: "קטן", md: "בינוני", lg: "גדול" };
const EMPTY: GalleryInput = { caption: "", size: "md", imageUrl: "" };

// Full add/delete manager for the photo gallery. A photo is created by
// uploading an image (which sets imageUrl via the passcode-gated upload
// action) plus an optional caption and a display size. Same Server Action +
// router.refresh() + brand-toast pattern as the other managers.
//
// Seed placeholders (caption-only, no imageUrl) render greyed and can't be
// deleted — they're not real Firestore docs, just what the public page shows
// until real photos exist.
export default function GalleryManager({ photos }: { photos: GalleryPhoto[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const uploaded = photos.filter((p) => p.imageUrl);
  const showingSeed = uploaded.length === 0;

  function run(action: () => Promise<{ ok: boolean; error?: string }>, successMsg: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        toast.success(successMsg);
        onDone?.();
        router.refresh();
      } else {
        toast.error("הפעולה נכשלה", { description: res.error });
      }
    });
  }

  return (
    <div className="space-y-6">
      {isAdding ? (
        <GalleryForm
          disabled={isPending}
          onCancel={() => setIsAdding(false)}
          onSubmit={(input) => run(() => createGalleryPhoto(input), "התמונה נוספה", () => setIsAdding(false))}
        />
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
          >
            + הוספת תמונה
          </button>
          <BulkGalleryUpload />
        </div>
      )}

      {showingSeed && (
        <p className="border-2 border-dashed border-navy-900/30 bg-cream px-4 py-3 text-sm font-normal text-navy-800">
          עדיין אין תמונות שהועלו. התמונות למטה הן תמונות דוגמה שמוצגות באתר עד שתעלו תמונות אמיתיות.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="flex flex-col border-4 border-black bg-cream shadow-brutal">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden border-b-2 border-black bg-navy-900 text-cream">
              {photo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.imageUrl} alt={photo.caption} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <CameraIcon className="h-7 w-7 opacity-50" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
              <p className="line-clamp-2 text-sm font-semibold text-navy-950">{photo.caption || "ללא כיתוב"}</p>
              <span className="text-xs font-normal text-navy-700/70">{SIZE_LABEL[photo.size]}</span>

              {photo.imageUrl ? (
                confirmDeleteId === photo.id ? (
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => deleteGalleryPhoto(photo.id), "התמונה נמחקה", () => setConfirmDeleteId(null))}
                      className="border-2 border-black bg-red-600 px-2 py-1 text-xs font-semibold text-cream uppercase shadow-brutal disabled:opacity-60"
                    >
                      מחק
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="border-2 border-black bg-cream px-2 py-1 text-xs font-semibold text-navy-900 uppercase shadow-brutal"
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={`מחיקת ${photo.caption || "תמונה"}`}
                    onClick={() => setConfirmDeleteId(photo.id)}
                    className="mt-auto flex w-fit items-center gap-1 border-2 border-black bg-cream px-2 py-1 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                  >
                    <TrashIcon className="h-4 w-4" />
                    מחיקה
                  </button>
                )
              ) : (
                <span className="mt-auto text-xs font-normal text-navy-900/40">תמונת דוגמה</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryForm({
  disabled,
  onSubmit,
  onCancel,
}: {
  disabled: boolean;
  onSubmit: (input: GalleryInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<GalleryInput>(EMPTY);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-cream-dark p-5 shadow-brutal-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageUploadField
            label="תמונה"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelClass}>כיתוב (אופציונלי)</label>
          <input
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="התוועדות חנוכה"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>גודל תצוגה</label>
          <select
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value as GalleryPhoto["size"] })}
            className={inputClass}
          >
            <option value="sm">קטן</option>
            <option value="md">בינוני</option>
            <option value="lg">גדול</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="border-2 border-black bg-copper-500 px-5 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60"
        >
          {disabled ? "שומר..." : "שמירה"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="border-2 border-black bg-cream px-5 py-2 text-sm font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
