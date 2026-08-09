# S42 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Schemas, seguridad y privacidad de servicios
- **shortTitle:** Schemas y seguridad
- **id:** `graph-rag` (archivo `s42-graph-rag.ts`; el **contenido** es control plane fail-closed — schemas, authz, SSRF/path, secretos, minimización y purga — **no** “Graph RAG”)
- **index:** 42
- **source:** `src/lib/course/sections/s42-graph-rag.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A schema estricto · T1-B evolución/uniones · T2-A authn≠authz/RBAC · T2-B scopes/identidad de servicio · T3-A límites/SSRF/path · T3-B secretos/deps · T4-A minimización/retención · T4-B audit/purga/pseudonimización
- **hilo:** mesa de soporte sintética **CASO-CUS-042** (Cusco) — misma petición HTTP de S41 endurecida; gate **CP-N4-A** (no cross-tenant + redacción que no reaparece); **missing ≠ breach**
- **Round 1 context:** `round1/S42_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# Defecto didáctico`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (p. ej. T1-B-E1 con `add_optional` + tags iguales devuelve False; T2-B-E1 con grant+ruta True devuelve False; T4-A-E1 con sets iguales devuelve False). Correcto: el learner ve DENY/REJECT/VERSION y debe reparar el predicado.
  2. **E2/E3 reutilizan el mismo bug de predicado** (allow/trusted/promote_ok/inventory_ok/purge_ok invertidos) y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *prosa* y de *decisión* es real.
  3. **Adverso multi-falla (T2-B-E2/E3 invalid):** `prod:write` + `shared-admin` + `route_declared: False` — cualquiera basta para DENY; no descomponer el fixture.
  4. **Demo T3-B vs We Do:** la demo omite `rotation_tested` / `secret_in_log`; We Do exige cinco flags. Subset didáctico coherente, no desalineación de output.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–10 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈40–65 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈55–85 w) | Pass en estructura; weDo cortos pero legibles |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect del starter; E2/E3 con menos migas de “por qué” | Pass; E3 a veces 3 pasos densos de regla (aceptable transfer) |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/REJECT/MISSING → decide CONTINUE/breach/rama humana. Escenas diferenciadas por subtema (ticket, notificaciones, lectura, worker, adjunto, CI, tablero, cierre) | Pass — no tres clones de prosa; residual **código** repetido (mismo allow invertido en E1–E3) es patrón de sección, no bug de R2 |
