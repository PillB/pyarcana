# S45 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Cloud, almacenamiento, colas e infraestructura
- **shortTitle:** Cloud y colas
- **id:** `iac`
- **index:** 45
- **source:** `src/lib/course/sections/s45-iac.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S45-T1-A object/relacional/cache · T1-B consistencia/RPO/RTO · T2-A at-least-once/ack · T2-B dedup/orden/DLQ · T3-A compute/lag/cuota · T3-B IAM/egress · T4-A plan IaC · T4-B costo PEN/recovery
- **hilo de caso:** job asíncrono de reportes sintéticos **CASO-IQU-045** (Iquitos); consume artefacto de S44; gate **CP-N4-B** (reintentos no duplican; DLQ, IAM, backup y costo medidos); **stdlib only**, sin cuenta cloud ni egress real; montos en **PEN** sintéticos

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~356–574), `weDo.steps[]` (24 ejercicios, ~576–1746) y `youDo` (~1749–1833) en `s45-iac.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-B.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota: el andamiaje de *código* (DEFECT nombrados, fixtures CASO-IQU-045-*, outputs canónicos, fade E1 predicado → E2 assess → E3 decide fail-closed) es maduro y alineado a theory; los campos `preamble` / `title` (weDo) / `retrospective` **no existen** en el source (0 matches de campos pedagógicos).

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S45 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; 1–2 frases densas; a menudo **bajo** el rango 40–90 palabras del spec |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + DEFECT + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera jobs cloud, **opaco** para newbie sin escena de Iquitos |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa al promote / al revisor de plataforma / al portfolio* |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos invertidos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-B; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama humana. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción de contención, fixtures sintéticos Iquitos, stdlib modelando contratos cloud) es maduro y alineado al control plane S44→S45. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al job de reportes de Iquitos, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama humana fail-closed). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del predicado”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en producción”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S45-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de `write_job`: blob al object store, status a relacional, cache solo espejo, `cache_authoritative=False`. La `description` nombra el ADR; falta `preamble` que diga *qué observar* (tres stores, reintento no lee TTL) y `retrospective` del misconception “el dashboard cacheado es la verdad del job”. El `why` es una frase densa.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de encolar un reintento del job de reportes en Iquitos (`CASO-IQU-045`), el ingeniero de plataforma debe **declarar dónde vive la verdad**. En esta demo un worker sintético escribe el artefacto `reports/iqu-1.json` al object store, el status `done` a relacional y una copia descartable al cache. No escribas aún: predice si el artefacto queda en object, qué imprime `status` y por qué `cache_authoritative` es `False`. Si confundes el TTL del cache con el registro autoritativo, el revisor del gate CP-N4-B verá un estado fantasma.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): object store guarda el blob por key; relacional guarda el status transaccional; el cache acelera lecturas del dashboard y **nunca** es fuente de verdad. Un reintento relee object+relacional. Puente a We Do: reparar predicado que aprueba cache autoritativo, tabla PASS/REDESIGN/MISSING y decisión CONTINUE/WRITE_STORE_ADR.
- **Proposed retrospective:**  
  Si puedes explicar por qué un status solo en cache miente al reintento sin mirar el código, ya tienes el hábito de ADR de persistencia. El error clásico es “el cache es más rápido, usémoslo de verdad”. En We Do practicarás el predicado object+relacional y el rechazo del ADR roto.
- **Code/output changes:** none
- **Validation notes:** Output `artifact_in_object True` / `status done` / `adr {… cache_authoritative: False}` alineado a theory T1-A.

---

### S45-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter da PASS si `cache_authoritative` o `transactions=="cache"`. Instruction densa mezcla ID, DEFECT y print; sin title, preamble ni retrospective. Feedback nombra el ADR pero no ancla “por qué el revisor de Iquitos rechaza el reintento”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ADR: object y relacional, no cache
- **Proposed preamble:**  
  - **Contexto:** en `CASO-IQU-045-1A` el job de reportes de Iquitos solo puede promoverse si el ADR de stores es correcto.  
  - **Meta:** corregir el predicado `meets_contract` (blob→object, transacciones→relacional, cache no autoritativo, TTL > 0).  
  - **Éxito:** imprimes exactamente `S45-T1-A PASS`.  
  - **Límites:** no mutes el fixture; no inventes stores; no toques el assert; el DEFECT está en el booleano, no en los datos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` da PASS con cache autoritativo (DEFECT invertido).  
  2. Exige `blob_store == "object"` y `transactions == "relational"`.  
  3. Añade `not cache_authoritative` y `cache_ttl_s > 0`.  
  4. Conserva el print `S45-T1-A` y el status PASS/REDESIGN_PERSISTENCE.
- **Proposed feedback improvement:**  
  Cache como verdad o transacciones en cache es `REDESIGN_PERSISTENCE`: el reintento del job relee un TTL que miente al revisor. Object + relacional con cache descartable es el único ADR que pasa T1-A.
- **Proposed retrospective:**  
  Fuente de verdad = medio durable según patrón de acceso. El error clásico es marcar `cache_authoritative=true` “porque el dashboard es más rápido”. Siguiente (E2): tres rutas válido / adverso / sin TTL.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S45-T1-A PASS` correctos.

---

