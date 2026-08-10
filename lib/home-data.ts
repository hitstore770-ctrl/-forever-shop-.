// Content for the home page. Kept here rather than inline in the components so
// the sections stay presentational and this file can later be swapped for a
// Firestore read, the same way gallery/staff/schedule were.

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const HERO_EYEBROW = "יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד!";

// Separate lines because each gets its own overflow mask and its own delay —
// this is not a string that happens to wrap.
export const HERO_TITLE_LINES = ["העתיד שלך", "מתחיל כאן."] as const;

export const HERO_SUBHEAD =
  "מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים. בלב ירושלים.";

export const HERO_CTA = "[ להרשמה לישיבה ]";

/** Anchor the hero CTA and the bottom bar both scroll to. */
export const JOIN_ANCHOR_ID = "join";

export const HERO_FACTS = [
  { label: "מיקום", value: "לב ירושלים" },
  { label: "מסלולים", value: "ארבעה" },
  { label: "הרשמה", value: "פתוחה" },
] as const;

// ---------------------------------------------------------------------------
// Time-aware line
// ---------------------------------------------------------------------------

// Chosen from the *visitor's* clock, not Jerusalem's, so it matches the room
// they are actually sitting in. Resolved only on the client — picking on the
// server would bake one variant into the HTML and mismatch on hydration.
export const TIME_HEADLINES = {
  morning: "מתחילים יום של עוצמה",
  evening: "הקול של ירושלים לא פוסק",
} as const;

/** Morning runs to 17:00; everything else is evening. */
export function headlineForHour(hour: number): string {
  return hour >= 5 && hour < 17 ? TIME_HEADLINES.morning : TIME_HEADLINES.evening;
}

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

// Rendered with a • between each phrase and after the last one, then repeated,
// so the band reads continuously across the loop seam.
export const MARQUEE_PHRASES = [
  "ללמוד בלב ירושלים – ולהשפיע על לב ירושלים",
  "ממקבל למשפיע",
  "תורה, חסידות וכלים לחיים",
] as const;

// ---------------------------------------------------------------------------
// Vision
// ---------------------------------------------------------------------------

export const VISION = {
  eyebrow: "הגישה",
  // One mask per line.
  lines: ["לא כל בחור צריך", "להשתלב באותה תבנית."],
  body:
    "כל בחור מגיע עם הרקע והיכולות שלו. המטרה שלנו היא להתאים עבורך את הדרך שתאפשר לך להתקדם בצורה הטובה ביותר.",
} as const;

// ---------------------------------------------------------------------------
// Tracks (the sharp grid)
// ---------------------------------------------------------------------------

export type TrackItem = {
  title: string;
  description: string;
  meta: string;
  /**
   * Column spans. Mobile is a 2-col grid, sm+ is 3-col.
   *
   * These have to tile both grids exactly — a wide cell that cannot fit in the
   * space left on its row wraps and leaves a hole, which on a filled grid is a
   * very visible rectangle.
   * Mobile: 2 | 1+1 | 2.   Desktop: 2+1 | 1+2.
   */
  span: string;
  /** Inverted tile — navy ground, pearl type. Used as punctuation. */
  inverted?: boolean;
};

export const TRACKS: TrackItem[] = [
  {
    title: "המסלול הלימודי המלא",
    description:
      "שנתיים של לימודים, בנייה והתקדמות לקראת הקמת בית יהודי חסידי.",
    meta: "שנתיים",
    span: "col-span-2 sm:col-span-2",
    inverted: true,
  },
  {
    title: "שילוב עבודה ולימוד",
    description:
      "שלוש שנים. חצי יום לימוד וחצי יום עבודה. חיבור נכון בין גשמיות לרוחניות.",
    meta: "שלוש שנים",
    span: "col-span-1 sm:col-span-1",
  },
  {
    title: "המסלול האקסטרני",
    description:
      "מגורים בבית תוך השתלבות מלאה בליווי, בשיעורים ובחיי החברה בישיבה.",
    meta: "גמיש",
    span: "col-span-1 sm:col-span-1",
  },
  {
    title: "מסלול השלוחים",
    description:
      "בחורים למדנים מ־770 שלומדים איתך אחד־על־אחד ומלווים אותך אישית.",
    meta: "אחד על אחד",
    span: "col-span-2 sm:col-span-2",
    inverted: true,
  },
];

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export type TeamMember = {
  name: string;
  role: string;
  /** Portrait URL once photography exists; falls back to an initials plate. */
  src?: string;
};

