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

**Still open, asked before the renumber PR:** 4 (defer 2SLS and do-calculus), 9 (which roadmap is
authoritative), 10 (homonym list), 11 (one learner notice; the certificado threshold becomes 55/55,
which touches the progress document's legal constraints), 13 (amending `AGENTS.md` and
`course_requirements.json`), 15 (parallel work).

**Retire when:** every item has landed or been superseded by a later decision.

---

## Archive

*(empty — nothing retired yet)*
