# S43 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Contenedores y reproducibilidad operativa
- **shortTitle:** Contenedores
- **id:** `llmops`
- **index:** 43
- **source:** `src/lib/course/sections/s43-llmops.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S43-T1-A Dockerfile/layers/caché · T1-B bases/non-root/tamaño · T2-A config/secrets/volumes · T2-B networking/health/signals · T3-A API/worker/DB/cache · T3-B migraciones/efímeros · T4-A locks/multi-stage · T4-B scan/límites/debug
- **hilo de caso:** **CASO-TRU-043** (plataforma ficticia en Trujillo sintético); producto **Governed Python Service Platform**; gate **CP-N4-A** (build repetible, non-root, sin secretos horneados, límites y shutdown limpio); práctica en **stdlib** que modela el contrato Docker/Compose sin daemon obligatorio; sin PII real ni secretos reales

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~395–630), `weDo.steps[]` (24 ejercicios, ~632–2041) y `youDo` (~2044–2112) en `s43-llmops.ts`.
- Contrastado con theory T1–T4: layers/caché → non-root → secrets/volumes → health/SIGTERM → Compose stack → expand/contract → multi-stage/lock → scan/límites.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota: el andamiaje de *código* (DEFECT nombrados, fixtures CASO-TRU-043-*, outputs canónicos, fade E1 fix → E2 assess → E3 decide fail-closed sobre texto de artefacto) es maduro y alineado a theory; los campos `preamble` / We Do short `title` / `retrospective` **no existen** en el source (0 matches en unidades de práctica).

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S43 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué calcula el demo); no sustituye preamble (escena + qué observar) |
| I Do `why` | Presente; ~1–2 frases densas; a menudo **bajo** del piso 40–90 palabras |
| We Do `title` | **Ausente** en los 24 (solo `title` de archivo `.py` en starter/solution) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra DEFECT, fixture, gate y salida exacta; **mezcla** contexto + meta + éxito + límites en un solo bloque — legible para quien ya opera plataformas, **opaco** para un newbie sin escena de Trujillo/CP-N4-A |
| We Do `feedback` | Presente en los 24; nombra el contrato del gate (bien); a menudo 1 frase plantilla “explica qué campo…”; poco *por qué importa en la plataforma de Trujillo* ni metacognición |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados (predicado invertido, None→CONTINUE, orden COPY invertido, root/latest, secret horneado, readiness falsa, depends_on sin retries, contract sin compat, gcc en runtime, límites 0) |
| Hints | E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade real de andamiaje de código |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con checklist BLOCKED→READY **sólidos** y alineados a CP-N4-A |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CASO-TRU-043; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos, bugs nombrados, outputs canónicos, progresión E1 corrección de predicado → E2 tabla valid/invalid/missing → E3 CONTINUE/breach/INSPECT_* sobre texto Dockerfile/Compose/log/runbook/scan) es de referencia para Master. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa empaquetar el servicio de S42 en Trujillo, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: predicado de layers → assess de tres fixtures → decide sobre texto de Dockerfile; T2-B: readiness+SIGTERM → assess → parseo de log de probes). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming del archivo fuente:** el archivo se llama `s43-llmops.ts` y el `id` es `llmops`, pero el contenido es **contenedores y reproducibilidad operativa**, no LLMOps de fine-tuning. El Fixer no debe renombrar en esta ronda salvo que el orchestrator lo pida; el jobRelevance ya aclara el foco. Solo documentar para no confundir al learner con el id interno.

---

## Unit ledger

### S43-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de orden de layers: `deps` antes de `app`, digest lógico `deps:sha256:lock1` estable y `cache stable_layers_first`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (pip no se re-resuelve si solo cambia source) y `retrospective` del misconception “el caché es magia del host”. El `why` es una frase densa, corta.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En la plataforma ficticia de Trujillo (CASO-TRU-043) un commit que solo toca `src/` no debe invalidar la capa de `pip install`. Esta demo ordena steps `base → deps → app → user → cmd` y calcula si el lock produce el mismo digest lógico de deps. No escribas aún: predice `pip_before_app`, `digest_stable` y el valor de `cache`. Observa por qué un orden invertido dejaría el caché “invalid” aunque el lock no cambie.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `index("deps") < index("app")` es el contrato de caché; el digest se construye solo desde el lock cuando deps va primero; sin daemon Docker el modelo stdlib basta para auditar el orden; copiar source antes del lock es el error clásico de CI lento. Puente a We Do: corregir el predicado invertido de reutilización de capa.
- **Proposed retrospective:**  
  Si puedes explicar por qué dos builds con el mismo lock deben compartir digest de deps sin mirar el código, ya tienes el hábito de layers de estable a cambiante. El error clásico es culpar al registry en vez de reordenar el Dockerfile. En We Do practicarás el gate `REORDER_DOCKERFILE`.
- **Code/output changes:** none
- **Validation notes:** Output `pip_before_app True` / `digest_stable True` / `cache stable_layers_first` alineado a theory T1-A.

---

### S43-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter invierte a “PASS si no reusa capa deps y rebuilds>3”. Instruction densa mezcla DEFECT, contrato y salida; sin title, preamble ni retrospective. Feedback pide explicar campos pero no ancla “por qué el build de Trujillo se vuelve irreproducible y lento”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Caché de deps antes del source
- **Proposed preamble:**  
  - **Contexto:** en CASO-TRU-043-1A la API de Trujillo debe reutilizar la capa de dependencias cuando solo cambia el código.  
  - **Meta:** corregir el predicado de contrato (lock antes de source, capa reusada, un rebuild de source, digest estable).  
  - **Éxito:** una línea `S43-T1-A PASS`.  
  - **Límites:** no mutes el fixture; no inventes secretos; el DEFECT está en la condición booleana, no en los datos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `not dependency_layer_reused` y `rebuilds > 3` (DEFECT).  
  2. Cámbialo a lock antes de source, capa reusada, `source_change_rebuilds == 1` y `digest_stable`.  
  3. Conserva el print de status.  
  4. Debe imprimir `S43-T1-A PASS`.
- **Proposed feedback improvement:**  
  Con rebuilds=1 y capa reusada el contrato es True solo si dejas de premiar el desorden. Si dejas el predicado invertido, el happy path falla y el adverso de E2 «parece» válido: el gate de caché se vuelve inútil.
- **Proposed retrospective:**  
  Deps antes de app es el mínimo de un Dockerfile cacheable. El error clásico es invertir el predicado o exigir rebuilds altos como “éxito”. Siguiente (E2): enrutar válido, desorden y campo `digest_stable` ausente.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S43-T1-A PASS` correctos.

