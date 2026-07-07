"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockIcon } from "@/components/icons";
import type { CartItem } from "@/components/donate/CartContext";

type PendingDonation = {
  transactionId: string;
  items: CartItem[];
  donorName: string;
  amount: number;
};

const STORAGE_KEY = "pendingDonation";

function readPendingDonation(transactionId: string | null): PendingDonation | null {
  // Guard for SSR (a hard refresh/direct link renders this on the server
  // first, where sessionStorage doesn't exist).
  if (typeof window === "undefined" || !transactionId) return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: PendingDonation = JSON.parse(raw);
    return parsed.transactionId === transactionId ? parsed : null;
  } catch {
    return null;
  }
}

// Simulates an external Israeli payment gateway's hosted terminal page.
// Reads the pending order (saved to sessionStorage by CartSidebar before it
// redirected here) and lets the "donor" approve or cancel. On approval it
// calls /api/checkout/confirm, which is the mock equivalent of the
// gateway's server-to-server webhook.
export default function MockGatewayScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tx");

  const [pending] = useState<PendingDonation | null>(() => readPendingDonation(transactionId));
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    if (!pending) return;
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: pending.items, donorName: pending.donorName }),
      });
      if (!response.ok) throw new Error("Confirm request failed");
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/donate?paid=success");
    } catch {
      setError("אירעה שגיאה באישור התשלום. נסו שוב.");
      setIsProcessing(false);
    }
  }

  function handleCancel() {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push("/donate?paid=cancelled");
  }

  if (!transactionId || !pending) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
        <div className="w-full max-w-sm border-4 border-black bg-cream p-8 text-center shadow-brutal-lg">
          <p className="text-lg font-semibold text-navy-950">לא נמצאה עסקה פעילה</p>
          <p className="mt-2 text-sm font-normal text-navy-700/70">
            ייתכן שהעסקה פגה או שהעמוד נפתח ישירות.
          </p>
          <Link
            href="/donate"
            className="mt-6 inline-block border-4 border-black bg-copper-500 px-6 py-3 text-sm font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
          >
            חזרה לתרומות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-dark px-4 py-16">
      <div className="w-full max-w-md border-4 border-black bg-navy-900 p-8 text-cream shadow-brutal-lg">
        <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-copper-500 text-navy-950 shadow-brutal">
          <LockIcon className="h-7 w-7" />
        </span>

        <p className="mt-6 text-xs font-semibold tracking-widest text-cream/50 uppercase">מסוף סליקה מדומה</p>
        <h1 className="mt-1 text-2xl font-semibold uppercase">אישור תשלום</h1>

        <div className="mt-6 space-y-2 border-y-2 border-cream/20 py-4 text-sm">
          {pending.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between font-normal text-cream/80">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>₪{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-lg font-semibold">
          <span>סה&quot;כ לתשלום</span>
          <span>₪{pending.amount}</span>
        </div>
        <p className="mt-1 text-xs font-normal text-cream/50">מספר עסקה: {pending.transactionId}</p>

        {error && <p className="mt-4 text-sm font-semibold text-red-400">{error}</p>}

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isProcessing}
            className="w-full border-4 border-black bg-copper-500 py-4 text-lg font-semibold text-navy-950 uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
          >
            {isProcessing ? "מעבד..." : "אשר תשלום"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full border-2 border-cream/40 py-3 text-sm font-semibold text-cream/70 uppercase transition-colors hover:text-cream"
          >
            ביטול עסקה
          </button>
        </div>
      </div>
    </div>
  );
}
