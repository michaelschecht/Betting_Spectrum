# Edge Spectrum 🟢

<p align="center">
  <a href="https://edge-spectrum.mikesailab.com">
    <img src="Images/Betting-Spectrum-Images/logos/dark/landscape-01-edge-gradient.svg" alt="Edge Spectrum - Expected Returns & Backtesting" width="720">
  </a>
</p>

<p align="center">
  <em>A unified multi-tool hub for sports betting, investing, gambling, and odds analysis. Compare expected returns across time horizons, backtest sports wagering strategies over 25 years of game data, and analyze edges.</em>
</p>

<p align="center">
  <a href="https://edge-spectrum.mikesailab.com"><img src="https://img.shields.io/badge/Live_Deployment-edge--spectrum.mikesailab.com-0284c7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Deployment"></a>
  <a href="Docs/change_log.md"><img src="https://img.shields.io/badge/Changelog-V19_Hub-8b5cf6?style=for-the-badge" alt="Changelog Version"></a>
  <a href="Docs/improvement_ideas.md"><img src="https://img.shields.io/badge/Roadmap-Ideas-10b981?style=for-the-badge" alt="Roadmap/Ideas"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-6.2-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4">
  <img src="https://img.shields.io/badge/Gemini_AI-API_v2-f59e0b?style=flat-square&logo=google&logoColor=white" alt="Gemini AI">
</p>

---

## 🚀 Overview

**Edge Spectrum** is an interactive playground for exploring mathematical edges. It brings together two core analytical applications:

1. **The Edge Spectrum Expected-Return Visualizer** (`/spectrum/`): Compares expected cumulative returns across **187 financial, investing, trading, and gambling activities** over **7 time horizons** (1 Bet to 10 Years), standardized using the **DU/CED framework**.
2. **The Backtest Simulator** (`/backtester`): Backtests sports wagering strategies across **25 years of MLB, NFL, NHL, and NBA games**, providing ROI diagnostics, equity curves, live ESPN scores, and an **AI Strategy Advisor** powered by Gemini.

---

## 🛠️ Applications & Features

### 1. The Edge Spectrum Expected-Return Visualizer
Served as a static page at `/spectrum/index.html` (internally routes to `public/spectrum/index.html`).

- **13 Asset/Bet Categories:** Stocks, Bonds, Real Estate, Crypto, Precious Metals, Collectibles, Insurance/Annuities, Sports Betting, Casino, Poker, Prediction Markets, and Lottery.
- **Universal DU/CED Framework:** Standardized expected returns via:
  $$\text{Expected Return} = \text{Decision Units (DU)} \times \text{Capital Exposure per Decision (CED)} \times \text{Edge}$$
- **Interactive Controls:** Toggle any combination of categories, adjust time horizons (1 Bet to 10 Years), switch overlays (Raw Returns, Fee-Adjusted, After-Tax).
- **Insights Overlays:**
  - **Addiction Risk Scoring:** Color-coded border alerts based on feedback loops and documentation of problem behavior.
  - **Ruin Calculator:** Projects hand/bet count until a $1,000 bankroll hits zero under negative-edge scenarios.
  - **Dollar Cost Comparison:** Translates percentages into actual dollar outcomes based on a $100/week contribution.

### 2. The Sports Wagering Backtester
Served inside the SPA React shell at `/backtester`.

- **25 Years of Historical Odds & Results:** In-depth database for MLB, NFL, NHL, and NBA.
- **Custom Strategy Builder:** Define wager filters based on home/away status, bookmaker odds (favorites/underdogs), and custom edge margins.
- **Position Sizing Models:** Standard flat betting vs. Kelly Criterion sizing (Full/Fractional).
- **Interactive Reports:** Analyze cumulative profit curves, win rates, ROI, Kelly diagnostics, and drawdowns.
- **Live Scoreboard integration:** Pulls real-time ESPN scoreboard updates.
- **Gemini AI Strategy Advisor:** Iterates on backtest results to suggest portfolio optimizations, staking alterations, or parameter tuning.

