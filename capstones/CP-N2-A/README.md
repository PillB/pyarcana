# CP-N2-A — Executive Data Quality and EDA Portfolio

**Level 2 · Gate S17 · Version 1.2.0**

Profiles a dataset, diagnoses missingness, compares segments, produces an executive memo with 5-part structure.

## Prerequisites
- Python 3.11+
- pytest (`pip install pytest`)

## Setup
```bash
cd capstones/CP-N2-A
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
