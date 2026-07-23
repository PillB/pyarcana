# Research dossier — S34 Métricas, desbalance, calibración y umbrales

**Section file:** `s34-cv-ai-integration.ts`  
**Residual (before):** STUB (avg_para≈81, avg_instr≈32, score=4)  
**Target:** gold vs S01/S02 pedagogy + S40 contract style  
**Legacy id:** `cv-ai-integration` (conservado) · **V3 tema:** cierre CP-N3-B workbench ranking calibrado

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Machine Learning* (Andrew Ng) metrics modules; DeepLearning.AI *MLOps* specialization — threshold choice, monitoring precision/recall |
| Stanford | CS229 / CS229M evaluation notes — PR vs ROC under imbalance; calibration discussion in later ML systems notes |
| MIT | MIT 6.036 / probabilistic modeling materials — proper scoring rules (Brier) conceptually |
| Harvard | Harvard CS109 data science evaluation labs — class imbalance, prevalence effects on precision |
| Yale | Applied ML reading groups on decision thresholds and cost-sensitive classification (conceptual) |
| GitHub | `scikit-learn` calibration (`CalibratedClassifierCV`); `scikit-plot` reliability diagrams; Google blog posts on precision@k for ranking queues |
| Video | StatQuest confusion matrix / ROC; Full Stack Deep Learning evaluation lectures; Google ML Crash Course thresholding |

## Coverage gaps in current stub
- Theory thin slogans; need cost/capacity contracts for review queues.
- Exercises lack adverse prevalence, reliability bins, abstain bands.
- Must reinforce: ranking for human review ≠ fraud auto-label; ER/matching ≠ parentesco.

## Domain contracts
| Subtopic | Evidence artifact | Breach code | Missing code |
|----------|-------------------|-------------|--------------|
| T1-A P/R/F | confusion counts + F1 | `REJECT_ACCURACY_ONLY` | `REQUEST_CONFUSION` |
| T1-B top-k | precision@k / load vs capacity | `REJECT_QUEUE_OVERLOAD` | `REQUEST_CAPACITY` |
| T2-A weights | class weights inside fold | `REJECT_LEAKY_RESAMPLE` | `REQUEST_WEIGHTS` |
| T2-B prevalence | precision shift under base rate | `REJECT_PREVALENCE_BLIND` | `REQUEST_BASE_RATE` |
| T3-A Brier | reliability bin mean vs freq | `REJECT_UNCALIBRATED` | `REQUEST_BRIER` |
| T3-B calibrator | fit on holdout, transform serve | `REJECT_IN_SAMPLE_CAL` | `REQUEST_CAL_SET` |
| T4-A threshold | cost-aware thr + version id | `REJECT_FIXED_THR` | `REQUEST_COST_MATRIX` |
| T4-B abstain | low/high band + slice metrics | `REJECT_FORCE_LABEL` | `REQUEST_ABSTAIN_BAND` |

## Expansion plan
1. Theory ≥3×≥180 chars with `CASO-LIM-034` and workbench capacity language.
2. 24 exercises with exact PASS strings and fail-closed paths.
3. Pure Python demos; no YOLO/CV legacy content.
4. Preserve indices, subtopicIds, selfCheck count.
