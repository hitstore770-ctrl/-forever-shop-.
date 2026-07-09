import Skeleton from "@/components/ui/Skeleton";

// Masonry-shaped fallback for the photo wall — mirrors PhotoGallery's
// multi-column layout with varied tile heights so the swap-in isn't jarring.
const HEIGHTS = ["h-80", "h-48", "h-64", "h-80", "h-48", "h-64", "h-48", "h-80", "h-64"];

export default function PhotoGallerySkeleton() {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3" aria-hidden="true">
      {HEIGHTS.map((height, index) => (
        <div key={index} className="mb-6 break-inside-avoid border-4 border-black shadow-brutal-lg">
          <Skeleton className={`w-full rounded-none ${height}`} />
        </div>
      ))}
    </div>
  );
}
