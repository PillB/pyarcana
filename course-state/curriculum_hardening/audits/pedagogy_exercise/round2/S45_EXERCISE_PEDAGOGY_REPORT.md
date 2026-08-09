# S45 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Cloud, almacenamiento, colas e infraestructura
- **shortTitle:** Cloud y colas
- **id:** `iac`
- **index:** 45
- **source:** `src/lib/course/sections/s45-iac.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A object/relacional/cache · T1-B consistencia/RPO/RTO · T2-A at-least-once/ack · T2-B dedup/orden/DLQ · T3-A compute/lag/cuota · T3-B IAM/egress · T4-A plan IaC · T4-B costo PEN/recovery
- **hilo:** job asíncrono de reportes sintéticos **CASO-IQU-045** (Iquitos); consume artefacto de S44; gate **CP-N4-B** (reintentos no duplican; DLQ, IAM, backup y costo medidos); **stdlib only**, sin cuenta cloud ni egress real; montos en **PEN** sintéticos
- **Round 1 context:** `round1/S45_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Measured word counts only as gates (no bulk prose generation).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Verified integrity traps (starter stdout ≠ solution stdout) on representative units across all 8 subtemas.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 5–7 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets weDo a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo narrativos: T1-A/T1-B en rango (~80–86 w); T2-B…T4-A ~43–64 w (bajo piso 80) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — E1 ~25–41 w; E3 varias ~17–23 w (bajo piso 40; no bloquear en transfer) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (predicado → assess PASS/breach/MISSING → decide CONTINUE/breach/rama humana fail-closed); tokens de contención varían (REDESIGN / RUN_RESTORE_DRILL / NACK / INSPECT / REQUEST_CAPACITY / REQUEST_SCOPED_POLICY / REVIEW_DRIFT / COST_OWNER_REVIEW) | Pass — **no** clones numéricos de prosa |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~12–16** unidades el retro **eco** del feedback (misma frase de contención + “error clásico” sin metacognición extra); peores en E2/E3 de T2–T4 | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈13–30 w (spec 40–80); iDo T1-A ~51 w; resto iDo ~23–31 w; principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **Feedback length** | ~8–10 unidades &lt;25 w (piso spec); peores: T2-A-E3 (~18), T3-B-E3 (~18), T4-A-E3 (~19), T4-B-E1 (~20) | Residual **P2** |
| **iDo why** | 8/8 en rango ~51–74 w | Pass |
| **Código/outputs** | Coherentes con theory y CASO-IQU-045; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps verificados (predicados invertidos → PASS/breach opuestos) | **Sin** hueco de integridad |
| **youDo frame** | context CP-N4-B, starter con `process_once` incompleto, tres fixtures, rubric 6 criterios, portfolioNote, retrospective de defensa (~71 w) | Pass |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check, feedback &lt;25 w en varias unidades, iDo preambles/retros levemente cortas en T2–T4). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

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

### S45-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido de `write_job`: blob a object, status a relacional, cache espejo, `cache_authoritative=False`. Preamble (~86 w) pide predicción de las tres salidas y ancla reintento/gate CP-N4-B. `why` (~74 w) en rango con puente a We Do. Retro (~51 w) repara “cache más rápido = verdad” y cierra con hábito de ADR.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `S45-T1-A PASS` y límites anti-mutación de fixture. Instruction nombra DEFECT invertido; feedback razona reintento + TTL; retro distinta (patrón de acceso + puente E2). Starter `cache_authoritative or transactions=="cache"` → solution object+relacional (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~29 w → +self-check “¿qué relee el reintento si el TTL del cache expiró?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Independiente fuerte: tres fixtures (ADR limpio / cache verdad / sin TTL). Preamble ancla missing ≠ aceptar. Feedback (~24 w, piso) y retro (~30 w) se solapan en “missing vs breach de diseño” (eco leve).
- **Checklist:** all pass; feedback/retro partial (longitud + eco leve)
- **Severity residual:** P2
- **Proposed feedback (expand if touched):**  
  Primero schema (`MISSING:cache_ttl_s`): sin TTL no auditas el hot-path del dashboard. Luego contenido: object + relacional + cache no autoritativo → PASS; cache como verdad o transacciones en cache → REDESIGN_PERSISTENCE. Missing no es “aceptar con fe” ni un ataque inventado.
