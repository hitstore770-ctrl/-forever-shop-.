"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { QUICK_NAV_CARDS, type QuickNavCard } from "@/lib/site-config";
import { BookIcon, UsersIcon, HeartHandIcon, CalendarIcon } from "@/components/icons";
import { DoodleStar, DoodleDots, DoodleScribble, DoodleZigzag } from "@/components/doodles";

const CORNER_DOODLES = [DoodleStar, DoodleDots, DoodleScribble, DoodleZigzag];

const ICONS: Record<QuickNavCard["icon"], typeof BookIcon> = {
  learning: BookIcon,
  join: UsersIcon,
  donate: HeartHandIcon,
  activities: CalendarIcon,
};

// Per-card look: alternating color + one exaggerated rounded corner each,
// everything else left sharp. All cards are the same size — a straight,
// evenly aligned grid rather than a mismatched bento layout.
const CARD_STYLE: Record<QuickNavCard["icon"], { card: string; sticker: string }> = {
  learning: {
    card: "bg-copper-400 text-navy-950 rounded-tr-[2.5rem]",
    sticker: "border-black bg-navy-900 text-cream",
  },
  join: {
    card: "bg-navy-900 text-cream rounded-bl-[2.5rem]",
    sticker: "border-black bg-copper-400 text-navy-950",
  },
  donate: {
    card: "bg-cream-dark text-navy-900 rounded-tl-[2.5rem]",
    sticker: "border-black bg-navy-900 text-cream",
  },
  activities: {
    card: "bg-navy-900 text-cream rounded-br-[2.5rem]",
    sticker: "border-black bg-copper-400 text-navy-950",
  },
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Straight, evenly aligned grid of cards routing to the site's four main sections.
export default function QuickNavCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {QUICK_NAV_CARDS.map((card, index) => {
        const Icon = ICONS[card.icon];
        const style = CARD_STYLE[card.icon];
        const CornerDoodle = CORNER_DOODLES[index % CORNER_DOODLES.length];
        return (
          <motion.div key={card.href} variants={fadeUp}>
            <Link
              href={card.href}
              className={`group relative flex h-full flex-col justify-between gap-6 border-4 border-black p-7 shadow-brutal-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none ${style.card}`}
            >
              <CornerDoodle className="pointer-events-none absolute -top-3 -left-3 h-7 w-7 text-black/25" />

              <span
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 ${style.sticker}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-2xl font-semibold uppercase">{card.title}</span>
                <span className="mt-1 block text-sm font-normal opacity-70">{card.description}</span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
