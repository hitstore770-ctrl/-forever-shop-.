"use client";

import { useCart } from "@/components/donate/CartContext";
import { DoodleStar, DoodleDots, DoodleScribble, DoodleZigzag } from "@/components/doodles";
import type { DonationTier } from "@/lib/donate-data";

const ACCENTS = ["bg-copper-400 text-navy-950", "bg-navy-900 text-cream", "bg-cream-dark text-navy-900"];
const CORNER_DOODLES = [DoodleStar, DoodleDots, DoodleScribble, DoodleZigzag];

export default function DonationTierCard({ tier, index }: { tier: DonationTier; index: number }) {
  const { addItem } = useCart();
  const accent = ACCENTS[index % ACCENTS.length];
  const CornerDoodle = CORNER_DOODLES[index % CORNER_DOODLES.length];

  return (
    <div className="relative flex h-full flex-col justify-between gap-6 border-4 border-black bg-cream p-7 shadow-brutal-lg transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none">
      <CornerDoodle className="pointer-events-none absolute -top-3 -left-3 h-7 w-7 text-black/20" />

      <div>
        <span className={`inline-block border-2 border-black px-3 py-1 text-2xl font-semibold ${accent}`}>
          ₪{tier.price}
        </span>
        <h3 className="mt-4 text-xl leading-tight font-semibold text-navy-950">{tier.title}</h3>
        <p className="mt-2 text-sm font-normal text-navy-700/70">{tier.description}</p>
      </div>

      <button
        type="button"
        onClick={() => addItem(tier)}
        className="w-full border-4 border-black bg-copper-500 py-3 text-base font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
      >
        הוסף לעגלה
      </button>
    </div>
  );
}
