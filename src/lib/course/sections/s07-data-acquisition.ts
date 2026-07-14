import type { CourseSection } from '../../types'

export const section07: CourseSection = {
  id: 'data-acquisition',
  index: 7,
  title: 'Adquisición de Datos para Data Science',
  shortTitle: 'Adquisición de Datos',
  tagline:
    'Scraping, regex, SQL, APIs y generators — tu toolkit para conseguir datos del mundo real',
  estimatedHours: 14,
  level: 'Intermedio',
  icon: 'Download',
  accentColor: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  jobRelevance:
    'En cualquier trabajo serio de data en Perú — Interbank, BBVA, Mercado Libre, Rimac, Falabella — NUNCA te entregan un CSV limpio. Te dicen "consigue los precios de la competencia en Mercado Libre", "conéctate a la API interna de transacciones", "saca el reporte de la base SQL de créditos", o "limpia estos 50 mil textos libres que mandaron los clientes por WhatsApp". Esta sección cubre EXACTAMENTE esos 5 escenarios: web scraping, consumo de APIs REST, conexión a SQL, expresiones regulares para limpiar texto, generators para no morir con datasets gigantes, y `collections` para escribir código Python idiomático. Quien domina adquisición de datos cobra 30-40% más que un junior que solo sabe `pd.read_csv()`, porque puede llevar un proyecto desde "no tengo los datos" hasta "DataFrame listo para modelar" sin pedirle ayuda a nadie más. Es la skill #1 que separa un Data Analyst Junior de uno Senior.',
  learningOutcomes: [
    { text: 'Construir generators con `yield` para procesar CSVs gigantes sin agotar RAM' },
    { text: 'Scrapear sitios con requests + BeautifulSoup y automatizar con Selenium cuando hay JS' },
    { text: 'Consumir REST APIs con requests, manejar JSON y paginación automática' },
    { text: 'Conectar Python a SQL con sqlite3, SQLAlchemy y pd.read_sql para traer datos a pandas' },
    { text: 'Limpiar texto y parsear logs con expresiones regulares (re) — DNIs, teléfonos y emails peruanos' },
    { text: 'Usar collections (Counter, defaultdict, namedtuple, deque) en tu Python diario' },
  ],
  theory: [
    {
      heading: 'Iterators & Generators — `yield` para CSVs gigantes',
      paragraphs: [
        'Un iterador es cualquier objeto que implementa `__next__` y devuelve un valor a la vez. Las listas, tuplas, dicts y strings son iterables (puedes iterarlos con `for`) pero no iteradores. Cuando haces `iter(mi_lista)` obtienes un iterador. La diferencia clave es esta: una lista carga TODOS sus elementos en RAM, mientras que un iterador solo calcula el siguiente elemento cuando se le pide. Esto es crucial para data science: si un CSV tiene 50 millones de filas y pesa 8 GB, no puedes cargarlo en una lista — tu laptop muere con OOM (Out Of Memory). Necesitas un iterador que lea línea por línea y procese cada una sin mantener el archivo entero en memoria. En Mercado Libre procesan logs de navegación así: TB por día, sin morir, gracias a generators.',
        'Un generator es la forma más fácil de crear un iterador: una función que usa `yield` en vez de `return`. Cuando llamas a una función con `yield`, Python NO ejecuta la función: devuelve un objeto generator. Cada vez que llamas `next()` sobre ese generator, la función corre hasta el próximo `yield` y pausa su estado local. La próxima llamada continúa exactamente desde donde quedó. Esto se llama "lazy evaluation" — los valores se calculan solo cuando se necesitan. Para CSVs enormes, esto significa que puedes procesar 50 millones de filas con 50 MB de RAM, no 8 GB. Es la diferencia entre "funciona" y "se cae por OOM en producción a las 3am".',
        'En pandas, `pd.read_csv(path, chunksize=10000)` te devuelve un iterador de DataFrames de 10k filas cada uno. Procesas cada chunk, agregas resultados, y nunca tienes el archivo entero en RAM. Combinado con generators propios para filtrar o transformar, puedes construir pipelines que escalan a datasets de cualquier tamaño. Esto es exactamente lo que hacen los data engineers en Mercado Libre cuando procesan logs de navegación (TB por día): no cargan todo, lo streaméan. Si aprendes una sola cosa de esta sección, que sea generators — paga dividendos en cada proyecto y te hace ver como alguien que entiende de performance, no como un junior que escribe `list(csv.reader(f))` y espera que no se caiga.',
      ],
      code: {
        language: 'python',
        title: 'generadores_csv.py',
        code: `# === Generador que lee un CSV enorme línea por línea ===
import csv
from pathlib import Path

def leer_ventas_lento(path: str):
    """Sin generador: carga TODO en RAM. Malo para CSVs de 8GB."""
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
    """Agrega ventas por región sin cargar todo el CSV en RAM."""
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
        title: 'Cuándo usar generators',
        content:
          'Usa generators cuando: (1) el dataset es >1GB, (2) solo necesitas procesar cada item una vez (no acceso aleatorio por índice), (3) estás construyendo un pipeline de streaming. NO uses generators cuando necesitas acceso aleatorio (mi_lista[1000]), o cuando el dataset es chico (<100MB) y la simplicidad de una lista vale más que los 50 MB de RAM extra.',
      },
    },
    {
      heading: 'Web Scraping — requests + BeautifulSoup + Selenium',
      paragraphs: [
        'En la vida real como Data Scientist en Perú, rara vez te dan un CSV listo. Lo más común es que te digan "necesitamos monitorear precios de la competencia en Mercado Libre, Falabella y Ripley", o "scrapea los avisos de trabajo de Computrabajo para construir un índice de salarios". Para eso necesitas web scraping: descargar HTML de una página web y extraer datos estructurados. El stack básico es `requests` (descargar HTML) + `BeautifulSoup` (parsear HTML y extraer elementos con selectores CSS). Instalas con `pip install requests beautifulsoup4`. El flujo: haces `requests.get(url)`, pasas `response.text` a `BeautifulSoup(html, "html.parser")`, y luego buscas elementos con `soup.select(".precio")` o `soup.find_all("div", class_="producto")`.',
        'El scraping simple con requests+BS4 funciona cuando el HTML viene completo desde el servidor (páginas estáticas). Pero el 70% de sitios modernos cargan datos con JavaScript después de la página inicial (SPAs, React, Vue). Si haces `requests.get()` a Mercado Libre o a la web del MIMP para ver un padrón, ves un HTML vacío con un `<div id="root"></div>` y los datos NO están — los carga JS. Para estos casos necesitas Selenium (o Playwright, que verás en la sección de RPA): un browser real automatizado que ejecuta el JS, espera a que cargue, y te da acceso al DOM final. Selenium es más lento (10-30s por página vs 0.5s con requests) pero es la única opción cuando la página depende de JS pesado.',
        'Reglas de oro del scraping — son NO negociables: (1) SIEMPRE respeta `robots.txt` del sitio (`/robots.txt` te dice qué paths permiten scrapear), (2) pon un `time.sleep(1-2)` entre requests para no saturar el servidor (es un DoS no intencional si no lo haces, y pueden bloquear tu IP), (3) usa headers de navegador real (`User-Agent: Mozilla/...`) porque muchos sitios bloquean `python-requests/2.x` automáticamente, (4) cachea respuestas a disco durante desarrollo para no re-scrapear 100 veces mientras debuggeas, (5) maneja fallos con try/except y reintentos porque las redes fallan. Para scraping a escala (>10k páginas), considera Scrapy (framework completo) o Playwright (alternativa moderna a Selenium que verás en S13).',
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

def scrapear_productos_estaticos(url: str) -> list[dict]:
    """Scrapea productos de una página HTML estática (ej: lista de productos)."""
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()  # lanza excepción si status != 200
    soup = BeautifulSoup(resp.text, "html.parser")

    productos = []
    # Selectores dependen del sitio — inspecciona con DevTools (F12)
    for card in soup.select("[data-pod]"):
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

    # Esperar a que carguen los precios (hasta 10s)
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, ".ui-search-item__group")
        )
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

# === Scraping responsable con rate limiting y cache a disco ===
def scrapear_con_cache(urls: list[str], cache_dir: Path = Path(".cache")) -> list[str]:
    """Cachea HTML en disco para no re-scrapear durante desarrollo."""
    cache_dir.mkdir(exist_ok=True)
    titulos = []
    for url in urls:
        cache_file = cache_dir / (url.split("/")[-1] + ".html")
        if cache_file.exists():
            html = cache_file.read_text(encoding="utf-8")
        else:
            time.sleep(2)  # ¡respeta al servidor! 2s entre requests
            html = requests.get(url, headers=HEADERS, timeout=10).text
            cache_file.write_text(html, encoding="utf-8")
        soup = BeautifulSoup(html, "html.parser")
        titulos.append(soup.title.string if soup.title else "sin titulo")
    return titulos

# Uso (ejemplo con URLs de demo — no scrapear producción sin permiso)
# datos = scrapear_productos_estaticos("https://tienda.example.com/productos")
# print(f"Encontré {len(datos)} productos")
# print(datos[:3])`,
      },
      callout: {
        type: 'warning',
        title: 'Legalidad y ética del scraping en Perú',
        content:
          'Scrapear datos públicos es legal en la mayoría de jurisdicciones (incluyendo Perú), pero: (1) NO scrapees datos personales sin consentimiento — la Ley 29733 de Protección de Datos Personales te puede multar, (2) NO satures el servidor (es un ataque DoS y es delito), (3) revisa los Términos de Servicio del sitio — algunos lo prohíben explícitamente y pueden demandarte, (4) SIEMPRE pon un User-Agent identificable con contacto. Cuando dudes, pregúntale al sitio o busca si tienen API oficial (siguiente bloque) — casi siempre es la opción mejor, más estable y más rápida.',
      },
    },
    {
      heading: 'REST APIs — requests + JSON + paginación',
      paragraphs: [
        'Una API REST es la forma profesional de consumir datos de un servicio. En vez de scrapear HTML (frágil, a veces ilegal, lento, se rompe cuando el sitio cambia de diseño), la API te devuelve datos estructurados en JSON. En Perú, la SUNAT tiene APIs para tipo de cambio, el INEI para estadísticas, el MTC para vehículos, OSINERGMIN para precios de combustibles. Bancos como Interbank y BCP exponen APIs internas para sus equipos de data. Mercado Libre, OpenStreetMap, GitHub, Twitter, Spotify — todos tienen APIs públicas. Como Data Scientist, saber consumir APIs es OBLIGATORIO: es cómo obtienes datos frescos sin descargar CSVs manualmente cada semana, y es cómo alimentas pipelines que corren automáticamente cada noche.',
        'El flujo básico con `requests`: `resp = requests.get(url, params={"key": "value"}, headers={"Authorization": "Bearer TOKEN"})`. La respuesta tiene `resp.status_code` (200=ok, 404=not found, 401=unauthorized, 429=rate limited, 500=server error), `resp.json()` para parsear el body como JSON, y `resp.headers` para metadata. Para APIs que requieren auth, dos patrones comunes: (1) API key en header (`headers={"X-API-Key": "abc123"}`), (2) OAuth2 bearer token (`headers={"Authorization": "Bearer eyJhb..."}`). Guarda tus tokens en variables de entorno (`os.environ["API_KEY"]` con `python-dotenv`), NUNCA en el código — si los commiteas a GitHub, los bots los encuentran en 5 minutos y los usan para fraude.',
        'Casi toda API devuelve datos paginados: en vez de mandarte 100,000 registros de golpe (mataría su servidor), te manda 50 o 100 por página, junto con un cursor o URL de la siguiente página. Sin paginar, solo ves los primeros 50 resultados y te pierdes el resto. Los patrones comunes: (1) `?page=2&per_page=100` (offset/page style, tipo GitHub), (2) `?cursor=abc123` (cursor opaco, tipo Twitter), (3) link en `response["next"]` (URL completa, tipo Django REST). Tu código debe loop hasta que no haya más páginas, acumulando resultados. Caso real: traer 10,000 productos de una API a 100 por página = 100 requests, ~2 minutos con rate limiting. Siempre maneja errores (429 con backoff exponencial, 5xx con retry) — las APIs fallan constantemente, especialmente las peruanas.',
      ],
      code: {
        language: 'python',
        title: 'api_consumption.py',
        code: `import requests
import os
import time
from typing import Iterator

# Cargar API key desde variable de entorno (NUNCA hardcodear)
API_KEY = os.environ.get("MI_API_KEY", "demo")

def get_tipo_cambio_sunat(fecha: str = "2024-01-15") -> dict:
    """Tipo de cambio SUNAT (ejemplo simplificado)."""
    url = f"https://api.sunat.gob/tipo-cambio/{fecha}"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()  # lanza excepción si no es 200
    return resp.json()
# {"fecha": "2024-01-15", "compra": 3.745, "venta": 3.755}

# === Paginación: traer TODOS los productos de la API ===
def traer_todos_productos(api_base: str) -> list[dict]:
    """Loop de paginación hasta que no haya más páginas."""
    todos = []
    url = f"{api_base}/products"
    while url:
        resp = requests.get(url, headers={"X-API-Key": API_KEY}, timeout=15)
        if resp.status_code == 429:
            # Rate limited: leer Retry-After y esperar
            wait = int(resp.headers.get("Retry-After", 60))
            print(f"Rate limited, esperando {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        todos.extend(data["results"])  # productos de esta página
        url = data.get("next")  # URL de la siguiente página, o None si es la última
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
            yield producto  # uno a la vez, sin acumular en RAM
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

# === Retry con backoff exponencial — las APIs peruanas fallan mucho ===
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
            resp.raise_for_status()  # 4xx: no reintentar, lanzar
        except requests.RequestException as e:
            print(f"Intento {intento+1} falló: {e}")
            time.sleep(2 ** intento)
    raise RuntimeError(f"Fallo después de {max_retries} intentos")

# === Bonus: requests.Session para múltiples requests al mismo host ===
def scrapear_muchas_urls(urls: list[str]) -> list[int]:
    """Session reutiliza la conexión TCP — 3-5x más rápido que get() sueltos."""
    session = requests.Session()
    session.headers.update({"User-Agent": "ds-bot/1.0"})
    codigos = []
    for url in urls:
        resp = session.get(url, timeout=10)
        codigos.append(resp.status_code)
    return codigos`,
      },
      callout: {
        type: 'info',
        title: 'requests.Session para múltiples requests',
        content:
          'Si haces 100 requests al mismo host, crea `s = requests.Session()` y usa `s.get()`. La sesión reutiliza la conexión TCP (keep-alive), lo que es 3-5x más rápido. También persiste cookies y headers default. Para scraping intensivo o polling de API, SIEMPRE usa Session — es la diferencia entre 30 segundos y 2 minutos para scrapear 500 URLs.',
      },
    },
    {
      heading: 'SQL Databases — sqlite3, SQLAlchemy y pd.read_sql',
      paragraphs: [
        'En cualquier trabajo serio de data, los datos NO están en CSVs — están en bases de datos SQL. PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery, Oracle. Aprender SQL es OBLIGATORIO para DS (la mayoría de entrevistas técnicas incluyen SQL, y un mal SQL te descalifica aunque tengas un PhD en ML). En Python, el puente entre SQL y tu análisis es la librería `sqlite3` (built-in, para SQLite local), `SQLAlchemy` (ORM/abstracción para cualquier motor), y `pd.read_sql()` (trae datos directamente a un DataFrame). SQLite es perfecta para prototipos: es un archivo `.db` que funciona sin servidor, viene con Python, y soporta el 90% del SQL estándar. Para producción migras a PostgreSQL cambiando una sola línea de conexión.',
        'El flujo básico con sqlite3: `conn = sqlite3.connect("mi_base.db")`, `cursor = conn.cursor()`, `cursor.execute("SELECT * FROM clientes WHERE region=?", ("Lima",))`, `filas = cursor.fetchall()`. NUNCA uses f-strings para insertar valores en SQL — es vulnerable a SQL injection y te pueden borrartablas. SIEMPRE usa parámetros (`?` en sqlite3, `%s` en PostgreSQL). Para pandas, el atajo mágico es `df = pd.read_sql("SELECT * FROM ventas WHERE monto > 1000", conn)` — directo a DataFrame sin loop manual. Y al revés: `df.to_sql("ventas_nuevas", conn, if_exists="append", index=False)` persiste un DataFrame a una tabla SQL. Esto es oro para pipelines ETL donde descargas de una API, limpias con pandas, y persistes a SQL para reporting.',
        'SQLAlchemy agrega una capa de abstracción: defines modelos como clases Python, y SQLAlchemy genera el SQL. Útil cuando tu app crece y quieres cambiar de SQLite a PostgreSQL sin reescribir queries. El patrón `create_engine("sqlite:///mi_base.db")` crea un engine que pasas a `pd.read_sql(query, engine)`. Para DS, el 80% del tiempo solo necesitas sqlite3 + pd.read_sql. SQLAlchemy lo aprendes cuando te toca mantener una app más grande o cuando en producción usas PostgreSQL y quieres migrar sin dolor. Lo importante: practica escribir queries SQL reales (JOINs, GROUP BY, window functions, CTEs) — es la skill #1 que evalúan en entrevistas de Data Analyst en Interbank, BBVA y Mercado Libre.',
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

# Insertar con parámetros (NUNCA f-strings — previene SQL injection)
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

# Y al revés: persistir un DataFrame a SQL
df_nuevo = pd.DataFrame({
    "producto": ["Monitor"],
    "monto": [850.0],
    "region": ["Cusco"],
    "fecha": ["2024-01-17"],
})
df_nuevo.to_sql("ventas", conn, if_exists="append", index=False)

# === 3. SQLAlchemy para producción (cambia a postgresql:// en prod) ===
engine = create_engine("sqlite:///ventas.db")

df_grande = pd.read_sql("""
    SELECT region, COUNT(*) as n_ventas, AVG(monto) as ticket_promedio
    FROM ventas
    GROUP BY region
    HAVING COUNT(*) > 0
    ORDER BY n_ventas DESC
""", engine)
print(df_grande)

# === 4. SQLAlchemy ORM (modelos como clases — útil en apps más grandes) ===
Base = declarative_base()

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    dni = Column(String, unique=True)  # DNI peruano: 8 dígitos
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
          'NUNCA hagas `cursor.execute(f"SELECT * FROM users WHERE name = \'{name}\'")`. Si `name` viene del usuario y contiene `\' OR 1=1 --`, el atacante lee TODA la tabla. Si contiene `;\'; DROP TABLE users; --`, te la borran. SIEMPRE usa parámetros: `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`. Es la diferencia entre código production-ready y un CVE esperando pasar. En 2023, SQL injection seguía siendo el #1 ataque web según OWASP.',
      },
    },
    {
      heading: 'Regular Expressions — limpieza de texto y parsing de logs',
      paragraphs: [
        'Las expresiones regulares (regex) son un mini-lenguaje para buscar patrones en texto. En data science las usas TODO el tiempo: extraer DNI de strings (`\\b\\d{8}\\b`), validar emails (`^[\\w.-]+@[\\w.-]+\\.\\w+$`), limpiar números de teléfono peruanos (`(?:\\+51)?\\s*9?\\d{8}`), parsear logs de servidor Apache (`^(\\S+) \\S+ \\S+ \\[([^\\]]+)\\] "(\\w+) (\\S+)"`), extraer hashtags de tweets, normalizar fechas en distintos formatos, encontrar RUCs (`\\b\\d{11}\\b`), separar nombres compuestos. Sin regex, terminas escribiendo 50 líneas de `str.split()` y `str.startswith()` para algo que regex resuelve en una línea. Vale la pena aprenderlas bien — es una skill transferible a cualquier lenguaje (SQL, JS, Java, bash, grep) y uno de los superpoderes que diferencia juniors de seniors.',
        'El módulo en Python es `re`. Las funciones clave: `re.search(patron, texto)` (encuentra el primer match en cualquier posición del texto), `re.match(patron, texto)` (match solo al inicio del string), `re.findall(patron, texto)` (todos los matches como lista de strings), `re.finditer` (iterador de Match objects con metadata), `re.sub(patron, reemplazo, texto)` (buscar y reemplazar), `re.split(patron, texto)` (split por patrón). Compila patrones reusados con `re.compile()` para mejor performance. Los caracteres especiales clave: `.` (cualquier char), `\\d` (dígito), `\\w` (word char: letra, dígito o _), `\\s` (espacio), `+` (1 o más), `*` (0 o más), `?` (0 o 1), `{n,m}` (entre n y m), `[]` (conjunto), `()` (grupo capturable), `|` (o).',
        'Para NLP en español, regex es esencial en el preprocesamiento: (1) quitar acentos para normalización (`unicodedata.normalize("NFD", texto).encode("ascii", "ignore").decode()` — convierte "María" a "Maria"), (2) remover URLs (`https?://\\S+`), (3) remover menciones de Twitter (`@\\w+`), (4) tokenización simple (`re.findall(r"\\w+", texto)`), (5) extraer emojis (regex compleja pero existe). Caso de uso real peruano: parsear los "comprobantes electrónicos" de SUNAT (XML/CDR) para extraer RUC emisor, RUC receptor, monto total, IGV (18%), fecha de emisión — y convertirlos en un DataFrame para conciliación contable. Esto se hace miles de veces al día en equipos de contabilidad y finanzas de empresas peruanas medianas y grandes.',
      ],
      code: {
        language: 'python',
        title: 'regex_ejemplos.py',
        code: `import re
import pandas as pd

# === 1. Extraer DNIs peruanos (8 dígitos con word boundaries) ===
texto = "Contactos: Maria 12345678, Juan 87654321, sin dni 12345, RUC 20512345678"
dnis = re.findall(r"\\b\\d{8}\\b", texto)
print(dnis)  # ['12345678', '87654321']  (no confunde con RUC de 11 dígitos)

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
        digitos = digitos[2:]  # quitar prefijo país Perú
    return digitos[-9:] if len(digitos) >= 9 else digitos

print(normalizar_telefono("+51 987 654 321"))  # 987654321
print(normalizar_telefono("987-654-321"))      # 987654321
print(normalizar_telefono("51-1-234-5678"))    # 12345678 (fijo Lima)

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
        "RT @juan: mira esto https://t.co/xyz #DataScience",
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
#  'RT : mira esto  DataScience',
#  'Sin menciones ni URLs, solo texto plano']

# === 6. Extraer RUCs peruanos (11 dígitos) de un texto ===
ruc_texto = "RUCs: 20512345678 (empresa A), 20123456789 (empresa B), DNI 12345678"
rucs = re.findall(r"\\b(\\d{11})\\b", ruc_texto)
print(rucs)  # ['20512345678', '20123456789']

# === 7. Extraer fechas en múltiples formatos ===
fechas = "Reunión 15/01/2024, entrega 2024-02-28, cierre 28.02.24"
patron_fecha = re.compile(r"\\b(\\d{1,2})[/.-](\\d{1,2})[/.-](\\d{2,4})\\b")
for dia, mes, anio in patron_fecha.findall(fechas):
    anio = anio if len(anio) == 4 else "20" + anio
    print(f"{anio}-{int(mes):02d}-{int(dia):02d}")
# 2024-01-15
# 2024-02-28
# 2024-02-28`,
      },
      callout: {
        type: 'warning',
        title: 'Catastrophic backtracking',
        content:
          'Evita patrones como `(a+)+b` contra strings largos sin "b" al final — causan backtracking exponencial y pueden colgar tu script por horas. Si una regex tarda mucho, simplifícala o usa `re.compile(patron, re.IGNORECASE)` (más rápido). Testea regex SIEMPRE con regex101.com antes de ponerlas en producción — ahí ves el match visualmente y detectas bugs que en código tardarías horas.',
      },
    },
    {
      heading: 'collections — Counter, defaultdict, namedtuple, deque',
      paragraphs: [
        'El módulo `collections` (built-in, sin pip install) tiene 4 herramientas que TODO Data Scientist debería usar a diario. (1) `Counter`: diccionario especializado para contar. `Counter([1,1,2,3,3,3])` devuelve `Counter({3: 3, 1: 2, 2: 1})`. Tiene `.most_common(n)` para top-N, lo que reemplaza 5 líneas de `dict.get(k, 0) + 1` y un `sorted(..., key=lambda x: x[1], reverse=True)[:n]` por una sola llamada. (2) `defaultdict`: diccionario con valor default automático. `defaultdict(list)` crea una lista vacía si la key no existe — perfecto para agrupar. Reemplaza el patrón feo `if k not in d: d[k] = []; d[k].append(v)` por `d[k].append(v)` directo, que es mucho más legible.',
        '(3) `namedtuple`: tuplas con nombres de campo. `Cliente = namedtuple("Cliente", ["nombre", "dni", "edad"])` te permite hacer `c = Cliente("María", "12345678", 30)` y acceder `c.nombre` en vez de `c[0]`. Más legible que tuplas planas, más liviano que clases (no tiene __dict__). Útil para retornar múltiples valores de una función con claridad. (4) `deque` (double-ended queue): lista optimizada para agregar/quitar por ambos extremos en O(1). Las listas normales son O(n) para `insert(0, x)` o `pop(0)` porque tienen que mover todos los elementos. Para colas, buffers, sliding windows, deque es la opción correcta — para 1000 elementos la diferencia es microsegundos, pero para 100k elementos es segundos vs. milisegundos.',
        'En DS real, `Counter` lo usas para histogramas de variables categóricas, top-N productos más vendidos, frecuencia de palabras en NLP (antes de pasar a NLTK/spaCy). `defaultdict(list)` para groupby manual antes de pasar a pandas (`defaultdict(list); for row in data: groups[row["region"]].append(row["monto"])`). `namedtuple` para estructuras de configuración inmutables o retornos de funciones que devuelven varios resultados con nombres claros. `deque` para mantener una ventana deslizante de los últimos N eventos en streaming (ej: últimos 1000 logs para detectar anomalías, o últimos 100 precios para calcular moving average en tiempo real). Conocer estas 4 herramientas te hace escribir código 2x más limpio y pythonic que si solo usas list y dict básicos — y se nota en code reviews.',
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

# Contar palabras en un texto (mini NLP — antes de spaCy)
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

# Sin defaultdict (verboso y feo):
grupos_viejo = {}
for t in transacciones:
    if t["cliente"] not in grupos_viejo:
        grupos_viejo[t["cliente"]] = []
    grupos_viejo[t["cliente"]].append(t["monto"])

# Con defaultdict (limpio y pythonic):
grupos = defaultdict(list)
for t in transacciones:
    grupos[t["cliente"]].append(t["monto"])  # sin if/else

# Calcular gasto total por cliente
gasto = {cliente: sum(montos) for cliente, montos in grupos.items()}
print(gasto)  # {'Maria': 300, 'Juan': 80, 'Pedro': 75}

# defaultdict(int) para contar (alternativa simple a Counter)
conteo = defaultdict(int)
for t in transacciones:
    conteo[t["cliente"]] += 1
print(dict(conteo))  # {'Maria': 2, 'Juan': 2, 'Pedro': 1}

# === 3. namedtuple: tuplas con nombres (más legibles que tuplas planas) ===
Cliente = namedtuple("Cliente", ["nombre", "dni", "edad", "ingreso"])

def buscar_cliente(cliente_id: int) -> Cliente:
    # en la vida real, query a DB
    return Cliente("María Quispe", "12345678", 32, 4500.0)

c = buscar_cliente(1)
print(c.nombre)   # María Quispe  (en vez de c[0] — mucho más legible)
print(c.edad)     # 32
print(c.ingreso)  # 4500.0
nombre, dni, edad, ingreso = c  # sigue siendo desempaquetable como tupla normal

# === 4. deque: colas eficientes (O(1) en ambos extremos) ===
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
    lista.insert(0, -1)  # O(n) — mueve todos los elementos
print(f"list.insert(0, x) x1000: {time.time() - start:.3f}s")  # ~0.5s (lento)

start = time.time()
for _ in range(1000):
    dq.appendleft(-1)  # O(1) — solo actualiza punteros
print(f"deque.appendleft x1000: {time.time() - start:.3f}s")  # ~0.0001s (10000x más rápido)`,
      },
      callout: {
        type: 'tip',
        title: 'dataclasses: la evolución moderna de namedtuple',
        content:
          'Para estructuras más complejas (con métodos, validación, mutabilidad, type hints completos), usa `@dataclass` (Python 3.7+). Es como namedtuple pero con valores default, métodos, herencia, y validación. Para datos inmutables simples (3-5 campos), namedtuple sigue siendo más liviano. Para DTOs, configuraciones, modelos de negocio, prefiere dataclass.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos 3 pipelines pequeños que cubren los 3 escenarios más comunes de adquisición de datos: (1) consumir una API REST paginada y llevar el resultado a un DataFrame, (2) scrapear una tabla HTML y convertirla en DataFrame, (3) consultar una base SQL y traer el resultado a pandas. Estos 3 patrones son el 80% del trabajo de adquisición en cualquier proyecto real.',
    steps: [
      {
        description: 'API REST paginada → DataFrame con pd.json_normalize',
        code: {
          language: 'python',
          title: 'api_a_dataframe.py',
          code: `import requests
import pandas as pd
import time
from typing import Iterator

def iterar_productos(api_base: str, max_pages: int = 50) -> Iterator[dict]:
    """Generador: trae productos página por página de una API REST paginada."""
    url = f"{api_base}/products"
    page = 0
    while url and page < max_pages:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 429:
            wait = int(resp.headers.get("Retry-After", 60))
            print(f"Rate limited, esperando {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        for producto in data["results"]:
            yield producto
        url = data.get("next")  # URL de la siguiente página, o None
        page += 1
        print(f"Página {page}: +{len(data['results'])} productos")

def api_a_dataframe(api_base: str, max_pages: int = 20) -> pd.DataFrame:
    """Consume API paginada y devuelve DataFrame listo para análisis."""
    productos = list(iterar_productos(api_base, max_pages=max_pages))
    print(f"Total descargado: {len(productos)} productos")

    # pd.json_normalize aplana JSON anidado (ej: {"vendedor": {"nombre": "..."}})
    df = pd.json_normalize(productos)
    print(f"DataFrame shape: {df.shape}")
    print(f"Columnas: {df.columns.tolist()}")
    return df

# Ejecutar
df = api_a_dataframe("https://api.ejemplo.com", max_pages=10)

# Limpieza típica post-API
if "precio" in df.columns:
    df["precio"] = pd.to_numeric(df["precio"], errors="coerce")
    df = df.dropna(subset=["precio"])
    print(f"Después de limpiar precio: {len(df)} filas válidas")
    print(df[["nombre", "precio"]].head())
#    nombre  precio
# 0  Mouse   45.0
# 1  Teclado 120.0
# ...`,
        },
        why: 'Este patrón (API paginada → generador → list → pd.json_normalize → limpieza) es el 80% del trabajo de adquisición vía API. El generador evita cargar todo en RAM durante la descarga, json_normalize aplana estructuras anidadas, y pd.to_numeric con errors="coerce" convierte strings a números sin morir si hay datos sucios.',
      },
      {
        description: 'Scraping de tabla HTML → DataFrame con pd.read_html',
        code: {
          language: 'python',
          title: 'scraping_a_dataframe.py',
          code: `import requests
import pandas as pd
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; ds-bot/1.0)"}

def scrapear_tabla_html(url: str, tabla_index: int = 0) -> pd.DataFrame:
    """Scrapea la N-ésima tabla HTML de una página y la devuelve como DataFrame."""
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()

    # pd.read_html parsea TODAS las tablas <table> del HTML automáticamente
    # ¡es magia! devuelve una lista de DataFrames, uno por tabla encontrada
    tablas = pd.read_html(resp.text)
    print(f"Encontré {len(tablas)} tablas en la página")

    if tabla_index >= len(tablas):
        raise ValueError(f"Solo hay {len(tablas)} tablas, pediste índice {tabla_index}")

    df = tablas[tabla_index]
    print(f"Tabla {tabla_index}: {df.shape[0]} filas, {df.shape[1]} columnas")
    print(f"Columnas: {df.columns.tolist()}")
    return df

# Ejemplo realista: scrapear tabla de tipo de cambio de una web financiera
url = "https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambiopromedio.aspx"
try:
    df_tc = scrapear_tabla_html(url, tabla_index=0)
    # Limpieza típica: renombrar columnas, parsear fechas, limpiar números
    print(df_tc.head())
except Exception as e:
    print(f"No se pudo scrapear (la web puede estar caída): {e}")
    # Fallback: usar un HTML de ejemplo local para no romper la demo
    html_ejemplo = """
    <table>
      <tr><th>Fecha</th><th>Compra</th><th>Venta</th></tr>
      <tr><td>2024-01-15</td><td>3.745</td><td>3.755</td></tr>
      <tr><td>2024-01-16</td><td>3.750</td><td>3.760</td></tr>
    </table>
    """
    df_tc = pd.read_html(html_ejemplo)[0]
    print(df_tc)

# Limpieza: convertir strings a numéricos
for col in ["Compra", "Venta"]:
    if col in df_tc.columns:
        df_tc[col] = pd.to_numeric(df_tc[col], errors="coerce")

# Calcular spread (diferencia compra-venta)
if {"Compra", "Venta"}.issubset(df_tc.columns):
    df_tc["Spread"] = df_tc["Venta"] - df_tc["Compra"]
    print(df_tc)
#        Fecha  Compra  Venta  Spread
# 0  2024-01-15   3.745  3.755   0.010
# 1  2024-01-16   3.750  3.760   0.010`,
        },
        why: 'pd.read_html es uno de los superpoderes menos conocidos de pandas: si los datos están en una tabla HTML (páginas del gobierno, reportes web, Wikipedia), los extrae en una línea. Para tablas más complejas (necesitan click, JS, login), combinas BeautifulSoup manual + construcción del DataFrame.',
      },
      {
        description: 'SQL → DataFrame con pd.read_sql + SQLAlchemy engine',
        code: {
          language: 'python',
          title: 'sql_a_dataframe.py',
          code: `import sqlite3
import pandas as pd
from sqlalchemy import create_engine, text

# === 1. Crear una base SQLite de demostración con datos peruanos ===
def setup_db_demo(db_path: str = "ventas_peru.db"):
    """Crea una DB SQLite de ejemplo con ventas por región."""
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY,
            producto TEXT,
            monto REAL,
            region TEXT,
            fecha TEXT,
            canal TEXT
        )
    """)
    # Insertar datos de ejemplo (en la vida real vendrían de un ERP)
    import random
    random.seed(42)
    regiones = ["Lima", "Arequipa", "Cusco", "Trujillo", "Piura", "Chiclayo"]
    productos = ["Laptop", "Mouse", "Teclado", "Monitor", "Audifonos"]
    canales = ["Online", "Tienda", "Telefono"]
    filas = []
    for i in range(1000):
        filas.append((
            random.choice(productos),
            round(random.uniform(30, 3500), 2),
            random.choice(regiones),
            f"2024-0{random.randint(1,9)}-{random.randint(10,28):02d}",
            random.choice(canales),
        ))
    conn.executemany(
        "INSERT INTO ventas (producto, monto, region, fecha, canal) VALUES (?, ?, ?, ?, ?)",
        filas,
    )
    conn.commit()
    conn.close()
    print(f"DB demo creada: {db_path} con 1000 ventas")

setup_db_demo()

# === 2. Query directa con sqlite3 + pd.read_sql ===
conn = sqlite3.connect("ventas_peru.db")

# Query simple: total por región
df_region = pd.read_sql("""
    SELECT region, COUNT(*) as n_ventas, SUM(monto) as total, AVG(monto) as ticket_promedio
    FROM ventas
    GROUP BY region
    ORDER BY total DESC
""", conn)
print("Ventas por región:")
print(df_region)
#      region  n_ventas     total  ticket_promedio
# 0      Lima       180  295420.5          1641.2
# 1  Arequipa       165  268750.0          1628.8
# ...

# Query con JOIN (la típica consulta de reporting)
df_canal = pd.read_sql("""
    SELECT canal, producto, SUM(monto) as total
    FROM ventas
    WHERE fecha >= '2024-01-01'
    GROUP BY canal, producto
    PIVOT ...  -- SQLite no soporta PIVOT nativo, lo hacemos en pandas
""", conn) if False else pd.read_sql("""
    SELECT canal, producto, SUM(monto) as total
    FROM ventas
    GROUP BY canal, producto
    ORDER BY canal, total DESC
""", conn)
# Pivot en pandas (más flexible que SQL PIVOT)
pivot = df_canal.pivot_table(index="producto", columns="canal", values="total", fill_value=0)
print("Ventas por canal y producto:")
print(pivot)

conn.close()

# === 3. SQLAlchemy engine (migra a PostgreSQL cambiando una línea) ===
engine = create_engine("sqlite:///ventas_peru.db")
# En producción: create_engine("postgresql://user:pass@host:5432/db")

# Query con pandas y SQLAlchemy engine (recomendado en producción)
df_top = pd.read_sql(text("SELECT producto, SUM(monto) as total FROM ventas GROUP BY producto ORDER BY total DESC LIMIT 5"), engine)
print("Top 5 productos:")
print(df_top)

# Persistir un DataFrame de vuelta a SQL (pipeline ETL completo)
df_procesado = pd.read_sql("SELECT * FROM ventas", engine)
df_procesado["log_monto"] = np.log1p(df_procesado["monto"]) if (np := __import__('numpy')) is not None else None
df_procesado.to_sql("ventas_features", engine, if_exists="replace", index=False)
print("Tabla 'ventas_features' creada con", len(df_procesado), "filas")`,
        },
        why: 'Este patrón (SQL → pd.read_sql → limpieza con pandas → persistir de vuelta con to_sql) es el ciclo ETL básico. SQLAlchemy engine te permite migrar de SQLite (dev) a PostgreSQL (prod) cambiando una sola línea de conexión. Es lo que usan todos los pipelines de reporting en empresas peruanas.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca practicar los 3 patrones más importantes: escribir un generador que procesa un CSV grande, consumir una API con paginación, y construir una consulta SQL con pandas. Cada ejercicio tiene starter code y solution code — intenta resolverlo solo primero, no mires la solución hasta que tengas algo.',
    steps: [
      {
        instruction:
          'Escribe un generador `stream_csv` que lea un CSV grande fila por fila, filtre filas donde monto > 100, y yield diccionarios. Combínalo con un generador `batch` que agrupe de a N items.',
        hint: 'Usa `csv.DictReader` dentro del generador. Para batch, acumula en una lista y yield cuando llegues a N. Recuerda: yield pausa la función, no termina.',
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
            except (ValueError, TypeError):
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

# Test con un CSV de ejemplo generado al vuelo
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

print(f"\\nTotal filas con monto > 100: {total_procesado}")
# Salida esperada: 1000 filas, ~667 tienen monto > 100

os.unlink(path)`,
        },
      },
      {
        instruction:
          'Escribe una función `fetch_all_pages` que consuma una API REST con paginación tipo `?page=N` y devuelva una lista con TODOS los items. Maneja rate limiting (HTTP 429) con sleep y retry.',
        hint: 'Loop while True, params={"page": n}, si data["results"] vacío o no hay "next" → break. Si status 429, lee header "Retry-After" o espera 60s. Usa requests.Session() para reutilizar conexión.',
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
    session = requests.Session()  # reutilizar conexión TCP
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
                wait = 2 ** intento  # backoff exponencial: 1s, 2s, 4s
                print(f"Intento {intento+1} falló: {e}, reintentar en {wait}s")
                time.sleep(wait)
        else:
            raise RuntimeError(f"Fallo tras {max_retries} intentos en página {page}")

        data = resp.json()
        items = data.get("results", data.get("data", []))
        if not items:
            break  # no hay más — terminamos
        todos.extend(items)
        print(f"Página {page}: +{len(items)} (total: {len(todos)})")

        # Detectar fin: campo next en None, o página sin items
        if data.get("next") is None and page >= data.get("total_pages", page):
            break
        page += 1

    return todos

# Test con API pública de ejemplo (JSONPlaceholder — 100 posts)
if __name__ == "__main__":
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
          'Construye una función `ventas_por_region` que se conecte a una DB SQLite, ejecute una query SQL con parámetros, y devuelva un DataFrame con el total de ventas por región en un rango de fechas. Usa pd.read_sql con parámetros `?`.',
        hint: 'sqlite3.connect → pd.read_sql(query, conn, params=(start, end)) → conn.close. La query debe usar `BETWEEN ? AND ?` para filtrar fechas. GROUP BY region ORDER BY total DESC.',
        starterCode: {
          language: 'python',
          title: 'sql_query_starter.py',
          code: `import sqlite3
import pandas as pd

def ventas_por_region(db_path: str, fecha_inicio: str, fecha_fin: str) -> pd.DataFrame:
    """TODO: Devuelve DataFrame con total de ventas por región entre dos fechas."""
    pass

# Test:
# df = ventas_por_region("ventas.db", "2024-01-01", "2024-01-31")
# print(df)`,
        },
        solutionCode: {
          language: 'python',
          title: 'sql_query_solution.py',
          code: `import sqlite3
import pandas as pd
import tempfile, os

def ventas_por_region(db_path: str, fecha_inicio: str, fecha_fin: str) -> pd.DataFrame:
    """Devuelve DataFrame con total de ventas por región entre dos fechas.
    Usa parámetros SQL (?) para evitar SQL injection.
    """
    conn = sqlite3.connect(db_path)
    try:
        query = """
            SELECT
                region,
                COUNT(*) as n_ventas,
                SUM(monto) as total,
                AVG(monto) as ticket_promedio,
                MIN(monto) as minimo,
                MAX(monto) as maximo
            FROM ventas
            WHERE fecha BETWEEN ? AND ?
            GROUP BY region
            ORDER BY total DESC
        """
        # parámetros como tupla — SIEMPRE así, nunca f-strings
        df = pd.read_sql(query, conn, params=(fecha_inicio, fecha_fin))
    finally:
        conn.close()  # siempre cerrar, incluso si hay excepción
    return df

# === Demo: crear DB, insertar datos de ejemplo, consultar ===
def setup_demo():
    db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    db.close()
    conn = sqlite3.connect(db.name)
    conn.execute("""
        CREATE TABLE ventas (
            id INTEGER PRIMARY KEY,
            producto TEXT, monto REAL, region TEXT, fecha TEXT
        )
    """)
    ventas = [
        ("Laptop", 3500, "Lima", "2024-01-15"),
        ("Mouse", 45, "Arequipa", "2024-01-16"),
        ("Teclado", 120, "Lima", "2024-01-18"),
        ("Monitor", 850, "Cusco", "2024-02-05"),
        ("Audifonos", 220, "Lima", "2024-02-10"),
        ("Webcam", 180, "Trujillo", "2024-01-25"),
    ]
    conn.executemany(
        "INSERT INTO ventas (producto, monto, region, fecha) VALUES (?, ?, ?, ?)",
        ventas,
    )
    conn.commit()
    conn.close()
    return db.name

db_path = setup_demo()
df = ventas_por_region(db_path, "2024-01-01", "2024-01-31")
print("Ventas de enero 2024 por región:")
print(df)
#      region  n_ventas   total  ticket_promedio  minimo  maximo
# 0      Lima         2  3620.0            1810.0   120.0  3500.0
# 1  Arequipa         1    45.0              45.0    45.0    45.0
# 2  Trujillo         1   180.0             180.0   180.0   180.0

df_feb = ventas_por_region(db_path, "2024-02-01", "2024-02-28")
print("\\nVentas de febrero 2024 por región:")
print(df_feb)
#     region  n_ventas  total  ticket_promedio  minimo  maximo
# 0    Lima         1  220.0            220.0   220.0   220.0
# 1   Cusco         1  850.0            850.0   850.0   850.0

os.unlink(db_path)`,
        },
      },
    ],
  },
  youDo: {
    title: 'Capstone: Data Acquisition Pipeline — 3 fuentes unificadas en un solo DataFrame',
    context:
      'Construyes un pipeline llamado `data-acquisition-pipeline` que adquiere datos de 3 fuentes distintas y las unifica en un DataFrame único listo para análisis. Las 3 fuentes: (1) API REST paginada (puedes usar OpenFoodFacts, JSONPlaceholder, o cualquier API pública), (2) scraping de una tabla HTML (puedes usar Wikipedia o cualquier página con datos tabulados), (3) base de datos SQLite local (la creas con datos sintéticos peruanos). El pipeline debe limpiar cada fuente con regex (normalizar nombres, extraer/validar formatos), unificarlas en un schema común, y persistir el resultado a SQLite + parquet. Es lo que harías en tu primer sprint como Data Engineer Junior en una empresa peruana.',
    objectives: [
      'Consumir una API REST con paginación y manejo de errores (rate limit, retry, backoff)',
      'Scrapear una tabla HTML con requests + BeautifulSoup y convertirla a DataFrame',
      'Crear y consultar una base SQLite con sqlite3 + pd.read_sql usando parámetros seguros',
      'Limpiar campos con regex (normalizar strings, validar DNIs/emails/teléfonos peruanos)',
      'Unificar 3 DataFrames con schemas distintos en uno solo (pd.merge, concat, normalize)',
      'Persistir el resultado final a SQLite y parquet con logging de cada etapa',
    ],
    requirements: [
      'src/acquisition/api_source.py — función fetch_api_data(api_url, max_pages) -> list[dict]',
      'src/acquisition/scrape_source.py — función scrape_table(url, table_index) -> pd.DataFrame',
      'src/acquisition/sql_source.py — función setup_sql_demo() + query_sql(db_path) -> pd.DataFrame',
      'src/acquisition/clean.py — funciones con regex: normalize_phone(text), validate_dni(text), clean_string(text)',
      'src/acquisition/unify.py — función unify(df_api, df_scrape, df_sql) -> pd.DataFrame con schema común',
      'src/acquisition/pipeline.py — orquesta las 3 fuentes + limpieza + unificación + persistencia',
      'src/acquisition/cli.py — CLI con argparse: --api-url, --scrape-url, --db-path, --output, --verbose',
      'logs/ con logging configurado a archivo (rotación 5MB, 3 backups)',
      'tests/ con al menos 5 tests (test_clean.py con casos regex, test_unify.py)',
      'README.md con instrucciones de instalación, uso, y ejemplo de output',
    ],
    starterCode: `# pyproject.toml
[project]
name = "data-acquisition-pipeline"
version = "0.1.0"
dependencies = ["requests", "beautifulsoup4", "pandas", "lxml"]

[project.scripts]
acquire = "acquisition.cli:main"

# src/acquisition/pipeline.py
import logging
import pandas as pd
from pathlib import Path

logger = logging.getLogger(__name__)

def run_pipeline(api_url: str, scrape_url: str, db_path: Path, output: Path):
    """Orquesta las 3 fuentes → limpieza → unificación → persistencia."""
    logger.info("Etapa 1: Adquisición API")
    # TODO: from .api_source import fetch_api_data
    # TODO: df_api = pd.DataFrame(fetch_api_data(api_url))

    logger.info("Etapa 2: Scraping HTML")
    # TODO: from .scrape_source import scrape_table
    # TODO: df_scrape = scrape_table(scrape_url)

    logger.info("Etapa 3: Query SQL")
    # TODO: from .sql_source import query_sql
    # TODO: df_sql = query_sql(db_path)

    logger.info("Etapa 4: Limpieza con regex")
    # TODO: from .clean import normalize_phone, validate_dni, clean_string
    # TODO: aplicar a cada DataFrame

    logger.info("Etapa 5: Unificación")
    # TODO: from .unify import unify
    # TODO: df_final = unify(df_api, df_scrape, df_sql)

    logger.info("Etapa 6: Persistencia")
    # TODO: df_final.to_sql("unificado", engine, if_exists="replace")
    # TODO: df_final.to_parquet(output)
    logger.info("Pipeline completado: %d filas unificadas", len(df_final))

# src/acquisition/clean.py
import re
def normalize_phone(text: str) -> str:
    """Normaliza teléfonos peruanos a formato 9XXXXXXXX."""
    # TODO: regex (?:\\+51\\s?)?9?\\d{8}
    pass

def validate_dni(text: str) -> bool:
    """Valida que el texto contenga un DNI peruano (8 dígitos)."""
    # TODO: regex \\b\\d{8}\\b
    pass`,
    portfolioNote:
      'Este proyecto demuestra que dominas el 80% del trabajo de adquisición de datos: APIs, scraping, SQL y limpieza con regex — todo unificado en un DataFrame. En entrevistas, los hiring managers peruanos te preguntan "cuéntame de un proyecto donde conseguiste datos de múltiples fuentes". Tener este pipeline en tu GitHub, con logging, tests y README profesional, te diferencia de los candidatos que solo saben pd.read_csv(). Menciónalo en tu CV como "construí pipelines de adquisición de datos en Python (APIs REST, scraping, SQL) que unificaron múltiples fuentes en datasets analíticos".',
    rubric: [
      { criterion: 'Adquisición API con paginación + manejo de errores (retry, rate limit)', weight: '20%' },
      { criterion: 'Scraping HTML → DataFrame con BeautifulSoup o pd.read_html', weight: '15%' },
      { criterion: 'Query SQL con parámetros seguros (sin SQL injection)', weight: '15%' },
      { criterion: 'Limpieza con regex (DNIs, teléfonos, strings) con tests', weight: '15%' },
      { criterion: 'Unificación de 3 schemas distintos en uno común', weight: '15%' },
      { criterion: 'Persistencia dual: SQLite + parquet', weight: '10%' },
      { criterion: 'Logging estructurado a archivo con rotación', weight: '5%' },
      { criterion: 'CLI con argparse, --help claro, README con ejemplo', weight: '5%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué hace la palabra clave `yield` en una función de Python?',
        options: [
          'Lo mismo que return — termina la función y devuelve el valor',
          'Convierte la función en un generator que pausa su estado y resume en la próxima llamada a next()',
          'Lanza una excepción StopIteration inmediatamente',
          'Importa un módulo externo llamado "yield"',
        ],
        correctIndex: 1,
        explanation:
          'Una función con yield se convierte en un generator. Cada vez que se llama next(), la función corre hasta el próximo yield, devuelve el valor, y pausa su estado local. La próxima llamada continúa desde ahí. Esto permite lazy evaluation — clave para procesar datasets grandes sin agotar RAM.',
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
        question: '¿Cuál es la regla de oro del scraping responsable?',
        options: [
          'Hacer requests lo más rápido posible para terminar pronto',
          'Respetar robots.txt, poner time.sleep entre requests, y usar User-Agent real',
          'Nunca scrapear — siempre pedir API oficial',
          'Scrapear solo de noche para no saturar el servidor',
        ],
        correctIndex: 1,
        explanation:
          'Las 3 reglas de oro: respeta robots.txt (te dice qué puedes scrapear), pon time.sleep(1-2s) entre requests (no satures el servidor — es un DoS no intencional), y usa un User-Agent de navegador real (muchos sitios bloquean python-requests). Sin estas, te bloquean la IP o peor: pueden demandarte.',
      },
      {
        question: '¿Qué función del módulo `re` devuelve TODOS los matches de un patrón como lista?',
        options: [
          're.search(patron, texto)',
          're.match(patron, texto)',
          're.findall(patron, texto)',
          're.sub(patron, texto)',
        ],
        correctIndex: 2,
        explanation:
          're.findall devuelve todas las coincidencias del patrón en el texto como lista de strings. re.search devuelve solo la primera (como Match object o None). re.match busca solo al inicio del string. re.sub busca y reemplaza. Para extraer todos los DNIs de un texto, re.findall es lo correcto.',
      },
      {
        question: '¿Cuándo usarías `defaultdict(list)` en vez de un dict normal?',
        options: [
          'Cuando necesitas contar elementos (como Counter)',
          'Cuando necesitas agrupar valores por clave sin if/else para inicializar listas',
          'Cuando necesitas un dict ordenado por inserción',
          'Nunca — defaultdict es deprecated desde Python 3.10',
        ],
        correctIndex: 1,
        explanation:
          'defaultdict(list) crea una lista vacía automáticamente si la key no existe. Te permite escribir `d[k].append(v)` directamente sin el patrón feo `if k not in d: d[k] = []; d[k].append(v)`. Es ideal para agrupar transacciones por cliente, productos por categoría, eventos por día, etc.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — itertools & generators HOWTO', url: 'https://docs.python.org/3/howto/functional.html', note: 'HOWTO oficial sobre programación funcional con generators' },
      { label: 'requests — Quickstart', url: 'https://docs.python-requests.org/en/latest/user/quickstart/', note: 'Documentación oficial de requests — el cliente HTTP de facto en Python' },
      { label: 'BeautifulSoup — Docs', url: 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/', note: 'Parser HTML más usado en Python para scraping' },
      { label: 'SQLAlchemy — Tutorial 2.0', url: 'https://docs.sqlalchemy.org/en/20/tutorial/', note: 'Tutorial oficial de SQLAlchemy 2.0 con API moderna' },
      { label: 're — Regular Expressions', url: 'https://docs.python.org/3/library/re.html', note: 'Docs del módulo re de la stdlib' },
      { label: 'collections — Container datatypes', url: 'https://docs.python.org/3/library/collections.html', note: 'Counter, defaultdict, namedtuple, deque — built-in' },
      { label: 'pandas — IO tools (read_sql, read_html)', url: 'https://pandas.pydata.org/docs/user_guide/io.html', note: 'Cómo leer de SQL, HTML, JSON, parquet y más con pandas' },
      { label: 'regex101.com', url: 'https://regex101.com/', note: 'Probador interactivo de regex con explicaciones visuales — imprescindible' },
    ],
    books: [
      { label: 'Python Cookbook (David Beazley & Brian Jones)', note: 'Capítulos sobre generators, iterators, y manejo de datos — el libro de referencia para Python avanzado.' },
      { label: 'Fluent Python (Luciano Ramalho)', note: 'Secciones sobre collections, iterators, y data model — imprescindible para senior Python.' },
      { label: 'Web Scraping with Python (Ryan Mitchell, O\'Reilly)', note: 'Scraping con BeautifulSoup, Scrapy, Selenium, manejo de auth y formularios.' },
      { label: 'SQL for Data Scientists (Renée M. P. Teate)', note: 'SQL enfocado a casos de data science — joins, window functions, CTEs, optimización.' },
    ],
    courses: [
      { label: 'Real Python — Generators', url: 'https://realpython.com/introduction-to-python-generators/', note: 'Tutorial completo de generators con ejemplos prácticos' },
      { label: 'Real Python — Beautiful Soup: Build a Web Scraper', url: 'https://realpython.com/beautiful-soup-web-scraper-python/', note: 'Tutorial paso a paso de scraping con BeautifulSoup' },
      { label: 'Real Python — Working With APIs in Python', url: 'https://realpython.com/api-integration-in-python/', note: 'Cómo consumir APIs REST con requests' },
      { label: 'Kaggle Learn — Regular Expressions', url: 'https://www.kaggle.com/learn/regular-expressions', note: 'Curso corto y gratuito de regex aplicado a data science' },
    ],
  },
}
