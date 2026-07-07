import type { Metadata } from "next";
import GalleryPhotosTable from "@/components/admin/GalleryPhotosTable";
import { GALLERY_PHOTOS } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "גלריה",
};

// Read-only skeleton — see components/admin/GalleryPhotosTable.tsx for
// what's still TODO before this becomes a real content-management screen.
export default function AdminGalleryPage() {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
          גלריה
        </h1>
        <button
          type="button"
          disabled
          title="בקרוב — ניהול תמונות מלא"
          className="border-2 border-black bg-cream px-4 py-2 text-sm font-semibold text-navy-900/40 uppercase shadow-brutal cursor-not-allowed"
        >
          + הוספת תמונה
        </button>
      </div>
      <GalleryPhotosTable photos={GALLERY_PHOTOS} />
    </>
  );
}
