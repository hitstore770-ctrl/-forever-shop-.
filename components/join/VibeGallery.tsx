"use client";

import { motion, type Variants } from "framer-motion";

// Placeholder photos ("the vibe") to sit alongside the visit form, arranged
// in a straight, evenly aligned grid. TODO: swap each block for a real
// candid photo (farbrengen, chavruta learning, etc.) via next/image once
// assets are ready.
const PHOTOS = [
  { label: "📷 פארברענגען", bg: "bg-navy-900 text-cream" },
  { label: "📷 סדר לימוד", bg: "bg-copper-400 text-navy-950" },
  { label: "📷 טיול שנתי", bg: "bg-cream-dark text-navy-900" },
  { label: "📷 ריקודים", bg: "bg-navy-800 text-cream" },
];

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function VibeGallery() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-2 gap-4"
    >
      {PHOTOS.map((photo) => (
        <motion.div
          key={photo.label}
          variants={fadeScale}
          className={`flex h-44 items-center justify-center overflow-hidden border-4 border-black p-3 text-center shadow-brutal sm:h-52 ${photo.bg}`}
        >
          <span className="font-mono text-xs tracking-widest uppercase opacity-70">{photo.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
