# PyArcana Newbie Walkthrough — SUMMARY

**Final attempt:** **attempt_005** (clean restart after FIX_001)  
**Finished:** 2026-07-21T19:49:08.599431+00:00

## Live dual-newbie S01–S52

| Agent | Sections pass | Self-check + weDo coverage |
|-------|---------------|----------------------------|
| Newbie A Explorer | **52/52** | all weDo + selfCheck per section |
| Newbie B Skeptic | **52/52** | all weDo + selfCheck per section |
| **Both pass** | **52/52** | clean_52=True |

Artifacts: `attempt_005/section_XX/newbie_{a,b}_live.json` + `live_grades.json` + `live_ledger.json`.

## Restart policy

| Attempt | Reason | Live result |
|---------|--------|-------------|
| 003 | prior baseline | live S01 only |
| 004 | full live first pass | Skeptic blocked 312× S40–S52 stubs; S27 NamedTemporaryFile |
| **005** | FIX_001 content expand + S27 theory | **52/52 both agents** |

## Dual-sim

all_sufficiency_ok=True sections=52

## Technical gates

| Gate | Result |
|------|--------|
| Runtime audit | p0=0 p1=0 ok=True |
| Exam pedagogy | p0=0 p1=0 ok=True |
| Packet isolation | 0 solution/correctIndex leaks in learner packets |
| Adversarial suite | npm run test:adversarial (see CI + scratch) |

## Fixer

- `attempt_004/fixes/PRE_ROUND_RESEARCH.md`
- `attempt_005/fixes/FIX_001.md` — S40–S52 weDo expansion + S27 NamedTemporaryFile

## Residual risks

- Phase 3 exercises still pedagogically thin (print-target from instructions); deeper Master skill checks remain a curriculum depth opportunity, not a knowledge-isolation block after FIX_001.
