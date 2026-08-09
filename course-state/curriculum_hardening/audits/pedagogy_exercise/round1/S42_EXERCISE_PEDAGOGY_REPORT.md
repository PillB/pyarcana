# S42 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Schemas, seguridad y privacidad de servicios
- **shortTitle:** Schemas y seguridad
- **id:** `graph-rag` (archivo `s42-graph-rag.ts`; el **contenido** es control plane fail-closed — schemas, authz, SSRF/path, secretos, minimización y purga — **no** “Graph RAG”)
- **index:** 42
- **source:** `src/lib/course/sections/s42-graph-rag.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S42-T1-A schema estricto · T1-B evolución/uniones · T2-A authn≠authz/RBAC · T2-B scopes/identidad de servicio · T3-A límites/SSRF/path · T3-B secretos/deps · T4-A minimización/retención · T4-B audit/purga/pseudonimización
- **hilo de caso:** mesa de soporte sintética **CASO-CUS-042** (Cusco) — misma petición HTTP de S41 endurecida con schema, resource binding, allowlist y redacción; gate **CP-N4-A** (no cross-tenant + redacción que no reaparece); **missing ≠ breach**

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~367–581), `weDo.steps[]` (24 ejercicios, ~586–2151) y `youDo` (~2154–2273) en `s42-graph-rag.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-A.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S42 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + Caso 042 + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera control plane, **opaco** para newbie sin escena de mesa de soporte |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa al promote / al revisor / al portfolio* |
| Starter `# Defecto didáctico` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-A |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-A; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/REJECT/MISSING → E3 CONTINUE/DENY|REJECT/rama humana. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción, fixtures sintéticos Cusco, stdlib progressive disclosure) es maduro y alineado al control plane de S41→S42→S43. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al ticket de Cusco, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama humana). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en producción”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `graph-rag` y el archivo se llama `s42-graph-rag.ts`, pero el título y el contenido son schemas/seguridad/privacidad. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

---

## Unit ledger

### S42-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de `validate_case` con required ⊆ keys ⊆ allowed y vocabulario de `status`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (válido vs. extra vs. status basura) y `retrospective` del misconception “si el JSON parsea, el schema pasó”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de authz o persistencia, el borde HTTP de la mesa de soporte de Cusco debe **rechazar forma incorrecta**. En esta demo un ticket sintético `CASO-CUS-042-1A` se valida con schema estricto (modelo de `extra=forbid`): solo `case_id` y `status` en `{open, closed}`. No escribas aún: predice `valid`, `extra` y `biz` antes de mirar la salida. Si confundes “JSON parseable” con “schema OK”, un `note` interno o un `status=maybe` entra al control plane.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `required.issubset` exige presencia; `set(payload).issubset(allowed)` modela `additionalProperties: false`; el vocabulario de `status` es invariante de negocio en el borde, no un “warning”. Orden: forma primero, authz después. Puente a We Do: reparar predicado incompleto, tabla PASS/REJECT/MISSING y decisión CONTINUE/REJECT/REVIEW.
- **Proposed retrospective:**  
  Si puedes explicar por qué un campo extra y un status basura fallan **antes** de mirar al actor, ya tienes el hábito de schema de borde. El error clásico es aceptar extras “por flexibilidad”. En We Do practicarás el predicado, las tres rutas y la rama humana cuando falta `status`.
- **Code/output changes:** none
- **Validation notes:** Output `valid True` / `extra False` / `biz False` alineado a theory T1-A.

---

### S42-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter solo exige `required.issubset` e ignora extras y vocabulario. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra `extra=forbid` pero no ancla “por qué el revisor de borde lo exige antes de authz”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Schema estricto con status de negocio
- **Proposed preamble:**  
  - **Contexto:** en `CASO-CUS-042-1A`, el ticket de Cusco solo puede entrar si la forma es estricta y el `status` es del vocabulario.  
  - **Meta:** completar el predicado `meets_contract` (required ⊆ keys ⊆ allowed + status en `{open, closed}`).  
  - **Éxito:** imprimes exactamente `S42-T1-A PASS` con el fixture válido.  
  - **Límites:** no inventes campos; no “aceptes extras por ahora”; no toques los datos del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract = required.issubset(payload)` (bug: incompleto).  
  2. Añade `set(payload).issubset(allowed)`.  
  3. Añade `payload.get("status") in {"open", "closed"}`.  
  4. Conserva el print `S42-T1-A` y el status PASS/REJECT_SCHEMA.
- **Proposed feedback improvement:**  
  `required ⊆ keys ⊆ allowed` modela `extra=forbid`: un `note` no declarado es REJECT_SCHEMA, no un warning. Un status inválido también es forma de negocio en el borde; no lo confundes con un fallo de authz.
- **Proposed retrospective:**  
  Schema estricto = forma + tipos/vocabulario antes de permiso. El error clásico es solo chequear claves required. Siguiente (E2): tres rutas válido / extra / missing.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S42-T1-A PASS` correctos.

---

