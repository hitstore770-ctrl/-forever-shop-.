"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LockIcon } from "@/components/icons";

const inputClass =
  "w-full border-4 border-black bg-cream px-4 py-3 text-lg font-normal text-navy-950 shadow-brutal placeholder:font-normal placeholder:text-navy-900/40 focus:outline-none";

// Real admin sign-in: Firebase Auth on the client to get a fresh ID token,
// then hand that token to the server (/api/admin/session) to be verified
// and exchanged for an httpOnly session cookie. Successfully signing in to
// Firebase alone doesn't grant access — the server also checks the email
// against ADMIN_ALLOWED_EMAILS before issuing a session.
export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({ error: null }));
        throw new Error(message ?? "ההתחברות נכשלה.");
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("אימייל או סיסמה שגויים, או שאין הרשאת גישה לחשבון זה.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm border-4 border-black bg-navy-900 p-8 text-cream shadow-brutal-lg">
      <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
        <LockIcon className="h-7 w-7" />
      </span>

      <h1 className="mt-6 text-2xl font-semibold uppercase">כניסת מנהלים</h1>
      <p className="mt-2 text-sm font-normal text-cream/60">התחברו עם חשבון המנהל שלכם.</p>

      <label htmlFor="admin-email" className="mt-6 mb-1.5 block text-sm font-semibold uppercase">
        אימייל
      </label>
      <input
        id="admin-email"
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="admin@example.com"
        className={inputClass}
        dir="ltr"
      />

      <label htmlFor="admin-password" className="mt-4 mb-1.5 block text-sm font-semibold uppercase">
        סיסמה
      </label>
      <input
        id="admin-password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        className={inputClass}
      />

      {error && <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>}

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
