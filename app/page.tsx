import BottomNav from "@/components/home/BottomNav";
import DailyTimeline from "@/components/home/DailyTimeline";
import DonateBanner from "@/components/home/DonateBanner";
import FaqAccordion from "@/components/home/FaqAccordion";
import FloatingActions from "@/components/home/FloatingActions";
import InteractiveHero from "@/components/home/InteractiveHero";
import JoinForm from "@/components/home/JoinForm";
import KbFooter from "@/components/home/KbFooter";
import KineticMarquee from "@/components/home/KineticMarquee";
import LoadingScreen from "@/components/home/LoadingScreen";
import MaskReveal from "@/components/home/MaskReveal";
import RotatingQuotes from "@/components/home/RotatingQuotes";
import ScrollProgress from "@/components/home/ScrollProgress";
import SharpGrid from "@/components/home/SharpGrid";
import SmoothScroll from "@/components/home/SmoothScroll";
import StatsRow from "@/components/home/StatsRow";
import TeamList from "@/components/home/TeamList";
import ThemeToggle from "@/components/home/ThemeToggle";
import VisionSection from "@/components/home/VisionSection";
import { getSchedule } from "@/lib/schedule-data";
import { getJerusalemZmanim } from "@/lib/zmanim";

// Home page — "kinetic brutalism", mature premium palette: pearl ground,
// midnight navy ink, one muted bronze for emphasis. No radius anywhere, every
// rule at least 2px.
//
// The .kb-page class does three things (see app/globals.css): it drops the
// sitewide paper grain to a whisper, it scopes the two-colour token set that
// the dark toggle inverts, and it carries `touch-action: pan-y` so a page this
// interaction-dense does not fire double-tap-to-zoom by accident.
//
// This stays a server component. The zmanim calculation and the schedule read
// both happen here, so the sunset time and the day's סדר are in the HTML on
// first paint; only the pieces that genuinely need scroll position, a frame
// loop, a timer or touch state are "use client".
//
// Donations are deliberately absent from every section except DonateBanner,
// which is a link out to an external platform and nothing else.
export default async function HomePage() {
  const [schedule, zmanim] = await Promise.all([getSchedule(), getJerusalemZmanim()]);
  const sunset = zmanim.items.find((item) => item.key === "Sunset")?.time ?? "—";

  return (
    <div className="kb-page bg-kb">
      {/* Chrome. LoadingScreen also covers the one frame before the stored
          dark-mode preference is applied. */}
      <LoadingScreen />
      <ScrollProgress />
      <ThemeToggle />
      <SmoothScroll />

      {/* Pinned, scroll-scrubbed opening sequence. Carries everything the
          static hero did — eyebrow, zmanim plate, CTA, time-aware line — so
          nothing was lost in the swap. */}
      <InteractiveHero sunset={sunset} />

      <KineticMarquee />

      <VisionSection />

      <section className="border-b-[3px] border-kb bg-kb px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <StatsRow />
        </div>
      </section>

      <section className="border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHead eyebrow="המסלולים" title="ארבע דרכים להיכנס." index="04" />
          <div className="mt-10 sm:mt-16">
            <SharpGrid />
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHead eyebrow="סדר היום" title="ככה נראה יום." />
          <div className="mt-12 sm:mt-16">
            <DailyTimeline items={schedule} />
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHead eyebrow="הצוות" title="מי מלווה אותך." />
          <div className="mt-10 sm:mt-16">
            <TeamList />
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-kb bg-kb px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <RotatingQuotes />
        </div>
      </section>

      <section className="border-b-[3px] border-kb bg-kb px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHead eyebrow="קמפוס וחיים" title="מה מחכה לך כאן." />
          <div className="mt-10 sm:mt-16">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <DonateBanner />

      <JoinForm />

      <KbFooter />

      <FloatingActions />
      <BottomNav />
    </div>
  );
}

// Shared section opener: bronze eyebrow, masked heading, optional index.
function SectionHead({
  eyebrow,
  title,
  index,
}: {
  eyebrow: string;
  title: string;
  index?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent sm:text-[0.65rem]">
          {eyebrow}
        </p>
        <h2 className="mt-5 text-[2.2rem] leading-[0.98] font-extrabold tracking-[-0.045em] text-kb sm:text-6xl">
          <MaskReveal inView duration={0.7}>
            {title}
          </MaskReveal>
        </h2>
      </div>
      {index ? (
        <p className="text-[0.6rem] font-bold tracking-[0.3em] text-kb-faint tabular-nums">
          {index}
        </p>
      ) : null}
    </div>
  );
}
