# Section 3 Independent Recovery Report

## 1. Section identification and sources reviewed

- Section: **3 — Decisiones y reglas de validación**
- Canonical export: `section03`
- Canonical source: `src/lib/course/sections/s03-data-structures.ts`
- Active import/order: third entry in `src/lib/course/index.ts`
- Compatibility ID and live hash: `data-structures` / `#data-structures`
- Live site: `https://pillb.github.io/pyarcana/`
- Primary Explorer evidence: `course-state/curriculum_hardening/audits/explorer_reports/S03_EXPLORER_REPORT.md`
- Expert evidence: `expert_audit/S03_report.md`
- Grammar plan: `expert_audit/_GRAMMAR_SUBPLAN.md`
- Spanish evidence: `course-state/curriculum_hardening/audits/spanish_quality/S03_SPANISH_QUALITY.json` and campaign summary
- Dependency evidence only: `expert_audit/worklog.md`
- Assessment surfaces: public `selfCheck` in the canonical source and authenticated `data-structures` bank in `prisma/seed.ts`
- Runtime surfaces: the S03 mapping in `src/components/course/SectionView.tsx` and label in `src/components/course/PdfReport.tsx`
- Validation: `tests/adversarial/test_s03_independent_contract.py`, TypeScript, ESLint, V3 gates, exam pedagogy, Python runtime audit, static export, local HTTP
- Research evidence: all 13 supplied `project_sources/*.md` reports were inspected. Their recurring usable criteria were gradual release, small-step progression, constructive alignment, explicit first-use definitions, concise Spanish, honest code/output pairs, and removal of author-facing residue. Reports that claimed inaccessible or unrelated content were treated as weak evidence, not as facts about current S03.
- Primary technical references checked: current Python documentation for truth-value testing, Boolean operand-return semantics, chained comparisons, `if` exclusivity, and structural pattern matching (added in Python 3.10).

The current source and live bundle were treated as the baseline. Earlier Fixer reports and prior completion claims were not used as evidence.

## 2. Summary of changes applied

### Issue-resolution ledger

| Issue | Source | Status before this pass | Change or disposition | Validation |
|---|---|---|---|---|
| 01 | Explorer | Current source already repaired the theory T1-A output drift | Preserved and re-executed | 41/41 reference programs exact-match |
| 02 | Explorer | Current source already repaired I Do T1-A | Preserved and re-executed | Exact output pass |
| 03 | Explorer | Current source already implemented both `if` and `match` | Preserved and re-executed | Exact output pass |
| 04 | Explorer | V3/relocation prose absent from current learner map | Confirmed no learner-facing archaeology | Focused source assertions/manual read |
| 05 | Explorer | `gate V3` absent; some unnecessary English remained | Replaced internal/English phrasing with learner language | Spanish audit + manual read |
| 06 | Explorer | Legacy Sales Log Parser wording absent | Confirmed current project framing | Manual You Do review |
| 07 | Explorer | Empty `NotImplementedError` shell already replaced by defective scaffold | Strengthened executable oracle without returning to a blank shell | Focused You Do contract test |
| 08 | Explorer | False `print('ok', True)` signals absent | Confirmed all 24 starters remain defect-based | Focused structural/runtime test |
| 09 | Explorer | Dead-branch exercise already coherent | Preserved; polished learner language | Solution execution exact-match |
| 10 | Explorer | Nested/guard semantics already aligned | Preserved; clarified Spanish description | Solution execution exact-match |
| 11 | Explorer | Result-shape evolution explicitly framed in theory | You Do oracle now enforces exact `{status, code, message}` shape | Focused schema assertion |
| 12 | Explorer | Compatibility ID/file name still historical; live playground/PDF also leaked that identity | Kept stable ID but replaced S03-owned playground and PDF label | Executed playground; bundle string check |
| 13 | Explorer | T1-A current code demonstrates all claimed operators | Preserved and executed | Exact output pass |
| 14 | Explorer | Bloom wording absent | Confirmed no Bloom meta-leak | Source scan |
| 15 | Explorer | Residual `fancy`, `skill`, `hard-reject`, `outlier`, `merge` and similar wording | Rewrote relevant learner prose in clear Spanish | Manual review + Spanish audit |
| 16 | Explorer | Current self-check already has guard-order and actionable-message items | Preserved balanced 8-item self-check | Distribution 2/2/2/2 |
| 17 | Explorer | Current map and rhythm chunk eight concepts across eight sessions | Preserved; no extra concept dump added | Full theory/GRR graph review |
| 18 | Explorer | Current You Do no longer imports unexplained typing helpers | Confirmed not applicable | Source scan |
| 19 | Explorer | Current map includes runnable section contract | Preserved and executed | Exact output pass |
| 20 | Explorer | Current validators use `repr` for ambiguous string/int cases | Confirmed current output truth | Runtime pass |
| 21 | Explorer | Current preambles/retrospectives connect every subtopic | Preserved and polished selected transitions | Full paragraph/exercise graph review |
| C-01–C-08 | Expert | All historic code/output drifts were absent in current source | Independently re-executed every reference program rather than trusting the report | 41/41 exact-match; runtime audit 64/64 |
| R-01 | Expert | Stable ID still mismatched the new title | Deferred slug migration; repaired every S03-owned learner label/runtime mapping | Playground/PDF focused test |
| R-02 | Expert | `CASO-LIM-003` remains visible | Retained as an explicit synthetic case identifier, not author metadata | Manual privacy/context review |
| R-03 | Expert | S02/CP-N1-A identifiers remain visible | Retained because they form the learner’s prerequisite/project spine | S02→S03→S04 continuity review |
| R-04 | Expert | Historic synthetic-label drift absent | Re-executed all examples and compared outputs | Runtime and focused exact-output tests |
| Spanish findings | Spanish audit | Stored baseline: 8.88/10, FH 84.5, 9 medium findings | Rewrote genuine learner-language defects; classified DNI/dni repeated-token flags as intentional comparison | Fresh audit: 9.22/10, FH 91.6, 0 high, 2 medium heuristic flags |
| A-01 | Fresh current-source audit | Authenticated bank positions were `0/24/0/0` | Manually reordered options; did not merely change keys | Overall 6/6/6/6; each attempt 2/2/2/2 |
| A-02 | Fresh live audit | Playground taught lists, averages and comprehensions | Replaced with tri-state amount/region rules over synthetic cases | Python execution equals expected output |
| A-03 | Fresh live audit | PDF label was `3. Data Struct` | Changed S03-owned label to `3. Reglas` | Source and static-bundle assertion |
| A-04 | Fresh You Do audit | Project oracle omitted schema, bad-type and several boundary paths | Added result-shape, type, 18/120, 50000/50001, missing, unknown and negative assertions | Focused You Do oracle test |

