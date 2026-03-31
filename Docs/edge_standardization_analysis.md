# Edge Spectrum V9 – Standardization Analysis

## Overview
This document analyzes the current dataset and proposes a standardized framework to make all categories (investing, gambling, trading, etc.) directly comparable.

---

## What Works Well

- Clear separation of compound vs linear systems
- Consistent multi-horizon time model
- Inclusion of fees and taxes
- Broad dataset coverage (180 points)

---

## Core Problem

The dataset mixes two fundamentally different units:

### Investing
- Based on annualized returns
- Uses compounding

### Gambling
- Based on edge per bet
- Uses linear multiplication with:
  N * 0.10 * edge_per_bet

This creates inconsistency because the 0.10 (10%) assumption is hidden and not standardized.

---

## Key Issue: Hidden Position Sizing

The gambling model assumes:
- 10% of bankroll per bet

Meanwhile:
- Investing assumes ~100% capital deployment

This makes outcomes non-comparable.

---

## Solution: Introduce Universal Unit

### Capital Exposure per Decision (CED)

CED = % of bankroll risked per decision

---

## Universal Formula

Expected Return = DU × CED × Edge

Where:
- DU = number of decisions
- CED = capital exposure per decision
- Edge = expected value per decision

---

## Required Dataset Changes

### Add Columns
- DU/day
- CED (%)

### Replace
- Fixed N values with dynamic calculation:
  DU/year = DU/day × 365

---

## Decision Unit Standardization

Rename:
- "1 Trade"
- "1 Bet"

To:

### 1 Decision (DU)

---

## Example Fix (Sports Betting)

Old Model:
- 625 bets/year
- 10% per bet

New Model:
- DU/day = 5
- CED = 2%

DU/year = 1825

Return = 1825 × 0.02 × (-4.55%) ≈ -166%

---

## Final Framework

Each activity is defined by:

1. Frequency (DU)
2. Capital Exposure (CED)
3. Edge (EV)

---

## Key Insight

The difference between investing and gambling is not the asset:

It is:

Frequency × Risk × Edge

---

## Recommendation

Keep your current structure, but:

- Add DU/day
- Add CED
- Remove hardcoded assumptions

This will fully standardize your model and make cross-category comparisons valid.
