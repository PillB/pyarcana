# S37 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Profiling, algoritmos y rendimiento
- **shortTitle:** Profiling y rendimiento
- **id:** `dbt-bigquery` (archivo `s37-dbt-bigquery.ts`; contenido = escala del triage / matching sintético, **no** dbt ni BigQuery de producto)
- **index:** 37
- **source:** `src/lib/course/sections/s37-dbt-bigquery.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A wall/CPU/mem/cProfile · T1-B benchmark warmup/mediana · T2-A complejidad y blocking · T2-B estructuras e índice invertido · T3-A dtypes/chunks/columnar · T3-B caché e invalidación / OOC · T4-A performance budget · T4-B costo total y reporte before/after
- **hilo:** **CASO-LIM-037** — path de escala del triage (matching y features) sobre fixture sintético Red Andina (Lima/Cusco); gate `same_result` + `before_after` + `budget`; sin PII real; puente S14 + S30 → S37 → S38
- **Round 1 context:** `round1/S37_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

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
| **We Do titles** | Presentes, 4–10 palabras, español PE, alineados al skill (p. ej. «same_result se calcula, no se declara») | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (~51–87 w; varios &lt;80 w — aceptable por spec “4 short bullets”); iDo narrativos con predicción + “no escribas” (~63–90 w) | Pass en estructura |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~24–39 w (bajo piso 40; no bloquear si el path es corto) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (n del wall → wall+CPU+peak → same_result; mediana real → discard_first → proxy cola; fórmula pares → reduction → prefer blocking; set → bloque Lima → order block→score; ceil chunks → columnar → dtype; key+cutoff → version miss → OOC; budget pass → fail → multi-métrica; speedup → claridad 2 % → keys reporte) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug/assert; en **~16–18** unidades el retro **abre con la misma frase** del feedback (eco de misconception, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈25–34 w (spec 40–80); iDo varias 27–36 w; principio + puente suelen estar; self-check presente en ~8 weDo (bueno), ausente en el resto | Residual **P2** |
| **Feedback length** | Varias unidades ~20–24 w (piso 25); peores relativos: T2-B-E2 (~20), T3-A-E1 (~22), T3-B-E1 (~20), T4-A-E3 (~20), T4-B-E1/E3 (~23) | Residual **P2** |
| **iDo why** | 8/8 en rango usable (~46–70+ w al leer fuente; predicados + puente We Do) | Pass |
| **Código/outputs** | Coherentes con theory y CASO-LIM-037; DEFECT `# DEFECT:` excelente; predicados estables donde ms varían; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad |
| **youDo frame** | context de cierre de gate (~96 w), objectives, requirements éticos, starter ejecutable casi completo, rubric 6+bonus, portfolioNote, retrospective de defensa (~73 w) | Pass |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check distinto, feedback &lt;25 w en varias, iDo retros levemente cortas). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

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

### S37-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: wall/CPU/peak predicados + `hot_fn expensive` con `n=10000`. Preamble (~90 w) pide predicción de hot path y explica predicados vs ms fijos. `why` en rango (perf_counter / process_time / tracemalloc del work / cProfile). Retro repara wall sin `n` y micro-shave de loop frío; puente a We Do.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~50 w ya cerca del piso; self-check ya implícito en “si puedes explicar…”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S37-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `n 1000` / `metric wall` / `ok True`. Instruction nombra DEFECT (`print n 0`). Feedback ancla al revisor del PR (fixture creció en silencio). Retro distinta en ángulo (medir bien / reportar mal + puente E2). Starter wrong (`n 0`) ≠ solution (`n 1000`).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~33 w → +self-check “¿qué comparas entre dos PRs si falta n?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S37-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Independiente fuerte: wall+CPU+peak del **work** con `n=5000`. Preamble en rango (~87 w). Feedback y retro se solapan en “tres lecturas / peak fuera de work engaña budget” (eco fuerte); retro ~29 w.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Medir tres señales del mismo `work` es política de CI light, no un checklist vacío. El error clásico es hardcodear `cpu_ok`/`peak_ok` en `True` o envolver una alocación aparte con `tracemalloc`. Pregunta: si wall es bajo pero peak del path real supera el budget de RAM, ¿qué optimizas primero y por qué? Luego (E3): `same_result` se calcula, no se declara.
- **Code/output changes:** none (solution añade lista en `work` para alocación real — justificado; no tocar output)

