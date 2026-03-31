# The Edge Spectrum: Who Really Wins?

An interactive data visualization that compares the **expected cumulative returns** of 165+ financial activities — from index fund investing to casino gambling to lottery tickets — across multiple time horizons. Every bar on the chart answers one question: *if you repeat this activity, does the math work for you or against you?*

---

## How It Works

Each activity is assigned a **per-event edge** (the percentage advantage or disadvantage on each bet, trade, or year of holding). Returns are projected across seven time horizons using one of two models:

| Model | Used For | Formula |
|-------|----------|---------|
| **Compound** | Investing, trading, crypto, metals | `((1 + annual_return)^years - 1) x 100` |
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

## Quick Start

1. Open `Versions/Original-Theme/V18.html` in any modern browser (desktop or mobile) — this is the **latest original theme** version
2. Or open `Versions/Dark-Sidebar-Theme/V1.html` for the **new dark sidebar theme** (V19)
3. Use the **Category** dropdown to filter by activity type
4. Use the **Time** buttons to switch between time horizons
5. Hover any bar for detailed breakdown and peer comparison

---

## Project Structure

```
Betting_Spectrum/
├── README.md                          ← You are here
├── Data/                              ← Raw edge data (Markdown tables)
│   ├── edge_analysis9.md              ← V9: Complete 180-point dataset with 7 horizons
│   ├── edge_analysis10.md             ← V10: Standardized DU/CED framework
│   ├── edge_analysis11.md             ← V11: Streamlined to 156 entries
│   ├── edge_analysis12.md             ← V12: Combined V10+V11, 166 pts, 11 categories
│   └── Legacy/                        ← Archived data versions (V1–V8)
│       ├── edge_analysis.md           ← V1: Original 99 activities
│       ├── edge_analysis2.md          ← V2: "$100 becomes..." time horizons
│       ├── edge_analysis3.md          ← V3: Pure % returns, no -100% floor
│       ├── edge_analysis4.md          ← V4: +23 stock indexes, +12 bond indexes
│       ├── edge_analysis5.md          ← V5: +5 trading, +5 poker, +5 lottery
│       ├── edge_analysis6.md          ← V6: Real Estate overhaul, collectibles
│       ├── edge_analysis7.md          ← V7: Fee-adjusted + tax impact layer
│       └── edge_analysis8.md          ← V8: Time horizon overhaul (5→7)
├── Versions/                          ← Interactive HTML charts (Plotly.js)
│   ├── Original-Theme/                ← Zinc-based dark theme (V11–V18)
│   │   └── V18.html                   ← Latest original theme (V17 data + Precious Metals)
│   ├── Dark-Sidebar-Theme/            ← New sidebar layout theme
│   │   └── V1.html                    ← V19: Dark sidebar redesign
│   └── Legacy/                        ← Archived chart versions (V11–V17)
│       ├── V11.html                   ← UI overhaul, Insights dropdown
│       ├── V12.html                   ← Zinc palette, multi-select categories
│       ├── V13.html                   ← Mobile responsive
│       ├── V14.html                   ← 7 calendar-anchored horizons
│       ├── V15.html                   ← DU/CED standardized model
│       ├── V16.html                   ← Streamlined 155 entries, adaptive Y-axis
│       ├── V17.html                   ← Precious Metals category (11 categories)
│       └── V18.html                   ← V18 snapshot
├── Docs/                              ← Ideas, backlog, and history
│   ├── change_log.md                  ← Version-by-version changelog (V1–V17+)
│   ├── ideas.md                       ← High-level feature requests
│   ├── improvement_ideas.md           ← 29 improvement ideas with status tracking
│   ├── edge_standardization_analysis.md
│   └── GPT_Analysis/                  ← External analysis artifacts
│       ├── edge_standardization_analysis.md
│       ├── Standardized_conversion_guide.md
│       └── Standardized_model.xlsx
└── Screenshots/                       ← UI screenshots and bug captures
    ├── cash_savings_notshowing.png
    ├── hover_image_3-30-36.png
    └── scroll_bar.png
```