- **Proposed retrospective (replace):**  
  Incertidumbre de evidencia (falta TTL) y breach de diseño (cache como verdad) piden respuestas distintas: una rellena el ADR, la otra rediseña stores. El error clásico es marcar “sin TTL” como PASS porque el resto “se ve bien”. Pregunta: si el revisor de Iquitos solo ve un status en cache, ¿qué falla en el reintento? Luego (E3): CONTINUE / REDESIGN / WRITE_STORE_ADR.
- **Code/output changes:** none

### S45-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real a fail-closed. Instruction en rango (~41 w). Feedback y retro repiten WRITE_STORE_ADR / “no promote con campos faltantes” (eco moderado); retro ya trae self-check útil (“¿por qué REDESIGN ≠ WRITE_STORE_ADR?”).
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (tighten if touched):**  
  Un ADR incompleto es inspección humana (`WRITE_STORE_ADR`), no un allow optimista. El error clásico es promover con “faltan campos, igual pasa”. Pregunta: ¿por qué REDESIGN_PERSISTENCE no es lo mismo que WRITE_STORE_ADR, y cuál reutilizas en el youDo si el starter aún no declara `cache_authoritative`?
- **Code/output changes:** none

---

### S45-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Drill RPO/RTO claro: restore_tested True vs restore_breach False, consistencia read-after-write. Preamble (~80 w) en piso; `why` en rango. Retro (~31 w) corta: principio + error clásico + puente, sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Backup sin drill medido no es evidencia de recovery: RPO acota la **edad** del backup y RTO los **minutos** de restore. El error clásico es enseñar una captura “backup daily” sin números. Pregunta: si el restore real midiera 45 min con RTO 30, ¿qué token declararías antes de promover el status del job? We Do: desigualdades correctas, tres rutas y rama RUN_RESTORE_DRILL.
- **Code/output changes:** none

### S45-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Guiado limpio: starter invierte `>` en RPO/RTO. Title, bullets, feedback al revisor de recovery, retro con error clásico de invertir al “arreglar”. Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla PASS / DECLARE / MISSING:rto_minutes sólida. Preamble corto (~36 w) pero bullets completos. Retro (~21 w) muy corta; eco con “sin RTO no hay drill”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin `rto_minutes` no hay drill auditable: es incertidumbre de evidencia, no pérdida declarada. El error clásico es marcar MISSING como DECLARE_DATA_LOSS_RISK “por precaución”. Pregunta: ¿qué haría el auditor si el backup está fresco pero nadie midió el restore? Luego (E3): CONTINUE / DECLARE / RUN_RESTORE_DRILL.
- **Code/output changes:** none

### S45-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer limpio con self-check en retro (“¿restore real 45 min con RTO 30?”). Feedback (~21 w) bajo piso; instruction (~23 w) telegráfica pero clara en transfer.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Incertidumbre de drill → RUN_RESTORE_DRILL (ensaya minutos); breach de RPO/RTO o consistencia eventual → DECLARE_DATA_LOSS_RISK; solo restore dentro de SLO → CONTINUE. No hay promote silencioso de recovery: “backup daily” sin números no cierra el gate.
- **Code/output changes:** none

---

### S45-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Demo excelente de at-least-once: ACK / SKIP_DUP / ACK_AFTER_REDELIVERY_WINDOW, VT 30. Preamble (~74 w) ligeramente bajo piso pero pide predicción de cuatro salidas. Retro (~28 w) corta.
- **Checklist:** all pass; retro partial (longitud); preamble partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  At-least-once sin idempotency key es reimpresión del PDF del reporte. El error clásico es acker al leer el mensaje “para liberar la cola” y perder el efecto durable si el worker muere. Pregunta: si processing_s=45 y VT=30, ¿por qué igual se escribe el efecto y se marca redelivery window? We Do: política completa con backoff y key no vacía.
- **Code/output changes:** none

