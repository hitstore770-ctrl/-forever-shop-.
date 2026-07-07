// Placeholder content for the Contact page's "Meet the Team" section.
// TODO: replace with real staff photos (Firebase Storage) once available.

export type StaffMember = {
  id: string;
  name: string;
  role: string;
};

export const STAFF_MEMBERS: StaffMember[] = [
  { id: "1", name: 'הרב שלמה כהן', role: "ראש הישיבה" },
  { id: "2", name: 'הרב מנחם וייס', role: "משגיח רוחני" },
  { id: "3", name: "יוסי גרין", role: "רכז תלמידים" },
  { id: "4", name: "מרדכי ברק", role: "רכז מקרבים" },
];
