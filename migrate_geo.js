const mysql = require('mysql');
const axios = require('axios');
require('dotenv').config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "myapp"
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");

    // Fetch reports without coordinates
    db.query("SELECT id, location FROM disaster_reports WHERE latitude IS NULL OR longitude IS NULL", async (err, reports) => {
        if (err) throw err;

        console.log(`Found ${reports.length} reports to geocode.`);

        for (const report of reports) {
            if (!report.location) continue;

            try {
                console.log(`Geocoding: ${report.location} (ID: ${report.id})`);

                // Respect Nominatim rate limit (1 per second)
                await delay(1200);

                const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                    params: { q: report.location, format: "json", limit: 1 },
                    headers: { 'User-Agent': 'CitySafe-Migration-Script' }
                });

                if (response.data && response.data.length > 0) {
                    const lat = response.data[0].lat;
                    const lon = response.data[0].lon;

                    await new Promise((resolve, reject) => {
                        db.query("UPDATE disaster_reports SET latitude = ?, longitude = ? WHERE id = ?", [lat, lon, report.id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                    console.log(`Updated ID ${report.id}: ${lat}, ${lon}`);
                } else {
                    console.log(`No results for ${report.location}`);
                }

            } catch (e) {
                console.error(`Error processing ID ${report.id}:`, e.message);
            }
        }

        console.log("Migration complete.");
        process.exit();
    });
});
