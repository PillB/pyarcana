# S39 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Responsible ML Case Triage y cierre de nivel
- **id:** `integrator-phase2` (index 39; `s39-integrator-phase2.ts`)
- **source:** `src/lib/course/sections/s39-integrator-phase2.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S39_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields (`preamble?`, `retrospective?`, We Do `title?`); `tsc --noEmit` PASS

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
| S39-T1-A-DEMO | preamble (orden de etapas; score ≠ culpa), expanded why (fronteras + needs_review), retrospective |
| S39-T1-B-DEMO | preamble (owners + major_on_breaking), expanded why (packets huérfanos), retrospective |
| S39-T2-A-DEMO | preamble (workbench del revisor; bucket/load), expanded why (S34 + score_alone), retrospective |
| S39-T2-B-DEMO | preamble (humano gana; audit), expanded why (HITL verificable), retrospective |
| S39-T3-A-DEMO | preamble (checklist firmable de release), expanded why (blockers duros vs controles), retrospective |
| S39-T3-B-DEMO | preamble (incident → human_only; rollback), expanded why (drift vs fire), retrospective |
| S39-T4-A-DEMO | preamble (expediente ≠ auto-promoción), expanded why (CF-3 externo), retrospective |
| S39-T4-B-DEMO | preamble (valor + cards + post mórtem), expanded why (negocio ≠ solo AUC), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning anclado a cola HITL / release / CF-3)

| Batch | Units |
|-------|-------|
| T1-A | E1 orden canónico, E2 missing vs orden, E3 ER sin parentesco |
| T1-B | E1 bump major, E2 owner vs política, E3 registry conjunto |
| T2-A | E1 packet mínimo, E2 empty vs missing, E3 capas + uncertainty |
| T2-B | E1 override, E2 apelación second_reviewer, E3 audit feedback |
| T3-A | E1 secrets blocker, E2 missing vs secrets, E3 fairness slice |
| T3-B | E1 prioridad incident (≠ E2), E2 tabla de modos, E3 rollback/monitor |
| T4-A | E1 no_auto_fraud_label, E2 CF-3 sin auto-pass, E3 demo paths |
| T4-B | E1 tres cards, E2 valor operativo, E3 post mórtem blameless |

**P2 polish applied:** feedback on all 24 units enriched with cola HITL / release / expediente CF-3 reasoning (~25–60 words). T3-B-E1 vs E2 preambles differentiated (prioridad única vs tabla completa). T2-B-E2 instruction simplified to “tres salidas de assess”.

### You Do (1) — P1
- Added `retrospective` (defensa: invariante de audit + digests; `auto_fraud=False` / `self_declared_promotion=false`; frase de impacto medible en 30s; no autodeclarar promoción)
- `context` / objectives / requirements / rubric / starter left intact (already solid)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- Key oracles spot-checked present: all `S39-T*-* PASS`, tríos PASS/REJECT/MISSING, tokens CONTINUE/REJECT/REQUEST, modes, rollback, demo paths, post mórtem

## Residual risks (for Round 2)
1. Cognitive load of 24 We Do + dense N3 integration: Round 2 should re-read that E1→E3 prose fade stays distinct (especially T3-B-E1/E2)
2. T2-B-E3 `leakage_care` branch in solution not exercised by printed fixtures — optional edgeCases note; output unchanged
3. You Do starter is a mini-product; retrospective kept short so it does not compete with context
4. Feedback lengths enriched but not re-audited word-by-word against the 25–60 band for every unit

## Validation
- Field counts: preamble **32** (8 iDo + 24 weDo); retrospective **33** (+ youDo); exercise-level titles **24** weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective; all canonical output strings present

---

Section 39 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
