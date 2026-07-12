import EventBulletinBoard from "@/components/events/EventBulletinBoard";
import { getEvents } from "@/lib/events-data";
import { getRsvpTakenByEvent } from "@/lib/rsvp-data";

// Async server component owning both reads — events (public) and the RSVP
// seat counts (Admin SDK) — so the /events page wraps just this in a Suspense
// boundary. The hero stays instant; only the corkboard shows a skeleton.
export default async function EventBulletinBoardLoader() {
  const [events, taken] = await Promise.all([getEvents(), getRsvpTakenByEvent()]);
  return <EventBulletinBoard events={events} taken={taken} />;
}
