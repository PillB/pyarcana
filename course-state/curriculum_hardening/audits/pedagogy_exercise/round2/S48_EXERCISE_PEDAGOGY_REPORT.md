# S48 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Aplicaciones LLM y RAG con evidencia
- **shortTitle:** RAG con evidencia
- **id:** `ai-governance` (archivo `s48-ai-governance.ts`; el **contenido** es asistente RAG con citas, ACL y abstención — no “governance abstracta” de política)
- **index:** 48
- **source:** `src/lib/course/sections/s48-ai-governance.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A embeddings/similitud · T1-B baseline/promoción holdout · T2-A chunking/dedup · T2-B ACL/tombstone · T3-A híbrido/Recall@k · T3-B citas/contexto · T4-A grounding/inyección · T4-B eval/abstención/costo
- **hilo:** cooperativa sintética **CASO-PUN-048** (Puno) — socio pregunta por SLA/reglamento; gate **CP-N4-C-RAG** (claims ⊆ citas permitidas, ACL pre-rank, abstenerse si support insuficiente); **missing ≠ breach**; stdlib sin API de LLM reales ni PII
- **Round 1 context:** `round1/S48_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (p. ej. T1-A-E1 usa `min`; T2-A-E1 trata colisión como éxito; T2-B-E1 invierte allow; T4-A-E1 acepta vacío/allowlist invertida). Correcto: el learner ve REJECT y debe reparar el predicado.
  2. **E2/E3 reutilizan el mismo bug de predicado** y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *prosa* y de *decisión* es real (escenas por subtema).
  3. **missing → CONTINUE en starters E3** en los 8 subtemas — defecto de promote silencioso bien nombrado; solution enruta REVIEW/EVALUATE/RESTORE/VERIFY/REQUEST/VALIDATE/TUNE.
  4. **Verdad vacua T4-A:** demo y solution exigen `bool(ids)`; starter E1 no comprueba vacío — defect didáctico alineado a theory.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–9 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈42–76 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈53–69 w) | Pass en estructura; iDo algo cortos vs 80–150 narrativo, pero legibles y con “no escribas / predice” |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect del starter; E2/E3 con menos migas de “por qué” | Pass; E3 a veces 3 pasos densos de regla (aceptable transfer; algunos ~16–22 w bajo el piso 40 del rango — OK por minimal transfer) |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/REJECT/MISSING → decide CONTINUE/breach/rama. Escenas diferenciadas (ranking, reindex, chunk, ACL, híbrido, citas, grounding, abstain) | Pass — no tres clones de prosa; residual **código** repetido (mismo pred invertido en E1–E3) es patrón de sección Master, no bug de R2 |
| **Feedback vs retrospective** | Feedback razona principio + impacto al socio/índice; en **~16/24** weDo el retro **repite** el feedback (mismo principio, poco self-check en E1/E2) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈22–33 w (spec 40–80); E3 suelen tener pregunta self-check (mejor); E1 a menudo solo “principio + error clásico + siguiente”. iDo demos ~22–39 w | Residual **P2** (pocos **P1** de metacognición en temas de alto riesgo: ACL, grounding, abstain) |
| **iDo why** | Todos en o cerca del rango 40–90; anclan contrato del índice y puente a We Do | Pass |
| **Código/outputs** | Coherentes con theory y CP-N4-C-RAG; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context con CP-N4-C-RAG, objectives, requirements, rubric, portfolioNote (BLOCKED→READY), starter calculado, retrospective de defensa (~75 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Id archivo vs contenido** | `ai-governance` / `s48-ai-governance.ts` vs título RAG | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros E1/E2 cortas sin self-check, hints densos, patrón de código E1–E3 repetido). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right total) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S48-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de ranking por dot product con predicción pedida (`top d1`, `score_d1 0.8`). Preamble ancla “ordenar ≠ autorizar claim” y emb-v2. `why` en rango (top reproducible, versión como contrato, no prueba verdad, puente We Do). Retrospective repara similitud-como-prueba; ~39 w, casi en rango.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: +1 self-check “¿score alto implica claim verdadero?”)
- **Code/output changes:** none

