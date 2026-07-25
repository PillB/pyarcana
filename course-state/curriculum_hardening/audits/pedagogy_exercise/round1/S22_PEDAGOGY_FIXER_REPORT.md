# S22 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Email, identidad y aprobación humana
- **id:** `rapidfuzz-entity`
- **source:** `src/lib/course/sections/s22-rapidfuzz-entity.ts`
- **review input:** `round1/S22_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s22-rapidfuzz-entity.ts` (prose fields + instruction/feedback/why polish).
- **No** generators, bulk templates, or cross-section paste.
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
| S22-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–80 words), `retrospective` |

Focus: árbol MIME mixed+alternative+adjunto → escape/host real anti-XSS → least privilege scopes → adaptador con expiración → verified/rejected/unresolved (match≠fraude) → dedupe+BCC externos → SM HITL con actor → idempotency key 16 hex.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to 25–60 words with corrective reasoning where it was telegraphic

Fade preserved: MIMEText plain → Disposition filename → Content-Type count; escape → saludo → allowlist host; scopes ∩ → isdisjoint → expires_at (token/draft); status vs key → usable → adaptador d001/d002; formato email → dominio C001 → **match_no_es_fraude**; dedupe orden → BCC externo → visibles; submit → invalid approve → apply+actor; key 16 → create idempotente → audit create/retry_hit.

Ethical weight kept on **T3-A-E3** (`fraude_probable` anti-pattern → `match_no_es_fraude`). T2-A-E3 preamble anchors that the same clock applies to token and draft (bridge to T2-B).

### You Do (1)
- Added `retrospective` de defensa/portafolio (gates de prints, real vs. `@example.pe`, frase de impacto medible; puente S23).
- One line on `portfolioNote` for 30-second defense (cero envíos automáticos; 100 % por `pending_review`).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# A corregir:` / `# Contrato:` | **Unchanged** |
| Hash canónico T4-B-E1 `0da400d6c9b3f756` | **Unchanged** |
| Score ético T3-A-E3 `0.86 match_no_es_fraude` | **Unchanged** |
| You Do starter semi-guiado | **Unchanged** (no emptied) |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `0da400d6c9b3f756`, `0.86 match_no_es_fraude`, `text/plain`, `pending_review`, `['create', 'retry_hit']`, `draft-001 draft-001 True False True`, `n_headers_subj 1`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Filename/id `rapidfuzz-entity` vs. email/HITL content remains a curriculum naming lag — not “fixed” toward entity resolution in this round.
3. T4-B-E1 fixture is hash-fragile; do not “improve” the payload without re-executing sha256.
4. You Do cognitive load (MIME + verify + key + submit) remains; retrospective mitigates narrative close only.
5. Ethical note (match ≠ fraude) rests in T3-A demo/E3, theory, self-check, and You Do — keep visible in Round 2.

## Files touched
1. `src/lib/course/sections/s22-rapidfuzz-entity.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S22.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 22 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
