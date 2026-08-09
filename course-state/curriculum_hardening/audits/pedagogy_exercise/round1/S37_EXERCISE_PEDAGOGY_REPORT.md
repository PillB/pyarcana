# S37 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Profiling, algoritmos y rendimiento
- **shortTitle:** Profiling y rendimiento
- **id:** `dbt-bigquery` (archivo `s37-dbt-bigquery.ts`; contenido = escala del triage / matching sintético, no dbt ni BigQuery de producto)
- **index:** 37
- **source:** `src/lib/course/sections/s37-dbt-bigquery.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S37-T1-A wall/CPU/mem/cProfile · T1-B benchmark warmup/mediana · T2-A complejidad y blocking · T2-B estructuras e índice invertido · T3-A dtypes/chunks/columnar · T3-B caché e invalidación / OOC · T4-A performance budget · T4-B costo total y reporte before/after
- **hilo de caso:** **CASO-LIM-037** — path de escala del triage (matching y features) sobre fixture sintético Red Andina (Lima/Cusco); gate `same_result` + `before_after` + `budget`; sin PII real; puente S14 (vectorización) + S30 (recall de blocking) → S37 (costo medido) → S38 (colas/reintentos)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~389–653), `weDo.steps[]` (24 ejercicios, ~655–1650) y `youDo` (~1652–1761) en `s37-dbt-bigquery.ts`.
- Contrastado con theory T1–T4, learning outcomes de escala y el contrato del gate (`same_result`, `before_after`, `budget`, `micro_only_ok=False`).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S37 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra skill + fixture; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “E# · Concepto + fixture + DEFECT del starter + salidas exactas” en un solo bloque: meta, éxito y límites mezclados; legible para quien ya midió PRs de performance, **opaco** para newbie sin escena de “por qué el wall sin `n` miente al revisor” |
| We Do `feedback` | 1 frase; nombra el principio (bien); rara vez ancla *por qué importa al PR de escala o al gate `same_result`* |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable para guided); E2/E3 con breadcrumbs proporcionales; fade real |
| Fade E1→E2→E3 | **Real por contenido**: E1 repara un defecto local (n, fórmula, signo); E2 fija política multi-métrica o de diseño; E3 transfiere a predicado de gate / reporte / preferencia algorítmica. No son tres copias con números distintos |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos**; starter casi completo con `bench`, blocking y `report`; assert de `same_result` |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory; predicados estables (`*_ok True`) donde los ms varían por máquina — **no** proponer cambios de output salvo notas puntuales |
| Ética del hilo | Consistente: sintético, sin PII, sin inferir parentesco/fraude desde ciudad; ciudad solo como clave de blocking de lab |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, predicados estables, fade E1→E3, youDo con path before/after real) es maduro y alineado al gate de escala. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa medir el path de Red Andina antes de “optimizar”, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S37-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example claro de wall/CPU/peak/`hot_fn` con `n=10000` y `expensive` como hot path. La `description` nombra las métricas; falta `preamble` que diga *qué observar* (orden wall→cProfile→tracemalloc; predicados estables porque los ms varían) y `retrospective` del misconception “publicar solo wall_ms sin n ni hot_fn basta para el PR”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el path de escala del triage sintético (`CASO-LIM-037`), un “se siente más rápido” no pasa el gate: necesitas wall, CPU, pico de alocaciones y el nombre de la función caliente. En esta demo un `path` llama a `cheap` y luego a `expensive` con `n=10000`. No escribas aún: predice qué función gana en `cProfile` y por qué el reporte usa predicados (`wall_ms_ok`) en lugar de ms fijos. Si omites `n` o mides un tramo frío del `import`, el revisor no puede comparar PRs.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `perf_counter` es reloj de pared; `process_time` es CPU del proceso; `tracemalloc` debe envolver el **work real**, no una alocación aparte; `cProfile` nombra el hot path después de saber que el wall importa. Los ms exactos varían por máquina: por eso el demo publica predicados y `hot_fn expensive`. Puente a We Do: reparar `n=0` y medir CPU/peak del work.
- **Proposed retrospective:**  
  Si puedes explicar por qué un wall sin `n` no es comparable y por qué `expensive` debe ganar a `cheap` sin mirar el código, ya tienes el hábito de medir el path caliente. El error clásico es micro-shave de un loop que ni es hot. En We Do corregirás el reporte de medición y el predicado `same_result`.
- **Code/output changes:** none
- **Validation notes:** Output predicados + `hot_fn expensive` alineado a theory T1-A.

---

### S37-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: mide wall pero imprime `n 0`. Instruction densa mezcla ID, meta, DEFECT y salidas; sin title, preamble ni retrospective. Feedback nombra el principio pero no ancla “por qué el revisor del PR de escala no puede comparar fixtures si falta `n`”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Wall con n del fixture
- **Proposed preamble:**  
  - **Contexto:** en el lab de Red Andina el primer dato del reporte de escala es el wall del work sintético; sin el tamaño del input, dos PRs no son comparables.  
  - **Meta:** medir wall con `perf_counter` y reportar el `n` real del fixture (`1000`).  
  - **Éxito:** `n 1000` / `metric wall` / `ok True`.  
  - **Límites:** no dejes `n=0`; no inventes ms fijos; solo fixture sintético sin PII.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el wall se mide bien, pero `print("n", 0)` ignora el fixture.  
  2. Usa el `n = 1000` ya definido al reportar.  
  3. Mantén `metric` en `"wall"` y `ok` si el resultado y el wall son ≥ 0.  
  4. Imprime solo `n`, `metric` y `ok` en ese orden.
- **Proposed feedback improvement:**  
  Un `wall_ms` sin `n` no sirve al revisor: no sabes si el fixture creció en silencio. El número viaja con su tamaño; si no, el “speedup” es teatro entre datasets distintos.
- **Proposed retrospective:**  
  Toda métrica de tiempo de un path de triage lleva el `n` del fixture. El error clásico es medir bien y reportar mal. Siguiente (E2): sumar CPU y peak del **mismo** work.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S37-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buena independencia: hay que medir wall + CPU + peak del work, no hardcodear `False`. Instruction ya nombra salidas y el riesgo de “peak ajeno”; falta escena de por qué tres métricas juntas y cierre metacognitivo. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Wall, CPU y peak del work
- **Proposed preamble:**  
  - **Contexto:** un solo wall no dice si el path es I/O-bound o si se va de RAM; en CI light del triage necesitas wall, CPU y pico del **work medido**.  
  - **Meta:** completar medición con `perf_counter`, `process_time` y `tracemalloc` sobre `work(n)` con `n=5000`.  
  - **Éxito:** `wall_ok True` / `cpu_ok True` / `peak_ok True` / `n 5000`.  
  - **Límites:** no midas el peak de una alocación aparte; no dejes `n 0`; no hardcodees los predicados en `True` sin medir.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: solo hay wall; `cpu_ok`/`peak_ok` están en `False` y `n` en `0`.  
  2. Mide CPU con `process_time` alrededor de `work(n)`.  
  3. Envuelve `work(n)` con `tracemalloc.start/stop` y usa el peak del path.  
  4. Reporta los tres predicados ≥ 0 y el `n` del fixture.
- **Proposed retrospective:**  
  Tres lecturas del mismo work evitan optimizar la métrica equivocada o ignorar OOM. Pregunta sin código: ¿por qué un peak medido fuera de `work` engaña al budget de memoria?
- **Code/output changes:** none (nota: solution introduce lista en `work` para que tracemalloc vea alocación — pedagogically justified; no cambiar output)
- **Validation notes:** Output canónico correcto; fade independiente respecto a E1.

---

### S37-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer al corazón del gate: `same_result` se **calcula** comparando funciones, no se declara. Starter con `after_fn` que cambia semántica. Falta preamble que distinga “más rápido” de “sigue siendo el matching correcto” y retrospective de reutilización en You Do / PR.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** same_result se calcula, no se declara
- **Proposed preamble:**  
  - **Contexto:** el gate de escala de `CASO-LIM-037` exige el mismo resultado funcional antes y después del “optimizar”; un speedup que cambia el score del matching es regresión.  
  - **Meta:** hacer que `after_fn` preserve la semántica de `before_fn` y reportar `same_result` como predicado medible.  
  - **Éxito:** `same_result True` / `ok True` / `n 1`.  
  - **Límites:** no hardcodees `True`; no “arregles” el print sin corregir la función; sin PII.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `after_fn` hace `v + 2` en lugar de `v * 2` (cambia semántica).  
  2. Alinea `after_fn` a la misma semántica que `before_fn`.  
  3. Calcula `same_result = before_fn(x) == after_fn(x)`.  
  4. Imprime `same_result`, `ok` (igual a ese predicado) y `n 1`.
- **Proposed retrospective:**  
  Performance sin `same_result` es regresión disfrazada. El error clásico es “optimizar” cambiando el contrato. En el You Do compararás las salidas de `before_path` y `after_path` antes de publicar el speedup.
- **Code/output changes:** none
- **Validation notes:** Transfer de principio de gate (no clone de E2); alineado a theory y youDo assert.

---

### S37-T1-B-DEMO (iDo)
- **Diagnosis:** Demo de higiene de bench: warmup + 5 runs + mediana + spread. Description OK; falta preamble de “la 1ª corrida miente” y retrospective del misconception de publicar cold start como performance del algoritmo. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un solo run frío mezcla `import`, cachés de CPU y el algoritmo; el PR de escala del triage no puede basarse en eso. En esta demo se descarta un warmup de `work()`, se miden 5 runs y se reportan predicados de mediana y spread (no ms fijos). No escribas: predice por qué `warmup True` y `n_runs 5` importan más que un número mágico de milisegundos. Si publicas el cold start, engañas al equipo y al budget.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el warmup descarta distorsión de arranque; la mediana es robusta a un outlier; el spread (max−min) es nota de variabilidad con N chico, no un p95 de producción. Puente a We Do: reemplazar mean de enteros inventados y forzar `discard_first`.
- **Proposed retrospective:**  
  Bench serio = warmup + N runs + mediana + nota de variabilidad. El error clásico es mean de números inventados o un solo run. We Do: medir de verdad y nombrar el proxy de cola.
- **Code/output changes:** none
- **Validation notes:** Output predicados alineado a theory T1-B.

---

### S37-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter con `statistics.mean` de lista inventada y `warmup False` — defect guiado perfecto. Instruction densa; sin escena de “por qué inventar tiempos rompe el PR” ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mediana de runs reales con warmup
- **Proposed preamble:**  
  - **Contexto:** el bench del path sintético debe basarse en tiempos medidos, no en enteros de juguete que “se ven bien”.  
  - **Meta:** ejecutar warmup, medir 3 runs con `perf_counter` y reportar el predicado de mediana.  
  - **Éxito:** `True` / `n_runs 3` / `warmup True`.  
  - **Límites:** no uses mean de listas inventadas; no publiques ms exactos como contrato (varían por máquina).
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `vals = [5, 1, 4]` no son tiempos; `warmup` está en `False`.  
  2. Llama `work()` una vez (descartada).  
  3. Mide 3 runs, toma `statistics.median(times)` y convierte a ms solo para el predicado `>= 0`.  
  4. Imprime el predicado, `n_runs` y `warmup True`.
- **Proposed retrospective:**  
  Mediana + warmup sobre tiempos reales es la higiene mínima de bench. El error clásico es “demostrar” performance con números inventados. Siguiente (E2): hacer explícito el `discard_first`.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos; predicado estable bien elegido.

---

### S37-T1-B-E2 (weDo, independent)
- **Diagnosis:** Enfoca el cold start: hay que descartar el primer run y reportar flags. Menos breadcrumbs que E1; falta preamble de escena y retrospective. Feedback de una línea.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Warmup: descarta el cold start
- **Proposed preamble:**  
  - **Contexto:** si el primer run entra a la mediana, el “algoritmo” se carga con el arranque en frío y el budget de CI light se vuelve flaky o engañoso.  
  - **Meta:** implementar warmup real y reportar `discard_first True` con 3 runs post-warmup.  
  - **Éxito:** `warmup True` / `discard_first True` / `n_runs 3` / `ok True`.  
  - **Límites:** no cuentes el warmup dentro de `n_runs`; no dejes los flags en `False` sin cambiar el flujo.
- **Proposed instruction/description improvements:**  
  1. Starter mide 3 runs sin corrida previa y publica `warmup False`.  
  2. Ejecuta `work()` una vez antes del bucle (descartada).  
  3. Mide solo las 3 corridas siguientes.  
  4. Imprime flags y `n_runs` de las post-warmup.
- **Proposed retrospective:**  
  `discard_first` es política de bench, no un booleano decorativo. Pregunta: si el warmup falla, ¿qué le mientes al revisor del PR?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S37-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a variabilidad con N chico: `max` como proxy de cola + spread; nombra el proxy para no confundirlo con p95 real. Starter usa `min` y `spread=0`. Falta preamble de “no vendes p95 de producción con 3 puntos” y retrospective de cuándo subir N.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Proxy de cola y spread (N chico)
- **Proposed preamble:**  
  - **Contexto:** con pocas muestras no inventas un p95 de producción; reportas un proxy pesimista y el spread, con el nombre del proxy a la vista.  
  - **Meta:** de `runs=[1,2,9]` obtener cola `max=9`, `spread=8` y etiqueta `p95_small_n`.  
  - **Éxito:** `9` / `spread 8` / `proxy p95_small_n` / `ok True`.  
  - **Límites:** no uses `min` como cola; no digas que esto es el p95 real de prod; sintético.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: imprime `min` y `spread 0`.  
  2. Calcula `tail = max(xs)` y `spread = max - min`.  
  3. Mantén el nombre del proxy.  
  4. `ok` si `tail == 9` y `spread == 8`.
- **Proposed retrospective:**  
  Nombrar el proxy evita que el equipo trate un max de 3 runs como SLI de producción. El error clásico es esconder la cola o no reportar variabilidad. En budgets (T4) la mediana/p95 reales necesitan más muestras.
- **Code/output changes:** none
- **Validation notes:** Transfer conceptual (variabilidad), no clone de E1/E2.

---

### S37-T2-A-DEMO (iDo)
- **Diagnosis:** Demo compacta all_pairs vs blocked con n=4, blocks=2. Description técnica; falta preamble de “O(n²) mata el matching” y retrospective del misconception de micro-optimizar el scorer sin contar pares. `why` una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Escalar entity resolution no empieza por shave del scorer: empieza por contar cuántos pares entran al scorer. En la demo, `n=4` y 2 bloques: 6 pares completos vs 2 bloqueados. No escribas: predice por qué `all_p > blk` y qué implica para el wall del matching. Si no cuentas pares, no sabes si el blocking sirve; si bajas recall por un blocking ciego, no es victoria de escala (puente S30).
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `n*(n-1)//2` son pares no ordenados sin diagonal; el blocked asume bloques de tamaño `n//blocks`; la métrica de costo del path de Red Andina es el conteo de candidatos, no el “feeling” del loop. Puente a We Do: corregir `n*n` y calcular `reduction`.
- **Proposed retrospective:**  
  Contar pares es el primer instrumento de escala del matching. El error clásico es mirar solo ms del scorer con n² intacto. We Do: fórmula correcta, reduction y preferir blocking a microopt.
