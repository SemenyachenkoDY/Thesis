const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    res.json((await pool.query('SELECT * FROM corp_actions ORDER BY created_at DESC')).rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch corp actions' });
  }
});

module.exports = router;
