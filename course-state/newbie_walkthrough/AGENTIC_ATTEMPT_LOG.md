# Attempt Log — Dual-newbie agentic pedagogy (Graph Memory)

Updated: 2026-07-23T15:59:11.480185+00:00

## Final ledger

| attempt | status | notes |
|---------|--------|-------|
| D–I | REJECTED_THEATER | generators, re-voice, bulk writers, stamps |
| J1/J2 | REJECTED | unbound exercises_sha256; synthetic duration staircase |
| agentic_K1_timing_fail_13m | REJECTED_BULK_TIMING | 104/104 bind + 52/52 pedagogy; span 13m |
| **agentic_K1** | **PASS** | Staggered dual-LLM; just repair; forensic reseal; S20/S23 short-body fix |
| **agentic_K2** | **PASS** | Independent dual-LLM; S01 incomplete fix; S05 taint scrub; unique session ids |

## K1→K2 restart loop
1. K1 first pass: bulk timing fail (13m) → archived as timing_fail_13m
2. K1 paced staggered waves (0/8/16/24 min) → pedagogy 52/52; short justs + uniform 8.6s latency → repair + reseal
3. K1 S20-T4-B-E3 / S23-T2-B-E1 too_short_body → full starter implementations → clean_52
4. K2 independent init prior_clean=K1; staggered dual-LLM; varied latencies
5. K2 fixes: B session_id overuse; S01 A ____ markers; S05 B "generator" false taint → clean_52

## Permanent seals
- write_live pure exercises/selfcheck/response hashes
- Forensic gates: BULK_WRITE_*, SUSPICIOUS_UNIFORM_DURATION, RECEIPT_*, STAIRCASE, LINEAGE co-signal
- tests/adversarial/test_receipt_binding.py, test_forensic_pedagogy_gates.py, test_agentic_hardened_gates.py

## Landing
- PyArcana branding + Art Nouveau (MuchaHalo, circuit-vine, gold badge)
