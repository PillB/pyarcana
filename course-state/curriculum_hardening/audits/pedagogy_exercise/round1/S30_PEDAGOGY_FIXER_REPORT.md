# S30 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Entity resolution probabilístico
- **id:** `security-infra` (index 30; archivo histórico `s30-security-infra.ts` — contenido = motor ER testeable CP-N3-A, no “infra de seguridad” genérica)
- **source:** `src/lib/course/sections/s30-security-infra.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S30_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved solution outputs except **S30-T3-A-E1** (justified integrity fix: weights so the defect is observable by output)
- Validated optional schema fields already in `src/lib/types.ts`; `tsc --noEmit` PASS

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (youDo: retrospective only; context already frames)
- [x] Every We Do has short `title` (4–12 words)
- [x] `instruction` is task-only steps (E1 names defect; E2 less breadcrumb; E3 transfer surface)
- [x] Outputs preserved except T3-A-E1 (starter 1.5 → solution 0.75)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### I Do (8) — P1
| Unit | Changes |
|------|---------|
| S30-T1-A-DEMO | preamble (email/tokens); expanded why (score [0,1] no veredicto); retrospective (crudo vs normalizado) |
| S30-T1-B-DEMO | preamble (vacío ≠ pelea); expanded why (missing + rareza didáctica); retrospective |
| S30-T2-A-DEMO | preamble (recall se calcula); expanded why (∩ vs theory acentos); retrospective |
| S30-T2-B-DEMO | preamble (filter_before_score); expanded why (CPU + calidad); retrospective |
| S30-T3-A-DEMO | preamble (umbrales duales); expanded why (no probabilidad calibrada); retrospective |
| S30-T3-B-DEMO | preamble (transitividad → S31); expanded why (label_space sin fraud); retrospective |
| S30-T4-A-DEMO | preamble (anti-leakage); expanded why (subset entidades); retrospective |
| S30-T4-B-DEMO | preamble (pairwise + co-cluster); expanded why (P/R + slices); retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (razonamiento anclado a cola clerical / batch / portfolio CP-N3-A)

| Batch | Units |
|-------|-------|
| T1-A | E1 exact post-norm, E2 Jaccard unión, E3 date_sim tolerancia |
| T1-B | E1 missing, E2 peso rareza, E3 missing informativo por fuente |
| T2-A | E1 fold acentos, E2 candidate recall ∩, E3 pares candidatos multi-bloque |
| T2-B | E1 costo SLO (diferenciado de T2-A-E3), E2 person≠org, E3 filter_before_score |
| T3-A | E1 score normalizado (**fixture pesos 1.0/1.0**), E2 banda review, E3 ítem clerical |
| T3-B | E1 Union-Find transitividad, E2 cola sin fraud, E3 filtrar labels ajenos |
| T4-A | E1 train por subset, E2 prevalencia, E3 train/test/cross_split |
| T4-B | E1 precisión tp/fp, E2 recall con fn, E3 error slices top |

**Diferenciación T2-A-E3 vs T2-B-E1:** preambles anclan “espacio de candidatos del blocking” vs “SLO de CPU del batch”; fixtures y outputs distintos (10 vs 13) conservados.

### You Do (1) — P1
- Added `retrospective` (defensa: invariante recall o P/R sin cross_split; PII vs `CASO-LIM-030`; impacto medible 30s; score sin explain insuficiente)
- `context` / objectives / requirements / rubric / starter left intact

## Code / output integrity
- **S30-T3-A-E1 (justified):** pesos cambiados de 0.5/0.5 a 1.0/1.0 para que el starter sin dividir imprima `1.5` y la solution `0.75`. Con pesos que sumaban 1 el defect era invisible por salida.
- **All other** starter/solution code and output strings preserved
- Spot-checked oracles: `exact 1.0`, `lopez|lim`, `0.5` recall, `filter_before_score`, `0.875` clerical, `cross_split`, `missing_phone`

## Residual risks (for Round 2)
1. Section `id: "security-infra"` / filename `s30-security-infra.ts` vs content ER remains product debt (out of scope)
2. Conceptual solape C(n,2) T2-A-E3 / T2-B-E1 mitigated in prose only; code intentionally similar
3. Hints E1 nearly-solution remain acceptable for guided; E3 hints still give formulas
4. You Do is broad (full motor); retrospective anchors defense without new code requirements
5. Feedback lengths enriched but not re-audited word-by-word against the 25–60 band for every unit

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); exercise-level titles 24 weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective
- T3-A-E1 execute: starter path → 1.5; solution → 0.75
