# S12 Exercise Pedagogy Report (Round 2)

## Section
- **title:** APIs, SQL y geodatos responsables
- **shortTitle:** APIs · SQL · Geo
- **id:** `performance` (archivo `s12-performance.ts`; contenido = HTTP mock + SQLite + geoevidencia)
- **index:** 12
- **source:** `src/lib/course/sections/s12-performance.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A status/JSON · T1-B timeout/paginación/retry · T2-A auth/caché/provenance · T2-B contract/fallback · T3-A esquema/CRUD/join · T3-B parámetros/tx/índices · T4-A normalize/geocoder/egress · T4-B coords/Haversine/señal
- **hilo:** CASO-LIM-012 / incremento **CP-N1-C** → puente dashboard S13
- **Round 1 context:** `round1/S12_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; no rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Executed two integrity traps live: (1) T4-B-E2 starter Haversine `*111` vs assert de tolerancia; (2) T3-B-E2 starter sin `rollback` → `COUNT(*)==1`.
- Scored for a **true newbie** (what / why / success / what sticks), independent of Round-1 proposals.
- No generators, bulk templates, or source edits. Word counts measured only as gates.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–10 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | Casi todos weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass en estructura; algunos bajo 80 palabras (aceptable en bullets) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass |
| **E1→E2→E3 fade** | Superficies distintas por subtema (status→parse→tabla; token→caché→provenance; normalize→mock→egress; etc.) | Pass — no clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el error; en **6+** unidades el retro **repite** el feedback casi literal | Residual **P2** sistemático |
| **Retrospective length** | Mediana ≈26 palabras (spec 40–80); principio+puente suelen estar, a veces falta misconception o self-check | Residual **P2** |
| **Código/outputs** | Intactos; DEFECT bien nombrados; política N1 coherente con theory | **Un hueco de integridad de aprendizaje:** T4-B-E2 |
| **youDo frame** | context denso CP-N1-C, objectives, requirements, smoke `main()`, rubric, portfolioNote, retrospective de defensa | Pass |

**Net:** Round 1 cerró el vacío sistemático de prosa. Round 2 no es rubber-stamp: la sección está **lista para learner** en ~90% de unidades; residuales son **calidad** (eco feedback/retro, retros cortas) y **un defect de integridad** en Haversine (starter casi pasa el assert).

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

### S12-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido. Preamble fija escena `CASO-LIM-012`, orden status→JSON y pide predicción de `status`/`count`/`kinds`. `why` (~55 w) explica por qué el mock aísla el contrato. Retrospective: hábito del adaptador + “asumir 200” + puente We Do. Description aún rica; no choca con preamble.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (P2 opcional: +1 frase en retro si `status≠2xx` el body de error no son items)
- **Proposed residual:** none required
- **Code/output changes:** none

### S12-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Modelo We Do post-fix: title claro; bullets con éxito dual exacto; instruction nombra DEFECT `(200, {})`; feedback repara “404 = crash”; retro distingue missing vs error de red. Starter pedagógico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T1-A-E2 (weDo, independent) — **B+**
- **Diagnosis:** Parse estricto bien enmarcado (extras, incompleto→`None`). Instruction independiente. Feedback y retrospective se solapan en “fail-closed / no contaminar score”.
- **Checklist:** all pass; retro partial (eco del feedback)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Whitelist de claves = contrato de entidad hacia el almacén. El error clásico es `return payload` “porque ya vino 200”. Pregunta: ¿qué pasa con `extra` si lo guardas en SQLite? Luego (E3): tabla status→acción **antes** de mirar el body.
- **Code/output changes:** none

