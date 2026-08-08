import Link from "next/link";
import Reveal from "@/components/home/Reveal";
import { BookIcon, UsersIcon, HeartHandIcon, CalendarIcon } from "@/components/icons";
import { QUICK_NAV_CARDS, type QuickNavCard } from "@/lib/site-config";

// The four main sections, in the light card style: white surface, hairline
// ring, soft shadow that lifts on hover. Same QUICK_NAV_CARDS data the
// brutalist version reads, so routing and copy stay in one place.
//
// The shared icon set defaults to a 2.5 stroke to match the thick brutalist
// borders; on these surfaces that reads as heavy, so they are thinned out.

const ICONS: Record<QuickNavCard["icon"], typeof BookIcon> = {
  learning: BookIcon,
  join: UsersIcon,
  donate: HeartHandIcon,
  events: CalendarIcon,
};

export default function LuxNavCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {QUICK_NAV_CARDS.map((card, index) => {
        const Icon = ICONS[card.icon];
        return (
          <Reveal key={card.href} delay={index * 0.07}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-lux shadow-lux-inset transition-all duration-300 hover:-translate-y-1 hover:shadow-lux-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper-300/25 text-copper-600 transition-colors duration-300 group-hover:bg-copper-300/45">
                <Icon strokeWidth={1.75} className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{card.description}</p>
              <span className="mt-4 text-sm font-semibold text-copper-600 transition-transform duration-300 group-hover:-translate-x-1">
                לפרטים ←
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
