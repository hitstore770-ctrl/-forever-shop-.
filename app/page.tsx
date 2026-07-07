import NewsTicker from "@/components/NewsTicker";
import Hero from "@/components/Hero";
import QuickNavCards from "@/components/QuickNavCards";
import DailyDedication from "@/components/DailyDedication";

// Home page.
// Future additions: highlights pulled from the learning area, an
// upcoming-activities preview, and a donation progress widget — all likely
// backed by Firebase once that's wired up.
export default function HomePage() {
  return (
    <>
      <NewsTicker />
      <Hero />
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
          <QuickNavCards />
          <DailyDedication />
        </div>
      </section>
    </>
  );
}
