"use client";

import { motion } from "framer-motion";
import { PinIcon } from "@/components/icons";
import type { UpcomingEvent } from "@/lib/events-data";
import { fadeInUp, staggerContainer, hoverTilt } from "@/lib/motion-variants";

const ROTATION_DEG = [-2, 2, -1, 1];
const ACCENTS = ["bg-cream", "bg-copper-300", "bg-cream-dark", "bg-cream"];

// A physical corkboard, pinned notes and all — each event card gets a
// push-pin, a slight rotation, and a hard shadow, like it was actually
// tacked up by hand. Cards stagger in together (via the parent's
// staggerChildren) instead of each triggering independently. An optional
// cover image sits at the top of the card when present.
export default function EventBulletinBoard({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="border-4 border-black bg-navy-950 p-6 shadow-brutal-lg sm:p-10">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.1)}
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            variants={fadeInUp(ROTATION_DEG[index % ROTATION_DEG.length])}
            whileHover={hoverTilt}
            className={`relative border-4 border-black p-5 pt-8 shadow-brutal ${ACCENTS[index % ACCENTS.length]}`}
          >
            <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
              <PinIcon className="h-4 w-4" />
            </span>

            {event.imageUrl && (
              <div className="mb-4 overflow-hidden border-2 border-black">
                {/* Arbitrary uploaded/external URL — a native lazy <img> avoids
                    next/image's per-host allow-list. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.imageUrl} alt={event.title} loading="lazy" className="h-32 w-full object-cover" />
              </div>
            )}

            <p className="text-xs font-semibold tracking-widest text-copper-600 uppercase">{event.date}</p>
            <h3 className="mt-1 text-lg font-semibold text-navy-950">{event.title}</h3>
            <p className="mt-2 text-sm font-normal text-navy-700/80">{event.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
