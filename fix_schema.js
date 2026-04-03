const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp' // Check if database name is correct from db.js or .env
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');

    const dropFK = "ALTER TABLE disaster_reports DROP FOREIGN KEY fk_responder";
    const addFK = "ALTER TABLE disaster_reports ADD CONSTRAINT fk_responder_correct FOREIGN KEY (responder_id) REFERENCES responders(id) ON DELETE SET NULL";

    console.log('Attempting to fix Foreign Key schema...');

    // 1. Drop the incorrect foreign key
    db.query(dropFK, (err) => {
        if (err) {
            if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log('Foreign key fk_responder does not exist or already dropped. Proceeding...');
            } else {
                console.error('Failed to drop old foreign key:', err.message);
                // We continue anyway in case it was named differently, but user might need manually check
            }
        } else {
            console.log('Dropped incorrect Foreign Key (fk_responder).');
        }

        // 2. Add the correct foreign key
        db.query(addFK, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_KEY' || err.code.includes('DUP')) {
                    console.log('Correct constraint might already exist.');
                } else {
                    console.error('Failed to add correct foreign key:', err.message);
                    console.log('HINT: This might fail if you have existing data in disaster_reports.responder_id that does not exist in responders table.');
                }
            } else {
                console.log('Successfully added correct Foreign Key (fk_responder_correct) referencing responders table.');
            }

            console.log('Schema fix attempt finished. Please restart your server and try to deploy again.');
            db.end();
        });
    });
});
