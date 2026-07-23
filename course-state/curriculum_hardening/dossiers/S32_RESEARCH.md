# Research dossier — S32 Feature engineering y pipelines sin leakage

**Section file:** `s32-microservices.ts`  
**Residual (before):** STUB (avg_para≈85, avg_instr≈40, score=4)  
**Target:** gold vs S01/S02 pedagogy + S40 contract style  
**Legacy id:** `microservices` (conservado) · **V3 tema:** feature table CP-N3-B sin leakage

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | DeepLearning.AI *Feature Engineering* / *ML Engineering for Production* — train-serve consistency, point-in-time joins |
| Stanford | CS329S feature stores & training-serving skew; CS246 graph feature intuition (degree, paths) conceptually |
| MIT | Data engineering for ML discussions — temporal validity, as-of joins |
| Harvard | CS109 feature hygiene labs — missingness indicators, encoding |
| Yale | Applied stats seminars — leakage as contamination of evaluation |
| GitHub | `scikit-learn` ColumnTransformer/Pipeline; Feast feature store docs (conceptual); Google Rules of ML #leakage |
| Video | Full Stack Deep Learning feature pipelines; Made With ML data leakage episodes |

## Coverage gaps in current stub
- File still named microservices; theory partially retargeted but thin.
- Exercises lack half-open windows, group split, leakage name flags.
- Need feature catalog, fit/transform state, version bump on vocab change.

## Domain contracts
| Subtopic | Evidence artifact | Breach code | Missing code |
|----------|-------------------|-------------|--------------|
| T1-A types | catalog dtypes + row keys | `REJECT_UNKNOWN_FEATURE` | `REQUEST_CATALOG` |
| T1-B missing/scale | indicator + z-score policy | `REJECT_SILENT_FILL` | `REQUEST_MEDIAN` |
| T2-A relational | shared contact / degree / path | `REJECT_LABEL_AS_FEATURE` | `REQUEST_GRAPH_FEAT` |
| T2-B windows | half-open [t-w,t) counts | `REJECT_FUTURE_TS` | `REQUEST_WINDOW` |
| T3-A transformers | fit then transform sequence | `REJECT_TRANSFORM_BEFORE_FIT` | `REQUEST_FIT_STATE` |
| T3-B persist | json state + version | `REJECT_UNVERSIONED` | `REQUEST_STATE_JSON` |
| T4-A splits | time/group split no overlap | `REJECT_ENTITY_OVERLAP` | `REQUEST_SPLIT_KEYS` |
| T4-B leakage | name scan + train-serve skew | `REJECT_LEAKAGE` | `REQUEST_FEATURE_SET_ID` |

## Expansion plan
1. Theory ≥3×≥180 with `CASO-LIM-032` and `run_id=cpn3b-feat`.
2. 24 exercises with domain predicates and fail-closed codes.
3. No Docker/K8s content; pure feature engineering.
4. Preserve selfCheck count and export `section32`.
