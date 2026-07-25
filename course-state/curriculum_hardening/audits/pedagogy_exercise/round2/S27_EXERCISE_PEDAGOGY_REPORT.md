# S27 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Estrategia de pruebas con pytest
- **shortTitle:** Pytest y contratos
- **id:** `async-concurrency` (archivo `s27-async-concurrency.ts`; contenido = contratos pytest / CP-N3-A sobre normalización y matching sintético — **no** async/await ni hilos)
- **index:** 27
- **source:** `src/lib/course/sections/s27-async-concurrency.ts` (re-leído **después** del fix Round-1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A riesgo/pirámide · T1-B AAA/oráculos · T2-A discovery/asserts/parametrize · T2-B fixtures/scopes · T3-A isclose/raises/tmp · T3-B negativos/mensajes · T4-A cobertura de ramas · T4-B mutación/regresión
- **hilo:** inicio **CP-N3-A** (run_id `cpn3a-01`; contactos sintéticos `@example.pe`; matching = misma entidad sintética, **nunca** fraude ni parentesco)
- **Round 1 context:** `round1/S27_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklists preamble/retrospective, fade E1→E3, anti-aberration).
- Manually re-inspected **every** `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` en el **source actual**: title, preamble, instruction, feedback, retrospective, starter `# DEFECT:`, solution/output, why.
- Verified integrity traps (starter stdout ≠ solution stdout) for all 24 We Do via execute; all solutions match canonical `output`.
- Scored residual quality for a **true newbie** (qué / por qué / éxito / qué queda) — la *presencia* de campos no basta.
- Word counts solo como gate de medición (sin generadores de prosa). Round-1 solo para no re-diagnosticar el vacío de campos.
- **Sin** ediciones de source. Propuestas residuales a mano.

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8); `why` ~40–58 w (floor OK) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is ordered steps (not essay) | **Met** (pasos 1–4; E1 nombra DEFECT) |
| You Do has `retrospective` of defense | **Met** (~82 w; fuerte: invariante, PII, impacto, ética) |
| E1→E2→E3 fade preserved (surfaces, not number clones) | **Met** (producto→ranking→capa; strip→pass→match; discovery→assert→tabla; deepcopy→scope→factory; isclose→raises→tmp; mensaje→email→f-string; hi/lo→non→%; mutante→falla→regression) |
| Starters, solutions, canonical outputs intact | **Met** (24/24 trap OK; p. ej. E1 `9`→`20`, E2 orden invertido, E3 `e2e`→`unit`) |
| Spanish PE; synthetic `@example.pe`; no real PII | **Met** |
| Filename/id `async-concurrency` vs contenido pytest | **Unchanged** (nota de repo, no de prosa de ejercicio) |

**Verdict:** Round-1 cerró el P0 sistémico “sin title/preamble/retrospective”. Round-2 **no** es rubber-stamp: la sección es **usable para learner** en la gran mayoría de unidades. Residuales = **calidad** (retros cortas, eco feedback↔retro en pares peores, preambles iDo bajo 80 w, un mismatch leve preamble/código en T1-A-DEMO). **No** hay P0 de campos ni de integridad wrong≈right.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **We Do retrospectives short** | **22/24** bajo 40 w (medidas ≈21–38); solo T2-A-E3 (42) y T1-A-E3 (38 borderline) se acercan al piso | Metacognición fina delgada; a menudo falta self-check distinto del feedback | **P1** tema de sección: expandir los peores ~10; no reescribir los 24 |
| **Feedback ≈ retrospective** | Peores pares (Jaccard tokens ≥5 letras): **T2-B-E2 (0.67)**, **T2-B-E3 (0.46)**, **T4-B-E3 (0.44)**, **T4-A-E1 (0.40)**, **T3-B-E3 (0.37)**, **T1-A-E2 (0.33)** | El bucle deliberate-practice colapsa: retro repite el bug en vez de principio + transferencia | **P1** en peores 4–6; **P2** en eco leve |
| **Feedback under 25 w** | ~14 unidades (T2-B-E1 14 w, T2-A-E2 16 w, T3-A-E3 17 w, …) | Corrective loop corto; a veces solo re-nombra el fix | **P2** (subir a 25–40 w donde se toque la unidad) |
| **I Do retrospectives short** | **7/8** bajo 40 w (T1-B 38 … T4-B/T2-B 30); solo T1-A-DEMO (56) cómodo | Bridge We Do existe; misconception a menudo 1 cláusula | **P2** (expandir los 4 más delgados si se tocan) |
| **I Do preambles under 80 w** | 8/8 en 55–72 w; responden “qué observar” | Riesgo cognitivo leve; no bloquean | **P2** opcional |
| **T1-A-DEMO preamble vs code** | Preamble dice “normalize → repo → UI”; código ordena `normalize`, `blocking`, `repo_sql` (sin UI) | Newbie predice UI y no la ve | **P2** (alinear una frase) |
| **T3-A-DEMO cognitive load** | Cuatro bordes en un demo; preamble ya guía la mirada | Carga alta residual de R1; no alargar código | **P2** (prosa de atención OK; no refactor) |
| **Hints E1 spoiling** | E1 hints a menudo dan la expresión exacta (`math.isclose(...)`, `deepcopy`) | Aceptable en guided; no es bug | — (no fix) |
| **You Do** | Marco + retrospective de defensa **sólidos** | Sin residual P0/P1 | — |
| **Code/outputs** | Coherentes; traps discriminan | **No** cambiar outputs canónicos | — |

