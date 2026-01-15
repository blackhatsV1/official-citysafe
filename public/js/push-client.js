const publicVapidKey = 'REPLACE_WITH_PUBLIC_KEY'; // Will be fetched from server

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker Registered');

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return register;
        } catch (err) {
            console.error('Service Worker Failed:', err);
        }
    } else {
        console.warn('Service Workers not supported in this browser');
    }
}

async function subscribeUser() {
    const registration = await registerServiceWorker();
    if (!registration) return;

    // Fetch Public Key from Server
    const response = await fetch('/api/vapid-public-key');
    const { publicKey } = await response.json();

    if (!publicKey) {
        console.error('No public key found');
        return;
    }

    // Convert key to Uint8Array
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // Subscribe
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        console.log('Push Registered...');

        // Send Subscription to Server
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log('Push Sent to Server...');
    } catch (err) {
        console.error('Failed to subscribe:', err);
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Auto-subscribe on load (or trigger via button)
// document.addEventListener('DOMContentLoaded', subscribeUser);
// Better: Ask permission when user logs in or clicks a button
