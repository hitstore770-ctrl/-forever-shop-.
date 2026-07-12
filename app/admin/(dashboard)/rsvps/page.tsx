import type { Metadata } from "next";
import RsvpManager from "@/components/admin/RsvpManager";
import { getEvents } from "@/lib/events-data";
import { getRsvpsGroupedByEvent } from "@/lib/rsvp-data";

export const metadata: Metadata = {
  title: "אישורי הגעה",
};

export default async function AdminRsvpsPage() {
  const [events, grouped] = await Promise.all([getEvents(), getRsvpsGroupedByEvent()]);

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        אישורי הגעה
      </h1>
      <RsvpManager events={events} grouped={grouped} />
    </>
  );
}
