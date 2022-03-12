console.warn('hello form sw')
var cacheName = "manga-sekai-99v1";
var contentToCache  = [
    "/",
    "",
    "/manga/*",
    "/mylist",
    "/profile",
    "/manga/*/*",
    "/lastwatched",
    "/search",
    "/settings"
];



self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content', cacheName);
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });