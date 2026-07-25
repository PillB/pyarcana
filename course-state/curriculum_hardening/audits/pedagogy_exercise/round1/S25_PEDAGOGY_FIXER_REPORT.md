# S25 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Endpoints de IA, Hugging Face y prompting evaluado
- **id:** `streamlit-dashboards`
- **source:** `src/lib/course/sections/s25-streamlit-dashboards.ts`
- **review input:** `round1/S25_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s25-streamlit-dashboards.ts` (prose fields + instruction/feedback/why polish).
- **No** generators, bulk templates, or cross-section paste of educational prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (steps; no E_n essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S25-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–80 words), `retrospective` |

Focus: árbol choose_stack (rules primero) → model card / not_for ≠ licencia → mock HF model/label/score → caché + circuit_open → schema JSON fail-closed → tools deny+stop → golden exact/schema/field_match → request segura + minimize (regex = telemetría).

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to 25–60 words with desk/costo/HITL reasoning where it was telegraphic

Fade preserved: T1-A rules → umbral 500 → metadata sin autofraude; T1-B license_reuse → PII local → card_gate; T2-A lower+model → dict model/label → batch score; T2-B cache miss/hit → costo /1000 → circuit_open; T3-A loads → issubset → schema_fail; T3-B gate deny → log len → stop/break; T4-A exact/schema → field_match 0.5 → promote human_review; T4-B signal+request → minimize → signal_only (nunca fraud).

Ethical weight kept on **T1-A-E3** (`auto_fraud=False`) and **T4-B-E3** (`signal_only`, score ≠ fraude). Two output contracts (clasificador vs narrativo) kept distinct in preambles.

### You Do (1)
- Added `retrospective` de defensa/portafolio (eval_golden, fail-closed, frase de impacto; puente S26).
- Optional P2: one success-observable sentence on `context`; one line on `portfolioNote` for 30-second defense.
- Left `objectives` / `requirements` / `rubric` / starter code unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Bug:` / `# CASO-LIM-025` | **Unchanged** |
| Outputs: `rules` / `specialized_model` / `signal_only` / `schema_fail` / `circuit_open` / `0.001` / batch HF / `human_review` | **Unchanged** |
| You Do starter (SCHEMA_KEYS, GOLDEN, stubs) | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `S25-Tn ·` essay instructions; 24 step-style instructions
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: multi-line stack tree, `signal_only`, `human_review`, `circuit_open`, `schema_fail`, `0.001`, plan stop log, mock billing dict, `reuse_ok`, `local_or_private_vpc`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Filename/id `streamlit-dashboards` vs. IA endpoints content remains a curriculum naming lag — not “fixed” toward Streamlit in this round.
3. Two output contracts (clasificador vs narrativo) must stay explicit; preambles separate them, but You Do cognitive load remains high.
4. Hints E1 near-solution stay as designed for guided tier; Round 2 should not add more spoilers.
5. Ethical policy (score ≠ fraude, auto_fraud=False) rests in T1-A-E3, T4-B-E3, theory, self-check, and You Do — keep visible in Round 2.

## Files touched
1. `src/lib/course/sections/s25-streamlit-dashboards.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S25.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 25 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
