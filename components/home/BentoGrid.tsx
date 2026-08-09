"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  HeartHandIcon,
  UsersIcon,
} from "@/components/icons";
import { BENTO_CARDS, type BentoCard } from "@/lib/home-data";

// Mixed-size card grid: 2 columns on a phone, 3 from sm up, with a couple of
// cells spanning wide so the rhythm is not a plain checkerboard.
//
// The stagger comes from one `whileInView` on the container plus
// staggerChildren — a single IntersectionObserver for the whole grid rather
// than six of them, and no per-card delay arithmetic to keep in sync.
//
// whileTap gives every card the short press-in that makes a touch target feel
// physical. It is a transform, so it costs nothing, and it is skipped entirely
// under reduced motion.

const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICONS: Record<BentoCard["icon"], typeof BookIcon> = {
  schedule: ClockIcon,
  gallery: CameraIcon,
  staff: UsersIcon,
  learning: BookIcon,
  events: CalendarIcon,
  donate: HeartHandIcon,
};

export default function BentoGrid() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.07 },
    },
  };

  const item = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_LUX } },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5"
    >
      {BENTO_CARDS.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <motion.div
            key={card.href}
            variants={item}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className={card.span}
          >
            <Link
              href={card.href}
              className={`group flex h-full flex-col rounded-2xl p-5 shadow-lux shadow-lux-inset transition-shadow duration-300 hover:shadow-lux-lg sm:p-6 ${
                card.feature ? "bg-linear-to-br from-white to-pearl-dark" : "bg-white"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper-300/25 text-copper-600 transition-colors duration-300 group-hover:bg-copper-300/45">
                <Icon strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
              </span>

              <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy-950 sm:text-xl">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-900/60">{card.description}</p>

              <span className="mt-auto pt-4 text-sm font-semibold text-copper-600 transition-transform duration-300 group-hover:-translate-x-1">
                לפרטים ←
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
