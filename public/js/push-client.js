// push-client.js - Enhanced Cross-Platform Notification Client
const publicVapidKey = 'REPLACE_WITH_PUBLIC_KEY'; // Fetched dynamically

/**
 * Detects if the app is running on iOS
 */
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/**
 * Detects if the app is running in Standalone mode (added to home screen)
 */
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker Registered');
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
    // 1. iOS Specific Guard
    if (isIOS && !isStandalone) {
        Swal.fire({
            icon: 'info',
            title: 'Action Required for iOS',
            html: `To receive emergency alerts on iPhone/iPad:<br><br>
                   1. Tap the <b>Share</b> button <i class="bi bi-share"></i> at the bottom.<br>
                   2. Scroll down and tap <b>'Add to Home Screen'</b>.<br>
                   3. Open <b>CitySafe</b> from your home screen to enable notifications.`,
            confirmButtonText: 'Got it'
        });
        return;
    }

    // 2. Security Check (HTTPS/Localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        Swal.fire({
            icon: 'error',
            title: 'Security Requirement',
            text: 'Push notifications require a secure connection (HTTPS).'
        });
        return;
    }

    // 3. Technical Support Checks
    if (!('serviceWorker' in navigator)) throw new Error('Service Workers not supported.');
    if (!('PushManager' in window)) {
        if (isIOS) {
            throw new Error('Push notifications on iOS require adding to home screen first.');
        }
        throw new Error('Push messaging not supported in this browser.');
    }

    // 4. Permission Logic
    if (Notification.permission === 'denied') {
        Swal.fire({
            icon: 'warning',
            title: 'Notifications Blocked',
            html: 'You have blocked notifications.<br>Click the <b>Lock Icon</b> 🔒 next to the URL to Reset Permissions.',
            confirmButtonText: 'Got it'
        });
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // 5. Subscription Logic
    const registration = await registerServiceWorker();
    if (!registration) throw new Error('Registration failed.');

    const response = await fetch('/api/vapid-public-key');
    const { publicKey } = await response.json();
    if (!publicKey) throw new Error('No public key found.');

    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'content-type': 'application/json' }
        });

        Swal.fire({
            icon: 'success',
            title: 'System Armed!',
            text: 'You will now receive real-time alerts.',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (err) {
        console.error('Failed to subscribe:', err);
        throw err;
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateSubscriptionBtn() {
    // Clear badge if supported when app loads
    if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(() => { });

    const btn = document.getElementById('enableNotifications');
    if (!btn) return;

    if (Notification.permission === 'granted') {
        btn.classList.add('d-none');
    } else {
        btn.classList.remove('d-none');
        // iOS Safari workaround - button should be visible even if PWA not installed 
        // to show the "Add to Home Screen" instructions.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSubscriptionBtn();

    const btn = document.getElementById('enableNotifications');
    if (btn) {
        btn.addEventListener('click', async () => {
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Syncing...';
            btn.disabled = true;
            try {
                await subscribeUser();
                updateSubscriptionBtn();
            } catch (error) {
                console.error('Subscription error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Sync Error',
                    text: error.message || 'Could not connect to notification system.'
                });
            } finally {
                btn.innerHTML = '<i class="bi bi-bell-fill"></i><span class="d-none d-lg-inline ms-1 small fw-bold">Alerts</span>';
                btn.disabled = false;
            }
        });
    }
});