### S37-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer al corazón del gate: `after_fn` `v+2` vs `v*2`. Feedback razona cálculo vs fe; retro añade error clásico de contrato + puente You Do (menos eco mortal). Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro al piso 40 w con self-check “¿qué rompe en matching si after devuelve +2?”)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S37-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Demo clara warmup + 5 runs + mediana/spread predicados. Preamble de “1ª corrida miente”. `why` en rango. Retro (~36 w) repara mean inventado / un solo run pero sin self-check y bajo piso 40.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Bench serio = warmup + N runs + mediana + nota de variabilidad. El error clásico es mean de números inventados o un solo run frío vendido como performance del algoritmo. Pregunta: si publicas el cold start y el budget de CI light es justo, ¿quién paga el flaky? We Do: medir de verdad, `discard_first` y proxy de cola con nombre.
- **Code/output changes:** none

### S37-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Defect excelente (`mean([5,1,4])`, `warmup False`). Feedback y retro abren casi idénticos (“Mediana + warmup sobre tiempos reales…”). Eco de higiene de bench.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Inventar enteros “que se ven bien” rompe reproducibilidad del PR de escala: el revisor no puede re-ejecutar el fixture. El error clásico es `statistics.mean` de una lista de juguete. Pregunta: ¿por qué el contrato del lab es un predicado `med_ms >= 0` y no un ms exacto? Luego (E2): hacer explícito el `discard_first`.
- **Code/output changes:** none

