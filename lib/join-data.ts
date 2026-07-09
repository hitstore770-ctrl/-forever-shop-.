// Static content for the "Join Us" page's FAQ. (The daily schedule moved to
// lib/schedule-data.ts + the Firestore "schedule" collection so staff can
// edit it from /admin without a deploy.)

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
