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
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* TODO: replace with the yeshiva's logo image (next/image) once assets are ready */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          {SITE_NAME}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  isActive ? "text-amber-600" : "text-neutral-700 dark:text-neutral-300"
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
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
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
        <nav className="border-t border-black/10 px-4 pb-4 md:hidden dark:border-white/10">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                        : "text-neutral-700 dark:text-neutral-300"
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
