import Skeleton from "@/components/ui/Skeleton";

// Skeleton stand-in for the admin data tables (donations, staff, events,
// gallery, learning, contacts) while their Firestore-backed rows load.
// Mirrors the real tables' brutalist frame — thick border, dark header bar,
// zebra rows — so the layout doesn't shift when the data arrives.
export default function AdminTableSkeleton({ columns = 4, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden border-4 border-black shadow-brutal-lg" aria-hidden="true">
      {/* Header bar */}
      <div className="flex gap-4 border-b-4 border-black bg-navy-900 px-4 py-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 bg-cream/25" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className={`flex items-center gap-4 border-b-2 border-black px-4 py-4 last:border-b-0 ${r % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