### S42-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres payloads (válido, `note_interna`, sin `status`). Starter acepta cualquier dict con `case_id`+`status`. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de schema (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de borde en Cusco no trata igual un ticket limpio, uno con campo espía y uno incompleto.  
  - **Meta:** implementar `assess` que distinga PASS, REJECT_SCHEMA y MISSING:status.  
  - **Éxito:** imprime `PASS REJECT_SCHEMA MISSING:status` en ese orden.  
  - **Límites:** si falta `status`, no evalúes extras; no inventes el campo; missing ≠ “aceptar”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con `status` presente devuelve PASS si hay `case_id` (bug: ignora extras).  
  2. Primero: si no hay `status` → `MISSING:status`.  
  3. Luego: required ⊆ keys ⊆ allowed y status en vocabulario → PASS; si no → REJECT_SCHEMA.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de evidencia; extra es breach de forma. El error clásico es tratar “incompleto” como ataque o como PASS. Luego (E3) enrutas CONTINUE / REJECT / REVIEW humana.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S42-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de borde HTTP. Starter trata missing y extras como CONTINUE — defecto de promote silencioso. Falta preamble de “producción fail-closed” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide schema: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** el borde de la mesa de soporte decide si un ticket **sigue** o se detiene: no hay “seguir con warning”.  
  - **Meta:** `decide` → CONTINUE (limpio), REJECT_SCHEMA (extra), REVIEW_BUSINESS_INVARIANT (sin status).  
  - **Éxito:** `CONTINUE REJECT_SCHEMA REVIEW_BUSINESS_INVARIANT`.  
  - **Límites:** no inventes `status`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `status` → `REVIEW_BUSINESS_INVARIANT` (no CONTINUE).  
  2. Con payload completo, reutiliza el predicado estricto de E1/E2.  
  3. Solo el limpio es CONTINUE; el de `note_interna` es REJECT_SCHEMA.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un ticket incompleto es revisión humana, no un allow optimista. El error clásico es promover con “faltan datos, igual pasa”. Pregunta: ¿por qué REJECT no es lo mismo que REVIEW?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S42-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: lector v1 lee `amount` con `currency` opcional; `evolution_ok` exige additivo + tags exhaustivos. Falta preamble de “compatibilidad de lectores” y retrospective del misconception “añadir un campo siempre es seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Evolucionar un contrato no es “cambiar el JSON y ya”. En esta demo el lector v1 de montos sigue funcionando cuando aparece `currency` opcional; sin `amount` falla de verdad. Luego `evolution_ok` confirma cambio aditivo con unión de tags completa. No escribas: predice el monto, el error y `evol True`. Si renombras un campo obligatorio o dejas un tag `push` sin rama, rompes al worker de ayer.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: aditivo + old reader OK + tags == handled es el triple de evolución segura; un tag desconocido es bloqueo, no ignore silencioso. Puente a We Do: corregir `evolution_ok` invertido, assess VERSION/MISSING y decide MIGRATE_CONSUMERS.
- **Proposed retrospective:**  
  Evolución segura = aditiva y exhaustiva. El error clásico es rename silencioso o tag huérfano “para después”. We Do: predicado, tres rutas y rama de migración.
- **Code/output changes:** none
- **Validation notes:** Output `10` / `err amount` / `evol True` alineado a theory T1-B.

---

### S42-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el criterio (PASS con rename o tags incompletos). Instruction densa; sin title/preamble/retrospective. Feedback correcto pero breve.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evolución aditiva con unión exhaustiva
- **Proposed preamble:**  
  - **Contexto:** en `CASO-CUS-042-1B`, el canal de notificaciones de Cusco solo puede desplegar si el cambio es aditivo y cada tag tiene handler.  
  - **Meta:** implementar `evolution_ok` = add_optional ∧ old_ok ∧ tags == handled.  
  - **Éxito:** `S42-T1-B PASS` con el fixture aditivo email/phone.  
  - **Límites:** no apruebes `rename_required`; no ignores tags huérfanos.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve True ante rename o tags distintos (bug).  
  2. Cambia a: change es `add_optional`, old_ok es True y sets iguales.  
  3. Conserva print y status PASS/VERSION_SCHEMA.
- **Proposed retrospective:**  
  Aditivo + exhaustivo es el contrato de no romper lectores. El error clásico es “rename y listo”. Siguiente: PASS / VERSION_SCHEMA / MISSING:handled_tags.
- **Code/output changes:** none
- **Validation notes:** Solution canónica correcta.

---

### S42-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres registros (aditivo, rename+push, sin handled_tags). Starter invierte PASS. Falta anclar missing de handlers vs. rupture.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess evolución: PASS vs VERSION vs MISSING
- **Proposed preamble:**  
  - **Contexto:** el dueño de contrato en Cusco clasifica cada cambio: seguro, rupture o evidencia incompleta.  
  - **Meta:** `assess` → PASS / VERSION_SCHEMA / MISSING:handled_tags.  
  - **Éxito:** `PASS VERSION_SCHEMA MISSING:handled_tags`.  
  - **Límites:** no inventes handled_tags; no trates rename como PASS.
- **Proposed instruction/description improvements:**  
  1. Primero calcula missing de campos required del registro.  
  2. Si falta handled_tags → MISSING.  
  3. Si add_optional + old_reader + tags exhaustivos → PASS; si no → VERSION_SCHEMA.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  VERSION es rupture demostrada; MISSING es migración sin mapa. El error clásico es inventar handlers para forzar PASS. Luego (E3): CONTINUE / VERSION / MIGRATE_CONSUMERS.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de deploy. Starter: missing→CONTINUE y rename→CONTINUE — peligro real de promote. Falta preamble de canal de notificaciones y cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Deploy de schema: CONTINUE o MIGRATE
