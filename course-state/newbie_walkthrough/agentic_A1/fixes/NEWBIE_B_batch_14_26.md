# NEWBIE_B (Skeptic) — batch selfcheck sections 14–26

- **attempt_id:** `agentic_A1`
- **persona:** skeptic
- **method:** `llm_packet_only_no_generator`
- **source:** `quiz_batch_14_26.json` only (no solutions/correctIndex/TypeScript)
- **recorded:** 2026-07-21T22:08:32.273443+00:00
- **agent:** Newbie Subagent B (independent from A)

## Protocol

- Zero external Python knowledge beyond the packet cards.
- Every stem answered with `chosen_index` + Skeptic-toned `justification_from_packet` quoting theory/iDo from the card.
- Exercises left as previously scaffolded; this batch only fills **selfcheck**.
- Forbidden: solutions, correctIndex, attempt_007b, TS sources.

## Per-section answers

### S14 — NumPy y cómputo vectorizado

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.88 | dtype |
| 1 | 1 | 0.9 | Filtrar o seleccionar elementos que cumplen la condición |
| 2 | 1 | 0.86 | Por columna (colapsa filas) |
| 3 | 1 | 0.9 | Puede mutar el array base porque suele ser un view |

- mean confidence: 0.89
- blocked: 0 / 4
- artifact: `section_14/newbie_b_live.json` → `selfcheck`

