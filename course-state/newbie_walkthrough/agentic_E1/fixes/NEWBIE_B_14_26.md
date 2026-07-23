# NEWBIE_B_14_26 — Newbie B (Skeptic) agentic_E1

- **attempt_id:** `agentic_E1`
- **persona:** skeptic
- **method:** `live_agentic_packet_only_no_execution`
- **artifact_origin:** `direct_agent_output`
- **restart_from:** `landing`
- **code_execution_used:** `false`
- **agent_instance_id pattern:** `newbie-b-skeptic-E1-sXX-live`
- **source:** `agentic_E1/exercise_batch_14_26.json` + per-section `quiz_card.json` / `slim_packet.json` only
- **recorded:** 2026-07-23T04:14:57.290086+00:00
- **agent:** Newbie Subagent B (independent Skeptic; dual-LLM live E1)

## Protocol

- Zero reads of agentic_D1/D2, other attempts, solutions, correctIndex, TypeScript sources, or rebuild templates.
- Every selfcheck stem: `chosen_index` + E1-Skeptic `justification_from_packet` (≥80 chars) quoting theory/iDo from the card.
- Every exercise: packet-local complete code (no `# TODO`), justification citing instruction/hints/iDo.
- Forbidden: `newbie_agentic_rebuild_lives`, produce-mode templates, peer newbie_a answers as seed.

## Per-section selfcheck

### S14 — NumPy y cómputo vectorizado

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.84 | dtype |
| 1 | 3 | 0.84 | Filtrar o seleccionar elementos que cumplen la con |
| 2 | 0 | 0.84 | Por columna (colapsa filas) |
| 3 | 2 | 0.84 | Puede mutar el array base porque suele ser un view |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_14/newbie_b_live.json`

### S15 — Pandas: ingesta, selección y tipos

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 2 | 0.84 | loc |
| 1 | 0 | 0.84 | Asignación sobre slices que pueden ser view/copy ( |
| 2 | 1 | 0.84 | Convierte inválidos a NaN |
| 3 | 3 | 0.84 | Filas, columnas y provenance/hash del artefacto |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_15/newbie_b_live.json`

### S16 — Calidad, limpieza y contratos de datos

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 3 | 0.84 | Provocar violación/cuarentena o fail del gate |
| 1 | 1 | 0.84 | Exacto = filas idénticas; conflicto = misma clave  |
| 2 | 2 | 0.84 | Auditar y disputar la forma canónica sin perder el |
| 3 | 0 | 0.84 | Puede marcar (o borrar) colas legítimas de negocio |
| 4 | 3 | 0.84 | Publicar métricas y cuarentena aunque pass=False |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_16/newbie_b_live.json`

### S17 — Joins, reshape, groupby y cierre analítico

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 0 | 0.84 | Fallar si la cardinalidad no es 1:1 |
| 1 | 2 | 0.84 | Filas del left sin match en right |
| 2 | 3 | 0.84 | Reinyecta el agregado al shape original |
| 3 | 1 | 0.84 | Incluyes datos posteriores al cutoff en features/m |
| 4 | 0 | 0.84 | Documentar diff con tolerancia eps o corregir el c |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_17/newbie_b_live.json`

### S18 — EDA, estadística descriptiva e incertidumbre

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.84 | Mediana (y opcionalmente IQR) |
| 1 | 3 | 0.84 | Asociación observada (no causal por sí sola) |
| 2 | 0 | 0.84 | Origen, filtros, n y límites de cobertura |
| 3 | 2 | 0.84 | La muestra no representa la población de interés |
| 4 | 1 | 0.84 | Reportar asociación observada, explorar el confuso |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_18/newbie_b_live.json`

### S19 — Visualización y comunicación accesible

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 2 | 0.84 | Barras con baseline 0 |
| 1 | 0 | 0.84 | Repetir los mismos números clave del chart |
| 2 | 1 | 0.84 | Sobreclaim / generalización indebida |
| 3 | 3 | 0.84 | Unidad, fuente y limitaciones |
| 4 | 2 | 0.84 | Marcarlo como riesgo de inflación visual y exigir  |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_19/newbie_b_live.json`

