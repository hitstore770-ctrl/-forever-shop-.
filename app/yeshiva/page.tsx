import type { Metadata } from "next";
import { Suspense } from "react";
import LeadershipGridLoader from "@/components/yeshiva/LeadershipGridLoader";
import LeadershipGridSkeleton from "@/components/yeshiva/LeadershipGridSkeleton";
import HistoryTimeline from "@/components/yeshiva/HistoryTimeline";
import {
  SquigglyUnderline,
  MarkerHighlight,
  DoodleStar,
  DoodleDots,
  DoodleZigzag,
  DoodleScribble,
  DoodleFlyingDocument,
  DoodleNotebookPage,
  DoodleMarkerScribble,
} from "@/components/doodles";
import { SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הישיבה",
};

// "Yeshiva" (About) page — mission, history, and leadership, in the site's
// signature brutalist/collage style.
export default function YeshivaPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <DoodleStar className="pointer-events-none absolute top-4 left-10 hidden h-8 w-8 text-copper-500 xl:block" />
      <DoodleFlyingDocument className="pointer-events-none absolute top-0 right-16 hidden h-16 w-20 -rotate-12 text-copper-600/40 xl:block" />

      {/* Hero */}
      <span className="relative mb-5 inline-block -rotate-2 border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal">
        מי אנחנו ★
      </span>

      <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        הישיבה
        <br />
        <MarkerHighlight colorClassName="text-copper-400/70">
          <span className="relative inline-block">
            שלנו
            <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
          </span>
        </MarkerHighlight>
        <DoodleDots className="pointer-events-none absolute -top-4 left-0 hidden h-6 w-14 text-copper-500/60 sm:block" />
      </h1>

      <p className="relative mt-8 max-w-xl border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800">
        {SITE_DESCRIPTION}
      </p>

      {/* Mission */}
      <div className="relative mt-20 grid gap-10 lg:grid-cols-12 lg:items-center">
        <DoodleMarkerScribble className="pointer-events-none absolute -top-8 -left-6 hidden h-8 w-20 text-navy-900/15 xl:block" />

        <div className="relative lg:col-span-5">
          <div className="relative aspect-4/3 overflow-hidden border-4 border-black bg-navy-900 shadow-brutal-lg">
            {/* TODO: swap for a real photo of the beit midrash via next/image once assets exist */}
            <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--color-navy-600),var(--color-navy-950))]">
              <div className="absolute inset-0 bg-grain mix-blend-overlay" />
              <span className="font-mono text-xs tracking-[0.3em] text-cream/40 uppercase">📷 בית המדרש</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2 className="relative inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
            החזון שלנו
          </h2>
          <p className="mt-6 max-w-xl text-lg font-normal text-navy-800">
            אנחנו מאמינים שלכל תלמיד יש מקום — הישיבה בנויה כך שתלמידים חזקים בלימוד ותלמידים שרק מתחילים
            את דרכם, לומדים, גדלים ומתחממים יחד תחת קורת גג אחת.
          </p>
        </div>
      </div>

      {/* History */}
      <div className="relative mt-24">
        <DoodleZigzag className="pointer-events-none absolute -top-10 right-1/3 hidden h-5 w-14 text-navy-900/25 xl:block" />
        <DoodleNotebookPage className="pointer-events-none absolute top-1/3 -left-6 hidden h-20 w-16 -rotate-6 text-navy-900/15 xl:block" />

        <div className="mb-12 flex items-center gap-3">
          <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
            קצת היסטוריה
          </h2>
          <DoodleScribble className="hidden h-6 w-12 text-copper-500/70 sm:block" />
        </div>

        <HistoryTimeline />
      </div>

      {/* Leadership */}
      <div className="relative mt-24">
        <div className="mb-10 flex items-center gap-3">
          <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
            ההנהלה שלנו
          </h2>
          <DoodleStar className="hidden h-6 w-6 text-copper-500/70 sm:block" />
        </div>

        <Suspense fallback={<LeadershipGridSkeleton />}>
          <LeadershipGridLoader />
        </Suspense>
      </div>
    </div>
  );
}
