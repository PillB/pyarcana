# Fixer ledger

Every box is computed from an artifact, never hand-ticked. Regenerate with
`python3 tools/fixer/ledger.py`; `--check` fails if it is stale.

| step | meaning | done |
|---|---|---:|
| `findings` | codex round applied, registry findings closed | 5/52 |
| `redaction` | grammar and redaction pass applied | 8/52 |
| `concepts` | load-bearing concepts have their own subtopic (D3) | 0/52 |
| `figures` | at least two figures carrying real teaching (D4) | 44/52 |
| `vocab` | no term used before it is defined | 25/52 |
| `ids` | no identifier-shaped synthetic value (D2) | 50/52 |
| `runtime` | every snippet executes under .venv-content | 52/52 |

## Sections

| sec | findings | figs | run-ons | findings | redaction | concepts | figures | vocab | ids | runtime |
|---|---|---:|---:|---|---|---|---|---|---|---|
| **S01** setup | 19/21 | 2 | 2 | [ ] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S02** basics | 21/21 | 2 | 0 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S03** data-structures | 12/17 | 2 | 0 | [ ] | [x] | [ ] | [x] | [ ] | [ ] | [x] |
| **S04** functions-modules | 18/18 | 2 | 0 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S05** oop | 22/22 | 2 | 0 | [x] | [x] | [ ] | [x] | [x] | [x] | [x] |
| **S06** numpy | 20/20 | 2 | 0 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S07** data-acquisition | 19/19 | 2 | 0 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S08** pandas | 26/27 | 2 | 0 | [ ] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S09** visualization | 0/22 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [ ] | [x] |
| **S10** sklearn | 0/22 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S11** testing | 0/22 | 1 | 3 | [ ] | [ ] | [ ] | [ ] | [ ] | [x] | [x] |
| **S12** performance | 0/23 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S13** rpa-automation | 0/27 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S14** security | 0/23 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S15** stdlib-deep | 0/18 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S16** wxpython-gui | 0/23 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S17** packaging | 0/23 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S18** data-engineering | 0/24 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S19** databases-orm | 0/24 | 1 | 0 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S20** rag | 0/24 | 1 | 0 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S21** fastapi | 0/25 | 1 | 1 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S22** rapidfuzz-entity | 0/28 | 3 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S23** computer-vision | 0/27 | 1 | 1 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S24** rpa-advanced | 0/33 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S25** streamlit-dashboards | 0/33 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S26** integrator-phase1 | 0/35 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S27** async-concurrency | 0/30 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S28** llm-agents | 0/35 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S29** mlops | 0/34 | 3 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S30** security-infra | 0/35 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S31** streaming-data | 0/35 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S32** microservices | 0/37 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S33** advanced-models | 0/45 | 3 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S34** cv-ai-integration | 0/43 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S35** system-design | 0/39 | 1 | 0 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S36** ai-apis-advanced | 0/43 | 3 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S37** dbt-bigquery | 0/36 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S38** performance-extreme | 0/57 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S39** integrator-phase2 | 0/81 | 1 | 1 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S40** architecture-ddd-decisions | 0/67 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S41** llm-finetuning | 0/70 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S42** graph-rag | 0/50 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S43** llmops | 0/44 | 3 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S44** multimodal | 0/101 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S45** iac | 0/43 | 3 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S46** gpu-computing | 0/41 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S47** opensource | 0/45 | 4 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S48** ai-governance | 0/46 | 4 | 1 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S49** data-contracts | 0/54 | 3 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S50** tech-leadership | 0/60 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S51** integrator-final | 0/84 | 2 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S52** career-strategy | 0/90 | 1 | 1 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |

## The round, per section

Run in this order. A step that cannot be finished is recorded in
`audit/fixer/OPEN_QUESTIONS.md` rather than skipped silently.

1. **findings** — codex round applied, registry findings closed
2. **redaction** — grammar and redaction pass applied
3. **concepts** — load-bearing concepts have their own subtopic (D3)
4. **figures** — at least two figures carrying real teaching (D4)
5. **vocab** — no term used before it is defined
6. **ids** — no identifier-shaped synthetic value (D2)
7. **runtime** — every snippet executes under .venv-content

Commands: `tools/fixer/run_round.sh SXX --apply`, then
`tools/fixer/build_redaction_prompt.py SXX` for the prose pass.

`concepts` has no automatic proxy: a load-bearing concept needing its own
subtopic (D3) is a judgement, so that column is ticked by a human reading the
section, not by this script.

---

## Observations and heuristics

Hand-maintained. Every entry is something a round found that changes how the next round
should work, for **all** sections. Read before each round; `build_prompt.py`,
`build_redaction_prompt.py` and `build_concept_prompt.py` inject this file so codex reads
it too. Append, don't rewrite: date each entry and say which section taught it.

### Spanish language

