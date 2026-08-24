import type { CourseSection } from '../../types'

export const section02: CourseSection = {
  id: 'basics',
  index: 2,
  title: 'Valores, tipos, operadores e I/O',
  shortTitle: 'Valores y tipos',
  tagline: 'Literales, nombres, operadores, Decimal e I/O para validar la captura inicial',
  estimatedHours: 9,
  level: 'Principiante',
  phase: 0,
  icon: 'Code2',
  accentColor: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  jobRelevance:
    'Imagina un formulario internacional: una edad llega como "42", un código postal conserva un cero inicial y un monto exige céntimos exactos. En bancos, fintech, salud o retail, ese detalle separa un registro auditable de uno que falla en silencio. Aquí aprendes a leer campos de un formulario o CSV, distinguir texto de cantidad, convertir sin que el programa se derrumbe y conservar el original para explicar cualquier error.',
  learningOutcomes: [
    { text: 'Identificar literales y tipos básicos (int, float, str, bool, None) y explicar el tipo de expresiones simples' },
    { text: 'Inspeccionar con type/isinstance y convertir/validar valores de forma explícita' },
    { text: 'Asignar nombres con convenciones PEP 8 y distinguir asignación de comparación' },
    { text: 'Explicar identidad vs. igualdad, mutabilidad y conservar copias/valores originales' },
    { text: 'Evaluar aritmética y comparaciones respetando precedencia' },
    { text: 'Calcular montos en soles con Decimal y redondeo a 2 decimales' },
    { text: 'Usar input/print y f-strings para capturar y reportar datos' },
    { text: 'Parsear un registro sintético de cliente conservando originales y reportando errores accionables' },
  ],
  theory: [
    {
            heading: "Cuarenta y dos, con y sin comillas",
      paragraphs: [
        "En S01 preparaste el taller: intérprete, entorno virtual y repositorio. Ahora llega la primera pieza que merece entrar en él. Un formulario puede mostrar `42` y `\"42\"` como si fueran gemelos; para Python son habitantes de mundos distintos, y esa diferencia decide si una comparación funciona o engaña.",
        "Tres ideas bastan para empezar. Un **literal** es un valor escrito directamente en el código: `34`, `\"Quispe\"`, `True`. Su **tipo** —`int`, `float`, `str`, `bool`, `NoneType`— no es una etiqueta burocrática, sino la respuesta a qué operaciones tienen sentido con ese valor: dos números se suman, dos textos se pegan uno detrás de otro, y `\"42\" + 8` no significa nada. Y hay dos signos que se parecen y no se parecen en nada: con **`=`** le pones nombre a un valor, con **`==`** preguntas si dos valores son iguales. Escribir uno por el otro es el error más frecuente de las primeras semanas.",
        "La secuencia que se repite en toda la sección es **valor → significado → operación permitida**, y se lee en ese orden. Cuando algo no funciona, el primer sospechoso no es la operación: es que el valor no era del tipo que suponías. Digo *primer* sospechoso a propósito, porque no es el único. En T2 y T3 verás fallos con el tipo perfectamente correcto — `-3**2` da `-9` por precedencia, `//` redondea hacia abajo y no hacia cero, y un nombre mal escrito lanza `NameError` antes de que ningún tipo entre en juego. El tipo explica la mayoría de las sorpresas de esta sección; la precedencia y el nombre explican el resto.",
        "Hay un punto donde esto deja de ser teoría y se vuelve dinero. Los `float` no representan de forma exacta la mayoría de los decimales, así que `0.1 + 0.2` no da `0.3` sino algo con un residuo minúsculo. Para dibujar un gráfico da igual; para sumar montos en soles, no. Por eso los montos usan `Decimal` y no `float`, y por eso lo vas a ver desde el principio en vez de aprenderlo después de un descuadre.",
        "Y hay un contrato que arrastrarás durante todo el curso: **raw/clean**. El valor tal como llegó se conserva sin tocar; la limpieza se hace sobre una copia. Suena a exceso de cuidado hasta la primera vez que alguien pregunta por qué un registro quedó así y la única respuesta posible es mirar el original.",
        "La pregunta que atraviesa la sección es la que le harías a un dato desconocido: **¿qué es esto realmente, y qué puedo hacer con ello sin mentir?** El hilo conductor es un registro sintético de cliente —nombres, dos apellidos, contacto, dirección, a veces edad o monto—, todo ficticio. Verás `if` y `for` en las demostraciones, pero como sintaxis de apoyo, no como el tema: el control de flujo y la iteración tienen sus propias secciones más adelante.",
      ],
      callout: {
        type: 'info',
        title: 'Qué NO es el foco de esta sección',
        content:
          'No profundizamos aún en condicionales complejos, bucles como herramienta principal, `*args`/`**kwargs` ni comprensiones. La entrega de esta sección es el **esqueleto del parser de intake** (tipos, nombres, operadores, `Decimal` y entrada/salida con `raw`/`clean`/`errors`), no una calculadora genérica de propinas.',
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, ritmo y alcance.",
        "**Orden de los subtemas.** T1 trata los valores: literales, inspección y conversión. T2 pasa a los nombres: asignación, convenciones PEP 8, identidad y copias. T3 cubre los operadores: precedencia y `Decimal` para dinero. T4 cierra con la entrada y salida: f-strings —cadenas con variables incrustadas— y la lectura de datos con manejo de errores.",
        "**Ritmo orientativo.** Unas dieciocho horas, dos sesiones por subtema, más el proyecto y el autochequeo. Avanza T1 a T4 en ese orden: no hace falta dominar `Decimal` el primer día.",
        "**Criterio de cierre (CASO-LIM-002).** El esqueleto del parser de intake: tipos, nombres, operadores, `Decimal` y entrada/salida con `raw`, `clean` y `errors`. No es una calculadora genérica de propinas.",
        "**Fuera de alcance por ahora.** Condicionales complejos, los bucles como herramienta principal, **definir** funciones con `*args` y `**kwargs`, y las comprensiones. Matiz sobre `*args`: en T4-A vas a *llamar* a `print(*valores, sep=…)`, y eso está bien — usar una función que acepta varios argumentos no exige saber escribir una. Lo que queda para después es ponerle `*args` a una función tuya. Llegan cuando el modelo de valores y tipos ya esté firme.",
        "**Límites.** Solo datos sintéticos (`example.com`, teléfonos inventados). Nunca información personal identificable real en el repositorio.",
      ],
      code: {
        language: 'python',
        title: 's02_map_contract.py',
        code: `def section_contract():
    return {
        "case": "CASO-LIM-002",
        "gates": ["types_before_ops", "decimal_for_money", "raw_preserved", "no_real_pii"],
        "focus": "values_types_ops_io",
        "if_for_as_support_syntax": True,
        "real_pii_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("focus", c["focus"])
print("if_for_as_support_syntax", c["if_for_as_support_syntax"])
print("real_pii_ok", c["real_pii_ok"])
`,
        output: `case CASO-LIM-002
focus values_types_ops_io
if_for_as_support_syntax True
real_pii_ok False`,
      },
     },
     {
      heading: 'Literales y tipos básicos',
      subtopicId: 'S02-T1-A',
      paragraphs: [
        'Un sistema de reservas puede recibir el asiento `"07"`, la cantidad `7` y la bandera `True` en una misma fila. A simple vista son datos breves; para el programa, cada uno promete operaciones distintas. **Puente desde el mapa:** antes de convertir nada, aprende a reconocer qué clase de objeto tienes delante.',
        'Un **literal** es un valor escrito directamente en el código: `34`, `150.5`, `"Quispe"`, `True`, `None`. Python clasifica cada valor en un **tipo**. Los tipos básicos de S02 son: **`int`** (enteros: `0`, `34`, `-7`), **`float`** (punto flotante: `150.5`, `1.0`), **`str`** (texto Unicode: `"María José"`, `"Ñahui"`), **`bool`** (`True` / `False`) y **`None`** (ausencia de valor; su tipo es **`NoneType`**).',
        'La trampa clásica de intake: el número **`42`** (int) y el texto **`"42"`** (str) **no son el mismo valor**. `42 == "42"` es `False`. En formularios y CSV **casi todo llega como str**. Si sumas o comparas sin convertir, obtienes `TypeError` o lógica silenciosamente incorrecta. El teléfono **`999000111` debe modelarse como `str`**, no como `int`: no es una cantidad aritmética y puede tener ceros a la izquierda en otros países.',
        'Para ver el tipo usa **`type(x)`** (devuelve la clase) o, en reportes didácticos, `type(x).__name__` (`"int"`, `"str"`, …). Más adelante preferirás `isinstance` para validar; primero entrenas el ojo con literales. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `isinstance(True, int)` es `True`. Para lógica de negocio, trata `bool` como booleano, no como `0`/`1`, salvo que documentes una conversión explícita.',
        '**Detente y predice:** antes de ejecutar el ejemplo, anota el tipo de `None`, `"42"` y `42`. Después compara tu predicción con la salida. Si fallaste, no memorices la respuesta: pregunta qué operaciones tendría sentido permitir en cada caso. Esa explicación causal te prepara para convertir y validar en T1-B.',
      ],
      code: {
        language: 'python',
        title: 'literales_cliente.py',
        code: `def s02_th_1():
    # Registro sintético — cada literal tiene un tipo
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
    print(42 == "42")            # False
s02_th_1()
`,
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
        'En una hoja de inscripción, `" 19 "` no es todavía una edad: es una secuencia de caracteres que *podría* representar una edad. **Puente desde T1-A:** reconocer el tipo describe el presente; convertir y validar decide si ese dato puede cruzar la puerta del sistema.',
        '**`type(x)`** responde “¿qué es esto ahora?”. **`isinstance(x, int)`** responde “¿puedo tratarlo como int?” (incluye subtipos). En parsers, `isinstance` suele ser más útil que comparar `type(x) is int`, porque documenta la intención de validación. Con una salvedad que ya viste en T1-A: como `bool` hereda de `int`, `isinstance(True, int)` es `True`, así que un validador de edades escrito solo con `isinstance` aceptaría `True` como si fuera un 1. Cuando el campo es de negocio y `bool` no es un valor legítimo, añade la exclusión explícita — `isinstance(x, int) and not isinstance(x, bool)`.',
        'La conversión explícita usa constructores: **`int()`**, **`float()`**, **`str()`**. El texto de formularios trae espacios: **`valor.strip()`** antes de convertir. `int(" 19 ")` funciona; `int("19.5")` o `int("abc")` lanzan **`ValueError`**. **Nunca uses `eval()`** sobre input de usuario: es un riesgo de seguridad y un anti-patrón de calidad de datos.',
        'Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar. **Contrato unificado de `safe_int` en esta sección:** devuelve **siempre** una tupla de tres, pase lo que pase. (1) vacío tras `strip` → `(False, None, "… valor vacío")`; (2) dígitos OK → `(True, n, None)`; (3) letras o cualquier otra cosa que `int()` no acepte —incluido `"19.5"`, que sí es un número pero no un entero— → `(False, None, "… no se pudo convertir … a int")`, capturando el `ValueError`. Usarás el mismo contrato en el pipeline de dos campos, en la demo T4-B y en el You Do.',
        '**Modelo mental:** `strip` limpia la envoltura; `int` intenta interpretar el contenido; `try/except` convierte un tropiezo técnico en información útil. Predice las tres ramas de `safe_int("edad", valor)` para `" 19 "`, `" "` y `"diecinueve"` antes de leer la salida. En T2 aprenderás a nombrar esos resultados sin ambigüedad.',
      ],
      code: {
        language: 'python',
        title: 'safe_int_contrato.py',
        code: `def safe_int(campo: str, valor: str):
    """Contrato unificado S02: vacío / OK / ValueError."""
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': valor vacío"
    try:
        return True, int(texto), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

for v in [" 19 ", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))

print(isinstance(19, int))       # True
print(isinstance("19", int))     # False`,
        output: `' 19 ' → (True, 19, None)
'abc' → (False, None, "ERROR en 'edad': no se pudo convertir 'abc' a int")
'  ' → (False, None, "ERROR en 'edad': valor vacío")
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
        'Un programa pequeño puede sobrevivir a `x`, `dato2` y `AP`; un equipo distribuido no debería tener que adivinarlos. **Puente desde T1:** una vez que el valor tiene un tipo, necesita un nombre estable que conserve su significado durante la lectura, la prueba y la revisión.',
        '**`=` asigna** un nombre a un valor en el espacio de nombres (*namespace*) actual. **`==` compara** igualdad y devuelve un `bool`. `if x = 1:` es **SyntaxError** (asignación no es expresión). El operador morsa `:=` existe en Python reciente, pero no es otra forma de preguntar por igualdad: **asigna** un valor a un nombre dentro de una expresión, y el resultado es ese valor. Decirlo importa aquí porque la confusión que esta sección quiere evitar es justamente entre asignar y comparar, y la morsa está del lado de asignar. **En esta sección** comparas siempre con `==`. Mezclar `=` y `==` es un error frecuente en revisiones de código junior.',
        'PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`); **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`); **`CapWords`** para clases (más adelante). Evita nombres de una sola letra confusos: **`l`, `O`, `I`** se confunden con `1` y `0`. Prefiere `longitud`, `indice`, `columna`.',
        'En el esquema (*schema*) de intake usa nombres estables y en español técnico claro: `nombres`, `apellido_paterno`, `apellido_materno`, `contacto`, `direccion`. No inventes parentesco real a partir de apellidos: son **campos de texto**, no una afirmación genealógica. Si un nombre no existe aún, Python lanza **`NameError`**: señala un error de escritura o el uso de un nombre antes de asignarlo.',
        '**Prueba de lectura:** tapa el valor y observa solo el nombre. ¿Podrías explicar qué guarda `apellido_paterno` y por qué `EDAD_MINIMA` parece una regla estable? Si el nombre necesita un comentario para revelar lo esencial, aún puede mejorar. En T2-B verás que dos nombres también pueden señalar el mismo objeto.',
      ],
      code: {
        language: 'python',
        title: 'nombres_pep8.py',
        code: `def s02_th_3():
    nombres_cliente = "Ana"
    apellido_paterno = "García"
    EDAD_MINIMA = 18
    edad = 25

    # Comparación con == (no uses = aquí)
    if edad == EDAD_MINIMA:
        print("edad mínima exacta")
    else:
        print(f"edad={edad}, mínima={EDAD_MINIMA}")

    # NameError si descomentas:
    # print(apellido_materno)
s02_th_3()
`,
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
      figure: {
        id: "S03-truthiness",
        caption:
          "Un if desnudo funde ausente, cero y vacío en la misma rama. Por eso la ausencia se pregunta con `is None`.",
        alt:
          "Cuatro guardas evaluadas en orden: is None da ausente; == 0 y == vacío dan presente; el resto, presente.",
      },
      subtopicId: 'S02-T2-B',
      paragraphs: [
        'Dos etiquetas de equipaje pueden describir maletas iguales sin estar pegadas a la misma maleta. Python distingue esas preguntas: **¿tienen el mismo contenido?** y **¿son el mismo objeto?**. **Puente desde T2-A:** asignar un segundo nombre no siempre crea una segunda cosa.',
        '**`==` compara valor**; **`is` / `is not` comparan identidad** (¿mismo objeto en memoria?). El idioma correcto para ausencia es **`x is None`** (no `x == None`, aunque a veces “funcione”). `id(x)` expone un identificador del objeto; úsalo para entender demos, no en lógica de negocio rutinaria.',
        'Los **`str` son inmutables**: `.strip()` o concatenar devuelve **otro** string; el original no cambia. Usamos **listas solo como preview mínimo** de mutabilidad (`append`, `copy`) — las colecciones a fondo llegan en una sección posterior. Si `b = a` y `a` es una lista, **`b` es un alias**: mutar `b` muta `a`. Para independizar: **`a.copy()`** o **`a[:]`** (copia superficial).',
        'Patrón de calidad de datos: guarda **`campo_raw`** (o un dict `raw`) con el texto original y trabaja en **`campo` / `clean`**. Si el parse falla, **el raw sigue ahí** para el mensaje de error y para reintentos. Nunca sobrescribas el original con la versión normalizada en el mismo nombre si necesitas auditoría.',
        '**Predicción antes del `append`:** con `b = a` y `c = a.copy()`, dibuja tres flechas desde los nombres hacia los objetos. Luego decide qué listas cambiarán al ejecutar `b.append(4)`. El dibujo importa más que memorizar la salida: en T4-B el mismo razonamiento protegerá `raw` mientras normalizas `clean`.',
      ],
      code: {
        language: 'python',
        title: 'raw_vs_alias.py',
        code: `def s02_th_4():
    raw_nombre = "  José Ñahui  "
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
    print(x is None)  # True — idioma canónico
s02_th_4()
`,
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
        'Una fórmula de tarifa escrita en Nairobi, Toronto o Lima puede caber en una línea y aun así esconder dos interpretaciones. Python no “entiende la intención”: sigue una jerarquía de operadores. **Puente desde T2:** los nombres ya están claros; ahora debes hacer explícita la relación matemática entre sus valores.',
        'Los operadores aritméticos de S02 son: `+`, `-`, `*`, `/` (división verdadera, devuelve `float`), `//` (división entera hacia −∞; en negativos no “hacia cero”), `%` (resto) y `**` (potencia). Las **comparaciones** (`==`, `!=`, `<`, `<=`, `>`, `>=`) devuelven `bool` y se combinan con la aritmética en expresiones de negocio (rangos, umbrales).',
        'La **precedencia** importa: `*` y `/` van antes que `+` y `-`; `**` es aún más prioritario y se asocia a la derecha. Trampa clásica: **`-3**2` vale `-9`**, no `9`, porque el unario `-` se aplica al resultado de `3**2`. Usa **`(-3)**2`** si quieres el cuadrado del negativo. Cuando dudes, **paréntesis**: `(a + b) * c` no es lo mismo que `a + b * c`.',
        'En cualquier sistema de cobro, un impuesto de 18% se escribe mentalmente como *base × (1 + 0.18)*. Si escribes `base + base * 0.18` sin paréntesis extra, la precedencia de `*` ya lo resuelve; si mezclas sumas de líneas y tasas, **paréntesis explícitos** evitan errores de interpretación en revisión. Para dinero real en soles, **T3-B usa `Decimal`** — aquí entrenas la expresión; allá entrenas la precisión.',
        '**Predice, luego ejecuta:** escribe primero el resultado de `-3**2`, `(-3)**2`, `10 // 3` y `10 % 3`. Si una predicción falla, añade paréntesis hasta que la expresión narre la intención de izquierda a derecha. El siguiente subtema conserva esa claridad y cambia la representación numérica para proteger los céntimos.',
      ],
      code: {
        language: 'python',
        title: 'precedencia_ops.py',
        code: `def s02_th_5():
    a, b, c = 10, 3, 2
    print("10 // 3 =", a // b)   # 3
    print("10 % 3  =", a % b)    # 1
    print("3 ** 2  =", b ** c)   # 9
    print("a + b * c =", a + b * c)      # 16
    print("(a + b) * c =", (a + b) * c)  # 26
    print("-3**2 =", -3**2)              # -9
    print("(-3)**2 =", (-3)**2)          # 9
s02_th_5()
`,
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
        title: 'Paréntesis antes que memoria de precedencia',
        content:
          'Si un programador junior tiene que reabrir el manual de precedencia para entender tu línea, reescribe con paréntesis. En una revisión de código (code review) peruana de data, la claridad gana a la “línea ingeniosa”.',
      },
    },
    {
      heading: 'Decimal para dinero y redondeo',
      figure: {
        id: "S02-decimal-rounding",
        caption:
          "Redondear una sola vez, al final. Hacerlo en cada paso acumula el error y con float ni siquiera es reproducible.",
        alt:
          "Un eje de cuatro pasos con una línea vertical en el tercero marcada como la única vez que se redondea.",
      },
      subtopicId: 'S02-T3-B',
      paragraphs: [
        'Una diferencia de redondeo puede parecer invisible en una operación y volverse material al repetirse miles de veces. La lección no exige dramatismo: **representar dinero es elegir qué errores aceptas**. **Puente desde T3-A:** la fórmula puede ser correcta y, sin embargo, el tipo numérico puede traicionarla.',
        '**`float` no es dinero.** `0.1 + 0.2` produce `0.30000000000000004` por representación binaria. En montos en **soles (S/)** de fintech, retail o bancos, usa **`decimal.Decimal`**. Construye desde **`str`**: `Decimal("0.1")`, **nunca** `Decimal(0.1)` (ya arrastras el error del float).',
        'Redondeo a céntimos: **`quantize(Decimal("0.01"))`**. El redondeo bancario por defecto suele ser **`ROUND_HALF_EVEN`** (mitad al par). Importa: `from decimal import Decimal, ROUND_HALF_EVEN`. Patrón: subtotal + IGV 18% → quantize en cada paso monetario que debas mostrar o persistir.',
        'En intake, el campo monto llega como **texto** (`"150.50"`). Parseas con `Decimal(texto.strip())`, capturas `InvalidOperation`, y reportas error con nombre de campo. **Convención S02: punto decimal** (`150.50`), no coma; si el CSV trae coma, documenta la normalización antes de Decimal.',
        '**Comprueba la causa:** predice si `Decimal(0.1)` y `Decimal("0.1")` serán idénticos; luego imprime ambos. El segundo nace de la representación decimal que escribiste; el primero hereda una aproximación binaria ya creada. En T4 llevarás este valor confiable a un mensaje legible sin devolverlo a `float`.',
      ],
      code: {
        language: 'python',
        title: 'decimal_igv.py',
        code: `def s02_th_6():
    from decimal import Decimal, ROUND_HALF_EVEN

    print("float:", 0.1 + 0.2)
    print("Decimal:", Decimal("0.1") + Decimal("0.2"))

    subtotal = Decimal("100.00")
    igv = (subtotal * Decimal("0.18")).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_EVEN
    )
    total = (subtotal + igv).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
    print("subtotal", subtotal, "IGV", igv, "total", total)
s02_th_6()
`,
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
      heading: 'Entrada/salida: input, print y f-strings',
      subtopicId: 'S02-T4-A',
      paragraphs: [
        'En una terminal, un cuaderno web o una aplicación móvil, la frontera se parece: fuera del programa hay texto; dentro, quieres valores con significado. **Puente desde T3:** ya sabes calcular con tipos adecuados; ahora separarás captura, interpretación y presentación para poder probar cada paso.',
        '**`input(prompt)`** siempre devuelve **`str`**, aunque el usuario escriba dígitos. En el browser/Pyodide a menudo **simulas input** con variables o parámetros de función (testeable). **`print(*args, sep=" ", end="\\n")`** controla separadores y fin de línea.',
        'Las **f-strings** (`f"...{expr}..."`) son el formato preferido en S02: son legibles, aceptan expresiones cortas y especificadores (`{monto:.2f}`, `{nombre!r}`). Después de T3-B, todo monto de negocio continúa como `Decimal`: formatearlo con `.2f` no requiere convertirlo a `float`. Los prompts y los mensajes de error del intake van en **español claro** (“Ingresa el contacto:”, “ERROR en \'edad\': …”).',
        'Patrón profesional: separa **captura** (valores str), **parse** (tipos) y **reporte** (f-strings). Así puedes hacer pruebas unitarias del parse sin depender de la consola. Un resumen de cliente con 4–5 campos es el puente natural al You Do.',
        '**Predicción útil:** si una persona escribe `34`, ¿qué mostrará `type(input(...)).__name__`? Responde antes de ejecutar. Luego explica por qué convertir dentro de la función de captura dificultaría probar el parser. T4-B reunirá las tres capas en un contrato con errores observables.',
      ],
      code: {
        language: 'python',
        title: 'reporte_fstring.py',
        code: `def s02_th_7():
    from decimal import Decimal

    # Simula input (testeable): no llames input() en demos de CI
    nombres = "María José"
    monto = Decimal("150.50")
    print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
    print("campos", "a", "b", sep=" | ")
s02_th_7()
`,
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
        'Un buen parser se parece menos a un portero que expulsa al primer visitante y más a un recepcionista cuidadoso: conserva lo recibido, explica qué no pudo interpretar y deja continuar lo demás. **Puente desde T4-A:** la entrada ya está separada del cálculo; ahora conviertes texto incierto en un resultado auditable.',
        'Un **parser de intake** recibe un registro sintético, conserva **`*_raw`**, produce campos limpios (strip) y acumula **`errors: list[str]`** sin tragar excepciones. El raw **siempre** está, incluso si el clean es `None` o el campo está vacío.',
        'Casos mínimos del gate CP-N1-A: **vacío** (mensaje accionable + raw `""`); **Unicode** (García, Ñahui, María se conservan de ida y vuelta, sin que se conviertan en signos raros); **número inválido** (`edad="abc"` → error con nombre de campo, raw intacto). El helper **`safe_int`** usa un solo contrato en toda la sección, el de T1-B: siempre una tupla de tres; vacío tras `strip` → `(False, None, …)`; dígitos OK → `(True, n, None)`; letras o cualquier otra cosa que `int()` rechace —`"19.5"` incluido— → `(False, None, …)` con el mensaje por campo. Las pruebas son **asserts** o pytest: no basta con “mirar la consola”.',
        'Mensaje accionable = **qué campo**, **qué valor se recibió** (`!r` / repr), **qué se esperaba**. Evita `except: pass`. No afirmes parentesco real por dos apellidos: son **campos de texto** del schema.',
        '**Cierre de la cadena:** sigue un solo valor desde `" 34 "` hasta `edad_raw`, `strip`, `safe_int` y `edad=34`. Después repite el recorrido con `"abc"` y señala dónde nace el mensaje. Si puedes narrar ambos caminos sin mirar el código, estás listo para construir el You Do sin copiar la solución.',
      ],
      code: {
        language: 'python',
        title: 'parse_minimo.py',
        code: `def safe_int(campo: str, valor: str):
    """Contrato unificado S02: vacío tras strip y ValueError con mensaje por campo."""
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': valor vacío"
    try:
        return True, int(texto), None
    except ValueError:
        msg = f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"
        return False, None, msg

print(safe_int("edad", "abc"))
print(safe_int("edad", "  "))
print(safe_int("edad", " 34 "))
raw = "  Ñahui  "
print("raw", repr(raw), "clean", repr(raw.strip()))`,
        output: `(False, None, "ERROR en 'edad': no se pudo convertir 'abc' a int")
(False, None, "ERROR en 'edad': valor vacío")
(True, 34, None)
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
      'Partimos del taller que preparaste en S01 (`.venv` activo, o el sandbox del navegador — un entorno aislado que ejecuta Python dentro de la página, sin instalar nada) y seguimos un registro sintético desde su apariencia en pantalla hasta un resultado auditable. En cada demo aplica el mismo ritual: **predice una línea**, **sigue el código**, **comprueba la salida** y **explica la diferencia**. Recorrerás literales, conversión, nombres, identidad, operadores, `Decimal`, f-strings y el parser final (el programa que descompone el texto de entrada en datos estructurados). Copiar y ejecutar confirma que Python hizo algo; explicar por qué hizo *eso* confirma que aprendiste. Solo datos ficticios, nunca PII real.',
    steps: [
      {
        demoId: 'S02-T1-A-DEMO',
        subtopicId: 'S02-T1-A',
        environment: 'browser-pyodide',
        description: 'Literales de un registro de cliente y type() de cada campo',
        preamble:
          'Antes de parsear un intake, el analista debe *ver* el tipo de cada campo. Esta demo usa un registro sintético (sin PII real) con `str`, `int`, `float`, `bool` y `None`. **Predicción:** antes de bajar a la salida, decide qué imprimirán `type(referencia).__name__` y `42 == "42"`. Luego sigue cada `print` como si fuera una linterna: valor, tipo y comparación. Si confundes número y texto, el pipeline de calidad miente.',
        code: {
          language: 'python',
          title: 'S02-T1-A-DEMO — literales_cliente',
          code: `def s02_ido_1():
    # Cliente sintético (no es persona real)
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
    print("42 == '42' →", 42 == "42")
s02_ido_1()
`,
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
        why: '`type(x).__name__` hace visible la clase de cada campo. Teléfono y códigos deben modelarse como `str` aunque “parezcan números”. La igualdad `42 == "42"` es `False` a propósito: el pipeline no puede comparar cantidad con texto.',
        retrospective:
          'Si puedes explicar por qué `"42"` no es `42` sin mirar el código, ya tienes el hábito de inspección de tipos. El teléfono y los códigos deben modelarse como `str`. En We Do clasificarás literales y elegirás tipos por semántica del campo.',
      },
      {
        demoId: 'S02-T1-B-DEMO',
        subtopicId: 'S02-T1-B',
        environment: 'browser-pyodide',
        description: 'safe_int unificado: vacío, OK y ValueError con mensaje por campo',
        preamble:
          'En formularios y CSV casi todo llega como texto. Esta demo fija el contrato único de `safe_int`: vacío tras `strip`, entero válido o texto no convertible con mensaje por campo. **Predicción:** para `" 19 "`, `"abc"` y `"  "`, escribe primero las tres tuplas que esperas. Después recorre la función de arriba abajo y localiza el punto exacto en que cada caso toma un camino distinto. Datos sintéticos; no uses `eval`.',
        code: {
          language: 'python',
          title: 'S02-T1-B-DEMO — safe_int_contrato',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': valor vacío"
    try:
        return True, int(texto), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

for v in [" 19 ", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))
print("isinstance(19, int) →", isinstance(19, int))
print("isinstance('19', int) →", isinstance("19", int))`,
          output: `' 19 ' → (True, 19, None)
'abc' → (False, None, "ERROR en 'edad': no se pudo convertir 'abc' a int")
'  ' → (False, None, "ERROR en 'edad': valor vacío")
isinstance(19, int) → True
isinstance('19', int) → False`,
        },
        why: 'El contrato de tres ramas (vacío / OK / basura) es el mismo del pipeline de dos campos, de la demo T4-B y del You Do. `isinstance` separa “ya es `int`” de “sigue siendo texto”. El mensaje siempre nombra el campo y el valor recibido.',
        retrospective:
          'Tres salidas posibles (OK / vacío / basura) y mensaje con nombre de campo: eso es validación profesional. El error clásico es tragar el fallo o convertir sin `strip`. Autochequeo: ¿puedes nombrar las tres salidas de `safe_int` sin mirar el código? Reutilizarás este contrato en el pipeline de dos campos y en el You Do.',
      },
      {
        demoId: 'S02-T2-A-DEMO',
        subtopicId: 'S02-T2-A',
        environment: 'browser-pyodide',
        description: 'Renombrar a snake_case y usar == en comparaciones',
        preamble:
          'En una revisión de código, los nombres y `=` frente a `==` se entienden antes que el algoritmo. Esta demo muestra `snake_case`, una constante `UPPER_CASE` y una comparación con `==` (no asignación). **Predicción:** con `edad = 25` y `EDAD_MINIMA = 18`, ¿qué rama se ejecuta y por qué? Lee después los nombres comentados como señales de deuda, no como modelos que debas copiar.',
        code: {
          language: 'python',
          title: 'S02-T2-A-DEMO — nombres_y_comparacion',
          code: `def s02_ido_3():
    # Mal estilo (comentado a propósito):
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
    print("apellido_paterno=", apellido_paterno)
s02_ido_3()
`,
          output: `edad=25, mínima=18
nombres_cliente= Ana
apellido_paterno= García`,
        },
        why: 'Code review junior en Perú mira nombres y `=` vs `==` antes que algoritmos. `snake_case` + constantes `UPPER_CASE` + `==` en el `if` es el contrato mínimo de legibilidad para el schema de intake.',
        retrospective:
          'Asignar es `=`; preguntar igualdad es `==` — mezclarlos es `SyntaxError` o lógica rota. `snake_case` y constantes `UPPER_CASE` reducen `NameError` en review. El error clásico es “el código se ve bien” con CamelCase y `if x = 1`. En We Do renombrarás variables y corregirás tres `if` rotos.',
      },
      {
        demoId: 'S02-T2-B-DEMO',
        subtopicId: 'S02-T2-B',
        environment: 'browser-pyodide',
        description: 'Alias vs. copia y preservar raw tras normalizar',
        preamble:
          'El contrato raw/clean exige que el original sobreviva al `strip`. Aquí verás que `strip` devuelve *otro* string y que `b = a` en listas crea un alias. **Predicción visual:** dibuja `a`, `b` y `c` como nombres con flechas; decide qué contenido cambiará después de `b.append(4)`. Solo entonces sigue la salida en este orden: raw → clean → alias → copia → `is None`.',
        code: {
          language: 'python',
          title: 'S02-T2-B-DEMO — raw_y_alias',
          code: `def s02_ido_4():
    raw_nombre = "  José Ñahui  "
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
    print("x is None →", x is None)
s02_ido_4()
`,
          output: `raw= '  José Ñahui  '
clean= 'José Ñahui'
raw is clean? False
a after alias mutate: [1, 2, 3, 4]
c unchanged: [1, 2, 3]
a is b? True
a is c? False
x is None → True`,
        },
        why: 'El raw debe sobrevivir al strip. En estructuras mutables, el alias es la principal forma de corromper el original “sin tocar raw”. `copy()`/slice y claves `*_raw` son el hábito del parser. Las listas aquí son solo un preview de mutabilidad: la auditoría de intake depende de las claves `*_raw`, no de colecciones profundas aún.',
        retrospective:
          'Strings limpios no deben sobrescribir el raw. En mutables, copia antes de mutar. `is` es para identidad (sobre todo `None`); `==` es para valor. We Do te pedirá romper el alias y diseñar un dict con `*_raw`.',
      },
      {
        demoId: 'S02-T3-A-DEMO',
        subtopicId: 'S02-T3-A',
        environment: 'browser-pyodide',
        description: 'Evaluar // % ** y corregir expresión con precedencia',
        preamble:
          'Antes de confiar en un cálculo, verifica `//`, `%`, `**` y paréntesis. **Predicción:** escribe los resultados de `a + b * c`, `(a + b) * c`, `-3**2` y `(-3)**2` sin ejecutar. Después compara línea por línea y corrige tu modelo de precedencia, no solo la cifra. El total con IGV usa `float` a propósito; la siguiente demo mostrará por qué debes cambiar de tipo.',
        code: {
          language: 'python',
          title: 'S02-T3-A-DEMO — operadores_precedencia',
          code: `def s02_ido_5():
    a, b, c = 10, 3, 2
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
    print("total con IGV (float demo) =", total)
s02_ido_5()
`,
          output: `10 // 3 = 3
10 % 3  = 1
3 ** 2  = 9
a + b * c = 16
(a + b) * c = 26
-3**2 = -9
(-3)**2 = 9
total con IGV (float demo) = 118.0`,
        },
        why: 'En code review, paréntesis explícitos evitan reabrir el manual de precedencia. `-3**2` es la trampa más citada; `(a+b)*c` vs `a+b*c` es el bug de descuento/IGV en una línea. El total con `float` aquí es solo práctica de expresión: dinero exacto va con `Decimal` en T3-B.',
        retrospective:
          'Precedencia no se memoriza a ciegas: paréntesis explícitos ganan en code review. La basura del float en montos se ataca en la siguiente demo con `Decimal`. We Do practicará operadores y la trampa de la potencia.',
      },
      {
        demoId: 'S02-T3-B-DEMO',
        subtopicId: 'S02-T3-B',
        environment: 'browser-pyodide',
        description: 'Subtotal + IGV 18% con Decimal y quantize a 2 decimales',
        preamble:
          'En montos en soles, `float` aproxima: mira `0.1 + 0.2`. Esta demo construye `Decimal` **desde texto**, calcula IGV 18% y fija céntimos con `quantize(..., ROUND_HALF_EVEN)`. **Predicción:** ¿cuál de las dos primeras sumas mostrará una cola de dígitos y de dónde viene? Observa también la ausencia deliberada de `Decimal(0.1)`. Son datos de laboratorio, no contabilidad real.',
        code: {
          language: 'python',
          title: 'S02-T3-B-DEMO — decimal_igv',
          code: `def s02_ido_6():
    from decimal import Decimal, ROUND_HALF_EVEN

    print("float 0.1+0.2 =", 0.1 + 0.2)
    print("Decimal =", Decimal("0.1") + Decimal("0.2"))

    subtotal = Decimal("100.00")
    igv = (subtotal * Decimal("0.18")).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_EVEN
    )
    total = (subtotal + igv).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
    print(f"subtotal={subtotal} IGV={igv} total={total}")
s02_ido_6()
`,
          output: `float 0.1+0.2 = 0.30000000000000004
Decimal = 0.3
subtotal=100.00 IGV=18.00 total=118.00`,
        },
        why: 'En soles, `float` aproxima por su representación binaria. `Decimal` se construye **desde texto** para no heredar ese error; `quantize(..., ROUND_HALF_EVEN)` fija céntimos. Es un contrato mínimo que reconocerás en equipos de datos financieros de muchos países: no sustituye una política contable, pero sí establece un hábito verificable de revisión.',
        retrospective:
          'Dinero = `Decimal` desde `str` + `quantize` a `0.01`. El error clásico es `Decimal(0.1)` o “arreglar” con `round` al final. Pregunta de cierre: ¿por qué `0.1 + 0.2` no es `0.3` en float? En We Do compararás float vs Decimal y armarás propina y `parse_monto`.',
      },
      {
        demoId: 'S02-T4-A-DEMO',
        subtopicId: 'S02-T4-A',
        environment: 'browser-pyodide',
        description: 'Capturar (simulado) y reportar nombre + monto con f-string',
        preamble:
          '`input()` siempre devuelve `str`; para separar captura y lógica, aquí simulamos la entrada con variables. Esta demo reporta nombre y monto con una f-string y `:.2f` sobre un `Decimal`. **Predicción:** decide si `:.2f` necesita convertir el monto a `float` y qué texto produciría el segundo `print` con `sep=" · "`. Ejecuta después; no llames `input()` aquí.',
        code: {
          language: 'python',
          title: 'S02-T4-A-DEMO — reporte_fstring',
          code: `def s02_ido_7():
    from decimal import Decimal

    # Simula input() con variables (testeable en Pyodide/CI)
    nombres = "María José"
    monto = Decimal("150.50")
    print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
    print("OK", "intake", sep=" · ")
s02_ido_7()
`,
          output: `Cliente: María José | Monto: S/ 150.50
OK · intake`,
        },
        why: '`input()` siempre devuelve `str`; en demos y tests se simula con variables para poder ejecutar en Pyodide/CI. El reporte usa f-strings y `:.2f` sobre `Decimal` sin convertir a `float`. Separar captura, parse y formato es lo que hace testeable el intake.',
        retrospective:
          'Si el resumen se arma sin consola real, los tests del parser no dependen del teclado. El error clásico es formatear con `float(monto)` “por comodidad”. We Do: saludo, reporte multi-línea y función que simula prompts.',
      },
      {
        demoId: 'S02-T4-B-DEMO',
        subtopicId: 'S02-T4-B',
        environment: 'browser-pyodide',
        description: 'Parser mínimo: raw, clean, errors; 3 casos de prueba',
        preamble:
          'El gate del parser no es “imprimió algo”: son asserts sobre raw, Unicode y errores accionables. Esta demo reúne el schema del You Do (CP-N1-A): `*_raw`, campos limpios, `errors` y `safe_int` para edad. **Predicción:** para el caso feliz, el vacío y `"abc"`, anota qué clave debe conservar el original y qué lista debe cambiar. Luego sigue cada valor desde argumento hasta assert. Solo datos sintéticos.',
        code: {
          language: 'python',
          title: 'S02-T4-B-DEMO — parse_cliente_min',
          code: `def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': valor vacío"
    try:
        return True, int(texto), None
    except ValueError:
        return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"

def parse_client(
    nombres: str,
    apellido_paterno: str,
    apellido_materno: str,
    contacto: str,
    direccion: str,
    edad=None,
) -> dict:
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

# 1) Unicode feliz
r1 = parse_client("María", "Quispe", "Ñahui", "999000111", "Lima", "34")
assert r1["apellido_materno_raw"] == "Ñahui" and r1["errors"] == []
# 2) Vacío
r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
assert r2["nombres_raw"] == "" and any("nombres" in e for e in r2["errors"])
# 3) Número inválido
r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", "abc")
assert r3["edad_raw"] == "abc" and any("edad" in e for e in r3["errors"])
print("3 tests OK")
print(r1)
print(r2["errors"])
print(r3["errors"])`,
          output: `3 tests OK
{'nombres_raw': 'María', 'apellido_paterno_raw': 'Quispe', 'apellido_materno_raw': 'Ñahui', 'contacto_raw': '999000111', 'direccion_raw': 'Lima', 'edad_raw': '34', 'nombres': 'María', 'apellido_paterno': 'Quispe', 'apellido_materno': 'Ñahui', 'contacto': '999000111', 'direccion': 'Lima', 'edad': 34, 'errors': []}
["ERROR en 'nombres': vacío (raw='')"]
["ERROR en 'edad': no se pudo convertir 'abc' a int"]`,
        },
        why: 'El schema de salida fija claves `*_raw`, campos limpios y `errors`. `clean_required` valida texto obligatorio; `safe_int` cubre edad opcional (vacío / OK / basura). Los asserts demuestran Unicode, vacío y número inválido sin depender de “mirar la consola”.',
        retrospective:
          'Tres invariantes: raw siempre presente, Unicode round-trip, número inválido no revienta el proceso. El mensaje nombra campo y valor (`!r`). We Do construirá cada pieza y al final la suite completa; el You Do es este contrato con `main` y tests fijos.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora la explicación deja de ser espectáculo y se convierte en ensayo. Cada subtema sigue tres pasos: **E1 guiado**, donde completas una decisión visible; **E2 independiente**, donde eliges sin el modelo al lado; y **E3 de transferencia**, donde la idea entra al schema de intake. Antes de escribir, predice una salida o un invariante; después ejecuta; al final explica qué error habría violado el contrato. Usa las pistas solo tras un intento genuino y compara el razonamiento, no solo la salida, con la solución. Son 24 ejercicios con datos sintéticos; `Decimal` aparece desde T3-B.',
    steps: [
      // ——— S02-T1-A ———
      {
        subtopicId: 'S02-T1-A',
        kind: 'guided',
        title: 'Clasificar cinco literales con `type`',
        preamble:
          '- **Contexto:** en un lote de intake sintético (CASO-LIM-002) el primer control de calidad es saber qué tipo trae cada literal.\n- **Meta:** practicar `repr` + `type(...).__name__` sobre cinco valores base.\n- **Éxito:** cinco líneas en este orden de tipos: `int`, `float`, `str`, `bool`, `NoneType` (p. ej. `0 → int`).\n- **Límites:** no conviertas valores; no uses `eval`; solo datos del starter.',
        id: 'S02-T1-A-E1',
        instruction:
          '1. Revisa la lista `literales` del starter.\n2. En el `for`, completa los dos huecos del `print`.\n3. Ejecuta y compara con la salida esperada (cinco líneas).',
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
          'Si acertaste `NoneType` y `bool`, ya no mezclas “ausencia”, “falso” y “cero” en el ojo. El `repr` muestra el literal real (comillas en str). Siguiente: igualdad cruda `42` vs `"42"`.',
        retrospective:
          'El nombre del tipo se lee con `type(x).__name__`; `None` es `NoneType`, no la cadena `"None"`. Si confundiste `False` con `0`, vuelve a la pregunta semántica: una bandera responde sí/no; un conteo responde cuánto. Autochequeo: ¿qué imprime `type(None).__name__` y qué operación absurda evitarías con ese valor? Siguiente: demostrar que `42` y `"42"` no son lo mismo.',
        starterCode: {
          language: 'python',
          title: 'clasificar_literales.py',
          code: `# CASO-LIM-002 · T1-A-E1
# Completa el cuerpo del bucle: imprime repr(lit) y el nombre del tipo.
literales = [0, 3.14, "Lima", False, None]

for lit in literales:
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
        subtopicId: 'S02-T1-A',
        kind: 'independent',
        title: 'Demostrar `42` vs `"42"` y el subtipo bool',
        preamble:
          '- **Contexto:** el bug junior más caro en parse es comparar texto numérico con entero sin convertir.\n- **Meta:** contrastar literales, igualdad cruda vs tras `str()`, y el matiz `isinstance(True, int)`.\n- **Éxito:** salidas coherentes con tipos `int`/`str`, igualdad cruda `False`, tras `str()` `True`, `isinstance(True, int)` `True`, más una nota de una frase.\n- **Límites:** no conviertas *antes* de la igualdad cruda; no abuses de bool-como-int en negocio.',
        id: 'S02-T1-A-E2',
        instruction:
          '1. Completa los `print` del starter con `codigo_int` y `codigo_str`.\n2. Imprime tipos, igualdad cruda, igualdad tras `str()`, e `isinstance(True, int)`.\n3. Cierra con un `print` de nota (una frase) sobre no tratar banderas como montos.',
        hint: 'No conviertas antes de la primera comparación. str(42) produce el texto "42".',
        hints: [
          'No conviertas antes de la primera comparación. str(42) produce el texto "42".',
          'bool es subclase de int en Python: isinstance(True, int) → True. En negocio, modela banderas como bool explícito, no como 1/0 accidental.',
        ],
        edgeCases: [
          'bool es subtipo de int — no abusar',
          '42 == "42" es False aunque “se vean” iguales.',
        ],
        tests: 'assert types int/str; assert 42 != "42"; assert str(42) == "42"; mención de isinstance(True, int).',
        feedback:
          'La igualdad cruda `False` y la conversión explícita revelan un error frecuente de parse: el tipo se decide *antes* de comparar, no “después si falla”. Si `isinstance(True, int)` te sorprendió, trátalo como detalle del lenguaje, no como permiso de modelar banderas como montos.',
        retrospective:
          '`42 == "42"` es `False` aunque “se vean” iguales; la conversión es una decisión explícita, no un parche automático. Si tu primera reacción fue convertir todo a texto, pregunta qué operación necesitarás después: sumar, ordenar o solo identificar. `bool` como subclase de `int` es un detalle del lenguaje, no permiso para modelar banderas como dinero. En E3 elegirás tipos por la semántica del campo.',
        starterCode: {
          language: 'python',
          title: 'literal_vs_texto.py',
          code: `# CASO-LIM-002 · T1-A-E2
# Completa cada print: tipos, igualdad cruda, igualdad tras str(), isinstance.
codigo_int = 42
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
        subtopicId: 'S02-T1-A',
        kind: 'transfer',
        title: 'Tipar campos del cliente de intake',
        preamble:
          '- **Contexto:** el schema del registro sintético fija tipos antes de cualquier cálculo.\n- **Meta:** elegir literales y tipos esperados por semántica de campo (no “lo que Excel infiera”).\n- **Éxito:** seis campos con `ok=True`; `contacto` es `str` (teléfono), `edad` `int`, `activo` `bool`.\n- **Límites:** teléfono **no** como `int`; Unicode permitido en nombres/apellidos; sin PII real.',
        id: 'S02-T1-A-E3',
        instruction:
          '1. Completa cada par `(valor, tipo)` en el dict `campos`.\n2. Asegura `contacto` como string de dígitos entre comillas.\n3. Ejecuta el `for` de verificación; todas las líneas deben mostrar `ok=True`.',
        hint: 'contacto = "999000111" (str), no 999000111 (int). Apellidos con ñ/tildes son str Unicode.',
        hints: [
          'contacto = "999000111" (str), no 999000111 (int). Apellidos con ñ/tildes son str Unicode.',
          'Puedes guardar tuplas (valor, tipo_esperado) en un dict y validar type(v) is t en un for. Eso no contradice isinstance: type is t comprueba clase exacta; isinstance acepta subtipos.',
        ],
        edgeCases: [
          'teléfono como str no int',
          'Unicode en nombres/apellidos (Ñahui)',
        ],
        tests: 'Rúbrica: 6 campos; contacto str; edad int; activo bool; todos type checks True.',
        feedback:
          'Si `contacto` quedó entre comillas y todos los `ok=True`, elegiste tipos por semántica de campo, no por “lo que Excel infiere”. Teléfono no es cantidad. Llevas este schema al dict del You Do.',
        retrospective:
          'Elegir tipo es diseñar un schema, no describir cómo “se ve” el dato. Identificadores como teléfonos y códigos son `str` porque no tiene sentido sumarlos. Si pusiste el contacto como `int`, imagina un código `"007"` y observa qué información perderías. `type(v) is t` comprueba clase exacta; en validación preferirás `isinstance` (T1-B). Llevarás esta decisión al dict del You Do.',
        starterCode: {
          language: 'python',
          title: 'campos_intake_tipados.py',
          code: `# CASO-LIM-002 · T1-A-E3
# Completa valor y tipo esperado (int, float, str, bool).
# El teléfono (contacto) DEBE ser str, no int.
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
        subtopicId: 'S02-T1-B',
        kind: 'guided',
        title: 'Convertir edad con `strip` e `int`',
        preamble:
          '- **Contexto:** en CSV/formularios la edad llega con espacios (`" 21 "`).\n- **Meta:** hábito `strip` → constructor `int`.\n- **Éxito:** imprime `21 int` (`edad == 21` y tipo `int`).\n- **Límites:** no uses `eval`; no ignores espacios (aplica `strip` aunque a veces `int` tolere whitespace).',
        id: 'S02-T1-B-E1',
        instruction:
          '1. A partir de `raw`, construye `edad` con `strip` e `int`.\n2. Imprime valor y `type(edad).__name__`.\n3. Verifica mentalmente: no debe quedar `str`.',
        hint: '`int(raw.strip())`: limpia primero y construye después.',
        hints: [
          '`int(raw.strip())`: limpia primero y construye después.',
          'Si haces int(raw) sin strip, en " 21 " también funciona en Python 3, pero el hábito strip es obligatorio para vacíos y mensajes; úsalo siempre en parsers.',
        ],
        edgeCases: ['espacios alrededor del número'],
        tests: 'assert edad == 21 and type(edad) is int',
        feedback:
          '`int` sin `strip` a veces “funciona” con espacios, pero el hábito falla en vacíos y en mensajes. Orden: limpiar → construir → reportar tipo. Sin `eval`.',
        retrospective:
          '`strip` + `int` es el mínimo de un campo numérico que llega como texto. El error clásico es pensar que limpiar y validar son lo mismo: `strip` quita bordes, pero no convierte `"veintiuno"`. Predice ahora qué excepción produciría ese valor y dónde deberías capturarla. Siguiente: envolver OK, vacío y basura en `safe_int`.',
        starterCode: {
          language: 'python',
          title: 'int_con_strip.py',
          code: `# CASO-LIM-002 · T1-B-E1
# Construye edad a partir de raw con strip + int, luego imprime valor y tipo.
raw = " 21 "
edad = ____
print(edad, type(edad).__name__)
`,
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
        subtopicId: 'S02-T1-B',
        kind: 'independent',
        title: 'Implementar `safe_int` con tres ramas',
        preamble:
          '- **Contexto:** el parser de intake no puede morir en el primer campo basura.\n- **Meta:** devolver `(ok, valor|None, mensaje|None)` con mensaje accionable.\n- **Éxito:** cuatro casos `" 21 "`, `""`, `"abc"`, `"  "` como en la solución (OK / vacío / basura / vacío).\n- **Límites:** sin `eval`; sin `except: pass`; mensaje con nombre de campo y `!r` del valor.',
        id: 'S02-T1-B-E2',
        instruction:
          '1. Completa el cuerpo de `safe_int` (vacío tras strip → error; `try int`; `ValueError` → mensaje).\n2. Deja el `for` de prueba tal cual.\n3. Ejecuta y compara las cuatro líneas con la solución.',
        hint: 'Tras strip, si texto == "", error de vacío. try/except ValueError para letras.',
        hints: [
          'Tras strip, si texto == "", error de vacío. try/except ValueError para letras.',
          'Mensaje accionable: incluye el nombre del campo y el valor recibido con !r (repr).',
        ],
        edgeCases: ['vacío', 'solo espacios', 'letras'],
        tests: 'devuelve (ok, valor|None, msg); 4 casos como en la demo de solución.',
        feedback:
          'Vacío y basura son errores distintos: el mensaje debe decirlo y nombrar el campo. Sin `eval` ni `except: pass`. Si las cuatro líneas coinciden con la solución, ya tienes el contrato reutilizable del parser.',
        retrospective:
          'Una función `safe_*` reutilizable concentra una decisión: tres ramas y un mensaje accionable con `!r`. Si vacío y `"abc"` devolvieron el mismo mensaje, perdiste información útil para quien corrige el formulario. Explica la diferencia sin código y después reutiliza exactamente esta firma en el pipeline de dos campos y en el You Do.',
        starterCode: {
          language: 'python',
          title: 'safe_int.py',
          code: `# CASO-LIM-002 · T1-B-E2
# Implementa safe_int: vacío tras strip → error; int OK → (True, n, None);
# ValueError → (False, None, msg accionable con nombre de campo).
def safe_int(campo: str, valor: str):
    texto = valor.strip()
    # 1) si texto == "" → (False, None, mensaje de vacío)
    # 2) try int(texto) → (True, n, None)
    # 3) except ValueError → (False, None, mensaje con valor!r)
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
        return (False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int")

for v in [" 21 ", "", "abc", "  "]:
    print(repr(v), "→", safe_int("edad", v))`,
          output: `' 21 ' → (True, 21, None)
'' → (False, None, "ERROR en 'edad': valor vacío")
'abc' → (False, None, "ERROR en 'edad': no se pudo convertir 'abc' a int")
'  ' → (False, None, "ERROR en 'edad': valor vacío")`,
        },
      },
      {
        subtopicId: 'S02-T1-B',
        kind: 'transfer',
        title: 'Pipeline de dos enteros con raw/errors',
        preamble:
          '- **Contexto:** un registro real tiene varios campos; uno puede fallar y el otro seguir OK.\n- **Meta:** armar dict `raw` / `clean` / `errors` reutilizando `safe_int` dos veces.\n- **Éxito:** tres escenarios impresos — ambos OK; edad inválida; anios inválidos — con raw intacto.\n- **Límites:** solo enteros (sin float/Decimal aún); raw siempre con los strings de entrada.',
        id: 'S02-T1-B-E3',
        instruction:
          '1. Implementa `pipeline(edad_txt, anios_txt)`.\n2. Llama `safe_int` para `"edad"` y `"anios_cliente"`; acumula errores.\n3. Si falla, `clean[campo] = None` pero `raw` conserva el texto.\n4. Ejecuta los tres `print` del starter.',
        hint: 'Reutiliza safe_int dos veces. Acumula mensajes en errors[]. clean[campo] = None si falla, pero raw sigue con el string de entrada.',
        hints: [
          'Llama safe_int("edad", ...) y safe_int("anios_cliente", ...); no uses float ni Decimal aquí.',
          'clean["edad"] = None si falla, pero raw["edad"] sigue siendo el string de entrada.',
        ],
        edgeCases: ['un campo falla otro ok', 'raw siempre presente'],
        tests: 'Contrato: 3 escenarios; raw intacto; ambos campos int cuando OK; cero float/Decimal.',
        feedback:
          'Este es el embrión del `parse_client` del You Do: multi-campo, errores parciales, raw intacto. Si un campo falla, no pises `raw` al dejar clean en `None`. Decimal para montos se entrena en T3-B.',
        retrospective:
          'Errores parciales + raw intacto es el embrión de `parse_client`: un campo defectuoso no borra el éxito del vecino. Si edad falla y años del cliente pasa, señala en el resultado dónde viven ambos hechos. No “arregles” nada pisando el original. En T3-B aplicarás el mismo patrón `(ok, valor, error)` a montos con `Decimal`.',
        starterCode: {
          language: 'python',
          title: 'pipeline_dos_campos.py',
          code: `# CASO-LIM-002 · T1-B-E3
# Pipeline de dos enteros (edad + anios_cliente). Sin Decimal aún.

def safe_int(campo: str, valor: str):
    texto = valor.strip()
    if texto == "":
        return (False, None, f"ERROR en '{campo}': valor vacío")
    try:
        return (True, int(texto), None)
    except ValueError:
        return (False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int")

def pipeline(edad_txt: str, anios_txt: str) -> dict:
    # Completa: raw, clean, errors con safe_int para ambos campos
    pass

print(pipeline(" 28 ", "3"))
print(pipeline("xx", "5"))
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
        return (False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int")

def pipeline(edad_txt: str, anios_txt: str) -> dict:
    errors: list[str] = []
    clean: dict = {}
    ok, val, msg = safe_int("edad", edad_txt)
    clean["edad"] = val if ok else None
    if not ok:
        errors.append(msg)
    ok, val, msg = safe_int("anios_cliente", anios_txt)
    clean["anios_cliente"] = val if ok else None
    if not ok:
        errors.append(msg)
    return {
        "raw": {"edad": edad_txt, "anios_cliente": anios_txt},
        "clean": clean,
        "errors": errors,
    }

print(pipeline(" 28 ", "3"))
print(pipeline("xx", "5"))
print(pipeline("30", "nope"))`,
          output: `{'raw': {'edad': ' 28 ', 'anios_cliente': '3'}, 'clean': {'edad': 28, 'anios_cliente': 3}, 'errors': []}
{'raw': {'edad': 'xx', 'anios_cliente': '5'}, 'clean': {'edad': None, 'anios_cliente': 5}, 'errors': ["ERROR en 'edad': no se pudo convertir 'xx' a int"]}
{'raw': {'edad': '30', 'anios_cliente': 'nope'}, 'clean': {'edad': 30, 'anios_cliente': None}, 'errors': ["ERROR en 'anios_cliente': no se pudo convertir 'nope' a int"]}`,
        },
      },
      // ——— S02-T2-A ———
      {
        subtopicId: 'S02-T2-A',
        kind: 'guided',
        title: 'Renombrar cinco variables a PEP 8',
        preamble:
          '- **Contexto:** el schema de intake se lee en code review: nombres feos retrasan merges.\n- **Meta:** pasar de CamelCase / abreviaturas / `l` a `snake_case` y `UPPER_CASE`.\n- **Éxito:** el `print` final corre con `nombre_cliente`, `apellido_paterno`, `indice`, `longitud`, `EDAD_MAXIMA` y valores sintéticos dados.\n- **Límites:** sin `l`/`O`/`I` sueltos; constante de tope en `UPPER_CASE`.',
        id: 'S02-T2-A-E1',
        instruction:
          '1. Sustituye cada `____` por el nombre PEP 8 correcto.\n2. Asigna los valores sintéticos del starter.\n3. Ejecuta el `print` (debe listar los cinco sin `NameError`).',
        hint: 'snake_case para vars; UPPER_CASE para la constante de tope de edad.',
        hints: [
          'snake_case para vars; UPPER_CASE para la constante de tope de edad.',
          'Evita l/O/I: usa longitud, indice. apellido_paterno en lugar de AP.',
        ],
        edgeCases: ['evitar l/O/I', 'constantes en UPPER_CASE'],
        tests: 'pasa estilo: 5 nombres PEP 8; sin l/O/I sueltos.',
        feedback:
          'Si el `print` listó los cinco sin `NameError`, los identificadores coinciden con el contrato del starter. `EDAD_MAXIMA` en mayúsculas marca tope de negocio; `l`/`O`/`I` quedan fuera a propósito.',
        retrospective:
          '`snake_case` distingue variables y `UPPER_CASE` anuncia constantes. Evitar `l`/`O`/`I` reduce una ambigüedad visual real, no solo una falta de estilo. Si apareció `NameError`, rastrea el nombre desde su asignación hasta el `print`: probablemente corregiste una aparición y no la otra. Siguiente: cazar `=` donde iba `==`.',
        starterCode: {
          language: 'python',
          title: 'snake_case_checklist.py',
          code: `# CASO-LIM-002 · T2-A-E1
# Antes (malo): NombreCliente, AP, x, l, EdadMaxima
# Después (bueno): renombra a PEP 8 y asigna los valores sintéticos.
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
        subtopicId: 'S02-T2-A',
        kind: 'independent',
        title: 'Corregir `=` por `==` en tres `if`',
        preamble:
          '- **Contexto:** `if x = 1` es `SyntaxError` y el bug de novato más citado en review.\n- **Meta:** distinguir asignación de comparación en condicionales.\n- **Éxito:** el archivo corre e imprime exactamente tres líneas: `ok estado`, `ok codigo`, `ok flag`.\n- **Límites:** no uses `:=` (morsa); en S02 compara con `==` (o truthiness de `flag`).',
        id: 'S02-T2-A-E2',
        instruction:
          '1. Localiza las tres comparaciones rotas con `=`.\n2. Corrígelas para que sean comparaciones válidas.\n3. Ejecuta y confirma las tres líneas `ok`.',
        hint: 'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
        hints: [
          'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
          'Prefiere `if flag:` (PEP 8 desaconseja `if flag == True`). Aquí basta con corregir `=` → `==` en las tres comparaciones.',
        ],
        edgeCases: ['SyntaxError con if x = 1', 'confundir asignación con comparación'],
        tests: 'corre sin SyntaxError; tres prints ok.',
        feedback:
          'Detectar `=` vs `==` en revisión de código es habilidad de producción, no de examen de memoria. Preferir `if flag:` a `if flag == True` es estilo; el bug principal era la asignación en el `if`.',
        retrospective:
          '`=` guarda; `==` pregunta. Antes de ejecutar, lee cada `if` en voz alta: “¿estado *es igual a* activo?”; esa traducción revela el operador que necesitas. Si el archivo aún falla, usa la línea del `SyntaxError` como coordenada, no como veredicto. Preferir `if flag:` es estilo; distinguir asignación de comparación es el concepto. En E3 mapearás encabezados CSV a identificadores estables.',
        starterCode: {
          language: 'python',
          title: 'eq_vs_assign.py',
          code: `# CASO-LIM-002 · T2-A-E2
# Bug hunt: tres comparaciones usan = en lugar de ==.
# Corrígelas para que el archivo corra e imprima tres líneas ok.
estado = "activo"
codigo = 10
flag = True

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
if flag:
    print("ok flag")`,
          output: `ok estado
ok codigo
ok flag`,
        },
      },
      {
        subtopicId: 'S02-T2-A',
        kind: 'transfer',
        title: 'Mapear encabezados CSV a snake_case',
        preamble:
          '- **Contexto:** un CSV de intake llega con encabezados con espacios y tildes.\n- **Meta:** proponer nombres Python estables (`apellido_paterno` / `apellido_materno` incluidos).\n- **Éxito:** dict con 6 claves; cada encabezado imprime su `snake_case` (sin `???`). Preferido: teléfono → `contacto`, dirección → `direccion` (alineado al schema del You Do).\n- **Límites:** identificadores sin espacios ni tildes; no inventes sinónimos si ya hay nombre de schema.',
        id: 'S02-T2-A-E3',
        instruction:
          '1. Completa `mapeo` original → snake_case para los seis encabezados.\n2. Incluye `apellido_paterno` y `apellido_materno`; usa `contacto` y `direccion` para teléfono y dirección.\n3. Ejecuta el `for` de impresión del mapeo.',
        hint: 'Minúsculas, guiones bajos, sin espacios ni tildes en el identificador Python.',
        hints: [
          'Minúsculas, guiones bajos, sin espacios ni tildes en el identificador Python.',
          'Ejemplos: "Apellido Paterno" → apellido_paterno; "Teléfono / Cel" → contacto; "Dirección" → direccion.',
        ],
        edgeCases: ['apellido_paterno', 'sin espacios en identificadores'],
        tests: 'rúbrica de nombres: 6 claves; snake_case; incluye apellido_paterno y apellido_materno.',
        feedback:
          'Renombrar columnas es el primer `commit` de un pipeline real. La consistencia gana a la creatividad: `contacto` y `direccion` ya son el contrato del schema de intake.',
        retrospective:
          'Renombrar columnas es una promesa para todo el pipeline: el mismo concepto conservará el mismo identificador. Si inventaste `telefono_cliente` cuando el contrato ya dice `contacto`, tu nombre puede ser razonable y aun así romper la integración. Los apellidos son campos de texto, no parentesco real. Lleva este mapeo estable al schema del You Do.',
        starterCode: {
          language: 'python',
          title: 'schema_intake_nombres.py',
          code: `# CASO-LIM-002 · T2-A-E3
# Completa el dict mapeo: encabezado original → nombre snake_case.
encabezados = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Teléfono / Cel",
    "Dirección",
    "Edad (años)",
]

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
        subtopicId: 'S02-T2-B',
        kind: 'guided',
        title: 'Tabla `is` vs `==` (cinco predicciones)',
        preamble:
          '- **Contexto:** en el parser usarás `is None` y evitarás `is` para igualdad numérica.\n- **Meta:** contrastar identidad y valor con cinco expresiones.\n- **Éxito:** resultados `True`, `True`, `False`, `True`, `False` en ese orden, más un comentario de cuándo usar cada operador.\n- **Límites:** no “arregles” con conversiones; evalúa las expresiones tal cual.',
        id: 'S02-T2-B-E1',
        instruction:
          '1. Completa cada `____` con la expresión correspondiente.\n2. Ejecuta y verifica la tabla de bools.\n3. Escribe un comentario de una línea: cuándo `is` vs cuándo `==`.',
        hint: 'Listas nuevas no son el mismo objeto: [] is [] es False. Usa is para None.',
        hints: [
          'Listas nuevas no son el mismo objeto: [] is [] es False. Usa is para None.',
          '1 == True es True (bool subtipo int), pero 1 is True es False: no uses is para igualdad numérica.',
        ],
        edgeCases: ['is None idiom', '[] is [] es False'],
        tests: 'La tabla de cinco predicciones coincide exactamente con la salida de referencia.',
        feedback:
          '`None is None` y `[] is []` no se “sienten” igual: listas nuevas son objetos distintos. `1 == True` no autoriza `1 is True`. Si los cinco resultados coinciden con la referencia y puedes explicarlos, ya separas identidad de valor.',
        retrospective:
          '`is` pregunta por identidad; `==`, por valor. Dos listas vacías cuentan la misma historia y, sin embargo, son objetos distintos. Si `1 == True` te tienta a usar `is` con números, vuelve a la pregunta original: ¿comparas contenido o el objeto único `None`? Siguiente: convertir esa distinción en una copia sin alias.',
        starterCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `# CASO-LIM-002 · T2-B-E1
# Completa cada expresión y un comentario: cuándo usar is vs ==.
print("None is None →", ____)
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
        subtopicId: 'S02-T2-B',
        kind: 'independent',
        title: 'Copiar lista y mutar sin alias',
        preamble:
          '- **Contexto:** si `trabajo = original` y haces `append`, corrompes la fuente.\n- **Meta:** crear una copia superficial y demostrar independencia.\n- **Éxito:** `original == ["a", "b"]`, `trabajo == ["a", "b", "c"]`, `original is trabajo` → `False`.\n- **Límites:** usa `.copy()` o slice `[:]`; la lista es solo preview de mutabilidad (colecciones a fondo después).',
        id: 'S02-T2-B-E2',
        instruction:
          '1. Asigna `trabajo` como copia de `original`.\n2. Haz `append("c")` solo en `trabajo`.\n3. Imprime ambas listas y si son el mismo objeto.',
        hint: 'trabajo = original.copy()  o  trabajo = original[:]',
        hints: [
          'trabajo = original.copy()  o  trabajo = original[:]',
          'Si haces trabajo = original, append mutará ambos. Verifica con print y con `original is trabajo` → False.',
        ],
        edgeCases: ['slice vs assign', 'alias accidental'],
        tests: 'assert original == ["a", "b"] and trabajo == ["a", "b", "c"]',
        feedback:
          'Romper el alias antes de mutar es el hábito de no corromper la fuente de datos original. Si `original is trabajo` es `False` y solo `trabajo` tiene `"c"`, la copia superficial cumplió.',
        retrospective:
          'Romper el alias antes de mutar protege la fuente. Comprueba dos cosas distintas: `original is trabajo` debe ser `False`, mientras el contenido inicial puede ser igual. Si ambas listas cambiaron, no “deshagas” el `append`; corrige la flecha creada por la asignación. En E3 aplicarás la misma separación a valores `*_raw` y limpios.',
        starterCode: {
          language: 'python',
          title: 'romper_alias.py',
          code: `# CASO-LIM-002 · T2-B-E2
# Crea trabajo como copia (no alias), muta y verifica original intacto.
# (Lista solo como preview mínimo de mutabilidad — colecciones a fondo después.)
original = ["a", "b"]
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
        subtopicId: 'S02-T2-B',
        kind: 'transfer',
        title: 'Dict raw/clean que sobrevive a mutar',
        preamble:
          '- **Contexto:** auditoría de intake exige el texto original aunque el clean se normalice.\n- **Meta:** `make_record` con `*_raw` y campos strip; luego mutar clean sin tocar raw.\n- **Éxito:** asserts de raw intacto tras `.upper()` en clean; print final `raw preserved OK`.\n- **Límites:** no reutilices el mismo nombre para raw y clean; Unicode (María) debe sobrevivir.',
        id: 'S02-T2-B-E3',
        instruction:
          '1. Implementa `make_record` devolviendo las cuatro claves.\n2. Corre el bloque que muta `rec["nombres"]`.\n3. Confirma que los asserts de raw pasan.',
        hint: 'Guarda el string original en *_raw antes de strip. No reutilices el mismo nombre para ambos.',
        hints: [
          'Guarda el string original en *_raw antes de strip. No reutilices el mismo nombre para ambos.',
          'Tras upper() en clean, assert rec["nombres_raw"] == entrada_original.',
        ],
        edgeCases: ['no perder raw en fail', 'Unicode en raw (María)'],
        tests: 'assert raw keys; clean puede cambiar; raw idéntico al input.',
        feedback:
          'Tras `.upper()` en clean, si `nombres_raw` sigue con espacios y tildes, el assert de auditoría pasó. No hace falta mutar el string original: `str` es inmutable; el riesgo real es reutilizar el mismo nombre o clave.',
        retrospective:
          'El contrato raw/clean permite responder dos preguntas a la vez: “¿qué recibimos?” y “¿qué usaremos?”. Si solo puedes contestar la segunda, perdiste trazabilidad. El assert no celebra un truco de sintaxis: demuestra que normalizar no reescribe la evidencia. Este par de respuestas será central en el You Do y en el gate CP-N1-A.',
        starterCode: {
          language: 'python',
          title: 'raw_clean_record.py',
          code: `# CASO-LIM-002 · T2-B-E3
# Devuelve dict con *_raw y campos limpios (strip). Luego el test muta clean.
def make_record(nombres: str, contacto: str) -> dict:
    # Completa: nombres_raw, contacto_raw, nombres, contacto
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
        subtopicId: 'S02-T3-A',
        kind: 'guided',
        title: 'Tabla `// % ** /` con enteros',
        preamble:
          '- **Contexto:** descomponer cantidades (cajas, cuotas) usa división entera y resto.\n- **Meta:** practicar `//`, `%`, `**` y `/` en Python 3.\n- **Éxito:** con `n=17`, `d=5` imprime `// 3`, `% 2`, `** 16`, `/ 3.4` y una nota de que `/` devuelve float.\n- **Límites:** sin imports; no redondees a mano el `/`.',
        id: 'S02-T3-A-E1',
        instruction:
          '1. Completa los cuatro operadores en los `print`.\n2. Añade un `print` de nota sobre por qué `/` es float.\n3. Ejecuta y compara con la solución.',
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
          'Con `n=17`, `d=5`: `//` 3, `%` 2, `**` 16, `/` 3.4. En Python 3 el `/` no trunca. Si la nota menciona float, ya no confundes división entera con real.',
        retrospective:
          'En Python 3, `/` produce `float`; `//` y `%` responden preguntas distintas sobre una división entera. Recompón `17` como `3 * 5 + 2`: así explicas cociente y resto sin memorizar símbolos. En negativos, `//` va hacia −∞, no hacia cero. Siguiente: otra regla que conviene demostrar, `-3**2`.',
        starterCode: {
          language: 'python',
          title: 'tabla_operadores.py',
          code: `# CASO-LIM-002 · T3-A-E1
# Imprime n//d, n%d, 2**4 y n/d. Explica en un print por qué / devuelve float.
n = 17
d = 5
print("//", ____)
print("%", ____)
print("**", ____)
print("/", ____)
print("nota: ____")
`,
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
        subtopicId: 'S02-T3-A',
        kind: 'independent',
        title: 'Precedencia de `-3**2` vs `(-3)**2`',
        preamble:
          '- **Contexto:** una línea de scoring o fórmula con signo y potencia rompe silenciosamente.\n- **Meta:** demostrar la precedencia de `**` sobre el unario `-`.\n- **Éxito:** prints muestran `-9` y `9`; `cuadrado_neg == 9` y `assert OK`.\n- **Límites:** no uses `pow` con float; paréntesis obligatorios para el cuadrado del negativo.',
        id: 'S02-T3-A-E2',
        instruction:
          '1. Ejecuta mentalmente o imprime ambas formas de potencia.\n2. Asigna `cuadrado_neg = (-3)**2`.\n3. Deja el `assert` y confirma `assert OK`.',
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
          'Esta es la pregunta de entrevista junior de precedencia. Si la internalizaste, evitas bugs en fórmulas de scoring donde el signo “desaparece” del cuadrado.',
        retrospective:
          '`-3**2` es `-(3**2)`, no `(-3)**2`. Si predijiste `9`, tu intuición leyó “cuadrado de menos tres”, pero el código dijo “menos el cuadrado de tres”. Los paréntesis reconcilian intención y ejecución. En E3 usarás la misma disciplina para que una tasa no dependa de la memoria del lector.',
        starterCode: {
          language: 'python',
          title: 'precedencia_potencia.py',
          code: `# CASO-LIM-002 · T3-A-E2
# Demuestra la trampa de precedencia y asigna cuadrado_neg = 9.
print("sin paréntesis:", -3**2)
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
        subtopicId: 'S02-T3-A',
        kind: 'transfer',
        title: 'Subtotal e IGV 18% con paréntesis',
        preamble:
          '- **Contexto:** ticket sintético de dos líneas; aquí entrenas la *expresión*, no dinero de producción.\n- **Meta:** `subtotal` y `total = subtotal * (1 + 0.18)` con paréntesis explícitos en la tasa.\n- **Éxito:** `subtotal` 80; `total` igual a `80*(1+0.18)` (puede mostrar basura float — es esperado).\n- **Límites:** no uses `Decimal` aún; documenta que T3-B corrige la precisión.',
        id: 'S02-T3-A-E3',
        instruction:
          '1. Suma las dos líneas en `subtotal`.\n2. Calcula `total` multiplicando por `(1 + 0.18)`.\n3. Imprime ambos; no “arregles” el float con `round` todavía.',
        hint: 'subtotal primero; luego multiplica por (1 + 0.18), no 1 + 0.18 * subtotal sin revisar.',
        hints: [
          'subtotal primero; luego multiplica por (1 + 0.18), no 1 + 0.18 * subtotal sin revisar.',
          'Con base 80, total float es 94.3999… — es la motivación de Decimal. Si usas base 100, total=118.0 limpio.',
        ],
        edgeCases: ['18% = 0.18', 'float puede mostrar basura; documentar y migrar a Decimal'],
        tests: 'subtotal==80; total == 80*(1+0.18); expresión usa paréntesis en (1+0.18)',
        feedback:
          'La expresión correcta es el 50% del trabajo; el otro 50% es no usar float en producción de montos (T3-B). Si viste basura en el print, no la “arregles” con `round` aquí: es la motivación de Decimal.',
        retrospective:
          'La expresión correcta es la mitad del trabajo; la representación numérica es la otra. Si viste `94.3999…`, no tapes el síntoma con `round`: explica primero que el valor nació como aproximación binaria. Autochequeo: ¿qué cambiarías —la fórmula o el tipo— si el monto debe persistirse? T3-B responde con `Decimal`.',
        starterCode: {
          language: 'python',
          title: 'precio_igv_expr.py',
          code: `# CASO-LIM-002 · T3-A-E3
# Calcula subtotal y total con IGV 18% y paréntesis explícitos.
linea_a = 50
linea_b = 30
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
        subtopicId: 'S02-T3-B',
        kind: 'guided',
        title: 'Contrastar float y `Decimal("0.1")`',
        preamble:
          '- **Contexto:** en equipos financieros de distintos países, la revisión de código rechaza `float` para monedas con céntimos.\n- **Meta:** observar la aproximación de `0.1+0.2` frente a `Decimal` desde `str`.\n- **Éxito:** prints de float y Decimal; assert de suma Decimal a `0.3` y `assert OK`.\n- **Límites:** `from decimal import Decimal`; **no** `Decimal(0.1)`.',
        id: 'S02-T3-B-E1',
        instruction:
          '1. Completa los dos `print` del starter.\n2. Deja el `assert` intacto.\n3. Ejecuta hasta ver `assert OK`.',
        hint: 'from decimal import Decimal. Construye Decimal desde strings, no desde 0.1 float.',
        hints: [
          'from decimal import Decimal. Construye Decimal desde strings, no desde 0.1 float.',
          'float imprime 0.30000000000000004; Decimal imprime 0.3.',
        ],
        edgeCases: ['from decimal import Decimal', 'no uses Decimal(0.1)'],
        tests: 'assert Decimal("0.1")+Decimal("0.2") == Decimal("0.3")',
        feedback:
          'Si viste la basura del float, ya tienes el argumento de code review para exigir Decimal en soles. `Decimal("0.1")` no es lo mismo que `Decimal(0.1)`.',
        retrospective:
          'Si viste `0.30000000000000004`, observaste una representación, no una “mala suma”. `Decimal` desde texto empieza en el sistema decimal que quisiste escribir; `Decimal(0.1)` importa la aproximación anterior. Explica esa cadena causal en una frase. Siguiente: convertir exactitud interna en céntimos persistibles con `quantize`.',
        starterCode: {
          language: 'python',
          title: 'float_vs_decimal.py',
          code: `# CASO-LIM-002 · T3-B-E1
# Imprime float 0.1+0.2 y Decimal("0.1")+Decimal("0.2"). Luego el assert.
from decimal import Decimal

print("float", ____)
print("Decimal", ____)
assert Decimal("0.1") + Decimal("0.2") == Decimal("0.3")
print("assert OK")
`,
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
        subtopicId: 'S02-T3-B',
        kind: 'independent',
        title: 'Propina 10% con `quantize` a céntimos',
        preamble:
          '- **Contexto:** ticket sintético de restaurante en soles; necesitas céntimos estables.\n- **Meta:** propina 10% y total con `ROUND_HALF_EVEN` y `quantize(0.01)`.\n- **Éxito:** `propina == Decimal("8.55")` y `total == Decimal("94.05")`, print `OK`.\n- **Límites:** sin `float`; multiplica por `Decimal("0.10")`; quantize en cada monto a persistir.',
        id: 'S02-T3-B-E2',
        instruction:
          '1. Calcula `propina` quantizada a dos decimales.\n2. Calcula `total` quantizado.\n3. Ejecuta asserts del starter.',
        hint: 'from decimal import Decimal, ROUND_HALF_EVEN. Multiplica por Decimal("0.10").',
        hints: [
          'from decimal import Decimal, ROUND_HALF_EVEN. Multiplica por Decimal("0.10").',
          'propina = (cuenta * Decimal("0.10")).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN); total = (cuenta + propina).quantize(...).',
        ],
        edgeCases: ['no float', 'quantize a 2 decimales', 'ROUND_HALF_EVEN'],
        tests: 'propina==Decimal("8.55"); total==Decimal("94.05")',
        feedback:
          '`8.55` y `94.05` con `ROUND_HALF_EVEN` demuestran céntimos estables sin `float`. Quantize en propina y en total, no solo “al final por suerte”.',
        retrospective:
          'Propina y total con dos decimales demuestran una política de redondeo, no un adorno visual. Si solo cuantizas el total, pregunta qué valor de propina guardarías o auditarías por separado. La regla debe aplicarse donde el monto adquiere significado persistible. E3 generaliza el patrón a texto incierto de CSV.',
        starterCode: {
          language: 'python',
          title: 'propina_soles.py',
          code: `# CASO-LIM-002 · T3-B-E2
# Calcula propina 10% y total con quantize a 0.01 (ROUND_HALF_EVEN). Sin float.
from decimal import Decimal, ROUND_HALF_EVEN

cuenta = Decimal("85.50")
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
        subtopicId: 'S02-T3-B',
        kind: 'transfer',
        title: '`parse_monto` con Decimal y errores',
        preamble:
          '- **Contexto:** el monto llega como texto de formulario (`"150.50"`); el parser no puede explotar.\n- **Meta:** `(ok, Decimal|None, error|None)` con strip, vacío, `InvalidOperation` y quantize `0.01`.\n- **Éxito:** cuatro casos del starter (OK, OK quantize `20.10`, vacío, `abc`) con mensajes accionables.\n- **Límites:** convención **punto** decimal (no coma); sin float; raw en el mensaje con `!r`.',
        id: 'S02-T3-B-E3',
        instruction:
          '1. Implementa `parse_monto`: strip → vacío → `Decimal` → `quantize(0.01)` → `except InvalidOperation`.\n2. Rechaza vacío antes de construir Decimal; mensaje con `!r` del raw.\n3. Ejecuta el `for` de cuatro strings y compara salidas.',
        hint: 'try/except InvalidOperation. raw en el mensaje con !r.',
        hints: [
          'try/except InvalidOperation. raw en el mensaje con !r.',
          'from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation. Si strip vacío → error antes de Decimal.',
        ],
        edgeCases: ['vacío', 'coma vs punto — documentar punto', 'quantize .01'],
        tests: 'OK 150.50; vacío y abc con error; sin float',
        feedback:
          'Este `parse_monto` se conecta al parser de intake cuando el CSV traiga un monto. Mismo contrato `(ok, valor, error)` que `safe_int`, con `InvalidOperation` en lugar de `ValueError`.',
        retrospective:
          'El contrato sigue siendo ok / valor / error; cambia la clase de fallo porque cambió el constructor. Si `""` y `"abc"` llegan al mismo `except`, pierdes la distinción entre ausencia y formato inválido: rechaza el vacío primero. Conecta este helper al intake cuando aparezca un monto y conserva el raw; no uses `float` como atajo.',
        starterCode: {
          language: 'python',
          title: 'parse_monto.py',
          code: `# CASO-LIM-002 · T3-B-E3
# parse_monto: strip, vacío, Decimal desde str, quantize 0.01, error accionable.
from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation

def parse_monto(texto: str):
    # Devuelve (ok, Decimal|None, error|None)
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
        subtopicId: 'S02-T4-A',
        kind: 'guided',
        title: 'Saludo con f-string y acento',
        preamble:
          '- **Contexto:** los prompts y mensajes del intake van en español claro, con Unicode.\n- **Meta:** interpolar un nombre con f-string (estilo preferido de S02).\n- **Éxito:** una línea exacta: `Hola, José. Bienvenido al intake.`\n- **Límites:** usa f-string (no concatenación con `+` como solución principal).',
        id: 'S02-T4-A-E1',
        instruction:
          '1. Construye `mensaje` interpolando `nombre`.\n2. Imprímelo.\n3. Verifica acento y texto completo.',
        hint: 'f"Hola, {nombre}. Bienvenido al intake."',
        hints: [
          'f"Hola, {nombre}. Bienvenido al intake."',
          'No concatenes con + salvo que practiques; f-string es el estilo S02.',
        ],
        edgeCases: ['acentos en str Unicode', 'f-string con llaves'],
        tests: 'stdout contiene José y intake',
        feedback:
          'Sin la `f` verías llaves literales; con ella el acento de José se interpola limpio en Unicode. El mensaje exacto del éxito evita “casi igual” en el reporte de intake.',
        retrospective:
          'Una f-string es texto con una ventana de evaluación entre llaves. Si olvidas la `f`, Python conserva la ventana como dibujo literal: `{nombre}`. Predice esa salida antes de probarla y corrige la causa, no el texto resultante. Siguiente: varias ventanas coordinadas en un reporte con monto `:.2f`.',
        starterCode: {
          language: 'python',
          title: 'saludo_fstring.py',
          code: `# CASO-LIM-002 · T4-A-E1
# Construye mensaje con f-string (debe interpolar nombre) y luego imprímelo.
# Salida esperada: Hola, José. Bienvenido al intake.
nombre = "José"
mensaje = ____
print(mensaje)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'saludo_fstring.py',
          code: `nombre = "José"
mensaje = f"Hola, {nombre}. Bienvenido al intake."
print(mensaje)`,
          output: `Hola, José. Bienvenido al intake.`,
        },
      },
      {
        subtopicId: 'S02-T4-A',
        kind: 'independent',
        title: 'Reporte multi-línea con `S/ {monto:.2f}`',
        preamble:
          '- **Contexto:** el analista pega un resumen legible en el ticket de calidad.\n- **Meta:** cuatro f-strings (nombres, apellido_paterno, contacto, monto).\n- **Éxito:** salida con las 4 etiquetas y `monto: S/ 99.50` (dos decimales).\n- **Límites:** no conviertas `Decimal` a `float` solo para formatear; usa `:.2f`.',
        id: 'S02-T4-A-E2',
        instruction:
          '1. Completa los cuatro `print` como f-strings.\n2. Formatea el monto con `S/` y `:.2f`.\n3. Ejecuta y compara con la solución.',
        hint: 'Usa varios print(f"...") o un solo f-string multi-línea. :.2f formatea dos decimales.',
        hints: [
          'Usa varios print(f"...") o un solo f-string multi-línea. :.2f formatea dos decimales.',
          'Incluye las 4 etiquetas: nombres, apellido_paterno, contacto, monto.',
        ],
        edgeCases: [':.2f si monto', 'Decimal acepta formato .2f en f-string'],
        tests: 'salida con 4 campos; monto con 2 decimales (99.50)',
        feedback:
          'El reporte legible es lo que el analista pega en el ticket. El formato consistente gana a la creatividad; `S/ 99.50` con dos decimales fijos es el estándar de demo.',
        retrospective:
          'Formato consistente permite comparar reportes sin interpretar cada línea de nuevo. `Decimal` acepta `:.2f`; convertirlo a `float` para mostrarlo destruiría justamente la garantía ganada en T3-B. Si aparece `99.5`, el valor puede ser correcto y el contrato de presentación no. En E3 separarás esa presentación de la captura interactiva.',
        starterCode: {
          language: 'python',
          title: 'reporte_cliente.py',
          code: `# CASO-LIM-002 · T4-A-E2
# Construye el reporte multi-línea: cada print debe ser un f-string completo.
# Incluye las 4 etiquetas y monto con :.2f (salida: S/ 99.50).
from decimal import Decimal

nombres = "Ana"
apellido_paterno = "Ramos"
contacto = "999000111"
monto = Decimal("99.5")
print("Resumen cliente")
print(____)  # f-string: nombres
print(____)  # f-string: apellido_paterno
print(____)  # f-string: contacto
print(____)  # f-string: monto S/ con :.2f`,
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
        subtopicId: 'S02-T4-A',
        kind: 'transfer',
        title: 'Simular prompts sin `input()` real',
        preamble:
          '- **Contexto:** en Pyodide/CI no hay consola interactiva confiable; los tests necesitan funciones puras.\n- **Meta:** `simular_intake(...)` devuelve campos str + subdict `types` con `__name__`.\n- **Éxito:** `types["edad"]` y `types["nombres"]` son `"str"`; print `OK`.\n- **Límites:** **no** llames `input()`; no conviertas tipos aún (eso es el parse).',
        id: 'S02-T4-A-E3',
        instruction:
          '1. Implementa el dict de retorno con campos y `types`.\n2. Usa `type(...).__name__` para cada campo (sin comprehensions si evitas complejidad).\n3. Corre asserts del starter.',
        hint: 'No uses input(). Los parámetros ya simulan las respuestas del usuario.',
        hints: [
          'No uses input(). Los parámetros ya simulan las respuestas del usuario.',
          'Construye types a mano: "nombres": type(nombres).__name__, etc. (sin comprehensions).',
        ],
        edgeCases: ['todo str', 'testeable sin consola interactiva'],
        tests: 'la función recibe parámetros con valores; todos los tipos son str.',
        feedback:
          'Si el intake es una función pura de str→dict, los tests del parser (T4-B) son triviales de automatizar. `types["edad"] == "str"` aunque el usuario “escribió un número”.',
        retrospective:
          'Una función `str → dict` pura convierte una conversación con el teclado en datos reproducibles. Si `types["edad"]` no es `"str"`, probablemente adelantaste una conversión y mezclaste captura con parse. Conserva la frontera: primero recibe, luego interpreta, después reporta. T4-B hará visible cualquier fallo de interpretación.',
        starterCode: {
          language: 'python',
          title: 'simular_intake.py',
          code: `# CASO-LIM-002 · T4-A-E3
# No llames input(). Devuelve campos + types (type(...).__name__ de cada uno).
def simular_intake(nombres: str, contacto: str, edad: str) -> dict:
    # Completa: dict con nombres, contacto, edad y subdict types
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
    return {
        "nombres": nombres,
        "contacto": contacto,
        "edad": edad,
        "types": {
            "nombres": type(nombres).__name__,
            "contacto": type(contacto).__name__,
            "edad": type(edad).__name__,
        },
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
        subtopicId: 'S02-T4-B',
        kind: 'guided',
        title: 'Parse de nombres vacíos con raw/errors',
        preamble:
          '- **Contexto:** el caso vacío es el primero que rompe demos “felices” de intake.\n- **Meta:** `parse_nombres` con `nombres_raw`, clean o `None`, y `errors` accionable.\n- **Éxito:** con `""` → raw `""`, `nombres is None`, errors menciona nombres; print `OK`.\n- **Límites:** guarda raw **antes** de strip; no borres el original.',
        id: 'S02-T4-B-E1',
        instruction:
          '1. Completa `parse_nombres`.\n2. Si vacío tras strip, agrega error y deja clean en `None`.\n3. Ejecuta asserts del starter.',
        hint: 'Siempre guarda raw = valor original antes de strip.',
        hints: [
          'Siempre guarda raw = valor original antes de strip.',
          "errors.append(f\"ERROR en 'nombres': vacío (raw={valor!r})\")",
        ],
        edgeCases: ['mensaje accionable', "raw '' se conserva"],
        tests: 'caso vacío: raw==""; errors no vacío; nombres is None',
        feedback:
          'El caso vacío es el primero que rompe demos “felices”. Si pasa el assert, el contrato raw/errors ya nació: clean puede ser `None` sin borrar el original.',
        retrospective:
          'Raw siempre está, aunque clean sea `None`: un fallo de interpretación no borra el hecho observado. Si tu mensaje solo dice “inválido”, quien corrige el dato aún no sabe qué campo ni qué llegó; `!r` vuelve visibles incluso los espacios. Este microcontrato se repetirá en todos los campos requeridos del You Do.',
        starterCode: {
          language: 'python',
          title: 'parse_vacio.py',
          code: `# CASO-LIM-002 · T4-B-E1
# Completa parse_nombres: nombres_raw, nombres (strip o None), errors.
def parse_nombres(valor: str) -> dict:
    # Si vacío tras strip → error accionable; raw siempre = valor original
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
        subtopicId: 'S02-T4-B',
        kind: 'independent',
        title: 'Conservar raw Unicode (`Ñahui`)',
        preamble:
          '- **Contexto:** apellidos peruanos con ñ y tildes no pueden “romperse” a ASCII en el pipeline.\n- **Meta:** separar raw (con espacios) y clean (`strip`) sin perder Unicode.\n- **Éxito:** `raw == original`, `clean == "Ñahui"`, print `Unicode OK`.\n- **Límites:** no encodes a ASCII; no mutes el string original (son inmutables de todos modos).',
        id: 'S02-T4-B-E2',
        instruction:
          '1. Asigna `raw` al original (con espacios).\n2. Asigna `clean` con `strip` (sin tocar codificación).\n3. Corre los asserts: raw idéntico al original; clean es `"Ñahui"`.',
        hint: 'No encodes a ascii. Python 3 str es Unicode.',
        hints: [
          'No encodes a ascii. Python 3 str es Unicode.',
          'raw = original; clean = original.strip(); assert raw == original.',
        ],
        edgeCases: ['no ascii errors', 'Ñ y acentos'],
        tests: 'caso unicode: raw con espacios; clean == "Ñahui"',
        feedback:
          'Si `Ñahui` sobrevive con ñ intacta, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos; no hace falta `encode`/`decode` aquí.',
        retrospective:
          'Unicode no es un caso ornamental: nombres, direcciones y ciudades reales exceden ASCII en muchos idiomas. Si `Ñahui` cambia, no “simplifiques” el dato para que pase; elimina la conversión destructiva. Raw con espacios y clean con `strip` conservan dos hechos distintos. Siguiente: probar esa garantía dentro del cliente completo.',
        starterCode: {
          language: 'python',
          title: 'parse_unicode.py',
          code: `# CASO-LIM-002 · T4-B-E2
# Conserva raw con espacios; clean con strip. Unicode debe sobrevivir.
original = "  Ñahui  "
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
        subtopicId: 'S02-T4-B',
        kind: 'transfer',
        title: 'Suite `parse_client`: Unicode, vacío, edad',
        preamble:
          '- **Contexto:** este ejercicio es el corazón del You Do (CP-N1-A) en miniatura.\n- **Meta:** `safe_int` + `parse_client` con `*_raw`, limpios y `errors`.\n- **Éxito:** tres asserts pasan — Ñahui raw OK y sin errors; nombres vacío con error; edad `"abc"` con `edad_raw` intacto — y print `3 tests OK`.\n- **Límites:** no dejes escapar `ValueError`; raw siempre presente; solo datos sintéticos.',
        id: 'S02-T4-B-E3',
        instruction:
          '1. Implementa `safe_int` (vacío / OK / basura) con el contrato de la sección.\n2. Implementa `parse_client`: todas las claves `*_raw`, limpios, `edad`, `errors`; edad opcional con `safe_int`.\n3. No modifiques los tres bloques de assert; ejecuta hasta `3 tests OK`.',
        hint: 'Reutiliza el patrón de la demo T4-B. No dejes que ValueError se escape.',
        hints: [
          'Reutiliza el patrón de la demo T4-B. No dejes que ValueError se escape.',
          'assert r["edad_raw"]=="abc" y any("edad" in e.lower() for e in errors). raw siempre presente.',
        ],
        edgeCases: ['raw conservado', '3 pruebas pasan', 'lista de errores'],
        tests: '3 pruebas pasan (unicode, vacío, edad inválida)',
        feedback:
          'Esta suite es el corazón del You Do en miniatura. Si pasa en local y en Pyodide, el incremento CP-N1-A de S02 está listo para el portafolio — pero el You Do aún pide `mostrar_resumen`, `main` y un cuarto caso.',
        retrospective:
          'Una suite verde demuestra invariantes concretas: Unicode sobrevive, vacío se explica y número inválido no derriba el proceso. Nombra qué assert protege cada una; “tres tests OK” sin esa correspondencia es solo una luz verde. El You Do añade `mostrar_resumen`, `main` y un **cuarto** caso de edad en blanco: úsalo para demostrar transferencia, no para copiar esta miniatura.',
        starterCode: {
          language: 'python',
          title: 'parse_client_suite.py',
          code: `# CASO-LIM-002 · T4-B-E3
# Implementa safe_int (vacío + strip + int) y parse_client con el esquema completo.
# Claves del dict: nombres_raw, apellido_paterno_raw, apellido_materno_raw,
# contacto_raw, direccion_raw, edad_raw, nombres, apellido_paterno,
# apellido_materno, contacto, direccion, edad, errors.
# Completa ambas funciones antes de ejecutar los tres bloques de prueba.
def safe_int(campo: str, valor: str):
    # vacío tras strip → error; int OK; ValueError → mensaje accionable
    pass

def parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None):
    # *_raw, limpios, errors; edad opcional con safe_int
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
    texto = valor.strip()
    if texto == "":
        return False, None, f"ERROR en '{campo}': valor vacío"
    try:
        return True, int(texto), None
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
      'Hasta aquí resolviste piezas aisladas; ahora deben colaborar sin perder sus contratos. Imagina que el mismo formulario se usa en una oficina, una tableta y un proceso por lotes: la interfaz cambia, pero el parser debe conservar el original, normalizar con cuidado y explicar cada fallo del mismo modo. En este incremento del capstone CP-N1-A construirás el **esqueleto de un parser de intake** para un cliente sintético. Antes de programar, dibuja tres columnas —`raw`, `clean`, `errors`— y sigue por ellas un caso feliz, uno vacío y una edad inválida. Solo después implementa `safe_int`, `parse_client` y `mostrar_resumen`. Éxito operativo: `_run_tests()` imprime `tests OK` y `main()` muestra un resumen; los asserts fijos no se modifican y nunca se usa PII real.',
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
      'safe_int trata vacío (tras strip) y ValueError con mensaje por campo',
      'Suite de tests (pytest o asserts) documentada y reproducible',
      'Sin PII real; datos sintéticos (example.com si hay email)',
      'Incluye una función `main()` y el guard `if __name__ == "__main__"`',
    ],
    starterCode: `"""parse_client_intake.py — incremento CP-N1-A
Datos sintéticos únicamente. No uses información real de clientes.

Tu trabajo: implementar safe_int, parse_client y mostrar_resumen.
Los asserts de _run_tests no se modifican: deben pasar con tu código.
Pistas: reutiliza el patrón de la demo T4-B y del E3 de T4-B (no copies
la solución a ciegas: diseña el dict, luego llena cada clave).
"""

from __future__ import annotations


def safe_int(campo: str, valor: str) -> tuple[bool, int | None, str | None]:
    """Convierte a int con strip. Devuelve (ok, valor|None, error|None).

    Contrato unificado de esta sección:
    - vacío tras strip → (False, None, "ERROR en '{campo}': valor vacío")
    - int OK → (True, n, None)
    - ValueError → (False, None, "ERROR en '{campo}': no se pudo convertir …")
    """
    # 1) texto = valor.strip()
    # 2) si texto == "" → error de vacío
    # 3) try int(texto) / except ValueError → mensaje con valor!r
    raise NotImplementedError


def parse_client(
    nombres: str,
    apellido_paterno: str,
    apellido_materno: str,
    contacto: str,
    direccion: str,
    edad: str | None = None,
) -> dict:
    """Parsea un registro de intake: *_raw, limpios, errors.

    Claves esperadas (todas deben existir en el dict devuelto):
    nombres_raw, apellido_paterno_raw, apellido_materno_raw,
    contacto_raw, direccion_raw, edad_raw,
    nombres, apellido_paterno, apellido_materno, contacto, direccion, edad,
    errors (list[str]).

    Orden sugerido:
    1) crea errors = [] y rec con todas las claves *_raw = argumentos
    2) limpia campos requeridos (strip; vacío → error + None en clean)
    3) si edad is not None, usa safe_int y rellena rec["edad"] o errors
    """
    raise NotImplementedError


def mostrar_resumen(resultado: dict) -> None:
    """Imprime un resumen legible con f-strings (raw/clean/errors)."""
    # Ejemplo de forma (ajusta etiquetas): print(f"nombres: {resultado['nombres']}")
    # Incluye apellidos, contacto, direccion, edad y la lista errors.
    raise NotImplementedError


def _run_tests() -> None:
    # Caso feliz + Unicode — errors debe estar vacío de verdad
    r = parse_client(
        "María José",
        "Quispe",
        "Ñahui",
        "999000111",
        "Av. Ejemplo 123, Lima",
        edad="34",
    )
    assert r["apellido_materno_raw"] == "Ñahui"
    assert r["apellido_materno"] == "Ñahui"
    assert r["errors"] == []

    # Vacío
    r2 = parse_client("", "Quispe", "Ñahui", "999", "Lima")
    assert any("nombres" in e.lower() or "vac" in e.lower() for e in r2["errors"])
    assert r2["nombres_raw"] == ""

    # Número inválido
    r3 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", edad="abc")
    assert r3["edad_raw"] == "abc"
    assert any("edad" in e.lower() for e in r3["errors"])

    # Edad vacía (contrato safe_int unificado)
    r4 = parse_client("Ana", "Ramos", "Díaz", "999", "Cusco", edad="  ")
    assert r4["edad_raw"] == "  "
    assert any("edad" in e.lower() for e in r4["errors"])

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
      'Este esqueleto no destaca por tener muchas líneas, sino por hacer promesas verificables: tipos explícitos, conversión segura, nombres PEP 8, `raw` preservado y errores accionables. Es tu primer artefacto de datos defendible en un portafolio. En una entrevista, no digas solo “hice un parser”: muestra un input problemático, señala el assert que lo contiene y explica por qué el original sobrevive. Extensiones como más campos, `Decimal` o lectura de CSV son valiosas únicamente si respetan el contrato raw/clean/errors. Súbelo a tu repositorio de práctica **sin datos reales**.',
    retrospective:
      'Antes de marcarlo listo, reconstruye el recorrido sin mirar la solución: entrada → raw → limpieza → conversión → error o valor → resumen. Después responde: (1) ¿qué invariante protege cada assert? (2) ¿qué dato conservarías para investigar un fallo sin exponer PII? (3) ¿qué pasaría si mañana agregas monto con `Decimal`? (4) ¿qué decisión explicarías en 30 segundos a otra persona? Si una respuesta depende de “porque el test lo pide”, vuelve al modelo mental. El README debe describir el problema, el contrato y una evidencia reproducible, no prometer impacto que aún no mediste.',
    rubric: [
      { criterion: 'Parse y tipos correctos (correctness)', weight: '30%' },
      { criterion: 'Vacíos / Unicode / inválidos cubiertos (robustness)', weight: '25%' },
      { criterion: 'Nombres y mensajes claros (maintainability)', weight: '25%' },
      { criterion: 'Datos sintéticos, sin PII, sin afirmaciones de parentesco (responsible_use)', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es el tipo de None en Python?',
        options: ['null', 'NoneType', 'void', 'str vacío'],
        correctIndex: 1,
        explanation:
          'None es la única instancia de `NoneType`; `null` y `void` pertenecen a otros lenguajes, y `""` sigue siendo un `str` presente aunque esté vacío. Para comprobar este objeto único de ausencia se usa `is None`.',
      },
      {
        question: '¿Qué imprime type("42").__name__ y la comparación 42 == "42"?',
        options: ["int y True", "str y True", "int y False", "str y False"],
        correctIndex: 3,
        explanation:
          '`"42"` es `str`; las comillas son parte de la pista. `42` es `int`, por eso la igualdad cruda es `False`. Si el dominio permite compararlos, convierte explícitamente uno de los dos antes de calcular o decidir.',
      },
      {
        question: '¿Por qué el teléfono de un cliente de intake se modela como str?',
        options: ['Porque no es una cantidad aritmética y puede necesitar ceros o formato', 'Porque int no existe en Python', 'Porque str es más rápido que int', 'Porque PEP 8 lo prohíbe como int'],
        correctIndex: 0,
        explanation:
          'Teléfonos, DNI y códigos identifican; no miden. Modelarlos como `int` invita a perder ceros iniciales y permite operaciones absurdas como sumarlos. La velocidad o PEP 8 no decide el tipo: lo decide la semántica.',
      },
      {
        question: 'Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?',
        options: ['1, 2 (lista original)', '3 (solo el nuevo)', '1, 2, 3 (ambos nombres ven el cambio)', 'Error'],
        correctIndex: 2,
        explanation:
          '`b = a` crea otro nombre para la misma lista, no una copia. Por eso `append` aparece al mirar desde ambos nombres. `copy()` o `[:]` crea una lista independiente cuando esa es la intención.',
      },
      {
        question: '¿Cuál es el idioma correcto para comprobar ausencia de valor?',
        options: ['if x == None:', 'if x is None:', 'if x === null:', 'if not x == None:'],
        correctIndex: 1,
        explanation:
          'PEP 8 recomienda `is None` / `is not None` porque se comprueba la identidad del único objeto `None`. `=== null` no es sintaxis de Python; las formas con `== None` pueden parecer funcionar, pero expresan la pregunta equivocada.',
      },
      {
        question: '¿Qué imprime la expresión -3**2 en Python?',
        options: ['9', 'Error', '6', '-9'],
        correctIndex: 3,
        explanation:
          '`**` tiene mayor precedencia que el menos unario: Python lee `-(3**2)`, obtiene `9` y aplica el signo, así que resulta `-9`. Para expresar “el cuadrado de menos tres”, escribe `(-3)**2`.',
      },
      {
        question: '¿Cuál es la forma correcta de construir dinero en soles con Decimal?',
        options: ['Decimal("0.1")', 'Decimal(0.1)', 'float("0.1")', 'round(0.1, 2) como tipo Decimal'],
        correctIndex: 0,
        explanation:
          '`Decimal("0.1")` parte del texto decimal exacto. `Decimal(0.1)` recibe una aproximación binaria ya creada, mientras `float` y `round` no cambian el tipo monetario. Después usa `quantize(Decimal("0.01"))` para fijar céntimos.',
      },
      {
        question: '¿Qué tipo devuelve siempre input()?',
        options: ['int si escribiste dígitos', 'float', 'str siempre', 'None'],
        correctIndex: 2,
        explanation:
          '`input()` devuelve `str` aunque la persona escriba dígitos. La apariencia no cambia el tipo: primero capturas texto y después decides si corresponde convertirlo con `int` o `Decimal`.',
      },
      {
        question: 'En el parser de intake, si edad="abc", ¿qué debe ocurrir?',
        options: ['El programa termina con traceback no capturado', 'errors lista el campo; edad_raw sigue siendo "abc"', 'Se borra edad_raw para ocultar el fallo', 'Se convierte silenciosamente a 0'],
        correctIndex: 1,
        explanation:
          'El contrato conserva `edad_raw == "abc"` y agrega un error que nombra el campo; así el proceso continúa y el fallo se puede investigar. Terminar con traceback, borrar el raw o inventar `0` destruye información.',
      },
      {
        question: 'Tras `raw = "  Ñahui  "` y `clean = raw.strip()`, ¿qué debe cumplirse?',
        options: ['raw y clean son el mismo objeto en memoria', 'raw pierde los espacios porque strip muta el string', 'clean es None porque había espacios', 'raw conserva los espacios; clean es "Ñahui" y es otro str'],
        correctIndex: 3,
        explanation:
          '`str` es inmutable: `strip` devuelve otro string y no altera el original. Por eso raw conserva los espacios mientras clean vale `"Ñahui"`; confundir ambos borraría evidencia útil para auditoría.',
      },
      {
        question: 'Si monto es Decimal("99.5"), ¿qué imprime f"S/ {monto:.2f}"?',
        options: ['S/ 99.50', 'S/ 99.5', 'S/ 100', 'Error: Decimal no admite :.2f'],
        correctIndex: 0,
        explanation:
          'El especificador `:.2f` muestra dos decimales, por eso aparece `S/ 99.50`. `Decimal` admite ese formato directamente: convertir a `float` sería innecesario y reintroduciría la representación que evitaste en T3-B.',
      },
    ],
  },
  topicEvaluations: [
    {
      id: 'S02-T1-TE',
      topic_id: 'S02-T1',
      title: 'Evaluación formativa — Valores y conversión',
      subtopics_covered: ['S02-T1-A', 'S02-T1-B'],
      tasks: [
        {
          id: 'S02-T1-TE-1',
          title: 'Clasificar literales y demostrar 42 vs "42"',
          authentic: true,
          deliverable: 'Script: 5 literales con type.__name__ + prints de 42 vs "42" y str(42)=="42"',
        },
        {
          id: 'S02-T1-TE-2',
          title: 'safe_int con vacío, espacios y letras',
          authentic: true,
          deliverable: 'Función safe_int + 4 casos (OK, "", "abc", "  ") con mensajes por campo',
        },
      ],
      rubric_0_3: {
        correctness: '¿Tipos y conversiones son correctos?',
        robustness: '¿Vacío y ValueError se reportan sin que el programa falle?',
        maintainability: '¿Mensajes nombran el campo y el valor recibido?',
        responsible_use: '¿Solo datos sintéticos; sin eval?',
      },
    },
    {
      id: 'S02-T2-TE',
      topic_id: 'S02-T2',
      title: 'Evaluación formativa — Nombres e identidad',
      subtopics_covered: ['S02-T2-A', 'S02-T2-B'],
      tasks: [
        {
          id: 'S02-T2-TE-1',
          title: 'Renombrar schema a PEP 8 + corregir = vs ==',
          authentic: true,
          deliverable: 'Dict encabezado→snake_case (con apellido_paterno/materno) + 3 if con ==',
        },
        {
          id: 'S02-T2-TE-2',
          title: 'raw/clean sin corromper el original',
          authentic: true,
          deliverable: 'make_record con *_raw; assert raw intacto tras mutar clean',
        },
      ],
      rubric_0_3: {
        correctness: '¿Nombres PEP 8 y comparaciones con ==?',
        robustness: '¿Raw sobrevive a strip/upper?',
        maintainability: '¿Identificadores legibles sin l/O/I?',
        responsible_use: '¿Sin PII real ni afirmaciones de parentesco?',
      },
    },
    {
      id: 'S02-T3-TE',
      topic_id: 'S02-T3',
      title: 'Evaluación formativa — Operadores y Decimal',
      subtopics_covered: ['S02-T3-A', 'S02-T3-B'],
      tasks: [
        {
          id: 'S02-T3-TE-1',
          title: 'Precedencia: -3**2 vs (-3)**2 e IGV con paréntesis',
          authentic: true,
          deliverable: 'Prints de potencia + total = subtotal * (1 + 0.18) documentando el error de float',
        },
        {
          id: 'S02-T3-TE-2',
          title: 'Monto en soles con Decimal + quantize',
          authentic: true,
          deliverable: 'parse_monto o propina 10% con Decimal("…") y quantize(0.01); sin float',
        },
      ],
      rubric_0_3: {
        correctness: '¿Precedencia y montos Decimal son correctos?',
        robustness: '¿InvalidOperation / vacío se manejan?',
        maintainability: '¿Paréntesis explícitos en fórmulas?',
        responsible_use: '¿Sin float para dinero de negocio?',
      },
    },
    {
      id: 'S02-T4-TE',
      topic_id: 'S02-T4',
      title: 'Evaluación formativa — I/O y parser',
      subtopics_covered: ['S02-T4-A', 'S02-T4-B'],
      tasks: [
        {
          id: 'S02-T4-TE-1',
          title: 'Reporte f-string de cliente sintético',
          authentic: true,
          deliverable: 'Resumen multi-línea con nombres/contacto/monto S/ {m:.2f}',
        },
        {
          id: 'S02-T4-TE-2',
          title: 'Suite parse_client: Unicode, vacío, edad inválida',
          authentic: true,
          deliverable: '3 asserts (Ñahui raw, nombres vacío, edad_raw="abc") + errors accionables',
        },
      ],
      rubric_0_3: {
        correctness: '¿raw/clean/errors cumplen el contrato?',
        robustness: '¿Vacío, Unicode y número inválido cubiertos?',
        maintainability: '¿Mensajes y f-strings claros en español?',
        responsible_use: '¿Solo datos sintéticos; sin PII?',
      },
    },
  ],
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
      {
        label: 'input / print (tutorial I/O)',
        url: 'https://docs.python.org/3/tutorial/inputoutput.html',
        note: 'f-strings y formateo de salida',
      },
      {
        label: 'Python for Everybody — types chapter',
        url: 'https://www.py4e.com/html3/02-variables',
        note: 'Variables y tipos con progresión gradual',
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
        label: 'MIT 6.100L',
        url: 'https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/',
        note: 'Contratos y tipos básicos',
      },
      {
        label: 'Coursera — Python for Everybody',
        url: 'https://www.coursera.org/specializations/python',
        note: 'Variables, I/O y tipos',
      },
      {
        label: 'Kaggle Learn — Python',
        url: 'https://www.kaggle.com/learn/python',
        note: 'Micro-práctica de tipos y funciones básicas',
      },
    ],
  },
}
