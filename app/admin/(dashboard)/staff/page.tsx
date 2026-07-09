import type { Metadata } from "next";
import StaffManager from "@/components/admin/StaffManager";
import { getStaff } from "@/lib/staff-data";

export const metadata: Metadata = {
  title: "צוות",
};

export default async function AdminStaffPage() {
  const members = await getStaff();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        ניהול צוות
      </h1>
      <StaffManager members={members} />
    </>
  );
}
