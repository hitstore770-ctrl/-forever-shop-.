// Elegant "Torah dedication" banner, styled like a pinned note in the collage.
// Static for now — will be driven by Firebase later so staff can update the
// day's dedication without a deploy.
const DAILY_DEDICATION_TEXT = "הלימוד היום מוקדש לזכות משה בן בתיה להצלחה בעסקים";

export default function DailyDedication() {
  return (
    <div className="relative mx-auto max-w-xl">
      {/* "washi tape" accent pinning the note down */}
      <div className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3 border-2 border-black/70 bg-copper-300/80" />

      <div className="-rotate-1 border-4 border-black bg-cream px-6 py-6 text-center shadow-brutal">
        <p className="text-xs font-black tracking-[0.25em] text-copper-600 uppercase">הקדשת היום</p>
        <p className="mt-2 text-xl font-bold text-navy-950">{DAILY_DEDICATION_TEXT}</p>
      </div>
    </div>
  );
}