### S45-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT claro (PASS si falta ack post-efecto o key vacía). Feedback razona segundo PDF; retro con orden efecto→ack + puente E2. Usable sin polish obligatorio.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas PASS / NACK / MISSING:backoff. Preamble (~29 w) corto; feedback y retro (~23–24 w) eco fuerte (“sin backoff no afirmas / NACK por falta un campo”).
- **Checklist:** all pass; preamble/feedback/retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Ausencia de `backoff` es incertidumbre de política de reintentos, no un NACK automático. El error clásico es tratar “falta un campo” como breach de delivery. Pregunta: ¿qué riesgo operativo abres si asumes backoff=True sin verlo en el fixture? Luego (E3): CONTINUE / NACK / VERIFY_DELIVERY_SEMANTICS.
- **Code/output changes:** none

### S45-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer VERIFY limpio; retro con self-check sobre at-most-once del adverso (bueno). Feedback (~18 w) bajo piso y eco de “ruta humana”.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Dato faltante → VERIFY_DELIVERY_SEMANTICS (inspección humana de la política); contrato roto (ack temprano, key vacía, sin efecto durable) → NACK_AND_RETRY; solo delivery sano → CONTINUE. Verificar semántica no es fail silencioso ni “seguir con suerte” en reentrega.
- **Code/output changes:** none

---

### S45-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** new/dup/dlq con `dlq_len 1` y orden per_partition. Preamble (~64 w) bajo piso; why en rango; retro (~23 w) muy corta.
- **Checklist:** all pass; preamble/retro partial (longitud)
- **Severity residual:** P2
- **Proposed preamble (expand if touched):**  
  La deduplicación usa un store durable de claves; la DLQ recibe *poison* tras N intentos con evidencia. En esta demo del job de Iquitos, `m1` dos veces da `new` y luego `dup`; `poison` con attempts≥3 va a DLQ (`dlq_len 1`). El orden se declara por partición, no se inventa en el consumer. No escribas: predice las tres líneas y por qué `m1` no cuenta dos veces. Si “limpias” el poison sin terminal, el revisor del gate CP-N4-B no ve contención.
- **Proposed retrospective (expand):**  
  Poison sin estado terminal es reintento eterno. El error clásico es borrar el mensaje “para limpiar la cola” sin audit trail. Pregunta: ¿por qué `len(messages)==len(processed)` miente cuando hay dos `m1`? We Do: conjuntos + flag `terminal_in_dlq` auditado.
- **Code/output changes:** none

### S45-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT excelente (len vs set + sin terminal). Feedback y retro alineados pero retro añade “len==3 con dos m1” — usable. Instruction clara.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla sólida. Retro (~15 w) de las más cortas de la sección; eco con “inspección ≠ DEDUP”. Instruction (~20 w) telegráfica.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Falta de flag `terminal_in_dlq` es incertidumbre de contención, no prueba de que el poison se manejó mal. El error clásico es marcar MISSING como DEDUP_OR_DLQ “por si acaso”. Pregunta: ¿qué evidencia pedirías antes de replay controlado desde DLQ? Luego (E3): CONTINUE / DEDUP_OR_DLQ / INSPECT_MESSAGE_ORDER.
- **Code/output changes:** none

### S45-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer INSPECT limpio; retro con self-check de “bucle hasta que funcione”. Feedback (~21 w) eco parcial.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Ausencia de terminal → INSPECT_MESSAGE_ORDER; breach de dedup/DLQ (processed incompleto, sin orden, sin terminal) → DEDUP_OR_DLQ; solo new/dup/DLQ correctos → CONTINUE. Contención sin evidencia de terminal es riesgo operativo, no un reintento “hasta que funcione”.
- **Code/output changes:** none

---

