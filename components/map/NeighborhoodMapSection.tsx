import { MAP_POINTS, YESHIVA_ADDRESS, mapsLink, type MapPoint } from "@/lib/map-config";
import JerusalemMap from "@/components/map/JerusalemMap";

// "Where we are" block: the illustrated map plus the address and a real
// navigation link, so the map is informative and not just decoration.
export default function NeighborhoodMapSection() {
  const yeshiva = MAP_POINTS.find((p) => p.kind === "yeshiva") as MapPoint;

  return (
    <section className="relative mt-20">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream shadow-brutal">
          איפה אנחנו
        </h2>
        <span className="inline-block -rotate-1 border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal">
          מרכז העיר ★
        </span>
      </div>

      <p className="mb-6 max-w-xl text-lg text-navy-800">
        הישיבה יושבת בלב מרכז ירושלים — דקות ברגל מכיכר ציון, משוק מחנה יהודה ומהרכבת הקלה.
      </p>

      <JerusalemMap />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="border-2 border-black bg-white px-3 py-2 text-sm font-semibold text-navy-950">
          {YESHIVA_ADDRESS}
        </span>
        <a
          href={mapsLink(yeshiva)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border-2 border-black bg-copper-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
        >
          פתחו ניווט לישיבה
        </a>
      </div>
    </section>
  );
}
