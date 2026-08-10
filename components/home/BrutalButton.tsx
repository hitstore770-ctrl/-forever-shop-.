"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { haptic } from "@/lib/haptics";

// Push button: the face sits offset from a hard echo, and pressing it drives
// the face down-and-right into the echo until the two line up. No blur, no
// easing you can read — it reads as a physical key.
//
// The echo is a real sibling element, not a box-shadow. That lets the solid
// variant use an *outlined* echo (a navy face over a navy shadow is one
// indistinguishable blob, whereas a navy face over a navy outline reads as
// depth) and it means the press animates nothing but a transform: no repaint,
// no shadow interpolation, which is what keeps it instant under a finger.

const OFFSET_PX = 7;

export type BrutalButtonProps = {
  children: ReactNode;
  /** Internal route. Omit when using `onClick` for in-page scrolling. */
  href?: string;
  onClick?: () => void;
  /** Renders an <a> with target=_blank. Used for the external donation link. */
  externalHref?: string;
  /** solid = navy face + outlined echo. outline = pearl face + solid echo. */
  variant?: "solid" | "outline";
  className?: string;
};

export default function BrutalButton({
  children,
  href,
  onClick,
  externalHref,
  variant = "solid",
  className,
}: BrutalButtonProps) {
  const isSolid = variant === "solid";

  const faceClass = cn(
    "block border-2 border-kb px-9 py-5 text-center text-base font-extrabold tracking-tight",
    isSolid ? "bg-kb-inv text-kb-inv" : "bg-kb text-kb",
  );

  // Every entry point taps the same haptic, so a press feels identical whether
  // it navigates, scrolls the page or leaves the site.
  const withHaptic = () => {
    haptic(50);
    onClick?.();
  };

  let face: ReactNode;
  if (externalHref) {
    face = (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={withHaptic}
        className={faceClass}
      >
        {children}
      </a>
    );
  } else if (href) {
    face = (
      <Link href={href} onClick={withHaptic} className={faceClass}>
        {children}
      </Link>
    );
  } else {
    face = (
      <button type="button" onClick={withHaptic} className={cn(faceClass, "w-full")}>
        {children}
      </button>
    );
  }

  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 border-2 border-kb",
          isSolid ? "bg-transparent" : "bg-kb-inv",
        )}
        style={{ transform: `translate(${OFFSET_PX}px, ${OFFSET_PX}px)` }}
      />

      <motion.span
        className="relative inline-block w-full"
        whileTap={{ x: OFFSET_PX, y: OFFSET_PX }}
        // Overdamped and very stiff: it arrives immediately and does not wobble
        // on the way. A bouncy CTA undercuts the whole idea.
        transition={{ type: "spring", stiffness: 1200, damping: 60, mass: 0.4 }}
      >
        {face}
      </motion.span>
    </span>
  );
}
