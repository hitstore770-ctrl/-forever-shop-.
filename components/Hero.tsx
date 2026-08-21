"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  SquigglyUnderline,
  DoodleStar,
  DoodleDots,
  DoodleZigzag,
  DoodleBoldArrow,
  DoodleFlyingDocument,
  DoodleNotebookPage,
  MarkerHighlight,
} from "@/components/doodles";
import { SITE_NAME } from "@/lib/site-config";

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
              className="relative mb-5 inline-block border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal"
            >
              בס&quot;ד · {SITE_NAME}
              <DoodleDots className="pointer-events-none absolute -top-6 -right-4 hidden h-6 w-12 text-copper-600 sm:block" />
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-6xl leading-[0.92] font-semibold tracking-tight text-navy-950 uppercase sm:text-7xl lg:text-8xl"
            >
              הישיבה שלך
              <br />
              <span className="relative inline-block bg-copper-500 px-3 text-navy-950">במרכז</span>{" "}
              <span className="relative inline-block lg:-ml-3">
                ירושלים.
                <SquigglyUnderline className="absolute -bottom-2 right-0 h-2 w-full text-copper-500" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-md border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800 sm:text-xl"
            >
              הישיבת חב״ד הגדולה בירושלים, לחוזרים בתשובה, ומתחזקים. המקום שלך{" "}
              <MarkerHighlight colorClassName="text-copper-400/60">להתקרב לה׳</MarkerHighlight>, ולהתכונן לחתונה.
            </motion.p>

            <motion.div variants={fadeUp} className="relative mt-10 flex flex-wrap items-center gap-4">
              <DoodleBoldArrow className="pointer-events-none absolute -top-9 right-4 hidden h-8 w-14 -rotate-6 text-copper-600 sm:block" />
              <Link
                href="/join"
                className="border-4 border-black bg-copper-500 px-10 py-5 text-xl font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none sm:text-2xl"
              >
                לסיור בישיבה
              </Link>
              <Link
                href="/donate"
                className="border-4 border-black bg-navy-900 px-6 py-3 text-base font-semibold text-cream uppercase shadow-brutal-copper transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
              >
                תמכו בנו
              </Link>
              <DoodleStar className="hidden h-9 w-9 shrink-0 text-copper-500 sm:block" />
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
              className="absolute -top-5 right-4 border-2 border-black bg-cream px-3 py-1 text-xs font-semibold uppercase shadow-brutal sm:right-8"
            >
על הישיבה ★
            </motion.div>

            <DoodleZigzag className="pointer-events-none absolute -bottom-2 right-2 hidden h-5 w-16 text-navy-900/40 sm:block" />
            <DoodleFlyingDocument className="pointer-events-none absolute -top-10 left-8 hidden h-16 w-20 rotate-6 text-navy-900/50 lg:block" />
            <DoodleNotebookPage className="pointer-events-none absolute top-1/2 -left-3 hidden h-16 w-12 -translate-y-1/2 -rotate-6 text-navy-900/20 xl:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
