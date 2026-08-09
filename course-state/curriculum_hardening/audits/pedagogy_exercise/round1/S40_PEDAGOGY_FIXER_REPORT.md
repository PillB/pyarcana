# S40 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Arquitectura, DDD y decisiones técnicas
- **id:** `agentic-architecture`
- **source:** `src/lib/course/sections/s40-agentic-architecture.ts`
- **review input:** `round1/S40_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s40-agentic-architecture.ts` (prose fields + instruction/feedback/why polish).
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
| S40-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: QA medible (umbral + dueño) → trade-off min_score + residual → grafo de capas sin saltos → DIP ports/adapters → ACL ER→intake (score no filtra) → entity/VO/servicio táctico → C4 + ADR accepted con rollback → evolución aditiva v1 ⊆ v11 + deuda fechada.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with Red Andina / dossier anchor where it was telegraphic

Fade preserved per subtema: fix predicado (E1) → assess de tres fixtures (E2) → decide CONTINUE/breach/REQUEST_* (E3). Highlights:
- **T1-A:** observed≤target + owner → PASS/REJECT/MISSING → REQUEST_QA_OWNER
- **T1-B:** min_score + residual ≤ 2 → REOPEN → ESCALATE_RESIDUAL_RISK
- **T2-A:** grafo forbidden + print graph → REDRAW_BOUNDARY → REVIEW_LAYER_OWNER
- **T2-B:** implements_port + imports + ≥3 tests → INVERT → DEFINE_PORT_CONTRACT (instruction ya no dice «meets_contract» suelto)
- **T3-A:** isdisjoint + case→record + map print → SPLIT → WORKSHOP_UBIQUITOUS_LANGUAGE
- **T3-B:** entity/VO/merge 0.7 (no currency==entity_id) → REJECT_DOMAIN_MODEL → CLARIFY_INVARIANT
- **T4-A:** C4 + ADR-001 accepted → RETURN_ADR_TO_DRAFT → REQUEST_ARCH_REVIEW
- **T4-B:** v1 ⊆ v11 + debt/retire_on → BLOCK_BREAKING_CHANGE → NEGOTIATE_VERSION (preamble E2 aclara fechas ISO del lab)

### You Do (1)
- Added `retrospective` de defensa de dossier (frontera normal/BLOCK/REVIEW, sintético vs real, frase de impacto medible en 30 s).
- Light touch on `portfolioNote` (trío medida + dueño + consecuencia al marcar evidence True).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** |
| Canonical PASS / CONTINUE / REJECT / REQUEST / BLOCK / SPLIT / etc. strings | **Unchanged** |
| You Do evidence starts False / BLOCKED | **Unchanged** (intentional) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: QA PASS, trade-off PASS, capas/graph, DIP, context map, entity/VO, C4/ADR, consumer contract, and all E2/E3 transfer routes
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (QA, ADR, ACL, DIP, C4) stays appropriate for Master — keep Red Andina / Lima anchors if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single «Contexto: el dossier…» template.
4. **T3-A demo vs lab:** demo teaches ACL by filtering score; lab requires isdisjoint + case→record — retrospective of demo already bridges; Round 2 should not unify code.
5. You Do context map requirements mention relación/IA; starter shows intake/er/triage/reporting — learner must complete rows; retrospective already asks for map frontiers without inventing PII.
6. Gold-tone code scaffolding was already strong; Round 2 should not «improve» Pass strings without execute-and-diff.

## Files touched
1. `src/lib/course/sections/s40-agentic-architecture.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S40.md`