### S48-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S48-T1-A PASS`; instruction nombra `min` + versión. Feedback ancla emb-v2 al socio. Retro (~27 w) eco parcial + puente a E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Ranking = max(dot) + `emb-v2` fijada. El starter elige el peor score y omite la versión: el socio vería el fragmento equivocado. Pregunta: si el assert “pasa” con top inventado y version vacía, ¿qué falló — el assert o el contrato del índice? Siguiente (E2): tres rutas PASS / REJECT / MISSING:expected_top.
- **Code/output changes:** none

### S48-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres rutas. Preamble “missing ≠ aceptar” excelente. Feedback y retro casi idénticos (“Missing es incertidumbre… top incorrecto es breach”).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un gold ausente no es un ranking roto: es evidencia de eval incompleta. Versión vacía o top ≠ expected sí es breach. El error clásico es rankear sin gold para “completar” la tabla. Pregunta: ¿en qué orden evalúas missing vs max(dot), y por qué? Luego (E3): CONTINUE / REJECT / REVIEW_METRIC_VERSION.
- **Code/output changes:** none

### S48-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a códigos de acción. Starter missing→CONTINUE y min→worst (promote silencioso). Preamble “no hay seguir con warning”. Retro con self-check REJECT vs REVIEW — metacognición usable. Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** PROMOTE vs KEEP con predicción pedida. `why` triple improve+min+cost y holdout train. Retro corta (~25 w) con misconception “modelo nuevo = mejor”; sin self-check explícito.
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Promoción = mejora retenida con presupuesto en holdout RAG. El error clásico es reindexar por nombre de modelo. Pregunta: si candidate=0.81 pero holdout es `train` y costo 300, ¿qué token imprime y por qué no es PROMOTE? We Do: predicado, tres rutas y EVALUATE_ERROR_SLICES.
- **Code/output changes:** none

### S48-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba regresión o holdout vacío — excelente. Instruction guiada. Feedback con números del fixture (0.81/0.72/30 PEN). Retro eco “KEEP es éxito de gobernanza” sin self-check.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cuatro AND (umbral, mejora, `rag-holdout-*`, costo ≤ 50) son el contrato de reindex. KEEP ante regresión protege al socio de peores citas. Pregunta: ¿un holdout vacío es KEEP o un bug del predicado? Siguiente: PASS / KEEP / MISSING:reindex_cost_pen.
- **Code/output changes:** none

### S48-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres registros mejora / regresión+train+300 / sin costo. Feedback ≈ retro (KEEP vs MISSING). Fade de prosa OK.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  KEEP es breach de promoción demostrada; MISSING es presupuesto desconocido — no asumas costo cero. El error clásico es inventar 0 PEN para forzar PASS. Pregunta: ¿por qué costo ausente no se trata igual que regresión? Luego (E3): CONTINUE / KEEP / EVALUATE_ERROR_SLICES.
- **Code/output changes:** none

### S48-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Reindex fail-closed. Starter missing→CONTINUE y regresión→CONTINUE. Retro con self-check holdout train. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Chunk por sección, hash, unique, d1-v3. Preamble “no rebanar 10 letras”. Retro ~27 w; misconception `latest`/dedup por suerte.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Chunk semántico = unidad citable con provenance. Colisión de hash no es optimización: es evidencia duplicada o perdida. Pregunta: si dos secciones comparten hash, ¿qué token de breach debe forzar re-chunk? We Do: predicado, tres rutas y RESTORE_CHUNK_METADATA.
- **Code/output changes:** none

### S48-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter `len(set) < len` como éxito (colisión = PASS) — defect memorable. Instruction clara. Retro corta, eco del feedback.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Dedup exige hashes únicos, sections no vacías y sufijo `-v3`. El starter invierte “menos uniques = mejor”. Pregunta: con hashes `a,a` y `unique_hashes=2`, ¿PASS o DEDUP? Siguiente: PASS / DEDUP / MISSING:source_version.
- **Code/output changes:** none

### S48-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Válido / colisión+section vacía+latest / sin source_version. Feedback≈retro sobre DEDUP vs MISSING.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  DEDUP es breach de contenido; MISSING es provenance ausente — no re-chunkes a ciegas sin versión. El error clásico es tratar `latest` como `-v3`. Pregunta: ¿por qué missing de source_version no es lo mismo que colisión? Luego (E3): CONTINUE / DEDUP / RESTORE.
- **Code/output changes:** none

