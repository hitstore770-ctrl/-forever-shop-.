"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Lenis smooth scroll, scoped to whichever page renders it.
//
// Lenis is driven from GSAP's ticker rather than its own autoRaf or framer's
// frame loop. That ordering is the whole point once ScrollTrigger is on the
// page: GSAP's ticker also drives ScrollTrigger, so within a single frame the
// scroll position advances first and every scrub reads the value it just
// produced. Split across two loops, a scrubbed timeline can sample a scroll
// position one frame stale, which shows up as the pinned canvas lagging the
// finger by a frame.
//
// `lagSmoothing(0)` disables GSAP's habit of clamping large frame deltas. That
// behaviour is right for regular tweens — it stops a tab regaining focus from
// jumping an animation forward — but on a scrubbed timeline it would swallow
// real scroll distance after a stall.
//
// `syncTouch` is left off, which means touch scrolling stays native. This looks
// like the opposite of "smooth scroll on mobile" and is deliberate: iOS
// momentum scrolling is implemented off the main thread, and replacing it with
// a JS-interpolated equivalent reliably makes phones feel worse, not better.
// Lenis smooths the wheel; the phone keeps its own physics.
//
// Lenis moves the real scroll position (it is not a transformed proxy
// container), so framer's useScroll, IntersectionObserver, sticky positioning
// and anchor links all keep working untouched.
//
// Under prefers-reduced-motion nothing is constructed at all.

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
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

    // Keep ScrollTrigger's cached scroll position in step with Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP's ticker reports seconds; Lenis wants milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
