import type { CourseSection } from '../../types'

export const section31: CourseSection = {
  id: "streaming-data",
  index: 31,
  title: "Grafos y evidencia relacional",
  shortTitle: "Grafos y evidencia",
  tagline: "grafo de evidencia relacional: responde cómo están conectados con camino reproducible y sin convertir centralidad en culpabilidad",
  estimatedHours: 18,
  level: "Integración avanzada",
  phase: 2,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-violet-500 to-indigo-800",
  jobRelevance:
    "En investigación de relaciones entre entidades — banca, BPO (tercerización de procesos) y compliance en Perú — necesitas un grafo de evidencia: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Aquí aprendes a construir ese grafo sobre el resultado del entity resolution, respondiendo cómo están conectadas las entidades. El grafo describe relaciones, no culpabilidad: esa decisión siempre es humana.",
  learningOutcomes: [
    { text: "Modelar nodos/aristas con peso y dirección" },
    { text: "Representar multigrafo temporal con provenance" },
    { text: "Construir grafo desde entidades y transacciones" },
    { text: "Agregar sin borrar detalle fuente" },
    { text: "Calcular grado, componentes y caminos" },
    { text: "Interpretar centralidad con límites" },
    { text: "Extraer subgrafos y probarlos" },
    { text: "Visualizar con privacidad y evidencia por arista" },
  ],
  theory: [
    {
            heading: "Saber quién es cada uno todavía no dice cómo están conectados",
      paragraphs: [
        "S30 resolvió identidades: estos dos registros son la misma persona. Esta sección hace la pregunta siguiente, que es distinta y más delicada — qué relación hay entre entidades ya resueltas, y qué evidencia sostiene cada afirmación de relación.",
        "Un grafo es la estructura natural para eso. Los **nodos** son las entidades resueltas; las **aristas** son los hechos que las conectan: hubo una transferencia, comparten una dirección. Con los datos de contacto hay una decisión de modelado que esta sección toma explícitamente más adelante — un teléfono compartido puede dibujarse como arista directa entre dos personas o como un nodo propio al que ambas apuntan — y las dos formas responden preguntas distintas. Lo importante es que cada arista no es una opinión sino un registro con origen — de qué fila salió, cuándo, con qué confianza. Una arista sin **provenance** es decoración: se ve convincente y no se puede auditar.",
        "Con esa estructura aparece la pregunta que la hace útil: ¿hay un **camino** entre A y B, y de cuántos pasos? Dos personas conectadas por una transferencia directa no están en la misma situación que dos conectadas por cuatro saltos a través de un teléfono compartido en una oficina. La longitud y el tipo de cada paso son parte del hallazgo, no un detalle técnico.",
        "Aquí conviene ser explícito sobre el límite, porque este es el material con el que más fácil se abusa. Un camino en el grafo explica cómo dos entidades están conectadas en los datos. No prueba parentesco, no prueba colusión y no etiqueta a nadie. Lo que ve el revisor es el camino más su evidencia, nunca un veredicto automático.",
        "La pregunta que gobierna la sección junta las dos mitades: **¿qué camino conecta a estos dos, y qué respalda cada paso de ese camino?** Trabajas con contactos, cuentas y transferencias sintéticas del fixture `CASO-LIM-031`.",
      ],
      callout: {
        type: "info",
        title: "Puente desde S30",
        content:
          "Los ids canónicos del ER alimentan nodos; las transacciones y contactos alimentan aristas. Sin provenance, el grafo es decoración y no sirve al workbench (mesa de trabajo del investigador).",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, esquema de aristas y contrato de entrada.",
        "**Orden de los subtemas.** T1 fija el modelo. T2 construye el grafo desde filas. T3 aplica los algoritmos de recorrido. T4 cierra con calidad y privacidad.",
        "**Esquema canónico de aristas** en esta sección, con sus extremos, porque el tipo sin los extremos no basta para construir el grafo: `owns` va de una **entidad** a una **cuenta**; `transfer` va de **cuenta a cuenta**, nunca de una persona a otra; `has_phone` y `has_email` van de una entidad al **valor de contacto**. Cada una con tipo, peso y provenance. `shared_phone` y `shared_address` también aparecen en el material, pero como **atajos derivados** —resúmenes precalculados de «estas dos entidades coinciden en un contacto»—, no como el modelo primario; T1-B explica por qué la diferencia importa.",
        "**Contrato de entrada.** Filas convertidas a grafo con tipos, pesos y origen. Si falta `record_id` o el schema no cuadra, el error es tipificado y explícito. Los ids canónicos que produjo el ER alimentan los nodos; las transacciones y contactos alimentan las aristas.",
      ],
    },
    {
      heading: "Nodos, aristas, dirección y peso",
      subtopicId: "S31-T1-A",
      paragraphs: [
        "Un **nodo** es una entidad del caso: cliente, cuenta, email o teléfono sintético. Una **arista** es un **hecho relacional** con tipo (`etype`), y opcionalmente **dirección** y **peso**. El peso puede ser monto en PEN, frecuencia o score de confianza. Sin tipos estables, el path del revisor no se puede filtrar ni auditar.",
        "Dirigido vs. no dirigido: las transferencias son **dirigidas**. “Comparte teléfono/dirección” suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
        "El **peso** es evidencia cuantitativa (**no** veredicto). Declara **unidades** en el schema por etype: `PEN`, `count` o `score`. Mezclar unidades en el mismo campo sin documentarlas rompe agregaciones y rankings posteriores del workbench.",
      ],
      code: {
        language: 'python',
        title: "graph_model.py",
        code: `def s31_th_1():
    # modelo mínimo con unidad de peso por etype (CP-N3-B)
    nodes = {
        "E1": {"kind": "entity", "label": "Cliente-Demo-01"},
        "E2": {"kind": "entity", "label": "Cliente-Demo-02"},
        "C1": {"kind": "account", "label": "cta-1001"},
    }
    edges = [
        {"src": "E1", "dst": "C1", "etype": "owns", "weight": 1.0, "unit": "count", "directed": True},
        {"src": "E1", "dst": "E2", "etype": "shared_phone", "weight": 0.8, "unit": "score", "directed": False},
        {"src": "C1", "dst": "E2", "etype": "transfer", "weight": 250.0, "unit": "PEN", "directed": True},
    ]
    print("n_nodes", len(nodes))
    print("n_edges", len(edges))
    print("types", sorted({e["etype"] for e in edges}))
    print("units", sorted({e["unit"] for e in edges}))

s31_th_1()
`,
        output: `n_nodes 3
n_edges 3
types ['owns', 'shared_phone', 'transfer']
units ['PEN', 'count', 'score']`,
      },
      callout: {
        type: "tip",
        title: "Schema primero",
        content:
          "Define tipos de nodo/arista antes de cargar filas; evita 'edge_type=misc' opaco.",
      },
    },
    {
      heading: "Multigrafo, tiempo y provenance",
      subtopicId: "S31-T1-B",
      paragraphs: [
        "Un **multigrafo** permite **varias aristas** entre el mismo par (varias transferencias, varios contactos). **No** colapses a una sola arista sin guardar el detalle fuente: el revisor necesita los `record_id` para auditar cada hecho.",
        "**Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados **filtran por ventana** cuando el caso lo exija; no mezcles 2019 con 2026 sin documentarlo. Si falta `record_id`, el builder debe fallar de forma tipificada (rechazo explícito, no arista “huérfana” silenciosa).",
        "**Provenance** (`source_system`, `run_id`, `record_id`) responde “¿de dónde salió esta arista?”. El revisor de CP-N3-B abre un hop y debe poder saltar al registro fuente en el ledger o CRM sintético. Sin provenance el grafo es solo layout: no sirve para auditoría ni para la cola humana.",
      ],
      code: {
        language: 'python',
        title: "multigraph_prov.py",
        code: `def s31_th_2():
    # multiaristas E1→E2 con provenance
    raw_edges = [
        {"src": "E1", "dst": "E2", "etype": "transfer", "amount": 100.0,
         "ts": "2026-01-10T10:00:00Z", "source": "tx_ledger", "record_id": "tx-1"},
        {"src": "E1", "dst": "E2", "etype": "transfer", "amount": 50.0,
         "ts": "2026-01-12T15:00:00Z", "source": "tx_ledger", "record_id": "tx-2"},
        {"src": "E1", "dst": "E2", "etype": "shared_email", "amount": 1.0,
         "ts": "2026-01-01T00:00:00Z", "source": "crm", "record_id": "crm-9"},
    ]
    print("multi_count", len(raw_edges))
    print("sources", sorted({e["source"] for e in raw_edges}))
    print("has_provenance", all("record_id" in e and "source" in e for e in raw_edges))

s31_th_2()
`,
        output: `multi_count 3
sources ['crm', 'tx_ledger']
has_provenance True`,
      },
      callout: {
        type: "warning",
        title: "No borrar detalle",
        content:
          "Agregar montos está bien; borrar record_id rompe la auditoría del workbench.",
      },
    },
    {
      heading: "Clientes, entidades, transacciones y contactos",
      subtopicId: "S31-T2-A",
      paragraphs: [
        "Construyes el grafo desde tablas: **entidades** (nodos persona/organización), **cuentas**, **transacciones** (aristas dirigidas) y **contactos** (email/teléfono/dirección como nodos o como aristas tipadas). Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico.",
        "Patrón habitual: entity —`owns`→ account; account —`transfer`→ account; entity —`has_phone`/`has_email`→ valor de contacto. Preferencia canónica: el valor de contacto como **nodo** intermedio (`E1 → ph:900 ← E2`), no como la arista directa `shared_phone`. Las flechas ahí indican cómo se registró el hecho —de la persona hacia su teléfono—, no un sentido de recorrido: las preguntas de alcance («¿hay un camino entre A y B?») se responden sobre el grafo **no dirigido** subyacente, como hará el recorrido en anchura de T3. Leídas como dirección de tránsito, esas dos flechas convergentes parecerían dejar a E1 y E2 incomunicados, que es justo lo contrario de lo que el patrón muestra. La razón es concreta: si el teléfono es un nodo, se ve de un vistazo cuántas entidades lo comparten — dos es una señal, cuarenta es una centralita. Con aristas directas entre personas ese número queda repartido y hay que reconstruirlo. `shared_phone` se conserva como atajo derivado para consultas rápidas, no como el modelo primario. En ambos casos es un **hecho de contacto compartido** — no parentesco ni fraude.",
        "Usa ids **sintéticos estables** (`ent-001`, `acc-1`) y dominios demo (`@example.pe`). Ids estables hacen la construcción **idempotente** (mismas filas → mismo grafo ordenado). Nunca cargues PII (datos personales identificables) real en ejercicios del curso.",
      ],
      code: {
        language: 'python',
        title: "build_from_tables.py",
        code: `def s31_th_3():
    entities = [
        {"id": "ent-001", "name": "Ana López"},
        {"id": "ent-002", "name": "Luis Ríos"},
    ]
    accounts = [
        {"id": "acc-1", "owner": "ent-001"},
        {"id": "acc-2", "owner": "ent-002"},
    ]
    txs = [
        {"id": "tx-1", "src": "acc-1", "dst": "acc-2", "amount": 120.0},
    ]
    contacts = [
        {"entity": "ent-001", "kind": "email", "value": "ana@example.pe"},
        {"entity": "ent-002", "kind": "email", "value": "luis@example.pe"},
        {"entity": "ent-001", "kind": "phone", "value": "+51-900-000-001"},
        {"entity": "ent-002", "kind": "phone", "value": "+51-900-000-001"},  # shared phone sintético
    ]
    contact_values = {c["value"] for c in contacts}
    nodes = {e["id"] for e in entities} | {a["id"] for a in accounts} | contact_values
    edges = (
        [{"src": a["owner"], "dst": a["id"], "etype": "owns"} for a in accounts]
        + [{"src": t["src"], "dst": t["dst"], "etype": "transfer", "weight": t["amount"]} for t in txs]
        + [{"src": c["entity"], "dst": c["value"], "etype": "has_" + c["kind"]} for c in contacts]
    )
    phones = [c["value"] for c in contacts if c["kind"] == "phone"]
    shared = len(phones) != len(set(phones))
    print("nodes", len(nodes))
    print("edges", len(edges))
    print("shared_phone", shared)

s31_th_3()
`,
        output: `nodes 7
edges 7
shared_phone True`,
      },
      callout: {
        type: "tip",
        title: "Contactos como nodos",
        content:
          "Modelar el valor de contacto como nodo facilita detectar un contacto compartido sin inventar parentesco ni fraude: es un hecho a revisar, no un veredicto.",
      },
    },
    {
      heading: "Deduplicación y agregación sin borrar detalle",
      subtopicId: "S31-T2-B",
      paragraphs: [
        "**Deduplicar nodos** tras el ER colapsa ids canónicos; conserva el mapa `raw_id → canonical_id` para reescribir aristas sin perder trazabilidad del matching de S30. Sin ese mapa, dos raw del mismo canónico generan aristas fantasmas o rompen el path del revisor.",
        "**Agregar aristas**: la clave de agregado incluye al menos `(src, dst, etype)` — y, si aplica, unidad y ventana temporal. Suma montos, cuenta eventos, min/max `ts` y guarda una **capa de detalle** (lista de `record_id`). El agregado acelera filtros; el detalle responde «muéstrame las transacciones de este hop».",
        "Si solo dejas el agregado, el revisor no puede explicar el camino con evidencia. El workbench de investigación (y el inicio de CP-N3-B) necesita **ambas capas**: sumario para priorizar y fuente para auditar.",
      ],
      code: {
        language: 'python',
        title: "dedup_agg.py",
        code: `def s31_th_4():
    from collections import defaultdict
    detail = [
        {"src": "E1", "dst": "E2", "etype": "transfer", "amount": 100.0, "record_id": "tx-1"},
        {"src": "E1", "dst": "E2", "etype": "transfer", "amount": 50.0, "record_id": "tx-2"},
        {"src": "E2", "dst": "E3", "etype": "transfer", "amount": 20.0, "record_id": "tx-3"},
    ]
    # clave semántica: no mezclar transfer con shared_phone del mismo par
    agg = defaultdict(lambda: {"sum": 0.0, "n": 0, "records": []})
    for d in detail:
        k = (d["src"], d["dst"], d["etype"])
        agg[k]["sum"] += d["amount"]
        agg[k]["n"] += 1
        agg[k]["records"].append(d["record_id"])
    print("pairs", len(agg))
    print("E1_E2_tx", agg[("E1", "E2", "transfer")]["sum"], agg[("E1", "E2", "transfer")]["n"])
    print("detail_kept", len(detail) == sum(v["n"] for v in agg.values()))

s31_th_4()
`,
        output: `pairs 2
E1_E2_tx 150.0 2
detail_kept True`,
      },
      callout: {
        type: "danger",
        title: "Agregado ≠ evidencia completa",
        content:
          "Mostrar solo sum(amount) sin records impide contestar «muéstrame las transacciones».",
      },
    },
    {
      heading: "Grado, componentes y caminos",
      figure: {
        id: "S31-evidence-graph",
        caption:
          "Los dos caminos dirían «están conectados». Uno lo dice con una transferencia entre esas dos entidades; el otro, con un teléfono que comparte toda una oficina.",
        alt:
          "Un grafo de cuatro entidades. Ana Q. es el caso abierto. Una arista directa la une a Luis M. mediante una transferencia. Otra la une a la Oficina Lima por un teléfono compartido, y desde ahí una tercera llega a Marta R. por el mismo teléfono. Al elegir un destino se resalta el camino y se listan las evidencias de cada arista.",
      },
      subtopicId: "S31-T3-A",
      paragraphs: [
        "**Grado** (degree): número de **aristas** que tocan un nodo, no de vecinos distintos. La diferencia no se nota en un grafo simple y sí en el multigrafo de esta sección: diez transferencias entre las mismas dos entidades dan grado 10 y un solo vecino. Sirve para filtrar **hubs** (nodos de alto grado) y priorizar exploración — **no** para culpar a un nodo. En grafos dirigidos, reporta in-degree y out-degree por separado cuando el flujo importa (p. ej. transferencias).",
        "**Componentes conexas**: partición del grafo no dirigido subyacente. Un caso de revisión suele vivir en un **subgrafo acotado**; componentes aisladas ayudan a acotar ruido y a no mezclar islas irrelevantes en la misma vista.",
        "**Caminos**: se recorren con **BFS** (*breadth-first search*, búsqueda en anchura: explora primero todo lo que está a un salto, luego a dos) o **DFS** (*depth-first search*, en profundidad: sigue un camino hasta el final antes de retroceder). Para evidencia relacional interesa BFS, porque encuentra el camino más corto primero. Ambos con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y también las aristas que los unen, cada una con su `record_id` de evidencia — eso no es un lujo de producción, es la mitad de la pregunta que gobierna la sección: qué camino conecta a estos dos **y qué respalda cada paso**. Un path que solo lista nodos dice que existe una conexión sin decir por qué. Lo que añade producción es el payload completo de cada evidencia; el identificador citable ya viaja en el lab. Sin límite, los caminos largos son caros y poco accionables para la cola humana.",
      ],
      code: {
        language: 'python',
        title: "degree_cc_paths.py",
        code: `from collections import defaultdict, deque
# grafo no dirigido sintético
adj = defaultdict(set)
for u, v in [("A", "B"), ("B", "C"), ("C", "D"), ("E", "F"), ("B", "D")]:
    adj[u].add(v); adj[v].add(u)

def degree(n):
    return len(adj[n])

def components():
    seen, comps = set(), []
    for start in list(adj):
        if start in seen:
            continue
        q, comp = [start], []
        seen.add(start)
        while q:
            n = q.pop()
            comp.append(n)
            for m in adj[n]:
                if m not in seen:
                    seen.add(m); q.append(m)
        comps.append(sorted(comp))
    return comps

def bfs_path(src, dst, max_depth=5):
    q = deque([(src, [src])])
    seen = {src}
    while q:
        n, path = q.popleft()
        if n == dst:
            return path
        if len(path) > max_depth:
            continue
        for m in sorted(adj[n]):
            if m not in seen:
                seen.add(m)
                q.append((m, path + [m]))
    return None

print("deg_B", degree("B"))
print("comps", components())
print("path_A_D", bfs_path("A", "D"))`,
        output: `deg_B 3
comps [['A', 'B', 'C', 'D'], ['E', 'F']]
path_A_D ['A', 'B', 'D']`,
      },
      callout: {
        type: "tip",
        title: "Path con límite y puente NetworkX",
        content:
          "Sin max_depth, caminos largos son ruidosos y caros. El workbench fija hop limit explícito. En producción, `networkx.shortest_path` cubre el mismo contrato sobre MultiGraph; aquí aprendes el algoritmo en Python puro.",
      },
    },
    {
      heading: "Centralidad con interpretación limitada",
      subtopicId: "S31-T3-B",
      paragraphs: [
        "**Degree centrality** (NetworkX / teoría de redes) normaliza el grado por el máximo posible: `deg(v) / (n - 1)` en un grafo simple no dirigido sin self-loops. Es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido.",
        "*Betweenness* mide cuántos caminos cortos pasan por el nodo; *closeness*, qué tan cerca está del resto. Ambas existen en NetworkX, pero en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste.",
        "Interpreta con contexto antes de priorizar: **tipo de arista** (¿solo `transfer` o también `shared_phone`?), **ventana temporal** (¿el grado creció en un pico reciente?) y si el nodo es **infraestructura** (`INF-…`) vs. **persona** (`PER-…`). Un score alto solo ordena la cola de revisión humana; no cierra el caso.",
        "Nunca automatices “alta centralidad → fraude”. Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica **informa** la investigación; el revisor **decide** con path, records y contexto de negocio. Reporta siempre la métrica, los tipos de arista y el disclaimer de no-culpabilidad.",
      ],
      code: {
        language: 'python',
        title: "centrality_limits.py",
        code: `from collections import defaultdict
adj = defaultdict(set)
edges = [("P1", "HUB"), ("P2", "HUB"), ("P3", "HUB"), ("P1", "P2"), ("X", "Y")]
for u, v in edges:
    adj[u].add(v); adj[v].add(u)
n = len(adj)
degree = {v: len(adj[v]) for v in adj}
# Degree centrality estándar: deg / (n - 1), no deg / max_observed
deg_cent = {v: degree[v] / (n - 1) for v in degree}
top = max(deg_cent, key=deg_cent.get)
print("top", top)
print("hub_degree", degree["HUB"])
print("hub_degree_cent", round(deg_cent["HUB"], 2))
print("not_guilt", True)  # centralidad ≠ culpabilidad`,
        output: `top HUB
hub_degree 3
hub_degree_cent 0.6
not_guilt True`,
      },
      callout: {
        type: "danger",
        title: "Centralidad ≠ culpabilidad",
        content:
          "Reporta la métrica, los tipos de arista y el disclaimer. No etiquetes conducta indebida.",
      },
    },
    {
      heading: "Subgrafos y pruebas",
      subtopicId: "S31-T4-A",
      paragraphs: [
        "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso) más vecinos a **k hops** (saltos). El **seed** suele ser la entidad bajo revisión. Puedes aplicar filtros de tipo y/o ventana temporal sobre el recorte. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco.",
        "Prueba invariantes de construcción: sin self-loops basura, pesos ≥ 0, provenance presente en toda arista de evidencia, y construcción **idempotente** (mismas filas → mismo grafo ordenado). Cada bug (arista invertida, nodo huérfano, `record_id` perdido) merece un test de regresión con fixture sintético.",
        "Tests típicos: cardinalidades, path existe/no existe, componente esperada, `ego(seed, k)` no incluye nodos fuera del radio. Mini-caso: seed `E1`, k=1 incluye el teléfono compartido `ph:900`; k=2 ya alcanza `E2` por ese contacto. El path `E1 → ph:900 → E2` es **hipótesis con evidencia**, no veredicto de fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "subgraph_tests.py",
        code: `from collections import defaultdict
def build(edges):
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v); adj[v].add(u)
    return adj

def ego(adj, seed, k=1):
    layer = {seed}
    seen = {seed}
    for _ in range(k):
        nxt = set()
        for n in layer:
            for m in adj[n]:
                if m not in seen:
                    nxt.add(m); seen.add(m)
        layer = nxt
    return seen

edges = [("A", "B"), ("B", "C"), ("C", "D"), ("Z", "Y")]
adj = build(edges)
sub = ego(adj, "A", k=2)
# pruebas
assert "A" in sub and "C" in sub and "Z" not in sub
assert all(w >= 0 for w in [1, 2, 0])
print("sub_nodes", sorted(sub))
print("tests_ok", True)
print("k", 2)`,
        output: `sub_nodes ['A', 'B', 'C']
tests_ok True
k 2`,
      },
      callout: {
        type: "tip",
        title: "Ego + k hops",
        content:
          "El workbench arranca desde entidades del caso y expande con hop limit configurable.",
      },
    },
    {
      heading: "Visualización, escalabilidad, privacidad y evidencia por arista",
      subtopicId: "S31-T4-B",
      paragraphs: [
        "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta se divide en dos modos. Para explorar, usa **ego-k o la componente del caso**. Cuando `n_nodes` supera un umbral de render (p. ej. 500 en el lab — valor ilustrativo, no universal), **resume** con top hubs, tamaños de componentes y conteos por etype. Renderizar todo no es “más transparente”: es ruido e inoperable.",
        "**Privacidad**: enmascara PII en labels de la vista (email parcial, teléfono parcial). Los roles ven solo lo necesario para la revisión. Un layout bonito con PII completa es un **incidente de compliance**, no un entregable de portafolio.",
        "**Evidencia por arista — storyboard del revisor (CASO-LIM-031).** El revisor abre el caso con seed `E1` y recorre cinco pasos:\n\n1. Expande ego k=2 y localiza el hop `E1 → ph:900 → E2`.\n2. Al hacer clic en cada hop, ve `records`, `ts` y `source`.\n3. Lee el disclaimer de centralidad del hub de contacto.\n4. **No** recibe auto-label de fraude ni parentesco: solo hipótesis con evidencia para la cola humana.\n5. Ese contrato alimenta CP-N3-B y el workbench de S34.",
      ],
      code: {
        language: 'python',
        title: "viz_privacy.py",
        code: `def redact_email(e: str) -> str:
    local, _, domain = e.partition("@")
    if len(local) <= 2:
        return "***@" + domain
    return local[:2] + "***@" + domain

def edge_evidence(edge_id, store):
    return store.get(edge_id, {})

store = {
    "e-1": {"src": "E1", "dst": "E2", "etype": "transfer", "records": ["tx-1", "tx-2"],
            "amount_sum": 150.0, "source": "tx_ledger"},
}
view = {
    "nodes": [{"id": "E1", "label": redact_email("ana@example.pe")},
              {"id": "E2", "label": redact_email("luis@example.pe")}],
    "edge": edge_evidence("e-1", store),
}
print("redact", view["nodes"][0]["label"])
print("records", view["edge"]["records"])
print("scalable_view", "subgraph_only")`,
        output: `redact an***@example.pe
records ['tx-1', 'tx-2']
scalable_view subgraph_only`,
      },
      callout: {
        type: "warning",
        title: "Privacidad en viz",
        content:
          "Redacta labels por defecto. Muestra records del hop al revisor autorizado; nunca PII completa en capturas de portafolio.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el inicio de CP-N3-B paso a paso. Primero el modelo tipado, las multiaristas con provenance y la proyección tablas→grafo. Luego la agregación con detalle, el path con hop limit, el degree con disclaimer, el ego-k y la vista redactada. Observa la salida de cada demo: es el contrato que luego practicarás en We Do.",
    steps: [
      {
        demoId: "S31-T1-A-DEMO",
        subtopicId: "S31-T1-A",
        environment: "local-python",
        description: "Modela nodos entidad/cuenta y aristas owns, shared_phone y transfer con dirección y peso.",
        preamble:
          "En el desk de investigación relacional, un grafo sin tipos estables no se puede filtrar ni auditar. Esta demo arma el contrato mínimo de CP-N3-B: nodos entidad/cuenta y aristas `owns`, `shared_phone` y `transfer` con dirección y peso. No escribas aún: predice por qué `transfer` debe ser dirigida y `shared_phone` no, y por qué el peso `99.5` es evidencia cuantitativa y no una etiqueta de culpa.",
        code: {
          language: 'python',
          title: "model_demo.py",
          code: `nodes = ["E1", "E2", "A1", "A2"]
edges = [
    ("E1", "A1", "owns", 1.0, True),
    ("E2", "A2", "owns", 1.0, True),
    ("E1", "E2", "shared_phone", 0.8, False),
    ("A1", "A2", "transfer", 99.5, True),
]

def edge_types(edges):
    return sorted({e[2] for e in edges})

print("n_nodes", len(nodes))
print("n_edges", len(edges))
print("types", edge_types(edges))
print("directed_tx", any(e[2] == "transfer" and e[4] for e in edges))
print("weight", next(e[3] for e in edges if e[2] == "transfer"))
`,
          output: `n_nodes 4
n_edges 4
types ['owns', 'shared_phone', 'transfer']
directed_tx True
weight 99.5`,
        },
        why: "Dirección y peso son campos del schema, no adornos de layout. Un `etype` estable permite filtrar el path del revisor; las unidades de peso (PEN, count, score) deben declararse por etype. Mezclar convenciones de dirección en el mismo tipo rompe el filtro. We Do: completar el modelo literal, medir out-strength y clasificar directed vs. undirected.",
        retrospective:
          "Si puedes explicar por qué `transfer` dirigida y `shared_phone` no dirigida no son intercambiables, ya tienes el hábito de schema primero. El error clásico es tratar el peso como veredicto. En We Do practicarás modelar aristas, medir fuerza saliente y clasificar dirección.",
      },
      {
        demoId: "S31-T1-B-DEMO",
        subtopicId: "S31-T1-B",
        environment: "local-python",
        description: "Multiaristas con timestamps y provenance por record_id.",
        preamble:
          "Entre el mismo par pueden coexistir varias transferencias o contactos: eso es un multigrafo. Esta demo guarda cada `record_id` y source, y además elige la arista más reciente por `ts` sin borrar el resto. No escribas aún: predice por qué `prov_ok` debe ser True solo si *todas* tienen `rid` y `src`, y por qué `latest` es r1 (2026-03-01).",
        code: {
          language: 'python',
          title: "multi_demo.py",
          code: `edges = [
    {"pair": ("E1", "E2"), "ts": "2026-03-01", "rid": "r1", "src": "crm"},
    {"pair": ("E1", "E2"), "ts": "2026-01-15", "rid": "r0", "src": "tx"},
]

def latest_by_pair(edges):
    best = {}
    for e in edges:
        k = e["pair"]
        if k not in best or e["ts"] > best[k]["ts"]:
            best[k] = e
    return best

print("multi", len(edges))
print("rids", sorted(e["rid"] for e in edges))
print("prov_ok", all(e.get("rid") and e.get("src") for e in edges))
print("latest", latest_by_pair(edges)[("E1", "E2")]["rid"])
`,
          output: `multi 2
rids ['r0', 'r1']
prov_ok True
latest r1`,
        },
        why: "Multigrafo + provenance habilita la auditoría del camino: cada hop debe saltar al registro fuente. «Latest» es una vista de prioridad, no un reemplazo del detalle. Sin `record_id` el hop del revisor es decoración. We Do: contar multi-pares, filtrar por ventana temporal y validar provenance.",
        retrospective:
          "Si puedes distinguir «agregar o filtrar por tiempo» de «borrar el detalle», ya tienes el hábito de T1-B. El error clásico es quedarte solo con `latest` y perder `record_id` del resto. Pregunta: ¿qué audita el revisor si el hop solo muestra la última transferencia? We Do: multi-count, filtro temporal y gate de provenance.",
      },
      {
        demoId: "S31-T2-A-DEMO",
        subtopicId: "S31-T2-A",
        environment: "local-python",
        description: "Construye nodos y aristas owns / shared_phone desde tablas sintéticas.",
        preamble:
          "Tras el ER de S30, las tablas de entidades, cuentas y contactos se proyectan a grafo. Esta demo construye nodos (incluidos valores de teléfono) y aristas `owns` / `has_phone`. Observa que e1 y e2 comparten el valor `900`: es un **hecho de contacto**, no parentesco. No escribas aún; sigue la unión de ids y el conteo de aristas.",
        code: {
          language: 'python',
          title: "build_demo.py",
          code: `ents = [{"id": "e1"}, {"id": "e2"}]
accs = [{"id": "a1", "owner": "e1"}]
phones = [{"e": "e1", "v": "900"}, {"e": "e2", "v": "900"}]

def build_nodes(ents, accs, phones):
    nodes = {e["id"] for e in ents}
    nodes |= {a["id"] for a in accs}
    nodes |= {p["v"] for p in phones}
    return sorted(nodes)

def build_edges(accs, phones):
    owns = [{"src": a["owner"], "dst": a["id"], "etype": "owns"} for a in accs]
    has_ph = [{"src": p["e"], "dst": p["v"], "etype": "has_phone"} for p in phones]
    return owns + has_ph

nodes = build_nodes(ents, accs, phones)
edges = build_edges(accs, phones)
print("nodes", nodes)
print("n_nodes", len(nodes))
print("n_edges", len(edges))
print("shared_phone_value", "900")
`,
          output: `nodes ['900', 'a1', 'e1', 'e2']
n_nodes 4
n_edges 3
shared_phone_value 900`,
        },
        why: "Tablas → grafo con tipos del schema canónico (`owns`, `has_phone`). El contacto como nodo intermedio facilita el path `E1 → 900 → E2` sin inventar parentesco. Ids sintéticos estables hacen la construcción idempotente. Sin el valor de teléfono como nodo, el hop de contacto compartido no se dibuja. We Do: proyectar owns ordenadas, detectar shared y armar el set de nodos.",
        retrospective:
          "Si puedes dibujar el hop por teléfono compartido sin inventar parentesco, ya internalizaste T2-A. El error clásico es modelar solo personas y omitir el nodo de contacto. Pregunta: ¿qué ve el revisor si el teléfono no es nodo de primera clase? We Do: proyectar owns, detectar shared y unir el set de nodos.",
      },
      {
        demoId: "S31-T2-B-DEMO",
        subtopicId: "S31-T2-B",
        environment: "local-python",
        description: "Agrega montos por par conservando lista de record_id.",
        preamble:
          "El revisor filtra con sumas, pero audita con `record_id`. Esta demo agrega montos por par **y** conserva la lista de ids. No escribas aún: predice por qué `detail_n 2` debe coincidir con la longitud de `ids`, y qué pregunta del revisor fallaría si solo imprimieras `sum 15`.",
        code: {
          language: 'python',
          title: "agg_demo.py",
          code: `from collections import defaultdict

rows = [
    ("E1", "E2", 10.0, "t1"),
    ("E1", "E2", 5.0, "t2"),
    ("E2", "E3", 1.0, "t3"),
]

def aggregate_pairs(rows):
    agg = defaultdict(lambda: {"amount": 0.0, "n": 0, "ids": []})
    for a, b, amt, rid in rows:
        k = (a, b)
        agg[k]["amount"] += amt
        agg[k]["n"] += 1
        agg[k]["ids"].append(rid)
    return dict(agg)

g = aggregate_pairs(rows)[("E1", "E2")]
print("sum", g["amount"])
print("ids", g["ids"])
print("detail_n", g["n"])
`,
          output: `sum 15.0
ids ['t1', 't2']
detail_n 2`,
        },
        why: "Agregado y detalle conviven: el workbench prioriza con `sum` y explica con `records`. Borrar ids rompe la auditoría del path aunque la suma sea correcta. La clave de agregado debe incluir al menos `(src, dst, etype)` cuando el schema lo exija. We Do: colapso canónico post-ER, agregar conservando records e invariante de no-pérdida.",
        retrospective:
          "Si puedes defender por qué el path necesita la capa de detalle además del total, ya tienes T2-B. El error clásico es imprimir solo `sum 15` y creer que el hop es auditable. Pregunta: ¿qué pide el revisor al hacer clic en el hop E1→E2? We Do: reescribir aristas canónicas, agregar conservando records y verificar el invariante.",
      },
      {
        demoId: "S31-T3-A-DEMO",
        subtopicId: "S31-T3-A",
        environment: "local-python",
        description: "BFS path reproducible entre dos entidades con hop limit.",
        preamble:
          "El revisor necesita un camino **reproducible** y acotado, no una exploración infinita. Esta demo hace BFS de A a D con vecinos ordenados y muestra `hops` y `repro`. No escribas aún: predice por qué sorted de vecinos hace que dos ejecuciones den el mismo path, y por qué un hop limit protege al workbench.",
        code: {
          language: 'python',
          title: "path_demo.py",
          code: `from collections import defaultdict, deque
adj = defaultdict(set)
for u, v in [("A", "B"), ("B", "C"), ("C", "D")]:
    adj[u].add(v); adj[v].add(u)

def path(s, t, max_h=4):
    q = deque([(s, [s])])
    seen = {s}
    while q:
        n, p = q.popleft()
        if n == t:
            return p
        if len(p) > max_h:
            continue
        for m in sorted(adj[n]):
            if m not in seen:
                seen.add(m)
                q.append((m, p + [m]))
    return None
p1 = path("A", "D")
p2 = path("A", "D")
print("path", p1)
print("hops", len(p1) - 1)
print("repro", p1 == p2)
# Opcional en producción (mismo contrato):
# import networkx as nx
# G = nx.Graph(); G.add_edges_from([("A","B"),("B","C"),("C","D")])
# print(nx.shortest_path(G, "A", "D"))
`,
          output: `path ['A', 'B', 'C', 'D']
hops 3
repro True`,
        },
        why: "Camino acotado y con vecinos ordenados = reproducible entre re-runs del revisor. El hop limit controla costo y ruido de paths largos poco accionables; en producción NetworkX cubre el mismo contrato sobre MultiGraph. Un path sin orden estable no se puede auditar ni comparar en tests. We Do: grado, componentes conexas y BFS A→D con hops.",
        retrospective:
          "Si puedes explicar por qué vecinos `sorted` implica `repro True`, ya tienes el hábito de paths auditables. El error clásico es BFS con orden de `set` no determinista o tratar cualquier camino como «el» path del caso. Pregunta: ¿qué pondrías junto al path en la UI del revisor? We Do: degree, componentes y path con hops.",
      },
      {
        demoId: "S31-T3-B-DEMO",
        subtopicId: "S31-T3-B",
        environment: "local-python",
        description: "Calcula degree centrality y emite disclaimer de no-culpabilidad.",
        preamble:
          "Un hub puede ser un procesador de pagos legítimo o un teléfono de call center. Esta demo calcula el nodo de mayor grado y emite `interpretation structure_only` con `guilt_label False`. No escribas aún: predice por qué un score alto solo ordena la cola humana y nunca cierra el caso.",
        code: {
          language: 'python',
          title: "cent_demo.py",
          code: `from collections import Counter

def degree_hub(edges):
    deg = Counter()
    for u, v in edges:
        deg[u] += 1
        deg[v] += 1
    hub = max(deg, key=deg.get)
    return hub, deg[hub]

edges = [("H", "A"), ("H", "B"), ("H", "C"), ("A", "B")]
hub, d = degree_hub(edges)
print("top_node", hub, "degree", d)
print("interpretation", "structure_only")
print("guilt_label", False)
`,
          output: `top_node H degree 3
interpretation structure_only
guilt_label False`,
        },
        why: "Métrica estructural con interpretación limitada: reporta siempre el disclaimer y no automatices fraude. Un hub de infraestructura no implica culpa de las personas conectadas. Degree centrality ordena la cola humana; el revisor decide con path, records y contexto. We Do: normalizar deg/(n−1), clasificar infra vs. persona e interpretar con tipos de arista.",
        retrospective:
          "Si puedes decir en una frase por qué centralidad ≠ culpabilidad, ya tienes el gate ético de T3-B. El error clásico es auto-label «hub = sospechoso» sin mirar tipo de nodo ni etypes. Pregunta: ¿qué disclaimer pondrías junto al score en la UI? We Do: degree centrality estándar, hub INF-/PER- y high-degree con etypes.",
      },
      {
        demoId: "S31-T4-A-DEMO",
        subtopicId: "S31-T4-A",
        environment: "local-python",
        description: "Extrae ego-subgraph k=1 y valida nodos esperados.",
        preamble:
          "El revisor no navega 100k nodos: arranca del seed del caso y expande k hops. Esta demo extrae ego k=1 desde S y aserta el conjunto esperado. No escribas aún: predice por qué C (a 2 hops) no entra en k=1 y por qué un assert de membresía es un test de regresión útil.",
        code: {
          language: 'python',
          title: "ego_demo.py",
          code: `from collections import defaultdict

def ego(adj, seed, k=1):
    seen = {seed}
    layer = {seed}
    for _ in range(k):
        nxt = set()
        for n in layer:
            for m in adj[n]:
                if m not in seen:
                    seen.add(m)
                    nxt.add(m)
        layer = nxt
    return sorted(seen)

adj = defaultdict(set)
for u, v in [("S", "A"), ("S", "B"), ("A", "C")]:
    adj[u].add(v)
    adj[v].add(u)
ego1 = ego(adj, "S", 1)
print("ego", ego1)
print("k", 1)
print("test_ok", ego1 == ["A", "B", "S"])
`,
          output: `ego ['A', 'B', 'S']
k 1
test_ok True`,
        },
        why: "Subgrafo de caso testeable: ego-k acota el workbench al radio del seed y hace el assert de membresía un test de regresión útil. El path del seed es hipótesis con evidencia, no veredicto. Devolver el grafo entero del «banco» no es más transparente: es ruido. We Do: ego k=1/2, invariantes de calidad e idempotencia del builder.",
        retrospective:
          "Si puedes decir qué entra y qué no en k=1 vs. k=2, ya tienes el hábito de subgrafos de caso. El error clásico es devolver el grafo entero o un solo vecino. Pregunta: ¿por qué un assert `ego1 == [...]` es mejor que solo imprimir el set? We Do: ego, invariantes y build idempotente.",
      },
      {
        demoId: "S31-T4-B-DEMO",
        subtopicId: "S31-T4-B",
        environment: "local-python",
        description: "Redacta labels y adjunta evidencia de arista al path view.",
        preamble:
          "Un layout con PII completa es un incidente de compliance, no un entregable de portafolio. Esta demo redacta teléfonos en el path view y adjunta `records` del hop. No escribas aún: predice por qué `pii_full False` es parte del contrato y qué ve el revisor al hacer clic en el hop.",
        code: {
          language: 'python',
          title: "viz_demo.py",
          code: `def redact_phone(p):
    return p[:3] + "****" + p[-2:]
path = ["E1", "ph", "E2"]
evidence = {"etype": "shared_phone", "records": ["c-1", "c-2"]}
print("labels", [redact_phone("+51900000001"), "shared", redact_phone("+51900000001")])
print("evidence_records", evidence["records"])
print("pii_full", False)`,
          output: `labels ['+51****01', 'shared', '+51****01']
evidence_records ['c-1', 'c-2']
pii_full False`,
        },
        why: "Vista de path con privacidad y evidencia: redact por defecto; records solo al revisor autorizado. Un layout bonito con PII completa no es portafolio: es un incidente de compliance. El hop del path debe mostrar `records` sin exponer labels crudos. We Do: redact email, records por hop del path y política summarize/render.",
        retrospective:
          "Si puedes defender redact + records por hop, ya tienes el storyboard del revisor. El error clásico es capturar PII completa «porque se ve mejor» en el portafolio. Pregunta: ¿quién puede ver el teléfono sin máscara y bajo qué rol? We Do: redact, evidence por hop y umbral de escala.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios guiados → independientes → transferencia (T1–T4). Cada starter deja un hueco real de construcción o validación: completa el contrato de salida con el fixture sintético `CASO-LIM-031` (sin PII real; sin etiquetar fraude ni parentesco).",
    steps: [
      {
        id: "S31-T1-A-E1",
        subtopicId: "S31-T1-A",
        kind: "guided",
        title: "Modelo mínimo: owns y shared_phone",
        preamble:
          "- **Contexto:** en `CASO-LIM-031`, el revisor necesita un grafo tipado antes de cargar filas reales del ledger.\n- **Meta:** completar dict `nodes` (ya dado) y lista `edges` con `owns` E1→A1 (dirigida) y `shared_phone` E1–E2 (no dirigida).\n- **Éxito:** `n_nodes 3` / `n_edges 2` / `n_directed 1`.\n- **Límites:** no inventes etypes fuera del schema; sin PII real; no etiquetes fraude ni parentesco.",
        instruction:
          "1. Revisa el starter: `nodes` listo, `edges` vacío.\n2. Agrega arista `owns` E1→A1 con `directed=True` y peso 1.0.\n3. Agrega `shared_phone` E1–E2 con `directed=False`.\n4. Imprime `n_nodes`, `n_edges` y `n_directed` (cuenta `directed=True`).",
        hint: "Usa literales de dict/list y cuenta con sum(1 for e in edges if e['directed']).",
        hints: [
          "Completa la lista edges con owns (dirigida) y shared_phone (no dirigida).",
          "Cuenta con sum(1 for e in edges if e['directed']).",
        ],
        edgeCases: ["nodo sin aristas es válido", "weight puede ser float"],
        tests: "salida: n_nodes 3 / n_edges 2 / n_directed 1",
        feedback:
          "Sin aristas tipadas no hay filtro de path. `n_directed` debe ser 1: solo `owns` es dirigida; `shared_phone` no cuenta. Si `n_edges` es 0, el starter quedó sin completar. Compara con la salida canónica.",
        retrospective:
          "El modelo mínimo fija tipos, dirección y peso antes de la carga masiva. El error clásico es dejar `edges=[]` o mezclar convenciones de dirección en el mismo etype. Siguiente (E2): medir fuerza saliente por nodo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · graph nodes+edges schema
# TODO: define edges con owns + shared_phone; imprime n_nodes, n_edges, n_directed
nodes = {"E1": {}, "E2": {}, "A1": {}}
edges = []  # completar: owns E1→A1 (directed), shared_phone E1–E2 (no directed)
print("n_nodes", len(nodes))
# print("n_edges", ...)
# print("n_directed", ...)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes = {"E1": {}, "E2": {}, "A1": {}}
edges = [
    {"src": "E1", "dst": "A1", "etype": "owns", "weight": 1.0, "directed": True},
    {"src": "E1", "dst": "E2", "etype": "shared_phone", "weight": 0.5, "directed": False},
]
print("n_nodes", len(nodes))
print("n_edges", len(edges))
print("n_directed", sum(1 for e in edges if e["directed"]))`,
          output: `n_nodes 3
n_edges 2
n_directed 1`,
        },
      },
      {
        id: "S31-T1-A-E2",
        subtopicId: "S31-T1-A",
        kind: "independent",
        title: "Out-strength: peso saliente por nodo",
        preamble:
          "- **Contexto:** en un grafo de transferencias, el revisor a veces prioriza nodos por **flujo saliente**, no solo por conteo de vecinos.\n- **Meta:** con aristas `(src, dst, weight)`, calcular out-strength (suma de pesos por `src`) y reportar el top.\n- **Éxito:** `top B` / `value 5.0` / `n 2`.\n- **Límites:** acumula solo por `src`; nodos solo-destino no aparecen; datos sintéticos.",
        instruction:
          "1. Implementa `out_strength(edges)` → dict `src → suma`.\n2. Elige `top = max(out, key=out.get)`.\n3. Imprime `top`, `value` y `n = len(out)`.\n4. No uses el `dst` para el total saliente.",
        hint: "Acumula en un dict solo por `src`; usa max(out, key=out.get).",
        hints: [
          "Acumula out[s] += w por cada arista saliente (ignora dst para el total).",
          "top = max(out, key=out.get); imprime top, value y n = len(out).",
        ],
        edgeCases: ["nodos solo destino no aparecen en out", "empates: max estable por primer max"],
        tests: "salida: top B / value 5.0 / n 2",
        feedback:
          "Out-strength suma pesos por `src`, no cuenta vecinos. Si `top` es A, probablemente sumaste también destinos o invertiste el par. Compara con `top B` / `value 5.0`.",
        retrospective:
          "Out-strength es evidencia de *flujo saliente*, no de culpa ni de popularidad de vecinos. Si confundes «cuántos destinos toca B» con «cuánto peso sale de B», el revisor prioriza mal la cola de hops. Pregunta: ¿por qué un nodo solo-destino no aparece en el dict de out-strength? Luego (E3) clasificarás directed vs. undirected con etypes del schema.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · out-weight by node
# TODO: implementa out_strength(edges) → dict src→suma; reporta top
edges = [('A', 'B', 2.0), ('A', 'C', 1.0), ('B', 'C', 5.0)]

def out_strength(edges):
    out = {}
    # completar: acumular peso saliente por src
    return out

out = out_strength(edges)
# print top, value, n
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [('A', 'B', 2.0), ('A', 'C', 1.0), ('B', 'C', 5.0)]

def out_strength(edges):
    out = {}
    for s, d, w in edges:
        out[s] = out.get(s, 0.0) + w
    return out

out = out_strength(edges)
top = max(out, key=out.get)
print("top", top)
print("value", out[top])
print("n", len(out))`,
          output: `top B
value 5.0
n 2`,
        },
      },
      {
        id: "S31-T1-A-E3",
        subtopicId: "S31-T1-A",
        kind: "transfer",
        title: "Clasificar directed, undirected y etypes",
        preamble:
          "- **Contexto:** el revisor del path filtra por dirección y por tipo; si mezclas convenciones en un mismo `etype`, el filtro miente.\n- **Meta:** de una lista de aristas con `directed` y `etype`, devolver conteos y etypes ordenados.\n- **Éxito:** `directed 2` / `undirected 1` / `etypes ['shared_phone', 'transfer']`.\n- **Límites:** schema canónico; no inventes labels de fraude; datos sintéticos.",
        instruction:
          "1. Completa `counts(edges)`: suma directed True y False por separado.\n2. Construye `etypes = sorted({e['etype'] for e in edges})`.\n3. Imprime `directed`, `undirected` y `etypes`.\n4. No hardcodees los conteos.",
        hint: "sets para etypes; sorted(set(...)).",
        hints: [
          "Cuenta directed=True y directed=False por separado (no mezcles convenciones en el mismo etype).",
          "etypes = sorted({e['etype'] for e in edges}).",
        ],
        edgeCases: ["etype repetido colapsa en set.", "misma etype no debe mezclar directed True/False en producción."],
        tests: "salida: directed 2 / undirected 1 / etypes ['shared_phone', 'transfer']",
        feedback:
          "Dos contadores distintos (directed / undirected) + set de etypes. Si unificas en un solo total, el filtro del revisor pierde el semáforo de dirección. Compara con la salida canónica.",
        retrospective:
          "Clasificar dirección y etype es el primer filtro auditable del path. El error clásico es colapsar todo en un solo contador. Pregunta: ¿qué harías si un mismo etype aparece a veces directed y a veces no?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · directed vs. undirected counts (schema canónico)
# TODO: implementa counts(edges) → (n_dir, n_undir, etypes_sorted)
edges = [
    {'directed': True, 'etype': 'transfer'},
    {'directed': False, 'etype': 'shared_phone'},
    {'directed': True, 'etype': 'transfer'},
]

def counts(edges):
    n_dir = 0
    n_undir = 0
    etypes = set()
    # completar bucle
    return n_dir, n_undir, sorted(etypes)

n_dir, n_undir, etypes = counts(edges)
# print directed, undirected, etypes
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [
    {'directed': True, 'etype': 'transfer'},
    {'directed': False, 'etype': 'shared_phone'},
    {'directed': True, 'etype': 'transfer'},
]

def counts(edges):
    n_dir = sum(1 for e in edges if e["directed"])
    n_undir = sum(1 for e in edges if not e["directed"])
    etypes = sorted({e["etype"] for e in edges})
    return n_dir, n_undir, etypes

n_dir, n_undir, etypes = counts(edges)
print("directed", n_dir)
print("undirected", n_undir)
print("etypes", etypes)`,
          output: `directed 2
undirected 1
etypes ['shared_phone', 'transfer']`,
        },
      },
      {
        id: "S31-T1-B-E1",
        subtopicId: "S31-T1-B",
        kind: "guided",
        title: "Contar multi-aristas por par",
        preamble:
          "- **Contexto:** en el multigrafo de `CASO-LIM-031`, dos transferencias E1→E2 son dos hechos, no uno.\n- **Meta:** con filas `(src, dst)`, contar ocurrencias por par y reportar el top.\n- **Éxito:** `pair E1 E2` / `n 2` / `pairs 2`.\n- **Límites:** el orden `src,dst` importa; no colapses a undirected sin documentarlo; sin PII.",
        instruction:
          "1. Arma `Counter(rows)`.\n2. Obtén el par más frecuente con `most_common(1)`.\n3. Imprime `pair` (dos ids), `n` y `pairs = len(c)`.\n4. No hardcodees `n 2`.",
        hint: "tuple (src, dst) como clave; Counter o dict de enteros.",
        hints: [
          "from collections import Counter; c = Counter(rows).",
          "pair, n = c.most_common(1)[0]; pairs = len(c).",
        ],
        edgeCases: ["orden src,dst importa"],
        tests: "salida: pair E1 E2 / n 2 / pairs 2",
        feedback:
          "Si usas `set(rows)` pierdes la frecuencia: el revisor vería un solo hecho entre E1–E2. `Counter` + `most_common` es el patrón. Compara con `n 2` / `pairs 2`.",
        retrospective:
          "Multi-count hace visible la *densidad de hechos* entre el mismo par: dos transferencias E1→E2 son dos filas auditables, no un «mismo hop». El error clásico es colapsar con `set` antes de medir frecuencia. Pregunta: si el revisor pregunta «¿cuántos eventos hay entre E1 y E2?», ¿qué número defiendes? Siguiente (E2): filtrar por ventana temporal sin borrar provenance.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · multi-edge pairs
# TODO: cuenta multi-aristas por par y reporta el top
from collections import Counter
rows = [('E1', 'E2'), ('E1', 'E2'), ('E2', 'E3')]
c = None  # completar: Counter de filas (src, dst)
# pair, n = ...; print pair, n, pairs
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
rows = [('E1', 'E2'), ('E1', 'E2'), ('E2', 'E3')]
c = Counter(rows)
pair, n = c.most_common(1)[0]
print("pair", pair[0], pair[1])
print("n", n)
print("pairs", len(c))`,
          output: `pair E1 E2
n 2
pairs 2`,
        },
      },
      {
        id: "S31-T1-B-E2",
        subtopicId: "S31-T1-B",
        kind: "independent",
        title: "Filtrar aristas por ventana temporal",
        preamble:
          "- **Contexto:** el caso no debe mezclar 2019 con 2026 sin documentarlo; el workbench filtra por `ts`.\n- **Meta:** conservar aristas con `ts >= '2026-02-01'` y verificar provenance.\n- **Éxito:** `n 2` / `prov True` / `first b`.\n- **Límites:** límite inclusivo; no mutes la lista original si puedes evitarlo; datos sintéticos.",
        instruction:
          "1. Filtra `edges` con `ts >= '2026-02-01'`.\n2. Comprueba que todas tienen `record_id`.\n3. Imprime `n`, `prov` y el primer `record_id` del filtro.\n4. No hardcodees `first`.",
        hint: "Strings ISO de fecha son ordenables lexicográficamente.",
        hints: [
          "f = [e for e in edges if e['ts'] >= '2026-02-01'].",
          "all('record_id' in e for e in f).",
        ],
        edgeCases: ["límite inclusivo"],
        tests: "salida: n 2 / prov True / first b",
        feedback:
          "El umbral es inclusivo (`>=`). Si `first` no es `b`, revisa el orden del filtro o si excluiste el 2026-02-10. Provenance sigue siendo obligatoria tras el recorte.",
        retrospective:
          "La ventana temporal acota el grafo al caso: mezclar 2019 con 2026 sin documentarlo contamina el path. Filtrar no dispensa de provenance: cada arista que sobrevive debe seguir saltando al ledger. Pregunta: si una arista cae fuera de la ventana, ¿la borras del detalle fuente o solo de la vista del caso? Luego (E3): validar source y record_id no vacíos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · time filter edges
# TODO: filtra por ventana temporal y reporta provenance
edges = [
    {'ts': '2026-01-15', 'record_id': 'a'},
    {'ts': '2026-02-10', 'record_id': 'b'},
    {'ts': '2026-03-01', 'record_id': 'c'},
]
# f = ...; print n, prov, first
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [
    {'ts': '2026-01-15', 'record_id': 'a'},
    {'ts': '2026-02-10', 'record_id': 'b'},
    {'ts': '2026-03-01', 'record_id': 'c'},
]
f = [e for e in edges if e["ts"] >= "2026-02-01"]
print("n", len(f))
print("prov", all("record_id" in e for e in f))
print("first", f[0]["record_id"])`,
          output: `n 2
prov True
first b`,
        },
      },
      {
        id: "S31-T1-B-E3",
        subtopicId: "S31-T1-B",
        kind: "transfer",
        title: "Validar provenance en cada arista",
        preamble:
          "- **Contexto:** sin `source` y `record_id`, el revisor no puede saltar del hop al ledger; el builder debe fallar de forma tipificada.\n- **Meta:** `all_ok` solo si cada arista tiene source y record_id no vacíos; reportar `n_bad` y `n`.\n- **Éxito:** `all_ok False` / `n_bad 1` / `n 3`.\n- **Límites:** string vacío cuenta como mal; no «arregles» el fixture a mano; sin fraude automático.",
        instruction:
          "1. Completa `ok(e)`: `bool(e.get('source') and e.get('record_id'))`.\n2. Cuenta `n_bad` con las que fallan.\n3. Imprime `all_ok`, `n_bad` y `n`.\n4. No hardcodees `False`.",
        hint: "bool(e.get('source') and e.get('record_id')); cuenta los que fallan.",
        hints: [
          "n_bad = sum(1 for e in edges if not ok(e)).",
          "all_ok = n_bad == 0.",
        ],
        edgeCases: ["source vacío exacto cuenta como mal"],
        tests: "salida: all_ok False / n_bad 1 / n 3",
        feedback:
          "Un `source` vacío (`''`) es fail-closed: cuenta como bad. Si `all_ok` sale True, tu `ok` acepta strings vacíos o no mira `record_id`. No «arregles» el fixture a mano: el punto es detectar la arista huérfana. Compara con `n_bad 1`.",
        retrospective:
          "Provenance es el contrato de auditoría del multigrafo. El error clásico es aceptar source vacío o inventar un rid. Pregunta: ¿rechazarías la carga o crearías aristas «huérfanas» silenciosas?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · provenance validation
# TODO: implementa ok(e) y reporta all_ok, n_bad, n
edges = [
    {'source': 'crm', 'record_id': '1'},
    {'source': '', 'record_id': '2'},
    {'source': 'tx', 'record_id': '3'},
]
def ok(e):
    return False  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [
    {'source': 'crm', 'record_id': '1'},
    {'source': '', 'record_id': '2'},
    {'source': 'tx', 'record_id': '3'},
]
def ok(e):
    return bool(e.get("source") and e.get("record_id"))
n_bad = sum(1 for e in edges if not ok(e))
print("all_ok", n_bad == 0)
print("n_bad", n_bad)
print("n", len(edges))`,
          output: `all_ok False
n_bad 1
n 3`,
        },
      },
      {
        id: "S31-T2-A-E1",
        subtopicId: "S31-T2-A",
        kind: "guided",
        title: "Proyectar aristas owns desde cuentas",
        preamble:
          "- **Contexto:** entity —`owns`→ account es la primera arista del schema canónico en el caso.\n- **Meta:** desde `accounts[{id, owner}]`, generar pares (owner, id) ordenados y etiquetar etype.\n- **Éxito:** `owns [('e1', 'a1'), ('e2', 'a2')]` / `n 2` / `etype owns`.\n- **Límites:** orden lexicográfico; no inventes owners; datos sintéticos.",
        instruction:
          "1. Construye tuples `(owner, id)` desde cada cuenta.\n2. Ordénalos con `sorted`.\n3. Imprime `owns`, `n` y `etype` como `\"owns\"`.\n4. No hardcodees la lista final.",
        hint: "list comprehension + sorted por owner luego id.",
        hints: [
          "owns = sorted((a['owner'], a['id']) for a in accounts).",
          "Imprime owns, n y etype 'owns'.",
        ],
        edgeCases: ["orden lexicográfico"],
        tests: "salida: owns [('e1', 'a1'), ('e2', 'a2')] / n 2 / etype owns",
        feedback:
          "El fixture llega desordenado (a2 antes que a1). Sin `sorted`, la salida no es idempotente y el test falla. `src` es el owner, no la cuenta.",
        retrospective:
          "`owns` ancla la entidad a la cuenta antes de las transferencias. El error clásico es invertir src/dst o omitir el sort (rompe idempotencia visual). Siguiente (E2): detectar contactos compartidos sin inferir parentesco.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · owns edges from accounts
# TODO: proyecta aristas owns ordenadas
accounts = [{'id': 'a2', 'owner': 'e2'}, {'id': 'a1', 'owner': 'e1'}]
owns = []  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `accounts = [{'id': 'a2', 'owner': 'e2'}, {'id': 'a1', 'owner': 'e1'}]
owns = sorted((a["owner"], a["id"]) for a in accounts)
print("owns", owns)
print("n", len(owns))
print("etype", "owns")`,
          output: `owns [('e1', 'a1'), ('e2', 'a2')]
n 2
etype owns`,
        },
      },
      {
        id: "S31-T2-A-E2",
        subtopicId: "S31-T2-A",
        kind: "independent",
        title: "Detectar contactos compartidos (≥2)",
        preamble:
          "- **Contexto:** dos entidades con el mismo teléfono sintético generan un hecho de contacto compartido para la cola humana.\n- **Meta:** agrupar por valor y listar los que tienen ≥2 entidades; imprimir la nota `not_parentesco`.\n- **Éxito:** `shared ['900', '901']` / `n_shared 2` / `note not_parentesco`.\n- **Límites:** no etiquetes parentesco ni fraude; solo datos sintéticos.",
        instruction:
          "1. Acumula entidades por valor de contacto en un `defaultdict(set)`.\n2. Filtra valores con `len(es) >= 2`.\n3. Imprime `shared` sorted, `n_shared` y `note not_parentesco`.\n4. No inventes labels de conducta.",
        hint: "groupby por value con defaultdict(set); filtra len(entities) >= 2.",
        hints: [
          "m[v].add(e) por cada (e, v).",
          "shared = sorted(v for v, es in m.items() if len(es) >= 2).",
        ],
        edgeCases: ["shared contact ≠ parentesco"],
        tests: "salida: shared ['900', '901'] / n_shared 2 / note not_parentesco",
        feedback:
          "Shared contact = hipótesis con evidencia, no veredicto. Si omites la nota `not_parentesco` o inventas «familia», rompes el gate ético de CP-N3-B. Compara con la salida canónica.",
        retrospective:
          "Detectar shared es el *disparador* de la cola humana, no la sentencia. El error clásico es saltar a «familia» o «colusión» cuando solo tienes un valor de contacto repetido. Pregunta: si mañana el mismo teléfono es de un call center legítimo, ¿qué cambia en tu modelo y qué no? Luego (E3): unir entidades, cuentas y contactos en un solo set de nodos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · shared contact values
# TODO: detecta valores compartidos (≥2 entidades)
from collections import defaultdict
contacts = [('e1', '900'), ('e2', '900'), ('e3', '901'), ('e1', '901')]
m = defaultdict(set)
# completar y print shared, n_shared, note
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
contacts = [('e1', '900'), ('e2', '900'), ('e3', '901'), ('e1', '901')]
m = defaultdict(set)
for e, v in contacts:
    m[v].add(e)
shared = sorted(v for v, es in m.items() if len(es) >= 2)
print("shared", shared)
print("n_shared", len(shared))
print("note", "not_parentesco")`,
          output: `shared ['900', '901']
n_shared 2
note not_parentesco`,
        },
      },
      {
        id: "S31-T2-A-E3",
        subtopicId: "S31-T2-A",
        kind: "transfer",
        title: "Unión de nodos: entidades, cuentas, contactos",
        preamble:
          "- **Contexto:** el grafo del caso incluye personas, cuentas y valores de contacto como nodos de primera clase.\n- **Meta:** `nodes = entities ∪ accounts ∪ contact_values`; reportar cardinalidad y membresía.\n- **Éxito:** `n_nodes 5` / `has_contact True` / `has_ent True`.\n- **Límites:** no dupliques a mano; usa sets; fixture sintético.",
        instruction:
          "1. Une los tres conjuntos con el operador `|`.\n2. Imprime `n_nodes`, si `\"900\"` está y si `\"e1\"` está.\n3. No hardcodees `5`.\n4. No conviertas contactos en aristas sin nodos aquí.",
        hint: "Union de tres sets.",
        hints: [
          "nodes = set(entities) | set(accounts) | set(contacts).",
          "print n_nodes, has_contact, has_ent.",
        ],
        edgeCases: [],
        tests: "salida: n_nodes 5 / has_contact True / has_ent True",
        feedback:
          "Si `has_contact` es False, olvidaste el valor de teléfono como nodo: el path `E1 → 900 → E2` se rompe. La unión de sets evita duplicados sin hardcodear 5.",
        retrospective:
          "El set de nodos es la base de paths y ego-k. El error clásico es olvidar el valor de contacto y luego no poder dibujar el hop. Pregunta: ¿qué path se pierde si el teléfono no es nodo?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · union node set
# TODO: une los tres conjuntos de ids
entities = ['e1', 'e2']
accounts = ['a1']
contacts = ['900', '901']
nodes = set()  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `entities = ['e1', 'e2']
accounts = ['a1']
contacts = ['900', '901']
nodes = set(entities) | set(accounts) | set(contacts)
print("n_nodes", len(nodes))
print("has_contact", "900" in nodes)
print("has_ent", "e1" in nodes)`,
          output: `n_nodes 5
has_contact True
has_ent True`,
        },
      },
      {
        id: "S31-T2-B-E1",
        subtopicId: "S31-T2-B",
        kind: "guided",
        title: "Colapsar raw_id a canónico post-ER",
        preamble:
          "- **Contexto:** tras S30, dos raw del mismo canónico no deben generar aristas fantasmas en el grafo.\n- **Meta:** con mapa `canon` y aristas raw, reescribir a ids canónicos únicos y ordenados.\n- **Éxito:** `canonical_edges [('E1', 'E2')]` / `n 1` / `collapsed True`.\n- **Límites:** usa el mapa; no inventes canónicos; sin PII real.",
        instruction:
          "1. Reescribe cada arista con `canon[a]` y `canon[b]`.\n2. Colapsa con un `set` de tuples y ordena.\n3. Imprime `canonical_edges`, `n` y `collapsed True`.\n4. No dejes las aristas raw en el grafo final.",
        hint: "canon.get(x, x); set de tuples.",
        hints: [
          "ce = sorted({(canon[a], canon[b]) for a, b in edges}).",
          "Dos raw del mismo canónico colapsan en una arista.",
        ],
        edgeCases: ["dos raw del mismo canónico colapsan"],
        tests: "salida: canonical_edges [('E1', 'E2')] / n 1 / collapsed True",
        feedback:
          "Sin el mapa, r1 y r2 quedan como nodos distintos y el revisor ve hops fantasma. El set colapsa las dos aristas raw a una canónica E1–E2. Compara con `n 1`.",
        retrospective:
          "El mapa raw→canónico es el puente S30→S31: sin él, dos raw del mismo cliente generan aristas fantasmas y el path del revisor se fragmenta. El error clásico es copiar ids raw al grafo «para no perder información» y duplicar hops. Pregunta: ¿dónde guardas el mapa para reescribir aristas sin rehacer el matching? Siguiente (E2): agregar montos sin borrar `record_id`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · canonical id collapse
# TODO: reescribe aristas con ids canónicos (post-ER S30)
canon = {'r1': 'E1', 'r2': 'E1', 'r3': 'E2'}
edges = [('r1', 'r3'), ('r2', 'r3')]
ce = []  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `canon = {'r1': 'E1', 'r2': 'E1', 'r3': 'E2'}
edges = [('r1', 'r3'), ('r2', 'r3')]
ce = sorted({(canon[a], canon[b]) for a, b in edges})
print("canonical_edges", ce)
print("n", len(ce))
print("collapsed", True)`,
          output: `canonical_edges [('E1', 'E2')]
n 1
collapsed True`,
        },
      },
      {
        id: "S31-T2-B-E2",
        subtopicId: "S31-T2-B",
        kind: "independent",
        title: "Agregar montos conservando record_id",
        preamble:
          "- **Contexto:** el hop A→B del revisor muestra suma **y** lista de transacciones fuente.\n- **Meta:** por par `(src, dst)`, sumar `amount` y append de cada `record_id`.\n- **Éxito:** `sum 7` / `records ['1', '2']` / `detail_kept True`.\n- **Límites:** no descartes records al agregar; clave al menos `(src, dst)`; datos sintéticos.",
        instruction:
          "1. Para cada fila, clave `(src, dst)`.\n2. Suma `amount` y haz `append` del `record_id`.\n3. Imprime sum, records y `detail_kept True` del par A–B.\n4. No reemplaces la lista de records por un solo id.",
        hint: "defaultdict con sum y lista; append record_id.",
        hints: [
          "agg[k]['sum'] += amount; agg[k]['records'].append(record_id).",
          "No descartes el record_id al agregar.",
        ],
        edgeCases: [],
        tests: "salida: sum 7 / records ['1', '2'] / detail_kept True",
        feedback:
          "Si solo imprimes `sum 7` sin `records`, el revisor no puede abrir las transacciones del hop. Append cada `record_id`; no lo sobrescribas. Compara con la salida canónica.",
        retrospective:
          "Agregado acelera filtros; detalle responde «muéstrame las transacciones de este hop». Si solo dejas el total, el path es un número opaco y el workbench deja de ser auditable. El error clásico es sobrescribir la lista de records con un solo id. Pregunta: ¿qué imprimirías si `detail_kept` fuera False en CI? Luego (E3): probar el invariante `sum(n) == len(detail)`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · aggregate amount keep records
# TODO: agrega montos SIN borrar record_id
from collections import defaultdict
rows = [
    {'src': 'A', 'dst': 'B', 'amount': 3, 'record_id': '1'},
    {'src': 'A', 'dst': 'B', 'amount': 4, 'record_id': '2'},
]
agg = defaultdict(lambda: {'sum': 0, 'records': []})
# completar bucle e imprimir sum, records, detail_kept
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
rows = [
    {'src': 'A', 'dst': 'B', 'amount': 3, 'record_id': '1'},
    {'src': 'A', 'dst': 'B', 'amount': 4, 'record_id': '2'},
]
agg = defaultdict(lambda: {'sum': 0, 'records': []})
for r in rows:
    k = (r['src'], r['dst'])
    agg[k]['sum'] += r['amount']
    agg[k]['records'].append(r['record_id'])
print("sum", agg[('A', 'B')]['sum'])
print("records", agg[('A', 'B')]['records'])
print("detail_kept", True)`,
          output: `sum 7
records ['1', '2']
detail_kept True`,
        },
      },
      {
        id: "S31-T2-B-E3",
        subtopicId: "S31-T2-B",
        kind: "transfer",
        title: "Invariante: suma de n igual a detail",
        preamble:
          "- **Contexto:** un bug silencioso es agregar y «perder» filas: el path deja de ser auditable.\n- **Meta:** construir capa agregada (`n` y `records` por par) y verificar `sum(n) == len(detail)`.\n- **Éxito:** `ok True` / `total 5` / `detail_n 5`.\n- **Límites:** no hardcodees `ok True`; construye desde `detail`; sin PII.",
        instruction:
          "1. Acumula `n` y `records` por `(src, dst)`.\n2. Calcula el total sumando el `n` de cada agregado.\n3. Imprime `ok`, `total` y `detail_n`.\n4. No borres filas del detalle original.",
        hint: "Primero agrega por par; el total sale de sumar el `n` de cada agregado, y `ok` compara ese total contra el detalle.",
        hints: [
          "Acumula n y records por (src, dst) a partir de detail.",
          "El invariante garantiza que no perdiste filas de detalle al agregar.",
        ],
        edgeCases: [],
        tests: "salida: ok True / total 5 / detail_n 5",
        feedback:
          "El invariante es un test de regresión de auditoría: si `total != detail_n`, perdiste filas al agregar. No hardcodees `ok True` sin construir `aggs`. Compara con `total 5`.",
        retrospective:
          "Contrastar cardinalidades (`sum(n)` vs. `len(detail)`) es el hábito que evita bugs silenciosos de agregación. El error clásico es confiar en el dict agregado porque «las sumas se ven bien». Pregunta: si `total != detail_n` en CI, ¿fallas el build o solo logueas un warning? Ese gate te sirve en el You Do y en el workbench real.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · aggregate vs. detail invariant
# TODO: agrega desde detail y comprueba que no se perdieron filas
from collections import defaultdict
detail = [
    {'src': 'A', 'dst': 'B', 'record_id': '1'},
    {'src': 'A', 'dst': 'B', 'record_id': '2'},
    {'src': 'B', 'dst': 'C', 'record_id': '3'},
    {'src': 'B', 'dst': 'C', 'record_id': '4'},
    {'src': 'C', 'dst': 'D', 'record_id': '5'},
]
detail_n = len(detail)
aggs = defaultdict(lambda: {'n': 0, 'records': []})
# completar bucle de agregación; total = sum de n; print ok, total, detail_n
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
detail = [
    {'src': 'A', 'dst': 'B', 'record_id': '1'},
    {'src': 'A', 'dst': 'B', 'record_id': '2'},
    {'src': 'B', 'dst': 'C', 'record_id': '3'},
    {'src': 'B', 'dst': 'C', 'record_id': '4'},
    {'src': 'C', 'dst': 'D', 'record_id': '5'},
]
detail_n = len(detail)
aggs = defaultdict(lambda: {'n': 0, 'records': []})
for r in detail:
    k = (r['src'], r['dst'])
    aggs[k]['n'] += 1
    aggs[k]['records'].append(r['record_id'])
total = sum(a['n'] for a in aggs.values())
print("ok", total == detail_n)
print("total", total)
print("detail_n", detail_n)`,
          output: `ok True
total 5
detail_n 5`,
        },
      },
      {
        id: "S31-T3-A-E1",
        subtopicId: "S31-T3-A",
        kind: "guided",
        title: "Grado no dirigido por nodo",
        preamble:
          "- **Contexto:** el grado ayuda a filtrar hubs y priorizar exploración en el grafo del caso.\n- **Meta:** en un grafo no dirigido, contar vecinos por nodo (ambos extremos).\n- **Éxito:** `deg {'a': 2, 'b': 2, 'c': 2}` / `max 2` / `n 3`.\n- **Límites:** cuenta u y v por arista; no uses grado como culpa; datos sintéticos.",
        instruction:
          "1. Por cada arista, `deg[u] += 1` y `deg[v] += 1`.\n2. Imprime el dict con keys sorted, el máximo y `n`.\n3. No hardcodees los 2.\n4. No conviertas el grado en etiqueta de conducta.",
        hint: "En no dirigido, cuenta ambos extremos de cada arista.",
        hints: [
          "deg[u] += 1; deg[v] += 1.",
          "print deg como {k: deg[k] for k in sorted(deg)}.",
        ],
        edgeCases: [],
        tests: "salida: deg {'a': 2, 'b': 2, 'c': 2} / max 2 / n 3",
        feedback:
          "En no dirigido, cada arista suma 1 a ambos extremos. Si solo cuentas `u`, los grados salen a la mitad. Grado prioriza exploración; no sentencia. Compara con el dict canónico.",
        retrospective:
          "Grado es estructura: filtra hubs y prioriza exploración, nunca etiqueta conducta. El error clásico es contar solo un extremo (como si el grafo fuera dirigido) o convertir el máximo en «sospechoso». Pregunta: en un triángulo a–b–c, ¿por qué todos los grados salen 2? Siguiente (E2): componentes conexas del grafo del caso.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · undirected degree
# TODO: calcula grados no dirigidos
from collections import defaultdict
edges = [('a', 'b'), ('b', 'c'), ('a', 'c')]
deg = defaultdict(int)
# completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [('a', 'b'), ('b', 'c'), ('a', 'c')]
deg = defaultdict(int)
for u, v in edges:
    deg[u] += 1
    deg[v] += 1
print("deg", {k: deg[k] for k in sorted(deg)})
print("max", max(deg.values()))
print("n", len(deg))`,
          output: `deg {'a': 2, 'b': 2, 'c': 2}
max 2
n 3`,
        },
      },
      {
        id: "S31-T3-A-E2",
        subtopicId: "S31-T3-A",
        kind: "independent",
        title: "Componentes conexas del grafo",
        preamble:
          "- **Contexto:** un caso de revisión suele vivir en un subgrafo acotado; las islas irrelevantes no deben mezclarse en la misma vista.\n- **Meta:** listar componentes (cada una sorted) ordenadas por el primer nodo.\n- **Éxito:** `comps [['a', 'b'], ['c', 'd', 'e']]` / `n_comp 2` / `ok True`.\n- **Límites:** grafo no dirigido; no hardcodees las listas; datos sintéticos.",
        instruction:
          "1. Construye adj no dirigido (ya en starter).\n2. DFS o BFS desde cada nodo no visitado; ordena cada comp.\n3. Ordena la lista de comps por el primer id.\n4. Imprime `comps`, `n_comp` y `ok True`.",
        hint: "DFS o BFS desde cada nodo no visitado; sort componentes.",
        hints: [
          "Construye adj no dirigido con defaultdict(set).",
          "comps = sorted(comps, key=lambda c: c[0]).",
        ],
        edgeCases: [],
        tests: "salida: comps [['a', 'b'], ['c', 'd', 'e']] / n_comp 2 / ok True",
        feedback:
          "Dos islas: {a,b} y {c,d,e}. Si mezclas nodos entre islas, el `seen` no está marcando bien. Ordena cada comp y la lista por el primer id para salida estable.",
        retrospective:
          "Las componentes conexas acotan el caso y evitan mezclar islas irrelevantes en la misma vista del revisor. El error clásico es un `seen` incompleto que «puentea» islas o hardcodear las listas en vez de recorrer el adj. Pregunta: si mañana aparece un puente sintético entre las dos islas, ¿qué cambia en `n_comp` y en la cola de revisión? Luego (E3): BFS path A→D con hops y found.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · connected components
# TODO: lista componentes conexas
from collections import defaultdict
edges = [('a', 'b'), ('c', 'd'), ('d', 'e')]
adj = defaultdict(set)
for u, v in edges:
    adj[u].add(v)
    adj[v].add(u)
# completar DFS/BFS
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [('a', 'b'), ('c', 'd'), ('d', 'e')]
adj = defaultdict(set)
for u, v in edges:
    adj[u].add(v)
    adj[v].add(u)
seen, comps = set(), []
for s in sorted(adj):
    if s in seen:
        continue
    stack, comp = [s], []
    seen.add(s)
    while stack:
        n = stack.pop()
        comp.append(n)
        for m in adj[n]:
            if m not in seen:
                seen.add(m)
                stack.append(m)
    comps.append(sorted(comp))
comps = sorted(comps, key=lambda c: c[0])
print("comps", comps)
print("n_comp", len(comps))
print("ok", True)`,
          output: `comps [['a', 'b'], ['c', 'd', 'e']]
n_comp 2
ok True`,
        },
      },
      {
        id: "S31-T3-A-E3",
        subtopicId: "S31-T3-A",
        kind: "transfer",
        title: "BFS path reproducible A→D",
        preamble:
          "- **Contexto:** el path del revisor es una hipótesis con evidencia, no un auto-veredicto de fraude.\n- **Meta:** BFS de A a D con vecinos sorted; reportar path, hops y found.\n- **Éxito:** `path ['A', 'B', 'C', 'D']` / `hops 3` / `found True`.\n- **Límites:** vecinos sorted; no inventes atajos; sin etiquetas de culpa.",
        instruction:
          "1. BFS con `deque` desde A; `seen` evita revisitas.\n2. Explora `sorted(adj[n])` para reproducibilidad.\n3. Al llegar a D, guarda el path y calcula hops = len−1.\n4. Imprime `path`, `hops` y `found`.",
        hint: "deque BFS; hops = len(path) - 1.",
        hints: [
          "q = deque([('A', ['A'])]); seen = {'A'}.",
          "Explora vecinos sorted para reproducibilidad.",
        ],
        edgeCases: [],
        tests: "salida: path ['A', 'B', 'C', 'D'] / hops 3 / found True",
        feedback:
          "Sin `sorted(adj[n])` el path puede variar entre corridas y el revisor pierde reproducibilidad. Path + hops es hipótesis, no veredicto. Compara con la salida canónica.",
        retrospective:
          "Path + hops es el contrato del workbench. El error clásico es orden no determinista o confundir path con veredicto. Pregunta: ¿qué disclaimer pondrías junto al path en la UI del revisor?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · BFS path hops
# TODO: BFS reproducible A → D
from collections import defaultdict, deque
adj = defaultdict(set)
for u, v in [('A', 'B'), ('B', 'C'), ('C', 'D')]:
    adj[u].add(v)
    adj[v].add(u)
path = None  # completar BFS
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict, deque
adj = defaultdict(set)
for u, v in [('A', 'B'), ('B', 'C'), ('C', 'D')]:
    adj[u].add(v)
    adj[v].add(u)
q = deque([('A', ['A'])])
seen = {'A'}
path = None
while q:
    n, p = q.popleft()
    if n == 'D':
        path = p
        break
    for m in sorted(adj[n]):
        if m not in seen:
            seen.add(m)
            q.append((m, p + [m]))
print("path", path)
print("hops", len(path) - 1)
print("found", path is not None)`,
          output: `path ['A', 'B', 'C', 'D']
hops 3
found True`,
        },
      },
      {
        id: "S31-T3-B-E1",
        subtopicId: "S31-T3-B",
        kind: "guided",
        title: "Degree centrality deg/(n−1) sin culpa",
        preamble:
          "- **Contexto:** en redes simples no dirigidas, la centrality estándar normaliza por `n−1`, no por el máximo observado del lote.\n- **Meta:** acumular grado, normalizar, reportar top y score; siempre `guilt=False`.\n- **Éxito:** `top H` / `score 1.0` / `guilt False`.\n- **Límites:** no uses max_observed como denominador; no etiquetes fraude; datos sintéticos.",
        instruction:
          "1. Acumula deg en ambos extremos.\n2. `n = len(deg)`; `norm = deg / (n - 1)`.\n3. Elige top y redondea score a 2 decimales.\n4. Imprime top, score y `guilt False`.",
        hint: "Acumula deg desde ambos extremos; n = len(deg); score = deg / (n - 1).",
        hints: [
          "deg[u] += 1; deg[v] += 1 por cada arista.",
          "norm = {k: deg[k] / (n - 1) for k in deg}; guilt siempre False.",
        ],
        edgeCases: ["guilt siempre False en enunciado pedagógico"],
        tests: "salida: top H / score 1.0 / guilt False",
        feedback:
          "Denominador es `n - 1` (nodos), no el max grado del lote. H conectado a A,B,C da score 1.0. `guilt` siempre False: la métrica ordena la cola, no cierra el caso.",
        retrospective:
          "La fórmula correcta evita inflar rankings con lotes chicos mal normalizados. El error clásico es deg/max o convertir score en culpa. Siguiente (E2): clasificar el hub como infra o persona.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · degree centrality estándar deg/(n-1)
# TODO: acumula deg; n = len(deg); norm = deg/(n-1); reporta top (sin culpa)
from collections import defaultdict
edges = [('H', 'A'), ('H', 'B'), ('H', 'C')]
deg = defaultdict(int)
# completar: acumular deg, n, norm, top, prints
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [('H', 'A'), ('H', 'B'), ('H', 'C')]
deg = defaultdict(int)
for u, v in edges:
    deg[u] += 1
    deg[v] += 1
n = len(deg)
norm = {k: deg[k] / (n - 1) for k in deg}
top = max(norm, key=norm.get)
print("top", top)
print("score", round(norm[top], 2))
print("guilt", False)`,
          output: `top H
score 1.0
guilt False`,
        },
      },
      {
        id: "S31-T3-B-E2",
        subtopicId: "S31-T3-B",
        kind: "independent",
        title: "Hub infra vs. persona por prefijo",
        preamble:
          "- **Contexto:** un hub `INF-PAY` de pagos no implica culpa de las personas `PER-` conectadas.\n- **Meta:** calcular grado desde aristas, elegir hub y clasificar por prefijo `INF-` / `PER-`.\n- **Éxito:** `kind infra` / `disclaimer centrality_not_guilt` / `hub INF-PAY`.\n- **Límites:** grado desde aristas (no ranking pre-horneado); sin fraude automático.",
        instruction:
          "1. Acumula deg en ambos extremos.\n2. `hub = max(deg, key=deg.get)`.\n3. `kind = 'infra' if hub.startswith('INF-') else 'person'`.\n4. Imprime kind, disclaimer y hub.",
        hint: "Acumula deg desde ambos extremos; hub = max(deg, key=deg.get); startswith('INF-').",
        hints: [
          "for u, v in edges: deg[u] += 1; deg[v] += 1.",
          "kind = 'infra' if hub.startswith('INF-') else 'person'. Un hub de infraestructura no implica culpa.",
        ],
        edgeCases: ["grado se calcula desde aristas, no desde un ranking pre-horneado"],
        tests: "salida: kind infra / disclaimer centrality_not_guilt / hub INF-PAY",
        feedback:
          "INF-PAY es infraestructura de pagos: alto grado esperado y no es culpa. Si hardcodeas el hub sin calcular grado, el ejercicio pierde el punto. Siempre emite el disclaimer.",
        retrospective:
          "Interpretar el hub con tipo de nodo evita castigar infraestructura legítima (procesador de pagos, call center). El error clásico es hardcodear el ranking o tratar alto grado de `INF-` como culpa de las `PER-` conectadas. Pregunta: si el hub fuera `PER-99` con el mismo grado, ¿qué cambia en la cola humana y qué disclaimer se mantiene? Luego (E3): high-degree **y** etypes incidentes del hub.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · hub infra vs. person (degree desde aristas)
# TODO: calcula grado, elige hub y clasifica por prefijo INF-/PER-
from collections import defaultdict
edges = [
    ('INF-PAY', 'PER-01'),
    ('INF-PAY', 'PER-02'),
    ('INF-PAY', 'PER-03'),
    ('INF-PAY', 'PER-04'),
    ('INF-PAY', 'PER-05'),
    ('PER-01', 'PER-02'),
]
deg = defaultdict(int)
hub = None  # completar tras acumular deg
kind = None  # completar: 'infra' o 'person'
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [
    ('INF-PAY', 'PER-01'),
    ('INF-PAY', 'PER-02'),
    ('INF-PAY', 'PER-03'),
    ('INF-PAY', 'PER-04'),
    ('INF-PAY', 'PER-05'),
    ('PER-01', 'PER-02'),
]
deg = defaultdict(int)
for u, v in edges:
    deg[u] += 1
    deg[v] += 1
hub = max(deg, key=deg.get)
kind = "infra" if hub.startswith("INF-") else "person"
print("kind", kind)
print("disclaimer", "centrality_not_guilt")
print("hub", hub)`,
          output: `kind infra
disclaimer centrality_not_guilt
hub INF-PAY`,
        },
      },
      {
        id: "S31-T3-B-E3",
        subtopicId: "S31-T3-B",
        kind: "transfer",
        title: "High-degree e interpretación por etypes",
        preamble:
          "- **Contexto:** un hub con `shared_phone` y `transfer` no se interpreta igual que un hub solo de transferencias.\n- **Meta:** calcular degree y etypes desde aristas; filtrar degree ≥ 3; ver si H es solo `transfer`.\n- **Éxito:** `high ['H']` / `only_transfer False` / `interpret_with_types True`.\n- **Límites:** no uses dict pre-horneado de incidentes; sin labels de fraude; sintético.",
        instruction:
          "1. Acumula deg y sets de etype por extremo.\n2. `high = sorted` nodos con deg ≥ 3.\n3. `only_transfer` si etypes de H son solo `{'transfer'}`.\n4. Imprime high, only_transfer e `interpret_with_types True`.",
        hint: "Construye degree y etypes desde la lista de aristas; no uses un dict pre-horneado.",
        hints: [
          "Acumula deg y sets de etype por extremo de cada arista.",
          "only_transfer = etypes del hub son solo {'transfer'}.",
        ],
        edgeCases: ["shared_phone en el hub fuerza only_transfer False"],
        tests: "salida: high ['H'] / only_transfer False / interpret_with_types True",
        feedback:
          "H tiene `shared_phone` además de `transfer`: `only_transfer` debe ser False. Rankear solo por grado sin mirar etypes es un número ciego para el revisor.",
        retrospective:
          "Centralidad sin tipos de arista es un número ciego. El error clásico es rankear solo por grado. Pregunta: ¿cómo cambiaría la cola si H fuera solo `transfer`?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · high-degree + edge types
# TODO: calcula degree y etypes desde aristas (no uses incident pre-horneado)
from collections import defaultdict
edges = [
    ('H', 'A', 'transfer'),
    ('H', 'B', 'transfer'),
    ('H', 'C', 'shared_phone'),
]
deg = defaultdict(int)
etypes = defaultdict(set)
# completar acumulación, high, only_transfer
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [
    ('H', 'A', 'transfer'),
    ('H', 'B', 'transfer'),
    ('H', 'C', 'shared_phone'),
]
deg = defaultdict(int)
etypes = defaultdict(set)
for u, v, t in edges:
    deg[u] += 1
    deg[v] += 1
    etypes[u].add(t)
    etypes[v].add(t)
high = sorted(n for n, d in deg.items() if d >= 3)
only_tx = etypes["H"] == {"transfer"}
print("high", high)
print("only_transfer", only_tx)
print("interpret_with_types", True)`,
          output: `high ['H']
only_transfer False
interpret_with_types True`,
        },
      },
      {
        id: "S31-T4-A-E1",
        subtopicId: "S31-T4-A",
        kind: "guided",
        title: "Ego k-hop desde la semilla del caso",
        preamble:
          "- **Contexto:** el workbench arranca en la entidad seed y expande con hop limit configurable.\n- **Meta:** implementar expansión por capas; comparar k=1 y k=2 desde A en A–B–C–D.\n- **Éxito:** `k1 ['A', 'B']` / `k2 ['A', 'B', 'C']` / `has_D_k2 False`.\n- **Límites:** no incluyas D en k=2; no hardcodees sets; datos sintéticos.",
        instruction:
          "1. Completa `ego`: por cada hop, vecinos no vistos → nueva layer.\n2. Imprime sorted de k=1 y k=2.\n3. Imprime si D está en k=2 (debe ser False).\n4. No devuelvas solo `{seed}`.",
        hint: "Expansión por capas con sets.",
        hints: [
          "layer actual → vecinos no vistos → nueva layer.",
          "k=1: {A,B}; k=2: {A,B,C}.",
        ],
        edgeCases: [],
        tests: "salida: k1 ['A', 'B'] / k2 ['A', 'B', 'C'] / has_D_k2 False",
        feedback:
          "El starter devuelve solo `{seed}`: hay que expandir por capas. En la cadena A–B–C–D, k=2 llega a C pero no a D. Si `has_D_k2` es True, el radio está mal contado.",
        retrospective:
          "Ego-k es el recorte operativo del caso. El error clásico es un solo paso o el grafo completo. Siguiente (E2): invariantes no_self / pesos / provenance.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · ego k-hop
# TODO: implementa ego(seed, k)
from collections import defaultdict
edges = [('A', 'B'), ('B', 'C'), ('C', 'D')]
adj = defaultdict(set)
for u, v in edges:
    adj[u].add(v)
    adj[v].add(u)

def ego(seed, k):
    return {seed}  # completar expansión por capas
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges = [('A', 'B'), ('B', 'C'), ('C', 'D')]
adj = defaultdict(set)
for u, v in edges:
    adj[u].add(v)
    adj[v].add(u)

def ego(seed, k):
    seen = {seed}
    layer = {seed}
    for _ in range(k):
        nxt = set()
        for n in layer:
            for m in adj[n]:
                if m not in seen:
                    seen.add(m)
                    nxt.add(m)
        layer = nxt
    return seen
print("k1", sorted(ego('A', 1)))
print("k2", sorted(ego('A', 2)))
print("has_D_k2", 'D' in ego('A', 2))`,
          output: `k1 ['A', 'B']
k2 ['A', 'B', 'C']
has_D_k2 False`,
        },
      },
      {
        id: "S31-T4-A-E2",
        subtopicId: "S31-T4-A",
        kind: "independent",
        title: "Invariantes: self-loop, pesos, provenance",
        preamble:
          "- **Contexto:** cada bug de construcción (self-loop basura, peso negativo, rid faltante) merece un test de regresión.\n- **Meta:** evaluar `no_self`, `w_ok` y `prov` sobre un fixture con self-loop deliberado.\n- **Éxito:** `no_self False` / `w_ok True` / `prov True`.\n- **Límites:** no «arregles» el fixture; mide lo que hay; sintético.",
        instruction:
          "1. Calcula `no_self = all(src != dst)` sobre el fixture (incluye self-loop b→b).\n2. Calcula `w_ok = all(w >= 0)`.\n3. Calcula `prov = all(rid presente)`.\n4. Imprime los tres booleanos; no «arregles» el fixture.",
        hint: "any self-loop; all weights; all rid.",
        hints: [
          "no_self = all(e['src'] != e['dst'] for e in edges).",
          "El self-loop en el starter debe hacer no_self False.",
        ],
        edgeCases: ["self-loop falla no_self"],
        tests: "salida: no_self False / w_ok True / prov True",
        feedback:
          "El self-loop b→b es intencional: `no_self` debe ser False. No «arregles» el fixture; el punto es detectar el defecto. Pesos y rid del fixture pasan.",
        retrospective:
          "Los invariantes convierten calidad del grafo en asserts de regresión: self-loop basura, peso negativo y rid faltante deben fallar de forma explícita. El error clásico es «arreglar» el fixture del test para que todo pase verde. Pregunta: ¿en qué orden reportarías los tres flags al revisor del builder? Luego (E3): build idempotente que conserve dirección.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · graph invariants
# TODO: evalúa invariantes de calidad del grafo
edges = [
    {'src': 'a', 'dst': 'b', 'w': 1, 'rid': '1'},
    {'src': 'b', 'dst': 'b', 'w': 2, 'rid': '2'},
]
# print no_self, w_ok, prov
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [
    {'src': 'a', 'dst': 'b', 'w': 1, 'rid': '1'},
    {'src': 'b', 'dst': 'b', 'w': 2, 'rid': '2'},
]
no_self = all(e['src'] != e['dst'] for e in edges)
w_ok = all(e['w'] >= 0 for e in edges)
prov = all(e.get('rid') for e in edges)
print("no_self", no_self)
print("w_ok", w_ok)
print("prov", prov)`,
          output: `no_self False
w_ok True
prov True`,
        },
      },
      {
        id: "S31-T4-A-E3",
        subtopicId: "S31-T4-A",
        kind: "transfer",
        title: "Build idempotente conservando dirección",
        preamble:
          "- **Contexto:** el revisor re-ejecuta el builder; A→B no es B→A en un grafo dirigido de transferencias.\n- **Meta:** `build` determinista con `sorted(set(edges))` sin reordenar extremos de cada arista.\n- **Éxito:** `equal True` / `edges [('a', 'b'), ('b', 'c')]` / `idempotent True`.\n- **Límites:** no hagas `tuple(sorted(e))` por arista; orden de entrada no debe cambiar el grafo canónico.",
        instruction:
          "1. Implementa `build` como `sorted(set(edges))`.\n2. Compara dos builds del mismo raw y del raw invertido.\n3. Imprime `equal`, `edges` e `idempotent`.\n4. No simetrices pares dirigidos.",
        hint: "build → sorted(set(edges)); no uses sorted(e) por arista si el grafo es dirigido.",
        hints: [
          "Cada arista es un par ordenado (src, dst). set + sorted de la lista basta.",
          "equal = build(raw) == build(list(raw)); sin eso el revisor no confía en re-runs.",
        ],
        edgeCases: ["orden de entrada no debe cambiar el grafo canónico.", "no colapses A→B con B→A."],
        tests: "salida: equal True / edges [('a', 'b'), ('b', 'c')] / idempotent True",
        feedback:
          "Si haces `tuple(sorted(e))` por arista, inviertes transferencias y el path miente. `sorted(set(edges))` conserva dirección y estabiliza el orden. Compara con la salida canónica.",
        retrospective:
          "Idempotencia + dirección = confianza en re-runs. El error clásico es colapsar A→B con B→A. Pregunta: ¿qué se rompe en auditoría si el path invierte un hop de transferencia?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · build idempotence (conserva dirección)
# TODO: build determinista con par ordenado (src, dst); no inviertas extremos
raw = [('a', 'b'), ('b', 'c')]

def build(edges):
    return []  # completar: sorted(set(...)) sin reordenar cada arista
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw = [('a', 'b'), ('b', 'c')]

def build(edges):
    # Conserva dirección: no hacer tuple(sorted(e)) por arista
    return sorted(set(edges))
print("equal", build(raw) == build(list(raw)))
print("edges", build(raw))
print("idempotent", build(raw) == build(list(reversed(raw))))`,
          output: `equal True
edges [('a', 'b'), ('b', 'c')]
idempotent True`,
        },
      },
      {
        id: "S31-T4-B-E1",
        subtopicId: "S31-T4-B",
        kind: "guided",
        title: "Redactar email en labels de la vista",
        preamble:
          "- **Contexto:** la vista del revisor muestra lo mínimo para decidir; el portafolio nunca lleva PII completa.\n- **Meta:** local[:2] + `***@` + domain para `ana@example.pe`.\n- **Éxito:** `redacted an***@example.pe` / `domain example.pe` / `full_pii False`.\n- **Límites:** solo datos `@example.pe`; no imprimas el local completo.",
        instruction:
          "1. Ya tienes `partition('@')`.\n2. Arma `red = local[:2] + '***@' + domain`.\n3. Imprime redacted, domain y `full_pii False`.\n4. No hardcodees el string final sin usar local/domain.",
        hint: "partition('@'); local[:2].",
        hints: [
          "local, _, domain = email.partition('@').",
          "red = local[:2] + '***@' + domain.",
        ],
        edgeCases: [],
        tests: "salida: redacted an***@example.pe / domain example.pe / full_pii False",
        feedback:
          "Redact es el default de la vista, no un extra. Si imprimes `ana@example.pe` completo, fallas compliance del lab. Usa `local[:2]` + `***@` + domain.",
        retrospective:
          "La vista del revisor (y el portafolio) llevan lo mínimo necesario para decidir; el local completo no es «debug útil», es riesgo de compliance. El error clásico es hardcodear el string redactado sin usar `local`/`domain` o loguear PII «por si acaso». Pregunta: ¿qué cambia si el email real llegara fuera de `@example.pe`? Siguiente (E2): adjuntar records por hop del path.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · email redact
# TODO: redacta el local del email
email = 'ana@example.pe'
local, _, domain = email.partition('@')
red = None  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `email = 'ana@example.pe'
local, _, domain = email.partition('@')
red = local[:2] + '***@' + domain
print("redacted", red)
print("domain", domain)
print("full_pii", False)`,
          output: `redacted an***@example.pe
domain example.pe
full_pii False`,
        },
      },
      {
        id: "S31-T4-B-E2",
        subtopicId: "S31-T4-B",
        kind: "independent",
        title: "Evidencia de arista por hop del path",
        preamble:
          "- **Contexto:** al hacer clic en cada hop, el revisor debe ver `records` (y en prod ts/source).\n- **Meta:** dado un path y un dict de evidencia por par, listar records en orden del path.\n- **Éxito:** `records [['r1'], ['r2', 'r3']]` / `n_hops 2` / `explainable True`.\n- **Límites:** un hop sin evidence no es explicable; datos sintéticos.",
        instruction:
          "1. Recorre pares consecutivos con `zip(path, path[1:])`.\n2. Busca cada par en `ev`.\n3. Imprime `records`, `n_hops` y `explainable True`.\n4. No inventes records.",
        hint: "zip(path, path[1:]); get evidence.",
        hints: [
          "records = [ev[(a, b)] for a, b in zip(path, path[1:])].",
          "Cada hop del path debe ser explicable con records.",
        ],
        edgeCases: [],
        tests: "salida: records [['r1'], ['r2', 'r3']] / n_hops 2 / explainable True",
        feedback:
          "Path sin records es layout; path con records es evidencia. `zip(path, path[1:])` alinea cada hop al dict `ev`. No inventes rids faltantes.",
        retrospective:
          "Cada hop del path debe mapear a evidencia (`records`, y en prod ts/source); si un par falta en el dict, el hop no es explicable. El error clásico es inventar rids o listar records en orden arbitrario. Pregunta: ¿qué mostraría la UI si `ev` no tuviera el par del segundo hop? Luego (E3): política de escala render vs. summarize.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · path edge evidence
# TODO: adjunta records por hop del path
path = ['E1', 'E2', 'E3']
ev = {('E1', 'E2'): ['r1'], ('E2', 'E3'): ['r2', 'r3']}
records = []  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `path = ['E1', 'E2', 'E3']
ev = {('E1', 'E2'): ['r1'], ('E2', 'E3'): ['r2', 'r3']}
records = [ev[(a, b)] for a, b in zip(path, path[1:])]
print("records", records)
print("n_hops", len(records))
print("explainable", True)`,
          output: `records [['r1'], ['r2', 'r3']]
n_hops 2
explainable True`,
        },
      },
      {
        id: "S31-T4-B-E3",
        subtopicId: "S31-T4-B",
        kind: "transfer",
        title: "Política de escala: render o summarize",
        preamble:
          "- **Contexto:** dibujar 5000 nodos en el navegador del revisor no es «más transparente»: es ruido.\n- **Meta:** si `n_nodes > max_n` → `summarize`; si no → `render`. Probar 5000 y 50 con max_n=500.\n- **Éxito:** `n5000 summarize` / `n50 render` / `max_n 500`.\n- **Límites:** umbral ilustrativo del lab (no universal); sintético; sin PII.",
        instruction:
          "1. Completa `decide(n)` con el umbral.\n2. Imprime decisión para 5000 y 50.\n3. Imprime `max_n`.\n4. No dejes siempre `\"render\"`.",
        hint: "decide(n) = 'summarize' if n > max_n else 'render'.",
        hints: [
          "No intentes dibujar 5000 nodos en el navegador del revisor.",
          "Dos prints de decisión + max_n.",
        ],
        edgeCases: [],
        tests: "salida: n5000 summarize / n50 render / max_n 500",
        feedback:
          "El starter siempre devuelve `render`: 5000 debe ir a `summarize`. El umbral 500 es del lab, no una constante universal. Compara con la salida canónica.",
        retrospective:
          "Escala es política de producto: ego-k o resumen, no «todo el banco». El error clásico es forzar render total. Pregunta: ¿qué resumen mostrarías (top hubs, tamaños de componentes, conteos por etype)?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · scale policy summarize
# TODO: política render vs. summarize
max_n = 500

def decide(n):
    return "render"  # completar
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `max_n = 500

def decide(n):
    return "summarize" if n > max_n else "render"
print("n5000", decide(5000))
print("n50", decide(50))
print("max_n", max_n)`,
          output: `n5000 summarize
n50 render
max_n 500`,
        },
      },
    ],
  },
  youDo: {
    title: "Grafo temporal con caminos de evidencia (CP-N3-B inicio)",
    context:
      "Tras el ER de S30, construye un grafo sintético con entidades, cuentas, contactos y transacciones. Usa el fixture conceptual `CASO-LIM-031` con `@example.pe`. El grafo debe tener multiaristas, provenance y consulta de camino reproducible con hop limit. El revisor debe poder abrir un path (p. ej. `E1 → ph:900 → E2`), ver records por hop y un disclaimer de centralidad — sin auto-label de fraude ni parentesco. Reporta degree solo como estructura.",
    objectives: [
      "Modelo nodos/aristas con dirección, peso y tipos del schema canónico",
      "Multigrafo temporal con provenance por arista",
      "Construcción desde tablas y agregación sin borrar detalle",
      "Grado, componentes, paths con hop limit",
      "Subgrafo de caso (ego-k), tests de invariantes y vista redactada con evidencia",
    ],
    requirements: [
      "Datos sintéticos únicamente; sin PII real (`@example.pe`, fixture conceptual CASO-LIM-031 / run_id conceptual cpn3b-01)",
      "Módulo o `graph.json` con nodos/aristas tipadas (`owns`, `transfer`, `shared_phone`, `has_phone`, `has_email`, …)",
      "Capa de detalle + capa agregada (lista de `record_id` conservada por par)",
      "`path(src, dst, max_hops)` reproducible (vecinos sorted; mismo orden en re-ejecución)",
      "Tests mínimos: no self-loop basura, provenance presente, construcción idempotente, ego-k no excede radio",
      "Vista de path con labels redactados + records por hop + disclaimer de centralidad",
      "README es-PE: schema, hop limit, política render vs. summarize, centralidad = estructura no culpa",
      "Cero labels automáticos de fraude o parentesco",
    ],
    starterCode: `# CP-N3-B inicio — grafo de evidencia (CASO-LIM-031 sintético)
# Entrega: módulo o graph.json + tests + README es-PE (ver requirements).
from collections import defaultdict, deque
from typing import Any

# Schema canónico: owns | transfer | shared_phone | shared_email | has_phone | has_email
ETYPE = ("owns", "transfer", "shared_phone", "shared_email", "has_phone", "has_email")

def add_undirected(adj: dict, u: str, v: str) -> None:
    adj[u].add(v)
    adj[v].add(u)

def bfs_path(adj: dict, src: str, dst: str, max_depth: int = 4) -> list[str] | None:
    """Camino reproducible (vecinos sorted) con hop limit."""
    q = deque([(src, [src])])
    seen = {src}
    while q:
        n, path = q.popleft()
        if n == dst:
            return path
        if len(path) > max_depth:
            continue
        for m in sorted(adj.get(n, [])):
            if m not in seen:
                seen.add(m)
                q.append((m, path + [m]))
    return None

def build_from_tables(entities, accounts, txs, contacts) -> dict[str, Any]:
    """Proyecta tablas → nodos + aristas tipadas con provenance.
    TODO: owns, transfer, has_phone/has_email; falla si falta record_id.
    """
    raise NotImplementedError("construye nodos/aristas tipadas con provenance")

def aggregate_keep_detail(detail_edges: list[dict]) -> dict:
    """Capa agregada + lista de record_id por par (nunca borres el detalle)."""
    raise NotImplementedError("suma montos y conserva records")

def ego(adj: dict, seed: str, k: int = 1) -> set[str]:
    """Subgrafo de caso: seed + k hops."""
    raise NotImplementedError("expansión por capas")

def redact_label(value: str, kind: str = "email") -> str:
    """Privacidad: enmascara email/teléfono sintético para la vista del revisor."""
    raise NotImplementedError("redacta labels de la vista")

def path_view(path: list[str], edge_store: dict) -> dict:
    """Vista de path: labels redactados + records por hop + disclaimer de centralidad."""
    raise NotImplementedError("arma view explicable para la cola humana")

if __name__ == "__main__":
    # Fixture mínimo de humo (amplía con multiaristas y tests).
    adj: dict = defaultdict(set)
    add_undirected(adj, "E1", "ph:900")
    add_undirected(adj, "E2", "ph:900")
    print("path", bfs_path(adj, "E1", "E2"))
    print("disclaimer", "centrality_structure_only_not_guilt")
`,
    portfolioNote:
      "Inicio CP-N3-B: entrega un grafo de evidencia con tests mínimos y política de escala documentada. La vista de path redactada es la pieza lista para portafolio y el puente natural hacia el workbench de S34.",
    rubric: [
      { criterion: "Modelo de grafo completo (tipos, pesos, provenance, multiedges)", weight: "25%" },
      { criterion: "Correctitud técnica (paths, agregación, tests) en entorno local-python", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros (hop limit, schema)", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE)", weight: "10%" },
      { criterion: "Path + provenance y disclaimer de centralidad (checklist de excelencia)", weight: "bonus" },
      { criterion: "Sin inferencia automática de fraude ni parentesco (gate obligatorio)", weight: "gate" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un test (idempotencia, no self-loop, provenance, ego-k)? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, redacción, roles)? (3) En el README, una frase de impacto medible (p. ej. «path + records por hop sin auto-label») que puedas defender en 30 segundos ante un revisor de compliance. El grafo explica conexiones; no sentencia culpabilidad.",
  },
  selfCheck: {
    questions: [
      {
        question: "En CP-N3-B, un score alto de centralidad significa:",
        options: ["Que el nodo tiene más transferencias que ningún otro", "Que el nodo une comunidades que estarían separadas sin él", "Posición estructural que requiere contexto, no culpa", "Que el nodo aparece en la mayoría de los caminos más cortos"],
        correctIndex: 2,
        explanation:
          "Centralidad mide estructura de la red; no es veredicto de culpabilidad.",
      },
      {
        question: "Provenance en una arista sirve para:",
        options: ["Auditar source/record_id del hecho relacional", "Solo color en UI", "Entrenar redes neuronales obligatoriamente", "Ocultar el path"],
        correctIndex: 0,
        explanation:
          "Sin source y record_id el revisor no puede auditar el hecho.",
      },
      {
        question: "Al agregar transferencias entre el mismo par debes:",
        options: ["Sumar los montos y quedarte solo con el total del par", "Conservar detalle o punteros además del agregado", "Promediar las fechas para tener un único instante por par", "Quedarte con la transferencia mayor como representante del par"],
        correctIndex: 1,
        explanation:
          "El agregado acelera filtros; el detalle responde la auditoría.",
      },
      {
        question: "Shared phone entre dos entidades implica:",
        options: ["Que las dos entidades son la misma persona mal resuelta", "Que el teléfono pertenece a una de las dos y no a la otra", "Que la arista debe pesar más que una transferencia directa", "Un hecho de contacto compartido a investigar con evidencia, no veredicto"],
        correctIndex: 3,
        explanation:
          "Hecho de contacto ≠ veredicto de parentesco o fraude.",
      },
      {
        question: "Un camino E1→phone→E2 en el grafo de evidencia implica…",
        options: ["que las dos entidades pertenecen a la misma comunidad del grafo", "que la distancia de dos saltos vale igual que una arista directa", "hipótesis de relación con evidencia auditable para revisión humana", "que el teléfono compartido identifica al titular de ambas cuentas"],
        correctIndex: 2,
        explanation:
          "El grafo soporta investigación: evidencia y caminos, no veredictos.",
      },
      {
        question: "¿Por qué modelar un multigrafo en transferencias E1→E2?",
        options: ["Para conservar varios hechos/fuente entre el mismo par sin colapsar auditoría", "Para poder recorrer el grafo en ambas direcciones sin duplicar nodos", "Para que los pesos se sumen solos al consultar el par", "Para permitir que un par tenga aristas de ida y de vuelta distintas"],
        correctIndex: 0,
        explanation:
          "Varias aristas = varios hechos auditables; el agregado es una capa aparte.",
      },
      {
        question: "Un hop limit en BFS del workbench sirve sobre todo para:",
        options: ["Garantizar que el camino demuestre fraude", "Acotar costo y ruido de caminos largos poco accionables", "Eliminar la necesidad de provenance", "Convertir el grafo en no dirigido"],
        correctIndex: 1,
        explanation:
          "Sin límite, caminos largos son caros y poco útiles para revisión humana.",
      },
      {
        question: "En el schema de esta sección, una transferencia de cuenta a cuenta se modela como arista:",
        options: ["no dirigida con etype `owns`", "sin tipo, solo con layout visual", "siempre como `shared_phone`", "dirigida con etype `transfer` y peso en PEN (u otra unidad documentada)"],
        correctIndex: 3,
        explanation:
          "La arista `transfer` es dirigida; `owns` es entidad→cuenta; `shared_phone` es un hecho de contacto.",
      },
      {
        question: "Un ego-subgraph con seed S y k=1 incluye:",
        options: ["Todo el grafo del banco", "Solo nodos con centralidad máxima", "Solo S y sus vecinos directos (radio 1)", "Únicamente aristas transfer, nunca contactos"],
        correctIndex: 2,
        explanation:
          "ego-k = semilla + vecinos hasta k saltos; k=1 es el anillo inmediato del caso.",
      },
      {
        question: "Si mezclas PEN y conteos en el mismo campo weight sin documentar unidades:",
        options: ["Rompes agregaciones y comparaciones posteriores del workbench", "El grafo sigue siendo correcto: el peso es solo un número", "Se corrige al normalizar los pesos entre 0 y 1 antes de agregar", "Solo afecta a la visualización, no a las métricas calculadas"],
        correctIndex: 0,
        explanation:
          "El peso es evidencia cuantitativa: declara unidades (PEN, count, score) en el schema.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "NetworkX Graph types",
        url: "https://networkx.org/documentation/stable/reference/classes/index.html",
        note: "Grafos y multigrafos",
      },
      {
        label: "NetworkX tutorial",
        url: "https://networkx.org/documentation/stable/tutorial.html",
        note: "API práctica de construcción",
      },
      {
        label: "NetworkX — shortest paths",
        url: "https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html",
        note: "Caminos reproducibles",
      },
      {
        label: "NetworkX — centrality",
        url: "https://networkx.org/documentation/stable/reference/algorithms/centrality.html",
        note: "Degree (dominio S31); betweenness/closeness para profundizar",
      },
      {
        label: "Graph theory overview",
        url: "https://en.wikipedia.org/wiki/Graph_theory",
        note: "Caminos, componentes, centralidad",
      },
      {
        label: "Provenance (W3C PROV)",
        url: "https://www.w3.org/TR/prov-overview/",
        note: "Provenance de aristas/hechos",
      },
      {
        label: "Neo4j graph data modeling (concept)",
        url: "https://neo4j.com/docs/getting-started/data-modeling/",
        note: "Nodos/relaciones tipadas",
      },
    ],
    books: [
      {
        label: "Networks, Crowds, and Markets (Easley/Kleinberg)",
        note: "Caminos y centralidad con interpretación",
      },
      {
        label: "Data Matching / entity graphs",
        note: "Puente ER → grafo",
      },
    ],
    courses: [
      {
        label: "Coursera — social/network analysis",
        url: "https://www.coursera.org/courses?query=network%20analysis%20graph",
        note: "Análisis de redes",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos reproducibles",
      },
      {
        label: "Stanford SNAP / network resources",
        url: "https://snap.stanford.edu/",
        note: "Grafos a escala (referencia)",
      },
    ],
  },
}
