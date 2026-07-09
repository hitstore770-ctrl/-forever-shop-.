"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LockIcon } from "@/components/icons";

// Passcode sign-in. The code is posted to /api/admin/session, which compares
// it server-side against SITE_PASSCODE and, on a match, sets the httpOnly
// session cookie. The code is never checked in the browser.
export default function AdminLoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        toast.error("קוד גישה שגוי", { description: "בדקו את הקוד ונסו שוב." });
        setIsSubmitting(false);
        return;
      }

      toast.success("התחברת בהצלחה", { description: "מיד תועברו ללוח הניהול." });
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("שגיאת התחברות", { description: "משהו השתבש. נסו שוב בעוד רגע." });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm border-4 border-black bg-navy-900 p-8 text-cream shadow-brutal-lg">
      <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
        <LockIcon className="h-7 w-7" />
      </span>

      <h1 className="mt-6 text-2xl font-semibold uppercase">כניסת מנהלים</h1>
      <p className="mt-2 text-sm font-normal text-cream/60">הזינו את קוד הגישה כדי להיכנס ללוח הבקרה.</p>

      <label htmlFor="admin-code" className="mt-6 mb-1.5 block text-sm font-semibold uppercase">
        קוד גישה
      </label>
      <input
        id="admin-code"
        type="password"
        required
        autoComplete="current-password"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="••••••••"
        className="w-full border-4 border-black bg-cream px-4 py-3 text-lg font-semibold tracking-widest text-navy-950 shadow-brutal focus:outline-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full border-4 border-black bg-copper-500 py-4 text-lg font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
      >
        {isSubmitting ? "מתחבר..." : "כניסה"}
      </button>
    </form>
  );
}
