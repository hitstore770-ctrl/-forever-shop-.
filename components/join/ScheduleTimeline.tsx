"use client";

import { motion, type Variants } from "framer-motion";
import { ClockIcon } from "@/components/icons";
import { SCHEDULE_ITEMS } from "@/lib/join-data";

const ROTATIONS = ["sm:-rotate-1", "sm:rotate-1", "sm:-rotate-2"];
const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Asymmetrical vertical timeline for the daily schedule.
// On lg+ each block alternates sides of a central spine; below that it's a
// simple stacked list (still rotated/shadowed so it stays "brutalist", not flat).
export default function ScheduleTimeline() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative space-y-6 lg:space-y-10"
    >
      {/* central spine, lg+ only */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-1 -translate-x-1/2 bg-black lg:block" />

      {SCHEDULE_ITEMS.map((item, index) => {
        const isEven = index % 2 === 0;
        const rotate = ROTATIONS[index % ROTATIONS.length];
        const accent = ACCENTS[index % ACCENTS.length];

        return (
          <motion.div
            key={item.time}
            variants={fadeIn}
            className={`relative lg:flex ${isEven ? "lg:justify-start" : "lg:justify-end"}`}
          >
            <span className="absolute top-7 left-1/2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-black bg-copper-500 lg:block" />
            <div
              className={`border-4 border-black p-6 shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none lg:w-[calc(50%-2.5rem)] ${rotate} ${accent}`}
            >
              <p className="flex items-center gap-2 text-2xl font-black">
                <ClockIcon className="h-5 w-5" />
                {item.time}
              </p>
              <p className="mt-2 text-lg font-bold">{item.title}</p>
              {item.note && <p className="mt-1 text-sm font-medium opacity-70">{item.note}</p>}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
