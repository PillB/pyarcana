# PyArcana Agentic Dual-Newbie Attempt Log

| attempt | result | notes |
|---------|--------|-------|
| agentic_A1/A2 | REJECTED by skeptic | incomplete x-placeholders; template justifications; A2 re-prefix only |
| agentic_B1 | **TAINTED / REJECTED** | meta uses source_exercises/source_selfcheck and rebuild_report; not a fresh direct-live transcript |
| agentic_B2 | **TAINTED / REJECTED** | copied from B1 and has rebuild_report; not independent or fresh |

Authoritative clean-run count after provenance/content reset: **0**.

## Hardened validator rules
- INCOMPLETE_EXERCISE (P0): placeholders / unclosed constructs
- TEMPLATE_JUSTIFICATION (P0)
- MISSING_EXERCISES (P0): every weDo id required
- Selfcheck ≥70% + justification support ≥0.5
- DIRECT_LIVE_PROVENANCE (P0): exact direct origins, distinct agent_instance_id, no rebuild/copy/code execution
