"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Tall welcome section at the top of the homepage.
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-navy-900 text-cream">
      {/*
        Background placeholder. Swap this div for a real photo/video, e.g.:
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src="/hero.mp4" />
        or a next/image with `fill` and object-cover.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-950" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, var(--color-copper-700), transparent 55%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
      >
        <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight sm:text-6xl">
          מקום של תורה, חום ומשפחה
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-cream/80 sm:text-xl">
          ישיבה המטפחת תלמידים בלימוד, בערכים ובאהבת ישראל — לתמימים ולמקרבים כאחד
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/learning"
            className="rounded-2xl bg-copper-500 px-8 py-4 text-base font-semibold text-navy-950 shadow-lg shadow-copper-900/30 transition hover:bg-copper-400"
          >
            בואו ללמוד
          </Link>
          <Link
            href="/donate"
            className="rounded-2xl border border-cream/30 bg-cream/10 px-8 py-4 text-base font-semibold backdrop-blur-md transition hover:bg-cream/20"
          >
            תמכו בנו
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
