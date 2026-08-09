# S02 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Valores, tipos, operadores e I/O
- **id:** `basics`
- **index:** 2
- **source:** `src/lib/course/sections/s02-basics.ts`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 `S02_EXERCISE_PEDAGOGY_REPORT.md`.
- Hand-tightened residual depth on `why`, `retrospective`, and `feedback` (plus two instructions, one preamble pin, one starter comment, one youDo context sentence).
- No generators, no bulk prose paste, no opportunistic code rewrites.
- Preserved all starter/solution code and exact outputs (float garbage, Decimal asserts, suite prints).
- Measurement-only coverage scan + `tsc --noEmit` exit 0.

## Acceptance checklist (§11 + R2 handoff)

- [x] No unit stripped of `preamble` + `retrospective` (8 iDo + 24 weDo + youDo retrospective)
- [x] All **P1** items addressed with hand-written quality (or equivalent)
- [x] Thin **feedback** / **retrospective** / iDo **why** expanded toward spec bands without essay bloat
- [x] De-duplicated feedback vs retrospective where noted (T1-B-E1, T2-B-E3)
- [x] T4-B-E3: schema key breadcrumbs in instruction + starter comment; assert suite untouched
- [x] Exact outputs preserved (float demos, `safe_int` messages, Decimal asserts)
- [x] Spanish PE; synthetic data only
- [x] No generators / bulk manufacture of educational prose
- [x] Section source typechecks (`tsc --noEmit` OK)

## P1 implementations

| Unit | Change |
|------|--------|
| **S02-T3-B-DEMO** | Expanded `why` (binary float lie, construct from `str`, `quantize` + HALF_EVEN as Perú money contract). Expanded `retrospective` with self-check on `0.1+0.2`. |
| **S02-T4-A-DEMO** | Expanded `why` (simulate `input` for Pyodide/CI; `:.2f` on Decimal without `float`; capture/parse/format split). Expanded `retrospective` (tests independent of keyboard; classic `float(monto)` error). |
| **S02-T1-B-E2** | Feedback now explains empty vs garbage as distinct errors + field naming; retrospective names three branches + `!r` reuse. |
| **S02-T2-A-E1** | Feedback ties success to five names without `NameError` + `EDAD_MAXIMA` intent; retrospective adds classic “renamed in head, not in print” misconception. |
| **S02-T4-B-E3** | Instruction names schema keys (`*_raw`, limpios, `edad`, `errors`); starter comment lists full key set; retrospective keeps You Do differentiators (fourth blank-age case, `mostrar_resumen`/`main`). |

## P2 polish (by hand)

### I Do
| Unit | Change |
|------|--------|
| T1-A-DEMO | `why` no longer echoes preamble; technical only (`type.__name__`, phone as `str`, `42 == "42"`). |
| T1-B-DEMO | Retrospective + self-check: three `safe_int` outcomes without looking at code. |
| T2-A-DEMO | Retrospective expanded to ~50 words (principle + SyntaxError + CamelCase/`if x=1` + We Do bridge). |
| T2-B-DEMO | `why` + one sentence: lists are mutability preview; intake audit is `*_raw` keys. |
| T3-A-DEMO | `why` focused on parens in review + float as expression practice only. |
| T4-B-DEMO | `why` technical schema only (keys, `clean_required`, optional `safe_int`) — not a second watch-list. |

### We Do feedback / retrospectives
| Unit | Change |
|------|--------|
| T1-A-E1 | Feedback reasoning (`NoneType`/`bool`/`repr`); retrospective + autochequeo. |
| T1-A-E2 | Feedback nudged into ~35-word band (tipo before compare). |
| T1-A-E3 | Feedback: phone as `str` semantics → You Do schema. |
| T1-B-E1 | De-dupe: feedback = order limpiar→construir; retrospective = classic empty-after-convert. |
| T1-B-E3 | Feedback + “no pises `raw` al fallar clean”. |
| T2-A-E2 | Retrospective expands `=`/`==`/SyntaxError + style vs bug; feedback mentions truthiness style. |
| T2-A-E3 | Preamble **Éxito** pins `contacto` / `direccion`; instruction + hint align for fair solution compare. |
| T2-B-E1 | Feedback: identity vs value with expected bool table. |
| T2-B-E2 | Feedback length/reasoning on copy independence. |
| T2-B-E3 | De-dupe: feedback on post-`.upper()` audit (not clone of retrospective). |
| T3-A-E1 | Feedback with exact `n=17,d=5` results + `/` is float. |
| T3-A-E2 | Retrospective expands unary-`**` misconception. |
| T3-A-E3 | Feedback + retrospective self-check: why not `round` the float garbage. |
| T3-B-E1 | Retrospective: `Decimal(0.1)` reintroduces binary error. |
| T3-B-E2 | Feedback: exact `8.55`/`94.05` + quantize both steps. |
| T3-B-E3 | Instruction one-line pipeline: strip → vacío → Decimal → quantize → InvalidOperation. |
| T4-A-E1 | Retrospective + autochequeo missing `f`. |
| T4-A-E2 | Retrospective: no `float` for format; classic `str(monto)`. |
| T4-A-E3 | Feedback notes `types["edad"]=="str"`. |
| T4-B-E1 | Retrospective: raw+`!r`; classic erase-original. |
| T4-B-E2 | Instruction restates task success; feedback ñ intact without encode/decode. |

### You Do
- **context:** one closing sentence on operational success (`_run_tests()` → `tests OK`, `main()` demo summary; asserts fixed).

### OK (left alone as review requested)
- S02-T2-B-E2 core framing (minor feedback only)
- S02-T1-B-E3 core (light feedback only)
- S02-T3-A-E3 float garbage **kept**
- S02-T4-A-E3 framing (light feedback only)
- Working preambles/titles not rewritten for style alone

## Output integrity spot-check (PASS)

- `42 == '42' → False`
- `0.30000000000000004` / Decimal `0.3` / `118.00`
- T3-A-E3 float garbage `94.39999999999999` **kept**
- `safe_int` branch messages unchanged
- `Hola, José. Bienvenido al intake.` · `monto: S/ 99.50` · `3 tests OK` · `Unicode OK` · `tests OK`

## Field coverage (measurement-only)

| Field | Count | Expected |
|-------|------:|----------|
| `preamble` | 32 | 8 iDo + 24 weDo |
| `retrospective` | 33 | 8 iDo + 24 weDo + 1 youDo |
| `why` | 8 | all iDo |
| `feedback` | 24 | all weDo |

## Residual risks (post–Round 2)

1. Feedback still appears after “Ver solución” in UI — success criteria remain in preambles (by design).
2. T4-B-E3 vs You Do: retrospectives deliberately keep the fourth blank-age case and `mostrar_resumen`/`main` as portfolio differentiators.
3. Length bands are approximate (Spanish word counts); some units sit near the lower edge of 40–80 / 25–60 — acceptable when principle + misconception + transfer are present.
4. No further full rewrite recommended unless a Round-3 review finds true P0/P1 regressions.

## Diff footprint
- `src/lib/course/sections/s02-basics.ts`: pedagogy prose only (why / retrospective / feedback / minor instruction / one preamble pin / starter comment / youDo context sentence).
- Code solutions and outputs: **unchanged**.

---

Section 2 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
