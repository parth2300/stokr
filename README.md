# stokr

stokr is an AI-assisted stock research platform designed to make public-company research faster and easier to understand.

The application combines SEC filing data, financial metrics, market data, and AI-generated analysis into a single interface. Users can search publicly traded companies, review financial health metrics, analyze SEC filings, compare annual filings, build watchlists, and monitor selected companies through a personalized dashboard.

> **Disclaimer:** stokr is an informational research tool. It does not provide financial, investment, or trading advice.

---

## Current Scope

stokr currently focuses on helping users research U.S. public companies using company-reported SEC data and supporting market information.

The current application includes:

* Public-company search using SEC company data
* Stock overview and market information
* Historical stock price charts
* SEC financial metric extraction
* Financial and valuation scoring
* AI-generated 10-K analysis
* Year-over-year 10-K filing comparison
* Risk, signal, and management discussion extraction
* User authentication
* Personal watchlists
* Premium research dashboard
* Saved analysis reports
* Risk alerts and filing-change tracking
* Stripe subscription management
* Progressive Web App support

---

## Core Features

### Company Search

Users can search for public companies by ticker symbol or company name.

Company identifiers are sourced from the SEC's public company ticker dataset. Search results include the company's:

* Ticker
* Company name
* CIK

Search data is cached to reduce repeated requests to SEC services.

---

### Stock Overview

Each stock has a dedicated research page containing available market and company information.

Current stock pages can display:

* Current share price
* Price movement
* Market capitalization
* Historical price chart
* Financial metrics
* Financial score
* Valuation score
* Combined fundamental score
* AI filing analysis
* Filing comparison
* Watchlist controls

Market information is primarily retrieved through Finnhub.

---

### Stock Price Charts

Historical chart data uses multiple data sources and fallback mechanisms.

The current flow attempts to retrieve chart data from:

1. Finnhub
2. Alpha Vantage
3. Current quote data as a fallback

Chart results are cached to reduce external API requests and improve response times.

---

## SEC Financial Analysis

stokr integrates directly with SEC EDGAR data.

The application currently uses:

* SEC company ticker data
* SEC company submissions
* SEC Company Facts/XBRL data
* SEC filing documents

Financial information is extracted from SEC Company Facts and converted into standardized metrics used throughout the application.

The current scoring system includes:

* Financial Score
* Valuation Score
* Final Fundamental Score

The final fundamental score combines available financial and valuation information into a single research metric.

These scores are internal research metrics and should not be interpreted as investment recommendations.

---

## AI-Powered Filing Analysis

stokr uses OpenAI to transform SEC filing information into structured, plain-English research.

The current AI analysis pipeline:

1. Finds the company's latest 10-K through SEC EDGAR
2. Downloads the filing
3. Extracts and prepares relevant filing text
4. Sends the prepared filing information to OpenAI
5. Converts the response into structured analysis
6. Stores the result in Supabase for reuse

Analysis can include:

* Company summary
* Health score
* Important signals
* Risk factors
* Bull-case factors
* Bear-case factors
* Red flags
* Management Discussion & Analysis observations
* Revenue-segment information
* Filing notes

Generated reports are cached by filing accession number so the same filing does not need to be repeatedly processed.

### Current Filing Support

The production analysis pipeline currently analyzes the company's latest **10-K**.

10-Q analysis is not currently implemented in the main filing-analysis backend.

---

## Filing Comparison

stokr can compare a company's two most recent 10-K filings.

The comparison system retrieves both filings from SEC EDGAR and uses AI to identify meaningful differences between them.

Current comparisons include:

* Overall changes
* Risk-factor changes
* Business changes
* Management commentary changes
* Changes in emphasis between filings

Comparison results are stored in Supabase and reused when the same filing pair has already been analyzed.

---

## Watchlists

Authenticated users can create watchlists and add stocks they want to monitor.

Watchlist functionality includes:

* Creating watchlists
* Adding stocks
* Removing stocks
* Viewing tracked companies
* Dashboard integration

Current plan limits are:

**Free**

* 1 watchlist
* Unlimited stocks within that watchlist

**Premium**

* Unlimited watchlists
* Unlimited stocks within watchlists

---

## Research Report Limits

AI-generated reports have usage controls to limit repeated generation costs.

Current free access provides:

* 3 reports
* Per rolling 7-day period

Premium users receive unlimited report access.

Generated reports are cached, allowing previously generated filing analysis to be reused instead of unnecessarily generating duplicate AI reports.

---

## Premium Dashboard

Premium users have access to a dedicated research dashboard.

The dashboard is designed to combine information from a user's watchlists, saved analysis, financial metrics, and alerts.

Current dashboard functionality includes:

* Watchlist overview
* Saved reports
* Financial-health insights
* Valuation insights
* Risk alerts
* Filing changes
* "What Changed" information
* Watchlist score summaries
* Reports that may need refreshing

