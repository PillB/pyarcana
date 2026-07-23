import type { CourseSection } from '../../types'

export const section19: CourseSection = {
  id: "databases-orm",
  index: 19,
  title: "Visualización y comunicación accesible",
  shortTitle: "Viz accesible",
  tagline: "cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "Database",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En equipos de analytics y reporting en Perú, una **visualización accesible y honesta** es el puente entre EDA y decisiones. Esta sección (id `databases-orm` conservado) retematiza a V3 **Visualización y comunicación accesible** para el incremento **CP-N2-B (dashboard)** con Matplotlib y tablas alternativas.",
  learningOutcomes: [
    { text: "Elegir charts por pregunta y audiencia" },
    { text: "Diseñar ejes, escalas y encodings honestos" },
    { text: "Producir figuras Matplotlib (estilo Seaborn opcional)" },
    { text: "Anotar y exportar de forma reproducible" },
    { text: "Construir vistas interactivas lógicas (filtros/tooltips simulados)" },
    { text: "Proveer alternativas accesibles y cuidar performance" },
    { text: "Documentar unidades, fuente y limitaciones" },
    { text: "Aplicar contraste, alt text y no sobreclaim" },
  ],
  theory: [
    {
      heading: "De “Bases de Datos y ORMs” a visualización accesible (mapa)",
      paragraphs: [
        "En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id `databases-orm` se conserva, pero el estudiante construye **visualización y comunicación accesible** para el dashboard ejecutivo de CP-N2-B: chart choice honesto, encodings, Matplotlib/Seaborn, modelo de filtros/tooltips y a11y sin sobreclaim.",
        "Hilo conductor: figuras sintéticas de KPIs regionales (Lima/Cusco/Arequipa, PEN, n por barra) que alimentarán el reporting factory (S20–S21). Una sola idea principal por chart; metadata de pregunta, audiencia y limitaciones va con cada figura.",
        "Orden: **T1 Intención** (pregunta/audiencia/chart + ejes honestos) → **T2 Estático** (Matplotlib/Seaborn, composición, export) → **T3 Interactivo/a11y** (spec de filtros/tooltips, tabla alternativa) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). Progressive disclosure: sin ORM ni SQL nuevos.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de ORM/DB de este archivo **no es el camino V3 en S19**. Target: viz accesible para CP-N2-B (dashboard).",
      },
    },
    {
      heading: "pregunta, audiencia y chart choice",
      subtopicId: "S19-T1-A",
      paragraphs: [
        "El **chart choice** responde a la pregunta, no a la librería de moda. Comparar totales entre 3 regiones → barras; tendencia temporal → línea; relación dos cuantitativas → scatter. Documenta en metadata: pregunta, chart_type, audiencia (ejecutivo vs analista).",
        "Contrato: una idea principal por figura. Si hay dos preguntas, dos charts. El dict de especificación (`pregunta`, `audiencia`, `chart`) viaja con el PNG hacia el informe S21 para no perder el “por qué este gráfico”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso sintético Perú: “totales por región para comité” → bar; “tendencia de tickets web semanal” → line. Función `elige_chart(pregunta)` es un gate didáctico, no un clasificador ML: reglas legibles y testeables en weDo. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "chart_choice.py",
        code: `spec = {
    "pregunta": "¿Qué región tiene mayor ticket mediano?",
    "audiencia": "ejecutivo",
    "chart": "bar_horizontal",
    "evita": "pie_3d",
}
print(spec)
print("ok", spec["chart"] != "pie_3d")`,
        output: `{'pregunta': '¿Qué región tiene mayor ticket mediano?', 'audiencia': 'ejecutivo', 'chart': 'bar_horizontal', 'evita': 'pie_3d'}
ok True`,
      },
      callout: {
        type: "tip",
        title: "Una pregunta → un chart",
        content:
          "Si necesitas un párrafo para explicar el encoding, simplifica el chart.",
      },
    },
    {
      heading: "ejes, escalas y encodings honestos",
      subtopicId: "S19-T1-B",
      paragraphs: [
        "Ejes de **magnitudes absolutas en barras** deben incluir cero salvo justificación explícita; recortar el eje infla diferencias y engaña al comité. Encodings: posición > longitud > color > forma; dual-axis engaña con frecuencia. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato: `ylim` bottom=0 en barras de PEN; etiqueta de unidades en el eje; escala log solo con leyenda explícita y justificación de órdenes de magnitud. Si usas color, no es el único canal para categorías críticas. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: valores 50 vs 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. El ejercicio de “inflación visual” entrena el ojo antes de exportar al dashboard de CP-N2-B. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "honest_axes.py",
        code: `vals = {"Lima": 100, "Cusco": 90}
# encoding deshonesto: baseline 85
span_honesto = max(vals.values()) - 0
span_truco = max(vals.values()) - 85
print("ratio_visual_truco", round((100-90)/span_truco, 2))
print("ratio_visual_honesto", round((100-90)/span_honesto, 2))
print("recomendacion", "baseline_0_en_barras")`,
        output: `ratio_visual_truco 0.67
ratio_visual_honesto 0.1
recomendacion baseline_0_en_barras`,
      },
      callout: {
        type: "danger",
        title: "Eje recortado",
        content:
          "Un eje Y que empieza cerca del mínimo infla diferencias percibidas.",
      },
    },
    {
      heading: "Matplotlib / Seaborn",
      subtopicId: "S19-T2-A",
      paragraphs: [
        "Matplotlib/Seaborn construyen la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el slice está filtrado. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de export: `bbox_inches='tight'`, dpi documentado (p. ej. 120), nombre versionado. En demos del curso a veces solo imprimimos metadatos sin binario; en local guardas PNG/SVG según audiencia (slides vs impresión). En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: bar de dos regiones con `ylabel='PEN'` y `ylim(0, …)`. Verifica `get_ylim()[0]==0` y `get_ylabel()` en tests — el grader de weDo usa esos contratos, no “se ve bien en mi monitor”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "mpl_bar.py",
        code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5, 3))
ax.bar(["Lima", "Cusco"], [28.0, 22.5], color="#1f4e79")
ax.set_ylabel("Ticket mediano (PEN)")
ax.set_title("Ticket mediano por región (sintético)")
ax.set_ylim(0, 35)
meta = {"axes": 1, "ylabel": ax.get_ylabel(), "ylim": ax.get_ylim()}
plt.close(fig)
print(meta)`,
        output: `{'axes': 1, 'ylabel': 'Ticket mediano (PEN)', 'ylim': (np.float64(0.0), np.float64(35.0))}`,
      },
      callout: {
        type: "tip",
        title: "Backend Agg",
        content:
          "En servidores y CI usa Agg; no dependas de display interactivo.",
      },
    },
    {
      heading: "composición, annotations y exportación",
      subtopicId: "S19-T2-B",
      paragraphs: [
        "Multi-panel (`subplots`) alinea comparaciones (Vol vs Med). Anota valores clave con `bar_label` o `annotate` sin saturar. Export: PNG para slides, SVG/PDF para impresión; nombre `fig_cpn2b_v{version}.png`. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de reproducibilidad: seed de datos + función `build_figure()` sin estado global sucio. Misma entrada → mismos títulos de paneles y mismos n en captions. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso sintético: 1×2 subplots títulos “Vol” y “Med”; meta de export `{fmt:'png', dpi:120, panels:2}`. El dashboard empaqueta estas figuras con la tabla de paridad (mismos números). En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "compose_export.py",
        code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(7, 3))
axes[0].bar(["A", "B"], [3, 4])
axes[0].set_title("Volumen")
axes[1].plot([1, 2, 3], [10, 12, 11])
axes[1].set_title("Tendencia")
for ax in axes:
    ax.set_ylim(bottom=0)
# simular export metadata
export = {"fmt": "png", "dpi": 120, "panels": 2, "name": "fig_s19_v1.png"}
plt.close(fig)
print(export)`,
        output: `{'fmt': 'png', 'dpi': 120, 'panels': 2, 'name': 'fig_s19_v1.png'}`,
      },
      callout: {
        type: "tip",
        title: "Función pura de figura",
        content:
          "build_figure(df) -> fig facilita tests y re-render del dashboard.",
      },
    },
    {
      heading: "Plotly / filtros / tooltips (modelo de datos)",
      subtopicId: "S19-T3-A",
      paragraphs: [
        "En entornos sin Plotly instalado, modelamos la **vista interactiva** como especificación: campos filtrables, tooltip template y viewport. Tooltips deben mostrar unidades y n, no solo el valor “bonito”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato: al filtrar por región, el texto de conclusión del viewport se **recalcula**; no reutilices el párrafo global de “Lima lidera” si el filtro es Cusco. Serializa el state (JSON) para audit del dashboard. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: row `{region:'Lima', median:28, n:40}` → tooltip `Lima: 28 PEN (n=40)`. Parity chart↔tabla: si la barra dice 1, la fila de tabla dice 1; si no, el gate de integridad falla. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "interactive_spec.py",
        code: `rows = [
    {"region": "Lima", "monto": 28.0, "n": 40},
    {"region": "Cusco", "monto": 22.5, "n": 32},
    {"region": "Arequipa", "monto": 24.0, "n": 28},
]
filtro = "Lima"
vista = [r for r in rows if r["region"] == filtro]
tooltip = {**vista[0], "unidad": "PEN", "nota": "sintético"}
print("filtro", filtro)
print("tooltip", tooltip)`,
        output: `filtro Lima
tooltip {'region': 'Lima', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}`,
      },
      callout: {
        type: "info",
        title: "Spec antes de librería",
        content:
          "Si el modelo de tooltip/filtro es claro, migrar a Plotly/Streamlit es mecánico.",
      },
    },
    {
      heading: "estado, performance y alternativas accesibles",
      subtopicId: "S19-T3-B",
      paragraphs: [
        "El **estado** del dashboard (filtros activos) debe ser serializable (`json.dumps`). Evita recalcular todo el universo en cada hover; limita puntos en scatter (sample o aggregate) y documenta si hay sampling. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato a11y: alternativa accesible = tabla ordenable + resumen textual con **los mismos números** que el chart. Sin tabla hermana, el gráfico no entra solo al portfolio ejecutivo. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: `filtro_region=Lima` → state JSON compacto; `alt_text` une `region:v` con `; `. Performance: documenta “sample 5k de 50k” si aplica — nunca ocultes el sesgo muestral del viewport. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "a11y_alt.py",
        code: `state = {"filtro_region": "Lima", "metric": "median"}
chart_value = 28.0
alt_table = [{"region": "Lima", "ticket_mediano_pen": 28.0, "n": 40}]
alt_text = f"En {alt_table[0]['region']}, ticket mediano {alt_table[0]['ticket_mediano_pen']} PEN (n={alt_table[0]['n']})."
print(state)
print(alt_text)
print("match", chart_value == alt_table[0]["ticket_mediano_pen"])`,
        output: `{'filtro_region': 'Lima', 'metric': 'median'}
En Lima, ticket mediano 28.0 PEN (n=40).
match True`,
      },
      callout: {
        type: "success",
        title: "Paridad numérica",
        content:
          "La alternativa no visual debe coincidir con el chart a la misma precisión publicada.",
      },
    },
    {
      heading: "unidades, fuente y limitaciones",
      subtopicId: "S19-T4-A",
      paragraphs: [
        "Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`. Sin fuente, el gráfico **no entra** al portfolio de CP-N2-B. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de caption: dict con claves `unidad`, `fuente`, `limitacion` (y n cuando aplique). Función `pie(cap)` une con ` | ` para el footer estable entre dashboard e informe. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso sintético: unidad PEN, fuente `sintetico`, limitación “solo canal web”. El mismo pie viaja a S21 para que el DOCX no invente otra fuente. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "caption.py",
        code: `caption = {
    "unidad": "PEN",
    "fuente": "dataset sintético curso",
    "corte": "2024-06-30",
    "n": 100,
    "limitacion": "solo canal web; no generalizar a tienda",
}
print(" | ".join(f"{k}: {v}" for k, v in caption.items()))`,
        output: `unidad: PEN | fuente: dataset sintético curso | corte: 2024-06-30 | n: 100 | limitacion: solo canal web; no generalizar a tienda`,
      },
      callout: {
        type: "warning",
        title: "Unidad omitida",
        content:
          "“28” sin PEN o sin % es un defecto de reporting.",
      },
    },
    {
      heading: "color, contraste, texto alternativo y no sobreclaim",
      subtopicId: "S19-T4-B",
      paragraphs: [
        "Contraste suficiente texto/fondo; no uses **solo color** para categorías críticas — añade patrón, etiqueta o posición. **Alt text** describe el hallazgo principal y n, no “imagen de barras”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de claims: “Lima lidera en la **muestra** web” es permitido; “Lima es la mejor región del Perú” sin marco poblacional es **RECHAZADO**. `classify_claim` es el gate didáctico del weDo. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: alt `Lima 28 PEN n=40` debe contener `n=`; claim con “del Perú” sin “muestra” → RECHAZADO. Cierra el loop ético del dashboard antes del reporting factory. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "alt_claim.py",
        code: `alt = (
    "Barras del ticket mediano sintético: Lima 28 PEN (n=40), "
    "Arequipa 24 (n=28), Cusco 22.5 (n=32). Eje Y desde 0."
)
claim_ok = "En la muestra web sintética, Lima muestra el ticket mediano más alto."
claim_bad = "Lima es la región más rentable del Perú."
print("alt_len", len(alt))
print("usa_claim_ok", True)
print("evita", claim_bad[:20] + "...")`,
        output: `alt_len 110
usa_claim_ok True
evita Lima es la región má...`,
      },
      callout: {
        type: "danger",
        title: "Sobreclaim",
        content:
          "El lenguaje del título no puede exceder la evidencia del EDA (S18).",
      },
    },
  ],
  iDo: {
    intro: "Te muestro cómo diseñar charts honestos, exportables y con alternativa accesible para el dashboard CP-N2-B.",
    steps: [
      {
        demoId: "S19-T1-A-DEMO",
        subtopicId: "S19-T1-A",
        environment: "local-python",
        description: "Elegir chart alineado a pregunta ejecutiva de comparación regional",
        code: {
          language: 'python',
          title: "demo_chart_choice.py",
          code: `pregunta = "Comparar ticket mediano entre regiones"
audiencia = "VP de operaciones"
candidates = ["bar", "line", "pie_3d", "scatter"]
score = {"bar": 3, "line": 1, "pie_3d": 0, "scatter": 1}
best = max(candidates, key=lambda c: score[c])
print({"pregunta": pregunta, "audiencia": audiencia, "chart": best})
print("rechaza_pie_3d", score["pie_3d"] == 0)`,
          output: `{'pregunta': 'Comparar ticket mediano entre regiones', 'audiencia': 'VP de operaciones', 'chart': 'bar'}
rechaza_pie_3d True`,
        },
        why: "La elección de chart se documenta como decisión de diseño, no estética.",
      },
      {
        demoId: "S19-T1-B-DEMO",
        subtopicId: "S19-T1-B",
        environment: "local-python",
        description: "Cuantificar distorsión de un eje Y recortado en barras",
        code: {
          language: 'python',
          title: "demo_axes.py",
          code: `a, b = 100.0, 92.0
# honesto baseline 0
perc_h = (a - b) / a
# truco baseline 90
perc_t = (a - b) / (a - 90)
print("diff_abs", a - b)
print("fraccion_altura_honesta", round(perc_h, 3))
print("fraccion_altura_truco", round(perc_t, 3))
print("factor_inflacion", round(perc_t / perc_h, 2))`,
          output: `diff_abs 8.0
fraccion_altura_honesta 0.08
fraccion_altura_truco 0.8
factor_inflacion 10.0`,
        },
        why: "Mostrar el factor de inflación educa sobre encodings deshonestos.",
      },
      {
        demoId: "S19-T2-A-DEMO",
        subtopicId: "S19-T2-A",
        environment: "local-python",
        description: "Componer barra Matplotlib con ylim desde 0 y etiqueta de unidad",
        code: {
          language: 'python',
          title: "demo_mpl.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

reg = ["Lima", "Arequipa", "Cusco"]
val = [28.0, 24.0, 22.5]
fig, ax = plt.subplots()
bars = ax.bar(reg, val, color="#2c5282")
ax.set_ylabel("PEN")
ax.set_title("Ticket mediano (sintético)")
ax.set_ylim(0, max(val) * 1.2)
ax.bar_label(bars, fmt="%.1f")
print("ylim0", ax.get_ylim()[0] == 0)
print("ylabel", ax.get_ylabel())
plt.close(fig)`,
          output: `ylim0 True
ylabel PEN`,
        },
        why: "Figura mínima viable para el dashboard estático.",
      },
      {
        demoId: "S19-T2-B-DEMO",
        subtopicId: "S19-T2-B",
        environment: "local-python",
        description: "Anotar y exportar metadata reproducible de figura multi-panel",
        code: {
          language: 'python',
          title: "demo_compose.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, (ax0, ax1) = plt.subplots(1, 2, figsize=(8, 3))
ax0.bar(["Lima", "Cusco"], [40, 32])
ax0.set_title("n por región")
ax0.set_ylim(0, 50)
ax1.barh(["Lima", "Cusco"], [28, 22.5])
ax1.set_title("mediana PEN")
ax1.set_xlim(0, 35)
export = {"file": "cp_n2b_dashboard_v1.png", "dpi": 120, "panels": 2, "seed_data": 19}
plt.close(fig)
print(export)`,
          output: `{'file': 'cp_n2b_dashboard_v1.png', 'dpi': 120, 'panels': 2, 'seed_data': 19}`,
        },
        why: "Composición + nombre versionado habilita re-render del portfolio.",
      },
      {
        demoId: "S19-T3-A-DEMO",
        subtopicId: "S19-T3-A",
        environment: "local-python",
        description: "Vista interactiva lógica con filtro y tooltip honesto",
        code: {
          language: 'python',
          title: "demo_tooltip.py",
          code: `data = [
    {"region": "Lima", "median": 28.0, "n": 40},
    {"region": "Cusco", "median": 22.5, "n": 32},
]
def view(region):
    row = next(r for r in data if r["region"] == region)
    return {
        "tooltip": f"{row['region']}: {row['median']} PEN (n={row['n']})",
        "filtro": region,
        "unidad": "PEN",
    }
print(view("Lima"))
print(view("Cusco")["tooltip"])`,
          output: `{'tooltip': 'Lima: 28.0 PEN (n=40)', 'filtro': 'Lima', 'unidad': 'PEN'}
Cusco: 22.5 PEN (n=32)`,
        },
        why: "Tooltip con unidad y n evita lecturas superficiales.",
      },
      {
        demoId: "S19-T3-B-DEMO",
        subtopicId: "S19-T3-B",
        environment: "local-python",
        description: "Ofrecer alternativa tabular/textual con paridad al chart",
        code: {
          language: 'python',
          title: "demo_a11y.py",
          code: `chart = {"Lima": 28.0, "Cusco": 22.5}
table = [{"region": k, "ticket_mediano_pen": v} for k, v in chart.items()]
text = "; ".join(f"{r['region']}={r['ticket_mediano_pen']} PEN" for r in table)
print(table)
print(text)
print("parity", all(chart[r["region"]] == r["ticket_mediano_pen"] for r in table))`,
          output: `[{'region': 'Lima', 'ticket_mediano_pen': 28.0}, {'region': 'Cusco', 'ticket_mediano_pen': 22.5}]
Lima=28.0 PEN; Cusco=22.5 PEN
parity True`,
        },
        why: "La versión no visual es requisito del gate de dashboard accesible.",
      },
      {
        demoId: "S19-T4-A-DEMO",
        subtopicId: "S19-T4-A",
        environment: "local-python",
        description: "Etiquetar unidades, fuente y limitaciones en caption estructurado",
        code: {
          language: 'python',
          title: "demo_caption.py",
          code: `cap = {
    "titulo": "Ticket mediano por región",
    "unidad": "PEN",
    "fuente": "sintético CP-N2-B",
    "corte": "2024-06-30",
    "limitacion": "canal web; n bajo en Cusco",
}
print("pie", f"Unidad: {cap['unidad']} | Fuente: {cap['fuente']} | Corte: {cap['corte']} | Límite: {cap['limitacion']}")`,
          output: `pie Unidad: PEN | Fuente: sintético CP-N2-B | Corte: 2024-06-30 | Límite: canal web; n bajo en Cusco`,
        },
        why: "Caption completo es parte del entregable, no un extra.",
      },
      {
        demoId: "S19-T4-B-DEMO",
        subtopicId: "S19-T4-B",
        environment: "local-python",
        description: "Validar alt text y rechazar sobreclaim causal/nacional",
        code: {
          language: 'python',
          title: "demo_claims.py",
          code: `alt = "Barras: Lima 28 PEN, Arequipa 24, Cusco 22.5; muestra web sintética n=100."
claims = [
    ("Lima lidera el ticket mediano en la muestra web", True),
    ("Lima es la mejor región del Perú", False),
]
for c, ok in claims:
    print(c[:40], "=>", "PERMITIDO" if ok else "RECHAZADO")
print("alt_words", len(alt.split()))`,
          output: `Lima lidera el ticket mediano en la mues => PERMITIDO
Lima es la mejor región del Perú => RECHAZADO
alt_words 12`,
        },
        why: "Contraste de claims entrena el lenguaje del dashboard.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de elección de chart, ejes, Matplotlib, tooltips lógicos, a11y y claims.",
    steps: [
      {
        id: "S19-T1-A-E1",
        subtopicId: "S19-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: chart choice para comparación regional. Fixture `S19-T1-A-E1` / datos sintéticos: pregunta = \"comparar regiones\"; chart = \"bar\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `bar`.",
        hint: "Asigna chart='bar'.",
        hints: [
          "Asigna chart='bar'.",
          "print el valor.",
        ],
        edgeCases: ["serie temporal mal clasificada"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
pregunta = "comparar regiones"
chart = "bar"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(chart)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pregunta = "comparar regiones"
chart = "bar"
print(chart)`,
          output: `bar`,
        },
      },
      {
        id: "S19-T1-A-E2",
        subtopicId: "S19-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: metadata pregunta/audiencia/chart. Fixture `S19-T1-A-E2` / datos sintéticos: print({\"pregunta\": \"totales por región\", \"audiencia\": \"ejecutivo\", \"chart\": \"bar\"}). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'pregunta': 'totales por región', 'audiencia': 'ejecutivo', 'chart': 'bar'}`.",
        hint: "Incluye las 3 claves.",
        hints: [
          "Incluye las 3 claves.",
          "chart bar.",
        ],
        edgeCases: ["audiencia técnica puede preferir table"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"pregunta": "totales por región", "audiencia": "ejecutivo", "chart": "bar"})
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"pregunta": "totales por región", "audiencia": "ejecutivo", "chart": "bar"})`,
          output: `{'pregunta': 'totales por región', 'audiencia': 'ejecutivo', 'chart': 'bar'}`,
        },
      },
      {
        id: "S19-T1-A-E3",
        subtopicId: "S19-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: elige_chart por keyword tendencia. Fixture `S19-T1-A-E3` / datos sintéticos: def elige_chart(pregunta):; return \"line\" if \"tendencia\" in pregunta.lower() else \"bar\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `line | bar`.",
        hint: "in para substring.",
        hints: [
          "in para substring.",
          "Dos prints.",
        ],
        edgeCases: ["mayúsculas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def elige_chart(pregunta):
    return "line" if "tendencia" in pregunta.lower() else "bar"
print(elige_chart("tendencia mensual"))
print(elige_chart("comparar regiones"))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def elige_chart(pregunta):
    return "line" if "tendencia" in pregunta.lower() else "bar"
print(elige_chart("tendencia mensual"))
print(elige_chart("comparar regiones"))`,
          output: `line
bar`,
        },
      },
      {
        id: "S19-T1-B-E1",
        subtopicId: "S19-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: inflación visual por baseline recortado. Fixture `S19-T1-B-E1` / datos sintéticos: truco = (50 - 45) / (50 - 40); hon = (50 - 45) / 50. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `factor 5.0`.",
        hint: "altura_truco=(50-45)/(50-40); altura_h=(50-45)/50.",
        hints: [
          "altura_truco=(50-45)/(50-40); altura_h=(50-45)/50.",
          "factor = truco/honesto.",
        ],
        edgeCases: ["baseline > min"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
truco = (50 - 45) / (50 - 40)
hon = (50 - 45) / 50
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("factor", round(truco / hon, 2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `truco = (50 - 45) / (50 - 40)
hon = (50 - 45) / 50
print("factor", round(truco / hon, 2))`,
          output: `factor 5.0`,
        },
      },
      {
        id: "S19-T1-B-E2",
        subtopicId: "S19-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: gate ylim_bottom==0 (honesto/revisar). Fixture `S19-T1-B-E2` / datos sintéticos: ylim_bottom = 0; print(\"honesto\" if ylim_bottom == 0 else \"revisar\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `honesto`.",
        hint: "Variable ylim_bottom=0.",
        hints: [
          "Variable ylim_bottom=0.",
          "print condicional.",
        ],
        edgeCases: ["líneas de índice pueden no empezar en 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
ylim_bottom = 0
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("honesto" if ylim_bottom == 0 else "revisar")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ylim_bottom = 0
print("honesto" if ylim_bottom == 0 else "revisar")`,
          output: `honesto`,
        },
      },
      {
        id: "S19-T1-B-E3",
        subtopicId: "S19-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: riesgo de dual_axis vs position. Fixture `S19-T1-B-E3` / datos sintéticos: encoding = \"dual_axis\"; print(\"riesgo_alto\" if encoding == \"dual_axis\" else \"ok\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `riesgo_alto`.",
        hint: "if/elif.",
        hints: [
          "if/elif.",
          "Prueba dual_axis.",
        ],
        edgeCases: ["color-only"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
encoding = "dual_axis"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("riesgo_alto" if encoding == "dual_axis" else "ok")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `encoding = "dual_axis"
print("riesgo_alto" if encoding == "dual_axis" else "ok")`,
          output: `riesgo_alto`,
        },
      },
      {
        id: "S19-T2-A-E1",
        subtopicId: "S19-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: bar chart con ylim desde 0. Fixture `S19-T2-A-E1` / datos sintéticos: matplotlib.use(\"Agg\"); fig, ax = plt.subplots(). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
        hint: "matplotlib Agg.",
        hints: [
          "matplotlib Agg.",
          "plt.close.",
        ],
        edgeCases: ["olvidar close"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["a", "b"], [1, 2])
ax.set_ylim(0, 3)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["a", "b"], [1, 2])
ax.set_ylim(0, 3)
print(ax.get_ylim()[0] == 0)
plt.close(fig)`,
          output: `True`,
        },
      },
      {
        id: "S19-T2-A-E2",
        subtopicId: "S19-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: ylabel de unidades PEN. Fixture `S19-T2-A-E2` / datos sintéticos: matplotlib.use(\"Agg\"); fig, ax = plt.subplots(). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `PEN`.",
        hint: "set_ylabel.",
        hints: [
          "set_ylabel.",
          "Agg backend.",
        ],
        edgeCases: ["ylabel vacío"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.set_ylabel("PEN")
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.set_ylabel("PEN")
print(ax.get_ylabel())
plt.close(fig)`,
          output: `PEN`,
        },
      },
      {
        id: "S19-T2-A-E3",
        subtopicId: "S19-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: meta_bar n_bars y ylim0. Fixture `S19-T2-A-E3` / datos sintéticos: matplotlib.use(\"Agg\"); def meta_bar(labels, values):. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'n_bars': 2, 'ylim0': np.float64(0.0)}`.",
        hint: "len(values).",
        hints: [
          "len(values).",
          "set_ylim(0, max*1.2).",
        ],
        edgeCases: ["values vacíos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def meta_bar(labels, values):
    fig, ax = plt.subplots()
    ax.bar(labels, values)
    ax.set_ylim(0, max(values) * 1.2)
    out = {"n_bars": len(values), "ylim0": ax.get_ylim()[0]}
    plt.close(fig)
    return out
print(meta_bar(["A", "B"], [3, 4]))`,
          output: `{'n_bars': 2, 'ylim0': np.float64(0.0)}`,
        },
      },
      {
        id: "S19-T2-B-E1",
        subtopicId: "S19-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: export dict fmt/dpi/panels. Fixture `S19-T2-B-E1` / datos sintéticos: print({\"fmt\": \"png\", \"dpi\": 120, \"panels\": 2}). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'fmt': 'png', 'dpi': 120, 'panels': 2}`.",
        hint: "Dict literal.",
        hints: [
          "Dict literal.",
          "print.",
        ],
        edgeCases: ["dpi 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print({"fmt": "png", "dpi": 120, "panels": 2})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"fmt": "png", "dpi": 120, "panels": 2})`,
          output: `{'fmt': 'png', 'dpi': 120, 'panels': 2}`,
        },
      },
      {
        id: "S19-T2-B-E2",
        subtopicId: "S19-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: nombre versionado de figura. Fixture `S19-T2-B-E2` / datos sintéticos: version = 3; print(f\"fig_cpn2b_v{version}.png\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `fig_cpn2b_v3.png`.",
        hint: "f-string.",
        hints: [
          "f-string.",
          "print nombre.",
        ],
        edgeCases: ["version string"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
version = 3
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(f"fig_cpn2b_v{version}.png")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `version = 3
print(f"fig_cpn2b_v{version}.png")`,
          output: `fig_cpn2b_v3.png`,
        },
      },
      {
        id: "S19-T2-B-E3",
        subtopicId: "S19-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: subplots 1×2 con títulos. Fixture `S19-T2-B-E3` / datos sintéticos: matplotlib.use(\"Agg\"); fig, axes = plt.subplots(1, 2). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Vol', 'Med']`.",
        hint: "ax.get_title().",
        hints: [
          "ax.get_title().",
          "close fig.",
        ],
        edgeCases: ["orientación 2x1"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
axes[0].set_title("Vol")
axes[1].set_title("Med")
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
axes[0].set_title("Vol")
axes[1].set_title("Med")
print([ax.get_title() for ax in axes])
plt.close(fig)`,
          output: `['Vol', 'Med']`,
        },
      },
      {
        id: "S19-T3-A-E1",
        subtopicId: "S19-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: filtro de rows por región. Fixture `S19-T3-A-E1` / datos sintéticos: rows = [{\"region\": \"Lima\", \"median\": 28}, {\"region\": \"Cusco\", \"median\": 22}]; print(next(r for r in rows if r[\"region\"] . Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `28`.",
        hint: "list comp o next.",
        hints: [
          "list comp o next.",
          "print valor.",
        ],
        edgeCases: ["sin match"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [{"region": "Lima", "median": 28}, {"region": "Cusco", "median": 22}]
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [{"region": "Lima", "median": 28}, {"region": "Cusco", "median": 22}]
print(next(r for r in rows if r["region"] == "Lima")["median"])`,
          output: `28`,
        },
      },
      {
        id: "S19-T3-A-E2",
        subtopicId: "S19-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: tooltip con unidad y n. Fixture `S19-T3-A-E2` / datos sintéticos: print(f\"Lima: {28} PEN (n={40})\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Lima: 28 PEN (n=40)`.",
        hint: "f-string.",
        hints: [
          "f-string.",
          "print.",
        ],
        edgeCases: ["sin unidad"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(f"Lima: {28} PEN (n={40})")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(f"Lima: {28} PEN (n={40})")`,
          output: `Lima: 28 PEN (n=40)`,
        },
      },
      {
        id: "S19-T3-A-E3",
        subtopicId: "S19-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: función tooltip(row). Fixture `S19-T3-A-E3` / datos sintéticos: def tooltip(row):; return f\"{row['region']}: {row['median']} PEN (n={row['n']})\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Cusco: 22.5 PEN (n=32)`.",
        hint: "Incluye unidad PEN.",
        hints: [
          "Incluye unidad PEN.",
          "Función pura.",
        ],
        edgeCases: ["keys faltantes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def tooltip(row):
    return f"{row['region']}: {row['median']} PEN (n={row['n']})"
print(tooltip({"region": "Cusco", "median": 22.5, "n": 32}))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def tooltip(row):
    return f"{row['region']}: {row['median']} PEN (n={row['n']})"
print(tooltip({"region": "Cusco", "median": 22.5, "n": 32}))`,
          output: `Cusco: 22.5 PEN (n=32)`,
        },
      },
      {
        id: "S19-T3-B-E1",
        subtopicId: "S19-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: parity chart↔tabla. Fixture `S19-T3-B-E1` / datos sintéticos: chart = {\"Lima\": 1}; table = [{\"region\": \"Lima\", \"v\": 1}]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
        hint: "Compara valores.",
        hints: [
          "Compara valores.",
          "print True.",
        ],
        edgeCases: ["float redondeo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
chart = {"Lima": 1}
table = [{"region": "Lima", "v": 1}]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(chart["Lima"] == table[0]["v"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `chart = {"Lima": 1}
table = [{"region": "Lima", "v": 1}]
print(chart["Lima"] == table[0]["v"])`,
          output: `True`,
        },
      },
      {
        id: "S19-T3-B-E2",
        subtopicId: "S19-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: state de filtros serializado JSON. Fixture `S19-T3-B-E2` / datos sintéticos: print(json.dumps({\"filtro_region\": \"Lima\"}, ensure_ascii=False)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{\"filtro_region\": \"Lima\"}`.",
        hint: "import json.",
        hints: [
          "import json.",
          "print.",
        ],
        edgeCases: ["estado no serializable"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import json
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(json.dumps({"filtro_region": "Lima"}, ensure_ascii=False))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import json
print(json.dumps({"filtro_region": "Lima"}, ensure_ascii=False))`,
          output: `{"filtro_region": "Lima"}`,
        },
      },
      {
        id: "S19-T3-B-E3",
        subtopicId: "S19-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: alt_text desde tabla. Fixture `S19-T3-B-E3` / datos sintéticos: table = [{\"region\": \"Lima\", \"v\": 28}, {\"region\": \"Cusco\", \"v\": 22}]; print(\"; \".join(f\"{r['region']}={r['v']} PEN\" for r. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Lima=28 PEN; Cusco=22 PEN`.",
        hint: "join.",
        hints: [
          "join.",
          "Incluye PEN.",
        ],
        edgeCases: ["tabla vacía"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `table = [{"region": "Lima", "v": 28}, {"region": "Cusco", "v": 22}]
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `table = [{"region": "Lima", "v": 28}, {"region": "Cusco", "v": 22}]
print("; ".join(f"{r['region']}={r['v']} PEN" for r in table))`,
          output: `Lima=28 PEN; Cusco=22 PEN`,
        },
      },
      {
        id: "S19-T4-A-E1",
        subtopicId: "S19-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: caption con unidad y fuente. Fixture `S19-T4-A-E1` / datos sintéticos: print(\"unidad=PEN | fuente=sintetico\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `unidad=PEN | fuente=sintetico`.",
        hint: "f-string o dict.",
        hints: [
          "f-string o dict.",
          "Ambas menciones.",
        ],
        edgeCases: ["fuente vacía"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("unidad=PEN | fuente=sintetico")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("unidad=PEN | fuente=sintetico")`,
          output: `unidad=PEN | fuente=sintetico`,
        },
      },
      {
        id: "S19-T4-A-E2",
        subtopicId: "S19-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: validación de claves de caption. Fixture `S19-T4-A-E2` / datos sintéticos: cap = {\"unidad\": \"PEN\", \"fuente\": \"x\", \"limitacion\": \"web\"}; print(set(cap) >= {\"unidad\", \"fuente\", \"limitacion\"}). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
        hint: "set de keys.",
        hints: [
          "set de keys.",
          "issuperset.",
        ],
        edgeCases: ["typo en clave"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `cap = {"unidad": "PEN", "fuente": "x", "limitacion": "web"}
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `cap = {"unidad": "PEN", "fuente": "x", "limitacion": "web"}
print(set(cap) >= {"unidad", "fuente", "limitacion"})`,
          output: `True`,
        },
      },
      {
        id: "S19-T4-A-E3",
        subtopicId: "S19-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: pie de figura unido con |. Fixture `S19-T4-A-E3` / datos sintéticos: def pie(cap):; return \" | \".join(f\"{k}: {v}\" for k, v in cap.items()). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `unidad: PEN | n: 10`.",
        hint: "join items.",
        hints: [
          "join items.",
          "orden de inserción dict.",
        ],
        edgeCases: ["valores None"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def pie(cap):
    return " | ".join(f"{k}: {v}" for k, v in cap.items())
print(pie({"unidad": "PEN", "n": 10}))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def pie(cap):
    return " | ".join(f"{k}: {v}" for k, v in cap.items())
print(pie({"unidad": "PEN", "n": 10}))`,
          output: `unidad: PEN | n: 10`,
        },
      },
      {
        id: "S19-T4-B-E1",
        subtopicId: "S19-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: rechazo de claim sin 'muestra'. Fixture `S19-T4-B-E1` / datos sintéticos: claim = \"Lima es la mejor del Perú\"; print(\"RECHAZADO\" if (\"del Perú\" in claim and \"muestra\" not in claim) else \"OK\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `RECHAZADO`.",
        hint: "in checks.",
        hints: [
          "in checks.",
          "Caso: 'mejor del Perú'.",
        ],
        edgeCases: ["claims legítimos locales"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
claim = "Lima es la mejor del Perú"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("RECHAZADO" if ("del Perú" in claim and "muestra" not in claim) else "OK")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `claim = "Lima es la mejor del Perú"
print("RECHAZADO" if ("del Perú" in claim and "muestra" not in claim) else "OK")`,
          output: `RECHAZADO`,
        },
      },
      {
        id: "S19-T4-B-E2",
        subtopicId: "S19-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: alt text debe mencionar n=. Fixture `S19-T4-B-E2` / datos sintéticos: alt = \"Lima 28 PEN n=40\"; print(\"n=\" in alt or \"n=\" in alt.replace(\"n=\", \"n=\")). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True | True`.",
        hint: "substring.",
        hints: [
          "substring.",
          "alt de ejemplo.",
        ],
        edgeCases: ["n sin valor"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
alt = "Lima 28 PEN n=40"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("n=" in alt or "n=" in alt.replace("n=", "n="))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `alt = "Lima 28 PEN n=40"
print("n=" in alt or "n=" in alt.replace("n=", "n="))
print("n=" in "Lima 28 PEN n=40")`,
          output: `True
True`,
        },
      },
      {
        id: "S19-T4-B-E3",
        subtopicId: "S19-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: classify_claim PERMITIDO/RECHAZADO. Fixture `S19-T4-B-E3` / datos sintéticos: def classify_claim(text):; return \"PERMITIDO\" if \"muestra\" in text else \"RECHAZADO\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `PERMITIDO | RECHAZADO`.",
        hint: "Función binaria simple didáctica.",
        hints: [
          "Función binaria simple didáctica.",
          "Dos prints.",
        ],
        edgeCases: ["falsos positivos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def classify_claim(text):
    return "PERMITIDO" if "muestra" in text else "RECHAZADO"
print(classify_claim("lidera en la muestra web"))
print(classify_claim("es la mejor del país"))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def classify_claim(text):
    return "PERMITIDO" if "muestra" in text else "RECHAZADO"
print(classify_claim("lidera en la muestra web"))
print(classify_claim("es la mejor del país"))`,
          output: `PERMITIDO
RECHAZADO`,
        },
      },
    ],
  },
  youDo: {
    title: "Dashboard accesible CP-N2-B",
    context:
      "Construye el incremento dashboard de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a evidencia y alternativa no visual.",
    objectives: [
      "Elegir charts por pregunta/audiencia",
      "Ejes honestos y unidades visibles",
      "Export versionado + captions",
      "Alt text y sin sobreclaim",
      "Paridad numérica chart/tabla",
    ],
    requirements: [
      "Datos sintéticos únicamente",
      "ylim de barras desde 0 salvo justificación escrita",
      "Caption con fuente y limitación",
      "Alt text por figura",
      "es-PE en títulos y conclusiones",
    ],
    starterCode: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    "region": ["Lima", "Arequipa", "Cusco"],
    "median_pen": [28.0, 24.0, 22.5],
    "n": [40, 28, 32],
})
# TODO: 4 figuras + alt/caption + tabla equivalente
print(df)
`,
    portfolioNote:
      "Dashboard del factory CP-N2-B; se integra con Excel (S20) y reportes (S21).",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Para comparar magnitudes entre categorías, ¿qué chart es usualmente preferible?",
        options: ["Pie 3D", "Dual axis sin escala", "Barras con baseline 0", "Word cloud"],
        correctIndex: 2,
        explanation:
          "Las barras con baseline 0 comunican magnitudes de forma honesta.",
      },
      {
        question: "Una alternativa accesible debe:",
        options: ["Repetir los mismos números clave del chart", "Ser opcional siempre", "Solo ser una imagen más grande", "Eliminar las unidades"],
        correctIndex: 0,
        explanation:
          "Paridad numérica entre chart y tabla/texto.",
      },
      {
        question: "“Lima es la mejor región del Perú” a partir de una muestra web es:",
        options: ["Un claim permitido", "Sobreclaim / generalización indebida", "Un alt text correcto", "Una unidad"],
        correctIndex: 1,
        explanation:
          "El lenguaje no debe exceder la cobertura de la muestra.",
      },
      {
        question: "El caption de un gráfico de portfolio debe incluir:",
        options: ["Solo el color favorito", "La contraseña del BI", "Nada", "Unidad, fuente y limitaciones"],
        correctIndex: 3,
        explanation:
          "Trazabilidad y honestidad metodológica.",
      },

{
  question: "Un gráfico de barras de montos PEN recorta el eje Y para empezar en 40 en lugar de 0. ¿Qué debe hacer el gate de integridad del dashboard CP-N2-B?",
  options: ["Aceptarlo si los colores tienen buen contraste", "Convertirlo automáticamente a dual-axis para “ganar espacio”", "Marcarlo como riesgo de inflación visual y exigir baseline 0 o justificación explícita", "Eliminar las etiquetas de ejes para que se vea más limpio en el slide"],
  correctIndex: 2,
  explanation:
    "Recortar el baseline de barras de magnitudes absolutas infla diferencias. El gate pide ylim 0 o justificación documentada.",
},

    ],
  },
  resources: {
    docs: [
      {
        label: "Matplotlib tutorials",
        url: "https://matplotlib.org/stable/tutorials/index.html",
        note: "Figuras y exportación",
      },
      {
        label: "Data Visualization Society resources",
        url: "https://www.datavisualizationsociety.org/",
        note: "Comunidad y ética viz",
      },
    ],
    books: [
      {
        label: "Fundamentals of Data Visualization (Wilke)",
        note: "Encodings y honestidad visual",
      },
      {
        label: "Storytelling with Data (Knaflic)",
        note: "Audiencia y claridad",
      },
    ],
    courses: [
      {
        label: "Matplotlib cheatsheets",
        url: "https://matplotlib.org/cheatsheets/",
        note: "Referencia rápida",
      },
    ],
  },
}
