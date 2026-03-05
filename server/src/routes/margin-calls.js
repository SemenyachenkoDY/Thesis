const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    res.json((await pool.query('SELECT * FROM margin_calls ORDER BY created_at DESC')).rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch margin calls' });
  }
});

module.exports = router;
