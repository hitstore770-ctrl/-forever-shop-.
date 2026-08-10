"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CameraIcon, ClockIcon, GridIcon, MessageIcon } from "@/components/icons";
import { BOTTOM_NAV_ITEMS, type BottomNavItem } from "@/lib/home-data";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/cn";

// Fixed bottom navigation, replacing the site header on this route.
//
// The primary action lives in the bar as a fifth, inverted cell rather than as
// a second docked strip above it. Two stacked bars eat a third of a phone
// screen, and the visitor cannot tell which one is the real call to action.
//
// Height is published as --kb-nav-h (globals.css) so the floating buttons and
// the hero's bottom padding all clear it off one number, and the bar carries
// the iOS home-indicator inset itself.

const ICONS: Record<BottomNavItem["icon"], typeof GridIcon> = {
  home: GridIcon,
  schedule: ClockIcon,
  gallery: CameraIcon,
  contact: MessageIcon,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="ניווט ראשי"
      className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-kb bg-kb"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="border-s-2 border-kb first:border-s-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => haptic(20)}
                className={cn(
                  "flex h-[var(--kb-nav-h)] flex-col items-center justify-center gap-1",
                  isActive ? "bg-kb-inv text-kb-inv" : "bg-kb text-kb",
                )}
              >
                <Icon strokeWidth={2.5} className="h-5 w-5" aria-hidden="true" />
                <span className="text-[0.6rem] font-extrabold tracking-tight">{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li className="border-s-2 border-kb">
          <motion.div
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 900, damping: 45 }}
            className="h-full"
          >
            <Link
              href="/join"
              onClick={() => haptic(50)}
              className="flex h-[var(--kb-nav-h)] flex-col items-center justify-center bg-kb-inv px-1 text-center text-kb-inv"
            >
              <span className="text-sm leading-none font-extrabold tracking-tight">אני בפנים</span>
              <span className="mt-1 text-[0.55rem] font-bold tracking-[0.15em] opacity-60">
                הרשמה
              </span>
            </Link>
          </motion.div>
        </li>
      </ul>
    </nav>
  );
}
