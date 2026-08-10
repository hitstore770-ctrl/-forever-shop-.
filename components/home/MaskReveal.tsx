"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// One line of type sliding up from behind a hard-edged mask.
//
// The mask is a block with overflow-hidden; the line inside starts translated
// fully below it and rides up to 0. Because the offset is a percentage it is
// relative to the line's own height, so the same component works for a 12rem
// display heading and a 0.75rem label with no tuning.
//
// The padding/negative-margin pair exists because an overflow-hidden box
// clipped to the line box shears the descenders off Hebrew letters that drop
// below the baseline — ק, ן, ך, ף, ץ. The padding gives the mask room to hide
// the line in; the matching negative margin gives that room back to the
// layout, so stacked lines still set tight.
//
// The scroll trigger watches the MASK, not the line. This is the whole trick
// and it is easy to get backwards: `whileInView` on the line itself never
// fires, because IntersectionObserver clips an element's intersection rect
// against its ancestors' overflow — the line starts translated out of the mask,
// so the observer reports it as 0% visible, forever. The line needs to be
// visible to animate and needs to animate to become visible. Observing the
// unclipped mask breaks the deadlock.

const EASE_SNAP: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HIDDEN_Y = "115%";

export type MaskRevealProps = {
  children: ReactNode;
  /** Seconds to wait before the line moves — use to cascade stacked lines. */
  delay?: number;
  duration?: number;
  /** Applied to the moving line, not to the mask. */
  className?: string;
  /** Runs on scroll-into-view instead of on mount. */
  inView?: boolean;
};

export default function MaskReveal({
  children,
  delay = 0,
  duration = 0.9,
  className,
  inView = false,
}: MaskRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const maskRef = useRef<HTMLSpanElement>(null);
  const isMaskInView = useInView(maskRef, { once: true, amount: 0.4 });

  if (prefersReducedMotion) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  // Mount-triggered lines reveal immediately; scroll-triggered ones wait for
  // their mask to come into view.
  const shouldReveal = inView ? isMaskInView : true;

  return (
    <span ref={maskRef} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className={cn("block", className)}
        initial={{ y: HIDDEN_Y }}
        animate={{ y: shouldReveal ? "0%" : HIDDEN_Y }}
        transition={{ duration, ease: EASE_SNAP, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
