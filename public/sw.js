const CACHE_NAME = 'citysafe-v1';
const STATIC_ASSETS = [
    '/',
    '/login',
    '/css/custom.css',
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
    // Strategy: Network First for HTML, Cache First for Assets
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request)
                        .then(response => {
                            if (response) return response;
                            // Optional: Return a generic "offline.html" here if caching '/' fails
                            return caches.match('/');
                        });
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});


self.addEventListener('push', function (event) {
    let data = {
        title: 'CitySafe Alert',
        body: 'New emergency notification received.',
        url: '/',
        actions: []
    };

    if (event.data) {
        try {
            const json = event.data.json();
            data = { ...data, ...json };
        } catch (e) {
            data.body = event.data.text() || data.body;
        }
    }

    const options = {
        body: data.body,
        icon: '/images/shield.png',
        badge: '/images/shield.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'citysafe-alert-' + Date.now(),
        renotify: true,
        actions: data.actions || [],
        data: {
            url: data.url
        }
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(data.title, options),
            // Set badge if supported
            'setAppBadge' in navigator ? navigator.setAppBadge(1) : Promise.resolve()
        ])
    );
});

self.addEventListener('notificationclick', function (event) {
    const notification = event.notification;
    const action = event.action;
    const url = action || notification.data.url || '/';

    notification.close();

    // Clear badge if supported (optional, might want to do this on app open instead)
    if ('clearAppBadge' in navigator) navigator.clearAppBadge();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If action is provided, it might be a specific URL
            const targetUrl = new URL(url, self.location.origin).href;

            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === targetUrl && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow)
                return clients.openWindow(targetUrl);
        })
    );
});