---

### S43-T1-A-E2 (weDo, independent)
- **Diagnosis:** Independiente fuerte: tres rutas PASS / REORDER_DOCKERFILE / MISSING:digest_stable. Instruction ya lista salidas; falta escena de “schema antes que contenido” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de orden de layers
- **Proposed preamble:**  
  - **Contexto:** el gate de build no solo mira el dict: primero exige campos, luego el orden de layers.  
  - **Meta:** implementar `assess` que separe válido, adverso (source antes de lock) y sin `digest_stable`.  
  - **Éxito:** `PASS REORDER_DOCKERFILE MISSING:digest_stable`.  
  - **Límites:** calcula `missing` antes de leer digest; no rellenes el campo; datos sintéticos CASO-TRU-043-1A.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si no reusa capa y rebuilds > 3 (DEFECT).  
  2. Corrige al predicado de T1-A (lock, reuso, rebuilds==1, digest).  
  3. Conserva la rama MISSING por campos ausentes.  
  4. Imprime las tres salidas en orden.
- **Proposed retrospective:**  
  Schema (MISSING) se evalúa antes que contenido (REORDER). El error clásico es acceder a `digest_stable` cuando falta y tumbar el flujo. Luego (E3): CONTINUE / REORDER / INSPECT sobre texto de Dockerfile.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; output canónico intacto.

---

### S43-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al texto de mini-Dockerfile: CONTINUE / REORDER_DOCKERFILE / INSPECT_CACHE_INVALIDATION. Starter trata None como CONTINUE y aprueba orden invertido (`src < req`). Instruction ya nombra las rutas; falta anclar reutilización en You Do y retrospective “ausencia ≠ éxito”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar texto de Dockerfile
- **Proposed preamble:**  
  - **Contexto:** en Trujillo no se inventa un Dockerfile vacío: se pide inspección de caché.  
  - **Meta:** decidir CONTINUE / REORDER_DOCKERFILE / INSPECT_CACHE_INVALIDATION sobre el texto.  
  - **Éxito:** `CONTINUE REORDER_DOCKERFILE INSPECT_CACHE_INVALIDATION`.  
  - **Límites:** None/vacío → INSPECT (no CONTINUE); `COPY requirements` debe ir antes de `COPY src`; sin daemon real.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: None devuelve CONTINUE y el orden usa `src < req`.  
  2. En `decide`, vacío → `INSPECT_CACHE_INVALIDATION`.  
  3. Completos: CONTINUE solo si `req < src` y ambos existen.  
  4. Imprime las tres decisiones en orden.
- **Proposed retrospective:**  
  INSPECT_* pide evidencia; REORDER_* cierra el breach de orden; CONTINUE solo con deps antes de app. El error clásico es tratar “sin Dockerfile” como OK. Pregunta: ¿por qué no rellenar un Dockerfile mínimo por defecto en silencio?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a callout `INSPECT_CACHE_INVALIDATION` de theory T1-A.

---

### S43-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de auditoría non-root: base con digest, UID 10001, caps vacías, 118 MiB ≤ 150. Description nombra bases y tamaño; falta preamble de “latest y root son breach” y retrospective del misconception “más paquetes = más profesional”. El `why` es una frase densa.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de publicar la imagen de la API de Trujillo, el equipo audita base, usuario y tamaño — no el “look and feel” del tag. En esta demo `python:3.12-slim@sha256:demo` corre como UID 10001 sin capabilities y bajo techo de 150 MB. No escribas: predice `nonroot`, `uid` y si `ok` es True. Observa por qué `latest` o UID 0 tumbarían el gate aunque el servicio “arranque”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: base pinned ≠ latest; UID ≥1000 sin caps extras; runtime_mb ≤ max_mb es presupuesto de superficie, no vanity metric; el breach se llama `REBUILD_NONROOT`. Puente a We Do: invertir el predicado que premiaba root/caps.
- **Proposed retrospective:**  
  Non-root + base fijada + techo de MB es el trío mínimo de runtime. El error clásico es aceptar UID 0 “porque en local funciona”. We Do: predicado de non-root y tamaño.
- **Code/output changes:** none
- **Validation notes:** Output `nonroot True` / `uid 10001` / `ok True` alineado a theory T1-B.

---

### S43-T1-B-E1 (weDo, guided)
- **Diagnosis:** Drill guiado: starter da PASS si `uid==0` o hay capabilities. Instruction técnica completa; sin escena de privilegio en plataforma de Trujillo ni cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Non-root con base fijada
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-1B exige imagen parchable, proceso non-root y runtime bajo presupuesto.  
  - **Meta:** corregir el predicado (base pinned, UID ≥1000, caps vacías, runtime ≤ max).  
  - **Éxito:** `S43-T1-B PASS`.  
  - **Límites:** no mutes el fixture; no uses `latest`; el DEFECT premia root o caps extras.
