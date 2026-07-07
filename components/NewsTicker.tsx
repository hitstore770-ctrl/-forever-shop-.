import { NEWS_TICKER_ITEMS } from "@/lib/site-config";

// Loud, oversized headline strip pinned above the header — the visual
// equivalent of a street-press banner rather than a quiet news bar.
// Pure CSS animation (see `animate-marquee` in globals.css) — no client JS needed.
// The item list is duplicated once so the loop is seamless.
export default function NewsTicker() {
  const items = [...NEWS_TICKER_ITEMS, ...NEWS_TICKER_ITEMS];

  return (
    <div className="overflow-hidden border-y-4 border-copper-500 bg-black text-cream">
      <div className="flex w-max animate-marquee gap-10 py-3 whitespace-nowrap sm:py-4">
        {items.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-4 text-xl font-black tracking-tight uppercase sm:text-3xl"
          >
            <span className="text-copper-400">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