### S45-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** scale_on cpu/lag y capacity_ok True en red privada. Preamble (~54 w) y retro (~27 w) bajo piso; why en rango con umbral de negocio.
- **Checklist:** all pass; preamble/retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Escala por señal de negocio del job (lag de cola sobre umbral), no por CPU ociosa. El error clásico es scale-out por CPU al 20% con cola a 500 mensajes. Pregunta: con backlog 80 y 4 workers (target 25), ¿por qué `capacity_ok` es True y qué rompe quitar backpressure? We Do: cuota + red privada + flag de contención.
- **Code/output changes:** none

### S45-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT de sobrecapacidad bien nombrado. Feedback y retro cubren cuota+target+red+backpressure. Discrimina.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~21 w +self-check de lag/worker)
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas con backlog 500 adverso. Retro (~16 w) muy corta; eco “pedir capacidad ≠ APPLY”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Pedir capacidad (MISSING de flag) no es lo mismo que aplicar backpressure (breach de carga o red pública). El error clásico es APPLY a ciegas cuando solo falta evidencia del control. Pregunta: si workers están en cuota pero `private_network=False`, ¿qué token debe ganar? Luego (E3): CONTINUE / APPLY / REQUEST_CAPACITY.
- **Code/output changes:** none

### S45-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer REQUEST_CAPACITY limpio; retro con self-check de red pública (bueno). Feedback (~20 w) bajo piso; instruction (~18 w) mínima.
- **Checklist:** all pass; feedback/instruction partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Capacidad incierta (falta backpressure) → REQUEST_CAPACITY; sobrecarga, lag alto o red pública → APPLY_BACKPRESSURE; carga dentro de SLO y red privada → CONTINUE. Solicitar capacidad es planificación humana; APPLY es contención inmediata antes de romper el status del job.
- **Code/output changes:** none

---

### S45-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** allowlist + prueba negativa admin/unknown.example. Preamble (~44 w) de los más cortos de iDo; retro (~26 w) corta pero principio correcto (“evidencia = denegación”).
- **Checklist:** all pass; preamble/retro partial
- **Severity residual:** P2
- **Proposed preamble (expand):**  
  Least privilege se demuestra con **allowlist de acciones y hosts** más prueba negativa — no con un print decorativo. En esta demo el worker de Iquitos puede `object:get` hacia `api.internal` en path privado; `iam:admin` y `unknown.example` se deniegan. No escribas: predice `ok`, `deny_admin` y `deny_egress`. Si solo ves `least_privilege=True` sin denegaciones, el revisor de seguridad del gate CP-N4-B no tiene evidencia.
- **Proposed retrospective (expand):**  
  La evidencia es la denegación, no el print de éxito. El error clásico es “abrimos admin para el demo”. Pregunta: ¿qué dos pruebas negativas llevarías al portfolio (acción y host)? We Do: policy con MISSING:egress_allow y REQUEST_SCOPED_POLICY.
- **Code/output changes:** none

### S45-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT invertido (PASS en denegación) excelente. Feedback ancla revisor de seguridad; retro con error de “invertir para el assert”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla PASS/DENY/MISSING. Retro (~13 w) de las más cortas de toda la sección.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Pedir policy scoped (falta `egress_allow`) no es denegar (breach de acción o host). El error clásico es DENY a ciegas cuando solo falta la allowlist. Pregunta: ¿qué pedirías al equipo de seguridad antes de promover el rol del worker? Luego (E3): CONTINUE / DENY / REQUEST_SCOPED_POLICY.
- **Code/output changes:** none

### S45-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer limpio; retro con self-check de portfolio CP-N4-B (bueno). Feedback (~18 w) bajo piso.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Política incompleta → REQUEST_SCOPED_POLICY; breach IAM/egress (admin, path público, host desconocido) → DENY_IAM_OR_EGRESS; solo allowlist + private → CONTINUE. Solicitar policy scoped es trabajo de seguridad, no un skip para “desbloquear el demo”.
- **Code/output changes:** none

---

