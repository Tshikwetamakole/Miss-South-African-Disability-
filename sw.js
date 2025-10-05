// ========================================
// SERVICE WORKER FOR PERFORMANCE & OFFLINE
// Miss South Africa Disability PWA
// ========================================

const CACHE_NAME = 'miss-sa-disability-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/blog.html',
  '/contact.html',
  '/events.html',
  '/gallery.html',
  '/registration.html',
  '/style.css',
  '/script.js',
  '/translations.js',
  '/assets/logos/logo.svg',
  '/assets/logos/logo.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(handleStaticRequest(request));
  } else if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Handle static asset requests (CSS, JS, fonts)
function handleStaticRequest(request) {
  return caches.match(request)
    .then(response => {
      if (response) {
        return response;
      }
      
      return fetch(request)
        .then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE)
            .then(cache => {
              cache.put(request, responseClone);
            });
          return fetchResponse;
        });
    })
    .catch(() => {
      // Return offline fallback for critical CSS/JS
      if (request.url.includes('.css')) {
        return new Response('/* Offline - CSS temporarily unavailable */', {
          headers: { 'Content-Type': 'text/css' }
        });
      }
      if (request.url.includes('.js')) {
        return new Response('// Offline - JS temporarily unavailable', {
          headers: { 'Content-Type': 'application/javascript' }
        });
      }
    });
}

// Handle image requests with optimization
function handleImageRequest(request) {
  return caches.open(IMAGE_CACHE)
    .then(cache => {
      return cache.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then(fetchResponse => {
              // Only cache successful image responses
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                cache.put(request, responseClone);
              }
              return fetchResponse;
            });
        });
    })
    .catch(() => {
      // Return placeholder image for offline
      return caches.match('/assets/logos/logo.svg');
    });
}

// Handle page requests
function handlePageRequest(request) {
  return caches.match(request)
    .then(response => {
      if (response) {
        // Serve from cache and update in background
        fetch(request)
          .then(fetchResponse => {
            if (fetchResponse.status === 200) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, fetchResponse.clone());
                });
            }
          })
          .catch(() => {});
        
        return response;
      }
      
      return fetch(request)
        .then(fetchResponse => {
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseClone);
              });
          }
          return fetchResponse;
        });
    })
    .catch(() => {
      // Return offline page
      if (request.headers.get('accept').includes('text/html')) {
        return caches.match('/index.html');
      }
    });
}

// Handle API requests with caching strategy
function handleApiRequest(request) {
  return fetch(request)
    .then(response => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      // Serve from cache if network fails
      return caches.match(request);
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-form') {
    event.waitUntil(syncFormData());
  }
});

function syncFormData() {
  return new Promise((resolve, reject) => {
    // Get stored form data from IndexedDB
    // Submit when network is available
    // This would integrate with your form handling system
    console.log('Service Worker: Syncing form data...');
    resolve();
  });
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/logos/logo.svg',
    badge: '/assets/logos/logo.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/assets/logos/logo.svg'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Performance monitoring
self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'PERFORMANCE_MEASURE') {
    console.log('Performance measure:', event.data);
  } else if (event.data.type === 'SOCIAL_SHARE') {
    console.log('Social share event:', event.data.platform, event.data.url);
  } else if (event.data.type === 'RESOURCE_DOWNLOAD') {
    console.log('Resource downloaded:', event.data.url);
  } else if (event.data.type === 'CHAT_EVENT') {
    console.log('Chat event:', event.data.action, event.data.detail || '', new Date(event.data.ts).toISOString());
  }
});

console.log('Service Worker: Loaded successfully');