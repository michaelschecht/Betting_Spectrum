# Edge Spectrum — Product Roadmap 🗺️

This document tracks the milestones, architectural upgrades, and feature additions for the **Edge Spectrum** multi-tool hub. It is the single sequenced list — everything from the full code review has been folded in here and ordered by what has to happen first.

> **Companion docs:** [Ideas/hub_improvement_plan.md](Ideas/hub_improvement_plan.md) holds the detail and evidence behind the Phase 2 items (measurements, root causes, before/after tables). [Ideas/improvement_ideas.md](Ideas/improvement_ideas.md) is the feature backlog for the Edge Spectrum visualization specifically.

---

## 📋 Status Key
- 🟢 **Complete** — Implemented, tested, and live in production
- 🟡 **In Progress** — Active development
- ⚪ **Planned** — Backlogged for future phases

**Priority within a phase:** 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Nice to have

---

## 🗺️ Phases & Milestones

### Phase 1: Repo Consolidation & Standardization 🟢
*Merging standalone applications and standardizing mathematical models.*

- [x] **Merge Repositories:** Integrate `Sports-Betting-Backtester` codebase directly into the `edge-spectrum` Vite React shell under `/backtester`.
- [x] **Serverless Integration:** Bridge dev-server Express routes and production Vercel serverless functions (`api/*`) to prevent code drift.
- [x] **Mathematical Standardization:** Replace hardcoded gambling models with the universal **DU/CED Framework** (Frequency $\times$ Exposure $\times$ Edge) for valid cross-asset comparison.
- [x] **Documentation & Cleanup:** Reorganize the repository structure, write a developer guide for adding tools, update global hosting inventory references, and rewrite the root `README.md`.

---

### Phase 2: Integrity, Cost & Safety 🟡
*Nothing else is worth building on top of numbers that are wrong or an endpoint that spends money for strangers. This phase is the foundation.*

**Shipped 2026-08-18**

- [x] 🔴 **Fix the simulator's built-in bias.** The line and the score were generated from the same power ratings with *different* coefficients, underpricing the home side by construction — blind home-ATS betting returned +15.7% ROI in NFL and **+37.3% in NBA**. One expected margin and total per game now drives both the posted lines and the score draw; every market is priced off its own realised distribution rather than assumed to be −110. All 40 naive strategies now land between −3.06% and −5.81%; none is profitable.
- [x] 🔴 **Regression guard for the market.** `npm run check:market` runs all 40 naive strategies and exits non-zero outside −7%…−2.5%. Verified to fail on a reintroduced mispricing.
- [x] 🔴 **Passcode-gate the AI advisor.** `/api/strategy-advisor` was an unauthenticated proxy to a metered Gemini key. Now behind an HMAC-signed session gate enforced server-side (`src/server/auth.ts`), failing closed when `ADVISOR_PASSCODE` is unset. Prompts capped at 1000 characters.
- [x] 🟠 **Stop calling simulated data live.** "Live Data Engine" → "Simulated Data", a real hold readout wired to `MARKET_OVERROUND`, quarter-Kelly labelled honestly, and the advisor told in its system prompt that it is reading a simulation.
- [x] 🟡 **Round `maxDrawdownPercent`** — it was leaking raw float digits (`-44.244008790…`) into the KPI tile.

**Shipped 2026-08-20**

- [x] 🔴 **Validate `/api/backtest` input.** The handler checked that five fields were *present*, never that they were sane. `{ startYear: 1900, endYear: 3000 }` was accepted verbatim — measured directly, 1,101 simulated seasons, **7.6 s of CPU and 925 MB of peak heap** for one request, which is an OOM inside a 1 GB serverless function and free to send. A Zod schema in `src/server/strategySchema.ts` now bounds every field: seasons to 2000–2025, all six enums checked, `unitSize` and `startingBankroll` positive and capped, min/max filter pairs required to be ordered, and a `totals` ↔ `over`/`under` consistency rule that previously produced a silent zero-bet run. Unknown keys are stripped. That payload is now a `400` in **~5 ms**, carrying a per-field reason the UI shows verbatim. The bounds live in `src/strategyBounds.ts` and the strategy form clamps to them, so the UI cannot build a request the endpoint would reject.

**Shipped 2026-08-24**

