"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import MaskReveal from "@/components/home/MaskReveal";
import { VISION } from "@/lib/home-data";

// The statement of approach, set as large as the hero and revealed by scroll
// rather than on load.
//
// Two layers of motion, both transform-only:
// - Each line rides up from behind its own mask as it enters view.
// - The whole block drifts a little slower than the page as it passes, which
//   is what makes oversized type feel like it has weight instead of being a
//   static picture of large text.
//
// The parallax is deliberately small. On a phone a big offset means the block
// arrives already half-travelled and leaves before it settles.

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={sectionRef}
      className="border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-32"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y }}
        className="mx-auto max-w-7xl"
      >
        <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent sm:text-[0.65rem]">
          {VISION.eyebrow}
        </p>

        <h2 className="mt-8 text-[2.6rem] leading-[0.95] font-extrabold tracking-[-0.045em] text-kb sm:mt-12 sm:text-[6rem] lg:text-[7.5rem]">
          {VISION.lines.map((line, index) => (
            <MaskReveal key={line} inView delay={index * 0.09} duration={0.75}>
              {line}
            </MaskReveal>
          ))}
        </h2>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 max-w-2xl border-t-2 border-kb pt-6 text-lg leading-snug font-medium text-kb-dim sm:mt-14 sm:text-2xl"
        >
          {VISION.body}
        </motion.p>
      </motion.div>
    </section>
  );
}
