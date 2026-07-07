import { NEWS_TICKER_ITEMS } from "@/lib/site-config";

// Scrolling headline strip pinned above the header.
// Pure CSS animation (see `animate-marquee` in globals.css) — no client JS needed.
// The item list is duplicated once so the loop is seamless.
export default function NewsTicker() {
  const items = [...NEWS_TICKER_ITEMS, ...NEWS_TICKER_ITEMS];

  return (
    <div className="overflow-hidden bg-navy-900 text-cream">
      <div className="flex w-max animate-marquee gap-12 py-2 whitespace-nowrap">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-3 text-sm font-medium">
            <span className="text-copper-400">•</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