- **Code/output changes:** none
- **Validation notes:** Output `6` / `2` / `ok True` correcto.

---

### S37-T2-A-E1 (weDo, guided)
- **Diagnosis:** Defect clásico `n*n` vs `n*(n-1)//2`. Instruction clara en salidas pero sin escena de por qué el doble conteo/diagonal miente al costo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pares no ordenados: n*(n-1)//2
- **Proposed preamble:**  
  - **Contexto:** el costo base del matching sintético se expresa en pares candidatos, no en `n²` con diagonal y dobles.  
  - **Meta:** calcular `all_pairs` para `n=10` con la fórmula de combinaciones.  
  - **Éxito:** `45` / `n 10` / `ok True`.  
  - **Límites:** no uses `n*n` ni `n`; no inventes el 45 sin fórmula.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `n * n` (100).  
  2. Calcula `pairs = n * (n - 1) // 2`.  
  3. Imprime pares, `n` y `ok` si `pairs == 45`.
- **Proposed retrospective:**  
  La fórmula de pares es la base del costo de escala. El error clásico es `n²` (diagonal y dobles). Siguiente (E2): reduction como fracción eliminada.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T2-A-E2 (weDo, independent)
- **Diagnosis:** Enseña `reduction = 1 - blocked/all` vs el ratio `blocked/all`. Riesgo de confusión con `pair_factor` de T4-B (hints lo mencionan — bien). Falta preamble y retrospective que fijen la diferencia reduction vs factor.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reduction: fracción de pares eliminada
- **Proposed preamble:**  
  - **Contexto:** el reporte de blocking no basta con “bajaron los pares”: necesitas la fracción eliminada en [0,1], comparable entre fixtures.  
  - **Meta:** con `blocked=10` y `all=45`, calcular `round(1 - blocked/all, 3)`.  
  - **Éxito:** `0.778` / `ok True` / `blocking True`.  
  - **Límites:** no reportes `blocked/all` como reduction; no lo confundas con `pair_factor = all//blocked` (T4-B).
