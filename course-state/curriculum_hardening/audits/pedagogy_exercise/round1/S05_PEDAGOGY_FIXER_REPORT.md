# S05 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Funciones, contratos y descomposición
- **id:** `oop` (archivo histórico `s05-oop.ts`)
- **source:** `src/lib/course/sections/s05-oop.ts`
- **review input:** `round1/S05_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s05-oop.ts` (prose fields + instruction/feedback/hint polish).
- **No** generators, bulk templates, or cross-section paste.
- Preserved all canonical `solutionCode.output` strings (no integrity renames).
- Validated with field counts, oracle spot-checks on key solutions, and `tsc --noEmit`.

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
| S05-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–70 words), `retrospective` |

Focus: return vs print, default mutable, pre/post email, tupla de dominio, orquestador delgado, idempotencia, closure LEGB, verde-refactor-verde.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (25–60 words band)
- P2 soft-hints where the review called out full one-liners (e.g. T1-A-E2, T2-A-E3, T4-A-E2/E3, T4-B-E3)

T3-B-E1 preamble explicitly warns: starter can be idempotent yet **wrong policy** (`999-000 True`).

### You Do (1)
- Added `retrospective` de defensa/portafolio (idempotencia por normalizador, I/O en S08, frase de impacto, orquestador delgado).
- Left `normalize_record` key `"nombres"` and starter asserts unchanged (documented residual, not renamed).

## Code/output integrity
| Area | Action |
|------|--------|
| All `solutionCode.output` | **Unchanged** |
| Starter `# FALLO:` | **Unchanged** |
| Messages (`email sin @`, `hint no valida en runtime`, `PASS   a  b  → A B`, estrategia raise+borde) | **Unchanged** |
| Optional T4-B-E2 re-assert idempotencia post-refactor | **Not applied** (review optional; would not change printed output) |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Spot-check Python oracles (return/title/default/keyword-only/factory/suite): PASS
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Legacy `id: "oop"` / filename vs content (funciones, not classes) — product residual, out of scope.
2. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
3. Hints still somewhat guided on a few E1s by design; E2/E3 soft-hints may need another fade pass if learners still over-rely on them.
4. You Do clave `nombres` vs section-wide `nombre` — document only unless product decides rename + tests together.

## Files touched
1. `src/lib/course/sections/s05-oop.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S05.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 5 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
