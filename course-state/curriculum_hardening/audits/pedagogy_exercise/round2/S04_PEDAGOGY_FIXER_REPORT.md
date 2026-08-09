# S04 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Iteración y resúmenes transaccionales
- **id:** `functions-modules`
- **index:** 4
- **source:** `src/lib/course/sections/s04-functions-modules.ts`
- **round2 review:** `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S04_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 review ledger.
- Hand-edited residual prose **only** in Section 4 source.
- **No** generators, bulk templates, or section-wide search-replace of a single retrospective pattern.
- Prefer fewer stronger sentences; preserve all `solutionCode.output` values.
- Validated: `tsc --noEmit` clean; all solution outputs present; feedback≠retrospective openers.

## What was fixed

### P1 — De-clone `feedback` vs `retrospective` (systemic)

Spec roles restored by hand on every unit that shared openers:

| Role | Content after fix |
|------|-------------------|
| **feedback** | Immediate corrective signal: what the wrong output means, where the defect lived |
| **retrospective** | Principle + misconception + transfer (+ self-check where useful) |

**Priority units (worst clones):**
- **S04-T4-B-E1** — was byte-identical; now distinct (pasos `5 25` vs principio n² / gate)
- **S04-T2-A-E2** — feedback was full prefix of retro; now report-per-intento vs cota de control
- **S04-T3-A-E1** — feedback contained in retro; now `2 1 0` diagnosis vs tres números honestos
- **S04-T1-B-E2** — nested-loops signal vs principio zip / tasa inventada

**Additional We Do de-clones (same campaign, hand-written per unit):**  
T1-A-E1, T1-A-E3, T1-B-E1, T1-B-E3, T2-A-E1, T2-A-E3, T2-B-E1, T2-B-E2, T2-B-E3, T3-A-E2, T3-A-E3, T3-B-E1, T3-B-E2, T3-B-E3, T4-A-E1, T4-A-E2, T4-A-E3, T4-B-E2, T4-B-E3.

Units already clean (left as-is): T1-A-E2, T3-A-E2 was mild then re-differentiated; T4-A-E3 / T2-B-E3 de-cloned for residual openers.

Post-fix check: **no** feedback/retrospective pair shares ≥6 leading words or ≥35% opener ratio.

### P1 — S04-T4-B-E3 pin exact `nota:`

- **Éxito** bullet now pins:  
  `nota: la tasa solo necesita conteo O(n), no pares O(n2)`
- **Instruction** step 4 pins:  
  `print("nota: la tasa solo necesita conteo O(n), no pares O(n2)")`
- Hint softens to “texto exacto del éxito” (no inventar wording).
- Feedback checks letter-for-letter contract; retrospective keeps algorithm-choice transfer.
- **Solution output unchanged.**

### P2 — Polish applied

| Item | Action |
|------|--------|
| E1 second-hints (T1-A-E1, T1-B-E1, T2-B-E1) | Softened: concept first, less paste of exact fix line |
| T2-A-E3 instruction | Step 3 = un solo `print("rest", cola)` |
| T3-B-E1 context | Bridge “misma forma que filtrar ids por status” |
| I Do T1-B `why` | +1 sentence on try/except ruidoso |
| I Do T2-B / T3-B retros | Light length + principle clarity |
| Short We Do retros after de-clone | Bumped where thin (self-check / gate name) without essay bloat |

### Preserved (explicit non-touch)

- All `solutionCode.output` strings (verified present).
- Fixtures T3-A-E2 (`0.3333` / `None`) and T3-B-E3 (4 rows → `0.5`).
- You Do context / objectives / requirements / rubric / retrospective.
- Intentional starter `print('ok', True)` noise.
- Preamble 4-bullet form (not bloated to 80-word prose).

## Unit ledger (changes only)

### S04-T1-A-E1
- feedback/retro de-cloned; hint2 soft stop-exclusivo; no code change

### S04-T1-A-E3
- feedback = output diagnosis; retro = raw-survives principle + self-check

### S04-T1-B-DEMO
- `why` +1 sentence (error ruidoso)

### S04-T1-B-E1
- feedback shortened to `fila 0:` signal; retro principle/transfer; hint2 softer

### S04-T1-B-E2
- P1 de-clone (zip vs nested; tasa inventada)

### S04-T1-B-E3
- feedback dual-path DESALINEADO/OK; retro noisy failure + self-check

### S04-T2-A-E1
- continue vs break diagnosis vs principle/transfer

### S04-T2-A-E2
- P1 de-clone (print inside while vs control variable)

### S04-T2-A-E3
- instruction single print; feedback residual; retro break-auditable

### S04-T2-B-DEMO
- retrospective length + ruido≠fatal

### S04-T2-B-E1
- strip/continue feedback; principle basura vs fin; soft hint2

### S04-T2-B-E2
- ERR vs STOP / no-break diagnosis; fatal≠mark-and-continue

### S04-T2-B-E3
- END timing feedback; while True legitimacy principle

### S04-T3-A-E1
- P1 de-clone (`2 1 0` vs tres números honestos)

### S04-T3-A-E2
- None-guard / wrong numerator feedback; principle tasa convention

### S04-T3-A-E3
- `1 C2` contract feedback; primer-hallazgo principle

### S04-T3-B-DEMO
- retrospective + denominador `len(rows)`

### S04-T3-B-E1
- context bridge; map/filter feedback vs principle

### S04-T3-B-E2
- set vs list duplicates feedback; hardcode self-check in retro

### S04-T3-B-E3
- `0.5` / denominador feedback; You Do bridge in retro

### S04-T4-A-E1
- TRACE row `1 -1 2` feedback; principle traza

### S04-T4-A-E2
- double `+=` → 6 feedback; principle un incremento

### S04-T4-A-E3
- pisa vs get feedback; dict-update principle

### S04-T4-B-E1
- P1 identical pair split (5 25 vs n² smell)

### S04-T4-B-E2
- IndexError diagnosis vs stop exclusivo principle

### S04-T4-B-E3
- P1 nota pin + de-clone; outputs preserved

### youDo
- no changes

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short `title`
- [x] `instruction` is task-only (T2-A-E3 wording fixed)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII; CASO-LIM-004 tone kept
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit`)
- [x] Feedback vs retrospective distinct roles (systemic residual closed)
- [x] T4-B-E3 success string pinned

## Residual risks (post-fix)

1. A few retros sit near the low end of 40–80 words; structure (principle / misconception / transfer) is complete — further length would be filler.
2. E1 first hints still name the skill area (allowed for guided); second hints no longer paste full solution lines on the three worst spoilers.
3. Automated output compare for T4-B-E3 still requires exact `nota:` — now learner-facing contract matches solution.
4. You Do still depends on learner implementing `_run_tests` oracle — out of Round-2 exercise-prose scope.

## Anti-aberration attestation
Every feedback/retrospective pair rewritten by hand with a unit-specific pedagogical purpose. No scripts manufactured educational prose. No bulk template paste across the section.

Section 4 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
