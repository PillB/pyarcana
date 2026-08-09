# S33 Pedagogy Fixer Report (Round 2)

## Section
- **title:** ML supervisado y baselines responsables
- **id:** `advanced-models`
- **source:** `src/lib/course/sections/s33-advanced-models.ts`
- **Round-2 review:** `round2/S33_EXERCISE_PEDAGOGY_REPORT.md`
- **Method:** hand edits only; no generators, bulk templates, or scripts for prose

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (already present; residual polish applied)
- [x] We Do has short `title`
- [x] `instruction` is task-only (not rewritten; already steps-only)
- [x] Exact outputs preserved (no code/output changes)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P0 / P1
None required by Round-2 review. Field coverage, integrity wrong≠right, and E1→E3 fade already solid.

### P2 — iDo retrospectives expanded (self-check + transfer)

| Unit | Retro focus after fix |
|------|------------------------|
| **T1-B-DEMO** | Dual baseline calculado; self-check «regla 1.0 → ¿qué valor incremental del ML?» |
| **T2-A-DEMO** | L2 se declara, no se prueba con Σw²; self-check thr 0.5 vs 0.6 con p≈0.55 |
| **T2-B-DEMO** | Ranking con escala + sin causal; self-check `amount` en soles sin z-score |
| **T3-A-DEMO** | Depth como producto; self-check majority=1 con depth libre |
| **T4-A-DEMO** | Derrota logueada = evidencia; self-check «¿basta ganar al dummy si la regla ya es 1.0?» |
| **T4-B-DEMO** | Disyunción por entidad; self-check e1 en train y valid del mismo fold |

**T3-B-DEMO** left as-is (already A; case-controlado vs demo overfit closed in R1).

### P2 — weDo feedback/retro de-echo + length

Feedback kept as *why the starter/assess failed + operational impact*. Retrospective rewritten or expanded to *principle + distinct misconception + self-check + transfer*:

| Unit | Change |
|------|--------|
| **T1-A-E2** | Feedback: prevalencia 0.25 calculada + assess del adverso. Retro: hardcode 0.25 esconde desbalance del lote; self-check prevalencia 0.05 |
| **T1-A-E3** | Feedback: REQUEST/REJECT + no default de horizon. Retro: ops de riesgo pide evidencia; self-check fraud+horizon inventado a la vez → You Do |
| **T2-A-E2** | Feedback: penalty l2 en params; l2_sq no prueba. Retro: contrato de entrenamiento + self-check C/λ |
| **T2-A-E3** | Feedback expandido (sigmoid [0,1] + REQUEST no CONTINUE). Retro ya tenía self-check C/λ |
| **T2-B-E2** | Retro: overclaim scaled/causal; self-check shared_phone top con causal=True en mesa Lima |
| **T2-B-E3** | Feedback: missing scaled → REQUEST, no inventar True |
| **T3-A-E2** | Feedback: max_depth libre vs dummy. Retro: train 0.99 / valid 0.60 → qué comparar antes de promocionar |
| **T3-B-E2** | Feedback: seed no perdona gap. Retro: gap 0.39 overfit; self-check métrica valid en el log del PR |
| **T4-A-E2** | Retro: gate mira completitud del log, no signo de beats; self-check assess con beats False + metrics llenas |
| **T4-A-E3** | Feedback: win y lose ante dummy 0.667; gate anti-ML. Retro: historial honesto; self-check beats_rule + costo → You Do |
| **T4-B-E1** | Retro: tres chequeos + hardcode disjoint; self-check round a 2 «funciona» por casualidad |
| **T4-B-E2** | Feedback: cálculos vs dict. Retro: n_groups/mean calculados; self-check entities e1,e1 + random_split |
| **T4-B-E3** | Feedback: no inventar split. Retro: sin ids no hay group CV; self-check isdisjoint e1 en ambos folds → You Do |

### Not changed (by design)

- **Code / starter / solution outputs:** all canonical fixtures and asserts intact (CASO-LIM-033).
- **youDo:** already A (§8.3 defensa); thr=0.9 intentional defect left alone.
- **Units scored A with no residual:** T1-A-DEMO, T1-A-E1, T1-B-E1, T1-B-E2, T1-B-E3, T2-A-E1, T2-B-E1 (optional length only), T3-A-E1, T3-A-E3, T3-B-DEMO, T3-B-E1, T3-B-E3, T4-A-E1.
- **Instruction length (25–39 w on some E2/E3):** left as task steps; not bulk-rewritten.
- **Fade E1→E2→E3:** already differentiated surfaces; expansions do not clone prompts.

## Residual risks (post-fix)

1. **Vocabulario técnico** (`beats_dummy`, `l2_sq`, group CV): correcto para nivel Competente a experto; preambles anclan en cola de revisión.
2. **You Do thr abierto:** sin test de thr óptimo; rubric + retrospective empujan beats_rule y comparación honesta.
3. **Longitud vs anti-bloat:** retros ahora en rango usable con self-check; no se expandieron preambles a ensayos.
4. **S33 gold-tone de código:** fixtures/outputs intactos — sin regresión de asserts.

## Delta vs Round-2 review

| R2 residual | Status |
|-------------|--------|
| P0/P1 | N/A (ninguno) |
| P2 eco feedback/retro (lista #1) | **Closed** |
| P2 feedback &lt;25 w (unidades tocadas) | **Closed** |
| P2 iDo retros cortas (6 DEMOs) | **Closed** |
| P2 weDo retros muy cortas (T2-A-E2, T3-B-E2, T4-B-E1, T4-A-E2) | **Closed** |
| Instruction length optional | Left (legible steps) |
| youDo optional thr note | Left (already in starter comments) |

Section 33 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