---

## Data Files

All data lives in `Data/` as Markdown tables. Each version builds on the previous one. Versions 1–8 are archived in `Data/Legacy/`.

### Current Data Files

#### edge_analysis12.md (V12 — Current Reference)
- **166 data points** across **11 categories** — combined V10 + V11 into a single reference
- Full DU/CED framework with all data tables expanded
- Excludes Options & Derivatives and Active Trading (outlier noise, not typical investor/gambler audience)

#### edge_analysis11.md (V11 — Streamlined)
- **156 entries** — removed Options, Active Trading, Poker Elite Pro
- 10 categories remain

#### edge_analysis10.md (V10 — DU/CED Framework)
- Standardized per-activity decision frequency and capital exposure
- Replaced hardcoded `N × 0.10 × edge` with `DU_period × CED × edge`

#### edge_analysis9.md (V9 — Complete Dataset)
- **180 data points** with all 7 time horizons computed

### Legacy Data Files (Data/Legacy/)

| File | Version | Key Addition |
|------|---------|-------------|
| edge_analysis.md | V1 | Original 99 activities, ranked by edge |
| edge_analysis2.md | V2 | "$100 becomes..." time horizons |
| edge_analysis3.md | V3 | Pure % returns, no -100% floor |
| edge_analysis4.md | V4 | +23 stock indexes, +12 bond indexes |
| edge_analysis5.md | V5 | +5 trading, +5 poker, +5 lottery |
| edge_analysis6.md | V6 | Real Estate overhaul, +5 predictions, +10 collectibles |
| edge_analysis7.md | V7 | Fee-adjusted returns + tax impact layer (176 pts) |
| edge_analysis8.md | V8 | Time horizon overhaul (5→7 calendar-anchored) |

---

## Chart Versions

