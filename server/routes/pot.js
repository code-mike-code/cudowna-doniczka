const express = require('express');
const router = express.Router();
const pool = require('../db');

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

router.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;

  if (!UUID_REGEX.test(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM pots WHERE id = ?', [uuid]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pot not found' });
    }
    const row = rows[0];
    res.json({ ...row, mass_kg: parseFloat(row.mass_kg) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
