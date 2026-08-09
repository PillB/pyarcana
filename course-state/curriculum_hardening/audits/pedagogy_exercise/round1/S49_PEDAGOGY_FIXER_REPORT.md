# S49 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Agentes, herramientas y context engineering
- **id:** `data-contracts` (contenido = agentes/tools/context engineering; no schemas tabulares)
- **source:** `src/lib/course/sections/s49-data-contracts.ts`
- **review input:** `round1/S49_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s49-data-contracts.ts` (prose fields + instruction/feedback/why polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (numbered steps; no dense essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S49-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: ADR workflow/agent_candidate/need_evidence → loop evaluator–optimizer con cota → audit SRP vs god-tool → scope + idempotency store → JIT/checkpoint → compaction/LKG → budgets/stop con razón → sandbox/HITL/anti-replay.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with revisor / gate / portfolio anchor
- E3: removed “imprime meets_contract”; aligned to `print(*results)` of action codes

Fade preserved per subtema: fix predicado (E1) → assess tres fixtures (E2) → decide CONTINUE/breach/rama de incertidumbre (E3). Highlights:
- **T1-A:** workflow_preferred → PASS/KEEP/MISSING:agent_success → CONTINUE/KEEP/RUN_AGENT_BASELINE
- **T1-B:** bounded_loop_ok → PASS/STOP/MISSING:evaluator_pass → CONTINUE/STOP/REPLAN_WITH_BOUNDS
- **T2-A:** is_srp_tool → PASS/DISABLE/MISSING:typed_errors → CONTINUE/DISABLE/SPLIT_TOOL_CONTRACT
- **T2-B:** tool_call_ok → PASS/DENY/MISSING:error_kind → CONTINUE/DENY/CLASSIFY_TOOL_ERROR
- **T3-A:** context_ok → PASS/COMPACT/MISSING:provenance → CONTINUE/COMPACT/RETRIEVE_MINIMUM_CONTEXT
- **T3-B:** compaction_ok → PASS/RESTORE/MISSING:last_known_good → CONTINUE/RESTORE/REVIEW_COMPACTION_LOSS
- **T4-A:** budget_ok → PASS/STOP/MISSING:max_cost_pen → CONTINUE/STOP/ASK_FOR_SCOPE_REDUCTION
- **T4-B:** sandbox_ok → PASS/SANDBOX/MISSING:replayed_effects → CONTINUE/SANDBOX/REQUEST_HUMAN_APPROVAL (cierra CP-N4-C)

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante key⇒effect o prod⇒needs_human, sintético vs real/PII, frase de impacto ante revisor de plataforma).
- Left `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter unchanged (BLOCKED by design).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** |
| Canonical PASS / CONTINUE / breach / MISSING / human-route strings | **Unchanged** |
| You Do starter evidence False / readiness BLOCKED | **Unchanged** |
| Section `id` `data-contracts` | **Unchanged** (orchestrator-only if rename) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: all E1 PASS, E2 triples, E3 CONTINUE triples, demos (`GOAL_MET`, `ALLOW_RESUME_CHECKPOINT`, …)
- Residual dense `instruction: "S49-T…"` essays: **0**
- Instructions containing “meets_contract”: **0**
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (ADR, evaluator–optimizer, idempotency, LKG, cost_pen, HITL) stays appropriate for Master — keep Ayacucho/job anchors if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single «Contexto: el agente de Ayacucho…» template across ADR/loop/registry/store/attention/LKG/budget/sandbox.
4. **24 weDo same skeleton:** residual risk that learner feels mechanical if Round 2 shortens preambles too hard — vary escena by subtema (already differentiated by breach tokens and human routes).
5. **Carga cognitiva de verbos de acción:** preambles translate KEEP/RUN_AGENT_BASELINE/etc. into scenes; Round 2 should not re-introduce bare codes without gloss.
6. You Do integrates T1–T4; retrospective pushes invariant + PII + 30s impact into portfolio defense without bloating requirements.
7. Internal id `data-contracts` vs. title remains a naming footgun for future auditors — out of scope this round.

Section 49 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
