# S43 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Contenedores y reproducibilidad operativa
- **shortTitle:** Contenedores
- **id:** `llmops`
- **index:** 43
- **source:** `src/lib/course/sections/s43-llmops.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A Dockerfile/layers/caché · T1-B bases/non-root/tamaño · T2-A config/secrets/volumes · T2-B networking/health/signals · T3-A API/worker/DB/cache · T3-B migraciones/efímeros · T4-A locks/multi-stage · T4-B scan/límites/debug
- **hilo:** **CASO-TRU-043** (plataforma ficticia en Trujillo sintético); producto **Governed Python Service Platform**; gate **CP-N4-A** (build repetible, non-root, sin secretos horneados, límites y shutdown limpio); práctica en **stdlib** que modela Dockerfile/Compose sin daemon obligatorio
- **Round 1 context:** `round1/S43_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Measured word counts only as gates (no bulk prose generation).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Verified integrity traps (starter path ≠ solution path) on representative units across all 8 subtemas.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–6 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets weDo ~34–63 w (aceptable por spec “4 short bullets”); iDo ~50–65 w (varios bajo piso 80; legibles) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~18–39 w (bajo piso 40; no bloquear si pasos claros) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (predicado → assess valid/invalid/missing → decide CONTINUE/breach/INSPECT sobre texto Dockerfile/Compose/log/runbook/scan) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~10–12** unidades el retro **eco** del feedback (misma primera frase o mismo par incertidumbre/breach) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈18–33 w (spec 40–80); iDo peores 16–22 w (T2-B, T3-B, T4-A); principio + puente a menudo presentes; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **Feedback length** | Mayoría ~22–44 w; peores: T3-A-E2 (~19), T3-B-E2 (~21), T4-A-E2 (~22) | Residual **P2** leve |
| **iDo why** | T1-A/T1-B/T2-A/T4-A en ~40–50 w; T2-B (~33), T3-A (~36), T3-B (~36), T4-B (~35) bajo piso 40 | Residual **P2** |
| **E2 retrospective plantilla** | Patrón recurrente “X incertidumbre; Y breach. Error: leer campo. E3:…” en casi todos los E2 | Residual **P2** (anti-aberration de *forma*, no generador) |
| **Código/outputs** | Coherentes con theory y CASO-TRU-043; DEFECT `# DEFECT:` excelente; wrong ≠ right en traps verificados | **Sin** hueco de integridad |
| **youDo frame** | context CP-N4-A, objectives, requirements T1–T4, starter BLOCKED→READY, portfolioNote, retrospective de defensa (~79 w) | Pass — **A** |
| **Naming `llmops`** | Archivo/id siguen diciendo llmops; jobRelevance ya aclara contenedores | Residual documentado; fuera de prosa de ejercicios |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check, iDo why/retro bajo piso, plantilla E2). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish selectivo**, no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina) |
| **D** | Falla el test de true-newbie en un ítem crítico |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S43-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido de layers: `pip_before_app True`, digest estable, `cache stable_layers_first`. Preamble pide predicción y ancla “commit solo a src no re-resuelve pip”. `why` (~50 w) en rango. Retro (~50 w) repara “culpar al registry” y puente a `REORDER_DOCKERFILE`.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: preamble ~63 w → +1 frase “sin daemon Docker”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S43-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `S43-T1-A PASS`; instruction nombra DEFECT invertido; feedback razona rebuilds=1 y adverso de E2; retro (~33 w) con principio + puente E2, sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Deps antes de app es el mínimo de un Dockerfile cacheable: el lock fija la capa; el source no debe invalidarla. El error clásico es invertir el predicado o exigir rebuilds altos como “éxito”. Pregunta: si solo cambia `src/`, ¿qué capa debe reutilizarse y por qué el digest de deps no cambia? Siguiente (E2): enrutar válido, desorden y `digest_stable` ausente.
- **Code/output changes:** none

