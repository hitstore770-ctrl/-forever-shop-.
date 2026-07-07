"use client";

import { motion } from "framer-motion";
import StaffCard from "@/components/contact/StaffCard";
import { STAFF_MEMBERS } from "@/lib/contact-data";
import { staggerContainer } from "@/lib/motion-variants";

// Orchestrates the staff grid's entrance — cards stagger in together
// instead of each fading in independently off its own scroll position.
export default function StaffTeamGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.1)}
      className="grid grid-cols-2 gap-x-6 gap-y-14 pt-4 sm:grid-cols-4"
    >
      {STAFF_MEMBERS.map((staff, index) => (
        <StaffCard key={staff.id} staff={staff} index={index} />
      ))}
    </motion.div>
  );
}