### S45-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres fixtures (ADR válido, cache como verdad, sin `cache_ttl_s`). Starter invierte PASS/breach. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de stores (PASS / REDESIGN / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de persistencia en Iquitos no trata igual un ADR limpio, uno con cache como verdad y un registro incompleto.  
  - **Meta:** implementar `assess` que distinga PASS, REDESIGN_PERSISTENCE y MISSING:cache_ttl_s.  
  - **Éxito:** imprime `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s` en ese orden.  
  - **Límites:** si falta `cache_ttl_s`, no evalúes el ADR; no inventes el campo; missing ≠ “aceptar”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con datos completos aprueba cache autoritativo (bug).  
  2. Primero: claves required; si falta alguna → `MISSING:…`.  
  3. Luego: object + relacional + cache no autoritativo + TTL > 0 → PASS; si no → REDESIGN_PERSISTENCE.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de evidencia; cache como verdad es breach de diseño. El error clásico es tratar “sin TTL” como ataque o como PASS. Luego (E3) enrutas CONTINUE / REDESIGN / WRITE_STORE_ADR.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S45-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción. Starter trata missing como CONTINUE y usa predicado invertido — defecto de promote silencioso. Falta preamble de “fail-closed en producción” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide stores: CONTINUE o WRITE_STORE_ADR
- **Proposed preamble:**  
  - **Contexto:** el control plane del job decide si el ADR **sigue** o se detiene: no hay “seguir con warning”.  
  - **Meta:** `decide` → CONTINUE (ADR válido), REDESIGN_PERSISTENCE (cache autoritativo), WRITE_STORE_ADR (sin TTL).  
  - **Éxito:** `CONTINUE REDESIGN_PERSISTENCE WRITE_STORE_ADR`.  
  - **Límites:** no inventes `cache_ttl_s`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `cache_ttl_s` → `WRITE_STORE_ADR` (no CONTINUE).  
  2. Con registro completo, reutiliza el predicado object/relacional de E1/E2.  
  3. Solo el ADR limpio es CONTINUE; el de cache como verdad es REDESIGN_PERSISTENCE.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un ADR incompleto es inspección humana, no un allow optimista. El error clásico es promover con “faltan campos, igual pasa”. Pregunta: ¿por qué REDESIGN no es lo mismo que WRITE_STORE_ADR?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S45-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: drill de restore con RPO/RTO, consistencia read-after-write, backup daily, un caso que pasa y uno que falla. Falta preamble de “backup sin restore no cuenta” y retrospective del misconception “tengo backup diario, ya estoy cubierto”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un backup en el job de reportes de Iquitos solo es evidencia si el **restore medido** cabe en RPO y RTO. En esta demo el status del job se declara *read-after-write*; un drill con backup de 12 h (RPO 24) y restore de 25 min (RTO 30) pasa; uno de 24 h con restore de 90 min frente a RPO 6 / RTO 30 falla de forma explícita. No escribas: predice `restore_tested` y `restore_breach` antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: RPO limita la edad del backup; RTO limita los minutos del restore; consistencia se declara por operación (status vs. índice eventual). Puente a We Do: invertir desigualdades, assess con MISSING:rto_minutes y decide RUN_RESTORE_DRILL.
- **Proposed retrospective:**  
  Backup sin drill no es evidencia de recovery. El error clásico es mostrar una captura de consola sin minutos medidos. We Do: predicado RPO/RTO, tres rutas y rama de drill.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T1-B (`restore_tested True`, `restore_breach False`).

---

### S45-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte RPO/RTO (PASS si backup viejo o restore lento). Instruction densa; sin title/preamble/retrospective. Feedback correcto pero sin ancla al revisor de recovery.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Restore dentro de RPO y RTO
- **Proposed preamble:**  
  - **Contexto:** en `CASO-IQU-045-1B` el status relacional del job solo se promueve si el drill de restore cabe en los SLO.  
  - **Meta:** corregir el predicado (consistencia read-after-write, backup_age ≤ rpo, restore ≤ rto).  
  - **Éxito:** `S45-T1-B PASS`.  
  - **Límites:** no mutes el fixture; no inviertas las desigualdades a propósito; no toques el assert.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `>` en RPO/RTO (DEFECT).  
  2. Cámbialo a `backup_age_h <= rpo_h` y `restore_minutes <= rto_minutes`.  
  3. Exige `consistency == "read-after-write"`.  
  4. Conserva print PASS / DECLARE_DATA_LOSS_RISK.
- **Proposed feedback improvement:**  
  Backup sin restore medido o con restore fuera de RTO es `DECLARE_DATA_LOSS_RISK`, no un warning opcional. El revisor de Iquitos pide minutos y edad, no un checkbox “backup daily”.
- **Proposed retrospective:**  
  RPO y RTO son números de drill, no promesas de marketing. El error clásico es invertir las desigualdades al “arreglar” el starter. Siguiente: tres fixtures con y sin `rto_minutes`.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T1-B PASS` correcto.

---

### S45-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tabla válido/adverso/sin rto_minutes bien diseñada. Starter invierte PASS. Falta escena de schema-first y retrospective missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de restore (PASS / RIESGO / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el auditor de recovery no confunde un drill lento con un campo ausente.  
  - **Meta:** `assess` → PASS, DECLARE_DATA_LOSS_RISK, MISSING:rto_minutes.  
  - **Éxito:** `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.  
  - **Límites:** sin `rto_minutes` no compares RPO/RTO; no declares pérdida por un campo faltante.
