# PyArcana Agentic Dual-Newbie Attempt Log

| attempt | status | notes |
|---------|--------|-------|
| agentic_D1 | superseded | dual-LLM then invalidated |
| agentic_D2 | **REJECTED** | re-voice of D1 |
| agentic_E1 | historical | dual-LLM |
| agentic_E2 | **REJECTED** | E1 e1_code_map transplant |
| agentic_F1 | **REJECTED** | packet_walk bulk completer |
| agentic_F2 | **REJECTED** | F1 re-stamp + apply selfcheck theater |
| agentic_G1 | **PASS clean_52** | dual-LLM + hardened gates + llm_session_manifest |
| agentic_G2 | **PASS clean_52** | second consecutive; independence 13.5% body identity |

## Hardened rules
- Lives from dual-LLM subagents only
- `llm_session_manifest.json` ≥100 entries; wall-clock ≥30m
- Form gates (e.g. hello_sys needs main/sys.version/__name__)
- No packet_walk / e1_code_map / produce_agent / hardcoded ANSWERS
- Independence vs prior_clean: non-comment body identity must not be ≥98%

## Evidence
- `agentic_G1/`, `agentic_G2/`
- `scripts/newbie_agentic_llm_walk.py`, hardened `scripts/newbie_agentic_validator.py`
- `scripts/quarantine_theater/`
- `tests/adversarial/test_agentic_hardened_gates.py`
