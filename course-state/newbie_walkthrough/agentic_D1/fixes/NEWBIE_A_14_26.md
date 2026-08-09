# Newbie A (Explorer) — agentic_D1 sections 14–26

**Agent:** `newbie_a_live` · persona **explorer**  
**Attempt:** `agentic_D1`  
**Method:** `llm_packet_only_no_generator`  
**Production note:** `live_dual_llm_agentic_from_packet_only_D1`  
**Source allowed:** `exercise_batch_14_26.json` / section `quiz_card.json` (theory + iDo + instruction/hints/starter + selfCheck stems)  
**Forbidden honored:** yes — no solutions, `correctIndex`, attempt_007b, TypeScript, or rebuild templates  

---

## Scope

Filled **exercises + selfcheck** on all 13 sections:

| Sec | Title | Path | #ex | #sc |
|----:|-------|------|----:|----:|
| 14 | NumPy y cómputo vectorizado | `section_14/newbie_a_live.json` | 24 | 4 |
| 15 | Pandas: ingesta, selección y tipos | `section_15/newbie_a_live.json` | 24 | 4 |
| 16 | Calidad, limpieza y contratos de datos | `section_16/newbie_a_live.json` | 24 | 5 |
| 17 | Joins, reshape, groupby y cierre analítico | `section_17/newbie_a_live.json` | 24 | 5 |
| 18 | EDA, estadística descriptiva e incertidumbre | `section_18/newbie_a_live.json` | 24 | 5 |
| 19 | Visualización y comunicación accesible | `section_19/newbie_a_live.json` | 24 | 5 |
| 20 | Automatización robusta de Excel | `section_20/newbie_a_live.json` | 24 | 5 |
| 21 | Documentos, plantillas y reportes trazables | `section_21/newbie_a_live.json` | 24 | 5 |
| 22 | Email, identidad y aprobación humana | `section_22/newbie_a_live.json` | 24 | 5 |
| 23 | Browser RPA con Playwright | `section_23/newbie_a_live.json` | 24 | 4 |
| 24 | OCR y Document AI | `section_24/newbie_a_live.json` | 24 | 4 |
| 25 | Endpoints de IA, Hugging Face y prompting evaluado | `section_25/newbie_a_live.json` | 24 | 4 |
| 26 | Orquestación y VP RPA + AI Analyst | `section_26/newbie_a_live.json` | 24 | 4 |

**Totals:** 13 × 24 = **312** exercise codes · **58** selfcheck answers (S14–15/23–26: 4 each; S16–22: 5 each) · **0** blocked.

Each exercise: `{exercise_id, answer, code, confidence, blocked_on, concepts_used, justification_from_packet}`  
Each selfcheck: `{question_index, chosen_index, confidence, blocked_on, justification_from_packet}`  
Justifications are natural language ≥80 chars, packet-grounded (theory headings / iDo / instruction).

---

## Selfcheck chosen indices (Explorer, packet-grounded)

| Sec | Indices |
|----:|---------|
| 14 | [1, 3, 0, 2] |
| 15 | [2, 0, 1, 3] |
| 16 | [1, 1, 1, 1, 1] |
| 17 | [0, 2, 3, 1, 1] |
| 18 | [1, 3, 0, 2, 1] |
| 19 | [2, 0, 1, 3, 1] |
| 20 | [3, 1, 2, 0, 1] |
| 21 | [0, 2, 3, 1, 1] |
| 22 | [1, 3, 0, 2, 1] |
| 23 | [2, 0, 1, 3] |
| 24 | [3, 1, 2, 0] |
| 25 | [0, 2, 3, 1] |
| 26 | [0, 3, 0, 2] |

---

## Rationale highlights (by section)

### S14 NumPy y cómputo vectorizado
- **dtype** = tipo homogéneo; shape/ndim/base no.
- Máscara booleana → filtrar/seleccionar (`a[mask]` / `np.where`).
- `axis=0` en 2D → agrega **por columna** (colapsa filas).
- Slice simple suele ser **view**; mutar puede mutar el base.
- Ejercicios: flags uint8, linspace, broadcast, nanmean/isfinite, allclose, loop vs vectorizado.

### S15 Pandas: ingesta, selección y tipos
- **loc** = etiquetas; iloc = posición.
- SettingWithCopy ↔ chained assignment / ambigüedad view-copy → `loc` o `.copy()`.
- `errors='coerce'` → inválidos a **NaN**.
- Manifest de export ≥ filas, columnas, provenance/hash.

