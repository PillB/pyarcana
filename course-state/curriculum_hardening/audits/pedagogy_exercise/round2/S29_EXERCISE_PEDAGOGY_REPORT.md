# S29 Exercise Pedagogy Report (Round 2)

## Section
- **title:** SQL avanzado y modelado relacional
- **shortTitle:** SQL almacén ER
- **id:** `mlops` (archivo `s29-mlops.ts`; contenido = almacén relacional del ER en SQLite de lab, **no** MLOps de pipelines ML)
- **index:** 29
- **source:** `src/lib/course/sections/s29-mlops.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A PK/FK/CHECK · T1-B temporalidad/provenance · T2-A CTE/windows/anti-join · T2-B cardinalidad/NULL/planes · T3-A ACID/transacciones · T3-B upserts/reintentos · T4-A índices/migraciones · T4-B repository/tests
- **hilo:** almacén de verdad ER del capstone **CP-N3-A** (fixture **CASO-LIM-029**, `run_id=cpn3a-sql`, correos `@example.pe`, ids `ent-00N`); *match ≠ fraude* ni parentesco; fail-closed si falta llave o fan-out no documentado
- **Round 1 context:** `round1/S29_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Integrity traps checked against code (not assumed from Round 1): (1) T1-A-E3 sin PRAGMA → insert huérfano imprime `fk_ignored`; (2) T1-B-E1 UPDATE in-place → count 1 vs append-only 2; (3) T2-A-E1 INNER JOIN pierde `p2`; (4) T2-B-E2 doble `= null` → `0 0` vs `0 1`; (5) T3-A-E2 commit parcial de decisión; (6) T4-B-E3 SQL correcto + `print(0)` hardcode.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes; español PE; alineados al skill | Pass en legibilidad; algunos cortos vs 4–12 palabras del spec (p. ej. T4-A-E1/E2/E3, T4-B-E1) — **P2** |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass; bullets ~44–66 palabras (aceptable por “4 short bullets”); iDo narrativos a veces <80 palabras pero cubren checklist |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass; **T4-A-E2** paso 4 mezcla “opcional asserts” (nota de solution, no tarea del learner) — **P2** |
| **E1→E2→E3 fade** | Superficies distintas por subtema (PK → CHECK → FK/PRAGMA; append-only → provenance → IS NULL; anti-join → ROW_NUMBER → PARTITION BY; C(n,2) → NULL SQL → EXPLAIN; ROLLBACK → atomicidad → evidence_ok; upsert → job pending → A&lt;B; MAX(v) → índice real → no_drop; get → 3 conexiones → pending_count) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele nombrar bug + impacto al almacén; en **~10** unidades el retro **repite** el feedback (misma frase de apertura, sin metacognición extra o con self-check débil) | Residual **P2** sistemático |
| **Retrospective length** | Mediana weDo ≈21–36 palabras (spec 40–80); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback. Peores: **T1-B-E1** (~21 w), **T3-A-E1** (~20 w), **T2-A-E1** (~23 w eco) | Residual **P2** (pocos rozan **P1** de metacognición fina) |
| **iDo why** | En rango 40–64 palabras en las 8 demos | Pass (Round-1 “why de 1 frase” **cerrado**) |
| **iDo retrospective** | Presentes; varias 27–35 w (bajo piso 40); T1-A fuerte con hábito; resto con principio + error clásico + puente We Do, a menudo sin self-check | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CP-N3-A; DEFECT bien nombrados; anti-patrones de producto fuertes (UPDATE label, FK sin PRAGMA, INNER como cola, `= NULL`, commit parcial, hardcode count, DROP sin backup) | Sin hueco wrong≈right detectado |
| **youDo frame** | context, objectives, requirements, rubric, portfolioNote, retrospective de defensa (~75 w) | Pass |
| **Hints E3** | Aún cerca de la fórmula en varios transfer (PRAGMA, PARTITION BY, if not evidence_ok) — aceptable como andamiaje mínimo | Residual **P2** opcional aflojar 1 miga |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, títulos muy breves, un paso de instruction confuso). **No hay P0** de cobertura ni defectos de integridad que invaliden outputs.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S29-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: score 0.5, pairs 1, `fk_pragma 1`. Preamble pide predicción y ancla “REFERENCES sin PRAGMA es decoración”. `why` (~64 w) en rango. Retrospective repara “el DDL solo basta” y puente a We Do PK/CHECK/FK.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `1`; instruction nombra bug de duplicado; feedback razona identidad del grafo ER; retro distingue PK como ancla + puente E2. Sin eco crudo feedback/retro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~31 w → +1 self-check “¿qué imprime COUNT si reinsertas e1 con PK?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** DEFECT `skipped_check` excelente. Preamble ancla score 1.5 en cola. Feedback y retro abren con la misma frase (“El CHECK no es documentación…”); el retro añade el misconception Python-vs-motor (valor real) pero suena a copiar-pegar.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Validar el score en el motor (CHECK + IntegrityError) no es lo mismo que confiar en un guard de Python: alguien puede escribir SQL directo y meter basura en la cola. El error clásico es “arreglar” el insert a 1.0 en silencio. Pregunta: ¿0 y 1 son válidos con `BETWEEN 0 AND 1`? Luego (E3): FK real con PRAGMA.
- **Code/output changes:** none

