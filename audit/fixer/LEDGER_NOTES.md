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

### Narration voice (2026-09-16)

- **Write like a teacher narrating, not like an assistant reporting.** *(S01, generalised from
  the Orbiter regression)* The Orbiter paragraph is the worked example of the failure: the round
  replaced "Nadie mintió y nadie se equivocó al calcular; simplemente, cada lado dio por supuesto
  algo que el otro no compartía" — the only sentence stating the transferable rule — with "La
  investigación de NASA también señaló fallas contribuyentes de verificación, comunicación e
  ingeniería de sistemas". Accurate, and it teaches nothing. `3f0cebe9` restored the beat. The
  general rule: a concrete sentence that carries the teaching point outranks an accurate sentence
  that carries none. Prose that reads as competent and teaches nothing has failed, whatever the
  gates say.
- **The register to avoid has a shape, so it can be checked by eye.** Hedging and
  over-qualification; scaffolding phrases ("cabe señalar", "es importante recordar"); an abstract
  noun where a verb would do; bullet-fragmenting an explanation that should flow; even-handed
  neutrality that never commits to what matters; closing sentences that restate instead of
  advancing. Before returning a passage, read it once for this shape alone.
- **Verbosity inflation is the same failure wearing a translation costume, and the gates reward
  it.** *(S51, S28)* "audit append-only" (3 words) became "un registro de auditoría al que solo se
  añade información" (10) at every occurrence; "Drift visible y bloqueado > golden actualizado en
  silencio." became "Una desviación visible y bloqueada protege más que una salida de referencia
  actualizada en silencio." Both lower `avoidable_english_per_1000`, so every gate scores them as
  improvements. A translation that is longer, flatter and less quotable than what it replaced is a
  regression — say so in the critique rather than shipping it because the number improved.
- **Aggregates hide paragraph-level damage.** The Orbiter regression measured FH −24.7 and b5
  0 → 33.3 per 100 sentences *at paragraph scale*, and moved the gated section measure 0.6 → 0.6.
  A green gate is not evidence that a passage survived; read the passage.

### The concept map's instrument (2026-09-16)

- **A hint is not a lesson, and a quiz option is not a lesson.** *(S02, course-wide)* Any event
  kind could carry a concept's *first definition*, so 18 of 77 defined concepts were credited to
  a surface the learner reaches only after they needed the term — `dict-comprehension` to a weDo
  title, `reshape` to a starter, and `distribución normal` to a selfcheck **distractor**: the
  quiz that tests a concept recorded as the place that taught it. `concept_map.py` now accepts a
  first definition only from a teaching surface (theory, callout, heading, iDo prose, jobRelevance,
  tagline); everything else is kept as `reinforcements`. Eleven concepts moved to L0 on the first
  run, `variable` among them — the most basic term in the course, previously "defined" by a hint.
- **Spanish teaches with a verb far more often than with a copula.** *(S02)* `definesTerm` knew
  only "es un/es una", so "Una **tupla** reúne varios valores en un orden fijo" did not count and
  the four paragraphs that teach tuples were filed as *surprising uses* of the term. An indefinite
  article plus a describing verb now counts. Before assuming a concept is untaught, read the
  paragraph: the instrument was wrong about this one for the whole campaign.
- **A parenthetical full of code is not a gloss.** *(S02)* `(valor, tipo_esperado)` in a hint was
  read as the definition of `tuple`. A gloss is prose and contains function words; an argument
  list does not.
- **L3 could skip the worked example.** The ladder tested heading+figure before examples, so a
  concept with orientation and a diagram but no worked example scored highest. D3 makes L3 mean
  L2 *plus* orientation and a figure.
- **Adding a term to the glossary is a measurement change, and it will look like a regression.**
  *(2026-09-16)* Eight core-language terms (`function`, `parameter`, `return`, `annotation`, `if`,
  `for`, `unpacking`, `exception`) took surprising uses from 761 to 2,348 and doubled
  `concept_map.json`. Nothing got worse; the course had been measured with an instrument that
  could not see the language it teaches. Expect the same each time the vocabulary grows, and
  re-snapshot before reading a round's gate delta.

### Locking (2026-09-16)

- **The per-section lock does not make two rounds safe to run at once.** *(found while planning
  the S39/S27/S03 residuals)* `run_spanish.sh` now takes a lock on the section it edits, which
  stops two runners fighting over one file - the S44 failure. But four of `gate.py`'s regression
  measures are **course-wide**, not per-section: `never_explained`, `used_before_explained` and
  `first_use_issues` are computed from the whole concept map, and the strict-output and
  identifier audits scan every section. A second runner editing a *different* section still
  moves those numbers underneath the first runner's snapshot-to-check window, and the first
  round gets blamed for a delta it did not cause. Run one section at a time until the
  course-wide measures are scoped per-section or a global lock exists.

- **"regresiones de matching" has now cost three rounds; translate it with a verb.** *(S28)*
  Every pass renders it "regresiones del emparejamiento", which is a real B5 chain — two
  nominalisations joined by *del* — and `decisions.md` names it as the one genuine defect the
  old suffix proxy had hidden among its noise. Write what actually happens instead: *"esconde
  que el emparejamiento empeore sin avisar"*, or *"esconde fallas nuevas en el emparejamiento"*.
  Do **not** reach for "regresiones en el emparejamiento": it slips past the regex because the
  measure looks for *de/del*, while leaving the same noun-heavy sentence a reader has to unpack.
  That is gaming the instrument, which is the one move this campaign never makes.

