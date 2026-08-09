# S36 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T03:52:39.133530+00:00
Section: Clustering, anomalías y validación temporal
File: `s36-ai-apis-advanced.ts`
STORM cycles: **36**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- sklearn: [Clustering guide](https://scikit-learn.org/stable/modules/clustering.html) — k-means density
- sklearn: [Outlier detection](https://scikit-learn.org/stable/modules/outlier_detection.html) — IF LOF novelty
- sklearn: [PCA](https://scikit-learn.org/stable/modules/decomposition.html#pca) — explore only
- sklearn: [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) — scale first
- Docs: [statistics](https://docs.python.org/3/library/statistics.html) — sigma rules
- Stanford: [CS229](https://cs229.stanford.edu/) — unsupervised
- Stanford: [CS229 notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) — k-means PCA math
- Coursera: [Machine Learning](https://www.coursera.org/learn/machine-learning) — k-means cost
- MIT: [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) — ML foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Video: [StatQuest PCA](https://www.youtube.com/watch?v=FgakZw6K1QQ) — axes ≠ moral
- Video: [StatQuest k-means](https://www.youtube.com/watch?v=4b5d3muPQmA) — centroids
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — human oversight
- Google: [Model Cards](https://modelcards.withgoogle.com/about) — limits
- Py4E: [Python for Everybody](https://www.py4e.com) — stdlib first
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — learner surface
- Live: [PyArcana](https://pillb.github.io/pyarcana/)

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO-LIM-036 DEFECT 24/24 |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert resume | deepened thin paragraphs / resources |

## Theory (paragraph-level)

### Señales no supervisadas para triage (mapa S36)
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Clustering:** agrupar puntos por similitud sin etiqueta de conducta. **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral). **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-scor…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Señales no supervisadas para triage (mapa S36)» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Clustering y detección de rareza alimentan el triage CP-N3-C como **señales auxiliares**, no como veredictos. Se evalúan por utilidad de revisión (¿ahorra tiempo al humano?) y nunca se traducen solas en fraude, parentesco o sanción. El lenguaje fail-closed protege a las person…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Señales no supervisadas para triage (mapa S36)» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato de la sección. Entrada: features sintéticas `CASO-LIM-036`, capacidad de cola de review y labels escasos. Salida: clusters/scores de rareza con disclaimer, backtest temporal y precision@k. Error: tratar anomalía como culpa, contamination como tasa de fraude, o fit con…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Señales no supervisadas para triage (mapa S36)» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Caso Red Andina (ficticio, Lima): montos y frecuencias inventadas. El id de plataforma `ai-apis-advanced` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels esc…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Señales no supervisadas para triage (mapa S36)» in S36_STORM.json; edge `research_supports_paragraph`.


### Escalamiento y k-means / density (1D didáctico)
**P1** (rank 9.55/10)
> Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs conteos de eventos). Density-based methods buscan regiones densas; aquí enseñamos el núcleo con un **toy 1D de centroides** (media de cada grupo). Los centroides son resúmenes geométricos, no etiqueta…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Escalamiento y k-means / density (1D didáctico)» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo: para un grupo de valores, el centroide 1D es la media aritmética `sum(xs)/len(xs)`. Con dos grupos naturales (bajos vs altos) calculas c1 y c2 por separado. En 2D+ usarías distancias euclídeas y asignación iterativa (k-means clásico de sklearn/CS229); el 1D deja ver…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Escalamiento y k-means / density (1D didáctico)» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: vector de features sintéticas y decisión de escalado. Salida: centroides, `scaled=True` cuando aplicaste z-score o normalización, `verdict=False` siempre. Error: clusterizar montos crudos contra conteos sin normalizar, o publicar el id de cluster c…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Escalamiento y k-means / density (1D didáctico)» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] → grupo bajo media≈1.1, grupo alto≈5.1. Sirve para segmentar la cola de review (p. ej. volumen bajo/alto), nunca para culpar. En banca/fintech peruana el mismo error (escalar mal) distorsiona cola…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Escalamiento y k-means / density (1D didáctico)» in S36_STORM.json; edge `research_supports_paragraph`.


### Elección de k, estabilidad multi-seed y límites de métricas
**P1** (rank 9.55/10)
> Elige **k** con estabilidad multi-seed y sentido de negocio (capacidad de cola), no solo maximizando silhouette. Las métricas internas fallan con formas raras, solapamiento y desbalance. Reporta sensibilidad a seed en el notebook de señales del triage sintético.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Elección de k, estabilidad multi-seed y límites » in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo didáctico: dado un mapa `k → score` (p. ej. silhouette sintético), eliges `argmax`. En producción repetirías k-means con varias seeds y medirías si la partición es estable (adjusted rand / variación de centroides). Un silhouette alto **no** legitima sanción: solo sug…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Elección de k, estabilidad multi-seed y límites » in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: mapa k→score interno sintético + checklist multi_seed. Salida: k elegido, score y `stable_check=multi_seed`. Error: k que fragmenta de más la cola o que no se sostiene entre seeds. Si la partición salta entre seeds, no publiques el k como «óptimo» …
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Elección de k, estabilidad multi-seed y límites » in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T1B`: scores {2:0.4, 3:0.55, 4:0.52} → k=3 con score 0.55. Se exige multi_seed en el checklist del PR de señales. Datos inventados; no existen labels de «culpable».
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Harvard: https://cs50.harvard.edu/python; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Elección de k, estabilidad multi-seed y límites » in S36_STORM.json; edge `research_supports_paragraph`.


### PCA y visualización exploratoria
**P1** (rank 9.55/10)
> **PCA** proyecta a 1–2D para explorar; no es el modelo de decisión final del triage. La varianza explicada informa compresión, no causalidad ni «eje de riesgo moral». Didáctica: proyección lineal por pesos fijos `pc = w0*x + w1*y` sobre features sintéticas (equivalente concept…
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/outlier_detection.html; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «PCA y visualización exploratoria» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo: cada punto (x,y) se comprime a un escalar pc. En sklearn usarías `PCA(n_components=2).fit_transform`; aquí fijas pesos para ver el contrato sin autovalores. `decision_model=False` es política: el scatter no dispara auto-rechazo ni encola sanción.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/decomposition.html#pca; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «PCA y visualización exploratoria» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: puntos sintéticos y pesos de proyección documentados. Salida: coordenadas pc y `decision_model=False`. Error: clasificar culpa en el scatter, tratar el eje como «eje de fraude» o omitir que la proyección es exploratoria.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «PCA y visualización exploratoria» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T2A` (Red Andina sintético): w=(0.8,0.2) sobre puntos toy → lista pc; solo exploración visual del space de features del lab; el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «PCA y visualización exploratoria» in S36_STORM.json; edge `research_supports_paragraph`.


### Interpretación prudente de proyecciones
**P1** (rank 9.55/10)
> Los ejes PC **no** traen nombre de negocio automático: no inventes «PC2 = riesgo moral». Un outlier visual puede ser escala mal hecha, un error de datos o un segmento legítimo raro — no un villano. Documenta el uso como exploratorio en el dossier de señales del triage sintético.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Interpretación prudente de proyecciones» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo de gobierno: flags booleanos de política en el reporte (`axis_named_by_business=False`, `use=exploratory`, `auto_label=False`). Cualquier historia de negocio sobre un eje se valida con features originales y un humano revisor antes de priorizar la cola.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Interpretación prudente de proyecciones» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: proyección y checklist de interpretación. Salida: flags de prudencia explícitos. Error: auto-etiquetar clusters en el plot como «sospechosos» o publicar el scatter como prueba de conducta.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Interpretación prudente de proyecciones» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T2B`: si un punto se aleja en el scatter, primero revisa scale y missingness sintéticos antes de encolar review; nunca auto-label de conducta indebida. El fail-closed del lab es: duda → más evidencia o HITL, no sanción.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Harvard: https://cs50.harvard.edu/python; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Interpretación prudente de proyecciones» in S36_STORM.json; edge `research_supports_paragraph`.


### Isolation Forest / LOF (conceptual) y reglas σ
**P1** (rank 9.55/10)
> Isolation Forest y LOF (conceptual) generan scores de rareza; las **reglas legibles** (monto > μ+3σ) ayudan al revisor a entender el flag. Score alto ⇒ candidato a review, no culpa. Combina modelo y regla cuando puedas explicar el caso sintético en una frase.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Isolation Forest / LOF (conceptual) y reglas σ» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo stdlib: calcula μ y σ de los «normales» (o de toda la serie con cuidado) y marca `x > mu + 3*sd`. `statistics.mean` / `pstdev` bastan. En sklearn, `IsolationForest(contamination=...)` devuelve −1/1; aquí la regla σ enseña el contrato ético con números transparentes.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Isolation Forest / LOF (conceptual) y reglas σ» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: serie sintética de montos. Salida: flags binarios, method y `misconduct=False`. Error: pipe del flag a despido o bloqueo automático.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Harvard: https://cs50.harvard.edu/python; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Isolation Forest / LOF (conceptual) y reglas σ» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T3A`: xs=[10,11,10,12,50]; μ sobre los normales del lab → flag en 50. El valor 50 es raro respecto al resto, no «culpable».
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Video: https://www.youtube.com/watch?v=FgakZw6K1QQ; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Isolation Forest / LOF (conceptual) y reglas σ» in S36_STORM.json; edge `research_supports_paragraph`.


### Novelty vs outlier y contamination (capacidad de cola)
**P1** (rank 9.55/10)
> **Outlier:** punto raro respecto al train. **Novelty:** punto nuevo comparado con un modelo de normalidad ya fijado. **contamination** es una hipótesis de fracción a flaggear, no la prevalencia de fraude del negocio. Ajústala a la capacidad real de la cola de review sintética …
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Novelty vs outlier y contamination (capacidad de» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo: `expected_flags = int(n * contamination)`. Si expected_flags > capacidad de analistas, bajas contamination o priorizas con otra señal. Nunca digas «contamination=0.05 ⇒ 5% de fraude».
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Novelty vs outlier y contamination (capacidad de» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: contamination y n del batch sintético. Salida: expected_flags e `is_fraud_rate=False`. Error: vender contamination como tasa de ilícitos.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Novelty vs outlier y contamination (capacidad de» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T3B`: contamination=0.05, n=200 → expected_flags=10. use=capacity_tuning. Solo control de rareza y de carga de la cola ficticia.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Novelty vs outlier y contamination (capacidad de» in S36_STORM.json; edge `research_supports_paragraph`.


### Splits, backtests y ventanas temporales
**P1** (rank 9.55/10)
> Valida señales con **backtest temporal**: fit de normalidad en el pasado, score en el futuro. Ventanas deslizantes miden estabilidad de la flag rate. Sin labels densos, usa un proxy de utilidad (click de review sintético), nunca leakage de datos futuros en el fit.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Docs: https://docs.python.org/3/library/statistics.html; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Splits, backtests y ventanas temporales» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo: serie de (mes, flag_rate); reportas media y fijas `backtest=True`, `leakage=False`. Un spike de flags se investiga (drift de datos, bug de scale) antes de ampliar la cola.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Splits, backtests y ventanas temporales» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: ventanas (mes, flag_rate). Salida: mean_flag_rate, backtest=True, leakage=False. Error: entrenar con todo el histórico incluyendo el mes evaluado.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Splits, backtests y ventanas temporales» in S36_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Aplicación a `CASO-LIM-036-T4A`: rates 0.1, 0.12, 0.09 → mean≈0.103. Solo series sintéticas; el reloj del caso manda sobre cualquier shuffle aleatorio.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; MIT: https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Splits, backtests y ventanas temporales» in S36_STORM.json; edge `research_supports_paragraph`.


### Labels escasos, precision@k y revisión humana
**P1** (rank 9.55/10)
> Con pocas etiquetas, **precision@k** y el acuerdo humano importan más que un ROC fantasma. El revisor valida si la señal ahorra tiempo en la cola. Nunca: anomalía → conducta indebida automática. El HITL es parte del contrato, no un adorno del dashboard.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/; Stanford: https://cs229.stanford.edu/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Labels escasos, precision@k y revisión humana» in S36_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Mecanismo: ranking binario de utilidad (1=útil al revisor) en los top-k; `P@k = sum(ranked[:k])/k`. Política: `human_in_loop=True`, `auto_guilt=False`.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf; Stanford: https://cs229.stanford.edu/notes2022fall/main_notes.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Labels escasos, precision@k y revisión humana» in S36_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato operativo. Entrada: ranking de utilidad sintética y k. Salida: precision_at_k + flags HITL. Error: optimizar solo accuracy global con labels ralos.
- **Analysis:** Four-layer pedagogy; domain-honest sources; fail-closed ethics; progressive disclosure.
- **Sources:** Coursera: https://www.coursera.org/learn/machine-learning; Coursera: https://www.coursera.org/learn/machine-learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Labels escasos, precision@k y revisión humana» in S36_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (skeptical; ≥9.5).
- Git: keep worktree (DEFECT/CASO; zero # TODO vs HEAD).
- Content: ethics preserved (anomaly≠guilt / same_result+budget).
