import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-8 h-11 w-56 bg-navy-900/20" />
      <Skeleton className="mb-6 h-10 w-40 bg-navy-900/20" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-4 border-black shadow-brutal">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
