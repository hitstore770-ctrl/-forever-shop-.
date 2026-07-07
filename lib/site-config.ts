// Central place for site-wide constants so components and pages
// (and, later, Firebase-driven content) all read from one source of truth.

export type NavLink = {
  href: string;
  label: string;
};

export const SITE_NAME = "ישיבת ...";

// Sticky header + footer navigation share this list.
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "בית" },
  { href: "/learning", label: "לימוד" },
  { href: "/join", label: "הצטרפות" },
  { href: "/donate", label: "תרומות" },
  { href: "/activities", label: "פעילויות" },
  { href: "/contact", label: "צור קשר" },
];

// WhatsApp contact number, international format (no "+") for wa.me links.
export const WHATSAPP_NUMBER = "972559345372";
export const WHATSAPP_DISPLAY = "055-934-5372";

export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Placeholder headlines for the homepage news ticker.
// TODO: replace with live items pulled from Firebase once the CMS is wired up.
export const NEWS_TICKER_ITEMS: string[] = [
  "מזל טוב לחתן הבר מצווה ולכל המשפחה!",
  "השבוע: שיעור מיוחד לרגל ההילולא",
  "נפתחה ההרשמה לזמן החורף הבעל\"ט",
  "עדכון סדרי הישיבה לימי שישי וערבי חג",
];

export type QuickNavCard = {
  href: string;
  title: string;
  description: string;
  icon: "learning" | "join" | "donate" | "activities";
};

// Cards on the homepage that route to the four main sections of the site.
export const QUICK_NAV_CARDS: QuickNavCard[] = [
  {
    href: "/learning",
    title: "לימוד",
    description: "קונטרסים, שיעורים וחומרי לימוד",
    icon: "learning",
  },
  {
    href: "/join",
    title: "הצטרפות",
    description: "מידע וסדר יום לתלמידים חדשים",
    icon: "join",
  },
  {
    href: "/donate",
    title: "תרומות",
    description: "תרומות והקדשות לזכות ולעילוי נשמה",
    icon: "donate",
  },
  {
    href: "/activities",
    title: "פעילויות",
    description: "גלריה ואירועים מהישיבה",
    icon: "activities",
  },
];
