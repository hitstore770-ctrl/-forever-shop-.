"use client";

import { motion } from "framer-motion";
import { ClockIcon } from "@/components/icons";
import type { ScheduleItem } from "@/lib/schedule-data";
import { fadeInUp, staggerContainer, hoverTilt } from "@/lib/motion-variants";

const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];

// Straight, evenly aligned grid for the daily schedule. Data now comes from
// Firestore (the "schedule" collection) via a server-fetched `items` prop,
// so staff can edit it from /admin without a deploy. Hover tilt via
// whileHover (not a CSS class — Framer owns this element's transform once
// it's animating y).
export default function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      {items.map((item, index) => {
        const accent = ACCENTS[index % ACCENTS.length];

        return (
          <motion.div
            key={item.id}
            variants={fadeInUp()}
            whileHover={hoverTilt}
            className={`border-4 border-black p-6 shadow-brutal transition-shadow ${accent}`}
          >
            <p className="flex items-center gap-2 text-2xl font-semibold">
              <ClockIcon className="h-5 w-5" />
              {item.time}
            </p>
            <p className="mt-2 text-lg font-semibold">{item.title}</p>
            {item.subtext && <p className="mt-1 text-sm font-normal opacity-70">{item.subtext}</p>}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
