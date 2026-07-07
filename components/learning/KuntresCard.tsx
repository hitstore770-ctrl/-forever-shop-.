import { BookIcon, DownloadIcon } from "@/components/icons";
import { DoodleStar, DoodleDots } from "@/components/doodles";
import type { Kuntres } from "@/lib/learning-data";

// Alternating accent color per index for visual variety — all cards are the
// same size and perfectly aligned in the grid.
const VARIANTS = [
  { accent: "bg-copper-400 text-navy-950" },
  { accent: "bg-navy-900 text-cream" },
  { accent: "bg-cream-dark text-navy-900" },
];

const CORNER_DOODLES = [DoodleStar, DoodleDots];

export default function KuntresCard({ item, index }: { item: Kuntres; index: number }) {
  const variant = VARIANTS[index % VARIANTS.length];
  const CornerDoodle = CORNER_DOODLES[index % CORNER_DOODLES.length];

  return (
    <div className="relative flex h-full flex-col justify-between gap-5 border-4 border-black bg-cream p-6 shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none">
      <CornerDoodle className="pointer-events-none absolute -top-3 -right-3 h-6 w-6 text-black/20" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black ${variant.accent}`}>
            <BookIcon className="h-6 w-6" />
          </span>
          <span className="border-2 border-black bg-copper-300 px-2 py-0.5 text-xs font-semibold text-navy-950 uppercase">
            {item.category}
          </span>
        </div>

        <h3 className="mt-4 text-xl leading-tight font-semibold text-navy-950">{item.title}</h3>
        <p className="mt-2 text-sm font-normal text-navy-700/70">
          {item.author} · {item.date}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* TODO: wire up to a real PDF viewer (e.g. react-pdf) once files are in Firebase Storage */}
        <a
          href="#"
          className="border-2 border-black bg-navy-900 px-4 py-2 text-sm font-semibold text-cream uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          קרא
        </a>
        {/* TODO: point at the real file URL from Firebase Storage */}
        <a
          href="#"
          className="flex items-center gap-1.5 border-2 border-black bg-cream px-4 py-2 text-sm font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          <DownloadIcon className="h-4 w-4" />
          הורדה
        </a>
      </div>
    </div>
  );
}
