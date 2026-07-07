"use client";

import { motion, type Variants } from "framer-motion";
import { ClockIcon } from "@/components/icons";
import { SCHEDULE_ITEMS } from "@/lib/join-data";

const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Straight, evenly aligned grid for the daily schedule — same brutalist
// borders/shadows as the rest of the site, no rotation or staggered offsets.
export default function ScheduleTimeline() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      {SCHEDULE_ITEMS.map((item, index) => {
        const accent = ACCENTS[index % ACCENTS.length];

        return (
          <motion.div
            key={item.time}
            variants={fadeIn}
            className={`border-4 border-black p-6 shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none ${accent}`}
          >
            <p className="flex items-center gap-2 text-2xl font-semibold">
              <ClockIcon className="h-5 w-5" />
              {item.time}
            </p>
            <p className="mt-2 text-lg font-semibold">{item.title}</p>
            {item.note && <p className="mt-1 text-sm font-normal opacity-70">{item.note}</p>}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
