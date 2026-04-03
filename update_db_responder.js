const db = require('./db');

const queries = [
    "ALTER TABLE users ADD COLUMN station_id INT DEFAULT NULL",
    "ALTER TABLE users ADD CONSTRAINT fk_station FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL"
];

const runQueries = async () => {
    console.log("Starting Responder Station DB update...");
    for (const query of queries) {
        try {
            await new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_FIELDNAME') {
                            console.log(`Skipping: Column/Key already exists.`);
                            resolve();
                        } else {
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
