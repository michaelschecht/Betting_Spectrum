# Edge Spectrum V9 - Standardized Conversion Guide

This guide converts the uploaded **Edge Spectrum V9** dataset into a standardized framework using two explicit assumptions for every row:

- **DU/day** = decision units per day
- **CED** = capital exposure per decision

That lets you compare stocks, bonds, crypto, sports betting, casino gambling, poker, options, prediction markets, and lottery tickets with the same model.

## Core Standardization Model

### Universal fields

- **DU (Decision Unit):** one discrete capital-at-risk decision
- **DU/day:** the assumed average number of decisions per day
- **CED:** the % of bankroll or capital exposed per decision
- **OriginalEdgePct:** the original edge input from V9

### Formulas

#### Linear rows

```
Standardized Return = DU × CED × Edge
```

#### Compound rows

```
Standardized Return = (1 + (Edge × CED))^Years - 1
```

#### 1 Decision for compound rows

```
Years per decision = 1 / (DU/day × 365)
```

## Why this is better than the original model

In V9, the linear categories were driven by a hidden assumption:

```
N * 0.10 * edge_per_bet
```

That hard-coded a **10% bankroll wager per bet**, which makes casino, sports betting, and some derivatives rows hard to compare against long-term investments. The standardized model fixes that by making **DU/day** and **CED** explicit and editable.

## What was converted

- **180 rows**
- **12 categories**
- Original rows imported from `/mnt/data/edge_analysis9.md`
- A standardized workbook was built so you can edit DU/day and CED directly

## Category-level default assumptions used to seed the workbook

| Category | Items | Avg_Edge | Avg_DU_per_Day | Avg_CED | Compound_Items | Linear_Items |
|---|---|---|---|---|---|---|
| Active Trading | 10 | -20.98 | 5.03 | 8.00% | 10 | 0 |
| Bonds | 16 | 3.42 | 0.01 | 100.00% | 16 | 0 |
| Casino Gambling | 21 | -6.47 | 107.38 | 0.41% | 0 | 21 |
| Collectibles | 11 | -4.79 | 0.02 | 59.09% | 11 | 0 |
| Cryptocurrency | 10 | 3.94 | 0.08 | 56.00% | 10 | 0 |
| Lottery | 9 | -41.56 | 0.20 | 0.50% | 0 | 9 |
| Options & Derivatives | 14 | -10.50 | 1.88 | 27.36% | 8 | 6 |
| Poker & Skill-Based | 14 | -2.68 | 123.14 | 1.01% | 0 | 14 |
| Prediction Markets | 12 | -5.08 | 0.40 | 3.00% | 0 | 12 |
| Real Estate | 12 | 3.96 | 0.00 | 96.67% | 12 | 0 |
| Sports Betting | 18 | -14.04 | 1.59 | 1.78% | 0 | 18 |
| Stock Market | 33 | 6.56 | 0.03 | 96.52% | 33 | 0 |

## Important interpretation notes

- **Stocks, bonds, real estate, and collectibles** still behave mainly as time-based compounding assets
- **Sports betting, casino gambling, poker, prediction markets, and lottery** behave mainly as decision-frequency models
- **Options & derivatives** and **active trading** are hybrids, so DU/day and CED matter a lot
- The defaults in the workbook are **editable scenario assumptions**, not hard claims

## Recommended next step

Use the `Standardized_Model` sheet in the workbook to:

1. change DU/day
2. change CED
3. compare 1 day / 1 week / 1 month / 1 year / 5 year / 10 year outputs across categories

## Files

- `Original_V9`: clean import of the uploaded dataset
- `Standardized_Model`: editable standardized model
- `Category_Summary`: category rollups
- `Dashboard`: quick visuals
