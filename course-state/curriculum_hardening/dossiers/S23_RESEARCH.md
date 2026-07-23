# Research dossier — S23 Browser RPA con Playwright

**Section file:** `s23-computer-vision.ts`  
**Title:** Browser RPA con Playwright (id histórico `computer-vision`; contenido = web RPA)  
**Residual:** STUB (avg_para≈93, avg_instr≈65, starters min≈7)  
**Target:** gold vs S01/S02 pedagogy + CP-N2-C web adapter contracts  

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Web Application Technologies* / browser automation tracks; Google *IT Automation with Python* (Selenium-era patterns evolved to Playwright auto-wait) |
| MIT | MIT OCW web engineering — DOM roles, accessibility tree as stable automation surface |
| Stanford | HCI / web systems notes — user-visible names vs CSS fragility; session/state management |
| Harvard | CS50 Web — forms, auth flows, defensive automation against flaky waits |
| Yale | Digital systems / UX accessibility primers — role/name locators align a11y with test stability |
| GitHub | `microsoft/playwright` + `playwright-python`; Page Object examples; trace viewer docs; storage_state session reuse samples |
| Video | Playwright official “Getting started” / Trace Viewer walkthroughs; “API first then UI” talks from test automation conferences |

## Coverage gaps in current stub
- Theory under-explains auto-waiting vs `sleep`, download verification (hash/size), and API>export>RPA preference with documented reason.
- Instructions short; need contracts with fixture server concepts and exact pass strings.
- Ethics/ToS: CAPTCHA and ToS-forbidden → abort/handoff, never bypass.
- Starters need richer DOM/session fixtures and one clear defect.

## Expansion plan
1. Deepen 9 theory blocks (≥3 × ≥180 chars) with synthetic Peru portal (local fixture, America/Lima ops) and progressive disclosure (Playwright concepts via dict models where runtime not required).
2. Expand 24 weDo instructions ≥150 chars with I/O contracts.
3. Enrich starters; preserve solution outputs; no later-only APIs; no CAPTCHA bypass recipes.
