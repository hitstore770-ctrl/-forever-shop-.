import EventBulletinBoard from "@/components/events/EventBulletinBoard";
import { getEvents } from "@/lib/events-data";

// Async server component owning the Firestore read, so the /events page can
// wrap just this in a Suspense boundary — the hero stays instant and only the
// corkboard shows a skeleton while the events load.
export default async function EventBulletinBoardLoader() {
  const events = await getEvents();
  return <EventBulletinBoard events={events} />;
}
