# Open questions the fixer campaign cannot decide on its own

## Q1 — Six badges require prerequisites taught after the badge's own sections
*Raised 2026-09-11 by `scripts/badge_readiness_audit.py`. Unresolved.*

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
*Raised 2026-09-11 by codex during the S02 round, closing S02-F01..F04, F09 in theory only.*

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
