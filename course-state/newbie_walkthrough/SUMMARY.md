# SUMMARY — Dual-newbie agentic pedagogy gate

## Status
**SUCCESS.** Two consecutive dual-LLM agentic runs clean under forensic gates.

| attempt | status |
|---------|--------|
| D–I | REJECTED_THEATER |
| J1/J2 | REJECTED — unbound receipts / synthetic clocks |
| K1 timing_fail_13m | REJECTED_BULK_TIMING |
| **agentic_K1** | **PASS clean_52** + attempt_gates_pass |
| **agentic_K2** | **PASS clean_52** + attempt_gates_pass (independent of K1) |

## Evidence
- K1: a_pass=52 b_pass=52 both=52 open_gaps=0 gates=[]
- K2: a_pass=52 b_pass=52 both=52 open_gaps=0 gates=[]
- Receipt bind 104/104 both attempts
- Independence K1↔K2: just identity ~0% (see independence_K1_K2.log)
- Branding: PyArcana + Art Nouveau retained
- Adversarial: test_receipt_binding + forensic + hardened gates green

## Method
- Sealed `write_live` + `llm_call_receipts.jsonl`
- Dual Explorer/Skeptic staggered waves ≥30m wall span
- Pure agentic packet-only evaluation (no code-exec pass bar)
- Quarantined theater generators under scripts/quarantine_theater/

Updated: 2026-07-23T15:59:11.480185+00:00