All charts are standalone HTML files — open any directly in a browser. They use [Plotly.js](https://plotly.com/javascript/) loaded from CDN (internet connection required).

### Active Versions

| Location | Version | Description |
|----------|---------|-------------|
| `Original-Theme/V18.html` | **V18** | Latest original zinc theme. 167 data points, 11 categories incl. Precious Metals. |
| `Dark-Sidebar-Theme/V1.html` | **V19** | New dark sidebar layout with redesigned navigation. |

### Legacy Versions (Versions/Legacy/)

| Version | Key Changes |
|---------|-------------|
| **V11** | UI overhaul: single control bar, category dropdown, Insights dropdown. Dollar Cost Comparison + Addiction Risk Score. 180 data points. |
| **V12** | Design refresh: zinc-based dark theme, inline SVG favicon, multi-select category dropdown, translucent controls, frosted-glass tooltip. |
| **V13** | Mobile responsive: bottom-drawer tooltip, tap-to-view interaction, compact stacked controls, horizontal scroll time buttons. |
| **V14** | Time horizon overhaul: 7 calendar-anchored horizons (1 Bet → 10 Years), fixed misaligned gambling/investing mappings. |
| **V15** | DU/CED standardized model: per-activity decision frequency and capital exposure replace hardcoded 10% position size. |
| **V16** | Streamlined to 155 entries (removed Options, Active Trading, Poker Elite Pro). Casino + Poker off by default. Adaptive Y-axis + tick formatting. |
| **V17** | Precious Metals category added (11 categories, ~167 data points). Gold, silver, platinum group, copper, numismatics. |
| **V18** | Snapshot prior to theme split. |

> **Note:** Chart versions V1–V10 predate the current folder structure and are not archived here. See `Docs/change_log.md` for full history.

### Chart Features (V18 / Original Theme)
- **11 Categories:** Stock Market, Bond Market, Real Estate, Cryptocurrency, Precious Metals, Collectibles & Alternatives, Sports Betting, Casino Gambling, Poker & Skill-Based, Prediction Markets, Lottery & Scratch-Offs
- **Category Multi-Select Dropdown:** Toggle any combination — color-coded dots, checkbox toggles, "All" select/deselect. 9 on by default (Casino + Poker off).
- **Layer Toggle:** Raw Returns, Fee-Adjusted, After-Tax, Show All — auto-hides when category has no overlays
- **Time Horizon Toggle (7 horizons):** 1 Bet, 1 Day, 1 Week, 1 Month, 1 Year, 5 Years, 10 Years
- **Insights Dropdown:**
  - **Dollar Cost Comparison:** $100/week invested → shows dollar outcome in tooltip
  - **Addiction Risk Score:** 1–5 rating per activity; risk-colored bar outlines + block meter in tooltip
- **Metrics Bar:** Live count, best performer, worst performer, point spread
- **Rich Tooltips:** Activity name, return badge, category, edge per event, type, volatility, win probability, skill factor, addiction risk (when active), all-horizon breakdown, dollar cost (when active), grouped peer comparison
- **Color Encoding:** Green (player edge) → Yellow (break even) → Red (house edge), with category-colored outlines
- **Adaptive Y-axis:** 5th–95th percentile range + 15% padding; tick intervals scale with data range

---

## Categories

| Category | Model | Edge Range |
|----------|-------|------------|
| Stock Market | Compound | +12.5% to -30% annual |
| Bond Market | Compound | +5.5% to +1.5% annual |
| Real Estate | Compound | +10% to -12% annual |
| Cryptocurrency | Compound | +45% to -70% annual |
| Precious Metals | Compound | +7.5% to +1.0% annual |
| Collectibles & Alternatives | Compound | +6% to -50% annual |
| Sports Betting | Linear | -4.55% to -35% per bet |
| Casino Gambling | Linear | +1% to -35% per bet |
| Poker & Skill-Based | Linear | +3% to -20% per bet |
| Prediction Markets | Linear | -3% to -10% per bet |
| Lottery & Scratch-Offs | Linear | -25% to -55% per bet |

---

## Docs

### change_log.md
Version-by-version changelog covering V1 through V17+.

### ideas.md
High-level feature requests: standardized time horizons, descriptive labels, category filters, UI simplification.

### improvement_ideas.md
**29 detailed improvement ideas** with implementation tracking:

- **Visual Enhancements (9):** Color gradients, interactive chart, risk overlay, "time until broke", confidence intervals, animations, metrics bar, compact header, enhanced tooltips
- **Content Additions (6):** "Perceived vs. Reality", compounding, fee-adjusted returns, tax impact, parlay deep dive, expanded data
- **Engagement Features (8):** "Guess the edge" quiz, dollar cost comparison, time-to-double calculator, famous bets, addiction risk, twin comparison, breakeven skill, annual cost reframe
- **Advanced Ideas (6):** Monte Carlo simulation, Kelly Criterion, category filters, Buffett commentary, social sharing, personal edge audit

### GPT_Analysis/
External standardization analysis artifacts: edge standardization analysis, conversion guide, and standardized model spreadsheet.

---

## Tech Stack

- **Plotly.js 2.32.0** — Interactive charting (CDN-loaded)
- **Vanilla HTML/CSS/JS** — No build step, no dependencies beyond Plotly
- **Markdown** — All source data stored as human-readable tables

---

## Versioning Rules

**Never modify existing files in `Data/` or `Versions/`.** Always create a new sequentially numbered file instead.

- **Data changes:** Create a new `edge_analysis{N+1}.md` file. Document what changed in the header section.
- **Chart changes:** Create a new `V{N+1}.html` in the appropriate theme folder. Update the title and footer version number.
- **Theme variants:** Each visual theme gets its own subfolder under `Versions/` with independent version numbering.
- **Archiving:** When versions are superseded, move them to the `Legacy/` subfolder to keep active directories clean.
- **Why:** This preserves a full history of how the data and visualization evolved over time. Any previous version can be opened and compared at any time.

---

## Data Sources & Disclaimer

Edge percentages are based on published house edges, historical index returns, and academic research on retail trader outcomes. All figures represent **expected (average) returns** — individual outcomes will vary due to variance, especially over short time horizons.

**For educational purposes only.** This is not financial or gambling advice.
