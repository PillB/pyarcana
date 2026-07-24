import type { CourseSection } from '../../types'

export const section19: CourseSection = {
 id: "databases-orm",
 index: 19,
 title: "Visualización y comunicación accesible",
 shortTitle: "Viz accesible",
 tagline: "cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente",
 estimatedHours: 19,
 level: "Competente",
 phase: 1,
 icon: "BarChart3",
 accentColor: "bg-gradient-to-br from-teal-500 to-cyan-700",
 jobRelevance:
 "En equipos de analytics y reporting en Perú, una **visualización accesible y honesta** es el puente entre el EDA y las decisiones. Aquí construyes el incremento **CP-N2-B (dashboard)**: charts con ejes honestos, figuras Matplotlib exportables, tooltips/filtros modelados como especificación de datos y alternativas no visuales con los mismos números.",
 learningOutcomes: [
 { text: "Elegir charts por pregunta y audiencia" },
 { text: "Diseñar ejes, escalas y encodings honestos" },
 { text: "Producir figuras Matplotlib con contrato visual verificable" },
 { text: "Anotar y exportar de forma reproducible" },
 { text: "Modelar vistas interactivas lógicas (filtros/tooltips) sin librería obligatoria" },
 { text: "Proveer alternativas accesibles y cuidar performance del viewport" },
 { text: "Documentar unidades, fuente y limitaciones en captions" },
 { text: "Aplicar contraste, alt text y lenguaje sin sobreclaim" }
 ],
 theory: [
 {
 heading: "Mapa de la sección: visualización y comunicación accesible",
 paragraphs: [
 "**Diccionario breve de la sección.** *Pregunta analítica:* qué decisión habilita el gráfico. *Audiencia:* ejecutivo (pocas categorías, una idea) vs analista (más detalle). *Encoding:* canal visual (posición, longitud, color, forma). *Baseline:* origen del eje; en barras de magnitudes absolutas debe ser 0. *Alt text:* equivalente no visual con hallazgo y n. *Paridad:* los mismos números en chart, tabla y caption. *Sobreclaim:* lenguaje que excede la evidencia de la muestra.",
 "Desde el EDA de S18 llegas con medianas, n e incertidumbre por región (Lima / Cusco / Arequipa, PEN, datos sintéticos). Aquí **traduces el hallazgo a figura**: el mismo “mediana por región, n, limitación web” se empaqueta como chart + caption + alt + tabla hermana. Hallazgo ≠ decisión: el dashboard muestra evidencia, no un veredicto de negocio disfrazado de color.",
 "Orden pedagógico: **T1 Intención** (pregunta, audiencia, chart choice y ejes honestos) → **T2 Estático** (Matplotlib, composición multi-panel, export versionado) → **T3 Interactivo y a11y** (modelo de filtros/tooltips, estado serializable, tabla alternativa) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). Progressive disclosure: sin ORMs ni SQL nuevos; el foco es comunicación visual honesta para CP-N2-B, que luego alimenta el factory Excel (S20) y reportes (S21).",
 ],
 callout: {
 type: "info",
 title: "Fuera de alcance en S19",
 content:
 "No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.",
 },
 },
 {
 heading: "Pregunta, audiencia y elección de gráfico",
 subtopicId: "S19-T1-A",
 paragraphs: [
 "La **elección de gráfico** (*chart choice*) responde a la pregunta, no a la librería de moda. Comparar totales o medianas entre pocas regiones → barras; tendencia temporal → línea; relación entre dos cuantitativas → scatter. Documenta en metadata: `pregunta`, `chart_type`, `audiencia` (ejecutivo vs analista). Un pie 3D casi nunca es la respuesta correcta para un comité.",
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
 "Caso: valores 50 vs 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. Calcula el factor de inflación visual `(altura_truco / altura_honesta)` antes de exportar al dashboard de CP-N2-B: si el factor es grande, el gráfico no pasa el gate de integridad.",
 ],
 code: {
 language: 'python',
 title: "honest_axes.py",
 code: `def s19_th_2():
    vals = {"Lima": 100, "Cusco": 90}
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
 "Matplotlib construye la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el slice está filtrado. Seaborn (opcional, no requerido en ejercicios) puede aportar estilo (`sns.set_theme`) sobre los mismos ejes de Matplotlib; el contrato visual sigue siendo el de los axes.",
 "Contrato de export: `bbox_inches='tight'`, dpi documentado (p. ej. 120), nombre versionado. En demos del curso a veces solo imprimimos metadatos sin binario; en local guardas PNG/SVG según audiencia (slides vs impresión). Tests no miran “se ve bien en mi monitor”: miran `get_ylim()[0]==0`, `get_ylabel()` y conteo de barras.",
 "Caso: bar de regiones con `ylabel='PEN'` y `ylim(0, …)`. Ordena barras por valor si la pregunta es “quién lidera”; orden alfabético si la pregunta es “catálogo de regiones”. Cierra siempre la figura con `plt.close(fig)` en scripts y CI (backend `Agg`).",
 ],
 code: {
 language: 'python',
 title: "mpl_bar.py",
 code: `def s19_th_3():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(5, 3))
    ax.bar(["Lima", "Cusco"], [28.0, 22.5], color="#1f4e79")
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
 "Multi-panel (`subplots`) alinea comparaciones (volumen vs mediana). Anota valores clave con `bar_label` o `annotate` sin saturar: una anotación por insight, no un sticker en cada barra si ya hay tabla hermana. Export: PNG para slides, SVG/PDF para impresión; nombre `fig_cpn2b_v{version}.png`.",
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
 "Modelamos la **vista interactiva** como especificación de datos: campos filtrables, plantilla de tooltip y viewport. No hace falta instalar Plotly para diseñar el contrato: si el modelo es claro, migrar a Plotly, Streamlit o cualquier front es mecánico. Los tooltips deben mostrar **unidades y n**, no solo el valor “bonito”.",
 "Contrato: al filtrar por región, el texto de conclusión del viewport se **recalcula**; no reutilices el párrafo global de “Lima lidera” si el filtro es Cusco. Serializa el state (JSON) para auditoría del dashboard. El lookup por región es O(n) sobre filas sintéticas: suficiente para el lab; en producción agregarías índice o pre-agregación.",
 "Caso: row `{region:'Lima', median:28, n:40}` → tooltip `Lima: 28 PEN (n=40)`. Paridad chart↔tabla: si la barra dice 28, la fila de tabla dice 28; si no, el gate de integridad falla antes del export.",
 ],
 code: {
 language: 'python',
 title: "interactive_spec.py",
 code: `def s19_th_5():
    rows = [
     {"region": "Lima", "monto": 28.0, "n": 40},
     {"region": "Cusco", "monto": 22.5, "n": 32},
     {"region": "Arequipa", "monto": 24.0, "n": 28}
    ]
    filtro = "Lima"
    vista = [r for r in rows if r["region"] == filtro]
    tooltip = {**vista[0], "unidad": "PEN", "nota": "sintético"}
    print("filtro", filtro)
    print("tooltip", tooltip)

s19_th_5()`,
 output: `filtro Lima
tooltip {'region': 'Lima', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}`,
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
 "El **estado** del dashboard (filtros activos) debe ser serializable (`json.dumps`). Evita recalcular todo el universo en cada hover; limita puntos en scatter (sample o aggregate) y documenta si hay sampling. Ejemplo de honestidad de performance: “viewport muestra sample 5 000 de 50 000 filas” — nunca ocultes el sesgo muestral del viewport ni lo presentes como censo.",
 "Contrato a11y: alternativa accesible = tabla ordenable + resumen textual con **los mismos números** que el chart. Sin tabla hermana, el gráfico no entra solo al portfolio ejecutivo. El alt text no es “imagen de barras”: es el hallazgo + n + unidad.",
 "Caso: `filtro_region=Lima` → state JSON compacto; `alt_text` une `region=v PEN` con `; `. La paridad se verifica con igualdad de valores a la precisión publicada (mismo redondeo en chart y tabla).",
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
    alt_table = [{"region": "Lima", "ticket_mediano_pen": 28.0, "n": 40}]
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
En Lima, ticket mediano 28.0 PEN (n=40).
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
 "Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`. Sin fuente, el gráfico **no entra** al portfolio de CP-N2-B.",
 "Contrato de caption: dict con claves `unidad`, `fuente`, `limitacion` (y n cuando aplique). Función `pie(cap)` une con ` | ` para el footer estable entre dashboard e informe. El orden de claves es parte del contrato si serializas para tests.",
 "Caso sintético: unidad PEN, fuente `sintetico`, limitación “solo canal web”. El mismo pie viaja a S21 para que el DOCX no invente otra fuente. “28” sin PEN o sin % es un defecto de reporting, no un detalle cosmético.",
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
 "“28” sin PEN o sin % es un defecto de reporting.",
 },
 },
 {
 heading: "Color, contraste, texto alternativo y no sobreclaim",
 subtopicId: "S19-T4-B",
 paragraphs: [
 "Contraste suficiente texto/fondo; no uses **solo color** para categorías críticas — añade patrón (`hatch` en Matplotlib: `'//'`, `'\\\\'`, `'..'`), etiqueta de valor o posición. Paletas amigables con daltonismo (p. ej. evitar rojo/verde exclusivos; preferir azul/naranja o viridis) reducen riesgo; el canal de posición sigue siendo el más robusto. **Alt text** describe el hallazgo principal y n, no “imagen de barras”.",
 "Contrato de claims: “Lima lidera en la **muestra** web” es permitido; “Lima es la mejor región del Perú” sin marco poblacional es **RECHAZADO**. `classify_claim` es el gate didáctico del We Do: si el texto generaliza a la población sin “muestra”, falla. En el portfolio, el color y el contraste no redimen un sobreclaim en el título.",
 "Caso: alt `Lima 28 PEN n=40` debe contener `n=`; claim con “del Perú” sin “muestra” → RECHAZADO. Cierra el loop ético del dashboard antes del reporting factory (S20/S21): si dos regiones se distinguen solo por tono, añade hatch o etiqueta antes de exportar.",
 ],
 code: {
 language: 'python',
 title: "alt_claim.py",
 code: `def s19_th_8():
    alt = (
     "Barras del ticket mediano sintético: Lima 28 PEN (n=40), "
     "Arequipa 24 (n=28), Cusco 22.5 (n=32). Eje Y desde 0."
    )
    claim_ok = "En la muestra web sintética, Lima muestra el ticket mediano más alto."
    claim_bad = "Lima es la región más rentable del Perú."
    print("alt_len", len(alt))
    print("usa_claim_ok", True)
    print("evita", claim_bad[:20] + "...")

s19_th_8()`,
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
 }
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
 why: "Mostrar el factor de inflación educa sobre encodings deshonestos.",
 },
 {
 demoId: "S19-T2-A-DEMO",
 subtopicId: "S19-T2-A",
 environment: "local-python",
 description: "Componer barra Matplotlib con ylim desde 0, unidad y canal no-color (hatch)",
 code: {
 language: 'python',
 title: "demo_mpl.py",
 code: `def s19_ido_3():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    reg = ["Lima", "Arequipa", "Cusco"]
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
 why: "Figura mínima viable: baseline 0, unidad y hatch como canal no-color (a11y).",
 },
 {
 demoId: "S19-T2-B-DEMO",
 subtopicId: "S19-T2-B",
 environment: "local-python",
 description: "Anotar, guardar PNG real (BytesIO) y exportar metadata multi-panel",
 code: {
 language: 'python',
 title: "demo_compose.py",
 code: `def s19_ido_4():
    import io
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, (ax0, ax1) = plt.subplots(1, 2, figsize=(8, 3))
    ax0.bar(["Lima", "Cusco"], [40, 32])
    ax0.set_title("n por región")
    ax0.set_ylim(0, 50)
    ax1.barh(["Lima", "Cusco"], [28, 22.5])
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
 why: "savefig real (no solo dict) + nombre versionado habilita re-render del portfolio.",
 },
 {
 demoId: "S19-T3-A-DEMO",
 subtopicId: "S19-T3-A",
 environment: "local-python",
 description: "Vista interactiva lógica con filtro y tooltip honesto",
 code: {
 language: 'python',
 title: "demo_tooltip.py",
 code: `def s19_ido_5():
    data = [
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
    print(view("Cusco")["tooltip"])

s19_ido_5()`,
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
 code: `def s19_ido_6():
    chart = {"Lima": 28.0, "Cusco": 22.5}
    table = [{"region": k, "ticket_mediano_pen": v} for k, v in chart.items()]
    text = "; ".join(f"{r['region']}={r['ticket_mediano_pen']} PEN" for r in table)
    print(table)
    print(text)
    print("parity", all(chart[r["region"]] == r["ticket_mediano_pen"] for r in table))

s19_ido_6()`,
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
 code: `def s19_ido_7():
    cap = {
     "titulo": "Ticket mediano por región",
     "unidad": "PEN",
     "fuente": "sintético CP-N2-B",
     "corte": "2024-06-30",
     "limitacion": "canal web; n bajo en Cusco",
    }
    print("pie", f"Unidad: {cap['unidad']} | Fuente: {cap['fuente']} | Corte: {cap['corte']} | Límite: {cap['limitacion']}")

s19_ido_7()`,
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
 code: `def s19_ido_8():
    alt = "Barras: Lima 28 PEN, Arequipa 24, Cusco 22.5; muestra web sintética n=100."
    claims = [
     ("Lima lidera el ticket mediano en la muestra web", True),
     ("Lima es la mejor región del Perú", False),
    ]
    for c, ok in claims:
     print(c[:40], "=>", "PERMITIDO" if ok else "RECHAZADO")
    print("alt_words", len(alt.split()))

s19_ido_8()`,
 output: `Lima lidera el ticket mediano en la mues => PERMITIDO
Lima es la mejor región del Perú => RECHAZADO
alt_words 12`,
 },
 why: "Contraste de claims entrena el lenguaje del dashboard.",
 }
 ],
 },
 weDo: {
 intro: "24 ejercicios de elección de chart, ejes, Matplotlib, tooltips lógicos, a11y y claims. Cada starter trae un bug intencional: corrígelo con el contrato del subtema (baseline, unidades, paridad, claims). No busques un texto de “pass” en la consigna: razona el diseño y verifica la salida.",
 steps: [
 {
 id: "S19-T1-A-E1",
 subtopicId: "S19-T1-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — El comité quiere **comparar** el ticket mediano entre regiones (pocas categorías, magnitud absoluta). El starter elige un tipo de chart inadecuado para esa pregunta. Corrige la elección e imprime solo el tipo de chart resultante.",
 hint: "Comparar magnitudes entre categorías se lee mejor en barras.",
 hints: [
 "Pregunta de comparación → barras (bar), no serie temporal.",
 "Imprime únicamente el tipo de chart corregido.",
 ],
 edgeCases: ["serie temporal mal clasificada como bar"],
 tests: "salida coincide con solution output",
 feedback:
 "Si elegiste línea o pie, recuerda: comparar magnitudes entre pocas categorías se lee mejor en barras con baseline 0.",
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
 instruction:
 "E2 (independiente) — Un brief de diseño debe viajar con la figura: pregunta, audiencia y chart. Completa el dict del starter (faltan claves) para un ejecutivo que necesita totales por región, e imprímelo completo.",
 hint: "Tres claves: pregunta, audiencia, chart.",
 hints: [
 "Audiencia típica del comité: ejecutivo.",
 "Chart alineado a comparación de totales: bar.",
 ],
 edgeCases: ["audiencia técnica puede preferir table"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin audiencia y chart en el brief, el informe S21 no sabe por qué se eligió ese encoding.",
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
 instruction:
 "E3 (transferencia) — Implementa `elige_chart(pregunta)` con una regla legible: si la pregunta menciona tendencia (sin importar mayúsculas), devuelve line; en caso contrario, bar para comparación. Prueba con “tendencia mensual” y “comparar regiones” (un resultado por línea).",
 hint: "Usa `in` sobre `pregunta.lower()`.",
 hints: [
 "Normaliza a minúsculas antes de buscar la palabra clave.",
 "Dos llamadas, dos prints (uno por caso).",
 ],
 edgeCases: ["mayúsculas en TENDENCIA"],
 tests: "salida coincide con solution output",
 feedback:
 "La regla debe ser testeable: keywords en la pregunta, no un modelo opaco. Si “tendencia” no está, asume comparación → bar.",
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
 instruction:
 "E1 (guiado) — Valores 50 y 45 con eje recortado en 40 vs baseline 0. Calcula el factor de inflación visual (altura relativa del truco ÷ altura relativa honesta) y muestra `factor` redondeado a 2 decimales. El starter tiene el denominador honesto mal planteado.",
 hint: "Altura truco = (50-45)/(50-40); altura honesta = (50-45)/50.",
 hints: [
 "Con baseline 0 el span es el valor máximo (50), no la diferencia entre barras.",
 "factor = truco / honesto; redondea con round(..., 2).",
 ],
 edgeCases: ["baseline > min de la serie"],
 tests: "salida coincide con solution output",
 feedback:
 "Si el factor es >1, el eje recortado exagera la brecha. El gate del dashboard exige baseline 0 o justificación escrita.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · truncated axis factor
# Bug a corregir: hon en denominador wrong
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
 instruction:
 "E2 (independiente) — Gate de honestidad: si `ylim_bottom` es 0 imprime `honesto`; si no, `revisar`. El starter simula un eje truncado en 40: corrígelo para que el gate apruebe.",
 hint: "Asigna ylim_bottom al baseline honesto de barras absolutas.",
 hints: [
 "Barras de magnitud absoluta: bottom = 0.",
 "Usa el condicional del starter; solo corrige el valor defectuoso.",
 ],
 edgeCases: ["líneas de índice pueden no empezar en 0"],
 tests: "salida coincide con solution output",
 feedback:
 "ylim_bottom=0 es el default ético en barras de PEN. Truncar sin nota es defecto de reporting.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · ylim honesty
# Bug a corregir: ylim_bottom=40 truncado
ylim_bottom = 40
print("honesto" if ylim_bottom == 0 else "revisar")`,
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
 "E3 (transferencia) — Clasifica el riesgo del encoding `dual_axis`: debe reportar `riesgo_alto` (no “ok”). El starter invierte la lógica: corrígela.",
 hint: "dual_axis es el caso de alto riesgo didáctico.",
 hints: [
 "Si encoding es dual_axis → riesgo_alto; si no → ok.",
 "No apruebes dual_axis por defecto.",
 ],
 edgeCases: ["color-only sin segundo canal"],
 tests: "salida coincide con solution output",
 feedback:
 "Dual-axis mezcla dos escalas Y y suele engañar al comité. Prefiere paneles separados o un solo encoding de posición.",
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
 instruction:
 "E1 (guiado) — Construye un bar chart Matplotlib (backend Agg) con dos barras y fuerza el eje Y desde 0. Imprime si `get_ylim()[0] == 0`. El starter trunca en 1: corrige el ylim y cierra la figura.",
 hint: "ax.set_ylim(0, …) y plt.close(fig).",
 hints: [
 "Backend Agg antes de importar pyplot.",
 "El contrato es booleano: True solo si el bottom del ylim es 0.",
 ],
 edgeCases: ["olvidar close y fugas de memoria en CI"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprime False, el ylim aún no empieza en 0. Barras de magnitud absoluta no deben “recortar aire” bajo el mínimo.",
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
 instruction:
 "E2 (independiente) — Añade `ylabel` con la unidad PEN a un axes vacío de Matplotlib y imprime `get_ylabel()`. El starter no etiqueta el eje: corrígelo (Agg + close).",
 hint: "ax.set_ylabel(\"PEN\").",
 hints: [
 "La unidad va en el eje, no solo en el título del slide.",
 "Cierra la figura tras leer el ylabel.",
 ],
 edgeCases: ["ylabel vacío o solo espacios"],
 tests: "salida coincide con solution output",
 feedback:
 "“28” sin unidad es defecto. PEN en el ylabel hace honesto el encoding de longitud.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · ylabel units
# Bug a corregir: ylabel vacío
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
print(ax.get_ylabel())
plt.close(fig)`,
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
 "E3 (transferencia) — Implementa `meta_bar(labels, values)` que dibuja barras regionales, fija ylim desde 0 hasta max(values)*1.2, y devuelve un dict con `n_bars` y `ylim0` como **float** de Python (no tipo numpy). Imprime el meta para Lima/Cusco y valores 28/22.5 (mismo contrato visual del portfolio: baseline 0 y conteo de categorías).",
 hint: "Usa float(ax.get_ylim()[0]) para salida estable.",
 hints: [
 "Cuenta barras con len(values).",
 "Fuerza set_ylim(0, max(values)*1.2) antes de leer ylim0.",
 ],
 edgeCases: ["values vacíos"],
 tests: "salida coincide con solution output",
 feedback:
 "Convierte ylim0 a float nativo de Python para una salida estable entre entornos. n_bars debe coincidir con las categorías dibujadas; baseline 0 es el gate de honestidad del dashboard.",
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
print(meta_bar(["Lima", "Cusco"], [28.0, 22.5]))`,
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
print(meta_bar(["Lima", "Cusco"], [28.0, 22.5]))`,
 output: `{'n_bars': 2, 'ylim0': 0.0}`,
 },
 },
 {
 id: "S19-T2-B-E1",
 subtopicId: "S19-T2-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — El export del dashboard multi-panel debe declarar formato, dpi y número de paneles. Corrige el dict del starter (dpi y panels incorrectos) al contrato de portfolio: png, 120 dpi, 2 paneles.",
 hint: "Dict con claves fmt, dpi, panels.",
 hints: [
 "dpi de slides del curso: 120.",
 "Dos paneles = panels 2 (no 1).",
 ],
 edgeCases: ["dpi 0"],
 tests: "salida coincide con solution output",
 feedback:
 "Metadata de export viaja con el PNG a S20/S21. dpi y panels incorrectos rompen el re-render del portfolio.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · export meta
# Bug a corregir: dpi=72 y panels=1
print({"fmt": "png", "dpi": 72, "panels": 1})`,
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
 "E2 (independiente) — Genera el nombre versionado `fig_cpn2b_v{version}.png` con `version = 3`. El starter omite la versión en el nombre: corrígelo con f-string.",
 hint: "Incluye _v y el número de versión antes de .png.",
 hints: [
 "f-string con {version}.",
 "Prefijo acordado: fig_cpn2b.",
 ],
 edgeCases: ["version como string no numérica"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin versión en el filename, el factory no distingue re-renders. Un solo nombre sobrescribe el histórico del portfolio.",
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
 instruction:
 "E3 (transferencia) — Crea subplots 1×2, pon títulos de panel “Vol” y “Med” (no solo un suptitle), e imprime la lista de títulos con `get_title()` por axes. Cierra la figura.",
 hint: "axes[0].set_title y axes[1].set_title.",
 hints: [
 "suptitle no reemplaza títulos de panel en el contrato del grader.",
 "Lista en el mismo orden de los axes.",
 ],
 edgeCases: ["orientación 2×1"],
 tests: "salida coincide con solution output",
 feedback:
 "Cada panel necesita título propio para que el comité lea Vol vs Med sin ambigüedad. suptitle es opcional; get_title del axes no lo hereda.",
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
 instruction:
 "E1 (guiado) — Dada una lista de filas con región y mediana, recupera la mediana de **Lima** (no de Cusco). El starter consulta la región equivocada: corrige el filtro e imprime el valor numérico.",
 hint: "next(...) o list comprehension filtrando region == \"Lima\".",
 hints: [
 "Compara r[\"region\"] con la cadena Lima.",
 "Imprime solo el campo median de la fila filtrada.",
 ],
 edgeCases: ["sin match → StopIteration"],
 tests: "salida coincide con solution output",
 feedback:
 "El viewport filtrado debe recalcular el valor mostrado. Mostrar Cusco cuando el filtro es Lima rompe la paridad con el tooltip.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · lookup median
# Bug a corregir: toma Cusco
rows = [{"region": "Lima", "median": 28}, {"region": "Cusco", "median": 22}]
print(next(r for r in rows if r["region"] == "Cusco")["median"])`,
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
 "E2 (independiente) — El tooltip de Lima debe incluir valor, unidad PEN y tamaño muestral n=40. El starter omite n: corrige el formato a `Lima: 28 PEN (n=40)`.",
 hint: "Incluye (n=…) en el f-string.",
 hints: [
 "Unidad PEN va después del valor.",
 "n documenta el tamaño de la celda filtrada.",
 ],
 edgeCases: ["sin unidad"],
 tests: "salida coincide con solution output",
 feedback:
 "Tooltip sin n invita a leer 28 como si fuera población completa. Unidad + n son parte del contrato a11y del viewport.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · accessible tooltip
# Bug a corregir: sin n=
print(f"Lima: {28} PEN")`,
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
 "E3 (transferencia) — Escribe `tooltip(row)` que devuelva `\"{region}: {median} PEN (n={n})\"` para cualquier fila. Prueba con Cusco 22.5 y n=32. El starter omite n en el template.",
 hint: "Función pura: solo usa claves del dict row.",
 hints: [
 "Incluye la unidad PEN de forma fija en el template.",
 "n sale de row['n'], no hardcodees solo el valor de Cusco si generalizas.",
 ],
 edgeCases: ["keys faltantes → KeyError"],
 tests: "salida coincide con solution output",
 feedback:
 "El template reutilizable evita tooltips distintos por región. Si falta n en el string, el gate de a11y falla.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · tooltip
# Bug a corregir: omite n
def tooltip(row):
 return f"{row['region']}: {row['median']} PEN"
print(tooltip({"region": "Cusco", "median": 22.5, "n": 32}))`,
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
 "E1 (guiado) — Paridad chart↔tabla: el valor de Lima en el chart debe igualar el de la fila de tabla. El starter desalineó los números: alinea e imprime el booleano de igualdad.",
 hint: "chart['Lima'] == table[0]['v'].",
 hints: [
 "Corrige el valor defectuoso en table o en chart, no ambos a azar.",
 "Imprime True solo si hay paridad exacta.",
 ],
 edgeCases: ["float con redondeos distintos"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin paridad numérica, la alternativa accesible miente. El gate del portfolio exige mismos números a la precisión publicada.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · chart-table parity
# Bug a corregir: valores desalineados
chart = {"Lima": 1}
table = [{"region": "Lima", "v": 2}]
print(chart["Lima"] == table[0]["v"])`,
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
 "E2 (independiente) — El estado del viewport debe ser JSON serializable **y** declarar honestidad de sampling: filtro Lima, `sample_n=5000`, `universe_n=50000`. Serializa con `json.dumps(..., ensure_ascii=False)`. El starter omite el universo y usa ensure_ascii=True: corrígelo.",
 hint: "Incluye sample_n y universe_n; ensure_ascii=False.",
 hints: [
 "Sin universe_n el lector cree que 5000 es el censo.",
 "ensure_ascii=False evita escapes innecesarios en textos con tildes.",
 ],
 edgeCases: ["estado no serializable (sets, objetos)"],
 tests: "salida coincide con solution output",
 feedback:
 "Estado no serializable no se audita. sample_n sin universe_n oculta el sesgo del viewport: documenta ambos para no vender un sample como censo.",
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
 instruction:
 "E3 (transferencia) — Genera alt text desde una tabla: une cada fila como `region=v PEN` con separador `\"; \"`. El starter omite la unidad PEN: corrígelo para Lima=28 y Cusco=22.",
 hint: "join con f-string que incluya PEN.",
 hints: [
 "Recorre cada r en table.",
 "Formato: {region}={v} PEN.",
 ],
 edgeCases: ["tabla vacía → string vacío"],
 tests: "salida coincide con solution output",
 feedback:
 "El alt text es la versión no visual del chart. Sin unidad, el lector de pantalla recibe números ambiguos.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · table alt text
# Bug a corregir: join sin unidades
table = [{"region": "Lima", "v": 28}, {"region": "Cusco", "v": 22}]
print("; ".join(f"{r['region']}={r['v']}" for r in table))`,
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
 "E1 (guiado) — El pie de figura mínimo debe declarar unidad y fuente. Completa el string del starter (falta fuente) al formato `unidad=PEN | fuente=sintetico`.",
 hint: "Une con \" | \" unidad y fuente.",
 hints: [
 "No omitas la clave fuente aunque sea sintético.",
 "Mantén el orden unidad luego fuente.",
 ],
 edgeCases: ["fuente vacía"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin fuente, el gráfico no entra al portfolio CP-N2-B. Unidad sola no basta para trazabilidad.",
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
 instruction:
 "E2 (independiente) — Valida que el dict de caption contenga al menos las claves `unidad`, `fuente` y `limitacion`. El starter omite `limitacion`: complétalo e imprime el booleano del superset de claves.",
 hint: "set(cap) >= {\"unidad\", \"fuente\", \"limitacion\"}.",
 hints: [
 "Añade limitacion con un valor no vacío (p. ej. web).",
 "No basta con tener unidad y fuente.",
 ],
 edgeCases: ["typo en clave limitacion"],
 tests: "salida coincide con solution output",
 feedback:
 "limitacion documenta el marco (solo canal web, n bajo, etc.). Sin ella el claim del título puede sobre-extenderse.",
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
 instruction:
 "E3 (transferencia) — Implementa `pie(cap)` que une `k: v` de cada item del dict con `\" | \"`. El starter solo une las keys: corrige el formatter y pruébalo con unidad=PEN y n=10.",
 hint: "join de f\"{k}: {v}\" sobre cap.items().",
 hints: [
 "Usa .items() para no perder los valores.",
 "El orden de inserción del dict define el orden del pie.",
 ],
 edgeCases: ["valores None"],
 tests: "salida coincide con solution output",
 feedback:
 "Un pie solo con nombres de clave no comunica nada al lector. k: v es el contrato estable hacia S21.",
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
 instruction:
 "E1 (guiado) — Clasifica el claim “Lima es la mejor del Perú”: si menciona “del Perú” y no menciona “muestra”, imprime RECHAZADO; si no, OK. El starter aprueba todo: implementa la regla.",
 hint: "Chequea substrings \"del Perú\" y \"muestra\".",
 hints: [
 "Sobreclaim típico: generaliza al país sin marco muestral.",
 "RECHAZADO es el resultado esperado para este claim.",
 ],
 edgeCases: ["claims legítimos locales con muestra"],
 tests: "salida coincide con solution output",
 feedback:
 "Generalizar de una muestra web a “todo el Perú” es sobreclaim. Exige el marco muestral en el lenguaje del dashboard.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · overclaim
# Bug a corregir: aprueba claim sin muestra
claim = "Lima es la mejor del Perú"
print("OK")`,
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
 "E2 (independiente) — Alternativa no visual y canal no-color: (1) el alt debe incluir el patrón `n=`; (2) las barras de categorías deben declarar un `hatch` distinto de `None` (no solo color). El starter falla ambos gates: corrígelos e imprime dos booleanos, uno por línea (`has_n`, luego `has_hatch`).",
 hint: "Completa el alt con n=…; asigna hatch (p. ej. '//') al primer patch o al dict de estilo.",
 hints: [
 "Primero arregla el string alt para que contenga n=.",
 "Luego define hatch='//' (u otro patrón Matplotlib) y verifica hatch is not None.",
 ],
 edgeCases: ["hatch vacío '' cuenta como falsy — usa un patrón real"],
 tests: "salida coincide con solution output",
 feedback:
 "Alt sin n= es incompleto. Hatch (o etiqueta/posición) evita que el daltonismo pierda la categoría: color solo no basta (WCAG 1.4.1).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-019 · alt n= + hatch no-color
# Bug a corregir: alt sin n; hatch=None (solo color)
alt = "Lima 28 PEN"
hatch = None
print("n=" in alt)
print(hatch is not None)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `alt = "Lima 28 PEN n=40"
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
 instruction:
 "E3 (transferencia) — Implementa `classify_claim(text)`: PERMITIDO si el texto contiene “muestra”, RECHAZADO en caso contrario. Clasifica “lidera en la muestra web” y “es la mejor del país” (un resultado por línea). El starter siempre devuelve PERMITIDO.",
 hint: "Regla binaria didáctica con `\"muestra\" in text`.",
 hints: [
 "No intentes NLP: substring basta para el lab.",
 "Dos prints, en el orden de las dos frases de prueba.",
 ],
 edgeCases: ["falsos positivos si la palabra aparece en otro sentido"],
 tests: "salida coincide con solution output",
 feedback:
 "El gate didáctico entrena el hábito: sin marco muestral, el claim no pasa. En producción refinarías la política; aquí la regla es explícita y testeable.",
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
 "Construye el incremento dashboard de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por región sintéticas Lima/Cusco/Arequipa en PEN).",
 objectives: [
 "Elegir charts por pregunta/audiencia",
 "Ejes honestos y unidades visibles",
 "Export versionado + captions",
 "Alt text y sin sobreclaim",
 "Paridad numérica chart/tabla",
 ],
 requirements: [
 "Datos sintéticos únicamente (sin PII real)",
 "ylim de barras desde 0 salvo justificación escrita en el caption",
 "Caption con unidad, fuente y limitación en cada figura",
 "Alt text por figura con hallazgo + n",
 "Tabla de paridad con los mismos números que los charts",
 "Categorías críticas: no solo color — hatch, etiqueta o posición como canal extra",
 "Si el viewport usa sample, declara sample_n y universe_n (no vender sample como censo)",
 "es-PE en títulos y conclusiones; claims acotados a la muestra",
 "Una spec de vista interactiva (filtro + tooltip template), sin librería obligatoria",
 "Export real: savefig (PNG) con dpi documentado y nombre versionado",
 ],
 starterCode: `"""
CP-N2-B — Dashboard accesible (esqueleto)
Entrega mínima:
  1) fig_bar_medianas.png — barras, ylim 0, ylabel PEN, n en caption
  2) fig_bar_volumen.png — n por región
  3) fig_line_tendencia.png — serie semanal sintética
  4) fig_scatter_n_vs_median.png — relación n–mediana
  5) vista_logica.json — filtro activo + tooltip template
  6) tabla_paridad.csv + alt_*.txt por figura
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import json

df = pd.DataFrame({
    "region": ["Lima", "Arequipa", "Cusco"],
    "median_pen": [28.0, 24.0, 22.5],
    "n": [40, 28, 32],
})

# Serie semanal sintética (tickets) para la línea de tendencia
tendencia = pd.DataFrame({
    "semana": [1, 2, 3, 4],
    "tickets": [120, 132, 128, 140],
})

def build_bar_median(df):
    """Barras de mediana PEN con baseline 0 y ylabel con unidad."""
    fig, ax = plt.subplots()
    # TODO: ax.bar(...); set_ylabel; set_ylim(0, ...); set_title
    return fig, ax

def build_bar_volumen(df):
    """Barras de n por región."""
    fig, ax = plt.subplots()
    # TODO
    return fig, ax

def build_line_tendencia(tendencia):
    """Línea de tickets semanales (sintético)."""
    fig, ax = plt.subplots()
    # TODO
    return fig, ax

def build_scatter_n_median(df):
    """Scatter n vs mediana; documenta que n no es causalidad."""
    fig, ax = plt.subplots()
    # TODO
    return fig, ax

def caption(meta: dict) -> str:
    """Une unidad | fuente | limitacion (y n si aplica)."""
    # TODO: return " | ".join(...)
    raise NotImplementedError

def alt_text(df, hallazgo: str) -> str:
    """Hallazgo principal + n por región; sin sobreclaim nacional."""
    # TODO
    raise NotImplementedError

def vista_interactiva(df, region: str) -> dict:
    """Spec: filtro + tooltip con unidad y n (sin librería interactiva obligatoria)."""
    # TODO: {"filtro": region, "tooltip": "... PEN (n=...)", "sample_n": ..., "universe_n": ...}
    raise NotImplementedError

def export_png(fig, path: str, dpi: int = 120) -> dict:
    """Guarda PNG real y devuelve meta versionable (fmt, dpi, path)."""
    # TODO: fig.savefig(path, dpi=dpi, bbox_inches="tight"); plt.close(fig)
    raise NotImplementedError

# Smoke check del dataset (borra o sustituye al integrar)
print(df)
print("regiones", list(df["region"]))
`,
 portfolioNote:
 "Dashboard del factory CP-N2-B; se integra con Excel (S20) y reportes (S21). Entrega figuras versionadas + specs JSON + alts/tabla de paridad.",
 rubric: [
 { criterion: "Charts honestos (baseline 0 en barras, unidades visibles) + alt/tabla con paridad numérica", weight: "25%" },
 { criterion: "Cuatro figuras estáticas + una spec de vista interactiva (filtro/tooltip)", weight: "20%" },
 { criterion: "Captions con unidad, fuente y limitación; export versionado", weight: "15%" },
 { criterion: "Sin sobreclaim: lenguaje acotado a la muestra; sin PII real", weight: "15%" },
 { criterion: "Código legible, funciones reutilizables, backend Agg y close de figuras", weight: "15%" },
 { criterion: "Documentación en español profesional (es-PE)", weight: "10%" }
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
 options: [
 "Aceptarlo si los colores tienen buen contraste",
 "Convertirlo automáticamente a dual-axis para “ganar espacio”",
 "Marcarlo como riesgo de inflación visual y exigir baseline 0 o justificación explícita",
 "Eliminar las etiquetas de ejes para que se vea más limpio en el slide",
 ],
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
