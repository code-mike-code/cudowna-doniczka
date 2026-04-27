# Cudowna Doniczka

Promotional website for eco-friendly plant pots made from Hemp Mineral Composite (HMC). Combines modern design, ecology, and technology — showcasing product benefits and building a brand community.

## About

"Cudowna Doniczka" goes beyond selling a product. It's an educational and community platform inspiring sustainable living. Each physical pot carries an NFC chip that links to its unique product page with carbon impact data.

**Features:**
- **Home:** Animated Hero section with interactive cursor, product showcase, carbon impact calculator, blog preview, events preview.
- **Events:** Coverage and announcements for workshops and fairs.
- **Blog:** Educational articles on ecology, HMC, and plant care.
- **Pot Page (`/pot/:uuid`):** NFC scan landing page — shows pot details (model, color, mass, serial number, production date) fetched from backend.
- **Carbon Impact Section:** Dual-mode component showing CO₂ sequestration for individual pots and community totals.
- **Admin Panel (`/admin`):** Password-protected panel for registering new pots and writing NFC chip URLs.
- **Contact Form:** Integrated with EmailJS.
- **Responsive:** Full mobile support (RWD).

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Styles | Tailwind CSS |
| UI Components | shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| Server State | TanStack Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Email | EmailJS |
| Testing | Vitest |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2) |
| Auth | JWT (jsonwebtoken) |
| Other | uuid, dotenv, cors |

## Requirements

- Node.js v18+
- npm v9+
- MySQL v8+

## Setup

### 1. Clone repo

```bash
git clone <REPO_URL>
cd cudowna-doniczka
```

### 2. Configure env vars

Create `.env` from `.env.example`:

```env
# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Backend
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=cudowna_doniczka
JWT_SECRET=minimum_32_chars_random_string
ADMIN_PASSWORD=your_admin_password
NODE_ENV=development
```

### 3. Init database

```bash
mysql -u your_db_user -p cudowna_doniczka < server/db-setup.sql
```

### 4. Install deps

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 5. Start dev servers

Terminal 1 — backend:
```bash
cd server && npm run dev
```

Terminal 2 — frontend:
```bash
npm run dev
```

Frontend at `http://localhost:8080`. Vite proxies `/api` → `http://localhost:3001`.

## Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npx tsc -b` | TypeScript type check |

### Backend

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start with file-watch (node --watch) |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | — | Returns JWT (8h) |
| `POST` | `/api/admin/register-pot` | Bearer JWT | Register new pot, get UUID + serial + NFC URL |
| `GET` | `/api/pot/:uuid` | — | Fetch pot details by UUID |

### Serial number format

`CD-{S|M|L}-{YYYYMMDD}-{4 hex chars}` — e.g. `CD-M-20260427-a3f1`

### Mass by model

| Model | Mass |
|---|---|
| S | 0.45 kg |
| M | 1.20 kg |
| L | 1.80 kg |

## Project Structure

```
src/
├── components/         # React components (ui/ + feature-specific)
│   └── seo/            # SEO-related components
├── hooks/              # Custom hooks
├── lib/                # Utilities, types, data
│   └── carbonCalculator.ts
├── pages/              # Route views
│   ├── Index.tsx        # Home
│   ├── Events.tsx
│   ├── Event.tsx        # Single event
│   ├── Blog.tsx
│   ├── Article.tsx      # Single article
│   ├── PotPage.tsx      # /pot/:uuid — NFC landing
│   ├── AdminPage.tsx    # /admin — pot registration
│   └── NotFound.tsx
└── test/               # Test setup
public/                 # Static assets
server/
├── index.js            # Express entry point
├── db.js               # MySQL connection pool
├── db-setup.sql        # Schema
├── middleware/
│   └── auth.js         # JWT middleware
└── routes/
    ├── admin.js        # POST /login, POST /register-pot
    └── pot.js          # GET /:uuid
scripts/                # Image optimization scripts
```

## Production

In production (`NODE_ENV=production`) the Express server serves the Vite `dist/` build. CORS restricted to same-origin.

```bash
npm run build
cd server && npm start
```

## Notable Decisions

- **Lazy loading** on all routes for performance.
- **React.StrictMode** enabled.
- **EmailJS credentials** in env vars — not hardcoded.
- **Scroll behavior** managed with `useLayoutEffect`.
- **Timing-safe comparison** for admin password to prevent timing attacks.
- **UUID v4** as primary key for pots — used directly in NFC URLs.
- **Startup validation** — server exits immediately on missing required env vars.
