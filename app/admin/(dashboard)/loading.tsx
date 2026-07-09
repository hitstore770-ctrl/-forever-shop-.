import Skeleton from "@/components/ui/Skeleton";
import AdminStatsSkeleton from "@/components/admin/AdminStatsSkeleton";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

// Shown while the donations landing page's Firestore data loads.
export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-11 w-56 bg-navy-900/20" />
      <AdminStatsSkeleton />
      <AdminTableSkeleton columns={5} />
    </div>
  );
}
