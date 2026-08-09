# S27 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Estrategia de pruebas con pytest
- **id:** `async-concurrency`
- **index:** 27
- **source:** `src/lib/course/sections/s27-async-concurrency.ts`
- **basis:** `round2/S27_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** hand-written residual prose only; no generators, bulk replace of templates, or code/output changes

## Summary
Round-1 had closed the schema shell (title/preamble/instruction/retrospective present). Round-2 residual work targeted **quality**: decouple feedback↔retrospective echo on the worst pairs, expand short weDo retros to principle + misconception + transfer + self-check, align T1-A-DEMO preamble to demo areas, and polish thin iDo retros + a few short feedbacks on touched units. Solutions and canonical outputs left **intact** (24/24 execute match verified).

## Changes by unit

### P1 — feedback/retro eco

| Unit | Change |
|------|--------|
| **S27-T2-B-E2** | Replaced retrospective: policy-of-team framing for `safe_for_mutable`, session only for read-only expensive resources, dual self-check (umbrales vs contactos), bridge E3 factory. Feedback kept (function default / session flakes). |
| **S27-T4-B-E3** | Replaced retrospective: ticket-without-regression leaves strip/casefold door open; repro vs regresión as CI contract; defense self-check on You Do test that must fail first; no-merge policy. Feedback kept (bug_repro vs regression_test wording). |

### P1 — short weDo retrospectives (+ self-check)

| Unit | Change |
|------|--------|
| **S27-T1-A-E2** | Ranking as sprint conversation queue; misconception = sort as README ornament; self-check one-hour priority; bridge E3 capa. |
| **S27-T1-B-E2** | Signal post-assert as human/log contract; inventing `fail` = false confidence; self-check CI fail text + exit 0; bridge E3 match. |
| **S27-T2-A-E3** | Each row as conceptual CI case; misconception copy body thrice / print tuples; self-check casefold in table; You Do bridge. |
| **S27-T2-B-E3** | Factory measures create-result not magic literal; hardcode hides `range(n)`/id bugs; self-check `make(0)`; You Do fixture. |
| **S27-T3-B-E3** | Message as living entry contract for clerical queue + CI; self-check token real → never log; You Do require_email-style. |
| **S27-T4-A-E1** | Evidence = both hi/lo in same run; happy-path-only leaves low threshold naked; self-check score for `non`; bridge E2. |
| **S27-T4-B-E1** | Green good + red mutant = contract; oracle strict enough that strip/casefold removal hurts; self-check raw oracle; bridge E2. |
| **S27-T4-B-E2** | input/expected/actual minimum for 2 a.m. fix; inverted roles fix wrong side; self-check no real email in dict; bridge E3. |

### P2 — iDo alignment and thin retros

| Unit | Change |
|------|--------|
| **S27-T1-A-DEMO** | Preamble aligned to code areas: normalize / blocking / repo SQL (no phantom UI); predict order + layer; note UI absent because score loses. |
| **S27-T1-B-DEMO** | Retro + assert-must-fail-in-CI + self-check doubles spaces. |
| **S27-T2-A-DEMO** | Retro + no node id at 2 a.m. + self-check rename to `check_*`. |
| **S27-T2-B-DEMO** | Retro + return BASE without copy + self-check what test B would see. |
| **S27-T3-A-DEMO** | Retro + self-check UTC runner vs Lima data (attention load; code unchanged). |
| **S27-T4-A-DEMO** | Retro + three bands move distinct queues + self-check debt if hits lack non. |
| **S27-T4-B-DEMO** | Retro + suite green without casefold = no net + self-check print-as-oracle. |

### P2 — short feedback on touched units

| Unit | Change |
|------|--------|
| **S27-T2-A-E2** | Feedback expanded: left≠right → fail; always-ok is teatro de verde on normalize merge. |
| **S27-T2-B-E1** | Feedback expanded: flake of order when next test reuses dirty fixture. |
| **S27-T3-A-E3** | Feedback expanded: no write to repo tree / home. |
| **S27-T3-B-E3** | Feedback expanded: generic error fails clerical queue + CI log. |
| **S27-T2-A-E2** retro | Light self-check on pytest rewrite (paired with feedback expand). |

### Unchanged (intentional)
- All starterCode / solutionCode / `output` (integrity traps preserved).
- You Do frame + retrospective (already A).
- Units already A with no residual required (T1-A-E1/E3, T1-B-E1/E3, T2-A-E1, T3-A-E1/E2, T3-B-E1/E2, T4-A-E2/E3, etc.).
- E1→E3 fade surfaces; matching ≠ fraude ethics; dual-track pytest/lab notes.

## Acceptance checklist (Fixer R2)

- [x] Peores ecos P1 (T2-B-E2, T4-B-E3) con retrospective **distinta** del feedback  
- [x] weDo listados en P1.3 con retro ~40–80 w e self-check (8 units rewritten by hand)  
- [x] T1-A-DEMO preamble alineada al código (normalize / blocking / repo_sql)  
- [x] Outputs y solutions **intactos** (24/24 exec match)  
- [x] Español PE; solo datos sintéticos `@example.pe`  
- [x] Sin generadores ni bulk replace de prosa  
- [x] Prose-only edits; section source structure preserved  

## Validation
- Manual re-read of every edited field against Round-2 proposals.
- Python exec of all 24 `solutionCode` blocks → stdout equals canonical `output` (fail count 0).
- Spot-check presence of key residual phrases in source.

## Residual notes (post-R2)
1. **Filename/id** `async-concurrency` vs pytest content remains a repo naming debt, not learner prose.
2. **T3-A-DEMO** still packs four borders; mitigated by attention-oriented prose only.
3. **Hints E1** still give exact expressions in places — acceptable guided tier; not changed.
4. A few weDo retros not in the P1.3 list remain shorter (~30 w) but already had distinct principle/transfer (e.g. T1-A-E1, T2-A-E1); left alone to avoid template-like expansion.
5. Terminology `non` (exercises) vs `non_match` (youDo) left as-is so outputs stay valid.

## Files touched
- `src/lib/course/sections/s27-async-concurrency.ts` (pedagogy prose only)
- `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S27_PEDAGOGY_FIXER_REPORT.md` (this report)

---

Section 27 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
