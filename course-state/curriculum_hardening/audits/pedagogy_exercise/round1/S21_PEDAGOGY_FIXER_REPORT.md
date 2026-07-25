# S21 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Documentos, plantillas y reportes trazables
- **id:** `fastapi` (contenido = Reporting Factory Jinja/DOCX/PDF/narrativa/provenance; **no** APIs HTTP)
- **source:** `src/lib/course/sections/s21-fastapi.ts`
- **review input:** `round1/S21_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter defects, solution code, and exact demo/exercise outputs
- Spanish PE professional; CASO-LIM-021 sintético Lima/Cusco; em-dash `—`; ASCII `sintetico` en canvas ReportLab; no real PII

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; all solution outputs untouched |
| Spanish PE; no real PII | **PASS** — tú/professional register; CASO-LIM-021 sintético |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` (context/goal/success/constraints) + task-step `instruction` + `retrospective`; feedback enriched with comité/CP-N2-B impact where thin |
| youDo | 1 | `retrospective` only; `portfolioNote` points to retrospective prompts |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S21-T1-A-DEMO | preamble + retrospective; why: context versionado, render, puente S22/`render_kpi` |
| S21-T1-B-DEMO | preamble + retrospective; why: missing como decisión de reporting, em-dash |
| S21-T2-A-DEMO | preamble + retrospective; why: reabrir OOXML, Heading real vs negrita |
| S21-T2-B-DEMO | preamble + retrospective; why: extracción vs PNG; needs_ocr; hash a T4-B |
| S21-T3-A-DEMO | preamble + retrospective; why: ids, decision=None, hallazgo ≠ decisión |
| S21-T3-B-DEMO | preamble + retrospective; why: paridad gate; limits visibles |
| S21-T4-A-DEMO | preamble + retrospective; why: fmt_pen + a11y_min; all([]) |
| S21-T4-B-DEMO | preamble + retrospective; why: provenance, pending_review, SHA-256 vs lab |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S21-T1-A-E1 | Portada Jinja con región y n |
| S21-T1-B-E1 | Missing como em-dash (no cero) |
| S21-T2-A-E1 | DOCX con Resumen y n=40 reabierto |
| S21-T2-B-E1 | PDF digital con n=40 extraíble |
| S21-T3-A-E1 | Hallazgo H1 con evidencia y decision=None |
| S21-T3-B-E1 | Paridad dash/doc y límite solo web |
| S21-T4-A-E1 | Precisión a 1 decimal PEN |
| S21-T4-B-E1 | Manifiesto pending_review (no approved) |

### weDo E2/E3 (P0)
| Unit | Title |
|------|-------|
| S21-T1-A-E2 | KPI Jinja con mediana y n |
| S21-T1-A-E3 | Función render_kpi con context dict |
| S21-T1-B-E2 | Formato a dos decimales (.2f) |
| S21-T1-B-E3 | Bucle Jinja de filas region:v |
| S21-T2-A-E2 | Contar Heading 1 al reabrir el DOCX |
| S21-T2-A-E3 | Tabla DOCX con Reclamos como — |
| S21-T2-B-E2 | Render de página PDF a PNG |
| S21-T2-B-E3 | PDF imagen-only y needs_ocr |
| S21-T3-A-E2 | Resumen con n= y unidad PEN |
| S21-T3-A-E3 | pack_report con tres claves |
| S21-T3-B-E2 | Caption con campo Fuente visible |
| S21-T3-B-E3 | check_parity en tres artefactos |
| S21-T4-A-E2 | fmt_pen con unidad PEN |
| S21-T4-A-E3 | a11y_min con H1 y alts útiles |
| S21-T4-B-E2 | Huella corta sha1[:8] de lab |
| S21-T4-B-E3 | ready(checklist) con all() |

All 24 We Do units received: title, preamble (context/goal/success/constraints), ordered instruction steps, retrospective (principle + misconception + transfer). Feedback extended with comité/CP-N2-B impact where previously only technical.

### youDo (P1)
| Unit | Changes |
|------|---------|
| youDo | `retrospective` de defensa (paridad, pending_review, frase de impacto); `portfolioNote` remite a las tres preguntas |

### P2 polish
| Item | Action |
|------|--------|
| T1-B-E2 hint | Suavizado: ya no spoila “28.46”; apunta al test de dos decimales |
| T4-B-E2 hint | Suavizado: “slice de 8 caracteres” sin hardcodear el hexdigest |
| Feedback | Frases de impacto en comité donde el feedback era solo corrección técnica |

## Code/output integrity
- **No** changes to starter defects, solutionCode, or outputs
- Em-dash `—` preserved; ReportLab ASCII `sintetico` preserved
- Section id `fastapi` left unchanged (historical; prose stays on Reporting Factory)

## Residual notes for Round 2
- Historical filename/id `fastapi` still confuses API seekers; out of Fixer scope without migration plan
- T2 deps (python-docx, reportlab, pypdf, pymupdf) remain environment-sensitive; preambles stress disk artifacts
- E3 T1-A n=18 Cusco matiz retained in preamble to avoid false paridad panic

## Validation
- Field counts: preamble=32, retrospective=33, weDo titles=24; no unit missing title/preamble/retrospective
- `npx tsc --noEmit` PASS

---

Section 21 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
