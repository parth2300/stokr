# stokr Codex Instructions

## Project

stokr is an AI-powered stock research platform for beginner-to-intermediate investors.

Website:
https://stokr.live

Core value:
Stock research without the noise. stokr helps users research companies faster using SEC filing analysis, financial metrics, charts, risk factors, bull vs bear summaries, and transparent AI-generated research summaries.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and database
- Stripe subscriptions
- Google Analytics 4
- Deployed on DigitalOcean with Nginx and PM2

## Brand style

- Clean fintech SaaS
- Dark background: `#0F172A`
- Accent blue: `#7C9DFF`
- Calm, sharp, modern, trustworthy
- Avoid hype, fake urgency, guaranteed returns, or get-rich language
- No emojis unless explicitly requested

## Compliance

stokr provides informational research tools only and does not provide financial advice.

Use this disclaimer when needed:

> stokr provides informational research tools only and does not provide financial advice.

Do not write copy that sounds like investment advice.

Do not say users will make money, beat the market, find guaranteed opportunities, or make better trades.

## Code rules

- Do not remove existing functionality unless explicitly requested.
- Do not break Supabase auth.
- Do not break Stripe checkout or webhooks.
- Do not break watchlists.
- Do not break report generation.
- Do not break Google Analytics setup.
- Do not break sitemap generation.
- Preserve existing route structure unless specifically asked to change it.
- Prefer small, focused changes.
- Always explain which files changed.
- Run or account for `npm run build` when possible.
- Fix TypeScript errors before finishing.

## Next.js App Router rules

- Do not export `metadata` from a file marked `"use client"`.
- Do not put `generateMetadata()` inside client components.
- If a page needs React hooks, keep the client logic in a client component and put metadata in a server page or layout.
- Avoid duplicate default exports.
- Do not import `useState`, `useEffect`, or browser-only logic into server components.
- Use Server Components for SEO-friendly static pages when possible.
- Use Client Components only where browser interactivity, Supabase browser auth, router actions, or analytics click handlers are needed.

## SEO rules

- Stock pages should have clean metadata.
- Blog pages should have clean metadata.
- Avoid metadata titles like:
  - `Checking report access...`
  - `Report Access`
  - `Loading...`
- Dynamic stock page metadata should follow this pattern:
  - Title: `[TICKER] Stock Analysis | AI Filing Research, Risks & Financials`
  - Description: `Research [TICKER] stock with AI-powered SEC filing analysis, financial metrics, risk factors, charts, bull vs bear summaries, and transparent research context.`
- Keep pages indexable only if they contain useful public content.
- Do not add thousands of thin pages.
- Public stock pages, blog pages, learn pages, broker pages, and comparison pages should have crawlable text where practical.
- Update `app/sitemap.ts` whenever adding important public pages.

## Analytics rules

Use GA4 event tracking for important product actions.

Recommended events:

- `sign_up`
- `login`
- `search`
- `view_stock_report`
- `generate_report`
- `add_to_watchlist`
- `click_upgrade`
- `begin_checkout`
- `purchase`
- `report_limit_reached`
- `premium_preview_seen`
- `premium_preview_click`

Only true business actions should become GA4 key events:

- `sign_up`
- `generate_report`
- `click_upgrade`
- `begin_checkout`
- `purchase`
- `report_limit_reached`

Do not treat generic events as key events:

- `page_view`
- `scroll`
- `click`
- `session_start`
- `first_visit`
- `user_engagement`

GA4 tracking code must:

- Be safe during SSR.
- Check that `window` exists.
- Check that `window.gtag` exists before firing.
- Avoid duplicate events on every re-render.
- Use `sessionStorage` where needed to prevent duplicate purchase events after refresh.

## Premium conversion rules

Free users should receive useful value before being prompted to upgrade.

Good upgrade moments:

- User hits the weekly free report limit.
- User tries a premium-only feature.
- User views a report and sees a premium preview.
- User clicks pricing or dashboard premium features.
- User wants saved report history.
- User wants deeper filing comparison.

Premium copy should focus on:

- Unlimited AI stock reports
- Full 10-K and 10-Q breakdowns
- Complete risk factor analysis
- What changed from prior filings
- Bull vs bear case summaries
- Financial health insights
- Saved research history
- Priority processing

Do not make the app feel spammy or aggressively paywalled.

## Current pricing

- Free: limited weekly AI reports and basic usage
- Premium: `$9.99/month`
- Promo code: `1MFREE` for one free month when available

## UX priorities

- Make the site feel fast, clean, and trustworthy.
- Keep pages mobile responsive.
- Avoid unnecessary heavy animations.
- Avoid clutter.
- Use clear CTAs.
- Preserve current visual identity unless asked to redesign.
- Give users natural next steps after each report.
- Use related stock links to improve session depth and internal linking.

## Blog/content rules

stokr should have an SEO-friendly blog/research section.

Blog content should be:

- Beginner-friendly
- Plain English
- Educational
- Filing-first
- Risk-aware
- Non-hype-driven
- Non-advisory

Blog content should not say:

- Buy this stock
- Sell this stock
- This stock will go up
- This stock is guaranteed
- This is a winning trade
- This will make money

Blog posts should include the disclaimer when appropriate:

> stokr provides informational research tools only and does not provide financial advice.

Preferred blog categories:

- Beginner Guide
- SEC Filings
- Stock Research
- Risk Analysis
- stokr