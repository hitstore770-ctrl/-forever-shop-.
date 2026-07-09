"use client";

import { motion } from "framer-motion";
import StaffBioCard from "@/components/yeshiva/StaffBioCard";
import type { StaffMember } from "@/lib/staff-data";
import { staggerContainer } from "@/lib/motion-variants";

// Orchestrates the leadership grid's entrance. Data comes from Firestore via
// a server-fetched `staff` prop.
export default function LeadershipGrid({ staff }: { staff: StaffMember[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.12)}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2"
    >
      {staff.map((member, index) => (
        <StaffBioCard key={member.id} staff={member} index={index} />
      ))}
    </motion.div>
  );
}
