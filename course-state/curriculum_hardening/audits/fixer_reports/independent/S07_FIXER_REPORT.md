# S07 Independent Fixer Report — Texto, Unicode y expresiones regulares

**Execution:** fresh independent Section Owner pass
**Section:** 7
**Canonical runtime identity:** `index: 7`, compatibility id/hash `data-acquisition`, title **Texto, Unicode y expresiones regulares**
**Canonical import:** `src/lib/course/index.ts` → `src/lib/course/sections/s07-data-acquisition.ts`
**Public route:** `https://pillb.github.io/pyarcana/#data-acquisition`
**Scope rule:** the current product source was treated only as a baseline. No previous Fixer report or completion claim was accepted as evidence.

## 1. Surfaces inventoried

| Surface | Inventory | Independent inspection |
|---|---:|---|
| Section map and close | 2 theory blocks | Read every paragraph and both roadmap callouts |
| Theory subtopics | 8 (`S07-T1-A`…`S07-T4-B`) | Read all 24 paragraphs, 8 code examples, outputs and callouts |
| I Do | 8 demos | Read every preamble, runnable example, output, rationale and retrospective |
| We Do | 24 exercises | Read every E1/E2/E3 preamble, instruction, hint pair, edge case, starter, solution, output, feedback and retrospective |
| You Do | 1 portfolio increment | Read context, objectives, requirements, four-function starter, `main`, portfolio note, rubric and retrospective |
| Public self-check | 10 questions | Checked coverage, keys, explanations and answer-position pattern |
| Authenticated bank | 24 questions / 8 concepts / 3 variants | Checked content, distractors, keys, attempt equivalence and answer-position bias |
| Runtime mapping | `SectionView.tsx['data-acquisition']` | Inspected and executed the S07-owned interactive playground |
| PDF mapping | `PdfReport.tsx` key `data-acquisition` | Inspected the S07-owned learner label |
| Live deployment | GitHub Pages | HTTP 200; live bundle identity and stale mappings confirmed before repair |

The instructional graph is coherent: Unicode representation → Latin American name heuristics → simple `str` operations → modest contact normalization → disciplined regex → extraction limits → exact/Jaccard similarity → FP/FN and evidence. The section consumes S06 collection contracts and hands `raw` / `normalized` / `transforms` to S08 file and ingestion contracts.

## 2. Evidence used

### Section-specific audit evidence

- `course-state/curriculum_hardening/audits/explorer_reports/S07_EXPLORER_REPORT.md`
- `expert_audit/S07_report.md`
- `expert_audit/_GRAMMAR_SUBPLAN.md`
- `course-state/curriculum_hardening/audits/spanish_quality/S07_SPANISH_QUALITY.json`
- `course-state/curriculum_hardening/audits/spanish_quality/SPANISH_QUALITY_SUMMARY.md`
- `expert_audit/worklog.md` for dependency history only
- `learning_roadmap_52_V3.md` for the authoritative S07 node and S06→S07→S08 edges

The Spanish-quality baseline reports 162 sentences, 13.87 words per sentence, Fernández-Huerta 74.7, Szigriszt-Pazos 70.4 and a 9.66/10 composite. Its 14 heuristic findings were manually checked rather than accepted blindly: several are false positives caused by code literals (`'José', 'José'`), intentional whitespace fixtures and interval notation. The fresh reading still rewrote the backtracking surface for technical truth and clearer Spanish.

### Research syntheses

All 13 supplied reports under `project_sources/*.md` were read and inventoried. Most explicitly state that their target section content was inaccessible and therefore provide only generic gradual-release, cognitive-load, flow and Spanish-editing criteria. The file named `deep-research-report-7.md` likewise did not inspect the active source, so its proposed placeholder section was rejected. The useful shared criteria—worked modeling, guided-to-independent fading, aligned retrieval, short transitions and current-source verification—were applied to the real S07 graph.

### Current primary technical sources