### S12-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a política N1; starter confunde 429/500 y omite 503. Éxito línea a línea explícito; límites anclan “500 no es retry **en ejercicios**”. Self-check en retro. Buen puente a `should_retry`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T1-B-DEMO (iDo) — **A**
- **Diagnosis:** Paginación + pausas entre páginas. Preamble enseña por qué `rate_limit_pauses=2` con 3 páginas. Retrospective repara “sleep por página leída”. Excelente misconception ped.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Comparación invertida en starter — defect guiado claro. Éxito `ok`/`timeout`; igualdad documentada. Feedback traduce a `urlopen(..., timeout=5)`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T1-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Solo primera página en starter; meta aplanar; constraint “no hardcodear 2 páginas”. Instruction E2-apropiada. Retro: contrato del proveedor manda.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** `should_retry` selectivo; starter `>= 400` es misconception profesional real. Alineado con T1-A-E3. Feedback nombra “cualquier error se reintenta tres veces”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** Provenance sin token; predicción de claves y `token_logged False`. `why` ancla CP-N1-C y `body_sha12`. Retro internaliza “secreto fuera de la traza”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Fail-closed de token; DEFECT `""`; runner con try/except. Feedback razona 401 en cascada. Retro con pregunta de metacognición (valor vs presencia).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Hit/miss de caché correcto. Feedback y retrospective abren casi igual (“Caché de GET reduce latencia y cuota…”). El learner no gana un cierre nuevo.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Hit/miss es el contrato mínimo del cache de GET del adaptador. El error clásico es cachear un 5xx o un POST “porque la URL se repite”. Pregunta: ¿qué imprime el segundo get a `u1` y por qué? Luego (E3): provenance con `cache_hit` **honesto**.
- **Code/output changes:** none

### S12-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cuatro campos fijos; starter omite status/cache_hit; constraint “nunca token”. Instruction pide verificación mental de secretos. Transfer limpio.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Online vs offline_fallback, mismas coords, traza distinta. “Falla suave, traza dura” en retro. Contract precalc visible.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Contract test fuerte (sorted missing). Feedback y retro repiten “assert rojo en CI / no rellenes lon=0”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El contract test fija el schema del proveedor **antes** de pintar el mapa. El error clásico es rellenar defaults silenciosos (`lon=0`) para “que no falle”. Siguiente: degradar a body local en 5xx sin mentir el modo (E2).
- **Code/output changes:** none

### S12-T2-B-E2 (weDo, independent) — **A**
- **Diagnosis:** 5xx → offline; starter always online. Éxito dual claro; constraint no reescribir status a 200. Buen puente a runbook E3.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Código delgado (`live_api`/`local_file`); preamble carga el porqué (CI/entrevistas/CP-N1-C) como pedía R1. Hints casi entregan el if — aceptable en E3 corto si el valor es el flag de operación. Riesgo residual: se sienta relleno si el learner ya internalizó E2.
- **Checklist:** all pass
- **Severity residual:** P2 (no borrar; no alargar código)
- **Proposed residual:** Opcional +1 línea en retro: “Este flag es el mismo interruptor del smoke offline del You Do.” No tocar output.
- **Code/output changes:** none

### S12-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Join triple → ficha `case_row` para S13. Preamble pide predicción y ancla FKs. `why` avisa placeholders en We Do aunque el demo use literales — honesto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** CREATE débil + sin INSERT; meta count `1`; placeholders y NOT NULL en límites. Feedback documenta modelo sin FK física.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** CRUD completo con `?`; éxito `Ana Q` luego `0`. Feedback y retro abren con la misma frase “CRUD parametrizado es la base del almacén…”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  UPDATE/DELETE con `?` es la misma disciplina que el SELECT del join: el id nunca se interpola. El error clásico es borrar “a mano” con f-string “porque el id es sintético”. Luego (E3): unir clients y evidence **sin** mezclar C002.
- **Code/output changes:** none

### S12-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer fuerte: starter lista todos los kinds (incluye C002). Éxito `['geo','phone']`. Feedback nombra “ORDER BY no excluye C002”. Excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** Batch atómico DOC1 duplicado → `atomic_rollback` + count 0. Preamble compliance (“dos filas huérfanas peores que fallo ruidoso”). Retro: si ves count 2, olvidaste rollback.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Inyección clásica con f-string; input `C001' OR '1'='1'`; éxito `None`. Feedback razona dato vs SQL. Alto impacto ético/compliance. Hints no spoilean más de lo necesario en E1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Defect real verificado: sin rollback, `COUNT(*)==1`; con rollback, `0`. Instruction clara. **Feedback y retrospective son casi idénticos** (misma oración de atomicidad/filas huérfanas) — el cierre no añade metacognición.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tras `IntegrityError`, el siguiente `SELECT` solo es confiable si hiciste `rollback`. El error clásico es `except: pass` y creer que “al menos quedó C001”. Pregunta: ¿qué imprime el starter roto vs la solución? Luego (E3): índice en `document_id`.
- **Code/output changes:** none  
- **Validation notes:** Starter roto es **pedagógicamente correcto** (count 1). No “arreglar” el starter.

