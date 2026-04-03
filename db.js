const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // 20 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
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
