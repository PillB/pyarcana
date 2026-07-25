# S26 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Orquestación y VP RPA + AI Analyst
- **shortTitle:** VP RPA + AI Analyst
- **id:** `integrator-phase1`
- **index:** 26
- **source:** `src/lib/course/sections/s26-integrator-phase1.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A DAG/estados/path · T1-B límites/metadata/schedules · T2-A checkpoint/retry/DLQ · T2-B idempotencia/rollback/locks · T3-A colas HITL triple · T3-B approve/reject/edit/audit · T4-A SLO/alertas/runbook · T4-B E2E/seguridad/costo/regresión N2
- **hilo:** cierre **CP-N2-C** del VP **RPA + AI Analyst** (ops sintético Lima/San Isidro): path canónico `ingest → validate → analyze → ai_assist → report → approve → draft_email`; evidencia por estado; HITL triple; `fraud_labels=0`; regresión N2 + CF-2; cero envíos reales
- **Round 1 context:** `round1/S26_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Verified integrity traps (starter stdout ≠ solution stdout) for representative units: T1-A-E1 (salta validate vs path 4), T1-A-E2 (`2` vs `2 [...]`), T1-A-E3 (`success` vs `failed`), T1-B-E2 (`ok` vs `too_high`), T2-B-E3 (`enter` vs `busy`), T3-A-E2 (`False`/`all` vs `True`/`any`), T4-A-E1 (`ok` vs `alert_success_rate`), T4-B-E2 (`fail` vs `ok`).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE, alineados al skill | Pass (piso 4 en T1-B-E3 y T4-A-E1) |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo narrativos ~51–67 w |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~21–39 w (bajo piso 40; legibles; no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (path parcial → zip edges → estado global; snapshot → preflight 60 → cron Lima; backoff → DLQ owner → ckpt pendientes; create-once → superseded → lock busy; count pending → any blocked → checklist claves; approve audit → reject invalid → edit versionado; alert_success_rate → P0 unapproved → disable/drain/page; E2E 7+approve → fraud+approved → defense_package) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~7–9** unidades el retro **eco** del feedback (misconception duplicado, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | Mediana weDo ≈22–33 w (spec 40–80); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **iDo why** | 7/8 en rango ~44–68 w; **T2-B-DEMO why ~39 w** (leve bajo 40) | Residual **P2** leve |
| **iDo preamble/retro** | Completos; retros iDo ~30–42 w (varias bajo 40); preambles narrativos 51–67 w | Residual **P2** leve (expandir solo si se toca la unidad) |
| **Código/outputs** | Coherentes con theory y hilo sintético; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad tipo wrong≈right |
| **youDo frame** | context CP-N2-C, objectives, requirements éticos, starter ejecutable (`advance`/`can_draft`/`run_all`/`package_e2e`), rubric 6+bonus, portfolioNote, retrospective de defensa (~84 w) | Pass |
| **Hints E1** | Varios casi spoilean la fórmula (T1-A-E1, T2-A-E1); aceptable en guided | Residual **P2** opcional (no ampliar spoiling en E3) |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check, feedback &lt;25 w en ~6 unidades, iDo why/retro levemente cortos). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad leve) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S26-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: deriva path de 7 steps desde `edges` (incluye `ai_assist` y `approve` antes de `draft_email`). Preamble pide predicción y ancla contrato de negocio. `why` (~68 w) en rango: edges vs hardcode, handoff S25, gate HITL, puente We Do. Retro repara “inventar el orden / ahorrar validate” y apunta a tramo parcial + estado del flow.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S26-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Modelo We Do post-fix: title claro; bullets con éxito exacto del path parcial; instruction nombra DEFECT (salta validate); feedback razona DAG de negocio + evidencia en dashboard; retro distinta (leer dependencias vs hardcode + puente E2). Starter `['ingest','analyze','report']` → solution con `validate` (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~31 w → +self-check “¿qué se rompe si alguien inserta `draft_email` en esta vista parcial?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S26-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** `zip` de nodos lineales e imprimir `len` **y** edges — defecto excelente. Preamble ancla evidencia de dependencias. Feedback y retro se solapan en “pares ≠ solo conteo” (eco).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Modelar el grafo es dejar *pares* auditables, no un contador suelto: el dashboard del run y un revisor de CF-2 deben ver qué depende de qué. Si confundes “hay 2 aristas” con “el contrato de orquestación está modelado”, el audit del path queda incompleto. Pregunta: ¿qué arista faltaría si mañana insertas `ai_assist` entre analyze y report? Luego (E3) agregas el estado global del flow.
- **Proposed feedback (expand if touched):**  
  Imprimir solo `len` pierde la evidencia de qué dependencias modelaste. El audit del grafo necesita los pares consecutivos, no solo el número de edges.
- **Code/output changes:** none

### S26-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real: `any(failed)` vs hardcode `success`. Éxito exacto; límites anti-contar `skipped`. Feedback y retro casi idénticos (“un solo failed tumba… casi todo OK”) — eco fuerte.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El estado global del flow es un contrato de dashboard: un nodo crítico en `failed` debe tumbar el agregado aunque el resto diga success. El error clásico es promediar “casi todo OK” o tratar `skipped` como fallo de negocio. Pregunta: si `b` estuviera `skipped` y `a` en success, ¿qué imprimirías aquí y por qué? Ese hábito te sirve al reanudar un run con nodos omitidos a propósito.
- **Code/output changes:** none

### S26-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Metadata `run_id`/`api_rpm`/`tz` + preflight; preamble motiva schedule San Isidro; `why` en rango; retro repara “subir el rpm y ver qué pasa”. Retro ~34 w (leve bajo 40); preamble ~61 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Metadata + límites son el contrato del schedule, no adornos del dict. El error clásico es “subir el rpm y ver qué pasa” o reescribir `run_id` a mitad del batch. Pregunta: ¿qué uniría logs y cola HITL si la foto del start no fuera inmutable? We Do: snapshot de dos claves, preflight 60 y cron con tz Lima.
- **Code/output changes:** none

### S26-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Snapshot `run_id`+`api_rpm` vs dict entero; éxito tupla; feedback razona join/ops; retro de inmutabilidad + puente E2 (distinta del feedback). Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Umbral 100 vs 60 — excelente. Feedback y retro repiten “fail-closed / mejor bloquear que tumbar export” (eco).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El umbral didáctico 60 es política de capacidad del export compartido, no un número “generoso por comodidad”. Confundir holgura con seguridad es un bug de ops: el preflight debe bloquear `enable` del schedule antes de que el burst tumbe el endpoint. Pregunta: si midieras rpm real en un cierre de mes, ¿bajarías el umbral o subirías capacidad con revisión humana? Luego (E3) armarás el cron con zona Lima.
- **Code/output changes:** none

### S26-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer operativo: `tz` UTC → America/Lima + ready/blocked. Feedback y retro casi copian “UTC desplaza el batch… servidor ya está en UTC”. Self-check de disable→drain presente en retro (bueno) pero eco del feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El horario del batch es un contrato de negocio en America/Lima, no un default del host. El error clásico es dejar UTC “porque el servidor ya lo usa” y descubrir el desfase en el primer lunes operativo. Pregunta: ¿qué harías antes de un deploy que cambia el schema del informe? (disable schedule → drain workers → luego cutover). Ese orden evita mezclar versiones a mitad del batch.
- **Code/output changes:** none

### S26-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Reanudación + DLQ con owner tras 3 intentos; preamble pide predecir `resume_from` y que flaky no cae en el primer intento; `why` en rango. Retro ~34 w, sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Reanudar sin duplicar y escalar a humano con owner es el núcleo de resiliencia del VP. El error clásico es reprocess-all o una DLQ silenciosa sin razón ni dueño. Pregunta: ¿por qué un schema inválido de negocio no debe seguir el mismo camino de retry que un timeout de export? We Do: backoff, mensaje de DLQ y lista de pendientes.
- **Code/output changes:** none

### S26-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Backoff exponencial vs lineal; Pass `400`; feedback ~19 w (bajo piso 25) con aritmética útil; retro corta (~25 w) pero puente E2 claro.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Con attempt=3, `2**(3-1)=4` y `100*4=400`. El backoff lineal (`base*attempt`) martilla el export sintético ante 429/timeout; el exponencial da el respiro creciente que el lab modela sin cap ni jitter.
- **Proposed retrospective (expand):**  
  Exponencial da aire al servicio compartido; lineal confunde “número de intento” con multiplicador seguro. El error clásico es copiar un sleep fijo o un `base*attempt` “porque se ve simple”. Pregunta: ¿dónde pondrías un `cap` en prod sin perder el crecimiento inicial? Siguiente (E2): materializar la DLQ con owner.
- **Code/output changes:** none

### S26-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** DLQ con dict completo; feedback y retro solapan “sin owner/attempts no defendible / basurero”.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La DLQ es una cola de trabajo con dueño y SLA, no un basurero: reason + attempts permiten al runbook decidir reintento, fix de adapter o abandono controlado. El error clásico es DLQ prematura (primer fallo) o append sin `owner`. Pregunta: ¿quién reabre el ítem si `ops_rpa` no mira la cola en 24 h? Luego (E3) filtras pendientes del checkpoint.
- **Code/output changes:** none

### S26-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Filtro de pendientes vs reprocess-all; feedback y retro alineados pero retro añade self-check de persistencia — metacognición útil. Transfer limpio.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: alinear retro al piso 40 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S26-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** create-once + compensación superseded; preamble de predicción clara. `why` ~39 w (leve bajo 40); retro ~30 w sin self-check. Contenido correcto, densidad baja.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand ~+15 w):**  
  Create-once evita drafts duplicados bajo reentrega del mensaje; la compensación no es ACID mágica sino un grafo explícito (draft fuera, report `superseded` para defensa del historial). Idempotencia y compensación parcial protegen el rastro del VP cuando falla un step tardío. En We Do: `put` condicional, pop+superseded y lock fail-closed entre workers.
- **Proposed retrospective (expand):**  
  Idempotencia y compensación parcial protegen el historial del VP sin “wipe” del informe. El error clásico es sobrescribir en cada put o borrar el report como si fuera rollback de base de datos. Pregunta: ¿qué evidencia perderías en el capstone si hicieras `del` del report? We Do: create-once, rollback parcial y busy cuando locked.
- **Code/output changes:** none

### S26-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** create-once vs always-write; Pass `v1`. Feedback ~16 w y retro ~22 w (ambos cortos); poco metacognitivo.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Sobrescribir en cada put duplica o corrompe drafts bajo reentrega de cola. Create-once deja la primera materialización estable: el segundo mensaje con la misma clave de negocio no pisa `v1`.
- **Proposed retrospective (expand):**  
  Create-once es el hábito de idempotencia del lab: la clave de negocio gana al “último write”. El error clásico es un upsert silencioso “para no fallar”. Pregunta: ¿cuándo sí querrías un write versionado en lugar de create-once? Siguiente (E2): compensación cuando falla el draft.
- **Code/output changes:** none

### S26-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Compensación parcial bien defectada. Feedback ~15 w y retro ~21 w; eco “superseded vs wipe”.
- **Checklist:** all pass; feedback/retro partial
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Borrar el report pierde la evidencia del run; `superseded` es la compensación correcta para defensa del capstone. El draft se saca con `pop`; el informe se marca, no se elimina del historial.
- **Proposed retrospective (replace):**  
  Compensar no es “dejar el state como si nada hubiera pasado”: es un grafo de side-effects (draft fuera, report superseded). El error clásico es `del` del report o dejar el draft huérfano. Pregunta: ¿qué dirías en un postmortem si el dashboard ya no muestra el informe fallido? Luego (E3) el lock de concurrencia.
- **Code/output changes:** none

### S26-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Lock invertido en starter — transfer excelente. Feedback y retro distintos (dos workers / busy+id / TTL self-check). Fade real.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** Triple gate con `any`; preamble de predicción blocked/all_clear; `why` en rango. Retro ~32 w, sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Triple gate es el control anti “correo con narrativa alucinada”: basta un pending para bloquear `draft_email`. El error clásico es exigir las tres colas llenas (`all`) o ignorar un solo pending. Pregunta: ¿por qué un score de matching no puede “saltar” analysis a cero pendientes? We Do: conteo, `any` y lista de colas pendientes.
- **Code/output changes:** none

### S26-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Contar `pending` vs `done`; Pass `1`; feedback y retro distintos (liberar gate vs status que bloquea + puente E2).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** `all` vs `any` — excelente. Feedback y retro comparten “confundir all con any / fail-closed”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Fail-closed de correo: un solo pending debe bastar para bloquear el borrador, aunque report y recipient estén en cero. Confundir `all` con `any` es un bug silencioso de cumplimiento (parece “estricto” pero libera el gate con colas a medias). Pregunta: con analysis=0, report=2, recipient=0, ¿qué booleano esperas y por qué? Luego (E3) listas las claves aún pending.
- **Code/output changes:** none

### S26-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Checklist derivado del status vs labels fijos metrics/narrative; self-check en retro; transfer auténtico. Feedback y retro comparten “se lee del estado” pero retro añade self-check útil.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Reject invalid + approve append-only; preamble “no envía correo”; `why` en rango. Retro ~32 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Decisiones humanas dejan rastro append-only o no existen para defensa en CP-N2-C. El error clásico es reject “sin justificación” o reescribir el log como si fuera el último estado de un dict. Pregunta: ¿qué no podrías demostrar en el capstone si el approve no incrementara `events`? We Do: approve con len, gate de reason y edit 1→2.
- **Code/output changes:** none

### S26-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Append approve e imprimir `(action, len)` vs solo actor; feedback razona decisión+len; retro de hábito append-only + puente E2 (distinta).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: alargar retro al piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S26-T3-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Reject sin reason → invalid; feedback ancla API; retro fail-closed + puente E3. Sin eco fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Edit 1→2 con audit; Pass `(2, 1, 'edit')`. Feedback y retro casi idénticos (“versionado sin audit / mismo ver”).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un edit de narrativa debe subir versión **y** dejar evento con `from`/`to`: el revisor ve el salto, no solo el texto final. El error clásico es mutar el cuerpo “en el mismo ver” o append sin actor sintético. Pregunta: ¿por qué `from`/`to` ayudan más al audit que un contador suelto de ediciones? Ese rastro es lo que defiende el cierre CP-N2-C.
- **Code/output changes:** none

### S26-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** Nombres canónicos de alerta; preamble de contrato de runbook; `why` en rango. Retro ~31 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Nombres de alerta estables unen lab, prosa y runbook: si el dashboard inventa un alias, la página on-call se confunde. El error clásico es “alert genérico” o tratar unapproved send como ok en sandbox. Pregunta: ¿por qué un rate sano no cancela un P0 de envío sin approve? We Do: umbral, P0 y secuencia de contención.
- **Code/output changes:** none

### S26-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Doble bug (comparación invertida + alias `alert`); Pass `alert_success_rate`; feedback y retro distintos (playbook vs string como contrato). Title en piso 4 palabras.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Lógica invertida P0 unapproved; feedback y retro eco “incidente de control / sandbox da igual”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cero envíos sin approve es control de cumplimiento del VP, no un warning de latencia: un solo `n>0` ya es P0 aunque el rate de success esté impecable. El error clásico es “era sandbox, da igual” o invertir el booleano “para ver el camino feliz”. Pregunta: ¿qué evidencia pedirías en el audit si la alerta P0 se dispara a las 06:10 Lima? Luego (E3) el runbook de contención.
- **Code/output changes:** none

### S26-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Runbook `disable → drain → page` con severity; feedback y retro comparten “contención antes de página”. Self-check de schema en retro (bueno) pero eco del feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El on-call necesita severidad explícita **y** el orden de contención: primero paras el cron (`disable_schedule`), drenas workers, luego paginas. Page-first sin drenar deja jobs a medias y mezcla versiones de informe. Pregunta: ¿qué riesgos hay si cambias el schema del report sin `disable_schedule`? Ese playbook es el mismo que documentarás en el runbook del cierre.
- **Code/output changes:** none

### S26-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Mini-runner E2E camino feliz + `fail_at=analyze`; preamble pide comparar salidas y `n2_regression=pass` vs `planned`; `why` en rango; retro del misconception “todo success hardcodeado / planned”. Output alineado a theory.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Gate E2E path corto/`any` vs 7 steps + approve; Pass `True`; feedback y retro distintos (gate draft_email vs falso positivo de cierre). DEFECT excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S26-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Gate `fraud_labels==0 and approved`; starter invierte e ignora approved. Feedback ~16 w (corto); retro más completa y distinta.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  `fraud_labels=0` sin approve no cierra el E2E: ambas condiciones son obligatorias e independientes. Matching/score nunca justifican labels automáticos ni “ok” si el humano no firmó.
- **Code/output changes:** none

### S26-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** `defense_package` omite value — transfer de cierre auténtico. Pass del dict completo; feedback y retro distintos (demo incompleta vs tres claves + self-check de n2_regression fallido). Fade real hacia youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context del path canónico, objectives, requirements (sintético, cero envíos, fraud_labels=0, es-PE), starter ejecutable con huecos documentados (fail_at, HITL, DLQ, notas N2/CF-2), portfolioNote y rúbrica con bonus de regresión. `retrospective` de defensa presente y alineada a spec §8.3 (invariante / sintético vs real / frase de impacto + check de fraud_labels).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
Ninguno. Campos presentes; outputs y DEFECT coherentes; no wrong≈right.

### P1
Ninguno obligatorio. La sección es usable para true newbie en el hilo CP-N2-C.

### P2 (polish — orden sugerido)
1. **Eco feedback/retro (reemplazar retrospective; tocar feedback solo si hace falta):**  
   T1-A-E2, T1-A-E3, T1-B-E2, T1-B-E3, T2-A-E2, T3-A-E2, T3-B-E3, T4-A-E2, T4-A-E3  
2. **Feedback/retro cortos (&lt;25 w feedback o retro muy flaca):**  
   T2-A-E1, T2-B-E1, T2-B-E2, T4-B-E2  
3. **iDo why/retro levemente bajo piso (si se toca el subtema):**  
   T2-B-DEMO (why+retro), T1-B / T2-A / T3-A / T3-B / T4-A demos (retro +self-check)  
4. **Opcional:** no endurecer hints E1 spoiling; no bajar spoiling en E3; no reescribir titles (ya en rango)

---

## Residual risks

- **Gold-tone complacency:** S26 es referencia de tono en el spec; Round 2 confirma código **y** prosa verbal en su lugar. El Fixer R2 no debe reabrir campos ya correctos ni reescribir DEFECT/outputs.
- **Eco feedback/retro:** el residual más visible; arreglar retrospective (y feedback solo donde &lt;25 w) sin duplicar el essay del preamble.
- **Longitud vs bullets:** preambles en 4 bullets a menudo &lt;80 w — **aceptable** por spec; no forzar prosa narrativa en weDo si el checklist está completo.
- **Instruction &lt;40 w:** pasos claros y ordenados; no inflar con contexto ya en preamble.
- **You Do scope:** la retrospective no debe pedir un segundo pipeline; el starter ya es mini-orquestador — no tocar código del youDo en R2 salvo bug de integridad (no hallado).
- **Sin cambios de output** en R2 salvo ejecución justificada: Pass actuales alineados a demos y theory.

---

## Counts summary for Fixer R2

| Tipo | Unidades | preamble | retrospective | title | Residual típico |
|------|----------|----------|---------------|-------|-----------------|
| iDo  | 8        | 8 present| 8 present     | N/A   | P2 longitud/self-check |
| weDo | 24       | 24 present| 24 present   | 24 present | P2 eco + feedback corto |
| youDo| 1        | N/A (context)| present  | has title | none |

**Código/tests:** no se proponen cambios de `starterCode` / `solutionCode` / `output` en ninguna unidad; solo prosa pedagógica residual (P2).

**Integrity traps (muestra):** wrong≠right en T1-A-E1/E2/E3, T1-B-E2, T2-B-E3, T3-A-E2, T4-A-E1, T4-B-E2.

Section 26 exercise pedagogy review complete. Ready for the Fixer prompt.