**Net:** lista para learner con polish P1/P2. Prioridad Fixer R2 = **desenredar feedback/retro en peores pares** + **alargar retrospectives cortas con self-check**, no re-shell de campos.

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

### S27-T1-A-DEMO (iDo) — **B**
- **Diagnosis:** Ranking por `impact × likelihood` sólido; `why` en rango (~58 w); retro repara “número de tests” y puente We Do. Preamble pide predicción del orden y capa, pero nombra “UI al final” mientras el código muestra `normalize` / `blocking` / `repo_sql` (sin fila UI).
- **Checklist:** context pass · goal pass · success pass · constraints partial (UI anunciada, no en demo) · retro pass
- **Severity residual:** P2
- **Proposed preamble (replace, alinear áreas):**  
  Antes de escribir un solo `assert` del motor ER sintético, el equipo decide *dónde* gastar minutos de prueba. En esta demo se calcula score = impacto × probabilidad y se ordenan tres áreas: normalización, blocking y repo SQL. No escribas aún: predice el orden impreso y la capa del tope (`unit` vs `integration`). Si inviertes la pirámide con solo E2E de la cola de revisión, el `strip` roto llegará al clerical queue con confianza falsa — la UI ni siquiera aparece aquí porque su score pierde.
- **Code/output changes:** none

### S27-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Modelo post-fix limpio: title 6 palabras; bullets con éxito `20`; instruction nombra suma vs producto; feedback ancla cola del sprint; retro distinta (heurística + puente E2). Trap `9`→`20`.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~30 w → +self-check “¿qué score darías a un typo de log?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S27-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Orden ascendente vs descendente — excelente. Feedback y retro comparten “ordenar al revés = invertir la pirámide” (eco j≈0.33). Retro añade conversación del equipo y puente E3, pero reutiliza la misma frase.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El ranking descendente es la cola de conversación del sprint: primero lo que más duele si falla. El error clásico no es solo “orden al revés”, sino tratar el sort como adorno del README sin usarlo para repartir casos. Pregunta: si solo tienes una hora, ¿qué fila de `rows` cubres primero? Luego (E3) eliges la *capa* del área de mayor score.
- **Code/output changes:** none

### S27-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real `min`→`max` + capa; éxito `unit`; límites anti-min; retro con self-check al `risk_map` del You Do. Fade auténtico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** AAA con oráculo `"maría ríos"`; preamble “oráculo ≠ print”; `why` en rango; retro repara “ya imprimió bien”. Retro ~38 w (leve bajo 40); preamble ~63 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand ~+15 w):**  
  AAA con oráculo determinista es el esqueleto de todo contrato de `normalize_name`. El error clásico es “ya imprimió bien” sin assert que falle en CI. Pregunta sin mirar el código: ¿qué valor esperas si el raw trae dobles espacios? We Do: colapsar espacios de verdad, reportar `pass` solo si el assert vive, y comparar dos lados normalizados.
- **Code/output changes:** none

### S27-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Solo-strip vs casefold+split/join; feedback y retro se solapan en “strip no basta” pero retro eleva al contrato del motor y puente E2. Trap `' A  B '`→`a b`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Teatro de señal: assert OK + `print('fail')`. Pedagogía fuerte. Feedback y retro repiten “fail tras assert verde confunde” (eco conceptual).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La señal post-assert es un contrato de lectura humana y de log: o el proceso murió en el assert, o reportas `pass`. Inventar `fail` a mano es un falso negativo de confianza. Pregunta: si CI imprime `fail` pero el exit code es 0, ¿confías en el merge? Luego (E3): matching exacto normalizando *ambos* lados.
- **Code/output changes:** none

