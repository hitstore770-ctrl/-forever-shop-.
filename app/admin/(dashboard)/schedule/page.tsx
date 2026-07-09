import type { Metadata } from "next";
import ScheduleManager from "@/components/admin/ScheduleManager";
import { getSchedule } from "@/lib/schedule-data";

export const metadata: Metadata = {
  title: "סדר היום",
};

export default async function AdminSchedulePage() {
  const items = await getSchedule();

  return (
    <>
      <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
        ניהול סדר היום
      </h1>
      <ScheduleManager items={items} />
    </>
  );
}
