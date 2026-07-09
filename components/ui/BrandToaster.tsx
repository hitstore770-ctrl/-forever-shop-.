"use client";

import { Toaster } from "sonner";

// Site-wide toast host, themed to the brutalist brand look (cream card,
// thick black border, hard offset shadow) with brand-color type accents —
// Crown Gold for success, Chabad Blue for errors (see the .brand-toast
// rules in globals.css). RTL + top-center to match the Hebrew layout.
export default function BrandToaster() {
  return (
    <Toaster
      position="top-center"
      dir="rtl"
      offset={20}
      toastOptions={{
        classNames: {
          toast: "brand-toast",
          title: "brand-toast-title",
          description: "brand-toast-desc",
        },
      }}
    />
  );
}
