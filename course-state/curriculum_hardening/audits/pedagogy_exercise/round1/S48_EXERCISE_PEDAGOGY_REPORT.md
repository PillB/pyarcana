# S48 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Aplicaciones LLM y RAG con evidencia
- **shortTitle:** RAG con evidencia
- **id:** `ai-governance` (archivo `s48-ai-governance.ts`; el **contenido** es asistente RAG con citas, ACL y abstención — no “governance abstracta” de política)
- **index:** 48
- **source:** `src/lib/course/sections/s48-ai-governance.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S48-T1-A embeddings/similitud · T1-B baseline/promoción holdout · T2-A chunking/dedup · T2-B ACL/tombstone · T3-A híbrido/Recall@k · T3-B citas/contexto · T4-A grounding/inyección · T4-B eval/abstención/costo
- **hilo de caso:** cooperativa sintética **CASO-PUN-048** (Puno) — socio pregunta por SLA/reglamento; gate **CP-N4-C-RAG** (claims ⊆ citas permitidas, ACL pre-rank, abstenerse si support insuficiente); **missing ≠ breach**; stdlib sin API de LLM reales ni PII

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~335–548), `weDo.steps[]` (24 ejercicios, ~550–1841) y `youDo` (~1844–1910) en `s48-ai-governance.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-C-RAG.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S48 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera RAG, **opaco** para newbie sin escena de cooperativa en Puno |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa al socio / al promote del índice / al portfolio* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos bien nombrados (min vs max, PASS invertido, missing→CONTINUE) y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-C-RAG |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-C-RAG; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado de dominio → E2 tabla PASS/REJECT/MISSING → E3 CONTINUE/breach/REVIEW. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción, fixtures sintéticos Puno, stdlib progressive disclosure, ACL pre-rank, grounding sin verdad vacua) es maduro y alineado al hilo S47 serving → S48 RAG con evidencia → S49 tools. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al socio de la cooperativa, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (función de dominio → assess tres rutas → decide fail-closed en “producción”). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del predicado”, E2 “separa válido/adverso/ausente”, E3 “enruta CONTINUE / breach / review sin convertir incertidumbre en éxito”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `ai-governance` y el archivo se llama `s48-ai-governance.ts`, pero el título y el contenido son RAG con evidencia. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

---

## Unit ledger

### S48-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de ranking por dot product con `emb-v2` y top `d1`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (score d1 vs d2, versión como contrato) y `retrospective` del misconception “si el score es alto, el claim es verdadero”. El `why` es una frase corta.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de citar el reglamento al socio, el índice solo **ordena** candidatos. En esta demo tres vectores sintéticos (`query`, `d1`, `d2`) se rankean por dot product bajo la versión `emb-v2`. No escribas aún: predice quién gana y por qué `score_d1` es 0.8. Si confundes “más similar” con “autoriza el claim”, el asistente inventará un SLA con un fragmento que solo “suena cerca”.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el top reproducible es el artefacto de T1-A; la versión del embedding es parte del contrato del índice (cambiarla sin re-eval rompe el holdout). Dot product solo ordena; no prueba verdad ni permiso. Puente a We Do: reparar `rank_top` que usa `min`, validar `emb-v2`, y enrutar REJECT/REVIEW.
- **Proposed retrospective:**  
  Si puedes explicar por qué d1 gana sin mirar el print, ya tienes el hábito de ranking versionado. El error clásico es tratar la similitud como prueba del claim. En We Do practicarás max(dot) + fail-closed de versión.
- **Code/output changes:** none
- **Validation notes:** Output `version emb-v2` / `top d1` / `score_d1 0.8` alineado a theory T1-A.

---

### S48-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter elige el peor score (`min`) e ignora versión. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra dot product pero no ancla “por qué emb-v2 es contrato del índice para el socio de Puno”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ranking por dot product con emb-v2
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-1A`, el socio pregunta por el SLA; el índice debe devolver el fragmento más similar bajo `emb-v2`, no el peor.  
  - **Meta:** implementar `rank_top` que devuelve el id de mayor dot product solo si `version == "emb-v2"`.  
  - **Éxito:** imprimes exactamente `S48-T1-A PASS` con el fixture (top esperado `d1`).  
  - **Límites:** no uses `min`; no ignores la versión; no inventes docs fuera del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `rank_top` usa `min` y no comprueba versión (bug).  
  2. Si `version != "emb-v2"`, devuelve `None`.  
  3. Si no, devuelve `max` por `sum(q_i * d_i)`.  
  4. Conserva el print `S48-T1-A` y el status PASS/REJECT_EMBEDDING_RANK.
- **Proposed feedback improvement:**  
  El top es el doc con mayor dot; `emb-v2` es parte del contrato del índice, no un comentario. Si eliges el peor score o una versión vacía, el socio vería el fragmento equivocado aunque el assert “pase” por suerte.
- **Proposed retrospective:**  
  Ranking = max(similitud) + versión fijada. El error clásico es `min` por descuido o omitir la versión. Siguiente (E2): tres rutas PASS / REJECT / MISSING:expected_top.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S48-T1-A PASS` correctos.

---

