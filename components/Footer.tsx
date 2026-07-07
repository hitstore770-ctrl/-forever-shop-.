import Link from "next/link";
import { NAV_LINKS, SITE_NAME, WHATSAPP_DISPLAY } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-copper-500/20 bg-navy-900 text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-cream">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-cream/60">
            {/* TODO: short mission statement / tagline */}
            תוכן על אודות הישיבה יתווסף בהמשך.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream">ניווט מהיר</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream/60 hover:text-copper-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream">יצירת קשר</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/60">
            <li>וואטסאפ: {WHATSAPP_DISPLAY}</li>
            {/* TODO: address, email, and social links once provided */}
          </ul>
        </div>
      </div>

      <div className="border-t border-copper-500/20 px-4 py-4 text-center text-xs text-cream/50 sm:px-6">
        © {year} {SITE_NAME}. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
