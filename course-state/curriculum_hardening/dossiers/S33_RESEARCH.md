# Research dossier — S33 ML supervisado y baselines responsables

**Section file:** `s33-advanced-models.ts`  
**Residual (before):** STUB (avg_para≈79, avg_instr≈33, score=3)  
**Target:** gold vs S01/S02 pedagogy + S40 contract style  
**Legacy id:** `advanced-models` (conservado) · **V3 tema:** baselines responsables workbench CP-N3-B

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | Andrew Ng *Machine Learning* / *Supervised ML* — logistic regression, regularization, bias-variance |
| Stanford | CS229 lecture notes — linear models, regularization, tree methods overview |
| MIT | MIT 6.036 intro ML — hypothesis classes, validation, overfitting controls |
| Harvard | CS109 / Stat 110 adjacent — baselines, prevalence, honest evaluation framing |
| Yale | Statistical learning seminars — interpretation of coefficients vs causal claims |
| GitHub | `scikit-learn` dummy estimators & pipelines; Google Rules of ML (baseline first); MLflow tracking minimal patterns |
| Video | StatQuest logistic regression & random forests; Made With ML experiment tracking |

## Coverage gaps in current stub
- Stacking/XGBoost legacy noise vs V3 “baseline first”.
- Exercises lack unit/target/horizon contracts and fraud-name rejection.
- Need: dummy majority, cost FP/FN, group CV by entity, seed control.

## Domain contracts
| Subtopic | Evidence artifact | Breach code | Missing code |
|----------|-------------------|-------------|--------------|
| T1-A framing | unit + target + horizon | `REJECT_FRAUD_TARGET` | `REQUEST_HORIZON` |
| T1-B baseline | dummy/rule vs cost | `REJECT_NO_BASELINE` | `REQUEST_COST` |
| T2-A logistic | sigmoid + thresholded pred | `REJECT_UNREGULARIZED` | `REQUEST_SIGMOID` |
| T2-B coefs | scaled features + sign | `REJECT_UNSCALED_COEF` | `REQUEST_SCALE_FLAG` |
| T3-A trees | stump/ensemble vote | `REJECT_DEPTH_UNLIMITED` | `REQUEST_STUMP` |
| T3-B overfit | train-valid gap + seed | `REJECT_OVERFIT` | `REQUEST_SEED` |
| T4-A tracking | run metrics JSON keys | `REJECT_UNLOGGED_RUN` | `REQUEST_METRICS` |
| T4-B CV | group CV by entity | `REJECT_RANDOM_LEAK` | `REQUEST_GROUP_IDS` |

## Expansion plan
1. Theory stresses needs_review target, not fraud labels.
2. Exercises CASO-LIM-033 with honest solutions.
3. Progressive disclosure: pure Python math, no untaught XGBoost APIs.
4. Preserve selfCheck count and subtopicIds.
