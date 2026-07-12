"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XIcon } from "@/components/icons";
import { submitRsvp, type RsvpInput } from "@/lib/rsvp-actions";
import type { UpcomingEvent } from "@/lib/events-data";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

// Public "אישור הגעה" modal for a single event. Submits through the
// capacity-checked server action; on success it closes and refreshes so the
// remaining-seats count updates.
export default function RsvpForm({
  event,
  spotsLeft,
  onClose,
}: {
  event: UpcomingEvent;
  spotsLeft: number | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<RsvpInput>({ name: "", phone: "", attendees: 1 });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitRsvp(event.id, form);
    if (res.ok) {
      toast.success("אישור ההגעה נקלט", { description: "נתראה בשמחה!" });
      router.refresh();
      onClose();
    } else {
      toast.error("לא הצלחנו לאשר", { description: res.error });
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md border-4 border-black bg-cream p-6 shadow-brutal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-navy-950 uppercase">אישור הגעה</h3>
            <p className="mt-1 text-sm font-semibold text-copper-600">
              {event.title} · {event.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-cream text-navy-900 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {spotsLeft !== null && (
          <p className="mt-2 text-sm font-normal text-navy-800/80">נותרו {spotsLeft} מקומות פנויים.</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className={labelClass}>שם מלא</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ישראל ישראלי"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>טלפון</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="050-0000000"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>מספר משתתפים</label>
            <input
              type="number"
              min={1}
              max={spotsLeft ?? 50}
              value={form.attendees}
              onChange={(e) => setForm({ ...form, attendees: Number(e.target.value) })}
              className={inputClass}
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full border-4 border-black bg-copper-500 py-3 text-base font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none disabled:opacity-60"
          >
            {submitting ? "שולח..." : "אישור הגעה"}
          </button>
        </form>
      </div>
    </div>
  );
}
