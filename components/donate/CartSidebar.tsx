"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/donate/CartContext";
import { XIcon, TrashIcon } from "@/components/icons";

const PENDING_DONATION_KEY = "pendingDonation";

// Slide-out cart drawer. "שלם עכשיו" creates a checkout session via
// /api/checkout, stashes the pending order in sessionStorage (so it survives
// the redirect), and sends the donor to the mock payment terminal. That
// terminal calls /api/checkout/confirm on approval, which is where the
// Firestore write + WhatsApp notification actually happen.
export default function CartSidebar() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, total } = useCart();
  const [dedicationName, setDedicationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, donorName: dedicationName }),
      });
      if (!response.ok) throw new Error("Checkout request failed");
      const { transactionId, amount, paymentUrl } = await response.json();

      sessionStorage.setItem(
        PENDING_DONATION_KEY,
        JSON.stringify({ transactionId, items, donorName: dedicationName, amount }),
      );
      router.push(paymentUrl);
    } catch {
      setError("אירעה שגיאה בפתיחת התשלום. נסו שוב.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] flex w-full max-w-md flex-col border-l-4 border-black bg-cream shadow-brutal-lg transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-4 border-black bg-navy-900 px-5 py-4 text-cream">
          <h2 className="text-xl font-semibold uppercase">העגלה שלך</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="סגירת העגלה"
            className="flex h-9 w-9 items-center justify-center border-2 border-black bg-cream text-navy-950 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-none"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-center font-normal text-navy-700/70">העגלה ריקה. הוסיפו הקדשה כדי להתחיל.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 border-2 border-black bg-white px-4 py-3 shadow-brutal"
                >
                  <div>
                    <p className="font-semibold text-navy-950">{item.title}</p>
                    <p className="mt-1 text-sm font-normal text-navy-700/70">
                      {item.quantity} × ₪{item.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`הסרת ${item.title}`}
                    className="text-navy-900/50 transition-colors hover:text-copper-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <label htmlFor="dedication-name" className="mb-1.5 block text-sm font-semibold text-navy-950 uppercase">
              שם להקדשה
            </label>
            <input
              id="dedication-name"
              type="text"
              value={dedicationName}
              onChange={(event) => setDedicationName(event.target.value)}
              placeholder="לדוגמה: לעילוי נשמת... / לזכות..."
              className="w-full border-4 border-black bg-white px-4 py-3 font-normal text-navy-950 shadow-brutal placeholder:font-normal placeholder:text-navy-900/40 focus:outline-none"
            />
          </div>

          {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
        </div>

        <div className="border-t-4 border-black bg-cream-dark p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-semibold text-navy-950">
            <span>סה&quot;כ</span>
            <span>₪{total}</span>
          </div>
          <button
            type="button"
            onClick={handlePay}
            disabled={items.length === 0 || isSubmitting}
            className="w-full border-4 border-black bg-copper-500 py-5 text-xl font-semibold text-navy-950 uppercase shadow-brutal-lg transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-brutal-none disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-lg"
          >
            {isSubmitting ? "מעביר לתשלום..." : "שלם עכשיו"}
          </button>
        </div>
      </div>
    </>
  );
}
