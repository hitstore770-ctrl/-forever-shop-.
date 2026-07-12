"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HistoryIcon, TrashIcon } from "@/components/icons";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { HistoryMilestone } from "@/lib/yeshiva-data";
import { createMilestone, updateMilestone, deleteMilestone, type MilestoneInput } from "@/app/admin/(dashboard)/history/actions";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

const EMPTY: MilestoneInput = { year: "", title: "", description: "", imageUrl: "" };

function toInput(m: HistoryMilestone): MilestoneInput {
  return { year: m.year, title: m.title, description: m.description, imageUrl: m.imageUrl ?? "" };
}

// Full add/edit/delete manager for the history timeline, each milestone with
// an optional archive image. Same passcode-gated Server Action +
// router.refresh() + brand-toast pattern as the other managers.
export default function HistoryManager({ milestones }: { milestones: HistoryMilestone[] }) {
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
        <MilestoneForm
          initial={EMPTY}
          disabled={isPending}
          onCancel={() => setIsAdding(false)}
          onSubmit={(input) => run(() => createMilestone(input), "אבן הדרך נוספה", () => setIsAdding(false))}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          + הוספת אבן דרך
        </button>
      )}

      <div className="space-y-4">
        {milestones.map((m) =>
          editingId === m.id ? (
            <MilestoneForm
              key={m.id}
              initial={toInput(m)}
              disabled={isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => run(() => updateMilestone(m.id, input), "אבן הדרך עודכנה", () => setEditingId(null))}
            />
          ) : (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-cream p-4 shadow-brutal"
            >
              <div className="flex items-center gap-4">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-navy-900 text-cream">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt={m.title} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <HistoryIcon className="h-6 w-6 opacity-60" />
                  )}
                </span>
                <div>
                  <p className="font-mono text-xs font-semibold tracking-widest text-copper-600 uppercase">{m.year}</p>
                  <p className="font-semibold text-navy-950">{m.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === m.id ? (
                  <>
                    <span className="text-sm font-semibold text-navy-950">למחוק?</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => deleteMilestone(m.id), "אבן הדרך נמחקה", () => setConfirmDeleteId(null))}
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
                        setEditingId(m.id);
                        setIsAdding(false);
                      }}
                      className="border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                    >
                      עריכה
                    </button>
                    <button
                      type="button"
                      aria-label={`מחיקת ${m.title}`}
                      onClick={() => setConfirmDeleteId(m.id)}
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

function MilestoneForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial: MilestoneInput;
  disabled: boolean;
  onSubmit: (input: MilestoneInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<MilestoneInput>(initial);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-cream-dark p-5 shadow-brutal-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>שנה</label>
          <input
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder='תשע"ה'
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>כותרת</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="הקמת הישיבה"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>תיאור</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="קצת על אבן הדרך..."
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="תמונת ארכיון (אופציונלי)"
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