- **Proposed instruction/description improvements:**  
  1. Revisa: `meets_contract` es True con uid 0 o capabilities no vacías (DEFECT).  
  2. Cámbialo a base pinned, uid ≥ 1000, `not capabilities`, runtime ≤ max.  
  3. Conserva el print.  
  4. Debe salir `S43-T1-B PASS`.
- **Proposed feedback improvement:**  
  UID 10001 con caps vacías solo pasa si dejas de premiar root. Si el predicado queda invertido, el happy path imprime breach y el adverso de E2 parece “seguro”.
- **Proposed retrospective:**  
  Privilegio mínimo se audita con números (UID, MB), no con “confiamos en el equipo”. Error clásico: `USER root` o base flotante. E2: válido / root+caps / max_mb ausente.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S43-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas PASS / REBUILD_NONROOT / MISSING:max_mb. Falta preamble de schema-first y retrospective; instruction ya nombra salidas exactas.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de runtime non-root
- **Proposed preamble:**  
  - **Contexto:** sin techo de tamaño no se puede elegir base parchable con criterio.  
  - **Meta:** `assess` que separe válido, adverso (uid 0, latest, SYS_ADMIN) y sin `max_mb`.  
  - **Éxito:** `PASS REBUILD_NONROOT MISSING:max_mb`.  
  - **Límites:** missing antes de leer max_mb; no inventes techo; fixture sintético.
- **Proposed instruction/description improvements:**  
  1. Corrige el PASS que premia root/caps.  
  2. Aplica base pinned + uid ≥1000 + caps vacías + runtime ≤ max.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Falta de `max_mb` es incertidumbre de selección de base, no “pass silencioso”. Error clásico: KeyError por leer max antes del check. E3: parsear USER/FROM en texto de Dockerfile.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a texto: GOOD con `@sha256` + USER 10001 vs BAD latest + USER 0; max_mb None → SELECT_PATCHABLE_BASE. Starter invierte el predicado y trata None como CONTINUE. Excelente superficie nueva; falta prosa de escena y cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Parsear USER y base en Dockerfile
- **Proposed preamble:**  
  - **Contexto:** el artefacto real del portfolio es el Dockerfile, no el dict de lab.  
  - **Meta:** CONTINUE / REBUILD_NONROOT / SELECT_PATCHABLE_BASE desde texto + presupuesto.  
  - **Éxito:** `CONTINUE REBUILD_NONROOT SELECT_PATCHABLE_BASE`.  
  - **Límites:** max_mb None → SELECT; USER ≥1000 y digest en FROM; sin shell root inventado.
- **Proposed instruction/description improvements:**  
  1. None de max_mb → `SELECT_PATCHABLE_BASE` (no CONTINUE).  
  2. Extrae UID de `USER `; exige `@sha256:` y runtime ≤ max.  
  3. BAD (latest + USER 0) → REBUILD_NONROOT.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  SELECT_* pide criterio de base; REBUILD_* cierra root/latest. Error clásico: aprobar root “porque el servicio arranca”. Pregunta: ¿por qué `latest` no es parchable de forma auditable?
- **Code/output changes:** none
- **Validation notes:** Solution con `_user_uid` es el canónico a preservar.

---

### S43-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de capas sin SECRET=/PASSWORD= y volumes db durable / cache efímero. Falta preamble “rotación sin rebuild” y retrospective “DB en tmp no es ahorro, es pérdida de datos”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con la imagen non-root lista, la plataforma de Trujillo separa lo que va en la capa de lo que va en runtime. Esta demo inspecciona layers `ENV=prod` / `CMD=api` (sin secretos) y clasifica `db` durable frente a `cache` efímero. No escribas: predice `no_hardcoded`, `db_durable` y `ok`. Observa por qué un `ENV SECRET=` en una capa rompería la rotación sin rebuild.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: secret horneado se detecta por substring en capas; durable/efímero no se improvisan en prod; rotar clave no debe exigir rebuild de app. Puente a We Do: predicado invertido que premiaba secret_baked o db en ephemeral.
- **Proposed retrospective:**  
  Imagen limpia + mounts clasificados = rotación y recovery posibles. Error clásico: copiar `.env` al build. We Do: gate `REMOVE_BAKED_SECRET`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T2-A.

---

### S43-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter da PASS si secret_baked o db en ephemeral. Instruction completa; sin escena de “secret en history de Docker” ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Secretos solo en runtime
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-2A exige imagen e inspección sin secreto y DB fuera del efímero.  
  - **Meta:** corregir predicado (no baked, runtime_secret, config declarada, db durable, cache efímero).  
  - **Éxito:** `S43-T2-A PASS`.  
  - **Límites:** no mutes fixtures; no pongas PII/secretos reales en el código.
- **Proposed instruction/description improvements:**  
  1. El DEFECT premia `secret_baked` o `"db" in ephemeral`.  
  2. Invierte a no baked + runtime_secret + config_declared + mounts correctos.  
  3. Conserva print y status.  
  4. `S43-T2-A PASS`.
- **Proposed feedback improvement:**  
  Con secret_baked=False el happy path solo pasa si dejas de premiar el horneado. Si no, REMOVE_BAKED_SECRET se convierte en la “ruta normal”.
- **Proposed retrospective:**  
  Runtime injection es el hábito de rotación. Error clásico: ENV KEY=valor en Dockerfile. E2: válido / secret+db efímero / ephemeral_volumes ausente.
