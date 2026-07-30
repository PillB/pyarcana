# STARTER — CP-N4-C Harness Scaffold

This directory holds a *deliberately incomplete* scaffold of the orchestrator
that learners can copy into `harness/orchestrator.py` and complete as part of
the WEDO and YOUDO exercises.

## How to use
1. Copy `STARTER/orchestrator.py` to `harness/orchestrator.py` (back up the
   real one first).
2. Fill in the TODOs by following the real implementation in
   `harness/orchestrator.py` (kept for reference; remove it from the import
   path while you work).
3. Run `python3 course-state/capstones/CP-N4-C/demo.py`. It should exit 0
   and print `METRICS_JSON: {...}`.
4. Run `python3 tests/adversarial/test_n4c_harness.py`. All ten tests
   should pass.

## Constraints
- Only Python stdlib.
- No real API keys, no real PII, no network calls in the deterministic path.
- No inflated workplace titles in learner-facing copy.
- Do not create any separate fourteenth capstone artefact.

## Hint order
1. State load/save first — durable resume depends on it.
2. Provider selection second — mode drives everything.
3. Tool policy third — deny must short-circuit before any handler runs.
4. RAG + citations fourth — verifier rejects uncited grounded claims.
5. Loop detection fifth — use `RunState.step_fingerprint`.
6. Budget sixth — charge before every model and tool call.