- **Proposed instruction/description improvements:**  
  1. Schema primero: required keys; missing → `MISSING:…`.  
  2. Con datos: read-after-write + backup fresco + restore ≤ RTO → PASS.  
  3. Breach de edad/minutos o consistencia eventual → DECLARE_DATA_LOSS_RISK.  
  4. Imprime los tres en orden.
- **Proposed retrospective:**  
  Sin RTO no hay drill auditable. El error clásico es marcar MISSING como riesgo de pérdida. Luego decides CONTINUE / DECLARE / RUN_RESTORE_DRILL.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Decide con rama humana `RUN_RESTORE_DRILL`. Starter missing→CONTINUE. Transfer real; falta preamble fail-closed y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide recovery: drill o riesgo
- **Proposed preamble:**  
  - **Contexto:** en producción no “pasas con warning” un restore sin minutos.  
  - **Meta:** CONTINUE (OK), DECLARE_DATA_LOSS_RISK (breach), RUN_RESTORE_DRILL (sin rto).  
  - **Éxito:** `CONTINUE DECLARE_DATA_LOSS_RISK RUN_RESTORE_DRILL`.  
  - **Límites:** no inventes rto; no conviertas incertidumbre en éxito.
- **Proposed instruction/description improvements:**  
  1. Missing → `RUN_RESTORE_DRILL`.  
  2. Completo: reutiliza predicado de E1/E2.  
  3. Solo drill dentro de SLO es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Incertidumbre de drill ≠ pérdida declarada: una pide ensayo, la otra admite riesgo. Pregunta: ¿qué harías si el restore real midiera 45 min con RTO 30?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado.

---

### S45-T2-A-DEMO (iDo)
- **Diagnosis:** Demo excelente de at-least-once: efecto durable, SKIP_DUP en reentrega, visibility timeout 30 s. Falta preamble de “ack después del efecto” y retrospective del misconception “ack al recibir el mensaje es más seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En colas gestionadas la semántica realista es **at-least-once**: el mensaje puede reaparecer si el worker muere antes del ack (p. ej. tras un visibility timeout). En esta demo del job de Iquitos la key `job-iqu-1` deja un solo efecto; la segunda entrega es `SKIP_DUP`; un job lento (45 s > VT 30) aún escribe el efecto y devuelve `ACK_AFTER_REDELIVERY_WINDOW`. No escribas: predice las cuatro salidas y por qué `effects` solo tiene dos keys.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el efecto durable (status/artefacto) va **antes** del ack; la idempotency key evita segundo side-effect; el VT explica reentregas. Puente a We Do: predicado de política, assess NACK_AND_RETRY, decide VERIFY_DELIVERY_SEMANTICS.
- **Proposed retrospective:**  
  At-least-once sin key es reimpresión del PDF. El error clásico es acker al leer el mensaje. We Do: política completa con backoff y key no vacía.
- **Code/output changes:** none
- **Validation notes:** Output ACK / SKIP_DUP / ACK_AFTER_REDELIVERY_WINDOW alineado a T2-A.

---

### S45-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter da PASS si falta ack post-efecto o key vacía (invertido). Instruction densa; feedback bueno pero corto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** At-least-once con ack post-efecto
- **Proposed preamble:**  
  - **Contexto:** el worker de reportes (`CASO-IQU-045-2A`) solo puede acker si la política de entrega es sana.  
  - **Meta:** predicado delivery at-least-once + efecto durable + acked_after_effect + key no vacía + backoff.  
  - **Éxito:** `S45-T2-A PASS`.  
  - **Límites:** no mutes el fixture; no borres el assert; el DEFECT está en el booleano.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si `not acked_after_effect` o key vacía (DEFECT).  
  2. Invierte: exige los cinco campos de la política correcta.  
  3. Status PASS vs NACK_AND_RETRY.  
  4. Conserva el print.
- **Proposed feedback improvement:**  
  Ack antes del efecto o key vacía permite un segundo PDF en reentrega. NACK_AND_RETRY es la contención correcta, no un warning en logs.