### S43-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas exactas; schema-first en preamble. Feedback y retro se solapan en “MISSING antes que REORDER / no leer digest” (eco). Retro ~32 w.
- **Checklist:** all pass; feedback/retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un gate de build honesto primero exige el schema y solo después juzga el orden de layers. El error clásico no es solo KeyError: es mezclar “falta evidencia” con “breach de orden” y mandar al equipo al runbook equivocado. Pregunta: si `digest_stable` falta, ¿por qué no inventar `True` “porque el lock se ve igual”? Luego (E3): CONTINUE / REORDER / INSPECT sobre texto de Dockerfile.
- **Code/output changes:** none

### S43-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer real a texto; límite “sin daemon” en preamble. Feedback y retro alineados pero retro añade pregunta self-check — usable. Retro ~37 w (casi piso).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: subir retro a 40–50 w)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S43-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Auditoría non-root clara (UID 10001, base pinned, 118≤150). Preamble y `why` útiles. Retro (~32 w) corta: repara UID 0 pero sin self-check ni ancla de `latest`.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Non-root + base fijada + techo de MB es el trío mínimo de runtime: privilegio, parchabilidad y superficie. El error clásico es aceptar UID 0 “porque en local funciona” o `latest` “porque siempre actualiza”. Pregunta: si el tag flota, ¿qué evidencia de parche pierdes ante un CVE? We Do: predicado de non-root y tamaño.
- **Code/output changes:** none

### S43-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Guiado limpio; feedback con ancla Trujillo. Retro (~27 w) y preamble (~45 w) cortos; usable.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Privilegio mínimo se audita con números (UID, MB, caps), no con “confiamos en el equipo”. El error clásico es `USER root` o base flotante disfrazada de “arranque OK”. Pregunta: ¿por qué `capabilities` no vacías fallan aunque el UID sea 10001? E2: válido / root+caps / `max_mb` ausente.
- **Code/output changes:** none

### S43-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS / REBUILD / MISSING:max_mb. Eco fuerte feedback↔retro en “max_mb / no pass silencioso”.
- **Checklist:** all pass; eco
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin techo de tamaño eliges base “a ojo”: SELECT no es castigo, es pedir criterio. El error clásico es rellenar 150 en silencio porque el lab lo usó. Pregunta: si el runtime mide 490 MB, ¿es breach de presupuesto o incertidumbre de schema? Luego (E3): parsear `USER`/`FROM` en texto de Dockerfile.
- **Code/output changes:** none

### S43-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a USER/FROM; self-check sobre `latest` en retro. Feedback ~24 w (piso). Discrimina well.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: expand feedback 1 frase sobre digest)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S43-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Demo limpia de capas sin SECRET= y db durable. Preamble buena. Retro (~20 w) **demasiado corta**: principle + bridge, sin self-check ni profundidad de rotación.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Imagen limpia + mounts clasificados = rotación y recovery posibles sin rebuild de app. El error clásico es copiar `.env` al build o montar la DB como tmp “para ir más rápido”. Pregunta: si rotas la clave de DB, ¿qué falla si el valor quedó en una capa de history? We Do: gate `REMOVE_BAKED_SECRET`.
- **Code/output changes:** none

### S43-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT bien nombrado; feedback con ancla de rotación. Retro (~21 w) es telegráfica.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Runtime injection es el hábito que permite rotar sin reempaquetar la API de Trujillo. El error clásico es `ENV KEY=valor` en Dockerfile o DB en volume efímero. Pregunta: ¿qué se rompe primero al redeploy si `db` está en ephemeral: la app o los datos? E2: válido / secret+db efímero / `ephemeral_volumes` ausente.
- **Code/output changes:** none

### S43-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Feedback y retro casi clones (“CLASSIFY / REMOVE / no rellenar ephemeral”).
- **Checklist:** all pass; eco fuerte
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Separar incertidumbre de mounts (CLASSIFY) de breach de contenido (REMOVE) evita dos runbooks confusos en el mismo incidente. El error clásico es “inventar” `{"cache"}` para no ver MISSING. Pregunta: en un redeploy agresivo, ¿qué volume puedes borrar sin pedir backup? Luego (E3): inspeccionar strings de history sintético.
- **Code/output changes:** none

