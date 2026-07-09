import type { Metadata } from "next";
import EventsManager from "@/components/admin/EventsManager";
import { getEvents } from "@/lib/events-data";

export const metadata: Metadata = {
  title: "אירועים",
};

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        ניהול אירועים
      </h1>
      <EventsManager events={events} />
    </>
  );
}
