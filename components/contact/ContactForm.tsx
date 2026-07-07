"use client";

import { useState, type FormEvent } from "react";
import { DoodleBoldArrow } from "@/components/doodles";
import { addContactSubmission } from "@/lib/admin-data";
import { formatDateDMY } from "@/lib/format";

const inputClass =
  "w-full border-4 border-black bg-cream px-4 py-3 text-lg font-normal text-navy-950 shadow-brutal placeholder:font-normal placeholder:text-navy-900/40 focus:outline-none";

// Brutalist contact form — writes directly to Firestore's
// "contactSubmissions" collection via the client SDK (falls back to a
// console.log placeholder when Firebase isn't configured).
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setIsSubmitting(true);
    try {
      await addContactSubmission({ date: formatDateDMY(new Date()), name, phone, message });
      setIsSubmitted(true);
    } catch {
      setError("משהו השתבש בשליחת ההודעה. אפשר לנסות שוב, או לפנות אלינו ישירות בוואטסאפ.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="border-4 border-black bg-copper-400 p-8 text-center shadow-brutal-lg">
        <p className="text-2xl font-semibold text-navy-950">ההודעה נשלחה! 🙌</p>
        <p className="mt-2 font-normal text-navy-900/80">ניצור איתך קשר בהקדם האפשרי.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          שם מלא
        </label>
        <input id="contact-name" name="name" type="text" required placeholder="ישראל ישראלי" className={inputClass} />
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          טלפון
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          placeholder="050-000-0000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
          הודעה
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="איך נוכל לעזור?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-sm font-semibold text-copper-700">{error}</p>}

      <div className="relative">
        <DoodleBoldArrow className="pointer-events-none absolute -top-12 -right-6 hidden h-14 w-14 rotate-[70deg] text-copper-600 sm:block" />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-4 border-black bg-copper-500 py-5 text-xl font-semibold text-navy-950 uppercase shadow-brutal-lg transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-lg"
        >
          {isSubmitting ? "שולח..." : "שליחת הודעה"}
        </button>
      </div>
    </form>
  );
}
