"use client";

import { motion } from "framer-motion";
import StaffBioCard from "@/components/yeshiva/StaffBioCard";
import { STAFF_MEMBERS } from "@/lib/contact-data";
import { staggerContainer } from "@/lib/motion-variants";

// Orchestrates the leadership grid's entrance — cards stagger in together
// instead of each fading in independently off its own scroll position.
export default function LeadershipGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.12)}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2"
    >
      {STAFF_MEMBERS.map((staff, index) => (
        <StaffBioCard key={staff.id} staff={staff} index={index} />
      ))}
    </motion.div>
  );
}