### S29-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer auténtico; éxito `fk_rejected`; preamble ancla par huérfano; retro con self-check de pool/script nuevo (buen Gagné transfer). Feedback y retro solapan la frase del PRAGMA, pero el self-check salva la metacognición.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (hints E3 casi dan la línea del PRAGMA — aflojar a “habilita FK *antes* del insert de prueba”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T1-B-DEMO (iDo) — **B+**
- **Diagnosis:** Historia `['review','match']` + `append_only True`. Preamble fuerte (“el martes desaparece”). `why` en rango. Retrospective correcta pero corta (~29 w) y sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Append-only = nueva fila por cambio de label, no un UPDATE del valor. El error clásico es “arreglar” el martes y borrar el rastro de auditoría. Pregunta: con dos INSERT, ¿qué lista verías si ordenas por `id`? We Do: COUNT de historia, provenance source/record y ventana `valid_to IS NULL`.
- **Code/output changes:** none

### S29-T1-B-E1 (weDo, guided) — **B−**
- **Diagnosis:** Starter UPDATE → count 1 es el mejor E1 del bloque. Feedback y retro clonan “dos INSERT, no UPDATE / COUNT=2”. Retro ~21 w: sin misconception *distinto* ni self-check.
- **Checklist:** all pass; retro partial (eco + corto)
- **Severity residual:** P2 (cerca de P1 por metacognición fina)
- **Proposed retrospective (replace):**  
  COUNT=2 no es “más datos”: es prueba de que el revisor puede reconstruir el camino review→match. El error clásico es UPDATE “limpio” que deja una sola fila y borra el martes. Pregunta: si mañana cambian a non_match, ¿cuántas filas deberían quedar? Siguiente (E2): provenance source/record leída de tabla.
- **Code/output changes:** none

### S29-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Dict incompleto excelente. Feedback/retro solapan “source + record / dict a medias”. Éxito canónico claro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un match sin `record` es una opinión: no sabes qué payload del CRM sintético alimentó el par. El error clásico es imprimir solo `source` “porque ya se ve”. Pregunta: ¿dónde pondrías `ingested_at` sin romper el contrato mínimo de este ejercicio? Luego (E3): ventana abierta con `valid_to IS NULL`.
- **Code/output changes:** none

### S29-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a predicado SQL de NULL; self-check COUNT(*) vs COUNT(valid_to) en retro (puente real a T2-B). Feedback y retro aún abren igual.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (des-eco la primera frase del retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T2-A-DEMO (iDo) — **B+**
- **Diagnosis:** CTE + LEFT JOIN…IS NULL → `['p2']`. Preamble contrapone INNER. Retrospective corta (~27 w) sin self-check; `why` en rango.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Cola de review = anti-join, no INNER: INNER solo devuelve ya decididos. El error clásico es “unir y ver lo resuelto” pensando que eso es la cola. Pregunta: con p1 decidido y p2 libre, ¿qué lista da INNER y cuál anti-join? We Do: NOT EXISTS, ROW_NUMBER global y PARTITION BY block_key.
- **Code/output changes:** none

