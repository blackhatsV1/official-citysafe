const db = require('./db');

const queries = [
    "ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'responder') NOT NULL DEFAULT 'user'",
    "ALTER TABLE users ADD COLUMN latitude DOUBLE DEFAULT NULL",
    "ALTER TABLE users ADD COLUMN longitude DOUBLE DEFAULT NULL",
    "ALTER TABLE users ADD COLUMN status ENUM('active', 'busy', 'deployed', 'offline') DEFAULT 'offline'"
];

const runQueries = async () => {
    console.log("Starting database update...");
    for (const query of queries) {
        try {
            await new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        // Ignore if column already exists or other non-critical errors if possible, 
                        // but for now let's log and reject (or resolve if we want to continue)
                        // specifically checking for 'Duplicate column name' error code 1060
                        if (err.code === 'ER_DUP_FIELDNAME') {
                            console.log(`Skipping: Column already exists.`);
                            resolve();
                        } else {
                            reject(err);
                        }
                    } else {
                        console.log(`Success: ${query}`);
                        resolve(result);
                    }
                });
            });
        } catch (err) {
            console.error(`Error executing query: ${query}`, err);
        }
    }
    console.log("Database update complete. Exiting...");
    process.exit();
};

runQueries();
