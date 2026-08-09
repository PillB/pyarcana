# S16 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Calidad, limpieza y contratos de datos
- **id:** `wxpython-gui` (archivo histórico `s16-wxpython-gui.ts`; contenido = quality gate pandas)
- **source file:** `src/lib/course/sections/s16-wxpython-gui.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S16_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only (not re-bloated with pass criteria)
- [x] Exact outputs preserved (no execute-and-diff needed)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — integrity / metacognition

| Unit | Change |
|------|--------|
| **S16-T2-A-DEMO** | `why`: reemplazado `` inventaría `` por **marca todas las filas** del grupo exacto. Retro ampliada con self-check sobre evidencia de C002. |
| **S16-T1-B-E1** | Retrospective reescrita: no clona el feedback del orden; ángulo evidencia inventada + self-check del auditor sobre `was_null`. |
| **S16-T3-B-E1** | Retrospective reescrita: domain vs IQR (no solo “máscara invertida”); self-check de por qué el lab prohíbe IQR. |
| **S16-T4-A-E1** | Retrospective ampliada: drift legible para el operador (nombres, no KeyError); self-check de qué columna falta y por qué `id` no. |

### P2 — I Do thin retros / prose

| Unit | Change |
|------|--------|
| **S16-T1-B-DEMO** | Retro: self-check de fila `was_null` True y marca *antes* del fill. |
| **S16-T2-B-DEMO** | Retro: eliminado “lens”; `conteos (len)` + self-check de por qué quarantine guarda *ambas* filas de C001. |
| **S16-T3-A-DEMO** | Retro: ejemplo `3,00`→300 + self-check de KPI de ticket. |
| **S16-T3-B-DEMO** | Retro: self-check de prioridad domain vs IQR. |
| **S16-T4-A-DEMO** | Retro: self-check `missing=[]` y aun así hay fallo cross-field. |
| **S16-T4-B-DEMO** | Retro: métricas operables + self-check del evento *antes* de quarantine. |

### P2 — We Do thin retros / feedback

| Unit | Change |
|------|--------|
| **S16-T1-A-E1** | Feedback (+1 frase auditor); retro con self-check `n=1` vs 2. |
| **S16-T1-A-E2** | Retro: self-check de por qué `b` no entra al mapa. |
| **S16-T1-A-E3** | Retro: self-check si `id` no tuviera nulls. |
| **S16-T1-B-E2** | Retro: self-check rate 0.5 / umbral 0.3 y qué *no* hacer con fillna. |
| **S16-T1-B-E3** | Feedback: mediana pre-fill + no recalcular post-fill (piso de razonamiento KPI). |
| **S16-T2-A-E1** | Retro: inventario vs drop; self-check filas del auditor. |
| **S16-T2-A-E2** | Retro: self-check de por qué C002 no es conflicto. |
| **S16-T2-A-E3** | Retro: self-check score idéntico / region distinta. |
| **S16-T2-B-E1** | Feedback **accuracy**: ya no dice `clean_n=1` con keep last; modos de fallo alineados al fixture (`0` hard-coded / sin `q`). Retro con self-check len(q)/len(c)=2. |
| **S16-T2-B-E2** | Feedback: batch/origen y reconstrucción de versión. |
| **S16-T2-B-E3** | Retro: self-check join one-to-one en S17. |
| **S16-T3-A-E1** | Retro: canonicidad + self-check buckets falsos. |
| **S16-T3-A-E2** | Retro: self-check decimal latino vs miles. |
| **S16-T3-A-E3** | Retro: self-check defensa del raw ante auditoría. |
| **S16-T3-B-E2** | Retro: bilateral + self-check −50. |
| **S16-T3-B-E3** | Retro: self-check etiqueta ganadora domain+IQR. |
| **S16-T4-A-E2** | Retro: self-check fila 0 con fin>inicio. |
| **S16-T4-A-E3** | Retro: self-check etiqueta si missing no vacío. |
| **S16-T4-B-E1** | Retro: self-check rows_clean=7 y pass false. |
| **S16-T4-B-E2** | Retro: self-check `audit[0]` = start. |
| **S16-T4-B-E3** | Feedback: semáforo del job; retro con self-check pass vs quarantine. |

### Not changed (per report)

- **S16-T1-A-DEMO** (Strong; none required)
- **youDo** (Strong defensa; no residual)
- Starters, `solutionCode`, exact `output` strings, theory blocks, selfCheck quiz
- Section id / filename rename (orchestrator-only)
- I Do preambles 51–60 w (P2 non-blocking; budget used on retros/feedback)

## Validation notes

- Outputs de `solutionCode` e iDo **no se alteraron**.
- Feedback y retrospective se separaron en los pares P1 (T1-B-E1, T3-B-E1, T4-A-E1): feedback = síntoma correctivo; retro = principio + misconception + transfer + self-check.
- Prose defects `inventaría` y `lens` verificados ausentes en el fuente post-fix.
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Piso de palabras en viñetas:** preambles We Do en 4 bullets siguen ~40–60 palabras totales; permitido por “4 short bullets” del spec.
2. **Algunas retros ~36–39 w** (p. ej. T1-B-E3, T2-B-E2 Adequate) no se rellenaron con sinónimos; anti-bloat preferido sobre synonym soup.
3. **Hints E1** siguen near-complete (aceptable en guided); no promovidos a preamble/instruction.
4. **Oracle T3-B-E2** solo ejercita upper fence; feedback bilateral intacto; fixture no tocado.
5. **Filename `s16-wxpython-gui.ts` / id `wxpython-gui`:** fuera de alcance de prosa.
6. **Sin re-ejecución Pyodide:** se asume `solutionCode.output` del fuente.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, hints, or retrospectives. No bulk search-replace of pedagogical patterns across units (each unit string edited with its own proposed text).

---

Section 16 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
