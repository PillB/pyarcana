import type { CourseSection } from '../../types'

export const section03: CourseSection = {
  id: 'data-structures',
  index: 3,
  title: 'Decisiones y reglas de validación',
  shortTitle: 'Decisiones & Reglas',
  tagline: 'Booleanos, control de flujo y reglas accept/reject/review sin confundir ausencia con falsy',
  estimatedHours: 18,
  level: 'Principiante',
  phase: 0,
  icon: 'GitBranch',
  accentColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  jobRelevance:
    'Un parser puede convertir `"0"` en `0` y, aun así, tomar una decisión equivocada. En sistemas de incorporación de clientes, pedidos, becas o pacientes, la conversión responde **qué dato llegó**; el motor de reglas responde **qué hacemos con él**. Esa diferencia enlaza directamente con S02. Si tratas `None` como si fuera `0`, o usas `if monto:` y rechazas un cero válido, produces falsos positivos y trabajo manual evitable. En esta sección construirás el **motor de reglas** del proyecto CP-N1-A: comparaciones, valores verdaderos o falsos, `if/elif/else`, guardas, listas permitidas, tablas de decisión y pruebas de ramas con mensajes accionables.',
  learningOutcomes: [
    { text: 'Comparar valores y probar pertenencia con ==, !=, <, >, in/not in de forma predecible' },
    { text: 'Distinguir truthiness de presencia semántica y predecir short-circuit de and/or' },
    { text: 'Escribir if/elif/else que clasifiquen un campo en una sola rama dominante' },
    { text: 'Aplicar guard clauses y detectar ramas inalcanzables por orden de condiciones' },
    { text: 'Implementar rangos y allowlists combinados para reglas de dominio sintéticas' },
    { text: 'Leer una decision table y expresar reglas claras con if o match según el caso' },
    { text: 'Enunciar invariantes de campo con ejemplos accept/reject/review' },
    { text: 'Redactar mensajes accionables y cubrir cada rama con un caso de prueba' },
  ],
  theory: [
    {
      heading: 'Mapa de la sección: del booleano al motor de reglas',
      paragraphs: [
        'Imagina un formulario internacional de ayuda de emergencia. Dos registros contienen `monto = 0`: uno declara correctamente que no hubo ingresos; el otro dejó el campo sin responder y debería contener `None`. Para Python, ambos valores son falsy; para la operación, cuentan historias distintas. Esta sección empieza precisamente en esa grieta entre la mecánica del lenguaje y el significado del dato.',
        '**Puente desde S02.** Ya sabes convertir texto a `int`, `float` o `str`, conservar el valor original y representar una conversión fallida. Ahora añadirás una segunda capa: decidir si el valor convertido se **acepta**, se **rechaza** o pasa a **revisión**. La conversión prepara el dato; la regla interpreta su estado sin inventar información.',
        'El hilo conductor es un **validador de campos** (`validate_field` / `validate_record`). La forma del resultado evoluciona deliberadamente: primero usamos strings cortos (`"accept"` / `"review"`) para observar una decisión; después aparecen dicts `{status, code}` para distinguir causas; en el **You Do** estandarizas `{status, code, message}` para que otra persona pueda actuar. No memorices las tres formas a la vez: sigue la razón de cada ampliación.',
        '**Diccionario de navegación.** *Truthiness* es la manera en que Python decide si un objeto cuenta como verdadero; una *allowlist* es una colección explícita de valores permitidos; una *guard clause* es una salida temprana que protege una precondición; una *decision table* relaciona condiciones con acciones; un *invariante* es una promesa que debe cumplirse siempre. Conservamos estos términos de industria, pero cada uno aparecerá primero como una idea y luego como sintaxis.',
        'Orden pedagógico: **T1 Booleanos** (comparaciones → truthiness) → **T2 Control** (if/elif/else → guards) → **T3 Reglas** (rangos/allowlists → decision tables/match) → **T4 Verificación** (invariantes → mensajes y tests de ramas). Cada rama del motor debe ser **testeable** con un caso accept, reject y review.',
        '**Ritmo sugerido (~18 h).** En las sesiones 1–2 trabaja solo T1: predice booleanos y separa `None` de `0`. En las sesiones 3–4 convierte esas predicciones en una rama dominante. Reserva T3 para combinar políticas y T4 para demostrar que cada rama funciona. El orden importa: primero una pregunta que produce `True` o `False`; luego una decisión; al final, una decisión explicable y verificable.',
        '**Antes de continuar, predice:** si un campo contiene `0`, ¿debería ir a accept, reject o review? La respuesta correcta es “depende del invariante”. Al terminar S03 deberás poder nombrar ese invariante, implementar la rama y exhibir una prueba que impida cambiarla por accidente.',
      ],
      code: {
        language: 'python',
        title: 's03_map_contract.py',
        code: `def section_contract():
    return {
        "case": "CASO-LIM-003",
        "gates": [
            "none_is_not_zero",
            "one_dominant_branch",
            "tri_state_accept_reject_review",
            "actionable_message",
        ],
        "collections_csv_json_in_scope": False,
        "real_pii_ok": False,
        "capstone_increment": "CP-N1-A",
    }

c = section_contract()
print("case", c["case"])
print("none_is_not_zero", "none_is_not_zero" in c["gates"])
print("collections_csv_json_in_scope", c["collections_csv_json_in_scope"])
print("capstone_increment", c["capstone_increment"])
`,
        output: `case CASO-LIM-003
none_is_not_zero True
collections_csv_json_in_scope False
capstone_increment CP-N1-A`,
      },
      callout: {
        type: 'info',
        title: 'Una capa por vez',
        content:
          'Aquí no construirás lectores CSV/JSON ni procesos de archivos. Trabajarás con registros sintéticos ya convertidos para concentrarte en una sola pregunta: **¿qué decisión permite la evidencia disponible?** Esa capa produce el motor de reglas de **CP-N1-A**; colecciones y archivos llegarán después.',
      },
    },
    {
      heading: 'Comparaciones y el operador in',
      subtopicId: 'S03-T1-A',
      paragraphs: [
        'En una plataforma de alquiler de bicicletas de Ámsterdam, una regla puede preguntar si la edad declarada supera un mínimo y si la estación pertenece al catálogo activo. Antes de escribir una sola rama, el sistema necesita respuestas elementales: `True` o `False`. Piensa en cada comparación como una pregunta cerrada que el código puede contestar sin ambigüedad.',
        'Un **booleano de negocio** nace de una comparación: `==`, `!=`, `<`, `<=`, `>`, `>=`. En intake, comparas edades, montos, códigos y regiones. Python también permite **encadenar**: `18 <= edad <= 65` equivale a `(18 <= edad) and (edad <= 65)` y se evalúa de forma segura (la expresión del medio se calcula una sola vez en la cadena).',
        '**Pertenencia**: `x in coleccion` / `x not in coleccion` funciona con str, list, set, dict (busca **claves**). Para allowlists de códigos fijos, un **`set` de literales** es ideal (un `set` es una colección sin duplicados; lo verás a fondo en colecciones): lectura clara y chequeo rápido. Atención a **mayúsculas**: `"dni" in {"DNI"}` es `False` — normaliza antes o documenta el contrato.',
        '**`is` vs. `==`**: usa **`is None` / `is not None`** para ausencia. No uses `is` para comparar números o strings de negocio (`True is 1` es `False` aunque `True == 1` sea `True`). `==` pregunta “¿mismo valor?”; `is` pregunta “¿mismo objeto?”.',
        '**Modelo mental.** `==` y los operadores de rango miran el **valor**; `in` pregunta si ese valor pertenece a un catálogo; `is None` comprueba la señal especial de ausencia. Son preguntas distintas. Si las fundes en una expresión larga antes de poder predecirlas por separado, el error queda escondido dentro de un `if` aparentemente razonable.',
        '**Predice y comprueba.** Sin ejecutar el ejemplo, decide qué línea cambiaría si `region = "R-OESTE"` y cuál cambiaría si `monto = 2000`. Después ejecútalo. Si esperabas que 2000 quedara fuera, revisa la palabra *inclusive*: `<=` contiene la frontera; `<` la excluye. En T1-B verás por qué obtener `False` tampoco significa automáticamente “dato ausente”.',
      ],
      code: {
        language: 'python',
        title: 'comparaciones_intake.py',
        code: `region = "R-NORTE"
monto = 1500
ALLOWED = {"R-NORTE", "R-SUR", "R-CENTRO"}

print("region == 'R-NORTE' →", region == "R-NORTE")
print("region != 'R-OESTE' →", region != "R-OESTE")
print("monto > 0 →", monto > 0)
print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
print("region in ALLOWED →", region in ALLOWED)
print("'R-OESTE' not in ALLOWED →", "R-OESTE" not in ALLOWED)
`,
        output: `region == 'R-NORTE' → True
region != 'R-OESTE' → True
monto > 0 → True
1000 <= monto <= 2000 → True
region in ALLOWED → True
'R-OESTE' not in ALLOWED → True`,
      },
      callout: {
        type: 'tip',
        title: 'Regla de intake',
        content:
          'Pronuncia la pregunta antes de elegir el operador: “¿es el mismo valor?”, “¿pertenece al catálogo?”, “¿está entre dos fronteras?” o “¿está ausente?”. Luego confirma el tipo aprendido en S02. Solo después combina respuestas con `and` u `or`.',
      },
    },
    {
      heading: 'Qué es verdadero en un if (y qué no es “ausente”)',
      subtopicId: 'S03-T1-B',
      paragraphs: [
        'En un portal de donaciones de Berlín, una contribución de cero puede representar una inscripción sin aporte inmediato; un campo ausente, en cambio, exige seguimiento. Un `if` ingenuo coloca ambos casos en la misma cesta porque Python no conoce la política del portal. El lenguaje decide la *truthiness*; tú debes decidir el significado.',
        'Python evalúa la **truthiness** de un valor en `if`, `while`, `and` y `or`. Son **falsy** (por defecto): `None`, `False`, `0`, `0.0`, `0j`, `""`, `()`, `[]`, `{}`, `set()`, `range(0)`. Casi todo lo demás es **truthy**, incluso `[0]` o `"False"` — por eso **no** uses truthiness como “¿existe el campo?”.',
        'El error canónico del intake: **`if monto:` trata `0` como “no hay monto”**. En negocio, **cero puede ser válido** y **`None` significa ausente**. Separa políticas: presencia con `is None`, rango con comparaciones numéricas, vacío de texto con `== ""` o `not s.strip()` según el contrato. **Nunca** conviertas ausencia en reject automático sin documentarlo.',
        '`and` / `or` hacen **short-circuit** y **devuelven un operando** (no siempre `True`/`False`). `"" or "default"` → `"default"`; `0 and 99` → `0`. `not` sí devuelve booleano. Prioridad: `not` se une más fuerte que `and`, y `and` más que `or`.',
        '**Dos capas, dos preguntas.** `bool(valor)` responde “¿Python lo considera verdadero?”. `valor is None` responde “¿el productor declaró ausencia?”. Ninguna de las dos decide por sí sola si el negocio acepta el dato. La política aparece cuando escribes algo como: ausencia → review; cero → accept; negativo → reject.',
        '**Predice y repara.** Antes de ejecutar `truthiness_monto.py`, anota la salida de `bool(None)`, `bool(0)` y `bool(-5)`. Luego compárala con `decide_monto`. Si te sorprende que `-5` sea truthy y termine en reject, has encontrado la lección: truthiness describe al objeto, no su validez. En T2 convertirás esa política en ramas exclusivas.',
      ],
      code: {
        language: 'python',
        title: 'truthiness_monto.py',
        code: `def decide_monto(m):
    """Política: None → review; 0 válido; negativo reject."""
    if m is None:
        return "review: ausente"
    if m == 0:
        return "accept: cero válido"
    if m < 0:
        return "reject: negativo"
    return "accept: positivo"

for v in [None, 0, -5, 150]:
    print(v, "bool=", bool(v), "→", decide_monto(v))

print("'' or 'default' →", "" or "default")
print("5 and 99 →", 5 and 99)`,
        output: `None bool= False → review: ausente
0 bool= False → accept: cero válido
-5 bool= True → reject: negativo
150 bool= True → accept: positivo
'' or 'default' → default
5 and 99 → 99`,
      },
      callout: {
        type: 'warning',
        title: 'La pregunta que evita falsos positivos',
        content:
          'Antes de escribir `if campo:`, pregunta: “¿quiero comprobar presencia o validez?”. Para montos y conteos, ausente (`None`) no equivale a falsy válido (`0`). Escribe ambas políticas por separado.',
      },
    },
    {
      heading: 'Ramas de decisión con if/elif/else',
      subtopicId: 'S03-T2-A',
      paragraphs: [
        'Un centro de soporte de Montreal clasifica cada solicitud como urgente, estándar o diferida. Si dos etiquetas pueden quedar activas a la vez, nadie sabe qué cola debe recibirla. `if/elif/else` resuelve esa ambigüedad con una promesa sencilla: una entrada, una rama dominante.',
        'Ya sabes predecir booleanos y truthiness; ahora esos booleanos se convierten en **una sola rama dominante**. La forma canónica de una decisión exclusiva es **`if` / `elif` / `else`**. Se evalúan en orden; **la primera condición verdadera gana** y el resto no se ejecuta. El `else` es la rama por defecto (útil para `reject` o `review`).',
        '**Indentación** define el bloque: 4 espacios es el estilo del curso. Un `if` seguido de otro `if` (sin `elif`) **no es excluyente**: ambos pueden dispararse y **sobrescribir** el status. Eso es un bug clásico al clasificar scores.',
        'Para el motor de reglas, un patrón limpio es devolver un **solo status** por campo: `accept`, `review` o `reject`. Fronteras (`score >= 80`) deben estar documentadas en la tabla de ejemplos.',
        '**Lee la cadena como una fila de puertas.** Python prueba la primera; si se abre, deja de mirar las demás. Por eso las condiciones más específicas o más exigentes suelen ir arriba. Tres `if` independientes son tres puertas que pueden abrirse: la última asignación puede borrar una decisión anterior sin producir ningún error de sintaxis.',
        '**Predice las fronteras.** Antes de ejecutar, clasifica 80, 79, 50 y 49. Si 80 te parece review, estás leyendo `>` donde el contrato dice `>=`. Si 95 termina en review al usar dos `if`, no falló el umbral: falló la exclusión. T2-B convertirá estas cadenas en validadores lineales protegidos por guardas.',
      ],
      code: {
        language: 'python',
        title: 'clasificar_score.py',
        code: `def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

for s in [95, 60, 30, 80, 50]:
    print(s, "→", classify_score(s))`,
        output: `95 → accept
60 → review
30 → reject
80 → accept
50 → review`,
      },
      callout: {
        type: 'tip',
        title: 'Una rama dominante',
        content:
          'Dibuja una tabla antes del código: una fila por intervalo y una sola etiqueta por fila. Si una entrada cabe en dos filas, corrige las fronteras; si dos bloques pueden ejecutarse, cambia los `if` posteriores por `elif` o retorna temprano.',
      },
    },
    {
      heading: 'Salidas tempranas y ramas que nunca se tocan',
      subtopicId: 'S03-T2-B',
      paragraphs: [
        'En un sistema de admisiones de Nairobi, comparar una edad antes de comprobar si fue proporcionada no produce una decisión: produce una excepción. Las guardas funcionan como el control de acceso de un edificio. Resuelven primero quién no puede continuar; el pasillo principal queda libre para el caso válido.',
        'Una **guard clause** (salida temprana) valida precondiciones y **retorna de inmediato** con `reject`/`review`, dejando el camino feliz al final sin pirámide de `if` anidados. Mejora legibilidad y reduce bugs de indentación.',
        'Orden típico en validadores: **1) ausencia (`is None`)** → **2) tipo** → **3) rango/allowlist** → **4) accept**. Si comparas `edad < 18` antes de chequear `None`, obtienes `TypeError`.',
        'Una **rama muerta** es código que nunca se ejecuta porque una condición anterior ya la cubre (p. ej. `if x >= 0: ... elif x > 5:` — el `elif` solo vería negativos, nunca `x > 5`). Aprende a leer el orden como un revisor de PRs.',
        '**Modelo mental de embudo.** Cada guardia retira una clase de casos y termina su historia: primero los ausentes, luego los tipos incompatibles, después los valores fuera de rango. Cuando llegas al último `return`, sabes qué evidencia sobrevivió. Una rama muerta es lo contrario: promete una historia para la que ya no queda ninguna entrada posible.',
        '**Predice el fallo antes de arreglarlo.** ¿Qué ocurre con `edad=None` si la primera línea útil es `if edad < 18`? ¿Qué valores podrían llegar a `elif x > 5` después de `if x >= 0`? Responder “TypeError” y “ninguno” demuestra que lees el flujo, no solo la indentación. En T3 usarás ese orden para separar desconocido, inválido y aceptable.',
      ],
      code: {
        language: 'python',
        title: 'validate_edad_guards.py',
        code: `def validate_edad(edad):
    if edad is None:
        return {"status": "review", "code": "MISSING"}
    if not isinstance(edad, int):
        return {"status": "reject", "code": "BAD_TYPE"}
    if edad < 0 or edad > 120:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    if edad < 18:
        return {"status": "review", "code": "NEEDS_REVIEW"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", -1, 15, 30]:
    print(repr(e), "→", validate_edad(e))`,
        output: `None → {'status': 'review', 'code': 'MISSING'}
'25' → {'status': 'reject', 'code': 'BAD_TYPE'}
-1 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}`,
      },
      callout: {
        type: 'tip',
        title: 'Diseño, no solo sintaxis',
        content:
          'Una guarda debe responder dos cosas: qué precondición falló y qué resultado termina esa ruta. Si solo reduce indentación, pero cambia la política, no es un refactor; es una regla nueva que necesita su propia decisión y sus propias pruebas.',
      },
    },
    {
      heading: 'Reglas de dominio: rangos y listas permitidas',
      subtopicId: 'S03-T3-A',
      paragraphs: [
        'Una aseguradora digital de Singapur puede conocer perfectamente el rango permitido de una variable y, al mismo tiempo, recibir un código regional nuevo que su catálogo todavía no contiene. Ambos casos “fallan una condición”, pero no significan lo mismo. El rango imposible suele justificar reject; el catálogo incompleto puede pedir review.',
        'Con exclusividad de ramas y guards, el motor ya puede combinar **reglas de dominio**: rangos numéricos y listas permitidas. Una **allowlist** es el conjunto de valores admitidos (`ALLOWED_REGIONES = {"R-NORTE", "R-SUR", ...}`). Si el valor no está, suele ir a **`review`** (dato desconocido) o **`reject`** (política estricta). Nombra constantes en **`UPPER_CASE`**.',
        'Un **rango** usa comparaciones o encadenamiento: `MIN_EDAD <= edad <= MAX_EDAD`. Combina reglas con **`and`/`or`** de forma explícita; documenta si el fallo de allowlist es distinto del fallo de rango (códigos `NOT_IN_ALLOWLIST` vs. `OUT_OF_RANGE`).',
        'Tri-estado en dominio: **accept** (cumple), **reject** (viola una regla estricta) y **review** (ausente, desconocido o valor atípico que requiere revisión). El cero en montos suele ser accept si el invariante lo permite.',
        '**No confundas desconocido con inválido.** `NOT_IN_ALLOWLIST` describe la relación entre un valor y un catálogo; `OUT_OF_RANGE` describe una violación numérica. El status final depende de la política, pero conservar códigos distintos permite revisar el catálogo sin ocultar un error de rango.',
        '**Predice la pareja, no una condición aislada.** En el ejemplo, explica por qué `("R-FUERA", 30)` va a review y `("R-COSTA", 15)` a reject. Después cambia solo una pieza de cada pareja y vuelve a predecir. Si ambos casos terminan en el mismo status “porque algo falló”, has borrado información que operaciones necesita. T3-B formalizará estas decisiones en una tabla.',
      ],
      code: {
        language: 'python',
        title: 'regla_region_edad.py',
        code: `ALLOWED_REG = {"R-NORTE", "R-SUR", "R-CENTRO", "R-COSTA"}

def rule_region_edad(region, edad):
    if region is None or edad is None:
        return "review"
    if region not in ALLOWED_REG:
        return "review"
    if not (18 <= edad <= 65):
        return "reject"
    return "accept"

for r, e in [("R-NORTE", 30), ("R-FUERA", 30), ("R-COSTA", 15), (None, 40)]:
    print(r, e, "→", rule_region_edad(r, e))`,
        output: `R-NORTE 30 → accept
R-FUERA 30 → review
R-COSTA 15 → reject
None 40 → review`,
      },
      callout: {
        type: 'info',
        title: 'Catálogo sintético, política explícita',
        content:
          'Los códigos `R-NORTE`, `R-SUR`, `R-CENTRO` y `R-COSTA` son ficticios. Sirven para observar la política sin fingir que representan un padrón oficial. En un proyecto real, la allowlist debe tener dueño, versión y procedimiento de actualización.',
      },
    },
    {
      heading: 'Tablas de decisión y match/case',
      subtopicId: 'S03-T3-B',
      paragraphs: [
        'Cuando una mesa de ayuda global añade un estado nuevo, el peligro no es solo olvidar una línea de Python: es que dos equipos interpreten el código de manera distinta. Una tabla de decisión obliga a discutir primero el significado —condición y acción— y solo después la sintaxis que lo implementa.',
        'En T3-A combinaste allowlist y rango con `if`. Aquí el motor escala a **muchas ramas con el mismo sujeto** (un código de estado). Una **decision table** es una tabla de negocio: filas de condiciones → acción. Primero la escribes en español (o en un dict de ejemplos); después la implementas. Evita inventar ramas en el código que no estén en la tabla.',
        '**`match` / `case`** (Python 3.10+) brilla cuando el sujeto es un **literal o estado finito** (`"OK"`, `"MISSING"`, códigos de error). Soporta **OR patterns** (`case "A" | "B":`) y el comodín **`case _:`** para el valor por defecto. El primer `case` que coincide gana. Es la misma semántica de negocio que un `if/elif` bien ordenado; cambia la forma, no la política.',
        '**Cuándo preferir `if`**: rangos numéricos, combinaciones de varios campos, o condiciones que no son patrones de estructura. `match` no depreca `if`; elige por **claridad**. En el You Do usarás dicts `{status, code, message}`: la tabla decide el `code`; el mensaje lo redactas en T4.',
        '**Modelo mental: tabla primero, código después.** Si puedes escribir `OK → accept`, `MISSING → review` y `OUT_OF_RANGE → reject`, puedes implementar la misma política con un dict, `if/elif` o `match`. Cambiar de sintaxis no autoriza cambiar una fila. El comodín tampoco significa “aceptar todo”: aquí conserva lo desconocido en review.',
        '**Predice la equivalencia.** Antes de ejecutar, completa en papel las filas para `OK`, `MISSING`, `OUT_OF_RANGE` y `FOO`. Luego pregunta: ¿qué implementación hace más visible esta tabla? Para códigos finitos, `match` suele leer como la especificación; para `18 <= edad <= 65`, `if` expresa mejor el rango. En T4 convertirás la tabla en promesas y contraejemplos.',
      ],
      code: {
        language: 'python',
        title: 'codigo_a_status.py',
        code: `def status_match(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING" | "NEEDS_REVIEW":
            return "review"
        case "OUT_OF_RANGE" | "NOT_IN_ALLOWLIST" | "BAD_TYPE":
            return "reject"
        case _:
            return "review"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO"]:
    print(c, "→", status_match(c))`,
        output: `OK → accept
MISSING → review
OUT_OF_RANGE → reject
FOO → review`,
      },
      callout: {
        type: 'warning',
        title: 'Python 3.10+',
        content:
          'El curso usa Python 3.12. Si trabajas con una versión anterior a 3.10, implementa la misma tabla con `if/elif`. Tu evidencia de aprendizaje es que las filas producen los mismos estados, no que uses la sintaxis más nueva.',
      },
    },
    {
      heading: 'Invariantes: promesas que el dato debe cumplir',
      subtopicId: 'S03-T4-A',
      paragraphs: [
        'Un equipo de logística de Copenhague puede escribir cien líneas impecables y aun discutir qué significa “dirección válida”. El problema no es de sintaxis: falta una promesa compartida. Un invariante convierte esa expectativa borrosa en una frase que admite ejemplos y contraejemplos.',
        'Ya armaste booleanos, control de flujo y tablas de decisión; ahora cierras el motor: **documentar promesas** y **probar cada rama**. Un **invariante** de campo es una promesa en español: “`contacto` es un str de 9 dígitos, o `None` si aún no se capturó”. No es código todavía: es **especificación**. Los **ejemplos canónicos** (accept/reject/review/missing) son la forma más barata de validar que el invariante es usable.',
        'Mínimo profesional: **al menos un ejemplo por estado de decisión** que tu regla produce. Si solo pruebas el camino feliz, el validador miente en producción.',
        '`assert` sirve en desarrollo y tests, pero **no** como única validación de intake en producción (`python -O` desactiva asserts). Usa returns con `status`/`code`/`message` para reglas de negocio.',
        '**Especificar no es describir el código.** “La función usa un `if`” no es un invariante; “`contacto` contiene nueve dígitos o está ausente” sí puede discutirse con una persona de negocio. Los ejemplos convierten la frase en una frontera observable: uno que cumple, uno que viola y uno que requiere review.',
        '**Busca el contraejemplo.** Antes de ejecutar, pregunta qué debería ocurrir con `"  "`, `"12345"`, `None` y un entero de nueve dígitos. Si la frase no permite decidir uno de ellos, no agregues otra rama todavía: reescribe el invariante. En T4-B cada caso se convertirá en un mensaje accionable y una prueba de regresión.',
      ],
      code: {
        language: 'python',
        title: 'invariante_contacto.py',
        code: `def validate_contacto(c):
    if c is None:
        return "review"
    if not isinstance(c, str) or not c.strip():
        return "reject"
    digits = c.strip()
    if not digits.isdigit() or len(digits) != 9:
        return "reject"
    return "accept"

regla = {
    "field": "contacto",
    "invariant_text": "contacto es str de 9 dígitos o None (review)",
    "examples": [
        {"value": "999000111", "expected": "accept"},
        {"value": "12345", "expected": "reject"},
        {"value": None, "expected": "review"},
        {"value": "  ", "expected": "reject"},
    ],
}
for ex in regla["examples"]:
    got = validate_contacto(ex["value"])
    print(repr(ex["value"]), "→", got, "ok=", got == ex["expected"])`,
        output: `'999000111' → accept ok= True
'12345' → reject ok= True
None → review ok= True
'  ' → reject ok= True`,
      },
      callout: {
        type: 'tip',
        title: 'Ejemplos = especificación ejecutable',
        content:
          'Si otra persona no puede proponer un valor que cumpla y otro que rompa tu invariante, la frase aún es demasiado vaga. Reescríbela antes de programar: una condición precisa ahorra ramas defensivas y discusiones posteriores.',
      },
    },
    {
      heading: 'Mensajes que se pueden ejecutar y pruebas por rama',
      subtopicId: 'S03-T4-B',
      paragraphs: [
        'En un servicio de salud de Toronto, “Error” no ayuda a corregir una fecha, un tipo ni un rango. Un buen motor no solo decide; deja una explicación que otra persona puede convertir en acción y una prueba que impide que esa explicación se vuelva falsa tras un cambio.',
        'Con invariantes y ejemplos canónicos (T4-A), el motor ya decide bien; falta **comunicar** el fallo y **probar** cada rama. Un mensaje accionable nombra el **campo**, el **problema** y la **acción esperada**: `Campo \'edad\'=-5 fuera de rango; usa 0–120.` Evita mensajes vagos como Error o inválido. Códigos estables (`MISSING`, `OUT_OF_RANGE`, `NOT_IN_ALLOWLIST`, `NEEDS_REVIEW`, `OK`) permiten métricas y i18n después.',
        '**Un test por rama** del validador: si tienes 4 caminos (None, tipo mal, rango, OK), necesitas ≥4 casos. El else/default también cuenta. Esta es la misma disciplina que usarás en el You Do (`_run_tests` del motor de reglas).',
        'No registres secretos ni información personal real; en el curso solo usamos datos sintéticos. El ciclo **prueba roja → ajustar regla → verde** permite depurar errores de uno en fronteras (`>= 18` frente a `> 18`). Cuando el mensaje y la prueba expresan el mismo contrato, la persona responsable de datos puede integrar el cambio con confianza.',
        '**Tres capas, una misma verdad.** El `status` guía el flujo; el `code` permite contar causas de manera estable; el `message` orienta a una persona. La prueba debe verificar al menos la parte que no puede cambiar sin decisión de negocio. Si el código dice `OUT_OF_RANGE` y el mensaje recomienda un rango diferente, el sistema se contradice aunque el test de “camino feliz” pase.',
        '**Predice la prueba roja.** Si la política acepta 18, ¿qué assert revela el error de escribir `edad > 18`? No cambies el expected para obtener verde: la prueba representa el contrato. Corrige la condición, ejecuta de nuevo y explica qué frontera protegiste. Esa disciplina cierra S03 y prepara el motor completo del You Do.',
      ],
      code: {
        language: 'python',
        title: 'tests_ramas_edad.py',
        code: `def validate_edad_msg(edad):
    if edad is None:
        return {
            "status": "review",
            "code": "MISSING",
            "message": "Campo 'edad' ausente: envía un entero 0–120 o marca como desconocido.",
        }
    if not isinstance(edad, int):
        return {
            "status": "reject",
            "code": "BAD_TYPE",
            "message": f"Campo 'edad' recibió {edad!r}; se espera int, no {type(edad).__name__}.",
        }
    if edad < 0 or edad > 120:
        return {
            "status": "reject",
            "code": "OUT_OF_RANGE",
            "message": f"Campo 'edad'={edad} fuera de rango; usa 0–120.",
        }
    return {"status": "accept", "code": "OK", "message": "edad OK"}

tests = [(None, "MISSING"), ("x", "BAD_TYPE"), (-5, "OUT_OF_RANGE"), (35, "OK")]
for val, code in tests:
    r = validate_edad_msg(val)
    assert r["code"] == code
    print("PASS", val, r["code"])`,
        output: `PASS None MISSING
PASS x BAD_TYPE
PASS -5 OUT_OF_RANGE
PASS 35 OK`,
      },
      callout: {
        type: 'success',
        title: 'Hacia el You Do',
        content:
          'Ya tienes las piezas: una pregunta booleana, una rama dominante, una política tri-estado, un invariante y una prueba por rama. En el You Do las unirás en tres validadores pequeños antes de componer `validate_record`; construir por capas hará localizable cada error.',
      },
    },
  ],
  iDo: {
    intro:
      'En estas ocho demostraciones observarás cómo piensa una persona que revisa reglas, no solo cómo escribe Python. Antes de ejecutar cada bloque, detente en la pregunta de predicción del preámbulo y anota una salida. Después compara tu modelo con la salida real, recorre la decisión línea por línea y cierra con la retrospectiva: qué error evitó el diseño y dónde reaparecerá en el We Do. Puedes usar Pyodide o Python 3.12 local. Todos los registros son sintéticos; la evidencia debe provenir de la ejecución, nunca de una salida inventada.',
    steps: [
      {
        demoId: 'S03-T1-A-DEMO',
        subtopicId: 'S03-T1-A',
        environment: 'browser-pyodide',
        description: 'Comparar región y monto de un registro sintético',
        preamble:
          'Antes de armar un `if` de negocio, el analista de intake debe *predecir* booleanos sueltos. Aquí un registro sintético de `CASO-LIM-003` trae `region = "R-NORTE"` y `monto = 1500` frente a un set de regiones permitidas. No escribas aún: ejecuta y confirma cada `True`/`False`. Presta atención al encadenamiento `1000 <= monto <= 2000` y a `region in ALLOWED` — son el vocabulario del motor de reglas. Solo datos ficticios; no hay PII real.',
        code: {
          language: 'python',
          title: 'S03-T1-A-DEMO — comparar_region_monto',
          code: `region = "R-NORTE"
monto = 1500
ALLOWED = {"R-NORTE", "R-SUR", "R-CENTRO"}

print("region == 'R-NORTE' →", region == "R-NORTE")
print("region != 'R-OESTE' →", region != "R-OESTE")
print("monto >= 1000 →", monto >= 1000)
print("monto < 500 →", monto < 500)
print("region in ALLOWED →", region in ALLOWED)
print("'R-OESTE' not in ALLOWED →", "R-OESTE" not in ALLOWED)
print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
`,
          output: `region == 'R-NORTE' → True
region != 'R-OESTE' → True
monto >= 1000 → True
monto < 500 → False
region in ALLOWED → True
'R-OESTE' not in ALLOWED → True
1000 <= monto <= 2000 → True`,
        },
        why:
          'La demo separa siete preguntas pequeñas antes de combinarlas. Esa separación permite atribuir un `False` a una frontera, a un literal o al catálogo correcto, en lugar de culpar a un `if` grande. Lee cada línea como una proposición verificable: sujeto, operador y referencia.',
        retrospective:
          'Explica sin mirar la salida por qué `monto < 500` es `False` y por qué `"R-OESTE" not in ALLOWED` es `True`. Luego cambia una sola entrada y predice qué líneas deben permanecer iguales: esa prueba contrafactual distingue comprensión de memorización. En We Do repararás expresiones invertidas y practicarás `in` sobre una allowlist.',
      },
      {
        demoId: 'S03-T1-B-DEMO',
        subtopicId: 'S03-T1-B',
        environment: 'browser-pyodide',
        description: 'Tres campos: None, 0 y vacío bajo reglas distintas',
        preamble:
          'En intake, `None`, `0` y `""` son todos *falsy*, pero la política de monto **no** los trata igual. Esta demo muestra `bool(v)` al lado de una política real: ausencia → review, cero válido → accept, negativo → reject. Observa la fila de `monto_cero`: si crees que “falsy = rechazar”, el pipeline miente. No edites aún; predice cada línea de `policy` y compara con la salida.',
        code: {
          language: 'python',
          title: 'S03-T1-B-DEMO — none_cero_vacio',
          code: `def decide_monto(m):
    if m is None:
        return "review: ausente"
    if m == 0:
        return "accept: cero válido"
    if m < 0:
        return "reject: negativo"
    return "accept: positivo"

campos = {"monto_none": None, "monto_cero": 0, "nota": "", "monto_ok": 150}
for k, v in campos.items():
    print(f"{k}: valor={v!r} bool={bool(v)}")

for v in [None, 0, -5, 150]:
    print("policy", v, "→", decide_monto(v))`,
          output: `monto_none: valor=None bool=False
monto_cero: valor=0 bool=False
nota: valor='' bool=False
monto_ok: valor=150 bool=True
policy None → review: ausente
policy 0 → accept: cero válido
policy -5 → reject: negativo
policy 150 → accept: positivo`,
        },
        why:
          'La columna `bool=` describe el comportamiento del lenguaje; la columna `policy` describe la decisión del dominio. Verlas juntas impide una inferencia peligrosa: que dos objetos falsy merecen el mismo status. El contraste entre `None` y `0` es el núcleo causal de la demo.',
        retrospective:
          'Formula la política en voz alta: “si está ausente, review; si está presente, evalúo su valor”. ¿Qué cambiaría para un campo donde la cadena vacía sí significa ausencia? La sintaxis puede variar, pero el hábito permanece: presencia con un chequeo explícito y validez con otra regla. En We Do repararás un validador que hoy rechaza el cero.',
      },
      {
        demoId: 'S03-T2-A-DEMO',
        subtopicId: 'S03-T2-A',
        environment: 'browser-pyodide',
        description: 'Clasificar score de calidad en accept/review/reject (incluye fronteras)',
        preamble:
          'Un score de calidad de intake debe caer en **una sola** etiqueta: accept, review o reject. Aquí `classify_score` usa `if` / `elif` / `else` con umbrales documentados. Corre el bucle y fíjate en las fronteras: **80** debe ser accept (no review) y **50** review (no reject). No escribas; traza mentalmente cada valor antes de mirar la salida embebida.',
        code: {
          language: 'python',
          title: 'S03-T2-A-DEMO — classify_score',
          code: `def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

# Interior + fronteras exactas (80 y 50 deben quedar en la rama superior)
for s in [95, 60, 30, 80, 50]:
    print(s, "→", classify_score(s))`,
          output: `95 → accept
60 → review
30 → reject
80 → accept
50 → review`,
        },
        why:
          'Los valores interiores muestran las tres categorías; 80 y 50 revelan la política exacta de las fronteras. La cadena no “elige la mejor” rama: se detiene en la primera verdadera. Por eso el orden forma parte del contrato, no es un detalle estético.',
        retrospective:
          'Antes de seguir, intercambia mentalmente las dos condiciones: ¿qué ocurriría con 95? Si respondes review, has demostrado por qué el umbral más alto va primero. El error clásico es usar dos `if` y sobrescribir el status; en We Do verás el fallo de forma deliberada y construirás la versión exclusiva.',
      },
      {
        demoId: 'S03-T2-B-DEMO',
        subtopicId: 'S03-T2-B',
        environment: 'browser-pyodide',
        description: 'De pirámide a guards en validate_edad',
        preamble:
          'Un validador profesional no anida tres niveles: saca precondiciones con **guards** (early return). Observa el orden de `validate_edad`: primero `None` (MISSING), luego tipo (BAD_TYPE), luego rango, luego menores (NEEDS_REVIEW), y al final accept. Nota el uso de `repr(e)`: deja claro que `"25"` es str, no int. No edites; sigue cada caso del bucle hasta el dict de salida.',
        code: {
          language: 'python',
          title: 'S03-T2-B-DEMO — validate_edad_guards',
          code: `def validate_edad(edad):
    if edad is None:
        return {"status": "review", "code": "MISSING"}
    if not isinstance(edad, int):
        return {"status": "reject", "code": "BAD_TYPE"}
    if edad < 0 or edad > 120:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    if edad < 18:
        return {"status": "review", "code": "NEEDS_REVIEW"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", -1, 15, 30, 200]:
    print(repr(e), "→", validate_edad(e))`,
          output: `None → {'status': 'review', 'code': 'MISSING'}
'25' → {'status': 'reject', 'code': 'BAD_TYPE'}
-1 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}
200 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}`,
        },
        why:
          'Cada guarda elimina una clase de entrada antes de que una operación incompatible pueda tocarla. `None` no llega a la comparación numérica; `"25"` no se disfraza de 25 gracias a `repr`; el camino accept queda reservado a quien superó todas las precondiciones.',
        retrospective:
          'Dibuja el embudo de casos y señala dónde sale `None`, dónde sale `"25"` y qué evidencia queda al llegar a accept. Después pregunta qué prueba detectaría que un refactor cambió review por reject. En We Do completarás guardas y convertirás una pirámide en salidas tempranas sin alterar su semántica.',
      },
      {
        demoId: 'S03-T3-A-DEMO',
        subtopicId: 'S03-T3-A',
        environment: 'browser-pyodide',
        description: 'Regla combinada región + edad',
        preamble:
          'El motor de reglas combina dos políticas de dominio: **allowlist** de región y **rango** de edad. En `CASO-LIM-003`, región desconocida o ausente va a **review** (catálogo incompleto), no a reject duro; edad fuera de 18–65 va a **reject**. Ejecuta los cuatro pares y predice el string de salida antes de leerlo. Solo regiones sintéticas de Perú; no es padrón oficial.',
        code: {
          language: 'python',
          title: 'S03-T3-A-DEMO — region_edad',
          code: `ALLOWED_REG = {"Lima", "Arequipa", "Cusco", "Piura"}

def rule_region_edad(region, edad):
    if region is None or edad is None:
        return "review"
    if region not in ALLOWED_REG:
        return "review"
    if not (18 <= edad <= 65):
        return "reject"
    return "accept"

for r, e in [("Lima", 30), ("Tacna", 30), ("Piura", 15), (None, 40)]:
    print(r, e, "→", rule_region_edad(r, e))`,
          output: `Lima 30 → accept
Tacna 30 → review
Piura 15 → reject
None 40 → review`,
        },
        why:
          'La función no agrupa todos los fallos bajo una etiqueta. Una región desconocida conserva la posibilidad de corregir el catálogo y va a review; una edad fuera de la banda viola una regla explícita y va a reject. El orden preserva la causa antes de devolver el status.',
        retrospective:
          'Compara `("R-FUERA", 30)` con `("R-COSTA", 15)`: ambos fallan una condición, pero solo uno viola un rango. ¿Qué código estable darías a cada causa? Si solo puedes responder “falló”, aún falta información. En We Do separarás desconocidos, valores atípicos y rechazos duros.',
      },
      {
        demoId: 'S03-T3-B-DEMO',
        subtopicId: 'S03-T3-B',
        environment: 'browser-pyodide',
        description: 'Misma tabla en if/elif y en match',
        preamble:
          'La misma **tabla de decisión** (código → status) puede vivir en `if/elif` o en `match/case`. Esta demo implementa ambas y comprueba `same= True` en cada fila, incluido el comodín para códigos desconocidos (`FOO`). Observa los OR patterns (`MISSING | NEEDS_REVIEW`). Requiere Python 3.10+ (el curso usa 3.12). No inventes ramas que no estén en la tabla.',
        code: {
          language: 'python',
          title: 'S03-T3-B-DEMO — if_vs_match',
          code: `def status_if(code: str) -> str:
    if code == "OK":
        return "accept"
    elif code in ("MISSING", "NEEDS_REVIEW"):
        return "review"
    elif code in ("OUT_OF_RANGE", "NOT_IN_ALLOWLIST", "BAD_TYPE"):
        return "reject"
    else:
        return "review"

def status_match(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING" | "NEEDS_REVIEW":
            return "review"
        case "OUT_OF_RANGE" | "NOT_IN_ALLOWLIST" | "BAD_TYPE":
            return "reject"
        case _:
            return "review"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO", "NEEDS_REVIEW"]:
    a, b = status_if(c), status_match(c)
    print(c, a, b, "same=", a == b)
`,
          output: `OK accept accept same= True
MISSING review review same= True
OUT_OF_RANGE reject reject same= True
FOO review review same= True
NEEDS_REVIEW review review same= True`,
        },
        why:
          'La columna `same=` actúa como una pequeña prueba de equivalencia: cambia la forma del programa sin permitir que cambie la política. `case _` hace visible la fila por defecto y evita que un código nuevo caiga accidentalmente en accept.',
        retrospective:
          'Tapa una implementación y predice sus cinco resultados a partir de la tabla, no de la sintaxis. Luego explica por qué un rango como 18–65 se lee mejor con comparaciones que con una lista de `case`. En We Do corregirás una tabla y defenderás tu elección entre `if` y `match`.',
      },
      {
        demoId: 'S03-T4-A-DEMO',
        subtopicId: 'S03-T4-A',
        environment: 'browser-pyodide',
        description: 'Invariante de campo contacto + 4 ejemplos',
        preamble:
          'Un invariante no es solo código: es una **promesa en español** más ejemplos accept/reject/review. Aquí `contacto` debe ser str de 9 dígitos o `None` (review). Corre la lista `examples` y verifica `ok= True` en cada fila; `repr` hace legible el caso de solo espacios. Si un colega no puede inventar un contraejemplo en 30 segundos, el invariante está vago.',
        code: {
          language: 'python',
          title: 'S03-T4-A-DEMO — invariante_contacto',
          code: `def validate_contacto(c):
    if c is None:
        return "review"
    if not isinstance(c, str) or not c.strip():
        return "reject"
    digits = c.strip()
    if not digits.isdigit() or len(digits) != 9:
        return "reject"
    return "accept"

regla = {
    "field": "contacto",
    "invariant_text": "contacto es str de 9 dígitos o None (review)",
    "examples": [
        {"value": "999000111", "expected": "accept"},
        {"value": "12345", "expected": "reject"},
        {"value": None, "expected": "review"},
        {"value": "  ", "expected": "reject"},
    ],
}
print(regla["invariant_text"])
for ex in regla["examples"]:
    got = validate_contacto(ex["value"])
    print(repr(ex["value"]), "→", got, "ok=", got == ex["expected"])`,
          output: `contacto es str de 9 dígitos o None (review)
'999000111' → accept ok= True
'12345' → reject ok= True
None → review ok= True
'  ' → reject ok= True`,
        },
        why:
          'La frase declara la promesa; `examples` intenta refutarla con estados distintos. `repr` vuelve observable una entrada que a simple vista parecería vacía. Juntas, especificación y ejemplos permiten discutir la regla antes de ocultarla dentro de condiciones.',
        retrospective:
          'Propón un quinto ejemplo que no repita los cuatro existentes y explica qué rama cubre. Si no encuentras uno, intenta romper la frase con un tipo inesperado. En We Do escribirás invariantes de edad y apellidos, y usarás un contraejemplo para suavizar una política demasiado estricta.',
      },
      {
        demoId: 'S03-T4-B-DEMO',
        subtopicId: 'S03-T4-B',
        environment: 'browser-pyodide',
        description: 'Suite mínima de pruebas del motor de reglas',
        preamble:
          'Decidir bien no basta: hay que **comunicar** el fallo y **probar** cada rama. Esta suite de `validate_edad_msg` devuelve `{status, code, message}` y un assert por código (`MISSING`, `BAD_TYPE`, `OUT_OF_RANGE`, `OK`). Lee cada mensaje: nombra campo, problema y acción. Es la misma disciplina del `_run_tests` del You Do. Solo datos sintéticos; no loguees PII.',
        code: {
          language: 'python',
          title: 'S03-T4-B-DEMO — suite_edad',
          code: `def validate_edad_msg(edad):
    if edad is None:
        return {
            "status": "review",
            "code": "MISSING",
            "message": "Campo 'edad' ausente: envía un entero 0–120 o marca como desconocido.",
        }
    if not isinstance(edad, int):
        return {
            "status": "reject",
            "code": "BAD_TYPE",
            "message": f"Campo 'edad' recibió {edad!r}; se espera int, no {type(edad).__name__}.",
        }
    if edad < 0 or edad > 120:
        return {
            "status": "reject",
            "code": "OUT_OF_RANGE",
            "message": f"Campo 'edad'={edad} fuera de rango; usa 0–120.",
        }
    return {"status": "accept", "code": "OK", "message": "edad OK"}

tests = [(None, "MISSING"), ("x", "BAD_TYPE"), (-5, "OUT_OF_RANGE"), (35, "OK")]
for val, code in tests:
    r = validate_edad_msg(val)
    assert r["code"] == code
    print("PASS", val, r["code"])
    print(" ", r["message"])`,
          output: `PASS None MISSING
  Campo 'edad' ausente: envía un entero 0–120 o marca como desconocido.
PASS x BAD_TYPE
  Campo 'edad' recibió 'x'; se espera int, no str.
PASS -5 OUT_OF_RANGE
  Campo 'edad'=-5 fuera de rango; usa 0–120.
PASS 35 OK
  edad OK`,
        },
        why:
          'La suite enlaza tres artefactos: el valor activa una rama, el código estable identifica la causa y el mensaje ofrece una acción. El assert protege el contrato; el print permite inspeccionar la explicación. Ninguno sustituye al otro.',
        retrospective:
          'Elige una línea y explica qué cambio defectuoso la volvería roja. Después revisa los mensajes: ¿una persona podría corregir el dato sin leer el código? En We Do transformarás mensajes vagos, construirás casos por rama y usarás una prueba roja para reparar la frontera inclusiva de 18.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora la responsabilidad pasa gradualmente a tus manos: **E1 guiado → E2 independiente → E3 transferencia** en cada uno de los ocho subtemas. Antes de tocar el starter, lee contexto, meta, éxito y límites; luego escribe una predicción concreta. Usa la primera pista para recuperar el modelo mental y la segunda solo si aún no puedes avanzar. Al ejecutar, compara evidencia, no apariencia: una salida correcta obtenida con `print(True)` no demuestra la habilidad. Cierra cada ejercicio respondiendo la retrospectiva y nombrando el error que ya sabrías detectar en una revisión de código. Los 24 ejercicios usan únicamente `CASO-LIM-003` y datos sintéticos.',
    steps: [
      // ——— S03-T1-A ———
      {
        subtopicId: 'S03-T1-A',
        kind: 'guided',
        title: 'Comparar edad y región (booleanos sueltos)',
        preamble:
          '- **Contexto:** en `CASO-LIM-003` el motor aún no escribe `if`; primero debe predecir booleanos de edad y región.\n- **Meta:** corregir cinco comparaciones invertidas o incompletas.\n- **Éxito:** con `edad = 25` y `region = "R-SUR"`, imprimes exactamente: `True`, `True`, `True`, `False`, `True` (una línea cada una).\n- **Límites:** no uses `if` todavía; no inventes literales fijos; solo imprime la expresión booleana.',
        id: 'S03-T1-A-E1',
        instruction:
          '1. Abre el starter: el DEFECT invierte o sustituye las cinco expresiones pedidas.\n2. Deja `edad = 25` y `region = "R-SUR"`.\n3. Imprime, en este orden: `edad >= 18`, `edad < 65`, `18 <= edad <= 65`, `region == "R-NORTE"`, `region != "R-OESTE"`.\n4. Ejecuta y compara con el contrato de cinco booleanos.',
        hint: 'Usa print(expresion) directamente; no hace falta if todavía.',
        hints: [
          'Usa print(expresion) directamente; no hace falta if todavía.',
          'El encadenamiento 18 <= edad <= 65 es True para 25. region == "R-NORTE" es False (region es R-SUR).',
        ],
        edgeCases: ['igualdad en frontera min/max si cambias edad a 18 o 65'],
        tests: 'assert expected bools: True, True, True, False, True',
        feedback:
          'Las cinco líneas deben salir de expresiones reales, no de `print(True)`. Si `region == "R-NORTE"` te da True, aún usas el operando incorrecto: `region` es R-SUR.',
        retrospective:
          'Predecir booleanos sueltos es el hábito anterior al `if` de negocio. Explica qué operando corregiste en cada línea y cambia `edad` a 18: ¿qué resultados deberían permanecer iguales? Si imprimiste el valor esperado en lugar de la expresión, obtuviste teatro, no evidencia. Conserva estas preguntas porque alimentarán rangos y allowlists.',
        starterCode: {
          language: 'python',
          title: 'comparar_edad_region.py',
          code: `# CASO-LIM-003 · comparaciones edad/región
# DEFECT: resultados invertidos / literales fijos incorrectos
edad = 25
region = "R-SUR"
print(edad < 18)
print(edad >= 65)
print(edad < 18 or edad > 65)
print(region != "R-OESTE")
print(region == "R-NORTE")
`,
        },
        solutionCode: {
          language: 'python',
          title: 'comparar_edad_region.py',
          code: `edad = 25
region = "R-SUR"

print(edad >= 18)
print(edad < 65)
print(18 <= edad <= 65)
print(region == "R-NORTE")
print(region != "R-OESTE")`,
          output: `True
True
True
False
True`,
        },
      },
      {
        subtopicId: 'S03-T1-A',
        kind: 'independent',
        title: 'Membership en allowlist de tipo de documento',
        preamble:
          '- **Contexto:** los códigos de documento del intake (`DNI`, `CE`, `PAS`) se validan con pertenencia, no con un `if` por cada literal.\n- **Meta:** usar `t in TIPOS_DOC` y ver el efecto de mayúsculas.\n- **Éxito:** para `DNI`, `dni`, `RUC` imprimes `t → True/False` → `True`, `False`, `False`.\n- **Límites:** no uses `t == "DNI"`; no normalices a upper en este ejercicio (el punto es documentar sensibilidad).',
        id: 'S03-T1-A-E2',
        instruction:
          '1. Mantén `TIPOS_DOC = {"DNI", "CE", "PAS"}`.\n2. Recorre `["DNI", "dni", "RUC"]`.\n3. Sustituye el DEFECT (`t == "DNI"`) por `t in TIPOS_DOC`.\n4. Imprime `t →` y el booleano en cada iteración.',
        hint: 'for t in lista: print(t, "→", t in TIPOS_DOC)',
        hints: [
          'for t in lista: print(t, "→", t in TIPOS_DOC)',
          'La comparación distingue mayúsculas de minúsculas: "dni" ≠ "DNI". RUC no está en el conjunto.',
        ],
        edgeCases: ['case sensitivity de códigos'],
        tests: '3 inputs → True, False, False',
        feedback:
          'Si `dni` te da True, aún comparas con `==` o normalizaste de más. El contrato de este ejercicio es **literal** `in TIPOS_DOC`: mayúsculas distintas → `False` a propósito, no un bug de Python.',
        retrospective:
          'La allowlist no “entiende” que `dni` y `DNI` quizá representen el mismo código; aplica igualdad literal. Decide y escribe una política: ¿normalizas antes o rechazas/revisas el formato inesperado? Comprueba que tu respuesta explicaría el `False` a otra persona. En E3 separarás identidad, igualdad y ausencia.',
        starterCode: {
          language: 'python',
          title: 'allowlist_tipo_doc.py',
          code: `# CASO-LIM-003 · membership set TIPOS_DOC
# DEFECT: compara con == lista
TIPOS_DOC = {"DNI", "CE", "PAS"}
for t in ["DNI", "dni", "RUC"]:
    print(t, "→", t == "DNI")
`,
        },
        solutionCode: {
          language: 'python',
          title: 'allowlist_tipo_doc.py',
          code: `TIPOS_DOC = {"DNI", "CE", "PAS"}
for t in ["DNI", "dni", "RUC"]:
    print(t, "→", t in TIPOS_DOC)`,
          output: `DNI → True
dni → False
RUC → False`,
        },
      },
      {
        subtopicId: 'S03-T1-A',
        kind: 'transfer',
        title: '`is None` frente a `==` en validadores',
        preamble:
          '- **Contexto:** en validadores de intake, chequear ausencia con el operador equivocado genera bugs silenciosos.\n- **Meta:** diagnosticar `is` vs `==` con `None` y con `True`/`1`.\n- **Éxito:** salida `True` / `True` / `False` más una nota que diga cuándo usar cada operador.\n- **Límites:** no uses `is` para comparar enteros o strings de negocio; solo para `None` (identidad de singleton).',
        id: 'S03-T1-A-E3',
        instruction:
          '1. Con `valor = None`, imprime el resultado de `valor is None` (corrige el DEFECT que usa `==`).\n2. Imprime `True == 1` y `True is 1` (corrige el cruce del starter).\n3. Añade un `print` de nota: cuándo usar `is` y cuándo `==` en intake.',
        hint: 'is None para ausencia; == para valores de negocio. No uses is con enteros.',
        hints: [
          'is None para ausencia; == para valores de negocio. No uses is con enteros.',
          'True == 1 es True (bool subtipo int) pero True is 1 es False: identidad ≠ igualdad.',
        ],
        edgeCases: ['True == 1', 'is None idiom'],
        tests: 'rubric + fixed snippet: True, True, False + nota',
        feedback:
          'Si `True is 1` te sale True, aún cruzaste los operadores del starter. Corrige a `is None` / `==` / `is` en ese orden de líneas; la nota debe decir *cuándo* usar cada uno, no solo repetir “identidad”.',
        retrospective:
          '`is` pregunta identidad; `==` compara valores. Escribe un ejemplo adicional con una cadena de negocio y explica por qué `is` sería la pregunta equivocada. Después completa la frase: “uso `is None` cuando necesito saber ___; uso `==` cuando necesito saber ___”. Esa distinción decidirá la rama review del motor.',
        starterCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `# CASO-LIM-003 · is None vs. ==
# DEFECT: confunde is y ==
valor = None
print("valor is None →", valor == None)
print("True == 1 →", True is 1)
print("True is 1 →", True == 1)
print("Nota:", "is es identidad")
`,
        },
        solutionCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `valor = None
print("valor is None →", valor is None)
print("True == 1 →", True == 1)
print("True is 1 →", True is 1)
print("Nota:", "usa is solo para None; == para valores de negocio")`,
          output: `valor is None → True
True == 1 → True
True is 1 → False
Nota: usa is solo para None; == para valores de negocio`,
        },
      },
      // ——— S03-T1-B ———
      {
        subtopicId: 'S03-T1-B',
        kind: 'guided',
        title: 'Tabla de truthiness (falsy vs truthy)',
        preamble:
          '- **Contexto:** el `if` de Python usa truthiness; en intake eso choca con ceros y strings vacíos válidos.\n- **Meta:** imprimir `repr(v) → bool(v)` para una lista canónica de valores.\n- **Éxito:** nueve `False` y tres `True` (`"x"`, `1`, `[0]`) en el orden del starter.\n- **Límites:** no reemplaces `bool(v)` por `v is not None`; no reordenes la lista.',
        id: 'S03-T1-B-E1',
        instruction:
          '1. Revisa el DEFECT: el starter imprime `v is not None`, que no es truthiness.\n2. Recorre la lista `vals` dada.\n3. Imprime `repr(v)` y `bool(v)` en cada paso.\n4. Confirma que `range(0)` es falsy y `[0]` es truthy.',
        hint: 'for v in lista: print(repr(v), "→", bool(v))',
        hints: [
          'for v in lista: print(repr(v), "→", bool(v))',
          'range(0) es falsy; [0] es truthy (lista no vacía).',
        ],
        edgeCases: ['range(0)', 'False', '[0] truthy'],
        tests: 'checklist: 9 falsy + 3 truthy en el orden dado',
        feedback:
          'Si ves nueve `True` al inicio, aún imprimes `v is not None`. Sustituye por `bool(v)` y relee `[0]` vs `range(0)`: lista no vacía es truthy; rango vacío es falsy.',
        retrospective:
          'No memorices doce valores como una letanía: agrúpalos por idea —ausencia, cero, colección vacía— y contrástalos con una colección no vacía como `[0]`. ¿Qué entrada es “no None” pero sigue siendo falsy? Si tu respuesta es varias, ya ves por qué presencia y truthiness no son sinónimos. E2 añadirá short-circuit a este modelo.',
        starterCode: {
          language: 'python',
          title: 'tabla_truthiness.py',
          code: `# CASO-LIM-003 · truthiness
# DEFECT: usa is not None como bool
vals = [None, False, 0, 0.0, "", [], {}, set(), range(0), "x", 1, [0]]
for v in vals:
    print(repr(v), "→", v is not None)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'tabla_truthiness.py',
          code: `vals = [None, False, 0, 0.0, "", [], {}, set(), range(0), "x", 1, [0]]
for v in vals:
    print(repr(v), "→", bool(v))`,
          output: `None → False
False → False
0 → False
0.0 → False
'' → False
[] → False
{} → False
set() → False
range(0, 0) → False
'x' → True
1 → True
[0] → True`,
        },
      },
      {
        subtopicId: 'S03-T1-B',
        kind: 'independent',
        title: 'Predecir valores de `and` / `or` (no solo bool)',
        preamble:
          '- **Contexto:** defaults de intake a menudo usan `valor or default`; hay que saber qué *objeto* devuelve la expresión.\n- **Meta:** imprimir el operando resultante de cinco expresiones `and`/`or`.\n- **Éxito:** `default`, `dato`, `0`, `99`, `0` (como en el contrato del enunciado actual).\n- **Límites:** no conviertas a `bool(...)` el resultado; imprime el valor devuelto.',
        id: 'S03-T1-B-E2',
        instruction:
          '1. El starter tiene operadores invertidos (`and` donde va `or` y viceversa).\n2. Corrige las cinco líneas: `"" or "default"`, `"dato" or "default"`, `0 and 99`, `5 and 99`, `None or 0`.\n3. Ejecuta y verifica el contrato de cinco valores.',
        hint: 'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
        hints: [
          'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
          "'' or 'default' → 'default'; 0 and 99 → 0; None or 0 → 0.",
        ],
        edgeCases: ["'' or 'default'"],
        tests: 'assert results: default, dato, 0, 99, 0',
        feedback: 'Si internalizaste el valor devuelto, dejas de “castear” mentalmente a True/False siempre.',
        retrospective:
          '`and`/`or` hacen short-circuit y devuelven un operando. Para cada línea, señala cuál operando se devuelve y en qué momento deja de evaluarse la expresión. Luego responde: ¿por qué `monto or 0` puede servir como valor por defecto, pero no demostrar que el monto estaba presente? Esa diferencia prepara el bug de E3.',
        starterCode: {
          language: 'python',
          title: 'and_or_predict.py',
          code: `# CASO-LIM-003 · or/and cortocircuito
# DEFECT: operadores invertidos (and donde va or y viceversa)
print("'' or 'default' →", "" and "default")
print("'dato' or 'default' →", "dato" and "default")
print("0 and 99 →", 0 or 99)
print("5 and 99 →", 5 or 99)
print("None or 0 →", None and 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'and_or_predict.py',
          code: `print("'' or 'default' →", "" or "default")
print("'dato' or 'default' →", "dato" or "default")
print("0 and 99 →", 0 and 99)
print("5 and 99 →", 5 and 99)
print("None or 0 →", None or 0)`,
          output: `'' or 'default' → default
'dato' or 'default' → dato
0 and 99 → 0
5 and 99 → 99
None or 0 → 0`,
        },
      },
      {
        subtopicId: 'S03-T1-B',
        kind: 'transfer',
        title: 'Arreglar validador de monto (None ≠ 0)',
        preamble:
          '- **Contexto:** un validador de monto con `if not monto` rechaza ceros válidos y confunde ausencia con error — falso positivo caro en fintech/retail.\n- **Meta:** reescribir `validate_monto` con política tri-estado correcta.\n- **Éxito:** para `None`, `0`, `-1`, `100` imprimes review, accept, reject, accept.\n- **Límites:** no uses truthiness para presencia; primero `m is None`; cero debe ser accept.',
        id: 'S03-T1-B-E3',
        instruction:
          '1. Sustituye `if not m: return "reject"`.\n2. Si `m is None` → `"review"`.\n3. Si `m < 0` → `"reject"`.\n4. En cualquier otro caso (incluye 0) → `"accept"`.\n5. Prueba el bucle dado y compara la salida.',
        hint: 'Nunca uses truthiness para montos. Primero: if m is None.',
        hints: [
          'Nunca uses truthiness para montos. Primero: if m is None.',
          '0 debe devolver accept; None → review; negativo → reject.',
        ],
        edgeCases: ['0 válido; None review'],
        tests: 'cases accept/review: None review, 0 accept, -1 reject, 100 accept',
        feedback: 'Reescribir el test de presencia con is None es el fix crítico del motor de reglas (CP-N1-A).',
        retrospective:
          'Traza tres rutas distintas: `None`, `0` y `-1`. Si dos comparten una condición, explica por qué eso conserva o destruye el significado de negocio. Añade mentalmente un monto positivo y verifica que llegue al camino feliz. Esta separación —ausencia, invalidez y valor permitido— será el patrón de `validate_record` en el You Do.',
        starterCode: {
          language: 'python',
          title: 'fix_monto_cero.py',
          code: `# CASO-LIM-003 · validate_monto
def validate_monto(m):
    # DEFECT: if not m rechaza 0
    if not m:
        return "reject"
    if m < 0:
        return "reject"
    return "accept"

for m in [None, 0, -1, 100]:
    print(m, "→", validate_monto(m))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'fix_monto_cero.py',
          code: `def validate_monto(m):
    if m is None:
        return "review"
    if m < 0:
        return "reject"
    return "accept"

for m in [None, 0, -1, 100]:
    print(m, "→", validate_monto(m))`,
          output: `None → review
0 → accept
-1 → reject
100 → accept`,
        },
      },
      // ——— S03-T2-A ———
      {
        subtopicId: 'S03-T2-A',
        kind: 'guided',
        title: 'Bandas de score con if/elif/else',
        preamble:
          '- **Contexto:** el clasificador de calidad del intake etiqueta un score en una sola rama dominante.\n- **Meta:** corregir umbrales invertidos en `classify_score`.\n- **Éxito:** para 80, 50, 49, 100 → accept, review, reject, accept.\n- **Límites:** una sola cadena `if/elif/else`; no uses ifs independientes.',
        id: 'S03-T2-A-E1',
        instruction:
          '1. El DEFECT devuelve accept en scores bajos.\n2. Escribe: `score >= 80` → accept; `elif score >= 50` → review; `else` → reject.\n3. Imprime `s → status` para 80, 50, 49, 100.',
        hint: 'if score >= 80: ... elif score >= 50: ... else: ...',
        hints: [
          'if score >= 80: ... elif score >= 50: ... else: ...',
          'Fronteras: 80 es accept; 50 es review; 49 es reject.',
        ],
        edgeCases: ['frontera exacta 80 y 50'],
        tests: 'assert status: accept, review, reject, accept',
        feedback:
          'Documentar fronteras evita errores de uno durante la revisión de cambios. 80 cae en la rama superior porque se evalúa primero; 49 debe ser reject.',
        retrospective:
          'Justifica las cuatro salidas con desigualdades, no con etiquetas memorizadas. Después prueba en papel 79 y 51: ¿qué condición es la primera verdadera? Si 80 “baja” a review en tu explicación, olvidaste que Python se detiene. E2 hará visible el sobrescrito que aparece cuando no usas una cadena exclusiva.',
        starterCode: {
          language: 'python',
          title: 'bandas_score.py',
          code: `# CASO-LIM-003 · classify_score
def classify_score(score: int) -> str:
    # DEFECT: umbrales invertidos
    if score < 50:
        return "accept"
    elif score < 80:
        return "review"
    else:
        return "reject"

for s in [80, 50, 49, 100]:
    print(s, "→", classify_score(s))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'bandas_score.py',
          code: `def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

for s in [80, 50, 49, 100]:
    print(s, "→", classify_score(s))`,
          output: `80 → accept
50 → review
49 → reject
100 → accept`,
        },
      },
      {
        subtopicId: 'S03-T2-A',
        kind: 'independent',
        title: 'Bloques if secuenciales frente a cadena exclusiva',
        preamble:
          '- **Contexto:** un error clásico durante la revisión de cambios es sobrescribir `status` con un segundo `if` no excluyente.\n- **Meta:** dejar `bad` como está, implementar `good` con `if/elif/else` y comparar.\n- **Éxito:** para 95, 60, 30 → `good` da accept, review, reject (y `bad(95)` sigue en review).\n- **Límites:** no “arregles” `bad`; el contraste es la lección.',
        id: 'S03-T2-A-E2',
        instruction:
          '1. Lee `bad`: el segundo `if score >= 50` pisa accept.\n2. Implementa `good(score)` con `if/elif/else` y la misma política de umbrales.\n3. Cambia el bucle a 95, 60, 30 e imprime `bad=` y `good=` en cada valor.',
        hint: 'El segundo if score >= 50 pisa el accept. Usa elif para exclusión mutua.',
        hints: [
          'El segundo if score >= 50 pisa el accept. Usa elif para exclusión mutua.',
          'good(95) debe ser accept; bad(95) es review.',
        ],
        edgeCases: ['doble asignación de status'],
        tests: 'single status key; good: accept/review/reject',
        feedback:
          'Si `good(95)` es review, copiaste el segundo `if` de `bad`. En `good` usa `elif`/`else` para exclusión mutua; **no** “arregles” `bad`: el contraste es la lección de revisión.',
        retrospective:
          'Compara la traza de `bad(95)` con `good(95)` asignación por asignación. ¿Qué segunda condición borra una decisión correcta? Durante una revisión, busca variables de estado asignadas en varios `if` y pregunta si las condiciones se solapan. El patrón parece inocente porque no lanza excepción; precisamente por eso necesita pruebas de frontera.',
        starterCode: {
          language: 'python',
          title: 'ifs_vs_elif.py',
          code: `# CASO-LIM-003 · if encadenados sin elif
def bad(score):
    status = None
    if score >= 80:
        status = "accept"
    if score >= 50:
        status = "review"  # DEFECT: pisa accept
    if score < 50:
        status = "reject"
    return status

def good(score):
    # DEFECT: stub — escribe if/elif/else (no copies bad)
    pass

for s in [95, 60, 30]:
    print(s, "bad=", bad(s), "good=", good(s))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'ifs_vs_elif.py',
          code: `def bad(score):
    status = None
    if score >= 80:
        status = "accept"
    if score >= 50:
        status = "review"
    if score < 50:
        status = "reject"
    return status

def good(score):
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

for s in [95, 60, 30]:
    print(s, "bad=", bad(s), "good=", good(s))`,
          output: `95 bad= review good= accept
60 bad= review good= review
30 bad= reject good= reject`,
        },
      },
      {
        subtopicId: 'S03-T2-A',
        kind: 'transfer',
        title: 'Trazar bandas numéricas (orden de umbrales)',
        preamble:
          '- **Contexto:** cuando hay varias bandas (alto/medio/bajo/nulo), el orden de umbrales decide si 150 cae bien o mal.\n- **Meta:** implementar `band(n)` de más estricto a más general.\n- **Éxito:** 150→alto, 75→medio, 10→bajo, 0→nulo, -3→nulo.\n- **Límites:** umbral alto primero; `else` cubre 0 y negativos.',
        id: 'S03-T2-A-E3',
        instruction:
          '1. El starter solo tiene un umbral (DEFECT).\n2. Escribe: `n > 100` → alto; `elif n > 50` → medio; `elif n > 0` → bajo; `else` → nulo.\n3. Prueba 150, 75, 10, 0, -3.',
        hint: 'Orden: primero el umbral más alto. El else cubre 0 y negativos.',
        hints: [
          'Orden: primero el umbral más alto. El else cubre 0 y negativos.',
          '0 no es > 0 → nulo. 75 no es >100 pero sí >50 → medio.',
        ],
        edgeCases: ['else path para 0 y negativos'],
        tests: 'table match: alto, medio, bajo, nulo, nulo',
        feedback:
          'Si 150 imprime “medio” o “bajo”, el umbral alto no va primero. Ordena de más estricto a más general (`>100` → `>50` → `>0` → else nulo) y re-prueba 0 y -3.',
        retrospective:
          'Ordena los cinco valores sobre una recta y dibuja las fronteras 0, 50 y 100. Luego explica por qué una condición general colocada arriba puede ocultar otra más específica. Cambia 75 por 50: ¿esperas medio o bajo bajo este contrato? Lleva la recta y sus casos límite a las tablas de decisión de T3.',
        starterCode: {
          language: 'python',
          title: 'trazar_bandas.py',
          code: `# CASO-LIM-003 · bandas numéricas
def band(n):
    # DEFECT: solo un umbral
    if n > 50:
        return "alto"
    return "bajo"

for n in [150, 75, 10, 0, -3]:
    print(n, "→", band(n))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'trazar_bandas.py',
          code: `def band(n):
    if n > 100:
        return "alto"
    elif n > 50:
        return "medio"
    elif n > 0:
        return "bajo"
    else:
        return "nulo"

for n in [150, 75, 10, 0, -3]:
    print(n, "→", band(n))`,
          output: `150 → alto
75 → medio
10 → bajo
0 → nulo
-3 → nulo`,
        },
      },
      // ——— S03-T2-B ———
      {
        subtopicId: 'S03-T2-B',
        kind: 'guided',
        title: 'Guards de `validate_edad` (MISSING a OK)',
        preamble:
          '- **Contexto:** el validador de edad del motor usa early returns con códigos estables, no un solo `"BAD"`.\n- **Meta:** completar guards de ausencia, tipo, rango y menores.\n- **Éxito:** `None`→review/MISSING; `"25"`→reject/BAD_TYPE; `15`→review/NEEDS_REVIEW; `30`→accept/OK.\n- **Límites:** `is None` antes de comparar; devuelve dicts `{status, code}`; sin `if not edad`.',
        id: 'S03-T2-B-E1',
        instruction:
          '1. Quita `if not edad` (truthiness).\n2. Escribe guards en orden: `is None` → no `int` → fuera 0–120 → `< 18` → OK.\n3. Devuelve dicts `{status, code}` (no un solo `"BAD"`).\n4. Prueba con `repr(e)` los cuatro valores del bucle.',
        hint: 'if edad is None primero; luego isinstance; no compares None con <.',
        hints: [
          'if edad is None primero; luego isinstance; no compares None con <.',
          'return dicts con status y code; el camino feliz es el último return.',
        ],
        edgeCases: ['None antes de comparación'],
        tests: 'no TypeError; codes MISSING, BAD_TYPE, NEEDS_REVIEW, OK',
        feedback: 'Early exit de tipo es el primer guard de un validador serio. None y "25" no son el mismo rechazo.',
        retrospective:
          'Recorre los cuatro valores y nombra la primera guarda que termina cada caso. ¿Por qué `"25"` no debe llegar a la comparación numérica aunque una persona pueda leerlo como edad? Separar MISSING de BAD_TYPE conserva una causa que luego aparecerá en métricas y mensajes. Reutilizarás exactamente esa disciplina en el You Do.',
        starterCode: {
          language: 'python',
          title: 'guards_edad.py',
          code: `# CASO-LIM-003 · validate_edad guards
def validate_edad(edad):
    # DEFECT: no distingue None de tipo incorrecto
    if not edad:
        return {"status": "reject", "code": "BAD"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", 15, 30]:
    print(repr(e), "→", validate_edad(e))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'guards_edad.py',
          code: `def validate_edad(edad):
    if edad is None:
        return {"status": "review", "code": "MISSING"}
    if not isinstance(edad, int):
        return {"status": "reject", "code": "BAD_TYPE"}
    if edad < 0 or edad > 120:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    if edad < 18:
        return {"status": "review", "code": "NEEDS_REVIEW"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", 15, 30]:
    print(repr(e), "→", validate_edad(e))`,
          output: `None → {'status': 'review', 'code': 'MISSING'}
'25' → {'status': 'reject', 'code': 'BAD_TYPE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}`,
        },
      },
      {
        subtopicId: 'S03-T2-B',
        kind: 'independent',
        title: 'Refactor de pirámide a guards (monto)',
        preamble:
          '- **Contexto:** `validate_monto_nested` ya tiene la política correcta, pero la pirámide es frágil durante la revisión de cambios.\n- **Meta:** escribir `validate_monto_guards` con salidas tempranas **sin** cambiar semántica.\n- **Éxito:** en `[None, "x", -1, 0, 500, 20000]` la versión anidada y la versión con guardas coinciden (`ok= True`).\n- **Límites:** no reescribas la política; 0 sigue accept; `>10000` sigue review.',
        id: 'S03-T2-B-E2',
        instruction:
          '1. Deja nested intacta.\n2. Implementa guards: None→review; no int→reject; `<0`→reject; `<=10000`→accept; else review.\n3. Compara ambas funciones en el bucle de seis casos.',
        hint: 'Invierte el anidamiento: un if + return por precondición. No reescribas la política: solo el estilo.',
        hints: [
          'Invierte el anidamiento: un if + return por precondición. No reescribas la política: solo el estilo.',
          'Compara salidas nested vs. guards en [None, "x", -1, 0, 500, 20000]; deben coincidir.',
        ],
        edgeCases: ['mantener semántica idéntica', 'valor atípico > 10000 → review'],
        tests: 'same outputs que nested en [None, "x", -1, 0, 500, 20000]',
        feedback: 'Misma matriz, menos indentación: la mejora se nota durante la revisión porque el código es más fácil de mantener.',
        retrospective:
          'Compara ambas funciones caso por caso y explica por qué `ok=True` demuestra equivalencia solo para la matriz probada. Propón un caso adicional en una frontera. Si cambiaste un status mientras reducías indentación, no hiciste un refactor: cambiaste la política. En E3 leerás el orden para encontrar una ruta que ninguna entrada puede alcanzar.',
        starterCode: {
          language: 'python',
          title: 'refactor_guards_monto.py',
          code: `# CASO-LIM-003 · nested if monto
def validate_monto_nested(m):
    # DEFECT: pirámide anidada (semántica correcta — refactor a guards lineales)
    if m is not None:
        if isinstance(m, int):
            if m >= 0:
                if m <= 10000:
                    return "accept"
                else:
                    return "review"
            else:
                return "reject"
        else:
            return "reject"
    else:
        return "review"

# Añade validate_monto_guards(m) con la misma semántica (early returns)
for m in [None, "x", -1, 0, 500, 20000]:
    print(m, validate_monto_nested(m))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'refactor_guards_monto.py',
          code: `def validate_monto_nested(m):
    if m is not None:
        if isinstance(m, int):
            if m >= 0:
                if m <= 10000:
                    return "accept"
                else:
                    return "review"
            else:
                return "reject"
        else:
            return "reject"
    else:
        return "review"

def validate_monto_guards(m):
    if m is None:
        return "review"
    if not isinstance(m, int):
        return "reject"
    if m < 0:
        return "reject"
    if m <= 10000:
        return "accept"
    return "review"

for v in [None, "x", -1, 0, 500, 20000]:
    a, b = validate_monto_nested(v), validate_monto_guards(v)
    print(v, a, b, "ok=", a == b)`,
          output: `None review review ok= True
x reject reject ok= True
-1 reject reject ok= True
0 accept accept ok= True
500 accept accept ok= True
20000 review review ok= True`,
        },
      },
      {
        subtopicId: 'S03-T2-B',
        kind: 'transfer',
        title: 'Detectar y reparar una rama muerta',
        preamble:
          '- **Contexto:** durante la revisión de cambios, un `elif` puede ser código muerto por solapamiento de condiciones.\n- **Meta:** explicar por qué `elif x > 5` nunca corre y reescribir `etiqueta_ok` con ramas alcanzables.\n- **Éxito:** tras la corrección, 6→positivo, -2→negativo, 0→cero; y una nota visible de que el `elif` original era inalcanzable.\n- **Límites:** no corrijas solo el número mágico; cambia el diseño de ramas.',
        id: 'S03-T2-B-E3',
        instruction:
          '1. Ejecuta `etiqueta_bug` en 6, -2, 0 y observa que 6 nunca es “grande-positivo”.\n2. Explica en un print por qué `if x >= 0` tapa el `elif x > 5`.\n3. Implementa `etiqueta_ok`: `x > 0` / `x < 0` / else cero.',
        hint: 'Si if x >= 0 gana primero, ningún x > 5 llega al elif: ese elif solo vería negativos, y un negativo nunca es > 5.',
        hints: [
          'Si if x >= 0 gana primero, ningún x > 5 llega al elif: ese elif solo vería negativos, y un negativo nunca es > 5.',
          'Corrige con if x > 0 / elif x < 0 / else (cero). Prueba 6, -2 y 0.',
        ],
        edgeCases: ['condiciones superpuestas', 'rama muerta por orden'],
        tests: 'identify dead elif x>5; after fix: 6→positivo, -2→negativo, 0→cero',
        feedback: 'Detectar código muerto durante la revisión exige leer el orden de las condiciones, no solo conocer la sintaxis de `if`.',
        retrospective:
          'Describe el conjunto de valores que llega al `elif`: después de fallar `x >= 0`, solo quedan negativos; ninguno puede cumplir `x > 5`. Ese razonamiento por conjuntos encuentra código muerto sin ejecutar miles de casos. Repite la pregunta “¿qué valores quedan aquí?” cuando revises cada umbral del motor.',
        starterCode: {
          language: 'python',
          title: 'rama_muerta.py',
          code: `# CASO-LIM-003 · elif muerto
def etiqueta_bug(x):
    if x >= 0:
        return "no-negativo"
    elif x > 5:  # DEFECT: rama muerta (nunca corre)
        return "grande-positivo"
    else:
        return "negativo"

for x in [6, -2, 0]:
    print(x, "→", etiqueta_bug(x))
# Reescribe etiqueta_ok con ramas alcanzables: positivo / negativo / cero
`,
        },
        solutionCode: {
          language: 'python',
          title: 'rama_muerta.py',
          code: `def etiqueta_bug(x):
    if x >= 0:
        return "no-negativo"
    elif x > 5:  # inalcanzable: solo se evalúa si x < 0
        return "grande-positivo"
    else:
        return "negativo"

print("bug 6 →", etiqueta_bug(6), "(elif x>5 nunca corre)")
print("bug -2 →", etiqueta_bug(-2))
print("bug 0 →", etiqueta_bug(0))
print("nota: if x>=0 cubre 0, 6, 100…; el elif x>5 es código muerto")

def etiqueta_ok(x):
    if x > 0:
        return "positivo"
    elif x < 0:
        return "negativo"
    else:
        return "cero"

print("ok 6 →", etiqueta_ok(6))
print("ok -2 →", etiqueta_ok(-2))
print("ok 0 →", etiqueta_ok(0))`,
          output: `bug 6 → no-negativo (elif x>5 nunca corre)
bug -2 → negativo
bug 0 → no-negativo
nota: if x>=0 cubre 0, 6, 100…; el elif x>5 es código muerto
ok 6 → positivo
ok -2 → negativo
ok 0 → cero`,
        },
      },
      // ——— S03-T3-A ———
      {
        subtopicId: 'S03-T3-A',
        kind: 'guided',
        title: 'Allowlist de regiones (desconocido → review)',
        preamble:
          '- **Contexto:** catálogos incompletos en intake suelen mandar desconocidos a **review**, no a reject duro.\n- **Meta:** implementar `check_region` con allowlist sintética de Perú.\n- **Éxito:** Lima→accept; Tacna→review; None→review.\n- **Límites:** no uses reject para desconocidos en esta política; chequea `None` antes de `not in`.',
        id: 'S03-T3-A-E1',
        instruction:
          '1. Corrige el DEFECT que manda todo lo no-allowlisted a reject (incluido None).\n2. Si `r is None` o `r not in ALLOWED` → review; else accept.\n3. Prueba Lima, Tacna, None.',
        hint: 'if r is None / if r not in ALLOWED / return accept',
        hints: [
          'if r is None / if r not in ALLOWED / return accept',
          'Región desconocida → review (no reject) en esta política sintética.',
        ],
        edgeCases: ['región desconocida → review'],
        tests: 'assert Lima accept, Tacna review, None review',
        feedback:
          'Si `None` o `Tacna` salen `reject`, aún aplicas un rechazo definitivo. En esta política, la ausencia y el valor desconocido pasan a **review**; solo la lista permitida produce accept.',
        retrospective:
          'Explica la diferencia entre “el catálogo no reconoce el valor” y “el valor viola una regla”. ¿Qué dato adicional permitiría resolver `Tacna` desde review? Si no existe una acción posible, reconsidera la política; si sí existe, reject sería prematuro. En E2 combinarás esta idea con un valor atípico numérico.',
        starterCode: {
          language: 'python',
          title: 'allowlist_regiones.py',
          code: `# CASO-LIM-003 · check_region allowlist
ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}

def check_region(r):
    # DEFECT: None → reject y desconocido → reject (debe ser review en ambos)
    if r not in ALLOWED:
        return "reject"
    return "accept"

for r in ["Lima", "Tacna", None]:
    print(r, "→", check_region(r))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'allowlist_regiones.py',
          code: `ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}

def check_region(r):
    if r is None:
        return "review"
    if r not in ALLOWED:
        return "review"
    return "accept"

for r in ["Lima", "Tacna", None]:
    print(r, "→", check_region(r))`,
          output: `Lima → accept
Tacna → review
None → review`,
        },
      },
      {
        subtopicId: 'S03-T3-A',
        kind: 'independent',
        title: 'Rango de monto con valor atípico revisable',
        preamble:
          '- **Contexto:** la calidad de datos distingue una falla estricta (monto negativo) de un valor atípico que requiere revisión (monto muy alto).\n- **Meta:** implementar `monto_ingreso` con tri-estado y cero válido.\n- **Éxito:** None, -1, 0, 1200, 60000 → review, reject, accept, accept, review.\n- **Límites:** 0 no es reject; superar el umbral 50000 produce review, no reject.',
        id: 'S03-T3-A-E2',
        instruction:
          '1. Corrige `m <= 0` (rechaza el cero).\n2. Orden: None→review; `<0`→reject; `>50000`→review; else accept.\n3. Prueba la lista de cinco montos en orden.',
        hint: 'Orden: ausencia, rechazo estricto, valor atípico a revisión, accept.',
        hints: [
          'Orden: ausencia, rechazo estricto, valor atípico a revisión, accept.',
          '0 es accept; 60000 es review, no reject.',
        ],
        edgeCases: ['0 válido; negativo reject'],
        tests: 'table: review, reject, accept, accept, review',
        feedback:
          'Si `0` es reject, aún usas `m <= 0`. Separa: negativo → reject; cero → accept; `>50000` → review (no reject).',
        retrospective:
          'Compara `-1` y `60000`: ambos están fuera del camino común, pero solo el primero viola la regla estricta `m >= 0`; el segundo supera un umbral de revisión. ¿Qué cambiaría si el negocio aprobara 60000 tras evidencia adicional? Documenta 50000 como política revisable, no como una verdad universal, en el README del You Do.',
        starterCode: {
          language: 'python',
          title: 'rango_monto.py',
          code: `# CASO-LIM-003 · monto_ingreso
def monto_ingreso(m):
    # DEFECT: 0 es reject
    if m is None:
        return "review"
    if m <= 0:
        return "reject"
    if m > 50000:
        return "review"
    return "accept"

for m in [None, -1, 0, 1200, 60000]:
    print(m, "→", monto_ingreso(m))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'rango_monto.py',
          code: `def monto_ingreso(m):
    if m is None:
        return "review"
    if m < 0:
        return "reject"
    if m > 50000:
        return "review"
    return "accept"

for m in [None, -1, 0, 1200, 60000]:
    print(m, "→", monto_ingreso(m))`,
          output: `None → review
-1 → reject
0 → accept
1200 → accept
60000 → review`,
        },
      },
      {
        subtopicId: 'S03-T3-A',
        kind: 'transfer',
        title: 'Tipo de documento y longitud (códigos)',
        preamble:
          '- **Contexto:** DNI/CE/PAS tienen longitudes distintas; fallos de catálogo y de longitud deben llevar **códigos distintos**.\n- **Meta:** devolver dict `{status, code}` con MISSING, NOT_IN_ALLOWLIST, OUT_OF_RANGE, OK.\n- **Éxito:** DNI+8→OK; DNI corto→OUT_OF_RANGE; RUC→NOT_IN_ALLOWLIST; None→MISSING.\n- **Límites:** orden guards: ausencia → allowlist → longitud; no un solo `"reject"` genérico.',
        id: 'S03-T3-A-E3',
        instruction:
          '1. Completa `tipo_doc_len(tipo, numero)` con dicts de resultado.\n2. Usa `DOC_LEN` para la longitud esperada.\n3. Prueba: `("DNI","12345678")`, `("DNI","123")`, `("RUC","20123456789")`, `(None,"1")`.',
        hint: 'Primero None, luego not in allowlist, luego len != esperado.',
        hints: [
          'Primero None, luego not in allowlist, luego len != esperado.',
          'DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}; usa len(str(numero)).',
        ],
        edgeCases: ['tipo ok longitud mal'],
        tests: 'codes MISSING/OUT_OF_RANGE/NOT_IN_ALLOWLIST/OK',
        feedback: 'and de restricciones con códigos distintos = operabilidad en dashboards de calidad.',
        retrospective:
          'Construye una pequeña tabla de causa → código: ausencia, tipo no permitido, longitud incorrecta y dato válido. Dos filas pueden compartir status y aun necesitar códigos distintos. ¿Qué equipo podría corregir cada causa? Esta separación alimenta dashboards y será la forma estándar de cada campo en el You Do.',
        starterCode: {
          language: 'python',
          title: 'tipo_doc_longitud.py',
          code: `# CASO-LIM-003 · tipo_doc_len
ALLOWED_DOC = {"DNI", "CE", "PAS"}
DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}

def tipo_doc_len(tipo, numero):
    # DEFECT: string genérico; falta guards + dict {status, code}
    if tipo not in ALLOWED_DOC:
        return "reject"
    return "accept"

for t, n in [("DNI", "12345678"), ("DNI", "123"), ("RUC", "20123456789"), (None, "1")]:
    print(t, n, "→", tipo_doc_len(t, n))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'tipo_doc_longitud.py',
          code: `ALLOWED_DOC = {"DNI", "CE", "PAS"}
DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}

def tipo_doc_len(tipo, numero):
    if tipo is None or numero is None:
        return {"status": "review", "code": "MISSING"}
    if tipo not in ALLOWED_DOC:
        return {"status": "reject", "code": "NOT_IN_ALLOWLIST"}
    if len(str(numero)) != DOC_LEN[tipo]:
        return {"status": "reject", "code": "OUT_OF_RANGE"}
    return {"status": "accept", "code": "OK"}

for t, n in [("DNI", "12345678"), ("DNI", "123"), ("RUC", "20123456789"), (None, "1")]:
    print(t, n, "→", tipo_doc_len(t, n))`,
          output: `DNI 12345678 → {'status': 'accept', 'code': 'OK'}
DNI 123 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}
RUC 20123456789 → {'status': 'reject', 'code': 'NOT_IN_ALLOWLIST'}
None 1 → {'status': 'review', 'code': 'MISSING'}`,
        },
      },
      // ——— S03-T3-B ———
      {
        subtopicId: 'S03-T3-B',
        kind: 'guided',
        title: 'Decision table código → status',
        preamble:
          '- **Contexto:** primero se escribe la tabla de negocio; después el código. Así se evitan ramas inventadas.\n- **Meta:** corregir el dict `TABLE` y aplicar `get` con default review.\n- **Éxito:** OK→accept; MISSING→review; OUT_OF_RANGE→reject; FOO→review.\n- **Límites:** no añadas códigos de negocio que no estén en la tabla; el default cubre desconocidos.',
        id: 'S03-T3-B-E1',
        instruction:
          '1. Corrige MISSING (review) y OUT_OF_RANGE (reject).\n2. Implementa `apply(code)` con `TABLE.get(code, "review")`.\n3. Imprime el status de OK, MISSING, OUT_OF_RANGE y FOO.',
        hint: 'table.get(code, table["_default"]) o case _ equivalente con dict.',
        hints: [
          'table.get(code, "review") si no incluyes _default como clave de negocio.',
          'Fila default cubre códigos desconocidos (FOO).',
        ],
        edgeCases: ['fila default'],
        tests: 'table complete: 4 filas de negocio + default',
        feedback:
          'Primero la tabla, después el código: reduce ramas inventadas. El default (`get(..., "review")`) debe cubrir FOO sin hardcodear ifs extra.',
        retrospective:
          'Lee `TABLE` como una especificación independiente de Python: cada clave debe tener una acción y lo desconocido necesita una política explícita. Añade mentalmente `BAD_TYPE`: ¿qué status decidirías y por qué? No lo programes sin agregar primero la fila. En E2 expresarás la misma tabla con `match` y comprobarás que la semántica no cambió.',
        starterCode: {
          language: 'python',
          title: 'decision_table.py',
          code: `# CASO-LIM-003 · tabla códigos
TABLE = {
    "OK": "accept",
    "MISSING": "reject",  # DEFECT: debería review
    "OUT_OF_RANGE": "review",  # DEFECT: debería reject
}

def apply(code):
    return TABLE.get(code, "review")

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO"]:
    print(c, apply(c))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'decision_table.py',
          code: `TABLE = {
    "OK": "accept",
    "MISSING": "review",
    "OUT_OF_RANGE": "reject",
}

def apply(code):
    return TABLE.get(code, "review")

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO"]:
    print(c, "→", apply(c))`,
          output: `OK → accept
MISSING → review
OUT_OF_RANGE → reject
FOO → review`,
        },
      },
      {
        subtopicId: 'S03-T3-B',
        kind: 'independent',
        title: 'Misma tabla con match/case y OR patterns',
        preamble:
          '- **Contexto:** con sujetos de estado finito, `match` hace legible la misma decision table.\n- **Meta:** completar cases con OR patterns y `case _`.\n- **Éxito:** OK accept; MISSING/NEEDS_REVIEW review; OUT_OF_RANGE reject; FOO review.\n- **Límites:** Python 3.10+; si no hay match, if/elif equivalente (anótalo). No dejes que MISSING caiga en accept.',
        id: 'S03-T3-B-E2',
        instruction:
          '1. El DEFECT manda el default a accept.\n2. Añade cases: `OK`; `MISSING | NEEDS_REVIEW`; `OUT_OF_RANGE | NOT_IN_ALLOWLIST | BAD_TYPE`; `case _` → review.\n3. Recorre el bucle con: `OK`, `MISSING`, `OUT_OF_RANGE`, `FOO`, `NEEDS_REVIEW` e imprime `código → status`.',
        hint: 'Usa `case "A" | "B":` en una sola rama y `case _:` al final.',
        hints: [
          'Usa `case "A" | "B":` en una sola rama y `case _:` al final.',
          'Requiere Python 3.10+. Si no, usa if/elif equivalente y anótalo.',
        ],
        edgeCases: ['wildcard _'],
        tests: 'assert statuses en OK, MISSING, OUT_OF_RANGE, FOO, NEEDS_REVIEW',
        feedback:
          'Si `MISSING` o `FOO` salen accept, el `case _` (o la falta de OR patterns) aún es permisivo. Default de negocio aquí es **review**, no accept.',
        retrospective:
          'Vuelve a escribir las filas en español y comprueba que cada `case` corresponde a una de ellas. ¿Qué ocurriría con un código nuevo si `case _` devolviera accept? La respuesta revela por qué el default es una decisión de seguridad, no un relleno sintáctico. Reserva `match` para sujetos finitos que permitan esta lectura tabular.',
        starterCode: {
          language: 'python',
          title: 'match_codigos.py',
          code: `# CASO-LIM-003 · match statement
def status_match(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        # DEFECT: MISSING cae en default accept
        case _:
            return "accept"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO", "NEEDS_REVIEW"]:
    print(c, "→", status_match(c))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'match_codigos.py',
          code: `def status_match(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING" | "NEEDS_REVIEW":
            return "review"
        case "OUT_OF_RANGE" | "NOT_IN_ALLOWLIST" | "BAD_TYPE":
            return "reject"
        case _:
            return "review"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO", "NEEDS_REVIEW"]:
    print(c, "→", status_match(c))`,
          output: `OK → accept
MISSING → review
OUT_OF_RANGE → reject
FOO → review
NEEDS_REVIEW → review`,
        },
      },
      {
        subtopicId: 'S03-T3-B',
        kind: 'transfer',
        title: 'Elegir if o match según el sujeto',
        preamble:
          '- **Contexto:** claridad de diseño > moda de sintaxis en el motor de reglas.\n- **Meta:** mapear códigos finitos con match y rango de edad con if; justificar en un print.\n- **Éxito:** `map_code` distingue OK/MISSING/OUT_OF_RANGE; `map_edad` da review/accept/reject en None/30/10; print de justificación.\n- **Límites:** no fuerces match sobre rangos numéricos; no dejes None→accept.',
        id: 'S03-T3-B-E3',
        instruction:
          '1. Implementa `map_code` con match (o if/elif) según la tabla OK/MISSING/OUT_OF_RANGE/_ → review.\n2. Implementa `map_edad`: None→review; 18–65→accept; else reject.\n3. Imprime resultados de prueba y una línea “por qué match no es ideal para el rango”.',
        hint: 'match brilla en literales; rangos numéricos son más claros con if y comparaciones.',
        hints: [
          'match brilla en literales; rangos numéricos son más claros con if y comparaciones.',
          'Puedes match en status codes y if en edad en el mismo módulo.',
        ],
        edgeCases: ['rango numérico no ideal en match'],
        tests: 'rubric short answer + code ejecutable',
        feedback:
          'Si `map_edad(None)` es accept, falta el guard de ausencia. Si usaste `match` para el rango 18–65, reescribe con `if` y deja `match` solo en códigos finitos; la justificación debe nombrar *claridad del sujeto*, no “porque es moderno”.',
        retrospective:
          'Defiende dos elecciones ante una revisión: `match` para códigos finitos y `if` para un intervalo continuo. Tu justificación debe hablar de la forma del problema, no de novedad o preferencia personal. Después pregunta qué invariante hace legítimo el rango 18–65; en T4 escribirás esa promesa antes de probar sus ramas.',
        starterCode: {
          language: 'python',
          title: 'if_vs_match_elegir.py',
          code: `# CASO-LIM-003 · map_code + map_edad
def map_code(code: str) -> str:
    # DEFECT: siempre accept
    return "accept"

def map_edad(edad):
    # DEFECT: None → accept
    if isinstance(edad, int) and 18 <= edad <= 65:
        return "accept"
    return "accept"

print(map_code("MISSING"), map_edad(None))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'if_vs_match_elegir.py',
          code: `def map_code(code: str) -> str:
    match code:
        case "OK":
            return "accept"
        case "MISSING":
            return "review"
        case "OUT_OF_RANGE":
            return "reject"
        case _:
            return "review"

def map_edad(edad):
    if edad is None:
        return "review"
    if 18 <= edad <= 65:
        return "accept"
    return "reject"

print(map_code("OK"), map_code("MISSING"))
print(map_edad(None), map_edad(30), map_edad(10))
print("Justificación:", "match para códigos finitos; if para rangos numéricos")`,
          output: `accept review
review accept reject
Justificación: match para códigos finitos; if para rangos numéricos`,
        },
      },
      // ——— S03-T4-A ———
      {
        subtopicId: 'S03-T4-A',
        kind: 'guided',
        title: 'Ejemplos canónicos del campo edad',
        preamble:
          '- **Contexto:** un invariante usable trae al menos un ejemplo por estado de decisión.\n- **Meta:** completar `validate_edad` (con type check) y una lista `examples` ejecutable.\n- **Éxito:** cuatro filas con `ok`/True: 30 accept, -1 reject, None review, `"x"` reject.\n- **Límites:** no uses solo el camino feliz; incluye missing y tipo mal.',
        id: 'S03-T4-A-E1',
        instruction:
          '1. Añade guard de tipo (`isinstance`) al DEFECT.\n2. Define `examples` como lista de dicts `{value, expected}`.\n3. Recorre examples, imprime valor, got y comparación booleana.',
        hint: 'Cuatro dicts {value, expected}. None → review; -1 reject; 30 accept; "x" reject.',
        hints: [
          'Cuatro dicts {value, expected}. None → review; -1 reject; 30 accept; "x" reject.',
          'missing key en el record se modela aquí como value None.',
        ],
        edgeCases: ['missing key'],
        tests: '4 examples present; todos ok=True',
        feedback:
          'Si al probar `"x"` crashea, falta `isinstance` antes de comparar. Si `examples` vacío no imprime filas, llena cuatro dicts `{value, expected}` y verifica `got == expected` en cada uno.',
        retrospective:
          'Relaciona cada ejemplo con una rama y señala cuál faltaría si eliminaras `"x"`. Después añade una frontera —0 o 120— y predice su estado a partir del texto, no del código. Si el invariante no permite responder, vuelve a redactarlo. En E2 harás lo mismo con una promesa que depende de dos campos.',
        starterCode: {
          language: 'python',
          title: 'ejemplos_edad.py',
          code: `# CASO-LIM-003 · pipeline edad
def validate_edad(e):
    # DEFECT: falta type check (isinstance); "x" rompe al comparar
    if e is None:
        return "review"
    if e < 0 or e > 120:
        return "reject"
    return "accept"

# DEFECT: examples vacío — completa con {value, expected}
examples = []
for ex in examples:
    got = validate_edad(ex["value"])
    print(ex["value"], got, got == ex["expected"])
`,
        },
        solutionCode: {
          language: 'python',
          title: 'ejemplos_edad.py',
          code: `def validate_edad(e):
    if e is None:
        return "review"
    if not isinstance(e, int):
        return "reject"
    if e < 0 or e > 120:
        return "reject"
    return "accept"

examples = [
    {"value": 30, "expected": "accept"},
    {"value": -1, "expected": "reject"},
    {"value": None, "expected": "review"},
    {"value": "x", "expected": "reject"},
]
for ex in examples:
    got = validate_edad(ex["value"])
    print(ex["value"], got, got == ex["expected"])`,
          output: `30 accept True
-1 reject True
None review True
x reject True`,
        },
      },
      {
        subtopicId: 'S03-T4-A',
        kind: 'independent',
        title: 'Invariante multi-campo de apellidos',
        preamble:
          '- **Contexto:** `validate_record` del You Do combina campos; aquí practicas un invariante de dos apellidos.\n- **Meta:** accept solo si ambos no vacíos; un faltante → review; ambos vacíos → reject.\n- **Éxito:** texto de invariante en español + 3 examples ejecutables con expected correcto.\n- **Límites:** aplica `strip`; trata `None` y `""` como vacío; sin PII real.',
        id: 'S03-T4-A-E2',
        instruction:
          '1. Reescribe `validate_apellidos` (el DEFECT rechaza cualquier falta).\n2. Escribe `invariant_text` en español.\n3. Arma 3 examples (accept / review / reject) y verifícalos en un loop.',
        hint: 'strip y trata "" como vacío. None en uno → review.',
        hints: [
          'strip y trata "" como vacío. None en uno → review.',
          'invariant_text en español; examples con expected.',
        ],
        edgeCases: ['uno vacío'],
        tests: 'text + examples ejecutables',
        feedback:
          'Si un solo apellido vacío cae en reject, aún usas el DEFECT “cualquier falta = reject”. Distingue: uno vacío → review; ambos vacíos → reject; ambos con texto → accept (`strip` cuenta).',
        retrospective:
          'Compara “uno vacío” con “ambos vacíos” y explica por qué la cantidad de evidencia cambia el status. ¿Qué debería ocurrir con un entero donde esperabas apellido? El ejercicio no lo decide: anota esa deuda en el invariante en vez de inventar una política. Esta honestidad prepara `validate_record` y su documentación.',
        starterCode: {
          language: 'python',
          title: 'invariante_apellidos.py',
          code: `# CASO-LIM-003 · apellidos invariante
def validate_apellidos(ap, am):
    # DEFECT: exige ambos siempre
    if not ap or not am:
        return "reject"
    return "accept"

print(validate_apellidos("Ramos", ""))
print(validate_apellidos("", "Q"))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'invariante_apellidos.py',
          code: `def validate_apellidos(ap, am):
    def empty(x):
        return x is None or (isinstance(x, str) and not x.strip())

    if empty(ap) and empty(am):
        return "reject"
    if empty(ap) or empty(am):
        return "review"
    return "accept"

invariant_text = (
    "ambos apellidos presentes y no vacíos → accept; "
    "uno ausente/vacío → review; ambos vacíos → reject"
)
examples = [
    {"ap": "Quispe", "am": "Ñahui", "expected": "accept"},
    {"ap": "Quispe", "am": None, "expected": "review"},
    {"ap": "  ", "am": "", "expected": "reject"},
]
print(invariant_text)
for ex in examples:
    got = validate_apellidos(ex["ap"], ex["am"])
    print(ex["ap"], ex["am"], "→", got, got == ex["expected"])`,
          output: `ambos apellidos presentes y no vacíos → accept; uno ausente/vacío → review; ambos vacíos → reject
Quispe Ñahui → accept True
Quispe None → review True
    → reject True`,
        },
      },
      {
        subtopicId: 'S03-T4-A',
        kind: 'transfer',
        title: 'Contraejemplo a un invariante demasiado estricto',
        preamble:
          '- **Contexto:** “edad siempre 18–65 o reject” choca con la política real del curso (menores → review).\n- **Meta:** mostrar el contraejemplo (15, None) y proponer `validate_edad_fixed` + nuevo texto de invariante.\n- **Éxito:** strict muestra reject en 15/None; fixed da review en 15/None y accept en 30; print del invariante corregido.\n- **Límites:** no dejes menores como reject duro; fuera de 0–120 sí reject.',
        id: 'S03-T4-A-E3',
        instruction:
          '1. Ejecuta la versión strict y nombra qué casos rompen la política de negocio.\n2. Implementa fixed con guards (None, tipo, rango, menores, banda 18–65).\n3. Imprime el nuevo invariante en español.',
        hint: 'edad 15 no debería ser reject duro si la política es review para menores.',
        hints: [
          'edad 15 no debería ser reject duro si la política es review para menores.',
          'None sigue siendo review; >120 o <0 sí reject.',
        ],
        edgeCases: ['regla demasiado estricta'],
        tests: 'identify broken claim; 15 → review tras fix',
        feedback:
          'Si `fixed(15)` sigue en reject, no separaste menores (review) de fuera de 0–120 (reject). El contraejemplo debe *verse* en prints: strict vs fixed lado a lado, más el invariante corregido en español.',
        retrospective:
          'El valor 15 demuestra que la frase “fuera de 18–65 → reject” era demasiado estricta para la política real. Explica qué cambió primero: ¿el código o el requisito? Debe cambiar la promesa y luego su implementación. Busca ahora un contraejemplo para 66–120 y documenta el destino elegido antes de añadir ramas. T4-B fijará esa decisión con mensajes y pruebas.',
        starterCode: {
          language: 'python',
          title: 'contraejemplo_edad.py',
          code: `# CASO-LIM-003 · strict age bug demo
def validate_edad_strict(e):
    # DEFECT: None y menores → reject (sin review)
    if isinstance(e, int) and 18 <= e <= 65:
        return "accept"
    return "reject"

print("strict None", validate_edad_strict(None))
print("strict 15", validate_edad_strict(15))
`,
        },
        solutionCode: {
          language: 'python',
          title: 'contraejemplo_edad.py',
          code: `def validate_edad_strict(e):
    if isinstance(e, int) and 18 <= e <= 65:
        return "accept"
    return "reject"

print("strict 15 →", validate_edad_strict(15))
print("strict None →", validate_edad_strict(None))

def validate_edad_fixed(e):
    if e is None:
        return "review"
    if not isinstance(e, int):
        return "reject"
    if e < 0 or e > 120:
        return "reject"
    if e < 18:
        return "review"
    if e <= 65:
        return "accept"
    return "review"

print("fixed 15 →", validate_edad_fixed(15))
print("fixed None →", validate_edad_fixed(None))
print("fixed 30 →", validate_edad_fixed(30))
print("Invariante:", "menores y ausentes → review; solo fuera de 0-120 o tipo mal → reject")`,
          output: `strict 15 → reject
strict None → reject
fixed 15 → review
fixed None → review
fixed 30 → accept
Invariante: menores y ausentes → review; solo fuera de 0-120 o tipo mal → reject`,
        },
      },
      // ——— S03-T4-B ———
      {
        subtopicId: 'S03-T4-B',
        kind: 'guided',
        title: 'Reescribir mensajes accionables de edad',
        preamble:
          '- **Contexto:** el equipo de operaciones de intake **no puede** actuar con mensajes “Error” o “inválido”.\n- **Meta:** reescribir tres mensajes vagos a plantilla campo + problema + acción.\n- **Éxito:** tres strings que nombren `edad`, el problema y qué hacer (sin PII real).\n- **Límites:** no inventes DNI ni teléfonos reales; usa valores sintéticos si citas un número.',
        id: 'S03-T4-B-E1',
        instruction:
          '1. Sustituye las tres cadenas del starter.\n2. Cubre al menos: ausencia, tipo incorrecto y fuera de rango.\n3. Imprime una línea por mensaje.',
        hint: 'Incluye nombre del campo y qué hacer. No agregues PII real.',
        hints: [
          'Incluye nombre del campo y qué hacer. No agregues PII real.',
          'Ejemplo: Campo edad=-3 fuera de rango; usa 0–120.',
        ],
        edgeCases: ['no incluir PII extra'],
        tests: 'rubric keywords: campo, edad, acción en cada mensaje',
        feedback:
          'Si aún ves “Error” o “inválido”, no cumpliste la plantilla. Cada línea debe permitir que el equipo de operaciones actúe sin adivinar: nombre del campo, qué falló y la acción esperada (p. ej., “usa 0–120”).',
        retrospective:
          'Entrega uno de tus mensajes a una persona que no vea el código: ¿puede identificar campo, problema y siguiente acción? Si necesita adivinar, la frase sigue siendo decorativa. El código estable sirve para métricas; el mensaje sirve para actuar. En E2 protegerás ambos mediante casos esperados.',
        starterCode: {
          language: 'python',
          title: 'mensajes_accionables.py',
          code: `# CASO-LIM-003 · mensajes accionables
# DEFECT: mensajes vagos
accionables = [
    "Error",
    "inválido",
    "bad age",
]
for a in accionables:
    print(a)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'mensajes_accionables.py',
          code: `accionables = [
    "Campo 'edad' ausente: envía un entero 0–120 o marca desconocido.",
    "Campo 'edad' inválido: se recibió un valor no entero; corrige el tipo.",
    "Campo 'edad'=-3 fuera de rango; usa un entero entre 0 y 120.",
]
for a in accionables:
    print(a)`,
          output: `Campo 'edad' ausente: envía un entero 0–120 o marca desconocido.
Campo 'edad' inválido: se recibió un valor no entero; corrige el tipo.
Campo 'edad'=-3 fuera de rango; usa un entero entre 0 y 120.`,
        },
      },
      {
        subtopicId: 'S03-T4-B',
        kind: 'independent',
        title: 'Un caso de prueba por cada rama',
        preamble:
          '- **Contexto:** si solo pruebas el camino feliz, el clasificador miente en fronteras.\n- **Meta:** armar `cases` con expected y un loop assert/print PASS sobre `classify_score`.\n- **Éxito:** al menos un caso por rama (accept/review/reject) e idealmente fronteras 80 y 50; todos PASS.\n- **Límites:** no borres la función; no uses prints sin assert (o sin comparación explícita).',
        id: 'S03-T4-B-E2',
        instruction:
          '1. Define `cases` como lista de `(score, expected)`.\n2. Incluye al menos 90, 55, 10 y las fronteras 80 y 50.\n3. Por cada caso: calcula, assert igualdad, imprime `PASS`.',
        hint: 'Incluye al menos un caso por rama y las fronteras 80 y 50 (como en el clasificador de T2).',
        hints: [
          'Incluye al menos un caso por rama y las fronteras 80 y 50 (como en el clasificador de T2).',
          'for val, expected in cases: assert classify_score(val) == expected',
        ],
        edgeCases: ['else path'],
        tests: 'N cases for N branches (mín. 3)',
        feedback:
          'Si solo imprimes `score status` sin `expected`, aún no hay prueba. Arma `cases = [(val, expected), ...]` y `assert` (o comparación explícita) antes de imprimir `PASS`.',
        retrospective:
          'Asocia cada caso con la rama que pretende cubrir y detecta si 90 y 80 ejercitan exactamente la misma condición. Ambos son útiles si uno prueba la frontera, pero debes poder explicarlo. Propón un cambio defectuoso que solo una frontera detectaría. El You Do exige esta misma trazabilidad en `_run_tests`.',
        starterCode: {
          language: 'python',
          title: 'tests_por_rama.py',
          code: `# CASO-LIM-003 · classify + tests por rama
def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

# DEFECT: falta lista cases + assert por rama (solo prints sin expected)
for s in [90, 60, 10]:
    print(s, classify_score(s), "Error")
`,
        },
        solutionCode: {
          language: 'python',
          title: 'tests_por_rama.py',
          code: `def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

cases = [
    (90, "accept"),
    (55, "review"),
    (10, "reject"),
    (80, "accept"),
    (50, "review"),
]
for val, expected in cases:
    got = classify_score(val)
    assert got == expected, (val, got, expected)
    print("PASS", val, got)`,
          output: `PASS 90 accept
PASS 55 review
PASS 10 reject
PASS 80 accept
PASS 50 review`,
        },
      },
      {
        subtopicId: 'S03-T4-B',
        kind: 'transfer',
        title: 'Test rojo: frontera inclusiva en edad 18',
        preamble:
          '- **Contexto:** off-by-one en fronteras es el bug más caro de reglas de edad/monto.\n- **Meta:** hacer pasar la suite donde 18 debe ser accept.\n- **Éxito:** PASS en 18 accept, 17 review, None review, 30 accept (asserts en verde).\n- **Límites:** corrige `>` por rango inclusivo; mantén guard de None; no borres los cases.',
        id: 'S03-T4-B-E3',
        instruction:
          '1. Observa el test rojo: 18 falla con la condición `e > 18`.\n2. Cambia a `18 <= e <= 65` (o equivalente).\n3. Descomenta/usa assert y confirma los cuatro PASS.',
        hint: 'Off-by-one clásico en frontera inferior inclusiva.',
        hints: [
          'Off-by-one clásico en frontera inferior inclusiva.',
          'Cambia > por >= en el camino accept; mantén guards de None.',
        ],
        edgeCases: ['off-by-one en rango'],
        tests: 'all green after fix',
        feedback:
          'Si 18 sigue en review, la condición aún es `e > 18`. Cambia a rango inclusivo (`18 <= e <= 65`); **no** edites el expected del case para “hacer pasar” el test.',
        retrospective:
          'Narra el ciclo completo: la política declara que 18 es inclusivo; el caso `(18, "accept")` vuelve visible esa promesa; la condición `e > 18` la viola; cambiarla a `>=` restaura el contrato. Si editas el expected, ocultas el defecto. Documenta esa frontera en el README y conserva el caso en `_run_tests` del You Do.',
        starterCode: {
          language: 'python',
          title: 'fix_off_by_one.py',
          code: `# CASO-LIM-003 · rango_edad boundary 18
# DEFECT: 18 queda fuera (e>18 en vez de e>=18)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def rango_edad(e):
    if e is None:
        return "review"
    if e > 18 and e <= 65:  # BUG: 18 queda fuera
        return "accept"
    if e < 0 or e > 120:
        return "reject"
    return "review"

cases = [(18, "accept"), (17, "review"), (None, "review"), (30, "accept")]
for val, expected in cases:
    got = rango_edad(val)
    print(val, got, "ok=", got == expected)
    # assert got == expected  # descomenta tras arreglar`,
        },
        solutionCode: {
          language: 'python',
          title: 'fix_off_by_one.py',
          code: `def rango_edad(e):
    if e is None:
        return "review"
    if 18 <= e <= 65:
        return "accept"
    if e < 0 or e > 120:
        return "reject"
    return "review"

cases = [(18, "accept"), (17, "review"), (None, "review"), (30, "accept")]
for val, expected in cases:
    got = rango_edad(val)
    assert got == expected
    print("PASS", val, got)`,
          output: `PASS 18 accept
PASS 17 review
PASS None review
PASS 30 accept`,
        },
      },
    ],
  },
  youDo: {
    title: 'Motor de reglas del intake (incremento CP-N1-A)',
    context:
      'Ahora integrarás la sección sin saltar directamente al archivo completo. Parte del parser de S02 y construye el motor en cuatro pasadas: **(1)** escribe el invariante de cada campo en español; **(2)** implementa un validador pequeño con guardas y resultado `{status, code, message}`; **(3)** compón `validate_record`; **(4)** ejecuta una matriz que cubra ausencia, tipo, frontera, valor válido y desconocido. El starter contiene defectos deliberados, no casillas vacías: predice qué asserts fallarán antes de corregirlos y cambia una causa por vez. Debes validar al menos tres campos, distinguir `None` de valores falsy válidos como `0` y usar solo datos ficticios. El resultado es el incremento **CP-N1-A**, listo para que otra persona revise la política sin adivinarla desde el código.',
    objectives: [
      'Definir ≥3 reglas de campo sobre registro sintético de cliente',
      'Devolver status accept|reject|review + code + message por campo',
      'Distinguir ausencia (None/missing) de valores falsy válidos (0, y políticas de "")',
      'Incluir tabla de ejemplos/pruebas con ≥1 caso por rama crítica',
      'Documentar invariantes en español en README o docstrings',
    ],
    requirements: [
      'Función o módulo validate_record(record: dict) → dict de resultados por campo',
      'Códigos estables: MISSING, OUT_OF_RANGE, NOT_IN_ALLOWLIST, NEEDS_REVIEW, OK (y BAD_TYPE si aplica)',
      'Cada resultado conserva exactamente status, code y message; los tipos incorrectos se rechazan sin lanzar TypeError',
      'Sin PII real; dataset sintético embebido o en data/',
      "if __name__ == '__main__' demo reproducible",
      'No usar assert como única validación de negocio (asserts OK en tests)',
      'Preferir guards a pirámides de if anidados',
    ],
    starterCode: `"""rules_engine_intake.py — incremento CP-N1-A (S03)
Datos sintéticos únicamente. No uses información real de clientes.

Forma de resultado estándar del You Do:
  { "status": "accept"|"reject"|"review", "code": str, "message": str }
"""

ALLOWED_REGIONS = {"Lima", "Arequipa", "Cusco", "Piura"}


def validate_edad(valor):
    """None → review; tipo mal o <0/>120 → reject; 0–17 → review; 18–120 → accept."""
    # DEFECT: truthiness trata None como reject; faltan tipo y borde negativo; menores → reject
    if not valor:
        return {
            "status": "reject",
            "code": "BAD",
            "message": "edad inválida",
        }
    if valor < 18:
        return {
            "status": "reject",
            "code": "OUT_OF_RANGE",
            "message": f"edad={valor}",
        }
    if valor > 120:
        return {
            "status": "reject",
            "code": "OUT_OF_RANGE",
            "message": f"edad={valor}",
        }
    return {"status": "accept", "code": "OK", "message": "edad OK"}


def validate_region(valor):
    """Allowlist sintética de regiones del Perú."""
    # DEFECT: None y desconocidos → reject; deben ser review con códigos distintos
    if valor in ALLOWED_REGIONS:
        return {
            "status": "accept",
            "code": "OK",
            "message": "region OK",
        }
    return {
        "status": "reject",
        "code": "NOT_IN_ALLOWLIST",
        "message": "region inválida",
    }


def validate_monto(valor):
    """0 válido; None → review; tipo mal/negativo → reject; >50000 → review."""
    # DEFECT: truthiness rechaza 0, trata None como reject y no protege el tipo
    if not valor:
        return {
            "status": "reject",
            "code": "BAD",
            "message": "monto inválido",
        }
    if valor < 0:
        return {
            "status": "reject",
            "code": "OUT_OF_RANGE",
            "message": f"Campo 'monto_ingreso'={valor} negativo; usa ≥ 0.",
        }
    if valor > 50000:
        return {
            "status": "review",
            "code": "NEEDS_REVIEW",
            "message": f"Campo 'monto_ingreso'={valor} supera 50000; revisa la captura.",
        }
    return {"status": "accept", "code": "OK", "message": "monto OK"}


def validate_record(record):
    """Devuelve {campo: {status, code, message}} para edad, region, monto_ingreso."""
    return {
        "edad": validate_edad(record.get("edad")),
        "region": validate_region(record.get("region")),
        "monto_ingreso": validate_monto(record.get("monto_ingreso")),
    }


def _run_tests():
    def assert_result(result):
        assert set(result) == {"status", "code", "message"}
        assert result["status"] in {"accept", "reject", "review"}
        assert isinstance(result["code"], str) and result["code"]
        assert isinstance(result["message"], str) and result["message"]

    # Caso feliz + cero válido en monto
    r = validate_record({"edad": 30, "region": "Lima", "monto_ingreso": 0})
    assert r["monto_ingreso"]["status"] == "accept"  # cero válido
    assert r["edad"]["status"] == "accept"
    assert r["region"]["status"] == "accept"
    for result in r.values():
        assert_result(result)

    # Ausencia ≠ cero
    r2 = validate_record({"edad": None, "region": "Arequipa", "monto_ingreso": None})
    assert r2["edad"]["code"] == "MISSING"
    assert r2["monto_ingreso"]["code"] == "MISSING"

    # Región desconocida → review con código trazable
    r3 = validate_record({"edad": 25, "region": "Tacna", "monto_ingreso": 100})
    assert r3["region"]["status"] == "review"
    assert r3["region"]["code"] == "NOT_IN_ALLOWLIST"

    # Menor → review; monto negativo → reject
    r4 = validate_record({"edad": 17, "region": "Lima", "monto_ingreso": -5})
    assert r4["edad"]["code"] == "NEEDS_REVIEW"
    assert r4["monto_ingreso"]["code"] == "OUT_OF_RANGE"

    # Tipos incorrectos se rechazan con BAD_TYPE, sin TypeError
    r5 = validate_record({"edad": "25", "region": None, "monto_ingreso": "100"})
    assert r5["edad"]["code"] == "BAD_TYPE"
    assert r5["region"]["code"] == "MISSING"
    assert r5["monto_ingreso"]["code"] == "BAD_TYPE"

    # Fronteras inclusivas y valor atípico revisable
    r6 = validate_record({"edad": 18, "region": "Piura", "monto_ingreso": 50000})
    assert all(result["code"] == "OK" for result in r6.values())
    r7 = validate_record({"edad": 121, "region": "Cusco", "monto_ingreso": 50001})
    assert r7["edad"]["code"] == "OUT_OF_RANGE"
    assert r7["monto_ingreso"]["code"] == "NEEDS_REVIEW"

    print("tests OK")


def main():
    demo = {
        "edad": 17,
        "region": "Lima",
        "monto_ingreso": -5,
    }
    print(validate_record(demo))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      'En el README cuenta la historia de una decisión, no una lista de funciones. Empieza con los invariantes en español; muestra después la tabla condición → status/code y explica por qué `if monto:` confundiría presencia con validez. Incluye una matriz con ausencia, tipo incorrecto, cero válido, fronteras, negativo y valor desconocido, y enlaza cada fila con la rama que protege. Si usas 50000 como umbral suave, decláralo como política revisable y explica por qué produce review en vez de reject. Cierra con una evidencia antes/después —por ejemplo, “el caso cero válido ya no cae en reject”— respaldada por el test correspondiente. Así la revisión de CP-N1-A puede discutir decisiones, no reconstruirlas.',
    rubric: [
      { criterion: 'Tri-estado correcto en todos los campos definidos', weight: '25%' },
      { criterion: 'Ausencia no se confunde con falsy válido', weight: '25%' },
      { criterion: 'Mensajes accionables con campo y expectativa', weight: '20%' },
      { criterion: 'Pruebas/ejemplos por rama', weight: '15%' },
      { criterion: 'Código legible (guards, constantes, sin pirámide)', weight: '10%' },
      { criterion: 'Documentación de invariantes en español', weight: '5%' },
    ],
    retrospective:
      'Haz una revisión en tres voces antes de marcar listo. Como **autor**, señala el test que demuestra que `None` y `0` no comparten rama. Como **operaciones**, toma un mensaje de error y verifica que permita corregir el registro sin abrir el código. Como **revisor**, cambia mentalmente una frontera o un default y nombra el caso que se volvería rojo. Después explica qué controles adicionales exigirías con datos reales —acceso, minimización, trazabilidad— frente a los datos sintéticos del curso. Termina el README con una afirmación verificable, como “los ceros válidos ya no caen en reject”, y enlázala con su prueba. Si una región desconocida termina en reject o un tipo incorrecto lanza `TypeError`, el motor aún no cumple la política.',
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la forma correcta de chequear ausencia de un campo opcional en un validador?',
        options: ['if not campo:', 'if campo == False:', 'if campo is None:', 'if campo is 0:'],
        correctIndex: 2,
        explanation:
          '`is None` responde la pregunta de presencia sin colapsar valores válidos como `0` o `""`. El distractor `if not campo` parece cómodo, pero mezcla ausencia y truthiness; `is 0` confunde identidad con valor.',
      },
      {
        question:
          'En un validador de monto de intake, ¿qué debe ocurrir con los valores None y 0 bajo la política del curso?',
        options: ['None → review (ausente); 0 → accept si el invariante lo permite', 'Ambos reject porque son falsy', 'Ambos accept siempre', '0 → review; None → accept'],
        correctIndex: 0,
        explanation:
          '`None` modela ausencia y requiere review; `0` es un valor presente que el invariante puede aceptar. “Ambos reject porque son falsy” describe el comportamiento de `bool`, no la política del dato.',
      },
      {
        question: 'En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?',
        options: ['Se evalúan todas las ramas y se combinan resultados', 'Se ejecuta esa rama y se omiten las siguientes', 'Se ejecuta también el else siempre', 'Python elige la rama más específica automáticamente'],
        correctIndex: 1,
        explanation:
          'La primera condición verdadera gana y las ramas posteriores se omiten. Python no busca la opción “más específica” ni ejecuta `else` siempre: el orden escrito y los operadores de frontera determinan la decisión.',
      },
      {
        question: '¿Qué devuelve la expresión `"" or "default"` en Python?',
        options: ['True', 'False', '""', '"default"'],
        correctIndex: 3,
        explanation:
          '`or` hace short-circuit y devuelve el primer operando truthy, o el último si ninguno lo es. Como `""` es falsy, el resultado es la cadena `"default"`, no el booleano `True`: `and` y `or` devuelven operandos.',
      },
      {
        question: 'Una allowlist de tipos de documento se implementa mejor como…',
        options: ['Una lista de if anidados por cada letra del código', 'Un float entre 0 y 1', 'Un set de literales y el operador in', 'assert tipo == "DNI" como única validación de producción'],
        correctIndex: 2,
        explanation:
          'Un `set` de literales más `in` expresa directamente pertenencia a un catálogo. Los `if` por letra no representan la regla y `assert` no debe ser la única validación de producción porque `python -O` puede desactivarlo.',
      },
      {
        question: '¿Cuándo aporta más claridad `match/case` que `if` en un motor de reglas introductorio?',
        options: ['Cuando el sujeto es un literal/estado finito (códigos) y hay case _', 'Siempre; match deprecó if en Python 3.12', 'Solo para rangos numéricos de montos', 'Nunca; match está deprecado'],
        correctIndex: 0,
        explanation:
          '`match` es estable desde Python 3.10 y hace visible una tabla de estados finitos, incluido `case _`. No reemplaza `if`: los rangos numéricos y las combinaciones de campos suelen leerse mejor como comparaciones.',
      },
      {
        question:
          'En un validador con guards, ¿por qué debe ir `if valor is None` antes de `if valor < 18`?',
        options: ['Porque None es más rápido de comparar que un int', 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero', 'Porque Python exige que None sea la última condición', 'No importa el orden: ambas ramas son equivalentes'],
        correctIndex: 1,
        explanation:
          'El embudo seguro es ausencia → tipo → rango → accept. Si evalúas `None < 18` antes de retirar la ausencia, Python lanza `TypeError`; no es una cuestión de velocidad ni una regla arbitraria de orden.',
      },
      {
        question:
          '¿Cuál de estos mensajes de validación es accionable para operaciones de intake?',
        options: ['Error', 'inválido', 'bad', "Campo 'edad'=-5 fuera de rango; usa un entero 0–120."],
        correctIndex: 3,
        explanation:
          'La opción correcta permite actuar porque identifica campo, valor problemático, frontera y corrección esperada. “Error”, “inválido” y “bad” solo anuncian que algo falló; obligan a adivinar la causa o leer el código.',
      },
    ],
  },
  resources: {
    docs: [
      {
        label: 'Python — Truth Value Testing',
        url: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing',
        note: 'Lista oficial de valores falsy y operaciones booleanas',
      },
      {
        label: 'Python — Comparisons & membership',
        url: 'https://docs.python.org/3/library/stdtypes.html#comparisons',
        note: '==, is, in, encadenamiento de comparaciones',
      },
      {
        label: 'Python Tutorial — Control Flow',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
        note: 'if/elif/else y match/case canónicos',
      },
      {
        label: 'PEP 636 — Structural Pattern Matching tutorial',
        url: 'https://peps.python.org/pep-0636/',
        note: 'Patrones OR, wildcard _ y cuándo usar match',
      },
      {
        label: 'Python for Everybody — conditionals',
        url: 'https://www.py4e.com/html3/03-conditional',
        note: 'if/else progressive disclosure',
      },
      {
        label: 'unittest — TestCase (assert patterns)',
        url: 'https://docs.python.org/3/library/unittest.html',
        note: 'Cubrir ramas accept/reject/review',
      },
    ],
    books: [
      {
        label: 'Python Crash Course (Matthes)',
        note: 'Capítulos de if y diccionarios como base; aplicar al motor de reglas del curso.',
      },
      {
        label: 'Fluent Python (Ramalho)',
        note: 'Profundidad en truthiness e identidad; consulta selectiva, no prerequisito de S03.',
      },
    ],
    courses: [
      {
        label: 'CS50P — Conditionals',
        url: 'https://cs50.harvard.edu/python/',
        note: 'Secuencia pedagógica de condicionales; no copiar problem sets.',
      },
      {
        label: 'MIT 6.100L',
        url: 'https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/',
        note: 'Control de flujo y contratos',
      },
      {
        label: 'Coursera — Python for Everybody',
        url: 'https://www.coursera.org/specializations/python',
        note: 'Condicionales e I/O',
      },
      {
        label: 'Kaggle Learn — Python',
        url: 'https://www.kaggle.com/learn/python',
        note: 'Micro-práctica de booleans e if',
      },
    ],
  },
}
