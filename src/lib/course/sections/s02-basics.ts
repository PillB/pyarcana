import type { CourseSection } from '../../types'

export const section02: CourseSection = {
  id: 'basics',
  index: 2,
  title: 'Valores, tipos, operadores e I/O',
  shortTitle: 'Basics de Python',
  tagline: 'Literales, nombres, operadores, Decimal e I/O para el parser de intake',
  estimatedHours: 6,
  level: 'Principiante',
  phase: 0,
  icon: 'Code2',
  accentColor: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  jobRelevance:
    'En onboarding de data en bancos, fintech y retail en Perú, tu primer script “de verdad” no es un loop fancy: es leer campos de un formulario o CSV, saber qué tipo tiene cada valor, convertir texto a número sin crashear, y conservar el original para auditoría. Si confundes 42 con "42", usas float para soles o sobrescribes el raw al normalizar, generas bugs de calidad de datos caros. Esta sección construye esa base: valores, nombres, operadores e I/O hacia el parser de intake del capstone CP-N1-A.',
  learningOutcomes: [
    { text: 'Identificar literales y tipos básicos (int, float, str, bool, None) y explicar el tipo de expresiones simples' },
    { text: 'Inspeccionar con type/isinstance y convertir/validar valores de forma explícita' },
    { text: 'Asignar nombres con convenciones PEP 8 y distinguir asignación de comparación' },
    { text: 'Explicar identidad vs igualdad, mutabilidad y conservar copias/valores originales' },
    { text: 'Evaluar aritmética y comparaciones respetando precedencia' },
    { text: 'Calcular montos en soles con Decimal y redondeo a 2 decimales' },
    { text: 'Usar input/print y f-strings para capturar y reportar datos' },
    { text: 'Parsear un registro sintético de cliente conservando originales y reportando errores accionables' },
  ],
  theory: [
    {
      heading: 'De “Absolute Basics” a valores y tipos (mapa de la sección)',
      paragraphs: [
        'En V3, **S02 no cubre condicionales, loops, funciones avanzadas ni comprehensions** como camino principal del estudiante. Esos temas se posponen a secciones posteriores. Aquí dominas lo que un parser de intake necesita primero: **qué es un valor**, **qué tipo tiene**, **cómo se nombra**, **cómo se opera** y **cómo entra/sale texto** sin perder el original.',
        'El hilo conductor es un **registro sintético de cliente** (nombres, dos apellidos, contacto, dirección, y a veces edad o monto). Todo el material usa datos ficticios (`example.com`, teléfonos inventados). Nunca subas PII real al repo.',
        'Orden pedagógico: **T1 Valores** (literales → inspección/conversión) → **T2 Nombres** (asignación/PEP 8 → identidad y copias) → **T3 Operadores** (precedencia → Decimal para dinero) → **T4 I/O** (f-strings → parse con errores). Los **ocho subtemas** están completos: theory + I Do + E1/E2/E3 por cada uno.',
      ],
      callout: {
        type: 'info',
        title: 'Fuera de alcance S02 V3 (no es el path del estudiante)',
        content:
          'Condicionales profundos, for/while, *args/**kwargs y list comprehensions ya no son el núcleo de S02. Si ves material legado con “calculadora de propinas” o budget calculator, está **reemplazado** por el esqueleto del **parser de intake**. Puedes recordar esos ejemplos para más adelante; no los uses como entrega de esta sección.',
      },
    },
    {
      heading: 'Literales y tipos básicos',
      subtopicId: 'S02-T1-A',
      paragraphs: [
        'Un **literal** es un valor escrito directamente en el código: `34`, `150.5`, `"Quispe"`, `True`, `None`. Python clasifica cada valor en un **tipo**. Los tipos básicos de S02 son: **`int`** (enteros: `0`, `34`, `-7`), **`float`** (punto flotante: `150.5`, `1.0`), **`str`** (texto Unicode: `"María José"`, `"Ñahui"`), **`bool`** (`True` / `False`) y **`None`** (ausencia de valor; su tipo es **`NoneType`**).',
        'La trampa clásica de intake: el número **`42`** (int) y el texto **`"42"`** (str) **no son el mismo valor**. `42 == "42"` es `False`. En formularios y CSV **casi todo llega como str**. Si sumas o comparas sin convertir, obtienes `TypeError` o lógica silenciosamente incorrecta. El teléfono **`999000111` debe modelarse como `str`**, no como `int`: no es una cantidad aritmética y puede tener ceros a la izquierda en otros países.',
        'Para ver el tipo usa **`type(x)`** (devuelve la clase) o, en reportes didácticos, `type(x).__name__` (`"int"`, `"str"`, …). Más adelante preferirás `isinstance` para validar; primero entrenas el ojo con literales. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `isinstance(True, int)` es `True`. Para lógica de negocio, trata `bool` como booleano, no como `0`/`1`, salvo que documentes una conversión explícita.',
      ],
      code: {
        language: 'python',
        title: 'literales_cliente.py',
        code: `# Registro sintético — cada literal tiene un tipo
nombres = "María José"       # str
apellido_paterno = "Quispe"  # str
edad = 34                    # int
monto_soles = 150.5          # float (¡aún no Decimal!)
activo = True                # bool
referencia = None            # NoneType

print(type(nombres).__name__)   # str
print(type(edad).__name__)      # int
print(type(referencia).__name__)  # NoneType

# 42 vs "42": literales distintos
print(type(42).__name__)     # int
print(type("42").__name__)   # str
print(42 == "42")            # False`,
        output: `str
int
NoneType
int
str
False`,
      },
      callout: {
        type: 'tip',
        title: 'Regla de intake',
        content:
          'Pregunta por cada campo: ¿es cantidad, texto, bandera o ausencia? Teléfono, DNI y códigos → str. Conteos enteros → int. Montos en soles → en T3 usarás Decimal, no float a ciegas. Ausencia → None (no la cadena "None").',
      },
    },
    {
      heading: 'Inspección, conversión y validación',
      subtopicId: 'S02-T1-B',
      paragraphs: [
        '**`type(x)`** responde “¿qué es esto ahora?”. **`isinstance(x, int)`** responde “¿puedo tratarlo como int?” (incluye subtipos). En parsers, `isinstance` suele ser más útil que comparar `type(x) is int`, porque documenta la intención de validación.',
        'La conversión explícita usa constructores: **`int()`**, **`float()`**, **`str()`**. El texto de formularios trae espacios: **`valor.strip()`** antes de convertir. `int(" 19 ")` funciona; `int("19.5")` o `int("abc")` lanzan **`ValueError`**. **Nunca uses `eval()`** sobre input de usuario: es un riesgo de seguridad y un anti-patrón de calidad de datos.',
        'Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar.',
      ],
      code: {
        language: 'python',
        title: 'convertir_campo.py',
        code: `def convertir_edad(campo: str, valor: str):
    """Intenta int(strip). Mensaje accionable si falla."""
    try:
        n = int(valor.strip())
        print(f"OK {campo}={n}")
        return n
    except ValueError:
        print(f"ERROR en '{campo}': no se pudo convertir {valor!r} a int")
        return None

convertir_edad("edad", " 19 ")
convertir_edad("edad", "abc")

print(isinstance(19, int))       # True
print(isinstance("19", int))     # False`,
        output: `OK edad=19
ERROR en 'edad': no se pudo convertir 'abc' a int
True
False`,
      },
      callout: {
        type: 'warning',
        title: 'No eval, no silent pass',
        content:
          '`except: pass` esconde basura de datos. `eval(input())` es inaceptable. Preferir constructores + ValueError + mensaje con nombre de campo y valor recibido (repr).',
      },
    },
    {
      heading: 'Asignación y convenciones de nombres',
      subtopicId: 'S02-T2-A',
      paragraphs: [
        '**`=` asigna** un nombre a un valor en el namespace actual. **`==` compara** igualdad y devuelve un `bool`. En versiones modernas de Python, `if x = 1:` es **SyntaxError** (el walrus `:=` es otro tema y no es el default de S02). Mezclar `=` y `==` es el bug de novato más citado en code review junior.',
        'PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`), **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`), **`CapWords`** para clases (más adelante). Evita nombres de una sola letra confusos: **`l` / `O` / `I`** se confunden con `1` y `0`. Prefiere `longitud`, `indice`, `columna`.',
        'En el schema de intake usa nombres estables y en español técnico claro: `nombres`, `apellido_paterno`, `apellido_materno`, `contacto`, `direccion`. No inventes parentesco real a partir de apellidos: son **campos de texto**, no una afirmación genealógica. Si un nombre no existe aún, Python lanza **`NameError`** — señal de typo o de usar antes de asignar.',
      ],
      code: {
        language: 'python',
        title: 'nombres_pep8.py',
        code: `nombres_cliente = "Ana"
apellido_paterno = "García"
EDAD_MINIMA = 18
edad = 25

# Comparación con == (no uses = aquí)
if edad == EDAD_MINIMA:
    print("edad mínima exacta")
else:
    print(f"edad={edad}, mínima={EDAD_MINIMA}")

# NameError si descomentas:
# print(apellido_materno)`,
        output: `edad=25, mínima=18`,
      },
      callout: {
        type: 'tip',
        title: 'Checklist rápido PEP 8 (S02)',
        content:
          'Variables/funciones: snake_case. Constantes: UPPER_CASE. Comparar: ==. Asignar: =. Campos intake: apellido_paterno / apellido_materno (no Apellido1). Evitar l, O, I sueltos.',
      },
    },
    {
      heading: 'Identidad, mutabilidad y copias superficiales',
      subtopicId: 'S02-T2-B',
      paragraphs: [
        '**`==` compara valor**; **`is` / `is not` comparan identidad** (¿mismo objeto en memoria?). El idioma correcto para ausencia es **`x is None`** (no `x == None`, aunque a veces “funcione”). `id(x)` expone un identificador del objeto; úsalo para entender demos, no en lógica de negocio rutinaria.',
        'Los **`str` son inmutables**: `.strip()` o concatenar devuelve **otro** string; el original no cambia. Las **`list` son mutables**: `append` altera el mismo objeto. Si `b = a` y `a` es una lista, **`b` es un alias**: mutar `b` muta `a`. Para independizar: **`a.copy()`** o **`a[:]`** (copia superficial).',
        'Patrón de calidad de datos: guarda **`campo_raw`** (o un dict `raw`) con el texto original y trabaja en **`campo` / `clean`**. Si el parse falla, **el raw sigue ahí** para el mensaje de error y para reintentos. Nunca sobrescribas el original con la versión normalizada en el mismo nombre si necesitas auditoría.',
      ],
      code: {
        language: 'python',
        title: 'raw_vs_alias.py',
        code: `raw_nombre = "  José Ñahui  "
clean_nombre = raw_nombre.strip()
print(repr(raw_nombre), "→", repr(clean_nombre))
print("mismo objeto?", raw_nombre is clean_nombre)  # False

a = [1, 2, 3]
b = a            # alias
c = a.copy()     # copia superficial
b.append(4)
print("a (alias mutado):", a)   # [1, 2, 3, 4]
print("c (copia):", c)          # [1, 2, 3]
print("a is b:", a is b)        # True
print("a is c:", a is c)        # False

x = None
print(x is None)  # True — idioma canónico`,
        output: `'  José Ñahui  ' → 'José Ñahui'
mismo objeto? False
a (alias mutado): [1, 2, 3, 4]
c (copia): [1, 2, 3]
a is b: True
a is c: False
True`,
      },
      callout: {
        type: 'danger',
        title: 'Alias en listas de errores o campos',
        content:
          'Si haces `clean = raw` cuando `raw` es un dict/list mutable y luego mutas `clean`, corrompes el original. Copia o construye un dict nuevo con claves `*_raw` y normalizados.',
      },
    },
    {
      heading: 'Operadores y precedencia',
      subtopicId: 'S02-T3-A',
      paragraphs: [
        'Los operadores aritméticos de S02: **`+`**, **`-`**, **`*`**, **`/`** (división verdadera → `float`), **`//`** (división entera hacia −∞), **`%`** (resto) y **`**`** (potencia). Las **comparaciones** (`==`, `!=`, `<`, `<=`, `>`, `>=`) devuelven `bool` y se combinan con la aritmética en expresiones de negocio (rangos, umbrales).',
        'La **precedencia** importa: `*` y `/` van antes que `+` y `-`; `**` es aún más prioritario y se asocia a la derecha. Trampa clásica: **`-3**2` vale `-9`**, no `9`, porque el unario `-` se aplica al resultado de `3**2`. Usa **`(-3)**2`** si quieres el cuadrado del negativo. Cuando dudes, **paréntesis**: `(a + b) * c` no es lo mismo que `a + b * c`.',
        'En intake peruano, un precio con IGV 18% se escribe mentalmente como *base × (1 + 0.18)*. Si escribes `base + base * 0.18` sin paréntesis extra, la precedencia de `*` ya lo resuelve; si mezclas sumas de líneas y tasas, **paréntesis explícitos** evitan bugs de code review. Para dinero real en soles, **T3-B usa `Decimal`** — aquí entrenas la expresión; allá entrenas la precisión.',
      ],
      code: {
        language: 'python',
        title: 'precedencia_ops.py',
        code: `a, b, c = 10, 3, 2
print("10 // 3 =", a // b)   # 3
print("10 % 3  =", a % b)    # 1
print("3 ** 2  =", b ** c)   # 9
print("a + b * c =", a + b * c)      # 16
print("(a + b) * c =", (a + b) * c)  # 26
print("-3**2 =", -3**2)              # -9
print("(-3)**2 =", (-3)**2)          # 9`,
        output: `10 // 3 = 3
10 % 3  = 1
3 ** 2  = 9
a + b * c = 16
(a + b) * c = 26
-3**2 = -9
(-3)**2 = 9`,
      },
      callout: {
        type: 'tip',
        title: 'Paréntesis > memoria de precedencia',
        content:
          'Si un junior tiene que reabrir el manual de precedencia para entender tu línea, reescribe con paréntesis. En code review peruano de data, claridad gana a “clever one-liner”.',
      },
    },
    {
      heading: 'Decimal para dinero y redondeo',
      subtopicId: 'S02-T3-B',
      paragraphs: [
        '**`float` no es dinero.** `0.1 + 0.2` produce `0.30000000000000004` por representación binaria. En montos en **soles (S/)** de fintech, retail o bancos, usa **`decimal.Decimal`**. Construye desde **`str`**: `Decimal("0.1")`, **nunca** `Decimal(0.1)` (ya arrastras el error del float).',
        'Redondeo a céntimos: **`quantize(Decimal("0.01"))`**. El redondeo bancario por defecto suele ser **`ROUND_HALF_EVEN`** (mitad al par). Importa: `from decimal import Decimal, ROUND_HALF_EVEN`. Patrón: subtotal + IGV 18% → quantize en cada paso monetario que debas mostrar o persistir.',
        'En intake, el campo monto llega como **texto** (`"150.50"`). Parseas con `Decimal(texto.strip())`, capturas `InvalidOperation`, y reportas error con nombre de campo. **Convención S02: punto decimal** (`150.50`), no coma; si el CSV trae coma, documenta la normalización antes de Decimal.',
      ],
      code: {
        language: 'python',
        title: 'decimal_igv.py',
        code: `from decimal import Decimal, ROUND_HALF_EVEN

print("float:", 0.1 + 0.2)
print("Decimal:", Decimal("0.1") + Decimal("0.2"))

subtotal = Decimal("100.00")
igv = (subtotal * Decimal("0.18")).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
total = (subtotal + igv).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
print("subtotal", subtotal, "IGV", igv, "total", total)`,
        output: `float: 0.30000000000000004
Decimal: 0.3
subtotal 100.00 IGV 18.00 total 118.00`,
      },
      callout: {
        type: 'danger',
        title: 'Nunca Decimal(0.1) ni float para soles',
        content:
          'Decimal(0.1) hereda la basura del float. Decimal("0.1") es la forma correcta. Multiplicar montos con float y “arreglar” con round() al final sigue siendo frágil en reportes contables.',
      },
    },
    {
      heading: 'input, print y f-strings',
      subtopicId: 'S02-T4-A',
      paragraphs: [
        '**`input(prompt)`** siempre devuelve **`str`**, aunque el usuario escriba dígitos. En el browser/Pyodide a menudo **simulas input** con variables o parámetros de función (testeable). **`print(*args, sep=" ", end="\\n")`** controla separadores y fin de línea.',
        'Las **f-strings** (`f"...{expr}..."`) son el formato preferido en S02: legibles, con expresiones cortas y especificadores (`{monto:.2f}`, `{nombre!r}`). Prompts y mensajes de error del intake van en **español claro** (“Ingresa el contacto:”, “ERROR en \'edad\': …”).',
        'Patrón profesional: separa **captura** (valores str), **parse** (tipos) y **reporte** (f-strings). Así puedes unit-testear el parse sin depender de la consola. Un resumen de cliente con 4–5 campos es el puente natural al You Do.',
      ],
      code: {
        language: 'python',
        title: 'reporte_fstring.py',
        code: `# Simula input (testeable): no llames input() en demos de CI
nombres = "María José"
monto = 150.5
print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
print("campos", "a", "b", sep=" | ")`,
        output: `Cliente: María José | Monto: S/ 150.50
campos | a | b`,
      },
      callout: {
        type: 'tip',
        title: 'input → str siempre',
        content:
          'Si necesitas int/Decimal, convierte después de strip. Nunca asumas que “el usuario escribió un número” = tipo numérico en Python.',
      },
    },
    {
      heading: 'Parsing de intake y mensajes de error',
      subtopicId: 'S02-T4-B',
      paragraphs: [
        'Un **parser de intake** recibe un registro sintético, conserva **`*_raw`**, produce campos limpios (strip) y acumula **`errors: list[str]`** sin tragar excepciones. El raw **siempre** está, incluso si el clean es `None` o el campo está vacío.',
        'Casos mínimos del gate CP-N1-A: **vacío** (mensaje accionable + raw `""`), **Unicode** (García, Ñahui, María — round-trip sin errores ASCII), **número inválido** (`edad="abc"` → error con nombre de campo, raw intacto). Los tests son **asserts** o pytest: no “mirar la consola y ya”.',
        'Mensaje accionable = **qué campo**, **qué valor se recibió** (`!r` / repr), **qué se esperaba**. Evita `except: pass`. No afirmes parentesco real por dos apellidos: son **campos de texto** del schema.',
      ],
      code: {
        language: 'python',
        title: 'parse_minimo.py',
        code: `def safe_int(campo: str, valor: str):
    try:
        return True, int(valor.strip()), None
    except ValueError:
        msg = f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"
        return False, None, msg

ok, n, err = safe_int("edad", "abc")
print(ok, n, err)
raw = "  Ñahui  "
print("raw", repr(raw), "clean", repr(raw.strip()))`,
        output: `False None ERROR en 'edad': no se pudo convertir 'abc' a int
raw '  Ñahui  ' clean 'Ñahui'`,
      },
      callout: {
        type: 'success',
        title: 'Contrato del parser S02',
        content:
          'raw siempre presente · errors es lista · Unicode round-trip · número inválido no revienta el proceso · datos sintéticos únicamente.',
      },
    },
  ],
  iDo: {
    intro:
      'Te demuestro en Python puro (browser-pyodide o local) el camino del registro de cliente: literales (T1-A), conversión (T1-B), nombres (T2-A), raw/alias (T2-B), operadores (T3-A), Decimal (T3-B), f-strings (T4-A) y parser con errores (T4-B). Copia cada demo, ejecútala y compara la salida. Datos 100% sintéticos.',
    steps: [
      {
        demoId: 'S02-T1-A-DEMO',
        subtopicId: 'S02-T1-A',
        environment: 'browser-pyodide',
        description: 'Literales de un registro de cliente y type() de cada campo',
        code: {
          language: 'python',
          title: 'S02-T1-A-DEMO — literales_cliente',
          code: `# Cliente sintético (no es persona real)
nombres = "María José"
apellido_paterno = "Quispe"
edad = 34
monto_soles = 150.5
activo = True
referencia = None

campos = [
    ("nombres", nombres),
    ("apellido_paterno", apellido_paterno),
    ("edad", edad),
    ("monto_soles", monto_soles),
    ("activo", activo),
    ("referencia", referencia),
]
for label, valor in campos:
    print(f"{label}: valor={valor!r} type={type(valor).__name__}")

print("type(42)=", type(42).__name__)
print("type('42')=", type("42").__name__)
print("42 == '42' →", 42 == "42")`,
          output: `nombres: valor='María José' type=str
apellido_paterno: valor='Quispe' type=str
edad: valor=34 type=int
monto_soles: valor=150.5 type=float
activo: valor=True type=bool
referencia: valor=None type=NoneType
type(42)= int
type('42')= str
42 == '42' → False`,
        },
        why: 'Antes de parsear, el analista debe “ver” el tipo de cada literal. Si el teléfono o un código viaja como int, o si comparas 42 con "42", el pipeline de calidad miente. Esta demo fija int/float/str/bool/NoneType y la distinción literal vs texto numérico.',
      },
      {
        demoId: 'S02-T1-B-DEMO',
        subtopicId: 'S02-T1-B',
        environment: 'browser-pyodide',
        description: 'Convertir campos de texto a número con mensaje de error por campo',
        code: {
          language: 'python',
          title: 'S02-T1-B-DEMO — convertir_con_error',
          code: `def convertir_edad(campo: str, valor: str):
    try:
        n = int(valor.strip())
        print(f"OK {campo}={n}")
        return n
    except ValueError:
        print(f"ERROR en '{campo}': no se pudo convertir {valor!r} a int")
        return None

convertir_edad("edad", " 19 ")
convertir_edad("edad", "abc")
print("isinstance(19, int) →", isinstance(19, int))
print("isinstance('19', int) →", isinstance("19", int))`,
          output: `OK edad=19
ERROR en 'edad': no se pudo convertir 'abc' a int
isinstance(19, int) → True
isinstance('19', int) → False`,
        },
        why: 'strip + int cubre el caso feliz con espacios. El caso "abc" no debe tumbar el notebook sin contexto: el mensaje nombra el campo y muestra el valor recibido. isinstance separa “ya es int” de “sigue siendo texto”.',
      },
      {
        demoId: 'S02-T2-A-DEMO',
        subtopicId: 'S02-T2-A',
        environment: 'browser-pyodide',
        description: 'Renombrar a snake_case y usar == en comparaciones',
        code: {
          language: 'python',
          title: 'S02-T2-A-DEMO — nombres_y_comparacion',
          code: `# Mal estilo (comentado a propósito):
# NombreCliente = "Ana"; AP = "García"; l = 1

nombres_cliente = "Ana"
apellido_paterno = "García"
EDAD_MINIMA = 18
edad = 25

if edad == EDAD_MINIMA:
    print("edad mínima exacta")
else:
    print(f"edad={edad}, mínima={EDAD_MINIMA}")

print("nombres_cliente=", nombres_cliente)
print("apellido_paterno=", apellido_paterno)`,
          output: `edad=25, mínima=18
nombres_cliente= Ana
apellido_paterno= García`,
        },
        why: 'Code review junior en Perú mira nombres y = vs == antes que algoritmos. snake_case + constantes UPPER_CASE + == en el if es el contrato mínimo de legibilidad para el schema de intake.',
      },
      {
        demoId: 'S02-T2-B-DEMO',
        subtopicId: 'S02-T2-B',
        environment: 'browser-pyodide',
        description: 'Alias vs copia y preservar raw tras normalizar',
        code: {
          language: 'python',
          title: 'S02-T2-B-DEMO — raw_y_alias',
          code: `raw_nombre = "  José Ñahui  "
clean_nombre = raw_nombre.strip()
print("raw=", repr(raw_nombre))
print("clean=", repr(clean_nombre))
print("raw is clean?", raw_nombre is clean_nombre)

a = [1, 2, 3]
b = a
c = a.copy()
b.append(4)
print("a after alias mutate:", a)
print("c unchanged:", c)
print("a is b?", a is b)
print("a is c?", a is c)

x = None
print("x is None →", x is None)`,
          output: `raw= '  José Ñahui  '
clean= 'José Ñahui'
raw is clean? False
a after alias mutate: [1, 2, 3, 4]
c unchanged: [1, 2, 3]
a is b? True
a is c? False
x is None → True`,
        },
        why: 'El raw debe sobrevivir al strip. En estructuras mutables, el alias es la forma #1 de corromper el original “sin tocar raw”. copy()/slice y claves *_raw son el hábito que el parser de intake exige.',
      },
      {
        demoId: 'S02-T3-A-DEMO',
        subtopicId: 'S02-T3-A',
        environment: 'browser-pyodide',
        description: 'Evaluar // % ** y corregir expresión con precedencia',
        code: {
          language: 'python',
          title: 'S02-T3-A-DEMO — operadores_precedencia',
          code: `a, b, c = 10, 3, 2
print("10 // 3 =", a // b)
print("10 % 3  =", a % b)
print("3 ** 2  =", b ** c)
print("a + b * c =", a + b * c)
print("(a + b) * c =", (a + b) * c)
print("-3**2 =", -3**2)
print("(-3)**2 =", (-3)**2)
# Precio con IGV 18% (expresión; dinero exacto → Decimal en T3-B)
base = 100
total = base * (1 + 0.18)
print("total con IGV (float demo) =", total)`,
          output: `10 // 3 = 3
10 % 3  = 1
3 ** 2  = 9
a + b * c = 16
(a + b) * c = 26
-3**2 = -9
(-3)**2 = 9
total con IGV (float demo) = 118.0`,
        },
        why: 'Antes de confiar en un cálculo de ticket, verificas // % ** y paréntesis. -3**2 es la trampa de precedencia más citada; (a+b)*c vs a+b*c es el bug de descuento/IGV en una línea.',
      },
      {
        demoId: 'S02-T3-B-DEMO',
        subtopicId: 'S02-T3-B',
        environment: 'browser-pyodide',
        description: 'Subtotal + IGV 18% con Decimal y quantize a 2 decimales',
        code: {
          language: 'python',
          title: 'S02-T3-B-DEMO — decimal_igv',
          code: `from decimal import Decimal, ROUND_HALF_EVEN

print("float 0.1+0.2 =", 0.1 + 0.2)
print("Decimal =", Decimal("0.1") + Decimal("0.2"))

subtotal = Decimal("100.00")
igv = (subtotal * Decimal("0.18")).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
total = (subtotal + igv).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
print(f"subtotal={subtotal} IGV={igv} total={total}")`,
          output: `float 0.1+0.2 = 0.30000000000000004
Decimal = 0.3
subtotal=100.00 IGV=18.00 total=118.00`,
        },
        why: 'En soles, float miente. Decimal desde str + quantize(0.01) es el contrato mínimo de montos en onboarding de data financiera en Perú.',
      },
      {
        demoId: 'S02-T4-A-DEMO',
        subtopicId: 'S02-T4-A',
        environment: 'browser-pyodide',
        description: 'Capturar (simulado) y reportar nombre + monto con f-string',
        code: {
          language: 'python',
          title: 'S02-T4-A-DEMO — reporte_fstring',
          code: `# Simula input() con variables (testeable en Pyodide/CI)
nombres = "María José"
monto = 150.5
print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
print("OK", "intake", sep=" · ")`,
          output: `Cliente: María José | Monto: S/ 150.50
OK · intake`,
        },
        why: 'input devuelve str; el reporte usa f-strings y :.2f. Separar captura de formato permite testear el parser sin consola interactiva.',
      },
      {
        demoId: 'S02-T4-B-DEMO',
        subtopicId: 'S02-T4-B',
        environment: 'browser-pyodide',
        description: 'Parser mínimo: raw, clean, errors; 3 casos de prueba',
        code: {
          language: 'python',
          title: 'S02-T4-B-DEMO — parse_cliente_min',
          code: `def safe_int(campo: str, valor: str):
    try:
        return True, int(valor.strip()), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

def parse_client(nombres: str, apellido_materno: str, edad=None) -> dict:
    errors: list[str] = []
    rec = {
        "nombres_raw": nombres,
        "apellido_materno_raw": apellido_materno,
        "edad_raw": edad,
        "nombres": nombres.strip() if nombres and nombres.strip() else None,
        "apellido_materno": apellido_materno.strip() if apellido_materno and apellido_materno.strip() else None,
        "edad": None,
        "errors": errors,
    }
    if not nombres or not nombres.strip():
        errors.append(f"ERROR en 'nombres': vacío (raw={nombres!r})")
    if edad is not None:
        ok, n, err = safe_int("edad", edad)
        if ok:
            rec["edad"] = n
        else:
            errors.append(err)
    return rec

# 1) Unicode feliz
r1 = parse_client("María", "Ñahui", "34")
assert r1["apellido_materno_raw"] == "Ñahui" and r1["errors"] == []
# 2) Vacío
r2 = parse_client("", "Ñahui")
assert r2["nombres_raw"] == "" and any("nombres" in e for e in r2["errors"])
# 3) Número inválido
r3 = parse_client("Ana", "Díaz", "abc")
assert r3["edad_raw"] == "abc" and any("edad" in e for e in r3["errors"])
print("3 tests OK")
print(r1)
print(r2["errors"])
print(r3["errors"])`,
          output: `3 tests OK
{'nombres_raw': 'María', 'apellido_materno_raw': 'Ñahui', 'edad_raw': '34', 'nombres': 'María', 'apellido_materno': 'Ñahui', 'edad': 34, 'errors': []}
["ERROR en 'nombres': vacío (raw='')"]
["ERROR en 'edad': no se pudo convertir 'abc' a int"]`,
        },
        why: 'El gate no es “imprimió algo”: son asserts sobre raw, Unicode y errores accionables. Esta demo es el núcleo del You Do CP-N1-A.',
      },
    ],
  },
  weDo: {
    intro:
      'Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas (24 ejercicios)**. Cada uno trae **2 hints** (`hints[]` + `hint` primario). Ejecuta y compara; no inventes salidas. Datos sintéticos únicamente. Dinero siempre con `Decimal` en T3-B.',
    steps: [
      // ——— S02-T1-A ———
      {
        id: 'S02-T1-A-E1',
        subtopicId: 'S02-T1-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Clasifica estos literales imprimiendo `repr(valor)` y `type(valor).__name__` para cada uno: `0`, `3.14`, `"Lima"`, `False`, `None`.',
        hint: 'Recorre una lista de literales con un for. Usa type(x).__name__ para un nombre legible (int, float, str, bool, NoneType).',
        hints: [
          'Recorre una lista de literales con un for. Usa type(x).__name__ para un nombre legible (int, float, str, bool, NoneType).',
          'None imprime type NoneType, no "None". False es bool, no str. 0 es int, no bool.',
        ],
        edgeCases: [
          'None es tipo NoneType',
          'False es bool (no confundir con 0 en el reporte de type.__name__)',
        ],
        tests: 'Checklist: 5 líneas; tipos en orden int, float, str, bool, NoneType.',
        feedback:
          'Si acertaste NoneType y bool, ya evitas el error de “todo es texto o todo es número”. Siguiente: 42 vs "42".',
        starterCode: {
          language: 'python',
          title: 'clasificar_literales.py',
          code: `literales = [0, 3.14, "Lima", False, None]

for lit in literales:
    # TODO: imprime repr y nombre del tipo
    print(____, "→", ____)`,
        },
        solutionCode: {
          language: 'python',
          title: 'clasificar_literales.py',
          code: `literales = [0, 3.14, "Lima", False, None]

for lit in literales:
    print(repr(lit), "→", type(lit).__name__)`,
          output: `0 → int
3.14 → float
'Lima' → str
False → bool
None → NoneType`,
        },
      },
      {
        id: 'S02-T1-A-E2',
        subtopicId: 'S02-T1-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Demuestra que `42` y `"42"` son tipos distintos: imprime ambos `type(...).__name__`, el resultado de `42 == "42"`, y el de `str(42) == "42"`. Comenta en un print por qué `isinstance(True, int)` es True (subtipo) y por qué no debes abusar de eso en intake.',
        hint: 'No conviertas antes de la primera comparación. str(42) produce el texto "42".',
        hints: [
          'No conviertas antes de la primera comparación. str(42) produce el texto "42".',
          'bool es subclase de int en Python: isinstance(True, int) → True. En negocio, modela banderas como bool explícito, no como 1/0 accidental.',
        ],
        edgeCases: [
          'bool es subtipo de int — no abusar',
          '42 == "42" es False aunque “se vean” iguales',
        ],
        tests: 'assert types int/str; assert 42 != "42"; assert str(42) == "42"; mención de isinstance(True, int).',
        feedback:
          'Separar literal numérico de texto numérico es el 50% de los bugs de parse en juniors. Bien.',
        starterCode: {
          language: 'python',
          title: 'literal_vs_texto.py',
          code: `codigo_int = 42
codigo_str = "42"

print("tipos:", ____, ____)
print("igualdad cruda:", ____)
print("igualdad tras str():", ____)
print("isinstance(True, int) →", ____)
print("Nota: ____")  # una frase sobre no abusar`,
        },
        solutionCode: {
          language: 'python',
          title: 'literal_vs_texto.py',
          code: `codigo_int = 42
codigo_str = "42"

print("tipos:", type(codigo_int).__name__, type(codigo_str).__name__)
print("igualdad cruda:", codigo_int == codigo_str)
print("igualdad tras str():", str(codigo_int) == codigo_str)
print("isinstance(True, int) →", isinstance(True, int))
print("Nota: bool es subtipo de int; en intake no trates True/False como montos.")`,
          output: `tipos: int str
igualdad cruda: False
igualdad tras str(): True
isinstance(True, int) → True
Nota: bool es subtipo de int; en intake no trates True/False como montos.`,
        },
      },
      {
        id: 'S02-T1-A-E3',
        subtopicId: 'S02-T1-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Para el cliente sintético de intake, elige el tipo Python correcto de cada campo y crea literales de ejemplo. Campos: nombres, apellido_paterno, apellido_materno, contacto (teléfono), edad, activo. El teléfono **debe ser str**. Imprime un reporte campo → valor → tipo y verifica con `type(v) is t_esperado`.',
        hint: 'contacto = "999000111" (str), no 999000111 (int). Apellidos con ñ/tildes son str Unicode.',
        hints: [
          'contacto = "999000111" (str), no 999000111 (int). Apellidos con ñ/tildes son str Unicode.',
          'Puedes guardar tuplas (valor, tipo_esperado) en un dict y validar type(v) is t en un for.',
        ],
        edgeCases: [
          'teléfono como str no int',
          'Unicode en nombres/apellidos (Ñahui)',
        ],
        tests: 'Rúbrica: 6 campos; contacto str; edad int; activo bool; todos type checks True.',
        feedback:
          'Elegir tipo por semántica del campo es diseño de schema, no “lo que Python infiera del Excel”.',
        starterCode: {
          language: 'python',
          title: 'campos_intake_tipados.py',
          code: `# Completa valor y tipo esperado (int, float, str, bool, type(None) no hace falta aquí)
campos = {
    "nombres": ("____", str),
    "apellido_paterno": ("____", str),
    "apellido_materno": ("____", str),
    "contacto": ("____", str),  # teléfono
    "edad": (____, int),
    "activo": (____, bool),
}

for k, (v, t) in campos.items():
    ok = type(v) is t
    print(f"{k}: {v!r} esperado={t.__name__} ok={ok}")`,
        },
        solutionCode: {
          language: 'python',
          title: 'campos_intake_tipados.py',
          code: `campos = {
    "nombres": ("María José", str),
    "apellido_paterno": ("Quispe", str),
    "apellido_materno": ("Ñahui", str),
    "contacto": ("999000111", str),
    "edad": (28, int),
    "activo": (True, bool),
}

for k, (v, t) in campos.items():
    ok = type(v) is t
    print(f"{k}: {v!r} esperado={t.__name__} ok={ok}")`,
          output: `nombres: 'María José' esperado=str ok=True
apellido_paterno: 'Quispe' esperado=str ok=True
apellido_materno: 'Ñahui' esperado=str ok=True
contacto: '999000111' esperado=str ok=True
edad: 28 esperado=int ok=True
activo: True esperado=bool ok=True`,
        },
      },
      // ——— S02-T1-B ———
      {
        id: 'S02-T1-B-E1',
        subtopicId: 'S02-T1-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Dado `raw = " 21 "`, conviértelo a `int` usando `strip` y muestra el valor y su tipo. Debe quedar `21` de tipo int.',
        hint: 'int(raw.strip()) — strip primero, constructor después.',
        hints: [
          'int(raw.strip()) — strip primero, constructor después.',
          'Si haces int(raw) sin strip, en " 21 " también funciona en Python 3, pero el hábito strip es obligatorio para vacíos y mensajes; úsalo siempre en parsers.',
        ],
        edgeCases: ['espacios alrededor del número'],
        tests: 'assert edad == 21 and type(edad) is int',
        feedback: 'strip + int es el mínimo viable de un campo numérico en CSV/formulario.',
        starterCode: {
          language: 'python',
          title: 'int_con_strip.py',
          code: `raw = " 21 "
edad = ____(raw.____())
print(edad, type(edad).__name__)`,
        },
        solutionCode: {
          language: 'python',
          title: 'int_con_strip.py',
          code: `raw = " 21 "
edad = int(raw.strip())
print(edad, type(edad).__name__)`,
          output: `21 int`,
        },
      },
      {
        id: 'S02-T1-B-E2',
        subtopicId: 'S02-T1-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Implementa `safe_int(campo, valor) -> tuple` que devuelva `(True, int, None)` si convierte, o `(False, None, mensaje)` si está vacío (tras strip) o no es entero. Prueba con `" 21 "`, `""`, `"abc"` y `"  "`.',
        hint: 'Tras strip, si texto == "", error de vacío. try/except ValueError para letras.',
        hints: [
          'Tras strip, si texto == "", error de vacío. try/except ValueError para letras.',
          'Mensaje accionable: incluye el nombre del campo y el valor recibido con !r (repr).',
        ],
        edgeCases: ['vacío', 'solo espacios', 'letras'],
        tests: 'returns (ok, value|None, msg); 4 casos como en la demo de solución.',
        feedback:
          'Una función safe_* reutilizable es el núcleo del parse gate. No uses eval.',
        starterCode: {
          language: 'python',
          title: 'safe_int.py',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    # TODO: vacío → (False, None, msg)
    # TODO: int(texto) → (True, n, None)
    # TODO: ValueError → (False, None, msg)
    pass

for v in [" 21 ", "", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))`,
        },
        solutionCode: {
          language: 'python',
          title: 'safe_int.py',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return (False, None, f"ERROR en '{campo}': valor vacío")
    try:
        return (True, int(texto), None)
    except ValueError:
        return (False, None, f"ERROR en '{campo}': {valor!r} no es un entero válido")

for v in [" 21 ", "", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))`,
          output: `' 21 ' → (True, 21, None)
'' → (False, None, "ERROR en 'edad': valor vacío")
'abc' → (False, None, "ERROR en 'edad': 'abc' no es un entero válido")
'  ' → (False, None, "ERROR en 'edad': valor vacío")`,
        },
      },
      {
        id: 'S02-T1-B-E3',
        subtopicId: 'S02-T1-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Pipeline de 2 campos: `edad` (int) y `monto` (float) desde texto. Devuelve un dict con `raw`, `clean` y `errors`. Si un campo falla, el otro puede seguir OK; raw siempre conserva los strings originales. Prueba: ambos OK; edad inválida; monto inválido.',
        hint: 'Reutiliza safe_int y escribe safe_float análogo. Acumula mensajes en errors[].',
        hints: [
          'Reutiliza safe_int y escribe safe_float análogo. Acumula mensajes en errors[].',
          'clean["edad"] = None si falla, pero raw["edad"] sigue siendo el string de entrada.',
        ],
        edgeCases: ['un campo falla otro ok', 'raw siempre presente'],
        tests: 'structured errors; 3 escenarios; raw keys intactas.',
        feedback:
          'Este es el embrión del parse_client del You Do: multi-campo, errores parciales, raw intacto.',
        starterCode: {
          language: 'python',
          title: 'pipeline_dos_campos.py',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return (False, None, f"ERROR en '{campo}': valor vacío")
    try:
        return (True, int(texto), None)
    except ValueError:
        return (False, None, f"ERROR en '{campo}': {valor!r} no es un entero válido")

def safe_float(campo: str, valor: str):
    # TODO: análogo con float()
    pass

def pipeline(edad_txt: str, monto_txt: str) -> dict:
    # TODO: raw, clean, errors
    pass

print(pipeline(" 28 ", "150.50"))
print(pipeline("xx", "99.0"))
print(pipeline("30", "nope"))`,
        },
        solutionCode: {
          language: 'python',
          title: 'pipeline_dos_campos.py',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return (False, None, f"ERROR en '{campo}': valor vacío")
    try:
        return (True, int(texto), None)
    except ValueError:
        return (False, None, f"ERROR en '{campo}': {valor!r} no es un entero válido")

def safe_float(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return (False, None, f"ERROR en '{campo}': valor vacío")
    try:
        return (True, float(texto), None)
    except ValueError:
        return (False, None, f"ERROR en '{campo}': {valor!r} no es un número válido")

def pipeline(edad_txt: str, monto_txt: str) -> dict:
    errors: list[str] = []
    clean: dict = {}
    ok, val, msg = safe_int("edad", edad_txt)
    clean["edad"] = val if ok else None
    if not ok:
        errors.append(msg)
    ok, val, msg = safe_float("monto", monto_txt)
    clean["monto"] = val if ok else None
    if not ok:
        errors.append(msg)
    return {
        "raw": {"edad": edad_txt, "monto": monto_txt},
        "clean": clean,
        "errors": errors,
    }

print(pipeline(" 28 ", "150.50"))
print(pipeline("xx", "99.0"))
print(pipeline("30", "nope"))`,
          output: `{'raw': {'edad': ' 28 ', 'monto': '150.50'}, 'clean': {'edad': 28, 'monto': 150.5}, 'errors': []}
{'raw': {'edad': 'xx', 'monto': '99.0'}, 'clean': {'edad': None, 'monto': 99.0}, 'errors': ["ERROR en 'edad': 'xx' no es un entero válido"]}
{'raw': {'edad': '30', 'monto': 'nope'}, 'clean': {'edad': 30, 'monto': None}, 'errors': ["ERROR en 'monto': 'nope' no es un número válido"]}`,
        },
      },
      // ——— S02-T2-A ———
      {
        id: 'S02-T2-A-E1',
        subtopicId: 'S02-T2-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Renombra estas 5 variables a PEP 8: `NombreCliente`, `AP`, `x` (índice), `l` (longitud), `EdadMaxima` (constante de negocio). Imprime los cinco nombres buenos con valores sintéticos.',
        hint: 'snake_case para vars; UPPER_CASE para la constante de tope de edad.',
        hints: [
          'snake_case para vars; UPPER_CASE para la constante de tope de edad.',
          'Evita l/O/I: usa longitud, indice. apellido_paterno en lugar de AP.',
        ],
        edgeCases: ['evitar l/O/I', 'constantes en UPPER_CASE'],
        tests: 'style pass: 5 nombres PEP8; sin l/O/I sueltos.',
        feedback: 'Nombres legibles reducen NameError y aceleran review.',
        starterCode: {
          language: 'python',
          title: 'snake_case_checklist.py',
          code: `# Antes (malo):
# NombreCliente = "Luis"
# AP = "Ramos"
# x = 0
# l = 5
# EdadMaxima = 120

# Después (bueno):
____ = "Luis"
____ = "Ramos"
____ = 0
____ = 5
____ = 120

print(nombre_cliente, apellido_paterno, indice, longitud, EDAD_MAXIMA)`,
        },
        solutionCode: {
          language: 'python',
          title: 'snake_case_checklist.py',
          code: `nombre_cliente = "Luis"
apellido_paterno = "Ramos"
indice = 0
longitud = 5
EDAD_MAXIMA = 120

print(nombre_cliente, apellido_paterno, indice, longitud, EDAD_MAXIMA)`,
          output: `Luis Ramos 0 5 120`,
        },
      },
      {
        id: 'S02-T2-A-E2',
        subtopicId: 'S02-T2-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Bug hunt: el siguiente código tiene tres comparaciones rotas con `=` en lugar de `==`. Corrígelas para que imprima tres líneas `ok ...` sin SyntaxError.',
        hint: 'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
        hints: [
          'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
          'if flag == True funciona; también puedes escribir if flag: — ambas aceptables aquí si el archivo corre.',
        ],
        edgeCases: ['SyntaxError con if x = 1', 'confundir asignación con comparación'],
        tests: 'runs without SyntaxError; tres prints ok.',
        feedback: 'Detectar = vs == en review es habilidad de producción, no de examen de memoria.',
        starterCode: {
          language: 'python',
          title: 'eq_vs_assign.py',
          code: `estado = "activo"
codigo = 10
flag = True

# Corrige las tres líneas (hoy están mal a propósito):
if estado = "activo":
    print("ok estado")
if codigo = 10:
    print("ok codigo")
if flag = True:
    print("ok flag")`,
        },
        solutionCode: {
          language: 'python',
          title: 'eq_vs_assign.py',
          code: `estado = "activo"
codigo = 10
flag = True

if estado == "activo":
    print("ok estado")
if codigo == 10:
    print("ok codigo")
if flag == True:
    print("ok flag")`,
          output: `ok estado
ok codigo
ok flag`,
        },
      },
      {
        id: 'S02-T2-A-E3',
        subtopicId: 'S02-T2-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Un CSV de intake llega con encabezados feos. Propón nombres PEP 8 (snake_case) para: `Nombres`, `Apellido Paterno`, `Apellido Materno`, `Teléfono / Cel`, `Dirección`, `Edad (años)`. Devuelve un dict `original → snake_case` e imprime el mapeo. Incluye `apellido_paterno` y `apellido_materno`.',
        hint: 'Minúsculas, guiones bajos, sin espacios ni tildes en el identificador Python.',
        hints: [
          'Minúsculas, guiones bajos, sin espacios ni tildes en el identificador Python.',
          'Ejemplos: "Apellido Paterno" → apellido_paterno; "Teléfono / Cel" → telefono o contacto (elige uno y sé consistente).',
        ],
        edgeCases: ['apellido_paterno', 'sin espacios en identificadores'],
        tests: 'rubric naming: 6 claves; snake_case; incluye apellido_paterno y apellido_materno.',
        feedback:
          'El rename de columnas es el primer commit de un pipeline real. Consistencia > creatividad.',
        starterCode: {
          language: 'python',
          title: 'schema_intake_nombres.py',
          code: `encabezados = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Teléfono / Cel",
    "Dirección",
    "Edad (años)",
]

# TODO: dict mapeo original -> snake_case
mapeo = {
    # "Nombres": "nombres",
}

for orig in encabezados:
    print(f"{orig!r} → {mapeo.get(orig, '???')}")`,
        },
        solutionCode: {
          language: 'python',
          title: 'schema_intake_nombres.py',
          code: `encabezados = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Teléfono / Cel",
    "Dirección",
    "Edad (años)",
]

mapeo = {
    "Nombres": "nombres",
    "Apellido Paterno": "apellido_paterno",
    "Apellido Materno": "apellido_materno",
    "Teléfono / Cel": "contacto",
    "Dirección": "direccion",
    "Edad (años)": "edad",
}

for orig in encabezados:
    print(f"{orig!r} → {mapeo[orig]}")`,
          output: `'Nombres' → nombres
'Apellido Paterno' → apellido_paterno
'Apellido Materno' → apellido_materno
'Teléfono / Cel' → contacto
'Dirección' → direccion
'Edad (años)' → edad`,
        },
      },
      // ——— S02-T2-B ———
      {
        id: 'S02-T2-B-E1',
        subtopicId: 'S02-T2-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa la tabla de predicciones imprimiendo el bool real de: `None is None`, `[] == []`, `[] is []`, `1 == True`, `1 is True`. Luego escribe una línea de comentario: cuándo usar `is` vs `==`.',
        hint: 'Listas nuevas no son el mismo objeto: [] is [] es False. Usa is para None.',
        hints: [
          'Listas nuevas no son el mismo objeto: [] is [] es False. Usa is para None.',
          '1 == True es True (bool subtipo int), pero 1 is True es False: no uses is para igualdad numérica.',
        ],
        edgeCases: ['is None idiom', '[] is [] es False'],
        tests: 'prediction table: True, True, False, True, False.',
        feedback:
          'Si internalizaste is None y no usar is para valores, evitaste una clase entera de bugs sutiles.',
        starterCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `print("None is None →", ____)
print("[] == [] →", ____)
print("[] is [] →", ____)
print("1 == True →", ____)
print("1 is True →", ____)
# Comentario: ____`,
        },
        solutionCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `print("None is None →", None is None)
print("[] == [] →", [] == [])
print("[] is [] →", [] is [])
print("1 == True →", 1 == True)
print("1 is True →", 1 is True)
# is → identidad (None, singletons); == → igualdad de valor`,
          output: `None is None → True
[] == [] → True
[] is [] → False
1 == True → True
1 is True → False`,
        },
      },
      {
        id: 'S02-T2-B-E2',
        subtopicId: 'S02-T2-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — `original = ["a", "b"]`. Crea `trabajo` como **copia** (no alias), haz `trabajo.append("c")` y demuestra que `original` sigue siendo `["a", "b"]`.',
        hint: 'trabajo = original.copy()  o  trabajo = original[:]',
        hints: [
          'trabajo = original.copy()  o  trabajo = original[:]',
          'Si haces trabajo = original, append mutará ambos. Verifica con print y con `original is trabajo` → False.',
        ],
        edgeCases: ['slice vs assign', 'alias accidental'],
        tests: 'assert original == ["a", "b"] and trabajo == ["a", "b", "c"]',
        feedback: 'Romper el alias antes de mutar es el hábito de “no pisar la fuente”.',
        starterCode: {
          language: 'python',
          title: 'romper_alias.py',
          code: `original = ["a", "b"]
trabajo = ____  # debe ser copia, no alias
trabajo.append("c")
print("original:", original)
print("trabajo:", trabajo)
print("mismo objeto?", original is trabajo)`,
        },
        solutionCode: {
          language: 'python',
          title: 'romper_alias.py',
          code: `original = ["a", "b"]
trabajo = original.copy()
trabajo.append("c")
print("original:", original)
print("trabajo:", trabajo)
print("mismo objeto?", original is trabajo)`,
          output: `original: ['a', 'b']
trabajo: ['a', 'b', 'c']
mismo objeto? False`,
        },
      },
      {
        id: 'S02-T2-B-E3',
        subtopicId: 'S02-T2-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Diseña `make_record(nombres, contacto)` que devuelva un dict con `nombres_raw`, `contacto_raw`, `nombres` y `contacto` (strip). Luego muta solo el campo limpio a `.upper()` y **assert** que los `*_raw` no cambiaron.',
        hint: 'Guarda el string original en *_raw antes de strip. No reutilices el mismo nombre para ambos.',
        hints: [
          'Guarda el string original en *_raw antes de strip. No reutilices el mismo nombre para ambos.',
          'Tras upper() en clean, assert rec["nombres_raw"] == entrada_original.',
        ],
        edgeCases: ['no perder raw en fail', 'Unicode en raw (María)'],
        tests: 'assert raw keys; clean puede cambiar; raw idéntico al input.',
        feedback:
          'raw + clean es el contrato del You Do y del gate CP-N1-A. Si el assert pasa, ya piensas en auditoría.',
        starterCode: {
          language: 'python',
          title: 'raw_clean_record.py',
          code: `def make_record(nombres: str, contacto: str) -> dict:
    # TODO: *_raw + strip en limpios
    pass

entrada_nombres = "  María  "
entrada_contacto = " 999 "
rec = make_record(entrada_nombres, entrada_contacto)
rec["nombres"] = rec["nombres"].upper()
print(rec)
assert rec["nombres_raw"] == entrada_nombres
assert rec["contacto_raw"] == entrada_contacto
print("raw preserved OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'raw_clean_record.py',
          code: `def make_record(nombres: str, contacto: str) -> dict:
    return {
        "nombres_raw": nombres,
        "contacto_raw": contacto,
        "nombres": nombres.strip() if nombres else None,
        "contacto": contacto.strip() if contacto else None,
    }

entrada_nombres = "  María  "
entrada_contacto = " 999 "
rec = make_record(entrada_nombres, entrada_contacto)
rec["nombres"] = rec["nombres"].upper()
print(rec)
assert rec["nombres_raw"] == entrada_nombres
assert rec["contacto_raw"] == entrada_contacto
print("raw preserved OK")`,
          output: `{'nombres_raw': '  María  ', 'contacto_raw': ' 999 ', 'nombres': 'MARÍA', 'contacto': '999'}
raw preserved OK`,
        },
      },
      // ——— S02-T3-A ———
      {
        id: 'S02-T3-A-E1',
        subtopicId: 'S02-T3-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Con `n = 17` y `d = 5`, imprime `n // d`, `n % d`, `2 ** 4` y `n / d`. Comenta en un print por qué `/` devuelve float.',
        hint: 'Usa los operadores // % ** / directamente. No hace falta import.',
        hints: [
          'Usa los operadores // % ** / directamente. No hace falta import.',
          '17//5 → 3, 17%5 → 2, 2**4 → 16, 17/5 → 3.4 (float).',
        ],
        edgeCases: [
          'división / siempre float en Python 3',
          '// trunca hacia −∞ (no “hacia cero” en negativos)',
        ],
        tests: 'assert 17//5==3; 17%5==2; 2**4==16; 17/5==3.4',
        feedback:
          'Si // y % te salieron, ya puedes descomponer cantidades (cajas, cuotas). Siguiente: la trampa -a**b.',
        starterCode: {
          language: 'python',
          title: 'tabla_operadores.py',
          code: `n = 17
d = 5
# TODO: imprime //, %, 2**4 y /
print("//", ____)
print("%", ____)
print("**", ____)
print("/", ____)`,
        },
        solutionCode: {
          language: 'python',
          title: 'tabla_operadores.py',
          code: `n = 17
d = 5
print("//", n // d)
print("%", n % d)
print("**", 2 ** 4)
print("/", n / d)
print("nota: / devuelve float en Python 3")`,
          output: `// 3
% 2
** 16
/ 3.4
nota: / devuelve float en Python 3`,
        },
      },
      {
        id: 'S02-T3-A-E2',
        subtopicId: 'S02-T3-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Demuestra que `-3**2` es `-9` y que `(-3)**2` es `9`. Asigna `cuadrado_neg = (-3)**2` y haz `assert cuadrado_neg == 9`.',
        hint: '** tiene mayor precedencia que el unario menos. Paréntesis cambian el orden.',
        hints: [
          '** tiene mayor precedencia que el unario menos. Paréntesis cambian el orden.',
          'print(-3**2) y print((-3)**2); el assert solo pasa con (-3)**2.',
        ],
        edgeCases: [
          'paréntesis obligatorios para (-3)**2',
          'no uses pow con float si buscas int exacto aquí',
        ],
        tests: 'assert -3**2 == -9; assert (-3)**2 == 9',
        feedback:
          'Esta es la pregunta de entrevista junior de precedencia. Si la internalizaste, evitas bugs en fórmulas de scoring.',
        starterCode: {
          language: 'python',
          title: 'precedencia_potencia.py',
          code: `print("sin paréntesis:", -3**2)
print("con paréntesis:", (-3)**2)
cuadrado_neg = ____  # debe ser 9
assert cuadrado_neg == 9
print("assert OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'precedencia_potencia.py',
          code: `print("sin paréntesis:", -3**2)
print("con paréntesis:", (-3)**2)
cuadrado_neg = (-3)**2
assert cuadrado_neg == 9
print("assert OK")`,
          output: `sin paréntesis: -9
con paréntesis: 9
assert OK`,
        },
      },
      {
        id: 'S02-T3-A-E3',
        subtopicId: 'S02-T3-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Un ticket sintético tiene líneas `50` y `30` (soles, solo para practicar ops). Calcula `subtotal = 50 + 30` y `total = subtotal * (1 + 0.18)` con **paréntesis explícitos** en la tasa IGV 18%. Imprime ambos. (En T3-B reemplazarás float por Decimal.)',
        hint: 'subtotal primero; luego multiplica por (1 + 0.18), no 1 + 0.18 * subtotal sin revisar.',
        hints: [
          'subtotal primero; luego multiplica por (1 + 0.18), no 1 + 0.18 * subtotal sin revisar.',
          'Con base 80, total float es 94.3999… — es la motivación de Decimal. Si usas base 100, total=118.0 limpio.',
        ],
        edgeCases: ['18% = 0.18', 'float puede mostrar basura; documentar y migrar a Decimal'],
        tests: 'subtotal==80; total == 80*(1+0.18); expresión usa paréntesis en (1+0.18)',
        feedback:
          'La expresión correcta es el 50% del trabajo; el otro 50% es no usar float en producción de montos (T3-B).',
        starterCode: {
          language: 'python',
          title: 'precio_igv_expr.py',
          code: `linea_a = 50
linea_b = 30
# TODO: subtotal y total con IGV 18% y paréntesis
subtotal = ____
total = ____
print("subtotal", subtotal)
print("total", total)`,
        },
        solutionCode: {
          language: 'python',
          title: 'precio_igv_expr.py',
          code: `linea_a = 50
linea_b = 30
subtotal = linea_a + linea_b
total = subtotal * (1 + 0.18)
print("subtotal", subtotal)
print("total", total)`,
          output: `subtotal 80
total 94.39999999999999`,
        },
      },
      // ——— S02-T3-B ———
      {
        id: 'S02-T3-B-E1',
        subtopicId: 'S02-T3-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Imprime `0.1 + 0.2` (float) y `Decimal("0.1") + Decimal("0.2")`. Importa desde `decimal`.',
        hint: 'from decimal import Decimal. Construye Decimal desde strings, no desde 0.1 float.',
        hints: [
          'from decimal import Decimal. Construye Decimal desde strings, no desde 0.1 float.',
          'float imprime 0.30000000000000004; Decimal imprime 0.3.',
        ],
        edgeCases: ['from decimal import Decimal', 'no uses Decimal(0.1)'],
        tests: 'assert Decimal("0.1")+Decimal("0.2") == Decimal("0.3")',
        feedback:
          'Si viste la basura del float, ya tienes el argumento de code review para exigir Decimal en soles.',
        starterCode: {
          language: 'python',
          title: 'float_vs_decimal.py',
          code: `from decimal import Decimal

print("float", 0.1 + 0.2)
print("Decimal", ____ + ____)`,
        },
        solutionCode: {
          language: 'python',
          title: 'float_vs_decimal.py',
          code: `from decimal import Decimal

print("float", 0.1 + 0.2)
print("Decimal", Decimal("0.1") + Decimal("0.2"))
assert Decimal("0.1") + Decimal("0.2") == Decimal("0.3")
print("assert OK")`,
          output: `float 0.30000000000000004
Decimal 0.3
assert OK`,
        },
      },
      {
        id: 'S02-T3-B-E2',
        subtopicId: 'S02-T3-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Cuenta de restaurante sintético `Decimal("85.50")`, propina 10%. Calcula propina y total con `quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)`. Sin float.',
        hint: 'from decimal import Decimal, ROUND_HALF_EVEN. Multiplica por Decimal("0.10").',
        hints: [
          'from decimal import Decimal, ROUND_HALF_EVEN. Multiplica por Decimal("0.10").',
          'propina = (cuenta * Decimal("0.10")).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN); total = (cuenta + propina).quantize(...).',
        ],
        edgeCases: ['no float', 'quantize a 2 decimales', 'ROUND_HALF_EVEN'],
        tests: 'propina==Decimal("8.55"); total==Decimal("94.05")',
        feedback:
          'Propina y total a 2 decimales sin basura: listo para tickets sintéticos de demos de data.',
        starterCode: {
          language: 'python',
          title: 'propina_soles.py',
          code: `from decimal import Decimal, ROUND_HALF_EVEN

cuenta = Decimal("85.50")
# TODO: propina 10% y total con quantize
propina = ____
total = ____
print(propina, total)
assert propina == Decimal("8.55")
assert total == Decimal("94.05")
print("OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'propina_soles.py',
          code: `from decimal import Decimal, ROUND_HALF_EVEN

cuenta = Decimal("85.50")
propina = (cuenta * Decimal("0.10")).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
total = (cuenta + propina).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
print(propina, total)
assert propina == Decimal("8.55")
assert total == Decimal("94.05")
print("OK")`,
          output: `8.55 94.05
OK`,
        },
      },
      {
        id: 'S02-T3-B-E3',
        subtopicId: 'S02-T3-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Implementa `parse_monto(texto: str)` que devuelva `(ok, Decimal|None, error|None)`: strip, rechace vacío, parsee con `Decimal`, quantize a `0.01`, error accionable si falla. Prueba `"150.50"`, `"  20.1 "`, `""`, `"abc"`. Convención: **punto** decimal.',
        hint: 'try/except InvalidOperation. raw en el mensaje con !r.',
        hints: [
          'try/except InvalidOperation. raw en el mensaje con !r.',
          'from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation. Si strip vacío → error antes de Decimal.',
        ],
        edgeCases: ['vacío', 'coma vs punto — documentar punto', 'quantize .01'],
        tests: 'OK 150.50; vacío y abc con error; sin float',
        feedback:
          'Este parse_monto se enchufa al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).',
        starterCode: {
          language: 'python',
          title: 'parse_monto.py',
          code: `from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation

def parse_monto(texto: str):
    # TODO: (ok, Decimal|None, error|None)
    pass

for s in ["150.50", "  20.1 ", "", "abc"]:
    print(repr(s), "→", parse_monto(s))`,
        },
        solutionCode: {
          language: 'python',
          title: 'parse_monto.py',
          code: `from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation

def parse_monto(texto: str):
    raw = texto
    t = texto.strip()
    if not t:
        return False, None, f"ERROR en 'monto': vacío (raw={raw!r})"
    try:
        d = Decimal(t).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
        return True, d, None
    except (InvalidOperation, ValueError):
        return False, None, f"ERROR en 'monto': no se pudo parsear {raw!r} a Decimal"

for s in ["150.50", "  20.1 ", "", "abc"]:
    print(repr(s), "→", parse_monto(s))`,
          output: `'150.50' → (True, Decimal('150.50'), None)
'  20.1 ' → (True, Decimal('20.10'), None)
'' → (False, None, "ERROR en 'monto': vacío (raw='')")
'abc' → (False, None, "ERROR en 'monto': no se pudo parsear 'abc' a Decimal")`,
        },
      },
      // ——— S02-T4-A ———
      {
        id: 'S02-T4-A-E1',
        subtopicId: 'S02-T4-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Con `nombre = "José"`, imprime un saludo con f-string: `Hola, José. Bienvenido al intake.` (acento incluido).',
        hint: 'f"Hola, {nombre}. Bienvenido al intake."',
        hints: [
          'f"Hola, {nombre}. Bienvenido al intake."',
          'No concatenes con + salvo que practiques; f-string es el estilo S02.',
        ],
        edgeCases: ['acentos en str Unicode', 'f-string con llaves'],
        tests: 'stdout contiene José y intake',
        feedback:
          'Unicode en f-strings “simplemente funciona” en Python 3 — úsalo en prompts reales.',
        starterCode: {
          language: 'python',
          title: 'saludo_fstring.py',
          code: `nombre = "José"
# TODO: f-string de saludo
print(____)`,
        },
        solutionCode: {
          language: 'python',
          title: 'saludo_fstring.py',
          code: `nombre = "José"
print(f"Hola, {nombre}. Bienvenido al intake.")`,
          output: `Hola, José. Bienvenido al intake.`,
        },
      },
      {
        id: 'S02-T4-A-E2',
        subtopicId: 'S02-T4-A',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Con nombres, apellido_paterno, contacto y monto `Decimal("99.5")`, imprime un reporte multi-línea con f-string incluyendo `S/ {monto:.2f}`.',
        hint: 'Usa varios print(f"...") o un solo f-string multi-línea. :.2f formatea dos decimales.',
        hints: [
          'Usa varios print(f"...") o un solo f-string multi-línea. :.2f formatea dos decimales.',
          'Incluye las 4 etiquetas: nombres, apellido_paterno, contacto, monto.',
        ],
        edgeCases: [':.2f si monto', 'Decimal acepta formato .2f en f-string'],
        tests: 'salida con 4 campos; monto con 2 decimales (99.50)',
        feedback:
          'El reporte legible es lo que el analista pega en el ticket. Formato consistente > creatividad.',
        starterCode: {
          language: 'python',
          title: 'reporte_cliente.py',
          code: `from decimal import Decimal

nombres = "Ana"
apellido_paterno = "Ramos"
contacto = "999000111"
monto = Decimal("99.5")
# TODO: reporte multi-línea con f-strings
print(f"nombres: {____}")
print(f"apellido_paterno: {____}")
print(f"contacto: {____}")
print(f"monto: S/ {____:.2f}")`,
        },
        solutionCode: {
          language: 'python',
          title: 'reporte_cliente.py',
          code: `from decimal import Decimal

nombres = "Ana"
apellido_paterno = "Ramos"
contacto = "999000111"
monto = Decimal("99.5")
print("Resumen cliente")
print(f"nombres: {nombres}")
print(f"apellido_paterno: {apellido_paterno}")
print(f"contacto: {contacto}")
print(f"monto: S/ {monto:.2f}")`,
          output: `Resumen cliente
nombres: Ana
apellido_paterno: Ramos
contacto: 999000111
monto: S/ 99.50`,
        },
      },
      {
        id: 'S02-T4-A-E3',
        subtopicId: 'S02-T4-A',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Escribe `simular_intake(nombres: str, contacto: str, edad: str) -> dict` que **no** llame a `input()` real: recibe los valores (como si vinieran de prompts), devuelve un dict con esos str y un subdict `types` con `type(...).__name__` de cada uno. Demuestra que todo sigue siendo str.',
        hint: 'No uses input(). Los parámetros ya simulan las respuestas del usuario.',
        hints: [
          'No uses input(). Los parámetros ya simulan las respuestas del usuario.',
          'types = {k: type(v).__name__ for k, v in datos.items()}',
        ],
        edgeCases: ['todo str', 'testeable sin consola interactiva'],
        tests: 'function takes values params; all types str',
        feedback:
          'Si el intake es una función pura de str→dict, los tests del parser (T4-B) son triviales de automatizar.',
        starterCode: {
          language: 'python',
          title: 'simular_intake.py',
          code: `def simular_intake(nombres: str, contacto: str, edad: str) -> dict:
    # TODO: devolver dict con campos + types
    pass

r = simular_intake("  Ana  ", "999", "34")
print(r)
assert r["types"]["edad"] == "str"
assert r["types"]["nombres"] == "str"
print("OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'simular_intake.py',
          code: `def simular_intake(nombres: str, contacto: str, edad: str) -> dict:
    datos = {"nombres": nombres, "contacto": contacto, "edad": edad}
    return {
        **datos,
        "types": {k: type(v).__name__ for k, v in datos.items()},
    }

r = simular_intake("  Ana  ", "999", "34")
print(r)
assert r["types"]["edad"] == "str"
assert r["types"]["nombres"] == "str"
print("OK")`,
          output: `{'nombres': '  Ana  ', 'contacto': '999', 'edad': '34', 'types': {'nombres': 'str', 'contacto': 'str', 'edad': 'str'}}
OK`,
        },
      },
      // ——— S02-T4-B ———
      {
        id: 'S02-T4-B-E1',
        subtopicId: 'S02-T4-B',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Completa `parse_nombres(valor: str) -> dict` con claves `nombres_raw`, `nombres` (strip o None si vacío) y `errors` (lista). Si vacío tras strip, agrega error accionable. Prueba con `""`.',
        hint: 'Siempre guarda raw = valor original antes de strip.',
        hints: [
          'Siempre guarda raw = valor original antes de strip.',
          "errors.append(f\"ERROR en 'nombres': vacío (raw={valor!r})\")",
        ],
        edgeCases: ['mensaje accionable', "raw '' se conserva"],
        tests: 'test empty: raw==""; errors no vacío; nombres is None',
        feedback:
          'El caso vacío es el primero que rompe demos “felices”. Si pasa el assert, el contrato raw/errors ya nació.',
        starterCode: {
          language: 'python',
          title: 'parse_vacio.py',
          code: `def parse_nombres(valor: str) -> dict:
    # TODO: raw + clean + errors
    pass

r = parse_nombres("")
print(r)
assert r["nombres_raw"] == ""
assert r["nombres"] is None
assert any("nombres" in e.lower() for e in r["errors"])
print("OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'parse_vacio.py',
          code: `def parse_nombres(valor: str) -> dict:
    errors: list[str] = []
    clean = valor.strip() if valor else ""
    if not clean:
        errors.append(f"ERROR en 'nombres': vacío (raw={valor!r})")
        clean_val = None
    else:
        clean_val = clean
    return {"nombres_raw": valor, "nombres": clean_val, "errors": errors}

r = parse_nombres("")
print(r)
assert r["nombres_raw"] == ""
assert r["nombres"] is None
assert any("nombres" in e.lower() for e in r["errors"])
print("OK")`,
          output: `{'nombres_raw': '', 'nombres': None, 'errors': ["ERROR en 'nombres': vacío (raw='')"]}
OK`,
        },
      },
      {
        id: 'S02-T4-B-E2',
        subtopicId: 'S02-T4-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Parsea `apellido_materno = "  Ñahui  "` conservando raw con espacios y clean strip. Assert de round-trip Unicode: clean == "Ñahui" y raw original intacto.',
        hint: 'No encodes a ascii. Python 3 str es Unicode.',
        hints: [
          'No encodes a ascii. Python 3 str es Unicode.',
          'raw = original; clean = original.strip(); assert raw == original.',
        ],
        edgeCases: ['no ascii errors', 'Ñ y acentos'],
        tests: 'test unicode: raw con espacios; clean == "Ñahui"',
        feedback:
          'Si Ñahui sobrevive, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos.',
        starterCode: {
          language: 'python',
          title: 'parse_unicode.py',
          code: `original = "  Ñahui  "
# TODO: raw y clean
raw = ____
clean = ____
print(repr(raw), "→", repr(clean))
assert raw == original
assert clean == "Ñahui"
print("Unicode OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'parse_unicode.py',
          code: `original = "  Ñahui  "
raw = original
clean = original.strip()
print(repr(raw), "→", repr(clean))
assert raw == original
assert clean == "Ñahui"
print("Unicode OK")`,
          output: `'  Ñahui  ' → 'Ñahui'
Unicode OK`,
        },
      },
      {
        id: 'S02-T4-B-E3',
        subtopicId: 'S02-T4-B',
        kind: 'transfer',
        instruction:
          'E3 (transferencia) — Implementa `parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None)` con `*_raw`, limpios, `errors`, y `safe_int` para edad. Suite de 3 tests: feliz+Unicode, vacío en nombres, edad `"abc"`. Todos deben pasar.',
        hint: 'Reutiliza el patrón del DEMO T4-B. No dejes que ValueError se escape.',
        hints: [
          'Reutiliza el patrón del DEMO T4-B. No dejes que ValueError se escape.',
          'assert r["edad_raw"]=="abc" y any("edad" in e.lower() for e in errors). raw siempre presente.',
        ],
        edgeCases: ['raw preserved', '3 tests pass', 'lista errors'],
        tests: '3 tests pass (unicode, empty, bad age)',
        feedback:
          'Esta suite es el corazón del You Do. Si pasa en local y en Pyodide, el incremento CP-N1-A de S02 está listo.',
        starterCode: {
          language: 'python',
          title: 'parse_client_suite.py',
          code: `def safe_int(campo: str, valor: str):
    # TODO
    pass

def parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None):
    # TODO: raw + clean + errors
    pass

# tests
r = parse_client("María José", "Quispe", "Ñahui", "999000111", "Lima", edad="34")
assert r["apellido_materno_raw"] == "Ñahui"
assert r["errors"] == []

r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
assert r2["nombres_raw"] == ""
assert any("nombres" in e.lower() for e in r2["errors"])

r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", edad="abc")
assert r3["edad_raw"] == "abc"
assert any("edad" in e.lower() for e in r3["errors"])
print("3 tests OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'parse_client_suite.py',
          code: `def safe_int(campo: str, valor: str):
    try:
        return True, int(valor.strip()), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

def parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None):
    errors: list[str] = []
    rec = {
        "nombres_raw": nombres,
        "apellido_paterno_raw": apellido_paterno,
        "apellido_materno_raw": apellido_materno,
        "contacto_raw": contacto,
        "direccion_raw": direccion,
        "edad_raw": edad,
        "nombres": None,
        "apellido_paterno": None,
        "apellido_materno": None,
        "contacto": None,
        "direccion": None,
        "edad": None,
        "errors": errors,
    }

    def clean_required(campo, valor):
        if valor is None or str(valor).strip() == "":
            errors.append(f"ERROR en '{campo}': vacío (raw={valor!r})")
            return None
        return str(valor).strip()

    rec["nombres"] = clean_required("nombres", nombres)
    rec["apellido_paterno"] = clean_required("apellido_paterno", apellido_paterno)
    rec["apellido_materno"] = clean_required("apellido_materno", apellido_materno)
    rec["contacto"] = clean_required("contacto", contacto)
    rec["direccion"] = clean_required("direccion", direccion)
    if edad is not None:
        ok, n, err = safe_int("edad", edad)
        if ok:
            rec["edad"] = n
        else:
            errors.append(err)
    return rec

r = parse_client("María José", "Quispe", "Ñahui", "999000111", "Lima", edad="34")
assert r["apellido_materno_raw"] == "Ñahui"
assert r["errors"] == []

r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
assert r2["nombres_raw"] == ""
assert any("nombres" in e.lower() for e in r2["errors"])

r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", edad="abc")
assert r3["edad_raw"] == "abc"
assert any("edad" in e.lower() for e in r3["errors"])
print("3 tests OK")`,
          output: `3 tests OK`,
        },
      },
    ],
  },
  youDo: {
    title: 'Parser de intake — registro sintético de cliente',
    context:
      'Incremento del capstone CP-N1-A: en lugar de una calculadora de presupuesto, construyes el **esqueleto de un parser de intake** para un cliente sintético (nombres, apellido paterno, apellido materno, contacto, dirección). Conservas valores originales, normalizas con strip, validas al menos un campo numérico opcional (edad) con mensaje claro, y reportas con f-strings. Solo datos ficticios — sin PII real.',
    objectives: [
      'Capturar o recibir nombres, apellido_paterno, apellido_materno, contacto y dirección',
      'Conservar el valor original (raw) de cada campo',
      'Normalizar de forma mínima (strip) sin perder raw',
      'Validar al menos un campo numérico opcional (edad) con mensaje accionable',
      'Cubrir casos: vacío, Unicode (p.ej. Ñahui), número inválido',
      'Imprimir resumen con f-strings',
    ],
    requirements: [
      'Función parse_client(...) devuelve estructura con *_raw y campos limpios o None',
      'Campo vacío → error accionable; no borrar raw',
      'Unicode (p.ej. José Ñahui) round-trip en raw y clean',
      'Número inválido no lanza traceback no capturado; error listado',
      'Suite de tests (pytest o asserts) documentada y reproducible',
      'Sin PII real; datos sintéticos (example.com si hay email)',
      'main() + if __name__ == "__main__"',
    ],
    starterCode: `"""parse_client_intake.py — incremento CP-N1-A (S02)
Datos sintéticos únicamente. No uses información real de clientes.
Referencia ejecutable del parser (raw/clean/errors + f-string resumen).
"""

from __future__ import annotations


def safe_int(campo: str, valor: str) -> tuple[bool, int | None, str | None]:
    """Convierte a int con strip. Devuelve (ok, valor|None, error|None)."""
    try:
        return True, int(valor.strip()), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"


def parse_client(
    nombres: str,
    apellido_paterno: str,
    apellido_materno: str,
    contacto: str,
    direccion: str,
    edad: str | None = None,
) -> dict:
    """Parsea un registro de intake: *_raw, limpios, errors."""
    errors: list[str] = []
    rec: dict = {
        "nombres_raw": nombres,
        "apellido_paterno_raw": apellido_paterno,
        "apellido_materno_raw": apellido_materno,
        "contacto_raw": contacto,
        "direccion_raw": direccion,
        "edad_raw": edad,
        "nombres": None,
        "apellido_paterno": None,
        "apellido_materno": None,
        "contacto": None,
        "direccion": None,
        "edad": None,
        "errors": errors,
    }

    def clean_required(campo: str, valor: str) -> str | None:
        if valor is None or str(valor).strip() == "":
            errors.append(f"ERROR en '{campo}': vacío (raw={valor!r})")
            return None
        return str(valor).strip()

    rec["nombres"] = clean_required("nombres", nombres)
    rec["apellido_paterno"] = clean_required("apellido_paterno", apellido_paterno)
    rec["apellido_materno"] = clean_required("apellido_materno", apellido_materno)
    rec["contacto"] = clean_required("contacto", contacto)
    rec["direccion"] = clean_required("direccion", direccion)

    if edad is not None:
        ok, n, err = safe_int("edad", edad)
        if ok:
            rec["edad"] = n
        else:
            errors.append(err)  # type: ignore[arg-type]
    return rec


def mostrar_resumen(resultado: dict) -> None:
    """Imprime un resumen legible con f-strings."""
    print("=== Resumen intake (sintético) ===")
    print(f"nombres: {resultado.get('nombres')!r} (raw={resultado.get('nombres_raw')!r})")
    print(
        f"apellidos: {resultado.get('apellido_paterno')!r} / "
        f"{resultado.get('apellido_materno')!r}"
    )
    print(f"contacto: {resultado.get('contacto')!r}")
    print(f"direccion: {resultado.get('direccion')!r}")
    print(f"edad: {resultado.get('edad')!r} (raw={resultado.get('edad_raw')!r})")
    errs = resultado.get("errors") or []
    if errs:
        print(f"errors ({len(errs)}):")
        for e in errs:
            print(f"  - {e}")
    else:
        print("errors: []")



def _run_tests() -> None:
    # Caso feliz + Unicode
    r = parse_client(
        "María José",
        "Quispe",
        "Ñahui",
        "999000111",
        "Av. Ejemplo 123, Lima",
        edad="34",
    )
    assert r["apellido_materno_raw"] == "Ñahui"
    assert "Ñahui" in (r.get("apellido_materno") or "")
    assert r["errors"] == [] or isinstance(r["errors"], list)

    # Vacío
    r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
    assert any("nombres" in e.lower() or "vac" in e.lower() for e in r2["errors"])
    assert r2["nombres_raw"] == ""

    # Número inválido
    r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", edad="abc")
    assert r3["edad_raw"] == "abc"
    assert any("edad" in e.lower() for e in r3["errors"])

    print("tests OK")


def main() -> None:
    _run_tests()
    demo = parse_client(
        "  María José  ",
        "Quispe",
        "Ñahui",
        "999000111",
        "Av. Ejemplo 123, Lima",
        edad=" 28 ",
    )
    mostrar_resumen(demo)


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      'Este esqueleto demuestra tipos, conversión segura, nombres PEP 8, preservación de raw e I/O con f-strings. En entrevistas te pedirán extenderlo (más campos, Decimal para montos, CSV). Si el contrato raw/clean + errors está sólido, esas extensiones son naturales. Súbelo a python-ds-journey sin datos reales.',
    rubric: [
      { criterion: 'Parse y tipos correctos (correctness)', weight: '30%' },
      { criterion: 'Vacíos / Unicode / inválidos cubiertos (robustness)', weight: '25%' },
      { criterion: 'Nombres y mensajes claros (maintainability)', weight: '25%' },
      { criterion: 'Datos sintéticos, sin PII, sin claims de parentesco (responsible_use)', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es el tipo de None en Python?',
        options: ['null', 'NoneType', 'void', 'str vacío'],
        correctIndex: 1,
        explanation:
          'None es la única instancia de NoneType. No es lo mismo que "" ni que 0. Para comparar identidad se usa `is None`.',
      },
      {
        question: '¿Qué imprime type("42").__name__ y la comparación 42 == "42"?',
        options: [
          "int y True",
          "str y False",
          "str y True",
          "int y False",
        ],
        correctIndex: 1,
        explanation:
          '"42" es str. 42 (int) no es igual a "42" (str). Hay que convertir de forma explícita antes de comparar o calcular.',
      },
      {
        question: '¿Por qué el teléfono de un cliente de intake se modela como str?',
        options: [
          'Porque int no existe en Python',
          'Porque no es una cantidad aritmética y puede necesitar ceros o formato',
          'Porque str es más rápido que int',
          'Porque PEP 8 lo prohíbe como int',
        ],
        correctIndex: 1,
        explanation:
          'Teléfonos, DNI y códigos son identificadores de texto. Tratarlos como int invita a perder ceros y a operaciones sin sentido.',
      },
      {
        question: 'Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?',
        options: ['[1, 2]', '[1, 2, 3]', '[3]', 'Error'],
        correctIndex: 1,
        explanation:
          'b es un alias del mismo objeto lista. Mutar b muta a. Usa copy() o slice para independizar.',
      },
      {
        question: '¿Cuál es el idioma correcto para comprobar ausencia de valor?',
        options: ['if x == None:', 'if x is None:', 'if x === null:', 'if not x == None:'],
        correctIndex: 1,
        explanation:
          'PEP 8 y la comunidad recomiendan `is None` / `is not None` por identidad del singleton None.',
      },
    ],
  },
  resources: {
    docs: [
      {
        label: 'Python Tutorial — An Informal Introduction',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
        note: 'Literales, strings, listas, asignación; base canónica de S02',
      },
      {
        label: 'Built-in Types',
        url: 'https://docs.python.org/3/library/stdtypes.html',
        note: 'int/float/str/bool, comparaciones, is/is not',
      },
      {
        label: 'decimal — Decimal fixed point',
        url: 'https://docs.python.org/3/library/decimal.html',
        note: 'Dinero en soles (T3); construir desde str, quantize',
      },
      {
        label: 'PEP 8 — Style Guide',
        url: 'https://peps.python.org/pep-0008/',
        note: 'snake_case, UPPER_CASE, evitar l/O/I',
      },
    ],
    books: [
      {
        label: 'Python Tutorial (oficial) como libro corto',
        note: 'Caps. de intro y estructuras: literales, tipos, I/O básico.',
      },
      {
        label: 'Fluent Python (referencia posterior)',
        note: 'Profundiza mutabilidad e identidad; no es lectura obligatoria de S02.',
      },
    ],
    courses: [
      {
        label: 'CS50P — variables, types, input',
        url: 'https://cs50.harvard.edu/python/',
        note: 'Benchmark de secuencia; no copiar ejercicios literales',
      },
      {
        label: 'Kaggle Learn — Python',
        url: 'https://www.kaggle.com/learn/python',
        note: 'Micro-práctica de tipos y funciones básicas',
      },
    ],
  },
}
