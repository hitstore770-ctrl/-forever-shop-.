"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandIcon,
  BookIcon,
  MessageIcon,
  LogOutIcon,
  GridIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
} from "@/components/icons";

const NAV_ITEMS = [
  { href: "/admin", label: "תרומות והקדשות", icon: HeartHandIcon },
  { href: "/admin/gallery", label: "גלריה", icon: GridIcon },
  { href: "/admin/events", label: "אירועים", icon: CalendarIcon },
  { href: "/admin/staff", label: "צוות", icon: UsersIcon },
  { href: "/admin/schedule", label: "סדר היום", icon: ClockIcon },
  { href: "/admin/learning", label: "קונטרסים ושיעורים", icon: BookIcon },
  { href: "/admin/contacts", label: "פניות ממתקרבים", icon: MessageIcon },
];

// Route-based nav (each tab is a real URL, not client-only state) so the
// browser back button and page refresh both behave normally.
export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col justify-between border-l-4 border-black bg-navy-900 p-4 text-cream">
      <div>
        <p className="mb-4 border-b-2 border-cream/20 pb-3 text-xs font-semibold tracking-widest text-copper-300 uppercase">
          לוח ניהול
        </p>
        <div className="space-y-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 border-2 border-black px-4 py-3 text-sm font-semibold uppercase transition-all ${
                  isActive
                    ? "translate-x-1 translate-y-1 bg-copper-500 text-navy-950 shadow-brutal-none"
                    : "bg-navy-900 text-cream shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-right">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* lg:mb-20 only: at lg+ this sidebar becomes a persistent full-height
          right-hand column, which would otherwise put this button right
          behind the global floating WhatsApp button in the same corner. */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 border-2 border-black bg-cream px-4 py-3 text-sm font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none lg:mb-20"
      >
        <LogOutIcon className="h-5 w-5 shrink-0" />
        יציאה
      </button>
    </nav>
  );
}
