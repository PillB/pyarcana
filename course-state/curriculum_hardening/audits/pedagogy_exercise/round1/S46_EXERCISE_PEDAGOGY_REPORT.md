# S46 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Ingeniería de datos y orquestación de producción
- **shortTitle:** Data eng producción
- **id:** `gpu-computing` (archivo `s46-gpu-computing.ts`; el **contenido** es pipeline de datos de producción — watermarks, late policy, DAG, backfill, contratos, lineage, merge incremental, SLI/SLO — **no** “GPU computing”)
- **index:** 46
- **source:** `src/lib/course/sections/s46-gpu-computing.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S46-T1-A event-time/watermarks · T1-B exactly-once + late policy · T2-A DAG acíclico · T2-B backfill/checkpoint · T3-A contratos/freshness · T3-B lineage/ownership · T4-A merge incremental · T4-B SLI/SLO/RTO
- **hilo de caso:** clínica ficticia **CASO-HYO-046** (Huancayo sintético) — eventos de atención con retraso de red; gate **CP-N4-B** (backfill idempotente, freshness SLO, lineage, sin DAG cíclico); **missing ≠ breach**; late data nunca se mezcla en silencio

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~377–608), `weDo.steps[]` (24 ejercicios, ~613–2227) y `youDo` (~2230–2328) en `s46-gpu-computing.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-B.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S46 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; ~1–2 frases densas (a veces bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + CASO-HYO + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera pipelines, **opaco** para newbie sin escena de clínica/Huancayo |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa al promote / al dashboard / al portfolio* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-B; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama de incertidumbre. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |
| Token operativo | Vocabulario rico y consistente (SIDE_OUTPUT_LATE_EVENT, REPLAY_IDEMPOTENTLY, REJECT_DAG, STOP_OVERLAPPING_BACKFILL, QUARANTINE_DATASET, OPEN_QUALITY_INCIDENT, REBUILD_PARTITION, DECLARE_DATA_INCIDENT, etc.) |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción, fixtures sintéticos Huancayo, stdlib progressive disclosure) es maduro y alineado al puente S45→S46→S47. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al parte de atenciones de Huancayo, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado de dominio → assess tres rutas → decide con rama operativa). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del predicado”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en producción”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `gpu-computing` y el archivo se llama `s46-gpu-computing.ts`, pero el título y el contenido son ingeniería de datos y orquestación de producción. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

**Nota de solutionCode E2/E3:** varios `solutionCode` imprimen `meets_contract True` con tautologías del tipo `meets_contract = ('1A-0' == '1A-0')`. No rompe el output canónico ni los tests de tokens; es *print-theater* menor. No exigir cambio de código en Round 1 a menos que se quiera alinear el assert al predicado real; los tokens de salida deben preservarse.

---

## Unit ledger

### S46-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida: avanza watermark y clasifica 112/100/105 en ON_TIME / LATE / ALLOWED_LATE. La `description` nombra el skill; falta `preamble` que diga *qué observar* en la recta de event time y `retrospective` del misconception “late = llega tarde en reloj del worker”. El `why` es denso pero no cierra con puente a We Do ni con el hábito de reejecutar etiquetas.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de materializar una ventana de atenciones en Huancayo, el pipeline debe decidir con **event time**, no con el reloj del worker. En esta demo un stream sintético `[100, 108, 115]` avanza el watermark a 110 (lag 5) y clasifica tres eventos de prueba. No escribas aún: predice por qué 112 es ON_TIME, por qué 100 es LATE (`wm − et = 10 > gracia 5`) y por qué 105 aún entra por `allowed_lateness`. Si confundes *processing time* con *event time*, el dashboard miente o descarta partes en silencio.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): watermark es aserción de progreso; allowed lateness es franja de gracia post-watermark (*completeness* vs. *latencia*), no un bound inferior inventado. Misma regla en theory, iDo y weDo. Puente a We Do: reparar predicado de aceptación, tres rutas PASS/SIDE_OUTPUT/MISSING y decisión CONTINUE/WAIT.
- **Proposed retrospective:**  
  Si puedes explicar por qué 100 es LATE y 105 ALLOWED_LATE sin mirar el código, ya tienes el hábito de etiquetar por event time. El error clásico es “llegó tarde al worker ⇒ drop”. En We Do practicarás el predicado, la tabla de tres rutas y la rama WAIT_FOR_WATERMARK.
- **Code/output changes:** none
- **Validation notes:** Output `112 ON_TIME` / `100 LATE` / `105 ALLOWED_LATE` / `watermark 110` alineado a theory T1-A.

---

### S46-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter invierte late/out-of-window como éxito. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra Flink/watermark pero no ancla “por qué el revisor de pipeline lo exige antes de merge”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Aceptar ventana: ON_TIME o ALLOWED_LATE
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-1A`, un evento de atención solo entra al sink si está en ventana y es ON_TIME o ALLOWED_LATE.  
  - **Meta:** corregir el predicado `meets_contract` (in_window ∧ (on_time ∨ allowed_late)).  
  - **Éxito:** imprimes exactamente `S46-T1-A PASS` con el fixture válido.  
  - **Límites:** no inventes un bound inferior; no mutes el fixture; no uses processing time.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` aprueba late/out-of-window (bug invertido).  
  2. Extrae `et`, `we`, `wm`, `al` del record.  
  3. `in_window = et <= we`; `on_time = et > wm`; `allowed_late = et <= wm and (wm - et) <= al`.  
  4. PASS solo si `in_window and (on_time or allowed_late)`; conserva el print `S46-T1-A`.
- **Proposed feedback improvement:**  
  PASS es ON_TIME o ALLOWED_LATE dentro de ventana. El starter invertía late/out-of-window: eso materializaría basura o silencios en el dashboard de Huancayo. Watermark + gracia, no un “mínimo inventado”.