### S48-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: válido (d1+emb-v2), adverso (versión vacía / expected d2), sin `expected_top`. Starter reusa `min` y no exige versión en assess. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de ranking (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor del índice en Puno no trata igual un ranking limpio, uno con versión rota y uno sin top esperado.  
  - **Meta:** implementar `assess` que distinga PASS, REJECT_EMBEDDING_RANK y MISSING:expected_top.  
  - **Éxito:** imprime `PASS REJECT_EMBEDDING_RANK MISSING:expected_top` en ese orden.  
  - **Límites:** si falta `expected_top`, no rankees; no inventes el campo; missing ≠ “aceptar”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `rank_top` usa `min` y assess no exige emb-v2.  
  2. Primero: campos required; si falta `expected_top` → `MISSING:expected_top`.  
  3. Luego: max(dot) + versión emb-v2 vs expected_top → PASS o REJECT.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de evidencia de eval; versión vacía o top incorrecto es breach de ranking. El error clásico es rankear sin gold. Luego (E3) enrutas CONTINUE / REJECT / REVIEW_METRIC_VERSION.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S48-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de pipeline. Starter trata missing como CONTINUE y elige el peor score — defecto de promote silencioso. Falta preamble de “producción fail-closed” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide ranking: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** el pipeline del asistente decide si el ranking **sigue** o se detiene: no hay “seguir con warning de métrica”.  
  - **Meta:** `decide` → CONTINUE (top emb-v2 correcto), REJECT_EMBEDDING_RANK (ranking roto), REVIEW_METRIC_VERSION (sin expected_top).  
  - **Éxito:** `CONTINUE REJECT_EMBEDDING_RANK REVIEW_METRIC_VERSION`.  
  - **Límites:** no inventes expected_top; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `expected_top` → `REVIEW_METRIC_VERSION` (no CONTINUE).  
  2. Con schema completo, max(dot) + version emb-v2 vs expected.  
  3. Solo el válido es CONTINUE; el adverso es REJECT_EMBEDDING_RANK.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un campo de eval ausente es revisión de métrica, no un allow optimista. El error clásico es promover ranking sin gold. Pregunta: ¿por qué REJECT no es lo mismo que REVIEW?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S48-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: PROMOTE vs KEEP_EMBEDDING_BASELINE según recall y costo. Falta preamble de “reindexar no es cosmético” y retrospective del misconception “candidato más nuevo siempre se promueve”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cambiar el modelo de embedding del reglamento de la cooperativa no es un deploy de etiqueta. En esta demo comparas baseline 0.72 vs candidato 0.81 en `rag-holdout-v1` con tope de costo. No escribas: predice PROMOTE y KEEP antes de mirar la salida. Si reindexas con regresión o sin presupuesto, el holdout miente y el socio recibe peores citas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: improve + min_recall + cost≤cap es el triple de promoción; holdout de train no cuenta. Puente a We Do: `promote_ok`, tabla PASS/KEEP/MISSING y decide EVALUATE_ERROR_SLICES.
- **Proposed retrospective:**  
  Promoción = mejora retenida con presupuesto. El error clásico es “modelo nuevo = mejor”. We Do: predicado, tres rutas y rama de slices de error.
- **Code/output changes:** none
- **Validation notes:** Output `PROMOTE` / `KEEP_EMBEDDING_BASELINE` / `holdout rag-holdout-v1` alineado a T1-B.

---

### S48-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba regresión o holdout vacío. Instruction densa; sin title/preamble/retrospective. Feedback correcto pero breve.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Promover embedding con holdout RAG
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-1B`, antes de reindexar el reglamento con un candidato, debes demostrar mejora en holdout RAG y costo ≤ 50 PEN.  
  - **Meta:** implementar `promote_ok` (candidate ≥ min, > baseline, holdout `rag-holdout-*`, costo ≤ 50).  
  - **Éxito:** `S48-T1-B PASS` con el fixture 0.81 / 0.72 / 30 PEN.  
  - **Límites:** no apruebes regresión; no aceptes holdout vacío o de train.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve True ante regresión o holdout vacío (bug).  
  2. Cambia a cuatro AND: umbral, mejora, prefijo `rag-holdout-`, costo ≤ 50.  
  3. Conserva print y status PASS/KEEP_EMBEDDING_BASELINE.
- **Proposed retrospective:**  
  KEEP ante regresión es éxito de gobernanza del índice. El error clásico es promover por “nombre del modelo”. Siguiente: PASS / KEEP / MISSING:reindex_cost_pen.
- **Code/output changes:** none
- **Validation notes:** Solution canónica correcta.

---

### S48-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres registros (mejora OK, regresión+train+costo 300, sin reindex_cost_pen). Starter invierte PASS. Falta anclar missing de costo vs regresión.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess promoción: PASS vs KEEP vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el dueño del índice en Puno clasifica cada candidato: promover, conservar baseline o pedir evidencia de costo.  
  - **Meta:** `assess` → PASS / KEEP_EMBEDDING_BASELINE / MISSING:reindex_cost_pen.  
  - **Éxito:** `PASS KEEP_EMBEDDING_BASELINE MISSING:reindex_cost_pen`.  
  - **Límites:** no inventes el costo; no trates missing como KEEP ni como PASS.
- **Proposed instruction/description improvements:**  
  1. Primero calcula missing de campos required.  
  2. Si falta `reindex_cost_pen` → MISSING (no compares recalls).  
  3. Si mejora + holdout RAG + costo ≤ 50 → PASS; si no → KEEP.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  KEEP es breach de promoción demostrada; MISSING es presupuesto desconocido. El error clásico es asumir costo cero. Luego (E3): CONTINUE / KEEP / EVALUATE_ERROR_SLICES.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de reindexación. Starter: missing→CONTINUE y regresión→CONTINUE — peligro real de reindex silencioso. Falta preamble de presupuesto y cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reindexar: CONTINUE o EVALUATE
- **Proposed preamble:**  
  - **Contexto:** reindexar el corpus del socio no es “probar suerte”: o hay mejora retenida con presupuesto, o se detiene.  
  - **Meta:** `decide` → CONTINUE / KEEP_EMBEDDING_BASELINE / EVALUATE_ERROR_SLICES.  
  - **Éxito:** `CONTINUE KEEP_EMBEDDING_BASELINE EVALUATE_ERROR_SLICES`.  
  - **Límites:** costo ausente no es “barato”; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin `reindex_cost_pen` → EVALUATE_ERROR_SLICES.  
  2. Con schema completo, reutiliza el predicado de promote_ok.  
  3. Solo mejora retenida es CONTINUE.  
  4. Imprime los tres tokens de ruta.
- **Proposed retrospective:**  
  Sin costo medido no hay promote. El error clásico es CONTINUE cuando falta evidencia. Pregunta: ¿por qué un holdout `train` no autoriza reindex?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T1-B.

---

### S48-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de chunking por sección con hash y dedup. Falta preamble de “unidades semánticas vs rebanadas de N letras” y retrospective del misconception “cualquier split sirve si el texto entra al índice”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El reglamento sintético de la cooperativa se parte por **secciones** (`sla`, `horario`), no por bloques de 10 letras. En esta demo cada chunk lleva id `doc#section`, hash estable y provenance `d1-v3`. No escribas: predice los ids y si `unique` es True. Si dos secciones colapsan al mismo hash, la evidencia se duplica o se pierde.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: id trazable + hash único + source_version son el triple de ingesta; rebanar caracteres rompe citas. Puente a We Do: `dedup_meta_ok`, assess DEDUP/MISSING y RESTORE_CHUNK_METADATA.
- **Proposed retrospective:**  
  Chunk semántico = unidad citables con provenance. El error clásico es dedup “por suerte” o version `latest`. We Do: predicado, tres rutas y restore de metadata.
