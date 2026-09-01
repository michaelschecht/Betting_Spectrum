# Edge Spectrum — Product Roadmap 🗺️

This document tracks the milestones, architectural upgrades, and feature additions for the **Edge Spectrum** multi-tool hub. It is the single sequenced backlog — all findings from the codebase audits and agent collaborative analysis are synthesized here into an actionable, order-of-execution pipeline.

> **Companion docs:**
> - [README.md](README.md) — Documentation hub and navigation directory.
> - [methodology.md](methodology.md) — Mathematical foundations of the DU/CED framework, metric semantics, and ruin formulas.
> - [data-architecture.md](data-architecture.md) — Canonical dataset schema, provenance tracking, CI verification, and collection strategy.
> - [Ideas/README.md](Ideas/README.md) — Research archive, complexity audit, and feature backlog.

---

## 📋 Status Key

- 🟢 **Complete** — Implemented, tested, and live in production
- 🟡 **In Progress** — Active development
- ⚪ **Planned** — Backlogged and sequenced for future milestones

**Priority Level:** 🔴 Critical (Release-Blocking) · 🟠 High · 🟡 Medium · 🔵 Low / Polish

---

## 🚦 Release Gate & Execution Order

```
Phase 1: Consolidation 🟢 ──► Phase 2: Truth & Safety 🟡 ──► Phase 3: Reporting & Inference ⚪
                                       │ (Release Gate)
                                       ▼
Phase 6: Calculators ⚪ ◄── Phase 5: Collection ⚪ ◄── Phase 4: Client Engine ⚪
        │
        ▼
Phase 7: Public Launch ⚪
```

> [!IMPORTANT]
> **Track A / Phase 2 Release Gate:** No features in Phases 3 through 7 ship to users until all Phase 2 integrity items (metric semantics, canonical dataset, false controls cleanup, and automated checks) have landed. Generating export bundles or training models on distorted metrics bakes invalid math into portable files.

---

## 🗺️ Phases & Milestones

### Phase 1: Repo Consolidation & Standardization 🟢
*Merged standalone applications and aligned base mathematical models.*

- [x] **Merge Repositories:** Merged standalone `Sports-Betting-Backtester` codebase directly into the `edge-spectrum` Vite React shell under `/backtester`.
- [x] **Serverless Integration:** Bridged dev-server Express routes and production Vercel serverless functions (`api/*`) to prevent routing drift.
- [x] **Mathematical Standardization:** Standardized raw return calculations using the universal **DU/CED Framework** ($\text{Frequency} \times \text{Exposure} \times \text{Edge}$).
- [x] **Repo Restructuring:** Reorganized directory layout, updated global hosting inventory references, and established initial root documentation.

---

### Phase 2: Truth, Mathematical Integrity & Safety 🟡
*Eliminates metric distortions, establishes a single source of truth for all data, removes dead controls, and protects metered endpoints. This phase is the release gate.*

#### Completed Foundation (Shipped August 2026)
- [x] 🔴 **Fix Simulator Scoring Bias (Shipped 2026-08-18):** Eliminated coefficient mismatch in `site/src/dataGenerator.ts` that underpriced home teams (which had produced artificial +37.3% NBA home-ATS returns). Market pricing now derives from realised score distributions. All 40 naive strategies now land between −3.06% and −5.81% ROI.
- [x] 🔴 **Market Regression Check (Shipped 2026-08-18):** Created `npm run check:market` running all 40 baseline strategies to verify that returns stay within the expected −7.0% to −2.5% band.
- [x] 🔴 **AI Advisor Passcode Gate (Shipped 2026-08-18):** Gated `/api/strategy-advisor` behind HMAC-signed session cookies (`site/src/server/auth.ts`) to prevent unauthenticated spend of Gemini API quotas.
- [x] 🔴 **Request Payload Validation (Shipped 2026-08-20):** Added server-side Zod validation in `site/src/server/strategySchema.ts` and client bounds in `site/src/strategyBounds.ts`, preventing expensive out-of-bounds simulation requests.
- [x] 🟠 **Scoreboard CDN Caching (Shipped 2026-08-24):** Added `Cache-Control: s-maxage=30, stale-while-revalidate=120` to `/api/espn-scoreboard` to cache external API requests.
- [x] 🟠 **CI Workflow (Shipped 2026-08-24):** Configured `.github/workflows/ci.yml` to run TypeScript typecheck, `npm run check:market`, and Vite build on every pull request.
- [x] 🔴 **Metric Semantics & Dual-Axis Correction (Shipped 2026-08-31):** `site/public/spectrum/index.html` plotted a compounded return on capital against an unfloored linear turnover cost on one axis labelled "Expected Return". Measured: at the 10-year horizon the worst bar read **−136,875%** (Slots Tight 85%), which squashed the best investment on the board into **2.83%** of the plotted span — every asset rendered as a flat line at zero. Split into three named measures — `returnOnCapital` (floored at −100%), `expectedTurnoverCost` (games only, deliberately unbounded, on its own axis behind a **Measure** toggle) and `ruinPoint` (decisions to $0). The best investment now spans **85.97%** of the 10-year axis. The ruin marker moved out of the tooltip onto the primary chart as a dotted −100% floor line, an ✕ per ruined activity, and a "Ruined By Horizon" stat card (58 of 160 at 10 years). The `1du` horizon no longer calls one wager and one trading day both "1 DECISION" — it is labelled per row. Guarded by `npm run check:spectrum`, which evaluates the page's own math and asserts the floor holds, turnover cost stays unfloored, and the two agree on ruin across all 187 records × 7 horizons.

