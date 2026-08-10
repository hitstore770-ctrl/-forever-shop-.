"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import MaskReveal from "@/components/home/MaskReveal";
import { JOIN_ANCHOR_ID, JOIN_FORM, TRACKS } from "@/lib/home-data";
import { buildWhatsAppLink } from "@/lib/site-config";
import { haptic } from "@/lib/haptics";

// The closing form. The fields have no box: no background, no ring, no radius
// — a single heavy rule under each one, which is the only border in this
// system that reads as "write here" rather than "this is a container".
//
// The track field is a <select> rather than a free-text input. There are
// exactly four tracks and they are named elsewhere on this page; making the
// visitor retype one of them by hand invites typos on the single answer the
// yeshiva most needs to route the lead. It carries the same bottom-rule
// styling, with appearance-none so no platform chrome breaks the line.
//
// Submitting hands off to WhatsApp with the details already composed rather
// than posting anywhere. That is deliberate for now: it works today with no
// endpoint, no database write and no personal data at rest on our side, and
// the yeshiva already answers on that number. Swap the handler for a Server
// Action when there is somewhere for the lead to land.

const MIN_PHONE_DIGITS = 9;

const FIELD_CLASS =
  "mt-3 w-full appearance-none border-0 border-b-[3px] border-kb bg-transparent px-0 pb-2 text-xl font-extrabold tracking-tight text-kb outline-none placeholder:font-medium placeholder:text-kb-faint focus:border-kb-accent focus:ring-0 focus:outline-none sm:text-2xl";

const LABEL_CLASS = "block text-[0.55rem] font-bold tracking-[0.3em] text-kb-faint";

export default function JoinForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [track, setTrack] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("צריך שם מלא.");
      return;
    }
    if (phone.replace(/\D/g, "").length < MIN_PHONE_DIGITS) {
      setError("צריך מספר טלפון תקין.");
      return;
    }

    setError(null);
    haptic(50);

    const lines = [
      `שלום, קוראים לי ${name.trim()}.`,
      age.trim() ? `גיל: ${age.trim()}` : null,
      `טלפון: ${phone.trim()}`,
      track ? `מסלול שמעניין אותי: ${track}` : null,
      "אשמח לשמוע פרטים על ההרשמה.",
    ].filter(Boolean);

    window.open(buildWhatsAppLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id={JOIN_ANCHOR_ID}
      // Anchored scrolling lands the heading clear of the fixed progress bar.
      className="scroll-mt-6 border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-[2.4rem] leading-[0.95] font-extrabold tracking-[-0.045em] text-kb sm:text-7xl">
          <MaskReveal inView duration={0.7}>
            {JOIN_FORM.headline}
          </MaskReveal>
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-12 grid gap-9 sm:mt-16 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-11">
          <label className="block">
            <span className={LABEL_CLASS}>{JOIN_FORM.fields.name}</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="איך קוראים לך"
              className={FIELD_CLASS}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLASS}>{JOIN_FORM.fields.age}</span>
            <input
              type="text"
              name="age"
              inputMode="numeric"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="17+"
              className={FIELD_CLASS}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLASS}>{JOIN_FORM.fields.phone}</span>
            <input
              type="tel"
              name="phone"
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              placeholder="050-000-0000"
              className={`${FIELD_CLASS} text-start`}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLASS}>{JOIN_FORM.fields.track}</span>
            <select
              name="track"
              value={track}
              onChange={(event) => setTrack(event.target.value)}
              className={FIELD_CLASS}
            >
              <option value="">עדיין לא בטוח</option>
              {TRACKS.map((item) => (
                <option key={item.title} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2">
            {error ? (
              <p role="alert" className="mb-5 text-sm font-extrabold tracking-tight text-kb-accent">
                {error}
              </p>
            ) : null}

            <motion.button
              type="submit"
              whileTap={{ x: 4, y: 4 }}
              transition={{ type: "spring", stiffness: 1200, damping: 60, mass: 0.4 }}
              className="w-full border-2 border-kb bg-kb-inv px-10 py-5 text-lg font-extrabold tracking-tight text-kb-inv shadow-[7px_7px_0_0_var(--kb-fg)] sm:w-auto sm:text-xl"
            >
              {JOIN_FORM.submit}
            </motion.button>

            <p className="mt-5 text-xs font-medium text-kb-dim">
              נפתח בוואטסאפ עם הפרטים מוכנים. בלי טפסים, בלי המתנה.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
