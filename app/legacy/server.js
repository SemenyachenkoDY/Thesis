const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Вспомогательная функция для построения WHERE с фильтрами
function buildFilters(query) {
  const values = [];
  let where = 'WHERE 1=1';

  if (query.startDate) {
    values.push(query.startDate);
    where += ` AND created_at >= $${values.length}`;
  }

  if (query.endDate) {
    values.push(query.endDate);
    where += ` AND created_at <= $${values.length}`;
  }

  if (query.docType && query.docType !== 'all') {
    values.push(query.docType);
    where += ` AND doc_type = $${values.length}`;
  }

  if (query.department && query.department !== 'all') {
    values.push(query.department);
    where += ` AND department = $${values.length}`;
  }

  return { where, values };
}

// Health-check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

// 1. Success Rate
app.get('/api/kpi/success-rate', async (req, res) => {
  const { where, values } = buildFilters(req.query);
  const sql = `
    SELECT
      COALESCE(
        ROUND(
          100.0 * SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
          2
        ),
        0
      ) AS success_rate,
      COUNT(*) AS total_documents,
      SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_documents
    FROM documents
    ${where};
  `;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate success rate' });
  }
});

// 2. Average Processing Time (в часах)
app.get('/api/kpi/avg-time', async (req, res) => {
  const { where, values } = buildFilters(req.query);
  const sql = `
    SELECT
      COALESCE(
        ROUND(
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600.0),
          2
        ),
        0
      ) AS avg_processing_hours
    FROM documents
    ${where} AND completed_at IS NOT NULL;
  `;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate average processing time' });
  }
});

// 3. Documents per Department
app.get('/api/kpi/by-department', async (req, res) => {
  const { where, values } = buildFilters(req.query);
  const sql = `
    SELECT
      department,
      COUNT(*) AS documents_count
    FROM documents
    ${where}
    GROUP BY department
    ORDER BY documents_count DESC;
  `;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get documents by department' });
  }
});

// 4. Returns Rate (возвраты на доработку)
app.get('/api/kpi/returns', async (req, res) => {
  const { where, values } = buildFilters(req.query);
  const sql = `
    SELECT
      COALESCE(
        ROUND(
          100.0 * SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
          2
        ),
        0
      ) AS returns_rate,
      COUNT(*) AS total_documents,
      SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) AS returned_documents
    FROM documents
    ${where};
  `;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate returns rate' });
  }
});

// 5. Monthly Dynamics
app.get('/api/kpi/dynamics', async (req, res) => {
  const { where, values } = buildFilters(req.query);
  const sql = `
    SELECT
      to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
      COUNT(*) AS total_documents,
      SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_documents,
      SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) AS returned_documents
    FROM documents
    ${where}
    GROUP BY month
    ORDER BY month;
  `;

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get monthly dynamics' });
  }
});

app.listen(PORT, () => {
  console.log(`EDMS dashboard backend listening on http://localhost:${PORT}`);
});

