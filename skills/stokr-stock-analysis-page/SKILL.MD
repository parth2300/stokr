---
name: stokr-stock-analysis-page
description: Redesign the individual stock analysis page for stokr.
---

# stokr Stock Analysis Page Skill

## Priority
This is the core stokr product page.

## User goal
A user should quickly understand:

1. What company they are viewing
2. Current market snapshot
3. Whether the business appears financially strong or weak
4. Main potential strengths
5. Main potential concerns
6. Key risks
7. What sources support the analysis
8. What action they can take next

## Required sections
Preserve or improve:

- Stock header
- Company name
- Ticker
- Exchange/sector/industry if available
- Current price
- Daily change
- Market cap
- Last updated timestamp
- Watchlist button
- Analyze/refresh report button
- Informational disclaimer
- Chart section
- Range selector: 1D, 7D, 1M, 3M, 1Y
- Financial Health Score
- Valuation signal
- Growth signal
- Profitability signal
- Risk level
- AI research summary
- Bull case
- Bear case
- Risk factors
- Source transparency
- 10-K / 10-Q references
- Filing comparison / what changed if already supported
- Report usage indicator
- Premium CTA
- Loading state
- Empty/error state

## Layout direction
Desktop:
- Strong header at top
- Market snapshot near top
- Chart and score cards near top
- Research summary below
- Bull/bear side by side
- Risks and sources clearly visible
- Source transparency should feel like a feature, not a footnote

Mobile:
- Stack cards cleanly
- Bull/bear cards stack
- Tables become cards or scroll safely
- Watchlist/analyze actions remain accessible
- No horizontal overflow

## Helper icons/tooltips
Add small question-mark helpers for:

- Bull Case
- Bear Case
- Risk Factors
- Financial Health Score
- Source Transparency
- Filing Comparison

Tooltip copy:

Bull Case:
“Reasons investors may view the company positively.”

Bear Case:
“Reasons investors may be cautious.”

Risk Factors:
“Business risks disclosed in filings or reflected in financial data.”

Financial Health Score:
“A summary signal based on available financial metrics and analysis inputs.”

Source Transparency:
“Shows where stokr pulled or derived the information from.”

## Tone rules
Use research-assistant language.

Allowed:
- Potential strength
- Potential concern
- Worth reviewing
- Research signal
- Source-backed
- Requires verification

Avoid:
- Buy
- Sell
- Guaranteed
- Moon
- Undervalued gem
- Explosive returns
- Beat the market