"use client";

import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar, { type AdminTab } from "@/components/admin/AdminSidebar";
import StatsRow from "@/components/admin/StatsRow";
import DonationsTable from "@/components/admin/DonationsTable";
import LearningMaterialsTable from "@/components/admin/LearningMaterialsTable";
import ContactSubmissionsTable from "@/components/admin/ContactSubmissionsTable";
import { getDonations, getContactSubmissions, type DonationRecord, type ContactSubmission } from "@/lib/admin-data";
import { getKuntresim, type Kuntres } from "@/lib/learning-data";

const TAB_TITLES: Record<AdminTab, string> = {
  donations: "תרומות והקדשות",
  learning: "קונטרסים ושיעורים",
  contacts: "פניות ממתקרבים",
};

type DashboardData = {
  donations: DonationRecord[];
  kuntresim: Kuntres[];
  contacts: ContactSubmission[];
};

// Structural foundation for the admin panel — passcode gate + a sidebar
// dashboard. Every table's data comes from the same Firestore-backed
// functions the public site uses (falling back to mock data automatically
// when Firebase isn't configured — see lib/admin-data.ts and
// lib/learning-data.ts).
// TODO for a later phase: swap the passcode gate for real auth.
export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("donations");
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    Promise.all([getDonations(), getKuntresim(), getContactSubmissions()]).then(
      ([donations, kuntresim, contacts]) => {
        if (!cancelled) setData({ donations, kuntresim, contacts });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-[16rem_1fr]">
      <AdminSidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onLogout={() => {
          setIsAuthenticated(false);
          setData(null);
        }}
      />

      <div className="bg-cream-dark p-6 sm:p-10">
        <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
          {TAB_TITLES[activeTab]}
        </h1>

        {!data ? (
          <p className="font-semibold text-navy-700/70">טוען נתונים...</p>
        ) : (
          <>
            {activeTab === "donations" && (
              <div className="space-y-8">
                <StatsRow donations={data.donations} />
                <DonationsTable donations={data.donations} />
              </div>
            )}
            {activeTab === "learning" && <LearningMaterialsTable items={data.kuntresim} />}
            {activeTab === "contacts" && <ContactSubmissionsTable submissions={data.contacts} />}
          </>
        )}
      </div>
    </div>
  );
}
