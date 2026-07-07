// Hand-drawn brutalist "doodle" accents scattered across empty space on the
// site — stars, squiggly underlines, scribbled circles, marker highlights.
// Pure decoration (aria-hidden), sized/positioned/colored by the caller via
// className.
import type { ReactNode } from "react";

type DoodleProps = {
  className?: string;
};

// A wavy underline to put beneath a heading/highlight, e.g.
// <SquigglyUnderline className="w-40 h-3 text-copper-500" />
export function SquigglyUnderline({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 12c8-9 16-9 24 0s16 9 24 0 16-9 24 0 16 9 24 0 16-9 24 0 16 9 24 0 16-9 24 0"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// A hand-drawn 4-point sparkle/star, e.g.
// <DoodleStar className="h-8 w-8 text-copper-500" />
export function DoodleStar({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 2c1 8 3 11 4 12 1 1 9 3 14 6-8 1-13 3-14 4s-3 8-4 14c-1-8-3-11-4-12-1-1-9-3-14-6 8-1 13-3 14-4s3-8 4-14Z"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.15}
      />
    </svg>
  );
}

// A rough, sketchy "circled" mark — good for drawing attention to a word or badge.
export function DoodleCircle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 50" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 4C25 3 6 12 5 25c-1 13 20 22 45 21 26-1 46-11 45-23C94 12 74 4 50 4Z"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// A thick brutalist plus/asterisk, scattered as filler in empty corners.
export function DoodlePlus({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

// A curly hand-drawn arrow — points from a caption toward a nearby CTA.
export function DoodleArrow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 8c10 2 20 10 22 22 1 7-2 14-8 18"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <path d="M10 42 18 48 22 38" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A messy hand-scribbled loop — circling emphasis, scrappier than DoodleCircle.
export function DoodleScribble({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 50" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 30c-2-12 15-22 40-22s44 8 44 20-20 20-44 19S9 40 12 28s28-16 46-14 34 10 32 18"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

// A short decorative zigzag/energy line.
export function DoodleZigzag({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 18 12 4 22 16 32 2 42 16 52 4 58 18"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A small scattered cluster of dots/sparkles.
export function DoodleDots({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 30" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="6" cy="8" r="3" />
      <circle cx="24" cy="20" r="4" />
      <circle cx="42" cy="6" r="2.5" />
      <circle cx="54" cy="22" r="3" />
    </svg>
  );
}

// A rough highlighter-marker swash — meant to sit behind a word/phrase.
// Prefer the <MarkerHighlight> wrapper below over using this directly.
function DoodleHighlight({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 22C40 6 90 4 130 10c30 4 55 2 67 8l-1 16c-46-4-106 0-156-4-20-2-32 0-37 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Wraps a word/phrase with a rough highlighter-marker stroke behind it, e.g.
// <MarkerHighlight colorClassName="text-copper-400/70">חם</MarkerHighlight>
export function MarkerHighlight({
  children,
  colorClassName = "text-copper-400/70",
}: {
  children: ReactNode;
  colorClassName?: string;
}) {
  return (
    <span className="relative isolate inline-block px-1">
      {/* Rendered first in DOM order (default stacking), so it paints
          behind the text below without needing z-index tricks. */}
      <DoodleHighlight className={`pointer-events-none absolute -inset-x-1 inset-y-1 ${colorClassName}`} />
      <span className="relative">{children}</span>
    </span>
  );
}
