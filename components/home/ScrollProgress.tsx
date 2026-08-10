"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Reading-progress rule pinned to the very top of the window.
//
// It scales a full-width bar rather than animating its width: scaleX is a
// compositor transform, width is layout. On a page with a scroll-driven
// marquee and six scroll-linked headings already running, a layout-triggering
// bar on every scroll tick is exactly the kind of thing that costs frames.
//
// The origin is the inline start — the right edge, since the page is RTL — so
// the bar grows in the direction the page is read.

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Lightly sprung so a flick does not make the bar snap in steps.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[6px] origin-right bg-kb-inv"
    />
  );
}
