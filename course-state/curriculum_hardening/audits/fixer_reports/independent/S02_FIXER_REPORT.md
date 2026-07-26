# Independent Fixer Report — Section 2

## 1. Scope and canonical identity

- Section: **S02**
- Canonical learner title: **Valores, tipos, operadores e I/O**
- Runtime index: `2`
- Stable platform id / hash: `basics`
- Canonical import: `section02` from `src/lib/course/sections/s02-basics.ts`
- Live route: `https://pillb.github.io/pyarcana/#basics`
- Capstone increment: **CP-N1-A — parser de captura inicial**
- Fresh-owner rule: current source was treated only as the baseline. No previous Fixer report, prior change or earlier completion claim was accepted as evidence.

The stable id and filename are retained because progress, exam, glossary, playground, PDF and deep-link surfaces use `basics`. The independent pass corrected the learner-facing short title and every S02-owned mapping without performing a compatibility migration.

## 2. Fresh instructional inventory

| Surface | Inventory | Fresh result |
|---|---:|---|
| Opening and roadmap bridge | job relevance, 8 outcomes, scope map | Complete S01 → S02 → CP-N1-A path; first-use vocabulary needed refinement |
| Theory | map plus 8 subtopics (`S02-T1-A` … `S02-T4-B`) | Complete progression: values/types → conversion → names/identity → operators/Decimal → I/O/parser |
| I Do | 8 demonstrations | One executable model per subtopic; code and displayed output agree |
| We Do | 24 exercises | E1 guided, E2 independent and E3 transfer for every subtopic; starters, solutions, hints, edge cases and feedback present |
| You Do | CP-N1-A parser project | Genuine incomplete starter with fixed Unicode, empty, invalid-number and blank-number oracles; `main()` and rubric present |
| Public self-check | 11 questions | Covers the complete section; answer positions are near-even (`3/3/2/3`) |
| Topic evaluations | 4 evaluations | Two authentic tasks per topic pair and four-criterion rubrics |
| Authenticated assessment | 24 questions | Eight concepts × three variants, but answer positions were `1/21/2/0` before this fix |
| Playground | `basics` mapping | Taught a list comprehension that the section explicitly defers and did not rehearse raw/clean/error behavior |
| PDF progress label | `basics` mapping | Displayed the English-only label `2. Basics` |
| Resources | 6 docs, 2 books, 4 courses | Relevant to the active fundamentals scope |

## 3. Evidence used

### Current source and rendered product

- `src/lib/course/index.ts`
- `src/lib/course/sections/s02-basics.ts`, read end to end
- `prisma/seed.ts`, S02 `basics` bank
- `src/components/course/SectionView.tsx`, S02 playground mapping
- `src/components/course/PdfReport.tsx`, S02 PDF label
- live GitHub Pages HTML and deployed JavaScript bundle at `https://pillb.github.io/pyarcana/`

The public site returned HTTP 200. The deployed bundle independently exposed the active S02 title together with the stale strings `Practica variables y tipos`, `Cuadrados` and `2. Basics`; those were current learner-facing defects, not historical-report assumptions.

### Audit-only inputs

- `course-state/curriculum_hardening/audits/explorer_reports/S02_EXPLORER_REPORT.md`
- `expert_audit/S02_report.md`
- `expert_audit/_GRAMMAR_SUBPLAN.md`
- `course-state/curriculum_hardening/audits/spanish_quality/S02_SPANISH_QUALITY.json`
- the Spanish-quality campaign summary
- S02 dependency entries in `expert_audit/worklog.md`
- all 13 research syntheses under `/workspace/scratch/538c97258ddb/project_sources/`

Several supplied research syntheses could not access their target source or guessed the wrong section identity. They contributed only general checks for gradual release, chunking, transition quality and assessment alignment. They were not treated as factual evidence about current S02.

### Current primary technical sources

- Python 3.14.6 `decimal` documentation: exact decimal representation, float-constructor consequences, `quantize`, `ROUND_HALF_EVEN` and Decimal f-string formatting.
- Python 3.14.6 built-in-function documentation: `input`, `type`, `isinstance` and explicit conversions.
- Python 3.14.6 expression reference: arithmetic and unary-minus precedence.
- PEP 8 programming recommendations: `is None` / `is not None`.

