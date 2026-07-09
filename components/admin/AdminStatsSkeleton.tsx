import Skeleton from "@/components/ui/Skeleton";

// Skeleton stand-in for the donations StatsRow (three summary cards).
export default function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-4 border-black bg-cream p-6 shadow-brutal">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-20" />
        </div>
      ))}
    </div>
  );
}
