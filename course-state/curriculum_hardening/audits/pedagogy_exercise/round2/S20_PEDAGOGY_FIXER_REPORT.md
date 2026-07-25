# S20 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Automatización robusta de Excel
- **id:** `rag` (archivo `s20-rag.ts`; contenido = excel factory openpyxl / plantillas / conciliación / batch / manifest — **no** RAG)
- **source file:** `src/lib/course/sections/s20-rag.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S20_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual fixes unit-by-unit; no generators, templates, or bulk stamping of pedagogical prose

## Acceptance checklist

- [x] Every unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title` (T3-B-E3 expanded to ≥4 words)
- [x] `instruction` remains task-only (not re-bloated)
- [x] Exact code/solution **outputs preserved** (no output changes)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit`)

## Changes applied

### P1 — T2-A-E3 role separation (strongest eco)

| Unit | Change |
|------|--------|
| **S20-T2-A-E3** | Retrospective rewritten so it no longer opens with the feedback diagnosis (“Si la segunda línea es False…”). Retro now: principle (copy→load→write→save / master intacto), You Do bridge, self-check (“¿qué imprime el starter si out no existe?”), transfer to T2-B. **Feedback kept as-is.** |

### P1 — We Do retrospectives (expand worst + self-check)

| Unit | Change |
|------|--------|
| **S20-T1-A-E1** | Schema Entrada/`region`; self-check si A1 es None. |
| **S20-T1-A-E2** | Error clásico max_row=1; self-check header + 3 regiones. |
| **S20-T1-B-E1** | Distinct from feedback: 0 ≠ fórmula vacía; self-check 15 vs texto fórmula. |
| **S20-T1-B-E2** | + self-check data_only en CI Linux. |
| **S20-T2-A-E1** | Bold no es global; self-check font.bold None. |
| **S20-T2-A-E2** | Fill default ≠ gate; self-check theme color. |
| **S20-T2-B-E1** | String que “se ve” ISO; self-check locale 03/04/24. |
| **S20-T2-B-E2** | Distinct mild eco: automatizar C1 sin mapear ancla; self-check escribir en C1. |
| **S20-T3-A-E1** | No bajar B2/B3; self-check 16 vs 15 con tol. |
| **S20-T3-A-E2** | Mean vs sum + self-check KPI Lima incorrecto. |
| **S20-T3-B-E1** | No improvisar schema a las 23:00; self-check orden expected/got. |
| **S20-T3-B-E2** | Bool silencioso vs violators; self-check ¿Lima en lista? |
| **S20-T4-A-E1** | Contar estado “llamativo”; self-check 3 ok + 1 locked. |
| **S20-T4-A-E2** | Reintento lock vs cuarentena; self-check BadZipFile. |
| **S20-T4-A-E3** | Counter ≠ lista de paths; self-check omitir locked. |
| **S20-T4-B-E1** | 00000000 / idempotent False; self-check sheets + reconcile_ok. |
| **S20-T4-B-E2** | Hash del orden de lectura; self-check Lima/Cusco vs invertido. |

### P1 — I Do thin retrospectives

| Unit | Change |
|------|--------|
| **S20-T1-B-DEMO** | Misconception CI + self-check data_only sin cache. |
| **S20-T2-A-DEMO** | Save in-place; self-check evidencia master intocable. |
| **S20-T2-B-DEMO** | Leer no-ancla; self-check merge B1:D1. |
| **S20-T3-A-DEMO** | Portada optimista; self-check dónde vive reconcile_ok. |
| **S20-T3-B-DEMO** | Arreglar en silencio; self-check abort → manifest. |
| **S20-T4-A-DEMO** | Excepción sin capturar; self-check qué mira el auditor. |
| **S20-T4-B-DEMO** | Hash sin orden canónico; self-check flag master. |

### P2 — Feedback floors, soft hints, title

| Unit | Change |
|------|--------|
| **S20-T1-A-E3** | Feedback + script ajeno del cierre de mes. |
| **S20-T2-B-E1** | Feedback floor: “isoformat de verdad” + laptops del equipo. |
| **S20-T4-A-E1** | Feedback floor: no el número de fallos. |
| **S20-T1-B-E3** | First hint: tipo string + prefijo `=` (no full predicate dump). |
| **S20-T3-A-E3** | First hint: tol PEN 2 decimales, no bit a bit. |
| **S20-T3-B-E3** | Title → `Validar filas y devolver violators`; first hint conceptual (fuera de allowed). |

### Not changed (per report)

- **S20-T1-A-DEMO** — A− floor-pass retro
- **S20-youDo** — A (defense triad intact)
- Units marked “none required” with already-complete roles (e.g. T2-B-E3, T4-B-E3 near-floor but complete)
- **All starter/solution code and canonical outputs**
- T2-B-E2 false-pass note (output still only `None`; no harden without test-policy change)
- Section id `rag` / filename (product/orchestrator decision)
- Theory blocks, selfCheck, portfolio structure

## Validation notes

| Check | Result |
|-------|--------|
| T2-A-E3 feedback vs retro share opening | **No** (eco removed) |
| P1 We Do / I Do retros | ≥40 words (measured); principle + misconception + self-check/transfer |
| Code/solution outputs | Unchanged |
| Title T3-B-E3 | 5 words (`Validar filas y devolver violators`) |
| Soft transfer hints | T1-B-E3, T3-A-E3, T3-B-E3 first hints conceptual |
| `npx tsc --noEmit` | **exit 0** |

## Residual risks (post-fix)

1. **id `rag` vs Excel content** still confuses searchers; out of exercise-prose scope.
2. **T2-B-E2 false-pass:** learner can print C1 without writing B1 and still match `None` — documented; do not change output without orchestrator approval.
3. **Instruction micro-drills** often &lt;40 words with 4 clear steps; not padded into Concepto+fixture essays.
4. **Some non-P1 retros** remain ~28–33w (T1-A-E3, T1-B-E3, T2-B-E3, T3-A-E3, T3-B-E3, T4-B-E3) where Round-2 said optional/none required.
5. **Anti-aberration:** each expanded retro was hand-written per unit against the Round-2 ledger; no template fill of “Principio / Error / Pregunta / Siguiente” stamped across 24 units.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, or retrospectives. No bulk search-replace of pedagogical patterns across sections. Code/outputs untouched. File edits applied unit-by-unit in `s20-rag.ts` only.

---

Section 20 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
