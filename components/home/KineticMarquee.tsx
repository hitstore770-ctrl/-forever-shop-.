"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { MARQUEE_PHRASES } from "@/lib/home-data";

// Infinite horizontal band whose speed is tied to how hard you are scrolling.
// It always drifts at a base rate; scroll velocity is added on top, so a flick
// visibly throws the type sideways and it settles back as the page comes to
// rest.
//
// Mechanics:
// - Four identical copies sit in one `w-max` flex track, so translating the
//   track by exactly -25% of its own width lands copy 2 where copy 1 was.
//   `wrap` keeps the offset inside that window, which means the position never
//   accumulates and there is no drift or precision decay over a long session.
// - The *viewport* around the track is forced to dir="ltr" while each copy
//   stays dir="rtl". This matters and is easy to get wrong: a `w-max` block
//   in an RTL container is anchored to its inline start, which is the right
//   edge, so translating it leftwards drags its right edge inward and opens a
//   growing gap at the end of the band. dir has to be flipped on the element
//   that *positions* the track, not on the track itself — setting it on the
//   track only changes the direction of the content inside it. Each copy is
//   then explicitly RTL so the Hebrew inside still reads correctly.
// - Everything happens on one motion value driving a transform, so the band
//   is composited and never touches layout or paint.
// - The frame callback bails when the band is off screen, so a page this tall
//   is not animating a strip nobody can see.

const COPIES = 4;
const SPAN = 100 / COPIES;

/** Percent of the track travelled per second with the page at rest. */
const BASE_VELOCITY = 3.5;

/** Ceiling on the scroll-derived multiplier, so a hard fling accelerates the
    band instead of teleporting it. */
const MAX_BOOST = 7;

export default function KineticMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const isOnScreenRef = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Raw scroll velocity is spiky and drops to zero the instant a finger lifts.
  // The spring gives the band inertia: it keeps carrying speed for a moment
  // and eases back down instead of snapping.
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 6], { clamp: false });

  const x = useTransform(baseX, (value) => `${value}%`);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      isOnScreenRef.current = entry.isIntersecting;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || !isOnScreenRef.current) return;
    const boost = Math.min(Math.abs(velocityFactor.get()), MAX_BOOST);
    const moveBy = BASE_VELOCITY * (1 + boost) * (delta / 1000);
    baseX.set(wrap(-SPAN, 0, baseX.get() - moveBy));
  });

  return (
    <section
      ref={sectionRef}
      aria-label={MARQUEE_PHRASES.join(" · ")}
      className="relative border-y-[3px] border-kb bg-kb-inv py-5 sm:py-7"
    >
      <div dir="ltr" aria-hidden="true" className="overflow-hidden">
        <motion.div style={{ x }} className="flex w-max flex-nowrap will-change-transform">
          {Array.from({ length: COPIES }, (_, copy) => (
            <span
              key={copy}
              dir="rtl"
              className="flex shrink-0 items-center gap-7 px-3.5 text-3xl font-extrabold tracking-[-0.03em] whitespace-nowrap text-kb-accent sm:gap-10 sm:px-5 sm:text-5xl"
            >
              {MARQUEE_PHRASES.map((phrase) => (
                <Fragment key={phrase}>
                  <span>{phrase}</span>
                  <span className="opacity-45">•</span>
                </Fragment>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
