import type { CourseSection } from '../../types'

export const section27: CourseSection = {
  id: "async-concurrency",
  index: 27,
  title: "Estrategia de pruebas con pytest",
  shortTitle: "Pytest y contratos",
  tagline:
    "Convertir supuestos de normalización y matching en contratos ejecutables con pytest; cada bug reproducido deja un test de regresión",
  estimatedHours: 19,
  level: "Senior",
  phase: 2,
  icon: "FlaskConical",
  accentColor: "bg-gradient-to-br from-violet-500 to-purple-700",
  jobRelevance:
    "En equipos de data engineering y compliance en Perú (bancos, fintech, retail con padrones de clientes), un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest — no scripts que “pasaron una vez en mi laptop”. En esta sección inicias **CP-N3-A**. Priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos y aíslas datos con fixtures. Cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato. Matching solo responde “¿misma entidad sintética?”; **nunca** etiqueta fraude ni parentesco.",
  learningOutcomes: [
    { text: "Priorizar suites con score de riesgo (impacto × probabilidad) y la pirámide unit → integration → E2E" },
    { text: "Escribir tests AAA con oráculos deterministas para normalize_name y exact_match" },
    { text: "Nombrar y descubrir casos con test_* / node ids y assertions con mensaje útil (pytest o assert equivalente)" },
    { text: "Aislar estado mutable con fixtures function-scope, factories y deepcopy" },
    { text: "Cubrir excepciones con match de mensaje, floats con isclose, fechas con reloj inyectado y archivos tmp" },
    { text: "Diseñar tablas de casos negativos con mensajes que nombran campo y valor ofensivo sintético" },
    { text: "Reportar cobertura por rama de negocio (umbrales auto/review/non) priorizando riesgo, no vanity %" },
    { text: "Aplicar mutación conceptual (matar mutantes) y el ciclo bug_repro → regression_test" },
  ],
  theory: [
    {
      heading: "Estrategia pytest e inicio CP-N3-A",
      paragraphs: [
        "En S26 orquestaste el VP con evidencia por estado (RPA + analista HITL). Ese pipeline **asume** que `normalize_name` y el matching se comportan igual mañana que hoy. Si alguien “arregla” un `strip` o un umbral sin red de seguridad, el clerical queue hereda basura con confianza falsa. Aquí **inicias CP-N3-A**: conviertes esos supuestos en **contratos de prueba** con pytest, para que un refactor o un typo no rompa en silencio lo que ya automatizaste.",
        "Trabajamos un módulo sintético sobre contactos del **Caso 27** (run_id=`cpn3a-01`, correos `@example.pe`): sin PII real y **sin** auto-veredicto de fraude o parentesco. Cada bug reproducido debe dejar un test de regresión con oráculo fijo. Matching solo responde: ¿son la misma entidad sintética tras normalizar? El resto del curso (S28+) ampliará dobles e integración; hoy sellas la base unitaria.",
        "Orden de aprendizaje: **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual). Dual-track honesto: en tu máquina `python -m pytest -q`; en este entorno del curso ejecutamos el **mismo contrato** como módulo con `assert` + `print` cuando no invocas el CLI. No hay teatro de “pytest sin pytest”: verás formas `test_*` reales aunque el runner del curso no sea el CLI.",
      ],
      callout: {
        type: "info",
        title: "Datos seguros (vale para toda la sección)",
        content:
          "Fixtures y ejercicios usan solo contactos sintéticos `@example.pe`. Una prueba de similitud **no** etiqueta fraude ni parentesco. Esa ética queda fijada aquí: no la repitas en cada párrafo; sí aplícala en cada assert y mensaje de error.",
      },
    },
    {
      heading: "Riesgos y pirámide de pruebas",
      subtopicId: "S27-T1-A",
      paragraphs: [
        "La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena el tiempo (no la forma de la pirámide). Un bug en matching de entidades justifica más tests que un typo de log o un cambio de color en la UI de revisión. Si solo mides “número de tests”, puedes hinchar la base con asserts triviales y dejar sin contrato la rama que mueve el clerical queue.",
        "Clasifica riesgo por **impacto** y **probabilidad**. Impacto: datos incorrectos, regresión silenciosa en el clerical queue, merge de entidades sintéticas mal hecho. Probabilidad: código tocado a menudo, reglas frágiles, historial de bugs. En entity resolution, normalización y comparadores son capa de alto riesgo. Si fallan, el resto del pipeline hereda basura con confianza falsa y nadie nota el drift hasta que un humano revisa a ciegas.",
        "No inviertas la pirámide: una batería de E2E lentas no sustituye contratos unitarios de `strip`/`casefold`. Heurística práctica: **score = impacto × probabilidad**; ordena áreas y reparte más casos a las de mayor score. Ejemplo sintético de este caso: `normalize_name` (5×4=20) > `exact_match` (5×3=15) > repo SQL > cola UI. Regla de bolsillo para el equipo: score ≥ 15 → ≥ 5 tests de contrato; 8–14 → 2–3; < 8 → smoke + un negativo. El score no es ciencia exacta: es una cola de prioridad honestable en la retro del sprint.",
      ],
      code: {
        language: 'python',
        title: "risk_pyramid.py",
        code: `def risk_score(impact, likelihood):
    return impact * likelihood

# priorización de suites por riesgo (CP-N3-A)
risks = [
    {"area": "normalize_name", "impact": 5, "likelihood": 4, "layer": "unit"},
    {"area": "exact_match", "impact": 5, "likelihood": 3, "layer": "unit"},
    {"area": "sqlite_repo", "impact": 4, "likelihood": 2, "layer": "integration"},
    {"area": "ui_review_queue", "impact": 3, "likelihood": 2, "layer": "e2e"},
]
for r in risks:
    r["score"] = risk_score(r["impact"], r["likelihood"])
ranked = sorted(risks, key=lambda x: (-x["score"], x["area"]))
print([r["area"] for r in ranked])
print("top_layer", ranked[0]["layer"])
print("ok", True)
`,
        output: `['normalize_name', 'exact_match', 'sqlite_repo', 'ui_review_queue']
top_layer unit
ok True`,
      },
      callout: {
        type: "tip",
        title: "Riesgo primero",
        content:
          "Si el tiempo es finito, cubre primero normalize/match; luego DB; al final UI. Escribe el ranking en el README del paquete de tests: el equipo debe poder discutir la cola de prioridad, no adivinarla.",
      },
    },
    {
      heading: "Arrange–Act–Assert y oráculos confiables",
      subtopicId: "S27-T1-B",
      paragraphs: [
        "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada, la función bajo prueba o el comparador. Pierdes tiempo en CI y en code review. Un test AAA legible se lee en 10 segundos: “dado este raw sintético, al normalizar, espero este oráculo”.",
        "Un **oráculo** es la fuente de verdad del assert. Tres tipos sirven en entity resolution: (1) valor fijo conocido (`\"juan pérez\"`); (2) propiedad invariante (longitud ≥ 0 tras normalizar; idempotencia de `normalize_name`); (3) resultado de un algoritmo de referencia simple que confías más que el código bajo prueba. En matching, el oráculo **no** es un veredicto de fraude ni de parentesco: solo responde si dos cadenas normalizadas son la misma entidad sintética bajo el contrato de igualdad.",
        "Oráculos frágiles generan *flakes* (tests que fallan al azar): reloj real (`datetime.now()`), orden de un `set`, JSON sin `sort_keys`, red o disco no mockeados. Usa contactos sintéticos deterministas (`ana@example.pe`) y fechas literales (`date(2026, 7, 20)`). Si el assert depende del azar, del entorno o del orden de inserción, no es contrato: es suerte empaquetada.",
      ],
      code: {
        language: 'python',
        title: "aaa_oracle.py",
        code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw = "  JUAN   Pérez "
expected = "juan pérez"  # oráculo fijo
# Act
got = normalize_name(raw)
# Assert
assert got == expected, f"oráculo falló: {got!r} != {expected!r}"
print("aaa_ok", got)
print("phases", "arrange-act-assert")`,
        output: `aaa_ok juan pérez
phases arrange-act-assert`,
      },
      callout: {
        type: "warning",
        title: "Oráculo ≠ impresión",
        content:
          "`print` no es assert. El contrato debe fallar ruidosamente si se rompe; un print amable en verde no protege el merge ni el merge request del colega.",
      },
    },
    {
      heading: "Discovery y assertions de pytest",
      subtopicId: "S27-T2-A",
      paragraphs: [
        "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten **volver a correr** solo el fallido con `pytest path::test_name -q`. Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a. m.: solo ves “falló algo de normalize”.",
        "Las **assertions** reescritas de pytest muestran diff útil: `assert a == b` explica ambos lados sin escribir mensajes a mano. Para excepciones esperadas usa `pytest.raises(Tipo, match=\"fragmento\")`. En pytest real, `match=` es una **expresión regular** evaluada con `re.search` (usa `re.escape` si el texto tiene metacaracteres). En este lab, si aún no instalas pytest, modelamos el criterio con try/except + contención de un fragmento sin metacaracteres: aprendes tipo + mensaje; en tu máquina corre el runner real.",
        "Parametriza con `@pytest.mark.parametrize` (o una tabla de tuplas en un bucle) para casos de normalización sin copiar el cuerpo del test. Una tabla `(entrada, esperado)` es el corazón de los contratos de `normalize_name` y `exact_match`: cada fila es un node id conceptual; si falla la fila 7, sabes exactamente qué raw sintético rompió el oráculo.",
      ],
      code: {
        language: 'python',
        title: "test_normalize.py",
        code: `# Forma real que pytest descubre (test_*.py + def test_*).
# En tu máquina: python -m pytest test_normalize.py -q
# Aquí ejecutamos el mismo contrato sin CLI (assert + print).
#
# En pytest real también podrías escribir:
#   import pytest
#   @pytest.mark.parametrize("raw,expected", [("  Ana  ", "ana"), ("X  Y", "x y")])
#   def test_normalize_param(raw, expected):
#       assert normalize_name(raw) == expected

def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def test_normalize_spaces():
    assert normalize_name("  Ana  López ") == "ana lópez"

def test_exact_match():
    assert normalize_name("ANA") == normalize_name(" ana ")

# Tabla estilo parametrize (cada fila = un node id conceptual)
cases = [("  Ana  ", "ana"), ("X  Y", "x y")]
param_ok = all(normalize_name(raw) == exp for raw, exp in cases)

test_normalize_spaces()
test_exact_match()
print("node_ids", ["test_normalize_spaces", "test_exact_match"])
print("param_rows", len(cases), "param_ok", param_ok)
print("assert_ok", True)
`,
        output: `node_ids ['test_normalize_spaces', 'test_exact_match']
param_rows 2 param_ok True
assert_ok True`,
      },
      callout: {
        type: "tip",
        title: "Nombres test_*",
        content:
          "Si el nombre no empieza por `test_`, pytest no lo corre (salvo configuración explícita). `helper_normalize` es código de apoyo, no un caso de la suite ni un node id en el reporte de CI.",
      },
    },
    {
      heading: "Fixtures, scopes y aislamiento",
      subtopicId: "S27-T2-B",
      paragraphs: [
        "Las **fixtures** inyectan dependencias (datos sintéticos, `tmp_path`, relojes fijos) **sin globals** ni setup copiado en cada test. En pytest real escribes `@pytest.fixture` y el nombre del parámetro de la función de test recibe el valor. El **scope por defecto es function**: cada test recibe setup fresco; eso es lo que hace que la suite sea orden-independiente.",
        "Scopes: `function` (default), `class`, `module`, `session`. Un fixture session mutado contamina toda la suite y produce *flakes* de orden (“pasa solo si corre después de X”). Session-scope solo para recursos caros de **solo lectura** (catálogo estático, configuración inmutable, conexión de lectura a un dataset de fixtures). Si necesitas mutar, vuelve a function o usa una factory.",
        "Las **factory fixtures** devuelven callables para crear N entidades sintéticas por caso (`make_contact(i)`). Mecanismo clave de aislamiento: **copia profunda** de estructuras mutables; un `list.copy()` superficial comparte dicts internos y un test ensucia al siguiente. Si ves un fallo que solo aparece con `-x` o al reordenar, sospecha fixture mutable con scope ancho.",
      ],
      code: {
        language: 'python',
        title: "fixtures_scope.py",
        code: `# En pytest real (tu máquina):
#   import pytest
#   @pytest.fixture  # scope="function" por defecto
#   def contacts():
#       return deepcopy(_base_contacts)
#   def test_isolated(contacts):
#       contacts[0]["name"] = "MUTADO"
#       assert contacts[0]["name"] == "MUTADO"
# Aquí modelamos el mismo aislamiento sin instalar pytest.
from copy import deepcopy

_base_contacts = [
    {"id": "c1", "name": "Ana López", "email": "ana@example.pe"},
    {"id": "c2", "name": "ANA  lopez", "email": "ana@example.pe"},
]

def fixture_contacts(scope="function"):
    if scope == "function":
        return deepcopy(_base_contacts)
    return _base_contacts  # session-like: peligrosa si mutas

t1 = fixture_contacts("function")
t1[0]["name"] = "MUTADO"
t2 = fixture_contacts("function")
print("isolated", t2[0]["name"] == "Ana López")
print("n", len(t2))
print("scope_default", "function")`,
        output: `isolated True
n 2
scope_default function`,
      },
      callout: {
        type: "danger",
        title: "Mutar fixture session",
        content:
          "Si mutas un fixture session-scope, el siguiente test ve basura. Prefiere function + factory. En pytest: scope=\"function\" (default) o factory fixture.",
      },
    },
    {
      heading: "Excepciones, floats, fechas y archivos temporales",
      subtopicId: "S27-T3-A",
      paragraphs: [
        "Prueba **excepciones** con el tipo y, si aplica, el **mensaje**. En pytest real: `pytest.raises(ValueError, match=\"vacío\")` — y recuerda que `match=` es regex (`re.search`), no solo `in`. Aquí, sin CLI: try/except + `\"vacío\" in str(e)` para el mismo criterio sobre un fragmento literal. Un `raises` que solo mira el tipo acepta un mensaje basura; el mensaje forma parte del contrato. Para **floats** y scores de matching usa tolerancia (`math.isclose`) o decimal cuantizado: `==` exacto en `0.1 + 0.2` es trampa pedagógica y de producción en umbrales de matching.",
        "**Fechas**: no compares `datetime.now()` con literales frágiles. **Inyecta el reloj**: la función recibe `today: date` (o un callable de reloj) y el test pasa un literal fijo (`date(2026, 7, 20)`). Así el contrato no cambia de un día al otro ni entre zonas horarias de Lima y un runner en UTC. Librerías como freezegun son opcionales; la inyección de parámetro basta, es más explícita y no añade dependencia al CI del motor ER.",
        "**tmp_path** (pytest) / `tempfile` (stdlib) evita escribir en el repo o en el home del desarrollador. Dos APIs: (1) `TemporaryDirectory()` borra al salir del `with`; (2) `NamedTemporaryFile(..., delete=False)` deja un path reabrable para reabrir y assert. Usa siempre `encoding='utf-8'` en texto y documenta si el contrato incluye el salto de línea final.",
      ],
      code: {
        language: 'python',
        title: "borders_tmp.py",
        code: `import math
from datetime import date
from pathlib import Path
import tempfile

# En pytest real: with pytest.raises(ValueError, match="vacío"): parse_score("  ")
# (match= es regex vía re.search). Aquí: assert_raises con contención de fragmento.

def parse_score(s: str) -> float:
    if s.strip() == "":
        raise ValueError("score vacío")
    return float(s)

def assert_raises(exc_type, fn, match=None):
    try:
        fn()
    except exc_type as e:
        if match is not None and match not in str(e):
            raise AssertionError(f"mensaje sin {match!r}: {e!r}") from e
        return True
    raise AssertionError(f"se esperaba {exc_type.__name__}")

def is_stale(created: date, today: date, days: int = 30) -> bool:
    # clock injection: el test pasa today; no llama date.today() por dentro
    return (today - created).days > days

print("raises_ok", assert_raises(ValueError, lambda: parse_score("  "), match="vacío"))
print("close", math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9, abs_tol=1e-12))

fixed_today = date(2026, 7, 20)
print("iso", fixed_today.isoformat())
print("stale", is_stale(date(2026, 1, 1), fixed_today, 30))

with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "norm.txt"
    p.write_text("juan", encoding="utf-8")
    print("tmp_bytes", p.read_text(encoding="utf-8").strip())

with tempfile.NamedTemporaryFile("w+", delete=False, encoding="utf-8") as f:
    f.write("ok")
    path = f.name
print("named", Path(path).read_text(encoding="utf-8").strip())`,
        output: `raises_ok True
close True
iso 2026-07-20
stale True
tmp_bytes juan
named ok`,
      },
      callout: {
        type: "tip",
        title: "isclose > ==",
        content:
          "Nunca compares floats de probabilidad con igualdad bit a bit en tests de matching. Define abs_tol/rel_tol y documéntalos en el contrato.",
      },
    },
    {
      heading: "Casos negativos y mensajes útiles",
      subtopicId: "S27-T3-B",
      paragraphs: [
        "Los **casos negativos** prueban inputs inválidos: `None`, vacío, tipo incorrecto, encoding roto, score fuera de rango. Deben fallar de forma **controlada** (excepción tipada con mensaje), no con un `AttributeError` críptico en la línea 87 de una librería interna ajena a tu contrato. Si el motor traga basura en silencio, el matching “funciona” con datos que no debían entrar.",
        "Mensajes de error **útiles** nombran el campo y el valor ofensivo (sintético, sin PII real ni tokens). Eso acelera el fix en CI: `email: se esperaba str, recibió None` gana a un genérico `invalid input` que no dice dónde mirar. En un equipo que opera el clerical queue, el mensaje es documentación viva del contrato de entrada.",
        "Diseña una tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un happy path y tres negativos por función pública del motor (`require_email`, `parse_score`, validadores de RUC sintético). Es la misma idea que `@pytest.mark.parametrize`, aplicada a bordes de validación en vez de a oráculos felices.",
      ],
      code: {
        language: 'python',
        title: "negative_messages.py",
        code: `def require_email(value):
    if value is None:
        raise TypeError("email: se esperaba str, recibió None")
    if not isinstance(value, str):
        raise TypeError(f"email: se esperaba str, recibió {type(value).__name__}")
    v = value.strip()
    if not v or "@" not in v:
        raise ValueError(f"email inválido: {value!r}")
    return v.casefold()

cases = [
    (None, TypeError, "None"),
    (123, TypeError, "int"),
    ("", ValueError, "inválido"),
    ("ok@example.pe", None, "ok@example.pe"),
]
results = []
for raw, exp_exc, frag in cases:
    try:
        out = require_email(raw)
        results.append(exp_exc is None and frag in out)
    except Exception as e:
        results.append(exp_exc is not None and isinstance(e, exp_exc) and frag in str(e))
print("neg_ok", all(results))
print("n_cases", len(cases))`,
        output: `neg_ok True
n_cases 4`,
      },
      callout: {
        type: "warning",
        title: "Sin secretos en mensajes",
        content:
          "No imprimas tokens ni PII real en asserts de CI. El valor ofensivo debe ser sintético o enmascarado.",
      },
    },
    {
      heading: "Cobertura por rama y por riesgo",
      subtopicId: "S27-T4-A",
      paragraphs: [
        "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100 % de **líneas** no implica 100 % de riesgo cubierto. Puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue. El reporte de coverage es un mapa; tú decides dónde poner la lupa.",
        "**Risk coverage**: prioriza ramas de negocio (auto-match / review / non-match, campos faltantes, empates de score en el borde del umbral) sobre decoración. En un clasificador de pares sintéticos, las tres bandas de umbral son el núcleo del contrato. No el color del badge en la UI ni el orden de las columnas del CSV de evidencia.",
        "Reporta cobertura como **evidencia** para el equipo, no como meta vacía del 100 %. Una rama de umbral sin caso es deuda: en producción el clerical queue verá estados que CI nunca ejercitó y confiará en basura. En la retro del sprint, pregunta “¿qué rama de negocio no tiene caso?” antes de “¿llegamos al 90 % de líneas?”.",
      ],
      code: {
        language: 'python',
        title: "branch_risk.py",
        code: `def classify_pair(score: float, thr_auto=0.9, thr_review=0.6) -> str:
    if score >= thr_auto:
        return "auto_match"
    if score >= thr_review:
        return "review"
    return "non_match"

branches = {"auto": 0, "review": 0, "non": 0}
for s in [0.95, 0.7, 0.2, 0.9]:
    c = classify_pair(s)
    if c == "auto_match":
        branches["auto"] += 1
    elif c == "review":
        branches["review"] += 1
    else:
        branches["non"] += 1
covered = sum(1 for v in branches.values() if v > 0)
print("branch_covered", covered, "of", 3)
print("branches", branches)
print("risk_focus", "thresholds")`,
        output: `branch_covered 3 of 3
branches {'auto': 2, 'review': 1, 'non': 1}
risk_focus thresholds`,
      },
      callout: {
        type: "info",
        title: "Cobertura con sentido",
        content:
          "Si una rama de 'review' nunca se prueba, la cola de revisión se romperá en producción sin que CI se entere.",
      },
    },
    {
      heading: "Mutación conceptual, fallas útiles y mantenimiento",
      subtopicId: "S27-T4-B",
      paragraphs: [
        "**Mutación conceptual**: cambia deliberadamente el código (quita un `strip`, invierte un umbral, elimina `casefold`) y verifica que **algún test falle**. Si la suite sigue verde, el test es teatro de cobertura, no un contrato. No necesitas un framework de mutación el primer día: un mutante a mano en un branch local ya expone oráculos débiles.",
        "Fallas **útiles** muestran input sintético, esperado vs. actual y el contrato violado. Evita `assert False` o un bare `assert got` sin contexto. Un dict `{\"input\": …, \"expected\": …, \"actual\": …}` (o el rewrite de pytest) acelera el fix en CI y en code review: el colega no tiene que adivinar qué raw entró.",
        "Mantenimiento: borra tests que solo copian la implementación; renombra con intención (`test_normalize_collapses_spaces`); parametriza tablas; no dupliques el mismo oráculo en tres sitios. Política del ciclo: **bug_repro → regression_test** antes de cerrar el ticket. En S28 ampliarás estos contratos con dobles (`unittest.mock`) y pruebas de integración entre módulos del motor ER.",
      ],
      code: {
        language: 'python',
        title: "mutation_useful.py",
        code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def normalize_name_mutated(s: str) -> str:
    # mutación: no colapsa espacios internos
    return s.casefold()

raw = "  Ana  López "
oracle = "ana lópez"
good = normalize_name(raw) == oracle
mut_detected = normalize_name_mutated(raw) != oracle
print("good_passes", good)
print("mutation_killed", mut_detected)
print("maintain", "one_oracle")`,
        output: `good_passes True
mutation_killed True
maintain one_oracle`,
      },
      callout: {
        type: "tip",
        title: "Elimina el mutante",
        content:
          "Si alteras un comparador (quita `casefold`, invierte umbral) y todos los tests siguen verdes, no tienes contrato: tienes teatro de cobertura. Añade el caso que mata al mutante y déjalo en la suite como regresión.",
      },
    },
  ],
  iDo: {
    intro:
      "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, descubrir tests estilo pytest, aislar fixtures y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A. Observa el contrato (entrada → assert → salida) y el *porqué* de cada demo antes de tocar los ejercicios guiados.",
    steps: [
      {
        demoId: "S27-T1-A-DEMO",
        subtopicId: "S27-T1-A",
        environment: "local-python",
        description: "Prioriza suites unit/integration por score de riesgo para el motor ER sintético.",
        preamble:
          "Antes de escribir un solo `assert` del motor ER sintético, el equipo decide *dónde* gastar minutos de prueba. En esta demo se calcula score = impacto × probabilidad y se ordenan tres áreas: normalización, blocking y repo SQL. No escribas aún: predice el orden impreso y la capa del tope (`unit` vs `integration`). Si inviertes la pirámide con solo E2E de la cola de revisión, el `strip` roto llegará al clerical queue con confianza falsa — la UI ni siquiera aparece aquí porque su score pierde.",
        code: {
          language: 'python',
          title: "risk_rank_demo.py",
          code: `def risk_score(impact, likelihood):
    return impact * likelihood

areas = [
    ("normalize", 5, 5, "unit"),
    ("blocking", 4, 4, "unit"),
    ("repo_sql", 4, 2, "integration"),
]
ranked = sorted(areas, key=lambda r: -risk_score(r[1], r[2]))
print([n for n, *_ in ranked])
print("top_layer", ranked[0][3])
print("ok", True)
`,
          output: `['normalize', 'blocking', 'repo_sql']
top_layer unit
ok True`,
        },
        why:
          "El score no sustituye unit/integration/e2e: solo reordena el tiempo finito del sprint. Normalización y blocking tocan cada par sintético; un bug ahí multiplica basura en matching. La pirámide se mantiene ancha en unit; el ranking pone normalize antes que la UI de revisión. En We Do practicarás producto, orden descendente y la capa del área de mayor score.",
        retrospective:
          "Si puedes explicar por qué normalize gana a la UI en la cola de prioridad *sin mirar el código*, ya tienes el hábito de riesgo primero. El error clásico es medir “número de tests” y dejar sin contrato la rama que mueve el merge. En We Do practicarás score, ranking y elegir la capa unit.",
      },
      {
        demoId: "S27-T1-B-DEMO",
        subtopicId: "S27-T1-B",
        environment: "local-python",
        description: "Test AAA con oráculo fijo para normalize_name sobre dato sintético peruano.",
        preamble:
          "Un test legible se lee en diez segundos: dado este raw sintético, al normalizar, espero este oráculo. En esta demo el Arrange fija `\"  María  Ríos \"` y el oráculo `\"maría ríos\"`; el Act llama `normalize_name`; el Assert compara. No escribas: sigue las fases y comprueba el print. Si confundes un `print` amable con un `assert`, el merge del colega no protege el matching.",
        code: {
          language: 'python',
          title: "aaa_demo.py",
          code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw, oracle = "  María  Ríos ", "maría ríos"
# Act
got = normalize_name(raw)
# Assert
assert got == oracle
print("got", got)
print("aaa", "pass")`,
          output: `got maría ríos
aaa pass`,
        },
        why:
          "Oráculo fijo = regresión confiable en CI. `casefold` + colapsar espacios es el contrato de igualdad de entidad sintética; el assert debe fallar ruidosamente si se rompe. Un print en verde no sella el contrato. En We Do colapsarás espacios de verdad, reportarás `pass` solo si el assert vive y compararás dos lados normalizados.",
        retrospective:
          "AAA con oráculo determinista es el esqueleto de todo contrato de `normalize_name`. El error clásico es “ya imprimió bien” sin assert que falle en CI. Pregunta sin mirar el código: ¿qué valor esperas si el raw trae dobles espacios? We Do: colapsar espacios de verdad, reportar `pass` solo si el assert vive, y comparar dos lados normalizados.",
      },
      {
        demoId: "S27-T2-A-DEMO",
        subtopicId: "S27-T2-A",
        environment: "local-python",
        description: "Suite mínima estilo pytest: dos test_* con asserts de normalización y matching.",
        preamble:
          "pytest descubre funciones `test_*` (y clases `Test*`) en archivos `test_*.py`. En esta demo hay dos contratos ejecutados a mano con la misma forma que el runner real: normalización y dominio sintético `@example.pe`. Observa los `node_ids` impresos: son los nombres con los que re-correrías solo el fallido. No escribas; predice qué pasa si renombras a `helper_exact` sin el prefijo.",
        code: {
          language: 'python',
          title: "discovery_demo.py",
          code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def test_exact_after_norm():
    assert normalize_name("A B") == "a b"

def test_email_domain():
    assert "x@example.pe".endswith("@example.pe")

# discovery conceptual + ejecución del contrato
node_ids = ["test_exact_after_norm", "test_email_domain"]
test_exact_after_norm()
test_email_domain()
print("node_ids", node_ids)
print("assert_exact", normalize_name("A B") == "a b")
print("n_tests", len(node_ids))`,
          output: `node_ids ['test_exact_after_norm', 'test_email_domain']
assert_exact True
n_tests 2`,
        },
        why:
          "Nombres estables = re-run puntual en CI a las 2 a. m. El lab ejecuta assert+print cuando no hay CLI, pero la forma `test_*` es la real; helpers no son casos ni node ids. En We Do filtrarás discovery, distinguirás ok/fail y aplicarás oráculos fila a fila estilo parametrize.",
        retrospective:
          "Naming `test_*` es el contrato de discovery: sin prefijo, el runner real no lo corre y a las 2 a. m. no hay node id que re-lanzar. El error clásico es meter lógica de prueba en helpers que “parecen” tests. Pregunta: ¿cuántos casos reales hay si renombras ambos a `check_*`? We Do: filtrar la lista, distinguir ok/fail y aplicar oráculos fila a fila.",
      },
      {
        demoId: "S27-T2-B-DEMO",
        subtopicId: "S27-T2-B",
        environment: "local-python",
        description: "Fixture factory con scope function: dos tests no se contaminan al mutar contactos.",
        preamble:
          "Si un test muta un fixture compartido, el siguiente puede fallar solo cuando el orden de la suite cambia. En esta demo un factory-like `contacts_fx` devuelve `deepcopy` de una lista de contactos sintéticos: el test A renombra a `\"X\"` y el B sigue viendo `\"Luis\"`. No escribas: predice `isolated` y por qué un `list.copy()` superficial no bastaría si el dict es anidado.",
        code: {
          language: 'python',
          title: "fixture_demo.py",
          code: `from copy import deepcopy
BASE = [{"id": "e1", "name": "Luis"}]

def contacts_fx():
    # equivalente a @pytest.fixture → deepcopy por test
    return deepcopy(BASE)

a = contacts_fx(); a[0]["name"] = "X"
b = contacts_fx()
print("isolated", b[0]["name"] == "Luis")
print("a_mut", a[0]["name"])
print("scope", "function")`,
          output: `isolated True
a_mut X
scope function`,
        },
        why:
          "function-scope es el default de pytest; session solo para recursos caros de solo lectura. `deepcopy` aísla dicts internos; un copy superficial comparte mutables y produce flakes de orden. En We Do demostrarás orig intacto, elegirás el scope seguro y medirás la factory `make(n)`.",
        retrospective:
          "Aislamiento function + copia profunda evita flakes de orden. El error clásico es mutar un fixture session o devolver la lista base sin copiar. Pregunta: ¿qué vería el test B si `contacts_fx` devolviera `BASE` sin `deepcopy`? We Do: demostrar orig intacto, elegir el scope seguro y medir la factory.",
      },
      {
        demoId: "S27-T3-A-DEMO",
        subtopicId: "S27-T3-A",
        environment: "local-python",
        description: "Excepción ValueError, isclose de score, reloj inyectado y escritura en directorio temporal.",
        preamble:
          "Los tests de matching se rompen en producción por bordes, no por el happy path. Esta demo empaqueta cuatro: excepción tipada con mensaje, `isclose` para scores IEEE, edad con reloj *inyectado* (no `date.today()`), y lectura en directorio temporal. No escribas: anota mentalmente qué fallaría si usaras `==` en floats o el reloj real del sistema en Lima vs UTC del runner.",
        code: {
          language: 'python',
          title: "borders_demo.py",
          code: `import math, tempfile
from pathlib import Path
from datetime import date

def score(x):
    if x is None:
        raise ValueError("score None")
    return float(x)

def age_days(created: date, today: date) -> int:
    return (today - created).days  # reloj inyectado

try:
    score(None)
except ValueError as e:
    print("exc", str(e))
print("close", math.isclose(0.30000000000000004, 0.3, abs_tol=1e-9))
print("day", date(2026, 1, 15).isoformat())
print("age", age_days(date(2026, 1, 1), date(2026, 1, 15)))
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "s.txt"
    p.write_text("0.85", encoding="utf-8")
    print("tmp", p.read_text(encoding="utf-8"))`,
          output: `exc score None
close True
day 2026-01-15
age 14
tmp 0.85`,
        },
        why:
          "Cada borde evita un flake distinto: el mensaje forma parte del contrato del raise; `abs_tol` se documenta en umbrales; el reloj inyectado no depende del huso del runner; tmp no escribe en el repo. En We Do practicarás isclose, match de mensaje y NamedTemporaryFile.",
        retrospective:
          "Bordes numéricos, temporales y de I/O son parte del contrato del motor, no “extras”. El error clásico es `==` en floats o `datetime.now()` en asserts. Pregunta: ¿qué falla si `today` es el reloj del runner en UTC y el dato nació en Lima? We Do: isclose, inspeccionar el mensaje del raise y leer el tmp.",
      },
      {
        demoId: "S27-T3-B-DEMO",
        subtopicId: "S27-T3-B",
        environment: "local-python",
        description: "Tabla de casos negativos para validador de RUC sintético (formato, no consulta SUNAT real).",
        preamble:
          "Si el motor traga un RUC basura en silencio, el matching “funciona” con datos que no debían entrar. Esta demo valida formato sintético (11 dígitos) con una tabla happy + tres negativos y exige el fragmento `\"inválido\"` en el mensaje. No escribas: predice por qué un `ValueError` con valor ofensivo en el mensaje gana a un genérico `invalid input` a las 2 a. m. en CI. No hay consulta SUNAT real.",
        code: {
          language: 'python',
          title: "negative_demo.py",
          code: `def check_ruc(s: str) -> str:
    if not s or not s.isdigit() or len(s) != 11:
        raise ValueError(f"ruc inválido: {s!r}")
    return s

ok = []
for val, bad in [("20123456789", False), ("123", True), ("", True), ("abcdefghijk", True)]:
    try:
        check_ruc(val)
        ok.append(not bad)
    except ValueError as e:
        ok.append(bad and "inválido" in str(e))
print("neg_table", all(ok))
print("n", len(ok))`,
          output: `neg_table True
n 4`,
        },
        why:
          "Mensajes con valor sintético aceleran el fix; sin PII real ni tokens. La tabla input→excepción→fragmento es el diseño del contrato de entrada. En We Do imprimirás el mensaje (no solo el tipo), validarás la arroba y armarás f-strings con campo y valor ofensivo.",
        retrospective:
          "Negativos controlados son parte del contrato público del validador. El error clásico es confiar en el happy path o filtrar PII real en el assert. We Do: mensaje vs tipo, gate de `@`, mensaje con campo nombrado.",
      },
      {
        demoId: "S27-T4-A-DEMO",
        subtopicId: "S27-T4-A",
        environment: "local-python",
        description: "Cubre las tres ramas de umbral auto/review/non_match y reporta cobertura de ramas.",
        preamble:
          "Puedes cubrir helpers de log y dejar sin caso la rama `review` que mueve el clerical queue. Esta demo ejercita las tres bandas del clasificador de pares sintéticos (0.95 auto, 0.75 review, 0.1 non) y reporta cobertura de ramas. No escribas: predice si un set con solo auto y review dejaría deuda de riesgo. Matching aquí no etiqueta fraude.",
        code: {
          language: 'python',
          title: "coverage_demo.py",
          code: `def decide(score):
    if score >= 0.9:
        return "auto"
    if score >= 0.6:
        return "review"
    return "non"

hits = {decide(s) for s in (0.95, 0.75, 0.1)}
print("covered", sorted(hits))
print("full", hits == {"auto", "review", "non"})
print("risk", "threshold_branches")`,
          output: `covered ['auto', 'non', 'review']
full True
risk threshold_branches`,
        },
        why:
          "Risk coverage prioriza umbrales de negocio (auto/review/non), no vanidad del 100 % de líneas. El reporte de ramas es evidencia accionable para el equipo. En We Do ejercerás ambas ramas hi/lo, detectarás la falta de `non` y reportarás el porcentaje 2/3 → 66.",
        retrospective:
          "Tres bandas de umbral son el núcleo del contrato de `classify_pair`: auto, review y non mueven colas distintas. El error clásico es vanidad de % de líneas mientras `review` o `non` no tienen caso. Pregunta: si `hits` solo tiene auto y review, ¿qué deuda reportas? We Do: ejercer ambas ramas, detectar falta de `non` y reportar porcentaje legible.",
      },
      {
        demoId: "S27-T4-B-DEMO",
        subtopicId: "S27-T4-B",
        environment: "local-python",
        description: "Mutación: quitar casefold; el test de regresión debe detectar al mutante.",
        preamble:
          "Cambia el código a propósito (quita `casefold`) y mira si *algún* test falla. Si la suite sigue verde, el assert es teatro de cobertura. En esta demo `good` pasa el oráculo `\"ana\"` y `mutant` (solo strip) no: `kills_mutant True`. No escribas: predice qué pasaría si el oráculo fuera solo un print del string crudo.",
        code: {
          language: 'python',
          title: "mutation_demo.py",
          code: `def good(s):
    return s.casefold().strip()
def mutant(s):
    return s.strip()  # mutación: sin casefold
oracle = "ana"
raw = "ANA"
print("test_good", good(raw) == oracle)
print("kills_mutant", mutant(raw) != oracle)
print("policy", "regression_on_bug")`,
          output: `test_good True
kills_mutant True
policy regression_on_bug`,
        },
        why:
          "Mutación conceptual no requiere framework el día 1: si el mutante vive, el oráculo no protege. Añade regresión con el caso que lo mate. En We Do distinguirás good/mutant, armarás fallas útiles (input/expected/actual) y cerrarás el ciclo bug_repro → regression_test.",
        retrospective:
          "Matar mutantes demuestra que el oráculo protege el contrato: si la suite sigue verde tras quitar `casefold`, no hay red. El error clásico es cobertura de líneas con asserts débiles. Pregunta: si el oráculo fuera un print del raw, ¿`kills_mutant` seguiría siendo True? We Do: distinguir good/mutant, fallas útiles y fijar la regresión normalizada.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios en tres capas por subtema: **E1 guiado** (micro-bug), **E2 independiente**, **E3 transferencia**. Cubren: pirámide de riesgo; AAA y oráculos; discovery y parametrize; fixtures y scopes; bordes (isclose, raises+match, tempfile); negativos; cobertura de ramas; mutación conceptual. Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (patrón de caza de fallas del curso). Imprime **solo** las líneas del oráculo de la solución — sin prints extra de depuración. Datos sintéticos `@example.pe` (Caso 27); matching no etiqueta fraude ni parentesco.",
    steps: [
      {
        id: "S27-T1-A-E1",
        subtopicId: "S27-T1-A",
        kind: "guided",
        title: "Score de riesgo: producto, no suma",
        preamble:
          "- **Contexto:** en CP-N3-A priorizas suites del motor ER sintético con un score simple que el equipo pueda discutir en la retro.\n- **Meta:** calcular `impact * likelihood` (no sumar).\n- **Éxito:** una sola línea con el entero `20` (impact=5, likelihood=4).\n- **Límites:** no uses suma; no imprimas etiquetas; no inventes otra fórmula en este ejercicio.",
        instruction:
          "1. Abre el starter: `print(impact + likelihood)` (bug: suma).\n2. Cambia a producto `impact * likelihood`.\n3. Imprime solo el número.\n4. Con 5 y 4 el oráculo es 20.",
        hint: "Multiplica enteros",
        hints: [
          "Multiplica enteros",
          "print del producto únicamente",
        ],
        edgeCases: ["Score 0 si likelihood es 0."],
        tests: "score numérico = 20",
        feedback:
          "El score de priorización es producto (5×4=20), no suma. Si sumas, un área “media” se disfraza de alta prioridad y la cola del sprint miente.",
        retrospective:
          "Producto impacto×probabilidad es la heurística de bolsillo del ranking. El error clásico es sumar o inventar un ponderado opaco. Siguiente (E2): ordenar áreas por ese score de mayor a menor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · risk = impact*likelihood
# DEFECT: suma en vez de producto
impact, likelihood = 5, 4
print(impact + likelihood)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `impact, likelihood = 5, 4
print(impact * likelihood)`,
          output: `20`,
        },
      },
      {
        id: "S27-T1-A-E2",
        subtopicId: "S27-T1-A",
        kind: "independent",
        title: "Ordenar áreas por riesgo descendente",
        preamble:
          "- **Contexto:** con tiempo finito, el README del paquete de tests debe listar primero lo que más duele si falla.\n- **Meta:** ordenar filas por score (impacto×probabilidad) **descendente** e imprimir solo los nombres.\n- **Éxito:** `['unit', 'e2e']` (unit score 25 antes que e2e score 2).\n- **Límites:** no dejes el orden ascendente; no pidas empates aquí; una sola lista de salida.",
        instruction:
          "1. Revisa el starter: `sorted(..., key=score)` sin signo negativo (ascendente).\n2. Usa clave negativa `-(r[1]*r[2])` (o `reverse=True` equivalente).\n3. Imprime la list comprehension de nombres.\n4. No alteres las tuplas de datos.",
        hint: "sorted con clave negativa",
        hints: [
          "key=lambda r: -(r[1]*r[2])",
          "imprime solo la lista de nombres",
        ],
        edgeCases: ["Empates: el orden secundario no se pide aquí."],
        tests: "lista de nombres unit antes que e2e",
        feedback: "Orden descendente por impacto×probabilidad: unit (25) antes que e2e (2). Ordenar al revés es invertir la pirámide en la práctica.",
        retrospective:
          "El ranking descendente es la cola de conversación del sprint: primero lo que más duele si falla. El error clásico no es solo “orden al revés”, sino tratar el sort como adorno del README sin usarlo para repartir casos. Pregunta: si solo tienes una hora, ¿qué fila de `rows` cubres primero? Luego (E3) eliges la *capa* del área de mayor score.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · orden por riesgo desc
# DEFECT: ordena ascendente
rows=[('e2e',2,1),('unit',5,5)]
print([n for n,_,_ in sorted(rows, key=lambda r: (r[1]*r[2]))])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[('e2e',2,1),('unit',5,5)]
print([n for n,_,_ in sorted(rows, key=lambda r: -(r[1]*r[2]))])`,
          output: `['unit', 'e2e']`,
        },
      },
      {
        id: "S27-T1-A-E3",
        subtopicId: "S27-T1-A",
        kind: "transfer",
        title: "Capa del área de mayor score",
        preamble:
          "- **Contexto:** el mapa de riesgo de CP-N3-A no solo nombra áreas: reporta en qué capa de la pirámide inviertes primero.\n- **Meta:** de la lista `(área, score, capa)`, tomar el **mayor** score e imprimir su capa.\n- **Éxito:** la cadena `unit` (normalize score 20 gana a ui_review e2e score 4).\n- **Límites:** no uses `min`; no imprimas el nombre del área; no inventes empates.",
        instruction:
          "1. El starter usa `min` (elige el score más bajo).\n2. Cambia a `max(risks, key=lambda r: r[1])`.\n3. Imprime el índice de capa `top[2]`.\n4. Verifica mentalmente: 20 > 4 → unit.",
        hint: "max(..., key=score)",
        hints: [
          "max(risks, key=lambda r: r[1])",
          "imprime el índice de capa (r[2]), no el nombre",
        ],
        edgeCases: ["empates: no se piden aquí; prioriza score"],
        tests: "capa de la fila con mayor score = unit",
        feedback: "Priorizar por score (max) pone unit en la base ancha; min invierte la pirámide y manda a testear la UI barata de impacto.",
        retrospective:
          "Priorizar con `max` alinea la inversión con la base de la pirámide; `min` manda a testear la UI y deja el contrato unit sin red. Pregunta de cierre: en el You Do, ¿qué área del `risk_map` saldría primero?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · capa del área de mayor score
# DEFECT: usa min (elige el score más bajo)
risks = [('normalize', 20, 'unit'), ('ui_review', 4, 'e2e')]
top = min(risks, key=lambda r: r[1])
print(top[2])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `risks = [('normalize', 20, 'unit'), ('ui_review', 4, 'e2e')]
top = max(risks, key=lambda r: r[1])
print(top[2])`,
          output: `unit`,
        },
      },
      {
        id: "S27-T1-B-E1",
        subtopicId: "S27-T1-B",
        kind: "guided",
        title: "Normalizar con casefold y colapsar espacios",
        preamble:
          "- **Contexto:** en entity resolution, dos contactos sintéticos solo se comparan tras un contrato de normalización estable.\n- **Meta:** aplicar `casefold` y colapsar espacios internos con `split`/`join` (no solo `strip`).\n- **Éxito:** una línea `a b` a partir de `' A  B '`.\n- **Límites:** no dejes solo strip; no imprimas etiquetas; no uses PII real.",
        instruction:
          "1. Abre el starter: `print(s.strip())` (bug).\n2. Usa `' '.join(s.casefold().split())`.\n3. Imprime solo el resultado.\n4. Comprueba mentalmente: dobles espacios y mayúsculas desaparecen.",
        hint: "casefold + split/join",
        hints: [
          "' '.join(s.casefold().split())",
          "strip solo no colapsa dobles espacios",
        ],
        edgeCases: ["tabs y NBSP en prod"],
        tests: "salida coincide con solution output",
        feedback: "casefold + split/join colapsa espacios y unifica mayúsculas: ' A  B ' → 'a b'. strip solo no basta.",
        retrospective:
          "`strip` limpia bordes; no colapsa dobles espacios ni unifica case. El contrato real del motor es casefold + split/join. Siguiente (E2): assert con oráculo y señal `pass` honesta.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · normalize whitespace+casefold
# DEFECT: solo strip
s=' A  B '
print(s.strip())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s=' A  B '
print(' '.join(s.casefold().split()))`,
          output: `a b`,
        },
      },
      {
        id: "S27-T1-B-E2",
        subtopicId: "S27-T1-B",
        kind: "independent",
        title: "Tras el assert, imprime pass",
        preamble:
          "- **Contexto:** el oráculo `'ana'` para `'ANA'.casefold()` debe quedar sellado: si el assert no lanza, el caso pasó.\n- **Meta:** mantener el assert y reportar `'pass'` (no `'fail'` inventado).\n- **Éxito:** una línea `pass`.\n- **Límites:** no borres el assert; no imprimas fail si el contrato se cumple; oráculo fijo `'ana'`.",
        instruction:
          "1. Revisa el starter: assert OK pero `print('fail')`.\n2. Cambia el print a `'pass'`.\n3. No alteres el oráculo ni el raw.\n4. Si rompes el assert a propósito, el programa debe detenerse (no imprimir fail a mano).",
        hint: "assert luego print('pass')",
        hints: [
          "oráculo 'ana'",
          "no imprimas fail si el contrato se cumple",
        ],
        edgeCases: ["falla ruidosa si rompes el oráculo"],
        tests: "salida coincide con solution output",
        feedback: "Tras el assert, imprime 'pass' solo si el oráculo se cumplió. Un 'fail' después de un assert verde confunde al humano y al log de CI.",
        retrospective:
          "La señal post-assert es un contrato de lectura humana y de log: o el proceso murió en el assert, o reportas `pass`. Inventar `fail` a mano es un falso negativo de confianza. Pregunta: si CI imprime `fail` pero el exit code es 0, ¿confías en el merge? Luego (E3): matching exacto normalizando *ambos* lados.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · casefold assert
# DEFECT: imprime fail
raw='ANA'
assert raw.casefold() == 'ana'
print('fail')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw='ANA'
assert raw.casefold() == 'ana'
print('pass')`,
          output: `pass`,
        },
      },
      {
        id: "S27-T1-B-E3",
        subtopicId: "S27-T1-B",
        kind: "transfer",
        title: "Matching exacto tras normalizar ambos",
        preamble:
          "- **Contexto:** el motor ER pregunta solo si dos cadenas sintéticas son la misma entidad tras el contrato de normalización — no si hay fraude ni parentesco.\n- **Meta:** normalizar `a` y `b` (`casefold` + colapsar espacios) y comparar.\n- **Éxito:** `True` para `'X Y'` vs `'x  y'`.\n- **Límites:** no compares crudo; no etiquetes fraude; datos sintéticos.",
        instruction:
          "1. El starter hace `a == b` crudo (False).\n2. Aplica el mismo normalize a ambos lados.\n3. Imprime el booleano de igualdad.\n4. No cambies los strings de prueba.",
        hint: "normaliza ambos y compara",
        hints: [
          "' '.join(s.casefold().split()) en a y b",
          "matching ≠ fraude: solo igualdad normalizada",
        ],
        edgeCases: ["acentos: casefold ayuda en muchas locales"],
        tests: "salida coincide con solution output",
        feedback: "Matching exacto compara entidades normalizadas, no cadenas crudas: casefold + colapsar espacios en ambos lados. No infiere fraude ni parentesco.",
        retrospective:
          "Matching exacto compara entidades normalizadas, no basura de espacios/case. El error clásico es igualdad cruda o, peor, inferir riesgo/parentesco del score. Pregunta: ¿qué reutilizas de aquí en `exact_match` del You Do?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · equality after normalize
# DEFECT: compara crudo
a,b='X Y','x  y'
print(a == b)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='X Y','x  y'
print(' '.join(a.casefold().split()) == ' '.join(b.casefold().split()))`,
          output: `True`,
        },
      },
      {
        id: "S27-T2-A-E1",
        subtopicId: "S27-T2-A",
        kind: "guided",
        title: "Descubrir solo nombres test_",
        preamble:
          "- **Contexto:** en la suite del motor ER, un helper no es un caso de CI ni un node id.\n- **Meta:** de una lista de nombres, quedarte solo con los que empiezan por `'test_'`.\n- **Éxito:** `['test_a', 'test_b']` (helper fuera).\n- **Límites:** no imprimas la lista completa; no inventes discovery de clases `Test*` en este ejercicio.",
        instruction:
          "1. El starter imprime `names` sin filtrar.\n2. Filtra con `n.startswith('test_')`.\n3. Imprime la lista resultante.\n4. No reordenes de más: el orden de aparición basta.",
        hint: "startswith + list comprehension",
        hints: [
          "n.startswith('test_')",
          "helpers no son tests",
        ],
        edgeCases: ["clases Test* en pytest real"],
        tests: "salida coincide con solution output",
        feedback: "pytest descubre nombres que empiezan con test_*; helper no es un caso de la suite ni un node id.",
        retrospective:
          "Discovery por prefijo es la regla por defecto de pytest. Confundir helper con test deja “contratos” que nunca corren. Siguiente (E2): un assert que diga fail cuando left ≠ right.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · discovery test_
# DEFECT: no filtra
names=['test_a','helper','test_b']
print(names)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `names=['test_a','helper','test_b']
print([n for n in names if n.startswith('test_')])`,
          output: `['test_a', 'test_b']`,
        },
      },
      {
        id: "S27-T2-A-E2",
        subtopicId: "S27-T2-A",
        kind: "independent",
        title: "Assert honesto: ok o fail",
        preamble:
          "- **Contexto:** un assert de CI que siempre imprime verde no protege el merge de normalización.\n- **Meta:** si `left != right` reportar `'fail'`, si no `'ok'`.\n- **Éxito:** `fail` con left=`'a'` y right=`'b'`.\n- **Límites:** no hardcodees `'ok'`; en pytest real el rewrite mostraría el diff de ambos lados.",
        instruction:
          "1. Revisa el starter: `print('ok')` siempre.\n2. Compara left y right.\n3. Imprime `'ok'` o `'fail'` según igualdad.\n4. No cambies los valores de prueba.",
        hint: "ternario o if/else",
        hints: [
          "print('ok' if left == right else 'fail')",
          "pytest real mostraría el diff de ambos lados",
        ],
        edgeCases: ["pytest rewrite muestra left y right"],
        tests: "salida coincide con solution output",
        feedback:
          "Un assert honesto distingue igualdad de desigualdad: con left≠right debe salir `fail`. Siempre imprimir `ok` es teatro de verde: el merge de normalización “pasa” aunque el oráculo esté roto.",
        retrospective:
          "Teatro de verde es peor que no tener test: da confianza falsa sobre el contrato de igualdad. Un assert honesto distingue lados y deja rastro legible. Pregunta: ¿qué imprimiría el rewrite de pytest con left y right distintos? Luego (E3): tabla de filas con oráculo strip (parametrize mental).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · assert equality
# DEFECT: siempre ok
left,right='a','b'
print('ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `left,right='a','b'
print('ok' if left == right else 'fail')`,
          output: `fail`,
        },
      },
      {
        id: "S27-T2-A-E3",
        subtopicId: "S27-T2-A",
        kind: "transfer",
        title: "Tabla parametrize con oráculo strip",
        preamble:
          "- **Contexto:** los contratos de normalize viven en tablas `(entrada, esperado)`; cada fila es un caso conceptual en CI.\n- **Meta:** aplicar `strip` a cada raw y reportar si coincide con el esperado.\n- **Éxito:** `[True, True]` para los dos casos dados.\n- **Límites:** no compares crudo; no imprimas las tuplas sin evaluar; casefold se suma en el contrato real (aquí solo strip).",
        instruction:
          "1. El starter hace `raw == exp` sin strip.\n2. Usa list comprehension con `raw.strip() == exp`.\n3. Imprime la lista de booleanos.\n4. No borres filas de la tabla.",
        hint: "list comprehension sobre la tabla",
        hints: [
          "[raw.strip() == exp for raw, exp in cases]",
          "cada fila sería un node id con [param] en pytest real",
        ],
        edgeCases: ["casefold se suma en el contrato real de normalize_name"],
        tests: "lista de dos aciertos True tras strip de la tabla",
        feedback: "Parametrize es una tabla que se ejecuta: no basta con imprimir las tuplas; hay que aplicar el oráculo a cada fila.",
        retrospective:
          "Cada fila `(raw, esperado)` es un caso conceptual en CI: si falla la fila 2, sabes qué raw rompió el oráculo. El error clásico es copiar el cuerpo del test tres veces o imprimir las tuplas sin evaluar. Pregunta: ¿añadirías casefold en esta tabla o lo dejas para el contrato real de `normalize_name`? En el You Do, cada oráculo de normalize debería ser una fila de esa tabla.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · tabla parametrize + oráculo strip
# DEFECT: compara crudo sin strip
cases = [(' x ', 'x'), ('  Y  ', 'Y')]
print([raw == exp for raw, exp in cases])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `cases = [(' x ', 'x'), ('  Y  ', 'Y')]
print([raw.strip() == exp for raw, exp in cases])`,
          output: `[True, True]`,
        },
      },
      {
        id: "S27-T2-B-E1",
        subtopicId: "S27-T2-B",
        kind: "guided",
        title: "deepcopy: no contamines el original",
        preamble:
          "- **Contexto:** un fixture de contactos sintéticos se muta en un test de matching; el siguiente test no debe ver basura.\n- **Meta:** copiar con `deepcopy`, mutar la copia y demostrar que `orig[0]['n']` sigue en 1.\n- **Éxito:** el entero `1`.\n- **Límites:** no uses `copy` superficial; no mutes `orig` a propósito; una sola línea de salida.",
        instruction:
          "1. El starter usa `from copy import copy` (shallow).\n2. Cambia a `deepcopy`.\n3. Deja la mutación en `c[0]['n']=9`.\n4. Imprime `orig[0]['n']`.",
        hint: "from copy import deepcopy",
        hints: [
          "deepcopy, no copy",
          "mutación solo en la copia del test",
        ],
        edgeCases: ["copy() superficial falla en dict anidado"],
        tests: "salida coincide con solution output",
        feedback:
          "deepcopy aísla dicts anidados; `list.copy()` superficial comparte el dict interno y contamina el original. Ese flake de orden solo aparece cuando el siguiente test reusa el fixture sucio.",
        retrospective:
          "`list.copy()` comparte dicts internos; `deepcopy` corta la contaminación. Ese es el mecanismo detrás de un fixture function limpio. Siguiente (E2): política de scopes para datos mutables.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · deepcopy aislamiento
# DEFECT: shallow copy
from copy import copy
orig=[{'n':1}]
c=copy(orig)
c[0]['n']=9
print(orig[0]['n'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from copy import deepcopy
orig=[{'n':1}]
c=deepcopy(orig)
c[0]['n']=9
print(orig[0]['n'])`,
          output: `1`,
        },
      },
      {
        id: "S27-T2-B-E2",
        subtopicId: "S27-T2-B",
        kind: "independent",
        title: "Scope seguro para datos mutables",
        preamble:
          "- **Contexto:** pytest permite function/class/module/session; solo algunos son seguros si el fixture es una lista mutable.\n- **Meta:** del mapa `safe_for_mutable`, elegir el scope marcado True (el default).\n- **Éxito:** imprimir `function`.\n- **Límites:** no elijas `session`; session solo para recursos caros de solo lectura.",
        instruction:
          "1. El starter hardcodea `chosen = 'session'`.\n2. Busca el scope con valor True (p. ej. `next(... if ok)`).\n3. Imprime ese scope.\n4. No reescribas el dict de política a mano con todos True.",
        hint: "busca el scope con True",
        hints: [
          "safe_for_mutable['function'] es True",
          "session reutiliza estado y no es seguro para listas mutables",
        ],
        edgeCases: ["session solo para recursos caros de solo lectura"],
        tests: "imprime function",
        feedback: "function-scope es el default seguro de pytest: cada test recibe setup fresco. Session-scope sobre listas mutables produce flakes de orden.",
        retrospective:
          "El mapa `safe_for_mutable` es una política de equipo, no un truco de API: si el fixture es lista de dicts, el default `function` es la respuesta segura. Session solo gana cuando el recurso es caro y **de solo lectura**. Pregunta: ¿pondrías un catálogo inmutable de umbrales en session? ¿Y la lista de contactos del caso? Luego (E3): factory que crea N entidades por caso.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Scope seguro para datos mutables (default pytest)
# DEFECT: elige session aunque no es safe_for_mutable
safe_for_mutable = {'function': True, 'class': False, 'module': False, 'session': False}
chosen = 'session'
print(chosen)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `safe_for_mutable = {'function': True, 'class': False, 'module': False, 'session': False}
chosen = next(s for s, ok in safe_for_mutable.items() if ok)
print(chosen)`,
          output: `function`,
        },
      },
      {
        id: "S27-T2-B-E3",
        subtopicId: "S27-T2-B",
        kind: "transfer",
        title: "Factory: longitud de make(3)",
        preamble:
          "- **Contexto:** en tests de matching necesitas N contactos sintéticos distintos por caso, no un global compartido.\n- **Meta:** usar la factory `make` e imprimir `len(make(3))`.\n- **Éxito:** el entero `3`.\n- **Límites:** no hardcodees 0 ni 3 sin llamar a `make`; ids sintéticos `c0..` (sin PII).",
        instruction:
          "1. El starter define `make` pero imprime `0`.\n2. Llama `make(3)`.\n3. Imprime su longitud.\n4. No reescribas la factory.",
        hint: "print(len(make(3)))",
        hints: [
          "usa la función make definida",
          "ids sintéticos c0, c1, c2",
        ],
        edgeCases: ["n=0 devuelve lista vacía"],
        tests: "salida coincide con solution output",
        feedback: "La factory fixture crea N entidades por caso. Hardcodear el tamaño no prueba la factory ni el aislamiento.",
        retrospective:
          "La factory es el hábito de “N entidades frescas por caso”: el assert mide el *resultado de crear*, no un literal mágico. Si hardcodeas `3`, un bug en `range(n)` o en los ids `c0..` pasa invisible. Pregunta: ¿qué imprimiría `len(make(0))` y por qué importa ese borde? En el You Do, un `@pytest.fixture` o factory similar alimenta los AAA de normalize/match.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · factory len
# DEFECT: hardcode 0
def make(n):
    return [{'id': f'c{i}'} for i in range(n)]
print(0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def make(n):
    return [{'id': f'c{i}'} for i in range(n)]
print(len(make(3)))`,
          output: `3`,
        },
      },
      {
        id: "S27-T3-A-E1",
        subtopicId: "S27-T3-A",
        kind: "guided",
        title: "Scores con math.isclose, no ==",
        preamble:
          "- **Contexto:** los umbrales thr_auto/thr_review del clasificador de pares usan floats; un `==` bit a bit es trampa pedagógica y de producción.\n- **Meta:** usar `math.isclose(0.1 + 0.2, 0.3)` e imprimir el booleano.\n- **Éxito:** `True`.\n- **Límites:** no uses `==`; documenta tolerancia en el contrato real (aquí basta el default de isclose).",
        instruction:
          "1. El starter imprime `0.1 + 0.2 == 0.3` (False).\n2. Cambia a `math.isclose(...)`.\n3. Imprime solo el booleano.\n4. No alteres los literales 0.1/0.2/0.3.",
        hint: "import math; math.isclose",
        hints: [
          "math.isclose(0.1 + 0.2, 0.3)",
          "no uses == en floats de probabilidad ni en thr_auto/thr_review",
        ],
        edgeCases: ["abs_tol en scores de matching; documenta tolerancia en el contrato"],
        tests: "salida coincide con solution output",
        feedback: "math.isclose evita la trampa IEEE-754 de 0.1+0.2 en scores de matching. Documenta abs_tol/rel_tol en el contrato del umbral.",
        retrospective:
          "isclose (con abs_tol/rel_tol documentados) es el hábito de scores de matching. El error clásico es igualdad exacta o redondeos opacos. Siguiente (E2): el mensaje del ValueError también es contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · isclose float
# DEFECT: == exacto
import math
print(0.1 + 0.2 == 0.3)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import math
print(math.isclose(0.1 + 0.2, 0.3))`,
          output: `True`,
        },
      },
      {
        id: "S27-T3-A-E2",
        subtopicId: "S27-T3-A",
        kind: "independent",
        title: "raises + fragmento en el mensaje",
        preamble:
          "- **Contexto:** un `raises` que solo mira el tipo acepta un mensaje basura; en CI el fragmento acelera el fix.\n- **Meta:** capturar el `ValueError` de `int('x')` e imprimir `True` solo si el mensaje contiene `'invalid'`.\n- **Éxito:** `True` (en CPython suele decir *invalid literal*).\n- **Límites:** en pytest real `match=` es regex (`re.search`); aquí contención literal sin metacaracteres; no imprimas False a ciegas.",
        instruction:
          "1. El starter pone `matched = False` en el except.\n2. Inspecciona `str(e)` (casefold opcional) buscando `'invalid'`.\n3. Imprime el booleano.\n4. No cambies el input `'x'`.",
        hint: "except ValueError as e; 'invalid' in str(e).casefold()",
        hints: [
          "with pytest.raises(ValueError, match='invalid') en pytest real (match= es regex)",
          "print(True) solo si el fragmento está en el mensaje.",
        ],
        edgeCases: ["En pytest real, match= usa re.search (regex); aquí modelamos un fragmento literal sin metacaracteres."],
        tests: "True si el mensaje del ValueError contiene 'invalid'",
        feedback:
          "El tipo *y* el fragmento del mensaje son contrato. En pytest real, `match=` es regex: usa `re.escape` si el texto trae metacaracteres.",
        retrospective:
          "Mensaje + tipo = contrato de excepción. Solo el tipo es teatro parcial. Luego (E3): leer el contenido real de un archivo temporal, no asumir cadena vacía.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · raises + match fragment
# DEFECT: no inspecciona el mensaje
try:
    int('x')
    matched = False
except ValueError as e:
    matched = False  # debería mirar str(e)
print(matched)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `try:
    int('x')
    matched = False
except ValueError as e:
    matched = 'invalid' in str(e).casefold()
print(matched)`,
          output: `True`,
        },
      },
      {
        id: "S27-T3-A-E3",
        subtopicId: "S27-T3-A",
        kind: "transfer",
        title: "Leer el contenido del tempfile",
        preamble:
          "- **Contexto:** los tests de normalización a veces escriben evidencia en disco; nunca en el home ni en el árbol del repo.\n- **Meta:** escribir `'ok'` en un `NamedTemporaryFile` (utf-8, delete=False), reabrir por path e imprimir el contenido strip.\n- **Éxito:** la línea `ok`.\n- **Límites:** no imprimas vacío; encoding utf-8 al escribir y leer; en prod borra en finally.",
        instruction:
          "1. El starter escribe pero imprime `''`.\n2. Usa `Path(path).read_text(encoding='utf-8').strip()`.\n3. Imprime ese texto.\n4. No cambies el contenido escrito.",
        hint: "Path(path).read_text(encoding='utf-8')",
        hints: [
          "delete=False para conservar el path",
          "encoding utf-8 al escribir y al leer",
        ],
        edgeCases: ["borrar en finally en prod"],
        tests: "salida coincide con solution output",
        feedback:
          "NamedTemporaryFile con delete=False deja un path reabrable. El contrato lee el contenido real (utf-8); no asumas cadena vacía ni escribas en el árbol del repo o el home del desarrollador.",
        retrospective:
          "El contrato de tmp es el contenido real, no un print inventado. delete=False deja path reabrable; TemporaryDirectory borra al salir. En el You Do, prefiera fixtures `tmp_path` de pytest cuando trabajes en tu máquina.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · tempfile content
# DEFECT: no lee
import tempfile
from pathlib import Path
with tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:
    f.write('ok')
    path = f.name
print('')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import tempfile
from pathlib import Path
with tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:
    f.write('ok')
    path=f.name
print(Path(path).read_text(encoding='utf-8').strip())`,
          output: `ok`,
        },
      },
      {
        id: "S27-T3-B-E1",
        subtopicId: "S27-T3-B",
        kind: "guided",
        title: "Imprime el mensaje, no el tipo",
        preamble:
          "- **Contexto:** el caso negativo de email vacío debe dejar un mensaje legible en el log de CI.\n- **Meta:** lanzar `ValueError('email vacío')`, capturarlo e imprimir el **texto** del contrato.\n- **Éxito:** la línea `email vacío`.\n- **Límites:** no imprimas `type(e).__name__`; no uses PII real; None vs vacío es otro caso (edge).",
        instruction:
          "1. El starter imprime `type(e).__name__` → `ValueError`.\n2. Cambia a `print(e)` o `print(str(e))`.\n3. Mantén el raise con el mensaje dado.\n4. No borres el try/except.",
        hint: "print(e) o print(str(e))",
        hints: [
          "raise ValueError('email vacío')",
          "El mensaje es el contrato del caso negativo; el tipo solo no basta.",
        ],
        edgeCases: ["None vs. cadena vacía; mensajes sin PII real."],
        tests: "salida coincide con solution output",
        feedback: "El mensaje de la excepción es el contrato del caso negativo. Solo imprimir el nombre del tipo no acelera el fix en CI.",
        retrospective:
          "El mensaje es el contrato del negativo; el tipo solo no dice *qué* falló. Siguiente (E2): un email sintético sin `@` no puede marcar ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · mensaje ValueError
# DEFECT: imprime tipo
email=''
try:
    if email == '':
        raise ValueError('email vacío')
except ValueError as e:
    print(type(e).__name__)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `email=''
try:
    if email == '':
        raise ValueError('email vacío')
except ValueError as e:
    print(e)`,
          output: `email vacío`,
        },
      },
      {
        id: "S27-T3-B-E2",
        subtopicId: "S27-T3-B",
        kind: "independent",
        title: "Email sintético: exige arroba",
        preamble:
          "- **Contexto:** validación mínima de contacto sintético (no RFC completo) para el intake del motor ER.\n- **Meta:** si falta `'@'`, reportar `'invalid'`; si no, `'ok'`.\n- **Éxito:** `invalid` con `s='sin-arroba'`.\n- **Límites:** no imprimas siempre ok; no es validación RFC; sin PII real.",
        instruction:
          "1. El starter imprime `'ok'` a ciegas.\n2. Condiciona con `'@' in s`.\n3. Imprime `'ok'` o `'invalid'`.\n4. No cambies el string de prueba.",
        hint: "'@' in s",
        hints: [
          "print('ok' if '@' in s else 'invalid')",
          "No es validación RFC completa; basta el contrato mínimo del curso.",
        ],
        edgeCases: ["No es validación RFC completa; no uses PII real."],
        tests: "salida coincide con solution output",
        feedback: "Un email sintético sin '@' es inválido. El caso negativo debe fallar de forma controlada, no imprimir siempre 'ok'.",
        retrospective:
          "El negativo debe fallar de forma controlada. Teatro de verde en validación de entrada es basura en matching. Luego (E3): mensajes que nombran campo y valor ofensivo sintético.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · validación mínima de email
# DEFECT: marca ok aunque falte '@'
s = 'sin-arroba'
print('ok')  # debería ser 'invalid' si falta '@'
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s = 'sin-arroba'
print('ok' if '@' in s else 'invalid')`,
          output: `invalid`,
        },
      },
      {
        id: "S27-T3-B-E3",
        subtopicId: "S27-T3-B",
        kind: "transfer",
        title: "Mensaje con campo y valor ofensivo",
        preamble:
          "- **Contexto:** en el clerical queue, el mensaje del validador es documentación viva del contrato de entrada.\n- **Meta:** con `v=-1`, construir `campo score inválido: {v!r}`.\n- **Éxito:** `campo score inválido: -1`.\n- **Límites:** no uses un genérico `'error'`; no loguees tokens ni PII real; el valor es sintético.",
        instruction:
          "1. El starter imprime `'error'`.\n2. Usa f-string con `!r` y el nombre del campo.\n3. Imprime esa sola línea.\n4. No cambies `v`.",
        hint: "f-string con !r",
        hints: [
          "print(f'campo score inválido: {v!r}')",
          "nombra el campo en el mensaje; no loguees tokens ni PII real",
        ],
        edgeCases: ["no loguear tokens ni PII real"],
        tests: "salida coincide con solution output",
        feedback:
          "Mensajes útiles nombran el campo y el valor ofensivo (sintético). Un `error` genérico no dice dónde mirar en el log de CI ni en el clerical queue.",
        retrospective:
          "El mensaje es documentación viva del contrato de entrada: el clerical queue y el log de CI deben poder apuntar al campo sin adivinar. Un genérico `error` obliga a reproducir a ciegas. Pregunta: ¿qué imprimirías si `v` fuera un token real de API? (respuesta: nada — usa valor sintético). Ese hábito va a los negativos `require_email`-style del You Do.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · mensaje inválido
# DEFECT: mensaje genérico
v=-1
print('error')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `v=-1
print(f'campo score inválido: {v!r}')`,
          output: `campo score inválido: -1`,
        },
      },
      {
        id: "S27-T4-A-E1",
        subtopicId: "S27-T4-A",
        kind: "guided",
        title: "Cubrir ambas ramas hi y lo",
        preamble:
          "- **Contexto:** una sola llamada deja media función sin contrato; en umbrales eso es deuda de matching.\n- **Meta:** ejercitar `f(1)` y `f(-1)` e imprimir ambas salidas.\n- **Éxito:** `hi lo` en una línea.\n- **Límites:** no imprimas solo una rama; no mutes la función.",
        instruction:
          "1. El starter solo hace `print(f(1))`.\n2. Añade la llamada a `f(-1)`.\n3. Imprime ambas en un solo print.\n4. No cambies la definición de `f`.",
        hint: "print(f(1), f(-1))",
        hints: [
          "ambas ramas en un solo print",
          "cubrir hi y lo = branch coverage mínima",
        ],
        edgeCases: ["rama ==0 cae en lo"],
        tests: "salida coincide con solution output",
        feedback: "Branch coverage mínima: ejercita ambas ramas (hi y lo) en la misma evidencia. Una sola llamada deja una rama sin contrato.",
        retrospective:
          "La evidencia del contrato son *ambas* salidas en el mismo run: `hi` y `lo`. Cubrir solo el camino feliz deja la rama de umbral bajo sin red. Pregunta: en `classify_pair`, ¿qué score sintético usarías para ejercitar `non`? Siguiente (E2): detectar si falta la banda `non` en el set de hits.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · branches hi/lo
# DEFECT: solo un branch
def f(x):
    return 'hi' if x > 0 else 'lo'
print(f(1))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def f(x):
    return 'hi' if x > 0 else 'lo'
print(f(1), f(-1))`,
          output: `hi lo`,
        },
      },
      {
        id: "S27-T4-A-E2",
        subtopicId: "S27-T4-A",
        kind: "independent",
        title: "¿Falta la rama non?",
        preamble:
          "- **Contexto:** si CI nunca vio `non_match`, el clerical queue puede romperse en producción sin alarma.\n- **Meta:** dado `hit={'auto','review'}`, imprimir True si falta `'non'`.\n- **Éxito:** `True`.\n- **Límites:** no uses `'non' in hit` (respuesta invertida); risk coverage ≠ solo line coverage.",
        instruction:
          "1. El starter imprime `'non' in hit` → False.\n2. Cambia a `'non' not in hit`.\n3. Imprime el booleano.\n4. No alteres el set.",
        hint: "'non' not in hit",
        hints: [
          "membership con not in",
          "tres bandas de umbral: auto/review/non",
        ],
        edgeCases: ["risk coverage ≠ solo line coverage"],
        tests: "salida coincide con solution output",
        feedback: "Si falta la banda 'non' en la evidencia, hay deuda de risk coverage en umbrales de matching — CI no vio non_match.",
        retrospective:
          "Preguntar “¿qué rama de negocio no tiene caso?” gana a “¿llegamos al 90 % de líneas?”. Luego (E3): convertir 2 de 3 en un porcentaje entero legible para el equipo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · non no en hit
# DEFECT: non in hit
hit={'auto','review'}
print('non' in hit)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `hit={'auto','review'}
print('non' not in hit)`,
          output: `True`,
        },
      },
      {
        id: "S27-T4-A-E3",
        subtopicId: "S27-T4-A",
        kind: "transfer",
        title: "Cobertura como porcentaje entero",
        preamble:
          "- **Contexto:** el equipo lee un entero 0–100 en el README o en la retro, no una fracción 0.666.\n- **Meta:** con k=2, n=3, imprimir `int(100 * k / n)`.\n- **Éxito:** el entero `66`.\n- **Límites:** no imprimas la fracción k/n; no uses solo line coverage como KPI del motor.",
        instruction:
          "1. El starter imprime `k / n`.\n2. Escala a porcentaje entero truncado.\n3. Imprime solo ese entero.\n4. No redondees a 67 a menos que el contrato lo pida (aquí truncar).",
        hint: "int(100 * k / n)",
        hints: [
          "k, n = 2, 3",
          "evidencia de cobertura, no meta vacía del 100 %",
        ],
        edgeCases: ["no uses solo line coverage como KPI"],
        tests: "salida coincide con solution output",
        feedback: "Reporta cobertura como porcentaje legible (int 0–100). La fracción k/n sin escalar no es evidencia accionable en el equipo.",
        retrospective:
          "El % es evidencia accionable; la fracción cruda no se discute bien en la retro. En el You Do, reporta las tres bandas de umbral cubiertas, no un vanity score de líneas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · coverage percent
# DEFECT: imprime k/n en fracción (≈0.666) en vez de porcentaje entero
k, n = 2, 3
print(k / n)  # debería ser int(100 * k / n) → 66
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `k, n = 2, 3
print(int(100 * k / n))`,
          output: `66`,
        },
      },
      {
        id: "S27-T4-B-E1",
        subtopicId: "S27-T4-B",
        kind: "guided",
        title: "El mutante debe fallar el oráculo",
        preamble:
          "- **Contexto:** un test de regresión de `strip` debe pasar en el código bueno y fallar si alguien quita el strip.\n- **Meta:** imprimir True solo si `good == 'a'` **y** `mutant != 'a'`.\n- **Éxito:** `True` con raw `' a '`.\n- **Límites:** no exijas que mutant también pase; si ambos pasan, no hay contrato.",
        instruction:
          "1. El starter hace `good == 'a' and mutant == 'a'`.\n2. Cambia la segunda comparación a `!=`.\n3. Imprime el booleano.\n4. No alteres good/mutant.",
        hint: "good == 'a' and mutant != 'a'",
        hints: [
          "el test debe matar al mutante",
          "si ambos pasan, el contrato es teatro",
        ],
        edgeCases: ["mutación de umbral en matching"],
        tests: "salida coincide con solution output",
        feedback: "El camino bueno debe pasar y el mutante debe fallar. Si ambos pasan el oráculo, no hay contrato: hay teatro de cobertura.",
        retrospective:
          "Buen camino verde + mutante rojo = contrato; ambos verdes = teatro de cobertura. El oráculo debe ser lo bastante estricto para que quitar `strip` (o `casefold`) duela. Pregunta: si cambias el oráculo a `raw` crudo, ¿quién “gana” el mutante? Siguiente (E2): cuando falla, el mensaje debe traer input/expected/actual.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · mutant fails oracle
# DEFECT: no distingue mutant
raw=' a '
good=raw.strip()
mutant=raw
print(good == 'a' and mutant == 'a')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw=' a '
good=raw.strip()
mutant=raw
print(good == 'a' and mutant != 'a')`,
          output: `True`,
        },
      },
      {
        id: "S27-T4-B-E2",
        subtopicId: "S27-T4-B",
        kind: "independent",
        title: "Falla útil: input, expected, actual",
        preamble:
          "- **Contexto:** a las 2 a. m. el colega necesita el raw sintético y ambos lados del oráculo, no un assert ciego.\n- **Meta:** con inp/expected/actual dados, imprimir un dict con keys `input`, `expected`, `actual`.\n- **Éxito:** `{'input': 'ANA', 'expected': 'ana', 'actual': 'Ana'}`.\n- **Límites:** no omitas input; no inviertas roles; sin PII real en mensajes de CI.",
        instruction:
          "1. El starter imprime `{'expected': actual, 'actual': expected}` sin input.\n2. Arma el dict con los tres campos en roles correctos.\n3. Imprime el dict.\n4. No cambies los literales de prueba.",
        hint: "dict con input + expected + actual",
        hints: [
          "{'input': inp, 'expected': expected, 'actual': actual}",
          "Sin input en el mensaje, el fix en CI es más lento.",
        ],
        edgeCases: ["no incluyas PII real en mensajes de CI"],
        tests: "dict con input/expected/actual sintéticos",
        feedback: "Una falla útil nombra input sintético, esperado y actual; no solo un assert ciego. Roles invertidos retrasan el fix.",
        retrospective:
          "Input + expected + actual es el mínimo para un fix a las 2 a. m.: el colega reproduce el raw sintético sin adivinar. Roles invertidos mandan a “arreglar” el lado equivocado. Pregunta: ¿por qué no loguear un email real en ese dict? Luego (E3): cierra el ciclo bug_repro → regression_test con normalización.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · falla útil con input
# DEFECT: falta input; roles confusos
inp, expected, actual = 'ANA', 'ana', 'Ana'
print({'expected': actual, 'actual': expected})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `inp, expected, actual = 'ANA', 'ana', 'Ana'
print({'input': inp, 'expected': expected, 'actual': actual})`,
          output: `{'input': 'ANA', 'expected': 'ana', 'actual': 'Ana'}`,
        },
      },
      {
        id: "S27-T4-B-E3",
        subtopicId: "S27-T4-B",
        kind: "transfer",
        title: "De bug_repro a regression_test",
        preamble:
          "- **Contexto:** el bug era comparar `' ANA '` con el oráculo `'ana'` sin normalizar; al cerrar el ticket debe quedar un test verde que mate mutantes sin strip/casefold.\n- **Meta:** aplicar `casefold` + `strip` y reportar el booleano del contrato.\n- **Éxito:** `True`.\n- **Límites:** no te quedes en bug_repro (print False); no uses PII real; después parametriza varios raw con el mismo oráculo.",
        instruction:
          "1. El starter hace `raw == oracle` (False).\n2. Normaliza: `got = raw.casefold().strip()`.\n3. Imprime `got == oracle`.\n4. No cambies el oráculo.",
        hint: "normaliza antes del ==",
        hints: [
          "got = raw.casefold().strip()",
          "print(got == oracle) debe ser True tras la regresión.",
        ],
        edgeCases: ["después parametriza varios raw con el mismo oráculo"],
        tests: "regresión verde: True",
        feedback: "bug_repro muestra el fallo crudo; regression_test fija el oráculo normalizado para que un mutante sin strip/casefold no sobreviva en CI.",
        retrospective:
          "Cerrar el ticket sin el caso que mata al mutante deja la puerta abierta al mismo typo de `strip`/`casefold`. El repro muestra el dolor; la regresión lo convierte en contrato de CI. Pregunta de defensa: si mañana alguien borra `casefold` en `normalize_name`, ¿qué test del You Do debe fallar primero? Política: no merge sin ese rojo esperado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 27 · bug_repro → regression_test
# DEFECT: aún en bug_repro (compara crudo, sin normalizar)
raw, oracle = ' ANA ', 'ana'
print(raw == oracle)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw, oracle = ' ANA ', 'ana'
got = raw.casefold().strip()
print(got == oracle)`,
          output: `True`,
        },
      },
    ],
  },
  youDo: {
    title: "Contratos pytest de normalización y matching — inicio CP-N3-A",
    context:
      "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (Caso 27, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable. El entregable cubre: mapa de riesgo por capa; tests AAA con oráculos fijos; fixtures con aislamiento function-scope; casos negativos con mensajes útiles; cobertura de ramas de umbral; al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco.",
    objectives: [
      "Mapa de riesgos con score y capas unit/integration/e2e para normalize, match y umbrales.",
      "Tests AAA con oráculos fijos para normalize_name y exact_match (al menos 4 casos).",
      "Fixture function-scope (o factory) y al menos 3 casos negativos con mensajes que nombran el campo.",
      "Cobertura de las tres ramas de umbral y un mutante conceptual eliminado por regresión.",
      "README en español profesional: límites del fixture, evidencia de corrida y ética no-fraude.",
    ],
    requirements: [
      "Datos sintéticos únicamente (`@example.pe`); sin PII real ni secretos en asserts ni logs",
      "Cada bug documentado en el README o en un test de regresión con oráculo fijo",
      "Matching solo responde igualdad de entidad sintética: no implica fraude ni parentesco",
      "Demo reproducible: `python -m pytest tests/ -q` o el módulo de asserts del starter",
      "Inicio de CP-N3-A: contratos del motor ER listos para ampliar con dobles en S28",
    ],
    starterCode: `# CP-N3-A inicio — layout sugerido:
#   er_norm.py          → normalize_name, exact_match, classify_pair
#   tests/test_norm.py  → test_* AAA + negativos + umbrales
#   conftest.py         → @pytest.fixture function-scope (opcional)
#   README.md           → pirámide de riesgo, límites, evidencia de corrida
#
# En tu máquina: python -m pytest tests/ -q
# Aquí el mismo contrato corre como módulo con assert + print.

def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def exact_match(a: str, b: str) -> bool:
    return normalize_name(a) == normalize_name(b)

def classify_pair(score: float, thr_auto=0.9, thr_review=0.6) -> str:
    if score >= thr_auto:
        return "auto_match"
    if score >= thr_review:
        return "review"
    return "non_match"

def risk_map():
    """Prioridad de suites (score = impacto × probabilidad)."""
    return [
        {"area": "normalize_name", "layer": "unit", "score": 20},
        {"area": "exact_match", "layer": "unit", "score": 15},
        {"area": "classify_pair", "layer": "unit", "score": 12},
    ]

def test_normalize_spaces():
    # Arrange / Act / Assert
    assert normalize_name("  Ana  López ") == "ana lópez"

def test_exact_match_yes():
    assert exact_match(" Ana  ", "ana") is True

def test_exact_match_no():
    assert exact_match("ana", "luis") is False

def test_threshold_branches():
    assert classify_pair(0.95) == "auto_match"
    assert classify_pair(0.7) == "review"
    assert classify_pair(0.2) == "non_match"

# Extiende: negativos con mensajes, fixture function-scope, mutante conceptual
# (quita casefold y comprueba que test_normalize_spaces falla).

if __name__ == "__main__":
    test_normalize_spaces()
    test_exact_match_yes()
    test_exact_match_no()
    test_threshold_branches()
    print("risk_top", risk_map()[0]["area"])
    print("starter_ok")
`,
    portfolioNote:
      "Entrega de inicio CP-N3-A para tu portafolio. Carpeta con código de normalización/matching sintético, tests (pytest preferido) y README en español profesional con límites y evidencia de corrida.",
    rubric: [
      { criterion: "Cubre los objetivos de contratos pytest de esta sección (riesgo, AAA, fixtures, bordes, mutación)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante de `normalize_name` o de umbral demuestras con un test que fallaría si quitas `casefold` o inviertes un thr? (2) ¿tus mensajes de negativos nombran campo y valor *sintético* sin PII real? (3) En el README, una frase de impacto medible (p. ej. “tres bandas de umbral + un mutante muerto”) que puedas defender en 30 segundos ante un lead de data eng. Matching no es fraude: di en voz alta qué *no* afirma tu suite.",
  },
  selfCheck: {
    questions: [
      {
        question: "En la pirámide de pruebas, la base más ancha suele ser:",
        options: ["E2E UI", "Solo manual", "Pruebas unitarias", "Load tests en prod"],
        correctIndex: 2,
        explanation:
          "La base ancha son muchas unitarias baratas; arriba, pocas E2E caras. El riesgo reordena el tiempo (más casos en normalize/match), no invierte la pirámide con solo UI.",
      },
      {
        question: "Un oráculo confiable es:",
        options: ["Una fuente de verdad determinista para el assert", "Un print en consola", "El reloj del sistema sin fijar", "El orden de un set"],
        correctIndex: 0,
        explanation:
          "El assert necesita verdad estable: valor fijo, propiedad invariante o referencia simple. Un print, el reloj real o el orden de un set producen flakes, no contrato.",
      },
      {
        question: "Si mutas un casefold y ningún test falla:",
        options: ["Está bien", "El contrato es débil; el mutante sobrevivió", "pytest está roto siempre", "Ignora cobertura"],
        correctIndex: 1,
        explanation:
          "Mutación conceptual detecta tests inútiles: si el mutante vive, hay que añadir regresión (bug_repro → regression_test) que lo mate.",
      },
      {
        question: "Las pruebas de matching en CP-N3-A demuestran:",
        options: ["Fraude automático", "Parentescos", "Envío de correos", "Contratos de misma entidad / normalización — no riesgo ni relación"],
        correctIndex: 3,
        explanation:
          "Entity resolution decide si dos registros sintéticos son la misma entidad tras normalizar; no prueba fraude, parentesco ni envío de correos.",
      },
      {
        question: "¿Cuál es el scope por defecto de un fixture de pytest y por qué importa en datos mutables?",
        options: ["session: reutiliza estado entre todos los tests (ideal para mutar listas)", "package: es el default de pytest y aísla mutables sin necesidad de deepcopy", "function: se recrea por test y reduce contaminación entre casos", "module: es el único scope que aísla copias profundas automáticamente"],
        correctIndex: 2,
        explanation:
          "El default es function-scope: cada test recibe un setup fresco. Mutar un fixture session/module/package sin cuidado produce flakes de orden; deepcopy no es mágico del scope.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pytest documentation",
        url: "https://docs.pytest.org/en/stable/",
        note: "Discovery, fixtures, parametrize",
      },
      {
        label: "pytest — Getting started",
        url: "https://docs.pytest.org/en/stable/getting-started.html",
        note: "Primeros test_*",
      },
      {
        label: "pytest — Fixtures",
        url: "https://docs.pytest.org/en/stable/how-to/fixtures.html",
        note: "Scopes y aislamiento",
      },
      {
        label: "pytest — Parametrize",
        url: "https://docs.pytest.org/en/stable/how-to/parametrize.html",
        note: "Tablas de casos",
      },
      {
        label: "Coverage.py",
        url: "https://coverage.readthedocs.io/",
        note: "Cobertura por rama",
      },
      {
        label: "Python unittest.mock",
        url: "https://docs.python.org/3/library/unittest.mock.html",
        note: "Dobles (puente a S28)",
      },
      {
        label: "Real Python — Effective Python Testing",
        url: "https://realpython.com/python-testing/",
        note: "Pirámide y AAA",
      },
    ],
    books: [
      {
        label: "Python Testing with pytest (Okken)",
        note: "Fixtures y diseño de suites",
      },
      {
        label: "Unit Testing Principles (Khorikov)",
        note: "Oráculos y mantenibilidad",
      },
    ],
    courses: [
      {
        label: "Coursera — software testing tracks",
        url: "https://www.coursera.org/courses?query=software%20testing%20python",
        note: "Estrategia de pruebas",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos con asserts",
      },
      {
        label: "pytest tutorial (official)",
        url: "https://docs.pytest.org/en/stable/how-to/assert.html",
        note: "Assertions útiles",
      },
    ],
  },
}
