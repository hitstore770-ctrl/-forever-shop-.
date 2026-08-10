"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { TEAM, type TeamMember } from "@/lib/home-data";

// Vertical list of names where hovering a row reveals a plate that trails the
// pointer.
//
// The plate is positioned by two motion values fed straight from pointermove
// and smoothed by a spring, so nothing re-renders while the pointer travels —
// React sees a state change only when the hovered row actually changes.
//
// It is a pointer-fine affordance and nothing else: on a touch screen there is
// no hover, so the role sits permanently beside each name instead and the
// plate never mounts. That is checked with a pointer-move handler rather than
// a media query, so a laptop with a touchscreen still gets both behaviours in
// the mode the visitor is actually using.

const PLATE_W = 190;
const PLATE_H = 240;

function Plate({ member }: { member: TeamMember }) {
  return (
    <div
      className="overflow-hidden border-[3px] border-kb bg-kb-inv"
      style={{ width: PLATE_W, height: PLATE_H }}
    >
      {member.src ? (
        <Image
          src={member.src}
          alt={member.name}
          width={PLATE_W}
          height={PLATE_H}
          className="h-full w-full object-cover"
        />
      ) : (
        // Until portraits exist: the role, set large on the dark ground with a
        // bronze rule. Reads as a designed plate rather than a missing image.
        <div className="flex h-full w-full flex-col justify-between p-4 text-kb-inv">
          <span className="h-[3px] w-10 bg-kb-accent" />
          <span className="text-xl leading-tight font-extrabold tracking-[-0.03em]">
            {member.role}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TeamList() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 500, damping: 42, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 500, damping: 42, mass: 0.6 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if (!isPointerFine) setIsPointerFine(true);
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    rawX.set(event.clientX - bounds.left - PLATE_W / 2);
    rawY.set(event.clientY - bounds.top - PLATE_H / 2);
  }

  const showPlate = isPointerFine && !prefersReducedMotion && activeIndex !== null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActiveIndex(null)}
      className="relative"
    >
      <ul className="border-t-[3px] border-kb">
        {TEAM.map((member, index) => (
          <li key={member.name} className="border-b-[3px] border-kb">
            <div
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                setActiveIndex(index);
              }}
              className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 transition-colors duration-200 sm:py-8"
            >
              <h3 className="text-2xl font-extrabold tracking-[-0.035em] text-kb transition-colors duration-200 group-hover:text-kb-accent sm:text-5xl">
                <span className="me-3 align-middle text-[0.55rem] font-bold tracking-[0.3em] text-kb-faint tabular-nums sm:me-5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {member.name}
              </h3>
              <p className="text-sm font-bold tracking-tight text-kb-dim sm:text-lg">
                {member.role}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {showPlate ? (
          <motion.div
            key="plate"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute top-0 left-0 z-20"
          >
            <Plate member={TEAM[activeIndex]} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
