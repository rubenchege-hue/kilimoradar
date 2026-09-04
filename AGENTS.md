# AGENTS.md — Kilimo Radar

> **World events, translated for Kenyan farmers.**
> Free marketplace + geopolitical intelligence for Kenyan smallholder farmers.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, standalone output) |
| Language | TypeScript 5 |
| Runtime | Bun |
| UI | React 19 + shadcn/ui (New York) + Tailwind CSS v4 |
| Database | Prisma 6 + SQLite (`db/custom.db`) |
| AI | OpenRouter API — `google/gemini-2.5-flash` (`src/lib/ai.ts`) |
| Web Search | DuckDuckGo HTML scraping (free, no key) (`src/lib/ai.ts`) |
| State | React Query 5 + manual useState |
| Icons | Lucide React |

---

## Project Structure

```
armers app/
├── .env                          # DATABASE_URL, OPENROUTER_API_KEY
├── Caddyfile                     # Reverse proxy: port 81 -> :3000
├── components.json               # shadcn/ui config
├── next.config.ts                # standalone, turbopack, ignoreBuildErrors
├── package.json
├── worklog.md                    # Build log
│
├── .zscripts/                    # Dev/deploy orchestration
│   ├── dev.sh                    # Local dev launcher
│   ├── build.sh                  # Full build + package
│   └── start.sh                  # Production launcher
│
├── db/
│   └── custom.db                 # SQLite database
│
├── prisma/
│   └── schema.prisma             # 4 models: Farmer, Buyer, Listing, BuyerRequest
│
├── scripts/
│   └── seed.ts                   # Seed: 10 listings + 8 buyer requests
│
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind v4, oklch green theme, ticker animation
│   │   ├── layout.tsx            # Root layout, Geist fonts, metadata
│   │   ├── page.tsx              # SPA: single route, useState view switching
│   │   └── api/
│   │       ├── route.ts          # GET /api — health check
│   │       ├── advisor/route.ts  # POST — AI chat (OpenRouter)
│   │       ├── news/route.ts     # GET — live news (DuckDuckGo)
│   │       ├── listings/route.ts # GET/POST — marketplace listings
│   │       ├── buyer-requests/route.ts # GET/POST — buyer requests
│   │       └── join/route.ts     # POST — farmer/buyer registration
│   │
│   ├── components/
│   │   ├── kilimo/               # App components
│   │   │   ├── home-view.tsx     # Landing page
│   │   │   ├── radar-view.tsx    # Geopolitical risk alerts + news
│   │   │   ├── markets-view.tsx  # Commodities + destination markets
│   │   │   ├── marketplace-view.tsx # Listings + buyer requests CRUD
│   │   │   ├── join-view.tsx     # Registration forms
│   │   │   ├── advisor-view.tsx  # AI chat interface
│   │   │   ├── header.tsx        # Sticky nav + mobile sheet
│   │   │   ├── footer.tsx        # Footer
│   │   │   ├── ticker.tsx        # Scrolling price ticker
│   │   │   └── sparkline.tsx     # SVG sparkline chart
│   │   └── ui/                   # 40 shadcn/ui components
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts         # < 768px media query
│   │   └── use-toast.ts          # Toast state manager
│   │
│   └── lib/
│       ├── ai.ts                 # OpenRouter chat + DuckDuckGo search
│       ├── data.ts               # Static intelligence (crops, alerts, markets)
│       ├── db.ts                 # Prisma client singleton
│       └── utils.ts              # cn() helper
│
└── tests/                        # Deploy shell scripts only
```

---

## Pages / Views (SPA — single route via `page.tsx`)

| View | Component | Description |
|------|-----------|-------------|
| `home` | `HomeView` | Hero, stats strip, commodity cards, how-it-works |
| `radar` | `RadarView` | Filterable geopolitical alerts + live news sidebar |
| `markets` | `MarketsView` | Export commodities + destination market requirements |
| `marketplace` | `MarketplaceView` | Farmer listings + buyer requests with CRUD dialogs |
| `join` | `JoinView` | Free farmer/buyer registration forms |
| `advisor` | `AdvisorView` | AI chat powered by OpenRouter (Gemini 2.5 Flash) |

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api` | Health check |
| `GET` | `/api/news` | Live news via DuckDuckGo scraping (30-min cache) |
| `POST` | `/api/advisor` | AI chat — sends last 8 messages to OpenRouter |
| `GET` | `/api/listings` | Fetch active produce listings (max 60) |
| `POST` | `/api/listings` | Create a new listing |
| `GET` | `/api/buyer-requests` | Fetch buyer requests (max 60) |
| `POST` | `/api/buyer-requests` | Create a new buyer request |
| `POST` | `/api/join` | Register as farmer or buyer (upsert) |

---

## Database Schema (Prisma/SQLite)

### Farmer
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `name` | String | |
| `email` | String | Unique |
| `phone` | String? | M-Pesa number |
| `county` | String | |
| `farmSizeAcres` | Float? | |
| `crops` | String | Comma-separated |
| `exportReady` | Boolean | Default false |
| `createdAt` | DateTime | |

### Buyer
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `name` | String | |
| `company` | String | |
| `email` | String | Unique |
| `country` | String | |
| `crops` | String | Comma-separated |
| `website` | String? | |
| `createdAt` | DateTime | |

### Listing
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `farmerName` | String | |
| `farmerContact` | String | |
| `county` | String | |
| `crop` | String | |
| `variety` | String? | |
| `quantity` | Float | |
| `unit` | String | |
| `price` | Float | |
| `currency` | String | Default "KES" |
| `certifications` | String? | |
| `description` | String? | |
| `harvestWindow` | String? | |
| `status` | String | Default "active" |
| `createdAt` | DateTime | |

### BuyerRequest
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `buyerName` | String | |
| `company` | String | |
| `country` | String | |
| `crop` | String | |
| `quantity` | String | Text |
| `targetPrice` | String | Text |
| `incoterm` | String | |
| `notes` | String? | |
| `createdAt` | DateTime | |

No relations between models. No auth/sessions.

---

## AI Configuration

**OpenRouter** (`src/lib/ai.ts`):
- Base URL: `https://openrouter.ai/api/v1`
- Model: `google/gemini-2.5-flash` (changeable in `ai.ts:18`)
- API key stored in `.env` as `OPENROUTER_API_KEY`
- Referer: `https://kilimoradar.com`