- Python 3.14.6 `unicodedata`: https://docs.python.org/3.14/library/unicodedata.html
- Python 3.14.6 built-in `str.casefold`: https://docs.python.org/3.14/library/stdtypes.html#str.casefold
- Python 3.14.6 `re`: https://docs.python.org/3.14/library/re.html
- Python 3.14.6 Regular Expression HOWTO: https://docs.python.org/3.14/howto/regex.html

These sources confirm that NFC composes canonically equivalent sequences, `casefold` is intended for caseless matching, `fullmatch` requires the whole string, compiled patterns are cached but explicit reuse remains clear and efficient, and stdlib `re` exposes no timeout parameter.

## 3. Independent issue-resolution ledger

| ID | Severity | Current-product defect | Resolution | Files |
|---|---|---|---|---|
| S07-01 | P0 | The learner-facing playground still taught legacy “scraping, regex y SQL”, imported `sqlite3`, used a permissive email regex and never demonstrated Unicode or evidence. | Replaced only the `data-acquisition` mapping with an executable NFC, modest-email, `search`/`fullmatch` and Jaccard-review lab. | `src/components/course/SectionView.tsx` |
| S07-02 | P0 | All 24 authenticated questions used `correctIndex: 1`; choosing the second option scored 100%. | Hand-reordered every family into 6/6/6/6 overall and 2/2/2/2 in each attempt column. | `prisma/seed.ts` |
| S07-03 | P1 | The authenticated Jaccard item said an empty union should return 0 or N/A, while theory, I Do and We Do define both empty inputs as 1.0 and one empty input as 0.0. | Reconciled the question and explanation with the executable section contract. | `prisma/seed.ts` |
| S07-04 | P1 | Theory, exercise and self-check suggested “timeouts” as though stdlib `re` accepted a timeout argument. It does not. | Rewrote the surface to teach simple patterns, bounded input, `str` alternatives and isolation of untrusted patterns outside the process. | `src/lib/course/sections/s07-data-acquisition.ts` |
| S07-05 | P1 | The T3-B transfer starter rendered an apostrophe escape as invalid Python and failed before the learner could repair its intended misconception. | Rephrased the synthetic hostile-input line so the defective starter remains runnable; runtime status moved from 63/64 to 64/64. | `src/lib/course/sections/s07-data-acquisition.ts` |
| S07-06 | P1 | The PDF progress label exposed the obsolete subject `7. Data Acq`. | Changed the S07-owned label to `7. Texto & Unicode`. | `src/components/course/PdfReport.tsx` |
| S07-07 | P2 | One authenticated question exposed the authoring label “S07” instead of asking the technical decision directly; the block comment retained migration/version archaeology. | Reworded the question for learners and reduced the comment to the canonical title. | `prisma/seed.ts` |
| S07-08 | P1 | The newbie-packet parser scans 500 characters backward from each instruction; 15 long S07 preambles put their canonical exercise IDs outside that boundary, so the manifest resolved only 17 unique IDs. | Moved each existing exercise `id` metadata field directly beside its instruction without changing instructional content, then asserted the exact 24-ID canonical order through the real packet parser. | `src/lib/course/sections/s07-data-acquisition.ts`, `tests/adversarial/test_s07_text_contract.py` |

## 4. Theory → I Do → We Do → You Do → assessment outcome

### Theory and connective tissue

- The map defines the `raw` / `normalized` / `transforms` contract before code and closes with a direct S08 encoding/manifest bridge.
- Each of the eight subtopics has three focused paragraphs, runnable code, exact output and a callout.
- The new regex-limit explanation closes a truth gap without adding an unrelated API or advanced dependency.
- No learner-facing V3/retarget/platform-id archaeology remains in the section-owned surfaces changed here.

### I Do

- Eight demos map one-to-one to the eight subtopics.
- Each demo asks the learner to predict output, models the contract, explains why it matters and names a misconception before handing off to We Do.
- S07 runtime execution confirms the demo/theory outputs are truthful.

### We Do

