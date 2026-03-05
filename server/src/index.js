const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
const pool = require('./db');
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/documents', require('./routes/documents'));
app.use('/api/documents', require('./routes/signing'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/corp-actions', require('./routes/corp-actions'));
app.use('/api/taxes', require('./routes/taxes'));
app.use('/api/margin-calls', require('./routes/margin-calls'));
app.use('/api/analytics', require('./routes/analytics'));

// Start
app.listen(PORT, () => {
  console.log(`\n  ⚡ Fast Sign API`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → Health: http://localhost:${PORT}/api/health\n`);
});
