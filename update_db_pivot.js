const db = require('./db');

const queries = [
    "ALTER TABLE disaster_reports ADD COLUMN status ENUM('pending', 'responding', 'resolved') DEFAULT 'pending'",
    "ALTER TABLE disaster_reports ADD COLUMN responder_id INT DEFAULT NULL",
    "ALTER TABLE disaster_reports ADD CONSTRAINT fk_responder FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE SET NULL"
];

const runQueries = async () => {
    console.log("Starting SOS database pivot update...");
    for (const query of queries) {
        try {
            await new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_FIELDNAME') {
                            console.log(`Skipping: Column already exists.`);
                            resolve();
                        } else {
                            // Log but try to continue if it's just a constraint error or similar
                            console.error(`Error with query: ${query}`, err.message);
                            resolve();
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
