/**
 * Serial numbers: CD-{model}-{YYYYMMDD}-{NNNNN}, sequential per model and day.
 * Old serials used 2 random bytes (CD-M-20260427-ab12) — at ~300 pots/day the birthday
 * collision chance was already ~50%. The new 5-digit decimal suffix cannot clash with them.
 */

function formatSerial(modelType, day, value) {
  return `CD-${modelType}-${day.replace(/-/g, '')}-${String(value).padStart(5, '0')}`;
}

/**
 * Reserves the next counter value. Must run inside a transaction on `conn`:
 * the upsert takes a row lock, so concurrent registrations serialize here
 * and each gets a distinct value.
 *
 * @param {import('mysql2/promise').PoolConnection} conn
 * @param {'S'|'M'|'L'} modelType
 * @param {string} day YYYY-MM-DD
 */
async function nextSerialValue(conn, modelType, day) {
  await conn.execute(
    `INSERT INTO serial_counters (model_type, day, last_value) VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE last_value = last_value + 1`,
    [modelType, day]
  );
  const [rows] = await conn.execute(
    'SELECT last_value FROM serial_counters WHERE model_type = ? AND day = ? FOR UPDATE',
    [modelType, day]
  );
  return Number(rows[0].last_value);
}

module.exports = { formatSerial, nextSerialValue };
