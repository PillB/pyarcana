# Owner decisions, live

Decisions the owner took on questions only they could answer. Each one binds the rounds named in
its **Scope** until its **Retire when** condition is met; then it moves to the archive at the
bottom, with the date and what replaced it.

This file is read at the start of every round (`LESSON_READINESS.md` step 2) and injected whole
into every codex brief, beside `decisions.md`. `decisions.md` holds the standing rules of the
campaign (D1–D14); this holds the owner's answers to specific questions, which expire.

---

## 2026-09-29 — the S03 route-2 questions

Raised by the S03 red team (`rca/s03-redteam-findings.md`), answered by the owner the same day.

### O1 — Money is `int` OR `Decimal`, never one alone
**Scope:** S03 and every later section that validates an amount. **Status:** live.

The type check is `not (isinstance(monto_ingreso, int) or isinstance(monto_ingreso, Decimal))
or isinstance(monto_ingreso, bool)` → `BAD_TYPE`. It uses only S02's `isinstance` and S03's `or`.

Why: S02 hands over `Decimal("150.50")` and S04's fixtures are plain `int`s, so either type alone
rejects the other side's own data. Verified on 3.12: S02's Decimal accepts, the five S04 fixtures
give `['OK','OK','OUT_OF_RANGE','OK','OK']`, `True` is rejected, and `Decimal("0.00")` keeps the
falsy-zero trap the section is built on.

**Retire when:** a later decision changes the money type for the whole S02→S04 chain.

### O2 — S03 lands now; S04's You Do is rescoped in S04's own round
**Scope:** this S03 round, and S04's route-2 round. **Status:** live, with an owed item.

S03 does not wait for S04. The owner's condition: **it must be taken care of in S04 later.** So
S04's route-2 round is bound to rescope `s04:1797-1880` and `s04:103`, which today say «reutiliza
la validación tri-estado por campo (S03)», hand the learner
`def validate_record(record: dict) -> dict` and call it inside a loop — none of which S03 will
practise any more. S04 consumes S03's handoff instead: the case table, the per-field
`*_status` / `*_code` / `*_message` names, and `registro_status`.

**Retire when:** S04's route-2 round has landed that rescope. Until then it is a binding
WORK_QUEUE item, not a suggestion.

### O3 — S03's `contacto` invariant aligns to S02's value
**Scope:** S03 theory T4-A, T4-A-DEMO, the exam bank (`seed.ts:907`, `:935`). **Status:** live.

S03 requires 9 digits; S02 hands over `"0999000111"`, which is 10 characters, and S03's rule
rejects it (verified). S03 moves to S02's value, not the other way round: S02's leading-zero
lesson is the more load-bearing one, and the course's own data must pass its own rules.

This changes pinned outputs and two exam items. The separate `seed.ts:907` «gate» wording fix is
not part of this.

**Retire when:** S03's invariant and S02's produced value agree in the shipped course.

### O4 — `monto_ingreso`, and S02's raw line travels with every case
**Scope:** S02→S03→S04 field names and the record schema. **Status:** live.
Supersedes the reserved part of L1Q3-7 (`DECISIONS_2026-09-21.md:839-857`).

`monto_ingreso` is the S03/S04 name for S02's `monto`. Each S03 case carries S02's raw line,
because S04 expects `raw_line` and dropping it between sections is what forces the later
mismatch. `region` is introduced in S03; S02 hands over no region.

**Retire when:** the schema is written into the You Do's opening comment and the README, and
S04's round consumes it.

### O5 — No capstone file is touched in the S03 round
**Scope:** `src/lib/capstones/`, `course-state/capstones/`, `src/lib/eligibility/`.
**Status:** live.

S03 removes only the learner-facing CP-N1-A **label** (`s03:52, 62, 1176, 2351, 2353, 2370, 2508`
and `seed.ts:944`), following S02's precedent of zero mentions. The increment **framing** stays,
as S02 kept it.

The capstone's own defects are deferred to **S04's round**, where the gate lives, and re-raised
there rather than fixed in passing: the gate at S04 with its S01–S04 dependencies; a brief that
still calls S03 «estructuras de datos», says `amount=0 → warn` (S03 teaches zero is valid) and
takes «una lista de registros (dicts)»; and a reference implementation that tests presence by
truthiness (the defect S03 teaches learners to repair), accepts `True` as money and rejects every
`Decimal`.

**Retire when:** S04's round has re-raised the gate, the brief and `demo.py` with the owner.

### O6 — S04-T3-B-E3 is fixed as a satellite of this round
**Scope:** this S03 round. **Status:** live.

Once S03 stops requiring `dict` in its practice text, the course's first dict requirement moves to
`iteration-summaries.S04-T3-B-E3.instruction` — inside CP-N1-A's gate section — so the capstone
goes 0 → 1 blocking gaps while the course-wide total falls 29 → 26 and hides it. That instruction
and its hints are rewritten in this round rather than logged as a known-bad row.
`badge_catalog.json` needs no change.

**Retire when:** the round lands with CP-N1-A's row still at zero.

### O7 — `theory[3]` stays in S03 this round, with a non-optional bridge
**Scope:** S03 `theory[3]` («Una regla con nombre: `def`, llamada y `return`»). **Status:** live.

It holds the course's first definitions of `parameter` and `return`, which S04 still uses, and it
is the 42nd program against a floor of 41. Its bridge sentence becomes **non-optional**, so the
section says plainly that naming a rule is S05's subject and that the repeated blocks ahead are
the honest cost until then. A previous round that replaced this block exposed 58 uses and was
discarded.

**Retire when:** S04's route-2 round has removed S04's 8 `return` and 1 `parameter` uses; the
block then moves to S05.

### O8 — S03-T1-A-E3 is replaced, not kept
**Scope:** S03-T1-A-E3. **Status:** live.

