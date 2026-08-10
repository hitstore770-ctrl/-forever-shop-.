"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ScheduleItem } from "@/lib/schedule-data";

// The day, as a vertical run down one thick rule.
//
// The rule is drawn twice: a faint full-length track, and a solid line on top
// of it that fills as you scroll the section. The fill is a scaleY transform
// with its origin at the top, so it costs nothing per frame — animating the
// element's height instead would relayout the whole list on every tick.
//
// In RTL the spine sits on the right, which is where the eye starts, and the
// times run down it as the anchor.

export default function DailyTimeline({ items }: { items: ScheduleItem[] }) {
  const sectionRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    // The rules live outside the <ol>: a list may only contain list items, and
    // a stray <div> in there is both invalid markup and something screen
    // readers announce as list content.
    <div className="relative">
      {/* Track + fill. Both are pinned to the inline-start edge, which the
          markers below are centred on. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-[11px] w-[3px] bg-kb-faint" />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
        className="absolute inset-y-0 right-[11px] w-[3px] origin-top bg-kb-inv"
      />

      <ol ref={sectionRef}>
        {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 560, damping: 32, mass: 0.6 }}
          className="relative flex gap-5 pe-2 pb-9 last:pb-0"
        >
          {/* Square marker straddling the spine. */}
          <span
            aria-hidden="true"
            className="relative z-10 mt-1 h-[25px] w-[25px] shrink-0 border-[3px] border-kb bg-kb"
          >
            <span className="absolute inset-[4px] bg-kb-inv" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-lg font-extrabold tracking-tight tabular-nums text-kb sm:text-2xl">
                {item.time}
              </span>
              <span className="text-[0.55rem] font-bold tracking-[0.25em] text-kb-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-kb sm:text-3xl">
              {item.title}
            </h3>
            {item.subtext ? (
              <p className="mt-1 text-sm font-medium text-kb-dim">{item.subtext}</p>
            ) : null}
          </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