- **Code/output changes:** none
- **Validation notes:** Output `S43-T2-A PASS` correcto.

---

### S43-T2-A-E2 (weDo, independent)
- **Diagnosis:** PASS / REMOVE_BAKED_SECRET / MISSING:ephemeral_volumes. Falta prosa de schema-first y cierre; código y fade bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de secrets y volumes
- **Proposed preamble:**  
  - **Contexto:** sin clasificación de efímeros no se sabe qué se puede borrar al redeploy.  
  - **Meta:** assess válido, adverso (secret horneado, db en ephemeral) e incomplete.  
  - **Éxito:** `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes`.  
  - **Límites:** missing primero; no inventes mounts; sintético.
- **Proposed instruction/description improvements:**  
  1. Corrige el predicado invertido del starter.  
  2. Exige no baked + runtime + config + db durable + cache efímero.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  CLASSIFY_VOLUME es incertidumbre; REMOVE es breach de contenido. Error clásico: rellenar ephemeral en silencio. E3: inspeccionar strings de `docker history` sintético.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a capas + mounts: GOOD limpio, BAD con SECRET=sk-demo y db en ephemeral, None → CLASSIFY_VOLUME. Starter aprueba baked. Superficie excelente; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Inspeccionar capas y mounts
- **Proposed preamble:**  
  - **Contexto:** el portfolio pedirá evidencia de history sin secretos, no un dict de lab.  
  - **Meta:** CONTINUE / REMOVE_BAKED_SECRET / CLASSIFY_VOLUME.  
  - **Éxito:** `CONTINUE REMOVE_BAKED_SECRET CLASSIFY_VOLUME`.  
  - **Límites:** ephemeral None → CLASSIFY; busca SECRET=/PASSWORD=; db no puede ser efímero.
- **Proposed instruction/description improvements:**  
  1. None de ephemeral → CLASSIFY_VOLUME.  
  2. ok = no baked + db durable + cache ephemeral + db no en ephemeral.  
  3. BAD layers/mounts → REMOVE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  History legible es evidencia de rotación. Error clásico: aprobar `SECRET=` porque “es demo”. Pregunta: ¿por qué rotar un secret horneado exige rebuild de app?
- **Code/output changes:** none
- **Validation notes:** Solution canónica a preservar.

---

### S43-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de readiness 200/503 y SIGTERM con grace 30. Falta preamble “200 siempre no es health” y retrospective del kill abrupto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con secretos fuera de la imagen, la API de Trujillo debe decir cuándo puede servir y cómo se apaga. Esta demo calcula HTTP de readiness (200 si ready y live; 503 si DB caída) y un SIGTERM con cola vacía y grace ≥20. No escribas: predice `ready`, `not_ready` y el dict de `sigterm`. Observa la diferencia entre “proceso vivo” y “listo para tráfico”.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: readiness ≠ liveness; grace medible evita trabajo a medias; no hardcodear graceful=True. Puente a We Do: predicado que premiaba falta de readiness o de drain.
- **Proposed retrospective:**  
  503 con DB caída es honestidad operativa. Error clásico: /readyz siempre 200. We Do: gate `DRAIN_AND_ISOLATE`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T2-B.

---

### S43-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si no readiness_db o no sigterm_drains. Instruction densa; sin escena de redeploy en Trujillo ni cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Readiness y drain en SIGTERM
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-2B exige red privada, probes semánticos y grace ≥20 s.  
  - **Meta:** corregir predicado (private, readiness_db, liveness, drains, grace≥20).  
  - **Éxito:** `S43-T2-B PASS`.  
  - **Límites:** no mutes fixture; no simules red pública como “ok”.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS cuando falta readiness o no drena.  
  2. Exige los cinco campos del contrato T2-B.  
  3. Conserva print.  
  4. `S43-T2-B PASS`.
- **Proposed feedback improvement:**  
  Con grace 30 y drains True el happy path solo pasa si dejas de premiar el apagado sucio. Si no, DRAIN_AND_ISOLATE se vuelve la norma.
- **Proposed retrospective:**  
  Drain ensayado es parte del deploy, no un “nice to have”. Error clásico: kill -9 mental en prod. E2: válido / red pública sin drain / grace ausente.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S43-T2-B-E2 (weDo, independent)
- **Diagnosis:** PASS / DRAIN_AND_ISOLATE / MISSING:grace_seconds. Falta prosa schema-first; código sólido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de health y señales
- **Proposed preamble:**  
  - **Contexto:** sin grace documentado no se puede diagnosticar un apagado limpio.  
  - **Meta:** assess válido, adverso (red pública, readiness falsa, grace 0) e incomplete.  
  - **Éxito:** `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds`.  
  - **Límites:** missing antes de grace; no inventes 30 s por defecto.
- **Proposed instruction/description improvements:**  
  1. Corrige predicado invertido.  
  2. Exige private + readiness + liveness + drains + grace≥20.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  DIAGNOSE_HEALTH_SIGNAL pide evidencia; DRAIN cierra breach. Error clásico: KeyError en grace. E3: parsear log de probes sintético.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a log de probes: false_ready con db_ok=false + 200, red pública, sin drain. Starter aprueba el adverso y None→CONTINUE. Superficie rica; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar log de probes y SIGTERM
- **Proposed preamble:**  
  - **Contexto:** en incidentes el artefacto es el log, no el dict del lab.  
  - **Meta:** CONTINUE / DRAIN_AND_ISOLATE / DIAGNOSE_HEALTH_SIGNAL.  
  - **Éxito:** `CONTINUE DRAIN_AND_ISOLATE DIAGNOSE_HEALTH_SIGNAL`.  
  - **Límites:** log vacío → DIAGNOSE; readiness 200 con db caída es breach; grace numérico ≥20.