- **Code/output changes:** none
- **Validation notes:** Output `['d1#sla', 'd1#horario']` / `unique True` / `source d1-v3` OK.

---

### S48-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter trata colisión de hashes como éxito. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Dedup de chunks con metadata -v3
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-2A`, la ingesta del reglamento solo pasa si los hashes son únicos, cada section existe y la fuente termina en `-v3`.  
  - **Meta:** implementar `dedup_meta_ok` con esas tres condiciones.  
  - **Éxito:** `S48-T2-A PASS` con hashes a/b y `d1-v3`.  
  - **Límites:** no apruebes colisión; no aceptes section vacía ni version `latest`.
- **Proposed instruction/description improvements:**  
  1. El starter usa `len(set) < len(hashes)` como True (bug: colisión = éxito).  
  2. Exige `len(set) == unique_hashes`, sections no vacías y sufijo `-v3`.  
  3. Conserva print PASS/DEDUP_AND_RECHUNK.
- **Proposed retrospective:**  
  Colisión de hash es breach de evidencia, no “optimización”. El error clásico es invertir el predicado de dedup. Siguiente: PASS / DEDUP / MISSING:source_version.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S48-T2-A-E2 (weDo, independent)
- **Diagnosis:** Válido / colisión+section vacía+latest / sin source_version. Starter invierte PASS. Falta anclar restore de provenance vs rechunk.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess chunks: PASS vs DEDUP vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el pipeline de ingesta en Puno clasifica cada lote: limpio, re-chunk obligatorio o metadata incompleta.  
  - **Meta:** `assess` → PASS / DEDUP_AND_RECHUNK / MISSING:source_version.  
  - **Éxito:** `PASS DEDUP_AND_RECHUNK MISSING:source_version`.  
  - **Límites:** sin source_version no re-chunkes a ciegas; no inventes la versión.
- **Proposed instruction/description improvements:**  
  1. Missing de `source_version` → MISSING antes de mirar hashes.  
  2. PASS solo con hashes únicos, sections y sufijo `-v3`.  
  3. Adverso (colisión / section vacía / latest) → DEDUP_AND_RECHUNK.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  DEDUP es breach de contenido; MISSING es provenance ausente. El error clásico es tratar `latest` como version válida. Luego (E3): CONTINUE / DEDUP / RESTORE_CHUNK_METADATA.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de ingesta. Starter: missing→CONTINUE y colisión→CONTINUE. Falta preamble de fail-closed de reindex.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ingesta: CONTINUE o RESTORE metadata
- **Proposed preamble:**  
  - **Contexto:** indexar chunks sin provenance o con colisión envenena las citas del socio.  
  - **Meta:** `decide` → CONTINUE / DEDUP_AND_RECHUNK / RESTORE_CHUNK_METADATA.  
  - **Éxito:** `CONTINUE DEDUP_AND_RECHUNK RESTORE_CHUNK_METADATA`.  
  - **Límites:** sin versión de fuente no reindexes; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin `source_version` → RESTORE_CHUNK_METADATA.  
  2. Con schema, predicado de dedup+sections+`-v3` → CONTINUE o DEDUP.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  RESTORE detiene la ingesta hasta tener provenance. Pregunta: ¿por qué colisión no es lo mismo que version ausente?
- **Code/output changes:** none
- **Validation notes:** Transfer real.

---

### S48-T2-B-DEMO (iDo)
- **Diagnosis:** Demo excelente de ACL allow/deny y tombstone. Falta preamble de “ACL antes del ranking” y retrospective del misconception “el score alto salva un chunk denegado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El rol `ops` ve el SLA público; el rol `guest` no ve nada; un chunk `deleted` no aparece aunque el rol coincida. En esta demo la ACL se aplica **antes** de rankear. No escribas: predice las listas de `ops` y `guest`. Si un fragmento denegado entra al contexto, el asistente “cita” lo que el socio no puede ver.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: intersección de sets + not deleted es fail-closed; provenance enlaza al doc. Puente a We Do: `acl_active_ok`, FILTER_OR_DELETE y VERIFY_ACL_PROVENANCE.
- **Proposed retrospective:**  
  ACL pre-rank: denegado o borrado = cero candidatos. El error clásico es filtrar después del score. We Do: allow path, deny path y caché no invalidada.
- **Code/output changes:** none
- **Validation notes:** Output `ops ['d1#sla']` / `guest []` / `provenance doc-7-v2` OK.

---

### S48-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte allow/deny (PASS sin intersección o con deleted). Instruction densa; sin title/preamble/retrospective. Feedback menciona allow vs deny pero sin escena de socio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ACL activa con tombstone y caché
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-2B`, un chunk solo es recuperable si hay intersección ACL, no está borrado, tiene provenance `doc-*` y la caché está invalidada.  
  - **Meta:** implementar `acl_active_ok` con esas cuatro condiciones.  
  - **Éxito:** `S48-T2-B PASS` en el allow path (ops ∩ public).  
  - **Límites:** no apruebes deny ni deleted; no ignores `cache_invalidated`.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve True ante deny o deleted (bug invertido).  
  2. Cambia a: ACL∩ ≠ ∅ ∧ not deleted ∧ provenance doc-* ∧ cache True.  
  3. Conserva print PASS/FILTER_OR_DELETE_CHUNK.
