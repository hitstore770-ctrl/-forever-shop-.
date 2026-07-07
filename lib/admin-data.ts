// Placeholder content for the admin dashboard.
// TODO: replace with real data from Firebase once the dashboard is wired up
// to Firestore (donations/contact-form collections) and a payment gateway's
// webhook/reporting API.

export type PaymentStatus = "שולם" | "ממתין" | "נכשל";

export type DonationRecord = {
  id: string;
  date: string;
  donorName: string;
  tier: string;
  amount: number;
  status: PaymentStatus;
};

export const DONATIONS_TABLE: DonationRecord[] = [
  { id: "1", date: "05/07/2026", donorName: "משפחת כהן", tier: "הקדשת יום לימוד", amount: 180, status: "שולם" },
  { id: "2", date: "04/07/2026", donorName: "יעקב לוי", tier: "הדפסת קונטרסים A5", amount: 360, status: "שולם" },
  { id: "3", date: "03/07/2026", donorName: "אנונימי", tier: "ממתקים וכיבוד להתוועדות", amount: 250, status: "ממתין" },
  { id: "4", date: "02/07/2026", donorName: "משפחת גולד", tier: "תרומה כללית", amount: 100, status: "שולם" },
  { id: "5", date: "30/06/2026", donorName: "שרה ווייס", tier: "הקדשת יום לימוד", amount: 180, status: "נכשל" },
  { id: "6", date: "29/06/2026", donorName: "דוד מזרחי", tier: "תרומה כללית", amount: 500, status: "שולם" },
  { id: "7", date: "27/06/2026", donorName: "משפחת אברהם", tier: "הדפסת קונטרסים A5", amount: 360, status: "ממתין" },
  { id: "8", date: "25/06/2026", donorName: "רחל כץ", tier: "ממתקים וכיבוד להתוועדות", amount: 250, status: "שולם" },
];

export type ContactSubmission = {
  id: string;
  date: string;
  name: string;
  phone: string;
  preferredDate: string;
};

// Mirrors the fields collected by the "Join Us" visit-request form.
export const CONTACT_SUBMISSIONS: ContactSubmission[] = [
  { id: "1", date: "05/07/2026", name: "איתי שלום", phone: "050-1234567", preferredDate: "10/07/2026" },
  { id: "2", date: "03/07/2026", name: "משה פרידמן", phone: "052-7654321", preferredDate: "12/07/2026" },
  { id: "3", date: "01/07/2026", name: "נועם ביטון", phone: "054-9876543", preferredDate: "08/07/2026" },
];
