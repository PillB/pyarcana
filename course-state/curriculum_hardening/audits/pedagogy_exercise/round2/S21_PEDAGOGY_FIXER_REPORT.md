# S21 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Documentos, plantillas y reportes trazables
- **id:** `fastapi` (archivo histórico `s21-fastapi.ts`; contenido = Reporting Factory, no APIs HTTP)
- **source file:** `src/lib/course/sections/s21-fastapi.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S21_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title` (T4-B-E3 expanded to ≥4 words)
- [x] `instruction` remains task-only where edited
- [x] Exact outputs preserved (no execute-and-diff needed)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — metacognition + deliberate-practice integrity

| Unit | Change |
|------|--------|
| **S21-T1-A-E1** | Expanded retrospective: misconception f-string fuera de Jinja + self-check sobre n en portada. |
| **S21-T1-A-E3** | Expanded retrospective: hardcode Cusco vs reutilizar dict + self-check + puente T1-B. |
| **S21-T1-B-E1** | Expanded retrospective: relleno con cero + self-check sobre `"None"` como texto. |
| **S21-T1-B-E2** | Split feedback/retro eco: feedback = síntoma 28.456/28.5; retro = rastro re-ejecutable + 2 vs 1 decimal + self-check hardcode `"28.46"`. |
| **S21-T1-B-E3** | Expanded retrospective: escala a 10 filas sin editar template a mano. |
| **S21-T2-A-E1** | Expanded retrospective: outline primero + self-check `add_paragraph("Resumen")` vs revisor. |
| **S21-T2-A-E2** | Feedback = conteo 0 → sigue `add_paragraph`; retro = negrita ≠ Heading + self-check conteo H1. |
| **S21-T2-B-E1** | Expanded retrospective: capa antes de `save()` + self-check hardcode `print(True)`. |
| **S21-T2-B-E2** | Split high eco: feedback = PNG/`st_size`; retro = dos pruebas distintas + self-check PNG 0 bytes. |
| **S21-T2-B-E3** | Enriched feedback (PNG dibujado ≠ capa digital); retro kept (self-check already strong). |
| **S21-T3-A-E1** | Expanded retrospective: factory no aprueba pricing + self-check riesgo comité. |
| **S21-T3-A-E2** | Expanded retrospective: self-check `pen` minúscula vs `PEN`. |
| **S21-T3-A-E3** | Feedback = claves ordenadas sin `metodo`; retro = tres claves + self-check dónde va recomendación. |
| **S21-T3-B-E1** | Split eco “Paridad sin límites”: feedback = 27.0 / `"solo web"`; retro = cobertura visible + self-check. |
| **S21-T3-B-E2** | Expanded retrospective: self-check n=40 sin Fuente. |
| **S21-T3-B-E3** | Softened hints (no `return a == b == c`); feedback = segundo print True con doc divergente; retro + self-check reporte de discrepancia. |
| **S21-T4-A-E1** | Feedback = round 0 “de casualidad”; retro = contrato 1 decimal + self-check 28.04. |
| **S21-T4-A-E2** | Expanded thinnest We Do retro: error clásico número/unidad + self-check fmt_pen. Feedback = falta ` PEN`. |
| **S21-T4-A-E3** | Softened hints (no full formula); retro = `len(alts) > 0` + self-check tercer print. |
| **S21-T4-B-E1** | Expanded retrospective: `approved` = fraude de proceso + self-check dict incompleto. |
| **S21-T4-B-E2** | Split near-verbatim eco: feedback = slice `[:8]` + payload `synthetic`/`385fcd67`; retro = id lab vs SHA-256 + self-check huella vs run_id. |
| **S21-T4-B-E3** | Title → `ready con all sobre la checklist`; softened hints (no `all(checklist.values())`); fb/retro left (already distinct). |

### P2 — iDo retrospectives + polish

| Unit | Change |
|------|--------|
| **S21-T1-B-DEMO** | Retro: engaño 0.00 + self-check total Cusco. |
| **S21-T2-A-DEMO** | Retro: “mi Word” no es audit + self-check `Normal`+negrita. |
| **S21-T2-B-DEMO** | Retro: PNG ≠ digital + self-check manifiesto con solo PNG. |
| **S21-T3-A-DEMO** | Retro: “subir precios” hallazgo vs decisión. |
| **S21-T3-B-DEMO** | Retro (thinnest iDo): paridad ≠ “se ve similar” + self-check doc diverge. |
| **S21-T4-A-DEMO** | Retro: `all([])` + self-check `28` vs `28.0`. |
| **S21-T4-B-DEMO** | Retro: script no se autoaprueba + self-check quién pone `approved`. |

### Not changed (per report)

- **S21-T1-A-DEMO**, **S21-T1-A-E2**, **S21-T2-A-E3**, **youDo** — residual none required.
- All **starterCode** defects, **solutionCode**, and **canonical outputs** (incl. `385fcd67`, ASCII `sintetico` on canvas, em-dash `—`).
- Historical section id `fastapi` / filename `s21-fastapi.ts`.
- We Do preambles (4-bullet structure already passed).

## Validation notes

- Spoiling transfer hints removed from learner-facing `hints`/`hint` on **T3-B-E3**, **T4-A-E3**, **T4-B-E3** (no full `return` expression).
- Worst feedback↔retro clones broken: **T4-B-E2**, **T2-B-E2**, **T3-B-E1**, **T1-B-E2**.
- Role split held: feedback = symptom/now; retrospective = principle + misconception + self-check + bridge.
- Title **T4-B-E3** now ≥4 words.
- Code/outputs unchanged; typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Historical id `fastapi`:** still confuses API seekers; do not rename without migration plan.
2. **ASCII `sintetico` on ReportLab canvas:** intentional; do not “fix” tildes in PDF lab demos.
3. **Em-dash `—`:** lab contract; do not normalize to ASCII hyphen in tables/prose.
4. **Mild fb/retro overlap** may remain on units not flagged P1; out of Round-2 required scope.
5. **E1/E2 hints** still near-complete by design (guided fade); only E3 transfer spoiling was softened.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger proposals. No script manufactured preambles, feedback, or retrospectives. No bulk search-replace of pedagogical prose across units.

---

Section 21 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
