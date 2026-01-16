const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp' // Check .env if unsure
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');

    const queries = [
        "ALTER TABLE users ADD COLUMN verification_code VARCHAR(6) DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN verification_expiry DATETIME DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0",
        "ALTER TABLE users ADD COLUMN verification_method ENUM('email', 'sms') DEFAULT 'email'"
    ];

    let completed = 0;

    queries.forEach(q => {
        db.query(q, (err) => {
            // Ignore "Duplicate column" errors
            if (err && err.code !== 'ER_DUP_FIELDNAME') {
                console.error('Error executing:', q, err.message);
            } else if (err) {
                console.log('Column already exists, skipping.');
            } else {
                console.log('Executed:', q);
            }

            completed++;
            if (completed === queries.length) {
                console.log('Migration finished.');
                db.end();
            }
        });
    });
});
