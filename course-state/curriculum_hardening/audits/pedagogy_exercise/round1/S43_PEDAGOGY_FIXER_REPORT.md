# S43 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Contenedores y reproducibilidad operativa
- **shortTitle:** Contenedores
- **id:** `llmops` (archivo histórico `s43-llmops.ts`; contenido = contenedores/reproducibilidad, no LLMOps de fine-tuning)
- **source:** `src/lib/course/sections/s43-llmops.ts`
- **review input:** `round1/S43_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s43-llmops.ts` (prose fields + instruction/feedback polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
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
| S43-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: layers deps-before-app + digest estable → non-root/base pinned/techo MB → secrets runtime + volumes durable/efímero → readiness/SIGTERM grace → Compose stack + retries de app → expand/contract + restore drill → multi-stage + lock sha256 → scan CVE + límites > 0 + sin shell debug.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words, unique per unit)
- `preamble` (context / goal / success / constraints bullets; fade E1 fix → E2 assess → E3 artifact text)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning and Trujillo/CP-N4-A anchor

Fade preserved: predicado invertido → tres rutas PASS/breach/MISSING → decide sobre texto Dockerfile/Compose/log/runbook/scan. DEFECT names and starter defects untouched.

### You Do (1)
- Added `retrospective` de defensa/portafolio (evidencia CP-N4-A, secretos reales vs sintéticos, frase de impacto medible; residual Compose sin k8s).
- Strengthened `portfolioNote` one line: READY exige artefactos firmados, no booleans mágicos.
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path (BLOCKED by design) unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter defects (`# DEFECT:…`, predicados invertidos, None→CONTINUE) | **Unchanged** |
| Canonical prints (PASS / REORDER / QUARANTINE / …) | **Unchanged** |
| `0 < mem ≤ 512` / `0 < cpu ≤ 1.0` contract | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 why
- weDo: 24 short title + 24 preamble + 24 retrospective; 0 residual `instruction: "S43-T…-E… · essay"` essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: layer cache demos, all 8 E1 PASS lines, all 8 E2 triple routes, all 8 E3 CONTINUE/breach/INSPECT triples
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE Master); Round 2 may tighten length without new concepts.
2. Hints still somewhat guided on E1s by design; E2/E3 soft-hints may need another fade pass if learners still over-rely on them.
3. Stdlib models without Docker daemon: preambles reiterate texto sintético; residual risk that learners install Docker unnecessarily for E3.
4. Internal id/path `llmops` / `s43-llmops.ts` still mismatches containers content — product/orchestrator concern, not exercise prose.
5. You Do starter still prints BLOCKED until artefacts exist; retrospective + portfolioNote insist on real Dockerfile/compose/runbook.
6. Feedback polish is complete for P0; length may still vary slightly across subtopics.

## Files touched
1. `src/lib/course/sections/s43-llmops.ts`
