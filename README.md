<p align="center">
  <img src="https://img.shields.io/badge/DATA_POINTS-187-2ea44f?style=for-the-badge" alt="Data Points">
  <img src="https://img.shields.io/badge/CATEGORIES-13-0078D4?style=for-the-badge" alt="Categories">
  <img src="https://img.shields.io/badge/TIME_HORIZONS-7-8B5CF6?style=for-the-badge" alt="Time Horizons">
  <img src="https://img.shields.io/badge/PLOTLY-2.32+-F97316?style=for-the-badge&logo=plotly&logoColor=white" alt="Plotly">
  <img src="https://img.shields.io/badge/STREAMLIT-Deployed-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" alt="Streamlit">
</p>

<h1 align="center">The Edge Spectrum</h1>

<p align="center">
  <b>Who Really Wins?</b><br>
  <sub>An interactive visualization comparing expected cumulative returns of 167+ financial activities<br>
  — from index fund investing to casino gambling to lottery tickets — across 7 time horizons.</sub>
</p>

<p align="center">
  Every bar answers one question: <i>if you repeat this activity, does the math work for you or against you?</i>
</p>

---

## 📸 Screenshots

<table>
<tr>
<td width="33%" align="center">

**Original Theme**
![Original Theme](Screenshots/App/Original_Theme.png)
`Versions/Original-Theme/V18.html`

</td>
<td width="33%" align="center">

**Dark Sidebar Theme**
![Dark Sidebar Theme](Screenshots/App/Dark_Sidebar_Theme.png)
`Versions/Dark-Sidebar-Theme/V1.html`

</td>
<td width="33%" align="center">

**Light Vertical Theme**
![Dark Sidebar Theme](Screenshots/App/Light_Theme.png)
`Versions/Light-Vertical-Theme/V2.html`

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# Standalone HTML — no install, just open in any modern browser
```

1. **Original Theme** — Open `Versions/Original-Theme/V18.html`
2. **Dark Sidebar** — Open `Versions/Dark-Sidebar-Theme/V1.html`
3. **Light Vertical** — Open `Versions/Light-Vertical-Theme/V2.html`
4. Use the **Category** dropdown to filter by activity type
5. Use the **Time Horizon** buttons to switch periods (1 Bet → 10 Years)
6. **Hover** any bar for a detailed breakdown and peer comparison

```bash
# Streamlit app — Python web app, deploys to Streamlit Cloud
cd Versions/Streamlit
pip install -r requirements.txt
streamlit run streamlit_app.py
```

> [!NOTE]
> The HTML versions are standalone (Plotly.js from CDN). The Streamlit version is a Python port of the Dark-Sidebar-Theme deployable to [share.streamlit.io](https://share.streamlit.io/) — see `Versions/Streamlit/README.md`.

---

## 🧮 How It Works

Each activity is assigned a **per-event edge** — the percentage advantage or disadvantage per bet, trade, or year of holding. Returns are projected using one of two models:

| Model | Used For | Formula |
|:------|:---------|:--------|
| **Compound** | Investing, crypto, metals, real estate | `((1 + annual_return)^years - 1) × 100` |
| **Linear (DU × CED)** | Casino, sports, poker, lottery | `DU_period × (CED / 100) × edge` |

- **DU** = Decision Units — how many bets/trades per time period (varies by activity)
- **CED** = Capital Exposure per Decision — % of bankroll risked per event (varies by activity)

> [!IMPORTANT]
> The linear model has **no floor** — losses can exceed -100% to show the true cumulative cost of repeated negative-edge bets over time.

### Time Horizons

| Horizon | Investing (Compound) | Gambling (Linear) |
|:--------|:---------------------|:------------------|
| 1 Bet / 1 Trade | 1 trading day (1/252 yr) | 1 event |
| 1 Day | 1 trading day | DU × 1 day |
| 1 Week | 1/52 year | DU × 7 days |
| 1 Month | 1/12 year | DU × 30 days |
| 1 Year | 1 year | DU × 365 days |
| 5 Years | 5 years | DU × 1,825 days |
| 10 Years | 10 years | DU × 3,650 days |

---

## 📊 Features

| Feature | Description |
|:--------|:------------|
| **13 Categories** | Stocks, Bonds, Real Estate, Crypto, Precious Metals, Collectibles, Insurance & Annuities, Sports Betting, Casino, Poker, Prediction Markets, Lottery |
| **Category Multi-Select** | Toggle any combination with color-coded dots and checkboxes |
| **3 Projection Layers** | Raw Returns, Fee-Adjusted, After-Tax — plus an overlay mode showing all |
| **7 Time Horizons** | 1 Bet → 10 Years, one click to switch |
| **Rich Tooltips** | Name, category, return badge, all-horizon grid, volatility, win probability, skill factor |
| **Dollar Cost Comparison** | Toggle $100/week projection to see dollar outcomes |
| **Addiction Risk Scoring** | 1–5 rating per activity with color-coded risk meters |
| **Adaptive Y-Axis** | 5th–95th percentile range with smart tick scaling |

---

## 📁 Project Structure

```
Betting_Spectrum/
├── README.md
├── Data/                          ← Raw edge data (Markdown tables)
│   ├── edge_analysis12.md         ← Current: 166 pts, 11 cats, DU/CED framework
│   ├── edge_analysis11.md         ← Streamlined 156 entries
│   ├── edge_analysis10.md         ← DU/CED standardization
│   ├── edge_analysis9.md          ← Complete 180-point dataset
│   └── Legacy/                    ← Archived V1–V8 data
├── Versions/                      ← Interactive HTML charts + Streamlit app
│   ├── Original-Theme/
│   │   └── V18.html               ← Latest original zinc theme
│   ├── Dark-Sidebar-Theme/
│   │   └── V1.html                ← V19: Sidebar navigation redesign
│   ├── Light-Vertical-Theme/
│   │   ├── V1.html                ← V20: Light blue, vertical bars
│   │   └── V2.html                ← V21: Centered, hover-only labels
│   ├── Streamlit/                 ← Python port of V19, deployed to Streamlit Cloud
│   │   ├── streamlit_app.py       ← UI + chart logic
│   │   ├── data.py                ← 187-row dataset (Python mirror of HTML RAW array)
│   │   ├── requirements.txt
│   │   ├── README.md              ← Local + deploy instructions
│   │   └── .streamlit/config.toml ← Dark theme palette
│   └── Legacy/                    ← Archived V11–V17
├── Docs/                          ← Changelog, ideas, analysis
│   ├── change_log.md
│   ├── improvement_ideas.md
│   └── GPT_Analysis/
└── Screenshots/
    └── App/