### S43-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer a capas+mounts; self-check de rotación en retro. Eco feedback/retro en “History legible / SECRET= demo”.
- **Checklist:** all pass; eco
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un `SECRET=sk-demo` “porque es lab” enseña el mismo reflejo que un secret real en capas: history lo delata y rotar exige rebuild. El error clásico es CONTINUE con db en ephemeral “si no hay SECRET=”. Pregunta: ¿por qué rotar un secret horneado siempre es más caro que un mount de runtime? Ese hábito se reutiliza en el You Do al firmar el artefacto de secrets.
- **Code/output changes:** none

---

### S43-T2-B-DEMO (iDo) — **C**
- **Diagnosis:** Demo de readiness 200/503 y SIGTERM grace 30. Preamble clara. `why` (~33 w) y **retro (~16 w)** bajo piso: casi solo “503 es honestidad / We Do”. Falta misconception y self-check.
- **Checklist:** context/goal/success pass · retrospective **partial**
- **Severity residual:** P2 (prioridad alta dentro de P2 iDo)
- **Proposed why (expand if touched):**  
  Readiness ≠ liveness: un proceso puede estar vivo y aún no listo para tráfico. El grace medible evita trabajo a medias en redeploy. No hardcodees `graceful=True`: se deriva de cola vacía y `grace_seconds ≥ 20`. Un 200 con DB caída miente al orquestador.
- **Proposed retrospective (replace):**  
  503 con DB caída es honestidad operativa: el orquestador deja de enviar tráfico. El error clásico es `/readyz` siempre 200 o kill abrupto sin drain. Pregunta: si `live=true` pero `ready=false`, ¿qué probe debe fallar y por qué no matas el proceso aún? We Do: gate `DRAIN_AND_ISOLATE`.
- **Code/output changes:** none

### S43-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Instruction muy corta (~22 w) pero nombra DEFECT; feedback con redeploy Trujillo. Retro ~28 w usable.
- **Checklist:** all pass; inst/retro short
- **Severity residual:** P2
- **Proposed residual:** none required if Fixer only touches peores; optional expand retro with self-check “¿grace 15 s es suficiente para tu SLO de requests?”
- **Code/output changes:** none

### S43-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Rutas correctas. Retro (~17 w) y feedback se solapan en DIAGNOSE/DRAIN; plantilla E2.
- **Checklist:** all pass; eco + longitud
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin grace documentado no sabes si el apagado fue limpio o un kill con otro nombre. El error clásico es inventar 30 s “porque el demo lo usó”. Pregunta: ¿qué evidencia pedirías en el runbook además del número de grace? Luego (E3): parsear log de probes sintético.
- **Code/output changes:** none

### S43-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer a log rico; feedback razona 200+db caída. Eco con retro en “mentira operativa”.
- **Checklist:** all pass; eco
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un 200 con `db_ok=false` es mentira operativa: el orquestador llena de tráfico una API ciega. El error clásico es confiar en `live=true` como ready o en grace 0 como “drain simbólico”. Pregunta: ¿por qué grace 0 no cuenta aunque `drained=true` esté hardcodeado en el log? Ese criterio viaja al You Do al documentar SIGTERM.
- **Code/output changes:** none

---

### S43-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Stack healthy + retries + redes. Preamble “YAML no basta”. `why` (~36) y retro (~22) cortos.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Stack sano = healthy == services + retries de app + redes segmentadas, no “compose up sin error en la consola”. El error clásico es confiar solo en `depends_on` cuando DB reinicia a mitad de tráfico. Pregunta: si api y cache están healthy pero worker no, ¿es stack limpio? We Do: `STOP_UNHEALTHY_STACK`.
- **Code/output changes:** none

### S43-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Guiado correcto; feedback con ancla “comando limpio miente”. Retro ~26 w.
- **Checklist:** all pass
- **Severity residual:** P2 (retro short)
- **Proposed retrospective (expand):**  
  Retries de aplicación son código de la API (backoff), no magia de Compose ni `restart_policy` del orquestador. El error clásico es healthy solo en db y declarar el stack “OK”. Pregunta: ¿qué token en el YAML demuestra retries de app y no solo orden de arranque? E2: válido / half healthy / networks ausente.
