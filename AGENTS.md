# Codex Agent Instructions for stokr

## Project identity

stokr is an AI-powered stock research platform for beginner-to-intermediate investors.

Public site: `https://stokr.live`

Core product promise: help users research stocks faster with AI-assisted analysis, financial metrics, charts, SEC filing context, risk summaries, and transparent research outputs.

Do not describe stokr as financial advice, a trading signal service, guaranteed-return software, or a get-rich tool. Use this disclaimer when needed:

> stokr provides informational research tools only and does not provide financial advice.

## Current stack

Use the existing stack unless explicitly instructed otherwise.

- Framework: Next.js `16.2.4`
- Router: App Router under `app/`
- React: `19.2.4`
- TypeScript: enabled
- Styling: Tailwind CSS v4 / global CSS in `app/globals.css`
- Database/auth: Supabase
- Payments: Stripe
- AI: OpenAI
- Charts: Recharts
- Market/stock data utilities: Finnhub-related code exists under `app/lib/finnhub.ts`
- Tests: Vitest
- Deployment target: DigitalOcean droplet running Node/Next behind Nginx, managed with PM2

## Required local commands

Before considering a task complete, run the relevant checks when possible:

```bash
npm run lint
npm run build
npm run test:run
```

The project scripts are:

```bash
npm run dev      # next dev --webpack
npm run build    # next build --webpack
npm run start    # next start
npm run lint     # eslint
npm run test:run # vitest run
```

If a command fails, report the exact failing file, line, and error. Do not claim success unless the command actually passed.

## Next.js 16 rule

This repository uses Next.js 16.2.4. Do not assume older Next.js behavior.

Before changing framework-sensitive code, inspect the local Next docs when available:

```bash
node_modules/next/dist/docs/
```

Follow deprecation warnings. Do not invent APIs.

## Server Components vs Client Components

Default pages/components in the App Router are Server Components.

Only use React client hooks such as `useState`, `useEffect`, `useMemo`, `useRef`, event handlers, browser APIs, or localStorage in files marked with:

```tsx
"use client"
```

If a page imports a client-only component, prefer splitting the interactive part into a separate client component instead of turning an entire page into a client component unless necessary.

Known prior build issue to avoid:

- `app/pricing/page.tsx` failed because `useEffect` was imported into a Server Component.

## Existing important paths

Preserve the existing file structure unless the task explicitly requires a restructure.

### Pages

- `app/page.tsx` — home page
- `app/about/page.tsx` — about page
- `app/pricing/page.tsx` — pricing page
- `app/login/page.tsx` — login page
- `app/dashboard/page.tsx` — dashboard page
- `app/watchlist/page.tsx` — watchlist page
- `app/stocks/[slug]/page.tsx` — dynamic stock analysis page
- `app/terms/page.tsx` — terms page
- `app/offline/page.tsx` — offline page

### Shared UI

- `app/components/navBar.tsx`
- `app/components/Footer.tsx`
- `app/components/stockSearchBar.tsx`
- `app/components/topStocksTable.tsx`
- `app/components/PWARegister.tsx`

### Analytics/stock UI

- `app/components/analytics/stockOverviewCards.tsx`
- `app/components/analytics/stockPriceChart.tsx`
- `app/components/analytics/financialMetricCards.tsx`
- `app/components/analytics/filingComparisonCard.tsx`
- `app/components/analytics/LazyFilingComparisonSection.tsx`
- `app/components/analytics/analysisReportLoading.tsx`

### Dashboard UI

- `app/components/dashboard/OptimizedDashboardContent.tsx`
- `app/components/dashboard/dashboardMetricCard.tsx`
- `app/components/dashboard/liveDashboardInsights.tsx`
- `app/components/dashboard/liveDashboardMetrics.tsx`
- `app/components/dashboard/liveDashboardWatchlist.tsx`
- `app/components/dashboard/liveRiskAlerts.tsx`
- `app/components/dashboard/liveSavedReports.tsx`
- `app/components/dashboard/liveWhatChangedToday.tsx`

### Auth/subscription/security utilities

- `app/lib/supabase.ts`
- `app/lib/supabaseAdmin.ts`
- `app/lib/apiAuth.ts`
- `app/lib/premium.ts`
- `app/lib/reportAccess.ts`
- `app/lib/watchlistLimits.ts`
- `app/lib/validateSignup.ts`
- `app/lib/validation.ts`
- `app/lib/stripe.ts`

### Stock/data/AI utilities

