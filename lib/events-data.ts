// Placeholder content for the Events page.
// TODO: back this with a real Firestore collection once ready.

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: "1", title: "התוועדות שבועית", date: "כל מוצ״ש · 21:00", description: "ניגונים, דברי תורה וכיבוד קל." },
  { id: "2", title: "טיול שנתי", date: "כ״ה תשרי", description: "יום מלא בטבע לכל תלמידי הישיבה." },
  { id: "3", title: "יום גיבוש", date: "י״ב חשון", description: "פעילויות גיבוש וספורט לתמימים." },
  { id: "4", title: "ערב הוקרה", date: "ג׳ כסלו", description: "ערב מיוחד לתורמים ולידידי הישיבה." },
];
