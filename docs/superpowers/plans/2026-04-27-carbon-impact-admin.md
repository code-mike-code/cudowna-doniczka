# Carbon Impact Section + Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CO2 impact tracking to the site — public section on homepage, per-pot NFC scan landing page at `/pot/:uuid`, and admin panel for registering pots and writing NFC tags.

**Architecture:** Express.js backend in `/server` (port 3001) with MySQL via mysql2. Frontend calls `/api/*` — proxied through Vite in dev, same-origin in prod (Express serves `dist/`). Single admin via env var password + JWT. `CarbonImpactSection` is dual-mode: static example on homepage, real pot data on `/pot/:uuid`.

**Tech Stack:** React 18 + TypeScript + Tailwind + shadcn/ui (frontend), Express.js + mysql2 + jsonwebtoken + uuid (backend), Web NFC API (Chrome Android only)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `server/package.json` | Create | Backend dependencies |
| `server/index.js` | Create | Express app entry, port 3001, serves `dist/` in prod |
| `server/db.js` | Create | mysql2 connection pool |
| `server/middleware/auth.js` | Create | JWT verify middleware |
| `server/routes/admin.js` | Create | POST /api/admin/login + POST /api/admin/register-pot |
| `server/routes/pot.js` | Create | GET /api/pot/:uuid |
| `server/db-setup.sql` | Create | CREATE TABLE pots |
| `src/lib/carbonCalculator.ts` | Create | Pure CO2 calculation functions |
| `src/lib/carbonCalculator.test.ts` | Create | Vitest unit tests |
| `src/components/CarbonImpactSection.tsx` | Create | Dual-mode CO2 impact display |
| `src/pages/PotPage.tsx` | Create | `/pot/:uuid` — fetch + display real pot data |
| `src/pages/AdminPage.tsx` | Create | `/admin` — login + register pot + NFC write |
| `vite.config.ts` | Modify | Add `/api` proxy → localhost:3001 |
| `src/App.tsx` | Modify | Add `/pot/:uuid` and `/admin` routes |
| `src/pages/Index.tsx` | Modify | Add `<CarbonImpactSection />` after `<AboutProduct />` |
| `src/components/Footer.tsx` | Modify | Add "Panel administracyjny" link |
| `.env` | Modify | Add DB/JWT/admin vars |
| `.env.example` | Modify | Document new vars |

---

## Task 1: Environment & Database Setup

**Files:**
- Modify: `.env`
- Modify: `.env.example`
- Create: `server/db-setup.sql`

- [ ] **Step 1: Add env vars to `.env`**

Append to the end of `.env`:
```
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=cudowna_doniczka
JWT_SECRET=
ADMIN_PASSWORD=
NODE_ENV=development
```

- [ ] **Step 2: Document in `.env.example`**

