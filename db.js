const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'myapp',
  port: process.env.MYSQLPORT || 3306
});

db.on('error', (err) => {
  console.error('MySQL Connection Error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Reconnect logic could go here, but for now just log
  } else {
    throw err;
  }
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;
