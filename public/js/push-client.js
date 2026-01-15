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
    // 1. Check Security (Required for notifications)
    if (!window.isSecureContext) {
        Swal.fire({
            icon: 'error',
            title: 'Insecure Connection',
            text: 'Notifications require HTTPS or localhost. You are likely strictly blocked by the browser.'
        });
        throw new Error('Push notifications require a secure context (HTTPS or localhost).');
    }

    // 2. Immediate Permission Request
    if (Notification.permission === 'denied') {
        Swal.fire({
            icon: 'warning',
            title: 'Notifications Blocked',
            html: 'You have blocked notifications.<br>Click the <b>Lock Icon</b> 🔒 in the URL bar to Reset Permissions.',
            confirmButtonText: 'Got it'
        });
        throw new Error('Notifications are currently blocked.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        Swal.fire({
            icon: 'info',
            title: 'Permission Needed',
            text: 'We need your permission to send weather alerts. Please click "Allow" on the browser prompt.',
            confirmButtonText: 'Try Again'
        });
        throw new Error('Notification permission was not granted.');
    }

    // 3. Technical Checks & Setup
    if (!('serviceWorker' in navigator)) throw new Error('Service Workers not supported.');
    if (!('PushManager' in window)) throw new Error('Push messaging not supported.');

    // Register Service Worker
    const registration = await registerServiceWorker();
    if (!registration) throw new Error('Service Worker registration failed.');

    // Fetch Public Key
    console.log('Fetching VAPID key...');
    const response = await fetch('/api/vapid-public-key');
    if (!response.ok) throw new Error('Failed to fetch public key from server.');

    const data = await response.json();
    const publicKey = data.publicKey;

    if (!publicKey) throw new Error('Server returned no public key. Check .env configuration.');

    // Convert Key
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // Subscribe
    console.log('Subscribing to Push Manager...');
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        console.log('Push Registered:', subscription);

        // Send Subscription to Server
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });

        Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: 'You will now receive weather notifications.',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (err) {
        console.error('Failed to subscribe:', err);
        throw new Error('Failed to subscribe to Push Manager: ' + err.message);
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

// Button Logic
function updateSubscriptionBtn() {
    const btn = document.getElementById('enableNotifications');
    if (!btn) {
        console.warn('Enable Notifications button not found in DOM');
        return;
    }

    if (Notification.permission === 'granted') {
        btn.style.display = 'none'; // Hide if already granted
        console.log('Notification permission granted, hiding button');
    } else {
        btn.style.display = 'block'; // Show if default or denied
        console.log('Notification permission not granted, showing button');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Push Client Loaded');
    updateSubscriptionBtn();

    const btn = document.getElementById('enableNotifications');
    if (btn) {
        console.log('Button found, attaching listener');
        btn.addEventListener('click', async () => {
            console.log('Button clicked');
            // Request permission and subscribe
            try {
                await subscribeUser();
                updateSubscriptionBtn();
            } catch (error) {
                console.error('Subscription error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed',
                    text: error.message || 'Could not subscribe to notifications.'
                });
            }
        });
    } else {
        console.error('Enable Notifications button MISSING on load');
    }
});
