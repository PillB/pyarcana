# S39 DONE — Responsible ML Case Triage y cierre de nivel

**Section file:** `src/lib/course/sections/s39-integrator-phase2.ts`  
**Date:** 2026-07-22  
**Status:** expanded to gold bar (curriculum hardening)

## Before / after

| Metric | Before (stub) | After |
|--------|---------------|-------|
| Bytes | 40 010 | 90 864 |
| Lines | 1 343 | 2 034 |
| Theory headings | 9 | 9 (map + 8 subtopics) |
| Subtopics / demos / exercises | 8 / 8 / 24 | 8 / 8 / 24 |
| Avg paragraph length | ~78 chars (residual STUB) | ~353 chars (min 286) |
| Avg weDo instruction | ~21 chars | ~323 chars (min 284) |
| selfCheck | 4 thin | 5 with full explanations |
| starterCode | `# TODO` empty | real dict/list fixtures + intentional defect |

## Score estimate

| Dimension | Est. |
|-----------|------|
| Structure (8×T, 24 E, iDo, youDo, selfCheck) | 9/10 |
| Theory depth + CASO-PE contracts | 9/10 |
| weDo instructions + fixtures + PASS tokens | 9/10 |
| Progressive disclosure / no fraud-from-score | 9/10 |
| Anti-stub / no TBD | 9/10 |
| **Overall gold estimate** | **~8.8–9.0 / 10** |

Meets residual “gold ≥ 8” bar vs GOLD_STANDARD_CHECKLIST and S40 contract style without importing Master CP-N4 architecture content.

## Sample paragraph (S39-T1-A, para 2 — contrato operativo)

> Contrato operativo. Entrada: payload con `run_id`, registros de intake y configuración de umbral. Salida de este subtema: stages ordenados, `label_space` en `needs_review` y bandera `auto_fraud=False`. Error: reordenar etapas, saltar ER, o mapear score a veredicto legal. Criterio de éxito: el pipeline es reproducible, fallas se aíslan por etapa y el score solo ordena trabajo humano.

## Sample weDo instruction (S39-T1-A-E1)

> S39-T1-A-E1 · Valida el contrato del pipeline canónico N3 sobre `CASO-LIM-039-T1A`. Entrada: dict con stages (lista ordenada), label_space y auto_fraud. Debe exigir el orden intake→er→relation_graph→features→model_score→queue, label_space needs_review y auto_fraud False. El starter compara el orden al revés (defecto). Salida exacta: `S39-T1-A PASS`. El fixture adverso de E2 activará `REJECT_STAGE_ORDER`.

## Verification run

- `python3 scripts/check_section_structure.py` → ok (repo S01 gate; S39 markers independently verified 8/8/24)
- `node --check src/lib/course/sections/s39-integrator-phase2.ts` → exit 0
- Manual counts: paragraphs ≥180 chars; instructions ≥150 chars; no learner-facing TBD/STUB/empty starter
- Spot-checked solution predicates for T1-A, T3-B modes, T4-A gate notes

## Notes / residual issues

- `check_section_structure.py` is still hard-wired to S01; S39 structure validated with a local marker script.
- youDo starter remains a richer e2e scaffold (intentional); weDo E1–E3 carry the graded defects.
- No Master CP-N4 / S40 DDD content copied; scope stays Responsible ML Case Triage + N3 close / CF-3 documentation only.
