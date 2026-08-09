# S11 Pedagogy Fixer Report (Round 2)

## Section
- **title:** OOP y modelo de dominio
- **id:** `testing` (index 11)
- **source:** `src/lib/course/sections/s11-testing.ts`
- **counts:** iDo 8, weDo 24, youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 `S11_EXERCISE_PEDAGOGY_REPORT.md`
- Applied residual field text **by hand** only in Section 11
- No generators, bulk templates, or manufactured prose scripts
- Preserved all starter/solution code and exact outputs
- Validated with `tsc --noEmit` and targeted field checks

## Fixes applied

### P1 (learning integrity)

| Unit | Change |
|------|--------|
| **S11-T4-A-E2** | Rewrote independent `instruction` (removed `return self._d.get(...)` paste); thickened `feedback` + `retrospective`; softened hints to non-spoiling PE |
| **S11-T3-B-E2** | Rewrote independent `instruction` (removed `return norm(text)` paste); thickened `feedback`; softened hints |
| **S11-T3-B-E1** | Split feedback vs retrospective (silent duck-typing fail vs contract/transfer) |
| **S11-T2-A-E1** | Split feedback vs retrospective (`()` bug vs property-as-virtual-field); PE hint |
| **S11-T4-B-E1** | Split feedback vs retrospective (theatre vs gate metacognition) |
| **S11-T4-A-DEMO** | Expanded thin `why` (CLI/service border + no `is_fraud`) |
| **S11-T4-B-DEMO** | Expanded thin `why` (ethical suite + `hasattr` as product limit) |

### P2 (polish)

| Unit | Change |
|------|--------|
| **S11-T1-A-E1** | Retrospective: misconception + transfer punch |
| **S11-T1-A-E2** | Feedback: Decimal-from-text reasoning |
| **S11-T1-A-E3** | Feedback: classmethod border vs raw dict |
| **S11-T1-B-E1** | Feedback: no silent FX / no amount “fix” |
| **S11-T1-B-E2** | Feedback + PE hints (`Lanza ValueError…`) |
| **S11-T2-A-E3** | Feedback: no silent score clip |
| **S11-T2-B-DEMO** | Expanded `why` (PII vs stable id) |
| **S11-T2-B-E1** | Retrospective: classic id-in-equality bug |
| **S11-T2-B-E3** | Feedback: mutable-key bucket loss |
| **S11-T3-A-DEMO** | Retrospective: score ≠ parentesco + self-check |
| **S11-T3-A-E3** | Feedback + retrospective (canonicity + ethics bridge) |
| **S11-T4-A-E1** | Feedback: export chooses fields |
| **S11-T4-A-E3** | Feedback + retrospective (layer flags + self-check) |
| **S11-T4-B-E2** | Feedback: asserts before `print("pass")` |
| **S11-T4-B-E3** | Feedback: ANTES/DESPUES `hasattr` discipline |

### Left unchanged (as directed)
- Strong/adequate units with no residual (T1-A-DEMO, T1-B-DEMO, T2-A-DEMO, T3-B-DEMO, most E3 transfers already Strong, T2-B-E2 independent fade, T3-A-E1/E2, T1-B-E3, You Do shell)
- All code, `# DEFECT:` comments, awkward T1-A-E3 starter call site, T4-B-E3 ANTES `decide_fraud` block
- All solution `output` strings

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (R1 shell retained; R2 quality pass)
- [x] We Do has short `title`
- [x] `instruction` is task-only; E2 spoilers removed on T4-A-E2 and T3-B-E2
- [x] Exact outputs preserved (no code/output execute-and-diff needed)
- [x] Spanish PE; no real PII; English hint fragments fixed on T1-B-E2 / T2-A-E1
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Residual risks (post-fix)

1. Filename `s11-testing.ts` / id `testing` still mislabels OOP domain content — out of scope.
2. Section-wide short feedback on units already Strong was **not** bulk-rewritten (spec: hand-edit only listed residuals).
3. T2-B-E2 kept minimal independent instruction (fade preserved).
4. Forma reducida ClientRecord in T1-B E2/E3 and T4-B E1 kept on purpose.

## Validation notes

- Spot-checked residual strings: P1 instruction rewrites, feedback/retro splits, I Do `why` expansions, PE hints — all present.
- Confirmed solution-only occurrences of `return self._d.get(client_id)` and `return norm(text)` remain (not in learner `instruction`).
- Sample outputs still present: `ClientRecord C007`, `has_is_fraud False`, `ANTES has_decide_fraud True`.

---

Section 11 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
