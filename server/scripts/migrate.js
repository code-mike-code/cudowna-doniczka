#!/usr/bin/env node
/**
 * Applies server/migrations/NNN_name.sql in order and records them in schema_migrations.
 *
 *   node scripts/migrate.js            → lists pending migrations, changes nothing
 *   node scripts/migrate.js --apply    → applies them
 *
 * MySQL auto-commits DDL (ALTER/CREATE), so a failed migration cannot be rolled back:
 * back up the database first and ask the owner before running --apply on production.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function main() {
  const apply = process.argv.includes('--apply');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await conn.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
         name       VARCHAR(255) PRIMARY KEY,
         applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`
    );
    const [doneRows] = await conn.query('SELECT name FROM schema_migrations');
    const done = new Set(doneRows.map((r) => r.name));

    const pending = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => /^\d{3}_.+\.sql$/.test(f))
      .sort()
      .filter((f) => !done.has(f));

    if (pending.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    console.log(`Pending migrations (${process.env.DB_NAME}@${process.env.DB_HOST}):`);
    pending.forEach((f) => console.log(`  - ${f}`));

    if (!apply) {
      console.log('\nDry run. Re-run with --apply to execute (back up the database first).');
      return;
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`Applying ${file} …`);
      await conn.query(sql);
      await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
    }
    console.log('Done.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
