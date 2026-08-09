# S26 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Orquestación y VP RPA + AI Analyst
- **shortTitle:** VP RPA + AI Analyst
- **id:** `integrator-phase1`
- **index:** 26
- **source:** `src/lib/course/sections/s26-integrator-phase1.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S26-T1-A DAG/estados/path · T1-B límites/metadata/schedules · T2-A checkpoint/retry/DLQ · T2-B idempotencia/rollback/locks · T3-A colas HITL triple · T3-B approve/reject/edit/audit · T4-A SLO/alertas/runbook · T4-B E2E/seguridad/costo/regresión N2
- **hilo de caso:** cierre **CP-N2-C** del Value Proposition **RPA + AI Analyst** (escritorio de operaciones sintético, p. ej. Lima/San Isidro): path canónico `ingest → validate → analyze → ai_assist → report → approve → draft_email`; evidencia por estado; HITL triple; `fraud_labels=0`; regresión N2 + CF-2; cero envíos reales

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` en `s26-integrator-phase1.ts` (iDo ~365–627, weDo ~629–1451, youDo ~1453–1543).
- Contrastado con el hilo de la sección: path de 7 steps, `run_id` + America/Lima, DLQ con owner, create-once + superseded, triple gate HITL, alertas de runbook, paquete E2E sin auto-fraude.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota de contexto: el spec lista S26 como *gold tone reference* de tono; el **código** de S26 es maduro, pero los campos `preamble` / `title` / `retrospective` **aún no existen** en el source — el gap verbal es el mismo patrón de secciones vecinas.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S26 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y a menudo “pensando en voz alta”; no sustituye preamble formal (escena + qué observar) |
| I Do `why` | Presente y alineado al contrato del VP; suele ser **1 frase densa** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra vista parcial vs full path, Pass exacto, contrato y a veces el DEFECT; **mezcla** contexto + meta + éxito + límites en un solo bloque — opaco para un newbie sin escena de operaciones |
| We Do `feedback` | Presente en los 24; nombra el *porqué* del bug (bien); a veces 1 frase; poco metacognitivo ni ancla de “qué hacer en el dashboard del VP” |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | Progresivos; E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade real |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N2-C |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y cierre N2; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (path canónico, DEFECT nombrados, outputs canónicos, fade E1→E3 por subtema, fail-closed HITL, `fraud_labels=0`, runbook con nombres de alerta) es de referencia. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un escritorio de ops en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: path parcial desde edges → aristas con `zip` → estado global del flow; T2-A: backoff → DLQ con owner → checkpoint de pendientes; T3-B: append approve → reject sin reason → edit versionado). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S26-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida: deriva el path de 7 steps desde `edges` (incluye `ai_assist` y `draft_email` tras `approve`). La `description` “pensando en voz alta” es útil pero no es preamble (no fija *qué observar* ni escena de ops). Falta `retrospective` del misconception “el orden del pipeline se inventa en una lista fija”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El cierre CP-N2-C no “elige un orden a gusto”: el path del VP sale de dependencias de negocio. En esta demo recorres aristas `a→b` desde `ingest` hasta `draft_email`, con `ai_assist` (traspaso de S25) y `approve` **antes** del borrador. No escribas aún: predice la lista de 7 nodos y por qué omitir `validate` o poner `draft_email` antes de `approve` rompería el contrato. Observa `n_steps` y el `ok` final.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el orden se deriva de edges, no de una lista hardcodeada; `ai_assist` es el handoff de la IA que solo propone; el gate HITL es dependencia de negocio, no preferencia de UX; un ciclo o un salto impide arrancar el flow. Puente a We Do: path parcial, aristas con `zip` y estado global.
- **Proposed retrospective:**  
  Si puedes explicar por qué `approve` precede a `draft_email` sin mirar el código, ya internalizaste el contrato del VP. El error clásico es inventar el orden o “ahorrar” `validate`. En We Do derivarás un tramo parcial y agregarás el estado del flow.
- **Code/output changes:** none
- **Validation notes:** Output de 7 steps + `n_steps 7` alineado a theory T1-A.

---

### S26-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter salta `validate` y hardcodea. Instruction densa ya nombra vista parcial vs full path y Pass; sin title, preamble ni retrospective. Feedback nombra el bug del DAG pero no ancla “por qué el dashboard del analista miente”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Derivar path parcial desde edges
- **Proposed preamble:**  
  - **Contexto:** en el lab del VP a veces trabajas un tramo base (sin AI ni email) para validar dependencias antes del path completo.  
  - **Meta:** derivar el orden lineal de `partial_edges` empezando en `ingest`, sin inventar nodos.  
  - **Éxito:** `['ingest', 'validate', 'analyze', 'report']`.  
  - **Límites:** no hardcodees la lista; no omitas `validate`; no inserts aún `ai_assist` ni `draft_email` (vista parcial declarada).
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime una lista que salta `validate` (DEFECT).  
  2. Inicializa `order` con el primer nodo de la primera arista.  
  3. Recorre cada `(a, b)` y, si `a` es el último de `order`, haz `append(b)`.  
  4. Imprime solo `order`.
- **Proposed feedback improvement:**  
  Saltar `validate` rompe el DAG de negocio antes de AI o correo. Derivar de edges evita inventar el orden y deja evidencia auditable en el dashboard del run.
- **Proposed retrospective:**  
  El path se *lee* de dependencias; hardcodear es un atajo que falla al cambiar el grafo. El error clásico es omitir un nodo “obvio”. Siguiente (E2): construir aristas consecutivas con `zip`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S26-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: `zip` de nodos lineales e imprimir `len` **y** edges. Instruction ya da Pass; falta escena de “evidencia de dependencias” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Aristas lineales con zip de nodos
