# S05 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Funciones, contratos y descomposición
- **id:** `oop` (archivo histórico `s05-oop.ts`; contenido = funciones puras / contratos)
- **source file:** `src/lib/course/sections/s05-oop.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S05_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only where edited
- [x] Exact outputs preserved (no execute-and-diff needed)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — learning integrity (fade / no-clon / éxito exacto)

| Unit | Change |
|------|--------|
| **S05-T2-A-E1** | Retrospective reescrita: revisor/`help()` no leen `#`; self-check con `print(...__doc__)`. Feedback se mantiene (síntoma `None`). |
| **S05-T2-A-E3** | Retrospective reescrita: assert de forma mantiene post viva; no borrar assert; puente a T2-B. Ya no clona “expected a propósito”. |
| **S05-T2-B-E2** | Retrospective reescrita: triage forma vs dominio; self-check sobre `0`. Feedback se mantiene. |
| **S05-T2-B-E3** | Preamble con éxito exacto de tres líneas canónicas. Retrospective reescrita: tests del core vs `try` en pure core. |
| **S05-T4-B-E2** | Retrospective reescrita: rojo tras embellecer / no bajar expected a lower. Solution re-asserta idempotencia post-refactor (output `JR 2` intacto). |
| **S05-T3-A-E3** | Retrospective reescrita: misma salida/diseño distinto; transfer You Do cuatro campos + S08/S10. |
| **S05-T1-A-E2** | Hints E2 sin one-liner: pregunta al I Do + prueba mental QUISPE/hueco doble. Retro ampliada (matching + orquestador). |
| **S05-T1-B-E2** | Hints E2 sin `if bucket is None: bucket = []` literal; centinela + no compartir objeto. Retro con síntoma de lote contaminado. |
| **S05-T2-A-E2** | Éxito exacto `err email sin @`. Hints sin pegar `if '@' not in s`. Retro ampliada (mensajes legibles). |
| **S05-T3-A-E2** | Hints E2 sin pegar el `return` del dict; pregunta a helpers + email crudo miente al gate. |

### P2 — polish (longitud / claridad / fade)

| Unit | Change |
|------|--------|
| **S05-T1-B-DEMO** | Retro ampliada: objeto vivo + `None` local; no copiar lista en el caller. |
| **S05-T2-A-DEMO** | `why` y retro ampliados (contrato de negocio; olvidar el `raise`). |
| **S05-T2-B-DEMO** | `why` y retro ampliados (raise vs tupla; hint que miente). |
| **S05-T3-A-DEMO** | `why` ampliado (revisor CP-N1-B). |
| **S05-T3-B-DEMO** | Retro: “estable” no basta si falla política de dígitos. |
| **S05-T4-A-DEMO** | Retro: cada factory cierra su `prefix`; error de global mutable. |
| **S05-T4-B-DEMO** | Retro: asserts deben gritar si upper → lower. |
| **S05-T1-A-E1** | Instruction más clara (print vs return); self-check del retro afinado. |
| **S05-T1-A-E3** | Retro diferenciada del feedback (no imprimir más; devolver). |
| **S05-T1-B-E1** | Instruction con líneas exactas de éxito. |
| **S05-T1-B-E3** | Retro: si quitas `*`, posicional silencia el flag. |
| **S05-T3-A-E1** | Hints E1 sin one-liner total (identidad del helper + componer title). |
| **S05-T3-B-E2** | Preamble e instruction ampliadas (éxito exacto + pasos). |
| **S05-T3-B-E3** | Title a 5 palabras: “Inyectar el normalizador en process”. |
| **S05-T4-A-E1** | Retro con self-check LEGB. |
| **S05-T4-A-E3** | Retro: convivir policies sin `mode` global; agregar mode sin reescribir callers. |
| **S05-T4-B-E3** | Instruction menos telegráfica (got/assert/PASS/cierre). |

### Not changed (per report)

- **ok units:** T1-A-DEMO, T1-B-E3 (salvo micro-frase), T2-B-E1, T3-B-E1, T4-A-E2, T4-B-E1, **youDo**.
- Outputs canónicos de soluciones (incl. `hint no valida en runtime`, espacios en `PASS   a  b  `, mensajes de dominio).
- Starters `# FALLO:` y defectos de código.
- Clave `nombres` en You Do (coherente con starter).

## Validation notes

- Outputs de `solutionCode` no se alteraron; único cambio de código: assert de idempotencia extra en T4-B-E2 post-refactor (sin print adicional).
- Feedback se reescribió solo donde el reporte pedía mantenerlo; las reescrituras de retrospective usan ángulo distinto (self-check, transfer, misconception).
- Hints E1 siguen más directos donde el reporte lo permitía; spoiling de E2 se suavizó en los cuatro P1 nombrados.
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Piso de palabras en viñetas:** preambles We Do en 4 bullets siguen ~40–60 palabras totales; permitido por “4 short bullets” del spec.
2. **Hints E1** (p. ej. T1-A-E1 one-liner, T4-B-E1 assert): aceptables en guiado; no suavizar más.
3. **Solapamiento leve feedback/retro** puede quedar en unidades no listadas como P1 (p. ej. T1-B-E3 keyword-only); residual menor.
4. **Outputs frágiles** siguen canónicos: no “limpiar” copy de salida en futuros pases.
5. **Nombre de archivo `s05-oop.ts` / id `oop`:** fuera de alcance de prosa.
6. **Sin re-ejecución Pyodide:** se asume `solutionCode.output` del fuente.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, hints, or retrospectives. No bulk search-replace of pedagogical patterns across units.

---

Section 5 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