#### Sequenced Action Items (In Order of Execution)

1. [ ] 🔴 **Action 2.2 — Canonical Dataset Single Source of Truth (Audit D2 · A2)**
   - **Problem:** Three versions of the edge dataset exist (`Data/edge_analysis12.md` with 166 records; `site/public/spectrum/index.html` with 187 records; `Versions/Streamlit/data.py` with 187 records), drifting in both directions.
   - **Implementation:**
     - Create `site/src/data/edges.ts` defining a typed `readonly EdgeRecord[]` as the single canonical dataset.
     - Build a build-step generator (`site/scripts/generate-edge-artifacts.ts`) that produces `site/public/spectrum/edges.json` for the static visualizer.
     - Generate markdown documentation tables in `Data/` directly from `edges.ts`.

2. [ ] 🔴 **Action 2.3 — Automated Dataset Validation & Provenance Ratchet (Audit D3, E4 · A3)**
   - **Problem:** None of the 187 edge records carry source citations, as-of dates, or confidence intervals, and the Spectrum page has zero automated test coverage.
   - **Implementation:**
     - Add optional provenance fields (`source`, `asOf`, `window`, `methodology`) to the `EdgeRecord` type.
     - Write `site/scripts/check-edges.ts` (`npm run check:edges`) to assert record counts (187), category boundaries, mathematical invariants, and a citation coverage ratchet baseline (`site/src/data/provenance-baseline.json`).
     - Wire `npm run check:edges` into `.github/workflows/ci.yml` alongside `check:market`.

3. [ ] 🔴 **Action 2.4 — Purge Inoperative Strategy Controls (Audit D4 · A4)**
   - **Problem:** `streakTarget` and `starPlayerFilter` exist across `types.ts`, `strategySchema.ts`, `StrategyBuilder.tsx`, `BacktesterApp.tsx`, and `advisor.ts`, but `runBacktest()` never reads them. `advisor.ts` marks `starPlayerFilter` as `required` in the Gemini schema, forcing the LLM to hallucinate reasons for a filter that has no effect.
   - **Implementation:**
     - Remove `streakTarget` and `starPlayerFilter` from `types.ts`, `strategySchema.ts`, `StrategyBuilder.tsx`, `BacktesterApp.tsx`, and presets.
     - Remove `starPlayerFilter` from the Gemini advisor schema and prompt instructions in `site/src/server/advisor.ts`.

4. [ ] 🟠 **Action 2.5 — Public Framing & Audit Scope Alignment (Audit D6, D8 · A5)**
   - **Problem:** Root `README.md` claimed "25 Years of Historical Odds & Results" for power-rating generated seasons, and `CLAUDE.md` marked `site/public/spectrum/` as "leave as-is", causing audits to skip the visualizer.
   - **Implementation:**
     - Correct root `README.md` and app copy to state "25 Years of Simulated Historical Seasons" matching `tools.ts`.
     - Update `CLAUDE.md` to clarify that `site/public/spectrum/` is self-contained for serving but subject to mathematical and dataset audits.

5. [x] 🟡 **Action 2.6 — Debounce & Abort Backtest Race Conditions (Audit D7):**
   - **Implementation:** Added 300 ms debounce timer on the auto-rerun `useEffect` in `BacktesterApp.tsx` and an in-flight `AbortController` ref that aborts superseded runs. Repeated the abort check after `response.json()` to discard late-arriving responses, and suppressed error banners / spinner drops on aborts.

6. [ ] 🟠 **Action 2.7 — AI Advisor Rate Limiting & Spend Caps**
   - **Problem:** Passcode authentication protects against unauthenticated users but does not limit total requests or cost from authenticated sessions.
   - **Implementation:**
     - Add IP/session rate limiting (e.g. 10 requests per hour per session).
     - Implement a hard daily spend ceiling with a fallback 503 response.


