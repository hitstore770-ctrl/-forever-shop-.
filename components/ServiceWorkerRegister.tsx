"use client";

import { useEffect } from "react";

// Registers the offline service worker (public/sw.js) once the page has
// loaded. Production only — a service worker in dev would cache stale bundles
// and get in the way. Fails silently on unsupported browsers.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline support is best-effort; ignore registration failures */
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    // Safety net: if a stale shell ever asks for a JS chunk that no longer
    // exists, the page renders blank. Detect the failed chunk load, drop all
    // caches + the service worker, and reload once (guarded so it can never loop).
    const onResourceError = (event: Event) => {
      const target = event.target as HTMLScriptElement | null;
      if (!target || target.tagName !== "SCRIPT") return;
      if (!target.src || !target.src.includes("/_next/static/")) return;
      if (sessionStorage.getItem("sw-chunk-recovered")) return;
      sessionStorage.setItem("sw-chunk-recovered", "1");

      const purge = async () => {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((reg) => reg.unregister()));
        } finally {
          window.location.reload();
        }
      };
      void purge();
    };

    window.addEventListener("error", onResourceError, true);
    return () => window.removeEventListener("error", onResourceError, true);
  }, []);

  return null;
}
