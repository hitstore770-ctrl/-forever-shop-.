// Placeholder Kuntres (booklet/shiur) data for the learning area.
// TODO: replace with real content pulled from Firebase (Firestore for the
// metadata below, Storage for the actual PDF/audio files).

export type KuntresCategory = "נגלה" | "חסידות" | "הלכה" | "מועדים";

export const LEARNING_CATEGORIES: KuntresCategory[] = ["נגלה", "חסידות", "הלכה", "מועדים"];

export type Kuntres = {
  id: string;
  title: string;
  author: string;
  date: string;
  category: KuntresCategory;
};

export const KUNTRES_ITEMS: Kuntres[] = [
  { id: "1", title: "קונטרס עיונים בסוגיות הש\"ס", author: "הרב מ. כהן", date: "אלול תשפ\"ה", category: "נגלה" },
  { id: "2", title: "לקוטי שיחות - מבחר מאמרים", author: "הרב י. לוי", date: "תשרי תשפ\"ו", category: "חסידות" },
  { id: "3", title: "הלכות שבת בקצרה", author: "הרב א. גולד", date: "חשון תשפ\"ו", category: "הלכה" },
  { id: "4", title: "קונטרס לימי הסליחות", author: "הרב ש. ווייס", date: "אלול תשפ\"ה", category: "מועדים" },
  { id: "5", title: "שיעורי עומק בחסידות", author: "הרב מ. כהן", date: "כסלו תשפ\"ו", category: "חסידות" },
  { id: "6", title: "עיונים בהלכות ברכות", author: "הרב א. גולד", date: "טבת תשפ\"ו", category: "הלכה" },
  { id: "7", title: "קונטרס פורים", author: "הרב י. לוי", date: "אדר תשפ\"ו", category: "מועדים" },
  { id: "8", title: "חבורה בסוגיית בבא קמא", author: "הרב ש. ווייס", date: "שבט תשפ\"ו", category: "נגלה" },
];
