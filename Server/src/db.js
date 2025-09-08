const { Pool } = require('pg');
const path = require('path');

// Load environment variables from .env if present
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (e) {
  // dotenv is optional; if not installed, proceed with process.env only
}

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || process.env.PGUSER || process.env.USER,
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'medlab',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || undefined,
  port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

module.exports = pool;
