import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "לימוד",
};

// Learning area — will host Kuntresim (booklets) and other study files.
// Planned integrations for a later phase:
// - Firebase (Firestore/Storage) to list and serve the actual files/Kuntresim
// - An in-browser PDF viewer (e.g. react-pdf) to preview documents without downloading
// - Category/search filtering once the file list grows
export default function LearningPage() {
  return (
    <PagePlaceholder
      title="לימוד"
      description="כאן יוצג אזור הלימוד עם קונטרסים וקבצים להורדה ולעיון."
    />
  );
}
