import type { Variants } from "framer-motion";

// Shared entrance/hover animation helpers, used across the site's card
// grids (Gallery, Events, Staff, History, Quick Nav, ...) so the "messy
// scrapbook" motion feels cohesive everywhere.
//
// Important: a persistent per-card rotation must live INSIDE the same
// variants object as the entrance animation (not as a Tailwind class or a
// raw `style.transform` string) — once a motion component animates any
// transform-related value (y, scale, ...), Framer Motion takes over the
// element's inline `transform` entirely, silently discarding any rotation
// applied via CSS. Baking the rotation into the "show" state avoids that.

// Fade + rise entrance, with an optional persistent rotation for the
// resting ("show") state.
export function fadeInUp(rotate = 0): Variants {
  return {
    hidden: { opacity: 0, y: 20, rotate: 0 },
    show: { opacity: 1, y: 0, rotate, transition: { duration: 0.4, ease: "easeOut" } },
  };
}

// Fade + scale-up entrance, with an optional persistent rotation.
export function fadeInScale(rotate = 0): Variants {
  return {
    hidden: { opacity: 0, scale: 0.92, rotate: 0 },
    show: { opacity: 1, scale: 1, rotate, transition: { duration: 0.4, ease: "easeOut" } },
  };
}

// Parent wrapper variants — orchestrates child motion components (each
// using one of the variants above) into a staggered entrance instead of
// each card triggering independently off its own scroll position.
export function staggerContainer(staggerChildren = 0.08): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren } },
  };
}

// Shared subtle "tilt" hover for interactive cards — layers on top of
// whatever persistent rotate the card already has (Framer only overrides
// the properties listed here, so the resting rotate is preserved).
export const hoverTilt = { scale: 1.035 };
