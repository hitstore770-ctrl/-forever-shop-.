"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { QUICK_NAV_CARDS, type QuickNavCard } from "@/lib/site-config";
import { BookIcon, UsersIcon, HeartHandIcon, CalendarIcon } from "@/components/icons";

const ICONS: Record<QuickNavCard["icon"], typeof BookIcon> = {
  learning: BookIcon,
  join: UsersIcon,
  donate: HeartHandIcon,
  activities: CalendarIcon,
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Grid of cards routing to the site's four main sections.
export default function QuickNavCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {QUICK_NAV_CARDS.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <motion.div key={card.href} variants={fadeUp}>
            <Link
              href={card.href}
              className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-navy-900/5 bg-white/70 p-8 text-center shadow-sm shadow-navy-900/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-500/15 text-copper-600 transition-colors group-hover:bg-copper-500 group-hover:text-white">
                <Icon className="h-7 w-7" />
              </span>
              <span className="text-lg font-bold text-navy-900">{card.title}</span>
              <span className="text-sm text-navy-700/70">{card.description}</span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
