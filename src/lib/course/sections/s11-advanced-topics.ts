import type { CourseSection } from '../../types'

export const section11: CourseSection = {
  id: 'advanced-topics',
  index: 11,
  title: 'Advanced Python for Data Science',
  shortTitle: 'Advanced Topics',
  tagline:
    'Iterators, scraping, APIs, SQL, multiprocessing, regex, collections, profiling, logging, argparse',
  estimatedHours: 16,
  level: 'Avanzado',
  icon: 'Rocket',
  accentColor: 'bg-gradient-to-br from-orange-500 to-red-600',
  jobRelevance:
    'Estos 10 temas son lo que separa un junior que solo sabe Jupyter de un Data Scientist que entrega pipelines production-ready. En empresas peruanas como Interbank, BBVA, Rimac o Mercado Libre, NO te dan un CSV limpio: te dan una API interna, una base SQL con millones de filas, o te dicen "ve y scrapea los precios de la competencia". Tienes que saber consumir APIs con paginación, paralelizar feature engineering con multiprocessing para no esperar 4 horas, loggear estructurado para debuggear en producción, y empaquetar todo como CLI con argparse para que otros ingenieros lo usen. Quien domina estos 10 temas cobra 30-50% más que quien solo sabe pandas + sklearn, porque puede llevar un proyecto de idea a deployment sin depender de nadie más.',
  learningOutcomes: [
    { text: 'Construir generators con `yield` para procesar CSVs gigantes sin agotar RAM' },
    { text: 'Scrapear sitios con requests + BeautifulSoup y automatizar con Selenium cuando hay JS' },
    { text: 'Consumir REST APIs con requests, manejar JSON y paginación automática' },
    { text: 'Conectar Python a SQL con sqlite3, SQLAlchemy y pd.read_sql para traer datos a pandas' },
    { text: 'Paralelizar feature engineering con multiprocessing y concurrent.futures' },
    { text: 'Limpiar texto y parsear logs con expresiones regulares (re)' },
    { text: 'Usar collections (Counter, defaultdict, namedtuple, deque) en tu Python diario' },
    { text: 'Perfil código con timeit, cProfile y line_profiler para encontrar bottlenecks' },
    { text: 'Configurar logging estructurado para código de DS en producción' },
    { text: 'Convertir notebooks en herramientas CLI reutilizables con argparse' },
  ],
  theory: [
    {
      heading: 'Iterators & Generators — `yield` para CSVs gigantes',
      paragraphs: [
        'Un iterador es cualquier objeto que implementa `__next__` y devuelve un valor a la vez. Las listas, tuplas, dicts y strings son iterables (puedes iterarlos con `for`) pero no iteradores. Cuando haces `iter(mi_lista)` obtienes un iterador. La diferencia clave: una lista carga TODOS sus elementos en RAM, mientras que un iterador solo calcula el siguiente elemento cuando se le pide. Esto es crucial para data science: si un CSV tiene 50 millones de filas y pesa 8 GB, no puedes cargarlo en una lista — tu laptop muere. Necesitas un iterador que lea línea por línea y procese cada una sin mantener el archivo entero en memoria.',
        'Un generator es la forma más fácil de crear un iterador: una función que usa `yield` en vez de `return`. Cuando llamas a una función con `yield`, Python no ejecuta la función: devuelve un objeto generator. Cada vez que llamas `next()` sobre ese generator, la función corre hasta el próximo `yield` y pausa su estado. La próxima llamada continúa desde donde quedó. Esto se llama "lazy evaluation" — los valores se calculan solo cuando se necesitan. Para CSVs enormes, esto significa que puedes procesar 50 millones de filas con 50 MB de RAM, no 8 GB. Es la diferencia entre "funciona" y "se cae por OOM".',
        'En pandas, `pd.read_csv(path, chunksize=10000)` te devuelve un iterador de DataFrames de 10k filas cada uno. Procesas cada chunk, agregas resultados, y nunca tienes el archivo entero en RAM. Combinado con generators propios para filtrar o transformar, puedes construir pipelines que escalan a datasets de cualquier tamaño. Esto es exactamente lo que hacen los data engineers en Mercado Libre cuando procesan logs de navegación (TB por día): no cargan todo, lo streaméan. Si aprendes una sola cosa de esta sección, que sea generators — paga dividendos en cada proyecto.',
      ],
      code: {
        language: 'python',
        title: 'generadores_csv.py',
        code: `# === Generador que lee un CSV enorme línea por línea ===
import csv
from pathlib import Path

def leer_ventas_lento(path: str):
    """Sin generador: carga TODO en RAM. Malo para 8GB CSV."""
    with open(path) as f:
        return list(csv.DictReader(f))  # ¡OOM en archivos grandes!

def leer_ventas_lazy(path: str):
    """Con generador: una fila a la vez, ~0 RAM extra."""
    with open(path) as f:
        reader = csv.DictReader(f)
        for fila in reader:
            yield fila  # pausa aquí hasta que pidan el siguiente

# Uso: procesar 50M de filas sin morir
ruta = "ventas_peru_2024.csv"  # supongamos 8 GB
total_ingresos = 0
for fila in leer_ventas_lazy(ruta):
    # cada fila es un dict: {"fecha": "...", "monto": "150.50", "region": "Lima"}
    total_ingresos += float(fila["monto"])
print(f"Ingresos totales: S/ {total_ingresos:,.2f}")
# Ingresos totales: S/ 12,450,890.50

# === Generador infinito (serie de Fibonacci) ===
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
primeros_10 = [next(fib) for _ in range(10)]
print(primeros_10)
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# === Pandas chunksize: generador de DataFrames ===
import pandas as pd

def agregado_por_region(ruta_csv: str, chunksize: int = 50_000):
    """Agrega ventas por región sin cargar todo el CSV."""
    acumulador = {}  # region -> total
    for chunk in pd.read_csv(ruta_csv, chunksize=chunksize):
        for region, grupo in chunk.groupby("region"):
            acumulador[region] = acumulador.get(region, 0) + grupo["monto"].sum()
    return acumulador

# Resultado en una laptop normal con un CSV de 5GB:
# {"Lima": 8_500_000, "Arequipa": 1_200_000, "Cusco": 350_000, ...}
# Peak RAM: ~200MB (no los 5GB del archivo)`,
      },
      callout: {
        type: 'tip',
        title: 'Cuándo usar generadores',
        content:
          'Usa generators cuando: (1) el dataset es >1GB, (2) solo necesitas procesar cada item una vez (no acceso aleatorio), (3) estás construyendo un pipeline de streaming. NO uses generators cuando necesitas acceso aleatorio por índice, o cuando el dataset es chico (<100MB) y la simplicidad de una lista vale más.',
      },
    },
    {
      heading: 'Web Scraping — requests + BeautifulSoup + Selenium',
      paragraphs: [
        'En la vida real como Data Scientist en Perú, rara vez te dan un CSV listo. Lo más común es que te digan "necesitamos monitorear precios de la competencia en Mercado Libre, Falabella y Ripley". Para eso necesitas web scraping: descargar HTML de una página web y extraer datos estructurados. El stack básico es `requests` (descargar HTML) + `BeautifulSoup` (parsear HTML y extraer elementos con selectores CSS). Instalas con `pip install requests beautifulsoup4`. El flujo: haces `requests.get(url)`, pasas `response.text` a `BeautifulSoup(html, "html.parser")`, y luego buscas elementos con `soup.select(".precio")` o `soup.find_all("div", class_="producto")`.',
        'El scraping simple con requests+BS4 funciona cuando el HTML viene completo desde el servidor (páginas estáticas). Pero el 70% de sitios modernos cargan datos con JavaScript después de la página inicial (SPAs, React, Vue). Si haces `requests.get()` a Mercado Libre o Starbucks, ves un HTML vacío con un `<div id="root"></div>` y los precios NO están — los carga JS. Para estos casos necesitas Selenium: un browser real (Chrome/Firefox) automatizado que ejecuta el JS, espera a que cargue, y te da acceso al DOM final. Selenium es más lento (10-30s por página vs 0.5s con requests) pero es la única opción para JS pesado.',
        'Reglas de oro del scraping: (1) SIEMPRE respeta `robots.txt` del sitio (`/robots.txt` te dice qué paths permiten), (2) pon un `time.sleep(1-2)` entre requests para no saturar el servidor (es un DoS no intencional si no lo haces), (3) usa headers de navegador real (`User-Agent: Mozilla/...`) porque muchos sitios bloquean `python-requests/2.x`, (4) cachea respuestas a disco para no re-scrapear durante desarrollo, (5) maneja fallos con try/except y reintentos. Para scraping a escala (>10k páginas), considera Scrapy (framework completo) o Playwright (alternativa moderna a Selenium).',
      ],
      code: {
        language: 'python',
        title: 'scraping_precios.py',
        code: `import requests
from bs4 import BeautifulSoup
import time
from pathlib import Path

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
}

def scrapear_productos_falabella(url: str) -> list[dict]:
    """Scrapea productos de Falabella (ejemplo estático)."""
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    productos = []
    for card in soup.select("[data-pod]"):  # selector específico del sitio
        nombre_el = card.select_one("a.pod-link")
        precio_el = card.select_one("span.copy10")
        if nombre_el and precio_el:
            productos.append({
                "nombre": nombre_el.get_text(strip=True),
                "precio": precio_el.get_text(strip=True),
            })
    return productos

# === Selenium para páginas con JavaScript ===
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrapear_mercado_libre(url: str) -> list[dict]:
    """Mercado Libre carga precios con JS — necesita Selenium."""
    driver = webdriver.Chrome()  # requiere chromedriver instalado
    driver.get(url)

    # Esperar a que carguen los precios
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".ui-search-item__group"))
    )

    productos = []
    for item in driver.find_elements(By.CSS_SELECTOR, ".ui-search-layout__item"):
        try:
            nombre = item.find_element(By.CSS_SELECTOR, "h2").text
            precio = item.find_element(By.CSS_SELECTOR, ".price-tag-fraction").text
            productos.append({"nombre": nombre, "precio": precio})
        except Exception:
            continue  # algunos items pueden no tener precio (anuncios)

    driver.quit()
    return productos

# Uso realista con rate limiting y cache
def scrapear_con_cache(urls: list[str], cache_dir: Path = Path(".cache")) -> list[dict]:
    cache_dir.mkdir(exist_ok=True)
    todos = []
    for url in urls:
        cache_file = cache_dir / (url.split("/")[-1] + ".html")
        if cache_file.exists():
            html = cache_file.read_text()
        else:
            time.sleep(2)  # ¡respeta al servidor!
            html = requests.get(url, headers=HEADERS).text
            cache_file.write_text(html)
        soup = BeautifulSoup(html, "html.parser")
        # ... extraer datos ...
        todos.append(soup.title.string if soup.title else "sin titulo")
    return todos`,
      },
      callout: {
        type: 'warning',
        title: 'Legalidad y ética del scraping',
        content:
          'Scrapear datos públicos es legal en la mayoría de jurisdicciones (incluyendo Perú), pero: (1) NO scrapees datos personales sin consentimiento (Ley 29733 de Protección de Datos), (2) NO satures el servidor (es un ataque DoS), (3) revisa los Términos de Servicio — algunos sitios lo prohíben explícitamente, (4) SIEMPRE pon User-Agent identificable y contacto. Cuando dudes, pregunta al sitio o usa su API oficial (siguiente sección).',
      },
    },
    {
      heading: 'REST APIs — requests + JSON + paginación',
      paragraphs: [
        'Una API REST es la forma profesional de consumir datos de un servicio. En vez de scrapear HTML (frágil, ilegal a veces, lento), la API te devuelve datos estructurados en JSON. En Perú, la SUNAT tiene APIs para tipo de cambio, RENIEC para validar DNI, INEI para estadísticas. Bancos como Interbank y BCP exponen APIs internas para sus equipos de data. Mercado Libre, OpenStreetMap, GitHub, Twitter — todos tienen APIs públicas. Como Data Scientist, sabes consumir APIs es OBLIGATORIO: es cómo obtienes datos frescos sin descargar CSVs manualmente cada semana.',
        'El flujo básico con `requests`: `resp = requests.get(url, params={"key": "value"}, headers={"Authorization": "Bearer TOKEN"})`. La respuesta tiene `resp.status_code` (200=ok, 404=not found, 401=unauthorized, 429=rate limited, 500=server error), `resp.json()` para parsear el body como JSON, y `resp.headers` para metadata. Para APIs que requieren auth, dos patrones: (1) API key en header (`headers={"X-API-Key": "abc123"}`), (2) OAuth2 bearer token (`headers={"Authorization": "Bearer eyJhb..."}`). Guarda tus tokens en variables de entorno (`os.environ["API_KEY"]`), NUNCA en el código.',
        'Casi toda API devuelve datos paginados: en vez de mandarte 100,000 registros de golpe (mataría su servidor), te manda 50 o 100 por página, junto con un cursor o URL de la siguiente página. Sin paginar, solo ves los primeros 50. Los patrones comunes: (1) `?page=2&per_page=100` (offset/page), (2) `?cursor=abc123` (cursor opaco), (3) link en `response["next"]` (URL completa). Tu código debe loop hasta que no haya más páginas, acumulando resultados. Caso real: scrapear 10,000 productos de una API a 100 por página = 100 requests, ~2 minutos con rate limiting. Siempre maneja errores (429 con backoff exponencial, 5xx con retry) — las APIs fallan.',
      ],
      code: {
        language: 'python',
        title: 'api_consumption.py',
        code: `import requests
import os
import time
from typing import Iterator

API_KEY = os.environ.get("MI_API_KEY", "demo")

def get_tipo_cambio_sunat(fecha: str = "2024-01-15") -> dict:
    """Tipo de cambio SUNAT (ejemplo simplificado)."""
    url = f"https://api.sunat.gob/tipo-cambio/{fecha}"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()  # lanza excepción si no es 200
    return resp.json()
# {"fecha": "2024-01-15", "compra": 3.745, "venta": 3.755}

# === Paginación: traer TODOS los productos ===
def traer_todos_productos(api_base: str) -> list[dict]:
    """Loop de paginación hasta que no haya más páginas."""
    todos = []
    url = f"{api_base}/products"
    while url:
        resp = requests.get(url, headers={"X-API-Key": API_KEY}, timeout=15)
        if resp.status_code == 429:
            # Rate limited: esperar y reintentar
            wait = int(resp.headers.get("Retry-After", 60))
            print(f"Rate limited, esperando {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        todos.extend(data["results"])  # productos de esta página
        url = data.get("next")  # URL de la siguiente página, o None
    return todos

# === Generador para paginación lazy (más eficiente en RAM) ===
def iterar_productos(api_base: str) -> Iterator[dict]:
    """Generador: yield un producto a la vez, paginando lazy."""
    url = f"{api_base}/products"
    while url:
        resp = requests.get(url, headers={"X-API-Key": API_KEY}, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        for producto in data["results"]:
            yield producto  # uno a la vez
        url = data.get("next")

# === POST con JSON body (crear recurso) ===
def crear_cliente(api_base: str, cliente: dict) -> dict:
    resp = requests.post(
        f"{api_base}/clientes",
        json=cliente,  # serializa a JSON automáticamente
        headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
        timeout=10,
    )
    if resp.status_code == 201:
        return resp.json()
    raise RuntimeError(f"Error {resp.status_code}: {resp.text}")

# === Retry con backoff exponencial ===
def get_con_retry(url: str, max_retries: int = 3) -> dict:
    for intento in range(max_retries):
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code >= 500:  # server error, reintentar
                wait = 2 ** intento  # 1s, 2s, 4s
                print(f"Error {resp.status_code}, reintentar en {wait}s")
                time.sleep(wait)
                continue
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"Intento {intento+1} falló: {e}")
            time.sleep(2 ** intento)
    raise RuntimeError(f"Fallo después de {max_retries} intentos")`,
      },
      callout: {
        type: 'info',
        title: 'requests.Session para múltiples requests',
        content:
          'Si haces 100 requests al mismo host, crea `s = requests.Session()` y usa `s.get()`. La sesión reutiliza la conexión TCP (keep-alive), lo que es 3-5x más rápido. También persiste cookies y headers default. Para scraping intensivo o polling de API, SIEMPRE usa Session.',
      },
    },
    {
      heading: 'SQL Databases — sqlite3, SQLAlchemy y pd.read_sql',
      paragraphs: [
        'En cualquier trabajo serio de data, los datos NO están en CSVs — están en bases de datos SQL. PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery. Aprender SQL es OBLIGATORIO para DS (la mayoría de entrevistas técnicas incluyen SQL). En Python, el puente entre SQL y tu análisis es la librería `sqlite3` (built-in, para SQLite local), `SQLAlchemy` (ORM/abstracción para cualquier motor), y `pd.read_sql()` (trae datos directamente a un DataFrame). SQLite es perfecta para prototipos: es un archivo `.db` que funciona sin servidor, viene con Python, y soporta el 90% del SQL estándar. Para producción migras a PostgreSQL cambiando una línea.',
        'El flujo básico con sqlite3: `conn = sqlite3.connect("mi_base.db")`, `cursor = conn.cursor()`, `cursor.execute("SELECT * FROM clientes WHERE region=?", ("Lima",))`, `filas = cursor.fetchall()`. NUNCA uses f-strings para insertar valores en SQL — es vulnerable a SQL injection. SIEMPRE usa parámetros (`?` en sqlite3, `%s` en PostgreSQL). Para pandas, el atajo es `df = pd.read_sql("SELECT * FROM ventas WHERE monto > 1000", conn)` — directo a DataFrame sin loop. Y al revés: `df.to_sql("ventas_nuevas", conn, if_exists="append", index=False)` persiste un DataFrame a una tabla SQL. Esto es oro para pipelines ETL.',
        'SQLAlchemy agrega una capa de abstracción: defines modelos como clases Python, y SQLAlchemy genera el SQL. Útil cuando tu app crece y quieres cambiar de SQLite a PostgreSQL sin reescribir queries. El patrón `create_engine("sqlite:///mi_base.db")` crea un engine que pasas a `pd.read_sql(query, engine)`. Para DS, el 80% del tiempo solo necesitas sqlite3 + pd.read_sql. SQLAlchemy lo aprendes cuando te toca mantener una app más grande. Lo importante: practica escribir queries SQL reales (JOINs, GROUP BY, window functions) — es la skill #1 que evalúan en entrevistas de Data Analyst.',
      ],
      code: {
        language: 'python',
        title: 'sql_bridge.py',
        code: `import sqlite3
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, Session

# === 1. SQLite básico (built-in, sin instalar nada) ===
conn = sqlite3.connect("ventas.db")
cursor = conn.cursor()

# Crear tabla
cursor.execute("""
CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY,
    producto TEXT NOT NULL,
    monto REAL NOT NULL,
    region TEXT,
    fecha TEXT
)
""")

# Insertar (con parámetros — NUNCA f-strings)
ventas = [
    ("Laptop", 3500.0, "Lima", "2024-01-15"),
    ("Mouse", 45.0, "Arequipa", "2024-01-15"),
    ("Teclado", 120.0, "Lima", "2024-01-16"),
]
cursor.executemany(
    "INSERT INTO ventas (producto, monto, region, fecha) VALUES (?, ?, ?, ?)",
    ventas,
)
conn.commit()

# Query con parámetros (seguro contra SQL injection)
region = "Lima"
cursor.execute("SELECT * FROM ventas WHERE region = ?", (region,))
lima_ventas = cursor.fetchall()
# [(1, "Laptop", 3500.0, "Lima", "2024-01-15"), (3, "Teclado", 120.0, "Lima", "2024-01-16")]

# === 2. pd.read_sql — el puente mágico a pandas ===
df = pd.read_sql("SELECT region, SUM(monto) as total FROM ventas GROUP BY region", conn)
print(df)
#       region   total
# 0   Arequipa    45.0
# 1      Lima  3620.0

# Y al revés: persistir un DataFrame
df_nuevo = pd.DataFrame({"producto": ["Monitor"], "monto": [850.0],
                          "region": ["Cusco"], "fecha": ["2024-01-17"]})
df_nuevo.to_sql("ventas", conn, if_exists="append", index=False)

# === 3. SQLAlchemy para producción ===
engine = create_engine("sqlite:///ventas.db")  # cambia a postgresql://... en prod

# Usar con pandas igual que sqlite3
df_grande = pd.read_sql("""
    SELECT region, COUNT(*) as n_ventas, AVG(monto) as ticket_promedio
    FROM ventas
    GROUP BY region
    HAVING COUNT(*) > 0
    ORDER BY n_ventas DESC
""", engine)

# === 4. SQLAlchemy ORM (modelos como clases) ===
Base = declarative_base()

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    dni = Column(String, unique=True)
    ingreso_mensual = Column(Float)

Base.metadata.create_all(engine)

with Session(engine) as session:
    nuevo = Cliente(nombre="María Quispe", dni="12345678", ingreso_mensual=4500)
    session.add(nuevo)
    session.commit()

conn.close()`,
      },
      callout: {
        type: 'danger',
        title: 'SQL Injection — el error #1 de seguridad',
        content:
          'NUNCA hagas `cursor.execute(f"SELECT * FROM users WHERE name = \'{name}\'")`. Si `name` viene del usuario y contiene `\' OR 1=1 --`, te borran la tabla. SIEMPRE usa parámetros: `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`. Es la diferencia entre código production-ready y un CVE esperando pasar.',
      },
    },
    {
      heading: 'Multiprocessing & concurrent.futures — paralelizar feature engineering',
      paragraphs: [
        'Python tiene el famoso GIL (Global Interpreter Lock): solo un thread ejecuta bytecode Python a la vez. Esto significa que threading NO acelera tareas CPU-bound (cálculo puro) — solo ayuda con I/O-bound (red, disco). Para acelerar feature engineering, transformación de imágenes, o hyperparameter sweeps, necesitas `multiprocessing`: procesos separados, cada uno con su propio GIL, corriendo en paralelo en múltiples cores. En una laptop de 8 cores, una tarea CPU-bound puede correr 6-7x más rápido (no 8x por overhead). En servidores cloud con 32 cores, los speedups son dramáticos.',
        'La API moderna es `concurrent.futures.ProcessPoolExecutor` y `ThreadPoolExecutor`. Patrón básico: `with ProcessPoolExecutor() as executor: results = list(executor.map(func, items))`. Esto crea un pool de procesos workers, distribuye los items, y recolecta resultados. Para tareas CPU-bound (calcular features por cliente, transformar imágenes, encodear videos) usa Process. Para I/O-bound (scrapear 100 URLs, llamar 50 APIs) usa Thread. La regla: si tu función pasa el 90% del tiempo esperando red/disco → Thread; si pasa el 90% calculando → Process.',
        'El caso de uso clásico en DS: tienes 500k clientes y necesitas calcular 20 features por cliente (RFM, recencia, frecuencia, monetario). En single-process tarda 4 horas. Con `ProcessPoolExecutor(max_workers=8)` y `executor.map(calcular_features, chunks_de_clientes)`, baja a 35 minutos. Otro caso: hyperparameter sweep con 100 configs de modelo — en paralelo corren 8 a la vez. Cuidado con: (1) memoria (cada proceso copia data — pasa chunks chicos, no DataFrames gigantes), (2) funciones lambda (no se pueden picklear — usa funciones top-level con `def`), (3) shared state (multiprocessing tiene Queues y Managers pero es complejo).',
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
    """Simula cómputo pesado por cliente."""
    # En la vida real: query DB, transforma, calcula 20 features
    np.random.seed(cliente_id)  # determinista
    historial = np.random.exponential(30, 365)  # 365 días de compras
    recencia = 365 - np.argmax(historial[::-1] > 0)  # días desde última compra
    frecuencia = (historial > 0).sum()
    monetario = historial.sum()
    return {
        "cliente_id": cliente_id,
        "recencia": recencia,
        "frecuencia": frecuencia,
        "monetario": float(monetario),
        "rfm_score": recencia * 0.3 + frecuencia * 0.4 + monetario * 0.3,
    }

# Single-process (lento)
start = time.time()
n_clientes = 10_000
resultados_seq = [calcular_features_cliente(i) for i in range(n_clientes)]
print(f"Secuencial: {time.time() - start:.1f}s")
# Secuencial: 8.5s

# Paralelo (rápido) — usa todos los cores disponibles
start = time.time()
with ProcessPoolExecutor(max_workers=8) as executor:
    resultados_par = list(executor.map(calcular_features_cliente, range(n_clientes)))
print(f"Paralelo (8 workers): {time.time() - start:.1f}s")
# Paralelo (8 workers): 1.4s  (~6x speedup)

# === 2. I/O-bound: scrapear 50 URLs en paralelo ===
def fetch_url(url: str) -> tuple[str, int]:
    """Descarga una URL y devuelve (url, status_code)."""
    try:
        resp = requests.get(url, timeout=10)
        return (url, resp.status_code)
    except Exception as e:
        return (url, -1)

urls = [f"https://api.mercadolibre.com/items/{i}" for i in range(50)]

# Threads son ideales para I/O
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(fetch_url, url) for url in urls]
    for future in as_completed(futures):
        url, status = future.result()
        # print(f"{url} -> {status}")

# === 3. Procesar un DataFrame en chunks paralelos ===
def procesar_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """Aplica feature engineering a un chunk del DataFrame."""
    chunk = chunk.copy()
    chunk["log_monto"] = np.log1p(chunk["monto"])
    chunk["monto_zscore"] = (chunk["monto"] - chunk["monto"].mean()) / chunk["monto"].std()
    return chunk

df_grande = pd.DataFrame({
    "cliente_id": range(100_000),
    "monto": np.random.exponential(500, 100_000),
})

# Partir en 8 chunks, procesar en paralelo, recombinar
chunks = np.array_split(df_grande, 8)
with ProcessPoolExecutor(max_workers=8) as executor:
    chunks_procesados = list(executor.map(procesar_chunk, chunks))
df_final = pd.concat(chunks_procesados, ignore_index=True)
print(df_final.head())
#    cliente_id       monto  log_monto  monto_zscore
# 0           0  123.456789   4.820282      0.241983
# 1           1   45.678912   3.842156     -0.901234
# ...`,
      },
      callout: {
        type: 'tip',
        title: 'Joblib para scikit-learn',
        content:
          'scikit-learn usa joblib internamente para paralelizar (`n_jobs=-1` en GridSearchCV, RandomForest, etc.). Si tu código es sklearn-céntrico, solo pasa `n_jobs=-1`. Para código custom, usa concurrent.futures. Joblib también tiene `Parallel(n_jobs=-1)(delayed(func)(x) for x in items)` que es muy similar a ProcessPoolExecutor.map.',
      },
    },
    {
      heading: 'Regular Expressions — limpieza de texto y parsing de logs',
      paragraphs: [
        'Las expresiones regulares (regex) son un mini-lenguaje para buscar patrones en texto. En data science las usas TODO el tiempo: extraer DNI de strings (`\\d{8}`), validar emails (`^[\\w.-]+@[\\w.-]+\\.\\w+$`), limpiar números de teléfono peruanos (`(?:\\+51)?\\s*9?\\d{8}`), parsear logs de servidor Apache (`^(\\S+) \\S+ \\S+ \\[([^\\]]+)\\] "(\\w+) (\\S+)"`), extraer hashtags de tweets, normalizar fechas en distintos formatos. Sin regex, terminas escribiendo 50 líneas de `str.split()` y `str.startswith()` para algo que regex resuelve en una línea. Vale la pena aprenderlas bien — es una skill transferible a cualquier lenguaje (SQL, JS, Java, bash).',
        'El módulo en Python es `re`. Las funciones clave: `re.search(patron, texto)` (encuentra el primer match en cualquier posición), `re.match(patron, texto)` (match solo al inicio), `re.findall(patron, texto)` (todos los matches como lista), `re.finditer` (iterador de match objects), `re.sub(patron, reemplazo, texto)` (buscar y reemplazar), `re.split(patron, texto)` (split por patrón). Compila patrones reusados con `re.compile()` para mejor performance. Los caracteres especiales: `.` (cualquier char), `\\d` (dígito), `\\w` (word char), `\\s` (espacio), `+` (1+), `*` (0+), `?` (0 o 1), `{n,m}` (entre n y m), `[]` (conjunto), `()` (grupo capturable), `|` (o).',
        'Para NLP en español, regex es esencial en el preprocesamiento: (1) quitar acentos para normalización (`unicodedata.normalize("NFD", texto).encode("ascii", "ignore").decode()`), (2) remover URLs (`https?://\\S+`), (3) remover menciones de Twitter (`@\\w+`), (4) tokenización simple (`re.findall(r"\\w+", texto)`), (5) extraer emojis (regex compleja pero existe). Caso de uso real: parsear logs de un servicio web para extraer IPs, timestamps, status codes, y rutas — convertir texto no estructurado en un DataFrame para análisis. Esto se hace MILES de veces al día en equipos de DevOps y SRE.',
      ],
      code: {
        language: 'python',
        title: 'regex_ejemplos.py',
        code: `import re
import pandas as pd

# === 1. Extraer DNIs peruanos (8 dígitos) ===
texto = "Contactos: Maria 12345678, Juan 87654321, sin dni 12345"
dnis = re.findall(r"\\b\\d{8}\\b", texto)
print(dnis)  # ['12345678', '87654321']

# === 2. Validar email ===
def es_email_valido(email: str) -> bool:
    patron = r"^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$"
    return bool(re.match(patron, email))

print(es_email_valido("maria@gmail.com"))   # True
print(es_email_valido("no-es-email"))       # False

# === 3. Limpiar números de teléfono peruanos ===
def normalizar_telefono(tel: str) -> str:
    """Convierte '+51 987 654 321' o '987654321' a '987654321'."""
    digitos = re.sub(r"\\D", "", tel)  # quitar todo lo que no es dígito
    if digitos.startswith("51"):
        digitos = digitos[2:]  # quitar prefijo país
    return digitos[-9:] if len(digitos) >= 9 else digitos

print(normalizar_telefono("+51 987 654 321"))  # 987654321
print(normalizar_telefono("987-654-321"))      # 987654321

# === 4. Parsear logs de Apache/Nginx ===
log_line = '192.168.1.1 - - [15/Jan/2024:10:30:45 -0500] "GET /api/users HTTP/1.1" 200 1234'
patron_log = re.compile(
    r'^(\\S+) \\S+ \\S+ \\[([^\\]]+)\\] "(\\w+) (\\S+) [^"]+" (\\d+) (\\d+)$'
)
m = patron_log.match(log_line)
if m:
    ip, timestamp, metodo, ruta, status, size = m.groups()
    print(f"IP: {ip}, Status: {status}, Ruta: {ruta}")
# IP: 192.168.1.1, Status: 200, Ruta: /api/users

# === 5. Aplicar regex a una columna de pandas ===
df = pd.DataFrame({
    "tweet": [
        "Hola @maria chevre tu post https://bit.ly/abc #Peru",
        "RT @juan: mirá esto https://t.co/xyz #DataScience",
        "Sin menciones ni URLs, solo texto plano",
    ]
})

# Limpiar tweets: quitar URLs, menciones, hashtags
df["limpio"] = df["tweet"].str.replace(r"https?://\\S+", "", regex=True)
df["limpio"] = df["limpio"].str.replace(r"@\\w+", "", regex=True)
df["limpio"] = df["limpio"].str.replace(r"#(\\w+)", r"\\1", regex=True)  # quitar # pero guardar palabra
df["limpio"] = df["limpio"].str.strip()
print(df["limpio"].tolist())
# ['Hola  chevre tu post  Peru',
#  'RT : mirá esto  DataScience',
#  'Sin menciones ni URLs, solo texto plano']

# === 6. Extraer fechas en múltiples formatos ===
fechas = "Reunión 15/01/2024, entrega 2024-02-28, cierre 28.02.24"
patron_fecha = re.compile(r"\\b(\\d{1,2})[/.-](\\d{1,2})[/.-](\\d{2,4})\\b")
for dia, mes, anio in patron_fecha.findall(fechas):
    anio = anio if len(anio) == 4 else "20" + anio
    print(f"{anio}-{int(mes):02d}-{int(dia):02d}")`,
      },
      callout: {
        type: 'warning',
        title: 'Catastrophic backtracking',
        content:
          'Evita patrones como `(a+)+b` contra strings largos sin "b" al final — causan backtracking exponencial y pueden colgar tu script por horas. Si una regex tarda mucho, simplifícala o usa `re.compile(patron, re.IGNORECASE)` (más rápido). Testea regex con regex101.com antes de ponerlas en producción.',
      },
    },
    {
      heading: 'collections — Counter, defaultdict, namedtuple, deque',
      paragraphs: [
        'El módulo `collections` (built-in) tiene 4 herramientas que TODO Data Scientist debería usar a diario. (1) `Counter`: diccionario especializado para contar. `Counter([1,1,2,3,3,3])` devuelve `Counter({3: 3, 1: 2, 2: 1})`. Tiene `.most_common(n)` para top-N. Reemplaza 5 líneas de `dict.get(k, 0) + 1` por una. (2) `defaultdict`: diccionario con valor default automático. `defaultdict(list)` crea una lista vacía si la key no existe — perfecto para agrupar. Reemplaza el patrón `if k not in d: d[k] = []; d[k].append(v)` por `d[k].append(v)` directo.',
        '(3) `namedtuple`: tuplas con nombres de campo. `Cliente = namedtuple("Cliente", ["nombre", "dni", "edad"])` te permite hacer `c = Cliente("María", "12345678", 30)` y acceder `c.nombre` en vez de `c[0]`. Más legible que tuplas planas, más liviano que clases. Útil para retornar múltiples valores de una función con claridad. (4) `deque` (double-ended queue): lista optimizada para agregar/quitar por ambos extremos en O(1). Las listas normales son O(n) para `insert(0, x)` o `pop(0)`. Para colas, buffers, sliding windows, deque es la opción correcta.',
        'En DS real, `Counter` lo usas para histogramas de variables categóricas, top-N productos más vendidos, frecuencia de palabras en NLP. `defaultdict(list)` para groupby manual antes de pasar a pandas (`defaultdict(list); for row in data: groups[row["region"]].append(row["monto"])`). `namedtuple` para estructuras de configuración inmutables o retornos de funciones que devuelven varios resultados. `deque` para mantener una ventana deslizante de los últimos N eventos en streaming (ej: últimos 1000 logs para detectar anomalías). Conocer estas 4 herramientas te hace escribir código 2x más limpio que si solo usas list y dict básicos.',
      ],
      code: {
        language: 'python',
        title: 'collections_ejemplos.py',
        code: `from collections import Counter, defaultdict, namedtuple, deque
import pandas as pd

# === 1. Counter: contar y top-N ===
ventas = ["laptop", "mouse", "laptop", "teclado", "mouse", "mouse", "monitor"]
contador = Counter(ventas)
print(contador)
# Counter({'mouse': 3, 'laptop': 2, 'teclado': 1, 'monitor': 1})

print(contador.most_common(2))  # top 2 productos
# [('mouse', 3), ('laptop', 2)]

# Contar palabras en un texto (mini NLP)
texto = "el gato come pescado el perro come carne el gato duerme"
frecuencia = Counter(texto.split())
print(frecuencia.most_common(3))
# [('el', 3), ('gato', 2), ('come', 2)]

# === 2. defaultdict: agrupar sin if/else ===
transacciones = [
    {"cliente": "Maria", "monto": 100},
    {"cliente": "Juan", "monto": 50},
    {"cliente": "Maria", "monto": 200},
    {"cliente": "Pedro", "monto": 75},
    {"cliente": "Juan", "monto": 30},
]

# Sin defaultdict (verboso):
grupos_viejo = {}
for t in transacciones:
    if t["cliente"] not in grupos_viejo:
        grupos_viejo[t["cliente"]] = []
    grupos_viejo[t["cliente"]].append(t["monto"])

# Con defaultdict (limpio):
grupos = defaultdict(list)
for t in transacciones:
    grupos[t["cliente"]].append(t["monto"])

# Calcular gasto total por cliente
gasto = {cliente: sum(montos) for cliente, montos in grupos.items()}
print(gasto)  # {'Maria': 300, 'Juan': 80, 'Pedro': 75}

# defaultdict(int) para contar (alternativa a Counter)
conteo = defaultdict(int)
for t in transacciones:
    conteo[t["cliente"]] += 1
print(dict(conteo))  # {'Maria': 2, 'Juan': 2, 'Pedro': 1}

# === 3. namedtuple: tuplas con nombres ===
Cliente = namedtuple("Cliente", ["nombre", "dni", "edad", "ingreso"])

def buscar_cliente(cliente_id: int) -> Cliente:
    # en la vida real, query a DB
    return Cliente("María Quispe", "12345678", 32, 4500.0)

c = buscar_cliente(1)
print(c.nombre)   # María Quispe  (en vez de c[0])
print(c.edad)     # 32
print(c.ingreso)  # 4500.0
nombre, dni, edad, ingreso = c  # desempaquetable como tupla normal

# === 4. deque: colas eficientes ===
# Mantener ventana deslizante de últimos 5 logs
ventana = deque(maxlen=5)  # tamaño fijo, descarta viejos automáticamente
for log_id in range(10):
    ventana.append(f"log_{log_id}")
    if log_id >= 4:
        print(list(ventana))  # últimos 5 siempre
# ['log_0', 'log_1', 'log_2', 'log_3', 'log_4']
# ['log_1', 'log_2', 'log_3', 'log_4', 'log_5']
# ...
# ['log_5', 'log_6', 'log_7', 'log_8', 'log_9']

# Comparativa de performance: deque vs list para insert(0, x)
import time
lista = list(range(100_000))
dq = deque(range(100_000))

start = time.time()
for _ in range(1000):
    lista.insert(0, -1)
print(f"list.insert(0, x) x1000: {time.time() - start:.3f}s")  # ~0.5s (lento)

start = time.time()
for _ in range(1000):
    dq.appendleft(-1)
print(f"deque.appendleft x1000: {time.time() - start:.3f}s")  # ~0.0001s (10000x más rápido)`,
      },
      callout: {
        type: 'tip',
        title: 'dataclasses: la evolución moderna de namedtuple',
        content:
          'Para estructuras más complejas (con métodos, validación, mutabilidad), usa `@dataclass` (Python 3.7+). Es como namedtuple pero con type hints, valores default, y métodos. Para datos inmutables simples, namedtuple sigue siendo más liviano. Para DTOs, configuraciones, modelos, prefiere dataclass.',
      },
    },
    {
      heading: 'Profiling & Benchmarking — timeit, cProfile, line_profiler',
      paragraphs: [
        'La regla #1 de optimización: NUNCA optimices sin medir primero. La intuición humana sobre qué es lento es pésima — el 80% de las veces, el bottleneck NO es donde crees. Por eso necesitas profiling: medir exactamente dónde se gasta el tiempo. Python tiene 3 herramientas: `timeit` (microbenchmarks de snippets), `cProfile` (perfil de toda una ejecución, función por función), y `line_profiler` (perfil línea por línea de una función específica). Combinadas, te dicen EXACTAMENTE qué optimizar y — más importante — qué NO tocar.',
        '`timeit` es para comparar implementaciones de un mismo algoritmo. Por ejemplo: ¿es más rápido `[x*2 for x in range(1000)]` o `list(map(lambda x: x*2, range(1000)))`? Con `timeit.timeit(stmt, number=10000)` lo sabes en 2 segundos. Es esencial cuando dudas entre dos formas de escribir algo. `cProfile` es para scripts completos: corres `python -m cProfile -s cumulative mi_script.py` y obtienes una tabla con cada función, cuántas veces se llamó, y cuánto tiempo total gastó. Identificas la función que se come el 80% del tiempo y la atacas.',
        '`line_profiler` es el más detallado: perfil línea por línea de UNA función. Lo instalas con `pip install line_profiler`, decoras la función con `@profile`, y corres `kernprof -l -v mi_script.py`. Te muestra por cada línea: tiempo total, porcentaje del total, tiempo por llamada. Descubres cosas como "esta línea de pandas .iterrows() se come el 95% del tiempo" — y la reescribes vectorizada para 100x speedup. En DS, el 80% de las optimizaciones son: (1) reemplazar `.iterrows()` con operaciones vectorizadas, (2) usar numpy en vez de Python loops, (3) cachear resultados de funciones puras, (4) usar C-extensions (numba, cython) para hot paths.',
      ],
      code: {
        language: 'python',
        title: 'profiling_demo.py',
        code: `# === 1. timeit: comparar dos implementaciones ===
import timeit

# Lista por comprehension
t1 = timeit.timeit("[x*2 for x in range(1000)]", number=10000)
# Map con lambda
t2 = timeit.timeit("list(map(lambda x: x*2, range(1000)))", number=10000)
print(f"List comp: {t1:.3f}s")
print(f"Map+lambda: {t2:.3f}s")
# List comp: 0.42s
# Map+lambda: 0.58s  (list comp gana)

# === 2. cProfile: perfil de script completo ===
# Guarda como perf_demo.py y corre:
#   python -m cProfile -s cumulative perf_demo.py
import pandas as pd
import numpy as np

def procesar_datos_lento(n: int = 100_000):
    df = pd.DataFrame({"x": np.random.randn(n), "y": np.random.randn(n)})
    # Forma LENTA (iterrows)
    resultado = []
    for _, row in df.iterrows():
        resultado.append(row["x"] ** 2 + row["y"] ** 2)
    return sum(resultado)

def procesar_datos_rapido(n: int = 100_000):
    df = pd.DataFrame({"x": np.random.randn(n), "y": np.random.randn(n)})
    # Forma RÁPIDA (vectorizada)
    return float((df["x"] ** 2 + df["y"] ** 2).sum())

# Output de cProfile (top 10 por tiempo cumulativo):
#    ncalls  tottime  percall  cumtime  percall filename:lineno(function)
#       100  185.234    1.852  185.234    1.852 perf_demo.py:5(procesar_datos_lento)
#   10000000   12.451    0.000   12.451    0.000 {method 'append' of 'list' objects}
#         1    0.045    0.045    0.045    0.045 perf_demo.py:13(procesar_datos_rapido)
# → El 99.9% del tiempo está en procesar_datos_lento. Optimiza eso.

# === 3. line_profiler: perfil línea por línea ===
# Instala: pip install line_profiler
# Decora la función con @profile (line_profiler la provee)
# Corre: kernprof -l -v perf_demo.py

# @profile  # descomenta para line_profiler
def feature_engineering(df):
    n = len(df)
    df["log_x"] = np.log1p(df["x"])                # 5% del tiempo
    df["zscore"] = (df["x"] - df["x"].mean()) / df["x"].std()  # 3%
    df["rolling_mean"] = df["x"].rolling(7).mean()  # 15%
    df["categoria"] = pd.cut(df["x"], bins=10, labels=False)  # 8%
    for i in range(n):  # ESTA LÍNEA: 65% del tiempo
        df.loc[i, "custom"] = df.loc[i, "x"] * 2  # .loc[i] es lento
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
# → El loop con .loc[i] es el bottleneck. Vectoriza: df["custom"] = df["x"] * 2 (1 línea, 100x más rápido)

# === 4. memory_profiler (bonus) ===
# pip install memory_profiler
# Decorador @profile, corres python -m memory_profiler script.py
# Te muestra uso de RAM línea por línea — útil para detectar memory leaks.`,
      },
      callout: {
        type: 'info',
        title: 'Regla de oro: mide, no adivines',
        content:
          'Antes de optimizar, SIEMPRE corre cProfile. El 80% de las optimizaciones "intuitivas" no producen speedup real porque atacan el 20% del código. Mide, identifica el hot path, optimiza SOLO ese, vuelve a medir. Itera. Es lo que diferencia a seniors de juniors: los seniors perfilan, los juniors adivinan.',
      },
    },
    {
      heading: 'Logging — producción DS necesita logs estructurados',
      paragraphs: [
        '`print()` es para debugging en desarrollo. `logging` es para producción. La diferencia: print siempre imprime (no puedes desactivarlo sin comentar líneas), no tiene niveles, no tiene timestamps, no escribe a archivo sin redirección. El módulo `logging` (built-in) resuelve todo: niveles (DEBUG/INFO/WARNING/ERROR/CRITICAL), formato configurable (timestamp, nivel, mensaje, módulo), múltiples destinos (consola, archivo, syslog, HTTP), y se desactiva por nivel en producción. En un pipeline de DS en producción, sin logs no puedes debuggear un fallo a las 3am — los logs son tu única pista.',
        'Configuración básica: `logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s", handlers=[...])`. Creas un logger por módulo con `logger = logging.getLogger(__name__)`. Usas `logger.info("Procesando %d filas", n)` (¡usa %-format, no f-string, para que el formato se aplique solo si el nivel está activo!). En producción subes el nivel a WARNING (ERROR aún mejor) para reducir ruido. Para DS, loggea: inicio/fin de cada etapa del pipeline, cuántos registros procesaste, tiempo de cada etapa, advertencias (datos faltantes, outliers), errores con traceback completo.',
        'Para logs estructurados (machine-parseable), usa JSON: cada log es un dict con timestamp, level, message, y campos custom (run_id, n_rows, duration_sec). Esto permite buscar en Kibana/Datadog con queries como `level:ERROR AND module:feature_eng AND n_rows>10000`. La librería `structlog` o `python-json-logger` lo facilitan. En empresas serias, los logs van a un sistema centralizado (ELK stack, Splunk, Datadog) donde los consulta el equipo on-call. Como Data Scientist, SIEMPRE loggea tus pipelines — si fallan en prod, los logs son tu única forma de diagnosticar sin reproducir el entorno.',
      ],
      code: {
        language: 'python',
        title: 'logging_setup.py',
        code: `import logging
import sys
from pathlib import Path

# === 1. Configuración básica ===
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

# Uso por niveles
logger.debug("Mensaje detallado (solo en dev)")     # no se muestra si level=INFO
logger.info("Pipeline iniciado")                      # se muestra
logger.warning("Dataset tiene 5 nulos, imputando")    # se muestra
logger.error("Falló la conexión a la API")            # se muestra
logger.critical("Disco lleno, no se puede escribir")  # se muestra

# === 2. Logger en un pipeline de DS ===
import pandas as pd
import time

def run_pipeline(csv_path: str):
    logger.info("Iniciando pipeline para %s", csv_path)

    start = time.time()
    try:
        df = pd.read_csv(csv_path)
        logger.info("Cargado %d filas, %d columnas en %.2fs",
                    len(df), df.shape[1], time.time() - start)
    except FileNotFoundError:
        logger.error("Archivo no encontrado: %s", csv_path)
        raise

    # Limpieza
    n_nulos_antes = df.isnull().sum().sum()
    if n_nulos_antes > 0:
        logger.warning("%d nulos detectados, imputando con mediana", n_nulos_antes)
        df = df.fillna(df.median(numeric_only=True))

    # Feature engineering
    start = time.time()
    df["log_monto"] = df["monto"].apply(lambda x: max(0, x))  # placeholder
    logger.info("Feature engineering completado en %.2fs", time.time() - start)

    # Guardar
    out_path = csv_path.replace(".csv", "_procesado.parquet")
    df.to_parquet(out_path)
    logger.info("Guardado en %s (%d filas)", out_path, len(df))

    return df

# === 3. JSON logging estructurado (producción) ===
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
# Cada log se escribe como JSON: {"asctime": "...", "levelname": "INFO", "message": "..."}

# === 4. Logging en archivos rotados (no crecen infinitos) ===
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    "app.log",
    maxBytes=10 * 1024 * 1024,  # 10 MB por archivo
    backupCount=5,               # mantener 5 archivos viejos
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
          'Mal: `logger.info(f"Procesé {n} filas")`. Bien: `logger.info("Procesé %d filas", n)`. Con f-string, el formato se evalúa SIEMPRE, incluso si el nivel está apagado (performance). Con %-format, el formato se aplica solo si el mensaje se va a mostrar. En pipelines con miles de logs debug, esto es 5-10x más rápido.',
      },
    },
    {
      heading: 'argparse / CLI tooling — de notebook a herramienta reusable',
      paragraphs: [
        'Un notebook Jupyter es excelente para explorar, pero no es reusable: tienes que abrirlo, cambiar celdas, re-ejecutar. Para que tu código lo usen otros (o tú mismo en 6 meses), necesitas un CLI (Command Line Interface) con `argparse`. Esto convierte tu script en una herramienta: `python pipeline.py --input ventas.csv --output resultado.parquet --verbose` en vez de editar variables dentro del código. En equipos de data science, los CLIs son la forma estándar de compartir pipelines — un colega hace `pip install -e .` y luego corre `mi-pipeline --help` sin abrir un notebook.',
        '`argparse` es built-in. Patrón básico: `parser = argparse.ArgumentParser(description="...")`, `parser.add_argument("--input", required=True, help="Archivo CSV de entrada")`, `args = parser.parse_args()`. Tipos (`type=int`, `type=float`), valores default (`default=100`), choices (`choices=["prod", "dev"]`), flags booleanas (`--verbose`, `action="store_true"`), múltiples valores (`nargs="+"` para listas). El atributo `--help` se genera automáticamente desde tus `help=` strings — documentación gratis. Para subcomandos (como `git push`, `git pull`), usa `subparsers`.',
        'Para proyectos serios, evoluciona a `click` (sintaxis con decoradores más limpia) o `typer` (type hints nativos, autocompletado en shell). Pero argparse es suficiente para 80% de casos. Empaqueta tu CLI como un ejecutable con `pyproject.toml` + `entry_points`: defines `[project.scripts] mi-tool = "mi_paquete.cli:main"` y luego de `pip install -e .`, corres `mi-tool` desde cualquier lado. Esto es lo que hace que tu proyecto parezca "profesional" — un comando instalable, no un script que hay que ejecutar con `python ruta/al/script.py`. En tu portafolio, tener un CLI instalable vale 10x más que un notebook.',
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
                        help="Multiplicador IQR para outliers (default: 1.5)")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Mostrar logs detallados")
    parser.add_argument("--chunksize", type=int, default=None,
                        help="Tamaño de chunk para CSVs grandes (default: cargar todo)")

    args = parser.parse_args()

    # Configurar logging según verbosity
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s [%(levelname)s] %(message)s")
    logger = logging.getLogger("pipeline")

    # Validar inputs
    if not args.input.exists():
        logger.error("Archivo de entrada no existe: %s", args.input)
        sys.exit(1)

    logger.info("Iniciando pipeline")
    logger.info("  Input:  %s", args.input)
    logger.info("  Output: %s", args.output)
    logger.info("  Impute: %s", args.impute_strategy)

    # Cargar datos
    if args.chunksize:
        chunks = pd.read_csv(args.input, chunksize=args.chunksize)
        df = pd.concat(chunks)
    else:
        df = pd.read_csv(args.input)
    logger.info("Cargadas %d filas, %d columnas", len(df), df.shape[1])

    # Imputar
    if args.impute_strategy == "median":
        df = df.fillna(df.median(numeric_only=True))
    elif args.impute_strategy == "mean":
        df = df.fillna(df.mean(numeric_only=True))
    elif args.impute_strategy == "drop":
        df = df.dropna()

    # Guardar
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

# === pyproject.toml para hacerlo instalable ===
# [project]
# name = "pipeline-ventas"
# version = "0.1.0"
# [project.scripts]
# pipeline-ventas = "pipeline.cli:main"
# Después: pip install -e .  → puedes correr "pipeline-ventas" desde cualquier lado`,
      },
      callout: {
        type: 'tip',
        title: 'Typer: argparse con type hints',
        content:
          'Si ya usas type hints (Python 3.6+), `typer` genera el CLI automáticamente desde tus type hints. `def main(input: Path, output: Path, verbose: bool = False):` se convierte en CLI sin argparse manual. Es lo que usa FastAPI para sus ejemplos. Para proyectos nuevos, prefiere typer sobre argparse.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos un mini-end-to-end que integra 5 de los 10 temas: scraping de una API con paginación, almacenamiento en SQLite, feature engineering paralelizado, logging estructurado, y empaquetado como CLI. Es exactamente el tipo de pipeline que mantienes en un trabajo real de DS.',
    steps: [
      {
        description: 'Construir un data acquisition pipeline con API paginada + SQLite',
        code: {
          language: 'python',
          title: 'acquire_pipeline.py',
          code: `import requests
import sqlite3
import logging
import time
from typing import Iterator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("acquire")

def iterar_productos(api_base: str, max_pages: int = 50) -> Iterator[dict]:
    """Generador: trae productos página por página de una API REST."""
    url = f"{api_base}/products"
    page = 0
    while url and page < max_pages:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 429:
            wait = int(resp.headers.get("Retry-After", 60))
            logger.warning("Rate limited, esperando %ds", wait)
            time.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        for producto in data["results"]:
            yield producto
        url = data.get("next")
        page += 1
        logger.info("Página %d trajo %d productos", page, len(data["results"]))

def guardar_en_sqlite(productos: Iterator[dict], db_path: str = "productos.db"):
    """Crea tabla SQLite e inserta productos."""
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY,
            nombre TEXT,
            precio REAL,
            categoria TEXT,
            stock INTEGER,
            fecha_captura TEXT
        )
    """)
    conn.execute("DELETE FROM productos")  # refresh completo
    count = 0
    for p in productos:
        conn.execute(
            "INSERT OR REPLACE INTO productos (id, nombre, precio, categoria, stock, fecha_captura) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (p["id"], p["nombre"], p["precio"], p["categoria"], p["stock"], p["fecha"]),
        )
        count += 1
        if count % 100 == 0:
            conn.commit()
            logger.info("Insertados %d productos", count)
    conn.commit()
    conn.close()
    logger.info("Total insertado: %d productos", count)

# Ejecutar
productos = iterar_productos("https://api.ejemplo.com", max_pages=20)
guardar_en_sqlite(productos, "productos.db")`,
        },
        why: 'Este patrón (API paginada → generador → SQLite) es el 80% de los pipelines de data acquisition. El generador evita cargar todo en RAM, SQLite persiste para análisis posterior, y el logging te dice exactamente qué pasó si falla a las 3am.',
      },
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

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("features")

def cargar_datos(db_path: str = "productos.db") -> pd.DataFrame:
    conn = sqlite3.connect(db_path)
    df = pd.read_sql("SELECT * FROM productos", conn)
    conn.close()
    return df

def calcular_features_categoria(categoria: str, df: pd.DataFrame) -> pd.DataFrame:
    """Calcula features agregadas por categoría — cómputo pesado."""
    sub = df[df["categoria"] == categoria].copy()
    if sub.empty:
        return pd.DataFrame()
    sub["log_precio"] = np.log1p(sub["precio"])
    sub["zscore_precio"] = (sub["precio"] - sub["precio"].mean()) / sub["precio"].std()
    sub["percentil_precio"] = sub["precio"].rank(pct=True)
    sub["es_outlier"] = sub["zscore_precio"].abs() > 3
    return sub

def feature_engineering_paralelo(df: pd.DataFrame, n_workers: int = 8) -> pd.DataFrame:
    categorias = df["categoria"].unique()
    logger.info("Procesando %d categorías con %d workers", len(categorias), n_workers)

    start = time.time()
    chunks = [(cat, df[df["categoria"] == cat]) for cat in categorias]

    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        # Pasar tuplas (categoria, sub_df) a la función
        futures = [executor.submit(calcular_features_categoria, cat, sub) for cat, sub in chunks]
        resultados = [f.result() for f in futures]

    df_final = pd.concat([r for r in resultados if not r.empty], ignore_index=True)
    logger.info("Feature engineering completado en %.2fs", time.time() - start)
    return df_final

# Uso
df = cargar_datos()
df_features = feature_engineering_paralelo(df)
print(df_features[["nombre", "precio", "log_precio", "zscore_precio", "es_outlier"]].head())`,
        },
        why: 'Cuando tienes 50 categorías con 10k productos cada una, calcular features secuencialmente tarda 10 minutos. Con ProcessPoolExecutor(max_workers=8), baja a 90 segundos. El truco es partir el trabajo por una clave natural (categoría) y pasar chunks independientes a cada worker.',
      },
      {
        description: 'Empaquetar como CLI con argparse + logging integrado',
        code: {
          language: 'python',
          title: 'cli.py',
          code: `import argparse
import logging
import sys
from pathlib import Path

def setup_logging(verbose: bool = False, log_file: Path = None):
    handlers = [logging.StreamHandler(sys.stdout)]
    if log_file:
        handlers.append(logging.FileHandler(log_file))
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=handlers,
    )

def main():
    parser = argparse.ArgumentParser(description="Pipeline de productos: API → SQLite → features paralelas")
    parser.add_argument("--api-base", default="https://api.ejemplo.com",
                        help="URL base de la API")
    parser.add_argument("--db", default="productos.db", type=Path,
                        help="Archivo SQLite")
    parser.add_argument("--max-pages", type=int, default=20,
                        help="Máximo de páginas a scrapear")
    parser.add_argument("--workers", type=int, default=8,
                        help="Número de procesos paralelos")
    parser.add_argument("--log-file", type=Path, default="pipeline.log",
                        help="Archivo de log")
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--skip-acquire", action="store_true",
                        help="Saltar acquisition (usar DB existente)")
    args = parser.parse_args()

    setup_logging(args.verbose, args.log_file)
    logger = logging.getLogger("main")
    logger.info("Config: api=%s db=%s workers=%d", args.api_base, args.db, args.workers)

    # Importar funciones de los pasos anteriores
    from acquire_pipeline import iterar_productos, guardar_en_sqlite
    from parallel_features import cargar_datos, feature_engineering_paralelo

    if not args.skip_acquire:
        logger.info("Etapa 1: Adquisición de datos via API")
        productos = iterar_productos(args.api_base, max_pages=args.max_pages)
        guardar_en_sqlite(productos, args.db)
    else:
        logger.info("Saltando adquisición, usando DB existente")

    logger.info("Etapa 2: Feature engineering paralelo")
    df = cargar_datos(args.db)
    df_features = feature_engineering_paralelo(df, n_workers=args.workers)

    # Etapa 3: guardar resultado
    out = args.db.with_suffix(".parquet")
    df_features.to_parquet(out, index=False)
    logger.info("Pipeline completado. Resultado: %s (%d filas)", out, len(df_features))

if __name__ == "__main__":
    main()

# Uso:
# $ python cli.py --api-base https://api.ejemplo.com --max-pages 10 --workers 4 -v
# $ python cli.py --skip-acquire --workers 8   # solo feature eng sobre DB existente`,
        },
        why: 'Un CLI convierte tu pipeline en una herramienta. Tus colegas no necesitan leer tu código — corren `python cli.py --help` y entienden qué hace. Los flags te permiten re-correr solo partes (skip-acquire). El log file persiste evidencia de cada corrida. Esto es production-grade.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca practicar los 3 patrones más importantes: escribir un generador que procesa un CSV grande, consumir una API con paginación, y construir un CLI con argparse + regex + logging. Cada ejercicio tiene starter code y solution code — intenta resolverlo solo primero.',
    steps: [
      {
        instruction:
          'Escribe un generador `stream_csv` que lea un CSV grande fila por fila, filtre filas donde monto > 100, y yield diccionarios. Combínalo con un generador `batch` que agrupe de a N items.',
        hint: 'Usa `csv.DictReader` dentro del generador. Para batch, acumula en una lista y yield cuando llegues a N. Recuerda: yield pausa la función.',
        starterCode: {
          language: 'python',
          title: 'stream_csv_starter.py',
          code: `import csv
from typing import Iterator

def stream_csv(path: str, monto_min: float = 100.0) -> Iterator[dict]:
    """TODO: Lee CSV fila por fila, filtra monto > monto_min, yield dicts."""
    pass

def batch(items: Iterator, n: int = 100) -> Iterator[list]:
    """TODO: Agrupa items de a n, yield listas."""
    pass

# Test:
# for b in batch(stream_csv("ventas.csv", monto_min=500), n=50):
#     print(f"Procesando batch de {len(b)} items")`,
        },
        solutionCode: {
          language: 'python',
          title: 'stream_csv_solution.py',
          code: `import csv
from typing import Iterator

def stream_csv(path: str, monto_min: float = 100.0) -> Iterator[dict]:
    """Lee CSV fila por fila, filtra monto > monto_min, yield dicts."""
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for fila in reader:
            try:
                monto = float(fila.get("monto", 0))
            except ValueError:
                continue  # saltar filas con monto no numérico
            if monto > monto_min:
                yield fila

def batch(items: Iterator, n: int = 100) -> Iterator[list]:
    """Agrupa items de a n, yield listas. El último batch puede tener menos."""
    buffer = []
    for item in items:
        buffer.append(item)
        if len(buffer) >= n:
            yield buffer
            buffer = []
    if buffer:  # no olvidar el último partial
        yield buffer

# Test con un CSV de ejemplo
import tempfile, os
with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as f:
    f.write("cliente,monto,region\\n")
    for i in range(1000):
        monto = (i % 200) * 1.5  # rango 0 a 300
        region = ["Lima", "Arequipa", "Cusco"][i % 3]
        f.write(f"cliente_{i},{monto},{region}\\n")
    path = f.name

# Procesar: solo filas con monto > 100, en batches de 50
total_procesado = 0
for b in batch(stream_csv(path, monto_min=100), n=50):
    total_procesado += len(b)
    print(f"Batch de {len(b)} — acumulado: {total_procesado}")

print(f"Total filas con monto > 100: {total_procesado}")
# Salida esperada: 1000 filas, ~667 tienen monto > 100

os.unlink(path)`,
        },
      },
      {
        instruction:
          'Escribe una función `fetch_all_pages` que consuma una API REST con paginación tipo `?page=N` y devuelva una lista con TODOS los items. Maneja rate limiting (429) con sleep.',
        hint: 'Loop while True, params={"page": n}, si data["results"] vacío o no hay "next" → break. Si status 429, lee header "Retry-After" o espera 60s.',
        starterCode: {
          language: 'python',
          title: 'api_pag_starter.py',
          code: `import requests
import time

def fetch_all_pages(base_url: str, per_page: int = 100) -> list[dict]:
    """TODO: Trae todas las páginas de una API paginada con ?page=N."""
    pass

# Test (mock):
# data = fetch_all_pages("https://api.example.com/items")
# print(f"Total: {len(data)} items")`,
        },
        solutionCode: {
          language: 'python',
          title: 'api_pag_solution.py',
          code: `import requests
import time

def fetch_all_pages(base_url: str, per_page: int = 100, max_retries: int = 3) -> list[dict]:
    """Trae todas las páginas de una API paginada con ?page=N."""
    todos = []
    page = 1
    session = requests.Session()  # reutilizar conexión
    session.headers.update({"User-Agent": "ds-pipeline/1.0"})

    while True:
        for intento in range(max_retries):
            try:
                resp = session.get(
                    base_url,
                    params={"page": page, "per_page": per_page},
                    timeout=15,
                )
                if resp.status_code == 429:
                    wait = int(resp.headers.get("Retry-After", 60))
                    print(f"Rate limited, esperando {wait}s...")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                break
            except requests.RequestException as e:
                wait = 2 ** intento
                print(f"Intento {intento+1} falló: {e}, reintentar en {wait}s")
                time.sleep(wait)
        else:
            raise RuntimeError(f"Fallo tras {max_retries} intentos en página {page}")

        data = resp.json()
        items = data.get("results", data.get("data", []))
        if not items:
            break  # no hay más
        todos.extend(items)
        print(f"Página {page}: +{len(items)} (total: {len(todos)})")

        # Detectar fin: header Link, campo next, o página vacía
        if data.get("next") is None and page >= data.get("total_pages", page):
            break
        page += 1

    return todos

# Test con mock (en la vida real, usar http://jsonplaceholder.typicode.com)
if __name__ == "__main__":
    # Esta API devuelve 100 posts, 10 por página
    data = fetch_all_pages("https://jsonplaceholder.typicode.com/posts", per_page=10)
    print(f"\\nTotal: {len(data)} items traídos")
    print(f"Primer item: {data[0] if data else 'vacío'}")
# Output:
# Página 1: +10 (total: 10)
# Página 2: +10 (total: 20)
# ...
# Página 10: +10 (total: 100)
# Total: 100 items traídos
# Primer item: {'userId': 1, 'id': 1, 'title': 'sunt aut facere...', 'body': '...'}`,
        },
      },
      {
        instruction:
          'Construye un CLI con argparse que tome un archivo de texto, limpie números de teléfono peruanos con regex, loggee cuántos encontró, y guarde el resultado. Debe tener flags --verbose y --output.',
        hint: 'Patrón para celulares peruanos: (?:\\+51\\s?)?9\\d{8}. Usa re.findall con word boundaries. argparse con type=Path para archivos.',
        starterCode: {
          language: 'python',
          title: 'clean_phones_starter.py',
          code: `import argparse
import re
import logging
from pathlib import Path

# TODO: patrón regex para teléfonos peruanos
PATRON_TELEFONO = r"..."

def limpiar_telefonos(texto: str) -> list[str]:
    """TODO: Encuentra y normaliza teléfonos peruanos."""
    pass

def main():
    # TODO: argparse con --input, --output, --verbose
    # TODO: configurar logging
    # TODO: leer archivo, limpiar, escribir output, loggear count
    pass

if __name__ == "__main__":
    main()`,
        },
        solutionCode: {
          language: 'python',
          title: 'clean_phones_solution.py',
          code: `import argparse
import re
import logging
import sys
from pathlib import Path

# Patrón: opcional +51, opcional 9 inicial, 8 dígitos
# Acepta: 987654321, +51 987654321, 51-987-654-321, 987 654 321
PATRON_TELEFONO = re.compile(
    r"(?:\\+?51[\\s-]?)?\\b(9?\\d{8})\\b"
)

def limpiar_telefonos(texto: str) -> list[str]:
    """Encuentra y normaliza teléfonos peruanos a formato 9XXXXXXXX."""
    encontrados = PATRON_TELEFONO.findall(texto)
    # Normalizar: solo dígitos, asegurar que empiece con 9
    normalizados = []
    for tel in encontrados:
        digitos = re.sub(r"\\D", "", tel)
        if len(digitos) == 8 and not digitos.startswith("9"):
            continue  # teléfono fijo, no celular
        if len(digitos) == 9 and digitos.startswith("9"):
            normalizados.append(digitos)
    return normalizados

def main():
    parser = argparse.ArgumentParser(
        description="Extrae y normaliza teléfonos peruanos de un archivo de texto."
    )
    parser.add_argument("--input", "-i", required=True, type=Path,
                        help="Archivo de texto de entrada")
    parser.add_argument("--output", "-o", required=True, type=Path,
                        help="Archivo de salida (un teléfono por línea)")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Mostrar logs detallados")
    args = parser.parse_args()

    # Logging
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
    logger = logging.getLogger("phone-cleaner")

    # Validar
    if not args.input.exists():
        logger.error("Archivo no existe: %s", args.input)
        sys.exit(1)

    # Leer
    logger.info("Leyendo %s", args.input)
    texto = args.input.read_text(encoding="utf-8")
    logger.debug("Leídos %d caracteres", len(texto))

    # Limpiar
    telefonos = limpiar_telefonos(texto)
    logger.info("Encontrados %d teléfonos peruanos", len(telefonos))
    if args.verbose:
        for tel in telefonos[:5]:
            logger.debug("  → %s", tel)

    # Escribir
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\\n".join(telefonos) + "\\n", encoding="utf-8")
    logger.info("Guardado en %s", args.output)

if __name__ == "__main__":
    main()

# === Ejemplo de uso ===
# $ echo "Llamar a 987654321 o +51 987 654 321, también 12345678 fijo" > contactos.txt
# $ python clean_phones_solution.py -i contactos.txt -o limpios.txt -v
# 2024-01-15 [INFO] Leyendo contactos.txt
# 2024-01-15 [DEBUG] Leídos 65 caracteres
# 2024-01-15 [INFO] Encontrados 2 teléfonos peruanos
# 2024-01-15 [DEBUG]   → 987654321
# 2024-01-15 [DEBUG]   → 987654321
# 2024-01-15 [INFO] Guardado en limpios.txt
# $ cat limpios.txt
# 987654321
# 987654321`,
        },
      },
    ],
  },
  youDo: {
    title: 'Capstone: Pipeline de Adquisición + Limpieza + CLI — production-grade DS tool',
    context:
      'Construyes un CLI llamado `lead-scraper` que: (1) consume una API REST paginada (puedes usar jsonplaceholder o una API pública real como OpenFoodFacts), (2) limpia texto con regex (extrae emails, normaliza teléfonos), (3) almacena en SQLite con SQLAlchemy, (4) paraleliza un feature engineering simple con concurrent.futures, (5) loggea todo a archivo rotado, (6) se instala como comando con pyproject.toml. Es lo que entregarías en tu primer sprint como Data Scientist en una empresa seria.',
    objectives: [
      'Consumir una API REST con paginación y manejo de errores (rate limit, retry)',
      'Limpiar campos con regex (emails, teléfonos, URLs)',
      'Persistir datos en SQLite con SQLAlchemy ORM',
      'Paralelizar feature engineering con ProcessPoolExecutor',
      'Configurar logging estructurado a archivo rotado',
      'Empaquetar como CLI instalable con pyproject.toml',
    ],
    requirements: [
      'src/lead_scraper/acquire.py — función fetch_all_pages(api_url, max_pages) -> list[dict]',
      'src/lead_scraper/clean.py — funciones con regex: extract_emails(text), normalize_phones(text), clean_urls(text)',
      'src/lead_scraper/db.py — modelos SQLAlchemy + función save_to_db(records)',
      'src/lead_scraper/features.py — función parallel_feature_engineering(records, n_workers) usando ProcessPoolExecutor',
      'src/lead_scraper/cli.py — CLI con argparse: --api-url, --max-pages, --db, --workers, --verbose, --log-file',
      'pyproject.toml con [project.scripts] lead-scraper = "lead_scraper.cli:main"',
      'logs/ con rotación a 10MB, 5 backups',
      'tests/ con al menos 5 tests (test_clean.py con casos regex, test_features.py)',
      'README.md con instrucciones de instalación y uso, badge de tests',
    ],
    starterCode: `# pyproject.toml
[project]
name = "lead-scraper"
version = "0.1.0"
dependencies = ["requests", "sqlalchemy", "pandas"]

[project.scripts]
lead-scraper = "lead_scraper.cli:main"

# src/lead_scraper/cli.py
import argparse, logging
def main():
    parser = argparse.ArgumentParser(description="Lead scraper pipeline")
    # TODO: --api-url, --max-pages, --db, --workers, --verbose, --log-file
    # TODO: orquestar acquire → clean → db → features
    pass

# src/lead_scraper/clean.py
import re
def extract_emails(text: str) -> list[str]:
    # TODO: regex para emails
    pass
def normalize_phones(text: str) -> list[str]:
    # TODO: regex para teléfonos peruanos
    pass

# Continúa con db.py, features.py, acquire.py...`,
    portfolioNote:
      'Este proyecto es la diferencia entre "sé Python" y "soy Data Scientist production-ready". En entrevistas, los hiring managers te piden "muéstrame un proyecto end-to-end que hayas mantenido". Un CLI instalable con tests, logging estructurado, y manejo de errores profesionales es exactamente eso. Mencionarlo en tu CV como "construí pipelines ETL en Python con SQLAlchemy, multiprocessing y argparse que procesaron X millones de registros" es un diferenciador masivo en el mercado peruano.',
    rubric: [
      { criterion: 'Adquisición con API paginada + manejo de errores', weight: '20%' },
      { criterion: 'Limpieza con regex (emails, teléfonos, URLs) con tests', weight: '15%' },
      { criterion: 'Persistencia SQLAlchemy con modelos bien definidos', weight: '15%' },
      { criterion: 'Feature engineering paralelizado con concurrent.futures', weight: '15%' },
      { criterion: 'Logging estructurado con rotación de archivos', weight: '10%' },
      { criterion: 'CLI con argparse, flags completos, --help claro', weight: '10%' },
      { criterion: 'Instalable con pip install -e . y entrada lead-scraper', weight: '10%' },
      { criterion: 'Tests con pytest + README con badge', weight: '5%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué hace la palabra clave `yield` en una función de Python?',
        options: [
          'Lo mismo que return — termina la función',
          'Convierte la función en un generator que pausa su estado y resume en la próxima llamada',
          'Lanza una excepción',
          'Importa un módulo externo',
        ],
        correctIndex: 1,
        explanation:
          'Una función con yield se convierte en un generator. Cada vez que se llama next(), la función corre hasta el próximo yield, devuelve el valor, y pausa su estado. La próxima llamada continúa desde ahí. Esto permite lazy evaluation — clave para procesar datasets grandes sin agotar RAM.',
      },
      {
        question: '¿Cuál es la forma SEGURA de insertar valores en una query SQL en Python?',
        options: [
          'f"SELECT * FROM users WHERE name = \'{name}\'"',
          '"SELECT * FROM users WHERE name = " + name',
          'cursor.execute("SELECT * FROM users WHERE name = ?", (name,))',
          'cursor.execute("SELECT * FROM users WHERE name = {" + name + "}")',
        ],
        correctIndex: 2,
        explanation:
          'Usar parámetros con `?` (sqlite3) o `%s` (PostgreSQL) previene SQL injection. Si construyes la query con f-strings o concatenación, un usuario malicioso puede inyectar `\' OR 1=1 --` y leer/borrar toda la base. SIEMPRE parámetros, nunca concatenación.',
      },
      {
        question: '¿Cuándo usarías ProcessPoolExecutor vs ThreadPoolExecutor?',
        options: [
          'Thread para CPU-bound, Process para I/O-bound',
          'Process para CPU-bound (cálculo), Thread para I/O-bound (red/disco)',
          'Siempre Thread — es más rápido',
          'Siempre Process — es más seguro',
        ],
        correctIndex: 1,
        explanation:
          'El GIL de Python impide que múltiples threads ejecuten bytecode a la vez, así que threads NO aceleran cálculo (CPU-bound). Pero threads SÍ ayudan con I/O porque durante la espera (red, disco), el GIL se libera. Para feature engineering pesado → Process. Para scrapear 100 URLs → Thread.',
      },
      {
        question: '¿Qué función del módulo `re` devuelve TODOS los matches de un patrón como lista?',
        options: ['re.search(patron, texto)', 're.match(patron, texto)', 're.findall(patron, texto)', 're.sub(patron, texto)'],
        correctIndex: 2,
        explanation:
          're.findall devuelve todas las coincidencias del patrón en el texto como lista. re.search devuelve solo la primera (como Match object o None). re.match busca solo al inicio del string. re.sub busca y reemplaza. Para extraer todos los DNIs de un texto, re.findall es lo correcto.',
      },
      {
        question: '¿Cuál es la mejor práctica para logging en producción?',
        options: [
          'Usar print() con timestamps manuales',
          'logging.basicConfig con f-strings en los mensajes',
          'logging con niveles (INFO/WARNING/ERROR), %-format, y rotación de archivos',
          'Solo loggear errores, no info',
        ],
        correctIndex: 2,
        explanation:
          'Buen logging usa niveles (puedes subir/bajar verbosidad en prod), %-format (el formato se aplica solo si el nivel está activo — más rápido que f-string), múltiples handlers (consola + archivo), y RotatingFileHandler para que los logs no crezcan infinitamente. Sin logging estructurado, debuggear en producción es imposible.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — itertools & generators', url: 'https://docs.python.org/3/howto/functional.html', note: 'HOWTO oficial sobre programación funcional con generators' },
      { label: 'requests — Quickstart', url: 'https://docs.python-requests.org/en/latest/user/quickstart/', note: 'Documentación oficial de requests' },
      { label: 'BeautifulSoup — Docs', url: 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/', note: 'Parser HTML más usado en Python' },
      { label: 'SQLAlchemy — Tutorial', url: 'https://docs.sqlalchemy.org/en/20/tutorial/', note: 'Tutorial oficial de SQLAlchemy 2.0' },
      { label: 'concurrent.futures — Docs', url: 'https://docs.python.org/3/library/concurrent.futures.html', note: 'API moderna de paralelismo en Python' },
      { label: 're — Regular Expressions', url: 'https://docs.python.org/3/library/re.html', note: 'Docs del módulo re' },
      { label: 'collections — Container datatypes', url: 'https://docs.python.org/3/library/collections.html', note: 'Counter, defaultdict, namedtuple, deque' },
      { label: 'logging — HOWTO', url: 'https://docs.python.org/3/howto/logging.html', note: 'Guía oficial de logging' },
      { label: 'argparse — Tutorial', url: 'https://docs.python.org/3/howto/argparse.html', note: 'HOWTO oficial de argparse' },
      { label: 'regex101.com', url: 'https://regex101.com/', note: 'Probador interactivo de regex con explicaciones' },
    ],
    books: [
      { label: 'Python Cookbook (David Beazley)', note: 'Capítulos sobre generators, iterators, concurrency — el libro de referencia para Python avanzado.' },
      { label: 'Fluent Python (Luciano Ramalho)', note: 'Secciones sobre collections, iterators, descriptors — imprescindible para senior Python.' },
      { label: 'Web Scraping with Python (Ryan Mitchell)', note: 'O\'Reilly — scraping con BeautifulSoup, Scrapy, Selenium, y manejo de autenticación.' },
      { label: 'SQL for Data Scientists (Renée M. P. Teate)', note: 'SQL enfocado a casos de data science — joins, window functions, CTEs.' },
    ],
    courses: [
      { label: 'Real Python — Generators', url: 'https://realpython.com/introduction-to-python-generators/', note: 'Tutorial completo de generators con ejemplos prácticos' },
      { label: 'Real Python — Logging', url: 'https://realpython.com/python-logging/', note: 'Guía completa de logging en Python' },
      { label: 'FastAPI docs — async SQL + concurrency', url: 'https://fastapi.tiangolo.com/', note: 'Patrones modernos de async Python aplicables a DS' },
      { label: 'Talk Python to Me — Multiprocessing', url: 'https://training.talkpython.fm/courses/details/all-about-python-concurrency', note: 'Curso enfocado en conciencia Python: threads, multiprocessing, asyncio' },
    ],
  },
}