- **Proposed preamble:**  
  - **Contexto:** el canal de notificaciones de Cusco decide si puede **desplegar** un cambio de evento.  
  - **Meta:** `decide` → CONTINUE (aditivo OK), VERSION_SCHEMA (rename/tag huérfano), MIGRATE_CONSUMERS (sin handled_tags).  
  - **Éxito:** `CONTINUE VERSION_SCHEMA MIGRATE_CONSUMERS`.  
  - **Límites:** no inventes handlers; missing no es CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin handled_tags → MIGRATE_CONSUMERS.  
  2. Con datos: predicado de evolución segura → CONTINUE; si no → VERSION_SCHEMA.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  Migrar consumidores es la rama humana cuando no hay mapa de tags. El error clásico es “deploy igual y vemos”. Pregunta: ¿cuándo VERSION y cuándo MIGRATE?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T1-B.

---

### S42-T2-A-DEMO (iDo)
- **Diagnosis:** Demo canónica same_tenant / cross_tenant / admin_override. Falta preamble authn≠authz y retrospective del misconception “JWT válido = puedo leer cualquier caso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Estar autenticado no es estar autorizado. En esta demo el analista `u1` lee su caso, se le deniega el de `u2`, y solo un `admin` con scope `case:admin` cruza tenants de forma **explícita**. No escribas: predice las tres líneas. Si tratas el token como permiso global, rompes el gate no cross-tenant de CP-N4-A.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: resource binding `actor == owner` + scope; admin es override con scope propio, no atajo silencioso. Puente a We Do: can_read del camino analista, assess DENY/MISSING, decide VERIFY_RESOURCE_OWNER.
- **Proposed retrospective:**  
  Authn responde “quién eres”; authz responde “sobre este recurso”. El error clásico es confiar solo en la identidad. We Do: binding, tres rutas y rama humana sin roles.
- **Code/output changes:** none
- **Validation notes:** Output True / False / True alineado a theory T2-A.

---

### S42-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter `return actor != owner` (cross-tenant abierto). Excelente defecto. Falta escena de mesa de soporte y title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Resource binding en lectura de caso
- **Proposed preamble:**  
  - **Contexto:** en `CASO-CUS-042-2A`, el analista de Cusco solo lee **su** ticket con scope `case:read`.  
  - **Meta:** `can_read` = actor == owner y `case:read` ∈ scopes (camino analista, sin admin).  
  - **Éxito:** `S42-T2-A PASS` con user-a sobre su caso.  
  - **Límites:** no abras cross-tenant; no uses rol admin aquí.
- **Proposed instruction/description improvements:**  
  1. El starter permite actor ≠ owner (bug).  
  2. Devuelve True solo con binding y scope.  
  3. Conserva print PASS/DENY_CROSS_TENANT.
- **Proposed retrospective:**  
  Binding al dueño del caso es el núcleo de no cross-tenant. El error clásico es “está logueado, deja pasar”. Siguiente: PASS / DENY / MISSING:roles.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres filas same/cross/sin roles. Starter abre cross-tenant. Falta anclar missing de roles como incertidumbre, no como DENY.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess lectura: PASS, DENY o MISSING
- **Proposed preamble:**  
  - **Contexto:** la matriz de permisos de Cusco debe mostrar allow, deny y evidencia ausente.  
  - **Meta:** `assess` → PASS / DENY_CROSS_TENANT / MISSING:roles.  
  - **Éxito:** `PASS DENY_CROSS_TENANT MISSING:roles`.  
  - **Límites:** no inventes scopes vacíos como allow; missing ≠ breach de cross-tenant.
- **Proposed instruction/description improvements:**  
  1. Si falta `roles` → MISSING:roles.  
  2. Si autenticado + actor==owner + case:read → PASS; si no → DENY_CROSS_TENANT.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  DENY es binding fallido demostrado; MISSING es matriz incompleta. El error clásico es inventar roles para “arreglar” el promote. Luego: CONTINUE / DENY / VERIFY_RESOURCE_OWNER.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a enrutamiento de lecturas. Starter: missing y cross-tenant como CONTINUE — falla crítica de gate. Falta preamble de mesa de soporte en producción.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Enruta lectura: CONTINUE o VERIFY
- **Proposed preamble:**  
  - **Contexto:** la mesa de soporte enruta tres lecturas de ticket: propia, ajena e incompleta.  
  - **Meta:** CONTINUE (mismo tenant + scope), DENY_CROSS_TENANT (caso ajeno), VERIFY_RESOURCE_OWNER (sin roles).  
  - **Éxito:** `CONTINUE DENY_CROSS_TENANT VERIFY_RESOURCE_OWNER`.  
  - **Límites:** no conviertas missing en CONTINUE; no abras cross-tenant.
- **Proposed instruction/description improvements:**  
  1. Sin roles → VERIFY_RESOURCE_OWNER.  
  2. Con datos: binding + case:read → CONTINUE; si no → DENY.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  VERIFY es revisión humana del dueño del recurso cuando no hay matriz. El error clásico es “falta el claim, igual deja leer”. Pregunta: ¿por qué DENY no es VERIFY?
