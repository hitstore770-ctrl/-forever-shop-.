import SmoothScroll from "@/components/home/SmoothScroll";
import BrutalHero from "@/components/home/BrutalHero";
import KineticMarquee from "@/components/home/KineticMarquee";
import SharpGrid from "@/components/home/SharpGrid";
import StickyCta from "@/components/home/StickyCta";
import MaskReveal from "@/components/home/MaskReveal";

// Home page — "kinetic brutalism": pure white ground, pitch black type, no
// radius anywhere, and every rule at least 2px.
//
// The .flat-page class drops the sitewide paper grain to a whisper (see
// app/globals.css) so the white stays white; GlobalDoodleField also opts this
// route out of the scrapbook doodles. Nothing else on the site is touched, and
// this palette now agrees with the brutalist header and footer rather than
// fighting them.
//
// This file stays a server component. Only the pieces that genuinely need
// scroll position, a frame loop or touch state are "use client", so the page's
// own markup and copy ship as HTML with no hydration cost.
export default function HomePage() {
  return (
    <div className="flat-page bg-white">
      {/* Lenis. Renders nothing; smooths wheel scrolling for everything below
          and leaves touch scrolling native. */}
      <SmoothScroll />

      <BrutalHero />

      <KineticMarquee />

      <section className="border-b-[3px] border-black bg-white px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
            <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-black sm:text-6xl">
              <MaskReveal inView delay={0} duration={0.7}>
                מה מחכה לך כאן
              </MaskReveal>
            </h2>
            <p className="text-[0.65rem] font-bold tracking-[0.3em] text-black/40">
              06 / סקשנים
            </p>
          </div>

          <SharpGrid />
        </div>
      </section>

      {/*
        CONTENT SLOTS — the pieces to feed in next. In this system a section is
        a white tile on a black rule: border-[3px] border-black, no radius,
        heavy tracking-tight headings, and MaskReveal with inView for entrances.

        1. Daily dedication + zmanim. <DailyDedication> already exists and is
           already brutalist, so it should drop straight in — it just needs the
           cream/navy swapped for white/black.
        2. Alumni testimonials — full-bleed quotes, one per row, huge type.
        3. An upcoming-events strip reading lib/events-data.ts.
        4. A donation progress bar — a black fill on a white track, no radius.
        5. The /yavetz-walk.mp4 clip, once it exists. It has no home in this
           layout yet; a full-bleed band between the marquee and the grid is
           the obvious slot.
      */}

      <StickyCta />
    </div>
  );
}