- **Proposed retrospective:**  
  El orden es efecto → ack, no al revés. El error clásico es “ack primero para liberar la cola”. Siguiente: tabla PASS / NACK / MISSING:backoff.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T2-A PASS` correcto.

---

### S45-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres fixtures (política OK, ack prematuro/key vacía, sin backoff). Starter invertido. Falta preamble missing≠NACK.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de delivery (PASS / NACK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de colas distingue política rota de política incompleta.  
  - **Meta:** `assess` → PASS, NACK_AND_RETRY, MISSING:backoff.  
  - **Éxito:** `PASS NACK_AND_RETRY MISSING:backoff`.  
  - **Límites:** sin backoff no afirmes breach; no inventes el campo.
- **Proposed instruction/description improvements:**  
  1. Schema primero → MISSING.  
  2. Completo: predicado de E1 → PASS o NACK_AND_RETRY.  
  3. No trates ausencia de backoff como NACK.  
  4. Imprime los tres.
- **Proposed retrospective:**  
  Sin backoff no puedes afirmar la política de reintentos. El error clásico es NACK por “falta un campo”. Luego decides CONTINUE / NACK / VERIFY_DELIVERY_SEMANTICS.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Decide con VERIFY_DELIVERY_SEMANTICS. Starter missing→CONTINUE. Transfer real al consumer en producción.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide delivery: CONTINUE o VERIFY
- **Proposed preamble:**  
  - **Contexto:** ante reentrega, el consumer enruta o se detiene a inspeccionar — no “sigue con suerte”.  
  - **Meta:** CONTINUE / NACK_AND_RETRY / VERIFY_DELIVERY_SEMANTICS.  
  - **Éxito:** `CONTINUE NACK_AND_RETRY VERIFY_DELIVERY_SEMANTICS`.  
  - **Límites:** missing de backoff ≠ éxito; no inventes key.
- **Proposed instruction/description improvements:**  
  1. Missing → VERIFY_DELIVERY_SEMANTICS.  
  2. Completo: predicado sano → CONTINUE; roto → NACK_AND_RETRY.  
  3. Imprime en orden de fixtures.  
  4. No toques los datos del starter.
- **Proposed retrospective:**  
  Verificar semántica es una ruta humana, no un fail silencioso. Pregunta: ¿por qué at-most-once del fixture adverso no es “más seguro” aquí?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado a T2-A.

---

### S45-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara new/dup/dlq con evidencia en lista DLQ. Falta preamble de “poison terminal” y retrospective de “borrar el mensaje no es contención”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  La deduplicación usa un store durable de claves; la DLQ recibe *poison* tras N intentos con evidencia. En esta demo `m1` dos veces da new y luego dup; `poison` con attempts≥3 va a DLQ (`dlq_len 1`). El orden se declara por partición, no se inventa en el consumer. No escribas: predice las tres líneas y por qué `m1` no cuenta dos veces en processed.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: set de claves es dedup real; len(messages)==len(processed) miente con duplicados; DLQ terminal evita bucle infinito. Puente a We Do: predicado set(message_ids)==processed_ids, assess y decide INSPECT_MESSAGE_ORDER.
- **Proposed retrospective:**  
  Poison sin terminal es reintento eterno. El error clásico es borrar el mensaje “para limpiar la cola”. We Do: audited new/dup/DLQ.
- **Code/output changes:** none
- **Validation notes:** Output new/dup/dlq alineado a T2-B.

---

### S45-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter confunde len(processed)==len(messages) con dedup y aprueba sin terminal DLQ. Excelente defecto didáctico; falta andamiaje verbal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Dedup real y poison en DLQ
- **Proposed preamble:**  
  - **Contexto:** en `CASO-IQU-045-2B`, `m1,m1,m2` deben dejar processed={m1,m2} y poison con terminal en DLQ.  
  - **Meta:** predicado set(message_ids)==processed_ids, len==2, ordered_partition, terminal_in_dlq.  
  - **Éxito:** `S45-T2-B PASS`.  
  - **Límites:** no mutes ids; no “cuentes” m1 dos veces; no toques el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si len(processed)==len(messages) o no terminal (DEFECT).  
  2. Usa igualdad de conjuntos y exige terminal_in_dlq.  
  3. Exige ordered_partition.  
  4. Conserva print PASS/DEDUP_OR_DLQ.
- **Proposed feedback improvement:**  
  `m1` duplicado no son dos procesados: el set es la prueba de dedup. Sin `terminal_in_dlq` el poison no está contenido.
- **Proposed retrospective:**  
  Dedup se demuestra con conjuntos, no con longitudes de lista. El error clásico es len(processed)==3 con dos m1. Siguiente: tres rutas con MISSING:terminal_in_dlq.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T2-B PASS` correcto.

---