### S48-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer real. Retro con self-check colisión vs version ausente (~18 w) — pregunta buena, cuerpo corto.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  RESTORE detiene la ingesta hasta tener provenance; DEDUP fuerza re-chunk de contenido. Colisión no es “falta de campo”: es evidencia corrupta. Pregunta: ¿por qué colisión no es lo mismo que version ausente, y cuál detiene el promote del índice? Imprime los tres tokens en orden.
- **Code/output changes:** none

---

### S48-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** ACL pre-rank, ops vs guest, tombstone. Preamble predice listas. `why` fail-closed + provenance. Retro nombra “filtrar después del score” — misconception de industria clave.
- **Checklist:** all pass
- **Severity residual:** none (opcional P2: self-check “¿score 0.99 salva un deleted?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S48-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invierte allow/deny. Feedback ancla guest. Retro ~24 w sin self-check. Tema de alto riesgo: residual de metacognición merece atención.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2 (casi P1 por riesgo ACL)
- **Proposed retrospective (replace):**  
  Allow path = intersección ACL ∧ not deleted ∧ provenance `doc-*` ∧ caché invalidada. El starter aprueba deny/deleted: fuga al socio. Pregunta: si `ops` ∩ `legal` es vacío, ¿PASS o FILTER — y en qué momento del pipeline se decide? Siguiente: PASS / FILTER / MISSING:cache_invalidated.
- **Code/output changes:** none

### S48-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Excelente escena “deny ≠ incertidumbre de caché”. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  FILTER es deny o tombstone demostrable; MISSING es no saber si el delete invalidó la caché. El error clásico es deny silencioso cuando falta el flag. Pregunta: ¿por qué inventar `cache_invalidated=True` es peor que devolver MISSING? Luego (E3): CONTINUE / FILTER / VERIFY_ACL_PROVENANCE.
- **Code/output changes:** none

### S48-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Producción fail-closed. Starter missing→CONTINUE y deny→CONTINUE. Retro con self-check guest FILTER vs VERIFY. Crítico y bien cerrado.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** Híbrido rescata d1; Recall@2. Preamble “fórmula ≠ mejora”. Retro ~23 w corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Híbrido resuelve el top; Recall@k contra gold prueba mejora. El error clásico es promover pesos sin holdout. Pregunta: si solo corres la fusión y no mides gold, ¿puedes declarar recall mejor? We Do: top ponderado, tres rutas y recalibración.
- **Code/output changes:** none

### S48-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter max(vector)→d2; solution d1 con 0.6/0.4. Feedback ancla SLA del socio. Retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Score = w_lex×lexical + w_vec×vector; “semántica basta” elige d2 y pierde el término SLA. Pregunta: con pesos 0.6/0.4, ¿por qué d1 (0.9/0.6) vence a d2 (0.2/0.8)? Siguiente: PASS / RECALIBRATE / MISSING:expected_top.
- **Code/output changes:** none

### S48-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** d1 débil en adverso no se “salva” con híbrido. Feedback≈retro RECALIBRATE vs MISSING.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  RECALIBRATE es breach de ranking; MISSING es gold ausente — no declares mejora de recall sin expected_top. El error clásico es forzar top=d1 en código sin scores. Pregunta: si d1 es débil en ambos canales, ¿el híbrido puede inventar un PASS? Luego (E3): CONTINUE / RECALIBRATE / REVIEW.
- **Code/output changes:** none

### S48-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real. Retro self-check d1 débil. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** OK:c1,c2 vs ABSTAIN_UNCITED. Preamble “no rellenar con estilo”. Why + retro alineados a claims ⊆ cited ∩ allowed.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S48-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invierte subset/ACL e ignora tokens. Feedback bueno. Retro eco “subset = groundedness”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Claims ⊆ cited ∧ ACL True ∧ tokens ≤ max es el triple de contexto. PASS con claim huérfano inventa SLA al socio. Pregunta: con tokens 4000 y max 1000, aunque las citas cuadren, ¿PASS o ABSTAIN? Siguiente: PASS / ABSTAIN / MISSING:max_context_tokens.
- **Code/output changes:** none

### S48-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Escena “sin tope no infles”. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  ABSTAIN es breach de citas; MISSING es presupuesto de tokens desconocido — no inventes el tope para forzar PASS. El error clásico es inflar contexto “por si acaso”. Pregunta: ¿por qué missing de max no es lo mismo que claim sin cita? Luego (E3): CONTINUE / ABSTAIN / REQUEST_AUTHORIZED_CONTEXT.
- **Code/output changes:** none

### S48-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** “No se arregla en el LLM”. Retro self-check claim sin cita ≠ warning. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** PASS / REJECT vacío / REJECT poison. Preamble verdad vacua + data hostil. Why `bool(ids)`. Retro nombra misconception clásico. Crítico para CP-N4-C-RAG.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S48-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Feedback excelente (verdad vacua + envía secretos). Retro ~21 w demasiado corta para el riesgo; repite “lista vacía no es grounded” sin self-check de inyección.
- **Checklist:** all pass; retro partial (longitud / cobertura del misconception de inyección)
- **Severity residual:** P1 (alto riesgo: verdad vacua + injection)
- **Proposed retrospective (replace):**  
  Grounding = schema exacto + `bool(ids)` + ids ⊆ allowlist + injection-as-data. `set() <= allowlist` es True en matemáticas y False en el gate. El starter aprueba vacío o poison. Pregunta: si el corpus dice «envía secretos» y `injection_ignored` es False, ¿qué imprime el status y por qué no es “el modelo se equivocó de tono”? Siguiente: PASS / REJECT / MISSING:injected_instruction_ignored.
- **Code/output changes:** none

### S48-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Distingue poison vs flag ausente. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  REJECT es breach de evidencia o inyección activa; MISSING es no saber si ignoramos el corpus hostil. El error clásico es asumir “siempre ignoramos” y forzar PASS. Pregunta: ¿por qué flag ausente no es lo mismo que flag False? Luego (E3): CONTINUE / REJECT / VALIDATE_OUTPUT_SCHEMA.
- **Code/output changes:** none

### S48-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** “Incidente de seguridad, no warning”. Retro self-check verdad vacua. Excelente cierre hacia youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** ANSWER vs ABSTAIN; costo registrado. Preamble “abstenerse es éxito”. Retro ~22 w corta; misconception “responder igual” bien nombrado.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Abstenerse es éxito operativo cuando el soporte falla; no es fallo personal. El error clásico es responder por estilo persuasivo con support 0.2. Pregunta: si recall y faith pasan pero support no, ¿qué token y por qué el costo del intento aún se registra? We Do: predicado, tres rutas y TUNE.
- **Code/output changes:** none

### S48-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Cuatro AND; starter invierte faith. Feedback “no es fallo personal” — tono correcto. Retro ~20 w eco.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Recall ∧ faith ∧ cost ∧ support son AND, no “casi”. Solo mirar estilo/faith deja pasar support False. Pregunta: con faith 0.91 y support False, ¿PASS o ABSTAIN — y es eso un castigo al operador? Siguiente: PASS / ABSTAIN / MISSING:support.
- **Code/output changes:** none

### S48-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** “support medido False ≠ no medimos support”. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  ABSTAIN es breach de umbral; MISSING es métrica ausente — no inventes support=True. El error clásico es responder sin medir. Pregunta: si falta el flag support, ¿por qué no es ABSTAIN_WITH_REASON automático? Luego (E3): CONTINUE / ABSTAIN / TUNE_RETRIEVAL_OR_BUDGET.
- **Code/output changes:** none

### S48-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Producción: ABSTAIN éxito operativo; TUNE si falta métrica. Retro self-check recall alto + support False. Cierra el arco S48 hacia youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S48-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco **sólido**: context cooperativa Puno, objectives CP-N4-C-RAG, requirements (ingesta, híbrido, citas, evals, normal/breach/uncertain), starter CORPUS ACL+tombstone con `retrieve`/`answer` NotImplemented y readiness BLOCKED a propósito, rubric 6 criterios, portfolioNote, **retrospective** de defensa en 30 s (~75 w) con tres preguntas (invariante, PII real vs sintético, impacto medible). Un true newbie sabe qué construir, cómo falla, y qué defender.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: una línea en portfolioNote “defiende claim sin evidence_id → ABSTAIN” — no cambiar tests)
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
Ninguno. Cobertura de campos y outputs canónicos están en verde.

### P1 (pocos, alto valor de metacognición)
1. **S48-T4-A-E1** retrospective: expandir para cubrir verdad vacua **e** injection-as-data (hoy ~21 w y solo lista vacía).
2. Opcional si el Fixer va por riesgo: **S48-T2-B-E1** retrospective (ACL pre-rank / guest) — hoy P2, subir si el lote de polish toca solo 2–3 unidades.

### P2 (sistemático, polish)
1. **Desacoplar feedback vs retrospective** en ~16 We Do E1/E2 donde el retro repite el feedback palabra por palabra (T1-A-E2, T1-B-E2, T2-A-E2, T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-B-E2 y varios E1).
2. **Expandir retros E1/E2** hacia 40–60 palabras con 1 self-check (sin reescribir instruction ni starter).
3. **iDo retros cortas** (T1-B, T2-A, T3-A, T4-B): +self-check o +1 frase de transferencia; no reescribir preambles ya buenos.
4. **Hints E2/E3:** opcional suavizar spoiler de la regla completa (Master tolera densos; no bloquear).
5. Naming `id: ai-governance` — documentar para otra campaña; no es trabajo de ejercicios R2.

### Explicit non-goals
- No cambiar outputs, asserts ni fixtures.
- No “arreglar” el `id` del section.
- No clonar el mismo párrafo expandido en los 24 We Do: variar escena (ranking / reindex / chunk / ACL / híbrido / citas / grounding / abstain).

---

## Residual risks

1. **Eco feedback/retro:** el learner lee el mismo principio dos veces y salta el self-check; el Fixer debe reescribir retro como “principio + misconception + pregunta”, no copiar feedback.
2. **Verdad vacua T4-A:** si el learner “arregla” con solo `set(ids) <= allowed` sin `bool(ids)`, la prosa de E1 debe seguir insistiendo (solution ya correcto).
3. **ACL post-rank como hábito de industria:** T2-B demo/E3 lo dicen bien; E1 retro corta no debe diluir el orden pre-rank.
4. **ABSTAIN ≠ fallo personal:** T4-B y youDo lo sostienen; si un polish reintroduce tono punitivo, el learner forzará ANSWER.
5. **Carga cognitiva Master (24 We Do):** no inflar preambles a ensayos; preferir retro + self-check sobre más bullets.
6. **Código E1–E3 repetido:** patrón de sección; no es bug pedagógico de prosa si las escenas de preamble se mantienen distintas.

---

## Fixer handoff checklist (Round 2)

- [ ] Priorizar P1: T4-A-E1 retrospective (y opcional T2-B-E1)
- [ ] Desacoplar ~16 retros E1/E2 del feedback (hand-written, no template)
- [ ] Expandir retros iDo cortas solo donde falte self-check (T1-B, T2-A, T3-A, T4-B)
- [ ] Outputs y asserts **sin cambiar**
- [ ] Español PE, CASO-PUN-048 sintético, sin PII real
- [ ] Sin generadores / bulk templates
- [ ] Section source compila en static build

---

## Score summary (counts)

| Score | Units (approx.) |
|-------|-----------------|
| **A / A−** | ~14 (8 demos en A/A−; ~6 E3 A; youDo A; varios transfer) |
| **B** | ~18 (mayoría E1/E2 + demos con retro corta) |
| **C / D** | **0** |
| **P0 residual** | **0** |
| **P1 residual** | **1** (T4-A-E1 retro; +1 opcional T2-B-E1) |
| **P2 residual** | sistemático (eco + longitud retro) |

**Verdict:** Section 48 está **learner-ready** tras Round 1. Round 2 Fixer es **tighten only** — no reabrir código ni reescribir preambles enteros.

---

Section 48 exercise pedagogy review complete. Ready for the Fixer prompt.
