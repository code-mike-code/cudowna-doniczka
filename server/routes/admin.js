const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { rateLimit } = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { formatSerial, nextSerialValue } = require('../lib/serial');
const { UUID_REGEX } = require('../lib/validation');

const MASS_BY_MODEL = { S: 0.45, M: 1.2, L: 1.8 };
const MODEL_TYPES = Object.keys(MASS_BY_MODEL);
const COLOR_MAX_LENGTH = 50; // pots.color VARCHAR(50)

function createAdminRouter({ pool }) {
  const router = express.Router();

  // 5 attempts / 15 min / IP — counts every attempt, successful ones included.
  // Created per router so each app instance (and each test) has its own store.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' },
  });

  router.post('/login', loginLimiter, (req, res) => {
    const password = req.body?.password;
    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Password required' });
    }

    const inputBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(String(process.env.ADMIN_PASSWORD));
    const match =
      inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf);

    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  });

  router.post('/register-pot', auth, async (req, res) => {
    const modelType = req.body?.model_type;
    const rawColor = req.body?.color;
    const color = typeof rawColor === 'string' ? rawColor.trim() : '';

    if (!MODEL_TYPES.includes(modelType) || !color || color.length > COLOR_MAX_LENGTH) {
      return res
        .status(400)
        .json({ error: `model_type (S/M/L) and color (1-${COLOR_MAX_LENGTH} chars) required` });
    }

    const id = uuidv4();
    const massKg = MASS_BY_MODEL[modelType];
    const today = new Date().toISOString().split('T')[0];
    const nfcUrl = `https://cudownadoniczka.pl/pot/${id}`;

    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const serialNumber = formatSerial(modelType, today, await nextSerialValue(conn, modelType, today));
      // status defaults to 'registered' — the pot stays hidden on /pot/:uuid
      // until the chip is written, locked and confirmed via confirm-encoded.
      await conn.execute(
        `INSERT INTO pots (id, serial_number, mass_kg, model_type, color, production_date, status)
         VALUES (?, ?, ?, ?, ?, ?, 'registered')`,
        [id, serialNumber, massKg, modelType, color, today]
      );
      await conn.commit();
      res.status(201).json({ id, serial_number: serialNumber, nfc_url: nfcUrl });
    } catch (err) {
      if (conn) await conn.rollback().catch(() => {});
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } finally {
      if (conn) conn.release();
    }
  });

  // Called by the admin panel only after ndef.write() AND ndef.makeReadOnly() succeeded.
  router.post('/pots/:id/confirm-encoded', auth, async (req, res) => {
    const { id } = req.params;
    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE pots SET status = 'encoded' WHERE id = ? AND status = 'registered'",
        [id]
      );
      if (result.affectedRows === 1) {
        return res.json({ id, status: 'encoded' });
      }

      const [rows] = await pool.execute('SELECT status FROM pots WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pot not found' });
      }
      const { status } = rows[0];
      if (status === 'encoded' || status === 'active') {
        return res.json({ id, status }); // idempotent retry
      }
      return res.status(409).json({ error: `Pot status is '${status}'` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
}

module.exports = createAdminRouter;