Read the current `.env.example`, then append:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=cudowna_doniczka
JWT_SECRET=minimum_32_chars_random_string
ADMIN_PASSWORD=your_admin_password
NODE_ENV=development
```

- [ ] **Step 3: Create DB migration file**

Create `server/db-setup.sql`:
```sql
CREATE TABLE IF NOT EXISTS pots (
  id              VARCHAR(36)           PRIMARY KEY,
  serial_number   VARCHAR(50)           NOT NULL UNIQUE,
  mass_kg         DECIMAL(4,2)          NOT NULL,
  model_type      ENUM('S', 'M', 'L')   NOT NULL,
  color           VARCHAR(50)           NOT NULL,
  production_date DATE                  NOT NULL
);
```

- [ ] **Step 4: Run the migration on your MySQL server**

```bash
mysql -u YOUR_USER -p YOUR_DB_NAME < server/db-setup.sql
```

Expected: no errors, `pots` table created.

- [ ] **Step 5: Fill in `.env` credentials**

Open `.env` and fill in `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET` (min 32 chars), `ADMIN_PASSWORD`.

- [ ] **Step 6: Commit**

```bash
git add server/db-setup.sql .env.example
git commit -m "chore: add db migration and env vars for carbon impact feature"
```

---

## Task 2: Carbon Calculator

**Files:**
- Create: `src/lib/carbonCalculator.ts`
- Create: `src/lib/carbonCalculator.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `src/lib/carbonCalculator.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  getDaysActive,
  totalCO2g,
  treeEquivalent,
  progressPercent,
  MAX_ACTIVE_DAYS,
  ABSORPTION_RATE_G,
  TREE_DAILY_G,
} from './carbonCalculator';

describe('getDaysActive', () => {
  it('returns 0 for today as production date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getDaysActive(today)).toBe(0);
  });

  it('returns correct days for a past date', () => {
    const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(pastDate)).toBe(10);
  });

  it('caps at MAX_ACTIVE_DAYS (250) for old pots', () => {
    const oldDate = new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(oldDate)).toBe(MAX_ACTIVE_DAYS);
  });

  it('returns 0 for future production date', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    expect(getDaysActive(futureDate)).toBe(0);
  });
});

describe('totalCO2g', () => {
  it('calculates correctly for M pot at day 125', () => {
    // 1.2 kg * 1.3 g/kg/day * 125 days = 195g
    expect(totalCO2g(1.2, 125)).toBeCloseTo(195, 1);
  });

  it('returns 0 for day 0', () => {
    expect(totalCO2g(1.2, 0)).toBe(0);
  });

  it('calculates correctly for S pot at day 250', () => {
    // 0.45 * 1.3 * 250 = 146.25g
    expect(totalCO2g(0.45, 250)).toBeCloseTo(146.25, 2);
  });

  it('uses ABSORPTION_RATE_G constant', () => {
    expect(totalCO2g(1, 1)).toBeCloseTo(ABSORPTION_RATE_G, 5);
  });
});

describe('treeEquivalent', () => {
  it('returns 1 for exactly TREE_DAILY_G grams', () => {
    expect(treeEquivalent(TREE_DAILY_G)).toBeCloseTo(1, 5);
  });

  it('returns 0 for 0 grams', () => {
    expect(treeEquivalent(0)).toBe(0);
  });

  it('calculates fraction correctly', () => {
    expect(treeEquivalent(30.135)).toBeCloseTo(0.5, 2);
  });
});

describe('progressPercent', () => {
  it('returns 50 for day 125', () => {
    expect(progressPercent(125)).toBe(50);
  });

  it('returns 100 for day 250', () => {
    expect(progressPercent(250)).toBe(100);
  });

  it('returns 0 for day 0', () => {
    expect(progressPercent(0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --run src/lib/carbonCalculator.test.ts
```

Expected: FAIL — `Cannot find module './carbonCalculator'`

- [ ] **Step 3: Implement the calculator**

Create `src/lib/carbonCalculator.ts`:
```typescript
export const ABSORPTION_RATE_G = 1.3;
export const MAX_ACTIVE_DAYS = 250;
export const TREE_DAILY_G = 60.27;

export function getDaysActive(productionDate: string): number {
  const prod = new Date(productionDate);
  const now = new Date();
  const diffMs = now.getTime() - prod.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(days, 0), MAX_ACTIVE_DAYS);
}

export function totalCO2g(massKg: number, days: number): number {
  return massKg * ABSORPTION_RATE_G * days;
}

export function treeEquivalent(co2g: number): number {
  return co2g / TREE_DAILY_G;
}

export function progressPercent(days: number): number {
  return (days / MAX_ACTIVE_DAYS) * 100;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --run src/lib/carbonCalculator.test.ts
```

Expected: PASS — 12 tests passed

- [ ] **Step 5: Commit**

```bash
git add src/lib/carbonCalculator.ts src/lib/carbonCalculator.test.ts
git commit -m "feat: add carbon calculator with unit tests"
```

---

## Task 3: Backend Scaffolding

**Files:**
- Create: `server/package.json`
- Create: `server/db.js`
- Create: `server/index.js`

- [ ] **Step 1: Create `server/package.json`**

```json
{
  "name": "cudowna-doniczka-server",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.9.4",
    "uuid": "^9.0.1"
  }
}
```

- [ ] **Step 2: Install backend dependencies**

```bash
cd server && npm install && cd ..
```

Expected: `node_modules/` created in `server/`

- [ ] **Step 3: Create `server/db.js`**

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,   // DATE columns return 'YYYY-MM-DD' string, not Date object
});

module.exports = pool;
```

- [ ] **Step 4: Create `server/index.js`**

```javascript
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/admin');
const potRoutes = require('./routes/pot');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
}));

app.use('/api/admin', adminRoutes);
app.use('/api/pot', potRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 5: Commit**

```bash
git add server/
git commit -m "feat: scaffold express backend with db pool"
```

---

## Task 4: Auth Middleware + Login Route

**Files:**
- Create: `server/middleware/auth.js`
- Create: `server/routes/admin.js` (login endpoint only)

- [ ] **Step 1: Create `server/middleware/auth.js`**

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7);
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
```

- [ ] **Step 2: Create `server/routes/admin.js` with login route**

```javascript
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

