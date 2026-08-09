"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Neo-brutalist push button: the face sits offset from a hard black echo, and
// pressing it drives the face down-and-right into the echo until the two line
// up. No blur, no easing curve you can see — it reads as a physical key.
//
// The echo is a real sibling element, not a box-shadow, for two reasons. It
// lets the solid variant use an *outlined* echo — a black face over a black
// shadow is one indistinguishable blob, whereas a black face over a black
// outline reads as depth while staying strictly monochrome. And it means the
// press animates nothing but a transform: no repaint, no shadow interpolation,
// which is what keeps it instant under a finger on a mid-range phone.

const OFFSET_PX = 7;

export type BrutalButtonProps = {
  href: string;
  children: ReactNode;
  /** solid = black face + outlined echo. outline = white face + solid echo. */
  variant?: "solid" | "outline";
  className?: string;
};

export default function BrutalButton({
  href,
  children,
  variant = "solid",
  className,
}: BrutalButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const isSolid = variant === "solid";

  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 border-2 border-black",
          isSolid ? "bg-transparent" : "bg-black",
        )}
        style={{ transform: `translate(${OFFSET_PX}px, ${OFFSET_PX}px)` }}
      />

      <motion.span
        className="relative inline-block"
        whileTap={{ x: OFFSET_PX, y: OFFSET_PX }}
        whileHover={prefersReducedMotion ? undefined : { x: -2, y: -2 }}
        // Overdamped and very stiff: it arrives immediately and does not
        // wobble on the way. A bouncy CTA undercuts the whole idea.
        transition={{ type: "spring", stiffness: 1200, damping: 60, mass: 0.4 }}
      >
        <Link
          href={href}
          className={cn(
            "block border-2 border-black px-9 py-5 text-base font-extrabold tracking-tight",
            isSolid ? "bg-black text-white" : "bg-white text-black",
          )}
        >
          {children}
        </Link>
      </motion.span>
    </span>
  );
}