**Advisor system prompt** (`api/advisor/route.ts`):
- Detailed Kenya export profile (2024-2026)
- 7 geopolitical risk factors with specific data
- 7 response rules (simple English, concrete actions, KES currency, <250 words)

---

## Commands

```bash
bun install              # Install dependencies
bun run db:push          # Push Prisma schema to SQLite
bun run db:generate      # Generate Prisma client
bun run dev              # Dev server on port 3000
bun run build            # Production build (standalone)
bun run start            # Production server
bun run lint             # ESLint (currently very lenient)
```

---

## Key Files to Know

| File | Why it matters |
|------|----------------|
| `src/lib/ai.ts` | OpenRouter + DuckDuckGo integration — all AI lives here |
| `src/lib/data.ts` | All static intelligence data (crops, alerts, markets, counties) |
| `src/app/api/advisor/route.ts` | AI advisor with detailed system prompt |
| `src/app/api/news/route.ts` | Live news scraping with caching |
| `src/components/kilimo/marketplace-view.tsx` | Largest component (685 lines) — full CRUD |
| `prisma/schema.prisma` | Database schema |
| `.env` | API keys and database URL |

---

## Changelog

Track all changes to this project below. Newest first.

---

### [0.4.0] — 2026-09-04

#### Added
- **`src/app/api/weather/route.ts`** — New live weather intelligence endpoint. Uses `webSearch()` (DuckDuckGo) to pull real-time seasonal/weather/shipping signals for Kenya and key export markets (EU, UK, Netherlands, South Africa). 30-min cache (mirrors `/api/news`). Returns typed items grouped by `kind`: `growing` (Kenya conditions), `weather` (export-market weather), `shipping` (supply/disruption signal).
- **`src/lib/data.ts`** — Added **Herbs & Spices** as a new export commodity (rank 7; `$35M+`; rosemary/thyme/basil/mint/coriander/sage/oregano). Added individual herbs to `CROPS` dropdown and to highland county crop lists (Nyeri, Kirinyaga, Laikipia, Nakuru). Added "Fresh Herbs" to EU/UK/Netherlands market seasons.
- **`src/app/api/advisor/route.ts`** — Added Fresh Herbs to the Kenya export knowledge base.

#### Changed
- **`src/components/kilimo/weather-view.tsx`** — Added a "Live weather" tab to the Weather & Seasonal Intelligence view. The existing "Market seasons" tab keeps the 12-month demand calendar + ship/hold-off logic; the new "Live weather" tab fetches `/api/weather` via React Query and renders groupable real-time weather cards with source links and 30-min refresh note.
- **`src/components/kilimo/home-view.tsx`** — Home "What Kenya exports" grid now shows all commodities (including Herbs & Spices).

---

### [0.3.0] — 2026-08-31

#### Added
- **`src/lib/ai.ts`** — New shared AI helper module:
  - `chatCompletion()` — direct OpenRouter API calls (replaces ZAI SDK for chat)
  - `webSearch()` — free DuckDuckGo HTML scraping (replaces ZAI SDK web_search function)
- **`OPENROUTER_API_KEY`** environment variable in `.env`

#### Changed
- **`src/app/api/advisor/route.ts`** — Replaced `z-ai-web-dev-sdk` with direct OpenRouter calls via `chatCompletion()`. Model: `google/gemini-2.5-flash`. Removed `thinking` parameter (not supported by OpenRouter).
- **`src/app/api/news/route.ts`** — Replaced `z-ai-web-dev-sdk` web_search with DuckDuckGo HTML scraping via `webSearch()`. Same caching behavior (30-min TTL), same relevance scoring, same dedup logic.

#### Removed
- `z-ai-web-dev-sdk` dependency no longer used in any route (still in package.json — can be removed with `bun remove z-ai-web-dev-sdk`)

---

### [0.2.1] — Previous

_Initial documented version. See `worklog.md` for earlier build history._

---
