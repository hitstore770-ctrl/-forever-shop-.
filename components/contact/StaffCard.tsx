"use client";

import { motion, type Variants } from "framer-motion";
import { UserIcon } from "@/components/icons";
import { DoodleTape } from "@/components/doodles";
import type { StaffMember } from "@/lib/contact-data";

const ACCENTS = ["bg-navy-900 text-cream", "bg-copper-400 text-navy-950", "bg-cream-dark text-navy-900", "bg-navy-800 text-cream"];
const ROTATIONS = ["sm:-rotate-2", "sm:rotate-2", "sm:-rotate-1", "sm:rotate-1"];
const TAPE_ROTATIONS = ["-rotate-6", "rotate-3", "-rotate-3", "rotate-6"];

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Brutalist staff profile card — a photo placeholder "pinned" at an angle
// with washi tape, plus a name/role plate below. Slight alternating
// rotation per card, per the deliberately loose feel of this page.
export default function StaffCard({ staff, index }: { staff: StaffMember; index: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeIn}
      className={`relative border-4 border-black bg-cream p-4 shadow-brutal-lg ${ROTATIONS[index % ROTATIONS.length]}`}
    >
      <DoodleTape
        className={`pointer-events-none absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 text-copper-300 ${TAPE_ROTATIONS[index % TAPE_ROTATIONS.length]}`}
      />

      <div className={`flex h-40 items-center justify-center border-4 border-black ${ACCENTS[index % ACCENTS.length]}`}>
        <UserIcon className="h-16 w-16 opacity-60" />
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-navy-950">{staff.name}</h3>
        <p className="mt-1 text-sm font-semibold tracking-wide text-copper-600 uppercase">{staff.role}</p>
      </div>
    </motion.div>
  );
}
