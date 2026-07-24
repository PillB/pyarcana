# S18 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:19:14.000+00:00
Section: EDA, estadística descriptiva e incertidumbre
File: `s18-data-engineering.ts`
STORM cycles: **18**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- NumPy: [statistics](https://numpy.org/doc/stable/reference/routines.statistics.html) — mean quantile
- pandas: [basics](https://pandas.pydata.org/docs/user_guide/basics.html) — describe
- SciPy: [stats](https://docs.scipy.org/doc/scipy/reference/stats.html) — IC reference
- NumPy: [corrcoef](https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html) — Pearson
- pandas: [quantile](https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html) — IQR
- Think Stats: [open book](https://allendowney.github.io/ThinkStats/) — practical stats
- OpenIntro: [Statistics](https://www.openintro.org/book/os/) — IC bias
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- MIT: [6.0002](https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/) — comp thinking
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Stanford: [CS109](https://web.stanford.edu/class/cs109/) — probability concepts
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- NumPy: [median](https://numpy.org/doc/stable/reference/generated/numpy.median.html) — robust center
- pandas: [groupby](https://pandas.pydata.org/docs/user_guide/groupby.html) — segment rates
- OpenStax: [Introductory Statistics](https://openstax.org/details/books/introductory-statistics) — sampling
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — org

## Gold pass
| Area | Decision |
|------|----------|
| theory | domain depth + ethics |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Ingeniería de Datos Intermedia” a EDA e incertidumbre (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations** (eso se reubica a ingeniería avanzada). El id de plataforma `data-engineering` …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/routines.statistics.html; pandas: https://pandas.pydata.org/docs/user_guide/basics.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Ingeniería de Datos Intermedia” a EDA e ince» in S18_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del por…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/basics.html; SciPy: https://docs.scipy.org/doc/scipy/reference/stats.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Ingeniería de Datos Intermedia” a EDA e ince» in S18_STORM.json.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC y tamaño de efecto) → **T3 Rel…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SciPy: https://docs.scipy.org/doc/scipy/reference/stats.html; NumPy: https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Ingeniería de Datos Intermedia” a EDA e ince» in S18_STORM.json.

### centro, dispersión y cuantiles
**P1** (rank 9.55/10)
> El **centro** se resume con media (`mean`) o mediana (`median`); la **dispersión** con desviación estándar muestral (`std`, `ddof=1`) o **IQR** (Q3−Q1). En mont…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «centro, dispersión y cuantiles» in S18_STORM.json.

**P2** (rank 9.55/10)
> Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o max) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html; Think Stats: https://allendowney.github.io/ThinkStats/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «centro, dispersión y cuantiles» in S18_STORM.json.

### métricas robustas y escalas
**P1** (rank 9.55/10)
> Métricas **robustas** (mediana, IQR, MAD = mediana de |x − mediana|) resisten outliers mejor que media/std. Úsalas cuando la pregunta sea “típico” o cuando un s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Think Stats: https://allendowney.github.io/ThinkStats/; OpenIntro: https://www.openintro.org/book/os/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas robustas y escalas» in S18_STORM.json.

**P2** (rank 9.55/10)
> Contrato de escala: `log1p` de montos reduce asimetría visual para EDA, pero **no** compares diferencias log como soles PEN sin transformar de vuelta. Si el eje…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** OpenIntro: https://www.openintro.org/book/os/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas robustas y escalas» in S18_STORM.json.

**P3** (rank 9.55/10)
> Elige métrica según la pregunta de negocio: “ticket típico web Lima” → mediana + IQR; “ingreso total esperado del día” → suma o media con cola documentada. Caso…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas robustas y escalas» in S18_STORM.json.

### población, muestra y sesgo
**P1** (rank 9.55/10)
> La **población** es el universo de interés (p. ej. todos los tickets del canal en el mes); la **muestra** es lo observado. El **sesgo de selección** aparece si …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «población, muestra y sesgo» in S18_STORM.json.

**P2** (rank 9.55/10)
> Contrato: compara shares de la muestra vs un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Stanford: https://web.stanford.edu/class/cs109/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «población, muestra y sesgo» in S18_STORM.json.

**P3** (rank 9.55/10)
> Sin marco poblacional, declara **cobertura limitada** y no generalices a “todos los clientes del Perú”. Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Stanford: https://web.stanford.edu/class/cs109/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «población, muestra y sesgo» in S18_STORM.json.

### intervalos básicos y tamaño de efecto
**P1** (rank 9.55/10)
> Un **intervalo de confianza** aproximado para la media con n grande: media ± z·(s/√n) (z≈1.96 para 95%). Con n pequeño o colas pesadas, sé cauteloso: reporta n,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «intervalos básicos y tamaño de efecto» in S18_STORM.json.

**P2** (rank 9.55/10)
> El **tamaño de efecto** (Cohen's d ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo “significativo”. Un efecto chico con n en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «intervalos básicos y tamaño de efecto» in S18_STORM.json.

**P3** (rank 9.55/10)
> Contrato de lenguaje: di “compatible con” / “en la muestra” y reporta n + IC; nunca “probado” con un solo IC. Caso sintético: media B ~108 vs A ~94, d≈1.1, IC95…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; NumPy: https://numpy.org/doc/stable/reference/generated/numpy.median.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «intervalos básicos y tamaño de efecto» in S18_STORM.json.

### correlación y confusión
**P1** (rank 9.55/10)
> La **correlación** (Pearson lineal / Spearman monótona) mide asociación, **no causa**. Un confusor Z puede crear asociación espuria entre X e Y; residualizar Z …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/generated/numpy.median.html; pandas: https://pandas.pydata.org/docs/user_guide/groupby.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «correlación y confusión» in S18_STORM.json.

**P2** (rank 9.55/10)
> Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier cla…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/groupby.html; OpenStax: https://openstax.org/details/books/introductory-statistics
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «correlación y confusión» in S18_STORM.json.

**P3** (rank 9.55/10)
> Pearson es sensible a outliers; Spearman usa rangos y tolera monótonas no lineales leves. Caso sintético: X e Y generados por Z → r_xy alto, r residual ≈0; el n…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** OpenStax: https://openstax.org/details/books/introductory-statistics; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «correlación y confusión» in S18_STORM.json.

### segmentación, anomalías y causalidad no demostrada
### preguntas, hipótesis y evidencia
**P1** (rank 9.55/10)
> Separa tres capas: **pregunta de negocio**, **hipótesis comprobable**, **evidencia calculada**. El hallazgo (número + n + límite) no es la decisión (lanzar camp…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; NumPy: https://numpy.org/doc/stable/reference/routines.statistics.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «preguntas, hipótesis y evidencia» in S18_STORM.json.

**P2** (rank 9.55/10)
> Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrear…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/routines.statistics.html; pandas: https://pandas.pydata.org/docs/user_guide/basics.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «preguntas, hipótesis y evidencia» in S18_STORM.json.

**P3** (rank 9.55/10)
> Caso: “¿El ticket mediano en Lima supera 25 PEN?” → median(monto|Lima)=27.5, n=40, IC bootstrap aprox., límite “solo canal web”. Conclusión permitida: hipótesis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/basics.html; SciPy: https://docs.scipy.org/doc/scipy/reference/stats.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «preguntas, hipótesis y evidencia» in S18_STORM.json.

### notebook reproducible y data notes
**P1** (rank 9.55/10)
> Un **data note** documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otro agente no regenera los mismos n y métricas cla…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SciPy: https://docs.scipy.org/doc/scipy/reference/stats.html; NumPy: https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «notebook reproducible y data notes» in S18_STORM.json.

**P2** (rank 9.55/10)
> Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checkl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «notebook reproducible y data notes» in S18_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: CSV de 3 tickets → `row_sha1_8`, n=3, filtros `monto>0`, seed=42. El portfolio adjunta el JSON del note junto al resumen de medianas; es la base…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html; Think Stats: https://allendowney.github.io/ThinkStats/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «notebook reproducible y data notes» in S18_STORM.json.

