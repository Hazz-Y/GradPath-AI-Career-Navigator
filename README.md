# GradPath AI - AI-First Study Abroad Platform for Indian Students

A full-stack intelligent platform that combines university matching, loan advisory, SOP generation, and gamified profile scoring into a single conversational interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-deployed-46E3B7?style=flat-square&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Hackathon](https://img.shields.io/badge/Built_for-TenzorX_2025-gold?style=flat-square)

> The study abroad process for Indian students is fragmented across dozens of disconnected tools - university shortlisting, loan comparison, SOP writing, timeline planning - each requiring separate research and manual effort. GradPath AI unifies these into four computation engines behind a single conversational interface, powered by Groq SDK streaming inference on Llama 3.3 70B. The platform was built for the TenzorX Hackathon 2025 and is deployed as a split-stack application on Vercel (frontend) and Render (backend).

---

## Core Engines

| Engine | Responsibility | Method |
|---|---|---|
| `ScoreEngine` | Dream Score computation (0-1000) | 5 weighted pillars, rule-based scoring |
| `RecEngine` | University discovery and profile matching | Cosine similarity across 55+ programs, 11 countries |
| `LoanEngine` | Loan eligibility and EMI simulation | NBFC rule set, interest rate model, break-even calculator |
| `ROIEngine` | Return on investment projection | 10-year salary curve, break-even analysis |

## Feature Modules

| Module | Description |
|---|---|
| **PathFinder** | Profile-to-university matching engine using cosine similarity over a 55-program dataset, with Groq-powered admit-probability reasoning per match |
| **LoanOracle** | Stateful conversational loan advisor with in-memory session storage, eligibility gating via `LoanEngine`, multi-turn application flow, and pre-filled confirmation |
| **ScoreBooster** | Live SOP generation via Groq SDK streaming (chunked HTTP transfer), with follow-up AI review returning structured feedback |
| **GrowthEngine** | Autonomous engagement loop generating WhatsApp-style nudges, AI blog content, and real-time platform metrics |
| **Dream Score** | Gamified readiness metric (0-1000) computed across academic strength, financial readiness, profile completeness, target alignment, and application progress |
| **Referral System** | Unique referral code generation with score-based rewards and progress tracking |

## Architecture

```text
Client (React 19 / Vite)
      |
      | HTTP / streaming
      v
Express.js Server (Node.js)
      |
      |-- /api/pathfinder   --> RecEngine (cosine similarity, JSON dataset)
      |-- /api/dream-score  --> ScoreEngine (weighted pillars)
      |-- /api/loan-oracle  --> LoanEngine (eligibility rules, EMI calc)
      |-- /api/roi          --> ROIEngine (salary projection model)
      |-- /api/score-booster --> Groq SDK --> Llama 3.3 70B (streaming)
      |-- /api/loan-oracle/chat --> Groq SDK --> Llama 3.3 70B (streaming)
      |
      v
Supabase (PostgreSQL) - optional; app falls back to mock data if unconfigured
```

Streaming responses from the Groq SDK are piped directly to the client via chunked HTTP transfer encoding. This enables live SOP generation and conversational output in `LoanOracle` and `ScoreBooster` without polling or WebSocket overhead.

## Tech Stack

**Frontend** - React 19, Vite, React Router 7, Vanilla CSS (custom design system defined in `src/index.css` with CSS custom properties), deployed on Vercel.

**Backend** - Node.js, Express.js, Groq SDK (`llama-3.3-70b-versatile`), in-memory session store for `LoanOracle` conversations, deployed on Render. Optional: Supabase (PostgreSQL) via `@supabase/supabase-js`.

## Project Structure

```
gradpath-ai/
├── public/                     # Static assets (favicon, icons)
├── src/                        # React frontend (Vite entry)
│   ├── components/             # Reusable UI components (Navbar, Leaderboard, ScoreCard)
│   ├── lib/                    # Third-party client setup (Supabase)
│   ├── pages/                  # One file per route (10 pages)
│   ├── utils/                  # API client and pure utility functions
│   ├── App.jsx                 # Router + AppContext provider
│   ├── main.jsx                # ReactDOM entry point
│   └── index.css               # Design system (CSS custom properties, base styles)
├── server/                     # Express backend
│   ├── ai/                     # Groq SDK client (chatWithGroq, streamWithGroq)
│   ├── engines/                # Computation engines (Score, Rec, Loan, ROI)
│   ├── routes/                 # Route handlers (7 route files)
│   ├── data/                   # JSON datasets (universities, loanRules, salaryData)
│   ├── middleware/             # Express error handler
│   └── index.js                # Server entry point (env validation, CORS, route mounting)
├── .env.example                # Template for required environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite config with API proxy
└── vercel.json                 # Vercel SPA rewrite rules
```

## Quick Start

1. **Clone**
```bash
git clone https://github.com/Hazz-Y/GradPath-AI-Career-Navigator.git && cd GradPath-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Fill in the values (see Environment Variables below).

4. **Run development servers**
```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:3001` |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | API key for Groq inference. Obtain at [`console.groq.com`](https://console.groq.com). Server will exit on startup without this value. |
| `PORT` | No | Server port. Defaults to `3001`. |
| `FRONTEND_URL` | No | Production frontend URL, added to the CORS allow-list. |
| `VITE_API_URL` | No | Backend API base URL for the client. In development, Vite proxies `/api` requests automatically. |
| `VITE_SUPABASE_URL` | No | Supabase project URL. Optional - the app falls back to static mock data when not set. |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous key. Optional - required only if `VITE_SUPABASE_URL` is set. |

## Deployment

**Frontend - Vercel** - Connect the repository to a Vercel project. Set framework preset to Vite. Add all `VITE_`-prefixed environment variables in the Vercel dashboard. Set `VITE_API_URL` to the Render backend URL (e.g., `https://gradpath-api.onrender.com`).

**Backend - Render** - Connect the repository to a Render web service. Set the start command to `node server/index.js`. Add `GROQ_API_KEY`, `PORT`, and `FRONTEND_URL` in the Render dashboard. Note: in-memory `LoanOracle` sessions reset on Render's free-tier spin-down; see Known Limitations for the Redis upgrade path.

## Known Limitations

- **University dataset is static.** The current dataset covers 55 programs across 11 countries, stored as a JSON file in `server/data/universities.json`. A production version would require integration with a live database or third-party API (e.g., QS Rankings API, CollegeDunia).
- **Loan eligibility is rule-based.** `LoanEngine` uses a static NBFC rule set in `server/data/loanRules.json`, not connected to live lender APIs. Production integration would require partnerships with NBFCs (HDFC Credila, Prodigy Finance) and real-time rate feeds.
- **Conversation sessions are ephemeral.** `LoanOracle` chat sessions are stored in Node.js process memory and are lost on server restart. A Redis-backed session store (e.g., `connect-redis` with Upstash or AWS ElastiCache) would be required for production persistence.
- **Supabase is optional.** The leaderboard and user profile persistence depend on Supabase. When unconfigured, the app falls back to hardcoded mock data. No user authentication is implemented - production would require OAuth (Google, GitHub) via Supabase Auth.

## Roadmap

- [x] University matching engine (`RecEngine` with cosine similarity)
- [x] Loan eligibility engine (`LoanEngine` with NBFC rule set)
- [x] ROI projection engine (`ROIEngine` with 10-year salary model)
- [x] Dream Score system (5-pillar weighted scoring)
- [x] Live SOP generation with Groq SDK streaming
- [x] Referral system with score rewards
- [x] Supabase optional integration (leaderboard, profiles)
- [x] Vercel + Render split deployment
- [ ] Live NBFC API integration (HDFC Credila, Prodigy Finance)
- [ ] Redis session persistence (`connect-redis` + Upstash)
- [ ] Expanded university dataset (live database or API)
- [ ] Mobile-responsive UI polish (sub-640px breakpoints)
- [ ] OAuth authentication (Google, GitHub via Supabase Auth)
- [ ] Comparative university shortlist export (PDF)
- [ ] LLM fine-tuning on Indian student admission data

## License

This project is licensed under the [MIT License](LICENSE).
