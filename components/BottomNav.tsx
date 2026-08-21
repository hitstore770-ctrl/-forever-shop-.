"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/site-config";
import { HomeIcon, YeshivaIcon, JoinIcon, GalleryIcon, ChatIcon } from "@/components/nav-icons";

// Real fixed bottom navigation, shown on every page (mounted in app/layout).
// Replaces the decorative dock that used to sit on the homepage and had no
// links at all. Five destinations max, labels under the icons, a strong active
// state, and safe-area padding so it clears the iPhone home bar.
const ITEMS = [
  { href: "/", label: "בית", Icon: HomeIcon },
  { href: "/yeshiva", label: "הישיבה", Icon: YeshivaIcon },
  { href: "/join", label: "הצטרפות", Icon: JoinIcon, primary: true },
  { href: "/gallery", label: "גלריה", Icon: GalleryIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      dir="rtl"
      aria-label="ניווט תחתון"
      className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-black bg-cream"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {ITEMS.map(({ href, label, Icon, primary }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors ${
                  isActive ? "font-bold text-cream" : "font-semibold text-navy-900"
                }`}
              >
                {isActive && (
                  <span aria-hidden="true" className="absolute inset-x-1 inset-y-1 -z-10 bg-navy-900" />
                )}
                {!isActive && primary && (
                  <span aria-hidden="true" className="absolute inset-x-1 inset-y-1 -z-10 bg-copper-400" />
                )}
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <a
            href={buildWhatsAppLink("שלום, אשמח לשמוע עוד על הישיבה")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold text-navy-900"
          >
            <ChatIcon className="h-6 w-6" />
            <span>ייעוץ</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
