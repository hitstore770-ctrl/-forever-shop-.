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

// The image film revealed right after the door opens. Deliberately not
// autoplayed: it stays a poster until tapped, so opening the home page on
// cellular does not pull down a video nobody asked for.
export const HOME_VIDEO: HomeVideo = {
  title: "סרטון התדמית",
  description: "הצצה לחיי הישיבה — סדרי הלימוד, ההתוועדויות, והקהילה שמחכה לך מעבר לדלת.",
};
