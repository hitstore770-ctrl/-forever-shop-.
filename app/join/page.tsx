import type { Metadata } from "next";
import { Suspense } from "react";
import JoinHero from "@/components/join/JoinHero";
import ScheduleTimelineLoader from "@/components/join/ScheduleTimelineLoader";
import ScheduleSkeleton from "@/components/join/ScheduleSkeleton";
import ZmanimPanel from "@/components/join/ZmanimPanel";
import FaqAccordion from "@/components/join/FaqAccordion";
import VisitForm from "@/components/join/VisitForm";
import VibeGallery from "@/components/join/VibeGallery";
import { DoodleStar, DoodleScribble, DoodleDots, DoodleZigzag, DoodleFlyingDocument, DoodleNotebookPage } from "@/components/doodles";

export const metadata: Metadata = {
  title: "הצטרפות",
};

// "Join Us" page — general info, daily schedule (now Firestore-backed via
// the "schedule" collection, editable from /admin), FAQ, and a
// visit-request form.
export default function JoinPage() {
  return (
    <>
      <JoinHero />

      <section className="relative border-b-4 border-black bg-cream-dark py-16 sm:py-24">
        <DoodleZigzag className="pointer-events-none absolute top-10 right-10 hidden h-5 w-16 text-navy-900/25 xl:block" />
        <DoodleFlyingDocument className="pointer-events-none absolute right-8 bottom-10 hidden h-16 w-20 -rotate-12 text-copper-600/40 xl:block" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 flex items-center gap-3">
            <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
              סדר היום
            </h2>
            <DoodleStar className="hidden h-8 w-8 text-copper-500 sm:block" />
          </div>
          <div className="mb-10">
            <ZmanimPanel />
          </div>
          <Suspense fallback={<ScheduleSkeleton />}>
            <ScheduleTimelineLoader />
          </Suspense>
        </div>
      </section>

      <section className="relative border-b-4 border-black bg-cream py-16 sm:py-24">
        <DoodleDots className="pointer-events-none absolute top-16 left-10 hidden h-6 w-14 text-copper-500/50 xl:block" />
        <DoodleNotebookPage className="pointer-events-none absolute right-10 bottom-6 hidden h-20 w-16 -rotate-6 text-navy-900/15 xl:block" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 flex items-center gap-3">
            <h2 className="inline-block border-2 border-black bg-copper-400 px-4 py-2 text-2xl font-semibold text-navy-950 uppercase shadow-brutal sm:text-3xl">
              שאלות נפוצות
            </h2>
            <DoodleScribble className="hidden h-6 w-12 text-navy-900/40 sm:block" />
          </div>
          <FaqAccordion />
        </div>
      </section>

      <section className="relative bg-cream-dark py-16 sm:py-24">
        <DoodleStar className="pointer-events-none absolute top-12 left-8 hidden h-7 w-7 text-copper-500 xl:block" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
            קבעו ביקור
          </h2>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <VisitForm />
            </div>
            <div className="lg:col-span-5">
              <VibeGallery />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
