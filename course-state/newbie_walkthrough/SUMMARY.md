# PyArcana Newbie Walkthrough — SUMMARY

**Final attempt:** **attempt_007b**  
**Finished:** 2026-07-21T21:34:26.131535+00:00

## Acceptance (honest live dual-LLM)

| Criterion | Result |
|-----------|--------|
| Live dual-LLM S01–S52 | **A 52/52 · B 52/52 · both 52** |
| Generators | **none** under attempt_007b |
| S01 restart | sha differs from attempt_004 (`f9ede16626d86aab` vs `92b9491e9e1ca1d1`) |
| Code execution grading | **yes** (`code_exec+no_sim_fallback+generator_reject`) |
| Dual-sim sufficiency | green all 52 |
| Runtime p0/p1 | 0/0 |
| Exam p0/p1 | 0/0 |

## Restart trail

| Attempt | Why |
|---------|-----|
| 004 | first full live; phase3 stubs blocked by Skeptic; gen scripts tainted phase3 |
| 005 | tainted: S01 byte-identical to 004; phase3 generators |
| 006 | real dual-LLM; Skeptic blocked phase3; FIX_002 demo scaffolds |
| **007b** | after FIX_002b (solutions=demos); full real dual-LLM; honest code grading **CLEAN_52** |

## Artifacts

- `attempt_007b/section_XX/newbie_{a,b}_live.json` (attempt_id=attempt_007b, method=llm_packet_only_no_generator)
- `attempt_007b/live_ledger.json`, `live_grades.json` per section
- `attempt_007b/fixes/FIX_002.md`, `PRE_ROUND_RESEARCH.md`
- Grader: `scripts/newbie_live_phase_runner.py` (runs code vs solution output)

## Residual

- Phase 3 pedagogy still shallow (demo-scaffold exercises) but **teachable** for packet-only newbies; deeper Master tasks remain curriculum work.
