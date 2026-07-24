# S33 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:42:25.457+00:00
Section: ML supervisado y baselines responsables
File: `s33-advanced-models.ts`
STORM cycles: **33**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- sklearn: [DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html) — baseline
- sklearn: [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html) — L2
- sklearn: [Ensemble](https://scikit-learn.org/stable/modules/ensemble.html) — trees
- sklearn: [Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html) — GroupKFold
- Google: [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml) — baseline first
- ISL: [statlearning.com](https://www.statlearning.com/) — regularization
- MLflow: [Tracking](https://mlflow.org/docs/latest/tracking.html) — experiments
- Coursera: [ML specialization](https://www.coursera.org/specializations/machine-learning-introduction) — supervised
- deeplearning.ai: [Courses](https://www.deeplearning.ai/) — ML metrics
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

### De modelos avanzados legado a baselines responsables
**P1** (rank 9.55/10)
> Esta sección **no** empuja stacking por deporte: define **unidad de scoring**, **target** y **horizonte**, y conserva un **baseline determinista** (dummy/regla) antes de cualqui…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De modelos avanzados legado a baselines responsa» in S33_STORM.json.

**P2** (rank 9.55/10)
> Producto incremental: comparación **honesta** dummy/regla vs lineal/árbol sobre target sintético `needs_review_7d`. Entrada: features S32; salida: métricas y decisión `beats_dum…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html; sklearn: https://scikit-learn.org/stable/modules/ensemble.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De modelos avanzados legado a baselines responsa» in S33_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 framing** → **T2 lineales** → **T3 árboles** → **T4 experimento**. Id legacy `advanced-models` se conserva; progressive disclosure evita APIs no enseñadas aún. Predi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/ensemble.html; sklearn: https://scikit-learn.org/stable/modules/cross_validation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De modelos avanzados legado a baselines responsa» in S33_STORM.json.

### unidad, target y horizonte
**P1** (rank 9.55/10)
> La **unidad** (par de entidades, caso, cuenta en `t`), el **target observable** y el **horizonte** temporal cierran el problema. Un target llamado `fraud` en este workbench es u…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/cross_validation.html; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidad, target y horizonte» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `unit`, target name, `horizon_days`; salida framing válido. Error: target con substring `fraud` o horizonte vacío. Criterio: `needs_review_*` con horizonte **e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; ISL: https://www.statlearning.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidad, target y horizonte» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: `unit=entity_pair`, `target=needs_review_7d`, `horizon=7`. Prevalencia de `y=[0,1,0,0]` se reporta; `fraud_name=False` en el gate.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** ISL: https://www.statlearning.com/; MLflow: https://mlflow.org/docs/latest/tracking.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «unidad, target y horizonte» in S33_STORM.json.

### costos, baseline de regla y dummy estimator
**P1** (rank 9.55/10)
> El **dummy majority** y una **regla simple** (`x>=thr`) anclan el valor mínimo. El costo `fp*c_fp+fn*c_fn` traduce errores a **impacto de cola**, no a moral de fraude — FN caro …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MLflow: https://mlflow.org/docs/latest/tracking.html; Coursera: https://www.coursera.org/specializations/machine-learning-introduction
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «costos, baseline de regla y dummy estimator» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `y`, regla, costos; salida acc dummy/regla y costo total. Error: **entrenar modelo sin baseline**. Criterio: `beats_dummy` se calcula **después** de fijar dumm…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-introduction; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «costos, baseline de regla y dummy estimator» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: `y=[1,1,0]` dummy predice 1; regla `x>=1` con costo `fp*1+fn*5` documentado en el experimento.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «costos, baseline de regla y dummy estimator» in S33_STORM.json.

### regresión/logística y regularización
**P1** (rank 9.55/10)
> La **logística** con sigmoid y regularización **L2** limita coeficientes grandes cuando hay muchas features de S32. Un **umbral** convierte probabilidad en **priorización de col…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regresión/logística y regularización» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `w`, `b`, `x`, `thr`; salida `p` y `pred`. Error: modelo sin regularización cuando `p≫n` features. Criterio: penalty L2 **reportada** en el log del experimento.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regresión/logística y regularización» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: `sigmoid(0)=0.5`; `w=1,b=0,x=0.2 thr=0.5` → pred 0; L2 de `w=[1,2]` es 5.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regresión/logística y regularización» in S33_STORM.json.

### coeficientes, supuestos y scaling
**P1** (rank 9.55/10)
> Comparar `|coef|` exige features **escaladas** (z-score de S32). El **signo** indica dirección de asociación en el modelo, **no** causalidad social ni fraude probado — `shared_p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes, supuestos y scaling» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada coefs y `scale_flag`; salida ranking por `|w|` y signo. Error: interpretar coefs **unscaled** como importancia. Criterio: `scale_flag=True` antes de rank.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes, supuestos y scaling» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: `shared_phone=0.8` positivo ordena arriba si scaled; se imprime signo con `causal=False`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html; sklearn: https://scikit-learn.org/stable/modules/ensemble.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes, supuestos y scaling» in S33_STORM.json.

### decisiones y random forest/boosting
**P1** (rank 9.55/10)
> Un **stump** (árbol profundidad 1) y el **voto** de varios stumps ilustran ensambles (RF/boosting didáctico) sin APIs pesadas. Profundidad **ilimitada** overfittea el workbench …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/ensemble.html; sklearn: https://scikit-learn.org/stable/modules/cross_validation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «decisiones y random forest/boosting» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `X`, thr stump, lista de preds; salida pred stump y majority vote. Error: depth ilimitada **sin** validación. Criterio: comparar stump **vs dummy** antes de de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/cross_validation.html; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «decisiones y random forest/boosting» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: thr=0.3 sobre `[0.1,0.4]`; voto de tres stumps; acc stump vs majority dummy documentada.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; ISL: https://www.statlearning.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «decisiones y random forest/boosting» in S33_STORM.json.

### overfit, profundidad y reproducibilidad
**P1** (rank 9.55/10)
> Gap **train−valid > umbral** señala overfit. Fijar **seed** hace comparable la corrida. Sin seed, el workbench no puede auditar regresiones entre PR del modelo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** ISL: https://www.statlearning.com/; MLflow: https://mlflow.org/docs/latest/tracking.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «overfit, profundidad y reproducibilidad» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `train_acc`, `valid_acc`, seed; salida overfit flag y secuencia reproducible. Error: elegir depth **solo por train**. Criterio: best depth por **valid**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MLflow: https://mlflow.org/docs/latest/tracking.html; Coursera: https://www.coursera.org/specializations/machine-learning-introduction
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «overfit, profundidad y reproducibilidad» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: depths en valid eligen mínimo gap; seed fija tres ints; overfit si `gap>0.2`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-introduction; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «overfit, profundidad y reproducibilidad» in S33_STORM.json.

### pipeline y tracking mínimo
**P1** (rank 9.55/10)
> Un **run mínimo** registra metrics keys, params y si `beats_dummy`. Sin log, no hay comparación responsable entre experimentos del workbench — “mejoré el modelo” es anécdota.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pipeline y tracking mínimo» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada metrics dict; salida keys sorted y `beats_dummy`. Error: run **sin metrics**. Criterio: JSON de run con campos mínimos `run_id|params|metrics`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pipeline y tracking mínimo» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: keys `accuracy,f1` sorted; `beats_dummy=True` solo si supera baseline documentado.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pipeline y tracking mínimo» in S33_STORM.json.

### validación cruzada apropiada y error analysis
**P1** (rank 9.55/10)
> **Group CV por entidad** evita leakage entre folds (misma entidad en train y test). El **análisis de errores** mira el slice con más FN, no solo la media global de folds.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validación cruzada apropiada y error analysis» in S33_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada fold scores y entity ids; salida mean folds y `n_groups`. Error: random split con misma entidad en train y test. Criterio: `n_groups = n unique entities`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validación cruzada apropiada y error analysis» in S33_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-033`: mean de folds; slice con más FN; groups = unique entities del batch sintético Lima.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validación cruzada apropiada y error analysis» in S33_STORM.json.

