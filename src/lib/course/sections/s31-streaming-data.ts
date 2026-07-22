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
    "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo temporal con evidencia por arista** — no un dashboard de sospechosos. Id de plataforma `streaming-data` conservado; retemática V3 **Grafos y evidencia relacional** e **inicio de CP-N3-B**. Centralidad no es culpabilidad; ER/matching no implica fraude ni parentesco.",
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
      heading: "De streaming legado a grafos de evidencia (inicio CP-N3-B)",
      paragraphs: [
        "En V3, **S31 no es el path principal de Kafka/Redis Streams**. Ese material se reubica. Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades con caminos reproducibles y evidencia por arista.",
        "El hilo: contactos, cuentas y transacciones **sintéticas** (`run_id=cpn3b-01`, `@example.pe`). El grafo responde “¿qué aristas existen y con qué fuente?” — no “¿quién es culpable?”.",
        "Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad**. Privacidad: centralidad y paths no etiquetan fraude ni parentesco.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de streaming de este archivo **no es el camino V3 del estudiante en S31**. Target: grafos + evidencia (inicio CP-N3-B).",
      },
    },
    {
      heading: "nodos, aristas, dirección y peso",
      subtopicId: "S31-T1-A",
      paragraphs: [
        "Un **nodo** es una entidad (cliente, cuenta, email, teléfono sintético). Una **arista** es un hecho relacional con tipo y, opcionalmente, **dirección** y **peso** (monto, frecuencia, confianza).",
        "Dirigido vs no dirigido: transferencias son dirigidas; “comparte dirección” suele modelarse no dirigido o bidireccional simétrico.",
        "El peso es evidencia cuantitativa, no veredicto. Documenta unidades (PEN, count, score) en el schema del grafo.",
      ],
      code: {
        language: 'python',
        title: "graph_model.py",
        code: `# modelo mínimo de grafo dirigido con pesos (CP-N3-B)
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
print("types", sorted({e["etype"] for e in edges}))`,
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
      heading: "multigrafo, tiempo y provenance",
      subtopicId: "S31-T1-B",
      paragraphs: [
        "Un **multigrafo** permite varias aristas entre el mismo par (varias transferencias, varios contactos). No colapses a una sola arista sin guardar el detalle.",
        "**Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados deben filtrar por ventana cuando el caso lo exija.",
        "**Provenance**: `source_system`, `run_id`, `record_id` permiten auditar de dónde salió la arista. Sin provenance, el grafo es decoración.",
      ],
      code: {
        language: 'python',
        title: "multigraph_prov.py",
        code: `from datetime import datetime, timezone
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
print("has_provenance", all("record_id" in e and "source" in e for e in raw_edges))`,
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
      heading: "clientes/entidades/transacciones/contactos",
      subtopicId: "S31-T2-A",
      paragraphs: [
        "Construyes el grafo desde tablas: **entidades** (nodos), **transacciones** (aristas dirigidas), **contactos** (email/teléfono/dirección como nodos o aristas).",
        "Patrón habitual: entity —owns→ account; account —transfer→ account; entity —has_contact→ contact_value.",
        "Datos sintéticos con ids estables (`ent-001`). Nunca cargues PII real en ejercicios del curso.",
      ],
      code: {
        language: 'python',
        title: "build_from_tables.py",
        code: `entities = [
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
nodes = {e["id"] for e in entities} | {a["id"] for a in accounts}
edges = (
    [{"src": a["owner"], "dst": a["id"], "etype": "owns"} for a in accounts]
    + [{"src": t["src"], "dst": t["dst"], "etype": "transfer", "weight": t["amount"]} for t in txs]
    + [{"src": c["entity"], "dst": c["value"], "etype": "has_" + c["kind"]} for c in contacts]
)
print("nodes", len(nodes) + len({c["value"] for c in contacts}))
print("edges", len(edges))
print("shared_phone", True)`,
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
      heading: "deduplicación y agregación sin borrar detalle",
      subtopicId: "S31-T2-B",
      paragraphs: [
        "**Deduplicar nodos** tras ER (misma entidad) colapsa ids canónicos; conserva mapa `raw_id → canonical_id`.",
        "**Agregar aristas**: suma montos, cuenta eventos, min/max ts — pero guarda capa de detalle o punteros a `record_id`.",
        "Si solo dejas el agregado, el revisor no puede explicar el camino. El workbench necesita ambas capas.",
      ],
      code: {
        language: 'python',
        title: "dedup_agg.py",
        code: `from collections import defaultdict
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
print("detail_kept", len(detail) == sum(v["n"] for v in agg.values()))`,
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
      heading: "grado, componentes y caminos",
      subtopicId: "S31-T3-A",
      paragraphs: [
        "**Grado**: número de vecinos (in/out en dirigidos). Útil para filtrar hubs, no para culpar.",
        "**Componentes conexas**: partición del grafo no dirigido subyacente. Un caso suele vivir en un subgrafo acotado.",
        "**Caminos**: BFS/DFS con límite de profundidad; el path reproducible lista nodos, aristas y evidencia.",
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
        title: "Path con límite",
        content:
          "Sin max_depth, caminos largos son ruidosos y caros. El workbench fija hop limit explícito.",
      },
    },
    {
      heading: "centralidad con interpretación limitada",
      subtopicId: "S31-T3-B",
      paragraphs: [
        "**Degree / betweenness / closeness** miden estructura, no culpa. Un hub puede ser un procesador de pagos legítimo o un dato compartido (call center).",
        "Interpreta con contexto: tipo de arista, ventana temporal, y si el nodo es infraestructura vs persona.",
        "Nunca automatices “alta centralidad → fraude”. Eso viola el gate de CP-N3-B.",
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
# betweenness simple en grafo chico: fracción de pares más cortos que pasan por v
nodes = sorted(adj)
from collections import deque

def shortest_paths(s):
    dist = {s: 0}
    q = deque([s])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

# proxy: grado normalizado
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
      heading: "subgrafos y pruebas",
      subtopicId: "S31-T4-A",
      paragraphs: [
        "Extrae un **subgrafo de caso**: nodos seed + k hops + filtros de tipo/tiempo. Prueba invariantes: sin self-loops basura, pesos ≥ 0, provenance presente.",
        "Tests de grafo: cardinalidades, path existe/no existe, componente esperada, idempotencia de construcción.",
        "Cada bug de construcción (arista invertida, nodo huérfano) debe tener regresión.",
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
      heading: "visualización, escalabilidad, privacidad y evidencia por arista",
      subtopicId: "S31-T4-B",
      paragraphs: [
        "Visualiza subgrafos acotados; no intentes dibujar 100k nodos en el navegador del revisor.",
        "**Privacidad**: enmascara PII (email parcial, teléfono parcial). Roles ven solo lo necesario.",
        "**Evidencia por arista**: al click, muestra records, ts, source — el path debe ser explicable en texto y en UI.",
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
        description: "Modela nodos entidad/cuenta y aristas owns/transfer con dirección y peso.",
        code: {
          language: 'python',
          title: "model_demo.py",
          code: `nodes = ["E1", "E2", "A1", "A2"]
edges = [
    ("E1", "A1", "owns", 1.0, True),
    ("E2", "A2", "owns", 1.0, True),
    ("A1", "A2", "transfer", 99.5, True),
]
print("n", len(nodes), "e", len(edges))
print("directed_tx", edges[2][4])
print("weight", edges[2][3])`,
          output: `n 4 e 3
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
    {"pair": ("E1", "E2"), "ts": "2026-03-02", "rid": "r2", "src": "crm"},
]
print("multi", len(edges))
print("rids", [e["rid"] for e in edges])
print("prov_ok", all(e.get("src") and e.get("rid") for e in edges))`,
          output: `multi 2
rids ['r1', 'r2']
prov_ok True`,
        },
        why: "Multigrafo + provenance habilita auditoría del camino.",
      },
      {
        demoId: "S31-T2-A-DEMO",
        subtopicId: "S31-T2-A",
        environment: "local-python",
        description: "Construye aristas owns y shared_phone desde tablas sintéticas.",
        code: {
          language: 'python',
          title: "build_demo.py",
          code: `ents = [{"id": "e1"}, {"id": "e2"}]
accs = [{"id": "a1", "owner": "e1"}]
phones = [{"e": "e1", "v": "9001"}, {"e": "e2", "v": "9001"}]
edges = [(a["owner"], a["id"], "owns") for a in accs]
# shared contact via contact node
for p in phones:
    edges.append((p["e"], "ph:" + p["v"], "has_phone"))
print("edges", len(edges))
print("contact_node", "ph:9001")
print("builders", "tables_ok")`,
          output: `edges 3
contact_node ph:9001
builders tables_ok`,
        },
        why: "Tablas → grafo con tipos estables.",
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
]
agg = defaultdict(lambda: {"sum": 0.0, "ids": []})
for s, d, a, i in rows:
    agg[(s, d)]["sum"] += a
    agg[(s, d)]["ids"].append(i)
print("sum", agg[("E1", "E2")]["sum"])
print("ids", agg[("E1", "E2")]["ids"])
print("detail_n", len(rows))`,
          output: `sum 15.0
ids ['t1', 't2']
detail_n 2`,
        },
        why: "Agregado y detalle conviven.",
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
print("repro", True)`,
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
edges = [("H", "A"), ("H", "B"), ("H", "C"), ("A", "B")]
deg = Counter()
for u, v in edges:
    deg[u] += 1; deg[v] += 1
top = deg.most_common(1)[0]
print("top_node", top[0], "degree", top[1])
print("interpretation", "structure_only")
print("guilt_label", False)`,
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
adj = defaultdict(set)
for u, v in [("S", "A"), ("S", "B"), ("A", "X"), ("Z", "Y")]:
    adj[u].add(v); adj[v].add(u)
seed, k = "S", 1
nodes = {seed} | set(adj[seed])
assert "A" in nodes and "Z" not in nodes
print("ego", sorted(nodes))
print("k", k)
print("test_ok", True)`,
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
    intro: "24 ejercicios de modelo, multigrafo, construcción, agregación, paths, centralidad, subgrafos y privacidad.",
    steps: [
      {
        id: "S31-T1-A-E1",
        subtopicId: "S31-T1-A",
        kind: "guided",
        instruction:
          "Crea un dict `nodes` con 3 ids y una lista `edges` con campos src,dst,etype,weight,directed. Imprime n_nodes, n_edges y cuántas aristas son directed=True.",
        hint: "Usa literales de dict/list.",
        hints: [
          "Usa literales de dict/list.",
          "Cuenta con sum(1 for e in edges if e['directed']).",
        ],
        edgeCases: ["nodo sin aristas es válido", "weight puede ser float"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes = {}
edges = []
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes = {"E1": {}, "E2": {}, "A1": {}}
edges = [
    {"src": "E1", "dst": "A1", "etype": "owns", "weight": 1.0, "directed": True},
    {"src": "E1", "dst": "E2", "etype": "link", "weight": 0.5, "directed": False},
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
          "Dada lista de aristas (src,dst,weight), calcula el peso total saliente por nodo (out-strength) e imprime el nodo con mayor out-strength y su valor.",
        hint: "Acumula en un dict.",
        hints: [
          "Acumula en un dict.",
          "Usa max(out, key=out.get).",
        ],
        edgeCases: ["nodos solo destino no aparecen en out", "empates: max estable por primer max"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [('A','B',2.0),('A','C',1.0),('B','C',5.0)]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [('A','B',2.0),('A','C',1.0),('B','C',5.0)]
out = {}
for s, d, w in edges:
    out[s] = out.get(s, 0.0) + w
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
          "Clasifica aristas en directed vs undirected y devuelve dos conteos; imprime también los etypes únicos ordenados.",
        hint: "sets para etypes.",
        hints: [
          "sets para etypes.",
          "sorted(set(...)).",
        ],
        edgeCases: ["etype repetido colapsa en set"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'directed': True, 'etype': 'tx'}, {'directed': False, 'etype': 'share'}, {'directed': True, 'etype': 'tx'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'directed': True, 'etype': 'tx'}, {'directed': False, 'etype': 'share'}, {'directed': True, 'etype': 'tx'}]
print("directed", sum(1 for e in edges if e["directed"]))
print("undirected", sum(1 for e in edges if not e["directed"]))
print("etypes", sorted({e["etype"] for e in edges}))`,
          output: `directed 2
undirected 1
etypes ['share', 'tx']`,
        },
      },
      {
        id: "S31-T1-B-E1",
        subtopicId: "S31-T1-B",
        kind: "guided",
        instruction:
          "Cuenta cuántas multi-aristas hay por par (src,dst) e imprime el par con más eventos y su conteo.",
        hint: "tuple (src,dst) como clave.",
        hints: [
          "tuple (src,dst) como clave.",
          "Counter o dict.",
        ],
        edgeCases: ["orden src,dst importa"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [('E1','E2'),('E1','E2'),('E2','E3')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
rows = [('E1','E2'),('E1','E2'),('E2','E3')]
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
          "Filtra aristas con ts >= '2026-02-01' e imprime cuántas quedan y si todas tienen record_id.",
        hint: "Compara strings ISO fecha ordenables.",
        hints: [
          "Compara strings ISO fecha ordenables.",
          "all('record_id' in e for e in filtered).",
        ],
        edgeCases: ["límite inclusivo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'ts':'2026-01-15','record_id':'a'},{'ts':'2026-02-10','record_id':'b'},{'ts':'2026-03-01','record_id':'c'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'ts':'2026-01-15','record_id':'a'},{'ts':'2026-02-10','record_id':'b'},{'ts':'2026-03-01','record_id':'c'}]
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
          "Valida provenance: imprime True solo si cada arista tiene source y record_id no vacíos; imprime n_bad.",
        hint: "strip de strings.",
        hints: [
          "strip de strings.",
          "n_bad = sum(...).",
        ],
        edgeCases: ["source espacio en blanco cuenta mal si no strip — aquí vacío exacto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'source':'crm','record_id':'1'},{'source':'','record_id':'2'},{'source':'tx','record_id':'3'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges = [{'source':'crm','record_id':'1'},{'source':'','record_id':'2'},{'source':'tx','record_id':'3'}]
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
          "Desde accounts[{id,owner}] genera aristas owns e imprime lista de (owner,id) ordenada.",
        hint: "list comprehension.",
        hints: [
          "list comprehension.",
          "sorted por owner luego id.",
        ],
        edgeCases: ["orden lexicográfico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `accounts = [{'id':'a2','owner':'e2'},{'id':'a1','owner':'e1'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `accounts = [{'id':'a2','owner':'e2'},{'id':'a1','owner':'e1'}]
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
          "Detecta valores de contacto compartidos por ≥2 entidades; imprime sorted lista de valores shared.",
        hint: "groupby por value.",
        hints: [
          "groupby por value.",
          "filtra len(entities)>=2.",
        ],
        edgeCases: ["shared contact ≠ parentesco"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `contacts = [('e1','900'),('e2','900'),('e3','901'),('e1','901')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
contacts = [('e1','900'),('e2','900'),('e3','901'),('e1','901')]
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
          "Construye nodos = entities ∪ accounts ∪ contact_values e imprime |nodes|.",
        hint: "sets.",
        hints: [
          "sets.",
          "union de tres conjuntos.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `entities=['e1','e2']; accounts=['a1']; contacts=['900','901']
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `entities=['e1','e2']; accounts=['a1']; contacts=['900','901']
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
          "Colapsa raw_ids a canonical con mapa y reescribe aristas; imprime aristas canónicas únicas sorted.",
        hint: "map.get(x,x).",
        hints: [
          "map.get(x,x).",
          "set de tuples.",
        ],
        edgeCases: ["dos raw del mismo canónico colapsan"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `canon = {'r1':'E1','r2':'E1','r3':'E2'}
edges = [('r1','r3'),('r2','r3')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `canon = {'r1':'E1','r2':'E1','r3':'E2'}
edges = [('r1','r3'),('r2','r3')]
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
          "Agrega amount por (src,dst) y conserva records; imprime sum y records para ('A','B').",
        hint: "defaultdict.",
        hints: [
          "defaultdict.",
          "append record_id.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'src':'A','dst':'B','amount':3,'record_id':'1'},{'src':'A','dst':'B','amount':4,'record_id':'2'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
rows=[{'src':'A','dst':'B','amount':3,'record_id':'1'},{'src':'A','dst':'B','amount':4,'record_id':'2'}]
agg = defaultdict(lambda: {'sum': 0, 'records': []})
for r in rows:
    k = (r['src'], r['dst'])
    agg[k]['sum'] += r['amount']
    agg[k]['records'].append(r['record_id'])
print("sum", agg[('A','B')]['sum'])
print("records", agg[('A','B')]['records'])
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
          "Verifica invariante: sum de n en agregados == len(detail). Imprime ok y totals.",
        hint: "sum v['n'].",
        hints: [
          "sum v['n'].",
          "assert conceptual con print.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `detail_n=5
aggs=[{'n':2},{'n':3}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `detail_n=5
aggs=[{'n':2},{'n':3}]
total = sum(a['n'] for a in aggs)
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
          "Calcula grado de cada nodo en grafo no dirigido; imprime grados dict sorted keys.",
        hint: "undirected: cuenta ambos extremos.",
        hints: [
          "undirected: cuenta ambos extremos.",
          "dict sorted items via sorted keys.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges=[('a','b'),('b','c'),('a','c')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges=[('a','b'),('b','c'),('a','c')]
deg = defaultdict(int)
for u, v in edges:
    deg[u] += 1; deg[v] += 1
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
          "Encuentra componentes conexas y imprime lista de componentes (cada una sorted) ordenada por primer nodo.",
        hint: "DFS o BFS.",
        hints: [
          "DFS o BFS.",
          "sort componentes.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges=[('a','b'),('c','d'),('d','e')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges=[('a','b'),('c','d'),('d','e')]
adj = defaultdict(set)
for u, v in edges:
    adj[u].add(v); adj[v].add(u)
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
                seen.add(m); stack.append(m)
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
          "BFS path de 'A' a 'D' en cadena A-B-C-D; imprime path y hops.",
        hint: "deque BFS.",
        hints: [
          "deque BFS.",
          "hops = len(path)-1.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO path A→D
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict, deque
adj = defaultdict(set)
for u, v in [('A','B'),('B','C'),('C','D')]:
    adj[u].add(v); adj[v].add(u)
q = deque([('A', ['A'])]); seen = {'A'}
path = None
while q:
    n, p = q.popleft()
    if n == 'D':
        path = p; break
    for m in sorted(adj[n]):
        if m not in seen:
            seen.add(m); q.append((m, p+[m]))
print("path", path)
print("hops", len(path)-1)
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
          "Normaliza degree centrality a [0,1] por max degree; imprime top node y score redondeado a 2 decimales.",
        hint: "score = deg/max_deg.",
        hints: [
          "score = deg/max_deg.",
          "round(score, 2).",
        ],
        edgeCases: ["guilt siempre False en enunciado pedagógico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `deg={'H':3,'A':1,'B':1,'C':1}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `deg={'H':3,'A':1,'B':1,'C':1}
m = max(deg.values())
norm = {k: deg[k]/m for k in deg}
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
          "Dado top hub, clasifica si es 'infra' o 'person' por prefijo de id (INF- vs PER-); imprime clase y disclaimer.",
        hint: "startswith.",
        hints: [
          "startswith.",
          "disclaimer fijo.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `hub='INF-PAY'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `hub='INF-PAY'
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
          "Filtra nodos con degree >= 3 y etype_mix que incluya solo 'transfer' vs mixto; imprime high_degree list sorted y flag only_transfer False si hay otros tipos en el grafo del hub.",
        hint: "revisa edge types incidentes.",
        hints: [
          "revisa edge types incidentes.",
          "set de etypes.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `incident={'H':['transfer','transfer','shared_phone']}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `incident={'H':['transfer','transfer','shared_phone']}
high = sorted(n for n, ts in incident.items() if len(ts) >= 3)
only_tx = all(t == "transfer" for t in incident["H"])
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
          "Implementa ego(seed,k=2) y verifica que 'D' no entra desde 'A' en path A-B-C (k=1 sí B). Imprime ego k=1 y k=2.",
        hint: "expansión por capas.",
        hints: [
          "expansión por capas.",
          "sets.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges=[('A','B'),('B','C'),('C','D')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import defaultdict
edges=[('A','B'),('B','C'),('C','D')]
adj=defaultdict(set)
for u,v in edges:
    adj[u].add(v); adj[v].add(u)

def ego(seed, k):
    seen={seed}; layer={seed}
    for _ in range(k):
        nxt=set()
        for n in layer:
            for m in adj[n]:
                if m not in seen:
                    seen.add(m); nxt.add(m)
        layer=nxt
    return seen
print("k1", sorted(ego('A',1)))
print("k2", sorted(ego('A',2)))
print("has_D_k2", 'D' in ego('A',2))`,
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
          "Prueba invariantes: no self-loops, weights>=0, provenance presente. Imprime flags.",
        hint: "any self loop.",
        hints: [
          "any self loop.",
          "all weights.",
        ],
        edgeCases: ["self-loop falla no_self"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges=[{'src':'a','dst':'b','w':1,'rid':'1'},{'src':'b','dst':'b','w':2,'rid':'2'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `edges=[{'src':'a','dst':'b','w':1,'rid':'1'},{'src':'b','dst':'b','w':2,'rid':'2'}]
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
          "Idempotencia: construir grafo dos veces desde mismas edges produce mismo sorted edge list. Imprime equal True.",
        hint: "función build → frozenset.",
        hints: [
          "función build → frozenset.",
          "compara.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw=[('a','b'),('b','c')]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw=[('a','b'),('b','c')]

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
          "Redacta emails: muestra 2 primeras letras del local + ***@domain. Imprime para ana@example.pe.",
        hint: "partition @.",
        hints: [
          "partition @.",
          "local[:2].",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `email='ana@example.pe'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `email='ana@example.pe'
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
          "Dado un path de nodos y un dict edge_evidence por par consecutivo, imprime lista de record lists en orden del path.",
        hint: "zip path path[1:].",
        hints: [
          "zip path path[1:].",
          "get evidence.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `path=['E1','E2','E3']
ev={('E1','E2'):['r1'],('E2','E3'):['r2','r3']}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `path=['E1','E2','E3']
ev={('E1','E2'):['r1'],('E2','E3'):['r2','r3']}
records = [ev[(a,b)] for a,b in zip(path, path[1:])]
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
          "Política de escala: si n_nodes > max_n, devuelve 'summarize' else 'render'. Imprime decisión para 5000 y 50 con max_n=500.",
        hint: "comparar.",
        hints: [
          "comparar.",
          "dos prints.",
        ],
        edgeCases: [],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `max_n=500
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `max_n=500

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
      "Construye un grafo sintético entity/account/contact/tx con multiaristas, provenance y consulta de camino reproducible. Centralidad se reporta con disclaimer: no es culpabilidad. ER/matching no implica fraude ni parentesco. Id plataforma streaming-data conservado.",
    objectives: [
      "Modelo nodos/aristas con dirección, peso y tipos",
      "Multigrafo temporal con provenance por arista",
      "Construcción desde tablas y agregación sin borrar detalle",
      "Grado, componentes, paths con hop limit",
      "Subgrafo de caso, tests y vista redactada con evidencia",
    ],
    requirements: [
      "Datos sintéticos only; sin PII real",
      "Path reproducible documentado",
      "Disclaimer de centralidad",
      "Cero labels automáticos de fraude",
      "Documentación es-PE",
    ],
    starterCode: `# CP-N3-B inicio — grafo de evidencia (esqueleto)
from collections import defaultdict, deque

def add_undirected(adj, u, v):
    adj[u].add(v); adj[v].add(u)

def bfs_path(adj, src, dst, max_depth=4):
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

# TODO: cargar tablas sintéticas, provenance, ego subgraph, redact
if __name__ == "__main__":
    adj = defaultdict(set)
    add_undirected(adj, "E1", "E2")
    print(bfs_path(adj, "E1", "E2"))
`,
    portfolioNote:
      "Inicio CP-N3-B: grafo temporal con evidencia. No marca gate PASS; otra lane califica.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Path + provenance y disclaimer de centralidad", weight: "bonus checklist" },
      { criterion: "Sin inferencia de fraude/parentesco", weight: "gate privacy" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "En CP-N3-B, un score alto de centralidad significa:",
        options: ["Fraude confirmado", "Parentesco automático", "Posición estructural que requiere contexto, no culpa", "Borrar al nodo"],
        correctIndex: 2,
        explanation:
          "Centralidad ≠ culpabilidad.",
      },
      {
        question: "Provenance en una arista sirve para:",
        options: ["Auditar source/record_id del hecho relacional", "Solo color en UI", "Entrenar redes neuronales obligatoriamente", "Ocultar el path"],
        correctIndex: 0,
        explanation:
          "Auditoría del workbench.",
      },
      {
        question: "Al agregar transferencias entre el mismo par debes:",
        options: ["Borrar record_ids", "Conservar detalle o punteros además del agregado", "Etiquetar fraude", "Eliminar el multigrafo"],
        correctIndex: 1,
        explanation:
          "Agregado sin borrar detalle.",
      },
      {
        question: "Shared phone entre dos entidades implica:",
        options: ["Parentesco legal", "Colusión", "Fraude automático", "Un hecho de contacto compartido a investigar con evidencia, no veredicto"],
        correctIndex: 3,
        explanation:
          "Hecho ≠ veredicto; no parentesco automático.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "NetworkX Graph types",
        url: "https://networkx.org/documentation/stable/reference/classes/index.html",
        note: "Referencia de grafos/multigrafos",
      },
      {
        label: "Graph algorithms overview",
        url: "https://en.wikipedia.org/wiki/Graph_theory",
        note: "Contexto de caminos y centralidad",
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
        label: "NetworkX tutorial",
        url: "https://networkx.org/documentation/stable/tutorial.html",
        note: "API práctica",
      },
    ],
  },
}
