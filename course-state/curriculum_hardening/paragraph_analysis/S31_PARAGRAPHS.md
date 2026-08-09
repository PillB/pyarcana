# S31 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:38:48.782+00:00
Section: Grafos y evidencia relacional
File: `s31-streaming-data.ts`
STORM cycles: **31**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- NetworkX: [Graph types](https://networkx.org/documentation/stable/reference/classes/index.html) — graphs
- NetworkX: [Tutorial](https://networkx.org/documentation/stable/tutorial.html) — API
- NetworkX: [Shortest paths](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html) — paths
- NetworkX: [Centrality](https://networkx.org/documentation/stable/reference/algorithms/centrality.html) — centrality
- Wikipedia: [Graph theory](https://en.wikipedia.org/wiki/Graph_theory) — context
- W3C: [PROV overview](https://www.w3.org/TR/prov-overview/) — provenance
- Neo4j: [Data modeling](https://neo4j.com/docs/getting-started/data-modeling/) — typed edges
- Stanford: [SNAP](https://snap.stanford.edu/) — scale graphs
- Coursera: [Network analysis](https://www.coursera.org/courses?query=network%20analysis%20graph) — MOOC
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De streaming legado a grafos de evidencia (inicio CP-N3-B)
**P1** (rank 9.55/10)
> En V3, **S31 no es el path principal de Kafka/Redis Streams**. Ese material se reubica. Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades con caminos rep…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/classes/index.html; NetworkX: https://networkx.org/documentation/stable/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De streaming legado a grafos de evidencia (inici» in S31_STORM.json.

**P2** (rank 9.55/10)
> El hilo: contactos, cuentas y transacciones **sintéticas** (`run_id=cpn3b-01`, `@example.pe`). El grafo responde “¿qué aristas existen y con qué fuente?” — no “¿quién es culpabl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/tutorial.html; NetworkX: https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De streaming legado a grafos de evidencia (inici» in S31_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad**. Privacidad: centralidad y paths no etiquetan fraude ni parentesco. Caso sintético PE (Lima, Red …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html; NetworkX: https://networkx.org/documentation/stable/reference/algorithms/centrality.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De streaming legado a grafos de evidencia (inici» in S31_STORM.json.

### nodos, aristas, dirección y peso
**P1** (rank 9.55/10)
> Un **nodo** es una entidad (cliente, cuenta, email, teléfono sintético). Una **arista** es un hecho relacional con tipo y, opcionalmente, **dirección** y **peso** (monto, frecue…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/algorithms/centrality.html; Wikipedia: https://en.wikipedia.org/wiki/Graph_theory
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nodos, aristas, dirección y peso» in S31_STORM.json.

**P2** (rank 9.55/10)
> Dirigido vs no dirigido: transferencias son dirigidas; “comparte dirección” suele modelarse no dirigido o bidireccional simétrico. Contrato operativo: entrada filas sintéticas d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Graph_theory; W3C: https://www.w3.org/TR/prov-overview/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nodos, aristas, dirección y peso» in S31_STORM.json.

**P3** (rank 9.55/10)
> El **peso** es evidencia cuantitativa (**no** veredicto de culpa). Documenta **unidades** (PEN, count, score) en el schema del grafo. Caso PE (Lima, Red Andina): contactos `@exa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** W3C: https://www.w3.org/TR/prov-overview/; Neo4j: https://neo4j.com/docs/getting-started/data-modeling/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nodos, aristas, dirección y peso» in S31_STORM.json.

### multigrafo, tiempo y provenance
**P1** (rank 9.55/10)
> Un **multigrafo** permite **varias aristas** entre el mismo par (varias transferencias, varios contactos). **No** colapses a una sola arista sin guardar el detalle fuente — el r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Neo4j: https://neo4j.com/docs/getting-started/data-modeling/; Stanford: https://snap.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «multigrafo, tiempo y provenance» in S31_STORM.json.

**P2** (rank 9.55/10)
> **Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados **filtran por ventana** cuando el caso lo exija (no mezcles 2019 con 2026 sin decirlo). Contrato: fixture `CA…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Stanford: https://snap.stanford.edu/; Coursera: https://www.coursera.org/courses?query=network%20analysis%20graph
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «multigrafo, tiempo y provenance» in S31_STORM.json.

**P3** (rank 9.55/10)
> **Provenance**: `source_system`, `run_id`, `record_id` permiten auditar de dónde salió la arista. **Sin provenance, el grafo es decoración** y no pasa el gate de evidencia de CP…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=network%20analysis%20graph; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «multigrafo, tiempo y provenance» in S31_STORM.json.

### clientes/entidades/transacciones/contactos
**P1** (rank 9.55/10)
> Construyes el grafo desde tablas: **entidades** (nodos), **transacciones** (aristas dirigidas), **contactos** (email/teléfono/dirección como nodos o aristas). La estructura rela…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «clientes/entidades/transacciones/contactos» in S31_STORM.json.

**P2** (rank 9.55/10)
> Patrón habitual: entity —owns→ account; account —transfer→ account; entity —has_contact→ contact_value. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031` (…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «clientes/entidades/transacciones/contactos» in S31_STORM.json.

**P3** (rank 9.55/10)
> Datos **sintéticos** con ids estables (`ent-001`). **Nunca** cargues PII real en ejercicios del curso. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y transferen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «clientes/entidades/transacciones/contactos» in S31_STORM.json.

### deduplicación y agregación sin borrar detalle
**P1** (rank 9.55/10)
> **Deduplicar nodos** tras ER (misma entidad) colapsa ids canónicos; conserva mapa `raw_id → canonical_id`. La estructura relacional se usa para *explicar* conexiones auditables …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; NetworkX: https://networkx.org/documentation/stable/reference/classes/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «deduplicación y agregación sin borrar detalle» in S31_STORM.json.

**P2** (rank 9.55/10)
> **Agregar aristas**: suma montos, cuenta eventos, min/max ts — pero guarda capa de detalle o punteros a `record_id`. Contrato operativo: entrada filas sintéticas del fixture `CA…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/classes/index.html; NetworkX: https://networkx.org/documentation/stable/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «deduplicación y agregación sin borrar detalle» in S31_STORM.json.

**P3** (rank 9.55/10)
> Si solo dejas el agregado, el revisor no puede explicar el camino. El workbench necesita ambas capas. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y transferenc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/tutorial.html; NetworkX: https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «deduplicación y agregación sin borrar detalle» in S31_STORM.json.

### grado, componentes y caminos
**P1** (rank 9.55/10)
> **Grado**: número de vecinos (in/out en dirigidos). Útil para filtrar hubs, no para culpar. La estructura relacional se usa para *explicar* conexiones auditables en investigació…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html; NetworkX: https://networkx.org/documentation/stable/reference/algorithms/centrality.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «grado, componentes y caminos» in S31_STORM.json.

**P2** (rank 9.55/10)
> **Componentes conexas**: partición del grafo no dirigido subyacente. Un caso suele vivir en un subgrafo acotado. Contrato operativo: entrada filas sintéticas del fixture `CASO-L…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/algorithms/centrality.html; Wikipedia: https://en.wikipedia.org/wiki/Graph_theory
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «grado, componentes y caminos» in S31_STORM.json.

**P3** (rank 9.55/10)
> **Caminos**: BFS/DFS con **límite de profundidad**; el path **reproducible** lista nodos, aristas y evidencia. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y tr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Graph_theory; W3C: https://www.w3.org/TR/prov-overview/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «grado, componentes y caminos» in S31_STORM.json.

### centralidad con interpretación limitada
**P1** (rank 9.55/10)
> **Degree / betweenness / closeness** miden **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un dato compartido (call center). La estructura relaciona…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** W3C: https://www.w3.org/TR/prov-overview/; Neo4j: https://neo4j.com/docs/getting-started/data-modeling/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «centralidad con interpretación limitada» in S31_STORM.json.

**P2** (rank 9.55/10)
> Interpreta con contexto: tipo de arista, ventana temporal, y si el nodo es infraestructura vs persona. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031` (r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Neo4j: https://neo4j.com/docs/getting-started/data-modeling/; Stanford: https://snap.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «centralidad con interpretación limitada» in S31_STORM.json.

**P3** (rank 9.55/10)
> Nunca automatices “alta centralidad → fraude”. Eso viola el gate de CP-N3-B. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y transferencias demo; el revisor ve p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Stanford: https://snap.stanford.edu/; Coursera: https://www.coursera.org/courses?query=network%20analysis%20graph
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «centralidad con interpretación limitada» in S31_STORM.json.

### subgrafos y pruebas
**P1** (rank 9.55/10)
> Extrae un **subgrafo de caso**: nodos seed + **k hops** + filtros de tipo/tiempo. Prueba invariantes: sin self-loops basura, pesos ≥ 0, provenance presente. La estructura relaci…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=network%20analysis%20graph; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «subgrafos y pruebas» in S31_STORM.json.

**P2** (rank 9.55/10)
> Tests de grafo: cardinalidades, path existe/no existe, componente esperada, idempotencia de construcción. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «subgrafos y pruebas» in S31_STORM.json.

**P3** (rank 9.55/10)
> Cada bug de construcción (arista invertida, nodo huérfano) debe tener regresión. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y transferencias demo; el revisor …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «subgrafos y pruebas» in S31_STORM.json.

### visualización, escalabilidad, privacidad y evidencia por arista
**P1** (rank 9.55/10)
> Visualiza subgrafos acotados; no intentes dibujar 100k nodos en el navegador del revisor. La estructura relacional se usa para *explicar* conexiones auditables en investigación,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «visualización, escalabilidad, privacidad y evide» in S31_STORM.json.

**P2** (rank 9.55/10)
> **Privacidad**: enmascara PII (email parcial, teléfono parcial). Roles ven solo lo necesario. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031` (run_id=cpn…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; NetworkX: https://networkx.org/documentation/stable/reference/classes/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «visualización, escalabilidad, privacidad y evide» in S31_STORM.json.

**P3** (rank 9.55/10)
> **Evidencia por arista**: al click, muestra records, ts, source — el path debe ser explicable en texto y en UI. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y t…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NetworkX: https://networkx.org/documentation/stable/reference/classes/index.html; NetworkX: https://networkx.org/documentation/stable/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «visualización, escalabilidad, privacidad y evide» in S31_STORM.json.

