"use client";

import { useState } from "react";
import { PlayIcon, PauseIcon } from "@/components/icons";

// Floating "now playing" bar for listening to shiurim while reading.
// Placeholder only — TODO: back this with a real <audio> element (or a
// library) once shiur recordings are served from Firebase Storage.
// Positioned to leave room for the floating WhatsApp button on the right.
export default function AudioPlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed right-24 bottom-4 left-4 z-40 sm:right-28">
      <div className="mx-auto flex max-w-xl items-center gap-4 border-4 border-black bg-navy-900 px-4 py-3 text-cream shadow-brutal-lg">
        <button
          type="button"
          onClick={() => setIsPlaying((playing) => !playing)}
          aria-label={isPlaying ? "השהה" : "נגן"}
          className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-copper-500 text-navy-950 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        >
          {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 translate-x-[1px]" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold uppercase">בחרו שיעור להאזנה</p>
          <div className="mt-2 h-1.5 w-full bg-cream/20">
            <div className="h-full w-1/3 bg-copper-400" />
          </div>
        </div>

        <span className="hidden shrink-0 text-xs font-normal text-cream/50 sm:block">🎧 שיעורים</span>
      </div>
    </div>
  );
}
