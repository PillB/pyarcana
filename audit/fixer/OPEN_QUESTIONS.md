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