- **Proposed retrospective:**  
  Aceptación de ventana = en ventana y no demasiado late. El error clásico es tratar LATE como éxito o mezclar *processing time*. Siguiente (E2): tres rutas válido / late / missing de gracia.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S46-T1-A PASS` correctos.

---

### S46-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres payloads (válido et=110, late et=80, sin `allowed_lateness`). Starter mantiene missing pero invierte el predicado de dominio. Falta escena “missing ≠ late” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de watermark (PASS / SIDE_OUTPUT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de stream en Huancayo no trata igual un evento limpio, uno demasiado late y uno sin política de gracia.  
  - **Meta:** implementar `assess` que distinga PASS, SIDE_OUTPUT_LATE_EVENT y MISSING:allowed_lateness.  
  - **Éxito:** imprime `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness` (y el booleano de contrato del scaffold).  
  - **Límites:** si falta `allowed_lateness`, no evalúes late; no inventes la gracia; missing ≠ “aceptar”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: missing está bien; el predicado de dominio está invertido.  
  2. Primero: campos required; si falta alguno → `MISSING:…`.  
  3. Luego: `et <= we` y (`et > wm` o `wm - et <= al`) → PASS; si no → SIDE_OUTPUT_LATE_EVENT.  
  4. Imprime los tres resultados en ese orden.
- **Proposed retrospective:**  
  Missing es incertidumbre de política; late es breach de frescura de evento. El error clásico es rellenar `allowed_lateness` por defecto. Luego (E3) enrutas CONTINUE / SIDE_OUTPUT / WAIT_FOR_WATERMARK.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S46-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos operativos de stream. Starter trata missing como CONTINUE y tiene predicado invertido — defecto de promote silencioso. Falta preamble de “producción fail-closed” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide late data: CONTINUE o WAIT
- **Proposed preamble:**  
  - **Contexto:** el worker de atenciones decide si el evento **sigue** al sink, va a side-output o espera política de watermark.  
  - **Meta:** `decide` → CONTINUE (limpio), SIDE_OUTPUT_LATE_EVENT (late), WAIT_FOR_WATERMARK (sin gracia).  
  - **Éxito:** `CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK`.  
  - **Límites:** no inventes `allowed_lateness`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `allowed_lateness` → `WAIT_FOR_WATERMARK` (no CONTINUE).  
  2. Con record completo, reutiliza el predicado de E1/E2.  
  3. Solo el limpio es CONTINUE; el de et=80 es SIDE_OUTPUT_LATE_EVENT.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un evento sin política de gracia es espera operativa, no un allow optimista. El error clásico es promover late data “para no perder el dashboard”. Pregunta: ¿por qué WAIT no es lo mismo que SIDE_OUTPUT?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A y al youDo (solo ON_TIME/ALLOWED_LATE entran al merge).

---

### S46-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: primer apply True, retry False, late con política side-output, sink solo e1. Falta preamble de “exactly-once no es flag del broker” y retrospective del misconception “si la cola dice exactly-once, el dashboard no duplica”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Exactly-once end-to-end no es un switch del middleware: es sink idempotente + dedup + checkpoint + late policy. En esta demo el reintento de `e1` no reescribe y el late `e2` se enruta con política explícita, sin colarse al agregado. No escribas: predice first/retry y las keys del sink. Si el retry devolviera True, el dashboard de Huancayo contaría doble la misma atención.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cadena at-least-once fuente → checkpoint → sink por clave → late_policy documentada. Puente a We Do: set equality (no len), tres rutas y CHOOSE_LATE_POLICY.
- **Proposed retrospective:**  
  Exactly-once compuesto se demuestra con reintento que no reescribe y late que no se mezcla en silencio. El error clásico es confiar en el broker. We Do: predicado, assess y decide de replay/policy.
- **Code/output changes:** none
- **Validation notes:** Output `first True` / `retry False` / `late side-output e2` / `sink_keys ['e1']` alineado a theory T1-B.

---

### S46-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defecto real y didáctico: `len(event_ids) == len(sink_ids)` o policy vacía como PASS — confunde longitudes con sets. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Exactly-once: set, checkpoint y policy
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-1B`, el sink de atenciones solo es “exactly-once compuesto” si keys, checkpoint y late_policy cierran juntos.  
  - **Meta:** corregir `meets_contract` a set(event_ids)==sink_ids ∧ checkpoint==2 ∧ policy ∈ catálogo.  
  - **Éxito:** `S46-T1-B PASS`.  
  - **Límites:** no uses longitudes; no apruebes policy vacía; no mutes el fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: compara `len` o aprueba sin policy (bug).  
  2. Compara `set(record["event_ids"])` con `sink_ids`.  
  3. Exige `checkpoint == 2` y `late_policy in {"update", "side-output", "quarantine"}`.  
  4. Conserva print `S46-T1-B` y assert.
- **Proposed feedback improvement:**  
  `[e1,e1,e2]` tiene len 3 y set size 2: solo el set prueba dedup. Checkpoint y policy son eslabones del compuesto; sin ellos el “exactly-once” de marketing es doble conteo.
- **Proposed retrospective:**  
  Dedup por set + checkpoint + policy = cadena, no booleano mágico. El error clásico es confiar en `len`. Siguiente (E2): PASS / REPLAY / MISSING:late_policy.
- **Code/output changes:** none
- **Validation notes:** Fixture con retry de e1 es excelente para forzar set equality.

---

### S46-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas claras; adverso con sink incompleto, checkpoint 0 y policy vacía. Starter invierte dominio tras missing correcto. Falta anclar “missing de policy ≠ sink corrupto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de sink (PASS / REPLAY / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el on-call de datos distingue sink limpio, sink a reprocesar e incertidumbre de política.  
  - **Meta:** `assess` → PASS / REPLAY_IDEMPOTENTLY / MISSING:late_policy.  
  - **Éxito:** `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy`.  
  - **Límites:** missing primero; no inventes late_policy; no uses len para dedup.
