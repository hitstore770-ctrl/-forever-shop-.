import Skeleton from "@/components/ui/Skeleton";

// Fallback mirroring the stacked milestone cards of HistoryTimeline.
export default function HistoryTimelineSkeleton() {
  return (
    <div className="space-y-10" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mx-auto max-w-2xl border-4 border-black bg-cream-dark px-7 py-8 shadow-brutal sm:px-10">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-6 w-1/2" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
