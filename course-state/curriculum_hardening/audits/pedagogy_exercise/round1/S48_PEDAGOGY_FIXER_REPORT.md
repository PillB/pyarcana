# S48 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Aplicaciones LLM y RAG con evidencia
- **id:** `ai-governance` (archivo histórico `s48-ai-governance.ts`; contenido = RAG con evidencia, ACL, grounding, abstención)
- **source:** `src/lib/course/sections/s48-ai-governance.ts`
- **review input:** `round1/S48_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s48-ai-governance.ts` (prose fields + instruction/feedback polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` strings (no integrity renames).
- Validated with field counts and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (steps; no E_n essay blend with · meta/defect dump)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII (CASO-PUN-048 sintético)
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S48-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~45–70 words), `retrospective` |

Focus: ranking versionado (similitud ≠ claim), promote holdout+costo, chunk semántico/dedup, ACL pre-rank + tombstone, híbrido + Recall@k, claims ⊆ citas, grounding + verdad vacua + injection-as-data, abstenerse como éxito operativo.

### We Do (24)
For each E1/E2/E3 across T1-A … T4-B:
- `title` (4–10 words, escena distinta por subtema)
- `preamble` (context / goal / success / constraints bullets; fade E1 predicado → E2 tres rutas → E3 CONTINUE/breach/review)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (socio / índice / promote; 25–60 words band)

Prioridad de prosa clara en T2-B ACL, T4-A grounding/inyección, T4-B abstención (promote silencioso / missing≠breach).

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante CP-N4-C-RAG, PII sintético vs real, frase de impacto 30 s).
- Left starter `CASO-PUN-048 BLOCKED` / REQUIRED asserts unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` markers | **Unchanged** |
| Action codes (REJECT_*, MISSING:*, CONTINUE, ABSTAIN_*, etc.) | **Unchanged** |
| You Do readiness scaffold | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `·` essay instructions
- youDo: 1 retrospective
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Legacy `id: "ai-governance"` / filename vs title RAG — product residual, out of scope this round.
2. Code-shape clone across 8 subtemas (assess/decide) is intentional; Round 2 may tighten any residual prose length near band edges.
3. Hints remain relatively guided on E1 (by design); E2/E3 still name rules — acceptable for Master fade; optional soft-hint pass if learners over-rely.
4. Cognitive load of 24 We Do remains high; preambles stay in 80–150 band to avoid essay bloat.
5. Verdad vacua (`evidence_ids=[]`) and ACL post-rank industry habit remain common misconceptions — prose now addresses them; Round 2 re-reads for stickiness.

## Files touched
1. `src/lib/course/sections/s48-ai-governance.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S48.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*