- **Proposed instruction/description improvements:**  
  1. None/vacío → DIAGNOSE_HEALTH_SIGNAL.  
  2. Exige network=private, ready_ok, /healthz, drained y grace≥20.  
  3. BAD_LOG → DRAIN_AND_ISOLATE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Un 200 con db caída es mentira operativa. Error clásico: confiar en “live=true” como ready. Pregunta: ¿por qué grace 0 no cuenta como drain?
- **Code/output changes:** none
- **Validation notes:** Solution con `_grace_seconds` a preservar.

---

### S43-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de stack api/worker/db/cache con retries y redes front/back. Falta preamble “depends_on no basta” y retrospective del stack “half healthy”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con probes claros, Compose declara el stack local de Trujillo: cuatro servicios, redes segmentadas y retries de aplicación a DB. Esta demo valida conjuntos healthy==services, retries True y redes front/back. No escribas: predice `api_deps`, `stack_healthy` y `retries`. Observa por qué solo listar servicios en YAML no demuestra un stack sano.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: depends_on ordena arranque, no reintentos; redes front/back acotan exposición de DB; healthy debe igualar services. Puente a We Do: predicado que premiaba unhealthy sin retries.
- **Proposed retrospective:**  
  Stack sano = healthy + retries + redes, no “compose up sin error”. Error clásico: confiar solo en depends_on. We Do: `STOP_UNHEALTHY_STACK`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T3-A.

---

### S43-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si healthy≠services y sin retries. Instruction técnica; sin escena de “un comando limpio” ni cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Stack sano con retries de app
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-3A exige api/worker/db/cache healthy, retries a DB y redes front/back.  
  - **Meta:** corregir predicado de stack.  
  - **Éxito:** `S43-T3-A PASS`.  
  - **Límites:** no mutes sets del fixture; no sustituyas retries por depends_on en la cabeza del learner.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS cuando el stack está roto.  
  2. Exige REQUIRED ⊆ services, healthy==services, api_retries_db, front/back ⊆ networks.  
  3. Conserva print.  
  4. `S43-T3-A PASS`.
- **Proposed feedback improvement:**  
  Con los cuatro servicios healthy el happy path solo pasa si dejas de premiar el stack roto. Si no, STOP_UNHEALTHY_STACK se vuelve el “éxito” del print.
- **Proposed retrospective:**  
  Retries de aplicación son código de la API, no magia de Compose. Error clásico: healthy solo en db. E2: válido / half healthy / networks ausente.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S43-T3-A-E2 (weDo, independent)
- **Diagnosis:** PASS / STOP_UNHEALTHY_STACK / MISSING:networks. Falta prosa; código y salidas bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de stack Compose
- **Proposed preamble:**  
  - **Contexto:** sin mapa de redes no se espera a dependencias con criterio.  
  - **Meta:** assess válido, adverso (solo db healthy, sin retries, red default) e incomplete.  
  - **Éxito:** `PASS STOP_UNHEALTHY_STACK MISSING:networks`.  
  - **Límites:** missing primero; no inventes front/back.
- **Proposed instruction/description improvements:**  
  1. Corrige predicado invertido.  
  2. Aplica regla de cuatro servicios + retries + redes.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  WAIT_FOR_DEPENDENCY es incertidumbre de topología; STOP es breach. Error clásico: leer networks antes del check. E3: auditar texto de compose.yaml.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a YAML: exige cuatro servicios, front/back y DB_MAX_ATTEMPTS; BAD solo api/db/default. Starter aprueba con solo `api:`. Excelente; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar texto de compose.yaml
- **Proposed preamble:**  
  - **Contexto:** el artefacto del portfolio es el YAML, no el set de Python.  
  - **Meta:** CONTINUE / STOP_UNHEALTHY_STACK / WAIT_FOR_DEPENDENCY.  
  - **Éxito:** `CONTINUE STOP_UNHEALTHY_STACK WAIT_FOR_DEPENDENCY`.  
  - **Límites:** compose vacío → WAIT; retries de app (`DB_MAX_ATTEMPTS` o `retries`), no solo depends_on.
- **Proposed instruction/description improvements:**  
  1. None/vacío → WAIT_FOR_DEPENDENCY.  
  2. Exige api/worker/db/cache + front/back + token de retries de app.  
  3. BAD_COMPOSE → STOP.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  depends_on no sustituye backoff de la app. Error clásico: aprobar YAML con solo api. Pregunta: ¿por qué restart_policy del orquestador no es retry de aplicación?
- **Code/output changes:** none
- **Validation notes:** Solution canónica a preservar.

---

### S43-T3-B-DEMO (iDo)
- **Diagnosis:** Demo expand/contract con restore y ephemeral_ok. Falta preamble “contract sin compat bloquea” y retrospective del backup nunca restaurado.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El stack de Trujillo necesita orden de datos: migrar antes de servir, expand compatible con código viejo, recrear efímeros y probar restore. Esta demo deriva strategy `expand_contract` y ok True solo con expand + flags verdes. No escribas: predice strategy, data y ok. Observa por qué un contract incompatible no es “más limpio”, es bloqueo de release.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: expand primero; restore drill es evidencia, no checkbox; tmp/cache se recrean, db no. Puente a We Do: predicado que premiaba contract sin compat.
- **Proposed retrospective:**  
  Migración sin restore es fe en el vacío. Error clásico: tratar db como efímero. We Do: `ROLL_BACK_MIGRATION`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T3-B.