- **Proposed retrospective:**  
  Allow path es el único PASS de recuperación. El error clásico es invertir el predicado de intersección. Siguiente: PASS / FILTER / MISSING:cache_invalidated.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; E1 solo prueba allow path (deny en E2) — coherente.

---

### S48-T2-B-E2 (weDo, independent)
- **Diagnosis:** Válido allow / adverso deny+deleted / sin cache_invalidated. Starter invierte PASS. Falta anclar “incertidumbre de caché ≠ deny de ACL”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess ACL: PASS vs FILTER vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el revisor de retrieval no confunde “usuario sin permiso” con “no sé si la caché se invalidó tras el delete”.  
  - **Meta:** `assess` → PASS / FILTER_OR_DELETE_CHUNK / MISSING:cache_invalidated.  
  - **Éxito:** `PASS FILTER_OR_DELETE_CHUNK MISSING:cache_invalidated`.  
  - **Límites:** missing de caché no es FILTER silencioso; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Primero missing de `cache_invalidated`.  
  2. Luego predicado allow completo → PASS o FILTER.  
  3. Adverso (sin intersección / deleted / provenance vacío) → FILTER.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  FILTER es deny o tombstone; MISSING es incertidumbre de invalidación. El error clásico es deny silencioso cuando falta el flag. Luego (E3): CONTINUE / FILTER / VERIFY_ACL_PROVENANCE.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a recuperación segura. Starter: missing→CONTINUE y deny→CONTINUE. Falta preamble de producción fail-closed.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Recuperación: CONTINUE o VERIFY
- **Proposed preamble:**  
  - **Contexto:** servir un chunk sin saber si el tombstone invalidó la caché es fuga de texto viejo al socio.  
  - **Meta:** `decide` → CONTINUE / FILTER_OR_DELETE_CHUNK / VERIFY_ACL_PROVENANCE.  
  - **Éxito:** `CONTINUE FILTER_OR_DELETE_CHUNK VERIFY_ACL_PROVENANCE`.  
  - **Límites:** no conviertas missing en CONTINUE; no apruebes deny.
- **Proposed instruction/description improvements:**  
  1. Sin `cache_invalidated` → VERIFY_ACL_PROVENANCE.  
  2. Con schema, allow path → CONTINUE; deny/deleted → FILTER.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  VERIFY es parada por evidencia incompleta, no un “warning”. Pregunta: ¿por qué un guest con lista vacía es FILTER y no VERIFY?
- **Code/output changes:** none
- **Validation notes:** Transfer real.

---

### S48-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara de fusión híbrida que rescata d1 frente a puro vector (d2) y mide Recall@2. Falta preamble y retrospective del misconception “si corrí el híbrido, el recall ya mejoró”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Para la consulta «SLA p95», el vector prefiere `d2`, pero el lexical marca fuerte `d1`. En esta demo el híbrido con pesos 0.6/0.4 devuelve `d1` y se mide Recall@2 contra gold. No escribas: predice scores, top y recall. Si solo “corres la fórmula” sin gold, no puedes declarar mejora de retrieval.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: fusión ≠ evaluación; Recall@k contra gold es el gate. Puente a We Do: `hybrid_top`, RECALIBRATE y REVIEW_RERANK_CANDIDATES.
- **Proposed retrospective:**  
  Híbrido resuelve el top; Recall@k prueba mejora. El error clásico es promover pesos sin holdout. We Do: top ponderado, tres rutas y recalibración.
