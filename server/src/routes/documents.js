const express = require('express');
const router = express.Router();
const pool = require('../db');
const { publishEvent } = require('../services/eventBus');

// GET /api/documents
router.get('/', async (req, res) => {
  try {
    const { status, doc_type } = req.query;
    let sql = 'SELECT * FROM documents ORDER BY created_at DESC';
    const values = [];
    if (status) {
      sql = 'SELECT * FROM documents WHERE status = $1 ORDER BY created_at DESC';
      values.push(status);
    }
    if (doc_type) {
      sql = values.length
        ? 'SELECT * FROM documents WHERE status = $1 AND doc_type = $2 ORDER BY created_at DESC'
        : 'SELECT * FROM documents WHERE doc_type = $1 ORDER BY created_at DESC';
      values.push(doc_type);
    }
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/documents
router.post('/', async (req, res) => {
  try {
    const { title, doc_type, client_id, scenario, department } = req.body;
    const result = await pool.query(
      `INSERT INTO documents (title, doc_type, client_id, scenario, department)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, doc_type, client_id, scenario || 'TO_BE', department]
    );
    await publishEvent(result.rows[0].id, 'DocumentCreated', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// GET /api/documents/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
