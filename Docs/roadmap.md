# Edge Spectrum — Product Roadmap 🗺️

This document tracks the milestones, architectural upgrades, and feature additions for the **Edge Spectrum** multi-tool hub.

---

## 📋 Status Key
- 🟢 **Complete** — Implemented, tested, and live in production
- 🟡 **In Progress** — Active development
- ⚪ **Planned** — Backlogged for future phases

---

## 🗺️ Phases & Milestones

### Phase 1: Repo Consolidation & Standardization 🟢
*Focus on merging standalone applications and standardizing mathematical models.*

- [x] **Merge Repositories:** Integrate `Sports-Betting-Backtester` codebase directly into the `edge-spectrum` Vite React shell under `/backtester`.
- [x] **Serverless Integration:** Bridge dev-server Express routes and production Vercel serverless functions (`api/*`) to prevent code drift.
- [x] **Mathematical Standardization:** Replace hardcoded gambling models with the universal **DU/CED Framework** (Frequency $\times$ Exposure $\times$ Edge) for valid cross-asset comparison.
- [x] **Documentation & Cleanup:** Reorganize the repository structure, write a developer guide for adding tools, update global hosting inventory references, and rewrite the root `README.md`.

---

### Phase 2: Client-Side Simulation & React Integration ⚪
*Focus on performance optimization, UX unification, and resource efficiency.*

- [ ] **Client-Side Backtesting:** Shift the simulation engine (`runBacktest` from [dataGenerator.ts](file:///D:/AI_Agents/Projects/Mikes_AI_Lab/Repos/Live_Apps/edge-spectrum/src/dataGenerator.ts)) out of the `/api/backtest` serverless API and execute it directly on the client browser.
  - *Benefits:* Sub-millisecond execution times, zero server latency, and 100% offline capability.
- [ ] **React Port for the Plotly Viz:** Convert `public/spectrum/index.html` into a native React page component (`src/pages/Spectrum.tsx`) using `react-plotly.js` or directly wrapper-mounting.
  - *Benefits:* Integrates the page into client-side React routing, avoids page reloads, and shares the central header/navbar.
- [ ] **Code Splitting / Dynamic Imports:** Set up lazy loading for `/backtester` and `/spectrum` routes inside [App.tsx](file:///D:/AI_Agents/Projects/Mikes_AI_Lab/Repos/Live_Apps/edge-spectrum/src/App.tsx) to resolve Vite minification chunk warnings.
- [ ] **ESPN API Caching:** Configure Edge caching headers (`Cache-Control: s-maxage=60`) on `/api/espn-scoreboard` to prevent API rate-limiting during high user concurrency.

---

### Phase 3: Analytical Features & Gamification ⚪
*Focus on increasing user engagement, personal utility, and educational value.*

- [ ] **Custom Activity Builder:** Allow users to input custom parameters (Frequency, Exposure %, Edge %) to overlay their own activities (e.g. side-hustles, local poker leagues) onto the Edge Spectrum.
- [ ] **Portfolio Blender:** Let users bundle multiple positive-edge and negative-edge activities (e.g. 90% S&P 500 + 10% sports wagering) to visualize the blended returns and composite variance over time.
- [ ] **Staking Strategy Grid:** Expand the backtester to run user strategy criteria simultaneously against standard sizing methods:
  - Flat Bet ($100 standard)
  - Dynamic % Bankroll (e.g., 2% per bet)
  - Kelly Criterion (Full/Fractional sizing)
  - Martingale (Double-on-loss progression, as an educational tool for risk of ruin)
- [ ] **"Guess the Edge" Quiz Game:** Gamify user interactions by presenting common bets/investments (parlays, slots, day trading, penny stocks) and having the user guess the mathematical edge, revealing the discrepancy between perceived and actual odds.

---

### Phase 4: Production Quality & Public Launch ⚪
*Focus on actual odds data integration, monetization, and user acquisition loops.*

- [ ] **Real Historical Sports Odds:** Integrate real historical closing lines, sports book odds, and team injury histories (via APIs like *The Odds API* or *Sportradar*) to replace deterministic mock data in the backtester.
- [ ] **Shareable Strategy Cards:** Auto-generate high-quality shareable graphics showing backtest equity curves and ROI summaries for users to share on X (Twitter), Reddit, or sports discord channels.
- [ ] **Freemium Monetization Model:**
  - *Free Tier:* Standard visualizer, 1-Year historical backtests.
  - *Premium Tier ($15-$25/mo):* Full 25-Year backtests, advanced filtering (rest, streak, injury splits), and Gemini AI strategy critiques.
- [ ] **Sports Book Vig Calculator:** Create a viral, free utility that converts sportsbook odds into fair probabilities and strips out the house margin, linking directly back to the Edge Spectrum tools.
