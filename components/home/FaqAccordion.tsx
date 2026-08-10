"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HOME_FAQ } from "@/lib/home-data";
import { haptic } from "@/lib/haptics";

// Accordion with no easing at all. Panels appear and disappear on the frame
// the button is pressed — `duration: 0` on a height animation is a hard cut,
// not a fast one, which is the difference between this reading as mechanical
// and reading as merely quick.
//
// One panel at a time. The plus/minus is a pair of rules rather than an icon
// so it stays exactly as heavy as the borders around it.

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-[3px] border-kb bg-kb">
      {HOME_FAQ.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-b-[3px] border-kb last:border-b-0">
            <h3>
              <button
                type="button"
                onClick={() => {
                  haptic(20);
                  setOpenIndex(isOpen ? null : index);
                }}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className={`flex w-full items-center justify-between gap-4 p-5 text-start sm:p-7 ${
                  isOpen ? "bg-kb-inv text-kb-inv" : "bg-kb text-kb"
                }`}
              >
                <span className="text-lg font-extrabold tracking-[-0.02em] sm:text-2xl">
                  {item.question}
                </span>

                {/* Plus that loses its vertical stroke when open. */}
                <span
                  aria-hidden="true"
                  className="relative block h-5 w-5 shrink-0"
                >
                  <span className="absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 bg-current" />
                  {isOpen ? null : (
                    <span className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 bg-current" />
                  )}
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-panel-${index}`}
                  key="panel"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0 }}
                  className="overflow-hidden"
                >
                  <p className="border-t-[3px] border-kb p-5 text-base leading-snug font-medium text-kb-dim sm:p-7 sm:text-lg">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
