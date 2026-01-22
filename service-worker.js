const CACHE_NAME = "know-god-better-v14";

const FILES_TO_CACHE = [
  "/know-god-better/",
  "/know-god-better/index.html",
  "/know-god-better/styles.css",
  "/know-god-better/app.js",
  "/know-god-better/data.json",
  "/know-god-better/introduction.json",
  "/know-god-better/randomMusings.json",
  "/know-god-better/scriptureText.json",
  "/know-god-better/icon-192.png",
  "/know-god-better/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});


self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;

  // Always try network first for HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});