### S45-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tabla PASS/DEDUP_OR_DLQ/MISSING bien armada. Falta preamble de schema-first sobre flag de DLQ.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas dedup/DLQ (PASS / DEDUP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el auditor de mensajería no confunde “no hay flag de DLQ” con “poison mal manejado”.  
  - **Meta:** PASS, DEDUP_OR_DLQ, MISSING:terminal_in_dlq.  
  - **Éxito:** `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.  
  - **Límites:** sin terminal_in_dlq no evalúes dedup; missing ≠ breach.
- **Proposed instruction/description improvements:**  
  1. Schema primero.  
  2. Completo: set + orden + terminal → PASS.  
  3. Incompleto/sin orden/sin DLQ → DEDUP_OR_DLQ.  
  4. Imprime los tres.
- **Proposed retrospective:**  
  Inspeccionar orden/flag no es lo mismo que fallar dedup. Luego decides CONTINUE / DEDUP_OR_DLQ / INSPECT_MESSAGE_ORDER.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Decide con INSPECT_MESSAGE_ORDER. Starter missing→CONTINUE. Transfer al control de contención.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide contención: CONTINUE o INSPECT
- **Proposed preamble:**  
  - **Contexto:** el worker enruta poison y dups; si falta evidencia de terminal, **inspecciona** — no promueve.  
  - **Meta:** CONTINUE / DEDUP_OR_DLQ / INSPECT_MESSAGE_ORDER.  
  - **Éxito:** `CONTINUE DEDUP_OR_DLQ INSPECT_MESSAGE_ORDER`.  
  - **Límites:** no conviertas missing en CONTINUE; no inventes terminal_in_dlq.
- **Proposed instruction/description improvements:**  
  1. Missing del flag → INSPECT_MESSAGE_ORDER.  
  2. Completo: predicado de E1 → CONTINUE o DEDUP_OR_DLQ.  
  3. Imprime en orden.  
  4. Conserva fixtures.
- **Proposed retrospective:**  
  Contención sin evidencia de terminal es riesgo operativo. Pregunta: ¿por qué un bucle de reintentos “hasta que funcione” no es recovery?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado.

---

### S45-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de scale_signal (lag vs cpu por umbral) y capacity_ok con red privada. Falta preamble de “escala por backlog de negocio” y retrospective de “CPU ociosa no manda en un job de cola”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El autoscaling del worker de reportes debe anclarse a **lag de cola**, no a CPU ociosa. En esta demo lag 50 (umbral 100) observa `cpu`; lag 150 escala por `lag`. Con backlog 80 y 4 workers (target 25, cuota 6) la capacidad cabe en red privada. No escribas: predice las dos señales y `capacity_ok`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: umbral de backlog es el contrato; workers ≤ cuota y lag/worker ≤ target; sin backpressure el SLO se rompe antes del dashboard. Puente a We Do: predicado de capacidad, assess APPLY_BACKPRESSURE, decide REQUEST_CAPACITY.
- **Proposed retrospective:**  
  Escala por señal de negocio del job. El error clásico es scale-out por CPU al 20% con cola a 500. We Do: cuota + backpressure + red privada.
- **Code/output changes:** none
- **Validation notes:** Output scale_on cpu/lag y capacity_ok True alineado a T3-A.

---

### S45-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si workers>cuota o sin backpressure. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capacidad en cuota con backpressure
- **Proposed preamble:**  
  - **Contexto:** pico de reportes sintéticos en `CASO-IQU-045-3A`: el pool del worker debe caber en cuota y SLO.  
  - **Meta:** workers ≤ cuota, backlog/workers ≤ target, red privada, backpressure activo.  
  - **Éxito:** `S45-T3-A PASS`.  
  - **Límites:** no mutes números del fixture; no “subas cuota” en el código; corrige solo el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter aprueba sobrecapacidad (DEFECT).  
  2. Invierte a workers ≤ quota y lag por worker ≤ target.  
  3. Exige private_network y backpressure.  
  4. Conserva print PASS/APPLY_BACKPRESSURE.
- **Proposed feedback improvement:**  
  Workers sobre cuota o sin backpressure rompen el SLO de status antes de que el dashboard lo note. APPLY_BACKPRESSURE es contención, no un log opcional.
- **Proposed retrospective:**  
  Capacidad sana es cuota + target + red + backpressure juntos. El error clásico es solo mirar workers. Siguiente: tres rutas con MISSING:backpressure.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T3-A PASS` correcto.

---

### S45-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tabla válida/sobrecarga/sin flag backpressure. Starter invertido. Falta escena missing≠APPLY.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de capacidad (PASS / APPLY / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el operador de plataforma no confunde “falta el flag” con “ya estás saturado”.  
  - **Meta:** PASS, APPLY_BACKPRESSURE, MISSING:backpressure.  
  - **Éxito:** `PASS APPLY_BACKPRESSURE MISSING:backpressure`.  
  - **Límites:** sin backpressure no apliques contención a ciegas; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Schema primero → MISSING.  
  2. Completo: predicado de E1 → PASS o APPLY_BACKPRESSURE.  
  3. Imprime los tres.  
  4. Conserva fixtures (backlog 500 adverso).
- **Proposed retrospective:**  
  Pedir capacidad (missing) no es lo mismo que aplicar backpressure (breach). Luego decides CONTINUE / APPLY / REQUEST_CAPACITY.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Decide REQUEST_CAPACITY. Starter missing→CONTINUE. Transfer a enrutamiento de escala.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide escala: CONTINUE o REQUEST_CAPACITY
- **Proposed preamble:**  
  - **Contexto:** el control plane no escala a ciegas ni promueve con flag ausente.  
  - **Meta:** CONTINUE / APPLY_BACKPRESSURE / REQUEST_CAPACITY.  
  - **Éxito:** `CONTINUE APPLY_BACKPRESSURE REQUEST_CAPACITY`.  
  - **Límites:** missing ≠ CONTINUE; no inventes backpressure=true.
- **Proposed instruction/description improvements:**  
  1. Missing → REQUEST_CAPACITY.  
  2. Completo: predicado sano → CONTINUE; roto → APPLY_BACKPRESSURE.  
  3. Imprime en orden.  
  4. No toques datos.
- **Proposed retrospective:**  
  Solicitar capacidad es ruta humana de planificación; APPLY es contención inmediata. Pregunta: ¿por qué red pública en el adverso fuerza APPLY aunque hubiera “CPU libre”?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado.

---

### S45-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de allowlist + prueba negativa (admin, unknown.example). Falta preamble de least-privilege medible y retrospective de “print least_privilege=True no es evidencia”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Least privilege se demuestra con **allowlist de acciones y hosts** más prueba negativa. En esta demo el worker de Iquitos puede `object:get` hacia `api.internal` en path privado; `iam:admin` y `unknown.example` se deniegan. No escribas: predice `ok`, `deny_admin` y `deny_egress` antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: acción ∈ allowed, path privado, host ∈ egress; un booleano decorativo sin denegaciones no pasa T3-B. Puente a We Do: predicado, assess DENY, decide REQUEST_SCOPED_POLICY.
- **Proposed retrospective:**  
  La evidencia es la denegación, no el print de éxito. El error clásico es “abrimos admin para el demo”. We Do: policy negativa con MISSING:egress_allow.
