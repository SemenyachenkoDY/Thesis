const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, client_type } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Generate random contract number: BP + 5 digits
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const contractNumber = `BP${randomDigits}`;

    // 3. Save to DB
    const result = await pool.query(
      `INSERT INTO clients (name, email, password_hash, client_type, contract_number, status)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE') RETURNING id, name, email, contract_number`,
      [name, email, passwordHash, client_type || "PHYSICAL", contractNumber],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login (Basic implementation for completeness)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM clients WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const client = result.rows[0];
    const isMatch = await bcrypt.compare(password, client.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password hash from response
    const { password_hash, ...clientData } = client;
    res.json({ message: "Login successful", client: clientData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// PUT /api/auth/update
router.put('/update', async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    if (!id) return res.status(400).json({ error: 'Client ID required' });

    const result = await pool.query(
      `UPDATE clients 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           phone = COALESCE($3, phone) 
       WHERE id = $4 
       RETURNING id, name, email, phone, contract_number`,
      [name, email, phone, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// PUT /api/auth/password
router.put('/password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    if (!id || !currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

    const clientRes = await pool.query('SELECT password_hash FROM clients WHERE id = $1', [id]);
    if (clientRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, clientRes.rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid current password' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE clients SET password_hash = $1 WHERE id = $2', [hash, id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Password update failed' });
  }
});

module.exports = router;
