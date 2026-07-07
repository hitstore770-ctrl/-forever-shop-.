import NewsTicker from "@/components/NewsTicker";
import Hero from "@/components/Hero";
import QuickNavCards from "@/components/QuickNavCards";
import DailyDedication from "@/components/DailyDedication";
import { DoodlePlus, DoodleZigzag, DoodleDots, DoodleFlyingDocument, DoodleMarkerScribble } from "@/components/doodles";

// Home page.
// Future additions: highlights pulled from the learning area, an
// upcoming-activities preview, and a donation progress widget — all likely
// backed by Firebase once that's wired up.
export default function HomePage() {
  return (
    <>
      <NewsTicker />
      <Hero />
      <section className="relative z-10 -mt-6 bg-cream py-16 sm:-mt-10 sm:py-24">
        {/* Decorative filler doodles — only shown once there's guaranteed gutter beyond the content column */}
        <DoodlePlus className="pointer-events-none absolute top-16 left-10 hidden h-6 w-6 text-navy-900/30 xl:block" />
        <DoodlePlus className="pointer-events-none absolute right-8 bottom-20 hidden h-8 w-8 text-copper-500/40 xl:block" />
        <DoodleZigzag className="pointer-events-none absolute top-32 right-12 hidden h-5 w-16 text-navy-900/25 xl:block" />
        <DoodleDots className="pointer-events-none absolute bottom-32 left-16 hidden h-6 w-14 text-copper-500/40 xl:block" />
        <DoodleFlyingDocument className="pointer-events-none absolute top-6 right-24 hidden h-16 w-20 -rotate-12 text-copper-600/40 xl:block" />
        <DoodleMarkerScribble className="pointer-events-none absolute bottom-6 left-24 hidden h-8 w-20 text-navy-900/15 xl:block" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 sm:mb-20">
            <DailyDedication />
          </div>
          <QuickNavCards />
        </div>
      </section>
    </>
  );
}
