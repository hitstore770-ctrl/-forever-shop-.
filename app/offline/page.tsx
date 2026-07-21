import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אין חיבור",
};

// Shown by the service worker when a page that hasn't been cached yet is
// requested with no network. Pages already visited online are served from
// cache instead of this fallback.
export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream-dark px-4 py-16">
      <div className="w-full max-w-md border-4 border-black bg-cream p-8 text-center shadow-brutal-lg">
        <h1 className="text-2xl font-semibold text-navy-950 uppercase">אין חיבור לאינטרנט</h1>
        <p className="mt-3 text-sm font-normal text-navy-700/80">
          נראה שאין כרגע רשת זמינה. דפים שכבר פתחתם — כמו סדר היום והקונטרסים — זמינים גם ללא חיבור.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block border-4 border-black bg-copper-500 px-6 py-3 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
        >
          לדף הבית
        </Link>
      </div>
    </div>
  );
}
