/**
 * S02 — Valores, tipos, operadores e I/O
 *
 * The filename and the exported id ("basics") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section02: CourseSection = {
  id: 'basics',
  index: 2,
  title: 'Valores, tipos, operadores e I/O',
  shortTitle: 'Valores y tipos',
  tagline: 'Valores escritos directamente, nombres, operadores y entrada/salida para interpretar una captura inicial con `Decimal`, un tipo numérico para montos decimales',
  estimatedHours: 9,
  level: 'Principiante',
  phase: 0,
  icon: 'Code2',
  accentColor: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  jobRelevance:
    'Imagina un formulario internacional: una edad llega como "42", un código postal conserva un cero inicial y un monto exige céntimos exactos. En bancos, fintech, salud o retail, ese detalle separa un registro auditable de uno que falla en silencio. Aquí aprenderás a leer campos de un formulario o de un archivo CSV. Un archivo CSV es una tabla guardada como texto. Distinguirás el texto de las cantidades, verás cuándo falla una conversión y conservarás el original para explicar el problema.',
  learningOutcomes: [
    { text: 'Identificar literales y tipos básicos (int, float, str, bool, None) y explicar el tipo de expresiones simples' },
    { text: 'Inspeccionar con type/isinstance y convertir/validar valores de forma explícita' },
    { text: 'Asignar nombres con convenciones PEP 8 y distinguir asignación de comparación' },
    { text: 'Explicar identidad vs. igualdad, mutabilidad y conservar copias/valores originales' },
    { text: 'Evaluar aritmética y comparaciones respetando precedencia' },
    { text: 'Calcular montos en soles con Decimal y redondeo a 2 decimales' },
    { text: 'Capturar con `input()` el texto que una persona escribe; mostrar resultados con `print()`; y crear f-strings, textos que incrustan valores entre llaves' },
    { text: 'Seguir una captura sintética desde el texto original hasta valores limpios y conversiones válidas, sin sobrescribir el original' },
  ],
  theory: [
    {
            heading: "Cuarenta y dos, con y sin comillas",
      paragraphs: [
        "En S01 preparaste el taller: intérprete, entorno virtual y repositorio. Ahora llega la primera pieza que merece entrar en él. Un formulario puede mostrar `42` y `\"42\"` como si fueran gemelos; para Python son habitantes de mundos distintos, y esa diferencia decide si una comparación funciona o engaña.",
        "Tres ideas bastan para empezar. Un **literal** es un valor escrito directamente en el código: `34`, `\"Quispe\"`, `True`. Su **tipo** —`int`, `float`, `str`, `bool`, `NoneType`— responde una pregunta concreta: ¿qué operaciones tienen sentido con ese valor? Dos números se suman y dos textos se pegan uno detrás de otro. En cambio, `\"42\" + 8` no tiene un significado válido para Python. Y hay dos signos que se parecen y no se parecen en nada: con **`=`** le pones nombre a un valor, con **`==`** preguntas si dos valores son iguales. Escribir uno por el otro es el error más frecuente de las primeras semanas.",
        "La secuencia que se repite en toda la sección es **valor → significado → operación permitida**, y se lee en ese orden. Cuando algo no funciona, el primer sospechoso no es la operación: es que el valor no era del tipo que suponías. Digo *primer* sospechoso a propósito, porque no es el único. En T2 y T3 verás que un tipo correcto no evita todos los fallos. Por precedencia, `-3**2` da `-9`. Con valores `int`, `//` redondea hacia abajo y no hacia cero. Además, un nombre mal escrito lanza `NameError` antes de que intervenga ningún tipo. El tipo explica la mayoría de las sorpresas de esta sección; la precedencia y el nombre explican el resto.",
        "Hay un punto donde esto deja de ser teoría y se vuelve dinero. Los `float` no representan de forma exacta la mayoría de los decimales, así que `0.1 + 0.2` no da `0.3` sino algo con un residuo minúsculo. Para dibujar un gráfico da igual; para sumar montos en soles, no. Por eso los montos usan `Decimal` y no `float`, y por eso lo vas a ver desde el principio en vez de aprenderlo después de un descuadre.",
        "Y hay un contrato que arrastrarás durante todo el curso: conservar el **texto original (`raw`)** y trabajar por separado con el **texto limpio (`clean`)**. Conserva intacto el valor tal como llegó. Guarda el texto limpio aparte. Suena a exceso de cuidado hasta la primera vez que alguien pregunta por qué un registro quedó así y la única respuesta posible es mirar el original.",
        "**La pregunta que atraviesa la sección es directa:** ¿qué es esto realmente y qué puedo hacer con ello sin mentir? El hilo conductor será un registro sintético de cliente. Sus nombres, apellidos, datos de contacto, dirección, edad y monto son ficticios. Ese registro representa una **captura inicial (`intake`)**. En S02 conservarás el texto recibido, limpiarás sus bordes, convertirás los valores válidos y observarás por separado qué ocurre con un texto que no se puede convertir.",
      ],
      callout: {
        type: 'info',
        title: 'Qué NO es el foco de esta sección',
        content:
          'Todavía no elegiremos entre caminos ni repetiremos instrucciones. Tampoco definiremos funciones; una función es un bloque reutilizable de instrucciones. En S02 reconoces tipos, asignas nombres, aplicas operadores, trabajas con `Decimal` y practicas entrada/salida. Más adelante reunirás esas piezas en código que interprete los textos recibidos.',
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, ritmo y alcance.",
        "**Orden de los subtemas.** T1 trata los valores: literales, inspección y conversión. T2 pasa a los nombres: asignación, convenciones PEP 8, identidad y copias. T3 cubre los operadores: precedencia y `Decimal` para dinero. T4 cierra con la entrada y salida: f-strings —cadenas con valores incrustados— y la lectura de datos. La recuperación de errores se estudia en S09.",
        "**Ritmo orientativo (unas 9 horas).** De esas, dos o tres para el núcleo: al terminarlo ya sabes leer un valor y decir de qué tipo es antes de operar con él. El resto se va en la práctica guiada, el proyecto del bloque y el autochequeo. No hace falta hacerlo de una sentada.",
        "**Criterio de cierre.** Puedes explicar el tipo de un valor, convertir texto válido, conservar el texto original, calcular con `Decimal` y presentar el resultado. En S02 observarás qué ocurre al intentar una conversión inválida; en S09 aprenderás a impedir que ese fallo detenga el resto del trabajo.",
        "**Fuera de alcance por ahora.** En S02 ejecutarás cada ejemplo con valores concretos. Las secciones posteriores enseñarán a elegir caminos, repetir instrucciones y reunir pasos para volver a usarlos.",
        "**Límites.** Solo datos sintéticos (`example.com`, teléfonos inventados). Nunca información personal identificable real en el repositorio.",
      ],
      callout: {
        type: 'info',
        title: 'Mapa de S02',
        content:
          'Primero reconoce valores y tipos; después asigna nombres y aplica operadores; al final practica el tipo numérico `Decimal` y la entrada/salida. Conserva siempre el texto original y usa únicamente datos sintéticos.',
      },
     },
     {
      heading: 'Una secuencia que permite encontrar el cambio',
      paragraphs: [
        'Un dato rara vez pasa del formulario al resultado en un solo salto. Primero llega como texto, después se limpia y luego se interpreta. Una **pipeline** es una secuencia ordenada de pasos: cada paso recibe un valor, hace un cambio concreto y entrega el resultado al paso siguiente.',
        'Esta secuencia resuelve un problema práctico: permite señalar dónde cambió el dato. Con una edad escrita como `" 19 "`, el primer paso conserva ese texto. El segundo obtiene `"19"` sin los espacios de los bordes. El tercero obtiene el número `19`.',
        'Observa el ejemplo y predice sus tres líneas antes de ejecutarlo. `edad_raw` conserva lo recibido, `edad_clean` guarda el texto sin espacios y `edad` guarda el número interpretado.',
        'Ahora repite los tres pasos con `" 28 "`. Debes obtener `" 28 "`, `"28"` y `28`, sin cambiar `edad_raw`. Como comprobación final, explica la secuencia sin decir pipeline: “conservo el texto, quito los espacios de los bordes y lo convierto en número”.',
      ],
      code: {
        language: 'python',
        title: 'pipeline_edad.py',
        code: `edad_raw = " 19 "
edad_clean = edad_raw.strip()
edad = int(edad_clean)

print("raw: |" + edad_raw + "|")
print("clean:", edad_clean)
print("edad:", edad)
`,
        output: `raw: | 19 |
clean: 19
edad: 19`,
      },
      callout: {
        type: 'info',
        title: 'No es una caja misteriosa',
        content:
          'Una pipeline no decide si el dato es correcto. Ordena transformaciones observables para que puedas comparar qué recibió y qué produjo cada paso.',
      },
     },
     {
      heading: 'Literales y tipos básicos',
      subtopicId: 'S02-T1-A',
      paragraphs: [
        'Un sistema de reservas puede recibir el asiento `"07"`, la cantidad `7` y la bandera `True` en una misma fila. A simple vista son datos breves; para el programa, cada uno promete operaciones distintas. **Puente desde el mapa:** antes de convertir nada, aprende a reconocer qué clase de objeto tienes delante.',
        'Un **literal** es un valor escrito directamente en el código: `34`, `150.5`, `"Quispe"`, `True`, `None`. Python clasifica cada valor en un **tipo**. Los tipos básicos de S02 son: **`int`** (enteros: `0`, `34`, `-7`), **`float`** (punto flotante: `150.5`, `1.0`), **`str`** (texto Unicode: `"María José"`, `"Ñahui"`), **`bool`** (`True` / `False`) y **`None`** (ausencia de valor; su tipo es **`NoneType`**).',
        'La trampa clásica de intake: el número **`42`** (int) y el texto **`"42"`** (str) **no son el mismo valor**. `42 == "42"` es `False`. En formularios y CSV **casi todo llega como str**. Si sumas o comparas sin convertir, obtienes `TypeError` o lógica silenciosamente incorrecta. El teléfono **`999000111` debe modelarse como `str`**, no como `int`: no es una cantidad aritmética y puede tener ceros a la izquierda en otros países.',
        'Para ver el tipo usa **`type(x)`**. En `type(x).__name__`, el punto permite consultar un dato asociado al resultado y `__name__` proporciona el nombre legible del tipo (`"int"`, `"str"`, …). La forma **`x.metodo()`** pide al valor `x` ejecutar un método, es decir, una operación propia; por ejemplo, pronto usarás `valor.strip()`. Más adelante preferirás `isinstance` para validar; primero entrenas el ojo con literales. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `isinstance(True, int)` es `True`. Para lógica de negocio, trata `bool` como booleano, no como `0`/`1`, salvo que documentes una conversión explícita.',
        '**Detente y predice:** antes de ejecutar el ejemplo, anota el tipo de `None`, `"42"` y `42`. Después compara tu predicción con la salida. Si fallaste, no memorices la respuesta: pregunta qué operaciones tendría sentido permitir en cada caso. Esa explicación causal te prepara para convertir y validar en T1-B.',
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

print(type(nombres))
print(type(edad))
print(type(referencia))
print(type(42))
print(type("42"))
print(42 == "42")
`,
        output: `<class 'str'>
<class 'int'>
<class 'NoneType'>
<class 'int'>
<class 'str'>
False`,
      },
      callout: {
        type: 'tip',
        title: 'Regla de intake',
        content:
          'Pregunta por cada campo: ¿es cantidad, texto, bandera o ausencia? Teléfono y códigos → str. Conteos enteros → int. Montos en soles → en T3 usarás Decimal, no float a ciegas. Ausencia → None (no la cadena "None").',
      },
    },
    {
      heading: 'Ver el valor con `repr()`',
      paragraphs: [
        'Al revisar una captura, `42`, `"42"` y `" 42 "` pueden parecer casi iguales en la pantalla. **`repr()`** produce un texto que muestra el valor de forma precisa: conserva las comillas de los textos y hace visibles los espacios de sus bordes.',
        '`repr()` no cambia el valor original. En el ejemplo, el número `42` aparece sin comillas, el texto `"42"` aparece con comillas y el texto con espacios conserva esos espacios dentro de las comillas.',
        'Predice las tres líneas antes de ejecutar. Después cambia `texto_con_bordes` por `"42 "` y comprueba que la salida deja un solo espacio antes de la comilla final.',
      ],
      code: {
        language: 'python',
        title: 'ver_valores_con_repr.py',
        code: `valor_numero = 42
valor_texto = "42"
texto_con_bordes = " 42 "

print(repr(valor_numero))
print(repr(valor_texto))
print(repr(texto_con_bordes))
`,
        output: `42
'42'
' 42 '`,
      },
      callout: {
        type: 'tip',
        title: 'Mirar no es transformar',
        content:
          '`repr()` ayuda a inspeccionar un valor; no quita espacios ni convierte texto en número. Usa `strip()` o `int()` cuando quieras producir otro valor.',
      },
    },
    {
      heading: 'Tres resultados que viajan juntos',
      paragraphs: [
        'Una conversión puede necesitar comunicar tres hechos: si funcionó, qué valor produjo y qué problema encontró. Una **tupla** reúne varios valores en un orden fijo. Se escribe entre paréntesis, como `(True, 19, None)`, y sirve para trasladar esos hechos juntos sin confundir sus posiciones.',
        'En `(True, 19, None)`, la primera posición indica que la conversión funcionó. La segunda guarda la edad `19` y la tercera contiene `None` porque no hubo error. La línea `ok, edad, error = resultado` reparte las tres posiciones, de izquierda a derecha, entre tres nombres. Esta acción se llama **desempaquetar una tupla**.',
        'Haz una prueba guiada: cambia el resultado por `(False, None, "edad vacía")`. Antes de ejecutar, escribe qué recibirá cada nombre. La respuesta correcta es `ok = False`, `edad = None` y `error = "edad vacía"`.',
        'Ejecuta ambos casos y compara las tres líneas impresas con tu predicción. La comprobación es sencilla: debe haber tantos nombres a la izquierda como valores en la tupla. Si falta o sobra uno, Python muestra un error en vez de adivinar dónde colocarlo.',
      ],
      code: {
        language: 'python',
        title: 'tupla_resultado.py',
        code: `resultado = (True, 19, None)
ok, edad, error = resultado
print(ok)
print(edad)
print(error)
`,
        output: `True
19
None`,
      },
      callout: {
        type: 'tip',
        title: 'El orden forma parte del significado',
        content:
          '`(True, 19, None)` significa éxito, valor y ausencia de error en ese orden. Cambiar las posiciones también cambia lo que recibe cada nombre.',
      },
    },
    {
      heading: 'Inspección, conversión y validación',
      subtopicId: 'S02-T1-B',
      paragraphs: [
        'En una hoja de inscripción, `" 19 "` no es todavía una edad: es una secuencia de caracteres que *podría* representar una edad. **Puente desde T1-A:** reconocer el tipo describe el presente; convertir y validar decide si ese dato puede cruzar la puerta del sistema.',
        '**`type(x)`** responde “¿qué es esto ahora?”. **`isinstance(x, int)`** comprueba si `x` pertenece al tipo `int` o a uno de sus subtipos. Por eso `isinstance(True, int)` produce `True`: en Python, `bool` es subtipo de `int`. Conserva ese dato como una advertencia; los ejemplos de conversión que siguen trabajan con texto y no usan `isinstance` para aceptar edades.',
        'La conversión explícita usa **`int()`**, **`float()`** y **`str()`** para intentar producir un valor del tipo indicado. El texto de formularios puede traer espacios en los bordes: **`valor.strip()`** produce el texto sin esos espacios. La forma `x.metodo()` pide al valor `x` ejecutar una operación propia. `int(" 19 ")` funciona.',
        'En cambio, `int("19.5")` e `int("abc")` detienen la ejecución porque ninguno de esos textos representa un entero válido. `"19.5"` contiene una parte decimal y `"abc"` contiene letras. Ejecuta cada caso por separado para observar el mensaje de Python. En S09 aprenderás qué clase de error es y cómo continuar después de encontrarlo. Nunca uses `eval()` con texto recibido de una persona: podría ejecutar código incluido en esa entrada.',
        'Avanza con ejemplos separados. Primero convierte `" 19 "`: `strip` produce `"19"` e `int` produce `19`. Después ejecuta `int("abc")` por separado y observa el `ValueError`: la ejecución se detiene en esa línea. En S09 aprenderás a capturar ese error y continuar; S02 se limita a distinguir una conversión válida de una inválida sin ocultar el fallo.',
        '**Modelo mental:** `strip` limpia los extremos; `int` intenta interpretar el contenido como entero. Predice el resultado de `int("19")` y el error de `int("diecinueve")` antes de probarlos. En T2 aprenderás a dar nombres claros a los valores.',
      ],
      code: {
        language: 'python',
        title: 'safe_int_contrato.py',
        code: `edad_raw = " 19 "
edad_texto = edad_raw.strip()
edad = int(edad_texto)
print("raw: |" + edad_raw + "|")
print("limpio:", edad_texto)
print("edad:", edad)
print(type(edad))

# Ejecuta esta conversión por separado para observar ValueError:
# int("abc")`,
        output: `raw: | 19 |
limpio: 19
edad: 19
<class 'int'>`,
      },
      callout: {
        type: 'warning',
        title: 'No eval, no silent pass',
        content:
          '`eval()` no es una herramienta de conversión segura para texto recibido de una persona. Usa `int()`, `float()` o `str()` según el significado del campo. Si `int()` recibe letras, deja visible el `ValueError`; aprenderás a recuperarte de ese error en S09.',
      },
    },
    {
      heading: 'Comprobar una expectativa con `assert`',
      paragraphs: [
        'Después de convertir un valor, necesitas comprobar que el resultado coincide con lo que esperabas. **`assert`** comprueba la comparación que escribes después de la palabra mientras practicas.',
        'Si la comparación es `True`, `assert` no muestra nada y el programa continúa. En el ejemplo, la única salida procede de `print`; el `assert` pasa en silencio porque `edad` vale `19`.',
        'Si cambias la comprobación por `assert edad == 20`, la comparación es `False`. Python se detiene y la última línea del mensaje muestra `AssertionError`; la línea `print` que viene después ya no se ejecuta.',
        'Usa `assert` para comprobar tu propio resultado, no para responder a una entrada inválida de una persona. S03 retomará estas comprobaciones junto a las decisiones y S09 enseñará a responder a errores sin ocultarlos.',
      ],
      code: {
        language: 'python',
        title: 'comprobar_edad.py',
        code: `edad = 19
assert edad == 19
print("edad comprobada:", edad)
`,
        output: `edad comprobada: 19`,
      },
      callout: {
        type: 'info',
        title: 'Mapa de `assert`',
        content:
          'Lee de izquierda a derecha: `assert comparación` → `True` → continúa sin mostrar nada; `assert comparación` → `False` → muestra `AssertionError` y se detiene.',
      },
    },
    {
      heading: 'Asignación y convenciones de nombres',
      subtopicId: 'S02-T2-A',
      paragraphs: [
        'Un programa pequeño puede sobrevivir a `x`, `dato2` y `AP`; un equipo distribuido no debería tener que adivinarlos. **Puente desde T1:** una vez que el valor tiene un tipo, necesita un nombre estable que conserve su significado durante la lectura, la prueba y la revisión.',
        'Una **variable** es un nombre ligado a un valor; sirve para volver a usar ese valor y cambiarlo sin reescribirlo en cada lugar. El nombre no es el valor, y Python no exige declarar de antemano un tipo para ese nombre: **`=` asigna** `25` a `edad` en `edad = 25`, y `edad = 26` asigna otro valor al mismo nombre. **`==` compara** dos valores y produce un `bool`: `edad == 25` produce `True`. No son intercambiables: en esta sección asignas con `=` y comparas con `==`.',
        'PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`); **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`); **`CapWords`** para clases (más adelante). `UPPER_CASE` es una convención de lectura: Python sí permite reasignar ese nombre. Evita nombres de una sola letra confusos: **`l`, `O`, `I`** se confunden con `1` y `0`. Prefiere `longitud`, `indice`, `columna`.',
        'Para los campos de la captura inicial usa nombres estables y en español técnico claro: `nombres`, `apellido_paterno`, `apellido_materno`, `contacto`, `direccion`. No inventes parentesco real a partir de apellidos: son **campos de texto**, no una afirmación genealógica. Si Python encuentra un nombre que aún no has asignado, muestra **`NameError`**, un error que suele señalar un nombre mal escrito o usado demasiado pronto.',
        '**Prueba de lectura:** tapa el valor y observa solo el nombre. ¿Podrías explicar qué guarda `apellido_paterno` y por qué `EDAD_MINIMA` parece una regla estable? Si el nombre necesita un comentario para revelar lo esencial, aún puede mejorar. En T2-B verás que dos nombres también pueden señalar el mismo objeto.',
      ],
      code: {
        language: 'python',
        title: 'nombres_pep8.py',
        code: `nombres_cliente = "Ana"
apellido_paterno = "García"
EDAD_MINIMA = 18
edad = 25

print(nombres_cliente)
print(apellido_paterno)
print(edad == EDAD_MINIMA)

# NameError si descomentas:
# print(apellido_materno)
`,
        output: `Ana
García
False`,
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
        id: "S02-truthiness",
        caption:
          "Ausencia, cero y texto vacío son valores distintos. Para preguntar específicamente por ausencia, compara con `None` mediante `is None`.",
        alt:
          "Cuatro guardas evaluadas en orden: is None da ausente; == 0 y == vacío dan presente; el resto, presente.",
      },

      subtopicId: 'S02-T2-B',
      paragraphs: [
        'Dos etiquetas de equipaje pueden describir maletas iguales sin estar pegadas a la misma maleta. Python distingue esas preguntas: **¿tienen el mismo contenido?** y **¿son el mismo objeto?**. **Puente desde T2-A:** asignar un segundo nombre no siempre crea una segunda cosa.',
        '**`==` compara valor**; **`is` / `is not` comparan identidad** (¿mismo objeto en memoria?). El idioma correcto para ausencia es **`x is None`** (no `x == None`, aunque a veces “funcione”). `id(x)` expone un identificador del objeto; úsalo para entender demos, no en lógica de negocio rutinaria.',
        'Los **`str` son inmutables**: `.strip()` o concatenar produce otro resultado `str`, pero no modifica el original. No bases la lógica en si Python reutiliza el mismo objeto. Una **lista** agrupa varios valores entre corchetes y puede modificarse. Aquí la usamos solo para observar la mutabilidad con `append` y `copy`. Si `b = a`, ambos nombres apuntan a la misma lista. **`b` es un alias**: otro nombre para ese objeto. Por eso, modificar `b` también modifica `a`. Con **`a.copy()`**, Python crea una lista exterior nueva. Esta es una **copia superficial**: si la lista contiene otros objetos mutables, esos objetos todavía pueden compartirse. En S06 aprenderás a copiar estructuras con elementos internos.',
        'Patrón de calidad de datos: guarda el texto original en **`campo_raw`** y trabaja con el texto limpio en **`campo_clean`**. Si una conversión falla, **`campo_raw` sigue ahí** para explicar el error e intentarlo de nuevo. Nunca sobrescribas el original con la versión limpia en el mismo nombre si necesitas comprobar qué se recibió.',
        '**Predicción antes del `append`:** con `b = a` y `c = a.copy()`, dibuja tres flechas desde los nombres hacia los objetos. Luego decide qué listas cambiarán al ejecutar `b.append(4)`. El dibujo importa más que memorizar la salida: en T4-B el mismo razonamiento protegerá `raw` mientras normalizas `clean`.',
      ],
      code: {
        language: 'python',
        title: 'raw_vs_alias.py',
        code: `raw_nombre = "  José Ñahui  "
clean_nombre = raw_nombre.strip()
print("raw: |" + raw_nombre + "|")
print("clean: |" + clean_nombre + "|")

a = [1, 2, 3]
b = a            # alias
c = a.copy()     # copia superficial
b.append(4)
print("a (alias mutado):", a)
print("c (copia):", c)
print("a is b:", a is b)
print("a is c:", a is c)

x = None
print(x is None)
`,
        output: `raw: |  José Ñahui  |
clean: |José Ñahui|
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
          'Si haces `clean = raw` cuando `raw` es una lista y luego modificas `clean`, también cambia el contenido que ves mediante `raw`. Usa `raw.copy()` antes de modificar la lista de trabajo y comprueba que ambos nombres ya no señalan el mismo objeto.',
      },
    },
    {
      heading: 'Operadores y precedencia',
      subtopicId: 'S02-T3-A',
      paragraphs: [
        'Una fórmula de tarifa escrita en Nairobi, Toronto o Lima puede caber en una línea y aun así esconder dos interpretaciones. Python no “entiende la intención”: sigue una jerarquía de operadores. **Puente desde T2:** los nombres ya están claros; ahora debes hacer explícita la relación matemática entre sus valores.',
        'Con valores `int`, los operadores aritméticos de S02 son: `+`, `-`, `*`, `/` (división verdadera, produce `float`), `//` (cociente redondeado hacia −∞; en negativos no “hacia cero”), `%` (resto) y `**` (potencia). Otros tipos pueden definir estos operadores de otra manera. Las **comparaciones** (`==`, `!=`, `<`, `<=`, `>`, `>=`) devuelven `bool` y se combinan con la aritmética en expresiones de negocio (rangos, umbrales).',
        'La **precedencia** importa: `*` y `/` van antes que `+` y `-`; `**` es aún más prioritario y se asocia a la derecha. Trampa clásica: **`-3**2` vale `-9`**, no `9`, porque el unario `-` se aplica al resultado de `3**2`. Usa **`(-3)**2`** si quieres el cuadrado del negativo. Cuando dudes, **paréntesis**: `(a + b) * c` no es lo mismo que `a + b * c`.',
        'En cualquier sistema de cobro, un impuesto de 18% se escribe mentalmente como *base × (1 + 0.18)*. Si escribes `base + base * 0.18`, la precedencia de `*` ya resuelve esa expresión. Cuando mezcles sumas de líneas y tasas, usa **paréntesis explícitos** para que quien revise el código vea la intención. Para dinero real en soles, **T3-B usa `Decimal`** — aquí entrenas la expresión; allá entrenas la precisión.',
        '**Predice, luego ejecuta:** escribe primero el resultado de `-3**2`, `(-3)**2`, `10 // 3` y `10 % 3`. Si una predicción falla, añade paréntesis hasta que la expresión narre la intención de izquierda a derecha. El siguiente subtema conserva esa claridad y cambia la representación numérica para proteger los céntimos.',
      ],
      code: {
        language: 'python',
        title: 'precedencia_ops.py',
        code: `a = 10
b = 3
c = 2
print("10 // 3 =", a // b)
print("10 % 3  =", a % b)
print("3 ** 2  =", b ** c)
print("a + b * c =", a + b * c)
print("(a + b) * c =", (a + b) * c)
print("-3**2 =", -3**2)
print("(-3)**2 =", (-3)**2)
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
        'Los valores `float` representan muchos decimales mediante aproximaciones binarias: por eso `0.1 + 0.2` produce `0.30000000000000004`. Para montos decimales en **soles (S/)** usa **`Decimal`**, un tipo numérico incluido en el módulo `decimal`. Un **módulo** es una parte reutilizable de Python; la **biblioteca estándar** es el conjunto de herramientas que viene con Python. Construye `Decimal` desde **`str`**: `Decimal("0.1")`, no desde `Decimal(0.1)`, porque ese `float` ya contiene una aproximación.',
        'Para expresar un monto en céntimos, **`quantize(Decimal("0.01"))`** ajusta el resultado a dos posiciones decimales. La instrucción `from decimal import Decimal, ROUND_HALF_EVEN` hace disponibles esos dos nombres en este archivo. `Decimal` usa **`ROUND_HALF_EVEN`** por defecto; ante una mitad exacta, ese modo elige el resultado cuyo último dígito es par. Una regla contable, tributaria o contractual puede exigir otro modo. En este ejemplo elegimos `ROUND_HALF_EVEN` como convención del curso y redondeamos en cada límite de negocio cuya regla exija mostrar o guardar un monto.',
        'En una captura inicial, el campo monto puede llegar como **texto** (`"150.50"`). `Decimal(texto.strip())` convierte un texto decimal válido. Si el texto no representa un decimal, Python informa un error; aprenderás a recuperarte de ese error en S09. **Convención S02: punto decimal** (`150.50`), no coma; si el archivo CSV trae coma, documenta la normalización antes de usar `Decimal`.',
        '**Comprueba la causa:** predice si `Decimal(0.1)` y `Decimal("0.1")` serán idénticos; luego imprime ambos. El segundo nace de la representación decimal que escribiste; el primero hereda una aproximación binaria ya creada. En T4 llevarás este valor confiable a un mensaje legible sin devolverlo a `float`.',
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
print("subtotal", subtotal, "IGV", igv, "total", total)
`,
        output: `float: 0.30000000000000004
Decimal: 0.3
subtotal 100.00 IGV 18.00 total 118.00`,
      },
      callout: {
        type: 'danger',
        title: 'Nunca Decimal(0.1) ni float para soles',
        content:
          'Decimal(0.1) hereda la aproximación binaria ya contenida en ese `float`. Decimal("0.1") parte del texto decimal escrito. Multiplicar montos con `float` y “arreglar” el resultado con `round()` al final sigue siendo frágil en reportes contables.',
      },
    },
    {
      heading: 'Construir un mensaje con valores',
      paragraphs: [
        'Un mensaje suele mezclar texto fijo con valores que cambian. Escribir cada parte por separado vuelve difícil ver el resultado completo. Una **f-string** es un texto que comienza con `f` y contiene espacios entre llaves donde Python coloca valores.',
        'En `f"Cliente: {nombre} | Monto: S/ {monto:.2f}"`, `Cliente:` y `Monto:` permanecen iguales. Python sustituye `{nombre}` por `José` y muestra `{monto:.2f}` con dos posiciones decimales. La f-string resuelve un problema de presentación: no cambia el valor guardado en `nombre` ni en `monto`.',
        'Dentro de una f-string, **`{valor!r}`** muestra la misma representación que `repr(valor)`. Por eso `f"raw={raw!r}"` deja visibles las comillas y los espacios del texto recibido, sin cambiar `raw`.',
        'Haz una modificación guiada: cambia `nombre` por `"Ana"` y `monto` por `Decimal("7")`. Antes de ejecutar, escribe el mensaje completo. Lo correcto es `Cliente: Ana | Monto: S/ 7.00`.',
        'Comprueba también el papel de la letra `f`: ejecuta `print("Cliente: {nombre}")`. Si aparecen las llaves y la palabra `nombre`, Python trató el contenido como texto ordinario. Añade la `f`, ejecuta otra vez y confirma que aparece el valor.',
      ],
      code: {
        language: 'python',
        title: 'mensaje_con_valores.py',
        code: `from decimal import Decimal

nombre = "José"
monto = Decimal("99.5")
raw = " 42 "
mensaje = f"Cliente: {nombre} | Monto: S/ {monto:.2f}"
print(mensaje)
print(f"raw={raw!r}")
`,
        output: `Cliente: José | Monto: S/ 99.50
raw=' 42 '`,
      },
      callout: {
        type: 'tip',
        title: 'Las llaves señalan qué cambia',
        content:
          'Dentro de una f-string, el texto exterior permanece fijo y cada par de llaves señala el valor que Python debe mostrar.',
      },
    },
    {
      heading: 'Entrada/salida: input, print y f-strings',
      subtopicId: 'S02-T4-A',
      paragraphs: [
        '**Puente desde T3:** ya sabes aplicar operadores y usar `Decimal` para calcular montos decimales. T4 añade una secuencia comprobable: capturar, interpretar y presentar. **`input()`**, la función que lee lo que escribe una persona, siempre devuelve ese contenido como texto; en muchos campos de formulario, la entrada también llega como texto, aunque otras fuentes pueden entregar tipos distintos.',
        '**`input(mensaje)`** siempre devuelve **`str`**, aunque la persona escriba dígitos; `mensaje` es el texto que se muestra antes de esperar la respuesta. En las demostraciones asignaremos entradas de ejemplo a variables para repetir la misma comprobación sin escribirlas de nuevo. Para mostrar varios valores usa argumentos concretos, por ejemplo `print("a", "b", sep=" | ")`; `sep` indica qué texto coloca `print` entre ellos.',
        'Las **f-strings** son textos precedidos por `f` que incrustan valores entre llaves, como `f"Monto: {monto:.2f}"`. La parte `.2f` muestra dos posiciones decimales. Después de T3-B, todo monto de negocio continúa como `Decimal`: formatearlo con `.2f` no requiere convertirlo a `float`. Las preguntas mostradas por `input()` y los mensajes para la persona van en **español claro**.',
        'Primero **captura** el texto recibido. Luego **interpreta** ese texto al convertirlo al tipo necesario. Por último, **reporta** el resultado en un mensaje. Así puedes comprobar cada conversión con valores conocidos, sin depender de lo que alguien escriba en la consola. Un resumen de cliente con cuatro o cinco campos permite practicar la secuencia completa.',
        '**Predicción útil:** si una persona escribe `34`, ¿qué mostrará `type(input(...)).__name__`? Responde antes de ejecutar. Luego explica por qué conviene conservar primero el texto recibido y convertirlo en un paso separado. T4-B reunirá las tres capas en una secuencia observable.',
      ],
      code: {
        language: 'python',
        title: 'reporte_fstring.py',
        code: `from decimal import Decimal

# Usa valores conocidos para repetir la misma comprobación.
nombres = "María José"
monto = Decimal("150.50")
print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
print("campos", "a", "b", sep=" | ")
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
      heading: 'Del texto original al valor interpretado',
      subtopicId: 'S02-T4-B',
      paragraphs: [
        '**Puente desde T4-A:** ya estableciste la secuencia de capturar la entrada como texto, interpretarla al convertirla al tipo necesario y presentar el resultado con una f-string. T4-B añade cómo conservar el texto original mientras trabajas con el texto limpio y cómo explicar, con un mensaje, qué conversión no pudo completarse.',
        'Un **parser** es el código que transforma el texto capturado en campos interpretados. Un buen parser conserva lo recibido y explica qué no pudo interpretar. En S02 seguirás conversiones concretas; en S09 aprenderás a recuperarte de una conversión inválida para continuar con los demás campos.',
        'Para una captura inicial, conserva cada texto original en un nombre terminado en **`_raw`** y guarda el texto limpio en otro nombre terminado en **`_clean`**. Así puedes comparar lo recibido con lo interpretado sin sobrescribir el original.',
        'Comprueba por separado tres casos: texto con espacios alrededor, texto vacío y texto que no representa un entero. Los nombres `García`, `Ñahui` y `María` deben conservar sus tildes y la letra `ñ`; Python representa ese texto con **Unicode**, el estándar que permite escribir caracteres de muchos idiomas. En S02 observas el `ValueError` de una conversión inválida; en S09 aprenderás a capturarlo y producir un mensaje por campo.',
        'Un mensaje accionable indica **qué campo**, **qué valor se recibió** y **qué se esperaba**. No afirmes parentesco real a partir de dos apellidos: son campos de texto de la captura, no una afirmación genealógica.',
        '**Cierre de la cadena:** sigue `" 34 "` desde `edad_raw` hasta `edad_clean` y `edad = 34`. Después prueba `int("abc")` por separado y señala dónde aparece `ValueError`. Si puedes narrar ambos recorridos sin mirar el código, distingues limpieza, conversión y fallo observable.',
      ],
      code: {
        language: 'python',
        title: 'parse_minimo.py',
        code: `edad_raw = " 34 "
edad_clean = edad_raw.strip()
edad = int(edad_clean)
print("edad_raw: |" + edad_raw + "|")
print("edad_clean:", edad_clean)
print("edad:", edad)

apellido_raw = "  Ñahui  "
apellido_clean = apellido_raw.strip()
print("apellido_raw: |" + apellido_raw + "|")
print("apellido_clean:", apellido_clean)

# Ejecuta por separado para observar ValueError:
# int("abc")`,
        output: `edad_raw: | 34 |
edad_clean: 34
edad: 34
apellido_raw: |  Ñahui  |
apellido_clean: Ñahui`,
      },
      callout: {
        type: 'success',
        title: 'Contrato del parser S02',
        content:
          'Conserva el texto original · limpia en otro nombre · convierte solo texto válido · observa los errores sin ocultarlos · usa únicamente datos sintéticos.',
      },
    },
  ],
  iDo: {
    intro:
      'Partimos del taller que preparaste en S01. Puedes usar tu `.venv` activo o el entorno aislado del navegador, que ejecuta Python dentro de la página sin instalar nada. Ese entorno usa **Pyodide**, la herramienta que permite ejecutar Python dentro de una página web. Seguiremos un registro sintético desde su apariencia en pantalla hasta un resultado que puedas explicar. En cada demostración aplica el mismo ritual: **predice una línea**, **sigue el código**, **comprueba la salida** y **explica la diferencia**. Recorrerás literales, conversión, nombres, identidad, operadores, `Decimal`, f-strings y el parser final. Copiar y ejecutar confirma que Python hizo algo. Explicar por qué hizo *eso* confirma que aprendiste. Usa solo datos ficticios, nunca datos personales reales.',
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
          code: `# Cliente sintético (no es persona real)
nombres = "María José"
apellido_paterno = "Quispe"
edad = 34
monto_soles = 150.5
activo = True
referencia = None

print(f"nombres: valor={nombres!r} type={type(nombres).__name__}")
print(f"apellido_paterno: valor={apellido_paterno!r} type={type(apellido_paterno).__name__}")
print(f"edad: valor={edad!r} type={type(edad).__name__}")
print(f"monto_soles: valor={monto_soles!r} type={type(monto_soles).__name__}")
print(f"activo: valor={activo!r} type={type(activo).__name__}")
print(f"referencia: valor={referencia!r} type={type(referencia).__name__}")

print("type(42)=", type(42).__name__)
print("type('42')=", type("42").__name__)
print("42 == '42' →", 42 == "42")
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
        description: 'Conversión visible: texto original, texto limpio y entero',
        preamble:
          'En formularios y CSV una edad suele llegar como texto. **Predicción:** para `" 19 "`, escribe qué conservará `edad_raw`, qué producirá `strip()` y qué producirá `int()`. Después compara tu predicción con cada línea. Los textos `"abc"` y `"  "` quedan al final para ejecutarlos por separado y observar dónde se detiene Python.',
        code: {
          language: 'python',
          title: 'S02-T1-B-DEMO — conversion_visible',
          code: `edad_raw = " 19 "
edad_clean = edad_raw.strip()
edad = int(edad_clean)

print("raw:", repr(edad_raw))
print("clean:", repr(edad_clean))
print("edad:", edad)
print("tipo:", type(edad).__name__)

# Ejecuta una línea por vez para observar el mensaje de error:
# int("abc")
# int("  ")`,
          output: `raw: ' 19 '
clean: '19'
edad: 19
tipo: int`,
        },
        why: '`edad_raw`, `edad_clean` y `edad` hacen visible cada etapa. `strip()` produce otro texto; `int()` produce el entero `19`. Un texto con letras o sin dígitos no produce un entero y detiene esa ejecución; S09 enseñará a continuar después.',
        retrospective:
          'Predice qué nombre conserva los espacios, cuál contiene `"19"` y cuál contiene `19`. Después comprueba los tres tipos. Si ejecutas `int("abc")` por separado, señala la línea exacta donde Python se detiene y explica por qué el texto original sigue disponible para investigarlo.',
      },
      {
        demoId: 'S02-T2-A-DEMO',
        subtopicId: 'S02-T2-A',
        environment: 'browser-pyodide',
        description: 'Renombrar a snake_case y comparar con ==',
        preamble:
          'En una revisión de código, los nombres y `=` frente a `==` se entienden antes que cualquier decisión posterior. Esta demo muestra `snake_case`, una constante `UPPER_CASE` y el resultado de una comparación. **Predicción:** con `edad = 25` y `EDAD_MINIMA = 18`, ¿la comparación producirá `True` o `False`?',
        code: {
          language: 'python',
          title: 'S02-T2-A-DEMO — nombres_y_comparacion',
          code: `nombres_cliente = "Ana"
apellido_paterno = "García"
EDAD_MINIMA = 18
edad = 25

print("edad mínima exacta:", edad == EDAD_MINIMA)
print("edad=", edad)
print("mínima=", EDAD_MINIMA)
print("nombres_cliente=", nombres_cliente)
print("apellido_paterno=", apellido_paterno)
`,
          output: `edad mínima exacta: False
edad= 25
mínima= 18
nombres_cliente= Ana
apellido_paterno= García`,
        },
        why: '`=` liga un nombre a un valor y `==` compara dos valores. La palabra `if` abre una decisión: ejecuta un bloque solo cuando una comparación produce `True`. S03 enseñará a construir y seguir esas decisiones; aquí solo haces visible el resultado de `==`.',
        retrospective:
          'Asignar es `=`; preguntar igualdad es `==`. Predice el resultado antes de ejecutar y después cambia `edad` a `18`. Comprueba que solo cambia la primera línea. Si aparece `NameError`, rastrea cada nombre desde su asignación hasta el `print` que intenta leerlo.',
      },
      {
        demoId: 'S02-T2-B-DEMO',
        subtopicId: 'S02-T2-B',
        environment: 'browser-pyodide',
        description: 'Alias vs. copia y preservar raw tras normalizar',
        preamble:
          'El contrato raw/clean exige que el original sobreviva al `strip`. Aquí verás que `strip` produce un resultado limpio sin modificar el string original y que `b = a` en listas crea un alias. **Predicción visual:** dibuja `a`, `b` y `c` como nombres con flechas; decide qué contenido cambiará después de `b.append(4)`. Solo entonces sigue la salida en este orden: raw → clean → alias → copia → `is None`.',
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
print("x is None →", x is None)
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
        why: 'El texto original debe sobrevivir a `strip`. En una lista, un alias permite cambiar el mismo contenido mediante dos nombres; `copy()` crea una lista exterior distinta. Las listas aquí son solo un adelanto de mutabilidad: se estudiarán a fondo en S06.',
        retrospective:
          'El texto limpio no debe sobrescribir el original. En una lista, copia antes de modificar. `is` pregunta si dos nombres señalan el mismo objeto; `==` pregunta si sus valores son iguales. En la práctica guiada romperás el alias y comprobarás que la lista original permanece intacta.',
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
          code: `a = 10
b = 3
c = 2
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
          code: `from decimal import Decimal, ROUND_HALF_EVEN

print("float 0.1+0.2 =", 0.1 + 0.2)
print("Decimal =", Decimal("0.1") + Decimal("0.2"))

subtotal = Decimal("100.00")
igv = (subtotal * Decimal("0.18")).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
total = (subtotal + igv).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
print(f"subtotal={subtotal} IGV={igv} total={total}")
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
          code: `from decimal import Decimal

# Simula input() con valores conocidos.
nombres = "María José"
monto = Decimal("150.50")
print(f"Cliente: {nombres} | Monto: S/ {monto:.2f}")
print("OK", "intake", sep=" · ")
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
        description: 'Recorrido visible: original, limpio, convertido y fallo observado',
        preamble:
          'Esta demostración sigue una captura sin esconder ninguna etapa. **Predicción:** decide qué originales conservarán espacios o un cero inicial, qué textos cambiarán con `strip()` y qué valor terminará como `int`. El texto vacío y la edad inválida se muestran sin intentar continuar después del fallo.',
        code: {
          language: 'python',
          title: 'S02-T4-B-DEMO — recorrido_captura',
          code: `nombres_raw = "  María Ñahui  "
contacto_raw = "0999000111"
edad_raw = " 34 "
vacio_raw = "   "
edad_invalida_raw = "abc"

nombres_clean = nombres_raw.strip()
contacto_clean = contacto_raw.strip()
edad_clean = edad_raw.strip()
vacio_clean = vacio_raw.strip()
edad = int(edad_clean)

print(f"raw nombre: |{nombres_raw}|")
print("clean nombre:", nombres_clean)
print("contacto:", contacto_clean, type(contacto_clean).__name__)
print("edad:", edad, type(edad).__name__)
print("vacío después de strip:", vacio_clean == "")
print("edad inválida original:", edad_invalida_raw)

# Ejecuta esta línea por separado para observar ValueError:
# int(edad_invalida_raw)`,
          output: `raw nombre: |  María Ñahui  |
clean nombre: María Ñahui
contacto: 0999000111 str
edad: 34 int
vacío después de strip: True
edad inválida original: abc`,
        },
        why: 'Cada nombre corresponde a una etapa visible. `strip()` produce texto limpio sin alterar el original; `int()` convierte solo la edad válida; el contacto conserva su cero porque sigue siendo texto. La conversión inválida queda separada para que su `ValueError` sea observable sin exigir recuperación.',
        retrospective:
          'Narra el recorrido de cada campo: qué llegó, qué cambió y qué tipo quedó. Si puedes señalar por qué el contacto no se convierte y dónde se detiene `int("abc")`, ya puedes revisar una captura con las herramientas de S02.',
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
          '1. Revisa los cinco valores asignados en el starter.\n2. Completa cada `print` con el nombre del tipo correspondiente.\n3. Ejecuta y compara las cinco líneas con la salida esperada.',
        hint: 'Usa `type(valor).__name__` en cada línea para obtener `int`, `float`, `str`, `bool` o `NoneType`.',
        hints: [
          'Escribe una línea para cada valor; la repetición es deliberada y permite comparar los cinco casos.',
          '`None` produce el nombre de tipo `NoneType`. `False` es `bool`, no texto; `0` es `int`, no `bool`.',
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
# Completa cada línea con el valor indicado y su tipo.
entero = 0
decimal = 3.14
texto = "Lima"
bandera = False
ausencia = None

print(repr(entero), "→", ____)
print(repr(decimal), "→", ____)
print(repr(texto), "→", ____)
print(repr(bandera), "→", ____)
print(repr(ausencia), "→", ____)`,
        },
        solutionCode: {
          language: 'python',
          title: 'clasificar_literales.py',
          code: `entero = 0
decimal = 3.14
texto = "Lima"
bandera = False
ausencia = None

print(repr(entero), "→", type(entero).__name__)
print(repr(decimal), "→", type(decimal).__name__)
print(repr(texto), "→", type(texto).__name__)
print(repr(bandera), "→", type(bandera).__name__)
print(repr(ausencia), "→", type(ausencia).__name__)`,
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
        title: 'Tipar campos de una captura inicial',
        preamble:
          '- **Contexto:** un registro sintético necesita tipos elegidos por el significado de cada campo.\n- **Meta:** escribir seis valores y comprobar sus tipos de forma explícita.\n- **Éxito:** las seis líneas terminan en `True`; `contacto` es `str`, `edad` es `int` y `activo` es `bool`.\n- **Límites:** teléfono **no** como `int`; se permiten ñ y tildes; sin información personal real.',
        id: 'S02-T1-A-E3',
        instruction:
          '1. Completa los seis valores, uno por nombre.\n2. Escribe `contacto` como texto de dígitos entre comillas.\n3. Ejecuta las seis comprobaciones; todas deben terminar en `True`.',
        hint: '`contacto = "999000111"`, no `contacto = 999000111`: un teléfono identifica, no mide.',
        hints: [
          '`contacto = "999000111"`, no `contacto = 999000111`: un teléfono identifica, no mide.',
          'Comprueba cada nombre por separado con `type(nombre) is tipo_esperado`.',
        ],
        edgeCases: [
          'teléfono como `str`, no como `int`',
          'ñ y tildes conservadas en los textos',
        ],
        tests: 'Las seis comprobaciones imprimen `True`; contacto es `str`, edad es `int` y activo es `bool`.',
        feedback:
          'Si las seis líneas terminan en `True`, elegiste cada tipo por el significado del campo. Un teléfono sigue siendo texto aunque contenga solo dígitos, porque no representa una cantidad.',
        retrospective:
          'Predice qué ocurriría con el contacto `"007"` si quitaras las comillas. Perderías los ceros que forman parte del identificador y además permitirías sumarlo como si fuera una cantidad. Explica después por qué nombres y apellidos son textos, por qué edad es un entero y por qué activo solo admite `True` o `False`.',
        starterCode: {
          language: 'python',
          title: 'campos_intake_tipados.py',
          code: `# CASO-LIM-002 · T1-A-E3
# Completa cada valor con el tipo que exige su significado.
nombres = "____"
apellido_paterno = "____"
apellido_materno = "____"
contacto = "____"
edad = ____
activo = ____

print("nombres:", type(nombres) is str)
print("apellido_paterno:", type(apellido_paterno) is str)
print("apellido_materno:", type(apellido_materno) is str)
print("contacto:", type(contacto) is str)
print("edad:", type(edad) is int)
print("activo:", type(activo) is bool)`,
        },
        solutionCode: {
          language: 'python',
          title: 'campos_intake_tipados.py',
          code: `nombres = "María José"
apellido_paterno = "Quispe"
apellido_materno = "Ñahui"
contacto = "999000111"
edad = 28
activo = True

print("nombres:", type(nombres) is str)
print("apellido_paterno:", type(apellido_paterno) is str)
print("apellido_materno:", type(apellido_materno) is str)
print("contacto:", type(contacto) is str)
print("edad:", type(edad) is int)
print("activo:", type(activo) is bool)`,
          output: `nombres: True
apellido_paterno: True
apellido_materno: True
contacto: True
edad: True
activo: True`,
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
          '`strip` + `int` cubre una conversión válida, pero limpiar y convertir no son lo mismo: `strip` quita los espacios de los bordes y no transforma `"veintiuno"` en un número. Predice en qué línea se detendrá Python y ejecuta esa conversión por separado. Comprueba que `raw` conserva el texto recibido. En S09 aprenderás a continuar el programa después de ese fallo.',
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
        title: 'Convertir dos textos y comprobar sus tipos',
        preamble:
          '- **Contexto:** una edad y una cantidad llegan como texto, con espacios o ceros iniciales.\n- **Meta:** conservar ambos textos, limpiarlos y convertirlos en enteros.\n- **Éxito:** la salida muestra los originales intactos, valores `21` y `4`, tipos `int` y total `25`.\n- **Límites:** no sobrescribas los nombres terminados en `_raw`; ejecuta la conversión inválida solo por separado.',
        id: 'S02-T1-B-E2',
        instruction:
          '1. Obtén cada texto limpio con `strip()`.\n2. Convierte los dos textos limpios con `int()`.\n3. Ejecuta y compara las tres líneas con la solución. Después ejecuta `int("abc")` por separado y localiza la línea donde Python se detiene.',
        hint: 'Conserva `edad_raw` y `asistentes_raw`; crea nombres nuevos para el texto limpio y para cada entero.',
        hints: [
          'Primero usa `strip()` y después `int()`.',
          'Si sumas los textos antes de convertirlos, obtendrás texto unido en vez del número `25`.',
        ],
        edgeCases: ['espacios alrededor de la edad', 'cero inicial', 'texto no convertible observado por separado'],
        tests: 'Imprime originales intactos, `21 int`, `4 int` y `total 25`.',
        feedback:
          'Los nombres `_raw` conservan lo recibido. Los nombres nuevos guardan el texto limpio y los enteros. Si el total no es `25`, revisa que convertiste antes de sumar.',
        retrospective:
          'La conversión válida produce enteros con los que puedes sumar. `int("abc")` no produce un entero: Python muestra `ValueError` y se detiene en esa línea. La diferencia importa porque el texto `"12"` solo parece un número: sigue siendo texto hasta que `int()` lo convierte. Convertir de forma deliberada te permite saber si tienes un valor con el que puedes calcular o un texto que no sirve para ese cálculo. Predice qué tipo mostrará `type("12")` antes de ejecutarlo. En S09 aprenderás a continuar después de ese fallo.',
        starterCode: {
          language: 'python',
          title: 'dos_conversiones.py',
          code: `# CASO-LIM-002 · T1-B-E2
edad_raw = " 21 "
asistentes_raw = "04"

edad_texto = ____
asistentes_texto = ____
edad = ____
asistentes = ____

print(f"edad raw=|{edad_raw}| valor={edad} tipo={type(edad).__name__}")
print(f"asistentes raw=|{asistentes_raw}| valor={asistentes} tipo={type(asistentes).__name__}")
print("total", edad + asistentes)

# Ejecuta por separado para observar ValueError:
# int("abc")`,
        },
        solutionCode: {
          language: 'python',
          title: 'dos_conversiones.py',
          code: `edad_raw = " 21 "
asistentes_raw = "04"

edad_texto = edad_raw.strip()
asistentes_texto = asistentes_raw.strip()
edad = int(edad_texto)
asistentes = int(asistentes_texto)

print(f"edad raw=|{edad_raw}| valor={edad} tipo={type(edad).__name__}")
print(f"asistentes raw=|{asistentes_raw}| valor={asistentes} tipo={type(asistentes).__name__}")
print("total", edad + asistentes)`,
          output: `edad raw=| 21 | valor=21 tipo=int
asistentes raw=|04| valor=4 tipo=int
total 25`,
        },
      },
      {
        subtopicId: 'S02-T1-B',
        kind: 'transfer',
        title: 'Interpretar tres campos sin perder el original',
        preamble:
          '- **Contexto:** una captura trae un código postal, una cantidad y un precio como texto.\n- **Meta:** elegir qué texto debe seguir siendo texto y qué valores sí representan cantidades.\n- **Éxito:** el código conserva `007`, la cantidad es `12`, el precio es `3.5` y el subtotal es `42.0`.\n- **Límites:** conserva cada nombre `_raw`; no conviertas el código postal en número.',
        id: 'S02-T1-B-E3',
        instruction:
          '1. Conserva `codigo_postal_raw` como texto.\n2. Limpia y convierte la cantidad con `int()` y el precio con `float()`.\n3. Calcula el subtotal y ejecuta las cuatro comprobaciones impresas.',
        hint: 'Una cantidad admite aritmética; un código postal identifica una zona y puede empezar con cero.',
        hints: [
          'Usa `int(cantidad_raw.strip())` y `float(precio_raw.strip())`.',
          'El subtotal sale de multiplicar los dos valores ya convertidos.',
        ],
        edgeCases: ['código con cero inicial', 'espacios en una cantidad', 'originales intactos'],
        tests: 'Código `007` de tipo `str`, cantidad `12`, precio `3.5`, subtotal `42.0` y originales intactos.',
        feedback:
          'Convertir todo por igual es un error: `007` perdería información si se volviera entero. La operación que necesitas decide el tipo adecuado.',
        retrospective:
          'Los tres campos llegaron como texto, pero no significan lo mismo. La cantidad y el precio participan en un cálculo; el código postal conserva su forma. La decisión depende del uso que tendrá cada valor: convertir permite operar, mientras conservar el texto protege su forma. Explica esa diferencia antes de mirar los tipos impresos.',
        starterCode: {
          language: 'python',
          title: 'tres_campos.py',
          code: `# CASO-LIM-002 · T1-B-E3
codigo_postal_raw = "007"
cantidad_raw = " 12 "
precio_raw = "3.50"

codigo_postal = ____
cantidad = ____
precio = ____
subtotal = ____

print(codigo_postal, type(codigo_postal).__name__)
print(cantidad, type(cantidad).__name__)
print(precio, type(precio).__name__)
print("subtotal", subtotal)
print("raw intactos", codigo_postal_raw == "007" and cantidad_raw == " 12 " and precio_raw == "3.50")`,
        },
        solutionCode: {
          language: 'python',
          title: 'tres_campos.py',
          code: `codigo_postal_raw = "007"
cantidad_raw = " 12 "
precio_raw = "3.50"

codigo_postal = str(codigo_postal_raw)
cantidad = int(cantidad_raw.strip())
precio = float(precio_raw.strip())
subtotal = cantidad * precio

print(codigo_postal, type(codigo_postal).__name__)
print(cantidad, type(cantidad).__name__)
print(precio, type(precio).__name__)
print("subtotal", subtotal)
print("raw intactos", codigo_postal_raw == "007" and cantidad_raw == " 12 " and precio_raw == "3.50")`,
          output: `007 str
12 int
3.5 float
subtotal 42.0
raw intactos True`,
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
        title: 'Corregir `=` por `==` en tres comparaciones',
        preamble:
          '- **Contexto:** tres líneas intentan preguntar si un valor coincide, pero usan el signo que asigna.\n- **Meta:** distinguir asignación de comparación sin adelantar decisiones de S03.\n- **Éxito:** el archivo corre e imprime `True` tres veces.\n- **Límites:** cambia solo el operador equivocado; no cambies los valores.',
        id: 'S02-T2-A-E2',
        instruction:
          '1. Ejecuta el archivo y lee el mensaje y la línea que Python señala. En este archivo, Python se detiene en la primera comparación rota antes de ejecutar nada.\n2. Sustituye ese `=` por `==`, sin cambiar los valores.\n3. Vuelve a ejecutar y repite el proceso hasta obtener tres resultados `True`.',
        hint:
          '`=` guarda un valor en un nombre; `==` compara dos valores. En cada ejecución, este archivo muestra primero una sola comparación rota.',
        hints: [
          '`=` guarda un valor en un nombre; `==` compara dos valores. En cada ejecución, este archivo muestra primero una sola comparación rota.',
          'Lee cada expresión como una pregunta: “¿estado es igual a activo?”, “¿código es igual a diez?” y “¿nivel es igual a tres?”.',
        ],
        edgeCases: ['confundir asignación con comparación', 'cambiar un valor para forzar el resultado'],
        tests: 'El archivo corre e imprime tres líneas que terminan en `True`.',
        feedback:
          'Las tres comparaciones deben conservar sus valores y producir `True`. Si cambiaste un valor en vez del operador, ocultaste el defecto en lugar de corregirlo.',
        retrospective:
          'Predice qué línea señalará Python en cada ejecución y explica por qué no muestra los tres errores a la vez. Después de cada arreglo, comprueba si el mensaje avanza hasta la comparación siguiente. Por último, lee las tres preguntas en voz alta y relaciona cada resultado con los valores originales, sin cambiar esos valores para obtener `True`.',
        starterCode: {
          language: 'python',
          title: 'eq_vs_assign.py',
          code: `# CASO-LIM-002 · T2-A-E2
# Bug hunt: tres comparaciones usan = en lugar de ==.
# Corrige el error señalado, ejecuta de nuevo y repite.
estado = "activo"
codigo = 10
nivel = 3

print("estado activo?", (estado = "activo"))
print("código diez?", (codigo = 10))
print("nivel tres?", (nivel = 3))`,
        },
        solutionCode: {
          language: 'python',
          title: 'eq_vs_assign.py',
          code: `estado = "activo"
codigo = 10
nivel = 3

print("estado activo?", estado == "activo")
print("código diez?", codigo == 10)
print("nivel tres?", nivel == 3)`,
          output: `estado activo? True
código diez? True
nivel tres? True`,
        },
      },
      {
        subtopicId: 'S02-T2-A',
        kind: 'transfer',
        title: 'Nombrar seis campos con `snake_case`',
        preamble:
          '- **Contexto:** una tabla de texto trae encabezados con espacios y tildes.\n- **Meta:** crear nombres Python estables para sus seis campos.\n- **Éxito:** el archivo corre con `nombres`, `apellido_paterno`, `apellido_materno`, `contacto`, `direccion` y `edad`.\n- **Límites:** los nombres Python no llevan espacios ni tildes; conserva los valores sintéticos dados.',
        id: 'S02-T2-A-E3',
        instruction:
          '1. Sustituye cada `____` por el nombre Python correspondiente.\n2. Usa `apellido_paterno`, `apellido_materno`, `contacto` y `direccion` donde corresponda.\n3. Ejecuta y comprueba las seis líneas.',
        hint: 'Los nombres Python usan minúsculas y guiones bajos: `apellido_paterno`.',
        hints: [
          'Los nombres Python usan minúsculas y guiones bajos: `apellido_paterno`.',
          'Para “Teléfono / Cel” usa `contacto`; para “Dirección” usa `direccion`.',
        ],
        edgeCases: ['dos apellidos con nombres distintos', 'cero inicial conservado en contacto'],
        tests: 'El archivo usa los seis nombres pedidos y conserva los seis valores sintéticos.',
        feedback:
          'La consistencia gana a la creatividad: cada campo conserva el mismo nombre en todo el archivo. `contacto` permanece como texto y no pierde el cero inicial.',
        retrospective:
          'Comprueba si cada nombre permite anticipar el valor sin mirar la asignación. Si escribiste `telefono_cliente` donde el acuerdo usa `contacto`, el nombre puede sonar razonable y aun así romper el trabajo de otra persona. Explica por qué los dos apellidos necesitan nombres distintos y por qué `direccion` no lleva tilde en el código.',
        starterCode: {
          language: 'python',
          title: 'campos_snake_case.py',
          code: `# CASO-LIM-002 · T2-A-E3
# Sustituye cada ____ por un nombre Python estable.
____ = "Ana"
____ = "Quispe"
____ = "Ñahui"
____ = "0999000111"
____ = "Av. Ejemplo 123"
____ = 28

print("nombres:", nombres)
print("apellido_paterno:", apellido_paterno)
print("apellido_materno:", apellido_materno)
print("contacto:", contacto)
print("direccion:", direccion)
print("edad:", edad)`,
        },
        solutionCode: {
          language: 'python',
          title: 'campos_snake_case.py',
          code: `nombres = "Ana"
apellido_paterno = "Quispe"
apellido_materno = "Ñahui"
contacto = "0999000111"
direccion = "Av. Ejemplo 123"
edad = 28

print("nombres:", nombres)
print("apellido_paterno:", apellido_paterno)
print("apellido_materno:", apellido_materno)
print("contacto:", contacto)
print("direccion:", direccion)
print("edad:", edad)`,
          output: `nombres: Ana
apellido_paterno: Quispe
apellido_materno: Ñahui
contacto: 0999000111
direccion: Av. Ejemplo 123
edad: 28`,
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
        hint: 'Listas nuevas no son el mismo objeto: `[] is []` es `False`. Usa `is` para `None`.',
        hints: [
          'Listas nuevas no son el mismo objeto: `[] is []` es `False`. Usa `is` para `None`.',
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
          '- **Contexto:** si `trabajo = original` y haces `append`, cambias la lista original a través del segundo nombre.\n- **Meta:** crear con `.copy()` una lista exterior independiente.\n- **Éxito:** `original == ["a", "b"]`, `trabajo == ["a", "b", "c"]`, `original is trabajo` → `False`.\n- **Límites:** usa `.copy()`; estudiarás las colecciones y sus copias a fondo en S06.',
        id: 'S02-T2-B-E2',
        instruction:
          '1. Asigna `trabajo` como copia de `original`.\n2. Haz `append("c")` solo en `trabajo`.\n3. Imprime ambas listas y si son el mismo objeto.',
        hint: 'trabajo = original.copy()  o  trabajo = original[:]',
        hints: [
          'trabajo = original.copy()  o  trabajo = original[:]',
          'Si haces trabajo = original, append mutará ambos. Verifica con print y con `original is trabajo` → False.',
        ],
        edgeCases: ['copia vs. segundo nombre', 'alias accidental'],
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
        title: 'Conservar una lista original al modificar una copia',
        preamble:
          '- **Contexto:** necesitas conservar dos valores recibidos y trabajar sobre una lista separada.\n- **Meta:** reconocer un alias, crear una copia y modificar solo la copia.\n- **Éxito:** `alias_raw is raw` produce `True`, `trabajo is raw` produce `False` y `raw` conserva sus dos elementos.\n- **Límites:** usa `.copy()` y `append()`; las listas se estudiarán a fondo en S06.',
        id: 'S02-T2-B-E3',
        instruction:
          '1. Haz que `alias_raw` señale la lista original.\n2. Crea `trabajo` como una copia y añade `"revisado"` solo allí.\n3. Ejecuta el archivo y usa `is` para comprobar cuáles de `alias_raw`, `trabajo` y `raw` comparten la lista original; después, revisa qué contiene cada lista.',
        hint: '`alias_raw = raw` conserva el mismo objeto; `trabajo = raw.copy()` crea una lista exterior distinta.',
        hints: [
          '`alias_raw = raw` conserva el mismo objeto; `trabajo = raw.copy()` crea una lista exterior distinta.',
          'Después de `trabajo.append("revisado")`, `raw` todavía debe contener solo los dos textos recibidos.',
        ],
        edgeCases: ['confundir copia con alias', 'modificar la lista original'],
        tests: '`raw` queda intacta; el alias señala `raw`; la copia contiene un tercer elemento.',
        feedback:
          'Si `raw` conserva dos elementos y `trabajo` contiene tres, modificaste una copia. Las comprobaciones con `is` muestran por qué: el alias comparte objeto con `raw`, pero `trabajo` no.',
        retrospective:
          'Dibuja una flecha desde cada nombre antes de ejecutar. `raw` y `alias_raw` deben terminar en la misma lista; `trabajo`, en otra. Comprueba luego el dibujo con `is`. Si el texto `"revisado"` aparece también en `raw`, no borres el último elemento: corrige el momento en que creaste la copia.',
        starterCode: {
          language: 'python',
          title: 'raw_lista_y_copia.py',
          code: `# CASO-LIM-002 · T2-B-E3
raw = ["  María  ", " 999 "]
alias_raw = ____
trabajo = ____
trabajo.append("revisado")

print("raw:", raw)
print("alias comparte raw:", alias_raw is raw)
print("trabajo comparte raw:", trabajo is raw)
print("trabajo:", trabajo)
assert raw == ["  María  ", " 999 "]`,
        },
        solutionCode: {
          language: 'python',
          title: 'raw_lista_y_copia.py',
          code: `raw = ["  María  ", " 999 "]
alias_raw = raw
trabajo = raw.copy()
trabajo.append("revisado")

print("raw:", raw)
print("alias comparte raw:", alias_raw is raw)
print("trabajo comparte raw:", trabajo is raw)
print("trabajo:", trabajo)
assert raw == ["  María  ", " 999 "]`,
          output: `raw: ['  María  ', ' 999 ']
alias comparte raw: True
trabajo comparte raw: False
trabajo: ['  María  ', ' 999 ', 'revisado']`,
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
        title: 'Cuantizar tres montos escritos como texto',
        preamble:
          '- **Contexto:** tres montos llegan como texto y deben quedar con dos decimales.\n- **Meta:** construir cada `Decimal` desde texto y aplicar la misma regla de redondeo.\n- **Éxito:** obtienes `150.50`, `20.10` y `0.00`; las tres comparaciones imprimen `True`.\n- **Límites:** sin `float`; conserva los textos originales; prueba un formato inválido por separado.',
        id: 'S02-T3-B-E3',
        instruction:
          '1. Limpia cada texto con `strip()`.\n2. Construye cada `Decimal` y usa `quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)`.\n3. Ejecuta las comparaciones. Después prueba `Decimal("150,50")` por separado y observa dónde se detiene Python.',
        hint: 'Repite para cada monto la secuencia texto → `strip()` → `Decimal` → `quantize`.',
        hints: [
          'Construye desde texto, nunca desde `float`.',
          '`ROUND_HALF_EVEN` lleva `0.005` a `0.00` porque el último dígito conservado es par.',
        ],
        edgeCases: ['espacios', 'un solo decimal', 'empate de redondeo', 'coma observada por separado'],
        tests: 'Imprime `150.50 20.10 0.00` y tres líneas `True`.',
        feedback:
          'Las tres cantidades siguen una sola regla visible. Si aparece una cola de dígitos, revisa que no hayas construido un `Decimal` desde `float`.',
        retrospective:
          'Un formato válido produce un monto cuantizado. `Decimal("150,50")` no acepta la coma en este ejercicio y detiene la ejecución. S09 enseñará a continuar después de ese fallo. Antes de convertir, el texto debe tener la forma que `Decimal` acepta; cambiar la coma por un punto cambia el formato, no el monto. Predice qué ocurre con `Decimal("150.50")` y comprueba la respuesta.',
        starterCode: {
          language: 'python',
          title: 'tres_montos.py',
          code: `# CASO-LIM-002 · T3-B-E3
from decimal import Decimal, ROUND_HALF_EVEN

monto_a_raw = "150.50"
monto_b_raw = " 20.1 "
monto_c_raw = "0.005"

monto_a = ____
monto_b = ____
monto_c = ____

print(monto_a, monto_b, monto_c)
print(monto_a == Decimal("150.50"))
print(monto_b == Decimal("20.10"))
print(monto_c == Decimal("0.00"))

# Ejecuta por separado para observar el fallo:
# Decimal("150,50")`,
        },
        solutionCode: {
          language: 'python',
          title: 'tres_montos.py',
          code: `from decimal import Decimal, ROUND_HALF_EVEN

monto_a_raw = "150.50"
monto_b_raw = " 20.1 "
monto_c_raw = "0.005"

monto_a = Decimal(monto_a_raw.strip()).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
monto_b = Decimal(monto_b_raw.strip()).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)
monto_c = Decimal(monto_c_raw.strip()).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_EVEN
)

print(monto_a, monto_b, monto_c)
print(monto_a == Decimal("150.50"))
print(monto_b == Decimal("20.10"))
print(monto_c == Decimal("0.00"))`,
          output: `150.50 20.10 0.00
True
True
True`,
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
          '- **Contexto:** una comprobación automática no puede detenerse para esperar que alguien escriba en la consola. Por eso, tres textos conocidos ocupan el lugar de las respuestas.\n- **Meta:** conservar cada respuesta como texto y comprobar su tipo por separado.\n- **Éxito:** los tres nombres terminados en `_tipo` contienen `"str"` y el programa imprime `OK`.\n- **Límites:** **no** llames `input()` ni conviertas los textos todavía.',
        id: 'S02-T4-A-E3',
        instruction:
          '1. Completa `nombres_tipo`, `contacto_tipo` y `edad_tipo` con el nombre del tipo de cada valor.\n2. Imprime los tres valores entre barras y después imprime los tres nombres de tipo.\n3. Comprueba con `assert` que cada nombre de tipo sea `"str"`.',
        hint: 'No uses `input()`. Los tres textos ya están asignados a nombres para que puedas repetir exactamente la misma comprobación.',
        hints: [
          'No uses `input()`. Los tres textos ya están asignados a nombres para que puedas repetir exactamente la misma comprobación.',
          'Para obtener el nombre del tipo de `nombres`, escribe `type(nombres).__name__`. Repite la misma forma con los otros dos valores.',
        ],
        edgeCases: ['espacios conservados', 'edad escrita como texto', 'tres comprobaciones explícitas'],
        tests: 'Los tres valores permanecen intactos y cada nombre terminado en `_tipo` contiene `"str"`.',
        feedback:
          '`input()` entrega texto incluso cuando alguien escribe `34`. Aquí los valores conocidos sustituyen solo la escritura en la consola. Los nombres terminados en `_tipo` guardan la palabra `"str"`; no guardan el valor original ni lo convierten.',
        retrospective:
          'Predice qué cambiaría si `edad` fuera el número `34` en vez del texto `"34"`. Luego explica por qué, en esta práctica, los tres valores deben seguir siendo `str`. Comprueba cada nombre terminado en `_tipo`: si uno no contiene `"str"`, mezclaste la captura con la conversión. ¿Qué ventaja ofrece separar esos dos momentos antes de automatizar la lectura?',
        starterCode: {
          language: 'python',
          title: 'simular_intake.py',
          code: `# CASO-LIM-002 · T4-A-E3
# No llames input(). Los textos conocidos simulan tres respuestas repetibles.
nombres = "  Ana  "
contacto = "999"
edad = "34"

nombres_tipo = ____
contacto_tipo = ____
edad_tipo = ____

print(f"nombres: |{nombres}|")
print(f"contacto: |{contacto}|")
print(f"edad: |{edad}|")
print("tipos:", nombres_tipo, contacto_tipo, edad_tipo)
assert nombres_tipo == "str"
assert contacto_tipo == "str"
assert edad_tipo == "str"
print("OK")`,
        },
        solutionCode: {
          language: 'python',
          title: 'simular_intake.py',
          code: `nombres = "  Ana  "
contacto = "999"
edad = "34"

nombres_tipo = type(nombres).__name__
contacto_tipo = type(contacto).__name__
edad_tipo = type(edad).__name__

print(f"nombres: |{nombres}|")
print(f"contacto: |{contacto}|")
print(f"edad: |{edad}|")
print("tipos:", nombres_tipo, contacto_tipo, edad_tipo)
assert nombres_tipo == "str"
assert contacto_tipo == "str"
assert edad_tipo == "str"
print("OK")`,
          output: `nombres: |  Ana  |
contacto: |999|
edad: |34|
tipos: str str str
OK`,
        },
      },
      // ——— S02-T4-B ———
      {
        subtopicId: 'S02-T4-B',
        kind: 'guided',
        title: 'Hacer visible un texto vacío sin borrar el original',
        preamble:
          '- **Contexto:** un campo puede contener solo espacios, mientras otro contiene un apellido válido.\n- **Meta:** conservar ambos originales, limpiarlos y comprobar qué quedó vacío.\n- **Éxito:** el primer original sigue mostrando tres espacios, su texto limpio está vacío y `Ñahui` conserva la `Ñ`.\n- **Límites:** no sobrescribas los nombres `_raw`; todavía no elijas caminos distintos.',
        id: 'S02-T4-B-E1',
        instruction:
          '1. Crea `nombres_clean` y `apellido_clean` con `strip()`.\n2. Imprime cada original entre barras para hacer visibles los espacios.\n3. Comprueba con `== ""` que el primer texto limpio quedó vacío.',
        hint: 'El texto original y el texto limpio necesitan nombres distintos.',
        hints: [
          '`nombres_clean = nombres_raw.strip()` conserva `nombres_raw`.',
          'Las barras de `|{nombres_raw}|` permiten ver los espacios en la salida.',
        ],
        edgeCases: ['solo espacios', 'Unicode', 'original intacto'],
        tests: 'Muestra tres espacios en el original, vacío `True` y `Ñahui` intacto.',
        feedback:
          'La comparación hace visible el estado del campo sin decidir todavía qué hacer con él. Si desaparecieron los espacios del nombre `_raw`, sobrescribiste la evidencia.',
        retrospective:
          'Limpiar y decidir son trabajos distintos. S02 puede mostrar que un texto quedó vacío; S03 enseñará a elegir una acción según esa comparación. Separar ambos trabajos permite observar primero el valor y usar después el resultado sin confundir la limpieza con la elección. Comprueba con `print()` y `type()` que el valor limpio sigue siendo texto, incluso cuando está vacío.',
        starterCode: {
          language: 'python',
          title: 'observar_vacio.py',
          code: `# CASO-LIM-002 · T4-B-E1
nombres_raw = "   "
apellido_raw = "  Ñahui  "

nombres_clean = ____
apellido_clean = ____

print(f"nombres raw: |{nombres_raw}|")
print("nombres vacío:", nombres_clean == "")
print(f"apellido raw: |{apellido_raw}|")
print("apellido clean:", apellido_clean)
print("raw intactos:", nombres_raw == "   " and apellido_raw == "  Ñahui  ")`,
        },
        solutionCode: {
          language: 'python',
          title: 'observar_vacio.py',
          code: `nombres_raw = "   "
apellido_raw = "  Ñahui  "

nombres_clean = nombres_raw.strip()
apellido_clean = apellido_raw.strip()

print(f"nombres raw: |{nombres_raw}|")
print("nombres vacío:", nombres_clean == "")
print(f"apellido raw: |{apellido_raw}|")
print("apellido clean:", apellido_clean)
print("raw intactos:", nombres_raw == "   " and apellido_raw == "  Ñahui  ")`,
          output: `nombres raw: |   |
nombres vacío: True
apellido raw: |  Ñahui  |
apellido clean: Ñahui
raw intactos: True`,
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
        title: 'Recorrido completo de una captura válida',
        preamble:
          '- **Contexto:** una captura combina texto con espacios, Unicode, un contacto con cero inicial y una edad escrita como texto.\n- **Meta:** conservar cada original, limpiar los textos y convertir solo la edad.\n- **Éxito:** el resumen conserva `Ñahui`, el contacto sigue siendo texto, la edad es `int` y las cuatro comprobaciones imprimen `True`.\n- **Límites:** usa nombres separados; una edad inválida se observa por separado porque S02 todavía no recupera la ejecución.',
        id: 'S02-T4-B-E3',
        instruction:
          '1. Completa los cuatro nombres `_clean` sin cambiar los originales.\n2. Convierte `edad_clean` con `int()` y construye el resumen con una f-string.\n3. Ejecuta las cuatro comprobaciones. Después prueba la conversión comentada por separado.',
        hint: 'Los campos de texto usan `strip()`; solo `edad_clean` pasa por `int()`.',
        hints: [
          'El contacto debe seguir siendo `str` para conservar el cero inicial.',
          'Compara cada original con su texto inicial para demostrar que no lo sobrescribiste.',
        ],
        edgeCases: ['Unicode', 'cero inicial', 'espacios', 'edad inválida observada por separado'],
        tests: 'Resumen exacto y cuatro comprobaciones `True`.',
        feedback:
          'El recorrido es correcto cuando cada nombre cuenta una etapa: recibido, limpio o convertido. Si el contacto pierde el cero, convertiste un identificador como si fuera una cantidad.',
        retrospective:
          'Este recorrido integra valores, tipos, conversión y presentación sin ocultar el original. La conversión comentada muestra el límite: S02 observa el fallo; S09 enseñará a recuperarse. Conservar el texto original permite revisar qué valor recibió `input()` y qué cambio intentó `int()` o `float()` antes de detenerse. Predice qué valor impreso conserva su tipo y comprueba la predicción con `type()`.',
        starterCode: {
          language: 'python',
          title: 'captura_valida.py',
          code: `# CASO-LIM-002 · T4-B-E3
nombres_raw = "  María José  "
apellido_raw = "  Ñahui  "
contacto_raw = "0999000111"
edad_raw = " 34 "

nombres_clean = ____
apellido_clean = ____
contacto_clean = ____
edad_clean = ____
edad = ____

resumen = ____
print(resumen)
print("raw intactos", nombres_raw == "  María José  " and apellido_raw == "  Ñahui  ")
print("Unicode intacto", apellido_clean == "Ñahui")
print("contacto str", type(contacto_clean).__name__ == "str" and contacto_clean == "0999000111")
print("edad int", type(edad).__name__ == "int" and edad == 34)

edad_invalida_raw = "abc"
# Ejecuta por separado para observar ValueError:
# int(edad_invalida_raw)`,
        },
        solutionCode: {
          language: 'python',
          title: 'captura_valida.py',
          code: `nombres_raw = "  María José  "
apellido_raw = "  Ñahui  "
contacto_raw = "0999000111"
edad_raw = " 34 "

nombres_clean = nombres_raw.strip()
apellido_clean = apellido_raw.strip()
contacto_clean = contacto_raw.strip()
edad_clean = edad_raw.strip()
edad = int(edad_clean)

resumen = f"Cliente: {nombres_clean} {apellido_clean} | contacto={contacto_clean} | edad={edad}"
print(resumen)
print("raw intactos", nombres_raw == "  María José  " and apellido_raw == "  Ñahui  ")
print("Unicode intacto", apellido_clean == "Ñahui")
print("contacto str", type(contacto_clean).__name__ == "str" and contacto_clean == "0999000111")
print("edad int", type(edad).__name__ == "int" and edad == 34)`,
          output: `Cliente: María José Ñahui | contacto=0999000111 | edad=34
raw intactos True
Unicode intacto True
contacto str True
edad int True`,
        },
      },
    ],
  },
  youDo: {
    title: 'Recorrido de una captura — registro sintético de cliente',
    context:
      'Hasta aquí resolviste piezas aisladas; ahora deben colaborar sin perder sus contratos. En este incremento del mismo proyecto trabajarás con una captura sintética completa. Antes de programar, dibuja tres columnas —`raw`, `clean`, `valor`— y sigue por ellas un caso feliz. Conserva cada original, limpia los espacios de los campos de texto, convierte la edad y fija el monto a céntimos con la regla enseñada en T3-B. Al final muestra una entrada problemática y predice en qué línea se detendría su conversión. No intentes continuar después del fallo: esa recuperación se estudia en S09.',
    objectives: [
      'Recibir nombres, apellidos, contacto, dirección, edad y monto como textos conocidos',
      'Conservar el valor original (`raw`) de cada campo',
      'Crear por separado cada texto limpio con `strip()`',
      'Convertir una edad válida con `int()` y fijar un monto válido a céntimos con `Decimal`',
      'Conservar Unicode y el cero inicial del contacto',
      'Imprimir un resumen con una f-string y comprobaciones reproducibles',
    ],
    requirements: [
      'Cada campo conserva un nombre terminado en `_raw`',
      'Cada texto limpio usa otro nombre terminado en `_clean`',
      'El contacto sigue siendo `str` y conserva su cero inicial',
      'La edad convertida es `int` y el monto usa `quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)`',
      'Las comprobaciones con `assert` —instrucciones que detienen la ejecución cuando una comparación es falsa— demuestran que los originales siguen intactos',
      'El archivo muestra una entrada problemática sin intentar ocultar su fallo',
      'Solo se usan datos sintéticos; nunca información personal real',
      'Al ejecutar el archivo aparecen el resumen y cinco comprobaciones correctas',
    ],
    starterCode: `"""captura_cliente.py — incremento de S02
Datos sintéticos únicamente. No uses información real de clientes.
"""

from decimal import Decimal, ROUND_HALF_EVEN

nombres_raw = "  María José  "
apellido_paterno_raw = "  Quispe "
apellido_materno_raw = " Ñahui  "
contacto_raw = "0999000111"
direccion_raw = " Av. Ejemplo 123 "
edad_raw = " 28 "
monto_raw = " 150.505 "

nombres_clean = ____
apellido_paterno_clean = ____
apellido_materno_clean = ____
contacto_clean = ____
direccion_clean = ____
edad_clean = ____
monto_clean = ____

edad = ____
monto = Decimal(monto_clean).quantize(____, rounding=ROUND_HALF_EVEN)

resumen = ____
print(resumen)
print("nombres raw intacto", nombres_raw == "  María José  ")
print("apellido Unicode", apellido_materno_clean == "Ñahui")
print("contacto str", type(contacto_clean).__name__ == "str")
print("edad int", type(edad).__name__ == "int" and edad == 28)
print("monto", monto == Decimal("150.50"))

assert nombres_raw == "  María José  "
assert apellido_materno_raw == " Ñahui  "
assert contacto_clean == "0999000111"
assert edad == 28
assert monto == Decimal("150.50")

edad_invalida_raw = "abc"
print("entrada problemática:", edad_invalida_raw)
# Ejecuta esta línea por separado para observar dónde se detiene Python:
# int(edad_invalida_raw)
`,
    portfolioNote:
      'Este archivo hace promesas verificables: conserva cada original, separa la limpieza de la conversión, protege el cero inicial del contacto y fija el monto a céntimos con `Decimal`. En una entrevista, muestra una entrada problemática, señala el `assert` que protege el original y explica por qué el fallo se ejecuta por separado. Súbelo a tu repositorio de práctica **sin datos reales**.',
    retrospective:
      'Antes de marcarlo listo, reconstruye el recorrido sin mirar la solución: entrada → `raw` → texto limpio → valor convertido → resumen. Después responde: (1) ¿qué original protege cada `assert`? (2) ¿por qué el contacto sigue siendo texto? (3) ¿por qué `"150.505"` termina en `Decimal("150.50")`? (4) ¿dónde se detendría `int("abc")`? Si una respuesta depende de “porque el test lo pide”, vuelve a los valores, tipos y reglas que cada nombre conserva.',
    rubric: [
      { criterion: 'Valores, tipos y conversiones correctos', weight: '30%' },
      { criterion: 'Originales, Unicode y cero inicial preservados', weight: '25%' },
      { criterion: 'Nombres y recorrido raw/clean/valor claros', weight: '25%' },
      { criterion: 'Datos sintéticos, sin información personal real', weight: '20%' },
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
          'Teléfonos y códigos identifican; no miden. Modelarlos como `int` invita a perder ceros iniciales y permite operaciones absurdas como sumarlos. La velocidad o PEP 8 no decide el tipo: lo decide la semántica.',
      },
      {
        question: 'Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?',
        options: ['1, 2 (lista original)', '3 (solo el nuevo)', '1, 2, 3 (ambos nombres ven el cambio)', 'Error'],
        correctIndex: 2,
        explanation:
          '`b = a` crea otro nombre para la misma lista, no una copia. Por eso `append` aparece al mirar desde ambos nombres. `copy()` o `[:]` crea una lista independiente cuando esa es la intención.',
      },
      {
        question: '¿Qué expresión comprueba específicamente que `x` contiene el valor ausente `None`?',
        options: ['x == None', 'x is None', 'x === null', 'not x == None'],
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
        question: 'En S02, ¿cómo compruebas qué ocurre con `edad_raw = "abc"`?',
        options: ['Borras `edad_raw` antes de convertir', 'Ejecutas `int(edad_raw)` por separado y observas dónde se detiene', 'Inventas la edad `0`', 'Supones que las letras se convierten solas'],
        correctIndex: 1,
        explanation:
          'S02 conserva `edad_raw` y ejecuta la conversión problemática por separado. Python se detiene porque `"abc"` no representa un entero. S09 enseñará a continuar después del fallo sin borrar ni inventar datos.',
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
          title: 'Precedencia: `-3**2` vs `(-3)**2` e IGV con paréntesis',
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
