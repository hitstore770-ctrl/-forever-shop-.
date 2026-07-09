import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "כניסת מנהלים",
};

// Real passcode login — no mock-mode bypass. A fake "it works" login would
// be worse than an honest "not configured yet" message.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
      {isAdminConfigured ? (
        <AdminLoginForm />
      ) : (
        <div className="w-full max-w-sm border-4 border-black bg-cream p-8 shadow-brutal-lg">
          <h1 className="text-xl font-semibold text-navy-950 uppercase">התחברות אינה מוגדרת</h1>
          <p className="mt-3 text-sm font-normal text-navy-700/80">
            יש להגדיר את משתנה הסביבה <code className="font-mono text-copper-700">ADMIN_ACCESS_CODE</code> (למשל
            בהגדרות הסביבה של Vercel) לפני שניתן להתחבר. ראו את .env.local.example לפירוט.
          </p>
        </div>
      )}
    </div>
  );
}
