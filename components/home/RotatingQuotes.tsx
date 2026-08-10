"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HOME_QUOTES } from "@/lib/home-data";

// Inverted slab that cycles alumni quotes on a three-second beat.
//
// The swap is a hard cut — no crossfade, no easing. That is the point: a
// dissolve would read as soft and apologetic, while an instant replacement
// reads like a split-flap board changing. The counter in the corner is what
// tells you a change happened.
//
// The block reserves the height of the tallest quote so the page below it does
// not shift every three seconds. It does that by rendering every quote stacked
// in one grid cell and hiding all but the current one with visibility rather
// than display, which keeps them all contributing to the measured height.
//
// Under reduced motion it stops on the first quote and shows manual controls
// instead — an element that rewrites itself on a timer is precisely what that
// setting is asking us not to do.

const INTERVAL_MS = 3000;

export default function RotatingQuotes() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || HOME_QUOTES.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % HOME_QUOTES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <div className="border-[3px] border-kb bg-kb-inv p-6 text-kb-inv sm:p-12">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[0.55rem] font-bold tracking-[0.3em] opacity-55">בוגרים</span>
        <span className="text-[0.65rem] font-extrabold tracking-[0.2em] tabular-nums opacity-70">
          {String(index + 1).padStart(2, "0")} / {String(HOME_QUOTES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Every quote occupies the same grid cell; the tallest sets the height. */}
      <div className="mt-8 grid sm:mt-12">
        {HOME_QUOTES.map((quote, quoteIndex) => (
          <blockquote
            key={quote.text}
            aria-hidden={quoteIndex !== index}
            style={{
              gridArea: "1 / 1",
              visibility: quoteIndex === index ? "visible" : "hidden",
            }}
          >
            <p className="text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-5xl">
              „{quote.text}”
            </p>
            <footer className="mt-6 text-xs font-bold tracking-tight opacity-65 sm:text-sm">
              {quote.author} · {quote.detail}
            </footer>
          </blockquote>
        ))}
      </div>

      {prefersReducedMotion ? (
        <div className="mt-8 flex gap-2">
          {HOME_QUOTES.map((quote, quoteIndex) => (
            <button
              key={quote.text}
              type="button"
              onClick={() => setIndex(quoteIndex)}
              aria-label={`ציטוט ${quoteIndex + 1}`}
              aria-current={quoteIndex === index}
              className={`h-7 w-7 border-2 text-[0.6rem] font-extrabold ${
                quoteIndex === index
                  ? "border-kb bg-kb text-kb"
                  : "border-current bg-transparent"
              }`}
              style={{ borderColor: "currentColor" }}
            >
              {quoteIndex + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
