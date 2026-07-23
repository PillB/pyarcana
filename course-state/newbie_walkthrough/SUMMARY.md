# SUMMARY — Dual-newbie agentic pedagogy gate (agentic_H1 + agentic_H2)

## Result
**PASS** under re-hardened validator (zero-duration ban, mandatory mtime ≥30m, stamp ban, independence).

| attempt | clean_52 | a | b | gates | mtime span | session dur | stamps |
|---------|----------|---|---|-------|------------|-------------|--------|
| **H1** | true | 52 | 52 | pass | ~73.5m | 17–33s | 0 |
| **H2** | true | 52 | 52 | pass | ~30.6m | 15–48s | 0 |

Independence H2 vs H1: non-comment body **8.3%**, justifications **0%**. No g2_agent stamps.

## Hardened gates (permanent)
- ZERO_DURATION_SESSION if any session &lt; 5s
- BULK_WRITE_MTIME if live mtime span &lt; 30m (wall_clock claim cannot override)
- MECHANICAL_IDENTITY_STAMP if g2_agent/h_agent
- SUSPICIOUS_UNIFORM_DURATION
- Manifest ≥100 entries with real timestamps

## Rejected theater
| attempt | reason |
|---------|--------|
| G1/G2 | zero-duration sessions, short mtime, G2 g2_agent stamps |
| F1/F2 | packet_walk bulk completer |
| E2 | E1 code transplant |

## Production
- Packets: `newbie_agentic_llm_walk.py`
- Lives: dual-LLM subagents sequential waves, packet-only
- Quarantine: `scripts/quarantine_theater/`

## Adversarial
`tests/adversarial/` including `test_agentic_hardened_gates.py`

## SCRATCH
val_H1.txt, val_H2.txt, independence_H1_H2.log, agentic_ledger.json
