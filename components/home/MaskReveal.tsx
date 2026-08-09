"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const EASE_SNAP: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

  if (prefersReducedMotion) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  const motionProps = inView
    ? {
        whileInView: { y: "0%" },
        viewport: { once: true, amount: 0.6 } as const,
      }
    : { animate: { y: "0%" } };

  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className={cn("block", className)}
        initial={{ y: "115%" }}
        {...motionProps}
        transition={{ duration, ease: EASE_SNAP, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