- **Code/output changes:** none
- **Validation notes:** Core del gate CP-N4-A no cross-tenant.

---

### S42-T2-B-DEMO (iDo)
- **Diagnosis:** Catálogo por service_id: worker corre jobs, no admin; shared-admin no recibe scopes. Falta preamble least privilege y retrospective “principal genérico ≠ servicio”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cada microservicio tiene **identidad propia** y scopes estrechos. En esta demo `svc-er-worker` solo tiene `jobs:run`; `jobs:admin` y el principal `shared-admin` quedan en deny-by-default. No escribas: predice las tres líneas. Si un “admin compartido” hereda scopes fantasma, fallas auditorías de least privilege.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: catálogo explícito; ausencia de entrada = lista vacía = deny; no hay scope `*`. Puente a We Do: allow de tres puertas, matriz DENY_SCOPE, REQUEST_NARROW_GRANT.
- **Proposed retrospective:**  
  Deny-by-default por catálogo evita privilegio implícito. El error clásico es confiar en un principal genérico. We Do: grant + svc- + ruta.
- **Code/output changes:** none
- **Validation notes:** Output True / False / False alineado a theory T2-B.

---

### S42-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter invertido (`needed not in granted or not route`) y sin `svc-`. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres puertas: scope, svc y ruta
- **Proposed preamble:**  
  - **Contexto:** el worker de reportes de Cusco solo entra con scope granted, identidad `svc-…` y ruta en catálogo.  
  - **Meta:** `allow` = needed ∈ granted ∧ service_id empieza por `svc-` ∧ route_declared.  
  - **Éxito:** `S42-T2-B PASS` con report:prepare / svc-reporter / ruta True.  
  - **Límites:** no apruebes shared-admin; no ignores la ruta.
- **Proposed instruction/description improvements:**  
  1. El starter invierte el predicado y no exige `svc-`.  
  2. Implementa las tres condiciones en conjunción.  
  3. Conserva print PASS/DENY_SCOPE.
- **Proposed retrospective:**  
  Las tres puertas son conjuntas: falla una y es DENY. El error clásico es “tiene un scope, basta”. Siguiente: matriz PASS / DENY / MISSING:route.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres filas (reporter OK, prod:write+shared-admin, sin route_declared). Starter allow invertido. Falta anclar missing de catálogo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Matriz de scopes con DENY y MISSING
- **Proposed preamble:**  
  - **Contexto:** la matriz de least privilege en Cusco debe mostrar al menos una denegación explícita y una fila incompleta.  
  - **Meta:** `assess` → PASS / DENY_SCOPE / MISSING:route_declared.  
  - **Éxito:** `PASS DENY_SCOPE MISSING:route_declared`.  
  - **Límites:** no inventes route_declared=True; shared-admin no es atajo.
- **Proposed instruction/description improvements:**  
  1. Primero missing de campos required.  
  2. Luego allow de tres puertas → PASS o DENY_SCOPE.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  DENY es privilege real (scope/identidad/ruta); MISSING es catálogo incompleto. El error clásico es inventar la ruta para PASS. Luego: CONTINUE / DENY / REQUEST_NARROW_GRANT.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto. Nota: el invalid del fixture tiene `route_declared: False` y shared-admin — falla por múltiples razones; el Fixer no debe “simplificar” el adverso si el output ya es DENY_SCOPE.

---

### S42-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de entrada a producción del worker. Starter missing→CONTINUE y allow invertido. Falta preamble de release de servicio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Worker a producción: CONTINUE o REQUEST
- **Proposed preamble:**  
  - **Contexto:** `svc-reporter` pide entrar a producción con grant estrecho; un principal genérico y un catálogo incompleto no se “arreglan” con allow.  
  - **Meta:** CONTINUE / DENY_SCOPE / REQUEST_NARROW_GRANT.  
  - **Éxito:** `CONTINUE DENY_SCOPE REQUEST_NARROW_GRANT`.  
  - **Límites:** no inventes catálogo; no uses shared-admin como override.
- **Proposed instruction/description improvements:**  
  1. Sin route_declared → REQUEST_NARROW_GRANT.  
  2. Con datos: tres puertas → CONTINUE o DENY_SCOPE.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  REQUEST es la rama humana de grant estrecho pendiente. El error clásico es “falta la ruta, igual desplegamos”. Pregunta: ¿por qué REQUEST no es DENY?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T2-B.

---

### S42-T3-A-DEMO (iDo)
- **Diagnosis:** Demo allowlist SSRF + path confinement con `..` y metadata cloud. Falta preamble de “URL del usuario ≠ socket” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Una URL o un path del usuario **nunca** se convierte directo en red o disco. En esta demo el host de docs de ejemplo está permitido; `169.254.169.254` (metadata cloud) se bloquea; un path con `..` lanza traversal; `a.txt` bajo `/safe/reports` pasa. No escribas: predice las cuatro salidas. Si solo miras el path y no el host, un SSRF clásico entra.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: host se extrae antes del fetch; confinement exige prefijo de root; no hay print de etiqueta fija — el rechazo se **calcula**. Puente a We Do: trusted de tres puertas, assess REJECT/MISSING:root, SECURITY_REVIEW.
- **Proposed retrospective:**  
  Allowlist + confinement cortan SSRF y traversal **antes** del uso. El error clásico es confiar en “https” o filtrar después del fetch. We Do: size + host + path conjuntos.
