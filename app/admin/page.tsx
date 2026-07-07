import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "ניהול",
};

// Admin dashboard — passcode-gated (UI only for now) panel for managing
// donations/dedications, learning materials, and contact-form submissions.
export default function AdminPage() {
  return <AdminApp />;
}
