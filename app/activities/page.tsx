import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "פעילויות",
};

// Activities page — photo gallery + events listing.
// Planned for a later phase:
// - A gallery grid/lightbox component (images likely served from Firebase Storage)
// - An events list/calendar (Firestore-backed) with upcoming/past filtering
// - Subtle entrance animations (e.g. Framer Motion) once real content exists
export default function ActivitiesPage() {
  return (
    <PagePlaceholder
      title="פעילויות"
      description="גלריית תמונות ואירועים יופיעו כאן."
    />
  );
}