These current sources confirmed the active section's core technical contracts. No time-sensitive claim was accepted from an old report.

## 4. Pre-edit issue-resolution ledger

| ID | Severity | Current defect before edit | Learning impact | Resolution |
|---|---|---|---|---|
| S02-I01 | P0 | Authenticated bank positions were `{0:1, 1:21, 2:2, 3:0}` | A learner could exploit “choose the second option” across nearly every question; attempt variants measured position memory rather than the eight constructs | Hand-reorder options to exact `6/6/6/6`; require three distinct positions per concept and `2/2/2/2` in each attempt lane |
| S02-I02 | P1 | Live playground ended with a list comprehension and `Cuadrados` | The try-it surface introduced syntax explicitly deferred by the section and omitted the central raw/clean/errors boundary | Replace only the `basics` mapping with executable `safe_int` practice over normal, empty and invalid input while preserving raw |
| S02-I03 | P1 | `shortTitle` said `Basics de Python`; PDF label said `2. Basics` | Learner navigation and downloaded progress evidence contradicted the Spanish canonical identity | Change the visible short title and PDF label to `Valores y tipos`; retain stable key `basics` |
| S02-I04 | P2 | First-use gaps and avoidable code-switching: `intake`, I/O, `namespace`, `schema`, `singleton`, `round-trip`; malformed `*args/**kwargs` Markdown | Beginner readers had to infer vocabulary and assistive rendering could expose broken emphasis | Define or translate each first use; expand I/O; use code spans for `*args`/`**kwargs`; simplify the affected Spanish |
| S02-I05 | P1 | No focused regression protected the full section graph, all runnable examples, mappings or attempt-level distribution | Broad fleet gates allowed the stale playground and position shortcut to pass | Add a six-test S02 contract suite covering identity, 8/8/24/You Do graph, 41 examples, playground execution, PDF and both assessment layers |
| S02-I06 | P1 | The final We Do transfer starter was intentionally incomplete but lacked a recognized learner-completion marker | The runtime audit reported the expected failing starter as an accidental production defect | Add an explicit student instruction to complete both functions before running the fixed tests; do not fill in the learner solution |
| S02-I07 | P1 | The learner-packet parser looks back 500 source characters from each `instruction`; 18 long-preamble exercises therefore inherited a neighboring id or `None` even though the 24 declared ids were unique | The exported S02 learner manifest exposed only 19 unique practice identifiers, so progress/audit evidence could conflate exercises | Move each existing `id` property immediately after its unchanged preamble and before `instruction`; add an assertion against the real packet parser |

## 5. Changes made

- Replaced English-heavy S02 navigation copy with `Valores y tipos` and a Spanish capture-validation tagline.
- Defined intake as initial data capture, expanded entrada/salida (I/O), introduced *namespace* and *schema* beside their Spanish terms, replaced `singleton` with “único objeto `None`”, and rewrote `round-trip` as “de ida y vuelta”.
- Corrected the malformed `*args/**kwargs` callout markup and reduced unnecessary English in the opening and error-explanation prose.
- Replaced only the `basics` playground with a deterministic raw/clean `safe_int` lab. Its exact output covers a valid integer, whitespace-only input and nonnumeric input.
- Changed only the `basics` PDF label to `2. Valores y tipos`.
- Hand-reordered all 24 authenticated option arrays without changing the tested answers or the eight concept families.
- Preserved the incomplete You Do and We Do starters. The final transfer starter now says explicitly that both functions must be completed before running its unchanged assertions.
- Added `tests/adversarial/test_s02_independent_contract.py`.
- Moved each existing We Do `id` property next to its `instruction` field. No identifier value or learner-facing instructional text changed; the packet parser now returns the canonical 24-id sequence with 24 unique values.
- Did not bulk-rewrite the already coherent theory, I Do, We Do, You Do or public self-check.

## 6. Assessment integrity after repair

### Public self-check

- 11 questions cover types, explicit conversion, identifiers, aliasing, `None`, precedence, Decimal, input, parser errors, Unicode raw/clean and Decimal formatting.
- Position counts remain near-even: `{0:3, 1:3, 2:2, 3:3}`.

### Authenticated bank