### S12-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** CREATE INDEX + PRAGMA; éxito sorted con autoindex de PK. Límites de nombre exacto. Puente a T4 geo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** Mock Lima/Arequipa/Iquitos→None; fail-closed y sin PII. Retro evita basura en score S13.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Normalize solo espacios (sin `.title()`) — alineado a contrato N1. Instruction E1 nombra `re.sub` (aceptable en guided). Feedback≈retro sobre title-case.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Colapsar espacios baja misses del mock **sin** inventar distrito/ubigeo. El misconception es “normalizar = `.title()` siempre”. Pregunta: ¿el string del fixture cambia de capitalización? Siguiente: MockGeocoder con `None` en desconocida (E2).
- **Code/output changes:** none

### S12-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Starter always Lima (ignora ciudad); éxito lat + Cusco `None`. Feedback “inventar coords es peor que None”. Transfer de interfaz intercambiable bien dicho.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Allowlist de egress; starter always True; `document_id` → False. Preamble carga cumplimiento CP-N1-C. Feedback: cualquier clave extra bloquea. Retro con pregunta de You Do. Unidad ética de referencia.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** ~8.95 km empaquetado con `verdict: None` + disclaimer. Retro de defensa en 20 s. Línea ética del capstone clara.
- **Checklist:** all pass
- **Severity residual:** P2 opcional — alinear vocabulario `verdict` (demo) vs `kinship_verdict` (E3/youDo) en una frase del retro o del why, **sin** unificar outputs sin re-ejecutar
- **Proposed residual (optional one sentence in retrospective):**  
  “En el We Do el campo se llama `kinship_verdict`; el contrato es el mismo: siempre `None`.”
- **Code/output changes:** none (no renombrar outputs sin smoke)

### S12-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Solo lat en starter; lon 181 y lat 91; no corregir a 0,0. Feedback Golfo de Guinea excelente. Cuatro pares de éxito explícitos.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-T4-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Meta Haversine R=6371; starter `abs(d_lon)*111`. **Integridad de aprendizaje (verificado en runtime):**
  - Starter imprime `111.0` y **`assert abs(d - 111.19) < 1` pasa**.
  - Solution imprime `111.19` y también pasa.
  Si el learner (o un grader laxo) se fija solo en el assert + `tolerance_ok`, el atajo euclídeo “gana”. El éxito del preamble sí pide `111.19`, pero el assert del starter **no distingue** wrong de right.
- **Checklist:** context pass · goal pass · success partial (assert engañoso) · constraints pass · retrospective partial (eco del feedback)
- **Severity residual:** **P1**
- **Proposed residual improvements:**
  1. **Endurecer el assert del starter/solution** (preferido, toca código):  
     `assert abs(d - 111.19) < 0.05`  
     o exigir `round(d, 2) == 111.19` antes de imprimir `tolerance_ok`. Así el `*111` falla de verdad.
  2. **O** cambiar el par de prueba a un caso no-ecuatorial (p. ej. Lima–Callao ≈ 8.95) donde `*111` no cae en tolerancia de 1 km — solo si se re-ejecuta y se actualiza output.
  3. **Prosa (si no se toca assert aún):** en preamble/instruction dejar explícito:  
     “Éxito = imprimir **`111.19`** (no `111.0`); el assert de ±1 km es red de seguridad, no el criterio único.”
- **Proposed retrospective (replace, aparte del assert):**  
  Haversine esférico es la geoseñal del caso; el atajo `*111` solo “casi funciona” en el ecuador y falla en regresión. Pregunta: ¿qué imprime `round(d, 2)` con el starter roto? Luego (E3): empaquetar km como señal **sin** kinship.
- **Code/output changes:** **yes — recommended:** endurecer assert/print contract (execute-and-diff del unit). No cambiar la fórmula canónica ni R=6371.