- **Code/output changes:** none
- **Validation notes:** Output True / False / path traversal / ok_path alineado a theory T3-A.

---

### S42-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba oversize o path `/etc` e ignora allowlist. Excelente multi-defecto. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Upload confiado: size, host y path
- **Proposed preamble:**  
  - **Contexto:** el adjunto de `CASO-CUS-042-3A` solo se guarda si cabe en bytes, el host está en allowlist y el path queda bajo root.  
  - **Meta:** `trusted` = size≤max ∧ host∈allowlist ∧ path.startswith(root+'/').  
  - **Éxito:** `S42-T3-A PASS` con el fixture confinado.  
  - **Límites:** no ignores la allowlist; no apruebes `/etc` “por excepción”.
- **Proposed instruction/description improvements:**  
  1. El starter invierte e ignora hosts (bug).  
  2. Implementa las tres condiciones en conjunción.  
  3. Conserva print PASS/REJECT_UNTRUSTED_INPUT.
- **Proposed retrospective:**  
  Tres puertas conjuntas: falla una y es REJECT. El error clásico es solo chequear path o solo size. Siguiente: PASS / REJECT / MISSING:root.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas confinado / adverso 169.254+/etc / sin root. Starter invertido. Falta anclar SSRF a metadata en escena de negocio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess input: PASS, REJECT o MISSING
- **Proposed preamble:**  
  - **Contexto:** el worker de adjuntos clasifica confinado, adverso real (oversize + metadata IP + `/etc/passwd`) y registro sin root.  
  - **Meta:** PASS / REJECT_UNTRUSTED_INPUT / MISSING:root.  
  - **Éxito:** `PASS REJECT_UNTRUSTED_INPUT MISSING:root`.  
  - **Límites:** no inventes root; el adverso debe fallar por contenido (host/path/bytes).
- **Proposed instruction/description improvements:**  
  1. Primero missing de `root`.  
  2. Luego trusted de tres puertas.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  `169.254.169.254` es SSRF a metadata cloud aunque el path “parezca” de archivo. MISSING:root es incertidumbre de confinamiento, no breach inventado. Luego: CONTINUE / REJECT / SECURITY_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de guardar archivo. Starter missing→CONTINUE y trusted invertido. Falta preamble de fail-closed en worker de adjuntos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Guarda adjunto: CONTINUE o SECURITY_REVIEW
- **Proposed preamble:**  
  - **Contexto:** el worker decide si **guarda** el archivo o abre revisión de seguridad.  
  - **Meta:** CONTINUE (confinado), REJECT_UNTRUSTED_INPUT (adverso), SECURITY_REVIEW (sin root).  
  - **Éxito:** `CONTINUE REJECT_UNTRUSTED_INPUT SECURITY_REVIEW`.  
  - **Límites:** no inventes root por defecto; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin root → SECURITY_REVIEW.  
  2. Con datos: tres puertas → CONTINUE o REJECT.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  SECURITY_REVIEW es humano cuando no hay raíz de confinamiento. El error clásico es asumir `/tmp` o `/data` “por default”. Pregunta: ¿por qué no inventar root?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T3-A.

---

### S42-T3-B-DEMO (iDo)
- **Diagnosis:** Demo risk_deps por edad + promote_ok sin secreto, con pin y 0 CVE. Falta preamble de secretos fuera del repo y retrospective “cero inventado ≠ scan limpio”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un promote limpio de secretos con deps sin pin sigue siendo inseguro. En esta demo se listan deps “viejas”, se aprueba un promote limpio y se bloquea el que tiene secreto en repo + sin pin + CVE. No escribas: predice `high`, `promote` y `block`. Si inventas `critical_cves=0` sin inventario, confundes missing con “cero riesgos”.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: secretos fuera de artefacto; pin + CVE==0 + (en We Do) rotación ensayada. Puente a We Do: promote de cinco flags, assess ROTATE/MISSING, ASSESS_DEPENDENCY_RISK.
- **Proposed retrospective:**  
  Promote fail-closed es conjunción de controles, no un check de “no hay key en el README”. We Do: cinco condiciones y rama ASSESS sin inventario.
- **Code/output changes:** none
- **Validation notes:** Output high ['old'] / promote True / block False alineado a theory T3-B. Nota: la demo no muestra `rotation_tested` ni `secret_in_log` que sí usa We Do — coherente como subset; el Fixer no debe forzar paridad de demo y E1 si el skill se nombra bien.

---

### S42-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si hay secreto o sin pin (invertido e incompleto: no mira rotación ni CVE). Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Promote limpio: secretos y deps
- **Proposed preamble:**  
  - **Contexto:** el pipeline de Cusco solo promociona sin secreto en repo/log, con rotación ensayada, deps fijadas y 0 CVE críticas.  
  - **Meta:** `promote_ok` con las cinco condiciones en conjunción.  
  - **Éxito:** `S42-T3-B PASS` con el fixture limpio.  
  - **Límites:** no ignores rotación ni CVE; un solo hallazgo bloquea.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve True si secret_in_repo o not pinned (bug).  
  2. Exige not secret_in_repo, not secret_in_log, rotation_tested, pinned, critical_cves==0.  
  3. Conserva print PASS/ROTATE_AND_BLOCK.
