# S47 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:09:01.718560+00:00
Section: MLOps: experimentos, registro y serving
File: `s47-opensource.ts`
STORM cycles: **47**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- MLflow: [MLflow docs](https://mlflow.org/docs/latest/) — MLOps platform
- MLflow: [MLflow tracking](https://mlflow.org/docs/latest/tracking.html) — experiments
- MLflow: [Model registry](https://mlflow.org/docs/latest/model-registry.html) — stages
- Google: [Model Cards](https://modelcards.withgoogle.com/about) — model limits
- TFX: [ML Metadata](https://www.tensorflow.org/tfx/guide/mlmd) — lineage
- Feast: [Feast feature store](https://github.com/feast-dev/feast) — feature parity
- KServe: [KServe](https://kserve.github.io/website/latest/) — serving
- sklearn: [Model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html) — metrics
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — govern map measure
- Google: [MLOps whitepaper](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) — MLOps levels
- Coursera: [MLOps courses](https://www.coursera.org/courses?query=mlops) — MLOps MOOCs
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive disclosure
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — learner surface
- SRE: [Release engineering](https://sre.google/sre-book/release-engineering/) — canary rollback
- Live: [PyArcana](https://pillb.github.io/pyarcana/)

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO DEFECT 24/24 |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert pass | deepened theory + expanded resources |

## Theory (paragraph-level)

### Ruta de S47: MLOps: experimentos, registro y serving
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Experiment run:** params + metrics + seed + artefactos + dataset version. **Lineage:** data/code/env que produjo el run. **Model registry stage:** None → Staging → Production (con approve). **Model card:** límites, intended …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/tracking.html; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S47: MLOps: experimentos, registro y ser» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección industrializa señales del triage (N3) y el path N4 con **MLOps**: experiment tracking, model registry, feature store parity y serving con SLO. Demos stdlib al estilo MLflow/registry (referencia). El caso `CASO-TAC-047` (Tacna sintético) no entrena en GPU ni sube m…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/model-registry.html; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S47: MLOps: experimentos, registro y ser» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: run comparable + promote controlado. Entrada: dataset/version, métricas, card mínima y feature versions. Salida: candidate vs baseline, stage registry y canary/rollback. Error de promoción: métrica no reproducible, stage=production sin approve, leakage tr…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://modelcards.withgoogle.com/about; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S47: MLOps: experimentos, registro y ser» in S47_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 runs/métricas → T2 registry/cards → T3 features online/batch → T4 traffic y rollback. Teoría medible, iDo con helpers, weDo con defecto MLOps por ejercicio. Id legacy `opensource` no es el foco; V3 es MLOps del servicio gobernado. Stack didáctico: **stdlib** modeland…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** TFX: https://www.tensorflow.org/tfx/guide/mlmd; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S47: MLOps: experimentos, registro y ser» in S47_STORM.json; edge `research_supports_paragraph`.


### tracking y reproducibilidad
**P1** (rank 9.55/10)
> Tracking registra **parámetros, métricas, seed, artefactos y versión de dataset**; reproducibilidad exige poder **re-ejecutar el baseline** con el mismo lineage y obtener métricas dentro de tolerancia — no solo mirar un dashboard de una corrida antigua. Sin seed y sin data ver…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «tracking y reproducibilidad» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: rerun dentro de tolerancia declarada y lineage completo. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoció…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «tracking y reproducibilidad» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `tracking y reproducibilidad` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es rerun con seed fijo y métrica `f1` dentro de tolerancia. No contiene PII ni s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «tracking y reproducibilidad» in S47_STORM.json; edge `research_supports_paragraph`.


### data/code/env lineage y comparación
**P1** (rank 9.55/10)
> Cada run enlaza versión de data, código y entorno; comparar exige misma partición/metric definition y reportar incertidumbre.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/model-registry.html; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «data/code/env lineage y comparación» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: lineage completo y comparación homogénea. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://modelcards.withgoogle.com/about; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «data/code/env lineage y comparación» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `data/code/env lineage y comparación` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es lineage completo y comparación homogénea. No contiene PII ni secretos…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** TFX: https://www.tensorflow.org/tfx/guide/mlmd; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «data/code/env lineage y comparación» in S47_STORM.json; edge `research_supports_paragraph`.


### firmas, stages y approvals
**P1** (rank 9.55/10)
> Una firma fija nombres/tipos/rangos de entrada y salida; stages son estados gobernados y approval requiere evidencia independiente.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** TFX: https://www.tensorflow.org/tfx/guide/mlmd; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «firmas, stages y approvals» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: firma compatible y aprobación trazada. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxi…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Feast: https://github.com/feast-dev/feast; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «firmas, stages y approvals» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `firmas, stages y approvals` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es firma compatible y aprobación trazada. No contiene PII ni secretos; una señal …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** KServe: https://kserve.github.io/website/latest/; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «firmas, stages y approvals» in S47_STORM.json; edge `research_supports_paragraph`.


### artefactos, model card y compatibilidad
**P1** (rank 9.55/10)
> Artefactos llevan digest y dependencia; model card explica uso, límites, métricas y riesgos, incluida incompatibilidad de features.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/model-registry.html; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «artefactos, model card y compatibilidad» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: digest/card/compatibilidad verificados. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éx…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://modelcards.withgoogle.com/about; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «artefactos, model card y compatibilidad» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `artefactos, model card y compatibilidad` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es digest/card/compatibilidad verificados. No contiene PII ni secret…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** TFX: https://www.tensorflow.org/tfx/guide/mlmd; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «artefactos, model card y compatibilidad» in S47_STORM.json; edge `research_supports_paragraph`.


### batch/online y feature consistency
**P1** (rank 9.55/10)
> Batch y online deben compartir transformación o contract tests para evitar training-serving skew y feature leakage.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Feast: https://github.com/feast-dev/feast; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «batch/online y feature consistency» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de paridad. Entrada: firma batch y firma online de features. Salida: `consistent=True` solo si las firmas coinciden. Error: servir online con featurize distinto al training. Criterio: en Tacna sintético `feature_parity('features_v3','features_v3')` es True antes de ca…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** KServe: https://kserve.github.io/website/latest/; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «batch/online y feature consistency» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-TAC-047-T3A`: mismos modes batch/online y skew_risk en watch. Sin PII; el score de prioridad no es veredicto de conducta.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «batch/online y feature consistency» in S47_STORM.json; edge `research_supports_paragraph`.


### latency, batching y fallback
**P1** (rank 9.55/10)
> Presupuesta p95/p99, batching y capacidad; fallback debe ser seguro, medible y menos capaz, nunca una versión silenciosamente riesgosa.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** KServe: https://kserve.github.io/website/latest/; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency, batching y fallback» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: SLO de latencia y fallback probado. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito:…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency, batching y fallback» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `latency, batching y fallback` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es SLO de latencia y fallback probado. No contiene PII ni secretos; una señal i…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency, batching y fallback» in S47_STORM.json; edge `research_supports_paragraph`.


### shadow/canary y monitoring hooks
**P1** (rank 9.55/10)
> Shadow observa sin decidir; canary recibe tráfico limitado y monitoring hooks comparan calidad, drift, errores y negocio antes de promover.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://modelcards.withgoogle.com/about; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «shadow/canary y monitoring hooks» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: canary con criterio promote/stop. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** TFX: https://www.tensorflow.org/tfx/guide/mlmd; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «shadow/canary y monitoring hooks» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `shadow/canary y monitoring hooks` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es canary con criterio promote/stop. No contiene PII ni secretos; una señal…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Feast: https://github.com/feast-dev/feast; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «shadow/canary y monitoring hooks» in S47_STORM.json; edge `research_supports_paragraph`.


### rollback, retirement y audit
**P1** (rank 9.55/10)
> Rollback conserva modelo/config/features compatibles; retiro bloquea uso nuevo, mantiene audit y define fecha de eliminación.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/tracking.html; Feast: https://github.com/feast-dev/feast
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «rollback, retirement y audit» in S47_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: restauración y retirement auditados. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MLflow: https://mlflow.org/docs/latest/model-registry.html; KServe: https://kserve.github.io/website/latest/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «rollback, retirement y audit» in S47_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `rollback, retirement y audit` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es restauración y retirement auditados. No contiene PII ni secretos; una señal …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://modelcards.withgoogle.com/about; sklearn: https://scikit-learn.org/stable/modules/model_evaluation.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «rollback, retirement y audit» in S47_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved.
