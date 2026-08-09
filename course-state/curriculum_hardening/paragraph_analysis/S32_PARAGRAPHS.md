# S32 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:38:48.782+00:00
Section: Feature engineering y pipelines sin leakage
File: `s32-microservices.ts`
STORM cycles: **32**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- sklearn: [Compose Pipeline](https://scikit-learn.org/stable/modules/compose.html) — pipelines
- sklearn: [ColumnTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html) — columns
- sklearn: [Model persistence](https://scikit-learn.org/stable/model_persistence.html) — serialize
- sklearn: [Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) — leakage
- sklearn: [TimeSeriesSplit](https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split) — time split
- Feast: [Docs](https://docs.feast.dev/) — feature store
- Google: [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml) — skew
- Coursera: [MLOps specialization](https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops) — MLEP
- deeplearning.ai: [Data engineering](https://www.deeplearning.ai/specializations/data-engineering) — pipelines
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De microservicios legado a features sin leakage
**P1** (rank 9.55/10)
> En V3, **S32 no es Docker/K8s**: construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`) en Red …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/compose.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De microservicios legado a features sin leakage» in S32_STORM.json.

**P2** (rank 9.55/10)
> Producto incremental: **catálogo** + transformers **fit/transform idénticos** en train e inferencia, **sin futuro** ni labels de decisión como feature. Entrada: eventos y grafo …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html; sklearn: https://scikit-learn.org/stable/model_persistence.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De microservicios legado a features sin leakage» in S32_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Id legacy `microservices` se conserva. Features de contacto/shared address **no**…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/model_persistence.html; sklearn: https://scikit-learn.org/stable/common_pitfalls.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De microservicios legado a features sin leakage» in S32_STORM.json.

### numéricas/categóricas/texto
**P1** (rank 9.55/10)
> Diseña con **semántica temporal**: ¿la feature está **disponible en t de decisión**? Numéricas (montos, conteos), categóricas (canal, región) y texto (`note_len`, `token_count`)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/common_pitfalls.html; sklearn: https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «numéricas/categóricas/texto» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada schema `type→cols` y row; salida listas por tipo y validación `keys ⊆ catálogo`. Error: feature desconocida en serve o dtype roto. Criterio: **catalog completo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split; Feast: https://docs.feast.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «numéricas/categóricas/texto» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: schema numéricas `amount_7d`; texto `note_len`/`token_count`; row keys validadas contra catálogo del run `cpn3b-feat` (sintético, sin PII real).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Feast: https://docs.feast.dev/; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «numéricas/categóricas/texto» in S32_STORM.json.

### missing indicators, escalamiento y encoding
**P1** (rank 9.55/10)
> **Missing indicator** + fill (mediana/moda) preserva la **señal de ausencia**. One-hot con columna `unknown` y z-score con **μ/σ solo de train** evitan silent fill y **leakage d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; Coursera: https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missing indicators, escalamiento y encoding» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada serie con `None`, vocab de canal, μ/σ de train; salida indicator, one-hot, z. Error: calcular mediana con filas de test o re-fit en serve. Criterio: **stats co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missing indicators, escalamiento y encoding» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: `[1,None,3]` → indicator + mediana 2; canal `unknown` → col; z con μ=0 σ=2 del train fit.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missing indicators, escalamiento y encoding» in S32_STORM.json.

### shared contact/address, distance y graph features
**P1** (rank 9.55/10)
> Features **relacionales** (`shared_address`, degree, min path) resumen evidencia del grafo de S31. **No** conviertas el score de matching ni la centralidad en label de parentesc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «shared contact/address, distance y graph feature» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada dos entidades, vecinos, path dict; salida shared binario, degree, pathlen (default 99 si missing). Error: usar **label de decisión** o post-outcome como featur…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «shared contact/address, distance y graph feature» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: `shared_address=1`; degree de E1; min path missing → 99 en grafo sintético Lima–Arequipa.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «shared contact/address, distance y graph feature» in S32_STORM.json.

### ventanas y frecuencia
**P1** (rank 9.55/10)
> Ventanas **half-open** `[t−w, t)` cuentan eventos **sin** incluir el instante de decisión `t`. Incluir `ts==t` o **futuro** es **leakage temporal clásico** — el modelo “ve” el o…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/compose.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ventanas y frecuencia» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada lista `ts`, `t`, `w`, canal; salida count en ventana y freq por canal. Error: `ts>=t` dentro del count. Criterio: política half-open **documentada** en el feat…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/compose.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ventanas y frecuencia» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: eventos en `[t−3,t)`; frecuencia app/web; **excluye** `ts==t` del conteo de features del caso sintético.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html; sklearn: https://scikit-learn.org/stable/model_persistence.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ventanas y frecuencia» in S32_STORM.json.

### ColumnTransformer y custom transformers
**P1** (rank 9.55/10)
> Un **transformer** tiene `fit` (aprende estado) y `transform` (aplica). Encadenar fill luego scale exige `fitted=True`; **transform antes de fit debe fallar** de forma explícita…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/model_persistence.html; sklearn: https://scikit-learn.org/stable/common_pitfalls.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ColumnTransformer y custom transformers» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada serie categórica y pipeline steps; salida moda fit, transform `None→moda`, flag `not_fitted`. Error: transform silencioso sin fit. Criterio: **secuencia determ…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/common_pitfalls.html; sklearn: https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ColumnTransformer y custom transformers» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: moda de canal; pipeline fill0 luego *2; `not_fitted` levanta flag en el lab.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split; Feast: https://docs.feast.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ColumnTransformer y custom transformers» in S32_STORM.json.

### fit/transform y persistencia
**P1** (rank 9.55/10)
> El **estado** (mediana, vocab) se serializa a JSON y se **reutiliza en serve**. Si el vocab cambia, **version bump** del feature set (`fs-vN`). Aplicar mediana de train al batch…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Feast: https://docs.feast.dev/; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fit/transform y persistencia» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada state dict; salida round-trip JSON y version. Error: servir **sin version**. Criterio: `fs-vN` en artefactos y hash de schema.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; Coursera: https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fit/transform y persistencia» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: state `median=2` round-trip; vocab change → `v2`; apply median al serve batch sintético.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fit/transform y persistencia» in S32_STORM.json.

### split por entidad/grupo/tiempo
**P1** (rank 9.55/10)
> **Split temporal** (`train ts < cutoff`) y **group split por entity** evitan overlap. Si una entidad aparece en train y test, hay **leakage de identidad** (el modelo memoriza la…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split por entidad/grupo/tiempo» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada rows con `ts` y `entity`; salida train/test sets y `overlap` count. Error: `overlap>0` en el gate. Criterio: group sizes reportados en el informe de split.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split por entidad/grupo/tiempo» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: train `ts<'2026-02-01'`; group sizes; **overlap entidades = 0**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split por entidad/grupo/tiempo» in S32_STORM.json.

### leakage, train–serve skew y versionado
**P1** (rank 9.55/10)
> Nombres con `label` o `decision` en features son **red flags** de leakage. Si `serve_mean` se desvía **>tol** de `train_mean`, hay **train–serve skew**. El feature set id `fs-vN…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage, train–serve skew y versionado» in S32_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada feature names, means, version; salida leak flags, skew alert, fs id. Error: **promover con leakage**. Criterio: scan de nombres + skew check en CI.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/compose.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage, train–serve skew y versionado» in S32_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-032`: flag `label_decision`; skew si `|serve−train|>0.5`; id `fs-v2`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/compose.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage, train–serve skew y versionado» in S32_STORM.json.