- **Proposed instruction/description improvements:**  
  1. Conserva el bloque missing.  
  2. Corrige la decisión: set equality + checkpoint==2 + policy en catálogo.  
  3. Cualquier fallo de dominio → REPLAY_IDEMPOTENTLY.  
  4. Imprime las tres rutas en orden.
- **Proposed retrospective:**  
  REPLAY asume que ya conoces la política y el sink está roto; MISSING es otra rama. El error clásico es colapsar ambas en un solo “falló”. Luego (E3): CHOOSE_LATE_POLICY vs REPLAY.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE / REPLAY_IDEMPOTENTLY / CHOOSE_LATE_POLICY. Starter manda missing a CONTINUE — promote ciego. Falta escena de “no reprocesar sin política”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide sink: CONTINUE o elige policy
- **Proposed preamble:**  
  - **Contexto:** antes de un replay de atenciones, el operador elige política de late o detiene el reproceso.  
  - **Meta:** `decide` → CONTINUE / REPLAY_IDEMPOTENTLY / CHOOSE_LATE_POLICY.  
  - **Éxito:** `CONTINUE REPLAY_IDEMPOTENTLY CHOOSE_LATE_POLICY`.  
  - **Límites:** sin late_policy no es breach de contenido; no uses CONTINUE en missing.
- **Proposed instruction/description improvements:**  
  1. Missing → CHOOSE_LATE_POLICY.  
  2. Con campos completos, predicado de E1/E2.  
  3. CONTINUE solo si set+checkpoint+policy OK; si no REPLAY.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  “No sé la política” y “el sink está corrupto” son runbooks distintos. El error clásico es REPLAY a ciegas. Pregunta: ¿qué harías en Huancayo si falta `late_policy` el viernes a las 18:00?
- **Code/output changes:** none
- **Validation notes:** Tokens alineados a edgeCases y feedback.

---

### S46-T2-A-DEMO (iDo)
- **Diagnosis:** Kahn claro: línea acíclica True, ciclo raw↔clean False. Falta preamble de “DAG no es horario coincidente” y retrospective del misconception “sin self-loop ya es acíclico”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un orquestador no puede planificar backfill si el grafo de assets no tiene orden topológico. En esta demo Kahn valida raw→clean→report y rechaza raw→clean→raw. No escribas: predice `line` y `cycle`. Si solo miras self-loops (`a==b`), el ciclo de dos nodos pasa y el plan de Huancayo se cuelga en reejecuciones infinitas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: seen == len(nodes) es la prueba de aciclicidad; nodos no declarados y self-loops también fallan. Puente a We Do: typed_io + is_acyclic, REJECT_DAG y DECLARE_ASSET_DEPENDENCY.
- **Proposed retrospective:**  
  Acíclico se **calcula**, no se afirma. El error clásico es “no hay self-loop ⇒ DAG OK”. We Do: predicado, tres rutas y rama de dependencia no tipada.
- **Code/output changes:** none
- **Validation notes:** Output `line True` / `cycle False` alineado a theory T2-A.

---

