// Central place for site-wide constants so components and pages
// (and, later, Firebase-driven content) all read from one source of truth.

export type NavLink = {
  href: string;
  label: string;
};

export const SITE_NAME = "ישיבת ...";

// Sticky header + footer navigation share this list.
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "בית" },
  { href: "/learning", label: "לימוד" },
  { href: "/join", label: "הצטרפות" },
  { href: "/donate", label: "תרומות" },
  { href: "/activities", label: "פעילויות" },
  { href: "/contact", label: "צור קשר" },
];

// WhatsApp contact number, international format (no "+") for wa.me links.
export const WHATSAPP_NUMBER = "972559345372";
export const WHATSAPP_DISPLAY = "055-934-5372";

export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