- **Proposed instruction/description improvements:**  
  1. Starter imprime `blocked/all_p` (0.222).  
  2. Calcula `reduction = round(1 - blocked / all_p, 3)`.  
  3. Imprime reduction, `ok` si es 0.778, y `blocking True`.
- **Proposed retrospective:**  
  Sin `reduction` no hay evidencia medible de escala. Pregunta: si reduction sube pero el recall de S30 cae, ¿celebras o reabres el gate de matching?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S37-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de priorización: comparar pares de blocking vs microopt del 1 %. Starter fija `prefer='microopt'` sin comparar. Buena pedagogía de “teatro del 1 %”; falta preamble de costo de ingeniería y retrospective de PR.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Preferir blocking a microopt del 1 %
- **Proposed preamble:**  
  - **Contexto:** en el path O(n²) del triage, bajar un 1 % el inner loop y dejar casi todos los pares es teatro; el blocking de 4950→450 gana en números.  
  - **Meta:** elegir `prefer 'blocking'` cuando `blocked < micro_pairs` y marcar `micro False`.  
  - **Éxito:** `prefer blocking` / `ok True` / `micro False`.  
  - **Límites:** no hardcodees el prefer sin comparar; no celebres microopt sin conteo de pares.
- **Proposed instruction/description improvements:**  
  1. Starter fija `prefer="microopt"` y `micro=True`.  
  2. Compara `blocked` vs `micro_pairs`.  
  3. Asigna `prefer` y `micro = (prefer == "microopt")`.  
  4. Imprime prefer, `ok` (blocked < all y prefer blocking) y micro.