- **Code/output changes:** none
- **Validation notes:** Output `scores {'d1': 0.78, 'd2': 0.44}` / `top d1` / `recall@2 1.0` OK.

---

### S48-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa solo max(vector) → elegiría d2. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Top híbrido lexical + vector
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-3A`, el socio busca el SLA: el vector solo elige d2; con pesos 0.6/0.4 el híbrido debe devolver d1.  
  - **Meta:** implementar `hybrid_top` con score ponderado lexical+vector.  
  - **Éxito:** `S48-T3-A PASS` (top == expected_top d1).  
  - **Límites:** no uses solo max(vector); no cambies los pesos del fixture.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve max(vector) (bug: ignora lexical).  
  2. Calcula score = w_lex*lexical + w_vec*vector sobre la unión de keys.  
  3. Devuelve el id de mayor score.  
  4. Conserva print PASS/RECALIBRATE_HYBRID_RANK.
- **Proposed retrospective:**  
  El híbrido debe ganar sobre puro vector cuando el término exacto importa. El error clásico es “semántica basta”. Siguiente: PASS / RECALIBRATE / MISSING:expected_top.
- **Code/output changes:** none
- **Validation notes:** Solution correcta (d1 gana con 0.6/0.4).

---

### S48-T3-A-E2 (weDo, independent)
- **Diagnosis:** Válido (top d1), adverso (d1 débil en ambos canales), sin expected_top. Starter solo max(vector). Falta anclar “sin gold no declares mejora”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess híbrido: PASS vs RECALIBRATE vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el dueño de retrieval calibra pesos solo si el top ponderado cuadra con un gold; si d1 queda débil, no “fuerza” el top.  
  - **Meta:** `assess` → PASS / RECALIBRATE_HYBRID_RANK / MISSING:expected_top.  
  - **Éxito:** `PASS RECALIBRATE_HYBRID_RANK MISSING:expected_top`.  
  - **Límites:** sin expected_top no rankees para PASS; no inventes el gold.
- **Proposed instruction/description improvements:**  
  1. Repara `hybrid_top` (no puro vector).  
  2. Missing de expected_top → MISSING.  
  3. top == expected → PASS; si no → RECALIBRATE.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  RECALIBRATE es breach de ranking; MISSING es gold ausente. El error clásico es declarar mejora sin expected_top. Luego (E3): CONTINUE / RECALIBRATE / REVIEW_RERANK_CANDIDATES.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a rerank fail-closed. Starter: missing→CONTINUE y max(vector)==expected. Falta preamble de producción.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rerank: CONTINUE o REVIEW candidatos
- **Proposed preamble:**  
  - **Contexto:** en producción no calibres pesos sin gold top: o el híbrido cuadra, o se detiene a revisar candidatos.  
  - **Meta:** `decide` → CONTINUE / RECALIBRATE_HYBRID_RANK / REVIEW_RERANK_CANDIDATES.  
  - **Éxito:** `CONTINUE RECALIBRATE_HYBRID_RANK REVIEW_RERANK_CANDIDATES`.  
  - **Límites:** sin expected_top → REVIEW; no uses solo vector.
- **Proposed instruction/description improvements:**  
  1. Missing expected_top → REVIEW_RERANK_CANDIDATES.  
  2. Con schema, score híbrido ponderado vs expected.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  REVIEW detiene el promote de pesos sin gold. Pregunta: ¿por qué d1 débil en lexical y vector no se “salva” con el híbrido?
- **Code/output changes:** none
- **Validation notes:** Transfer real.

---

### S48-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara de claims ⊆ citas + allowlist + abstención. Falta preamble de “cada afirmación material necesita cita resoluble” y retrospective del misconception “más contexto es mejor aunque no se cite”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La respuesta al socio solo es OK si cada claim está citado y permitido, y los tokens no se inflan. En esta demo un contexto limpio pasa; un claim sin soporte se abstiene. No escribas: predice `OK:c1,c2` y `ABSTAIN_UNCITED`. Si el modelo inventa “plazo 48 h” sin evidence_id, el asistente no debe “rellenar con estilo”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: claims ⊆ cited ∩ allowed y presupuesto de tokens; uncited → abstain. Puente a We Do: `context_cited_ok`, ABSTAIN_UNCITED y REQUEST_AUTHORIZED_CONTEXT.
- **Proposed retrospective:**  
  Cita resoluble + tope de tokens = contexto autorizado. El error clásico es contexto inflado o claim huérfano. We Do: predicado, tres rutas y request de contexto.
- **Code/output changes:** none
- **Validation notes:** Output `OK:c1,c2` / `ABSTAIN_UNCITED` / `budget 1000` OK.

---

### S48-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba claims sin cita o ACL rota. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Claims citados bajo tope de tokens
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-3B`, la respuesta al socio solo pasa si claims ⊆ cited, citation_acl True y tokens ≤ max.  
  - **Meta:** implementar `context_cited_ok` con esas tres condiciones.  
  - **Éxito:** `S48-T3-B PASS` con c1,c2 y 800≤1000.  
  - **Límites:** no apruebes claim huérfano; no ignores el tope de tokens.
- **Proposed instruction/description improvements:**  
  1. El starter invierte subset/ACL e ignora tokens (bug).  
  2. Exige claims ⊆ cited ∧ citation_acl ∧ tokens ≤ max.  
  3. Conserva print PASS/ABSTAIN_UNCITED.
