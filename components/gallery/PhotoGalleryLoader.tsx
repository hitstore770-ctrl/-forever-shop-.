import PhotoGallery from "@/components/gallery/PhotoGallery";
import { getGalleryPhotos } from "@/lib/gallery-data";

// Async server component owning the Firestore read, so the /gallery page can
// wrap just this in a Suspense boundary — the hero stays instant and only the
// photo wall shows a skeleton while the gallery loads.
export default async function PhotoGalleryLoader() {
  const photos = await getGalleryPhotos();
  return <PhotoGallery photos={photos} />;
}
