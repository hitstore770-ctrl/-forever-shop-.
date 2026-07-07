import type { UpcomingEvent } from "@/lib/events-data";

// Read-only for now — lists the same static events the public /events
// page renders. TODO next phase: back this with a Firestore collection
// and add create/edit/delete here.
export default function EventsTable({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal-lg">
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="border-b-4 border-black bg-navy-900 text-cream">
            <th className="px-4 py-3 text-sm font-semibold uppercase">כותרת</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">תאריך</th>
            <th className="px-4 py-3 text-sm font-semibold uppercase">תיאור</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.id}
              className={`border-b-2 border-black last:border-b-0 ${index % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
            >
              <td className="px-4 py-3 font-semibold text-navy-950">{event.title}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{event.date}</td>
              <td className="px-4 py-3 font-normal text-navy-700/80">{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
