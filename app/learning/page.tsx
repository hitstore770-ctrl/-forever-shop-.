import type { Metadata } from "next";
import LearningExplorer from "@/components/learning/LearningExplorer";
import AudioPlayerBar from "@/components/learning/AudioPlayerBar";

export const metadata: Metadata = {
  title: "לימוד",
};

// Learning area — Kuntresim (booklets) and shiurim.
// TODO for a later phase: back LearningExplorer's data with Firebase
// (Firestore for metadata, Storage for the actual PDF/audio files), and
// wire the "Read" buttons to an in-browser PDF viewer (e.g. react-pdf).
export default function LearningPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-32 sm:px-6 sm:pt-16">
      <h1 className="max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
        אזור למידה
        <br />
        <span className="inline-block bg-copper-500 px-3 text-cream">קונטרסים ושיעורים</span>
      </h1>

      <div className="mt-12">
        <LearningExplorer />
      </div>

      <AudioPlayerBar />
    </div>
  );
}
