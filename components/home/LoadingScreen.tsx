"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Mount-time curtain. Flashes "מתעלים..." over a solid ground, then leaves by
// sliding straight up — no fade, no easing you can read.
//
// It is short on purpose. A curtain sits directly on top of Largest
// Contentful Paint: whatever it covers cannot count as painted, so every extra
// hundred milliseconds here is a hundred milliseconds added to the page's
// measured load. 850ms is enough to register as intentional and short enough
// to stay out of the way.
//
// It also earns its keep: the dark-mode preference is read from localStorage
// on mount, and the curtain is what hides the one-frame light flash before it
// is applied.

const HOLD_MS = 850;
const EXIT_MS = 0.42;

export default function LoadingScreen() {
  const [isDone, setIsDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsDone(true), prefersReducedMotion ? 300 : HOLD_MS);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isDone ? null : (
        <motion.div
          key="curtain"
          initial={false}
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_MS, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-kb"
        >
          <motion.span
            animate={prefersReducedMotion ? undefined : { opacity: [1, 0.12, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="text-4xl font-extrabold tracking-[-0.04em] text-kb sm:text-6xl"
          >
            מתעלים...
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
