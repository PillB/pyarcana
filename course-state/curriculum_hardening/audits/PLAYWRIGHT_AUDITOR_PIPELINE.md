# Playwright visible-paragraph + auditor loop (current)

Generated: 2026-07-23T23:01:41.032305+00:00

## Commands
```bash
# Full crawl + audit (requires localhost:3000)
BASE_URL=http://localhost:3000 FROM=1 TO=52 node scripts/playwright_auditor_loop.mjs
# Or steps:
BASE_URL=http://localhost:3000 FROM=1 TO=52 node scripts/playwright_visible_paragraphs.mjs
python3 scripts/lesson_auditor_agent.py --from 1 --to 52
```

## Latest metrics
- Visible high issues: **0**
- Visible med issues: **3** (mostly residual false-short UI; headings de-penalized)
- Mean rank: **9.52**
- Sections crawled OK: **52/52**
- Auditor ACCEPT / REQUEST_FIX / REJECT: **52 / 0 / 0**

## Loop policy
1. Crawl user-visible theory text with Playwright.
2. Auditor may **REJECT_HARDENING** if bulk ethics tails or theater reappear.
3. Auto-strip boilerplate (loop script) or fixer agents expand thin contracts.
4. Re-crawl → re-audit until ACCEPT.

## What we fixed this round
- Stripped bulk "documentas entrada…" ethics paste (auditor reject).
- Expanded 66 thin "Contrato operativo" shells with *Por qué / Cómo verificarlo*.
- Heading-aware crawler (short titles not flagged as thin prose).
- S28 starter depth regression (<80 chars) fixed.
