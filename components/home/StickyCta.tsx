"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

// Bottom-docked enrolment CTA that appears once the visitor has scrolled past
// the hero, so the primary action is always one tap away without occupying the
// first screen.
//
// Two collision details worth keeping: the floating WhatsApp button in the root
// layout is fixed bottom-right at z-50, so this bar sits below it (z-40) and
// reserves padding on that side rather than sliding underneath it — and since
// the page is RTL, that side is padding-inline-START; and the
// bottom padding respects the iOS home-indicator inset.

const SHOW_AFTER_PX = 520;

export default function StickyCta() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsVisible(value > SHOW_AFTER_PX);
  });

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-950/8 bg-pearl/90 px-4 pt-3 backdrop-blur-md sm:px-6"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 ps-16 sm:ps-20">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-950">ההרשמה לזמן הקרוב פתוחה</p>
              <p className="truncate text-xs text-navy-900/60">מקומות מוגבלים · מלגות לזכאים</p>
            </div>
            <Link
              href="/join"
              className="shrink-0 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-pearl shadow-lux transition-all hover:bg-navy-800 hover:shadow-lux-lg active:scale-95"
            >
              הרשם עכשיו
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
