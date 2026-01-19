const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'myapp',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pool events
pool.on('connection', (connection) => {
  console.log('MySQL pool connection established');
});

pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
  // Pool handles its own reconnection for most errors
});

module.exports = pool;
