# Codex Operating Instructions for stokr

You are working on stokr, an AI-powered stock research platform.

## Always read before frontend redesign tasks

- /design-systems/stokr/DESIGN.md
- /skills/stokr-frontend-redesign/SKILL.md
- /skills/stokr-design-critique/SKILL.md

For stock analysis page work, also read:

- /skills/stokr-stock-analysis-page/SKILL.md

For dashboard work, also read:

- /skills/stokr-dashboard-redesign/SKILL.md

## Core rule
Preserve business logic. Improve frontend quality.

Do not remove:
- Supabase auth/database logic
- Stripe subscription logic
- API routes
- Report generation
- Caching
- SEO metadata
- Route structure
- Usage gating
- Watchlist functionality

## Preferred workflow
1. Inspect files first.
2. Explain what exists.
3. Make small safe changes.
4. Preserve functionality.
5. Run checks if possible.
6. Summarize changed files.