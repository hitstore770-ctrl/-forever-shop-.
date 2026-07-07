import type { Metadata } from "next";
import StaffTable from "@/components/admin/StaffTable";
import { STAFF_MEMBERS } from "@/lib/contact-data";

export const metadata: Metadata = {
  title: "צוות",
};

// Read-only skeleton — see components/admin/StaffTable.tsx for what's
// still TODO before this becomes a real content-management screen.
export default function AdminStaffPage() {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
          צוות
        </h1>
        <button
          type="button"
          disabled
          title="בקרוב — ניהול צוות מלא"
          className="border-2 border-black bg-cream px-4 py-2 text-sm font-semibold text-navy-900/40 uppercase shadow-brutal cursor-not-allowed"
        >
          + הוספת איש צוות
        </button>
      </div>
      <StaffTable staff={STAFF_MEMBERS} />
    </>
  );
}
