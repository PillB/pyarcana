# ACCESSIBILITY — CP-FINAL integration platform

## WCAG 2.2 AA conformance
The learner-facing UI meets WCAG 2.2 AA. The integration platform's
artifacts (contracts, trace, reports) are designed to be accessible when
rendered in the UI.

## Keyboard operation
- All 12 contract tests can be run from the command line (`python3 -m
  unittest integration.contract_tests -v`); no GUI required.
- The end-to-end trace is a JSON object that can be navigated with a
  screen reader or a text browser.
- The `demo.py` script prints a single `METRICS_JSON: {...}` line that
  is machine-readable and screen-reader-friendly.

## Non-colour-only encoding
- The dependency graph uses node shapes (circle for principal, double
  circle for final) and text labels, not just colour.
- The no-go result uses text (`noGo=true`, `noGo=false`) and a structured
  `triggers` list, not just a colour indicator.
- The contract test output uses `PASS`/`FAIL` text, not just colour.

## Data-table fallback
- The dependency graph is also available as a JSON adjacency list
  (`dependency_graph.json`) for screen-reader and text-browser access.
- The end-to-end trace is a flat JSON array of steps, each with a
  `step_number`, `subsystem`, `interface`, and `status` — readable as a
  table.
- The contract tests output a structured `ContractResult` object with
  `contract_name`, `request_valid`, `response_valid`, and `errors` fields.

## Readable output
- All error messages are plain language: "Contract test test_intake
  failed: response missing 'accepted' field" — not internal codes.
- The `METRICS_JSON` line uses human-readable keys: `contracts_pass`,
  `e2e_steps`, `rollback_proven`, `no_go`.

## 200% zoom and mobile
- The UI renders the integration platform's results in a responsive
  grid that collapses to a single column on mobile and at 200% zoom.
- No horizontal scroll is required to read any integration artifact.

## Screen-reader labels
- The UI's "View system card" button has an `aria-label` that includes
  the capstone ID.
- The contract test results table has `<th scope="col">` headers.
- The no-go indicator has `role="alert"` when `noGo=true`.
