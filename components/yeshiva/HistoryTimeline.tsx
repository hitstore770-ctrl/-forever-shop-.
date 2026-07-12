"use client";

import { motion } from "framer-motion";
import type { HistoryMilestone } from "@/lib/yeshiva-data";
import { fadeInUp, staggerContainer, hoverTilt } from "@/lib/motion-variants";

// Same torn-notepad clip-path used by the Contact page's WhatsApp CTA,
// reused here at card scale to keep the "torn paper" motif consistent
// across the site. box-shadow doesn't follow clip-path, so each card uses
// filter: drop-shadow for its hard offset shadow instead.
const TORN_PAPER_CLIP =
  "polygon(0% 4%, 8% 0%, 16% 4%, 24% 0%, 32% 4%, 40% 0%, 48% 4%, 56% 0%, 64% 4%, 72% 0%, 80% 4%, 88% 0%, 96% 4%, 100% 0%, 100% 96%, 92% 100%, 84% 96%, 76% 100%, 68% 96%, 60% 100%, 52% 96%, 44% 100%, 36% 96%, 28% 100%, 20% 96%, 12% 100%, 4% 96%, 0% 100%)";

const ACCENTS = ["bg-copper-300", "bg-cream-dark", "bg-copper-300", "bg-cream-dark"];
const ROTATIONS = [-1.5, 1.2, -1, 1.5];

// A vertical run of torn-notepad milestone cards — the yeshiva's story told as
// pages ripped off the same pad. Firestore-backed (the "history" collection,
// editable from /admin); each milestone can carry an archive image. Cards
// reveal gently on scroll (whileInView stagger). Each card's rotation is baked
// into its "show" variant (not a raw transform string) since Framer Motion
// owns the whole inline transform once it animates opacity/y on the element.
export default function HistoryTimeline({ milestones }: { milestones: HistoryMilestone[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.12)}
      className="space-y-10"
    >
      {milestones.map((milestone, index) => (
        <motion.div
          key={milestone.id}
          variants={fadeInUp(ROTATIONS[index % ROTATIONS.length])}
          whileHover={hoverTilt}
          className="mx-auto max-w-2xl"
          style={{ filter: "drop-shadow(6px 6px 0 #000)" }}
        >
          <div
            className={`border-4 border-black ${ACCENTS[index % ACCENTS.length]}`}
            style={{ clipPath: TORN_PAPER_CLIP }}
          >
            {milestone.imageUrl && (
              <div className="border-b-4 border-black bg-navy-900">
                {/* Archive photo — arbitrary uploaded/external URL, so a native
                    lazy <img> avoids next/image's per-host allow-list. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={milestone.imageUrl}
                  alt={milestone.title}
                  loading="lazy"
                  className="h-48 w-full object-cover sm:h-60"
                />
              </div>
            )}
            <div className="px-7 py-8 sm:px-10">
              <p className="font-mono text-sm font-semibold tracking-widest text-navy-900/70 uppercase">
                {milestone.year}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-navy-950 sm:text-2xl">{milestone.title}</h3>
              <p className="mt-2 text-sm font-normal text-navy-800/80 sm:text-base">{milestone.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