- **Proposed retrospective:**  
  Priorizar blocking se decide con números de pares, no con lemas de “código más ingenioso”. El error clásico es el PR del 2 % opaco. En T2-B el orden operativo será block→score.
- **Code/output changes:** none
- **Validation notes:** Transfer de criterio de producto; no clone de E2.

---

### S37-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de inverted index por ciudad sintética Lima/Cusco. Description OK; falta preamble de “index first, score later” y que ciudad no implica parentesco. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de features caras del matching, se reduce el espacio de candidatos. En la demo un índice invertido por ciudad sintética (Lima×2, Cusco×1) muestra tamaños de bloque. No escribas: predice el tamaño de Lima y el flag `ok`. La ciudad es solo clave de blocking de laboratorio: no afirma parentesco ni fraude. Si scoras el producto cartesiano y “optimizas” el scorer después, invertiste el orden del path de escala.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `defaultdict(list)` agrupa `entity_id` por clave; el scorer opera dentro del bloque; membership con set/dict es O(1) amortizado frente a list scan. Puente a We Do: set vs list_scan, count de Lima, order block→score.
- **Proposed retrospective:**  
  Indexar primero es optimización de verdad. El error clásico es scan lineal repetido o scorear todo el cartesiano. We Do: estructura correcta, tamaño de bloque y orden operativo.
- **Code/output changes:** none
- **Validation notes:** Output Lima=2 alineado a theory T2-B.

---

### S37-T2-B-E1 (weDo, guided)
- **Diagnosis:** Membership con set vs list_scan — defect de diseño bien nombrado. Instruction densa; sin escena de “por qué el loop caliente del triage no puede hacer O(n) membership”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Membership con set, no list scan
- **Proposed preamble:**  
  - **Contexto:** en el hot path del triage, consultar si un id ya se vio con un scan de lista O(n) se multiplica por cada par candidato.  
  - **Meta:** construir un `set`, consultar membership y documentar la estructura correcta.  
  - **Éxito:** `structure set` / `found True` / `scan False`.  
  - **Límites:** no dejes `list_scan`; no inventes `found` sin consulta; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter hace `target in ids` sobre lista y reporta `list_scan` / `scan True`.  
  2. Construye `index = set(ids)` y consulta `target in index`.  
  3. Imprime `structure 'set'`, `found` y `scan False`.
- **Proposed retrospective:**  
  Elegir la estructura correcta es optimización de verdad, no micro-shave de sintaxis. El error clásico es list membership en bucle caliente. Siguiente (E2): tamaño del bloque Lima.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T2-B-E2 (weDo, independent)
- **Diagnosis:** Contar entidades del bloque Lima; starter deja `count=0`. Independiente y simple; falta anclar “el tamaño del bloque predice pares locales del scorer” en preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tamaño del bloque Lima
- **Proposed preamble:**  
  - **Contexto:** el índice invertido solo es útil si el scorer opera dentro del bloque; el tamaño de Lima predice cuántos pares locales se generarán.  
  - **Meta:** contar filas con ciudad `"Lima"` en el fixture sintético (sin inferir parentesco).  
  - **Éxito:** `2` / `city Lima` / `ok True`.  
  - **Límites:** no cuentes Cusco dentro de Lima; no inventes PII ni parentesco.
- **Proposed instruction/description improvements:**  
  1. Starter deja `count = 0` sin filtrar.  
  2. Cuenta filas donde la ciudad es Lima.  
  3. Imprime el conteo, la ciudad y `ok` si es 2.
- **Proposed retrospective:**  
  El tamaño del bloque predice el costo local del scorer. Pregunta: si Lima concentra el 90 % de las filas, ¿el blocking “global” sigue salvándote?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S37-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer fuerte: order `['block','score']` y `pairs_after_block` = blocked, no all_pairs. Starter invierte orden y no reduce. Excelente; falta preamble de pipeline y retrospective de reutilización en You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Orden operativo: block luego score
- **Proposed preamble:**  
  - **Contexto:** el path de escala del matching no es “scorear todo y luego filtrar”: primero se bloquea, luego se puntúa sobre candidatos reducidos.  
  - **Meta:** con `n=10` y 5 bloques, fijar el orden correcto y reportar pares después del block.  
  - **Éxito:** `order ['block', 'score']` / `pairs_after_block 5` / `ok True`.  
  - **Límites:** no inviertas a score→block; no dejes `pairs_after = all_pairs`.
- **Proposed instruction/description improvements:**  
  1. Starter pone `order = ["score", "block"]` y `pairs_after = all_pairs`.  
  2. Calcula `blocked` con bloques iguales.  
  3. Asigna `order = ["block", "score"]` y `pairs_after = blocked`.  
  4. Imprime order, pares y `ok` si pares < all_pairs.
- **Proposed retrospective:**  
  El orden block→score se demuestra con el conteo de pares, no con un lema. El error clásico es features O(n²) “porque el scorer es el cuello”. En memoria (T3) acotarás el pico con chunks y dtypes.
- **Code/output changes:** none
- **Validation notes:** Transfer de pipeline; alineado a callout “Index first”.

---

