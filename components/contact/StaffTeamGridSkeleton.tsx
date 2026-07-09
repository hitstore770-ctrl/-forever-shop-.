import Skeleton from "@/components/ui/Skeleton";

// Loading placeholder for the Contact page's staff grid — mirrors the
// compact 4-up card layout.
export default function StaffTeamGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-14 pt-4 sm:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-4 border-black bg-cream p-4 shadow-brutal-lg">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="mx-auto mt-4 h-5 w-24" />
          <Skeleton className="mx-auto mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