### S37-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Política de cold start bien anclada a CI light flaky. Retro corta (~22 w) y reutiliza la pregunta del feedback (“si el warmup falla…”). Instruction en piso (~40 w).
- **Checklist:** all pass; retro partial (longitud + eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `discard_first` es política de bench documentada, no un booleano cosmético que se imprime en `True` sin cambiar el flujo. El error clásico es meter el primer run en la mediana y culpar al algoritmo. Pregunta: si `n_runs` incluye el warmup, ¿qué le mientes al revisor del budget? Luego (E3): proxy de cola con N chico.
- **Code/output changes:** none

### S37-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer limpio max/spread + nombre `p95_small_n`. Feedback y retro alineados pero retro añade SLI de prod y puente T4 — usable sin eco mortal. Instruction corta (~39 w) aceptable en transfer.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S37-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Demo compacta 6 vs 2 pares. Preamble ancla O(n²) y recall S30. `why` en rango. Retro (~32 w) corta; repara ms del scorer con n² intacto.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Contar pares es el primer instrumento de escala del matching. El error clásico es mirar solo ms del scorer con n² intacto o celebrar un blocking que baje recall (S30). Pregunta: si `all_p` no cae, ¿qué ganas micro-shaveando el inner loop? We Do: fórmula correcta, `reduction` y preferir blocking a microopt.
- **Code/output changes:** none

### S37-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Defect clásico `n*n`. Feedback y retro abren igual (“La fórmula de pares es la base del costo de escala”). Instruction corta (~28 w) pero suficiente para E1 guiado.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `n*(n-1)//2` excluye diagonal y dobles: es el conteo que el revisor del path de matching puede confiar. El error clásico es `n*n` o inventar el 45 sin fórmula. Pregunta: con `n=10`, ¿qué sobra en el 100 de `n*n`? Luego (E2): `reduction` como fracción eliminada, no residual.
- **Code/output changes:** none

### S37-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Buena distinción reduction vs residual vs `pair_factor` (hints + límites). Feedback y retro eco en “Sin reduction no hay evidencia…”. Retro trae self-check de recall S30 (valioso).
- **Checklist:** all pass; feedback/retro partial (eco en apertura)
- **Severity residual:** P2
- **Proposed feedback (if touched):**  
  `blocked/all` es el residual de candidatos, no la fracción eliminada. `reduction = 1 − blocked/all` vive en [0,1] y se compara entre fixtures; no lo confundas con `pair_factor = all//blocked` (entero de T4-B).
- **Proposed residual on retro:** conservar la pregunta de recall; solo reescribir la primera frase para no clonar feedback.
- **Code/output changes:** none

### S37-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer de priorización 4950→450 vs micro 4900. Feedback y retro eco fuerte (“Priorizar blocking se decide con números de pares…”). Criterio de producto sólido.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El PR del 1–2 % con n² casi intacto es teatro de escala: los números de pares deciden, no el lema de “código más ingenioso”. El error clásico es hardcodear `prefer='blocking'` sin comparar `blocked` vs `micro_pairs`. Pregunta: si micro_pairs fuera 400 y blocked 450, ¿qué preferirías y por qué? En T2-B el orden operativo será block→score.
- **Code/output changes:** none

---

### S37-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Índice invertido Lima/Cusco con ética de “ciudad ≠ parentesco”. Preamble fuerte. Retro (~28 w) corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Indexar primero es optimización de verdad: el scorer opera dentro del bloque. El error clásico es scan lineal repetido o scorear el cartesiano “porque el scorer es el cuello”. Pregunta: si Lima tiene tamaño 2 y Cusco 1, ¿cuántos pares locales predices en Lima? We Do: set vs list_scan, count de Lima y orden block→score.
- **Code/output changes:** none

### S37-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Membership set vs list_scan. Eco feedback/retro en “Elegir la estructura correcta…”. Defect de diseño bien nombrado.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Documentar `structure set` y `scan False` fuerza la decisión de diseño, no solo el booleano `found`. El error clásico es list membership en bucle caliente del triage (O(n) × pares). Pregunta: si `found` ya es True con lista, ¿por qué igual falla el gate del lab? Luego (E2): tamaño del bloque Lima.
- **Code/output changes:** none

### S37-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Count Lima simple pero anclado a “predice pares locales”. Feedback corto (~20 w) con nota ética; retro con self-check de skew 90 % (bueno). Menos eco de apertura.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  El tamaño del bloque predice los pares locales del scorer (`size*(size-1)//2` dentro de Lima). Ciudad es clave de lab: no afirma parentesco ni fraude. Contar Cusco dentro de Lima miente al costo del matching.
- **Code/output changes:** none

### S37-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer fuerte order `['block','score']` + `pairs_after=blocked`. Feedback y retro eco en “El orden block→score se demuestra con el conteo…”. Starter invierte orden y no reduce — discrimina.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Features O(n²) “porque el scorer es el cuello” invierten el path de escala: primero se reduce el espacio de candidatos. El error clásico es dejar `pairs_after = all_pairs` con un lema de block. Pregunta: con `pairs_after_block 5` y `all_pairs 45`, ¿qué evidencia llevas al revisor? En memoria (T3) acotarás el pico con chunks y dtypes.
- **Code/output changes:** none

---

### S37-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Chunks `[3,3,3,1]`, subset sin blob, bound int32. Preamble OOM nocturno. Retro (~27 w) corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Memoria se diseña: chunks, columnas y dtypes con bound medible. El error clásico es `load_all` + int64 por defecto “porque en mi laptop cabe”. Pregunta: si `blob` viaja al worker, ¿qué crece aunque el scorer no lo use? We Do: ceil de chunks, proyección y itemsize.
- **Code/output changes:** none

### S37-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Ceil vs `//`. Feedback corto (~22 w) y eco con retro (“Contar chunks planifica…”).
- **Checklist:** all pass; feedback/retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Truncar con `//` “pierde” el último lote: el plan del nightly queda incompleto y el resto se procesa en silencio o se cae. El error clásico es asumir chunks uniformes sin resto. Pregunta: con `n=10` y `size=4`, ¿qué filas quedarían fuera si usas solo `n//size`? Luego (E2): no cargar columnas basura.
- **Proposed feedback (expand if touched):**  
  Contar chunks con ceil planifica el job out-of-core. `n//size` reporta 2 en vez de 3 y el revisor del budget de memoria no ve el último lote del fixture sintético.
- **Code/output changes:** none

### S37-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Proyección columnar. Feedback y retro eco en “Columnar es reducción de I/O…”. Self-check en retro (justificar `notes`) bueno.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed residual on retro:** reescribir apertura; conservar pregunta al revisor sobre `notes`.
- **Code/output changes:** none

### S37-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** dtype por itemsize. Feedback corto (~23 w) y eco con retro sobre “presupuesto de RAM en bytes”. Transfer real de criterio.
- **Checklist:** all pass; feedback/retro partial (eco + fb longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  El dtype se elige midiendo `itemsize` (`'i'` vs `'q'`), no por fe de “int64 siempre seguro”. Sin comparar bytes, el default ancho infla el bound del batch sintético aunque el dominio quepa en int32.
- **Proposed retrospective (replace):**  
  Overflow sigue siendo riesgo si el dominio no cabe: aquí el lab asume que sí y exige evidencia de ahorro. El error clásico es forzar int64 sin medición. Pregunta: si `i32 == i64` en una plataforma rara, ¿qué imprime el lab y por qué `ok` depende de la comparación? En caché (T3-B) el riesgo pasa a ser datos stale, no solo bytes.
- **Code/output changes:** none

---

### S37-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** hit_v1 / miss_v2 claro; preamble ancla stale vs `same_result`. Retro (~28 w) corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Hit/miss y versión son parte del diseño del path de triage, no un afterthought. El error clásico es cache infinito sin schema de feature set. Pregunta: si `hit_v2` fuera True con `fs-v1` en store, ¿qué mientes al matching? We Do: key completa, miss por versión y OOC por chunks.
- **Code/output changes:** none

### S37-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Key incompleta sin cutoff. Feedback corto (~20 w) y eco total con retro (“La key completa… *es* la invalidación”).
- **Checklist:** all pass; feedback/retro partial (eco + fb longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin cutoff, distinto lote temporal colisiona con scores viejos y el hit “verde” es mentira. El error clásico es key de un solo elemento o hardcodear `hit True`. Pregunta: ¿por qué `ok` exige `len(key)==2` además del hit? Luego (E2): miss explícito al cambiar versión.
- **Proposed feedback (expand):**  
  La key completa (versión + cutoff) evita colisiones entre corridas del triage. Sin cutoff reutilizas scores viejos y el matching miente en silencio aunque el print “se vea limpio”.
- **Code/output changes:** none

### S37-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** version_change / stale. Feedback ancla `same_result`; retro repite “Invalidar es parte del diseño” + buena pregunta de scorer v2. Eco de apertura.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed residual on retro:** reescribir apertura; conservar pregunta sobre scores `fs-v1` con scorer `fs-v2`.
- **Code/output changes:** none

### S37-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** OOC chunk vs load_all. Feedback y retro eco en “Out-of-core se demuestra con max_chunk…”. Transfer coherente con T3-A.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  “En mi laptop cabe” no es un bound de memoria para el nightly del triage. El error clásico es reportar `max_chunk=len(data)` con `ooc load_all`. Pregunta: si `max_chunk` es 4 y `size` es 4, ¿qué evidencia de RAM acotada llevas al budget de T4? En T4 el umbral podrá fallar en CI light.
- **Code/output changes:** none

---

### S37-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Demo mínima `under_budget(50,10)`. Preamble de “si no puede fallar, no es budget”. Retro (~27 w) corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Budget = umbral versionado que el PR puede romper en rojo. El error clásico es assert siempre verde o publicar solo el booleano sin budget/measured. Pregunta: si measured es 10 y budget 50, ¿qué falta en el PR si omites los dos números? We Do: pass, fail real y tres dimensiones a la vez.
- **Code/output changes:** none

### S37-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Signo invertido. Feedback y retro eco en “El signo del budget es el assert del PR”. Instruction corta (~26 w) OK para defecto local.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Comparar al revés hace “pasar” cuando se viola el umbral y engaña a CI light. El error clásico es `measured > budget` copiado de un test de “exceso”. Pregunta: con measured 9 y budget 10, ¿qué imprime un signo invertido y por qué el revisor lo rechaza? Luego (E2): el caso fail debe imprimir `False` calculado.
- **Code/output changes:** none

### S37-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Lección fuerte “el test debe poder fallar”; output canónico `False`. Feedback y retro casi **idénticos** (misma frase + misma pregunta de scorer 10→80 ms). Eco máximo.
- **Checklist:** all pass; feedback/retro partial (eco fuerte)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Hardcodear `print(True)` es decoración de CI, no regresión de performance. El error clásico es “arreglar” el caso bajando measured en el test. Pregunta: si el scorer sube de 10 a 80 ms y el test sigue verde, ¿quién se entera antes de prod? Luego (E3): budget en latency + memory + pairs a la vez.
- **Code/output changes:** none

### S37-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Multi-métrica. Feedback corto (~20 w); retro eco en “budget multi-métrica / tradeoffs ocultos”. Transfer real de política.
- **Checklist:** all pass; feedback/retro partial (eco + fb longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Bajar p95 inflando pares candidatos o memoria es un tradeoff oculto. El gate de escala exige `measured[k] <= budget[k]` en latency, memory y pairs — no un `all_pass True` hardcodeado con solo latency en el dict.
- **Proposed retrospective (replace):**  
  El error clásico es “pasa p95” con el cartesiano intacto. Pregunta: si memory y pairs fallan pero latency pasa, ¿qué debe imprimir `all_pass` y por qué? En T4-B el entregable será el reporte before/after legible con dataset y hardware.
- **Code/output changes:** none

---

### S37-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** speedup 4.0, pair_factor 20, same_result, micro_only False. Preamble de entregable del gate. `why` distingue reduction vs pair_factor (crítico). Retro (~34 w) usable; leve bajo piso.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: +self-check “¿por qué pair_factor no es reduction?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S37-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Inverso after/before. Feedback (~23 w) y retro eco en “speedup es un ratio…”. Defect claro.
- **Checklist:** all pass; feedback/retro partial (eco + fb longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  after/before (0.25) confunde al revisor: no es “cuántas veces más rápido”. El error clásico es marcar `micro_only True` cuando ganó blocking/algoritmo. Pregunta: con before 80 y after 20, ¿qué ratio debe ver el PR y por qué `micro_only` es False? Luego (E2): claridad vs shave del 2 %.
- **Code/output changes:** none

### S37-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Criterio de producto rico (clarity vs 2 %). Feedback y retro eco en “La claridad es performance de equipo…” + misma pregunta de las 3 a. m.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Aplicar la regla de gains (`micro_gain < 0.05` y `algo_gain > micro_gain`) es la decisión medible; hardcodear `prefer='clarity'` sin la condición es teatro. El error clásico es el PR del 2 % opaco sin medición. Pregunta: si micro_gain fuera 0.12 y algo_gain 0.10, ¿qué preferirías según la regla del lab? En E3: claves del reporte completo.
- **Code/output changes:** none

### S37-T4-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer al entregable (dataset/hardware). Feedback y retro eco en “El reporte completo es el entregable…”. Puente natural al You Do.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Publicar solo ms before/after no es comparable entre laptops ni entre PRs. El error clásico es dejar `ok True` con dos claves. Pregunta: si el set del report no coincide con `{before, after, dataset, hardware}`, ¿qué falla en el gate de CASO-LIM-037? En You Do armarás el dict `report` con pares, reduction, same_result y budget.
- **Code/output changes:** none

---

### S37-YOU-DO (youDo) — **A**
- **Diagnosis:** Proyecto sólido post-R1: context de cierre de gate (~96 w) con anti-hardcode de `same_result`, hardware real y transparencia de budget; objectives/requirements/rubric alineados; starter ejecutable con `bench`, blocking, `same_result` calculado, `report` casi completo y assert; retrospective de defensa en tres preguntas + puente S38 (~73 w). Carga cognitiva = entender y defender, no construir desde cero — coherente con “starter casi resuelto” del residual risk R1.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: en portfolioNote recordar no inventar PII al renombrar dataset)
- **Proposed residual:** none required
- **Code/output changes:** none (ms variables por máquina; predicados del gate correctos)

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** No hay campos ausentes, wrong≈right, ni preambles que impidan al newbie saber qué practicar / éxito esperado.

### P1
- **Ninguno bloqueante.** La sección es usable end-to-end para learner.

### P2 (polish — orden sugerido por impacto de eco)
1. **Eco feedback/retro más fuerte** (reescribir solo `retrospective`, conservar feedback si ya razona el bug):  
   T4-A-E2 · T1-A-E2 · T1-B-E1 · T2-A-E1 · T2-A-E3 · T2-B-E1 · T2-B-E3 · T3-A-E1 · T3-B-E1 · T3-B-E3 · T4-A-E1 · T4-B-E2 · T4-B-E3 · T3-A-E2 · T3-A-E3 · T3-B-E2 · T4-A-E3 · T4-B-E1 · T2-A-E2 · T1-B-E2  
2. **Feedback &lt;25 w** (expandir si se toca la unidad): T2-B-E2 · T3-B-E1 · T4-A-E3 · T3-A-E1 · T3-A-E3 · T4-B-E1 · T4-B-E3  
3. **iDo retros cortas** (expandir con self-check + puente): T1-B-DEMO · T2-A-DEMO · T2-B-DEMO · T3-A-DEMO · T3-B-DEMO · T4-A-DEMO  
4. **Opcional:** subir weDo retros al piso ~40 w donde solo hay principio+puente sin self-check; instructions muy cortas (T2-A-E1, T4-A-E1/E2) solo si el Fixer reescribe la unidad por eco.

### Do not
- No “corregir” el dominio del archivo hacia dbt/BigQuery.
- No fijar ms exactos en outputs (predicados `*_ok` / median predicados son correctos).
- No fusionar `reduction` [0,1] con `pair_factor` entero.
- No generar prosa con plantillas ni copiar el mismo párrafo de eco entre unidades.

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s37-dbt-bigquery.ts` / id `dbt-bigquery` sigue sin describir profiling; no es defecto pedagógico del ejercicio si el UI usa el título de sección.
2. **Eco sistemático post-R1:** el Fixer R1 reutilizó a menudo la misma frase en feedback y retrospective (propuestas R1 muy cercanas). R2 debe **diferenciar**: feedback = razonamiento inmediato del defecto; retrospective = principio + misconception *distinto o ampliado* + transfer/self-check.
3. **You Do casi resuelto:** la defensa metacognitiva del retrospective ya empuja impacto medible; no convertir el starter en blank scaffold.
4. **Recall de blocking (S30):** T2-A-E2 ya pregunta el tradeoff; no añadir asserts de recall fuera de scope.
5. **Volumen de polish:** ~20 unidades con eco — el Fixer R2 debe hand-write por unidad, no search-replace de una plantilla de “Pregunta:…”.

---

## Integrity spot-checks (representative)

| Unit | Starter signal | Solution signal | OK? |
|------|----------------|-----------------|-----|
| T1-A-E1 | `n 0` | `n 1000` | yes |
| T1-A-E3 | `same_result False` (v+2) | `same_result True` (v*2) | yes |
| T1-B-E1 | mean inventado / warmup False | predicado + warmup True | yes |
| T2-A-E1 | `100` | `45` | yes |
| T2-A-E2 | `0.222` | `0.778` | yes |
| T2-B-E3 | order score→block, pairs=all | block→score, pairs=5 | yes |
| T3-B-E2 | `hit True` / keep_forever | `version_change` / hit False | yes |
| T4-A-E2 | `True` hardcode | `False` calculado | yes |
| T4-B-E1 | `0.25` / micro_only True | `4.0` / micro_only False | yes |
| You Do | assert same_result + report keys | gate_ok path | yes |

---

## Fixer handoff checklist (from spec §11)

- [x] Every non-trivial unit has `preamble` + `retrospective` (present post-R1)
- [x] We Do has short `title`
- [x] `instruction` is task-only (not the whole essay)
- [x] Exact outputs preserved unless execute-and-diff justified
- [x] Spanish PE; no real PII
- [x] No generators used (this review)
- [ ] Section source compiles in static build — **Fixer R2** after polish
- [ ] P2 eco/length polish applied where listed — **Fixer R2**

---

*Round 2 review only. No source edits in `s37-dbt-bigquery.ts`.*

Section 37 exercise pedagogy review complete. Ready for the Fixer prompt.