### S37-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de chunk_sizes, subset columnar y bound por itemsize. Description rica; falta preamble de OOM/tabla ancha y retrospective de “en mi laptop cabe” como anti-patrón. `why` una frase densa.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El batch de features del triage puede caber en la laptop del lab y reventar en el worker nocturno. En esta demo se planifican chunks de 10 con size 3 (`[3,3,3,1]`), se proyectan solo `id`/`amount` (sin `blob`) y se compara bound int32 vs int64. No escribas: predice por qué `blob` no debe viajar y por qué el bound de int32 es menor. Si cargas la tabla ancha “porque cabe”, el OOM llega en silencio con `n` real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el chunk acota el pico; el subset columnar reduce I/O y RAM; `itemsize` justifica dtype angosto con bytes medibles. Puente a We Do: ceil de chunks, proyección y elección int32.
- **Proposed retrospective:**  
  Memoria se diseña: chunks, columnas y dtypes con bound. El error clásico es load_all + int64 por defecto. We Do: planificar chunks, proyectar y medir itemsize.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T3-A.

---

### S37-T3-A-E1 (weDo, guided)
- **Diagnosis:** Ceil de chunks vs truncamiento `n//size`. Defect clásico y bien nombrado. Falta escena de “el resto es un chunk más” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Número de chunks con ceil
- **Proposed preamble:**  
  - **Contexto:** planificar el job out-of-core del fixture sintético exige saber cuántas ventanas habrá; truncar con `//` pierde el resto.  
  - **Meta:** con `n=10` y `size=4`, calcular 3 chunks (último más corto).  
  - **Éxito:** `3` / `size 4` / `ok True`.  
  - **Límites:** no uses solo `n//size`; no asumas chunks de tamaño uniforme sin resto.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `n // size` (2).  
  2. Usa `(n + size - 1) // size`.  
  3. Imprime n_chunks, size y `ok` si es 3.
- **Proposed retrospective:**  
  Contar chunks planifica el job out-of-core. El error clásico es truncar y “perder” el último lote. Siguiente (E2): no cargar columnas basura.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T3-A-E2 (weDo, independent)
- **Diagnosis:** Proyección columnar de `id`/`amt` sin blob/notes. Independiente; falta anclar I/O + RAM en preamble y el riesgo de tabla ancha en retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Subset columnar sin blobs
- **Proposed preamble:**  
  - **Contexto:** el scorer del triage usa pocas columnas; arrastrar `blob` y `notes` multiplica I/O y RAM sin ganar recall.  
  - **Meta:** proyectar solo `['id','amt']` y marcar `columnar True`.  
  - **Éxito:** `['id', 'amt']` / `ok True` / `columnar True`.  
  - **Límites:** no imprimas todas las claves del row; no dejes `columnar False` si proyectaste.
- **Proposed instruction/description improvements:**  
  1. Starter hace `cols = list(row.keys())` y `columnar False`.  
  2. Proyecta con un dict comprehension sobre `keep = ["id", "amt"]`.  
  3. Imprime las claves del subset, `ok` si no hay blob, y `columnar True`.
- **Proposed retrospective:**  
  Columnar es reducción de I/O, no solo de RAM. Pregunta: si el scorer solo usa `id` y `amt`, ¿qué justificas al revisor por leer `notes`?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S37-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a decisión de dtype por `itemsize` medido. Starter fuerza int64/`higher`. Buena pedagogía de presupuesto de RAM; falta preamble de overflow y retrospective de “medir antes de estrechar”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** dtype estrecho por itemsize
- **Proposed preamble:**  
  - **Contexto:** el bound de memoria del batch sintético se discute en bytes, no en intuición de “int64 siempre seguro”.  
  - **Meta:** comparar `itemsize` de `'i'` vs `'q'` y elegir int32 cuando cabe y ahorra.  
  - **Éxito:** `dtype int32` / `ok True` / `mem lower`.  
  - **Límites:** no fuerces int64 sin comparar; no ignores overflow si el dominio no cabe (aquí el lab asume que sí).
- **Proposed instruction/description improvements:**  
  1. Starter deja `dtype = "int64"` y `mem = "higher"`.  
  2. Compara `i32` e `i64` con `array.array`.  
  3. Elige dtype y mem según `i32 < i64`.  
  4. Imprime dtype, `ok` y mem.
- **Proposed retrospective:**  
  El dtype es una decisión de presupuesto de RAM medida en bytes. El error clásico es el default “siempre int64”. En caché (T3-B) el riesgo pasa a ser datos stale, no solo bytes.
- **Code/output changes:** none
- **Validation notes:** Transfer de criterio de memoria; output estable en plataformas con itemsize i=4, q=8.

---

### S37-T3-B-DEMO (iDo)
- **Diagnosis:** Demo put/hit_v1/miss_v2 por cambio de versión. Description OK; falta preamble de cache stale y retrospective de invalidación como diseño. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Guardar features o pares de blocking acelera re-runs del triage, pero un cache sin versión de feature set miente al matching. En la demo se hace put con `fs-v1` (hit) y se consulta `fs-v2` (miss). No escribas: predice ambos hits y el `ok`. Si reutilizas scores de un schema viejo, el “speedup” es stale y puede romper `same_result` en silencio.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: la key incluye versión y cutoff; el miss tras bump de versión es la invalidación visible; out-of-core (chunk) se documenta junto a la política de cache. Puente a We Do: key completa, reason version_change, ooc chunk.
- **Proposed retrospective:**  
  Hit/miss y versión son parte del diseño, no un afterthought. El error clásico es cache infinito sin schema. We Do: armar la key, detectar stale y acotar RAM.
- **Code/output changes:** none
- **Validation notes:** Output hit_v1/hit_v2 alineado a theory T3-B.

---

### S37-T3-B-E1 (weDo, guided)
- **Diagnosis:** Key incompleta sin cutoff → miss falso. Defect excelente. Falta escena de colisiones y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cache key: versión + cutoff
- **Proposed preamble:**  
  - **Contexto:** reutilizar features del triage con solo la versión de feature set colisiona: distinto cutoff, mismos scores viejos.  
  - **Meta:** armar la key completa `('fs-v1','cut')` y obtener hit en el store sintético.  
  - **Éxito:** `('fs-v1', 'cut')` / `hit True` / `ok True`.  
  - **Límites:** no dejes la key de un solo elemento; no hardcodees hit sin `in cache`.
