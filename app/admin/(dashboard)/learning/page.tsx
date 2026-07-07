import type { Metadata } from "next";
import LearningMaterialsTable from "@/components/admin/LearningMaterialsTable";
import { getKuntresim } from "@/lib/learning-data";

export const metadata: Metadata = {
  title: "קונטרסים ושיעורים",
};

export default async function AdminLearningPage() {
  const kuntresim = await getKuntresim();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        קונטרסים ושיעורים
      </h1>
      <LearningMaterialsTable items={kuntresim} />
    </>
  );
}