| **Feedback vs retrospective** | Feedback razona principio + impacto al revisor/promote; en **~18/24** weDo el retro **repite** el feedback (mismo principio, poco self-check en E1/E2) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈25–40 w (spec 40–80); E3 suelen tener pregunta self-check (mejor); E1 a menudo solo “principio + error clásico + siguiente”. iDo demos ~35–50 w | Residual **P2** (pocos **P1** de metacognición fina) |
| **iDo why** | Todos en o cerca del rango 40–90; anclan orden del control plane y puente a We Do | Pass |
| **Código/outputs** | Coherentes con theory y CP-N4-A; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context con CP-N4-A, objectives, requirements, rubric, portfolioNote (incluye missing≠breach), starter calculado, retrospective de defensa (~75 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Id archivo vs contenido** | `graph-rag` / `s42-graph-rag.ts` vs título real | No es gap de ejercicio; otra campaña |

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

### S42-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de `validate_case` con predicción pedida (`valid` / `extra` / `biz`). Preamble ancla “JSON parseable ≠ schema OK” y orden forma-antes-authz. `why` en rango (required ⊆, subset allowed, vocabulario de status, puente We Do). Retrospective repara “aceptar extras por flexibilidad” y cierra el hábito de borde.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S42-T1-A PASS`; instruction nombra defect incompleto y tres adiciones. Feedback ancla extra=forbid vs authz. Retro (~30 w) eco parcial del feedback + puente a E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Schema estricto = forma + vocabulario **antes** de permiso. Solo `required.issubset` deja pasar `note` o `status=maybe`. El error clásico del starter es “si están las claves, basta”. Pregunta: si el JSON parsea pero trae `note_interna`, ¿es warning o REJECT_SCHEMA? Siguiente (E2): tres rutas válido / extra / missing.
- **Code/output changes:** none

### S42-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres payloads. Preamble “missing ≠ aceptar” excelente. Feedback y retro casi idénticos (“Missing es incertidumbre… extra es breach”).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un ticket incompleto no es un ataque: es evidencia ausente. Un `note_interna` sí es breach de forma. El error clásico es forzar PASS inventando `status` o tratar incompleto como REJECT. Pregunta: ¿en qué orden evalúas missing vs extras, y por qué? Luego (E3): enrutas CONTINUE / REJECT / REVIEW humana.
- **Code/output changes:** none

### S42-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a códigos de acción. Starter missing→CONTINUE y extras→CONTINUE (promote silencioso). Preamble “no hay seguir con warning”. Retro con self-check REJECT vs REVIEW — metacognición usable. Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Lector v1 + `currency` opcional + `evolution_ok`; predicción monto/err/evol. `why` triple aditivo+old_ok+tags. Retro corta (~35 w) con misconception rename/tag huérfano; sin self-check explícito.
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Evolución segura = aditiva y exhaustiva. Rename silencioso o tag `push` sin rama rompe al worker de ayer. Pregunta: si el lector v1 ignora `currency` pero falta `amount`, ¿por qué debe fallar de verdad y no con cast silencioso? We Do: predicado, tres rutas y MIGRATE_CONSUMERS.
- **Code/output changes:** none

### S42-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invertido (PASS con rename o tags incompletos) excelente. Instruction guiada clara. Retro eco “aditivo + exhaustivo” sin self-check.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `add_optional ∧ old_ok ∧ tags == handled` es el triple; el starter lo invierte y “aprueba” rupture. El error clásico es rename y listo. Pregunta: con tags `{email, phone, push}` y handled sin `push`, ¿PASS o VERSION_SCHEMA? Siguiente: PASS / VERSION / MISSING:handled_tags.
- **Code/output changes:** none

### S42-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres registros aditivo / rename+push / sin handled_tags. Feedback ≈ retro (VERSION vs MISSING). Fade de prosa OK.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  VERSION_SCHEMA es rupture demostrada; MISSING:handled_tags es migración sin mapa — no inventes handlers para forzar PASS. El error clásico es “promuevo y luego migro consumidores”. Pregunta: ¿por qué un rename con old_reader_passes=False no es MISSING? Luego (E3): CONTINUE / VERSION / MIGRATE_CONSUMERS.
- **Code/output changes:** none

### S42-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Deploy fail-closed. Starter missing→CONTINUE y rename→CONTINUE. Retro con self-check VERSION vs MIGRATE. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** same_tenant / cross_tenant / admin_override con predicción. Preamble authn≠authz y CP-N4-A. `why` binding + admin explícito. Retro clara.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter `actor != owner` (cross-tenant abierto) — defect de gate excelente. Feedback ancla CP-N4-A. Retro (~28 w) sin self-check; eco ligero.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Binding `actor == owner` + `case:read` es el núcleo del camino analista; “está logueado” no basta. El starter abre el caso ajeno a propósito. Pregunta: con actor=user-a y owner=user-b y scope case:read, ¿qué imprime el status? Siguiente: PASS / DENY / MISSING:roles.
- **Code/output changes:** none

### S42-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Matriz allow/deny/missing. Feedback y retro eco en DENY vs MISSING.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  DENY es binding fallido demostrado; MISSING:roles es matriz incompleta — no inventes scopes vacíos como allow. El error clásico es “arreglar” el promote inventando roles. Pregunta: si falta `roles`, ¿es lo mismo que DENY_CROSS_TENANT? Luego: CONTINUE / DENY / VERIFY_RESOURCE_OWNER.
- **Code/output changes:** none

### S42-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Núcleo CP-N4-A en códigos de acción. Starter missing y cross-tenant como CONTINUE. Retro con self-check DENY vs VERIFY.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Catálogo por service_id; shared-admin sin scopes. Predicción y deny-by-default claros. `why` y retro alineados a least privilege.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Tres puertas (scope + svc- + ruta); starter invertido e incompleto. Feedback fuerte. Retro corta eco “tres puertas”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Falla una puerta y es DENY_SCOPE: grant de report no autoriza prod:write ni un `shared-admin`. El error clásico es “tiene un scope, basta”. Pregunta: ¿por qué `service_id.startswith("svc-")` no se puede sustituir por un rol “de confianza” en el header? Siguiente: matriz PASS / DENY / MISSING:route.
- **Code/output changes:** none

### S42-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Matriz con denegación multi-falla y missing de ruta. Feedback ≈ retro. Nota: invalid falla por varias razones a la vez — aceptable.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  DENY es privilege real (scope, identidad o ruta); MISSING es catálogo incompleto. Inventar `route_declared=True` no es least privilege. Pregunta: en el invalid, ¿basta una de las tres fallas para DENY_SCOPE? Luego: CONTINUE / DENY / REQUEST_NARROW_GRANT.
- **Code/output changes:** none

### S42-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Worker a producción. Retro con self-check REQUEST vs DENY. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Allowlist SSRF + path confinement; predicción de cuatro salidas; metadata cloud vs docs. `why` rechazo calculado. Retro corta el misconception “https basta”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Multi-defecto (invertido + ignora hosts). Éxito `S42-T3-A PASS`. Feedback y retro eco “tres puertas”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Size + host + path son **conjuntos**: un SSRF a metadata no se salva mirando solo `/etc`. El starter ignora allowlist a propósito. Pregunta: con path limpio bajo root pero host `169.254.169.254`, ¿PASS o REJECT? Siguiente: PASS / REJECT / MISSING:root.
- **Code/output changes:** none

### S42-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Adverso real oversize+metadata+`/etc`; missing root. Feedback ancla 169.254…; retro añade distinción MISSING vs breach — menos eco que el promedio.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro ~35 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Guarda adjunto con SECURITY_REVIEW. Self-check “¿por qué no inventar root?” excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** risk_deps + promote_ok; predicción high/promote/block. `why` aclara subset vs cinco flags de We Do. Retro principle + puente; sin self-check.
- **Checklist:** all pass; retro partial (self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Promote fail-closed es conjunción de controles, no “no hay key en el README”. Inventar `critical_cves=0` sin inventario confunde missing con cero riesgos. Pregunta: si no hay secreto en repo pero las deps no están pinned, ¿promote True o False? We Do: cinco flags y rama ASSESS.
- **Code/output changes:** none

### S42-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Cinco condiciones; starter incompleto e invertido. Feedback fuerte. Retro eco “cinco controles”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Un solo hallazgo (secreto en artefacto, sin rotación, unpinned o CVE crítica) bloquea. El error clásico es “no hay secreto en el log, listo”. Pregunta: ¿por qué `rotation_tested` debe ser True y no solo documentado en un wiki? Siguiente: PASS / ROTATE / MISSING:critical_cves.
- **Code/output changes:** none

### S42-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Limpio / breach / sin inventario. Feedback ≈ retro ROTATE vs MISSING.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  ROTATE_AND_BLOCK es hallazgo demostrable; MISSING:critical_cves es falta de scan — no asumas cero CVE. El error clásico es “no hay número, limpio”. Pregunta: ¿qué pediría ASSESS_DEPENDENCY_RISK al equipo de deps en E3? Luego: CONTINUE / ROTATE / ASSESS.
- **Code/output changes:** none

### S42-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** CI a staging. Self-check de evidencia para ASSESS. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** Drop de email en log + retention purpose-bound. Predicción vista/banderas. `why` y retro minimización = purpose + campos + techo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** inventory_ok invertido e incompleto (sin purpose). Feedback ancla tres condiciones. Retro eco corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Minimización no es “parecer pocos campos”: es `collected ⊆ needed` + purpose `status-report` + techo. El starter aprueba over-collection o retención abusiva. Pregunta: con `full_name` de más y purpose correcto, ¿PASS o MINIMIZE? Siguiente: PASS / MINIMIZE / MISSING:max_retention_days.
- **Code/output changes:** none

### S42-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Mínimo / over-collect+3650 / sin techo. Eco feedback/retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  MINIMIZE es over-collection o retención abusiva demostrable; MISSING:max es política incompleta — no inventes 30 días. El error clásico es purpose `maybe-useful`. Pregunta: ¿quién debería firmar el techo de retención antes de publicar el dataset? Luego: CONTINUE / MINIMIZE / PRIVACY_OWNER_REVIEW.
- **Code/output changes:** none

### S42-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Publica dataset. Self-check “¿quién firma el techo?”. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S42-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Soft-delete primario vs export vivo; predicción de tres banderas. `why` y retro cierran el misconception “DELETE FROM y listo” y anclan CP-N4-A.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S42-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** purge_ok con isdisjoint + flags; starter aprueba PII en audit o derivado vivo. Feedback CP-N4-A. Retro corta eco.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Soft-delete del primario no cierra el ciclo: audit limpio + derivados purgados + llave separada. El starter deja pasar reaparición a propósito. Pregunta: si la fila está borrada pero `snapshot.csv` vive, ¿PASS o PURGE_DERIVATIVES? Siguiente: PASS / PURGE / MISSING:key_separate.
- **Code/output changes:** none

### S42-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Purga OK / email+export vivo / sin key_separate. Eco feedback/retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  PURGE es reaparición o derivado vivo; MISSING:key es diseño de reidentificación no confirmado — no asumas `key_separate=True`. El error clásico es soft-delete y listo. Pregunta: ¿por qué un email en audit rompe CP-N4-A aunque el primario esté vacío? Luego: CONTINUE / PURGE / VERIFY_DELETION_SCOPE.
- **Code/output changes:** none

### S42-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cierre de ticket. Self-check “¿dónde reaparece un email si solo haces soft-delete?” — cierra el hilo de redacción CP-N4-A.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo (proyecto) — **A**
- **Diagnosis:** Marco maduro: context CP-N4-A, objectives, requirements accionables, starter **calculado** (schema → host → path → authz + redact + purge → READY), portfolioNote con missing≠breach y “no booleanos a mano”, rubric. Retrospective de defensa post-build con tres auto-checks + amenaza residual/rollback. Un true newbie con We Do completados puede defender el artefacto en 30 s.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (opcional P2: starter generoso ya da READY — intencional como plantilla de evidencia)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (residual only)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están cerrados post Round-1.

### P1
- **Ninguno obligatorio.** No hay unidad que falle el test true-newbie en un ítem crítico (éxito visible, constraints en preamble, defectos que fallan el fixture válido).

### P2 (calidad — Fixer ligero, prosa a mano)
1. **Ecos feedback ≈ retrospective en ~18 weDo E1/E2** — expandir retro con self-check distinto del feedback (propuestas arriba por unidad; priorizar T1-A-E1/E2, T2-A-E1/E2, T2-B-E1/E2, T3-A-E1, T3-B-E1/E2, T4-A-E1/E2, T4-B-E1/E2).
2. **Longitud de retros E1** — subir al piso ~40–50 w sin ensayar de nuevo el feedback.
3. **iDo retros cortas** (T1-B-DEMO, T3-B-DEMO) — un self-check opcional.
4. **Hints E2/E3** — opcional: acortar a principle + un paso, no la fórmula completa (Master puede tolerar andamiaje denso).
5. **Fade de código E1–E3** — no reescribir fixtures en R2; documentado como patrón de sección. Si en otra campaña se quiere más transfer, variar solo el adverso de E3 (no tocar outputs sin execute-and-diff).

### Explicit non-goals for R2 Fixer
- No renombrar `id: graph-rag` / archivo en esta ronda.
- No tocar salidas canónicas ni asserts de solution.
- No “descomponer” el adverso multi-falla de T2-B.
- No forzar paridad demo T3-B ↔ E1 (cinco flags).

---

## Residual risks
- **Patrón E1→E2→E3 muy regular:** un learner puede automatizar “invertir el booleano” sin interiorizar la escena de mesa de soporte; las preambles mitigan si se leen. Self-checks en retro E1 reducen el riesgo.
- **Hints densos en E3:** reducen struggle productivo; aceptable en Master / transfer con códigos de acción largos; no es wrong≈right.
- **True newbie + sección Master:** el código (sets, predicados, códigos de acción) sigue denso; con preamble el andamiaje verbal ya es suficiente para operar.
- **Id `graph-rag`:** confunde búsquedas y revisores humanos; fuera de scope de exercise pedagogy.
- **No se editó código fuente en esta ronda** — solo este informe.

---

## Counts summary for Fixer (Round 2)

| Tipo | Unidades | Score A / A− | Score B | Score C/D | Residual fix needed |
|------|----------|--------------|---------|-----------|---------------------|
| iDo  | 8        | 7            | 1 (T1-B-DEMO / T3-B polish) | 0 | P2 prose only |
| weDo | 24       | 10 (sobre todo E3 + un E2) | 14 | 0 | P2 expand retros E1/E2 |
| youDo| 1        | 1            | 0       | 0 | none |

**Total P0 residual units:** 0  
**Total P1 residual units:** 0  
**Total P2 residual units:** ~16 weDo + 2 iDo (prosa metacognitiva; no código)  
**Anti-aberration:** informe escrito a mano, unidad por unidad; sin generadores; source no modificado.

**Contraste Round 1 → Round 2:** R1 diagnosticó ausencia total de title/preamble/retrospective (24 P0 + 9 P1). R2 verifica que esos campos existen, son usables y el fade de superficies es real; lo que queda es polish de metacognición (eco feedback/retro), no reescritura de la sección.

Section 42 exercise pedagogy review complete. Ready for the Fixer prompt.
