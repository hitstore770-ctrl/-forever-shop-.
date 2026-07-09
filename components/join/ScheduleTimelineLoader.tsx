import ScheduleTimeline from "@/components/join/ScheduleTimeline";
import { getSchedule } from "@/lib/schedule-data";

// Async server component owning the Firestore read, so the /join page can
// wrap just this in a Suspense boundary — the heading stays instant and only
// the timeline shows a skeleton while the schedule loads.
export default async function ScheduleTimelineLoader() {
  const items = await getSchedule();
  return <ScheduleTimeline items={items} />;
}
