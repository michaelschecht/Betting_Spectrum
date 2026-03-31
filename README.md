# The Edge Spectrum: Who Really Wins?

An interactive data visualization that compares the **expected cumulative returns** of 175+ financial activities — from index fund investing to casino gambling to lottery tickets — across multiple time horizons. Every bar on the chart answers one question: *if you repeat this activity, does the math work for you or against you?*

---

## How It Works

Each activity is assigned a **per-event edge** (the percentage advantage or disadvantage on each bet, trade, or year of holding). Returns are projected across seven time horizons using one of two models:

| Model | Used For | Formula |
|-------|----------|---------|
| **Compound** | Investing, trading, crypto | `((1 + annual_return)^years - 1) x 100` |
| **Linear (DU/CED)** | Casino, sports, poker, lottery | `DU_period x (CED/100) x edge` |

Where **DU** = Decision Units (frequency per day, varies by activity) and **CED** = Capital Exposure per Decision (% of bankroll risked, varies by activity). This replaces the old hardcoded `N × 0.10 × edge` formula, making cross-category comparisons realistic.

The linear model intentionally has **no floor** — losses can exceed -100% to show the true cumulative cost of repeated negative-edge bets over time.

### Time Horizons

| Horizon | Investing (Compound) | Gambling (Linear) |
|---------|---------------------|-------------------|
| 1 Bet / 1 Trade | 1 trading day (1/252 yr) | 1 event |
| 1 Day | 1 trading day (1/252 yr) | 2 bets |
| 1 Week | 1/52 year | 12 bets |
| 1 Month | 1/12 year | 52 bets |
| 1 Year | 1 year | 625 bets |
| 5 Years | 5 years | 3,125 bets |
| 10 Years | 10 years | 6,250 bets |

Gambling events are pro-rated from a **625 bets/year** baseline (≈ 25 sessions × 25 bets/session — casual/recreational frequency).

---

## Project Structure

```
Edge_Spectrum/
├── README.md                  ← You are here
├── Data/                      ← Raw edge data (Markdown tables)
│   ├── edge_analysis.md       ← V1: Original 99 activities, ranked by edge
│   ├── edge_analysis2.md      ← V2: Added "$100 becomes..." time horizons
│   ├── edge_analysis3.md      ← V3: Pure % returns, no -100% floor
│   ├── edge_analysis4.md      ← V4: +23 stock indexes, +12 bond indexes
│   ├── edge_analysis5.md      ← V5: +5 trading, +5 poker, +5 lottery entries
│   ├── edge_analysis6.md      ← V6: Real Estate overhaul, +5 predictions, +10 collectibles
│   ├── edge_analysis7.md      ← V7: Fee-adjusted returns + tax impact layer
│   ├── edge_analysis8.md      ← V8: Time horizon overhaul (5→7 calendar-anchored horizons)
│   ├── edge_analysis9.md      ← V9: Complete 180-point dataset with 7 horizons
│   ├── edge_analysis10.md     ← V10: Standardized DU/CED framework (per-activity frequency + position sizing)
│   └── edge_analysis11.md     ← V11: Streamlined to 156 entries (removed Options + Active Trading)
├── Versions/                  ← Interactive HTML charts (Plotly.js)
│   ├── V1.html                ← Initial dark-theme bar chart
│   ├── V2.html                ← Refined header and layout
│   ├── V3.html                ← Category filter buttons added
│   ├── V4.html                ← Time horizon selector + metrics bar
│   ├── V5.html                ← Code cleanup and class refactoring
│   ├── V6.html                ← Tooltip grouping and UX polish
│   ├── V7.html                ← 124 data points, all V5 data
│   ├── V8.html                ← 151 data points, real estate + collectibles + predictions
│   ├── V9.html                ← 176 data points, fee-adjusted + tax impact layer toggle
│   ├── V10.html               ← Layer button auto-hide, +4 Options tax entries
│   ├── V11.html               ← UI overhaul, Insights dropdown, Dollar Cost + Addiction Risk
│   ├── V12.html               ← Design refresh (zinc palette, favicon, multi-select categories)
│   ├── V13.html               ← Mobile responsive (bottom-drawer tooltip, tap interaction, compact layout)
│   ├── V14.html               ← Time horizon overhaul (7 calendar-anchored horizons)
│   ├── V15.html               ← DU/CED standardized model (per-activity frequency + position sizing)
│   └── V16.html               ← Latest: Streamlined to 156 entries (removed Options + Trading), adaptive Y-axis
└── Docs/                      ← Ideas, backlog, and history
    ├── change_log.md          ← Version-by-version changelog (V1–V16)
    ├── ideas.md               ← High-level feature requests
    └── improvement_ideas.md   ← 29 improvement ideas with status tracking
```

---

## Data Files

All data lives in `Data/` as Markdown tables. Each version builds on the previous one.

### edge_analysis.md (V1 — Foundation)
- **99 activities** across 9 categories
- Raw edge percentages ranked best-to-worst
- Establishes the core category taxonomy

### edge_analysis2.md (V2 — Time Standardization)
- **67 data points** with 5 time horizons
- Introduced the "$100 Becomes..." metric
- Split into compound (investing) and linear (gambling) models

