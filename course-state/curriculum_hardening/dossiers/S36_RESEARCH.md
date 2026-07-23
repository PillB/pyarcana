# Research dossier — S36 Clustering, anomalías y validación temporal

**Section file:** `s36-ai-apis-advanced.ts`  
**Platform id (conservado):** `ai-apis-advanced`  
**Residual:** STUB (avg_para≈70, avg_instr≈20, starters vacíos)  
**Target:** gold vs S01/S02 depth + fail-closed language (anomalía ≠ culpa); no S37+ perf budgets as hard deps in exercises

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Unsupervised Learning / Clustering* modules in IBM & University of Michigan ML specializations; *Applied Machine Learning* (Michigan) — evaluation under scarce labels; DeepLearning.AI *AI for Everyone* — human oversight framing |
| MIT | MIT 6.036 / 6.862 ML lectures (OCW-adjacent materials) — k-means, dimensionality reduction intuition; MIT *Statistics for Applications* — multiple testing and overinterpretation of outliers |
| Stanford | CS229 *Machine Learning* (Andrew Ng) — unsupervised learning, PCA; CS229 notes on anomaly detection; Stanford HAI primers on human review of automated flags |
| Harvard | HarvardX *Data Science: Unsupervised Learning* (Irizarry) — clustering caveats; Berkman Klein / ethics primers — automated suspicion vs due process (conceptual, no legal advice) |
| GitHub | `scikit-learn/scikit-learn` (`sklearn.cluster`, `IsolationForest`, `LocalOutlierFactor`, `PCA`); `pyod` library (conceptual reference); model-card examples for unsupervised systems |
| Video | StatQuest *K-means* and *PCA* videos; sklearn documentation tutorials; Google ML Crash Course clustering segments; “Anomaly detection” industrial talks emphasizing precision@k and analyst workflow |

## Section map

1. **Mapa** — Señales no supervisadas para triage CP-N3-C (auxiliares, no veredictos)  
2. **S36-T1-A** escalamiento y k-means/density  
3. **S36-T1-B** elección k, estabilidad y métricas limitadas  
4. **S36-T2-A** PCA y visualización exploratoria  
5. **S36-T2-B** interpretación prudente de proyecciones  
6. **S36-T3-A** Isolation Forest/LOF conceptual + reglas σ  
7. **S36-T3-B** novelty vs outlier y contamination  
8. **S36-T4-A** splits/backtests y ventanas temporales  
9. **S36-T4-B** labels escasos, precision@k y revisión humana  

## Coverage gaps

- Slogan theory (“Anomalía ≠ culpa” alone).  
- Empty starters; exercises are print targets without domain contract.  
- Must keep sklearn usage at conceptual/stdlib-arithmetic level if course already introduced sklearn earlier (S09/S10) — toy 1D k-means and sigma rules are safe; avoid new heavy APIs not yet taught.  
- Synthetic only; ER scores ≠ fraud/parentesco.

## Expansion plan

1. Theory depth + Peru synthetic `CASO-LIM-036`.  
2. 24 weDo with review-queue utility framing and exact outputs.  
3. Defective starters (inverted scale, contamination-as-fraud, leakage in fit).  
4. `S36_DONE.md` before/after kb.