- **Proposed retrospective:**  
  Subconjunto de citas es el contrato de groundedness de contexto. El error clásico es PASS con claim sin cita. Siguiente: PASS / ABSTAIN / MISSING:max_context_tokens.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S48-T3-B-E2 (weDo, independent)
- **Diagnosis:** Válido / uncited+ACL false+4000 tokens / sin max_context_tokens. Starter invierte PASS. Falta anclar “sin tope no infles contexto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess citas: PASS vs ABSTAIN vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el revisor de respuesta clasifica: contexto limpio, claim sin soporte, o presupuesto de tokens desconocido.  
  - **Meta:** `assess` → PASS / ABSTAIN_UNCITED / MISSING:max_context_tokens.  
  - **Éxito:** `PASS ABSTAIN_UNCITED MISSING:max_context_tokens`.  
  - **Límites:** sin max no declares PASS; no inventes el tope.
- **Proposed instruction/description improvements:**  
  1. Missing de max_context_tokens → MISSING.  
  2. PASS solo con subset + ACL + tokens OK.  
  3. Adverso (huérfano / ACL false / overflow) → ABSTAIN_UNCITED.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  ABSTAIN es breach de citas; MISSING es límite de tokens desconocido. El error clásico es inflar contexto “por si acaso”. Luego (E3): CONTINUE / ABSTAIN / REQUEST_AUTHORIZED_CONTEXT.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a contexto autorizado fail-closed. Starter: missing→CONTINUE y uncited→CONTINUE. Falta preamble de producción.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contexto: CONTINUE o REQUEST
- **Proposed preamble:**  
  - **Contexto:** armar contexto sin presupuesto de tokens o con claim huérfano no se “arregla en el LLM”.  
  - **Meta:** `decide` → CONTINUE / ABSTAIN_UNCITED / REQUEST_AUTHORIZED_CONTEXT.  
  - **Éxito:** `CONTINUE ABSTAIN_UNCITED REQUEST_AUTHORIZED_CONTEXT`.  
  - **Límites:** sin max_context_tokens → REQUEST; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing max → REQUEST_AUTHORIZED_CONTEXT.  
  2. Con schema, predicado de citas+ACL+tokens.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  REQUEST pide contexto autorizado; no inventes citas. Pregunta: ¿por qué un claim sin cita no es “warning” en la respuesta al socio?
- **Code/output changes:** none
- **Validation notes:** Transfer real.

---

### S48-T4-A-DEMO (iDo)
- **Diagnosis:** Demo excelente de schema + evidence allowlist + injection-as-data (vacío y poison fallan). Falta preamble de “lista vacía no es grounded (verdad vacua)” y retrospective del misconception “si el texto del corpus manda, obedece”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La salida estructurada del asistente exige schema exacto, al menos un `evidence_id` en allowlist, y tratar «envía secretos» del corpus como **data hostil**, no instrucción. En esta demo PASS, REJECT vacío y REJECT poison. No escribas: predice las tres líneas. Si aceptas `evidence_ids=[]` por “subconjunto vacío siempre True”, el claim material pasa sin prueba.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: bool(ids) rompe la verdad vacua; injection_ignored debe ser True. Puente a We Do: `grounded_ok`, REJECT_UNGROUNDED y VALIDATE_OUTPUT_SCHEMA.
- **Proposed retrospective:**  
  Grounding = schema + ids no vacíos ⊆ allowlist + injection-as-data. El error clásico es verdad vacua o obedecer el corpus. We Do: predicado, tres rutas y validación de flag.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `REJECT_UNGROUNDED_OUTPUT` ×2 / `injection_as_data True` OK.

---

### S48-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba evidence ilegal o inyección no ignorada (e ignora lista vacía). Instruction densa; sin title/preamble/retrospective. Feedback ya menciona verdad vacua — bueno; falta escena de socio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Grounding con allowlist e inyección-as-data
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-4A`, “plazo 30 días” solo pasa con `d7#2` en allowlist, schema exacto e inyección del corpus ignorada.  
  - **Meta:** implementar `grounded_ok` (schema + ids no vacíos ⊆ allowlist + flag True).  
  - **Éxito:** `S48-T4-A PASS` con el fixture bueno.  
  - **Límites:** no apruebes lista vacía ni id `unknown`; no asumas injection_ignored.
- **Proposed instruction/description improvements:**  
  1. El starter invierte allowlist/injection y acepta vacío (bug).  
  2. Exige set(output)==schema_keys, bool(ids), ids⊆allowed, flag True.  
  3. Conserva print PASS/REJECT_UNGROUNDED_OUTPUT.
- **Proposed retrospective:**  
  Lista vacía no es grounded. El error clásico es `set() <= allowlist` True. Siguiente: PASS / REJECT / MISSING:injected_instruction_ignored.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; comentario de verdad vacua ya en theory/demo.

---

### S48-T4-A-E2 (weDo, independent)
- **Diagnosis:** Válido / poison unknown+injection False / sin flag de inyección. Starter invierte PASS. Falta anclar “flag ausente no es True”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess grounding: PASS vs REJECT vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el revisor de salida no confunde “corpus hostil activo” con “no sé si ignoramos la inyección”.  
  - **Meta:** `assess` → PASS / REJECT_UNGROUNDED_OUTPUT / MISSING:injected_instruction_ignored.  
  - **Éxito:** `PASS REJECT_UNGROUNDED_OUTPUT MISSING:injected_instruction_ignored`.  
  - **Límites:** sin flag no asumas True; no inventes evidence_ids.