### S29-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** INNER → solo p1 es el defecto guiado ideal. Feedback denso y bueno; retro (~23 w) resume el feedback sin añadir capa.
- **Checklist:** all pass; retro partial (eco + corto)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La cola del revisor son los pares *sin* label; INNER JOIN los borra de la vista. Prefiere NOT EXISTS (o LEFT JOIN…IS NULL) frente a NOT IN con NULL. Pregunta: si `dec` tuviera un `pair_id` NULL, ¿qué le pasaría a un NOT IN? Siguiente (E2): top-1 con ROW_NUMBER.
- **Code/output changes:** none

### S29-T2-A-E2 (weDo, independent) — **A**
- **Diagnosis:** ASC elige el peor (0.2) vs DESC top p2 (0.9). Feedback y retro se complementan (oráculo vs basura de score bajo). Éxito exacto `p2`.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~22 w → +self-check “¿qué id gana con ASC?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a PARTITION BY; éxito `['p1','p3']`; retro con self-check “¿qué lista sin partición?”. Feedback razona blocking. Buen fade E1→E3.
- **Checklist:** all pass
- **Severity residual:** none (hints E3 dan la window casi completa — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T2-B-DEMO (iDo) — **A−**
- **Diagnosis:** star 3 / col 2 / pairs 1. Preamble predice y ancla NULL que no empareja. Retrospective con “si puedes explicar pairs=1” (buen self-check implícito).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~35 w → piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** n×n=25 vs C(5,2)=10. Preamble ancla cola inviable; instruction limpia; feedback/retro no clonan palabra por palabra.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Doble `= null` en starter es impecable. Feedback y retro abren con el mismo contraste 0/1 y la analogía Python.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  En SQL la igualdad con NULL no es TRUE ni FALSE “útil”: el predicado correcto de ausencia es `IS NULL`. Confundirlo con `None is None` de Python te deja ventanas “abiertas” con count 0. Pregunta: ¿qué devolvería un LEFT JOIN que filtre con `= NULL` en la columna de la derecha? Luego (E3): leer SCAN en el plan real.
- **Code/output changes:** none

### S29-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Hardcode `INDEX` vs plan real → `SCAN`. Retro con self-check hacia T4 y `idx_pairs_block`. Preamble prohíbe crear índice aquí (buen constraint de transferencia).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T3-A-DEMO (iDo) — **B+**
- **Diagnosis:** `0 0` / `acid True` tras ROLLBACK. Preamble de decisión huérfana. Retro corta (~33 w) sin self-check explícito; principio claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  ROLLBACK es la red de seguridad: todo o nada en decisión+evidencia. El error clásico es commitear la decisión “y la evidencia después” — basura de auditoría. Pregunta: si el raise ocurre *después* del insert de evidence, ¿qué counts quedarían sin ROLLBACK? We Do: rollback simple, atomicidad y abort por flag.
- **Code/output changes:** none

### S29-T3-A-E1 (weDo, guided) — **B−**
- **Diagnosis:** commit vs rollback mínimo y claro. Feedback y retro casi idénticos (~19–20 w). Newbie gana el drill pero el cierre metacognitivo es fino.
- **Checklist:** all pass; retro partial (eco + corto)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  ROLLBACK devuelve el almacén al estado pre-BEGIN; COMMIT dejaría la fila de prueba como si fuera dato real. El error clásico es “commit para ver si se insertó” y olvidar limpiar. Pregunta: sin `begin`, ¿rollback deshace el insert en SQLite de lab? Siguiente (E2): atomicidad decisión+evidencia juntas.
- **Code/output changes:** none

### S29-T3-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Commit parcial de decisión sin evidence — anti-patrón de producción. Éxito `0 0`. Feedback/retro se complementan (atómicas vs huérfana). Instruction aclara que el fallo es intencional.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** if invertido excelente; éxito `abort`; retro con self-check al You Do `insert_decision_with_evidence`. Feedback corto pero suficiente; fail-closed en preamble.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan el if — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Upsert a `Ana L` sin tabla de decisions (preamble lo explica a propósito). Retrospective repara “upsert de entidad ≠ corregir label”. Bien.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿cuántas filas en e tras dos upserts del mismo id?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** IntegrityError silenciado → name A vs ON CONFLICT → B. Feedback y retro no clonan del todo; puente E2 claro.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** running colgado → pending. Feedback/retro solapan “vuelve a pending / reintento idempotente”. Drill usable; eco residual.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un job en `running` eterno es un dead letter: nadie lo reintenta. UPDATE a `pending` + releer status es el contrato mínimo post-crash; no crees una segunda fila del mismo job. Pregunta: ¿por qué no “delete + insert” del job en este lab? Luego (E3): CHECK de orden canónico del par.
- **Code/output changes:** none

### S29-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** UNIQUE sin CHECK deja el espejo; solución `order_rejected`. Preamble de dos workers. Retro con self-check de reintento del worker. Feedback menciona `retry` (transfer de producto).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T4-A-DEMO (iDo) — **B+**
- **Diagnosis:** version 1 + indexed True. Preamble “plan no es magia”. Retro corta (~30 w) sin self-check; principio versionar+EXPLAIN bien.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Versionar en `schema_migrations` y pedir el plan es el hábito de evolución segura. El error clásico es crear el índice y no mirar EXPLAIN (o imprimir “indexed” de memoria). Pregunta: si `MAX(v)` devuelve 1 y el plan no menciona INDEX, ¿qué falló primero? We Do: MAX(v), sqlite_master y guard de DROP.
- **Code/output changes:** none

### S29-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** MIN vs MAX memorable. Title corto (“schema_migrations: MAX(version)” ≈ 2–3 tokens vs 4–12 del spec) pero legible. Instruction limpia.
- **Checklist:** all pass; title partial (longitud formal)
- **Severity residual:** P2
- **Proposed title:** Última migration con MAX(version)
- **Proposed residual:** none else required
- **Code/output changes:** none

### S29-T4-A-E2 (weDo, independent) — **B+**
- **Diagnosis:** DEFECT sin CREATE INDEX → `missing_index`. Feedback de evidencia triple fuerte. Instruction paso 4 habla de “asserts de solution” — confunde al newbie (¿debo escribir asserts?).
- **Checklist:** all pass; instruction partial (paso 4 meta)
- **Severity residual:** P2
- **Proposed instruction (step 4 tweak):**  
  1. Revisa el DEFECT: falta `CREATE INDEX`.  
  2. Crea `idx_pairs_block_key on pairs(block_key)`.  
  3. Lee el name en `sqlite_master` (si falta, no inventes el string).  
  4. Imprime solo el name del índice (el plan debe poder confirmar INDEX; no hardcodes el print).
- **Code/output changes:** none

### S29-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** DROP con `has_backup=False` → política + count 1. Retro con self-check README You Do. Éxito multilínea exacto. Title corto pero claro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional title: “Sin backup no hagas DROP de pairs”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** `Repo.pending()` → `[('p2',)]`. Preamble “intenciones, no SQL suelto”. Retro repara NOT IN; puente We Do claro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿qué lista da INNER JOIN aquí?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT de *uso* (get e2) no de implementación — preamble lo deja explícito (Round-1 riesgo residual **cerrado**). Instruction “no reescribas el método”. Feedback/retro alineados sin eco tóxico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T4-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Una apertura sin close vs loop 3 con PRAGMA+close. Preamble “PRAGMA no es global”. Feedback y retro se repiten un poco pero el puente a E3 aporta.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional des-eco)
- **Proposed residual:** none required
- **Code/output changes:** none

### S29-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** SQL correcto + `print(0)` — valor pedagógico de hardcode vs count real intacto (Round-1 riesgo **no** “arreglado” por un fixer ansioso). Retro con self-check `test_store.py`. Eco parcial con feedback en la primera frase.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (des-eco primera frase)
- **Proposed residual:** none required
- **Code/output changes:** none — **no** reescribir el anti-join del starter

### S29-youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto sólido: esquema CP-N3-A completo en starter, `PairRepository` con `NotImplementedError`, requirements fail-closed, rubric, portfolioNote con invariante medible, retrospective de defensa en 3 puntos (~75 w) alineada al patrón §8.3. Un newbie puede implementar y cerrar con metacognición.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 residual only)

### P0
- **Ninguno.** Cobertura de campos y oráculos están cerrados.

### P1
- **Ninguno bloqueante.** Ninguna unidad falla el test de true-newbie en un ítem crítico (éxito invisible o wrong≈right).

### P2 (calidad — orden sugerido al Fixer)
1. **Des-eco feedback/retrospective** (misma frase de apertura) en:  
   **T1-A-E2**, **T1-B-E1**, **T1-B-E2**, **T2-A-E1**, **T2-B-E2**, **T3-A-E1**, **T3-B-E2** (y opcional T1-A-E3 / T1-B-E3 / T4-B-E3).  
   Meta: principle + misconception *distinto* del feedback + transfer/self-check; 40–80 palabras.
2. **Expandir retrospectives cortas** (~20–30 w) sin self-check: weDo peores **T1-B-E1**, **T3-A-E1**, **T2-A-E1**; iDo **T1-B**, **T2-A**, **T3-A**, **T4-A**.
3. **T4-A-E2 instruction paso 4** — quitar “asserts de solution”; dejar tarea del learner (print del name; plan como verificación mental).
4. **Títulos weDo muy cortos** (formal 4–12 palabras): T4-A-E1/E2/E3, T4-B-E1 — expandir sin cambiar el skill.
5. **Hints E3** (opcional): aflojar 1 miga en T1-A-E3, T2-A-E3, T3-A-E3 si se quiere transfer más limpio.

---

## Residual risks

1. **ID de sección vs contenido:** sigue `id: "mlops"` / path `s29-mlops.ts` con contenido SQL/almacén ER. El Fixer de pedagogía **no** debe renombrar la sección en esta ronda.
2. **Eco feedback/retro:** patrón dominante residual. Arreglar a mano por unidad; no un template global de “Pregunta:…”.
3. **Longitudes:** no alargar preambles ya claros; invertir esfuerzo en retros (40–80 w) y en que no clonen feedback.
4. **Código/oráculos:** esta revisión **no** exige cambios de `starterCode` / `solutionCode` / `output`. Especial cuidado: **T4-B-E1** (defect de uso) y **T4-B-E3** (print hardcode) no deben “mejorarse” rompiendo el DEFECT.
5. **Hints E3:** siguen casi-solución; aceptable como andamiaje mínimo de transfer; no es regresión vs Round 1.
6. **Anti-aberration:** cualquier polish R2 debe ser a mano por unidad, sin scripts que fabriquen prosa.

---

## Summary for Fixer (Round 2)

| Block | Units | Primary residual action |
|-------|-------|-------------------------|
| iDo | 8 | Opcional: expandir 4 retros cortas (+self-check); **no** tocar código/outputs |
| weDo | 24 | Des-eco feedback/retro en ~7–10 unidades; expandir retros &lt;30 w; polish T4-A-E2 instruction; títulos T4 cortos |
| youDo | 1 | **none** — retrospective y marco en A |

**Do not change** solution outputs, learning outcomes, or theory unless execute-and-diff forces a code fix.

**Learner readiness:** Section 29 is **shippable** for true newbies on Gradual Release scaffolding. Round-2 fix is **quality polish**, not a second coverage campaign.

Section 29 exercise pedagogy review complete. Ready for the Fixer prompt.
