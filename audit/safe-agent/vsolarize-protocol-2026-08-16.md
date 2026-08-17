# vSolarize v2.3 — protocol used for this validation cycle

Derived from local `solarize_skill` v2.2 (TDD Solarize: Red→Green→Refactor,
Graph Memory, converging loops, SkillOpt human gate) plus 2025–2026
verification practice. **Not** a mutation of `SKILL.md` (SkillOpt human
gate required for skill-file edits).

## What v2.3 adds over Solarize v2.2

| Node | Job |
| --- | --- |
| `LIVE_VERIFIER` | Exact SHA / Last-Modified / content-marker compare against live Pages. Local green ≠ live. |
| `ANTI_FAKERY` | Scan TODO/NotImplemented on *claimed production paths*; distinguish pedagogical STARTER stubs from runtime fakery. |
| `ISOLATED_AGENT` | Readonly worktree explorers; no shared mutable state; fan-in to orchestrator. |
| `PRODUCTION_CALLER` | Require a real caller (demo/orchestrator), not tests-only modules advertised as features. |

Nested loops (Ng / Loop Engineering): inner TDD seconds; developer minutes;
**external/production hours** is now a first-class gate, not a footnote.

ISO 25010 / ISO 29119 / NIST AI RMF alignment used here:

- **Functional suitability** — typed contracts, OTLP proto decode
- **Reliability** — fail-closed IDs, redaction
- **Security** — secret scan, no PII in traces
- **Maintainability** — collected CI tests
- **AI-specific** — holdout/trajectory already in N4-C demo; GenAI semconv current keys

## Isolated persistent agents

- Worktrees: `pyarcana-pr25`, `pyarcana-pr27` (not `main`)
- Readonly explore agents: OTLP, CP-FINAL, UI/live-gap
- Persistence: this file + cycle notes; no silent skill rewrite

## Hard fails

- Mocks as sole proof of a production type
- Claiming PR #25/#27 are live
- Treating learner STARTER `NotImplementedError` as a product defect
- Deleting failing tests to go green
