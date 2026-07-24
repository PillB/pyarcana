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
    "En onboarding de data en bancos, fintech y retail en Perú, el motor de reglas (S03) debe correr sobre **lotes**: cientos de filas, centinelas END, continue/break y resúmenes con tasas honestas. Aquí dominas for/while, enumerate/zip, conteos O(n) y el cierre del Client Intake CP-N1-A.",
  learningOutcomes: [
    { text: "Recorrer secuencias con for y range sin off-by-one en el stop exclusivo" },
    { text: "Usar enumerate y zip (incl. strict) sin desalinear columnas de intake" },
    { text: "Escribir while con centinelas y condición de terminación explícita" },
    { text: "Aplicar break/continue y guardrails contra loops infinitos" },
    { text: "Implementar contadores, acumuladores y búsquedas en un pase O(n)" },
    { text: "Escribir comprehensions legibles para filtros simples de resumen" },
    { text: "Trazar el estado de un bucle para depurar contadores" },
    { text: "Distinguir costo lineal vs cuadrático y corregir off-by-one en índices" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: iteración y resúmenes por lotes",
      paragraphs: [
        "En esta sección dominas lo que el **cierre de CP-N1-A** necesita: recorrer **múltiples registros**, acumular contadores, evitar loops infinitos y reportar **tasas con denominadores correctos**. Temas de empaquetado, CLI y decorators se abordan más adelante en el curso.",
        "El hilo conductor es un **script de intake por lotes**: lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro con el motor de reglas de S03, imprime por stdout un resumen y **conserva el original** de cada fila. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo.",
        "Orden pedagógico: **T1 Recorrido** (`for`/`range` → `enumerate`/`zip`) → **T2 Repetición** (`while`/centinelas → `break`/`continue`) → **T3 Patrones** (contadores/acumuladores → comprehensions) → **T4 Razonamiento** (trazado de estado → costo y off-by-one).",
      ],
      callout: {
        type: "info",
        title: "Alcance de esta sección",
        content:
          "El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A): lotes, contadores y tasas. No cubrimos decorators ni packaging aquí; cuando llegues a módulos/CLI y OOP de dominio, reutilizarás estos bucles sobre el mismo hilo de intake.",
      },
    },
    {
      heading: "for, range y secuencias",
      subtopicId: "S04-T1-A",
      paragraphs: [
        "El bucle **`for x in secuencia:`** recorre cada elemento **una vez**, en orden. No necesitas un índice si solo te importa el valor. Las secuencias típicas de intake son: **listas de registros** (dicts), **líneas de texto** y **`range(n)`** cuando quieres un contador 0..n-1.",
        "**`range(stop)`**, **`range(start, stop)`**, **`range(start, stop, step)`** producen enteros sin materializar una lista gigante. El **stop es exclusivo**: `range(3)` → 0,1,2. Eso evita el off-by-one clásico al numerar N filas.",
        "En lotes de clientes sintéticos, el patrón base es `for registro in filas:` y dentro llamar a `validate_record`. No mutes la lista mientras la recorres salvo que sepas lo que haces; acumula resultados en otra lista.",
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
        "**`enumerate(seq, start=0)`** te da `(índice, valor)` sin armar el índice a mano. Ideal para reportes “fila 1, fila 2…” (usa `start=1` para humanos) y para localizar el registro que falló en un lote.",
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
        "**`while condicion:`** repite mientras la condición sea verdadera. Úsalo cuando **no sabes de antemano cuántas** iteraciones habrá: leer hasta línea vacía, reintentar hasta éxito, o procesar un stream.",
        "Un **centinela** es un valor especial que marca el fin (p. ej. `\"\"`, `None`, `\"END\"`). El bucle debe **actualizar el estado** en cada vuelta; si la condición nunca se vuelve falsa, tienes un **loop infinito**.",
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
      heading: "break, continue y prevención de loops infinitos",
      subtopicId: "S04-T2-B",
      paragraphs: [
        "**`break`** sale del bucle actual de inmediato. **`continue`** salta al **siguiente** ciclo sin ejecutar el resto del cuerpo. En intake: `continue` para saltar filas vacías; `break` al encontrar un centinela o un error fatal de configuración.",
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
          "En producción un loop infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
      },
    },
    {
      heading: "Contadores, acumuladores y búsqueda",
      subtopicId: "S04-T3-A",
      paragraphs: [
        "Un **contador** suma 1 por evento (`n_reject += 1`). Un **acumulador** suma cantidades (`total_monto += m`). Una **búsqueda** recorre hasta hallar (o no) un elemento y a menudo usa `break` o un flag.",
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
        "Una **list comprehension** `[expr for x in xs if cond]` construye una lista en una línea. Es idiomática cuando la transformación es **simple**. Si hay validación multi-rama o side effects (prints, I/O), usa un `for` explícito.",
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
        "**Trazar estado** es escribir (o imaginar) una tabla: iteración | variables | salida. Es la herramienta #1 para depurar off-by-one y contadores mal actualizados.",
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
        "Un solo `for` sobre n filas es **O(n)** (lineal). Dos bucles anidados sobre el mismo lote (`for a in xs: for b in xs:`) es **O(n²)** (cuadrático). Con 10 filas no se nota; con 100_000, el script “se cuelga”.",
        "**Off-by-one**: `range(len(xs))` es correcto para índices 0..n-1; `range(1, len(xs))` se salta el primero; `range(len(xs)+1)` explota con IndexError. Fronteras inclusivas/exclusivas en filtros (`>=` vs `>`) también son off-by-one de negocio.",
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
    intro: "Ocho demos I Do (uno por subtema). Ejecuta en orden T1→T4. Cada demo es un fragmento del procesador por lotes del gate CP-N1-A. Datos sintéticos; entorno browser-pyodide salvo que se indique.",
    steps: [
      {
        demoId: "S04-T1-A-DEMO",
        subtopicId: "S04-T1-A",
        environment: "browser-pyodide",
        description: "Recorrer lote de registros sintéticos con for y range",
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
        why: "Un for por valor es el esqueleto del procesador por lotes; range(len) solo si necesitas índices.",
      },
      {
        demoId: "S04-T1-B-DEMO",
        subtopicId: "S04-T1-B",
        environment: "browser-pyodide",
        description: "enumerate para reportar fila y zip strict para columnas",
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
        why: "enumerate numera para humanos; validar len (o zip strict en 3.10+) evita emparejar mal columnas.",
      },
      {
        demoId: "S04-T2-A-DEMO",
        subtopicId: "S04-T2-A",
        environment: "browser-pyodide",
        description: "while con centinela END sobre buffer de líneas",
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
        why: "El centinela corta el lote; lo posterior no se procesa. i avanza siempre → no hay infinito.",
      },
      {
        demoId: "S04-T2-B-DEMO",
        subtopicId: "S04-T2-B",
        environment: "browser-pyodide",
        description: "continue salta vacíos; break corta en ERROR fatal",
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
        why: "continue limpia ruido; break detiene el lote ante error de configuración.",
      },
      {
        demoId: "S04-T3-A-DEMO",
        subtopicId: "S04-T3-A",
        environment: "browser-pyodide",
        description: "Contadores accept/reject/review y tasa con denominador",
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
        why: "Un pase O(n) llena contadores; la tasa usa n total, no solo accepts.",
      },
      {
        demoId: "S04-T3-B-DEMO",
        subtopicId: "S04-T3-B",
        environment: "browser-pyodide",
        description: "Comprehensions para filtrar rejects del resumen",
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
        why: "Filtrar con comprehension es legible; el denominador sigue siendo len(rows).",
      },
      {
        demoId: "S04-T4-A-DEMO",
        subtopicId: "S04-T4-A",
        environment: "browser-pyodide",
        description: "Tabla TRACE de contador durante el lote",
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
        why: "La traza hace visible cuándo sube el contador; base del debugging de resúmenes.",
      },
      {
        demoId: "S04-T4-B-DEMO",
        subtopicId: "S04-T4-B",
        environment: "browser-pyodide",
        description: "Detectar O(n²) ingenuo y off-by-one en range",
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
        why: "4 vs 16 pasos; range(1,len) omite el primer registro — bug clásico de resúmenes incompletos.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara; no inventes salidas. Datos sintéticos únicamente.",
    steps: [
      {
        id: "S04-T1-A-E1",
        subtopicId: "S04-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Dada `regiones = [\"Lima\", \"Cusco\", \"Piura\"]`, imprime cada región en su propia línea con un `for`. Luego imprime `list(range(3))`.",
        hint: "for r in regiones: print(r)",
        hints: [
          "for r in regiones: print(r)",
          "range(3) produce 0,1,2 — stop exclusivo.",
        ],
        edgeCases: ["range stop exclusivo"],
        tests: "3 regiones + [0,1,2]",
        feedback: "El for por valor es el default del procesador de lotes.",
        starterCode: {
          language: 'python',
          title: "for_regiones.py",
          code: `# CASO-LIM-004 · for sobre lista
# DEFECT: no imprime range(3)
regiones = ["Lima", "Cusco", "Piura"]
for r in regiones:
    print(r)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "for_regiones.py",
          code: `regiones = ["Lima", "Cusco", "Piura"]
for r in regiones:
    print(r)
print(list(range(3)))`,
          output: `Lima
Cusco
Piura
[0, 1, 2]`,
        },
      },
      {
        id: "S04-T1-A-E2",
        subtopicId: "S04-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — `edades = [30, 17, 45, 22]`. Cuenta cuántas son `>= 18` con un for (no uses comprehension todavía). Imprime el contador.",
        hint: "n = 0; for e in edades: if e >= 18: n += 1",
        hints: [
          "n = 0; for e in edades: if e >= 18: n += 1",
          "Resultado esperado: 3 (30,45,22).",
        ],
        edgeCases: ["frontera 18 inclusiva"],
        tests: "assert n == 3",
        feedback: "Contador manual prepara el resumen de tasas del gate.",
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
        id: "S04-T1-A-E3",
        subtopicId: "S04-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Simula un mini-lote: lista de dicts con `id` y `monto`. Imprime solo los `id` cuyo monto sea `> 0` usando for. No mutes la lista original.",
        hint: "for reg in lote: if reg['monto'] > 0: print(reg['id'])",
        hints: [
          "for reg in lote: if reg['monto'] > 0: print(reg['id'])",
          "0 no se imprime; negativos tampoco. Conserva lote intacto.",
        ],
        edgeCases: ["monto 0 excluido", "lista no mutada"],
        tests: "C1 y C4; len 4",
        feedback: "Filtrar al reportar sin destruir el raw es hábito de auditoría.",
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
        id: "S04-T1-B-E1",
        subtopicId: "S04-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Con `ids = [\"A\", \"B\", \"C\"]`, usa `enumerate(..., start=1)` e imprime `fila k: id`.",
        hint: "for i, x in enumerate(ids, start=1): print(f'fila {i}: {x}')",
        hints: [
          "for i, x in enumerate(ids, start=1): print(f'fila {i}: {x}')",
          "start=1 es para humanos; el índice interno de la lista sigue siendo 0-based.",
        ],
        edgeCases: ["start=1"],
        tests: "fila 1..3",
        feedback: "Numerar filas acelera el diagnóstico de rejects en demos.",
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
        id: "S04-T1-B-E2",
        subtopicId: "S04-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — `nombres` y `edades` de igual longitud. Emparéjalos con `zip` e imprime `nombre=edad`. Luego muestra qué pasa con zip silencioso si acortas edades a 1 elemento (imprime list(zip(...))).",
        hint: "zip se detiene en la más corta; el resto se pierde.",
        hints: [
          "zip se detiene en la más corta; el resto se pierde.",
          "Compara len antes en código real; aquí solo observa el silencio.",
        ],
        edgeCases: ["truncamiento silencioso"],
        tests: "3 pares + 1 par en zip corto",
        feedback: "Ver el truncamiento una vez evita bugs de columnas desalineadas.",
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
        id: "S04-T1-B-E3",
        subtopicId: "S04-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Implementa `zip_strict(a,b)` que lance ValueError si `len(a)!=len(b)` (equivalente pedagógico a `zip(..., strict=True)` en Py 3.10+). Prueba desalineado → `DESALINEADO` y alineado → `OK`.",
        hint: "if len(a) != len(b): raise ValueError(...); return list(zip(a,b))",
        hints: [
          "if len(a) != len(b): raise ValueError(...); return list(zip(a,b))",
          "Dos bloques try/except con prints distintos.",
        ],
        edgeCases: ["strict alignment"],
        tests: "DESALINEADO luego OK",
        feedback: "Validar longitudes es un assert de alineación barato en tests de pipeline.",
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
        id: "S04-T2-A-E1",
        subtopicId: "S04-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Buffer `lines = [\"r1\", \"r2\", \"\", \"r3\"]`. Con while e índice, acumula hasta el string vacío (sin incluirlo). Imprime la lista.",
        hint: "while i < len: leer, i+=1, if line=='': break else append",
        hints: [
          "while i < len: leer, i+=1, if line=='': break else append",
          "Resultado: ['r1','r2']; r3 queda fuera del lote.",
        ],
        edgeCases: ["centinela vacío"],
        tests: "['r1','r2']",
        feedback: "El centinela define el fin de lote aunque haya basura después.",
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
        id: "S04-T2-A-E2",
        subtopicId: "S04-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Simula reintentos: `intentos = 0`, `MAX = 3`, `while intentos < MAX`, incrementa e imprime `intento k`. Al salir imprime `done` y el valor final de intentos.",
        hint: "intentos += 1 dentro del while es la variable de control.",
        hints: [
          "intentos += 1 dentro del while es la variable de control.",
          "Si olvidas incrementar, loop infinito (no lo hagas).",
        ],
        edgeCases: ["variable de control"],
        tests: "3 intentos + done 3",
        feedback: "while con cota superior es el patrón de reintentos seguros.",
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
        id: "S04-T2-A-E3",
        subtopicId: "S04-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Cola simulada: `cola = [\"job1\", \"job2\", \"job3\"]`. Mientras la cola no esté vacía, saca el primero con `pop(0)`, imprímelo, y si el job es `job2` imprime `PAUSE` y break. Muestra la cola restante.",
        hint: "while cola: job = cola.pop(0)",
        hints: [
          "while cola: job = cola.pop(0)",
          "Tras break debe quedar ['job3'].",
        ],
        edgeCases: ["break deja resto"],
        tests: "job1 job2 PAUSE rest [job3]",
        feedback: "while + cola modela procesamiento hasta condición de negocio.",
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
        id: "S04-T2-B-E1",
        subtopicId: "S04-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — `raw = [\"  \", \"Lima\", \"\", \"Cusco\"]`. Con for, usa continue si `not x.strip()`; imprime las regiones válidas.",
        hint: "if not x.strip(): continue",
        hints: [
          "if not x.strip(): continue",
          "Solo Lima y Cusco.",
        ],
        edgeCases: ["whitespace only"],
        tests: "Lima\\nCusco",
        feedback: "continue es el filtro de filas vacías del intake por líneas.",
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
        id: "S04-T2-B-E2",
        subtopicId: "S04-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — `codes = [200, 200, 500, 200]`. Recorre; si code >= 500 imprime `STOP` y break; si no, imprime `ok`. Cuenta cuántos ok imprimiste.",
        hint: "break no procesa el 200 final.",
        hints: [
          "break no procesa el 200 final.",
          "n_ok debe ser 2.",
        ],
        edgeCases: ["break corta el lote"],
        tests: "ok ok STOP n_ok 2",
        feedback: "Errores fatales deben cortar el lote, no solo contarse.",
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
        id: "S04-T2-B-E3",
        subtopicId: "S04-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Escribe un `while True` que lea de `buf = [\"a\", \"b\", \"END\"]` con índice, break en END, y un guardrail `if i > 10: raise RuntimeError('guard')`. Imprime los valores leídos.",
        hint: "while True no es pecado si break y guardrail están claros.",
        hints: [
          "while True no es pecado si break y guardrail están claros.",
          "No proceses END como dato.",
        ],
        edgeCases: ["while True + break + max"],
        tests: "['a','b']",
        feedback: "while True documentado + centinela + MAX es aceptable y testeable.",
        starterCode: {
          language: 'python',
          title: "while_true_guard.py",
          code: `# CASO-LIM-004 · while True + END
# DEFECT: no rompe en END
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
        id: "S04-T3-A-E1",
        subtopicId: "S04-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — `sts = [\"accept\", \"reject\", \"accept\"]`. Inicializa contadores y en un for incrementa. Imprime n_accept, n_reject, n_total.",
        hint: "n_total = len o +=1 por fila",
        hints: [
          "n_total = len o +=1 por fila",
          "2 accept, 1 reject, total 3",
        ],
        edgeCases: ["un pase"],
        tests: "2 1 3",
        feedback: "Contadores en un pase son la base del resumen CP-N1-A.",
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
        id: "S04-T3-A-E2",
        subtopicId: "S04-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Calcula `tasa_reject = n_reject / n_total` para sts del E1. Luego calcula tasa para lista vacía sin ZeroDivisionError (imprime None).",
        hint: "if n_total: tasa = n_rej/n_total else None",
        hints: [
          "if n_total: tasa = n_rej/n_total else None",
          "Primera tasa ~0.333…; segunda None.",
        ],
        edgeCases: ["división por cero"],
        tests: "0.3333 y None",
        feedback: "Denominador cero se reporta, no se crashea.",
        starterCode: {
          language: 'python',
          title: "tasa_segura.py",
          code: `# CASO-LIM-004 · tasa_reject
def tasa_reject(sts):
    # DEFECT: división por cero no manejada; tasa accept
    n_total = len(sts)
    n_reject = sum(1 for s in sts if s == "accept")
    return n_reject / n_total

print(tasa_reject(["accept", "reject"]))
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
        id: "S04-T3-A-E3",
        subtopicId: "S04-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Busca el índice del primer `status==\"review\"` en una lista de dicts. Si no hay, imprime -1. Si hay, imprime el índice y el id.",
        hint: "first = None; for i,r in enumerate(...): if ...: first=i; break",
        hints: [
          "first = None; for i,r in enumerate(...): if ...: first=i; break",
          "No uses index() si quieres practicar la búsqueda manual.",
        ],
        edgeCases: ["primer match", "break"],
        tests: "1 C2",
        feedback: "Búsqueda lineal con break evita trabajo innecesario.",
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
        id: "S04-T3-B-E1",
        subtopicId: "S04-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — `nums = [1,2,3,4,5]`. Crea con comprehension la lista de cuadrados y la de pares. Imprímelas.",
        hint: "[x*x for x in nums] y [x for x in nums if x%2==0]",
        hints: [
          "[x*x for x in nums] y [x for x in nums if x%2==0]",
          "Pares: 2,4",
        ],
        edgeCases: ["filtro if"],
        tests: "cuadrados y pares",
        feedback: "Comprehension corta para map/filter simple.",
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
        id: "S04-T3-B-E2",
        subtopicId: "S04-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — De `rows` con status, obtén set de statuses distintos ordenados alfabéticamente para el reporte.",
        hint: "sorted({r['status'] for r in rows})",
        hints: [
          "sorted({r['status'] for r in rows})",
          "accept, reject, review",
        ],
        edgeCases: ["set comprehension"],
        tests: "['accept','reject','review']",
        feedback: "Set comprehension resume categorías presentes en el lote.",
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
        id: "S04-T3-B-E3",
        subtopicId: "S04-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Construye dict `id -> status` por comprehension y calcula tasa de reject como len de rejects / len rows usando otra comprehension para rejects.",
        hint: "by = {r['id']: r['status'] for r in rows}",
        hints: [
          "by = {r['id']: r['status'] for r in rows}",
          "tasa 0.5 con 2 reject de 4",
        ],
        edgeCases: ["dict comp + tasa"],
        tests: "reject [C2,C4] 0.5",
        feedback: "Comprehensions + denominador len(rows) cierran el patrón de resumen.",
        starterCode: {
          language: 'python',
          title: "comp_resumen.py",
          code: `# CASO-LIM-004 · dict id→status
# DEFECT: solo ids
rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}]
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
        id: "S04-T4-A-E1",
        subtopicId: "S04-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Traza: `vals = [2, -1, 3]`, acumulador `s=0`. En cada paso imprime `i, val, s` después de sumar solo positivos.",
        hint: "if val > 0: s += val; luego print",
        hints: [
          "if val > 0: s += val; luego print",
          "Final s=5",
        ],
        edgeCases: ["no sumar negativos"],
        tests: "traza + final 5",
        feedback: "La traza confirma que -1 no movió el acumulador.",
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
        id: "S04-T4-A-E2",
        subtopicId: "S04-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Hay un bug: el contador `n` se incrementa dos veces por fila. Traza e identifica; imprime n corregido para 3 filas (debe ser 3).",
        hint: "Busca n += 1 duplicado",
        hints: [
          "Busca n += 1 duplicado",
          "Deja un solo incremento.",
        ],
        edgeCases: ["doble incremento"],
        tests: "3",
        feedback: "Traza mental: si n sube 2 por fila, el resumen miente el doble.",
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
        id: "S04-T4-A-E3",
        subtopicId: "S04-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Simula tres registros y un dict de contadores. Imprime una línea TRACE por registro con el estado completo del dict (copy o str).",
        hint: "counts = dict; al final de cada iter print TRACE",
        hints: [
          "counts = dict; al final de cada iter print TRACE",
          "Debe verse el crecimiento paso a paso.",
        ],
        edgeCases: ["estado completo por paso"],
        tests: "3 TRACE + FINAL",
        feedback: "Trazar el dict entero evita bugs de clave mal escrita.",
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
        id: "S04-T4-B-E1",
        subtopicId: "S04-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Para n=5, cuenta pasos de un for simple y de un doble for anidado. Imprime ambos números.",
        hint: "linear n, quad n*n",
        hints: [
          "linear n, quad n*n",
          "5 y 25",
        ],
        edgeCases: ["n vs n²"],
        tests: "5 25",
        feedback: "Sentir n² con números chicos prepara el ojo para lotes grandes.",
        starterCode: {
          language: 'python',
          title: "count_steps.py",
          code: `# CASO-LIM-004 · lineal vs cuadrático
# DEFECT: ambos usan un solo loop
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
        id: "S04-T4-B-E2",
        subtopicId: "S04-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — `data = [\"r0\", \"r1\", \"r2\"]`. El código usa `for i in range(1, len(data)+1)` y hace IndexError. Arréglalo para recorrer todos los índices válidos e imprimir cada elemento.",
        hint: "range(len(data)) → 0..n-1",
        hints: [
          "range(len(data)) → 0..n-1",
          "No uses range(1, len+1).",
        ],
        edgeCases: ["IndexError off-by-one"],
        tests: "r0 r1 r2",
        feedback: "stop exclusivo de range es la fuente #1 de IndexError en lotes.",
        starterCode: {
          language: 'python',
          title: "fix_range_obo.py",
          code: `# CASO-LIM-004 · off-by-one
# DEFECT: range(1, len+1) provoca IndexError en el último índice
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
        id: "S04-T4-B-E3",
        subtopicId: "S04-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Reescribe un conteo de pares reject-reject O(n²) ingenuo a un conteo O(n) de rejects (no necesitas pares). Imprime n_reject y comenta en un print por qué O(n) basta para la tasa.",
        hint: "No necesitas combinar pares para la tasa de error.",
        hints: [
          "No necesitas combinar pares para la tasa de error.",
          "tasa = n_reject/n",
        ],
        edgeCases: ["evitar n² innecesario"],
        tests: "3 0.6 + nota",
        feedback: "Elegir el algoritmo correcto es parte del gate de calidad.",
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
      "Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes**: múltiples registros sintéticos, un pase O(n), contadores accept/reject/review, **tasa de error con denominador = n_total** (None si vacío), conservación del **raw** por fila y reporte por stdout. La CLI instalable llega en S10.",
    objectives: [
      "Procesar ≥3 registros sintéticos en un solo pase",
      "Emitir contadores y tasa_reject con denominador correcto",
      "Conservar el original (raw) de cada registro en el resultado",
      "Reutilizar validación tri-estado por campo (S03)",
      "Demo reproducible con if __name__ == '__main__'",
    ],
    requirements: [
      "process_batch(records) → summary con n_total, contadores, tasa_reject, results[]",
      "Cada result incluye raw intacto + status agregado + detalle de campos",
      "tasa_reject is None cuando n_total == 0 (sin ZeroDivisionError)",
      "Sin PII real; datos sintéticos embebidos",
      "Sin loops O(n²) innecesarios para el resumen",
      "README o docstring con denominador de tasas explicado en español",
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
        {"edad": None, "region": "Lima", "monto_ingreso": 10, "raw_line": "|Lima|10"},
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
        {"edad": 40, "region": "Cusco", "monto_ingreso": 100, "raw_line": "40|Cusco|100"},
        {"edad": -3, "region": "Lima", "monto_ingreso": 50, "raw_line": "-3|Lima|50"},
    ]
    summary = process_batch(demo)
    print(format_report(summary))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "En el README muestra una tabla de ejemplo (3 filas), el cálculo de tasa y una captura de la demo stdout. Explica por qué el raw se conserva. Eso es evidencia publicable del gate CP-N1-A.",
    rubric: [
      { criterion: "Procesa lote multi-registro en O(n)", weight: "25%" },
      { criterion: "Tasas con denominador correcto / vacío seguro", weight: "25%" },
      { criterion: "Conserva raw y valida tri-estado", weight: "20%" },
      { criterion: "Reporte stdout legible y demo reproducible", weight: "15%" },
      { criterion: "Sin infinito / sin n² innecesario", weight: "10%" },
      { criterion: "Documentación en español del resumen", weight: "5%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué produce list(range(3))?",
        options: ["[1,2,3]", "[0,1,2,3]", "[3]", "[0,1,2]"],
        correctIndex: 3,
        explanation:
          "range(stop) es 0-inclusive y stop-exclusivo: 0,1,2.",
      },
      {
        question: "zip([1,2,3],[10,20]) sin strict…",
        options: ["Lanza ValueError", "Empareja solo (1,10) y (2,20); el 3 se pierde en silencio", "Rellena con None el tercero", "Empareja en producto cartesiano"],
        correctIndex: 1,
        explanation:
          "zip se detiene en la secuencia más corta. Valida len o usa strict=True (3.10+) para fallar si difieren.",
      },
      {
        question: "Para la tasa de reject del gate, el denominador debe ser…",
        options: ["Solo n_accept", "Siempre 100", "n_total de registros procesados (intentados)", "n_review únicamente"],
        correctIndex: 2,
        explanation:
          "tasa_reject = n_reject / n_total; si n_total==0 → None, no dividir.",
      },
      {
        question: "¿Qué hace continue en un for de líneas de intake?",
        options: ["Salta al siguiente ciclo del bucle", "Termina todo el programa", "Borra la lista", "Convierte la línea en None"],
        correctIndex: 0,
        explanation:
          "continue omite el resto del cuerpo y pasa a la siguiente iteración (p. ej. filas vacías).",
      },
      {
        question: "Un doble for anidado sobre n elementos es aproximadamente…",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 3,
        explanation:
          "n×n pasos → cuadrático. Los resúmenes de tasa bastan con un pase O(n).",
      },
      {
        question: "En un while con centinela \"END\", ¿qué debe pasar cada iteración para no colgarte?",
        options: [
          "Nada: Python corta solo",
          "Actualizar el estado (p. ej. avanzar el índice) y comprobar el centinela",
          "Usar solo continue",
          "Multiplicar n_total por 2",
        ],
        correctIndex: 1,
        explanation:
          "Sin variable de control que cambie (o break en centinela), la condición puede quedar siempre verdadera → loop infinito.",
      },
      {
        question:
          "En un lote de líneas de intake, ¿cuál es la diferencia correcta entre continue y break?",
        options: [
          "continue y break hacen exactamente lo mismo",
          "continue salta a la siguiente iteración; break termina el bucle actual",
          "break salta una fila; continue cierra todo el programa",
          "continue solo existe en while; break solo en for",
        ],
        correctIndex: 1,
        explanation:
          "continue omite el resto del cuerpo y pasa a la siguiente fila (p. ej. vacíos). break sale del bucle (p. ej. ERROR fatal o centinela END). Confundirlos deja pasar filas que debían cortar el lote o corta demasiado pronto.",
      },
      {
        question: "¿Para qué sirve enumerate(ids, start=1) en un reporte de intake?",
        options: [
          "Ordena la lista alfabéticamente",
          "Numera filas desde 1 para humanos sin armar el índice a mano",
          "Elimina duplicados del lote",
          "Convierte la lista en un dict",
        ],
        correctIndex: 1,
        explanation:
          "enumerate entrega (índice, valor). Con start=1 reportas “fila 1, fila 2…” legible para humanos; el índice interno de la lista sigue siendo 0-based.",
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
        note: "Capítulos de loops; aplicar a lotes de intake del curso.",
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
        note: "Micro-práctica de loops",
      },
    ],
  },
}