---

### S43-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si migration==contract y not old_code_compatible. Instruction completa; sin escena de release ni cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Expand compatible y restore
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-3B exige expand, compat con código viejo, reset de efímeros y backup restaurado.  
  - **Meta:** corregir predicado de migración.  
  - **Éxito:** `S43-T3-B PASS`.  
  - **Límites:** no mutes fixture; no marques restore True sin entender el drill.
- **Proposed instruction/description improvements:**  
  1. DEFECT premia contract incompatible.  
  2. Exige expand + old_ok + ephemeral_reset + backup_restored.  
  3. Conserva print.  
  4. `S43-T3-B PASS`.
- **Proposed feedback improvement:**  
  Con expand y restore True el happy path solo pasa si dejas de premiar el contract peligroso. Si no, ROLL_BACK_MIGRATION se imprime como “éxito” del status.
- **Proposed retrospective:**  
  Expand/contract es disciplina de compat, no jerga de DB. Error clásico: borrar columnas con código viejo vivo. E2: válido / contract malo / backup_restored ausente.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S43-T3-B-E2 (weDo, independent)
- **Diagnosis:** PASS / ROLL_BACK_MIGRATION / MISSING:backup_restored. Falta prosa; código bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de migración y restore
- **Proposed preamble:**  
  - **Contexto:** sin flag de restore no se puede aprobar el drill de recuperación.  
  - **Meta:** assess válido, adverso (contract, sin compat, sin reset, sin restore) e incomplete.  
  - **Éxito:** `PASS ROLL_BACK_MIGRATION MISSING:backup_restored`.  
  - **Límites:** missing primero; no inventes PASS de restore.
- **Proposed instruction/description improvements:**  
  1. Corrige predicado invertido.  
  2. Aplica expand + flags verdes.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  RUN_RESTORE_DRILL es incertidumbre; ROLL_BACK es breach. Error clásico: leer backup_restored antes del check. E3: auditar runbook de texto.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a runbook: expand/compat/PASS de restore vs contract/SKIPPED/db efímero. Starter aprueba el adverso. Excelente; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar runbook de migración
- **Proposed preamble:**  
  - **Contexto:** el portfolio pide runbook legible, no un bool en Python.  
  - **Meta:** CONTINUE / ROLL_BACK_MIGRATION / RUN_RESTORE_DRILL.  
  - **Éxito:** `CONTINUE ROLL_BACK_MIGRATION RUN_RESTORE_DRILL`.  
  - **Límites:** runbook vacío → RUN_RESTORE_DRILL; rechaza ephemeral: db y restore SKIPPED.
- **Proposed instruction/description improvements:**  
  1. None/vacío → RUN_RESTORE_DRILL.  
  2. Exige strategy expand, old_code_compatible yes, restore PASS, sin ephemeral: db.  
  3. BAD_RB → ROLL_BACK.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Un restore SKIPPED no es “después lo vemos”: es no-go. Error clásico: aprobar contract sin compat. Pregunta: ¿por qué db en ephemeral rompe el rollback?
- **Code/output changes:** none
- **Validation notes:** Solution canónica a preservar.

---

### S43-T4-A-DEMO (iDo)
- **Diagnosis:** Demo multi-stage con lock sha256 y runtime sin gcc. Falta preamble “toolchain fuera del runtime” y retrospective del lock latest.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con migraciones seguras, Trujillo fija *qué* se instala y *dónde* se compila. Esta demo parsea un multi-stage (builder + runtime + COPY --from) y un lock `sha256:abc` sin compiler en runtime. No escribas: predice `builder_has_compilers`, `runtime_slim` y `lock`. Observa por qué un solo stage con gcc en la imagen final rompe el gate de reproducibilidad y superficie.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: pin sha256 congela resolución; builder no viaja a prod; COPY --from es el puente. Puente a We Do: predicado que premiaba unlock o compiler en runtime.
- **Proposed retrospective:**  
  Runtime mínimo + lock hasheado = build repetible. Error clásico: tag `latest` en deps. We Do: `BLOCK_UNPINNED_BUILD`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-A.

---

### S43-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si no runtime_deps_locked o compiler_in_runtime. Instruction densa; sin escena de supply chain ni cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Lock hasheado y runtime slim
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-4A exige lock `sha256:…`, stages builder+runtime, sin compiler en runtime y deps locked.  
  - **Meta:** corregir predicado multi-stage.  
  - **Éxito:** `S43-T4-A PASS`.  
  - **Límites:** no mutes fixture; no aceptes lock `latest` como pin.
- **Proposed instruction/description improvements:**  
  1. DEFECT premia unlock o compiler en runtime.  
  2. Exige startswith sha256, stages ⊇ {builder,runtime}, not compiler, runtime_deps_locked.  
  3. Conserva print.  
  4. `S43-T4-A PASS`.
- **Proposed feedback improvement:**  
  Con lock sha256 y runtime sin compiler el happy path solo pasa si dejas de premiar el build flotante. Si no, BLOCK_UNPINNED_BUILD se imprime como “PASS”.
- **Proposed retrospective:**  
  Pin + multi-stage es disciplina de supply chain local. Error clásico: gcc en la imagen final “por si depuramos”. E2: válido / latest+compiler / runtime_deps_locked ausente.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S43-T4-A-E2 (weDo, independent)
- **Diagnosis:** PASS / BLOCK_UNPINNED_BUILD / MISSING:runtime_deps_locked. Falta prosa; código bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de lock multi-stage
- **Proposed preamble:**  
  - **Contexto:** sin flag de deps locked no se regenera el lock con criterio.  
  - **Meta:** assess válido, adverso (latest, solo runtime, compiler) e incomplete.  
  - **Éxito:** `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked`.  
  - **Límites:** missing primero; no inventes sha256.
