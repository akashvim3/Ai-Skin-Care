// =====================
// Service Worker for Offline Support
// =====================

const CACHE_NAME = 'dermAI-v1.0.0';
const RUNTIME_CACHE = 'dermAI-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/detect.html',
    '/about.html',
    '/diseases.html',
    '/contact.html',
    '/history.html',
    '/compare.html',
    '/css/style.css',
    '/css/history.css',
    '/css/compare.css',
    '/js/main.js',
    '/js/detection.js',
    '/js/detection-advanced.js',
    '/js/model.js',
    '/js/history.js',
    '/js/compare.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then((cache) => {
                return fetch(event.request).then((response) => {
                    // Cache successful GET requests
                    if (event.request.method === 'GET' && response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                }).catch(() => {
                    // Return offline page if available
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            });
        })
    );
});

// Background sync for offline detections
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-detections') {
        event.waitUntil(syncDetections());
    }
});

async function syncDetections() {
    // Implement background sync logic here
    console.log('Syncing detections...');
}

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('DermAI', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