### S46-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba lo inverso (not typed_io o self-edge) — no verifica ciclos reales. Instruction nombra Kahn pero mezcla todo en un párrafo; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** DAG tipado y sin ciclos (Kahn)
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-2A`, raw→clean→report debe ser acíclico y con I/O tipado antes de cualquier backfill.  
  - **Meta:** `meets_contract = typed_io and is_acyclic(nodes, edges)`.  
  - **Éxito:** `S46-T2-A PASS`.  
  - **Límites:** no apruebes solo “sin self-loop”; implementa Kahn o DFS; no mutes nodos/edges.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: predicado invertido y sin detección de ciclos.  
  2. Implementa `is_acyclic` (endpoints en nodes, sin self-loop, Kahn con seen == len(nodes)).  
  3. PASS solo si `typed_io` y acíclico.  
  4. Conserva print `S46-T2-A`.
- **Proposed feedback improvement:**  
  Un ciclo raw↔clean pasaba el predicado viejo: acíclico ≠ “sin self-loop”. Sin orden topológico el gate `no_cyclic_dag` falla y el backfill no tiene ancestros bien definidos.
- **Proposed retrospective:**  
  typed_io y aciclicidad son condiciones independientes. El error clásico es confiar en el dibujo del grafo. Siguiente (E2): PASS / REJECT_DAG / MISSING:typed_io con ciclo real.
- **Code/output changes:** none
- **Validation notes:** Solution reutiliza Kahn del theory/iDo — coherente.

---

### S46-T2-A-E2 (weDo, independent)
- **Diagnosis:** Adverso es ciclo A→B→A con typed_io True — excelente. Starter solo self-loop / not typed_io. Falta preamble de “tipado no salva el ciclo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de DAG (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el planificador de assets en Huancayo rechaza ciclos aunque el I/O diga “tipado”.  
  - **Meta:** `assess` → PASS / REJECT_DAG / MISSING:typed_io.  
  - **Éxito:** `PASS REJECT_DAG MISSING:typed_io`.  
  - **Límites:** missing de typed_io antes de edges; typed_io True no perdona el ciclo.
- **Proposed instruction/description improvements:**  
  1. Conserva missing.  
  2. Importa/define `is_acyclic` como en el demo.  
  3. ok = typed_io and is_acyclic(...); si no → REJECT_DAG.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El adverso ya no es self-loop decorativo: es un ciclo que el orquestador no ordena. El error clásico es “typed_io True ⇒ confío”. Luego (E3): DECLARE_ASSET_DEPENDENCY vs REJECT.
- **Code/output changes:** none
- **Validation notes:** Fade real; invalid edges raw→clean→raw bien elegidos.

---

### S46-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE / REJECT_DAG / DECLARE_ASSET_DEPENDENCY. Starter missing→CONTINUE. Falta distinguir incertidumbre de diseño vs breach de topología.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide DAG: CONTINUE o declara dependencia
- **Proposed preamble:**  
  - **Contexto:** el orquestador no materializa a ciegas: o el grafo es válido, o se rechaza, o se declara la dependencia faltante.  
  - **Meta:** `decide` → CONTINUE / REJECT_DAG / DECLARE_ASSET_DEPENDENCY.  
  - **Éxito:** `CONTINUE REJECT_DAG DECLARE_ASSET_DEPENDENCY`.  
  - **Límites:** missing de typed_io ≠ grafo inválido; no uses solo `a != b`.
- **Proposed instruction/description improvements:**  
  1. Missing → DECLARE_ASSET_DEPENDENCY.  
  2. Con record completo, Kahn + typed_io.  
  3. Ciclo → REJECT_DAG; línea limpia → CONTINUE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  DECLARE es incertidumbre de diseño; REJECT es breach de topología — runbooks distintos. El error clásico es CONTINUAR sin typed_io. Pregunta: ¿por qué un self-loop no es el único ciclo peligroso?
- **Code/output changes:** none
- **Validation notes:** Tokens alineados a theory T2-A y youDo `is_acyclic`.

---

### S46-T2-B-DEMO (iDo)
- **Diagnosis:** Tres casos: ok, overlap, bad_resume. Falta preamble de “schedule ≠ permiso de re-run” y retrospective del misconception “reanudar desde el inicio del día es seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un schedule horario no autoriza a reprocesar el mismo rango dos veces. En esta demo se calcula solape half-open y se exige `resume_from == checkpoint`. No escribas: predice ok / overlap / bad_resume. Si el backfill de las 3 h perdidas en Huancayo solapa con el job vivo, corrompes la partición aunque “el cron diga que toca”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: solape se deriva de intervalos ordenados; resume alineado al checkpoint evita double-write. Puente a We Do: calcular solape (no flag), STOP_OVERLAPPING_BACKFILL y RECOVER_CHECKPOINT.
- **Proposed retrospective:**  
  Backfill seguro = sin solape + resume = checkpoint. El error clásico es confiar en un flag `overlap` del payload. We Do: predicado calculado, tres rutas y runbook de recovery.
- **Code/output changes:** none
- **Validation notes:** Output `ok True` / `overlap False` / `bad_resume False` correcto.

---

### S46-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter calcula solape pero **invierte** la decisión (PASS si hay solape o resume roto). Instruction ya dice “calcula, no confíes en flag” — bien; falta estructura pedagogy.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Backfill sin solape y resume = checkpoint
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-2B`, el plan de backfill de atenciones solo es seguro si los intervalos half-open no se pisan y el resume coincide con el checkpoint.  
  - **Meta:** invertir el bug: PASS si **no** hay solape y checkpoint == resume_from.  
  - **Éxito:** `S46-T2-B PASS`.  
  - **Límites:** calcula solape desde números; no confíes en un flag; half-open: tocar en el borde está bien.
- **Proposed instruction/description improvements:**  
  1. Ordena intervalos por start.  
  2. `computed_overlap = any(end_i > start_{i+1})`.  
  3. `meets_contract = not computed_overlap and checkpoint == resume_from`.  
  4. Conserva print `S46-T2-B`.
- **Proposed feedback improvement:**  
  El solape se **deriva** de los intervalos half-open; un flag en el record es pista, no verdad del plan. Resume ≠ checkpoint es double-write disfrazado de “reintento”.
- **Proposed retrospective:**  
  Plan de backfill = intervalos no solapados + resume consistente. El error clásico es aprobar lo que debería STOP. Siguiente (E2): adverso con solape 3–4 y resume “start”.
- **Code/output changes:** none
- **Validation notes:** Bug invertido bien diseñado; solution correcta.

---

