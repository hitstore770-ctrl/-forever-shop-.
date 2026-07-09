import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// The yeshiva's daily schedule (סדר היום). Reads come from the Firestore
// "schedule" collection via the client SDK (public read); writes happen
// server-side through the admin SDK (see the schedule Server Actions).
// Falls back to the seed list below whenever Firebase isn't configured or
// the read fails, so the site works before/without a live database.

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  subtext?: string;
  order: number;
};

// Seed = the previously hardcoded schedule, ready to import into Firestore.
export const SCHEDULE_SEED: ScheduleItem[] = [
  { id: "seed-1", time: "07:00", title: "השכמה", order: 1 },
  { id: "seed-2", time: "07:30", title: "חסידות בוקר", subtext: "לימוד מעמיק בפנימיות התורה", order: 2 },
  { id: "seed-3", time: "08:15", title: "תפילה", order: 3 },
  { id: "seed-4", time: "09:00", title: "סדר א' - נגלה", subtext: "בחברותות", order: 4 },
  { id: "seed-5", time: "13:00", title: "ארוחת צהריים", order: 5 },
  { id: "seed-6", time: "16:00", title: "סדר ב' - חסידות", order: 6 },
  { id: "seed-7", time: "18:00", title: "סדר ערב", subtext: "עיון וחזרה", order: 7 },
  { id: "seed-8", time: "20:30", title: "שיעור כללי", order: 8 },
];

// Reads the schedule from Firestore, ordered by the `order` field. Falls
// back to the seed list if Firebase isn't configured or the read fails.
export async function getSchedule(): Promise<ScheduleItem[]> {
  if (!isFirebaseConfigured || !db) {
    return SCHEDULE_SEED;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "schedule"), orderBy("order", "asc")));
    if (snapshot.empty) return SCHEDULE_SEED;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ScheduleItem);
  } catch (error) {
    console.warn("Failed to load schedule from Firestore, using seed data.", error);
    return SCHEDULE_SEED;
  }
}