---

## 🏗️ Repository Architecture

```
edge-spectrum/
├── api/                   # Vercel serverless functions (backtest, ESPN, Gemini advisor)
├── public/
│   └── spectrum/          # The Edge Spectrum static Plotly visualization page
├── src/
│   ├── components/        # Backtester UI components (AiAdvisor, StrategyBuilder, ProfitChart, etc.)
│   ├── pages/
│   │   └── Home.tsx       # Landing page (dashboard tile grid mapping over tools.ts)
│   ├── server/            # Shared backend engines (backtest, ESPN score, Gemini prompt engines)
│   ├── App.tsx            # Main router shell & top-nav bar
│   ├── main.tsx           # React bootstrap
│   └── tools.ts           # The Registry — SINGLE SOURCE OF TRUTH for all tools
├── Docs/                  # In-depth logs, standardized analysis, and future ideas
├── Data/                  # Current and legacy edge datasets
├── server.ts              # Express local dev server (proxies/runs Vite + serverless local engines)
├── package.json           # Scripts & node dependencies
└── vercel.json            # Vercel configuration (SPA routing overrides & API serverless mappings)
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **Gemini API Key** (to enable the AI Advisor)

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 4. Running the Development Server
Starts the local Express server at `http://localhost:3001` with Vite middleware for React hot-reloading:
```bash
npm run dev
```

### 5. Build and Test Production Build
```bash
npm run build
npm start
```

---

## 🔌 Adding a New Tool

To add a new tool to the Edge Spectrum hub, follow the **three-step recipe**:

1. **Register the Tool:** Add an entry to the `TOOLS` array in [tools.ts](file:///D:/AI_Agents/Projects/Mikes_AI_Lab/Repos/Live_Apps/edge-spectrum/src/tools.ts):
   ```typescript
   {
     slug: 'my-new-tool',
     title: 'My Custom Tool',
     blurb: 'Brief description of the tool...',
     icon: MyIconName,
     href: '/my-new-tool', // or direct static path
     kind: 'route',        // 'route' | 'static' | 'external'
     status: 'live',       // 'live' | 'wip' | 'soon'
     accent: 'violet',     // Color scheme name
     tag: 'Utility'
   }
   ```
2. **Mount the Code:**
   - **`route` kind:** Build the page component under `src/pages/MyNewTool.tsx` and add its `<Route>` path inside [App.tsx](file:///D:/AI_Agents/Projects/Mikes_AI_Lab/Repos/Live_Apps/edge-spectrum/src/App.tsx).
   - **`static` kind:** Put your HTML/CSS/JS folder inside `public/my-new-tool/` and link its `href` to `/my-new-tool/index.html`.
   - **`external` kind:** Set `href` to the external destination URL (it will open in a new tab).
3. **Accent Setup:** Ensure the selected `accent` name exists inside the Tailwind literal mapping inside [Home.tsx](file:///D:/AI_Agents/Projects/Mikes_AI_Lab/Repos/Live_Apps/edge-spectrum/src/pages/Home.tsx) so the JIT compiler generates the appropriate borders and glows.

---

## 🚀 Deployment

The site is hosted on **Vercel** (`edge-spectrum.mikesailab.com`). 

- **Production branch:** `main` (automatically deployed on push/merge).
- **Local deployment check:** You can use the Vercel CLI to verify preview environments before merging:
  ```bash
  vercel deploy
  ```

---

## ⚠️ Disclaimer

Expected returns are modeled averages derived from historical market data, bookmaker averages, and retail-trader statistics. Individual results vary drastically due to short-term variance.

> [!CAUTION]
> **For educational purposes only.** This tool does not constitute investment or gambling advice.

---

<p align="center">
  <sub>Managed by Mike's AI Lab · Standalone HTML/CSS/Plotly viz and React/Vite dashboard</sub><br>
  <sub><b>GAMBLING: LINEAR DECAY · INVESTING: COMPOUND APPRECIATION</b></sub>
</p>
