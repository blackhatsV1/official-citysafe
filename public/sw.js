const CACHE_NAME = 'citysafe-v5-pwa';
const STATIC_ASSETS = [
    '/',
    '/login',
    '/css/style.css',
    '/js/script.js',
    '/js/main.js',
    '/js/push-client.js',
    '/images/shield.png',
    '/manifest.json'
];

self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(STATIC_ASSETS);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Strategy: Network First for EVERYTHING to ensure style persistence
    // We only fallback to cache if the network fails (offline)
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If network works, return it
                return response;
            })
            .catch(() => {
                // If offline, try cache
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) return cachedResponse;
                        // Ultimate fallback for navigation
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                    });
            })
    );
});


self.addEventListener('push', function (event) {
    console.log('[SW] Push Received');
    let data = { title: 'CitySafe Alert', body: 'New notification received.' };

    try {
        if (event.data) {
            const rawData = event.data.text();
            console.log('[SW] Raw Push Data:', rawData);
            data = JSON.parse(rawData);
            console.log('[SW] Parsed Push Data:', data);
        }
    } catch (err) {
        console.error('[SW] Push data parse failed. Using fallback.', err);
        // data remains as fallback default
    }

    const options = {
        body: data.body || 'New Notification',
        icon: '/images/shield.png',
        badge: '/images/shield.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'CitySafe Alert', options)
            .catch(err => console.error('[SW] Failed to show notification:', err))
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Resolve relative URLs to absolute for matching
    const targetUrl = new URL(event.notification.data.url, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Focus if already open
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // Check if current URL matches or matches normalized target
                if (client.url === targetUrl && 'focus' in client)
                    return client.focus();
            }
            // Open new if not found open
            if (clients.openWindow)
                return clients.openWindow(targetUrl);
        })
    );
});
