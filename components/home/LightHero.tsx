"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/lib/home-data";
import { SITE_NAME } from "@/lib/site-config";

// Light hero: pearl ground, oversized clean type, and a single media panel
// whose photographs crossfade into one another. Mobile-first — the type block
// and the panel are stacked and full-bleed-ish on a phone, and only spread
// into two columns once there is real width to work with.

const SLIDE_MS = 5200;
const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function LightHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || HERO_SLIDES.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden bg-pearl pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Two very soft brand-tinted washes, so the white ground reads as lit
          rather than flat. Blurred and low-opacity: felt, not seen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-copper-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -left-32 h-96 w-96 rounded-full bg-navy-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUX }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-navy-900/70 shadow-lux shadow-lux-inset">
              <span className="h-1.5 w-1.5 rounded-full bg-copper-500" />
              בס&quot;ד · {SITE_NAME}
            </span>

            <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-navy-950 sm:text-6xl lg:text-7xl">
              הישיבה שלך
              <br />
              <span className="text-copper-600">במרכז ירושלים.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed font-normal text-navy-900/70 sm:text-xl">
              ישיבת חב״ד הגדולה בירושלים לחוזרים בתשובה ומתחזקים. המקום שלך להתקרב לה׳, ולהתכונן
              לחיים.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/join"
                className="rounded-full bg-navy-900 px-8 py-4 text-base font-semibold text-pearl shadow-lux transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-lux-lg active:scale-95"
              >
                הרשם עכשיו
              </Link>
              <Link
                href="/yeshiva"
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-navy-900 shadow-lux shadow-lux-inset transition-all hover:-translate-y-0.5 hover:shadow-lux-lg active:scale-95"
              >
                על הישיבה
              </Link>
            </div>
          </motion.div>

          {/* Crossfading media panel. Every slide is stacked in the same grid
              cell and only opacity animates, so there is no layout work per
              transition — the cheapest possible crossfade. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUX, delay: 0.15 }}
            className="relative aspect-4/5 w-full overflow-hidden rounded-[2rem] bg-pearl-dark shadow-lux-lg sm:aspect-3/2 lg:aspect-4/5"
          >
            {HERO_SLIDES.map((slide, index) => (
              <motion.div
                key={slide.id}
                aria-hidden={index !== activeIndex}
                initial={false}
                animate={{ opacity: index === activeIndex ? 1 : 0 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {slide.src ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  // Placeholder until real photography is uploaded.
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-pearl-dark via-white to-copper-300/30 p-6 text-center">
                    <span className="text-sm font-medium text-navy-900/40">{slide.alt}</span>
                  </div>
                )}
              </motion.div>
            ))}

            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-navy-950/5 ring-inset" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
