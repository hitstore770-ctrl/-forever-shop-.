"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Bottom-docked enrolment bar that appears once the visitor has scrolled past
// the hero, so the primary action is always one tap away without occupying the
// first screen.
//
// The threshold is measured from the viewport rather than hard-coded, because
// the hero is a full-height section: on a phone "past the hero" is ~700px, on
// a desktop it is ~900px, and a fixed number gets one of them wrong.
//
// Two collision details worth keeping: the floating WhatsApp button in the root
// layout is fixed bottom-right at z-50, so this bar sits below it (z-40) and
// reserves padding on that side rather than sliding underneath it — and since
// the page is RTL, that side is padding-inline-START; and the bottom padding
// respects the iOS home-indicator inset.

/** Fraction of the hero that has to leave the screen before the bar docks. */
const SHOW_AFTER_VH = 0.75;

export default function StickyCta() {
  const [isVisible, setIsVisible] = useState(false);
  const thresholdRef = useRef(Number.POSITIVE_INFINITY);
  const { scrollY } = useScroll();

  useEffect(() => {
    const measure = () => {
      thresholdRef.current = window.innerHeight * SHOW_AFTER_VH;
      setIsVisible(window.scrollY > thresholdRef.current);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsVisible(value > thresholdRef.current);
  });

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-black bg-white px-4 pt-3 sm:px-6"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 ps-16 sm:ps-20">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-black">
                ההרשמה לזמן הקרוב פתוחה
              </p>
              <p className="truncate text-xs font-medium text-black/55">
                מקומות מוגבלים · מלגות לזכאים
              </p>
            </div>
            <Link
              href="/join"
              className="shrink-0 border-2 border-black bg-black px-6 py-3 text-sm font-extrabold tracking-tight text-white transition-transform active:translate-x-[3px] active:translate-y-[3px]"
            >
              הרשם עכשיו
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
