"use client";

import { useState } from "react";
import { XIcon } from "@/components/icons";

// Shown after a round-trip through the mock payment terminal
// (app/checkout/mock-gateway), based on the ?paid= query param it redirects
// back with.
export default function CheckoutStatusBanner({ status }: { status: "success" | "cancelled" }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const isSuccess = status === "success";

  return (
    <div
      className={`relative mb-10 flex items-center justify-between gap-4 border-4 border-black p-5 shadow-brutal ${
        isSuccess ? "bg-copper-400 text-navy-950" : "bg-cream-dark text-navy-900"
      }`}
    >
      <p className="font-semibold">
        {isSuccess ? "תודה רבה! התרומה נקלטה בהצלחה 🙌" : "העסקה בוטלה. אפשר לנסות שוב בכל עת."}
      </p>
      <button type="button" onClick={() => setDismissed(true)} aria-label="סגירה" className="shrink-0">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
