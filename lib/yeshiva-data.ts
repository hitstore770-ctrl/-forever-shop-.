// Placeholder content for the "Yeshiva" (About) page's history timeline.
// TODO: replace with the real founding story and milestones once provided.

export type HistoryMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: "1",
    year: "תשע\"ה",
    title: "הקמת הישיבה",
    description: "קבוצה ראשונה של תלמידים ומחנכים מתכנסת סביב חזון משותף של תורה וחום.",
  },
  {
    id: "2",
    year: "תשע\"ח",
    title: "מעבר למבנה הקבוע",
    description: "הישיבה עוברת למבנה הנוכחי, ופותחת את שעריה גם לתלמידים מרקעים מגוונים.",
  },
  {
    id: "3",
    year: "תשפ\"א",
    title: "הרחבת מסלול המקרבים",
    description: "לצד מסלול התמימים, נפתח מסלול ייעודי למקרבים המבקשים להתקרב וללמוד.",
  },
  {
    id: "4",
    year: "היום",
    title: "קהילה תוססת",
    description: "עשרות תלמידים, סדר יום עשיר ומגוון, וקהילה חמה שממשיכה לצמוח.",
  },
];
