"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, TrashIcon } from "@/components/icons";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { UpcomingEvent } from "@/lib/events-data";
import { createEvent, updateEvent, deleteEvent, type EventInput } from "@/app/admin/(dashboard)/events/actions";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

const EMPTY: EventInput = { title: "", date: "", description: "", imageUrl: "" };

function toInput(event: UpcomingEvent): EventInput {
  return {
    title: event.title,
    date: event.date,
    description: event.description,
    imageUrl: event.imageUrl ?? "",
  };
}

// Full add/edit/delete manager for upcoming events, each with an optional
// cover image. Same passcode-gated Server Action + router.refresh() + brand
// toast pattern as the staff manager.
export default function EventsManager({ events }: { events: UpcomingEvent[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, successMsg: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        toast.success(successMsg);
        onDone?.();
        router.refresh();
      } else {
        toast.error("הפעולה נכשלה", { description: res.error });
      }
    });
  }

  return (
    <div className="space-y-6">
      {isAdding ? (
        <EventForm
          initial={EMPTY}
          disabled={isPending}
          onCancel={() => setIsAdding(false)}
          onSubmit={(input) => run(() => createEvent(input), "האירוע נוסף", () => setIsAdding(false))}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          + הוספת אירוע
        </button>
      )}

      <div className="space-y-4">
        {events.map((event) =>
          editingId === event.id ? (
            <EventForm
              key={event.id}
              initial={toInput(event)}
              disabled={isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => run(() => updateEvent(event.id, input), "האירוע עודכן", () => setEditingId(null))}
            />
          ) : (
            <div
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-cream p-4 shadow-brutal"
            >
              <div className="flex items-center gap-4">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-navy-900 text-cream">
                  {event.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.imageUrl} alt={event.title} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <CalendarIcon className="h-7 w-7 opacity-60" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-navy-950">{event.title}</p>
                  <p className="text-sm font-semibold text-copper-600">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === event.id ? (
                  <>
                    <span className="text-sm font-semibold text-navy-950">למחוק?</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => deleteEvent(event.id), "האירוע נמחק", () => setConfirmDeleteId(null))}
                      className="border-2 border-black bg-red-600 px-3 py-1.5 text-xs font-semibold text-cream uppercase shadow-brutal"
                    >
                      כן, מחק
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal"
                    >
                      ביטול
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(event.id);
                        setIsAdding(false);
                      }}
                      className="border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                    >
                      עריכה
                    </button>
                    <button
                      type="button"
                      aria-label={`מחיקת ${event.title}`}
                      onClick={() => setConfirmDeleteId(event.id)}
                      className="flex items-center gap-1 border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function EventForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial: EventInput;
  disabled: boolean;
  onSubmit: (input: EventInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EventInput>(initial);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-cream-dark p-5 shadow-brutal-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>כותרת</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="התוועדות שבועית"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>תאריך</label>
          <input
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="כ״ה תשרי"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>תיאור</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="קצת על האירוע..."
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="תמונת נושא (אופציונלי)"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="border-2 border-black bg-copper-500 px-5 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none disabled:opacity-60"
        >
          {disabled ? "שומר..." : "שמירה"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="border-2 border-black bg-cream px-5 py-2 text-sm font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
