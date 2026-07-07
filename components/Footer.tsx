import Link from "next/link";
import { NAV_LINKS, SITE_NAME, WHATSAPP_DISPLAY } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-black bg-navy-900 text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="inline-block -rotate-1 border-2 border-black bg-copper-400 px-3 py-1 text-lg font-semibold text-navy-950 shadow-brutal">
            {SITE_NAME}
          </p>
          <p className="mt-4 text-sm text-cream/60">
            {/* TODO: short mission statement / tagline */}
            תוכן על אודות הישיבה יתווסף בהמשך.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-widest text-copper-400 uppercase">ניווט מהיר</p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-normal text-cream/80 hover:text-copper-400">
                  ➤ {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-widest text-copper-400 uppercase">יצירת קשר</p>
          <ul className="mt-4 space-y-2 text-sm font-normal text-cream/80">
            <li>וואטסאפ: {WHATSAPP_DISPLAY}</li>
            {/* TODO: address, email, and social links once provided */}
          </ul>
        </div>
      </div>

      <div className="border-t-4 border-copper-500 px-4 py-4 text-center text-xs font-normal text-cream/50 sm:px-6">
        © {year} {SITE_NAME}. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