- **Proposed retrospective:**  
  Cinco controles, una conjunción. El error clásico es “no hay secreto en el log, listo”. Siguiente: PASS / ROTATE / MISSING:critical_cves.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas limpio / breach / sin critical_cves. Starter invertido. Falta anclar missing ≠ cero riesgos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess promote: PASS, ROTATE o MISSING
- **Proposed preamble:**  
  - **Contexto:** el release manager clasifica promote limpio, hallazgo demostrable e inventario incompleto.  
  - **Meta:** PASS / ROTATE_AND_BLOCK / MISSING:critical_cves.  
  - **Éxito:** `PASS ROTATE_AND_BLOCK MISSING:critical_cves`.  
  - **Límites:** no inventes critical_cves=0; missing no es “cero riesgos”.
- **Proposed instruction/description improvements:**  
  1. Si falta critical_cves → MISSING.  
  2. Si promote_ok de cinco flags → PASS; si no → ROTATE_AND_BLOCK.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  ROTATE es breach demostrable; MISSING es falta de scan. El error clásico es asumir cero CVE. Luego: CONTINUE / ROTATE / ASSESS_DEPENDENCY_RISK.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de CI hacia staging. Starter missing→CONTINUE y promote invertido. Falta preamble de release manager.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** CI a staging: CONTINUE o ASSESS
- **Proposed preamble:**  
  - **Contexto:** el pipeline de CI de la mesa de Cusco decide promote a staging: limpio, hallazgo o sin inventario CVE.  
  - **Meta:** CONTINUE / ROTATE_AND_BLOCK / ASSESS_DEPENDENCY_RISK.  
  - **Éxito:** `CONTINUE ROTATE_AND_BLOCK ASSESS_DEPENDENCY_RISK`.  
  - **Límites:** no inventes un cero de CVE; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin critical_cves → ASSESS_DEPENDENCY_RISK.  
  2. Con datos: promote limpio → CONTINUE; si no → ROTATE_AND_BLOCK.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  ASSESS es humano cuando no hay scan; no es soft-allow. El error clásico es “no hay número, asumimos limpio”. Pregunta: ¿qué evidencia pide ASSESS al equipo de deps?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T3-B.

---

### S42-T4-A-DEMO (iDo)
- **Diagnosis:** Demo minimiza log (drop email) + retention_ok purpose-bound. Falta preamble de “podría servir después no es purpose” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un tablero de estado no necesita email. En esta demo el registro crudo de Cusco se reduce a `case_id` y `region` para el log; `email_in_log` queda False; la retención de 30 días con purpose `status-report` pasa. No escribas: predice la vista y las dos banderas. Si arrastras PII “por si acaso”, complicas el borrado y el gate de redacción de CP-N4-A.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: allowlist de campos para el purpose; techo de retención finito; no reaparición del email en la vista de log. Puente a We Do: inventory_ok, assess MINIMIZE/MISSING:max, PRIVACY_OWNER_REVIEW.
- **Proposed retrospective:**  
  Minimización = purpose + campos + techo de días. El error clásico es recolectar full_name “para el tablero”. We Do: inventarios y dueño de privacidad.
- **Code/output changes:** none
- **Validation notes:** Output vista sin email / email_in_log False / retention_ok True alineado a theory T4-A.

---

### S42-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba over-collection o retención excesiva (invertido; no fija purpose). Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Inventario mínimo con techo de días
- **Proposed preamble:**  
  - **Contexto:** el tablero de estado de Cusco solo necesita `case_id` y `region` por 30 días con purpose `status-report`.  
  - **Meta:** `inventory_ok` = collected ⊆ needed ∧ purpose correcto ∧ days ≤ max.  
  - **Éxito:** `S42-T4-A PASS`.  
  - **Límites:** no apruebes full_name de más; no ignores el purpose.
- **Proposed instruction/description improvements:**  
  1. El starter invierte inclusion y techo (bug).  
  2. Exige collected <= needed, purpose == "status-report", days <= max_days.  
  3. Conserva print PASS/MINIMIZE_AND_EXPIRE.
- **Proposed retrospective:**  
  Tres condiciones de inventario, no “parecer pocos campos”. El error clásico es purpose `maybe-useful`. Siguiente: PASS / MINIMIZE / MISSING:max_retention_days.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres inventarios mínimo / over-collect / sin techo. Starter invertido. Falta anclar missing de política de retención.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess privacidad: PASS, MINIMIZE o MISSING
- **Proposed preamble:**  
  - **Contexto:** el dueño de privacidad clasifica inventario mínimo, over-collection con retención abusiva y techo no declarado.  
  - **Meta:** PASS / MINIMIZE_AND_EXPIRE / MISSING:max_retention_days.  
  - **Éxito:** `PASS MINIMIZE_AND_EXPIRE MISSING:max_retention_days`.  
  - **Límites:** no inventes 30 días cuando falta el techo.