---

### Phase 3: Reproducible Reporting & Statistical Diagnostics ⚪
*Enables exporting reproducible analysis bundles and provides honest statistical inference.*

1. [ ] 🟠 **Action 3.1 — Explicit Ledger Response Contract (Audit E3)**
   - **Problem:** `runBacktest()` silently truncates `games: simulatedGames.slice(-250)` while returning full `profitHistory`.
   - **Implementation:**
     - Update the API contract to return explicit fields: `gamesPreview`, `previewLimit: 250`, and `totalGames`.
     - Provide full unsliced game data via the export pipeline.

2. [ ] 🟠 **Action 3.2 — Reproducible Export Bundle Architecture (Audit Track B)**
   - **Feature:** A complete, downloadable research archive (`site/src/server/report.ts`):
     - `report.md` — Parameters, summary metrics, statistical confidence intervals, methodology notes, and disclaimer headers.
     - `ledger.csv` — Full, unsliced history of every wager placed.
     - `strategy.json` — Exact configuration payload for deterministic reproduction.
     - `manifest.json` — Execution metadata (`generatedAt`, engine version, git commit, and SHA-256 hashes of all bundle files).

3. [ ] 🟠 **Action 3.3 — First-Tier Statistical Inference (Audit E1 · Track B)**
   - **Feature:** Display fundamental statistical significance metrics on backtest results and include them in exported reports:
     - Breakeven win rate calculated from realized average odds.
     - 95% binomial confidence interval on the strategy hit rate.
     - One-tailed p-value testing the hypothesis that the strategy has a positive edge ($H_0: \text{winRate} \le \text{breakeven}$).
     - Sample size warning badge for runs with fewer than 250 wagers.

4. [ ] 🟡 **Action 3.4 — Strategy URL Query Serialization (Audit Track B)**
   - **Feature:** Encode active strategy filters into URL query parameters (`/backtester?sport=nba&betType=spread&...`) to enable one-click sharing and bookmarking.

5. [ ] 🟡 **Action 3.5 — Responsible Gambling & Compliance Layer**
   - **Feature:** Add responsible gambling helpline information (1-800-GAMBLER, international resources) and financial disclaimers to application footers and exported markdown reports.

---

### Phase 4: Client-Side Engine & Analytical Depth ⚪
*Transitions heavy simulations to client-side Web Workers and introduces advanced risk modeling.*

1. [ ] 🟠 **Action 4.1 — Web Worker Client-Side Simulation Engine**
   - **Feature:** Move `runBacktest()` execution from `/api/backtest` into a client-side Web Worker.
   - **Benefits:** Sub-millisecond iteration, offline execution, zero serverless compute consumption, and immunity to server timeout constraints.

2. [ ] 🟠 **Action 4.2 — Monte Carlo Equity Path Fan Chart**
   - **Feature:** Resample the wager sequence 1,000 times using bootstrap shuffling to render 5th, 25th, 50th, 75th, and 95th percentile equity paths.
   - **Purpose:** Illustrates path variance and demonstrates how identical edges can yield vastly different short-term outcomes.

3. [ ] 🟡 **Action 4.3 — Walk-Forward Strategy Validation**
   - **Feature:** Provide automatic in-sample / out-of-sample partitioning (e.g. 2000–2015 parameter selection vs. 2016–2025 out-of-sample testing) to detect data mining and curve fitting.

4. [ ] 🟡 **Action 4.4 — Staking Strategy Grid & Vig Sensitivity Slider**
   - **Feature:** Compare performance across Flat Staking, Proportional % Sizing, Quarter/Full Kelly, and Martingale (with ruin warnings). Add a vig slider allowing users to test resilience if lines move from −110 to −115.

5. [ ] 🟠 **Action 4.5 — Bundle Optimization & Code Splitting**
   - **Feature:** Lazy-load secondary routes (`/backtester`, `/spectrum`) with `React.lazy` and split vendor chunks (`recharts`, `react-markdown`) to reduce initial JS payload from ~776 kB to <150 kB.

6. [ ] 🟡 **Action 4.6 — Native React Port of Spectrum Visualizer**
   - **Feature:** Migrate `site/public/spectrum/index.html` into a native React page (`site/src/pages/Spectrum.tsx`), unifying navigation, theme state, and data loading.

---

### Phase 5: Forward Data Collection & Persistence ⚪
*Establishes storage and scheduled collectors to capture real closing lines and market data over time.*

1. [ ] 🔴 **Action 5.1 — Persistence Architecture Selection (Audit D9 · Track C)**
   - **Architecture:** Choose and initialize a lightweight persistence layer (e.g. Vercel KV, Supabase, Neon Postgres, or SQLite on storage) for append-only line capture.