- **Proposed instruction/description improvements:**  
  1. Starter usa `key = ("fs-v1",)` y falla el hit.  
  2. Incluye el cutoff en la tupla.  
  3. Calcula `hit = key in cache`.  
  4. Imprime key, hit y `ok` si hit y `len(key)==2`.
- **Proposed retrospective:**  
  La key completa (versión + cutoff) *es* la invalidación. El error clásico es olvidar el cutoff. Siguiente (E2): miss explícito al cambiar versión.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T3-B-E2 (weDo, independent)
- **Diagnosis:** Invalidación por versión: reason, hit False, stale True. Starter hardcodea keep_forever y hit True. Independiente; falta preamble de “invalidar es diseño” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Miss al cambiar feature set
- **Proposed preamble:**  
  - **Contexto:** al subir de `fs-v1` a `fs-v2` los pares o features cacheados no deben pegar; el miss es la señal de recompute.  
  - **Meta:** detectar miss, publicar `reason 'version_change'` y `stale True`.  
  - **Éxito:** `version_change` / `hit False` / `stale True`.  
  - **Límites:** no inventes hit True; no uses `keep_forever` como política.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `keep_forever` y fuerza `hit True`.  
  2. Calcula `hit = new_key in store`.  
  3. Si no hay hit → `reason = "version_change"` y `stale = not hit`.  
  4. Imprime reason, hit y stale.
- **Proposed retrospective:**  
  Invalidar es parte del diseño, no un afterthought. Pregunta: ¿qué rompe en el matching si sirves scores de `fs-v1` con el scorer de `fs-v2`?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S37-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer OOC: chunk vs load_all, max_chunk acotado. Starter asume todo en RAM. Falta preamble de nightly OOM y retrospective de bound demostrable.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Out-of-core por chunks
- **Proposed preamble:**  
  - **Contexto:** el batch de triage puede crecer de noche; asumir `load_all` en RAM es OOM programado.  
  - **Meta:** procesar `range(10)` en chunks de 4 y demostrar RAM acotada con `max_chunk`.  
  - **Éxito:** `ooc chunk` / `max_chunk 4` / `ram bounded`.  
  - **Límites:** no uses `ooc load_all`; no reportes `max_chunk=len(data)`.
- **Proposed instruction/description improvements:**  
  1. Starter imprime load_all y `max_chunk` = longitud total.  
  2. Parte `data` en ventanas de `size`.  
  3. Calcula `max_chunk` y elige `ooc 'chunk'` / `ram 'bounded'` si el max ≤ size.  
  4. Imprime los tres campos.
- **Proposed retrospective:**  
  Out-of-core se demuestra con el tamaño máximo de chunk, no con un lema. El error clásico es “en mi laptop cabe”. En T4 el budget pondrá umbral en CI light.
- **Code/output changes:** none
- **Validation notes:** Transfer de política de memoria; coherente con T3-A.

---

### S37-T4-A-DEMO (iDo)
- **Diagnosis:** Demo mínima `under_budget(50, 10) → True`. Description telegráfica; falta preamble de “el budget debe poder fallar” y retrospective del “en mi máquina pasa”. `why` una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El PR de escala del triage no se aprueba porque “se siente más rápido”: se aprueba si measured ≤ budget en el fixture acordado. En la demo, budget 50 ms y measured 10 ms pasan el assert. No escribas: predice el booleano y fíjate que se publican ambos números. Si el test no puede fallar, no es un budget; es decoración de CI.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el test de regresión de performance compara measured contra umbral versionado con el dataset de bench; CI light corre bench corto; nightly puede ser más estricto. Puente a We Do: signo correcto, fail real y multi-métrica.
- **Proposed retrospective:**  
  Budget = umbral que el PR puede romper en rojo. El error clásico es assert siempre verde. We Do: pass, fail y tres dimensiones a la vez.
- **Code/output changes:** none
- **Validation notes:** Output `True` / budget / measured correcto.

---

### S37-T4-A-E1 (weDo, guided)
- **Diagnosis:** Signo invertido `measured > budget`. Defect trivial pero pedagógico. Falta escena de PR y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Budget pass: measured ≤ budget
- **Proposed preamble:**  
  - **Contexto:** el assert del PR sintético de performance del triage debe ser `measured <= budget`, no al revés.  
  - **Meta:** con measured 9 y budget 10, reportar pass y ambos números.  
  - **Éxito:** `True` / `budget 10` / `measured 9`.  
  - **Límites:** no inviertas el signo; no omitas publicar budget y measured.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `measured > budget` (False incorrecto para el caso pass).  
  2. Cambia a `measured <= budget`.  
  3. Imprime el booleano, budget y measured.
- **Proposed retrospective:**  
  El signo del budget es el assert del PR. El error clásico es comparar al revés y “pasar” cuando se viola el umbral. Siguiente (E2): el caso fail debe imprimir `False`.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T4-A-E2 (weDo, independent)
- **Diagnosis:** Budget fail: measured 12 > 10; starter hardcodea `True`. Excelente lección de “el test debe poder fallar”. Falta preamble y retrospective anclados a CI light.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Budget fail: el test puede poner rojo
- **Proposed preamble:**  
  - **Contexto:** un budget que siempre imprime `True` no protege el path de escala; en CI light el rojo es salud del sistema.  
  - **Meta:** con measured 12 y budget 10, reportar `False` calculado.  
  - **Éxito:** `False` / `budget 10` / `measured 12`.  
  - **Límites:** no hardcodees `True`; no “arregles” el caso cambiando measured.
- **Proposed instruction/description improvements:**  
  1. Starter hace `print(True)` aunque measured > budget.  
  2. Usa el mismo predicado `measured <= budget`.  
  3. Imprime el booleano y ambos números.
