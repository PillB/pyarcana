# Independent Fixer Report — Section 9

## 1. Scope and canonical identity

- Section: **S09**
- Canonical learner title: **Excepciones, debugging y logging seguro**
- Runtime index: `9`
- Stable platform id / hash: `visualization`
- Canonical import: `section09` from `src/lib/course/sections/s09-visualization.ts`
- Live route: `https://pillb.github.io/pyarcana/#visualization`
- Fresh-owner rule: the current product was treated only as a baseline. No earlier Fixer report or completion claim was accepted as evidence.

The stable id and filename retain a former visualization topic. Renaming them would break progress, exam, playground, PDF and deep-link consumers, so this pass corrects the learner-facing mappings while preserving the compatibility key.

## 2. Instructional surface inventory

| Surface | Inventory | Fresh finding before edits |
|---|---:|---|
| Theory | 8 subtopics | The exception-boundary explanation overstated the effect of `except Exception`; the PII terminology used the false friend `redactar`; retry guidance conflated fixed backoff with jitter |
| I Do | 8 demonstrations | The progression is aligned, but the retry helper could end in `raise None` when `max_attempts=0` |
| We Do | 24 exercises | All 24 intentionally faulty starters printed `ok True`, creating a false success signal before the learner fixed anything |
| You Do | 1 capstone | Contract, fixture, observability requirements and reconciliation oracle align after the boundary clarification |
| Public self-check | 11 MCQs | Coverage and answer-position distribution are valid |
| Authenticated assessment | 24 items, 8 concepts × 3 variants | All 24 correct answers occupied option index 1; several stems/explanations also had grammar or terminology defects |
| Playground | `SectionView` mapping for `visualization` | Still taught matplotlib instead of S09 observability, exceptions and privacy-safe logging |
| PDF progress label | `PdfReport` mapping for `visualization` | Still displayed `9. Viz` |

## 3. Evidence used

- Current runtime sources: `src/lib/course/index.ts`, the full S09 source, the S09 authenticated bank, playground mapping and PDF mapping.
- Current curriculum evidence: roadmap, section/capstone ledgers, Explorer report, expert report, grammar subplan, Spanish-quality evidence and dependency worklog entries.
- Live production HTML and its current JavaScript bundle at `https://pillb.github.io/pyarcana/`. The deployed baseline returned HTTP 200 and independently exposed the stale `Practica matplotlib` and `9. Viz` mappings.
- All 13 research reports supplied for this campaign. Reports that lacked direct source access were used only as pedagogical leads, never as factual evidence of current S09 quality.
- Primary technical sources: the Python errors/exceptions tutorial, Python logging documentation and HOWTO, and the OWASP Logging Cheat Sheet.

The current source and live bundle were rechecked directly. Historical reports were hypotheses only. Existing repairs—such as the eight-node taxonomy, `else`/`finally` treatment, minimal-reproduction guidance, capstone contract and public self-check—were not credited as work from this independent pass.

## 4. Fresh issue-resolution ledger

