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

---

## Archive

*(empty — nothing retired yet)*