- **Code/output changes:** none
- **Validation notes:** Output ok True / deny_* False alineado a T3-B.

---

### S45-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si acción no allowed o egress no listado (invertido). Excelente defecto; falta andamiaje verbal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Least privilege con egress allowlist
- **Proposed preamble:**  
  - **Contexto:** el rol del worker (`CASO-IQU-045-3B`) solo puede promoverse con prueba negativa.  
  - **Meta:** requested_action ∈ allowed, private_path, egress_host ∈ egress_allow.  
  - **Éxito:** `S45-T3-B PASS`.  
  - **Límites:** no amplíes allowed_actions; no inventes hosts; corrige el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS en denegación (DEFECT).  
  2. Invierte a membership + private_path.  
  3. Status PASS vs DENY_IAM_OR_EGRESS.  
  4. Conserva print.
- **Proposed feedback improvement:**  
  Admin abierto o host desconocido es DENY, no un atajo de laboratorio. La prueba negativa es lo que el revisor de seguridad lee.
- **Proposed retrospective:**  
  Allowlist cerrada + denegaciones explícitas. El error clásico es invertir el predicado “para que pase el assert”. Siguiente: tres rutas con MISSING:egress_allow.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T3-B PASS` correcto.

---

### S45-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tabla PASS/DENY/MISSING. Starter invertido. Falta escena missing≠DENY.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas IAM (PASS / DENY / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de seguridad no confunde política incompleta con breach de acción.  
  - **Meta:** PASS, DENY_IAM_OR_EGRESS, MISSING:egress_allow.  
  - **Éxito:** `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.  
  - **Límites:** sin egress_allow no deniegues a ciegas; no inventes la allowlist.
- **Proposed instruction/description improvements:**  
  1. Schema primero.  
  2. Completo: predicado de E1 → PASS o DENY.  
  3. Imprime los tres.  
  4. Conserva fixture admin/unknown.example.
- **Proposed retrospective:**  
  Pedir policy scoped (missing) no es denegar (breach). Luego decides CONTINUE / DENY / REQUEST_SCOPED_POLICY.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Decide REQUEST_SCOPED_POLICY. Starter missing→CONTINUE. Transfer a promote fail-closed.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide IAM: CONTINUE o REQUEST_SCOPED_POLICY
- **Proposed preamble:**  
  - **Contexto:** sin allowlist de egress el job no se promueve “con fe”.  
  - **Meta:** CONTINUE / DENY_IAM_OR_EGRESS / REQUEST_SCOPED_POLICY.  
  - **Éxito:** `CONTINUE DENY_IAM_OR_EGRESS REQUEST_SCOPED_POLICY`.  
  - **Límites:** missing ≠ CONTINUE; no inventes egress_allow.
- **Proposed instruction/description improvements:**  
  1. Missing → REQUEST_SCOPED_POLICY.  
  2. Completo: predicado sano → CONTINUE; roto → DENY.  
  3. Imprime en orden.  
  4. Conserva fixtures.
- **Proposed retrospective:**  
  Solicitar policy scoped es trabajo de seguridad, no un skip. Pregunta: ¿qué prueba negativa mostrarías en el portfolio de CP-N4-B?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado.

---

### S45-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de plan_ok: staging limpio vs secretos vs drift destroy. Falta preamble de “rechazar plan malo es el contrato” y retrospective de “aplicar y ver”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  IaC declara cola y bucket por entorno; el plan se **revisa** antes del apply. En esta demo staging con declared==planned y cero destroys pasa; un plan con secretos o destroy de la cola se rechaza. No escribas: predice `staging_ok`, `secret_plan` y `drift_destroy`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: paridad declared/planned, env ∈ {dev,staging,prod}, sin secretos, destroys==0. Puente a We Do: predicado, assess REJECT_IAC_PLAN, decide REVIEW_DRIFT.
- **Proposed retrospective:**  
  Rechazar un plan malo es éxito de ingeniería. El error clásico es apply ciego “porque el demo urge”. We Do: drift medido y entorno válido.
- **Code/output changes:** none
- **Validation notes:** Output staging_ok True / secret y drift False alineado a T4-A.

---

### S45-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si secretos o destroys>0. Excelente defecto; falta andamiaje verbal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Plan IaC limpio en staging
- **Proposed preamble:**  
  - **Contexto:** en `CASO-IQU-045-4A` la cola y el bucket de reportes solo aplican si el plan es limpio.  
  - **Meta:** declared==planned, env dev|staging|prod, sin secretos, destructive_changes==0.  
  - **Éxito:** `S45-T4-A PASS`.  
  - **Límites:** no mutes recursos; no “aceptes shared”; corrige el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con secretos o destroys (DEFECT).  
  2. Invierte y añade paridad de sets y entorno válido.  
  3. Status PASS vs REJECT_IAC_PLAN.  
  4. Conserva print.
- **Proposed feedback improvement:**  
  Secretos en el plan o destroy de la cola son REJECT_IAC_PLAN. Apply sin revisión no es evidencia de T4-A.