- **Proposed retrospective:**  
  Un budget que no puede fallar no es un budget. Pregunta: si el scorer sube de 10 a 80 ms y el test sigue verde, ¿quién se entera antes de prod?
- **Code/output changes:** none
- **Validation notes:** Output `False` correcto y valioso pedagógicamente.

---

### S37-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer multi-métrica: latency + memory + pairs. Starter solo budgetea latency y hardcodea all_pass. Excelente; falta preamble de tradeoffs ocultos y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Budget en tres dimensiones
- **Proposed preamble:**  
  - **Contexto:** bajar p95 inflando pares candidatos o memoria es un tradeoff oculto; el gate de escala del triage mira las tres dimensiones.  
  - **Meta:** con límites y medidos de latency/memory/pairs, calcular `all_pass` y listar las tres keys.  
  - **Éxito:** `['latency_p95', 'memory', 'pairs']` / `all_pass True` / `n 3`.  
  - **Límites:** no budgetees solo latency; no hardcodees `all_pass True`.
- **Proposed instruction/description improvements:**  
  1. Starter deja `budget` solo con latency y fuerza `all_pass True`.  
  2. Completa budget con memory 512 y pairs 10000.  
  3. `all_pass = all(measured[k] <= budget[k] for k in keys)`.  
  4. Imprime keys, all_pass y `n` = 3.
- **Proposed retrospective:**  
  Un budget multi-métrica evita tradeoffs ocultos. El error clásico es “pasa p95” con el cartesiano intacto. En T4-B el entregable será el reporte before/after legible.
- **Code/output changes:** none
- **Validation notes:** Transfer real de política de budget; output canónico correcto.

---

### S37-T4-B-DEMO (iDo)
- **Diagnosis:** Demo speedup 4.0, pair_factor 20, same_result True, micro_only False. Description telegráfica; falta preamble de entregable del gate y retrospective de ratio vs resta. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El entregable de escala no es un leaderboard de microbenchmarks: es before/after con el mismo resultado, ratio de wall y factor de pares. En la demo, 100→25 ms (speedup 4×), 1e6→5e4 pares (factor 20) y `result=42` en ambos lados. No escribas: predice speedup, pair_factor y por qué `micro_only` es False. Si omites dataset/hardware o rompes `same_result`, el PR no es comparable.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `speedup = before/after` (ratio, no resta ni inverso); `pair_factor` es “cuántas veces menos pares” (entero), distinto de `reduction` en [0,1] de T2-A; `same_result` se calcula sobre salidas. Puente a We Do: ratio correcto, claridad vs 2 %, claves del reporte.
- **Proposed retrospective:**  
  Before/after con ratio, pares y same_result es el lenguaje del PR de escala. El error clásico es publicar after/before o un 2 % opaco. We Do: speedup, preferencia de claridad y reporte completo.
- **Code/output changes:** none
- **Validation notes:** Output 4.0 / 20 / True / False alineado a theory T4-B.

---

### S37-T4-B-E1 (weDo, guided)
- **Diagnosis:** Inverso after/before y micro_only True. Defect guiado claro. Falta escena de “ratio del revisor” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Speedup = before / after
- **Proposed preamble:**  
  - **Contexto:** el revisor del PR de escala lee un ratio “cuántas veces más rápido”, no el inverso ni una resta de ms.  
  - **Meta:** con before 80 y after 20, calcular speedup 4.0 y marcar `micro_only False`.  
  - **Éxito:** `4.0` / `ok True` / `micro_only False`.  
  - **Límites:** no uses after/before; no marques micro_only si ganó el algoritmo/blocking.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `after / before` (0.25) y `micro_only True`.  
  2. Calcula `speedup = before / after`.  
  3. Imprime speedup, `ok` si es 4.0 y `micro_only False`.
- **Proposed retrospective:**  
  `speedup` es un ratio, no una diferencia ni el inverso. El error clásico es after/before o celebrar un 2 % sin medición. Siguiente (E2): claridad vs micro-shave.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S37-T4-B-E2 (weDo, independent)
- **Diagnosis:** Preferencia claridad vs micro_gain 2 % con regla de umbral. Starter fija micro_shave sin aplicar la regla. Independiente y rico en criterio de producto; falta preamble de costo de bugs/review y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Claridad sobre un shave del 2 %
- **Proposed preamble:**  
  - **Contexto:** el costo total del path de escala incluye bugs y review humana; un 2 % opaco suele ser pérdida neta frente a un gain algorítmico medido (0.80).  
  - **Meta:** preferir `'clarity'` cuando `micro_gain < 0.05` y `algo_gain > micro_gain`, con `shave '2pct_no'`.  
  - **Éxito:** `prefer clarity` / `ok True` / `shave 2pct_no`.  
  - **Límites:** no hardcodees micro_shave; aplica la regla de gains.
- **Proposed instruction/description improvements:**  
  1. Starter fija `prefer="micro_shave"` y `shave="2pct_yes"`.  
  2. Aplica la condición de umbral 0.05 y comparación de gains.  
  3. Deriva `shave` del prefer.  
  4. Imprime prefer, ok y shave.
- **Proposed retrospective:**  
  La claridad es performance de equipo medida con gains, no un lema. Pregunta: si el shave del 2 % oscurece el scorer y no mides, ¿quién paga el bug a las 3 a. m.?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; criterio alineado a learning outcome de costo total.

---

### S37-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer al entregable: claves before/after/dataset/hardware. Starter omite dataset y hardware. Cierre natural de la sección hacia You Do; falta preamble de reproducibilidad y retrospective de defensa de portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reporte: dataset y hardware incluidos
- **Proposed preamble:**  
  - **Contexto:** un speedup sin dataset ni hardware no es comparable entre laptops ni entre PRs; el gate de `CASO-LIM-037` exige el reporte completo.  
  - **Meta:** construir un dict con `before`, `after`, `dataset` y `hardware` y listar las cuatro keys.  
  - **Éxito:** `['before', 'after', 'dataset', 'hardware']` / `ok True` / `n 4`.  
  - **Límites:** no dejes solo before/after; no inventes PII en el dataset (usa etiqueta sintética).
