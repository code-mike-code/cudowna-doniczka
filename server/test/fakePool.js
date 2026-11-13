/**
 * In-memory stand-in for the mysql2 pool. It understands only the exact
 * statements issued by the routes — an unknown statement throws, so a changed
 * query fails the tests instead of silently passing.
 */
function createFakePool() {
  const pots = new Map(); // id -> row
  const counters = new Map(); // `${model}|${day}` -> last_value
  const executed = [];

  async function execute(sql, params = []) {
    const q = sql.replace(/\s+/g, ' ').trim();
    executed.push({ sql: q, params });

    if (q.startsWith('INSERT INTO serial_counters')) {
      const [model, day] = params;
      const key = `${model}|${day}`;
      counters.set(key, (counters.get(key) ?? 0) + 1);
      return [{ affectedRows: 1 }];
    }
    if (q.startsWith('SELECT last_value FROM serial_counters')) {
      const [model, day] = params;
      return [[{ last_value: counters.get(`${model}|${day}`) }]];
    }
    if (q.startsWith('INSERT INTO pots')) {
      const [id, serial_number, mass_kg, model_type, color, production_date] = params;
      for (const p of pots.values()) {
        if (p.serial_number === serial_number) {
          const err = new Error(`Duplicate entry '${serial_number}'`);
          err.code = 'ER_DUP_ENTRY';
          throw err;
        }
      }
      pots.set(id, {
        id,
        serial_number,
        mass_kg: mass_kg.toFixed(2), // DECIMAL comes back as string
        model_type,
        color,
        production_date,
        status: 'registered',
        created_by: null,
      });
      return [{ affectedRows: 1 }];
    }
    if (q.startsWith('SELECT id, serial_number, mass_kg, model_type, color, production_date FROM pots')) {
      const [id, ...statuses] = params;
      const row = pots.get(id);
      if (!row || !statuses.includes(row.status)) return [[]];
      const { id: rid, serial_number, mass_kg, model_type, color, production_date } = row;
      return [[{ id: rid, serial_number, mass_kg, model_type, color, production_date }]];
    }
    if (q.startsWith("UPDATE pots SET status = 'encoded'")) {
      const [id] = params;
      const row = pots.get(id);
      if (row && row.status === 'registered') {
        row.status = 'encoded';
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    if (q.startsWith('SELECT status FROM pots')) {
      const row = pots.get(params[0]);
      return [row ? [{ status: row.status }] : []];
    }
    throw new Error(`fakePool: unexpected SQL: ${q}`);
  }

  const conn = {
    execute,
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
  };

  return {
    pots,
    counters,
    executed,
    execute,
    getConnection: async () => conn,
  };
}

module.exports = { createFakePool };
