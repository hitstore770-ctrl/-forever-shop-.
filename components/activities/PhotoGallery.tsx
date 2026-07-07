"use client";

import { motion, type Variants } from "framer-motion";
import { CameraIcon } from "@/components/icons";
import { DoodleTape, DoodleStamp } from "@/components/doodles";
import { GALLERY_PHOTOS } from "@/lib/activities-data";

const HEIGHT_BY_SIZE: Record<(typeof GALLERY_PHOTOS)[number]["size"], string> = {
  sm: "h-48",
  md: "h-64",
  lg: "h-80",
};

const ACCENTS = [
  "bg-navy-900 text-cream",
  "bg-copper-400 text-navy-950",
  "bg-cream-dark text-navy-900",
  "bg-navy-800 text-cream",
];

const ROTATIONS = ["sm:-rotate-2", "sm:rotate-2", "sm:-rotate-1", "sm:rotate-1", ""];

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// Asymmetrical masonry gallery — CSS multi-column layout so photo heights
// vary naturally without any JS layout calculation. Deliberately loose and
// a little chaotic (unlike the straightened card grids elsewhere on the
// site) since this page is explicitly meant to feel like a scattered photo
// wall.
export default function PhotoGallery() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: 0.06 }}
      className="columns-1 gap-6 sm:columns-2 lg:columns-3"
    >
      {GALLERY_PHOTOS.map((photo, index) => (
        <motion.div key={photo.id} variants={fadeIn} className="mb-6 break-inside-avoid">
          <div
            className={`relative overflow-hidden border-4 border-black shadow-brutal-lg transition-transform hover:z-10 hover:scale-[1.02] ${ROTATIONS[index % ROTATIONS.length]}`}
          >
            {/* TODO: swap for a real photo via next/image (object-cover) once assets exist */}
            <div
              className={`flex ${HEIGHT_BY_SIZE[photo.size]} flex-col items-center justify-center gap-3 p-4 text-center ${ACCENTS[index % ACCENTS.length]}`}
            >
              <CameraIcon className="h-8 w-8 opacity-50" />
              <span className="font-mono text-xs tracking-widest uppercase opacity-70">{photo.caption}</span>
            </div>

            {index % 2 === 0 && (
              <DoodleTape className="pointer-events-none absolute -top-2 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3 text-copper-300" />
            )}
            {index % 3 === 1 && (
              <DoodleStamp className="pointer-events-none absolute -right-4 -bottom-4 h-12 w-12 rotate-12 text-copper-300/80" />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
