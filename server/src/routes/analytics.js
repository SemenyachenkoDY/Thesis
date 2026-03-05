const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/analytics/kpi
router.get('/kpi', async (req, res) => {
  try {
    const [sr, avg, dept, fail] = await Promise.all([
      pool.query(`
        SELECT
          COALESCE(ROUND(100.0 * SUM(CASE WHEN status='SIGNED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0), 2), 0) AS success_rate,
          COUNT(*) AS total
        FROM documents
      `),
      pool.query(`
        SELECT COALESCE(ROUND(AVG(processing_time_sec), 2), 0) AS avg_time_sec
        FROM documents WHERE processing_time_sec IS NOT NULL
      `),
      pool.query(`
        SELECT doc_type, COUNT(*) AS count
        FROM documents GROUP BY doc_type ORDER BY count DESC
      `),
      pool.query(`
        SELECT COALESCE(ROUND(100.0 * SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0), 2), 0) AS fail_rate
        FROM documents
      `),
    ]);
    res.json({
      successRate: sr.rows[0],
      avgProcessingTime: avg.rows[0],
      byType: dept.rows,
      failRate: fail.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate KPI' });
  }
});

// GET /api/analytics/events
router.get('/events', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
