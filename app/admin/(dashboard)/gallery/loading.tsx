import Skeleton from "@/components/ui/Skeleton";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-8 h-11 w-56 bg-navy-900/20" />
      <AdminTableSkeleton columns={3} />
    </>
  );
}
