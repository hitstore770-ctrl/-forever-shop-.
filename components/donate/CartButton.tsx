"use client";

import { useCart } from "@/components/donate/CartContext";
import { CartIcon } from "@/components/icons";

// Floating trigger for the cart drawer. Placed bottom-left (same side the
// drawer slides in from) and nudged up off the very corner so it never
// collides with the global floating WhatsApp button (bottom-right) or any
// browser/OS chrome that tends to claim the extreme bottom corners.
export default function CartButton() {
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="פתיחת עגלת הקניות"
      className="fixed bottom-24 left-5 z-50 flex h-14 w-14 items-center justify-center border-4 border-black bg-navy-900 text-cream shadow-brutal transition-transform hover:scale-105 active:scale-95"
    >
      <CartIcon className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-copper-500 text-xs font-semibold text-navy-950">
          {count}
        </span>
      )}
    </button>
  );
}