```

---

## 🎨 Theme Variants

| Theme | Version | Layout | Style |
|:------|:--------|:-------|:------|
| **Original** | V18 | Horizontal control bar, vertical bars | Dark zinc palette, frosted-glass tooltips |
| **Dark Sidebar** | V19 (V1) | Left sidebar navigation | Near-black with indigo accents |
| **Light Vertical** | V20 (V1) | Top control bar, horizontal bars | Light blue, full-width scrollable |
| **Light Vertical Centered** | V21 (V2) | Top control bar, centered chart | Light blue, hover-only labels, no y-axis text |
| **Streamlit (Python)** | V19 port | Streamlit sidebar + main canvas | Dark theme, hosted on Streamlit Community Cloud |

Each theme has its own subfolder under `Versions/` with independent version numbering. The Streamlit port mirrors V19 (Dark-Sidebar-Theme) but is written in Python — see [Maintenance](#-maintenance--keeping-versions-in-sync) below for sync rules.

---

## 📋 Categories & Edge Ranges

| Category | Model | Edge Range |
|:---------|:------|:-----------|
| Stock Market | Compound | +12.5% to -30% annual |
| Bond Market | Compound | +5.5% to +1.5% annual |
| Real Estate | Compound | +10% to -12% annual |
| Cryptocurrency | Compound | +45% to -70% annual |
| Precious Metals | Compound | +7.5% to +1.0% annual |
| Collectibles | Compound | +6% to -50% annual |
| Insurance & Annuities | Compound | +5% to +2% annual |
| Sports Betting | Linear | -4.55% to -35% per bet |
| Casino Gambling | Linear | -0.46% to -35% per bet |
| Poker & Skill-Based | Linear | +5% to -20% per bet |
| Prediction Markets | Linear | -3% to -10% per bet |
| Lottery & Scratch-Offs | Linear | -25% to -55% per bet |

---

<details>
<summary><b>📖 Data File History</b></summary>

### Current Data Files

| File | Key Changes |
|:-----|:------------|
| **edge_analysis12.md** | 166 data points, 11 categories, combined V10+V11 reference |
| **edge_analysis11.md** | Streamlined to 156 entries — removed Options, Active Trading |
| **edge_analysis10.md** | DU/CED framework replaces hardcoded position sizing |
| **edge_analysis9.md** | Complete 180-point dataset with all 7 horizons |

### Legacy Data (Data/Legacy/)

| File | Version | Key Addition |
|:-----|:--------|:-------------|
| edge_analysis.md | V1 | Original 99 activities |
| edge_analysis2.md | V2 | "$100 becomes..." time horizons |
| edge_analysis3.md | V3 | Pure % returns, no -100% floor |
| edge_analysis4.md | V4 | +23 stock indexes, +12 bond indexes |
| edge_analysis5.md | V5 | +5 trading, +5 poker, +5 lottery |
| edge_analysis6.md | V6 | Real Estate overhaul, collectibles |
| edge_analysis7.md | V7 | Fee-adjusted returns + tax impact layer |
| edge_analysis8.md | V8 | Time horizon overhaul (5 → 7) |

</details>

<details>
<summary><b>📜 Chart Version History</b></summary>

| Version | Key Changes |
|:--------|:------------|
| **V18** | Latest original zinc theme. 167 data points, Precious Metals added. |
| **V19** | Dark sidebar layout redesign with indigo accents. |
| **V20** | Light blue vertical theme. Horizontal bars, top control bar, scrollable. |
| **V21** | Centered chart. Y-axis labels removed — name + value shown on bar + hover tooltip. |
| **V17** | Precious Metals category (11 categories, ~167 data points). |
| **V16** | Streamlined 155 entries. Casino + Poker off by default. Adaptive Y-axis. |
| **V15** | DU/CED standardized model. |
| **V14** | 7 calendar-anchored time horizons. |
| **V13** | Mobile responsive. Bottom-drawer tooltips. |
| **V12** | Zinc palette. Multi-select categories. Frosted-glass tooltip. |
| **V11** | UI overhaul. Insights dropdown. Dollar Cost + Addiction Risk. |

> Versions V1–V10 predate the current structure. See `Docs/change_log.md` for full history.

</details>

<details>
<summary><b>📐 Versioning Rules</b></summary>

**Never modify existing files in `Data/` or `Versions/`.** Always create new sequentially numbered files.

- **Data changes** → new `edge_analysis{N+1}.md`
- **Chart changes** → new `V{N+1}.html` in the appropriate theme folder
- **Theme variants** → new subfolder under `Versions/` with independent numbering
- **Archiving** → move superseded versions to `Legacy/` subfolders

This preserves a full history — any previous version can be opened and compared at any time.

</details>

---

## 🔄 Maintenance — Keeping Versions in Sync

> [!IMPORTANT]
> **For agents and contributors:** the Streamlit app at `Versions/Streamlit/` is a live-deployed Python port of V19 (Dark-Sidebar-Theme). When you make data or feature changes, you must propagate them to the Streamlit version **in parallel** — it is the only deployed/hosted artifact and will silently drift if forgotten.

### When to update `Versions/Streamlit/`

| If you change... | Then also update... | Why |
|:-----------------|:--------------------|:----|
| The `RAW` array in any new HTML version (add/remove/edit a row) | `Versions/Streamlit/data.py` — `RAW` list | Keeps the deployed app's dataset accurate |
| `ALL_CATS`, `CC` (category colors), `HZ_DAYS`, `I_Y`, `AR_DEFAULT` constants | Same constants in `Versions/Streamlit/data.py` | Ensures math + theming match |
| Sidebar filters, time horizons, projection layers | `Versions/Streamlit/streamlit_app.py` (sidebar block + `filter_data`) | Mirrors UX across HTML and Streamlit |
| Math formulas (`gambRet`, `invRet`) | `gamb_ret` / `inv_ret` in `streamlit_app.py` | Keeps numbers identical across versions |
| Hover/tooltip content fields | `customdata` and `hover` template in `streamlit_app.py` | Streamlit uses Plotly's hovertemplate, not the HTML floating card |

### Sync workflow

1. Make the HTML version change first (e.g., new `V20.html` in `Dark-Sidebar-Theme/`)
2. Mirror the same change in `Versions/Streamlit/data.py` and/or `streamlit_app.py`
3. Smoke test: `cd Versions/Streamlit && python -c "from data import RAW; print(len(RAW))"`
4. Commit both changes in the same commit so the deployed app stays in lockstep with the source HTML
5. Push to `master` — Streamlit Community Cloud auto-redeploys within ~30 seconds

### What's intentionally different in the Streamlit version

- Custom dropdowns/pills replaced with native `st.multiselect` / `st.radio` / `st.checkbox`
- Floating 420px tooltip card replaced with Plotly's `hovertemplate` panel
- DCA / Addiction Risk / Ruin Probability toggles extend the hover panel rather than overlay traces
- These differences are **deliberate** and should not be "fixed" by porting the HTML chrome verbatim — Streamlit has its own UX conventions

---

## 🛠 Tech Stack

<p>
  <img src="https://img.shields.io/badge/Plotly.js-2.32.0-3F4F75?style=flat-square&logo=plotly&logoColor=white" alt="Plotly.js">
  <img src="https://img.shields.io/badge/HTML-Standalone-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-Custom_Properties-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla_ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Streamlit-1.37+-FF4B4B?style=flat-square&logo=streamlit&logoColor=white" alt="Streamlit">
  <img src="https://img.shields.io/badge/Data-Markdown_Tables-000000?style=flat-square&logo=markdown&logoColor=white" alt="Markdown">
</p>

- **HTML versions:** Zero build step — open any `.html` file directly in a browser. No npm, no bundler.
- **Streamlit version:** Python (`streamlit + plotly + pandas`) — deployable to Streamlit Community Cloud.
- **All data is human-readable** — Markdown tables in `Data/`, Python list in `Versions/Streamlit/data.py`.

---

## ⚠️ Disclaimer

Edge percentages are based on published house edges, historical index returns, and academic research on retail trader outcomes. All figures represent **expected (average) returns** — individual outcomes will vary due to variance, especially over short time horizons.

> [!CAUTION]
> **For educational purposes only.** This is not financial or gambling advice.

---

<p align="center">
  <sub>Built with <a href="https://plotly.com/javascript/">Plotly.js</a> · No dependencies · Open any HTML file to explore</sub><br>
  <sub><b>GAMBLING: LINEAR DECAY · INVESTING: COMPOUND APPRECIATION</b></sub>
</p>
