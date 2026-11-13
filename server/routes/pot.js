const express = require('express');
const { UUID_REGEX } = require('../lib/validation');

// Public endpoint: list columns explicitly so new internal columns
// (status, created_by, chip_uid …) never leak.
const PUBLIC_COLUMNS = 'id, serial_number, mass_kg, model_type, color, production_date';
const VISIBLE_STATUSES = ['encoded', 'active'];

function createPotRouter({ pool }) {
  const router = express.Router();

  router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    if (!UUID_REGEX.test(uuid)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }

    try {
      const [rows] = await pool.execute(
        `SELECT ${PUBLIC_COLUMNS} FROM pots WHERE id = ? AND status IN (?, ?)`,
        [uuid, ...VISIBLE_STATUSES]
      );
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

  return router;
}

module.exports = createPotRouter;
