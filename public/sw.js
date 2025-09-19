// public/sw.js

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open("app-cache-v1").then((cache) => {
      return cache.addAll([
        "/", // root
        "/index.html",
        "/favicon.ico",
        "/apple-touch-icon.png",
        "/favicon-96x96.png",
        "/favicon.svg",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== "app-cache-v1") {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/index.html") // fallback to index for SPA
        )
      );
    })
  );
});
