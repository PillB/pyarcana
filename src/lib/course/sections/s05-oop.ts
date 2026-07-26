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
    "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos. En bancos, fintech y retail en Perú, un normalizador no idempotente —o con un default mutable, o con `print` en el núcleo— puede contaminar un ETL sin una excepción visible y dificulta sus pruebas unitarias (inicio **CP-N1-B**). Aquí construyes un núcleo puro y reutilizable; más adelante lo empaquetas en una CLI y lo modelas con clases de dominio cuando el contrato ya sea confiable.",
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
        "**Diccionario de la sección** (léelo antes de T1):\n\n- **Función (`def`)**: bloque reutilizable con nombre de verbo.\n- **`return`**: entrega un valor a quien llama (sin `return` → `None`).\n- **Contrato**: precondiciones + postcondiciones documentadas (docstring) y alineadas al código.\n- **Default seguro**: no uses lista/dict mutable como valor por defecto.\n- **Función pura**: mismo input → mismo output, sin I/O ni `print`s.\n- **Idempotencia**: `f(f(x)) == f(x)` en el caso feliz.\n- **Orquestador delgado**: combina normalizadores sin reimplementar reglas.\n- **LEGB**: orden Local → Enclosing → Global → Builtin.\n- **Keyword-only**: parámetros tras `*` que obligan `nombre=` en la llamada.",
        "El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético **sin** tocar disco ni red. La I/O se inyecta o se deja en el borde. Datos ficticios únicamente (`example.com`); **nunca** PII real. Caso de lab: inicio **CP-N1-B**.",
        "**Políticas canónicas del gate** (no cambian a mitad de sección):\n\n- `normalize_nombre`: colapsa espacios + **title-case por palabra**.\n- `normalize_email`: `strip` + `lower` y `ValueError` si falta `@`.\n- `normalize_telefono`: solo dígitos (demo).\n- `normalize_direccion`: colapsa + `upper`.\n\nCada normalizador debe ser **idempotente** en el caso feliz: `f(f(x)) == f(x)`.",
        "Estas políticas son deliberadamente pequeñas para practicar contratos. `.title()` **no** representa todos los nombres reales y comprobar que exista `@` **no** valida una dirección de correo completa: son reglas del laboratorio, no afirmaciones sobre identidad ni validadores listos para producción. En S07 ampliarás el tratamiento de texto y Unicode. Aquí importa que cada regla sea explícita, medible y consistente de principio a fin.",
        "Orden pedagógico:\n\n- **T1 Funciones**: `def`/`return` → params/defaults.\n- **T2 Contratos**: pre/post/docstrings → hints y errores de dominio.\n- **T3 Diseño**: funciones pequeñas → pureza/I/O.\n- **T4 Alcance**: LEGB/closures → tests y refactor.\n\nEn cada subtema: teoría, un demo I Do y tres prácticas We Do (guiada, independiente, transferencia). Más adelante empaquetarás esto en CLI y modelarás registros con clases de dominio. Hoy el objetivo es el **núcleo puro** que un ETL junior puede testear sin abrir archivos.",
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
        "Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, `normalize_nombre`, ya usa la política del gate: colapsar espacios y **title-case** por palabra — la misma que exige el bloque **Tú haces**.",
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
        "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los **keyword arguments** tras los posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap `nombre, email` es un incidente de calidad de datos.",
        "Para normalizadores: `def normalize_telefono(raw, *, country=\"PE\")` con **keyword-only** documenta la política regional sin confundir posiciones. El `*` fuerza `country=` en la llamada; no puedes pasar el país como segundo posicional por error. En un ETL de fintech en Perú, ese flag explícito evita que un junior invierta `raw` y `country` y “normalice” un teléfono con el código de país equivocado.",
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
        "En el intake sintético: pre = tipo `str`; post = forma canónica o `ValueError` de dominio. La política mínima de email del laboratorio es **strip+lower y raise si falta `@`** — la misma en demos, **Hacemos juntos** y **Tú haces**. Esta regla detecta un fallo básico, pero no demuestra que la dirección exista ni que sea válida según todos los estándares. Si docstring y código discrepan, el revisor devuelve el PR.",
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
        raise ValueError("email sin @ (gate mínimo)")
    return s

print(normalize_email("  Ana.Perez@Example.COM "))
try:
    normalize_email("sin-arroba")
except ValueError as e:
    print("err:", e)`,
        output: `ana.perez@example.com
