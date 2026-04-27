# Cudowna Doniczka

Promotional website for eco-friendly plant pots made from Hemp Mineral Composite (HMC). Combines modern design, ecology, and technology — showcasing product benefits and building a brand community.

## About

"Cudowna Doniczka" goes beyond selling a product. It's an educational and community platform inspiring sustainable living.

**Features:**
- **Home:** Animated Hero section with interactive cursors.
- **Events:** Coverage and announcements for workshops and fairs.
- **Blog:** Educational articles on ecology, HMC, and plant care.
- **Contact Form:** Integrated with EmailJS.
- **Responsive:** Full mobile support (RWD).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
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

## Requirements

- Node.js v18+
- npm v9+

## Setup

1. **Clone repo:**
   ```bash
   git clone <REPO_URL>
   cd cudowna-doniczka
   ```

2. **Install deps:**
   ```bash
   npm install
   ```

3. **Configure env vars:**
   Create `.env` from `.env.example` and fill in EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start dev server:**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:8080`.

## Scripts

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

## Project Structure

```
src/
├── components/     # React components (ui/ + feature-specific)
│   └── seo/        # SEO-related components
├── hooks/          # Custom hooks
├── lib/            # Utilities, types, data (data.ts)
├── pages/          # Route views (Index, Events, Blog, Article, NotFound)
└── test/           # Test setup
public/             # Static assets
```

## Notable Decisions

- **Lazy loading** on all routes for performance.
- **React.StrictMode** enabled.
- **EmailJS credentials** in env vars — not hardcoded.
- **Scroll behavior** managed with `useLayoutEffect`.
