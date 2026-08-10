"use client";

import { motion, useReducedMotion } from "framer-motion";
import MaskReveal from "@/components/home/MaskReveal";
import BrutalButton from "@/components/home/BrutalButton";
import TimeHeadline from "@/components/home/TimeHeadline";
import ZmanimBadge from "@/components/home/ZmanimBadge";
import {
  HERO_CTA,
  HERO_EYEBROW,
  HERO_FACTS,
  HERO_SUBHEAD,
  HERO_TITLE_LINES,
  JOIN_ANCHOR_ID,
} from "@/lib/home-data";
import { cn } from "@/lib/cn";

// Full-height opening slab. Pearl ground, midnight type, nothing decorative —
// the headline, one action, and a rule of editorial metadata across the bottom.
//
// Height is svh, not vh: on mobile Safari and Chrome `vh` is sized to the
// collapsed URL bar, so a 100vh hero is taller than the screen on first paint.
// The bottom padding clears the fixed navigation bar plus the floating
// buttons stacked above it — this layout parks its last row at the bottom of
// the first screen, which is exactly where that furniture lives.

export default function BrutalHero({ sunset }: { sunset: string }) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToForm = () => {
    document.getElementById(JOIN_ANCHOR_ID)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b-[3px] border-kb bg-kb px-5 pt-24 sm:px-8 sm:pt-28"
      style={{ paddingBottom: "calc(var(--kb-nav-h) + env(safe-area-inset-bottom) + 2rem)" }}
    >
      {/* Scrolls away with the hero rather than staying fixed — it is a plate
          on the page, not a persistent HUD. */}
      <ZmanimBadge time={sunset} className="absolute top-5 right-5 sm:top-7 sm:right-8" />

      <div className="mx-auto w-full max-w-7xl">
        <MaskReveal
          delay={0.05}
          duration={0.7}
          className="text-[0.6rem] leading-relaxed font-bold tracking-[0.14em] text-kb-accent sm:text-xs sm:tracking-[0.3em]"
        >
          {HERO_EYEBROW}
        </MaskReveal>

        <h1 className="mt-7 text-[3.4rem] leading-[0.92] font-extrabold tracking-[-0.045em] text-kb sm:mt-12 sm:text-[7.5rem] lg:text-[10rem]">
          {HERO_TITLE_LINES.map((line, index) => (
            <MaskReveal key={line} delay={0.15 + index * 0.11}>
              {line}
            </MaskReveal>
          ))}
        </h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl text-lg leading-snug font-medium text-kb-dim sm:mt-9 sm:text-2xl"
        >
          {HERO_SUBHEAD}
        </motion.p>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-4"
        >
          <BrutalButton onClick={scrollToForm}>{HERO_CTA}</BrutalButton>

          <TimeHeadline className="text-sm font-extrabold tracking-tight text-kb-accent sm:text-base" />
        </motion.div>

        {/* Editorial footer rule: three facts, hairline-separated, set small
            and wide. Carries the "spec sheet" tone without adding an image. */}
        <motion.dl
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-11 grid grid-cols-3 border-t-2 border-kb pt-4 text-kb"
        >
          {HERO_FACTS.map((fact, index) => (
            <div
              key={fact.label}
              // Rules go between the columns, never on the outer edges. In RTL
              // "inline-end" is the left side, so every column except the last
              // carries the rule that separates it from the next.
              className={cn(
                "pe-3",
                index > 0 && "ps-3",
                index < HERO_FACTS.length - 1 && "border-e-2 border-kb",
              )}
            >
              <dt className="text-[0.55rem] font-bold tracking-[0.2em] text-kb-faint">
                {fact.label}
              </dt>
              <dd className="mt-1 text-base font-extrabold tracking-tight sm:text-2xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
