"use client";

import { useState, type FormEvent } from "react";
import { LockIcon } from "@/components/icons";

// UI-only login gate — no real backend auth yet.
// TODO: replace this demo passcode check with real auth (e.g. Firebase Auth)
// once the admin panel is connected to a database.
const DEMO_PASSCODE = "1234";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passcode === DEMO_PASSCODE) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border-4 border-black bg-navy-900 p-8 text-cream shadow-brutal-lg"
      >
        <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
          <LockIcon className="h-7 w-7" />
        </span>

        <h1 className="mt-6 text-2xl font-semibold uppercase">כניסת מנהלים</h1>
        <p className="mt-2 text-sm font-normal text-cream/60">הזינו קוד גישה כדי להיכנס ללוח הבקרה.</p>

        <label htmlFor="admin-passcode" className="mt-6 mb-1.5 block text-sm font-semibold uppercase">
          קוד גישה
        </label>
        <input
          id="admin-passcode"
          type="password"
          inputMode="numeric"
          value={passcode}
          onChange={(event) => {
            setPasscode(event.target.value);
            setError(false);
          }}
          placeholder="••••"
          className="w-full border-4 border-black bg-cream px-4 py-3 text-lg font-semibold tracking-widest text-navy-950 shadow-brutal focus:outline-none"
        />
        {error && <p className="mt-2 text-sm font-semibold text-red-400">קוד שגוי, נסו שוב.</p>}

        <button
          type="submit"
          className="mt-6 w-full border-4 border-black bg-copper-500 py-4 text-lg font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
        >
          כניסה
        </button>
      </form>
    </div>
  );
}
