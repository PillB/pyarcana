# STARTER — CP-N4-C

This directory is the top-level STARTER pointer for the CP-N4-C capstone
package (Auditable AI Operations Copilot — multi-agent harness).

The actual scaffold lives in **`harness/STARTER/`** (a deliberately
incomplete orchestrator that learners copy into `harness/orchestrator.py`
and complete as part of the WEDO and YOUDO exercises). See
`harness/STARTER/README.md` for the full instructions, hint order and
constraints.

## How to use
1. Read `BRIEF.md`, `SUBGATES.md` and `harness/STARTER/README.md` first.
2. Copy `harness/STARTER/orchestrator.py` to `harness/orchestrator.py`
   (back up the real one first).
3. Fill in the TODOs by following the real implementation kept for
   reference.
4. Run `python3 demo.py` — it must exit 0 and print
   `METRICS_JSON: {...}`.
5. Run `python3 tests/test_demo.py` — all tests must pass.
6. Run `python3 tests/adversarial/test_n4c_harness.py` for the deep
   adversarial coverage required by sub-gate S50.

## Constraints
- Only Python stdlib.
- No real API keys, no real PII, no network calls in the deterministic
  path.
- No inflated workplace titles in learner-facing copy.
- Do not create any CP-N4-D artefact (per ADR-capstone-cardinality and
  ADR-N4-C-agentic-harness).