- **Proposed preamble:**  
  - **Contexto:** un path lineal del flow sintético necesita aristas consecutivas para el grafo, no solo una lista de nombres.  
  - **Meta:** con `nodes=['a','b','c']`, construir edges con `zip` y reportar cuántas hay y cuáles son.  
  - **Éxito:** `2 [('a', 'b'), ('b', 'c')]`.  
  - **Límites:** solo path lineal (sin ciclos); no imprimas solo el `len`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: calcula `edges` bien pero imprime solo `len` (DEFECT).  
  2. Deja `list(zip(nodes, nodes[1:]))`.  
  3. Imprime `len(edges)` y `edges` en la misma línea.  
  4. No inventes aristas hacia atrás ni ciclos.
- **Proposed retrospective:**  
  La evidencia de dependencias son los pares, no solo el conteo. Confundir “2 aristas” con “el grafo está modelado” deja el audit incompleto. Luego (E3) agregas el estado global del flow.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas; output canónico intacto.

---

### S26-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: agregar estado global con `any(failed)`. Instruction clara con Pass `failed`; falta anclar al dashboard del VP y retrospective de “un solo failed tumba el flow”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Estado global del flow si hay failed
- **Proposed preamble:**  
  - **Contexto:** el dashboard del VP no muestra solo nodos sueltos: necesita un estado agregado del flow.  
  - **Meta:** con `tasks={'a':'success','b':'failed'}`, decidir `failed` o `success` con `any`.  
  - **Éxito:** la cadena exacta `failed`.  
  - **Límites:** `skipped` no cuenta como failed en este lab; no hardcodees `success`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: siempre imprime `success`.  
  2. Evalúa si algún valor es `'failed'`.  
  3. Imprime `'failed'` o `'success'` según el resultado.  
  4. No mutes el dict de tasks.
- **Proposed retrospective:**  
  Un solo nodo crítico en failed debe tumbar el estado global. El error clásico es “casi todo OK ⇒ success”. Pregunta: ¿por qué `skipped` no debe contarse como failed aquí?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory de estados del flow.

---

### S26-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de metadata (`run_id`, `api_rpm`, `tz`) y preflight. Description útil; falta preamble de “sin metadata no hay audit ni schedule defendible” y retrospective del misconception “el cron basta sin límites”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de habilitar un schedule en un escritorio de ops (p. ej. San Isidro), el run necesita metadata mínima: `run_id`, límite de `api_rpm` y zona `America/Lima`. En esta demo construyes esa foto y un preflight didáctico que marca `too_high` si el rpm supera 60. No escribas: predice el dict impreso y por qué un burst sin límite tumbaría el export sintético.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el `run_id` une logs, HITL y artefactos; la metadata es inmutable al start (no reescribir a mitad del batch); el preflight protege el endpoint compartido; en prod se suman `trigger`, `git_sha` y `data_cutoff`. Puente a We Do: snapshot, umbral real y schedule Lima.
- **Proposed retrospective:**  
  Metadata + límites son el contrato del schedule, no adornos. El error clásico es “subir el rpm y ver qué pasa”. We Do: snapshot de dos claves, preflight 60 y cron con tz Lima.
- **Code/output changes:** none
- **Validation notes:** Output `preflight ok` alineado a theory T1-B.

---

### S26-T1-B-E1 (weDo, guided)
- **Diagnosis:** Guiado claro: snapshot de `run_id` + `api_rpm` vs imprimir el dict entero. Instruction densa con Pass; sin title/preamble/retrospective. Feedback bueno sobre join/ops, pero no cierra el hábito de inmutabilidad.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Snapshot inmutable run_id y api_rpm
- **Proposed preamble:**  
  - **Contexto:** ops necesita una foto legible del start del run para unir logs y límites, no el dict completo con ruido.  
  - **Meta:** armar un snapshot de solo lectura con `run_id` y `api_rpm` e imprimir tupla con el tamaño.  
  - **Éxito:** `('cpn2c-1', 30, 2)`.  
  - **Límites:** no mutes `m`; no reescribas claves tras el start; no imprimas el dict entero.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `m` completo (DEFECT).  
  2. Crea `snap` solo con `run_id` y `api_rpm`.  
  3. Imprime `(snap['run_id'], snap['api_rpm'], len(snap))`.  
  4. Deja `tz` fuera del snapshot de este ejercicio.
- **Proposed feedback improvement:**  
  El dict entero no sirve como llave de join. Un snapshot de dos claves deja `run_id` + límite legibles para el dashboard y el audit del start.
- **Proposed retrospective:**  
  La foto del start es inmutable: versionas un nuevo `run_id` si cambia la foto de datos. El error clásico es reescribir metadata a mitad del batch. Siguiente (E2): preflight del umbral de rpm.
- **Code/output changes:** none
- **Validation notes:** Pass y solution correctos.

---

### S26-T1-B-E2 (weDo, independent)
- **Diagnosis:** Bug de umbral 100 vs 60 — excelente independiente. Instruction nombra ops Lima y Pass; falta preamble de escena y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Preflight api_rpm sobre umbral 60
- **Proposed preamble:**  
  - **Contexto:** en el adapter sintético de Lima, un `api_rpm` demasiado alto tumba el export compartido.  
  - **Meta:** clasificar `api_rpm=90` como `too_high` o `ok` con umbral 60.  
  - **Éxito:** la etiqueta exacta `too_high`.  
  - **Límites:** umbral didáctico 60 (no 100); este gate bloquearía `enable` del schedule.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: compara contra 100 (DEFECT).  
  2. Cambia a `api_rpm > 60`.  
  3. Imprime `'too_high'` o `'ok'`.  
  4. No alteres el valor 90 del fixture.
- **Proposed retrospective:**  
  El preflight es fail-closed: mejor bloquear el schedule que tumbar el export. Confundir umbral “generoso” con seguro es un bug de ops. Luego (E3) armarás el cron con zona Lima.
