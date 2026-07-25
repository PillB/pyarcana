# S18 Pedagogy Fixer Report (Round 1)

## Section
- **title:** EDA, estadística descriptiva e incertidumbre
- **id:** `data-engineering` (archivo `s18-data-engineering.ts`; contenido = EDA + incertidumbre)
- **source:** `src/lib/course/sections/s18-data-engineering.ts`
- **review input:** `round1/S18_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s18-data-engineering.ts` (prose fields + instruction/feedback polish).
- **No** generators, bulk templates, or cross-section paste.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, output spot-checks, and `tsc --noEmit`.

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
| S18-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: centro dual mean/median → robustez MAD/ratio/log1p → sesgo de cuota LIMITADA → IC z + d + bootstrap + no_probado → confusor residual + claim no causal → Tukey por región sin culpa → Q→H→E con decision None → nota de datos seed/sha1.

### We Do (24)
For each E1/E2/E3:
- `title` (4–12 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (25–60 words band)

Order implemented: T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B (E1→E2→E3 per subtopic).

Ethical / portfolio weight loaded in preambles of **T3-A-E3** (claim no causal), **T3-B-E1/E3** (flag ≠ fraude), **T2-B-E3** (bootstrap ≠ rango 95% de tickets), **T4-A-E3** (L obligatorio), **T4-B-E2/E3** (sha1[:8] + seed).

### You Do (1)
- Added `retrospective` de defensa/portafolio (n+cobertura, z vs bootstrap, flag/r no son fraude/causa, seed+sha1_8, frase de impacto hacia S19).
- Left `context` / `objectives` / `requirements` / `rubric` / starter checkpoints unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Bug a corregir:` | **Unchanged** |
| Seeds (18, 21, 42, 1, 3, 7) | **Unchanged** |
| Claim `asociacion_observada_no_causal` | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: mean 30.4 / IQR 4.0 / std 1.5811 / ratio 2.43 / MAD 1.0 / log1p list / share_Lima 0.75 / bias 0.3 / max_bias 0.4 / margen 0.98 / d 1.5 / boot_ic95 (10.89, 31.17) / r 1.0 / spearman 1.0 / r_raw 0.828 / n_hi 1 / tasa_Lima 1.0 / bilateral mask / pregunta / solo_hallazgo / L: solo web / 2aa26ec9 / seed 42 / demo mean 30.5 / no_probado / claim / sha1 07e9d521
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Legacy `id: "data-engineering"` vs content EDA/incertidumbre — product residual, out of scope.
2. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
3. You Do starter remains partially filled (checkpoints); retrospective mitigates “solo descomentar”; not emptied in Round 1.
4. Cognitive density of T2-B (IC/d/bootstrap) and T3-A (confusor) remains; preambles keep one primary goal.
5. Hints still somewhat guided on E1s by design; optional fade polish on E3 hints if learners over-rely.

## Files touched
1. `src/lib/course/sections/s18-data-engineering.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S18.md`

---

Section 18 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
