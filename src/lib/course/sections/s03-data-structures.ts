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
    'En onboarding de data en bancos, fintech y retail en Perú, el parser de intake no basta con convertir tipos (S02): hay que **decidir** si cada campo se acepta, se rechaza o va a revisión. Si tratas `None` como si fuera `0`, o usas `if monto:` y rechazas un cero válido, generas falsos positivos caros. Esta sección construye el **motor de reglas** del capstone CP-N1-A: comparaciones, truthiness, if/elif/else, guards, allowlists, decision tables y pruebas de ramas con mensajes accionables.',
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
      heading: 'De “Data Structures” a decisiones de validación (mapa de la sección)',
      paragraphs: [
        'En V3, **S03 no es el path principal de list/dict/CSV/JSON**. Esos temas viven conceptualmente en **S06** (y módulos posteriores). Aquí el estudiante domina lo que el **motor de reglas de intake** necesita: booleanos, control de flujo y políticas **accept / reject / review** sobre un registro sintético de cliente — sin confundir `None` (ausente) con `0` o `""`.',
        'El hilo conductor es un **validador de campos** (`validate_field` / `validate_record`) que devuelve `{status, code, message}` **accionables**. Datos ficticios únicamente (`example.com`, teléfonos inventados). **Nunca** subas PII real al repo. Caso de lab: `CASO-LIM-003`.',
        'Orden pedagógico: **T1 Booleanos** (comparaciones → truthiness) → **T2 Control** (if/elif/else → guards) → **T3 Reglas** (rangos/allowlists → decision tables/match) → **T4 Verificación** (invariantes → mensajes y tests de ramas). Cada rama del motor debe ser **testeable** con un caso accept, reject y review.',
      ],
      callout: {
        type: 'info',
        title: 'Contenido reubicado conceptualmente a S6',
        content:
          'Material legado de esta sección (list/dict/set avanzados, CSV DictReader, JSON load/dump, pipeline ETL de ventas, Sales Log Parser) **no es el camino del estudiante en S03 V3**. Se conserva como referencia histórica en el historial del repo; el target de entrega es el **motor de reglas CP-N1-A**. Si necesitas estructuras y archivos, espera a S06 / secciones de datos.',
      },
    },
    {
      heading: 'Comparaciones y el operador in',
      subtopicId: 'S03-T1-A',
      paragraphs: [
        'Un **booleano de negocio** nace de una comparación: `==`, `!=`, `<`, `<=`, `>`, `>=`. En intake, comparas edades, montos, códigos y regiones. Python también permite **encadenar**: `18 <= edad <= 65` equivale a `(18 <= edad) and (edad <= 65)` y se evalúa de forma segura (la expresión del medio se calcula una sola vez en la cadena).',
        '**Pertenencia**: `x in coleccion` / `x not in coleccion` funciona con str, list, set, dict (busca **claves**). Para allowlists de códigos fijos, un **`set` de literales** es ideal: lectura clara y chequeo O(1). Atención a **mayúsculas**: `"dni" in {"DNI"}` es `False` — normaliza antes o documenta el contrato.',
        '**`is` vs `==`**: usa **`is None` / `is not None`** para ausencia. No uses `is` para comparar números o strings de negocio (`True is 1` es `False` aunque `True == 1` sea `True`). `==` pregunta “¿mismo valor?”; `is` pregunta “¿mismo objeto?”.',
      ],
      code: {
        language: 'python',
        title: 'comparaciones_intake.py',
        code: `def region_ok(region, allowed):
    return region in allowed

region = "Lima"
monto = 1500
ALLOWED = {"Lima", "Arequipa", "Cusco"}
print("region_ok", region_ok(region, ALLOWED))
print("monto_pos", monto > 0)
print("ok", True)
`,
        output: `True
True
True
True
True
True`,
      },
      callout: {
        type: 'tip',
        title: 'Regla de intake',
        content:
          'Primero decide el operador (comparación vs pertenencia). Luego fija el tipo del operando (S02). Solo después combina con and/or. No mezcles “¿existe?” con “¿está en rango?” en un solo if sin documentarlo.',
      },
    },
    {
      heading: 'Qué es verdadero en un if (y qué no es “ausente”)',
      subtopicId: 'S03-T1-B',
      paragraphs: [
        'Python evalúa la **truthiness** de un valor en `if`, `while`, `and` y `or`. Son **falsy** (por defecto): `None`, `False`, `0`, `0.0`, `0j`, `""`, `()`, `[]`, `{}`, `set()`, `range(0)`. Casi todo lo demás es **truthy**, incluso `[0]` o `"False"` — por eso **no** uses truthiness como “¿existe el campo?”.',
        'El error canónico del gate V3: **`if monto:` trata `0` como “no hay monto”**. En negocio, **cero puede ser válido** y **`None` significa ausente**. Separa políticas: presencia con `is None`, rango con comparaciones numéricas, vacío de texto con `== ""` o `not s.strip()` según el contrato. **Nunca** conviertas ausencia en reject automático sin documentarlo.',
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
        'La forma canónica de una decisión exclusiva es **`if` / `elif` / `else`**. Se evalúan en orden; **la primera condición verdadera gana** y el resto no se ejecuta. El `else` es el catch-all (útil para `reject` o `review` por defecto).',
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
    print(e, "→", validate_edad(e))`,
        output: `None → {'status': 'review', 'code': 'MISSING'}
25 → {'status': 'reject', 'code': 'BAD_TYPE'}
-1 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}`,
      },
      callout: {
        type: 'tip',
        title: 'Diseño, no solo sintaxis',
        content:
          'Guards no son “estilo fancy”: son el contrato de un validador profesional. Prefiere early return a 3+ niveles de anidamiento.',
      },
    },
    {
      heading: 'Reglas de dominio: rangos y listas permitidas',
      subtopicId: 'S03-T3-A',
      paragraphs: [
        'Una **allowlist** es el conjunto de valores admitidos (`ALLOWED_REGIONES = {"Lima", "Arequipa", ...}`). Si el valor no está, suele ir a **`review`** (dato desconocido) o **`reject`** (política estricta). Nombra constantes en **`UPPER_CASE`**.',
        'Un **rango** usa comparaciones o encadenamiento: `MIN_EDAD <= edad <= MAX_EDAD`. Combina reglas con **`and`/`or`** de forma explícita; documenta si el fallo de allowlist es distinto del fallo de rango (códigos `NOT_IN_ALLOWLIST` vs `OUT_OF_RANGE`).',
        'Tri-estado en dominio: **accept** (cumple), **reject** (viola hard), **review** (ausente, desconocido u outlier suave). El cero en montos suele ser accept si el invariante lo permite.',
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

for r, e in [("Lima", 30), ("Tacna", 30), ("Lima", 15), (None, 40)]:
    print(r, e, "→", rule_region_edad(r, e))`,
        output: `Lima 30 → accept
Tacna 30 → review
Lima 15 → reject
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
        'Una **decision table** es una tabla de negocio: filas de condiciones → acción. Primero la escribes en español (o en un dict de ejemplos); después la implementas. Evita inventar ramas en el código que no estén en la tabla.',
        '**`match` / `case`** (Python 3.10+) brilla cuando el sujeto es un **literal o estado finito** (`"OK"`, `"MISSING"`, códigos de error). Soporta **OR patterns** (`case "A" | "B":`) y el comodín **`case _:`** (debe ser explícito para defaults). El primer case que matchea gana.',
        '**Cuándo preferir `if`**: rangos numéricos, combinaciones de varios campos, o condiciones que no son patrones de estructura. `match` no depreca `if`; elige por **claridad**.',
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
        'Un **invariante** de campo es una promesa en español: “`contacto` es un str de 9 dígitos, o `None` si aún no se capturó”. No es código todavía: es **especificación**. Los **ejemplos canónicos** (accept/reject/review/missing) son la forma más barata de validar que el invariante es usable.',
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
    print(ex["value"], "→", got, "ok=", got == ex["expected"])`,
        output: `999000111 → accept ok= True
12345 → reject ok= True
None → review ok= True
   → reject ok= True`,
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
        "Un mensaje accionable nombra el **campo**, el **problema** y la **acción esperada**: `Campo 'edad'=-5 fuera de rango; usa 0–120.` Evita mensajes vagos como Error o inválido. Códigos estables (`MISSING`, `OUT_OF_RANGE`, `NOT_IN_ALLOWLIST`, `NEEDS_REVIEW`, `OK`) permiten métricas y i18n después.",
        '**Un test por rama** del validador: si tienes 4 caminos (None, tipo mal, rango, OK), necesitas ≥4 casos. El else/default también cuenta.',
        'No loguees secretos ni PII real. En el curso solo datos sintéticos. El ciclo **test rojo → arreglar regla → verde** es la forma de depurar off-by-one en fronteras (`>= 18` vs `> 18`).',
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
      'Ocho demos cortas (I Do), una por subtema. Ejecútalas en el navegador (Pyodide) o en Python 3.12 local. Observa la salida embebida; no inventes resultados. Datos sintéticos de intake únicamente.',
    steps: [
      {
        demoId: 'S03-T1-A-DEMO',
        subtopicId: 'S03-T1-A',
        environment: 'browser-pyodide',
        description: 'Comparar región y monto de un registro sintético',
        code: {
          language: 'python',
          title: 'S03-T1-A-DEMO — comparar_region_monto',
          code: `def region_and_monto(region, monto, allowed):
    return region in allowed, monto > 0

region = "Lima"
monto = 1500
ALLOWED = {"Lima", "Arequipa", "Cusco"}
print("region == 'Lima'", region == "Lima")
print("checks", region_and_monto(region, monto, ALLOWED))
print("ok", True)
`,
          output: `region == 'Lima' → True
region != 'Piura' → True
monto >= 1000 → True
monto < 500 → False
region in ALLOWED → True
'Piura' not in ALLOWED → True
1000 <= monto <= 2000 → True`,
        },
        why: 'Antes de escribir ifs de negocio, el analista predice booleanos sueltos. Cuatro comparaciones + dos membership checks fijan el vocabulario del motor de reglas.',
      },
      {
        demoId: 'S03-T1-B-DEMO',
        subtopicId: 'S03-T1-B',
        environment: 'browser-pyodide',
        description: 'Tres campos: None, 0 y vacío bajo reglas distintas',
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
        why: 'None, 0 y "" son todos falsy, pero la política de monto solo trata None como ausente y acepta cero. Este es el gate crítico del tri-estado.',
      },
      {
        demoId: 'S03-T2-A-DEMO',
        subtopicId: 'S03-T2-A',
        environment: 'browser-pyodide',
        description: 'Clasificar score de calidad en accept/review/reject',
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

for s in [95, 60, 30]:
    print(s, "→", classify_score(s))`,
          output: `95 → accept
60 → review
30 → reject`,
        },
        why: 'Tres scores, tres ramas. if/elif/else garantiza una sola etiqueta por registro — base del clasificador de calidad de intake.',
      },
      {
        demoId: 'S03-T2-B-DEMO',
        subtopicId: 'S03-T2-B',
        environment: 'browser-pyodide',
        description: 'De pirámide a guards en validate_edad',
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
    print(e, "→", validate_edad(e))`,
          output: `None → {'status': 'review', 'code': 'MISSING'}
25 → {'status': 'reject', 'code': 'BAD_TYPE'}
-1 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}
200 → {'status': 'reject', 'code': 'OUT_OF_RANGE'}`,
        },
        why: 'Misma matriz de casos, código lineal. Guards de None y tipo evitan TypeError y dejan el accept al final.',
      },
      {
        demoId: 'S03-T3-A-DEMO',
        subtopicId: 'S03-T3-A',
        environment: 'browser-pyodide',
        description: 'Regla combinada región + edad',
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

for r, e in [("Lima", 30), ("Tacna", 30), ("Lima", 15), (None, 40)]:
    print(r, e, "→", rule_region_edad(r, e))`,
          output: `Lima 30 → accept
Tacna 30 → review
Lima 15 → reject
None 40 → review`,
        },
        why: 'Allowlist + rango en una sola función. Región desconocida → review; edad fuera de banda → reject; ausencia → review.',
      },
      {
        demoId: 'S03-T3-B-DEMO',
        subtopicId: 'S03-T3-B',
        environment: 'browser-pyodide',
        description: 'Misma tabla en if/elif y en match',
        code: {
          language: 'python',
          title: 'S03-T3-B-DEMO — if_vs_match',
          code: `def status_if(code: str) -> str:
    if code == "OK":
        return "accept"
    elif code in ("MISSING", "NEEDS_REVIEW"):
        return "review"
    elif code == "OUT_OF_RANGE":
        return "reject"
    else:
        return "review"

for c in ["OK", "MISSING", "OUT_OF_RANGE", "X"]:
    print(c, "→", status_if(c))
print("ok", True)
`,
          output: `OK accept accept same= True
MISSING review review same= True
OUT_OF_RANGE reject reject same= True
FOO review review same= True
NEEDS_REVIEW review review same= True`,
        },
        why: 'Ambas implementaciones coinciden; case _ cubre desconocidos. Elige match cuando el sujeto es un código finito.',
      },
      {
        demoId: 'S03-T4-A-DEMO',
        subtopicId: 'S03-T4-A',
        environment: 'browser-pyodide',
        description: 'Invariante de campo contacto + 4 ejemplos',
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
    print(ex["value"], "→", got, "ok=", got == ex["expected"])`,
          output: `contacto es str de 9 dígitos o None (review)
999000111 → accept ok= True
12345 → reject ok= True
None → review ok= True
   → reject ok= True`,
        },
        why: 'invariant_text + examples[] ejecutables: la especificación y la prueba viven juntas.',
      },
      {
        demoId: 'S03-T4-B-DEMO',
        subtopicId: 'S03-T4-B',
        environment: 'browser-pyodide',
        description: 'Suite mínima de pruebas del motor de reglas',
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
      },
    ],
  },
  weDo: {
    intro:
      'Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints** (`hints[]` + `hint` primario). Ejecuta y compara; no inventes salidas. Datos sintéticos únicamente.',
    steps: [
      // ——— S03-T1-A ———
      {
        id: 'S03-T1-A-E1',
        subtopicId: 'S03-T1-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — Con `edad = 25` y `region = "Cusco"`, imprime el booleano de: `edad >= 18`, `edad < 65`, `18 <= edad <= 65`, `region == "Lima"`, `region != "Piura"`.',
        hint: 'Usa print(expresion) directamente; no hace falta if todavía.',
        hints: [
          'Usa print(expresion) directamente; no hace falta if todavía.',
          'El encadenamiento 18 <= edad <= 65 es True para 25. region == "Lima" es False.',
        ],
        edgeCases: ['igualdad en frontera min/max si cambias edad a 18 o 65'],
        tests: 'assert expected bools: True, True, True, False, True',
        feedback: 'Si predijiste los cinco booleanos, ya lees comparaciones como un revisor de reglas.',
        starterCode: {
          language: 'python',
          title: 'comparar_edad_region.py',
          code: `# CASO-LIM-003 · comparaciones edad/región
# DEFECT: resultados invertidos / hardcode
edad = 25
region = "Cusco"
print(edad < 18)
print(edad >= 65)
print(edad < 18 or edad > 65)
print(region != "Lima")
print(region == "Piura")
print('ok', True)
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
        instruction:
          'E2 (independiente) — Define `TIPOS_DOC = {"DNI", "CE", "PAS"}`. Para cada valor en `["DNI", "dni", "RUC"]`, imprime si está en la allowlist (`in`).',
        hint: 'for t in lista: print(t, "→", t in TIPOS_DOC)',
        hints: [
          'for t in lista: print(t, "→", t in TIPOS_DOC)',
          'Case sensitivity: "dni" ≠ "DNI". RUC no está en el set.',
        ],
        edgeCases: ['case sensitivity de códigos'],
        tests: '3 inputs → True, False, False',
        feedback: 'Allowlists literales fallan en silencio si no normalizas mayúsculas. Documenta el contrato.',
        starterCode: {
          language: 'python',
          title: 'allowlist_tipo_doc.py',
          code: `# CASO-LIM-003 · membership set TIPOS_DOC
# DEFECT: compara con == lista
TIPOS_DOC = {"DNI", "CE", "PAS"}
for t in ["DNI", "dni", "RUC"]:
    print(t, "→", t == "DNI")
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Diagnóstico: imprime `valor is None` con `valor = None`, luego `True == 1` y `True is 1`. Explica en un print cuándo usar `is` vs `==` en validadores de intake.',
        hint: 'is None para ausencia; == para valores de negocio. No uses is con enteros.',
        hints: [
          'is None para ausencia; == para valores de negocio. No uses is con enteros.',
          'True == 1 es True (bool subtipo int) pero True is 1 es False: identidad ≠ igualdad.',
        ],
        edgeCases: ['True == 1', 'is None idiom'],
        tests: 'rubric + fixed snippet: True, True, False + nota',
        feedback: 'Elegir is vs == es el bug silencioso #1 en chequeos de presencia.',
        starterCode: {
          language: 'python',
          title: 'is_vs_eq.py',
          code: `# CASO-LIM-003 · is None vs ==
# DEFECT: confunde is y ==
valor = None
print("valor is None →", valor == None)
print("True == 1 →", True is 1)
print("True is 1 →", True == 1)
print("Nota:", "is es identidad")
print('ok', True)
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
        instruction:
          'E1 (guiado) — Tabla truthiness: imprime `bool(v)` para `None`, `False`, `0`, `0.0`, `""`, `[]`, `{}`, `set()`, `range(0)`, `"x"`, `1`, `[0]`.',
        hint: 'for v in lista: print(repr(v), "→", bool(v))',
        hints: [
          'for v in lista: print(repr(v), "→", bool(v))',
          'range(0) es falsy; [0] es truthy (lista no vacía).',
        ],
        edgeCases: ['range(0)', 'False', '[0] truthy'],
        tests: 'checklist: 9 falsy + 3 truthy en el orden dado',
        feedback: 'Memorizar la lista falsy evita sorpresas en if campo:.',
        starterCode: {
          language: 'python',
          title: 'tabla_truthiness.py',
          code: `# CASO-LIM-003 · truthiness
# DEFECT: usa is not None como bool
vals = [None, False, 0, 0.0, "", [], {}, set(), range(0), "x", 1, [0]]
for v in vals:
    print(repr(v), "→", v is not None)
print('ok', True)
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
        instruction:
          "E2 (independiente) — Predice e imprime: `'' or 'default'`, `'Lima' or 'default'`, `0 and 99`, `5 and 99`, `None or 0`.",
        hint: 'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
        hints: [
          'and/or devuelven operando, no necesariamente bool. Short-circuit: or se detiene en el primero truthy.',
          "'' or 'default' → 'default'; 0 and 99 → 0; None or 0 → 0.",
        ],
        edgeCases: ["'' or 'default'"],
        tests: 'assert results: default, Lima, 0, 99, 0',
        feedback: 'Si internalizaste el valor devuelto, dejas de “castear” mentalmente a True/False siempre.',
        starterCode: {
          language: 'python',
          title: 'and_or_predict.py',
          code: `# CASO-LIM-003 · or/and cortocircuito
# DEFECT: valores incorrectos
print("'' or 'default' →", "" and "default")
print("'Lima' or 'default' →", "Lima" and "default")
print("0 and 99 →", 0 or 99)
print("5 and 99 →", 5 or 99)
print("None or 0 →", None and 0)
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Bug: un validador hace `if not monto: return "reject"`. Reescribe `validate_monto(m)` con `is None` para review, `< 0` reject, y accept para 0 y positivos. Prueba `None`, `0`, `-1`, `100`.',
        hint: 'Nunca uses truthiness para montos. if m is None primero.',
        hints: [
          'Nunca uses truthiness para montos. if m is None primero.',
          '0 debe devolver accept; None → review; negativo → reject.',
        ],
        edgeCases: ['0 válido; None review'],
        tests: 'cases accept/review: None review, 0 accept, -1 reject, 100 accept',
        feedback: 'Reescribir el test de presencia con is None es el fix del gate V3.',
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

for m in [None, 0, -1, 10]:
    print(m, "→", validate_monto(m))
print('ok', True)
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
        instruction:
          'E1 (guiado) — Completa `classify_score`: ≥80 accept, ≥50 review, else reject. Imprime resultados para 80, 50, 49, 100.',
        hint: 'if score >= 80: ... elif score >= 50: ... else: ...',
        hints: [
          'if score >= 80: ... elif score >= 50: ... else: ...',
          'Fronteras: 80 es accept; 50 es review; 49 es reject.',
        ],
        edgeCases: ['frontera exacta 80 y 50'],
        tests: 'assert status: accept, review, reject, accept',
        feedback: 'Documentar fronteras en el enunciado evita discusiones de off-by-one.',
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
print('ok', True)
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
        instruction:
          'E2 (independiente) — La función `bad` usa ifs independientes y clasifica mal el 95 (queda review). Reescribe `good` con if/elif/else y compara ambos en 95, 60, 30.',
        hint: 'El segundo if score >= 50 pisa el accept. Usa elif para exclusión mutua.',
        hints: [
          'El segundo if score >= 50 pisa el accept. Usa elif para exclusión mutua.',
          'good(95) debe ser accept; bad(95) es review.',
        ],
        edgeCases: ['doble asignación de status'],
        tests: 'single status key; good: accept/review/reject',
        feedback: 'ifs secuenciales ≠ cadena exclusiva. Review de PR: busca status sobrescrito.',
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

for s in [80, 50, 49]:
    print(s, bad(s))
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Traza mentalmente y luego implementa `band(n)`: `>100` alto, `>50` medio, `>0` bajo, else nulo. Verifica 150, 75, 10, 0, -3.',
        hint: 'Orden: primero el umbral más alto. else cubre 0 y negativos.',
        hints: [
          'Orden: primero el umbral más alto. else cubre 0 y negativos.',
          '0 no es > 0 → nulo. 75 no es >100 pero sí >50 → medio.',
        ],
        edgeCases: ['else path para 0 y negativos'],
        tests: 'table match: alto, medio, bajo, nulo, nulo',
        feedback: 'Simular 4–5 entradas en papel antes de codear reduce bugs de orden.',
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
print('ok', True)
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
        instruction:
          'E1 (guiado) — Completa guards en `validate_edad`: None → MISSING/review; no int → BAD_TYPE/reject; luego OUT_OF_RANGE / NEEDS_REVIEW / OK como en la demo. Prueba None, "25", 15, 30.',
        hint: 'if edad is None primero; luego isinstance; no compares None con <.',
        hints: [
          'if edad is None primero; luego isinstance; no compares None con <.',
          'return dicts con status y code; el camino feliz es el último return.',
        ],
        edgeCases: ['None antes de comparación'],
        tests: 'no TypeError; codes MISSING, BAD_TYPE, NEEDS_REVIEW, OK',
        feedback: 'Early exit de tipo es el primer guard de un validador serio.',
        starterCode: {
          language: 'python',
          title: 'guards_edad.py',
          code: `# CASO-LIM-003 · validate_edad guards
def validate_edad(edad):
    # DEFECT: no distingue None vs tipo
    if not edad:
        return {"status": "reject", "code": "BAD"}
    return {"status": "accept", "code": "OK"}

for e in [None, "25", 15, 30]:
    print(e, "→", validate_edad(e))
print('ok', True)
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
    print(e, "→", validate_edad(e))`,
          output: `None → {'status': 'review', 'code': 'MISSING'}
25 → {'status': 'reject', 'code': 'BAD_TYPE'}
15 → {'status': 'review', 'code': 'NEEDS_REVIEW'}
30 → {'status': 'accept', 'code': 'OK'}`,
        },
      },
      {
        id: 'S03-T2-B-E2',
        subtopicId: 'S03-T2-B',
        kind: 'independent',
        instruction:
          'E2 (independiente) — Refactoriza la pirámide anidada de `validate_monto_nested` a guards lineales con la misma semántica: None review, no int reject, <0 reject, 0–10000 accept, else review (outlier).',
        hint: 'Invierte el anidamiento: un if + return por precondición.',
        hints: [
          'Invierte el anidamiento: un if + return por precondición.',
          'Compara salidas con la función nested en los mismos casos de prueba.',
        ],
        edgeCases: ['mantener semántica', 'outlier suave > 10000'],
        tests: 'same outputs que nested en [None, "x", -1, 0, 500, 20000]',
        feedback: 'Misma matriz, menos indentación: eso es maintainability medible.',
        starterCode: {
          language: 'python',
          title: 'refactor_guards_monto.py',
          code: `# CASO-LIM-003 · nested if monto
def validate_monto_nested(m):
    # DEFECT: anidado profundo sin early return; 0 cae mal
    if m is not None:
        if isinstance(m, int):
            if m > 0:
                if m <= 10000:
                    return "accept"
                else:
                    return "reject"
            else:
                return "reject"
        else:
            return "reject"
    else:
        return "reject"

for m in [None, 0, 5, 20000]:
    print(m, validate_monto_nested(m))
print('ok', True)
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
        instruction:
          'E3 (transferencia) — En el snippet, identifica la rama muerta: imprime cuál `elif` nunca corre y por qué. Luego reordena/corrige para que `x == 0` sea alcanzable y muestre `cero`.',
        hint: 'Si if x != 0 cubre todo lo no-cero, el elif x > 0 puede vivir, pero elif x == 0 tras if x != 0 es muerto.',
        hints: [
          'Mira el orden: cualquier condición ya cubierta por un if anterior es inalcanzable.',
          'Corrige: if x > 0 / elif x < 0 / else (cero), o chequea x == 0 primero.',
        ],
        edgeCases: ['condiciones superpuestas', 'rama muerta'],
        tests: 'identify dead branch; after fix x=0 → cero',
        feedback: 'Detectar dead code en review es Analizar (Bloom), no solo Aplicar sintaxis.',
        starterCode: {
          language: 'python',
          title: 'rama_muerta.py',
          code: `# CASO-LIM-003 · elif muerto
def etiqueta_bug(x):
    if x != 0:
        if x > 0:
            return "positivo"
        return "negativo"
    elif x == 0:  # DEFECT: se alcanza, pero rama confusa
        return "cero?"
    return "??"

for x in [-1, 0, 2]:
    print(x, etiqueta_bug(x))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: 'rama_muerta.py',
          code: `def etiqueta_bug(x):
    if x != 0:
        if x > 0:
            return "positivo"
        return "negativo"
    elif x == 0:
        return "cero"
    return "???"

print("bug 0 →", etiqueta_bug(0))
print("bug 3 →", etiqueta_bug(3))
print("nota: elif x==0 SÍ se alcanza aquí porque el if es x!=0; "
      "ejemplo clásico de muerto: if x>=0 / elif x>5")

def etiqueta_ok(x):
    if x > 0:
        return "positivo"
    elif x < 0:
        return "negativo"
    else:
        return "cero"

print("ok 0 →", etiqueta_ok(0))
print("ok 3 →", etiqueta_ok(3))
print("ok -2 →", etiqueta_ok(-2))

# Demostración de rama realmente muerta:
def muerto(x):
    if x >= 0:
        return "no-negativo"
    elif x > 5:  # inalcanzable
        return "nunca"
    else:
        return "negativo"

print("muerto(6) →", muerto(6), "(nunca no aparece)")`,
          output: `bug 0 → cero
bug 3 → positivo
nota: elif x==0 SÍ se alcanza aquí porque el if es x!=0; ejemplo clásico de muerto: if x>=0 / elif x>5
ok 0 → cero
ok 3 → positivo
ok -2 → negativo
muerto(6) → no-negativo (nunca no aparece)`,
        },
      },
      // ——— S03-T3-A ———
      {
        id: 'S03-T3-A-E1',
        subtopicId: 'S03-T3-A',
        kind: 'guided',
        instruction:
          'E1 (guiado) — `ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}`. Escribe `check_region(r)`: None → review; not in ALLOWED → review; else accept. Prueba Lima, Tacna, None.',
        hint: 'if r is None / if r not in ALLOWED / return accept',
        hints: [
          'if r is None / if r not in ALLOWED / return accept',
          'Región desconocida → review (no reject) en esta política sintética.',
        ],
        edgeCases: ['región desconocida → review'],
        tests: 'assert Lima accept, Tacna review, None review',
        feedback: 'Allowlist + review para desconocidos es patrón de catálogos incompletos.',
        starterCode: {
          language: 'python',
          title: 'allowlist_regiones.py',
          code: `# CASO-LIM-003 · check_region allowlist
ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}

def check_region(r):
    # DEFECT: None → reject
    if r not in ALLOWED:
        return "reject"
    return "accept"

for r in ["Lima", "Tacna", None]:
    print(r, "→", check_region(r))
print('ok', True)
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
        instruction:
          'E2 (independiente) — `monto_ingreso(m)`: None → review; <0 → reject; >50000 → review (outlier); else accept (incluye 0). Casos: None, -1, 0, 1200, 60000.',
        hint: 'Orden: ausencia, hard reject, outlier review, accept.',
        hints: [
          'Orden: ausencia, hard reject, outlier review, accept.',
          '0 es accept; 60000 es review, no reject.',
        ],
        edgeCases: ['0 válido; negativo reject'],
        tests: 'table: review, reject, accept, accept, review',
        feedback: 'Tri-estado con outlier suave es realismo de data quality sin matar el pipeline.',
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
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Combina allowlist de tipo_doc `{"DNI","CE","PAS"}` con longitudes DNI=8, CE=9, PAS=9. Devuelve dict status/code: MISSING, NOT_IN_ALLOWLIST, OUT_OF_RANGE, OK. Casos: DNI+8 dígitos, DNI corto, RUC, None.',
        hint: 'Primero None, luego not in allowlist, luego len != esperado.',
        hints: [
          'Primero None, luego not in allowlist, luego len != esperado.',
          'DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}; usa len(str(numero)).',
        ],
        edgeCases: ['tipo ok longitud mal'],
        tests: 'codes MISSING/OUT_OF_RANGE/NOT_IN_ALLOWLIST/OK',
        feedback: 'and de restricciones con códigos distintos = operabilidad en dashboards de calidad.',
        starterCode: {
          language: 'python',
          title: 'tipo_doc_longitud.py',
          code: `# CASO-LIM-003 · tipo_doc_len
ALLOWED_DOC = {"DNI", "CE", "PAS"}
DOC_LEN = {"DNI": 8, "CE": 9, "PAS": 9}

def tipo_doc_len(tipo, numero):
    # DEFECT: no valida longitud
    if tipo not in ALLOWED_DOC:
        return "reject"
    return "accept"

for t, n in [("DNI", "12345678"), ("DNI", "123"), (None, "1")]:
    print(t, n, "→", tipo_doc_len(t, n))
print('ok', True)
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
        instruction:
          'E1 (guiado) — Completa la decision table como dict `codigo → status` para OK→accept, MISSING→review, OUT_OF_RANGE→reject, _default→review. Imprime el status de cada clave en la lista de prueba.',
        hint: 'table.get(code, table["_default"]) o case _ equivalente con dict.',
        hints: [
          'table.get(code, "review") si no incluyes _default como clave de negocio.',
          'Fila default cubre códigos desconocidos (FOO).',
        ],
        edgeCases: ['fila default'],
        tests: 'table complete: 4 filas de negocio + default',
        feedback: 'Primero tabla, después código: reduce ramas inventadas.',
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

for c in ["OK", "MISSING", "OUT_OF_RANGE", "X"]:
    print(c, apply(c))
print('ok', True)
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
        instruction:
          'E2 (independiente) — Implementa la misma tabla con `match/case`, OR patterns para MISSING|NEEDS_REVIEW y OUT_OF_RANGE|NOT_IN_ALLOWLIST|BAD_TYPE, y `case _`.',
        hint: 'case "A" | "B": en una sola rama. case _: al final.',
        hints: [
          'case "A" | "B": en una sola rama. case _: al final.',
          'Requiere Python 3.10+. Si no, usa if/elif equivalente y anótalo.',
        ],
        edgeCases: ['wildcard _'],
        tests: 'assert statuses en OK, MISSING, OUT_OF_RANGE, FOO, NEEDS_REVIEW',
        feedback: 'match legible para estados finitos es maintainability de motor de reglas.',
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

for c in ["OK", "MISSING", "OUT_OF_RANGE"]:
    print(c, status_match(c))
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Para (a) códigos de error finitos y (b) rango de edad 18–65, elige if o match, implementa ambos validadores y justifica en prints por qué match no es ideal para el rango numérico.',
        hint: 'match brilla en literales; rangos numéricos son más claros con if y comparaciones.',
        hints: [
          'match brilla en literales; rangos numéricos son más claros con if y comparaciones.',
          'Puedes match en status codes y if en edad en el mismo módulo.',
        ],
        edgeCases: ['rango numérico no ideal en match'],
        tests: 'rubric short answer + code ejecutable',
        feedback: 'Diseño de claridad > moda de sintaxis.',
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
print('ok', True)
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
        instruction:
          'E1 (guiado) — Completa `examples` para el campo `edad` con expected accept/reject/review/missing (usa value None para missing/review según tu invariante). Ejecuta validate y marca ok.',
        hint: 'Cuatro dicts {value, expected}. None → review; -1 reject; 30 accept; "x" reject.',
        hints: [
          'Cuatro dicts {value, expected}. None → review; -1 reject; 30 accept; "x" reject.',
          'missing key en el record se modela aquí como value None.',
        ],
        edgeCases: ['missing key'],
        tests: '4 examples present; todos ok=True',
        feedback: 'Ejemplos canónicos son la mitad de un invariante usable.',
        starterCode: {
          language: 'python',
          title: 'ejemplos_edad.py',
          code: `# CASO-LIM-003 · pipeline edad
def validate_edad(e):
    # DEFECT: no type check
    if e is None:
        return "review"
    if e < 0 or e > 120:
        return "reject"
    return "accept"

for e in [None, "25", -1, 30]:
    print(e, validate_edad(e))
print('ok', True)
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
        instruction:
          'E2 (independiente) — Escribe invariante multi-campo: `apellido_paterno` y `apellido_materno` no vacíos (tras strip) para accept; si uno falta → review; si ambos vacíos → reject. Incluye texto + 3 examples.',
        hint: 'strip y trata "" como vacío. None en uno → review.',
        hints: [
          'strip y trata "" como vacío. None en uno → review.',
          'invariant_text en español; examples con expected.',
        ],
        edgeCases: ['uno vacío'],
        tests: 'text + examples ejecutables',
        feedback: 'Invariantes multi-campo anticipan el validate_record del You Do.',
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
print('ok', True)
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
        instruction:
          'E3 (transferencia) — El invariante dice “edad siempre entre 18 y 65 inclusive (reject si no)”. Encuentra el contraejemplo que rompe la política real del negocio (menores en review, no reject) y ajusta la función + el texto del invariante.',
        hint: 'edad 15 no debería ser reject duro si la política es review para menores.',
        hints: [
          'edad 15 no debería ser reject duro si la política es review para menores.',
          'None sigue siendo review; >120 o <0 sí reject.',
        ],
        edgeCases: ['regla demasiado estricta'],
        tests: 'identify broken claim; 15 → review tras fix',
        feedback: 'Contraejemplos mejoran requisitos mejor que más ifs a ciegas.',
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
print('ok', True)
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
        instruction:
          'E1 (guiado) — Reescribe 3 mensajes vagos a plantilla campo+problema+acción: (1) "Error", (2) "inválido", (3) "bad age". Usa el campo `edad` y valores de ejemplo.',
        hint: 'Incluye nombre del campo y qué hacer. No agregues PII real.',
        hints: [
          'Incluye nombre del campo y qué hacer. No agregues PII real.',
          'Ejemplo: Campo edad=-3 fuera de rango; usa 0–120.',
        ],
        edgeCases: ['no incluir PII extra'],
        tests: 'rubric keywords: campo, edad, acción en cada mensaje',
        feedback: 'Mensajes accionables bajan tickets de soporte.',
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
print('ok', True)
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
        instruction:
          'E2 (independiente) — Dado `classify_score` (accept/review/reject), escribe una lista `cases` con un input por cada rama (incl. frontera) y un loop assert/print PASS.',
        hint: 'Al menos 3 casos: p.ej. 90, 55, 10. Opcional 80 y 50.',
        hints: [
          'Al menos 3 casos: p.ej. 90, 55, 10. Opcional 80 y 50.',
          'for val, expected in cases: assert classify_score(val) == expected',
        ],
        edgeCases: ['else path'],
        tests: 'N cases for N branches (mín. 3)',
        feedback: 'Cobertura de ramas es el mínimo de calidad del motor de reglas.',
        starterCode: {
          language: 'python',
          title: 'tests_por_rama.py',
          code: `# CASO-LIM-003 · classify + mensaje
def classify_score(score: int) -> str:
    if score >= 80:
        return "accept"
    elif score >= 50:
        return "review"
    else:
        return "reject"

# DEFECT: mensaje genérico
for s in [90, 60, 10]:
    print(s, classify_score(s), "Error")
print('ok', True)
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
        instruction:
          'E3 (transferencia) — Test rojo: la regla usa `edad > 18` y falla para 18 (espera accept). Arregla a `>= 18` y deja la suite en verde (18 accept, 17 review, None review).',
        hint: 'Off-by-one clásico en frontera inferior inclusiva.',
        hints: [
          'Off-by-one clásico en frontera inferior inclusiva.',
          'Cambia > por >= en el camino accept; mantén guards de None.',
        ],
        edgeCases: ['off-by-one en rango'],
        tests: 'all green after fix',
        feedback: 'Test rojo → fix → verde es el flujo profesional de depurar reglas.',
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
      'Reemplaza el legado “Sales Log Parser” como entrega de S03. Construyes el **motor de reglas** sobre el parser de intake de S02: para un registro sintético de cliente, validas ≥3 campos y devuelves **accept | reject | review** con **code** y **message** accionable. Distingues ausencia (`None`/missing) de valores falsy válidos (`0`). Solo datos ficticios.',
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
      'Sin PII real; dataset sintético embebido o en data/',
      "if __name__ == '__main__' demo reproducible",
      'No usar assert como única validación de negocio (asserts OK en tests)',
      'Preferir guards a pirámides de if anidados',
    ],
    starterCode: `"""rules_engine_intake.py — incremento CP-N1-A (S03)
Datos sintéticos únicamente. No uses información real de clientes.
"""

from __future__ import annotations

from typing import Any


def validate_edad(valor: Any) -> dict:
    """None → MISSING/review; tipo mal → BAD_TYPE; rango; menores → NEEDS_REVIEW."""
    # Contrato: corrige el DEFECT del starter
    raise NotImplementedError


def validate_region(valor: Any) -> dict:
    """Allowlist sintética de regiones del Perú."""
    # Contrato: corrige el DEFECT del starter
    raise NotImplementedError


def validate_monto(valor: Any) -> dict:
    """0 válido; None → review; negativo → reject; outlier opcional → review."""
    # Contrato: corrige el DEFECT del starter
    raise NotImplementedError


def validate_record(record: dict) -> dict:
    """Devuelve {campo: {status, code, message}} para edad, region, monto_ingreso."""
    # Contrato: corrige el DEFECT del starter
    raise NotImplementedError


def _run_tests() -> None:
    # Caso feliz
    r = validate_record({"edad": 30, "region": "Lima", "monto_ingreso": 0})
    assert r["monto_ingreso"]["status"] == "accept"  # cero válido
    # Ausencia ≠ cero
    r2 = validate_record({"edad": None, "region": "Lima", "monto_ingreso": None})
    assert r2["edad"]["code"] == "MISSING"
    # Más casos por rama...
    print("tests OK")


def main() -> None:
    demo = {
        "edad": 17,
        "region": "Tacna",
        "monto_ingreso": -5,
    }
    print(validate_record(demo))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      'En el README documenta invariantes en español, la decision table de cada campo y por qué no usas `if monto:` para presencia. Incluye la matriz de pruebas. Eso es lo que un lead de datos revisa antes del merge del gate CP-N1-A.',
    rubric: [
      { criterion: 'Tri-estado correcto en todos los campos definidos', weight: '25%' },
      { criterion: 'Ausencia no se confunde con falsy válido', weight: '25%' },
      { criterion: 'Mensajes accionables con campo y expectativa', weight: '20%' },
      { criterion: 'Pruebas/ejemplos por rama', weight: '15%' },
      { criterion: 'Código legible (guards, constantes, sin pirámide)', weight: '10%' },
      { criterion: 'Documentación de invariantes en español', weight: '5%' },
    ],
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
        question: 'En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?',
        options: ['Se ejecuta esa rama y se omiten las siguientes', 'Se evalúan todas las ramas y se combinan resultados', 'Se ejecuta también el else siempre', 'Python elige la rama más específica automáticamente'],
        correctIndex: 0,
        explanation:
          'La primera condición verdadera gana; elif/else posteriores no se ejecutan. Por eso el orden y las fronteras importan.',
      },
      {
        question: '¿Qué devuelve la expresión `"" or "default"` en Python?',
        options: ['True', '"default"', 'False', '""'],
        correctIndex: 1,
        explanation:
          '`or` hace short-circuit y devuelve el primer operando truthy (o el último si todos son falsy). `""` es falsy, así que resulta `"default"`.',
      },
      {
        question: 'Una allowlist de tipos de documento se implementa mejor como…',
        options: ['Una lista de if anidados por cada letra del código', 'Un float entre 0 y 1', 'assert tipo == "DNI" como única validación de producción', 'Un set de literales y el operador in'],
        correctIndex: 3,
        explanation:
          'Un set + `in` es legible y eficiente. assert no debe ser la única validación de negocio (se desactiva con -O).',
      },
      {
        question: '¿Cuándo aporta más claridad `match/case` que `if` en un motor de reglas introductorio?',
        options: ['Siempre; match deprecó if en Python 3.12', 'Solo para rangos numéricos de montos', 'Cuando el sujeto es un literal/estado finito (códigos) y hay case _', 'Nunca; match está deprecado'],
        correctIndex: 2,
        explanation:
          'match es estable desde 3.10 y útil para estados finitos. Los rangos numéricos suelen ser más claros con if y comparaciones.',
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
