import { DoodleCircle, DoodleStar, DoodleDots } from "@/components/doodles";

// Elegant "Torah dedication" banner, styled like a pinned note in the collage.
// Static for now — will be driven by Firebase later so staff can update the
// day's dedication without a deploy.
const DAILY_DEDICATION_TEXT = "הלימוד היום מוקדש לזכות משה בן בתיה להצלחה בעסקים";

export default function DailyDedication() {
  return (
    <div className="relative mx-auto max-w-xl">
      {/* "washi tape" accent pinning the note down */}
      <div className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 border-2 border-black/70 bg-copper-300/80" />
      <DoodleStar className="pointer-events-none absolute -top-8 -right-4 hidden h-8 w-8 text-copper-500 sm:block" />
      <DoodleDots className="pointer-events-none absolute -bottom-6 -left-6 hidden h-6 w-14 text-navy-900/30 sm:block" />

      <div className="border-4 border-black bg-cream px-6 py-6 text-center shadow-brutal">
        <p className="relative inline-block text-xs font-semibold tracking-[0.25em] text-copper-600 uppercase">
          הקדשת היום
          <DoodleCircle className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] text-copper-400" />
        </p>
        <p className="mt-2 text-xl font-normal text-navy-950">{DAILY_DEDICATION_TEXT}</p>
      </div>
    </div>
  );
}
