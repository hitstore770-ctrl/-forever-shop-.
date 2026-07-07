"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site-config";

// Sticky site header with desktop nav + a collapsible mobile menu.
// "use client" is required for the open/close state and active-link highlighting.
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-black bg-cream">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* TODO: replace with the yeshiva's logo image (next/image) once assets are ready */}
        <Link
          href="/"
          className="-rotate-1 border-2 border-black bg-copper-400 px-3 py-1 text-lg font-black tracking-tight text-navy-950 shadow-brutal"
        >
          {SITE_NAME}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-black uppercase transition-all ${
                  isActive
                    ? "-rotate-1 border-2 border-black bg-navy-900 text-cream shadow-brutal"
                    : "text-navy-900 hover:-rotate-1 hover:border-2 hover:border-black hover:bg-cream-dark hover:shadow-brutal"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="פתיחת/סגירת תפריט"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center border-2 border-black bg-cream text-navy-950 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile navigation panel */}
      {isMenuOpen && (
        <nav className="border-t-4 border-black bg-cream px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-2 pt-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block border-2 border-black px-3 py-2 text-sm font-black uppercase ${
                      isActive ? "bg-navy-900 text-cream shadow-brutal" : "bg-cream text-navy-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
