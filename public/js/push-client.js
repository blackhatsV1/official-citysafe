
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
        throw new Error('Notifications are currently blocked by your browser or system settings.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
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
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Specific handling for Unauthorized
                throw new Error('You must be logged in to subscribe.');
            } else {
                throw new Error(`Server error: ${response.statusText}`);
            }
        }

        Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: 'You will now receive weather notifications.',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (err) {
        console.error('Failed to subscribe:', err);

        // Improve error message for user
        let msg = 'Failed to subscribe to Push Manager.';
        if (err.message.includes('logged in')) {
            msg = err.message;
            // Optional: Redirect to login
            setTimeout(() => window.location.href = '/login', 2000);
        }

        throw new Error(msg); // Re-throw to stop chain
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

    // [PWA FIX] Register Service Worker immediately to enable "Add to Home Screen"
    registerServiceWorker().catch(err => console.error("SW Registration failed:", err));

    updateSubscriptionBtn();

    // Proactive check if notifications are blocked
    if (Notification.permission === 'denied') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: true,
            confirmButtonText: 'How to fix?',
            timer: 10000,
            timerProgressBar: true,
            background: '#191c24',
            color: '#fff',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'warning',
            title: 'Notifications were blocked',
            text: 'You may miss critical weather alerts.'
        }).then((result) => {
            if (result.isConfirmed) {
                showPlatformInstructions();
            }
        });
    }

    const btn = document.getElementById('enableNotifications');
    if (btn) {
        console.log('Button found, attaching listener');
        btn.addEventListener('click', async () => {
            console.log('Button clicked');
            // Request permission and subscribe
            try {
                // Ensure SW is ready (idempotent check)
                if (!('serviceWorker' in navigator)) throw new Error('Service Workers not supported.');
                const registration = await navigator.serviceWorker.ready; // Wait for the one we registered on load

                await subscribeUser(registration); // Pass registration or let it refetch
                updateSubscriptionBtn();
            } catch (error) {
                console.error('Subscription error:', error);
                
                const isBlocked = Notification.permission === 'denied';

                if (isBlocked) {
                    // If blocked, we likely already showed instructions via subscribeUser check,
                    // but let's ensure they have a clear path forward here too.
                    Swal.fire({
                        icon: 'warning',
                        title: 'Notifications Blocked',
                        html: `
                            <p>To receive alerts, you need to allow notifications in your browser and system settings.</p>
                            <p class="small text-muted">Click the button below for a step-by-step guide.</p>
                        `,
                        showCancelButton: true,
                        cancelButtonText: 'Close',
                        confirmButtonText: 'Show Guide',
                        confirmButtonColor: '#007bff',
                        background: '#191c24',
                        color: '#fff'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            showPlatformInstructions();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Subscription Failed',
                        text: error.message || 'Could not subscribe to notifications.',
                        confirmButtonText: 'Try Again',
                        confirmButtonColor: '#007bff',
                        background: '#191c24',
                        color: '#fff'
                    });
                }
            }
        });
    } else {
        // console.warn('Enable Notifications button MISSING on load (might be granted already)');
    }
});

/**
 * Show platform-specific instructions to enable notifications
 */
function showPlatformInstructions() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    let os = 'Unknown';

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'macOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (/Linux/.test(platform)) {
        os = 'Linux';
    }

    const instructions = {
        'Android': {
            icon: 'fa-android',
            color: '#3DDC84',
            steps: [
                'Open <b>Settings</b> on your phone.',
                'Go to <b>Apps</b> or <b>Application Manager</b>.',
                'Find and tap on <b>Chrome</b> (or your browser).',
                'Tap on <b>Notifications</b>.',
                'Ensure <b>Show notifications</b> is turned ON.'
            ]
        },
        'macOS': {
            icon: 'fa-apple',
            color: '#A2AAAD',
            steps: [
                'Click the <b>Apple Menu</b> () and choose <b>System Settings</b>.',
                'Click <b>Notifications</b> in the sidebar.',
                'Find <b>Chrome</b> (or your browser) in the list.',
                'Toggle <b>Allow Notifications</b> to ON.'
            ]
        },
        'Windows': {
            icon: 'fa-windows',
            color: '#0078D6',
            steps: [
                'Open the <b>Start Menu</b> and go to <b>Settings</b>.',
                'Go to <b>System</b> > <b>Notifications & actions</b>.',
                'Find <b>Chrome</b> (or your browser) in the list.',
                'Set the toggle to <b>On</b>.'
            ]
        },
        'Linux': {
            icon: 'fa-linux',
            color: '#FCC624',
            steps: [
                'Open your <b>System Settings</b>.',
                'Navigate to <b>Notifications</b>.',
                'Find your browser in the application list.',
                'Ensure notifications are enabled.'
            ]
        },
        'Unknown': {
            icon: 'fa-globe',
            color: '#6c757d',
            steps: [
                'Check your Browser Settings for notification permissions.',
                'Check your System Settings for notification alerts.'
            ]
        }
    };

    const current = instructions[os] || instructions['Unknown'];
    
    let stepsHtml = `<ol style="text-align: left; margin-bottom: 20px; color: #fff;">`;
    current.steps.forEach(step => {
        stepsHtml += `<li style="margin-bottom: 8px;">${step}</li>`;
    });
    stepsHtml += `</ol>`;

    Swal.fire({
        title: `<i class="fab ${current.icon}" style="color: ${current.color}"></i> Enable Notifications on ${os}`,
        html: `
            <div class="p-3">
                <p class="mb-3 text-white">Notifications are blocked. Please follow these steps to enable them in your <b>System Settings</b>:</p>
                ${stepsHtml}
                <hr style="border-top: 1px solid rgba(255,255,255,0.1)">
                <p class="small text-muted">
                    <i class="fa fa-lock me-1"></i> <b>Pro Tip:</b> You can also click the <b>Lock Icon</b> in the browser address bar to <b>Reset Permission</b>.
                </p>
            </div>
        `,
        confirmButtonText: 'I understand',
        confirmButtonColor: '#007bff',
        background: '#191c24', // Match theme-dark bg
        color: '#fff',
        customClass: {
            popup: 'animated fadeInDown'
        }
    });
}