- **Code/output changes:** none
- **Validation notes:** Umbral alineado a theory San Isidro.

---

### S26-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: schedule + preflight tz/cron y salida en dos líneas. Starter con `tz='UTC'` es excelente. Instruction ya da Pass exacto; falta anclar “por qué no UTC” y retrospective. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Schedule 06:00 America/Lima listo
- **Proposed preamble:**  
  - **Contexto:** el batch del escritorio PE corre a las 06:00 en días hábiles en zona Lima, no en UTC “por defecto de servidor”.  
  - **Meta:** fijar cron + tz correctos y un preflight `ready`/`blocked`.  
  - **Éxito:** dos líneas — `ready` y `0 6 * * 1-5 America/Lima`.  
  - **Límites:** no uses UTC; el cron debe empezar por `0 6`; enable solo si ready.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: `tz` está en UTC.  
  2. Deja `America/Lima` y el cron `0 6 * * 1-5`.  
  3. Calcula `ready` con tz correcta y prefijo del cron.  
  4. Imprime la etiqueta y luego `cron` y `tz`.
- **Proposed retrospective:**  
  Un cron en UTC desplaza el batch fuera del horario operativo de Lima. El error clásico es “el servidor ya está en UTC”. Pregunta: ¿qué harías antes de un deploy que cambia el schema del informe? (disable → drain).
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory de schedules.

---

### S26-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de reanudación + DLQ con owner tras agotar intentos. Description lista el skill; falta preamble de “qué mirar en `resume_from` vs `dlq`” y retrospective del misconception “DLQ al primer fallo”. `why` denso pero corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un crash a mitad de `analyze` no debe rehacer el ingest: el checkpoint marca lo ya OK y solo reanuda pendientes. En esta demo `a` ya está en ckpt, `b` es flaky y agota 3 intentos hacia DLQ con `owner=ops_rpa`, y `c` se completa. No escribas: predice `resume_from` y el contenido de `dlq` (razón + attempts). Observa que flaky **no** cae a DLQ en el primer intento.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: skip si id ∈ ckpt; retry hasta `max_attempts`; solo entonces DLQ con reason y owner (no basurero); schema inválido de negocio no se reintenta como timeout. Puente a We Do: fórmula de backoff, append a DLQ y filtro de pendientes.
- **Proposed retrospective:**  
  Reanudar sin duplicar y escalar a humano con owner es el núcleo de resiliencia del VP. El error clásico es reprocess-all o DLQ silenciosa. We Do: backoff, mensaje de DLQ y lista de pendientes.
- **Code/output changes:** none
- **Validation notes:** Output con attempts=3 alineado a theory T2-A.

---

### S26-T2-A-E1 (weDo, guided)
- **Diagnosis:** Fórmula de backoff exponencial vs lineal — guiado limpio. Instruction con Pass 400; sin title/preamble/retrospective. Feedback nombra el problema del lineal pero no ancla 429/timeout de export.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Backoff exponencial attempt 3 base 100
- **Proposed preamble:**  
  - **Contexto:** un 429 o timeout de export no se resuelve reintentando a ritmo fijo; el lab usa espera creciente.  
  - **Meta:** calcular `base * 2**(attempt-1)` con attempt=3 y base=100.  
  - **Éxito:** el entero `400`.  
  - **Límites:** no uses `base*attempt` (lineal); este ejercicio no aplica cap ni jitter.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `base * attempt` (DEFECT lineal).  
  2. Cambia a `base * (2 ** (attempt - 1))`.  
  3. Imprime solo el entero de milisegundos.  
  4. No inventes un sleep real en el lab.
- **Proposed feedback improvement:**  
  Con attempt=3, `2**(3-1)=4` y `100*4=400`. El backoff lineal no da el respiro creciente que absorbe 429/timeout del export sintético.
- **Proposed retrospective:**  
  Exponencial da aire al servicio; lineal martilla el endpoint. El error clásico es confundir intento con multiplicador lineal. Siguiente (E2): materializar la DLQ con owner.
- **Code/output changes:** none
- **Validation notes:** Fórmula alineada a theory `backoff_sleep_ms`.

---

### S26-T2-A-E2 (weDo, independent)
- **Diagnosis:** DLQ con dict completo tras agotar attempts — independiente sólido. Instruction ya lista el Pass del dict; falta escena de dueño humano y retrospective. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** DLQ con owner tras agotar intentos
- **Proposed preamble:**  
  - **Contexto:** cuando un ítem agota reintentos de timeout, no se borra: va a DLQ con dueño y razón.  
  - **Meta:** si `attempts >= max_attempts`, append el dict de evidencia e imprimir la lista.  
  - **Éxito:** `[{'id': 'x', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]`.  
  - **Límites:** no envíes a DLQ en el primer fallo si aún hay cupo; incluye `attempts` en el dict.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `dlq` vacía aunque attempts=3 (DEFECT).  
  2. Compara `attempts` con `max_attempts`.  
  3. Append id, reason, owner y attempts.  
  4. Imprime la lista `dlq`.
- **Proposed retrospective:**  
  DLQ sin owner o sin attempts no es defendible en el runbook. El error clásico es “basurero silencioso” o DLQ prematura. Luego (E3) filtras pendientes del checkpoint.
- **Code/output changes:** none
- **Validation notes:** Contrato alineado a demo y theory.

---

### S26-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de checkpoint: filtrar ids no en ckpt. Instruction con Pass `['b']`; sin title/preamble/retrospective. Feedback bueno sobre reprocess-all.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pendientes del checkpoint tras crash
- **Proposed preamble:**  
  - **Contexto:** tras un crash, solo quieres reprocesar lo que no está en el checkpoint.  
  - **Meta:** con `ckpt={'a'}` e `items=['a','b']`, imprimir solo pendientes.  
  - **Éxito:** `['b']`.  
  - **Límites:** no reimprimas `items` completo; no mutes `ckpt` en este lab.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime todos los items.  
  2. Filtra con `i not in ckpt`.  
  3. Imprime la lista de pendientes.  
  4. No hardcodees `['b']` sin mirar ckpt.
