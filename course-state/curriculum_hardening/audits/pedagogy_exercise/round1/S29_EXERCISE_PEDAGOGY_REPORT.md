# S29 Exercise Pedagogy Report (Round 1)

## Section
- **title:** SQL avanzado y modelado relacional
- **shortTitle:** SQL almacén ER
- **id:** `mlops` (archivo `s29-mlops.ts`; contenido = almacén relacional del ER en SQLite de lab, no MLOps de pipelines ML)
- **index:** 29
- **source:** `src/lib/course/sections/s29-mlops.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S29-T1-A PK/FK/CHECK · T1-B temporalidad/provenance · T2-A CTE/windows/anti-join · T2-B cardinalidad/NULL/planes · T3-A ACID/transacciones · T3-B upserts/reintentos · T4-A índices/migraciones · T4-B repository/tests
- **hilo de caso:** almacén de verdad ER del capstone **CP-N3-A** (fixture **CASO-LIM-029**, `run_id=cpn3a-sql`, correos `@example.pe`, ids `ent-00N`); *match ≠ fraude* ni parentesco; fail-closed si falta llave o hay fan-out no documentado

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos), `weDo.steps[]` (24 ejercicios) y `youDo` en `s29-mlops.ts` (iDo ~477–780, weDo ~782–2036, youDo ~2038–2158).
- Contrastado con el hilo de la sección: esquema `source_records` ↔ `entity_source_links` ↔ `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`; `PRAGMA foreign_keys=ON`; anti-join `NOT EXISTS`; atomicidad decisión+evidencia; upsert de entidad ≠ borrar historia.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S29 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; a menudo **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · fixture + DEFECT + salida esperada” embebido: meta, éxito y a veces límites mezclados en un solo párrafo; legible para quien ya modela ER, **opaco** para newbie sin escena de almacén |
| We Do `feedback` | 1–2 frases; nombra el bug y el contrato del almacén (bien); poco *por qué importa a la cola de review / auditoría* en algunos |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E3 a veces da el SQL casi completo (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con política fail-closed |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-A; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos, bugs nombrados, outputs canónicos, fade real E1→E3 por subtema, política `match ≠ fraude`, PRAGMA por conexión) es maduro y alineado al almacén ER. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un almacén de revisión de pares en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: PRIMARY KEY → CHECK score → FK con PRAGMA; T2-A: anti-join → ROW_NUMBER global → PARTITION BY block; T3-A: ROLLBACK simple → atomicidad decisión+evidencia → política `evidence_ok`). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S29-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de esquema mínimo `entities` + `candidate_pairs` con CHECK de score, orden `entity_a < entity_b` y `PRAGMA foreign_keys=ON`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (PRAGMA=1, un par válido) y `retrospective` del misconception “REFERENCES en el DDL ya protege en SQLite”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de armar la cola de review del ER, el almacén debe rechazar basura en el insert. En esta demo creas `entities` y `candidate_pairs` con score entre 0 y 1, orden canónico `entity_a < entity_b` y `PRAGMA foreign_keys = ON`. No escribas aún: predice el `score` del par `p1`, el conteo de pares y el valor del PRAGMA; luego contrasta con la salida. Si el PRAGMA queda en 0, el `REFERENCES` es solo decoración y el almacén miente.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): constraints y FK habilitadas protegen el almacén desde el primer insert; sin PRAGMA un `entity_id` fantasma se inserta sin error; el CHECK de score impide confianza inventada; el orden A&lt;B evita el espejo del mismo candidato. Puente a We Do: PRIMARY KEY, CHECK de score inválido y FK real con par huérfano.
- **Proposed retrospective:**  
  Si puedes explicar por qué `PRAGMA foreign_keys` debe ejecutarse en *cada* conexión antes de confiar en REFERENCES, ya tienes el hábito de integridad del lab. El error clásico es asumir que el DDL solo basta. En We Do practicarás PK, CHECK y rechazo de FK rota.
- **Code/output changes:** none
- **Validation notes:** Output `0.5` / `pairs 1` / `fk_pragma 1` alineado a theory T1-A.

---

### S29-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter inserta `e1` dos veces sin PK y obtiene count 2. Instruction densa mezcla escena técnica, DEFECT y salida; sin title, preamble ni retrospective. Feedback nombra el bug pero no ancla “por qué la identidad del almacén se rompe”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** PRIMARY KEY en entities (sin duplicar e1)
- **Proposed preamble:**  
  - **Contexto:** en el almacén ER de CP-N3-A, cada entidad canónica tiene un id estable; dos filas con el mismo id no son “dos vistas”, son corrupción de identidad.  
  - **Meta:** declarar `PRIMARY KEY` en `entities(id)` y dejar un solo insert válido.  
  - **Éxito:** una sola línea con el entero `1`.  
  - **Límites:** no dejes el segundo insert; no imprimas etiquetas extra; SQLite `:memory:` de lab.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: tabla sin PK e insert duplicado de `'e1'` (count 2).  
  2. Añade `primary key` en la columna `id`.  
  3. Deja un solo `INSERT` de `'e1'`.  
  4. Imprime solo `COUNT(*)`.
- **Proposed feedback improvement:**  
  Con PRIMARY KEY el motor rechaza el duplicado. Un solo `e1` y COUNT(*) = 1 es el contrato mínimo de identidad: sin id único, joins y decisiones apuntan a filas ambiguas.
- **Proposed retrospective:**  
  La PK es el ancla de todo el grafo ER. El error clásico es insertar “otra vez por si acaso” sin constraint. Siguiente (E2): CHECK de score fuera de [0, 1].
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `1` correctos.

---

### S29-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de CHECK omitido: starter imprime `skipped_check` sin intentar el insert inválido. Instruction ya nombra IntegrityError y `bad_score`; falta escena de cola de candidatos y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** CHECK score 0..1 y bad_score
- **Proposed preamble:**  
  - **Contexto:** la cola de candidatos del ER no debe arrastrar un score de 1.5 como si fuera confianza real.  
  - **Meta:** forzar un insert inválido, capturar `IntegrityError` e imprimir `bad_score`.  
  - **Éxito:** una línea exacta `bad_score`.  
  - **Límites:** CHECK `BETWEEN 0 AND 1` (0 y 1 son válidos); no silencies el error sin imprimir; no uses un score inventado “arreglado”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `skipped_check` sin probar el CHECK.  
  2. Intenta `INSERT` de `1.5` en `p(score)`.  
  3. En el `except IntegrityError`, imprime `bad_score`.  
  4. No alteres el rango del CHECK.
- **Proposed retrospective:**  
  El CHECK no es documentación: un score fuera de [0, 1] debe fallar ruidoso. Confundir “validar en Python” con “validar en el motor” deja basura si alguien escribe SQL directo. Luego (E3): FK real con PRAGMA.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S29-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a FK habilitada: starter omite PRAGMA y el par fantasma se inserta (`fk_ignored`). Instruction ya lista el Pass; falta anclar reutilización en el You Do y retrospective “sin PRAGMA el almacén miente”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** FK real con PRAGMA foreign_keys
- **Proposed preamble:**  
  - **Contexto:** un par que apunta a `e_missing` no puede vivir en el almacén de verdad: rompe la cola y la auditoría.  
  - **Meta:** habilitar FK en la conexión, intentar el insert huérfano y reportar rechazo.  
  - **Éxito:** una línea `fk_rejected`.  
  - **Límites:** `PRAGMA foreign_keys = ON` en *esta* conexión; no borres el `REFERENCES`; no dejes `fk_ignored`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: falta el PRAGMA; el insert de `e_missing` “pasa”.  
  2. Ejecuta `PRAGMA foreign_keys = ON` antes del `executescript` o del insert de prueba.  
  3. Mantén el try/except de IntegrityError.  
  4. Debe imprimirse `fk_rejected`, no `fk_ignored`.
- **Proposed retrospective:**  
  En SQLite la FK solo se exige con PRAGMA por conexión. El error clásico es confiar en el DDL y dejar pares huérfanos. Pregunta: ¿por qué un pool o un script nuevo vuelve a necesitar el mismo PRAGMA?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y You Do `connect()`.

---

### S29-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: dos INSERT de labels para el mismo par y lista `['review', 'match']`. Description OK; falta preamble de “UPDATE destruye auditoría” y retrospective del misconception “corregir el label es un UPDATE in-place”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el almacén ER, “quién cambió de review a match y cuándo” es requisito de auditoría, no un detalle cosmético. Esta demo inserta dos filas de decisión para el mismo `pair_id` y lista los labels en orden. No escribas: predice la lista y el booleano `append_only`; luego contrasta. Si en su lugar hicieras UPDATE del label, el martes desaparece de la historia.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: historia sin overwrite; dos filas, no un UPDATE destructivo; provenance de actor/evidence_ref se modela por fila; puente a We Do: COUNT de historia, dict de provenance y ventana `valid_to IS NULL`.
- **Proposed retrospective:**  
  Append-only = nueva fila por cambio de label. El error clásico es “arreglar” con UPDATE y perder el rastro. We Do: contar historia, armar provenance y filtrar filas vigentes.
- **Code/output changes:** none
- **Validation notes:** Output `['review', 'match']` / `append_only True` alineado a theory T1-B.

---

### S29-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter hace UPDATE del label y cuenta 1 — defecto guiado perfecto para append-only. Instruction telegráfica; sin escena de auditoría. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Append-only: review y match sin UPDATE
- **Proposed preamble:**  
  - **Contexto:** un revisor sintético de Red Andina cambia `review` → `match` para el par `p1`; el almacén debe conservar ambas filas.  
  - **Meta:** insertar dos labels (no sobrescribir) y contar la historia del par.  
  - **Éxito:** el entero `2`.  
  - **Límites:** no uses UPDATE del label; imprime solo el count, no la lista.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: hace UPDATE y deja una fila.  
  2. Reemplaza el UPDATE por un segundo INSERT con label `match`.  
  3. Mantén el `COUNT(*)` filtrado por `pair='p1'`.  
  4. Imprime solo el entero.
- **Proposed retrospective:**  
  Append-only = dos INSERT, no un UPDATE. COUNT=2 prueba que la historia sigue viva. Siguiente (E2): provenance source/record leída de tabla.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `2` correcto.

---

### S29-T1-B-E2 (weDo, independent)
- **Diagnosis:** Starter omite `record` en el dict de provenance — buen contrato de rastro mínimo. Instruction ya pide el dict canónico; falta preamble de “sin record no hay payload fuente”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Provenance mínima source y record
- **Proposed preamble:**  
  - **Contexto:** un match sin rastro al CRM sintético es una opinión: no sabes qué payload alimentó el par.  
  - **Meta:** leer `source` y `record` de la tabla e imprimir el dict completo.  
  - **Éxito:** `{'source': 'crm_synth', 'record': 'r9'}` (orden de keys como en la solución).  
  - **Límites:** no inventes el dict a medias; no omitas `record`; datos sintéticos del fixture.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime solo `{'source': ...}`.  
  2. Incluye `'record': row[1]` en el dict.  
  3. Imprime el dict completo.  
  4. No hardcodes el record si la fila ya lo tiene.
- **Proposed retrospective:**  
  Provenance mínima es source + record leídos de la tabla. El error clásico es un dict a medias “porque ya se ve el source”. Luego (E3): ventana abierta con `valid_to IS NULL`.
- **Code/output changes:** none
- **Validation notes:** Contrato didáctico bien delimitado; output canónico intacto.

---

### S29-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de temporalidad SQL: starter usa `= null` y cuenta 0. Instruction nombra IS NULL; falta preamble de “ventana vigente” y retrospective del puente a T2-B (NULL).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ventana abierta con valid_to IS NULL
- **Proposed preamble:**  
  - **Contexto:** en el lab, una fila con `valid_to` NULL es la versión vigente de la entidad; un cierre con timestamp deja de ser vigente.  
  - **Meta:** contar filas abiertas con el predicado correcto de NULL en SQL.  
  - **Éxito:** el entero `1`.  
  - **Límites:** usa `IS NULL`, no `= NULL`; no inventes fechas; no borres la fila cerrada.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `where valid_to = null` devuelve 0.  
  2. Cambia el predicado a `valid_to is null`.  
  3. Imprime el count.  
  4. No alteres los inserts del fixture.
- **Proposed retrospective:**  
  `valid_to IS NULL` marca la ventana abierta. `= NULL` no devuelve filas: el mismo error conceptual que verás al razonar NULL en T2. Pregunta: ¿qué imprime `COUNT(*)` vs `COUNT(valid_to)` sobre este fixture?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-B y puente a T2-B.

---

### S29-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de CTE + anti-join LEFT JOIN…IS NULL → `['p2']`. Description nombra el patrón; falta preamble de “cola de review = pares sin decisión” y retrospective del misconception “INNER JOIN ya lista la cola”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La cola de review del ER no son los pares ya decididos: son los que aún no tienen label humano. En esta demo una CTE nombra los candidatos y un anti-join (LEFT JOIN … IS NULL) deja solo `p2`. No escribas: predice la lista; luego imagina qué devolvería un INNER JOIN (solo `p1`). Observa también los flags `cte` y `antijoin`.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: la CTE nombra el paso intermedio; el anti-join seguro deja solo pendientes; INNER JOIN solo devuelve ya decididos; prefiere NOT EXISTS o LEFT JOIN…IS NULL frente a NOT IN con NULL. Puente a We Do: anti-join, top-1 global y top-1 por bloque.
- **Proposed retrospective:**  
  Cola de review = anti-join, no INNER. El error clásico es unir y “ver solo lo decidido”. We Do: NOT EXISTS, ROW_NUMBER global y PARTITION BY block_key.
- **Code/output changes:** none
- **Validation notes:** Output `['p2']` / flags True correcto.

---

### S29-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa INNER JOIN y pierde `p2` — defecto guiado ideal. Instruction mezcla anti-join seguro y advertencia NOT IN; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Anti-join: pares sin decisión
- **Proposed preamble:**  
  - **Contexto:** el revisor de CP-N3-A necesita la cola de pares aún sin label, no la lista de ya resueltos.  
  - **Meta:** listar ids sin decisión con `NOT EXISTS` o `LEFT JOIN … IS NULL`.  
  - **Éxito:** `['p2']`.  
  - **Límites:** no uses `NOT IN` (falla si la subconsulta tiene NULL); no uses INNER JOIN; ordena por id si hace falta.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: INNER JOIN devuelve solo `p1`.  
  2. Reescribe con `NOT EXISTS (SELECT 1 FROM dec d WHERE d.pair_id = p.id)` (o LEFT JOIN + IS NULL).  
  3. Imprime la lista de ids.  
  4. No mutes las tablas del fixture.
- **Proposed retrospective:**  
  INNER JOIN solo devuelve pares ya decididos. La cola es anti-join → `['p2']`. Evita NOT IN con NULL. Siguiente (E2): top-1 con ROW_NUMBER.
- **Code/output changes:** none
- **Validation notes:** Pass `['p2']` correcto; solution usa NOT EXISTS.

---

### S29-T2-A-E2 (weDo, independent)
- **Diagnosis:** Bug de orden ASC (peor score) en ROW_NUMBER — excelente para independiente. Instruction ya nombra score 0.9 y salida `p2`; falta escena de ranking de cola.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Top-1 global con ROW_NUMBER DESC
- **Proposed preamble:**  
  - **Contexto:** la cola prioriza el candidato de mayor score antes de llamar al revisor.  
  - **Meta:** rankear con `ROW_NUMBER() OVER (ORDER BY score DESC)` y devolver el id con `rn=1`.  
  - **Éxito:** `p2` (score 0.9).  
  - **Límites:** no uses ASC; no resuelvas el top en Python omitiendo la window; imprime solo el id.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `order by score asc` elige el peor.  
  2. Cambia a `order by score desc`.  
  3. Mantén el filtro `where rn = 1`.  
  4. Imprime el id.
- **Proposed retrospective:**  
  ROW_NUMBER DESC con rn=1 es el top-1 SQL. ASC elegía basura de score bajo. Luego (E3): top-1 *por bloque* con PARTITION BY.
- **Code/output changes:** none
- **Validation notes:** E2 menos andamiaje; oráculo `p2` correcto.

---

### S29-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer real a ranking por `block_key`: starter hace top-1 global y solo gana un id. Instruction ya lista datos y salida `['p1','p3']`; falta preamble de blocking y retrospective de reutilización en cola real.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Top-1 por bloque con PARTITION BY
- **Proposed preamble:**  
  - **Contexto:** en ER real, el ranking no es global: reinicia por cubeta de *blocking* (`block_key`) para no mezclar colas ajenas.  
  - **Meta:** `ROW_NUMBER() OVER (PARTITION BY block_key ORDER BY score DESC)` y ids con `rn=1`.  
  - **Éxito:** `['p1', 'p3']` ordenados por id.  
  - **Límites:** no dejes ranking global; no omitas ORDER BY id externo; empates de score: ROW_NUMBER no empata (documenta en prod).
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: window sin PARTITION BY (un solo ganador).  
  2. Añade `PARTITION BY block_key` y `ORDER BY score DESC`.  
  3. Filtra `rn = 1` y ordena por id.  
  4. Imprime la lista de ids.
- **Proposed retrospective:**  
  PARTITION BY reinicia el contador por bloque: p1 en A, p3 en B. Un ORDER BY global no modela la cola de review por cubeta. Pregunta: ¿qué lista obtienes sin partición con estos datos?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T2-A mini-lab.

---

### S29-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara de COUNT(*) vs COUNT(col) y self-join con NULL que no empareja. Description técnica; falta preamble de “NULL no es Python None” y retrospective del misconception de cardinalidad n×n.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de unir entidades por un atributo, estima filas y entiende NULL. En esta demo hay tres filas (`grp` a, a, NULL): `COUNT(*)` cuenta filas, `COUNT(grp)` ignora NULL, y el self-join con `a.grp = b.grp` y `a.id < b.id` produce un solo par. No escribas: predice `star`, `col` y `pairs`; luego contrasta. La fila con `grp` NULL no se empareja consigo misma.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: NULL y cardinalidad evitan sorpresas de fan-out; igualdad SQL no une NULLs; COUNT(col) ≠ COUNT(*). Puente a We Do: C(n,2) con a.id&lt;b.id, predicado IS NULL y lectura de EXPLAIN SCAN.
- **Proposed retrospective:**  
  Si puedes explicar por qué `pairs` es 1 y no 3, ya respetas NULL en joins. El error clásico es asumir n×n o que NULL=NULL es TRUE. We Do: cardinalidad canónica, IS NULL y planes.
- **Code/output changes:** none
- **Validation notes:** Output `star 3` / `col 2` / `pairs 1` alineado a theory T2-B.

---

### S29-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter une sin filtro y explota a 25 (n×n) — defecto guiado excelente para C(5,2)=10. Instruction densa; sin escena de “por qué el ER no sobrevive al producto cartesiano”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Cardinalidad C(n,2) con a.id &lt; b.id
- **Proposed preamble:**  
  - **Contexto:** sin orden canónico ni *blocking*, el self-join de entidades explota y la cola de candidatos se vuelve inviable.  
  - **Meta:** contar pares no ordenados con `a.id < b.id` (C(5,2)=10).  
  - **Éxito:** el entero `10`.  
  - **Límites:** no dejes el join sin filtro (25); no cuentes en Python omitiendo el SQL; lab con n=5.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `join` sin `on` cuenta n×n=25.  
  2. Añade `on a.id < b.id`.  
  3. Imprime `COUNT(*)`.  
  4. No cambies el número de entidades del fixture.
- **Proposed retrospective:**  
  `a.id < b.id` da C(5,2)=10: sin diagonal ni doble sentido. Sin el filtro, 25 incluye basura de pares. Siguiente (E2): `= NULL` vs `IS NULL`.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `10` correcto.

---

### S29-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter usa `= null` en ambos predicados — bug perfecto. Instruction ya pide `0 1`; falta preamble de “no uses la analogía Python None”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** NULL en SQL: = NULL vs IS NULL
- **Proposed preamble:**  
  - **Contexto:** filtrar filas abiertas o claves nulas en el almacén exige el predicado SQL correcto, no la intuición de Python.  
  - **Meta:** comparar `WHERE x = NULL` vs `WHERE x IS NULL` sobre una fila NULL.  
  - **Éxito:** `0 1` (eq e isn separados por espacio).  
  - **Límites:** no uses `None is None` de Python para razonar; no “arregles” el NULL con COALESCE aquí.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: el segundo predicado también usa `= null`.  
  2. Cambia el segundo a `x is null`.  
  3. Imprime `eq` e `isn` en una línea.  
  4. No alteres el insert NULL.
- **Proposed retrospective:**  
  En SQL, `x = NULL` no es TRUE (count 0); `x IS NULL` sí (count 1). El error clásico es importar la analogía Python. Luego (E3): leer SCAN en el plan real.
- **Code/output changes:** none
- **Validation notes:** Oráculo `0 1` correcto.

---

### S29-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a lectura de plan: starter imprime `INDEX` de memoria. Instruction nombra EXPLAIN y SCAN; falta preamble de “no adivines el índice” y retrospective de reutilización en T4.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** EXPLAIN: SCAN sin índice en block_key
- **Proposed preamble:**  
  - **Contexto:** antes de “ya tengo índice”, el lab pide el plan real de SQLite sobre un filtro por `block_key`.  
  - **Meta:** correr `EXPLAIN QUERY PLAN` y reportar `SCAN` si el texto del plan lo contiene (mayúsculas).  
  - **Éxito:** `SCAN` en tabla mínima sin índice.  
  - **Límites:** no imprimas `INDEX` de memoria; no crees índice en este ejercicio (eso es T4); lee el plan.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime `INDEX` sin mirar el plan.  
  2. Une las filas del plan a string.  
  3. Imprime `SCAN` si `'SCAN' in plan.upper()`, si no `OTHER`.  
  4. No inventes el texto del plan.
- **Proposed retrospective:**  
  Sin índice, el plan suele mostrar SCAN. El error clásico es imprimir la palabra mágica. Pregunta: ¿qué cambia en T4 cuando creas `idx_pairs_block` y vuelves a pedir el plan?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-B; puente a T4-A.

---

### S29-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara de BEGIN → insert → fallo → ROLLBACK → `0 0` y `acid True`. Description OK; falta preamble de “decisión+evidencia atómicas” y retrospective del misconception “el primer insert ya está seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el almacén de verdad, una decisión sin evidencia es basura de auditoría. Esta demo abre transacción, inserta en `decisions`, fuerza un fallo antes de `evidence` y hace ROLLBACK. No escribas: predice los dos counts y el booleano `acid`; luego contrasta. Si hubiera COMMIT parcial, quedaría una decisión huérfana.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: atomicidad decisión+evidencia; si falla el segundo write, no queda basura en la primera tabla; foco del lab es atomicidad en una conexión (isolation multi-conexión se retoma en S38). Puente a We Do: ROLLBACK simple, ambos counts 0 y política `evidence_ok`.
- **Proposed retrospective:**  
  ROLLBACK es la red de seguridad del lab: todo o nada. El error clásico es commitear la decisión “y ya arreglamos la evidencia después”. We Do: practicar rollback, atomicidad y abort por flag.
- **Code/output changes:** none
- **Validation notes:** Output `0 0` / `acid True` alineado a theory T3-A.

---

### S29-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter hace COMMIT por error — defecto guiado mínimo y claro. Instruction telegráfica; sin escena de “basura que el lab prohíbe”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** ROLLBACK deja la tabla en 0
- **Proposed preamble:**  
  - **Contexto:** en el lab ACID, un insert de prueba dentro de transacción debe poder deshacerse por completo.  
  - **Meta:** tras BEGIN + insert, usar ROLLBACK y verificar count 0.  
  - **Éxito:** el entero `0`.  
  - **Límites:** no uses COMMIT; imprime solo el count.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: hace `commit` y deja 1 fila.  
  2. Cambia a `rollback`.  
  3. Imprime `COUNT(*)`.  
  4. No omitas el `begin`.
- **Proposed retrospective:**  
  ROLLBACK deshace el INSERT de la transacción abierta. COMMIT dejaría basura que el lab prohíbe. Siguiente (E2): atomicidad decisión+evidencia juntas.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `0` correcto.

---

### S29-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter commitea la decisión aunque evidence no se escriba — anti-patrón de producción excelente. Instruction ya pide `0 0`; falta preamble de almacén de verdad.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Atomicidad: decisión y evidencia o nada
- **Proposed preamble:**  
  - **Contexto:** cerrar un par en CP-N3-A exige decisión *y* evidencia en la misma transacción lógica.  
  - **Meta:** insertar decisión, simular fallo de evidencia, ROLLBACK e imprimir ambos counts.  
  - **Éxito:** `0 0` en una línea.  
  - **Límites:** no hagas commit parcial; no dejes decisión huérfana; lab de una conexión.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: commit de la decisión sin evidence.  
  2. Envuelve en try/except: raise simulado → `rollback`.  
  3. Imprime counts de `decisions` y `evidence`.  
  4. No insertes evidence en el camino feliz de este ejercicio (el fallo es intencional).
- **Proposed retrospective:**  
  Si la evidencia falla, ambas tablas quedan en 0. Un commit parcial crea decisión huérfana. Luego (E3): política con flag `evidence_ok`.
- **Code/output changes:** none
- **Validation notes:** Solution canónica con RuntimeError + ROLLBACK correcta.

---

### S29-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a política de negocio: starter invierte el if (`if evidence_ok: abort` / else commit). Instruction nombra `abort`; falta preamble de fail-closed y retrospective “misma regla en PairRepository”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Abort si evidence_ok es False
- **Proposed preamble:**  
  - **Contexto:** la política operativa del almacén es fail-closed: sin evidencia confirmada no hay decisión confirmada.  
  - **Meta:** insertar decisión; si `evidence_ok` es False, ROLLBACK e imprimir `abort`.  
  - **Éxito:** `abort`.  
  - **Límites:** no dejes la decisión con COMMIT; no inviertas el if; imprime solo la palabra de política.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el if está invertido (abort cuando evidence_ok es True).  
  2. Corrige a `if not evidence_ok: rollback; print('abort')`.  
  3. El else (commit) queda para el camino feliz no ejercitado aquí.  
  4. Verifica la salida exacta.
- **Proposed retrospective:**  
  Si `evidence_ok` es False, ROLLBACK y `abort`. No dejes la decisión sin evidencia. Pregunta: ¿dónde reaparece esta política en el You Do (`insert_decision_with_evidence`)?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do y theory T3-A.

---

### S29-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara de upsert de name a `Ana L`. Description OK; falta preamble de “id estable, atributo mutable” y retrospective del misconception “upsert borra historia de decisiones”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Re-ingerir el mismo `external_id` del CRM no debe crear otra entidad ni borrar labels pasados. En esta demo un upsert actualiza el `name` de `e1` a `Ana L` y lo imprime. No escribas: predice el name final y el flag `upsert`; luego contrasta. Observa que no hay tabla de decisions en el demo: a propósito, para no confundir políticas.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: upsert de atributos con id estable; no toca la historia de decisiones; ON CONFLICT DO UPDATE es el patrón de re-ingesta. Puente a We Do: name final B, job `pending` tras crash y orden canónico A&lt;B con rechazo del espejo.
- **Proposed retrospective:**  
  Upsert reescribe atributos mutables y conserva el id. El error clásico es tratar el upsert de entidad como “corregir” un label de decisión. We Do: upsert, recuperación de job y CHECK de orden.
- **Code/output changes:** none
- **Validation notes:** Output `Ana L` / `upsert True` correcto.

---

### S29-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter reinserta sin ON CONFLICT, captura IntegrityError y deja name `A` — defecto guiado perfecto. Instruction telegráfica; sin escena de re-ingesta CRM.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Upsert ON CONFLICT: name final B
- **Proposed preamble:**  
  - **Contexto:** el CRM sintético reenvía la entidad `1` con un name corregido; el id no cambia.  
  - **Meta:** segundo insert con `ON CONFLICT DO UPDATE` del name.  
  - **Éxito:** `B`.  
  - **Límites:** no borres la fila; no ignores el IntegrityError sin upsert; imprime solo el name.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: segundo insert sin ON CONFLICT deja `A`.  
  2. Reescribe el segundo insert con `on conflict(id) do update set name=excluded.name`.  
  3. Imprime el name de id `'1'`.  
  4. No cambies la PK.
- **Proposed retrospective:**  
  ON CONFLICT reescribe el name mutable y conserva el id. El segundo INSERT sin upsert reventaba. Siguiente (E2): devolver el job a `pending` tras crash.
- **Code/output changes:** none
- **Validation notes:** Pass `B` correcto.

---

### S29-T3-B-E2 (weDo, independent)
- **Diagnosis:** Starter no reescribe `running` → `pending`. Instruction clara; falta preamble de reintento idempotente del job de blocking.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Job er_block: running a pending
- **Proposed preamble:**  
  - **Contexto:** tras un crash del job de *blocking* del ER, el estado no puede quedar colgado en `running` o nadie lo reintenta.  
  - **Meta:** UPDATE a `pending` y releer el status.  
  - **Éxito:** `pending`.  
  - **Límites:** no dupliques filas del job; no inventes un status intermedio; lab de una conexión.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `running` sin UPDATE.  
  2. Ejecuta `UPDATE jobs SET status='pending' WHERE id='er_block'`.  
  3. SELECT e imprime el status.  
  4. No alteres el id del job.
- **Proposed retrospective:**  
  Tras un crash, el job vuelve a `pending` y se relee. Así el reintento es idempotente sin duplicar matching. Luego (E3): CHECK de orden canónico del par.
- **Code/output changes:** none
- **Validation notes:** Oráculo `pending` correcto.

---

### S29-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de integridad de par: starter tiene UNIQUE pero no CHECK A&lt;B, y el espejo se inserta. Instruction ya nombra `order_rejected`; falta preamble de “dos workers no deben duplicar el candidato”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Orden canónico A&lt;B rechaza el espejo
- **Proposed preamble:**  
  - **Contexto:** dos workers no deben crear el mismo par como (e1,e2) y (e2,e1); el almacén exige un solo candidato canónico.  
  - **Meta:** tabla con `CHECK(entity_a < entity_b)` + UNIQUE; insertar (e1,e2) y rechazar el espejo.  
  - **Éxito:** `order_rejected`.  
  - **Límites:** UNIQUE solo no basta si el orden está invertido; no elimines el try/except; no imprimas `ok`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: sin CHECK el espejo se inserta.  
  2. Añade `check(entity_a < entity_b)` al CREATE.  
  3. Mantén UNIQUE y el segundo insert del espejo.  
  4. En IntegrityError imprime `order_rejected`.
- **Proposed retrospective:**  
  CHECK A&lt;B rechaza el espejo; UNIQUE evita el duplicado en el mismo orden. El error clásico es confiar solo en UNIQUE. Pregunta: ¿qué reportaría un worker en reintento tras este IntegrityError?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-A/T3-B y You Do UNIQUE+CHECK.

---

### S29-T4-A-DEMO (iDo)
- **Diagnosis:** Demo clara de migration v1 + índice y flag `indexed True`. Description OK; falta preamble de “versionar y evidenciar el plan” y retrospective del misconception “CREATE INDEX sin verificar el plan”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Evolucionar el esquema del almacén sin rastro es tan peligroso como un DROP sin backup. En esta demo registras la migration v1, creas índice en `block_key` y lees si el plan menciona índice. No escribas: predice `version` e `indexed`; luego contrasta con la salida. El texto del plan es diagnóstico, no magia.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: evolución versionada en `schema_migrations` y evidencia del índice en EXPLAIN; no adivines “ya hay índice”. Puente a We Do: MAX(version), CREATE INDEX real y política no_drop_without_backup.
- **Proposed retrospective:**  
  Versionar + pedir el plan es el hábito de evolución segura. El error clásico es crear el índice y no mirar EXPLAIN. We Do: MAX(v), sqlite_master y guard de DROP.
- **Code/output changes:** none
- **Validation notes:** Output `1` / `indexed True` alineado a theory T4-A.

---

### S29-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa MIN(v) en lugar de MAX — defecto guiado mínimo y memorable. Instruction telegráfica; sin escena de “estado real del esquema”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** schema_migrations: MAX(version)
- **Proposed preamble:**  
  - **Contexto:** el lab (y prod) necesita saber *hasta qué versión* del esquema ya se aplicó, no la primera.  
  - **Meta:** registrar v1 y v2 e imprimir `MAX(v)`.  
  - **Éxito:** el entero `2`.  
  - **Límites:** no uses MIN; no hardcodes el 2 sin leer la tabla.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `select min(v)` devuelve 1.  
  2. Cambia a `max(v)`.  
  3. Imprime el resultado.  
  4. No borres las filas de migration.
- **Proposed retrospective:**  
  MAX(v) es la última migration aplicada. MIN te deja en el origen y miente sobre el estado. Siguiente (E2): crear el índice y leerlo en sqlite_master.
- **Code/output changes:** none
- **Validation notes:** Pass `2` correcto.

---

### S29-T4-A-E2 (weDo, independent)
- **Diagnosis:** Starter no crea el índice y reporta `missing_index`. Instruction ya pide triple evidencia (CREATE + sqlite_master + EXPLAIN); falta preamble de “índice real, no nombre inventado”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Índice idx_pairs_block_key real
- **Proposed preamble:**  
  - **Contexto:** la cola filtrada por `block_key` no se acelera con un string en un print: hace falta el índice y evidencia.  
  - **Meta:** crear `idx_pairs_block_key`, confirmarlo en `sqlite_master` y verificar INDEX en el plan.  
  - **Éxito:** `idx_pairs_block_key`.  
  - **Límites:** no imprimas el nombre si falta en sqlite_master; no asumas INDEX sin EXPLAIN.
- **Proposed instruction/description improvements:**  
  1. Revisa el DEFECT: falta `CREATE INDEX`.  
  2. Crea `idx_pairs_block_key on pairs(block_key)`.  
  3. Lee el name en sqlite_master.  
  4. (Opcional en asserts de solution) confirma INDEX en el plan; imprime el name.
- **Proposed retrospective:**  
  CREATE INDEX + sqlite_master + EXPLAIN: evidencia triple. El error clásico es “ya puse el nombre” sin crear el objeto. Luego (E3): política de no DROP sin backup.
- **Code/output changes:** none
- **Validation notes:** Solution con asserts de plan; output del print canónico intacto.

---

### S29-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de gobernanza: starter hace DROP aunque `has_backup=False`. Instruction ya pide dos líneas de salida; falta preamble de “evidencia del ER no se borra por agilidad” y retrospective de reutilización en README del You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** no_drop_without_backup en pairs
- **Proposed preamble:**  
  - **Contexto:** una migration agresiva que dropea `pairs` sin backup borra evidencia del almacén ER; el lab entrena el guard antes de tocar prod.  
  - **Meta:** con `has_backup=False`, no DROP; reportar count y la política.  
  - **Éxito:** dos líneas — `1` y `no_drop_without_backup`.  
  - **Límites:** no ejecutes DROP en el camino de este fixture; no imprimas solo `drop_ok`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: DROP aunque has_backup sea False.  
  2. Si `not has_backup`: COUNT, print count, print política.  
  3. Else (no ejercitado): DROP y `drop_ok`.  
  4. Verifica las dos líneas exactas.
- **Proposed retrospective:**  
  Con has_backup=False no hay DROP: la evidencia sobrevive. El error clásico es “agilidad de schema” sin respaldo. Pregunta: ¿dónde documentas esta política en el README del You Do?
- **Code/output changes:** none
- **Validation notes:** Output multilínea canónico correcto.

---

### S29-T4-B-DEMO (iDo)
- **Diagnosis:** Demo clara de `Repo.pending()` con LEFT JOIN anti-join → `[('p2',)]`. Description nombra encapsulación; falta preamble de “la app pide intenciones, no SQL suelto” y retrospective del misconception “NOT IN es igual de seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El matching y el scoring no deben armar SQL crudo por toda la app: piden intenciones como `pending()`. En esta demo un repository encapsula el anti-join y devuelve solo el par sin decisión. No escribas: predice la lista de filas y el flag `repo`; luego contrasta. Observa que el SQL vive *dentro* del método.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: SQL encapsulado y testeable; anti-join seguro (LEFT JOIN / NOT EXISTS), no NOT IN frágil; inyección de conexión para tests. Puente a We Do: `get(id)`, ciclo de conexiones con PRAGMA y `pending_count` real.
- **Proposed retrospective:**  
  La app pide `pending()`; el repo traduce a anti-join. El error clásico es esparcir SQL y usar NOT IN con NULL. We Do: get, ciclo open→pragma→close y count de pendientes.
- **Code/output changes:** none
- **Validation notes:** Output `[('p2',)]` / `repo True` correcto.

---

### S29-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter llama `get('e2')` sobre un repo que solo tiene `e1` — defecto de uso, no de implementación del método. Instruction telegráfica; sin escena de “SQL detrás del método”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** EntityRepo.get('e1') devuelve Ana
- **Proposed preamble:**  
  - **Contexto:** el repository es el borde de persistencia: `get(id)` oculta el SELECT y se prueba con datos sintéticos.  
  - **Meta:** insertar e1→Ana e imprimir `get('e1')`.  
  - **Éxito:** `Ana`.  
  - **Límites:** no pidas e2 (no existe); no armes el SELECT fuera del método; no hardcodes el print omitiendo get.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `get('e2')` devuelve None.  
  2. Cambia la llamada a `get('e1')`.  
  3. Imprime el resultado.  
  4. No reescribas el método (ya es correcto).
- **Proposed retrospective:**  
  El repo expone get(id); el SQL vive dentro. Con e1 insertado, get('e1') es Ana. Siguiente (E2): ciclo de tres conexiones con PRAGMA y close.
- **Code/output changes:** none
- **Validation notes:** DEFECT de uso deliberado; Pass `Ana` correcto. Nota para Fixer: el ejercicio es válido pero el skill es “usar el repo”, no “implementar get” — el preamble debe dejarlo explícito (ya propuesto).

---

### S29-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter abre una sola conexión y no cierra. Instruction ya explica el hábito por-conexión del PRAGMA; falta preamble de “pool de lab vs servidor” y retrospective de reutilización en `connect()`.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres conexiones con PRAGMA y close
- **Proposed preamble:**  
  - **Contexto:** en SQLite de lab no hace falta un pool corporativo, pero sí el hábito: cada conexión configura FK y se cierra.  
  - **Meta:** abrir 3 conexiones `:memory:`, `PRAGMA foreign_keys=ON` en cada una, cerrar e imprimir el conteo.  
  - **Éxito:** el entero `3`.  
  - **Límites:** el PRAGMA no es global del proceso; no dejes conexiones abiertas sin close en el loop.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: solo una apertura.  
  2. Loop `for _ in range(3)`: connect → pragma → opened += 1 → close.  
  3. Imprime `opened`.  
  4. No reutilices una sola conexión para “simular” 3.
- **Proposed retrospective:**  
  Cada conexión necesita su PRAGMA y su close. Contar 3 aperturas entrena el ciclo del lab. Luego (E3): `pending_count` con anti-join real (no literal).
- **Code/output changes:** none
- **Validation notes:** Oráculo `3` correcto; alineado a You Do `connect()`.

---

### S29-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de test de repo: starter calcula `pending_count` bien pero imprime el literal `0`. Instruction ya nombra NOT EXISTS; falta preamble de “assert sobre el count real” y retrospective de puente al You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** pending_count real con NOT EXISTS
- **Proposed preamble:**  
  - **Contexto:** un test del repository no debe hardcodear el resultado: tiene que ejercer el anti-join de la cola.  
  - **Meta:** COUNT de pares sin decisión con `NOT EXISTS` e imprimir el entero calculado.  
  - **Éxito:** `1` (p2 pendiente).  
  - **Límites:** no imprimas un literal; no uses NOT IN; no mutes el fixture p1 decidido / p2 pendiente.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el SQL ya cuenta bien pero `print(0)`.  
  2. Cambia a `print(pending_count)`.  
  3. No reescribas el anti-join si ya es correcto.  
  4. Verifica mentalmente: un pendiente → 1.
- **Proposed retrospective:**  
  pending_count se calcula con anti-join real, no con un literal. El error clásico es “el test pasa” imprimiendo lo esperado a mano. Pregunta: ¿cómo reutilizas este assert en `test_store.py` del You Do?
- **Code/output changes:** none
- **Validation notes:** DEFECT quirúrgico (print vs variable); Pass `1` correcto.

---

### S29-youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context, objectives, requirements, rubric, portfolioNote y starter con esquema CP-N3-A completo, `PairRepository` con `NotImplementedError` y política fail-closed. Falta únicamente `retrospective` de defensa/reflexión post-build (spec §8.3). Un newbie puede implementar sin un cierre metacognitivo de “qué invariante demuestro y cómo lo defiendo en 30 s”.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cumple el rol de escena; no reescribir context salvo que el Fixer unifique tono)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric. Opcional P2: en `portfolioNote`, una viñeta que recuerde “defiende en el README un invariante medible (p. ej. pending + rollback en :memory:)”.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un test en `:memory:` (IntegrityError de FK/CHECK, `pending` con NOT EXISTS, o ROLLBACK de decisión+evidencia)? (2) ¿qué harías distinto con un almacén corporativo (PostgreSQL, pooling, migraciones reales) vs. este lab SQLite? (3) En el README, una frase de impacto medible (antes/después: p. ej. “cola de review sin pares huérfanos; 0 decisiones sin evidencia”) que puedas defender en 30 segundos. No etiquetes match como fraude ni parentesco.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric alineados a learning outcomes; solo falta cierre metacognitivo.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback polish opcional)
1. **S29-T1-A-E1, E2, E3** — PK → CHECK → FK/PRAGMA (núcleo de integridad del almacén)
2. **S29-T1-B-E1, E2, E3** — append-only → provenance → valid_to IS NULL
3. **S29-T2-A-E1, E2, E3** — anti-join → ROW_NUMBER → PARTITION BY (cola de review)
4. **S29-T2-B-E1, E2, E3** — cardinalidad → NULL SQL → EXPLAIN SCAN
5. **S29-T3-A-E1, E2, E3** — ROLLBACK → atomicidad → evidence_ok
6. **S29-T3-B-E1, E2, E3** — upsert → job pending → orden canónico
7. **S29-T4-A-E1, E2, E3** — MAX(version) → índice real → no_drop_without_backup
8. **S29-T4-B-E1, E2, E3** — get → ciclo conexiones → pending_count

### P1 (I Do preamble + retrospective + ampliar why; You Do retrospective)
9. **S29-T1-A-DEMO … S29-T4-B-DEMO** (8 demos) — escena “qué observar” + principle/misconception/puente We Do
10. **S29-youDo** — retrospective de defensa post-build

### P2 (polish si queda tiempo)
11. Acortar `instruction` We Do a pasos numerados (40–100 palabras) una vez exista preamble
12. Ampliar `feedback` donde solo nombra el bug (añadir 1 frase de impacto al almacén/auditoría)
13. Ampliar `why` I Do al rango 40–90 palabras del spec
14. Opcional: viñeta en `portfolioNote` del You Do sobre invariante medible en README

---

## Residual risks

1. **ID de sección vs contenido:** el archivo exporta `id: "mlops"` y el path es `s29-mlops.ts`, pero el contenido es SQL/almacén ER (no MLOps de modelos). El Fixer **no** debe reescribir teoría ni renombrar la sección en esta ronda de pedagogía de ejercicios; solo rellenar campos de scaffolding verbal. Un orquestador posterior puede alinear naming.
2. **Fade de prosa:** al añadir preambles, el Fixer debe respetar E1 (nombra DEFECT, casi-completo) → E2 (meta+éxito, menos migas) → E3 (superficie nueva, mismo principio). No clonar el mismo párrafo con números distintos.
3. **Longitudes:** preambles propuestos apuntan a 80–150 palabras o 4 bullets; si el Fixer alarga, recortar. Retrospectives 40–80 palabras.
4. **Código/oráculos:** esta revisión **no** exige cambios de `starterCode` / `solutionCode` / `output`. Cualquier “arreglo” de output solo con execute-and-diff justificado.
5. **S29-T4-B-E1:** el método `get` ya es correcto; el DEFECT es la *llamada* a e2. El preamble debe dejar claro que el skill es usar el repo con el id insertado, no reimplementar get — evita confusión del newbie.
6. **S29-T4-B-E3:** el SQL ya es correcto y el bug es `print(0)`. El Fixer no debe “mejorar” el starter borrando el anti-join; el valor pedagógico es detectar hardcode vs count real.
7. **You Do:** no reescribir `context`/`requirements`/`rubric` salvo unificación de tono; el hueco real es `retrospective`.
8. **Anti-aberration:** implementación en Round 1 Fix debe ser a mano por unidad, sin scripts que fabriquen preambles.

---

## Summary for Fixer

| Block | Units | Primary fields to add |
|-------|-------|------------------------|
| iDo | 8 | `preamble`, `retrospective`; optionally expand `why` |
| weDo | 24 | `title`, `preamble`, slim `instruction`, `retrospective`; optionally enrich `feedback` |
| youDo | 1 | `retrospective` only |

**Do not change** solution outputs, learning outcomes, or theory in this fix pass unless execute-and-diff forces a code fix.

Section 29 exercise pedagogy review complete. Ready for the Fixer prompt.