### S45-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** staging_ok / secret_plan / drift_destroy claros. Preamble (~43 w) y retro (~25 w) cortos; why en rango.
- **Checklist:** all pass; preamble/retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Rechazar un plan malo es éxito de ingeniería, no fricción. El error clásico es apply ciego “porque el demo urge”. Pregunta: si declared={queue,bucket} y planned={bucket}, ¿qué recurso desaparece y por qué no basta “el plan corrió sin error de syntax”? We Do: drift medido y entorno válido (no `shared`).
- **Code/output changes:** none

### S45-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT PASS con secretos/destroys. Feedback y retro cubren paridad + entorno + cero destroys. Buen guided.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S45-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla con env `shared` adverso. Retro (~12 w) la más corta de la sección — solo puente, sin misconception elaborado.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Drift no medido (falta `destructive_changes`) es incertidumbre de revisión, no un REJECT automático ni un PASS. El error clásico es rechazar a ciegas o aplicar igual. Pregunta: ¿qué mirarías en el plan además del conteo de destroys (secretos, entorno inventado)? Luego (E3): CONTINUE / REJECT / REVIEW_DRIFT.
- **Code/output changes:** none

### S45-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer REVIEW_DRIFT limpio; retro con self-check de queue+bucket (bueno). Feedback (~19 w) bajo piso.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Drift no medido → REVIEW_DRIFT; plan inseguro (secretos, env `shared`, destroy inesperado) → REJECT_IAC_PLAN; solo paridad limpia en dev/staging/prod → CONTINUE. Revisar drift es trabajo humano **previo** al apply, no un warning post-mortem.
- **Code/output changes:** none

---

### S45-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** PEN, cost_ratio 0.82, recovery_ready/blocked. Preamble (~51 w) y retro (~31 w) bajo piso; why en rango con FREEZE.
- **Checklist:** all pass; preamble/retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Costo y recovery se demuestran con números y drills, no con promesas. El error clásico es “está bajo budget, listo” sin `portable_export` ni restore ensayado. Pregunta: si forecast=820 y budget=1000 pero restore_tested=False, ¿el job está listo para scale-out? We Do: FREEZE y COST_OWNER_REVIEW.
- **Code/output changes:** none

### S45-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT de sobrepresupuesto claro. Feedback (~20 w) y retro (~21 w) cortos; eco leve “invertir para el assert”.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Forecast > budget o cuota rota es FREEZE_SCALE_OUT en PEN sintéticos. Recovery incompleto (sin restore o sin export portable) también bloquea: un print “bajo presupuesto” no cierra T4-B ni el gate CP-N4-B.
- **Proposed retrospective (expand):**  
  FinOps del job = presupuesto + cuota + drill de recovery juntos. El error clásico es invertir desigualdades “para que el assert pase” sin leer forecast/budget. Pregunta: ¿qué congela scale-out primero, el monto o la falta de export? Siguiente: MISSING:portable_export.
- **Code/output changes:** none

### S45-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla PASS/FREEZE/MISSING con forecast 1500 adverso. Retro (~14 w) muy corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Revisión de dueño (falta export) no es freeze (breach de monto o cuota). El error clásico es FREEZE automático cuando solo falta evidencia de portabilidad. Pregunta: si forecast=820 pero no hay `portable_export`, ¿quién debe actuar y con qué token? Luego (E3): CONTINUE / FREEZE / COST_OWNER_REVIEW.
- **Code/output changes:** none

### S45-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cierra la sección hacia youDo. Retro (~34 w) con self-check de tres números ante CP-N4-B (mejor de los E3). Feedback en rango bajo pero usable. Transfer real.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback +1 frase de PEN sintéticos vs promesa)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo (proyecto) — **A**
- **Diagnosis:** Marco **sólido**: context Iquitos/CP-N4-B, objectives (cuatro), requirements (stores, cola/DLQ, IAM, PEN, tres rutas), starter con `process_once` incompleto y comentarios de efecto durable, fixtures normal/poison/missing, rubric 6 criterios, portfolioNote honesta sobre límites stdlib. **Retrospective** (~71 w) de defensa: invariante ack, cloud real vs modelo, frase de impacto medible. Round-1 P1 cerrado.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Campos pedagógicos presentes; outputs/DEFECT coherentes; sin wrong≈right.

