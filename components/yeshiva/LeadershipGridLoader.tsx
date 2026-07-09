import LeadershipGrid from "@/components/yeshiva/LeadershipGrid";
import { getStaff } from "@/lib/staff-data";

// Async server component owning the Firestore read, so the Yeshiva page can
// Suspense-wrap just the leadership grid while it loads.
export default async function LeadershipGridLoader() {
  const staff = await getStaff();
  return <LeadershipGrid staff={staff} />;
}
