---
name: stokr-design-critique
description: Self-critique checklist for stokr design changes.
---

# stokr Design Critique Skill

Before finalizing frontend changes, review the output using this checklist.

## Visual hierarchy
- Is the most important action obvious?
- Are section titles clear?
- Are cards grouped logically?
- Is the page easier to scan than before?

## Trust
- Does the UI feel credible for finance?
- Are sources or source sections visible where relevant?
- Is the disclaimer present where needed?
- Is the language informational rather than advisory?

## Responsiveness
- Does mobile stack cleanly?
- Is there horizontal overflow?
- Are tables usable on small screens?
- Is the nav usable on mobile?

## Consistency
- Are cards visually consistent?
- Are badges consistent?
- Are buttons consistent?
- Is spacing consistent?

## Product preservation
Confirm:
- No Supabase logic removed
- No Stripe logic removed
- No API route behavior changed
- No report generation removed
- No caching removed
- No SEO metadata removed
- No route names changed
- No database schema changed

## Final response format
When finished, report:

1. Files changed
2. Visual changes made
3. Functionality preserved
4. Checks run
5. Risks/manual review notes