- **Proposed retrospective:**  
  Plan aceptable = paridad + entorno + sin secretos + cero destroys. El error clásico es solo mirar “no hay error de syntax”. Siguiente: MISSING:destructive_changes.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T4-A PASS` correcto.

---

### S45-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tabla PASS/REJECT/MISSING:destructive_changes. Starter invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de plan (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de IaC no confunde “no sé cuántos destroys” con “plan con secretos”.  
  - **Meta:** PASS, REJECT_IAC_PLAN, MISSING:destructive_changes.  
  - **Éxito:** `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.  
  - **Límites:** sin conteo de destroys no rechaces a ciegas; no inventes el campo.
- **Proposed instruction/description improvements:**  
  1. Schema primero.  
  2. Completo: predicado de E1 → PASS o REJECT.  
  3. Imprime los tres.  
  4. Conserva env `shared` adverso.
- **Proposed retrospective:**  
  Drift no medido es incertidumbre de revisión. Luego decides CONTINUE / REJECT / REVIEW_DRIFT.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Decide REVIEW_DRIFT. Starter missing→CONTINUE. Transfer a gate de apply.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide apply: CONTINUE o REVIEW_DRIFT
- **Proposed preamble:**  
  - **Contexto:** sin conteo de destroys no hay apply silencioso en el job de Iquitos.  
  - **Meta:** CONTINUE / REJECT_IAC_PLAN / REVIEW_DRIFT.  
  - **Éxito:** `CONTINUE REJECT_IAC_PLAN REVIEW_DRIFT`.  
  - **Límites:** missing ≠ CONTINUE; no inventes destructive_changes=0.
- **Proposed instruction/description improvements:**  
  1. Missing → REVIEW_DRIFT.  
  2. Completo: predicado limpio → CONTINUE; plan malo → REJECT.  
  3. Imprime en orden.  
  4. Conserva fixtures.
- **Proposed retrospective:**  
  Revisar drift es trabajo humano previo al apply. Pregunta: ¿qué destruiría un plan que deja solo `bucket` cuando se declaró `queue+bucket`?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado.

---

### S45-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de cost_ratio en PEN, under_budget, recovery_ready con restore+export. Falta preamble de “PEN sintéticos + drill” y retrospective de “forecast bajo no basta sin portability”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El presupuesto del job se mide en **PEN sintéticos** (soles) y recovery solo es listo si restore y export portable están ensayados. En esta demo forecast 820 / budget 1000 da ratio 0.82 y under_budget; recovery sin restore queda bloqueado. No escribas: predice ratio, under_budget y las dos líneas de recovery.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: forecast ≤ budget y cuota; restore_tested ∧ portable_export; FREEZE_SCALE_OUT cuando se rompe. Puente a We Do: predicado, assess FREEZE, decide COST_OWNER_REVIEW.
- **Proposed retrospective:**  
  Costo y recovery se demuestran con números y drills, no con promesas. El error clásico es “está bajo budget, listo” sin export. We Do: freeze y revisión de dueño de costo.
- **Code/output changes:** none
- **Validation notes:** Output currency PEN / cost_ratio 0.82 alineado a T4-B.

---

### S45-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si forecast>budget o cuota rota. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Presupuesto PEN y recovery listos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-IQU-045-4B` el responsable de costo congela scale-out si el forecast sintético rompe el presupuesto.  
  - **Meta:** forecast_pen ≤ budget_pen, cuota OK, restore_tested y portable_export.  
  - **Éxito:** `S45-T4-B PASS`.  
  - **Límites:** no mutes montos PEN; no inventes restore=true; corrige el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con sobrepresupuesto (DEFECT).  
  2. Invierte desigualdades y exige restore + export.  
  3. Status PASS vs FREEZE_SCALE_OUT.  
  4. Conserva print.
- **Proposed feedback improvement:**  
  Forecast > budget o cuota rota es FREEZE_SCALE_OUT. Recovery incompleto también bloquea: no basta un print “bajo presupuesto”.
- **Proposed retrospective:**  
  FinOps del job = presupuesto + cuota + drill de recovery. El error clásico es invertir “para que el assert pase”. Siguiente: MISSING:portable_export.
- **Code/output changes:** none
- **Validation notes:** Output `S45-T4-B PASS` correcto.

---

### S45-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tabla PASS/FREEZE/MISSING:portable_export. Starter invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de costo (PASS / FREEZE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el auditor de costo no confunde “falta export” con “ya rebasaste el budget”.  
  - **Meta:** PASS, FREEZE_SCALE_OUT, MISSING:portable_export.  
  - **Éxito:** `PASS FREEZE_SCALE_OUT MISSING:portable_export`.  
  - **Límites:** sin portable_export no congeles a ciegas; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Schema primero.  
  2. Completo: predicado de E1 → PASS o FREEZE.  
  3. Imprime los tres.  
  4. Conserva forecast 1500 adverso.
- **Proposed retrospective:**  
  Revisión de dueño (missing export) ≠ freeze (breach de monto). Luego decides CONTINUE / FREEZE / COST_OWNER_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S45-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Decide COST_OWNER_REVIEW. Starter missing→CONTINUE. Transfer a FinOps del job; cierra la sección hacia youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide FinOps: CONTINUE o COST_OWNER_REVIEW
- **Proposed preamble:**  
  - **Contexto:** sin export portable el scale-out no se “aprueba con fe” en el portfolio.  
  - **Meta:** CONTINUE / FREEZE_SCALE_OUT / COST_OWNER_REVIEW.  
  - **Éxito:** `CONTINUE FREEZE_SCALE_OUT COST_OWNER_REVIEW`.  
  - **Límites:** missing ≠ CONTINUE; no inventes portable_export=true.
