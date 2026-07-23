# PyArcana Agentic Dual-Newbie Attempt Log

| attempt | status | notes |
|---------|--------|-------|
| agentic_D1 | superseded | dual-LLM live; invalidated as D2 base |
| agentic_D2 | **REJECTED** | re-voice of D1 |
| agentic_E1 | historical | genuine dual-LLM; not used as F consecutive base |
| agentic_E2 | **REJECTED** | A failed incomplete/template; repair used E1 code transplant — not independent |
| agentic_F1 | **PASS clean_52** | packet-only exercises + dual-LLM selfcheck; no E* transplant |
| agentic_F2 | **PASS clean_52** | second consecutive; no F1/E* lives; dual-LLM selfcheck independent |

## Rules
- method=`live_agentic_packet_only_no_execution`
- artifact_origin=`direct_agent_output`
- code_execution_used=false
- Newbies must not read prior attempt lives as answer keys
- **Forbidden:** E1 code transplant / `_repair_e2_newbie_a.py` as path to clean consecutive run
- After learner-facing content changes: full restart from landing→S01
- Two consecutive clean F1+F2 required — **MET**

## agentic_F1
- started: 2026-07-23
- packages: slim packets S01–S52
- exercises: `newbie_agentic_f_packet_walk.py` (packet iDo/instruction/hints only)
- selfcheck: dual-LLM from key-free `f1_selfcheck_work/sc_*.json`
- validator: clean_52 true, a=52, b=52, open_gaps=0
- forbidden: E1/E2/D*/A*/B*/C*/007b lives

## agentic_F2
- started: 2026-07-23
- second consecutive from landing
- zero access to F1 lives during solve
- exercises: independent F2 packet walk + F2 notes
- selfcheck: dual-LLM from `f2_selfcheck_work/sc_*.json` (not F1 lives)
- validator: clean_52 true, a=52, b=52, open_gaps=0
- independence vs F1: same_just=0%; raw code identity=0%

## Evidence paths
- `course-state/newbie_walkthrough/agentic_F1/`
- `course-state/newbie_walkthrough/agentic_F2/`
- `course-state/newbie_walkthrough/agentic_F2/fixes/INDEPENDENCE_F2_VS_F1.json`
- `course-state/newbie_walkthrough/SUMMARY.md`
- scripts: `newbie_agentic_f_packet_walk.py` (no prior-attempt I/O)