## 3. Full corrected content or precise complete diffs

The section-scoped commit contains the complete reproducible diff. Its deliberate hunks are:

1. `src/lib/course/sections/s03-data-structures.ts`
   - Replaced unnecessary author/English phrasing in the opening, theory, I Do retrospectives and selected We Do blocks.
   - Preserved all 8 theory subtopics, 8 I Do demos and 24 We Do exercises.
   - Added the You Do requirement that every result has exactly `status`, `code`, and `message`, and that invalid types return a result rather than raising `TypeError`.
   - Expanded `_run_tests` with `assert_result`, explicit MISSING/NOT_IN_ALLOWLIST/BAD_TYPE/OUT_OF_RANGE/NEEDS_REVIEW/OK checks, inclusive age/monto boundaries, and an above-threshold review case.
   - Reworded the portfolio note so its evidence list matches the executable oracle.
2. `prisma/seed.ts`
   - Retained all 24 S03 questions, stems, explanations and distractors.
   - Moved the correct option with its text to this exact ordered key vector:
     `0,1,2, 1,2,3, 2,3,0, 3,0,1, 0,1,2, 1,2,3, 2,3,0, 3,0,1`.
   - This yields six answers in each position and two answers in each position for every three-variant attempt.
3. `src/components/course/SectionView.tsx`
   - Replaced only the `data-structures` mapping block.
   - The new playground implements `validate_monto` and `validate_region`, demonstrates zero, absence, unknown region and negative amount, and publishes the exact three-line output.
4. `src/components/course/PdfReport.tsx`
   - Changed only `"data-structures": '3. Data Struct'` to `"data-structures": '3. Reglas'`.
5. `tests/adversarial/test_s03_independent_contract.py`
   - Added six independent regression tests covering structure, 41 code/output pairs, playground execution, PDF mapping, public/authenticated position balance and You Do oracle breadth.

No other section’s curriculum, bank, playground block or PDF label was changed.

## 4. After-Fix Validation Report

### Mechanical results

