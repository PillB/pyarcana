# S23 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Browser RPA con Playwright
- **id:** `computer-vision` (archivo `s23-computer-vision.ts`; contenido = browser RPA / Playwright mental model)
- **source:** `src/lib/course/sections/s23-computer-vision.ts`
- **review input:** `round1/S23_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s23-computer-vision.ts` (prose fields + instruction/feedback polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (steps; no CASO-LIM essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S23-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: locator role+name → auto-wait por condición → integridad del download (sha) → Page Object / auth en ctx → paquete de evidencia → retry selectivo (captcha handoff) → cascada api>export>rpa → ética CAPTCHA/ToS.

### We Do (24)
For each E1/E2/E3:
- `title` (4–12 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (25–60 words band)

Order implemented: T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B (E1→E2→E3 per subtopic).

Ethical / ops weight loaded in preambles and feedback of **T3-B-E1** (no retry captcha), **T4-B-E1/E2/E3** (handoff, abort ToS, payload sin secretos), and **T4-A-*** (api-first / reason).

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariantes de la corrida de aceptación, portal real vs dicts, frase de impacto + puente OCR S24).
- Left `context` / `objectives` / `requirements` / `rubric` / starter checkpoints unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Arregla:` | **Unchanged** |
| Sandbox credentials demo/sandbox | **Unchanged** |
| Hash contract `3a6eb079`, keys, handoff lines | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `CASO-LIM-023 ·` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `n1` / `['role', 'testid', 'css']` / `need_testid` / `2` / `timeout` / pass-fail assert / form dict / `3a6eb079` / reuse-login / auth True / denied / authenticated-anonymous / evidence keys / ERR filter / trace s1 / retry policy / goto_home-retry / form checkpoint / api / export / method-reason / handoff-continue / abort / payload keys
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Legacy `id: "computer-vision"` vs content Playwright RPA — product residual, out of scope.
2. Dict lab ≠ Playwright real: learners may overclaim browser skill; I Do preambles note “misma semántica, lab sin Chromium”.
3. Some E3 hints remain near-solution (acceptable Round 1); optional soft fade in Round 2.
4. You Do has no auto-grader of acceptance prints; retrospective pushes manual verification + runbook.
5. Ethical units (T3-B-E1, T4-B-*) rely on retrospective stickiness; Round 2 may sample learner-facing length polish only.

## Files touched
1. `src/lib/course/sections/s23-computer-vision.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S23.md`

---

Section 23 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
