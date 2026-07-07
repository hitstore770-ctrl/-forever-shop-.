"use client";

import { motion, type Variants } from "framer-motion";
import { PinIcon } from "@/components/icons";
import { UPCOMING_EVENTS } from "@/lib/events-data";

const ROTATIONS = ["sm:-rotate-2", "sm:rotate-2", "sm:-rotate-1", "sm:rotate-1"];
const ACCENTS = ["bg-cream", "bg-copper-300", "bg-cream-dark", "bg-cream"];

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// A physical corkboard, pinned notes and all — each event card gets a
// push-pin, a slight rotation, and a hard shadow, like it was actually
// tacked up by hand.
export default function EventBulletinBoard() {
  return (
    <div className="border-4 border-black bg-navy-950 p-6 shadow-brutal-lg sm:p-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {UPCOMING_EVENTS.map((event, index) => (
          <motion.div
            key={event.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeIn}
            className={`relative border-4 border-black p-5 pt-8 shadow-brutal ${ROTATIONS[index % ROTATIONS.length]} ${ACCENTS[index % ACCENTS.length]}`}
          >
            <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
              <PinIcon className="h-4 w-4" />
            </span>

            <p className="text-xs font-semibold tracking-widest text-copper-600 uppercase">{event.date}</p>
            <h3 className="mt-1 text-lg font-semibold text-navy-950">{event.title}</h3>
            <p className="mt-2 text-sm font-normal text-navy-700/80">{event.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