- **The existing Spanish quality audit is mostly noise — never send its raw output as fix
  orders.** *(2026-09-14, all sections)* `scripts/spanish_quality_audit.py` reads code, maths
  and list markers as prose. Of 5,356 findings, sampled categories were almost entirely
  false: `placeholder` flags "wip", a deliberate example of a bad commit message; missing
  `¿`/`¡` flags `$?`, `(?i)`, `!r`, `!=`; unbalanced delimiters flags `[1,3)`, correct
  half-open interval notation; plural agreement flags "los cuatro valores", which is
  correct; `fragment` (4,610) flags list numbers "2."; double spaces flags spaces *inside*
  a whitespace-normalisation example, where removing them would break the lesson.
- **Keep glossed technical terms; translate ordinary words.** *(2026-09-14, S46, S51)* The
  editorial protocol deliberately keeps practitioner vocabulary — `rollback`, `schema`,
  `baseline`, `pipeline`, `payload` — provided it is explained in Spanish at first use. Do
  not strip those. Ordinary words with a standard rendering are skipped translations:
  `owner` → *responsable*, `release` → *versión* or *lanzamiento*, `check` →
  *comprobación*, `review` as prose → *revisión*.
- **No Spanglish verbs.** *(2026-09-14, S51)* "Pinear un release" is neither language.
  Use the Spanish verb: *fijar*, *anclar*.
- **A status literal is not prose.** *(2026-09-14, S03)* `accept`/`reject`/`review` are
  domain values the code compares against. Put them in backticks consistently; do not
  translate them, or the prose stops matching the code.
- **Acronyms are fine once expanded** (writing rule A3). SLO, PII, RTO, ACL, OCR are not
  leakage.
- **Code leaks into prose fields without backticks.** *(2026-09-14, S42)* Hints carried
  `return change == "add_optional" and old_ok` as plain text. Wrap code in backticks or a
  code block; a learner cannot tell prose from syntax otherwise, and neither can the
  detectors.
- **Most English in lab prose is field names written bare — backtick them, don't translate.**
  *(2026-09-15, S46)* `inputs`, `outputs`, `owner`, `run_id`, `null_rate` were bare words in
  contracts and steps. The Spanish pass backticked them and translated the connective prose
  around them ("marca de tiempo", "conjuntos", "recuperación"): 18.7 → 14.8 per 1,000 with no
  other measure moving. It also expanded terse steps into code-shaped text
  (`record["metrics"]["null_rate"] <= 0.02`). Every such name must already exist in the
  section's code — verify with a grep against the pre-pass copy; S46's all did. What remains
  is kept or borderline vocabulary (`allowed lateness`, `bound`, `completeness`, `lab`), which
  per-word decisions deliberately left — do not chase the count to zero.
- **Translating nouns makes Spanish heavier, and the gate rejects it.** *(2026-09-15, S51)*
  The pass took S51 from 17.8 to 11.1 avoidable English per 1,000 but raised run-on sentences
  3 → 4 and nominalisations 3.0 → 3.4 per 100 words, so the whole section was restored.
  Spanish renders an English noun as a longer noun phrase; prefer the verb, and split a
  sentence the translation lengthened. Rule added to `build_spanish_prompt.py`; re-run S51.
  *Correction (same day):* the nominalisation half was the instrument — see D7 and "Measures"
  below. The run-on sentence (3 → 4) was real.
- **The Spanish pass must not rewrite Spanish.** *(2026-09-15, S44)* Codex turned "El dueño de
  S44-T4-A" into "La persona responsable de" — the owner → responsable rule applied to a word
  that was never English. `test_master_curriculum_specificity` finds a section's eight callouts
  by their openers ("El dueño de", "Evidencia mínima de", …), so the adversarial suite failed and
  the section was restored. Rule added: leave Spanish words alone and keep callout openers
  verbatim. The same pass also raised B5 constructions 0.9 → 1.3, so re-run S44 rather than
  hand-merge the good patches.
- **Measure English leakage with `scripts/code_switching_audit.py`.** It separates avoidable
  English from policy-kept terms and acronyms. Use it to prioritise sections and confirm a
  pass reduced leakage — not as a list of words to delete.

### Concepts and the concept map

- **The glossary is English-only in a Spanish course, so the concept map under-reports.**
  *(2026-09-14, S04)* `List comprehension` has one alias, in English; S04 defines
  "comprensión de lista", and the detector cannot see it. Until Spanish aliases exist, a
  concept reading "never explained" may be explained in Spanish — check the text first.
- **REMOVE moves the problem later, and that is progress.** *(2026-09-14, S05, S08)*
  Removing a premature use shifts first use downstream: `generator` S05 → S18,
  `context-manager` S08 → S09. `never_explained` stays flat until the new section is
  processed. Read `explanation_lag_sections`, not only the count.
- **Supporting explanatory blocks carry no `subtopicId`.** *(2026-09-14, S04)* Codex
  invented strand `S04-T3-C` and broke the eight-to-eight theory/demo alignment.

### Tests and gates

- **Run both adversarial halves, and read results case-insensitively.** *(2026-09-14)* A grep
  for `adversarial` hid `ADVERSARIAL(py) FAILED` for four rounds; the Node half alone
  caught S02 losing two figures.
- **Probing one section's tests does not speak for fifty-two.** *(2026-09-14, S01, S06)*
  "Exactly one content ceiling" was measured on S02 alone; S01 and S06 each held a heading
  count pinned exactly.
