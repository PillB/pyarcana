# S13 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Familiarity Evidence Dashboard y cierre de nivel
- **id:** `rpa-automation` (index 13; archivo `s13-rpa-automation.ts`)
- **source:** `src/lib/course/sections/s13-rpa-automation.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S13_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2 (plus optional I Do retros and thin feedback)
- No generators, no bulk templates, no wholesale rewrite of A-scored units
- **No code/output changes** — prose-only tightening
- Word-count measurement only; each paragraph written for a pedagogical purpose

## Acceptance checklist
- [x] P1 feedback/retro role splits on ethics/policy collapsed units
- [x] P1 independent spoiler defused: `S13-T2-B-E2` (no “change `|` to `&`”)
- [x] P1 mild E2 fade: `S13-T1-B-E2` instruction (band of doubt without full predicate paste)
- [x] P2 polish: short retros, thin feedback, title, mild T3-A-E2 cascade wording
- [x] Optional I Do retros thickened: T1-B, T3-A
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Solution `code` / `output` preserved on all residual units
- [x] Typecheck (`tsc --noEmit`) clean

## What was fixed

### P1 (learning integrity)

| Unit | Severity | Changes |
|------|----------|---------|
| **S13-T1-A-E2** | P1 collapse | `feedback` diagnoses raw name / materno / missing region casefold; `retrospective` keeps principle + single-token self-check + E3 bridge |
| **S13-T1-A-E3** | P1 collapse | `feedback` diagnoses always-1.0 (need same_doc vs same_block); `retrospective` principle + PR/cola transfer |
| **S13-T1-B-E2** | P1 collapse + P2 fade | Instruction names accept-band DEFECT and “banda de duda” without pasting `low <= score <= high`; feedback diagnoses wrong queue contents; retro is filter-of-band principle |
| **S13-T1-B-E3** | P1 collapse | `feedback` diagnoses PR=0.0 / auto_fraud / “implica delito”; `retrospective` number+ethics + ops_action self-check + T2 bridge |
| **S13-T2-B-E2** | P1 spoiler | Instruction: “vecinos de **ambos** extremos” (no `|`→`&`); feedback diagnoses E/F unión; retro self-check empty intersection |
| **S13-T3-A-E3** | P1 collapse | `feedback` diagnoses low/ok when gap >0.5; `retrospective` honesty > cosmetic + T3-B bridge |
| **S13-T3-B-E3** | P1 collapse | `feedback` diagnoses leftover forbidden keys; `retrospective` executable policy + portfolio grep / CF-1 |
| **S13-T4-A-E3** | P1 collapse | `feedback` diagnoses lat/lon-only tooltip; `retrospective` provenance S12→S13 + T4-B close |
| **S13-T4-B-E1** | P1 collapse | Title → “Privacy sheet: synthetic_only y pii_real”; feedback diagnoses True/production; retro gate artifact + roles self-check |
| **S13-T4-B-E3** | P1 collapse | `feedback` diagnoses ignore/skip playbook; `retrospective` incident+regression as N1 close / You Do assembly |

### P2 polish

| Unit | Changes |
|------|---------|
| **S13-T1-B-DEMO** | Retrospective: FP≠delito + self-check on precision 1.0 vs FN |
| **S13-T3-A-DEMO** | Retrospective: med vs high when email missing; classic “esconder missing / maquillar” |
| **S13-T1-A-E1** | Retrospective: names casefold + space collapse + alfanum; classic strip-only |
| **S13-T1-B-E1** | Retrospective: inverted denominators under pressure; precision priority |
| **S13-T2-A-E1** | Feedback: empty-string + casefold inflate True espurio |
| **S13-T2-A-E2** | Feedback diagnoses 0.5-only / km=5 not zeroing geo; retro stresses variante vs canónico |
| **S13-T2-B-E1** | Retrospective: pair vs direction; classic A→B only |
| **S13-T3-A-E1** | Feedback: len 2 omit missing; don’t reformat key names |
| **S13-T3-A-E2** | Instruction cascade goal-worded (conflict/missing elevan banda) without raw if-order paste |

### Left alone (as directed)
- We Do already differentiated: T1-B-E1 core (only retro polish), T2-A-E3, T2-B-E3, T3-B-E1, T3-B-E2, T4-A-E1, T4-A-E2, T4-B-E2
- I Do demos other than optional T1-B / T3-A retros
- youDo entire shell + retrospective
- Historical section `id: "rpa-automation"` — out of Fixer scope
- Hints left telegraphic where unit was not already open (no batch hint campaign)

## Code / output integrity
- **No** starterCode / solutionCode / output edits in this pass
- Preserved exact strings: `fp_not_fraud` disclaimer, relationship/collusion/kinship disclaimers, demo cmd `--synthetic`, incident `rotate_secret|redact_logs|postmortem`, `level1_regression: re-check S01-S13…`, map tooltip format, 7-row decide_ops matrix
- Variante 0.6/0.4 labeling kept on T2-A-E2 (not unified to canónico)

## Residual risks (post-fix)
1. Section `id: "rpa-automation"` vs Evidence Dashboard content remains product debt (orchestrator).
2. Role collapse returns if a later pass expands feedback and retro with the same paragraph — keep feedback = diagnostic of *this* anti-pattern.
3. Starter `print('ok', True)` still present on many weDo starters; left untouched.
4. Soft word-floor on a few retros may still sit near ~34–38 w after stronger sentences; checklist items (principle/misconception/transfer) are present.
5. Full browser/Pyodide suite not re-run; no code/output drift introduced.

## Validation
- Hand re-read of each edited unit after apply
- Integrity greps: spoiler “cámbialo a” gone; full predicate paste out of T1-B-E2 instruction; collapsed openings no longer match on P1 units
- Field openings differ (feedback diagnostic vs retro principle/transfer) on all P1 ethics/policy pairs
- Word counts post-fix (measurement only, sample): T1-A-E2 fb~40 / rt~50; T1-B-E3 fb~40 / rt~50; T2-B-E2 fb~36 / rt~40; T4-B-E1 title expanded; T3-A-DEMO rt~48
- `npx tsc --noEmit` exit 0
- Field completeness unchanged from R1 shell (preamble/title/retrospective already present)

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 13 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
