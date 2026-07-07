import type { Metadata } from "next";
import LearningExplorer from "@/components/learning/LearningExplorer";
import AudioPlayerBar from "@/components/learning/AudioPlayerBar";
import { SquigglyUnderline, DoodleStar } from "@/components/doodles";

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

      <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        אזור למידה
        <br />
        <span className="relative inline-block bg-copper-500 px-3 text-cream">
          קונטרסים ושיעורים
          <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
        </span>
      </h1>

      <div className="mt-16">
        <LearningExplorer />
      </div>

      <AudioPlayerBar />
    </div>
  );
}
