import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import GoogleSignInButton from "@/components/admin/GoogleSignInButton";
import { isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "כניסת מנהלים",
};

// Render at request time, never statically at build. Otherwise Next.js
// prerenders this page during `next build` and bakes in whatever
// SITE_PASSCODE was (or wasn't) present then — which made the live page
// show "not configured" forever even though the runtime env var was set.
export const dynamic = "force-dynamic";

// Admin sign-in — Google (allow-listed email) as the primary method, with the
// shared passcode kept as an emergency backup so a Google/OAuth hiccup can't
// lock the admin out.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
      {isAdminConfigured() ? (
        <div className="flex w-full max-w-sm flex-col gap-5">
          <GoogleSignInButton />
          <div className="flex items-center gap-3 text-navy-900/50">
            <span className="h-px flex-1 bg-navy-900/20" />
            <span className="text-xs font-semibold uppercase">או עם קוד גישה</span>
            <span className="h-px flex-1 bg-navy-900/20" />
          </div>
          <AdminLoginForm />
        </div>
      ) : (
        <div className="w-full max-w-sm border-4 border-black bg-cream p-8 shadow-brutal-lg">
          <h1 className="text-xl font-semibold text-navy-950 uppercase">התחברות אינה מוגדרת</h1>
          <p className="mt-3 text-sm font-normal text-navy-700/80">
            יש להגדיר את משתנה הסביבה <code className="font-mono text-copper-700">SITE_PASSCODE</code> (למשל
            בהגדרות הסביבה של Vercel) לפני שניתן להתחבר. ראו את .env.local.example לפירוט.
          </p>
        </div>
      )}
    </div>
  );
}
