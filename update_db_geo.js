const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "myapp"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");

    const sql1 = "ALTER TABLE disaster_reports ADD COLUMN latitude DECIMAL(10, 8) NULL";
    const sql2 = "ALTER TABLE disaster_reports ADD COLUMN longitude DECIMAL(11, 8) NULL";

    db.query(sql1, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Column latitude already exists.");
            } else {
                console.error(err);
            }
        } else {
            console.log("Added latitude column.");
        }

        db.query(sql2, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log("Column longitude already exists.");
                } else {
                    console.error(err);
                }
            } else {
                console.log("Added longitude column.");
            }
            process.exit();
        });
    });
});
