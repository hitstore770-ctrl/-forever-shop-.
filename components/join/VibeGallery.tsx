"use client";

import { motion, type Variants } from "framer-motion";

// Scattered, overlapping placeholder photos ("the vibe") to sit alongside
// the visit form. TODO: swap each block for a real candid photo (farbrengen,
// chavruta learning, etc.) via next/image once assets are ready.
const PHOTOS = [
  { label: "📷 פארברענגען", className: "top-0 right-4 h-44 w-40 rotate-6 sm:h-52 sm:w-48", bg: "bg-navy-900 text-cream" },
  { label: "📷 סדר לימוד", className: "top-16 left-0 h-40 w-36 -rotate-3 sm:h-48 sm:w-44", bg: "bg-copper-400 text-navy-950" },
  { label: "📷 טיול שנתי", className: "bottom-0 right-10 h-36 w-36 -rotate-6 sm:h-44 sm:w-44", bg: "bg-cream-dark text-navy-900" },
  { label: "📷 ריקודים", className: "bottom-6 left-6 h-32 w-32 rotate-3 sm:h-40 sm:w-40", bg: "bg-navy-800 text-cream" },
];

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function VibeGallery() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.1 }}
      className="relative h-[420px] sm:h-[480px]"
    >
      {PHOTOS.map((photo) => (
        <motion.div
          key={photo.label}
          variants={fadeScale}
          className={`absolute flex items-center justify-center overflow-hidden border-4 border-black p-3 text-center shadow-brutal ${photo.className} ${photo.bg}`}
        >
          <span className="font-mono text-xs tracking-widest uppercase opacity-70">{photo.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