export const TEAM: TeamMember[] = [
  { name: "הרב מנחם מנדל חלק", role: "ראש הישיבה" },
  { name: "הרב תום בוזגלו", role: "משפיע ראשי" },
  { name: "הרב שי ביטון", role: "משגיח" },
  { name: "הרב קויפמאן", role: "משגיח משנה" },
  { name: "הרב דובי ציק", role: "מגיד שיעור" },
];

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------

export type HomeStat = {
  value: number;
  /** Rendered immediately after the number, e.g. "+". */
  suffix?: string;
  label: string;
};

export const HOME_STATS: HomeStat[] = [
  { value: 4, label: "מסלולים" },
  { value: 3, label: "ארוחות ביום" },
  { value: 14, label: "שעות לימוד ביום" },
  { value: 770, label: "שלוחים מלווים" },
];

// ---------------------------------------------------------------------------
// Alumni quotes
// ---------------------------------------------------------------------------

export type HomeQuote = { text: string; author: string; detail: string };

export const HOME_QUOTES: HomeQuote[] = [
  { text: "הגעתי לשבוע. נשארתי שלוש שנים.", author: "מ. לוי", detail: "בוגר, תשפ״א" },
  {
    text: "בפעם הראשונה בחיים הרגשתי שיש לי איפה להיות.",
    author: "ש. אברהמי",
    detail: "בוגר, תש״פ",
  },
  { text: "לא ניסו לשנות אותי. עזרו לי להיות מי שאני.", author: "י. בן־חיים", detail: "בוגר, תשפ״ב" },
  { text: "החברותא שלי מהישיבה הוא היום השושבין שלי.", author: "ד. מזרחי", detail: "בוגר, תשע״ט" },
];

// ---------------------------------------------------------------------------
// FAQ — campus & life
// ---------------------------------------------------------------------------

export type FaqItem = { question: string; answer: string };

export const HOME_FAQ: FaqItem[] = [
  {
    question: "קמפוס ופנימייה",
    answer:
      "פנימייה מרווחת, חדרים ממוזגים, ומקווה טהרה חדש בתוך מתחם הישיבה לשימוש נוח בסדר היום.",
  },
  {
    question: "ארוחות",
    answer:
      "3 ארוחות מסודרות ביום המוכנות על ידי טבח צמוד, כדי שתוכל להיות פנוי נטו להתקדמות.",
  },
  {
    question: "חיי חברה חסידיים",
    answer:
      "התוועדויות, שבתות משותפות, ויצירת קשר אישי עם משפיעים באווירה משפחתית ורצינית.",
  },
  {
    question: "שליחות בירושלים",
    answer:
      "יציאה לפעילות בכיכר ציון ושוק מחנה יהודה. לחיות שליחות בפועל ולהיות דור המשפיעים הבא.",
  },
];

// ---------------------------------------------------------------------------
// Join form
// ---------------------------------------------------------------------------

export const JOIN_FORM = {
  headline: "המקום שלך לגדול. בוא נדבר.",
  submit: "אני בפנים",
  fields: {
    name: "שם מלא",
    age: "גיל",
    phone: "טלפון",
    track: "איזה מסלול מעניין אותך?",
  },
} as const;

// ---------------------------------------------------------------------------
// Bottom navigation
// ---------------------------------------------------------------------------

export type BottomNavItem = {
  href: string;
  label: string;
  icon: "home" | "schedule" | "gallery" | "contact";
};

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/", label: "בית", icon: "home" },
  { href: "/join", label: "סדר יום", icon: "schedule" },
  { href: "/gallery", label: "גלריה", icon: "gallery" },
  { href: "/contact", label: "קשר", icon: "contact" },
];
