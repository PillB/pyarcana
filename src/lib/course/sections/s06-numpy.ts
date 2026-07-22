import type { CourseSection } from '../../types'

export const section06: CourseSection = {
  id: "numpy",
  index: 6,
  title: "Colecciones y estructuras de datos",
  shortTitle: "Colecciones",
  tagline: "listas, dicts, sets y estructuras anidadas para modelo en memoria",
  estimatedHours: 18,
  level: "Intermedio",
  phase: 0,
  icon: "Layers",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**. Esta sección (id de plataforma `numpy` conservado) retematiza a colecciones V3 e inicia el bloque **CP-N1-B** sin NumPy/pandas.",
  learningOutcomes: [
    { text: "Usar list/tuple y slicing para ventanas de registros sin copiar de más" },
    { text: "Desempaquetar secuencias y distinguir alias vs copia superficial/profunda" },
    { text: "Modelar registros con dict, get e índices id→fila" },
    { text: "Deduplicar con set y reportar conflictos sin borrarlos" },
    { text: "Navegar list[dict] anidados cliente→contactos→txs" },
    { text: "Acceder campos opcionales sin KeyError; missing vs vacío" },
    { text: "Ordenar con sorted(..., key=) de forma estable" },
    { text: "Elegir list/dict/set y producir JSON determinista" },
  ],
  theory: [
    {
      heading: "De “NumPy vectorizado” a colecciones en memoria (mapa de la sección)",
      paragraphs: [
        "En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**. Ese material se reubica conceptualmente hacia el bloque numérico/DS (p. ej. S14+). Aquí construyes el **modelo tabular en memoria** que CP-N1-B necesita: listas, tuplas, dicts, sets y estructuras anidadas **cliente → contactos → transacciones** con salidas **deterministas**.",
        "El hilo conductor es un **mini almacén en RAM** con datos sintéticos latam (`example.com`, ids `C00x`). Sin pandas ni NumPy en este incremento. En S08 ese modelo se conecta a CSV/JSON y cuarentena.",
        "Orden: **T1 Secuencias** → **T2 Dicts/sets** → **T3 Anidado y missing** → **T4 Orden y elección de estructura**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado NumPy de este archivo **no es el camino V3 del estudiante en S06**. El target es el **modelo tabular en memoria** (inicio CP-N1-B). NumPy/vectorización se retoma en el tramo DS. Conserva datos sintéticos; nunca PII real.",
      },
    },
    {
      heading: "Listas, tuplas y slicing",
      subtopicId: "S06-T1-A",
      paragraphs: [
        "Una **list** es mutable y ordenada: ideal para filas que crecen (`append`, `extend`). Una **tuple** es inmutable: ideal para **claves estables**, headers fijos o “contratos” de columnas que no deben mutarse por accidente.",
        "El **slicing** `seq[i:j:k]` produce una **ventana** sin mutar el original (en listas/tuplas crea una nueva secuencia). `txs[-3:]` son las últimas tres transacciones. El stop es exclusivo, igual que en `range`.",
        "Membership `x in seq` es O(n) en listas: útil para lotes pequeños de demo; para lookups masivos preferirás **set/dict** en T2.",
      ],
      code: {
        language: 'python',
        title: "slicing_txs.py",
        code: `txs = [
    {"id": "T1", "monto": 10},
    {"id": "T2", "monto": 25},
    {"id": "T3", "monto": 7},
    {"id": "T4", "monto": 40},
]
ventana = txs[-3:]
keys = ("id", "monto")  # contrato estable
print("ventana ids:", [r["id"] for r in ventana])
print("keys:", keys)
print("T2 in slice?", any(r["id"] == "T2" for r in ventana))`,
        output: `ventana ids: ['T2', 'T3', 'T4']
keys: ('id', 'monto')
T2 in slice? True`,
      },
      callout: {
        type: "tip",
        title: "Regla de ventana",
        content:
          "Para reportes “últimos N” usa slicing negativo. No copies a mano con bucles salvo que necesites filtrar.",
      },
    },
    {
      heading: "Unpacking, aliasing y copia",
      subtopicId: "S06-T1-B",
      paragraphs: [
        "**Unpacking** `a, b = fila` o `head, *rest = fila` desempaqueta sin índices ruidosos. Falla si el largo no calza: eso es bueno (detecta shape roto).",
        "**Aliasing**: `b = a` no copia; ambas variables apuntan al **mismo** objeto. Si `a` es una lista de dicts y mutas `b[0]['x']`, también cambia `a[0]`. Ese bug aparece al “clonar” clientes en memoria.",
        "`list.copy()` / `seq[:]` hacen **copia superficial**. Para dicts anidados necesitas `copy.deepcopy` o reconstruir. En intake, shallow basta si solo reordenas filas sin mutar campos compartidos.",
      ],
      code: {
        language: 'python',
        title: "alias_vs_copy.py",
        code: `import copy
clientes = [{"id": "C001", "tags": ["vip"]}]
alias = clientes
shallow = clientes.copy()
deep = copy.deepcopy(clientes)
alias[0]["tags"].append("alias")
print("original tras alias:", clientes)
shallow[0]["tags"].append("shallow")
print("original tras shallow mut de tags:", clientes)
deep[0]["tags"].append("solo-deep")
print("deep aislado:", deep)
print("original final:", clientes)`,
        output: `original tras alias: [{'id': 'C001', 'tags': ['vip', 'alias']}]
original tras shallow mut de tags: [{'id': 'C001', 'tags': ['vip', 'alias', 'shallow']}]
deep aislado: [{'id': 'C001', 'tags': ['vip', 'solo-deep']}]
original final: [{'id': 'C001', 'tags': ['vip', 'alias', 'shallow']}]`,
      },
      callout: {
        type: "warning",
        title: "Bug clásico de intake",
        content:
          "Lista de dicts + copy superficial: los dicts internos siguen compartidos. Si vas a mutar campos anidados, usa deepcopy o dict(...) nuevo por fila.",
      },
    },
    {
      heading: "Diccionarios y pertenencia",
      subtopicId: "S06-T2-A",
      paragraphs: [
        "Un **dict** modela registros y **índices** `id → cliente`. Lookup promedio O(1). Construye índices con `{c['id']: c for c in filas}` cuando harás muchos accesos por clave.",
        "`d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor.",
        "`update` fusiona configs: el segundo dict **pisa** claves del primero. Documenta la precedencia (env > defaults) para no “pisar sin querer” políticas de normalización.",
      ],
      code: {
        language: 'python',
        title: "dict_index.py",
        code: `filas = [
    {"id": "C001", "region": "Lima"},
    {"id": "C002", "region": "Cusco"},
]
idx = {c["id"]: c for c in filas}
print("lookup C002:", idx["C002"]["region"])
print("get missing:", idx.get("C999", {}).get("region", "N/A"))
base = {"timeout": 30, "retry": 1}
override = {"retry": 3}
merged = {**base, **override}
print("merged:", merged)`,
        output: `lookup C002: Cusco
get missing: N/A
merged: {'timeout': 30, 'retry': 3}`,
      },
      callout: {
        type: "tip",
        title: "Índice vs lista",
        content:
          "Lista para orden de llegada; dict índice para lookup. Ambos conviven en el modelo CP-N1-B.",
      },
    },
    {
      heading: "Deduplicación y operaciones de set",
      subtopicId: "S06-T2-B",
      paragraphs: [
        "Un **set** guarda elementos únicos (hashables). Ideal para **ids/emails** deduplicados y para **unión/intersección/diferencia** de cohortes de dos lotes.",
        "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero montos distintos deben **reportarse**, no silenciarse. El patrón es `unique` + `conflicts`.",
        "Sets no conservan orden de inserción de forma que debas depender para exports estables en todos los contextos pedagógicos: ordena con `sorted(...)` al exportar.",
      ],
      code: {
        language: 'python',
        title: "sets_cohortes.py",
        code: `lote_a = {"C001", "C002", "C003"}
lote_b = {"C002", "C003", "C004"}
print("intersección:", sorted(lote_a & lote_b))
print("solo A:", sorted(lote_a - lote_b))
emails = ["a@ex.com", "b@ex.com", "a@ex.com"]
print("únicos:", sorted(set(emails)))`,
        output: `intersección: ['C002', 'C003']
solo A: ['C001']
únicos: ['a@ex.com', 'b@ex.com']`,
      },
      callout: {
        type: "warning",
        title: "Conflicto ≠ duplicado inocente",
        content:
          "Mismo id + payload distinto → conflicto de calidad. Reporta; no elijas “el último gana” sin dejar traza.",
      },
    },
    {
      heading: "Estructuras anidadas y recorridos",
      subtopicId: "S06-T3-A",
      paragraphs: [
        "El modelo CP-N1-B anida: `cliente = {id, nombre, contacts: [...], txs: [...]}`. Recorres con `for c in clients: for t in c['txs']:`.",
        "**Aplanar** transacciones a filas densas (con `client_id` denormalizado) prepara el shape de export CSV en S08. **Contar** contactos por cliente valida integridad del grafo en memoria.",
        "Shape inconsistente (falta clave `txs`, o no es lista) se detecta con `isinstance` y se manda a review — no asumas que todo dict llegó bien formado.",
      ],
      code: {
        language: 'python',
        title: "nested_clients.py",
        code: `clients = [
    {
        "id": "C001",
        "contacts": [{"tipo": "email", "valor": "a@ex.com"}],
        "txs": [{"id": "T1", "monto": 10}, {"id": "T2", "monto": 5}],
    },
    {
        "id": "C002",
        "contacts": [],
        "txs": [{"id": "T3", "monto": 20}],
    },
]
for c in clients:
    print(c["id"], "n_contacts=", len(c["contacts"]), "n_txs=", len(c["txs"]))
flat = [
    {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
    for c in clients
    for t in c["txs"]
]
print("flat rows:", flat)`,
        output: `C001 n_contacts= 1 n_txs= 2
C002 n_contacts= 0 n_txs= 1
flat rows: [{'client_id': 'C001', 'tx_id': 'T1', 'monto': 10}, {'client_id': 'C001', 'tx_id': 'T2', 'monto': 5}, {'client_id': 'C002', 'tx_id': 'T3', 'monto': 20}]`,
      },
      callout: {
        type: "tip",
        title: "Shape listo para S08",
        content:
          "list[dict] plano es el puente natural a CSV. Mantén ids de cliente en cada fila aplanada.",
      },
    },
    {
      heading: "Acceso seguro y valores faltantes",
      subtopicId: "S06-T3-B",
      paragraphs: [
        "Campos opcionales: `contact.get('telefono')` puede devolver `None`. Encadenar `.get` en anidados evita KeyError: `(c.get('profile') or {}).get('phone')`.",
        "Distingue **missing** (`None` / clave ausente) de **vacío falsy** (`''`, `0`, `[]`). Un teléfono `''` no es lo mismo que “no vino el campo”: el reporte de calidad debe etiquetar distinto si la política lo exige.",
        "Helpers `dig(obj, *path)` o `get_nested` centralizan la política y se testean una vez.",
      ],
      code: {
        language: 'python',
        title: "safe_access.py",
        code: `def get_nested(d, *keys, default=None):
    cur = d
    for k in keys:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur

c = {"id": "C001", "profile": {"phone": None}, "email": ""}
print("phone:", get_nested(c, "profile", "phone", default="MISSING"))
print("email empty:", repr(c.get("email")))
print("no address:", get_nested(c, "profile", "address", default="MISSING"))`,
        output: `phone: None
email empty: ''
no address: MISSING`,
      },
      callout: {
        type: "warning",
        title: "Falsy ≠ missing",
        content:
          "No uses `if not value` para decidir missing si 0 o '' son valores válidos de negocio.",
      },
    },
    {
      heading: "Ordenamiento y key",
      subtopicId: "S06-T4-A",
      paragraphs: [
        "`sorted(seq, key=fn)` devuelve **nueva** lista. `list.sort(key=fn)` **muta in-place** y retorna `None` — un bug clásico si haces `x = rows.sort(...)`.",
        "`key` multi-campo: `key=lambda r: (r['region'], r['nombre'])` ordena estable por región y luego nombre. La estabilidad de Timsort preserva el orden relativo de empates.",
        "Para montos, asegúrate de que el tipo sea numérico antes de ordenar; strings `'100' < '20'` rompen el ranking.",
      ],
      code: {
        language: 'python',
        title: "sorted_key.py",
        code: `clients = [
    {"nombre": "Zara", "region": "Lima", "monto": 30},
    {"nombre": "Ana", "region": "Lima", "monto": 50},
    {"nombre": "Luis", "region": "Cusco", "monto": 20},
]
by_region_name = sorted(clients, key=lambda r: (r["region"], r["nombre"]))
print([(r["region"], r["nombre"]) for r in by_region_name])
by_monto = sorted(clients, key=lambda r: r["monto"], reverse=True)
print("top monto:", by_monto[0]["nombre"], by_monto[0]["monto"])`,
        output: `[('Cusco', 'Luis'), ('Lima', 'Ana'), ('Lima', 'Zara')]
top monto: Ana 50`,
      },
      callout: {
        type: "tip",
        title: "Export determinista",
        content:
          "Ordena siempre antes de JSON/CSV de demos para que el diff del README sea estable.",
      },
    },
    {
      heading: "Estructura adecuada, complejidad y determinismo",
      subtopicId: "S06-T4-B",
      paragraphs: [
        "Elige estructura por **operación dominante**: muchos appends → list; muchos lookups por id → dict; membership de cohortes → set; contrato fijo inmutable → tuple.",
        "Complejidad: membership en list O(n); en set/dict O(1) promedio. No hagas `if x in big_list` dentro de un loop de n si puedes preindexar.",
        "**Determinismo**: `json.dumps(obj, sort_keys=True, ensure_ascii=False)` + `sorted` de ids produce el mismo string en cada corrida. Reproducibilidad es parte del gate de calidad.",
      ],
      code: {
        language: 'python',
        title: "determinism.py",
        code: `import json
payload = {"b": 2, "a": 1, "ids": ["C002", "C001"]}
payload["ids"] = sorted(payload["ids"])
print(json.dumps(payload, sort_keys=True, ensure_ascii=False))
print(json.dumps(payload, sort_keys=True, ensure_ascii=False))`,
        output: `{"a": 1, "b": 2, "ids": ["C001", "C002"]}
{"a": 1, "b": 2, "ids": ["C001", "C002"]}`,
      },
      callout: {
        type: "info",
        title: "Sin NumPy aquí",
        content:
          "Si tu solución de S06 importa numpy/pandas, está fuera del incremento V3. Vuelve a stdlib.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema). Orden T1→T4. Modelo en memoria del inicio CP-N1-B. Datos sintéticos; browser-pyodide (stdlib).",
    steps: [
      {
        demoId: "S06-T1-A-DEMO",
        subtopicId: "S06-T1-A",
        environment: "browser-pyodide",
        description: "Ventana de transacciones con slicing y tupla de keys estables",
        code: {
          language: 'python',
          title: "S06-T1-A-DEMO — ventana",
          code: `txs = [
    {"id": "T01", "monto": 12.5, "canal": "app"},
    {"id": "T02", "monto": 40.0, "canal": "web"},
    {"id": "T03", "monto": 8.0, "canal": "app"},
    {"id": "T04", "monto": 15.0, "canal": "tienda"},
    {"id": "T05", "monto": 22.0, "canal": "app"},
]
KEYS = ("id", "monto", "canal")
ultimas = txs[-3:]
print("keys contrato:", KEYS)
for row in ultimas:
    print(tuple(row[k] for k in KEYS))
print("len ventana:", len(ultimas))`,
          output: `keys contrato: ('id', 'monto', 'canal')
('T03', 8.0, 'app')
('T04', 15.0, 'tienda')
('T05', 22.0, 'app')
len ventana: 3`,
        },
        why: "Slicing da la ventana; la tupla de keys fija el contrato de columnas sin mutación accidental.",
      },
      {
        demoId: "S06-T1-B-DEMO",
        subtopicId: "S06-T1-B",
        environment: "browser-pyodide",
        description: "Bug de alias al 'copiar' lista de dicts de clientes",
        code: {
          language: 'python',
          title: "S06-T1-B-DEMO — alias",
          code: `import copy
clientes = [
    {"id": "C001", "score": 10},
    {"id": "C002", "score": 20},
]
mal = clientes  # alias, no copia
mal[0]["score"] = 99
print("tras alias mut:", clientes[0]["score"])

bien_shallow = [dict(c) for c in clientes]
bien_shallow[0]["score"] = 1
print("original tras shallow dict():", clientes[0]["score"])

deep = copy.deepcopy(clientes)
deep[1]["score"] = 0
print("C002 original:", clientes[1]["score"], "deep:", deep[1]["score"])`,
          output: `tras alias mut: 99
original tras shallow dict(): 99
C002 original: 20 deep: 0`,
        },
        why: "Alias muta el original; dict(c) por fila basta si el nivel 1 es plano; deepcopy para anidados.",
      },
      {
        demoId: "S06-T2-A-DEMO",
        subtopicId: "S06-T2-A",
        environment: "browser-pyodide",
        description: "Índice id→cliente y lookup seguro",
        code: {
          language: 'python',
          title: "S06-T2-A-DEMO — index",
          code: `filas = [
    {"id": "C001", "nombre": "Ana Quispe", "region": "Lima"},
    {"id": "C002", "nombre": "Luis Huamán", "region": "Arequipa"},
]
idx = {c["id"]: c for c in filas}
cid = "C002"
print("encontrado:", idx.get(cid, {}).get("nombre", "N/A"))
print("missing:", idx.get("C999", {}).get("nombre", "N/A"))
print("keys ordenadas:", sorted(idx))`,
          output: `encontrado: Luis Huamán
missing: N/A
keys ordenadas: ['C001', 'C002']`,
        },
        why: "El índice dict hace lookup O(1); get encadenado evita KeyError en demos de intake.",
      },
      {
        demoId: "S06-T2-B-DEMO",
        subtopicId: "S06-T2-B",
        environment: "browser-pyodide",
        description: "ids únicos; intersección de lotes; conflictos = mismo id datos distintos",
        code: {
          language: 'python',
          title: "S06-T2-B-DEMO — dedup",
          code: `rows = [
    {"id": "C001", "email": "a@ex.com"},
    {"id": "C002", "email": "b@ex.com"},
    {"id": "C001", "email": "a@ex.com"},
    {"id": "C001", "email": "otro@ex.com"},
]
seen = {}
unique = []
conflicts = []
for r in rows:
    rid = r["id"]
    if rid not in seen:
        seen[rid] = r
        unique.append(r)
    elif seen[rid] != r:
        conflicts.append({"id": rid, "a": seen[rid], "b": r})
print("unique ids:", sorted(seen))
print("n_conflicts:", len(conflicts))
print("conflict email pair:", conflicts[0]["a"]["email"], "vs", conflicts[0]["b"]["email"])
lote1, lote2 = {"C001", "C002"}, {"C002", "C003"}
print("intersección lotes:", sorted(lote1 & lote2))`,
          output: `unique ids: ['C001', 'C002']
n_conflicts: 1
conflict email pair: a@ex.com vs otro@ex.com
intersección lotes: ['C002']`,
        },
        why: "Dedup preserva primera vista; conflictos se listan sin borrar filas del reporte.",
      },
      {
        demoId: "S06-T3-A-DEMO",
        subtopicId: "S06-T3-A",
        environment: "browser-pyodide",
        description: "Modelo en memoria Client con contacts[] y txs[]",
        code: {
          language: 'python',
          title: "S06-T3-A-DEMO — modelo",
          code: `store = [
    {
        "id": "C001",
        "nombre": "María Quispe",
        "contacts": [
            {"tipo": "email", "valor": "maria@ex.com"},
            {"tipo": "tel", "valor": "999000111"},
        ],
        "txs": [
            {"id": "T1", "monto": 50},
            {"id": "T2", "monto": 12},
        ],
    }
]
c = store[0]
print("cliente", c["id"], c["nombre"])
print("contactos:", len(c["contacts"]))
total = sum(t["monto"] for t in c["txs"])
print("total txs:", total)
flat = [
    {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
    for c in store
    for t in c["txs"]
]
print("flat:", flat)`,
          output: `cliente C001 María Quispe
contactos: 2
total txs: 62
flat: [{'client_id': 'C001', 'tx_id': 'T1', 'monto': 50}, {'client_id': 'C001', 'tx_id': 'T2', 'monto': 12}]`,
        },
        why: "El grafo cliente→contactos/txs es el núcleo del modelo tabular CP-N1-B en RAM.",
      },
      {
        demoId: "S06-T3-B-DEMO",
        subtopicId: "S06-T3-B",
        environment: "browser-pyodide",
        description: "Extraer teléfono opcional de contacto anidado",
        code: {
          language: 'python',
          title: "S06-T3-B-DEMO — dig",
          code: `def dig(d, *path, default=None):
    cur = d
    for k in path:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur

c1 = {"id": "C001", "profile": {"phone": "999111222"}}
c2 = {"id": "C002", "profile": {}}
c3 = {"id": "C003"}
for c in (c1, c2, c3):
    phone = dig(c, "profile", "phone", default="MISSING")
    flag = "ok" if phone != "MISSING" and phone else ("empty" if phone == "" else "missing")
    if phone == "MISSING":
        flag = "missing"
    print(c["id"], phone, flag)`,
          output: `C001 999111222 ok
C002 MISSING missing
C003 MISSING missing`,
        },
        why: "dig() centraliza acceso seguro; etiquetas missing vs empty alimentan el reporte de calidad.",
      },
      {
        demoId: "S06-T4-A-DEMO",
        subtopicId: "S06-T4-A",
        environment: "browser-pyodide",
        description: "Ordenar clientes por región luego nombre",
        code: {
          language: 'python',
          title: "S06-T4-A-DEMO — sort",
          code: `clients = [
    {"id": "C003", "nombre": "Zara", "region": "Lima"},
    {"id": "C001", "nombre": "Ana", "region": "Lima"},
    {"id": "C002", "nombre": "Bruno", "region": "Cusco"},
]
ordered = sorted(clients, key=lambda r: (r["region"], r["nombre"]))
for r in ordered:
    print(r["region"], r["nombre"], r["id"])
mutated = clients[:]
mutated.sort(key=lambda r: r["id"])
print("sort in-place retorna:", clients[:0].sort(key=lambda r: r["id"]))
print("ids mutados:", [r["id"] for r in mutated])`,
          output: `Cusco Bruno C002
Lima Ana C001
Lima Zara C003
sort in-place retorna: None
ids mutados: ['C001', 'C002', 'C003']`,
        },
        why: "sorted no muta; key multi-campo da orden estable región→nombre para exports.",
      },
      {
        demoId: "S06-T4-B-DEMO",
        subtopicId: "S06-T4-B",
        environment: "browser-pyodide",
        description: "Mismo input → mismo JSON dump con sort_keys",
        code: {
          language: 'python',
          title: "S06-T4-B-DEMO — json",
          code: `import json
data = {
    "clients": [
        {"id": "C002", "region": "Cusco"},
        {"id": "C001", "region": "Lima"},
    ],
    "generated_by": "s06-demo",
}
data["clients"] = sorted(data["clients"], key=lambda c: c["id"])
a = json.dumps(data, sort_keys=True, ensure_ascii=False)
b = json.dumps(data, sort_keys=True, ensure_ascii=False)
print(a)
print("determinista:", a == b)`,
          output: `{"clients": [{"id": "C001", "region": "Lima"}, {"id": "C002", "region": "Cusco"}], "generated_by": "s06-demo"}
determinista: True`,
        },
        why: "sort de filas + sort_keys hace reproducible el artefacto de demo del modelo en memoria.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara. Sin NumPy/pandas. Datos sintéticos.",
    steps: [
      {
        id: "S06-T1-A-E1",
        subtopicId: "S06-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Dada `txs` de 5 montos, imprime los **últimos 2** con slicing y la longitud de la ventana. Caso vacío: si `txs=[]`, imprime `ventana=[]` y `len=0`.",
        hint: "Usa txs[-2:] (funciona también si hay menos de 2).",
        hints: [
          "Usa txs[-2:] (funciona también si hay menos de 2).",
          "print la lista y luego len(ventana).",
        ],
        edgeCases: ["caso vacío"],
        tests: "[40, 50] y []",
        feedback: "Slicing negativo no lanza error en lista vacía.",
        starterCode: {
          language: 'python',
          title: "slice_n.py",
          code: `txs = [10, 20, 30, 40, 50]
# TODO
empty = []
# TODO empty`,
        },
        solutionCode: {
          language: 'python',
          title: "slice_n.py",
          code: `txs = [10, 20, 30, 40, 50]
ventana = txs[-2:]
print(ventana)
print(len(ventana))
empty = []
v0 = empty[-2:]
print(v0)
print(len(v0))`,
          output: `[40, 50]
2
[]
0`,
        },
      },
      {
        id: "S06-T1-A-E2",
        subtopicId: "S06-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Convierte la lista de headers `['id','monto']` a **tuple** `KEYS` (motivo: inmutable). Imprime `KEYS` y demuestra que `KEYS + ('canal',)` crea otra tupla sin mutar `KEYS`.",
        hint: "tuple(lista) o keys = ('id','monto')",
        hints: [
          "tuple(lista) o keys = ('id','monto')",
          "KEYS no tiene append; usa + para nueva tupla.",
        ],
        edgeCases: ["inmutabilidad"],
        tests: "KEYS estable + more",
        feedback: "Tuple = contrato de columnas que no se muta por accidente.",
        starterCode: {
          language: 'python',
          title: "list_tuple.py",
          code: `headers = ['id', 'monto']
# TODO
print('KEYS', KEYS)
# TODO extend conceptual
print('KEYS sigue', KEYS)`,
        },
        solutionCode: {
          language: 'python',
          title: "list_tuple.py",
          code: `headers = ['id', 'monto']
KEYS = tuple(headers)
print('KEYS', KEYS)
more = KEYS + ('canal',)
print('more', more)
print('KEYS sigue', KEYS)`,
          output: `KEYS ('id', 'monto')
more ('id', 'monto', 'canal')
KEYS sigue ('id', 'monto')`,
        },
      },
      {
        id: "S06-T1-A-E3",
        subtopicId: "S06-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Hay un bug: se trata una tupla de ids como lista y se intenta `.append`. Captura el AttributeError, convierte a list, append 'C003', e imprime el resultado y un mensaje de diagnóstico.",
        hint: "tuple no tiene append → AttributeError",
        hints: [
          "tuple no tiene append → AttributeError",
          "list(ids) para mutar una copia.",
        ],
        edgeCases: ["diagnóstico AttributeError"],
        tests: "AttributeError + lista mutada",
        feedback: "Si necesitas mutar, trabaja con list; guarda tuple solo como snapshot/contrato.",
        starterCode: {
          language: 'python',
          title: "fix_tuple_mut.py",
          code: `ids = ('C001', 'C002')
try:
    ids.append('C003')  # bug intencional si se ejecuta sobre tuple
except Exception as e:
    # TODO
    ...`,
        },
        solutionCode: {
          language: 'python',
          title: "fix_tuple_mut.py",
          code: `ids = ('C001', 'C002')
try:
    ids.append('C003')
except AttributeError as e:
    print('diagnóstico:', type(e).__name__, '-', e)
    mut = list(ids)
    mut.append('C003')
    print(mut)`,
          output: `diagnóstico: AttributeError - 'tuple' object has no attribute 'append'
['C001', 'C002', 'C003']`,
        },
      },
      {
        id: "S06-T1-B-E1",
        subtopicId: "S06-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Unpacking de fila `('C001', 'Lima', 10)` en `cid, region, monto`. Imprime los tres. Si la fila tuviera 2 valores, el unpack fallaría (no lo fuerces aquí).",
        hint: "a, b, c = fila",
        hints: [
          "a, b, c = fila",
          "Orden posicional importa.",
        ],
        edgeCases: ["largo exacto"],
        tests: "C001 Lima 10",
        feedback: "Unpack documenta el shape esperado de la fila.",
        starterCode: {
          language: 'python',
          title: "unpack_row.py",
          code: `fila = ('C001', 'Lima', 10)
# TODO unpack
print(cid, region, monto)`,
        },
        solutionCode: {
          language: 'python',
          title: "unpack_row.py",
          code: `fila = ('C001', 'Lima', 10)
cid, region, monto = fila
print(cid, region, monto)`,
          output: `C001 Lima 10`,
        },
      },
      {
        id: "S06-T1-B-E2",
        subtopicId: "S06-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Demuestra alias vs copy: lista `[1,2]`, `alias = xs`, `copia = xs.copy()`. Mutar alias con append 3; imprimir xs y copia. Luego append 4 a copia e imprimir de nuevo xs.",
        hint: "alias comparte objeto; copy es superficial de la lista de ints.",
        hints: [
          "alias comparte objeto; copy es superficial de la lista de ints.",
          "ints inmutables: shallow basta.",
        ],
        edgeCases: ["alias vs copy"],
        tests: "xs crece con alias; no con copia tras divergencia",
        feedback: "copy() corta el alias de la lista contenedora.",
        starterCode: {
          language: 'python',
          title: "alias_copy.py",
          code: `xs = [1, 2]
# TODO
print('xs', xs, 'copia', copia)`,
        },
        solutionCode: {
          language: 'python',
          title: "alias_copy.py",
          code: `xs = [1, 2]
alias = xs
copia = xs.copy()
alias.append(3)
print('tras alias', xs, copia)
copia.append(4)
print('tras copia', xs, copia)`,
          output: `tras alias [1, 2, 3] [1, 2]
tras copia [1, 2, 3] [1, 2, 4]`,
        },
      },
      {
        id: "S06-T1-B-E3",
        subtopicId: "S06-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Lista de dicts anidados `[{'id':'C1','tags':['a']}]`. Muestra que `copy()` de la lista **no** aísla `tags`. Usa `copy.deepcopy`, muta tags del deep, e imprime original vs deep.",
        hint: "import copy; deepcopy",
        hints: [
          "import copy; deepcopy",
          "shallow[0] is original[0] → True",
        ],
        edgeCases: ["shallow vs deep anidado"],
        tests: "deep no contamina original en el append 'd'",
        feedback: "En modelo cliente con listas internas, deepcopy (o reconstrucción) evita fugas.",
        starterCode: {
          language: 'python',
          title: "shallow_deep.py",
          code: `import copy
rows = [{'id': 'C1', 'tags': ['a']}]
shallow = rows.copy()
# TODO deep + mutaciones
print('orig', rows)
print('deep', deep)`,
        },
        solutionCode: {
          language: 'python',
          title: "shallow_deep.py",
          code: `import copy
rows = [{'id': 'C1', 'tags': ['a']}]
shallow = rows.copy()
shallow[0]['tags'].append('s')
print('orig tras shallow tags', rows)
deep = copy.deepcopy(rows)
deep[0]['tags'].append('d')
print('orig', rows)
print('deep', deep)`,
          output: `orig tras shallow tags [{'id': 'C1', 'tags': ['a', 's']}]
orig [{'id': 'C1', 'tags': ['a', 's']}]
deep [{'id': 'C1', 'tags': ['a', 's', 'd']}]`,
        },
      },
      {
        id: "S06-T2-A-E1",
        subtopicId: "S06-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Construye un dict desde pares `[('C001','Lima'),('C002','Cusco')]` e imprime el dict y `d['C002']`.",
        hint: "dict(pares) o comprensión",
        hints: [
          "dict(pares) o comprensión",
          "Claves deben ser hashables (str ok).",
        ],
        edgeCases: ["pares→dict"],
        tests: "Cusco",
        feedback: "dict(pares) es el constructor idiomático desde filas clave-valor.",
        starterCode: {
          language: 'python',
          title: "dict_from_pairs.py",
          code: `pares = [('C001', 'Lima'), ('C002', 'Cusco')]
# TODO
print(d)
print(d['C002'])`,
        },
        solutionCode: {
          language: 'python',
          title: "dict_from_pairs.py",
          code: `pares = [('C001', 'Lima'), ('C002', 'Cusco')]
d = dict(pares)
print(d)
print(d['C002'])`,
          output: `{'C001': 'Lima', 'C002': 'Cusco'}
Cusco`,
        },
      },
      {
        id: "S06-T2-A-E2",
        subtopicId: "S06-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Dado `idx` con C001, usa `get` para C001 y C999 (default 'N/A'). Luego muestra un `try/except KeyError` al acceder `idx['C999']` directo.",
        hint: "idx.get('C999','N/A')",
        hints: [
          "idx.get('C999','N/A')",
          "KeyError solo en acceso duro.",
        ],
        edgeCases: ["get vs KeyError"],
        tests: "Ana / N/A / KeyError",
        feedback: "get para opcionales; KeyError cuando la ausencia es bug de programación.",
        starterCode: {
          language: 'python',
          title: "get_vs_keyerror.py",
          code: `idx = {'C001': 'Ana'}
# TODO get
# TODO KeyError`,
        },
        solutionCode: {
          language: 'python',
          title: "get_vs_keyerror.py",
          code: `idx = {'C001': 'Ana'}
print(idx.get('C001', 'N/A'))
print(idx.get('C999', 'N/A'))
try:
    print(idx['C999'])
except KeyError as e:
    print('KeyError', e)`,
          output: `Ana
N/A
KeyError 'C999'`,
        },
      },
      {
        id: "S06-T2-A-E3",
        subtopicId: "S06-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Fusiona `defaults={'retry':1,'timeout':30}` con `override={'retry':5}` **sin** perder timeout. Imprime merged. Luego muestra el peligro de `defaults.update(override)` mutando defaults (usa copia).",
        hint: "{**defaults, **override} o defaults | override (3.9+)",
        hints: [
          "{**defaults, **override} o defaults | override (3.9+)",
          "Copia antes de update in-place.",
        ],
        edgeCases: ["no pisar sin querer"],
        tests: "retry 5 timeout 30; defaults original intacto",
        feedback: "Precedencia override > defaults sin mutar la config base compartida.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `defaults = {'retry': 1, 'timeout': 30}
override = {'retry': 5}
# TODO merged seguro
print('merged', merged)
# TODO no mutar original defaults al fusionar`,
        },
        solutionCode: {
          language: 'python',
          title: "merge_config.py",
          code: `defaults = {'retry': 1, 'timeout': 30}
override = {'retry': 5}
merged = {**defaults, **override}
print('merged', merged)
print('defaults intacto', defaults)
base = dict(defaults)
base.update(override)
print('via copy+update', base)`,
          output: `merged {'retry': 5, 'timeout': 30}
defaults intacto {'retry': 1, 'timeout': 30}
via copy+update {'retry': 5, 'timeout': 30}`,
        },
      },
      {
        id: "S06-T2-B-E1",
        subtopicId: "S06-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Deduplica `['a@ex.com','b@ex.com','a@ex.com']` con set y devuelve lista **ordenada** de únicos.",
        hint: "sorted(set(emails))",
        hints: [
          "sorted(set(emails))",
          "set no garantiza orden de impresión sin sorted.",
        ],
        edgeCases: ["orden determinista"],
        tests: "['a@ex.com', 'b@ex.com']",
        feedback: "Dedup + sorted = salida estable para demos.",
        starterCode: {
          language: 'python',
          title: "dedup_emails.py",
          code: `emails = ['a@ex.com', 'b@ex.com', 'a@ex.com']
# TODO
print(unicos)`,
        },
        solutionCode: {
          language: 'python',
          title: "dedup_emails.py",
          code: `emails = ['a@ex.com', 'b@ex.com', 'a@ex.com']
unicos = sorted(set(emails))
print(unicos)`,
          output: `['a@ex.com', 'b@ex.com']`,
        },
      },
      {
        id: "S06-T2-B-E2",
        subtopicId: "S06-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Intersección de contactos `lote_a` y `lote_b` (sets de emails). Imprime sorted de la intersección y de la diferencia simétrica.",
        hint: "a & b ; a ^ b",
        hints: [
          "a & b ; a ^ b",
          "sorted para determinismo.",
        ],
        edgeCases: ["cohortes"],
        tests: "inter b,c ; symdiff a,d",
        feedback: "Intersección = en ambos lotes; symdiff = solo en uno.",
        starterCode: {
          language: 'python',
          title: "set_inter.py",
          code: `a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}
b = {'b@ex.com', 'c@ex.com', 'd@ex.com'}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "set_inter.py",
          code: `a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}
b = {'b@ex.com', 'c@ex.com', 'd@ex.com'}
print('inter', sorted(a & b))
print('symdiff', sorted(a ^ b))`,
          output: `inter ['b@ex.com', 'c@ex.com']
symdiff ['a@ex.com', 'd@ex.com']`,
        },
      },
      {
        id: "S06-T2-B-E3",
        subtopicId: "S06-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Implementa `dedup_report(rows, key='id')` que devuelve `{unique: [...], conflicts: [...]}` sin eliminar del reporte los conflictos. Filas sintéticas con C001 repetido distinto.",
        hint: "seen dict; si key existe y row!=prev → conflict",
        hints: [
          "seen dict; si key existe y row!=prev → conflict",
          "unique guarda primera ocurrencia.",
        ],
        edgeCases: ["conflictos sin borrar traza"],
        tests: "1 conflict C001",
        feedback: "Patrón del You Do S06: unique + conflicts.",
        starterCode: {
          language: 'python',
          title: "dedup_report.py",
          code: `def dedup_report(rows, key='id'):
    # TODO
    ...
rows = [
    {'id': 'C001', 'v': 1},
    {'id': 'C002', 'v': 2},
    {'id': 'C001', 'v': 9},
]
print(dedup_report(rows))`,
        },
        solutionCode: {
          language: 'python',
          title: "dedup_report.py",
          code: `def dedup_report(rows, key='id'):
    seen = {}
    unique = []
    conflicts = []
    for r in rows:
        k = r[key]
        if k not in seen:
            seen[k] = r
            unique.append(r)
        elif seen[k] != r:
            conflicts.append({'key': k, 'kept': seen[k], 'other': r})
    return {'unique': unique, 'conflicts': conflicts}
rows = [
    {'id': 'C001', 'v': 1},
    {'id': 'C002', 'v': 2},
    {'id': 'C001', 'v': 9},
]
print(dedup_report(rows))`,
          output: `{'unique': [{'id': 'C001', 'v': 1}, {'id': 'C002', 'v': 2}], 'conflicts': [{'key': 'C001', 'kept': {'id': 'C001', 'v': 1}, 'other': {'id': 'C001', 'v': 9}}]}`,
        },
      },
      {
        id: "S06-T3-A-E1",
        subtopicId: "S06-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Cuenta contactos por cliente e imprime `id → n`.",
        hint: "len(c['contacts'])",
        hints: [
          "len(c['contacts'])",
          "for c in clients",
        ],
        edgeCases: ["lista vacía de contactos"],
        tests: "C001 → 2 ; C002 → 0",
        feedback: "Conteo simple valida el grafo anidado.",
        starterCode: {
          language: 'python',
          title: "count_contacts.py",
          code: `clients = [
    {'id': 'C001', 'contacts': [1, 2]},
    {'id': 'C002', 'contacts': []},
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "count_contacts.py",
          code: `clients = [
    {'id': 'C001', 'contacts': [1, 2]},
    {'id': 'C002', 'contacts': []},
]
for c in clients:
    print(c['id'], '→', len(c['contacts']))`,
          output: `C001 → 2
C002 → 0`,
        },
      },
      {
        id: "S06-T3-A-E2",
        subtopicId: "S06-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Aplana `txs` anidadas a filas `{client_id, tx_id, monto}` e imprime la lista.",
        hint: "doble for o comprehension anidada",
        hints: [
          "doble for o comprehension anidada",
          "conserva client_id en cada fila",
        ],
        edgeCases: ["denormalización"],
        tests: "3 filas flat",
        feedback: "Shape listo para CSV en S08.",
        starterCode: {
          language: 'python',
          title: "flatten_txs.py",
          code: `clients = [
    {'id': 'C001', 'txs': [{'id': 'T1', 'monto': 5}]},
    {'id': 'C002', 'txs': [{'id': 'T2', 'monto': 7}, {'id': 'T3', 'monto': 1}]},
]
# TODO flat
print(flat)`,
        },
        solutionCode: {
          language: 'python',
          title: "flatten_txs.py",
          code: `clients = [
    {'id': 'C001', 'txs': [{'id': 'T1', 'monto': 5}]},
    {'id': 'C002', 'txs': [{'id': 'T2', 'monto': 7}, {'id': 'T3', 'monto': 1}]},
]
flat = [
    {'client_id': c['id'], 'tx_id': t['id'], 'monto': t['monto']}
    for c in clients for t in c['txs']
]
print(flat)`,
          output: `[{'client_id': 'C001', 'tx_id': 'T1', 'monto': 5}, {'client_id': 'C002', 'tx_id': 'T2', 'monto': 7}, {'client_id': 'C002', 'tx_id': 'T3', 'monto': 1}]`,
        },
      },
      {
        id: "S06-T3-A-E3",
        subtopicId: "S06-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Detecta shape inconsistente: si falta `txs` o no es list, marca `status='review'`. Imprime status por cliente sintético (uno ok, uno malo).",
        hint: "isinstance(c.get('txs'), list)",
        hints: [
          "isinstance(c.get('txs'), list)",
          "No asumas claves siempre presentes.",
        ],
        edgeCases: ["shape roto"],
        tests: "ok / review / review",
        feedback: "Validar shape en memoria evita basura silenciosa al exportar.",
        starterCode: {
          language: 'python',
          title: "shape_check.py",
          code: `clients = [
    {'id': 'C001', 'txs': []},
    {'id': 'C002'},
    {'id': 'C003', 'txs': 'oops'},
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "shape_check.py",
          code: `clients = [
    {'id': 'C001', 'txs': []},
    {'id': 'C002'},
    {'id': 'C003', 'txs': 'oops'},
]
for c in clients:
    txs = c.get('txs')
    ok = isinstance(txs, list)
    print(c['id'], 'ok' if ok else 'review')`,
          output: `C001 ok
C002 review
C003 review`,
        },
      },
      {
        id: "S06-T3-B-E1",
        subtopicId: "S06-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Implementa `get_nested(d, *keys, default=None)` y úsalo para `profile.phone` en un dict sintético.",
        hint: "Recorre keys; si falta retorna default.",
        hints: [
          "Recorre keys; si falta retorna default.",
          "Chequea isinstance dict en cada nivel.",
        ],
        edgeCases: ["path incompleto"],
        tests: "999 y N/A",
        feedback: "Helper reutilizable del modelo anidado.",
        starterCode: {
          language: 'python',
          title: "get_nested.py",
          code: `def get_nested(d, *keys, default=None):
    # TODO
    ...
c = {'profile': {'phone': '999'}}
print(get_nested(c, 'profile', 'phone'))
print(get_nested(c, 'profile', 'email', default='N/A'))`,
        },
        solutionCode: {
          language: 'python',
          title: "get_nested.py",
          code: `def get_nested(d, *keys, default=None):
    cur = d
    for k in keys:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur
c = {'profile': {'phone': '999'}}
print(get_nested(c, 'profile', 'phone'))
print(get_nested(c, 'profile', 'email', default='N/A'))`,
          output: `999
N/A`,
        },
      },
      {
        id: "S06-T3-B-E2",
        subtopicId: "S06-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Para cada cliente, marca en un reporte si `email` es missing (None o ausente) o present. Imprime líneas `id: missing|present`.",
        hint: "'email' not in c or c['email'] is None → missing",
        hints: [
          "'email' not in c or c['email'] is None → missing",
          "'' puede contarse present vacío según política; aquí '' = present.",
        ],
        edgeCases: ["None vs ausente"],
        tests: "present/missing/missing",
        feedback: "Reporte de missing alimenta tasas de completitud.",
        starterCode: {
          language: 'python',
          title: "mark_missing.py",
          code: `clients = [
    {'id': 'C001', 'email': 'a@ex.com'},
    {'id': 'C002', 'email': None},
    {'id': 'C003'},
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "mark_missing.py",
          code: `clients = [
    {'id': 'C001', 'email': 'a@ex.com'},
    {'id': 'C002', 'email': None},
    {'id': 'C003'},
]
for c in clients:
    if 'email' not in c or c['email'] is None:
        flag = 'missing'
    else:
        flag = 'present'
    print(f"{c['id']}: {flag}")`,
          output: `C001: present
C002: missing
C003: missing`,
        },
      },
      {
        id: "S06-T3-B-E3",
        subtopicId: "S06-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Construye tabla mental en prints: para valores `None`, `''`, `0`, `[]` indica si son falsy y si representan missing de negocio (solo None = missing aquí).",
        hint: "bool(x) vs x is None",
        hints: [
          "bool(x) vs x is None",
          "0 y '' son falsy pero pueden ser datos válidos.",
        ],
        edgeCases: ["falsy vs missing"],
        tests: "solo None missing=True",
        feedback: "Política explícita evita bugs de if not value.",
        starterCode: {
          language: 'python',
          title: "falsy_table.py",
          code: `vals = [None, '', 0, []]
# TODO para cada: falsy? missing?`,
        },
        solutionCode: {
          language: 'python',
          title: "falsy_table.py",
          code: `vals = [None, '', 0, []]
for v in vals:
    print(repr(v), 'falsy=', not bool(v), 'missing=', v is None)`,
          output: `None falsy= True missing= True
'' falsy= True missing= False
0 falsy= True missing= False
[] falsy= True missing= False`,
        },
      },
      {
        id: "S06-T4-A-E1",
        subtopicId: "S06-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Ordena por monto ascendente con sorted+key e imprime ids en orden.",
        hint: "key=lambda r: r['monto']",
        hints: [
          "key=lambda r: r['monto']",
          "sorted no muta la lista original.",
        ],
        edgeCases: ["monto numérico"],
        tests: "T1 luego T2",
        feedback: "key extrae el criterio sin reescribir comparadores.",
        starterCode: {
          language: 'python',
          title: "sort_monto.py",
          code: `rows = [{'id': 'T2', 'monto': 30}, {'id': 'T1', 'monto': 10}]
# TODO
print([r['id'] for r in ordered])`,
        },
        solutionCode: {
          language: 'python',
          title: "sort_monto.py",
          code: `rows = [{'id': 'T2', 'monto': 30}, {'id': 'T1', 'monto': 10}]
ordered = sorted(rows, key=lambda r: r['monto'])
print([r['id'] for r in ordered])`,
          output: `['T1', 'T2']`,
        },
      },
      {
        id: "S06-T4-A-E2",
        subtopicId: "S06-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — key multi-campo: ordena por región y luego nombre. Imprime pares región/nombre.",
        hint: "key=lambda r: (r['region'], r['nombre'])",
        hints: [
          "key=lambda r: (r['region'], r['nombre'])",
          "Tupla compara lexicográficamente.",
        ],
        edgeCases: ["multi-campo"],
        tests: "Cusco Bob; Lima Ana; Lima Zed",
        feedback: "Patrón de ranking estable multi-columna.",
        starterCode: {
          language: 'python',
          title: "sort_multi.py",
          code: `rows = [
    {'nombre': 'Zed', 'region': 'Lima'},
    {'nombre': 'Ana', 'region': 'Lima'},
    {'nombre': 'Bob', 'region': 'Cusco'},
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "sort_multi.py",
          code: `rows = [
    {'nombre': 'Zed', 'region': 'Lima'},
    {'nombre': 'Ana', 'region': 'Lima'},
    {'nombre': 'Bob', 'region': 'Cusco'},
]
for r in sorted(rows, key=lambda r: (r['region'], r['nombre'])):
    print(r['region'], r['nombre'])`,
          output: `Cusco Bob
Lima Ana
Lima Zed`,
        },
      },
      {
        id: "S06-T4-A-E3",
        subtopicId: "S06-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Demuestra que `rows.sort()` retorna None y muta. Imprime tipo del retorno y la lista mutada. Luego usa sorted para obtener copia ordenada sin tocar otra lista `base`.",
        hint: "x = lst.sort() → x is None",
        hints: [
          "x = lst.sort() → x is None",
          "sorted(base) no muta base.",
        ],
        edgeCases: ["in-place vs sorted"],
        tests: "None + base intacta",
        feedback: "Nunca encadenes .sort() esperando la lista ordenada.",
        starterCode: {
          language: 'python',
          title: "sort_inplace.py",
          code: `rows = [3, 1, 2]
base = [3, 1, 2]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "sort_inplace.py",
          code: `rows = [3, 1, 2]
base = [3, 1, 2]
ret = rows.sort()
print('ret', ret)
print('rows', rows)
copy_sorted = sorted(base)
print('base', base, 'copy', copy_sorted)`,
          output: `ret None
rows [1, 2, 3]
base [3, 1, 2] copy [1, 2, 3]`,
        },
      },
      {
        id: "S06-T4-B-E1",
        subtopicId: "S06-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Para 3 jobs imprime la estructura elegida: (1) cola de llegada (2) lookup por id (3) cohorte de emails únicos.",
        hint: "list / dict / set",
        hints: [
          "list / dict / set",
          "Una línea por job con la elección.",
        ],
        edgeCases: ["elección explícita"],
        tests: "list/dict/set",
        feedback: "Justificar estructura es parte del rubric del You Do.",
        starterCode: {
          language: 'python',
          title: "choose_struct.py",
          code: `jobs = [
    'cola de llegada de filas',
    'lookup frecuente por id',
    'emails únicos de un lote',
]
# TODO print job → estructura`,
        },
        solutionCode: {
          language: 'python',
          title: "choose_struct.py",
          code: `choices = {
    'cola de llegada de filas': 'list',
    'lookup frecuente por id': 'dict',
    'emails únicos de un lote': 'set',
}
for job, st in choices.items():
    print(job, '→', st)`,
          output: `cola de llegada de filas → list
lookup frecuente por id → dict
emails únicos de un lote → set`,
        },
      },
      {
        id: "S06-T4-B-E2",
        subtopicId: "S06-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Haz determinista un export: ordena ids y `json.dumps(..., sort_keys=True)`. Imprime el JSON una vez.",
        hint: "sorted ids; sort_keys=True",
        hints: [
          "sorted ids; sort_keys=True",
          "ensure_ascii=False para tildes si hubiera.",
        ],
        edgeCases: ["determinismo"],
        tests: "{\"a\": 2, \"ids\": [\"C001\", \"C002\"], \"z\": 1}",
        feedback: "Mismo input → mismo string en cada corrida.",
        starterCode: {
          language: 'python',
          title: "deterministic_json.py",
          code: `import json
payload = {'z': 1, 'a': 2, 'ids': ['C002', 'C001']}
# TODO
print(s)`,
        },
        solutionCode: {
          language: 'python',
          title: "deterministic_json.py",
          code: `import json
payload = {'z': 1, 'a': 2, 'ids': ['C002', 'C001']}
payload['ids'] = sorted(payload['ids'])
s = json.dumps(payload, sort_keys=True, ensure_ascii=False)
print(s)`,
          output: `{"a": 2, "ids": ["C001", "C002"], "z": 1}`,
        },
      },
      {
        id: "S06-T4-B-E3",
        subtopicId: "S06-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Justifica tradeoff: membership de 1000 ids en list vs set. Simula con prints de complejidad conceptual y un micro-ejemplo n=5 mostrando `x in set` True.",
        hint: "list O(n) vs set O(1) promedio",
        hints: [
          "list O(n) vs set O(1) promedio",
          "No necesitas timeit; razona y demo pequeña.",
        ],
        edgeCases: ["complejidad"],
        tests: "O(n) vs O(1) + True",
        feedback: "Indexar antes de bucles anidados es el tradeoff memoria/tiempo del modelo.",
        starterCode: {
          language: 'python',
          title: "tradeoff.py",
          code: `ids = ['C001', 'C002', 'C003', 'C004', 'C005']
# TODO set + membership + prints de complejidad`,
        },
        solutionCode: {
          language: 'python',
          title: "tradeoff.py",
          code: `ids = ['C001', 'C002', 'C003', 'C004', 'C005']
print('list membership: O(n) por chequeo')
print('set membership: O(1) promedio')
s = set(ids)
print('C003 in set', 'C003' in s)
print('preindexar set/dict evita O(n²) en loops anidados')`,
          output: `list membership: O(n) por chequeo
set membership: O(1) promedio
C003 in set True
preindexar set/dict evita O(n²) en loops anidados`,
        },
      },
    ],
  },
  youDo: {
    title: "Modelo tabular en memoria (CP-N1-B)",
    context:
      "Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando conflictos**, aplanas txs y exportas JSON determinista. En S07–S08 se suma normalización latam e ingesta por archivos. Solo datos sintéticos.",
    objectives: [
      "Representar cliente/contacto/tx en list[dict] documentado",
      "Implementar dedup_report → unique + conflicts",
      "Aplanar transacciones con client_id",
      "Acceso seguro a faltantes (get_nested)",
      "Export determinista (sorted + sort_keys)",
    ],
    requirements: [
      "Tipos list[dict] o índices dict documentados",
      "dedup_report(rows, key_fn) sin borrar conflictos",
      "sorted determinista en exports",
      "Datos sintéticos latam (example.com)",
      "Sin NumPy/pandas en este incremento V3",
    ],
    starterCode: `"""memory_model.py — Modelo tabular en memoria (CP-N1-B / S06)
Clientes + contactos + transacciones en estructuras Python puras.
Sin NumPy/pandas. Datos sintéticos latam únicamente.
"""

from __future__ import annotations

import json
from typing import Any, Callable


def dedup_report(rows: list[dict], key_fn: Callable[[dict], Any]) -> dict:
    """Devuelve {unique, conflicts} sin borrar traza de conflictos."""
    # TODO
    raise NotImplementedError


def flatten_txs(clients: list[dict]) -> list[dict]:
    """Aplana txs anidadas a filas con client_id."""
    # TODO
    raise NotImplementedError


def get_nested(d: dict, *keys: str, default=None):
    # TODO
    raise NotImplementedError


def export_deterministic(clients: list[dict]) -> str:
    """JSON estable: sort por id + sort_keys."""
    # TODO
    raise NotImplementedError


def build_demo_store() -> list[dict]:
    return [
        {
            "id": "C001",
            "nombre": "Ana Quispe",
            "contacts": [{"tipo": "email", "valor": "ana@example.com"}],
            "txs": [{"id": "T1", "monto": 10}, {"id": "T2", "monto": 5}],
        },
        {
            "id": "C002",
            "nombre": "Luis Huamán",
            "contacts": [],
            "txs": [{"id": "T3", "monto": 20}],
        },
    ]


def main() -> None:
    store = build_demo_store()
    print("n_clients", len(store))
    print("flat", flatten_txs(store))
    print(export_deterministic(store))
    rows = [
        {"id": "C001", "v": 1},
        {"id": "C001", "v": 9},
        {"id": "C002", "v": 2},
    ]
    print(dedup_report(rows, key_fn=lambda r: r["id"]))


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "En el README muestra el shape del store, un ejemplo de conflicto de dedup y el JSON determinista de demo. Eso evidencia el incremento en memoria de CP-N1-B.",
    rubric: [
      { criterion: "Modelo completo cliente/contacto/tx", weight: "25%" },
      { criterion: "Dedup sin borrar conflictos", weight: "25%" },
      { criterion: "Determinismo de salida", weight: "20%" },
      { criterion: "Acceso seguro a faltantes", weight: "15%" },
      { criterion: "Elección de estructuras justificada", weight: "15%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué produce xs[-2:] si xs = [1,2,3,4]?",
        options: ["[1,2]", "[3,4]", "[4]", "Error"],
        correctIndex: 1,
        explanation:
          "Slicing negativo toma desde el final: últimos 2 elementos [3,4].",
      },
      {
        question: "b = a (listas) y mutas b.append(1). ¿Qué pasa con a?",
        options: ["a no cambia", "se lanza error", "a se convierte en tuple", "a también ve el append (alias)"],
        correctIndex: 3,
        explanation:
          "Asignación alias: ambas variables apuntan al mismo objeto lista.",
      },
      {
        question: "Para reportar dos filas con mismo id y payload distinto debes…",
        options: ["Listar conflicto en conflicts sin silenciar", "Borrar ambas", "Quedarte con la última sin traza", "Convertir a set de dicts"],
        correctIndex: 0,
        explanation:
          "CP-N1-B: unique + conflicts; no borrar la evidencia del choque.",
      },
      {
        question: "rows.sort(key=...) retorna…",
        options: ["la lista ordenada", "una tuple", "None (muta in-place)", "un set"],
        correctIndex: 2,
        explanation:
          "list.sort muta y retorna None; usa sorted(...) para copia.",
      },
      {
        question: "json.dumps(..., sort_keys=True) ayuda a…",
        options: ["comprimir el archivo", "salidas deterministas/reproducibles", "validar schema JSON Schema", "encriptar PII"],
        correctIndex: 1,
        explanation:
          "Orden estable de claves + sort de filas = demos reproducibles.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python Tutorial — Data Structures",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
        note: "list, dict, set, comprehensions",
      },
      {
        label: "copy — Shallow and deep copy",
        url: "https://docs.python.org/3/library/copy.html",
        note: "alias vs shallow vs deep",
      },
      {
        label: "json — JSON encoder/decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "sort_keys, ensure_ascii",
      },
    ],
    books: [
      {
        label: "Python Crash Course (Matthes)",
        note: "Capítulos de listas/dicts; aplicar al modelo cliente/tx sintético.",
      },
      {
        label: "Fluent Python (Ramalho) — selecciones",
        note: "Secuencias y dicts; profundidad opcional post-S06.",
      },
    ],
    courses: [
      {
        label: "CS50P — Data structures",
        url: "https://cs50.harvard.edu/python/",
        note: "Práctica de collections; adaptar a CP-N1-B sintético.",
      },
    ],
  },
}
