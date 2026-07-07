"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Tall hero: an oversized headline on one side, two overlapping media
// placeholders (straight, hard-edged) on the other. Grid columns are
// physical (col-start-1 = the start edge), which under dir="rtl" lands the
// headline on the right and the media stack on the left.
export default function Hero() {
  return (
    <section className="relative border-b-4 border-black bg-cream pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* Headline block */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 lg:col-span-7"
          >
            <motion.span
              variants={fadeUp}
              className="mb-5 inline-block border-2 border-black bg-copper-400 px-3 py-1 text-xs font-black tracking-widest text-navy-950 uppercase shadow-brutal"
            >
              בס&quot;ד · ישיבת ...
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-6xl leading-[0.92] font-black tracking-tight text-navy-950 uppercase sm:text-7xl lg:text-8xl"
            >
              מקום של
              <br />
              <span className="relative inline-block bg-copper-500 px-3 text-cream">תורה</span>{" "}
              <span className="inline-block lg:-ml-3">וחום</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-md border-r-4 border-navy-900 pr-4 text-lg font-medium text-navy-800 sm:text-xl"
            >
              ישיבה שמטפחת תלמידים בלימוד, בערכים ובאהבת ישראל — לתמימים ולמקרבים כאחד.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/learning"
                className="border-4 border-black bg-copper-500 px-8 py-4 text-lg font-black text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
              >
                בואו ללמוד
              </Link>
              <Link
                href="/donate"
                className="border-4 border-black bg-navy-900 px-8 py-4 text-lg font-black text-cream uppercase shadow-brutal-copper transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
              >
                תמכו בנו
              </Link>
            </motion.div>
          </motion.div>

          {/* Media collage */}
          <div className="relative h-[340px] sm:h-[420px] lg:col-span-5">
            {/*
              TODO: swap this block for real B-roll footage or a candid photo, e.g.
              <video autoPlay muted loop playsInline className="h-full w-full object-cover" src="/hero.mp4" />
              or a next/image with `fill` + object-cover.
            */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute inset-0 translate-x-4 overflow-hidden border-4 border-black bg-navy-900 shadow-brutal-lg"
            >
              <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--color-navy-600),var(--color-navy-950))]">
                <div className="absolute inset-0 bg-grain mix-blend-overlay" />
                <span className="font-mono text-xs tracking-[0.3em] text-cream/40 uppercase">
                  🎥 B-ROLL PLACEHOLDER
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 h-40 w-40 overflow-hidden rounded-2xl border-4 border-black bg-copper-400 shadow-brutal sm:h-52 sm:w-52"
            >
              <div className="flex h-full items-center justify-center p-3 text-center">
                <span className="font-mono text-[10px] tracking-widest text-navy-950/70 uppercase">
                  📷 candid photo placeholder
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -top-5 right-4 border-2 border-black bg-cream px-3 py-1 text-xs font-black uppercase shadow-brutal sm:right-8"
            >
              תמימים ומקרבים ★
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
