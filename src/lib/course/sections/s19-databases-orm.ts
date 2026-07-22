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
        "En V3, **S19 no es el path principal de SQLAlchemy/Postgres avanzado**. Aquí construyes el **dashboard de CP-N2-B**: elección de chart, escalas honestas, figuras exportables, tooltips/filtros conceptuales y alternativas no visuales.",
        "Hilo: dataset sintético de métricas por región (Lima/Arequipa/Cusco). Cada figura tiene **conclusión acotada** y **tabla o texto equivalente**.",
        "Orden: **T1 Diseño** → **T2 Estático** → **T3 Interactivo/a11y** → **T4 Integridad visual**.",
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
        "Empieza por la **pregunta** y la **audiencia** (ejecutivo vs analista). Comparar magnitudes → barras; tendencia temporal → líneas; parte de un todo → cuidado con pie (preferir barras apiladas o tabla).",
        "Una sola idea principal por chart. Si hay dos preguntas, dos charts.",
        "Registra en metadata: pregunta, chart_type, audiencia.",
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
        "Ejes deben incluir **cero** en barras de magnitudes absolutas (salvo justificación). No recortes el eje Y para exagerar diferencias.",
        "Encodings: posición > longitud > color > forma. Dual axis engaña con frecuencia.",
        "Escala log solo con etiqueta explícita y justificación de órdenes de magnitud.",
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
        "Matplotlib es la base reproducible (`Figure`/`Axes`). Seaborn aporta estilos y APIs estadísticas; aquí usamos Matplotlib puro (Agg) para portabilidad.",
        "Siempre: título, etiquetas de ejes, unidades, leyenda si hay series múltiples.",
        "Guarda con `bbox_inches='tight'` y dpi documentado; en demos imprimimos metadatos sin archivo binario obligatorio.",
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
        "Multi-panel (`subplots`) alinea comparaciones. Anota valores clave con `ax.annotate` o `bar_label` sin saturar.",
        "Export: PNG para slides, SVG/PDF para impresión. Nombre de archivo con fecha/versión.",
        "Reproduce con seed de datos y función `build_figure()` sin estado global sucio.",
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
        "En entornos sin Plotly instalado, modelamos la **vista interactiva** como especificación: campos de filtro, payload de tooltip y subset de filas.",
        "Tooltips deben mostrar unidades y n, no solo el valor bonito. Filtros no deben ocultar el sesgo muestral.",
        "La conclusión del viewport filtrado debe recalcularse, no reutilizar el texto global.",
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
        "El **estado** del dashboard (filtros activos) debe ser serializable. Evita recalcular todo el universo en cada hover si n es grande: preagrega.",
        "Alternativa accesible: tabla ordenable + resumen textual con los mismos números que el chart.",
        "Performance: limita puntos en scatter (sample o aggregate); documenta si hay sampling.",
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
        "Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Limitaciones: cobertura, sesgo, n bajo.",
        "Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`.",
        "Sin fuente, el gráfico no entra al portfolio de CP-N2-B.",
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
        "Contraste suficiente (texto/fondo). No uses solo color para codificar categorías críticas: añade patrón o etiqueta.",
        "**Alt text**: describe el hallazgo principal y n, no “imagen de barras”.",
        "No sobreclaim: “Lima lidera en la muestra web” ≠ “Lima es la mejor región del país”.",
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
          "Dada pregunta de comparación entre 3 regiones, imprime chart recomendado 'bar'.",
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
          code: `pregunta = 'comparar regiones'
# TODO
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
          "Devuelve dict pregunta/audiencia/chart para audiencia ejecutivo y comparación de totales.",
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
          code: `# TODO
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
          "Escribe elige_chart(pregunta) que devuelva 'line' si 'tendencia' in pregunta else 'bar'; prueba con dos strings.",
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
          code: `# TODO
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
          "Con valores 50 y 45, imprime inflación visual si baseline=40 vs 0 (ratio de alturas de la diferencia).",
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
          code: `# TODO
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
          "Imprime 'honesto' si ylim_bottom==0 else 'revisar'.",
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
          code: `ylim_bottom = 0
# TODO
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
          "Dado encoding='dual_axis', imprime 'riesgo_alto' ; si 'position', 'ok'.",
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
          code: `encoding = 'dual_axis'
# TODO
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
          "Crea figura bar de [1,2] y verifica get_ylim()[0]==0 tras set_ylim(0,3); imprime True/False.",
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
matplotlib.use('Agg')
import matplotlib.pyplot as plt
# TODO
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
          "Asigna ylabel 'PEN' a un Axes y print get_ylabel().",
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
matplotlib.use('Agg')
import matplotlib.pyplot as plt
# TODO
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
          "Función meta_bar(labels, values) crea bar chart y devuelve dict n_bars y ylim0; print con ['A','B'] [3,4].",
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
matplotlib.use('Agg')
import matplotlib.pyplot as plt
# TODO
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
          "Imprime export dict con fmt png, dpi 120, panels 2.",
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
          code: `# TODO
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
          "Construye nombre fig_cpn2b_v{version}.png para version=3.",
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
          code: `version = 3
# TODO
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
          "Crea 1x2 subplots, set titles Vol y Med, devuelve lista de titles; print.",
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
matplotlib.use('Agg')
import matplotlib.pyplot as plt
# TODO
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
          "Filtra rows por region=='Lima' e imprime el median del primero.",
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
          code: `rows=[{'region':'Lima','median':28},{'region':'Cusco','median':22}]
# TODO
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
          "Arma tooltip string '{region}: {v} PEN (n={n})' con Lima 28 n=40.",
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
          code: `# TODO
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
          "Implementa tooltip(row) y pruébalo con dict region/median/n.",
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
          code: `# TODO
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
          "Dado chart={'Lima':1} y table=[{'region':'Lima','v':1}], imprime parity True si coinciden.",
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
          code: `# TODO
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
          "Serializa state filtro_region=Lima a string JSON compacto (json.dumps).",
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
          code: `import json
# TODO
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
          "Genera alt_text desde table list de dicts region/v; une con '; '.",
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
          code: `table=[{'region':'Lima','v':28},{'region':'Cusco','v':22}]
# TODO
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
          "Imprime caption con unidad PEN y fuente sintetico.",
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
          code: `# TODO
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
          "Valida que caption dict tenga claves unidad, fuente, limitacion; imprime True.",
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
          code: `cap={'unidad':'PEN','fuente':'x','limitacion':'web'}
# TODO
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
          "Función pie(cap) devuelve string unido con ' | ' de items; prueba con 2 claves.",
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
          code: `# TODO
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
          "Si claim contiene 'del Perú' sin 'muestra', imprime RECHAZADO.",
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
          code: `claim = 'Lima es la mejor del Perú'
# TODO
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
          "Alt text debe mencionar 'n='; imprime True si 'n=' in alt.",
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
          code: `alt = 'Lima 28 PEN n=40'
# TODO
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
          "classify_claim(text) -> PERMITIDO si 'muestra' in text else RECHAZADO; prueba 2 textos.",
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
          code: `# TODO
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