- **Proposed instruction/description improvements:**  
  1. Corrige predicado invertido.  
  2. Aplica regla de pin + stages + no compiler + locked.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  REGENERATE_LOCK es incertidumbre; BLOCK es breach. Error clásico: leer runtime_deps_locked antes del check. E3: parsear Dockerfile multi-stage real.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a texto multi-stage + lock: BAD con latest y gcc en runtime; None lock → REGENERATE_LOCK. Starter aprueba sin builder. Excelente; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar multi-stage y lock
- **Proposed preamble:**  
  - **Contexto:** el Dockerfile del portfolio es el artefacto auditado en CI.  
  - **Meta:** CONTINUE / BLOCK_UNPINNED_BUILD / REGENERATE_LOCK.  
  - **Éxito:** `CONTINUE BLOCK_UNPINNED_BUILD REGENERATE_LOCK`.  
  - **Límites:** lock None → REGENERATE; busca gcc solo en el tramo runtime; exige COPY --from=builder.
- **Proposed instruction/description improvements:**  
  1. lock_hash None → REGENERATE_LOCK.  
  2. ok = pin sha256 + builder + runtime + COPY --from + sin gcc/g++ en runtime.  
  3. BAD_DF + latest → BLOCK.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Toolchain en runtime infla superficie y rompe slim. Error clásico: un solo stage “para ir más rápido”. Pregunta: ¿por qué `latest` no es un pin auditable?
- **Code/output changes:** none
- **Validation notes:** Solution canónica a preservar.

---

### S43-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de gate de deploy: 0 CVE, 512 MiB, 1 CPU, sin debug shell → block_deploy False y scan ci_gate. Falta preamble “límite 0 no es unlimited válido” y retrospective del shell root permanente.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cierra el camino a S44: la imagen multi-stage de Trujillo entra a política de scan y límites. Esta demo bloquea deploy si hay CVE crítico, mem/cpu ≤0 o shell de debug. No escribas: predice `block_deploy`, `mem_mb` y `scan`. Observa por qué “memoria 0” no es generosidad: es unlimited disfrazado y no pasa el gate.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: 0 < mem ≤512 y 0 < cpu ≤1.0; debug shell permanente es breach; scan limpio no basta sin límites. Puente a We Do: predicado invertido que premiaba estados de quarantine.
- **Proposed retrospective:**  
  Scan + límites + sin shell root = permiso de deploy. Error clásico: CVE “después lo parcheamos”. We Do: `QUARANTINE_IMAGE`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-B.

---

### S43-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter PASS si CVE>0, límites 0, debug shell o logs crudos (gate invertido completo). Instruction nombra límites estrictamente positivos; sin escena de cuarentena ni cierre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Scan limpio y límites > 0
- **Proposed preamble:**  
  - **Contexto:** CASO-TRU-043-4B exige 0 CVE crítico, 0&lt;mem≤512, 0&lt;cpu≤1.0, sin debug shell y logs redactados.  
  - **Meta:** corregir el gate invertido de deploy.  
  - **Éxito:** `S43-T4-B PASS`.  
  - **Límites:** no mutes fixture; límite 0 no es válido; sin secretos/PII en logs de demo.
- **Proposed instruction/description improvements:**  
  1. DEFECT: `meets_contract` es True en estados de quarantine.  
  2. Cámbialo a CVE==0 y límites estrictamente positivos en rango + not debug_shell + logs_redacted.  
  3. Conserva print.  
  4. `S43-T4-B PASS`.
- **Proposed feedback improvement:**  
  Con CVE 0 y 512/1.0 el happy path solo pasa si dejas de premiar el mal estado. Si no, QUARANTINE_IMAGE se imprime como si fuera PASS.
- **Proposed retrospective:**  
  Límite 0 es unlimited disfrazado. Error clásico: shell root “solo para debug” en la imagen de prod. E2: válido / CVE+límites 0 / logs_redacted ausente.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; importante que Fixer preserve `0 < x <= max`.

---

### S43-T4-B-E2 (weDo, independent)
- **Diagnosis:** PASS / QUARANTINE_IMAGE / MISSING:logs_redacted. Instruction recuerda límites 0; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de scan y límites
- **Proposed preamble:**  
  - **Contexto:** sin evidencia de logs redactados no se tria un finding de scan con ética.  
  - **Meta:** assess válido, adverso (3 CVE, mem/cpu 0, shell, logs crudos) e incomplete.  
  - **Éxito:** `PASS QUARANTINE_IMAGE MISSING:logs_redacted`.  
  - **Límites:** missing primero; no inventes CRITICAL: 0.
- **Proposed instruction/description improvements:**  
  1. Corrige el bad_ok invertido del starter.  
  2. Aplica CVE==0 + límites en rango + not shell + logs_redacted.  
  3. Conserva MISSING.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  TRIAGE_SCAN_FINDING es incertidumbre; QUARANTINE es breach. Error clásico: leer logs_redacted antes del check. E3: parsear reporte de scan en texto.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S43-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a reporte CI: GOOD CRITICAL 0 + límites + logs; BAD CRITICAL 3 + límites 0 + shell; None → TRIAGE. Starter aprueba el adverso. Cierre fuerte de sección; falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar reporte de scan y límites
