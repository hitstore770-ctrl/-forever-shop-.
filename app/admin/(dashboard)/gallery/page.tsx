import type { Metadata } from "next";
import GalleryManager from "@/components/admin/GalleryManager";
import { getGalleryPhotos } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "גלריה",
};

export default async function AdminGalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        ניהול גלריה
      </h1>
      <GalleryManager photos={photos} />
    </>
  );
}