### S12-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** DEFECT ético `kinship_verdict: True` → `None`. Preamble ancla score S13. Feedback: señal ≠ prueba. Retro de entrevista 30 s + puente You Do. Cierre limpio del hilo geo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S12-youDo (youDo) — **A−**
- **Diagnosis:** Marco de proyecto maduro: context CP-N1-C, objectives, requirements, starter con stubs `NotImplemented` + smoke `main()`, rubric por pesos, portfolioNote con 3 capturas alineadas a la retrospectiva. Retrospective de defensa (3 preguntas) presente y accionable. Carga cognitiva alta (12+ stubs) — mitigada por smoke path y portfolioNote, no por más essay.
- **Checklist:** context pass · goal pass · success pass (rubric + smoke) · constraints pass · retrospective pass
- **Severity residual:** P2 opcional
- **Proposed residual:** Micro-gancho al final de `context` (una frase):  
  “Antes de marcar listo, responde las tres preguntas de la retrospectiva y alinea las capturas del portfolioNote.”  
  No reescribir context/rubric/starter.
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P1 (integridad / éxito observable)
1. **S12-T4-B-E2** — endurecer assert o criterio de print para que el atajo `*111` **falle** (hoy pasa `abs(d-111.19)<1`). Actualizar instruction/preamble si el assert cambia; re-ejecutar unit.

### P2 (calidad de prosa — feedback ≠ retrospective; longitud)
2. **S12-T2-A-E2, S12-T2-B-E1, S12-T3-A-E2, S12-T3-B-E2, S12-T4-A-E1** — reescribir `retrospective` con texto propuesto (principio + misconception + self-check + puente; dejar feedback como razonamiento inmediato).
3. **S12-T1-A-E2** — retro distinta del feedback (whitelist / extras en SQLite).
4. **S12-T4-B-E2** — tras fix de assert, alinear retro (evitar eco “test de tolerancia…”).
5. **S12-T2-B-E3** — opcional +1 frase de puente al You Do offline flag.
6. **S12-T4-B-DEMO** — opcional una frase `verdict` vs `kinship_verdict`.
7. **youDo** — opcional micro-gancho a retrospectiva en `context`.

### No tocar (salvo regresión)
- Outputs canónicos de las demás 32 unidades.
- Política N1 (500 no retry en ejercicios).
- DEFECT de T3-B-E1 (f-string) y T3-B-E2 (pass sin rollback) — son el andamiaje correcto.
- Borrar T2-B-E3 por “delgado” — el valor es el runbook, no la longitud del código.

---

## Residual risks

1. **T4-B-E2 near-pass:** learner puede creer que `111.0` + assert verde = Haversine. Mitigar con assert más estricto o print-gated success.
2. **Feedback/retro clones:** varios units no separan “por qué falló ahora” de “qué me llevo”. Mitigar solo reescribiendo retro (no hinchar feedback).
3. **Carga del You Do:** muchos stubs; sin disciplina de smoke el learner “completa prints” sin narrativa de portafolio. Retrospective + portfolioNote ya mitigan; el micro-gancho ayuda.
4. **Vocabulario `verdict` / `kinship_verdict`:** autocontenido por unit, pero puede confundir al integrar en S13. No unificar outputs sin re-smoke.
5. **Hints E1:** varios casi-solución (aceptable en guided). No endurecer en masa en R2.
6. **500 vs retry en producción:** preambles ya dicen “contrato de ejercicios N1”; mantener esa frase si se toca prosa.

---

## Summary for Round-2 Fixer

| Block | Estado post-R1 | Acción R2 |
|-------|----------------|-----------|
| 24 weDo | title + preamble + instruction + feedback + retro **presentes** | 1× P1 integridad (T4-B-E2); ~6 retros con eco → reescribir a mano |
| 8 iDo | preamble + why + retro presentes y fuertes | Opcional 1 frase vocab geo en T4-B-DEMO |
| 1 youDo | retrospective de defensa OK | Opcional micro-gancho en context |
| Código/output | Casi todo intacto | **Solo** T4-B-E2: assert/print contract + execute-and-diff |

**Hand-written only. No generators.** Prosa residual lista unidad por unidad arriba.

---

Section 12 exercise pedagogy review complete. Ready for the Fixer prompt.
