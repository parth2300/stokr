# Stokr

AI-powered stock analysis platform that transforms complex SEC 10-K filings into clear, actionable insights.

---

## Overview

Stokr allows users to search any public company and instantly receive a structured breakdown of its financial health, risks, and growth potential. Instead of manually reading lengthy filings, the platform extracts and analyzes key sections using structured data and AI.

---

## Features

### Free Tier

* Limited daily searches
* Basic company overview
* Key financial metrics (revenue, net income trends)
* Short AI-generated summary

### Pro Tier

* Unlimited searches
* Full 10-K analysis
* Risk factor breakdown (Item 1A)
* Management discussion insights (Item 7)
* Financial health scoring
* Bull vs bear case analysis
* Red flag detection

---

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Next.js API routes / Node.js
* **Database:** Supabase (Postgres + Auth)
* **Data Source:** SEC EDGAR API (XBRL + filings)
* **AI Layer:** LLM for summarization and analysis

---

## How It Works

1. User enters a stock ticker
2. Ticker is mapped to SEC CIK
3. Latest 10-K filing is fetched
4. Financial data is pulled from XBRL (structured)
5. Key sections are extracted:

   * Business Overview
   * Risk Factors
   * MD&A
6. AI processes the data into insights
7. Results are displayed in a clean dashboard

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/stokr.git
cd stokr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Run the app

```bash
npm run dev
```

---

## Roadmap

* Portfolio tracking
* Stock alerts and notifications
* Company comparison tools
* Advanced financial ratios
* Mobile optimization

---

## Monetization

Freemium model:

* Free: limited insights and usage
* Pro: full analysis and unlimited access

---

## License

MIT License

---

## Disclaimer

This project is for informational purposes only and does not constitute financial advice.