module.exports = router;
```

- [ ] **Step 3: Start the server and test login manually**

In terminal 1:
```bash
cd server && npm run dev
```

In terminal 2 (replace YOUR_PASSWORD with value from `.env`):
```bash
curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_PASSWORD"}' | head -c 200
```

Expected: `{"token":"eyJ..."}` (JWT string)

```bash
curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}' 
```

Expected: `{"error":"Invalid password"}` with HTTP 401

- [ ] **Step 4: Commit**

```bash
git add server/middleware/auth.js server/routes/admin.js
git commit -m "feat: add admin login with JWT and timing-safe password check"
```

---

## Task 5: Register-Pot Route

**Files:**
- Modify: `server/routes/admin.js` (add register-pot before `module.exports`)

- [ ] **Step 1: Add register-pot route to `server/routes/admin.js`**

Insert before the final `module.exports = router;` line:

```javascript
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
```

- [ ] **Step 2: Test register-pot manually**

First get a token:
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_PASSWORD"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo $TOKEN
```

Then register a pot:
```bash
curl -s -X POST http://localhost:3001/api/admin/register-pot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"model_type":"M","color":"naturalny"}'
```

Expected:
```json
{"id":"xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx","serial_number":"CD-M-20260427-ab12","nfc_url":"https://cudownadoniczka.pl/pot/xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx"}
```

Test without token:
```bash
curl -s -X POST http://localhost:3001/api/admin/register-pot \
  -H "Content-Type: application/json" \
  -d '{"model_type":"M","color":"czarny"}'
```

Expected: `{"error":"Unauthorized"}` HTTP 401

- [ ] **Step 3: Commit**

```bash
git add server/routes/admin.js
git commit -m "feat: add register-pot route with JWT protection"
```

---

## Task 6: Pot GET Route

**Files:**
- Create: `server/routes/pot.js`

- [ ] **Step 1: Create `server/routes/pot.js`**

