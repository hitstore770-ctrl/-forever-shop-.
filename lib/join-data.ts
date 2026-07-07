// Placeholder content for the "Join Us" page.
// TODO: replace with real data from Firebase once staff can edit the
// schedule/FAQ without a deploy.

export type ScheduleItem = {
  time: string;
  title: string;
  note?: string;
};

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  { time: "07:00", title: "השכמה" },
  { time: "07:30", title: "חסידות בוקר", note: "לימוד מעמיק בפנימיות התורה" },
  { time: "08:15", title: "תפילה" },
  { time: "09:00", title: "סדר א' - נגלה", note: "בחברותות" },
  { time: "13:00", title: "ארוחת צהריים" },
  { time: "16:00", title: "סדר ב' - חסידות" },
  { time: "18:00", title: "סדר ערב", note: "עיון וחזרה" },
  { time: "20:30", title: "שיעור כללי" },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "אני לא מגיע מרקע ישיבתי - זה בכלל מתאים לי?",
    answer:
      "בהחלט. חלק גדול מהחבר'ה אצלנו התחילו בדיוק כמוך. הקצב מותאם אישית, ואף אחד לא ישפוט אותך על מה שאתה לא יודע - רק על הרצון להתקדם.",
  },
  {
    question: "כמה זמן צריך להתחייב?",
    answer:
      "אפשר להתחיל בתקופת ניסיון קצרה ולראות איך מרגישים. אין לחץ להתחייב לשנה שלמה מהיום הראשון.",
  },
  {
    question: "יש אפשרות ללינה במקום?",
    answer: "כן, יש מעונות במקום. נשמח לספר לך על כל האופציות בשיחה אישית.",
  },
  {
    question: "אפשר לבוא לנסות לפני שמחליטים?",
    answer:
      "ממש בשביל זה יש טופס \"קביעת ביקור\" למטה - תבואו ליום או שניים, תרגישו את האווירה, ותחליטו בעצמכם.",
  },
];