It nearly duplicates S02-T2-B-E1, down to the file name `is_vs_eq.py`. It becomes S03-specific
(`region` None vs `"R-OESTE"`: `in`, `== None`, `is None`). Its success contract changes, which
D14 permits. A duplicate at this point teaches nothing new.

**Retire when:** the replacement has landed.

### O9 — `communication_audience_tuned` is accepted for now
**Scope:** course-wide credential scoping. **Status:** live, owed.

It is a critical competency of `integrated_python_ai_capstone_foundations` (S01–S13) and has no
mapped practice before S26. `badge_readiness_audit.py` never reads `critical_competencies`, so no
report shows it. Not caused by S03, and not fixed by it. S03 holds its three closest surfaces at
least as strong as they were.

**Retire when:** the competency is re-scoped, or practice for it lands before S13.

### O10 — Relabel the inverted badges, and carry the capabilities forward
**Scope:** `badge_catalog.json`, both copies. **Status:** live.

Four `applied_skill` badges are relabelled to the level where their evidence actually completes
(`independent_data_preparation`, `reliable_automation_development` → `independent_practitioner`;
`applied_sql_query_development` → `advanced_applied`; `applied_mlops_pipeline_delivery` →
`integrated_mastery`). The owner's condition: a capability removed from a level's claim **must be
picked up by a later badge** — never dropped. So each stripped prerequisite moves one level forward.

`capability_level` has zero code consumers, so the relabel is semantics; what clears the five audit
failures is the prerequisite carry-forward, because the rule is
`max(prereq.required_sections) > max(own.required_sections)`. Note there are **two** badge catalogs
(`src/lib/eligibility/` is live, `industry_alignment/` is read by the only badge test that runs);
`capability_level` agrees across all 31 in both today, so both must be edited.

**Retire when:** `badge_readiness_audit.py` reports 0 failures and both catalogs agree.

**2026-10-05, from the G0 adversarial gate:** the chain above was computed on section tokens that
were chosen by **slug**, not by title. About 15 `applied_skill` and `integrated_*` badges cite
sections whose titles teach something else (`applied_rag_llm_service_development` cites `rag`, which
is the Excel section). Re-keyed to the sections whose titles teach each claim, 4 of the 5 inversions
survive, but their endpoints move. So the relabel is **re-derived after the title re-key** (O17's
manifest), not carried as written. The owner's pickup condition is unchanged.

### O11 — Three new sections; proceed despite the migration cost
**Scope:** course structure, 52 → 55 sections. **Status:** live.

S19 *Inferencia*, S20 *Diseño experimental, estimandos y causalidad*, S35 *Regresión y
regularización*. Inference in N2, regression at the head of the N3 ML block.

The cost was re-presented with real numbers — ~1,360 stable id rewrites, 76 figure ids,
`preservation_sentinel.mjs` failing on ~816 "removed" exercise ids, a protected roadmap file, and a
level-hours assertion that hardcodes 13-section windows — and the owner reaffirmed. The sentinel is
to be taught the renumber map rather than disabled, so the protection survives the migration.

**Retire when:** all 55 sections render, gates are green, and the roadmap carries 55 headings.

### O12 — `namedtuple` retired; `estimando` kept and delivered
**Scope:** `src/lib/glossary/terms.ts`. **Status:** live.

`namedtuple` is retired in favour of `dataclass`, which the course already teaches heavily (S11, 189
occurrences) while `namedtuple` appears nowhere.

`estimando` was challenged as a possible common Spanish word. It is not: it is the standard Spanish
technical term for *estimand*, paired against *estimador*, following the gerundive pattern of
*sumando*/*minuendo*/*sustraendo*. It **is** a homonym with the gerund of *estimar*, so it needs the
same disambiguation as `correlación`/correlation-id. It is therefore **delivered in S20**, not
retired.

**Retire when:** `namedtuple` is gone, `dataclass` has an entry, and S20 teaches the estimand.

### O13 — The N1 credential claim is narrowed to match its evidence
**Scope:** `integrated_python_ai_capstone_foundations.public_claim`. **Status:** live, owed.

Stripped of three prerequisites by O10, it retains only `progress_phase0_walked` and
`python_data_foundations` (S01–S05), while still claiming the learner *"demostró independientemente"*
the integrated foundations competency. The claim is narrowed to exactly what S01–S13 evidences.
Codex drafts the Spanish; **the wording returns for sign-off before it lands.**

**Retire when:** the narrowed claim is signed off and in both catalogs.

### O14 — The tautological `assert` tier is its own ratcheted campaign
**Scope:** 133 exercises across 17 sections. **Status:** live, owed.

`assert <var> is True` over literal fixtures appears **133 times across 17 sections** — exactly 8 per
section from S32 onward, i.e. the whole E1 tier of the course's back half. There is no input and the
fixture never varies, so the assertion cannot fail; `AGENTS.md` names this failure directly
(*"tautological tests are worse than no test"*). Every badge resting on those sections is partly
evidenced by assertions that cannot fail.

Handled as a tracked, two-sided ratchet so the count cannot rise, paid down per section round by
giving each E1 a real input and a falsifiable assertion. Deliberately **not** folded into the
statistics work, so it stays visible.

**Retire when:** the ratchet reaches 0.

### O15 — The undeclared teaching packages are declared, not designed around
**Scope:** `requirements-content.txt`. **Status:** live.

Eight packages were installed in `.venv-content` and never declared: matplotlib, openpyxl, jinja2,
Pillow, pymupdf, pypdf, python-docx, playwright. The snippets importing them ran locally and
**skipped in CI** — 6 missing-dependency skips measured locally against 54 in CI. A skipped snippet
is an unverified `output:` promise, so the runtime audit was reporting a green it had not earned.

The owner's call: declare them. The snippets are correct Python, `.venv-content` proves they run,
and the manifest is what fell behind the content. Rewriting working lesson code to satisfy a stale
manifest would be the measure driving the course.