```javascript
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
    // mass_kg comes as string from MySQL DECIMAL — cast to number for frontend
    res.json({ ...row, mass_kg: parseFloat(row.mass_kg) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Test pot GET manually**

Use the `id` from the pot registered in Task 5:
```bash
curl -s http://localhost:3001/api/pot/REPLACE_WITH_UUID_FROM_TASK5
```

Expected:
```json
{"id":"...","serial_number":"CD-M-...","mass_kg":"1.20","model_type":"M","color":"naturalny","production_date":"2026-04-27"}
```

Test 404:
```bash
curl -s http://localhost:3001/api/pot/00000000-0000-4000-8000-000000000000
```

Expected: `{"error":"Pot not found"}` HTTP 404

Test invalid UUID:
```bash
curl -s http://localhost:3001/api/pot/not-a-uuid
```

Expected: `{"error":"Invalid UUID format"}` HTTP 400

- [ ] **Step 3: Commit**

```bash
git add server/routes/pot.js
git commit -m "feat: add public GET /api/pot/:uuid route"
```

---

## Task 7: Vite Dev Proxy

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Add API proxy to `vite.config.ts`**

The current `server` block:
```typescript
server: {
  host: "::",
  port: 8080
},
```

Replace with:
```typescript
server: {
  host: "::",
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

- [ ] **Step 2: Verify proxy works**

With the Express server running on port 3001, start Vite dev:
```bash
npm run dev
```

Test in browser or curl:
```bash
curl -s http://localhost:8080/api/pot/00000000-0000-4000-8000-000000000000
```

Expected: `{"error":"Pot not found"}` — response comes from Express via Vite proxy

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat: add vite proxy for /api to express backend"
```

---

## Task 8: CarbonImpactSection Component

**Files:**
- Create: `src/components/CarbonImpactSection.tsx`

- [ ] **Step 1: Create `src/components/CarbonImpactSection.tsx`**

```typescript
import { Leaf, TreePine, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  getDaysActive,
  totalCO2g,
  treeEquivalent,
  progressPercent,
} from '@/lib/carbonCalculator';

export interface PotData {
  mass_kg: number;
  model_type: 'S' | 'M' | 'L';
  color: string;
  production_date: string;
}

interface Props {
  potData?: PotData;
}

const MODEL_NAMES: Record<'S' | 'M' | 'L', string> = {
  S: 'Mała (S)',
  M: 'Średnia (M)',
  L: 'Duża (L)',
};

const EXAMPLE_DATA: PotData = {
  mass_kg: 1.2,
  model_type: 'M',
  color: 'naturalny',
  production_date: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
};

const CarbonImpactSection: React.FC<Props> = ({ potData }) => {
  const isExample = !potData;
  const data = potData ?? EXAMPLE_DATA;

  const days = getDaysActive(data.production_date);
  const co2g = totalCO2g(data.mass_kg, days);
  const co2Display =
    co2g >= 1000
      ? `${(co2g / 1000).toFixed(2)} kg`
      : `${co2g.toFixed(0)} g`;
  const trees = treeEquivalent(co2g);
  const progress = progressPercent(days);

  const { isVisible, ref } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  return (
    <section id="carbon-impact" className="py-20 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Wpływ na Klimat
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            {isExample
              ? 'Przykład dla typowej Cudownej Doniczki M po 125 dniach od produkcji.'
              : `Twoja doniczka ${MODEL_NAMES[data.model_type]} w kolorze ${data.color}.`}
          </p>
          {isExample && (
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Przykład
            </span>
          )}
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{co2Display}</p>
            <p className="text-sm text-muted-foreground">pochłoniętego CO₂</p>
          </div>

          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {days} / 250
            </p>
            <p className="text-sm text-muted-foreground mb-2">aktywnych dni</p>
            <Progress value={progress} className="h-2" />
          </div>

          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TreePine className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {trees.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              dni pracy dorosłego drzewa
            </p>
          </div>
        </div>

        {isExample && (
          <p className="text-center text-xs text-muted-foreground mt-8">
            Zeskanuj chip NFC na swojej doniczce, aby zobaczyć swój indywidualny wpływ.
          </p>
        )}
      </div>
    </section>
  );
};

export default CarbonImpactSection;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CarbonImpactSection.tsx
git commit -m "feat: add CarbonImpactSection dual-mode component"
```

---

## Task 9: PotPage

**Files:**
- Create: `src/pages/PotPage.tsx`

- [ ] **Step 1: Create `src/pages/PotPage.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarbonImpactSection, { PotData } from '@/components/CarbonImpactSection';

type Status = 'loading' | 'ok' | 'notfound' | 'error';

interface PotResponse extends PotData {
  id: string;
  serial_number: string;
}

const PotPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [pot, setPot] = useState<PotResponse | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!uuid) { setStatus('notfound'); return; }

    fetch(`/api/pot/${uuid}`)
      .then((r) => {
        if (r.status === 404) { setStatus('notfound'); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data) { setPot(data); setStatus('ok'); }
      })
      .catch(() => setStatus('error'));
  }, [uuid]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {status === 'loading' && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {(status === 'error' || status === 'notfound') && (
          <div className="text-center py-32 px-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {status === 'notfound'
                ? 'Doniczka nie znaleziona'
                : 'Błąd połączenia'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {status === 'notfound'
                ? 'Ta doniczka nie istnieje w naszej bazie danych.'
                : 'Nie można pobrać danych. Spróbuj ponownie.'}
            </p>
            <Link to="/" className="text-primary hover:underline">
              Wróć na stronę główną
            </Link>
          </div>
        )}

        {status === 'ok' && pot && (
          <>
            <div className="text-center py-6 px-4">
              <p className="text-sm text-muted-foreground">
                Nr seryjny: {pot.serial_number}
              </p>
            </div>
            <CarbonImpactSection potData={pot} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PotPage;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/PotPage.tsx
git commit -m "feat: add PotPage for NFC scan landing at /pot/:uuid"
```

---

## Task 10: AdminPage

**Files:**
- Create: `src/pages/AdminPage.tsx`

- [ ] **Step 1: Create `src/pages/AdminPage.tsx`**

```typescript
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NfcStatus = 'idle' | 'writing' | 'success' | 'error';

interface RegisterResult {
  id: string;
  serial_number: string;
  nfc_url: string;
}

const AdminPage = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('admin_token')
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [model, setModel] = useState<'S' | 'M' | 'L'>('M');
  const [color, setColor] = useState('');
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [registerError, setRegisterError] = useState('');
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('idle');

  const nfcSupported = 'NDEFReader' in window;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        const { token: t } = await r.json();
        localStorage.setItem('admin_token', t);
        setToken(t);
        setPassword('');
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
    } catch {
      setLoginError('Błąd połączenia z serwerem');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!color.trim()) { setRegisterError('Podaj kolor'); return; }
    setRegistering(true);
    setRegisterError('');
    setResult(null);
    setNfcStatus('idle');
    try {
      const r = await fetch('/api/admin/register-pot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ model_type: model, color }),
      });
      if (r.ok) {
        setResult(await r.json());
        setColor('');
      } else if (r.status === 401) {
        localStorage.removeItem('admin_token');
        setToken(null);
      } else {
        setRegisterError('Błąd serwera. Spróbuj ponownie.');
      }
    } catch {
      setRegisterError('Błąd połączenia z serwerem');
    } finally {
      setRegistering(false);
    }
  };

  const handleNfcWrite = async () => {
    if (!result) return;
    setNfcStatus('writing');
    try {
      // @ts-ignore — Web NFC API not in TS lib yet
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: 'url', data: result.nfc_url }],
      });
      setNfcStatus('success');
    } catch {
      setNfcStatus('error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Panel Administracyjny
        </h1>

        {!token ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-destructive">{loginError}</p>
            )}
            <Button type="submit" className="w-full">
              Zaloguj
            </Button>
          </form>
        ) : (
          <div className="space-y-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={model}
                  onValueChange={(v) => setModel(v as 'S' | 'M' | 'L')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S — 0.45 kg</SelectItem>
                    <SelectItem value="M">M — 1.20 kg</SelectItem>
                    <SelectItem value="L">L — 1.80 kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Kolor</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="np. naturalny, czarny, biały"
                  required
                />
              </div>

              {registerError && (
                <p className="text-sm text-destructive">{registerError}</p>
              )}

              <Button type="submit" disabled={registering} className="w-full">
                {registering ? 'Rejestrowanie...' : 'Zarejestruj doniczkę'}
              </Button>
            </form>

            {result && (
              <div className="bg-accent/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Doniczka zarejestrowana
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  UUID: {result.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Nr seryjny: {result.serial_number}
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  URL: {result.nfc_url}
                </p>

                {nfcSupported ? (
                  <Button
                    onClick={handleNfcWrite}
                    disabled={
                      nfcStatus === 'writing' || nfcStatus === 'success'
                    }
                    variant="outline"
                    className="w-full"
                  >
                    {nfcStatus === 'idle' && 'Zapisz na NFC'}
                    {nfcStatus === 'writing' && 'Zbliż telefon do chipa...'}
                    {nfcStatus === 'success' && 'Zapisano ✓'}
                    {nfcStatus === 'error' && 'Błąd — spróbuj ponownie'}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Zapis NFC wymaga Chrome na Androidzie.
                  </p>
                )}
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Wyloguj
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminPage.tsx
git commit -m "feat: add admin panel with pot registration and NFC write"
```

---

## Task 11: Wire Everything Together

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Add routes to `src/App.tsx`**

After the existing lazy imports (line 16 in current file), add:
```typescript
const PotPage = lazy(() => import("./pages/PotPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
```

Inside `<Routes>`, before the catch-all `*` route, add:
```tsx
<Route path="/pot/:uuid" element={<PotPage />} />
<Route path="/admin" element={<AdminPage />} />
```

- [ ] **Step 2: Add CarbonImpactSection to `src/pages/Index.tsx`**

Add import after existing imports:
```typescript
import CarbonImpactSection from '@/components/CarbonImpactSection';
```

In JSX, add `<CarbonImpactSection />` directly after `<AboutProduct />`:
```tsx
<AboutProduct />
<CarbonImpactSection />
<AboutUs />
```

- [ ] **Step 3: Add admin link to `src/components/Footer.tsx`**

In the `legalLinks` array, add entry after `Polityka Prywatności`:
```typescript
{ name: 'Panel administracyjny', href: '/admin' },
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 5: Run full test suite**

```bash
npm test -- --run
```

Expected: all existing tests pass + 12 new carbonCalculator tests pass

- [ ] **Step 6: Manual smoke test in browser**

With both servers running (`npm run dev` + `cd server && npm run dev`):

1. Open `http://localhost:8080` — verify `CarbonImpactSection` appears after `AboutProduct` with "Przykład" badge
2. Open `http://localhost:8080/admin` — verify login form appears
3. Login with admin password — verify registration form appears
4. Register a pot — verify UUID + serial number appear
5. Open `http://localhost:8080/pot/UUID_FROM_STEP4` — verify real pot data appears with no "Przykład" badge
6. Open `http://localhost:8080/pot/00000000-0000-4000-8000-000000000000` — verify "Doniczka nie znaleziona" message
7. Check footer — verify "Panel administracyjny" link visible

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/pages/Index.tsx src/components/Footer.tsx
git commit -m "feat: wire carbon impact section, pot page, and admin panel into site"
```

---

## Post-Implementation Notes

**Running locally:**
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
npm run dev
```

**Production build + start:**
```bash
npm run build
NODE_ENV=production node server/index.js
```

Express serves `dist/` statically and handles `/api/*` — single process, single port.

**NFC writing:** Only works on Android + Chrome. On desktop/iOS, the admin panel shows an info message instead of the NFC button.
