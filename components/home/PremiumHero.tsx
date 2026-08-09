"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import TypewriterWord from "@/components/home/TypewriterWord";
import { HERO_SUBTITLE, HERO_TITLE_LINES } from "@/lib/home-data";
import { SITE_NAME } from "@/lib/site-config";

// Full-height opening statement: pearl ground, two very soft brand washes so
// the white reads as lit rather than flat, and nothing else competing with the
// headline.
//
// Height is svh, not vh, and the sticky header is subtracted. Two separate
// reasons, both of which push the CTA below the fold if ignored: on mobile
// Safari and Chrome `vh` is sized to the *collapsed* URL bar, so 100vh is
// taller than the screen on first paint (`svh` is the small-viewport unit and
// fits either state); and the header sits in normal flow, so a full-height
// section under it overflows by exactly the header's height.

const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PremiumHero() {
  const prefersReducedMotion = useReducedMotion();

  // One shared entrance: children inherit the container's stagger, so the
  // badge, headline, subtitle and buttons arrive in sequence off a single
  // animation rather than four hand-tuned delays.
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12, delayChildren: 0.1 },
    },
  };

  const item = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: EASE_LUX },
        },
      };

  return (
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-pearl px-5 py-20 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-copper-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-navy-600/10 blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto w-full max-w-4xl"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-navy-900/70 shadow-lux shadow-lux-inset"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-copper-500" />
          בס&quot;ד · {SITE_NAME}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-7 text-[3.25rem] leading-[1.03] font-semibold tracking-tight text-navy-950 sm:text-7xl lg:text-8xl"
        >
          {HERO_TITLE_LINES[0]}
          <br />
          <span className="text-copper-600">{HERO_TITLE_LINES[1]}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 text-xl leading-relaxed font-normal text-navy-900/70 sm:text-2xl"
        >
          {/* Announced once, in its settled form — screen readers should not
              have to sit through the retyping. */}
          <span className="sr-only">
            {HERO_SUBTITLE.prefix}
            {HERO_SUBTITLE.wordTo}
            {HERO_SUBTITLE.suffix}
          </span>
          <span aria-hidden="true">
            {HERO_SUBTITLE.prefix}
            <TypewriterWord
              from={HERO_SUBTITLE.wordFrom}
              to={HERO_SUBTITLE.wordTo}
              className="font-semibold text-navy-950"
            />
            {HERO_SUBTITLE.suffix}
          </span>
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/join"
            className="rounded-full bg-navy-900 px-8 py-4 text-base font-semibold text-pearl shadow-lux transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-lux-lg active:scale-95"
          >
            הרשם עכשיו
          </Link>
          <Link
            href="/yeshiva"
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-navy-900 shadow-lux shadow-lux-inset transition-all hover:-translate-y-0.5 hover:shadow-lux-lg active:scale-95"
          >
            על הישיבה
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll affordance. Hidden under reduced motion, where a bouncing
          arrow is exactly the thing the setting asks us not to do. */}
      {prefersReducedMotion ? null : (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs font-medium tracking-[0.25em] text-navy-900/35"
          >
            גלול ↓
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}