- [x] 🟠 **ESPN API caching.** `Cache-Control: s-maxage=30, stale-while-revalidate=120` on `/api/espn-scoreboard`, so Vercel's CDN absorbs repeat visitors instead of every one of them hitting ESPN's undocumented endpoint directly.
- [x] 🟠 **CI on every PR.** `.github/workflows/ci.yml` runs `npm run lint` (`tsc --noEmit`), `npm run check:market`, and `npm run build` on every PR and every push to `main`. The market check is the guard that stops the Phase 2 bias fix from silently regressing.

**Open**

- [ ] 🟠 **Rate-limit the advisor and cap spend.** The passcode stops strangers; it does not stop a shared passcode being over-used. Per-IP / per-session limiting (Upstash or Vercel KV) plus a daily spend ceiling and kill switch.
- [ ] 🟡 **Debounce and abort backtest requests.** `BacktesterApp.tsx` refires on every keystroke in `unitSize` / `startingBankroll` with no `AbortController`, so a slow earlier response can overwrite a newer one.
- [ ] 🟡 **Stop silently truncating the ledger.** `runBacktest` returns `simulatedGames.slice(-250)`; a 7,000-bet run shows 250 with no indication. Label it, and add CSV export of the full ledger.
- [ ] 🟡 **Methodology page.** Explain the generator, the DU/CED framework, and the Spectrum's data sources. Honest framing is an asset here, not a weakness.
- [ ] 🟡 **Responsible gambling footer.** 1-800-GAMBLER and international equivalents, an age note, and a "not financial advice" line on advisor output. Matters the moment this takes payments (Phase 6).

---

### Phase 3: Performance & Platform ⚪
*Making the hub fast, shareable, and maintainable before piling features onto it.*

- [ ] 🟠 **Client-side backtesting in a Web Worker.** Shift `runBacktest` from [dataGenerator.ts](../site/src/dataGenerator.ts) out of `/api/backtest` and run it in the browser, off the main thread.
  - *Benefits:* sub-millisecond re-runs, zero server latency, offline capability, and no serverless cost — it also retires the Phase 2 input-validation risk for the common path.
- [ ] 🟠 **Shareable strategy state.** Serialize the strategy to the query string so a backtest can be bookmarked and sent to someone. Cheapest growth feature on the list.
- [ ] 🟠 **Code splitting / dynamic imports.** 771 KB single JS chunk — the landing page ships Recharts, D3, and react-markdown to render two tiles. `React.lazy` the `/backtester` and `/spectrum` routes plus `manualChunks` in [App.tsx](../site/src/App.tsx).
- [ ] 🟡 **SEO and social.** No OG or Twitter meta, no sitemap, no robots.txt, no analytics. Use `@vercel/og` for per-tool cards — and per-backtest cards showing the equity curve, which doubles as the "shareable strategy card" growth loop.
- [ ] 🟡 **Unit tests for the engine.** Vitest over the pure functions: odds conversion, push handling, ROI / drawdown / Kelly math. `check:market` covers the market model; this covers the accounting.
- [ ] 🟡 **React port for the Plotly viz.** Convert `public/spectrum/index.html` into a native React page (`src/pages/Spectrum.tsx`).
  - *Benefits:* client-side routing, no page reloads, shared header/nav.
- [ ] 🔵 **One shell nav.** `HubNav` (z-50) and the Backtester `Header` (z-40) currently stack as two sticky bars on `/backtester`.
- [ ] 🔵 **ESLint + Prettier.** No lint config exists anywhere.

---

### Phase 4: Analytical Depth ⚪
*Today the backtester answers "did this win?" It should answer **"is this real?"** — nobody in the hobby space does this well, and it is the strongest available differentiator.*

