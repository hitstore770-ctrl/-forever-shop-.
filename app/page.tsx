import PremiumHero from "@/components/home/PremiumHero";
import AlleyReveal from "@/components/home/AlleyReveal";
import BentoGrid from "@/components/home/BentoGrid";
import StickyCta from "@/components/home/StickyCta";
import Reveal from "@/components/home/Reveal";

// Home page — light/"lux" art direction, deliberately different from the
// brutalist styling of the rest of the site.
//
// The .lux-page class is what dials the sitewide paper grain down to a sheen
// (see app/globals.css); GlobalDoodleField also opts this route out of the
// scrapbook doodles. Everything else on the site is untouched.
//
// This file stays a server component on purpose. Only the three sections that
// actually need scroll position, timers or touch state are "use client", so
// the page's own markup and copy ship as HTML with no hydration cost — making
// the whole page a client component to save a few imports would send every
// string below through the JS bundle instead.
//
// Reading order is one narrative: the statement -> the walk into the alley ->
// the things you can act on.
export default function HomePage() {
  return (
    <div className="lux-page bg-white">
      {/* 100svh statement, fade-in-up on load, self-rewriting subtitle. */}
      <PremiumHero />

      {/* Scroll grows the card from inset to near full-bleed. */}
      <AlleyReveal />

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.3em] text-copper-600 uppercase">
              הישיבה
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
              מה מחכה לך כאן
            </h2>
          </Reveal>

          <div className="mt-10 sm:mt-14">
            <BentoGrid />
          </div>
        </div>
      </section>

      {/*
        CONTENT SLOTS — the pieces to feed in next, in the light card style
        (bg-white / rounded-2xl / shadow-lux / shadow-lux-inset), each wrapped
        in <Reveal> so it fades up on scroll:

        1. Daily dedication + zmanim. <DailyDedication> already exists but is
           styled brutalist (border-4 / shadow-brutal); it needs a light
           variant before it can sit on this page.
        2. Testimonials from alumni — a 2-3 card row.
        3. An upcoming-events strip, reading the events data already in
           lib/events-data.ts.
        4. A donation progress widget.
        5. <VideoReveal /> — the tap-to-play סרטון התדמית. Built and working,
           but off the page for now: it and the alley clip in the same scroll
           read as two videos competing. Drop it back in once HOME_VIDEO.src
           in lib/home-data.ts points at a real file.
      */}

      <StickyCta />
    </div>
  );
}
