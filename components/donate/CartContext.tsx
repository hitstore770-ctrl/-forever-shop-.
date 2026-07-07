"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DonationTier } from "@/lib/donate-data";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (tier: DonationTier) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

// UI-only cart for the donate storefront — no backend/payment wiring yet.
// TODO: once a payment provider is chosen, this is where the checkout call goes.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((tier: DonationTier) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === tier.id);
      if (existing) {
        return prev.map((item) =>
          item.id === tier.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { id: tier.id, title: tier.title, price: tier.price, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      clearCart,
      total,
    }),
    [items, isOpen, addItem, removeItem, clearCart, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
