"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClockIcon, TrashIcon } from "@/components/icons";
import type { ScheduleItem } from "@/lib/schedule-data";
import {
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  type ScheduleInput,
} from "@/app/admin/(dashboard)/schedule/actions";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

const EMPTY: ScheduleInput = { time: "", title: "", subtext: "", order: 0 };

function toInput(item: ScheduleItem): ScheduleInput {
  return { time: item.time, title: item.title, subtext: item.subtext ?? "", order: item.order };
}

// Full add/edit/delete manager for the daily schedule. Reads the current
// list from props (server-fetched) and mutates it through the passcode-gated
// Server Actions, refreshing the route to pull the updated data after each
// change. All feedback is via brand toasts.
export default function ScheduleManager({ items }: { items: ScheduleItem[] }) {
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
      {/* Add */}
      {isAdding ? (
        <ScheduleForm
          initial={{ ...EMPTY, order: (items.at(-1)?.order ?? 0) + 1 }}
          disabled={isPending}
          onCancel={() => setIsAdding(false)}
          onSubmit={(input) => run(() => createScheduleItem(input), "הפריט נוסף", () => setIsAdding(false))}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          + הוספת פריט
        </button>
      )}

      {/* List */}
      <div className="space-y-4">
        {items.map((item) =>
          editingId === item.id ? (
            <ScheduleForm
              key={item.id}
              initial={toInput(item)}
              disabled={isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => run(() => updateScheduleItem(item.id, input), "הפריט עודכן", () => setEditingId(null))}
            />
          ) : (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-cream p-4 shadow-brutal"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 border-2 border-black bg-navy-900 px-3 py-1 text-lg font-semibold text-cream">
                  <ClockIcon className="h-4 w-4" />
                  {item.time}
                </span>
                <div>
                  <p className="font-semibold text-navy-950">{item.title}</p>
                  {item.subtext && <p className="text-sm font-normal text-navy-700/70">{item.subtext}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === item.id ? (
                  <>
                    <span className="text-sm font-semibold text-navy-950">למחוק?</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => deleteScheduleItem(item.id), "הפריט נמחק", () => setConfirmDeleteId(null))}
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
                        setEditingId(item.id);
                        setIsAdding(false);
                      }}
                      className="border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                    >
                      עריכה
                    </button>
                    <button
                      type="button"
                      aria-label={`מחיקת ${item.title}`}
                      onClick={() => setConfirmDeleteId(item.id)}
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

function ScheduleForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial: ScheduleInput;
  disabled: boolean;
  onSubmit: (input: ScheduleInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ScheduleInput>(initial);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-cream-dark p-5 shadow-brutal-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>שעה</label>
          <input
            required
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="07:00"
            className={inputClass}
            dir="ltr"
          />
        </div>
        <div>
          <label className={labelClass}>סדר (מספר)</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputClass}
            dir="ltr"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>כותרת</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="סדר בוקר"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>תיאור (אופציונלי)</label>
          <input
            value={form.subtext}
            onChange={(e) => setForm({ ...form, subtext: e.target.value })}
            placeholder="בחברותות"
            className={inputClass}
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
