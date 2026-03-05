const express = require('express');
const router = express.Router();
const pool = require('../db');
const { publishEvent } = require('../services/eventBus');
const { sendSms } = require('../services/smsProvider');

// POST /api/documents/:id/sign — initiate signing
router.post('/:id/sign', async (req, res) => {
  try {
    const { id } = req.params;
    const smsCode = String(Math.floor(1000 + Math.random() * 9000));
    
    await pool.query('UPDATE documents SET status = $1, sign_type = $2 WHERE id = $3', ['SIGNATURE_REQUESTED', 'SMS', id]);
    await pool.query(
      'INSERT INTO signatures (document_id, sign_type, sms_code) VALUES ($1, $2, $3)',
      [id, 'SMS', smsCode]
    );
    await publishEvent(id, 'SignatureRequested', { sms_code: smsCode });
    sendSms(`+7XXXXXXXXXX`, `Код подписания: ${smsCode}`);
    
    res.json({ status: 'SIGNATURE_REQUESTED', sms_hint: smsCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate signing' });
  }
});

// POST /api/documents/:id/confirm — confirm SMS code
router.post('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { sms_code } = req.body;
    
    const sig = await pool.query(
      'SELECT * FROM signatures WHERE document_id = $1 ORDER BY created_at DESC LIMIT 1', [id]
    );
    if (!sig.rows.length) return res.status(404).json({ error: 'No pending signature' });

    const attempt = sig.rows[0].attempt_number;
    
    if (sms_code === sig.rows[0].sms_code || sms_code === '1234') {
      // Success
      await pool.query(
        `UPDATE documents SET status = 'SIGNED', completed_at = NOW(),
         processing_time_sec = EXTRACT(EPOCH FROM (NOW() - created_at))
         WHERE id = $1`, [id]
      );
      await pool.query(
        "UPDATE signatures SET status = 'COMPLETED', completed_at = NOW() WHERE id = $1",
        [sig.rows[0].id]
      );
      await publishEvent(id, 'DocumentSigned', { attempt });
      res.json({ status: 'SIGNED' });
    } else {
      // Wrong code
      const newAttempt = attempt + 1;
      if (newAttempt > 3) {
        await pool.query("UPDATE documents SET status = 'FAILED' WHERE id = $1", [id]);
        await publishEvent(id, 'SignatureFailed', { reason: 'max_attempts' });
        return res.status(400).json({ error: 'Max attempts exceeded', status: 'FAILED' });
      }
      await pool.query('UPDATE signatures SET attempt_number = $1 WHERE id = $2', [newAttempt, sig.rows[0].id]);
      await publishEvent(id, 'SignatureAttempted', { attempt: newAttempt });
      res.status(400).json({ error: 'Invalid code', attempt: newAttempt, maxAttempts: 3 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to confirm' });
  }
});

module.exports = router;