- Every subtopic retains E1 guided → E2 independent → E3 transfer.
- All 24 starters and solutions execute. The freshly discovered T3-B starter syntax failure is fixed.
- The learner-packet manifest now resolves all 24 canonical exercise IDs, uniquely and in source order.
- Hints fade by exercise kind; edge/error reasoning is explicit for empty Unicode strings, incomplete names, malformed email, embedded regex matches, hostile patterns and empty token sets.

### You Do

- `normalize_record` requires the same functions and policies modeled in the preceding surfaces.
- The rubric sums to 100% and does not force regex when `str` is clearer.
- The starter calls the learner’s integrated result from `main` and includes normal, boundary and review obligations in the requirements.

### Self-check and authenticated assessment

- Public self-check: 10 questions covering all eight subtopics, including contact policy, regex limits and extraction.
- Authenticated bank: 8 concepts × 3 variants = 24 questions.
- Correct-answer positions: `{0: 6, 1: 6, 2: 6, 3: 6}`.
- Every attempt column: `{0: 2, 1: 2, 2: 2, 3: 2}`.
- The Jaccard empty-input policy now agrees across theory, demo, exercise and exam.

## 5. Exact files changed

1. `src/lib/course/sections/s07-data-acquisition.ts`
2. `prisma/seed.ts` — only the `data-acquisition` bank
3. `src/components/course/SectionView.tsx` — only the `data-acquisition` playground mapping
4. `src/components/course/PdfReport.tsx` — only the `data-acquisition` label
5. `tests/adversarial/test_s07_text_contract.py`
6. `course-state/curriculum_hardening/audits/fixer_reports/independent/S07_FIXER_REPORT.md`
7. `expert_audit/independent_worklog/S07.md`

No fleet-wide generated audit JSON is part of this change.

## 6. Validation evidence

| Gate | Result |
|---|---|
| Focused S07 adversarial regression | 6/6 tests passed, including exact packet-manifest order |
| Newbie packet exact-contract test | S07 subtest passed with 24/24 unique canonical IDs; remaining failures are owned by other sections |
| Python content runtime audit (`--only s07-data-acquisition`) | 64/64 artifacts passed; P0=0, P1=0 |
| S07 playground execution | Output exactly matches all six displayed lines |
| TypeScript (`npx tsc --noEmit`) | passed |
| ESLint (`npm run lint`) | passed |
| V3 count / structure / invariant | passed; 52 sections, S07 8 subtopics / 8 demos / 24 exercises |
| Exam pedagogy audit | passed; 1,248 questions / 416 concepts; P0=0, P1=0 |
| Production static build | passed; optimized bundle generated |
| Local static HTTP | HTTP 200; 202,697-byte page |
| Built bundle mapping assertions | new playground and `7. Texto & Unicode` present; legacy S07 strings absent |
| Diff whitespace check | passed |

The runtime and exam validators rewrote campaign-wide JSON summaries. Those validation side effects were restored before staging; their metrics are preserved here only.

## 7. Live and render evidence

- Public Pages before this batch: HTTP 200, `last-modified: Sun, 26 Jul 2026 16:05:55 GMT`.
- The deployed page bundle contained all four identity strings: the correct S07 title/short title plus stale `Practica scraping, regex y SQL` and `7. Data Acq`. This independently proved that the defects were learner-visible rather than dead source.
- The fresh local static bundle contains `Practica Unicode, regex y evidencia` and `7. Texto & Unicode`; neither stale S07 string remains.
- The extracted playground code was executed with Python. Its displayed output matches NFC equality, valid/invalid email paths, `search` vs `fullmatch`, Jaccard 0.667 and `review`.

## 8. Residuals and scope boundaries

1. The compatibility filename/id/hash remain `s07-data-acquisition.ts` / `data-acquisition`. The roadmap explicitly preserves the id. Renaming it would require a coordinated progress-key and deep-link migration and is not part of this one-section commit.
2. The public site remains on the pre-batch bundle until the parent integrates S07–S09 and deploys the batch. The local production artifact is ready for that integration gate.
3. No educational prose was produced through scripts, loops, templates or bulk generators. Automation was used only to inspect, execute and validate hand-written work.

**Section 7 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.**
