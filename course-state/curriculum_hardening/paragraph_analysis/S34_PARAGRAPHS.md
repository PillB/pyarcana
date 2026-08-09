# S34 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:42:25.457+00:00
Section: Métricas, desbalance, calibración y umbrales
File: `s34-cv-ai-integration.ts`
STORM cycles: **34**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- sklearn: [Model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html) — P/R/F Brier
- sklearn: [Calibration](https://scikit-learn.org/stable/modules/calibration.html) — Platt isotonic
- sklearn: [PR curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html) — PR-AUC
- Google: [ML Crash Course classification](https://developers.google.com/machine-learning/crash-course/classification) — thresholds
- Google: [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml) — honest metrics
- imbalanced-learn: [Docs](https://imbalanced-learn.org/stable/) — resampling
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — risk
- Coursera: [ML specialization](https://www.coursera.org/specializations/machine-learning-introduction) — evaluation
- deeplearning.ai: [Courses](https://www.deeplearning.ai/) — calibration
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

### Cierre CP-N3-B: Relationship Investigation Workbench
**P1** (rank 9.55/10)
> Esta sección **cierra CP-N3-B** integrando grafo (S31), features (S32) y baselines (S33) con **métricas de ranking**, **calibración** y **umbrales por capacidad** de revisión hu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; sklearn: https://scikit-learn.org/stable/modules/calibration.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-B: Relationship Investigation Workb» in S34_STORM.json.

**P2** (rank 9.55/10)
> Producto incremental: workbench que **prioriza cola y explica**; **no** imprime `fraud=true`. Entrada: scores y labels sintéticos `needs_review`; salida: precision@k, Brier, thr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/calibration.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-B: Relationship Investigation Workb» in S34_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 métricas** → **T2 desbalance** → **T3 calibración** → **T4 decisión**. Id legacy `cv-ai-integration` se conserva; **no** hay YOLO ni computer vision en V3 de esta se…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html; Google: https://developers.google.com/machine-learning/crash-course/classification
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-B: Relationship Investigation Workb» in S34_STORM.json.

### confusion matrix, precision/recall/F y PR-AUC
**P1** (rank 9.55/10)
> Con **desbalance**, accuracy engaña. **Precision, recall, Fβ** y el área bajo la curva **precision-recall** describen mejor la cola de revisión que un solo % de aciertos — la ma…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/crash-course/classification; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «confusion matrix, precision/recall/F y PR-AUC» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `y` y `pred` binarios; salida TP/FP/FN/TN y F1. Error: reportar **solo accuracy** con prevalencia baja. Criterio: confusion **completa** antes de elegir thr.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; imbalanced-learn: https://imbalanced-learn.org/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «confusion matrix, precision/recall/F y PR-AUC» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: `y=[1,0] pred=[1,1]` produce FP; F1 con P=R=0.5 es 0.5. El workbench documenta **costos distintos** de FP y FN (cola vs miss).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** imbalanced-learn: https://imbalanced-learn.org/stable/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «confusion matrix, precision/recall/F y PR-AUC» in S34_STORM.json.

### top-k y carga de revisión
**P1** (rank 9.55/10)
> **precision@k** y **recall@k** miden la calidad de los **k primeros** de la cola. Si alertas **> capacidad**, la carga satura al equipo: el thr debe **bajar el volumen**, no sol…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Coursera: https://www.coursera.org/specializations/machine-learning-introduction
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «top-k y carga de revisión» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada labels top-k y capacidad; salida precision@k y flag de overload. Error: **ignorar capacidad operativa**. Criterio: `k` alineado a capacidad diaria del clerical…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-introduction; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «top-k y carga de revisión» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: top-3 labels `[1,0,1]` → precision@3=2/3; 50 alertas vs capacidad 10 → overload y thr se reevalúa.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «top-k y carga de revisión» in S34_STORM.json.

### class weights y resampling dentro de CV
**P1** (rank 9.55/10)
> **Class weights** o **resampling solo dentro del fold de train** evitan leakage. Resamplear **todo** el dataset antes de CV infla métricas y **miente** sobre producción.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «class weights y resampling dentro de CV» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada conteos `n0/n1`; salida ratio de pesos y flag de política CV-safe. Error: **oversample global**. Criterio: minority count documentado **sin** tocar test/holdout.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «class weights y resampling dentro de CV» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: `n0=9 n1=1` → weight ratio 9; política `resample_global=False` en el pipeline del workbench.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «class weights y resampling dentro de CV» in S34_STORM.json.

### prevalencia y métricas engañosas
**P1** (rank 9.55/10)
> Si la **prevalencia** cae, la misma especificidad produce **peor precision**. Un clasificador **all-negative** luce genial en accuracy cuando la clase positiva es rara — y no pr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prevalencia y métricas engañosas» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada prevalencia y política de reporte; salida base rate y advertencia de precision. Error: comparar precision entre periodos **sin** base rate. Criterio: reportar …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; sklearn: https://scikit-learn.org/stable/modules/calibration.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prevalencia y métricas engañosas» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: 25/1000=0.025; all-neg accuracy≈0.975 engaña. El workbench prefiere **PR** y carga de cola.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/calibration.html; sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prevalencia y métricas engañosas» in S34_STORM.json.

### reliability curves y Brier
**P1** (rank 9.55/10)
> **Brier** (media de `(p−y)²`) y **reliability** (media de `p` vs frecuencia en bins) miden si el score se puede leer como probabilidad de **priorización**, **no** de culpa o fra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html; Google: https://developers.google.com/machine-learning/crash-course/classification
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reliability curves y Brier» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `p` y `y`; salida Brier y bin mean vs freq. Error: calibrar a ojo **sin** holdout. Criterio: menor Brier es mejor entre modelos comparables con misma tarea.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/crash-course/classification; Google: https://developers.google.com/machine-learning/guides/rules-of-ml
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reliability curves y Brier» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: `p=1,y=1` → Brier 0; un bin con mean p=0.8 y freq=0.5 muestra **mala reliability**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://developers.google.com/machine-learning/guides/rules-of-ml; imbalanced-learn: https://imbalanced-learn.org/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reliability curves y Brier» in S34_STORM.json.

### calibradores y evaluación fuera de muestra
**P1** (rank 9.55/10)
> **Platt** o **isotonic** se ajustan en un set de calibración **distinto** del train del modelo base. Evaluar calibración en el mismo set de fit es **autoengaño**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** imbalanced-learn: https://imbalanced-learn.org/stable/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibradores y evaluación fuera de muestra» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada raw scores y nombre de calibrador; salida scores clipados/calibrados misma longitud. Error: fit calibrator en **test final**. Criterio: holdout de calibración …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Coursera: https://www.coursera.org/specializations/machine-learning-introduction
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibradores y evaluación fuera de muestra» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: clip `1.5→1.0` y `-0.2→0.0`; `calibrator_set=holdout_v1`; raw y cal tienen misma longitud.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/machine-learning-introduction; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibradores y evaluación fuera de muestra» in S34_STORM.json.

### threshold por costo/capacidad
**P1** (rank 9.55/10)
> El **umbral** se elige por **costo** (`fp*c_fp+fn*c_fn`) y por **capacidad de la cola**, no por un default 0.5 de librería. El thr se **versiona** (`thr-v1`) para auditoría y ro…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «threshold por costo/capacidad» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada scores, costos, k deseado; salida thr que deja k en review y costo total. Error: thr fijo **sin** costos. Criterio: config thr versionada en el workbench.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «threshold por costo/capacidad» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: scores `[0.1,0.4,0.6,0.9]` con thr que deja 2 en review; costo `fp*2+fn*10` documentado.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «threshold por costo/capacidad» in S34_STORM.json.

### abstención, slices y sensibilidad
**P1** (rank 9.55/10)
> Banda **low/high de abstención** evita forzar labels 0/1 en zona gris. **Sensibilidad a thr** y métricas **por slice** detectan degradación local antes de promover el modelo — y…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «abstención, slices y sensibilidad» in S34_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada score, low, high; salida `review|skip|abstain` y dict de slice metrics. Error: **forzar 0/1** en banda. Criterio: abstain es **primera clase** del producto.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «abstención, slices y sensibilidad» in S34_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-034`: score 0.5 con low=0.3 high=0.7 → `abstain`; thr 0.5 vs 0.6 cambia `n_pos_pred` en sensibilidad.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; sklearn: https://scikit-learn.org/stable/modules/calibration.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «abstención, slices y sensibilidad» in S34_STORM.json.