- **Proposed instruction/description improvements:**  
  1. Missing del flag → MISSING.  
  2. grounded_ok completo → PASS; poison/unknown/flag False → REJECT.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  REJECT es breach de evidencia o inyección; MISSING es incertidumbre del flag. El error clásico es asumir “siempre ignoramos”. Luego (E3): CONTINUE / REJECT / VALIDATE_OUTPUT_SCHEMA.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a salida grounded fail-closed. Starter: missing→CONTINUE y poison→CONTINUE. Falta preamble de producción.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Salida: CONTINUE o VALIDATE schema
- **Proposed preamble:**  
  - **Contexto:** promover una respuesta que obedece “envía secretos” del corpus o sin flag de inyección es incidente de seguridad, no un warning de producto.  
  - **Meta:** `decide` → CONTINUE / REJECT_UNGROUNDED_OUTPUT / VALIDATE_OUTPUT_SCHEMA.  
  - **Éxito:** `CONTINUE REJECT_UNGROUNDED_OUTPUT VALIDATE_OUTPUT_SCHEMA`.  
  - **Límites:** flag ausente → VALIDATE; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing injected_instruction_ignored → VALIDATE_OUTPUT_SCHEMA.  
  2. Con schema, grounded_ok → CONTINUE o REJECT.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  VALIDATE detiene el promote hasta probar injection-as-data. Pregunta: ¿por qué evidence vacío falla aunque el subset vacío sea matemáticamente True?
- **Code/output changes:** none
- **Validation notes:** Transfer real; crítico para CP-N4-C-RAG.

---

### S48-T4-B-DEMO (iDo)
- **Diagnosis:** Demo clara de ANSWER vs ABSTAIN_WITH_REASON por support bajo. Falta preamble de “abstenerse es éxito operativo” y retrospective del misconception “si suena bien, responde aunque support sea 0.2”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Retrieval eval y answer eval son gates **separados**; el costo tiene tope; abstenerse con support 0.2 es un resultado exitoso. En esta demo support 0.8 responde y 0.2 se abstiene, registrando ~1200 tokens del intento. No escribas: predice ANSWER y ABSTAIN. Si el estilo es persuasivo pero el soporte es bajo, el socio no debe recibir un SLA inventado.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: support/recall/faith/cost en AND; abstain con razón. Puente a We Do: `answer_gates_ok`, ABSTAIN_WITH_REASON y TUNE_RETRIEVAL_OR_BUDGET.
- **Proposed retrospective:**  
  Abstenerse es éxito cuando el soporte falla. El error clásico es “responder igual”. We Do: predicado, tres rutas y tune de retrieval/presupuesto.
- **Code/output changes:** none
- **Validation notes:** Output `ANSWER` / `ABSTAIN_WITH_REASON` / `cost_tokens 1200` OK.

---