| Gate | Result |
|---|---|
| Focused S03 suite | 6/6 tests passed |
| Embedded theory/I Do/We Do reference programs | 41/41 executed; stdout exactly matched declared output |
| S03 runtime audit | 64 pass, 0 fail, 0 skip; P0=0, P1=0 |
| Authenticated bank size | 24 questions; 8 concepts × 3 variants |
| Authenticated positions | 6/6/6/6 overall |
| Attempt-equivalent positions | 2/2/2/2 in each of three attempts |
| Public self-check | 8 questions; 2/2/2/2 |
| TypeScript | `npx tsc --noEmit` passed |
| ESLint | `npm run lint` passed |
| V3 | counts, structure and all 52 invariants passed |
| Exam pedagogy | 1,248 questions, 416 concepts, P0=0, P1=0 |
| Static export | Next.js production static build passed |
| Local render | HTTP 200; generated bundle contains `Practica decisiones y reglas` and `3. Reglas` |
| Live baseline | GitHub Pages HTTP 200; current deployed bundle confirmed S03 content and exposed the pre-fix stale playground/PDF strings |
| Diff hygiene | `git diff --check` passed; generated fleet artifacts restored |

### Spanish quality

- Stored baseline: score **8.88/10**, Fernández-Huerta **84.5**, medium findings **9**.
- Fresh validation: score **9.22/10**, Fernández-Huerta **91.6**, high findings **0**, medium findings **2**.
- The two medium flags are the deliberate comparison of `"DNI"` with `"dni"` in an exercise; they are not duplicated prose.
- The fresh audit also exposed one genuine grammatical defect in feedback (“debe poder ejecutarla operaciones”), which was rewritten as “debe permitir que el equipo de operaciones actúe sin adivinar”.
- Audit-generated S03 and fleet summary files were restored; metrics are recorded here rather than committed as campaign-wide churn.

### Rendering, accessibility and continuity

- The public live card resolves Section 3 as “Decisiones & Reglas”; deployed learner content contains the canonical S03 demo identifiers.
- The new playground is a text/code substitution within an existing accessible control. It introduces no new focus target, color-only cue, image, animation or pointer-only interaction.
- Static HTML returned HTTP 200. The compiled local bundle contains the corrected playground title and PDF label.
- Backward edge: S02 converts raw values into typed intake values.
- Section node: S03 decides accept/reject/review without collapsing `None` and `0`.
- Forward edge: S04 applies the S03 validator across a batch and summarizes counts/rates.

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

## 5. Residual risks and later recommendations

- Section-local residual: none known after the fresh source, assessment and runtime checks.
- Compatibility constraint: `data-structures` and `s03-data-structures.ts` remain historical identifiers. Renaming them requires a repository-wide routing/data migration and is intentionally deferred.
- Deployment constraint: the public bundle will retain the two pre-fix strings until the parent batch is merged and Pages finishes deploying. The local static artifact already contains the corrected strings.
- Platform dependency: authenticated delivery still depends on the shared Prisma seed/deployment workflow; the S03 bank itself is now balanced and covered by a regression.
- Adjacent sections: S04 should continue treating S03’s `validate_record` output as the input contract; no S04 source was changed here.

## 6. Updated Graph Memory notes

- Node `S03`: Decisiones y reglas de validación; compatibility ID `data-structures`.
- Concept nodes retained: comparisons/membership, truthiness/short-circuit, exclusive branches, guards/dead branches, allowlists/ranges, decision tables/match, invariants/examples, actionable messages/branch tests.
- Artifact path: theory → 8 I Do demos → 24 We Do exercises → rules-engine You Do → 8 public checks → 24 authenticated variants.
- Prerequisite edge: `S02 typed parser → S03 rules`.
- Forward edge: `S03 rules → S04 batch iteration and summaries`.
- Resolved nodes: stale collections playground, stale PDF label, authenticated position shortcut, incomplete capstone oracle, avoidable mixed-language residue.
- Retained strengths: synthetic-only case, tri-state contract, explicit result-shape evolution, normal/boundary/error reasoning, runnable outputs.
- Compatibility risk: stable slug/file name remains historical.
- Assessment coverage: all eight concepts have three authenticated variants; public self-check and each authenticated attempt are position-balanced.

## 7. Files changed

- `src/lib/course/sections/s03-data-structures.ts` — learner-language polish and stronger You Do oracle.
- `prisma/seed.ts` — manually balanced S03 authenticated answer positions.
- `src/components/course/SectionView.tsx` — S03-owned decisions/rules playground.
- `src/components/course/PdfReport.tsx` — S03-owned PDF label.
- `tests/adversarial/test_s03_independent_contract.py` — focused structural, runtime, mapping and assessment regressions.
- `course-state/curriculum_hardening/audits/fixer_reports/independent/S03_FIXER_REPORT.md` — this fresh evidence report.
- `expert_audit/independent_worklog/S03.md` — independent audit trail.

## 8. Worklog confirmation

The fresh completion entry is recorded in `expert_audit/independent_worklog/S03.md`. The parent orchestrator owns reconciliation into the shared campaign inventory/worklog so this isolated section commit cannot overwrite other concurrent entries.

Section 3 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
