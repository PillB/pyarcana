# PyArcana Agentic Dual-Newbie Attempt Log

| attempt | status | notes |
|---------|--------|-------|
| D1/D2 | REJECTED | re-voice |
| E2 | REJECTED | E1 transplant |
| F1/F2 | REJECTED | packet_walk theater |
| G1/G2 | REJECTED | zero-duration manifest, mtime theater, g2_agent stamps |
| **agentic_H1** | **PASS clean_52** | dual-LLM sequential waves; mtime ~73m; sessions 17–33s; no stamps |
| **agentic_H2** | **PASS clean_52** | independent; mtime ~30.6m; sessions 15–48s; body identity 8.3% |

## Hardened rules
- No zero-duration sessions
- Live mtime span ≥ 30 minutes required
- No g2_agent/h_agent mechanical stamps
- Dual-LLM packet-only lives + llm_session_manifest
