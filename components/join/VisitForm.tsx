"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full border-4 border-black bg-cream px-4 py-3 text-lg font-normal text-navy-950 shadow-brutal placeholder:font-normal placeholder:text-navy-900/40 focus:outline-none";

// Contact form for scheduling a visit.
// TODO: wire up to a real backend once ready (e.g. a Firebase Function that
// emails/Slacks the office, or a direct write to Firestore).
export default function VisitForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="border-4 border-black bg-copper-400 p-8 text-center shadow-brutal-lg">
        <p className="text-2xl font-semibold text-navy-950">קיבלנו! 🙌</p>
        <p className="mt-2 font-normal text-navy-900/80">ניצור איתך קשר בקרוב לתיאום הביקור.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="visit-name" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          שם מלא
        </label>
        <input id="visit-name" name="name" type="text" required placeholder="ישראל ישראלי" className={inputClass} />
      </div>

      <div>
        <label htmlFor="visit-phone" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          טלפון
        </label>
        <input
          id="visit-phone"
          name="phone"
          type="tel"
          required
          placeholder="050-000-0000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="visit-date" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          תאריך מועדף לביקור
        </label>
        <input id="visit-date" name="date" type="date" required className={inputClass} />
      </div>

      <button
        type="submit"
        className="w-full border-4 border-black bg-copper-500 py-5 text-xl font-semibold text-navy-950 uppercase shadow-brutal-lg transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-brutal-none"
      >
        קבעו לי ביקור
      </button>
    </form>
  );
}
