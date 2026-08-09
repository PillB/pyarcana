# CP-N4-A — Governed Python Service Platform

**Level 4 · Gate S43 · Version 1.2.0**

Versioned API, schema validation, auth/authz, rate limits, health/readiness, structured redacted logging, migrations, backup/restore. Non-root container.

## Prerequisites
- Python 3.11+
- pytest (`pip install pytest`)

## Setup
```bash
cd capstones/CP-N4-A
python3 acceptance.py        # must print ALL PASS
python3 -m pytest test_solution.py -v
```

## Acceptance criteria
See `acceptance.py` — it verifies all acceptance criteria from the capstone contract.

## Critical criteria (non-compensatory)
- No real personal information (synthetic data only).
- No committed secrets.
- Reproducible from a clean environment.

## Synthetic data
All data is synthetic (seeded random, CC0, no real PII).

## Responsible use
No automated adverse decision. Human review required where applicable.

## Limitations
- Educational reference implementation, not production-grade.
- No external network calls in the default (no-key) path.