- **Code/output changes:** none

### S43-T3-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Rutas correctas. Feedback (~19 w, bajo piso) y retro (~20 w) eco plantilla WAIT/STOP + “leer networks”.
- **Checklist:** all pass; feedback/retro **weak**
- **Severity residual:** P2 (prioridad alta en cluster E2)
- **Proposed feedback (expand):**  
  WAIT_FOR_DEPENDENCY es incertidumbre de topología (sin mapa de redes no sabes a quién esperar). STOP cierra stack half-healthy o sin retries. No inventes `front`/`back`: el compose debe declararlas o el “un comando limpio” de Trujillo es teatro.
- **Proposed retrospective (replace):**  
  Schema de redes antes de contenido evita perseguir un worker “unhealthy” cuando en realidad no sabes la topología. El error clásico es rellenar redes default y aprobar. Pregunta: si solo existe la red `default`, ¿qué exposición de DB no puedes acotar? Luego (E3): auditar texto de compose.yaml.
- **Code/output changes:** none

### S43-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer YAML excelente (DB_MAX_ATTEMPTS). Eco feedback/retro en depends_on. Self-check en retro ayuda.
- **Checklist:** all pass; eco leve
- **Severity residual:** P2
- **Proposed residual:** none required if T3-A-E2 is fixed first; optional diversify retro to emphasize portfolio YAML vs set Python
- **Code/output changes:** none

---

### S43-T3-B-DEMO (iDo) — **C**
- **Diagnosis:** expand_contract + restore. Retro (~17 w) y why (~36) delgados; misconception “db como efímero” apenas nombrado.
- **Checklist:** retrospective **partial**
- **Severity residual:** P2 (prioridad alta iDo)
- **Proposed retrospective (replace):**  
  Migración sin restore drill es fe en el vacío: el rollback no se ha ensayado. El error clásico es tratar la DB como efímero o hacer contract con código viejo vivo. Pregunta: si el backup nunca se restauró en lab, ¿qué afirmas en el release notes? We Do: `ROLL_BACK_MIGRATION`.
- **Code/output changes:** none

### S43-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT contract incompatible bien; feedback con release a ciegas. Retro ~25 w.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Expand/contract es disciplina de compat con código en producción, no jerga de DBA. El error clásico es borrar columnas con código viejo vivo o marcar restore True sin drill. Pregunta: ¿qué pasa si `migration=="contract"` y `old_code_compatible` es False en un rolling deploy? E2: válido / contract malo / `backup_restored` ausente.
- **Code/output changes:** none

### S43-T3-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Rutas correctas. Instruction ~18 w; feedback ~21; retro ~18 — plantilla E2 mínima, eco RUN_RESTORE/ROLL_BACK.
- **Checklist:** all pass; quality **weak**
- **Severity residual:** P2 (prioridad alta E2)
- **Proposed feedback (expand):**  
  RUN_RESTORE_DRILL es incertidumbre: sin flag no apruebas recuperación. ROLL_BACK cierra contract sin compat o sin reset de efímeros. No inventes PASS de restore: el drill debe ejecutarse y documentarse en el runbook de Trujillo.
- **Proposed retrospective (replace):**  
  Un release con restore “asumido” no es reproducible: no hay evidencia de recovery. El error clásico es leer `backup_restored` antes del check de schema y tumbar el assess. Pregunta: si el adverso trae `ephemeral_reset=False`, ¿qué datos estás a punto de tratar como desechables? Luego (E3): auditar runbook de texto.
- **Code/output changes:** none

### S43-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer runbook rico; self-check sobre db ephemeral. Eco con feedback en restore SKIPPED.
- **Checklist:** all pass; eco
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un restore SKIPPED no es deuda menor: es no-go de promoción. El error clásico es aprobar contract sin compat o `ephemeral: db` “porque el compose es de lab”. Pregunta: ¿por qué db en ephemeral rompe el rollback aunque el strategy diga expand? Ese criterio se defiende en el You Do del runbook.
- **Code/output changes:** none

