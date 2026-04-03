const webpush = require('web-push');
const fs = require('fs');
try {
    const vapidKeys = webpush.generateVAPIDKeys();
    const content = `Public Key: ${vapidKeys.publicKey}\nPrivate Key: ${vapidKeys.privateKey}`;
    fs.writeFileSync('vapid_keys_output.txt', content);
    console.log('Keys written to vapid_keys_output.txt');
} catch (e) {
    console.error(e);
}
process.exit(0);
