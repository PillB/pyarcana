import type { CourseSection } from '../../types'

export const section12: CourseSection = {
  id: 'performance',
  index: 12,
  title: 'Performance, Concurrency & Logging',
  shortTitle: 'Performance & Logging',
  tagline:
    'Multiprocessing, profiling, logging y argparse — código production-ready',
  estimatedHours: 10,
  level: 'Avanzado',
  icon: 'Gauge',
  accentColor: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  jobRelevance:
    'En cualquier pega seria de data, el código tiene que ser RÁPIDO, OBSERVABLE y REUSABLE. "Rápido" significa paralelizar feature engineering con multiprocessing para que un job de 4 horas baje a 35 minutos. "Observable" significa logging estructurado para que cuando el pipeline se cae a las 3am, los logs te digan EXACTAMENTE en qué etapa y por qué — sin reproducir el error en tu laptop. "Reusable" significa empaquetarlo como CLI con argparse para que tus colegas lo usen sin abrir un notebook. Estas 4 skills — multiprocessing, profiling, logging, argparse — son lo que separa un junior que escribe scripts que "funcionan en mi laptop" de un senior que entrega pipelines production-ready que corren en servidores, scheduleados, monitoreados, y usados por todo el equipo de data. En empresas peruanas como Interbank, BBVA, Mercado Libre y Rimac, este perfil cobra 40-60% más que un Data Analyst que solo sabe pandas.',
  learningOutcomes: [
    { text: 'Paralelizar feature engineering con multiprocessing y concurrent.futures (Process vs Thread)' },
    { text: 'Entender el GIL y cuándo usar ProcessPoolExecutor vs ThreadPoolExecutor' },
    { text: 'Perfil código con timeit, cProfile y line_profiler para encontrar bottlenecks' },
    { text: 'Configurar logging estructurado (JSON, RotatingFileHandler) para pipelines en producción' },
    { text: 'Convertir notebooks en herramientas CLI reutilizables con argparse' },
    { text: 'Empaquetar un CLI como ejecutable instalable con pyproject.toml + entry_points' },
  ],
  theory: [
    {
      heading: 'Multiprocessing & concurrent.futures — Process vs Thread y el GIL',
      paragraphs: [
        'Python tiene el famoso GIL (Global Interpreter Lock): solo un thread ejecuta bytecode Python a la vez. Esto significa que `threading` NO acelera tareas CPU-bound (cálculo puro, transformación de datos, modelos de ML) — todos los threads compiten por el mismo GIL y terminan corriendo secuencialmente. Para acelerar tareas CPU-bound necesitas `multiprocessing`: procesos separados del sistema operativo, cada uno con su propio GIL y su propio espacio de memoria, corriendo en paralelo en múltiples cores. En una laptop de 8 cores, una tarea CPU-bound puede correr 6-7x más rápido (no 8x por el overhead de crear procesos y serializar datos). En servidores cloud con 32 cores, los speedups son dramáticos — un job de 8 horas baja a 20 minutos.',
        'La API moderna y recomendada es `concurrent.futures.ProcessPoolExecutor` y `ThreadPoolExecutor`. El patrón básico es limpio: `with ProcessPoolExecutor() as executor: results = list(executor.map(func, items))`. Esto crea un pool de procesos workers, distribuye los items, y recolecta resultados en orden. Para tareas CPU-bound (calcular features por cliente, transformar imágenes, encodear videos, hyperparameter sweep) usa Process. Para I/O-bound (scrapear 100 URLs, llamar 50 APIs, leer 20 archivos de disco) usa Thread — porque durante la espera de I/O el GIL se libera y otros threads pueden avanzar. La regla mnemotécnica: si tu función pasa el 90% del tiempo esperando red/disco → Thread; si pasa el 90% calculando → Process.',
        'El caso de uso clásico en DS: tienes 500k clientes y necesitas calcular 20 features por cliente (RFM: recencia, frecuencia, monetario, más features de comportamiento). En single-process tarda 4 horas. Con `ProcessPoolExecutor(max_workers=8)` y `executor.map(calcular_features, chunks_de_clientes)`, baja a 35 minutos. Otro caso: hyperparameter sweep con 100 configs de modelo — en paralelo corren 8 a la vez, el sweep completo baja de 8 horas a 1 hora. Cuidado con 3 trampas: (1) memoria — cada proceso copia data, pasa chunks chicos no DataFrames gigantes, o tu RAM explota; (2) funciones lambda — no se pueden picklear (serializar para enviar a otro proceso), usa funciones top-level con `def`; (3) shared state — multiprocessing tiene Queues y Managers pero es complejo, mejor diseñar funciones puras sin estado compartido.',
      ],
      code: {
        language: 'python',
        title: 'paralelo_features.py',
        code: `import pandas as pd
import numpy as np
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
import requests
import time

# === 1. CPU-bound: feature engineering en paralelo ===
def calcular_features_cliente(cliente_id: int) -> dict:
    """Simula cómputo pesado por cliente (en la vida real: query DB, transforma, calcula 20 features)."""
    np.random.seed(cliente_id)  # determinista para reproducibilidad
    historial = np.random.exponential(30, 365)  # 365 días de compras simuladas
    recencia = 365 - np.argmax(historial[::-1] > 0)  # días desde última compra
    frecuencia = (historial > 0).sum()
    monetario = float(historial.sum())
    return {
        "cliente_id": cliente_id,
        "recencia": int(recencia),
        "frecuencia": int(frecuencia),
        "monetario": monetario,
        "rfm_score": recencia * 0.3 + frecuencia * 0.4 + monetario * 0.3,
    }

# Single-process (lento — baseline)
start = time.time()
n_clientes = 10_000
resultados_seq = [calcular_features_cliente(i) for i in range(n_clientes)]
print(f"Secuencial: {time.time() - start:.1f}s")
# Secuencial: 8.5s

# Paralelo (rápido — usa todos los cores disponibles)
start = time.time()
with ProcessPoolExecutor(max_workers=8) as executor:
    resultados_par = list(executor.map(calcular_features_cliente, range(n_clientes)))
print(f"Paralelo (8 workers): {time.time() - start:.1f}s")
# Paralelo (8 workers): 1.4s  (~6x speedup)

# === 2. I/O-bound: scrapear 50 URLs en paralelo con ThreadPoolExecutor ===
def fetch_url(url: str) -> tuple[str, int]:
    """Descarga una URL y devuelve (url, status_code)."""
    try:
        resp = requests.get(url, timeout=10)
        return (url, resp.status_code)
    except Exception:
        return (url, -1)

urls = [f"https://api.mercadolibre.com/items/ML{i}" for i in range(50)]

# Threads son ideales para I/O porque durante la espera de red, el GIL se libera
start = time.time()
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(fetch_url, url) for url in urls]
    resultados_io = [f.result() for f in as_completed(futures)]
print(f"50 URLs en paralelo (10 threads): {time.time() - start:.2f}s")
# 50 URLs en paralelo (10 threads): 1.85s  (vs ~15s secuencial)

# === 3. Procesar un DataFrame en chunks paralelos ===
def procesar_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """Aplica feature engineering a un chunk del DataFrame — función pura, sin estado."""
    chunk = chunk.copy()
    chunk["log_monto"] = np.log1p(chunk["monto"])
    chunk["monto_zscore"] = (chunk["monto"] - chunk["monto"].mean()) / chunk["monto"].std()
    chunk["es_outlier"] = chunk["monto_zscore"].abs() > 3
    return chunk

df_grande = pd.DataFrame({
    "cliente_id": range(100_000),
    "monto": np.random.exponential(500, 100_000),
})

# Partir en 8 chunks, procesar en paralelo, recombinar
start = time.time()
chunks = np.array_split(df_grande, 8)
with ProcessPoolExecutor(max_workers=8) as executor:
    chunks_procesados = list(executor.map(procesar_chunk, chunks))
df_final = pd.concat(chunks_procesados, ignore_index=True)
print(f"DataFrame 100k filas en 8 chunks: {time.time() - start:.2f}s")
print(df_final.head())
#    cliente_id       monto  log_monto  monto_zscore  es_outlier
# 0           0  123.456789   4.820282      0.241983       False
# 1           1   45.678912   3.842156     -0.901234       False
# ...`,
      },
      callout: {
        type: 'tip',
        title: 'Joblib para scikit-learn',
        content:
          'scikit-learn usa joblib internamente para paralelizar — solo pasa `n_jobs=-1` en GridSearchCV, RandomForest, KMeans, etc. y usa todos los cores. Si tu código es sklearn-céntrico, no necesitas escribir multiprocessing manual. Para código custom, usa concurrent.futures. Joblib también ofrece `Parallel(n_jobs=-1)(delayed(func)(x) for x in items)` que es muy similar a ProcessPoolExecutor.map pero con mejor manejo de memoria para arrays numpy.',
      },
    },
    {
      heading: 'Profiling & Benchmarking — timeit, cProfile, line_profiler',
      paragraphs: [
        'La regla #1 de optimización es: NUNCA optimices sin medir primero. La intuición humana sobre qué es lento es pésima — el 80% de las veces, el bottleneck NO es donde crees. Pasas 2 horas optimizando una función que consume el 2% del tiempo y no notas que el 90% se va en otro lado. Por eso necesitas profiling: medir EXACTAMENTE dónde se gasta el tiempo. Python tiene 3 herramientas complementarias: `timeit` (microbenchmarks de snippets chicos), `cProfile` (perfil de toda una ejecución, función por función), y `line_profiler` (perfil línea por línea de UNA función específica). Combinadas, te dicen exactamente qué optimizar y — más importante — qué NO tocar (porque no aporta al tiempo total).',
        '`timeit` es para comparar implementaciones de un mismo algoritmo. Por ejemplo: ¿es más rápido `[x*2 for x in range(1000)]` o `list(map(lambda x: x*2, range(1000)))`? Con `timeit.timeit(stmt, number=10000)` lo sabes en 2 segundos. Es esencial cuando dudas entre dos formas de escribir algo. `cProfile` es para scripts completos: corres `python -m cProfile -s cumulative mi_script.py` y obtienes una tabla con cada función, cuántas veces se llamó (ncalls), cuánto tiempo total gastó (tottime), y cuánto tiempo cumulativo incluyendo sub-llamadas (cumtime). Identificas la función que se come el 80% del tiempo y la atacas primero — eso es la regla de Pareto aplicada a performance.',
        '`line_profiler` es el más detallado: perfil línea por línea de UNA función. Lo instalas con `pip install line_profiler`, decoras la función con `@profile`, y corres `kernprof -l -v mi_script.py`. Te muestra por cada línea: tiempo total, porcentaje del total, tiempo por llamada, número de hits. Descubres cosas como "esta línea de pandas `.iterrows()` se come el 95% del tiempo" — y la reescribes vectorizada para 100x speedup. En DS, el 80% de las optimizaciones son: (1) reemplazar `.iterrows()` con operaciones vectorizadas de pandas/numpy, (2) usar numpy en vez de Python loops, (3) cachear resultados de funciones puras, (4) usar C-extensions (numba, cython) para hot paths críticos. Sin profiling, optimizas a ciegas; con profiling, cada hora invertida rinde.',
      ],
      code: {
        language: 'python',
        title: 'profiling_demo.py',
        code: `# === 1. timeit: comparar dos implementaciones de un mismo algoritmo ===
import timeit

# Lista por comprehension
t1 = timeit.timeit("[x*2 for x in range(1000)]", number=10000)
# Map con lambda
t2 = timeit.timeit("list(map(lambda x: x*2, range(1000)))", number=10000)
print(f"List comp: {t1:.3f}s")
print(f"Map+lambda: {t2:.3f}s")
# List comp: 0.42s
# Map+lambda: 0.58s  (list comp gana por 30%)

# === 2. cProfile: perfil de script completo ===
# Guarda como perf_demo.py y corre:
#   python -m cProfile -s cumulative perf_demo.py
import pandas as pd
import numpy as np

def procesar_datos_lento(n: int = 100_000):
    """Forma LENTA: itera con .iterrows() — el antipatrón #1 de pandas."""
    df = pd.DataFrame({"x": np.random.randn(n), "y": np.random.randn(n)})
    resultado = []
    for _, row in df.iterrows():
        resultado.append(row["x"] ** 2 + row["y"] ** 2)
    return sum(resultado)

def procesar_datos_rapido(n: int = 100_000):
    """Forma RÁPIDA: vectorizada con numpy/pandas."""
    df = pd.DataFrame({"x": np.random.randn(n), "y": np.random.randn(n)})
    return float((df["x"] ** 2 + df["y"] ** 2).sum())

# Output de cProfile (top 10 por tiempo cumulativo):
#    ncalls  tottime  percall  cumtime  percall filename:lineno(function)
#       100  185.234    1.852  185.234    1.852 perf_demo.py:5(procesar_datos_lento)
#   10000000   12.451    0.000   12.451    0.000 {method 'append' of 'list' objects}
#         1    0.045    0.045    0.045    0.045 perf_demo.py:13(procesar_datos_rapido)
# → El 99.9% del tiempo está en procesar_datos_lento. Optimiza SOLO eso.

# === 3. line_profiler: perfil línea por línea ===
# Instala: pip install line_profiler
# Decora la función con @profile (line_profiler lo provee automáticamente)
# Corre: kernprof -l -v perf_demo.py

# @profile  # descomenta para usar line_profiler
def feature_engineering(df):
    n = len(df)
    df["log_x"] = np.log1p(df["x"])                              # 5% del tiempo
    df["zscore"] = (df["x"] - df["x"].mean()) / df["x"].std()    # 3%
    df["rolling_mean"] = df["x"].rolling(7).mean()               # 15%
    df["categoria"] = pd.cut(df["x"], bins=10, labels=False)     # 8%
    for i in range(n):                                           # ESTA LÍNEA: 65% del tiempo
        df.loc[i, "custom"] = df.loc[i, "x"] * 2  # .loc[i] es O(n)
    return df

# Output de line_profiler:
# Line #  Hits    Time  Per Hit  % Time  Line Contents
# =====================================================
#      3     1       5      5.0      0.0  def feature_engineering(df):
#      4     1   15000  15000.0      5.0    df["log_x"] = np.log1p(df["x"])
#      5     1    9000   9000.0      3.0    df["zscore"] = ...
#      6     1   45000  45000.0     15.0    df["rolling_mean"] = ...
#      7     1   24000  24000.0      8.0    df["categoria"] = pd.cut(...)
#      8 100001  195000      1.9     65.0    for i in range(n):
#      9 100000   60000      0.6     20.0      df.loc[i, "custom"] = df.loc[i, "x"] * 2
# → El loop con .loc[i] es el bottleneck. Vectoriza: df["custom"] = df["x"] * 2
#   (1 línea, 100x más rápido)

# === 4. memory_profiler (bonus para detectar memory leaks) ===
# pip install memory_profiler
# Decorador @profile, corres: python -m memory_profiler script.py
# Te muestra uso de RAM línea por línea — útil para detectar memory leaks en pipelines`,
      },
      callout: {
        type: 'info',
        title: 'Regla de oro: mide, no adivines',
        content:
          'Antes de optimizar, SIEMPRE corre cProfile. El 80% de las optimizaciones "intuitivas" no producen speedup real porque atacan el 20% del código. Mide, identifica el hot path, optimiza SOLO ese, vuelve a medir. Itera. Es lo que diferencia a seniors de juniors: los seniors perfilan, los juniors adivinan y pierden tiempo en cosas que no importan.',
      },
    },
    {
      heading: 'Logging — producción DS necesita logs estructurados',
      paragraphs: [
        '`print()` es para debugging en desarrollo. `logging` es para producción. La diferencia es enorme: print siempre imprime (no puedes desactivarlo sin comentar líneas o redirigir stdout), no tiene niveles, no tiene timestamps automáticos, no escribe a archivo sin redirección manual con `>`. El módulo `logging` (built-in, sin instalar nada) resuelve todo: niveles (DEBUG/INFO/WARNING/ERROR/CRITICAL) que puedes subir/bajar en runtime, formato configurable (timestamp, nivel, módulo, mensaje), múltiples destinos (consola, archivo, syslog, HTTP endpoint), y se desactiva por nivel en producción. En un pipeline de DS en producción, sin logs no puedes debuggear un fallo a las 3am — los logs son tu única pista de qué pasó.',
        'Configuración básica: `logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s", handlers=[...])`. Creas un logger por módulo con `logger = logging.getLogger(__name__)` (el `__name__` te dice qué módulo escribió el log). Usas `logger.info("Procesando %d filas", n)` — ¡SIEMPRE usa %-format, no f-string, para que el formato se aplique solo si el nivel está activo! En producción subes el nivel a WARNING (o ERROR) para reducir ruido. Para DS, loggea: inicio/fin de cada etapa del pipeline, cuántos registros procesaste en cada etapa, tiempo de cada etapa, advertencias (datos faltantes, outliers detectados), errores con traceback completo (logger.exception() lo hace automáticamente dentro de un except).',
        'Para logs estructurados (machine-parseable, lo que usan Datadog, ELK, Splunk), usa JSON: cada log es un dict con timestamp, level, message, y campos custom (run_id, n_rows, duration_sec). Esto permite buscar en Kibana/Datadog con queries como `level:ERROR AND module:feature_eng AND n_rows>10000` — imposible con logs en texto plano. La librería `structlog` o `python-json-logger` lo facilitan. En empresas serias, los logs van a un sistema centralizado (ELK stack, Splunk, Datadog) donde los consulta el equipo on-call. Como Data Scientist, SIEMPRE loggea tus pipelines — si fallan en prod, los logs son tu única forma de diagnosticar sin reproducir el entorno exacto (que muchas veces es imposible).',
      ],
      code: {
        language: 'python',
        title: 'logging_setup.py',
        code: `import logging
import sys
from pathlib import Path

# === 1. Configuración básica con dos handlers (consola + archivo) ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),                      # consola
        logging.FileHandler("pipeline.log", encoding="utf-8"),  # archivo
    ],
)
logger = logging.getLogger(__name__)

# Uso por niveles (DEBUG < INFO < WARNING < ERROR < CRITICAL)
logger.debug("Mensaje detallado (solo visible con level=DEBUG)")  # no se muestra si level=INFO
logger.info("Pipeline iniciado")                                   # se muestra
logger.warning("Dataset tiene 5 nulos, imputando con mediana")    # se muestra
logger.error("Falló la conexión a la API de SUNAT")               # se muestra
logger.critical("Disco lleno, no se puede escribir resultados")   # se muestra

# === 2. Logger en un pipeline de DS (el caso real) ===
import pandas as pd
import time

def run_pipeline(csv_path: str):
    logger.info("Iniciando pipeline para %s", csv_path)  # %-format, no f-string!

    start = time.time()
    try:
        df = pd.read_csv(csv_path)
        logger.info("Cargado %d filas, %d columnas en %.2fs",
                    len(df), df.shape[1], time.time() - start)
    except FileNotFoundError:
        logger.error("Archivo no encontrado: %s", csv_path)
        raise

    # Limpieza: detectar y reportar nulos
    n_nulos_antes = df.isnull().sum().sum()
    if n_nulos_antes > 0:
        logger.warning("%d nulos detectados, imputando con mediana", n_nulos_antes)
        df = df.fillna(df.median(numeric_only=True))

    # Feature engineering
    start = time.time()
    df["log_monto"] = df["monto"].apply(lambda x: max(0, x))
    logger.info("Feature engineering completado en %.2fs", time.time() - start)

    # Guardar
    out_path = csv_path.replace(".csv", "_procesado.parquet")
    df.to_parquet(out_path)
    logger.info("Guardado en %s (%d filas)", out_path, len(df))

    return df

# === 3. JSON logging estructurado (para producción con Datadog/ELK) ===
# pip install python-json-logger
import logging.config

LOG_CONFIG = {
    "version": 1,
    "handlers": {
        "json_file": {
            "class": "logging.FileHandler",
            "filename": "pipeline_structured.log",
            "formatter": "json",
        },
    },
    "formatters": {
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
        },
    },
    "loggers": {
        "pipeline": {"handlers": ["json_file"], "level": "INFO"},
    },
}
# logging.config.dictConfig(LOG_CONFIG)
# Cada log se escribe como JSON:
# {"asctime": "2024-01-15 10:30:45", "name": "pipeline", "levelname": "INFO", "message": "..."}

# === 4. Logging en archivos rotados (no crecen infinitamente) ===
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    "app.log",
    maxBytes=10 * 1024 * 1024,  # 10 MB por archivo
    backupCount=5,               # mantener 5 archivos viejos: app.log.1, app.log.2, ...
)
handler.setFormatter(logging.Formatter(
    "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
))
logger.addHandler(handler)

# Output esperado en pipeline.log:
# 2024-01-15 10:30:45 [INFO] pipeline: Iniciando pipeline para ventas.csv
# 2024-01-15 10:30:46 [INFO] pipeline: Cargado 10000 filas, 8 columnas en 0.85s
# 2024-01-15 10:30:46 [WARNING] pipeline: 45 nulos detectados, imputando con mediana
# 2024-01-15 10:30:47 [INFO] pipeline: Feature engineering completado en 0.42s
# 2024-01-15 10:30:47 [INFO] pipeline: Guardado en ventas_procesado.parquet (10000 filas)`,
      },
      callout: {
        type: 'warning',
        title: 'Nunca uses f-strings en logs',
        content:
          'Mal: `logger.info(f"Procesé {n} filas")`. Bien: `logger.info("Procesé %d filas", n)`. Con f-string, el formato se evalúa SIEMPRE, incluso si el nivel está apagado (waste de CPU). Con %-format, el formato se aplica solo si el mensaje se va a mostrar. En pipelines con miles de logs debug por segundo, esto es 5-10x más rápido. Es un detalle que se nota en code reviews seniors.',
      },
    },
    {
      heading: 'argparse / CLI tooling — de notebook a herramienta reusable',
      paragraphs: [
        'Un notebook Jupyter es excelente para explorar, pero NO es reusable: tienes que abrirlo, cambiar celdas, re-ejecutar todo en orden. Para que tu código lo usen otros (o tú mismo en 6 meses cuando ya no recuerdas qué celda hacer primero), necesitas un CLI (Command Line Interface) con `argparse`. Esto convierte tu script en una herramienta: `python pipeline.py --input ventas.csv --output resultado.parquet --verbose` en vez de editar variables dentro del código. En equipos de data science, los CLIs son la forma estándar de compartir pipelines — un colega hace `pip install -e .` y luego corre `mi-pipeline --help` sin abrir un notebook.',
        '`argparse` es built-in (sin instalar nada). Patrón básico: `parser = argparse.ArgumentParser(description="...")`, `parser.add_argument("--input", required=True, help="Archivo CSV de entrada")`, `args = parser.parse_args()`. Soporta tipos (`type=int`, `type=float`, `type=Path`), valores default (`default=100`), choices (`choices=["prod", "dev"]` para restringir opciones), flags booleanas (`--verbose`, `action="store_true"`), múltiples valores (`nargs="+"` para listas), y subcomandos (`git push`, `git pull` estilo). El atributo `--help` se genera automáticamente desde tus `help=` strings — documentación gratis que nunca se desactualiza porque vive al lado del código.',
        'Para proyectos serios, evoluciona a `click` (sintaxis con decoradores más limpia) o `typer` (type hints nativos, autocompletado en shell, generado por el mismo autor de FastAPI). Pero argparse es suficiente para 80% de casos y está en la stdlib. Empaqueta tu CLI como un ejecutable con `pyproject.toml` + `entry_points`: defines `[project.scripts] mi-tool = "mi_paquete.cli:main"` y luego de `pip install -e .`, corres `mi-tool` desde cualquier lado sin prefijar `python`. Esto es lo que hace que tu proyecto parezca "profesional" — un comando instalable, no un script que hay que ejecutar con `python ruta/al/script.py`. En tu portafolio, tener un CLI instalable con tests vale 10x más que un notebook solitario.',
      ],
      code: {
        language: 'python',
        title: 'cli_pipeline.py',
        code: `import argparse
import sys
import logging
import pandas as pd
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(
        description="Pipeline de limpieza y feature engineering para datasets de ventas.",
        epilog="Ejemplo: python cli_pipeline.py --input ventas.csv --output limpio.parquet --verbose",
    )
    parser.add_argument("--input", "-i", required=True, type=Path,
                        help="Ruta al archivo CSV de entrada")
    parser.add_argument("--output", "-o", required=True, type=Path,
                        help="Ruta al archivo de salida (.parquet o .csv)")
    parser.add_argument("--impute-strategy", default="median",
                        choices=["median", "mean", "drop"],
                        help="Estrategia para imputar nulos (default: median)")
    parser.add_argument("--outlier-threshold", type=float, default=1.5,
                        help="Multiplicador IQR para detectar outliers (default: 1.5)")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Mostrar logs detallados (DEBUG)")
    parser.add_argument("--chunksize", type=int, default=None,
                        help="Tamaño de chunk para CSVs grandes (default: cargar todo)")

    args = parser.parse_args()

    # Configurar logging según verbosity (subir/bajar nivel en runtime)
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s [%(levelname)s] %(message)s")
    logger = logging.getLogger("pipeline")

    # Validar inputs (fallar rápido con mensaje claro)
    if not args.input.exists():
        logger.error("Archivo de entrada no existe: %s", args.input)
        sys.exit(1)

    logger.info("Iniciando pipeline")
    logger.info("  Input:  %s", args.input)
    logger.info("  Output: %s", args.output)
    logger.info("  Impute: %s", args.impute_strategy)

    # Cargar datos (con chunksize para CSVs grandes)
    if args.chunksize:
        chunks = pd.read_csv(args.input, chunksize=args.chunksize)
        df = pd.concat(chunks)
    else:
        df = pd.read_csv(args.input)
    logger.info("Cargadas %d filas, %d columnas", len(df), df.shape[1])

    # Imputar nulos según estrategia elegida
    if args.impute_strategy == "median":
        df = df.fillna(df.median(numeric_only=True))
    elif args.impute_strategy == "mean":
        df = df.fillna(df.mean(numeric_only=True))
    elif args.impute_strategy == "drop":
        df = df.dropna()

    # Guardar (respeta extensión del archivo de salida)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.suffix == ".parquet":
        df.to_parquet(args.output, index=False)
    else:
        df.to_csv(args.output, index=False)
    logger.info("Guardado en %s", args.output)

if __name__ == "__main__":
    main()

# === Ejemplos de uso desde terminal ===
# $ python cli_pipeline.py --help
# usage: cli_pipeline.py [-h] --input INPUT --output OUTPUT ...
#
# Pipeline de limpieza y feature engineering para datasets de ventas.
#
# options:
#   -i, --input INPUT           Ruta al archivo CSV de entrada
#   -o, --output OUTPUT         Ruta al archivo de salida (.parquet o .csv)
#   --impute-strategy {median,mean,drop}
#   --outlier-threshold OUTLIER_THRESHOLD
#   -v, --verbose               Mostrar logs detallados
#
# $ python cli_pipeline.py -i ventas.csv -o limpio.parquet --verbose
# 2024-01-15 [INFO] Iniciando pipeline
# 2024-01-15 [INFO]   Input: ventas.csv
# 2024-01-15 [INFO]   Output: limpio.parquet
# 2024-01-15 [INFO] Cargadas 10000 filas, 8 columnas
# 2024-01-15 [INFO] Guardado en limpio.parquet

# === pyproject.toml para hacerlo instalable como comando ===
# [project]
# name = "pipeline-ventas"
# version = "0.1.0"
# [project.scripts]
# pipeline-ventas = "pipeline.cli:main"
# Después: pip install -e .  → puedes correr "pipeline-ventas" desde cualquier lado`,
      },
      callout: {
        type: 'tip',
        title: 'Typer: argparse con type hints (recomendado para 2025+)',
        content:
          'Si ya usas type hints (Python 3.6+), `typer` genera el CLI automáticamente desde tus type hints. `def main(input: Path, output: Path, verbose: bool = False):` se convierte en CLI sin argparse manual. Es lo que usa FastAPI para sus ejemplos. Para proyectos nuevos, prefiere typer sobre argparse — menos boilerplate, type safety, y autocompletado en shell gratis.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos 3 piezas que aparecen en TODO pipeline production-ready: (1) feature engineering paralelizado con ProcessPoolExecutor, (2) profiling de una función lenta con cProfile + line_profiler para encontrar el bottleneck exacto, y (3) configuración de logging estructurado a archivo rotado integrado con un CLI de argparse. Estos 3 patrones son el 80% del trabajo de "hacer que mi script sea production-ready".',
    steps: [
      {
        description: 'Paralelizar feature engineering con ProcessPoolExecutor',
        code: {
          language: 'python',
          title: 'parallel_features.py',
          code: `import sqlite3
import pandas as pd
import numpy as np
from concurrent.futures import ProcessPoolExecutor
import time
import logging

# Configurar logging para ver progreso
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("features")

def cargar_datos(db_path: str = "productos.db") -> pd.DataFrame:
    """Carga datos desde SQLite — en la vida real podría ser PostgreSQL o Snowflake."""
    conn = sqlite3.connect(db_path)
    df = pd.read_sql("SELECT * FROM productos", conn)
    conn.close()
    return df

def calcular_features_categoria(args: tuple) -> pd.DataFrame:
    """Calcula features agregadas por categoría — cómputo CPU-bound.
    Recibe tupla porque ProcessPoolExecutor necesita picklear los argumentos.
    """
    categoria, sub_df = args
    if sub_df.empty:
        return pd.DataFrame()
    sub_df = sub_df.copy()
    sub_df["log_precio"] = np.log1p(sub_df["precio"])
    sub_df["zscore_precio"] = (sub_df["precio"] - sub_df["precio"].mean()) / sub_df["precio"].std()
    sub_df["percentil_precio"] = sub_df["precio"].rank(pct=True)
    sub_df["es_outlier"] = sub_df["zscore_precio"].abs() > 3
    return sub_df

def feature_engineering_paralelo(df: pd.DataFrame, n_workers: int = 8) -> pd.DataFrame:
    """Parte el DataFrame por categoría y procesa cada chunk en paralelo."""
    categorias = df["categoria"].unique()
    logger.info("Procesando %d categorías con %d workers", len(categorias), n_workers)

    start = time.time()
    # Construir lista de (categoria, sub_df) — cada worker recibe uno
    chunks = [(cat, df[df["categoria"] == cat]) for cat in categorias]

    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        # map preserva orden, submit + as_completed no (pero permite progreso)
        futures = {executor.submit(calcular_features_categoria, chunk): chunk[0]
                   for chunk in chunks}
        resultados = []
        for future in chunks:  # iterar en orden para preservar orden
            pass
        # Más simple con map (preserva orden):
        resultados = list(executor.map(calcular_features_categoria, chunks))

    df_final = pd.concat([r for r in resultados if not r.empty], ignore_index=True)
    elapsed = time.time() - start
    logger.info("Feature engineering completado en %.2fs (%d filas)", elapsed, len(df_final))
    return df_final

# === Demo con datos sintéticos ===
def setup_demo(db_path: str = "productos.db"):
    """Crea DB de demo con 50k productos en 20 categorías."""
    conn = sqlite3.connect(db_path)
    conn.execute("""CREATE TABLE IF NOT EXISTS productos
                    (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL, categoria TEXT)""")
    conn.execute("DELETE FROM productos")
    import random
    random.seed(42)
    categorias = [f"cat_{i}" for i in range(20)]
    filas = [(f"prod_{i}", random.uniform(10, 5000), random.choice(categorias))
             for i in range(50_000)]
    conn.executemany("INSERT INTO productos VALUES (?, ?, ?, ?)", filas)
    conn.commit()
    conn.close()

setup_demo()
df = cargar_datos()
df_features = feature_engineering_paralelo(df, n_workers=8)
print(df_features[["nombre", "precio", "log_precio", "zscore_precio", "es_outlier"]].head())
#           nombre   precio  log_precio  zscore_precio  es_outlier
# 0      prod_0   423.56      6.045         0.12        False
# 1      prod_1  2891.34      7.969         1.85        False
# ...`,
        },
        why: 'Cuando tienes 50 categorías con 10k productos cada una, calcular features secuencialmente tarda 10 minutos. Con ProcessPoolExecutor(max_workers=8), baja a 90 segundos. El truco es partir el trabajo por una clave natural (categoría) y pasar chunks independientes a cada worker — sin estado compartido, sin locks, sin complexity.',
      },
      {
        description: 'Perfil de una función lenta con cProfile + line_profiler',
        code: {
          language: 'python',
          title: 'profiling_real.py',
          code: `# === Paso 1: Script con una función SOSPECHOSAMENTE lenta ===
import pandas as pd
import numpy as np
import time

def feature_engineering_lento(df: pd.DataFrame) -> pd.DataFrame:
    """Función lenta — vamos a perfilarla para encontrar el bottleneck."""
    df = df.copy()
    df["log_monto"] = np.log1p(df["monto"])                              # sospechoso 1
    df["zscore"] = (df["monto"] - df["monto"].mean()) / df["monto"].std() # sospechoso 2
    df["categoria"] = pd.cut(df["monto"], bins=10, labels=False)         # sospechoso 3
    # El antipatrón clásico — iterar con .loc[i]:
    for i in range(len(df)):
        df.loc[i, "custom"] = df.loc[i, "monto"] * 2 + df.loc[i, "log_monto"]
    return df

# Crear DataFrame de prueba
df_test = pd.DataFrame({"monto": np.random.exponential(500, 50_000)})

# === Paso 2: cProfile para ver qué función se come el tiempo ===
# Guarda el script y corre:
#   python -m cProfile -s cumulative profiling_real.py
# Salida (top 10):
#    ncalls  tottime  percall  cumtime  percall filename:lineno(function)
#    500001   8.234    0.000    8.234    0.000 {method 'loc' of 'DataFrame'}
#         1   3.456    3.456   11.690   11.690 profiling_real.py:5(feature_engineering_lento)
#    500001   0.876    0.000    0.876    0.000 {method 'loc' of 'DataFrame'}
# → El 70% del tiempo (8.2s de 11.7s) está en el loop con .loc[i]

# === Paso 3: line_profiler para ver LÍNEA por LÍNEA ===
# pip install line_profiler
# Decora la función con @profile y corre:
#   kernprof -l -v profiling_real.py

# @profile  # descomenta para line_profiler
def feature_engineering_lento(df):
    df = df.copy()
    df["log_monto"] = np.log1p(df["monto"])                              # 2% del tiempo
    df["zscore"] = (df["monto"] - df["monto"].mean()) / df["monto"].std()  # 1%
    df["categoria"] = pd.cut(df["monto"], bins=10, labels=False)         # 4%
    for i in range(len(df)):                                              # 65% ← bottleneck
        df.loc[i, "custom"] = df.loc[i, "monto"] * 2 + df.loc[i, "log_monto"]  # 28%
    return df

# Salida de line_profiler:
# Line #  Hits    Time  Per Hit  % Time  Line Contents
# =====================================================
#      1     1       5      5.0      0.0  def feature_engineering_lento(df):
#      2     1       2      2.0      0.0      df = df.copy()
#      3     1    1500   1500.0      2.0      df["log_monto"] = np.log1p(df["monto"])
#      4     1     800    800.0      1.0      df["zscore"] = ...
#      5     1    3000   3000.0      4.0      df["categoria"] = pd.cut(...)
#      6 50001  25000      0.5     65.0      for i in range(len(df)):
#      7 50000  12000      0.2     28.0          df.loc[i, "custom"] = ...
# → El loop se come el 93% del tiempo. Vectorizar = 100x speedup.

# === Paso 4: Optimizar — vectorizar el loop ===
def feature_engineering_rapido(df: pd.DataFrame) -> pd.DataFrame:
    """Mismo resultado, 100x más rápido — todo vectorizado."""
    df = df.copy()
    df["log_monto"] = np.log1p(df["monto"])
    df["zscore"] = (df["monto"] - df["monto"].mean()) / df["monto"].std()
    df["categoria"] = pd.cut(df["monto"], bins=10, labels=False)
    # Vectorizado — una sola operación sobre toda la columna
    df["custom"] = df["monto"] * 2 + df["log_monto"]
    return df

# Comparar tiempos
start = time.time()
df_lento = feature_engineering_lento(df_test)
t_lento = time.time() - start
print(f"Lento: {t_lento:.2f}s")

start = time.time()
df_rapido = feature_engineering_rapido(df_test)
t_rapido = time.time() - start
print(f"Rápido: {t_rapido:.2f}s")
print(f"Speedup: {t_lento / t_rapido:.0f}x")
# Lento: 11.7s
# Rápido: 0.08s
# Speedup: 146x`,
        },
        why: 'Sin profiling, hubieras pasado horas "optimizando" la línea np.log1p (que solo es 2% del tiempo) sin resultado. cProfile te dice qué FUNCIÓN atacar; line_profiler te dice qué LÍNEA exacta. El 80% de las veces, el bottleneck es un .iterrows() o .loc[i] en un loop — vectorizar con numpy/pandas da speedups de 50-100x.',
      },
      {
        description: 'Logging estructurado integrado con un CLI de argparse',
        code: {
          language: 'python',
          title: 'cli_with_logging.py',
          code: `import argparse
import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
import pandas as pd
import time

def setup_logging(verbose: bool = False, log_file: Path = None):
    """Configura logging con consola + archivo rotado. Subir nivel con --verbose."""
    handlers = [logging.StreamHandler(sys.stdout)]
    if log_file:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        # Rotación: 5MB por archivo, 3 backups (pipeline.log.1, .2, .3)
        file_handler = RotatingFileHandler(
            log_file, maxBytes=5 * 1024 * 1024, backupCount=3, encoding="utf-8"
        )
        file_handler.setFormatter(logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        ))
        handlers.append(file_handler)

    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=handlers,
    )

def process_chunk(chunk: pd.DataFrame, logger) -> pd.DataFrame:
    """Procesa un chunk del DataFrame y loggea métricas clave."""
    n_in = len(chunk)
    n_nulos = chunk.isnull().sum().sum()
    if n_nulos > 0:
        logger.warning("Chunk: %d nulos detectados, imputando", n_nulos)
        chunk = chunk.fillna(chunk.median(numeric_only=True))
    chunk = chunk.copy()
    chunk["log_monto"] = chunk["monto"].apply(lambda x: max(0, x))
    logger.debug("Chunk procesado: %d → %d filas", n_in, len(chunk))
    return chunk

def main():
    parser = argparse.ArgumentParser(
        description="Pipeline de procesamiento de ventas con logging estructurado."
    )
    parser.add_argument("--input", "-i", required=True, type=Path,
                        help="CSV de entrada")
    parser.add_argument("--output", "-o", required=True, type=Path,
                        help="Parquet de salida")
    parser.add_argument("--log-file", type=Path, default=Path("logs/pipeline.log"),
                        help="Archivo de log (default: logs/pipeline.log)")
    parser.add_argument("--chunksize", type=int, default=10_000,
                        help="Filas por chunk (default: 10000)")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Mostrar logs DEBUG")
    args = parser.parse_args()

    # Configurar logging ANTES de cualquier logger
    setup_logging(args.verbose, args.log_file)
    logger = logging.getLogger("pipeline")

    logger.info("Config: input=%s output=%s chunksize=%d",
                args.input, args.output, args.chunksize)

    if not args.input.exists():
        logger.error("Archivo no existe: %s", args.input)
        sys.exit(1)

    # Procesar por chunks (para CSVs grandes)
    start = time.time()
    total_rows = 0
    chunks_out = []
    for i, chunk in enumerate(pd.read_csv(args.input, chunksize=args.chunksize)):
        logger.info("Procesando chunk %d (%d filas)", i + 1, len(chunk))
        chunks_out.append(process_chunk(chunk, logger))
        total_rows += len(chunk)

    df_final = pd.concat(chunks_out, ignore_index=True)
    elapsed = time.time() - start
    logger.info("Procesadas %d filas en %.2fs (%.0f filas/seg)",
                total_rows, elapsed, total_rows / elapsed if elapsed > 0 else 0)

    # Guardar
    args.output.parent.mkdir(parents=True, exist_ok=True)
    df_final.to_parquet(args.output, index=False)
    logger.info("Guardado en %s (%d filas, %d columnas)",
                args.output, len(df_final), df_final.shape[1])

if __name__ == "__main__":
    main()

# === Uso ===
# $ python cli_with_logging.py -i ventas.csv -o limpio.parquet -v
# 2024-01-15 10:30:45 [INFO] pipeline: Config: input=ventas.csv output=limpio.parquet chunksize=10000
# 2024-01-15 10:30:45 [INFO] pipeline: Procesando chunk 1 (10000 filas)
# 2024-01-15 10:30:45 [DEBUG] pipeline: Chunk procesado: 10000 → 10000 filas
# 2024-01-15 10:30:46 [INFO] pipeline: Procesando chunk 2 (10000 filas)
# 2024-01-15 10:30:47 [INFO] pipeline: Procesadas 50000 filas en 2.34s (21368 filas/seg)
# 2024-01-15 10:30:47 [INFO] pipeline: Guardado en limpio.parquet (50000 filas, 9 columnas)
#
# Y todo queda persistido en logs/pipeline.log (rotado cada 5MB, 3 backups).`,
        },
        why: 'Este patrón (argparse + logging con RotatingFileHandler + procesamiento por chunks) es la plantilla de TODO pipeline production-ready. argparse lo hace reusable, logging te da observabilidad cuando falla en prod, y chunks evitan OOM con datasets grandes. Combinado con multiprocessing del paso 1, tienes un pipeline profesional completo.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca practicar los 3 patrones más importantes de performance y observability: (1) paralelizar una función CPU-bound, (2) perfilar una función para encontrar el bottleneck, y (3) configurar logging estructurado. Cada ejercicio tiene starter code y solution code — intenta resolverlo solo primero.',
    steps: [
      {
        instruction:
          'Escribe una función `parallel_squares` que reciba una lista de 10,000 enteros, calcule el cuadrado de cada uno con una función `square(x)`, y devuelva la lista de resultados. Compara el tiempo secuencial vs paralelo con ProcessPoolExecutor(max_workers=8).',
        hint: 'Usa `executor.map(square, numbers)` para preservar orden. La función `square` debe ser top-level (no lambda) para que se pueda picklear. Mide tiempo con time.time() antes y después de cada versión.',
        starterCode: {
          language: 'python',
          title: 'parallel_squares_starter.py',
          code: `import time
from concurrent.futures import ProcessPoolExecutor

def square(x: int) -> int:
    """TODO: Devuelve x al cuadrado."""
    pass

def parallel_squares(numbers: list[int], n_workers: int = 8) -> list[int]:
    """TODO: Calcula cuadrados en paralelo con ProcessPoolExecutor."""
    pass

def sequential_squares(numbers: list[int]) -> list[int]:
    """TODO: Calcula cuadrados secuencialmente (baseline)."""
    pass

# Test:
# numbers = list(range(10000))
# t1 = time.time(); r1 = sequential_squares(numbers); t1 = time.time() - t1
# t2 = time.time(); r2 = parallel_squares(numbers); t2 = time.time() - t2
# print(f"Secuencial: {t1:.3f}s")
# print(f"Paralelo: {t2:.3f}s")
# print(f"Speedup: {t1/t2:.1f}x")`,
        },
        solutionCode: {
          language: 'python',
          title: 'parallel_squares_solution.py',
          code: `import time
from concurrent.futures import ProcessPoolExecutor

def square(x: int) -> int:
    """Devuelve x al cuadrado. Top-level (no lambda) para que sea picklable."""
    # Simular cómputo ligero para que el paralelismo sea notorio
    total = 0
    for i in range(1000):
        total += i
    return x * x + total % 7  # añadir algo de cómputo real

def parallel_squares(numbers: list[int], n_workers: int = 8) -> list[int]:
    """Calcula cuadrados en paralelo con ProcessPoolExecutor."""
    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        # map preserva el orden de los resultados
        results = list(executor.map(square, numbers))
    return results

def sequential_squares(numbers: list[int]) -> list[int]:
    """Calcula cuadrados secuencialmente (baseline)."""
    return [square(x) for x in numbers]

# Test comparativo
if __name__ == "__main__":
    numbers = list(range(10_000))

    t1 = time.time()
    r1 = sequential_squares(numbers)
    t1 = time.time() - t1
    print(f"Secuencial: {t1:.3f}s")

    t2 = time.time()
    r2 = parallel_squares(numbers)
    t2 = time.time() - t2
    print(f"Paralelo (8 workers): {t2:.3f}s")
    print(f"Speedup: {t1/t2:.1f}x")

    # Verificar que dan lo mismo
    assert r1 == r2, "Los resultados no coinciden!"
    print(f"\\nResultados idénticos: {len(r1)} elementos")
    print(f"Primeros 5: {r1[:5]}")
# Salida típica:
# Secuencial: 0.42s
# Paralelo (8 workers): 0.09s
# Speedup: 4.7x
#
# Resultados idénticos: 10000 elementos
# Primeros 5: [3, 6, 11, 18, 27]`,
        },
      },
      {
        instruction:
          'Tienes una función `limpiar_nombres_lento` que itera con .loc[i] sobre un DataFrame para limpiar nombres (capitalizar, quitar espacios). Perfílala con cProfile conceptualmente, identifica el bottleneck, y reescríbela vectorizada para lograr 50x+ speedup.',
        hint: 'El bottleneck SIEMPRE es .loc[i] en un loop. Vectoriza con .str.title() y .str.strip() de pandas — una sola operación sobre toda la columna. Mide con timeit.',
        starterCode: {
          language: 'python',
          title: 'profile_starter.py',
          code: `import pandas as pd
import numpy as np
import time

def limpiar_nombres_lento(df: pd.DataFrame) -> pd.DataFrame:
    """TODO: Limpia nombres iterando con .loc[i] — IDENTIFICA el bottleneck."""
    df = df.copy()
    for i in range(len(df)):
        # Capitalizar y quitar espacios extra
        nombre = df.loc[i, "nombre"].strip().title()
        df.loc[i, "nombre_limpio"] = nombre
    return df

def limpiar_nombres_rapido(df: pd.DataFrame) -> pd.DataFrame:
    """TODO: Misma funcionalidad pero VECTORIZADA con .str accessor."""
    pass

# Test:
# df = pd.DataFrame({"nombre": ["  juan perez ", "MARIA QUISPE", "  carlos  "] * 10000})
# t1 = time.time(); df1 = limpiar_nombres_lento(df); t1 = time.time() - t1
# t2 = time.time(); df2 = limpiar_nombres_rapido(df); t2 = time.time() - t2
# print(f"Lento: {t1:.3f}s")
# print(f"Rápido: {t2:.3f}s")
# print(f"Speedup: {t1/t2:.0f}x")`,
        },
        solutionCode: {
          language: 'python',
          title: 'profile_solution.py',
          code: `import pandas as pd
import numpy as np
import time

def limpiar_nombres_lento(df: pd.DataFrame) -> pd.DataFrame:
    """Versión LENTA — iterar con .loc[i] es el antipatrón #1 de pandas.
    cProfile mostraría que el 95% del tiempo está en {method 'loc' of 'DataFrame'}.
    line_profiler mostraría que la línea del loop se come el 90%+ del tiempo.
    """
    df = df.copy()
    for i in range(len(df)):
        nombre = df.loc[i, "nombre"].strip().title()
        df.loc[i, "nombre_limpio"] = nombre
    return df

def limpiar_nombres_rapido(df: pd.DataFrame) -> pd.DataFrame:
    """Versión RÁPIDA — vectorizada con .str accessor de pandas.
    Una sola operación C-level sobre toda la columna, sin loop Python.
    """
    df = df.copy()
    df["nombre_limpio"] = df["nombre"].str.strip().str.title()
    return df

# === Test comparativo ===
if __name__ == "__main__":
    # Crear DataFrame de prueba (30k nombres con espacios y mayúsculas mal)
    nombres_sucios = ["  juan perez ", "MARIA QUISPE", "  carlos  ",
                      "PEDRO  HUAMAN  ", "  ana  lucia  "]
    df = pd.DataFrame({"nombre": nombres_sucios * 6000})  # 30,000 filas
    print(f"DataFrame: {len(df)} filas")

    # Versión lenta
    t1 = time.time()
    df1 = limpiar_nombres_lento(df)
    t1 = time.time() - t1
    print(f"Lento (.loc[i] loop): {t1:.3f}s")

    # Versión rápida
    t2 = time.time()
    df2 = limpiar_nombres_rapido(df)
    t2 = time.time() - t2
    print(f"Rápido (.str vectorizado): {t2:.3f}s")
    print(f"Speedup: {t1/t2:.0f}x")

    # Verificar que dan lo mismo
    assert df1["nombre_limpio"].equals(df2["nombre_limpio"]), "Resultados difieren!"
    print("\\nResultados idénticos:")
    print(df2[["nombre", "nombre_limpio"]].head())
# Salida típica:
# DataFrame: 30000 filas
# Lento (.loc[i] loop): 3.85s
# Rápido (.str vectorizado): 0.012s
# Speedup: 320x
#
# Resultados idénticos:
#              nombre nombre_limpio
# 0      "  juan perez "    Juan Perez
# 1    "MARIA QUISPE"     Maria Quispe
# 2      "  carlos  "      Carlos
# 3  "PEDRO  HUAMAN  "     Pedro Huaman
# 4  "  ana  lucia  "      Ana Lucia

# === Nota: cómo perfilar realmente ===
# Para ver el output de cProfile, guardar el script y correr:
#   python -m cProfile -s cumulative profile_solution.py
# Para line_profiler:
#   pip install line_profiler
#   Decorar la función con @profile
#   kernprof -l -v profile_solution.py`,
        },
      },
      {
        instruction:
          'Configura un logger con dos handlers: consola (INFO+) y archivo rotado (DEBUG+, 1MB, 3 backups). Escribe una función `procesar` que loggee inicio, progreso cada 1000 items, warnings si hay nulos, y fin con tiempo total.',
        hint: 'RotatingFileHandler con maxBytes=1024*1024, backupCount=3. Dos handlers con niveles distintos: StreamHandler(level=INFO) y FileHandler(level=DEBUG). Usa logger.info/.debug/.warning según corresponda. SIEMPRE %-format, no f-string.',
        starterCode: {
          language: 'python',
          title: 'logging_starter.py',
          code: `import logging
from logging.handlers import RotatingFileHandler
import sys

def setup_logging(log_file: str = "app.log"):
    """TODO: Configura consola (INFO+) + archivo rotado (DEBUG+, 1MB, 3 backups)."""
    pass

def procesar(items: list) -> int:
    """TODO: Procesa items. Loggea inicio, progreso cada 1000, warnings si hay nulos, fin con tiempo."""
    logger = logging.getLogger("procesar")
    # TODO: implementar
    pass

# Test:
# setup_logging()
# procesar(list(range(3500)) + [None] * 50)  # 3550 items, 50 nulos`,
        },
        solutionCode: {
          language: 'python',
          title: 'logging_solution.py',
          code: `import logging
from logging.handlers import RotatingFileHandler
import sys
import time

def setup_logging(log_file: str = "app.log"):
    """Configura consola (INFO+) + archivo rotado (DEBUG+, 1MB, 3 backups)."""
    logger = logging.getLogger()  # root logger
    logger.setLevel(logging.DEBUG)  # nivel mínimo global — DEBUG para que archivo reciba todo

    # Handler 1: consola con nivel INFO
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S"
    ))
    logger.addHandler(console)

    # Handler 2: archivo rotado con nivel DEBUG
    file_h = RotatingFileHandler(
        log_file, maxBytes=1 * 1024 * 1024, backupCount=3, encoding="utf-8"
    )
    file_h.setLevel(logging.DEBUG)
    file_h.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    ))
    logger.addHandler(file_h)

def procesar(items: list) -> int:
    """Procesa items con logging estructurado en cada etapa."""
    logger = logging.getLogger("procesar")

    start = time.time()
    n = len(items)
    logger.info("Iniciando procesamiento de %d items", n)
    logger.debug("Primeros 3 items: %s", items[:3] if items else "[]")

    procesados = 0
    nulos = 0
    for i, item in enumerate(items):
        if item is None:
            nulos += 1
            if nulos == 1:  # warn solo la primera vez para no spammer
                logger.warning("Primer nulo detectado en posición %d", i)
            continue
        # ... procesar item (simulado)
        procesados += 1

        # Progreso cada 1000 items
        if (i + 1) % 1000 == 0:
            logger.info("Progreso: %d/%d (%.0f%%)",
                        i + 1, n, (i + 1) / n * 100)
            logger.debug("Item actual: %s", item)

    elapsed = time.time() - start
    logger.info("Completado: %d procesados, %d nulos en %.2fs",
                procesados, nulos, elapsed)
    return procesados

# === Test ===
if __name__ == "__main__":
    setup_logging("procesar.log")
    # 3550 items, 50 nulos dispersos
    items = list(range(3500)) + [None] * 50
    # Mezclar para que los nulos estén dispersos
    import random
    random.seed(42)
    random.shuffle(items)

    resultado = procesar(items)
    print(f"\\nResultado: {resultado} items procesados")

# === Output en consola (solo INFO+): ===
# 10:30:45 [INFO] Iniciando procesamiento de 3550 items
# 10:30:45 [INFO] Progreso: 1000/3550 (28%)
# 10:30:45 [INFO] Progreso: 2000/3550 (56%)
# 10:30:45 [INFO] Progreso: 3000/3550 (85%)
# 10:30:45 [WARNING] Primer nulo detectado en posición 3142
# 10:30:45 [INFO] Completado: 3500 procesados, 50 nulos en 0.03s
#
# === Output en procesar.log (DEBUG+, incluye lo anterior +): ===
# 2024-01-15 10:30:45 [DEBUG] procesar: Primeros 3 items: [1234, 567, 2891]
# 2024-01-15 10:30:45 [DEBUG] procesar: Progreso: 1000/3550 (28%)
# 2024-01-15 10:30:45 [DEBUG] procesar: Item actual: 999
# ...`,
        },
      },
    ],
  },
  youDo: {
    title: 'Capstone: Performance Optimizer — de script lento a CLI production-ready',
    context:
      'Te dan un script de 200 líneas que procesa 100k transacciones de un banco peruano (datos sintéticos). El script tarda 8 minutos, no tiene logs, no maneja errores, y solo funciona si editas variables dentro del código. Tu misión: (1) perfilarlo para encontrar el bottleneck, (2) paralelizar el feature engineering con multiprocessing, (3) agregar logging estructurado a archivo rotado, (4) empaquetarlo como CLI con argparse, (5) instalarlo como ejecutable con pyproject.toml. El resultado debe correr en 30 segundos (16x speedup) y ser usable por cualquier colega con `pip install -e .` y `perf-opt --help`. Es exactamente el tipo de refactor que harías en tu segundo mes como Data Engineer Junior.',
    objectives: [
      'Perfil el script original con cProfile para identificar el bottleneck',
      'Vectorizar loops pandas con .loc[i] y reemplazarlos con operaciones vectorizadas',
      'Paralelizar feature engineering con ProcessPoolExecutor',
      'Configurar logging estructurado (consola + archivo rotado con RotatingFileHandler)',
      'Empaquetar como CLI con argparse (--input, --output, --workers, --verbose, --log-file)',
      'Hacerlo instalable como ejecutable con pyproject.toml + entry_points',
    ],
    requirements: [
      'scripts/original_lento.py — el script original (sin tocar) para baseline',
      'src/perf_opt/processors.py — funciones vectorizadas (sin .loc[i])',
      'src/perf_opt/parallel.py — feature_engineering_paralelo() con ProcessPoolExecutor',
      'src/perf_opt/logging_config.py — setup_logging() con RotatingFileHandler',
      'src/perf_opt/cli.py — CLI con argparse: --input, --output, --workers, --verbose, --log-file',
      'pyproject.toml con [project.scripts] perf-opt = "perf_opt.cli:main"',
      'logs/ con rotación a 5MB, 3 backups',
      'benchmarks/ con output de cProfile antes/después (txt o markdown)',
      'tests/ con al menos 5 tests (test_processors.py, test_parallel.py)',
      'README.md con instrucciones, badges de tests y cuadro comparativo de tiempos',
    ],
    starterCode: `# scripts/original_lento.py — el script a optimizar
import pandas as pd
import numpy as np
import time

def load_data(path):
    return pd.read_csv(path)

def feature_eng_lento(df):
    """Esto es lo que vas a perfilar y optimizar."""
    df = df.copy()
    df["log_monto"] = np.log1p(df["monto"])
    for i in range(len(df)):
        df.loc[i, "categoria_score"] = (
            df.loc[i, "monto"] * 2 + df.loc[i, "log_monto"]
        )
    return df

def main():
    df = load_data("transacciones.csv")  # 100k filas
    df = feature_eng_lento(df)
    df.to_parquet("resultado.parquet")

# === Tu versión optimizada ===
# src/perf_opt/cli.py
import argparse, logging
def main():
    parser = argparse.ArgumentParser(description="Performance Optimizer")
    parser.add_argument("--input", "-i", required=True, type=Path)
    parser.add_argument("--output", "-o", required=True, type=Path)
    parser.add_argument("--workers", "-w", type=int, default=8)
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--log-file", type=Path, default=Path("logs/perf_opt.log"))
    args = parser.parse_args()
    # TODO: setup_logging, load, feature_eng_paralelo, save
    pass

# pyproject.toml
# [project]
# name = "perf-opt"
# version = "0.1.0"
# [project.scripts]
# perf-opt = "perf_opt.cli:main"`,
    portfolioNote:
      'Este proyecto demuestra las 4 skills que separan juniors de seniors: profiling (mides antes de optimizar), paralelización (multiprocessing para 5-10x speedup), observabilidad (logging estructurado para debuggear en prod), y empaquetado (CLI instalable que otros usan sin abrir notebooks). En entrevistas te preguntan "cuéntame de una vez que optimizaste código" — tener un before/after con números concretos (8 min → 30 seg, 16x speedup) es un diferenciador masivo. Menciónalo en tu CV como "optimicé pipelines de datos con profiling, multiprocessing y logging estructurado, logrando speedups de 10-16x en datasets de 100k+ filas".',
    rubric: [
      { criterion: 'Profiling con cProfile/line_profiler documentado en benchmarks/', weight: '15%' },
      { criterion: 'Vectorización de loops .loc[i] con .str y operaciones numpy', weight: '20%' },
      { criterion: 'Paralelización con ProcessPoolExecutor (5-10x speedup medible)', weight: '20%' },
      { criterion: 'Logging estructurado con RotatingFileHandler (consola + archivo)', weight: '15%' },
      { criterion: 'CLI con argparse: --input, --output, --workers, --verbose, --log-file', weight: '15%' },
      { criterion: 'Instalable con pip install -e . y entrada perf-opt', weight: '10%' },
      { criterion: 'Tests con pytest + README con cuadro comparativo de tiempos', weight: '5%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuándo usarías ProcessPoolExecutor vs ThreadPoolExecutor?',
        options: [
          'Thread para CPU-bound, Process para I/O-bound',
          'Process para CPU-bound (cálculo), Thread para I/O-bound (red/disco)',
          'Siempre Thread — es más rápido en todos los casos',
          'Siempre Process — es más seguro y no tiene GIL',
        ],
        correctIndex: 1,
        explanation:
          'El GIL de Python impide que múltiples threads ejecuten bytecode a la vez, así que threads NO aceleran cálculo (CPU-bound). Pero threads SÍ ayudan con I/O porque durante la espera (red, disco), el GIL se libera y otros threads avanzan. Para feature engineering pesado → Process. Para scrapear 100 URLs → Thread.',
      },
      {
        question: '¿Cuál es la regla #1 de optimización de performance?',
        options: [
          'Optimizar lo que se ve más lento al leer el código',
          'Nunca optimices sin medir primero con profiling (cProfile/line_profiler)',
          'Siempre usar multiprocessing en todo',
          'Reescribir en C o Rust para mayor velocidad',
        ],
        correctIndex: 1,
        explanation:
          'La intuición humana sobre qué es lento es pésima — el 80% de las veces el bottleneck NO es donde crees. Perfilas primero, identificas el hot path (la función/línea que se come el 80% del tiempo), optimizas SOLO eso, vuelves a medir. Esto es lo que diferencia seniors de juniors.',
      },
      {
        question: '¿Por qué NO debes usar f-strings en mensajes de logging?',
        options: [
          'Porque f-strings son deprecated desde Python 3.12',
          'Porque el formato se evalúa SIEMPRE, incluso si el nivel está apagado (waste de CPU)',
          'Porque f-strings no funcionan con logging',
          'Porque f-strings no permiten variables',
        ],
        correctIndex: 1,
        explanation:
          'Con `logger.info(f"Procesé {n}")`, el f-string se evalúa SIEMPRE, incluso si el nivel INFO está apagado en producción. Con `logger.info("Procesé %d", n)`, el formato se aplica solo si el mensaje se va a mostrar. En pipelines con miles de logs debug por segundo, esto es 5-10x más rápido.',
      },
      {
        question: '¿Qué hace RotatingFileHandler en el módulo logging?',
        options: [
          'Rota los logs entre consola y archivo alternadamente',
          'Crea un nuevo archivo cuando el actual alcanza maxBytes, manteniendo backupCount archivos viejos',
          'Borra logs viejos automáticamente cada 24 horas',
          'Comprime los logs en gzip para ahorrar espacio',
        ],
        correctIndex: 1,
        explanation:
          'RotatingFileHandler crea un nuevo archivo cuando el actual alcanza maxBytes (ej: 10MB). Renombra el actual a app.log.1, el .1 a .2, etc., hasta backupCount archivos viejos. Esto evita que los logs crezcan infinitamente y llenen el disco — crítico en producción donde un pipeline puede correr diariamente por años.',
      },
      {
        question: '¿Cómo haces que tu script Python sea instalable como comando del sistema?',
        options: [
          'Compilarlo con py2exe o pyinstaller',
          'Agregar [project.scripts] en pyproject.toml y correr pip install -e .',
          'Copiarlo a /usr/local/bin manualmente',
          'Crear un alias en .bashrc',
        ],
        correctIndex: 1,
        explanation:
          'En pyproject.toml defines `[project.scripts] mi-tool = "mi_paquete.cli:main"`. Después de `pip install -e .`, pip crea un ejecutable `mi-tool` en tu PATH que invoca la función main() de tu paquete. Es la forma estándar moderna de distribuir CLIs en Python — lo usan black, ruff, pytest, poetry, etc.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'concurrent.futures — Docs', url: 'https://docs.python.org/3/library/concurrent.futures.html', note: 'API moderna de paralelismo en Python (Process/ThreadPoolExecutor)' },
      { label: 'multiprocessing — Docs', url: 'https://docs.python.org/3/library/multiprocessing.html', note: 'API de bajo nivel para procesos — útil cuando concurrent.futures no basta' },
      { label: 'cProfile — Docs', url: 'https://docs.python.org/3/library/profile.html', note: 'Profiler determinístico built-in de Python' },
      { label: 'line_profiler — GitHub', url: 'https://github.com/pyutils/line_profiler', note: 'Perfil línea por línea — instala con pip install line_profiler' },
      { label: 'logging — HOWTO oficial', url: 'https://docs.python.org/3/howto/logging.html', note: 'Guía oficial de logging con ejemplos prácticos' },
      { label: 'logging.handlers — RotatingFileHandler', url: 'https://docs.python.org/3/library/logging.handlers.html#rotatingfilehandler', note: 'Docs de RotatingFileHandler y otros handlers built-in' },
      { label: 'argparse — Tutorial oficial', url: 'https://docs.python.org/3/howto/argparse.html', note: 'HOWTO oficial de argparse con ejemplos completos' },
      { label: 'pyproject.toml — Packaging guide', url: 'https://packaging.python.org/en/latest/tutorials/packaging-projects/', note: 'Cómo empaquetar y distribuir proyectos Python modernos' },
    ],
    books: [
      { label: 'High Performance Python (Micha Gorelick & Ian Ozsvald, O\'Reilly)', note: 'El libro de referencia sobre optimización en Python — profiling, numpy, multiprocessing, cython, numba.' },
      { label: 'Fluent Python (Luciano Ramalho)', note: 'Capítulos sobre concurrency, generators, y data model — imprescindible para senior Python.' },
      { label: 'Python Cookbook (David Beazley & Brian Jones)', note: 'Recetas sobre concurrency, generators, y manejo de datos — referencia práctica.' },
      { label: 'Robust Python (Patrick Viafore)', note: 'Type hints, testing, y código production-ready — buena continuación después de esta sección.' },
    ],
    courses: [
      { label: 'Real Python — Logging in Python', url: 'https://realpython.com/python-logging/', note: 'Guía completa de logging con ejemplos prácticos' },
      { label: 'Real Python — argparse', url: 'https://realpython.com/command-line-interfaces-python-argparse/', note: 'Tutorial paso a paso de argparse' },
      { label: 'Talk Python to Me — Concurrency Course', url: 'https://training.talkpython.fm/courses/details/all-about-python-concurrency', note: 'Curso enfocado en concurrencia Python: threads, multiprocessing, asyncio' },
      { label: 'Udemy — Python Profiling', url: 'https://www.udemy.com/course/python-profiling/', note: 'Curso corto sobre profiling y optimización con cProfile y line_profiler' },
    ],
  },
}
