import type { Metadata } from "next";
import EventBulletinBoard from "@/components/events/EventBulletinBoard";
import {
  SquigglyUnderline,
  DoodleStar,
  DoodleDots,
  DoodleScribble,
  DoodleBoldArrow,
  DoodleFlyingDocument,
  DoodleZigzag,
} from "@/components/doodles";

export const metadata: Metadata = {
  title: "אירועים",
};

// Events — an upcoming-Shiurim/gatherings bulletin board.
// TODO: back this with a real Firestore collection once ready.
export default function EventsPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <DoodleStar className="pointer-events-none absolute top-6 left-8 hidden h-8 w-8 text-copper-500 xl:block" />
      <DoodleFlyingDocument className="pointer-events-none absolute top-2 right-14 hidden h-16 w-20 rotate-12 text-copper-600/40 xl:block" />
      <DoodleZigzag className="pointer-events-none absolute top-28 left-24 hidden h-5 w-16 text-navy-900/25 xl:block" />

      <span className="relative mb-5 inline-block -rotate-2 border-2 border-black bg-copper-400 px-3 py-1 text-xs font-semibold tracking-widest text-navy-950 uppercase shadow-brutal">
        לוח מודעות ★
      </span>

      <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        אירועים
        <br />
        <span className="relative inline-block bg-copper-500 px-3 text-cream">
          קרובים
          <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
        </span>
        <DoodleDots className="pointer-events-none absolute -top-4 left-0 hidden h-6 w-14 text-copper-500/60 sm:block" />
      </h1>
      <p className="relative mt-8 max-w-xl border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800">
        שיעורים, התוועדויות וכל מה שקורה בישיבה בקרוב — מעודכן ומוצמד ללוח כמו שצריך.
      </p>

      <div className="relative mt-16">
        <DoodleScribble className="pointer-events-none absolute -top-10 left-1/4 hidden h-6 w-14 text-copper-500/70 sm:block" />
        <DoodleBoldArrow className="pointer-events-none absolute -top-14 right-10 hidden h-14 w-14 rotate-45 text-copper-600 lg:block" />
        <EventBulletinBoard />
      </div>
    </div>
  );
}
