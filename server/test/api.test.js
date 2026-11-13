import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import createApp from '../app.js';
import { createFakePool } from './fakePool.js';
import { formatSerial, nextSerialValue } from '../lib/serial.js';

const ADMIN_PASSWORD = 'correct-horse-battery';
const JWT_SECRET = 'test-secret-at-least-32-characters-long!!';

beforeAll(() => {
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;
  process.env.JWT_SECRET = JWT_SECRET;
});

let pool;
let app;
let token;

beforeEach(() => {
  pool = createFakePool();
  app = createApp({ pool });
  token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
});

const register = (body) =>
  request(app).post('/api/admin/register-pot').set('Authorization', `Bearer ${token}`).send(body);

describe('0.2 login rate limit', () => {
  it('returns 429 on the 6th attempt within 15 minutes', async () => {
    for (let i = 1; i <= 5; i++) {
      const res = await request(app).post('/api/admin/login').send({ password: `wrong-${i}` });
      expect(res.status).toBe(401);
    }
    const sixth = await request(app).post('/api/admin/login').send({ password: ADMIN_PASSWORD });
    expect(sixth.status).toBe(429);
    expect(sixth.body.error).toMatch(/Zbyt wiele prób/);
  });

  it('still logs in with the right password under the limit', async () => {
    const res = await request(app).post('/api/admin/login').send({ password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(jwt.verify(res.body.token, JWT_SECRET).role).toBe('admin');
  });

  it('rejects a non-string password with 400', async () => {
    const res = await request(app).post('/api/admin/login').send({ password: { $ne: '' } });
    expect(res.status).toBe(400);
  });
});

describe('register-pot input validation (crash fix)', () => {
  it.each([
    [{ model_type: 'M', color: 5 }],
    [{ model_type: 'M', color: ['red'] }],
    [{ model_type: 'M', color: '   ' }],
    [{ model_type: 'M', color: 'x'.repeat(51) }],
    [{ model_type: 'XL', color: 'red' }],
    [{ model_type: '__proto__', color: 'red' }],
    [{}],
  ])('returns 400 for %j without touching the DB', async (body) => {
    const res = await register(body);
    expect(res.status).toBe(400);
    expect(pool.executed).toHaveLength(0);
  });

  it('requires a token', async () => {
    const res = await request(app).post('/api/admin/register-pot').send({ model_type: 'M', color: 'red' });
    expect(res.status).toBe(401);
  });

  it('returns JSON 400 for malformed JSON instead of an HTML page', async () => {
    const res = await request(app)
      .post('/api/admin/register-pot')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{"model_type":');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Bad request' });
  });

  it('rejects bodies over 10kb with 413', async () => {
    const res = await register({ model_type: 'M', color: 'x'.repeat(11 * 1024) });
    expect(res.status).toBe(413);
  });
});

describe('0.3 serial numbers', () => {
  it('formats CD-{model}-{YYYYMMDD}-{NNNNN}', () => {
    expect(formatSerial('M', '2026-11-13', 7)).toBe('CD-M-20261113-00007');
  });

  it('10 000 registrations of one model on one day produce no collisions', async () => {
    const conn = await pool.getConnection();
    const serials = new Set();
    for (let i = 0; i < 10_000; i++) {
      serials.add(formatSerial('M', '2026-11-13', await nextSerialValue(conn, 'M', '2026-11-13')));
    }
    expect(serials.size).toBe(10_000);
    expect([...serials].at(-1)).toBe('CD-M-20261113-10000');
  });

  it('200 concurrent HTTP registrations get distinct sequential serials', async () => {
    const results = await Promise.all(
      Array.from({ length: 200 }, () => register({ model_type: 'S', color: 'naturalny' }))
    );
    results.forEach((r) => expect(r.status).toBe(201));
    const serials = new Set(results.map((r) => r.body.serial_number));
    expect(serials.size).toBe(200);
    results.forEach((r) => expect(r.body.serial_number).toMatch(/^CD-S-\d{8}-\d{5}$/));
  });

  it('counters are independent per model', async () => {
    const s = await register({ model_type: 'S', color: 'a' });
    const l = await register({ model_type: 'L', color: 'a' });
    expect(s.body.serial_number.endsWith('-00001')).toBe(true);
    expect(l.body.serial_number.endsWith('-00001')).toBe(true);
  });
});

describe('0.4 + 0.6 public pot endpoint and status', () => {
  it('hides a registered pot until the chip is confirmed, then returns exactly 6 fields', async () => {
    const created = await register({ model_type: 'M', color: 'czarny' });
    expect(created.status).toBe(201);
    const { id } = created.body;

    const before = await request(app).get(`/api/pot/${id}`);
    expect(before.status).toBe(404);

    const confirm = await request(app)
      .post(`/api/admin/pots/${id}/confirm-encoded`)
      .set('Authorization', `Bearer ${token}`);
    expect(confirm.status).toBe(200);
    expect(confirm.body.status).toBe('encoded');

    const after = await request(app).get(`/api/pot/${id}`);
    expect(after.status).toBe(200);
    expect(Object.keys(after.body).sort()).toEqual(
      ['color', 'id', 'mass_kg', 'model_type', 'production_date', 'serial_number'].sort()
    );
    expect(after.body.mass_kg).toBe(1.2);
    expect(after.body).not.toHaveProperty('status');
  });

  it('confirm-encoded is idempotent', async () => {
    const { id } = (await register({ model_type: 'M', color: 'a' })).body;
    const auth = { Authorization: `Bearer ${token}` };
    await request(app).post(`/api/admin/pots/${id}/confirm-encoded`).set(auth);
    const again = await request(app).post(`/api/admin/pots/${id}/confirm-encoded`).set(auth);
    expect(again.status).toBe(200);
  });

  it('confirm-encoded returns 409 for a void pot, 404 for unknown, 400 for bad id, 401 without token', async () => {
    const { id } = (await register({ model_type: 'M', color: 'a' })).body;
    pool.pots.get(id).status = 'void';
    const auth = { Authorization: `Bearer ${token}` };

    expect((await request(app).post(`/api/admin/pots/${id}/confirm-encoded`).set(auth)).status).toBe(409);
    expect(
      (await request(app).post('/api/admin/pots/3f2b8c1e-7d4a-4b9e-8f21-0c6d5e4a3b2f/confirm-encoded').set(auth))
        .status
    ).toBe(404);
    expect((await request(app).post('/api/admin/pots/abc/confirm-encoded').set(auth)).status).toBe(400);
    expect((await request(app).post(`/api/admin/pots/${id}/confirm-encoded`)).status).toBe(401);
  });

  it('a void pot disappears from the public endpoint', async () => {
    const { id } = (await register({ model_type: 'M', color: 'a' })).body;
    pool.pots.get(id).status = 'void';
    expect((await request(app).get(`/api/pot/${id}`)).status).toBe(404);
  });

  it('returns 400 for a malformed UUID', async () => {
    expect((await request(app).get('/api/pot/not-a-uuid')).status).toBe(400);
  });
});

describe('0.5 security headers', () => {
  it('sets CSP and other helmet headers, hides x-powered-by', async () => {
    const res = await request(app).get('/api/pot/not-a-uuid');
    const csp = res.headers['content-security-policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain('https://api.emailjs.com');
    expect(csp).toContain('https://fonts.gstatic.com');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('unknown /api route returns JSON 404', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
