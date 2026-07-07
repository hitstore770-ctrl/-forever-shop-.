import type { Metadata } from "next";
import LearningExplorer from "@/components/learning/LearningExplorer";
import AudioPlayerBar from "@/components/learning/AudioPlayerBar";
import { SquigglyUnderline, DoodleStar, DoodleScribble, DoodleDots, DoodleZigzag } from "@/components/doodles";

export const metadata: Metadata = {
  title: "לימוד",
};

// Learning area — Kuntresim (booklets) and shiurim.
// TODO for a later phase: back LearningExplorer's data with Firebase
// (Firestore for metadata, Storage for the actual PDF/audio files), and
// wire the "Read" buttons to an in-browser PDF viewer (e.g. react-pdf).
export default function LearningPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-32 sm:px-6 sm:pt-16">
      <DoodleStar className="pointer-events-none absolute top-8 left-6 hidden h-8 w-8 text-copper-500 xl:block" />
      <DoodleScribble className="pointer-events-none absolute top-32 left-2 hidden h-8 w-16 text-navy-900/25 xl:block" />

      <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        אזור למידה
        <br />
        <span className="relative inline-block bg-copper-500 px-3 text-cream">
          קונטרסים ושיעורים
          <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
        </span>
        <DoodleDots className="pointer-events-none absolute -top-4 left-0 hidden h-6 w-14 text-copper-500/60 sm:block" />
      </h1>

      <div className="relative mt-16">
        <DoodleZigzag className="pointer-events-none absolute -top-8 right-1/3 hidden h-5 w-14 text-navy-900/25 xl:block" />
        <LearningExplorer />
      </div>

      <AudioPlayerBar />
    </div>
  );
}
