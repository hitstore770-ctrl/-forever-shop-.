import type { Metadata } from "next";
import StatsRow from "@/components/admin/StatsRow";
import DonationsTable from "@/components/admin/DonationsTable";
import { getDonations } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "תרומות והקדשות",
};

export default async function AdminDonationsPage() {
  const donations = await getDonations();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        תרומות והקדשות
      </h1>
      <div className="space-y-8">
        <StatsRow donations={donations} />
        <DonationsTable donations={donations} />
      </div>
    </>
  );
}
