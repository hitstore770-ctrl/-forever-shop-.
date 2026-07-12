import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/admin-auth";

// Every /admin dashboard page is live, per-request, auth-gated data — never
// statically prerenderable. Forcing dynamic rendering for the whole segment
// stops `next build` from trying to prerender these pages (which otherwise hit
// Firestore at build time and fail, e.g. the admin-only contactSubmissions
// read). Applies to all nested pages via this shared layout.
export const dynamic = "force-dynamic";

// The real security boundary for every /admin route except /admin/login
// (that page lives outside this route group, so it isn't wrapped by this
// layout — see app/admin/login/page.tsx). proxy.ts only does a cheap
// "cookie present?" check; this Server Component runs in the full Node.js
// runtime and verifies the session cookie against the current passcode on
// every request.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authed = verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <div className="bg-cream-dark p-6 sm:p-10">{children}</div>
    </div>
  );
}
