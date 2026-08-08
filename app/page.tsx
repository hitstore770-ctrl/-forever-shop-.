import LightHero from "@/components/home/LightHero";
import DoorSequence from "@/components/home/DoorSequence";
import VideoReveal from "@/components/home/VideoReveal";
import LuxNavCards from "@/components/home/LuxNavCards";
import StickyCta from "@/components/home/StickyCta";
import Reveal from "@/components/home/Reveal";

// Home page — light/"lux" art direction, deliberately different from the
// brutalist styling of the rest of the site.
//
// The .lux-page class is what dials the sitewide paper grain down to a sheen
// (see app/globals.css); GlobalDoodleField also opts this route out of the
// scrapbook doodles. Everything else on the site is untouched.
//
// Reading order is a single narrative: hero -> walk to the door -> the door
// opens -> the film plays -> the sections you can act on.
export default function HomePage() {
  return (
    <div className="lux-page bg-white">
      <LightHero />

      {/* Scroll-driven canvas sequence; ends washed out to pearl, which is
          exactly the colour VideoReveal opens on. */}
      <DoorSequence />

      <VideoReveal />

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
            <LuxNavCards />
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
      */}

      <StickyCta />
    </div>
  );
}