- `app/lib/openAi.ts`
- `app/lib/generateStockAnalysis.ts`
- `app/lib/generateFilingComparison.ts`
- `app/lib/secEdgar.ts`
- `app/lib/secMetrics.ts`
- `app/lib/finnhub.ts`
- `app/lib/formatStockChart.ts`
- `app/lib/formatTopStocks.ts`
- `app/lib/marketCache.ts`
- `app/lib/analysisCache.ts`
- `app/lib/filingComparisonCache.ts`
- `app/lib/financialMetricsCache.ts`

### API routes

- `app/api/search-stocks/route.ts`
- `app/api/top-stocks/route.ts`
- `app/api/stock-chart/route.ts`
- `app/api/stock-overview/route.ts`
- `app/api/generate-analysis/route.ts`
- `app/api/analysis-cache/route.ts`
- `app/api/filing-comparison/route.ts`
- `app/api/watchlists/route.ts`

## Product rules

### Stock analysis pages

Dynamic pages use this route pattern:

```text
/stocks/[slug]
```

Example:

```text
/stocks/apple-stock-analysis
```

Do not create fake routes like `/search?q=NVDA` unless the app already implements them.

Stock analysis pages should prioritize:

- clear price/overview cards
- readable chart section
- AI-generated research summary
- SEC filing context when available
- risks
- bull vs. bear case
- financial health metrics
- filing comparison / what changed where available
- transparent source context where possible
- watchlist add button where relevant

If no 10-K / 10-Q or filing data is available, show a graceful fallback rather than breaking the page.

### Watchlist

Watchlist behavior must work consistently in both development and production builds.

Do not rely on fragile client-only assumptions for watchlist IDs or item IDs. Validate IDs server-side and return clear errors.

Known prior issue to avoid:

- `Invalid watchlist item id`
- `Invalid watchlist id`
- working in `npm run dev` but failing in `npm run start`

### Pricing/access

Current intended pricing model:

- Free users: limited report generation
- Premium users: paid access through Stripe, currently discussed at `$9.99/month`

Do not weaken access checks. Free limits must be enforced server-side, not only through hidden buttons or frontend UI.

If exact limits are unclear from code, inspect `app/lib/reportAccess.ts`, `app/lib/premium.ts`, and related API routes before editing.

### Dashboard

Dashboard should remain protected. Do not expose private user data publicly.

If editing dashboard files, preserve:

- saved reports
- watchlist overview/insights
- risk alerts
- metrics cards
- premium/manual override logic if present

### SEO

SEO matters for stokr.

Preserve and improve:

- `app/sitemap.ts`
- `app/robots.ts`
- metadata in pages/layout
- stock-analysis route indexing where safe
- clean canonical URL behavior
- rich share previews / Open Graph metadata where implemented

Do not generate thousands of sitemap URLs blindly unless the app can serve those pages reliably and the user explicitly wants it.

### Analytics

Google Analytics is used or planned through public environment variables such as `NEXT_PUBLIC_GA`.

Do not hardcode tracking IDs unless explicitly instructed. Use environment variables.

### PWA

The project has PWA-related files/components:

- `app/manifest.ts`
- `app/components/PWARegister.tsx`
- `app/offline/page.tsx`
- icon assets under `public/` when present

Avoid broken icon paths in the manifest. Confirm paths exist before referencing them.

Known prior issue to avoid:

- manifest icon paths returning 404

## Data, API, and caching rules

### Market data

Keep API usage efficient. Preserve caching where it exists.

Known cache behavior previously used:

- Top stocks: about 15-minute cache behavior through headers such as `s-maxage=900` and `stale-while-revalidate=1800`
- Stock chart ranges commonly cache by range:
  - `1D`: short TTL around 5 minutes
  - `7D`: around 15 minutes
  - `1M`: around 60 minutes
  - `3M`: around 6 hours
  - `1Y`: around 12 hours

Before changing exact TTLs, inspect the current route code.

### Stock chart data

Preserve existing formatting utilities unless replacing them intentionally:

- `formatStockChart.ts`
- chart summary calculations inside the current chart route/helper files

Avoid fallback chart data that creates misleading identical straight-line slopes across ranges.

### OpenAI usage

Do not add unnecessary AI calls.

Prefer:

- cached analysis first
- explicit report access checks before expensive generation
- graceful loading states
- failure messages that do not expose secrets

Never expose OpenAI API keys or service-role keys to the browser.

### Supabase

