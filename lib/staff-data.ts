import { getPublicCollection, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

// The yeshiva's team & rabbis (צוות הישיבה). Reads come from the Firestore
// "staff" collection via the client SDK (public read); writes happen
// server-side through the admin SDK (see the staff Server Actions). Falls
// back to the seed list below whenever Firebase isn't configured.
//
// `order` is auto-assigned (not a CMS field) purely to keep the list in a
// stable, predictable sequence — seed members keep their listed order, and
// newly-added members sort to the end.

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl?: string;
  order: number;
};

// Seed = the previously hardcoded staff, ready to import into Firestore.
export const STAFF_SEED: StaffMember[] = [
  {
    id: "seed-1",
    name: "הרב שלמה כהן",
    role: "ראש הישיבה",
    description: "עומד בראש הישיבה משך למעלה מעשור, ומלווה אישית את דרכם הרוחנית והלימודית של התלמידים.",
    order: 1,
  },
  {
    id: "seed-2",
    name: "הרב מנחם וייס",
    role: "משגיח רוחני",
    description: "אחראי על האווירה הרוחנית בישיבה, ומקדיש זמן אישי לכל תלמיד ותלמיד בצרכיו הרוחניים.",
    order: 2,
  },
  {
    id: "seed-3",
    name: "יוסי גרין",
    role: "רכז תלמידים",
    description: "מלווה את התלמידים בסדר היום, בקשיים ובשמחות, ומהווה כתובת זמינה בכל שעה.",
    order: 3,
  },
  {
    id: "seed-4",
    name: "מרדכי ברק",
    role: "רכז מקרבים",
    description: "מוביל את פעילות הקירוב של הישיבה, ומארח בחום כל מי שמבקש להתקרב ולהכיר.",
    order: 4,
  },
];

// Reads the staff from Firestore, ordered by `order`. Falls back to the
// seed list if Firebase isn't configured or the read fails.
export async function getStaff(): Promise<StaffMember[]> {
  if (!isFirebaseAdminConfigured) return STAFF_SEED;

  try {
    const documents = await getPublicCollection<StaffMember>("staff", "order", "asc");
    if (!documents.length) return STAFF_SEED;
    return documents.map(({ id, data }) => ({ ...data, id }));
  } catch (error) {
    console.warn("Failed to load staff from Firestore, using seed data.", error);
    return STAFF_SEED;
  }
}