- **Proposed retrospective:**  
  Skip si id ∈ ckpt es el contrato de reanudación. El error clásico es rehacer ingest costoso. Pregunta: ¿dónde persistirías el ckpt fuera del lab en memoria?
- **Code/output changes:** none
- **Validation notes:** Transfer limpio; output canónico.

---

### S26-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de create-once + compensación parcial (draft pop, report superseded). Description “pensando en voz alta” buena; falta preamble de *qué observar* en el segundo `put` y en `compensate`, y retrospective del misconception “rollback = borrar todo”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un reintento exitoso dos veces no debe pisar un informe ya materializado, y un fallo de `draft_email` no borra la evidencia del report. En esta demo `put_once` deja `v1` aunque llegue `v2`, y la compensación quita el draft y marca report `superseded`. No escribas: predice ambas salidas y por qué no haces `del` del report.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: create-once evita drafts duplicados bajo reentrega; compensación no es ACID mágica — es grafo explícito (draft fuera, report superseded para defensa). Puente a We Do: `put` condicional, pop+superseded y lock fail-closed.
- **Proposed retrospective:**  
  Idempotencia y compensación parcial protegen el historial del VP. El error clásico es sobrescribir en cada put o borrar el report. We Do: create-once, rollback parcial y busy cuando locked.
- **Code/output changes:** none
- **Validation notes:** Outputs `v1` y superseded alineados a theory T2-B.

---

### S26-T2-B-E1 (weDo, guided)
- **Diagnosis:** create-once vs siempre sobrescribe — guiado clásico y bien defectado. Instruction con Pass `v1`; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Write create-once sin pisar valor
- **Proposed preamble:**  
  - **Contexto:** un mensaje de cola puede reentregarse; la segunda escritura no debe pisar el report ya creado.  
  - **Meta:** implementar `put(k,v)` que solo escribe si la clave no existe.  
  - **Éxito:** tras `v1` y `v2`, imprimir `v1`.  
  - **Límites:** no hagas upsert versionado aquí; no borres el store entre puts.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `put` siempre asigna (DEFECT).  
  2. Escribe solo si `k not in store`.  
  3. Ejecuta las dos llamadas y imprime `store['r']`.  
  4. No cambies el orden de las puts.
- **Proposed feedback improvement:**  
  Sobrescribir en cada put duplica o corrompe drafts bajo reentrega. Create-once deja la primera materialización estable.
- **Proposed retrospective:**  
  Create-once es el hábito de idempotencia del lab. El error clásico es “último write gana”. Siguiente (E2): compensación cuando falla el draft.
- **Code/output changes:** none
- **Validation notes:** Pass y solution correctos.

---

### S26-T2-B-E2 (weDo, independent)
- **Diagnosis:** Compensación parcial bien planteada. Instruction ya nombra no borrar report; falta escena de defensa del capstone y retrospective. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Compensar draft y report superseded
- **Proposed preamble:**  
  - **Contexto:** falló `draft_email` después de materializar el informe; hay que revertir el side-effect del draft sin borrar evidencia.  
  - **Meta:** `pop` del draft y marcar `report='superseded'`.  
  - **Éxito:** `{'report': 'superseded'}`.  
  - **Límites:** no borres el report; no dejes el draft huérfano.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime el state intacto (DEFECT).  
  2. Haz `state.pop('draft', None)`.  
  3. Asigna `state['report'] = 'superseded'`.  
  4. Imprime `state`.
- **Proposed retrospective:**  
  Superseded conserva defensa; borrar el report borra historia. El error clásico es “rollback = wipe”. Luego (E3) el lock de concurrencia.
- **Code/output changes:** none
- **Validation notes:** Alineado a demo `compensate_failed_draft`.

---

### S26-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Lock optimista con condición invertida en starter — transfer excelente. Instruction con Pass `('busy', 'report-1')`; sin title/preamble/retrospective. Feedback ya nombra dos workers.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Lock fail-closed: busy si locked
- **Proposed preamble:**  
  - **Contexto:** dos workers no deben editar el mismo informe; si `locked=True`, reencolas.  
  - **Meta:** imprimir `('busy', id)` o `('enter', id)` según el flag.  
  - **Éxito:** `('busy', 'report-1')`.  
  - **Límites:** fail-closed (ante duda, no entras); sin busy-loop en el lab.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: la condición está invertida (enter cuando locked).  
  2. Si locked → `busy` + id; si no → `enter` + id.  
  3. Imprime la tupla.  
  4. No ignores el `id` en la salida.
- **Proposed retrospective:**  
  Busy + id deja evidencia para el runbook; entrar con lock permite corrupción. El error clásico es invertir el booleano “para probar”. Pregunta: ¿qué TTL de lease usarías en prod?
- **Code/output changes:** none
- **Validation notes:** Transfer real; output canónico.

---

### S26-T3-A-DEMO (iDo)
- **Diagnosis:** Demo del triple gate: un pending basta para bloquear. Description clara; falta preamble de escena HITL y retrospective del misconception “si report está listo, se puede mandar”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El VP no materializa correo con colas humanas abiertas. En esta demo hay tres contadores (`analysis`, `report`, `recipient`): con analysis=1 y report=1, `blocked` es True; con las tres en 0, `all_clear` es True. No escribas: predice ambas líneas y por qué un solo pending basta. Recuerda: la IA solo propone; no cierra el caso.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `any(v>0)` es el gate, no `all`; scores de matching alimentan analysis como evidencia, nunca como fraude; sin triple verde no hay `draft_email`. Puente a We Do: contar pending, any blocked y checklist de claves.
- **Proposed retrospective:**  
  Triple gate es el control anti “correo con narrativa alucinada”. El error clásico es exigir las tres colas llenas o ignorar un pending. We Do: conteo, `any` y lista de colas pendientes.