Each is imported by the section whose subject it is — matplotlib S19, openpyxl S20, jinja2/Pillow/
pymupdf/pypdf/python-docx S21, playwright S23 — so none is optional. All pinned to the versions
`.venv-content` is verified against, because a floating version can change a printed value.
Transitive dependencies are deliberately left unpinned.

**Discharged 2026-10-04.** CI's count fell **54 → 6** on the first run after the declaration and now
matches the local count exactly; the runtime audit went green on the same run (3311 pass, 0 fail,
p0 0, p1 0). `MISSING_DEPENDENCY_OWED` lowered 54 → 6 with a dated line.

**Retire when:** the tail is closed. Six skips remain, the same kind of gap and in sections whose
subject the package is: five in `fastapi` (S21, *"Documentos, plantillas y reportes trazables"*)
import `reportlab`, and one in `llm-finetuning` (S41, *"APIs con FastAPI y contratos HTTP"*) imports
`fastapi`. They are **owed, not accepted**. Declaring them needs a measured run proving their
snippets *pass* rather than fail first — a snippet that starts an ASGI server turns an honest skip
into a CI hang, which is worse.

### O16 — The ruled placement stands after the adversarial gate
**Scope:** course structure, 52 → 55 sections. **Status:** live.

The owner required a red team, an anti-challenge and a VP-of-AI-and-pedagogy review before the
renumber. Three verifiers checked 31 of their claims (18 true, 13 partly, 0 false), and four review
rounds followed. The gate recommended placement G — inference S19, regression S34, design and
causality S37 — chiefly because model-based IPW and CUPED need what old S33/S34 teach. The owner
saw that recommendation with its reasons and **kept the ruling**: S19 *Inferencia* and S20 *Diseño
experimental, estimandos y causalidad* in N2, S35 *Regresión y regularización* at the head of the
N3 ML block. Old S19–S32 move +2; old S33–S52 move +3.

What the gate changed inside the ruling: each new section teaches only the **delta** over what S18
and old S33 already teach. S18 already teaches intervals, bootstrap, Cohen's d, reading a p-value,
and randomisation against self-selection. Old S33 already teaches logistic regression, L2 and group
cross-validation. At N2, S20 teaches CUPED through θ = cov(Y, X)/var(X) and IPW through stratum
propensities; the model-based forms return as bridges after S35. Full record:
`audit/fixer/renumber_g0/` (start with `SYNTHESIS.md`).

**Retire when:** O11 retires.

### O17 — Gate A: the guards and claims that precede the renumber
**Scope:** protected paths and credential claims touched before any renumber. **Status:** live.

Approved in full, each an ask-first item:
- CI runs on a `curriculum/55` integration branch, because the renumber cannot be staged across
  merges to `main`. Guards land **before** the renumber, each with a mutation proof. The
  preservation sentinel learns two things: a branch's first push is not an unreadable base, and the
  section count comes from the roadmap's headings instead of the literal 52. CODEOWNERS and an
  `AGENTS.md` ask-first line cover the new state files.
- Deploy runs only after tests pass on `main`, checks out the commit that was tested, and loses its
  manual `workflow_dispatch` trigger.
- Positional badges (phase, journey, level capstone) derive their spans from the level. Their
  claims carry no counts, versioned 2.0.0. The stale `industry_alignment/` catalog is synced to the
  live one. Codex writes the text; it returns as a diff before it lands. Nothing is awarded
  retroactively — no learner holds a badge today.
- S18 gains the word *estimando*; S18's "prefer bootstrap with heavy tails" line is softened,
  because a coverage simulation showed the percentile bootstrap undercovers at small n; the glossary
  p-value definition is rewritten in S18's own correct words (it omits "or more extreme" today).

**Retire when:** every item has landed on `main`.

### O18 — Untaught claimed capabilities are teaching debts, never dropped
**Scope:** badge claims naming deep learning, fine-tuning and graph-RAG. **Status:** live, owed.

No section title teaches these three, yet badges claim them. O10's rule forbids dropping a claimed
capability. The owner's call: **keep the claims and teach them later**, scheduled after the
statistics work. Until then a guard blocks issuing any badge whose claimed skill has no teaching
home. No learner holds these badges, so nothing is withdrawn from anyone.

**Retire when:** each of the three has a teaching home with practice and assessment, and the guard
reports none owed.

### O19 — Gate B: the renumber's design decisions
**Scope:** the design of record, `audit/fixer/renumber_g0/design_ruled_final.md` §5. **Status:** live.

Answered 2026-10-06, each the recommendation:
- **Teaching-debt guard (decision 17).** A home is a section whose title or a learning outcome
  names the skill, with at least one We Do or You Do practising it and one selfCheck,
  topic-evaluation or exam item assessing it. The guard covers every credential that claims a
  skill. **The 5 `local_achievement` progress markers are exempt**: their `non_claims` already say
  they prove no competency, so they claim walking the sections, not a skill. (The design proposed
  covering them too; the owner chose the narrower scope.)
- **CP-N2-B (8a).** One gate at S23 for the six-section arc S18–S23, no sub-gate. It gains two
  criteria: every claim from a sample cites n, a CI and an effect size, with tests only on
  pre-declared comparisons and Holm across them; and the experiment readout passes
  `validar_readout`. The capstone count stays 13.
- **S19's title (12).** The ruled title stays. A guard requires the lesson text to say «contraste de
  hipótesis»; the title is exempt.
- **The rest, as a package:** a new badge `applied_statistical_inference` (S18–S20); skill-node
  additions to the capstone and role badges, with Codex claim text returning at Gate C; the
  declared statistics boundary (§2 of the design); S35's increment for CP-N3-B (8b); a pilot-plan
  deliverable for CP-N3-C (8c); model-based IPW as a worked example in S38 (18); one S36 exercise
  printing odds ratios (19); and the sense guard split into an alias rule and a body-prose rule (20).

