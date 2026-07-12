import type { Metadata } from "next";
import HistoryManager from "@/components/admin/HistoryManager";
import { getMilestones } from "@/lib/yeshiva-data";

export const metadata: Metadata = {
  title: "ארכיון היסטורי",
};

export default async function AdminHistoryPage() {
  const milestones = await getMilestones();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        ניהול ארכיון היסטורי
      </h1>
      <HistoryManager milestones={milestones} />
    </>
  );
}
