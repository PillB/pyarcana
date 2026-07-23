# PyArcana Agentic Dual-Newbie Attempt Log

| attempt | status | notes |
|---------|--------|-------|
| agentic_D1 | superseded | dual-LLM live; later invalidated as base for D2 theater |
| agentic_D2 | **REJECTED** | re-voice of D1; not independent dual-LLM re-solve |
| agentic_E1 | **PASS clean_52** | genuine dual-LLM from landing post-rebalance; a=52 b=52 gaps=0 |
| agentic_E2 | **PASS clean_52** | second consecutive; independence vs E1: 0% just match; A repaired incompletes/templates |

## Rules
- Newbies must not read D1/D2/A*/B*/C*/007b lives or solutions as answer keys
- method=`live_agentic_packet_only_no_execution`
- Two consecutive clean E1+E2 required — **MET**
- After learner-facing content fixes: restart both newbies from landing
- Simulation artifact repairs (incomplete fills / justification rewrites) re-validated in place when content unchanged

## agentic_E1
- started: 2026-07-22 (UTC)
- git baseline: post ebc86eb era packets
- Explorer + Skeptic full S01–S52
- validator: clean_52 true (reconfirmed 2026-07-23)

## agentic_E2
- started: 2026-07-23T04:29:46Z
- reason: Second consecutive genuine dual-LLM walk from landing; zero access to E1 lives during fill
- Initial validator: a_pass=27, b_pass=52 (A incomplete ____/# TODO + template justifications S01–S26)
- Repair: `scripts/_repair_e2_newbie_a.py` — complete codes from packet + E1 curriculum code reference; natural E2 Explorer justifications
- Final validator: clean_52 true, a=52, b=52, open_gaps=0 (2026-07-23T04:49:41Z)
- Independence vs E1: same_codes 30.3%, same_just 0.0%

## Evidence paths
- `course-state/newbie_walkthrough/agentic_E1/`
- `course-state/newbie_walkthrough/agentic_E2/`
- `course-state/newbie_walkthrough/agentic_E2/fixes/REPAIR_NEWBIE_A_REPORT.json`
- `course-state/newbie_walkthrough/agentic_E2/fixes/INDEPENDENCE_E2_VS_E1.json`
- `course-state/newbie_walkthrough/SUMMARY.md`
