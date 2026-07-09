import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-8 h-11 w-56 bg-navy-900/20" />
      <Skeleton className="mb-6 h-10 w-36" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full border-4 border-black/10" />
        ))}
      </div>
    </>
  );
}
