const db = require('./db');

const query = `
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    responder_id INT,
    endpoint TEXT NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES responders(id) ON DELETE CASCADE
)`;

db.query(query, (err, result) => {
    if (err) {
        console.error('Migration Failed:', err);
    } else {
        console.log('Migration Success: push_subscriptions table created.');
    }
    process.exit();
});
