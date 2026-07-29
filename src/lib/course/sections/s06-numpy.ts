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
    "Antes de guardar un lote en CSV o enviarlo a una base de datos, tu programa necesita una mesa de clasificación en memoria: conservar el orden de llegada, localizar clientes por ID, detectar repeticiones y dejar constancia de los desacuerdos. Aquí conviertes tus listas y funciones en ese pequeño almacén confiable. Es una habilidad cotidiana en onboarding (el alta y verificación de un nuevo cliente), logística, comercio y control de calidad: elegir la colección correcta evita datos perdidos, búsquedas lentas y resultados que cambian sin explicación.",
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
        "Imagina un centro internacional de ayuda que recibe fichas sintéticas de envíos. Tres preguntas aparecen antes de abrir un archivo: «¿en qué orden llegaron?», «¿dónde está la ficha C002?» y «¿ya vimos este ID?». Una secuencia conserva el orden; un `dict` actúa como índice; un `set` responde pertenencia. Esas estructuras no compiten: cada una resuelve una pregunta distinta.",
        "En S04 aprendiste a recorrer datos y en S05 a encerrar reglas en funciones. Ahora compones ambas destrezas en un modelo tabular en memoria: clientes con contactos y transacciones, una tabla de acceso por ID y un registro separado de conflictos. Piensa en él como una mesa de clasificación temporal, no como una base de datos diminuta ni como una colección de trucos aislados.",
        "La ruta sigue la vida de una fila. T1 conserva ventanas y evita copias accidentales; T2 permite buscar y deduplicar sin borrar evidencia; T3 representa relaciones y distingue ausencia de vacío; T4 ordena y serializa de forma reproducible. Antes de cada ejemplo, predice qué propiedad debe sobrevivir: orden, identidad, relación o igualdad de la salida.",
        "Trabajarás solo con la biblioteca estándar y datos sintéticos (`example.com`, IDs `C00x`). El objetivo de CP-N1-B es poder explicar por qué elegiste cada estructura y demostrar sus límites con una salida observable. En S08 conectarás este modelo a CSV y JSON. Por ahora, una buena decisión en memoria vale más que una biblioteca potente usada sin criterio.",
      ],
      callout: {
        type: "info",
        title: "Alcance de S06",
        content:
          "Trabajas con list, tuple, dict, set, copy y json de la biblioteca estándar. El objetivo es construir y justificar un modelo tabular en memoria con datos sintéticos; nunca uses información personal real.",
      },
    },
    {
      heading: "Listas, tuplas y slicing",
      subtopicId: "S06-T1-A",
      paragraphs: [
        "Una secuencia se parece a una fila de vagones: la posición forma parte del significado. Una `list` permite añadir o retirar vagones, por eso sirve para una cola de registros que crece. Una `tuple` conserva un trayecto fijo; úsala para headers o claves que varios helpers deben leer sin modificarlas. La pregunta práctica no es «¿cuál es mejor?», sino «¿debe cambiar este contenedor?».",
        "Un slice es una ventana sobre esa fila, no una operación sobre cada elemento. `txs[-3:]` crea una lista nueva con las tres últimas transacciones y deja intacta la original. Predice los bordes antes de ejecutar: una lista vacía produce `[]`; `n == 0` necesita tratamiento explícito porque `rows[-0:]` equivale a copiar todo; y `n < 0` contradice el contrato de «últimas N».",
        "Buscar con `x in una_lista` obliga a avanzar hasta encontrar el valor o llegar al final: costo O(n). Para una comprobación ocasional es una decisión sencilla y legible. Repetirla miles de veces dentro de otro bucle transforma esa sencillez en trabajo cuadrático; T2 mostrará cómo un `set` o un `dict` cambia la pregunta de «recorrer» a «consultar un índice».",
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
          "Para obtener los últimos N registros usa slicing negativo. Reserva el bucle para cuando también necesites filtrar o transformar cada fila.",
      },
    },
    {
      heading: "Unpacking, aliasing y copia",
      subtopicId: "S06-T1-B",
      paragraphs: [
        "El desempaquetado convierte la posición en nombres: `id_cliente, region, monto = fila` documenta el shape (la forma de la fila: qué tipo de dato va en cada posición) mejor que tres índices sueltos. Si sobran o faltan valores, Python detiene la operación con `ValueError`. Ese fallo temprano es una alarma útil: impide que una región termine silenciosamente en la variable del monto. `head, *rest = fila` sirve cuando solo la primera columna es fija y el resto puede variar.",
        "Una asignación no fotocopia el objeto; solo añade otra etiqueta. Si dos etiquetas de equipaje apuntan a la misma maleta, abrirla mediante cualquiera revela el mismo contenido. Así funciona `b = a`: `a` y `b` son nombres del mismo contenedor. El error del principiante es interpretar dos variables como dos historias independientes y descubrir la mutación mucho después.",
        "La copia superficial crea un contenedor exterior nuevo, pero conserva referencias a los objetos interiores. Basta si solo reordenas filas; no basta si modificarás `tags`, contactos u otros campos anidados. `deepcopy` separa todo el grafo, aunque consume más memoria y puede ocultar una arquitectura demasiado mutable. Decide el nivel de aislamiento antes de mutar y prueba la identidad que esperas conservar.",
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
          "Una copia superficial de una lista de diccionarios aún comparte las filas internas. Si modificarás campos anidados, reconstruye esas filas o usa deepcopy con una razón explícita.",
      },
    },
    {
      heading: "Diccionarios y pertenencia",
      subtopicId: "S06-T2-A",
      paragraphs: [
        "Una lista responde «¿qué llegó primero?»; un diccionario responde «¿qué registro corresponde a esta clave?». Piensa en el catálogo de una biblioteca: nadie recorre todos los estantes para localizar un código conocido. `{c['id']: c for c in filas}` construye ese catálogo con acceso O(1) promedio. Pero hay una frontera peligrosa: si el ID se repite, la última fila reemplaza a la anterior sin ceremonia. Detecta el conflicto antes de indexar.",
        "`d[k]` expresa un invariante: la clave debe existir, y un `KeyError` denuncia que el programa rompió esa promesa. `d.get(k, default)` expresa una ausencia esperada. No los uses como sinónimos. Además, `k in d` pregunta por claves, no por calidad: `\"email\" in cliente` confirma que el casillero existe; no confirma que contenga una dirección válida.",
        "Al fusionar configuraciones, la precedencia es una regla de negocio disfrazada de sintaxis. `{**base, **override}` dice que el override gana y conserva intacto el original. `base.update(override)` puede ser correcto si la mutación es deliberada y local; sobre un diccionario compartido produce fallos distantes. Antes del merge, formula la pregunta que un test debe responder: ¿qué valor gana y qué objeto debe permanecer sin cambios?",
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
          "Conserva la lista cuando importe el orden de llegada y añade un diccionario cuando necesites localizar filas por ID. Un mismo modelo puede necesitar ambas vistas.",
      },
    },
    {
      heading: "Deduplicación y operaciones de set",
      subtopicId: "S06-T2-B",
      paragraphs: [
        "Un `set` se parece a una lista de invitados que solo responde pertenencia: un nombre está o no está, sin posición ni payload asociado. Por eso resuelve unión, intersección y diferencia de cohortes con claridad. Sus elementos deben ser hashables (que pueden usarse como claves de un `dict` o miembros de un `set`, como strings o enteros); las listas y diccionarios mutables no pueden convertirse directamente en miembros.",
        "La deduplicación de negocio exige una segunda pregunta: «¿la fila repetida cuenta la misma historia?». Dos copias idénticas pueden tratarse como ruido; el mismo ID con otra región o email es un conflicto. Un set de IDs detecta la repetición, pero no conserva suficiente evidencia para compararla. El patrón `unique + conflicts` guarda la primera vista y registra cualquier desacuerdo en vez de decretar en silencio que «la última gana».",
        "Los sets tampoco prometen un orden apto para un informe. Ordena sus elementos al mostrar o serializar: el propósito no es embellecer la salida, sino hacerla reproducible. Si el mismo lote genera distinto texto en dos corridas, un diff no puede distinguir un cambio real de una casualidad de orden. Predice qué información perderías si redujeras todo el registro a `set(ids)`.",
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
          "Un ID repetido con el mismo payload puede ser ruido. El mismo ID con datos distintos es un conflicto que debes conservar y explicar.",
      },
    },
    {
      heading: "Estructuras anidadas y recorridos",
      subtopicId: "S06-T3-A",
      paragraphs: [
        "Un cliente no es una fila aislada: posee contactos y transacciones. Una estructura anidada representa esa relación como un árbol pequeño: el diccionario del cliente es el tronco y sus listas son ramas. El doble `for` no es complejidad accidental; sigue una arista real, cliente → transacción. Mientras el shape esté documentado, `list[dict]` basta para razonar sin introducir clases antes de necesitarlas.",
        "Aplanar cambia la vista, no la verdad. Para producir una fila por transacción repites `client_id` junto a `tx_id` y `monto`; esa repetición deliberada conserva el vínculo cuando desaparece el árbol. Si omites `client_id`, obtienes montos huérfanos. Antes de exportar, cuenta contactos y transacciones: los totales son una prueba sencilla de que el recorrido no perdió ramas.",
        "Forma y contenido son problemas diferentes. `txs: []` tiene la forma correcta y expresa cero transacciones; una clave ausente o `txs: 'oops'` rompe el contrato. `bool(txs)` mezcla ambos problemas porque una lista vacía es falsy. `isinstance(txs, list)` pregunta por el shape que realmente necesitas y permite enviar solo las filas estructuralmente inválidas a revisión.",
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
          "Una lista plana de diccionarios es el puente natural hacia CSV. Conserva el ID del cliente en cada fila aplanada para no perder la relación.",
      },
    },
    {
      heading: "Acceso seguro y valores faltantes",
      subtopicId: "S06-T3-B",
      paragraphs: [
        "En un formulario internacional, «la página no llegó» y «la casilla llegó vacía» exigen respuestas distintas. Lo mismo ocurre en un diccionario anidado: puede faltar `profile`, faltar `phone` dentro del perfil o existir `phone` con valor vacío. Acceder con corchetes a cada nivel presupone que toda la ruta existe; un helper `dig` convierte esa suposición en una política visible.",
        "Los valores falsy no significan automáticamente ausencia. `0` puede ser un monto legítimo; `''` puede ser un campo presente pero inválido; `[]` puede representar una colección válida sin elementos. Si usas `if not valor` para todo, borras esas distinciones y distorsionas el reporte. Decide primero qué significa missing en el dominio y después escribe la condición.",
        "`get_nested` recorre la ruta nivel por nivel. Si falta una clave o aparece un objeto que ya no es diccionario, devuelve el sentinel acordado; si la clave existe con `None`, conserva `None`. Esa diferencia permite que la capa siguiente decida si rechaza, completa o acepta. Centralizarla evita veinte variantes de `try/except` y concentra los tests de borde en un solo contrato.",
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
          "No uses una prueba de falsedad como definición universal de ausencia. Cero, cadena vacía y lista vacía pueden ser datos válidos según el contrato.",
      },
    },
    {
      heading: "Ordenamiento y key",
      subtopicId: "S06-T4-A",
      paragraphs: [
        "Un tablero de salidas ordena vuelos sin alterar los registros que recibió. `sorted(seq, key=fn)` hace esa vista nueva; `list.sort(key=fn)` reorganiza la lista compartida y devuelve `None`. Ambos pueden ser correctos, pero responden a contratos distintos. El bug aparece al escribir `ordenadas = filas.sort(...)`: el original cambia y `ordenadas` queda sin lista.",
        "La función `key` traduce una fila a su criterio de comparación. Una tupla como `(region, nombre)` se compara de izquierda a derecha: primero región y, solo en empate, nombre. El orden es estable, de modo que dos filas con la misma clave conservan su orden relativo previo. Esa propiedad permite encadenar decisiones sin inventar comparadores manuales.",
        "Ordenar no corrige tipos. Los strings `'100'` y `'20'` se comparan carácter por carácter, por lo que `'100'` aparece antes que `'20'`. Normaliza el monto en S05 y ordena después; hacerlo al revés produce un ranking sintácticamente válido y semánticamente falso. Antes de confiar en un top, prueba un valor que revele la diferencia entre orden numérico y lexicográfico.",
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
          "Ordena filas por una clave de negocio y las claves del JSON al serializar. Así, la misma entrada produce una salida comparable.",
      },
    },
    {
      heading: "Estructura adecuada, complejidad y determinismo",
      subtopicId: "S06-T4-B",
      paragraphs: [
        "Elegir una colección es elegir qué pregunta será barata y clara. Una `list` favorece secuencia y append; un `dict`, búsqueda por clave; un `set`, pertenencia y operaciones de cohorte; una `tuple`, un contrato posicional fijo. Ninguna es «la estructura profesional» en abstracto. Defiende la elección nombrando la operación dominante y la propiedad que no puedes perder.",
        "Esa elección intercambia tiempo, memoria y legibilidad. Buscar n elementos dentro de una lista de n puede exigir n×n comparaciones; construir un set cuesta memoria adicional, pero reduce las consultas posteriores a O(1) promedio. Preindexar no siempre conviene para cinco filas y una sola búsqueda. Conviene cuando el número de consultas justifica el costo y cuando no necesitas conservar duplicados en ese índice.",
        "El cierre del modelo es una salida determinista: ordenas clientes por ID y serializas con `sort_keys=True`. El objetivo no es fingir que los diccionarios son aleatorios, sino fijar un contrato canónico para tests, hashes y revisiones. Ejecuta dos veces con la misma entrada y exige igualdad exacta; después cambia una fila y comprueba que el diff señale el cambio de negocio, no ruido de presentación.",
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
          "Resuelve esta entrega con list, dict, set, copy y json. Las bibliotecas tabulares llegan después de que puedas justificar el modelo básico.",
      },
    },
  ],
  iDo: {
    intro: "En estas ocho demostraciones no persigas la sintaxis línea por línea. Sigue un ciclo más útil: predice una salida, localiza la operación que la causa, ejecuta y explica qué propiedad quedó intacta. La demostración termina cuando puedes modificar una condición y anticipar el efecto sin volver a mirar el resultado.",
    steps: [
      {
        demoId: "S06-T1-A-DEMO",
        subtopicId: "S06-T1-A",
        environment: "browser-pyodide",
        description: "Ventana de últimas txs con slicing y contrato de keys (tuple)",
        preamble:
          "Un centro de despacho quiere las tres operaciones más recientes sin alterar la cola original. Antes de ejecutar, anota qué IDs esperas ver y cuál debería ser el tamaño de `txs` después. Sigue tres decisiones: el guard para `n`, el slice que crea la ventana y la tupla que fija las columnas. Luego pregunta qué ocurriría con `n = 0` y con `n = -1`.",
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
        why: "El slice separa selección de transformación: primero elige las últimas filas y después proyecta sus campos. Como crea otra lista, la cola original conserva orden y tamaño. La tupla convierte los headers en un contrato que un helper no puede ampliar con `append`. `len(projected)` verifica el límite visible; comparar `len(txs)` antes y después verificaría la no mutación.",
        retrospective:
          "Explica la salida sin decir solo «porque funciona el slice»: ¿desde qué posición comienza `-3`, por qué el resultado sigue siendo lista y qué objeto permanece sin cambios? Después cambia mentalmente `keys` a lista. El programa aún corre, pero ¿qué riesgo de mantenimiento reaparece? Esa diferencia entre ejecución correcta y contrato resistente guiará T1-A.",
      },
      {
        demoId: "S06-T1-B-DEMO",
        subtopicId: "S06-T1-B",
        environment: "browser-pyodide",
        description: "Bug de alias al 'copiar' lista de dicts de clientes",
        preamble:
          "Tres equipos creen trabajar con copias del mismo lote. Antes de ejecutar, dibuja flechas desde `clientes`, `mal`, `bien_shallow` y `deep` hacia los objetos que imaginas en memoria. Predice los tres prints. La meta no es memorizar nombres de copia, sino relacionar cada mutación observable con las referencias que todavía comparten identidad.",
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
        why: "`mal = clientes` crea otro nombre para la misma lista, así que escribir mediante `mal` modifica la única fila existente. `[dict(c) for c in rows]` crea diccionarios exteriores nuevos y aísla campos planos como `score`. Si una fila contuviera `tags: []`, esa lista interior seguiría compartida; allí necesitas reconstruir el campo o usar `deepcopy`.",
        retrospective:
          "Vuelve a tu dibujo y señala qué flecha explica cada número impreso. Luego añade mentalmente `tags: ['vip']` a C002 y modifica `bien_shallow[1]['tags']`. ¿Cambiaría el original? Si la respuesta es sí, has encontrado el límite de la copia por fila. En T1-B deberás justificar el nivel de aislamiento, no escoger `deepcopy` por reflejo.",
      },
      {
        demoId: "S06-T2-A-DEMO",
        subtopicId: "S06-T2-A",
        environment: "browser-pyodide",
        description: "Índice id→cliente y lookup seguro",
        preamble:
          "Un operador consulta cientos de veces clientes por ID. Predice qué estructura evita recorrer la lista en cada consulta y qué debería ocurrir con C999. Durante la demo distingue dos responsabilidades: `build_index` prepara el acceso rápido; `lookup_nombre` decide la política de ausencia. `sorted(idx)` solo ordena el informe, no el diccionario para buscar.",
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
        why: "La comprensión transforma la lista en un mapa ID → fila, pagando una pasada inicial para abaratar consultas repetidas. El primer `get` cubre un ID ausente con `{}` y el segundo cubre un nombre opcional con el default. Esa tolerancia es correcta solo porque la función promete una respuesta de presentación; una etapa que exige todos los IDs debería usar acceso duro y fallar.",
        retrospective:
          "Compara dos contratos: «si no existe, muestra N/A» y «si no existe, detén el pipeline». El mismo diccionario sirve para ambos, pero no la misma forma de acceso. ¿Qué prueba escribirías para evitar que un typo como C020 se convierta silenciosamente en N/A? En T2-A practicarás cuándo la ausencia es dato y cuándo es defecto.",
      },
      {
        demoId: "S06-T2-B-DEMO",
        subtopicId: "S06-T2-B",
        environment: "browser-pyodide",
        description: "ids únicos; intersección de lotes; conflictos = mismo id datos distintos",
        preamble:
          "El lote contiene tres apariciones de C001, pero solo una contradicción. Antes de ejecutar, clasifica cada repetición como «idéntica» o «conflictiva» y predice `n_conflicts`. Después observa que el set resuelve otra pregunta —quién pertenece a ambas cohortes— mientras el diccionario `seen` conserva el payload necesario para comparar historias.",
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
print("conflict email pair:", conflicts[0]["a"]["email"], "vs.", conflicts[0]["b"]["email"])
lote1, lote2 = {"C001", "C002"}, {"C002", "C003"}
print("intersección lotes:", sorted(lote1 & lote2))`,
          output: `unique ids: ['C001', 'C002']
n_conflicts: 1
conflict email pair: a@ex.com vs. otro@ex.com
intersección lotes: ['C002']`,
        },
        why: "`seen` guarda la primera evidencia asociada a cada ID. Una fila idéntica no añade información; una distinta se conserva junto a la primera para revisión. Si usáramos solo `set(ids)`, sabríamos que C001 se repitió, pero no cuál campo discrepó. Separar `unique` de `conflicts` permite continuar el proceso sin fingir que la contradicción desapareció.",
        retrospective:
          "Defiende la política de conservar la primera fila: ¿qué evidencia cambia si conservas la última? Ninguna política es neutral si no registras ambas versiones. Añade mentalmente una tercera fila distinta de C001: ¿esperas uno o dos conflictos y por qué? En T2-B usarás sets para pertenencia y diccionarios para explicar desacuerdos.",
      },
      {
        demoId: "S06-T3-A-DEMO",
        subtopicId: "S06-T3-A",
        environment: "browser-pyodide",
        description: "Modelo en memoria Client con contacts[] y txs[]",
        preamble:
          "Un cliente contiene dos contactos y dos transacciones. Antes de ejecutar, predice el conteo, el total y cuántas filas aparecerán al aplanar. Sigue el recorrido como un árbol: primero el cliente, luego cada transacción. Observa qué dato debe repetirse en cada fila plana para que el vínculo sobreviva cuando desaparezca la estructura anidada.",
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
        why: "`summarize_client` reduce las ramas a métricas del cliente; `flatten_store` produce una fila por transacción. Son vistas del mismo almacén, no copias equivalentes: el resumen pierde detalle a propósito y la vista plana repite `client_id` para conservar la relación. El doble `for` refleja exactamente las dos aristas que recorre.",
        retrospective:
          "Comprueba una conservación: la suma de montos del árbol debe coincidir con la suma de la lista plana. ¿Qué assert detectaría que olvidaste la segunda transacción? Luego imagina que una fila plana no incluye `client_id`: el monto existe, pero su dueño se perdió. En T3-A usarás conteos y shapes para demostrar que el recorrido conserva relaciones.",
      },
      {
        demoId: "S06-T3-B-DEMO",
        subtopicId: "S06-T3-B",
        environment: "browser-pyodide",
        description: "Extraer teléfono opcional de contacto anidado",
        preamble:
          "Cuatro fichas parecen carecer de teléfono por razones distintas. Antes de ejecutar, clasifica C001–C004 como valor, ruta ausente o campo vacío. Sigue `cur` en cada nivel de `dig`: la función devuelve el default cuando no puede continuar, pero conserva `''` cuando la clave existe. Esa distinción es la materia prima del reporte de calidad.",
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
        why: "`dig` separa navegación de interpretación. Navega hasta encontrar una ruta rota y devuelve un sentinel; después, la clasificación decide si el valor es missing, empty u ok. Si usáramos `if not phone`, tanto el sentinel mal elegido como `''` podrían caer en la misma rama. La política explícita evita esa pérdida de información.",
        retrospective:
          "Explica por qué C002 y C004 reciben la misma etiqueta aunque su estructura difiera, y por qué C003 no debe acompañarlos. Después sustituye `phone: ''` por `phone: None`: ¿tu política lo llamaría vacío, ausente o inválido? No hay respuesta universal; en T3-B deberás declarar el contrato antes de escribir la condición.",
      },
      {
        demoId: "S06-T4-A-DEMO",
        subtopicId: "S06-T4-A",
        environment: "browser-pyodide",
        description: "Ordenar clientes por región luego nombre",
        preamble:
          "Un informe regional debe mostrar primero la región y resolver empates por nombre. Antes de ejecutar, escribe el orden esperado de los tres IDs. Luego predice dos hechos distintos: el valor de retorno de `sort_ids_inplace` y el estado final de `mutated`. La demo contrasta una vista ordenada con una mutación deliberada.",
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
        why: "La tupla de la `key` se compara de izquierda a derecha, de modo que nombre solo decide cuando región empata. `sorted` materializa otra lista y conserva la entrada; `.sort()` reorganiza el objeto recibido y devuelve `None` para recordar que su efecto está en el contenedor. Confundir retorno con efecto produce una variable vacía y una entrada alterada.",
        retrospective:
          "Señala qué líneas prueban cada contrato: una muestra el orden de la vista; otra, el retorno `None`; otra, la mutación. Si dos clientes compartieran región y nombre, la estabilidad conservaría su orden previo. ¿Cuándo sería preferible mutar con `.sort()`? En T4-A tendrás que justificar esa decisión según quién más comparte la lista.",
      },
      {
        demoId: "S06-T4-B-DEMO",
        subtopicId: "S06-T4-B",
        environment: "browser-pyodide",
        description: "Mismo input → mismo JSON dump con sort_keys",
        preamble:
          "Un auditor compara dos ejecuciones del mismo lote y espera el mismo texto byte por byte. Antes de ejecutar, distingue los dos órdenes que debes controlar: el de la lista `clients` y el de las claves de cada diccionario. Predice `a == b`; luego identifica qué parte del código protege cada eje de determinismo.",
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
        why: "`sorted(..., key=id)` fija el orden de las filas; `sort_keys=True` fija el de las claves al serializar. Resolver solo uno deja ruido posible en el otro. La igualdad de dos dumps es una comprobación mínima; un test más fuerte construiría entradas equivalentes con distinto orden inicial y exigiría el mismo JSON canónico.",
        retrospective:
          "Cambia mentalmente el orden inicial de `clients`: la salida debe permanecer igual. Ahora cambia la región de C001: la salida debe diferir. Esa pareja de pruebas distingue determinismo de inmovilidad; el programa no oculta cambios reales, solo elimina ruido de representación. En T4-B conectarás esta propiedad con elección de estructura y costo.",
      },
    ],
  },
  weDo: {
    intro: "Cada trío reduce el apoyo de manera deliberada. En E1 localiza el defecto con una pista; en E2 elige la operación sin que el starter la nombre; en E3 transfiere la idea a un borde o tradeoff. Antes de abrir la solución, escribe una predicción y una razón. Después compara no solo la salida, sino también qué propiedad preserva tu código.",
    steps: [
      {
        subtopicId: "S06-T1-A",
        kind: "guided",
        title: "Últimos 2 montos con slicing negativo",
        preamble:
          "- **Contexto:** en el mini almacén de txs sintéticas, el reporte «últimos movimientos» usa ventanas, no reescritura a mano.\n- **Meta:** practicar slicing negativo y el caso lista vacía.\n- **Éxito:** con `txs = [10,20,30,40,50]` imprimes `[40, 50]` y `2`; con lista vacía, `[]` y `0`.\n- **Límites:** solo biblioteca estándar; no mutes `txs`; no uses bucles para la ventana.",
        id: "S06-T1-A-E1",
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
          "Antes de mirar la solución, explica por qué `[-2]` devuelve un valor y `[-2:]` devuelve una lista. Luego predice qué ocurre con una entrada de un solo elemento y con `[]`. Si tu explicación depende de «Python lo permite», vuelve al modelo de ventana: el slice conserva el tipo de secuencia y tolera una ventana más grande que los datos disponibles.",
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
        subtopicId: "S06-T1-A",
        kind: "independent",
        title: "Headers a tuple y extensión sin mutar",
        preamble:
          "- **Contexto:** el esquema de columnas del almacén no debe mutarse si un helper hace `append` por error.\n- **Meta:** convertir headers a `tuple` y demostrar extensión con `+`.\n- **Éxito:** `KEYS` imprime `('id', 'monto')`; `more` es `('id', 'monto', 'canal')`; `KEYS` sigue igual después.\n- **Límites:** no uses `.append` sobre `KEYS`; no dejes `KEYS` como alias de la lista.",
        id: "S06-T1-A-E2",
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
          "Compara identidades, no solo valores: `more` contiene tres campos, pero `KEYS` sigue representando el contrato original. ¿Qué bug aparecería si `KEYS` fuera un alias de `headers` y otro helper hiciera `append`? Escribe una frase de decisión: usa lista cuando el esquema debe evolucionar y tupla cuando un cambio accidental sería una violación.",
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
        subtopicId: "S06-T1-A",
        kind: "transfer",
        title: "Diagnosticar append sobre tuple de ids",
        preamble:
          "- **Contexto:** a veces un snapshot de ids llega como tuple (inmutable); el pipeline intenta mutarlo como cola.\n- **Meta:** capturar `AttributeError`, convertir a `list` y mutar una **copia**.\n- **Éxito:** un `print` de diagnóstico con nombre `AttributeError` y luego `['C001', 'C002', 'C003']`.\n- **Límites:** no uses `except Exception` genérico en la solución; no mutes la tuple original (no se puede).",
        id: "S06-T1-A-E3",
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
          "El `AttributeError` protege una decisión: esos IDs eran un snapshot, no una cola. Explica por qué convertir a lista y mutar la copia respeta esa decisión mejor que reemplazar la tupla original por una lista global. ¿En qué situación preferirías devolver una tupla nueva con `ids + ('C003',)`? La respuesta depende de quién comparte el contrato.",
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
        subtopicId: "S06-T1-B",
        kind: "guided",
        title: "Desempaquetar fila en cid, región y monto",
        preamble:
          "- **Contexto:** filas sintéticas de intake llegan como tuplas posicionales; el unpack documenta el shape.\n- **Meta:** asignar `cid, region, monto` sin índices sueltos.\n- **Éxito:** una línea `C001 Lima 10` (en ese orden).\n- **Límites:** no uses índices `fila[i]` en la solución final; no fuerces el caso de largo incorrecto aquí.",
        id: "S06-T1-B-E1",
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
          "El unpack no solo ahorra índices: convierte el largo de la fila en una afirmación ejecutable. Predice el error si llega `('C001', 'Lima')` y explica por qué no conviene rellenar `monto` en silencio. Después decide cuándo usarías `cid, *rest`: flexibiliza el shape, pero también traslada a tu código la responsabilidad de validar cuánto contiene `rest`.",
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
        subtopicId: "S06-T1-B",
        kind: "independent",
        title: "Alias versus copy en lista de enteros",
        preamble:
          "- **Contexto:** al «duplicar» una cola de ids numéricos de demo, `=` no copia.\n- **Meta:** contrastar alias y `list.copy()` con mutaciones `append`.\n- **Éxito:** tras alias append 3 → `xs` y `copia` divergen (`[1,2,3]` vs. `[1,2]`); tras append 4 solo a copia → `xs` sin 4.\n- **Límites:** no uses `deepcopy` aquí (ints inmutables; shallow basta).",
        id: "S06-T1-B-E2",
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
          "Dibuja dos listas después de `copia = xs.copy()`. Ambas contienen referencias a los mismos enteros, pero los enteros no se mutan y los contenedores sí son distintos. Esa es la razón por la que `copia` no ve el 3. ¿Cambiaría tu conclusión si cada elemento fuera un diccionario? Formula la predicción antes de E3.",
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
        subtopicId: "S06-T1-B",
        kind: "transfer",
        title: "Tags anidados: shallow no aísla",
        preamble:
          "- **Contexto:** clientes con `tags: list` en el store; un helper «copia» el lote y contamina el original.\n- **Meta:** demostrar que `list.copy()` comparte dicts internos y que `deepcopy` aísla.\n- **Éxito:** tras shallow, original tiene `'s'`; tras deep append `'d'`, original queda con `['a','s']` y deep con `['a','s','d']`.\n- **Límites:** `import copy`; no inventes otra estructura.",
        id: "S06-T1-B-E3",
        instruction:
          "1. Ejecuta el starter y observa la fuga por tags.\n2. Reemplaza la «deep» falsa por `copy.deepcopy`.\n3. Mutar solo el deep e imprime original vs. deep.\n4. No «arregles» borrando el experimento shallow: sirve de contraste.",
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
          "Separa dos momentos del resultado: la mutación sobre `shallow` sí alcanza al original; la mutación sobre `deep` no. Explica cada uno siguiendo referencias, no usando la etiqueta «profundo» como magia. En el proyecto, ¿copiarías todo el store o reconstruirías solo `tags`? Considera memoria, claridad y qué campos planeas modificar.",
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
        subtopicId: "S06-T2-A",
        kind: "guided",
        title: "Dict desde pares id–región",
        preamble:
          "- **Contexto:** un lote sintético llega como pares `(id, región)` y necesitas un índice de lookup.\n- **Meta:** construir un `dict` real, no dejar la lista de pares.\n- **Éxito:** imprime `{'C001': 'Lima', 'C002': 'Cusco'}` y el lookup `Cusco` con clave `'C002'`.\n- **Límites:** claves hashables (`str`); no uses pandas.",
        id: "S06-T2-A-E1",
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
          "La lista y el diccionario contienen los mismos pares, pero ofrecen preguntas distintas. En la lista, `1` significa posición; en el diccionario, una clave entera literal. Explica por qué `d['C002']` expresa mejor la intención. Después añade mentalmente un segundo par con clave C002: ¿qué información se perdería al construir el índice y dónde deberías detectarlo?",
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
        subtopicId: "S06-T2-A",
        kind: "independent",
        title: "get con default frente a KeyError",
        preamble:
          "- **Contexto:** ids opcionales en intake sintético: a veces reportas «N/A», a veces un bug de programación debe fallar fuerte.\n- **Meta:** usar `get` para opcionales y capturar `KeyError` en acceso duro.\n- **Éxito:** tres líneas conceptuales: `Ana`, `N/A`, y un print de `KeyError 'C999'`.\n- **Límites:** no tragues todas las excepciones con `except Exception`.",
        id: "S06-T2-A-E2",
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
          "No concluyas que `get` es «más seguro» en toda situación. Es seguro cuando la ausencia forma parte del contrato; puede ocultar un typo cuando el ID debía existir. Escribe dos tests: uno donde C999 produce N/A de manera legítima y otro donde una clave obligatoria debe lanzar `KeyError`. Esa distinción reaparecerá en rutas anidadas.",
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
        subtopicId: "S06-T2-A",
        kind: "transfer",
        title: "Fusionar config sin mutar defaults",
        preamble:
          "- **Contexto:** varios helpers comparten una config base de retry/timeout; un override no debe pisar el original en memoria.\n- **Meta:** merge con precedencia override > defaults, dejando `defaults` intacto.\n- **Éxito:** `merged` con `retry: 5` y `timeout: 30`; `defaults` sigue en `retry: 1`.\n- **Límites:** no dejes `defaults.update(override)` sobre el dict compartido.",
        id: "S06-T2-A-E3",
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
          "Demuestra las dos invariantes por separado: `merged['retry'] == 5` prueba precedencia y `defaults['retry'] == 1` prueba aislamiento. Si solo verificas la primera, una mutación accidental podría pasar. Imagina dos callers que comparten `defaults`: ¿qué resultado observaría el segundo después de `update`? Esa distancia entre causa y síntoma hace peligroso mutar sin contrato.",
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
        subtopicId: "S06-T2-B",
        kind: "guided",
        title: "Emails únicos en lista ordenada",
        preamble:
          "- **Contexto:** cohorte de contactos sintéticos; el set deduplica, pero el print debe ser estable.\n- **Meta:** unicos como lista ordenada, no set crudo.\n- **Éxito:** `['a@ex.com', 'b@ex.com']` (una sola vez cada email).\n- **Límites:** no dependas del orden de inserción del set.",
        id: "S06-T2-B-E1",
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
          "El set decide unicidad; `sorted` decide presentación. Quita mentalmente `sorted` y explica qué propiedad aún sería correcta y cuál dejaría de estar garantizada. Después añade un email nuevo: la salida debe cambiar por contenido, no por casualidad de orden. Esta separación entre verdad del dato y forma canónica reaparecerá al serializar JSON.",
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
        subtopicId: "S06-T2-B",
        kind: "independent",
        title: "Intersección y diferencia simétrica de lotes",
        preamble:
          "- **Contexto:** dos lotes de emails de campaña sintética; necesitas «en ambos» y «solo en uno».\n- **Meta:** `a & b` y `a ^ b`, ambos ordenados.\n- **Éxito:** inter `b@…, c@…`; symdiff `a@…, d@…`.\n- **Límites:** no uses bucles O(n²) para membership; sets + `sorted`.",
        id: "S06-T2-B-E2",
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
          "Cuenta la historia de cada operador con un elemento: `b@ex.com` aparece en ambos y pertenece a la intersección; `a@ex.com` aparece solo en A y pertenece a la diferencia simétrica. ¿Dónde quedaría `a@ex.com` en `a - b` y por qué esa pregunta no es equivalente? Elige el operador desde la pregunta de negocio, no desde el símbolo recordado.",
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
        subtopicId: "S06-T2-B",
        kind: "transfer",
        title: "dedup_report con unique y conflicts",
        preamble:
          "- **Contexto:** en CP-N1-B, dos filas con el mismo `id` y datos distintos deben **reportarse**, no silenciarse.\n- **Meta:** devolver `{unique, conflicts}` con política de payload.\n- **Éxito:** unique con primera vista de C001 y C002; un solo conflicto C001 `v:1` vs. `v:9`; la fila idéntica no entra a conflicts.\n- **Límites:** no borres filas del reporte; no uses «último gana» sin traza.",
        id: "S06-T2-B-E3",
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
          "Un set de IDs solo conserva «C001 ya apareció»; no conserva `v: 1`, así que no puede comparar la siguiente fila. Explica por qué `seen` debe ser diccionario y no set. Luego predice el resultado si aparecen dos versiones conflictivas adicionales: `unique` sigue con una primera vista, mientras `conflicts` acumula evidencia para revisión.",
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
        subtopicId: "S06-T3-A",
        kind: "guided",
        title: "Contar contactos por cliente",
        preamble:
          "- **Contexto:** en el resumen del store CP-N1-B necesitas conteos por cliente, no volcar contactos crudos.\n- **Meta:** `len(c['contacts'])` por fila.\n- **Éxito:** `C001 → 2` y `C002 → 0` (lista vacía válida).\n- **Límites:** no imprimas la lista cruda; no inventes contactos.",
        id: "S06-T3-A-E1",
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
          "C002 produce cero, no error ni «missing», porque la lista existe y simplemente no contiene contactos. Explica la diferencia entre `contacts: []` y una fila sin clave `contacts`. ¿Qué debería hacer un resumen y qué debería hacer un validador de shape? Mantener esas responsabilidades separadas evita convertir ausencia de actividad en corrupción estructural.",
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
        subtopicId: "S06-T3-A",
        kind: "independent",
        title: "Aplanar txs con client_id",
        preamble:
          "- **Contexto:** para export tabular, cada tx necesita el id del cliente dueño.\n- **Meta:** filas densas `{client_id, tx_id, monto}` de **todas** las txs.\n- **Éxito:** lista de 3 filas (C001×1 + C002×2) como en la solución.\n- **Límites:** no te quedes solo con la primera tx de cada cliente.",
        id: "S06-T3-A-E2",
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
          "Verifica una conservación: el número de filas planas debe ser la suma de las longitudes de `txs`. En este fixture, 1 + 2 = 3. Si usas siempre `[0]`, el programa produce una salida plausible de dos filas y pierde T3 sin lanzar error. ¿Qué assert convertiría esa pérdida silenciosa en un fallo visible?",
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
        subtopicId: "S06-T3-A",
        kind: "transfer",
        title: "Validar shape de txs (list o review)",
        preamble:
          "- **Contexto:** filas rotas llegan al almacén (falta una clave o aparece una cadena donde debía haber una lista).\n- **Meta:** marcar `ok` solo si `txs` es `list` (vacía permitida).\n- **Éxito:** `C001 ok`, `C002 review`, `C003 review`.\n- **Límites:** no uses `bool(txs)` (castiga la lista vacía legítima).",
        id: "S06-T3-A-E3",
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
          "La prueba correcta pregunta «¿es una lista?», no «¿tiene elementos?». Por eso C001 es válido aunque `bool([])` sea falso. Explica por qué C003 no debe pasar aunque `bool('oops')` sea verdadero. Esta pareja revela un error común: usar truthiness para validar forma. En T3-B aplicarás la misma disciplina a ausencia y vacío.",
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
        subtopicId: "S06-T3-B",
        kind: "guided",
        title: "get_nested seguro por ruta de claves",
        preamble:
          "- **Contexto:** `profile.phone` presente y `profile.email` ausente en un cliente sintético.\n- **Meta:** recorrer claves; si falta un nivel, devolver `default`.\n- **Éxito:** `999` y `N/A`.\n- **Límites:** no uses try/except como único diseño; chequea dict y pertenencia de clave.",
        id: "S06-T3-B-E1",
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
          "Recorre a mano la ruta `profile → email`: el primer nivel existe y el segundo no, por eso aparece el default. Ahora imagina `profile: []`. El chequeo de tipo también debe detenerse. ¿Qué defecto podría ocultar un `except Exception` general? Un helper seguro no significa un helper que silencia cualquier error; significa un contrato preciso para rutas incompletas.",
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
        subtopicId: "S06-T3-B",
        kind: "independent",
        title: "Marcar email missing o present",
        preamble:
          "- **Contexto:** reporte de completitud de emails en un lote sintético.\n- **Meta:** missing solo si clave ausente o valor `None`.\n- **Éxito:** `C001: present`, `C002: missing`, `C003: missing`, `C004: present` (string vacío cuenta present).\n- **Límites:** no uses solo `if not c.get('email')` (trataría `''` como missing).",
        id: "S06-T3-B-E2",
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
          "C004 es el caso que decide si entendiste la política: la clave existe y su valor es `''`, así que cuenta como presente aunque quizá falle otra validación de formato. Explica por qué una única etiqueta «missing» no debe absorber «presente pero vacío». ¿Qué métrica de calidad se distorsionaría si ambas categorías se mezclaran?",
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
        subtopicId: "S06-T3-B",
        kind: "transfer",
        title: "Falsy no es lo mismo que missing",
        preamble:
          "- **Contexto:** montos `0`, strings vacíos y listas vacías son datos; solo `None` es missing en esta política.\n- **Meta:** imprimir para cada valor si es falsy y si es missing.\n- **Éxito:** solo `None` con `missing=True`; `''`, `0`, `[]` con `missing=False`.\n- **Límites:** no uses `not v` como definición de missing.",
        id: "S06-T3-B-E3",
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
          "Todos los valores del fixture son falsy, pero solo uno es missing bajo este contrato. Esa es la prueba de que truthiness y semántica de negocio son capas distintas. Añade mentalmente `False`: ¿es ausencia o un booleano válido? No respondas por intuición; declara la política. En T4 ordenarás datos después de validar su significado.",
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
        subtopicId: "S06-T4-A",
        kind: "guided",
        title: "Ordenar txs por monto ascendente",
        preamble:
          "- **Contexto:** listar txs sintéticas de menor a mayor monto para un extracto.\n- **Meta:** `sorted` con `key` en `monto`.\n- **Éxito:** ids `['T1', 'T2']`.\n- **Límites:** no mutes con `.sort`; no ordenes por `id`.",
        id: "S06-T4-A-E1",
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
          "Ambas versiones imprimen IDs y parecen técnicamente ordenadas; solo una responde la pregunta de negocio. Explica cómo la `key` traduce cada fila a un monto comparable. Después verifica que `rows` conserva su orden original. ¿Qué test fallaría si alguien cambiara `sorted` por `.sort()` y otro módulo dependiera del orden de llegada?",
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
        subtopicId: "S06-T4-A",
        kind: "independent",
        title: "Orden multi-campo región y nombre",
        preamble:
          "- **Contexto:** ranking de clientes sintéticos para un reporte regional.\n- **Meta:** ordenar por región y, en empate, por nombre.\n- **Éxito:** tres líneas agrupadas por región y ordenadas por nombre dentro de cada grupo.\n- **Límites:** un solo `sorted`; no ordenes dos veces a mano.",
        id: "S06-T4-A-E2",
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
          "La tupla funciona como dos preguntas consecutivas: «¿qué región?» y, si empatan, «¿qué nombre?». Predice dónde aparecería otra Ana de Cusco y justifica el resultado. Luego invierte la tupla a `(nombre, region)`: la sintaxis apenas cambia, pero la prioridad de negocio sí. Documenta esa prioridad para que el orden sea defendible.",
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
        subtopicId: "S06-T4-A",
        kind: "transfer",
        title: "list.sort retorna None; sorted no muta",
        preamble:
          "- **Contexto:** un helper «ordenó» la cola y devolvió `None` al código que lo llamó.\n- **Meta:** demostrar mutación in-place frente a una copia ordenada.\n- **Éxito:** `ret None`, `rows` ordenada, `base` intacta y `copy` ordenada.\n- **Límites:** no «arregles» omitiendo el experimento de `.sort` sobre `rows`.",
        id: "S06-T4-A-E3",
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
          "Hay dos efectos que debes nombrar: `rows` cambia y `ret` vale `None`; `base` no cambia y `copy_sorted` contiene otra lista. ¿Cuándo aceptarías el primer contrato? Tal vez sobre una lista local que nadie comparte y donde ahorrar una copia importa. La elección correcta depende de propiedad y costo, no de una prohibición memorizada.",
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
        subtopicId: "S06-T4-B",
        kind: "guided",
        title: "Elegir list, dict o set por operación",
        preamble:
          "- **Contexto:** tres jobs del almacén en RAM con distinta carga.\n- **Meta:** asignar la estructura Python adecuada a cada job.\n- **Éxito:** cola → list; lookup id → dict; emails únicos → set.\n- **Límites:** una elección por línea; no inventes estructuras de terceros.",
        id: "S06-T4-B-E1",
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
          "Para cada elección, completa la frase «uso X porque necesito conservar Y o abaratar Z». Luego busca el costo oculto: el set pierde orden y duplicados; el diccionario exige claves únicas; la lista hace búsquedas lineales. Si no puedes nombrar una propiedad sacrificada, todavía estás eligiendo por costumbre y no por operación dominante.",
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
        subtopicId: "S06-T4-B",
        kind: "independent",
        title: "JSON determinista con ids y sort_keys",
        preamble:
          "- **Contexto:** el mismo payload de demo debe producir el mismo string en cada corrida.\n- **Meta:** ordenar `ids` y serializar con `sort_keys=True`.\n- **Éxito:** exactamente `{\"a\": 2, \"ids\": [\"C001\", \"C002\"], \"z\": 1}`.\n- **Límites:** `ensure_ascii=False`; un solo `print` del string.",
        id: "S06-T4-B-E2",
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
          "Ordenar `ids` estabiliza una colección interior; `sort_keys=True` estabiliza la representación de las claves del objeto. Explica por qué resolver solo una capa no constituye un contrato canónico completo. Después construye mentalmente el mismo payload con claves insertadas en otro orden: ¿qué test de igualdad exacta debería seguir pasando?",
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
        subtopicId: "S06-T4-B",
        kind: "transfer",
        title: "Membership list vs. set y costo de n búsquedas",
        preamble:
          "- **Contexto:** n búsquedas de un id en cohorte; list recorre, set hashea.\n- **Meta:** comprobar `in` en ambas y **derivar** costos `n*n` y `n` desde `len`.\n- **Éxito:** ambos `in` True; `costo_conceptual_list 25` y `costo_conceptual_set 5` con n=5.\n- **Límites:** no hardcodees 25/5 sin calcular desde `n`; no importes librerías de timing.",
        id: "S06-T4-B-E3",
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
          "Los números 25 y 5 no son una medición temporal; son un modelo del trabajo para n búsquedas sobre n elementos. Explica qué supuesto permite tratar la consulta al set como O(1) promedio. ¿Construirías el set para una sola búsqueda sobre cinco IDs? Probablemente no: preindexar intercambia memoria y preparación por consultas posteriores más baratas.",
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
      "Ahora diseñas la mesa de clasificación completa sin una solución para copiar. Trabaja en cuatro pasadas. Primero escribe los invariantes: la primera fila única se conserva, un payload distinto se reporta y ninguna transacción pierde su `client_id`. Después implementa cada helper y pruébalo por separado. En la tercera pasada compón el flujo de `main`; en la cuarta, ejecuta una matriz de bordes con duplicado idéntico, conflicto, ruta ausente, lista vacía y entrada desordenada. El éxito no es que el archivo «corra», sino que puedas relacionar cada salida con una promesa verificable.",
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
      "Presenta el proyecto como una decisión de diseño, no como una lista de funciones. Incluye el shape del store, el conflicto sintético que tu política conserva, dos dumps iguales obtenidos desde órdenes de entrada distintos y una breve justificación de cada colección. Un revisor debe poder reconstruir qué riesgo evita cada decisión sin abrir todo el código.",
    rubric: [
      { criterion: "Modelo completo cliente/contacto/tx", weight: "25%" },
      { criterion: "Dedup sin borrar conflictos", weight: "25%" },
      { criterion: "Determinismo de salida", weight: "20%" },
      { criterion: "Acceso seguro a faltantes", weight: "15%" },
      { criterion: "Elección de estructuras justificada", weight: "15%" },
    ],
    retrospective:
      "Revisa el proyecto con tres voces. Como autor, demuestra cada invariante con un assert y explica por qué elegiste list, dict o set. Como operador, pregunta qué ocurre con un lote vacío, un ID repetido y una ruta incompleta, y confirma que ninguna excepción queda disfrazada de éxito. Como revisor, busca mutaciones compartidas y salidas dependientes del orden. Cierra con una decisión que cambiarías al crecer el volumen y otra que mantendrías porque protege la trazabilidad.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué produce xs[-2:] si xs = [1,2,3,4]?",
        options: ["[1,2]", "[3,4]", "[4]", "Error"],
        correctIndex: 1,
        explanation:
          "`-2` señala el penúltimo elemento y `:` pide una ventana desde allí hasta el final, por eso obtienes `[3, 4]`. La opción `[4]` confunde slice con índice; `xs[-1]` sí devolvería un solo valor. El slice conserva una lista y no modifica `xs`.",
      },
      {
        question: "`b = a` (listas) y mutas `b.append(1)`. ¿Qué pasa con `a`?",
        options: ["a no cambia", "se lanza error", "a se convierte en tuple", "a también ve el append (alias)"],
        correctIndex: 3,
        explanation:
          "`b = a` crea otro nombre para la misma lista; no crea un contenedor nuevo. `append` muta ese objeto único, así que ambos nombres observan el cambio. Pensar que la asignación copia es el error tentador; para separar los contenedores necesitarías `a.copy()` o una estrategia más profunda si hay objetos anidados.",
      },
      {
        question: "Para reportar dos filas con mismo id y payload distinto debes…",
        options: ["Listar conflicto en conflicts sin silenciar", "Borrar ambas", "Quedarte con la última sin traza", "Convertir a set de dicts"],
        correctIndex: 0,
        explanation:
          "El ID repetido detecta una posible colisión y el payload distinto confirma el conflicto. Debes conservar la versión elegida en `unique` y ambas evidencias en `conflicts`. Quedarte con la última sin traza produce una salida limpia a costa de borrar la discrepancia que un revisor necesita investigar.",
      },
      {
        question: "rows.sort(key=...) retorna…",
        options: ["la lista ordenada", "una tuple", "None (muta in-place)", "un set"],
        correctIndex: 2,
        explanation:
          "`.sort()` expresa su efecto modificando la lista y devuelve `None`; así evita sugerir que creó otra colección. La opción «la lista ordenada» confunde efecto con retorno y causa el bug `x = rows.sort()`. Usa `sorted(rows)` cuando necesites una lista nueva y conservar el orden original.",
      },
      {
        question: "json.dumps(..., sort_keys=True) ayuda a…",
        options: ["comprimir el archivo", "salidas deterministas/reproducibles", "validar schema JSON Schema", "encriptar PII"],
        correctIndex: 1,
        explanation:
          "`sort_keys=True` fija el orden de las claves en el texto JSON, lo que facilita igualdad exacta, hashes y diffs reproducibles. No valida un schema, no comprime y no cifra. Para un contrato completamente estable también debes ordenar las listas de filas por una clave de negocio.",
      },
      {
        question: "Si haces `copia = rows.copy()` donde `rows` es `list[dict]` y mutas `copia[0]['tags']`, ¿el original queda aislado?",
        options: ["Sí: copy() hace deepcopy automático", "Solo si usas tuple", "Se lanza TypeError", "No: la copia es superficial; los dicts internos se comparten"],
        correctIndex: 3,
        explanation:
          "`rows.copy()` crea otra lista exterior, pero ambas listas siguen apuntando a los mismos diccionarios y a la misma lista `tags`. Por eso una mutación interior alcanza al original. `tuple` no repara referencias compartidas; reconstruye el campo que mutarás o usa `deepcopy` cuando realmente necesites aislar todo el grafo.",
      },
      {
        question: "Para membership masivo de emails en un lote (¿está este email en la cohorte?), la estructura más adecuada es…",
        options: ["set de emails", "list de strings y `in` en un loop", "tuple de emails", "solo json.dumps"],
        correctIndex: 0,
        explanation:
          "Un set organiza valores hashables para responder pertenencia en O(1) promedio; una lista puede recorrer hasta n elementos por consulta. La lista conserva orden y duplicados, pero esas propiedades no son la pregunta aquí. Si las consultas se repiten, el costo de construir el set se amortiza.",
      },
      {
        question: "Si falta la clave `\"x\"` en el dict `d`, ¿qué diferencia hay entre `d.get(\"x\", \"N/A\")` y `d[\"x\"]`?",
        options: ["Ambos lanzan KeyError", "get lanza KeyError; d[\"x\"] devuelve None", "get devuelve \"N/A\"; d[\"x\"] lanza KeyError", "Ambos devuelven None siempre"],
        correctIndex: 2,
        explanation:
          "`d.get(\"x\", \"N/A\")` modela una ausencia esperada y devuelve el default. `d[\"x\"]` expresa que la clave es obligatoria y lanza `KeyError` si falta. Elegir siempre `get` no es automáticamente más seguro: podría ocultar un error de programación donde el contrato exigía la clave.",
      },
      {
        question: "Al aplanar txs anidadas a filas densas para export, ¿qué debe incluir cada fila plana?",
        options: ["Solo el monto, sin id de cliente", "client_id (denormalizado) junto a tx_id y monto", "El dict cliente completo embebido en cada tx", "Un set de ids sin montos"],
        correctIndex: 1,
        explanation:
          "Al aplanar desaparece el contenedor del cliente, así que cada transacción debe llevar `client_id` para conservar su dueño. Incluir solo monto y `tx_id` produce filas huérfanas; incrustar el cliente completo repite información innecesaria. La clave denormalizada mantiene la relación y prepara joins o CSV posteriores.",
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
