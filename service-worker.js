const CACHE_NAME = "know-god-better-v13";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.json",
  "./introduction.json",
  "./randomMusings.json",
  "./scriptureText.json",
  "./icon-192.png",
  "./icon-512.png"
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




