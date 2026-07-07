// Hand-drawn brutalist "doodle" accents scattered across empty space on the
// site — stars, squiggly underlines, scribbled circles. Pure decoration
// (aria-hidden), sized/positioned/colored by the caller via className.
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
