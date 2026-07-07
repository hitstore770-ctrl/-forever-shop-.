"use client";

import { motion } from "framer-motion";
import { ClockIcon } from "@/components/icons";
import { SCHEDULE_ITEMS } from "@/lib/join-data";
import { fadeInUp, staggerContainer, hoverTilt } from "@/lib/motion-variants";

const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];

// Straight, evenly aligned grid for the daily schedule — same brutalist
// borders/shadows as the rest of the site, no persistent rotation, just a
// tilt on hover (via whileHover, not a CSS hover class — Framer Motion
// already owns this element's transform once it's animating y, so a plain
// CSS hover:translate class would silently never apply).
export default function ScheduleTimeline() {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
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
            variants={fadeInUp()}
            whileHover={hoverTilt}
            className={`border-4 border-black p-6 shadow-brutal transition-shadow ${accent}`}
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