**Asked before the renumber PR, answered 2026-10-13 (see O22):** 4 (defer 2SLS and do-calculus), 9
(which roadmap is authoritative), 10 (homonym list), 11 (one learner notice; the certificado
threshold becomes 55/55, which touches the progress document's legal constraints), 13 (amending
`AGENTS.md` and `course_requirements.json`), 15 (parallel work).

**Retire when:** every item has landed or been superseded by a later decision.

### O20 — Exam banks: adopt the GLM lane's rewrites, shuffle per attempt, trim teaching not precision
**Scope:** `prisma/seed.ts` QUESTION_BANK, the exam start route, the length-cue ratchet.
**Status:** live, partly paid. Evidence: `audit/fixer/glm_exam_bank_review/`. Landed 2026-10-13:
the 110 rewrites (#85), the per-attempt shuffle (#91), D21. Owed: the 8 redos with the S10 lesson
lines, the reseed, the S12 and S13 banks.

Answered 2026-10-07, each the recommendation:
- **Content.** Land 110 of the GLM lane's 118 rewritten questions (S05, S08–S11; 0 wrong keys, 0
  reorder failures). Codex redoes the other 8 (S05#16, S08#7, S09#9, S09#20, S09#21, S09#22,
  S10#23, S11#22), and in the same round fixes the S10 key and lesson lines on `python -m` and the
  working directory (contradicted by the current Python docs) and on circular imports, so key and
  lesson agree. This replaces existing items, which preservation-first sends to the owner.
- **Answer positions.** Shuffle each question's options when an attempt starts, and store the
  permuted key with the attempt (`ExamAttemptForm`). It fixes the 29 banks whose answers all sit at
  B without editing any question, and it survives the 52 → 55 renumber. The static per-section
  position cycle is superseded.
- **Key length.** Follow the NBME Item-Writing Guide: remove teaching points and rationale from the
  correct option, never the detail that makes it correct. The length-cue test's "never trim the
  key" docstring is amended to say so.
- **Decision record.** The GLM lane's D15 collides with main's D15 (ADR-7) and rests on a false root
  cause: all 52 banks existed; five double-quoted keys were missed by single-quote parsers. It is
  recorded on main as **D21** with that correction.
- **Tooling.** Both GLM scripts are retired: the position rebalancer (superseded by the shuffle) and
  the repair applier (cannot repair a bank's last question, no tests). Codex's question fixes go
  through `tools/fixer/apply_patches.py`, which already edits any repo file by unique anchor.
- **Reseed.** Once, after the 110 rewrites and the 8 redos are both merged; the owner runs it.
  Attempts in progress keep their own questions and key.
- **S12 and S13.** Their 48 templated questions are the real missing banks. Written next, beside
  the Phase 0 guard work.

**Retire when:** the 110 and the 8 are on main and reseeded, the shuffle is live, D21 is recorded,
and S12 and S13 have real banks.

---

## 2026-10-12 and 13 — the A/B/C fix plan, Gate B's carry-overs, and how work lands

Asked while planning the fixes for review findings A1–A7, B8–B11 and C12–C13 (plan of 2026-10-12),
and while closing Gate B. Each answer is the recommendation unless it says otherwise.

### O21 — The A/B/C fix plan: four rulings
**Scope:** the complexity gate, the S18 round (design step 0b-7), the self-checks. **Status:** live.

Answered 2026-10-12:
- **The Python complexity script.** The owner's `scripts/complexity_gate_py.py` is committed as the
  owner wrote it, in its own commit; the fixes go on top in later commits (fail closed, a
  per-function baseline, no skipped files). The agent never rewrites it in place of the original.
- **How Python counts.** Like the TypeScript gate (ESLint's `complexity` rule; NIST SP 500-235
  §4.1): `and`/`or`, conditional expressions and comprehension `if`s each add 1, and a nested def
  is scored on its own. So the ceiling of 15 means the same thing in both languages. (mccabe and
  ruff C901 count fewer.)
- **Four more glossary hovers in the S18 round.** Correlation, train/test split, ROC-AUC and
  StratifiedKFold carry the same defect as the p-value hover, so the same round fixes them, each
  with a registry entry (KFC-006 to KFC-009) and a fact test.
- **Self-checks.** Options shuffle on every attempt. Below 70% the learner sees the score and the
  subtopics to revisit, with no key, no explanation and no per-question mark; at 70% or more, the
  full review. Learners below 70 lose item-level feedback until they pass; that is the accepted cost.

Landed: the self-checks (#90), the registry (#88). **Retire when:** the Python gate is on main and
the S18 round has merged.

### O22 — Gate B carry-overs: all six as recommended
**Scope:** the renumber PR and its window (design of record §5). **Status:** live.

Answered 2026-10-13, closing O19's open list:
- **4.** Two-stage least squares and do-calculus are deferred: this renumber does not teach them.
- **9.** The V3 roadmap is authoritative for section titles and order.
- **10.** The homonym list as proposed in the design.
- **11.** One learner notice when the course becomes 55 sections. The certificado de finalización
  needs 55 of 55 from then on. Nothing already issued or earned is changed retroactively.
- **13.** `AGENTS.md` and `course_requirements.json` are amended in the renumber PR, with the
  numbering they describe. In `AGENTS.md` that is the first bullet under "## Invariants", which
  reads «52 active sections, unique stable IDs; exercise IDs `Sxx-Ty-Z-En` stay present.» (named
  by its text, because line numbers drift).
- **15.** Work runs in parallel where the design allows it.

**Retire when:** the renumber has merged to main and the learner notice is published.

### O23 — Placeholder scaffolds for S19, S20 and S35
**Scope:** the `curriculum/55` branch only. **Status:** live.

Answered 2026-10-13: the renumber may land placeholder sections for S19, S20 and S35 so the numbering
is whole while they are written, on `curriculum/55` only and behind guard G-13, which blocks merge to
main and deploy while any placeholder is unwritten. A placeholder never reaches a learner.

**Retire when:** S19, S20 and S35 are written and G-13 passes.

### O24 — How work lands: merging, the owner's files, and two sign-offs
**Scope:** every PR of the A/B/C plan and the renumber. **Status:** live.

Answered 2026-10-13:
- **Merging.** The agent merges its own PRs when CI is green and every review finding (Codex's
  P1/P2 included) is fixed. The branch rule asks for one approving review, which the
  owner's account cannot give to its own PRs, so these merges use the admin override. The owner
  still sees the diff first where a decision says so (the copy PR below).
- **The owner's uncommitted files.** The agent brings them in on branches, unchanged in their own
  commit: `scripts/complexity_gate_py.py`, the two-line `AGENTS.md` edit, and the roadmap diff.
- **#82's claim text.** Signed off as written.
- **Copy that promises what does not exist (plan PR 13).** All three items: the "anti-plagio" exam
  copy, the credential UI's promises, and the signed statement's "independent review". Codex
  rewrites each to state what is true; the owner sees the diff before merge.

**Retire when:** the renumber has merged to main.

### O25 — Four questions from the Phase 0b drafts
**Scope:** the copy PR (plan PR 13), the number-guards PR (0b-8), the history-guards PR (0b-1),
the fixer-state PR (0b-6). **Status:** live.

Asked 2026-10-13. The owner answered the fourth; on the first three the owner had no preference, so
the recommendation was taken, and each says so.
- **"Tamper-evident", not "tamper-proof"** (no preference; recommendation taken). The badge catalog's
  Spanish «a prueba de manipulación» reads as tamper-proof, while an HMAC signature only detects a
  changed document. Codex rewrites the catalog phrase to state detection, and each credential whose
  claim text changes gets a version bump.
- **Run button on S10 and S11 demos** (no preference; recommendation taken). The demos that import
  numpy or scikit-learn show a notice to run them locally instead of a Run button, because the
  in-browser Python cannot load the course's pinned versions. *Correction, same day:* the question
  overstated S11. Its demo imports numpy and never uses it, so its output cannot drift; it keeps
  its Run button. Only S10's demo (scikit-learn) shows the notice, and the notice shows the
  expected output so the learner can compare. *Superseded for S10 and S11 by the off-topic demos
  decision below:* the demos live in the `demos` map of `src/components/course/SectionView.tsx`,
  keyed by section id, and S10's is a scikit-learn model only because it is a leftover of the
  pre-V3 section that slug used to name. Once it is an on-topic standard-library demo, nothing
  needs the notice; the SIM-11 guard stays for any future demo that imports a pinned package.

A fourth question, the same day, answered as recommended:
- **Off-topic playground demos are replaced now, phase by phase.** The «Pruébalo tú mismo» demos
  of S10 to S52 follow the pre-V3 topic of their slug, not the V3 section (S10 runs scikit-learn,
  S14 «NumPy» demos hashing, S15 «Pandas» demos functools); S01 to S09 already match. Codex writes
  an on-topic, standard-library demo per section, using only what that section and earlier ones
  teach, so it runs in the browser and its printed output is pinned. S10 and S11 go first, then
  one phase at a time; a guard checks every demo against its section, and the owner sees the
  diffs. This replaces existing learner content, which is why it was asked.
- **34 exercise-meaning changes accepted as history** (no preference; recommendation taken). The S01
  to S03 exercise ids whose meaning changed since 35d19637 go into the exercise-meaning ledger as
  historical rows decided by this entry. Every later change needs its own ledger row.
- **The 12 S03 closures do not count** (answered). They were closed against s03-data-structures.ts,
  which a later commit replaced. Nothing is awarded retroactively: S03's next round re-checks the 12
  against the current file.

Asked the same day, all four answered as recommended:
- **Delete `progress.createAccountDesc`.** It is rendered nowhere and promises anti-plagiarism exams
  the site does not run; removed from es-PE, es-ES and en (copy PR).
- **Rewrite the credential policy's «Política de IA».** It promises a declaration and an oral defense
  the server records neither of; Codex rewrites it to the current rule, and the owner sees the
  diff before merge (copy PR).
- **`agentic-architecture` goes into the rename map.** S40's pre-V3 slug maps to
  `architecture-ddd-decisions` in `SECTION_ID_RENAMES`, with its database migration, so old
  progress and links keep working (number-guards PR).
- **The skill-term lexicon is checked by Codex.** Codex reviews each term in
  `src/lib/eligibility/skill_node_terms.json` against the lessons and proposes changes; the owner
  sees the final list in the PR diff before the ratchet becomes final (badge-manifest PR).

A third batch, the same day, all four answered as recommended:
- **The Python complexity gate goes into "Done means these pass".** One line under the TypeScript
  gate in `AGENTS.md` and `CLAUDE.md` (b10 PR).
- **Delete `auth.demoDesc` too.** Rendered nowhere; promises «rendir exámenes» (copy PR).
- **Badge-claim debt held as a ratchet.** 92 (badge, skill) pairs over 21 badges, measured on
  section titles and outcomes as the module documents, plus 5 prerequisite inversions, are owed
  exactly; nothing may grow, and the Phase 1 re-key pays them down (badge-manifest PR).
- **Rebound and removed exercise ids are ledgered.** The renumber tool writes a `renumbered` row
  (old id -> new id, same fingerprint) for each rebound id; a removed id needs a `removed` row
  naming the owner's decision. The renumber PR is not exempt (history-guards PR).

**Retire when:** all thirteen changes have landed, every playground demo matches its section, and S03's round has re-checked the 12 findings.

## 2026-10-14 — test doubles, decided case by case

`AGENTS.md` keeps no stub, stand-in or fake without the owner's decision. Codex's P1 on #100 found
two in one test file, and #87 holds a third. The owner decided each double on its own, because the
right answer depends on what the double replaces.

### O26 — Three test doubles: one kept, one replaced, one kept until it can go
**Scope:** `tests/adversarial/test_fixer_tool_boundaries.py` (the fixer-state PR, 0b-6) and
`tests/adversarial/credential-blockers.test.ts` (#87). **Status:** live.

Answered 2026-10-14:
- **(a) The fake `tools/fixer/run_codex.py` stays.** It stands in for the external, paid Codex model.
  It leaves a marker file and exits 1, so it hides everything the model would write; the test proves
  only that a brief which cannot be written stops the run before any model call, and that a sound
  brief reaches the call. That is the whole claim, and a real model call cannot make it.
- **(b) The fake `tools/fixer/gate.py` is replaced by the real gate.** The fake was one line,
  `raise SystemExit(0)`. It hid three things: the gate rewrites `.fixer/events.json` and
  `course-state/concept_map.json`, which are the files the brief is built from, so the test's own
  hand-written concept map would never survive a real run; the bare sections of the numbering
  fixture (an id, an index, a title) stop the event extractor, so the temporary course was never one
  the gate could measure; and the gate needs `node_modules`, the audit scripts, the glossary, a
  badge catalog, a capstone index and a Python 3.12 at `.venv-content/bin/python`. The test now
  builds all of that in its temporary course and runs `gate.py snapshot` for real, which takes
  tens of seconds a run. The real `gate.py check` (through `test:adversarial:py`) and CI's
  adversarial-unit job (through `test:adversarial`) now spend about 47 seconds more on these
  real-gate tests: the six runner tests took a median of 47 s over three runs on this machine
  (37 s to 75 s), against about 2 s under the stand-in. Two things it does not cover, by design:
  `gate.py check` (tsc, `test:v3`, both
  suites, the snippet audit) never runs, because the Codex stand-in stops the run first; and the
  pinned packages of `requirements-content.txt` are not installed in the temporary course, which
  imports none (the pins are held by `test:python-content`).
- **(c) The fake verifiers in `credential-blockers.test.ts` stay.** They stand in for server
  verifiers that do not exist yet: self-check, You Do, integrator project, defense and prerequisite
  badges. They hide that production verifies exams only, so the state where the gate opens (K3)
  exists nowhere but in this test.

Each test file that keeps a double points here from its docstring.

**Retire when:** (b) is done once the real-gate test is on main. (a) is never retired while Codex is
an external model; it is not a debt. (c) retires, and its fakes go, when a real server verifier
exists for each of the five requirements.

---

## 2026-10-16 — the merge decisions for PRs #100 to #106

### O27 — Sixty-six merge decisions for PRs #100 to #106
**Scope:** PRs #100 to #106 and the follow-up PRs they name. **Status:** live.

Asked 2026-10-16 on a decision page that listed every stand-in and open question in the seven PRs, each with what it replaces, what it hides, the real alternative and a recommendation. The owner answered all 66 on 2026-10-16; 57 follow the recommendation and 9 do not, and each line below gives the decision as chosen, so that a later round can cite it by id. Three of those answers are not yet approvals, because each one waits on an input from the owner, and they are marked **Pending** below: until that input is recorded here, no round may treat them as decided. A stand-in that is kept here is kept by this decision, which is what AGENTS.md asks before a double may stay (and O26, that is the owner's case-by-case ruling on test doubles, is the precedent).

Two answers needed reconciling. 105-Q3 took the recommendation to say that some projects ask for an oral defense, while the owner's note on 105-S6 says that no oral defense is required and none is in the plan; the course agrees with the note, because no section asks for an oral defense and S52's defense is the written `defense_notes` artifact. So #105 states that no project requires an oral defense. Whether the catalog's capstone `defense` component («oral or written») changes is a separate claim question, still open.

Three answers wait on the owner: 105-Q2 (the owner states the rule on AI-tool use, then Codex writes it as one sentence), 104-S1 (the owner checks page 45 of the NIST PDF before the rebuilt case is accepted) and 106-Q7 (the owner reads the four replaced demos before approving). None of the three counts as approved until the owner's input is recorded in this entry.

**#100, fixer state (0b-6)**
- **100-Q1** Is a pass-through wrapper around the real Python a test double? It would prove which Python the gate test ran. — **Decision:** Allow the wrapper as a recorder around a real call, add it, and prove it red with the python3 mutation.
- **100-S1** A preflight test switches off three of preflight's six checks, so those three never run in any test. — **Decision:** Run all six checks for real by pointing the two fixed paths into the temporary course.
- **100-S2** A gate test swaps the gate's command runner for a fake, so the strict-output audit never runs in it. — **Decision:** Replace the fake with the real strict audit on a gate-ready temporary course.

**#101, history guards (0b-1)**
- **101-Q1** Should the owner-decision lookup read OWNER_DECISIONS.md at the PR's base commit (as now) or at its head? — **Decision:** Confirm base.
- **101-Q2** Should OWNER_DECISIONS.md get a CODEOWNERS line and an AGENTS.md ask-first line now that a guard trusts it? — **Decision:** Add both lines, and let the ask-first line allow recording an answer you just gave.
- **101-Q3** Should removed rows already on main be checked against the decision record again on every later PR? — **Decision:** Look up the decision only for appended rows.
- **101-Q4** Confirm that a retired decision keeps its `### O<n>` heading when it moves to the Archive. — **Decision:** Confirm the heading stays, and add that sentence to the header of OWNER_DECISIONS.md.
- **101-Q5** Accept that `--check` never checks a removed row's owner decision, and fix the text that says it does? — **Decision:** Accept the limit, and correct the header and the report.
- **101-Q6** Accept that two anchors were re-baselined with no ledger row (S18-T2-B-E3, S10-T4-B-E3)? — **Decision:** Accept: the anchors become main's baseline when this PR merges.
- **101-S1** Keep the tests' fixed set of recorded decisions {O25}, or load the real record in the rule tests? — **Decision:** Keep RECORDED as test input, and correct 'nine' to 'six' in the report.
- **101-S2** Run the 816-row renumber test on the real anchors as well as on made-up ones, before the renumber tool exists? — **Decision:** Keep the made-up test, add the same case on the real anchors now, and switch to the tool's real rows in PR-1.
- **101-S3** Accept the script's header as the renumbered-row format that PR-1's renumber tool must write? — **Decision:** Accept it as the format of record: PR-1's tool must write it, or change it here along with its tests.
- **101-S4** Keep the small fixture course and throwaway git repositories in the CLI, sentinel and history-guard tests? — **Decision:** Keep them as unit fixtures.

**#102, badge manifest (0b-4)**
- **102-Q1** Tie the two other copies of the credential floors to the catalog, or leave them unchecked? — **Decision:** Add a test now that the types.ts copy and the Python reference copy equal the catalog floors.
- **102-Q2** Approve the final skill-term lexicon, and decide whether to strike five weak terms Codex added. — **Decision:** Strike (b) and (c), keep (a), (d) and (e), and approve the rest.
- **102-Q3** Confirm that the five catalog stamps and tallies stay out of the digest, generated_at included. — **Decision:** Confirm that all five stay out.
- **102-Q4** Confirm DIGEST_SCHEMA 6, not the schema 5 your r4 answer named. — **Decision:** Confirm schema 6.
- **102-Q5** Add learning outcomes for skills taught only in lesson bodies now, or wait for G-16? — **Decision:** Wait for G-16 and keep the limit documented as it is.
- **102-S1** The guard that checks no app code reads a left-out field is a text pattern, not a TypeScript parser. — **Decision:** Use the TypeScript compiler API for the guard, keep the 13 cases, and add the two missed spellings as cases.
- **102-S2** The floor test skips progress badges by family name and pins the number of scored badges at 26. — **Decision:** Keep the family exemption and add the check that progress badges state 0.
- **102-S3** 18 hand-judged FALSE_HOMES pins stand in for checking what a matched word means in each section. — **Decision:** Keep the 18 pins, read them in the PR diff, and strike any you disagree with.
- **102-S4** The badge-level allow-list NOT_DIGESTED is empty, and two tests fill it with a pretend entry. — **Decision:** Keep the empty list and the two mocked tests.
- **102-S5** Several tests run on temporary copies and short code snippets instead of the real source tree. — **Decision:** Keep the fixtures.

**#103, number guards (0b-8)**
- **103-Q1** Two protected browser test files still hard-code 52 sections, 13 per level and 13 capstones. — **Decision:** Compute the counts in a small follow-up PR that lands before the renumber.
- **103-Q2** Should the in-browser Python (Pyodide 0.26.2) be upgraded, as the SIM-11 decision planned? — **Decision:** Upgrade, in its own PR, to the newest release that still runs Python 3.12. *(Not the recommendation.)*
- **103-Q3** Keep or drop the data-to-viz move from S09 to S19, which you did not name? — **Decision:** Keep the move, and record your resource-tag rulings in OWNER_DECISIONS.md.
- **103-Q4** S08 and S09 now show no catalogue cards. Should Codex write cards for what they teach? — **Decision:** Codex writes catalogue cards for S08 and S09 now. *(Not the recommendation.)*
- **103-Q5** About 53 more tags put catalogue cards on sections with another topic. Fix them in their own PR? — **Decision:** Yes: a per-card pass in its own PR, with the tag test extended.
- **103-S1** Fake demos prove how a playground block renders, instead of the course's real demos. — **Decision:** Keep the fake demos here. The O25 demo-replacement PR adds a browser test that runs each real demo and compares its output.
- **103-S2** A text scanner, not Python's own parser, decides whether a demo really uses a pinned library. — **Decision:** Replace the scanner with Python's parser in a small follow-up PR, and keep the scanner until then.
- **103-S3** A count of how often a section names a topic stands in for judging that the section teaches it. — **Decision:** Keep the counts as a guard. In a follow-up, count only the lesson text and set seaborn's floor from that text.
- **103-S4** Python's built-in SQLite runs the migrations in the test, instead of Prisma's own migration tool. — **Decision:** Add a Prisma run next to the SQLite test: apply the migrations with Prisma onto seeded rows and check that the rows moved.
- **103-S5** Fake course trees stand in for a renumbered course that does not exist yet. — **Decision:** Run a trial renumber on a scratch branch before this PR merges. *(Not the recommendation.)*

**#104, Python complexity gate (B10)**
- **104-Q1** Should about 242 TypeScript keys and 6 Python keys that differ only by order keep their numbers? — **Decision:** Accept numbering as the floor.
- **104-Q2** Should the new per-form guards fail CI when a pull request adds a function form that the tests do not cover yet? — **Decision:** Keep the guards blocking.
- **104-Q3** A baselined key holds the test title 'S01-S52 ...'. If the 52-to-55 renumber edits that title, the gate fails. — **Decision:** Approve now: the renumber PR renames this one key, with the score unchanged at 24, as a reviewed one-line baseline diff. It also drops the section range from the title, so a later count change cannot break it again.
- **104-S1** The NIST Figure 4-4 test case was rebuilt from garbled PDF text. I compared it with the page image today, and it matches. — **Decision:** Look at PDF page 45 yourself before you accept it. *(Not the recommendation.)* **Pending:** the owner has not yet read page 45, so the rebuilt case is not accepted.
- **104-S2** The TypeScript gate gets ESLint's complexity rule through an import that ESLint calls unsupported. — **Decision:** Accept the import, as typescript-eslint does. It fails closed, and ESLint 10 still ships it.
- **104-S3** The per-form key tests run on small made-up files, not on the repository's own files. — **Decision:** Add a real-file check for each form, next to the made-up cases. *(Not the recommendation.)*
- **104-S4** Twenty scope exclusions keep code out of both gates, and no owner decision document records the ruling that kept them. — **Decision:** Record your r1 answer as an owner decision: the 20 exclusions stand, and the five 'work left undone' files are named as debt with a retire-when.

**#105, credential and plan copy**
- **105-Q1** The r6 commits name Sonnet 5.5 as co-author, but the workflow brief asked for Opus 5.5. — **Decision:** Keep the trailers as they are.
- **105-Q2** The Política de IA never says whether a learner may use AI tools. — **Decision:** The owner states the rule, Codex writes one sentence, and it goes in this PR while version 2.1 is unpublished. **Pending:** the owner has not yet stated the rule, so no sentence is written.
- **105-Q3** Should the policy say that the course asks for an oral defense that PyArcana neither hears nor records? — **Decision (reconciled):** superseded by the owner's note on 105-S6, so the policy says that no project requires an oral defense and never says that a project asks for one. The answer first given, «some projects ask for an oral defense», followed a recommendation that rested on a false premise, and it is withdrawn.
- **105-Q4** One class B badge states its public claim in English and describes different evidence from the others. — **Decision:** Separate PR that also aligns its evidence with the other class B claims. *(Not the recommendation.)*
- **105-Q5** On pyarcana.dev, /verify shows a red «No válida» card for any identifier. — **Decision:** Separate small PR now, with a test, so it can merge without waiting for #105.
- **105-Q6** The exam card is still titled «Examen de sección con anti-plagio», although O24 puts that copy in this PR. — **Decision:** Codex rewrites both keys in this PR before merge, as O24 says.
- **105-Q7** Both rewritten legal pages say they took effect on 2026-10-13, but neither is live yet. — **Decision:** Set both dates to the merge day in the last commit before merge.
- **105-S1** No committed test proves that a changed credential record fails the check. Only a deleted scratch run did. — **Decision:** Follow-up PR: a shared signing function, a temporary SQLite database, and one case per changed field that must get 403.
- **105-S2** The 'not deployed' checks read config files and code the static build deletes, plus one live request. — **Decision:** Add a weekly live check of pyarcana.dev, and change the 503 case to check that the static build removes the API folder.
- **105-S3** The policy-text checks read the page's source file, not the page a reader sees. — **Decision:** Reuse renderPage() for the policy and notice sentences in this PR.
- **105-S4** A hand-written text pattern stands in for 'no page asks for an AI declaration', and it skips three files learners read. — **Decision:** Also run one paid Codex review of the whole course for such requests (a one-time check). *(Not the recommendation.)*
- **105-S5** Three hand-mapped facts stand in for comparing a policy sentence with what the badge catalog claims. — **Decision:** Pin the section's full sentence list and keep CLAIMED_FACTS.
- **105-S6** Two text patterns stand in for 'a page asks for a defense' and 'no page asks', and both misfire. — **Decision:** As given in the owner's note. *(Not the recommendation.)* Owner's note: «we do not require and oral defense it is not in the plan.»

**#106, playground demos infrastructure**
- **106-Q1** S19's demo crashes for learners because of a one-character typo; fix it now or wait for its O25 phase? — **Decision:** Fix the typo in this PR, and empty the three owed lists.
- **106-Q2** O25 still says the demos live in SectionView.tsx; may the agent add a one-line pointer to their new file? — **Decision:** Let the agent add the one-line pointer in this PR.
- **106-Q3** Accept a 3.7 MB download on S08 and S14 so that S14's password-hashing demo works in the browser? — **Decision:** As given in the owner's note. *(Not the recommendation.)* Owner's note: «can you implement a way to the user to trigger the download as an optioal demo and give a throbber or progress bar for the download to show the user the 3.7MB download and that way it is an action by the user not default slowdown for everyone. plan and strategize and research and design and architect and implement and validate and test.»
- **106-Q4** Confirm that hashlib and decimal stay off the list of modules Pyodide leaves out, unlike the brief said. — **Decision:** Confirm the departure.
- **106-Q5** Approve the new Pyodide gate in CI's adversarial job on every run, with its downloads from the CDN? — **Decision:** Run it on every CI run, as now, and add a package cache when numpy or pandas demos arrive.
- **106-Q6** Should the Pyodide gate also run the 8 demos that pin no output, and fail if one crashes? — **Decision:** Run them and fail on an exception, with an owed list for any that crash today.
- **106-Q7** Confirm the files this PR changes in your review-owned paths are within the approval you gave for O25. — **Decision:** Approve after reading the four replaced demos. **Pending:** the owner has not yet read them, so the approval is not given.
- **106-Q8** Should AGENTS.md's 'Done means' list name the Pyodide gate, and will you run bun install after merge? — **Decision:** Add a note to the existing line saying it includes the Pyodide gate and needs bun install, and run bun install after merge.
- **106-Q9** CodePlayground's complexity is 20, over the ceiling of 15; which PR brings it under? — **Decision:** A separate chore(lint) PR after this one merges.
- **106-S1** A fake Pyodide in the exit-3 test hides that a real failed download is reported as broken demos. — **Decision:** Fix the gate, and replace the fake with a real Pyodide that has one unreachable package entry.
- **106-S2** The CPython demo audit's main() tests use stand-ins for the demo list, the owed list and the interpreter check. — **Decision:** Accept the stand-ins, and point the test file's docstring at your decision.
- **106-S3** The Pyodide gate runs Pyodide inside Node, not in the learner's browser page. — **Decision:** Keep the Node gate, and add a small Playwright check that runs a few demos on the real page.
- **106-S4** The prelude tests use a copied pandas warning, not the warning real pandas prints in Pyodide. — **Decision:** Make the Pyodide test import the real pandas, and keep the copied text in the CPython test.

**Retire when:** every item above is done or superseded by a later decision; each follow-up PR names the ids it closes.

## Archive

*(empty — nothing retired yet)*
