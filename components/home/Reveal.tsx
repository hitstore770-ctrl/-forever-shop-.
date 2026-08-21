"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// The light theme's standard entrance: a short, soft fade-in-up as the element
// scrolls into view, once. Deliberately gentler and slower than the scrapbook
// variants in lib/motion-variants.ts — on the lux surfaces the motion should
// register as "settling", not as a card being thrown onto a desk.
//
// Wrap sections or individual cards; for a staggered grid, give each child an
// increasing `delay`.

// A soft decelerating curve — the standard "expressive" ease. Typed as a tuple
// because framer's Easing rejects a plain number[].
const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating — use to stagger siblings. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
};

export default function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, ease: EASE_LUX, delay }}
    >
      {children}
    </motion.div>
  );
}
