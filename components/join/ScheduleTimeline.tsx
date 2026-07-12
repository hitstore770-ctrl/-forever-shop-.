"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClockIcon } from "@/components/icons";
import type { ScheduleItem } from "@/lib/schedule-data";
import { fadeInUp, staggerContainer, hoverTilt } from "@/lib/motion-variants";

const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];

// Current wall-clock time in Jerusalem, in minutes since midnight — computed
// regardless of the visitor's own timezone (the sedarim run on Jerusalem time).
function jerusalemNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function parseHHmm(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

// The "active" seder is the block with the latest start time that's already
// begun — it runs until the next block starts. Returns null before the first
// block of the day.
function activeItemId(items: ScheduleItem[], nowMinutes: number): string | null {
  let bestId: string | null = null;
  let bestMinutes = -1;
  for (const item of items) {
    const minutes = parseHHmm(item.time);
    if (minutes !== null && minutes <= nowMinutes && minutes > bestMinutes) {
      bestMinutes = minutes;
      bestId = item.id;
    }
  }
  return bestId;
}

// Straight, evenly aligned grid for the daily schedule. Data comes from
// Firestore via a server-fetched `items` prop, editable from /admin. The block
// happening right now (per Jerusalem time) is highlighted with a live "עכשיו"
// badge that re-evaluates every minute.
export default function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  // Starts null so the server render (which can't know the client's clock)
  // matches the first client render — the highlight appears after mount,
  // avoiding a hydration mismatch.
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNowMinutes(jerusalemNowMinutes());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const activeId = nowMinutes === null ? null : activeItemId(items, nowMinutes);

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const accent = isActive ? "bg-copper-500 text-navy-950" : ACCENTS[index % ACCENTS.length];

        return (
          <motion.div
            key={item.id}
            variants={fadeInUp()}
            whileHover={hoverTilt}
            className={`relative border-4 border-black p-6 shadow-brutal transition-shadow ${accent} ${
              isActive ? "shadow-brutal-lg ring-4 ring-copper-500 ring-offset-2 ring-offset-cream-dark" : ""
            }`}
          >
            {isActive && (
              <span className="absolute -top-3 right-4 flex items-center gap-1.5 border-2 border-black bg-navy-950 px-2 py-0.5 text-xs font-semibold text-cream uppercase shadow-brutal">
                <span className="h-2 w-2 animate-pulse rounded-full bg-copper-400" />
                עכשיו
              </span>
            )}
            <p className="flex items-center gap-2 text-2xl font-semibold">
              <ClockIcon className="h-5 w-5" />
              {item.time}
            </p>
            <p className="mt-2 text-lg font-semibold">{item.title}</p>
            {item.subtext && <p className="mt-1 text-sm font-normal opacity-70">{item.subtext}</p>}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
