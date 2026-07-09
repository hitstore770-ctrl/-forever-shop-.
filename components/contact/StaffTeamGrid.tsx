"use client";

import { motion } from "framer-motion";
import StaffCard from "@/components/contact/StaffCard";
import type { StaffMember } from "@/lib/staff-data";
import { staggerContainer } from "@/lib/motion-variants";

// Orchestrates the staff grid's entrance — cards stagger in together. Data
// comes from Firestore via a server-fetched `staff` prop.
export default function StaffTeamGrid({ staff }: { staff: StaffMember[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.1)}
      className="grid grid-cols-2 gap-x-6 gap-y-14 pt-4 sm:grid-cols-4"
    >
      {staff.map((member, index) => (
        <StaffCard key={member.id} staff={member} index={index} />
      ))}
    </motion.div>
  );
}