- **Code/output changes:** none
- **Validation notes:** Outputs blocked/all_clear alineados a theory T3-A.

---

### S26-T3-A-E1 (weDo, guided)
- **Diagnosis:** Contar `pending` vs `done` — guiado limpio. Instruction con Pass `1`; sin title/preamble/retrospective. Feedback nombra el bug de contar done.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar pendientes en cola analysis
- **Proposed preamble:**  
  - **Contexto:** la cola HITL de analysis muestra ítems aún por revisar; el dashboard necesita el conteo de `pending`.  
  - **Meta:** con dos ítems (pending y done), imprimir cuántos están pending.  
  - **Éxito:** el entero `1`.  
  - **Límites:** solo la cola analysis; no mutes la lista; no cuentes `done`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: filtra `status=='done'` (DEFECT).  
  2. Cambia a `status=='pending'`.  
  3. Imprime el `sum`/`conteo`.  
  4. No alteres los dicts de la lista.
- **Proposed feedback improvement:**  
  Contar `done` subestima la cola HITL y puede liberar el gate antes de tiempo. El revisor necesita pendientes reales, no “lo ya cerrado”.
- **Proposed retrospective:**  
  Pending es el único status que bloquea avance en este lab. El error clásico es mezclar done/approved en el conteo. Siguiente (E2): gate multi-cola con `any`.
- **Code/output changes:** none
- **Validation notes:** Pass y solution correctos.

---

### S26-T3-A-E2 (weDo, independent)
- **Diagnosis:** Bug `all` vs `any` — excelente independiente de gate. Instruction con Pass True; sin title/preamble/retrospective. Feedback ya explica el error de `all`.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate blocked si alguna cola > 0
- **Proposed preamble:**  
  - **Contexto:** el borrador del VP se bloquea si **cualquier** cola HITL tiene trabajo pendiente.  
  - **Meta:** con `analysis=1` y las otras en 0, decidir blocked con `any`.  
  - **Éxito:** `True`.  
  - **Límites:** no uses `all` (exigiría las tres llenas); no inventes un cuarto gate.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: usa `all(v>0)` (DEFECT).  
  2. Cambia a `any(v>0 ...)`.  
  3. Imprime el booleano.  
  4. No hardcodees `True` sin mirar `q`.
- **Proposed retrospective:**  
  Basta un pending para bloquear: es fail-closed de correo. Confundir `all` con `any` es un bug silencioso de cumplimiento. Luego (E3) listas las claves aún pending.
- **Code/output changes:** none
- **Validation notes:** Alineado a demo `queue_blocked`.

---

### S26-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Checklist derivado de status (no hardcode metrics/narrative) — transfer auténtico. Instruction con Pass y orden canónico; sin title/preamble/retrospective. Starter con checklist fijo es excelente defecto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Checklist de colas aún pending
- **Proposed preamble:**  
  - **Contexto:** el revisor del VP necesita saber **qué** colas siguen pending, no un checklist genérico de nombres de negocio.  
  - **Meta:** derivar las claves con status `pending` en orden analysis → report → recipient.  
  - **Éxito:** `['analysis', 'recipient']`.  
  - **Límites:** no hardcodees metrics/narrative; no incluyas `report` si está done.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime una lista fija de labels.  
  2. Define el orden canónico de las tres colas.  
  3. Incluye solo claves cuyo value sea `'pending'`.  
  4. Imprime esa lista.
- **Proposed retrospective:**  
  El checklist se *lee* del estado, no se memoriza. El error clásico es UI con labels desactualizados. Pregunta: ¿por qué report done no debe aparecer aunque “suene” a revisión?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a triple gate.

---

### S26-T3-B-DEMO (iDo)
- **Diagnosis:** Demo reject sin reason → invalid y approve append-only. Description fuerte; falta preamble de audit defendible y retrospective del misconception “el log se puede editar”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Sin audit, CP-N2-C no se defiende en el capstone. En esta demo un `reject` sin `reason` devuelve `invalid` (fail-closed) y un `approve` se append al log sin reescribir historia. No escribas: predice la primera línea y el `action`/`events` del approve. Observa que el sistema **no envía** correo: solo registra la decisión.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: reject exige reason no vacío; audit es append-only; actor sintético (`r1`), no correo personal; reject con reason code reabre cola según runbook. Puente a We Do: tupla de approve, invalid sin reason y edit versionado.
- **Proposed retrospective:**  
  Decisiones humanas dejan rastro append-only o no existen para defensa. El error clásico es reject “sin justificación” o reescribir el log. We Do: approve con len, gate de reason y edit 1→2.
- **Code/output changes:** none
- **Validation notes:** Outputs invalid + approve alineados a theory T3-B.

---

### S26-T3-B-E1 (weDo, guided)
- **Diagnosis:** Append approve e imprimir (action, len) vs solo actor — guiado claro. Instruction con Pass; sin title/preamble/retrospective. Feedback bueno sobre decisión + len.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Audit append-only de un approve
- **Proposed preamble:**  
  - **Contexto:** cada approve del VP debe dejar decisión y prueba de que el log creció sin reescritura.  
  - **Meta:** append `action=approve` / `actor=rev` e imprimir `(action, len(audit))`.  
  - **Éxito:** `('approve', 1)`.  
  - **Límites:** no reasignes `audit` a otra lista; no imprimas solo el actor.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime solo `actor` (DEFECT).  
  2. Tras el append, lee `action` y `len(audit)`.  
  3. Imprime la tupla.  
  4. No mutes el dict del evento ya appendeado.
