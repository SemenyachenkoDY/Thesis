const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM reports ORDER BY created_at DESC';
    const values = [];
    if (status) {
      sql = 'SELECT * FROM reports WHERE status = $1 ORDER BY created_at DESC';
      values.push(status);
    }
    res.json((await pool.query(sql, values)).rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    const { report_type, title, period_start, period_end, client_id } = req.body;
    const result = await pool.query(
      `INSERT INTO reports (report_type, title, period_start, period_end, client_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [report_type, title, period_start, period_end, client_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

module.exports = router;
