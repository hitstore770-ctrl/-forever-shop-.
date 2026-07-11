"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

// Admin Google sign-in. Opens the Google popup, then hands the resulting ID
// token to /api/admin/session/google, which verifies it and — only for the
// allow-listed email — sets the session cookie. The email restriction is
// enforced on the server; this button just starts the flow.
export default function GoogleSignInButton() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleGoogleSignIn() {
    if (!auth) {
      toast.error("כניסת גוגל אינה מוגדרת", { description: "חסרה תצורת Firebase באתר." });
      return;
    }

    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Nudge Google toward the owner's account on the chooser.
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/admin/session/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Sign back out of Firebase so a rejected account isn't left signed in.
        await auth.signOut().catch(() => {});
        toast.error("הכניסה נדחתה", { description: data.error ?? "חשבון זה אינו מורשה." });
        setIsSigningIn(false);
        return;
      }

      toast.success("התחברת בהצלחה", { description: "מיד תועברו ללוח הניהול." });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      // A user-closed popup isn't an error worth shouting about.
      const code = (error as { code?: string })?.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        toast.error("שגיאת התחברות", { description: "לא הצלחנו להתחבר דרך גוגל. נסו שוב." });
      }
      setIsSigningIn(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isSigningIn}
      className="flex w-full items-center justify-center gap-3 border-4 border-black bg-cream px-4 py-3.5 text-base font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
    >
      <GoogleGlyph className="h-5 w-5" />
      {isSigningIn ? "מתחבר..." : "כניסה עם גוגל"}
    </button>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.46h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.75Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.12A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.29a12 12 0 0 0 0 10.78l3.98-3.12Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.96 11.96 0 0 0 12 0 12 12 0 0 0 1.29 6.61l3.98 3.12C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
