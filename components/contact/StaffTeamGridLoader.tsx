import StaffTeamGrid from "@/components/contact/StaffTeamGrid";
import { getStaff } from "@/lib/staff-data";

// Async server component owning the Firestore read, so the Contact page can
// Suspense-wrap just the staff grid while it loads.
export default async function StaffTeamGridLoader() {
  const staff = await getStaff();
  return <StaffTeamGrid staff={staff} />;
}
