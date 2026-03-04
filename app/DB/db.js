const { Pool } = require('pg');

// ВАЖНО: перед запуском сервера поменяйте user / password под свою установку PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'edms_dashboard',
  password: 'your_password',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;

