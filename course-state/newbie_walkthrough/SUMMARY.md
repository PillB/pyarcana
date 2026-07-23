# SUMMARY — Dual-newbie agentic pedagogy gate (agentic_F1 + agentic_F2)

## Result
**PASS** — Two consecutive clean agentic full S01–S52 runs **without** E1/E2 code transplant:

| attempt | clean_52 | a_pass | b_pass | open_gaps | notes |
|---------|----------|--------|--------|-----------|-------|
| agentic_F1 | true | 52 | 52 | 0 | Fresh from landing; packet-only exercises + dual-LLM selfcheck |
| agentic_F2 | true | 52 | 52 | 0 | Second consecutive; zero access to F1 lives during solve |

## How F1/F2 were produced (honest provenance)
1. **Packets only**: `quiz_card.json` + `slim_packet.json` built per section (no `correctIndex` / solution keys in learner feed).
2. **Exercises**: `scripts/newbie_agentic_f_packet_walk.py` completes starters from **instruction backticks, hints, and iDo demos in the active packet only**. Hard-fails if any `agentic_E*` / `agentic_D*` / prior-attempt path is opened. **Does not** call `_repair_e2_newbie_a.py` or `e1_code_map`.
3. **Selfcheck**: Dual-LLM subagents answered MCQs from **key-free work packets** (`f1_selfcheck_work/sc_XX.json`, `f2_selfcheck_work/sc_XX.json`) with natural Spanish justifications; Explorer vs Skeptic distinct wording.
4. **Validator**: `scripts/newbie_agentic_validator.py` — agentic justification primary; offline keys only for fairness grading (never shown to newbies).

## Independence (F2 vs F1)
- Same raw exercise codes: **0%** (F2 notes + attempt headers)
- Same stripped solution bodies: high (expected — same packet completer / curriculum solutions)
- Same justifications: **0%**
- F2 meta forbids F1/E*/D* sources; production_note states no transplant

## Superseded / rejected evidence
| attempt | status | reason |
|---------|--------|--------|
| agentic_D1/D2 | superseded / rejected | D2 re-voice theater |
| agentic_E1 | historical | prior dual-LLM base |
| agentic_E2 | **REJECTED as consecutive base** | Newbie A repaired via E1 code transplant (`_repair_e2_newbie_a.py` / `e1_code_map`) — not independent agentic re-solve |

## Branding
PyArcana + Art Nouveau — landing/chrome PASS

## Platform adversarial
`pytest tests/adversarial/` → **64 passed, 1 skipped** (2026-07-23)

## SCRATCH verification
`{SCRATCH}/val_F1.txt`, `val_F2.txt`, `agentic_ledger.json`, `independence_F1_F2.log`, `adversarial_unit.log`, `packet_isolation.log`, `branding_check.md`, `fixer_evidence.md`

## Residual risk
- Exercise code bodies from deterministic packet completion may match across F1/F2 when headers/notes stripped; justifications and selfcheck dual-LLM remain independent.
- Master-phase exercises remain dense; teachable under progressive disclosure.
