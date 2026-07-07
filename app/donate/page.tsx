import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "תרומות",
};

// Donations & Dedications "store" — lets visitors donate or dedicate items (e.g. a page in a
// Kuntres, a day of learning) in memory/honor of someone.
// Planned for a later phase:
// - A payment provider integration (e.g. Stripe / Tranzila / Cardcom, common for Israeli nonprofits)
// - Firebase to store dedication records and render a "wall of honor"
// - A shopping-cart-like flow for selecting dedication types and amounts
export default function DonatePage() {
  return (
    <PagePlaceholder
      title="תרומות והקדשות"
      description="כאן יוצג חנות התרומות וההקדשות."
    />
  );
}
