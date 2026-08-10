import BrutalButton from "@/components/home/BrutalButton";
import { EXTERNAL_DONATION_URL } from "@/lib/site-config";

// Donations, and nothing else on this page, live here.
//
// This is a link out and only a link out. There is no amount picker, no
// currency, no cart, no checkout state, no payment provider SDK — the landing
// page holds none of that by design, so nothing here can ever end up handling
// money or personal payment data. The destination is a single constant in
// lib/site-config.ts; changing platforms is a one-line edit.
//
// target=_blank keeps the visitor's place on the page, and rel="noopener
// noreferrer" is what stops the opened tab from reaching back through
// window.opener — mandatory on any external link opened this way.

export default function DonateBanner() {
  return (
    <section className="border-b-[3px] border-kb bg-kb-inv px-5 py-16 text-kb-inv sm:px-8 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-9 sm:flex-row sm:items-end sm:justify-between sm:gap-14">
        <div className="max-w-2xl">
          <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent sm:text-[0.65rem]">
            תמיכה
          </p>
          <h2 className="mt-6 text-[2.2rem] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-6xl">
            כל בחור כאן נתמך על ידי מישהו.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-snug font-medium opacity-70 sm:text-lg">
            התרומות מנוהלות במערכת חיצונית ומאובטחת. אנחנו לא אוספים כאן שום פרט תשלום.
          </p>
        </div>

        <BrutalButton
          externalHref={EXTERNAL_DONATION_URL}
          variant="outline"
          className="shrink-0"
        >
          [ לתרומה מאובטחת ↗ ]
        </BrutalButton>
      </div>
    </section>
  );
}
