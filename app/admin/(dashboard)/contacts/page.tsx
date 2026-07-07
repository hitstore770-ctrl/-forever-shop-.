import type { Metadata } from "next";
import ContactSubmissionsTable from "@/components/admin/ContactSubmissionsTable";
import { getContactSubmissions } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "פניות ממתקרבים",
};

export default async function AdminContactsPage() {
  const submissions = await getContactSubmissions();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        פניות ממתקרבים
      </h1>
      <ContactSubmissionsTable submissions={submissions} />
    </>
  );
}