err: email sin @ (gate mínimo)`,
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
        "`Optional[str]` / `str | None` documenta ausencia legítima (campo opcional del intake, no un bug). **No** uses hints falsos (`-> str` si puedes devolver `None` por olvido de return). Un hint que miente es peor que no anotar: el revisor y el typechecker confían en él, y un junior copiará la mentira en el siguiente normalizador del pipeline.",
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
          "Usa `raise` para API internas puras; devuelve tupla u objeto de resultado cuando el lote no debe abortar en la primera fila mala.",
      },
    },
    {
      heading: "Funciones pequeñas y composición",
      subtopicId: "S05-T3-A",
      paragraphs: [
        "Una función debe hacer **una cosa** en el nivel de abstracción correcto. Si normalizas nombre y además escribes archivo y logueas, **sepáralas**. **Componer** es llamar funciones pequeñas desde una orquestadora delgada que no reimplementa reglas de negocio.",
        "Beneficio: tests unitarios fáciles, reuso en CLI (S10) y en ETL (S08). El orquestador `normalize_record` llama a cuatro normalizadores y arma el dict **sin** I/O en el núcleo. En un banco o fintech en Perú, ese dict limpio alimenta el pipeline: si el orquestador reimplementa strip, cada fix se multiplica por cuatro y el code review se vuelve un laberinto.",
        "Regla práctica: si necesitas un comentario de sección en medio de la función, **probablemente es otra función**. Extrae y nombra el verbo (`strip_collapse`, `title_case_name`). El monstruo de 40 líneas con tres políticas de campo es el antipatrón que descompondrás en el We Do E3 — y el que un revisor junior aprende a rechazar.",
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
        "La **I/O** (stdin, archivos, red) se queda en el **borde**: `main`, CLI, o funciones `load_*` / `save_*`. El core no conoce el filesystem. Cuando necesites un normalizador alternativo en un test, **inyéctalo** como argumento (ver tip). No hardcodees `open(...)` dentro del pure core ni uses un `lambda` gigante como sustituto de un `def` con nombre.",
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
          "Tras dominar pureza e idempotencia, inyecta el normalizador: `def process_line(texto, norm=normalize_telefono): return norm(texto)`. Un `lambda s: s.strip().lower()` sirve de sustituto puntual en tests; si la lógica crece, prefiere un `def` con nombre. Practícalo en el ejercicio E3 de **Hacemos juntos** de este subtema.",
      },
    },
    {
      heading: "LEGB y closures básicos",
      subtopicId: "S05-T4-A",
      paragraphs: [
        "**LEGB**: orden de búsqueda de nombres — **L**ocal, **E**nclosing (funciones anidadas), **G**lobal, **B**uiltin. Si Python no halla el nombre, `NameError`. Saber LEGB evita el clásico “¿por qué usa el `PREF` del módulo y no el mío?” cuando fabricas normalizadores con prefijo de país.",
        "Un **closure** es una función interna que recuerda variables del enclosing scope. Útil para fabricar normalizadores configurados (`make_phone_normalizer(prefix)`), **sin** clases todavía: el factory cierra la política regional y devuelve una función pura lista para componer.",
        "`global` y `nonlocal` existen, pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un antipatrón en ETL junior.",
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
    # contrato de gate: strip+lower + validar '@' (T2-A / Tú haces)
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
        preamble:
          "Antes de tocar el CSV del intake, el junior define el **núcleo puro** de nombres. Aquí solo observas: una función `normalize_nombre` recibe texto sintético sucio y **retorna** la forma canónica del gate CP-N1-B (colapsar espacios + title-case por palabra). Sigue el `for` y el `repr`: espacios extremos, dobles espacios y mayúsculas se corrigen sin `print` dentro de la función. Datos ficticios (`Ana`, `María José`, `QUISPE`); sin PII real. No escribas aún; confirma que cada flecha del output coincide con la política.",
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
        why:
          "`strip` + `split` + `join` + `title` es un solo contrato: colapsar basura de espacios y dejar cada palabra en title-case. La función **retorna** el canónico; el `print` del caller muestra el valor recibido. Si no hubiera `return`, el caller vería `None` aunque la pantalla “se viera bien” por un print interno.",
        retrospective:
          "Si puedes decir en voz alta por qué `\"QUISPE\"` → `\"Quispe\"` y por qué no se imprime dentro de `normalize_nombre`, ya tienes el hábito del normalizador puro. El error clásico es confundir “se ve bien en pantalla” con “el caller recibió un valor”. En We Do corregirás un helper que imprime y no retorna.",
      },
      {
        demoId: "S05-T1-B-DEMO",
        subtopicId: "S05-T1-B",
        environment: "browser-pyodide",
        description: "Defaults seguros vs default mutable bug",
        preamble:
          "Los defaults de Python se evalúan **una sola vez** al definir la función. En pipelines de intake, un `bucket=[]` compartido acumula basura entre filas y el bug se ve solo en el segundo o tercer registro. Observa `good` (None + lista local) frente a `bad` (lista mutable por defecto). Compara las dos líneas de salida: mismas llamadas, objetos distintos vs. compartidos. No escribas aún.",
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
        why:
          "Un default mutable es un **objeto vivo** reutilizado en cada llamada que no pasa el argumento. `None` + creación local aísla por llamada: cada `good(...)` arma su propia lista. Ese contraste es el mensaje pedagógico de la demo; no lo “arregles” mentalmente con copias del caller.",
        retrospective:
          "Si en un PR de normalización ves `def f(x, acc=[])`, es P1 de producción: el default es un objeto vivo compartido. La reparación mental es “defaults inmutables o `None` + creación local”. En We Do reescribirás el antipatrón; no lo “arregles” copiando la lista en el caller.",
      },
      {
        demoId: "S05-T2-A-DEMO",
        subtopicId: "S05-T2-A",
        environment: "browser-pyodide",
        description: "Docstring + pre/post en normalize_email",
        preamble:
          "Un normalizador de email del gate no es “solo lower”: tiene **precondiciones** (str usable), **postcondiciones** (strip+lower con `@`) y un **error de dominio** si falta `@`. Observa el docstring corto, el `raise ValueError` y el `try/except` de demo. El caso feliz y el fallo deben leerse como contrato de negocio, no como capricho de Python. Datos sintéticos (`X@Y.COM`, `x`).",
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
        why:
          "El `raise` es parte del contrato de negocio, no un adorno de Python. El docstring no sustituye al código, pero debe coincidir en pre, post y errores. Un junior que solo hace `lower` sin comprobar `@` incumple el gate mínimo; un revisor que lee el doc y ejecuta el caso `x` debe ver el mismo rechazo. Aun así, pasar este gate no demuestra que la dirección exista.",
        retrospective:
          "Si el docstring dice “exige `@`” y el código no valida, gana el código y el revisor devuelve el PR. El error clásico es documentar la política y olvidar el `raise`. En We Do convertirás un `#` en docstring real y alinearás pre/post con el cuerpo.",
      },
      {
        demoId: "S05-T2-B-DEMO",
        subtopicId: "S05-T2-B",
        environment: "browser-pyodide",
        description: "Type hints + resultado de dominio sin abortar el lote",
        preamble:
          "A veces el core no debe lanzar: el lote de teléfonos sintéticos debe **seguir** tras un valor inválido. Observa `norm_tel` con hints y retorno `(bool, Optional[str], Optional[str])`: éxito con 9 dígitos, fallo con mensaje, y guiones que se limpian. Los hints documentan la forma; no validan en runtime. Sigue las tres filas del `for`.",
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
        why:
          "Raise es contrato estricto (falla ruidosa en la fila). La tupla es borde tolerante: el lote imprime y sigue. Los hints (`Tuple[...]`) documentan forma para humanos y mypy; no convierten ni chequean al ejecutar. Mezclar raise y tuplas en el mismo helper sin documentar confunde al siguiente junior del pipeline.",
        retrospective:
          "Elegir `raise` o tupla `(ok, value, err)` es decisión de diseño del módulo: sé consistente. El error clásico es anotar `-> int` y devolver un `str` “porque se ve igual en el print”. En We Do verás que el hint no impide esa mentira en runtime.",
      },
      {
        demoId: "S05-T3-A-DEMO",
        subtopicId: "S05-T3-A",
        environment: "browser-pyodide",
        description: "Componer strip + lower + orquestador de registro",
        preamble:
          "Cuando el registro sintético tiene varios campos, **no** metas todas las políticas en un solo bloque monstruoso. Observa piezas pequeñas (`strip_collapse`, `norm_email`) y un orquestador `normalize_pair` que solo compone y arma el dict. El orquestador no reimplementa reglas: llama. Sigue el print del par nombre/email ya canónico.",
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
        why:
          "Cada pieza es pura y testeable sola. El orquestador solo compone: cambia una política en un helper y el dict de salida se actualiza sin copiar `strip`/`lower`/`title` en cinco sitios. Eso es lo que un revisor de CP-N1-B busca antes de aceptar el núcleo.",
        retrospective:
          "Si el orquestador vuelve a copiar `strip`/`lower`/`title` inline, el PR se vuelve inmantenible y cada política se “arregla” en un solo sitio a la vez. En We Do extraerás helpers y descompondrás un monstruo de tres campos con la misma salida.",
      },
      {
        demoId: "S05-T3-B-DEMO",
        subtopicId: "S05-T3-B",
        environment: "browser-pyodide",
        description: "Idempotencia de normalize_telefono puro",
        preamble:
          "Un normalizador de teléfono del gate es **puro** (solo dígitos, sin I/O) e **idempotente**: aplicarlo dos veces no cambia el canónico. Observa `once` y `twice` en tres samples con guiones, paréntesis y ya-limpio. El flag `idem=` debe ser `True` en todos. No hay `print` dentro de la función.",
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
        why:
          "Idempotencia formal: `f(f(x)) == f(x)` en el caso feliz. Importa al re-procesar lotes: el ETL no debe “seguir transformando” un canónico. Pureza (sin print/I/O) permite medir eso con asserts, no capturando stdout.",
        retrospective:
          "Idempotencia es el test mínimo del gate: re-correr el ETL no debe “seguir transformando” un canónico. Si `f(f(x)) != f(x)`, el lote se degrada en silencio entre corridas. En We Do lo demostrarás con una línea `999000 True` — y verás que “estable” no basta si la política de dígitos falla.",
      },
      {
        demoId: "S05-T4-A-DEMO",
        subtopicId: "S05-T4-A",
        environment: "browser-pyodide",
        description: "Closure factory para prefijo de teléfono",
        preamble:
          "A veces fijas una política regional (prefijo `+51`) **sin** clase ni global mutable. Observa `make_norm`: la función interna **cierra** `prefix` del ámbito envolvente y lo reutiliza en cada llamada. No hay `global`. Compara las tres salidas del mismo `pe`: dígitos limpios, dígitos con guiones y un valor que ya trae `+51`.",
        code: {
          language: 'python',
          title: "S05-T4-A-DEMO — closure",
          code: `def make_norm(prefix: str):
    def norm(raw: str) -> str:
        d = "".join(c for c in raw if c.isdigit())
        country_digits = "".join(c for c in prefix if c.isdigit())
        if country_digits and d.startswith(country_digits) and len(d) > 9:
            d = d[len(country_digits):]
        return prefix + d
    return norm

pe = make_norm("+51")
print(pe("999000111"))
print(pe("999-000-111"))
print(pe("+51 999-000-111"))`,
          output: `+51999000111
+51999000111
+51999000111`,
        },
        why:
          "LEGB: la interna resuelve `prefix` en el ámbito envolvente. Cada factory conserva su propia configuración y no se pisa con otra instancia. Antes de anteponer el prefijo, la demo retira el mismo código si ya venía en la entrada; así la política también es idempotente para los tres casos mostrados, sin recurrir a una clase ni a un global mutable.",
        retrospective:
          "La interna recuerda el ámbito envolvente sin ensuciar el espacio de nombres global: cada factory cierra su propio `prefix`. Comprueba la frontera ya prefijada: volver a normalizar `+51 999-000-111` no debe producir `+5151…`. En We Do verás primero que una asignación local no pisa el global y luego armarás factories PE/CL.",
      },
      {
        demoId: "S05-T4-B-DEMO",
        subtopicId: "S05-T4-B",
        environment: "browser-pyodide",
        description: "Ejemplos assert antes y después de micro-refactor",
        preamble:
          "Antes de “embellecer” un normalizador de dirección, fijas **ejemplos/asserts** que capturan la política (upper + colapso + idempotencia). Observa la misma suite en verde **antes y después** de un micro-refactor de implementación. Si el refactor cambiara upper por lower, los asserts gritan. Ese grito es bueno.",
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
        why:
          "El ciclo es verde → refactor → verde. La suite de ejemplos es el contrato ejecutable: captura upper, colapso e idempotencia. Cambiar implementación sin cambiar expected es el hábito; cambiar expected “para que pase” es mentir sobre el gate.",
        retrospective:
          "Refactor sin suite es fe en la suerte. Si el refactor cambiara upper por lower, los asserts deben gritar — ese grito es el contrato. En We Do escribirás asserts de email, repararás un “refactor” que rompe upper, y armarás una tabla de casos para nombre.",
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
        title: "Contar palabras con return (no print)",
        preamble:
          "- **Contexto:** en el lote de intake a veces mides el campo *antes* de normalizar el nombre.\n- **Meta:** practicar que una función **entrega** el valor con `return`, no con `print` interno.\n- **Éxito:** una sola línea impresa por el caller: `2` (para `'  Ana   María  '`).\n- **Límites:** no imprimas dentro de `n_palabras`; no cambies el input de prueba.",
        instruction:
          "1. Abre el starter: `n_palabras` hace `print` del conteo y no tiene `return`.\n2. El caller hace `print(n_palabras(...))` y hoy ve `None`.\n3. Calcula tokens con `strip` + `split` y **devuelve** el entero.\n4. Deja un solo `print` en el caller; la línea exacta debe ser `2`.",
        hint: "return len(raw.strip().split())",
        hints: [
          "return len(raw.strip().split())",
          "No uses print dentro de n_palabras; el print va en el caller.",
        ],
        edgeCases: ["return vs print", "espacios múltiples"],
        tests: "exact line 2",
        feedback:
          "Si el caller imprimía `None`, la función no devolvió nada: `print` dentro es un efecto del borde, no un contrato. `return` entrega el entero a quien llama; encadenar normalizadores sin return rompe el pipeline en silencio.",
        retrospective:
          "`return` es el contrato con quien llama; `print` es un efecto del borde. El mismo bug (`None` silencioso) rompe pipelines cuando encadenas normalizadores. Pregunta de cierre: si borras el `print` del caller, ¿la función sigue “haciendo su trabajo” para el resto del código?",
        starterCode: {
          language: 'python',
          title: "n_palabras.py",
          code: `# CASO-LIM-005 · return vs print (helper de intake)
# FALLO: imprime dentro y no retorna (caller ve None)
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
        title: "Normalizar nombre (colapsa + title)",
        preamble:
          "- **Contexto:** el gate CP-N1-B exige una forma canónica didáctica para comparar resultados y producir reportes sintéticos.\n- **Meta:** implementar `normalize_nombre` con la política completa del caso, no solo `strip`.\n- **Éxito:** imprime `Juan Pérez` y `Quispe` en dos líneas.\n- **Límites:** no uses regex; no presentes `.title()` como regla universal de nombres; datos sintéticos.",
        instruction:
          "1. Revisa el fallo: solo `strip` deja dobles espacios y mayúsculas.\n2. Colapsa espacios con `split`/`join`.\n3. Aplica `.title()` por palabra (parte del contrato).\n4. Prueba los dos inputs del starter y compara salidas.",
        hint: "Solo strip no toca dobles espacios ni mayúsculas: ¿qué del I Do convierte basura de espacios en un solo espacio y title por palabra?",
        hints: [
          "Solo `strip` no toca dobles espacios ni mayúsculas: ¿qué métodos del I Do convierten basura de espacios en un solo espacio y title por palabra?",
          "Prueba mental: `'QUISPE'` debe salir title-case; `'  Juan   Pérez '` no debe conservar el hueco doble.",
        ],
        edgeCases: ["espacios múltiples", "MAYÚSCULAS → Title"],
        tests: "Juan Pérez / Quispe",
        feedback:
          "Solo `strip` no basta: quedan dobles espacios y `QUISPE` en mayúsculas. La política didáctica del capstone exige colapsar **y** aplicar `title`; omitir cualquiera de los dos pasos rompe el contrato ejecutable del gate.",
        retrospective:
          "Aplicar `title` sin colapsar deja basura (`\"Juan  Pérez\"`). Colapsar sin `title` deja `\"QUISPE\"`. Ambos fallan el contrato del laboratorio. Reusarás esta política —con sus límites documentados— en el You Do y en cualquier orquestador que toque nombres sintéticos.",
        starterCode: {
          language: 'python',
          title: "norm_nombre.py",
          code: `# CASO-LIM-005 · colapsar + title (política CP-N1-B)
# FALLO: solo strip; no colapsa dobles espacios ni aplica title
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
        title: "Etiquetar campo sin devolver None",
        preamble:
          "- **Contexto:** en el borde del intake a veces armas una etiqueta legible para logs o UI, no el core del normalizador.\n- **Meta:** transferir el hábito `return` (no `print` interno) a una función de formato.\n- **Éxito:** línea exacta `nombre: Ana`.\n- **Límites:** no imprimas dentro de `etiqueta_campo`; no hardcodees el nombre del campo.",
        instruction:
          "1. El starter imprime dentro y el caller vuelve a imprimir → `None`.\n2. Retorna el f-string `f'{campo}: {valor}'`.\n3. El único `print` visible debe ser el del caller.\n4. Verifica `nombre: Ana`.",
        hint: "Si ves None tras print(fn(...)), sospecha return faltante.",
        hints: [
          "Si ves None tras print(fn(...)), sospecha return faltante.",
          "El f-string debe usarse en return; el print va solo en el caller.",
        ],
        edgeCases: ["None implícito", "etiqueta de campo de intake"],
        tests: "exact line nombre: Ana",
        feedback:
          "Heurística: si `print(fn(...))` muestra `None`, la primera sospecha es return faltante (o print interno que “engaña” la pantalla). Es el bug más común al migrar de script a función.",
        retrospective:
          "El bug `None` reaparece al migrar de script a función. Si la consola muestra `None` tras `print(fn(...))`, no “arregles” imprimiendo más: devuelve el valor. En T1-B el mismo rigor de contrato se aplica a defaults y keywords.",
        starterCode: {
          language: 'python',
          title: "return_none.py",
          code: `# CASO-LIM-005 · None implícito (etiqueta de campo de intake)
# FALLO: imprime dentro y no retorna → print(etiqueta_campo(...)) es None
def etiqueta_campo(campo, valor):
    print(f'{campo}: {valor}')
print(etiqueta_campo('nombre', 'Ana'))`,
        },
        solutionCode: {
          language: 'python',
          title: "return_none.py",
          code: `def etiqueta_campo(campo, valor):
    return f'{campo}: {valor}'
print(etiqueta_campo('nombre', 'Ana'))`,
          output: `nombre: Ana`,
        },
      },
      {
        id: "S05-T1-B-E1",
        subtopicId: "S05-T1-B",
        kind: "guided",
        title: "Default y keyword en present",
        preamble:
          "- **Contexto:** en reportes de cliente sintético el título (Cliente/VIP) es política de presentación, no del core de normalización.\n- **Meta:** usar el parámetro con default y el override por keyword.\n- **Éxito:** `Cliente: Quispe` y `VIP: Quispe`.\n- **Límites:** no hardcodees el prefijo en el f-string; usa la variable `titulo`.",
        instruction:
          "1. El starter ignora `titulo` y fija el literal `\"Cliente\"` en el f-string.\n2. Usa la variable `titulo` en `f'{titulo}: {nombre}'`.\n3. Primera llamada sin segundo argumento (default); segunda con `titulo='VIP'`.\n4. Confirma exactamente `Cliente: Quispe` y `VIP: Quispe`.",
        hint: "El default solo se usa si omites el argumento.",
        hints: [
          "El default solo se usa si omites el argumento.",
          "Dos prints distintos; usa la variable titulo en el f-string.",
        ],
        edgeCases: ["keyword override"],
        tests: "exact lines Cliente: Quispe + VIP: Quispe",
        feedback:
          "Hardcodear `\"Cliente\"` ignora el parámetro: el keyword en el call site no tiene efecto. Usar la variable `titulo` hace legible la política y permite el override `titulo='VIP'`.",
        retrospective:
          "El keyword en el call site documenta la intención (`titulo='VIP'` se lee mejor que un posicional opaco). El default solo aplica si omites el argumento. Siguiente: el default **mutable**, que no se arregla con un f-string.",
        starterCode: {
          language: 'python',
          title: "present.py",
          code: `# CASO-LIM-005 · defaults + keyword
# FALLO: ignora titulo; hardcodea "Cliente"
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
        title: "Default seguro con None",
        preamble:
          "- **Contexto:** un acumulador compartido entre llamadas en un normalizador de lote genera filas “contaminadas” sin excepción ruidosa.\n- **Meta:** reescribir el default mutable a la forma segura.\n- **Éxito:** dos líneas `[1]` y `[2]` (listas independientes).\n- **Límites:** no uses una lista literal como default; crea la lista dentro si `bucket is None`.",
        instruction:
          "1. Identifica `bucket=[]` en la firma.\n2. Cámbialo a `bucket=None`.\n3. Si es `None`, asigna `[]` localmente.\n4. Dos `print` de llamadas separadas deben mostrar listas distintas.",
        hint: "El default se crea al definir la función, no en cada llamada. ¿Qué valor inmutable usarías como centinela y dónde crearías la lista nueva?",
        hints: [
          "El default se crea al **definir** la función, no en cada llamada. ¿Qué valor inmutable usarías como centinela y dónde crearías la lista nueva?",
          "Tras el fix, `good_add(1)` y `good_add(2)` no deben compartir el mismo objeto lista.",
        ],
        edgeCases: ["default None"],
        tests: "[1] luego [2]",
        feedback:
          "El default se evalúa **una sola vez** al definir la función: `bucket=[]` es el mismo objeto en cada llamada. Por eso `good_add(1)` y `good_add(2)` compartían memoria. `None` + lista local aísla por llamada.",
        retrospective:
          "El objeto default vive con la función, no con la llamada: por eso `bad(1)` y `bad(2)` comparten memoria. En code review junior+ este es un filtro clásico; en el lote de intake el síntoma es filas “contaminadas” sin excepción ruidosa.",
        starterCode: {
          language: 'python',
          title: "safe_default.py",
          code: `# CASO-LIM-005 · default mutable
# FALLO: bucket=[] mutable compartido entre llamadas
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
        title: "Teléfono con flag keyword-only",
        preamble:
          "- **Contexto:** en un ETL de fintech en Perú, un flag de política (`digits_only`) no debe colarse como segundo posicional por error.\n- **Meta:** respetar `*` y ramificar la normalización según el flag.\n- **Éxito:** `999000` y `999-000` (inputs del starter `' 999-000 '`).\n- **Límites:** no elimines el `*`; no hardcodees siempre dígitos.",
        instruction:
          "1. El starter siempre hace `strip` e ignora `digits_only`.\n2. Si el flag es True, deja solo dígitos; si False, solo strip.\n3. Demuestra ambas llamadas del starter.\n4. Compara las dos salidas exactas.",
        hint: "El * fuerza keyword para digits_only.",
        hints: [
          "El * fuerza keyword para digits_only.",
          "Ramifica con if digits_only: filtra isdigit; si no, solo strip.",
        ],
        edgeCases: ["keyword-only"],
        tests: "999000 y 999-000",
        feedback:
          "Keyword-only documenta flags de política en el call site y evita invertir argumentos. Ignorar el flag deja guiones cuando debías dígitos, o al revés: el contrato del flag debe verse en el cuerpo.",
        retrospective:
          "Keyword-only documenta política en el call site y evita invertir argumentos. El mismo patrón sirve para `country=\"PE\"` en demos posteriores. Si eliminas el `*`, un posicional accidental puede silenciar el flag.",
        starterCode: {
          language: 'python',
          title: "kwonly_tel.py",
          code: `# CASO-LIM-005 · keyword-only digits_only
# FALLO: siempre strip; ignora digits_only
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
        title: "Docstring real en strip_collapse",
        preamble:
          "- **Contexto:** `strip_collapse` es el helper base de varios normalizadores del caso LIM-005.\n- **Meta:** dejar un **docstring** (no un comentario `#`) legible en `__doc__`.\n- **Éxito:** imprime el texto del doc y luego `a b`.\n- **Límites:** triple comillas justo bajo `def`; no uses solo `#`.",
        instruction:
          "1. El starter documenta con `#`; `__doc__` es `None`.\n2. Mueve la descripción a un docstring de una línea.\n3. Mantén el return que colapsa espacios.\n4. Imprime `__doc__` y el resultado de `'  a  b '`.",
        hint: "Triple comillas justo bajo def; return ' '.join(s.strip().split())",
        hints: [
          "Triple comillas justo bajo def",
          "Docstring no es un comentario #; __doc__ no debe ser None.",
        ],
        edgeCases: ["__doc__", "colapsar espacios"],
        tests: "docstring text + exact line a b",
        feedback:
          "Solo el docstring carga `__doc__` y alimenta `help()` / herramientas del revisor. Un `#` bajo `def` es invisible para el contrato: por eso el starter imprimía `None`.",
        retrospective:
          "El revisor y `help()` no leen tus `#`. Si `__doc__` es `None`, el contrato no existe para herramientas aunque “se lea” en el archivo. Pregunta de cierre: ¿qué imprimiría `print(strip_collapse.__doc__)` si solo hay un comentario bajo `def`?",
        starterCode: {
          language: 'python',
          title: "doc_strip_collapse.py",
          code: `# CASO-LIM-005 · docstring vs comentario (helper de normalizadores)
# FALLO: docstring es # comentario; __doc__ queda None
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
        title: "Email con pre/post y ValueError",
        preamble:
          "- **Contexto:** política de gate: strip+lower y rechazo si no hay `@`.\n- **Meta:** alinear docstring, código y error de dominio.\n- **Éxito:** `a@b.com` y `err email sin @`.\n- **Límites:** no tragues el error con un return silencioso; no uses PII real.",
        instruction:
          "1. El starter hace strip pero no lower ni valida `@`.\n2. Normaliza con strip+lower.\n3. Si falta `@`, `raise ValueError` con mensaje en español.\n4. Prueba OK y el `try/except` del starter.",
        hint: "El docstring promete lower y @. ¿Qué falta en el cuerpo además del strip?",
        hints: [
          "El docstring promete lower y `@`. ¿Qué falta en el cuerpo además del `strip`?",
          "El `try/except` del starter debe imprimir un mensaje en español accionable, no silenciar el fallo.",
        ],
        edgeCases: ["ValueError dominio"],
        tests: "a@b.com + err",
        feedback:
          "Pre/post en el docstring y `raise` en el cuerpo deben decir lo mismo. Strip sin lower ni `@` deja pasar basura que el gate rechaza; el mensaje en español ayuda al triage del ETL.",
        retrospective:
          "Pre/post en el docstring y `raise` en el cuerpo deben decir lo mismo. Separar “email malo de negocio” de un bug de Python evita logs confusos en el ETL; el triage del lote necesita mensajes legibles, no `None` ni excepciones genéricas sin contexto.",
        starterCode: {
          language: 'python',
          title: "email_prepost.py",
          code: `# CASO-LIM-005 · pre/post email (política de gate)
# FALLO: no lower; no valida @
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
        title: "Postcondición viva en normalize_nombre",
        preamble:
          "- **Contexto:** un contrato solo en prosa se pudre; un `assert` de ejemplo lo mantiene vivo.\n- **Meta:** implementar nombre (colapsa + title) y **verificar** la post con asserts.\n- **Éxito:** `Ana María` y `post OK`.\n- **Límites:** no borres los asserts; no cambies el expected del gate.",
        instruction:
          "1. El starter solo hace `strip` (rompe dobles espacios y title).\n2. Implementa colapso + `.title()`.\n3. Deja los asserts de igualdad y de forma (sin extremos ni dobles espacios).\n4. Confirma `post OK`.",
        hint: "assert result == result.strip() and '  ' not in result",
        hints: [
          "Colapsa espacios y aplica title; los asserts ya fijan el expected.",
          "No borres los asserts de forma: demuestran la postcondición.",
        ],
        edgeCases: ["postcondición testeable", "title-case"],
        tests: "Ana María + post OK",
        feedback:
          "Contrato + assert de ejemplo = especificación ejecutable. Si solo strip, fallan igualdad y forma. Si mañana cambias la política, actualizas expected a propósito, no “para que pase en verde”.",
        retrospective:
          "Un assert de forma (sin extremos ni dobles espacios) mantiene viva la post cuando alguien “solo” cambia el `return`. Si el assert falla tras un cambio, discutes política — no borras el assert. En T2-B verás hints y errores de dominio sin abortar el lote.",
        starterCode: {
          language: 'python',
          title: "post_nombre.py",
          code: `# CASO-LIM-005 · postcondición nombre (colapsa + title)
# BUG intencional: solo strip; deja dobles espacios (rompe post)
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
        title: "Hints no validan en runtime",
        preamble:
          "- **Contexto:** anotar `-> int` en un helper de intake no convierte ni chequea tipos al ejecutar.\n- **Meta:** devolver un `int` real y dejar explícito que el hint es contrato estático.\n- **Éxito:** `3` y la línea exacta `hint no valida en runtime`.\n- **Límites:** no uses `isinstance` mágico “porque el hint lo pide”; no cambies el texto de la nota.",
        instruction:
          "1. El starter retorna `str(len(s))` pese al hint `-> int`.\n2. Corrige el return a `len(s)`.\n3. Imprime el resultado de `'abc'`.\n4. Imprime la nota exacta pedida (demo de humildad del hint).",
        hint: "hints no ejecutan isinstance mágicamente",
        hints: [
          "hints no ejecutan isinstance mágicamente",
          "Imprime exactamente: hint no valida en runtime",
        ],
        edgeCases: ["hints graduales", "raw antes de normalize"],
        tests: "3 + hint no valida en runtime",
        feedback:
          "El hint `-> int` no impide devolver un `str`: Python no valida en runtime. La nota exacta demuestra esa humildad. Hints ayudan a humanos y typecheckers; la validación de dominio es código.",
        retrospective:
          "Los hints ayudan a humanos y typecheckers; la validación de dominio es código (`if`, `raise`, parse). Mentir en el hint (`-> str` cuando devuelves `None`) es peor que no anotar.",
        starterCode: {
          language: 'python',
          title: "hint_len_raw.py",
          code: `# CASO-LIM-005 · type hints en helper de intake
# FALLO: no imprime nota; retorna str en vez de int
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
        title: "Parsear monto con tupla de dominio",
        preamble:
          "- **Contexto:** montos sintéticos del intake pueden venir sucios; el lote no debe caerse en la primera basura.\n- **Meta:** devolver `(ok, value, err)` separando no-entero vs negativo.\n- **Éxito:** cuatro líneas para `0`, `10`, `-1`, `x` como en la solución.\n- **Límites:** `0` es válido; no uses `raise` aquí (estrategia tupla).",
        instruction:
          "1. El starter acepta negativos y explota en no-enteros.\n2. `try/except` para parse a int.\n3. Si `n < 0`, error de dominio (no crash).\n4. Recorre los cuatro valores e imprime cada resultado.",
        hint: "try int; if n<0 dominio",
        hints: [
          "try int; if n<0 dominio",
          "0 es válido; no uses raise — devuelve la tupla de error.",
        ],
        edgeCases: ["0 válido", "negativo dominio"],
        tests: "four lines for 0 / 10 / -1 / x",
        feedback:
          "ValueError de `int()` es fallo de forma; “negativo no permitido” es regla de negocio. Mezclarlos en un solo mensaje opaco complica el triage. `0` es válido: no lo trates como error.",
        retrospective:
          "En el triage del ETL, “no es entero” te manda a limpiar el campo; “negativo no permitido” te manda a la regla de negocio. Si unificas ambos en un solo `False` opaco, el junior no sabe si reparsear o rechazar. Pregunta: ¿por qué `0` no debe caer en la rama de error?",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `# CASO-LIM-005 · parse_monto dominio
# BUG intencional: acepta negativos; no distingue no-entero
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
        title: "Raise en el core, SKIP en el borde",
        preamble:
          "- **Contexto:** el normalizador de email del gate es estricto; el **lote** debe tolerar filas malas sin abortar todo.\n- **Meta:** `raise` en el core + `try/except` por fila en el borde.\n- **Éxito:** `estrategia: raise + try por fila en el borde`, luego `OK ok@ex.com` y `SKIP malo email inválido`.\n- **Límites:** no pongas el `try` dentro del normalizador puro; no inventes PII.",
        instruction:
          "1. El starter no valida `@` y etiqueta todo como OK.\n2. En `normalize_email`, raise si falta `@`.\n3. En el loop, captura `ValueError` y marca SKIP.\n4. Documenta la estrategia en un print legible (mismo texto que la solución).",
        hint: "Lote: try/except por fila para no abortar todo",
        hints: [
          "Lote: try/except por fila para no abortar todo",
          "Una fila mala no impide la buena; el raise vive en el core.",
        ],
        edgeCases: ["borde I/O vs core"],
        tests: "OK + SKIP",
        feedback:
          "Core estricto + borde tolerante es un diseño limpio: tests del core no necesitan capturar “filas hermanas”. El error de una fila no borra el lote; el print de estrategia documenta esa decisión.",
        retrospective:
          "Tests del core no deben depender de “filas hermanas” ni de capturar stdout del lote. El error de una fila no borra el resto. Si metes el `try` dentro del pure core, conviertes un contrato estricto en un normalizador que traga basura en silencio.",
        starterCode: {
          language: 'python',
          title: "raise_vs_tuple.py",
          code: `# CASO-LIM-005 · raise + borde tolerante
# FALLO: no raise; lote se traga filas malas sin SKIP
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
        title: "Extraer strip_collapse y componer",
        preamble:
          "- **Contexto:** el colapso de espacios se reutiliza en nombre, dirección y más.\n- **Meta:** extraer el helper y usarlo dentro de `normalize_nombre` + `.title()`.\n- **Éxito:** línea exacta `Ana María`.\n- **Límites:** no reimplementes el colapso dentro del normalizador; no omitas title.",
        instruction:
          "1. Completa `strip_collapse` (hoy es identidad).\n2. `normalize_nombre` debe llamar al helper y luego `.title()`.\n3. No dejes solo `raw.strip().title()` (falla con dobles espacios).\n4. Verifica `Ana María`.",
        hint: "strip_collapse hoy es identidad: debe colapsar espacios como en el I Do.",
        hints: [
          "`strip_collapse` hoy es identidad: debe colapsar espacios como en el I Do.",
          "`normalize_nombre` no debe rehacer el colapso: llama al helper y luego aplica title.",
        ],
        edgeCases: ["title after collapse"],
        tests: "exact line Ana María",
        feedback:
          "Piezas pequeñas se testean solas; el normalizador solo orquesta dos pasos. `strip().title()` sin colapsar deja dobles espacios y rompe el canónico del gate.",
        retrospective:
          "Piezas pequeñas se testean solas; el normalizador solo orquesta dos pasos (colapsar y title). Composición gana al copy-paste de `join`/`split` en cinco sitios: un bug de espacios se arregla una vez en el helper.",
        starterCode: {
          language: 'python',
          title: "extract_strip.py",
          code: `# CASO-LIM-005 · extract strip_collapse
# FALLO: no extrae helper; title sin colapsar espacios
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
        title: "Orquestador que solo llama helpers",
        preamble:
          "- **Contexto:** `normalize_contact` arma el dict de un registro sintético de contacto.\n- **Meta:** devolver el dict **solo** vía `norm_n` / `norm_e` (sin reimplementar).\n- **Éxito:** `{'nombre': 'Luis', 'email': 'l@e.com'}`.\n- **Límites:** no hagas `strip` manual en el orquestador; respeta el raise de email en el helper.",
        instruction:
          "1. Los helpers ya implementan la política del gate.\n2. El fallo está en `normalize_contact`: no los invoca.\n3. Retorna el dict con ambas claves normalizadas.\n4. Imprime el resultado del print del starter.",
        hint: "Los helpers ya saben de title y de @. ¿Qué debería hacer normalize_contact además de armar claves del dict?",
        hints: [
          "Los helpers ya saben de title y de `@`. ¿Qué debería hacer `normalize_contact` además de armar claves del dict?",
          "Si dejas `email` crudo o solo `strip` en el orquestador, el gate miente aunque el print “se vea”.",
        ],
        edgeCases: ["dict orquestado", "email con @"],
        tests: "exact dict {'nombre': 'Luis', 'email': 'l@e.com'}",
        feedback:
          "El orquestador no reimplementa reglas: si haces `strip` manual y dejas el email crudo, el gate miente. Delega en `norm_n` / `norm_e` y un cambio de política toca un solo helper.",
        retrospective:
          "Un orquestador delgado no “sabe” de title ni de `@`: delega. Así un cambio de política se toca en un solo helper y el dict de contacto sigue siendo una composición, no un monstruo.",
        starterCode: {
          language: 'python',
          title: "orch_contact.py",
          code: `# CASO-LIM-005 · orquestador delgado
# FALLO: reimplementa reglas; no llama helpers
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
        title: "Descomponer el monstruo de tres campos",
        preamble:
          "- **Contexto:** tres políticas (nombre, email, tel) mezcladas en un solo `def` son deuda que un revisor de CP-N1-B rechaza.\n- **Meta:** tres funciones + orquestador delgado, misma salida.\n- **Éxito:** dict `nombre`/`email`/`tel` canónicos.\n- **Límites:** no dejes reglas de negocio dentro del orquestador final.",
        instruction:
          "1. Lee el monstruo: tres políticas inline.\n2. Extrae `n_nombre`, `n_email`, `n_tel` (nombres libres si son claros).\n3. `normalize_all` solo llama y arma el dict.\n4. Misma salida que el starter al imprimir.",
        hint: "Cada campo = una función; el orquestador solo llama",
        hints: [
          "Cada campo = una función; el orquestador solo llama",
          "Salida dict con 3 claves; no dejes reglas en el monstruo",
        ],
        edgeCases: ["descomposición"],
        tests: "exact dict {'nombre': 'Ana', 'email': 'a@b.com', 'tel': '9991'}",
        feedback:
          "Si el monstruo vuelve, el PR se rechaza: no por estética, sino porque no puedes testear ni reutilizar políticas. Misma salida, diseño distinto: eso es descomposición real.",
        retrospective:
          "Misma salida, diseño distinto: eso es descomposición real. El You Do te pedirá el mismo patrón con **cuatro** campos; si el monstruo vuelve allí, no podrás testear políticas por separado ni reutilizarlas en S08/S10.",
        starterCode: {
          language: 'python',
          title: "split_monster.py",
          code: `# CASO-LIM-005 · monstruo a descomponer
# FALLO: tres políticas inline en un solo def (descompón)
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
        title: "Teléfono puro e idempotente",
        preamble:
          "- **Contexto:** el gate pide dígitos-only en demo de teléfono e idempotencia demostrable.\n- **Meta:** función pura sin print interno + `f(f(x))==f(x)`.\n- **Éxito:** línea exacta `999000 True`.\n- **Límites:** no imprimas dentro de `normalize_tel`; no dejes guiones.\n\nCuidado: el starter puede dar `999-000 True` (idempotente pero **incorrecto** de política).",
        instruction:
          "1. El starter solo quita espacios; deja guiones.\n2. Filtra con `isdigit` (o equivalente claro).\n3. Calcula `once` y compara con `normalize_tel(once)`.\n4. Imprime valor y booleano en el caller.",
        hint: "once = f(x); twice = f(once); print once==twice",
        hints: [
          "once = f(x); twice = f(once); print once==twice",
          "Sin print dentro de normalize_tel; filtra isdigit (no solo espacios).",
        ],
        edgeCases: ["idempotencia"],
        tests: "exact line 999000 True",
        feedback:
          "Idempotencia es el test mínimo del gate, pero no basta sola: `999-000` puede ser estable y aun así fallar la política de dígitos. Pureza (sin print) permite testear sin capturar stdout.",
        retrospective:
          "Idempotencia es el test mínimo del gate. Pureza (sin print/I/O) permite testear sin capturar stdout. Si `f(x)` aún tiene basura, `f(f(x))` puede “parecer” estable y aun así estar mal respecto a la política.",
        starterCode: {
          language: 'python',
          title: "pure_tel.py",
          code: `# CASO-LIM-005 · pureza + idempotencia
# FALLO: deja guiones; f(f(x)) puede fallar si se re-strip mal
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
        title: "Print al borde, email puro",
        preamble:
          "- **Contexto:** un `print` dentro del normalizador contamina tests y logs del ETL; el core de email del gate debe ser pure strip+lower con `@`.\n- **Meta:** core puro + reporte solo en `print_report`.\n- **Éxito:** línea exacta `email= z@w.com`.\n- **Límites:** sin `print` en `normalize_email`; valida `@` con `raise`; no inventes PII.",
        instruction:
          "1. Saca el `print` del core.\n2. Añade validación de `@` con `ValueError` si falta.\n3. `print_report` debe imprimir el valor **retornado** por el core.\n4. Ejecuta el call del starter y compara con `email= z@w.com`.",
        hint: "print solo en print_report",
        hints: [
          "print solo en print_report",
          "Core testeable sin capturar stdout; valida @ en el pure core.",
        ],
        edgeCases: ["efecto al borde"],
        tests: "email= z@w.com",
        feedback:
          "Un print en el core contamina tests y logs: el core se testea con asserts, el borde formatea. Efectos al borde, pureza al centro — y no olvides el raise de `@`.",
        retrospective:
          "Efectos al borde, pureza al centro. El core se testea con asserts; el borde formatea. Ese hábito escala a CLI y a S08 (archivos) sin reescribir reglas.",
        starterCode: {
          language: 'python',
          title: "io_borde.py",
          code: `# CASO-LIM-005 · I/O al borde
# FALLO: print dentro del normalizador "puro"
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
        title: "Inyectar el normalizador en process",
        preamble:
          "- **Contexto:** a veces el procesador de línea no debe hardcodear la política: la recibe inyectada.\n- **Meta:** `process(line, norm=...)` usa la fn inyectada, no ignora el parámetro.\n- **Éxito:** `999` y `999-A`.\n- **Límites:** no llames siempre `normalize_tel` a mano dentro de `process`.",
        instruction:
          "1. El starter recibe `norm` pero llama siempre a `normalize_tel`.\n2. Retorna `norm(line)`.\n3. Demuestra default (dígitos) y lambda upper+strip.\n4. Compara las dos salidas.",
        hint: "norm es parámetro con default",
        hints: [
          "norm es parámetro con default",
          "Usa norm(line), no hardcodees normalize_tel dentro de process.",
        ],
        edgeCases: ["inyección de dependencia simple"],
        tests: "999 y 999-A",
        feedback:
          "Si `process` ignora `norm`, el segundo call no puede upper+strip. Inyectar la fn permite tests con fakes sin monkeypatch: el borde elige política; la pieza hace el trabajo.",
        retrospective:
          "Inyectar la fn permite tests con fakes sin monkeypatch. Es el mismo espíritu de “orquestador delgado”: el borde elige política; la pieza hace el trabajo.",
        starterCode: {
          language: 'python',
          title: "inject_norm.py",
          code: `# CASO-LIM-005 · inyección de normalizador
# FALLO: ignora norm inyectado; siempre digits
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
        title: "Local no pisa el global",
        preamble:
          "- **Contexto:** confundir scope es una fuente clásica de bugs “imposibles” en scripts de normalización.\n- **Meta:** ver que asignar `x` dentro de `f` crea **local**; el global sigue en 1.\n- **Éxito:** `in 2` y `out 1`.\n- **Límites:** no uses `global x` (ese es otro camino, no el de este ejercicio).",
        instruction:
          "1. El starter imprime dos veces el global tras `f()`.\n2. Imprime `in` **dentro** de `f` tras `x = 2`.\n3. Fuera, imprime `out` con el global.\n4. Confirma las dos líneas exactas.",
        hint: "Local no pisa global sin global keyword",
        hints: [
          "Local no pisa global sin global keyword",
          "Fuera sigue 1; el print de 'in' va dentro de f.",
        ],
        edgeCases: ["local vs global"],
        tests: "in 2 out 1",
        feedback:
          "Asignar dentro crea local; el global no cambia sin `global`. El starter engañaba al imprimir dos veces el global: por eso ambas líneas salían `1`.",
        retrospective:
          "Asignar dentro de `f` crea un local; el global no cambia sin `global`. LEGB no es trivia de examen: evita mutar configuración de política desde helpers y explica bugs “imposibles” en scripts de normalización. Pregunta: ¿qué imprimirías si movieras el `print('in', x)` fuera de `f` sin tocar el cuerpo?",
        starterCode: {
          language: 'python',
          title: "legb_local.py",
          code: `# CASO-LIM-005 · LEGB local vs global
# FALLO: no imprime dentro; asume que f muta global x
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
        title: "Factory de prefijo telefónico",
        preamble:
          "- **Contexto:** demos PE/CL con prefijos sintéticos (`+51`, `+56`) sin clases prematuras.\n- **Meta:** `make_phone_prefix` devuelve una fn que antepone el prefix a los dígitos.\n- **Éxito:** línea exacta `+51999 +56999`.\n- **Límites:** la interna debe cerrar `prefix`; no uses global.",
        instruction:
          "1. El starter calcula dígitos pero olvida anteponer `prefix`.\n2. Retorna `prefix + d`.\n3. Crea `pe` y `cl`.\n4. Un solo print con ambos resultados.",
        hint: "La interna cierra prefix del enclosing scope (closure).",
        hints: [
          "La interna cierra `prefix` del enclosing scope (closure).",
          "Retorna prefix + dígitos; no uses variable global de configuración.",
        ],
        edgeCases: ["closure", "prefijo regional PE/CL sintético"],
        tests: "exact line +51999 +56999",
        feedback:
          "Si olvidas anteponer `prefix`, `pe` y `cl` se comportan igual. Cada factory cierra su propio prefix: no se pisan entre sí y no necesitas clase prematura.",
        retrospective:
          "Factories por closure evitan clases prematuras y fijan política regional por instancia de función. Cada factory cierra su propio prefix: no se pisan entre sí.",
        starterCode: {
          language: 'python',
          title: "closure_phone.py",
          code: `# CASO-LIM-005 · closure factory de prefijo telefónico
# FALLO: inner ignora prefix del enclosing; no antepone nada
def make_phone_prefix(prefix):
    def norm(raw):
        d = ''.join(c for c in raw if c.isdigit())
        return d  # falta prefix
    return norm
pe = make_phone_prefix('+51')
cl = make_phone_prefix('+56')
print(pe('999'), cl('999'))`,
        },
        solutionCode: {
          language: 'python',
          title: "closure_phone.py",
          code: `def make_phone_prefix(prefix):
    def norm(raw):
        d = ''.join(c for c in raw if c.isdigit())
        return prefix + d
    return norm
pe = make_phone_prefix('+51')
cl = make_phone_prefix('+56')
print(pe('999'), cl('999'))`,
          output: `+51999 +56999`,
        },
      },
      {
        id: "S05-T4-A-E3",
        subtopicId: "S05-T4-A",
        kind: "transfer",
        title: "Factory multipolítica sin global",
        preamble:
          "- **Contexto:** a veces la misma fábrica entrega políticas distintas (`digits` vs `lower`) sin variable global de modo.\n- **Meta:** `make_normalizer(mode)` devuelve la fn adecuada cerrando la política.\n- **Éxito:** `12 hola`.\n- **Límites:** sin `global mode`; modes desconocidos pueden fallar con ValueError.",
        instruction:
          "1. El starter ignora `digits` y siempre hace lower.\n2. Ramifica por `mode` y devuelve la fn correcta.\n3. Prueba `d` y `lo` del starter.\n4. Un print, dos resultados.",
        hint: "if mode=='digits': return fn de dígitos; si 'lower', strip+lower",
        hints: [
          "Ramifica por mode y devuelve la fn correcta en cada rama.",
          "Sin global mode; cada factory cierra su política.",
        ],
        edgeCases: ["factory multipolítica"],
        tests: "exact line 12 hola",
        feedback:
          "Si siempre haces lower, `digits` devuelve basura con letras. Config en el enclosing (no en global mutable) deja convivir dos normalizadores en el mismo proceso.",
        retrospective:
          "Dos normalizadores pueden convivir en el mismo proceso sin un `mode` global mutable: cada factory cierra su política. Es el mismo espíritu de inyección de T3-B, con fábrica. Si mañana agregas `mode='title'`, no reescribes los callers: devuelves otra fn.",
        starterCode: {
          language: 'python',
          title: "factory_norm.py",
          code: `# CASO-LIM-005 · factory multipolítica
# FALLO: siempre lower; ignora mode digits
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
        title: "Asserts de ejemplo para email",
        preamble:
          "- **Contexto:** el contrato de email del gate debe ser ejecutable, no solo docstring.\n- **Meta:** dos asserts (caso feliz + idempotencia) e imprimir `OK`.\n- **Éxito:** línea exacta `OK` (asserts en silencio).\n- **Límites:** no “arregles” expected a mayúsculas; no omitas idempotencia.",
        instruction:
          "1. La función ya implementa la política.\n2. Añade assert de `'  A@B.COM '` → `'a@b.com'`.\n3. Añade assert de idempotencia.\n4. Imprime solo `OK` si todo pasa.",
        hint: "assert normalize_email('  A@B.COM ')=='a@b.com'",
        hints: [
          "assert normalize_email('  A@B.COM ')=='a@b.com'",
          "Incluye idempotencia: f(f(x)) == f(x); luego print OK.",
        ],
        edgeCases: ["assert ejemplos"],
        tests: "exact line OK",
        feedback:
          "Imprimir el email “se ve bien” no demuestra el contrato. Asserts de caso feliz + idempotencia en silencio y un solo `OK` convierten la política en red de seguridad.",
        retrospective:
          "Ejemplos primero (o al menos junto al código) convierten la política en red de seguridad. Si un assert falla, discutes política — no “el print se veía bien”.",
        starterCode: {
          language: 'python',
          title: "examples_email.py",
          code: `# CASO-LIM-005 · asserts de ejemplo (contrato gate email)
# FALLO: expected con mayúsculas; asserts fallan o se omiten
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
        title: "Refactor sin romper upper",
        preamble:
          "- **Contexto:** dirección del gate es colapsa + **upper**; un “refactor” a lower es un cambio de política disfrazado.\n- **Meta:** extraer `strip_collapse` y mantener asserts verdes.\n- **Éxito:** asserts de `AV 1` + idempotencia; línea final `JR 2`.\n- **Límites:** no cambies upper por lower; re-ejecuta asserts tras el cambio.",
        instruction:
          "1. La segunda definición rompe la política a propósito.\n2. Extrae colapso a helper.\n3. `normalize_dir` = helper + `.upper()`.\n4. Deja asserts verdes y el print final.",
        hint: "Extrae strip_collapse; normalize_dir solo llama y aplica .upper()",
        hints: [
          "No cambies upper por lower: eso rompe el assert 'AV 1'.",
          "Tras extraer el helper, re-ejecuta asserts y luego print de ' jr 2 '.",
        ],
        edgeCases: ["refactor preserva conducta", "política upper del gate"],
        tests: "assert AV 1 + idempotencia verdes; exact line JR 2",
        feedback:
          "Verde-refactor-verde es el hábito profesional. Cambiar upper por lower no es embellecer: es cambiar el contrato. Si el assert se pone rojo, o el refactor falló o cambiaste política sin documentarlo.",
        retrospective:
          "Si el assert se pone rojo tras “embellecer”, o el refactor falló o cambiaste el contrato sin documentarlo. No “arregles” expected a lower: eso miente sobre el gate de dirección. El hábito es verde → extraer helper → verde otra vez.",
        starterCode: {
          language: 'python',
          title: "refactor_dir.py",
          code: `# CASO-LIM-005 · refactor preserva conducta
# BUG intencional: segunda definición usa lower (rompe política upper)
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
assert normalize_dir(normalize_dir('x')) == normalize_dir('x')
print(normalize_dir(' jr 2 '))`,
          output: `JR 2`,
        },
      },
      {
        id: "S05-T4-B-E3",
        subtopicId: "S05-T4-B",
        kind: "transfer",
        title: "Suite tabla para normalize_nombre",
        preamble:
          "- **Contexto:** la política colapsa+title del gate se defiende con una tabla `(input, expected)`.\n- **Meta:** recorrer casos con `assert` e imprimir `PASS` por fila.\n- **Éxito:** `PASS ... → A B`, `PASS X → X`, `all PASS`.\n- **Límites:** no declares PASS sin assert; no cambies expected sin cambiar política a propósito.",
        instruction:
          "1. El starter imprime `all PASS` sin recorrer `cases`.\n2. Haz `for inp, exp in cases`.\n3. Calcula el got, `assert` igualdad, e imprime `PASS` con flecha (mismo formato que la solución).\n4. Cierra con `all PASS` solo si todos los asserts pasaron.",
        hint: "No declares PASS sin recorrer cases con assert",
        hints: [
          "No declares PASS sin assert; recorre cases con for.",
          "Expected con title: '  a  b ' → 'A B'; 'X' → 'X'.",
        ],
        edgeCases: ["tabla de casos", "title-case"],
        tests: "PASS   a  b  → A B / PASS X → X / all PASS",
        feedback:
          "Imprimir `all PASS` a ciegas es teatro, no suite. Tabla de casos = contrato ejecutable: si actualizas expected “para que pase”, mientes sobre el gate.",
        retrospective:
          "Tabla de casos = contrato ejecutable del normalizador. Es el mismo espíritu del You Do (`_run_tests`). Si actualizas implementación y expected “para que pase”, estás mintiendo sobre el gate.",
        starterCode: {
          language: 'python',
          title: "suite_nombre.py",
          code: `# CASO-LIM-005 · suite tabla de casos (colapsa + title)
# FALLO: no recorre cases; declara PASS a ciegas
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
      "Demostrar idempotencia f(f(x)) == f(x) en cada uno",
      "Docstrings con pre/post; ValueError o política explícita en email",
      "Sin I/O ni prints dentro del core",
      "Suite de ejemplos/asserts ejecutable en __main__",
    ],
    requirements: [
      "`normalize_nombre` colapsa espacios y aplica `title` por palabra (política del laboratorio, no regla universal de nombres)",
      "`normalize_email`: `strip` + `lower`; error si no hay `@` (gate mínimo, no validación integral de email)",
      "`normalize_telefono`: solo dígitos (política de demostración)",
      "`normalize_direccion`: colapsa espacios + `upper` determinista",
      "`is_idempotent` o asserts equivalentes para los cuatro normalizadores",
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
    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
    raise NotImplementedError


def normalize_email(raw: str) -> str:
    """Aplica strip + lower. ValueError si falta @.

    Es un gate mínimo del laboratorio, no una validación integral de email.
    """
    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
    raise NotImplementedError


def normalize_telefono(raw: str) -> str:
    """Solo dígitos (política PE sintética de demo).
    """
    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
    raise NotImplementedError


def normalize_direccion(raw: str) -> str:
    """Colapsa espacios; upper para demo determinista.
    """
    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
    raise NotImplementedError


def normalize_record(nombres: str, email: str, telefono: str, direccion: str) -> dict:
    """Orquestador delgado — solo llama normalizadores puros."""
    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
    raise NotImplementedError


def is_idempotent(fn: Callable[[str], str], sample: str) -> bool:
    once = fn(sample)
    return fn(once) == once


def _run_tests() -> None:
    assert normalize_nombre("  maría  josé ") == "María José"
    assert is_idempotent(normalize_nombre, "  ana  ")
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert is_idempotent(normalize_email, "A@B.COM")
    try:
        normalize_email("sin-arroba")
    except ValueError:
        pass
    else:
        raise AssertionError("normalize_email debe rechazar entradas sin @")
    assert normalize_telefono("999-000-111") == "999000111"
    assert is_idempotent(normalize_telefono, "999-000-111")
    assert normalize_direccion("  av. larco 100 ") == "AV. LARCO 100"
    assert is_idempotent(normalize_direccion, "  av. larco 100 ")
    r = normalize_record("  luis ", "L@E.COM", "(999)111222", " jr unión 1 ")
    assert r == {
        "nombres": "Luis",
        "email": "l@e.com",
        "telefono": "999111222",
        "direccion": "JR UNIÓN 1",
    }
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
      "Documenta en español la política y los límites de cada normalizador; luego pega la salida de la suite. Explica que `title` y “contiene `@`” son reglas didácticas, no validadores universales de identidad. Menciona que la I/O de archivos llegará en S08; aquí solo construyes el núcleo puro.",
    rubric: [
      { criterion: "Cuatro normalizadores correctos", weight: "25%" },
      { criterion: "Idempotencia demostrada", weight: "25%" },
      { criterion: "Pureza (sin I/O en core)", weight: "20%" },
      { criterion: "Docstrings / hints / errores de dominio", weight: "15%" },
      { criterion: "Orquestador delgado + tests", weight: "10%" },
      { criterion: "Documentación en español", weight: "5%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué assert demuestra idempotencia en **cada** normalizador, no solo en uno? (2) ¿dónde vivirían los `print` y la lectura de archivos si esto pasara a S08 — y por qué **no** están en el core hoy? (3) Escribe en el README una frase de impacto medible (p. ej. “cuatro políticas de CP-N1-B testeables sin abrir CSV”) que puedas defender en 30 segundos. Revisa también que el orquestador no reimplemente reglas.",
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
          "Pureza = determinismo + sin efectos colaterales; ideal para normalizadores.",
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
