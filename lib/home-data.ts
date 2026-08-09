// Content for the redesigned home page. Kept here (rather than inline in the
// components) so the sections stay presentational and this file can later be
// swapped for a Firestore read, the same way gallery/staff/schedule were.

export type HeroSlide = {
  id: string;
  alt: string;
  /** Once real photography exists, set this to the uploaded image URL. */
  src?: string;
};

// The hero crossfade. Without `src` each slide renders as a tinted placeholder
// panel showing its caption, so the fade is visible and tunable before any
// photos are in.
export const HERO_SLIDES: HeroSlide[] = [
  { id: "beit-midrash", alt: "בית המדרש בשעת הסדר" },
  { id: "chavruta", alt: "לימוד בחברותא" },
  { id: "farbrengen", alt: "התוועדות חסידית" },
  { id: "jerusalem", alt: "נוף ירושלים מהישיבה" },
];

export type HomeVideo = {
  /** MP4/WebM in public/, or any absolute URL. */
  src?: string;
  /** Still shown before playback starts. */
  poster?: string;
  title: string;
  description: string;
};

// The image film. Deliberately not autoplayed: it stays a poster until tapped,
// so opening the home page on cellular does not pull down a video nobody
// asked for. Currently a spare content slot — the home page leads with the
// alley clip below instead.
export const HOME_VIDEO: HomeVideo = {
  title: "סרטון התדמית",
  description: "הצצה לחיי הישיבה — סדרי הלימוד, ההתוועדויות, והקהילה שמחכה לך מעבר לדלת.",
};

// ---------------------------------------------------------------------------
// Hero headline + the typewriter line under it.
// ---------------------------------------------------------------------------

export const HERO_TITLE_LINES = ["להתעלות.", "ברמה אחרת."] as const;

// The subtitle reads "ישיבה <word> בלב ירושלים". It lands on WORD_FROM, holds,
// then rewrites itself to WORD_TO. Both words are the same length, which keeps
// the reserved width honest — if you swap them for a longer pair the sizer in
// TypewriterWord still handles it, it just reserves more room.
export const HERO_SUBTITLE = {
  prefix: "ישיבה ",
  wordFrom: "מבוססת",
  wordTo: "מבוקשת",
  suffix: " בלב ירושלים",
} as const;

// ---------------------------------------------------------------------------
// The alley clip.
// ---------------------------------------------------------------------------

export type AlleyVideo = {
  /** File in public/, or any absolute URL. */
  src: string;
  /** Optional still. Without it the card shows a tinted gradient until the
      first frame decodes — never a black rectangle. */
  poster?: string;
  caption: string;
};

// Scroll-scrubbed in feel but not in fact: the clip plays itself (muted, looped)
// and only the *card* is driven by scroll. That is the whole reason this
// replaced the canvas frame sequence — no per-frame decode work on the main
// thread, so it cannot stutter the way a scrubbed <video> or a 48-image
// sequence can on a mid-range phone.
export const ALLEY_VIDEO: AlleyVideo = {
  src: "/yavetz-walk.mp4",
  caption: "ללמוד בסבבה, עם חבר'ה טובים",
};

// ---------------------------------------------------------------------------
// Bento grid.
// ---------------------------------------------------------------------------

export type BentoCard = {
  href: string;
  title: string;
  description: string;
  icon: "schedule" | "gallery" | "staff" | "learning" | "events" | "donate";
  /**
   * Tailwind column spans. Mobile is a 2-col grid, sm+ is 3-col.
   *
   * These have to tile both grids exactly — a wide cell that cannot fit in
   * the space left on its row wraps and leaves a visible hole behind it.
   * Mobile: 2 | 1+1 | 1+1 | 2. Desktop: 2+1 | 1+1+1 | 3.
   */
  span: string;
  /** Feature cells get the tinted treatment; the rest stay plain white. */
  feature?: boolean;
};

export const BENTO_CARDS: BentoCard[] = [
  {
    href: "/join",
    title: "סדר היום",
    description: "משעת ההשכמה ועד סוף סדר ערב — איך נראה יום בישיבה.",
    icon: "schedule",
    span: "col-span-2 sm:col-span-2",
    feature: true,
  },
  {
    href: "/gallery",
    title: "גלריה",
    description: "רגעים מבית המדרש.",
    icon: "gallery",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/yeshiva",
    title: "הצוות",
    description: "הרבנים והמשפיעים שילוו אותך.",
    icon: "staff",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/learning",
    title: "לימוד",
    description: "קונטרסים ושיעורים להורדה.",
    icon: "learning",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/events",
    title: "אירועים",
    description: "התוועדויות ושיעורים קרובים.",
    icon: "events",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/donate",
    title: "לקחת חלק",
    description: "תרומות והקדשות לזכות ולעילוי נשמה.",
    icon: "donate",
    span: "col-span-2 sm:col-span-3",
    feature: true,
  },
];
