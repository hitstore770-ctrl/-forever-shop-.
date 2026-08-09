"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ALLEY_VIDEO } from "@/lib/home-data";

// The alley card. A tall section with a pinned inner frame; as you scroll
// through it the card grows from inset to near-full-bleed and its corners
// tighten, so the clip feels like it is opening up around you.
//
// Three deliberate performance choices, all of them the reason this replaced
// the canvas frame sequence:
//
// 1. Scroll drives `scale` only — a compositor-level transform. No layout, no
//    paint, no main-thread work per frame.
// 2. The border-radius is written straight to the node in the scroll handler
//    and rounded to whole pixels. Radius is a paint property, so animating it
//    through React would re-render this subtree on every scroll tick; rounding
//    also stops sub-pixel values from repainting the corners continuously.
// 3. The clip plays itself. Nothing seeks it, nothing scrubs it. Scrubbing a
//    <video> by scroll position is what stalls on iOS — each seek is a decode
//    the browser is free to service late.
//
// Also note the caption is driven by a boolean + a CSS transition, not by a
// MotionValue bound to `style.opacity`. In this framer-motion/React build a
// MotionValue wired to a non-transform style property renders once at mount
// and then stops updating, while transform-backed props on the very same
// element keep tracking. Learned the hard way on the previous door sequence.

const SECTION_VH = 200;

// Corner radius in px at the start and end of the growth phase.
const RADIUS_FROM = 34;
const RADIUS_TO = 10;

// Progress window over which the card grows, and the window the caption is up.
const GROW_UNTIL = 0.4;
const CAPTION_FROM = 0.3;
const CAPTION_UNTIL = 0.92;

export default function AlleyReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Kept off the network until the section is actually approaching.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, GROW_UNTIL], [0.88, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const card = cardRef.current;
    if (card) {
      const t = Math.min(1, Math.max(0, value / GROW_UNTIL));
      const radius = Math.round(RADIUS_FROM + (RADIUS_TO - RADIUS_FROM) * t);
      const next = `${radius}px`;
      if (card.style.borderRadius !== next) card.style.borderRadius = next;
    }
    setIsCaptionVisible(value > CAPTION_FROM && value < CAPTION_UNTIL);
  });

  // Load and play only while the card is on screen; pause the moment it is
  // not. A muted looping video that keeps decoding off-screen is a battery
  // drain the visitor never sees.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // play() rejects if the browser declines autoplay; muted+playsInline
          // makes that unlikely, and there is nothing useful to do about it.
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const showVideo = shouldLoad && !hasFailed;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: prefersReducedMotion ? "100svh" : `${SECTION_VH}vh` }}
    >
      {/* Pinned below the sticky header rather than at top-0, so the card is
          never partly tucked underneath it. */}
      <div className="sticky top-[var(--header-h)] flex h-[calc(100svh-var(--header-h))] items-center justify-center overflow-hidden px-4 sm:px-6">
        <motion.div
          ref={cardRef}
          style={{
            scale: prefersReducedMotion ? 1 : scale,
            borderRadius: `${prefersReducedMotion ? RADIUS_TO : RADIUS_FROM}px`,
          }}
          className="relative aspect-3/4 w-full max-w-5xl overflow-hidden bg-pearl-dark shadow-lux-lg sm:aspect-video"
        >
          {/* Sits under the video, so the card is never a black rectangle —
              during the first decode, and permanently if the file is missing. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-br from-pearl-dark via-white to-copper-300/30"
          />

          {showVideo ? (
            <video
              ref={videoRef}
              src={ALLEY_VIDEO.src}
              poster={ALLEY_VIDEO.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              onError={() => setHasFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {/* Scrim: the caption is white, and a walking shot has no guaranteed
              dark area to land it on. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/55 via-navy-950/10 to-transparent"
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 p-6 transition-all duration-700 ease-out sm:p-10"
            style={{
              opacity: isCaptionVisible ? 1 : 0,
              transform: isCaptionVisible ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <p className="text-2xl leading-snug font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl">
              {ALLEY_VIDEO.caption}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-navy-950/5 ring-inset"
          />
        </motion.div>
      </div>
    </section>
  );
}
