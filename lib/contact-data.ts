// Placeholder content for the Contact page's "Meet the Team" section.
// TODO: replace with real staff photos (Firebase Storage) once available.

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  // Longer bio used by the "Yeshiva" (About) page's leadership section.
  // Optional since the compact Contact-page card doesn't display it.
  bio?: string;
};

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "1",
    name: "הרב שלמה כהן",
    role: "ראש הישיבה",
    bio: "עומד בראש הישיבה משך למעלה מעשור, ומלווה אישית את דרכם הרוחנית והלימודית של התלמידים.",
  },
  {
    id: "2",
    name: "הרב מנחם וייס",
    role: "משגיח רוחני",
    bio: "אחראי על האווירה הרוחנית בישיבה, ומקדיש זמן אישי לכל תלמיד ותלמיד בצרכיו הרוחניים.",
  },
  {
    id: "3",
    name: "יוסי גרין",
    role: "רכז תלמידים",
    bio: "מלווה את התלמידים בסדר היום, בקשיים ובשמחות, ומהווה כתובת זמינה בכל שעה.",
  },
  {
    id: "4",
    name: "מרדכי ברק",
    role: "רכז מקרבים",
    bio: "מוביל את פעילות הקירוב של הישיבה, ומארח בחום כל מי שמבקש להתקרב ולהכיר.",
  },
];
