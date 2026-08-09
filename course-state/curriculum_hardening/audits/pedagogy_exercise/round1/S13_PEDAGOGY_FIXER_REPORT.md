# S13 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Familiarity Evidence Dashboard y cierre de nivel
- **id:** `rpa-automation` (index 13; archivo histórico `s13-rpa-automation.ts` — contenido es Evidence Dashboard / ER N1, no RPA de browser)
- **source:** `src/lib/course/sections/s13-rpa-automation.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S13_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / light `why` and `description` expansions
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
| S13-T1-A-DEMO | preamble (misma persona vs familia; norm_doc + block paterno); description clarified; expanded why; retrospective → We Do norm/block/score |
| S13-T1-B-DEMO | preamble (PR + cola clerical; FP≠fraude); expanded why; retrospective → formulas + report ético |
| S13-T2-A-DEMO | preamble (familiaridad operativa; pesos 0.5/0.3/0.2; kinship None); description clarified; expanded why; retrospective |
| S13-T2-B-DEMO | preamble (evidencia no acusación; graphlet A–B + via D); expanded why; retrospective |
| S13-T3-A-DEMO | preamble (0.6/0.4, uncertainty med, gap no dispara high); expanded why; retrospective |
| S13-T3-B-DEMO | preamble (orden de estados; 0.40/0.80; nunca auto_fraud/is_family); expanded why; retrospective |
| S13-T4-A-DEMO | preamble (3 fichas + scores etiquetados; pseudo A***); expanded why; retrospective |
| S13-T4-B-DEMO | preamble (runbook CF-1; demo no escribe «aprobado»); expanded why; retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only; removed “Concepto: S13-T… Entrada: fixture…” drill template)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` where the review called out thin one-liners (T1-A-E1/E3, T1-B-E1/E2/E3, T2-A-E1/E2/E3, T2-B-E1/E2/E3, T3-A-E1/E2/E3, T3-B-E1/E2/E3, T4-A-E1/E2/E3, T4-B-E1/E2/E3)

| Batch | Units |
|-------|-------|
| T1-A | E1 norm name/doc, E2 blocking paterno\|región, E3 er_score 1.0/0.5/0.0 |
| T1-B | E1 precision/recall, E2 cola clerical, E3 PR + fp_not_fraud |
| T2-A | E1 shared email sin vacíos, E2 variante geo+apellido 0.6/0.4, E3 score canónico + disclaimer |
| T2-B | E1 direct txs bidireccional, E2 intersección vecinos, E3 via + disclaimers no colusión/parentesco |
| T3-A | E1 3 bullets, E2 uncertainty band, E3 conflicto ER vs REL |
| T3-B | E1 thresholds config, E2 decide_ops_status matriz, E3 strip is_family/auto_fraud |
| T4-A | E1 pseudonymize, E2 case_sheet claves canónicas, E3 map tooltip source= |
| T4-B | E1 privacy synthetic_only, E2 demo --synthetic, E3 incidente + regresión S01–S13 |

### You Do (1) — P1
- Added `retrospective` (defense triad: invariante DECISION_MATRIX + ER≠REL; real vs sintético PII/egress/roles; frase de impacto 30 s)
- Left context / objectives / requirements / rubric / starter DEFECTS intact

## Code / output integrity
- **No** starter/solution code or output strings modified
- Spot-checked: iDo ER `entity_resolution_score 1.0`; T1-B-E3 `precision 0.833` / `recall 0.714`; T2-A-E3 disclaimer exacto; T3-B-E2 `0.9 high needs_review`; T4-B-E3 `rotate_secret|redact_logs|postmortem`
- Defects in starters left intentional (pedagogical)
- Residual drill phrase `Concepto: S13-T…` in weDo instructions: **0**

## Residual risks (for Round 2)
1. Section `id: "rpa-automation"` / filename vs content “Evidence Dashboard” remains product debt (out of scope this round)
2. T2-A-E2 variant 0.6/0.4 must stay labeled as practice variant vs canónico 0.5/0.3/0.2 — preambles do this; Round 2 should re-confirm no contradiction with theory
3. Exact test strings in E3s (`fp_not_fraud`, disclaimers, demo cmd, level1_regression) must not be “improved” in code
4. You Do cognitive load (5 DEFECTS + 9 + 13 rows) is intentional for N1 close; retrospective pushes defense, not more features
5. Volume of prose: Round 2 should spot-check E1/E2/E3 transfer cues within each subtopic are not near-clones

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); We Do step titles 24; instruction/feedback 24 weDo
- Per-unit field scan: no missing title/preamble/instruction/retrospective/feedback on weDo; no missing preamble/why/retrospective on iDo
- `npx tsc --noEmit -p .` → exit 0
- Output integrity spot-check PASS
- Drill-template residual in weDo instructions: 0

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 13 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
