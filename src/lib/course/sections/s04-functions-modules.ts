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
        "**Antes de T1, tres ideas base** (no memorices el resto aún). Un **bucle** repite un bloque mientras haya elementos o mientras una condición sea verdadera. Un **centinela** es un valor especial que marca el fin del lote (`\"\"`, `\"END\"`). Una **tasa** es un contador dividido por el total de registros **intentados** — solo si ese total es mayor que cero; si el lote está vacío, reportas `None`, no divides.",
        "Desde **S03** ya validas un registro (accept / reject / review). Aquí aplicas esa lógica a **muchas filas** en un solo pase **O(n)**: recorres el lote, acumulas contadores, evitas bucles infinitos y emites un resumen con **denominador correcto**. Eso es lo que cierra el gate **CP-N1-A**. Empaquetado, CLI y decorators se abordan más adelante; no los necesitas para este cierre.",
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
        "El bucle **`for x in secuencia:`** recorre cada elemento **una vez**, en orden. No necesitas un índice si solo te importa el valor. Las secuencias típicas de intake son: **listas de registros** (dicts), **líneas de texto** y **`range(n)`** cuando quieres un contador 0..n-1.",
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
          "En producción un bucle infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
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
    intro: "Ocho demos **I Do** (uno por subtema). Ejecuta en orden T1→T4 sin saltar: primero observas el patrón ejecutable, luego lo practicas en We Do. Cada demo es un fragmento del procesador por lotes del gate CP-N1-A; el `output` debe coincidir al pulsar Run. Si ves `def nombre(...):`, es solo una receta nombrada para reutilizar el ejemplo. Datos sintéticos; entorno browser-pyodide salvo que se indique.",
    steps: [
      {
        demoId: "S04-T1-A-DEMO",
        subtopicId: "S04-T1-A",
        environment: "browser-pyodide",
        description: "Recorrer lote sintético con for por valor y ver range(n)",
        preamble:
          "En el procesador de intake no validas una sola ficha: recorres un **lote**. Esta demo muestra el esqueleto más simple: un `for` por valor sobre tres registros sintéticos (`C001`…`C003`) y, al final, `range(n)` para ver los índices 0..n−1. No escribas aún. Observa que no hace falta `range(len(...))` para imprimir edades, y que `list(range(3))` termina en 2 (stop exclusivo). Datos ficticios; el `output` debe coincidir al pulsar Run.",
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
          "Si puedes decir sin mirar el código por qué `range(3)` no incluye el 3, ya internalizaste el stop exclusivo. El hábito del for por valor es el esqueleto del gate CP-N1-A. En We Do arreglarás un print incompleto y un contador mal actualizado sobre el mismo tipo de lote.",
      },
      {
        demoId: "S04-T1-B-DEMO",
        subtopicId: "S04-T1-B",
        environment: "browser-pyodide",
        description: "enumerate para reportar fila y zip strict para columnas",
        preamble:
          "Cuando el lote mezcla columnas (`ids`, `regiones`), dos peligros: numerar mal el reporte y emparejar columnas de distinta longitud. Esta demo recorre pares alineados con `enumerate(..., start=1)` y un helper `zip_strict` que lanza si las longitudes no coinciden. Observa el mensaje `desalineado detectado` al acortar `regiones`. No escribas; sigue el `output`.",
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
          "Si puedes explicar por qué un zip corto “se ve bien” y aún así miente el resumen, ya tienes el gate de alineación. En We Do corregirás `start=0`, un producto cartesiano por nested loops, y un `zip_strict` incompleto.",
      },
      {
        demoId: "S04-T2-A-DEMO",
        subtopicId: "S04-T2-A",
        environment: "browser-pyodide",
        description: "while con centinela END sobre buffer de líneas",
        preamble:
          "Cuando el lote llega como stream de líneas, no siempre conoces el tamaño de antemano: usas `while` y un **centinela**. Aquí el buffer simula stdin: `\"Ana|Lima\"`, `\"Luis|Cusco\"`, `\"END\"`, y basura posterior. Observa que `i` avanza siempre y que `END` corta sin procesarse; la línea `\"ignorada\"` no entra al resultado. No escribas; compara con el `output`.",
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
          "Antes de confiar en un while, responde: ¿qué variable cambia? ¿cuándo es falsa la condición o hay break? Si no puedes contestar, reescribe con for o añade un máximo. En We Do corregirás un `continue` que *no* corta el lote y un reintento sin prints.",
      },
      {
        demoId: "S04-T2-B-DEMO",
        subtopicId: "S04-T2-B",
        environment: "browser-pyodide",
        description: "continue salta vacíos; break corta en ERROR fatal",
        preamble:
          "En un lote de líneas, no todo error es igual: el vacío es ruido (sáltalo); un `ERROR` de configuración puede ser **fatal** (corta el lote). Esta demo mezcla `\"\"`, `ok:1`, `ok:2` y `ERROR` antes de un `ok:3` que no debe procesarse. Observa el orden: primero el mensaje fatal, luego `kept` solo con los ok previos. No escribas; verifica el `output`.",
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
          "Si confundes continue y break, o dejas pasar filas fatales o cortas demasiado pronto. Control: ¿`ok:3` debía contarse? No. Principio: ruido ≠ fatal. En We Do limpiarás whitespace con continue y cortarás en 5xx con break — dos herramientas, dos intenciones.",
      },
      {
        demoId: "S04-T3-A-DEMO",
        subtopicId: "S04-T3-A",
        environment: "browser-pyodide",
        description: "Contadores accept/reject/review y tasa con denominador",
        preamble:
          "El gate CP-N1-A no se cierra listando filas: se cierra con un **resumen**. Esta demo recorre statuses sintéticos, llena contadores `accept`/`reject`/`review` en un pase, y calcula `tasa_reject` con denominador `n = len(statuses)`. Observa que el total es 5 y la tasa es 0.4 (2/5), no 2/3 de solo accepts. No escribas; verifica el `output`.",
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
          "Si puedes defender por qué el denominador no es “solo aceptados”, ya evitas dashboards mentirosos. En We Do arreglarás un `n_total` que no sube y una división por cero en lista vacía.",
      },
      {
        demoId: "S04-T3-B-DEMO",
        subtopicId: "S04-T3-B",
        environment: "browser-pyodide",
        description: "Comprehensions para filtrar rejects del resumen",
        preamble:
          "Cuando el filtro del resumen es simple, una list comprehension legible reduce ruido. Esta demo construye `rejects` con ids en status reject y calcula la tasa con `len(rows)` como denominador. Observa que no hace I/O dentro de la comprehension. No escribas; el `output` muestra dos rejects y tasa 2/3.",
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
          "Comprehension ≠ siempre mejor: contadores múltiples y try/except por fila piden for clásico. Principio: filtro simple + denominador `len(rows)`. En We Do: map/filter básico, set de categorías y mini-resumen id→status hacia el You Do.",
      },
      {
        demoId: "S04-T4-A-DEMO",
        subtopicId: "S04-T4-A",
        environment: "browser-pyodide",
        description: "Tabla TRACE de contador durante el lote",
        preamble:
          "Cuando el resumen “sale raro”, no adivines: **traza**. Esta demo imprime en cada paso `i`, el flag y el contador `n_ok` que solo sube si el flag es True. Sigue la fila donde `False` deja `n_ok` en 1. El `FINAL 3` debe cuadrar con la última fila de la tabla. No escribas; lee el `output` como si fuera tu libreta.",
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
          "Si la traza no cuadra con el print final, el bug está en la actualización del estado. En We Do corregirás sumar negativos y un doble `n += 1` por fila — ambos se cazan con traza mental.",
      },
      {
        demoId: "S04-T4-B-DEMO",
        subtopicId: "S04-T4-B",
        environment: "browser-pyodide",
        description: "Detectar O(n²) ingenuo y off-by-one en range",
        preamble:
          "Dos enemigos del resumen a escala: el costo **cuadrático** disfrazado de “doble for inocente” y el **off-by-one** que se salta el primer registro. Esta demo cuenta pasos con n=4 (4 vs 16) y muestra `range(1, len(vals))` omitiendo el 10 inicial. No escribas; relaciona los números con “¿mi tasa miró todas las filas?”.",
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
          "Si tu resumen anida dos fors solo para contar, reescribe a un pase. Si tu range “empieza en 1 por costumbre de Excel”, puedes estar botando la primera fila del intake. We Do te hace sentir 5 vs 25 y arreglar un IndexError.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints** y un starter con un **DEFECT** intencional (CASO-LIM-004). Ejecuta, corrige y compara con la salida esperada; no inventes salidas. Si el bloque se siente largo, un subtema por sesión (~2 h) mantiene la carga razonable. Datos sintéticos únicamente.",
    steps: [
      {
        id: "S04-T1-A-E1",
        subtopicId: "S04-T1-A",
        kind: "guided",
        title: "Imprimir regiones y range(3)",
        preamble:
          "- **Contexto:** el primer paso de un lote de intake es recorrer cada fila y, a veces, numerar posiciones con `range`.\n- **Meta:** practicar `for` por valor y ver el stop exclusivo de `range`.\n- **Éxito:** tres líneas `Lima` / `Cusco` / `Piura` y luego `[0, 1, 2]`.\n- **Límites:** un for simple sin índices manuales; no mutes `regiones`; no dejes el `print('ok', True)` del starter.",
        instruction:
          "1. Revisa el starter: el for de regiones ya está bien.\n2. El DEFECT es no imprimir `list(range(3))` (hay un `print('ok', True)` de relleno).\n3. Sustituye ese print por `print(list(range(3)))`.\n4. Ejecuta y compara con la salida esperada (sin texto extra).",
        hint: "El for sobre regiones ya imprime bien; el problema está en el print final de relleno.",
        hints: [
          "El for sobre regiones ya imprime bien; el problema está en el print final de relleno.",
          "El stop de range es exclusivo: con 3 posiciones debes ver 0, 1 y 2 — no 1..3. Sustituye solo el print de relleno.",
        ],
        edgeCases: ["range stop exclusivo"],
        tests: "Lima / Cusco / Piura + [0,1,2]",
        feedback:
          "El for de regiones ya estaba bien: el fallo era el print de relleno. Si tu salida termina en `[0, 1, 2]` y no en `ok True`, cerraste el contrato del stop exclusivo.",
        retrospective:
          "Principio: listar con for por valor; `range(n)` solo si el índice importa. Malentendido: creer que `range(3)` es 1..3 (incluye el 3). Transfer: el mismo recorrido alimenta contadores del gate CP-N1-A. Self-check: ¿qué imprimiría `list(range(1, 4))` frente a `list(range(3))`?",
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
        title: "Contar adultos con for (sin comprehension)",
        preamble:
          "- **Contexto:** en el resumen de un lote necesitas tasas por condición, no solo listar filas.\n- **Meta:** practicar un contador manual en un `for` (base del gate de resúmenes).\n- **Éxito:** imprimes un solo entero; con `edades = [30, 17, 45, 22]` el valor es `3`.\n- **Límites:** no uses list comprehension; no mutes la lista; frontera `>= 18` inclusiva.",
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
          "El contador en un pase O(n) es el mismo patrón de `n_accept` / `n_reject` del capstone. El error clásico es imprimir la lista entera o contar con un `sum` opaco antes de entender el bucle. ¿Cuántos quedarían si la frontera fuera `> 18`?",
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
        title: "Reportar ids con monto positivo",
        preamble:
          "- **Contexto:** en auditoría de intake a veces reportas solo filas con monto usable, sin borrar el raw del lote.\n- **Meta:** filtrar al *imprimir* con `for` + `if` sobre dicts (misma lógica de T1, nueva superficie).\n- **Éxito:** líneas `C1` y `C4`; luego `n_original 4` (lista intacta).\n- **Límites:** no mutes `lote`; no imprimas montos 0 ni negativos; no uses comprehension si aún no la dominas aquí.",
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
          "Principio: filtrar al reportar no es borrar del lote. Malentendido: tratar 0 o negativo como “casi positivo”. Transfer: en el You Do el `raw` debe sobrevivir al pase. ¿Por qué imprimir `len(lote)` al final y no confiar en “no toqué nada”?",
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
        title: "Numerar filas con enumerate(start=1)",
        preamble:
          "- **Contexto:** al diagnosticar un reject, el humano lee “fila 1”, no “índice 0”.\n- **Meta:** usar `enumerate` con `start=1` sin armar el índice a mano.\n- **Éxito:** exactamente `fila 1: A`, `fila 2: B`, `fila 3: C`.\n- **Límites:** no uses `range(len(ids))`; no dejes `start` en 0.",
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
          "Principio: el número del reporte es humano (`start=1`); el índice de la lista sigue siendo 0-based. Malentendido: mezclar ambos en el mismo cálculo de negocio. Transfer: en tickets de reject dirás “fila 2”, no “índice 1”. ¿Qué imprimiría `start=0` con el mismo f-string?",
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
        title: "Emparejar columnas con zip (y ver el silencio)",
        preamble:
          "- **Contexto:** nombres y edades de un intake deben ir en paralelo, no en producto cartesiano.\n- **Meta:** emparejar con `zip` y observar el truncamiento silencioso al acortar una columna.\n- **Éxito:** `Ana=30`, `Luis=25`, `María=40` y luego `zip corto [('Ana', 30)]`.\n- **Límites:** un solo for sobre `zip`; no nested loops; aquí solo *observas* el silencio (en código real validarías `len`).",
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
          "Nested loops multiplican pares (9 líneas); `zip` alinea en paralelo. Si viste `zip corto` con un solo par, ya sentiste el truncamiento silencioso que miente resúmenes.",
        retrospective:
          "Principio: emparejar columnas es `zip` (o validación de `len`), no doble for. Malentendido: “se ve bien” con zip corto = datos correctos. Transfer: el siguiente ejercicio te obliga a `ValueError` en vez de callar. ¿Qué tasa de reject se inventaría si se pierde la última edad de un lote real?",
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
        title: "zip_strict: fallar si hay desalineación",
        preamble:
          "- **Contexto:** en un pipeline de calidad, desalineación de columnas debe ser error ruidoso, no pérdida silenciosa.\n- **Meta:** implementar validación de longitudes (equivalente pedagógico a `zip(..., strict=True)`).\n- **Éxito:** imprime `DESALINEADO` y luego `OK` (en ese orden).\n- **Límites:** lanza `ValueError` si `len(a) != len(b)`; no uses la API `strict=` si tu entorno no es 3.10+ — el helper basta.",
        instruction:
          "1. Completa `zip_strict`: si longitudes difieren, `raise ValueError`.\n2. Primer intento con listas 3 vs 2 → captura y `print(\"DESALINEADO\")`.\n3. Segundo intento con listas de longitud 2 → `print(\"OK\")` si no lanza.",
        hint: "Compara len(a) y len(b) antes de zip; si difieren, raise ValueError.",
        hints: [
          "Compara len(a) y len(b) antes de zip; si difieren, raise ValueError.",
          "Necesitas dos bloques try/except: uno que imprima DESALINEADO y otro OK.",
        ],
        edgeCases: ["strict alignment"],
        tests: "DESALINEADO luego OK",
        feedback:
          "Si no sale `DESALINEADO` primero, el `raise` no corrió con longitudes 3 vs 2. Si no sale `OK` después, el segundo bloque no validó un par alineado. El silencio de `zip` sin assert es el bug a evitar.",
        retrospective:
          "Principio: desalineación debe ser error ruidoso. Malentendido: “casi igual longitud” es inocuo. Transfer: en el You Do no zipees columnas de fuentes distintas sin assert. Self-check: ¿qué imprime el segundo bloque si olvidas el `raise` y solo haces `zip` silencioso?",
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
        title: "While hasta centinela vacío",
        preamble:
          "- **Contexto:** un archivo de intake a veces trae basura *después* de una línea en blanco que marca fin de lote.\n- **Meta:** con `while` e índice, cortar en string vacío **sin incluirlo**.\n- **Éxito:** imprime `['r1', 'r2']` (sin `r3`).\n- **Límites:** el blank es centinela → `break`, no `continue`; avanza `i` siempre.",
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
          "Principio: blank como fin de lote = `break`, no `continue`. Malentendido: “saltar vacío” siempre es continue (eso es basura intermitente). Transfer: basura *después* del centinela no debe inflar contadores del batch. Self-check: ¿qué lista obtienes si dejas `continue` aquí?",
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
        title: "Reintentos con tope MAX",
        preamble:
          "- **Contexto:** un reintento de red o de parseo no puede colgarse: siempre hay cota superior.\n- **Meta:** `while intentos < MAX` con variable de control que sube cada vuelta.\n- **Éxito:** `intento 1`, `intento 2`, `intento 3`, luego `done 3`.\n- **Límites:** incrementa *dentro* del while; no pongas `while True` aquí; no omitas los prints por intento.",
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
          "Principio: reintentos con cota = variable de control que avanza. Malentendido: “el while se cuelga por magia” — casi siempre es estado que no cambia. Transfer: en streams reales combinas tope + timeout + log. Self-check: ¿qué pasa si mueves `intentos += 1` fuera del while?",
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
        title: "Cola con pause y break",
        preamble:
          "- **Contexto:** un worker saca jobs de una cola hasta una condición de negocio (pausa), no hasta vaciar siempre.\n- **Meta:** `while cola` + `pop(0)` + `break` condicional, dejando el resto visible.\n- **Éxito:** `job1`, `job2`, `PAUSE`, `rest ['job3']`.\n- **Límites:** no uses `for` sobre una copia si practicas while; no vacíes la cola tras el break.",
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
          "Principio: while + cola hasta condición de negocio, no hasta vaciar siempre. Malentendido: break “pierde” datos — en realidad deja residual auditable. Transfer: reportar resto es hábito de worker. ¿Qué pasa si en `job2` usas `continue` en vez de `break`?",
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
        title: "Saltar vacíos con continue",
        preamble:
          "- **Contexto:** archivos de intake traen filas en blanco o solo espacios que no son regiones.\n- **Meta:** filtrar con `continue` cuando `not x.strip()`.\n- **Éxito:** dos líneas: `Lima` y `Cusco`.\n- **Límites:** no uses `break` (no es fin de lote, solo basura); no mutes `raw`.",
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
          "Principio: basura intermitente = continue; fin de lote = break (otro ejercicio). Malentendido: `\"  \"` es región válida. Transfer: el siguiente We Do usa break en 5xx, no en vacíos. ¿Por qué `strip` y no solo `if not x`?",
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
        title: "Cortar el lote en error fatal (5xx)",
        preamble:
          "- **Contexto:** un 5xx de configuración no es “otra fila más”: debe detener el procesamiento del lote.\n- **Meta:** `break` en `code >= 500`, contar solo los `ok` previos.\n- **Éxito:** `ok`, `ok`, `STOP`, `n_ok 2` (el 200 final no se procesa).\n- **Límites:** no solo imprimas error y sigas; no cuentes el 500 como ok.",
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
          "Principio: fatal de configuración corta el lote; no “marca y sigue”. Malentendido: contar el 500 o el 200 posterior como ok. Transfer: en el You Do un reject de fila ≠ abortar el batch — aquí el 5xx es otro nivel. ¿Por qué `n_ok` no es 3?",
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
        title: "while True con END y salvaguarda",
        preamble:
          "- **Contexto:** a veces el patrón natural es `while True` + break; es legítimo solo si la salida es obvia y hay red de seguridad.\n- **Meta:** leer buffer con índice, break en `END`, guard `i > 10`.\n- **Éxito:** imprime `['a', 'b']` (sin `END`).\n- **Límites:** no proceses END como dato; no quites la salvaguarda; avanza `i` siempre.",
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
          "Principio: `while True` es legítimo solo con salida obvia + red de seguridad. Malentendido: “while True siempre es malo” — lo malo es no tener salida garantizada. Transfer: en el You Do prefiere for sobre listas en memoria; reserva while para streams.",
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
        id: "S04-T3-A-E1",
        subtopicId: "S04-T3-A",
        kind: "guided",
        title: "Contadores accept/reject/total en un pase",
        preamble:
          "- **Contexto:** el resumen del batch necesita tres números honestos: accept, reject y total intentado.\n- **Meta:** incrementar contadores en un solo `for` O(n).\n- **Éxito:** imprime `2 1 3` (accept, reject, total).\n- **Límites:** `n_total` sube en *cada* fila, no solo en accept; no uses comprehensions aquí.",
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
          "Principio: tres números honestos en un pase O(n). Malentendido: total = solo accepts. Transfer: sin `n_total` real, `tasa_reject` del You Do es basura o crash. Self-check: ¿qué imprimirías si olvidaras el `elif reject` con el fixture actual?",
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
        title: "Tasa de reject sin división por cero",
        preamble:
          "- **Contexto:** un lote vacío no es tasa 0 automática ni crash: se reporta `None`.\n- **Meta:** `tasa_reject = n_reject / n_total` solo si `n_total > 0`.\n- **Éxito:** con `[\"accept\",\"reject\",\"accept\"]` imprime `0.3333`; con `[]` imprime `None`.\n- **Límites:** cuenta **reject**, no accept; no dejes que `[]` lance `ZeroDivisionError`.",
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
          "Principio: tasa = rejects / intentados, o `None` si no hubo intentados. Malentendido: vacío = 0 automático, o numerador invertido “que igual pasa”. Transfer: el dashboard del gate asume esta convención en el You Do.",
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
        id: "S04-T3-A-E3",
        subtopicId: "S04-T3-A",
        kind: "transfer",
        title: "Primer review con búsqueda y break",
        preamble:
          "- **Contexto:** en triaje de calidad a veces basta el *primer* registro en review, no el catálogo completo.\n- **Meta:** búsqueda lineal con `enumerate` + `break` (sin `.index()`).\n- **Éxito:** imprime `1 C2` (índice e id); si no hubiera review, `-1`.\n- **Límites:** no uses `.index()`; no sigas el bucle tras el primer match; no busques `accept`.",
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
          "Principio: primer hallazgo = búsqueda lineal + `break` (sin `.index()` que lanza si falta). Malentendido: seguir el for “por si hay más”. Transfer: en triaje del batch a veces basta el primer review. Self-check: ¿por qué no imprimir también el segundo review C3?",
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
        title: "Cuadrados y pares con list comprehension",
        preamble:
          "- **Contexto:** antes de filtrar rejects del batch, practicas map/filter corto con números sintéticos (misma forma que filtrar ids por status).\n- **Meta:** una comprehension de transformación y una de filtro.\n- **Éxito:** `[1, 4, 9, 16, 25]` y `[2, 4]`.\n- **Límites:** sin `for` explícito en este ejercicio; una comprehension por lista.",
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
          "Principio: comprehension corta para map/filter de una línea. Malentendido: anidar tres niveles o meter prints “porque cabe”. Transfer: cuando el filtro del intake tenga varias ramas, vuelve al for. Self-check: ¿dónde pondrías el `if` de pares en la sintaxis?",
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
        title: "Categorías únicas con set comprehension",
        preamble:
          "- **Contexto:** el reporte de calidad lista qué statuses *aparecieron*, sin duplicar.\n- **Meta:** set comprehension + `sorted` para un catálogo estable.\n- **Éxito:** `['accept', 'reject', 'review']`.\n- **Límites:** no dejes la lista sucia con duplicados; no hardcodees las tres cadenas.",
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
          "Principio: set = categorías presentes; `sorted` = reporte determinista. Malentendido: listar a mano accept/reject/review. Transfer: el You Do no debe fijar la taxonomía en un print. Self-check: ¿qué pasa si llega un status nuevo sin tocar ese hardcode?",
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
        title: "Dict id→status y tasa de reject",
        preamble:
          "- **Contexto:** el resumen del gate combina un mapa por id y una tasa sobre el lote completo.\n- **Meta:** dict comprehension + lista de rejects + `len(rejects)/len(rows)`.\n- **Éxito:** imprime `reject ['C2', 'C4'] 0.5` (status de C2, lista, tasa).\n- **Límites:** denominador = `len(rows)`; no mutes `rows`; datos sintéticos del starter con 4 filas.",
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
          "Principio: mapa id→status + tasa con denominador del lote completo. Malentendido: dividir solo entre rejects o solo entre accepts. Transfer: este mini-pipeline es el puente directo al You Do del gate CP-N1-A. Self-check: ¿por qué el denominador no es `len(rejects)`?",
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
        id: "S04-T4-A-E1",
        subtopicId: "S04-T4-A",
        kind: "guided",
        title: "Traza de acumulador (solo positivos)",
        preamble:
          "- **Contexto:** depurar un acumulador del resumen exige ver el estado *por fila*.\n- **Meta:** sumar solo `val > 0` e imprimir traza `i, val, s`.\n- **Éxito:** filas `0 2 2`, `1 -1 2`, `2 3 5` y `final 5`.\n- **Límites:** el negativo no mueve `s`; imprime la traza en cada paso, no solo el final.",
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
          "Principio: traza por fila confirma la regla de actualización. Malentendido: “arreglar a ciegas el final”. Transfer: el mismo hábito caza el doble conteo del siguiente ejercicio. ¿Qué `final` sale si la condición es `>= 0`?",
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
        title: "Corregir doble conteo por fila",
        preamble:
          "- **Contexto:** un resumen que cuenta el doble destruye tasas del gate (parecen 200%).\n- **Meta:** localizar el DEFECT de incremento duplicado y dejar un solo `n += 1` por fila.\n- **Éxito:** imprime `3`.\n- **Límites:** no hardcodees `print(3)`; no borres el for.",
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
          "Principio: un incremento por evento real. Malentendido: “si el test pide 3, imprimir 3 basta”. Transfer: traza mental (filas × pasos) caza el doble conteo antes de tocar el gate. Self-check: ¿dónde se cuela un segundo `+=` al copiar un bloque?",
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
        title: "Traza del dict de contadores",
        preamble:
          "- **Contexto:** cuando los contadores viven en un dict, un typo de clave o un “pisado” deja el resumen incoherente.\n- **Meta:** incrementar con `get` e imprimir TRACE del estado completo por registro.\n- **Éxito:** tres líneas `TRACE i status {...}` crecientes y `FINAL {'accept': 2, 'reject': 1}`.\n- **Límites:** no asignes `counts[st] = 1` (pisa); no omitas TRACE intermedias.",
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
          "Principio: el dict no cuenta solo — tú defines la actualización. Malentendido: `counts[st] = 1` “reinicia bien”. Transfer: TRACE del estado completo se lleva al logging del procesador real. Self-check: ¿qué imprime la segunda TRACE si olvidas el `get`?",
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
        title: "Contar pasos O(n) vs O(n²)",
        preamble:
          "- **Contexto:** con n chico el cuadrático no “se siente”, pero el conteo de pasos sí lo delata.\n- **Meta:** derivar pasos de un for simple y de un doble for con `n=5`.\n- **Éxito:** imprime `5 25`.\n- **Límites:** no inventes los números; cuéntalos con incrementos reales en bucles.",
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
          "Principio: contar pasos delata n² antes de que el lote “se sienta” lento. Malentendido: doble for = más rigor de calidad. Transfer: el gate CP-N1-A pide demos rápidas — resumen O(n²) es olor a rediseño. Self-check: ¿cuántos pasos tendría un triple for anidado con n=5?",
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
        id: "S04-T4-B-E2",
        subtopicId: "S04-T4-B",
        kind: "independent",
        title: "Corregir off-by-one en range",
        preamble:
          "- **Contexto:** un IndexError al final del lote suele ser stop exclusivo mal usado, no “lista rota”.\n- **Meta:** recorrer todos los índices válidos con `range(len(data))`.\n- **Éxito:** `r0`, `r1`, `r2` (una por línea).\n- **Límites:** corrige el `range`, no parches con `if i < len` sobre el range roto; no uses `range(1, len+1)`.",
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
          "Principio: stop exclusivo de `range` → índices 0..n−1. Malentendido: “empieza en 1 y suma 1 al len”. Transfer: si no necesitas el índice, `for x in data` elimina el off-by-one de raíz. Self-check: ¿qué imprime `list(range(len([\"a\",\"b\"])))`?",
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
        id: "S04-T4-B-E3",
        subtopicId: "S04-T4-B",
        kind: "transfer",
        title: "Reescribe conteo n² a O(n)",
        preamble:
          "- **Contexto:** alguien “contó pares reject-reject” con doble for para una tasa que solo necesita rejects.\n- **Meta:** reescribir a conteo O(n) de rejects y tasa `n_reject/n`.\n- **Éxito:** `3 0.6` y exactamente `nota: la tasa solo necesita conteo O(n), no pares O(n2)`.\n- **Límites:** no dejes el doble for; no inventes otra métrica de pares.",
        instruction:
          "1. El starter anida fors y cuenta mal (DEFECT).\n2. Calcula `n` y `n_reject` en un pase (o `sum` simple).\n3. Imprime `n_reject` y `round(n_reject/n, 2)`.\n4. Imprime **exactamente**: `print(\"nota: la tasa solo necesita conteo O(n), no pares O(n2)\")`.",
        hint: "La tasa de reject no necesita combinar pares: basta un conteo O(n).",
        hints: [
          "La tasa de reject no necesita combinar pares: basta un conteo O(n).",
          "Tras 3 0.6, imprime la nota con el texto exacto del éxito (O(n) vs pares O(n2)).",
        ],
        edgeCases: ["evitar n² innecesario"],
        tests: "3 0.6 + nota",
        feedback:
          "Si ves un número enorme (p. ej. 15), el doble for sigue contando pares. Con 5 filas y 3 rejects, un pase da `3 0.6`; la línea `nota:` debe coincidir **letra por letra** con el contrato.",
        retrospective:
          "Principio: la tasa del batch es conteo O(n), no combinatoria de pares. Malentendido: “más bucles = más rigor de calidad”. Transfer: lleva esta decisión de algoritmo al You Do del gate CP-N1-A. Self-check: ¿qué métrica *sí* pediría un doble for legítimo?",
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
      "Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes** que hace un solo pase O(n) sobre múltiples registros sintéticos. El procesador emite contadores accept/reject/review y una **tasa de error con denominador = n_total** (`None` si el lote está vacío); además conserva el **raw** por fila y reporta por stdout. El starter trae `_run_tests` con un fixture de 3 filas y un lote vacío: implementa las tres funciones hasta que `tests OK` se imprima. El empaquetado CLI se ve más adelante en el curso.",
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
      "En el README muestra una tabla de ejemplo (3 filas del fixture o del demo), el cálculo de tasa (n_reject / n_total) y una captura de la demo stdout. Explica por qué el raw se conserva y qué haces cuando el lote está vacío. Eso es evidencia publicable del gate CP-N1-A.",
    rubric: [
      { criterion: "Procesa lote multi-registro en O(n)", weight: "25%" },
      { criterion: "Tasas con denominador correcto / vacío seguro", weight: "25%" },
      { criterion: "Conserva raw y valida tri-estado", weight: "20%" },
      { criterion: "Reporte stdout legible y demo reproducible", weight: "15%" },
      { criterion: "Sin infinito / sin n² innecesario", weight: "10%" },
      { criterion: "Documentación en español del resumen", weight: "5%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿puedes defender en 30 segundos por qué `tasa_reject` usa `n_total` y no solo accepts, y por qué el vacío es `None`? (2) ¿qué invariante demuestras con `_run_tests` (raw intacto, n_total, lote vacío)? (3) Si mañana el lote trae 100_000 filas, ¿tu `process_batch` sigue siendo un solo pase O(n)? Escribe en el README una frase de impacto medible (antes/después del gate) sin PII real.",
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
        question: "¿Qué hace zip([1,2,3],[10,20]) sin strict?",
        options: ["Lanza ValueError", "Empareja solo (1,10) y (2,20); el 3 se pierde en silencio", "Rellena con None el tercero", "Empareja en producto cartesiano"],
        correctIndex: 1,
        explanation:
          "zip se detiene en la secuencia más corta. Valida len o usa strict=True (3.10+) para fallar si difieren.",
      },
      {
        question: "¿Para la tasa de reject del gate, el denominador debe ser?",
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
        question: "¿Un doble for anidado sobre n elementos es aproximadamente?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 3,
        explanation:
          "n×n pasos → cuadrático. Los resúmenes de tasa bastan con un pase O(n).",
      },
      {
        question: "En un while con centinela \"END\", ¿qué debe pasar cada iteración para no colgarte?",
        options: ["Nada: Python corta solo", "Actualizar el estado (p. ej. avanzar el índice) y comprobar el centinela", "Usar solo continue", "Multiplicar n_total por 2"],
        correctIndex: 1,
        explanation:
          "Sin variable de control que cambie (o break en centinela), la condición puede quedar siempre verdadera → bucle infinito.",
      },
      {
        question:
          "En un lote de líneas de intake, ¿cuál es la diferencia correcta entre continue y break?",
        options: ["continue y break hacen exactamente lo mismo", "break salta una fila; continue cierra todo el programa", "continue salta a la siguiente iteración; break termina el bucle actual", "continue solo existe en while; break solo en for"],
        correctIndex: 2,
        explanation:
          "continue omite el resto del cuerpo y pasa a la siguiente fila (p. ej. vacíos). break sale del bucle (p. ej. ERROR fatal o centinela END). Confundirlos deja pasar filas que debían cortar el lote o corta demasiado pronto.",
      },
      {
        question: "¿Para qué sirve enumerate(ids, start=1) en un reporte de intake?",
        options: ["Numera filas desde 1 para humanos sin armar el índice a mano", "Ordena la lista alfabéticamente", "Elimina duplicados del lote", "Convierte la lista en un dict"],
        correctIndex: 0,
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
