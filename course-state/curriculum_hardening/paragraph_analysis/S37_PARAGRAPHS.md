# S37 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T03:52:39.133530+00:00
Section: Profiling, algoritmos y rendimiento
File: `s37-dbt-bigquery.ts`
STORM cycles: **37**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Docs: [perf_counter](https://docs.python.org/3/library/time.html#time.perf_counter) — wall
- Docs: [timeit](https://docs.python.org/3/library/timeit.html) — bench
- Docs: [tracemalloc](https://docs.python.org/3/library/tracemalloc.html) — memory
- Docs: [cProfile](https://docs.python.org/3/library/profile.html) — hot path
- Docs: [statistics](https://docs.python.org/3/library/statistics.html) — median
- Docs: [defaultdict](https://docs.python.org/3/library/collections.html#collections.defaultdict) — inverted index
- SRE: [Monitoring](https://sre.google/workbook/monitoring/) — budgets
- pytest: [pytest](https://docs.pytest.org/) — CI regression
- MIT: [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) — complexity
- Stanford: [CS161](https://web.stanford.edu/class/cs161/) — algo design
- Coursera: [Algorithms Part I](https://www.coursera.org/learn/algorithms-part1) — Big-O
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Py4E: [Python for Everybody](https://www.py4e.com) — stdlib
- Big-O: [Big-O cheat sheet](https://www.bigocheatsheet.com/) — complexity
- GitHub: [py-spy](https://github.com/benfred/py-spy) — sampling profiler
- GitHub: [scalene](https://github.com/plasma-umass/scalene) — CPU+mem
- Live: [PyArcana](https://pillb.github.io/pyarcana/)

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO-LIM-037 DEFECT 24/24 |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert resume | deepened thin paragraphs / resources |

## Theory (paragraph-level)

### Rendimiento del triage (CP-N3-C escala)
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (`time.perf_counter`). **CPU time:** tiempo de procesador. **Warmup:** corrida descartada (cold start miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performa…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/timeit.html; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Rendimiento del triage (CP-N3-C escala)» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Escalar el triage no es «hacer el código más clever»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/tracemalloc.html; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Rendimiento del triage (CP-N3-C escala)» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo de la sección. Entrada: fixture sintético `CASO-LIM-037`, métricas wall/CPU/memoria, conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultad…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/profile.html; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Rendimiento del triage (CP-N3-C escala)» in S37_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. El id de plataforma `dbt-bigquery` se conserva por legacy; el path V3 es profiling y algoritmos del triage N3, no un lab de SQL cloud. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria …
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; MIT: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Rendimiento del triage (CP-N3-C escala)» in S37_STORM.json; edge `research_supports_paragraph`.


### wall/CPU y memory profiling
**P1** (rank 9.55/10)
> Wall time es el reloj de pared que percibe el usuario o el batch; CPU time es el tiempo de procesador; la memoria pico limita si el job cabe en el worker. Para benches didácticos usamos `time.perf_counter` en wall. Un número sin el tamaño n del input no sirve para decidir.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «wall/CPU y memory profiling» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: función del path caliente y n del fixture. Salida: wall_ms, result de correctitud y n. Error: reportar solo ms sin n, o optimizar un tramo frío. Criterio: el profile apunta al matching/grafo o features que dominan el batch sintético, y el resultado…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «wall/CPU y memory profiling» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T1A`: sumamos un rango sintético como proxy de trabajo, anotamos wall_ms y confirmamos result True. En el path real del triage se sustituye por el scorer; la disciplina de medir wall+n se mantiene. Sin PII ni datasets productivos en el laboratorio de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «wall/CPU y memory profiling» in S37_STORM.json; edge `research_supports_paragraph`.


### benchmark fixture, warmup y variabilidad
**P1** (rank 9.55/10)
> La primera corrida miente: caches de CPU, import y JIT de librerías distorsionan el cold start. El warmup descarta esa corrida. Luego se reporta mediana (robusta) y, con más muestras, un proxy de p95. El fixture fija dataset sintético y una nota de hardware del laboratorio.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «benchmark fixture, warmup y variabilidad» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: función work, N runs post-warmup. Salida: median_ms, n_runs, warmup=True. Error: publicar un solo run sin warmup como «verdad». Criterio: si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «benchmark fixture, warmup y variabilidad» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T1B`: work = sum de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «benchmark fixture, warmup y variabilidad» in S37_STORM.json; edge `research_supports_paragraph`.


### complejidad y blocking
**P1** (rank 9.55/10)
> Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo número uno es el conteo de pares antes y después del blocking.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «complejidad y blocking» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: n y número de bloques (didáctico: bloques iguales). Salida: all_pairs, blocked_pairs, reduction. Error: bajar 1% el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto al mismo resultado de matching sobre el fi…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «complejidad y blocking» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T2A`: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En producción las claves de blocking se validan por recall de pares útiles; aquí aprendemos a contar y a priorizar el algoritmo sobre micro-trucos de un porcentaje.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «complejidad y blocking» in S37_STORM.json; edge `research_supports_paragraph`.


### estructuras, vectorización y reducción de candidatos
**P1** (rank 9.55/10)
> dict/set e índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después scorear con el modelo o reglas.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «estructuras, vectorización y reducción de candid» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: filas (ciudad, entity_id) sintéticas. Salida: tamaños por bloque del inverted index y flag structure. Error: scorear el producto cartesiano y luego «optimizar» el scorer. Criterio: el índice se construye una vez y los candidatos salen del bloque, n…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «estructuras, vectorización y reducción de candid» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T2B`: filas Lima/Lima/Cusco → bloques {Lima:2, Cusco:1}. Solo comparamos dentro de Lima. Sin afirmar parentesco ni fraude a partir de la ciudad; es solo clave de blocking sintética de laboratorio.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «estructuras, vectorización y reducción de candid» in S37_STORM.json; edge `research_supports_paragraph`.


### dtypes, chunking y columnar
**P1** (rank 9.55/10)
> Elegir dtypes más angostos (int32 vs int64, categorías) reduce memoria. El chunking procesa el dataset por ventanas para no OOM. El enfoque columnar lee solo las columnas usadas (id, amount) en lugar del registro ancho completo que arrastra blobs innecesarios.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dtypes, chunking y columnar» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: lista o tabla sintética y size de chunk. Salida: chunk_sizes y col_subset. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job declara un bound de memoria y el tamaño de chunk es un tradeoff medido entre overhead de bucle y pico …
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dtypes, chunking y columnar» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T3A`: range(10) en chunks de 3 → [3,3,3,1]; subset de columnas ['id','amount']. Didáctica pura con listas; el mismo criterio aplica a formatos columnares cuando el stack del curso lo permita en secciones previas.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dtypes, chunking y columnar» in S37_STORM.json; edge `research_supports_paragraph`.


### caching, invalidación y out-of-core
**P1** (rank 9.55/10)
> Cachear features o resultados de blocking acelera re-runs, pero un cache stale miente. La clave incluye versión del feature set y cutoff de datos. Out-of-core significa no asumir que todo cabe en RAM: chunk o spill a disco cuando n crece en el batch de triage.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caching, invalidación y out-of-core» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: key (feature_set_version, cutoff). Salida: hit booleano y política de invalidación. Error: cache infinito sin versión de schema. Criterio: al cambiar fs-v3→fs-v4 o el cutoff, el hit cae y se recomputa; el diseño documenta ooc=chunk_if_needed de for…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** SRE: https://sre.google/workbook/monitoring/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caching, invalidación y out-of-core» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T3B`: key=('fs-v3','2026-01-01') almacena n_pairs; hit True. Invalidar por version_or_cutoff. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caching, invalidación y out-of-core» in S37_STORM.json; edge `research_supports_paragraph`.


### performance budget y tests
**P1** (rank 9.55/10)
> Un performance budget fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; nightly puede ser más largo y estricto.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** pytest: https://docs.pytest.org/; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «performance budget y tests» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: budget_ms y measured_ms del fixture. Salida: pass booleano y ambos números. Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repos…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «performance budget y tests» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T4A`: budget 50ms, measured 12ms → pass True. Si un cambio de scorer sube a 80ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://web.stanford.edu/class/cs161/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «performance budget y tests» in S37_STORM.json; edge `research_supports_paragraph`.


### costo total, claridad y no microoptimización
**P1** (rank 9.55/10)
> El costo total incluye ingeniería humana, compute y riesgo de bugs. Una microoptimización del 2% que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — no un leaderboard de microbenchmarks van…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/profile.html; Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «costo total, claridad y no microoptimización» in S37_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: métricas before/after (ms, pairs). Salida: speedup y pair_reduction; micro_only=False cuando el ganador fue blocking/algo. Error: shaving 2% sin medición ni reporte. Criterio: claridad y reducción algorítmica ganan a trucos opacos; el PR explica el…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; SRE: https://sre.google/workbook/monitoring/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «costo total, claridad y no microoptimización» in S37_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-037-T4B`: before 100ms/1e6 pares → after 20ms/5e4 pares: speedup 5×, pair_reduction 20×. El equipo prefiere ese cambio al rewrite en C de un 2%. Datos sintéticos del path N3 de Red Andina ficticia.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/collections.html#collections.defaultdict; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «costo total, claridad y no microoptimización» in S37_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (skeptical; ≥9.5).
- Git: keep worktree (DEFECT/CASO; zero # TODO vs HEAD).
- Content: ethics preserved (anomaly≠guilt / same_result+budget).