- **Proposed feedback improvement:**  
  El actor solo no demuestra la decisión. La tupla `(action, len)` prueba qué se aprobó y que hay exactamente un evento append-only.
- **Proposed retrospective:**  
  Append-only es el hábito de audit del cierre. El error clásico es “log = último estado”. Siguiente (E2): reject sin reason → invalid.
- **Code/output changes:** none
- **Validation notes:** Pass y solution correctos.

---

### S26-T3-B-E2 (weDo, independent)
- **Diagnosis:** Reject sin reason → invalid — independiente alineado a API fail-closed. Instruction con Pass; sin title/preamble/retrospective. Feedback ya nombra API.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reject sin reason es invalid
- **Proposed preamble:**  
  - **Contexto:** un rechazo humano sin justificación no es defendible ni operable (¿qué cola reabrir?).  
  - **Meta:** con `action='reject'` y `reason=None`, imprimir `invalid` o `ok`.  
  - **Éxito:** `invalid`.  
  - **Límites:** reason vacío o None son inválidos; no imprimas `ok` a ciegas.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` siempre (DEFECT).  
  2. Si reject y no hay reason → `invalid`.  
  3. En cualquier otro caso → `ok`.  
  4. No inventes un reason en este ejercicio.
- **Proposed retrospective:**  
  Fail-closed en reject protege el runbook de reencolado. El error clásico es aceptar reject “mudo”. Luego (E3) versionas un edit con evento de audit.
- **Code/output changes:** none
- **Validation notes:** Alineado a demo `decide`.

---

### S26-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Edit versionado 1→2 con audit — transfer real. Instruction con Pass `(2, 1, 'edit')`; sin title/preamble/retrospective. Starter no incrementa ni audita: buen defecto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Edit versionado con evento de audit
- **Proposed preamble:**  
  - **Contexto:** una edición de narrativa del informe no borra historia: sube versión y deja evento.  
  - **Meta:** de `ver=1` pasar a 2 y append `{action, actor, from, to}`.  
  - **Éxito:** `(2, 1, 'edit')`.  
  - **Límites:** no borres eventos previos; un solo append en este lab.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime ver=1 y sin acción.  
  2. Guarda `from`, incrementa `ver`, append el dict de edit.  
  3. Imprime `(ver, len(audit), audit[-1]['action'])`.  
  4. Usa actor sintético `ana`.
- **Proposed retrospective:**  
  Versionado sin audit no es defendible en CP-N2-C. El error clásico es mutar el texto “en el mismo ver”. Pregunta: ¿por qué `from`/`to` ayudan al revisor más que un solo número?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a policy de edit.

---

### S26-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de nombres de alerta de runbook (`alert_success_rate`, `P0_unapproved_send`). Description “pensando en voz alta” útil; falta preamble de *contrato de nombres* y retrospective del misconception “un alias informal basta para on-call”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En operación del VP, el nombre de la alerta **es** el contrato del runbook: si el dashboard dice otra cosa, la página on-call se confunde. En esta demo evalúas `success_rate` bajo 0.95 y un envío sin approve. No escribas: predice las dos listas de alertas. Observa que unapproved send es P0 aunque el rate esté bien.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: umbral 0.95 diario/7d didáctico; `P0_unapproved_send` es violación de control, no warning suave; no inventes `fraud_rate` en el dashboard. Puente a We Do: string de alerta, P0 de envíos y secuencia disable→drain→page.
- **Proposed retrospective:**  
  Nombres de alerta estables unen lab, prosa y runbook. El error clásico es “alert genérico” o tratar unapproved send como ok en sandbox. We Do: umbral, P0 y runbook de contención.
- **Code/output changes:** none
- **Validation notes:** Outputs de las dos listas alineados a theory T4-A.

---

### S26-T4-A-E1 (weDo, guided)
- **Diagnosis:** Comparación invertida + nombre genérico `alert` — guiado doble bug excelente. Instruction con Pass; sin title/preamble/retrospective. Feedback nombra inversión y alias.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Alerta alert_success_rate bajo 0.95
- **Proposed preamble:**  
  - **Contexto:** el SLO del VP exige `success_rate ≥ 0.95`; por debajo se dispara la alerta del runbook.  
  - **Meta:** con `rate=0.9`, emitir el nombre canónico de alerta o `ok`.  
  - **Éxito:** `alert_success_rate`.  
  - **Límites:** compara `rate < 0.95` (no `>`); no uses un alias genérico `alert`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: condición invertida y string `alert` (DEFECT).  
  2. Corrige a `rate < 0.95`.  
  3. Imprime `'alert_success_rate'` o `'ok'`.  
  4. No cambies el fixture 0.9.
- **Proposed feedback improvement:**  
  Con 0.9 debes alertar con el nombre del runbook. Invertir la comparación o usar un alias informal rompe la página on-call y el playbook.
- **Proposed retrospective:**  
  El string de alerta es contrato, no cosmético. El error clásico es “cualquier alert sirve”. Siguiente (E2): P0 de envíos sin approve.
- **Code/output changes:** none
- **Validation notes:** Alineado a demo y theory.

---

### S26-T4-A-E2 (weDo, independent)
- **Diagnosis:** Lógica invertida en P0 unapproved send — independiente fuerte. Instruction con Pass; sin title/preamble/retrospective. Feedback ya ancla sandbox ≠ ok.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** P0 si hay envío sin approve
- **Proposed preamble:**  
  - **Contexto:** cero envíos sin approve humano es control de cumplimiento del VP (incluso en sandbox mal configurado).  
  - **Meta:** con `n=1`, emitir `P0_unapproved_send` o `ok`.  
  - **Éxito:** `P0_unapproved_send`.  
  - **Límites:** un solo envío ya es P0; no inviertas la lógica “ok si n>0”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` cuando `n>0` (DEFECT).  
  2. Si `n>0` → `P0_unapproved_send`.  
  3. Si no → `ok`.  
  4. No trates sandbox como excepción en este lab.
