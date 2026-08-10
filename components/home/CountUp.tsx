"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Number that counts up the first time it enters the viewport.
//
// The running value is written straight to the node's textContent from the
// animation's onUpdate. Driving it through React state instead would mean
// roughly sixty renders per second per counter for the length of the run, and
// four of these sit in one row.
//
// The final value is what renders on the server, so the real number is in the
// HTML for crawlers and for anyone without JavaScript; the animation resets it
// to zero only at the moment it actually starts.

const DURATION = 1.3;

export type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export default function CountUp({ value, suffix, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion) {
      node.textContent = String(value);
      return;
    }

    const controls = animate(0, value, {
      duration: DURATION,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, prefersReducedMotion]);

  return (
    <span className={className}>
      <span ref={ref} className="tabular-nums">
        {value}
      </span>
      {suffix}
    </span>
  );
}
