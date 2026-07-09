import Skeleton from "@/components/ui/Skeleton";

// Loading placeholder for the Yeshiva page's leadership grid — mirrors the
// wide two-up bio-card layout.
export default function LeadershipGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-5 border-4 border-black bg-cream p-5 shadow-brutal-lg sm:flex-row sm:items-start">
          <Skeleton className="h-32 w-32 shrink-0 self-center sm:self-start" />
          <div className="flex-1 text-center sm:text-right">
            <Skeleton className="mx-auto h-6 w-32 sm:mx-0" />
            <Skeleton className="mx-auto mt-2 h-4 w-20 sm:mx-0" />
            <Skeleton className="mx-auto mt-3 h-3 w-full sm:mx-0" />
            <Skeleton className="mx-auto mt-2 h-3 w-4/5 sm:mx-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
