"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { TRACKS, type TrackItem } from "@/lib/home-data";

// The four tracks, as hard-ruled tiles.
//
// The separators are not borders: the grid itself is filled with the dark
// token and the gap is 3px, so every cell is a tile sitting on that ground.
// That gives perfectly even rules with no per-cell edge arithmetic and no
// doubled lines where two cells meet — the thing that makes bordered grids
// drift out of alignment as spans change.
//
// Because the dark ground shows through the gaps, the entrance animation runs
// on an inner wrapper while the tile itself stays opaque. Fading the tile
// would flash the ground through it.

function TrackCell({ item, index }: { item: TrackItem; index: number }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

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
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1.08, 0.93]);

  const isInverted = Boolean(item.inverted);

  return (
    <div ref={cellRef} className={cn("bg-kb", item.span)}>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        // Very stiff, fully damped: the tile arrives hard and stops dead.
        transition={{
          type: "spring",
          stiffness: 520,
          damping: 30,
          mass: 0.6,
          delay: index * 0.05,
        }}
        className={cn(
          "flex h-full flex-col p-6 sm:p-9",
          isInverted ? "bg-kb-inv text-kb-inv" : "bg-kb text-kb",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "text-[0.6rem] font-bold tracking-[0.3em] tabular-nums",
              isInverted ? "opacity-55" : "text-kb-faint",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "border px-2 py-1 text-[0.55rem] font-extrabold tracking-[0.12em]",
              isInverted
                ? "border-current opacity-70"
                : "border-kb-accent text-kb-accent",
            )}
          >
            {item.meta}
          </span>
        </div>

        <motion.h3
          style={prefersReducedMotion ? undefined : { scale }}
          className="mt-10 origin-right text-2xl leading-[0.98] font-extrabold tracking-[-0.04em] sm:mt-16 sm:text-4xl"
        >
          {item.title}
        </motion.h3>

        <p
          className={cn(
            "mt-4 text-sm leading-snug font-medium sm:text-base",
            isInverted ? "opacity-70" : "text-kb-dim",
          )}
        >
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function SharpGrid() {
  return (
    <div className="grid grid-cols-2 gap-[3px] border-[3px] border-kb bg-kb-inv sm:grid-cols-3">
      {TRACKS.map((item, index) => (
        <TrackCell key={item.title} item={item} index={index} />
      ))}
    </div>
  );
}
