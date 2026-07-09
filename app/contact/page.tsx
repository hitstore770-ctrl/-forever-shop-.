import type { Metadata } from "next";
import { Suspense } from "react";
import StaffTeamGridLoader from "@/components/contact/StaffTeamGridLoader";
import StaffTeamGridSkeleton from "@/components/contact/StaffTeamGridSkeleton";
import ContactForm from "@/components/contact/ContactForm";
import WhatsAppUrgentNote from "@/components/contact/WhatsAppUrgentNote";
import {
  SquigglyUnderline,
  MarkerHighlight,
  DoodleStar,
  DoodleDots,
  DoodleZigzag,
  DoodleScribble,
  DoodleFlyingDocument,
  DoodleNotebookPage,
} from "@/components/doodles";

export const metadata: Metadata = {
  title: "צור קשר",
};

// Contact page — hero, staff team grid, message form, and a "torn note"
// WhatsApp CTA, all in the site's brutalist/collage style.
export default function ContactPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <DoodleStar className="pointer-events-none absolute top-4 left-10 hidden h-8 w-8 text-copper-500 xl:block" />
      <DoodleFlyingDocument className="pointer-events-none absolute top-0 right-16 hidden h-16 w-20 -rotate-12 text-copper-600/40 xl:block" />

      {/* Hero */}
      <span className="relative mb-5 inline-block -rotate-2 border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal">
        נשמח לשמוע מכם ★
      </span>

      <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        צור
        <br />
        <MarkerHighlight colorClassName="text-copper-400/70">
          <span className="relative inline-block">
            קשר
            <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
          </span>
        </MarkerHighlight>
        <DoodleDots className="pointer-events-none absolute -top-4 left-0 hidden h-6 w-14 text-copper-500/60 sm:block" />
      </h1>

      <p className="relative mt-8 max-w-xl border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800">
        שאלות, בקשות, או סתם רוצים לומר שלום — נשמח לשמוע מכם בכל דרך שנוחה לכם.
      </p>

      {/* Meet the Team */}
      <div className="relative mt-20">
        <DoodleScribble className="pointer-events-none absolute -top-8 right-1/4 hidden h-6 w-12 text-copper-500/70 xl:block" />
        <div className="mb-8 flex items-center gap-3">
          <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
            הצוות והאחראים
          </h2>
          <DoodleZigzag className="hidden h-6 w-12 text-copper-500/70 sm:block" />
        </div>

        <Suspense fallback={<StaffTeamGridSkeleton />}>
          <StaffTeamGridLoader />
        </Suspense>
      </div>

      {/* Contact form */}
      <div className="relative mt-24 grid gap-10 lg:grid-cols-12">
        <DoodleNotebookPage className="pointer-events-none absolute -top-10 -left-6 hidden h-20 w-16 -rotate-6 text-navy-900/15 xl:block" />

        <div className="lg:col-span-5">
          <h2 className="relative inline-block border-2 border-black bg-cream-dark px-4 py-2 text-2xl font-semibold text-navy-950 uppercase shadow-brutal sm:text-3xl">
            שלחו לנו הודעה
          </h2>
          <p className="mt-6 max-w-sm font-normal text-navy-800">
            מלאו את הפרטים ונחזור אליכם בהקדם. אפשר גם פשוט להתקשר או לכתוב בוואטסאפ.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="border-4 border-black bg-cream p-6 shadow-brutal-lg sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* WhatsApp urgent note */}
      <div className="relative mt-28">
        <WhatsAppUrgentNote />
      </div>
    </div>
  );
}