### S16 Calidad, limpieza y contratos de datos
- Required con null → cuarentena/fail del gate (no 0-fill silencioso).
- Exacto = filas idénticas; conflicto = misma clave, atributos distintos.
- Conservar `region_raw` para auditar canónico.
- IQR sin domain bounds puede marcar colas legítimas.
- Gate fallido: **publicar métricas + cuarentena** aunque pass=False.

### S17 Joins, reshape, groupby y cierre analítico
- `validate='one_to_one'` falla si la cardinalidad no es 1:1.
- Anti-join `left_only` = filas del left sin match.
- `transform` reinyecta al shape original.
- Leakage = datos post-cutoff en features del pasado.
- Portfolio: documentar diff con tolerancia eps o corregir el corte.

### S18 EDA, estadística descriptiva e incertidumbre
- Ticket típico con outliers → **mediana** (+ IQR).
- Correlación alta = asociación observada, no causalidad.
- Data note mínimo: origen, filtros, n, límites.
- Sesgo de muestra cuando la muestra no representa la población.
- Con confusor: reportar asociación, evitar verbos causales.

### S19 Visualización y comunicación accesible
- Comparar magnitudes → **barras con baseline 0**.
- Alt text repite números clave del chart.
- “Mejor del Perú” desde muestra web = sobreclaim.
- Caption: unidad, fuente, limitaciones.
- Eje Y recortado → riesgo de inflación visual; exigir baseline 0.

### S20 Automatización robusta de Excel
- openpyxl **no evalúa** fórmulas sin Excel; devuelve fórmula/cache.
- Merge: escribir en celda ancla (top-left).
- Manifest: estados batch, conciliación, backups.
- Idempotencia: misma entrada → mismo resultado lógico.
- Totales no cuadran → fail-closed hasta reconciliar.

### S21 Documentos, plantillas y reportes trazables
- Separar datos y plantilla Jinja para reutilizar y auditar métricas.
- PDF casi sin texto → OCR / imagen.
- Paridad = mismas métricas clave en dashboard/Excel/doc.
- Cierre CP-N2-B: provenance, checklist visual, hallazgos.
- PDF imagen-only → `needs_ocr`, no fingir digital nativo.

### S22 Email, identidad y aprobación humana
- No envío real: drafts/.eml sandbox + aprobación humana.
- Score de similitud ≠ fraude; solo evidencia débil a revisar.
- Least privilege OAuth: scopes mínimos (draft).
- Idempotency key reutiliza draft_id.
- Match alto → priorizar HITL; match≠fraude.

### S23 Browser RPA con Playwright
- `get_by_role` refleja UI accesible y es más estable que nth-child.
- CAPTCHA → handoff humano (no resolver ni spamear).
- API/export primero antes de RPA browser.
- Retry solo fallas transitorias (timeout/red), no captcha/403.

### S24 OCR y Document AI
- Confidence RUC 0.6 → abstener y encolar revisión.
- Mismatch total vs líneas → cola de revisión (no fraude automático).
- Accuracy por campo: críticos pueden fallar con global “ok”.
- MIME zip en intake facturas → reject/review.

### S25 Endpoints de IA, Hugging Face y prompting evaluado
- Preferir reglas cuando es determinista y auditabilidad importa.
- JSON inválido del generador → descartar / human review.
- Prompt injection desde OCR: texto untrusted, no elevar a system.
- AI assist nunca etiqueta fraude de forma autónoma; solo evidencia.

### S26 Orquestación y VP RPA + AI Analyst
- Flujo: **draft antes de approve** (luego send con gate humano).
- Regresión N2: tests críticos capstones + E2E + privacidad/seguridad.
- Send sin approve = incidente **P0**.
- `fraud_labels` automáticos = **0** (solo evidencia humana).

---

## Execution / validation notes

- Codes completed from packet starters + instructions + hints + iDo patterns; many later sections include `forma esperada (referencia)` which was used only as a packet-local completion hint (not external solutions).
- Local re-exec of all 312 snippets against expected pass strings: **312/312** match (loose containment / contract tokens).
- Two initial float/format edge cases fixed before freeze: `S18-T3-A-E3` (round r_raw/resid) and `S19-T4-B-E2` (`True | True`).
- Meta fields set on every section file: `agentic_D1`, `llm_packet_only_no_generator`, `live_dual_llm_agentic_from_packet_only_D1`, `persona=explorer`.

_Recorded by Newbie A (Explorer) live dual-LLM pass — 2026-07-23T03:43:58.837861+00:00_
