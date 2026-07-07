"use client";

import { useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar, { type AdminTab } from "@/components/admin/AdminSidebar";
import StatsRow from "@/components/admin/StatsRow";
import DonationsTable from "@/components/admin/DonationsTable";
import LearningMaterialsTable from "@/components/admin/LearningMaterialsTable";
import ContactSubmissionsTable from "@/components/admin/ContactSubmissionsTable";

const TAB_TITLES: Record<AdminTab, string> = {
  donations: "תרומות והקדשות",
  learning: "קונטרסים ושיעורים",
  contacts: "פניות ממתקרבים",
};

// Structural foundation for the admin panel — passcode gate + a sidebar
// dashboard. TODO for later phases: swap the passcode gate for real auth,
// and back every table with Firebase + the payment gateway's reporting API.
export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("donations");

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-[16rem_1fr]">
      <AdminSidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div className="bg-cream-dark p-6 sm:p-10">
        <h1 className="mb-8 inline-block border-2 border-black bg-navy-900 px-4 py-2 text-2xl font-semibold text-cream uppercase shadow-brutal">
          {TAB_TITLES[activeTab]}
        </h1>

        {activeTab === "donations" && (
          <div className="space-y-8">
            <StatsRow />
            <DonationsTable />
          </div>
        )}
        {activeTab === "learning" && <LearningMaterialsTable />}
        {activeTab === "contacts" && <ContactSubmissionsTable />}
      </div>
    </div>
  );
}
