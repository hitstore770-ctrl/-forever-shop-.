import { DoodleStar, DoodleZigzag, DoodleDots, DoodleScribble, DoodlePlus, DoodleCircle } from "@/components/doodles";

// A sparse, very faint layer of doodles fixed to the viewport (not the
// page) so a little bit of the site's hand-drawn "scrapbook" texture is
// always present, on every page, without every single page having to
// place its own corner accents. Deliberately understated — this is
// background texture, not a decoration anyone should consciously notice.
// More doodles are shown at wider breakpoints so the effect grows with
// the extra screen real estate instead of ever cluttering mobile.
export default function GlobalDoodleField() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <DoodlePlus className="absolute top-[12%] left-[4%] hidden h-5 w-5 text-navy-900/10 lg:block" />
      <DoodleDots className="absolute top-[22%] right-[6%] hidden h-5 w-12 text-copper-500/10 lg:block" />
      <DoodleZigzag className="absolute bottom-[18%] left-[8%] hidden h-4 w-12 text-navy-900/10 lg:block" />
      <DoodleCircle className="absolute top-[45%] right-[3%] hidden h-10 w-16 text-copper-500/10 xl:block" />
      <DoodleStar className="absolute bottom-[10%] right-[10%] hidden h-6 w-6 text-navy-900/10 xl:block" />
      <DoodleScribble className="absolute top-[68%] left-[3%] hidden h-6 w-12 text-copper-500/10 xl:block" />
    </div>
  );
}