- **Proposed instruction/description improvements:**  
  1. Starter solo tiene before/after.  
  2. Añade `dataset` y `hardware` del lab sintético.  
  3. Publica la lista canónica de keys y `ok` si el set del report coincide.  
  4. Imprime keys, ok y n=4.
- **Proposed retrospective:**  
  El reporte completo es el entregable, no el “feeling” del PR. El error clásico es publicar solo ms. En You Do armarás el dict `report` con pares, reduction, same_result y budget.
- **Code/output changes:** none
- **Validation notes:** Transfer de entregable; puente directo al youDo.

---

### S37-YOU-DO (youDo)
- **Diagnosis:** Proyecto sólido: starter casi completo con `bench`, blocking, `same_result` calculado, budget y `report` con dataset/hardware. `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` cubren el gate. **Falta `retrospective`** de defensa metacognitiva (qué invariante demuestras, PII vs sintético, frase de impacto medible). El context es un poco corto para un true newbie que no ha integrado T1–T4 en un solo entregable; no es bare drill, pero el cierre de reflexión no existe.
- **Checklist:** context pass (parcial, mejorable) · goal pass (objectives) · success pass (rubric + assert) · constraints pass (requirements sin PII) · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (mantener `title` actual del youDo)
- **Proposed preamble:** N/A como campo We Do; opcional enriquecer `context` (propuesta):  
  En `CASO-LIM-037` cierras el gate de escala del triage: mides el path caro O(n²), aplicas blocking, demuestras `same_result` comparando salidas de las funciones cronometradas y publicas un `report` con ms, pares, reduction, budget, dataset y hardware del lab. Solo fixture sintético Red Andina; sin PII real ni inferencia de fraude. El speedup sin `same_result` o sin dataset anotado no cuenta para el portfolio.
- **Proposed instruction/description improvements:**  
  Mantener starter y outputs variables (ms). En `context` o nota de portfolio, recordar: (1) no hardcodear `same_result=True`; (2) anotar hardware real del lab (p. ej. M2-16GB); (3) si el budget falla con n=200, justificar o ajustar blocks/budget con transparencia. Objectives/requirements/rubric ya están alineados.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con el assert de `same_result` y el `budget_pass` calculado? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, n mayor, recall de S30)? (3) Escribe en el README una frase de impacto medible (p. ej. “pares 19900→~1800, same_result True, budget documentado”) que puedas defender en 30 segundos ante un revisor. Puente a S38: colas y reintentos sobre el mismo gate.
- **Code/output changes:** none (ms variables por máquina; predicados del gate ya correctos)
- **Validation notes:** Starter ejecutable y alineado a demos/ejercicios; falta solo capa metacognitiva de cierre.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback más anclado)
1. **S37-T1-A-E1, E2, E3** — medición wall/n, wall+CPU+peak, `same_result` (cimiento del gate)
2. **S37-T1-B-E1, E2, E3** — mediana real, warmup/discard_first, proxy de cola
3. **S37-T2-A-E1, E2, E3** — fórmula de pares, reduction, prefer blocking
4. **S37-T2-B-E1, E2, E3** — set, bloque Lima, order block→score
5. **S37-T3-A-E1, E2, E3** — ceil chunks, columnar, dtype/itemsize
6. **S37-T3-B-E1, E2, E3** — key completa, invalidación, OOC
7. **S37-T4-A-E1, E2, E3** — pass, fail, multi-métrica (el budget debe poder fallar)
8. **S37-T4-B-E1, E2, E3** — speedup, claridad vs 2 %, claves del reporte

### P1
- **8 iDo demos:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras
- **You Do:** añadir `retrospective`; opcional enriquecer `context` con escena de cierre del gate

### P2
- Acortar `instruction` We Do a pasos solo-tarea (la prosa de contexto vive en `preamble`)
- Enriquecer `feedback` (25–60 palabras) anclando al PR de escala / `same_result` / CI light donde aplique
- Diferenciar preambles E1/E2/E3 del mismo subtema (ya hay fade de contenido; la prosa no debe sentirse clonada)

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s37-dbt-bigquery.ts` / id `dbt-bigquery` no describe profiling/rendimiento; el Fixer no debe “corregir” el dominio hacia dbt/BQ — el contenido canónico es escala del triage. Riesgo de confusión del aprendiz solo si el UI expone el id técnico; la ficha ya usa título correcto.
2. **Ms variables:** varios ejercicios usan predicados `*_ok True` (bien). El Fixer no debe “fijar” ms exactos en outputs.
3. **Confusión reduction vs pair_factor:** T2-A usa fracción [0,1]; T4-B usa factor entero. Las preambles/retrospectives propuestas lo explicitan; el Fixer debe preservar esa distinción en hints/feedback.
4. **You Do casi resuelto:** el starter del proyecto ya imprime el `report` completo; la carga cognitiva es “entender y defender”, no construir desde cero. El retrospective debe empujar defensa y tradeoffs, no solo “rellena dataset”.
5. **Recall de blocking (S30):** la sección mide costo de pares; un blocking agresivo que baje recall no es victoria. E3 de T2-A/T2-B y el youDo deben seguir mencionando el tradeoff sin añadir nuevos asserts de recall (fuera de scope del lab de escala).
6. **Volumen:** 24 We Do P0 es mucho texto; el Fixer debe hand-write por unidad (sin plantillas) y respetar longitudes del spec (preamble 80–150 palabras o 4 bullets; retrospective 40–80; instruction 40–100).

---

## Fixer handoff checklist (from spec §11)

- [ ] Every non-trivial unit has `preamble` + `retrospective` (or documented N/A)
- [ ] We Do has short `title`
- [ ] `instruction` is task-only (not the whole essay)
- [ ] Exact outputs preserved unless execute-and-diff justified
- [ ] Spanish PE; no real PII
- [ ] No generators used
- [ ] Section source compiles in static build

---

*Round 1 review only. No source edits in `s37-dbt-bigquery.ts`.*

Section 37 exercise pedagogy review complete. Ready for the Fixer prompt.