- **Proposed instruction/description improvements:**  
  1. Si falta max_retention_days → MISSING.  
  2. Si inventory_ok → PASS; si no → MINIMIZE_AND_EXPIRE.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  MINIMIZE es over-collection o retención abusiva demostrable; MISSING:max es política incompleta. Luego: CONTINUE / MINIMIZE / PRIVACY_OWNER_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a publicación de dataset del tablero. Starter missing→CONTINUE e inventory invertido. Falta preamble de dueño de privacidad.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Publica dataset: CONTINUE o PRIVACY_OWNER
- **Proposed preamble:**  
  - **Contexto:** el tablero de estado pide **publicar** un dataset; sin techo de retención el dueño de privacidad revisa.  
  - **Meta:** CONTINUE / MINIMIZE_AND_EXPIRE / PRIVACY_OWNER_REVIEW.  
  - **Éxito:** `CONTINUE MINIMIZE_AND_EXPIRE PRIVACY_OWNER_REVIEW`.  
  - **Límites:** no asumas 30 días por defecto; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin max_retention_days → PRIVACY_OWNER_REVIEW.  
  2. Con datos: inventory_ok → CONTINUE; si no → MINIMIZE_AND_EXPIRE.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  PRIVACY_OWNER_REVIEW no es soft-allow del payload. El error clásico es “inventamos 30 y pasamos”. Pregunta: ¿quién firma el techo de retención?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T4-A.

---

### S42-T4-B-DEMO (iDo)
- **Diagnosis:** Demo excelente: soft-delete primario deja export derivado vivo; `must_purge_derived True`. Falta preamble de “soft-delete no basta” y retrospective de reaparición.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Borrar la fila primaria **no cierra** el ciclo de privacidad. En esta demo `C1` desaparece del store primario pero el export `snapshot.csv` sigue en derivados; `purge_complete` es False. No escribas: predice las tres banderas. Si confundes soft-delete con purga, un campo redactado reaparece en backup o CSV y rompes CP-N4-A.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: primary_gone ≠ purge; derivados (caché, búsqueda, export) deben borrarse; en We Do se suma audit sin PII y llave de reidentificación separada. Puente a purge_ok, assess PURGE/MISSING:key, VERIFY_DELETION_SCOPE.
- **Proposed retrospective:**  
  Purga completa = primario + derivados + audit limpio + llave separada. El error clásico es “DELETE FROM y listo”. We Do: predicado, tres rutas y VERIFY humana.
- **Code/output changes:** none
- **Validation notes:** Output primary_gone True / derived_still True / must_purge_derived True alineado a theory T4-B.

---

### S42-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba intersección audit∩PII o derivado vivo. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Purga completa sin PII en audit
- **Proposed preamble:**  
  - **Contexto:** al cerrar un ticket de Cusco, el audit no debe llevar email y deben borrarse primario y derivados con llave separada.  
  - **Meta:** `purge_ok` = audit.isdisjoint(pii) ∧ deleted ∧ derived_deleted ∧ key_separate.  
  - **Éxito:** `S42-T4-B PASS` con audit de tokens y purga completa.  
  - **Límites:** no apruebes email en audit; no ignores derivados.
- **Proposed instruction/description improvements:**  
  1. El starter aprueba si hay ∩ con PII o derivado vivo (bug).  
  2. Implementa isdisjoint + flags de borrado + key_separate.  
  3. Conserva print PASS/PURGE_DERIVATIVES.
- **Proposed retrospective:**  
  Soft-delete del primario no basta. El error clásico es dejar el export vivo. Siguiente: PASS / PURGE / MISSING:key_separate.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S42-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres cierres purga OK / email+derivado vivo / sin key_separate. Starter invertido. Falta anclar missing de diseño de llave.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess purga: PASS, PURGE o MISSING
- **Proposed preamble:**  
  - **Contexto:** el dueño de ciclo de vida clasifica purga limpia, reaparición (email en audit + export vivo) y alcance de llave no declarado.  
  - **Meta:** PASS / PURGE_DERIVATIVES / MISSING:key_separate.  
  - **Éxito:** `PASS PURGE_DERIVATIVES MISSING:key_separate`.  
  - **Límites:** no asumas key_separate=True por defecto.
- **Proposed instruction/description improvements:**  
  1. Si falta key_separate → MISSING.  
  2. Si purge_ok → PASS; si no → PURGE_DERIVATIVES.  
  3. Imprime la tripleta.
- **Proposed retrospective:**  
  PURGE es reaparición o derivado vivo; MISSING:key es diseño de reidentificación no confirmado. Luego: CONTINUE / PURGE / VERIFY_DELETION_SCOPE.
- **Code/output changes:** none
- **Validation notes:** Output exacto correcto.

---

### S42-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a cierre de ticket en producción. Starter missing→CONTINUE y purge invertido. Falta preamble de no-reaparición CP-N4-A.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cierre de ticket: CONTINUE o VERIFY_DELETION
- **Proposed preamble:**  
  - **Contexto:** al cerrar el ticket de Cusco hay que purgar fila, snapshot y export; sin flag de llave separada el alcance queda en revisión humana.  
  - **Meta:** CONTINUE / PURGE_DERIVATIVES / VERIFY_DELETION_SCOPE.  
  - **Éxito:** `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE`.  
  - **Límites:** no soft-delete silencioso; no inventes key_separate.
