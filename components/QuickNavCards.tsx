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

// Per-card look: mismatched sizes/rotation (bento grid) + one exaggerated
// rounded corner each, everything else left sharp. Grid spans are only
// applied at lg+ — below that the cards just stack in reading order.
const CARD_STYLE: Record<
  QuickNavCard["icon"],
  { span: string; rotate: string; card: string; sticker: string }
> = {
  learning: {
    span: "lg:col-span-2 lg:row-span-2",
    rotate: "sm:-rotate-1",
    card: "bg-copper-400 text-navy-950 rounded-tr-[2.5rem]",
    sticker: "border-black bg-navy-900 text-cream",
  },
  join: {
    span: "lg:col-span-2 lg:row-span-1",
    rotate: "sm:rotate-1",
    card: "bg-navy-900 text-cream rounded-bl-[2.5rem]",
    sticker: "border-black bg-copper-400 text-navy-950",
  },
  donate: {
    span: "lg:col-span-1 lg:row-span-1",
    rotate: "sm:-rotate-2",
    card: "bg-cream-dark text-navy-900 rounded-tl-[2.5rem]",
    sticker: "border-black bg-navy-900 text-cream",
  },
  activities: {
    span: "lg:col-span-1 lg:row-span-1",
    rotate: "sm:rotate-2",
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

// Asymmetrical "bento" grid of cards routing to the site's four main sections.
export default function QuickNavCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[170px] lg:gap-5"
    >
      {QUICK_NAV_CARDS.map((card) => {
        const Icon = ICONS[card.icon];
        const style = CARD_STYLE[card.icon];
        return (
          <motion.div key={card.href} variants={fadeUp} className={style.span}>
            <Link
              href={card.href}
              className={`group flex h-full flex-col justify-between gap-6 border-4 border-black p-7 shadow-brutal-lg transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none ${style.rotate} ${style.card}`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 ${style.sticker}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-2xl font-black uppercase">{card.title}</span>
                <span className="mt-1 block text-sm font-medium opacity-70">{card.description}</span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
