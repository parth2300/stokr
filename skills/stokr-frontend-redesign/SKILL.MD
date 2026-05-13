---
name: stokr-frontend-redesign
description: Redesign stokr frontend pages while preserving all app logic.
---

# stokr Frontend Redesign Skill

## Role
Act as a senior product designer and senior frontend engineer.

## Mandatory reading
Before editing, read:

- /design-systems/stokr/DESIGN.md
- /skills/stokr-design-critique/SKILL.md

## Goal
Improve the frontend design of the existing stokr Next.js app.

Make it feel like:
- Premium fintech SaaS
- Linear/Vercel-inspired
- Dark-mode first
- Credible
- Clean
- Traceable
- Beginner-friendly without being childish

## Non-negotiable constraints
Do not remove or rewrite:

- Supabase auth logic
- Supabase database calls
- Stripe subscription logic
- Stripe webhook assumptions
- API routes
- Report generation logic
- Caching logic
- SEO metadata
- Existing route structure
- Usage gating
- Watchlist behavior
- Existing environment variable usage

Do not change database schema unless explicitly asked.

## Allowed changes
You may change:

- Layout
- Tailwind classes
- Component structure
- Visual hierarchy
- Typography
- Spacing
- Responsive behavior
- Card styling
- Loading states
- Empty states
- Error states
- Navbar/footer consistency
- Helper icons/tooltips
- Presentational components

## Workflow
1. Inspect the target page/component.
2. Identify what data and logic are already present.
3. Preserve that logic.
4. Make the smallest safe visual pass first.
5. Improve mobile responsiveness.
6. Run checks if possible.
7. Summarize changed files.
8. List any risky areas for manual review.

## Design quality bar
Every changed page should pass this checklist:

- No horizontal overflow
- Mobile layout works
- Dark mode feels intentional
- Cards use consistent spacing
- CTA hierarchy is clear
- Source transparency is visible where relevant
- Financial disclaimer exists where relevant
- No investment advice language
- No business logic removed
- No fake data dependencies added