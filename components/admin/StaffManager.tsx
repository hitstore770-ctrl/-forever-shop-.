"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserIcon, TrashIcon } from "@/components/icons";
import type { StaffMember } from "@/lib/staff-data";
import { createStaff, updateStaff, deleteStaff, type StaffInput } from "@/app/admin/(dashboard)/staff/actions";

const inputClass =
  "w-full border-2 border-black bg-cream px-3 py-2 text-base font-normal text-navy-950 shadow-brutal placeholder:text-navy-900/40 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold text-navy-950 uppercase";

const EMPTY: StaffInput = { name: "", role: "", description: "", imageUrl: "" };

function toInput(member: StaffMember): StaffInput {
  return {
    name: member.name,
    role: member.role,
    description: member.description ?? "",
    imageUrl: member.imageUrl ?? "",
  };
}

// Full add/edit/delete manager for the yeshiva staff/rabbis. Same
// passcode-gated Server Action + router.refresh() pattern as the schedule
// manager, with brand-toast feedback.
export default function StaffManager({ members }: { members: StaffMember[] }) {
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
        <StaffForm
          initial={EMPTY}
          disabled={isPending}
          onCancel={() => setIsAdding(false)}
          onSubmit={(input) => run(() => createStaff(input), "איש הצוות נוסף", () => setIsAdding(false))}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="border-2 border-black bg-copper-500 px-4 py-2 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          + הוספת איש צוות
        </button>
      )}

      <div className="space-y-4">
        {members.map((member) =>
          editingId === member.id ? (
            <StaffForm
              key={member.id}
              initial={toInput(member)}
              disabled={isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => run(() => updateStaff(member.id, input), "איש הצוות עודכן", () => setEditingId(null))}
            />
          ) : (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-cream p-4 shadow-brutal"
            >
              <div className="flex items-center gap-4">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-navy-900 text-cream">
                  {member.imageUrl ? (
                    // Arbitrary admin-entered URL from any host — a native
                    // lazy <img> avoids next/image's per-host allow-list.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.imageUrl} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-7 w-7 opacity-60" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-navy-950">{member.name}</p>
                  <p className="text-sm font-semibold text-copper-600">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === member.id ? (
                  <>
                    <span className="text-sm font-semibold text-navy-950">למחוק?</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => deleteStaff(member.id), "איש הצוות נמחק", () => setConfirmDeleteId(null))}
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
                        setEditingId(member.id);
                        setIsAdding(false);
                      }}
                      className="border-2 border-black bg-cream px-3 py-1.5 text-xs font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
                    >
                      עריכה
                    </button>
                    <button
                      type="button"
                      aria-label={`מחיקת ${member.name}`}
                      onClick={() => setConfirmDeleteId(member.id)}
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

function StaffForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial: StaffInput;
  disabled: boolean;
  onSubmit: (input: StaffInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<StaffInput>(initial);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-cream-dark p-5 shadow-brutal-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>שם</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="הרב שלמה כהן"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>תפקיד</label>
          <input
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="ראש הישיבה"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>תיאור (אופציונלי)</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="קצת על איש הצוות..."
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>כתובת תמונה (URL, אופציונלי)</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className={inputClass}
            dir="ltr"
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
