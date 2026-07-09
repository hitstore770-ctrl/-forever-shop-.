import Skeleton from "@/components/ui/Skeleton";

// Loading placeholder for the learning explorer — mirrors its layout
// (search bar, filter chips, then a card grid) so nothing jumps when the
// Firestore-backed Kuntresim arrive.
export default function LearningExplorerSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {/* Search bar */}
      <Skeleton className="h-14 w-full border-4 border-black/10" />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 border-2 border-black/10" />
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex h-full flex-col justify-between gap-5 border-4 border-black bg-cream p-6 shadow-brutal">
            <div>
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-3 h-4 w-1/2" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
