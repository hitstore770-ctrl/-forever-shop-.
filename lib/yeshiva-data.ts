import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// The yeshiva's history timeline (ציר הזמן / ארכיון). Reads come from the
// Firestore "history" collection via the client SDK (public read); writes
// happen server-side through the admin SDK behind the passcode gate (see the
// history Server Actions). Each milestone may carry an archive image. Falls
// back to the seed list below whenever Firebase isn't configured or the
// collection is empty.
//
// `order` is auto-assigned so new milestones sort to the end of the timeline.

export type HistoryMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  order?: number;
};

// Seed = the previously hardcoded milestones, ready to import into Firestore.
export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: "1",
    year: 'תשע"ה',
    title: "הקמת הישיבה",
    description: "קבוצה ראשונה של תלמידים ומחנכים מתכנסת סביב חזון משותף של תורה וחום.",
    order: 1,
  },
  {
    id: "2",
    year: 'תשע"ח',
    title: "מעבר למבנה הקבוע",
    description: "הישיבה עוברת למבנה הנוכחי, ופותחת את שעריה גם לתלמידים מרקעים מגוונים.",
    order: 2,
  },
  {
    id: "3",
    year: 'תשפ"א',
    title: "הרחבת מסלול המקרבים",
    description: "לצד מסלול התמימים, נפתח מסלול ייעודי למקרבים המבקשים להתקרב וללמוד.",
    order: 3,
  },
  {
    id: "4",
    year: "היום",
    title: "קהילה תוססת",
    description: "עשרות תלמידים, סדר יום עשיר ומגוון, וקהילה חמה שממשיכה לצמוח.",
    order: 4,
  },
];

// Reads the history milestones from Firestore, ordered by `order`. Falls back
// to the seed list if Firebase isn't configured, the collection is empty, or
// the read fails.
export async function getMilestones(): Promise<HistoryMilestone[]> {
  if (!isFirebaseConfigured || !db) {
    return HISTORY_MILESTONES;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "history"), orderBy("order", "asc")));
    if (snapshot.empty) return HISTORY_MILESTONES;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as HistoryMilestone);
  } catch (error) {
    console.warn("Failed to load history from Firestore, using seed data.", error);
    return HISTORY_MILESTONES;
  }
}
