# Edge Spectrum — Hub Improvement Plan 🛠️

**Date:** 2026-08-18
**Scope:** Full review of the `edge-spectrum` repo, the `site/` app, and the two live tools
(The Edge Spectrum viz + the Backtest Simulator).
**Companion docs:** [roadmap.md](../roadmap.md) (phased milestones) ·
[improvement_ideas.md](improvement_ideas.md) (Spectrum viz feature backlog)

**Status Key:** 🔴 Critical · 🟠 High · 🟡 Medium · ✨ Feature · ✅ Done

---

## ✅ 1. The Backtest Simulator had a large built-in bias — fixed 2026-08-18

**Was the highest-priority item in the repo.** Resolved; the results below are kept as the record
of what was wrong and the band the regression now holds the model to.

### What was wrong

`site/src/dataGenerator.ts` derived both the betting line *and* the game score from the same
power ratings, but with **mismatched coefficients**. For NFL:

- Line: `expectedSpread = powerDiff * 0.35`
- Score: `homeScore - awayScore ≈ 2 + powerDiff * 0.4`

The home side was therefore underpriced by roughly `2 + 0.05 × powerDiff` points **by
construction**. The same mismatch existed in every sport, and was worst in NBA.

### Measured impact (before the fix)

Running the engine directly over 2000–2025:

| Strategy (ATS) | Bets | Win % | ROI |
|---|---:|---:|---:|
| NBA — bet home | 15,600 | **72.3%** | **+37.32%** |
| NFL — bet home | 7,072 | 60.8% | +15.73% |
| NFL — bet favorites | 7,072 | 59.9% | +13.97% |
| NHL — bet home | 15,600 | 55.7% | +6.20% |
| MLB — bet home | 20,800 | 53.9% | +2.84% |
| NFL — bet under | 7,072 | 59.1% | +12.15% |

A new user's first few clicks taught them that blind home-ATS betting returns 15–37% forever —
the exact opposite of the lesson Edge Spectrum exists to deliver. NBA at 72.3% was not subtle;
any quantitative visitor would have spotted it and discounted the whole hub.

### Fix (shipped)

1. One `expectedMargin` / `expectedTotal` per game now drives **both** the posted lines and the
   score draw — `SPORT_MODEL` in `site/src/dataGenerator.ts`.
