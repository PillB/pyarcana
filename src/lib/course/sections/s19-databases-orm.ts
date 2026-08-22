import type { CourseSection } from '../../types'

export const section19: CourseSection = {
 id: "databases-orm",
 index: 19,
 title: "Visualización y comunicación accesible",
 shortTitle: "Viz accesible",
 tagline: "Cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a la evidencia y versión no visual equivalente.",
 estimatedHours: 19,
 level: "Práctica independiente",
 phase: 1,
 icon: "BarChart3",
 accentColor: "bg-gradient-to-br from-teal-500 to-cyan-700",
 jobRelevance:
 "En equipos de analítica y reportes en Perú (banca, retail, e-commerce, gobierno), una visualización accesible y honesta es el puente entre el EDA y las decisiones de un comité. Un dashboard que infla diferencias con el eje recortado, omite unidades o generaliza «Madrid lidera el Perú» desde una muestra web no es «bonito»: es un riesgo de reporte. Aquí aprendes a hacer charts con ejes honestos, tooltips y filtros modelados como especificación de datos, y alternativas no visuales con los mismos números para quien usa lector de pantalla.",
 learningOutcomes: [
 { text: "Elegir el tipo de chart (bar/line/scatter) según la pregunta analítica y la audiencia (ejecutivo vs. analista), documentando la decisión en un brief de diseño" },
 { text: "Diseñar ejes y encodings honestos: baseline 0 en barras de magnitudes absolutas, unidades visibles y rechazo de dual-axis engañoso sin justificación" },
 { text: "Producir figuras Matplotlib (backend Agg) con contrato visual verificable: ylim, ylabel, n de barras y cierre de figura" },
 { text: "Componer multi-panel, anotar valores clave y exportar PNG versionado con metadata (fmt, dpi, panels)" },
 { text: "Modelar una vista interactiva lógica (filtro + tooltip con unidad y n) como especificación de datos, sin librería interactiva obligatoria" },
 { text: "Proveer alternativa accesible (tabla + alt text) con paridad numérica al chart y declarar sample_n/universe_n si hay sampling" },
 { text: "Redactar captions con unidad, fuente, corte y limitación, y un pie de figura reutilizable hacia informes" },
 { text: "Aplicar canal no-color (hatch/etiqueta), contraste razonable y lenguaje sin sobreclaim (muestra ≠ población)" }
 ],
 theory: [
 {
  heading: "Un gráfico es una decisión sobre qué mirar primero",
 paragraphs: [
   "El EDA de S18 dejó medianas, tamaños de muestra e incertidumbre. Convertirlos en figura no es decorarlos: es elegir qué comparación salta a la vista y cuál queda en segundo plano. Esa elección orienta la conversación del comité antes de que alguien lea una sola cifra.",
   "Por eso el orden correcto empieza fuera del gráfico. Primero la pregunta —qué decisión habilita esta figura—, después la audiencia, y recién entonces el tipo de gráfico. Una gerencia necesita una idea y pocas categorías; un equipo de análisis aguanta más detalle. Elegir el gráfico primero y buscarle la pregunta después produce láminas bonitas que no ayudan a decidir nada.",
   "Hay una decisión técnica con consecuencias éticas directas: dónde empieza el eje. Recortar el eje vertical para que empiece cerca del valor mínimo hace que una diferencia del tres por ciento parezca abismal. El gráfico no miente en los números, miente en la impresión — y la impresión es lo que la gente recuerda. Para comparar magnitudes con barras, el eje arranca en cero.",
   "Todo número mostrado necesita su contexto pegado: unidad, tamaño de muestra y la limitación que ya venía del EDA. Y todo gráfico necesita una alternativa no visual con **los mismos** números, porque quien usa lector de pantalla merece la misma evidencia y no un resumen empobrecido. Si la tabla y la barra no coinciden hasta la precisión publicada, uno de los dos está mal.",
   "La pregunta que atraviesa la sección mantiene la disciplina del EDA: **¿qué afirma esta figura, y hasta dónde llega la evidencia que la respalda?** Un título que generaliza a toda la población desde una muestra web es un sobreclaim, aunque el gráfico sea impecable.",
 ],
 callout: {
 type: "info",
 title: "Fuera de alcance en S19",
 content:
 "No profundizamos en reportes DOCX/PDF aquí (ese es el foco de S21) ni en dashboards con librerías interactivas obligatorias (Plotly/Streamlit). El foco es la elección del gráfico, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.",
 },
},
{
 heading: "Contrato de la sección (referencia)",
 optional: true,
 paragraphs: [
   "Bloque de referencia. Orden de los subtemas, entregable y alcance.",
   "**Orden de los subtemas.** T1 trata la intención: pregunta, audiencia, elección de gráfico y ejes honestos. T2 pasa a lo estático: composición multi-panel y exportación versionada. T3 cubre lo interactivo y la accesibilidad: modelo de filtro, tooltip y paridad. T4 cierra con la narrativa y el control de sobreclaims.",
   "**Entregable.** El tablero ejecutivo CP-N2-B: cuatro gráficos estáticos más una vista interactiva modelada como datos, todos con su conclusión limitada a la evidencia.",
   "**Alcance.** Los informes en DOCX y PDF son el foco de S21, no de aquí, y no se exige ninguna librería interactiva. Lo que se practica es la elección del gráfico, la honestidad de los ejes, la exportación reproducible y la paridad entre figura y tabla.",
   "**Ritmo orientativo.** Unas diecinueve horas.",
 ],
 code: {
 language: 'python',
 title: "s19_map_contract.py",
 code: `def section_contract():
    return {
        "case": "CASO-LIM-019",
        "gates": [
            "chart_by_question",
            "baseline_0_absolute_bars",
            "caption_unidad_fuente_limitacion",
            "chart_table_parity",
            "no_overclaim",
            "alt_with_n",
        ],
        "deliverable": "CP-N2-B_dashboard",
        "static_figures": 4,
        "interactive_spec": True,
        "real_pii_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("deliverable", c["deliverable"])
print("gates", len(c["gates"]))
print("real_pii_ok", c["real_pii_ok"])
`,
 output: `case CASO-LIM-019
deliverable CP-N2-B_dashboard
gates 6
real_pii_ok False`,
 },
},
{
 heading: "Pregunta, audiencia y elección de gráfico",
 subtopicId: "S19-T1-A",
 paragraphs: [
 "La **elección de gráfico** (*chart choice*) responde a la pregunta, no a la librería de moda. Comparar totales o medianas entre pocas regiones → barras; tendencia temporal → línea; relación entre dos cuantitativas → scatter. Documenta en metadata: `pregunta`, `chart_type`, `audiencia` (ejecutivo vs. analista). Un pie 3D casi nunca es la respuesta correcta para un comité.",
 "Contrato operativo: **una idea principal por figura**. Si hay dos preguntas, dos charts. El dict de especificación (`pregunta`, `audiencia`, `chart`) viaja con el PNG hacia el informe S21 para no perder el “por qué este gráfico”. Ordena categorías con intención (alfabético, por magnitud o por prioridad de negocio) y prefiere barras horizontales cuando las etiquetas de región son largas.",
 "Caso sintético Perú (continuación de S18): “totales/medianas por región para comité” → bar; “tendencia de tickets web semanal” → line. La función `elige_chart(pregunta)` es un gate didáctico con reglas legibles (`\"tendencia\"` → line, resto comparación → bar), no un clasificador ML: testeable en We Do y reutilizable en el portfolio.",
 ],
 code: {
 language: 'python',
 title: "chart_choice.py",
 code: `def s19_th_1():
    spec = {
     "pregunta": "¿Qué región tiene mayor ticket mediano?",
     "audiencia": "ejecutivo",
     "chart": "bar_horizontal",
     "evita": "pie_3d",
    }
    print(spec)
    print("ok", spec["chart"] != "pie_3d")

s19_th_1()`,
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
 heading: "Ejes, escalas y encodings honestos",
 subtopicId: "S19-T1-B",
 paragraphs: [
 "Ejes de **magnitudes absolutas en barras** deben incluir cero salvo justificación explícita; recortar el eje infla diferencias y engaña al comité. Jerarquía de encodings: posición > longitud > color > forma. El **dual-axis** (dos escalas Y distintas) confunde con frecuencia: si lo usas, declara el riesgo y prefiere paneles separados.",
 "Contrato: `ylim` bottom=0 en barras de PEN; etiqueta de unidades en el eje; escala log solo con leyenda explícita y justificación de órdenes de magnitud. Si usas color, no es el único canal para categorías críticas: añade etiqueta, patrón (hatch) o posición. El *baseline* es un encoding: mentir en el origen es mentir en la longitud percibida.",
 "Caso: valores 50 vs. 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. Calcula el factor de inflación visual `(altura_truco / altura_honesta)` antes de exportar al dashboard de CP-N2-B: si el factor es grande, el gráfico no pasa el gate de integridad.",
 ],
 code: {
 language: 'python',
 title: "honest_axes.py",
 code: `def s19_th_2():
    vals = {"Lima": 100, "Bogota": 90}
    # encoding deshonesto: baseline 85
    span_honesto = max(vals.values()) - 0
    span_truco = max(vals.values()) - 85
    print("ratio_visual_truco", round((100-90)/span_truco, 2))
    print("ratio_visual_honesto", round((100-90)/span_honesto, 2))
    print("recomendacion", "baseline_0_en_barras")

s19_th_2()`,
 output: `ratio_visual_truco 0.67
ratio_visual_honesto 0.1
recomendacion baseline_0_en_barras`,
 },
 callout: {
 type: "danger",
 title: "Eje recortado",
 content:
 "Un eje Y que empieza cerca del mínimo infla diferencias percibidas. Exige baseline 0 o justificación escrita.",
 },
 },
 {
 heading: "Matplotlib para figuras estáticas",
 subtopicId: "S19-T2-A",
 paragraphs: [
 "Matplotlib construye la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el subconjunto (este, que es la porción de datos que queda tras filtrar) está filtrado. **Seaborn** es opcional (estilo con `sns.set_theme` sobre los mismos *axes*); no es un camino obligatorio ni sustituye el contrato visual. Las claves del contrato — `ylim`, `ylabel` y conteo de barras — se leen en los *axes* de Matplotlib, no en la “belleza” del tema.",
 "Contrato de export: `bbox_inches='tight'`, dpi documentado (p. ej. 120), nombre versionado. En local guardas PNG/SVG según audiencia (diapositivas vs. impresión); en demos del curso a menudo validamos metadata y, cuando corresponde, un `savefig` real a buffer. Tests no miran “se ve bien en mi monitor”: miran `get_ylim()[0]==0`, `get_ylabel()` y conteo de barras — un contrato reproducible en CI con backend `Agg` (este backend, que es el modo sin ventana de Matplotlib, ideal para servidores y pipelines).",
 "Caso: bar de regiones con `ylabel='PEN'` y `ylim(0, …)`. Ordena barras por valor si la pregunta es “quién lidera”; orden alfabético si la pregunta es “catálogo de regiones”; barras horizontales si las etiquetas son largas. Añade hatch o etiqueta de valor cuando el color no puede ser el único canal. Cierra siempre con `plt.close(fig)` en scripts y CI.",
 ],
 code: {
 language: 'python',
 title: "mpl_bar.py",
 code: `def s19_th_3():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(5, 3))
    ax.bar(["Lima", "Bogota"], [28.0, 22.5], color="#1f4e79")
    ax.set_ylabel("Ticket mediano (PEN)")
    ax.set_title("Ticket mediano por región (sintético)")
    ax.set_ylim(0, 35)
    meta = {
        "axes": 1,
        "ylabel": ax.get_ylabel(),
        "ylim0": float(ax.get_ylim()[0]),
        "ylim1": float(ax.get_ylim()[1]),
    }
    plt.close(fig)
    print(meta)

s19_th_3()`,
 output: `{'axes': 1, 'ylabel': 'Ticket mediano (PEN)', 'ylim0': 0.0, 'ylim1': 35.0}`,
 },
 callout: {
 type: "tip",
 title: "Backend Agg",
 content:
 "En servidores y CI usa Agg; no dependas de display interactivo.",
 },
 },
 {
 heading: "Composición, anotaciones y exportación",
 subtopicId: "S19-T2-B",
 paragraphs: [
 "Multi-panel (`subplots`) alinea comparaciones (volumen vs. mediana). Anota valores clave con `bar_label` o `annotate` sin saturar: una anotación por *insight*, no un sticker en cada barra si ya hay tabla hermana. Export: PNG para diapositivas, SVG/PDF para impresión; nombre `fig_cpn2b_v{version}.png`.",
 "Contrato de reproducibilidad: seed de datos + función `build_figure(df)` sin estado global sucio. Misma entrada → mismos títulos de paneles y mismos n en captions. Exporta de verdad con `fig.savefig(..., dpi=…, bbox_inches='tight')` (archivo o buffer); el dict de export (`fmt`, `dpi`, `panels`, `name`) versiona el binario hacia S20/S21 — no sustituye el PNG.",
 "Caso sintético: 1×2 subplots con títulos “Vol” y “Med”; `savefig` a PNG 120 dpi y meta `{fmt:'png', dpi:120, panels:2}`. El dashboard empaqueta estas figuras con la tabla de paridad (mismos números). Faceting (un panel por región) es preferible a dual-axis cuando escalas no son comparables.",
 ],
 code: {
 language: 'python',
 title: "compose_export.py",
 code: `def s19_th_4():
    import matplotlib
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
    print(export)

s19_th_4()`,
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
 heading: "Filtros, tooltips y vista interactiva (modelo de datos)",
 subtopicId: "S19-T3-A",
 paragraphs: [
 "Modelamos la **vista interactiva** como especificación de datos: campos filtrables, plantilla de tooltip y viewport (este, que es el área visible que el usuario está explorando en ese momento). No hace falta instalar Plotly (ni Streamlit) para diseñar el contrato: si el modelo es claro, migrar a una librería interactiva es mecánico. Los tooltips deben mostrar **unidades y n**, no solo el valor “bonito”. Un filtro sin recálculo de conclusión es un defecto de producto, no un detalle cosmético.",
 "Contrato: al filtrar por región, el texto de conclusión del viewport se **recalcula**; no reutilices el párrafo global de “Madrid lidera” si el filtro es Bogota. Serializa el state (JSON) para auditoría del dashboard. El lookup por región es O(n) sobre filas sintéticas: suficiente para el lab; en producción agregarías índice o pre-agregación. La spec mínima es `{filtro, tooltip_template, unidad, campos_visibles}`.",
 "Caso sintético: *row* `{region:'Madrid', median:28, n:40}` → *tooltip* `Madrid: 28 PEN (n=40)`. **Paridad chart↔tabla:** si la barra dice 28, la fila de la tabla dice 28 a la misma precisión publicada. Si no, el *gate* de integridad falla antes del *export* y el portfolio no avanza a S20/S21.",
 ],
 code: {
 language: 'python',
 title: "interactive_spec.py",
 code: `def s19_th_5():
    rows = [
     {"region": "Madrid", "monto": 28.0, "n": 40},
     {"region": "Bogota", "monto": 22.5, "n": 32},
     {"region": "Lima", "monto": 24.0, "n": 28}
    ]
    filtro = "Madrid"
    vista = [r for r in rows if r["region"] == filtro]
    tooltip = {**vista[0], "unidad": "PEN", "nota": "sintético"}
    print("filtro", filtro)
    print("tooltip", tooltip)

s19_th_5()`,
 output: `filtro Madrid
tooltip {'region': 'Madrid', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}`,
 },
 callout: {
 type: "info",
 title: "Spec antes de librería",
 content:
 "Si el modelo de tooltip/filtro es claro, migrar a Plotly/Streamlit es mecánico. Aquí evalúas el contrato, no la librería.",
 },
 },
 {
 heading: "Estado, performance y alternativas accesibles",
 subtopicId: "S19-T3-B",
 paragraphs: [
 "El **estado** del dashboard (filtros activos) debe ser serializable (`json.dumps`). Evita recalcular todo el universo en cada hover; limita puntos en scatter (sample o aggregate) y documenta si hay sampling. Ejemplo de honestidad de performance: “viewport muestra sample 5 000 de 50 000 filas” — nunca ocultes el sesgo muestral del viewport ni lo presentes como censo. Declarar solo `sample_n` sin `universe_n` es un defecto de transparencia.",
 "Contrato a11y: alternativa accesible = tabla ordenable + resumen textual con **los mismos números** que el chart. Sin tabla hermana, el gráfico no entra solo al portfolio ejecutivo. El alt text no es “imagen de barras”: es el hallazgo principal + n + unidad + marco (sintético / canal web). Un lector de pantalla debe poder reconstruir la idea del chart sin verlo.",
 "Caso: `filtro_region=Madrid` → estado JSON compacto con `sample_n` y `universe_n` cuando aplique; `alt_text` une cada par `region=v PEN` con el separador `;`. La paridad se verifica con igualdad de valores a la precisión publicada (mismo redondeo en chart y tabla). Si redondeas a 1 decimal en el gráfico, la tabla no puede mostrar 3 “más precisos” sin documentarlo.",
 ],
 code: {
 language: 'python',
 title: "a11y_alt.py",
 code: `def s19_th_6():
    # Estado serializable + honestidad de sampling del viewport
    state = {
        "filtro_region": "Lima",
        "metric": "median",
        "sample_n": 5000,
        "universe_n": 50000,
    }
    chart_value = 28.0
    alt_table = [{"region": "Madrid", "ticket_mediano_pen": 28.0, "n": 40}]
    alt_text = f"En {alt_table[0]['region']}, ticket mediano {alt_table[0]['ticket_mediano_pen']} PEN (n={alt_table[0]['n']})."
    sampling_note = (
        f"viewport sample {state['sample_n']} de {state['universe_n']}; no es censo"
    )
    print(state)
    print(alt_text)
    print("match", chart_value == alt_table[0]["ticket_mediano_pen"])
    print(sampling_note)

s19_th_6()`,
 output: `{'filtro_region': 'Lima', 'metric': 'median', 'sample_n': 5000, 'universe_n': 50000}
En Madrid, ticket mediano 28.0 PEN (n=40).
match True
viewport sample 5000 de 50000; no es censo`,
 },
 callout: {
 type: "success",
 title: "Paridad numérica",
 content:
 "La alternativa no visual debe coincidir con el chart a la misma precisión publicada.",
 },
 },
 {
 heading: "Unidades, fuente y limitaciones",
 subtopicId: "S19-T4-A",
 paragraphs: [
 "Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`. Sin fuente, el gráfico **no entra** al portfolio de CP-N2-B: un número huérfano no se puede auditar ni re-renderizar con confianza en la factoría de reportes.",
 "Contrato de caption: dict con claves `unidad`, `fuente`, `limitacion` (y n cuando aplique). Función `pie(cap)` une con ` | ` para el footer estable entre dashboard e informe. El orden de claves es parte del contrato si serializas para tests; no inventes un pie distinto por diapositiva. Caption y alt se complementan: el pie es trazabilidad, el alt es el hallazgo legible en no visual.",
 "Caso sintético: unidad PEN, fuente `sintetico`, limitación “solo canal web; n bajo en Bogota”. El mismo pie viaja a S21 para que el DOCX no invente otra fuente. “28” sin PEN o sin % es un defecto de reporte, no un detalle cosmético: el comité no puede comparar ni escalar la métrica sin unidad.",
 ],
 code: {
 language: 'python',
 title: "caption.py",
 code: `def s19_th_7():
    caption = {
     "unidad": "PEN",
     "fuente": "dataset sintético curso",
     "corte": "2024-06-30",
     "n": 100,
     "limitacion": "solo canal web; no generalizar a tienda",
    }
    print(" | ".join(f"{k}: {v}" for k, v in caption.items()))

s19_th_7()`,
 output: `unidad: PEN | fuente: dataset sintético curso | corte: 2024-06-30 | n: 100 | limitacion: solo canal web; no generalizar a tienda`,
 },
 callout: {
 type: "warning",
 title: "Unidad omitida",
 content:
 "“28” sin PEN o sin % es un defecto de reporte.",
 },
 },
 {
 heading: "Color, contraste, texto alternativo y no sobreclaim",
 subtopicId: "S19-T4-B",
 paragraphs: [
 "Contraste suficiente texto/fondo; no uses **solo color** para categorías críticas — añade patrón (`hatch` en Matplotlib: este, que es un relleno de líneas o puntos que distingue la barra sin recurrir al tono; patrones típicos `'//'`, `'\\\\'`, `'..'`), etiqueta de valor o posición. Paletas amigables con daltonismo (p. ej. evitar rojo/verde exclusivos; preferir azul/naranja o viridis) reducen riesgo; el canal de posición sigue siendo el más robusto. **Alt text** describe el hallazgo principal y n, no “imagen de barras”.",
 "Contrato de claims: “Madrid lidera en la **muestra** web” es permitido; “Lima es la mejor región del Perú” sin marco poblacional es **RECHAZADO**. `classify_claim` es el gate didáctico del We Do: si el texto generaliza a la población sin “muestra”, falla. En el portfolio, el color y el contraste no redimen un sobreclaim en el título.",
 "Caso: alt `Lima 28 PEN n=40` debe contener `n=`; claim con “del Perú” sin “muestra” → RECHAZADO. Cierra el loop ético del dashboard antes de la factoría de reportes (S20/S21): si dos regiones se distinguen solo por tono, añade hatch o etiqueta antes de exportar.",
 "**SQL como puente entre datos y visualización.** En 1970, un matemático llamado Edgar Codd que trabajaba en IBM publicó un artículo que cambiaria la informática para siempre: propuso que los datos se organizaran en tablas relacionadas y que se consultaran con un lenguaje declarativo. Ese lenguaje nació como SEQUEL y hoy se llama SQL (Structured Query Language, esto es, lenguaje de consulta estructurada). Cuando construyes un dashboard, casi siempre los datos provienen de una base de datos relacional — y SQL es la herramienta universal para extraerlos, filtrarlos y agregarlos antes de visualizarlos.",
 "Las cuatro operaciones fundamentales de SQL son `SELECT` (seleccionar columnas), `WHERE` (filtrar filas), `GROUP BY` (agrupar por categoría) y `JOIN` (combinar tablas). Por ejemplo, `SELECT region, AVG(ticket) FROM ventas WHERE fecha >= '2026-01-01' GROUP BY region` devuelve el ticket promedio por región desde enero. En Python, `sqlite3` (esto es, la librería estándar de Python para bases de datos SQLite — un motor ligero que guarda la base entera en un archivo) permite ejecutar estas consultas: `import sqlite3; conn = sqlite3.connect('ventas.db'); df = pd.read_sql('SELECT region, AVG(ticket) FROM ventas GROUP BY region', conn)`. Así conectas el mundo SQL con el mundo pandas que ya dominas.",
 "La prevención de fuga de datos (leakage prevention, esto es, evitar que información del conjunto de prueba contamine el conjunto de entrenamiento) es una disciplina transversal. En visualización, significa no usar métricas calculadas sobre el dataset completo para elegir qué graficar — solo usa lo que verías en producción. En ML (como viste en S09), significa nunca hacer `fit_transform` sobre todo el dataset: el Pipeline aplica transformaciones solo sobre `X_train`. En SQL, significa no filtrar por etiquetas que no tendrías en inference time. La fuga silenciosa es el bug más caro de ML porque produce métricas excelentes en el lab y fallos en producción.",
 "La retrospectiva: SQL y la visualización son las dos caras del mismo puente entre datos y decisiones. SQL extrae y agrega; la visualización comunica y persuade. La fuga de datos es el enemigo común de ambas: si tus números están contaminados, tu gráfico es hermoso pero falso, y tu consulta SQL es rápida pero engañosa. La honestidad estadística empieza antes del primer `SELECT`.",
 ],
 code: {
 language: 'python',
 title: "alt_claim.py",
 code: `def s19_th_8():
    alt = (
     "Barras del ticket mediano sintético: Lima 28 PEN (n=40), "
     "Madrid 24 (n=28), Bogota 22.5 (n=32). Eje Y desde 0."
    )
    claim_ok = "En la muestra web sintética, Madrid muestra el ticket mediano más alto."
    claim_bad = "Madrid es la región más rentable del Perú."
    print("alt_len", len(alt))
    print("usa_claim_ok", True)
    print("evita", claim_bad[:20] + "...")

s19_th_8()`,
 output: `alt_len 109
usa_claim_ok True
evita Madrid es la región ...`,
 },
 callout: {
 type: "danger",
 title: "Sobreclaim",
 content:
 "El lenguaje del título no puede exceder la evidencia del EDA (S18).",
 },
 }
 ],
 iDo: {
 intro: "Te muestro, paso a paso, cómo diseñar charts honestos, exportables y con alternativa accesible para el dashboard CP-N2-B. Parte de la elección de *chart* y llega al PNG real; del *tooltip* con n a la paridad chart↔tabla y al rechazo de *sobreclaim*.",
 steps: [
 {
 demoId: "S19-T1-A-DEMO",
 subtopicId: "S19-T1-A",
 environment: "local-python",
 description: "Elegir chart alineado a pregunta ejecutiva de comparación regional",
 preamble:
 "Antes de abrir Matplotlib, el analista del dashboard CP-N2-B debe *elegir* el chart por la pregunta, no por la librería de moda. En esta demo un VP de operaciones pide comparar ticket mediano entre pocas regiones (datos sintéticos CASO-LIM-019). Observa el dict de scores: `bar` suma 3, `pie_3d` suma 0. No escribas aún; predice qué tipo gana y por qué se imprime `rechaza_pie_3d True`. Si eliges el gráfico “bonito” sin anclar la pregunta, el comité malinterpreta magnitudes.",
 code: {
 language: 'python',
 title: "demo_chart_choice.py",
 code: `def s19_ido_1():
    pregunta = "Comparar ticket mediano entre regiones"
    audiencia = "VP de operaciones"
    candidates = ["bar", "line", "pie_3d", "scatter"]
    score = {"bar": 3, "line": 1, "pie_3d": 0, "scatter": 1}
    best = max(candidates, key=lambda c: score[c])
    print({"pregunta": pregunta, "audiencia": audiencia, "chart": best})
    print("rechaza_pie_3d", score["pie_3d"] == 0)

s19_ido_1()`,
 output: `{'pregunta': 'Comparar ticket mediano entre regiones', 'audiencia': 'VP de operaciones', 'chart': 'bar'}
rechaza_pie_3d True`,
 },
 why: "La elección se documenta como decisión de diseño (`pregunta`, `audiencia`, `chart`), no como preferencia estética. Comparar magnitudes absolutas entre pocas categorías se lee en barras; pie 3D distorsiona áreas y no sirve para ranking regional. El score didáctico es un gate testeable, no un modelo ML: fuerza a rechazar encodings que mienten. En We Do alinearás tipo, brief y una función `elige_chart` reutilizable.",
 retrospective:
 "Si puedes explicar por qué “comparar ticket mediano entre regiones” no es un pie 3D sin mirar el código, ya tienes el hábito de chart choice. El error clásico es copiar una plantilla de marketing. En We Do T1-A practicarás alinear tipo, brief y una función `elige_chart`.",
 },
 {
 demoId: "S19-T1-B-DEMO",
 subtopicId: "S19-T1-B",
 environment: "local-python",
 description: "Cuantificar distorsión de un eje Y recortado en barras",
 preamble:
 "Un eje Y que empieza cerca del mínimo infla la brecha percibida entre barras de PEN absolutas. En esta demo comparas 100 vs. 92: la diferencia absoluta es 8 en ambos casos, pero con baseline 90 la “altura relativa” del truco es diez veces la del baseline 0. No escribas aún; predice `factor_inflacion` y decide si ese chart pasaría el gate de integridad de CP-N2-B. Mentir en el origen es mentir en la longitud percibida.",
 code: {
 language: 'python',
 title: "demo_axes.py",
 code: `def s19_ido_2():
    a, b = 100.0, 92.0
    # honesto baseline 0
    perc_h = (a - b) / a
    # truco baseline 90
    perc_t = (a - b) / (a - 90)
    print("diff_abs", a - b)
    print("fraccion_altura_honesta", round(perc_h, 3))
    print("fraccion_altura_truco", round(perc_t, 3))
    print("factor_inflacion", round(perc_t / perc_h, 2))

s19_ido_2()`,
 output: `diff_abs 8.0
fraccion_altura_honesta 0.08
fraccion_altura_truco 0.8
factor_inflacion 10.0`,
 },
 why: "El baseline es un encoding: el factor de inflación educa al comité antes de exportar. Misma diferencia absoluta, distinta historia visual si el span del eje se recorta. En barras de magnitudes absolutas el valor por defecto ético es ylim bottom=0 o justificación escrita en el caption. En We Do calcularás el factor, implementarás `gate_baseline` y rechazarás dual-axis.",
 retrospective:
 "Misma diferencia absoluta, distinta historia visual: el truco multiplica la percepción. Si puedes explicar el factor 10 sin el código, ya desconfías del eje recortado. Pregunta de auto-chequeo: ¿por qué el denominador honesto es el máximo (100) y no la brecha 8? We Do: calcular factor, `gate_baseline` y rechazo de dual-axis.",
 },
 {
 demoId: "S19-T2-A-DEMO",
 subtopicId: "S19-T2-A",
 environment: "local-python",
 description: "Componer barra Matplotlib con ylim desde 0, unidad y canal no-color (hatch)",
 preamble:
 "El contrato visual del portfolio no es “se ve bonito en mi laptop”: es `ylim0==0`, ylabel con unidad y un canal no-color (hatch) para categorías. En esta demo Matplotlib (backend Agg) dibuja Madrid/Bogota/Berlin con patrones `//`, `\\\\`, `..`. Observa los tres prints booleanos/listas antes de copiar código: si el color fuera el único canal, un lector daltónico pierde el ranking. Cierra siempre con `plt.close(fig)` en scripts y CI.",
 code: {
 language: 'python',
 title: "demo_mpl.py",
 code: `def s19_ido_3():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    reg = ["Lima", "Madrid", "Bogota"]
    val = [28.0, 24.0, 22.5]
    # Patrones distintos: no depender solo del color para categorías
    hatches = ["//", "\\\\", ".."]
    fig, ax = plt.subplots()
    bars = ax.bar(reg, val, color="#2c5282", hatch=hatches)
    ax.set_ylabel("PEN")
    ax.set_title("Ticket mediano (sintético)")
    ax.set_ylim(0, max(val) * 1.2)
    ax.bar_label(bars, fmt="%.1f")
    print("ylim0", ax.get_ylim()[0] == 0)
    print("ylabel", ax.get_ylabel())
    # str() evita repr de np.str_ según versión de numpy
    print("hatches", [str(p.get_hatch()) for p in bars.patches])
    plt.close(fig)

s19_ido_3()`,
 output: `ylim0 True
ylabel PEN
hatches ['//', '\\\\', '..']`,
 },
 why: "Agg evita display interactivo en servidor y CI. Hatch complementa el color (WCAG 1.4.1), así el ranking no depende solo del tono. `bar_label` no sustituye la tabla de paridad. Lo que el grader puede assertar es `get_ylim` y `get_ylabel`. Cierra con `plt.close` para no filtrar memoria. En We Do forzarás ylim, armarás el dict de meta y casteas float nativo.",
 retrospective:
 "Figura mínima viable = baseline 0 + unidad + segundo canal. Si puedes listar los tres checks sin mirar la salida, ya piensas en contrato, no en screenshot. We Do: forzar ylim, armar dict de meta y castear float nativo.",
 },
 {
 demoId: "S19-T2-B-DEMO",
 subtopicId: "S19-T2-B",
 environment: "local-python",
 description: "Anotar, guardar PNG real (BytesIO) y exportar metadata multi-panel",
 preamble:
 "El dashboard CP-N2-B no se entrega con un dict de intenciones: se entrega un PNG real (o buffer) versionado. En esta demo ves un 1×2 (n por región + mediana horizontal), `savefig` a `BytesIO` a 120 dpi y un check `png_bytes_ok`. Observa que `panels` y `dpi` salen de la figura real, no de un hardcode. Predice si `bytes > 1000` será True antes de mirar la salida. Sin binario, S20/S21 no pueden re-renderizar ni archivar.",
 code: {
 language: 'python',
 title: "demo_compose.py",
 code: `def s19_ido_4():
    import io
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, (ax0, ax1) = plt.subplots(1, 2, figsize=(8, 3))
    ax0.bar(["Lima", "Bogota"], [40, 32])
    ax0.set_title("n por región")
    ax0.set_ylim(0, 50)
    ax1.barh(["Lima", "Bogota"], [28, 22.5])
    ax1.set_title("mediana PEN")
    ax1.set_xlim(0, 35)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120, bbox_inches="tight")
    export = {
        "file": "cp_n2b_dashboard_v1.png",
        "fmt": "png",
        "dpi": 120,
        "panels": 2,
        "seed_data": 19,
        "bytes": len(buf.getvalue()),
    }
    plt.close(fig)
    print({k: export[k] for k in ("file", "fmt", "dpi", "panels", "seed_data")})
    print("png_bytes_ok", export["bytes"] > 1000)

s19_ido_4()`,
 output: `{'file': 'cp_n2b_dashboard_v1.png', 'fmt': 'png', 'dpi': 120, 'panels': 2, 'seed_data': 19}
png_bytes_ok True`,
 },
 why: "savefig real habilita re-render y archivo del portfolio; un dict de intenciones no basta. El nombre versionado evita sobrescribir el histórico. `seed_data` documenta reproducibilidad del lote sintético. `close` libera memoria en CI. En We Do corregirás panels inventados, versionarás el filename y titularás cada panel.",
 retrospective:
 "Metadata miente si no hay bytes. Si puedes decir por qué un dict con `panels: 2` sin savefig no es entrega, ya pasaste el gate de export. We Do: corregir panels inventados, versionar el nombre y titular cada panel.",
 },
 {
 demoId: "S19-T3-A-DEMO",
 subtopicId: "S19-T3-A",
 environment: "local-python",
 description: "Vista interactiva lógica con filtro y tooltip honesto",
 preamble:
 "Antes de instalar Plotly o Streamlit, modelamos la vista interactiva como datos: filtro activo, plantilla de tooltip, unidad y n. En esta demo `view(\"Lima\")` y `view(\"Bogota\")` devuelven tooltips distintos con PEN y tamaño muestral. Observa que al cambiar el filtro **cambia** el texto: no se reutiliza el párrafo global de “Madrid lidera”. Predice el string de Bogota antes de mirar la salida. Un tooltip sin n invita a leer el KPI como censo.",
 code: {
 language: 'python',
 title: "demo_tooltip.py",
 code: `def s19_ido_5():
    data = [
        {"region": "Madrid", "median": 28.0, "n": 40},
        {"region": "Bogota", "median": 22.5, "n": 32},
    ]
    def view(region):
        row = next(r for r in data if r["region"] == region)
        return {
            "tooltip": f"{row['region']}: {row['median']} PEN (n={row['n']})",
            "filtro": region,
            "unidad": "PEN",
        }
    print(view("Madrid"))
    print(view("Bogota")["tooltip"])

s19_ido_5()`,
 output: `{'tooltip': 'Madrid: 28.0 PEN (n=40)', 'filtro': 'Madrid', 'unidad': 'PEN'}
Bogota: 22.5 PEN (n=32)`,
 },
 why: "Unidad y n son contrato a11y del viewport: sin ellos el KPI se vende como censo o queda ambiguo. El lookup O(n) basta para el lab y deja la spec migrable a Plotly/Streamlit después. Cada filtro debe recalcular el tooltip; reutilizar un párrafo global es defecto de producto. En We Do corregirás lookup, incluirás n y generalizarás la función.",
 retrospective:
 "Filtro sin recálculo es defecto de producto. Si puedes escribir de memoria el patrón `región: valor PEN (n=…)`, ya tienes la plantilla del portfolio. Pregunta de auto-chequeo: ¿qué cambia en el tooltip al pasar de Madrid a Bogota? We Do: corregir lookup, incluir n y generalizar la función.",
 },
 {
 demoId: "S19-T3-B-DEMO",
 subtopicId: "S19-T3-B",
 environment: "local-python",
 description: "Ofrecer alternativa tabular/textual con paridad al chart",
 preamble:
 "El gate de accesibilidad de CP-N2-B exige alternativa no visual con **los mismos números** que el chart. En esta demo el dict de medianas se convierte en tabla y en un texto `Madrid=28.0 PEN; Bogota=22.5 PEN`, y `parity` es True. Observa que no se “redondea bonito” en la tabla a 27.5. Predice el booleano de paridad. Sin tabla hermana, un lector de pantalla (o un auditor) no puede reconstruir el hallazgo.",
 code: {
 language: 'python',
 title: "demo_a11y.py",
 code: `def s19_ido_6():
    chart = {"Lima": 28.0, "Bogota": 22.5}
    table = [{"region": k, "ticket_mediano_pen": v} for k, v in chart.items()]
    text = "; ".join(f"{r['region']}={r['ticket_mediano_pen']} PEN" for r in table)
    print(table)
    print(text)
    print("parity", all(chart[r["region"]] == r["ticket_mediano_pen"] for r in table))

s19_ido_6()`,
 output: `[{'region': 'Lima', 'ticket_mediano_pen': 28.0}, {'region': 'Bogota', 'ticket_mediano_pen': 22.5}]
Lima=28.0 PEN; Bogota=22.5 PEN
parity True`,
 },
 why: "Paridad a la precisión publicada: 27.5 en tabla y 28.0 en chart es un fail de integridad. Alt/texto no es “imagen más grande”; es el mismo contrato en otro canal. El join de filas con unidad es el patrón del alt del portfolio. En We Do alinearás números, serializarás estado con universe_n y generarás alt con PEN.",
 retrospective:
 "Misma precisión, mismos valores, dos canales (visual y no visual). Si puedes explicar por qué 27.5 en tabla y 28.0 en chart es un fail, ya piensas en integridad. We Do: alinear números, serializar estado con universe_n y generar alt con PEN.",
 },
 {
 demoId: "S19-T4-A-DEMO",
 subtopicId: "S19-T4-A",
 environment: "local-python",
 description: "Etiquetar unidades, fuente y limitaciones en caption estructurado",
 preamble:
 "Sin fuente y limitación, el gráfico no entra al portfolio CP-N2-B: un “28” huérfano no se puede auditar ni re-renderizar con confianza. En esta demo el caption se empaqueta en un pie estable `Unidad | Fuente | Corte | Límite` con datos sintéticos y canal web. Observa el orden y el contenido de `limitacion` (“n bajo en Bogota”). Predice el string del pie antes de mirar la salida. El mismo pie viaja a S21 para que el DOCX no invente otra fuente.",
 code: {
 language: 'python',
 title: "demo_caption.py",
 code: `def s19_ido_7():
    cap = {
     "titulo": "Ticket mediano por región",
     "unidad": "PEN",
     "fuente": "sintético CP-N2-B",
     "corte": "2024-06-30",
     "limitacion": "canal web; n bajo en Bogota",
    }
    print("pie", f"Unidad: {cap['unidad']} | Fuente: {cap['fuente']} | Corte: {cap['corte']} | Límite: {cap['limitacion']}")

s19_ido_7()`,
 output: `pie Unidad: PEN | Fuente: sintético CP-N2-B | Corte: 2024-06-30 | Límite: canal web; n bajo en Bogota`,
 },
 why: "Caption es entregable, no un extra de diseño: unidad omitida es defecto de reporte. La limitación acota el claim del título (“todo el canal”, “todo el Perú”) al marco real del EDA. El pie estructurado viaja a S21 sin reinventar la fuente. En We Do completarás fuente, validarás claves e implementarás el join `k: v`.",
 retrospective:
 "Trazabilidad = unidad + fuente + marco. Si puedes redactar un pie de cuatro piezas sin copiar, ya cierras el loop ético antes de S20/S21. We Do: completar fuente, validar claves e implementar el join `k: v`.",
 },
 {
 demoId: "S19-T4-B-DEMO",
 subtopicId: "S19-T4-B",
 environment: "local-python",
 description: "Validar alt text y rechazar sobreclaim causal/nacional",
 preamble:
 "El color y el contraste no redimen un sobreclaim en el título. En esta demo un claim acotado a la muestra web es PERMITIDO y “Lima es la mejor región del Perú” es RECHAZADO. El alt describe hallazgo + marco sintético, no “imagen de barras”. Observa las dos clasificaciones y el conteo de palabras del alt. Predice cuál claim falla y por qué. El lenguaje del dashboard no puede exceder la evidencia del EDA de S18.",
 code: {
 language: 'python',
 title: "demo_claims.py",
 code: `def s19_ido_8():
    alt = "Barras: Madrid 28 PEN, Lima 24, Bogota 22.5; muestra web sintética n=100."
    claims = [
     ("Madrid lidera el ticket mediano en la muestra web", True),
     ("Madrid es la mejor región del Perú", False),
    ]
    for c, ok in claims:
     print(c[:40], "=>", "PERMITIDO" if ok else "RECHAZADO")
    print("alt_words", len(alt.split()))

s19_ido_8()`,
 output: `Madrid lidera el ticket mediano en la mu => PERMITIDO
Madrid es la mejor región del Perú => RECHAZADO
alt_words 12`,
 },
 why: "El marco muestral debe vivir en el claim: muestra ≠ población. El alt con n y hallazgo es canal no visual, no “descripción genérica de imagen”. El contraste PERMITIDO/RECHAZADO entrena el hábito antes del export. En We Do implementarás la regla “del Perú” sin “muestra”, completarás alt+hatch y generalizarás `classify_claim`.",
 retrospective:
 "Muestra ≠ población. Si puedes reescribir el claim rechazado en una frase permitida sin mirar el código, ya cierras el loop ético. We Do: implementar la regla, completar alt/hatch y generalizar el clasificador.",
 }
 ],
 },
 weDo: {
 intro: "24 ejercicios de elección de chart, ejes, Matplotlib, tooltips lógicos, a11y y claims (3 por subtema: guiado → independiente → transferencia). Cada starter trae un bug intencional de diseño o de contrato: corrígelo razonando el subtema (baseline, unidades, paridad, sampling, claims). No hay un “texto mágico de pass” en la consigna: diseña, imprime el resultado del contrato y compáralo con tu criterio del I Do.",
 steps: [
 {
 id: "S19-T1-A-E1",
 subtopicId: "S19-T1-A",
 kind: "guided",
 title: "Barras para comparar regiones",
 preamble:
 "- **Contexto:** el comité de operaciones quiere **comparar** ticket mediano entre pocas regiones (magnitudes absolutas), no una serie temporal.\n- **Meta:** corregir la elección de chart cuando el starter elige un tipo inadecuado.\n- **Éxito:** imprimes una sola línea con el texto `bar`.\n- **Límites:** no uses pie 3D ni line para esta pregunta; no imprimas frases extra; solo el tipo de chart.",
 instruction:
 "1. Abre el starter: `chart = \"line\"` es el bug (serie temporal para comparación).\n2. Cambia el tipo a barras (`\"bar\"`).\n3. Imprime solo la variable `chart`.\n4. Verifica mentalmente: pocas categorías + magnitud absoluta → barras.",
 hint: "Comparar magnitudes entre categorías se lee mejor en barras.",
 hints: [
 "Pregunta de comparación → barras (bar), no serie temporal.",
 "Imprime únicamente el tipo de chart corregido.",
 ],
 edgeCases: ["serie temporal mal clasificada como bar"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste `line` o un pie, confundes tendencia con comparación. Barras con baseline 0 comunican magnitudes entre regiones; la línea es para series temporales. El brief del dashboard se rompe si el encoding no responde a la pregunta.",
 retrospective:
 "Pregunta de comparación → barras; pregunta de tendencia → línea. El error clásico es “siempre uso el chart del último tutorial” o un pie “bonito”. Pregunta de auto-chequeo: ¿qué chart elegirías para “tendencia semanal de tickets”? Siguiente (E2): el brief (`pregunta`, `audiencia`, `chart`) debe viajar con la figura.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · chart choice bar
# Bug a corregir: chart=line para comparar
pregunta = "comparar regiones"
chart = "line"
print(chart)`,
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
 title: "Brief de diseño con tres claves",
 preamble:
 "- **Contexto:** la figura del portfolio no viaja sola: el informe (S21) necesita saber *por qué* ese encoding.\n- **Meta:** completar un brief con `pregunta`, `audiencia` y `chart` para totales por región ante un ejecutivo.\n- **Éxito:** un dict impreso con las tres claves y valores alineados (ejecutivo + bar).\n- **Límites:** no inventes claves extra; no uses audiencia “técnica” para este brief de comité.",
 instruction:
 "1. Revisa el starter: solo imprime `pregunta` (bug: omitió audiencia y chart).\n2. Completa el dict para totales por región, audiencia ejecutivo, chart bar.\n3. Imprime el dict completo en una sola línea.\n4. No hardcodees otro chart “más moderno”.",
 hint: "Tres claves: pregunta, audiencia, chart.",
 hints: [
 "Audiencia típica del comité: ejecutivo.",
 "Chart alineado a comparación de totales: bar.",
 ],
 edgeCases: ["audiencia técnica puede preferir table"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin audiencia y chart en el brief, el DOCX de S21 no puede defender la decisión de diseño. Un dict con solo la pregunta es un hallazgo huérfano, no un contrato de visualización.",
 retrospective:
 "Tres claves mínimas: qué se pregunta, a quién se habla, cómo se encode. Un dict solo con `pregunta` es hallazgo huérfano. Pregunta de auto-chequeo: ¿qué clave faltaría si el informe S21 no puede defender “por qué barras”? Luego (E3) automatizarás la elección con una regla legible sobre el texto de la pregunta.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · brief dict
# Bug a corregir: omite audiencia/chart
print({"pregunta": "totales por región"})`,
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
 title: "Función elige_chart por keyword",
 preamble:
 "- **Contexto:** en el lab, la elección de chart no es un modelo opaco: es una regla legible que puedes testear en CI.\n- **Meta:** implementar `elige_chart(pregunta)` que devuelve `line` si aparece “tendencia” (ignorando mayúsculas) y `bar` en caso contrario.\n- **Éxito:** dos líneas de salida — `line` y luego `bar` — para “tendencia mensual” y “comparar regiones”.\n- **Límites:** no uses ML ni librerías extra; no hardcodees solo un return fijo.",
 instruction:
 "1. Lee el defecto: la función siempre devuelve `\"bar\"`.\n2. Normaliza la pregunta con `.lower()` y busca la subcadena `\"tendencia\"`.\n3. Devuelve `\"line\"` o `\"bar\"` según la regla.\n4. Deja los dos `print` de prueba en el orden dado.",
 hint: "Usa `in` sobre `pregunta.lower()`.",
 hints: [
 "Normaliza a minúsculas antes de buscar la palabra clave.",
 "Dos llamadas, dos prints (uno por caso).",
 ],
 edgeCases: ["mayúsculas en TENDENCIA"],
 tests: "salida coincide con solution output",
 feedback:
 "Si ambas líneas salen `bar`, la función aún ignora la pregunta. Busca la subcadena `\"tendencia\"` sobre `pregunta.lower()`; sin normalizar, `TENDENCIA` fallaría en producción. Keywords legibles se auditan en CI; un return fijo no.",
 retrospective:
 "Una regla explícita se audita; un “modelo de chart” sin tests no. Pregunta de cierre: ¿qué devolverías si la pregunta dice “TENDENCIA” en mayúsculas? Puente a T1-B: aunque elijas bar, un eje recortado puede mentir igual.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · elige_chart
# Bug a corregir: siempre bar
def elige_chart(pregunta):
 return "bar"
print(elige_chart("tendencia mensual"))
print(elige_chart("comparar regiones"))`,
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
 title: "Factor de inflación del eje recortado",
 preamble:
 "- **Contexto:** valores 50 y 45 con baseline truco 40 vs. baseline honesto 0: el comité ve “brechas” distintas.\n- **Meta:** calcular el factor de inflación visual (altura relativa truco ÷ altura relativa honesta).\n- **Éxito:** una línea `factor 5.0` (redondeado a 2 decimales).\n- **Límites:** no uses el span entre barras como denominador honesto; no imprimas solo el truco.",
 instruction:
 "1. Revisa el starter: `hon` divide por `(50-45)` (bug: denominador 1).\n2. Corrige la altura honesta a `(50-45)/50` (span desde 0).\n3. Mantén truco como `(50-45)/(50-40)`.\n4. Imprime `factor` con `round(truco/hon, 2)`.",
 hint: "Altura truco = (50-45)/(50-40); altura honesta = (50-45)/50.",
 hints: [
 "Con baseline 0 el span es el valor máximo (50), no la diferencia entre barras.",
 "factor = truco / honesto; redondea con round(..., 2).",
 ],
 edgeCases: ["baseline > min de la serie"],
 tests: "salida coincide con solution output",
 feedback:
 "Si el factor es 1.0 o absurdo, el denominador honesto sigue mal. Con baseline 0 el span es el máximo (50), no la diferencia entre barras. Un factor >1 es señal de que el eje recortado no pasa el gate sin justificación escrita.",
 retrospective:
 "Altura percibida = diff / span del eje. Recortar el span multiplica la historia aunque la diferencia absoluta sea la misma. El error clásico es usar la brecha entre barras como “denominador honesto”. Pregunta de auto-chequeo: con baseline 0 y máx 50, ¿cuál es el span? Siguiente (E2): automatizar el veredicto con `gate_baseline`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · truncated axis factor
# Bug a corregir: denominador honesto incorrecto
truco = (50 - 45) / (50 - 40)
hon = (50 - 45) / (50 - 45)
print("factor", round(truco / hon, 2))`,
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
 title: "Gate de baseline en barras absolutas",
 preamble:
 "- **Contexto:** no todo encoding exige y=0 (una línea de índice puede partir de otro valor si se documenta); las barras de PEN absolutas sí.\n- **Meta:** implementar `gate_baseline(ylim_bottom, encoding)` con tres salidas: `honesto`, `revisar`, `ok_con_nota`.\n- **Éxito:** con `(40, \"bar_absolute\")` imprime exactamente `revisar`.\n- **Límites:** no devuelvas siempre `ok_con_nota`; no trates `line_index` como `bar_absolute`.",
 instruction:
 "1. Abre el starter: la función ignora argumentos y devuelve siempre `ok_con_nota` (bug).\n2. Implementa tres veredictos según encoding y `ylim_bottom` (revisa el I Do y el contrato de barras absolutas).\n3. Deja el print de prueba con bottom 40 y `bar_absolute`.\n4. No trates `line_index` como si fuera barra de montos absolutos.",
 hint: "Prioriza el caso bar_absolute; solo entonces miras el bottom.",
 hints: [
 "if encoding == \"bar_absolute\": … elif …",
 "Mira primero el encoding; el bottom solo decide honesto vs. revisar en bar_absolute.",
 ],
 edgeCases: ["líneas de índice pueden no empezar en 0 (ok_con_nota)"],
 tests: "salida coincide con solution output",
 feedback:
 "ylim_bottom=0 es el valor por defecto ético en barras de montos PEN. Truncar sin nota es defecto de integridad; una línea de índice puede no partir de 0 **si** lo documentas en el caption.",
 retrospective:
 "El gate mira primero el tipo de encoding, luego el número. Pregunta de cierre: ¿qué devuelve `gate_baseline(0, \"bar_absolute\")`? Luego (E3) el riesgo de dual-axis, otro encoding engañoso.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · ylim honesty gate
# Bug a corregir: ignora encoding y bottom
def gate_baseline(ylim_bottom, encoding):
 return "ok_con_nota"
print(gate_baseline(40, "bar_absolute"))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def gate_baseline(ylim_bottom, encoding):
 if encoding == "bar_absolute":
  return "honesto" if ylim_bottom == 0 else "revisar"
 return "ok_con_nota"
print(gate_baseline(40, "bar_absolute"))`,
 output: `revisar`,
 },
 },
 {
 id: "S19-T1-B-E3",
 subtopicId: "S19-T1-B",
 kind: "transfer",
 title: "Marcar dual-axis como riesgo alto",
 preamble:
 "- **Contexto:** dos escalas Y en un solo panel mezclan unidades y engañan al ejecutivo que “ve correlación” donde solo hay superposición visual.\n- **Meta:** clasificar el encoding `dual_axis` como `riesgo_alto` (no “ok”).\n- **Éxito:** imprime una línea con `riesgo_alto`.\n- **Límites:** no apruebes dual_axis por defecto; prefiere paneles separados en el diseño real del dashboard.",
 instruction:
 "1. Lee el defecto: el ternario imprime `ok` cuando encoding es dual_axis.\n2. Invierte la lógica: dual_axis → `riesgo_alto`; otro → `ok`.\n3. Imprime solo el string del veredicto.\n4. No cambies el valor de `encoding` en este lab.",
 hint: "dual_axis es el caso de alto riesgo didáctico.",
 hints: [
 "Si encoding es dual_axis → riesgo_alto; si no → ok.",
 "No apruebes dual_axis por defecto.",
 ],
 edgeCases: ["color-only sin segundo canal"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste `ok`, el ternario sigue al revés: estás aprobando el encoding de riesgo. Dual-axis mezcla dos escalas Y y finge correlación por superposición. Preferir paneles separados (1×2) es el antídoto de diseño del dashboard.",
 retrospective:
 "Dual-axis no es “más datos en menos espacio”: es dos historias con reglas distintas. Preferir 1×2 subplots (T2-B) es el antídoto. Puente a T2-A: construir barras con ylim desde 0 en código real.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · dual_axis risk
# Bug a corregir: dual_axis → ok
encoding = "dual_axis"
print("ok" if encoding == "dual_axis" else "riesgo_alto")`,
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
 title: "Forzar ylim desde cero",
 preamble:
 "- **Contexto:** en barras de magnitud absoluta el bottom del eje Y debe ser 0; el starter lo deja en 1 y “recorta aire”.\n- **Meta:** construir un bar chart Agg de dos barras y verificar `get_ylim()[0] == 0`.\n- **Éxito:** imprime el booleano `True`.\n- **Límites:** backend Agg antes de pyplot; cierra la figura; no imprimas el tuple completo del ylim.",
 instruction:
 "1. Abre el starter: `set_ylim(1, 3)` es el bug.\n2. Cambia a `set_ylim(0, …)` (p. ej. 0, 3).\n3. Imprime `ax.get_ylim()[0] == 0`.\n4. Mantén `plt.close(fig)`.",
 hint: "ax.set_ylim(0, …) y plt.close(fig).",
 hints: [
 "Backend Agg antes de importar pyplot.",
 "El contrato es booleano: True solo si el bottom del ylim es 0.",
 ],
 edgeCases: ["olvidar close y fugas de memoria en CI"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprime `False`, el bottom aún no es 0. Barras de magnitud absoluta no deben “empezar cerca del mínimo” para dramatizar la brecha: el gate del dashboard lo rechaza.",
 retrospective:
 "Un booleano de `ylim0` es el test más barato de honestidad visual en CI. El error clásico es “empezar cerca del mínimo” para dramatizar la brecha. Pregunta de auto-chequeo: ¿qué imprime el check si bottom sigue en 1? Siguiente (E2): el contrato también exige ylabel con unidad PEN.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · bar ylim0
# Bug a corregir: ylim empieza en 1
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["a", "b"], [1, 2])
ax.set_ylim(1, 3)
print(ax.get_ylim()[0] == 0)
plt.close(fig)`,
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
 title: "Ylabel con PEN y baseline 0",
 preamble:
 "- **Contexto:** “28” sin unidad es un defecto de reporte; el comité no puede escalar ni comparar.\n- **Meta:** dibujar Madrid=28 y Bogota=22.5 con ylabel `Ticket mediano (PEN)`, ylim desde 0, e imprimir el dict de contrato.\n- **Éxito:** `{'ylabel': 'Ticket mediano (PEN)', 'ylim0': 0.0}`.\n- **Límites:** convierte ylim0 a `float` nativo; cierra la figura; no dejes ylabel vacío.",
 instruction:
 "1. Revisa el starter: imprime ylabel vacío y ylim por defecto (bug).\n2. Fija ylabel con unidad PEN y fuerza baseline 0 (elige un top razonable, p. ej. por encima de 28).\n3. Arma el dict con `get_ylabel()` y `float(get_ylim()[0])`.\n4. Imprime el dict y cierra la figura.",
 hint: "set_ylabel + set_ylim(0, …) + float(get_ylim()[0]).",
 hints: [
 "La unidad va en el eje (PEN dentro del ylabel), no solo en el título de la diapositiva.",
 "Convierte ylim0 a float nativo para salida estable.",
 ],
 edgeCases: ["ylabel vacío o solo espacios"],
 tests: "salida coincide con solution output",
 feedback:
 "Un ylabel con PEN y baseline 0 hacen honesto el encoding de longitud del ticket mediano. Sin unidad, el número de la barra es ilegible fuera del contexto del notebook.",
 retrospective:
 "Unidad en el eje, no solo en el título de la diapositiva. Sin PEN, el “28” no escala fuera del notebook. Pregunta de auto-chequeo: ¿por qué casteamos ylim0 a `float` nativo? Luego (E3) empaquetarás `n_bars` + `ylim0` en `meta_bar`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · ylabel + ylim contract
# Bug a corregir: sin ylabel; ylim no forzado a 0
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["Lima", "Bogota"], [28.0, 22.5])
print({"ylabel": ax.get_ylabel(), "ylim0": float(ax.get_ylim()[0])})
plt.close(fig)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["Lima", "Bogota"], [28.0, 22.5])
ax.set_ylabel("Ticket mediano (PEN)")
ax.set_ylim(0, 35)
print({"ylabel": ax.get_ylabel(), "ylim0": float(ax.get_ylim()[0])})
plt.close(fig)`,
 output: `{'ylabel': 'Ticket mediano (PEN)', 'ylim0': 0.0}`,
 },
 },
 {
 id: "S19-T2-A-E3",
 subtopicId: "S19-T2-A",
 kind: "transfer",
 title: "meta_bar con n_bars y ylim0",
 preamble:
 "- **Contexto:** el portfolio reusa builders; el test no mira el PNG píxel a píxel, mira un dict estable.\n- **Meta:** implementar `meta_bar(labels, values)` que dibuja barras, fija ylim 0…max*1.2 y devuelve `n_bars` y `ylim0` como float de Python.\n- **Éxito:** para Madrid/Bogota y 28/22.5 imprime `{'n_bars': 2, 'ylim0': 0.0}`.\n- **Límites:** no devuelvas tipos numpy en ylim0; cierra la figura dentro de la función.",
 instruction:
 "1. Lee el defecto: no hay `set_ylim` y ylim0 no se castea a float.\n2. Dentro de `meta_bar`, dibuja, fuerza ylim y arma el dict.\n3. Usa `float(ax.get_ylim()[0])` y `len(values)`.\n4. Deja el print de prueba con las dos regiones.",
 hint: "Usa float(ax.get_ylim()[0]) para salida estable.",
 hints: [
 "Cuenta barras con len(values).",
 "Fuerza set_ylim(0, max(values)*1.2) antes de leer ylim0.",
 ],
 edgeCases: ["values vacíos"],
 tests: "salida coincide con solution output",
 feedback:
 "Convierte ylim0 a float nativo de Python para una salida estable entre entornos. n_bars debe coincidir con las categorías dibujadas; baseline 0 es el gate de honestidad del dashboard.",
 retrospective:
 "Contrato estable = tipos nativos + conteos + baseline. Pregunta de cierre: ¿qué pasa si `values` está vacío? Puente a T2-B: export real y metadata de paneles.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · meta_bar
# Bug a corregir: ylim0 no forzado a 0; ylim0 no casteado a float
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def meta_bar(labels, values):
 fig, ax = plt.subplots()
 ax.bar(labels, values)
 out = {"n_bars": len(values), "ylim0": ax.get_ylim()[0]}
 plt.close(fig)
 return out
print(meta_bar(["Lima", "Bogota"], [28.0, 22.5]))`,
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
 out = {"n_bars": len(values), "ylim0": float(ax.get_ylim()[0])}
 plt.close(fig)
 return out
print(meta_bar(["Lima", "Bogota"], [28.0, 22.5]))`,
 output: `{'n_bars': 2, 'ylim0': 0.0}`,
 },
 },
 {
 id: "S19-T2-B-E1",
 subtopicId: "S19-T2-B",
 kind: "guided",
 title: "Export PNG real y meta de paneles",
 preamble:
 "- **Contexto:** un dict de export inventado no viaja a la factoría Excel ni a los reportes: hace falta `savefig` y paneles contados de la figura.\n- **Meta:** subplots 1×2, PNG a BytesIO dpi=120, dict con `fmt`, `dpi`, `panels`, `png_ok`.\n- **Éxito:** `{'fmt': 'png', 'dpi': 120, 'panels': 2, 'png_ok': True}`.\n- **Límites:** no hardcodees `panels=1`; buffer > 500 bytes; cierra la figura.",
 instruction:
 "1. Abre el starter: no hay savefig y panels=1 (bugs).\n2. Crea `io.BytesIO()`, llama `fig.savefig(..., format=\"png\", dpi=120)`.\n3. Cuenta paneles con `len(axes)` y `png_ok` con `len(buf.getvalue()) > 500`.\n4. Imprime el dict y cierra la figura.",
 hint: "savefig al buffer; panels = len(axes.flat) o 2 en 1×2.",
 hints: [
 "import io; buf = io.BytesIO(); fig.savefig(buf, format='png', dpi=120).",
 "No hardcodees panels=1: léelo de la figura (2 paneles).",
 ],
 edgeCases: ["buffer vacío si olvidaste savefig"],
 tests: "salida coincide con solution output",
 feedback:
 "El metadata debe reflejar la figura real. Un dict bonito sin bytes no es entregable: S20/S21 necesitan el PNG (o un buffer no vacío) y el conteo honesto de paneles.",
 retrospective:
 "`savefig` primero, metadata después: un dict con `panels: 2` sin bytes no es entrega. El error clásico es hardcodear `png_ok` o inventar el conteo de paneles. Pregunta de auto-chequeo: ¿qué falla si olvidas `BytesIO`? Siguiente (E2): el nombre de archivo versionado es parte del mismo contrato de re-render.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · export real + meta
# Bug a corregir: no savefig; panels=1 inventado
import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
axes[0].bar(["Lima"], [40])
axes[1].bar(["Bogota"], [28])
export = {"fmt": "png", "dpi": 120, "panels": 1, "png_ok": False}
print(export)
plt.close(fig)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
axes[0].bar(["Lima"], [40])
axes[1].bar(["Bogota"], [28])
buf = io.BytesIO()
fig.savefig(buf, format="png", dpi=120, bbox_inches="tight")
export = {
    "fmt": "png",
    "dpi": 120,
    "panels": len(axes),
    "png_ok": len(buf.getvalue()) > 500,
}
print(export)
plt.close(fig)`,
 output: `{'fmt': 'png', 'dpi': 120, 'panels': 2, 'png_ok': True}`,
 },
 },
 {
 id: "S19-T2-B-E2",
 subtopicId: "S19-T2-B",
 kind: "independent",
 title: "Nombre versionado del PNG",
 preamble:
 "- **Contexto:** si todas las figuras se llaman `fig_cpn2b.png`, el re-render borra el histórico del portfolio.\n- **Meta:** generar `fig_cpn2b_v{version}.png` con `version = 3`.\n- **Éxito:** imprime exactamente `fig_cpn2b_v3.png`.\n- **Límites:** usa f-string; no omitas el prefijo acordado `fig_cpn2b`.",
 instruction:
 "1. Revisa el starter: imprime `fig_cpn2b.png` sin versión (bug).\n2. Usa `f\"fig_cpn2b_v{version}.png\"` con version=3.\n3. Imprime solo ese string.\n4. No insertes espacios ni mayúsculas distintas.",
 hint: "Incluye _v y el número de versión antes de .png.",
 hints: [
 "f-string con {version}.",
 "Prefijo acordado: fig_cpn2b.",
 ],
 edgeCases: ["version como string no numérica"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste `fig_cpn2b.png`, aún falta `_v{version}` antes de la extensión. Un solo nombre sobrescribe el histórico en la factoría y rompe la trazabilidad hacia S21. Usa f-string con el `version` del fixture (3).",
 retrospective:
 "Versionar el binario es tan importante como versionar el código del builder. El error clásico es “un PNG para todos los re-renders”. Pregunta de auto-chequeo: ¿qué nombre esperas con `version = 1`? Luego (E3) cada panel necesita título propio (Vol vs. Med).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · versioned filename
# Bug a corregir: sin version en nombre
version = 3
print("fig_cpn2b.png")`,
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
 title: "Títulos de panel Vol y Med",
 preamble:
 "- **Contexto:** un `suptitle` “Dashboard” no dice qué lee cada panel; el comité necesita “Vol” vs. “Med” sin ambigüedad.\n- **Meta:** subplots 1×2 con `set_title` en cada axes e imprimir la lista de títulos.\n- **Éxito:** `['Vol', 'Med']`.\n- **Límites:** no confíes solo en `fig.suptitle`; cierra la figura.",
 instruction:
 "1. Lee el defecto: solo hay suptitle; `get_title()` de cada ax queda vacío.\n2. Asigna `axes[0].set_title(\"Vol\")` y `axes[1].set_title(\"Med\")`.\n3. Imprime la lista por comprehension sobre axes.\n4. Mantén el close.",
 hint: "axes[0].set_title y axes[1].set_title.",
 hints: [
 "suptitle no reemplaza títulos de panel en el contrato del grader.",
 "Lista en el mismo orden de los axes.",
 ],
 edgeCases: ["orientación 2×1"],
 tests: "salida coincide con solution output",
 feedback:
 "Si la lista sale `['', '']`, solo hay `suptitle`: `get_title()` del axes no lo hereda. Asigna título en cada panel y vuelve a listar. El grader (y el comité) leen el axes, no el adorno de figura.",
 retrospective:
 "Suptitle es opcional; el título del axes es el contrato del panel. El error clásico es un “Dashboard” global sin Vol/Med. Pregunta de auto-chequeo: ¿qué lee un lector si ambos `get_title()` están vacíos? Puente a T3-A: la vista interactiva también debe recalcular el valor al filtrar región.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · panel titles
# Bug a corregir: un solo title en fig
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
fig.suptitle("Dashboard")
print([ax.get_title() for ax in axes])
plt.close(fig)`,
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
 title: "Lookup de mediana filtrada a Lima",
 preamble:
 "- **Contexto:** si el filtro del dashboard es Madrid, el valor mostrado no puede ser el de Bogota: rompe la paridad con el tooltip y la tabla.\n- **Meta:** recuperar la mediana de la fila cuya región es Madrid.\n- **Éxito:** imprime el entero `28`.\n- **Límites:** no hardcodees 28 sin filtrar; no imprimas el dict completo.",
 instruction:
 "1. Abre el starter: el `next(...)` filtra `\"Bogota\"` (bug).\n2. Cambia la comparación a `\"Lima\"`.\n3. Imprime solo el campo `median` de la fila.\n4. Verifica mentalmente: 28, no 22.",
 hint: "next(...) o list comprehension filtrando region == \"Lima\".",
 hints: [
 "Compara r[\"region\"] con la cadena Madrid.",
 "Imprime solo el campo median de la fila filtrada.",
 ],
 edgeCases: ["sin match → StopIteration"],
 tests: "salida coincide con solution output",
 feedback:
 "Mostrar Bogota cuando el filtro es Madrid es un bug de viewport, no un detalle cosmético. El valor filtrado debe recalcularse; si no, el comité decide con el KPI equivocado.",
 retrospective:
 "Lookup correcto = filtro honesto. El error clásico es dejar hardcodeado el valor de “otra región” o el KPI global de Madrid. Pregunta de auto-chequeo: con filtro Madrid, ¿por qué 22 sería un fail? Siguiente (E2): el tooltip de esa celda debe llevar unidad y n, no solo el número.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · lookup median
# Bug a corregir: filtra Bogota en lugar de Madrid
rows = [{"region": "Madrid", "median": 28}, {"region": "Bogota", "median": 22}]
print(next(r for r in rows if r["region"] == "Bogota")["median"])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `rows = [{"region": "Madrid", "median": 28}, {"region": "Bogota", "median": 22}]
print(next(r for r in rows if r["region"] == "Madrid")["median"])`,
 output: `28`,
 },
 },
 {
 id: "S19-T3-A-E2",
 subtopicId: "S19-T3-A",
 kind: "independent",
 title: "Tooltip con unidad y n",
 preamble:
 "- **Contexto:** un tooltip que dice solo “Madrid: 28 PEN” invita a leer 28 como población completa.\n- **Meta:** formatear el tooltip de Madrid con valor, unidad PEN y n=40.\n- **Éxito:** imprime exactamente `Madrid: 28 PEN (n=40)`.\n- **Límites:** no omitas la unidad ni el n; no uses otro orden de tokens.",
 instruction:
 "1. Revisa el starter: el tooltip tiene valor y unidad pero omite el tamaño muestral (bug).\n2. Completa el f-string para incluir `n` en el formato acordado del contrato a11y (mismo orden de tokens que el I Do).\n3. Imprime una sola línea.\n4. No redondees ni insertes espacios extra.",
 hint: "Incluye (n=…) en el f-string.",
 hints: [
 "Unidad PEN va después del valor.",
 "n documenta el tamaño de la celda filtrada.",
 ],
 edgeCases: ["sin unidad"],
 tests: "salida coincide con solution output",
 feedback:
 "Unidad + n son parte del contrato a11y del viewport. Sin n, el KPI se vende como censo; sin unidad, el número es ambiguo en un comité multi-métrica.",
 retrospective:
 "El hover es un canal de honestidad, no solo de “detalle cosmético”. Sin n, 28 se lee como censo. Pregunta de auto-chequeo: ¿qué token falta si el string termina en `PEN` sin paréntesis? Luego (E3) generalizas la plantilla a cualquier fila con una función pura.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · accessible tooltip
# Bug a corregir: sin n=
print(f"Madrid: {28} PEN")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `print(f"Madrid: {28} PEN (n={40})")`,
 output: `Madrid: 28 PEN (n=40)`,
 },
 },
 {
 id: "S19-T3-A-E3",
 subtopicId: "S19-T3-A",
 kind: "transfer",
 title: "Plantilla tooltip reutilizable por fila",
 preamble:
 "- **Contexto:** tooltips distintos “a mano” por región divergen y fallan el gate de a11y.\n- **Meta:** escribir `tooltip(row)` que devuelva `\"{region}: {median} PEN (n={n})\"`.\n- **Éxito:** para Bogota 22.5 n=32 imprime `Bogota: 22.5 PEN (n=32)`.\n- **Límites:** función pura solo con claves del dict; no hardcodees solo Madrid.",
 instruction:
 "1. Lee el defecto: la plantilla omite n.\n2. Incluye `(n={row['n']})` en el f-string.\n3. Deja el print de prueba con Bogota.\n4. No capturas KeyError en este lab (keys completas).",
 hint: "Función pura: solo usa claves del dict row.",
 hints: [
 "Incluye la unidad PEN de forma fija en la plantilla.",
 "n sale de row['n']; no hardcodees solo el valor de una región si generalizas.",
 ],
 edgeCases: ["keys faltantes → KeyError"],
 tests: "salida coincide con solution output",
 feedback:
 "Si falta `(n=…)`, la plantilla aún es incompleta aunque la región y el valor estén bien. Una función pura sobre `row` evita tooltips distintos “a mano” por región y pasa el gate de a11y del portfolio.",
 retrospective:
 "Una plantilla = un contrato. Pregunta de cierre: ¿qué falla si falta la clave `n` en el row? Puente a T3-B: paridad chart↔tabla y sampling honesto del estado.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · tooltip
# Bug a corregir: omite n
def tooltip(row):
 return f"{row['region']}: {row['median']} PEN"
print(tooltip({"region": "Bogota", "median": 22.5, "n": 32}))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def tooltip(row):
 return f"{row['region']}: {row['median']} PEN (n={row['n']})"
print(tooltip({"region": "Bogota", "median": 22.5, "n": 32}))`,
 output: `Bogota: 22.5 PEN (n=32)`,
 },
 },
 {
 id: "S19-T3-B-E1",
 subtopicId: "S19-T3-B",
 kind: "guided",
 title: "Paridad chart y tabla a 28.0",
 preamble:
 "- **Contexto:** la alternativa accesible miente si la tabla muestra 27.5 y la barra 28.0 “porque se veía mejor en la slide”.\n- **Meta:** alinear el ticket mediano de Madrid a la precisión publicada e imprimir el booleano de igualdad.\n- **Éxito:** imprime `True`.\n- **Límites:** misma precisión (un decimal); no uses redondeos distintos entre canales.",
 instruction:
 "1. Abre el starter: tabla en 27.5 vs. chart 28.0 (bug).\n2. Corrige la tabla a `28.0` (o alinea ambos a la precisión publicada).\n3. Imprime `chart[\"Lima\"] == table[0][\"ticket_mediano_pen\"]`.\n4. No imprimas texto extra.",
 hint: "chart['Lima'] == table[0]['ticket_mediano_pen'].",
 hints: [
 "La precisión publicada es un decimal: 28.0, no 27.5 ni 28.",
 "Corrige la tabla (o el chart) para que coincidan exactamente.",
 ],
 edgeCases: ["float con redondeos distintos entre chart y tabla"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin paridad numérica, la alternativa accesible miente. El gate del portfolio exige los mismos números a la precisión publicada, no un “casi igual” de diseño de diapositiva.",
 retrospective:
 "Chart y tabla son dos vistas del mismo contrato a la precisión publicada. El error clásico es “redondear bonito” solo en la diapositiva. Pregunta de auto-chequeo: ¿28 vs. 28.0 fallan igualdad en este lab? Siguiente (E2): el estado del viewport también declara `sample_n` y `universe_n`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · chart-table parity (Madrid)
# Bug a corregir: tabla 27.5 vs. chart 28.0
chart = {"Lima": 28.0, "Bogota": 22.5}
table = [{"region": "Lima", "ticket_mediano_pen": 27.5}]
print(chart["Lima"] == table[0]["ticket_mediano_pen"])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `chart = {"Lima": 28.0, "Bogota": 22.5}
table = [{"region": "Lima", "ticket_mediano_pen": 28.0}]
print(chart["Lima"] == table[0]["ticket_mediano_pen"])`,
 output: `True`,
 },
 },
 {
 id: "S19-T3-B-E2",
 subtopicId: "S19-T3-B",
 kind: "independent",
 title: "Estado JSON con sample y universo",
 preamble:
 "- **Contexto:** si el viewport muestra 5 000 filas de un universo de 50 000, ocultar el universo vende un sample como censo.\n- **Meta:** serializar estado con filtro Madrid, `sample_n=5000`, `universe_n=50000` y `ensure_ascii=False`.\n- **Éxito:** el JSON impreso incluye las tres claves de negocio con esos valores.\n- **Límites:** no dejes el estado solo con sample_n; no uses objetos no serializables.",
 instruction:
 "1. Revisa el starter: falta `universe_n` y ensure_ascii=True (bugs).\n2. Completa el dict de state.\n3. Serializa con `json.dumps(state, ensure_ascii=False)`.\n4. Imprime el string JSON resultante.",
 hint: "Incluye sample_n y universe_n; ensure_ascii=False.",
 hints: [
 "Sin universe_n el lector cree que 5000 es el censo.",
 "ensure_ascii=False evita escapes innecesarios en textos con tildes.",
 ],
 edgeCases: ["estado no serializable (sets, objetos)"],
 tests: "salida coincide con solution output",
 feedback:
 "Estado no serializable no se audita. `sample_n` sin `universe_n` oculta el sesgo del viewport: documenta ambos para no vender un sample como censo ante el comité.",
 retrospective:
 "Transparencia de sampling es integridad, no un “extra técnico”. El error clásico es mostrar 5000 y callarlo censo. Pregunta de auto-chequeo: ¿qué oculta un estado solo con `sample_n`? Luego (E3) el alt desde tabla lleva unidad PEN en cada par región=valor.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · filter json + sampling
# Bug a corregir: sin universe_n; ensure_ascii=True
import json
state = {"filtro_region": "Lima", "sample_n": 5000}
print(json.dumps(state, ensure_ascii=True))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import json
state = {"filtro_region": "Lima", "sample_n": 5000, "universe_n": 50000}
print(json.dumps(state, ensure_ascii=False))`,
 output: `{"filtro_region": "Lima", "sample_n": 5000, "universe_n": 50000}`,
 },
 },
 {
 id: "S19-T3-B-E3",
 subtopicId: "S19-T3-B",
 kind: "transfer",
 title: "Alt text con unidad desde tabla",
 preamble:
 "- **Contexto:** el alt text es la versión no visual del chart; sin unidad el lector de pantalla recibe números ambiguos.\n- **Meta:** unir cada fila como `region=v PEN` con separador `\"; \"`.\n- **Éxito:** `Madrid=28 PEN; Bogota=22 PEN`.\n- **Límites:** no omitas PEN; mantén el orden de la tabla.",
 instruction:
 "1. Lee el defecto: el f-string une región=valor sin unidad.\n2. Añade ` PEN` dentro del f-string.\n3. Deja el `\"; \".join(...)`.\n4. Imprime el string completo.",
 hint: "join con f-string que incluya PEN.",
 hints: [
 "Recorre cada r en table.",
 "Formato: {region}={v} PEN.",
 ],
 edgeCases: ["tabla vacía → string vacío"],
 tests: "salida coincide con solution output",
 feedback:
 "Si el string es `Madrid=28; Bogota=22`, aún falta la unidad en cada par. El lector de pantalla recibe números ambiguos en un comité multi-métrica. Añade ` PEN` dentro del f-string del join, sin cambiar el separador `\"; \"`.",
 retrospective:
 "Alt sin unidad es incompleto; alt sin n (T4-B) también. Puente a T4-A: el pie de figura (caption) aporta fuente y limitación que el alt no siempre detalla.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · table alt text
# Bug a corregir: join sin unidades
table = [{"region": "Madrid", "v": 28}, {"region": "Bogota", "v": 22}]
print("; ".join(f"{r['region']}={r['v']}" for r in table))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `table = [{"region": "Madrid", "v": 28}, {"region": "Bogota", "v": 22}]
print("; ".join(f"{r['region']}={r['v']} PEN" for r in table))`,
 output: `Madrid=28 PEN; Bogota=22 PEN`,
 },
 },
 {
 id: "S19-T4-A-E1",
 subtopicId: "S19-T4-A",
 kind: "guided",
 title: "Pie mínimo con unidad y fuente",
 preamble:
 "- **Contexto:** unidad sola no basta para trazabilidad; el portfolio exige al menos unidad y fuente en el pie.\n- **Meta:** completar el string al formato `unidad=PEN | fuente=sintetico`.\n- **Éxito:** esa línea exacta.\n- **Límites:** orden unidad luego fuente; no inventes un pie distinto por diapositiva.",
 instruction:
 "1. Abre el starter: solo imprime unidad (bug).\n2. Completa con ` | fuente=sintetico`.\n3. Imprime una sola línea.\n4. No cambies el token `sintetico` en este lab.",
 hint: "Une con \" | \" unidad y fuente.",
 hints: [
 "No omitas la clave fuente aunque sea sintético.",
 "Mantén el orden unidad luego fuente.",
 ],
 edgeCases: ["fuente vacía"],
 tests: "salida coincide con solution output",
 feedback:
 "Si solo ves `unidad=PEN`, falta la fuente: no hay trazabilidad para auditar ni re-renderizar con el mismo marco. Completa el pie en el orden unidad luego fuente; el token `sintetico` del lab no se inventa por diapositiva.",
 retrospective:
 "Pie mínimo = qué mide + de dónde sale. El error clásico es dejar la unidad suelta en el título y olvidar la fuente. Pregunta de auto-chequeo: ¿entra al portfolio un pie sin `fuente=`? Siguiente (E2): el dict de caption también exige la clave `limitacion`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · pie caption
# Bug a corregir: omite fuente
print("unidad=PEN")`,
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
 title: "Caption con unidad, fuente y limitación",
 preamble:
 "- **Contexto:** sin `limitacion`, el título del chart puede sobre-extenderse (“todo el canal”, “todo el Perú”) sin marco.\n- **Meta:** completar el dict de caption y validar que incluye `unidad`, `fuente` y `limitacion`.\n- **Éxito:** imprime `True`.\n- **Límites:** valor de limitacion no vacío (p. ej. `web`); no typos en el nombre de la clave.",
 instruction:
 "1. Revisa el starter: faltan la clave y el valor de `limitacion` (bug).\n2. Añade `limitacion` al dict.\n3. Deja el print del superset de claves.\n4. No borres unidad ni fuente.",
 hint: "set(cap) >= {\"unidad\", \"fuente\", \"limitacion\"}.",
 hints: [
 "Añade limitacion con un valor no vacío (p. ej. web).",
 "No basta con tener unidad y fuente.",
 ],
 edgeCases: ["typo en clave limitacion"],
 tests: "salida coincide con solution output",
 feedback:
 "`limitacion` documenta el marco (solo canal web, n bajo, etc.). Sin ella el claim del título puede vender generalizaciones que el EDA de S18 no soporta.",
 retrospective:
 "Tres claves mínimas del pie estructurado: `unidad`, `fuente`, `limitacion`. Sin la tercera, el título puede vender “todo el canal” o “todo el Perú”. Pregunta de auto-chequeo: ¿`set(cap)` con typo `limitación` pasa el gate? Luego (E3) un formatter reutilizable une `k: v` para S21.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · caption keys
# Bug a corregir: falta limitacion
cap = {"unidad": "PEN", "fuente": "x"}
print(set(cap) >= {"unidad", "fuente", "limitacion"})`,
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
 title: "Formatter pie k: v",
 preamble:
 "- **Contexto:** un pie que solo lista nombres de clave (“unidad | n”) no comunica nada al lector del informe.\n- **Meta:** implementar `pie(cap)` que une `k: v` con `\" | \"`.\n- **Éxito:** `unidad: PEN | n: 10` para el dict de prueba.\n- **Límites:** usa `.items()`; respeta el orden de inserción del dict.",
 instruction:
 "1. Lee el defecto: join solo sobre keys.\n2. Cambia a `f\"{k}: {v}\"` sobre `cap.items()`.\n3. Deja el print de prueba.\n4. No hardcodees el string de salida.",
 hint: "join de f\"{k}: {v}\" sobre cap.items().",
 hints: [
 "Usa .items() para no perder los valores.",
 "El orden de inserción del dict define el orden del pie.",
 ],
 edgeCases: ["valores None"],
 tests: "salida coincide con solution output",
 feedback:
 "Si la salida es `unidad | n`, el join aún recorre solo keys: perdiste los valores. Usa `.items()` y formatea `k: v`. Un pie de nombres de clave no comunica nada al lector del informe.",
 retrospective:
 "`k: v` es el contrato estable hacia S21: el DOCX no debe reinventar el string por figura. El error clásico es listar solo claves o hardcodear el pie. Pregunta de auto-chequeo: ¿qué imprime si añades `fuente` al dict de prueba? Puente a T4-B: el lenguaje del claim y el alt con n cierran la integridad ética.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · pie formatter
# Bug a corregir: solo keys
def pie(cap):
 return " | ".join(str(k) for k in cap)
print(pie({"unidad": "PEN", "n": 10}))`,
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
 title: "Rechazar sobreclaim nacional sin muestra",
 preamble:
 "- **Contexto:** generalizar de una muestra web a “todo el Perú” es el sobreclaim típico del dashboard ejecutivo.\n- **Meta:** clasificar el claim “Madrid es la mejor del Perú”: RECHAZADO si menciona “del Perú” y no menciona “muestra”.\n- **Éxito:** imprime `RECHAZADO`.\n- **Límites:** no apruebes el claim por “sonar confiado”; no uses NLP externo.",
 instruction:
 "1. Abre el starter: imprime `OK` a mano (bug).\n2. Implementa la regla con substrings `\"del Perú\"` y `\"muestra\"`.\n3. Imprime `RECHAZADO` u `OK` según la condición.\n4. Deja el claim del fixture sin editarlo para “hacerlo pasar”.",
 hint: "Chequea substrings \"del Perú\" y \"muestra\".",
 hints: [
 "Sobreclaim típico: generaliza al país sin marco muestral.",
 "Condiciona con substrings; no edites el claim del fixture para forzar el pass.",
 ],
 edgeCases: ["claims legítimos locales con muestra"],
 tests: "salida coincide con solution output",
 feedback:
 "Generalizar de una muestra web a “todo el Perú” es sobreclaim. Exige el marco muestral en el lenguaje del dashboard; el contraste de color no lo arregla.",
 retrospective:
 "La regla didáctica es dura a propósito: entrena el hábito antes de la política fina. Siguiente (E2): alt con `n=` y hatch como canal no-color (doble gate a11y).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · overclaim
# Bug a corregir: aprueba claim sin muestra
claim = "Madrid es la mejor del Perú"
print("OK")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `claim = "Madrid es la mejor del Perú"
print("RECHAZADO" if ("del Perú" in claim and "muestra" not in claim) else "OK")`,
 output: `RECHAZADO`,
 },
 },
 {
 id: "S19-T4-B-E2",
 subtopicId: "S19-T4-B",
 kind: "independent",
 title: "Alt con n= y hatch no-color",
 preamble:
 "- **Contexto:** alt sin tamaño muestral es incompleto; categorías solo por color fallan a lectores daltónicos (WCAG 1.4.1).\n- **Meta:** (1) alt con patrón `n=`; (2) hatch distinto de `None`. Imprimir dos booleanos, uno por línea.\n- **Éxito:**\n  `True`\n  `True`\n- **Límites:** hatch real (p. ej. `//`); no uses string vacío como hatch.",
 instruction:
 "1. Revisa el starter: alt sin n y hatch=None (bugs).\n2. Completa el alt (p. ej. incluye `n=40`).\n3. Asigna un patrón de hatch y verifica `hatch is not None`.\n4. Imprime primero el check de n, luego el de hatch.",
 hint: "Completa el alt con n=…; asigna hatch (p. ej. '//') al primer patch o al dict de estilo.",
 hints: [
 "Primero arregla el string alt para que contenga n=.",
 "Luego define hatch='//' (u otro patrón Matplotlib) y verifica hatch is not None.",
 ],
 edgeCases: ["hatch vacío '' cuenta como falsy — usa un patrón real."],
 tests: "salida coincide con solution output",
 feedback:
 "Alt sin `n=` es incompleto. Hatch (o etiqueta/posición) evita que el daltonismo pierda la categoría: color solo no basta para el gate de a11y del portfolio.",
 retrospective:
 "Dos canales de honestidad: texto no visual con `n=` y encoding no solo-color (hatch). El error clásico es confiar en el contraste del azul. Pregunta de auto-chequeo: ¿`hatch = \"\"` pasa el check `is not None`? Luego (E3) un clasificador reutilizable de claims cierra el subtema.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · alt n= + hatch no-color
# Bug a corregir: alt sin n; hatch=None (solo color)
alt = "Madrid 28 PEN"
hatch = None
print("n=" in alt)
print(hatch is not None)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `alt = "Madrid 28 PEN n=40"
hatch = "//"
print("n=" in alt)
print(hatch is not None)`,
 output: `True
True`,
 },
 },
 {
 id: "S19-T4-B-E3",
 subtopicId: "S19-T4-B",
 kind: "transfer",
 title: "classify_claim por marco muestral",
 preamble:
 "- **Contexto:** el gate didáctico del portfolio: sin la palabra “muestra” (u otro marco explícito en producción), el claim no pasa.\n- **Meta:** implementar `classify_claim(text)` → PERMITIDO si contiene “muestra”, si no RECHAZADO; clasificar dos frases.\n- **Éxito:**\n  `PERMITIDO`\n  `RECHAZADO`\n- **Límites:** regla de substring, no NLP; dos prints en el orden de las frases dadas.",
 instruction:
 "1. Lee el defecto: siempre devuelve PERMITIDO.\n2. Condiciona con `\"muestra\" in text`.\n3. Deja los dos prints de prueba.\n4. No edites las frases para forzar el pass.",
 hint: "Regla binaria didáctica con `\"muestra\" in text`.",
 hints: [
 "No intentes NLP: substring basta para el lab.",
 "Dos prints, en el orden de las dos frases de prueba.",
 ],
 edgeCases: ["falsos positivos si la palabra aparece en otro sentido"],
 tests: "salida coincide con solution output",
 feedback:
 "El gate didáctico entrena el hábito: sin marco muestral, el claim no pasa. En producción refinarías la política; aquí la regla es explícita y testeable.",
 retrospective:
 "En producción refinarías la política; aquí la regla es explícita y testeable. Pregunta de cierre: ¿cómo reescribirías “es la mejor del país” para que pase? Puente al You Do: el dashboard completo aplica chart choice, baseline, export, a11y y claims juntos.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · classify claim
# Bug a corregir: siempre PERMITIDO
def classify_claim(text):
 return "PERMITIDO"
print(classify_claim("lidera en la muestra web"))
print(classify_claim("es la mejor del país"))`,
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
 }
 ],
 },
 youDo: {
 title: "Dashboard accesible CP-N2-B",
 context:
 "Construye el incremento *dashboard* de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a la evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por **regiones sintéticas** Madrid/Bogota/Berlin en PEN). El starter trae datos y un esqueleto de funciones: completa cada builder, exporta PNG reales y escribe alt y tabla con paridad.",
 objectives: [
 "Elegir charts por pregunta/audiencia y documentar el brief",
 "Ejes honestos (baseline 0 en barras) y unidades visibles en el ylabel",
 "Export versionado (savefig real) + captions con unidad/fuente/limitación",
 "Alt text por figura y claims sin sobreclaim nacional",
 "Paridad numérica chart/tabla y canal no-color (hatch o etiqueta)",
 ],
 requirements: [
 "Datos sintéticos únicamente (sin PII real); usa el DataFrame del starter o equivalente documentado",
 "ylim de barras desde 0 salvo justificación escrita en el caption",
 "Caption con unidad, fuente y limitación en cada figura",
 "Alt text por figura con hallazgo + n (y unidad)",
 "Tabla de paridad con los mismos números que los charts (misma precisión)",
 "Categorías críticas: no solo color — hatch, etiqueta o posición como canal extra",
 "Si el viewport usa sample, declara sample_n y universe_n (no vender sample como censo)",
 "es-PE en títulos y conclusiones; claims acotados a la muestra",
 "Una spec de vista interactiva (filtro + plantilla de tooltip), sin librería obligatoria",
 "Export real: savefig (PNG) con dpi documentado y nombre versionado (fig_cpn2b_v*.png)",
 "Checklist de aceptación: 4 PNG + vista_logica.json + tabla_paridad + alt_*.txt; plt.close en cada builder",
 ],
 starterCode: `"""
CP-N2-B — Dashboard accesible (esqueleto)
Entrega mínima:
  1) fig_bar_medianas.png — barras, ylim 0, ylabel PEN, hatch o etiqueta, n en caption
  2) fig_bar_volumen.png — n por región (baseline 0)
  3) fig_line_tendencia.png — serie semanal sintética
  4) fig_scatter_n_vs_median.png — relación n–mediana (sin claim causal)
  5) vista_logica.json — filtro activo + plantilla de tooltip + sample si aplica
  6) tabla_paridad.csv + alt_*.txt por figura

Checklist rápido antes de entregar:
  [ ] get_ylim()[0] == 0 en barras de magnitudes absolutas
  [ ] ylabel con unidad; caption con unidad | fuente | limitacion
  [ ] alt con n=; paridad chart↔tabla a la misma precisión
  [ ] claims con “muestra” (nunca “del Perú” sin marco)
  [ ] savefig real + plt.close; backend Agg
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import json

df = pd.DataFrame({
    "region": ["Lima", "Madrid", "Bogota"],
    "median_pen": [28.0, 24.0, 22.5],
    "n": [40, 28, 32],
})

# Serie semanal sintética (tickets) para la línea de tendencia
tendencia = pd.DataFrame({
    "semana": [1, 2, 3, 4],
    "tickets": [120, 132, 128, 140],
})

def build_bar_median(df):
    """Barras de mediana PEN con baseline 0, ylabel y canal no-color."""
    fig, ax = plt.subplots(figsize=(6, 3.5))
    labels = list(df["region"])
    values = list(df["median_pen"])
    hatches = ["//", "\\\\", ".."]
    bars = ax.bar(labels, values, color="#2c5282", hatch=hatches[: len(labels)])
    ax.set_ylabel("Ticket mediano (PEN)")
    ax.set_title("Ticket mediano por región (muestra web sintética)")
    ax.set_ylim(0, max(values) * 1.2)
    ax.bar_label(bars, fmt="%.1f")
    # Contrato mínimo verificado: baseline 0 + unidad en ylabel
    assert ax.get_ylim()[0] == 0.0
    assert "PEN" in ax.get_ylabel()
    return fig, ax

def build_bar_volumen(df):
    """Barras de n por región (conteos absolutos → baseline 0)."""
    fig, ax = plt.subplots(figsize=(6, 3.5))
    # TODO: ax.bar(df["region"], df["n"]); ylabel; ylim 0; título con “muestra”
    return fig, ax

def build_line_tendencia(tendencia):
    """Línea de tickets semanales (sintético)."""
    fig, ax = plt.subplots(figsize=(6, 3.5))
    # TODO: ax.plot(...); ylabel tickets; título de tendencia
    return fig, ax

def build_scatter_n_median(df):
    """Scatter n vs. mediana; documenta que n no implica causalidad."""
    fig, ax = plt.subplots(figsize=(6, 3.5))
    # TODO: ax.scatter; etiquetas de región; sin claim causal en el título
    return fig, ax

def caption(meta: dict) -> str:
    """Une unidad | fuente | limitacion (y n si aplica)."""
    # TODO: return " | ".join(f"{k}: {v}" for k, v in meta.items())
    raise NotImplementedError

def alt_text(df, hallazgo: str) -> str:
    """Hallazgo principal + n por región; sin sobreclaim nacional."""
    # Ejemplo de forma: "En la muestra web, Madrid lidera (28 PEN, n=40); ..."
    # TODO: combina hallazgo + filas de df con n=
    raise NotImplementedError

def vista_interactiva(df, region: str) -> dict:
    """Spec: filtro + tooltip con unidad y n (sin librería interactiva obligatoria)."""
    # TODO: row = df[df.region==region].iloc[0]
    # return {"filtro": region, "tooltip": f"... PEN (n=...)", "sample_n": 5000, "universe_n": 50000}
    raise NotImplementedError

def export_png(fig, path: str, dpi: int = 120) -> dict:
    """Guarda PNG real y devuelve meta versionable (fmt, dpi, path)."""
    # TODO: fig.savefig(path, dpi=dpi, bbox_inches="tight"); plt.close(fig)
    # return {"fmt": "png", "dpi": dpi, "path": path}
    raise NotImplementedError

def tabla_paridad(df) -> pd.DataFrame:
    """Misma precisión que el chart de medianas (1 decimal en PEN)."""
    out = df[["region", "median_pen", "n"]].copy()
    out["median_pen"] = out["median_pen"].round(1)
    return out

# Smoke: figura de medianas (completa el resto y exporta)
fig, ax = build_bar_median(df)
print("median_ylim0", float(ax.get_ylim()[0]))
print("median_ylabel", ax.get_ylabel())
print("paridad", tabla_paridad(df).to_dict(orient="records"))
plt.close(fig)
`,
 portfolioNote:
 "Dashboard de la factoría CP-N2-B; se integra con Excel (S20) y reportes (S21). Entrega figuras versionadas + specs JSON + alts/tabla de paridad. Completa los builders pendientes y documenta limitaciones (canal web, n regional). En el README, lista los 4 PNG y un claim permitido vs. uno rechazado para la defensa oral.",
 retrospective:
 "Antes de marcar listo: (1) ¿qué assert o print demuestra baseline 0 y ylabel con PEN en cada barra de magnitudes absolutas? (2) ¿la tabla de paridad y cada alt usan la misma precisión y el mismo n que el chart? (3) Elige un claim del dashboard y reescríbelo en 15 segundos acotado a la muestra web sintética — si suena a “todo el Perú”, aún no entregas. (4) En el README, una frase de impacto medible (antes: eje recortado / sin alt; después: contrato visual + a11y) que puedas defender en 30 segundos ante operaciones.",
 rubric: [
 { criterion: "Charts honestos (baseline 0 en barras, unidades visibles) + alt/tabla con paridad numérica", weight: "25%" },
 { criterion: "Cuatro figuras estáticas + una spec de vista interactiva (filtro/tooltip)", weight: "20%" },
 { criterion: "Captions con unidad, fuente y limitación; export PNG real versionado", weight: "15%" },
 { criterion: "Sin sobreclaim: lenguaje acotado a la muestra; sin PII real", weight: "15%" },
 { criterion: "Código legible, funciones reutilizables, backend Agg y close de figuras", weight: "15%" },
 { criterion: "Documentación en español profesional (es-PE); canal no-color en categorías críticas", weight: "10%" }
 ],
 },
 selfCheck: {
 questions: [
 {
 question: "Para comparar magnitudes entre categorías, ¿qué chart es usualmente preferible?",
 options: ["Pie 3D", "Dual axis sin escala", "Barras con baseline 0", "Word cloud"],
 correctIndex: 2,
 explanation:
 "Las barras con baseline 0 comunican magnitudes absolutas de forma honesta. Pie 3D distorsiona áreas; dual-axis sin escala confunde; word cloud no compara cantidades.",
 },
 {
 question: "Una alternativa accesible debe:",
 options: ["Repetir los mismos números clave del chart", "Ser opcional siempre", "Solo ser una imagen más grande", "Eliminar las unidades"],
 correctIndex: 0,
 explanation:
 "Paridad numérica: tabla o texto con los mismos valores y unidades que el chart. Agrandar la imagen no sustituye un equivalente no visual.",
 },
 {
 question: "“Lima es la mejor región del Perú” a partir de una muestra web es:",
 options: ["Un claim permitido", "Sobreclaim / generalización indebida", "Un alt text correcto", "Una unidad"],
 correctIndex: 1,
 explanation:
 "El lenguaje no debe exceder la cobertura de la muestra. Formulación permitida: “en la muestra web sintética, Madrid muestra el ticket mediano más alto”.",
 },
 {
 question: "El caption de un gráfico de portfolio debe incluir:",
 options: ["Solo el color favorito", "La contraseña del sistema BI", "Nada", "Unidad, fuente y limitaciones"],
 correctIndex: 3,
 explanation:
 "Trazabilidad y honestidad metodológica: unidad, fuente, corte y limitación viajan con la figura hacia S20/S21.",
 },
 {
 question: "Un gráfico de barras de montos PEN recorta el eje Y para empezar en 40 en lugar de 0. ¿Qué debe hacer el gate de integridad del dashboard CP-N2-B?",
 options: ["Aceptarlo si los colores tienen buen contraste", "Convertirlo automáticamente a dual-axis para “ganar espacio”", "Marcarlo como riesgo de inflación visual y exigir baseline 0 o justificación explícita", "Eliminar las etiquetas de ejes para que se vea más limpio en la diapositiva"],
 correctIndex: 2,
 explanation:
 "Recortar el baseline de barras de magnitudes absolutas infla diferencias percibidas. El gate pide ylim 0 o justificación documentada; contraste o dual-axis no corrigen el encoding deshonesto.",
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
 label: "Matplotlib cheatsheets",
 url: "https://matplotlib.org/cheatsheets/",
 note: "Referencia rápida de API",
 },
 {
 label: "Matplotlib colormaps",
 url: "https://matplotlib.org/stable/users/explain/colors/colormaps.html",
 note: "Paletas y contraste visual",
 },
 {
 label: "WCAG 2.2 — contraste mínimo",
 url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
 note: "Criterio de contraste texto/fondo",
 },
 {
 label: "WCAG 1.4.1 — uso del color",
 url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
 note: "No confiar solo en color para categorías",
 },
 {
 label: "From Data to Viz",
 url: "https://www.data-to-viz.com/",
 note: "Chart choice por tipo de dato y pregunta",
 },
 {
 label: "UW Accessible Data Visualization",
 url: "https://www.washington.edu/accessibility/checklist/data-visualization/",
 note: "Checklist a11y para charts (alt, contraste, no solo color)",
 },
 {
 label: "Seaborn tutorial (estilo opcional)",
 url: "https://seaborn.pydata.org/tutorial.html",
 note: "Estilo sobre Matplotlib; no requerido en ejercicios S19",
 },
 ],
 books: [
 {
 label: "Fundamentals of Data Visualization (Wilke)",
 note: "Encodings, ejes honestos y honestidad visual",
 },
 {
 label: "Storytelling with Data (Knaflic)",
 note: "Audiencia, claridad y eliminación de ruido",
 },
 ],
 courses: [
 {
 label: "Real Python — Matplotlib guide",
 url: "https://realpython.com/python-matplotlib-guide/",
 note: "Guía práctica de figuras y workflow",
 },
 {
 label: "Data Visualization Society",
 url: "https://www.datavisualizationsociety.org/",
 note: "Comunidad y ética de la visualización",
 },
 {
 label: "Harvard HUIT — accessible charts",
 url: "https://accessibility.huit.harvard.edu/describe-content-images",
 note: "Descripción de contenido visual / alt",
 },
 {
 label: "PyArcana live — Sección 19",
 url: "https://pillb.github.io/pyarcana/#databases-orm",
 note: "Dashboard accesible CP-N2-B en el curso desplegado",
 },
 ],
 },
}
