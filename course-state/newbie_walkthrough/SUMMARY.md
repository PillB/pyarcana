# SUMMARY — Dual-newbie agentic pedagogy gate (agentic_G1 + agentic_G2)

## Result
**PASS** under **hardened** `newbie_agentic_validator.py` (manifest + timing + form gates + independence + anti-theater).

| attempt | clean_52 | a_pass | b_pass | attempt_gates | notes |
|---------|----------|--------|--------|---------------|-------|
| agentic_G1 | true | 52 | 52 | pass | Dual-LLM Explorer+Skeptic; llm_session_manifest 104 rows; wall_clock ≥30m |
| agentic_G2 | true | 52 | 52 | pass | Independent second consecutive; 13.5% non-comment body identity vs G1 |

## Production path (honest)
1. Packets only via `newbie_agentic_llm_walk.py` (build quiz_card/slim + empty manifest).
2. **Dual-LLM subagents** write every `newbie_*_live.json` from packets (no solution generator).
3. `llm_session_manifest.json` records per-section×agent timestamps + response_sha256.
4. Hardened validator rejects theater (packet_walk, e1 transplant, missing manifest, bulk timing, form-broken scripts).

## Quarantined (must not produce G* lives)
`scripts/quarantine_theater/`: `newbie_agentic_f_packet_walk.py`, `_repair_e2_newbie_a.py`, `newbie_agentic_rebuild_lives.py`, `newbie_agentic_produce.py`.

## Rejected prior attempts
| attempt | status |
|---------|--------|
| D1/D2 | re-voice theater |
| E2 | E1 code transplant |
| F1/F2 | packet_walk bulk completer / re-stamp |

## Independence G2 vs G1
- Non-comment body identity: **13.5%** (gate: fail if ≥98%)
- Manifests present; dual-LLM session ids distinct

## Adversarial
`pytest tests/adversarial/` including `test_agentic_hardened_gates.py`

## Branding
PyArcana + Art Nouveau (prior phase)

## SCRATCH
`val_G1.txt`, `val_G2.txt`, `agentic_ledger.json`, `independence_G1_G2.log`, `adversarial_unit.log`
