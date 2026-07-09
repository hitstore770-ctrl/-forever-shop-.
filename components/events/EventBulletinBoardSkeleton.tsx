import Skeleton from "@/components/ui/Skeleton";

// Corkboard-shaped fallback — mirrors EventBulletinBoard's dark panel and its
// grid of pinned note cards so the swap-in isn't jarring.
export default function EventBulletinBoardSkeleton() {
  return (
    <div className="border-4 border-black bg-navy-950 p-6 shadow-brutal-lg sm:p-10" aria-hidden="true">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-4 border-black bg-cream p-5 pt-8 shadow-brutal">
            <Skeleton className="mb-2 h-3 w-1/2" />
            <Skeleton className="mb-3 h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
