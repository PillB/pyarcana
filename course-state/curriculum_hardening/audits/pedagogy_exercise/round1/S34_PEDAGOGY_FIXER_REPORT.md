# S34 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Métricas, desbalance, calibración y umbrales
- **id:** `cv-ai-integration`
- **source:** `src/lib/course/sections/s34-cv-ai-integration.ts`
- **review input:** `round1/S34_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S34
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved all starter DEFECT markers, solution code, and exact demo/exercise outputs
- Scene differentiated per subtopic (confusión → top-k → CV-safe → prevalencia → Brier → holdout → thr → abstain); E1/E2/E3 fade kept in prose tone

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff needed; all PASS / CONTINUE REJECT_* REQUEST_* outputs intact |
| Spanish PE; no real PII | **PASS** — CASO-LIM-034 sintético; score ≠ fraude; tú/professional register |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback polished with named misconception where thin |
| youDo | 1 | `retrospective` only (no new preamble; `context` remains canonical) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S34-T1-A-DEMO | preamble (decisión vs ranking) + why↑ + retrospective (F1 ≠ P+R) |
| S34-T1-B-DEMO | preamble (k = capacidad) + why↑ + retrospective (no dividir recall entre k) |
| S34-T2-A-DEMO | preamble (dos cajas train/test) + why↑ + retrospective (CV-safe) |
| S34-T2-B-DEMO | preamble (base rate en voz alta) + why↑ + retrospective (all-neg trap) |
| S34-T3-A-DEMO | preamble (score ≠ culpa) + why↑ + retrospective (no un solo punto) |
| S34-T3-B-DEMO | preamble (holdout_v1 vs test) + why↑ + retrospective (clip ≠ cal) |
| S34-T4-A-DEMO | preamble (no memorices 0.6) + why↑ + retrospective (thr versionado) |
| S34-T4-B-DEMO | preamble (zona gris = 1ª clase) + why↑ + retrospective (force_label) |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S34-T1-A-E1 | F1 armónica y TN contado |
| S34-T1-B-E1 | recall@k divide entre n_pos |
| S34-T2-A-E1 | Plan CV-safe: not resample_global |
| S34-T2-B-E1 | Prevalencia baja: accuracy no basta |
| S34-T3-A-E1 | Brier medio del set, no de un punto |
| S34-T3-B-E1 | Mapa afín en holdout (no solo clip) |
| S34-T4-A-E1 | Búsqueda de thr por costo y capacidad |
| S34-T4-B-E1 | Banda gris: devolver abstain |

### weDo E2/E3 (P0)
All 16 remaining We Do units received the same field shell: title, preamble (context/goal/success/constraints), ordered instruction steps, retrospective (principle + misconception + transfer). Feedback sentences tightened to 25–60 words with named misconception without spoiling the next tier.

| Unit | Title |
|------|-------|
| S34-T1-A-E2 | Assess: counts honestos vs accuracy sola |
| S34-T1-A-E3 | Fail-closed: REQUEST_CONFUSION |
| S34-T1-B-E2 | Assess: load vs capacity |
| S34-T1-B-E3 | Fail-closed: REQUEST_CAPACITY |
| S34-T2-A-E2 | Assess: sin resample global |
| S34-T2-A-E3 | Fail-closed: REQUEST_WEIGHTS |
| S34-T2-B-E2 | Assess: base rate honesta |
| S34-T2-B-E3 | Fail-closed: REQUEST_BASE_RATE |
| S34-T3-A-E2 | Assess: Brier y bin alineados |
| S34-T3-A-E3 | Fail-closed: REQUEST_BRIER |
| S34-T3-B-E2 | Assess: calibrator_set holdout |
| S34-T3-B-E3 | Fail-closed: REQUEST_CAL_SET |
| S34-T4-A-E2 | Assess: thr-v* con cost documentado |
| S34-T4-A-E3 | Fail-closed: REQUEST_COST_MATRIX |
| S34-T4-B-E2 | Assess: abstain en banda documentada |
| S34-T4-B-E3 | Fail-closed: REQUEST_ABSTAIN_BAND |

### youDo (P1)
| Unit | Changes |
|------|---------|
| Workbench: métricas + thr + abstain (CP-N3-B) | `retrospective` defense prompts (thr hallado ≠ 0.6 demo, Brier, abstain 0.55, puente S35) |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** fixture changes (`CASO-LIM-034-*`, DEFECT comments, thr 0.6 demo vs thr ~0.9 You Do)
- Starter blanks, tests, edgeCases, and asserts unchanged

## Residual risks for Round 2
- Volume of new prose may still need length trim if UI feels heavy (preambles target 80–150 words / 4 bullets)
- Optional: expand T4-B-E2 adverse case for `decision=skip` in band (noted in review; not code-changed)
- Learner who skims only titles may still feel E2/E3 pattern repetition — scenes are differentiated but structure is intentional gradual-release tiers
- Thr 0.6 vs 0.9 risk mitigated in T4-A-DEMO preamble and existing You Do context; Round 2 can re-check wording if You Do fail rate stays high

## Closer
Section 34 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