### edge_analysis3.md (V3 — No Caps)
- **94 data points** with pure percentage returns
- Removed the -100% floor on gambling losses
- Added "Scale of Destruction" section showing 1-year ranges

### edge_analysis4.md (V4 — Index Expansion)
- **~110 data points** with major index additions
- **+23 stock entries:** QQQ, IVW, VBR, MDY, NOBL, VTI, SPY/VOO, RSP, DIA, IVE, IWM, SPYD, VNQ, EFA, FTSE 100, DAX, Nikkei 225, EEM, GLD, DJP, plus retail stock picking and penny stocks
- **+12 bond entries:** HYG/JNK, CWB, LQD, BIL, 10-Year Treasury, BND/AGG, MUB, AGG, BNDX, SHY, TIP, TLT
- Merged options selling/buying into single "Options" category; removed swing trading

### edge_analysis5.md (V5)
- **~124 data points**
- **+5 Active Trading:** Systematic Trend Following (+5%), Social/Copy Trading (-12%), Momentum Trading (-18%), CFD Trading (-28%), Binary Options (-40%)
- **+5 Poker & Skill-Based:** Elite Professional (+8%), Backgammon Tournament (+3%), Mid-Stakes Reg (+1.5%), Recreational Live Cash (-10%), Sit & Go Average (-15%)
- **+5 Lottery:** $1 Scratch-Off Best Odds (-25%), Premium Scratch-Off (-30%), Daily Numbers (-42%), State Pick 6 (-45%), Multi-State Cash4Life (-55%)

### edge_analysis6.md (V6)
- **~151 data points**
- **Real Estate overhaul:** Replaced 2-entry REIT/Rental section with 10 physical property types (apartments, industrial, SFH, commercial, retail, vacation rental, raw land, flipping, timeshare). VNQ moved to Stock Market (ETF).
- **+5 Prediction Markets:** Metaculus Scientific (-3.5%), Polymarket Geopolitics (-4%), Polymarket Sports/Entertainment (-4.5%), Polymarket Crypto Prices (-5%), Kalshi Weather Events (-7%)
- **+10 Collectibles & Alternatives (NEW CATEGORY):** Vintage Sports Cards (+6%), Fine Art (+5%), Fine Wine (+4%), Classic Cars (+3.5%), Luxury Watches (+3%), Numismatic Coins (+1.5%), Sneaker Reselling (-5%), Modern Art Speculation (-10%), Non-Vintage Cards (-15%), NFT Art (-50%)

### edge_analysis7.md (V7 — Current)
- **~176 data points** — most comprehensive version (151 raw + 8 fee-adjusted + 17 tax-adjusted)
- **+8 Fee-Adjusted Returns:** S&P 500 after various fee structures (0.03% index → 2-and-20 hedge fund), bond fund after 1% advisory fee. Shows fee erosion on investor edge.
- **+17 Tax Impact Entries:** After-tax returns across 7 categories — LTCG (20%), STCG (37%), qualified dividends (15%), ordinary income, tax-exempt munis, IRS 28% collectibles rate, gambling winnings as ordinary income.
- **New Layer toggle UI:** Third control row with Raw / Fee-Adjusted / After-Tax / Show All buttons. Fee bars have green outlines, tax bars have amber outlines.

---

## Chart Versions

