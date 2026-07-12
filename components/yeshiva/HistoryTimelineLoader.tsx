import HistoryTimeline from "@/components/yeshiva/HistoryTimeline";
import { getMilestones } from "@/lib/yeshiva-data";

// Async server component owning the Firestore read, so the /yeshiva page can
// wrap just the timeline in a Suspense boundary — the rest of the page stays
// instant and only this section shows a skeleton while history loads.
export default async function HistoryTimelineLoader() {
  const milestones = await getMilestones();
  return <HistoryTimeline milestones={milestones} />;
}
