# YOUDO — CP-FINAL (Independent transfer task)

**Goal:** the learner independently extends the integration platform with a
new subsystem contract, a new contract test, and a new no-go trigger —
without instructor assistance.

## Context
You are given the existing 12-subsystem integration. A new requirement
arrives: add a **governance audit** subsystem that consumes the end-to-end
trace and produces a compliance report.

## Task 1 — Define the contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente)
1. Add a new contract in `integration/contracts.py`:
   `governance.audit(trace_id) -> ComplianceReport` (version `/v1/`).
2. Define the request schema (`trace_id: str`) and response schema
   (`compliance_report: dict`, `violations: list`, `signed: bool`).

## Task 2 — Implement the stub
1. Create `integration/governance.py` with a `run(trace_id)` function.
2. The stub should consume the end-to-end trace, check for redacted spans,
   and return a `ComplianceReport` with `violations=[]` and `signed=True`
   when all spans are clean.

## Task 3 — Write the contract test
1. Add `test_governance` to `integration/contract_tests.py`.
2. The test must send a valid request and assert the response matches the
   contract schema.

## Task 4 — Add a no-go trigger
1. Extend `integration/no_go.py` with a new trigger: "governance audit
   returns `signed=False`".
2. Run the E2E test with a deliberately unredacted span and verify
   `noGo=true` is emitted.

## Task 5 — Update the dependency graph
1. Add `governance` as a consumer of `copilot` in
   `integration/dependency_graph.py`.
2. Verify the topological order is still valid.

## Acceptance criteria
- `python3 -m unittest integration.contract_tests -v` passes 13 tests.
- `python3 -m unittest integration.e2e_test -v` passes with the new
  subsystem included.
- The no-go trigger fires when `signed=False`.
- No existing contract is modified (additive only, `/v1/`).

## Limitations
- The governance stub does not perform real cryptographic signing.
- The compliance report is a heuristic check, not a legal opinion.
