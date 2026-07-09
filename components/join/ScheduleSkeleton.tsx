import Skeleton from "@/components/ui/Skeleton";

// Loading placeholder for the daily schedule — mirrors the timeline's
// two-column card grid so nothing jumps when the Firestore data arrives.
export default function ScheduleSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-4 border-black bg-cream p-6 shadow-brutal">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-3 h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
      ))}
    </div>
  );
}
