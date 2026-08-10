"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/site-config";
import { haptic } from "@/lib/haptics";

// The two floating buttons, kept in one component because their only real
// design constraint is each other: they share a column above the fixed bottom
// navigation and must never overlap it or one another.
//
// Both offsets are computed from --kb-nav-h plus the iOS home-indicator inset,
// so the stack stays correct if the bar's height changes. They are written as
// inline styles rather than Tailwind arbitrary values because the expressions
// mix a custom property with env().
//
// WhatsApp appears once the hero is behind you; back-to-top waits until 70% of
// the document has been scrolled, which on this page is roughly the FAQ.

const WHATSAPP_AFTER_VH = 0.75;
const BACK_TO_TOP_AFTER = 0.7;

const FAB_SIZE = "3.25rem";
const BASE_GAP = "0.75rem";
const STACK_GAP = "4.5rem";

function offset(gap: string) {
  return `calc(var(--kb-nav-h) + env(safe-area-inset-bottom) + ${gap})`;
}

const SNAP = { type: "spring", stiffness: 700, damping: 34, mass: 0.7 } as const;

export default function FloatingActions() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroThresholdRef = useRef(Number.POSITIVE_INFINITY);

  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    const measure = () => {
      heroThresholdRef.current = window.innerHeight * WHATSAPP_AFTER_VH;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setShowWhatsApp(value > heroThresholdRef.current);
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setShowBackToTop(value > BACK_TO_TOP_AFTER);
  });

  return (
    <>
      <AnimatePresence>
        {showBackToTop ? (
          <motion.button
            key="top"
            type="button"
            onClick={() => {
              haptic(30);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="חזרה לראש העמוד"
            initial={{ x: "-160%" }}
            animate={{ x: 0 }}
            exit={{ x: "-160%" }}
            transition={SNAP}
            whileTap={{ x: 3, y: 3 }}
            style={{ bottom: offset(STACK_GAP), height: FAB_SIZE, width: FAB_SIZE }}
            className="fixed left-4 z-40 flex items-center justify-center border-2 border-kb bg-kb text-kb shadow-[4px_4px_0_0_var(--kb-fg)]"
          >
            <ChevronDownIcon className="h-6 w-6 rotate-180" aria-hidden="true" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showWhatsApp ? (
          <motion.a
            key="wa"
            href={buildWhatsAppLink("שלום, אשמח לקבל מידע נוסף")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic(50)}
            aria-label="שלחו לנו הודעה בוואטסאפ"
            initial={{ x: "-160%" }}
            animate={{ x: 0 }}
            exit={{ x: "-160%" }}
            transition={SNAP}
            whileTap={{ x: 3, y: 3 }}
            style={{ bottom: offset(BASE_GAP), height: FAB_SIZE, width: FAB_SIZE }}
            className="fixed left-4 z-40 flex items-center justify-center border-2 border-kb bg-kb-inv text-kb-inv shadow-[4px_4px_0_0_var(--kb-fg)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.997zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </>
  );
}