| ID | Severity | Location | Learning impact | Resolution |
|---|---|---|---|---|
| S09-I01 | P0 | Authenticated bank | A learner could select the second option for all 24 questions without reading | Hand-reordered options to exact `6/6/6/6`; each concept now uses three distinct positions and each attempt slice is `2/2/2/2` |
| S09-I02 | P0 | All 24 We Do starters | `print("ok", True)` falsely declared success in intentionally incomplete or defective code | Removed every false-pass print while retaining the learner task and intentional defect |
| S09-I03 | P0 | Playground | The section-local practice taught matplotlib, contradicting the canonical section | Replaced it with an executable standard-library batch-observability example with fail-fast configuration, masked email, correlation id, quarantine and reconciliation assertion |
| S09-I04 | P1 | PDF mapping | Downloaded evidence labeled S09 as visualization | Corrected the learner-facing label to `9. Excepciones` |
| S09-I05 | P1 | Theory and examples | `redactar/redacción` is a false friend for masking data; broad `except Exception` was described as if it erased traceback by itself | Changed to `enmascarar/enmascarado` and accurately distinguished catching, logging and re-raising at a process boundary |
| S09-I06 | P1 | Retry guidance | Fixed backoff was presented as sufficient to prevent synchronized retries; zero attempts could produce `raise None` | Distinguished backoff from jitter and rejected `max_attempts < 1` |
| S09-I07 | P2 | Authenticated bank | Grammar and orthography distracted from assessment constructs | Corrected `relanzar`, imperative agreement and informal/unclear phrasing |
| S09-I08 | P1 | Regression coverage | Fleet gates allowed the stale mappings, false-pass starters and biased bank | Added a focused six-test S09 contract suite |
| S09-I09 | P0 | Learner packet manifest | Long exercise preambles placed canonical IDs outside the packet parser's bounded lookback; S09 resolved only 22 unique IDs and associated later/nested IDs with the wrong instructions | Moved each existing canonical ID immediately before its instruction, preserving all instructional content and exposing the exact ordered 24-ID sequence |

## 5. Changes made

- Reworked only S09-owned learner content and mappings; no prior report was used to satisfy a completion gate.
- Replaced the stale plotting playground with deterministic, PII-safe observability practice and an exact expected output.
- Corrected the PDF progress label while retaining the stable `visualization` key.
- Hand-balanced the 24 authenticated questions across answer positions, concepts and attempt slices.
- Removed false success output from every We Do starter.
- Tightened the explanation of broad exception boundaries, safe logging, PII masking, backoff/jitter and retry preconditions.
- Positioned all 24 existing exercise IDs at their packet-visible object boundary without changing any learner instruction, starter, solution or oracle.
- Added `tests/adversarial/test_s09_observability_contract.py` to protect structure, runtime behavior, privacy, mappings, assessment distribution and the exact learner-packet ID sequence.
- Used automation only for validation and a mechanical instruction-label normalization; learner-facing prose and question reordering were reviewed and edited manually.

## 6. Validation evidence

| Gate | Result |
|---|---|
| `python3 -m unittest tests.adversarial.test_s09_observability_contract -v` | **PASS** — 7/7 focused tests, including exact ordered IDs `S09-T1-A-E1` through `S09-T4-B-E3` |
| Exact fleet packet test, S09 subtest | **PASS** — S09 no longer appears among the failing subtests; the isolated owner branch still reports 50 failures owned by other, not-yet-integrated sections |
| `python3 scripts/python_content_runtime_audit.py --only s09-visualization --workers 1` | **PASS** — 64 passed, 0 failed, 0 skipped |
| `npx tsc --noEmit` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run test:v3` | **PASS** — counts, structure and invariants for all 52 sections |
| `npm run test:exam-pedagogy` | **PASS** — 1,248 questions, 416 concepts, P0=0, P1=0 |
| `npm run build:static` | **PASS** — production compilation and 3/3 static pages |
| Local exported-site HTTP check | **PASS** — HTTP 200, 202,743 bytes |
| Fresh S09 Spanish audit | **PASS** — score 10.0; high=0, medium=0, low=10; Fernández-Huerta 82.9; 13.4 words/sentence |

Validation scripts that rewrite fleet-wide audit summaries were allowed to execute, then their generated artifacts were restored before staging. Metrics are recorded here without committing campaign-wide side effects.

## 7. Residuals and integration notes

- `visualization` remains the compatibility id and historical source filename; all inspected learner-facing S09 consumers now use the correct topic.
- The public Pages site remains the pre-integration baseline until the parent serially integrates, pushes and deploys this commit. This section owner did not push.
- S09 preserves the dependency bridge: S08's ingestion manifest feeds S09 error classification and correlation, which in turn supports S10's CLI boundary.
- No unresolved S09 P0 or P1 issue remains.

Section 9 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
