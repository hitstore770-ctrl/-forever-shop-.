import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// Placeholder content for the admin dashboard — used as a fallback when
// Firebase isn't configured yet, and as the shape Firestore documents in the
// "donations" / "contactSubmissions" collections are expected to match.

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

// Reads the "donations" collection from Firestore, newest first.
// Falls back to the local placeholder list if Firebase isn't configured, or
// if the read fails for any reason (e.g. security rules not set up yet).
export async function getDonations(): Promise<DonationRecord[]> {
  if (!isFirebaseConfigured || !db) {
    return DONATIONS_TABLE;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "donations"), orderBy("createdAt", "desc")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as DonationRecord);
  } catch (error) {
    console.warn("Failed to load donations from Firestore, using mock data.", error);
    return DONATIONS_TABLE;
  }
}

// Writes a new dedication to Firestore once a mock payment is confirmed.
// No-ops (just logs) when Firebase isn't configured, so the checkout flow
// still completes end-to-end in local/demo environments.
export async function addDonation(donation: Omit<DonationRecord, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.log("[Firestore placeholder] Would save donation:", donation);
    return;
  }

  try {
    await addDoc(collection(db, "donations"), { ...donation, createdAt: serverTimestamp() });
  } catch (error) {
    console.error("Failed to save donation to Firestore.", error);
    throw error;
  }
}

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

// Reads the "contactSubmissions" collection from Firestore, newest first.
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isFirebaseConfigured || !db) {
    return CONTACT_SUBMISSIONS;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "contactSubmissions"), orderBy("date", "desc")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ContactSubmission);
  } catch (error) {
    console.warn("Failed to load contact submissions from Firestore, using mock data.", error);
    return CONTACT_SUBMISSIONS;
  }
}
