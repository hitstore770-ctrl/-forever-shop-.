"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

// Lenis smooth scroll, scoped to whichever page renders it.
//
// Three decisions worth knowing about:
//
// 1. Lenis is driven from framer-motion's frame loop rather than its own
//    `autoRaf`. Both would work, but this keeps the page on exactly one
//    requestAnimationFrame — Lenis' integration and every motion value on the
//    page then resolve in a single frame, in a fixed order, instead of racing
//    across two loops and occasionally landing a scroll update after the
//    transforms that were supposed to read it.
//
// 2. `syncTouch` is left off, which means touch scrolling stays native. This
//    looks like the opposite of "smooth scroll on mobile" and is deliberate:
//    iOS momentum scrolling is implemented off the main thread, and replacing
//    it with a JS-interpolated equivalent reliably makes phones feel worse,
//    not better. Lenis smooths the wheel; the phone keeps its own physics.
//
// 3. Lenis moves the real scroll position (it is not a transformed proxy
//    container), so framer's useScroll, IntersectionObserver, sticky
//    positioning and anchor links all keep working untouched.
//
// Under prefers-reduced-motion nothing is constructed at all.

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      // Interpolation factor per frame. Lower is heavier; this is smooth
      // without introducing the "the page is ignoring me" lag that makes
      // hijacked scroll infuriating.
      lerp: 0.11,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
  });

  return null;
}
