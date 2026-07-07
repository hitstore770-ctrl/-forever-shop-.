import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isFirebaseConfigured } from "@/lib/firebase";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "כניסת מנהלים",
};

// Real admin login — no mock-mode bypass here, unlike the rest of the
// site's data-fetching. A fake "it works" login would be worse than an
// honest "not configured yet" message.
export default function AdminLoginPage() {
  const isReady = isFirebaseConfigured && isFirebaseAdminConfigured;

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
      {isReady ? (
        <AdminLoginForm />
      ) : (
        <div className="w-full max-w-sm border-4 border-black bg-cream p-8 shadow-brutal-lg">
          <h1 className="text-xl font-semibold text-navy-950 uppercase">התחברות אינה מוגדרת</h1>
          <p className="mt-3 text-sm font-normal text-navy-700/80">
            יש להגדיר את פרטי Firebase (כולל חשבון השירות בצד השרת) ואת רשימת המנהלים המורשים לפני
            שניתן להתחבר. ראו את .env.local.example לפירוט המשתנים הנדרשים.
          </p>
        </div>
      )}
    </div>
  );
}
