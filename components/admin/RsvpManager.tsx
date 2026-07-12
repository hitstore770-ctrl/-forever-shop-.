"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "@/components/icons";
import type { UpcomingEvent } from "@/lib/events-data";
import type { RsvpEntry } from "@/lib/rsvp-data";
import { deleteRsvp } from "@/lib/rsvp-actions";

// Staff view of confirmed attendance, grouped per event: a headcount (with
// capacity when set) and the participant list. Sections are shown for every
// RSVP-enabled event, plus any leftover RSVPs whose event was disabled/removed.
export default function RsvpManager({
  events,
  grouped,
}: {
  events: UpcomingEvent[];
  grouped: Record<string, RsvpEntry[]>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteRsvp(id);
      if (res.ok) {
        toast.success("האישור נמחק");
        router.refresh();
      } else {
        toast.error("המחיקה נכשלה", { description: res.error });
      }
    });
  }

  const enabled = events.filter((e) => e.rsvpEnabled);
  const enabledIds = new Set(enabled.map((e) => e.id));
  const orphanIds = Object.keys(grouped).filter((id) => !enabledIds.has(id));

  const sections = [
    ...enabled.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      capacity: e.capacity ?? 0,
      entries: grouped[e.id] ?? [],
    })),
    ...orphanIds.map((id) => ({ id, title: "אירוע שאינו פעיל", date: "", capacity: 0, entries: grouped[id] })),
  ];

  if (sections.length === 0) {
    return (
      <p className="border-2 border-dashed border-navy-900/30 bg-cream px-4 py-3 text-sm font-normal text-navy-800">
        אין אירועים עם אישורי הגעה. הפעילו RSVP באירוע (בלשונית אירועים) כדי לראות כאן משתתפים.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const total = section.entries.reduce((sum, e) => sum + e.attendees, 0);
        return (
          <div key={section.id} className="border-4 border-black bg-cream shadow-brutal">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-black bg-navy-900 px-4 py-3 text-cream">
              <h2 className="font-semibold uppercase">
                {section.title}
                {section.date && <span className="font-normal text-cream/70"> · {section.date}</span>}
              </h2>
              <span className="border-2 border-cream/30 px-2 py-0.5 text-sm font-semibold">
                {total} משתתפים{section.capacity > 0 ? ` / ${section.capacity}` : ""}
              </span>
            </div>

            {section.entries.length === 0 ? (
              <p className="px-4 py-4 text-sm font-normal text-navy-700/70">אין עדיין אישורי הגעה.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-right text-sm">
                  <thead>
                    <tr className="border-b-2 border-black bg-cream-dark">
                      <th className="px-4 py-2 font-semibold uppercase">שם</th>
                      <th className="px-4 py-2 font-semibold uppercase">טלפון</th>
                      <th className="px-4 py-2 font-semibold uppercase">כמות</th>
                      <th className="px-4 py-2 font-semibold uppercase">תאריך</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {section.entries.map((entry, i) => (
                      <tr key={entry.id} className={`border-b border-black/10 ${i % 2 ? "bg-cream-dark/40" : ""}`}>
                        <td className="px-4 py-2 font-semibold text-navy-950">{entry.name}</td>
                        <td className="px-4 py-2 font-normal text-navy-800" dir="ltr">
                          {entry.phone}
                        </td>
                        <td className="px-4 py-2 font-normal text-navy-800">{entry.attendees}</td>
                        <td className="px-4 py-2 font-normal text-navy-700/70">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("he-IL") : ""}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => remove(entry.id)}
                            aria-label={`מחיקת ${entry.name}`}
                            className="flex items-center border-2 border-black bg-cream px-2 py-1 text-xs font-semibold text-navy-900 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
