# S09 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Excepciones, debugging y logging seguro
- **id:** `visualization` (index 9; archivo histórico `s09-visualization.ts` — contenido es excepciones/logs/resiliencia)
- **source:** `src/lib/course/sections/s09-visualization.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S09_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / light `why` expansions
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields already in `src/lib/types.ts`; `tsc --noEmit` PASS

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
| S09-T1-A-DEMO | preamble (C001 vs N/A + cause); expanded why (chaining + Decimal); retrospective; description clarified |
| S09-T1-B-DEMO | preamble (with/else/finally order); expanded why (else del try vs if); retrospective |
| S09-T2-A-DEMO | preamble (frame útil, no row crudo); expanded why; retrospective |
| S09-T2-B-DEMO | preamble (minimal `'Solo'`); expanded why (regresión + bug silencioso distinto); retrospective |
| S09-T3-A-DEMO | preamble (campos + reloj inyectado); expanded why; retrospective |
| S09-T3-B-DEMO | preamble (máscara + assert PII); expanded why (redactar antes de format); retrospective |
| S09-T4-A-DEMO | preamble (cuarentena vs abort + reconcile S08); expanded why; retrospective |
| S09-T4-B-DEMO | preamble (retry vs quarantine ValueError); expanded why; retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` where the review called out thin one-liners (T1-A-E1/E2, T1-B-E1, T2-A-E2, T3-B-E3, T4-A-E3)

| Batch | Units |
|-------|-------|
| T1-A | E1 mapear tipos, E2 parse_monto Decimal, E3 DataLoadError from OSError |
| T1-B | E1 finally closed, E2 recover/fail-fast, E3 no tragar RuntimeError |
| T2-A | E1 anotar frames, E2 breakpoint id seguro, E3 causa_raiz frase |
| T2-B | E1 crop DNI, E2 hipótesis +51, E3 RED/GREEN de/la |
| T3-A | E1 niveles, E2 logger StringIO, E3 RESULT vs LOGS |
| T3-B | E1 máscaras, E2 correlation 3 capas, E3 audit plantilla |
| T4-A | E1 taxonomía data/config/provider, E2 process_batch reconcile, E3 should_abort |
| T4-B | E1 retry yes/no, E2 retry_call, E3 idem_key |

### You Do (1) — P1
- Added `retrospective` (defense triad: invariante reconcile/fail-fast, real vs sintético PII, frase de impacto 30 s + puente T4)
- Strengthened `context` with **éxito de corrida** (assert reconcile, cero PII completa, fail-fast `required_fields`)
- Left requirements / rubric / starter TODOs intact

## Code / output integrity
- **No** starter/solution code or output strings modified
- Spot-checked: `idem_key=banco_a:C001:v3:bc63c11b44d5`, LOGS trailing `|`, `pii_completa_ausente=True`
- Defects in starters left intentional (pedagogical)

## Residual risks (for Round 2)
1. Section `id: "visualization"` vs content “excepciones/logs” remains product debt (out of scope this round)
2. Drill-heavy E1 maps (tipos, recover/fail-fast, niveles, taxonomía, retry) remain classification tables by design; Round 2 should confirm retrospectives still carry operational meaning
3. Overlap T1-B-E2 (policy recover/fail-fast) vs T4-A-E1 (taxonomy data|config|provider) — prose differentiates; re-read for clone feel
4. T2-B-E2 depends on S07 “solo dígitos”; preamble carries the contract
5. Volume of prose: Round 2 should spot-check E1/E2/E3 transfer cues are not near-clones

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); titles 24 weDo
- Per-unit field scan: no missing title/preamble/instruction/retrospective/feedback on weDo; no missing preamble/why/retrospective on iDo
- `npx tsc --noEmit -p .` → exit 0
- Output integrity spot-check PASS

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 9 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