- Exactly 24 questions.
- Exactly eight concepts, each with three variants.
- Overall correct positions: `{0:6, 1:6, 2:6, 3:6}`.
- Every concept moves the correct answer across three distinct positions.
- Every attempt lane has `{0:2, 1:2, 2:2, 3:2}`.
- Distractors remain plausible misconceptions rather than answer-length or wording giveaways.

## 7. Validation evidence

| Gate | Result |
|---|---|
| Focused S02 adversarial suite | **PASS** — 7/7 tests |
| S02 learner-packet manifest | **PASS** — 24 exercises, 24 unique ids, exact `S02-T1-A-E1` … `S02-T4-B-E3` sequence |
| All published S02 Python code/output pairs | **PASS** — 41/41 exact stdout matches |
| Scoped Python content runtime audit | **PASS** — 65/65 artifacts, 0 failed, 0 skipped, P0=0, P1=0 |
| S02 playground execution | **PASS** — normal, empty and invalid paths match the displayed oracle |
| Fresh Spanish audit (`--from 2 --to 2 --no-lt`) | **PASS** — score 9.07/10; Fernández-Huerta 87.5 (“fácil”); 5 medium, 0 high findings |
| TypeScript (`npm exec tsc -- --noEmit`) | **PASS** |
| ESLint (`npm run lint`) | **PASS** |
| V3 counts / structure / invariants | **PASS** — 52 sections; S02 remains 8 theory / 8 I Do / 24 We Do; warnings=0 |
| Exam pedagogy audit | **PASS** — 1,248 questions / 416 concepts; P0=0, P1=0 |
| Static production build | **PASS** — compilation, TypeScript and 3/3 static pages |
| Built-bundle inspection | **PASS** — contains `Practica el contrato raw/clean` and `2. Valores y tipos` |
| Exported-site HTTP check | **PASS** — local static export returned HTTP 200 |
| Diff whitespace check | **PASS** |

The Spanish and runtime validators rewrote campaign-level JSON summaries. Those generated side effects were restored before staging; only the fresh metrics are recorded here.

## 8. Residuals and deliberate non-changes

1. The compatibility id/hash and source filename remain `basics` / `s02-basics.ts`. A rename would require a coordinated migration of progress, attempts, glossary keys, bookmarks and deep links.
2. The source includes `if`, `for`, functions and `try/except` as explicitly framed support syntax. The active lesson does not claim mastery of those constructs in S02.
3. No supported browser screenshot was required to establish the current defect: the live Pages response and deployed bundle were inspected directly, while the updated production export, compiled bundle and local HTTP response verify the repaired render source.
4. No unresolved S02 P0 or P1 issue remains.

## 9. Exact files changed

1. `src/lib/course/sections/s02-basics.ts`
2. `prisma/seed.ts` — only the `basics` bank
3. `src/components/course/SectionView.tsx` — only the `basics` playground
4. `src/components/course/PdfReport.tsx` — only the `basics` label
5. `tests/adversarial/test_s02_independent_contract.py`
6. `course-state/curriculum_hardening/audits/fixer_reports/independent/S02_FIXER_REPORT.md`
7. `expert_audit/independent_worklog/S02.md`

No fleet-wide generated audit artifact is part of the section commit.

## 10. CI follow-up — learner-packet identifiers

The fleet adversarial test exposed a source-layout contract that the initial S02 test did not exercise. The active learner-packet builder associates an exercise id by scanning only the 500 characters before `instruction`. S02's long pedagogical preambles placed most valid `id` properties outside that window, producing five duplicated ids and one `None` in the exported manifest.

The follow-up moved all 24 existing id properties from above each preamble to immediately below it. The instructional strings, exercise order, canonical id values, starters, solutions and outputs are byte-for-byte unchanged. Fresh parser output is now:

- exercise entries: `24`;
- unique ids: `24`;
- duplicates / null ids: `0`;
- ordered range: `S02-T1-A-E1` through `S02-T4-B-E3`.

Validation:

- `python3 -m unittest tests.adversarial.test_s02_independent_contract`: **PASS, 7/7**;
- exact fleet newbie-packet test executed: S02 no longer appears in its failure list; this isolated recovery branch still reports pending identifier-layout failures for other section owners;
- scoped Python runtime audit: **PASS, 65/65**, P0=0, P1=0;
- generated runtime JSON side effects restored before staging.

Section 2 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