### S27-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Matching post-normalize + ética no-fraude en preamble/feedback. Retro eco leve de “compara entidades normalizadas” pero añade self-check You Do y misconception de parentesco. Transfer real.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (eco)
- **Proposed residual:** none required (self-check ya diferencia)
- **Code/output changes:** none

### S27-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Discovery `test_*` + node_ids; preamble pide predicción de `helper_exact`; `why` dual-track honesto. Retro ~33 w (corta) pero misconception + bridge claros.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Naming `test_*` es el contrato de discovery: sin prefijo, el runner real no lo corre y a las 2 a. m. no hay node id que re-lanzar. El error clásico es meter lógica de prueba en helpers que “parecen” tests. Pregunta: ¿cuántos casos reales hay si renombras ambos a `check_*`? We Do: filtrar la lista, distinguir ok/fail y aplicar oráculos fila a fila.
- **Code/output changes:** none

### S27-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Filtro `startswith('test_')`; éxito `['test_a','test_b']`; feedback y retro distintos (node id vs “nunca corren”). Trap limpio.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Teatro de verde `siempre ok` → `fail`. Feedback corto (~16 w). Retro útil (confianza falsa + puente tabla) pero short.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Un assert honesto distingue igualdad de desigualdad: con left≠right debe salir `fail`. Siempre imprimir `ok` es teatro de verde: el merge de normalización “pasa” aunque el oráculo esté roto.
- **Proposed residual retro:** opcional +self-check “¿qué imprimiría pytest rewrite con left y right?”
- **Code/output changes:** none

### S27-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Tabla estilo parametrize; starter compara crudo. Feedback y retro comparten “tabla que se *ejecuta*” (j≈0.31). Retro gana con “no copiar el cuerpo tres veces” y You Do.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cada fila `(raw, esperado)` es un caso conceptual en CI: si falla la fila 2, sabes qué raw rompió el oráculo. El error clásico es copiar el cuerpo del test tres veces o imprimir las tuplas sin evaluar. Pregunta: ¿añadirías casefold en esta tabla o lo dejas para el contrato real de `normalize_name`? En el You Do, cada oráculo de normalize debería ser una fila de esa tabla.
- **Code/output changes:** none

### S27-T2-B-DEMO (iDo) — **A−**
- **Diagnosis:** `deepcopy` + isolation; preamble predice `list.copy()` superficial. Retro ~30 w corta pero principle + misconception session claros.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual:** expand retro solo si se toca el bloque T2-B (añadir self-check: “¿qué vería el test B si `contacts_fx` devolviera `BASE` sin copiar?”)
- **Code/output changes:** none

### S27-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Shallow vs deep; feedback nombra dicts anidados; retro eleva a fixture function. Feedback corto (14 w) pero correcto. Trap `9`→`1`.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (feedback → 25+ w anclando flake de orden)
- **Proposed residual:** none required
- **Code/output changes:** none

### S27-T2-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Política de scopes — buen E2 conceptual. **Eco fuerte** feedback↔retro (j≈0.67): ambos “function default / session flakes de orden”. Metacognición casi nula distinta del fix.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retro **partial** (eco)
- **Severity residual:** **P1**
- **Proposed retrospective (replace):**  
  El mapa `safe_for_mutable` es una política de equipo, no un truco de API: si el fixture es lista de dicts, el default `function` es la respuesta segura. Session solo gana cuando el recurso es caro y **de solo lectura**. Pregunta: ¿pondrías un catálogo inmutable de umbrales en session? ¿Y la lista de contactos del caso? Luego (E3): factory que crea N entidades por caso.
- **Code/output changes:** none

### S27-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** `len(make(3))` vs hardcode `0`. Feedback y retro repiten “hardcodear no prueba la factory” (j≈0.46). Transfer real al You Do fixture.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2 (casi P1 por eco)
- **Proposed retrospective (replace):**  
  La factory es el hábito de “N entidades frescas por caso”: el assert mide el *resultado de crear*, no un literal mágico. Si hardcodeas `3`, un bug en `range(n)` o en los ids `c0..` pasa invisible. Pregunta: ¿qué imprimiría `len(make(0))` y por qué importa ese borde? En el You Do, un `@pytest.fixture` o factory similar alimenta los AAA de normalize/match.
- **Code/output changes:** none