- **A translated term must not leave the section calling one thing two names.** *(S44)* The
  Spanish pass turned three of twenty-nine "workflow"s into "flujo de trabajo", so one concept
  had two names in one section — while the learner types `.github/workflows/ci-supply-chain.yml`
  and reads "workflow" in the GitHub Actions UI. Every gate passed it; nothing measures naming
  consistency (writing rule A5 has no instrument). Reverted to the practitioner term. Before
  translating a word, count how many times the section already uses it and whether the learner
  meets it in a tool. Still owed: `workflow` is kept vocabulary and rule 2 wants it glossed once
  at first use in S44 — queued for that section's round, not done here.

- **`ticket` stays English where the learner meets it in a tool.** *(S39)* The pass turned "el
  ticket de remediación" into "la incidencia de remediación", which both created a B5 chain and
  traded away the word the learner will read in Jira or GitHub Issues. Rule 3 already says
  *ticket* survives where the tool shows it; incident and remediation workflows are exactly that
  case. The sentence was already Spanish — see the S44 note, the Spanish pass must not rewrite
  Spanish. Accepted separately: **lista de comprobación** is the standard rendering of
  *checklist*, a named artifact, and is now in `b5_established_terms.json`.

### No-ops are failures (2026-09-16)

- **A round that changed nothing did not pass; it failed quietly.** *(S39, and the runner itself)*
  Every regression gate compares the section against a snapshot of itself, so when no patch lands
  they all go green and the run reports success having improved nothing. S39 printed "passed
  every gate" and exited 0 with 48 patches rolled back. `run_spanish.sh` now treats zero applied
  patches as a failure and says the PASS lines mean nothing in that case. Read any green round
  with `applied 0` as a red one.
- **The same rule applies to anything else that reports nothing.** Three scripted edits in one
  session silently did nothing and looked like success: a `git grep -lE "\b<name>\.ts\b"` loop
  that matched no files because `\b` does not behave against hyphenated names, and two `perl`
  invocations lost to shell escaping. A tool that edits nothing must say so; if it cannot, count
  the matches before and after and fail when the count is zero. Prefer the Edit tool, which
  errors instead of shrugging.
- **One bad patch should cost one patch, not the round.** *(S39)* A single replacement embedding
  an unescaped quote broke the file and rolled back 48 good patches, twice. `apply_patches.py`
  now bisects on a typecheck failure (~log2(n) checks, only after a failure), rejects just the
  culprits with `this patch stopped the file parsing`, and keeps the rest.

- **When the English subject is a noun, make the Spanish subject an infinitive.** *(S39)*
  "Release del triage es política firmable" became "**El lanzamiento del** triage exige una
  política firmable", which is B5's actor shape exactly: a nominalisation doing the sentence's
  work. Spanish has a better move than either the noun or a clause — the plain infinitive:
  *"Lanzar el triage exige una política firmable"*. It is shorter than the nominalised version,
  reads as speech rather than documentation, and the measure does not fire. Reach for it whenever
  a translation is about to open a sentence with "El/La <algo>ción/miento de…".

- **Check every occurrence of a term, not the first one.** *(S01, course-wide)* The extractor
  tested the definition cue only at the first match, so "añade Python y Ruff; Ruff es un programa
  que señala algunos errores" never registered — the `;` blocks `POST_CUE`, and the definition in
  the very next clause was never looked at. `ruff` scored never-explained across 39 uses with its
  definition sitting in the same sentence. Now every occurrence is tested.
- **A preview surface can teach, and We Do is a teaching phase.** D1 puts taglines, learning
  outcomes and jobRelevance on the same footing, so excluding `outcome` while keeping the other
  two was arbitrary; and in gradual release the We Do preamble and instruction *are* the
  guidance, so a term explained there has been taught with support. A weDo **hint** still cannot
  count: the learner only sees it after being stuck. These two corrections together took
  surprising uses from 2,307 to 1,359 without letting a single one of the absurd cases back in -
  `distribución normal` is still not taught by a quiz distractor.

- **Write the gloss the way Spanish writes it; then check the instrument can see it.** *(S08,
  S15, S30, S48)* Four well-written glosses landed and the map still called all four terms never
  explained, because the detector only knew copulas, verb-first sentences and long parentheticals.
  It could not see an **appositive** ("`Counter`, un contador de elementos de una secuencia"), a
  **contrast** ("`defaultdict` se diferencia de un `dict` común en que…"), or a **short
  parenthetical** ("`loc` (por etiquetas)" — thirteen characters, under an eighteen-character
  floor). All three are ordinary Spanish. They are recognised now, and the four terms went from
  128 surprising uses to zero without another word being written. When a fix does not move the
  number, suspect the instrument before rewriting the prose.

- **Ask D6's first question before writing the brief, not after reading the draft.** *(S14, S17,
  2026-09-17)* The brief said "explain `reshape`" and "say what `resample` does", and codex did
  both, well. Both were wrong: S14 never calls `reshape` (the code inserts an axis with
  `[:, None]`, and two comments call that "reshape"), and S17 mentions `resample` once and never
  uses it; S34's "resample" is class rebalancing, a different operation. The mistake was in the
  brief, so no draft could have fixed it. For each term, find a use the learner must *act on*
  before asking for a definition; if there is none, the treatment is to remove the mention.
- **Read `what_could_confuse`; do not trust `residual_concern: ""`.** *(S14)* Codex returned the
  `reshape` paragraph with `addressed_in_this_replacement: true` and an empty residual concern,
  while its own `what_could_confuse` said the sentence could make a learner look for an
  `np.reshape` call that is not there. The self-critique found the defect; the summary field did
  not carry it. Review the prose field, not the boolean.
