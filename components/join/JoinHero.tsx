"use client";

import { motion, type Variants } from "framer-motion";
import { SquigglyUnderline, DoodleStar } from "@/components/doodles";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Massive, overlapping title section for the "Join Us" page.
export default function JoinHero() {
  return (
    <section className="relative border-b-4 border-black bg-cream pt-14 pb-16 sm:pt-20 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          {/* Decorative tag overlapping the headline */}
          <motion.span
            variants={fadeUp}
            className="absolute -top-6 right-0 z-10 border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal sm:-top-8"
          >
            אין לחץ, בואו תכירו ★
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="relative z-0 text-5xl leading-[0.92] font-semibold text-navy-950 uppercase sm:text-7xl lg:text-8xl"
          >
            בואו ללמוד
            <br />
            <span className="relative -mt-2 inline-block bg-copper-500 px-3 text-cream sm:-mt-4">
              אצלנו
              <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800 sm:text-xl"
          >
            בלי לחץ, בלי שיפוטיות - רק מקום חם ללמוד, לשאול, ולמצוא את הקצב שלכם.
            תלמידים חדשים ותיקים, כולם בבית.
          </motion.p>
        </motion.div>

        <DoodleStar className="pointer-events-none absolute bottom-2 left-10 hidden h-10 w-10 text-copper-500 xl:block" />
      </div>
    </section>
  );
}
