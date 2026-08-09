// Content for the home page. Kept here rather than inline in the components so
// the sections stay presentational and this file can later be swapped for a
// Firestore read, the same way gallery/staff/schedule were.

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

// Set as separate lines because each one gets its own overflow mask and its
// own delay — this is not a string that happens to wrap.
export const HERO_TITLE_LINES = ["להתעלות.", "ברמה אחרת."] as const;

export const HERO_META = {
  eyebrow: "תומכי תמימים ליובאוויטש · ירושלים",
  facts: [
    { label: "מיקום", value: "לב ירושלים" },
    { label: "מסלול", value: "זמן מלא" },
    { label: "הרשמה", value: "פתוחה" },
  ],
} as const;

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

// Rendered with a • between each phrase and after the last one, then repeated,
// so the band reads continuously across the loop seam.
export const MARQUEE_PHRASES = ["ישיבה מבוקשת בלב ירושלים", "לומדים בסבבה"] as const;

// ---------------------------------------------------------------------------
// Sharp grid
// ---------------------------------------------------------------------------

export type SharpGridItem = {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: "schedule" | "gallery" | "staff" | "learning" | "events" | "donate";
  /**
   * Column spans. Mobile is a 2-col grid, sm+ is 3-col.
   *
   * These have to tile both grids exactly — a wide cell that cannot fit in the
   * space left on its row wraps and leaves a hole, which on a black grid is a
   * very visible black rectangle.
   * Mobile: 2 | 1+1 | 1+1 | 2.   Desktop: 2+1 | 1+1+1 | 3.
   */
  span: string;
  /** Black tile with white type. Used sparingly, as punctuation. */
  inverted?: boolean;
};

export const SHARP_GRID_ITEMS: SharpGridItem[] = [
  {
    href: "/join",
    title: "סדר היום",
    description: "משעת ההשכמה ועד סוף סדר ערב — איך נראה יום בישיבה.",
    cta: "לסדר המלא",
    icon: "schedule",
    span: "col-span-2 sm:col-span-2",
    inverted: true,
  },
  {
    href: "/gallery",
    title: "גלריה",
    description: "רגעים מבית המדרש.",
    cta: "לצפייה",
    icon: "gallery",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/yeshiva",
    title: "הצוות",
    description: "הרבנים והמשפיעים שילוו אותך.",
    cta: "להכיר",
    icon: "staff",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/learning",
    title: "לימוד",
    description: "קונטרסים ושיעורים להורדה.",
    cta: "לחומרים",
    icon: "learning",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/events",
    title: "אירועים",
    description: "התוועדויות ושיעורים קרובים.",
    cta: "ללוח",
    icon: "events",
    span: "col-span-1 sm:col-span-1",
  },
  {
    href: "/donate",
    title: "לקחת חלק",
    description: "תרומות והקדשות לזכות ולעילוי נשמה.",
    cta: "לתרומה",
    icon: "donate",
    span: "col-span-2 sm:col-span-3",
    inverted: true,
  },
];
