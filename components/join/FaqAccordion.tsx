"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { FAQ_ITEMS } from "@/lib/join-data";

// Accordion built on the CSS grid-rows 0fr/1fr trick, so the answer slides
// open/closed with a real height animation without measuring pixels in JS.
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-4 border-black bg-cream shadow-brutal">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
            >
              <span className="text-lg font-semibold text-navy-950">{item.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-copper-400 text-navy-950 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t-4 border-black px-5 py-4 font-normal text-navy-800">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
