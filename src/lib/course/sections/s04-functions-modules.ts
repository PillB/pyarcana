import type { CourseSection } from '../../types'

export const section04: CourseSection = {
  id: "functions-modules",
  index: 4,
  title: "Iteración y resúmenes transaccionales",
  shortTitle: "Iteración & Resúmenes",
  tagline: "for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A",
  estimatedHours: 18,
  level: "Principiante",
  phase: 0,
  icon: "Repeat",
  accentColor: "bg-gradient-to-br from-amber-500 to-orange-600",
  jobRelevance:
    "Una regla aplicada a una sola fila es una demostración; aplicada con cuidado a miles de filas es un sistema. Aquí conviertes un validador registro por registro en un procesador por lotes (un programa que recorre muchos registros en un solo pase, no uno por uno). Aprendes cuándo seguir, cuándo detenerte, qué contar y cómo demostrar que el resumen no perdió ni duplicó registros — criterio que sirve igual para pedidos, sensores, matrículas o transacciones.",
  learningOutcomes: [
    { text: "Recorrer secuencias con for y range sin off-by-one en el stop exclusivo" },
    { text: "Usar enumerate y zip (incl. strict) sin desalinear columnas de intake" },
    { text: "Escribir while con centinelas y condición de terminación explícita" },
    { text: "Aplicar break/continue y salvaguardas contra bucles infinitos" },
    { text: "Implementar contadores, acumuladores y búsquedas en un pase O(n)" },
    { text: "Escribir comprehensions legibles para filtros simples de resumen" },
    { text: "Trazar el estado de un bucle para depurar contadores" },
    { text: "Distinguir costo lineal vs. cuadrático y corregir off-by-one en índices" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: iteración y resúmenes por lotes",
      paragraphs: [
        "Imagina una cinta transportadora: cada registro entra una vez, recibe una decisión y deja una marca en el resumen. El **bucle** mueve la cinta; el **centinela** (`\"\"`, `\"END\"`) indica que no llegan más cajas; la **tasa** compara un contador con todas las cajas intentadas. Si no llegó ninguna, la respuesta honesta es `None`, no una división inventada.",
        "Desde **S03** ya validas un registro (accept / reject / review). Ahora sostienes tres invariantes durante **muchas filas**: cada fila se procesa como máximo una vez, los contadores explican el total y el raw permanece intacto. Un solo pase **O(n)** basta para cerrar el gate **CP-N1-A**; empaquetado, CLI y decorators pueden esperar.",
        "El hilo conductor es un **script de intake por lotes**. Lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila. Caso de laboratorio: `CASO-LIM-004`. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo.",
        "Orden pedagógico: **T1 Recorrido** (`for`/`range` → `enumerate`/`zip`) → **T2 Repetición** (`while`/centinelas → `break`/`continue`) → **T3 Patrones** (contadores/acumuladores → comprehensions) → **T4 Razonamiento** (trazado de estado → costo y off-by-one). En cada subtema: teoría → demo I Do → We Do (E1 guiado, E2 independiente, E3 transferencia).",
        "Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do del batch + self-check. Si un demo se siente denso, rehazlo con lápiz (tabla TRACE) antes de copiar la solución. Cuando veas `def ...` en un ejemplo, es solo una **receta nombrada** para el playground — el diseño formal de funciones llega en la sección siguiente.",
      ],
      callout: {
        type: "info",
        title: "Alcance de esta sección",
        content:
          "El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A): lotes, contadores, tasas con denominador correcto y raw intacto. No cubrimos decorators ni packaging aquí; cuando llegues a módulos/CLI y OOP de dominio, reutilizarás estos bucles sobre el mismo hilo de intake.",
      },
    },
    {
      heading: "for, range y secuencias",
      subtopicId: "S04-T1-A",
      paragraphs: [
        "Cuando la pregunta es «¿qué hago con cada elemento de una colección conocida?», piensa primero en **`for`**. `for x in secuencia` entrega cada valor una vez y en orden; el índice es equipaje innecesario hasta que una necesidad concreta —posición, reporte o acceso paralelo— lo justifique.",
        "**`range(stop)`**, **`range(start, stop)`**, **`range(start, stop, step)`** producen enteros sin materializar una lista gigante. El **stop es exclusivo**: `range(3)` → 0,1,2. Eso evita el off-by-one clásico al numerar N filas.",
        "En lotes de clientes sintéticos, el patrón base es `for registro in filas:` y, más adelante en el You Do, llamar a `validate_record` dentro del bucle. No mutes la lista mientras la recorres salvo que sepas lo que haces; acumula resultados en otra lista. Prefiere el for por valor; `range(len(...))` solo cuando el índice es imprescindible.",
      ],
      code: {
        language: 'python',
        title: "for_registros.py",
        code: `filas = [
    {"id": "C001", "region": "Lima"},
    {"id": "C002", "region": "Cusco"},
    {"id": "C003", "region": "Arequipa"},
]
for reg in filas:
    print(f"{reg['id']} → {reg['region']}")

ids = []
for i in range(len(filas)):
    ids.append(filas[i]["id"])
print("ids con range:", ids)
print("range(1, 4):", list(range(1, 4)))
`,
        output: `C001 → Lima
C002 → Cusco
C003 → Arequipa
ids con range: ['C001', 'C002', 'C003']
range(1, 4): [1, 2, 3]`,
      },
      callout: {
        type: "tip",
        title: "Regla de intake",
        content:
          "Prefiere `for reg in filas` sobre `for i in range(len(filas))` salvo que necesites el índice. Menos índices = menos off-by-one.",
      },
    },
    {
      heading: "enumerate y zip sin desalinear",
      subtopicId: "S04-T1-B",
      paragraphs: [
        "Dos problemas parecen iguales y no lo son: **numerar** una sola secuencia y **alinear** dos secuencias. `enumerate(seq, start=1)` resuelve lo primero sin llevar un contador manual; `zip(a, b)` resuelve lo segundo, pero solo si puedes defender que ambas columnas tienen la misma longitud.",
        "**`zip(a, b)`** empareja elementos en paralelo. Se detiene en la **secuencia más corta**. Si `nombres` tiene 3 y `edades` tiene 2, el tercer nombre **desaparece en silencio** — un bug de calidad de datos. En Python 3.10+ existe `zip(..., strict=True)`; en cualquier versión puedes validar `len(a)==len(b)` antes de zipear (helper `zip_strict` en el demo).",
        "**Nunca** asumas que dos columnas CSV llegaron alineadas solo porque “deberían”. Cuenta longitudes en tests de pipeline (`len(a)==len(b)` o `zip(..., strict=True)`). Un zip corto silencioso infla o deflacta tasas de reject en el resumen de intake.",
      ],
      code: {
        language: 'python',
        title: "enumerate_zip.py",
        code: `ids = ["C001", "C002", "C003"]
regiones = ["Lima", "Cusco"]  # ¡falta un valor!

for i, rid in enumerate(ids, start=1):
    print(f"fila {i}: {rid}")

print("zip corto (silencioso):", list(zip(ids, regiones)))

# Equivalente pedagógico a zip(..., strict=True) — Py 3.10+
def zip_strict(a, b):
    if len(a) != len(b):
        raise ValueError(f"desalineado: {len(a)} vs {len(b)}")
    return list(zip(a, b))

try:
    zip_strict(ids, regiones)
except ValueError as e:
    print("zip strict →", type(e).__name__ + ":", e)`,
        output: `fila 1: C001
fila 2: C002
fila 3: C003
zip corto (silencioso): [('C001', 'Lima'), ('C002', 'Cusco')]
zip strict → ValueError: desalineado: 3 vs 2`,
      },
      callout: {
        type: "warning",
        title: "Gate de alineación",
        content:
          "Desalineación en zip produce resúmenes incorrectos y tasas infladas/deflactadas. Valida len(cols) antes de zip o usa zip(..., strict=True) en Python 3.10+.",
      },
    },
    {
      heading: "while, centinelas y terminación",
      subtopicId: "S04-T2-A",
      paragraphs: [
        "Elige **`while`** cuando conoces la condición de salida, pero no el número de vueltas: leer hasta `END`, reintentar hasta éxito o consumir un flujo mientras haya trabajo. Su pregunta central no es «¿cuántos elementos hay?», sino «¿qué debe cambiar para que esto termine?».",
        "Un **centinela** es un valor especial que marca el fin (p. ej. `\"\"`, `None`, `\"END\"`). El bucle debe **actualizar el estado** en cada vuelta; si la condición nunca se vuelve falsa, tienes un **bucle infinito**.",
        "En demos de browser no usamos `input()` interactivo real; simulamos un **buffer de líneas**. El patrón es el mismo: leer siguiente → chequear centinela (`\"END\"` / `\"\"`) → procesar → actualizar estado. Si olvidas avanzar el índice, el while es **infinito**.",
      ],
      code: {
        language: 'python',
        title: "while_centinela.py",
        code: `lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]
i = 0
procesadas = []
while i < len(lineas):
    ln = lineas[i]
    i += 1
    if ln == "":
        break
    procesadas.append(ln)
print("procesadas:", procesadas)
print("restante no leída:", lineas[i:])
`,
        output: `procesadas: ['C001|Lima', 'C002|Cusco']
restante no leída: ['C003|Piura']`,
      },
      callout: {
        type: "tip",
        title: "Terminación",
        content:
          "Antes de escribir while, responde: ¿qué variable cambia? ¿cuándo es falsa la condición? Si no puedes contestar, reescribe con for o añade un contador de seguridad.",
      },
    },
    {
      heading: "break, continue y prevención de bucles infinitos",
      subtopicId: "S04-T2-B",
      paragraphs: [
        "Antes de escribir `break` o `continue`, clasifica el hecho: ¿esta fila es ruido o anuncia que el lote ya no es confiable? **`continue`** descarta una vuelta y conserva el proceso; **`break`** termina el bucle actual. Confundirlos cambia qué datos llegan al resumen, no solo el estilo del código.",
        "Prevención de infinito: (1) actualiza la variable de control, (2) pon un **máximo de iteraciones** en prototipos (`MAX = 10_000`), (3) evita `while True` sin break garantizado, (4) no hagas `i = i` por error tipográfico.",
        "Un `while True` con break en el centinela es legítimo si el break es **obvio y testeado**. Documenta la condición de salida.",
      ],
      code: {
        language: 'python',
        title: "break_continue.py",
        code: `def clean_lines(raw_lines, max_n=100):
    kept = []
    iters = 0
    for ln in raw_lines:
        iters += 1
        if not ln.strip() or ln == "SKIP":
            continue
        if ln == "END":
            break
        kept.append(ln)
        if len(kept) >= max_n:
            break
    return kept, iters

raw_lines = ["  ", "C001|Lima", "SKIP", "C002|Cusco", "END"]
kept, iters = clean_lines(raw_lines)
print(kept)
print("iteraciones efectivas del for:", iters)
`,
        output: `['C001|Lima', 'C002|Cusco']
iteraciones efectivas del for: 5`,
      },
      callout: {
        type: "warning",
        title: "while True sin salida",
        content:
          "En producción un bucle infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
      },
    },
    {
      heading: "Contadores, acumuladores y búsqueda",
      subtopicId: "S04-T3-A",
      paragraphs: [
        "Un resumen fiable responde tres preguntas distintas: «¿cuántas veces ocurrió?» (**contador**), «¿cuánto acumularon los valores?» (**acumulador**) y «¿dónde apareció el primer caso?» (**búsqueda**). Separar esas intenciones evita mezclar unidades y producir cifras plausibles pero falsas.",
        "Para **tasas** del gate CP-N1-A: `tasa_error = n_error / n_total` solo si **`n_total > 0`**. El denominador es el número de registros **intentados**, no solo los aceptados. Si no hay filas, reporta `None` o “N/A”, no dividas por cero.",
        "Buscar el primer reject es O(n); contar todos también es O(n). No anides dos bucles sobre el mismo lote “por si acaso” sin necesidad.",
      ],
      code: {
        language: 'python',
        title: "contadores_tasa.py",
        code: `statuses = ["accept", "reject", "accept", "review", "reject", "accept"]
n_total = n_reject = 0
first_reject_idx = None
for i, s in enumerate(statuses):
    n_total += 1
    if s == "reject":
        n_reject += 1
        if first_reject_idx is None:
            first_reject_idx = i
tasa = n_reject / n_total if n_total else None
print("total", n_total, "reject", n_reject, "tasa", round(tasa, 4))
print("first_reject_idx", first_reject_idx)
`,
        output: `total 6 reject 2 tasa 0.3333
first_reject_idx 1`,
      },
      callout: {
        type: "tip",
        title: "Denominador correcto",
        content:
          "Tasa de error = errores / procesados. No uses solo aceptados en el denominador: eso infla la tasa y engaña el dashboard de calidad.",
      },
    },
    {
      heading: "Comprehensions legibles",
      subtopicId: "S04-T3-B",
      paragraphs: [
        "Una **comprehension** es una frase compacta para una idea compacta: «de estos elementos, conserva o transforma aquellos que cumplen una condición». Si al leerla necesitas respirar dos veces, explicar tres ramas o rastrear efectos secundarios, el `for` explícito comunica mejor.",
        "También existen **dict** y **set** comprehensions: `{k: v for ...}`, `{x for ...}`. No anides comprehensions de tres niveles “porque cabe”: la legibilidad del revisor manda.",
        "En el resumen de intake, es útil: `rejects = [r for r in results if r['status']=='reject']`. El conteo sigue siendo `len(rejects)` con denominador `len(results)`.",
      ],
      code: {
        language: 'python',
        title: "comprehensions_resumen.py",
        code: `results = [
    {"id": "C001", "status": "accept"},
    {"id": "C002", "status": "reject"},
    {"id": "C003", "status": "review"},
    {"id": "C004", "status": "reject"},
]
rejects = [r["id"] for r in results if r["status"] == "reject"]
codes = sorted({r["status"] for r in results})
by_id = {r["id"]: r["status"] for r in results}
print("rejects", rejects)
print("codes", codes)
print("by_id", "C002", by_id["C002"])
`,
        output: `rejects ['C002', 'C004']
codes ['accept', 'reject', 'review']
by_id C002 reject`,
      },
      callout: {
        type: "tip",
        title: "Cuándo no usar comprehension",
        content:
          "Si necesitas contadores múltiples, try/except por fila o mensajes, el for clásico es más claro. Comprehension ≠ siempre mejor.",
      },
    },
    {
      heading: "Trazado de estado",
      subtopicId: "S04-T4-A",
      paragraphs: [
        "Cuando el resultado final sorprende, deja de mirar solo el final. Una **traza de estado** convierte el bucle en una película: iteración, dato de entrada, variables antes y después, decisión. El primer fotograma que rompe el invariante suele señalar el defecto exacto.",
        "Antes de pedir ayuda, dibuja 3–5 filas de la traza con valores concretos del lote sintético. Si la traza no cuadra con el print, el bug está en la actualización del estado, no en “Python raro”.",
        "En demos usamos `print` de depuración con prefijo `TRACE`. En producción preferirás **logging** (secciones posteriores); aquí el objetivo es **razonar el bucle** antes de “arreglar a ciegas”. Si la traza no cuadra con el resumen, el bug está en el contador, no en el validador de S03.",
      ],
      code: {
        language: 'python',
        title: "traza_estado.py",
        code: `montos = [10, 0, -5, 20]
total = 0
n_pos = 0
print("i | m | total | n_pos")
for i, m in enumerate(montos):
    if m > 0:
        total += m
        n_pos += 1
    print(f"{i} | {m} | {total} | {n_pos}")
print("final total=", total, "n_pos=", n_pos)
`,
        output: `i | m | total | n_pos
0 | 10 | 10 | 1
1 | 0 | 10 | 1
2 | -5 | 10 | 1
3 | 20 | 30 | 2
final total= 30 n_pos= 2`,
      },
      callout: {
        type: "tip",
        title: "Traza mínima",
        content:
          "Columnas: índice, input de la fila, contadores/acumuladores, decisión. Si no puedes llenar la tabla a mano, el código es demasiado opaco.",
      },
    },
    {
      heading: "Costo lineal/cuadrático y off-by-one",
      subtopicId: "S04-T4-B",
      paragraphs: [
        "Dos programas pueden imprimir el mismo resumen y, sin embargo, no ser equivalentes. Un pase sobre n filas crece de forma **O(n)**; comparar cada fila con todas las demás crece **O(n²)**. La diferencia parece pequeña en un juguete y domina cuando el lote crece.",
        "**Off-by-one**: `range(len(xs))` es correcto para índices 0..n-1; `range(1, len(xs))` se salta el primero; `range(len(xs)+1)` explota con IndexError. Fronteras inclusivas/exclusivas en filtros (`>=` vs. `>`) también son off-by-one de negocio.",
        "Para el gate CP-N1-A: cuenta registros con un contador **O(n)**; **no** recalcules la tasa dentro de un doble bucle. Debuggea índices imprimiendo `i` y `len`. `tasa_reject = n_reject / n_total` solo si `n_total > 0`; si no, reporta `None` (lote vacío), no `ZeroDivisionError` silencioso.",
      ],
      code: {
        language: 'python',
        title: "costo_off_by_one.py",
        code: `xs = ["a", "b", "c"]
linear = 0
for _ in xs:
    linear += 1
quad = 0
for _ in xs:
    for __ in xs:
        quad += 1
print("linear", linear, "quadratic", quad)
print("last ok", xs[len(xs) - 1])
try:
    print(xs[len(xs)])  # off-by-one: índice n no existe
except IndexError as e:
    print("IndexError en len(xs):", e)
`,
        output: `linear 3 quadratic 9
last ok c
IndexError en len(xs): list index out of range`,
      },
      callout: {
        type: "warning",
        title: "n² en resúmenes",
        content:
          "Si tu resumen de calidad anida dos for sobre todos los registros solo para contar, reescribe a un solo pase. El gate CP-N1-A espera un lote procesable y demos rápidas.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos **I Do**, una por subtema. Antes de pulsar Run, predice una línea de salida y nombra el invariante que esperas conservar; después compara tu explicación, no solo los caracteres impresos. Cada demo aporta una decisión al procesador por lotes de CP-N1-A. Si aparece `def nombre(...)`, léelo por ahora como una receta nombrada. Todos los datos son sintéticos y cada `output` es un oráculo ejecutable.",
    steps: [
      {
        demoId: "S04-T1-A-DEMO",
        subtopicId: "S04-T1-A",
        environment: "browser-pyodide",
        description: "Recorrer lote sintético con for por valor y ver range(n)",
        preamble:
          "Predice primero el último número de `list(range(n))` cuando `n` vale 3. Luego sigue una sola ficha imaginaria por el `for`: entra como dict, se imprime y no cambia. La demostración contrasta el recorrido por **valor**, que basta para las edades, con `range(n)`, que representa posiciones 0..n−1. Si tu predicción incluye 3, localiza la frontera exclusiva antes de continuar.",
        code: {
          language: 'python',
          title: "S04-T1-A-DEMO — for_lote",
          code: `lote = [
    {"id": "C001", "edad": 30},
    {"id": "C002", "edad": 17},
    {"id": "C003", "edad": 45},
]
for reg in lote:
    print(reg["id"], "edad=", reg["edad"])
n = len(lote)
print("n=", n, "range →", list(range(n)))
`,
          output: `C001 edad= 30
C002 edad= 17
C003 edad= 45
n= 3 range → [0, 1, 2]`,
        },
        why: "Prefiere `for reg in lote` cuando solo te importa el valor: menos índices, menos off-by-one. Usa `range(n)` solo si el índice es imprescindible (reportes, posiciones). El stop de `range` es exclusivo — `range(3)` produce 0,1,2 — y así evitas numerar de más al recorrer N filas del batch.",
        retrospective:
          "Prueba de comprensión: explica por qué hay tres iteraciones aunque el mayor índice sea 2. Esa separación entre cantidad e índice evita el off-by-one. Transfiérela a cualquier colección —eventos, pedidos o lecturas— antes de practicar contadores en We Do.",
      },
      {
        demoId: "S04-T1-B-DEMO",
        subtopicId: "S04-T1-B",
        environment: "browser-pyodide",
        description: "enumerate para reportar fila y zip strict para columnas",
        preamble:
          "Antes de ejecutar, separa dos predicciones: `enumerate(..., start=1)` imprimirá tres rótulos humanos, mientras que columnas de longitudes 3 y 2 deben fallar de forma visible. El helper `zip_strict` convierte una pérdida silenciosa en una señal auditable. Pregúntate qué registro desaparecería si usaras `zip` sin la comprobación.",
        code: {
          language: 'python',
          title: "S04-T1-B-DEMO — enumerate_zip",
          code: `ids = ["C001", "C002", "C003"]
regiones = ["Lima", "Cusco", "Arequipa"]

def zip_strict(a, b):
    if len(a) != len(b):
        raise ValueError("desalineado")
    return zip(a, b)

for i, (rid, reg) in enumerate(zip_strict(ids, regiones), start=1):
    print(f"fila {i}: {rid} @ {reg}")
mal = ["Lima", "Cusco"]
try:
    list(zip_strict(ids, mal))
except ValueError:
    print("desalineado detectado")`,
          output: `fila 1: C001 @ Lima
fila 2: C002 @ Cusco
fila 3: C003 @ Arequipa
desalineado detectado`,
        },
        why: "`start=1` numera para humanos (“fila 1…”); el índice interno de la lista sigue siendo 0-based. Validar `len(a)==len(b)` (o `zip(..., strict=True)` en 3.10+) evita el truncamiento silencioso de `zip`, que corrompe tasas de reject cuando una columna llega incompleta. Observa el try/except: el error ruidoso es el diseño correcto del pipeline.",
        retrospective:
          "Un resultado corto puede parecer ordenado y seguir siendo falso. La evidencia correcta no es «zip funcionó», sino «demostré que las longitudes coinciden». Lleva esa regla a importaciones CSV, respuestas de API o cualquier par de columnas antes de practicar el fallo ruidoso.",
      },
      {
        demoId: "S04-T2-A-DEMO",
        subtopicId: "S04-T2-A",
        environment: "browser-pyodide",
        description: "while con centinela END sobre buffer de líneas",
        preamble:
          "Haz una traza de tres columnas —`i`, `line`, `out`— antes de pulsar Run. El buffer contiene dos datos, `END` y una línea posterior que jamás debe entrar. La garantía de terminación combina dos hechos: `i` avanza en cada vuelta y el centinela provoca `break`. Predice el índice final y justifícalo.",
        code: {
          language: 'python',
          title: "S04-T2-A-DEMO — while_end",
          code: `buf = ["Ana|Lima", "Luis|Cusco", "END", "ignorada"]
i = 0
out = []
while i < len(buf):
    line = buf[i]
    i += 1
    if line == "END":
        break
    out.append(line)
print(out)
print("indice final", i)
`,
          output: `['Ana|Lima', 'Luis|Cusco']
indice final 3`,
        },
        why: "El centinela marca el fin del batch: `END` no se procesa y lo posterior no contamina contadores. Avanzar `i` en cada vuelta evita el bucle infinito; si la condición nunca cambia, el while no termina. El `indice final 3` es intencional: ya pasaste el END.",
        retrospective:
          "Una prueba de terminación cabe en una frase: «`i` aumenta y no puede superar la longitud; `END` puede detener antes». Si no puedes escribir una frase equivalente para tu `while`, todavía no está listo. Usa esa disciplina en reintentos, colas y lecturas de flujo.",
      },
      {
        demoId: "S04-T2-B-DEMO",
        subtopicId: "S04-T2-B",
        environment: "browser-pyodide",
        description: "continue salta vacíos; break corta en ERROR fatal",
        preamble:
          "Clasifica cada entrada antes de ejecutar: vacío = ruido recuperable; `ERROR` = condición fatal; `ok:*` = dato conservable. Ahora predice si `ok:3` aparecerá. El orden de las ramas importa: `continue` omite solo la vuelta actual, mientras `break` protege el resumen de todo lo posterior.",
        code: {
          language: 'python',
          title: "S04-T2-B-DEMO — break_continue",
          code: `lines = ["", "ok:1", "", "ok:2", "ERROR", "ok:3"]
kept = []
for ln in lines:
    if not ln:
        continue  # salta vacíos
    if ln.startswith("ERROR"):
        print("fatal, stop")
        break  # corta el lote
    kept.append(ln)
print("kept", kept)
`,
          output: `fatal, stop
kept ['ok:1', 'ok:2']`,
        },
        why: "`continue` limpia ruido (filas vacías) y sigue con la siguiente. `break` detiene el lote ante un error fatal de configuración: las filas posteriores no deben inflar contadores de éxito. Confundir ambos deja pasar basura o corta demasiado pronto.",
        retrospective:
          "La pregunta no es «¿qué palabra clave recuerdo?», sino «¿sigue siendo confiable continuar?». Si sí, `continue`; si no, `break`. Aplica la misma clasificación a una línea vacía, una respuesta 5xx y un centinela: pueden parecer anomalías, pero no tienen la misma consecuencia.",
      },
      {
        demoId: "S04-T3-A-DEMO",
        subtopicId: "S04-T3-A",
        environment: "browser-pyodide",
        description: "Contadores accept/reject/review y tasa con denominador",
        preamble:
          "Predice dos invariantes antes de ejecutar: la suma de `accept`, `reject` y `review` debe ser 5, y la tasa de reject debe usar esas cinco decisiones intentadas. El bucle hace un solo pase; el denominador no se negocia después de ver el resultado. Comprueba por qué 2/5 es honesto y 2/3 no lo sería.",
        code: {
          language: 'python',
          title: "S04-T3-A-DEMO — contadores",
          code: `statuses = ["accept", "reject", "review", "accept", "reject"]
counts = {"accept": 0, "reject": 0, "review": 0}
for s in statuses:
    if s in counts:
        counts[s] += 1
n = len(statuses)
tasa_reject = counts["reject"] / n if n else None
print(counts)
print("n", n, "tasa_reject", tasa_reject)
`,
          output: `{'accept': 2, 'reject': 2, 'review': 1}
n 5 tasa_reject 0.4`,
        },
        why: "Un solo pase O(n) llena los contadores del resumen. La tasa usa el total de registros **intentados**, no “solo accepts”. Si el lote estuviera vacío, `n` sería 0 y reportarías `None` en vez de dividir (eso lo practicas en We Do).",
        retrospective:
          "Una tasa sin población de referencia es decoración. Di en voz alta: «dos rejects entre cinco intentos». Luego cambia mentalmente el lote a vacío: `None` expresa ausencia de observaciones; cero afirmaría que observaste una tasa perfecta. Esa distinción reaparece en cualquier indicador operativo.",
      },
      {
        demoId: "S04-T3-B-DEMO",
        subtopicId: "S04-T3-B",
        environment: "browser-pyodide",
        description: "Comprehensions para filtrar rejects del resumen",
        preamble:
          "Lee la comprehension como una oración: «toma el id de cada fila si su status es reject». Predice la lista resultante y conserva aparte el denominador del lote completo. Si necesitas insertar prints, excepciones o varias decisiones dentro de esa oración, ya descubriste el límite de esta forma compacta.",
        code: {
          language: 'python',
          title: "S04-T3-B-DEMO — comp_rejects",
          code: `rows = [
    {"id": "C1", "status": "accept"},
    {"id": "C2", "status": "reject"},
    {"id": "C3", "status": "reject"},
]
rejects = [r["id"] for r in rows if r["status"] == "reject"]
tasa = len(rejects) / len(rows)
print(rejects, "tasa", tasa)
`,
          output: `['C2', 'C3'] tasa 0.6666666666666666`,
        },
        why: "Una comprehension legible filtra sin un for largo cuando el criterio es simple. El denominador de la tasa sigue siendo `len(rows)` del lote completo. Si hay varias ramas, try/except o efectos laterales, vuelve al for clásico.",
        retrospective:
          "La brevedad solo ayuda cuando preserva la intención a primera lectura. Usa comprehension para una transformación o filtro simple; vuelve al `for` cuando necesites historia, efectos o varias ramas. El criterio es la claridad del próximo lector, no el menor número de líneas.",
      },
      {
        demoId: "S04-T4-A-DEMO",
        subtopicId: "S04-T4-A",
        environment: "browser-pyodide",
        description: "Tabla TRACE de contador durante el lote",
        preamble:
          "Cubre el `output` y construye cuatro filas de una tabla con `i`, `flag` y `n_ok`. El invariante es sencillo: `n_ok` equivale a la cantidad de `True` observados hasta ese instante. La fila con `False` debe conservar el contador. Solo después compara tu película mental con la traza ejecutada.",
        code: {
          language: 'python',
          title: "S04-T4-A-DEMO — traza",
          code: `flags = [True, False, True, True]
n_ok = 0
print("i flag n_ok")
for i, f in enumerate(flags):
    if f:
        n_ok += 1
    print(i, f, n_ok)
print("FINAL", n_ok)
`,
          output: `i flag n_ok
0 True 1
1 False 1
2 True 2
3 True 3
FINAL 3`,
        },
        why: "La traza hace visible cuándo y por qué sube el contador. Si la tabla no cuadra con el print final, el bug está en la actualización del estado — no en “Python raro”. Es la base para depurar resúmenes del gate.",
        retrospective:
          "No corrijas el total final al azar: busca la primera fila donde estado esperado y estado real se separan. Allí vive el defecto. Esta técnica funciona igual para saldos, inventarios y contadores de eventos; la tabla cambia, el método permanece.",
      },
      {
        demoId: "S04-T4-B-DEMO",
        subtopicId: "S04-T4-B",
        environment: "browser-pyodide",
        description: "Detectar O(n²) ingenuo y off-by-one en range",
        preamble:
          "Antes de ejecutar, calcula los pasos para `n=4`: un recorrido visita 4 elementos; el doble recorrido visita 16 pares. Luego inspecciona `range(1, len(vals))` y predice qué valor queda invisible. Rendimiento e integridad se unen aquí: un algoritmo puede ser lento y, además, contar una población incompleta.",
        code: {
          language: 'python',
          title: "S04-T4-B-DEMO — costo_obo",
          code: `n = 4
steps_linear = sum(1 for _ in range(n))
steps_quad = sum(1 for _ in range(n) for __ in range(n))
print("linear", steps_linear, "quad", steps_quad)
vals = [10, 20, 30]
skipped_first = []
for i in range(1, len(vals)):  # omite el índice 0 — off-by-one de negocio
    skipped_first.append(vals[i])
print("skipped_first", skipped_first)
`,
          output: `linear 4 quad 16
skipped_first [20, 30]`,
        },
        why: "Con n=4 ves 4 pasos lineales frente a 16 cuadráticos: el doble for no es “más rigor”, es más costo. `range(1, len(vals))` omite el índice 0 — off-by-one de negocio que deja el primer registro fuera del resumen. Prefiere un solo pase O(n) para tasas.",
        retrospective:
          "Pregunta primero qué relación exige el problema. Contar rechazos requiere mirar cada fila una vez; comparar cada fila con todas las demás sería otro problema. Y si solo necesitas el valor, elimina el índice: `for x in xs` borra de raíz una familia completa de off-by-one.",
      },
    ],
  },
  weDo: {
    intro: "En cada subtema avanzas de **E1 guiado → E2 independiente → E3 transferencia**. Antes de editar, escribe una predicción del fallo; después de corregir, explica qué invariante recuperaste y prueba un caso límite. Son 24 ejercicios, no una carrera: trabaja un trío por vez y usa las pistas de menor a mayor ayuda. El `output` es evidencia, no decoración, y todos los datos son sintéticos.",
    steps: [
      {
        subtopicId: "S04-T1-A",
        kind: "guided",
        title: "Imprimir regiones y range(3)",
        preamble:
          "- **Contexto:** un equipo internacional recibe filas de distintas oficinas y, a veces, necesita numerar posiciones con `range`.\n- **Meta:** practicar `for` por valor y ver el stop exclusivo de `range`.\n- **Éxito:** tres líneas `Quito` / `Bogotá` / `Madrid` y luego `[0, 1, 2]`.\n- **Límites:** un for simple sin índices manuales; no mutes `regiones`; no dejes el `print('ok', True)` del starter.",
        id: "S04-T1-A-E1",
        instruction:
          "1. Revisa el starter: el for de regiones ya está bien.\n2. El DEFECT es no imprimir `list(range(3))` (hay un `print('ok', True)` de relleno).\n3. Sustituye ese print por `print(list(range(3)))`.\n4. Ejecuta y compara con la salida esperada (sin texto extra).",
        hint: "El for sobre regiones ya imprime bien; el problema está en el print final de relleno.",
        hints: [
          "El for sobre regiones ya imprime bien; el problema está en el print final de relleno.",
          "El stop de range es exclusivo: con 3 posiciones debes ver 0, 1 y 2 — no 1..3. Sustituye solo el print de relleno.",
        ],
        edgeCases: ["range stop exclusivo"],
        tests: "Quito / Bogotá / Madrid + [0,1,2]",
        feedback:
          "El for de regiones ya estaba bien: el fallo era el print de relleno. Si tu salida termina en `[0, 1, 2]` y no en `ok True`, cerraste el contrato del stop exclusivo.",
        retrospective:
          "Compara `list(range(3))` con `list(range(1, 4))`: ambas listas tienen tres valores, pero representan fronteras distintas. Explica cuál usarías para posiciones internas y cuál para rótulos humanos. Luego traslada esa elección a un lote de tamaño cero: el recorrido debe producir cero filas sin tratamiento especial.",
        starterCode: {
          language: 'python',
          title: "for_regiones.py",
          code: `# CASO-LIM-004 · for sobre lista
# DEFECT: no imprime range(3)
regiones = ["Quito", "Bogotá", "Madrid"]
for r in regiones:
    print(r)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "for_regiones.py",
          code: `regiones = ["Quito", "Bogotá", "Madrid"]
for r in regiones:
    print(r)
print(list(range(3)))`,
          output: `Quito
Bogotá
Madrid
[0, 1, 2]`,
        },
      },
      {
        subtopicId: "S04-T1-A",
        kind: "independent",
        title: "Contar adultos con for (sin comprehension)",
        preamble:
          "- **Contexto:** en el resumen de un lote necesitas tasas por condición, no solo listar filas.\n- **Meta:** practicar un contador manual en un `for` (base del gate de resúmenes).\n- **Éxito:** imprimes un solo entero; con `edades = [30, 17, 45, 22]` el valor es `3`.\n- **Límites:** no uses list comprehension; no mutes la lista; frontera `>= 18` inclusiva.",
        id: "S04-T1-A-E2",
        instruction:
          "1. El starter cuenta *todas* las edades (DEFECT).\n2. Dentro del for, incrementa solo si `e >= 18`.\n3. Imprime únicamente el contador (sin `ok True`).",
        hint: "Inicializa n=0; dentro del for decide con if antes de incrementar.",
        hints: [
          "Inicializa n=0; dentro del for decide con if antes de incrementar.",
          "Frontera inclusiva: 18 cuenta. Esperado: 3 (30, 45, 22).",
        ],
        edgeCases: ["frontera 18 inclusiva"],
        tests: "assert n == 3",
        feedback:
          "El contador manual en un pase entrena el mismo hábito que `n_accept`/`n_reject` del gate. Sin la condición, cuentas el tamaño de la lista y la tasa miente.",
        retrospective:
          "El contador debe subir por un evento definido, no por cada vuelta sin más. Cambia mentalmente `>= 18` por `> 18` y predice el resultado antes de ejecutar: esa única frontera puede alterar una métrica de negocio. Describe también qué ocurre con una lista vacía.",
        starterCode: {
          language: 'python',
          title: "contar_mayores.py",
          code: `# CASO-LIM-004 · contar >=18
# DEFECT: cuenta todos
edades = [30, 17, 45, 22]
n = 0
for e in edades:
    n += 1
print(n)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "contar_mayores.py",
          code: `edades = [30, 17, 45, 22]
n = 0
for e in edades:
    if e >= 18:
        n += 1
print(n)`,
          output: `3`,
        },
      },
      {
        subtopicId: "S04-T1-A",
        kind: "transfer",
        title: "Reportar ids con monto positivo",
        preamble:
          "- **Contexto:** en auditoría de intake a veces reportas solo filas con monto usable, sin borrar el raw del lote.\n- **Meta:** filtrar al *imprimir* con `for` + `if` sobre dicts (misma lógica de T1, nueva superficie).\n- **Éxito:** líneas `C1` y `C4`; luego `n_original 4` (lista intacta).\n- **Límites:** no mutes `lote`; no imprimas montos 0 ni negativos; no uses comprehension si aún no la dominas aquí.",
        id: "S04-T1-A-E3",
        instruction:
          "1. El starter imprime todos los ids y montos (DEFECT).\n2. Imprime solo `reg[\"id\"]` cuando `reg[\"monto\"] > 0`.\n3. Al final imprime `n_original` con `len(lote)` para demostrar que no mutaste.",
        hint: "Filtra con if sobre reg['monto']; no borres elementos de la lista.",
        hints: [
          "Filtra con if sobre reg['monto']; no borres elementos de la lista.",
          "0 y negativos fuera. Al final: print(\"n_original\", len(lote)).",
        ],
        edgeCases: ["monto 0 excluido", "lista no mutada"],
        tests: "C1 y C4; len 4",
        feedback:
          "Si imprimiste C2 o C3, el filtro `> 0` no se aplicó. Si no ves `n_original 4`, no demostraste que el lote quedó intacto — el reporte y el almacenamiento no son el mismo acto.",
        retrospective:
          "Filtrar una vista y modificar la fuente son operaciones distintas. La línea `n_original 4` funciona como evidencia de que el lote sobrevivió intacto. Piensa en una auditoría posterior: ¿qué explicación perderías si borrases los registros con cero o negativo en vez de conservarlos y decidir qué mostrar?",
        starterCode: {
          language: 'python',
          title: "filtrar_montos.py",
          code: `# CASO-LIM-004 · filtrar montos >0
# DEFECT: incluye 0 y negativos
lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]
for reg in lote:
    print(reg["id"], reg["monto"])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "filtrar_montos.py",
          code: `lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]
for reg in lote:
    if reg["monto"] > 0:
        print(reg["id"])
print("n_original", len(lote))`,
          output: `C1
C4
n_original 4`,
        },
      },
      {
        subtopicId: "S04-T1-B",
        kind: "guided",
        title: "Numerar filas con enumerate(start=1)",
        preamble:
          "- **Contexto:** al diagnosticar un reject, el humano lee “fila 1”, no “índice 0”.\n- **Meta:** usar `enumerate` con `start=1` sin armar el índice a mano.\n- **Éxito:** exactamente `fila 1: A`, `fila 2: B`, `fila 3: C`.\n- **Límites:** no uses `range(len(ids))`; no dejes `start` en 0.",
        id: "S04-T1-B-E1",
        instruction:
          "1. El starter usa `enumerate(ids)` sin `start` (DEFECT → fila 0).\n2. Cambia a `enumerate(ids, start=1)`.\n3. Mantén el f-string `fila {i}: {x}`; quita el print de relleno.",
        hint: "enumerate acepta un segundo argumento start; por defecto es 0.",
        hints: [
          "enumerate acepta un segundo argumento start; por defecto es 0.",
          "Pasa el start humano en el segundo argumento; quita el print de relleno al final.",
        ],
        edgeCases: ["start=1"],
        tests: "fila 1..3",
        feedback:
          "Si ves `fila 0:`, el `start` no se pasó (default 0). Con `start=1` las tres líneas deben ser `fila 1: A` … `fila 3: C`, sin relleno.",
        retrospective:
          "Un rótulo para personas puede empezar en 1 sin cambiar la posición real de la lista. Explica por qué «fila 2» puede corresponder al índice 1 y qué error aparecería si reutilizaras ese rótulo para acceder a `ids[i]`. La presentación y el almacenamiento no comparten necesariamente la misma numeración.",
        starterCode: {
          language: 'python',
          title: "enumerate_filas.py",
          code: `# CASO-LIM-004 · enumerate start=1
# DEFECT: start=0
ids = ["A", "B", "C"]
for i, x in enumerate(ids):
    print(f"fila {i}: {x}")
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "enumerate_filas.py",
          code: `ids = ["A", "B", "C"]
for i, x in enumerate(ids, start=1):
    print(f"fila {i}: {x}")`,
          output: `fila 1: A
fila 2: B
fila 3: C`,
        },
      },
      {
        subtopicId: "S04-T1-B",
        kind: "independent",
        title: "Emparejar columnas con zip (y ver el silencio)",
        preamble:
          "- **Contexto:** nombres y edades de un intake deben ir en paralelo, no en producto cartesiano.\n- **Meta:** emparejar con `zip` y observar el truncamiento silencioso al acortar una columna.\n- **Éxito:** `Ana=30`, `Luis=25`, `María=40` y luego `zip corto [('Ana', 30)]`.\n- **Límites:** un solo for sobre `zip`; no bucles anidados; aquí solo *observas* el silencio (en código real validarías `len`).",
        id: "S04-T1-B-E2",
        instruction:
          "1. El starter anida dos fors (DEFECT: 9 líneas basura).\n2. Recorre `zip(nombres, edades)` e imprime `nombre=edad`.\n3. Imprime `zip corto` con `list(zip(nombres, edades[:1]))` para ver la pérdida.",
        hint: "zip empareja en paralelo y se detiene en la secuencia más corta.",
        hints: [
          "zip empareja en paralelo y se detiene en la secuencia más corta.",
          "Tras los 3 pares, imprime zip corto con edades recortadas a un elemento.",
        ],
        edgeCases: ["truncamiento silencioso"],
        tests: "3 pares + 1 par en zip corto",
        feedback:
          "Bucles anidados multiplican pares (9 líneas); `zip` alinea en paralelo. Si viste `zip corto` con un solo par, ya sentiste el truncamiento silencioso que miente resúmenes.",
        retrospective:
          "El doble `for` crea combinaciones; `zip` crea pares posicionales. Sin embargo, un `zip` corto puede ocultar justo la fila problemática y mejorar artificialmente una tasa. Formula el control previo que convertiría esa omisión silenciosa en un error visible.",
        starterCode: {
          language: 'python',
          title: "zip_columnas.py",
          code: `# CASO-LIM-004 · zip nombres edades
# DEFECT: nested loops (producto cartesiano)
nombres = ["Ana", "Luis", "María"]
edades = [30, 25, 40]
for n in nombres:
    for e in edades:
        print(f"{n}={e}")
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "zip_columnas.py",
          code: `nombres = ["Ana", "Luis", "María"]
edades = [30, 25, 40]
for n, e in zip(nombres, edades):
    print(f"{n}={e}")
print("zip corto", list(zip(nombres, edades[:1])))`,
          output: `Ana=30
Luis=25
María=40
zip corto [('Ana', 30)]`,
        },
      },
      {
        subtopicId: "S04-T1-B",
        kind: "transfer",
        title: "zip_strict: fallar si hay desalineación",
        preamble:
          "- **Contexto:** en un pipeline de calidad, desalineación de columnas debe ser error ruidoso, no pérdida silenciosa.\n- **Meta:** implementar validación de longitudes (equivalente pedagógico a `zip(..., strict=True)`).\n- **Éxito:** imprime `DESALINEADO` y luego `OK` (en ese orden).\n- **Límites:** lanza `ValueError` si `len(a) != len(b)`; no uses la API `strict=` si tu entorno no es 3.10+ — el helper basta.",
        id: "S04-T1-B-E3",
        instruction:
          "1. Completa `zip_strict`: si longitudes difieren, `raise ValueError`.\n2. Primer intento con listas 3 vs. 2 → captura y `print(\"DESALINEADO\")`.\n3. Segundo intento con listas de longitud 2 → `print(\"OK\")` si no lanza.",
        hint: "Compara len(a) y len(b) antes de zip; si difieren, raise ValueError.",
        hints: [
          "Compara len(a) y len(b) antes de zip; si difieren, raise ValueError.",
          "Necesitas dos bloques try/except: uno que imprima DESALINEADO y otro OK.",
        ],
        edgeCases: ["strict alignment"],
        tests: "DESALINEADO luego OK",
        feedback:
          "Si no sale `DESALINEADO` primero, el `raise` no corrió con longitudes 3 vs. 2. Si no sale `OK` después, el segundo bloque no validó un par alineado. El silencio de `zip` sin assert es el bug a evitar.",
        retrospective:
          "Aquí fallar pronto es una forma de cuidar los datos. Si tres ids llegan con dos edades, no existe un emparejamiento total que puedas defender. Explica por qué `ValueError` conserva más verdad que una lista de dos pares aparentemente correctos, y dónde pondrías esta comprobación en una importación real.",
        starterCode: {
          language: 'python',
          title: "zip_strict.py",
          code: `# CASO-LIM-004 · zip_strict
def zip_strict(a, b):
    # DEFECT: no valida longitudes
    return list(zip(a, b))

try:
    print(zip_strict([1, 2, 3], [10, 20]))
except ValueError:
    print("DESALINEADO")
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "zip_strict.py",
          code: `def zip_strict(a, b):
    if len(a) != len(b):
        raise ValueError("desalineado")
    return list(zip(a, b))
try:
    zip_strict([1, 2, 3], [10, 20])
except ValueError:
    print("DESALINEADO")
try:
    zip_strict([1, 2], [3, 4])
    print("OK")
except ValueError:
    print("DESALINEADO")`,
          output: `DESALINEADO
OK`,
        },
      },
      {
        subtopicId: "S04-T2-A",
        kind: "guided",
        title: "While hasta centinela vacío",
        preamble:
          "- **Contexto:** un archivo de intake a veces trae basura *después* de una línea en blanco que marca fin de lote.\n- **Meta:** con `while` e índice, cortar en string vacío **sin incluirlo**.\n- **Éxito:** imprime `['r1', 'r2']` (sin `r3`).\n- **Límites:** el blank es centinela → `break`, no `continue`; avanza `i` siempre.",
        id: "S04-T2-A-E1",
        instruction:
          "1. El starter hace `continue` en blank (DEFECT: sigue y se come `r3`).\n2. Cambia a `break` cuando `line == \"\"`.\n3. Imprime solo `out`.",
        hint: "continue salta la fila y sigue; break cierra el lote. Aquí el blank es fin, no basura intermitente.",
        hints: [
          "continue salta la fila y sigue; break cierra el lote. Aquí el blank es fin, no basura intermitente.",
          "Resultado: ['r1','r2']; r3 queda fuera porque el centinela cortó.",
        ],
        edgeCases: ["centinela vacío"],
        tests: "['r1','r2']",
        feedback:
          "Si tu lista incluye `r3`, usaste `continue` (saltas el blank y sigues). Con `break` en `\"\"` el centinela cierra el lote y la basura posterior no entra.",
        retrospective:
          "La misma cadena vacía puede significar ruido o fin de lote según el contrato. En este ejercicio es centinela: usar `continue` incluiría `r3` y rompería el límite del batch. Escribe una frase de contrato que permita a otro programador decidir entre ambas palabras clave sin mirar la solución.",
        starterCode: {
          language: 'python',
          title: "while_vacio.py",
          code: `# CASO-LIM-004 · while break en blank
# DEFECT: continue en blank (no corta)
lines = ["r1", "r2", "", "r3"]
i = 0
out = []
while i < len(lines):
    line = lines[i]
    i += 1
    if line == "":
        continue
    out.append(line)
print(out)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "while_vacio.py",
          code: `lines = ["r1", "r2", "", "r3"]
i = 0
out = []
while i < len(lines):
    line = lines[i]
    i += 1
    if line == "":
        break
    out.append(line)
print(out)`,
          output: `['r1', 'r2']`,
        },
      },
      {
        subtopicId: "S04-T2-A",
        kind: "independent",
        title: "Reintentos con tope MAX",
        preamble:
          "- **Contexto:** un reintento de red o de parseo no puede colgarse: siempre hay cota superior.\n- **Meta:** `while intentos < MAX` con variable de control que sube cada vuelta.\n- **Éxito:** `intento 1`, `intento 2`, `intento 3`, luego `done 3`.\n- **Límites:** incrementa *dentro* del while; no pongas `while True` aquí; no omitas los prints por intento.",
        id: "S04-T2-A-E2",
        instruction:
          "1. El starter ya incrementa y imprime `done`, pero no reporta cada intento (DEFECT).\n2. Dentro del while, tras `intentos += 1`, imprime `f\"intento {intentos}\"`.\n3. Mantén `print(\"done\", intentos)` al salir.",
        hint: "intentos += 1 dentro del while es la variable de control que evita el infinito.",
        hints: [
          "intentos += 1 dentro del while es la variable de control que evita el infinito.",
          "Tras cada incremento, imprime el número de intento con f-string; al salir, done.",
        ],
        edgeCases: ["variable de control"],
        tests: "3 intentos + done 3",
        feedback:
          "Si solo ves `done 3` sin `intento 1..3`, el contador sube pero no reportas cada vuelta. El f-string va **dentro** del while, tras el incremento.",
        retrospective:
          "Demuestra la terminación: `intentos` empieza en 0, aumenta en uno y `MAX` vale 3. Si mueves el incremento fuera, la condición nunca cambia durante el bucle. En un sistema real, añade además tiempo límite y registro de intentos; una cota numérica no explica por sí sola por qué falló el servicio.",
        starterCode: {
          language: 'python',
          title: "while_reintentos.py",
          code: `# CASO-LIM-004 · reintentos while
# DEFECT: no imprime intentos
intentos = 0
MAX = 3
while intentos < MAX:
    intentos += 1
print("done", intentos)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "while_reintentos.py",
          code: `intentos = 0
MAX = 3
while intentos < MAX:
    intentos += 1
    print(f"intento {intentos}")
print("done", intentos)`,
          output: `intento 1
intento 2
intento 3
done 3`,
        },
      },
      {
        subtopicId: "S04-T2-A",
        kind: "transfer",
        title: "Cola con pause y break",
        preamble:
          "- **Contexto:** un worker saca jobs de una cola hasta una condición de negocio (pausa), no hasta vaciar siempre.\n- **Meta:** `while cola` + `pop(0)` + `break` condicional, dejando el resto visible.\n- **Éxito:** `job1`, `job2`, `PAUSE`, `rest ['job3']`.\n- **Límites:** no uses `for` sobre una copia si practicas while; no vacíes la cola tras el break.",
        id: "S04-T2-A-E3",
        instruction:
          "1. El starter imprime jobs y hace break en `job2`, pero no imprime `PAUSE` ni la cola restante (DEFECT parcial).\n2. Tras detectar `job2`, imprime `PAUSE` y `break`.\n3. Fuera del while, un solo print: `print(\"rest\", cola)` (debe quedar `['job3']`).",
        hint: "while cola: saca con pop(0); el break deja el resto en la lista.",
        hints: [
          "while cola: saca con pop(0); el break deja el resto en la lista.",
          "Un solo print al final: print(\"rest\", cola) — debe quedar ['job3'].",
        ],
        edgeCases: ["break deja resto"],
        tests: "job1 job2 PAUSE rest [job3]",
        feedback:
          "Si falta `PAUSE` o `rest ['job3']`, el break cortó sin reportar. Un print al final con la cola residual cierra el contrato de auditoría.",
        retrospective:
          "Detener una cola no equivale a perderla: el trabajo residual debe quedar visible y auditable. Predice qué jobs se procesarían si `PAUSE` usara `continue`; después explica por qué ese comportamiento incumple el contrato aunque el programa termine sin excepción.",
        starterCode: {
          language: 'python',
          title: "while_cola.py",
          code: `# CASO-LIM-004 · cola con pause
# DEFECT: no imprime PAUSE
cola = ["job1", "job2", "job3"]
while cola:
    job = cola.pop(0)
    print(job)
    if job == "job2":
        break
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "while_cola.py",
          code: `cola = ["job1", "job2", "job3"]
while cola:
    job = cola.pop(0)
    print(job)
    if job == "job2":
        print("PAUSE")
        break
print("rest", cola)`,
          output: `job1
job2
PAUSE
rest ['job3']`,
        },
      },
      {
        subtopicId: "S04-T2-B",
        kind: "guided",
        title: "Saltar vacíos con continue",
        preamble:
          "- **Contexto:** archivos de intake traen filas en blanco o solo espacios que no son regiones.\n- **Meta:** filtrar con `continue` cuando `not x.strip()`.\n- **Éxito:** dos líneas: `Lima` y `Cusco`.\n- **Límites:** no uses `break` (no es fin de lote, solo basura); no mutes `raw`.",
        id: "S04-T2-B-E1",
        instruction:
          "1. El starter imprime también blanks (DEFECT).\n2. Si `not x.strip()`, `continue`.\n3. Si no, `print(x)`.",
        hint: "strip quita espacios; si el resultado es vacío, salta con continue.",
        hints: [
          "strip quita espacios; si el resultado es vacío, salta con continue.",
          "Deben quedar solo dos líneas de región real; break aquí cerraría el lote por error.",
        ],
        edgeCases: ["whitespace only"],
        tests: "Lima\\nCusco",
        feedback:
          "Si aún imprime líneas en blanco, falta el `if not x.strip(): continue` **antes** del print. `break` aquí cerraría el lote por error.",
        retrospective:
          "`\"  \"` es una cadena verdadera para Python y, aun así, está vacía para el negocio. `strip()` traduce esa diferencia de representación. Contrasta este caso recuperable con un centinela: ambos pueden parecer blancos, pero uno se salta y el otro detiene según el contrato de entrada.",
        starterCode: {
          language: 'python',
          title: "continue_vacios.py",
          code: `# CASO-LIM-004 · continue blanks
# DEFECT: imprime blanks
raw = ["  ", "Lima", "", "Cusco"]
for x in raw:
    print(x)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "continue_vacios.py",
          code: `raw = ["  ", "Lima", "", "Cusco"]
for x in raw:
    if not x.strip():
        continue
    print(x)`,
          output: `Lima
Cusco`,
        },
      },
      {
        subtopicId: "S04-T2-B",
        kind: "independent",
        title: "Cortar el lote en error fatal (5xx)",
        preamble:
          "- **Contexto:** un 5xx de configuración no es “otra fila más”: debe detener el procesamiento del lote.\n- **Meta:** `break` en `code >= 500`, contar solo los `ok` previos.\n- **Éxito:** `ok`, `ok`, `STOP`, `n_ok 2` (el 200 final no se procesa).\n- **Límites:** no solo imprimas error y sigas; no cuentes el 500 como ok.",
        id: "S04-T2-B-E2",
        instruction:
          "1. El starter imprime `ERR` y sigue (DEFECT: no break; el último 200 se cuenta).\n2. Si `c >= 500`: imprime `STOP`, `break`.\n3. Si no: imprime `ok` e incrementa `n_ok`.\n4. Al final imprime `n_ok` con etiqueta.",
        hint: "break no procesa el 200 final; el 500 no es un ok.",
        hints: [
          "break no procesa el 200 final; el 500 no es un ok.",
          "Salida esperada: ok, ok, STOP, n_ok 2.",
        ],
        edgeCases: ["break corta el lote"],
        tests: "ok ok STOP n_ok 2",
        feedback:
          "Si procesas el 200 final, no hubo `break`. Si imprimiste `ERR` en vez de `STOP`, el contrato de salida no cuadra aunque el conteo sea 2.",
        retrospective:
          "El 500 no es una fila rechazada: indica que ya no puedes confiar en el proceso. Por eso ni él ni el 200 posterior cuentan como éxito. Explica qué evidencia necesitarías para cambiar ese `break` por reintento; sin ese contrato adicional, continuar sería fingir disponibilidad.",
        starterCode: {
          language: 'python',
          title: "break_fatal.py",
          code: `# CASO-LIM-004 · break en 5xx
# DEFECT: no break
codes = [200, 200, 500, 200]
n_ok = 0
for c in codes:
    if c >= 500:
        print("ERR")
    else:
        print("ok")
        n_ok += 1
print(n_ok)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "break_fatal.py",
          code: `codes = [200, 200, 500, 200]
n_ok = 0
for c in codes:
    if c >= 500:
        print("STOP")
        break
    print("ok")
    n_ok += 1
print("n_ok", n_ok)`,
          output: `ok
ok
STOP
n_ok 2`,
        },
      },
      {
        subtopicId: "S04-T2-B",
        kind: "transfer",
        title: "while True con END y salvaguarda",
        preamble:
          "- **Contexto:** a veces el patrón natural es `while True` + break; es legítimo solo si la salida es obvia y hay red de seguridad.\n- **Meta:** leer buffer con índice, break en `END`, guard `i > 10`.\n- **Éxito:** imprime `['a', 'b']` (sin `END`).\n- **Límites:** no proceses END como dato; no quites la salvaguarda; avanza `i` siempre.",
        id: "S04-T2-B-E3",
        instruction:
          "1. El starter agrega todo al `out`, incluido END (DEFECT).\n2. Tras leer `item`, si es `END` haz `break` *antes* de append.\n3. Mantén el `if i > 10: raise ...`.",
        hint: "while True es aceptable si el break del centinela y la salvaguarda están claros.",
        hints: [
          "while True es aceptable si el break del centinela y la salvaguarda están claros.",
          "No proceses END como dato: break antes del append.",
        ],
        edgeCases: ["while True + break + max"],
        tests: "['a','b']",
        feedback:
          "Si `out` incluye `END`, el break llegó tarde (o no llegó). El centinela se chequea **antes** del append; la guard `i > 10` se mantiene intacta.",
        retrospective:
          "`while True` no es una promesa de infinito si la salida es visible, alcanzable y testeada. Señala aquí el `break` de negocio y el límite de seguridad; luego imagina que falta cada uno por separado. Para una lista ya materializada, explica por qué `for` expresaría mejor la intención.",
        starterCode: {
          language: 'python',
          title: "while_true_guard.py",
          code: `# CASO-LIM-004 · while True + END
# BUG intencional: no rompe en END
buf = ["a", "b", "END"]
i = 0
out = []
while True:
    if i > 10:
        raise RuntimeError("guard")
    item = buf[i]
    i += 1
    out.append(item)
print(out)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "while_true_guard.py",
          code: `buf = ["a", "b", "END"]
i = 0
out = []
while True:
    if i > 10:
        raise RuntimeError("guard")
    item = buf[i]
    i += 1
    if item == "END":
        break
    out.append(item)
print(out)`,
          output: `['a', 'b']`,
        },
      },
      {
        subtopicId: "S04-T3-A",
        kind: "guided",
        title: "Contadores accept/reject/total en un pase",
        preamble:
          "- **Contexto:** el resumen del batch necesita tres números honestos: accept, reject y total intentado.\n- **Meta:** incrementar contadores en un solo `for` O(n).\n- **Éxito:** imprime `2 1 3` (accept, reject, total).\n- **Límites:** `n_total` sube en *cada* fila, no solo en accept; no uses comprehensions aquí.",
        id: "S04-T3-A-E1",
        instruction:
          "1. El starter no toca `n_total` (DEFECT → imprime 0 al final).\n2. Al inicio de cada iteración (o al final simétrico), `n_total += 1`.\n3. Mantén los if de accept/reject; imprime los tres en ese orden.",
        hint: "n_total debe subir por cada fila del lote, no solo cuando hay accept.",
        hints: [
          "n_total debe subir por cada fila del lote, no solo cuando hay accept.",
          "Esperado: 2 accept, 1 reject, total 3.",
        ],
        edgeCases: ["un pase"],
        tests: "2 1 3",
        feedback:
          "Si al final ves `2 1 0`, accept/reject van bien pero `n_total` nunca subió. El `+= 1` de total va en **cada** iteración, no solo en accept.",
        retrospective:
          "Comprueba el invariante `n_accept + n_reject == n_total` para este fixture. Si olvidas la rama reject, el programa aún imprime números, pero ya no puede explicar el lote. Añade mentalmente un status review y decide si el invariante debe ampliarse o si review queda fuera por contrato.",
        starterCode: {
          language: 'python',
          title: "contadores_base.py",
          code: `# CASO-LIM-004 · conteo accept/reject
# DEFECT: no incrementa n_total bien
sts = ["accept", "reject", "accept"]
n_accept = n_reject = n_total = 0
for s in sts:
    if s == "accept":
        n_accept += 1
    elif s == "reject":
        n_reject += 1
print(n_accept, n_reject, n_total)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "contadores_base.py",
          code: `sts = ["accept", "reject", "accept"]
n_accept = n_reject = n_total = 0
for s in sts:
    n_total += 1
    if s == "accept":
        n_accept += 1
    elif s == "reject":
        n_reject += 1
print(n_accept, n_reject, n_total)`,
          output: `2 1 3`,
        },
      },
      {
        subtopicId: "S04-T3-A",
        kind: "independent",
        title: "Tasa de reject sin división por cero",
        preamble:
          "- **Contexto:** un lote vacío no es tasa 0 automática ni crash: se reporta `None`.\n- **Meta:** `tasa_reject = n_reject / n_total` solo si `n_total > 0`.\n- **Éxito:** con `[\"accept\",\"reject\",\"accept\"]` imprime `0.3333`; con `[]` imprime `None`.\n- **Límites:** cuenta **reject**, no accept; no dejes que `[]` lance `ZeroDivisionError`.",
        id: "S04-T3-A-E2",
        instruction:
          "1. El starter divide siempre y además cuenta accepts como si fueran rejects (DEFECT doble).\n2. Si `n_total == 0`, retorna `None`.\n3. Si no, cuenta `status == \"reject\"` y divide.\n4. Imprime `round(..., 4)` del primer caso y el segundo caso crudo.",
        hint: "Si n_total es 0, retorna None; si no, divide n_reject / n_total.",
        hints: [
          "Si n_total es 0, retorna None; si no, divide n_reject / n_total.",
          "Cuenta status == \"reject\" (no accept). Primera tasa redondeada a 4 decimales: 0.3333.",
        ],
        edgeCases: ["división por cero"],
        tests: "0.3333 y None",
        feedback:
          "Si el vacío crashea, faltó el guard `n_total == 0 → None`. Si la primera tasa es `0.6667`, contaste accept en vez de reject: el numerador del gate es **reject**.",
        retrospective:
          "Distingue dos hechos: cero rejects observados y ninguna observación. El primero puede producir `0.0`; el segundo produce `None`. Esa diferencia evita que un lote vacío parezca perfecto. Explica qué texto mostraría una interfaz para cada caso sin borrar la distinción del dato.",
        starterCode: {
          language: 'python',
          title: "tasa_segura.py",
          code: `# CASO-LIM-004 · tasa_reject
def tasa_reject(sts):
    # BUG intencional: división por cero no manejada; cuenta accept como reject
    n_total = len(sts)
    n_reject = sum(1 for s in sts if s == "accept")
    return n_reject / n_total

print(round(tasa_reject(["accept", "reject", "accept"]), 4))
print(tasa_reject([]))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "tasa_segura.py",
          code: `def tasa_reject(sts):
    n_total = len(sts)
    if n_total == 0:
        return None
    n_reject = sum(1 for s in sts if s == "reject")
    return n_reject / n_total
print(round(tasa_reject(["accept", "reject", "accept"]), 4))
print(tasa_reject([]))`,
          output: `0.3333
None`,
        },
      },
      {
        subtopicId: "S04-T3-A",
        kind: "transfer",
        title: "Primer review con búsqueda y break",
        preamble:
          "- **Contexto:** en triaje de calidad a veces basta el *primer* registro en review, no el catálogo completo.\n- **Meta:** búsqueda lineal con `enumerate` + `break` (sin `.index()`).\n- **Éxito:** imprime `1 C2` (índice e id); si no hubiera review, `-1`.\n- **Límites:** no uses `.index()`; no sigas el bucle tras el primer match; no busques `accept`.",
        id: "S04-T3-A-E3",
        instruction:
          "1. El starter busca `accept` y solo imprime el índice (DEFECT).\n2. Cambia la condición a `status == \"review\"`.\n3. Si `idx == -1` imprime `-1`; si no, imprime índice e `id`.",
        hint: "Recorre con enumerate; al primer review guarda el índice y break.",
        hints: [
          "Recorre con enumerate; al primer review guarda el índice y break.",
          "No uses .index(); imprime índice e id (esperado: 1 C2).",
        ],
        edgeCases: ["primer match", "break"],
        tests: "1 C2",
        feedback:
          "Si imprimiste índice de `accept` o solo un número sin id, la condición o el print final no cuadra. Esperado: `1 C2` tras el primer `review` con break.",
        retrospective:
          "La búsqueda pide el **primer** review, así que continuar después de C2 gasta trabajo y puede reemplazar la evidencia correcta. Cambia el fixture a uno sin review y predice `-1`: un valor centinela explícito es preferible a una excepción accidental de `.index()`.",
        starterCode: {
          language: 'python',
          title: "buscar_review.py",
          code: `# CASO-LIM-004 · primer review index
# DEFECT: busca accept
rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]
idx = -1
for i, r in enumerate(rows):
    if r["status"] == "accept":
        idx = i
        break
print(idx)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "buscar_review.py",
          code: `rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]
idx = -1
for i, r in enumerate(rows):
    if r["status"] == "review":
        idx = i
        break
if idx == -1:
    print(-1)
else:
    print(idx, rows[idx]["id"])`,
          output: `1 C2`,
        },
      },
      {
        subtopicId: "S04-T3-B",
        kind: "guided",
        title: "Cuadrados y pares con list comprehension",
        preamble:
          "- **Contexto:** antes de filtrar rejects del batch, practicas map/filter corto con números sintéticos (misma forma que filtrar ids por status).\n- **Meta:** una comprehension de transformación y una de filtro.\n- **Éxito:** `[1, 4, 9, 16, 25]` y `[2, 4]`.\n- **Límites:** sin `for` explícito en este ejercicio; una comprehension por lista.",
        id: "S04-T3-B-E1",
        instruction:
          "1. El starter imprime la lista identidad y un filtro imposible `> 10` (DEFECT).\n2. Primera línea: cuadrados `x * x`.\n3. Segunda: pares con `x % 2 == 0`.",
        hint: "Una comprehension transforma (x*x); otra filtra con if (pares).",
        hints: [
          "Una comprehension transforma (x*x); otra filtra con if (pares).",
          "Pares esperados: 2 y 4.",
        ],
        edgeCases: ["filtro if"],
        tests: "cuadrados y pares",
        feedback:
          "Si ves la lista identidad o un `[]` del filtro `> 10`, aún no reescribiste las comprehensions. Map = expresión; filter = `if` al final.",
        retrospective:
          "Lee cada comprehension de izquierda a derecha como transformación y luego filtro. Si no puedes decirla en una oración breve, despliega un `for`. Transfiere la forma a ids reject, pero no a una validación con varias ramas y mensajes: compactar no debe ocultar decisiones.",
        starterCode: {
          language: 'python',
          title: "comp_basica.py",
          code: `# CASO-LIM-004 · list comps
# DEFECT: solo identity
nums = [1, 2, 3, 4, 5]
print([x for x in nums])
print([x for x in nums if x > 10])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "comp_basica.py",
          code: `nums = [1, 2, 3, 4, 5]
print([x * x for x in nums])
print([x for x in nums if x % 2 == 0])`,
          output: `[1, 4, 9, 16, 25]
[2, 4]`,
        },
      },
      {
        subtopicId: "S04-T3-B",
        kind: "independent",
        title: "Categorías únicas con set comprehension",
        preamble:
          "- **Contexto:** el reporte de calidad lista qué statuses *aparecieron*, sin duplicar.\n- **Meta:** set comprehension + `sorted` para un catálogo estable.\n- **Éxito:** `['accept', 'reject', 'review']`.\n- **Límites:** no dejes la lista sucia con duplicados; no hardcodees las tres cadenas.",
        id: "S04-T3-B-E2",
        instruction:
          "1. El starter hace list comprehension y repite `reject` (DEFECT).\n2. Usa `{r[\"status\"] for r in rows}` y envuélvelo en `sorted(...)`.\n3. Imprime esa lista ordenada.",
        hint: "Un set elimina duplicados; sorted lo hace determinista para el reporte.",
        hints: [
          "Un set elimina duplicados; sorted lo hace determinista para el reporte.",
          "Esperado alfabético: accept, reject, review.",
        ],
        edgeCases: ["set comprehension"],
        tests: "['accept','reject','review']",
        feedback:
          "Si aún ves `reject` dos veces, usaste lista y no set. `sorted({...})` da el catálogo estable; hardcodear las tres cadenas “pasa” el fixture y miente con un status nuevo.",
        retrospective:
          "El set responde «¿qué categorías aparecieron?» y `sorted` hace estable la presentación. Si mañana llega `pending`, la comprensión lo descubre sin editar una lista fija. Explica por qué ese comportamiento es más mantenible y por qué ordenar sigue siendo útil en tests y reportes.",
        starterCode: {
          language: 'python',
          title: "comp_set_status.py",
          code: `# CASO-LIM-004 · set de status
# DEFECT: lista con duplicados
rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]
print([r["status"] for r in rows])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "comp_set_status.py",
          code: `rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]
print(sorted({r["status"] for r in rows}))`,
          output: `['accept', 'reject', 'review']`,
        },
      },
      {
        subtopicId: "S04-T3-B",
        kind: "transfer",
        title: "Dict id→status y tasa de reject",
        preamble:
          "- **Contexto:** el resumen del gate combina un mapa por id y una tasa sobre el lote completo.\n- **Meta:** dict comprehension + lista de rejects + `len(rejects)/len(rows)`.\n- **Éxito:** imprime `reject ['C2', 'C4'] 0.5` (status de C2, lista, tasa).\n- **Límites:** denominador = `len(rows)`; no mutes `rows`; datos sintéticos del starter con 4 filas.",
        id: "S04-T3-B-E3",
        instruction:
          "1. El fixture ya trae cuatro filas (C1–C4); no lo reduzcas.\n2. Construye `by = {id: status ...}`.\n3. Arma `rejects` desde el dict o desde rows; calcula tasa; imprime `by[\"C2\"]`, rejects y tasa.",
        hint: "Dict comprehension id→status; luego filtra rejects y divide por len(rows).",
        hints: [
          "Dict comprehension id→status; luego filtra rejects y divide por len(rows).",
          "Con 2 reject de 4, tasa 0.5. Imprime status de C2, lista de rejects y tasa.",
        ],
        edgeCases: ["dict comp + tasa"],
        tests: "reject [C2,C4] 0.5",
        feedback:
          "Con 2 reject de 4 filas la tasa es `0.5` y C2 debe salir como `reject`. Si el denominador no es `len(rows)`, el dashboard del batch miente aunque la lista de rejects se vea bien.",
        retrospective:
          "El dict permite consultar una decisión por id; la lista de rejects permite agrupar; la tasa compara con el lote completo. Son tres vistas de los mismos datos y deben concordar. Comprueba que dos ids reject, cuatro filas y tasa 0.5 cuentan una sola historia.",
        starterCode: {
          language: 'python',
          title: "comp_resumen.py",
          code: `# CASO-LIM-004 · dict id→status
# DEFECT: solo ids; fixture incompleto
rows = [
    {"id": "C1", "status": "accept"},
    {"id": "C2", "status": "reject"},
    {"id": "C3", "status": "accept"},
    {"id": "C4", "status": "reject"},
]
print([r["id"] for r in rows])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "comp_resumen.py",
          code: `rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}, {"id": "C3", "status": "accept"}, {"id": "C4", "status": "reject"}]
by = {r["id"]: r["status"] for r in rows}
rejects = [i for i, st in by.items() if st == "reject"]
tasa = len(rejects) / len(rows)
print(by["C2"], rejects, tasa)`,
          output: `reject ['C2', 'C4'] 0.5`,
        },
      },
      {
        subtopicId: "S04-T4-A",
        kind: "guided",
        title: "Traza de acumulador (solo positivos)",
        preamble:
          "- **Contexto:** depurar un acumulador del resumen exige ver el estado *por fila*.\n- **Meta:** sumar solo `val > 0` e imprimir traza `i, val, s`.\n- **Éxito:** filas `0 2 2`, `1 -1 2`, `2 3 5` y `final 5`.\n- **Límites:** el negativo no mueve `s`; imprime la traza en cada paso, no solo el final.",
        id: "S04-T4-A-E1",
        instruction:
          "1. El starter suma todos los valores (DEFECT: en i=1, s baja a 1).\n2. Envuelve la suma en `if val > 0`.\n3. Mantén `print(i, val, s)` y `final`.",
        hint: "Suma solo si val > 0; la traza se imprime siempre para ver que el negativo no movió s.",
        hints: [
          "Suma solo si val > 0; la traza se imprime siempre para ver que el negativo no movió s.",
          "Final s=5 con filas 0 2 2 / 1 -1 2 / 2 3 5.",
        ],
        edgeCases: ["no sumar negativos"],
        tests: "traza + final 5",
        feedback:
          "En la fila `i=1` el valor es -1: si `s` bajó, sumaste sin filtro. La traza debe mostrar `1 -1 2` (s sin moverse) y `final 5`.",
        retrospective:
          "La fila con -1 es el experimento decisivo: el acumulador debe permanecer en 2. Si cambiaras la condición a `>= 0`, este fixture no distinguiría ambas reglas porque no contiene cero. Diseña el dato mínimo que sí detectaría esa mutación y predice la traza.",
        starterCode: {
          language: 'python',
          title: "traza_acum.py",
          code: `# CASO-LIM-004 · running sum positivos
# DEFECT: suma todos
vals = [2, -1, 3]
s = 0
for i, val in enumerate(vals):
    s += val
    print(i, val, s)
print("final", s)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "traza_acum.py",
          code: `vals = [2, -1, 3]
s = 0
for i, val in enumerate(vals):
    if val > 0:
        s += val
    print(i, val, s)
print("final", s)`,
          output: `0 2 2
1 -1 2
2 3 5
final 5`,
        },
      },
      {
        subtopicId: "S04-T4-A",
        kind: "independent",
        title: "Corregir doble conteo por fila",
        preamble:
          "- **Contexto:** un resumen que cuenta el doble destruye tasas del gate (parecen 200%).\n- **Meta:** localizar el DEFECT de incremento duplicado y dejar un solo `n += 1` por fila.\n- **Éxito:** imprime `3`.\n- **Límites:** no hardcodees `print(3)`; no borres el for.",
        id: "S04-T4-A-E2",
        instruction:
          "1. Traza mental: 3 filas × 2 incrementos = 6 (DEFECT visible en el starter).\n2. Elimina el segundo `n += 1`.\n3. Imprime solo `n`.",
        hint: "Busca un segundo n += 1 en el cuerpo del for.",
        hints: [
          "Busca un segundo n += 1 en el cuerpo del for.",
          "Deja un solo incremento por fila; esperado: 3.",
        ],
        edgeCases: ["doble incremento"],
        tests: "3",
        feedback:
          "Con 3 filas y dos `n += 1`, el resultado es 6. Borra **una** de las dos líneas de incremento; no hardcodees `print(3)`.",
        retrospective:
          "El número 3 no basta como prueba si fue hardcodeado: debe emerger de un incremento por cada fila. Traza `n` como 0→1→2→3 y señala el punto exacto donde una segunda actualización produciría 6. El recorrido explica el resultado; el print solo lo muestra.",
        starterCode: {
          language: 'python',
          title: "fix_doble_count.py",
          code: `# CASO-LIM-004 · conteo filas
# DEFECT: n se incrementa dos veces por fila
filas = ["a", "b", "c"]
n = 0
for f in filas:
    n += 1
    n += 1  # bug: doble conteo
print(n)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "fix_doble_count.py",
          code: `filas = ["a", "b", "c"]
n = 0
for f in filas:
    n += 1
print(n)`,
          output: `3`,
        },
      },
      {
        subtopicId: "S04-T4-A",
        kind: "transfer",
        title: "Traza del dict de contadores",
        preamble:
          "- **Contexto:** cuando los contadores viven en un dict, un typo de clave o un “pisado” deja el resumen incoherente.\n- **Meta:** incrementar con `get` e imprimir TRACE del estado completo por registro.\n- **Éxito:** tres líneas `TRACE i status {...}` crecientes y `FINAL {'accept': 2, 'reject': 1}`.\n- **Límites:** no asignes `counts[st] = 1` (pisa); no omitas TRACE intermedias.",
        id: "S04-T4-A-E3",
        instruction:
          "1. El starter pisa el contador a 1 (DEFECT).\n2. Usa `counts[st] = counts.get(st, 0) + 1`.\n3. Cada iteración: `print(\"TRACE\", i, st, dict(counts))`.\n4. Al final: `print(\"FINAL\", counts)`.",
        hint: "Incrementa con get(st, 0)+1; imprime TRACE en cada paso, no solo al final.",
        hints: [
          "Incrementa con get(st, 0)+1; imprime TRACE en cada paso, no solo al final.",
          "Formato: TRACE i status {dict}; al final FINAL con el dict completo.",
        ],
        edgeCases: ["estado completo por paso"],
        tests: "3 TRACE + FINAL",
        feedback:
          "Si `FINAL` muestra 1 y 1 con tres filas, el `= 1` pisó en vez de acumular. Con `get(st, 0) + 1` y TRACE por paso debes ver accept crecer a 2.",
        retrospective:
          "`counts[st] = 1` recuerda presencia; `counts.get(st, 0) + 1` recuerda frecuencia. La tercera fila accept separa ambos significados. Explica por qué copiar `dict(counts)` en la traza ayuda a observar cada estado y qué campo registrarías además en un log real.",
        starterCode: {
          language: 'python',
          title: "traza_dict.py",
          code: `# CASO-LIM-004 · counts por status
# DEFECT: no usa get
regs = ["accept", "reject", "accept"]
counts = {"accept": 0, "reject": 0}
for i, st in enumerate(regs):
    counts[st] = 1  # pisa
print(counts)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "traza_dict.py",
          code: `regs = ["accept", "reject", "accept"]
counts = {"accept": 0, "reject": 0}
for i, st in enumerate(regs):
    counts[st] = counts.get(st, 0) + 1
    print("TRACE", i, st, dict(counts))
print("FINAL", counts)`,
          output: `TRACE 0 accept {'accept': 1, 'reject': 0}
TRACE 1 reject {'accept': 1, 'reject': 1}
TRACE 2 accept {'accept': 2, 'reject': 1}
FINAL {'accept': 2, 'reject': 1}`,
        },
      },
      {
        subtopicId: "S04-T4-B",
        kind: "guided",
        title: "Contar pasos O(n) vs. O(n²)",
        preamble:
          "- **Contexto:** con n chico el cuadrático no “se siente”, pero el conteo de pasos sí lo delata.\n- **Meta:** derivar pasos de un for simple y de un doble for con `n=5`.\n- **Éxito:** imprime `5 25`.\n- **Límites:** no inventes los números; cuéntalos con incrementos reales en bucles.",
        id: "S04-T4-B-E1",
        instruction:
          "1. El starter sube `lin` y `quad` en el mismo for (DEFECT: ambos 5).\n2. Deja el for lineal como está.\n3. Añade doble for anidado solo para `quad`.\n4. Imprime `lin, quad`.",
        hint: "Un for cuenta n pasos; dos fors anidados cuentan n*n.",
        hints: [
          "Un for cuenta n pasos; dos fors anidados cuentan n*n.",
          "Con n=5: 5 y 25.",
        ],
        edgeCases: ["n vs. n²"],
        tests: "5 25",
        feedback:
          "Si ambos números son 5, `quad` se incrementó en el for lineal. Necesitas un **segundo** par de fors anidados solo para contar pasos cuadráticos; con `n=5` debes ver `5 25`.",
        retrospective:
          "Con n=5, 5 frente a 25 parece pequeño; con n=1,000, serían 1,000 frente a 1,000,000. No memorices solo la letra O: explica qué trabajo adicional crea el segundo bucle. Un triple recorrido sobre el mismo lote elevaría la comparación a n³.",
        starterCode: {
          language: 'python',
          title: "count_steps.py",
          code: `# CASO-LIM-004 · lineal vs. cuadrático
# DEFECT: ambos usan un solo bucle
n = 5
lin = quad = 0
for i in range(n):
    lin += 1
    quad += 1
print(lin, quad)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "count_steps.py",
          code: `n = 5
lin = quad = 0
for i in range(n):
    lin += 1
for i in range(n):
    for j in range(n):
        quad += 1
print(lin, quad)`,
          output: `5 25`,
        },
      },
      {
        subtopicId: "S04-T4-B",
        kind: "independent",
        title: "Corregir off-by-one en range",
        preamble:
          "- **Contexto:** un IndexError al final del lote suele ser stop exclusivo mal usado, no “lista rota”.\n- **Meta:** recorrer todos los índices válidos con `range(len(data))`.\n- **Éxito:** `r0`, `r1`, `r2` (una por línea).\n- **Límites:** corrige el `range`, no parches con `if i < len` sobre el range roto; no uses `range(1, len+1)`.",
        id: "S04-T4-B-E2",
        instruction:
          "1. El starter usa `range(1, len(data)+1)` (DEFECT: intenta `data[3]`).\n2. Cámbialo a `range(len(data))`.\n3. Imprime `data[i]` en cada paso.",
        hint: "range(len(data)) produce 0..n-1; el stop es exclusivo.",
        hints: [
          "range(len(data)) produce 0..n-1; el stop es exclusivo.",
          "No uses range(1, len+1): el último índice no existe.",
        ],
        edgeCases: ["IndexError off-by-one"],
        tests: "r0 r1 r2",
        feedback:
          "Si hay `IndexError` en el último paso, el `range` llegó a `len` (stop mal puesto). Con `range(len(data))` salen `r0` `r1` `r2` sin parche de `if i < len`.",
        retrospective:
          "Para n elementos, los índices válidos son 0..n−1; `range(n)` expresa exactamente ese intervalo. Predice `list(range(len([\"a\", \"b\"])))` y luego simplifica: si el índice no participa en la decisión, `for x in data` vuelve imposible este error concreto.",
        starterCode: {
          language: 'python',
          title: "fix_range_obo.py",
          code: `# CASO-LIM-004 · off-by-one
# BUG intencional: range(1, len+1) provoca IndexError en el último índice
data = ["r0", "r1", "r2"]
for i in range(1, len(data) + 1):
    print(data[i])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "fix_range_obo.py",
          code: `data = ["r0", "r1", "r2"]
for i in range(len(data)):
    print(data[i])`,
          output: `r0
r1
r2`,
        },
      },
      {
        subtopicId: "S04-T4-B",
        kind: "transfer",
        title: "Reescribe conteo n² a O(n)",
        preamble:
          "- **Contexto:** alguien “contó pares reject-reject” con doble for para una tasa que solo necesita rejects.\n- **Meta:** reescribir a conteo O(n) de rejects y tasa `n_reject/n`.\n- **Éxito:** `3 0.6` y exactamente `nota: la tasa solo necesita conteo O(n), no pares O(n2)`.\n- **Límites:** no dejes el doble for; no inventes otra métrica de pares.",
        id: "S04-T4-B-E3",
        instruction:
          "1. El starter anida fors y cuenta mal (DEFECT).\n2. Calcula `n` y `n_reject` en un pase (o `sum` simple).\n3. Imprime `n_reject` y `round(n_reject/n, 2)`.\n4. Imprime **exactamente**: `print(\"nota: la tasa solo necesita conteo O(n), no pares O(n2)\")`.",
        hint: "La tasa de reject no necesita combinar pares: basta un conteo O(n).",
        hints: [
          "La tasa de reject no necesita combinar pares: basta un conteo O(n).",
          "Tras 3 0.6, imprime la nota con el texto exacto del éxito (O(n) vs. pares O(n2)).",
        ],
        edgeCases: ["evitar n² innecesario"],
        tests: "3 0.6 + nota",
        feedback:
          "Si ves un número enorme (p. ej. 15), el doble for sigue contando pares. Con 5 filas y 3 rejects, un pase da `3 0.6`; la línea `nota:` debe coincidir **letra por letra** con el contrato.",
        retrospective:
          "La tasa pregunta por filas individuales, no por pares, de modo que un pase contiene toda la información necesaria. Un doble bucle sería legítimo para comparar cada registro con todos los demás —por ejemplo, detectar similitudes—, pero resolvería otra pregunta. Nombra la pregunta antes de elegir el algoritmo.",
        starterCode: {
          language: 'python',
          title: "rewrite_on.py",
          code: `# CASO-LIM-004 · n_reject O(n)
# DEFECT: O(n^2) pairs
sts = ["reject", "accept", "reject", "reject", "accept"]
pairs = 0
for i in range(len(sts)):
    for j in range(len(sts)):
        if sts[i] == "reject":
            pairs += 1
print(pairs)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "rewrite_on.py",
          code: `sts = ["reject", "accept", "reject", "reject", "accept"]
n = len(sts)
n_reject = sum(1 for s in sts if s == "reject")
print(n_reject, round(n_reject / n, 2))
print("nota: la tasa solo necesita conteo O(n), no pares O(n2)")`,
          output: `3 0.6
nota: la tasa solo necesita conteo O(n), no pares O(n2)`,
        },
      },
    ],
  },
  youDo: {
    title: "Client Intake & Data Quality Script (cierre CP-N1-A)",
    context:
      "Ahora reúnes las piezas en una promesa verificable: cada registro sintético entra una vez, conserva su raw, recibe una decisión y contribuye exactamente una vez al resumen. Sobre el parser de S02 y las reglas de S03, construye un procesador **O(n)** que pueda explicar sus contadores accept/reject/review y la población usada por `tasa_reject`. Un lote vacío no es una tasa perfecta: es ausencia de observaciones y se representa con `None`. Antes de completar el starter, escribe los invariantes que `_run_tests` debe proteger; después implementa las tres funciones hasta ver `tests OK`. El empaquetado CLI llega más adelante.",
    objectives: [
      "Procesar ≥3 registros sintéticos en un solo pase",
      "Emitir contadores y tasa_reject con denominador correcto",
      "Conservar el original (raw) de cada registro en el resultado",
      "Reutilizar validación tri-estado por campo (S03)",
      "Demo reproducible con if __name__ == '__main__'",
    ],
    requirements: [
      "process_batch(records) → summary con n_total, n_accept, n_reject, n_review, tasa_reject, results[]",
      "Cada result incluye raw intacto + status agregado + detalle de campos (accept|reject|review)",
      "tasa_reject is None cuando n_total == 0 (sin ZeroDivisionError); si n_total > 0, tasa_reject ∈ [0, 1]",
      "Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Lima|0'; lote vacío → tasa_reject is None",
      "Sin PII real; datos sintéticos embebidos; sin bucles O(n²) innecesarios para el resumen",
      "README o docstring en español: explica el denominador de tasas y por qué se conserva el raw",
    ],
    starterCode: `"""intake_quality_batch.py — cierre CP-N1-A (S04)
Procesa múltiples registros sintéticos, resume tasas, conserva raw.
Datos ficticios únicamente. No uses PII real.
"""

from __future__ import annotations

from typing import Any


def validate_record(record: dict[str, Any]) -> dict[str, Any]:
    """Reutiliza lógica tipo S03: status global + detalle por campo.
    Mínimo: edad, region, monto_ingreso con accept|reject|review.
    """
    # TODO: devolver {status, fields} con accept|reject|review por campo (S03)
    raise NotImplementedError


def process_batch(records: list[dict[str, Any]]) -> dict[str, Any]:
    """Recorre el lote UNA vez (O(n)).
    Devuelve {
      "n_total", "n_accept", "n_reject", "n_review",
      "tasa_reject",  # None si n_total==0
      "results": [ {"raw": ..., "status": ..., "fields": ...}, ... ]
    }
    Conserva cada raw intacto.
    """
    # TODO: un solo for O(n); contadores; tasa_reject None si vacío; raw intacto
    raise NotImplementedError


def format_report(summary: dict[str, Any]) -> str:
    """Texto stdout legible con contadores y tasa."""
    # TODO: texto stdout con n_total, contadores y tasa
    raise NotImplementedError


def _run_tests() -> None:
    batch = [
        {"edad": 30, "region": "Lima", "monto_ingreso": 0, "raw_line": "30|Lima|0"},
        {"edad": None, "region": "Cusco", "monto_ingreso": 10, "raw_line": "|Cusco|10"},
        {"edad": 15, "region": "Tacna", "monto_ingreso": -1, "raw_line": "15|Tacna|-1"},
    ]
    s = process_batch(batch)
    assert s["n_total"] == 3
    assert s["results"][0]["raw"]["raw_line"] == "30|Lima|0"
    assert s["tasa_reject"] is None or 0 <= s["tasa_reject"] <= 1
    empty = process_batch([])
    assert empty["tasa_reject"] is None
    print("tests OK")


def main() -> None:
    demo = [
        {"edad": 40, "region": "Arequipa", "monto_ingreso": 100, "raw_line": "40|Arequipa|100"},
        {"edad": -3, "region": "Piura", "monto_ingreso": 50, "raw_line": "-3|Piura|50"},
    ]
    summary = process_batch(demo)
    print(format_report(summary))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "En el README cuenta la historia de un lote pequeño: tabla de entradas, decisiones, suma de contadores y cálculo `n_reject / n_total`. Incluye el caso vacío y una captura reproducible de stdout. Explica qué auditoría permite el raw intacto y qué decisión de diseño mantiene el procesamiento en O(n); esas razones valen más que una captura aislada.",
    rubric: [
      { criterion: "Procesa lote multi-registro en O(n)", weight: "25%" },
      { criterion: "Tasas con denominador correcto / vacío seguro", weight: "25%" },
      { criterion: "Conserva raw y valida tri-estado", weight: "20%" },
      { criterion: "Reporte stdout legible y demo reproducible", weight: "15%" },
      { criterion: "Sin infinito / sin n² innecesario", weight: "10%" },
      { criterion: "Documentación en español del resumen", weight: "5%" },
    ],
    retrospective:
      "Haz una defensa de cierre sin mirar el código: ¿por qué la suma de estados debe explicar `n_total`?, ¿por qué `None` distingue vacío de cero rejects?, ¿cómo demuestras que el raw no cambió?, ¿qué línea garantiza un solo pase? Luego altera un caso —lote vacío, primer registro inválido o 100,000 filas— y predice el comportamiento. Si tu explicación y tus tests cuentan la misma historia, el gate está listo.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué produce list(range(3))?",
        options: ["1,2,3 (empieza en 1)", "0,1,2,3 (incluye el stop)", "3 (solo el argumento)", "0,1,2 (empieza en 0, excluye stop)"],
        correctIndex: 3,
        explanation:
          "`range(stop)` empieza en 0 y se detiene antes de `stop`. Por eso tres posiciones son 0, 1 y 2; el valor 3 sería una cuarta posición. Este límite exclusivo encaja con los índices válidos de una lista de longitud 3.",
      },
      {
        question: "¿Qué hace zip([1,2,3],[10,20]) sin strict?",
        options: ["Lanza ValueError", "Empareja solo (1,10) y (2,20); el 3 se pierde en silencio", "Rellena con None el tercero", "Empareja en producto cartesiano"],
        correctIndex: 1,
        explanation:
          "`zip` común se detiene en la secuencia más corta: produce dos pares y oculta el 3. Si perder un elemento corrompe el resumen, valida longitudes o usa `strict=True` en Python 3.10+ para convertir el silencio en un error visible.",
      },
      {
        question: "¿Para la tasa de reject del gate, el denominador debe ser?",
        options: ["Solo n_accept", "Siempre 100", "n_total de registros procesados (intentados)", "n_review únicamente"],
        correctIndex: 2,
        explanation:
          "La pregunta es «¿qué fracción de todos los registros intentados fue reject?», así que el denominador es `n_total`. Dividir solo entre accepts cambiaría la población. Si `n_total == 0`, `None` dice que no hubo observaciones; no debes dividir ni fingir una tasa cero.",
      },
      {
        question: "¿Qué hace continue en un for de líneas de intake?",
        options: ["Salta al siguiente ciclo del bucle", "Termina todo el programa", "Borra la lista", "Convierte la línea en None"],
        correctIndex: 0,
        explanation:
          "`continue` omite lo que queda del cuerpo y empieza la siguiente iteración. Es apropiado para una fila recuperablemente vacía; no termina el lote. Si la condición fuera fatal o un centinela de cierre, necesitarías `break`.",
      },
      {
        question: "¿Un doble for anidado sobre n elementos es aproximadamente?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 3,
        explanation:
          "Cada una de las n vueltas exteriores ejecuta otras n vueltas: n×n pasos, es decir, O(n²). Un resumen que solo cuenta estados no necesita comparar pares; un pase O(n) conserva la misma respuesta y escala mejor.",
      },
      {
        question: "En un while con centinela \"END\", ¿qué debe pasar cada iteración para no colgarte?",
        options: ["Nada: Python corta solo", "Actualizar el estado (p. ej. avanzar el índice) y comprobar el centinela", "Usar solo continue", "Multiplicar n_total por 2"],
        correctIndex: 1,
        explanation:
          "Un `while` necesita una prueba de salida. Avanzar el índice acerca la condición a falsa y comprobar `END` permite salir antes. Si el estado no cambia y ningún `break` alcanzable interviene, la condición puede permanecer verdadera indefinidamente.",
      },
      {
        question:
          "En un lote de líneas de intake, ¿cuál es la diferencia correcta entre continue y break?",
        options: ["continue y break hacen exactamente lo mismo", "break salta una fila; continue cierra todo el programa", "continue salta a la siguiente iteración; break termina el bucle actual", "continue solo existe en while; break solo en for"],
        correctIndex: 2,
        explanation:
          "`continue` conserva el proceso y salta solo la fila actual; `break` termina el bucle. La elección depende del contrato: ruido recuperable frente a fin o fallo fatal. Confundirlos cambia qué registros se cuentan, no solo el flujo visual del programa.",
      },
      {
        question: "¿Para qué sirve enumerate(ids, start=1) en un reporte de intake?",
        options: ["Numera filas desde 1 para humanos sin armar el índice a mano", "Ordena la lista alfabéticamente", "Elimina duplicados del lote", "Convierte la lista en un dict"],
        correctIndex: 0,
        explanation:
          "`enumerate` entrega número y valor sin mantener un contador manual. `start=1` mejora el rótulo para personas, pero no transforma la lista: su primera posición interna sigue siendo 0. No reutilices el número mostrado como índice sin ajustar el contrato.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python Tutorial — for / range",
        url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements",
        note: "for, range, break, continue",
      },
      {
        label: "enumerate",
        url: "https://docs.python.org/3/library/functions.html#enumerate",
        note: "Índices sin range(len) manual",
      },
      {
        label: "zip",
        url: "https://docs.python.org/3/library/functions.html#zip",
        note: "strict=True desde 3.10",
      },
      {
        label: "List comprehensions",
        url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
        note: "Forma legible de map/filter simple",
      },
      {
        label: "Python for Everybody — loops",
        url: "https://www.py4e.com/html3/05-iterations",
        note: "while/for progressive disclosure",
      },
      {
        label: "TimeComplexity (wiki Python)",
        url: "https://wiki.python.org/moin/TimeComplexity",
        note: "Costo de operaciones comunes",
      },
    ],
    books: [
      {
        label: "Python Crash Course (Matthes)",
        note: "Capítulos de bucles; aplicar a lotes de intake del curso.",
      },
      {
        label: "Automate the Boring Stuff",
        note: "Patrones de procesamiento por líneas; no copiar PII real.",
      },
    ],
    courses: [
      {
        label: "CS50P — Loops",
        url: "https://cs50.harvard.edu/python/",
        note: "Práctica de for/while; adaptar al dominio sintético CP-N1-A.",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Iteración y depuración",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Loops e I/O por lotes",
      },
      {
        label: "Kaggle Learn — Python",
        url: "https://www.kaggle.com/learn/python",
        note: "Micro-práctica de bucles",
      },
    ],
  },
}
