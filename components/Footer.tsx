import Link from "next/link";
import { NAV_LINKS, SITE_NAME, WHATSAPP_DISPLAY } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {/* TODO: short mission statement / tagline */}
            תוכן על אודות הישיבה יתווסף בהמשך.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">ניווט מהיר</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-600 hover:text-amber-600 dark:text-neutral-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">יצירת קשר</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>וואטסאפ: {WHATSAPP_DISPLAY}</li>
            {/* TODO: address, email, and social links once provided */}
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10 px-4 py-4 text-center text-xs text-neutral-500 dark:border-white/10 sm:px-6">
        © {year} {SITE_NAME}. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