- **Proposed preamble:**  
  - **Contexto:** el gate de promoción en Trujillo lee un reporte de CI, no un dict de lab.  
  - **Meta:** CONTINUE / QUARANTINE_IMAGE / TRIAGE_SCAN_FINDING.  
  - **Éxito:** `CONTINUE QUARANTINE_IMAGE TRIAGE_SCAN_FINDING`.  
  - **Límites:** reporte vacío → TRIAGE; parsea números; límite 0 no es “sin tope válido”.
- **Proposed instruction/description improvements:**  
  1. None/vacío → TRIAGE_SCAN_FINDING.  
  2. Parsea CRITICAL, memory_limit_mb, cpu_limit; exige 0 CVE, límites en rango, debug false, logs true.  
  3. BAD_SCAN → QUARANTINE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Cuarentena es la respuesta correcta a CVE crítico o shell root. Error clásico: CONTINUE con CRITICAL: 3. Pregunta: ¿por qué mem 0 falla el mismo gate que un CVE?
- **Code/output changes:** none
- **Validation notes:** Solution con `_field` a preservar; puente natural a You Do / S44.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context de Governed Python Service Platform en Trujillo, objectives medibles, requirements alineados a T1–T4 (multi-stage, Compose, secrets/volumes, runbook, tres rutas normal/breach/uncertain), starter con checklist BLOCKED→READY y portfolioNote que prohíbe marcar True sin artefactos. Rubric con pesos. **Falta** `retrospective` de defensa/reflexión post-build. El title del youDo es de proyecto (OK); no es el short title de We Do.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya presente) Contenedores y reproducibilidad operativa · CP-N4-A
- **Proposed preamble:** N/A — `context` ya cubre escena; opcionalmente el Fixer puede no duplicar preamble si el schema youDo no lo usa.
- **Proposed instruction/description improvements:**  
  Mantener requirements. Asegurar en portfolioNote (ya bueno) que READY exige Dockerfile/compose/runbook firmados, no asserts a True.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué evidencia demuestra build repetible + non-root + límites > 0 + shutdown limpio en entorno nuevo? (2) ¿qué harías distinto con secretos reales vs. sintéticos (inyección runtime, nunca capas)? (3) Escribe en el README una frase de impacto medible (p. ej. “rebuild de app sin re-resolver deps; restore drill PASS”) defendible en 30 segundos ante un lead de plataforma. Residual: sin cluster k8s, el Compose local no prueba autoscaling — documenta el límite.
- **Code/output changes:** none
- **Validation notes:** Starter imprime BLOCKED por diseño; no cambiar esa pedagogía.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback razonado)
1. S43-T1-A-E1, E2, E3  
2. S43-T1-B-E1, E2, E3  
3. S43-T2-A-E1, E2, E3  
4. S43-T2-B-E1, E2, E3  
5. S43-T3-A-E1, E2, E3  
6. S43-T3-B-E1, E2, E3  
7. S43-T4-A-E1, E2, E3  
8. S43-T4-B-E1, E2, E3  

Orden sugerido al Fixer: por subtema (E1→E2→E3) para respetar fade; o por severidad uniforme (todos P0 We Do primero).

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
1. S43-T1-A-DEMO … S43-T4-B-DEMO (8 demos)  
2. youDo retrospective  

### P2 (polish)
- Acortar instructions We Do a 40–100 palabras *solo pasos* una vez que preamble absorba contexto/meta/éxito/límites.  
- Feedback: de plantilla “explica qué campo…” a 25–60 palabras con ancla Trujillo/CP-N4-A y por qué el adverso falla.  
- why de I Do: subir al piso 40–90 palabras sin essay.  
- Opcional: aclarar en intro weDo/iDo que el id interno `llmops` no es el tema (contenedores); no bloquea pedagogía de ejercicios.

---

## Residual risks

1. **Homogeneidad de forma E1/E2/E3:** el *código* ya tiene fade real (dict → assess → texto de artefacto); el Fixer debe **no** clonar la misma preamble entre E1/E2/E3 ni entre subtemas — solo reutilizar estructura de bullets del spec.  
2. **Instruction ya densa:** al añadir preamble, recortar instruction a pasos numerados; si se dejan ambas largas, sube carga cognitiva (Sweller).  
3. **Salidas exactas:** no tocar prints/assert/output canónicos salvo execute-and-diff justificado; la pedagogía es verbal.  
4. **E3 y “stdlib sin Docker”:** el learner puede creer que debe instalar Docker; preambles deben reiterar “texto sintético / sin daemon obligatorio” en T1-A/T1-B/T3-A/T4-A.  
5. **Naming `llmops`:** riesgo de confusión en navegación; fuera del alcance de campos preamble salvo nota en intro de sección.  
6. **You Do READY:** riesgo de “marcar True sin archivo”; retrospective debe reforzar portfolioNote.  
7. **Feedback actual:** si solo se añaden preamble/retrospective y no se toca feedback, queda residual P2 aceptable.  
8. **Master audience vs true newbie:** la sección es Master; igual el spec exige escena para quien llega desde S42 sin ops Docker fuerte — no diluir el rigor del DEFECT.

---

## Counts summary for Fixer

| Tipo | Unidades | preamble | retrospective | title (short) |
|------|----------|----------|---------------|---------------|
| iDo | 8 | 0 → 8 needed | 0 → 8 needed | N/A |
| weDo | 24 | 0 → 24 needed | 0 → 24 needed | 0 → 24 needed |
| youDo | 1 | context OK | 0 → 1 needed | present |
| **Total prose gaps** | **33** | **32** | **33** | **24** |

**Código/outputs:** sin cambios pedagógicamente requeridos en esta ronda.

---

Section 43 exercise pedagogy review complete. Ready for the Fixer prompt.
