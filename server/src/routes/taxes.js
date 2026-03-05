const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:year', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tax_records WHERE tax_year = $1', [req.params.year]);
    res.json(result.rows[0] || { tax_year: parseInt(req.params.year), tax_base: 0, to_pay: 0, paid: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch taxes' });
  }
});

module.exports = router;
