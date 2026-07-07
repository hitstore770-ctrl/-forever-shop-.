import type { Metadata } from "next";
import { CartProvider } from "@/components/donate/CartContext";
import DonationTierCard from "@/components/donate/DonationTierCard";
import RecentDedications from "@/components/donate/RecentDedications";
import CartButton from "@/components/donate/CartButton";
import CartSidebar from "@/components/donate/CartSidebar";
import { SquigglyUnderline, DoodleStar, DoodleScribble, DoodleDots, DoodleZigzag } from "@/components/doodles";
import { DONATION_TIERS } from "@/lib/donate-data";

export const metadata: Metadata = {
  title: "תרומות",
};

// Donations & Dedications storefront.
// TODO for a later phase: back the tiers/recent-dedications with Firebase,
// and wire the cart's checkout up to a real payment provider (e.g.
// Tranzila/Cardcom/Stripe — common for Israeli nonprofits).
export default function DonatePage() {
  return (
    <CartProvider>
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
        <DoodleStar className="pointer-events-none absolute top-8 left-6 hidden h-8 w-8 text-copper-500 xl:block" />
        <DoodleZigzag className="pointer-events-none absolute top-40 left-2 hidden h-5 w-14 text-navy-900/25 xl:block" />

        <h1 className="relative max-w-3xl text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
          תרומות
          <br />
          <span className="relative inline-block bg-copper-500 px-3 text-cream">
            והקדשות
            <SquigglyUnderline className="absolute -bottom-3 right-0 h-2 w-full text-navy-900" />
          </span>
        </h1>
        <p className="mt-8 max-w-xl border-r-4 border-navy-900 pr-4 text-lg font-normal text-navy-800">
          כל תרומה מוקדשת לזכות או לעילוי נשמת מי שתבחרו — בחרו הקדשה, הוסיפו לעגלה, וסיימו בקלות.
        </p>

        <div className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DoodleDots className="pointer-events-none absolute -top-8 right-1/4 hidden h-6 w-14 text-copper-500/50 xl:block" />
          {DONATION_TIERS.map((tier, index) => (
            <DonationTierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        <div className="relative mt-24">
          <div className="mb-8 flex items-center gap-3">
            <h2 className="inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal sm:text-3xl">
              הקדשות אחרונות
            </h2>
            <DoodleScribble className="hidden h-6 w-12 text-copper-500/70 sm:block" />
          </div>
          <RecentDedications />
        </div>
      </div>

      <CartButton />
      <CartSidebar />
    </CartProvider>
  );
}