- **Re-pin a prose snapshot only after checking the teaching move survived** — four of six
  "broken" snapshots were pinning against an improvement, one against a misconception the
  section now corrects.
- **Capture failures before restoring a section.** Printed afterwards, against the restored
  file, they pass and say nothing.

### Runtime audit limits

- **The runtime audit cannot detect a wrong number in lesson output.** *(2026-09-14, S02
  probe)* `scripts/python_content_runtime_audit.py` compares only the **first line** of
  output, and when that differs it scrubs every integer and decimal before deciding the
  outputs are "structurally similar". A probe changing `3 tests OK` to `4 tests OK` passed as
  `output_nondeterministic_ok`. Lines after the first are never compared. So "N artifacts,
  0 failures" proves snippets run and the first line has the right shape — not that printed
  values are right. The Python adversarial suite caught that probe; the runtime audit did
  not. The tolerance exists for genuinely nondeterministic output (paths, timestamps,
  timings, and string-set order, since no `PYTHONHASHSEED` is set), so the fix must keep it.
  Until a strict mode exists, do not cite the runtime audit as evidence an output is correct.
  *Update 2026-09-15:* it exists — `scripts/python_content_strict_output_audit.py` (D8), gated
  per section. Cite that for values; the runtime audit only for "it runs".
- **A probe must prove it injected before its verdict means anything.** *(2026-09-14, S02)*
  Twice a probe's injection failed its assert, the gate ran anyway against the clean file,
  and reported what a clean file should. Chain the gate to a non-empty `git diff`.
- **Course-wide absolute gates are useless on a course that is not clean yet.** *(2026-09-14)*
  The identifier gate stayed red on every round because S03, S07 and S09 carry D2 debt. Scope
  gates to the section being changed and measure them as regressions.

- **Don't build a classifier for a small semantic judgment.** *(2026-09-14, glossary aliases)*
  Two regex rules for "is this Spanish alias a name or a gloss" failed in opposite directions:
  word count rejected EDA's own expansion, and bracket position accepted "sistema de control
  de versiones" for Git because the course writes "Git es el sistema…". For 29 items the right
  tool is an explicit decision with a reason each (`audit/fixer/glossary_aliases_es.json`).
  And gloss-ness was never the harm — over-breadth is: a phrase that also names other things.
- **A better instrument can make a count look worse.** *(2026-09-14, glossary aliases)* Adding
  19 Spanish aliases left `never_explained` flat and nudged `used_before_explained` up, because
  two effects cancel: explanations the map could not see became visible (tuple surprising uses
  11 → 4, list-comprehension 21 → 3) and so did gaps it could not see (`outlier` is written
  "valor atípico" from S03, thirteen sections before "outlier" first appears). Compare per
  concept before concluding a change did nothing.

### Measures (2026-09-15)

- **Before trusting a rejection, list what the rejected patch actually added.** *(S28, S44,
  S51)* Three Spanish passes failed only on nominalisation density. Word-by-word, the "new
  nominalisations" were translations of English nouns. The instrument was wrong, not the text
  (D7). Conversely S28's list showed one real defect the proxy had hidden among the noise.
- **Declared outputs drift silently when code is repaired.** *(S08, S18)* A fix round changed
  S08's function to return `(clean, quarantine, error)` with `parsed_row`/`record_number`; the
  declared output still shows the old list with `raw`. After any change to code in a block,
  regenerate its output with `tools/fixer/sync_declared_output.py`, never by hand.

### Live site (2026-09-15, Chrome crawl of all 52 sections)

- **Check the rendered page, not only the source.** *(all sections)* Every gate read the `.ts`
  files and passed, while learners read literal backticks and `**` 721 times on the live site:
  taglines, callouts, self-check questions and options, You Do objectives, requirements and
  rubrics, We Do titles, I Do descriptions, code-block titles, formative-evaluation tasks,
  figure notes. Those fields rendered raw strings. Fixed with `InlineText` (same inline
  renderer as `RichText`) and guarded by `scripts/raw_markdown_rendering.spec.ts`, which
  failed against the live site and passes on the rebuilt one. Consequence for the Spanish
  pass: backticking identifiers is now correct everywhere; before the fix it added visible
  noise in exactly the fields it touched most.
- **Code in a non-backticked field becomes formatting once the field renders markdown.**
  *(S02)* "-3**2 vs (-3)**2" rendered raw before, and would render "2 vs (-3)" in bold after.
  Any exponent, glob or `*args` in prose needs backticks.
- **Never edit a file a running gate reads.** *(S41)* I edited `SectionView.tsx` while S41's
  gate ran; a source-pinned adversarial test failed and S41's valid Spanish pass (10.9 → 0.7,
  every new backtick a real literal or variable) was restored. Re-run S41. Components, tests,
  audits and the gate itself are all read by the gate.
- **A sentence splitter must respect block boundaries.** *(S27)* See D7 follow-up: outcomes
  and bullets end without a period and were fused into false run-ons.
- **The Timeline figure archetype computes `noteLines` and never draws them.** Notes given to
  timeline figures have never been visible. Not fixed in this pass — recorded.
