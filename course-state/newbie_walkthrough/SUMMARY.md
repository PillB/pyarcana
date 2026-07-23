# SUMMARY — Dual-newbie agentic pedagogy gate (agentic_I1 + agentic_I2)

## Result
**PASS** under re-hardened validator (exploratory ban, stamp ban, zero-duration ban, mtime ≥30m).

| attempt | clean_52 | A/B | gates | mtime | sessions | stamps | exploratory |
|---------|----------|-----|-------|-------|----------|--------|-------------|
| **I1** | true | 52/52 | pass | ~319m | ≥15s | 0 | 0 |
| **I2** | true | 52/52 | pass | ~91m | 17–87s | 0 | 0 |

Independence I2 vs I1: body **27%**, justifications **0%**.

## Production
- Dual-LLM subagents write lives from quiz_card/slim_packet only
- Packets via `newbie_agentic_llm_walk.py` (no solution generation)
- Quarantined bulk writers: `scripts/quarantine_theater/` (+ `tool_results_bulk/`)

## Rejected theater
H1 (dual explorer-H1 stamps + tool-results writers), H2 (exploratory protocols + hardcoded SELFCHECK), G/F/E2.

## Permanent tests
`tests/adversarial/test_agentic_hardened_gates.py` — exploratory incomplete, stamp detection, G1 rejection.

## Adversarial
pytest tests/adversarial/ green.
