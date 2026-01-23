// ===============================
// Service Worker Registration
// ===============================
async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers not supported');
    }

    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('[Push] Service Worker registered');

    return navigator.serviceWorker.ready;
}

// ===============================
// Subscribe User
// ===============================
async function subscribeUser(registration) {
    // Security check
    if (!window.isSecureContext) {
        Swal.fire({
            icon: 'error',
            title: 'Insecure Connection',
            text: 'Notifications require HTTPS or localhost.'
        });
        throw new Error('Insecure context');
    }

    // Permission checks
    if (Notification.permission === 'denied') {
        Swal.fire({
            icon: 'warning',
            title: 'Notifications Blocked',
            html: 'Click the <b>lock icon</b> 🔒 in the address bar to reset permissions.'
        });
        throw new Error('Notifications blocked');
    }

    if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission not granted');
        }
    }

    if (!('PushManager' in window)) {
        throw new Error('Push messaging not supported');
    }

    // Fetch VAPID public key
    const res = await fetch('/api/vapid-public-key');
    if (!res.ok) throw new Error('Failed to fetch VAPID key');

    const { publicKey } = await res.json();
    if (!publicKey) throw new Error('Missing VAPID public key');

    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // Get existing subscription (IMPORTANT)
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
        });
        console.log('[Push] New subscription created');
    } else {
        console.log('[Push] Existing subscription found');
    }

    // Send subscription to backend
    await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
    });

    Swal.fire({
        icon: 'success',
        title: 'Subscribed!',
        text: 'You will now receive notifications.',
        timer: 2000,
        showConfirmButton: false
    });
}

// ===============================
// Utils
// ===============================
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// ===============================
// Button Visibility
// ===============================
async function updateSubscriptionBtn(registration) {
    const btn = document.getElementById('enableNotifications');
    if (!btn) return;

    const subscription = await registration.pushManager.getSubscription();
    btn.style.display = subscription ? 'none' : 'block';
}

// ===============================
// Init
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('[Push] Client loaded');

        const registration = await registerServiceWorker();
        await updateSubscriptionBtn(registration);

        const btn = document.getElementById('enableNotifications');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            try {
                await subscribeUser(registration);
                await updateSubscriptionBtn(registration);
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed',
                    text: err.message || 'Could not subscribe to notifications.'
                });
            }
        });

    } catch (err) {
        console.error('[Push] Initialization failed:', err);
    }
});
