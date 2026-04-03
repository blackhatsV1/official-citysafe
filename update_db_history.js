const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB...');

    const queries = [
        "ALTER TABLE disaster_reports ADD COLUMN resolution_remarks TEXT",
        "ALTER TABLE disaster_reports ADD COLUMN resolved_by VARCHAR(255)"
    ];

    let completed = 0;
    queries.forEach(q => {
        db.query(q, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME') console.log('Column already exists.');
                else console.error(err);
            } else {
                console.log('Column added successfully.');
            }
            completed++;
            if (completed === queries.length) process.exit();
        });
    });
});
