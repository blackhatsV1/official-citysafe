const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp' // Assuming 'myapp' based on db.js
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
    runMigration();
});

function runMigration() {
    const query = "ALTER TABLE responders ADD COLUMN action ENUM('standby', 'responding') DEFAULT 'standby'";

    console.log('Running migration: Adding action column to responders table...');

    db.query(query, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Migration skipped: Column "action" already exists.');
            } else {
                console.error('Migration failed:', err.message);
            }
        } else {
            console.log('Migration successful: "action" column added.');
        }

        // Ensure all existing responders are set to standby if null
        db.query("UPDATE responders SET action = 'standby' WHERE action IS NULL", (err, res) => {
            if (!err) console.log("Data cleanup: Set defaults for existing records.");
            db.end();
            process.exit(0);
        });
    });
}
