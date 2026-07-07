// Placeholder content for the Activities & Gallery page.
// TODO: replace with real photos (Firebase Storage) and a real events
// collection (Firestore) once those are wired up.

export type GalleryPhoto = {
  id: string;
  caption: string;
  size: "sm" | "md" | "lg";
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "1", caption: "התוועדות חנוכה", size: "lg" },
  { id: "2", caption: "סדר לימוד בוקר", size: "sm" },
  { id: "3", caption: "ריקודי שמחת תורה", size: "md" },
  { id: "4", caption: "טיול שנתי לצפון", size: "lg" },
  { id: "5", caption: "מסיבת חנוכה", size: "sm" },
  { id: "6", caption: "ערב שירה וניגונים", size: "md" },
  { id: "7", caption: "חלוקת קונטרסים", size: "sm" },
  { id: "8", caption: "התוועדות פורים", size: "lg" },
  { id: "9", caption: "יום ספורט", size: "md" },
];

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