- **Proposed retrospective:**  
  Unapproved send es incidente de control, no de latencia. El error clásico es “era sandbox, da igual”. Luego (E3) el runbook de contención P0.
- **Code/output changes:** none
- **Validation notes:** Nombre de alerta canónico.

---

### S26-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Runbook `disable_schedule → drain → page` con severity — transfer operativo real. Instruction con Pass exacto; sin title/preamble/retrospective. Starter solo imprime `page`: buen defecto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Runbook P0 disable drain page
- **Proposed preamble:**  
  - **Contexto:** ante un P0 del VP, el on-call necesita severidad explícita y el orden de contención, no solo “avisar”.  
  - **Meta:** unir `parts` con ` -> ` e imprimir severity + secuencia.  
  - **Éxito:** `P0 disable_schedule -> drain -> page`.  
  - **Límites:** orden fijo; no omitas severity; no saltes drain.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: solo imprime `page`.  
  2. Haz `join` de las tres partes con `' -> '`.  
  3. Imprime `severity` y la secuencia en una línea.  
  4. No reordenes disable/drain/page.
- **Proposed retrospective:**  
  Contención antes de página: primero paras el cron y drenas, luego avisas. El error clásico es page-first sin drenar. Pregunta: ¿qué riesgos hay si cambias schema sin `disable_schedule`?
- **Code/output changes:** none
- **Validation notes:** Output exacto alineado a theory runbook.

---

### S26-T4-B-DEMO (iDo)
- **Diagnosis:** Mini-runner E2E con camino feliz, audit approve, fraud_labels=0, n2_regression pass y crash en analyze. Description rica; falta preamble de *qué comparar* entre camino feliz y fail, y retrospective del misconception “planned cuenta como regresión”. `why` denso pero una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El cierre de nivel exige un solo lifecycle: path de 7, gate HITL, evidencia de regresión y cero fraude automático. En esta demo el camino feliz marca 7 `success` y un approve en audit; el camino con `fail_at=analyze` deja analyze `failed` y report `pending`. No escribas: predice ambas salidas y por qué `n2_regression` es `pass` (re-run real) y no `planned`. Observa `fraud_labels 0`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: un runner une path, crash observable y gate approve→draft; `fraud_labels=0` es política de producto; la regresión N2 revalida CP-N2-A/B/C + E2E + privacy + CF-2 con evidencia, no con promesa. Puente a We Do: gate E2E, paquete anti-fraude y defense_package con value/CF-2.
- **Proposed retrospective:**  
  Un lifecycle defendible muestra success, blocked y failed con la misma máquina de estados. El error clásico es “todo success hardcodeado” o regresión “planned”. We Do: all+approve, fraud_labels+approved y paquete de cierre.
- **Code/output changes:** none
- **Validation notes:** Outputs del happy path y del fail alineados a theory T4-B.

---

### S26-T4-B-E1 (weDo, guided)
- **Diagnosis:** Gate E2E con path corto y `any` en vez de `all`+approve — guiado fuerte. Instruction densa con Pass True; sin title/preamble/retrospective. Feedback nombra path corto sin approve.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** E2E: 7 steps success y approve
- **Proposed preamble:**  
  - **Contexto:** el gate E2E del cierre CP-N2-C no se contenta con “algo pasó”: exige el path canónico completo y approve en audit.  
  - **Meta:** True solo si los 7 steps están success **y** hay al menos un approve.  
  - **Éxito:** `True`.  
  - **Límites:** path de 7 (no tres); no uses solo `any(success)`; draft no se defiende sin approve.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: path corto y `any` (DEFECT).  
  2. Lista los 7 nodos canónicos.  
  3. Combina `all(... success)` con `any(... approve)`.  
  4. Imprime el booleano.
- **Proposed feedback improvement:**  
  Un E2E de tres steps o sin approve no demuestra el gate `draft_email` del VP. El cierre exige path completo **y** decisión humana en audit.
- **Proposed retrospective:**  
  Success sin approve es un falso positivo de cierre. El error clásico es acortar el path “para la demo”. Siguiente (E2): fraud_labels=0 y approved juntos.
- **Code/output changes:** none
- **Validation notes:** Solution y path canónico correctos.

---

### S26-T4-B-E2 (weDo, independent)
- **Diagnosis:** Paquete anti auto-fraude con lógica invertida en starter — independiente excelente. Instruction con Pass `ok`; sin title/preamble/retrospective. Feedback ya exige ambas condiciones.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate fraud_labels 0 y approved
- **Proposed preamble:**  
  - **Contexto:** matching/OCR/RPA no generan etiquetas de fraude; el draft no se defiende sin approve.  
  - **Meta:** con `fraud_labels=0` y `approved=True`, emitir `ok` o `fail`.  
  - **Éxito:** `ok`.  
  - **Límites:** ambas condiciones con `and`; no inviertas “fail si labels==0”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: invierte e ignora `approved` (DEFECT).  
  2. Exige `fraud_labels==0` **y** `approved`.  
  3. Imprime `'ok'` o `'fail'`.  
  4. No eleves labels por score de matching.
- **Proposed retrospective:**  
  Cero auto-fraude y approve humano son independientes y ambos obligatorios. El error clásico es “labels en 0 ya basta”. Luego (E3) el paquete de defensa con value y CF-2.
- **Code/output changes:** none
- **Validation notes:** Política alineada a jobRelevance y theory.

---

