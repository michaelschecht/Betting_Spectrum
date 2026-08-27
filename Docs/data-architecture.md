<h1 align="center">🗄️ Data Architecture & Provenance</h1>

<p align="center">
  <em>Data schemas, canonical source-of-truth structures, automated CI validation, and forward collection pipelines.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/records-187_canonical-8B5CF6?style=for-the-badge" alt="Records: 187">
  <a href="README.md"><img src="https://img.shields.io/badge/↩-Docs_Home-6B7280?style=for-the-badge" alt="Docs Home"></a>
</p>

---

## 🏛️ 1. Canonical Dataset Architecture

To eliminate data drift across documentation markdown, static visualization JSON, and runtime scripts, all edge and return parameters derive from a single TypeScript source of truth:

```
site/src/data/edges.ts (Typed canonical dataset: 187 records)
          │
          ├──► site/public/spectrum/edges.json (Static visualizer artifact)
          ├──► Data/edge_analysis12.md (Human-readable markdown catalog)
          └──► site/scripts/check-edges.ts (Automated CI validation & bounds check)
```

### TypeScript Schema (`EdgeRecord`)

```typescript
export type ActivityKind = 'investing' | 'gambling';

export interface ProvenanceInfo {
  source?: string;       // e.g. "S&P Dow Jones Indices", "Wizard of Odds", "UNLV Center for Gaming Research"
  asOf?: string;         // ISO date or year, e.g. "2026-01"
  window?: string;       // e.g. "1926-2025 (100-year annualized)"
  confidence?: 'high' | 'medium' | 'estimated';
  methodologyUrl?: string;
}

export interface EdgeRecord {
  id: string;
  name: string;
  category: CategoryKey;
  kind: ActivityKind;
  edge: number;            // Expected edge % per decision (positive or negative)
  annualReturn?: number;   // Nominal annualized return % (for investing activities)
  duPerDay: number;        // Decision Units per day (frequency)
  cedPercent: number;      // Capital Exposure per Decision (% of bankroll risked)
  addictionRisk: 1 | 2 | 3 | 4 | 5; // 1=Minimal to 5=Extreme
  isTaxAdjusted?: boolean;
  isFeeAdjusted?: boolean;
  provenance?: ProvenanceInfo;
}
```

---

## 📊 2. The 13 Asset & Wagering Categories

The canonical dataset spans 187 items across 13 distinct categories:

| Category | Typical Kind | Default State | Representative Items |
| :--- | :--- | :--- | :--- |
| **📈 Stocks & Equities** | Investing | Active | S&P 500 (SPY), NASDAQ 100 (QQQ), Dividend Aristocrats (NOBL), Penny Stocks |
| **🏛️ Bonds & Fixed Income** | Investing | Active | 10-Year Treasury, Investment Grade Corporate (LQD), High Yield / Junk (HYG) |
| **🏢 Real Estate** | Investing | Active | Multi-Unit Apartments, Single Family Rental, Commercial Office, Timeshares |
| **🪙 Crypto & Digital Assets** | Investing | Active | Bitcoin (BTC), Ethereum (ETH), Top 20 Altcoins, Micro-cap Tokens |
| **🥇 Precious Metals** | Investing | Active | Gold Bullion (GLD), Silver (SLV), Platinum (PPLT), Mining Equities (GDX) |
| **🎨 Collectibles & Alts** | Investing | Active | Vintage Sports Cards, Fine Wine, Luxury Watches, NFTs |
| **🛡️ Insurance & Annuities** | Investing | Active | Fixed Indexed Annuities, Whole Life Cash Value, Term Life Drag |
| **🏈 Sports Betting** | Wagering | Active | Point Spreads (-110), Moneylines, Totals, Same-Game Parlays, Live In-Play |
| **🎰 Casino Gambling** | Wagering | Filtered (Opt-in) | Single-Zero Roulette, 9/6 Video Poker, Blackjack Basic Strategy, 95% Slots |
| **♠️ Poker & Skill Games** | Wagering | Filtered (Opt-in) | Elite Pro Live Cash, Mid-Stakes Online, Recreational Live, Backgammon |
| **🔮 Prediction Markets** | Wagering | Active | Kalshi Economic Events, Polymarket Geopolitics, Metaculus Forecasting |
| **🎟️ Lottery & Scratchers** | Wagering | Active | Mega Millions, Powerball, $20 Scratch-Offs, Daily Pick 3 |
| **⚡ Active Trading** | Investing | Active | Trend Following, Covered Calls, Retail Day Trading, CFD Speculation |

---

## 🛡️ 3. Automated Validation & The Provenance Ratchet

Integrity is enforced automatically in CI through `npm run check:edges`:

1. **Count & Category Invariant:** Asserts that exactly 187 records are present across the 13 declared categories.
2. **Mathematical Bounds:** Verifies that no investing annualized return exceeds realistic bounds and that negative-edge wagering records possess strictly negative expected values.
3. **The Provenance Ratchet:** 
   - Provenance metadata (`source`, `asOf`) is tracked against a committed baseline (`site/src/data/provenance-baseline.json`).
   - If a pull request adds or updates records, the total count of cited records cannot drop below the baseline.
   - Any PR adding citations increments the baseline count, preventing future regressions.

---

## 📡 4. Forward Data Ingestion Strategy

To transition from synthetic simulations to observed historical tracking, forward collection operates via scheduled lightweight ingestion:

### A. Append-Only Scoreboard Line Snapshots
- **Endpoint:** `/api/espn-scoreboard` (`site/src/server/espn.ts`)
- **Schedule:** Automated cron executing every 2–4 hours during active game days.
- **Payload Capture:**
  - `eventId`, `sport`, `eventDate`, `capturedAt`
  - `homeTeam`, `awayTeam`, `homeScore`, `awayScore`
  - `spread`, `spreadOdds`, `overUnder`, `moneyline`
  - `linePhase: 'open' | 'midday' | 'close'`
- **Application:** Builds a historical closing-line archive used to calculate user **Closing Line Value (CLV)** without recurring commercial data feed costs.

### B. Financial Instrument As-Of Updates
- Ingest trailing 10-year and 20-year CAGRs for core benchmark tickers (`SPY`, `QQQ`, `GLD`, `HYG`) from keyless market data APIs to maintain timestamped, verified return benchmarks.

---

<p align="center">
  <a href="README.md">← Documentation Home</a> ·
  <a href="roadmap.md">Roadmap</a> ·
  <a href="methodology.md">Methodology</a>
</p>
