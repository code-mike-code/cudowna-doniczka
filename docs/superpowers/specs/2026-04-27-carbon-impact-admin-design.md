# Design: Carbon Impact Section + Admin Panel

**Date:** 2026-04-27  
**Project:** Cudowna Doniczka MVP  
**Stack:** React/Vite/TS (frontend) + Express/mysql2 (backend in `/server`)

---

## Scope

1. Backend API (`/server`) — Express.js + MySQL
2. `CarbonImpactSection` — public section on homepage + NFC scan landing page
3. `AdminPage` — protected pot registration + NFC writing
4. `PotPage` — per-pot CO2 impact page (`/pot/:uuid`)
5. Footer admin link
6. Routing additions

---

## Architecture

```
repo/
├── src/
│   ├── components/
│   │   └── CarbonImpactSection.tsx   # dual-mode: example | real pot data
│   ├── pages/
│   │   ├── PotPage.tsx               # /pot/:uuid — NFC scan landing
│   │   └── AdminPage.tsx             # /admin — login + register + NFC write
│   ├── lib/
│   │   └── carbonCalculator.ts       # pure calculation logic
│   ├── App.tsx                       # +2 routes
│   ├── pages/Index.tsx               # +CarbonImpactSection after AboutProduct
│   └── components/Footer.tsx         # +admin link
│
├── server/
│   ├── package.json                  # express, mysql2, jsonwebtoken, dotenv, cors, uuid
│   ├── index.js                      # Express entry, port 3001
│   ├── db.js                         # mysql2 createPool
│   ├── middleware/auth.js            # JWT verify middleware
│   └── routes/
│       ├── admin.js                  # POST /api/admin/login
│       │                             # POST /api/admin/register-pot (protected)
│       └── pot.js                    # GET /api/pot/:uuid (public)
│
├── vite.config.ts                    # +proxy /api → http://localhost:3001
└── .env                              # +DB_HOST, DB_USER, DB_PASS, DB_NAME,
                                      #  JWT_SECRET, ADMIN_PASSWORD
```

---

## Database

```sql
CREATE TABLE pots (
  id              VARCHAR(36)       PRIMARY KEY,
  serial_number   VARCHAR(50)       NOT NULL UNIQUE,
  mass_kg         DECIMAL(4,2)      NOT NULL,   -- 0.45 / 1.20 / 1.80
  model_type      ENUM('S','M','L') NOT NULL,
  color           VARCHAR(50)       NOT NULL,
  production_date DATE              NOT NULL
);
```

---

## Backend API

### `POST /api/admin/login`
- Body: `{ password: string }`
- Checks against `process.env.ADMIN_PASSWORD`
- Returns: `{ token: string }` (JWT, expires 8h) or 401

### `POST /api/admin/register-pot` (JWT protected)
- Body: `{ model_type: 'S'|'M'|'L', color: string }`
- Generates UUID v4 as `id`
- Derives `mass_kg` from model: S→0.45, M→1.20, L→1.80
- Generates `serial_number`: `CD-{MODEL}-{YYYYMMDD}-{4 random hex chars}`
- Sets `production_date` to current date
- Inserts into `pots`
- Returns: `{ id, serial_number, nfc_url: "https://cudownadoniczka.pl/pot/{id}" }`

### `GET /api/pot/:uuid` (public)
- Fetches pot by `id`
- Returns pot data or 404
- Response: `{ id, serial_number, mass_kg, model_type, color, production_date }`

---

## Carbon Calculator (`src/lib/carbonCalculator.ts`)

```ts
const ABSORPTION_RATE_G = 1.3;  // g CO2 per kg per day
const MAX_ACTIVE_DAYS = 250;
const TREE_DAILY_G = 60.27;     // g CO2 per day (adult tree)

getDaysActive(productionDate: string): number   // days since production, capped at 250
totalCO2g(massKg: number, days: number): number // massKg * 1.3 * days
treeEquivalent(co2g: number): number            // co2g / 60.27
progressPercent(days: number): number           // (days / 250) * 100
```

---

## Frontend Components

### `CarbonImpactSection`

Props:
```ts
interface Props {
  potData?: {
    mass_kg: number;
    model_type: 'S' | 'M' | 'L';
    color: string;
    production_date: string;
  };
}
```

- `potData` undefined → example mode (M, 1.2kg, day 125) with badge "Przykład"
- `potData` provided → real mode with pot model badge
- Displays: total CO2 (g→kg when >1000g), progress bar (days/250), tree equivalent
- Style: matches existing site — gradient `from-primary/5 via-accent/10`, card style from `AboutProduct` benefits grid

Position on homepage: after `<AboutProduct />`, before `<AboutUs />`

### `PotPage` (`/pot/:uuid`)

- On mount: `GET /api/pot/:uuid`
- Loading: spinner (Loader2, same as App.tsx fallback)
- Error/not found: friendly message with link back to homepage
- Success: renders full `CarbonImpactSection` with real pot data + pot serial number

### `AdminPage` (`/admin`)

Two-phase UI:

**Phase 1 — Login:**
- Password input + submit
- `POST /api/admin/login` → store JWT in `localStorage` under key `admin_token`
- On success: show Phase 2

**Phase 2 — Register pot:**
- Select: Model S / M / L
- Text input: color
- Button "Zarejestruj doniczkę" → `POST /api/admin/register-pot`
- On success: show UUID + NFC URL + "Zapisz na NFC" button
- NFC write: `NDEFReader.write({ records: [{ recordType: 'url', data: nfc_url }] })`
- NFC status states: idle | writing | success | error
- Only available on Android Chrome (Web NFC API); show info message on unsupported browsers

### `Footer` change

Add to "Pomoc i Informacje" `legalLinks` array:
```ts
{ name: 'Panel administracyjny', href: '/admin' }
```
Rendered with existing `text-muted-foreground hover:text-primary` styling — discreet.

---

## Routing (`App.tsx`)

```tsx
<Route path="/pot/:uuid" element={<PotPage />} />
<Route path="/admin" element={<AdminPage />} />
```

Both lazy-loaded.

---

## Vite Proxy (dev only)

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

---

## Deployment Strategy

**Dev:** Vite dev server (port 8080) + Express (port 3001). Vite proxy forwards `/api` → Express.

**Prod (HitMe.pl):** Express serves both:
- `GET /api/*` → API handlers
- `GET *` → `dist/index.html` (static SPA)

Frontend always calls `/api/*` — same origin in prod, proxied in dev. No `VITE_API_URL` needed.

---

## Environment Variables

`.env` additions:
```
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=cudowna_doniczka
JWT_SECRET=                     # min 32 chars
ADMIN_PASSWORD=
NODE_ENV=development            # set to production on server
```

---

## Security Notes

- JWT secret minimum 32 chars, stored in env
- Admin password hashed comparison via `crypto.timingSafeEqual`
- All admin routes check JWT on every request
- NFC write only possible after successful login
- No user PII stored — pots table has no user data

---

## Out of Scope

- Multi-admin / user accounts
- Pot editing / deletion via UI
- Push notifications
- Offline support / PWA
