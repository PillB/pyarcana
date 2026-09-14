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