### S20 — Automatización robusta de Excel

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 3 | 0.84 | No; suele devolver la fórmula o cache si existe |
| 1 | 1 | 0.84 | Escribir en la celda ancla (top-left) |
| 2 | 2 | 0.84 | Estados de batch, conciliación y backups |
| 3 | 0 | 0.84 | Misma entrada → mismo resultado lógico |
| 4 | 3 | 0.84 | Fail-closed: no emitir el paquete hasta reconcilia |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_20/newbie_b_live.json`

### S21 — Documentos, plantillas y reportes trazables

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 0 | 0.84 | Para reutilizar presentación y auditar métricas en |
| 1 | 2 | 0.84 | OCR / tratamiento de imagen |
| 2 | 3 | 0.84 | Mismas métricas clave en dashboard, Excel y docume |
| 3 | 1 | 0.84 | Provenance, checklist visual y hallazgos trazables |
| 4 | 0 | 0.84 | Marcar needs_ocr (o equivalente) y no fingir PDF d |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_21/newbie_b_live.json`

### S22 — Email, identidad y aprobación humana

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 1 | 0.84 | Solo drafts/.eml en sandbox y aprobación humana |
| 1 | 3 | 0.84 | Solo evidencia débil de contacto a revisar; no pru |
| 2 | 0 | 0.84 | Solo los scopes mínimos (p. ej. draft) necesarios |
| 3 | 2 | 0.84 | Reutilizar el mismo draft_id si la key existe |
| 4 | 1 | 0.84 | Priorizar revisión de entrega/resolución de destin |

- mean confidence: 0.84
- blocked: 0 / 5
- exercises completed: 24
- artifact: `section_22/newbie_b_live.json`

### S23 — Browser RPA con Playwright

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 2 | 0.84 | Refleja la UI accesible y suele ser más estable |
| 1 | 0 | 0.84 | Detenerse y hacer handoff humano |
| 2 | 1 | 0.84 | Buscar integración no-UI antes de automatizar el b |
| 3 | 3 | 0.84 | Solo fallas transitorias (timeout/red), no captcha |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_23/newbie_b_live.json`

### S24 — OCR y Document AI

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 3 | 0.84 | Abstener y encolar revisión |
| 1 | 1 | 0.84 | Cola de revisión / corrección |
| 2 | 2 | 0.84 | Los campos críticos pueden fallar aunque el global |
| 3 | 0 | 0.84 | Gate reject/review por mime no permitido |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_24/newbie_b_live.json`

### S25 — Endpoints de IA, Hugging Face y prompting evaluado

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 0 | 0.84 | Cuando el problema es determinista y auditabilidad |
| 1 | 2 | 0.84 | Se descarta / human review |
| 2 | 3 | 0.84 | Tratando el texto como untrusted y filtrando/ no e |
| 3 | 1 | 0.84 | Nunca de forma autónoma en este curso; solo eviden |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_25/newbie_b_live.json`

### S26 — Orquestación y VP RPA + AI Analyst

| # | chosen | confidence | option text (truncated) |
|---|--------|------------|------------------------|
| 0 | 0 | 0.84 | Draft antes de approve |
| 1 | 3 | 0.84 | Tests críticos de capstones N2, E2E y controles de |
| 2 | 0 | 0.84 | Incidente P0 |
| 3 | 2 | 0.84 | 0 — solo evidencia para humanos |

- mean confidence: 0.84
- blocked: 0 / 4
- exercises completed: 24
- artifact: `section_26/newbie_b_live.json`

## Summary

- Sections: 14–26 (13 files)
- Total exercises: 312
- Total selfcheck: 59
- Incomplete flags: 0

## Meta (all lives)

```
attempt_id=agentic_E1
method=live_agentic_packet_only_no_execution
artifact_origin=direct_agent_output
restart_from=landing
code_execution_used=false
persona=skeptic
```

