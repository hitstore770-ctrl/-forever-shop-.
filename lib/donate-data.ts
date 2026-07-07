// Placeholder content for the Donate/Dedications storefront.
// TODO: replace with real data from Firebase, and hook the tiers up to a
// payment provider (e.g. Tranzila/Cardcom/Stripe — common for Israeli nonprofits).

export type DonationTier = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const DONATION_TIERS: DonationTier[] = [
  {
    id: "day-of-learning",
    title: "הקדשת יום לימוד",
    description: "יום שלם של לימוד בישיבה יוקדש לזכות או לעילוי נשמת מי שתבחרו.",
    price: 180,
  },
  {
    id: "kuntres-printing",
    title: "הדפסת קונטרסים A5 לזכות",
    description: "מימון הדפסת קונטרס לימוד עם הקדשה אישית מודפסת על השער.",
    price: 360,
  },
  {
    id: "farbrengen-refreshments",
    title: "ממתקים וכיבוד להתוועדות",
    description: "תשמחו את התלמידים בהתוועדות עם ממתקים וכיבוד לזכות אהוביכם.",
    price: 250,
  },
  {
    id: "general-donation",
    title: "תרומה כללית לישיבה",
    description: "תרומה לטובת הפעילות השוטפת והצרכים היומיומיים של הישיבה.",
    price: 100,
  },
];

export type RecentDedication = {
  name: string;
  note: string;
  timeAgo: string;
};

// Social proof — recent dedications, shown as a straight scrolling/grid list.
export const RECENT_DEDICATIONS: RecentDedication[] = [
  { name: "משפחת כהן", note: "הקדשת יום לימוד לעילוי נשמת ר' דוד בן שרה", timeAgo: "לפני יומיים" },
  { name: "יעקב לוי", note: "הדפסת קונטרס לזכות הצלחת הילדים", timeAgo: "לפני 4 ימים" },
  { name: "אנונימי", note: "ממתקים וכיבוד להתוועדות שמחה", timeAgo: "לפני שבוע" },
  { name: "משפחת גולד", note: "תרומה כללית לזכות רפואה שלמה", timeAgo: "לפני שבוע" },
];
