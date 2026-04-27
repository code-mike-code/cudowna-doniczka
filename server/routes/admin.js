const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');
const auth = require('../middleware/auth');

const MASS_BY_MODEL = { S: 0.45, M: 1.20, L: 1.80 };

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const inputBuf = Buffer.from(String(password));
  const expectedBuf = Buffer.from(String(process.env.ADMIN_PASSWORD));

  let match = false;
  try {
    match =
      inputBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(inputBuf, expectedBuf);
  } catch {
    match = false;
  }

  if (!match) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  res.json({ token });
});

router.post('/register-pot', auth, async (req, res) => {
  const { model_type, color } = req.body;

  if (!['S', 'M', 'L'].includes(model_type) || !color || !color.trim()) {
    return res.status(400).json({ error: 'model_type (S/M/L) and color required' });
  }

  const id = uuidv4();
  const mass_kg = MASS_BY_MODEL[model_type];
  const today = new Date().toISOString().split('T')[0];
  const randomHex = crypto.randomBytes(2).toString('hex');
  const serial_number = `CD-${model_type}-${today.replace(/-/g, '')}-${randomHex}`;
  const nfc_url = `https://cudownadoniczka.pl/pot/${id}`;

  try {
    await pool.execute(
      'INSERT INTO pots (id, serial_number, mass_kg, model_type, color, production_date) VALUES (?, ?, ?, ?, ?, ?)',
      [id, serial_number, mass_kg, model_type, color.trim(), today]
    );
    res.status(201).json({ id, serial_number, nfc_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
