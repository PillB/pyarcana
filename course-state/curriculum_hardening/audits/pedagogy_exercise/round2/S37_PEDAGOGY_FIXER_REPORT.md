# S37 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Profiling, algoritmos y rendimiento
- **id:** `dbt-bigquery` (contenido = escala del triage / matching sintético; no dbt/BigQuery de producto)
- **source file:** `src/lib/course/sections/s37-dbt-bigquery.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S37_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only (not rewritten as essay)
- [x] Exact outputs preserved (no code/output edits)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P0 / P1

None (Round-2 report: no missing fields, no wrong≈right integrity gaps).

### P2 — eco feedback/retrospective (rewrite `retrospective`; expand `feedback` where listed)

| Unit | Change |
|------|--------|
| **S37-T1-A-E2** | Retro: CI-light policy + hardcode/peak-outside-work misconception + self-check (wall bajo / peak alto) + bridge E3. |
| **S37-T1-B-E1** | Retro: reproducibilidad del PR + mean de juguete + self-check predicado `med_ms >= 0` + bridge E2. |
| **S37-T1-B-E2** | Retro: `discard_first` como política (no flag cosmético) + self-check `n_runs` + bridge E3. |
| **S37-T2-A-E1** | Retro: fórmula confiable + self-check `n=10` residual de `n*n` + bridge E2. |
| **S37-T2-A-E2** | Feedback reescrito (residual vs reduction vs pair_factor); retro distinta con pregunta de recall S30. |
| **S37-T2-A-E3** | Retro: teatro 1–2 % + hardcode prefer + self-check micro_pairs 400 vs blocked 450. |
| **S37-T2-B-E1** | Retro: documentar structure/scan + self-check found True con lista. |
| **S37-T2-B-E2** | Feedback expandido (pares locales + ética ciudad + no contar Cusco); retro skew Lima sin eco de apertura. |
| **S37-T2-B-E3** | Retro: features O(n²) invierten path + self-check evidencia pairs_after 5 / all 45. |
| **S37-T3-A-E1** | Feedback expandido (ceil vs `//`); retro filas fuera + bridge E2. |
| **S37-T3-A-E2** | Retro reabre con proyección/I/O; conserva self-check `notes`. |
| **S37-T3-A-E3** | Feedback por itemsize; retro overflow/ahorro + self-check `i32==i64` + bridge T3-B. |
| **S37-T3-B-E1** | Feedback expandido (key + silencio del hit); retro colisión cutoff + self-check `len(key)==2`. |
| **S37-T3-B-E2** | Feedback en rango; retro miss como recompute + conserva pregunta scorer v2. |
| **S37-T3-B-E3** | Retro laptop≠bound + self-check max_chunk/size + bridge T4. |
| **S37-T4-A-E1** | Feedback expandido (verde engañoso); retro signo invertido + self-check measured 9/budget 10. |
| **S37-T4-A-E2** | Retro hardcode True + self-check scorer 10→80 + bridge multi-métrica (máximo eco R2). |
| **S37-T4-A-E3** | Feedback multi-métrica; retro all_pass si fallan memory/pairs + bridge T4-B. |
| **S37-T4-B-E1** | Feedback ratio/micro_only; retro after/before 0.25 + self-check 80/20. |
| **S37-T4-B-E2** | Retro regla de gains + self-check micro 0.12 / algo 0.10. |
| **S37-T4-B-E3** | Feedback ligero; retro set de keys del gate CASO-LIM-037 + bridge You Do. |

### P2 — iDo retrospectives cortas (self-check + puente)

| Unit | Change |
|------|--------|
| **S37-T1-B-DEMO** | Warmup/N runs + cold-start flaky self-check + bridge discard_first/proxy. |
| **S37-T2-A-DEMO** | Pares como instrumento + recall S30 + self-check all_p + bridge reduction. |
| **S37-T2-B-DEMO** | Index-first + pares locales Lima + bridge set/count/order. |
| **S37-T3-A-DEMO** | Diseño de memoria + self-check blob en worker + bridge ceil/proyección. |
| **S37-T3-B-DEMO** | Hit/miss diseño + self-check hit_v2 con fs-v1 + bridge key/miss/OOC. |
| **S37-T4-A-DEMO** | Budget versionado + self-check omitir números + bridge pass/fail/3D. |
| **S37-T4-B-DEMO** | Optional polish: self-check pair_factor ≠ reduction (estaba usable A−). |

### Not changed (per report)

- Units scored **A** with no residual required: T1-A-DEMO, T1-A-E1, T1-A-E3, T1-B-E3, youDo frame/code.
- All starter `# DEFECT:` blocks, solution code, and solution outputs.
- Domain remains profiling/escala triage (no rewrite toward dbt/BigQuery product).
- Predicates over exact ms; `reduction` [0,1] kept distinct from `pair_factor` integer.
- Instructions left short where path is local (E1 guided); no bloat.

## Validation notes

- Eco openers (first ~6 words shared feedback/retro): reduced from systematic ~16–18 units to effectively **none** on the priority list after hand rewrite; T2-B-E2 opener de-echoed.
- Feedback units listed as &lt;25 w brought into ~25–40 w range where touched.
- iDo retros on short demos now ~46–61 w with principle + misconception + self-check + We Do bridge.
- Integrity strings still present (`same_result True`, `pairs_after_block 5`, `pair_factor 20`, fail budget `False`, etc.).
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Filename vs content:** `s37-dbt-bigquery.ts` / id `dbt-bigquery` still misnames the section; UI title is correct — out of exercise-pedagogy scope.
2. **Mild length under floor:** a few weDo retros remain ~30–39 w on A/A− units not in the forced eco list (T1-A-E1, T1-A-E3, T1-B-E3); usable; further expansion optional.
3. **You Do starter nearly complete:** defense retrospective already carries metacognition; not converted to blank scaffold.
4. **Working tree may include pre-R2 multi-line prose** from Round-1 field fill relative to last git commit; this report covers Round-2 residual polish applied by hand on the current source.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger proposals. No script manufactured preambles, feedback, or retrospectives. No bulk search-replace of pedagogical prose.

---

Section 37 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
