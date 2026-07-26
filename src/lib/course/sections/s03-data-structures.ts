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
    'En la incorporación de datos para bancos, fintech y comercios del Perú, el parser de entrada no basta con convertir tipos (S02). También hay que **decidir** si cada campo se acepta, se rechaza o pasa a revisión. Si tratas `None` como si fuera `0`, o usas `if monto:` y rechazas un cero válido, generas falsos positivos costosos. Esta sección construye el **motor de reglas** del proyecto CP-N1-A: comparaciones, valores verdaderos o falsos, `if/elif/else`, guardas, listas permitidas, tablas de decisión y pruebas de ramas con mensajes accionables.',
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
        'Aquí dominas lo que el **motor de reglas de intake** necesita ahora: booleanos, control de flujo y políticas **accept / reject / review** sobre un registro sintético de cliente — sin confundir `None` (ausente) con `0` o `""`. Las colecciones avanzadas y archivos (list/dict profundos, CSV/JSON) se trabajan más adelante en el currículum de datos.',
        'El hilo conductor es un **validador de campos** (`validate_field` / `validate_record`). **Evolución de forma del resultado:** al inicio usamos strings cortos (`"accept"` / `"review"`) para leer el booleano de negocio; en control de flujo aparecen dicts `{status, code}`; el **You Do** estandariza `{status, code, message}` **accionables**. Datos ficticios únicamente (`example.com`, teléfonos inventados). **Nunca** subas PII real al repo. Caso de lab: `CASO-LIM-003`.',
        'Orden pedagógico: **T1 Booleanos** (comparaciones → truthiness) → **T2 Control** (if/elif/else → guards) → **T3 Reglas** (rangos/allowlists → decision tables/match) → **T4 Verificación** (invariantes → mensajes y tests de ramas). Cada rama del motor debe ser **testeable** con un caso accept, reject y review.',
        '**Ritmo sugerido (~18 h):** sesiones 1–2 solo T1 (booleanos y el error de confundir `None` con `0`); 3–4 T2 (if/elif y guards); 5–6 T3 (rangos, allowlists y tablas/`match`); 7–8 T4 + You Do + self-check. No intentes dominar `match` y la matriz de tests el primer día: primero predice booleanos, luego una rama dominante, después política tri-estado.',
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
        title: 'Fuera de alcance en esta sección',
        content:
          'No forman parte de esta entrega los lectores CSV/JSON, el ETL de ventas ni los procesos de archivos. El objetivo es el **motor de reglas** del incremento **CP-N1-A**: validar cada campo con accept/reject/review. Colecciones y archivos se trabajan en secciones posteriores.',
      },
    },
    {
      heading: 'Comparaciones y el operador in',
      subtopicId: 'S03-T1-A',
      paragraphs: [
        'Un **booleano de negocio** nace de una comparación: `==`, `!=`, `<`, `<=`, `>`, `>=`. En intake, comparas edades, montos, códigos y regiones. Python también permite **encadenar**: `18 <= edad <= 65` equivale a `(18 <= edad) and (edad <= 65)` y se evalúa de forma segura (la expresión del medio se calcula una sola vez en la cadena).',
        '**Pertenencia**: `x in coleccion` / `x not in coleccion` funciona con str, list, set, dict (busca **claves**). Para allowlists de códigos fijos, un **`set` de literales** es ideal (un `set` es una colección sin duplicados; lo verás a fondo en colecciones): lectura clara y chequeo rápido. Atención a **mayúsculas**: `"dni" in {"DNI"}` es `False` — normaliza antes o documenta el contrato.',
        '**`is` vs. `==`**: usa **`is None` / `is not None`** para ausencia. No uses `is` para comparar números o strings de negocio (`True is 1` es `False` aunque `True == 1` sea `True`). `==` pregunta “¿mismo valor?”; `is` pregunta “¿mismo objeto?”.',
      ],
      code: {
        language: 'python',
        title: 'comparaciones_intake.py',
        code: `region = "Lima"
monto = 1500
ALLOWED = {"Lima", "Arequipa", "Cusco"}

print("region == 'Lima' →", region == "Lima")
print("region != 'Piura' →", region != "Piura")
print("monto > 0 →", monto > 0)
print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
print("region in ALLOWED →", region in ALLOWED)
print("'Piura' not in ALLOWED →", "Piura" not in ALLOWED)
`,
        output: `region == 'Lima' → True
region != 'Piura' → True
monto > 0 → True
1000 <= monto <= 2000 → True
region in ALLOWED → True
'Piura' not in ALLOWED → True`,
      },
      callout: {
        type: 'tip',
        title: 'Regla de intake',
        content:
          'Primero decide el operador (comparación vs. pertenencia). Luego fija el tipo del operando (S02). Solo después combina con and/or. No mezcles “¿existe?” con “¿está en rango?” en un solo if sin documentarlo.',
      },
    },
    {
      heading: 'Qué es verdadero en un if (y qué no es “ausente”)',
      subtopicId: 'S03-T1-B',
      paragraphs: [
        'Python evalúa la **truthiness** de un valor en `if`, `while`, `and` y `or`. Son **falsy** (por defecto): `None`, `False`, `0`, `0.0`, `0j`, `""`, `()`, `[]`, `{}`, `set()`, `range(0)`. Casi todo lo demás es **truthy**, incluso `[0]` o `"False"` — por eso **no** uses truthiness como “¿existe el campo?”.',
        'El error canónico del intake: **`if monto:` trata `0` como “no hay monto”**. En negocio, **cero puede ser válido** y **`None` significa ausente**. Separa políticas: presencia con `is None`, rango con comparaciones numéricas, vacío de texto con `== ""` o `not s.strip()` según el contrato. **Nunca** conviertas ausencia en reject automático sin documentarlo.',
        '`and` / `or` hacen **short-circuit** y **devuelven un operando** (no siempre `True`/`False`). `"" or "default"` → `"default"`; `0 and 99` → `0`. `not` sí devuelve booleano. Prioridad: `not` se une más fuerte que `and`, y `and` más que `or`.',
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
        title: 'Gate CP-N1-A',
        content:
          'Nunca uses solo `if campo:` para validar montos o conteos. Documenta: ausente (`None`) ≠ falsy válido (`0`, a veces `""`).',
      },
    },
    {
      heading: 'Ramas de decisión con if/elif/else',
      subtopicId: 'S03-T2-A',
      paragraphs: [
        'Ya sabes predecir booleanos y truthiness; ahora esos booleanos se convierten en **una sola rama dominante**. La forma canónica de una decisión exclusiva es **`if` / `elif` / `else`**. Se evalúan en orden; **la primera condición verdadera gana** y el resto no se ejecuta. El `else` es la rama por defecto (útil para `reject` o `review`).',
        '**Indentación** define el bloque: 4 espacios es el estilo del curso. Un `if` seguido de otro `if` (sin `elif`) **no es excluyente**: ambos pueden dispararse y **sobrescribir** el status. Eso es un bug clásico al clasificar scores.',
        'Para el motor de reglas, un patrón limpio es devolver un **solo status** por campo: `accept`, `review` o `reject`. Fronteras (`score >= 80`) deben estar documentadas en la tabla de ejemplos.',
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
          'Si un registro puede caer en dos estados a la vez, tu cadena de condiciones está mal diseñada. Ordena de más específico a más general o usa elif para exclusión mutua.',
      },
    },
    {
      heading: 'Salidas tempranas y ramas que nunca se tocan',
      subtopicId: 'S03-T2-B',
      paragraphs: [
        'Una **guard clause** (salida temprana) valida precondiciones y **retorna de inmediato** con `reject`/`review`, dejando el camino feliz al final sin pirámide de `if` anidados. Mejora legibilidad y reduce bugs de indentación.',
        'Orden típico en validadores: **1) ausencia (`is None`)** → **2) tipo** → **3) rango/allowlist** → **4) accept**. Si comparas `edad < 18` antes de chequear `None`, obtienes `TypeError`.',
        'Una **rama muerta** es código que nunca se ejecuta porque una condición anterior ya la cubre (p. ej. `if x >= 0: ... elif x > 5:` — el `elif` solo vería negativos, nunca `x > 5`). Aprende a leer el orden como un revisor de PRs.',
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
          'Las guardas no son un adorno: expresan el contrato de un validador profesional. Prefiere salidas tempranas a tres o más niveles de anidamiento.',
      },
    },
    {
      heading: 'Reglas de dominio: rangos y listas permitidas',
      subtopicId: 'S03-T3-A',
      paragraphs: [
        'Con exclusividad de ramas y guards, el motor ya puede combinar **reglas de dominio**: rangos numéricos y listas permitidas. Una **allowlist** es el conjunto de valores admitidos (`ALLOWED_REGIONES = {"Lima", "Arequipa", ...}`). Si el valor no está, suele ir a **`review`** (dato desconocido) o **`reject`** (política estricta). Nombra constantes en **`UPPER_CASE`**.',
        'Un **rango** usa comparaciones o encadenamiento: `MIN_EDAD <= edad <= MAX_EDAD`. Combina reglas con **`and`/`or`** de forma explícita; documenta si el fallo de allowlist es distinto del fallo de rango (códigos `NOT_IN_ALLOWLIST` vs. `OUT_OF_RANGE`).',
        'Tri-estado en dominio: **accept** (cumple), **reject** (viola una regla estricta) y **review** (ausente, desconocido o valor atípico que requiere revisión). El cero en montos suele ser accept si el invariante lo permite.',
      ],
      code: {
        language: 'python',
        title: 'regla_region_edad.py',
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
      callout: {
        type: 'info',
        title: 'Datos sintéticos de Perú',
        content:
          'Usamos regiones y tipos de documento ficticios para practicar. No son un padrón oficial ni sustituyen reglas de negocio reales de tu empresa.',
      },
    },
    {
      heading: 'Tablas de decisión y match/case',
      subtopicId: 'S03-T3-B',
      paragraphs: [
        'En T3-A combinaste allowlist y rango con `if`. Aquí el motor escala a **muchas ramas con el mismo sujeto** (un código de estado). Una **decision table** es una tabla de negocio: filas de condiciones → acción. Primero la escribes en español (o en un dict de ejemplos); después la implementas. Evita inventar ramas en el código que no estén en la tabla.',
        '**`match` / `case`** (Python 3.10+) brilla cuando el sujeto es un **literal o estado finito** (`"OK"`, `"MISSING"`, códigos de error). Soporta **OR patterns** (`case "A" | "B":`) y el comodín **`case _:`** (debe ser explícito para defaults). El primer case que matchea gana. Es la misma semántica de negocio que un `if/elif` bien ordenado; cambia la forma, no la política.',
        '**Cuándo preferir `if`**: rangos numéricos, combinaciones de varios campos, o condiciones que no son patrones de estructura. `match` no depreca `if`; elige por **claridad**. En el You Do usarás dicts `{status, code, message}`: la tabla decide el `code`; el mensaje lo redactas en T4.',
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
          'El curso asume 3.12+. Si tu entorno es < 3.10, implementa la misma tabla con if/elif; la semántica de negocio no cambia.',
      },
    },
    {
      heading: 'Invariantes: promesas que el dato debe cumplir',
      subtopicId: 'S03-T4-A',
      paragraphs: [
        'Ya armaste booleanos, control de flujo y tablas de decisión; ahora cierras el motor: **documentar promesas** y **probar cada rama**. Un **invariante** de campo es una promesa en español: “`contacto` es un str de 9 dígitos, o `None` si aún no se capturó”. No es código todavía: es **especificación**. Los **ejemplos canónicos** (accept/reject/review/missing) son la forma más barata de validar que el invariante es usable.',
        'Mínimo profesional: **al menos un ejemplo por estado de decisión** que tu regla produce. Si solo pruebas el camino feliz, el validador miente en producción.',
        '`assert` sirve en desarrollo y tests, pero **no** como única validación de intake en producción (`python -O` desactiva asserts). Usa returns con `status`/`code`/`message` para reglas de negocio.',
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
          'Si un colega no puede inventar un contraejemplo de tu invariante en 30 segundos, está demasiado vago. Reescribe.',
      },
    },
    {
      heading: 'Mensajes que se pueden ejecutar y pruebas por rama',
      subtopicId: 'S03-T4-B',
      paragraphs: [
        'Con invariantes y ejemplos canónicos (T4-A), el motor ya decide bien; falta **comunicar** el fallo y **probar** cada rama. Un mensaje accionable nombra el **campo**, el **problema** y la **acción esperada**: `Campo \'edad\'=-5 fuera de rango; usa 0–120.` Evita mensajes vagos como Error o inválido. Códigos estables (`MISSING`, `OUT_OF_RANGE`, `NOT_IN_ALLOWLIST`, `NEEDS_REVIEW`, `OK`) permiten métricas y i18n después.',
        '**Un test por rama** del validador: si tienes 4 caminos (None, tipo mal, rango, OK), necesitas ≥4 casos. El else/default también cuenta. Esta es la misma disciplina que usarás en el You Do (`_run_tests` del motor de reglas).',
        'No registres secretos ni información personal real; en el curso solo usamos datos sintéticos. El ciclo **prueba roja → ajustar regla → verde** permite depurar errores de uno en fronteras (`>= 18` frente a `> 18`). Cuando el mensaje y la prueba expresan el mismo contrato, la persona responsable de datos puede integrar el cambio con confianza.',
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
          'El proyecto de sección une ≥3 reglas, tri-estado, códigos estables, mensajes y una tabla de pruebas. Eso es el incremento CP-N1-A de S03.',
      },
    },
  ],
  iDo: {
    intro:
      'Ocho demos cortas (I Do), una por subtema T1-A…T4-B. Ejecútalas en el navegador (Pyodide) o en Python 3.12 local. Observa la salida embebida y compárala con lo que ves al correr el código; no inventes resultados. Después de cada demo, el We Do del mismo subtema te hace reparar o extender la idea. Datos sintéticos de intake únicamente.',
    steps: [
      {
        demoId: 'S03-T1-A-DEMO',
        subtopicId: 'S03-T1-A',
        environment: 'browser-pyodide',
        description: 'Comparar región y monto de un registro sintético',
        preamble:
          'Antes de armar un `if` de negocio, el analista de intake debe *predecir* booleanos sueltos. Aquí un registro sintético de `CASO-LIM-003` trae `region = "Lima"` y `monto = 1500` frente a un set de regiones permitidas. No escribas aún: ejecuta y confirma cada `True`/`False`. Presta atención al encadenamiento `1000 <= monto <= 2000` y a `region in ALLOWED` — son el vocabulario del motor de reglas. Solo datos ficticios; no hay PII real.',
        code: {
          language: 'python',
          title: 'S03-T1-A-DEMO — comparar_region_monto',
          code: `region = "Lima"
monto = 1500
ALLOWED = {"Lima", "Arequipa", "Cusco"}

print("region == 'Lima' →", region == "Lima")
print("region != 'Piura' →", region != "Piura")
print("monto >= 1000 →", monto >= 1000)
print("monto < 500 →", monto < 500)
print("region in ALLOWED →", region in ALLOWED)
print("'Piura' not in ALLOWED →", "Piura" not in ALLOWED)
print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
`,
          output: `region == 'Lima' → True
region != 'Piura' → True
monto >= 1000 → True
monto < 500 → False
region in ALLOWED → True
'Piura' not in ALLOWED → True
1000 <= monto <= 2000 → True`,
        },
        why: 'Antes de escribir condiciones de negocio, el analista predice booleanos sueltos. Cuatro comparaciones, dos pruebas de pertenencia y un encadenamiento fijan el vocabulario del motor de reglas.',
        retrospective:
          'Si puedes decir por qué `monto < 500` es `False` sin mirar la salida, ya lees comparaciones como un revisor de reglas. El error clásico es inventar el booleano en la cabeza sin ejecutar. En We Do repararás expresiones invertidas y practicarás `in` sobre una allowlist de documentos.',
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
        why: 'None, 0 y "" se evalúan como falsos, pero la política de monto solo trata None como ausente y acepta cero. Esta es la condición crítica del tri-estado.',
        retrospective:
          'El hábito es: presencia con `is None`, rango con comparaciones, no con `if monto:`. Confundir `0` con ausencia es el falso positivo caro del CP-N1-A. En We Do reescribirás un validador que hoy rechaza el cero.',
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
        why: 'Interior y fronteras en una sola cadena if/elif/else: una etiqueta por registro. 80 es accept (no review); 50 es review (no reject). Es la base del clasificador de calidad de intake.',
        retrospective:
          'La primera condición verdadera gana; por eso el orden y el `elif` importan. El error clásico es usar dos `if` seguidos y pisar el status. En We Do repararás umbrales invertidos y un `bad` que sobrescribe accept con review.',
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
        why: 'Misma matriz de casos, código lineal. Guards de None y tipo evitan TypeError y dejan el accept al final. `repr` deja claro que `"25"` es str, no int 25.',
        retrospective:
          'Si comparas `edad < 18` antes de comprobar `None`, obtienes `TypeError`. Las guardas no son un adorno: hacen legible el contrato del motor. En We Do completarás guardas y convertirás una pirámide de monto en salidas tempranas sin cambiar su semántica.',
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
        why: 'Allowlist + rango en una sola función. Región desconocida → review; edad fuera de banda → reject; ausencia → review.',
        retrospective:
          'Dos fallos distintos merecen dos destinos (review frente a reject). El error es reunir “no está en la lista” y “edad inválida” bajo el mismo estado. En We Do armarás `check_region` y un rango de monto con revisión de valores atípicos.',
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
        why: 'Ambas implementaciones coinciden; case _ cubre desconocidos. Elige match cuando el sujeto es un código finito.',
        retrospective:
          '`match` brilla con literales finitos; no depreca `if`. El error es “elegir match por moda” en un rango numérico. En We Do corregirás una tabla defectuosa y completarás cases con `case _`.',
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
        why: 'invariant_text + examples[] ejecutables: la especificación y la prueba viven juntas. `repr` hace legible el caso de solo espacios.',
        retrospective:
          'Ejemplos canónicos son especificación ejecutable. El error es solo probar el camino feliz. En We Do armarás `examples` de edad, un invariante multi-campo de apellidos y un contraejemplo que rompe una política demasiado estricta.',
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
        why: 'Loop de casos; todos pass; el mensaje de BAD_TYPE muestra campo + valor recibido + tipo esperado.',
        retrospective:
          'Un test por rama (incluido el default) es el mínimo profesional. Mensajes tipo “Error” no se pueden ejecutar. En We Do reescribirás mensajes vagos, armarás cases por rama y arreglarás un off-by-one en la frontera 18.',
      },
    ],
  },
  weDo: {
    intro:
      'Andamiaje por subtema (liberación gradual): **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios) en el orden T1→T4 del mapa. Cada ejercicio nombra el concepto, el contrato de entrada/salida y el caso sintético `CASO-LIM-003`. Cada uno trae **dos pistas** (principal y de refuerzo). Ejecuta y compara con la salida de la solución; no inventes resultados.',
    steps: [
      // ——— S03-T1-A ———
      {
        id: 'S03-T1-A-E1',
        subtopicId: 'S03-T1-A',
        kind: 'guided',
        title: 'Comparar edad y región (booleanos sueltos)',
        preamble:
          '- **Contexto:** en `CASO-LIM-003` el motor aún no escribe `if`; primero debe predecir booleanos de edad y región.\n- **Meta:** corregir cinco comparaciones invertidas o incompletas.\n- **Éxito:** con `edad = 25` y `region = "Cusco"`, imprimes exactamente: `True`, `True`, `True`, `False`, `True` (una línea cada una).\n- **Límites:** no uses `if` todavía; no inventes literales fijos; solo imprime la expresión booleana.',
        instruction:
          '1. Abre el starter: el DEFECT invierte o sustituye las cinco expresiones pedidas.\n2. Deja `edad = 25` y `region = "Cusco"`.\n3. Imprime, en este orden: `edad >= 18`, `edad < 65`, `18 <= edad <= 65`, `region == "Lima"`, `region != "Piura"`.\n4. Ejecuta y compara con el contrato de cinco booleanos.',
        hint: 'Usa print(expresion) directamente; no hace falta if todavía.',
        hints: [
          'Usa print(expresion) directamente; no hace falta if todavía.',
          'El encadenamiento 18 <= edad <= 65 es True para 25. region == "Lima" es False (region es Cusco).',
        ],
        edgeCases: ['igualdad en frontera min/max si cambias edad a 18 o 65'],
        tests: 'assert expected bools: True, True, True, False, True',
        feedback:
          'Las cinco líneas deben salir de expresiones reales, no de `print(True)`. Si `region == "Lima"` te da True, aún usas el operando incorrecto: `region` es Cusco.',
        retrospective:
          'Predecir booleanos sueltos es el hábito antes del `if` de negocio. El error clásico es imprimir el valor “que se espera” en lugar de la expresión real. El mismo vocabulario alimenta rangos y allowlists del motor.',
        starterCode: {
          language: 'python',
          title: 'comparar_edad_region.py',
          code: `# CASO-LIM-003 · comparaciones edad/región
# DEFECT: resultados invertidos / literales fijos incorrectos
edad = 25
region = "Cusco"
print(edad < 18)
print(edad >= 65)
print(edad < 18 or edad > 65)
print(region != "Piura")
print(region == "Lima")
`,
        },
        solutionCode: {
          language: 'python',
          title: 'comparar_edad_region.py',
          code: `edad = 25
region = "Cusco"

print(edad >= 18)
print(edad < 65)
print(18 <= edad <= 65)
print(region == "Lima")
print(region != "Piura")`,
          output: `True
True
True
False
True`,
        },
      },
      {
        id: 'S03-T1-A-E2',
        subtopicId: 'S03-T1-A',
        kind: 'independent',
        title: 'Membership en allowlist de tipo de documento',
        preamble:
          '- **Contexto:** los códigos de documento del intake (`DNI`, `CE`, `PAS`) se validan con pertenencia, no con un `if` por cada literal.\n- **Meta:** usar `t in TIPOS_DOC` y ver el efecto de mayúsculas.\n- **Éxito:** para `DNI`, `dni`, `RUC` imprimes `t → True/False` → `True`, `False`, `False`.\n- **Límites:** no uses `t == "DNI"`; no normalices a upper en este ejercicio (el punto es documentar sensibilidad).',
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
          'Allowlists literales fallan en silencio si el productor manda minúsculas. El error no es “Python está mal”: es contrato de normalización no documentado. En E3 contrastarás `is` vs `==` para presencia.',
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
        id: 'S03-T1-A-E3',
        subtopicId: 'S03-T1-A',
        kind: 'transfer',
        title: '`is None` frente a `==` en validadores',
        preamble:
          '- **Contexto:** en validadores de intake, chequear ausencia con el operador equivocado genera bugs silenciosos.\n- **Meta:** diagnosticar `is` vs `==` con `None` y con `True`/`1`.\n- **Éxito:** salida `True` / `True` / `False` más una nota que diga cuándo usar cada operador.\n- **Límites:** no uses `is` para comparar enteros o strings de negocio; solo para `None` (identidad de singleton).',
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
          '`is` pregunta identidad de objeto; `==` pregunta valor. `True == 1` es True por subtipo, pero `True is 1` es False. En el motor, presencia se escribe `is None`, no `== None` por estilo y claridad de review.',
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
        id: 'S03-T1-B-E1',
        subtopicId: 'S03-T1-B',
        kind: 'guided',
        title: 'Tabla de truthiness (falsy vs truthy)',
        preamble:
          '- **Contexto:** el `if` de Python usa truthiness; en intake eso choca con ceros y strings vacíos válidos.\n- **Meta:** imprimir `repr(v) → bool(v)` para una lista canónica de valores.\n- **Éxito:** nueve `False` y tres `True` (`"x"`, `1`, `[0]`) en el orden del starter.\n- **Límites:** no reemplaces `bool(v)` por `v is not None`; no reordenes la lista.',
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
          'Memorizar la lista falsy evita sorpresas en `if campo:`. El error es creer que “no None” implica “hay valor de negocio útil”. En E2 verás que `and`/`or` ni siquiera devuelven siempre un bool.',
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
        id: 'S03-T1-B-E2',
        subtopicId: 'S03-T1-B',
        kind: 'independent',
        title: 'Predecir valores de `and` / `or` (no solo bool)',
        preamble:
          '- **Contexto:** defaults de intake a menudo usan `valor or default`; hay que saber qué *objeto* devuelve la expresión.\n- **Meta:** imprimir el operando resultante de cinco expresiones `and`/`or`.\n- **Éxito:** `default`, `Lima`, `0`, `99`, `0` (como en el contrato del enunciado actual).\n- **Límites:** no conviertas a `bool(...)` el resultado; imprime el valor devuelto.',
        instruction:
          '1. El starter tiene operadores invertidos (`and` donde va `or` y viceversa).\n2. Corrige las cinco líneas: `"" or "default"`, `"Lima" or "default"`, `0 and 99`, `5 and 99`, `None or 0`.\n3. Ejecuta y verifica el contrato de cinco valores.',
        hint: 'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
        hints: [
          'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
          "'' or 'default' → 'default'; 0 and 99 → 0; None or 0 → 0.",
        ],
        edgeCases: ["'' or 'default'"],
        tests: 'assert results: default, Lima, 0, 99, 0',
        feedback: 'Si internalizaste el valor devuelto, dejas de “castear” mentalmente a True/False siempre.',
        retrospective:
          '`and`/`or` hacen short-circuit y devuelven un operando. El error es “castear” mentalmente siempre a True/False. Úsalo con cuidado en defaults; no lo uses para validar montos.',
        starterCode: {
          language: 'python',
          title: 'and_or_predict.py',
          code: `# CASO-LIM-003 · or/and cortocircuito
# DEFECT: operadores invertidos (and donde va or y viceversa)
print("'' or 'default' →", "" and "default")
print("'Lima' or 'default' →", "Lima" and "default")
print("0 and 99 →", 0 or 99)
print("5 and 99 →", 5 or 99)
print("None or 0 →", None and 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'and_or_predict.py',
          code: `print("'' or 'default' →", "" or "default")
print("'Lima' or 'default' →", "Lima" or "default")
print("0 and 99 →", 0 and 99)
print("5 and 99 →", 5 and 99)
print("None or 0 →", None or 0)`,
          output: `'' or 'default' → default
'Lima' or 'default' → Lima
0 and 99 → 0
5 and 99 → 99
None or 0 → 0`,
        },
      },
      {
        id: 'S03-T1-B-E3',
        subtopicId: 'S03-T1-B',
        kind: 'transfer',
        title: 'Arreglar validador de monto (None ≠ 0)',
        preamble:
          '- **Contexto:** un validador de monto con `if not monto` rechaza ceros válidos y confunde ausencia con error — falso positivo caro en fintech/retail.\n- **Meta:** reescribir `validate_monto` con política tri-estado correcta.\n- **Éxito:** para `None`, `0`, `-1`, `100` imprimes review, accept, reject, accept.\n- **Límites:** no uses truthiness para presencia; primero `m is None`; cero debe ser accept.',
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
          'Separar ausencia, negativo y cero es el gate CP-N1-A. El error canónico es `if not m`. Lleva este patrón a `validate_record` del You Do.',
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
        id: 'S03-T2-A-E1',
        subtopicId: 'S03-T2-A',
        kind: 'guided',
        title: 'Bandas de score con if/elif/else',
        preamble:
          '- **Contexto:** el clasificador de calidad del intake etiqueta un score en una sola rama dominante.\n- **Meta:** corregir umbrales invertidos en `classify_score`.\n- **Éxito:** para 80, 50, 49, 100 → accept, review, reject, accept.\n- **Límites:** una sola cadena `if/elif/else`; no uses ifs independientes.',
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
          'La primera rama verdadera gana: por eso 80 no “baja” a review. El error clásico es invertir umbrales o usar dos `if` y pisar el status (lo verás en E2). Si puedes explicar 49 → reject sin mirar la salida, ya lees fronteras como un revisor de PR.',
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
        id: 'S03-T2-A-E2',
        subtopicId: 'S03-T2-A',
        kind: 'independent',
        title: 'Bloques if secuenciales frente a cadena exclusiva',
        preamble:
          '- **Contexto:** un error clásico durante la revisión de cambios es sobrescribir `status` con un segundo `if` no excluyente.\n- **Meta:** dejar `bad` como está, implementar `good` con `if/elif/else` y comparar.\n- **Éxito:** para 95, 60, 30 → `good` da accept, review, reject (y `bad(95)` sigue en review).\n- **Límites:** no “arregles” `bad`; el contraste es la lección.',
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
          'Bloques `if` secuenciales ≠ cadena exclusiva. Durante la revisión de cambios, busca `status =` repetido. El mismo patrón rompe motores de reglas en producción.',
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
        id: 'S03-T2-A-E3',
        subtopicId: 'S03-T2-A',
        kind: 'transfer',
        title: 'Trazar bandas numéricas (orden de umbrales)',
        preamble:
          '- **Contexto:** cuando hay varias bandas (alto/medio/bajo/nulo), el orden de umbrales decide si 150 cae bien o mal.\n- **Meta:** implementar `band(n)` de más estricto a más general.\n- **Éxito:** 150→alto, 75→medio, 10→bajo, 0→nulo, -3→nulo.\n- **Límites:** umbral alto primero; `else` cubre 0 y negativos.',
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
          'Simular 4–5 entradas en papel antes de codear reduce bugs de orden. Si pones “bajo” primero, 150 nunca llega a “alto”. Lleva este hábito a decision tables.',
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
        id: 'S03-T2-B-E1',
        subtopicId: 'S03-T2-B',
        kind: 'guided',
        title: 'Guards de `validate_edad` (MISSING a OK)',
        preamble:
          '- **Contexto:** el validador de edad del motor usa early returns con códigos estables, no un solo `"BAD"`.\n- **Meta:** completar guards de ausencia, tipo, rango y menores.\n- **Éxito:** `None`→review/MISSING; `"25"`→reject/BAD_TYPE; `15`→review/NEEDS_REVIEW; `30`→accept/OK.\n- **Límites:** `is None` antes de comparar; devuelve dicts `{status, code}`; sin `if not edad`.',
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
          'Early exit de tipo es el primer guard serio. El error es tratar `None` y `"25"` como el mismo rechazo. Reutilizarás estos códigos en el You Do.',
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
        id: 'S03-T2-B-E2',
        subtopicId: 'S03-T2-B',
        kind: 'independent',
        title: 'Refactor de pirámide a guards (monto)',
        preamble:
          '- **Contexto:** `validate_monto_nested` ya tiene la política correcta, pero la pirámide es frágil durante la revisión de cambios.\n- **Meta:** escribir `validate_monto_guards` con salidas tempranas **sin** cambiar semántica.\n- **Éxito:** en `[None, "x", -1, 0, 500, 20000]` la versión anidada y la versión con guardas coinciden (`ok= True`).\n- **Límites:** no reescribas la política; 0 sigue accept; `>10000` sigue review.',
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
          'Misma matriz, menos indentación: la integración es más segura. El error es “mejorar” la política mientras reorganizas el código. En E3 detectarás ramas muertas por orden.',
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
        id: 'S03-T2-B-E3',
        subtopicId: 'S03-T2-B',
        kind: 'transfer',
        title: 'Detectar y reparar una rama muerta',
        preamble:
          '- **Contexto:** durante la revisión de cambios, un `elif` puede ser código muerto por solapamiento de condiciones.\n- **Meta:** explicar por qué `elif x > 5` nunca corre y reescribir `etiqueta_ok` con ramas alcanzables.\n- **Éxito:** tras la corrección, 6→positivo, -2→negativo, 0→cero; y una nota visible de que el `elif` original era inalcanzable.\n- **Límites:** no corrijas solo el número mágico; cambia el diseño de ramas.',
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
          'Leer el orden de condiciones es una competencia de revisión, no solo de sintaxis. El error es añadir bloques `elif` sin preguntar “¿qué valores llegan aquí?”. Aplícalo a los umbrales del motor de reglas.',
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
        id: 'S03-T3-A-E1',
        subtopicId: 'S03-T3-A',
        kind: 'guided',
        title: 'Allowlist de regiones (desconocido → review)',
        preamble:
          '- **Contexto:** catálogos incompletos en intake suelen mandar desconocidos a **review**, no a reject duro.\n- **Meta:** implementar `check_region` con allowlist sintética de Perú.\n- **Éxito:** Lima→accept; Tacna→review; None→review.\n- **Límites:** no uses reject para desconocidos en esta política; chequea `None` antes de `not in`.',
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
          'Allowlist + review para desconocidos es patrón de catálogos en evolución. El error es castigar con reject un valor que **operaciones aún pueden capturar**. Combínalo con rangos en E2/E3.',
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
        id: 'S03-T3-A-E2',
        subtopicId: 'S03-T3-A',
        kind: 'independent',
        title: 'Rango de monto con valor atípico revisable',
        preamble:
          '- **Contexto:** la calidad de datos distingue una falla estricta (monto negativo) de un valor atípico que requiere revisión (monto muy alto).\n- **Meta:** implementar `monto_ingreso` con tri-estado y cero válido.\n- **Éxito:** None, -1, 0, 1200, 60000 → review, reject, accept, accept, review.\n- **Límites:** 0 no es reject; superar el umbral 50000 produce review, no reject.',
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
          'El tri-estado con revisión de valores atípicos evita detener el proceso por un techo arbitrario. El error es tratar todo lo inusual como reject. Documenta la constante 50000 en el README del You Do.',
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
        id: 'S03-T3-A-E3',
        subtopicId: 'S03-T3-A',
        kind: 'transfer',
        title: 'Tipo de documento y longitud (códigos)',
        preamble:
          '- **Contexto:** DNI/CE/PAS tienen longitudes distintas; fallos de catálogo y de longitud deben llevar **códigos distintos**.\n- **Meta:** devolver dict `{status, code}` con MISSING, NOT_IN_ALLOWLIST, OUT_OF_RANGE, OK.\n- **Éxito:** DNI+8→OK; DNI corto→OUT_OF_RANGE; RUC→NOT_IN_ALLOWLIST; None→MISSING.\n- **Límites:** orden guards: ausencia → allowlist → longitud; no un solo `"reject"` genérico.',
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
          'Códigos distintos habilitan dashboards de calidad. El error es un solo status string sin `code`. Este patrón es el del You Do campo a campo.',
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
        id: 'S03-T3-B-E1',
        subtopicId: 'S03-T3-B',
        kind: 'guided',
        title: 'Decision table código → status',
        preamble:
          '- **Contexto:** primero se escribe la tabla de negocio; después el código. Así se evitan ramas inventadas.\n- **Meta:** corregir el dict `TABLE` y aplicar `get` con default review.\n- **Éxito:** OK→accept; MISSING→review; OUT_OF_RANGE→reject; FOO→review.\n- **Límites:** no añadas códigos de negocio que no estén en la tabla; el default cubre desconocidos.',
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
          'Primero la tabla, después el código. El error es hardcodear ifs sin fila default. En E2 la misma semántica vive en `match`.',
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
        id: 'S03-T3-B-E2',
        subtopicId: 'S03-T3-B',
        kind: 'independent',
        title: 'Misma tabla con match/case y OR patterns',
        preamble:
          '- **Contexto:** con sujetos de estado finito, `match` hace legible la misma decision table.\n- **Meta:** completar cases con OR patterns y `case _`.\n- **Éxito:** OK accept; MISSING/NEEDS_REVIEW review; OUT_OF_RANGE reject; FOO review.\n- **Límites:** Python 3.10+; si no hay match, if/elif equivalente (anótalo). No dejes que MISSING caiga en accept.',
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
          'match legible no cambia la política; cambia la forma. El error es un `case _` demasiado permisivo (accept). Elige match cuando el sujeto es literal finito.',
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
        id: 'S03-T3-B-E3',
        subtopicId: 'S03-T3-B',
        kind: 'transfer',
        title: 'Elegir if o match según el sujeto',
        preamble:
          '- **Contexto:** claridad de diseño > moda de sintaxis en el motor de reglas.\n- **Meta:** mapear códigos finitos con match y rango de edad con if; justificar en un print.\n- **Éxito:** `map_code` distingue OK/MISSING/OUT_OF_RANGE; `map_edad` da review/accept/reject en None/30/10; print de justificación.\n- **Límites:** no fuerces match sobre rangos numéricos; no dejes None→accept.',
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
          'Elige la forma por claridad del sujeto. El error es reescribir todo a match “porque es nuevo”. En T4 documentarás invariantes que esas ramas deben cumplir.',
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
        id: 'S03-T4-A-E1',
        subtopicId: 'S03-T4-A',
        kind: 'guided',
        title: 'Ejemplos canónicos del campo edad',
        preamble:
          '- **Contexto:** un invariante usable trae al menos un ejemplo por estado de decisión.\n- **Meta:** completar `validate_edad` (con type check) y una lista `examples` ejecutable.\n- **Éxito:** cuatro filas con `ok`/True: 30 accept, -1 reject, None review, `"x"` reject.\n- **Límites:** no uses solo el camino feliz; incluye missing y tipo mal.',
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
          'Ejemplos canónicos son la mitad del invariante. El error es validar solo 30 y declarar “listo”. En E2 el invariante cruza dos campos.',
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
        id: 'S03-T4-A-E2',
        subtopicId: 'S03-T4-A',
        kind: 'independent',
        title: 'Invariante multi-campo de apellidos',
        preamble:
          '- **Contexto:** `validate_record` del You Do combina campos; aquí practicas un invariante de dos apellidos.\n- **Meta:** accept solo si ambos no vacíos; un faltante → review; ambos vacíos → reject.\n- **Éxito:** texto de invariante en español + 3 examples ejecutables con expected correcto.\n- **Límites:** aplica `strip`; trata `None` y `""` como vacío; sin PII real.',
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
          'Multi-campo anticipa el record completo. El error es `if not ap or not am: reject` sin matiz de review. Documenta el invariante en el README del proyecto.',
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
        id: 'S03-T4-A-E3',
        subtopicId: 'S03-T4-A',
        kind: 'transfer',
        title: 'Contraejemplo a un invariante demasiado estricto',
        preamble:
          '- **Contexto:** “edad siempre 18–65 o reject” choca con la política real del curso (menores → review).\n- **Meta:** mostrar el contraejemplo (15, None) y proponer `validate_edad_fixed` + nuevo texto de invariante.\n- **Éxito:** strict muestra reject en 15/None; fixed da review en 15/None y accept en 30; print del invariante corregido.\n- **Límites:** no dejes menores como reject duro; fuera de 0–120 sí reject.',
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
          'Contraejemplos mejoran requisitos mejor que más ifs a ciegas. El error es codificar un invariante vago o cruel. En T4-B conectarás mensajes y tests a cada rama.',
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
        id: 'S03-T4-B-E1',
        subtopicId: 'S03-T4-B',
        kind: 'guided',
        title: 'Reescribir mensajes accionables de edad',
        preamble:
          '- **Contexto:** el equipo de operaciones de intake **no puede** actuar con mensajes “Error” o “inválido”.\n- **Meta:** reescribir tres mensajes vagos a plantilla campo + problema + acción.\n- **Éxito:** tres strings que nombren `edad`, el problema y qué hacer (sin PII real).\n- **Límites:** no inventes DNI ni teléfonos reales; usa valores sintéticos si citas un número.',
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
          'Mensajes accionables bajan tickets de soporte. El error es loguear solo un código interno sin acción. En E2 la disciplina se vuelve suite de asserts por rama.',
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
        id: 'S03-T4-B-E2',
        subtopicId: 'S03-T4-B',
        kind: 'independent',
        title: 'Un caso de prueba por cada rama',
        preamble:
          '- **Contexto:** si solo pruebas el camino feliz, el clasificador miente en fronteras.\n- **Meta:** armar `cases` con expected y un loop assert/print PASS sobre `classify_score`.\n- **Éxito:** al menos un caso por rama (accept/review/reject) e idealmente fronteras 80 y 50; todos PASS.\n- **Límites:** no borres la función; no uses prints sin assert (o sin comparación explícita).',
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
          'Cobertura de ramas es el mínimo del motor. El error es una lista de prints sin expected. El You Do exige la misma matriz en `_run_tests`.',
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
        id: 'S03-T4-B-E3',
        subtopicId: 'S03-T4-B',
        kind: 'transfer',
        title: 'Test rojo: frontera inclusiva en edad 18',
        preamble:
          '- **Contexto:** off-by-one en fronteras es el bug más caro de reglas de edad/monto.\n- **Meta:** hacer pasar la suite donde 18 debe ser accept.\n- **Éxito:** PASS en 18 accept, 17 review, None review, 30 accept (asserts en verde).\n- **Límites:** corrige `>` por rango inclusivo; mantén guard de None; no borres los cases.',
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
          'Test rojo → fix → verde es el flujo profesional de depurar reglas. El error es “ajustar el test” en vez de la frontera. Lleva la disciplina al README y a `_run_tests` del You Do.',
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
      'Construyes el **motor de reglas** sobre el parser de intake de S02: para un registro sintético de cliente, validas ≥3 campos y devuelves **accept | reject | review** con **code** y **message** accionable. Distingues ausencia (`None`/missing) de valores falsy válidos (`0`). Solo datos ficticios. Este es el incremento **CP-N1-A** de la sección.',
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
      'En el README documenta invariantes en español, la tabla de decisión de cada campo y por qué no usas `if monto:` para presencia. Incluye la matriz de pruebas: ausencia, tipo incorrecto, cero válido, fronteras, negativo y valor desconocido. Si usas un umbral de valor atípico suave para montos, documenta la constante (p. ej. 50000) y por qué envía a review en vez de reject. Esa evidencia permite que la persona responsable de datos revise el incremento CP-N1-A antes de integrarlo.',
    rubric: [
      { criterion: 'Tri-estado correcto en todos los campos definidos', weight: '25%' },
      { criterion: 'Ausencia no se confunde con falsy válido', weight: '25%' },
      { criterion: 'Mensajes accionables con campo y expectativa', weight: '20%' },
      { criterion: 'Pruebas/ejemplos por rama', weight: '15%' },
      { criterion: 'Código legible (guards, constantes, sin pirámide)', weight: '10%' },
      { criterion: 'Documentación de invariantes en español', weight: '5%' },
    ],
    retrospective:
      'Antes de marcar listo: (1) ¿en qué campo demuestras con un test que `None` y `0` no comparten rama? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII)? (3) Escribe en el README una frase de impacto medible (p. ej. “ceros válidos ya no caen a reject”) que puedas defender en 30 segundos ante un lead de datos. Si un desconocido de región va a reject, aún no cumples la política del curso.',
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la forma correcta de chequear ausencia de un campo opcional en un validador?',
        options: ['if not campo:', 'if campo == False:', 'if campo is None:', 'if campo is 0:'],
        correctIndex: 2,
        explanation:
          '`is None` distingue ausencia de valores falsy válidos como 0 o "". `if not campo` colapsa None, 0 y "" en el mismo camino.',
      },
      {
        question:
          'En un validador de monto de intake, ¿qué debe ocurrir con los valores None y 0 bajo la política del curso?',
        options: ['None → review (ausente); 0 → accept si el invariante lo permite', 'Ambos reject porque son falsy', 'Ambos accept siempre', '0 → review; None → accept'],
        correctIndex: 0,
        explanation:
          'None modela ausencia (review). 0 puede ser un monto válido; no uses `if monto:` para presencia.',
      },
      {
        question: 'En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?',
        options: ['Se evalúan todas las ramas y se combinan resultados', 'Se ejecuta esa rama y se omiten las siguientes', 'Se ejecuta también el else siempre', 'Python elige la rama más específica automáticamente'],
        correctIndex: 1,
        explanation:
          'La primera condición verdadera gana; elif/else posteriores no se ejecutan. Por eso el orden y las fronteras importan.',
      },
      {
        question: '¿Qué devuelve la expresión `"" or "default"` en Python?',
        options: ['True', 'False', '""', '"default"'],
        correctIndex: 3,
        explanation:
          '`or` hace short-circuit y devuelve el primer operando truthy (o el último si todos son falsy). `""` es falsy, así que resulta `"default"`.',
      },
      {
        question: 'Una allowlist de tipos de documento se implementa mejor como…',
        options: ['Una lista de if anidados por cada letra del código', 'Un float entre 0 y 1', 'Un set de literales y el operador in', 'assert tipo == "DNI" como única validación de producción'],
        correctIndex: 2,
        explanation:
          'Un set + `in` es legible y eficiente. assert no debe ser la única validación de negocio (se desactiva con -O).',
      },
      {
        question: '¿Cuándo aporta más claridad `match/case` que `if` en un motor de reglas introductorio?',
        options: ['Cuando el sujeto es un literal/estado finito (códigos) y hay case _', 'Siempre; match deprecó if en Python 3.12', 'Solo para rangos numéricos de montos', 'Nunca; match está deprecado'],
        correctIndex: 0,
        explanation:
          'match es estable desde 3.10 y útil para estados finitos. Los rangos numéricos suelen ser más claros con if y comparaciones.',
      },
      {
        question:
          'En un validador con guards, ¿por qué debe ir `if valor is None` antes de `if valor < 18`?',
        options: ['Porque None es más rápido de comparar que un int', 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero', 'Porque Python exige que None sea la última condición', 'No importa el orden: ambas ramas son equivalentes'],
        correctIndex: 1,
        explanation:
          'Orden típico: ausencia → tipo → rango → accept. Comparar `None < 18` produce TypeError; el guard de None (o de tipo) lo evita.',
      },
      {
        question:
          '¿Cuál de estos mensajes de validación es accionable para operaciones de intake?',
        options: ['Error', 'inválido', 'bad', "Campo 'edad'=-5 fuera de rango; usa un entero 0–120."],
        correctIndex: 3,
        explanation:
          'Un mensaje accionable nombra el campo, el problema y la acción esperada. "Error" o "inválido" no permiten corregir el registro sin adivinar.',
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