- **Proposed instruction/description improvements:**  
  1. Sin key_separate → VERIFY_DELETION_SCOPE.  
  2. Con datos: ciclo completo → CONTINUE; si no → PURGE_DERIVATIVES.  
  3. Imprime los tres códigos.
- **Proposed retrospective:**  
  VERIFY_DELETION_SCOPE es humano cuando el alcance de reidentificación no está confirmado. El error clásico es “borré la fila, el gate ya pasó”. Pregunta: ¿dónde reaparece un email si solo haces soft-delete?
- **Code/output changes:** none
- **Validation notes:** Cierra el hilo de redacción de CP-N4-A; alineado a callout T4-B.

---

### youDo (proyecto)
- **Diagnosis:** Marco de proyecto **maduro**: context con CP-N4-A, objectives claros, requirements accionables (schema, DENY_CROSS_TENANT, SSRF, path, redacción, purga, threat model), starter calculado (no flips manuales), portfolioNote y rubric. Falta **solo** `retrospective` de defensa/reflexión post-build. El learner cierra el proyecto sin auto-check de “qué evidencia defiendo en 30 segundos”.
- **Checklist:** context pass · goal pass · success pass (rubric + asserts) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene `title`)
- **Proposed preamble:** N/A (context ya cumple rol de escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements. Opcional P2: en portfolioNote, una línea que recuerde documentar missing≠breach en el threat model residual.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué print o assert demuestra **no** lectura cross-tenant y **no** reaparición del email en la vista? (2) ¿dónde está tu evidencia de REJECT_SCHEMA y de host `169.254…` / path `..`? (3) En el README, una frase de impacto medible (antes/después del control plane) que puedas defender en 30 segundos. Si falta amenaza residual o rollback, no es READY aunque el status imprima READY.
- **Code/output changes:** none (starter y asserts del youDo son canónicos; no tocar salidas)
- **Validation notes:** Starter encadena schema → host → path → authz y calcula READY; alineado al mapa de la theory intro. Excelente base para el Fixer: solo añadir `retrospective`.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si cabe)
1. **S42-T1-A-E1, E2, E3** — schema estricto → assess → decide borde  
2. **S42-T2-A-E1, E2, E3** — resource binding (núcleo CP-N4-A no cross-tenant)  
3. **S42-T3-A-E1, E2, E3** — SSRF/path (abuso de entrada)  
4. **S42-T4-B-E1, E2, E3** — purga / no-reaparición (núcleo CP-N4-A redacción)  
5. **S42-T2-B-E1, E2, E3** — scopes / least privilege  
6. **S42-T1-B-E1, E2, E3** — evolución de contrato  
7. **S42-T3-B-E1, E2, E3** — secretos / deps  
8. **S42-T4-A-E1, E2, E3** — minimización / retención  

(Orden de prioridad de *impacto de gate*; el Fixer puede ir por subtema T1→T4 si prefiere consistencia de archivo.)

### P1
- **Todas las 8 iDo demos:** añadir `preamble` + `retrospective`; ampliar `why` a 40–90 palabras.  
- **youDo:** añadir `retrospective` de defensa post-build.

### P2
- Enriquecer `feedback` We Do (25–60 palabras) anclando revisor / promote / portfolio cuando ya existan preamble e instruction limpia.  
- Opcional: una línea en `portfolioNote` del youDo sobre riesgo residual y missing≠breach.

---

## Residual risks
- **Id de archivo vs. contenido:** `graph-rag` / `s42-graph-rag.ts` puede confundir a revisores humanos y a búsquedas; no es gap de ejercicio, pero el orchestrator debería renombrar en otra campaña.  
- **Repetición estructural E1/E2/E3:** el patrón predicado → assess → decide es intencional y pedagógico; el riesgo es que el Fixer copie la misma prosa cambiando solo el código de acción. Cada subtema necesita escena distinta (ticket, notificaciones, lectura, worker, adjunto, CI, tablero, cierre).  
- **Hints casi-solución en E1:** aceptable en guided; en Round 2 verificar que E3 no spoilee más que el principle.  
- **Adverso multi-falla (p. ej. T2-B-E2 invalid):** `prod:write` + `shared-admin` + `route_declared: False` falla por varias razones a la vez; está bien si el learner entiende “cualquiera basta para DENY”; no hace falta descomponer el fixture.  
- **True newbie + sección Master:** el código es denso (sets, predicados, códigos de acción). Sin preamble, la curva es brusca; con preamble el andamiaje de código ya es de alta calidad.  
- **No se editó código fuente en esta ronda** — solo este informe.

---

## Counts summary for Fixer

| Tipo | Unidades | Falta title | Falta preamble | Falta retrospective | Código a tocar |
|------|----------|-------------|----------------|---------------------|----------------|
| iDo  | 8        | N/A         | 8              | 8                   | none (solo why ampliable) |
| weDo | 24       | 24          | 24             | 24                  | none (outputs canónicos) |
| youDo| 1        | present     | N/A (context)  | 1                   | none |

**Total P0 units:** 24 We Do  
**Total P1 units:** 8 iDo + 1 youDo  
**Anti-aberration:** informe escrito a mano, unidad por unidad; sin generadores.

Section 42 exercise pedagogy review complete. Ready for the Fixer prompt.
