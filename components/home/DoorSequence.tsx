"use client";

import { useCallback, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import CanvasScrollSequence from "@/components/home/CanvasScrollSequence";

// The home page's centrepiece: scrolling walks the visitor down a street and
// through a door, which opens onto the image film in the next section.
//
// The frames currently in public/frames/door are generated placeholders (see
// scripts/gen-door-frames.mjs). Swapping in real footage is a two-line change:
// point FRAME_PATTERN at the new files and set FRAME_COUNT to match.

const FRAME_COUNT = 48;
const FRAME_PATTERN = (index: number) => `/frames/door/frame-${String(index).padStart(3, "0")}.svg`;

// Caption timing, as fractions of the pinned scroll.
const INTRO_UNTIL = 0.2;
const OUTRO_FROM = 0.62;
const OUTRO_UNTIL = 0.97;
const HINT_UNTIL = 0.08;

type Caption = "intro" | "none" | "outro";

function captionFor(progress: number): Caption {
  if (progress < INTRO_UNTIL) return "intro";
  if (progress >= OUTRO_FROM && progress < OUTRO_UNTIL) return "outro";
  return "none";
}

/*
  The captions are driven by coarse phase state plus CSS transitions, rather
  than by binding useTransform MotionValues straight to `style.opacity`.

  That is deliberate. In this framer-motion/React combination a MotionValue
  bound to a plain style property renders its value once at mount and then
  stops updating, while transform-backed properties (x/y/scale) on the very
  same element keep tracking — so a MotionValue-driven fade silently freezes
  at its starting opacity. Phase state only changes three or four times across
  the whole sequence, so this costs nothing and is easy to reason about.
*/
function SequenceOverlay({ progress }: { progress: MotionValue<number> }) {
  const [caption, setCaption] = useState<Caption>("intro");
  const [isHintVisible, setIsHintVisible] = useState(true);

  useMotionValueEvent(progress, "change", (value) => {
    setCaption((current) => {
      const next = captionFor(value);
      return current === next ? current : next;
    });
    setIsHintVisible((current) => {
      const next = value < HINT_UNTIL;
      return current === next ? current : next;
    });
  });

  return (
    <div className="pointer-events-none absolute inset-0 px-6 text-center">
      <div
        className={`absolute inset-x-0 top-[10%] px-6 transition-all duration-500 ease-out ${
          caption === "intro" ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-navy-900/50 uppercase">
          רחוב הרב עוזיאל
        </p>
        <h2 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
          כמה צעדים
          <br />
          מכאן.
        </h2>
      </div>

      <div
        className={`absolute inset-x-0 bottom-[17%] px-6 transition-all duration-500 ease-out ${
          caption === "outro" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="text-4xl leading-tight font-semibold tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
          הדלת פתוחה.
        </h2>
        <p className="mt-4 text-base text-navy-900/60 sm:text-lg">היכנס — זה הבית שלך.</p>
      </div>

      <span
        className={`absolute inset-x-0 bottom-28 text-xs font-medium tracking-widest text-navy-900/40 uppercase transition-opacity duration-500 ${
          isHintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        גלול ↓
      </span>
    </div>
  );
}

export default function DoorSequence() {
  // Memoised so the sequence's preload effect is not re-triggered by renders.
  const getFrameSrc = useCallback((index: number) => FRAME_PATTERN(index), []);

  return (
    <CanvasScrollSequence
      frameCount={FRAME_COUNT}
      getFrameSrc={getFrameSrc}
      scrollVh={320}
      label="הליכה ברחוב אל שער הישיבה, והדלת נפתחת"
      overlay={(progress) => <SequenceOverlay progress={progress} />}
      fallback={
        // Shown while the first frame decodes, and if the sequence fails
        // outright — the section is never an empty white hole.
        <div className="h-full w-full bg-linear-to-b from-white via-pearl to-pearl-dark" />
      }
    />
  );
}
