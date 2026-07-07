"use client";

import { HeartHandIcon, BookIcon, MessageIcon, LogOutIcon } from "@/components/icons";

export type AdminTab = "donations" | "learning" | "contacts";

const TABS: { id: AdminTab; label: string; icon: typeof HeartHandIcon }[] = [
  { id: "donations", label: "תרומות והקדשות", icon: HeartHandIcon },
  { id: "learning", label: "קונטרסים ושיעורים", icon: BookIcon },
  { id: "contacts", label: "פניות ממתקרבים", icon: MessageIcon },
];

export default function AdminSidebar({
  activeTab,
  onChangeTab,
  onLogout,
}: {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  onLogout: () => void;
}) {
  return (
    <nav className="flex h-full flex-col justify-between border-l-4 border-black bg-navy-900 p-4 text-cream">
      <div className="space-y-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex w-full items-center gap-3 border-2 border-black px-4 py-3 text-sm font-semibold uppercase transition-all ${
                isActive
                  ? "translate-x-1 translate-y-1 bg-copper-500 text-navy-950 shadow-brutal-none"
                  : "bg-navy-900 text-cream shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-right">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* lg:mb-20 only: at lg+ this sidebar becomes a persistent full-height
          right-hand column, which would otherwise put this button right
          behind the global floating WhatsApp button in the same corner. */}
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 border-2 border-black bg-cream px-4 py-3 text-sm font-semibold text-navy-900 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none lg:mb-20"
      >
        <LogOutIcon className="h-5 w-5 shrink-0" />
        יציאה
      </button>
    </nav>
  );
}