Dashboard routes are protected by premium-access checks.

---

## Authentication and User Data

Authentication and application data are handled through Supabase.

The application currently uses Supabase for functionality including:

* Authentication
* User profiles
* Watchlists
* Watchlist items
* Cached market data
* Cached financial metrics
* Cached AI analysis
* Filing comparisons
* Report usage
* User alerts
* Subscription access information

The current code references the following Supabase tables:

```text
profiles
watchlists
watchlist_items
analysis_cache
filing_comparison_cache
financial_metrics_cache
market_data_cache
report_usage
user_alerts
```

Database migrations or schema definitions are not currently included in this repository, so a compatible Supabase database schema must already exist.

---

## Premium Subscriptions

Stripe is used for premium subscription management.

The current integration includes:

* Stripe Checkout
* Customer billing portal
* Stripe webhooks
* Subscription-status synchronization
* Premium access control

Premium access can be determined from:

* Active Stripe subscriptions
* Trialing subscriptions
* Paid access remaining after cancellation
* Application access tiers
* Administrative premium overrides

---

## Progressive Web App

stokr includes Progressive Web App support.

The application contains:

* Web app manifest
* Service worker
* App icons
* Maskable icon
* Standalone display support
* Offline page

Features that depend on live APIs, authentication, market prices, AI reports, watchlists, or billing still require an internet connection.

---

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* Recharts

### Backend

* Next.js API Routes
* Supabase
* OpenAI API
* Stripe

### Financial Data

* SEC EDGAR
* SEC Company Facts/XBRL
* Finnhub
* Alpha Vantage

### Testing

* Vitest
* React Testing Library
* jsdom

---

## Project Structure

```text
stokr/
├── app/
│   ├── about/
│   ├── api/
│   │   ├── account/
│   │   ├── analysis-cache/
│   │   ├── dashboard/
│   │   ├── filing-comparison/
│   │   ├── generate-analysis/
│   │   ├── search-stocks/
│   │   ├── sec/
│   │   ├── stock-chart/
│   │   ├── stock-overview/
│   │   ├── stripe/
│   │   ├── top-stocks/
│   │   └── watchlists/
│   ├── components/
│   │   ├── account/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── watchlist/
│   ├── dashboard/
│   ├── lib/
│   ├── login/
│   ├── offline/
│   ├── pricing/
│   ├── stocks/
│   ├── terms/
│   └── watchlist/
├── public/
├── test/
├── types/
└── package.json
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stokr
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

The current application references the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# SEC
SEC_USER_AGENT=

# Market Data
FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PREMIUM_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# Application
NEXT_PUBLIC_SITE_URL=

# Optional analytics
NEXT_PUBLIC_GA_ID=
```

`ALPHA_VANTAGE_API_KEY` is used as a fallback source for historical chart data.

`NEXT_PUBLIC_GA_ID` is only required when Google Analytics is being used.

### 4. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Scripts

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

Run tests in watch mode:

```bash
npm test
```

Run the test suite once:

```bash
npm run test:run
```

Launch the Vitest UI:

```bash
npm run test:ui
```

---

## Testing

The repository currently contains automated tests covering areas including:

* Signup validation
* Top-stocks API response headers
* Top-stocks table behavior

Tests are implemented using Vitest and React Testing Library.

---

## Caching

Because stokr depends on multiple external APIs, caching is used throughout the application.

Current caching includes:

* SEC company ticker data
* Stock overview data
* Historical market data
* Financial metrics
* AI filing analysis
* Filing comparisons
* Popular-stock data

Caching is performed through a combination of:

* In-memory server caches
* Next.js caching
* HTTP cache headers
* Supabase persistence

This reduces repeated external API calls and limits unnecessary AI generation.

---

## Data Sources

stokr currently integrates with:

**SEC EDGAR**

Used for company identification, filings, submissions, and financial facts.

**Finnhub**

Used for stock quotes, company information, and market data.

**Alpha Vantage**

Used as a fallback source for historical chart data.

**OpenAI**

Used to convert filing information into structured research summaries and filing comparisons.

**Supabase**

Used for authentication, persistent application data, caching, watchlists, reports, alerts, and user access information.

**Stripe**

Used for premium subscription billing and subscription lifecycle management.

---

## Current Limitations

The current repository has several areas that remain under active development:

* The primary AI filing-analysis endpoint currently supports 10-K filings rather than general 10-K and 10-Q analysis.
* Filing comparison currently compares the latest two 10-K filings.
* Some dashboard functionality depends on cached reports and financial metrics already existing for watched companies.
* External API availability and API-plan restrictions can affect market-data availability.
* Database migration and schema files are not currently included in the repository.
* Quote-based fallb
