"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Renders its children everywhere except the listed routes.
//
// Exists so shared layout furniture can be dropped on a single page without
// that furniture having to become a client component itself: the children are
// still rendered on the server and passed through, and only this thin gate
// ships to the browser.
//
// Hiding with CSS was the first attempt and is not equivalent — a
// display:none element is still in the HTML, still in the document, and still
// crawlable. On the landing page that left an internal /donate link in the
// markup of a page that is deliberately decoupled from any on-site donation
// flow. Returning null keeps it out of the DOM entirely.

export type RouteGateProps = {
  /** Exact pathnames on which the children are not rendered. */
  hideOn: string[];
  children: ReactNode;
};

export default function RouteGate({ hideOn, children }: RouteGateProps) {
  const pathname = usePathname();
  if (hideOn.includes(pathname)) return null;
  return <>{children}</>;
}
