import Link from "next/link";
import { SITE_NAME, WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/site-config";

// Closing bar for the landing page, standing in for the sitewide cream footer
// that is hidden on this route.
//
// Deliberately thin: the bottom navigation already carries wayfinding, so this
// only has to say who we are and how to reach us. Note what is *not* here —
// no donation link. The one donation route on this page is the external link
// in DonateBanner, and adding a second one in the footer would quietly put an
// internal /donate route back on the page.
//
// The bottom padding clears the fixed navigation bar so the last line of the
// page is not sitting underneath it.

export default function KbFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-kb-inv px-5 pt-14 text-kb-inv sm:px-8 sm:pt-20"
      style={{ paddingBottom: "calc(var(--kb-nav-h) + env(safe-area-inset-bottom) + 2.5rem)" }}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-3xl leading-[0.98] font-extrabold tracking-[-0.04em] sm:text-5xl">
          {SITE_NAME}
        </p>
        <p className="mt-4 max-w-md text-sm font-medium opacity-60 sm:text-base">
          ישיבת תומכי תמימים ליובאוויטש, עיה״ק ירושלים ת״ו.
        </p>

        <div className="mt-12 grid gap-8 border-t-2 border-current pt-8 sm:grid-cols-3">
          <div>
            <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent">וואטסאפ</p>
            <a
              href={buildWhatsAppLink("שלום, אשמח לקבל מידע נוסף")}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="mt-2 block text-start text-lg font-extrabold tracking-tight sm:text-xl"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>

          <div>
            <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent">עוד</p>
            <ul className="mt-2 space-y-1 text-sm font-bold">
              <li>
                <Link href="/yeshiva">על הישיבה</Link>
              </li>
              <li>
                <Link href="/learning">חומרי לימוד</Link>
              </li>
              <li>
                <Link href="/contact">צור קשר</Link>
              </li>
            </ul>
          </div>

          <div className="sm:text-end">
            <p className="text-[0.55rem] font-bold tracking-[0.3em] text-kb-accent">שנה</p>
            <p className="mt-2 text-lg font-extrabold tracking-tight tabular-nums sm:text-xl">
              © {year}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