2. [ ] 🟠 **Action 5.2 — Scheduled ESPN Scoreboard Line Capture (Audit C1 · Track C)**
   - **Feature:** Run a scheduled cron job (every 2–4 hours) snapshotting `/api/espn-scoreboard` data.
   - **Record Structure:** Append-only log storing `eventId`, `sport`, `eventDate`, `capturedAt`, `teams`, `spread`, `total`, `moneyline`, and `linePhase: 'open' | 'midday' | 'close'`.
   - **Framing:** Documented strictly as public scoreboard captures for educational CLV analysis.

3. [ ] 🟡 **Action 5.3 — Market-Close Ingestion for Named Tickers (Audit C2 · Track C)**
   - **Feature:** Ingest trailing adjusted closes for stable investment instruments (`SPY`, `QQQ`, `GLD`, `HYG`) from keyless market data sources to supply timestamped as-of returns for investing rows.

4. [ ] 🟠 **Action 5.4 — Closing Line Value (CLV) Skill Grading Engine**
   - **Feature:** Allow users to log hypothetical or placed wagers, fetch the true closing line from captured data, and calculate CLV beat rate (the primary mathematical indicator of betting edge).

---

### Phase 6: Standalone Calculators & Engagement Tools ⚪
*Builds high-utility, SEO-friendly standalone calculators that feed back into the core hub.*

1. [ ] 🟠 **Action 6.1 — Odds Converter & No-Vig Fair Price Calculator**
   - **Tool:** Bidirectional conversion across American, Decimal, Fractional, and Implied Probabilities with multi-way market hold removal (Power / Multiplicative / Shin methods).

2. [ ] 🟠 **Action 6.2 — True-Odds Parlay / SGP Hold Calculator**
   - **Tool:** Compares true joint probability against bookmaker parlay payouts to expose compounding bookmaker margin across multi-leg wagers.

3. [ ] 🟡 **Action 6.3 — Standalone Kelly & Bankroll Sizing Calculator**
   - **Tool:** Single and simultaneous multi-event Kelly sizing with risk-of-ruin curves and fractional sizing recommendations.

4. [ ] 🟡 **Action 6.4 — Personal Edge Audit Tool**
   - **Tool:** User enters their personal activities (401k index funds, sports betting volume, poker hours, lottery tickets) and receives a blended annualized return and expected drag calculation.

5. [ ] 🟡 **Action 6.5 — "Guess the Edge" Quiz & Portfolio Blender**
   - **Tool:** Interactive game prompting users to estimate mathematical edges on common wagers and investments, followed by a portfolio blender tool combining positive and negative edge assets.

---

### Phase 7: Public Launch, Data Licensing & Monetization ⚪
*Expands data coverage through commercial partnerships and adds premium features.*

1. [ ] 🟠 **Action 7.1 — Commercial Historical Odds Integration**
   - **Integration:** Integrate verified historical closing lines and injury reports from commercial feeds (The Odds API / Sportradar) stored as static Parquet/JSON files for instant loading.

2. [ ] 🟡 **Action 7.2 — User Accounts & Saved Portfolios**
   - **Feature:** Optional user authentication for saving custom backtests, personal edge audits, and tracking CLV records over time.

3. [ ] 🟡 **Action 7.3 — SEO, Social Meta Cards & Growth Loop**
   - **Feature:** Implement `@vercel/og` to generate dynamic social sharing cards for backtest equity curves and calculator results, with automated sitemaps and meta tags.

---

## 🔗 Sequencing Rationale

1. **Truth before expansion:** Mathematical errors distort the core thesis of the platform. The headline example — comparing unbounded turnover cost against bounded capital returns on one axis — was fixed on 2026-08-31 and is now held by `npm run check:spectrum`; the dataset and dead-control items behind it are not. Phase 2 must complete before building report exports or public features.
2. **Deterministic reporting before heavy client compute:** Establishing the export contract and statistical inference (Phase 3) provides the validation fixtures needed when porting the simulation engine to Web Workers (Phase 4).
3. **Forward line capture begins early:** Forward collection of closing lines (Phase 5) takes time to build longitudinal history; launching the snapshot cron as early as possible maximizes available data for the CLV engine.
4. **Calculators as organic acquisition:** Standalone calculators (Phase 6) are low-maintenance, high-utility entry points that introduce new users to the broader Edge Spectrum analysis framework.

---

<p align="center">
  <a href="README.md">← Documentation Home</a> ·
  <a href="methodology.md">Methodology</a> ·
  <a href="data-architecture.md">Data Architecture</a> ·
  <a href="change_log.md">Change Log</a>
</p>