2. Scores are drawn around exactly that expectation. NFL and NBA use a normal draw floored at
   zero (with the floor's effect on the mean *and* variance carried into the prices); MLB and NHL
   use Poisson, which suits count scores and never needs a floor.
3. **Every market is priced from its own realised distribution**, not assumed to be −110. This
   turned out to be essential: run and goal distributions are right-skewed, so their mean sits
   above their median and a line placed at the mean is not a coin flip. `Game` gained
   `homeSpreadOdds` / `awaySpreadOdds` / `overOdds` / `underOdds`, and the engine reads the posted
   price for whichever side a strategy took.
4. A level score is broken with one extra point, so that probability mass is redistributed
   *before* pricing. Skipping this was worth ~0.6% ROI to the home side on its own: a tie counts as
   an away cover beforehand, but half of it flips to home afterwards.
5. Team **defense ratings now count** — strength blends offense and defense, and totals move on
   offense minus opposing defense, so the dynasty defenses in `getTeamHistoricalRating` finally
   matter.
6. Vig is one constant, `MARKET_OVERROUND = 1.0476` (a 4.54% hold, matching −110/−110), applied so
   it can never price a side below fair value. No bet is +EV by construction.

### Result

All 40 naive strategies (4 sports × 10 selections, 2000–2025) now land between **−3.06% and
−5.81%** ROI. None is profitable; the spread around the 4.54% hold is discretisation slack from
integer scores and half-point lines.

| Strategy (ATS) | Was | Now |
|---|---:|---:|
| NBA — bet home | +37.32% | −4.60% |
| NFL — bet home | +15.73% | −3.53% |
| NFL — bet favorites | +13.97% | −3.26% |
| NHL — bet home | +6.20% | −5.56% |
| MLB — bet home | +2.84% | −3.99% |
| NFL — bet under | +12.15% | −5.30% |

The default landing view (NFL / moneyline / favorites / 2020–24) went from **+15.92% ROI and
+$21,650** to **−1.39% and −$1,884** over the same 1,360 bets.

### Regression guard

`npm run check:market` (from `site/`) runs `marketDiagnostics()` over all 40 naive strategies and
exits non-zero if any lands outside −7%…−2.5%. Verified to fail as intended by reintroducing a
1.2-point mispricing. **Wire this into CI** alongside the typecheck (section 3).

### Related: framing (shipped)

The footer disclosed simulation, but other surfaces contradicted it. All now corrected:

- ✅ Header badge **"Live Data Engine"** → **"Simulated Data"**.
- ✅ `tools.ts` blurb and the header subtitle now say "26 simulated seasons".
- ✅ **"Simulated Vig Hold: 4.5%"** → **"Book Hold: 4.54%"**, read live off `MARKET_OVERROUND`
  instead of asserted; **"Optimal Fraction Kelly Model Enabled"** → **"Quarter-Kelly Sizing"**,
  which is what the code actually does.
- ✅ The backtester footer and the AI advisor (both its welcome copy and its system prompt) now
  state that the data is simulated and that the hold is the only edge in it — the advisor is
  explicitly told not to imply a good backtest means a real-world edge.
- ⬜ Still to do: a `/methodology` page explaining the generator, the DU/CED framework, and the
  Spectrum's data sources. Honest framing is an asset here, not a weakness.

---

## 🟠 2. Cost, safety & correctness

### 2a. `/api/strategy-advisor` was an open proxy to a paid Gemini key ✅

No auth, no rate limit, no prompt cap, no origin check — anyone could loop `curl` against it and
drain the quota. **Resolved 2026-08-18** with a passcode session gate (see the auth gate section below).

Still outstanding on the same endpoint:

- Per-IP / per-session rate limiting (Upstash or Vercel KV) — the passcode stops strangers, not
  a shared passcode being over-used.
- A daily spend ceiling / kill switch.

### 2b. No input validation on `/api/backtest` ✅ — fixed 2026-08-20

`runValidatedBacktest` checked only that five fields were *present*, not that they were sane.

**Measured, not estimated.** Running the engine directly over the range the endpoint would have
accepted:

| Seasons requested | Wall clock | Peak heap | Bets |
|---|---:|---:|---:|
| 26 (the largest legal range) | 0.18 s | 30 MB | 20,800 |
| 100 | 0.54 s | 110 MB | 80,000 |
| 300 | 1.88 s | 264 MB | 240,000 |
| **1,101** (`1900`–`3000`) | **7.58 s** | **925 MB** | 880,800 |

A 1 GB serverless function does not survive the last row, and the request costs the sender
nothing — a denial-of-wallet with a two-field body.

**Fix (shipped).** A Zod schema, `site/src/server/strategySchema.ts`, reached through the same
`runValidatedBacktest` both entry points already call:

- Seasons bounded to 2000–2025 (the only years `getTeamHistoricalRating` has era ratings for),
  integers, and `endYear >= startYear`.
- All six enums — sport, bet type, side selection, streak filter, streak target, star-player
  filter — checked against the unions in `types.ts`. A `SameMembers` type assertion fails
  `tsc --noEmit` if a union gains a member and the schema does not, so the two cannot drift.
- `unitSize` and `startingBankroll` required, finite, positive, capped at $1M / $1B.
- Odds, spread and total filters bounded, and each min/max pair required to be ordered.
- `betType: 'totals'` must pair with `over`/`under` and nothing else may — that mismatch used to
  return a silent zero-bet run rather than an error.
- Unknown keys stripped, so the object handed to the engine is exactly the known shape.

The 1900–3000 payload is now a `400` in **~5 ms**, with one message per bad field; the client
renders those verbatim instead of "Simulation server returned an error response."

**Bounds are shared, Zod is not.** The numbers live in `site/src/strategyBounds.ts`, which has no
imports, and `StrategyBuilder` clamps every control to them — so the form cannot build a request
the endpoint would reject, and the year dropdown is generated from `MIN_SEASON`/`MAX_SEASON`
rather than a hardcoded 26. Importing the schema itself into the client was tried first and cost
**+57 KB (+14 KB gzipped)** on the single chunk section 3 wants to shrink, for a check the server
already reports identically; the split keeps the client cost at +0.34 KB.

### 2c. No cache headers on `/api/espn-scoreboard` 🟠

Every visitor hits ESPN's undocumented endpoint directly — rate-limit risk and needless latency.

**Fix:** `Cache-Control: s-maxage=30, stale-while-revalidate=120`. One line.
(Already listed as Phase 2 in the roadmap.)

### 2d. Race conditions in the backtester 🟡

`BacktesterApp.tsx` refires the backtest on **every keystroke** in `unitSize` / `startingBankroll`,
with no debounce and no `AbortController` — a slow earlier response can overwrite a newer one.

**Fix:** debounce ~300ms, abort in-flight requests on a new run.

### 2e. Silent truncation of the bet ledger 🟡

`dataGenerator.ts` returns `simulatedGames.slice(-250)`. A 7,000-bet run silently shows only the
last 250, with no indication in the UI.

**Fix:** label it ("showing last 250 of 7,072 bets") and add CSV export of the full ledger.

---

## 🟡 3. Platform hygiene

| Item | Detail |
|---|---|
| **Bundle size** | 771 KB single JS chunk. The landing page ships Recharts + D3 + react-markdown to render two tiles. Fix with `React.lazy` routes + `manualChunks`. (Roadmap Phase 2.) |
| **No tests** | The engine is pure functions — ideal for Vitest: odds conversion, push handling, ROI / drawdown / Kelly math, and the section 1 bias regression. |
| **No CI** | Add a GitHub Action running `tsc --noEmit` + tests + build on every PR. Pairs naturally with the existing `mike_desktop` → PR → `main` flow. |
| **No linting** | No ESLint or Prettier config anywhere. |
| **No shareable state** | Strategy lives only in React state — a backtest cannot be bookmarked or sent to anyone. Serialize it to the query string. Cheapest growth feature on the list. |
| **No SEO / social** | No OG or Twitter meta, no sitemap, no robots.txt, no analytics. Use `@vercel/og` for per-tool cards and per-backtest equity-curve cards. |
| **Duplicate sticky headers** | `HubNav` (z-50) and the Backtester `Header` (z-40) stack on `/backtester`. Collapse to one shell nav. |

---

## ✨ 4. Make the backtester statistically honest

Today it answers *"did this win?"* It should answer **"is this real?"** — nobody in the hobby
space does this well, and it is the strongest available differentiator.

1. **Significance panel** — 95% CI on win rate, t-stat and p-value vs. the breakeven rate, and
   required sample size. A 54% hit rate over 300 bets should be labelled *statistically
   indistinguishable from noise*.
2. **Monte Carlo fan chart** — resample the bet stream 1,000× and plot the distribution of equity
   paths. The single equity curve is the most misleading object in the app; the fan chart is the
   antidote. (This is idea #24 in `improvement_ideas.md` — it belongs here, not only in the viz.)
3. **Walk-forward split** — fit on 2000–2015, verify on 2016–2025. The anti-overfitting guard.
4. **Overfitting warning** — when filters cut the sample below ~200 bets, say so loudly.
5. **Vig sensitivity slider** — watch a "profitable" strategy die when −110 becomes −115.
6. **Staking method grid** — flat / %-bankroll / Kelly / Martingale over the *same* bet stream,
   with risk-of-ruin per method. (Already roadmap Phase 3.)
7. **Multi-strategy compare** — 2–4 equity curves overlaid.
8. **Splits heatmap** — ROI by season, month, day-of-week, favourite size.

---

## ✨ 5. New tools

Each is roughly one `tools.ts` entry plus one page — the architecture already supports this well.

### Tier 1 — small, high-traffic, build first

- **Odds converter and no-vig calculator** — American ↔ decimal ↔ fractional ↔ implied, with vig
  stripped out. Already roadmap Phase 4; it is the best SEO hook available and a half-day build.
- **Parlay / SGP true-odds calculator** — fair price vs. book price, exposing the 15–25% hold.
  Directly serves idea #14 ("The Parlay Illusion").
- **Kelly and bankroll sizing calculator** — with risk-of-ruin. Standalone, and feeds the backtester.

### Tier 2 — the retention product

- **CLV bet tracker.** Log bets, auto-fetch the closing line, grade the user on **closing line
  value** rather than on wins. CLV is the only metric that actually predicts long-term betting
  skill, and no consumer tool presents it well. This is the reason someone returns weekly — and
  the feature that justifies accounts and a database.
- **Personal Edge Audit** (idea #29) — user enters real activities and amounts; returns a blended
  edge and an annual expected cost. The natural bridge between the Spectrum viz and the betting tools.

### Tier 3 — reach

- **"Guess the Edge" quiz** (roadmap Phase 3) — the viral loop, with a shareable score card.
- **Portfolio blender** (roadmap Phase 3).
- **EV / arb / middle finder** — gated on a real odds feed.

---

## ✨ 6. The data question

Everything above is worth more with real numbers. **The Odds API** carries historical closing
lines; even **one sport × 10 seasons** of real closing lines would move the backtester from a toy
to a credible instrument. Store it as static JSON/Parquet in the repo or Vercel Blob so it stays
free to serve, and put a "verified data" badge on that tool's tile.

Sequence: fix the section 1 bias → ship the Tier 1 calculators → then add real data for one sport.

---

## 🟡 7. Compliance and trust

Given the subject matter and the freemium plans in roadmap Phase 4:

- Responsible-gambling footer with 1-800-GAMBLER and international equivalents.
- An age note.
- A "not financial advice" line on AI advisor output.

Cheap to add, and it matters the moment this takes payments.

---

## 🔐 Auth gate (implemented 2026-08-18)

Interim protection for the Gemini key, ahead of the broader rate-limiting work in section 2a.

**Design** — a shared passcode unlocks an HMAC-signed, HttpOnly session cookie. The check is
enforced **server-side** on every advisor call; the client lock screen is only cosmetic, because
the endpoint is the thing being abused.

| File | Role |
|---|---|
| `site/src/server/auth.ts` | Shared logic — passcode compare, HMAC token sign/verify, cookie build/parse |
| `site/api/advisor-auth.ts` | Vercel: `GET` session status, `POST` unlock / logout |
| `site/api/strategy-advisor.ts` | Rejects with `401` when the session cookie is missing or invalid |
| `site/server.ts` | The same two routes for local Express dev, so the paths cannot drift |
| `site/src/components/AiAdvisor.tsx` | Lock screen, passcode entry, re-lock button, `401` re-lock handling |

**Behaviour**

- `ADVISOR_PASSCODE` unset → the endpoint **fails closed** with `503`. It never fails open.
- The HMAC secret is `ADVISOR_SECRET` if set, otherwise derived from the passcode — so **changing
  the passcode invalidates every existing session**.
- Session TTL 30 days; the cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Prompt length capped at 1,000 characters (the same abuse vector).
- Timing-safe comparison on both the passcode and the token.

**Setup** — set `ADVISOR_PASSCODE` in `site/.env` locally and in the Vercel project's environment
variables for production. Optionally set `ADVISOR_SECRET` to a long random string.

**Still to do:** per-IP rate limiting and a daily spend ceiling (section 2a).

---

## Suggested order of work

| Phase | Work |
|---|---|
| **Now** | ✅ Auth gate on the advisor · ✅ section 1 generator bias + regression guard · ✅ "Live Data Engine" → "Simulated Data" · ✅ Zod-validate `/api/backtest` · ESPN cache headers · wire `check:market` into CI |
| **Next** | Client-side sim in a Web Worker (removes the API round-trip entirely) · lazy routes · URL-serialised strategy + share cards · Vitest + GitHub Actions CI |
| **Then** | Significance panel + Monte Carlo fan chart + staking grid · odds / vig / parlay calculators |
| **After** | CLV tracker (needs a DB) · real historical odds for one sport · Edge Audit · quiz |

---

## Assessment

The architecture is genuinely good — the `tools.ts` registry with shared `src/server/` modules
bridging Express and Vercel is clean, and adding a tool really is one entry plus one page. The
bottleneck was not structure; it was that the flagship tool's numbers were wrong. With section 1
fixed, the hub is ready to grow.
