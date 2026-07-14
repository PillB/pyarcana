import type { CourseSection } from '../../types'

export const section08: CourseSection = {
  id: 'pandas',
  index: 8,
  title: 'Pandas: Data Cleaning & EDA',
  shortTitle: 'Pandas & EDA',
  tagline: 'Tu herramienta principal diaria — groupby, merge, limpieza y EDA profesional',
  estimatedHours: 12,
  level: 'Intermedio',
  phase: 0,
  icon: 'Table2',
  accentColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
  jobRelevance:
    'Pandas es el 80% del día a día de un Data Analyst. Las empresas peruanas (Interbank, BBVA, Caja Arequipa) te van a pedir "limpia este dataset", "hazme un reporte de ventas por región", "cruza estos dos datasets". Todo eso es pandas. Un dominio sólido de groupby, merge y limpieza te hace inmediatamente productivo. Sin pandas, no hay trabajo de Data Analyst.',
  learningOutcomes: [
    { text: 'Cargar datos con read_csv, read_json, read_excel con opciones (dtype, parse_dates, na_values)' },
    { text: 'Inspeccionar con .info(), .describe(), .head(), .value_counts(), .nunique()' },
    { text: 'Manejar nulos con .isnull(), .fillna(), .dropna(), interpolación' },
    { text: 'Manipular strings con .str accessor: strip, lower, contains, split, replace' },
    { text: 'Agrupar con .groupby() y agregar con .agg(), .transform(), .apply()' },
    { text: 'Combinar DataFrames con .merge(), .concat(), .join()' },
    { text: 'Crear pivot tables y crosstabs' },
    { text: 'Trabajar con fechas: pd.to_datetime(), .dt accessor, resample()' },
  ],
  theory: [
    {
      heading: 'Series y DataFrame — las dos estructuras de pandas',
      paragraphs: [
        'Pandas tiene dos estructuras: `Series` (1D, como columna de Excel) y `DataFrame` (2D, como tabla de Excel). Un DataFrame es esencialmente un dict de Series donde cada Series es una columna. La diferencia clave con NumPy: pandas permite columnas con tipos distintos (str, int, float, datetime), mientras que NumPy requiere un solo dtype. Esto hace pandas ideal para datos reales que vienen sucios.',
        'La forma más común de crear un DataFrame es `pd.read_csv("archivo.csv")`. Opciones importantes: `sep` (separador, default ","), `encoding` (utf-8, latin-1 para acentos), `dtype` (forzar tipos por columna), `parse_dates` (columnas a convertir a datetime), `na_values` (valores a tratar como NaN), `index_col` (columna a usar como índice). Leer bien la documentación de read_csv te ahorra horas de limpieza posterior.',
        'Los atributos clave de un DataFrame: `.shape` (filas, columnas), `.columns` (nombres de columnas), `.dtypes` (tipos), `.index` (índice), `.values` (array NumPy subyacente). Los métodos de inspección: `.head(n)`, `.tail(n)`, `.sample(n)`, `.info()` (tipos + memoria), `.describe()` (estadísticas numéricas), `.value_counts()` (frecuencias), `.nunique()` (valores únicos).',
      ],
      code: {
        language: 'python',
        title: 'pandas_intro.py',
        code: `import pandas as pd
import numpy as np

# Crear DataFrame desde dict
df = pd.DataFrame({
    "nombre": ["Ana", "Luis", "Carlos", "Maria"],
    "edad": [25, 30, 22, 28],
    "ciudad": ["Lima", "Arequipa", "Cusco", "Lima"],
    "salario": [3500, 4200, 2800, 3800]
})

# Inspección
print(df.shape)        # (4, 4)
print(df.columns)      # Index(['nombre', 'edad', 'ciudad', 'salario'], dtype='object')
print(df.dtypes)
# nombre      object
# edad         int64
# ciudad      object
# salario      int64

print(df.head(2))      # primeras 2 filas
print(df.info())       # tipos + memoria
print(df.describe())   # estadísticas numéricas
print(df["ciudad"].value_counts())  # frecuencias
print(df["ciudad"].nunique())       # 3 valores únicos

# Leer CSV (caso típico)
# df = pd.read_csv("ventas.csv", encoding="utf-8", parse_dates=["fecha"],
#                  dtype={"producto": "category"}, na_values=["", "NA", "N/A"])

# Selección de columnas
edades = df["edad"]              # Series (1 columna)
sub = df[["nombre", "salario"]]  # DataFrame (2 columnas)

# Selección de filas con loc (labels) e iloc (índices)
print(df.loc[0])              # primera fila por label
print(df.iloc[0])             # primera fila por posición
print(df.loc[0:1, "nombre"] ) # filas 0-1, columna nombre
print(df.iloc[0:2, 0:2])      # filas 0-1, columnas 0-1`,
      },
    },
    {
      heading: 'Limpieza de datos — el 80% del trabajo real',
      paragraphs: [
        'La limpieza de datos es lo que más tiempo te va a consumir como Data Analyst. Los datasets reales vienen con: valores nulos, tipos incorrectos (números como strings), duplicados, valores atípicos, nombres de columnas inconsistentes, fechas en formatos raros. Pandas tiene herramientas para todo esto.',
        'Para nulos: `.isnull().sum()` cuenta nulos por columna. `.fillna(valor)` reemplaza con un valor fijo. `.fillna({"col": valor_default})` reemplaza por columna. `.dropna()` elimina filas con nulos (cuidado: puedes perder datos). `.interpolate()` rellena con interpolación lineal. La decisión de cuál usar depende del contexto: a vecesfillna(0) es correcto, a veces dropna, a veces la mediana.',
        'Para tipos: `df["col"] = df["col"].astype(int)` convierte. `pd.to_numeric(df["col"], errors="coerce")` convierte string a número, poniendo NaN donde no puede. `pd.to_datetime(df["col"])` parsea fechas. Para strings: `df["col"].str.strip()` quita espacios, `.str.lower()` minúsculas, `.str.replace("a", "b")` reemplaza, `.str.contains("pattern")` filtra, `.str.split(",")` divide.',
      ],
      code: {
        language: 'python',
        title: 'limpieza.py',
        code: `import pandas as pd
import numpy as np

# Dataset sucio (típico)
df = pd.DataFrame({
    "nombre": ["  Ana ", "Luis", "Carlos", "Maria", "ana"],  # espacios, duplicado
    "edad": ["25", "30", "22", "28", "no_disponible"],       # strings
    "salario": [3500, np.nan, 2800, 3800, 3500],             # nulo
    "fecha_ingreso": ["2023-01-15", "2022-06-20", "2024-03-10", "2023-11-05", "2023-01-15"]
})

print("=== ORIGINAL ===")
print(df)

# 1. Limpiar strings
df["nombre"] = df["nombre"].str.strip().str.lower()
print("\\nNombres limpios:", df["nombre"].tolist())

# 2. Eliminar duplicados
df = df.drop_duplicates(subset=["nombre"])
print(f"Tras dedup: {len(df)} filas")

# 3. Convertir tipos con coerce (errores -> NaN)
df["edad"] = pd.to_numeric(df["edad"], errors="coerce")
print(f"Edades: {df['edad'].tolist()}")  # [25, 30, 22, 28, nan]

# 4. Manejar nulos
df["salario"] = df["salario"].fillna(df["salario"].median())  # imputar mediana
df["edad"] = df["edad"].fillna(df["edad"].mean())             # imputar media
print(f"Salarios tras fillna: {df['salario'].tolist()}")

# 5. Convertir fechas
df["fecha_ingreso"] = pd.to_datetime(df["fecha_ingreso"])
print(f"Dtype fecha: {df['fecha_ingreso'].dtype}")

# 6. Extraer componentes de fecha
df["año_ingreso"] = df["fecha_ingreso"].dt.year
df["mes_ingreso"] = df["fecha_ingreso"].dt.month
print(df[["nombre", "año_ingreso", "mes_ingreso"]])

# 7. Renombrar columnas (snake_case)
df = df.rename(columns={
    "nombre": "empleado",
    "fecha_ingreso": "fecha_ing"
})

# 8. Reset index después de cambios
df = df.reset_index(drop=True)
print("\\n=== LIMPIO ===")
print(df)`,
        output: `=== LIMPIO ===
  empleado  edad  salario  fecha_ing  año_ingreso  mes_ingreso
0      ana  25.0   3500.0 2023-01-15          2023             1
1     luis  30.0   3150.0 2022-06-20          2022             6
2   carlos  22.0   2800.0 2024-03-10          2024             3
3    maria  28.0   3800.0 2023-11-05          2023            11`,
      },
    },
    {
      heading: 'GroupBy — el corazón del análisis',
      paragraphs: [
        'El patrón "split-apply-combine" es el más poderoso de pandas. Divides los datos por una clave (split), aplicas una función a cada grupo (apply), y combinas los resultados (combine). La sintaxis: `df.groupby("columna")["otra_columna"].funcion()`. Por ejemplo, `df.groupby("ciudad")["salario"].mean()` da el salario promedio por ciudad.',
        'Las funciones de agregación más usadas: `.mean()`, `.median()`, `.sum()`, `.count()`, `.min()`, `.max()`, `.std()`, `.var()`, `.first()`, `.last()`. Para múltiples agregaciones: `.agg(["mean", "median", "std"])` devuelve DataFrame con múltiples columnas. Para agregaciones con nombres custom: `.agg(salario_promedio=("salario", "mean"), cantidad=("id", "count"))`.',
        '`.transform()` aplica una función pero devuelve un Series del MISMO shape que el original (útil para agregar sin perder filas). `.apply()` aplica cualquier función a cada grupo. `.filter()` filtra grupos enteros según condición. Para datos jerárquicos, usa `groupby(["col1", "col2"])` que crea MultiIndex.',
      ],
      code: {
        language: 'python',
        title: 'groupby.py',
        code: `import pandas as pd
import numpy as np

# Dataset de ventas
df = pd.DataFrame({
    "fecha": pd.date_range("2025-01-01", periods=20, freq="D"),
    "region": np.random.choice(["Lima", "Arequipa", "Cusco"], 20),
    "producto": np.random.choice(["arroz", "aceite", "azucar"], 20),
    "cantidad": np.random.randint(1, 50, 20),
    "precio": np.random.uniform(3, 15, 20).round(2)
})
df["total"] = df["cantidad"] * df["precio"]

# GroupBy simple: total por región
print(df.groupby("region")["total"].sum())
# region
# Arequipa    XXX
# Cusco       YYY
# Lima        ZZZ

# Múltiples agregaciones
print(df.groupby("region")["total"].agg(["count", "mean", "sum"]))

# Agregaciones con nombres custom
resumen = df.groupby("region").agg(
    n_ventas=("total", "count"),
    ingreso_total=("total", "sum"),
    ticket_promedio=("total", "mean"),
    cantidad_total=("cantidad", "sum")
).round(2)
print(resumen)

# GroupBy por múltiples columnas
print(df.groupby(["region", "producto"])["total"].sum().unstack())
# .unstack() pivotea el segundo nivel a columnas

# Transform: agregar sin perder filas
df["total_promedio_region"] = df.groupby("region")["total"].transform("mean")
print(df[["region", "total", "total_promedio_region"]].head())

# Apply: función custom por grupo
def top_3_ventas(grupo):
    return grupo.nlargest(3, "total")

tops = df.groupby("region").apply(top_3_ventas)
print(tops[["region", "producto", "total"]])

# Filter: quedarse con regiones con >5 ventas
regiones_activas = df.groupby("region").filter(lambda g: len(g) > 5)
print(f"Regiones con >5 ventas: {regiones_activas['region'].unique()}")`,
      },
    },
    {
      heading: 'Merge, concat y pivot — combinar y reestructurar',
      paragraphs: [
        'Merge (join) combina dos DataFrames por una columna común. Tipos: `how="inner"` (intersección, default), `how="left"` (todas las filas del izquierdo), `how="right"`, `how="outer"` (unión completa). Es como SQL JOIN. `pd.merge(df1, df2, on="id", how="left")`. Si las columnas se llaman distinto: `left_on="id_izq", right_on="id_der"`.',
        'Concat apila DataFrames vertical (`axis=0`) u horizontalmente (`axis=1`). Útil para combinar múltiples archivos CSV con las mismas columnas. `pd.concat([df1, df2, df3], ignore_index=True)`. Para uniones por índice en vez de columna, usa `.join()`.',
        'Pivot tables reestructuran datos largos a anchos. `df.pivot_table(index="region", columns="producto", values="total", aggfunc="sum")` da una tabla con regiones como filas, productos como columnas, y sumas como valores. `pd.crosstab(df["region"], df["producto"])` cuenta frecuencias. Para melt (inverso de pivot): `df.melt(id_vars=["region"], value_vars=["enero", "febrero"])`.',
      ],
      code: {
        language: 'python',
        title: 'merge_pivot.py',
        code: `import pandas as pd
import numpy as np

# Dataset 1: ventas
ventas = pd.DataFrame({
    "venta_id": [1, 2, 3, 4, 5],
    "cliente_id": [101, 102, 101, 103, 102],
    "producto": ["arroz", "aceite", "azucar", "arroz", "aceite"],
    "monto": [50, 80, 30, 60, 75]
})

# Dataset 2: clientes
clientes = pd.DataFrame({
    "cliente_id": [101, 102, 103, 104],
    "nombre": ["Ana", "Luis", "Carlos", "Maria"],
    "ciudad": ["Lima", "Arequipa", "Cusco", "Lima"]
})

# Merge: enriquecer ventas con info de cliente
ventas_full = pd.merge(ventas, clientes, on="cliente_id", how="left")
print(ventas_full)

# Tipos de merge
inner = pd.merge(ventas, clientes, on="cliente_id", how="inner")  # solo coincidentes
left  = pd.merge(ventas, clientes, on="cliente_id", how="left")   # todas las ventas
outer = pd.merge(ventas, clientes, on="cliente_id", how="outer")  # todo

# Concat: apilar DataFrames
ventas_enero = pd.DataFrame({"producto": ["a", "b"], "monto": [100, 200]})
ventas_febrero = pd.DataFrame({"producto": ["a", "c"], "monto": [150, 80]})
todas = pd.concat([ventas_enero, ventas_febrero], ignore_index=True)
print(todas)

# Pivot table: tabla resumen
ventas_full["mes"] = ["ene", "ene", "feb", "feb", "feb"]
pivot = ventas_full.pivot_table(
    index="nombre",
    columns="mes",
    values="monto",
    aggfunc="sum",
    fill_value=0
)
print(pivot)

# Crosstab: conteo de frecuencias
cross = pd.crosstab(ventas_full["ciudad"], ventas_full["producto"])
print(cross)

# Melt: de ancho a largo (inverso de pivot)
df_ancho = pd.DataFrame({
    "producto": ["arroz", "aceite"],
    "ene": [100, 200],
    "feb": [150, 180],
    "mar": [120, 190]
})
df_largo = df_ancho.melt(
    id_vars=["producto"],
    var_name="mes",
    value_name="monto"
)
print(df_largo)`,
      },
    },
    {
      heading: 'Time series con pandas — fechas, resample, rolling',
      paragraphs: [
        'Pandas brilla con series temporales. Si configuras una columna datetime como índice (`df.set_index("fecha")`), desbloqueas operaciones poderosas: `.resample()` para cambiar frecuencia (diario a mensual), `.rolling()` para ventanas móviles (medias móviles), `.shift()` para lag features, `.diff()` para diferencias (variación absoluta). Estas operaciones son el pan de cada día en forecasting y análisis financiero.',
        '`.resample("M").sum()` agrupa por mes y suma. `"D"` diario, `"W"` semanal, `"M"` mensual, `"Q"` trimestral, `"Y"` anual. Puedes combinar con cualquier agregación. Para ventanas móviles: `df["col"].rolling(window=7).mean()` da la media móvil de 7 días. Para lag: `df["col"].shift(1)` desplaza un período (útil para comparar con el período anterior).',
        'El accessor `.dt` da acceso a componentes de fecha: `.dt.year`, `.dt.month`, `.dt.day`, `.dt.weekday`, `.dt.quarter`, `.dt.is_month_end`. Para extraer features temporales de una fecha, este accessor es la forma idiomática. En ML, estas features (día de la semana, mes, es fin de semana) son cruciales para modelos de demanda.',
      ],
      code: {
        language: 'python',
        title: 'timeseries.py',
        code: `import pandas as pd
import numpy as np

# Crear serie temporal
fechas = pd.date_range("2024-01-01", "2024-12-31", freq="D")
df = pd.DataFrame({
    "fecha": fechas,
    "ventas": np.random.normal(100, 20, len(fechas)).cumsum() + 500
})

# Configurar fecha como índice
df = df.set_index("fecha")

# Resample: cambiar frecuencia
ventas_mensuales = df["ventas"].resample("M").mean()
ventas_semanales = df["ventas"].resample("W").sum()
print("Ventas mensuales (primeras 3):")
print(ventas_mensuales.head(3))

# Rolling: media móvil
df["ma_7"] = df["ventas"].rolling(window=7).mean()
df["ma_30"] = df["ventas"].rolling(window=30).mean()
print(df[["ventas", "ma_7", "ma_30"]].head(10))

# Shift: lag features
df["ventas_anterior"] = df["ventas"].shift(1)
df["variacion"] = df["ventas"].diff()  # ventas - ventas_anterior
df["variacion_pct"] = df["ventas"].pct_change() * 100
print(df[["ventas", "ventas_anterior", "variacion", "variacion_pct"]].head())

# Features temporales con .dt (debes reset index o usar .index.dt)
df_reset = df.reset_index()
df_reset["dia_semana"] = df_reset["fecha"].dt.day_name()
df_reset["mes"] = df_reset["fecha"].dt.month
df_reset["trimestre"] = df_reset["fecha"].dt.quarter
df_reset["es_fin_semana"] = df_reset["fecha"].dt.weekday >= 5
print(df_reset[["fecha", "dia_semana", "mes", "es_fin_semana"]].head())

# Filtrar por fecha
enero = df.loc["2024-01"]
primer_semestre = df.loc["2024-01":"2024-06"]
print(f"\\nEnero: {len(enero)} días, primer sem: {len(primer_semestre)} días")`,
      },
      callout: {
        type: 'tip',
        title: 'Siempre configura dtype y parse_dates al leer',
        content:
          'El error #1 de principiantes es leer CSV sin `parse_dates` y luego intentar operaciones de fecha que fallan porque las fechas son strings. Lee con `pd.read_csv("file.csv", parse_dates=["fecha_col"])` desde el inicio. Si tienes columnas numéricas como strings, usa `dtype={"id": "category", "monto": "float64"}` para forzar tipos.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a hacer un EDA completo de un dataset público real: Netflix Movies and TV Shows (disponible en Kaggle). Este dataset tiene ~8800 títulos con director, cast, país, fecha de adición, rating, duración, etc. Es exactamente el formato de "take-home project" que mandan empresas US: te dan un dataset crudo, te piden 5 insights de negocio. Vamos a limpiar y responder preguntas reales.',
    steps: [
      {
        description: 'Cargar dataset y hacer inspección inicial',
        code: {
          language: 'python',
          title: 'netflix_eda.py',
          code: `import pandas as pd
import numpy as np

# Cargar dataset (asumiendo que descargaste netflix_titles.csv de Kaggle)
# Para demo, creamos dataset sintético similar
np.random.seed(42)
n = 8800
paises = ["United States", "India", "United Kingdom", "Japan", "South Korea",
          "Canada", "Spain", "France", "Mexico", "Brazil"] + [np.nan]*500
tipos = ["Movie", "TV Show"]
ratings = ["TV-MA", "TV-14", "TV-PG", "R", "PG-13", "PG"] + [np.nan]*200

df = pd.DataFrame({
    "show_id": range(1, n+1),
    "type": np.random.choice(tipos, n, p=[0.7, 0.3]),
    "title": [f"Title {i}" for i in range(n)],
    "director": [f"Director {i}" if np.random.rand() > 0.3 else np.nan for i in range(n)],
    "cast": [f"Actor {i}, Actor {i+1}" if np.random.rand() > 0.1 else np.nan for i in range(n)],
    "country": np.random.choice(paises, n),
    "date_added": pd.date_range("2010-01-01", periods=n, freq="3D"),
    "release_year": np.random.randint(1940, 2024, n),
    "rating": np.random.choice(ratings, n),
    "duration": [f"{np.random.randint(60, 180)} min" if t == "Movie"
                 else f"{np.random.randint(1, 8)} Season{'s' if np.random.rand() > 0.5 else ''}"
                 for t in np.random.choice(tipos, n, p=[0.7, 0.3])],
    "listed_in": np.random.choice(
        ["Dramas, International Movies", "Comedies", "Documentaries",
         "Action, Adventure", "Kids' TV"], n)
})

# === INSPECCIÓN INICIAL ===
print("=== INFO ===")
print(df.info())

print("\\n=== SHAPE ===")
print(f"Filas: {df.shape[0]}, Columnas: {df.shape[1]}")

print("\\n=== NULOS POR COLUMNA ===")
print(df.isnull().sum())
print(f"\\nTotal nulos: {df.isnull().sum().sum()}")

print("\\n=== DESCRIBE ===")
print(df.describe(include='all'))`,
          output: `=== INFO ===
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 8800 entries, 0 to 8799
Data columns (total 11 columns):
 #   Column        Non-Null Count  Dtype
---  ------        --------------  -----
 0   show_id       8800 non-null   int64
 1   type          8800 non-null   object
 2   title         8800 non-null   object
 3   director      6160 non-null   object
 4   cast          7920 non-null   object
 5   country       8300 non-null   object
 6   date_added    8800 non-null   datetime64[ns]
 7   release_year  8800 non-null   int64
 8   rating        8600 non-null   object
 9   duration      8800 non-null   object
 10  listed_in     8800 non-null   object
dtypes: datetime64[ns](1), int64(2), object(8)

=== NULOS POR COLUMNA ===
director      2640
cast           880
country        500
rating         200
...`,
        },
        why: 'La inspección inicial es obligatoria. `.info()` te dice tipos y nulos. `.isnull().sum()` te muestra dónde está el problema. `.describe()` te da distribución estadística. NUNCA empieces a modelar sin antes entender el dataset — esto evita bugs absurdos como intentar agrupar por una columna con 90% de nulos.',
      },
      {
        description: 'Limpiar y responder 5 preguntas de negocio',
        code: {
          language: 'python',
          title: 'netflix_eda.py',
          code: `# === LIMPIEZA ===
# Imputar nulos
df["director"] = df["director"].fillna("No disponible")
df["cast"] = df["cast"].fillna("No disponible")
df["country"] = df["country"].fillna("Desconocido")
df["rating"] = df["rating"].fillna(df["rating"].mode()[0])

# Extraer género principal (primero de la lista)
df["genero_principal"] = df["listed_in"].str.split(",").str[0].str.strip()

# Extraer número de temporadas o minutos
df["duracion_min"] = df["duration"].str.extract(r'(\\d+)\\s*min').astype(float)
df["n_temporadas"] = df["duration"].str.extract(r'(\\d+)\\s*Season').astype(float)

# Extraer año y mes de date_added
df["año_added"] = df["date_added"].dt.year
df["mes_added"] = df["date_added"].dt.month

# === PREGUNTA 1: ¿Qué % del contenido es Movies vs TV Shows? ===
print("\\n=== P1: Distribución por tipo ===")
print(df["type"].value_counts(normalize=True).mul(100).round(1))

# === PREGUNTA 2: Top 10 países por volumen de contenido ===
print("\\n=== P2: Top 10 países ===")
top_paises = df["country"].value_counts().head(10)
print(top_paises)

# === PREGUNTA 3: Evolución de contenido por año ===
print("\\n=== P3: Contenido agregado por año ===")
por_año = df.groupby("año_added").size().sort_index()
print(por_año.tail(10))

# === PREGUNTA 4: Duración promedio de películas por país ===
print("\\n=== P4: Top 5 países con películas más largas ===")
peliculas = df[df["type"] == "Movie"]
dur_por_pais = peliculas.groupby("country")["duracion_min"].agg(
    ["mean", "count"]).query("count >= 10").sort_values("mean", ascending=False).head(5)
print(dur_por_pais.round(1))

# === PREGUNTA 5: Top 5 directores por cantidad de títulos ===
print("\\n=== P5: Top 5 directores ===")
directores = df[df["director"] != "No disponible"]
top_directores = directores["director"].value_counts().head(5)
print(top_directores)

# === EXPORTAR DATASET LIMPIO ===
df.to_csv("netflix_clean.csv", index=False)
print("\\n✓ Dataset limpio exportado a netflix_clean.csv")
print(f"  Filas: {len(df)}, Columnas: {len(df.columns)}")`,
          output: `=== P1: Distribución por tipo ===
type
Movie      70.0
TV Show    30.0

=== P2: Top 10 países ===
United States     880
India             880
United Kingdom    880
... (10 países)

=== P5: Top 5 directores ===
Director 0    3
Director 1    3
...`,
        },
        why: 'Este EDA responde 5 preguntas de negocio reales que un stakeholder te haría. Cada una usa un patrón distinto: value_counts (frecuencia), groupby (agregación), groupby con query (filtro post-agregación), str accessor (limpieza de strings), dt accessor (fechas). Combinados, estos patrones resuelven el 90% de EDAs que harás en tu carrera.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca a ti hacer un EDA similar con un dataset más simple. Vamos a usar un dataset de empleados y responder 3 preguntas de negocio.',
    steps: [
      {
        instruction: 'Calcula salario promedio por departamento y identifica el top 3 de cada uno',
        hint: 'Usa groupby con agg, luego sort_values y groupby.head(3).',
        starterCode: {
          language: 'python',
          title: 'empleados_eda.py',
          code: `import pandas as pd
import numpy as np

# Dataset sintético
np.random.seed(42)
empleados = pd.DataFrame({
    "nombre": [f"Emp{i}" for i in range(200)],
    "departamento": np.random.choice(["IT", "Sales", "Marketing", "Finanzas", "RRHH"], 200),
    "salario": np.random.randint(2000, 8000, 200),
    "años_experiencia": np.random.randint(0, 20, 200)
})

# TODO: salario promedio por departamento
# TODO: top 3 empleados por salario en cada departamento
# TODO: correlación entre años de experiencia y salario`,
        },
        solutionCode: {
          language: 'python',
          title: 'empleados_eda.py',
          code: `import pandas as pd
import numpy as np

np.random.seed(42)
empleados = pd.DataFrame({
    "nombre": [f"Emp{i}" for i in range(200)],
    "departamento": np.random.choice(["IT", "Sales", "Marketing", "Finanzas", "RRHH"], 200),
    "salario": np.random.randint(2000, 8000, 200),
    "años_experiencia": np.random.randint(0, 20, 200)
})

# 1. Salario promedio por departamento
print("=== Salario promedio por departamento ===")
salario_por_dept = empleados.groupby("departamento")["salario"].agg(["mean", "count", "std"]).round(2)
print(salario_por_dept.sort_values("mean", ascending=False))

# 2. Top 3 por departamento
print("\\n=== Top 3 por departamento ===")
tops = empleados.sort_values("salario", ascending=False).groupby("departamento").head(3)
for dept, grupo in tops.groupby("departamento"):
    print(f"\\n{dept}:")
    print(grupo[["nombre", "salario", "años_experiencia"]].to_string(index=False))

# 3. Correlación
print("\\n=== Correlación ===")
corr = empleados[["años_experiencia", "salario"]].corr()
print(corr)
# Si correlación > 0.5, hay relación positiva fuerte

# Bonus: salario promedio por departamento Y años de experiencia (bins)
empleados["exp_cat"] = pd.cut(empleados["años_experiencia"],
                               bins=[0, 5, 10, 15, 20],
                               labels=["Junior", "Mid", "Senior", "Lead"])
pivot = empleados.pivot_table(
    index="exp_cat",
    columns="departamento",
    values="salario",
    aggfunc="mean"
).round(0)
print("\\n=== Salario por experiencia y dept ===")
print(pivot)`,
          output: `=== Salario promedio por departamento ===
                  mean  count    std
departamento
IT           5074.32     43   1756
Finanzas     4987.65     38   1820
...`,
        },
      },
    ],
  },
  youDo: {
    title: 'Real-World EDA Report — Tu primer proyecto de portafolio',
    context:
      'Tu primer proyecto completo de EDA. Descarga el dataset Netflix Movies and TV Shows de Kaggle (gratis, solo necesitas cuenta). Haz un EDA completo respondiendo 5+ preguntas de negocio, limpia los datos, y exporta un dataset limpio. Este es EXACTAMENTE el formato de take-home project que mandan empresas US para puestos de Data Analyst.',
    objectives: [
      'Descargar dataset Netflix de Kaggle (~8800 filas)',
      'Limpiar ~2800 nulos en director, cast, country',
      'Responder 5 preguntas de negocio con groupby, agg, str methods',
      'Usar pd.to_datetime y extraer features temporales',
      'Exportar dataset limpio a netflix_clean.csv',
    ],
    requirements: [
      'Leer CSV con parse_dates y dtype',
      'Imputar nulos con estrategia apropiada (fill con "No disponible", mode, etc.)',
      'Usar .str.split() para separar columnas multi-valor (genres)',
      'Al menos 2 análisis con .groupby().agg()',
      'Al menos 1 análisis con pivot_table o crosstab',
      'Exportar a CSV con encoding utf-8',
      'README con 5 insights y los comandos para reproducir',
    ],
    starterCode: `import pandas as pd
import numpy as np

def cargar_datos(ruta="netflix_titles.csv"):
    """Carga y parsea el dataset."""
    # TODO
    pass

def limpiar(df):
    """Limpia nulos, tipos, strings."""
    # TODO
    pass

def analizar(df):
    """Responde 5 preguntas de negocio."""
    # TODO: P1, P2, P3, P4, P5
    pass

def exportar(df, ruta="netflix_clean.csv"):
    """Exporta dataset limpio."""
    # TODO
    pass

def main():
    # Pipeline
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'Este proyecto es el caballito de batalla de tu portafolio. En entrevistas, muéstralo, abre el notebook, y explica tus decisiones de limpieza. Las empresas valoran la capacidad de tomar decisiones con datos sucios más que el análisis perfecto sobre datos limpios. Sube el CSV limpio también para que puedan verificar.',
    rubric: [
      { criterion: 'Limpieza correcta y justificada de los ~2800 nulos', weight: '25%' },
      { criterion: '5 preguntas de negocio respondidas con groupby', weight: '25%' },
      { criterion: 'Uso de .str accessor para columnas multi-valor', weight: '15%' },
      { criterion: 'Features temporales extraídas con .dt', weight: '15%' },
      { criterion: 'Export a CSV limpio + README con insights', weight: '10%' },
      { criterion: 'Código modular con funciones', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué hace `df.groupby("region")["salario"].mean()`?',
        options: [
          'Devuelve un DataFrame con la media de salario por región',
          'Devuelve un Series con la media de salario por región',
          'Filtra filas donde salario es la media',
          'Agrega una columna con la media',
        ],
        correctIndex: 1,
        explanation:
          'groupby devuelve un Series si seleccionas una columna. La región se convierte en el índice del Series. Si quieres DataFrame, usa `.reset_index()` o `.to_frame()`.',
      },
      {
        question: '¿Cuál es la diferencia entre .loc y .iloc?',
        options: [
          'Son lo mismo',
          '.loc usa labels (nombres), .iloc usa posiciones (enteros)',
          '.loc es más rápido',
          '.iloc solo funciona con números',
        ],
        correctIndex: 1,
        explanation:
          '.loc usa labels del índice y nombres de columnas. .iloc usa posiciones enteras (0-based). Si tu índice es [10, 20, 30], df.loc[10] devuelve la primera fila, df.iloc[0] también. Pero df.loc[0] daría KeyError.',
      },
      {
        question: '¿Cómo manejas valores nulos en una columna numérica?',
        options: [
          'Eliminar todas las filas con cualquier nulo',
          'Imputar con media, mediana, o un valor específico según contexto',
          'Convertir a 0 siempre',
          'Dejarlos, pandas los maneja automáticamente',
        ],
        correctIndex: 1,
        explanation:
          'Depende del contexto: dropna si los nulos son pocos y aleatorios, fillna(media) si la distribución es simétrica, fillna(mediana) si hay outliers, fillna(0) si el nulo realmente significa cero. No hay respuesta universal.',
      },
      {
        question: '¿Qué hace `pd.merge(df1, df2, on="id", how="left")`?',
        options: [
          'Devuelve solo filas con id presente en ambos',
          'Devuelve todas las filas de df1, con NaN donde no hay match en df2',
          'Devuelve todas las filas de df2',
          'Devuelve la unión de ambos',
        ],
        correctIndex: 1,
        explanation:
          'LEFT JOIN: todas las filas del DataFrame izquierdo (df1), y donde no hay coincidencia en df2, los valores de df2 quedan como NaN. Es el JOIN más común cuando quieres "enriquecer" un dataset.',
      },
      {
        question: '¿Para qué sirve `.resample("M").sum()` en un DataFrame con índice datetime?',
        options: [
          'Eliminar valores nulos mensuales',
          'Agrupar por mes y sumar los valores',
          'Resetear el índice a mensual',
          'Crear una columna de mes',
        ],
        correctIndex: 1,
        explanation:
          'resample("M") agrupa los datos por mes. .sum() aplica la suma a cada grupo. Es la forma pandas de hacer agregación temporal. Equivalente a groupby por mes, pero optimizado para datetime.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Pandas — Official docs', url: 'https://pandas.pydata.org/docs/', note: 'Documentación oficial con user guide' },
      { label: 'Pandas — Cookbook', url: 'https://pandas.pydata.org/docs/user_guide/cookbook.html', note: 'Recetas para casos comunes' },
      { label: 'Kaggle Learn — Pandas', url: 'https://www.kaggle.com/learn/pandas', note: 'Micro-curso gratuito interactivo' },
      { label: 'Real Python — Pandas', url: 'https://realpython.com/learning-paths/pandas-data-science/', note: 'Learning path completo' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo extenso sobre pandas y EDA.' },
    ],
    courses: [
      { label: 'Kaggle Learn — Data Cleaning', url: 'https://www.kaggle.com/learn/data-cleaning', note: 'Limpieza avanzada con pandas' },
    ],
  },
}
