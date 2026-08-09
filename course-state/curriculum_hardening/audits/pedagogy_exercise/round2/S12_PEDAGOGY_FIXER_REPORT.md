# S12 Pedagogy Fixer Report (Round 2)

## Section
- **title:** APIs, SQL y geodatos responsables
- **id:** `performance`
- **source file:** `src/lib/course/sections/s12-performance.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S12_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose + one assert integrity fix; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only where edited
- [x] Exact outputs preserved except T4-B-E2 (assert tightened; solution output unchanged)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — learning integrity

| Unit | Change |
|------|--------|
| **S12-T4-B-E2** | Assert hardened: `abs(d - 111.19) < 1` → `abs(d - 111.19) < 0.05` in starter **and** solution. Preamble éxito now requires print **`111.19`** (not `111.0`); limits note that `*111` fails the assert. Instruction and edgeCases/tests aligned. Retrospective rewritten (no eco with feedback): principio Haversine esférico + misconception del atajo + self-check `round(d, 2)` del starter + puente E3. Solution output still `111.19` / `tolerance_ok`. |

**Execute-and-diff (T4-B-E2):**
- Starter `*111` → print `111.0`, assert **fails** (GOOD).
- Solution Haversine R=6371 → print `111.19`, assert **passes**, `tolerance_ok` (GOOD).

### P2 — feedback ≠ retrospective (hand rewrites)

| Unit | Change |
|------|--------|
| **S12-T1-A-E2** | Retro: whitelist de claves → almacén; error clásico `return payload` post-200; pregunta sobre `extra` en SQLite; puente E3 status→acción. |
| **S12-T2-A-E2** | Retro: hit/miss como contrato mínimo; no cachear 5xx/POST; self-check segundo get a `u1`; puente provenance honesto. |
| **S12-T2-B-E1** | Retro: contract fija schema antes del mapa; misconception `lon=0` silencioso; puente fallback 5xx. |
| **S12-T3-A-E2** | Retro: UPDATE/DELETE con `?` misma disciplina que SELECT; f-string “porque es sintético”; puente join sin C002. |
| **S12-T3-B-E2** | Retro: SELECT confiable solo tras `rollback`; `except: pass` deja C001; self-check starter vs solución; puente índice. |
| **S12-T4-A-E1** | Retro: colapsar espacios sin inventar ubigeo; misconception “normalizar = `.title()`”; self-check capitalización; puente MockGeocoder. |
| **S12-T4-B-E2** | (junto al P1) retro sin eco “test de tolerancia…”. |

### P2 optional (applied)

| Unit | Change |
|------|--------|
| **S12-T2-B-E3** | +1 frase: flag = interruptor del smoke offline del You Do. |
| **S12-T4-B-DEMO** | +1 frase: We Do usa `kinship_verdict`; contrato siempre `None` (sin renombrar outputs del demo). |
| **youDo** | Micro-gancho al final de `context`: responder las 3 preguntas de la retrospectiva y alinear capturas del portfolioNote. |

### Not changed (per report)

- Units scored **A** with no residual proposal (majority of iDo + weDo).
- Política N1 (500 no retry en ejercicios).
- DEFECT de T3-B-E1 (f-string) y T3-B-E2 (`pass` sin rollback) — andamiaje correcto; starter T3-B-E2 sigue con count 1.
- Outputs canónicos de las demás 32 unidades.
- No se borró T2-B-E3 por “delgado”.
- Feedback texts left as immediate corrective reasoning (only retros differentiated where eco was diagnosed).

## Validation notes

- T4-B-E2 integrity trap closed: near-pass del atajo `*111` ya no produce `tolerance_ok`.
- Feedback≠retrospective on the six diagnosed twin pairs + T4-B-E2.
- Optional vocabulary bridge `verdict` / `kinship_verdict` only in T4-B-DEMO retro (no output rename).
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.
- Hand-written only against Round-2 unit ledger.

## Residual risks (post-fix)

- **Hints E1** still near-solution in places (acceptable guided tier); not mass-hardened.
- **You Do** still has many stubs; smoke path + portfolioNote + micro-gancho mitigate; learner must still run discipline.
- **500 vs retry en producción** remains exercise-N1 only; preambles already state contract.
- Mild feedback/retro overlap may remain on **A**-scored units outside the R2 priority list — out of scope.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, or retrospectives. Code change limited to assert threshold + aligned learner-facing success criteria for T4-B-E2.

---

Section 12 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