All charts are standalone HTML files in `Versions/` — open any of them directly in a browser. They use [Plotly.js](https://plotly.com/javascript/) loaded from CDN (internet connection required).

| Version | Key Changes |
|---------|-------------|
| **V1** | Initial implementation. Dark theme, green-to-red color gradient, basic hover. |
| **V2** | Compact header/legend bar, full-viewport flex layout. |
| **V3** | **Category filter buttons** — click to isolate Stocks, Casino, Sports, etc. |
| **V4** | **Time horizon selector** + live metrics bar (count, best, worst, spread). Dual control rows. |
| **V5** | Internal refactor — shorter CSS class names, same functionality as V4. |
| **V6** | Enhanced tooltips with grouped comparisons within subcategories. UX polish. |
| **V7** | 124 data points from edge_analysis5.md. 15 new entries across Active Trading, Poker, and Lottery. |
| **V8** | 151 data points from edge_analysis6.md. Real Estate restructured as physical property. +Collectibles category. +5 Prediction Markets. |
| **V9** | 176 data points from edge_analysis7.md. Fee-adjusted returns (8) + tax impact layer (17). New Layer toggle control row. |
| **V10** | Layer buttons auto-hide when category has no fee/tax data. +4 Options tax entries (Section 1256 60/40 rule). |
| **V11** | UI overhaul: single control bar, category dropdown, Insights dropdown. Dollar Cost Comparison + Addiction Risk Score features. 180 data points. |
| **V12** | Design refresh: zinc-based dark theme, inline SVG favicon, multi-select category dropdown, translucent controls, frosted-glass tooltip. |
| **V13** | Mobile responsive: bottom-drawer tooltip, tap-to-view interaction, compact stacked controls, horizontal scroll time buttons. |
| **V14** | Time horizon overhaul: 7 calendar-anchored horizons (1 Bet → 10 Years), fixed misaligned gambling/investing mappings. |
| **V15** | DU/CED standardized model: per-activity decision frequency and capital exposure replace hardcoded 10% position size. |
| **V16** | **Latest.** Streamlined to 155 entries (removed Options, Active Trading, Poker Elite Pro). Casino + Poker off by default. Adaptive Y-axis + tick formatting. |

### Chart Features (V16)
- **Category Multi-Select Dropdown:** Toggle any combination of categories — color-coded dots, checkbox toggles, "All" select/deselect
- **Layer Toggle:** Raw Returns, Fee-Adjusted, After-Tax, Show All — auto-hides when category has no overlays
- **Time Horizon Toggle (7 horizons):** 1 Bet, 1 Day, 1 Week, 1 Month, 1 Year, 5 Years, 10 Years — calendar-anchored with pro-rated gambling events (625 bets/year baseline)
- **Insights Dropdown (NEW):**
  - **Dollar Cost Comparison:** $100/week invested → shows dollar outcome in tooltip (invested, value, gain/loss)
  - **Addiction Risk Score:** 1–5 rating per activity based on feedback loop speed and variable reward patterns; risk-colored bar outlines + block meter in tooltip
- **Metrics Bar:** Live count, best performer, worst performer, point spread
- **Rich Tooltips:** Activity name, return badge, category, edge per event, type, volatility, win probability, skill factor, addiction risk (when active), all-horizon breakdown, dollar cost (when active), grouped peer comparison
- **Color Encoding:** Green (player edge) → Yellow (break even) → Red (house edge), with category-colored outlines (or risk-colored when Addiction Risk is active)

---

## Categories

| Category | Model | Count (V8) | Edge Range |
|----------|-------|------------|------------|
| Stock Market | Compound | 22 | +12.5% to -30% annual |
| Bond Market | Compound | 12 | +5.5% to +1.5% annual |
| Real Estate | Compound | 10 | +10% to -12% annual |
| Cryptocurrency | Compound | 7 | +45% to -70% annual |
| Options & Derivatives | Mixed | 10 | +10% to -60% per event |
| Active Trading | Compound | 8 | +5% to -40% annual |
| Collectibles & Alternatives | Compound | 10 | +6% to -50% annual |
| Sports Betting | Linear | 18 | -4.55% to -35% per bet |
| Casino Gambling | Linear | 20 | +1% to -35% per bet |
| Poker & Skill-Based | Linear | 13 | +8% to -20% per bet |
| Prediction Markets | Linear | 12 | -3% to -10% per bet |
| Lottery & Scratch-Offs | Linear | 9 | -25% to -55% per bet |

---

## Docs

### ideas.md
High-level feature requests: standardized time horizons, descriptive labels, category filters, UI simplification.

### improvement_ideas.md
**29 detailed improvement ideas** with implementation tracking (✅/🔶/⬜):

- **Visual Enhancements (9):** Color gradients ✅, interactive chart ✅, risk overlay 🔶, "time until broke", confidence intervals, animations ✅, metrics bar ✅, compact header ✅, enhanced tooltips ✅
- **Content Additions (6):** "Perceived vs. Reality", compounding ✅, fee-adjusted returns, tax impact, parlay deep dive, expanded data ✅
- **Engagement Features (8):** "Guess the edge" quiz, dollar cost comparison ✅, time-to-double calculator, famous bets, addiction risk ✅, twin comparison, breakeven skill, annual cost reframe
- **Advanced Ideas (6):** Monte Carlo simulation, Kelly Criterion, category filters ✅, Buffett commentary, social sharing, personal edge audit

---

## Quick Start

1. Open `Versions/V16.html` in any modern browser (desktop or mobile)
2. Use the **Category** buttons to filter by activity type
3. Use the **Time** buttons to switch between time horizons
4. Hover any bar for detailed breakdown and peer comparison

---

## Tech Stack

- **Plotly.js 2.32.0** — Interactive charting (CDN-loaded)
- **Vanilla HTML/CSS/JS** — No build step, no dependencies beyond Plotly
- **Markdown** — All source data stored as human-readable tables

---

## Versioning Rules

**Never modify existing files in `Data/` or `Versions/`.** Always create a new sequentially numbered file instead.

- **Data changes:** When adding, removing, or altering any data points, create a new `edge_analysis{N+1}.md` file (e.g., after `edge_analysis5.md` comes `edge_analysis6.md`). Document what changed in the header section of the new file.
- **Chart changes:** When updating the visualization — new data, UI changes, bug fixes — create a new `V{N+1}.html` file (e.g., after `V7.html` comes `V8.html`). Update the title and footer version number in the new file.
- **Why:** This preserves a full history of how the data and visualization evolved over time. Any previous version can be opened and compared at any time.

---

## Data Sources & Disclaimer

Edge percentages are based on published house edges, historical index returns, and academic research on retail trader outcomes. All figures represent **expected (average) returns** — individual outcomes will vary due to variance, especially over short time horizons.

**For educational purposes only.** This is not financial or gambling advice.
