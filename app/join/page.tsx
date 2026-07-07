import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "הצטרפות",
};

// Join page — general information for prospective students plus the daily schedule (סדר יום).
// Planned for a later phase:
// - A structured schedule table/timeline component (likely driven by Firebase so staff can edit it)
// - A registration/interest form
export default function JoinPage() {
  return (
    <PagePlaceholder
      title="הצטרפות"
      description="מידע כללי על ההצטרפות לישיבה וסדר היום היומי יופיעו כאן."
    />
  );
}
