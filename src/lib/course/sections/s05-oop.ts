import type { CourseSection } from '../../types'

export const section05: CourseSection = {
  id: "oop",
  index: 5,
  title: "Funciones, contratos y descomposición",
  shortTitle: "Funciones & Contratos",
  tagline: "def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B",
  estimatedHours: 18,
  level: "Principiante",
  phase: 0,
  icon: "FunctionSquare",
  accentColor: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  jobRelevance:
    "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos. En bancos, fintech y retail en Perú, un normalizador no idempotente, con default mutable o con `print` en el core genera basura silenciosa en el ETL y hace imposible el test unitario del intake (inicio **CP-N1-B**). Aquí construyes el núcleo puro reutilizable; más adelante lo empaquetas en CLI y lo modelas con clases de dominio cuando el contrato ya sea confiable.",
  learningOutcomes: [
    { text: "Definir funciones con def, llamarlas y retornar valores (no None accidental)" },
    { text: "Usar parámetros posicionales, keyword y defaults seguros (sin mutables)" },
    { text: "Documentar pre/postcondiciones con docstrings alineados al código" },
    { text: "Anotar type hints graduales y modelar errores de dominio" },
    { text: "Descomponer lógica en funciones pequeñas y orquestadores delgados" },
    { text: "Distinguir pureza de efectos e inyectar I/O en el borde" },
    { text: "Explicar LEGB y escribir closures/factories simples" },
    { text: "Fijar ejemplos/asserts y refactorizar sin cambiar conducta" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: funciones con contrato",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Función (`def`):** bloque reutilizable con nombre de verbo. **`return`:** entrega un valor al caller (sin return → `None`). **Contrato:** precondiciones + postcondiciones documentadas (docstring) y alineadas al código. **Default seguro:** no uses lista/dict mutable como valor por defecto. **Función pura:** mismo input → mismo output, sin I/O ni prints. **Idempotencia:** `f(f(x)) == f(x)` en el caso feliz. **Orquestador delgado:** combina normalizadores sin reimplementar reglas. **LEGB:** orden Local → Enclosing → Global → Builtin. **Keyword-only:** parámetros tras `*` que obligan `nombre=` en la llamada.",
        "El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético **sin** tocar disco ni red. La I/O se inyecta o se deja en el borde. Datos ficticios únicamente (`example.com`); **nunca** PII real. Caso de lab: inicio **CP-N1-B**.",
        "**Políticas canónicas del gate (no cambian a mitad de sección):** `normalize_nombre` colapsa espacios y aplica **title-case por palabra**; `normalize_email` hace strip+lower y **`ValueError` si falta `@`**; teléfono = solo dígitos (demo); dirección = colapsa + upper. Cada normalizador debe ser **idempotente** en el caso feliz: `f(f(x)) == f(x)`.",
        "Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor). En cada subtema: teoría, un demo I Do y tres prácticas We Do (guiada, independiente, transferencia). Más adelante empaquetarás esto en CLI y modelarás registros con clases de dominio. Hoy el objetivo es el **núcleo puro** que un ETL junior puede testear sin abrir archivos.",
      ],
      code: {
        language: "python",
        title: "s05_map_contract.py",
        code: `def s05_section_contract():
    return {
        "case": "CASO-LIM-005",
        "gate": "CP-N1-B",
        "normalizers": ["nombre", "email", "telefono", "direccion"],
        "policies": {
            "nombre": "collapse+title",
            "email": "strip+lower+require_@",
            "telefono": "digits_only_demo",
            "direccion": "collapse+upper",
        },
        "must": ["pure", "idempotent", "no_io_in_core", "no_real_pii"],
    }

c = s05_section_contract()
print("case", c["case"])
print("gate", c["gate"])
print("must", ",".join(c["must"]))
print("email_policy", c["policies"]["email"])
`,
        output: `case CASO-LIM-005
gate CP-N1-B
must pure,idempotent,no_io_in_core,no_real_pii
email_policy strip+lower+require_@`,
      },
      callout: {
        type: "tip",
        title: "Qué entregas al cerrar S05",
        content:
          "Cuatro normalizadores puros + orquestador con docstring, hints graduales e idempotencia demostrada (inicio CP-N1-B). Sin clases todavía y sin leer CSV: eso llega cuando el core ya es confiable.",
      },
    },
    {
      heading: "Definición, llamada y retorno",
      subtopicId: "S05-T1-A",
      paragraphs: [
        "Una función se define con **`def nombre(params):`** y devuelve con **`return`**. Sin `return` explícito, Python devuelve **`None`** (bug silencioso en pipelines: el caller imprime `None` o encadena basura). Llamar es `nombre(args)`. El nombre debe ser un **verbo** o acción clara: `normalize_email`, no `email2` ni `datos`.",
        "Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, `normalize_nombre`, ya usa la política del gate: colapsar espacios y **title-case** por palabra — la misma que exige el youDo.",
        "Un solo `return` temprano por caso de error de dominio es legible; evita funciones de 100 líneas con muchos returns confusos — **descompón** (T3). Los normalizadores **retornan** el valor canónico; `print` es solo demo o reporte al borde, nunca un efecto oculto dentro de la función pura del core.",
      ],
      code: {
        language: 'python',
        title: "def_return.py",
        code: `def normalize_nombre(raw: str) -> str:
    """Post: colapsa espacios y title-case por palabra (política CP-N1-B)."""
    return " ".join(raw.strip().split()).title()

print(normalize_nombre("  María   José  "))
print(normalize_nombre("QUISPE"))
# sin return → None
def noop(x):
    x + 1
print(noop(1))`,
        output: `María José
Quispe
None`,
      },
      callout: {
        type: "tip",
        title: "return vs print",
        content:
          "Los normalizadores **retornan** el valor; el print es de demo. En pipelines, print dentro de la función pura es un efecto colateral indeseado.",
      },
    },
    {
      heading: "Posicionales, keyword y defaults seguros",
      subtopicId: "S05-T1-B",
      paragraphs: [
        "Argumentos **posicionales** se atan por orden; **keyword** por nombre (`fn(x=1)`). Los **defaults** se evalúan **una vez** en la definición: **nunca uses lista/dict mutable como default** (`def f(xs=[])` es un bug clásico P1 en pipelines). Usa `None` y crea la lista **dentro** de la función en cada llamada.",
        "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap `nombre, email` es un incidente de calidad de datos.",
        "Para normalizadores: `def normalize_telefono(raw, *, country=\"PE\")` con **keyword-only** documenta la política regional sin confundir posiciones. El `*` fuerza `country=` en la llamada; no puedes pasar el país como segundo posicional por error.",
      ],
      code: {
        language: 'python',
        title: "params_defaults.py",
        code: `def etiqueta(nombre, prefijo="Sr./Sra.", *, upper=False):
    s = f"{prefijo} {nombre}"
    return s.upper() if upper else s

print(etiqueta("Quispe"))
print(etiqueta("Quispe", prefijo="Cliente"))
print(etiqueta("Quispe", upper=True))

# Default mutable — MAL (demostración del bug)
def bad_add(item, bucket=[]):
    bucket.append(item)
    return bucket
print(bad_add(1), bad_add(2))  # ¡comparte la misma lista!

def good_add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
print(good_add(1), good_add(2))`,
        output: `Sr./Sra. Quispe
Cliente Quispe
SR./SRA. QUISPE
[1, 2] [1, 2]
[1] [2]`,
      },
      callout: {
        type: "danger",
        title: "Default mutable",
        content:
          "Si ves `def f(x, acc=[])` en un PR de normalización, es P1. Usa None + creación local.",
      },
    },
    {
      heading: "Pre/postcondiciones y docstrings",
      subtopicId: "S05-T2-A",
      paragraphs: [
        "Una **precondición** es lo que debe cumplirse **antes** de llamar (p. ej. `raw` es str). Una **postcondición** es lo que garantiza el return (p. ej. sin espacios extremos, minúsculas en email, title-case en nombre). Juntas son el **contrato** del normalizador.",
        "El **docstring** (PEP 257) documenta contrato en español o inglés consistente del proyecto: qué hace, parámetros, retorno, errores. **No** copies la firma; explica la **política de negocio** (p. ej. colapsar espacios + title-case, o exigir `@` en email).",
        "En intake sintético: pre = tipo str; post = forma canónica o `ValueError` de dominio. La política de email del gate es **strip+lower y raise si falta `@`** — la misma en demos, weDo y youDo. Si docstring y código discrepan, el revisor devuelve el PR.",
      ],
      code: {
        language: 'python',
        title: "docstring_email.py",
        code: `def normalize_email(raw: str) -> str:
    """Normaliza email sintético de intake.

    Pre: raw es str no vacío tras strip.
    Post: devuelve lowercased sin espacios extremos.
    Raises: ValueError si falta '@' o queda vacío.
    """
    s = raw.strip().lower()
    if not s or "@" not in s:
        raise ValueError("email inválido para normalizar")
    return s

print(normalize_email("  Ana.Perez@Example.COM "))
try:
    normalize_email("sin-arroba")
except ValueError as e:
    print("err:", e)`,
        output: `ana.perez@example.com
err: email inválido para normalizar`,
      },
      callout: {
        type: "tip",
        title: "Contrato legible",
        content:
          "Si el docstring y el código discrepan, gana el código — pero el revisor te devuelve el PR. Manténlos alineados.",
      },
    },
    {
      heading: "Type hints graduales y errores de dominio",
      subtopicId: "S05-T2-B",
      paragraphs: [
        "Los **type hints** (`def f(x: str) -> str`) **no** convierten en runtime (salvo checkers externos como mypy). Son documentación verificable y contrato para humanos. En S05 usamos hints **graduales**: anota lo público de los normalizadores; no atasques con genéricos avanzados ni Protocol todavía.",
        "Un **error de dominio** no es un bug de Python: es un valor de negocio inválido (email sin `@`, edad 200). Opciones: `raise ValueError`, devolver `(ok, value, error)`, o un dict de resultado. **Sé consistente** en el módulo: no mezcles raise y tuplas en el mismo archivo sin documentar por qué.",
        "`Optional[str]` / `str | None` documenta ausencia legítima. **No** uses hints falsos (`-> str` si puedes devolver `None` por olvido de return). Un hint que miente es peor que no anotar: el revisor y el typechecker confían en él.",
      ],
      code: {
        language: 'python',
        title: "hints_dominio.py",
        code: `from typing import Optional, Tuple

def parse_edad(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    try:
        n = int(raw.strip())
    except ValueError:
        return False, None, "no es entero"
    if n < 0 or n > 120:
        return False, None, "fuera de rango de dominio"
    return True, n, None

for v in ["34", "abc", "200"]:
    print(v, "→", parse_edad(v))`,
        output: `34 → (True, 34, None)
abc → (False, None, 'no es entero')
200 → (False, None, 'fuera de rango de dominio')`,
      },
      callout: {
        type: "tip",
        title: "ValueError vs return",
        content:
          "raise para APIs internas puras; tupla/result object cuando el lote no debe abortar en la primera fila mala.",
      },
    },
    {
      heading: "Funciones pequeñas y composición",
      subtopicId: "S05-T3-A",
      paragraphs: [
        "Una función debe hacer **una cosa** en el nivel de abstracción correcto. Si normalizas nombre y además escribes archivo y logueas, **sepáralas**. **Componer** es llamar funciones pequeñas desde una orquestadora delgada que no reimplementa reglas de negocio.",
        "Beneficio: tests unitarios fáciles, reuso en CLI (S10) y en ETL (S08). El orquestador `normalize_record` llama a cuatro normalizadores y arma el dict **sin** I/O en el núcleo. En un banco o fintech en Perú, ese dict limpio alimenta el pipeline: si el orquestador reimplementa strip, cada fix se multiplica por cuatro y el code review se vuelve un laberinto.",
        "Regla práctica: si necesitas un comentario de sección en medio de la función, **probablemente es otra función**. Extrae y nombra el verbo (`strip_collapse`, `title_case_name`). El monstruo de 40 líneas con tres políticas de campo es el anti-patrón que descompondrás en el We Do E3 — y el que un revisor junior aprende a rechazar.",
      ],
      code: {
        language: 'python',
        title: "composicion.py",
        code: `def strip_collapse(s: str) -> str:
    return " ".join(s.strip().split())

def title_case_name(s: str) -> str:
    return strip_collapse(s).title()

def normalize_nombre(raw: str) -> str:
    return title_case_name(raw)

def normalize_email(raw: str) -> str:
    s = raw.strip().lower()
    if "@" not in s:
        raise ValueError("email sin @")
    return s

def normalize_record(nombres: str, email: str) -> dict:
    return {
        "nombres": normalize_nombre(nombres),
        "email": normalize_email(email),
    }

print(normalize_record("  maría  josé ", "  X@Y.COM "))`,
        output: `{'nombres': 'María José', 'email': 'x@y.com'}`,
      },
      callout: {
        type: "tip",
        title: "Orquestador delgado",
        content:
          "normalize_record no reimplementa strip: delega. Así un fix en strip_collapse beneficia a todos.",
      },
    },
    {
      heading: "Pureza, efectos e inyección de I/O",
      subtopicId: "S05-T3-B",
      paragraphs: [
        "Una función **pura** devuelve el mismo resultado para los mismos argumentos y **no tiene efectos** (no imprime, no lee disco, no muta globales ni los argumentos mutables del caller sin documentarlo). Los normalizadores del gate CP-N1-B deben ser puros: así los pruebas sin capturar stdout ni montar archivos temporales.",
        "Los normalizadores deben ser **idempotentes**: `f(f(x)) == f(x)` para entradas válidas — doble normalizar no debe “romper” el valor canónico (p. ej. un title-case ya aplicado no se deforma). Demuéstralo con dos llamadas encadenadas antes de confiar en el ETL o en un assert de gate.",
        "La **I/O** (stdin, archivos, red) se queda en el **borde**: `main`, CLI, o funciones `load_*` / `save_*`. El core no conoce el filesystem. Cuando necesites un normalizador alternativo en un test, **inyéctalo** como argumento (ver tip); no hardcodees `open(...)` dentro del pure core ni uses un `lambda` gigante como sustituto de un `def` con nombre.",
      ],
      code: {
        language: 'python',
        title: "pureza_idem.py",
        code: `def normalize_telefono(raw: str) -> str:
    digits = "".join(ch for ch in raw if ch.isdigit())
    return digits

# Idempotencia: f(f(x)) == f(x)
x = "999-000-111"
y = normalize_telefono(x)
z = normalize_telefono(y)
print(y, z, "idempotent=", y == z)

# Un segundo sample: dígitos ya canónicos
print(normalize_telefono(" (01) 234-5678 "))`,
        output: `999000111 999000111 idempotent= True
012345678`,
      },
      callout: {
        type: "tip",
        title: "Siguiente beat: inyección y lambda",
        content:
          "Tras dominar pureza e idempotencia, inyecta el normalizador: `def process_line(line, norm=normalize_telefono): return norm(line)`. Un `lambda s: s.strip().lower()` sirve de fake puntual en tests; si la lógica crece, prefiere un `def` con nombre. Practícalo en el We Do E3 de este subtema.",
      },
    },
    {
      heading: "LEGB y closures básicos",
      subtopicId: "S05-T4-A",
      paragraphs: [
        "**LEGB**: orden de búsqueda de nombres — **L**ocal, **E**nclosing (funciones anidadas), **G**lobal, **B**uiltin. Si Python no halla el nombre, `NameError`. Saber LEGB evita el clásico “¿por qué usa el `PREF` del módulo y no el mío?” cuando fabricas normalizadores con prefijo de país.",
        "Un **closure** es una función interna que recuerda variables del enclosing scope. Útil para fabricar normalizadores configurados (`make_phone_normalizer(prefix)`), **sin** clases todavía: el factory cierra la política regional y devuelve una función pura lista para componer.",
        "`global` y `nonlocal` existen pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un anti-patrón en ETL junior.",
      ],
      code: {
        language: 'python',
        title: "legb_closure.py",
        code: `PREF = "+51"  # global del módulo (demo)

def make_phone_normalizer(prefix: str):
    def norm(raw: str) -> str:
        # 1) dígitos del texto original (el '+' no sobrevive al filtro)
        d = "".join(c for c in raw if c.isdigit())
        # 2) si ya trae código país 51 y hay dígitos de más, quítalo
        if d.startswith("51") and len(d) > 9:
            d = d[2:]
        # 3) siempre antepone el prefix del factory (closure)
        return prefix + d
    return norm

pe = make_phone_normalizer(PREF)
print(pe("999000111"))
print(pe("+51999000111"))

x = 10
def outer():
    x = 20
    def inner():
        return x  # enclosing
    return inner()
print("LEGB enclosing x →", outer())`,
        output: `+51999000111
+51999000111
LEGB enclosing x → 20`,
      },
      callout: {
        type: "tip",
        title: "Sin global",
        content:
          "Pasa la config como argumento o closure factory. Evita `global PREF` en normalizadores.",
      },
    },
    {
      heading: "Pruebas de ejemplo y refactor sin cambiar conducta",
      subtopicId: "S05-T4-B",
      paragraphs: [
        "Antes de refactorizar, fija **ejemplos ejecutables**: `assert normalize_email('A@B.COM') == 'a@b.com'`. Luego cambia la forma interna; si los asserts siguen verdes, la **conducta se preservó**. Sin ejemplos, un “refactor” es un cambio de producto disfrazado — y el gate CP-N1-B lo detecta en la suite de idempotencia.",
        "El refactor típico de S05: extraer `strip_collapse`, unificar defaults, renombrar verbos. **No** cambies la política de negocio “de paso” (p. ej. quitar validación de `@` o el title-case) sin actualizar tests y docstring: eso es un cambio de producto, no un refactor.",
        "Idempotencia se prueba con doble llamada. Fronteras útiles: vacío, solo espacios, Unicode (`Ñ`, tildes), y `None` solo si el contrato lo admite. Cada frontera es un caso de prueba permanente: no la borres cuando “ya pasó una vez” en tu máquina local.",
      ],
      code: {
        language: 'python',
        title: "refactor_seguro.py",
        code: `def normalize_email(raw: str) -> str:
    # contrato de gate: strip+lower + validar '@' (T2-A / youDo)
    s = raw.strip().lower()
    if "@" not in s:
        raise ValueError("email sin @")
    return s

def _examples() -> None:
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert normalize_email(normalize_email("A@B.COM")) == "a@b.com"
    print("examples OK")

# refactor interno: misma conducta (misma política de '@')
def normalize_email(raw: str) -> str:
    s = raw.strip()
    s = s.lower()
    if "@" not in s:
        raise ValueError("email sin @")
    return s

_examples()
print(normalize_email("Ana@Example.COM"))`,
        output: `examples OK
ana@example.com`,
      },
      callout: {
        type: "tip",
        title: "Rojo-verde-refactor",
        content:
          "Si no tienes ejemplos, no refactorices. El gate de normalizadores exige idempotencia demostrada.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema). Del def al refactor con ejemplos. Los normalizadores son el hilo hacia CP-N1-B. Datos sintéticos; browser-pyodide.",
    steps: [
      {
        demoId: "S05-T1-A-DEMO",
        subtopicId: "S05-T1-A",
        environment: "browser-pyodide",
        description: "def + return de normalize_nombre (colapsa + title-case)",
        code: {
          language: 'python',
          title: "S05-T1-A-DEMO — def_nombre",
          code: `def normalize_nombre(raw):
    return " ".join(raw.strip().split()).title()

for s in ["  Ana  ", "María  José", "QUISPE"]:
    print(repr(s), "→", repr(normalize_nombre(s)))`,
          output: `'  Ana  ' → 'Ana'
'María  José' → 'María José'
'QUISPE' → 'Quispe'`,
        },
        why: "Una función, un return, política CP-N1-B: colapsar + title; Unicode simple.",
      },
      {
        demoId: "S05-T1-B-DEMO",
        subtopicId: "S05-T1-B",
        environment: "browser-pyodide",
        description: "Defaults seguros vs default mutable bug",
        code: {
          language: 'python',
          title: "S05-T1-B-DEMO — defaults",
          code: `def good(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

def bad(item, bucket=[]):
    bucket.append(item)
    return bucket

print("good", good(1), good(2))
print("bad ", bad(1), bad(2))`,
          output: `good [1] [2]
bad  [1, 2] [1, 2]`,
        },
        why: "good crea listas nuevas; bad comparte el default entre llamadas.",
      },
      {
        demoId: "S05-T2-A-DEMO",
        subtopicId: "S05-T2-A",
        environment: "browser-pyodide",
        description: "Docstring + pre/post en normalize_email",
        code: {
          language: 'python',
          title: "S05-T2-A-DEMO — email_contract",
          code: `def normalize_email(raw: str) -> str:
    """Pre: str. Post: lower strip con @. Raises ValueError."""
    s = raw.strip().lower()
    if "@" not in s:
        raise ValueError("falta @")
    return s

print(normalize_email("  X@Y.COM "))
try:
    normalize_email("x")
except ValueError as e:
    print("ValueError", e)`,
          output: `x@y.com
ValueError falta @`,
        },
        why: "El contrato está en el docstring y se enforce con raise.",
      },
      {
        demoId: "S05-T2-B-DEMO",
        subtopicId: "S05-T2-B",
        environment: "browser-pyodide",
        description: "Type hints + resultado de dominio sin abortar el lote",
        code: {
          language: 'python',
          title: "S05-T2-B-DEMO — hints_tel",
          code: `from typing import Optional, Tuple

def norm_tel(raw: str) -> Tuple[bool, Optional[str], Optional[str]]:
    d = "".join(c for c in raw if c.isdigit())
    if len(d) != 9:
        return False, None, "se esperan 9 dígitos"
    return True, d, None

for v in ["999000111", "123", "999-000-111"]:
    print(v, norm_tel(v))`,
          output: `999000111 (True, '999000111', None)
123 (False, None, 'se esperan 9 dígitos')
999-000-111 (True, '999000111', None)`,
        },
        why: "Hints documentan la tupla; el lote puede seguir tras un False.",
      },
      {
        demoId: "S05-T3-A-DEMO",
        subtopicId: "S05-T3-A",
        environment: "browser-pyodide",
        description: "Componer strip + lower + orquestador de registro",
        code: {
          language: 'python',
          title: "S05-T3-A-DEMO — compose",
          code: `def strip_collapse(s: str) -> str:
    return " ".join(s.strip().split())

def norm_email(s: str) -> str:
    s = s.strip().lower()
    if "@" not in s:
        raise ValueError("email sin @")
    return s

def normalize_pair(nombre: str, email: str) -> dict:
    return {"nombre": strip_collapse(nombre).title(), "email": norm_email(email)}

print(normalize_pair("  ana  perez ", "  Ana@Example.COM "))`,
          output: `{'nombre': 'Ana Perez', 'email': 'ana@example.com'}`,
        },
        why: "Orquestador delgado reutiliza piezas pequeñas.",
      },
      {
        demoId: "S05-T3-B-DEMO",
        subtopicId: "S05-T3-B",
        environment: "browser-pyodide",
        description: "Idempotencia de normalize_telefono puro",
        code: {
          language: 'python',
          title: "S05-T3-B-DEMO — idem_tel",
          code: `def normalize_telefono(raw: str) -> str:
    return "".join(c for c in raw if c.isdigit())

samples = ["999-000-111", "(999) 000 111", "999000111"]
for s in samples:
    once = normalize_telefono(s)
    twice = normalize_telefono(once)
    print(s, "→", once, "idem=", once == twice)`,
          output: `999-000-111 → 999000111 idem= True
(999) 000 111 → 999000111 idem= True
999000111 → 999000111 idem= True`,
        },
        why: "f(f(x))==f(x) en los tres samples; sin I/O en la función.",
      },
      {
        demoId: "S05-T4-A-DEMO",
        subtopicId: "S05-T4-A",
        environment: "browser-pyodide",
        description: "Closure factory para prefijo de teléfono",
        code: {
          language: 'python',
          title: "S05-T4-A-DEMO — closure",
          code: `def make_norm(prefix: str):
    def norm(raw: str) -> str:
        d = "".join(c for c in raw if c.isdigit())
        return prefix + d
    return norm

pe = make_norm("+51")
print(pe("999000111"))
print(pe("999-000-111"))`,
          output: `+51999000111
+51999000111`,
        },
        why: "La interna recuerda prefix del enclosing scope sin global.",
      },
      {
        demoId: "S05-T4-B-DEMO",
        subtopicId: "S05-T4-B",
        environment: "browser-pyodide",
        description: "Ejemplos assert antes y después de micro-refactor",
        code: {
          language: 'python',
          title: "S05-T4-B-DEMO — refactor",
          code: `def normalize_direccion(raw: str) -> str:
    return " ".join(raw.strip().split()).upper()

def examples(fn):
    assert fn("  av. larco 123 ") == "AV. LARCO 123"
    assert fn(fn("Calle 1")) == fn("Calle 1")
    return True

assert examples(normalize_direccion)

def normalize_direccion(raw: str) -> str:
    parts = raw.strip().split()
    return " ".join(parts).upper()

assert examples(normalize_direccion)
print("refactor OK", normalize_direccion("  jr. unión 5 "))`,
          output: `refactor OK JR. UNIÓN 5`,
        },
        why: "Misma suite de ejemplos en verde tras cambiar la implementación.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara. Datos sintéticos únicamente.",
    steps: [
      {
        id: "S05-T1-A-E1",
        subtopicId: "S05-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. En intake, a veces mides el campo **antes** de normalizar. Corrige `n_palabras(raw)` para que **retorne** el número de tokens tras `strip`/`split` (no imprima dentro). Con `'  Ana   María  '` el caller debe ver `2`. Pasa: línea exacta `2`. Así evitas el `None` silencioso que también rompe `normalize_nombre`.",
        hint: "return len(raw.strip().split())",
        hints: [
          "return len(raw.strip().split())",
          "No uses print dentro de n_palabras; el print va en el caller.",
        ],
        edgeCases: ["return vs print", "espacios múltiples"],
        tests: "exact line 2",
        feedback: "return entrega el valor al caller; print dentro es efecto, no contrato.",
        starterCode: {
          language: 'python',
          title: "n_palabras.py",
          code: `# CASO-LIM-005 · return vs print (helper de intake)
# DEFECT: imprime dentro y no retorna (caller ve None)
def n_palabras(raw):
    print(len(raw.strip().split()))
print(n_palabras('  Ana   María  '))`,
        },
        solutionCode: {
          language: 'python',
          title: "n_palabras.py",
          code: `def n_palabras(raw):
    return len(raw.strip().split())
print(n_palabras('  Ana   María  '))`,
          output: `2`,
        },
      },
      {
        id: "S05-T1-A-E2",
        subtopicId: "S05-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. `normalize_nombre(raw)` colapsa espacios y aplica **title-case por palabra** (política CP-N1-B). Prueba con `'  Juan   Pérez '` y con `'QUISPE'`. Pasa: `Juan Pérez` y `Quispe`.",
        hint: "\" \".join(raw.strip().split()).title()",
        hints: [
          "\" \".join(raw.strip().split()).title()",
          "title() es parte del contrato del gate; no lo omitas.",
        ],
        edgeCases: ["espacios múltiples", "MAYÚSCULAS → Title"],
        tests: "Juan Pérez / Quispe",
        feedback: "Base del normalizador de nombres del capstone (colapsa + title).",
        starterCode: {
          language: 'python',
          title: "norm_nombre.py",
          code: `# CASO-LIM-005 · colapsar + title (política CP-N1-B)
# DEFECT: solo strip; no colapsa dobles espacios ni aplica title
def normalize_nombre(raw):
    return raw.strip()
print(normalize_nombre('  Juan   Pérez '))
print(normalize_nombre('QUISPE'))`,
        },
        solutionCode: {
          language: 'python',
          title: "norm_nombre.py",
          code: `def normalize_nombre(raw):
    return " ".join(raw.strip().split()).title()
print(normalize_nombre('  Juan   Pérez '))
print(normalize_nombre('QUISPE'))`,
          output: `Juan Pérez
Quispe`,
        },
      },
      {
        id: "S05-T1-A-E3",
        subtopicId: "S05-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Función `saluda(nombre)` que **retorne** el string `Hola {nombre}`; en el caller imprime el return. Si olvidas return, `print(saluda(...))` muestra None: arréglalo. Pasa: línea exacta `Hola Ana`.",
        hint: "Si ves None, falta return.",
        hints: [
          "Si ves None, falta return.",
          "return f'Hola {nombre}'",
        ],
        edgeCases: ["None implícito"],
        tests: "exact line Hola Ana",
        feedback: "El bug None es el más común al migrar de scripts a funciones.",
        starterCode: {
          language: 'python',
          title: "return_none.py",
          code: `# CASO-LIM-005 · None implícito
# DEFECT: saluda solo hace print; no return → print(saluda) es None
def saluda(nombre):
    print(f'Hola {nombre}')
print(saluda('Ana'))`,
        },
        solutionCode: {
          language: 'python',
          title: "return_none.py",
          code: `def saluda(nombre):
    return f'Hola {nombre}'
print(saluda('Ana'))`,
          output: `Hola Ana`,
        },
      },
      {
        id: "S05-T1-B-E1",
        subtopicId: "S05-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. `def present(nombre, titulo='Cliente'):` retorna `f'{titulo}: {nombre}'` usando el parámetro (no hardcodees). Llama con default y con keyword `titulo='VIP'`. Pasa: líneas exactas `Cliente: Quispe` y `VIP: Quispe`.",
        hint: "default solo se usa si omites el arg",
        hints: [
          "default solo se usa si omites el arg",
          "Dos prints distintos; usa la variable titulo en el f-string.",
        ],
        edgeCases: ["keyword override"],
        tests: "exact lines Cliente: Quispe + VIP: Quispe",
        feedback: "Keyword hace legible la política en el call site.",
        starterCode: {
          language: 'python',
          title: "present.py",
          code: `# CASO-LIM-005 · defaults + keyword
# DEFECT: ignora titulo; hardcodea "Cliente"
def present(nombre, titulo='Cliente'):
    return f'Cliente: {nombre}'
print(present('Quispe'))
print(present('Quispe', titulo='VIP'))`,
        },
        solutionCode: {
          language: 'python',
          title: "present.py",
          code: `def present(nombre, titulo='Cliente'):
    return f'{titulo}: {nombre}'
print(present('Quispe'))
print(present('Quispe', titulo='VIP'))`,
          output: `Cliente: Quispe
VIP: Quispe`,
        },
      },
      {
        id: "S05-T1-B-E2",
        subtopicId: "S05-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. Reescribe el default mutable de `good_add` a la versión segura con `None`. Dos llamadas independientes deben imprimir `[1]` y luego `[2]` (listas distintas). Pasa: esas dos líneas.",
        hint: "if bucket is None: bucket = []",
        hints: [
          "if bucket is None: bucket = []",
          "No deben compartir lista.",
        ],
        edgeCases: ["default None"],
        tests: "[1] luego [2]",
        feedback: "Default mutable es anti-patrón de producción.",
        starterCode: {
          language: 'python',
          title: "safe_default.py",
          code: `# CASO-LIM-005 · default mutable
# DEFECT: bucket=[] mutable compartido entre llamadas
def good_add(item, bucket=[]):
    bucket.append(item)
    return bucket
print(good_add(1))
print(good_add(2))`,
        },
        solutionCode: {
          language: 'python',
          title: "safe_default.py",
          code: `def good_add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
print(good_add(1))
print(good_add(2))`,
          output: `[1]
[2]`,
        },
      },
      {
        id: "S05-T1-B-E3",
        subtopicId: "S05-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. `normalize_telefono(raw, *, digits_only=True)` con flag **keyword-only**. Si `digits_only`, deja solo dígitos; si False, solo strip. Demuestra ambas llamadas. Pasa: `999000` y `999-000`.",
        hint: "El * fuerza keyword para digits_only.",
        hints: [
          "El * fuerza keyword para digits_only.",
          "normalize_telefono(' 999-1 ', digits_only=False)",
        ],
        edgeCases: ["keyword-only"],
        tests: "999000 y 999-000",
        feedback: "Keyword-only documenta flags de política regional.",
        starterCode: {
          language: 'python',
          title: "kwonly_tel.py",
          code: `# CASO-LIM-005 · keyword-only digits_only
# DEFECT: siempre strip; ignora digits_only
def normalize_telefono(raw, *, digits_only=True):
    return raw.strip()
print(normalize_telefono(' 999-000 '))
print(normalize_telefono(' 999-000 ', digits_only=False))`,
        },
        solutionCode: {
          language: 'python',
          title: "kwonly_tel.py",
          code: `def normalize_telefono(raw, *, digits_only=True):
    s = raw.strip()
    if digits_only:
        return ''.join(c for c in s if c.isdigit())
    return s
print(normalize_telefono(' 999-000 '))
print(normalize_telefono(' 999-000 ', digits_only=False))`,
          output: `999000
999-000`,
        },
      },
      {
        id: "S05-T2-A-E1",
        subtopicId: "S05-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. El helper base de los normalizadores: añade un **docstring** de una línea a `def strip_collapse(s)` (no un `#` comentario), imprime `strip_collapse.__doc__` y luego el resultado de `strip_collapse('  a  b ')`. Pasa: el texto del doc y la línea exacta `a b`.",
        hint: "Triple comillas justo bajo def; return ' '.join(s.strip().split())",
        hints: [
          "Triple comillas justo bajo def",
          "Docstring no es un comentario #; __doc__ no debe ser None.",
        ],
        edgeCases: ["__doc__", "colapsar espacios"],
        tests: "docstring text + exact line a b",
        feedback: "__doc__ es el contrato legible por help() y por el revisor del PR.",
        starterCode: {
          language: 'python',
          title: "doc_strip_collapse.py",
          code: `# CASO-LIM-005 · docstring vs comentario (helper de normalizadores)
# DEFECT: docstring es # comentario; __doc__ queda None
def strip_collapse(s):
    # Colapsa espacios extremos y dobles en un campo de texto.
    return ' '.join(s.strip().split())
print(strip_collapse.__doc__)
print(strip_collapse('  a  b '))`,
        },
        solutionCode: {
          language: 'python',
          title: "doc_strip_collapse.py",
          code: `def strip_collapse(s):
    """Colapsa espacios extremos y dobles en un campo de texto."""
    return ' '.join(s.strip().split())
print(strip_collapse.__doc__)
print(strip_collapse('  a  b '))`,
          output: `Colapsa espacios extremos y dobles en un campo de texto.
a b`,
        },
      },
      {
        id: "S05-T2-A-E2",
        subtopicId: "S05-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. `normalize_email` con pre/post en docstring: strip+lower; **ValueError si no hay @** (contrato de gate). Prueba OK (`  A@B.COM `) y error (`x`). Pasa: `a@b.com` y una línea `err ...`.",
        hint: "if '@' not in s: raise ValueError",
        hints: [
          "if '@' not in s: raise ValueError",
          "Mensaje accionable en español (p. ej. 'email sin @').",
        ],
        edgeCases: ["ValueError dominio"],
        tests: "a@b.com + err",
        feedback: "Pre/post en docstring + raise alineados al gate.",
        starterCode: {
          language: 'python',
          title: "email_prepost.py",
          code: `# CASO-LIM-005 · pre/post email (política de gate)
# DEFECT: no lower; no valida @
def normalize_email(raw: str) -> str:
    """Pre: str. Post: lower/strip con @."""
    return raw.strip()
print(normalize_email('  A@B.COM '))
try:
    normalize_email('x')
except ValueError as e:
    print('err', e)`,
        },
        solutionCode: {
          language: 'python',
          title: "email_prepost.py",
          code: `def normalize_email(raw: str) -> str:
    """Pre: str. Post: lower/strip con @. Raises ValueError."""
    s = raw.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
print(normalize_email('  A@B.COM '))
try:
    normalize_email('x')
except ValueError as e:
    print('err', e)`,
          output: `a@b.com
err email sin @`,
        },
      },
      {
        id: "S05-T2-A-E3",
        subtopicId: "S05-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Documenta y escribe `normalize_nombre` con post: sin extremos ni dobles espacios **y** title-case por palabra. Assert de la post en un ejemplo. Pasa: `Ana María` y `post OK`.",
        hint: "assert result == result.strip() and '  ' not in result",
        hints: [
          "assert result == result.strip() and '  ' not in result",
          "Aplica .title() tras colapsar; la post se chequea en tests.",
        ],
        edgeCases: ["postcondición testeable", "title-case"],
        tests: "Ana María + post OK",
        feedback: "Contrato + assert de ejemplo = especificación viva.",
        starterCode: {
          language: 'python',
          title: "post_nombre.py",
          code: `# CASO-LIM-005 · postcondición nombre (colapsa + title)
# DEFECT: solo strip; deja dobles espacios (rompe post)
def normalize_nombre(raw: str) -> str:
    """Post: sin extremos ni dobles espacios; title-case por palabra."""
    return raw.strip()
r = normalize_nombre('  Ana  María  ')
print(r)
assert r == 'Ana María'
assert r == r.strip() and '  ' not in r
print('post OK')`,
        },
        solutionCode: {
          language: 'python',
          title: "post_nombre.py",
          code: `def normalize_nombre(raw: str) -> str:
    """Post: sin extremos ni dobles espacios; title-case por palabra."""
    return ' '.join(raw.strip().split()).title()
r = normalize_nombre('  Ana  María  ')
print(r)
assert r == 'Ana María'
assert r == r.strip() and '  ' not in r
print('post OK')`,
          output: `Ana María
post OK`,
        },
      },
      {
        id: "S05-T2-B-E1",
        subtopicId: "S05-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. Mismo hábito de hints que usarás en `normalize_*`: anota `def len_campo_raw(s: str) -> int` (longitud del raw **antes** de normalizar), retorna `len(s)` (int real, no str) y demuestra que el hint **no** valida en runtime. Imprime el resultado y la línea exacta `hint no valida en runtime`. Pasa: `3` y esa nota.",
        hint: "hints no ejecutan isinstance mágicamente",
        hints: [
          "hints no ejecutan isinstance mágicamente",
          "Imprime exactamente: hint no valida en runtime",
        ],
        edgeCases: ["hints graduales", "raw antes de normalize"],
        tests: "3 + hint no valida en runtime",
        feedback: "Hints son contrato para humanos y typecheckers; no sustituyen validación de dominio.",
        starterCode: {
          language: 'python',
          title: "hint_len_raw.py",
          code: `# CASO-LIM-005 · type hints en helper de intake
# DEFECT: no imprime nota; retorna str en vez de int
def len_campo_raw(s: str) -> int:
    return str(len(s))
print(len_campo_raw('abc'))`,
        },
        solutionCode: {
          language: 'python',
          title: "hint_len_raw.py",
          code: `def len_campo_raw(s: str) -> int:
    return len(s)
print(len_campo_raw('abc'))
print('hint no valida en runtime')`,
          output: `3
hint no valida en runtime`,
        },
      },
      {
        id: "S05-T2-B-E2",
        subtopicId: "S05-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. `parse_monto(raw: str) -> tuple` (ok, value, err). Acepta enteros >=0; error de dominio si negativo o no int. Recorre `0`, `10`, `-1`, `x`. Pasa: cuatro líneas de resultado.",
        hint: "try int; if n<0 dominio",
        hints: [
          "try int; if n<0 dominio",
          "0 es válido.",
        ],
        edgeCases: ["0 válido", "negativo dominio"],
        tests: "four lines for 0 / 10 / -1 / x",
        feedback: "Separar ValueError de parse vs regla de dominio.",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `# CASO-LIM-005 · parse_monto dominio
# DEFECT: acepta negativos; no distingue no-entero
from typing import Optional, Tuple

def parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    n = int(raw)
    return True, n, None
for v in ['0', '10', '-1', 'x']:
    print(v, parse_monto(v))`,
        },
        solutionCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `from typing import Optional, Tuple

def parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    try:
        n = int(raw.strip())
    except ValueError:
        return False, None, 'no es entero'
    if n < 0:
        return False, None, 'negativo no permitido'
    return True, n, None
for v in ['0', '10', '-1', 'x']:
    print(v, parse_monto(v))`,
          output: `0 (True, 0, None)
10 (True, 10, None)
-1 (False, None, 'negativo no permitido')
x (False, None, 'no es entero')`,
        },
      },
      {
        id: "S05-T2-B-E3",
        subtopicId: "S05-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Implementa `normalize_email` con **raise ValueError** si falta `@` (contrato de gate) y documenta la estrategia en un print. En el borde del lote, captura por fila (`ok@ex.com`, `malo`) sin abortar todo. Pasa: `OK ok@ex.com` y `SKIP malo ...`.",
        hint: "Lote: try/except por fila para no abortar todo",
        hints: [
          "Lote: try/except por fila para no abortar todo",
          "Una fila mala no impide la buena",
        ],
        edgeCases: ["borde I/O vs core"],
        tests: "OK + SKIP",
        feedback: "Core estricto + borde tolerante es un diseño limpio.",
        starterCode: {
          language: 'python',
          title: "raise_vs_tuple.py",
          code: `# CASO-LIM-005 · raise + borde tolerante
# DEFECT: no raise; lote se traga filas malas sin SKIP
def normalize_email(raw: str) -> str:
    return raw.strip().lower()
print('estrategia: ???')
for e in ['ok@ex.com', 'malo']:
    print('OK', normalize_email(e))`,
        },
        solutionCode: {
          language: 'python',
          title: "raise_vs_tuple.py",
          code: `def normalize_email(raw: str) -> str:
    s = raw.strip().lower()
    if '@' not in s:
        raise ValueError('email inválido')
    return s
print('estrategia: raise + try por fila en el borde')
for e in ['ok@ex.com', 'malo']:
    try:
        print('OK', normalize_email(e))
    except ValueError as err:
        print('SKIP', e, err)`,
          output: `estrategia: raise + try por fila en el borde
OK ok@ex.com
SKIP malo email inválido`,
        },
      },
      {
        id: "S05-T3-A-E1",
        subtopicId: "S05-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. Extrae `strip_collapse` (colapsa espacios) y úsalo dentro de `normalize_nombre`, que además aplica `.title()` (política de nombre del gate). No reimplementes strip dentro del normalizador. Pasa: línea exacta `Ana María`.",
        hint: "def strip_collapse; return strip_collapse(raw).title()",
        hints: [
          "def strip_collapse; return strip_collapse(raw).title()",
          "Composición de dos pasos: colapsar y luego title.",
        ],
        edgeCases: ["title after collapse"],
        tests: "exact line Ana María",
        feedback: "Piezas pequeñas se testean solas.",
        starterCode: {
          language: 'python',
          title: "extract_strip.py",
          code: `# CASO-LIM-005 · extract strip_collapse
# DEFECT: no extrae helper; title sin colapsar espacios
def strip_collapse(s):
    return s
def normalize_nombre(raw):
    return raw.strip().title()
print(normalize_nombre('  ana  maría '))`,
        },
        solutionCode: {
          language: 'python',
          title: "extract_strip.py",
          code: `def strip_collapse(s):
    return ' '.join(s.strip().split())
def normalize_nombre(raw):
    return strip_collapse(raw).title()
print(normalize_nombre('  ana  maría '))`,
          output: `Ana María`,
        },
      },
      {
        id: "S05-T3-A-E2",
        subtopicId: "S05-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. Orquestador `normalize_contact(nombre, email)` devuelve dict **solo** llamando helpers: nombre con colapsa+title; email strip+lower con **ValueError si falta @**. Pasa: `{'nombre': 'Luis', 'email': 'l@e.com'}`.",
        hint: "return {'nombre': norm_n(...), 'email': norm_e(...)}",
        hints: [
          "return {'nombre': norm_n(...), 'email': norm_e(...)}",
          "norm_e: strip+lower y raise si falta @ (mismo contrato del gate).",
        ],
        edgeCases: ["dict orquestado", "email con @"],
        tests: "Luis + l@e.com",
        feedback: "El orquestador no reimplementa reglas.",
        starterCode: {
          language: 'python',
          title: "orch_contact.py",
          code: `# CASO-LIM-005 · orquestador delgado
# DEFECT: reimplementa reglas; no llama helpers
def norm_n(s):
    return ' '.join(s.strip().split()).title()
def norm_e(s):
    s = s.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
def normalize_contact(nombre, email):
    return {'nombre': nombre.strip(), 'email': email}
print(normalize_contact('  luis ', '  L@E.COM '))`,
        },
        solutionCode: {
          language: 'python',
          title: "orch_contact.py",
          code: `def norm_n(s):
    return ' '.join(s.strip().split()).title()
def norm_e(s):
    s = s.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
def normalize_contact(nombre, email):
    return {'nombre': norm_n(nombre), 'email': norm_e(email)}
print(normalize_contact('  luis ', '  L@E.COM '))`,
          output: `{'nombre': 'Luis', 'email': 'l@e.com'}`,
        },
      },
      {
        id: "S05-T3-A-E3",
        subtopicId: "S05-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. El starter es un **monstruo** con tres políticas inline (nombre title, email con @, tel dígitos). Descompón en 3 funciones + orquestador delgado. Misma salida. Pasa: dict con `nombre`/`email`/`tel` normalizados.",
        hint: "Cada campo = una función; el orquestador solo llama",
        hints: [
          "Cada campo = una función; el orquestador solo llama",
          "Salida dict con 3 claves; no dejes reglas en el monstruo",
        ],
        edgeCases: ["descomposición"],
        tests: "3 keys normalizadas",
        feedback: "Si el monstruo vuelve, el PR se rechaza en code review.",
        starterCode: {
          language: 'python',
          title: "split_monster.py",
          code: `# CASO-LIM-005 · monstruo a descomponer
# DEFECT: tres políticas inline en un solo def (descompón)
def normalize_all(n, e, t):
    # monstruo: reglas de nombre, email y tel mezcladas
    nombre = ' '.join(n.strip().split()).title()
    email = e.strip().lower()
    if '@' not in email:
        raise ValueError('email sin @')
    tel = ''.join(c for c in t if c.isdigit())
    return {'nombre': nombre, 'email': email, 'tel': tel}
print(normalize_all('  Ana ', 'A@B.COM', '999-1'))`,
        },
        solutionCode: {
          language: 'python',
          title: "split_monster.py",
          code: `def n_nombre(n):
    return ' '.join(n.strip().split()).title()
def n_email(e):
    s = e.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
def n_tel(t):
    return ''.join(c for c in t if c.isdigit())
def normalize_all(n, e, t):
    return {'nombre': n_nombre(n), 'email': n_email(e), 'tel': n_tel(t)}
print(normalize_all('  Ana ', 'A@B.COM', '999-1'))`,
          output: `{'nombre': 'Ana', 'email': 'a@b.com', 'tel': '9991'}`,
        },
      },
      {
        id: "S05-T3-B-E1",
        subtopicId: "S05-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. Escribe `normalize_tel` **puro** (solo dígitos; sin print ni I/O internos). Con `x='999-000'`, calcula `once = f(x)` y demuestra `f(once)==once`. Pasa: línea exacta `999000 True` (valor canónico + flag de idempotencia).",
        hint: "once = f(x); twice = f(once); print once==twice",
        hints: [
          "once = f(x); twice = f(once); print once==twice",
          "Sin print dentro de normalize_tel; el print va en el caller.",
        ],
        edgeCases: ["idempotencia"],
        tests: "exact line 999000 True",
        feedback: "Idempotencia es el test mínimo del gate.",
        starterCode: {
          language: 'python',
          title: "pure_tel.py",
          code: `# CASO-LIM-005 · pureza + idempotencia
# DEFECT: deja guiones; f(f(x)) puede fallar si se re-strip mal
def normalize_tel(raw):
    return raw.replace(' ', '')
x = '999-000'
once = normalize_tel(x)
print(once, normalize_tel(once) == once)`,
        },
        solutionCode: {
          language: 'python',
          title: "pure_tel.py",
          code: `def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
x = '999-000'
once = normalize_tel(x)
print(once, normalize_tel(once) == once)`,
          output: `999000 True`,
        },
      },
      {
        id: "S05-T3-B-E2",
        subtopicId: "S05-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. Separa: `normalize_email` **puro** (strip+lower; raise si falta `@`) + `print_report` con el print al borde. No imprimas dentro del normalizador. Pasa: `email= z@w.com`.",
        hint: "print solo en print_report",
        hints: [
          "print solo en print_report",
          "Core testeable sin capturar stdout; valida @ en el pure core.",
        ],
        edgeCases: ["efecto al borde"],
        tests: "email= z@w.com",
        feedback: "Efectos al borde, pureza al centro.",
        starterCode: {
          language: 'python',
          title: "io_borde.py",
          code: `# CASO-LIM-005 · I/O al borde
# DEFECT: print dentro del normalizador "puro"
def normalize_email(raw):
    s = raw.strip().lower()
    print('email=', s)
    return s
def print_report(raw):
    normalize_email(raw)
print_report('  Z@W.COM ')`,
        },
        solutionCode: {
          language: 'python',
          title: "io_borde.py",
          code: `def normalize_email(raw):
    s = raw.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
def print_report(raw):
    print('email=', normalize_email(raw))
print_report('  Z@W.COM ')`,
          output: `email= z@w.com`,
        },
      },
      {
        id: "S05-T3-B-E3",
        subtopicId: "S05-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Inyecta un normalizador: `process(line, norm=normalize_tel)` debe usar la fn inyectada. Llama con default (dígitos) y con un norm que hace upper+strip. Pasa: `999` y `999-A`.",
        hint: "norm es parámetro con default",
        hints: [
          "norm es parámetro con default",
          "Demuestra dos comportamientos",
        ],
        edgeCases: ["inyección de dependencia simple"],
        tests: "999 y 999-A",
        feedback: "Inyectar la fn permite tests con fakes sin monkeypatch.",
        starterCode: {
          language: 'python',
          title: "inject_norm.py",
          code: `# CASO-LIM-005 · inyección de normalizador
# DEFECT: ignora norm inyectado; siempre digits
def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
def process(line, norm=normalize_tel):
    return normalize_tel(line)
print(process(' 999-a '))
print(process(' 999-a ', norm=lambda s: s.strip().upper()))`,
        },
        solutionCode: {
          language: 'python',
          title: "inject_norm.py",
          code: `def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
def process(line, norm=normalize_tel):
    return norm(line)
print(process(' 999-a '))
print(process(' 999-a ', norm=lambda s: s.strip().upper()))`,
          output: `999
999-A`,
        },
      },
      {
        id: "S05-T4-A-E1",
        subtopicId: "S05-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. Predice LEGB: global `x=1`; dentro de `f` asigna `x=2` (local, no muta el global). Imprime `in 2` **dentro** de `f` y `out 1` fuera tras llamar. Pasa: líneas exactas `in 2` y `out 1`.",
        hint: "Local no pisa global sin global keyword",
        hints: [
          "Local no pisa global sin global keyword",
          "Fuera sigue 1",
        ],
        edgeCases: ["local vs global"],
        tests: "in 2 out 1",
        feedback: "Asignar dentro crea local; el global no cambia.",
        starterCode: {
          language: 'python',
          title: "legb_local.py",
          code: `# CASO-LIM-005 · LEGB local vs global
# DEFECT: no imprime dentro; asume que f muta global x
x = 1
def f():
    x = 2
f()
print('in', x)
print('out', x)`,
        },
        solutionCode: {
          language: 'python',
          title: "legb_local.py",
          code: `x = 1
def f():
    x = 2
    print('in', x)
f()
print('out', x)`,
          output: `in 2
out 1`,
        },
      },
      {
        id: "S05-T4-A-E2",
        subtopicId: "S05-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. `make_multiplier(k)` es una factory (mismo patrón que `make_phone_normalizer`): devuelve una función que multiplica por `k` del enclosing scope. Crea `m3` y `m10`; imprime `m3(4)` y `m10(4)` en una línea. Pasa: `12 40`.",
        hint: "def inner(n): return n*k; return inner",
        hints: [
          "def inner(n): return n*k; return inner",
          "print(m3(4), m10(4))",
        ],
        edgeCases: ["closure"],
        tests: "exact line 12 40",
        feedback: "Factories por closure evitan clases prematuras.",
        starterCode: {
          language: 'python',
          title: "closure_mul.py",
          code: `# CASO-LIM-005 · closure multiplier
# DEFECT: inner ignora k del enclosing; multiplica por 1
def make_multiplier(k):
    def inner(n):
        return n * 1
    return inner
m3 = make_multiplier(3)
m10 = make_multiplier(10)
print(m3(4), m10(4))`,
        },
        solutionCode: {
          language: 'python',
          title: "closure_mul.py",
          code: `def make_multiplier(k):
    def inner(n):
        return n * k
    return inner
m3 = make_multiplier(3)
m10 = make_multiplier(10)
print(m3(4), m10(4))`,
          output: `12 40`,
        },
      },
      {
        id: "S05-T4-A-E3",
        subtopicId: "S05-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Factory `make_normalizer(mode)` con mode `'digits'` o `'lower'` devuelve la fn adecuada **sin** variable global. Con `d('A-1-B-2')` y `lo('  Hola ')` imprime en una línea. Pasa: exacto `12 hola`.",
        hint: "if mode=='digits': return lambda o def digits...",
        hints: [
          "if mode=='digits': return lambda o def digits...",
          "Sin global mode; cada factory cierra su política.",
        ],
        edgeCases: ["factory multipolítica"],
        tests: "exact line 12 hola",
        feedback: "Config en el enclosing, no en global mutable.",
        starterCode: {
          language: 'python',
          title: "factory_norm.py",
          code: `# CASO-LIM-005 · factory multipolítica
# DEFECT: siempre lower; ignora mode digits
def make_normalizer(mode):
    def norm(raw):
        return raw.strip().lower()
    return norm
d = make_normalizer('digits')
lo = make_normalizer('lower')
print(d('A-1-B-2'), lo('  Hola '))`,
        },
        solutionCode: {
          language: 'python',
          title: "factory_norm.py",
          code: `def make_normalizer(mode):
    if mode == 'digits':
        def norm(raw):
            return ''.join(c for c in raw if c.isdigit())
        return norm
    if mode == 'lower':
        def norm(raw):
            return raw.strip().lower()
        return norm
    raise ValueError('mode')
d = make_normalizer('digits')
lo = make_normalizer('lower')
print(d('A-1-B-2'), lo('  Hola '))`,
          output: `12 hola`,
        },
      },
      {
        id: "S05-T4-B-E1",
        subtopicId: "S05-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — CASO-LIM-005. Escribe 2 asserts de ejemplo para `normalize_email` (strip+lower + validar `@`; contrato de gate) e imprime `OK`. Incluye idempotencia. Pasa: línea exacta `OK`.",
        hint: "assert normalize_email('A@B.COM')=='a@b.com'",
        hints: [
          "assert normalize_email('A@B.COM')=='a@b.com'",
          "Incluye idempotencia: f(f(x)) == f(x)",
        ],
        edgeCases: ["assert ejemplos"],
        tests: "exact line OK",
        feedback: "Ejemplos primero, implementación después.",
        starterCode: {
          language: 'python',
          title: "examples_email.py",
          code: `# CASO-LIM-005 · asserts de ejemplo (contrato gate email)
# DEFECT: expected con mayúsculas; asserts fallan o se omiten
def normalize_email(s):
    s = s.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
# asserts omitidos / expected incorrecto
print(normalize_email('  A@B.COM '))`,
        },
        solutionCode: {
          language: 'python',
          title: "examples_email.py",
          code: `def normalize_email(s):
    s = s.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
assert normalize_email('  A@B.COM ') == 'a@b.com'
assert normalize_email(normalize_email('A@B.COM')) == 'a@b.com'
print('OK')`,
          output: `OK`,
        },
      },
      {
        id: "S05-T4-B-E2",
        subtopicId: "S05-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — CASO-LIM-005. Refactoriza `normalize_dir` a dos pasos (`strip_collapse` + `upper`) **sin** cambiar la política upper. Los asserts de `AV 1` e idempotencia deben seguir verdes. Pasa: línea final `JR 2`.",
        hint: "Corre asserts antes y después mentalmente",
        hints: [
          "Corre asserts antes y después mentalmente",
          "Misma salida",
        ],
        edgeCases: ["refactor preserva conducta"],
        tests: "AV 1 / JR 2",
        feedback: "Verde-refactor-verde es el hábito profesional.",
        starterCode: {
          language: 'python',
          title: "refactor_dir.py",
          code: `# CASO-LIM-005 · refactor preserva conducta
# DEFECT: segunda definición usa lower (rompe política upper)
def normalize_dir(raw):
    return ' '.join(raw.strip().split()).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
assert normalize_dir(normalize_dir('x')) == normalize_dir('x')
def normalize_dir(raw):
    return ' '.join(raw.strip().split()).lower()
assert normalize_dir('  av 1 ') == 'AV 1'
print(normalize_dir(' jr 2 '))`,
        },
        solutionCode: {
          language: 'python',
          title: "refactor_dir.py",
          code: `def normalize_dir(raw):
    return ' '.join(raw.strip().split()).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
assert normalize_dir(normalize_dir('x')) == normalize_dir('x')
def strip_collapse(s):
    return ' '.join(s.strip().split())
def normalize_dir(raw):
    return strip_collapse(raw).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
print(normalize_dir(' jr 2 '))`,
          output: `JR 2`,
        },
      },
      {
        id: "S05-T4-B-E3",
        subtopicId: "S05-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — CASO-LIM-005. Suite mínima: lista de `(input, expected)` para `normalize_nombre` con política **colapsa + title**; loop `assert`. Si cambias la implementación, actualiza expected solo si cambias la política conscientemente — aquí la política es la del gate. Pasa: líneas `PASS ...` y `all PASS`.",
        hint: "No cambies política sin actualizar tests",
        hints: [
          "No cambies política sin actualizar tests",
          "Expected con title: '  a  b ' → 'A B'; 'X' → 'X'",
        ],
        edgeCases: ["tabla de casos", "title-case"],
        tests: "PASS lines + all PASS",
        feedback: "Tabla de casos = contrato ejecutable del normalizador.",
        starterCode: {
          language: 'python',
          title: "suite_nombre.py",
          code: `# CASO-LIM-005 · suite tabla de casos (colapsa + title)
# DEFECT: no recorre cases; declara PASS a ciegas
def normalize_nombre(raw):
    return ' '.join(raw.strip().split()).title()
cases = [('  a  b ', 'A B'), ('X', 'X')]
print('all PASS')`,
        },
        solutionCode: {
          language: 'python',
          title: "suite_nombre.py",
          code: `def normalize_nombre(raw):
    return ' '.join(raw.strip().split()).title()
cases = [('  a  b ', 'A B'), ('X', 'X')]
for inp, exp in cases:
    got = normalize_nombre(inp)
    assert got == exp, (inp, got, exp)
    print('PASS', inp, '→', got)
print('all PASS')`,
          output: `PASS   a  b  → A B
PASS X → X
all PASS`,
        },
      },
    ],
  },
  youDo: {
    title: "Normalizadores puros (inicio CP-N1-B)",
    context:
      "Inicias **CP-N1-B** con el núcleo reutilizable: `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` como funciones **puras**, con docstring, hints graduales e **idempotencia** demostrada. Sin pathlib CSV todavía (S08) y sin clases de dominio (S11). Solo datos sintéticos.",
    objectives: [
      "Implementar 4 normalizadores puros + orquestador normalize_record",
      "Demostrar idempotencia f(f(x))==f(x) en cada uno",
      "Docstrings con pre/post; ValueError o política explícita en email",
      "Sin I/O ni prints dentro del core",
      "Suite de ejemplos/asserts ejecutable en __main__",
    ],
    requirements: [
      "normalize_nombre colapsa espacios y aplica title de palabras",
      "normalize_email: strip+lower; error si no hay @",
      "normalize_telefono: solo dígitos (política de demo)",
      "normalize_direccion: colapsa + upper determinista",
      "is_idempotent helper o asserts equivalentes",
      "Datos sintéticos; sin PII real",
    ],
    starterCode: `"""normalizers_pure.py — inicio CP-N1-B (S05)
Normalizadores puros de nombre, email, teléfono y dirección.
Idempotencia demostrada. Sin I/O en el core.
Datos sintéticos únicamente.
"""

from typing import Callable


def normalize_nombre(raw: str) -> str:
    """Colapsa espacios; title-case de palabras.
    Pre: str. Post: sin extremos ni dobles espacios; title por palabra.
    """
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def normalize_email(raw: str) -> str:
    """strip + lower. ValueError si falta @.
    """
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def normalize_telefono(raw: str) -> str:
    """Solo dígitos (política PE sintética de demo).
    """
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def normalize_direccion(raw: str) -> str:
    """Colapsa espacios; upper para demo determinista.
    """
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def normalize_record(nombres: str, email: str, telefono: str, direccion: str) -> dict:
    """Orquestador delgado — solo llama normalizadores puros."""
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def is_idempotent(fn: Callable[[str], str], sample: str) -> bool:
    once = fn(sample)
    return fn(once) == once


def _run_tests() -> None:
    assert normalize_nombre("  maría  josé ") == "María José"
    assert is_idempotent(normalize_nombre, "  ana  ")
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert is_idempotent(normalize_email, "A@B.COM")
    assert normalize_telefono("999-000-111") == "999000111"
    assert is_idempotent(normalize_telefono, "999-000-111")
    assert normalize_direccion("  av. larco 100 ") == "AV. LARCO 100"
    r = normalize_record("  luis ", "L@E.COM", "(999)111222", " jr unión 1 ")
    assert set(r) >= {"nombres", "email", "telefono", "direccion"}
    print("tests OK")


def main() -> None:
    print(normalize_record(
        "  Ana  Pérez ",
        "  Ana.Perez@Example.COM ",
        "999-000-111",
        "  Av. Larco 123 ",
    ))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Documenta en español la política de cada normalizador y pega la salida de la suite. Menciona que la I/O de archivos llegará en S08; aquí solo el core puro.",
    rubric: [
      { criterion: "Cuatro normalizadores correctos", weight: "25%" },
      { criterion: "Idempotencia demostrada", weight: "25%" },
      { criterion: "Pureza (sin I/O en core)", weight: "20%" },
      { criterion: "Docstrings / hints / errores de dominio", weight: "15%" },
      { criterion: "Orquestador delgado + tests", weight: "10%" },
      { criterion: "Documentación en español", weight: "5%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Si una función no tiene return, ¿qué devuelve la llamada?",
        options: ["None", "0", "False", "Error siempre"],
        correctIndex: 0,
        explanation:
          "Python inserta return None implícito.",
      },
      {
        question: "¿Por qué `def f(xs=[])` es peligroso?",
        options: ["Python no permite defaults", "Solo falla con type hints", "El default mutable se comparte entre llamadas", "Convierte xs en tupla"],
        correctIndex: 2,
        explanation:
          "El objeto default se crea una vez; appends se acumulan entre llamadas.",
      },
      {
        question: "Una función pura…",
        options: ["Siempre imprime el resultado", "Lee un archivo de config global", "Solo puede usarse en clases", "Mismo input → mismo output, sin efectos colaterales"],
        correctIndex: 3,
        explanation:
          "Pureza = determinismo + sin side effects; ideal para normalizadores.",
      },
      {
        question: "LEGB significa…",
        options: ["List, Else, Generator, Break", "Local, Enclosing, Global, Builtin", "Loop, Eval, Global, Binary", "Lambda, Except, Goto, Block"],
        correctIndex: 1,
        explanation:
          "Orden de resolución de nombres en Python.",
      },
      {
        question: "Idempotencia de un normalizador f significa…",
        options: ["f(f(x)) == f(x) para entradas del dominio", "f se ejecuta solo una vez en la vida del proceso", "f no puede tener defaults", "f siempre lanza ValueError"],
        correctIndex: 0,
        explanation:
          "Reaplicar la normalización no cambia el valor ya canónico.",
      },
      {
        question: "¿Qué diferencia un docstring de un comentario `#` justo bajo `def`?",
        options: ["Ninguna: ambos rellenan __doc__", "El comentario # se ejecuta en runtime", "Solo el docstring queda en __doc__ y es el contrato legible por help()/herramientas", "El docstring prohíbe usar return"],
        correctIndex: 2,
        explanation:
          "El docstring (triples comillas bajo def) se guarda en __doc__; un # no es contrato de la función.",
      },
      {
        question: "En `def normalize_telefono(raw, *, digits_only=True)`, el `*` obliga a…",
        options: ["Que raw sea keyword-only", "Que la función sea pura automáticamente", "Crear un default mutable", "Pasar digits_only solo como keyword (digits_only=...)"],
        correctIndex: 3,
        explanation:
          "Tras el *, los parámetros son keyword-only: hay que llamar con nombre, no por posición.",
      },
      {
        question: "Un orquestador delgado como `normalize_record`…",
        options: ["Reimplementa strip/lower/title en cada campo para no depender de helpers", "Llama a normalizadores pequeños y arma el dict sin I/O en el núcleo", "Debe abrir el CSV y escribir el resultado en disco", "Solo puede existir dentro de una clase"],
        correctIndex: 1,
        explanation:
          "Composición: el orquestador delega políticas a funciones puras y no toca filesystem.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python Tutorial — Defining Functions",
        url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
        note: "def, defaults, return",
      },
      {
        label: "PEP 257 — Docstring Conventions",
        url: "https://peps.python.org/pep-0257/",
        note: "Estilo de documentación de contrato",
      },
      {
        label: "typing — Support for type hints",
        url: "https://docs.python.org/3/library/typing.html",
        note: "Optional, Tuple y hints graduales",
      },
      {
        label: "Python scopes and namespaces (LEGB)",
        url: "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces",
        note: "Scopes y namespaces",
      },
      {
        label: "PEP 8 — Function names",
        url: "https://peps.python.org/pep-0008/#function-and-variable-names",
        note: "snake_case y verbos de acción",
      },
      {
        label: "Python for Everybody — functions",
        url: "https://www.py4e.com/html3/04-functions",
        note: "Progressive disclosure de def/return",
      },
    ],
    books: [
      {
        label: "Python Crash Course (Matthes)",
        note: "Funciones y módulos introductorios; aplicar a normalizadores del curso.",
      },
      {
        label: "Fluent Python (Ramalho)",
        note: "Profundidad en funciones de primera clase; consulta selectiva post-S05.",
      },
    ],
    courses: [
      {
        label: "CS50P — Functions",
        url: "https://cs50.harvard.edu/python/",
        note: "Diseño de funciones; no copiar problem sets con PII.",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Abstracción y contratos",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Funciones e I/O al borde",
      },
      {
        label: "Kaggle Learn — Python",
        url: "https://www.kaggle.com/learn/python",
        note: "Micro-práctica de funciones",
      },
    ],
  },
}
