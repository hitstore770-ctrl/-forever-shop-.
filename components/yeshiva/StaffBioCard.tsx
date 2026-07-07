"use client";

import { motion } from "framer-motion";
import { UserIcon } from "@/components/icons";
import { DoodleTape } from "@/components/doodles";
import type { StaffMember } from "@/lib/contact-data";
import { fadeInUp, hoverTilt } from "@/lib/motion-variants";

const ACCENTS = ["bg-navy-900 text-cream", "bg-copper-400 text-navy-950", "bg-cream-dark text-navy-900", "bg-navy-800 text-cream"];
const TAPE_ROTATIONS = ["-rotate-6", "rotate-3", "-rotate-3", "rotate-6"];

// Leadership bio card for the "Yeshiva" (About) page — a wider layout than
// the compact Contact-page StaffCard, with room for a full bio paragraph
// alongside the photo placeholder. Entrance is orchestrated by the parent
// grid's stagger container.
export default function StaffBioCard({ staff, index }: { staff: StaffMember; index: number }) {
  return (
    <motion.div
      variants={fadeInUp()}
      whileHover={hoverTilt}
      className="relative flex flex-col gap-5 border-4 border-black bg-cream p-5 shadow-brutal-lg sm:flex-row sm:items-start"
    >
      <div className="relative shrink-0 self-center sm:self-start">
        <DoodleTape
          className={`pointer-events-none absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 text-copper-300 ${TAPE_ROTATIONS[index % TAPE_ROTATIONS.length]}`}
        />
        <div className={`flex h-32 w-32 items-center justify-center border-4 border-black ${ACCENTS[index % ACCENTS.length]}`}>
          <UserIcon className="h-14 w-14 opacity-60" />
        </div>
      </div>

      <div className="text-center sm:text-right">
        <h3 className="text-xl font-semibold text-navy-950">{staff.name}</h3>
        <p className="mt-1 text-sm font-semibold tracking-wide text-copper-600 uppercase">{staff.role}</p>
        {staff.bio && <p className="mt-3 text-sm font-normal text-navy-700/80">{staff.bio}</p>}
      </div>
    </motion.div>
  );
}
