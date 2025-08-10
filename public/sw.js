// Basic service worker file to avoid 404 errors

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // Just pass through all requests
  event.respondWith(fetch(event.request));
});
