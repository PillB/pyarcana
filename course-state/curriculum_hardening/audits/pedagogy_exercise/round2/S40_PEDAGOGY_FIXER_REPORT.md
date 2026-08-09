# S40 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Arquitectura, DDD y decisiones técnicas
- **id:** `agentic-architecture`
- **index:** 40
- **source:** `src/lib/course/sections/s40-agentic-architecture.ts`
- **Round-2 review:** `round2/S40_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual priority list.
- Hand-edited only pedagogical prose in Section 40 (retrospectives, one hint pair, two feedbacks, optional youDo line).
- No generators, bulk templates, or cross-section copy-paste.
- Preserved all starter/solution code and canonical `output` strings.
- Validated: `tsc --noEmit` clean; all 24 weDo + 8 iDo canonical outputs still present in source.

## What was fixed

### P1 (metacognición)
| Unit | Change |
|------|--------|
| **S40-T2-A-E1** | Retrospective expanded: forbidden vs “sentir capas”, anti-patrón del starter, self-check on infrastructure→domain, transfer to E2 |
| **S40-T1-A-E1** | Retro with self-check (280 vs 300 + `>=`); hint points to comparison direction, not field list |
| **S40-T1-B-E1** | Retro: max validates expensive option; self-check residual 2 vs 4 |
| **S40-T3-B-E1** | Retro: currency==entity_id false green; self-check if merge left uncalculated |
| **S40-T4-A-E1** | Retro: self-check why draft + len(adr)<3 never passes real fixture |

### P2 — eco feedback↔retro (E2)
| Unit | Change |
|------|--------|
| **S40-T1-B-E2** | Retro no longer repeats residual=0; distinguishes REOPEN (content) vs MISSING (schema) + self-check |
| **S40-T2-A-E2** | Retro: REDRAW vs MISSING as content vs absence of evidence; self-check on empty dependencies |
| **S40-T2-B-E2** | Retro: INVERT vs MISSING as content vs contract evidence; self-check sqlalchemy + implements_port |

### P2 — length / self-check (remaining weDo)
- All 24 weDo retrospectives rewritten or expanded toward 40–80 words with principle + misconception + transfer + self-check where missing.
- Each names the **subtopic artifact** (QA, residual, grafo, DIP, ACL, entity/VO, ADR, consumer contract) — no generic “contenido vs schema” paragraph cloned across units.
- E3 retros lightly tightened (artifact + self-check already strong).

### P2 — iDo demos
| Demo | Change |
|------|--------|
| **T1-B-DEMO** | Self-check: max between sync/async |
| **T2-A-DEMO** | Self-check: infrastructure→domain vs domain→infrastructure |
| **T2-B-DEMO** | Self-check: Memory→SQL without rewriting open_case |
| **T3-A-DEMO** | Self-check: which ER field must not leak to intake |
| **T3-B-DEMO** | Self-check: why 150 PEN equals across dicts |
| **T4-A-DEMO** | Self-check: accepted without rollback |
| **T4-B-DEMO** | Self-check: v11 missing status breaks consumer |

### P2 — feedback / hint / youDo
| Item | Change |
|------|--------|
| **S40-T2-A-E3 feedback** | Expanded: don’t invent default graph in Red Andina dossier |
| **S40-T4-A-E2 feedback** | Expanded: don’t assume accepted from id alone |
| **S40-T1-A-E1 hint/hints** | Direction of comparison (`>=` vs `<=`) |
| **youDo retrospective** | Mentions relation/IA rows in context map (requirements scope) |

## Code / output changes
**None.** Starter defects, solutionCode, and exact outputs unchanged.

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short `title`
- [x] `instruction` remains task-only
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit`)

## Residual risks (post-fix)
- E2/E3 still share assess/decide skeleton by design; retros now differentiate by **gate token + artifact**, but a future bulk “polish” could reintroduce eco — avoid.
- Demo T3-A (ACL filter) vs lab T3-A (isdisjoint) bridge left verbal only — correct.
- youDo starter still has 4 BC rows; requirements still ask for relación/IA — learner must extend; retrospective now flags that.
- Feedback lines in several E2/E3 remain concise (~20–25 w); R2 prioritized retro metacognition over feedback essay length.

## Units touched (summary)
- **iDo retros:** T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B (7)
- **weDo retros:** all 24 (expand and/or self-check; eco break on T1-B-E2, T2-A-E2, T2-B-E2)
- **weDo feedback:** T2-A-E3, T4-A-E2
- **weDo hints:** T1-A-E1
- **youDo:** retrospective only

---

Section 40 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
