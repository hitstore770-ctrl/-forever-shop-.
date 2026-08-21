"use client";

import { useEffect } from "react";

// Kill-switch for the legacy offline service worker.
//
// Returning visitors still had an old service worker installed that served a
// cached HTML shell pointing at build-hashed /_next/static chunks from a
// previous deployment. Those chunks no longer exist, so React never booted and
// the site rendered as a blank white page — while the same URL was perfectly
// fine in a fresh browser. There is no offline caching layer any more: every
// visitor always gets the current deployment straight from the network.
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const purge = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
        if (typeof caches !== "undefined") {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        /* best-effort cleanup — never block rendering */
      }
    };

    void purge();
  }, []);

  return null;
}
