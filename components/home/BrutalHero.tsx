"use client";

import { motion, useReducedMotion } from "framer-motion";
import MaskReveal from "@/components/home/MaskReveal";
import BrutalButton from "@/components/home/BrutalButton";
import { cn } from "@/lib/cn";
import { HERO_META, HERO_TITLE_LINES } from "@/lib/home-data";

// Full-height opening slab. Pure white, black type, nothing decorative — the
// only things on screen are the headline, the two actions, and a rule of
// editorial metadata across the bottom.
//
// Height subtracts --header-h because the site header sits in normal flow, so
// a plain 100svh section overflows the screen by exactly its height and pushes
// the CTA below the fold. svh rather than vh so mobile browsers measure it
// against the visible area with the URL bar expanded.
//
// The generous bottom padding is not slack either: this layout parks its last
// row at the bottom of the first screen, and the floating WhatsApp button is
// fixed over that exact corner. Without the clearance it sits on top of the
// first metadata column.

export default function BrutalHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-between border-b-[3px] border-black bg-white px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
      <div className="mx-auto w-full max-w-7xl">
        <MaskReveal
          delay={0.05}
          duration={0.7}
          // Tracking is dialled back on narrow screens — at 0.4em this line
          // wraps to two, and a wrapped eyebrow reads as a mistake.
          className="text-[0.65rem] font-bold tracking-[0.18em] text-black sm:text-[0.7rem] sm:tracking-[0.4em]"
        >
          {HERO_META.eyebrow}
        </MaskReveal>

        <h1 className="mt-8 text-[3.6rem] leading-[0.92] font-extrabold tracking-[-0.04em] text-black sm:mt-12 sm:text-[8rem] lg:text-[11rem]">
          {HERO_TITLE_LINES.map((line, index) => (
            <MaskReveal key={line} delay={0.15 + index * 0.11}>
              {line}
            </MaskReveal>
          ))}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-6"
        >
          <BrutalButton href="/join">הרשם עכשיו</BrutalButton>
          <BrutalButton href="/yeshiva" variant="outline">
            על הישיבה
          </BrutalButton>
        </motion.div>

        {/* Editorial footer rule: three facts, hairline-separated, set small
            and wide. Carries the "spec sheet" tone without adding an image. */}
        <motion.dl
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-12 grid grid-cols-3 border-t-2 border-black pt-4 text-black"
        >
          {HERO_META.facts.map((fact, index) => (
            <div
              key={fact.label}
              // Rules go between the columns, never on the outer edges. In RTL
              // "inline-end" is the left side, so every column except the last
              // one carries the rule that separates it from the next.
              className={cn(
                "pe-3",
                index > 0 && "ps-3",
                index < HERO_META.facts.length - 1 && "border-e-2 border-black",
              )}
            >
              <dt className="text-[0.6rem] font-bold tracking-[0.2em] text-black/50">
                {fact.label}
              </dt>
              <dd className="mt-1 text-lg font-extrabold tracking-tight sm:text-2xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
