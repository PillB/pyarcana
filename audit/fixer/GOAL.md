# Goal

**A learner never meets a word the course did not teach them.**

Drive the curriculum to a state where every concept a learner encounters has been
explained, exemplified, exercised and tested *before* they meet it — and prove it with
gates, not assert it in a report.

Re-read this file, `AGENTS.md` (the reviewer-fixer round), `audit/fixer/decisions.md` and
`audit/fixer/LEDGER.md` before starting each stage. Context goes stale over a long
campaign; decisions made twenty rounds ago still bind.

## Definition of done

Each item is a command that must pass. None of them is a judgement call.

1. `python3 scripts/concept_map.py --check` exits 0 — no L0 concepts, no surprising uses.
2. `npm run test:first-use-all` exits 0.
3. `npm run test:no-identifiers` exits 0 (D2).
4. `python3 scripts/badge_readiness_audit.py` exits 0.
5. `npm run test:python-content` — 0 failures, `environment_matches_pins: ok`.
6. `npm run test:prose-quality` — no section regressed on run-ons or nominalisation.
7. `python3 tools/fixer/ledger.py --check` exits 0; every step column 52/52 except
   `concepts`, which a human ticks.
8. `node scripts/complexity_gate.mjs` exits 0.
9. CI green on `main` through both adversarial halves, and
   `scripts/deployment_parity_audit.py` reports the live site serving it.

## How

- **Graph engineering.** One job per node: researcher, planner, author (codex, read-only),
  applier, verifier. Typed edges — anchor/replacement pairs against a JSON schema. Fan out
  across sections, never within one.
- **Loop engineering.** Per passage, codex critiques what it wrote and unresolved concerns
  return to it at most twice before going to a human. Per section, red → author → apply →
  gates, converging at two quiet rounds or five.
- **STORM.** Anything the registry does not settle is asked from several expert
  perspectives, synthesised, critiqued for what none raised, refined.
- **Context engineering.** Each authoring call carries its section's findings, its
  concept-map rows, vocabulary already taught, the distilled writing rules, and concrete
  violations — not raw guides pasted whole.

## Order of attack

1. S02–S08 redaction — **done**, including repairing what the pass broke.
2. The never-explained concepts, by section of first use — **in progress**.
3. S09 → S52 full rounds, curricular order.
4. Figures alongside each round, load-bearing concepts first (D5).
5. Badge catalog last, and only with a human decision.

## Standing constraints learned the hard way

- **Complete content outranks a fixed count.** Structural counts protect canonical items
  against loss; they are floors, not ceilings on teaching. (D6)
- **Supporting theory blocks carry no `subtopicId`.** The eight numbered subtopics are the
  spine demos and exercises hang from; explanatory depth goes in unnumbered blocks, which
  the V3 contract parser deliberately ignores.
- **Run both adversarial halves, and read results case-insensitively.** A grep for
  `adversarial` hid `ADVERSARIAL(py) FAILED` for four rounds.
- **Ship through a pull request.** `main` has a PR rule; pushing past it is not a shortcut.
