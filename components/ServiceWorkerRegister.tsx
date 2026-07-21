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
  }, []);

  return null;
}
