# S32 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Feature engineering y pipelines sin leakage
- **id:** `microservices` (index 32; archivo histórico `s32-microservices.ts` — contenido = tabla de features versionada del workbench CP-N3-B, no microservicios de red)
- **source:** `src/lib/course/sections/s32-microservices.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S32_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields; `tsc --noEmit` PASS

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (youDo: retrospective only; context already frames)
- [x] Every We Do has short `title` (4–12 words)
- [x] `instruction` is task-only steps (E1 names defect; E2 less breadcrumb; E3 transfer surface)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### I Do (8) — P1
| Unit | Changes |
|------|---------|
| S32-T1-A-DEMO | preamble (catálogo antes de fit; serve inventa columnas), expanded why (keys ⊆ catálogo / REJECT_UNKNOWN), retrospective |
| S32-T1-B-DEMO | preamble (silent fill vs indicator), expanded why (μ/σ train + z sobre filled), retrospective |
| S32-T2-A-DEMO | preamble (grafo ≠ veredicto; path=99), expanded why (REJECT_LABEL / REQUEST_GRAPH), retrospective |
| S32-T2-B-DEMO | preamble (leakage temporal; half-open vs cerrado), expanded why (includes_t + REQUEST_WINDOW), retrospective |
| S32-T3-A-DEMO | preamble (fit→transform ruidoso), expanded why (router + REJECT_TRANSFORM_BEFORE_FIT), retrospective |
| S32-T3-B-DEMO | preamble (state sobrevive al notebook; fs-vN), expanded why (REJECT_UNVERSIONED / REQUEST_STATE_JSON), retrospective |
| S32-T4-A-DEMO | preamble (leakage de identidad; overlap 0), expanded why (informe n_train/n_test/overlap), retrospective |
| S32-T4-B-DEMO | preamble (scan leaky + skew; promote no es warning), expanded why (demo=detección; lab E1=gate limpio), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning anclado a cola de revisión / baseline S33 / train≡serve)

| Batch | Units |
|-------|-------|
| T1-A | E1 catalog_ok / unknown, E2 assess PASS/REJECT/MISSING, E3 REQUEST_CATALOG |
| T1-B | E1 z sobre filled, E2 silent fill + median, E3 REQUEST_MEDIAN |
| T2-A | E1 shared/degree/path sin label, E2 ban uses_label, E3 REQUEST_GRAPH_FEAT |
| T2-B | E1 half-open, E2 assess includes_t, E3 REQUEST_WINDOW |
| T3-A | E1 ModeImputer fit real, E2 try_before_fit, E3 REQUEST_FIT_STATE |
| T3-B | E1 JSON + mediana serve, E2 fs-vN assess, E3 REQUEST_STATE_JSON |
| T4-A | E1 split + overlap medido, E2 entity isolation, E3 REQUEST_SPLIT_KEYS |
| T4-B | E1 gate limpio scan/skew/id, E2 assess leakage, E3 REQUEST_FEATURE_SET_ID |

**P2 polish applied:** feedback on all 24 units enriched with cola/baseline/S33 reasoning (~25–60 words where thin).

### You Do (1) — P1
- Added `retrospective` (defensa: invariante half-open/overlap/leaky; PII sintético vs real; frase de impacto medible defendible en 30s ante quien entrena S33)
- `context` / objectives / requirements / rubric / starter left intact (already solid)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- Key oracles spot-checked present: `S32-T*-* PASS`, tríos PASS/REJECT/MISSING, tríos CONTINUE/REJECT/REQUEST, `note_len 4`, `shared 1` / `path 99`, `count 2 closed_bad 3`, `feature_set fs-v2`

## Residual risks (for Round 2)
1. Section `id: "microservices"` / filename `s32-microservices.ts` vs content “features sin leakage” remains product debt (out of scope; naming legacy)
2. Cognitive load of 24 We Do: fade E1→E2→E3 is real; Round 2 should confirm preambles stay differentiated (not clones)
3. E2 units that also read flags (`includes_t`, `uses_label`, `try_before_fit`) are intentional (contract + recompute); prose now states flag ≠ cálculo
4. Demo T4-B shows leaky/skew True while E1 uses clean fixture — coherent (detection vs promote); do not “unify” outputs
5. Feedback lengths enriched but not re-audited word-by-word against the 25–60 band for every unit

## Validation
- Field counts: preamble **32** (8 iDo + 24 weDo); retrospective **33** (+ youDo); exercise-level titles **24** weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective; all canonical output strings present

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 32 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
