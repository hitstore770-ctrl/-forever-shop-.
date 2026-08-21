// Kill-switch worker. The previous version cached the HTML shell, so returning
// visitors were served a stale page referencing build-hashed chunks that no
// longer exist — a blank white screen. This worker intercepts nothing: it wipes
// every cache, unregisters itself, and reloads any page it still controls, so
// the live deployment is always what the visitor gets.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
