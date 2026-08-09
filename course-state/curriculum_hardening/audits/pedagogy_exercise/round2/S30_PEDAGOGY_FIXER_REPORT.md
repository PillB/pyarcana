# S30 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Entity resolution probabilístico
- **id:** `security-infra`
- **source:** `src/lib/course/sections/s30-security-infra.ts`
- **Round-2 review:** `round2/S30_EXERCISE_PEDAGOGY_REPORT.md`
- **Method:** hand edits only; no generators, bulk templates, or scripts for prose

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (already present; residual polish applied)
- [x] We Do has short `title`
- [x] `instruction` is task-only (mental paso-4 removed where residual)
- [x] Exact outputs preserved (no code/output changes)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1

| Unit | Change |
|------|--------|
| **S30-T4-A-E1** | Retrospective expanded (~21 w → principle + calibration impact + self-check e1–e4 mixto + bridge E2). |
| **S30-T3-A-E3** | Feedback documents score-norm trap when weights sum to 1; retrospective de-echoed (product bug on explain / auto sin phone / bridge UF). **No code re-weight** — outputs preserved. |

### P2 — de-echo weDo retrospectives

Feedback kept as *why the starter failed + operational impact*. Retrospective rewritten to *principle + distinct misconception or self-check + transfer*:

| Unit | Retro focus after fix |
|------|------------------------|
| T1-A-E2 | Unión comparable entre pares; self-check 1/3 vs 1/2 |
| T1-B-E1 | Tres estados; maquillar vacío ≠ re-etiquetar en E2 |
| T1-B-E3 | Cobertura por fuente; self-check web_form |
| T2-A-E3 | Pares *dentro* de bloque; bloque size 1 |
| T2-B-E1 | SLO de capacidad vs matching; bridge person≠org |
| T2-B-E2 | `True` = no gastes scorer; self-check same type |
| T3-A-E2 | Contrato de tres bandas; self-check s=0.5 y `<=` |
| T3-B-E1 | Cluster partido → S31; path compression self-check |
| T3-B-E3 | Borde filtra labels; self-check solo fraud |
| T4-B-E1 | FP operativos; self-check tp+fp=0 |
| T4-B-E2 | Scorer vs embudo blocking; self-check tp=2,fn=0 |
| T4-B-E3 | Backlog priorizado; empate de slices |

### P2 — iDo retrospectives expanded (self-check)

T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B: each gained a concrete self-check question and/or clearer misconception; bridges to We Do preserved.

### P2 — instruction polish

| Unit | Change |
|------|--------|
| **S30-T1-A-E1** | Removed paso 4 mental (“ambos lados → `'ana'`”); steps 1–3 only. |
| **S30-T4-B-E1** | Removed paso 4 mental (2/3 → 0.67); paso 2 names `zip`. |

### Not changed (by design)

- **Code / solution outputs:** all canonical outputs unchanged (including T3-A-E3 0.875 fixture).
- **youDo:** retrospective already §8.3-complete; no residual required.
- **Hints E3:** left as minimal transfer scaffolding (optional R2 residual).
- **T2-A-E3 vs T2-B-E1:** same C(n,2) formula; preambles still distinguish candidatos vs SLO.
- **File id `security-infra`:** naming debt outside exercise prose.

## Residual risks (post-fix)

1. T3-A-E3 score-norm still *numerically* invisible if learner only checks the three dict fields; mitigated by explicit feedback note + T3-A-E1 where defect is observable (1.5 vs 0.75).
2. Filename/id vs ER content still confuses internal search (not exercise quality).
3. Optional: further soften E3 hints (T1-A-E3 / T4-A-E3) for stricter transfer purity.

## Delta vs Round-2 review

| R2 residual | Status |
|-------------|--------|
| P1 T4-A-E1 retro | **Closed** |
| P1 soft T3-A-E3 integrity | **Closed** (prose; no re-weight) |
| P2 eco feedback≈retro (~12 weDo) | **Closed** |
| P2 iDo retros cortas | **Closed** |
| P2 paso-4 mental | **Closed** (T1-A-E1, T4-B-E1) |
| Hints E3 / youDo docstring | Left optional |

Section 30 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