---

### S43-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** multi-stage + lock sha256. Retro (~17 w) corta; why en rango (~40).
- **Checklist:** retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Runtime mínimo + lock hasheado = build repetible entre máquinas y días. El error clásico es tag `latest` en deps o dejar `gcc` “por si depuramos” en la imagen final. Pregunta: si el lock flota, ¿qué garantiza el digest de mañana vs hoy? We Do: `BLOCK_UNPINNED_BUILD`.
- **Code/output changes:** none

### S43-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Guiado correcto; feedback con supply chain Trujillo. Retro ~26 w.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** optional expand retro with self-check “¿qué viaja a prod si solo hay stage runtime con apt install gcc?”
- **Code/output changes:** none

### S43-T4-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Rutas correctas. Feedback ~22, retro ~18, plantilla REGENERATE/BLOCK sin ancla de supply chain.
- **Checklist:** all pass; weak prose
- **Severity residual:** P2 (prioridad alta E2)
- **Proposed feedback (expand):**  
  REGENERATE_LOCK es incertidumbre de pin: sin `runtime_deps_locked` no inventes `sha256:`. BLOCK cierra latest, un solo stage o compiler en runtime. En Trujillo un build flotante hoy no es el de mañana aunque el Dockerfile “se vea igual”.
- **Proposed retrospective (replace):**  
  Regenerar el lock con evidencia es distinto de bloquear un breach de toolchain en la imagen final. El error clásico es hardcodear `sha256:abc` del demo. Pregunta: si solo existe stage `runtime` con gcc, ¿qué superficie y qué reproducibilidad pierdes? Luego (E3): parsear multi-stage real en texto.
- **Code/output changes:** none

### S43-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer multi-stage limpio; self-check sobre latest. Eco feedback/retro en toolchain.
- **Checklist:** all pass; eco
- **Severity residual:** P2
- **Proposed residual:** none required if E2 fixed; optional tighten retro to “COPY --from como puente” vs solo “un solo stage”
- **Code/output changes:** none

---

### S43-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Gate deploy 0 CVE / 512 / 1.0 / sin shell. Retro (~20 w) corta; why ~35 bajo piso.
- **Checklist:** why/retro partial
- **Severity residual:** P2
- **Proposed why (expand if touched):**  
  El contrato es `0 < mem ≤ 512` y `0 < cpu ≤ 1.0`: el valor 0 no es “sin tope válido”, es unlimited disfrazado. Un shell de debug permanente es breach. Scan limpio no basta sin límites acotados; el gate se llama `QUARANTINE_IMAGE` cuando falla.
- **Proposed retrospective (expand):**  
  Scan + límites + sin shell root = permiso de deploy hacia S44. El error clásico es CVE “después lo parcheamos” o mem 0 “para no OOM en lab”. Pregunta: ¿por qué mem 0 y CRITICAL>0 comparten el mismo no-go? We Do: `QUARANTINE_IMAGE`.
- **Code/output changes:** none

### S43-T4-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Gate invertido completo bien andamiado; feedback con promoción vacía. Retro ~25 w pero misconception “límite 0” claro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: +self-check en retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S43-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Rutas correctas. Retro ~20 w plantilla TRIAGE/QUARANTINE.
- **Checklist:** all pass; plantilla E2
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin evidencia de logs redactados no trias un finding sin filtrar secretos/PII. El error clásico es inventar `logs_redacted=True` para pasar el assess. Pregunta: si el adverso trae mem=0 y 3 CVE, ¿por qué un solo código de breach basta? Luego (E3): parsear reporte de scan en texto.
- **Code/output changes:** none