### S48-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba faithfulness baja o support False. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gates de eval y support para responder
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PUN-048-4B`, solo se responde si recall, faithfulness, costo y support pasan los umbrales.  
  - **Meta:** implementar `answer_gates_ok` con cuatro AND.  
  - **Éxito:** `S48-T4-B PASS` con el fixture válido (support True).  
  - **Límites:** no apruebes faith baja ni support False; no ignores recall/costo.
- **Proposed instruction/description improvements:**  
  1. El starter invierte faith e ignora recall/costo (bug).  
  2. Exige recall≥min, faith≥min, cost≤cap, support True.  
  3. Conserva print PASS/ABSTAIN_WITH_REASON.
- **Proposed retrospective:**  
  Los cuatro umbrales son AND, no “casi”. El error clásico es solo mirar estilo/faith. Siguiente: PASS / ABSTAIN / MISSING:support.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S48-T4-B-E2 (weDo, independent)
- **Diagnosis:** Válido / umbrales rotos+support False / sin support. Starter invierte PASS. Falta anclar “sin flag support no respondas”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess eval: PASS vs ABSTAIN vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el revisor de respuesta no confunde “support medido en False” con “ni siquiera medimos support”.  
  - **Meta:** `assess` → PASS / ABSTAIN_WITH_REASON / MISSING:support.  
  - **Éxito:** `PASS ABSTAIN_WITH_REASON MISSING:support`.  
  - **Límites:** sin support no respondas; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Missing de support → MISSING.  
  2. Cuatro AND → PASS o ABSTAIN_WITH_REASON.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  ABSTAIN es breach de umbral; MISSING es métrica ausente. El error clásico es responder sin medir support. Luego (E3): CONTINUE / ABSTAIN / TUNE_RETRIEVAL_OR_BUDGET.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S48-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a promoción con abstención. Starter: missing→CONTINUE y faith baja→CONTINUE. Falta preamble de “abstain es éxito operativo en producción”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Responder: CONTINUE o TUNE budget
- **Proposed preamble:**  
  - **Contexto:** en producción del asistente de Puno, support bajo se abstiene con razón; sin métrica de support se afinan retrieval o presupuesto, no se “sigue con warning”.  
  - **Meta:** `decide` → CONTINUE / ABSTAIN_WITH_REASON / TUNE_RETRIEVAL_OR_BUDGET.  
  - **Éxito:** `CONTINUE ABSTAIN_WITH_REASON TUNE_RETRIEVAL_OR_BUDGET`.  
  - **Límites:** sin support → TUNE; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing support → TUNE_RETRIEVAL_OR_BUDGET.  
  2. Con schema, answer_gates_ok → CONTINUE o ABSTAIN.  
  3. Imprime los tres tokens.
- **Proposed retrospective:**  
  ABSTAIN es éxito operativo si el soporte falla; TUNE pide medición. Pregunta: ¿por qué un recall alto no basta si support es False?
- **Code/output changes:** none
- **Validation notes:** Transfer real; cierra el arco de S48 hacia youDo.

---

### S48-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context de cooperativa Puno, objectives con CP-N4-C-RAG, requirements (ingesta, híbrido, citas, evals, normal/breach/uncertain), starter con CORPUS ACL+tombstone y `retrieve`/`answer` NotImplemented, rubric 6 criterios, portfolioNote de BLOCKED→READY. Falta **`retrospective`** metacognitiva post-build (defensa de 30 s, PII sintético, qué invariante demuestras).
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene `title`)
- **Proposed preamble:** N/A — `context` ya cubre escena y gate; no duplicar en preamble de We Do.
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional (P2): en `portfolioNote` o README del learner, una línea que diga “defiende en 30 s: un claim sin evidence_id → ABSTAIN”. No es obligatorio para el Fixer de campos schema.
- **Proposed retrospective:**  
  Antes de marcar READY: (1) ¿qué invariante de CP-N4-C-RAG demuestras con un test o print (claims ⊆ evidence_ids permitidos, ACL pre-rank, o abstain por support bajo)? (2) ¿qué harías distinto con documentos reales vs. sintéticos (PII, ACL de legal)? (3) Escribe en el README una frase de impacto medible (antes: respuesta sin cita / después: ABSTAIN o cita resoluble) que puedas defender en 30 segundos ante un revisor de plataforma.
- **Code/output changes:** none
- **Validation notes:** Starter imprime `CASO-PUN-048 BLOCKED` con missing de REQUIRED a propósito; no cambiar asserts de readiness.

---

## Priority order

### P0 (bloquear sin estos campos en We Do)
1. Añadir `title` + `preamble` + `retrospective` a los **24** We Do (E1/E2/E3 de T1-A … T4-B).
2. Separar `instruction` a pasos solo-tarea (meta/éxito/límites viven en preamble).
3. Respetar fade de prosa: E1 nombra el defect y el cuerpo de la función; E2 tres rutas válido/adverso/missing; E3 CONTINUE/breach/review sin clonar el párrafo de E1.
4. Subtemas de mayor riesgo de promote silencioso si el learner no entiende missing≠breach: **T2-B ACL**, **T4-A grounding/inyección**, **T4-B abstención** — priorizar prosa clara ahí si el Fixer va por lotes.

### P1
1. Añadir `preamble` + `retrospective` a las **8** I Do demos.
2. Ampliar `why` de I Do al rango 40–90 palabras (hoy ~1 frase).
3. Añadir `retrospective` al **youDo**.
4. Endurecer `feedback` We Do (25–60 palabras) donde solo nombra el código de error sin el “por qué importa al socio / al índice”.

### P2
1. Alinear `description` I Do con el lenguaje de preamble (sin reescribir código).
2. Opcional: una línea en portfolioNote sobre defensa de 30 s (no cambiar tests).
3. Nota de naming: `id: ai-governance` vs título RAG — documentar si el orchestrator limpia ids; no es trabajo de esta ronda de ejercicios.

---

## Residual risks

1. **Prosa clonada E1/E2/E3:** el patrón de código es idéntico en forma (assess/decide) en los 8 subtemas; el Fixer debe variar la *escena* (ranking, reindex, chunk, ACL, híbrido, citas, grounding, abstain) y no copiar el mismo preamble con un token distinto.
2. **Verdad vacua de evidence vacío:** T4-A es fácil de “arreglar” con `set(ids) <= allowed` sin `bool(ids)`; la prosa debe insistir en el misconception aunque el solutionCode ya lo tenga.
3. **ACL post-rank como hábito de industria:** el learner puede haber visto tutorials que rankean y luego filtran; T2-B debe dejar el orden pre-rank grabado.
4. **Abstenerse ≠ fallo personal:** T4-B y youDo deben decir que ABSTAIN es éxito operativo; si la retrospective suena a “fallaste”, el learner forzará ANSWER.
5. **id `ai-governance`:** confusión al grepear el repo; no es riesgo pedagógico del learner en UI si el título se muestra bien.
6. **Carga cognitiva Master:** 24 We Do + 8 I Do es denso; preambles cortos (80–150) son obligatorios para no sumar ensayo a cada drill.

---

## Fixer handoff checklist (para la siguiente ronda)

- [ ] Cada iDo: `preamble` + `retrospective` (+ `why` ampliado si cabe)
- [ ] Cada weDo: `title` + `preamble` + `instruction` solo-pasos + `retrospective` (+ `feedback` endurecido)
- [ ] youDo: `retrospective` de defensa post-build
- [ ] Outputs y asserts **sin cambiar** salvo justificación execute-and-diff
- [ ] Español PE, CASO-PUN-048 sintético, sin PII real
- [ ] Sin generadores / bulk templates
- [ ] Section source compila en static build

---

Section 48 exercise pedagogy review complete. Ready for the Fixer prompt.