Use the browser Supabase client only where safe. Use the admin client only in trusted server contexts.

Do not expose `SUPABASE_SERVICE_ROLE_KEY` or equivalent service-role credentials in client components.

Respect RLS assumptions. If a bug appears to require bypassing RLS, first inspect policies and server route auth flow.

Known schema-related issue to avoid:

- `ON CONFLICT` requires a unique or exclusion constraint. Do not add upsert conflict targets unless the database has the matching unique constraint.

### Stripe

Stripe webhook processing updates Supabase profile subscription fields.

Do not trust frontend subscription state alone. Server/API code should verify subscription/access status.

Fields previously used in `profiles` include:

- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `subscription_current_period_end`
- `access_tier`

Do not mix Stripe test and live webhook secrets.

## Styling and UX rules

stokr should feel like a modern fintech SaaS product.

Preferred tone/visual direction:

- clean
- sharp
- high-trust
- premium but not flashy
- beginner-friendly
- data-forward
- minimal clutter

Avoid:

- scammy finance aesthetics
- fake urgency
- exaggerated returns language
- excessive glow/blur effects
- overcomplicated layouts
- broken mobile spacing

Important responsive requirements:

- Dashboard and watchlist must work on small screens.
- Stock analysis pages must scroll smoothly on production builds.
- Heavy sections should be lazily loaded when practical.
- Do not remove important sections just to improve performance unless explicitly instructed.

Known performance risk areas:

- `app/stocks/[slug]/page.tsx`
- dashboard live components
- large AI report sections
- chart rendering

Use skeletons/loading states where appropriate.

## Code quality rules

- Use TypeScript types instead of `any` where reasonable.
- Preserve existing naming conventions.
- Keep edits minimal and targeted.
- Avoid unrelated refactors.
- Do not silently delete product features.
- Do not introduce new dependencies unless necessary.
- Do not store secrets in code.
- Do not duplicate large logic blocks; extract helpers when useful.
- Prefer server-side validation for anything involving auth, payments, limits, or database writes.
- Make production behavior match development behavior.

## Error handling rules

Use safe, clear errors.

For API routes:

- return proper status codes
- validate request bodies
- validate auth when required
- avoid leaking secret values or raw provider internals
- log enough for server debugging without exposing private user data

For UI:

- show usable fallback states
- do not crash on missing metrics
- protect calls like `.toFixed()` with number checks

Known prior issue to avoid:

- `Cannot read properties of undefined/null (reading toFixed)` in stock overview cards.

## Deployment rules

Production is expected to run on a DigitalOcean droplet with Nginx and PM2.

Typical production commands may include:

```bash
npm run build
pm2 restart stokr
pm2 save
sudo nginx -t
sudo systemctl reload nginx
```

Do not assume Vercel-only behavior.

Do not add code that requires serverless-only features unless confirmed compatible with the current deployment.

## Security rules

Do not weaken security to make a feature work.

Protect:

- API keys
- Supabase service-role key
- Stripe secret key
- Stripe webhook secret
- user profile data
- subscription status
- report usage limits
- watchlist data

Free usage limits should be enforced server-side. IP-based abuse mitigation may be added, but do not rely on IP alone for authenticated users.

## Marketing/copy rules

When writing copy for stokr:

Use language like:

- research stocks faster
- understand the numbers behind a company
- compare filings
- see risks more clearly
- make stock research easier to follow
- transparent research summaries

Avoid language like:

- guaranteed profits
- beat the market
- make money fast
- risk-free
- best stock to buy
- this will go up
- financial advice

## Output rules for Codex

When responding to the user after code changes:

1. State exactly what files changed.
2. State what commands were run.
3. State whether each command passed or failed.
4. Include exact next steps only when required.
5. Do not claim something was verified if it was not tested.

Use this format:

```md
## Changed files
- `path/to/file.tsx` — what changed

## Checks
- `npm run lint` — passed/failed/not run
- `npm run build` — passed/failed/not run
- `npm run test:run` — passed/failed/not run

## Notes
- Any important limitations or follow-up items.
```

## Non-negotiables

- Do not hallucinate files, routes, APIs, or environment variables.
- Inspect the repository before making changes.
- Keep changes scoped to the requested task.
- Preserve auth, payments, report limits, SEO, and source transparency.
- Never expose secrets.
- Never describe stokr as financial advice.
- Verify production build compatibility when the task affects Next.js routing, server/client boundaries, auth, Stripe, Supabase, or API routes.