### S27-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Cuatro bordes en un demo (carga alta residual R1). Preamble guía floats/reloj; `why` y retro cubren misconception `==`/now. Retro ~37 w. No alargar código.
- **Checklist:** context pass · goal partial (cuatro skills) · success pass · constraints pass · retro pass
- **Severity residual:** P2 (carga cognitiva; prosa ya mitiga)
- **Proposed residual:** none required on code; optional retro +self-check “¿qué falla si `today` es el reloj del runner en UTC y el dato es Lima?”
- **Code/output changes:** none

### S27-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** `0.1+0.2 == 0.3` vs `isclose`; anclado a thr_auto/thr_review; fade a raises. Trap `False`→`True`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T3-A-E2 (weDo, independent) — **A**
- **Diagnosis:** raises + fragmento `invalid`; dual-track regex/lab honesto en preamble y feedback; retro distinta (tipo solo = teatro parcial → tmp). Feedback ya ajustado en R1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T3-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** NamedTemporaryFile + relectura; éxito `ok`; retro menciona `tmp_path` del You Do. Feedback corto (~17 w).
- **Checklist:** all pass
- **Severity residual:** P2 opcional (feedback + “no escribas en el árbol del repo”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S27-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Tabla negativos RUC sintético (no SUNAT); preamble pide predicción mensaje ofensivo vs genérico. Retro ~38 w borderline.
- **Checklist:** all pass
- **Severity residual:** P2 (longitud retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S27-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Tipo vs mensaje; trap `ValueError`→`email vacío`. Feedback y retro comparten “mensaje = contrato” pero retro aporta “qué falló” y puente E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T3-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Teatro de verde en validación de email; límites anti-RFC. Eco leve feedback/retro sobre “fallar controlado”.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S27-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** f-string campo + `!r`; eco j≈0.37 “genérico no dice dónde mirar”. Retro gana con You Do y ética tokens.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El mensaje es documentación viva del contrato de entrada: el clerical queue y el log de CI deben poder apuntar al campo sin adivinar. Un genérico `error` obliga a reproducir a ciegas. Pregunta: ¿qué imprimirías si `v` fuera un token real de API? (respuesta: nada — usa valor sintético). Ese hábito va a los negativos `require_email`-style del You Do.
- **Code/output changes:** none

### S27-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** Tres bandas auto/review/non; preamble “100 % de líneas ≠ riesgo”; matching no-fraude. Retro ~32 w corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Tres bandas de umbral son el núcleo del contrato de `classify_pair`: auto, review y non mueven colas distintas. El error clásico es vanidad de % de líneas mientras `review` o `non` no tienen caso. Pregunta: si `hits` solo tiene auto y review, ¿qué deuda reportas? We Do: ejercer ambas ramas, detectar falta de `non` y reportar porcentaje legible.
- **Code/output changes:** none

### S27-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Una rama vs ambas; eco j≈0.40 “branch coverage mínima / una sola llamada”. Principio correcto pero retro casi clona feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2 (casi P1)
- **Proposed retrospective (replace):**  
  La evidencia del contrato son *ambas* salidas en el mismo run: `hi` y `lo`. Cubrir solo el camino feliz deja la rama de umbral bajo sin red. Pregunta: en `classify_pair`, ¿qué score sintético usarías para ejercitar `non`? Siguiente (E2): detectar si falta la banda `non` en el set de hits.
- **Code/output changes:** none

### S27-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** `'non' in hit` vs `not in` — excelente. Feedback y retro **distintos** (deuda CI vs pregunta de negocio vs % líneas). j≈0.00. Mejor par de la sección en metacognición.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Porcentaje truncado 66; límites anti-vanity KPI; puente You Do tres bandas. Trap `0.666…`→`66`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S27-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** Mutante sin casefold; preamble “suite verde = teatro”. Retro ~30 w; principle + bridge OK.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual:** expand con self-check “si el oráculo fuera un print del raw, ¿`kills_mutant` seguiría siendo True?”
- **Code/output changes:** none

### S27-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** good pasa + mutant debe fallar; retro **muy corta** (~21 w). Feedback ya nombra teatro de cobertura.
- **Checklist:** all pass; retro partial (longitud + poco self-check)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Buen camino verde + mutante rojo = contrato; ambos verdes = teatro de cobertura. El oráculo debe ser lo bastante estricto para que quitar `strip` (o `casefold`) duela. Pregunta: si cambias el oráculo a `raw` crudo, ¿quién “gana” el mutante? Siguiente (E2): cuando falla, el mensaje debe traer input/expected/actual.
- **Code/output changes:** none

### S27-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Dict de falla con roles; starter invierte expected/actual y omite input. Retro ~22 w corta; eco leve con feedback.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Input + expected + actual es el mínimo para un fix a las 2 a. m.: el colega reproduce el raw sintético sin adivinar. Roles invertidos mandan a “arreglar” el lado equivocado. Pregunta: ¿por qué no loguear un email real en ese dict? Luego (E3): cierra el ciclo bug_repro → regression_test con normalización.
- **Code/output changes:** none

### S27-T4-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Cierre del arco bug_repro → regression; instruction y feedback excelentes. Eco j≈0.44 con retro (misma cadena bug_repro/regression/oráculo). Retro ya apunta al mutante del You Do — conservar ese puente, reescribir el resto.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** **P1**
- **Proposed retrospective (replace):**  
  Cerrar el ticket sin el caso que mata al mutante deja la puerta abierta al mismo typo de `strip`/`casefold`. El repro muestra el dolor; la regresión lo convierte en contrato de CI. Pregunta de defensa: si mañana alguien borra `casefold` en `normalize_name`, ¿qué test del You Do debe fallar primero? Política: no merge sin ese rojo esperado.
- **Code/output changes:** none

### youDo (youDo) — **A**
- **Diagnosis:** Marco sólido CP-N3-A (context, objectives, requirements éticos, starter ejecutable con `starter_ok`, rubric 6 criterios, portfolioNote). Retrospective de defensa con tres self-checks + ética matching — cumple spec §8.3. Dual-track pytest vs assert+print en context/starter.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none (P2 opcional: en context, una frase de “prioriza el mapa de riesgo del README antes de hinchar asserts triviales” — no obligatorio)
- **Code/output changes:** none

---

## Priority order (Round-2 Fixer)

### P1 (arreglar en R2)
1. **S27-T2-B-E2** — desacoplar retrospective del feedback (eco j≈0.67); full text arriba  
2. **S27-T4-B-E3** — desacoplar retro del feedback; conservar puente mutante You Do  
3. **Tema retrospectives cortas (weDo)** — al expandir unidades tocadas, llevar a 40–80 w con: principio + misconception *distinto* del feedback + transfer + 1 self-check. Priorizar: T4-B-E1, T4-B-E2, T2-B-E3, T4-A-E1, T1-A-E2, T1-B-E2, T2-A-E3, T3-B-E3  

### P2 (polish si hay presupuesto)
4. **S27-T1-A-DEMO** — alinear preamble a `normalize` / `blocking` / `repo_sql` (sin UI fantasma)  
5. **I Do retros delgados** — T2-A, T2-B, T4-A, T4-B (expandir solo si se edita el bloque)  
6. **Feedback &lt;25 w** — T2-B-E1, T2-A-E2, T3-A-E3, T3-B-E3, T1-B-E1, etc., al tocar la unidad  
7. **T3-A-DEMO** — no refactor de código; opcional self-check de reloj en retro  
8. **Filename/id** — `async-concurrency` vs pytest: documentar en notas de fix del repo (fuera de prosa learner)

### No tocar
- Outputs canónicos y solutions (integridad verificada 24/24)  
- You Do marco (solo polish opcional)  
- Fade de superficies E1→E3 (ya real)  
- Ética matching ≠ fraude (ya en theory, T1-B-E3, youDo)

---

## Residual risks

1. **Anti-aberration en R2 fix:** al alargar 8–12 retros, reescribir a mano por unidad; no plantilla “Principio. Error clásico. Luego (E2)”.  
2. **Dual-track pytest/lab:** al editar T3-A-E2 u otras, no borrar la nota de que `match=` es regex en pytest real.  
3. **Carga T3-A-DEMO:** cuatro bordes siguen siendo densos; la mitigación es prosa de atención, no un quinto print.  
4. **Terminología non vs non_match:** exercises usan `'non'`; youDo usa `non_match` — acceptable si el Fixer no “unifica” rompiendo outputs.  
5. **Over-fix de hints E1:** no hace falta despoilar; el residual real es eco feedback/retro, no hints.

---

## Fixer R2 acceptance checklist

- [ ] Peores ecos P1 (T2-B-E2, T4-B-E3) con retrospective **distinta** del feedback  
- [ ] Al menos los weDo listados en P1.3 con retro en ~40–80 w e self-check  
- [ ] T1-A-DEMO preamble alineada al código (si se toca)  
- [ ] Outputs y solutions **intactos**  
- [ ] Español PE; solo datos sintéticos `@example.pe`  
- [ ] Sin generadores ni bulk replace de prosa  
- [ ] Sección sigue compilando en el build estático  

---

Section 27 exercise pedagogy review complete. Ready for the Fixer prompt.
