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
    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos. La deduplicación debe **reportar conflictos** y las salidas deben ser **deterministas**. Aquí inicias el bloque de portafolio **CP-N1-B** (modelo en RAM) usando solo la biblioteca estándar — sin NumPy ni pandas. Si ya dominas listas y funciones de S04–S05, esta sección te enseña a **componerlas** como almacén confiable, no solo como ejercicios sueltos.",
  learningOutcomes: [
    { text: "Usar list/tuple y slicing para ventanas de registros sin copiar de más" },
    { text: "Desempaquetar secuencias y distinguir alias vs. copia superficial/profunda" },
    { text: "Modelar registros con dict, get e índices id→fila" },
    { text: "Deduplicar con set y reportar conflictos sin borrarlos" },
    { text: "Navegar list[dict] anidados cliente→contactos→txs" },
    { text: "Acceder campos opcionales sin KeyError; missing vs. vacío" },
    { text: "Ordenar con sorted(..., key=) de forma estable" },
    { text: "Elegir list/dict/set y producir JSON determinista" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: modelo tabular en memoria",
      paragraphs: [
        "**Antes de T1, tres ideas base** (no memorices el resto aún). Una **secuencia** (`list`/`tuple`) ordena filas y ventanas. Un **dict** indexa por ID en tiempo casi constante. Un **set** responde “¿está en la cohorte?”, y alimenta la deduplicación. El resto de la sección enseña a **combinar** esas piezas en un mini almacén en RAM con datos sintéticos LATAM.",
        "En esta sección construyes el **modelo tabular en memoria** que tu portafolio **CP-N1-B** necesita: listas, tuplas, dicts, sets y estructuras anidadas *cliente → contactos → transacciones*. Las salidas son **deterministas** y la deduplicación **reporta conflictos**. Partes de lo que ya practicaste en S04–S05 (listas, funciones con contrato); aquí el foco es **elegir y componer** estructuras, no reinventar bucles.",
        "El hilo conductor es ese **mini almacén** (`example.com`, ids `C00x`). Trabajas solo con la **biblioteca estándar** — sin pandas ni NumPy (el cálculo vectorizado llega más adelante, p. ej. S14). En S08 ese modelo se conecta a CSV/JSON y cuarentena. **Nunca** PII real.",
        "Orden pedagógico: **T1 Secuencias** (list/tuple/slicing → alias/copia) → **T2 Dicts/sets** (índices, dedup con conflictos) → **T3 Anidado y missing** → **T4 Orden y elección de estructura** (sorted estable, JSON determinista). En cada subtema: teoría, demo I Do y tres We Do (guiada → independiente → transferencia). Ritmo sugerido (~18 h): no intentes dominar conflictos y JSON el primer día; avanza T1→T4 en orden.",
      ],
      callout: {
        type: "info",
        title: "Alcance de S06",
        content:
          "Trabajas solo con la **biblioteca estándar** (list, dict, set, copy, json). El objetivo es el **modelo tabular en memoria** (inicio CP-N1-B). NumPy y vectorización se retoman en el tramo de datos/DS. Solo datos sintéticos; nunca PII real.",
      },
    },
    {
      heading: "Listas, tuplas y slicing",
      subtopicId: "S06-T1-A",
      paragraphs: [
        "Una `list` es mutable y ordenada: ideal para filas que crecen (`append`, `extend`) — la cola de llegada de un lote de onboarding sintético. Una `tuple` es inmutable: ideal para **claves estables**, headers fijos o “contratos” de columnas que no deben mutarse por accidente cuando varios helpers comparten el mismo esquema.",
        "El **slicing** `seq[i:j:k]` produce una **ventana** sin mutar el original (en listas/tuplas crea una nueva secuencia). `txs[-3:]` son las últimas tres transacciones: el patrón de “últimos N movimientos” en un extracto. El **stop es exclusivo**, igual que en `range` — evita off-by-one al numerar N filas. En lista vacía, `[][-2:]` devuelve `[]` sin error. Atención al borde: `rows[-0:]` equivale a `rows[0:]` y devuelve todo; por eso un helper “últimas N” debe tratar `n == 0` de forma explícita y rechazar `n < 0`.",
        "Membership `x in seq` es **O(n)** en listas: útil para lotes pequeños de demo; para lookups masivos preferirás **set/dict** (O(1) promedio) en T2. Caso de borde: no uses una lista de 100k ids para `in` dentro de un loop caliente — es la semilla del O(n²) que T4-B te hará medir conceptualmente.",
      ],
      code: {
        language: 'python',
        title: "slicing_txs.py",
        code: `def last_n(rows, n=3):
    """Ventana de las últimas n filas (slicing, sin mutar)."""
    if n < 0:
        raise ValueError("n debe ser mayor o igual que 0")
    return rows[-n:] if n else []

txs = [
    {"id": "T1", "monto": 10},
    {"id": "T2", "monto": 25},
    {"id": "T3", "monto": 7},
    {"id": "T4", "monto": 40},
]
ventana = last_n(txs, 3)
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
        "Después de ventanas y contratos de columnas (T1-A), el siguiente riesgo del almacén es **confundir nombre con copia**. **Unpacking** `a, b = fila` desempaqueta sin índices ruidosos. Con `head, *rest = fila` capturas el primer valor y dejas el sobrante en una lista (útil cuando el lote trae columnas variables). Si el largo no calza con el patrón, Python lanza error: **eso es bueno** — detecta shape roto antes de contaminar el almacén.",
        "**Aliasing**: `b = a` **no** copia; ambas variables apuntan al **mismo** objeto. Si `a` es una lista de dicts y mutas `b[0]['x']`, también cambia `a[0]`. Ese bug clásico aparece al “clonar” clientes en memoria sin copiar de verdad: un score de demo que se “arregla” en un helper y se corrompe en el store original.",
        "`list.copy()` / `seq[:]` hacen **copia superficial**. Para dicts anidados necesitas `copy.deepcopy` o reconstruir por fila (`dict(c)` o `{**c, 'tags': list(c['tags'])}`). En intake, shallow basta si solo reordenas filas **sin** mutar campos compartidos; si mutas tags o contactos anidados, usa deep o un dict nuevo por fila. Contrato: **aislar antes de mutar**.",
      ],
      code: {
        language: 'python',
        title: "alias_vs_copy.py",
        code: `import copy

def isolate_clients(rows, mode="shallow"):
    """Copia superficial de filas o deepcopy según mode."""
    if mode == "deep":
        return copy.deepcopy(rows)
    return rows.copy()

# Unpacking fijo y con *rest (sobrante en lista)
fila = ("C001", "Lima", 10, "app")
cid, region, monto = fila[0], fila[1], fila[2]
head, *rest = fila
print("unpack fijo:", cid, region, monto)
print("head:", head, "rest:", rest)

clientes = [{"id": "C001", "tags": ["vip"]}]
alias = clientes
shallow = isolate_clients(clientes, "shallow")
deep = isolate_clients(clientes, "deep")
alias[0]["tags"].append("alias")
print("original tras alias:", clientes)
shallow[0]["tags"].append("shallow")
print("original tras shallow mut de tags:", clientes)
deep[0]["tags"].append("solo-deep")
print("deep aislado:", deep)
print("original final:", clientes)`,
        output: `unpack fijo: C001 Lima 10
head: C001 rest: ['Lima', 10, 'app']
original tras alias: [{'id': 'C001', 'tags': ['vip', 'alias']}]
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
        "Con secuencias y copias bajo control, pasas al **índice del almacén**. Un `dict` modela registros y **índices** `id → cliente`. La búsqueda tiene costo promedio **O(1)**. Construye índices con `{c['id']: c for c in filas}` cuando harás muchos accesos por clave: buscar “¿dónde está C002?” no debe recorrer toda la lista en cada llamada. Si dos filas traen el mismo ID, la comprensión conservará la última sin avisar; detecta y reporta esos conflictos antes de construir el índice, como practicarás en T2-B.",
        "`d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundas con “¿el cliente tiene email?” si buscas en values. Caso: `\"email\" in cliente` no dice si el email es válido; solo si la clave existe en el `dict`.",
        "`update` / merge fusiona configuraciones: el segundo `dict` **pisa** claves del primero. Documenta la precedencia (`override > base`) y **no mutes** el `dict` base compartido si varios helpers lo leen: prefiere `{**base, **override}` o una copia antes de `update`. Eso evita pisar sin querer políticas de normalización de S05.",
      ],
      code: {
        language: 'python',
        title: "dict_index.py",
        code: `def index_by_id(filas):
    """Índice id → fila para lookup O(1)."""
    return {c["id"]: c for c in filas}

def merge_config(base, override):
    """Fusiona configs: override pisa base sin mutar originales."""
    return {**base, **override}

filas = [
    {"id": "C001", "region": "Lima"},
    {"id": "C002", "region": "Cusco"},
]
idx = index_by_id(filas)
print("lookup C002:", idx["C002"]["region"])
print("get missing:", idx.get("C999", {}).get("region", "N/A"))
base = {"timeout": 30, "retry": 1}
override = {"retry": 3}
merged = merge_config(base, override)
print("merged:", merged)`,
        output: `lookup C002: Cusco
get missing: N/A
merged: {'timeout': 30, 'retry': 3}`,
      },
      callout: {
        type: "tip",
        title: "Índice vs. lista",
        content:
          "Lista para orden de llegada; dict índice para lookup por ID. Ambos conviven en el modelo CP-N1-B.",
      },
    },
    {
      heading: "Deduplicación y operaciones de set",
      subtopicId: "S06-T2-B",
      paragraphs: [
        "El `dict` te da lookup; el **set** te da **membership de cohorte** y deduplicación de ids/emails hashables. Ideal para **unión/intersección/diferencia** de dos lotes sintéticos (quién está en A y en B, quién solo en A). Elementos deben ser hashables: `str` e `int` sí; `list` o `dict` no van directo al `set`.",
        "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id`, pero payload distinto, deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. “El último gana” sin traza es un anti-patrón de calidad de datos.",
        "Para exports **deterministas**, no dependas del orden del set: ordena con `sorted(...)` al exportar (JSON `sort_keys`, listas de ids ordenadas). Reproducibilidad > “orden de llegada mágico”. El mismo lote sintético debe producir el mismo reporte en cada corrida del demo.",
      ],
      code: {
        language: 'python',
        title: "sets_y_conflictos.py",
        code: `def cohort_ops(a, b):
    """Intersección y diferencia de cohortes (sets de ids)."""
    return sorted(a & b), sorted(a - b)

def dedup_with_conflicts(rows, key="id"):
    """Primera vista en unique; payload distinto → conflicts (no silenciar)."""
    seen, unique, conflicts = {}, [], []
    for r in rows:
        rid = r[key]
        if rid not in seen:
            seen[rid] = r
            unique.append(r)
        elif seen[rid] != r:
            conflicts.append({"id": rid, "kept": seen[rid], "other": r})
    return unique, conflicts

lote_a = {"C001", "C002", "C003"}
lote_b = {"C002", "C003", "C004"}
inter, solo_a = cohort_ops(lote_a, lote_b)
print("intersección:", inter)
print("solo A:", solo_a)
rows = [
    {"id": "C001", "email": "a@ex.com"},
    {"id": "C001", "email": "a@ex.com"},  # duplicado idéntico: no es conflicto de payload
    {"id": "C001", "email": "otro@ex.com"},
]
unique, conflicts = dedup_with_conflicts(rows)
print("unique ids:", [r["id"] for r in unique])
print("n_conflicts:", len(conflicts))`,
        output: `intersección: ['C002', 'C003']
solo A: ['C001']
unique ids: ['C001']
n_conflicts: 1`,
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
        "Hasta aquí modelaste filas planas e índices. El modelo **CP-N1-B** anida: `cliente = {id, nombre, contacts: [...], txs: [...]}`. Recorres con `for c in clients: for t in c['txs']:` — bucles anidados **legibles** sobre el grafo en memoria. No hace falta una clase formal aún: un `list[dict]` bien documentado es un almacén suficiente para la **entrega de modelo en memoria** del portafolio.",
        "**Aplanar** transacciones a filas densas (con `client_id` denormalizado) prepara el shape de export CSV en S08: una fila por tx, no un JSON anidado opaco. **Contar** contactos por cliente (`len(c['contacts'])`) valida integridad del almacén en RAM antes de exportar.",
        "Una estructura inconsistente (falta la clave `txs` o no es una lista) se detecta con `isinstance` y se envía a **revisión**. No asumas que todo `dict` llegó bien formado del lote sintético: una cadena `'oops'` donde debía haber una lista de transacciones pasa como basura silenciosa si solo haces `if c.get('txs'):`.",
      ],
      code: {
        language: 'python',
        title: "nested_clients.py",
        code: `def flatten_txs(clients):
    """Aplana txs anidadas a filas densas con client_id."""
    return [
        {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
        for c in clients
        for t in c["txs"]
    ]

def count_nested(clients):
    for c in clients:
        print(c["id"], "n_contacts=", len(c["contacts"]), "n_txs=", len(c["txs"]))

clients = [
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
count_nested(clients)
flat = flatten_txs(clients)
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
        "Al anidar, el fallo típico es `KeyError` en un path incompleto (`profile` ausente, luego `phone`). Campos opcionales: `contact.get('telefono')` puede devolver `None`. Encadenar `.get` en anidados evita el crash: `(c.get('profile') or {}).get('phone')` o, mejor, un helper `get_nested` / `dig` reutilizable.",
        "Distingue **missing** (`None` / clave ausente) de **vacío falsy** (`''`, `0`, `[]`). Un teléfono `''` no es lo mismo que “no vino el campo”: el reporte de calidad debe etiquetar distinto si la política lo exige (eco de S03: `None≠0`). Caso: `if not phone` marcaría mal un monto `0` o un email vacío que aún es “presente pero inválido”.",
        "Helpers `dig(obj, *path)` o `get_nested` centralizan la política y se **testean una vez**. No copies el mismo try/except de KeyError en 20 sitios del orquestador. Contrato del helper: si falta un nivel del path, devuelve `default`; si la clave existe con valor `None`, devuelve `None` (no sustituyas en silencio).",
      ],
      code: {
        language: 'python',
        title: "safe_access.py",
        code: `def get_nested(d, *keys, default=None):
    """Recorre claves; si falta un nivel, devuelve default (no KeyError)."""
    cur = d
    for k in keys:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur

c1 = {"id": "C001", "profile": {"phone": "999111222"}, "email": ""}
c2 = {"id": "C002", "profile": {"phone": None}}
c3 = {"id": "C003", "profile": {}}
print("ok phone:", get_nested(c1, "profile", "phone", default="MISSING"))
print("email empty:", repr(c1.get("email")))  # clave presente, valor ''
print("phone None:", get_nested(c2, "profile", "phone", default="MISSING"))  # clave presente → None, no default
print("phone missing:", get_nested(c3, "profile", "phone", default="MISSING"))  # clave ausente → default`,
        output: `ok phone: 999111222
email empty: ''
phone None: None
phone missing: MISSING`,
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
        "Con el grafo en memoria legible, el export y los rankings piden **orden estable**. `sorted(seq, key=fn)` devuelve **nueva** lista. `list.sort(key=fn)` **muta in-place** y retorna `None` — un bug clásico si haces `x = rows.sort(...)` y pierdes las filas (`x is None` y el store original ya cambió).",
        "`key` multi-campo: `key=lambda r: (r['region'], r['nombre'])` ordena **estable** por región y luego nombre. Timsort preserva el orden relativo de empates — útil para audits reproducibles y para que el README del portafolio no “baile” entre corridas del mismo lote sintético.",
        "Para montos, asegúrate de que el tipo sea **numérico** antes de ordenar; strings `'100' < '20'` rompen el ranking (orden lexicográfico). Normaliza tipos (S05) antes de `sorted`. Caso de lab: top por `monto` en txs sintéticas solo es confiable si `monto` es `int`/`float` (o `Decimal` más adelante), no `str` sucio del formulario.",
      ],
      code: {
        language: 'python',
        title: "sorted_key.py",
        code: `def sort_region_name(rows):
    """Orden estable región → nombre (nueva lista)."""
    return sorted(rows, key=lambda r: (r["region"], r["nombre"]))

def top_by_monto(rows):
    return sorted(rows, key=lambda r: r["monto"], reverse=True)

clients = [
    {"nombre": "Zara", "region": "Lima", "monto": 30},
    {"nombre": "Ana", "region": "Lima", "monto": 50},
    {"nombre": "Luis", "region": "Cusco", "monto": 20},
]
by_region_name = sort_region_name(clients)
print([(r["region"], r["nombre"]) for r in by_region_name])
by_monto = top_by_monto(clients)
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
        "Cierra el modelo eligiendo estructura por **operación dominante**: muchos appends → `list`; muchos lookups por ID → `dict`; membership de cohortes → `set`; contrato fijo inmutable → `tuple`. **No** uses `dict` “porque sí” si el orden de llegada importa y no indexas. Justificar la elección es parte del rubric del You Do.",
        "Complejidad (solo ahora, con las cuatro estructuras en la mano): membership en `list` **O(n)**; en `set`/`dict` **O(1)** promedio. No hagas `if x in big_list` dentro de un loop de n si puedes **preindexar** con un `set` o `dict`. n búsquedas sobre `list` cuestan ~n×n chequeos conceptuales; sobre `set`, ~n. Eso es deuda de rendimiento en el almacén en RAM.",
        "**Determinismo**: `json.dumps(obj, sort_keys=True, ensure_ascii=False)` + `sorted` de ids/clientes produce la misma cadena en cada corrida. La reproducibilidad es un **criterio de entrega** de CP-N1-B: los ejemplos y las diferencias del README deben ser estables. Próximo paso natural: en S08 ese JSON/`list[dict]` se conecta a archivos CSV/JSON y cuarentena; aquí cierras la estructura en memoria.",
      ],
      code: {
        language: 'python',
        title: "determinism.py",
        code: `import json

def dump_deterministic(payload):
    """JSON estable: sort ids + sort_keys."""
    body = dict(payload)
    if "ids" in body:
        body["ids"] = sorted(body["ids"])
    return json.dumps(body, sort_keys=True, ensure_ascii=False)

payload = {"b": 2, "a": 1, "ids": ["C002", "C001"]}
print(dump_deterministic(payload))
print(dump_deterministic(payload))`,
        output: `{"a": 1, "b": 2, "ids": ["C001", "C002"]}
{"a": 1, "b": 2, "ids": ["C001", "C002"]}`,
      },
      callout: {
        type: "info",
        title: "Solo biblioteca estándar",
        content:
          "Si tu solución de S06 importa numpy o pandas, está fuera de alcance. Vuelve a la biblioteca estándar (list, dict, set, copy, json).",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo **muestra** el contrato del subtema antes de que lo practiques en We Do. Modelo en memoria del inicio CP-N1-B; datos sintéticos; solo biblioteca estándar (browser-pyodide).",
    steps: [
      {
        demoId: "S06-T1-A-DEMO",
        subtopicId: "S06-T1-A",
        environment: "browser-pyodide",
        description: "Ventana de últimas txs con slicing y contrato de keys (tuple)",
        preamble:
          "En un extracto de onboarding sintético (ids `T0x`, sin PII real) necesitas las **últimas N** transacciones y un contrato fijo de columnas. Observa la demo sin escribir aún: (1) `txs[-n:]` arma la ventana sin mutar la lista original; (2) la tupla `keys` fija qué campos se proyectan; (3) el `print` de `len(ventana)` confirma el tamaño. El stop del slicing es exclusivo como en `range`. Datos de demo únicamente.",
        code: {
          language: 'python',
          title: "S06-T1-A-DEMO — ventana",
          code: `def window_rows(txs, n=3, keys=("id", "monto", "canal")):
    """Últimas n filas proyectadas al contrato de keys."""
    if n < 0:
        raise ValueError("n debe ser mayor o igual que 0")
    ultimas = txs[-n:] if n else []
    return keys, [tuple(row[k] for k in keys) for row in ultimas]

txs = [
    {"id": "T01", "monto": 12.5, "canal": "app"},
    {"id": "T02", "monto": 40.0, "canal": "web"},
    {"id": "T03", "monto": 8.0, "canal": "app"},
    {"id": "T04", "monto": 15.0, "canal": "tienda"},
    {"id": "T05", "monto": 22.0, "canal": "app"},
]
KEYS, projected = window_rows(txs, 3)
print("keys contrato:", KEYS)
for row in projected:
    print(row)
print("len ventana:", len(projected))`,
          output: `keys contrato: ('id', 'monto', 'canal')
('T03', 8.0, 'app')
('T04', 15.0, 'tienda')
('T05', 22.0, 'app')
len ventana: 3`,
        },
        why: "Slicing da la ventana sin reescribir filas a mano. La tupla de keys proyecta solo las columnas del contrato: inmutable frente a un helper que haga `append` sobre una lista de headers. El `len` de la ventana es el éxito observable del extracto «últimos N».",
        retrospective:
          "Si puedes decir por qué `keys` es tuple y no list, ya internalizaste el contrato de columnas. El error clásico es copiar filas a mano con un `for` en vez de slicing. En We Do T1-A practicarás ventanas y el choque al mutar una tuple.",
      },
      {
        demoId: "S06-T1-B-DEMO",
        subtopicId: "S06-T1-B",
        environment: "browser-pyodide",
        description: "Bug de alias al 'copiar' lista de dicts de clientes",
        preamble:
          "Antes de «clonar» clientes en el store en RAM, el riesgo es **confundir nombre con copia**. Sigue la demo: `mal = clientes` **es alias**; al mutar `score` el original cambia. Luego `dict(c)` por fila aísla el nivel 1 si los campos son planos; `deepcopy` aísla anidados. Datos sintéticos `C00x`. No reescribas; predice cada `print` y compáralo con la salida.",
        code: {
          language: 'python',
          title: "S06-T1-B-DEMO — alias",
          code: `import copy

def copy_clients(rows, mode="shallow"):
    if mode == "deep":
        return copy.deepcopy(rows)
    return [dict(c) for c in rows]

clientes = [
    {"id": "C001", "score": 10},
    {"id": "C002", "score": 20},
]
mal = clientes  # alias, no copia
mal[0]["score"] = 99
print("tras alias mut:", clientes[0]["score"])

bien_shallow = copy_clients(clientes, "shallow")
bien_shallow[0]["score"] = 1
print("original tras shallow dict():", clientes[0]["score"])

deep = copy_clients(clientes, "deep")
deep[1]["score"] = 0
print("C002 original:", clientes[1]["score"], "deep:", deep[1]["score"])`,
          output: `tras alias mut: 99
original tras shallow dict(): 99
C002 original: 20 deep: 0`,
        },
        why: "Alias muta el original porque comparte el mismo objeto. `dict(c)` por fila basta cuando los campos son planos (score, id); si hay tags o listas internas, shallow no aísla y necesitas `deepcopy` o reconstruir el campo anidado. Aislar antes de mutar es el contrato del store.",
        retrospective:
          "Si `b = a` y mutas un campo, ambas variables ven el cambio: no hay «copia mágica». Shallow corta el contenedor; deep corta el grafo. We Do: unpack, alias vs `copy()`, y tags anidados.",
      },
      {
        demoId: "S06-T2-A-DEMO",
        subtopicId: "S06-T2-A",
        environment: "browser-pyodide",
        description: "Índice id→cliente y lookup seguro",
        preamble:
          "Cuando buscas «¿dónde está C002?» muchas veces, recorrer la lista es lento y ruidoso. La demo construye un índice `id → fila`, hace lookup de nombre con `get` anidado y muestra un id ausente → `\"N/A\"`. Observa también `sorted(idx)`: las keys del dict se ordenan al reportar. Solo datos sintéticos; no reescribas, sigue los `print`.",
        code: {
          language: 'python',
          title: "S06-T2-A-DEMO — index",
          code: `def build_index(filas):
    return {c["id"]: c for c in filas}

def lookup_nombre(idx, cid, default="N/A"):
    return idx.get(cid, {}).get("nombre", default)

filas = [
    {"id": "C001", "nombre": "Ana Quispe", "region": "Lima"},
    {"id": "C002", "nombre": "Luis Huamán", "region": "Arequipa"},
]
idx = build_index(filas)
print("encontrado:", lookup_nombre(idx, "C002"))
print("missing:", lookup_nombre(idx, "C999"))
print("keys ordenadas:", sorted(idx))`,
          output: `encontrado: Luis Huamán
missing: N/A
keys ordenadas: ['C001', 'C002']`,
        },
        why: "El índice dict hace lookup O(1) promedio frente a escanear la lista. `get` encadenado evita KeyError cuando el id o el campo son opcionales en demos de intake; el acceso duro se reserva a invariantes que deben fallar fuerte.",
        retrospective:
          "Lista = orden de llegada; dict = lookup. `get` evita KeyError en demos de intake; el acceso duro se reserva a invariantes. We Do: construir dict desde pares, `get` vs KeyError, y merge de configs sin mutar defaults.",
      },
      {
        demoId: "S06-T2-B-DEMO",
        subtopicId: "S06-T2-B",
        environment: "browser-pyodide",
        description: "ids únicos; intersección de lotes; conflictos = mismo id datos distintos",
        preamble:
          "En calidad de datos, deduplicar **no** es borrar a ciegas. Observa: tres filas con `C001` — dos con el mismo email (duplicado inocente) y una con email distinto (conflicto reportado). La demo lista `unique`, cuenta conflictos y muestra intersección de dos lotes con sets. Predice `n_conflicts` antes de mirar el output. Solo emails `*@ex.com` sintéticos.",
        code: {
          language: 'python',
          title: "S06-T2-B-DEMO — dedup",
          code: `def dedup_with_conflicts(rows, key="id"):
    """Unique + conflicts sin borrar traza de payloads distintos."""
    seen, unique, conflicts = {}, [], []
    for r in rows:
        rid = r[key]
        if rid not in seen:
            seen[rid] = r
            unique.append(r)
        elif seen[rid] != r:
            conflicts.append({"id": rid, "a": seen[rid], "b": r})
    return unique, conflicts, seen

rows = [
    {"id": "C001", "email": "a@ex.com"},
    {"id": "C002", "email": "b@ex.com"},
    {"id": "C001", "email": "a@ex.com"},
    {"id": "C001", "email": "otro@ex.com"},
]
unique, conflicts, seen = dedup_with_conflicts(rows)
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
        why: "Dedup preserva la primera vista en `unique`. Payload idéntico no es conflicto; payload distinto se lista en `conflicts` sin borrar filas del reporte. «El último gana» sin traza es anti-patrón de calidad.",
        retrospective:
          "Primera vista en `unique`; payload distinto → `conflicts` con traza. «El último gana» sin reporte es anti-patrón. We Do: emails ordenados, operaciones de set, y `dedup_report` completo.",
      },
      {
        demoId: "S06-T3-A-DEMO",
        subtopicId: "S06-T3-A",
        environment: "browser-pyodide",
        description: "Modelo en memoria Client con contacts[] y txs[]",
        preamble:
          "El núcleo de CP-N1-B es un grafo en memoria: cliente con `contacts[]` y `txs[]`. Observa `summarize_client` (conteo y total) y `flatten_store` (filas densas con `client_id`). No es una base de datos: es el almacén en RAM antes de CSV/JSON en S08. Sigue los prints; nombres sintéticos LATAM.",
        code: {
          language: 'python',
          title: "S06-T3-A-DEMO — modelo",
          code: `def summarize_client(c):
    total = sum(t["monto"] for t in c["txs"])
    return len(c["contacts"]), total

def flatten_store(store):
    return [
        {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
        for c in store
        for t in c["txs"]
    ]

store = [
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
n_contacts, total = summarize_client(c)
print("cliente", c["id"], c["nombre"])
print("contactos:", n_contacts)
print("total txs:", total)
print("flat:", flatten_store(store))`,
          output: `cliente C001 María Quispe
contactos: 2
total txs: 62
flat: [{'client_id': 'C001', 'tx_id': 'T1', 'monto': 50}, {'client_id': 'C001', 'tx_id': 'T2', 'monto': 12}]`,
        },
        why: "El grafo cliente→contactos/txs es el núcleo del modelo tabular CP-N1-B en RAM. Resumir y aplanar son dos vistas del mismo store: una para negocio, otra para export densificado con `client_id`.",
        retrospective:
          "Anidar es modelar; aplanar es exportar. Cada fila flat conserva `client_id` para no perder la relación. We Do: contar contactos, aplanar todas las txs, y validar shape roto.",
      },
      {
        demoId: "S06-T3-B-DEMO",
        subtopicId: "S06-T3-B",
        environment: "browser-pyodide",
        description: "Extraer teléfono opcional de contacto anidado",
        preamble:
          "Campos opcionales anidados (`profile.phone`) no se leen con `d['a']['b']` a ciegas. La demostración muestra un helper `dig` y clasifica: valor OK, **missing** (ruta incompleta) y **empty** (cadena vacía). Observa C003: el teléfono existe pero es `\"\"` — no es lo mismo que C004 sin `profile`. Solo datos sintéticos.",
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
c3 = {"id": "C003", "profile": {"phone": ""}}
c4 = {"id": "C004"}
for c in (c1, c2, c3, c4):
    phone = dig(c, "profile", "phone", default="MISSING")
    if phone == "MISSING":
        flag = "missing"
    elif phone == "":
        flag = "empty"
    else:
        flag = "ok"
    print(c["id"], phone, flag)`,
          output: `C001 999111222 ok
C002 MISSING missing
C003  empty
C004 MISSING missing`,
        },
        why: "`dig()` centraliza el acceso seguro por ruta. Etiquetar missing vs empty alimenta el reporte de completitud: una cadena vacía no es una «clave ausente», y `if not phone` confunde ambos casos.",
        retrospective:
          "Missing ≠ empty ≠ ok. Centralizar el acceso evita KeyError y unifica el reporte de completitud. We Do: `get_nested`, marcar missing de email, y tabla falsy vs missing.",
      },
      {
        demoId: "S06-T4-A-DEMO",
        subtopicId: "S06-T4-A",
        environment: "browser-pyodide",
        description: "Ordenar clientes por región luego nombre",
        preamble:
          "Los exports del almacén piden orden estable: primero región, luego nombre. Observa `sorted(..., key=lambda r: (región, nombre))` **sin** mutar la lista original. Después, el anti-patrón: `list.sort` muta y **retorna None**. Predice las líneas de salida antes de ejecutar. Datos sintéticos Lima/Cusco.",
        code: {
          language: 'python',
          title: "S06-T4-A-DEMO — sort",
          code: `def order_region_name(clients):
    return sorted(clients, key=lambda r: (r["region"], r["nombre"]))

def sort_ids_inplace(rows):
    """list.sort muta y retorna None — bug clásico si se asigna."""
    rows.sort(key=lambda r: r["id"])
    return None

clients = [
    {"id": "C003", "nombre": "Zara", "region": "Lima"},
    {"id": "C001", "nombre": "Ana", "region": "Lima"},
    {"id": "C002", "nombre": "Bruno", "region": "Cusco"},
]
ordered = order_region_name(clients)
for r in ordered:
    print(r["region"], r["nombre"], r["id"])
mutated = clients[:]
ret = sort_ids_inplace(mutated)
print("sort in-place retorna:", ret)
print("ids mutados:", [r["id"] for r in mutated])`,
          output: `Cusco Bruno C002
Lima Ana C001
Lima Zara C003
sort in-place retorna: None
ids mutados: ['C001', 'C002', 'C003']`,
        },
        why: "`sorted` devuelve una lista nueva; `key` multi-campo da ranking lexicográfico región→nombre para exports. `list.sort` muta in-place y retorna `None`: no lo asignes a una variable esperando la lista ordenada.",
        retrospective:
          "`sorted` devuelve lista nueva; `.sort` muta y retorna `None` — no lo asignes. El `key` multi-campo ordena lexicográficamente región→nombre sin reescribir comparadores. We Do: monto, multi-campo, y el bug de asignar `.sort()`.",
      },
      {
        demoId: "S06-T4-B-DEMO",
        subtopicId: "S06-T4-B",
        environment: "browser-pyodide",
        description: "Mismo input → mismo JSON dump con sort_keys",
        preamble:
          "Un artefacto de demo del modelo en memoria debe ser **reproducible**: misma entrada, mismo JSON. Observa ordenar `clients` por `id` y `json.dumps(..., sort_keys=True)`. La igualdad `a == b` en dos corridas es el test de determinismo. Sin PII real; `generated_by` es metadata sintética.",
        code: {
          language: 'python',
          title: "S06-T4-B-DEMO — json",
          code: `import json

def export_deterministic(data):
    """JSON estable: sort por id de clients + sort_keys."""
    body = dict(data)
    body["clients"] = sorted(body["clients"], key=lambda c: c["id"])
    return json.dumps(body, sort_keys=True, ensure_ascii=False)

data = {
    "clients": [
        {"id": "C002", "region": "Cusco"},
        {"id": "C001", "region": "Lima"},
    ],
    "generated_by": "s06-demo",
}
a = export_deterministic(data)
b = export_deterministic(data)
print(a)
print("determinista:", a == b)`,
          output: `{"clients": [{"id": "C001", "region": "Lima"}, {"id": "C002", "region": "Cusco"}], "generated_by": "s06-demo"}
determinista: True`,
        },
        why: "Ordenar filas por `id` y serializar con `sort_keys=True` elimina el orden mágico de `dict`/`set`. Misma entrada → misma cadena: evidencia de portafolio y pruebas de regresión del modelo en memoria.",
        retrospective:
          "Ordenar filas + `sort_keys` elimina el «orden mágico» de dict/set. Es evidencia de portafolio en el README del You Do. We Do: elegir list/dict/set, dumps determinista, y tradeoff de membership.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints cada uno. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos.",
    steps: [
      {
        id: "S06-T1-A-E1",
        subtopicId: "S06-T1-A",
        kind: "guided",
        title: "Últimos 2 montos con slicing negativo",
        preamble:
          "- **Contexto:** en el mini almacén de txs sintéticas, el reporte «últimos movimientos» usa ventanas, no reescritura a mano.\n- **Meta:** practicar slicing negativo y el caso lista vacía.\n- **Éxito:** con `txs = [10,20,30,40,50]` imprimes `[40, 50]` y `2`; con lista vacía, `[]` y `0`.\n- **Límites:** solo biblioteca estándar; no mutes `txs`; no uses bucles para la ventana.",
        instruction:
          "1. Abre el starter: `ventana = txs[:2]` toma el **inicio**, no el final.\n2. Cambia a `txs[-2:]` (y lo mismo en `empty`).\n3. Imprime la ventana y su `len` en ambos casos.\n4. No agregues texto extra en los `print`.",
        hint: "Usa txs[-2:] (funciona también si hay menos de 2).",
        hints: [
          "Usa txs[-2:] (funciona también si hay menos de 2).",
          "print la lista y luego len(ventana).",
        ],
        edgeCases: ["caso vacío"],
        tests: "[40, 50] y []",
        feedback:
          "`[:2]` son los primeros dos; `[-2:]` son los últimos. En lista vacía el slicing devuelve `[]` sin `IndexError` — por eso el caso vacío se prueba junto a la ventana feliz.",
        retrospective:
          "La ventana negativa es el mismo patrón de «últimos N» del extracto. No confundas índice `[-2]` (un elemento) con slice `[-2:]` (lista). Siguiente: contrato de columnas con tuple (E2).",
        starterCode: {
          language: 'python',
          title: "slice_n.py",
          code: `# Ventana de las últimas transacciones (corrige el slicing).
txs = [10, 20, 30, 40, 50]
ventana = txs[:2]
print(ventana)
print(len(ventana))
empty = []
v0 = empty[0:2]
print(v0)
print(len(v0))`,
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
        title: "Headers a tuple y extensión sin mutar",
        preamble:
          "- **Contexto:** el esquema de columnas del almacén no debe mutarse si un helper hace `append` por error.\n- **Meta:** convertir headers a `tuple` y demostrar extensión con `+`.\n- **Éxito:** `KEYS` imprime `('id', 'monto')`; `more` es `('id', 'monto', 'canal')`; `KEYS` sigue igual después.\n- **Límites:** no uses `.append` sobre `KEYS`; no dejes `KEYS` como alias de la lista.",
        instruction:
          "1. Parte de `headers = ['id', 'monto']`.\n2. Crea `KEYS` inmutable desde esa lista.\n3. Construye `more` agregando `'canal'` sin mutar `KEYS`.\n4. Imprime `KEYS`, `more` y de nuevo `KEYS` para verificar estabilidad.",
        hint: "tuple(lista) o keys = ('id','monto')",
        hints: [
          "tuple(lista) o keys = ('id','monto')",
          "KEYS no tiene append; usa + para nueva tupla.",
        ],
        edgeCases: ["inmutabilidad"],
        tests: "KEYS estable + more",
        feedback:
          "Si dejas `KEYS = headers`, un `append` en otro helper muta el «contrato». `tuple(headers)` congela el esquema; `KEYS + ('canal',)` crea **otra** secuencia y deja el snapshot intacto.",
        retrospective:
          "Tuple = snapshot de contrato; list = cola que crece. Si necesitas «agregar columna», creas **otra** secuencia. Luego (E3) verás el `AttributeError` al tratar la tuple como lista mutable.",
        starterCode: {
          language: 'python',
          title: "list_tuple.py",
          code: `# Contrato de columnas: convierte a tuple inmutable.
headers = ['id', 'monto']
KEYS = headers  # alias mutable
more = KEYS + ['canal']
print('KEYS', KEYS)
print('more', more)
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
        title: "Diagnosticar append sobre tuple de ids",
        preamble:
          "- **Contexto:** a veces un snapshot de ids llega como tuple (inmutable); el pipeline intenta mutarlo como cola.\n- **Meta:** capturar `AttributeError`, convertir a `list` y mutar una **copia**.\n- **Éxito:** un `print` de diagnóstico con nombre `AttributeError` y luego `['C001', 'C002', 'C003']`.\n- **Límites:** no uses `except Exception` genérico en la solución; no mutes la tuple original (no se puede).",
        instruction:
          "1. Intenta `ids.append('C003')` dentro de `try`.\n2. En `except AttributeError`, imprime tipo y mensaje.\n3. Convierte a lista, haz `append('C003')` e imprime el resultado.\n4. En el except usa solo AttributeError (no Exception genérico); la tuple original no se muta.",
        hint: "tuple no tiene append → AttributeError.",
        hints: [
          "tuple no tiene append → AttributeError.",
          "list(ids) para mutar una copia.",
        ],
        edgeCases: ["diagnóstico AttributeError"],
        tests: "AttributeError + lista mutada",
        feedback:
          "Si necesitas mutar, trabaja con `list`; guarda `tuple` solo como snapshot. Convertir todo a list «por si acaso» pierde el contrato de inmutabilidad: el error es la señal, no un fallo vergonzoso.",
        retrospective:
          "Mutar exige list; el snapshot de ids puede seguir siendo tuple. El error es la señal, no un «fallo vergonzoso». En T1-B el riesgo sube: alias y copias en listas de dicts.",
        starterCode: {
          language: 'python',
          title: "fix_tuple_mut.py",
          code: `# Diagnostica el error al mutar una tuple.
ids = ('C001', 'C002')
try:
    ids.append('C003')
except Exception as e:
    print('error genérico', e)
print('ids', ids)`,
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
        title: "Desempaquetar fila en cid, región y monto",
        preamble:
          "- **Contexto:** filas sintéticas de intake llegan como tuplas posicionales; el unpack documenta el shape.\n- **Meta:** asignar `cid, region, monto` sin índices sueltos.\n- **Éxito:** una línea `C001 Lima 10` (en ese orden).\n- **Límites:** no uses índices `fila[i]` en la solución final; no fuerces el caso de largo incorrecto aquí.",
        instruction:
          "1. Revisa el starter: `region` y `monto` están cruzados.\n2. Sustituye por unpack `cid, region, monto = fila`.\n3. Imprime los tres en un solo `print`.\n4. Confirma mentalmente que el largo de `fila` es 3.",
        hint: "a, b, c = fila",
        hints: [
          "a, b, c = fila",
          "Orden posicional importa.",
        ],
        edgeCases: ["largo exacto"],
        tests: "C001 Lima 10",
        feedback:
          "Unpack documenta el shape esperado de la fila. Si el largo no calza, Python falla de inmediato — y eso es bueno para detectar filas rotas antes del almacén.",
        retrospective:
          "Unpack es un contrato de shape: si el largo no calza, Python falla — y eso es bueno. Siguiente: alias vs `copy()` en listas (E2).",
        starterCode: {
          language: 'python',
          title: "unpack_row.py",
          code: `# Desempaqueta la fila en cid, region, monto.
fila = ('C001', 'Lima', 10)
cid = fila[0]
region = fila[2]
monto = fila[1]
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
        title: "Alias versus copy en lista de enteros",
        preamble:
          "- **Contexto:** al «duplicar» una cola de ids numéricos de demo, `=` no copia.\n- **Meta:** contrastar alias y `list.copy()` con mutaciones `append`.\n- **Éxito:** tras alias append 3 → `xs` y `copia` divergen (`[1,2,3]` vs `[1,2]`); tras append 4 solo a copia → `xs` sin 4.\n- **Límites:** no uses `deepcopy` aquí (ints inmutables; shallow basta).",
        instruction:
          "1. Parte de `xs = [1, 2]`.\n2. Crea `alias` (mismo objeto) y `copia` (shallow).\n3. Mutar alias, imprimir; mutar copia, imprimir.\n4. Imprime en el orden del starter: tras alias, luego tras mutar la copia.",
        hint: "alias comparte objeto; copy es superficial de la lista de ints.",
        hints: [
          "alias comparte objeto; copy es superficial de la lista de ints.",
          "ints inmutables: shallow basta.",
        ],
        edgeCases: ["alias vs. copy"],
        tests: "xs crece con alias; no con copia tras divergencia",
        feedback:
          "`copy()` corta el alias del contenedor lista. Con enteros inmutables, shallow basta; el bug aparece cuando crees que `=` ya «duplicó» la cola.",
        retrospective:
          "`copy()` corta el alias del **contenedor**. Con objetos anidados el cuento cambia (E3). Pregunta de cierre: ¿por qué `copia` no vio el 3?",
        starterCode: {
          language: 'python',
          title: "alias_copy.py",
          code: `# Demuestra alias vs copy de listas.
xs = [1, 2]
alias = xs
copia = xs
alias.append(3)
print('tras alias', xs, copia)
copia.append(4)
print('tras copia', xs, copia)`,
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
        title: "Tags anidados: shallow no aísla",
        preamble:
          "- **Contexto:** clientes con `tags: list` en el store; un helper «copia» el lote y contamina el original.\n- **Meta:** demostrar que `list.copy()` comparte dicts internos y que `deepcopy` aísla.\n- **Éxito:** tras shallow, original tiene `'s'`; tras deep append `'d'`, original queda con `['a','s']` y deep con `['a','s','d']`.\n- **Límites:** `import copy`; no inventes otra estructura.",
        instruction:
          "1. Ejecuta el starter y observa la fuga por tags.\n2. Reemplaza la «deep» falsa por `copy.deepcopy`.\n3. Mutar solo el deep e imprime original vs deep.\n4. No «arregles» borrando el experimento shallow: sirve de contraste.",
        hint: "import copy; deepcopy",
        hints: [
          "import copy; deepcopy",
          "shallow[0] is original[0] → True",
        ],
        edgeCases: ["shallow vs. deep anidado"],
        tests: "deep no contamina original en el append 'd'",
        feedback:
          "En modelo cliente con listas internas, `list.copy()` **no** aísla dicts ni tags. «Ya hice copy, estoy a salvo» es el misconception: necesitas `deepcopy` o reconstruir el campo anidado.",
        retrospective:
          "Shallow de `list[dict]` **no** aísla campos lista/dict. En el You Do, si mutas contactos de una copia, decide deep o reconstrucción por fila. Puente a T2: índices dict sin copiar de más.",
        starterCode: {
          language: 'python',
          title: "shallow_deep.py",
          code: `# Shallow vs deep: aísla tags anidados.
import copy
rows = [{'id': 'C1', 'tags': ['a']}]
shallow = rows.copy()
shallow[0]['tags'].append('s')
print('orig tras shallow tags', rows)
deep = rows.copy()  # debería aislar tags anidados
deep[0]['tags'].append('d')
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
        title: "Dict desde pares id–región",
        preamble:
          "- **Contexto:** un lote sintético llega como pares `(id, región)` y necesitas un índice de lookup.\n- **Meta:** construir un `dict` real, no dejar la lista de pares.\n- **Éxito:** imprime `{'C001': 'Lima', 'C002': 'Cusco'}` y el lookup `Cusco` con clave `'C002'`.\n- **Límites:** claves hashables (`str`); no uses pandas.",
        instruction:
          "1. El starter asigna `d = pares` (sigue siendo lista).\n2. Construye el dict con `dict(pares)` (o comprensión).\n3. Imprime el dict y `d['C002']`.\n4. No indexes por posición `d[1]` como si fuera lista.",
        hint: "dict(pares) o comprensión",
        hints: [
          "dict(pares) o comprensión",
          "Claves deben ser hashables (str ok).",
        ],
        edgeCases: ["pares→dict"],
        tests: "Cusco",
        feedback:
          "`dict(pares)` es el constructor idiomático clave–valor. Indexar con `d[1]` como lista falla el lookup por id: el índice del almacén nace como mapa, no como cola de pares.",
        retrospective:
          "Lista de pares ≠ índice. El almacén necesita mapa id→valor, no cola de tuplas. El error clásico es seguir indexando con `d[1]` como si fuera lista. Siguiente: `get` cuando el id puede faltar (E2).",
        starterCode: {
          language: 'python',
          title: "dict_from_pairs.py",
          code: `# Construye un dict desde pares clave-valor.
pares = [('C001', 'Lima'), ('C002', 'Cusco')]
d = pares
print(d)
print(d[1])`,
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
        title: "get con default frente a KeyError",
        preamble:
          "- **Contexto:** ids opcionales en intake sintético: a veces reportas «N/A», a veces un bug de programación debe fallar fuerte.\n- **Meta:** usar `get` para opcionales y capturar `KeyError` en acceso duro.\n- **Éxito:** tres líneas conceptuales: `Ana`, `N/A`, y un print de `KeyError 'C999'`.\n- **Límites:** no tragues todas las excepciones con `except Exception`.",
        instruction:
          "1. Con `idx = {'C001': 'Ana'}`, imprime `get` de C001 y de C999 (default `'N/A'`).\n2. En un `try`, accede `idx['C999']`.\n3. En `except KeyError`, imprime el error.\n4. Compara con la solución: no omitas el `get` de C001.",
        hint: "idx.get('C999','N/A')",
        hints: [
          "idx.get('C999','N/A')",
          "KeyError solo en acceso duro.",
        ],
        edgeCases: ["get vs. KeyError"],
        tests: "Ana / N/A / KeyError",
        feedback:
          "`get` con default cubre ausencia esperada (campo opcional). `KeyError` en acceso duro señala un invariante roto de programación — no lo envuelvas en `except Exception` genérico.",
        retrospective:
          "`get` = ausencia esperada; `KeyError` = invariante roto. En el modelo anidado (T3-B) reutilizarás el mismo criterio con rutas de claves.",
        starterCode: {
          language: 'python',
          title: "get_vs_keyerror.py",
          code: `# get con default vs acceso duro con KeyError.
idx = {'C001': 'Ana'}
print(idx['C001'])
try:
    print(idx['C999'])
except KeyError as e:
    print('KeyError', e)`,
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
        title: "Fusionar config sin mutar defaults",
        preamble:
          "- **Contexto:** varios helpers comparten una config base de retry/timeout; un override no debe pisar el original en memoria.\n- **Meta:** merge con precedencia override > defaults, dejando `defaults` intacto.\n- **Éxito:** `merged` con `retry: 5` y `timeout: 30`; `defaults` sigue en `retry: 1`.\n- **Límites:** no dejes `defaults.update(override)` sobre el dict compartido.",
        instruction:
          "1. Observa el starter: `update` muta `defaults`.\n2. Construye `merged` sin mutar el base.\n3. Imprime merged y defaults.\n4. Verifica que defaults sigue con `retry: 1`.",
        hint: "{**defaults, **override} o defaults | override (3.9+)",
        hints: [
          "{**defaults, **override} o defaults | override (3.9+)",
          "Alternativa segura: `base = dict(defaults)` y luego `base.update(override)` (copia antes de mutar).",
        ],
        edgeCases: ["no pisar sin querer"],
        tests: "retry 5 timeout 30; defaults original intacto",
        feedback:
          "Precedencia documentada (override gana) + no mutar config compartida evita bugs fantasmas entre helpers. `defaults.update(override)` pisa el base para todos los callers.",
        retrospective:
          "Precedencia documentada + no mutar config compartida evita bugs fantasmas entre helpers. Puente a T2-B: sets y conflictos de dedup en el almacén.",
        starterCode: {
          language: 'python',
          title: "merge_config.py",
          code: `# Fusiona configs sin mutar defaults.
defaults = {'retry': 1, 'timeout': 30}
override = {'retry': 5}
defaults.update(override)
merged = defaults
print('merged', merged)
print('defaults intacto', defaults)`,
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
        title: "Emails únicos en lista ordenada",
        preamble:
          "- **Contexto:** cohorte de contactos sintéticos; el set deduplica, pero el print debe ser estable.\n- **Meta:** unicos como lista ordenada, no set crudo.\n- **Éxito:** `['a@ex.com', 'b@ex.com']` (una sola vez cada email).\n- **Límites:** no dependas del orden de inserción del set.",
        instruction:
          "1. El starter imprime un `set` sin orden garantizado.\n2. Usa `sorted(set(emails))`.\n3. Imprime solo esa lista.\n4. Verifica que el duplicado no aparece dos veces.",
        hint: "sorted(set(emails))",
        hints: [
          "sorted(set(emails))",
          "set no garantiza orden de impresión sin sorted.",
        ],
        edgeCases: ["orden determinista"],
        tests: "['a@ex.com', 'b@ex.com']",
        feedback:
          "Dedup con `set` + `sorted` da salida estable para demos y exports. Imprimir el set crudo hace fallar comparaciones de golden files entre corridas.",
        retrospective:
          "Dedup + `sorted` = demo reproducible. El mismo hábito se reutiliza en JSON `sort_keys` (T4-B). Siguiente: intersección y diferencia simétrica (E2).",
        starterCode: {
          language: 'python',
          title: "dedup_emails.py",
          code: `# Dedup de emails con salida ordenada.
emails = ['a@ex.com', 'b@ex.com', 'a@ex.com']
unicos = set(emails)
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
        title: "Intersección y diferencia simétrica de lotes",
        preamble:
          "- **Contexto:** dos lotes de emails de campaña sintética; necesitas «en ambos» y «solo en uno».\n- **Meta:** `a & b` y `a ^ b`, ambos ordenados.\n- **Éxito:** inter `b@…, c@…`; symdiff `a@…, d@…`.\n- **Límites:** no uses bucles O(n²) para membership; sets + `sorted`.",
        instruction:
          "1. Corrige operadores del starter (unión/diferencia no son intersección/symdiff).\n2. Imprime `inter` y `symdiff` con `sorted`.\n3. No reordenes a mano con `sort` in-place del set (no aplica).",
        hint: "a & b ; a ^ b",
        hints: [
          "a & b ; a ^ b",
          "sorted para determinismo.",
        ],
        edgeCases: ["cohortes"],
        tests: "inter b,c ; symdiff a,d",
        feedback:
          "Intersección (`&`) = cohorte compartida; diferencia simétrica (`^`) = exclusivo de un lado. Unión (`|`) y diferencia simple (`-`) no resuelven esas dos preguntas.",
        retrospective:
          "Intersección = cohorte compartida; symdiff = exclusivo de un lado. En el You Do, el set de ids apoya membership de cohorte; los conflictos de payload van en dicts (E3).",
        starterCode: {
          language: 'python',
          title: "set_inter.py",
          code: `# Intersección y diferencia simétrica de sets.
a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}
b = {'b@ex.com', 'c@ex.com', 'd@ex.com'}
print('inter', sorted(a | b))
print('symdiff', sorted(a - b))`,
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
        title: "dedup_report con unique y conflicts",
        preamble:
          "- **Contexto:** en CP-N1-B, dos filas con el mismo `id` y datos distintos deben **reportarse**, no silenciarse.\n- **Meta:** devolver `{unique, conflicts}` con política de payload.\n- **Éxito:** unique con primera vista de C001 y C002; un solo conflicto C001 `v:1` vs `v:9`; la fila idéntica no entra a conflicts.\n- **Límites:** no borres filas del reporte; no uses «último gana» sin traza.",
        instruction:
          "1. Cambia `seen` de set a dict id→fila.\n2. Si el id es nuevo, guarda en unique.\n3. Si ya existe y `seen[k] != r`, anexa a conflicts.\n4. Imprime el dict resultado del fixture del starter.",
        hint: "Usa un dict seen: si la clave ya existe y la fila difiere, anota conflicto.",
        hints: [
          "Usa un dict seen: si la clave ya existe y la fila difiere, anota conflicto.",
          "unique guarda la primera ocurrencia; filas idénticas no van a conflicts.",
        ],
        edgeCases: ["conflicto vs. duplicado idéntico"],
        tests: "1 conflict C001 (v distinto); idéntico no cuenta",
        feedback:
          "Patrón del You Do S06: `unique` + `conflicts`. Un set de ids solo no detecta choque de payload; necesitas guardar la fila vista y comparar. Idéntico ≠ conflicto de calidad.",
        retrospective:
          "Idéntico = ruido; distinto = conflicto de calidad. Este es el mismo contrato del You Do. Pregunta: ¿por qué un set de ids solo no basta para detectar choque de payload?",
        starterCode: {
          language: 'python',
          title: "dedup_report.py",
          code: `# Dedup que reporta conflictos de payload (idéntico ≠ conflicto).
def dedup_report(rows, key='id'):
    seen = set()
    unique = []
    for r in rows:
        k = r[key]
        if k not in seen:
            seen.add(k)
            unique.append(r)
    return {'unique': unique, 'conflicts': []}
rows = [
    {'id': 'C001', 'v': 1},
    {'id': 'C001', 'v': 1},  # idéntico: no es conflicto
    {'id': 'C002', 'v': 2},
    {'id': 'C001', 'v': 9},  # distinto: sí es conflicto
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
    {'id': 'C001', 'v': 1},  # idéntico: no es conflicto
    {'id': 'C002', 'v': 2},
    {'id': 'C001', 'v': 9},  # distinto: sí es conflicto
]
print(dedup_report(rows))`,
          output: `{'unique': [{'id': 'C001', 'v': 1}, {'id': 'C002', 'v': 2}], 'conflicts': [{'key': 'C001', 'kept': {'id': 'C001', 'v': 1}, 'other': {'id': 'C001', 'v': 9}}]}`,
        },
      },
      {
        id: "S06-T3-A-E1",
        subtopicId: "S06-T3-A",
        kind: "guided",
        title: "Contar contactos por cliente",
        preamble:
          "- **Contexto:** en el resumen del store CP-N1-B necesitas conteos por cliente, no volcar contactos crudos.\n- **Meta:** `len(c['contacts'])` por fila.\n- **Éxito:** `C001 → 2` y `C002 → 0` (lista vacía válida).\n- **Límites:** no imprimas la lista cruda; no inventes contactos.",
        instruction:
          "1. El starter imprime `c['contacts']` completo.\n2. Cambia a `len(...)`.\n3. Formato `id → n`.\n4. C002 con `[]` debe ser 0, no «faltante».",
        hint: "len(c['contacts'])",
        hints: [
          "len(c['contacts'])",
          "for c in clients",
        ],
        edgeCases: ["lista vacía de contactos"],
        tests: "C001 → 2 ; C002 → 0",
        feedback:
          "Conteo con `len` valida el grafo anidado. Imprimir la lista cruda no resume; lista vacía es shape OK con conteo 0, no un «cliente roto».",
        retrospective:
          "Lista vacía es shape OK con conteo 0. Validar presencia de la clave es otro problema (E3 shape). Siguiente: aplanar txs (E2).",
        starterCode: {
          language: 'python',
          title: "count_contacts.py",
          code: `# Cuenta contactos por cliente.
clients = [
    {'id': 'C001', 'contacts': [1, 2]},
    {'id': 'C002', 'contacts': []},
]
for c in clients:
    print(c['id'], '→', c['contacts'])`,
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
        title: "Aplanar txs con client_id",
        preamble:
          "- **Contexto:** para export tabular, cada tx necesita el id del cliente dueño.\n- **Meta:** filas densas `{client_id, tx_id, monto}` de **todas** las txs.\n- **Éxito:** lista de 3 filas (C001×1 + C002×2) como en la solución.\n- **Límites:** no te quedes solo con la primera tx de cada cliente.",
        instruction:
          "1. Detecta el bug: `c['txs'][0]` ignora el resto.\n2. Recorre cada tx de cada cliente (doble `for` o comprehension).\n3. Incluye `client_id` en cada fila.\n4. Imprime `flat` completo.",
        hint: "doble for o comprehension anidada",
        hints: [
          "doble for o comprehension anidada",
          "conserva client_id en cada fila",
        ],
        edgeCases: ["denormalización"],
        tests: "3 filas flat",
        feedback:
          "Shape listo para CSV en S08. Denormalizar `client_id` en cada fila conserva la relación; tomar solo `txs[0]` pierde ingresos en un resumen.",
        retrospective:
          "Denormalizar `client_id` es el puente a CSV en S08. El bug de «solo la primera tx» pierde ingresos en un resumen. Siguiente: shape inconsistente (E3).",
        starterCode: {
          language: 'python',
          title: "flatten_txs.py",
          code: `# Aplana todas las txs con client_id.
clients = [
    {'id': 'C001', 'txs': [{'id': 'T1', 'monto': 5}]},
    {'id': 'C002', 'txs': [{'id': 'T2', 'monto': 7}, {'id': 'T3', 'monto': 1}]},
]
flat = []
for c in clients:
    t = c['txs'][0]
    flat.append({'client_id': c['id'], 'tx_id': t['id'], 'monto': t['monto']})
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
        title: "Validar shape de txs (list o review)",
        preamble:
          "- **Contexto:** filas rotas llegan al almacén (falta una clave o aparece una cadena donde debía haber una lista).\n- **Meta:** marcar `ok` solo si `txs` es `list` (vacía permitida).\n- **Éxito:** `C001 ok`, `C002 review`, `C003 review`.\n- **Límites:** no uses `bool(txs)` (castiga la lista vacía legítima).",
        instruction:
          "1. El starter trata falsy como review.\n2. Usa `isinstance(c.get('txs'), list)`.\n3. Imprime `id` y status.\n4. Lista vacía = ok.",
        hint: "isinstance(c.get('txs'), list)",
        hints: [
          "isinstance(c.get('txs'), list)",
          "No asumas claves siempre presentes.",
        ],
        edgeCases: ["shape roto"],
        tests: "ok / review / review",
        feedback:
          "Validar shape en memoria evita basura silenciosa al exportar. `bool(txs)` manda a review la lista vacía legítima; `isinstance(..., list)` separa shape de contenido.",
        retrospective:
          "Estructura ≠ contenido: `[]` es válido; una clave ausente o una cadena no lo son. En T3-B el foco pasa de la forma de los datos a los campos opcionales ausentes.",
        starterCode: {
          language: 'python',
          title: "shape_check.py",
          code: `# Valida shape: txs debe ser list.
clients = [
    {'id': 'C001', 'txs': []},
    {'id': 'C002'},
    {'id': 'C003', 'txs': 'oops'},
]
for c in clients:
    txs = c.get('txs')
    ok = bool(txs)
    print(c['id'], 'ok' if ok else 'review')`,
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
        title: "get_nested seguro por ruta de claves",
        preamble:
          "- **Contexto:** `profile.phone` presente y `profile.email` ausente en un cliente sintético.\n- **Meta:** recorrer claves; si falta un nivel, devolver `default`.\n- **Éxito:** `999` y `N/A`.\n- **Límites:** no uses try/except como único diseño; chequea dict y pertenencia de clave.",
        instruction:
          "1. El starter hace `cur = cur[k]` sin guardas.\n2. Si no es dict o falta `k`, retorna `default`.\n3. Prueba phone y email con default.\n4. No hardcodees los resultados sin la función.",
        hint: "Recorre keys; si falta retorna default.",
        hints: [
          "Recorre keys; si falta retorna default.",
          "Chequea isinstance dict en cada nivel.",
        ],
        edgeCases: ["path incompleto"],
        tests: "999 y N/A",
        feedback:
          "Helper reutilizable del modelo anidado. Chequea `isinstance(cur, dict)` y pertenencia de clave; un try/except alrededor de todo el path oculta bugs de tipo.",
        retrospective:
          "El helper es reutilizable en el You Do. Un try/except alrededor de todo el path oculta bugs de tipo. Siguiente: missing de negocio en email (E2).",
        starterCode: {
          language: 'python',
          title: "get_nested.py",
          code: `# Acceso seguro por ruta de claves.
def get_nested(d, *keys, default=None):
    cur = d
    for k in keys:
        # completa: si cur no es dict o falta k, devuelve default
        cur = cur[k]
    return cur
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
        title: "Marcar email missing o present",
        preamble:
          "- **Contexto:** reporte de completitud de emails en un lote sintético.\n- **Meta:** missing solo si clave ausente o valor `None`.\n- **Éxito:** `C001: present`, `C002: missing`, `C003: missing`, `C004: present` (string vacío cuenta present).\n- **Límites:** no uses solo `if not c.get('email')` (trataría `''` como missing).",
        instruction:
          "1. Revisa la política del enunciado.\n2. Corrige la condición del starter.\n3. Imprime `id: flag` por cliente.\n4. No borres C004: su email `''` debe quedar present.",
        hint: "'email' not in c or c['email'] is None → missing",
        hints: [
          "'email' not in c or c['email'] is None → missing",
          "'' puede contarse present vacío según política; aquí '' = present.",
        ],
        edgeCases: ["None vs. ausente", "'' = present"],
        tests: "present/missing/missing/present",
        feedback:
          "Completitud mide ausencia real, no «falsy». `if not c.get('email')` trata `''` como missing y distorsiona tasas de calidad. Documenta la política; no la improvises en cada `if`.",
        retrospective:
          "Completitud mide ausencia real, no «falsy». La política se documenta; no se improvisa en cada `if`. E3 generaliza a varios falsy.",
        starterCode: {
          language: 'python',
          title: "mark_missing.py",
          code: `# Marca email missing vs present.
clients = [
    {'id': 'C001', 'email': 'a@ex.com'},
    {'id': 'C002', 'email': None},
    {'id': 'C003'},
    {'id': 'C004', 'email': ''},
]
for c in clients:
    if not c.get('email'):
        flag = 'missing'
    else:
        flag = 'present'
    print(f"{c['id']}: {flag}")`,
        },
        solutionCode: {
          language: 'python',
          title: "mark_missing.py",
          code: `clients = [
    {'id': 'C001', 'email': 'a@ex.com'},
    {'id': 'C002', 'email': None},
    {'id': 'C003'},
    {'id': 'C004', 'email': ''},
]
for c in clients:
    if 'email' not in c or c['email'] is None:
        flag = 'missing'
    else:
        flag = 'present'
    print(f"{c['id']}: {flag}")`,
          output: `C001: present
C002: missing
C003: missing
C004: present`,
        },
      },
      {
        id: "S06-T3-B-E3",
        subtopicId: "S06-T3-B",
        kind: "transfer",
        title: "Falsy no es lo mismo que missing",
        preamble:
          "- **Contexto:** montos `0`, strings vacíos y listas vacías son datos; solo `None` es missing en esta política.\n- **Meta:** imprimir para cada valor si es falsy y si es missing.\n- **Éxito:** solo `None` con `missing=True`; `''`, `0`, `[]` con `missing=False`.\n- **Límites:** no uses `not v` como definición de missing.",
        instruction:
          "1. Recorre `vals = [None, '', 0, []]`.\n2. Calcula falsy con `not bool(v)` (o equivalente).\n3. Missing solo con `v is None`.\n4. Imprime `repr(v)` y ambos flags.",
        hint: "bool(x) vs. x is None.",
        hints: [
          "bool(x) vs. x is None.",
          "0 y '' son falsy, pero pueden ser datos válidos.",
        ],
        edgeCases: ["falsy vs. missing"],
        tests: "solo None missing=True",
        feedback:
          "`if not value` es el bug silencioso de calidad: marca como missing montos 0, strings vacíos y listas vacías. Aquí solo `None` es missing; documenta la política del dominio.",
        retrospective:
          "`if not value` es el bug silencioso de calidad. Documenta la política del dominio (aquí None = missing). Puente a T4: ordenar y exportar con reglas explícitas.",
        starterCode: {
          language: 'python',
          title: "falsy_table.py",
          code: `# Distingue falsy de missing (None).
vals = [None, '', 0, []]
for v in vals:
    print(repr(v), 'falsy=', not bool(v), 'missing=', not v)`,
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
        title: "Ordenar txs por monto ascendente",
        preamble:
          "- **Contexto:** listar txs sintéticas de menor a mayor monto para un extracto.\n- **Meta:** `sorted` con `key` en `monto`.\n- **Éxito:** ids `['T1', 'T2']`.\n- **Límites:** no mutes con `.sort`; no ordenes por `id`.",
        instruction:
          "1. El starter usa `key` sobre `id`.\n2. Cambia el key a `monto`.\n3. Imprime la lista de ids ordenados.\n4. Deja `rows` original sin mutar.",
        hint: "key=lambda r: r['monto']",
        hints: [
          "key=lambda r: r['monto']",
          "sorted no muta la lista original.",
        ],
        edgeCases: ["monto numérico"],
        tests: "T1 luego T2",
        feedback:
          "El `key` extrae el criterio sin reescribir comparadores. Ordenar por `id` no responde al ranking por monto del extracto; `sorted` deja `rows` intacta.",
        retrospective:
          "El `key` extrae el criterio de ranking sin mutar `rows`. Confundir orden por `id` con orden por monto da extractos «correctos» de forma y erróneos de negocio. Siguiente: dos criterios a la vez (región, nombre).",
        starterCode: {
          language: 'python',
          title: "sort_monto.py",
          code: `# Ordena filas por monto con sorted+key.
rows = [{'id': 'T2', 'monto': 30}, {'id': 'T1', 'monto': 10}]
ordered = sorted(rows, key=lambda r: r['id'])
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
        title: "Orden multi-campo región y nombre",
        preamble:
          "- **Contexto:** ranking de clientes sintéticos para un reporte regional.\n- **Meta:** ordenar por región y, en empate, por nombre.\n- **Éxito:** tres líneas `Cusco Bob` / `Lima Ana` / `Lima Zed`.\n- **Límites:** un solo `sorted`; no ordenes dos veces a mano.",
        instruction:
          "1. El starter ordena solo por nombre.\n2. Usa una clave compuesta (tupla) región→nombre.\n3. Imprime `región nombre` por fila.\n4. No hardcodees el orden en prints fijos.",
        hint: "key=lambda r: (r['region'], r['nombre'])",
        hints: [
          "key=lambda r: (r['region'], r['nombre'])",
          "Tupla compara lexicográficamente.",
        ],
        edgeCases: ["multi-campo"],
        tests: "Cusco Bob; Lima Ana; Lima Zed",
        feedback:
          "Patrón de ranking estable multi-columna: la tupla en `key` compara de izquierda a derecha. Un solo `sorted` basta; no hace falta ordenar dos veces.",
        retrospective:
          "La tupla en `key` compara de izquierda a derecha. Es el mismo patrón del demo y del export por `id` en T4-B.",
        starterCode: {
          language: 'python',
          title: "sort_multi.py",
          code: `# Orden multi-clave: región y luego nombre.
rows = [
    {'nombre': 'Zed', 'region': 'Lima'},
    {'nombre': 'Ana', 'region': 'Lima'},
    {'nombre': 'Bob', 'region': 'Cusco'},
]
for r in sorted(rows, key=lambda r: r['nombre']):
    print(r['region'], r['nombre'])`,
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
        title: "list.sort retorna None; sorted no muta",
        preamble:
          "- **Contexto:** un helper «ordenó» la cola y devolvió `None` al código que lo llamó.\n- **Meta:** demostrar mutación in-place frente a una copia ordenada.\n- **Éxito:** `ret None`, `rows` ordenada, `base` intacta y `copy` ordenada.\n- **Límites:** no «arregles» omitiendo el experimento de `.sort` sobre `rows`.",
        instruction:
          "1. Deja `rows.sort()` y muestra su retorno.\n2. Para `base`, usa `sorted(base)` en la variable de copia.\n3. Imprime base y copy.\n4. Confirma que base sigue `[3,1,2]`.",
        hint: "x = lst.sort() → x is None",
        hints: [
          "x = lst.sort() → x is None",
          "sorted(base) no muta base.",
        ],
        edgeCases: ["in-place vs. sorted"],
        tests: "None + base intacta",
        feedback:
          "Asignar `x = lst.sort()` es un bug clásico: muta y devuelve `None`. Si compartes la lista con otro módulo, prefiere `sorted` o documenta la mutación in-place.",
        retrospective:
          "Asignar `x = lst.sort()` es un bug clásico en entrevistas técnicas y pipelines. Si compartes la lista con otro módulo, prefiere `sorted` o documenta la mutación. Puente a T4-B: elección de estructura y JSON estable.",
        starterCode: {
          language: 'python',
          title: "sort_inplace.py",
          code: `# Contrasta list.sort (None) vs sorted.
rows = [3, 1, 2]
base = [3, 1, 2]
ret = rows.sort()
print('ret', ret)
print('rows', rows)
copy_sorted = base.sort()
print('base', base, 'copy', copy_sorted)`,
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
        title: "Elegir list, dict o set por operación",
        preamble:
          "- **Contexto:** tres jobs del almacén en RAM con distinta carga.\n- **Meta:** asignar la estructura Python adecuada a cada job.\n- **Éxito:** cola → list; lookup id → dict; emails únicos → set.\n- **Límites:** una elección por línea; no inventes estructuras de terceros.",
        instruction:
          "1. El starter marca todo como `list`.\n2. Corrige cada job según el rol (orden, lookup, membership).\n3. Imprime `job → estructura`.\n4. No uses pandas/NumPy.",
        hint: "list / dict / set",
        hints: [
          "list / dict / set",
          "Una línea por job con la elección.",
        ],
        edgeCases: ["elección explícita"],
        tests: "list/dict/set",
        feedback:
          "Justificar la estructura es parte del rubric del You Do. Cola ordenada → list; lookup por id → dict; unicidad/membership → set. La «mejor» estructura depende de la pregunta.",
        retrospective:
          "Justificar la estructura es parte del rubric del You Do. La «mejor» estructura depende de la pregunta (orden vs lookup vs unicidad). Siguiente: JSON determinista (E2).",
        starterCode: {
          language: 'python',
          title: "choose_struct.py",
          code: `# Elige list, dict o set según la operación.
jobs = [
    'cola de llegada de filas',
    'lookup frecuente por id',
    'emails únicos de un lote',
]
for job in jobs:
    print(job, '→', 'list')`,
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
        title: "JSON determinista con ids y sort_keys",
        preamble:
          "- **Contexto:** el mismo payload de demo debe producir el mismo string en cada corrida.\n- **Meta:** ordenar `ids` y serializar con `sort_keys=True`.\n- **Éxito:** exactamente `{\"a\": 2, \"ids\": [\"C001\", \"C002\"], \"z\": 1}`.\n- **Límites:** `ensure_ascii=False`; un solo `print` del string.",
        instruction:
          "1. Ordena la lista `ids` del payload.\n2. Usa `json.dumps` con `sort_keys=True`.\n3. Imprime el string una vez.\n4. No dependas del orden de inserción de las claves del dict.",
        hint: "sorted ids; sort_keys=True",
        hints: [
          "sorted ids; sort_keys=True",
          "ensure_ascii=False para tildes si hubiera.",
        ],
        edgeCases: ["determinismo"],
        tests: "{\"a\": 2, \"ids\": [\"C001\", \"C002\"], \"z\": 1}",
        feedback:
          "Determinismo = confianza en tests y en el README del portafolio. Combina sort de colecciones **y** de claves JSON; sin ambos, el string cambia entre corridas.",
        retrospective:
          "Ordenar ids y `sort_keys` son dos ejes distintos. Pregunta de cierre: ¿qué pasa si ordenas ids pero omites `sort_keys`? Siguiente: costo de membership list vs set (E3).",
        starterCode: {
          language: 'python',
          title: "deterministic_json.py",
          code: `# Export JSON determinista (ids + sort_keys).
import json
payload = {'z': 1, 'a': 2, 'ids': ['C002', 'C001']}
s = json.dumps(payload, ensure_ascii=False)
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
        title: "Membership list vs set y costo de n búsquedas",
        preamble:
          "- **Contexto:** n búsquedas de un id en cohorte; list recorre, set hashea.\n- **Meta:** comprobar `in` en ambas y **derivar** costos `n*n` y `n` desde `len`.\n- **Éxito:** ambos `in` True; `costo_conceptual_list 25` y `costo_conceptual_set 5` con n=5.\n- **Límites:** no hardcodees 25/5 sin calcular desde `n`; no importes librerías de timing.",
        instruction:
          "1. Construye `ids_set` desde la lista.\n2. Imprime `in list` e `in set` para `'C003'`.\n3. `n = len(ids_list)`; imprime `n*n` y `n`.\n4. Mantén los labels del solution para comparar.",
        hint: "list ~ n por chequeo; set ~ 1 promedio; n búsquedas → n*n vs. n.",
        hints: [
          "list ~ n por chequeo; set ~ 1 promedio; n búsquedas → n*n vs. n.",
          "ids_set = set(ids_list); needle = 'C003'; n = len(ids_list)",
        ],
        edgeCases: ["complejidad derivada de n"],
        tests: "in list/set True + costo 25 y 5",
        feedback:
          "Indexar con set/dict **antes** de bucles anidados evita el O(n²) silencioso del modelo en RAM. Memoria extra a cambio de tiempo: deriva `n*n` y `n` desde `len`, no slogans fijos.",
        retrospective:
          "Indexar con set/dict **antes** de bucles anidados evita el O(n²) silencioso del modelo en RAM. Memoria extra a cambio de tiempo. Cierra T4 y prepara el You Do: componer list+dict+set con reglas de calidad.",
        starterCode: {
          language: 'python',
          title: "tradeoff.py",
          code: `# Membership en list vs set: deriva costos desde n (no slogans fijos).
ids_list = ['C001', 'C002', 'C003', 'C004', 'C005']
needle = 'C003'
print('in list', needle in ids_list)
# Completa: ids_set, in set, n = len(...), costos n*n y n`,
        },
        solutionCode: {
          language: 'python',
          title: "tradeoff.py",
          code: `ids_list = ['C001', 'C002', 'C003', 'C004', 'C005']
ids_set = set(ids_list)
needle = 'C003'
# Misma pregunta, distinta estructura: list recorre; set hashea.
print('in list', needle in ids_list)
print('in set', needle in ids_set)
# En un loop de n búsquedas: list ~ n*n chequeos; set ~ n chequeos.
n = len(ids_list)
print('costo_conceptual_list', n * n)
print('costo_conceptual_set', n)`,
          output: `in list True
in set True
costo_conceptual_list 25
costo_conceptual_set 5`,
        },
      },
    ],
  },
  youDo: {
    title: "Modelo tabular en memoria (CP-N1-B)",
    context:
      "Inicias el capstone **CP-N1-B**: representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). La deduplicación por clave de negocio **reporta conflictos** (payload idéntico no es conflicto; payload distinto sí); aplanas las txs y exportas un JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos. **Éxito de corrida:** `python memory_model.py` imprime flat, JSON estable y un `dedup_report` con al menos un conflicto en el fixture de `main`, sin dejar `NotImplementedError`.",
    objectives: [
      "Representar cliente/contacto/tx en list[dict] documentado",
      "Implementar dedup_report → unique + conflicts (idéntico ≠ conflicto)",
      "Aplanar transacciones con client_id",
      "Acceder de forma segura a faltantes (get_nested)",
      "Export determinista (sorted + sort_keys)",
    ],
    requirements: [
      "Tipos list[dict] o índices dict documentados",
      "dedup_report(rows, key_fn) sin borrar conflictos; payload idéntico no entra a conflicts",
      "sorted determinista en exports",
      "Datos sintéticos LATAM (example.com)",
      "Sin importar NumPy ni pandas en esta entrega",
      "Corrida: python memory_model.py imprime flat, JSON estable y dedup_report con conflicto demo",
    ],
    starterCode: `"""memory_model.py — Modelo tabular en memoria (CP-N1-B / S06)
Clientes + contactos + transacciones en estructuras Python puras.
Sin NumPy/pandas. Datos sintéticos LATAM únicamente.
"""

from __future__ import annotations

import json
from typing import Any, Callable


def dedup_report(rows: list[dict], key_fn: Callable[[dict], Any]) -> dict:
    """Devuelve {unique, conflicts} sin borrar traza de conflictos."""
    # Implementa según el docstring (no dejes NotImplementedError).
    raise NotImplementedError


def flatten_txs(clients: list[dict]) -> list[dict]:
    """Aplana txs anidadas a filas con client_id."""
    # Implementa según el docstring (no dejes NotImplementedError).
    raise NotImplementedError


def get_nested(d: dict, *keys: str, default=None):
    """Acceso seguro por ruta de claves; si falta un nivel, devuelve default."""
    # Implementa según el docstring (no dejes NotImplementedError).
    raise NotImplementedError


def export_deterministic(clients: list[dict]) -> str:
    """JSON estable: sort por id + sort_keys."""
    # Implementa según el docstring (no dejes NotImplementedError).
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
    print("phone C002", get_nested(store[1], "contacts", default=[]))
    print("missing path", get_nested(store[0], "profile", "phone", default="MISSING"))
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
      "En el README muestra el shape del store, un ejemplo de conflicto de dedup y el JSON determinista de demo. Eso evidencia el modelo en memoria de CP-N1-B.",
    rubric: [
      { criterion: "Modelo completo cliente/contacto/tx", weight: "25%" },
      { criterion: "Dedup sin borrar conflictos", weight: "25%" },
      { criterion: "Determinismo de salida", weight: "20%" },
      { criterion: "Acceso seguro a faltantes", weight: "15%" },
      { criterion: "Elección de estructuras justificada", weight: "15%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un print o assert (unique vs conflicts, JSON idéntico en dos dumps)? (2) ¿qué harías distinto con datos reales vs sintéticos (PII, volúmenes)? (3) En el README, una frase de impacto medible (p. ej. «mismo input → mismo JSON; conflictos de id no se silencian») que puedas defender en 30 segundos ante un reclutador. Si mutas copias del store, ¿shallow o deep — y por qué?",
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
        question: "`b = a` (listas) y mutas `b.append(1)`. ¿Qué pasa con `a`?",
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
      {
        question: "Si haces `copia = rows.copy()` donde `rows` es `list[dict]` y mutas `copia[0]['tags']`, ¿el original queda aislado?",
        options: ["Sí: copy() hace deepcopy automático", "Solo si usas tuple", "Se lanza TypeError", "No: la copia es superficial; los dicts internos se comparten"],
        correctIndex: 3,
        explanation:
          "list.copy() es shallow: las filas-dict siguen siendo los mismos objetos. Usa deepcopy o reconstruye por fila si mutas anidados.",
      },
      {
        question: "Para membership masivo de emails en un lote (¿está este email en la cohorte?), la estructura más adecuada es…",
        options: ["set de emails", "list de strings y `in` en un loop", "tuple de emails", "solo json.dumps"],
        correctIndex: 0,
        explanation:
          "set/dict dan membership O(1) promedio; list es O(n) por chequeo y escala mal en bucles anidados.",
      },
      {
        question: "Si falta la clave `\"x\"` en el dict `d`, ¿qué diferencia hay entre `d.get(\"x\", \"N/A\")` y `d[\"x\"]`?",
        options: ["Ambos lanzan KeyError", "get lanza KeyError; d[\"x\"] devuelve None", "get devuelve \"N/A\"; d[\"x\"] lanza KeyError", "Ambos devuelven None siempre"],
        correctIndex: 2,
        explanation:
          "get con default evita KeyError en campos opcionales; el acceso duro exige que la clave exista.",
      },
      {
        question: "Al aplanar txs anidadas a filas densas para export, ¿qué debe incluir cada fila plana?",
        options: ["Solo el monto, sin id de cliente", "client_id (denormalizado) junto a tx_id y monto", "El dict cliente completo embebido en cada tx", "Un set de ids sin montos"],
        correctIndex: 1,
        explanation:
          "Denormalizar client_id en cada fila plana permite CSV/joins en S08 sin perder la relación cliente→tx.",
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
        note: "alias vs. shallow vs. deep",
      },
      {
        label: "json — JSON encoder/decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "sort_keys, ensure_ascii",
      },
      {
        label: "TimeComplexity (Python Wiki)",
        url: "https://wiki.python.org/moin/TimeComplexity",
        note: "Costo de list/dict/set",
      },
      {
        label: "Python for Everybody — lists/dicts",
        url: "https://www.py4e.com/html3/08-lists",
        note: "Progressive disclosure de colecciones",
      },
      {
        label: "sorted — key parameter",
        url: "https://docs.python.org/3/howto/sorting.html",
        note: "Orden estable y multi-key",
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
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Estructuras y aliasing",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Listas y diccionarios",
      },
      {
        label: "Kaggle Learn — Python",
        url: "https://www.kaggle.com/learn/python",
        note: "Micro-práctica de collections",
      },
    ],
  },
}
