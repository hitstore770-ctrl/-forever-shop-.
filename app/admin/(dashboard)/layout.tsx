import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { verifyAdminSession, SESSION_COOKIE_NAME } from "@/lib/firebase-admin";

// The real security boundary for every /admin route except /admin/login
// (that page lives outside this route group, so it isn't wrapped by this
// layout — see app/admin/login/page.tsx). Middleware only does a cheap
// "cookie present?" check on the Edge; this Server Component runs in the
// full Node.js runtime and does the actual cryptographic verification via
// firebase-admin, re-checking the email allow-list on every request.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-[16rem_1fr]">
      <AdminSidebar adminEmail={session.email ?? ""} />
      <div className="bg-cream-dark p-6 sm:p-10">{children}</div>
    </div>
  );
}