- [ ] 🟠 **Statistical significance panel.** 95% CI on win rate, t-stat and p-value against the breakeven rate, and required sample size. A 54% hit rate over 300 bets should be labelled *statistically indistinguishable from noise*.
- [ ] 🟠 **Monte Carlo fan chart.** Resample the bet stream 1,000× and plot the distribution of equity paths. The single equity curve is the most misleading object in the app; the fan chart is the antidote. (Idea #24 in `improvement_ideas.md`.)
- [ ] 🟠 **Overfitting warning.** When filters cut the sample below ~200 bets, say so loudly.
- [ ] 🟡 **Walk-forward split.** Fit on 2000–2015, verify on 2016–2025.
- [ ] 🟡 **Staking strategy grid.** Run the same bet stream against standard sizing methods, with risk-of-ruin per method:
  - Flat Bet ($100 standard)
  - Dynamic % Bankroll (e.g. 2% per bet)
  - Kelly Criterion (full / fractional)
  - Martingale (double-on-loss, as an educational demonstration of risk of ruin)
- [ ] 🟡 **Vig sensitivity slider.** Watch a "profitable" strategy die when −110 becomes −115.
- [ ] 🔵 **Multi-strategy compare.** 2–4 equity curves overlaid.
- [ ] 🔵 **Splits heatmap.** ROI by season, month, day-of-week, favourite size.

---

### Phase 5: New Tools ⚪
*Each is roughly one `tools.ts` entry plus one page — the registry architecture already supports this well.*

**Tier 1 — small, high-traffic, build first**

- [ ] 🟠 **Odds converter & no-vig calculator.** American ↔ decimal ↔ fractional ↔ implied, with the house margin stripped out. The best SEO hook available and a half-day build; links back into the rest of the hub.
- [ ] 🟠 **Parlay / SGP true-odds calculator.** Fair price vs. book price, exposing the 15–25% hold. Serves idea #14, "The Parlay Illusion".
- [ ] 🟡 **Kelly & bankroll sizing calculator.** With risk-of-ruin. Standalone, and feeds the backtester's staking grid.

**Tier 2 — the retention product**

- [ ] 🟠 **CLV bet tracker.** Log bets, auto-fetch the closing line, and grade the user on **closing line value** rather than on wins. CLV is the only metric that actually predicts long-term betting skill, and no consumer tool presents it well. This is the reason someone returns weekly — and the feature that justifies accounts and a database (Vercel Postgres / Neon / Supabase).
- [ ] 🟡 **Personal Edge Audit.** User enters real activities and amounts; returns a blended edge and an annual expected cost (idea #29). The natural bridge between the Spectrum viz and the betting tools.

**Tier 3 — reach and engagement**

- [ ] 🟡 **"Guess the Edge" quiz.** Present common bets/investments and have the user guess the mathematical edge, revealing the gap between perceived and actual odds. The viral loop, with a shareable score card.
- [ ] 🟡 **Portfolio Blender.** Bundle positive- and negative-edge activities (e.g. 90% S&P 500 + 10% sports wagering) to visualize blended returns and composite variance over time.
- [ ] 🔵 **Custom Activity Builder.** Let users input their own Frequency / Exposure % / Edge % to overlay personal activities (side-hustles, local poker leagues) onto the Edge Spectrum.
- [ ] 🔵 **EV / arb / middle finder.** Gated on a real odds feed — see Phase 6.

---

### Phase 6: Real Data & Public Launch ⚪
*Everything above is worth more with real numbers.*

- [ ] 🟠 **Real historical sports odds.** Integrate real closing lines and injury histories (*The Odds API*, *Sportradar*) to replace the simulated market in the backtester. Even **one sport × 10 seasons** would move it from a teaching toy to a credible instrument. Store as static JSON/Parquet in the repo or Vercel Blob so it stays free to serve, and put a "verified data" badge on that tool's tile.
- [ ] 🟡 **Freemium monetization.**
  - *Free tier:* standard visualizer, 1-year historical backtests.
  - *Premium tier ($15–25/mo):* full 25-year backtests, advanced filtering (rest, streak, injury splits), and Gemini AI strategy critiques.
- [ ] 🟡 **Public launch loop.** Shareable strategy cards (Phase 3) + the Tier 1 calculators (Phase 5) as the acquisition surface, pointing back at the hub.

---

## 🔗 Sequencing rationale

**Phase 2 before everything.** A simulator that pays out on a bug teaches the opposite of the site's thesis, and an open endpoint to a metered API key is a live cost risk. Both are now fixed; the remaining Phase 2 items are the same class of problem.

**Phase 3 before Phase 4.** Moving the engine client-side makes every analytical feature in Phase 4 essentially free to run — a Monte Carlo fan chart is 1,000 backtests, which is untenable as serverless round-trips and trivial in a Web Worker.

**Phase 5 Tier 1 can jump the queue.** The calculators are small, self-contained, and the best organic-traffic hook on the list. If growth matters more than depth in a given week, build one of those instead.

**Phase 6 last.** Real odds data is the biggest unlock but also the only item with a recurring cost and a licensing question, so it should follow the tooling that makes it worth paying for.
