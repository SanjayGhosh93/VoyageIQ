// backend/config/mysql.js
const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'oceancharter',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-initialize required table schema on startup
const initSchema = async (connection) => {
  const createCargoTable = `
    CREATE TABLE IF NOT EXISTS cargo_dataset (
      id INT AUTO_INCREMENT PRIMARY KEY,
      year INT NOT NULL,
      cargo_type VARCHAR(100) NOT NULL,
      volume_mt DECIMAL(15,2) NOT NULL,
      origin_port VARCHAR(100) NOT NULL,
      destination_port VARCHAR(100) NOT NULL,
      avg_freight_usd DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await connection.query(createCargoTable);
};

const connectMySQL = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    console.log(`[Database] MySQL pool connected successfully to: ${process.env.MYSQL_DATABASE || 'oceancharter'}`);
    await initSchema(connection);
    console.log('[Database] MySQL tables verified/initialized.');
    connection.release();
  } catch (error) {
    console.warn(`[Database Warning] Local MySQL connection failed (${error.message}).`);
    console.warn('[Database Notice] OceanCharter AI will continue running with resilient dynamic fallback data.');
  }
};

module.exports = {
  mysqlPool,
  connectMySQL
};