- **Proposed instruction/description improvements:**  
  1. Missing → COST_OWNER_REVIEW.  
  2. Completo: predicado sano → CONTINUE; roto → FREEZE_SCALE_OUT.  
  3. Imprime en orden.  
  4. Conserva fixtures.
- **Proposed retrospective:**  
  Dueño de costo revisa evidencia de recovery; freeze detiene scale-out ya roto. Pregunta de cierre: ¿qué tres números (forecast, budget, restore min) defenderías en 30 s ante el revisor de CP-N4-B?
- **Code/output changes:** none
- **Validation notes:** Assert de solution alineado; puente natural al youDo.

---

### youDo (proyecto)
- **Diagnosis:** Marco de proyecto **sólido**: context, objectives, requirements, starter con `process_once` incompleto, gates de stores/IAM/budget, tres fixtures (normal/poison/missing), rubric y portfolioNote alineados a CP-N4-B. **Falta `retrospective`** de defensa metacognitiva post-build. Sin ella el learner cierra el lab sin consolidar invariantes (efecto antes de ack, missing≠breach, PEN medidos).
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context/objectives cubren escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Opcional (P2): en `portfolioNote` o requirements, una línea que recuerde “el esqueleto no es checklist de booleanos — el efecto durable debe vivir en los dicts” (ya está; mantener). No reescribir context.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras — ack solo tras object_store + job_status, y SKIP_DUP en la segunda entrega de `job-iqu-1`? (2) ¿qué harías distinto con cola/cloud real vs. este modelo stdlib (credenciales, egress, PII)? (3) En el README, una frase de impacto medible (p. ej. “reintento no reimprime PDF; poison a DLQ; forecast 820 ≤ budget 1000 PEN”) que puedas defender en 30 segundos ante el gate CP-N4-B.
- **Code/output changes:** none (starter y expected comments correctos)
- **Validation notes:** Starter fuerza NotImplementedError hasta efecto durable; tres rutas documentadas; sin retrospective hoy.

---

## Priority order

### P0 (bloquean andamiaje We Do para true newbie)
1. Añadir `title` + `preamble` + `retrospective` a los **24** weDo (E1/E2/E3 de T1-A … T4-B).
2. Separar `instruction` a pasos solo-tarea (40–100 palabras); mover escena/meta/éxito/límites al preamble.
3. Diferenciar prosa E1 (arregla predicado) / E2 (tres rutas, missing≠breach) / E3 (decide fail-closed) — el código ya fadea; la prosa debe seguirlo.

### P1 (I Do y You Do)
4. Añadir `preamble` + `retrospective` a las **8** demos iDo.
5. Ampliar `why` de iDo hacia 40–90 palabras donde quede en una sola frase.
6. Añadir `retrospective` al **youDo** (defensa CP-N4-B).

### P2 (pulido de feedback)
7. Enriquecer `feedback` weDo (25–60 palabras) con *por qué importa al revisor / reintento / portfolio*, sin spoilear la solución línea a línea.
8. Opcional: micro-ajustes de wording en instructions densas una vez existan preambles.

### No tocar en esta ronda de Fix (salvo justificación execute-and-diff)
- Outputs canónicos de solution (`S45-T*-* PASS`, triples PASS/…/MISSING, triples CONTINUE/…/rama).
- Lógica de DEFECT / fixtures CASO-IQU-045-*.
- Theory, selfCheck, resources, id de sección `iac`.

---

## Residual risks

1. **Carga cognitiva Master:** 24 weDo con el mismo esqueleto “predicado invertido → assess → decide” puede sentirse mecánico si la prosa no ancla cada subtema al hilo de Iquitos (stores ≠ colas ≠ IAM ≠ PEN). El Fixer debe variar la escena, no solo el token de breach.
2. **Vocabulario denso:** términos como visibility timeout, RPO/RTO, least privilege y DLQ ya están en theory; el preamble debe **usar** el diccionario de la sección sin inventar jerga nueva ni academicismo.
3. **You Do vs We Do:** el proyecto pide integrar stores + cola + IAM + budget; si solo se “arreglan booleanos” en weDo sin retrospectives de transferencia, el learner llega al starter sin el hábito “efecto antes de ack / missing≠CONTINUE”.
4. **PEN sintéticos:** riesgo de que el learner trate montos como decorativos; preambles de T4-B deben insistir en comparación forecast/budget y freeze, no en “imprimir PEN”.
5. **Sin cuenta cloud:** es fortaleza didáctica; el residual es que el portfolio no demuestre vendor real — el retrospective del youDo debe nombrar límites del laboratorio stdlib con honestidad.
6. **Anti-aberration en Fix:** el Fixer no debe generar preambles con plantilla de tokens; cada unidad de este ledger ya trae prosa propuesta lista para adaptar a campos del schema.

---

## Summary for Fixer

| Unidad | Campos a añadir/mejorar | Severidad |
|--------|-------------------------|-----------|
| 8 × iDo | preamble, retrospective; why ↑ | P1 |
| 24 × weDo | title, preamble, instruction slim, retrospective; feedback ↑ | P0 (+P2 feedback) |
| 1 × youDo | retrospective | P1 |
| Código/outputs | none por defecto | — |

Section 45 exercise pedagogy review complete. Ready for the Fixer prompt.
