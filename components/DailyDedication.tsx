// Elegant "Torah dedication" banner. Static for now — will be driven by
// Firebase later so staff can update the day's dedication without a deploy.
const DAILY_DEDICATION_TEXT =
  "הלימוד היום מוקדש לזכות משה בן בתיה להצלחה בעסקים";

export default function DailyDedication() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-copper-500/30 bg-gradient-to-l from-copper-500/10 via-cream-dark to-copper-500/10 px-6 py-6 text-center shadow-sm shadow-copper-900/5 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copper-600">
        הקדשת היום
      </p>
      <p className="mt-2 text-lg font-medium text-navy-900">{DAILY_DEDICATION_TEXT}</p>
    </div>
  );
}
