# Open questions the fixer campaign cannot decide on its own

## Q1 — Six badges require prerequisites taught after the badge's own sections
*Raised 2026-09-11 by `scripts/badge_readiness_audit.py`. Row 6 RESOLVED 2026-09-16.
Rows 1–5 still open, and the reason they cannot be closed the obvious way is below.*

**Reading 2 is settled: it is a bug, not a design.** `src/lib/eligibility/engine.ts` Gate 2
returns `STATE_LOCKED` when any `prerequisite_badges` entry is not already `STATE_AWARDED`,
before the capstone's own work is looked at, and no retroactive or out-of-order award path
exists anywhere in the engine (`awardIdempotent` just calls `evaluate`). A capstone in this
state is not "awarded late" - it is permanently unreachable, including after the learner
finishes the whole course. So `required_sections` is a hard gate, and the audit's assumption
was right.

**Row 6 is fixed.** `progress_phase3_walked` required S40–S52, one past the capstone it gates.
Its three sibling progress badges each stop exactly at their phase's capstone (S01–S13,
S14–S26, S27–S39); `src/lib/capstones/catalog.ts` gives level 4 the gates S43/S47/S51 and marks
CP-FINAL `isFinal` with gate S52; `course-state/capstones/INDEX.json` agrees; and
`evidence_grounded_ai_systems_capstone` (CP-FINAL's credential, `required_sections: ["S52"]`)
already lists this badge as *its own* prerequisite, which is the correct direction. S52 and its
two activities are gone from the badge. Badge failures went 6 → 5, and nothing was un-assessed:
the badge's `required_projects` was already `CP-N4-A/B/C`, never CP-FINAL.

**Rows 1–5 need a bigger fix than narrowing a range, and here is why.** The four competency
badges involved do not merely reach past the capstone that gates them - several of their
`required_sections` do not name the sections that teach the claimed skill at all, in the
current curriculum:

| Badge | Requires | What is actually taught there | Where the skill really lives |
|---|---|---|---|
| `applied_sql_query_development` | S19, S37 | Visualization; profiling and performance | S12 (intro SQL) and S29 (advanced SQL) |
| `applied_mlops_pipeline_delivery` | S29, S43 | Advanced SQL; containers | S47 |
| `reliable_automation_development` | S13, S24 | Phase-0 capstone; OCR | S23 (Playwright) |
| `independent_data_preparation` | S06, S07, S08, S18 | Collections; text/regex; files; EDA | S14–S17 for real pandas/NumPy cleaning |
| `applied_analytical_reasoning` | S09, S10 | Exceptions; modules and packaging | its own description is charts/BI/ML |

This is the same drift that renamed the section files: `required_sections` was authored against
the abandoned pre-V3 section-to-topic mapping, and it never looked wrong because it stores bare
numbers rather than slugs. Deleting whichever tag is numerically too high would silence
`badge_readiness_audit.py` while leaving the remaining tag pointing at a section that does not
teach the skill either - a cosmetic fix, and a worse state than an honest failure.

Repointing each badge at the section that does teach the skill is also not a local fix: for SQL
and MLOps the real content (S29, S47) is *later* than the capstone needing it, so an accurate
`required_sections` would make the forward reference worse, not better. That is a curriculum
question - whether these capstones need the full skill or an earlier primer of it, per the
standing policy - not a catalog edit.

**Proposed next step, not taken here:** audit `required_sections` across all 31 badges against
what each section currently teaches, the same way the 52 section ids were audited. Only then can
each of rows 1–5 get a real answer (drop the prerequisite, repoint it, or move the capstone).
Doing them one at a time against data known to be unreliable would be guessing.

*Original text below for the record.*

Each phase capstone credential requires a competency badge whose section range
extends past the capstone's own range, so the capstone is not earnable when its
sections end:

| Badge | Covers | Requires | Which covers |
|---|---|---|---|
| `applied_analytical_reasoning` | S09–S10 | `independent_data_preparation` | S06–S18 |
| `integrated_python_ai_capstone_foundations` | S01–S13 | `independent_data_preparation` | S06–S18 |
| `integrated_python_ai_capstone_foundations` | S01–S13 | `reliable_automation_development` | S13–S24 |
| `integrated_python_ai_capstone_independent` | S14–S26 | `applied_sql_query_development` | S19–S37 |
| `integrated_python_ai_capstone_advanced_applied` | S27–S39 | `applied_mlops_pipeline_delivery` | S29–S43 |
| `integrated_python_ai_capstone_integrated_mastery` | S40–S51 | `progress_phase3_walked` | S40–S52 |

Two readings, and they need a human:

1. **Bug.** The capstone is meant to close its phase. Then either the prerequisite
   should be dropped, or its `required_sections` narrowed to what the capstone
   actually assesses.
2. **Intentional.** The capstone is awarded retrospectively, after the learner has
   gone well past the phase. Then `required_sections` is an assessment scope, not a
   gate, and the audit's assumption is what is wrong.

The last row is hard to read as intentional: a credential for S40–S51 that requires
finishing S52.

This changes what a credential means, so the campaign will not touch
`src/lib/eligibility/badge_catalog.json` without a decision.

## Q2 — Which deployed build does the course correspond to?
*Raised in the S01 audit as S01-U01; codex declined to answer. Unresolved.*

The canonical source cannot show that the deployed, hydrated page matches it. This
needs evidence from the live product — a SHA or content manifest tied to the
deployment — which nothing in the repository can supply.

## Q3 — S02's practice layer depends on S05–S09
*Raised 2026-09-11 by codex during the S02 round, closing S02-F01..F04, F09 in theory only.
Investigated 2026-09-16: the tooling half is fixed, the curriculum decision is still open and
is re-raised below with what the investigation found.*

**The gate could not see seven of the eight concepts, which is why the theory pass closed
clean.** `src/lib/glossary/terms.ts` had no entry for `function`, `parameter`, `return`,
`exception`, `annotation`, `if`, `for` or `unpacking`. The glossary was an index of tooling and
libraries — git, pip, venv, groupby, StandardScaler — not of the Python language, so the
define-before-use gate was structurally blind to every construct a beginner is actually
surprised by, and would have kept reporting green whichever route was chosen. **Fixed**: the
eight terms are in, and the concept-map detector that reads them was repaired at the same time
(it credited weDo hints and quiz distractors as definitions and could not see a verb-first
Spanish definition). This does not decide Q3; it makes Q3 measurable.

**Corrections to the original text.** `tuple` is no longer a leak — S02 teaches it in place
("Una **tupla** reúne varios valores en un orden fijo"), and the reason it looked untaught was
the detector, not the section. The concept order is also more precise than "S05–S09": `if` is
S03 and `for` is S04, *before* functions at S05; dicts/tuples/unpacking are S06; exceptions are
S09. So parts of S02's practice layer outrun theory by one section and parts by seven.

**What the practice layer actually requires.** All eight iDo demos and the whole youDo use
`def`; 11 of 24 weDo exercises do. The youDo starter also uses `int | None` and
`from __future__ import annotations` — newer typing than S05 itself teaches, which uses
`Optional[str]`. So the capstone starter is not merely ahead of S02, it is ahead of S05.

**It cannot be fixed in S02 alone.** S02→S03→S04's youDos are one cumulative project
(CP-N1-A), and S03's weDo contains 44 `def` uses against a theory section that never teaches
`def`, while S04's youDo starter uses `dict[str, Any]` two sections before dicts are taught.
Whatever is decided for S02 applies to S03 and S04's slices of the same project.

**Recommendation, for a human to accept or reject:** route 2, move the parser/intake project to
where its prerequisites exist, because the code already assumes S05/S06/S09 knowledge — moving
it is re-sequencing, whereas route 1 is a rewrite that would have to drop the multi-field record
the project is built around (no dict), and route 3 was correctly rejected as tripling S02.
The cost route 2 hides: S02–S04 then need a genuinely new, concept-clean practice layer, which
is new content, not moved content. That is the trade-off to weigh, and it is why this is
re-raised rather than closed.

*Original text below for the record.*

The S02 theory no longer leaks future syntax. The practice layer still does: `iDo`,
`weDo` and `youDo` require functions, parameters, `return`, `if`/`for`, dictionaries,
tuples, unpacking, annotations and exceptions — all taught in S05–S09. Deleting the
word `tuple` from prose does not remove the dependency, so the P1 findings cannot be
fully closed at section level without deciding what the practice layer is for.

Codex offered three routes and declined to pick:

1. **Rewrite the practice layer** as S02-level work — concrete values and top-level
   statements only.
2. **Move the parser project to S05–S09**, after its prerequisites are taught.
3. **Teach the prerequisites in S02** — which contradicts the findings that prompted
   the repair, and would make S02 enormous.

This is a curriculum-architecture decision, not a content fix. Every section from S02
onward whose practice outruns its theory will hit the same question, so the answer
should be a policy, not a one-off.

## Q4 — A test pins a demo that an audit finding deliberately removed
*Raised 2026-09-14 during the S01–S08 redaction pass. RESOLVED 2026-09-15: route 1 taken,
per human decision to lean delete+replace.*

**Resolution:** deleted `test_rendered_check_arg_demo_preserves_the_typed_entrypoint` from
`tests/adversarial/test_s01_independent_recovery.py`. Added
`test_capstone_starter_preserves_the_typed_entrypoint` to
`tests/adversarial/test_s04_independent_contract.py`, pinning `def main() -> None:` and the
`if __name__ == "__main__":` guard in S04's own "Client Intake & Data Quality Script" capstone
- real course content already using that exact convention, at the first section where a learner
can read `def`. No content was invented for the new test. Both test files still pass in full.

*Original text kept below for the record.*

`tests/adversarial/test_s01_independent_recovery.py::test_rendered_check_arg_demo_preserves_the_typed_entrypoint`
asserts S01 contains a `check_arg.py — argv, len y exit codes` demo with
`def main() -> None:` and `print("executable:", sys.executable)`.

Finding **S01-F06** removed that demo, and the reasoning holds: it introduced `import`,
`def`, indentation, variables, method calls, indexing, f-strings and `if __name__` in
order to demonstrate exit codes — every one of them before the section that teaches it.
S01 now demonstrates exit codes with two shell commands.

So the test and the finding disagree, and both have a point. The demo was a
future-knowledge leak; the *typed entrypoint* convention it guarded is still worth
enforcing — just not in S01, where a learner cannot yet read `def main() -> None:`.

The campaign will not delete a test on its own judgement. Skipped with this reasoning
attached, pending a decision:

1. **Delete it** — the requirement moves to S05, which teaches functions, and a new test
   guards it there.
2. **Restore a typed entrypoint to S01** — reopens S01-F06.
3. **Keep it skipped** — honest, but a skipped test guards nothing.

## Q5 — S41's Spanish pass fails a different gate on every attempt
*Raised 2026-09-15 during the S41 spanish rerun. Two automated attempts, two different
failures, both auto-rolled-back cleanly.*

`tools/fixer/run_spanish.sh S41` was run twice against `src/lib/course/sections/s41-llm-finetuning.ts`:

1. **Attempt 1** (`S01r`-style codex run, applied 67/rejected 2): passed `test:v3` and the
   Python adversarial suite, but failed `tests/adversarial/narrow-viewport-shrink.test.mjs`.
   Confirmed this is not a flake — the same test passes cleanly on current HEAD (3/3,
   `node --test`). The translated Spanish text pushed a heading past what the
   folded-block/badge layout can shrink to.
2. **Attempt 2** (applied 69/rejected 2): passed every other gate, including the node
   adversarial suite this time, but `b5_nominal_constructions_per_100_sentences` regressed
   0.2 → 0.4 — codex removed the flagged English words by leaning on nominalizations
   (`-ción`/`-miento` constructions) instead of verbs, trading one prose-quality gate for
   another.

Both attempts were restored automatically by the gate-failure path in `run_spanish.sh`; the
section file is untouched (matches HEAD). Not re-running a third blind attempt — two
different failure modes from two attempts is a signal the fix needs a shorter or
differently-phrased replacement for whichever English term is driving both the heading
length and the nominalization count, not another unguided codex pass. Needs a human (or a
more targeted prompt) to pick the replacement wording by hand:

1. **Fix by hand** — find the specific anglicism(s) driving this, pick a short verb-based
   Spanish replacement that also fits the badge-heading width, apply directly.
2. **Retry with a narrower prompt** — constrain `build_spanish_prompt.py`'s S41 prompt to
   forbid nominalizations and cap replacement length, then re-run.
3. **Leave S41's flagged English as-is** — accept the `avoidable_english_per_1000: 10.9`
   baseline for this section rather than risk another regression.

## S39 spanish — 1 patch(es) not applied
*Recorded 2026-09-15 by `record_rejections.py` from `S39s.apply.json`.*

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **integrator-phase2.S39-T4-B-E2.preamble** at `weDo.steps[S39-T4-B-E2].preamble` — anchor not found
  - anchor began: `- **Contexto:** en la cola de onboarding, override_rate y tiempo de review cuentan más par`

## S27 spanish — 14 patch(es) not applied
*Recorded 2026-09-15 by `record_rejections.py` from `S27s.apply.json`.*

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **S27-ES-001** at `tagline` — anchor not found
  - anchor began: `normalización y matching en contratos ejecutables`
- **S27-ES-003** at `learningOutcomes[3].text` — anchor not found
  - anchor began: `Aislar estado mutable con fixtures function-scope, factories y deepcopy`
- **S27-ES-005** at `theory[2].paragraphs[0]` — anchor not found
  - anchor began: `Un bug en matching de entidades justifica más tests que un typo de log`
- **S27-ES-006** at `theory[2].callout.content` — anchor not found
  - anchor began: `Si el tiempo es finito, cubre primero normalize/match; luego DB; al final UI. Escribe el r`
- **S27-ES-007** at `theory[5].paragraphs[0]` — anchor not found
  - anchor began: `Las **fixtures** inyectan dependencias (datos sintéticos, `tmp_path`, relojes fijos) **sin`
- **S27-ES-008** at `theory[5].paragraphs[1]` — anchor not found
  - anchor began: `Scopes: `function` (default), `class`, `module`, `session`. Un fixture session mutado cont`
- **S27-ES-009** at `theory[5].callout.content` — anchor not found
  - anchor began: `Si mutas un fixture session-scope, el siguiente test ve basura. Prefiere function + factor`
- **S27-ES-010** at `weDo.steps[S27-T2-B-E2].preamble` — anchor not found
  - anchor began: `- **Contexto:** pytest permite function/class/module/session; solo algunos son seguros si `
- **S27-ES-011** at `weDo.steps[S27-T2-B-E2].instruction` — anchor not found
  - anchor began: `1. El starter hardcodea `chosen = 'session'`.\n2. Busca el scope con valor True (p. ej. `n`
- **S27-ES-012** at `theory[7].paragraphs[0]` — anchor not found
  - anchor began: `Los **casos negativos** prueban inputs inválidos: `None`, vacío, tipo incorrecto, encoding`
- **S27-ES-013** at `theory[7].paragraphs[2]` — anchor not found
  - anchor began: `Diseña una tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un hap`
- **S27-ES-014** at `theory[8].callout.content` — anchor not found
  - anchor began: `Si una rama de 'review' nunca se prueba, la cola de revisión se romperá en producción sin `
- **S27-ES-015** at `theory[9].paragraphs[1]` — anchor not found
  - anchor began: `Fallas **útiles** muestran input sintético, esperado vs. actual y el contrato violado. Evi`
- **S27-ES-016** at `theory[9].paragraphs[2]` — anchor not found
  - anchor began: `Política del ciclo: **bug_repro → regression_test** antes de cerrar el ticket.`

## S03 spanish — 5 patch(es) not applied
*Recorded 2026-09-15 by `record_rejections.py` from `S03s.apply.json`.*

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **data-structures.tagline, data-structures.outcome[0], data-structures.outcome[1], data-structures.outcome[6]** at `tagline, learningOutcomes` — anchor not found
  - anchor began: `  tagline: 'Booleanos, control de flujo y reglas accept/reject/review sin confundir ausenc`
- **data-structures.S03-T2-B-E2.instruction** at `weDo[S03-T2-B-E2].instruction` — anchor not found
  - anchor began: `          '1. Deja nested intacta.\n2. Implementa guards: None→review; no int→reject; `<0``
- **data-structures.S03-T3-A-E1.instruction** at `weDo[S03-T3-A-E1].instruction` — anchor not found
  - anchor began: `          '1. Corrige el DEFECT que manda todo lo no-allowlisted a reject (incluido None).`
- **data-structures.S03-T3-A-E1.hint, data-structures.S03-T3-A-E1.hint[0]** at `weDo[S03-T3-A-E1].hint, hints[0]` — anchor not found
  - anchor began: `        hint: 'if r is None / if r not in ALLOWED / return accept',
        hints: [
     `
- **data-structures.S03-T3-A-E2.instruction** at `weDo[S03-T3-A-E2].instruction` — anchor not found
  - anchor began: `          '1. Corrige `m <= 0` (rechaza el cero).\n2. Orden: None→review; `<0`→reject; `>5`

## Early uses the repaired concept map made visible — queued for the section rounds
*Recorded 2026-09-16 after adding the eight core-language glossary terms and fixing the
definition detector. Not blocking: `glossary_intro_audit.py` is not one of gate.py's absolute
gates. Two of the original four were fixed on the spot; these are the ones that need a section
round because they live in code or in another section's prose.*

- **`return` and `def` in S01's `section_contract()` demo.** `s01-setup.ts` contains a code
  block defining a function and returning a dict, in the section that teaches environment
  setup. Functions are S05. The same demo shape was already removed once from S01 by finding
  S01-F06 for exactly this reason, and this one survived because no gate could see `return`
  until the glossary gained the term. Decide with the two questions: the contract it prints may
  be expressible without `def`, or the demo may belong later.
- **`Excepción` in S02 prose.** Declared at S03 now (S03 glosses it to explain guard clauses),
  but `basics` mentions it earlier. Either gloss it at S02 as S03 does, or remove the mention.
- **`Distribución normal` declared S18, used in S16.** Pre-existing, unrelated to this round.

Fixed already, for the record: S01's "No necesitas una función ni una plantilla adicional" was a
throwaway reassurance about a concept the learner had never met and is gone; S03's "produce una
excepción" is load-bearing (it is why guard clauses exist) and now carries an in-place gloss plus
an explicit deferral to S09.

## S28 spanish — 3 patch(es) not applied
*Recorded 2026-09-16 by `record_rejections.py` from `S28s.apply.json`.*
<!-- S28 spanish d51b4c2e505e -->

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **S28-ES-014** at `weDo.steps[S28-T2-B-E2].hint+hints` — anchor not found
  - anchor began: `hint: "blocked si diff and not approved",\n        hints: [\n          "blocked si diff an`
- **S28-ES-016** at `weDo.steps[S28-T4-B-E2].hints+edgeCases` — anchor not found
  - anchor began: `hints: [\n          "fail_job si flake_rate > 0",\n          "Cuarentena documentada con t`
- **S28-ES-018** at `selfCheck.questions[1]` — anchor not found
  - anchor began: `question: "Actualizar un golden con drift sin revisión es:",\n        options: ["Buena prá`

## S39 spanish — 48 patch(es) not applied
*Recorded 2026-09-16 by `record_rejections.py` from `S39s.apply.json`.*
<!-- S39 spanish 5a3493d6c758 -->

Codex proposed these; 48 applied cleanly but the whole batch was rolled back when the file stopped typechecking, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

Typecheck error: `node:internal/modules/run_main:107`

- **integrator-phase2.outcome[4]** at `learningOutcomes[4].text` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B.callout** at `theory[S39-T1-B].callout.content` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A.callout** at `theory[S39-T3-A].callout.content` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B.p0** at `theory[S39-T4-B].paragraphs[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B.p0** at `theory[S39-T4-B].paragraphs[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B.p1** at `theory[S39-T4-B].paragraphs[1]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B.callout** at `theory[S39-T4-B].callout.content` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-A-DEMO.why** at `iDo.steps[S39-T1-A-DEMO].why` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-DEMO.why** at `iDo.steps[S39-T1-B-DEMO].why` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-DEMO.why** at `iDo.steps[S39-T1-B-DEMO].why` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-DEMO.retrospective** at `iDo.steps[S39-T1-B-DEMO].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-DEMO.why** at `iDo.steps[S39-T3-A-DEMO].why` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-DEMO.retrospective** at `iDo.steps[S39-T3-A-DEMO].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B-DEMO.preamble** at `iDo.steps[S39-T4-B-DEMO].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B-DEMO.why** at `iDo.steps[S39-T4-B-DEMO].why` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E1.preamble** at `weDo.steps[S39-T1-B-E1].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E1.hint, integrator-phase2.S39-T1-B-E1.hint[0]** at `weDo.steps[S39-T1-B-E1].hint` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E1.hint[0]** at `weDo.steps[S39-T1-B-E1].hints[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E1.retrospective** at `weDo.steps[S39-T1-B-E1].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E2.preamble** at `weDo.steps[S39-T1-B-E2].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E2.instruction** at `weDo.steps[S39-T1-B-E2].instruction` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E3.preamble** at `weDo.steps[S39-T1-B-E3].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E3.instruction** at `weDo.steps[S39-T1-B-E3].instruction` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E3.hint[1]** at `weDo.steps[S39-T1-B-E3].hints[1]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T1-B-E3.retrospective** at `weDo.steps[S39-T1-B-E3].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T2-A-E3.preamble** at `weDo.steps[S39-T2-A-E3].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T2-A-E3.instruction** at `weDo.steps[S39-T2-A-E3].instruction` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T2-A-E3.hint, integrator-phase2.S39-T2-A-E3.hint[0]** at `weDo.steps[S39-T2-A-E3].hint` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T2-A-E3.hint[0]** at `weDo.steps[S39-T2-A-E3].hints[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E1.preamble** at `weDo.steps[S39-T3-A-E1].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E1.hint, integrator-phase2.S39-T3-A-E1.hint[0]** at `weDo.steps[S39-T3-A-E1].hint` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E1.hint[0]** at `weDo.steps[S39-T3-A-E1].hints[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E1.retrospective** at `weDo.steps[S39-T3-A-E1].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E2.hint[1]** at `weDo.steps[S39-T3-A-E2].hints[1]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E3.preamble** at `weDo.steps[S39-T3-A-E3].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E3.hint, integrator-phase2.S39-T3-A-E3.hint[0]** at `weDo.steps[S39-T3-A-E3].hint` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-A-E3.hint[0]** at `weDo.steps[S39-T3-A-E3].hints[0]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T3-B-E3.retrospective** at `weDo.steps[S39-T3-B-E3].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-A-E2.preamble** at `weDo.steps[S39-T4-A-E2].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-A-E2.instruction** at `weDo.steps[S39-T4-A-E2].instruction` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B-E2.preamble** at `weDo.steps[S39-T4-B-E2].preamble` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B-E2.feedback** at `weDo.steps[S39-T4-B-E2].feedback` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.S39-T4-B-E2.retrospective** at `weDo.steps[S39-T4-B-E2].retrospective` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.youDo.objective[1]** at `youDo.objectives[1]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.selfCheck[0].explanation** at `selfCheck.questions[0].explanation` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.selfCheck[2].opt[2]** at `selfCheck.questions[2].options[2]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.selfCheck[4].opt[2]** at `selfCheck.questions[4].options[2]` — typecheck failed after apply; whole batch rolled back
- **integrator-phase2.selfCheck[4].explanation** at `selfCheck.questions[4].explanation` — typecheck failed after apply; whole batch rolled back

## S27 spanish — 2 patch(es) not applied
*Recorded 2026-09-16 by `record_rejections.py` from `S27s.apply.json`.*
<!-- S27 spanish 8f52e77f4088 -->

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **S27-ES-SPLIT-03** at `weDo.steps[S27-T1-B-E1].hint` — anchor matches 2 places
  - anchor began: `casefold + split/join`
- **S27-ES-NOT-02** at `weDo.steps[S27-T4-A-E2].hint` — anchor matches 3 places
  - anchor began: `'non' not in hit`

## S39 spanish — 12 patch(es) not applied
*Recorded 2026-09-16 by `record_rejections.py` from `S39s.apply.json`.*
<!-- S39 spanish 6bed5d161c32 -->

Codex proposed these and the applier refused them, so the defects they targeted are
still open. Re-run the stage for this section, or fix by hand.

- **S39-ES-owner-05** at `weDo.exercises[S39-T1-B-E1].preamble` — anchor not found
  - anchor began: `- **Contexto:** en `CASO-LIM-039-T1B` el `graph_schema` rompe paths ya guardados en packet`
- **S39-ES-owner-06** at `weDo.exercises[S39-T1-B-E1].instruction` — anchor not found
  - anchor began: `1. Localiza el DEFECTO: `bump == "minor"`.
2. Cambia a `bump == "major"` cuando `breaking``
- **S39-ES-owner-09** at `weDo.exercises[S39-T1-B-E2].preamble` — anchor not found
  - anchor began: `- **Contexto:** el ranker de `ml-risk` no puede ir a producción sin owner ni con bump inco`
- **S39-ES-owner-10** at `weDo.exercises[S39-T1-B-E2].instruction` — anchor not found
  - anchor began: `1. Calcula missing de claves requeridas.
2. Si owner vacío o ausente → `MISSING:owner`.
3.`
- **S39-ES-owner-11, S39-ES-owners-03** at `weDo.exercises[S39-T1-B-E3].preamble` — anchor not found
  - anchor began: `- **Contexto:** el triage de Lima no se libera «por partes»: basta un artefacto sin owner `
- **S39-ES-owner-12** at `weDo.exercises[S39-T1-B-E3].instruction` — anchor not found
  - anchor began: `1. Recorre todos los artefactos en `decide`.
2. Sin owner → `ESCALATE_NO_OWNER`; breaking `
- **S39-ES-only-01** at `weDo.exercises[S39-T2-A-E3].preamble` — anchor not found
  - anchor began: `- **Contexto:** la explicación usable (S35) solo tiene sentido con packet completo e incer`
- **S39-ES-only-02** at `weDo.exercises[S39-T2-A-E3].instruction` — anchor not found
  - anchor began: `1. Score-only (solo case_id+score) → REJECT_SCORE_ALONE.
2. Sin `uncertainty` → REQUEST_UN`
- **S39-ES-release-04, S39-ES-not-01** at `weDo.exercises[S39-T3-A-E1].preamble` — anchor not found
  - anchor began: `- **Contexto:** en el release de `CASO-LIM-039-T3A`, un secreto en el repo es blocker duro`
- **S39-ES-scope-01** at `weDo.exercises[S39-T4-A-E2].preamble` — anchor not found
  - anchor began: `- **Contexto:** documentas smoke S27–S39 y CF-3; un revisor externo confirma. Autodeclarar`
- **S39-ES-scope-02** at `weDo.exercises[S39-T4-A-E2].instruction` — anchor not found
  - anchor began: `1. Missing de claves primero.
2. Si self_declared_promotion True → REJECT_AUTO_PASS.
3. Va`
- **S39-ES-review-05** at `weDo.exercises[S39-T4-B-E2].preamble` — anchor not found
  - anchor began: `- **Contexto:** en la cola de onboarding, override_rate y tiempo de review cuentan más par`

## A glossary keyed on surface strings cannot separate homonyms
*Recorded 2026-09-16 while working the concept-map queue. Not blocking; one known instance.*

`Correlación` is a Data Science entry — *"Relación entre dos variables. -1 a 1. np.corrcoef,
df.corr()"* — and its 25 "surprising uses" are almost all S09's **identificador de correlación**,
a logging correlation ID, which has nothing to do with statistical correlation beyond the word.
Its `firstSectionId` is even `exceptions-logging`, so a previous round appears to have resolved
the forward reference by pointing the statistics concept at the logging section, which cannot be
right either.

Nothing in the concept map can distinguish these: terms are matched as surface strings, and two
unrelated ideas share one Spanish word. The same shape will recur (`cobertura` as test coverage
versus ordinary coverage; `función` as a Python function versus a purpose, which already cost a
false positive in S01).

Options, none taken here because each changes what the map means:
1. **Disambiguate by section range** — let a term declare where its meaning applies, so
   `Correlación` is only matched from the statistics sections onward.
2. **Split the entry** — add `identificador de correlación` as its own term, so the logging use
   is explained on its own terms and stops matching the statistics one.
3. **Accept and annotate** — leave the count wrong and note it, which is what is happening today
   by default and is the reason this is written down.

Confirmed instances so far, all found by checking before acting on a high score:
- **`Correlación`** — statistics entry; nearly all uses are S09's logging *identificador de
  correlación*.
- **`generator`** — the Python `yield` construct; eleven of its twelve uses are NumPy's
  `Generator`/`default_rng`, a PRNG, or an LLM *generador de narrativa*. One is real.
- **`función`** — the Python concept; "el trío cumple funciones distintas" means *purposes*.
  This one already produced a false positive in S01.

Until it is decided, treat a high surprising-use score as a question, not a finding, and read the
uses before writing a definition. Two of the first five concepts queued for a fix this way did
not need one.

---

## The homonym section, corrected by measurement (2026-09-17)

The course-wide diagnosis counted what the section above guessed at. Two of its three examples
were wrong in detail, and the list is longer than three:

- **`Correlación`** — not "nearly all". Seven logging uses (S09 ×4, S38, S51 ×2) against eighteen
  statistical ones (S18 ×14, S19, S35 ×3). With `firstSectionId` at S09 the hover showed the
  statistics definition on *identificador de correlación*; it now points at S18.
- **`función`** — not a homonym at all. There is no second technical concept: "cumple funciones
  distintas" is ordinary Spanish, and it is the only instance in the active course. Option 1
  (disambiguate by section range) could never have caught it. The real homonym cluster around
  this word is elsewhere: pytest's fixture scope `function` (S27, 34 occurrences), SQL window
  functions (S29) and LLM function calling (S25, S49).
- **`generator`** — confirmed, with the count corrected to ten of twelve: five PRNG, four
  LLM/RAG, one ordinary Spanish. Option 2 was taken: the `Generator`/`generador` aliases are gone
  and the entry keeps `yield`, `función generadora`, `expresión generadora`.

Others measured, with the treatment taken:
`ABC` (the placeholder string `"abc"`, 94 of 97 uses — fixed by case-sensitive acronym matching),
`coverage` (eight senses: regex full-match, master-table match, sample coverage, automation
coverage, field completeness, recall, conformal coverage, slice coverage — bare `cobertura`
dropped, qualified aliases only), `merge` (six: dict overlay, entity fusion, pandas join, Excel
merged cells, git merge, incremental upsert), `set` (the loanword in "feature set", "golden set",
"training set"), `reshape` (NumPy vs pandas long/wide — NumPy's is never called in the course),
`resample` (pandas frequency vs class rebalancing — the pandas one is never called either),
`apply` (five senses, none of them pandas `.apply(`), `NaN` (an invalid float in S09–S13 versus an
absent measurement in S14+), `parámetro` (Python parameter vs statistical parameter vs
hyperparameter), `path` (the `PATH` environment variable vs `pathlib.Path`), `precisión` (metric
vs everyday word vs `round(ndigits)`), `repositorio` (Git repository vs the Repository pattern).

**Still undecided, and now blocking option 2 in general:** splitting an entry does not stop the
shorter alias matching inside the longer one, because the extractor, the hover and
`glossary-first-use.test.mjs` each match every term independently with no claimed-span check. A
`identificador de correlación` term would still have `Correlación` matching inside it. Span
claiming has to land in all three before any further split is worth writing.

## Two decisions that are yours, not the campaign's (2026-09-17)

### 1. S01 asks a beginner to rebuild an entrypoint the section says is unnecessary

S01's own callout says "Un script no necesita `main()` ni un guardián `__name__` para existir",
and its theory says a file with one `print` is already a script. Yet `S01-T1-A-E2` gives the
learner `if ____ == "____":` / `____()` to fill in, the You Do starter wraps `hello_env.py` the
same way, and `S01-T1-B-E2` asks for `def main():` with `sys.argv[1:]`, `len` and an `if` — in a
subtopic whose own prose defers argv to S10 ("requiere listas, decisiones e índices que todavía
no necesitas"). `def` is taught in S05, `if` in S03, `__name__` in S10.

The repository currently *requires* the pattern: `test_s01_independent_recovery.py:172` pins the
exact `def main():` solution text, and `newbie_agentic_validator.py:369` fails `hello_sys.py` when
`def main` or `__main__` is missing. So this is a curriculum decision, not a content fix.

Per your standing policy the primer route is being taken first: S01 will present the two lines as
a fixed template, say in plain words what they do, point at S05 and S10, and stop asking the
learner to reconstruct the guard from blanks. **Re-raised for you:** whether to go further and
move the argv contract (`check_arg.py`) to S10, which would also mean repointing
`scripts/code_rendering.spec.ts:189`, the validator gates and their tests.

### 2. Q3's route decision still gates 12 findings

Every `Q3_ROUTE_PENDING` row in `audit/fixer/CONCEPT_QUEUE.md` — the S02–S04 practice layer, which
is one cumulative capstone (CP-N1-A) — waits on the same decision. Where a route-independent fix
exists it is named in the queue (unwrapping the six `def s02_ido_N():` demo wrappers, which take
no parameter, return nothing and are called once, changes no output under either route). Where it
does not (`safe_int`, `parse_client`, the You Do `_run_tests` asserts), the finding stops there.

One measurement changed since Q3 was written: adding `except` and `try/except` as aliases of
`Excepción` made the dependency visible for the first time — 11 occurrences in S02, 7 in S04, 14
in S05, 9 in S06, 3 in S07 and 10 in S08, all before S09 teaches exception handling. Q3's original
text understated this because no alias covered the keyword.