### S46-T2-B-E2 (weDo, independent)
- **Diagnosis:** Adverso con [[1,4],[3,6]] y resume_from='start' — excelente. Starter solo compara checkpoint/resume invertido y **no calcula solape**. Falta anclar print-theater de orquestación.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de backfill (PASS / STOP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el planificador no puede confiar en un booleano del ticket: debe medir solape y alinear resume.  
  - **Meta:** `assess` → PASS / STOP_OVERLAPPING_BACKFILL / MISSING:resume_from.  
  - **Éxito:** `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from`.  
  - **Límites:** calcula half-open; resume “start” no es checkpoint; missing primero.
- **Proposed instruction/description improvements:**  
  1. Conserva missing de resume_from.  
  2. Calcula `computed_overlap` sobre intervals ordenados.  
  3. PASS solo si not overlap y resume == checkpoint.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El adverso solapa 3–4 en half-open: mirar solo strings de resume es teatro. Luego (E3): RECOVER_CHECKPOINT cuando falta estado.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / STOP / RECOVER_CHECKPOINT. Starter missing→CONTINUE y no calcula solape. Falta runbook de “estado vs plan”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide backfill: CONTINUE o recupera checkpoint
- **Proposed preamble:**  
  - **Contexto:** sin `resume_from` no hay plan ejecutable; con solape no hay plan seguro.  
  - **Meta:** `decide` → CONTINUE / STOP_OVERLAPPING_BACKFILL / RECOVER_CHECKPOINT.  
  - **Éxito:** `CONTINUE STOP_OVERLAPPING_BACKFILL RECOVER_CHECKPOINT`.  
  - **Límites:** no trates resume_from=\"start\" como checkpoint; calcula solape siempre.
- **Proposed instruction/description improvements:**  
  1. Missing → RECOVER_CHECKPOINT.  
  2. Calcula solape half-open.  
  3. Plan limpio → CONTINUE; solape o resume roto → STOP.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  RECOVER es incertidumbre de estado; STOP es breach de planificación — distintos runbooks. El error clásico es CONTINUAR sin resume. Pregunta: ¿qué partición corrompes si solapas con el job de las 12:00?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T2-B y youDo `backfill_ok`.

---

### S46-T3-A-DEMO (iDo)
- **Diagnosis:** Tres evaluaciones: PASS, drift de schema, lag sobre SLO. Falta preamble de “schema y freshness se monitorean aparte” y retrospective del misconception “si el tipo está bien, el lag no importa”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un contrato de datos une schema, owner y SLO de frescura — y falla cerrado. En esta demo el mismo schema pasa con lag 30/60, cuarentena por `case_id:int` y cuarentena por lag 90/60. No escribas: predice las tres salidas. Si “arreglas freshness” cuando el tipo de columna ya está roto, publicas basura al dashboard de operaciones de Huancayo.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: dos motivos distintos de QUARANTINE (drift vs lag); owner vacío pagina. Puente a We Do: predicado, MISSING:owner y PAGE_DATA_OWNER.
- **Proposed retrospective:**  
  Schema correcto con dato de ayer sigue siendo breach de frescura. El error clásico es un solo if que mezcla todo. We Do: fail-closed, tres rutas y page al owner.
- **Code/output changes:** none
- **Validation notes:** Output PASS / QUARANTINE / QUARANTINE alineado a theory T3-A.

---

### S46-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte igualdad de schema y comparación de lag; además **omite** owner en el predicado defectuoso (y la solution sí lo exige). Instruction corta; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contrato schema + freshness + owner
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-3A`, `atenciones_diarias` solo publica si schema exacto, lag ≤ SLO y hay owner.  
  - **Meta:** `meets_contract` con las tres conjunciones (no las inversas).  
  - **Éxito:** `S46-T3-A PASS`.  
  - **Límites:** no publiques “casi bien”; owner vacío es breach; no mutes el fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: predicado invertido (y sin owner).  
  2. Exige schema == observed_schema.  
  3. Exige freshness_min ≤ slo_min y bool(owner).  
  4. PASS → print `S46-T3-A PASS`; si no QUARANTINE_DATASET.
- **Proposed feedback improvement:**  
  Fail closed: drift o frescura rota no se publican. Owner vacío es breach de ownership aunque el schema coincida — el on-call no debe adivinar a quién paginar.
- **Proposed retrospective:**  
  Contrato = schema + lag + owner. El error clásico es publicar con warning. Siguiente (E2): cuarentena vs MISSING:owner.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; starter omite owner a propósito (doble defecto).

---

### S46-T3-A-E2 (weDo, independent)
- **Diagnosis:** Adverso con case_id:int, lag 80 y owner vacío. Starter invierte dominio. Falta escena missing≠cuarentena.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de contrato (PASS / QUARANTINE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de calidad separa dataset roto de record de control incompleto.  
  - **Meta:** `assess` → PASS / QUARANTINE_DATASET / MISSING:owner.  
  - **Éxito:** `PASS QUARANTINE_DATASET MISSING:owner`.  
  - **Límites:** en E2 no uses PAGE_DATA_OWNER; missing primero; no inventes owner.
- **Proposed instruction/description improvements:**  
  1. Conserva missing.  
  2. ok = schema exacto ∧ lag ≤ slo ∧ owner.  
  3. Si no ok → QUARANTINE_DATASET.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Cuarentena es breach de contenido; MISSING es schema incompleto del control. El error clásico es tratar owner ausente como “data-ops por defecto”. Luego (E3): PAGE_DATA_OWNER.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / QUARANTINE / PAGE_DATA_OWNER. Starter missing→CONTINUE. Falta “no asumas data-ops”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide contrato: CONTINUE o page al owner
- **Proposed preamble:**  
  - **Contexto:** sin owner no se cuarentena a ciegas ni se publica: se pagina.  
  - **Meta:** `decide` → CONTINUE / QUARANTINE_DATASET / PAGE_DATA_OWNER.  
  - **Éxito:** `CONTINUE QUARANTINE_DATASET PAGE_DATA_OWNER`.  
  - **Límites:** no inventes owner por defecto; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → PAGE_DATA_OWNER.  
  2. Predicado de E1/E2 con campos completos.  
  3. Breach → QUARANTINE; limpio → CONTINUE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  PAGE es incertidumbre de ownership; QUARANTINE es breach de contrato — runbooks distintos. El error clásico es asumir `data-ops`. Pregunta: ¿qué publicas si lag=80 y schema drift a la vez?
- **Code/output changes:** none
- **Validation notes:** Tokens alineados a youDo `ops_status`.

---

### S46-T3-B-DEMO (iDo)
- **Diagnosis:** Construye facet run/inputs/outputs/null_rate/owner y decide page=False. Falta preamble de “lineage no es print de listas” y retrospective del misconception “si null_rate es bajo, el incidente se reconstruye”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Lineage conecta la fila del dashboard con el run que la produjo. En esta demo un facet de `run-hyo-46` une raw-v2→clean-v3 con null_rate 0.01 y owner analytics; no se pagina. No escribas: predice el dict y `page False`. Si el run_id está vacío o faltan inputs, el post mortem de Huancayo no puede responder “qué corrida produjo esta fila”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: facet mínimo = run-/IO/métricas/owner; should_page por owner vacío, run mal formado o null_rate alto. Puente a We Do: predicado completo, OPEN_QUALITY_INCIDENT y TRACE_LINEAGE.
- **Proposed retrospective:**  
  Lineage es un facet reconstruible, no un log suelto. El error clásico es “arreglar a ciegas” sin inputs. We Do: PASS / incidente / TRACE.
- **Code/output changes:** none
- **Validation notes:** Output facet + `page False` alineado a theory T3-B.

---

### S46-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte (PASS si inputs vacíos o null_rate alto). Instruction lista bien el predicado; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Lineage: run, IO, null_rate y owner
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-3B`, un run de clean solo es trazable si el facet está completo y la calidad bajo umbral.  
  - **Meta:** `meets_contract` con run- + inputs + outputs + null_rate≤0.02 + owner.  
  - **Éxito:** `S46-T3-B PASS`.  
  - **Límites:** null_rate bajo no basta sin IO y run_id; no mutes el fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: predicado invertido.  
  2. startswith(\"run-\") y bool(inputs) y bool(outputs).  
  3. null_rate ≤ 0.02 y bool(owner).  
  4. PASS o OPEN_QUALITY_INCIDENT; print `S46-T3-B`.
- **Proposed feedback improvement:**  
  Lineage mínimo = run trazable + IO + calidad + owner. Sin un eslabón, el incidente no se reconstruye y el post mortem de Huancayo queda a ciegas.
- **Proposed retrospective:**  
  Un solo eslabón roto basta para abrir incidente. El error clásico es mirar solo null_rate. Siguiente (E2): adverso con run vacío e inputs vacíos.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S46-T3-B-E2 (weDo, independent)
- **Diagnosis:** Adverso rompe varios eslabones a la vez. Starter invierte. Falta separar MISSING de OPEN_QUALITY_INCIDENT.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de lineage (PASS / INCIDENT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de calidad no confunde record incompleto con facet roto documentado.  
  - **Meta:** `assess` → PASS / OPEN_QUALITY_INCIDENT / MISSING:owner.  
  - **Éxito:** `PASS OPEN_QUALITY_INCIDENT MISSING:owner`.  
  - **Límites:** missing primero; cualquiera de los eslabones del adverso basta para incidente.
- **Proposed instruction/description improvements:**  
  1. Conserva missing.  
  2. Aplica predicado completo de E1.  
  3. Si no ok → OPEN_QUALITY_INCIDENT.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  MISSING:owner ≠ OPEN_QUALITY_INCIDENT: schema de control vs facet de calidad. Luego (E3): TRACE_LINEAGE recupera contexto.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE. Starter missing→CONTINUE. Falta “no abras incidente por campo ausente”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide lineage: CONTINUE o traza
- **Proposed preamble:**  
  - **Contexto:** sin owner se traza lineage; con facet roto se abre incidente de calidad.  
  - **Meta:** `decide` → CONTINUE / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE.  
  - **Éxito:** `CONTINUE OPEN_QUALITY_INCIDENT TRACE_LINEAGE`.  
  - **Límites:** no abras incidente por missing; no uses CONTINUE en incertidumbre.
- **Proposed instruction/description improvements:**  
  1. Missing → TRACE_LINEAGE.  
  2. Predicado completo si hay campos.  
  3. Facet roto → OPEN_QUALITY_INCIDENT; limpio → CONTINUE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  TRACE recupera contexto; OPEN asume que ya sabes qué se rompió. El error clásico es incidente vacío de ownership. Pregunta: ¿qué pones en el ticket si no hay run_id?
- **Code/output changes:** none
- **Validation notes:** Alineado a youDo `lineage_facet` y tokens de incertidumbre.

---

### S46-T4-A-DEMO (iDo)
- **Diagnosis:** Merge: first 2, second 0, keys a/b. Falta preamble de “retry/backfill no duplican” y retrospective del misconception “no_dup_rerun = booleano hardcodeado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El gate CP-N4-B exige que retry y backfill no dupliquen filas. En esta demo el merge por `id` escribe 2 cambios en la primera corrida y **cero** en la segunda con el mismo batch. No escribas: predice first/second/keys. Si el segundo run reescribiera, el reporte diario de Huancayo infla conteos y costos de storage.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: contar cambios del merge prueba idempotencia de verdad; keys alineadas y small files entran en el contrato de partición. Puente a We Do: second_run_changes==0, REBUILD_PARTITION y REVIEW_INCREMENTAL_KEY.
- **Proposed retrospective:**  
  Idempotencia se mide en cambios del segundo run, no en un flag. El error clásico es full rewrite ciego. We Do: predicado de partición, tres rutas y review de clave.
- **Code/output changes:** none
- **Validation notes:** Output `first 2` / `second 0` / `keys ['a', 'b']` alineado a theory T4-A.

---

### S46-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte keys y second_run_changes; omite small_files en el defecto. Instruction lista las tres conjunciones; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Merge incremental: keys y cero delta
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-4A`, la partición `2026-07-22` solo es sana si keys alinean, el re-run no cambia filas y los small files están bajo techo.  
  - **Meta:** tres conjunciones: source_keys==target_keys ∧ second_run_changes==0 ∧ small_files≤max.  
  - **Éxito:** `S46-T4-A PASS`.  
  - **Límites:** no ignores small_files; no mutes el fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: predicado invertido e incompleto.  
  2. Exige equality de keys.  
  3. Exige second_run_changes == 0 y small_files ≤ max_small_files.  
  4. PASS o REBUILD_PARTITION; print `S46-T4-A`.
- **Proposed feedback improvement:**  
  Idempotencia de partición = keys alineadas + segundo run sin delta + higiene de archivos. second_run_changes > 0 implica que el merge no es función del batch de entrada.
- **Proposed retrospective:**  
  El segundo run con cero cambios es la prueba del gate. El error clásico es solo mirar keys. Siguiente (E2): drift + delta + small files altos.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S46-T4-A-E2 (weDo, independent)
- **Diagnosis:** Adverso con partition \"all\", keys drift, changes=3, small_files=30. Starter invierte y no mira small_files. Falta MISSING:max_small_files en escena.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de merge (PASS / REBUILD / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de particiones reconstruye cuando el sink ya no es función del batch; no adivina el techo de small files.  
  - **Meta:** `assess` → PASS / REBUILD_PARTITION / MISSING:max_small_files.  
  - **Éxito:** `PASS REBUILD_PARTITION MISSING:max_small_files`.  
  - **Límites:** missing de max antes de comparar; cualquier condición rota basta para REBUILD.
- **Proposed instruction/description improvements:**  
  1. Conserva missing.  
  2. ok = keys iguales ∧ changes==0 ∧ small_files ≤ max.  
  3. Si no → REBUILD_PARTITION.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  REBUILD es la respuesta a un sink corrupto o higiénicamente roto. Luego (E3): REVIEW_INCREMENTAL_KEY cuando falta el límite de diseño.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / REBUILD / REVIEW_INCREMENTAL_KEY. Starter missing→CONTINUE. Falta “review de clave ≠ rebuild automático”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide merge: CONTINUE o revisa la clave
- **Proposed preamble:**  
  - **Contexto:** sin `max_small_files` se revisa el diseño del merge; con delta en re-run se reconstruye.  
  - **Meta:** `decide` → CONTINUE / REBUILD_PARTITION / REVIEW_INCREMENTAL_KEY.  
  - **Éxito:** `CONTINUE REBUILD_PARTITION REVIEW_INCREMENTAL_KEY`.  
  - **Límites:** no rebuild automático por missing; no CONTINUAR en incertidumbre.
- **Proposed instruction/description improvements:**  
  1. Missing → REVIEW_INCREMENTAL_KEY.  
  2. Predicado de E1/E2.  
  3. Merge roto → REBUILD; limpio → CONTINUE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  REVIEW es incertidumbre de diseño de clave/límite; REBUILD es breach materializado. El error clásico es rebuild a ciegas. Pregunta: ¿qué prueba el second_run_changes==0 en el portfolio?
- **Code/output changes:** none
- **Validation notes:** Alineado a youDo merge + CP-N4-B.

---

### S46-T4-B-DEMO (iDo)
- **Diagnosis:** ops_decision: PASS vs DECLARE_DATA_INCIDENT + nota sli_vs_slo. Falta preamble de “SLI medida vs SLO objetivo” y retrospective del misconception “si el schema pasa, el SLI se ignora”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un SLO de datos une un SLI medido con un objetivo y un RTO de recuperación. En esta demo el simulacro sano (sli 0.995, rto 25, 3 acciones, owner) pasa; el de sli 0.80 / rto 90 / sin acciones declara incidente. No escribas: predice PASS y DECLARE. Si confundes SLI con SLO, el runbook de Huancayo no sabe cuándo activarse.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: sli ≥ slo, rto ≤ target, ≥1 acción de post mortem y owner; sin owner se activa runbook. Puente a We Do: predicado, MISSING:owner y ACTIVATE_RECOVERY_RUNBOOK.
- **Proposed retrospective:**  
  SLI es medida; SLO es objetivo. El error clásico es prometer frescura en el README sin simulacro. We Do: PASS / incidente / runbook.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-B y self-check de SLI/SLO.

---

### S46-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte sli/slo y rto; omite postmortem_actions y owner en el defecto. Instruction lista las cuatro condiciones; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** SLI, RTO, post mortem y owner
- **Proposed preamble:**  
  - **Contexto:** en `CASO-HYO-046-4B`, el simulacro de ops de atenciones solo pasa si frescura, RTO, acciones y owner cierran.  
  - **Meta:** sli ≥ slo ∧ rto ≤ target ∧ actions ≥ 1 ∧ owner.  
  - **Éxito:** `S46-T4-B PASS`.  
  - **Límites:** no apruebes con postmortem_actions=0; no ignores owner.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: predicado invertido e incompleto.  
  2. Compara sli con slo (≥) y rto con target (≤).  
  3. Exige postmortem_actions ≥ 1 y bool(owner).  
  4. PASS o DECLARE_DATA_INCIDENT; print `S46-T4-B`.
- **Proposed feedback improvement:**  
  SLO de datos se demuestra con desigualdades y dueño, no con un README. Un simulacro sin acciones de post mortem es teatro operativo.
- **Proposed retrospective:**  
  Cuatro eslabones: SLI, RTO, acciones, owner. El error clásico es mirar solo el porcentaje de frescura. Siguiente (E2): adverso multi-indicador.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S46-T4-B-E2 (weDo, independent)
- **Diagnosis:** Adverso sli=0.8, rto=90, actions=0, owner vacío. Starter invierte y no mira actions/owner. Falta “un indicador roto basta”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de ops (PASS / INCIDENT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el on-call declara incidente por evidencia numérica, no por “anda lento”.  
  - **Meta:** `assess` → PASS / DECLARE_DATA_INCIDENT / MISSING:owner.  
  - **Éxito:** `PASS DECLARE_DATA_INCIDENT MISSING:owner`.  
  - **Límites:** missing primero; un solo indicador roto basta para DECLARE.
- **Proposed instruction/description improvements:**  
  1. Conserva missing.  
  2. ok = sli≥slo ∧ rto≤target ∧ actions≥1 ∧ owner.  
  3. Si no → DECLARE_DATA_INCIDENT.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El incidente se declara con números. Luego (E3): ACTIVATE_RECOVERY_RUNBOOK cuando falta owner — no un incidente vacío de ownership.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S46-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / DECLARE / ACTIVATE_RECOVERY_RUNBOOK. Starter missing→CONTINUE. Falta “runbook ≠ incidente”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide ops: CONTINUE o activa runbook
- **Proposed preamble:**  
  - **Contexto:** sin owner se activa el runbook de recovery; con métricas rotas se declara incidente.  
  - **Meta:** `decide` → CONTINUE / DECLARE_DATA_INCIDENT / ACTIVATE_RECOVERY_RUNBOOK.  
  - **Éxito:** `CONTINUE DECLARE_DATA_INCIDENT ACTIVATE_RECOVERY_RUNBOOK`.  
  - **Límites:** no declares incidente vacío de ownership; no CONTINUAR en missing.
- **Proposed instruction/description improvements:**  
  1. Missing → ACTIVATE_RECOVERY_RUNBOOK.  
  2. Predicado de E1/E2.  
  3. Métricas/acciones rotas → DECLARE; limpio → CONTINUE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  El runbook responde a incertidumbre operativa; el incidente asume owner y métricas. El error clásico es DECLARE sin dueño. Pregunta de cierre: ¿qué RTO mides en el simulacro de Huancayo?
- **Code/output changes:** none
- **Validation notes:** Cierra T4-B y alimenta youDo ops + portfolio CP-N4-B.

---

### S46-youDo (youDo)
- **Diagnosis:** Proyecto capstone sólido: scaffold con EVENTS, watermark, DAG, backfill, stubs de funciones y prints de evidencia. `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` están maduros y alineados a CP-N4-B. **Falta `retrospective`** de defensa (qué invariante demuestras, qué harías con datos reales vs sintéticos, frase de impacto). El learner cierra el build sin metacognición guiada.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Pipeline incremental Huancayo (CASO-HYO-046)
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; no duplicar en campo preamble si el schema youDo no lo usa. Opcional: una línea al final de `context` que recuerde “solo ON_TIME/ALLOWED_LATE entran al merge” (ya está en starter comments).
- **Proposed instruction/description improvements:**  
  Mantener objectives/requirements. Asegurar en Fix round que el starter no se convierta en checklist de booleans (portfolioNote ya lo dice). No cambiar outputs esperados del scaffold.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante del gate CP-N4-B demuestras con second_run_changes==0 y con is_acyclic? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, late policy en producción)? (3) Escribe en el README una frase de impacto medible (antes/después: late silencioso → side-output; re-run → 0 cambios) que puedas defender en 30 segundos. Riesgo residual: el lab es stdlib — no simula cluster ni watermark de Flink completo.
- **Code/output changes:** none (scaffold ya calcula labels/accepted/unique_batch; el alumno completa funciones)
- **Validation notes:** Requirements y rubric cubren watermark, merge, DAG, contratos, lineage y trade-offs; falta solo cierre metacognitivo.

---

## Priority order

### P0 (hacer primero — We Do sin title/preamble/retrospective)
1. **S46-T1-A-E1, E2, E3** — watermark / late / WAIT (base del gate y del youDo merge)
2. **S46-T1-B-E1, E2, E3** — exactly-once compuesto + late_policy
3. **S46-T2-A-E1, E2, E3** — DAG Kahn / REJECT / DECLARE
4. **S46-T2-B-E1, E2, E3** — backfill calculado / STOP / RECOVER
5. **S46-T3-A-E1, E2, E3** — contrato + freshness + PAGE owner
6. **S46-T3-B-E1, E2, E3** — lineage + TRACE / incidente
7. **S46-T4-A-E1, E2, E3** — merge idempotente / REBUILD / REVIEW key
8. **S46-T4-B-E1, E2, E3** — SLI/SLO/RTO / runbook

Para cada We Do: añadir `title`, `preamble` (4 bullets o 80–150 palabras), reescribir `instruction` a pasos solo-tarea (40–100 palabras), reforzar `feedback` (25–60 palabras) y añadir `retrospective` (40–80 palabras). Respetar fade E1 (señala defecto) → E2 (tres rutas) → E3 (tokens operativos).

### P1
- **8 iDo demos:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras donde quede corto.
- **youDo:** añadir `retrospective` de defensa portfolio / CP-N4-B.

### P2
- Unificar tono de `feedback` hacia “por qué importa al promote / dashboard / post mortem”.
- Opcional: en solutionCode E2/E3, reemplazar tautologías `meets_contract = ('1A-0' == '1A-0')` por assert del predicado real **sin** cambiar tokens de salida impresos.
- Nota de naming `gpu-computing` / `s46-gpu-computing.ts` para orchestrator (fuera de scope del Fixer de prosa salvo mandato).

---

## Residual risks
1. **Carga cognitiva Master:** 24 We Do + 8 iDo + youDo es denso; sin preambles el newbie se ahoga en tokens. El Fixer no debe alargar más el código — solo la prosa de guía.
2. **Homogeneidad del patrón E1/E2/E3:** el *código* es deliberadamente isomorfo (predicado → assess → decide). El riesgo anti-aberration es que el Fixer copie preambles entre subtemas; cada familia debe anclar su dominio (watermark vs DAG vs merge vs SLO) y el hilo Huancayo con verbos distintos.
3. **Naming interno `gpu-computing`:** confusión de mantenedores, no de learners en UI; no “arreglar” en ronda de prosa sin ticket.
4. **Simplificación pedagógica de watermark/gracia:** el lab no modela cierre de ventana de Flink/Beam completo; la retrospective debe evitar sobreclaim (“esto es Flink production”).
5. **Tautologías meets_contract en E2/E3:** pueden enseñar mal el hábito de assert; bajo prioridad frente a preamble/retrospective.
6. **youDo scope:** integra casi todos los subtemas; sin retrospective el portfolio pierde la defensa de trade-offs completeness vs latencia y costo de backfill (criterio 10% de la rubric).

---

## Fixer handoff checklist (no implementar aquí)
- [ ] 24 We Do: `title` + `preamble` + instruction solo-tarea + `retrospective` (+ feedback reforzado)
- [ ] 8 iDo: `preamble` + `retrospective` (+ `why` al rango)
- [ ] 1 youDo: `retrospective`
- [ ] Preservar outputs exactos y tokens operativos
- [ ] Español profesional peruano; sin PII real; fixtures CASO-HYO-046
- [ ] Sin generadores ni bulk replace de prosa
- [ ] Fade E1→E2→E3 visible en la prosa, no solo en el código

Section 46 exercise pedagogy review complete. Ready for the Fixer prompt.
