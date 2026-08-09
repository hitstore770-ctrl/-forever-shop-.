"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  BookIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  HeartHandIcon,
  UsersIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import { SHARP_GRID_ITEMS, type SharpGridItem } from "@/lib/home-data";

// Hard-ruled grid. The separators are not borders: the grid itself is black
// and the gap is 3px, so every cell is a white tile sitting on black. That
// gives perfectly even rules with no per-cell edge arithmetic and no doubled
// lines where two cells meet — the thing that makes bordered grids drift out
// of alignment as spans change.
//
// Because the black shows through the gaps, the entrance animation runs on an
// inner wrapper while the tile itself stays opaque white. Fading the tile
// would flash the black ground through it.

const ICONS: Record<SharpGridItem["icon"], typeof BookIcon> = {
  schedule: ClockIcon,
  gallery: CameraIcon,
  staff: UsersIcon,
  learning: BookIcon,
  events: CalendarIcon,
  donate: HeartHandIcon,
};

function GridCell({ item, index }: { item: SharpGridItem; index: number }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const Icon = ICONS[item.icon];

  // Progress across the cell's whole pass through the viewport: 0 as it enters
  // from the bottom, 0.5 dead centre, 1 as it leaves the top.
  const { scrollYProgress } = useScroll({
    target: cellRef,
    offset: ["start end", "end start"],
  });

  // Peaks at centre and falls away symmetrically, so the title swells as the
  // cell passes the middle of the screen. Transform-origin is the inline start
  // (right, in RTL) so the type grows away from the reading edge instead of
  // drifting off it.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.12, 0.9]);

  const isInverted = Boolean(item.inverted);

  return (
    <div ref={cellRef} className={cn("bg-white", item.span)}>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        // Very stiff, fully damped: the tile arrives hard and stops dead.
        transition={{
          type: "spring",
          stiffness: 520,
          damping: 30,
          mass: 0.6,
          delay: index * 0.05,
        }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.975 }}
        className="h-full"
      >
        <Link
          href={item.href}
          className={cn(
            "group flex h-full flex-col p-6 sm:p-8",
            isInverted ? "bg-black text-white" : "bg-white text-black",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={cn(
                "text-[0.65rem] font-bold tracking-[0.3em] tabular-nums",
                isInverted ? "text-white/50" : "text-black/40",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
          </div>

          <motion.h3
            style={prefersReducedMotion ? undefined : { scale }}
            className="mt-10 origin-right text-3xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:mt-14 sm:text-5xl"
          >
            {item.title}
          </motion.h3>

          <p
            className={cn(
              "mt-4 text-sm leading-snug font-medium",
              isInverted ? "text-white/70" : "text-black/60",
            )}
          >
            {item.description}
          </p>

          <span className="mt-auto pt-8 text-sm font-extrabold tracking-tight transition-transform duration-200 group-hover:-translate-x-1.5">
            {item.cta} ←
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

export default function SharpGrid() {
  return (
    <div className="grid grid-cols-2 gap-[3px] border-[3px] border-black bg-black sm:grid-cols-3">
      {SHARP_GRID_ITEMS.map((item, index) => (
        <GridCell key={item.href} item={item} index={index} />
      ))}
    </div>
  );
}
