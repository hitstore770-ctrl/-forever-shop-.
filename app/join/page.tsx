import type { Metadata } from "next";
import JoinHero from "@/components/join/JoinHero";
import ScheduleTimeline from "@/components/join/ScheduleTimeline";
import FaqAccordion from "@/components/join/FaqAccordion";
import VisitForm from "@/components/join/VisitForm";
import VibeGallery from "@/components/join/VibeGallery";
import { DoodleStar } from "@/components/doodles";

export const metadata: Metadata = {
  title: "הצטרפות",
};

// "Join Us" page — general info, daily schedule, FAQ, and a visit-request form.
// TODO for a later phase: back the schedule/FAQ with Firebase so staff can
// edit them without a deploy, and wire VisitForm up to a real backend.
export default function JoinPage() {
  return (
    <>
      <JoinHero />

      <section className="border-b-4 border-black bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 flex items-center gap-3">
            <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
              סדר היום
            </h2>
            <DoodleStar className="hidden h-8 w-8 text-copper-500 sm:block" />
          </div>
          <ScheduleTimeline />
        </div>
      </section>

      <section className="border-b-4 border-black bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-12 inline-block border-2 border-black bg-copper-400 px-4 py-2 text-2xl font-semibold text-navy-950 uppercase shadow-brutal sm:text-3xl">
            שאלות נפוצות
          </h2>
          <FaqAccordion />
        </div>
      </section>

      <section className="bg-cream-dark py-16 sm:py-24">
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