### S43-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a reporte CI; self-check mem 0 vs CVE. Eco leve con feedback. Cierre fuerte de sección.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: diversify first sentence vs feedback)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context Governed Python Service Platform / Trujillo, objectives medibles, requirements alineados a T1–T4, starter BLOCKED→READY con tres rutas normal/breach/uncertain, portfolioNote que prohíbe True sin archivo, rubric con pesos. Retrospective (~79 w) de defensa post-build con (1) evidencia CP-N4-A, (2) secretos reales vs sintéticos, (3) frase de impacto + residual k8s — cumple checklist de You Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required (no tocar portfolioNote ni READY pedagogy)
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** No hay campos ausentes ni integrity traps wrong≈right.

### P1
- **Ninguno bloqueante.** Sección usable end-to-end para learner Master con escena de Trujillo.

### P2 (polish selectivo — orden sugerido)

**A. iDo retrospectives (y why donde aplica) — peores primero**
1. S43-T2-B-DEMO (retro ~16 w + why bajo)
2. S43-T3-B-DEMO (retro ~17 w)
3. S43-T4-A-DEMO (retro ~17 w)
4. S43-T2-A-DEMO (retro ~20 w)
5. S43-T4-B-DEMO (retro ~20 w + why bajo)
6. S43-T1-B-DEMO, S43-T3-A-DEMO (retro ~22–32 w)

**B. We Do E2 (romper plantilla incertidumbre/breach + eco feedback)**
1. S43-T3-A-E2, S43-T3-B-E2, S43-T4-A-E2 (feedback/retro más débiles)
2. S43-T1-A-E2, S43-T1-B-E2, S43-T2-A-E2, S43-T2-B-E2, S43-T4-B-E2

**C. We Do E1 retros cortas (si queda presupuesto)**
- S43-T2-A-E1, S43-T1-B-E1, S43-T3-B-E1, S43-T1-A-E1

**D. We Do E3 eco feedback/retro (solo si se toca el subtema)**
- S43-T2-A-E3, S43-T2-B-E3, S43-T3-B-E3, S43-T4-A-E3 — preferir **reemplazar retro**, no alargar feedback

**No tocar salvo regresión:**
- Código, outputs, asserts, DEFECT comments, fixtures CASO-TRU-043
- youDo (ya A)
- Titles weDo (ya en rango)
- Hints (template E1 aceptable en guided)

---

## Residual risks

1. **Plantilla E2 residual:** si el Fixer “rellena” las 8 retros E2 con la misma fórmula ampliada, el eco de *forma* persiste. Variar ancla de dominio (caché / privilegio / rotación / grace / redes / restore / lock / logs).
2. **Carga cognitiva:** no duplicar preamble en instruction; instructions cortas son feature, no bug.
3. **Salidas exactas:** pedagogía solo verbal; no execute-and-diff salvo justificado.
4. **Stdlib sin Docker:** E3 ya dice “texto sintético” en varios; al tocar preambles de T1-A/T1-B/T3-A/T4-A, conservar esa línea.
5. **Naming `llmops`:** confusión de navegación residual; fuera de scope de campos de ejercicio.
6. **Master vs newbie:** no diluir rigor de DEFECT al expandir retros; expandir metacognición, no pistas de solución.
7. **Feedback actual:** si solo se reescriben retros, el residual de feedback corto en E2 es aceptable.
8. **youDo READY:** no “ayudar” marcando evidence True en el starter.

---

## Counts summary for Fixer R2

| Tipo | Unidades | Coverage R1 | Residual R2 |
|------|----------|-------------|-------------|
| iDo | 8 | preamble+why+retro presentes | ~6 retros cortas; ~4 why bajo piso |
| weDo | 24 | title+preamble+instruction+feedback+retro | ~10–12 eco feedback/retro; cluster E2 plantilla; retros 18–33 w |
| youDo | 1 | frame + retro defensa | **none** |
| **P0/P1** | — | — | **0** |
| **Código/outputs** | 33 | intactos | **sin cambios** |

**Veredicto:** S43 está **pedagógicamente operativa** post Round-1. Round-2 pide **pulido selectivo** (retros iDo delgadas, diversificar E2, romper eco feedback/retro), no reintroducir campos ni reescribir 24 preambles.

---

Section 43 exercise pedagogy review complete. Ready for the Fixer prompt.
