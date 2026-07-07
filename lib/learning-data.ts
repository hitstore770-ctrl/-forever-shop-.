import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// Placeholder Kuntres (booklet/shiur) data for the learning area — used as a
// fallback when Firebase isn't configured yet, and as the shape Firestore
// documents in the "kuntresim" collection are expected to match.
// TODO: Storage still needs wiring up for the actual PDF/audio files once a
// document also carries a fileUrl/audioUrl field.

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

// Reads the "kuntresim" collection from Firestore, newest first.
// Falls back to the local placeholder list if Firebase isn't configured, or
// if the read fails for any reason (e.g. security rules not set up yet).
export async function getKuntresim(): Promise<Kuntres[]> {
  if (!isFirebaseConfigured || !db) {
    return KUNTRES_ITEMS;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "kuntresim"), orderBy("date", "desc")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Kuntres);
  } catch (error) {
    console.warn("Failed to load kuntresim from Firestore, using mock data.", error);
    return KUNTRES_ITEMS;
  }
}
