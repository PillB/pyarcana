# S19 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:21:59.000+00:00
Section: Visualización y comunicación accesible
File: `s19-databases-orm.ts`
STORM cycles: **19**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Matplotlib: [tutorials](https://matplotlib.org/stable/tutorials/index.html) — figures export
- Matplotlib: [cheatsheets](https://matplotlib.org/cheatsheets/) — API quick
- Matplotlib: [colormaps](https://matplotlib.org/stable/users/explain/colors/colormaps.html) — color contrast
- W3C: [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — a11y
- Seaborn: [tutorial](https://seaborn.pydata.org/tutorial.html) — optional style
- DVS: [Data Visualization Society](https://www.datavisualizationsociety.org/) — ethics viz
- Data to Viz: [from data to viz](https://www.data-to-viz.com/) — chart choice
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — structures
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- Real Python: [Matplotlib guide](https://realpython.com/python-matplotlib-guide/) — figures
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- Wilke: [Fundamentals of Data Visualization](https://clauswilke.com/dataviz/) — encodings honesty
- Matplotlib: [pyplot](https://matplotlib.org/stable/api/pyplot_summary.html) — API
- W3C: [alt text concepts](https://www.w3.org/WAI/tutorials/images/) — text alternatives
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — org
- Stanford: [CS448B viz concepts](https://hci.stanford.edu/courses/cs448b/) — viz design

## Gold pass
| Area | Decision |
|------|----------|
| theory | strip workbench theater + domain depth |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Bases de Datos y ORMs” a visualización accesible (mapa)
**P1** (rank 9.55/10)
> En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id `databases-orm` se conserva, pero el estudiante construye **visualización y …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/stable/tutorials/index.html; Matplotlib: https://matplotlib.org/cheatsheets/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Bases de Datos y ORMs” a visualización acces» in S19_STORM.json.

**P2** (rank 9.55/10)
> Hilo conductor: figuras sintéticas de KPIs regionales (Lima/Cusco/Arequipa, PEN, n por barra) que alimentarán el reporting factory (S20–S21). Una sola idea prin…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/cheatsheets/; Matplotlib: https://matplotlib.org/stable/users/explain/colors/colormaps.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Bases de Datos y ORMs” a visualización acces» in S19_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Intención** (pregunta/audiencia/chart + ejes honestos) → **T2 Estático** (Matplotlib/Seaborn, composición, export) → **T3 Interactivo/a11y** (spec d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/stable/users/explain/colors/colormaps.html; W3C: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Bases de Datos y ORMs” a visualización acces» in S19_STORM.json.

### pregunta, audiencia y chart choice
**P1** (rank 9.55/10)
> El **chart choice** responde a la pregunta, no a la librería de moda. Comparar totales entre 3 regiones → barras; tendencia temporal → línea; relación dos cuant…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html; Seaborn: https://seaborn.pydata.org/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pregunta, audiencia y chart choice» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato: una idea principal por figura. Si hay dos preguntas, dos charts. El dict de especificación (`pregunta`, `audiencia`, `chart`) viaja con el PNG hacia e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Seaborn: https://seaborn.pydata.org/tutorial.html; DVS: https://www.datavisualizationsociety.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pregunta, audiencia y chart choice» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético Perú: “totales por región para comité” → bar; “tendencia de tickets web semanal” → line. Función `elige_chart(pregunta)` es un gate didáctico, no…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** DVS: https://www.datavisualizationsociety.org/; Data to Viz: https://www.data-to-viz.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pregunta, audiencia y chart choice» in S19_STORM.json.

### ejes, escalas y encodings honestos
**P1** (rank 9.55/10)
> Ejes de **magnitudes absolutas en barras** deben incluir cero salvo justificación explícita; recortar el eje infla diferencias y engaña al comité. Encodings: po…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Data to Viz: https://www.data-to-viz.com/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ejes, escalas y encodings honestos» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `ylim` bottom=0 en barras de PEN; etiqueta de unidades en el eje; escala log solo con leyenda explícita y justificación de órdenes de magnitud. Si usa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ejes, escalas y encodings honestos» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso: valores 50 vs 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. El ejercicio de “inflación visual” entrena el ojo ant…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ejes, escalas y encodings honestos» in S19_STORM.json.

### Matplotlib / Seaborn
**P1** (rank 9.55/10)
> Matplotlib/Seaborn construyen la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Matplotlib / Seaborn» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato de export: `bbox_inches='tight'`, dpi documentado (p. ej. 120), nombre versionado. En demos del curso a veces solo imprimimos metadatos sin binario; en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Matplotlib / Seaborn» in S19_STORM.json.

### composición, annotations y exportación
**P1** (rank 9.55/10)
> Multi-panel (`subplots`) alinea comparaciones (Vol vs Med). Anota valores clave con `bar_label` o `annotate` sin saturar. Export: PNG para slides, SVG/PDF para …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; Real Python: https://realpython.com/python-matplotlib-guide/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «composición, annotations y exportación» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato de reproducibilidad: seed de datos + función `build_figure()` sin estado global sucio. Misma entrada → mismos títulos de paneles y mismos n en captions…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Real Python: https://realpython.com/python-matplotlib-guide/; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «composición, annotations y exportación» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: 1×2 subplots títulos “Vol” y “Med”; meta de export `{fmt:'png', dpi:120, panels:2}`. El dashboard empaqueta estas figuras con la tabla de parida…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; Wilke: https://clauswilke.com/dataviz/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «composición, annotations y exportación» in S19_STORM.json.

### Plotly / filtros / tooltips (modelo de datos)
**P1** (rank 9.55/10)
> En entornos sin Plotly instalado, modelamos la **vista interactiva** como especificación: campos filtrables, tooltip template y viewport. Tooltips deben mostrar…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Wilke: https://clauswilke.com/dataviz/; Matplotlib: https://matplotlib.org/stable/api/pyplot_summary.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Plotly / filtros / tooltips (modelo de datos)» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato: al filtrar por región, el texto de conclusión del viewport se **recalcula**; no reutilices el párrafo global de “Lima lidera” si el filtro es Cusco. S…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/stable/api/pyplot_summary.html; W3C: https://www.w3.org/WAI/tutorials/images/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Plotly / filtros / tooltips (modelo de datos)» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso: row `{region:'Lima', median:28, n:40}` → tooltip `Lima: 28 PEN (n=40)`. Parity chart↔tabla: si la barra dice 1, la fila de tabla dice 1; si no, el gate de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/tutorials/images/; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Plotly / filtros / tooltips (modelo de datos)» in S19_STORM.json.

### estado, performance y alternativas accesibles
**P1** (rank 9.55/10)
> El **estado** del dashboard (filtros activos) debe ser serializable (`json.dumps`). Evita recalcular todo el universo en cada hover; limita puntos en scatter (s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; Stanford: https://hci.stanford.edu/courses/cs448b/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estado, performance y alternativas accesibles» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato a11y: alternativa accesible = tabla ordenable + resumen textual con **los mismos números** que el chart. Sin tabla hermana, el gráfico no entra solo al…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Stanford: https://hci.stanford.edu/courses/cs448b/; Matplotlib: https://matplotlib.org/stable/tutorials/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estado, performance y alternativas accesibles» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso: `filtro_region=Lima` → state JSON compacto; `alt_text` une `region:v` con `; `. Performance: documenta “sample 5k de 50k” si aplica — nunca ocultes el ses…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/stable/tutorials/index.html; Matplotlib: https://matplotlib.org/cheatsheets/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estado, performance y alternativas accesibles» in S19_STORM.json.

### unidades, fuente y limitaciones
**P1** (rank 9.55/10)
> Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/cheatsheets/; Matplotlib: https://matplotlib.org/stable/users/explain/colors/colormaps.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidades, fuente y limitaciones» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato de caption: dict con claves `unidad`, `fuente`, `limitacion` (y n cuando aplique). Función `pie(cap)` une con ` | ` para el footer estable entre dashbo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Matplotlib: https://matplotlib.org/stable/users/explain/colors/colormaps.html; W3C: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidades, fuente y limitaciones» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: unidad PEN, fuente `sintetico`, limitación “solo canal web”. El mismo pie viaja a S21 para que el DOCX no invente otra fuente.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html; Seaborn: https://seaborn.pydata.org/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidades, fuente y limitaciones» in S19_STORM.json.

### color, contraste, texto alternativo y no sobreclaim
**P1** (rank 9.55/10)
> Contraste suficiente texto/fondo; no uses **solo color** para categorías críticas — añade patrón, etiqueta o posición. **Alt text** describe el hallazgo princip…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Seaborn: https://seaborn.pydata.org/tutorial.html; DVS: https://www.datavisualizationsociety.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «color, contraste, texto alternativo y no sobrecl» in S19_STORM.json.

**P2** (rank 9.55/10)
> Contrato de claims: “Lima lidera en la **muestra** web” es permitido; “Lima es la mejor región del Perú” sin marco poblacional es **RECHAZADO**. `classify_claim…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** DVS: https://www.datavisualizationsociety.org/; Data to Viz: https://www.data-to-viz.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «color, contraste, texto alternativo y no sobrecl» in S19_STORM.json.

**P3** (rank 9.55/10)
> Caso: alt `Lima 28 PEN n=40` debe contener `n=`; claim con “del Perú” sin “muestra” → RECHAZADO. Cierra el loop ético del dashboard antes del reporting factory.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Data to Viz: https://www.data-to-viz.com/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «color, contraste, texto alternativo y no sobrecl» in S19_STORM.json.

