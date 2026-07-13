import type { CourseSection } from '../../types'

export const section04: CourseSection = {
  id: 'functions-modules',
  index: 4,
  title: 'Functions, Modules & Packaging',
  shortTitle: 'Funciones & Módulos',
  tagline: 'Decorators, pathlib, datetime y empaquetado profesional',
  estimatedHours: 8,
  level: 'Intermedio',
  icon: 'Puzzle',
  accentColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
  jobRelevance:
    'Los decorators están en TODOS los codebases de ML production: FastAPI los usa para routing, MLflow para tracking, pytest para fixtures, sklearn para validación. Si no entiendes decorators, no puedes leer ni modificar código production-ready. pathlib y datetime son el 80% de la manipulación de archivos y fechas que harás diariamente como Data Analyst.',
  learningOutcomes: [
    { text: 'Dominar funciones avanzadas: parámetros por defecto, keyword-only args, *args, **kwargs' },
    { text: 'Escribir y aplicar lambda functions en contexto real' },
    { text: 'Crear tus propios módulos e importarlos con import y from x import y' },
    { text: 'Implementar decorators con @functools.wraps para logging, timing y cache' },
    { text: 'Usar pathlib para manipulación de archivos cross-platform' },
    { text: 'Manipular fechas con datetime, timedelta y timezone-aware objects' },
  ],
  theory: [
    {
      heading: 'Funciones avanzadas — más allá de lo básico',
      paragraphs: [
        'Ya conoces los fundamentos de funciones. Ahora vamos a los patrones que ves en código profesional. Los parámetros keyword-only se definen después de un `*` y obligan al caller a usar el nombre: `def f(a, b, *, debug=False):`. Esto hace el código más legible en callsites — `f(1, 2, debug=True)` es claro, mientras que `f(1, 2, True)` es opaco.',
        'El orden de parámetros en una función profesional es: (1) posicionales obligatorios, (2) `*args`, (3) keyword-only con default, (4) `**kwargs`. Por ejemplo: `def procesar(data, *filtros, verbose=False, **opciones):`. Este orden respeta cómo Python los interpreta y hace tu función flexible sin ser ambigua.',
        'Las `lambda` son funciones anónimas de una sola expresión. Úsalas para callbacks cortos como `sorted(lista, key=lambda x: x["edad"])` o `map(lambda x: x*2, lista)`. No abuses — si la lógica tiene más de una expresión, usa `def`. La legibilidad siempre gana sobre la concisión.',
      ],
      code: {
        language: 'python',
        title: 'funciones_avanzadas.py',
        code: `# Keyword-only args (después de *)
def entrenar_modelo(X, y, *, epochs=10, lr=0.01, verbose=False):
    """
    Entrena un modelo con hyperparámetros keyword-only.
    Esto obliga a usar el nombre al llamar, evitando ambigüedad.
    """
    if verbose:
        print(f"Entrenando {epochs} epochs con lr={lr}")
    # ... lógica de entrenamiento
    return {"epochs": epochs, "lr": lr}

# Llamada clara (keyword-only evita confusión)
entrenar_modelo(X, y, epochs=50, lr=0.001, verbose=True)
# Entrenando 50 epochs con lr=0.001

# Orden completo: positional, *args, kw-only, **kwargs
def log_evento(evento, *tags, level="INFO", **metadata):
    print(f"[{level}] {evento}")
    if tags:
        print(f"  Tags: {', '.join(tags)}")
    for k, v in metadata.items():
        print(f"  {k}: {v}")

log_evento("login", "auth", "user", level="DEBUG",
           user_id=42, ip="190.233.45.10")

# Lambda — para callbacks cortos
usuarios = [
    {"nombre": "Ana", "edad": 25},
    {"nombre": "Luis", "edad": 30},
    {"nombre": "Carlos", "edad": 22}
]
# Ordenar por edad con lambda
usuarios_ordenados = sorted(usuarios, key=lambda u: u["edad"])
# [Carlos(22), Ana(25), Luis(30)]

# Lambda con map y filter
nombres = list(map(lambda u: u["nombre"], usuarios))
mayores_25 = list(filter(lambda u: u["edad"] > 25, usuarios))`,
        output: `[DEBUG] login
  Tags: auth, user
  user_id: 42
  ip: 190.233.45.10`,
      },
    },
    {
      heading: 'Módulos — organizando código reutilizable',
      paragraphs: [
        'Un módulo es simplemente un archivo `.py` que puede ser importado por otros. Si tienes `utils.py` en tu carpeta, puedes hacer `import utils` o `from utils import mi_funcion`. Python busca módulos en el PYTHONPATH (que incluye el directorio actual por defecto). Para proyectos serios, organizas el código en paquetes: carpetas con un archivo `__init__.py` (puede ser vacío) que marcan a Python que la carpeta es importable.',
        'El patrón `if __name__ == "__main__":` es CRÍTICO. Permite que un archivo se comporte de dos formas: (1) como script principal cuando lo ejecutas directamente (`python mi_modulo.py`), o (2) como módulo importable sin ejecutar código de side-effect. Sin este guard, cada vez que alguien importe tu módulo, se ejecutaría el código de prueba que pusiste al final.',
        'La librería estándar de Python tiene módulos que debes conocer: `os` (sistema operativo), `pathlib` (paths modernos), `datetime` (fechas), `json` (serialización), `collections` (estructuras extra), `itertools` (iteradores), `functools` (decorators, cache), `re` (regex), `math` (matemáticas). Conocer la librería estándar te ahorra tiempo — muchas veces reinventas la rueda sin saber que ya existe.',
      ],
      code: {
        language: 'python',
        title: 'mi_modulo.py',
        code: `# mi_modulo.py — un módulo reutilizable
"""
Módulo de utilidades para procesamiento de datos.
"""

# Constante pública
PI = 3.141592653589793

# Función pública
def calcular_promedio(numeros):
    """Calcula el promedio de una lista de números."""
    return sum(numeros) / len(numeros) if numeros else 0

# Funcion privada (convencion: _ prefijo)
def _validar_input(numeros):
    """Valida que el input sea una lista de números."""
    if not isinstance(numeros, (list, tuple)):
        raise TypeError("Se esperaba lista o tupla")

# Cuando se ejecuta directamente (no como import)
if __name__ == "__main__":
    # Este codigo SOLO se ejecuta con: python mi_modulo.py
    # NO se ejecuta cuando alguien hace "import mi_modulo"
    datos = [10, 20, 30, 40, 50]
    print(f"Datos: {datos}")
    print(f"Promedio: {calcular_promedio(datos)}")
    print(f"PI = {PI}")

# === En otro archivo: main.py ===
# import mi_modulo
# prom = mi_modulo.calcular_promedio([1, 2, 3])
# print(mi_modulo.PI)
#
# from mi_modulo import calcular_promedio, PI
# prom = calcular_promedio([1, 2, 3])`,
      },
    },
    {
      heading: 'Decorators — funciones que envuelven funciones',
      paragraphs: [
        'Un decorator es una función que recibe otra función y devuelve una nueva con comportamiento extendido. Se aplica con `@` encima de la función. El uso más común: logging, timing, caching, control de acceso. En ML production, los decorators son ubicuos — FastAPI los usa para definir endpoints (`@app.get("/users")`), pytest para fixtures, sklearn para validar inputs de estimators.',
        'La anatomía de un decorator: es una función que devuelve una función "wrapper". El wrapper usa `*args, **kwargs` para aceptar cualquier signature, ejecuta la función original, y puede agregar comportamiento antes/después. SIEMPRE usa `@functools.wraps(func)` para preservar el nombre y docstring de la función original — sin esto, tu documentación se pierde.',
        'Los decorators pueden aceptar parámetros (decorators con argumentos). Para esto necesitas un nivel más de anidamiento: una función que recibe los parámetros del decorator y devuelve el decorator real. Es un patrón que se ve raro al principio pero es muy poderoso.',
      ],
      code: {
        language: 'python',
        title: 'decorators.py',
        code: `import functools
import time
from datetime import datetime

# Decorator de timing — mide cuánto tarda una función
def timing(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = func(*args, **kwargs)
        fin = time.perf_counter()
        elapsed = (fin - inicio) * 1000  # ms
        print(f"⏱️  {func.__name__} tardó {elapsed:.2f}ms")
        return resultado
    return wrapper

# Decorator de logging — registra cada llamada
def log_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        args_str = ", ".join([repr(a) for a in args] +
                             [f"{k}={v!r}" for k, v in kwargs.items()])
        print(f"[{timestamp}] CALL {func.__name__}({args_str})")
        try:
            result = func(*args, **kwargs)
            print(f"[{timestamp}] RETURN {func.__name__} -> {result!r}")
            return result
        except Exception as e:
            print(f"[{timestamp}] ERROR {func.__name__}: {e}")
            raise
    return wrapper

# Aplicar múltiples decorators (se aplican de abajo hacia arriba)
@timing
@log_call
def procesar_datos(data, factor=1):
    """Procesa una lista de datos multiplicando por factor."""
    time.sleep(0.1)  # simular trabajo
    return [x * factor for x in data]

# Uso
resultado = procesar_datos([1, 2, 3, 4, 5], factor=10)
print(f"Resultado: {resultado}")

# Decorator con parámetros
def repeat(n):
    """Repite la ejecución n veces, devuelve lista de resultados."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(n)]
        return wrapper
    return decorator

@repeat(3)
def lanzar_dado():
    import random
    return random.randint(1, 6)

print(lanzar_dado())  # [4, 2, 6] (3 resultados)`,
        output: `[2025-07-14 19:45:01] CALL procesar_datos([1, 2, 3, 4, 5], factor=10)
[2025-07-14 19:45:01] RETURN procesar_datos -> [10, 20, 30, 40, 50]
⏱️  procesar_datos tardó 102.34ms
Resultado: [10, 20, 30, 40, 50]
[4, 2, 6]`,
      },
      callout: {
        type: 'warning',
        title: 'Siempre usa @functools.wraps',
        content:
          'Sin `@functools.wraps(func)`, la función decorada pierde su `__name__` y `__doc__` originales — pasa a llamarse "wrapper" y no tiene docstring. Esto rompe herramientas de documentación, debugging y profiling. Es uno de los bugs más silenciosos.',
      },
    },
    {
      heading: 'pathlib — manipulación moderna de archivos',
      paragraphs: [
        '`pathlib` es la forma moderna y pythónica de trabajar con paths. Reemplaza a `os.path` con una API orientada a objetos. La clase principal es `Path`, que representa un path y tiene métodos para todo: `.exists()`, `.is_file()`, `.is_dir()`, `.mkdir()`, `.read_text()`, `.write_text()`, `.glob()`, `.iterdir()`. La ventaja principal: funciona igual en Windows, macOS y Linux sin preocuparte por separadores.',
        'Las operaciones comunes son extremadamente limpias con pathlib. Para leer un archivo: `Path("data.csv").read_text(encoding="utf-8")`. Para crear directorio: `Path("output/charts").mkdir(parents=True, exist_ok=True)`. Para iterar archivos: `for f in Path(".").glob("*.csv"):`. Para unir paths: `Path("data") / "ventas.csv"` (usa `/` como operador).',
        'En data science, pathlib brilla cuando organizas datasets. Por ejemplo, partitionar por fecha: `Path("data") / "2025" / "07" / "ventas.csv"`. Crear la estructura completa con un solo comando: `ruta.mkdir(parents=True, exist_ok=True)`. Buscar todos los CSVs en subcarpetas: `list(Path("data").rglob("*.csv"))`.',
      ],
      code: {
        language: 'python',
        title: 'pathlib_demo.py',
        code: `from pathlib import Path

# Crear paths con operador /
data_dir = Path("data")
csv_file = data_dir / "ventas" / "2025-07.csv"
print(csv_file)  # data/ventas/2025-07.csv (en cualquier OS)

# Crear directorios
output_dir = Path("output") / "charts" / "julio"
output_dir.mkdir(parents=True, exist_ok=True)
# parents=True: crea toda la jerarquía si no existe
# exist_ok=True: no falla si ya existe

# Verificar existencia
print(f"¿Existe data? {Path('data').exists()}")

# Leer/escribir archivos de texto
config_path = Path("config.txt")
config_path.write_text("debug=True\\nport=5432", encoding="utf-8")
contenido = config_path.read_text(encoding="utf-8")

# Iterar archivos en un directorio
for f in Path(".").glob("*.py"):
    print(f"  {f.name} ({f.stat().st_size} bytes)")

# Buscar recursivamente
todos_los_csvs = list(Path(".").rglob("*.csv"))
print(f"Encontrados {len(todos_los_csvs)} CSVs")

# Partes del path
p = Path("/home/usuario/proyectos/ds/ventas.csv")
print(p.parent)    # /home/usuario/proyectos/ds
print(p.name)      # ventas.csv
print(p.stem)      # ventas
print(p.suffix)    # .csv
print(p.parts)     # ('/', 'home', 'usuario', 'proyectos', 'ds', 'ventas.csv')`,
      },
    },
    {
      heading: 'datetime — manipulación profesional de fechas',
      paragraphs: [
        'El módulo `datetime` tiene 4 clases principales: `date` (solo fecha), `time` (solo hora), `datetime` (fecha+hora), `timedelta` (duración). La regla #1: SIEMPRE trabaja con objetos datetime, nunca con strings. Si comparas "2025-07-14" con "2025-08-01" como strings, te funciona por accidente (orden lexicográfico), pero falla con formatos como "07/14/2025". Con objetos datetime, las comparaciones son correctas siempre.',
        'Para parsear strings a datetime, usa `datetime.strptime(s, formato)`. El formato usa códigos: `%Y` (año 4 dígitos), `%m` (mes), `%d` (día), `%H` (hora 24h), `%M` (minutos), `%S` (segundos). Para formato ISO 8601 (que es el estándar), usa `datetime.fromisoformat("2025-07-14T19:45:00")` sin formato. Para convertir datetime a string, usa `strftime(formato)` o `.isoformat()`.',
        'En data science, vas a usar `timedelta` para calcular diferencias entre fechas. `timedelta(days=7)` es una semana. `fecha2 - fecha1` devuelve un timedelta. `fecha + timedelta(days=30)` suma 30 días. Para timezone-aware datetimes (que SIEMPRE debes usar en producción), importa `from datetime import timezone` y usa `dt.replace(tzinfo=timezone.utc)` o la librería `pytz`/`zoneinfo` para timezones específicos.',
      ],
      code: {
        language: 'python',
        title: 'fechas.py',
        code: `from datetime import datetime, date, timedelta

# Crear fechas
hoy = date.today()
ahora = datetime.now()
print(f"Hoy: {hoy}")          # 2025-07-14
print(f"Ahora: {ahora}")       # 2025-07-14 19:45:01.123456

# Parsear strings
fecha_str = "2025-07-14"
fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
print(f"Fecha parseada: {fecha}")

# ISO format (recomendado para APIs y almacenamiento)
iso = datetime.now().isoformat()
print(f"ISO: {iso}")  # 2025-07-14T19:45:01.123456

# Formatear para mostrar al usuario
formateada = ahora.strftime("%d/%m/%Y %H:%M")
print(f"Formateada: {formateada}")  # 14/07/2025 19:45

# timedelta — diferencias y sumas
manana = hoy + timedelta(days=1)
hace_una_semana = hoy - timedelta(weeks=1)
diferencia = manana - hoy
print(f"Diferencia: {diferencia.days} día(s)")  # 1

# Caso real: calcular edad
def calcular_edad(fecha_nacimiento):
    """Calcula edad a partir de fecha de nacimiento."""
    hoy = date.today()
    edad = hoy.year - fecha_nacimiento.year
    # Ajustar si aún no cumplió años este año
    if (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day):
        edad -= 1
    return edad

nacimiento = date(1995, 8, 23)
print(f"Edad: {calcular_edad(nacimiento)} años")

# Comparaciones (siempre con objetos datetime, no strings)
fecha1 = datetime(2025, 7, 14)
fecha2 = datetime(2025, 8, 1)
if fecha1 < fecha2:
    print("fecha1 es antes que fecha2")`,
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos un organizador automático de archivos con decorators, pathlib y datetime. Es un script real de productividad que podrías usar mañana en tu trabajo: toma una carpeta caótica de descargas y organiza los archivos por tipo y fecha. Verás cómo todos los conceptos (funciones, módulos, decorators, pathlib, datetime) se integran naturalmente.',
    steps: [
      {
        description: 'Crear decorators de timing y logging reutilizable',
        code: {
          language: 'python',
          title: 'file_organizer.py',
          code: `import functools
import time
from datetime import datetime
from pathlib import Path

def timing(func):
    """Mide cuánto tarda una función."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = (time.perf_counter() - inicio) * 1000
        print(f"⏱️  {func.__name__}: {elapsed:.2f}ms")
        return result
    return wrapper

def log_to_file(log_path):
    """
    Decorator con parámetro: loggea cada llamada a un archivo.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            timestamp = datetime.now().isoformat()
            log_entry = f"[{timestamp}] {func.__name__} called\\n"
            # Append al log
            with open(log_path, "a", encoding="utf-8") as f:
                f.write(log_entry)
            return func(*args, **kwargs)
        return wrapper
    return decorator`,
        },
        why: 'Estos dos decorators (`timing` y `log_to_file`) son reutilizables en cualquier proyecto. En ML production, los decorators de timing te ayudan a identificar cuellos de botella, y los de logging te permiten auditar qué funciones se ejecutaron y cuándo. Es código que vale oro.',
      },
      {
        description: 'Implementar la lógica de organización con pathlib',
        code: {
          language: 'python',
          title: 'file_organizer.py',
          code: `# Mapeo de extensiones a carpetas
EXTENSION_MAP = {
    ".csv": "data",
    ".json": "data",
    ".xlsx": "data",
    ".png": "images",
    ".jpg": "images",
    ".jpeg": "images",
    ".gif": "images",
    ".pdf": "documents",
    ".docx": "documents",
    ".txt": "documents",
    ".py": "code",
    ".ipynb": "code",
}

@timing
@log_to_file("organizer.log")
def organizar_carpeta(carpeta_origen, carpeta_destino=None):
    """
    Organiza archivos de carpeta_origen por extensión.
    Crea subcarpetas: data/, images/, documents/, code/, otros/
    """
    origen = Path(carpeta_origen)
    if not origen.exists():
        raise FileNotFoundError(f"Carpeta no existe: {origen}")

    destino = Path(carpeta_destino) if carpeta_destino else origen

    movidos = 0
    for archivo in origen.iterdir():
        if not archivo.is_file():
            continue

        # Determinar categoría
        categoria = EXTENSION_MAP.get(archivo.suffix.lower(), "otros")

        # Crear subcarpeta
        subcarpeta = destino / categoria
        subcarpeta.mkdir(exist_ok=True)

        # Mover archivo
        nuevo_path = subcarpeta / archivo.name
        archivo.rename(nuevo_path)
        print(f"  ✓ {archivo.name} → {categoria}/")
        movidos += 1

    return movidos

# Crear archivos de prueba
Path("test_organizer").mkdir(exist_ok=True)
for nombre in ["ventas.csv", "config.json", "foto.png", "reporte.pdf", "script.py", "nota.txt"]:
    (Path("test_organizer") / nombre).touch()

print("Antes:")
for f in Path("test_organizer").iterdir():
    print(f"  {f.name}")

# Ejecutar
total = organizar_carpeta("test_organizer")
print(f"\\n✓ {total} archivos organizados")`,
          output: `Antes:
  ventas.csv
  config.json
  foto.png
  reporte.pdf
  script.py
  nota.txt
  ✓ ventas.csv → data/
  ✓ config.json → data/
  ✓ foto.png → images/
  ✓ reporte.pdf → documents/
  ✓ script.py → code/
  ✓ nota.txt → documents/
⏱️  organizar_carpeta: 12.45ms

✓ 6 archivos organizados`,
        },
        why: 'La función `organizar_carpeta` demuestra varios patrones profesionales: (1) usa pathlib para operaciones cross-platform, (2) usa EXTENSION_MAP como configuración declarativa (fácil de extender), (3) maneja el caso de categoría desconocida con default "otros", (4) está decorada con timing y logging. Este es el tipo de código que ves en codebases serios.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora practicamos con un caso real: vas a crear un módulo de utilidades para limpieza de datos. El módulo tendrá funciones decoradas con logging y timing, y lo vas a importar desde un script principal.',
    steps: [
      {
        instruction: 'Crea un módulo data_utils.py con una función limpiar_texto() decorada con logging',
        hint: 'Usa @functools.wraps, define el decorator log_call primero, luego aplícalo. La función debe hacer strip, lower, y eliminar caracteres especiales.',
        starterCode: {
          language: 'python',
          title: 'data_utils.py',
          code: `import functools
import re
from datetime import datetime

# TODO: define decorator log_call

# TODO: aplica decorator
def limpiar_texto(texto):
    """Limpia un texto: strip, lower, sin caracteres especiales."""
    # Tu código aquí
    pass`,
        },
        solutionCode: {
          language: 'python',
          title: 'data_utils.py',
          code: `import functools
import re
from datetime import datetime

def log_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        ts = datetime.now().isoformat()
        print(f"[{ts}] CALL {func.__name__}({args!r})")
        result = func(*args, **kwargs)
        print(f"[{ts}] RETURN {result!r}")
        return result
    return wrapper

@log_call
def limpiar_texto(texto):
    """Limpia un texto: strip, lower, sin caracteres especiales."""
    if not isinstance(texto, str):
        raise TypeError(f"Se esperaba str, recibido {type(texto).__name__}")
    texto = texto.strip().lower()
    texto = re.sub(r'[^a-z0-9\\s]', '', texto)
    texto = re.sub(r'\\s+', ' ', texto)
    return texto

if __name__ == "__main__":
    # Solo se ejecuta cuando corres: python data_utils.py
    print(limpiar_texto("  Hola, Mundo!!  "))
    print(limpiar_texto("Lima, Perú - 2025"))`,
          output: `[2025-07-14T19:45:01] CALL limpiar_texto(('  Hola, Mundo!!  ',))
[2025-07-14T19:45:01] RETURN 'hola mundo'
hola mundo
[2025-07-14T19:45:01] CALL limpiar_texto(('Lima, Perú - 2025',))
[2025-07-14T19:45:01] RETURN 'lima per 2025'
lima per 2025`,
        },
      },
    ],
  },
  youDo: {
    title: 'File Organizer Automation Script — Tu primera herramienta de productividad',
    context:
      'Vas a construir un script que automáticamente organiza una carpeta por tipo de archivo, con logging y timing. Es exactamente el tipo de automatización que un Data Analyst junior escribe para ahorrar tiempo del equipo: organizar outputs de modelos, separar datasets por fecha, etc. Súbelo a tu GitHub como "file-organizer".',
    objectives: [
      'Crear script que organize archivos por extensión en subcarpetas',
      'Implementar decorator @timing para medir performance',
      'Implementar decorator @log_to_file para auditar llamadas',
      'Usar pathlib para todas las operaciones de archivos (cross-platform)',
      'Manejar errores: FileNotFoundError, PermissionError',
    ],
    requirements: [
      'Función organizar(carpeta) con decorator @timing',
      'Decorator @log_to_file(ruta_log) que registre timestamp + función',
      'Usar EXTENSION_MAP dict para configurar categorías',
      'Crear subcarpetas data/, images/, documents/, code/, otros/',
      'try/except para FileNotFoundError y PermissionError',
      'Usar datetime para timestamps en el log',
      'main() con argumentos desde línea de comandos (sys.argv)',
      'if __name__ == "__main__"',
    ],
    starterCode: `import functools
import sys
import time
from datetime import datetime
from pathlib import Path

EXTENSION_MAP = {
    # TODO: completar
}

def timing(func):
    # TODO: implementar
    pass

def log_to_file(log_path):
    # TODO: decorator con parámetro
    pass

def organizar(carpeta):
    # TODO: implementar
    pass

def main():
    # TODO: leer carpeta de sys.argv[1]
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'Este script demuestra que sabes escribir código production-ready: decorators, manejo de errores, módulos organizados, pathlib cross-platform. En entrevistas, muéstralo y explica el patrón decorator — es una pregunta frecuente para puestos mid-level.',
    rubric: [
      { criterion: 'Decorators @timing y @log_to_file funcionan', weight: '25%' },
      { criterion: 'pathlib usado correctamente (no os.path)', weight: '20%' },
      { criterion: 'Manejo de errores robusto', weight: '20%' },
      { criterion: 'EXTENSION_MAP configurable y extensible', weight: '15%' },
      { criterion: 'Código modular con if __name__ == "__main__"', weight: '10%' },
      { criterion: 'README con instrucciones de uso', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué hace `@functools.wraps(func)` en un decorator?',
        options: [
          'Hace la función más rápida',
          'Preserva __name__ y __doc__ de la función original',
          'Es opcional, solo para estilo',
          'Permite que el decorator acepte parámetros',
        ],
        correctIndex: 1,
        explanation:
          'Sin @functools.wraps, la función decorada pierde su nombre original (se llama "wrapper") y su docstring. Esto rompe herramientas de debugging y documentación. Siempre úsalo.',
      },
      {
        question: '¿Qué imprime `Path("data") / "ventas.csv"` en Windows?',
        options: [
          'Error: no se puede dividir un Path',
          'data\\\\ventas.csv',
          'data/ventas.csv (Path lo normaliza al OS)',
          'data\\\\ventas.csv o data/ventas.csv según OS',
        ],
        correctIndex: 3,
        explanation:
          'pathlib usa `/` como operador para unir paths. Internamente normaliza al separador del OS — en Windows será backslash, en Linux/macOS forward slash. Tu código funciona igual en ambos.',
      },
      {
        question: '¿Cuál es la forma correcta de parsear "2025-07-14" a un objeto date?',
        options: [
          'date.from_string("2025-07-14")',
          'datetime.strptime("2025-07-14", "%Y-%m-%d").date()',
          'date.parse("2025-07-14")',
          'Date("2025-07-14")',
        ],
        correctIndex: 1,
        explanation:
          '`strptime` parsea string con un formato. Los códigos %Y (año), %m (mes), %d (día) son estándar POSIX. El método `.date()` extrae solo la fecha del datetime resultante.',
      },
      {
        question: '¿Para qué sirve `if __name__ == "__main__":`?',
        options: [
          'Para definir la función principal del módulo',
          'Para que el código se ejecute solo cuando el archivo se corre directamente, no cuando se importa',
          'Es equivalente a main() en C',
          'Para indicar que el módulo es ejecutable',
        ],
        correctIndex: 1,
        explanation:
          'Cuando importas un módulo, `__name__` vale el nombre del módulo. Cuando lo ejecutas directamente (`python mi_mod.py`), `__name__` vale "__main__". Esto permite tener código de prueba que solo corre en ejecución directa.',
      },
      {
        question: '¿Qué son los keyword-only args y cómo se definen?',
        options: [
          'Args que solo se pueden pasar como keyword, definidos después de *',
          'Args que solo aceptan strings',
          'Args opcionales con valor por defecto',
          'Args que vienen después de **kwargs',
        ],
        correctIndex: 0,
        explanation:
          '`def f(a, b, *, debug=False):` define `debug` como keyword-only. El caller DEBE usar `f(1, 2, debug=True)`, no `f(1, 2, True)`. Esto mejora legibilidad y evita bugs por orden de args.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — functools', url: 'https://docs.python.org/3/library/functools.html', note: 'Decorators, lru_cache, partial' },
      { label: 'Python — pathlib', url: 'https://docs.python.org/3/library/pathlib.html', note: 'Manipulación moderna de paths' },
      { label: 'Real Python — Decorators', url: 'https://realpython.com/primer-on-python-decorators/', note: 'Tutorial completo de decorators' },
      { label: 'PEP 8 — Modules', url: 'https://peps.python.org/pep-0008/#module-level-dunder-names', note: 'Convenciones para módulos' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre decorators y metaprogramming. Profundiza el patrón.' },
      { label: 'python201', note: 'Capítulo sobre decorators avanzados y context managers.' },
    ],
    courses: [
      { label: 'Real Python — Decorators', url: 'https://realpython.com/courses/python-decorators-101/', note: 'Curso interactivo sobre decorators' },
    ],
  },
}