### P1
- **Ninguno bloqueante.** La sección es usable end-to-end para un learner que ya pasó theory T1–T4.

### P2 (polish del Fixer R2 — priorizar por impacto)
1. **Retrospectives weDo E2/E3 cortas o en eco** (prioridad alta dentro de P2): especialmente T1-B-E2, T2-A-E2, T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-B-E2 (retros 12–21 w). Ampliar a ~40–60 w con principle + misconception *distinto* del feedback + transfer/self-check.
2. **Feedback &lt;25 w** en varios E3 y algunos E2: T2-A-E3, T2-B-E3, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E1/E2 — una frase de “por qué importa al revisor / reintento / portfolio”.
3. **iDo retrospectives T1-B…T4-B** (~23–31 w): expandir con self-check + puente We Do (T1-A ya en buen estado).
4. **iDo preambles cortos** T2-B, T3-A, T3-B, T4-A (~43–64 w): opcional +1 frase de escena Iquitos / gate; no reescribir demos enteras.
5. **Instruction E3 telegráficas** (~17–23 w): opcional un paso que recuerde “reutiliza predicado de E1/E2; no mutes fixtures” — solo si se toca la unidad.

### No tocar (salvo execute-and-diff justificado)
- Outputs canónicos (`S45-T*-* PASS`, triples PASS/…/MISSING, triples CONTINUE/…/rama).
- Lógica de DEFECT / fixtures CASO-IQU-045-*.
- Theory, selfCheck, resources, id `iac`.
- youDo starter/rubric (ya sólidos).

---

## Residual risks

1. **Esqueleto E1→E2→E3 repetido 8 veces:** el código fadea bien; si el Fixer solo “alarga” retros con la misma plantilla missing≠breach, el learner sentirá mecánico. Cada subtema debe conservar ancla distinta (stores ≠ VT/ack ≠ set/DLQ ≠ lag ≠ IAM ≠ plan ≠ PEN).
2. **Vocabulario Master:** visibility timeout, RPO/RTO, least privilege, DLQ ya viven en theory; polish no debe añadir jerga académica ni anglicismos nuevos.
3. **PEN decorativos:** T4-B ya nombra soles sintéticos; al expandir feedback, mantener comparación forecast/budget y FREEZE, no “imprimir currency”.
4. **Sin cuenta cloud:** fortaleza didáctica; el youDo retrospective ya nombra límites stdlib — no debilitar con promesas de vendor.
5. **Anti-aberration en Fix R2:** no bulk-replace “El error clásico es…” en 24 unidades; editar solo las unidades listadas con prosa distinta por subtema.
6. **Carga de 24 weDo:** polish P2 no debe inflar preambles de E3 a ensayos; preferir retro + feedback sobre reescribir instruction.

---

## Summary for Fixer

| Unidad | Estado R2 | Acción residual | Severidad |
|--------|-----------|-----------------|-----------|
| 8 × iDo | Campos OK; T1-A **A**; resto **B** por retro/preamble cortos | Expandir retro (y opcional preamble) T1-B…T4-B | P2 |
| 24 × weDo | Titles/preambles/instructions presentes; fade real | Expandir retros E2 cortas; feedback &lt;25 w en E3/E2 selectos; romper eco feedback/retro | P2 |
| 1 × youDo | **A** | none | — |
| Código/outputs | Integridad OK | none | — |

**Score distribution (approx.):** A ≈ 10 · B ≈ 23 · C/D = 0

**Verdict:** Section 45 exercise pedagogy is **learner-ready** after Round-1 field fill. Round-2 residual work is **P2 polish only** (length floors, anti-echo metacognition). No structural rewrite, no code/output changes.

Section 45 exercise pedagogy review complete. Ready for the Fixer prompt.
