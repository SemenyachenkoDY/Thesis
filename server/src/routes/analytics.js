const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/analytics/kpi
router.get('/kpi', async (req, res) => {
  try {
    const [time, success, support, types] = await Promise.all([
      // 1. Avg processing time by scenario
      pool.query(`
        SELECT scenario, ROUND(AVG(processing_time_sec), 2) AS avg_time
        FROM documents GROUP BY scenario
      `),
      // 2. Success rate
      pool.query(`
        SELECT d.scenario, 
               ROUND(100.0 * SUM(CASE WHEN s.attempt_number = 1 AND s.status = 'SUCCESS' THEN 1 ELSE 0 END) / NULLIF(COUNT(d.id), 0), 2) AS rate
        FROM documents d LEFT JOIN signatures s ON d.id = s.document_id GROUP BY d.scenario
      `),
      // 3. Support requests
      pool.query(`
        SELECT d.scenario, COUNT(sr.id) AS count
        FROM documents d LEFT JOIN support_requests sr ON d.id = sr.document_id GROUP BY d.scenario
      `),
      // 4. Distribution
      pool.query(`
        SELECT doc_type, COUNT(*) AS count FROM documents GROUP BY doc_type
      `)
    ]);

    res.json({
      processingTime: time.rows,
      successRates: success.rows,
      supportTickets: support.rows,
      docDistribution: types.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
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
