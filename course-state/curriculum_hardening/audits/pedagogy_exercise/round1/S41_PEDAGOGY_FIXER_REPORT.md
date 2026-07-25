# S41 Pedagogy Fixer Report (Round 1)

## Section
- **title:** APIs con FastAPI y contratos HTTP
- **shortTitle:** APIs FastAPI
- **id:** `llm-finetuning` (archivo histórico `s41-llm-finetuning.ts`; contenido = control plane HTTP versionado, no fine-tuning de LLM)
- **source:** `src/lib/course/sections/s41-llm-finetuning.ts`
- **review input:** `round1/S41_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s41-llm-finetuning.ts` (prose fields + instruction/feedback polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (steps; no E_n essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S41-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: matriz status 201/404/200 → Idempotency-Key created/replay/conflict + keyset → thin handler + DI → 422 + allow-list → boundary async/background → try/finally Problem Details → pirámide seed→nivel → 429 + log sin PII.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with *por qué importa al cliente/OpenAPI/gate CP-N4-A*, no solo el token

Fade preserved: implement domain (status/store/DI/handle/boundary/budget/pyramid/admit) → assess valid/adverse/missing → decide CONTINUE/breach/uncertainty. Scene differentiation: auditoría de status · reintentos · code review DI · 422/OpenAPI · capacity · incidente timeout · test plan · gate edge.

**Fixtures desambiguados en prosa (P2 del review):**
- T2-B-E2: preamble explicit that PASS is a **correct rejection (422)**, not a happy create 200
- T3-A-E2: preamble explicit that PASS requires **capacity flags** (`cpu_offloaded`, `durable_job`), not kind alone

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariantes de `readiness()`, PII real vs sintético Arequipa, frase de impacto medible, puente S42).
- Clarified `portfolioNote` expected success (`CASE_ID` + READY; missing vacío).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged (DEFECT de Idempotency-Key intacto).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` markers | **Unchanged** |
| Tokens de lab fail-closed | **Unchanged** |
| `readiness()` asserts youDo | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 why
- weDo: 24 title (after kind) + 24 preamble + 24 retrospective; 0 residual `S41-T*-E* ·` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: all 24 PASS/assess/decide triples + 8 demo outputs
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. E1 hints remain guided by design; E2/E3 hints still give strong predicates — acceptable for Master tier but may need another fade pass if learners over-rely.
3. Tokens de lab (`RETURN_*`, `THIN_THE_HANDLER`, …) are fail-closed of lab, not production enums — preambles anchor this on E3s; residual risk if learner copies into a real service.
4. Internal id/path `llm-finetuning` / `s41-llm-finetuning.ts` still mismatches FastAPI content — product/orchestrator concern, not exercise prose.
5. T2-B-E2 / T3-A-E2 fixtures remain counterintuitive without the new preambles; Round 2 may verify learner UX in live UI.
6. You Do starter still has DEFECT that ignores Idempotency-Key until the learner fixes it — intentional.

## Files touched
1. `src/lib/course/sections/s41-llm-finetuning.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S41.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 41 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
