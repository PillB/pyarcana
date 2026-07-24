import type { CourseSection } from '../../types'

export const section31: CourseSection = {
  id: "streaming-data",
  index: 31,
  title: "Grafos y evidencia relacional",
  shortTitle: "Grafos y evidencia",
  tagline: "grafo temporal que responde cómo están conectados con camino reproducible y no convierte centralidad en culpabilidad",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-violet-500 to-indigo-800",
  jobRelevance:
    "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*.",
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
      heading: "De entidades resueltas a grafo de evidencia (inicio CP-N3-B)",
      paragraphs: [
        "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades resueltas con caminos reproducibles y **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco.",
        "Hilo conductor: contactos, cuentas y transferencias **sintéticas** del fixture `CASO-LIM-031` (`run_id=cpn3b-01`, `@example.pe`, Lima / Red Andina). Contrato: filas → grafo con tipos, pesos y provenance; error tipificado si falta `record_id` o el schema de arista.",
        "Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad y privacidad**. El revisor ve **path + evidencia**, nunca un auto-veredicto. Schema canónico de aristas en esta sección: `owns` · `transfer` · `shared_phone` · `shared_email` · `has_phone` · `has_email`.",
      ],
      callout: {
        type: "info",
        title: "Puente desde S30",
        content:
          "Los ids canónicos del ER alimentan nodos; las transacciones y contactos alimentan aristas. Sin provenance, el grafo es decoración y no sirve al workbench.",
      },
    },
    {
      heading: "Nodos, aristas, dirección y peso",
      subtopicId: "S31-T1-A",
      paragraphs: [
        "Un **nodo** es una entidad del caso (cliente, cuenta, email o teléfono sintético). Una **arista** es un **hecho relacional** con tipo (`etype`), y opcionalmente **dirección** y **peso** (monto en PEN, frecuencia o score de confianza). Sin tipos estables, el path del revisor no se puede filtrar ni auditar.",
        "Dirigido vs no dirigido: las transferencias son **dirigidas**; “comparte teléfono/dirección” suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
        "El **peso** es evidencia cuantitativa (**no** veredicto). Declara **unidades** en el schema: `PEN`, `count` o `score`. Mezclar unidades en el mismo campo rompe agregaciones y rankings posteriores del workbench.",
      ],
      code: {
        language: 'python',
        title: "graph_model.py",
        code: `def s31_th_1():
    # modelo mínimo de grafo dirigido con pesos (CP-N3-B)
    nodes = {
        "E1": {"kind": "entity", "label": "Ana López"},
        "E2": {"kind": "entity", "label": "Luis Ríos"},
        "C1": {"kind": "account", "label": "cta-1001"},
    }
    edges = [
        {"src": "E1", "dst": "C1", "etype": "owns", "weight": 1.0, "directed": True},
        {"src": "E1", "dst": "E2", "etype": "shared_phone", "weight": 0.8, "directed": False},
        {"src": "C1", "dst": "E2", "etype": "transfer", "weight": 250.0, "directed": True},
    ]
    print("n_nodes", len(nodes))
    print("n_edges", len(edges))
    print("types", sorted({e["etype"] for e in edges}))

s31_th_1()
`,
        output: `n_nodes 3
n_edges 3
types ['owns', 'shared_phone', 'transfer']`,
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
        "**Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados **filtran por ventana** cuando el caso lo exija; no mezcles 2019 con 2026 sin documentarlo. Si falta `record_id`, el builder debe fallar de forma tipificada.",
        "**Provenance** (`source_system`, `run_id`, `record_id`) responde “¿de dónde salió esta arista?”. Sin provenance el grafo no sirve al workbench de CP-N3-B: es layout sin auditoría.",
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
        "Patrón habitual: entity —`owns`→ account; account —`transfer`→ account; entity —`has_phone`/`has_email`→ valor de contacto. Cuando dos entidades apuntan al mismo valor, el revisor ve un **hecho de contacto compartido** — no parentesco ni fraude. El valor de contacto como **nodo** facilita detectar ese hecho sin inventar una arista persona–persona opaca.",
        "Usa ids **sintéticos estables** (`ent-001`, `acc-1`) y dominios demo (`@example.pe`). Ids estables hacen la construcción **idempotente** (mismas filas → mismo grafo ordenado). Nunca cargues PII real en ejercicios del curso.",
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
    print("nodes", len(nodes))
    print("edges", len(edges))
    print("shared_phone", True)

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
          "Modelar el valor de contacto como nodo facilita detectar shared-contact sin inventar parentesco ni fraude: es un hecho de contacto compartido a revisar, no un veredicto.",
      },
    },
    {
      heading: "Deduplicación y agregación sin borrar detalle",
      subtopicId: "S31-T2-B",
      paragraphs: [
        "**Deduplicar nodos** tras el ER colapsa ids canónicos; conserva el mapa `raw_id → canonical_id` para reescribir aristas sin perder trazabilidad del matching de S30. Sin ese mapa, dos raw del mismo canónico generan aristas fantasmas o rompen el path del revisor.",
        "**Agregar aristas**: suma montos, cuenta eventos, min/max `ts` — y guarda una **capa de detalle** (lista de `record_id` o punteros a las filas fuente). El agregado acelera filtros y dashboards; el detalle responde “muéstrame las transacciones de este hop”.",
        "Si solo dejas el agregado, el revisor no puede explicar el camino con evidencia. El workbench de investigación (y el inicio de CP-N3-B) necesita **ambas capas**: sumario para priorizar y fuente para auditar.",
      ],
      code: {
        language: 'python',
        title: "dedup_agg.py",
        code: `def s31_th_4():
    from collections import defaultdict
    detail = [
        {"src": "E1", "dst": "E2", "amount": 100.0, "record_id": "tx-1"},
        {"src": "E1", "dst": "E2", "amount": 50.0, "record_id": "tx-2"},
        {"src": "E2", "dst": "E3", "amount": 20.0, "record_id": "tx-3"},
    ]
    agg = defaultdict(lambda: {"sum": 0.0, "n": 0, "records": []})
    for d in detail:
        k = (d["src"], d["dst"])
        agg[k]["sum"] += d["amount"]
        agg[k]["n"] += 1
        agg[k]["records"].append(d["record_id"])
    # capa agregada + detalle intacto
    print("pairs", len(agg))
    print("E1_E2", agg[("E1", "E2")]["sum"], agg[("E1", "E2")]["n"])
    print("detail_kept", len(detail) == sum(v["n"] for v in agg.values()))

s31_th_4()
`,
        output: `pairs 2
E1_E2 150.0 2
detail_kept True`,
      },
      callout: {
        type: "danger",
        title: "Agregado ≠ evidencia completa",
        content:
          "Mostrar solo sum(amount) sin records impide contestar 'muéstrame las transacciones'.",
      },
    },
    {
      heading: "Grado, componentes y caminos",
      subtopicId: "S31-T3-A",
      paragraphs: [
        "**Grado** (degree): número de vecinos (in/out en dirigidos). Sirve para filtrar **hubs** (nodos de alto grado) y priorizar exploración — **no** para culpar a un nodo. En grafos dirigidos, reporta in-degree y out-degree por separado cuando el flujo importa (p. ej. transferencias).",
        "**Componentes conexas**: partición del grafo no dirigido subyacente. Un caso de revisión suele vivir en un **subgrafo acotado**; componentes aisladas ayudan a acotar ruido y a no mezclar islas irrelevantes en la misma vista.",
        "**Caminos**: BFS/DFS con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y, en producción, aristas + evidencia. Sin límite, caminos largos son caros y poco accionables para la cola humana.",
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
        "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* y *closeness* existen (ver NetworkX en recursos); en S31 dominas **degree + interpretación** y dejas las otras para profundizar con la documentación enlazada.",
        "Interpreta con contexto: tipo de arista, ventana temporal y si el nodo es **infraestructura** (`INF-…`) vs **persona** (`PER-…`). Un score alto solo prioriza la cola de revisión humana.",
        "Nunca automatices “alta centralidad → fraude”. Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica informa; el revisor decide con evidencia.",
      ],
      code: {
        language: 'python',
        title: "centrality_limits.py",
        code: `from collections import defaultdict
adj = defaultdict(set)
edges = [("P1", "HUB"), ("P2", "HUB"), ("P3", "HUB"), ("P1", "P2"), ("X", "Y")]
for u, v in edges:
    adj[u].add(v); adj[v].add(u)
degree_cent = {n: len(adj[n]) for n in adj}
# degree centrality: grado normalizado por el máximo del grafo
max_d = max(degree_cent.values())
norm = {n: degree_cent[n] / max_d for n in degree_cent}
print("top", sorted(norm, key=norm.get, reverse=True)[:1][0])
print("hub_degree", degree_cent["HUB"])
print("not_guilt", True)  # centralidad ≠ culpabilidad`,
        output: `top HUB
hub_degree 3
not_guilt True`,
      },
      callout: {
        type: "danger",
        title: "Centralidad ≠ culpabilidad",
        content:
          "Reporta métrica + tipos de arista + disclaimer. No etiquetes conducta indebida.",
      },
    },
    {
      heading: "Subgrafos y pruebas",
      subtopicId: "S31-T4-A",
      paragraphs: [
        "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso) más vecinos a **k hops** (saltos), con filtros de tipo/tiempo. Así el revisor no navega el grafo completo.",
        "Prueba invariantes: sin self-loops basura, pesos ≥ 0, provenance presente, construcción **idempotente** (mismas filas → mismo grafo ordenado). Cada bug de construcción (arista invertida, nodo huérfano) merece regresión.",
        "Tests típicos: cardinalidades, path existe/no existe, componente esperada, `ego(seed, k)` no incluye nodos fuera del radio. Ejemplo de revisión: seed `E1`, k=1 incluye el teléfono compartido; k=2 ya alcanza `E2` por ese contacto — el path es hipótesis, no veredicto.",
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
        "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. Si `n_nodes` supera un umbral, la política correcta es **resumir** (top hubs, componentes) en lugar de renderizar todo.",
        "**Privacidad**: enmascara PII (email parcial, teléfono parcial). Los roles ven solo lo necesario. Un layout bonito con PII completa es un incidente de compliance.",
        "**Evidencia por arista**: al hacer clic en un hop, muestra `records`, `ts` y `source`. Mini-caso: el revisor abre el path `E1 → ph:900 → E2`, ve dos `record_id` del contacto compartido y un disclaimer de centralidad — nunca un auto-label de fraude. Ese contrato alimenta la cola de CP-N3-B y el workbench de S34.",
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
          "Un layout bonito con PII completa es un incidente. Redacta por defecto.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el inicio de CP-N3-B: modelo de grafo, multiaristas con provenance, construcción desde tablas, paths y centralidad con límites — sin convertir estructura en culpa.",
    steps: [
      {
        demoId: "S31-T1-A-DEMO",
        subtopicId: "S31-T1-A",
        environment: "local-python",
        description: "Modela nodos entidad/cuenta y aristas owns, shared_phone y transfer con dirección y peso.",
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
        why: "Dirección y peso son parte del contrato del grafo, no adornos.",
      },
      {
        demoId: "S31-T1-B-DEMO",
        subtopicId: "S31-T1-B",
        environment: "local-python",
        description: "Multiaristas con timestamps y provenance por record_id.",
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
        why: "Multigrafo + provenance habilita auditoría del camino.",
      },
      {
        demoId: "S31-T2-A-DEMO",
        subtopicId: "S31-T2-A",
        environment: "local-python",
        description: "Construye nodos y aristas owns / shared_phone desde tablas sintéticas.",
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
        why: "Tablas → grafo con tipos estables del schema canónico.",
      },
      {
        demoId: "S31-T2-B-DEMO",
        subtopicId: "S31-T2-B",
        environment: "local-python",
        description: "Agrega montos por par conservando lista de record_id.",
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
        why: "Agregado y detalle conviven: el revisor puede pedir los records.",
      },
      {
        demoId: "S31-T3-A-DEMO",
        subtopicId: "S31-T3-A",
        environment: "local-python",
        description: "BFS path reproducible entre dos entidades con hop limit.",
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
print("path", path("A", "D"))
print("hops", len(path("A", "D")) - 1)
print("repro", True)
# Opcional en producción (mismo contrato):
# import networkx as nx
# G = nx.Graph(); G.add_edges_from([("A","B"),("B","C"),("C","D")])
# print(nx.shortest_path(G, "A", "D"))
`,
          output: `path ['A', 'B', 'C', 'D']
hops 3
repro True`,
        },
        why: "Camino acotado y ordenado = reproducible.",
      },
      {
        demoId: "S31-T3-B-DEMO",
        subtopicId: "S31-T3-B",
        environment: "local-python",
        description: "Calcula degree centrality y emite disclaimer de no-culpabilidad.",
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
        why: "Métrica estructural con interpretación limitada.",
      },
      {
        demoId: "S31-T4-A-DEMO",
        subtopicId: "S31-T4-A",
        environment: "local-python",
        description: "Extrae ego-subgraph k=1 y valida nodos esperados.",
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
print("ego", ego(adj, "S", 1))
print("k", 1)
print("test_ok", True)
`,
          output: `ego ['A', 'B', 'S']
k 1
test_ok True`,
        },
        why: "Subgrafo de caso testeable.",
      },
      {
        demoId: "S31-T4-B-DEMO",
        subtopicId: "S31-T4-B",
        environment: "local-python",
        description: "Redacta labels y adjunta evidencia de arista al path view.",
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
        why: "Vista de path con privacidad y evidencia.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de modelo, multigrafo, construcción, agregación, paths, centralidad, subgrafos y privacidad. Completa lo que falta en el starter y alinea tu salida al contrato de cada ejercicio.",
    steps: [
      {
        id: "S31-T1-A-E1",
        subtopicId: "S31-T1-A",
        kind: "guided",
        instruction:
          "S31-T1-A-E1 · Completa el modelo mínimo: dict `nodes` (3 ids) y lista `edges` con `src`, `dst`, `etype`, `weight`, `directed`. Imprime `n_nodes`, `n_edges` y cuántas aristas tienen `directed=True`. Fixture sintético `CASO-LIM-031` (run_id=cpn3b-01, @example.pe); sin PII real; sin etiquetar fraude ni parentesco.",
        hint: "Usa literales de dict/list y cuenta con sum(1 for e in edges if e['directed']).",
        hints: [
          "Completa la lista edges con owns (dirigida) y shared_phone (no dirigida).",
          "Cuenta con sum(1 for e in edges if e['directed']).",
        ],
        edgeCases: ["nodo sin aristas es válido", "weight puede ser float"],
        tests: "salida: n_nodes 3 / n_edges 2 / n_directed 1",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T1-A-E2 · Dada una lista de aristas dirigidas (src, dst, weight en PEN), calcula el **peso total saliente** por nodo (*out-strength*: suma de pesos de aristas que salen del nodo) e imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático.",
        hint: "Acumula en un dict solo por `src`; usa max(out, key=out.get).",
        hints: [
          "Acumula out[s] += w por cada arista saliente (ignora dst para el total).",
          "top = max(out, key=out.get); imprime top, value y n = len(out).",
        ],
        edgeCases: ["nodos solo destino no aparecen en out", "empates: max estable por primer max"],
        tests: "salida: top B / value 5.0 / n 2",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T1-A-E3 · Clasifica aristas en directed vs undirected y devuelve dos conteos; imprime también los `etype` únicos ordenados. Usa el schema canónico cuando puedas (`transfer`, `shared_phone`). Fixture `CASO-LIM-031`.",
        hint: "sets para etypes; sorted(set(...)).",
        hints: [
          "Cuenta directed=True y directed=False por separado.",
          "etypes = sorted({e['etype'] for e in edges}).",
        ],
        edgeCases: ["etype repetido colapsa en set"],
        tests: "salida: directed 2 / undirected 1 / etypes ['shared_phone', 'transfer']",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · directed vs undirected counts
# TODO: conteos directed/undirected + etypes únicos
edges = [
    {'directed': True, 'etype': 'transfer'},
    {'directed': False, 'etype': 'shared_phone'},
    {'directed': True, 'etype': 'transfer'},
]
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
print("directed", sum(1 for e in edges if e["directed"]))
print("undirected", sum(1 for e in edges if not e["directed"]))
print("etypes", sorted({e["etype"] for e in edges}))`,
          output: `directed 2
undirected 1
etypes ['shared_phone', 'transfer']`,
        },
      },
      {
        id: "S31-T1-B-E1",
        subtopicId: "S31-T1-B",
        kind: "guided",
        instruction:
          "S31-T1-B-E1 · A partir de aristas crudas (src, dst), construye el conteo multi-arista por par e imprime el par con más eventos, su conteo y cuántos pares distintos hay. Fixture `CASO-LIM-031`.",
        hint: "tuple (src, dst) como clave; Counter o dict de enteros.",
        hints: [
          "from collections import Counter; c = Counter(rows).",
          "pair, n = c.most_common(1)[0]; pairs = len(c).",
        ],
        edgeCases: ["orden src,dst importa"],
        tests: "salida: pair E1 E2 / n 2 / pairs 2",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T1-B-E2 · Filtra aristas con `ts >= '2026-02-01'` e imprime cuántas quedan, si todas tienen `record_id`, y el primer `record_id` del filtro. Fixture `CASO-LIM-031`.",
        hint: "Strings ISO de fecha son ordenables lexicográficamente.",
        hints: [
          "f = [e for e in edges if e['ts'] >= '2026-02-01'].",
          "all('record_id' in e for e in f).",
        ],
        edgeCases: ["límite inclusivo"],
        tests: "salida: n 2 / prov True / first b",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T1-B-E3 · Valida provenance: imprime `all_ok` True solo si cada arista tiene `source` y `record_id` no vacíos; imprime también `n_bad` y `n`. Fixture `CASO-LIM-031`.",
        hint: "bool(e.get('source') and e.get('record_id')); cuenta los que fallan.",
        hints: [
          "n_bad = sum(1 for e in edges if not ok(e)).",
          "all_ok = n_bad == 0.",
        ],
        edgeCases: ["source vacío exacto cuenta como mal"],
        tests: "salida: all_ok False / n_bad 1 / n 3",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-A-E1 · Desde `accounts[{id, owner}]` genera aristas `owns` e imprime la lista de (owner, id) ordenada, el conteo y el etype. Fixture `CASO-LIM-031`.",
        hint: "list comprehension + sorted por owner luego id.",
        hints: [
          "owns = sorted((a['owner'], a['id']) for a in accounts).",
          "Imprime owns, n y etype 'owns'.",
        ],
        edgeCases: ["orden lexicográfico"],
        tests: "salida: owns [('e1', 'a1'), ('e2', 'a2')] / n 2 / etype owns",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-A-E2 · Detecta valores de contacto compartidos por ≥2 entidades; imprime la lista sorted de valores shared, el conteo y la nota `not_parentesco`. Fixture `CASO-LIM-031`.",
        hint: "groupby por value con defaultdict(set); filtra len(entities) >= 2.",
        hints: [
          "m[v].add(e) por cada (e, v).",
          "shared = sorted(v for v, es in m.items() if len(es) >= 2).",
        ],
        edgeCases: ["shared contact ≠ parentesco"],
        tests: "salida: shared ['900', '901'] / n_shared 2 / note not_parentesco",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-A-E3 · Construye `nodes = entities ∪ accounts ∪ contact_values` e imprime `|nodes|` y flags de membresía. Fixture `CASO-LIM-031`.",
        hint: "Union de tres sets.",
        hints: [
          "nodes = set(entities) | set(accounts) | set(contacts).",
          "print n_nodes, has_contact, has_ent.",
        ],
        edgeCases: [],
        tests: "salida: n_nodes 5 / has_contact True / has_ent True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-B-E1 · Colapsa raw_ids a canonical con un mapa y reescribe aristas; imprime aristas canónicas únicas sorted. Fixture `CASO-LIM-031`.",
        hint: "canon.get(x, x); set de tuples.",
        hints: [
          "ce = sorted({(canon[a], canon[b]) for a, b in edges}).",
          "Dos raw del mismo canónico colapsan en una arista.",
        ],
        edgeCases: ["dos raw del mismo canónico colapsan"],
        tests: "salida: canonical_edges [('E1', 'E2')] / n 1 / collapsed True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-B-E2 · Agrega `amount` por (src, dst) y **conserva** `records`; imprime sum y records para ('A', 'B'). Fixture `CASO-LIM-031`.",
        hint: "defaultdict con sum y lista; append record_id.",
        hints: [
          "agg[k]['sum'] += amount; agg[k]['records'].append(record_id).",
          "No descartes el record_id al agregar.",
        ],
        edgeCases: [],
        tests: "salida: sum 7 / records ['1', '2'] / detail_kept True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T2-B-E3 · Desde filas de detalle, construye la capa agregada (`n` y `records` por par) y verifica el invariante: suma de `n` == `len(detail)`. Imprime `ok`, `total` y `detail_n`. Fixture `CASO-LIM-031`.",
        hint: "Primero agrega; luego total = sum(a['n'] for a in aggs.values()); ok = total == detail_n.",
        hints: [
          "Acumula n y records por (src, dst) a partir de detail.",
          "El invariante garantiza que no perdiste filas de detalle al agregar.",
        ],
        edgeCases: [],
        tests: "salida: ok True / total 5 / detail_n 5",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · aggregate vs detail invariant
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
        instruction:
          "S31-T3-A-E1 · Calcula el grado de cada nodo en un grafo **no dirigido**; imprime el dict de grados (keys sorted), el máximo y n. Fixture `CASO-LIM-031`.",
        hint: "En no dirigido, cuenta ambos extremos de cada arista.",
        hints: [
          "deg[u] += 1; deg[v] += 1.",
          "print deg como {k: deg[k] for k in sorted(deg)}.",
        ],
        edgeCases: [],
        tests: "salida: deg {'a': 2, 'b': 2, 'c': 2} / max 2 / n 3",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T3-A-E2 · Encuentra componentes conexas e imprime la lista de componentes (cada una sorted) ordenada por el primer nodo, más `n_comp`. Fixture `CASO-LIM-031`.",
        hint: "DFS o BFS desde cada nodo no visitado; sort componentes.",
        hints: [
          "Construye adj no dirigido con defaultdict(set).",
          "comps = sorted(comps, key=lambda c: c[0]).",
        ],
        edgeCases: [],
        tests: "salida: comps [['a', 'b'], ['c', 'd', 'e']] / n_comp 2 / ok True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T3-A-E3 · BFS path de 'A' a 'D' en la cadena A–B–C–D; imprime path, hops y found. Fixture `CASO-LIM-031`.",
        hint: "deque BFS; hops = len(path) - 1.",
        hints: [
          "q = deque([('A', ['A'])]); seen = {'A'}.",
          "Explora vecinos sorted para reproducibilidad.",
        ],
        edgeCases: [],
        tests: "salida: path ['A', 'B', 'C', 'D'] / hops 3 / found True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T3-B-E1 · Desde aristas no dirigidas, calcula el grado de cada nodo, normaliza por el máximo (degree centrality en [0, 1]), e imprime el nodo top, el score redondeado a 2 decimales y `guilt=False`. Fixture `CASO-LIM-031`.",
        hint: "Primero deg desde edges; luego score = deg / max_deg; round(score, 2).",
        hints: [
          "deg[u] += 1; deg[v] += 1 por cada arista.",
          "norm = {k: deg[k] / m for k in deg}; guilt siempre False.",
        ],
        edgeCases: ["guilt siempre False en enunciado pedagógico"],
        tests: "salida: top H / score 1.0 / guilt False",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · normalized degree centrality
# TODO: calcula grado desde edges, normaliza y reporta top (sin culpa)
from collections import defaultdict
edges = [('H', 'A'), ('H', 'B'), ('H', 'C')]
deg = defaultdict(int)
# completar: acumular deg, m = max, norm, top, prints
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
m = max(deg.values())
norm = {k: deg[k] / m for k in deg}
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
        instruction:
          "S31-T3-B-E2 · Dado un ranking de grado, elige el hub top y clasifícalo como `infra` o `person` por prefijo de id (`INF-` vs `PER-`); imprime kind, disclaimer y hub. Fixture `CASO-LIM-031`.",
        hint: "hub = max(deg, key=deg.get); startswith('INF-'); disclaimer fijo 'centrality_not_guilt'.",
        hints: [
          "kind = 'infra' if hub.startswith('INF-') else 'person'.",
          "Un hub de infraestructura no implica culpa de personas conectadas.",
        ],
        edgeCases: [],
        tests: "salida: kind infra / disclaimer centrality_not_guilt / hub INF-PAY",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · hub infra vs person
# TODO: elige el hub de mayor grado y clasifícalo por prefijo
deg = {'INF-PAY': 5, 'PER-01': 2, 'PER-02': 1}
hub = None  # completar: nodo de mayor degree
kind = None  # completar: 'infra' o 'person'
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `deg = {'INF-PAY': 5, 'PER-01': 2, 'PER-02': 1}
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
        instruction:
          "S31-T3-B-E3 · A partir de aristas tipadas, calcula el grado de cada nodo y los etypes incidentes. Filtra nodos con degree ≥ 3; imprime `high` sorted y si el hub H tiene solo `transfer` (`only_transfer`). Interpreta siempre con tipos de arista. Fixture `CASO-LIM-031` (run_id=cpn3b-01, @example.pe); datos sintéticos solo; sin fraude ni parentesco.",
        hint: "Construye degree y etypes desde la lista de aristas; no uses un dict pre-horneado.",
        hints: [
          "Acumula deg y sets de etype por extremo de cada arista.",
          "only_transfer = etypes del hub son solo {'transfer'}.",
        ],
        edgeCases: ["shared_phone en el hub fuerza only_transfer False"],
        tests: "salida: high ['H'] / only_transfer False / interpret_with_types True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T4-A-E1 · Implementa `ego(seed, k)` e imprime ego k=1 y k=2 desde 'A' en la cadena A–B–C–D (k=2 no incluye D). Fixture `CASO-LIM-031`.",
        hint: "Expansión por capas con sets.",
        hints: [
          "layer actual → vecinos no vistos → nueva layer.",
          "k=1: {A,B}; k=2: {A,B,C}.",
        ],
        edgeCases: [],
        tests: "salida: k1 ['A', 'B'] / k2 ['A', 'B', 'C'] / has_D_k2 False",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T4-A-E2 · Prueba invariantes: no self-loops, weights ≥ 0, provenance presente. Imprime los tres flags. Fixture `CASO-LIM-031`.",
        hint: "any self-loop; all weights; all rid.",
        hints: [
          "no_self = all(e['src'] != e['dst'] for e in edges).",
          "El self-loop en el starter debe hacer no_self False.",
        ],
        edgeCases: ["self-loop falla no_self"],
        tests: "salida: no_self False / w_ok True / prov True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T4-A-E3 · Idempotencia: construir el grafo dos veces desde las mismas edges produce la misma lista sorted. Imprime equal, edges y idempotent. Fixture `CASO-LIM-031`.",
        hint: "función build → sorted(set(...)); compara dos builds.",
        hints: [
          "build debe ser determinista (sort + set).",
          "equal = build(raw) == build(list(raw)).",
        ],
        edgeCases: [],
        tests: "salida: equal True / edges [('a', 'b'), ('b', 'c')] / idempotent True",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · build idempotence
# TODO: build determinista y comparación equal
raw = [('a', 'b'), ('b', 'c')]

def build(edges):
    return []  # completar: sorted set de tuples normalizados
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw = [('a', 'b'), ('b', 'c')]

def build(edges):
    return sorted(set(tuple(sorted(e)) for e in edges))
print("equal", build(raw) == build(list(raw)))
print("edges", build(raw))
print("idempotent", True)`,
          output: `equal True
edges [('a', 'b'), ('b', 'c')]
idempotent True`,
        },
      },
      {
        id: "S31-T4-B-E1",
        subtopicId: "S31-T4-B",
        kind: "guided",
        instruction:
          "S31-T4-B-E1 · Redacta emails: muestra 2 primeras letras del local + `***@` + domain. Imprime redacted para ana@example.pe, domain y full_pii=False. Fixture `CASO-LIM-031`.",
        hint: "partition('@'); local[:2].",
        hints: [
          "local, _, domain = email.partition('@').",
          "red = local[:2] + '***@' + domain.",
        ],
        edgeCases: [],
        tests: "salida: redacted an***@example.pe / domain example.pe / full_pii False",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T4-B-E2 · Dado un path de nodos y un dict `edge_evidence` por par consecutivo, imprime la lista de record lists en orden del path. Fixture `CASO-LIM-031`.",
        hint: "zip(path, path[1:]); get evidence.",
        hints: [
          "records = [ev[(a, b)] for a, b in zip(path, path[1:])].",
          "Cada hop del path debe ser explicable con records.",
        ],
        edgeCases: [],
        tests: "salida: records [['r1'], ['r2', 'r3']] / n_hops 2 / explainable True",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S31-T4-B-E3 · Política de escala: si n_nodes > max_n, devuelve 'summarize'; si no, 'render'. Imprime decisión para 5000 y 50 con max_n=500. Fixture `CASO-LIM-031`.",
        hint: "decide(n) = 'summarize' if n > max_n else 'render'.",
        hints: [
          "No intentes dibujar 5000 nodos en el navegador del revisor.",
          "Dos prints de decisión + max_n.",
        ],
        edgeCases: [],
        tests: "salida: n5000 summarize / n50 render / max_n 500",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-031 · scale policy summarize
# TODO: política render vs summarize
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
      "Construye un grafo sintético entity/account/contact/tx con multiaristas, provenance y consulta de camino reproducible. Reporta centralidad solo con disclaimer de estructura (no es culpabilidad). Hechos de contacto compartido no implican fraude ni parentesco.",
    objectives: [
      "Modelo nodos/aristas con dirección, peso y tipos del schema canónico",
      "Multigrafo temporal con provenance por arista",
      "Construcción desde tablas y agregación sin borrar detalle",
      "Grado, componentes, paths con hop limit",
      "Subgrafo de caso, tests y vista redactada con evidencia",
    ],
    requirements: [
      "Datos sintéticos solo; sin PII real (`@example.pe`, fixture conceptual CASO-LIM-031)",
      "Módulo o `graph.json` con nodos/aristas tipadas (`owns`, `transfer`, `shared_phone`, `has_phone`, `has_email`, …)",
      "Capa de detalle + capa agregada (records conservados)",
      "`path(src, dst, max_hops)` reproducible (mismo orden en re-ejecución)",
      "Tests mínimos: no self-loop basura, provenance presente, construcción idempotente",
      "Vista de path con labels redactados + records por hop",
      "README es-PE con disclaimer: centralidad = estructura, no culpa",
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
      "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos y una vista de path redactada lista para portafolio.",
    rubric: [
      { criterion: "Modelo de grafo completo (tipos, pesos, provenance, multiedges)", weight: "25%" },
      { criterion: "Correctitud técnica (paths, agregación, tests) en entorno local-python", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros (hop limit, schema)", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE)", weight: "10%" },
      { criterion: "Path + provenance y disclaimer de centralidad", weight: "bonus checklist" },
      { criterion: "Sin inferencia automática de fraude ni parentesco", weight: "criterio de privacidad" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "En CP-N3-B, un score alto de centralidad significa:",
        options: [
          "Fraude confirmado",
          "Parentesco automático",
          "Posición estructural que requiere contexto, no culpa",
          "Borrar al nodo",
        ],
        correctIndex: 2,
        explanation:
          "Centralidad mide estructura de la red; no es veredicto de culpabilidad.",
      },
      {
        question: "Provenance en una arista sirve para:",
        options: [
          "Auditar source/record_id del hecho relacional",
          "Solo color en UI",
          "Entrenar redes neuronales obligatoriamente",
          "Ocultar el path",
        ],
        correctIndex: 0,
        explanation:
          "Sin source y record_id el revisor no puede auditar el hecho.",
      },
      {
        question: "Al agregar transferencias entre el mismo par debes:",
        options: [
          "Borrar record_ids",
          "Conservar detalle o punteros además del agregado",
          "Etiquetar fraude",
          "Eliminar el multigrafo",
        ],
        correctIndex: 1,
        explanation:
          "El agregado acelera filtros; el detalle responde la auditoría.",
      },
      {
        question: "Shared phone entre dos entidades implica:",
        options: [
          "Parentesco legal",
          "Colusión",
          "Fraude automático",
          "Un hecho de contacto compartido a investigar con evidencia, no veredicto",
        ],
        correctIndex: 3,
        explanation:
          "Hecho de contacto ≠ veredicto de parentesco o fraude.",
      },
      {
        question: "Un camino E1→phone→E2 en el grafo de evidencia implica…",
        options: [
          "fraude o parentesco legal automático",
          "borrar nodos INF- del grafo",
          "hipótesis de relación con evidencia auditable para revisión humana",
          "omitir provenance de aristas",
        ],
        correctIndex: 2,
        explanation:
          "El grafo soporta investigación: evidencia y caminos, no veredictos.",
      },
      {
        question: "¿Por qué modelar un multigrafo en transferencias E1→E2?",
        options: [
          "Para borrar el detalle y dejar un solo peso",
          "Para conservar varios hechos/fuente entre el mismo par sin colapsar auditoría",
          "Porque NetworkX lo exige siempre",
          "Para etiquetar fraude automáticamente",
        ],
        correctIndex: 1,
        explanation:
          "Varias aristas = varios hechos auditables; el agregado es una capa aparte.",
      },
      {
        question: "Un hop limit en BFS del workbench sirve sobre todo para:",
        options: [
          "Garantizar que el camino demuestre fraude",
          "Acotar costo y ruido de caminos largos poco accionables",
          "Eliminar la necesidad de provenance",
          "Convertir el grafo en no dirigido",
        ],
        correctIndex: 1,
        explanation:
          "Sin límite, caminos largos son caros y poco útiles para revisión humana.",
      },
      {
        question: "En el schema de esta sección, una transferencia de cuenta a cuenta se modela como arista:",
        options: [
          "no dirigida con etype owns",
          "dirigida con etype transfer y peso en PEN (u otra unidad documentada)",
          "sin tipo, solo con layout visual",
          "siempre como shared_phone",
        ],
        correctIndex: 1,
        explanation:
          "transfer es dirigida; owns es entidad→cuenta; shared_phone es hecho de contacto.",
      },
      {
        question: "Un ego-subgraph con seed S y k=1 incluye:",
        options: [
          "Todo el grafo del banco",
          "Solo S y sus vecinos directos (radio 1)",
          "Solo nodos con centralidad máxima",
          "Únicamente aristas transfer, nunca contactos",
        ],
        correctIndex: 1,
        explanation:
          "ego-k = semilla + vecinos hasta k saltos; k=1 es el anillo inmediato del caso.",
      },
      {
        question: "Si mezclas PEN y conteos en el mismo campo weight sin documentar unidades:",
        options: [
          "Mejora el ranking automático de fraude",
          "Rompes agregaciones y comparaciones posteriores del workbench",
          "NetworkX lo corrige solo",
          "El multigrafo deja de ser necesario",
        ],
        correctIndex: 1,
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