### S26-T4-B-E3 (weDo, transfer)
- **Diagnosis:** `defense_package` omitiendo `value_minutes_saved_est` — transfer de cierre de nivel auténtico. Instruction larga pero correcta con Pass del dict; sin title/preamble/retrospective. Feedback ya nombra value/CF-2.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Paquete de defensa N2 value y CF-2
- **Proposed preamble:**  
  - **Contexto:** el paquete de cierre del VP une regresión N2, estimación de valor y nota CF-2; sin value no hay métrica de impacto.  
  - **Meta:** implementar `defense_package(...)` con las tres claves y llamar con los fixtures del lab.  
  - **Éxito:** el dict con `n2_regression`, `value_minutes_saved_est=45` y `cf2` de interfaces.  
  - **Límites:** no omitas value; no dejes `cf2` vacío; evidencia real ≠ string `planned`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el return omite `value_minutes_saved_est`.  
  2. Incluye las tres claves mapeando los argumentos.  
  3. Llama con los tres argumentos del fixture.  
  4. Imprime el dict completo.
- **Proposed retrospective:**  
  Cierre defendible = regresión re-ejecutada + valor estimado + interfaces CF-2. El error clásico es un dict de dos claves “para la demo”. Pregunta: ¿qué pondrías en `n2_regression` si un test crítico falló?
- **Code/output changes:** none
- **Validation notes:** Output del dict alineado a theory e2e_value y youDo package.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context del path canónico, objectives, requirements (sintético, cero envíos, fraud_labels=0, es-PE), starter ejecutable con `advance`/`can_draft`/`run_all`/`package_e2e`, portfolioNote y rúbrica con bonus de regresión N2/CF-2. **Falta** `retrospective` de defensa metacognitiva tras el build (spec §8.3). Sin ella, el learner cierra el portafolio sin el ritual “qué invariante demuestro / sintético vs real / frase de impacto”.
- **Checklist:** context pass · goal pass · success pass (rúbrica) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context/objectives cubren el marco; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Mantener context, objectives, requirements, starter y rúbrica. Opcional (P2): en `portfolioNote`, una viñeta que enlace el starter a “simula fail_at, HITL y paquete e2e” ya presente — no requiere reescritura grande.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante del gate demuestras con print o test (approve en audit, triple cola en 0, o blocked sin approve)? (2) ¿qué harías distinto con datos reales vs sintéticos (PII, secretos, cero envíos reales)? (3) En el README, una frase de impacto medible (p. ej. minutos estimados o regresión N2 pass) que puedas defender en 30 segundos sin abrir el código. Si no puedes explicar por qué `fraud_labels` debe quedar en 0, el cierre CP-N2-C aún no está listo.
- **Code/output changes:** none (el esqueleto es pedagógico y ejecutable; no tocar outputs del lab en esta ronda)
- **Validation notes:** Starter imprime states success, can_draft y package; alineado a demos T4-B y theory de cierre.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si flaco)
1. **S26-T1-A-E1, E2, E3** — path parcial, zip de edges, estado global del flow  
2. **S26-T1-B-E1, E2, E3** — snapshot metadata, preflight rpm, schedule Lima  
3. **S26-T2-A-E1, E2, E3** — backoff, DLQ con owner, checkpoint pendientes  
4. **S26-T2-B-E1, E2, E3** — create-once, compensación superseded, lock busy  
5. **S26-T3-A-E1, E2, E3** — count pending, any blocked, checklist colas  
6. **S26-T3-B-E1, E2, E3** — audit approve, reject invalid, edit versionado  
7. **S26-T4-A-E1, E2, E3** — alert_success_rate, P0_unapproved_send, runbook  
8. **S26-T4-B-E1, E2, E3** — E2E 7+approve, fraud/approved, defense_package  

### P1
9. **S26-T1-A-DEMO … S26-T4-B-DEMO** (8 iDo) — añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras  
10. **youDo** — añadir `retrospective` de defensa (invariante / sintético vs real / frase de impacto)

### P2
11. Endurecer `feedback` de We Do hacia 25–60 palabras con ancla de ops/runbook donde hoy es 1 frase muy corta  
12. Revisar hints E1 que casi spoilean la solución (aceptable en guided; no ampliar spoiling en E3)

---

## Residual risks

- **Gold-tone vs campos ausentes:** S26 se cita en el spec como referencia de *tono*; el Fixer no debe asumir que los campos ya existen — hay que **añadirlos** sin reescribir la lógica de código ni los outputs canónicos.
- **Densidad de instruction actual:** al separar preamble vs instruction, el Fixer debe **recortar** el instruction a pasos (40–100 palabras) y **no** dejar el essay duplicado en ambos campos.
- **Vocabulario de dominio (DAG, DLQ, HITL, SLO, CF-2):** ya está glosado en theory; las preambles propuestas lo usan en contexto de ops, no como jerga suelta — mantener esa disciplina en el fix.
- **Fade E1→E2→E3:** el contenido de código ya diferencia bien; el riesgo residual es que preambles de un subtema se lean genéricos. Cada unidad del ledger tiene escena y meta propias; el Fixer debe respetar esa diferenciación (no plantilla “Contexto: el VP…” idéntica en 24).
- **You Do scope:** el starter ya es un mini-orquestador; la retrospective no debe pedir un segundo pipeline, solo defensa y reflexión.
- **Sin cambios de output en round 1 de fix** salvo ejecución justificada: los Pass actuales están alineados a demos y theory.

---

## Counts summary for Fixer

| Tipo | Unidades | preamble missing | retrospective missing | title missing |
|------|----------|------------------|----------------------|---------------|
| iDo  | 8        | 8                | 8                    | N/A           |
| weDo | 24       | 24               | 24                   | 24            |
| youDo| 1        | N/A (has context)| 1                    | has title     |

**Código/tests:** no se proponen cambios de `starterCode` / `solutionCode` / `output` en ninguna unidad; solo prosa pedagógica y campos schema opcionales del spec.

Section 26 exercise pedagogy review complete. Ready for the Fixer prompt.
