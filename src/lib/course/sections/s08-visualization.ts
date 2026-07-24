import type { CourseSection } from '../../types'

export const section08: CourseSection = {
  id: 'visualization',
  index: 8,
  title: 'Data Visualization',
  shortTitle: 'Visualización',
  tagline: 'matplotlib, seaborn y plotly — de gráficos básicos a reportes ejecutivos interactivos',
  estimatedHours: 8,
  level: 'Intermedio',
  icon: 'BarChart3',
  accentColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
  jobRelevance:
    'En entrevistas y en el trabajo, vas a presentar insights a stakeholders no técnicos. Un buen gráfico vale más que 1000 líneas de código. Las empresas peruanas valoran analysts que saben contar historias con datos — matplotlib para exploración, seaborn para estadística, plotly para dashboards interactivos. Tu portafolio necesita visualizaciones pulidas.',
  learningOutcomes: [
    { text: 'Crear gráficos con matplotlib: line, bar, scatter, histogram, box plot, subplots' },
    { text: 'Usar seaborn para gráficos estadísticos: heatmap, pairplot, violin, countplot' },
    { text: 'Crear gráficos interactivos con plotly: px.bar, px.scatter, px.line' },
    { text: 'Aplicar styling: títulos, labels, colores, leyendas, anotaciones' },
    { text: 'Combinar múltiples gráficos en una figura con subplots' },
    { text: 'Guardar figuras como PNG (matplotlib) y HTML (plotly)' },
  ],
  theory: [
    {
      heading: 'matplotlib — la base de todo',
      paragraphs: [
        'matplotlib es la librería fundamental de visualización en Python. Sobre ella se construyen seaborn, pandas.plotting y muchas otras. La API más recomendada es "object-oriented": creas una `Figure` y uno o varios `Axes`, y dibujas sobre los Axes. Esto da control total y es la forma profesional. Evita `plt.plot()` directo para gráficos serios — es limitado y confuso.',
        'El patrón estándar: `fig, ax = plt.subplots(figsize=(10, 6))`, luego `ax.plot(x, y)`, `ax.set_title("...")`, `ax.set_xlabel("...")`, `ax.legend()`. Para múltiples gráficos: `fig, axes = plt.subplots(2, 2, figsize=(12, 8))` y accedes a cada Axes con `axes[0, 0]`. Siempre llama `plt.tight_layout()` antes de `plt.savefig()` para evitar overlaps.',
        'Los tipos más usados: `ax.plot()` (líneas, ideal para series temporales), `ax.bar()` / `ax.barh()` (barras verticales/horizontales, ideal para comparar categorías), `ax.scatter()` (dispersión, ideal para correlaciones), `ax.hist()` (histograma, distribuciones), `ax.boxplot()` (box plot, distribuciones + outliers). Cada uno tiene docenas de parámetros de styling.',
      ],
      code: {
        language: 'python',
        title: 'matplotlib_basics.py',
        code: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Datos de ejemplo
np.random.seed(42)
meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
ventas_2024 = [120, 145, 138, 165, 178, 195]
ventas_2025 = [135, 158, 162, 180, 195, 210]

# === GRÁFICO DE LÍNEAS ===
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(meses, ventas_2024, marker='o', label='2024', linewidth=2)
ax.plot(meses, ventas_2025, marker='s', label='2025', linewidth=2)
ax.set_title('Ventas mensuales 2024 vs 2025', fontsize=14, fontweight='bold')
ax.set_xlabel('Mes', fontsize=12)
ax.set_ylabel('Ventas (miles S/)', fontsize=12)
ax.legend(loc='upper left')
ax.grid(True, alpha=0.3)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig('line_plot.png', dpi=150, bbox_inches='tight')
plt.show()

# === GRÁFICO DE BARRAS HORIZONTALES ===
fig, ax = plt.subplots(figsize=(10, 6))
regiones = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura']
ventas = [2500, 1800, 1200, 950, 850]
colors = plt.cm.viridis(np.linspace(0, 1, len(regiones)))
ax.barh(regiones, ventas, color=colors)
ax.set_xlabel('Ventas (S/)')
ax.set_title('Ventas por región', fontsize=14, fontweight='bold')
# Anotar valores en las barras
for i, v in enumerate(ventas):
    ax.text(v + 30, i, f'S/{v:,}', va='center')
plt.tight_layout()
plt.savefig('bar_plot.png', dpi=150, bbox_inches='tight')
plt.show()`,
      },
    },
    {
      heading: 'Subplots y figure/axes — gráficos multi-panel',
      paragraphs: [
        'Los subplots permiten mostrar múltiples gráficos en una figura. Esto es crucial para dashboards y reportes ejecutivos donde quieres ver 4 perspectivas a la vez. La sintaxis: `fig, axes = plt.subplots(2, 2, figsize=(12, 8))` crea una grilla 2x2. Accedes a cada Axes con `axes[0, 0]`, `axes[0, 1]`, etc.',
        'Para subplots de tamaños desiguales, usa `gridspec` o el parámetro `gridspec_kw`. Por ejemplo: `fig, axes = plt.subplots(2, 2, figsize=(12, 8), gridspec_kw={"height_ratios": [2, 1]})` da más espacio a la fila de arriba. Para combinar gráficos de distinta complejidad en una sola figura, esto es esencial.',
        'Cuando trabajes con subplots, comparte ejes cuando tenga sentido: `sharex=True, sharey=True` evita que cada Axes tenga su propia escala. Esto facilita comparaciones visuales. También usa `fig.suptitle("Título general")` para un título que abarque toda la figura.',
      ],
      code: {
        language: 'python',
        title: 'subplots.py',
        code: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

np.random.seed(42)
df = pd.DataFrame({
    "categoria": np.random.choice(["A", "B", "C", "D"], 200),
    "valor": np.random.normal(100, 20, 200),
    "grupo": np.random.choice(["X", "Y"], 200)
})

# === 4 gráficos en una figura ===
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Análisis exploratorio completo', fontsize=16, fontweight='bold')

# Panel 1: Histograma
axes[0, 0].hist(df["valor"], bins=30, color='skyblue', edgecolor='black')
axes[0, 0].set_title('Distribución de valores')
axes[0, 0].set_xlabel('Valor')
axes[0, 0].set_ylabel('Frecuencia')

# Panel 2: Bar chart por categoría
cat_counts = df["categoria"].value_counts()
axes[0, 1].bar(cat_counts.index, cat_counts.values, color='salmon')
axes[0, 1].set_title('Frecuencia por categoría')
axes[0, 1].set_xlabel('Categoría')

# Panel 3: Box plot por grupo
df.boxplot(column="valor", by="grupo", ax=axes[1, 0])
axes[1, 0].set_title('Distribución por grupo')
axes[1, 0].set_xlabel('Grupo')

# Panel 4: Scatter valor vs índice (simulando tiempo)
axes[1, 1].scatter(range(len(df)), df["valor"], alpha=0.5, s=20)
axes[1, 1].set_title('Valores a lo largo del tiempo')
axes[1, 1].set_xlabel('Índice')
axes[1, 1].set_ylabel('Valor')

plt.tight_layout()
plt.savefig('multi_panel.png', dpi=150, bbox_inches='tight')
plt.show()`,
      },
    },
    {
      heading: 'seaborn — gráficos estadísticos con una línea',
      paragraphs: [
        'seaborn se construye sobre matplotlib y simplifica drásticamente gráficos estadísticos. Una sola línea hace lo que matplotlib requiere 10. Es la herramienta ideal para EDA: box plots, violin plots, heatmaps de correlación, pair plots, regression plots. La convención: `import seaborn as sns` y `sns.set_theme()` para estilo consistente.',
        'Los gráficos más usados en seaborn: `sns.histplot(data, x)` (histograma), `sns.boxplot(data, x, y)` (caja y bigotes), `sns.violinplot()` (violín, combinación de box + densidad), `sns.scatterplot(data, x, y, hue)` (dispersión con color por categoría), `sns.heatmap(corr, annot=True)` (matriz de correlación), `sns.pairplot(data)` (todas las combinaciones de scatter + diagonal).',
        'Para gráficos de regresión: `sns.regplot(x, y)` muestra scatter + línea de regresión + intervalo de confianza. `sns.lmplot()` es similar pero soporta `col` y `row` para facetar por categoría. `sns.jointplot(x, y)` combina scatter + histogramas marginales — excelente para ver correlación y distribución simultáneamente.',
      ],
      code: {
        language: 'python',
        title: 'seaborn_demo.py',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Estilo consistente
sns.set_theme(style="whitegrid", palette="muted")

# Dataset sintético
np.random.seed(42)
df = pd.DataFrame({
    "vendedor": np.random.choice(["Ana", "Luis", "Carlos", "Maria"], 200),
    "region": np.random.choice(["Lima", "Provincia"], 200),
    "ventas": np.random.normal(5000, 1500, 200),
    "experiencia": np.random.randint(1, 15, 200)
})
df.loc[df["region"] == "Lima", "ventas"] += 1000  # sesgo por región

# === HEATMAP DE CORRELACIÓN ===
fig, ax = plt.subplots(figsize=(8, 6))
corr = df[["ventas", "experiencia"]].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, square=True, ax=ax)
ax.set_title('Matriz de correlación')
plt.tight_layout()
plt.savefig('heatmap.png', dpi=150)
plt.show()

# === BOXPLOT ===
fig, ax = plt.subplots(figsize=(10, 6))
sns.boxplot(data=df, x="vendedor", y="ventas", hue="region", ax=ax)
ax.set_title('Distribución de ventas por vendedor y región')
plt.tight_layout()
plt.savefig('boxplot.png', dpi=150)
plt.show()

# === VIOLIN PLOT ===
fig, ax = plt.subplots(figsize=(10, 6))
sns.violinplot(data=df, x="vendedor", y="ventas", ax=ax, inner="box")
ax.set_title('Distribución de ventas (violin)')
plt.tight_layout()
plt.savefig('violin.png', dpi=150)
plt.show()

# === PAIRPLOT — exploración rápida ===
# Genera grilla de scatter plots para todas las combinaciones
g = sns.pairplot(df[["ventas", "experiencia", "region"]], hue="region", height=3)
g.figure.suptitle('Pairplot', y=1.02)
plt.savefig('pairplot.png', dpi=150, bbox_inches='tight')
plt.show()

# === REGPLOT — scatter con regresión ===
fig, ax = plt.subplots(figsize=(10, 6))
sns.regplot(data=df, x="experiencia", y="ventas", ax=ax,
            scatter_kws={"alpha": 0.5}, line_kws={"color": "red"})
ax.set_title('Relación experiencia vs ventas')
plt.tight_layout()
plt.savefig('regplot.png', dpi=150)
plt.show()`,
      },
    },
    {
      heading: 'plotly — interactividad para dashboards',
      paragraphs: [
        'plotly crea gráficos interactivos (hover, zoom, pan) que se exportan como HTML. Es ideal para dashboards y reportes web. La API más simple es `plotly.express` (importado como `px`): `px.bar(df, x, y)`, `px.scatter(df, x, y, color)`, `px.line(df, x, y)`. Cada función devuelve una Figure que se muestra en Jupyter o se exporta con `fig.write_html("archivo.html")`.',
        'La ventaja principal de plotly sobre matplotlib: interactividad. En un dashboard, el usuario puede hacer hover sobre un punto y ver el valor exacto, hacer zoom en una región, filtrar con leyenda clickeable. Para reportes ejecutivos que se ven en browser, plotly es insuperable.',
        'Para combinar múltiples trazos en una figura: `fig = go.Figure()` (plotly graph objects), `fig.add_trace(go.Scatter(...))`. Es más verboso que plotly.express pero más flexible. Para subplots en plotly, usa `make_subplots(rows=2, cols=2)`.',
      ],
      code: {
        language: 'python',
        title: 'plotly_demo.py',
        code: `import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

# Datos
np.random.seed(42)
df = pd.DataFrame({
    "fecha": pd.date_range("2024-01-01", periods=100, freq="D"),
    "ventas": np.random.normal(100, 15, 100).cumsum(),
    "region": np.random.choice(["Lima", "Arequipa", "Cusco"], 100),
    "vendedor": np.random.choice(["Ana", "Luis", "Carlos"], 100)
})

# === BAR CHART INTERACTIVO ===
ventas_region = df.groupby("region")["ventas"].sum().reset_index()
fig = px.bar(ventas_region, x="region", y="ventas",
             color="region",
             title="Ventas totales por región",
             labels={"ventas": "Ventas (S/)", "region": "Región"})
fig.write_html("bar_interactive.html")
fig.show()

# === SCATTER INTERACTIVO ===
fig = px.scatter(df, x="fecha", y="ventas", color="region",
                 hover_data=["vendedor"],
                 title="Ventas a lo largo del tiempo por región")
fig.write_html("scatter_interactive.html")
fig.show()

# === LINE CHART CON MÚLTIPLES SERIES ===
fig = px.line(df, x="fecha", y="ventas", color="region",
              title="Evolución de ventas por región")
fig.write_html("line_interactive.html")
fig.show()

# === SUBPLOTS con graph_objects ===
fig = make_subplots(rows=2, cols=1, subplot_titles=("Ventas diarias", "Ventas acumuladas"))
fig.add_trace(go.Scatter(x=df["fecha"], y=df["ventas"], mode='lines', name='Diarias'), row=1, col=1)
fig.add_trace(go.Scatter(x=df["fecha"], y=df["ventas"].cumsum(), mode='lines', name='Acumuladas'), row=2, col=1)
fig.update_layout(height=600, title_text="Dashboard de ventas")
fig.write_html("dashboard.html")
fig.show()`,
      },
      callout: {
        type: 'tip',
        title: 'Cuándo usar qué librería',
        content:
          'matplotlib: exploración rápida, gráficos para papers/reportes estáticos (PNG). seaborn: EDA estadístico, heatmaps, violin plots, pairplots. plotly: dashboards web, reportes ejecutivos que se ven en browser, interactividad. La combinación matplotlib + seaborn + plotly en un mismo reporte es estándar en la industria.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a crear juntos un reporte visual completo del dataset Netflix. 4 paneles en una figura: evolución temporal (línea), top países (barras), distribución de tipos (pie), y ratings (countplot). Es exactamente el tipo de dashboard que un stakeholder te pide en una reunión.',
    steps: [
      {
        description: 'Crear figura 4 paneles con matplotlib + seaborn',
        code: {
          language: 'python',
          title: 'netflix_viz.py',
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from pathlib import Path

# Crear datos sintéticos (similar al dataset Netflix real)
np.random.seed(42)
n = 8800
df = pd.DataFrame({
    "type": np.random.choice(["Movie", "TV Show"], n, p=[0.7, 0.3]),
    "country": np.random.choice(
        ["United States", "India", "United Kingdom", "Japan", "South Korea",
         "Canada", "Spain", "France", "Mexico", "Brazil"], n),
    "date_added": pd.date_range("2010-01-01", periods=n, freq="3D"),
    "rating": np.random.choice(["TV-MA", "TV-14", "TV-PG", "R", "PG-13", "PG"], n)
})
df["año"] = df["date_added"].dt.year

# Configurar estilo
sns.set_theme(style="whitegrid")
Path("visuals").mkdir(exist_ok=True)

# === FIGURA 4 PANELES ===
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Netflix Content Analysis', fontsize=18, fontweight='bold', y=1.00)

# Panel 1: Contenido agregado por año (línea)
por_año = df.groupby("año").size()
axes[0, 0].plot(por_año.index, por_año.values, marker='o', linewidth=2, color='#E50914')
axes[0, 0].fill_between(por_año.index, por_año.values, alpha=0.2, color='#E50914')
axes[0, 0].set_title('Contenido agregado por año', fontsize=13, fontweight='bold')
axes[0, 0].set_xlabel('Año')
axes[0, 0].set_ylabel('Cantidad de títulos')
axes[0, 0].grid(True, alpha=0.3)

# Panel 2: Top 10 países (barras horizontales)
top_paises = df["country"].value_counts().head(10)
axes[0, 1].barh(top_paises.index[::-1], top_paises.values[::-1], color='skyblue')
axes[0, 1].set_title('Top 10 países por contenido', fontsize=13, fontweight='bold')
axes[0, 1].set_xlabel('Cantidad de títulos')
for i, v in enumerate(top_paises.values[::-1]):
    axes[0, 1].text(v + 5, i, str(v), va='center', fontsize=10)

# Panel 3: Distribución por tipo (pie chart)
tipo_counts = df["type"].value_counts()
axes[1, 0].pie(tipo_counts.values, labels=tipo_counts.index, autopct='%1.1f%%',
               colors=['#E50914', '#221F1F'], startangle=90,
               textprops={'fontsize': 12, 'color': 'white', 'fontweight': 'bold'})
axes[1, 0].set_title('Distribución por tipo', fontsize=13, fontweight='bold')

# Panel 4: Rating distribution (countplot)
sns.countplot(data=df, x="rating", ax=axes[1, 1], palette='Set2',
              order=df["rating"].value_counts().index)
axes[1, 1].set_title('Distribución de ratings', fontsize=13, fontweight='bold')
axes[1, 1].set_xlabel('Rating')
axes[1, 1].set_ylabel('Cantidad')
axes[1, 1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig('visuals/netflix_4panel.png', dpi=150, bbox_inches='tight')
plt.show()
print("✓ 4-panel guardado en visuals/netflix_4panel.png")`,
          output: `✓ 4-panel guardado en visuals/netflix_4panel.png`,
        },
        why: 'Una figura de 4 paneles cuenta una historia completa: evolución temporal, ranking geográfico, mix de productos, y distribución de calidad. En 30 segundos, el stakeholder entiende el dataset. Esta es la diferencia entre un analyst junior que hace 4 gráficos separados y uno senior que arma un dashboard coherente.',
      },
      {
        description: 'Agregar heatmap de correlación y plotly interactivo',
        code: {
          language: 'python',
          title: 'netflix_viz.py',
          code: `import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")  # backend no interactivo (scripts / CI)
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from pathlib import Path

# Datos sintéticos (mismo esquema que el dashboard 4 paneles)
np.random.seed(42)
n = 8800
df = pd.DataFrame({
    "type": np.random.choice(["Movie", "TV Show"], n, p=[0.7, 0.3]),
    "country": np.random.choice(
        ["United States", "India", "United Kingdom", "Japan", "South Korea",
         "Canada", "Spain", "France", "Mexico", "Brazil"], n),
    "date_added": pd.date_range("2010-01-01", periods=n, freq="3D"),
    "rating": np.random.choice(["TV-MA", "TV-14", "TV-PG", "R", "PG-13", "PG"], n)
})
df["año"] = df["date_added"].dt.year
Path("visuals").mkdir(exist_ok=True)

# === HEATMAP DE CORRELACIÓN ===
# Agregamos features numéricas para correlación
df["mes"] = df["date_added"].dt.month
df["es_movie"] = (df["type"] == "Movie").astype(int)
df["año_release"] = df["año"] - np.random.randint(0, 5, n)

numeric_cols = ["año", "mes", "es_movie", "año_release"]
corr = df[numeric_cols].corr()

fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap='RdBu_r', center=0, square=True,
            linewidths=0.5, ax=ax, fmt='.2f')
ax.set_title('Correlación entre features numéricas', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('visuals/netflix_heatmap.png', dpi=150, bbox_inches='tight')
plt.close()

# === PLOTLY INTERACTIVO: Timeline de adiciones por mes ===
df["fecha"] = df["date_added"].dt.to_period("M").astype(str)
por_mes = df.groupby(["fecha", "type"]).size().reset_index(name="count")
por_mes["fecha"] = pd.to_datetime(por_mes["fecha"])

fig = px.area(por_mes, x="fecha", y="count", color="type",
              title="Contenido agregado por mes (interactivo)",
              labels={"count": "Títulos agregados", "fecha": "Fecha"},
              color_discrete_map={"Movie": "#E50914", "TV Show": "#221F1F"})
fig.update_layout(hovermode="x unified")
fig.write_html("visuals/netflix_timeline.html")
print("✓ Timeline interactivo guardado en visuals/netflix_timeline.html")

# === RESUMEN DE ARCHIVOS GENERADOS ===
print("\\n=== ARCHIVOS GENERADOS ===")
for f in sorted(os.listdir("visuals")):
    size = os.path.getsize(f"visuals/{f}") / 1024
    print(f"  visuals/{f} ({size:.1f} KB)")`,
          output: `✓ Timeline interactivo guardado en visuals/netflix_timeline.html

=== ARCHIVOS GENERADOS ===
  visuals/netflix_4panel.png (245.3 KB)
  visuals/netflix_heatmap.png (98.7 KB)
  visuals/netflix_timeline.html (1.2 MB)`,
        },
        why: 'Combinar PNG (estáticos, para documentos) y HTML (interactivos, para web) es el patrón profesional. Los PNG van al README del repo y a reportes PDF. Los HTML van a dashboards internos. Plotly express con area chart + hovermode unificado da una experiencia de usuario premium.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora te toca crear visualizaciones para un dataset de ventas. Vas a producir 4 tipos de gráficos diferentes. Empieza con el starter code y consulta la solución si te trabas.',
    steps: [
      {
        instruction: 'Crea un gráfico de líneas de ventas mensuales con matplotlib, separando 2 años',
        hint: 'Usa plt.subplots(figsize=...), ax.plot con marker, ax.legend, plt.tight_layout.',
        starterCode: {
          language: 'python',
          title: 'ventas_viz.py',
          code: `import matplotlib.pyplot as plt
import numpy as np

meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
         "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
ventas_2024 = [120, 135, 145, 160, 175, 190, 185, 195, 200, 215, 230, 250]
ventas_2025 = [135, 150, 165, 180, 195, 215, 210, 225, 240, 255, 270, 295]

# DEFECT: crea el gráfico de líneas con:
# - markers distintos para cada año
# - título, labels, legend
# - grid sutil
# - sin spines superior y derecho
# guárdalo como ventas_lineas.png`,
        },
        solutionCode: {
          language: 'python',
          title: 'ventas_viz.py',
          code: `import matplotlib.pyplot as plt
import numpy as np

meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
         "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
ventas_2024 = [120, 135, 145, 160, 175, 190, 185, 195, 200, 215, 230, 250]
ventas_2025 = [135, 150, 165, 180, 195, 215, 210, 225, 240, 255, 270, 295]

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(meses, ventas_2024, marker='o', linewidth=2, label='2024', color='#4C72B0')
ax.plot(meses, ventas_2025, marker='s', linewidth=2, label='2025', color='#DD8452')

ax.set_title('Ventas mensuales 2024 vs 2025', fontsize=14, fontweight='bold')
ax.set_xlabel('Mes', fontsize=12)
ax.set_ylabel('Ventas (miles S/)', fontsize=12)
ax.legend(loc='upper left', fontsize=11)
ax.grid(True, alpha=0.3, linestyle='--')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Anotar el pico máximo
max_idx = ventas_2025.index(max(ventas_2025))
ax.annotate(f'Pico: {ventas_2025[max_idx]}',
            xy=(max_idx, ventas_2025[max_idx]),
            xytext=(max_idx - 2, ventas_2025[max_idx] + 15),
            arrowprops=dict(arrowstyle='->', color='black'),
            fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig('ventas_lineas.png', dpi=150, bbox_inches='tight')
plt.show()`,
        },
      },
    ],
  },
  youDo: {
    title: 'Add Visuals to Your Netflix EDA — Tu primera pieza de portafolio visual',
    context:
      'Extiende el proyecto de la Sección 7 (Netflix EDA) con visualizaciones profesionales. Vas a crear 4 gráficos estáticos (PNG) y 1 interactivo (HTML). Estos van a tu GitHub como parte de tu portafolio. Un buen reporte visual es lo que diferencia un analista junior de uno mid-level a ojos de un reclutador.',
    objectives: [
      'Crear figura 4-paneles: línea, barras, pie, countplot',
      'Generar heatmap de correlación con seaborn',
      'Construir timeline interactivo con plotly',
      'Guardar todos en carpeta /visuals',
      'Escribir README con 5 insights y gráficos embebidos',
    ],
    requirements: [
      'Figura 4 paneles con matplotlib + seaborn (PNG)',
      'Heatmap de correlación con seaborn (PNG)',
      'Timeline plotly interactivo (HTML)',
      'Carpeta /visuals organizada',
      'README.md con insights + imágenes embebidas',
      'Estilo consistente (paleta, fonts)',
    ],
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from pathlib import Path

def cargar_datos(ruta="netflix_clean.csv"):
    # DEFECT: incomplete on purpose
    # wrong stub: returns None
    return None

def crear_4panel(df):
    """Crea figura 4 paneles: línea, barras, pie, countplot."""
    # DEFECT: only one subplot; missing line/bar/pie/count
    fig, ax = plt.subplots()
    return fig

def crear_heatmap(df):
    """Crea heatmap de correlación."""
    # DEFECT: incomplete on purpose
    # wrong stub: returns None
    return None

def crear_timeline_interactivo(df):
    """Crea timeline plotly y guarda HTML."""
    # DEFECT: incomplete on purpose
    # wrong stub: returns None
    return None

def main():
    # Pipeline de visualización
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'En tu README, embebe las imágenes con `![4-panel](visuals/netflix_4panel.png)`. Esto hace que el repo se vea profesional en GitHub. Los reclutadores ven el README antes de leer el código — imágenes pulidas generan buena primera impresión.',
    rubric: [
      { criterion: '4-panel figura con tipos distintos de gráfico', weight: '25%' },
      { criterion: 'Heatmap de correlación bien formateado', weight: '20%' },
      { criterion: 'Plotly interactivo funcional (HTML abre)', weight: '20%' },
      { criterion: 'Estilo consistente (paleta, fonts, spines)', weight: '15%' },
      { criterion: 'README con insights + imágenes embebidas', weight: '10%' },
      { criterion: 'Carpeta /visuals organizada', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la API recomendada de matplotlib para gráficos serios?',
        options: [
          'plt.plot() directo',
          'Object-oriented: fig, ax = plt.subplots()',
          'sns.set_theme() y luego plt.plot()',
          'Solo plotly, matplotlib está obsoleto',
        ],
        correctIndex: 1,
        explanation:
          'La API object-oriented (fig, ax) da control total sobre cada elemento del gráfico. plt.plot() directo funciona para casos simples pero se vuelve confuso con subplots o customización avanzada.',
      },
      {
        question: '¿Para qué sirve `plt.tight_layout()`?',
        options: [
          'Hace el gráfico más pequeño',
          'Ajusta automáticamente espaciado para evitar overlaps',
          'Cambia el tema del gráfico',
          'Es lo mismo que plt.show()',
        ],
        correctIndex: 1,
        explanation:
          'tight_layout() recalcula márgenes y espaciado para que títulos, labels y leyendas no se superpongan. Siempre úsalo antes de savefig. Es el fix #1 para "mi gráfico se ve apretado".',
      },
      {
        question: '¿Cuándo usar seaborn en vez de matplotlib?',
        options: [
          'Siempre, seaborn es mejor',
          'Para gráficos estadísticos (box, violin, heatmap, pairplot)',
          'Solo para gráficos interactivos',
          'Solo si matplotlib no funciona',
        ],
        correctIndex: 1,
        explanation:
          'seaborn brilla en gráficos estadísticos donde matplotlib requiere mucho código. Para gráficos básicos o customización muy fina, matplotlib directo es mejor. La combinación de ambos es estándar.',
      },
      {
        question: '¿Cómo guardas un gráfico plotly para web?',
        options: [
          'plt.savefig("archivo.png")',
          'fig.write_html("archivo.html")',
          'fig.save("archivo.svg")',
          'No se puede, plotly es solo interactivo',
        ],
        correctIndex: 1,
        explanation:
          'plotly exporta a HTML con fig.write_html(). El archivo resultante incluye la gráfica + JS necesario, se abre en cualquier browser. También puede exportar PNG con fig.write_image() pero requiere kaleido.',
      },
      {
        question: '¿Qué hace `sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)`?',
        options: [
          'Crea un mapa de calor con anotaciones, colormap rojo-azul centrado en 0',
          'Calcula correlaciones y las grafica',
          'Filtra valores por encima de 0',
          'Es lo mismo que plt.imshow()',
        ],
        correctIndex: 0,
        explanation:
          'annot=True muestra los valores numéricos en cada celda. cmap="coolwarm" usa rojo para valores altos, azul para bajos. center=0 hace que 0 sea el punto medio del colormap — crucial para que correlaciones positivas y negativas se vean balanceadas.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'matplotlib — Official tutorials', url: 'https://matplotlib.org/stable/tutorials/index.html', note: 'Tutoriales oficiales completos' },
      { label: 'seaborn — Gallery', url: 'https://seaborn.pydata.org/examples/index.html', note: 'Galería con código para cada gráfico' },
      { label: 'plotly — Python docs', url: 'https://plotly.com/python/', note: 'Documentación con cientos de ejemplos' },
      { label: 'Python Graph Gallery', url: 'https://python-graph-gallery.com/', note: 'Inspiración + código para cualquier tipo de gráfico' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre visualización con matplotlib y seaborn.' },
    ],
    courses: [
      { label: 'Kaggle Learn — Data Visualization', url: 'https://www.kaggle.com/learn/data-visualization', note: 'Micro-curso gratuito de seaborn' },
    ],
  },
}