### S15 — Pandas: ingesta, selección y tipos

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.92 | loc |
| 1 | 1 | 0.9 | Asignación sobre slices que pueden ser view/copy (chained as |
| 2 | 1 | 0.88 | Convierte inválidos a NaN |
| 3 | 1 | 0.9 | Filas, columnas y provenance/hash del artefacto |

- mean confidence: 0.90
- blocked: 0 / 4
- artifact: `section_15/newbie_b_live.json` → `selfcheck`

### S16 — Calidad, limpieza y contratos de datos

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.92 | Generar violación/cuarentena o fail del gate |
| 1 | 0 | 0.9 | Misma clave con atributos distintos |
| 2 | 1 | 0.92 | Conservar filas rechazadas con razón |
| 3 | 1 | 0.9 | Fallar de forma explicable con el nombre de la columna |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_16/newbie_b_live.json` → `selfcheck`

### S17 — Joins, reshape, groupby y cierre analítico

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Fallar si la cardinalidad no es 1:1 |
| 1 | 0 | 0.9 | Filas del left sin match en right |
| 2 | 1 | 0.88 | Reinyecta el agregado al shape original |
| 3 | 1 | 0.9 | Incluyes datos posteriores al cutoff en features/métricas de |

- mean confidence: 0.90
- blocked: 0 / 4
- artifact: `section_17/newbie_b_live.json` → `selfcheck`

### S18 — EDA, estadística descriptiva e incertidumbre

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Mediana (y opcionalmente IQR) |
| 1 | 1 | 0.92 | Asociación observada (no causal por sí sola) |
| 2 | 1 | 0.9 | Origen, filtros, n y límites de cobertura |
| 3 | 1 | 0.9 | La muestra no representa la población de interés |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_18/newbie_b_live.json` → `selfcheck`

### S19 — Visualización y comunicación accesible

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Barras con baseline 0 |
| 1 | 1 | 0.9 | Repetir los mismos números clave del chart |
| 2 | 1 | 0.92 | Sobreclaim / generalización indebida |
| 3 | 1 | 0.9 | Unidad, fuente y limitaciones |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_19/newbie_b_live.json` → `selfcheck`

### S20 — Automatización robusta de Excel

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | No; suele devolver la fórmula o cache si existe |
| 1 | 1 | 0.9 | Escribir en la celda ancla (top-left) |
| 2 | 1 | 0.88 | Estados de batch, conciliación y backups |
| 3 | 1 | 0.9 | Misma entrada → mismo resultado lógico |

- mean confidence: 0.90
- blocked: 0 / 4
- artifact: `section_20/newbie_b_live.json` → `selfcheck`

### S21 — Documentos, plantillas y reportes trazables

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Para reutilizar presentación y auditar métricas en Python |
| 1 | 1 | 0.9 | OCR / tratamiento de imagen |
| 2 | 1 | 0.92 | Mismas métricas clave en dashboard, Excel y documento |
| 3 | 1 | 0.9 | Provenance, checklist visual y hallazgos trazables |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_21/newbie_b_live.json` → `selfcheck`

### S22 — Email, identidad y aprobación humana

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Solo drafts/.eml en sandbox y aprobación humana |
| 1 | 2 | 0.92 | Solo evidencia débil de contacto a revisar; no prueba de fra |
| 2 | 1 | 0.9 | Solo los scopes mínimos (p. ej. draft) necesarios |
| 3 | 1 | 0.9 | Reutilizar el mismo draft_id si la key existe |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_22/newbie_b_live.json` → `selfcheck`

### S23 — Browser RPA con Playwright

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Refleja la UI accesible y suele ser más estable |
| 1 | 2 | 0.92 | Detenerse y hacer handoff humano |
| 2 | 1 | 0.9 | Buscar integración no-UI antes de automatizar el browser |
| 3 | 1 | 0.9 | Solo fallas transitorias (timeout/red), no captcha/403 de ne |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_23/newbie_b_live.json` → `selfcheck`

### S24 — OCR y Document AI

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 2 | 0.9 | Abstener y encolar revisión |
| 1 | 1 | 0.9 | Cola de revisión / corrección |
| 2 | 1 | 0.88 | Los campos críticos pueden fallar aunque el global se vea bi |
| 3 | 1 | 0.9 | Gate reject/review por mime no permitido |

- mean confidence: 0.90
- blocked: 0 / 4
- artifact: `section_24/newbie_b_live.json` → `selfcheck`

### S25 — Endpoints de IA, Hugging Face y prompting evaluado

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Cuando el problema es determinista y auditabilidad importa |
| 1 | 1 | 0.9 | Se descarta / human review |
| 2 | 1 | 0.9 | Tratando el texto como untrusted y filtrando/ no elevando a  |
| 3 | 1 | 0.92 | Nunca de forma autónoma en este curso; solo evidencia para h |

- mean confidence: 0.91
- blocked: 0 / 4
- artifact: `section_25/newbie_b_live.json` → `selfcheck`

### S26 — Orquestación y VP RPA + AI Analyst

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.9 | Approve antes de draft_email |
| 1 | 1 | 0.88 | Tests críticos de capstones N2, E2E y controles de privacida |
| 2 | 1 | 0.9 | Incidente P0 |
| 3 | 1 | 0.92 | 0 — solo evidencia para humanos |

- mean confidence: 0.90
- blocked: 0 / 4
- artifact: `section_26/newbie_b_live.json` → `selfcheck`

## Skeptic notes / residual doubts

- **S15 Q2 (`errors='coerce'`)**: card emphasizes `to_numeric(..., errors=)` and NaN reporting under coercion/schema; I map coerce→NaN from that wording. If the exact kwarg were only in an unshown exercise, confidence would drop — here demos/theory still anchor «fallos → NaN / reporte».
- **S20 Q2 manifest contents**: no single sentence lists all three of batch+conciliación+backup together; synthesis from T4 batch + backups headings. Still packet-local.
- **S26 «Incidente P0»**: packet stresses zero sends without approve as SLO; severity label «P0» is the closest option to that critical bar.
- No `UNTAUGHT_CONCEPT` on these MCQs: each stem maps cleanly to a named theory heading in the same section card.

## Summary counts

- sections updated: 13 (14–26)
- total selfcheck items: 52
- blocked_on non-empty: 0

## Integrity checklist

- [x] attempt_id agentic_A1
- [x] method llm_packet_only_no_generator
- [x] persona skeptic
- [x] all stems answered
- [x] justification_from_packet present on every item
- [x] no solutions/correctIndex consulted

