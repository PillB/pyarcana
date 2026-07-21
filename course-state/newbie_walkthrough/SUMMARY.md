# PyArcana Newbie Walkthrough — SUMMARY

**Brand:** PyArcana (Art Nouveau chrome/landing preserved)  
**Final attempt:** **attempt_003**  
**Finished:** 2026-07-21T17:46:57.145095+00:00

## Success gates

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Features proven by real execution | Runtime audit real python3: pass=2383 fail=0 |
| 2 | No stubs/mocks for required paths | Learner packets strip solutions; grading uses real keys offline |
| 3 | Critical content/E2E gates | runtime ok=True exam ok=True |
| 4 | Evidence trail | attempt_001..003 packets, dual_sim, live A/B, FIX_*.md |
| 5 | Multi-agent separation | Live newbies packet-only; fixer isolated PRE_ROUND_RESEARCH |
| 6 | No open P0/P1 | runtime p0=0 p1=0; exam p0=0; heuristic=0 |

**clean_52_knowledge:** **True**

## Dual-sim (all 52)

- all_sufficiency_ok: **True**
- sections_run: 52
- Knowledge gate: correct self-check options supported by cumulative packet text for every section

## Live dual newbies (S01, attempt_003 restart)

| Agent | Self-check | Blocked exercises | Notes |
|-------|------------|-------------------|-------|
| Newbie A Explorer | 100% (5/5) | 0 | def/argv/len/executable taught |
| Newbie B Skeptic | 100% (5/5) | 0 | prior gaps RESOLVED |

## Attempts timeline

| attempt | max | outcome |
|---------|-----|---------|
| 001 | baseline | heuristic gaps 2; runtime P1=58→classifier work |
| 002 | after runtime P1=0 | live S01 blocked on untaught primitives |
| 003 | after S01 expansion | **52/52 sufficiency; live S01 clear** |

## Branding

COURSE_META, layout metadata, page header/footer, i18n sidebar/footer, Dashboard gold badge, AuthModal, PdfReport, Glossary → **PyArcana**

## Residual risks

- Type annotations / general slicing lightly taught (starters carry them; non-blocking for live S01)
- Bag-of-words dual-sim MCQ accuracy is not the primary gate (sufficiency + live agents are)
- Full live dual-LLM on every exercise of S02–S52 not re-executed after each restart; dual_sim + packet hash + S01 live proof + restart policy document the pedagogy loop

## Key paths

- `course-state/newbie_walkthrough/attempt_003/`
- `scripts/newbie_packet_builder.py`
- `scripts/newbie_walkthrough_runner.py`
- `scripts/newbie_dual_sim.py`
