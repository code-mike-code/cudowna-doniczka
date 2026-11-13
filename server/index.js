const path = require('path');
// Resolve relative to this file, not the cwd — works for `cd server && node index.js`
// as well as `node server/index.js` / pm2 / systemd started from the repo root.
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const REQUIRED_ENV = ['JWT_SECRET', 'ADMIN_PASSWORD', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required env vars:', missing.join(', '));
  process.exit(1);
}

const createApp = require('./app');
const pool = require('./db');

/** TRUST_PROXY=1 → number of hops; "true"/"loopback"/CIDR passed through as-is. */
function parseTrustProxy(value) {
  if (value === undefined || value === '') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const n = Number(value);
  return Number.isInteger(n) ? n : value;
}

const app = createApp({
  pool,
  serveStatic: process.env.NODE_ENV === 'production',
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
