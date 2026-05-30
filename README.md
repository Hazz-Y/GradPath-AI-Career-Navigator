<div align="center">

# GradPath AI — Career Navigator

**AI-first study abroad platform with conversational university matching, loan advisory, and SOP generation — powered by Groq streaming inference on Llama 3.3 70B**

![React 19](https://img.shields.io/badge/React-19-4F46E5?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-7C3AED?style=flat-square&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F59E0B?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3B82F6?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-10B981?style=flat-square&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)
![Hackathon](https://img.shields.io/badge/Built_for-TenzorX_2025-F59E0B?style=flat-square)

</div>

---

## The Problem

The study abroad process for Indian students is fragmented across dozens of disconnected tools — university shortlisting, loan comparison, SOP writing, timeline planning — each requiring separate research, accounts, and manual effort. There's no unified system that takes a student's profile and delivers end-to-end guidance in a single session.

GradPath AI consolidates four computation engines behind a single conversational interface, with Groq SDK streaming inference on Llama 3.3 70B enabling real-time SOP generation and multi-turn advisory. Built for TenzorX Hackathon 2025 and deployed as a split-stack application on Vercel (frontend) and Render (backend).

---

## What This Does

A full-stack intelligent platform that combines **university matching**, **loan advisory**, **SOP generation**, and **gamified profile scoring** into a conversational experience.

- **55+ university programs** across 11 countries indexed and queryable via cosine similarity
- **Real-time SOP generation** using chunked HTTP streaming from Groq SDK
- **Loan eligibility gating** with EMI simulation and break-even analysis
- **10-year ROI projection** for salary curves by field and geography
- **Dream Score** — gamified readiness metric (0–1000) across five weighted pillars

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Frontend — React 19 / Vite"]
        UI["Conversational UI"]
        DASH["Dashboard Components"]
        STREAM["Streaming Response Handler"]
    end

    subgraph Server["Backend — Express.js / Node.js"]
        API["REST API Router"]
        
        subgraph Engines["Computation Engines"]
            SCORE["ScoreEngine<br/>Dream Score (0-1000)<br/>5 weighted pillars"]
            REC["RecEngine<br/>Cosine Similarity<br/>55+ programs · 11 countries"]
            LOAN["LoanEngine<br/>NBFC eligibility rules<br/>EMI + interest model"]
            ROI["ROIEngine<br/>10-year salary curves<br/>break-even analysis"]
        end

        GROQ["Groq SDK<br/>Llama 3.3 70B<br/>Streaming inference"]
    end

    subgraph Data["Data Layer"]
        SUPA["Supabase<br/>PostgreSQL"]
        MOCK["Mock Data Fallback"]
    end

    UI -->|HTTP / Streaming| API
    API -->|/api/dream-score| SCORE
    API -->|/api/pathfinder| REC
    API -->|/api/loan-oracle| LOAN
    API -->|/api/roi| ROI
    API -->|/api/score-booster| GROQ
    API -->|/api/loan-oracle/chat| GROQ
    GROQ -->|Chunked Transfer| STREAM
    API --> SUPA
    API -.->|Fallback| MOCK

    style Client fill:#1e1b4b,stroke:#4F46E5,color:#e0e7ff
    style Server fill:#1e1b4b,stroke:#3B82F6,color:#e0e7ff
    style Engines fill:#0f172a,stroke:#7C3AED,color:#e0e7ff
    style Data fill:#1e1b4b,stroke:#10B981,color:#e0e7ff
```

---

## Tech Stack

| Layer | Technology | Version | Role |
|:---|:---|:---|:---|
| **Frontend** | React | 19 | UI components, state management |
| **Bundler** | Vite | 8 | Fast HMR, build tooling |
| **Backend** | Express.js | 4.x | REST API, streaming response handler |
| **Runtime** | Node.js | 18+ | Server-side JavaScript execution |
| **LLM** | Groq SDK → Llama 3.3 70B | — | SOP generation, conversational loan advisory |
| **Database** | Supabase (PostgreSQL) | — | User profiles, session data (optional) |
| **Frontend Hosting** | Vercel | — | Edge-deployed frontend |
| **Backend Hosting** | Render | — | API server deployment |

---

## Feature Modules

| Module | What It Does | Under the Hood |
|:---|:---|:---|
| **PathFinder** | Profile-to-university matching | Cosine similarity over a 55-program dataset → Groq-powered admit-probability reasoning per match |
| **LoanOracle** | Multi-turn conversational loan advisor | Stateful sessions with in-memory storage → eligibility gating via `LoanEngine` → pre-filled confirmation flow |
| **ScoreBooster** | Live SOP generation with AI review | Groq SDK streaming (chunked HTTP transfer) → follow-up review returning structured feedback |
| **GrowthEngine** | Autonomous engagement loop | WhatsApp-style nudges, AI blog content, and real-time platform metrics |
| **Dream Score** | Gamified readiness metric (0–1000) | Computed across academic strength, financial readiness, profile completeness, target alignment, and application progress |
| **Referral System** | Score-based referral rewards | Unique code generation with progress tracking and score-linked bonuses |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API Key ([console.groq.com](https://console.groq.com))
- Supabase project (optional — falls back to mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hazz-Y/GradPath-AI-Career-Navigator.git
cd GradPath-AI-Career-Navigator

# Backend setup
cd server
npm install
cp .env.example .env
# Add your GROQ_API_KEY and SUPABASE_URL to .env

# Start the backend
npm run dev
# → http://localhost:3001

# Frontend setup (new terminal)
cd ../client
npm install

# Start the frontend
npm run dev
# → http://localhost:5173
```

### Environment Variables

| Variable | Required | Description |
|:---|:---|:---|
| `GROQ_API_KEY` | Yes | Groq API key for Llama 3.3 70B inference |
| `SUPABASE_URL` | Optional | Supabase project URL |
| `SUPABASE_ANON_KEY` | Optional | Supabase anonymous key |

---

## Project Structure

```
GradPath-AI-Career-Navigator/
├── client/                    # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/        # UI components per module
│   │   ├── pages/             # Route-level views
│   │   ├── services/          # API client + streaming handlers
│   │   └── utils/             # Scoring, formatting helpers
│   └── vite.config.js
├── server/                    # Express.js backend
│   ├── routes/                # API route handlers
│   ├── engines/               # ScoreEngine, RecEngine, LoanEngine, ROIEngine
│   ├── data/                  # University dataset (JSON), loan rules
│   ├── middleware/            # Auth, error handling, CORS
│   └── index.js
└── README.md
```

---

## Deployment

| Service | URL | Stack |
|:---|:---|:---|
| Frontend | [Vercel](https://vercel.com) | React 19 / Vite — Edge CDN |
| Backend | [Render](https://render.com) | Express.js — Managed Node.js |

Streaming responses from the Groq SDK are piped directly to the client via chunked HTTP transfer encoding, enabling real-time SOP generation and conversational output without buffering the full LLM response.

---

## License

MIT — see [LICENSE](LICENSE) for details.
