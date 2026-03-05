const webpush = require('web-push');
const db = require('../db');
require('dotenv').config();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
    console.error('Error: VAPID keys not found in .env');
    process.exit(1);
}

webpush.setVapidDetails(
    'mailto:citysafe.official@gmail.com',
    publicVapidKey,
    privateVapidKey
);

// Get the latest subscription to test
db.query("SELECT * FROM push_subscriptions ORDER BY id DESC LIMIT 1", (err, results) => {
    if (err) {
        console.error('Database Error:', err);
        process.exit(1);
    }

    if (results.length === 0) {
        console.log('No subscriptions found in database. Register a device first.');
        process.exit(0);
    }

    const sub = results[0];
    const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth }
    };

    const payload = {
        title: 'CitySafe Test Notification',
        body: 'This is a rich notification with action buttons and app badge support.',
        url: '/',
        tag: 'test-alert',
        actions: [
            { action: '/', title: 'Open App', icon: '/images/shield.png' },
            { action: '/survival-tips', title: 'Safety Tips', icon: '/images/shield.png' }
        ]
    };

    console.log('Sending test push to:', sub.endpoint);

    webpush.sendNotification(subscription, JSON.stringify(payload))
        .then(() => {
            console.log('Success: Test notification sent.');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error sending push:', error);
            process.exit(1);
        });
});
