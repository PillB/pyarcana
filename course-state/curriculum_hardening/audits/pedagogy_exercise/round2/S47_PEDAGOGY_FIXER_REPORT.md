# S47 Pedagogy Fixer Report (Round 2)

## Section
- **title:** MLOps: experimentos, registro y serving
- **id:** `opensource` (archivo `s47-opensource.ts`; contenido Production Data/ML Platform)
- **index:** 47
- **source:** `src/lib/course/sections/s47-opensource.ts`
- **round2 review:** `round2/S47_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** hand-written residual prose only; no generators, loops, templates, or bulk search-replace of pedagogical content across sections

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short skill-specific `title`
- [x] `instruction` is task-only (ordered steps; defect named where needed)
- [x] Exact outputs preserved (no starter/solution/output/fixture changes)
- [x] Spanish PE; no real PII; CASO-TAC-047 sintético
- [x] No generators used
- [x] Section source is TypeScript string-only prose edits (static build compatible)

## What was fixed

### P1 (task clarity + metacognition)
| Unit | Changes |
|------|---------|
| **S47-T2-B-E2** | Instruction expanded: starter defect (skew / `len(card)<4`), missing first, sha256 + train==serve + card set, exact triple print. Retrospective decoupled from feedback: multi-falla self-check (latest/skew/thin) + COMPLETE bridge. |
| **S47-T3-A-E2** | Instruction expanded: starter PASS-on-skew, missing `contract_tests`, full parity predicate, exact triple print. Retrospective adds self-check against inventing tests; TRACE vs DISABLE kept distinct from feedback. |
| **S47-T4-A-E2** | Instruction expanded: starter incompleto/invertido, missing hooks, full canary gates, exact triple print. Retrospective adds multi-falla self-check (hooks=False basta) + COLLECT bridge. |

### P2 (iDo)
| Area | Changes |
|------|---------|
| **Retros T1-B…T4-B** | Expanded ~40–50 w with principle + misconception + self-check + We Do bridge (T1-A already strong). |
| **why T2-B, T3-B, T4-A, T4-B** | Lifted to ~40+ w with technical rationale and ranker/Tacna or We Do bridge. |

### P2 (We Do E1 retros)
All eight E1 retrospectives now name the inverted starter, repair the classic misconception, include a self-check question, and point to E2 routes (PASS / breach / MISSING).

### P2 (We Do E2 instructions + feedback/retro)
| Unit | Changes |
|------|---------|
| T1-A-E2 | Retro self-check MARK vs MISSING:tolerance (not eco of feedback). |
| T1-B-E2 | Instruction steps full; retro self-check against inventing baseline. |
| T2-A-E1 / E2 | Instruction names illegal promote; retro self-check bad sig / invent approved. |
| T2-B-E1 | Retro self-check thin card `{use}`. |
| T3-A-E1 | Retro self-check `contract_tests=2`. |
| T3-B-E1 / E2 | E1 self-check untested fallback; E2 instruction expanded; retro TUNE≠ACTIVATE. |
| T4-A-E1 | Retro self-check hooks=False with low traffic. |
| T4-B-E1 / E2 | E1 self-check empty retired; E2 instruction + retro invent-tested trap. |

### Not changed (by design)
- All `starterCode`, `solutionCode`, `output`, fixtures CASO-TAC-047-*, `edgeCases`, `tests` strings, `youDo` frame
- T4-A demo `quality_delta` −0.01 vs E1 +0.01 (both PASS under predicate)
- T4-B demo `bool(retired)` vs We Do `"1.0.0" in retired` (strictness intentional)
- Section id `opensource` (naming is another campaign)
- Hints density (optional P2; left as guided scaffolding for Master)

## Unit ledger (post-fix residual)

| Unit | Residual after R2 |
|------|-------------------|
| 3× P1 E2 | **Closed** — instruction + distinct retro |
| 8× iDo | **Closed** — retros with self-check; why floors met |
| 8× E1 | **Closed** — starter-aware retros + self-check |
| Remaining E2 | **Closed** — instructions named defect/missing/predicate; retros not feedback clones |
| E3 / youDo | No R2 fix required (already A / A−) |
| Code/outputs | Unchanged |

## Validation notes
- Word targets used as gates (instruction ~40–100, retro ~40–80, why ~40–90); prefer fewer stronger sentences over essay bloat.
- Feedback kept principle-focused for the promote reviewer; retrospective adds self-check / starter detail / E3 bridge so the two fields are not near-identical.
- Anti-aberration: each prose block rewritten by hand for the subtopic verb (MARK / INVALIDATE / DENY / REJECT / DISABLE / ACTIVATE / STOP / ROLLBACK).

## Residual risks (post-fix)
- Master isomorphic E1/E2/E3 **code** pattern remains by design; prose fade is real.
- E3 instructions stay shorter (transfer tier); acceptable with strong preambles.
- Optional: loosen E1 hints if a future campaign wants more guided struggle (not blocking).

Section 47 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
