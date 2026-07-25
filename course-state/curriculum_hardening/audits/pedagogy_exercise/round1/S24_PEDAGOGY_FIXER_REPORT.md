# S24 Pedagogy Fixer Report (Round 1)

## Section
- **title:** OCR y Document AI
- **id:** `rpa-advanced`
- **source:** `src/lib/course/sections/s24-rpa-advanced.ts`
- **review input:** `round1/S24_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S24
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved all starter `# DEFECT:` bugs, solution code, and exact demo/exercise outputs
- Moved dense “Contexto + Pass” We Do prose into preamble bullets; left instruction as ordered task steps
- Mild feedback enrichment toward HITL / SLO / fail-closed product reasoning (P2)

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (`context` already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; all solution `output` strings unchanged |
| Spanish PE; no real PII | **PASS** — synthetic RUC/montos/fixtures; tú/professional register |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback mildly enriched where thin |
| youDo | 1 | `retrospective` only (no new preamble; `context` remains canonical) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S24-T1-A-DEMO | preamble + retrospective; why on metadata preflight / max DPI / flag auditable |
| S24-T1-B-DEMO | preamble + retrospective; why on max key + OCR-after-orient |
| S24-T2-A-DEMO | preamble + retrospective; why on abstention vs average conf |
| S24-T2-B-DEMO | preamble + retrospective; why on KV unit + strip |
| S24-T3-A-DEMO | preamble + retrospective; why notes len==11 without inventing digits; documents that letters→None is E3/You Do scope |
| S24-T3-B-DEMO | preamble + retrospective; why on review≠fraud |
| S24-T4-A-DEMO | preamble + retrospective; why on field accuracy vs coverage |
| S24-T4-B-DEMO | preamble + retrospective; why on capa 1 mime/size honesty |

### weDo (P0 — all 24)
| Unit | Title |
|------|-------|
| S24-T1-A-E1 | Elevar DPI al piso de calidad 200 |
| S24-T1-A-E2 | Flag deskew con umbral 0.5° |
| S24-T1-A-E3 | preprocess_meta: DPI, deskew y crop |
| S24-T1-B-E1 | Rotación de mayor score (no min) |
| S24-T1-B-E2 | Contar flags de ruido (sum, no len) |
| S24-T1-B-E3 | Preflight: rotación, score y action |
| S24-T2-A-E1 | Filtrar tokens con conf ≥ 0.85 |
| S24-T2-A-E2 | Orden de lectura por bbox (y0, x0) |
| S24-T2-A-E3 | Gate por min conf y lista weak |
| S24-T2-B-E1 | Parse KV con strip en clave y valor |
| S24-T2-B-E2 | Filas de datos sin contar el header |
| S24-T2-B-E3 | Fields KV con bbox del valor |
| S24-T3-A-E1 | Limpiar no-dígitos del RUC parcial |
| S24-T3-A-E2 | Fecha boleta PE a ISO (day-first) |
| S24-T3-A-E3 | Schema PE: RUC 11 y total con coma |
| S24-T3-B-E1 | Mismatch de total → needs_review |
| S24-T3-B-E2 | Acumular reason ruc_missing |
| S24-T3-B-E3 | validate dual y política review_not_fraud |
| S24-T4-A-E1 | Accuracy = correct / n (no error rate) |
| S24-T4-A-E2 | Accuracy de RUC sobre filas del golden |
| S24-T4-A-E3 | Par acc_ruc y coverage_auto |
| S24-T4-B-E1 | Rechazar mime zip en el gate |
| S24-T4-B-E2 | Rechazar archivo sobre el tope 5e6 |
| S24-T4-B-E3 | Gate mime/size y fallback human_rescan |

All 24 received the same field shell: title, preamble (context/goal/success/constraints), ordered instruction steps, retrospective (principle + misconception + transfer/self-check). Feedback extended toward product reasoning (HITL, SLO RUC, fail-closed) without spoiling solutions.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Intake OCR sintético (document intake CP-N2-C) | `retrospective` defense prompts: invariante medible, PII sintético vs real, frase de impacto en README |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter DEFECT renames or logic changes
- tests/hints/edgeCases left intact (hints already strong; optional E3 miga trim deferred to Round 2 if needed)
- T3-A demo still does not model letters→None (scope note in preamble/why; E3 + You Do own that policy)

## Residual risks for Round 2
- Volume of new prose may still need length trim if UI feels heavy (preambles target 80–150 words / 4 bullets)
- E3 hints remain fairly complete (transfer scaffolding); optional one-miga fade without breaking pass rate
- Fraud policy is now closed metacognitively; Round 2 should verify learner still cannot confuse `needs_review` with fraud labels after reading retros
- Capa 1 gate honesty (mime spoofable) must stay visible so learners do not treat allowlist as antivirus

## Summary
Round-1 Fix for S24 fills Gradual Release verbal scaffolding (preamble → task → retrospective) without rewriting the mature code/starter/solution layer of the document intake CP-N2-C track.

---

Section 24 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
