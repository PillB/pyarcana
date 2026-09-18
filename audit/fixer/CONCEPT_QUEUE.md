# Concept queue — every use a learner meets before the course explains it

Generated 2026-09-17 from a course-wide diagnosis of 63 concepts and 898 surprising uses:
eight read-only diagnosers, an adversarial verifier per cluster (C2-C5 were verified twice by
two independent passes, and the strictest verdict is the one recorded here), and a completeness
critic over all of it. Every row was read in source; the verdict is the verifier's, not the
diagnoser's, and each AMENDED row carries what the verifier corrected.

Treatments: REMOVE_THROWAWAY / REPLACE_PLAIN_WORDS (D6 q1 — the learner never acts on the term),
GLOSS_AT_FIRST_USE (the D1 floor), TEACH_SUBSECTION_D3 (load-bearing), MOVE_USE_LATER,
TEACH_EARLIER, ALREADY_TAUGHT_INSTRUMENT_FN (the prose teaches it and the detector could not see
it), ALIAS_FALSE_MATCH / HOMONYM (glossary data, not content), IDENTIFIER_KEEP, Q3_ROUTE_PENDING
(inside the S02-S04 cumulative capstone, waiting on the route decision in OPEN_QUESTIONS).

| # | section | concept | treatment | uses | verdict | passes | corrected |
|---|---|---|---|---|---|---|---|
| 1 | S01 | `annotation` | REMOVE_THROWAWAY | 2 | UPHELD | 1 |  |
| 2 | S01 | `function` | REMOVE_THROWAWAY | 1 | UPHELD | 1 |  |
| 3 | S01 -> S10 | `function` | MOVE_USE_LATER | 5 | UPHELD | 1 |  |
| 4 | S01 -> S10 | `function` | MOVE_USE_LATER | 1 | AMENDED | 1 |  |
| 5 | S01 | `function` | ALIAS_FALSE_MATCH | 1 | UPHELD | 1 |  |
| 6 | S01 | `github` | ALREADY_TAUGHT_INSTRUMENT_FN | 3 | UPHELD | 2 |  |
| 7 | S01 | `gitignore` | ALREADY_TAUGHT_INSTRUMENT_FN | 4 | UPHELD | 2 |  |
| 8 | S01 | `gitignore` | MOVE_USE_LATER | 1 | AMENDED | 2 | TEACH_EARLIER_IN_PLACE (D6 question 2): keep the ignore step before th |
| 9 | S01 | `gitignore` | ALREADY_TAUGHT_INSTRUMENT_FN | 12 | UPHELD | 2 |  |
| 10 | S01 | `if` | REMOVE_THROWAWAY | 1 | UPHELD | 1 |  |
| 11 | S01 -> S10 | `if` | MOVE_USE_LATER | 8 | UPHELD | 1 |  |
| 12 | S01 -> S10 | `if` | MOVE_USE_LATER | 1 | UPHELD | 1 |  |
| 13 | S01 | `interprete` | ALREADY_TAUGHT_INSTRUMENT_FN | 1 | UPHELD | 2 |  |
| 14 | S01 | `interprete` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 2 |  |
| 15 | S01 | `pip` | ALREADY_TAUGHT_INSTRUMENT_FN | 7 | UPHELD | 2 |  |
| 16 | S01 | `repositorio-repo` | ALREADY_TAUGHT_INSTRUMENT_FN | 2 | UPHELD | 2 |  |
| 17 | S01 | `return` | REMOVE_THROWAWAY | 1 | UPHELD | 1 |  |
| 18 | S01-S03 | `return` | ALIAS_FALSE_MATCH | 16 | UPHELD | 1 |  |
| 19 | S01 | `return` | HOMONYM | 1 | UPHELD | 1 |  |
| 20 | S01 | `set` | ALIAS_FALSE_MATCH | 1 | UPHELD | 2 |  |
| 21 | S02 | `abc` | ALIAS_FALSE_MATCH | 23 | AMENDED | 2 | ALIAS_FALSE_MATCH |
| 22 | S02 | `exception` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 23 | S02 | `exception` | Q3_ROUTE_PENDING | 1 | UPHELD | 2 |  |
| 24 | S02 | `for` | Q3_ROUTE_PENDING | 8 | UPHELD | 2 |  |
| 25 | S02 | `for` | Q3_ROUTE_PENDING | 7 | UPHELD | 2 |  |
| 26 | S02 | `for` | Q3_ROUTE_PENDING | 5 | UPHELD | 2 |  |
| 27 | S02, S03 | `for` | ALIAS_FALSE_MATCH | 3 | REFUTED | 2 | ALIAS_FALSE_MATCH |
| 28 | S02 | `function` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 29 | S02 | `function` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 30 | S02 | `if` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 31 | S02 -> S03 (S03-T1-B) | `if` | MOVE_USE_LATER | 1 | AMENDED | 1 |  |
| 32 | S02 -> S03 (S03-T1-A) | `if` | MOVE_USE_LATER | 1 | UPHELD | 1 |  |
| 33 | S02 | `if` | Q3_ROUTE_PENDING | 1 | UPHELD | 1 |  |
| 34 | S02 | `parameter` | Q3_ROUTE_PENDING | 3 | UPHELD | 1 |  |
| 35 | S02 | `pipeline` | ALREADY_TAUGHT_INSTRUMENT_FN | 3 | UPHELD | 2 |  |
| 36 | S02-S10 | `pipeline` | ALREADY_TAUGHT_INSTRUMENT_FN | 51 | UPHELD | 2 |  |
| 37 | S02-S09 | `pipeline` | ALREADY_TAUGHT_INSTRUMENT_FN | 10 | UPHELD | 2 |  |
| 38 | S02 | `pyodide` | ALREADY_TAUGHT_INSTRUMENT_FN | 4 | AMENDED | 2 | ALREADY_TAUGHT_INSTRUMENT_FN |
| 39 | S02, S03 | `return` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 40 | S02 | `return` | Q3_ROUTE_PENDING | 11 | UPHELD | 1 |  |
| 41 | S03 | `for` | REMOVE_THROWAWAY | 7 | AMENDED | 2 | REMOVE_THROWAWAY |
| 42 | S03 | `for` | Q3_ROUTE_PENDING | 29 | UPHELD | 2 |  |
| 43 | S03 | `for` | Q3_ROUTE_PENDING | 2 | UPHELD | 2 |  |
| 44 | S03 | `outlier` | REPLACE_PLAIN_WORDS | 8 | UPHELD | 1 |  |
| 45 | S03 | `pyodide` | ALREADY_TAUGHT_INSTRUMENT_FN | 1 | UPHELD | 2 |  |
| 46 | S03 | `return` | TEACH_SUBSECTION_D3 | 12 | AMENDED | 1 |  |
| 47 | S03 | `return` | Q3_ROUTE_PENDING | 38 | UPHELD | 1 |  |
| 48 | S03 | `truthiness` | GLOSS_AT_FIRST_USE | 2 | AMENDED | 2 | GLOSS_AT_FIRST_USE |
| 49 | S03 | `truthiness` | REPLACE_PLAIN_WORDS | 1 | AMENDED | 2 | REPLACE_PLAIN_WORDS |
| 50 | S03 | `truthiness` | ALREADY_TAUGHT_INSTRUMENT_FN | 11 | UPHELD | 2 |  |
| 51 | S04 | `dict-comprehension` | Q3_ROUTE_PENDING | 4 | UPHELD | 2 |  |
| 52 | S04 | `for` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 2 |  |
| 53 | S04 | `for` | ALREADY_TAUGHT_INSTRUMENT_FN | 3 | UPHELD | 2 |  |
| 54 | S04 | `for` | ALREADY_TAUGHT_INSTRUMENT_FN | 3 | UPHELD | 2 |  |
| 55 | S04 | `list-comprehension` | ALREADY_TAUGHT_INSTRUMENT_FN | 2 | UPHELD | 2 |  |
| 56 | S04 | `parameter` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 57 | S04 | `return` | Q3_ROUTE_PENDING | 7 | UPHELD | 1 |  |
| 58 | S05, S08, S10 | `abc` | ALIAS_FALSE_MATCH | 8 | UPHELD | 2 |  |
| 59 | S05 | `annotation` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 60 | S05 | `annotation` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 61 | S05 | `annotation` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 62 | S05 | `annotation` | ALREADY_TAUGHT_INSTRUMENT_FN | 5 | UPHELD | 1 |  |
| 63 | S05 | `parameter` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 64 | S05 | `parameter` | GLOSS_AT_FIRST_USE | 2 | UPHELD | 1 |  |
| 65 | S05 (teach in S03) | `return` | TEACH_EARLIER | 1 | UPHELD | 1 |  |
| 66 | S05 | `return` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 67 | S05 | `return` | ALREADY_TAUGHT_INSTRUMENT_FN | 23 | UPHELD | 1 |  |
| 68 | S06, S10 | `merge` | HOMONYM | 6 | UPHELD | 2 |  |
| 69 | S06 | `shape` | HOMONYM | 9 | AMENDED | 1 |  |
| 70 | S06 | `slicing` | ALREADY_TAUGHT_INSTRUMENT_FN | 2 | UPHELD | 2 |  |
| 71 | S07 | `coverage` | ALIAS_FALSE_MATCH | 1 | UPHELD | 2 |  |
| 72 | S07, S13 | `merge` | HOMONYM | 4 | UPHELD | 2 |  |
| 73 | S09 | `abc` | ALIAS_FALSE_MATCH | 4 | UPHELD | 2 |  |
| 74 | S09 | `context-manager` | IDENTIFIER_KEEP | 1 | AMENDED | 2 | IDENTIFIER_KEEP |
| 75 | S09, S38, S51 | `correlaci-n` | HOMONYM | 7 | UPHELD | 1 |  |
| 76 | S09, S11, S12, S13 | `missing-values` | HOMONYM | 18 | UPHELD | 1 |  |
| 77 | S09 | `missing-values` | REPLACE_PLAIN_WORDS | 3 | UPHELD | 1 |  |
| 78 | S10 | `apply` | ALIAS_FALSE_MATCH | 5 | UPHELD | 2 |  |
| 79 | S10 | `pytest` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 80 | S10 | `pytest` | GLOSS_AT_FIRST_USE | 4 | UPHELD | 2 |  |
| 81 | S11 | `apply` | HOMONYM | 6 | UPHELD | 2 |  |
| 82 | S11 | `dunder-method` | GLOSS_AT_FIRST_USE | 1 | AMENDED | 2 |  |
| 83 | S11 | `dunder-method` | ALREADY_TAUGHT_INSTRUMENT_FN | 1 | AMENDED | 2 | COVERED_BY_GLOSS_AT_FIRST_USE (depends on group 0) |
| 84 | S11 | `entity-resolution` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 85 | S12 | `entity-resolution` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 86 | S13, S37 | `dict-comprehension` | TEACH_EARLIER | 4 | UPHELD | 2 |  |
| 87 | S13 | `embedding` | REMOVE_THROWAWAY | 1 | UPHELD | 2 |  |
| 88 | S13 | `entity-resolution` | GLOSS_AT_FIRST_USE | 5 | UPHELD | 2 |  |
| 89 | S13 | `entity-resolution` | ALREADY_TAUGHT_INSTRUMENT_FN | 1 | AMENDED | 2 | ALREADY_TAUGHT_INSTRUMENT_FN |
| 90 | S14 | `boolean-masking` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 91 | S14, S15, S16 | `boolean-masking` | ALREADY_TAUGHT_INSTRUMENT_FN | 9 | UPHELD | 1 |  |
| 92 | S14 | `broadcasting` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 93 | S14 | `broadcasting` | TEACH_SUBSECTION_D3 | 2 | AMENDED | 1 |  |
| 94 | S14 | `broadcasting` | ALREADY_TAUGHT_INSTRUMENT_FN | 4 | UPHELD | 1 |  |
| 95 | S14 | `dtype` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 96 | S14 | `dtype` | ALREADY_TAUGHT_INSTRUMENT_FN | 7 | UPHELD | 1 |  |
| 97 | S14 | `missing-values` | GLOSS_AT_FIRST_USE | 2 | UPHELD | 1 |  |
| 98 | S14 | `missing-values` | TEACH_SUBSECTION_D3 | 2 | UPHELD | 1 |  |
| 99 | S14 | `missing-values` | ALREADY_TAUGHT_INSTRUMENT_FN | 21 | UPHELD | 1 |  |
| 100 | S14 | `reshape` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 101 | S14 | `shape` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 102 | S14 | `shape` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 103 | S14 | `shape` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 104 | S14 | `vectorizaci-n` | GLOSS_AT_FIRST_USE | 2 | UPHELD | 1 |  |
| 105 | S14 | `vectorizaci-n` | GLOSS_AT_FIRST_USE | 3 | UPHELD | 1 |  |
| 106 | S14 | `vectorizaci-n` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 107 | S15 | `dataframe` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 108 | S15 | `dataframe` | ALREADY_TAUGHT_INSTRUMENT_FN | 4 | UPHELD | 1 |  |
| 109 | S15 | `eda` | REPLACE_PLAIN_WORDS | 1 | AMENDED | 1 |  |
| 110 | S15 | `groupby` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 111 | S15 -> S17 | `merge` | MOVE_USE_LATER | 1 | AMENDED | 2 | MOVE_USE_LATER |
| 112 | S15 | `merge` | REMOVE_THROWAWAY | 2 | UPHELD | 2 |  |
| 113 | S15 | `series` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 114 | S15 | `series` | ALREADY_TAUGHT_INSTRUMENT_FN | 3 | UPHELD | 1 |  |
| 115 | S16 | `distribuci-n-normal` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 116 | S16 | `groupby` | TEACH_SUBSECTION_D3 | 7 | AMENDED | 1 |  |
| 117 | S16 | `groupby` | REPLACE_PLAIN_WORDS | 2 | AMENDED | 1 |  |
| 118 | S16 | `iqr` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 119 | S16 | `iqr` | TEACH_SUBSECTION_D3 | 25 | AMENDED | 1 |  |
| 120 | S16 | `iqr` | IDENTIFIER_KEEP | 4 | UPHELD | 1 |  |
| 121 | S16 | `iqr` | TEACH_EARLIER | 8 | AMENDED | 1 |  |
| 122 | S16 | `outlier` | TEACH_SUBSECTION_D3 | 6 | UPHELD | 1 |  |
| 123 | S17 | `coverage` | HOMONYM | 7 | UPHELD | 2 |  |
| 124 | S17 | `groupby` | TEACH_EARLIER | 5 | UPHELD | 1 |  |
| 125 | S17 | `groupby` | ALREADY_TAUGHT_INSTRUMENT_FN | 2 | UPHELD | 1 |  |
| 126 | S17 | `merge` | GLOSS_AT_FIRST_USE | 2 | UPHELD | 2 |  |
| 127 | S17 | `merge` | REPLACE_PLAIN_WORDS | 1 | AMENDED | 2 |  |
| 128 | S17 | `merge` | ALREADY_TAUGHT_INSTRUMENT_FN | 2 | AMENDED | 2 | ALREADY_TAUGHT_INSTRUMENT_FN |
| 129 | S17 | `pivot-table` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 130 | S17 | `pivot-table` | ALREADY_TAUGHT_INSTRUMENT_FN | 5 | UPHELD | 1 |  |
| 131 | S17 | `resample` | REMOVE_THROWAWAY | 1 | UPHELD | 1 |  |
| 132 | S17 | `reshape` | HOMONYM | 1 | UPHELD | 1 |  |
| 133 | S17 | `reshape` | HOMONYM | 6 | UPHELD | 1 |  |
| 134 | S18 | `correlaci-n` | GLOSS_AT_FIRST_USE | 3 | UPHELD | 1 |  |
| 135 | S18 | `correlaci-n` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 136 | S18, S19, S35 | `correlaci-n` | ALREADY_TAUGHT_INSTRUMENT_FN | 14 | UPHELD | 1 |  |
| 137 | S18–S21 | `coverage` | HOMONYM | 33 | UPHELD | 2 |  |
| 138 | S18 | `distribuci-n-normal` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 139 | S18, S28 | `generator` | HOMONYM | 5 | AMENDED | 2 | HOMONYM |
| 140 | S18 | `iqr` | IDENTIFIER_KEEP | 4 | UPHELD | 1 |  |
| 141 | S18 | `p-value` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 142 | S22 | `apply` | HOMONYM | 9 | UPHELD | 2 |  |
| 143 | S24 | `coverage` | HOMONYM | 6 | UPHELD | 2 |  |
| 144 | S24 | `generator` | REMOVE_THROWAWAY | 1 | AMENDED | 2 | REMOVE_THROWAWAY |
| 145 | S25, S48 | `generator` | HOMONYM | 4 | UPHELD | 2 |  |
| 146 | S25 | `llm` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 2 |  |
| 147 | S25 | `llm` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 2 |  |
| 148 | S27 | `pytest` | GLOSS_AT_FIRST_USE | 3 | UPHELD | 2 |  |
| 149 | S27 | `pytest` | TEACH_SUBSECTION_D3 | 3 | AMENDED | 2 | TEACH_IN_PLACE at the opening of S27-T2-A (explicit instruction on the |
| 150 | S28 | `embedding` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 151 | S32 | `apply` | HOMONYM | 2 | AMENDED | 2 | HOMONYM |
| 152 | S32 | `joblib` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 153 | S32 | `mlops` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 2 |  |
| 154 | S33 | `cross-validation` | MOVE_USE_LATER | 1 | UPHELD | 1 |  |
| 155 | S34 | `resample` | HOMONYM | 8 | AMENDED | 1 |  |
| 156 | S37 | `generator` | GLOSS_AT_FIRST_USE | 1 | AMENDED | 2 | GLOSS_AT_FIRST_USE |
| 157 | S38 | `context-manager` | REPLACE_PLAIN_WORDS | 4 | UPHELD | 2 |  |
| 158 | S40 | `fastapi` | REPLACE_PLAIN_WORDS | 8 | AMENDED | 2 | REPLACE_PLAIN_WORDS |
| 159 | S40 | `namedtuple` | REMOVE_THROWAWAY | 3 | UPHELD | 2 |  |
| 160 | S40 | `namedtuple` | REMOVE_THROWAWAY | 2 | UPHELD | 2 |  |
| 161 | S41 | `fastapi` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 2 |  |
| 162 | S41 | `fastapi` | TEACH_SUBSECTION_D3 | 2 | AMENDED | 2 | TEACH_SUBSECTION_D3 |
| 163 | S48 | `embedding` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 2 |  |
| 164 | S49 | `generator` | ALIAS_FALSE_MATCH | 1 | UPHELD | 2 |  |
| 165 | advanced-models | `cross-validation` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 166 | advanced-models | `cross-validation` | TEACH_SUBSECTION_D3 | 3 | UPHELD | 1 |  |
| 167 | rpa-advanced | `f1-score` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 168 | streamlit-dashboards | `f1-score` | REMOVE_THROWAWAY | 9 | UPHELD | 1 |  |
| 169 | security-infra | `f1-score` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 170 | security-infra | `f1-score` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 171 | security-infra | `f1-score` | TEACH_SUBSECTION_D3 | 5 | AMENDED | 1 |  |
| 172 | ai-apis-advanced | `hyperparameter-tuning` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 173 | microservices | `onehotencoder` | GLOSS_AT_FIRST_USE | 1 | AMENDED | 1 |  |
| 174 | text-unicode-regex | `overfitting` | REPLACE_PLAIN_WORDS | 2 | UPHELD | 1 |  |
| 175 | security-infra | `overfitting` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 176 | advanced-models | `overfitting` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 177 | advanced-models | `overfitting` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 178 | advanced-models | `overfitting` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 179 | advanced-models | `overfitting` | ALREADY_TAUGHT_INSTRUMENT_FN | 20 | AMENDED | 1 |  |
| 180 | evidence-dashboard | `precision` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 181 | evidence-dashboard | `precision` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 182 | evidence-dashboard | `precision` | ALREADY_TAUGHT_INSTRUMENT_FN | 38 | UPHELD | 1 |  |
| 183 | evidence-dashboard | `precision` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 184 | fastapi | `precision` | HOMONYM | 1 | UPHELD | 1 |  |
| 185 | cv-ai-integration | `precision` | GLOSS_AT_FIRST_USE | 2 | UPHELD | 1 |  |
| 186 | evidence-dashboard | `recall` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 187 | evidence-dashboard | `recall` | NO_ACTION_JUSTIFIED | 1 | UPHELD | 1 |  |
| 188 | evidence-dashboard | `recall` | ALREADY_TAUGHT_INSTRUMENT_FN | 31 | UPHELD | 1 |  |
| 189 | evidence-dashboard | `recall` | REPLACE_PLAIN_WORDS | 1 | UPHELD | 1 |  |
| 190 | cv-ai-integration | `roc-auc` | GLOSS_AT_FIRST_USE | 3 | UPHELD | 1 |  |
| 191 | advanced-models | `shap` | REMOVE_THROWAWAY | 2 | UPHELD | 1 |  |
| 192 | ai-apis-advanced | `standardscaler` | IDENTIFIER_KEEP | 1 | UPHELD | 1 |  |
| 193 | security-infra | `train-test-split` | GLOSS_AT_FIRST_USE | 1 | UPHELD | 1 |  |
| 194 | security-infra | `train-test-split` | TEACH_SUBSECTION_D3 | 2 | UPHELD | 1 |  |

## Detail

### 1. S01 · `annotation` · REMOVE_THROWAWAY · UPHELD

Delete the paragraph and the parenthetical in the starter comment. Nothing in S01 shows or asks for annotations, and the preceding paragraph already says a one-line print is a complete script ('Con eso basta: un archivo `.py` con esa instrucción ya es un script.'). No test pins either string.

*Locations (2):* `setup.S01-T1-A.p4`, `setup.youDo.starter`

### 2. S01 · `function` · REMOVE_THROWAWAY · UPHELD

Delete the code listing and its output from S01 theory[1] and keep the four paragraphs, which already state pacing, closure criterion and limits in words. The listing also needs a dict and subscripting (S06). The learner never runs or edits it. No S01 test counts code blocks: test_s01_text_first_prose pins headings >= 15, and the heading stays.

*Locations (1):* `setup.theory[1].code`

### 3. S01 -> S10 · `function` · MOVE_USE_LATER · UPHELD

D6 Q1: not necessary. S01 teaches REPL vs script and exit codes, and its own theory says a script needs neither main() nor the guard. D6 Q2: it cannot be taught properly in S01, because it needs def (S05), if (S03) and import/`__name__` (S10). Treatment: flatten every S01 script to top-level statements: hello_sys.py (S01-T1-A-E2), the commented hello_lint.py in S01-T4-A-DEMO, S01-T4-A-E2's starter and solution (F401 still fires on the unused imports), and scripts/hello_env.py in the youDo starter. Then delete the S01 callout sentence about main()/`__name__`, which becomes throwaway. Costs the applier must carry: (a) tests/adversarial/test_s01_independent_recovery.py::test_ruff_solution_has_module_level_spacing_for_e_rules pins 'def main():' and the guard spacing; (b) ::test_playground_executes_the_section_one_entrypoint_contract pins the guard in the SectionView.tsx 'setup' playground, which must be flattened too; (c) scripts/newbie_agentic_validator.py exercise_form_issues raises missing_main_for_hello_sys / missing_dunder_name for hello_sys, and its tests are in tests/adversarial/test_agentic_hardened_gates.py. After this, S02's youDo requirement 'Incluye una función `main()` y el guard `if __name__ == "__main__"`' is where the pattern appears, which is Q3's call. Fallback if the owner keeps the template (IDENTIFIER_KEEP): S01-T1-A theory presents the lines as a fixed template and says in plain words what they do (the indented lines are the script's steps grouped under the name main; the last two lines run them when the file is launched with python), points to S05 and S10, deletes the contradicting callout sentence, and stops asking learners to rebuild the guard from blanks.

*Locations (5):* `setup.S01-T4-A-DEMO.code`, `setup.S01-T1-A-E2.hint`, `setup.S01-T1-A-E2.starter`, `setup.S01-T4-A-E2.starter`, `setup.youDo.starter`

### 4. S01 -> S10 · `function` · MOVE_USE_LATER · AMENDED

The exercise contradicts the section's explicit deferral: the learner must write a def body, an if condition, len, slicing and indexing. Move the check_arg.py contract (argument count, usage message on stderr, exit 0/1) to S10 (modules-packaging-cli), which teaches stdout vs stderr and argv/argparse. Keep id S01-T1-B-E2 with an independent S01-level exercise that reads the exit codes of prepared commands, as S01-T1-B's paragraphs describe (a success, a missing file, a nonexistent command, `python -c "import sys; sys.exit(n)"`). Update S01-T1-B-E1's feedback ('Siguiente: un script que elija 0 o 1 según argumentos.') and retrospective ('A continuación harás que el propio script decida entre 0 y 1.'). tests/adversarial/code-highlighting.test.ts uses its own inline check_arg fixture and is unaffected.

> Verifier pass 1: Add one cost: scripts/code_rendering.spec.ts:189 selects the S01 visual anchor with `section === 'setup' && title.toLowerCase().includes('check_arg.py')`. Moving the block to S10 does not fail an assertion (the anchor only gates a screenshot under CAPTURE_SCREENSHOTS), but the e2e visual manifest silently loses its reported-block anchor, so the spec should be repointed in the same change.

*Locations (1):* `setup.S01-T1-B-E2.starter`

### 5. S01 · `function` · ALIAS_FALSE_MATCH · UPHELD

No content change. This is ordinary Spanish, not a technical homonym, so OPEN_QUESTIONS' entry should be refined; 'disambiguate by section range' would not fix it. The learner-facing hover is already unaffected, because termsAvailableAt hides `function` (firstSectionId basics) in S01. It is the only 'cumple(n) ... funciones' in active sections. Either accept it, or add an extractor context exclusion for 'cumpl\w+ (una |la |las )?funci'.

*Locations (1):* `setup.S01-T4-B-DEMO.retrospective`

### 6. S01 · `github` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses two forms: a definite-article appositive (', el sitio web que…'), which APPOSITIVE rejects because it only allows un/una/unos/unas; and a bare subject with a describing verb ('GitHub aloja…'), where there is no indefinite article and 'aloja' is not in DESCRIBING_VERB. theory[0].p3 and theory[8].p0 both come after outcome[5], and each describes GitHub again (a server; it hosts a remote copy). No content change. Drop the false credit at setup.theory[8].p4, which defines 'GitHub CLI'.

> Verifier pass 2: All three evidence strings are verbatim in src/lib/course/sections/s01-setup.ts. Course order checks out: outcome[5] is display_order 7, theory[0].p3 is 13, theory[8].p0 is 66, so the claimed teaching precedes every use in the group. outcome[5] does teach ('el sitio web que aloja y permite compartir el repositorio' = what it is + what it does). Both instrument claims reproduce: APPOSITIVE (line 99 of scripts/course_event_extractor.mts) accepts only un|una|unos|unas, so ', el sitio web que...' is rejected; 'aloja' is absent from DESCRIBING_VERB (line 103), and there is no indefinite article before 'GitHub' in theory[8].p0, so INDEFINITE_BEFORE+DESCRIBING_VERB cannot fire either. The three false-positive credits also reproduce: at theory[8].p4 POST_CUE reaches 'es una' 25 characters past 'GitHub' (inside 'GitHub CLI (el comando `gh`) es una herramienta aparte'); at S01-T2-A.p1 PAREN_GLOSS 

*Locations (3):* `setup.outcome[5]`, `setup.theory[0].p3`, `setup.theory[8].p0`

### 7. S01 · `gitignore` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses a short prose parenthetical whose only function words are 'qué', 'no' and 'a', none of which are in GLOSS_FUNCTION_WORD. The three later uses only need to know what the file is for. S01-T2-A.p1, the first mention in theory, also carries its own purpose clause after the dash, so the meaning survives even if the outcomes sheet stays closed. No content change required.

> Verifier pass 2: All four evidence strings verbatim. Order: outcome[6] is display_order 8; S01-T2-A.p1 is 87, S01-T3-B.p1 is 146, S01-T3-B.callout is 152 — the gloss precedes all three uses. The instrument claim is exact: PAREN_GLOSS does capture '(qué no subir a Git)', but looksLikeProse rejects it because GLOSS_FUNCTION_WORD (line 73) lists 'que' unaccented and contains neither 'a' nor 'no', so none of {qué, no, subir, a, Git} matches; POST_CUE and APPOSITIVE cannot fire (no copula, no comma). S01-T2-A.p1 does carry its own purpose clause after the dash, so the meaning survives a closed outcomes sheet.

*Locations (4):* `setup.outcome[6]`, `setup.S01-T2-A.p1`, `setup.S01-T3-B.p1`, `setup.S01-T3-B.callout`

### 8. S01 · `gitignore` · MOVE_USE_LATER · AMENDED

**Verifier corrected to:** TEACH_EARLIER_IN_PLACE (D6 question 2): keep the ignore step before the first commit, and make it self-contained where it sits

This instruction asks the learner to edit a file that is only created two subtopics later (S01-T4-B), and before `git init` (S01-T3-A). No T2-A or T3 exercise depends on it: T3-A and T3-B commit README.md by name, so .venv cannot be committed by accident. In T2-A keep the rule this protects (never commit `.venv`/`venv`/`.env`) and replace the imperative with a pointer to S01-T4-B, which already does the step with a worked example and a check. Trade-off, stated: a learner who runs `git add .` on their own between T3 and T4-B could commit .venv. S01-T3-B.callout already names that as error (1).

> Verifier pass 1: In S01-T2-A.callout, or right after `git init -b main` in theory[15], tell the learner to create `.gitignore` in the project root with `.venv/`, `venv/` and `.env`. Say in one clause what the file does: Git stops proposing those untracked files. Point to S01-T4-B for patterns, `git check-ignore -v` and `git rm --cached`. Do not replace the imperative with a pointer to T4-B: theory[20]–[21] and S01-T3-B push to GitHub before T4-B, and S01-T3-B-E2's model PR assumes the file already exists.

> Verifier pass 2: Every claim checks out. The callout ('Añade `.venv/`, `venv/` y `.env` a `.gitignore`.') is display_order 90; the file is first created at S01-T4-B.code, display_order 168, and `git init` is in S01-T3-A at 132 — so the instruction precedes both the file and the repo. The dependency check is clean: `git add` appears 15 times in s01-setup.ts and never as `git add .`; T3-A/T3-B stage `README.md` by name (lines 497, 500, 784, 787, 1683) and T4-B's own demo stages `.gitignore .env.example README.md` by name (line 871), so `.venv` cannot be committed by following the course. No file under tests/ mentions S01-T4-B or S01-T2-A, and no test or script contains the callout's wording. The stated trade-off is real and S01-T3-B.callout does name it as error (1): 'subir `.venv/`/`venv/` a GitHub'.

*Locations (1):* `setup.S01-T2-A.callout`

### 9. S01 · `gitignore` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses a definition with a bare bold/code subject and a verb, no indefinite article, and a verb ('excluye') that is not in DESCRIBING_VERB. Everything after p0 is the worked example, demo, guided exercises, youDo and self-check of that same subtopic. No content change.

> Verifier pass 2: Both evidence strings verbatim (p0 and the DEMO.why cited alongside it). S01-T4-B.p0 is display_order 165 and every one of the twelve locations in the group is at 165 or later (168, 207, 208, 422, 428, 434, 439, 453, 458, 471, 478), so the teaching is at or before every use it covers. p0 teaches what the file does ('excluye artefactos regenerables y datos locales') and is followed by the code, demo, E1/E2, youDo and self-check of the same subtopic, which is D3 depth. The instrument claim reproduces: 'excluye' is not in DESCRIBING_VERB, there is no indefinite article before the bolded code term, and no paren/dash/copula/appositive cue follows. The one S01 credit the detector did give (youDo.objective[0], display_order 453) is indeed a false positive: PAREN_GLOSS takes '(`.venv/` y `venv/`)' and looksLikeProse passes it on the lone ' y '.

*Locations (12):* `setup.S01-T4-B.p0`, `setup.S01-T4-B.code`, `setup.S01-T4-B-DEMO.description`, `setup.S01-T4-B-DEMO.code`, `setup.S01-T4-B-E1.title`, `setup.S01-T4-B-E1.starter`, `setup.S01-T4-B-E2.instruction`, `setup.S01-T4-B-E2.tests`, `setup.youDo.objective[0]`, `setup.youDo.requirement[1]`, `setup.youDo.starter`, `setup.selfCheck[1].q`

### 10. S01 · `if` · REMOVE_THROWAWAY · UPHELD

Remove the 'se encadena con if' aside. The plain meaning to keep: this block is bash, and PowerShell 5.1 has no `||`; the paragraph already says what to do instead. The learner never writes a PowerShell conditional.

*Locations (1):* `setup.S01-T1-B.code`

### 11. S01 -> S10 · `if` · MOVE_USE_LATER · UPHELD

Same decision, costs and fallback as `function`'s S01 entrypoint group. Flatten hello_sys.py, hello_lint.py (S01-T4-A-DEMO comment and S01-T4-A-E2) and hello_env.py. Remove the guard from S01-T1-A-E2's preamble 'Éxito', instruction step 2, hints[1] and edgeCases[1]. Reduce youDo requirement[7] to exit 0 only. The pinned tests (test_s01_independent_recovery ruff-spacing and SectionView playground tests) and the newbie_agentic_validator hello_sys gate move with it.

*Locations (8):* `setup.S01-T4-A-DEMO.code`, `setup.S01-T1-A-E2.preamble`, `setup.S01-T1-A-E2.instruction`, `setup.S01-T1-A-E2.hint[1]`, `setup.S01-T1-A-E2.starter`, `setup.S01-T4-A-E2.starter`, `setup.youDo.requirement[7]`, `setup.youDo.starter`

### 12. S01 -> S10 · `if` · MOVE_USE_LATER · UPHELD

Same group as `function`'s check_arg treatment. Move the argument-count contract to S10, and replace S01-T1-B-E2 (keeping its id) with an exercise that reads exit codes of prepared commands.

*Locations (1):* `setup.S01-T1-B-E2.starter`

### 13. S01 · `interprete` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses an em-dash gloss that follows a modifier ('Python'): DASH_GLOSS requires the dash within 4 punctuation/space characters of the term. No content change.

> Verifier pass 2: Tagline quoted verbatim. The mechanism is exactly as described: DASH_GLOSS (line 62) allows only [`*_"'\s]{0,4} before the em dash, so the modifier 'Python' blocks it, while PAREN_GLOSS (line 57) allows up to 18 letter/space characters, which is why outcome[0]'s 'intérprete Python correcto (el programa que ejecuta tu código)' is credited and the tagline is not. I also checked the remaining paths: INDEFINITE_BEFORE does match ('un intérprete'), but DESCRIBING_VERB requires the verb within 12 characters and 'convierte' sits far past that, so the event legitimately scores mentions-without-defines (display_order 0, defines=[]). No content change is available for the tagline text itself, since the gloss is already in it.

*Locations (1):* `setup.tagline`

### 14. S01 · `interprete` · GLOSS_AT_FIRST_USE · UPHELD

In instrument order the tagline glosses the term first, but on the section page the tagline's gloss is clamped away, and this popover is read on its own, with no hover. It already glosses its other three terms (entorno virtual, terminal, shell) but not intérprete. Add a one-clause in-place gloss with the same meaning as the tagline and outcome[0]: the program that reads and runs your code. No subsection.

> Verifier pass 2: Both quotes are verbatim, including the two JSX lines: SectionView.tsx line 208 is `<p className="text-sm text-foreground/80">{section.jobRelevance}</p>` inside a Popover, and line 243 is `<p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">`. The no-hover claim is confirmed at the source: jobRelevance is rendered as a bare string with no renderer at all, and the tagline goes through InlineText, which RichText.tsx documents as the inline pass 'without block parsing or glossary hints' — only RichText calls termsAvailableAt/annotateGlossaryTermsPlain, and it is passed sectionId everywhere. jobRelevance does gloss entorno virtual, terminal and shell in place and leaves 'un intérprete Python' bare. GLOSS is the right treatment rather than TEACH: intérprete already has its D3 subtopic in S01-T1-A ('El intérprete Python y el REPL'), so a subsection here would be duplication, and D

*Locations (1):* `setup.jobRelevance`

### 15. S01 · `pip` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses a definite-article appositive (', el instalador de…,') and a bare subject with a verb ('**pip** instala'). The other five uses come after theory[0].p1. No content change. When acting on these locations, use display_order 38/39/41/48/52, because the same location strings also name paragraphs 29/30/34/55/45/60 that never mention pip.

> Verifier pass 2: All quoted fragments verbatim. Order confirmed from the event stream: theory[0].p1 is display_order 11 and theory[0].p2 is 12, ahead of the five later uses at 38, 39, 41, 48, 52. Both misses reproduce: ', el instalador de paquetes de Python,' fails APPOSITIVE's un|una|unos|unas requirement, and '**pip** instala paquetes' has no article before the term and 'instala' is not in DESCRIBING_VERB. The credited first definition is a false positive as claimed — the event at display_order 53 (S01-T1-B.p2, second block with that subtopicId) is the shell-connectors paragraph, where POST_CUE finds 'significa' 14 characters after 'pip' in '`python -m pip list | head` significa «lista los paquetes…»', whose subject is the pipeline. The location-collision warning is precise: the extractor names theory blocks `b.subtopicId ?? theory[i]` (line 200), S01 reuses S01-T1-A twice and S01-T1-B three times, and

*Locations (7):* `setup.theory[0].p1`, `setup.theory[0].p2`, `setup.S01-T1-A.p0`, `setup.S01-T1-A.p1`, `setup.S01-T1-A.code`, `setup.S01-T1-B.p4`, `setup.S01-T1-B.p1`

### 16. S01 · `repositorio-repo` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses an appositive that follows the modifier 'Git'. theory[0].p1 comes after the outcome gloss, and the theory defines the term two paragraphs later, so a learner who skips the outcomes sheet is left without a gloss for only two paragraphs, with 'descargar una copia completa' supplying meaning in between. No content change.

> Verifier pass 2: All three quotes verbatim. outcome[5] is display_order 7 and theory[0].p1 is 11, so the gloss precedes the flagged use; theory[0].p3 at 13 is credited (defines includes repositorio-repo), so the gap is two paragraphs as stated. The instrument claim holds and I checked the alternatives: APPOSITIVE's prefix class excludes spaces and letters, so the modifier in 'repositorio Git, una carpeta…' blocks it; INDEFINITE_BEFORE does match 'un repositorio', but DESCRIBING_VERB finds no verb within its 12-character window (' Git, una ca'). The homonym evidence is real — 'Repository light (un patrón que aísla el acceso al almacén', 'repo en memoria (un repositorio que guarda los objetos en un diccionario)', 'El **repository** (*repositorio*) encapsula SQL' and 'repo SQL' are all verbatim, 'repo SQL' is at async-concurrency.S27-T1-A.p2 exactly as claimed, S40-T2-B does carry standalone repositorio-rep

*Locations (2):* `setup.outcome[5]`, `setup.theory[0].p1`

### 17. S01 · `return` · REMOVE_THROWAWAY · UPHELD

Delete the listing, as in `function`'s REMOVE group; the paragraphs already carry its content and no S01 test counts code blocks.

*Locations (1):* `setup.theory[1].code`

### 18. S01-S03 · `return` · ALIAS_FALSE_MATCH · UPHELD

No content change. The sentences are correct Spanish and need no knowledge of the return statement, and the calling-side fact is taught where it is used (S02-T4-A.p1 on input()). The fix is the glossary: remove the bare alias 'devuelve' (see glossary).

*Locations (16):* `setup.S01-T1-A.p1`, `setup.S01-T1-A.p2`, `basics.S02-T4-A.p0`, `basics.S02-T4-A.p1`, `basics.S02-T4-A-DEMO.preamble`, `basics.S02-T4-A-DEMO.why`, `basics.S02-T3-A-E1.preamble`, `basics.S02-T3-A-E1.starter`, `basics.selfCheck[7].q`, `basics.selfCheck[7].explanation`, `basics.selfCheck[9].explanation`, `decisions-rules.S03-T1-B.p3` …

### 19. S01 · `return` · HOMONYM · UPHELD

No content change: the paragraph glosses código de salida itself. The glossary cannot separate the two senses; removing the 'devuelve' alias removes the match.

*Locations (1):* `setup.S01-T1-B.p0`

### 20. S01 · `set` · ALIAS_FALSE_MATCH · UPHELD

Nothing to do for the concept map. Optional writing fix (code-switching): swap the loanword for the Spanish noun the exercise already uses ('selección acotada'). That also removes the false match. The real fix belongs in the alias (see glossary).

> Verifier pass 2: Both quotes verified verbatim: s01-setup.ts:2153 `# Éxito: set acotado + plan de ampliación` inside the markdown starter ruff_select_minimo.md, and :2142-2143 tests 'Propone una selección acotada; argumenta señal frente a ruido; plan de ampliación; tono profesional.'; the solution is `select = ["E", "F", "I"]` (:2174). events.json has exactly one `set` mention in the whole of S01 and it is this starter, so 'S01 never uses or teaches the Python type' holds. The sense really differs: the file is a Ruff `select` proposal, so 'set acotado' is the loanword for a bounded group of rule codes. The alias regex in scripts/course_event_extractor.mts is built with flags 'giu', so 'Set' does match lowercase 'set' as claimed. Glossary snapshot matches terms.ts:454-461 (aliases ["Set"], firstSectionId 'setup'), and the first real gloss is S03-T1-A.p2 (display_order 1046) against this use at 418.

*Locations (1):* `setup.S01-T4-A-E3.starter`

### 21. S02 · `abc` · ALIAS_FALSE_MATCH · AMENDED

**Verifier corrected to:** ALIAS_FALSE_MATCH

Not the concept. No prose change for it. The fix is to match the acronym alias case-sensitively in all three matchers, then set firstSectionId to oop-domain, in that order; otherwise glossary_intro_audit fails again on S02's 'abc'. What the learner sees today: S02-T4-B-E3.hint[1] is RichText with 'abc' outside backticks, and ABC is available to the hover from 'basics', so Pista 2 shows a beginner an 'Abstract Base Class' tooltip. Backticking the code in that hint is correct formatting anyway, and it removes the tooltip. The other S02 surfaces are code, backticked text, InlineText (self-check) or plain text (tests), so they show no tooltip. Q3: these locations are in S02's practice layer, but the fix is on the glossary side and does not depend on the route. If route 2 moves the parser project, the 'abc' strings move with it and are still false matches.

> Verifier pass 1: Not the concept, and no prose change. The fix, which does not depend on the route, is to match the 'ABC' alias case-sensitively in the extractor, the RichText hover and glossary_intro_audit, then set firstSectionId to oop-domain. 15 of the 23 locations are S02 practice layer (iDo/weDo/youDo) and would move under Q3 route 2. The other 8 (theory S02-T1-B.p3/p4/code, S02-T4-B.p5/code, and selfCheck[8] q/opt[1]/explanation) stay in S02 whatever the route, so the matcher fix is still required. Backtick the code in S02-T4-B-E3.hint[1]; this removes the only S02 tooltip.

> Verifier pass 2: 'Q3: these locations are in S02's practice layer' is wrong for 8 of the 23. Five are theory (basics.S02-T1-B.p3, .p4, .code, basics.S02-T4-B.p5, .code) and three are the self-check (selfCheck[8].q, .opt[1], .explanation); none of those is iDo/weDo/youDo. Only the 15 iDo/weDo/youDo locations sit in the practice layer. The conclusion the sentence supports is unaffected — the fix is on the glossary side and does not depend on the Q3 route — but the group must not be read as hiding any of these locations behind Q3.

*Locations (23):* `basics.S02-T1-B.p3`, `basics.S02-T1-B.p4`, `basics.S02-T1-B.code`, `basics.S02-T4-B.p5`, `basics.S02-T4-B.code`, `basics.S02-T1-B-DEMO.preamble`, `basics.S02-T1-B-DEMO.code`, `basics.S02-T4-B-DEMO.preamble`, `basics.S02-T4-B-DEMO.code`, `basics.S02-T1-B-E2.preamble`, `basics.S02-T1-B-E2.starter`, `basics.S02-T1-B-E2.retrospective` …

### 22. S02 · `exception` · REPLACE_PLAIN_WORDS · UPHELD

D6 question 1: throwaway. The learner does nothing with the word here, and the deferral repeats p1. Keep the meaning 'recovering from invalid input is taught in S09' and drop the term: either use p1's plain wording or delete the second sentence, since p1 already says it. Do not gloss it, because that would teach a word S02's prose never uses again.

> Verifier pass 2: theory[1].p3 verified verbatim at s02-basics.ts:61 and the plain-words deferral it duplicates at :60 ('La recuperación de errores se estudia en S09.', p1 of the same optional block). Dependency sweep is clean: tests/ and scripts/ contain no reference to this sentence (only quarantined generator scripts mention 'excepci'), no S02 output, selfCheck or exercise uses the word (grep of s02-basics.ts finds 'excepci' only here and in the E1 retrospective, which is group 1), and exceptions are not S02's subject. D6 question 1 (throwaway) is correctly applied, and the refusal to gloss is right because S02 prose never uses the word again.

*Locations (1):* `basics.theory[1].p3`

### 23. S02 · `exception` · Q3_ROUTE_PENDING · UPHELD

The route is pending because 'dónde deberías capturarla' exists only to set up the try/except the learner writes in S02-T1-B-E2. The word itself has a fix that works under any route: ask which error Python shows (`ValueError`) and on which line execution stops. S02-T1-B theory teaches both. The 'capturarla' clause must follow the Q3 decision. If S02's practice becomes concept-clean, drop it. If try/except stays in S02, keep it with a gloss in S03's style and the deferral to S09.

> Verifier pass 2: Retrospective verified verbatim at s02-basics.ts:1029, E2's instruction ('`try int`; `ValueError` → mensaje') at :1057 and its hint ('try/except ValueError para letras.') at :1058; the E2 starter leaves `pass` with the three-branch comment and the solution writes try/except, so the learner does write it. The S02-T1-B theory quotes are verbatim at :187-188 and come first (display_order 578 vs 724), so the proposed route-independent fix is supported by teaching already present. The location is a weDo retrospective in S02, inside Q3's scope. One constraint the diagnosis does not name: tests/adversarial/test_s02_text_first_quality.py requires every S02 weDo retrospective to be >=40 words and to match a reasoning-cue regex; this one is 52 words and keeps 'Predice', so the rewrite has about 12 words of slack.

*Locations (1):* `basics.S02-T1-B-E1.retrospective`

### 24. S02 · `for` · Q3_ROUTE_PENDING · UPHELD

Q3 applies: its original text lists `if`/`for` among S02's practice-layer dependencies. A local fix exists that works under any route, because T1-A (literals and types) stays in S02 under every route not already rejected. The loop is incidental to the point being taught, which is reading `repr` and `type(x).__name__`. The demo, E1 and E3 can print one explicit line per value, with no `def`, no loop, no dict of tuples and no unpacking, and produce the same output lines (test_s02_independent_contract runs every code/output pair). The instruction and hints that say 'el `for`' or 'el bucle' must then point at those print lines. Do not gloss `for` in S02: that would contradict the section's own scope callout.

> Verifier pass 2: Every quote verified in s02-basics.ts: the scope callout 'Todavía no usaremos condicionales ni bucles.' (:51), E1 instruction '2. En el `for`, completa los dos huecos del `print`.', E1 starter '# Completa el cuerpo del bucle…' above 'for lit in literales:', the demo wrapping six fields in `def s02_ido_1():` with 'for label, valor in campos:' (:502-519), E3 starter 'for k, (v, t) in campos.items():' (:998) and hint[1]. All eight locations are iDo/weDo surfaces in S02, so Q3 covers them. The route-independent fix is sound: T1-A teaches `repr`/`type(x).__name__`, and explicit prints reproduce the pinned output line for line. Caveat recorded in `missed`: the section's own contract code prints `if_for_as_support_syntax True`, so the callout the group leans on is already contradicted inside S02, and that pair would have to change with the loops.

*Locations (8):* `basics.S02-T1-A-DEMO.code`, `basics.S02-T1-A-E1.instruction`, `basics.S02-T1-A-E1.hint`, `basics.S02-T1-A-E1.hint[0]`, `basics.S02-T1-A-E1.starter`, `basics.S02-T1-A-E3.instruction`, `basics.S02-T1-A-E3.hint[1]`, `basics.S02-T1-A-E3.starter`

### 25. S02 · `for` · Q3_ROUTE_PENDING · UPHELD

These are test-harness loops the learner runs but does not write, and they wrap Q3 constructs (`def`, try/except, dict). The loop part works under any route: replace it with one explicit call and print per test value, with the same output. Removing the loop does not fix the surrounding `def`, try/except and dict, which are the route decision. Coordinate with the function (C1) and dict treatments so each exercise is rewritten only once.

> Verifier pass 2: All four instruction quotes verified verbatim in s02-basics.ts ('2. Deja el `for` de prueba tal cual.', '3. Ejecuta el `for` de impresión del mapeo.', '3. Ejecuta el `for` de cuatro strings y compara salidas.'), and each starter does contain the harness loop already written (T1-B-E2 'for v in [" 21 ", "", "abc", "  "]:', T2-A-E3 'for orig in encabezados:' over the `mapeo` dict, T3-B-E3 'for s in ["150.50", …]:'). The learner completes `safe_int`, `mapeo` or `parse_monto`, never the loop, so 'runs but does not write' is accurate. All seven locations are S02 iDo/weDo, inside Q3. The honesty about the residual `def`/try-except/dict dependency is correct: removing the loop does not remove the route decision.

*Locations (7):* `basics.S02-T1-B-DEMO.code`, `basics.S02-T1-B-E2.instruction`, `basics.S02-T1-B-E2.starter`, `basics.S02-T2-A-E3.instruction`, `basics.S02-T2-A-E3.starter`, `basics.S02-T3-B-E3.instruction`, `basics.S02-T3-B-E3.starter`

### 26. S02 · `for` · Q3_ROUTE_PENDING · UPHELD

The surprise is bigger than `for`. It is a generator expression passed to `any()`, running over a list of messages stored in a dict. S04's comprehension theory does not cover that either, since it teaches list comprehensions only. It is not a homonym: the iteration meaning is the same, inside a different construct. The learner does not write these lines. Two fixes for the generator expression work under any route, each with a trade-off. (a) Assert the exact error list, which the demo already prints (`[\"ERROR en 'edad': no se pudo convertir 'abc' a int\"]`): fine for the fixed demo, but brittle where the learner writes the messages. (b) Check the first message only (`\"edad\" in r3[\"errors\"][0]`): tolerant of wording, but assumes a single error. The lists, dicts and `def` stay with the route decision. A glossary entry for generator expressions is worth adding, because the construct recurs across the course.

> Verifier pass 2: The classification is right and checkable: none of these five locations contains a `for` statement, only generator expressions inside `any()`. Verified verbatim — demo assert and its printed `["ERROR en 'edad': no se pudo convertir 'abc' a int"]` (s02-basics.ts:820,829), E1 starter assert (:2018), youDo `_run_tests` assert (:2309) and 'Los asserts de _run_tests no se modifican' (:2234). The learner does not write any of them (the youDo asserts are frozen by contract). Fix option (a) is supported by the demo's own printed output; option (b) is correctly labelled as assuming a single error. The point that S04 teaches list comprehensions only, so its theory does not cover this construct either, matches theory[7]/S04-T3-B, which speak only of `[` and `]`.

*Locations (5):* `basics.S02-T4-B-DEMO.code`, `basics.S02-T4-B-E1.starter`, `basics.S02-T4-B-E3.hint[1]`, `basics.S02-T4-B-E3.starter`, `basics.youDo.starter`

### 27. S02, S03 · `for` · ALIAS_FALSE_MATCH · REFUTED

**Verifier corrected to:** ALIAS_FALSE_MATCH

Resource titles are proper names, so nothing to change. The tests string is English in a Spanish course. Fixing it is optional code-switching work, not a concept fix. The real fix is in the alias (see glossary).

> Verifier pass 1: Evidence, quoted exactly: S02 resources label 'Python for Everybody — types chapter'. S03 resources label 'Python for Everybody — conditionals', with note 'if/else progressive disclosure' in a separate field. S03-T4-B-E2 tests field 'N cases for N branches (mín. 3)'. Resource titles are proper names: no change. The S03-T4-B-E2 tests string is rewritten anyway when for-group 6 rewrites that exercise, so fix its English wording in the same edit. The real fix is the alias restriction. Note the title occurs in S02–S10, S13–S16, S18 and S20, not only S02–S07.

> Verifier pass 2: Senses confirmed to differ. 'Python for Everybody — types chapter' (s02-basics.ts:2561 label + :2563 note) and 'Python for Everybody — conditionals' + 'if/else progressive disclosure' (s03:2468/2470) are proper names in English; the extractor concatenates label and note, which is why the dossier event text reads as the diagnosis quotes it. 'N cases for N branches (mín. 3)' is verbatim at s03:2090 and is English prose, not the statement. The alias regex is case-insensitive with only non-word boundaries, so all three are genuine false matches, and the group correctly asks for no concept change.

*Locations (3):* `basics.resources.doc[5]`, `decisions-rules.resources.doc[4]`, `decisions-rules.S03-T4-B-E2.tests`

### 28. S02 · `function` · REPLACE_PLAIN_WORDS · UPHELD

D1: an outcome must not lean on an unexplained term, and here the noun adds nothing. The outcome must keep the plain meaning: input() reads what a person types and hands it over as text. If the owner wants to keep the noun, gloss the calling side S02 actually uses: an operation with a name, run by writing the name with parentheses, that can hand a value back. The callout's defining-side gloss does not cover this, and the same calling-side sense should be what the callout says, since every S02 use is input()/print()/type().

*Locations (1):* `basics.outcome[6]`

### 29. S02 · `function` · REPLACE_PLAIN_WORDS · UPHELD

Keep the scope promise and drop the four labels: S02 does not yet choose between paths, repeat steps, write its own reusable blocks or recover from errors (theory[1].p4's phrasing is the model). This follows the precedent of S01's removed throwaway reassurance. The promise is currently false for S02's practice layer (safe_int in iDo T1-B/T4-B, the six `def s02_ido_N():` wrappers, T2-A-DEMO's if/else), and rewording does not fix that. The `if` MOVE groups and Q3 do. Route-independent: unwrap the six wrappers, which take no parameter, return nothing and are called once; outputs stay identical.

*Locations (1):* `basics.theory[0].p5`

### 30. S02 · `if` · REPLACE_PLAIN_WORDS · UPHELD

Keep the promise in plain words: S02 does not yet choose between paths or repeat steps, which is theory[1].p4's phrasing. The promise must also become true: see the T2-A-DEMO and T2-B figure groups, the hidden S02-T2-A-E2 'Corregir `=` por `==` en tres `if`' (same MOVE as T2-A-DEMO), and Q3 for safe_int. The replacement contract listing (see `return`) must not carry the if_for_as_support_syntax flag.

*Locations (2):* `basics.theory[0].p5`, `basics.theory[0].callout`

### 31. S02 -> S03 (S03-T1-B) · `if` · MOVE_USE_LATER · AMENDED

Move the figure to S03-T1-B, which has no figure and teaches exactly this. figure-data-schema.test.mjs requires the id prefix to match the section that renders it, so rename S02-truthiness to an S03- id in misc.ts and in the section file. S02-T2-B then needs a figure for what it does teach: `b = a` as an alias vs `a.copy()`, and `is` vs `==`. Its own paragraph already asks the learner to draw this ('dibuja tres flechas desde los nombres hacia los objetos'). D5 counts are floors, so check S02's figure count does not fall below its floor.

> Verifier pass 1: The constraint is not D5. D5 is a per-concept target of 5–10 visuals with a Mayer-coherence caveat, not a per-section count, and no test asserts figures per section. The real floor is the LEDGER round checklist, step 4 'figures — at least two figures carrying real teaching (D4)' (audit/fixer/LEDGER.md:11,81), and S02 currently has exactly two (S02-truthiness, S02-decimal-rounding). So the replacement figure for S02-T2-B (alias vs copy, `is` vs `==`) is mandatory in the same change, not a follow-up: without it S02 drops to one and fails its own ledger box.

*Locations (1):* `basics.S02-T2-B.figure`

### 32. S02 -> S03 (S03-T1-A) · `if` · MOVE_USE_LATER · UPHELD

The demo is about = vs == and naming, and a branch adds a concept S02 has promised not to use. Replace the if/else with the comparison's bool printed; the output changes and must be re-pinned. Turn the branch prediction into a True/False prediction. Rewrite the why, which is also the false 'definition' of `if`, and the retrospective. The `if x = 1` SyntaxError story, and S02-T2-A-E2 (hidden behind the false credit, same situation), belong in S03-T1-A, where comparisons feed `if`. S02-T2-A-E2 keeps its id with an S02-level `=`/`==` bug that involves no branch. Route-independent: unwrap `def s02_ido_3():` (no parameter, no return, called once).

*Locations (1):* `basics.S02-T2-A-DEMO.code`

### 33. S02 · `if` · Q3_ROUTE_PENDING · UPHELD

The `if` lives inside safe_int together with def, parameters, annotations, a tuple return and try/except, so it moves with the Q3 route. This location has no local, route-independent fix: removing only the `if` breaks the three-branch contract the demo exists to show.

*Locations (1):* `basics.S02-T1-B-DEMO.code`

### 34. S02 · `parameter` · Q3_ROUTE_PENDING · UPHELD

The function, its annotations and its dict result move with Q3. A local, route-independent wording fix exists but is cosmetic: call them the values passed to simular_intake in the call instead of 'parámetros'. It does not remove the dependency on def.

*Locations (3):* `basics.S02-T4-A-E3.hint`, `basics.S02-T4-A-E3.hint[0]`, `basics.S02-T4-A-E3.tests`

### 35. S02 · `pipeline` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

These three locations are the teaching block itself. Grammatical form missed: copula followed by a demonstrative determiner ('es esa secuencia'), with bold markers between article and term. No content change. Instrument fix: add demonstrative copulas (es esa/ese/este/esta, son esos/esas) to POST_CUE, guarded against the sameness predicate 'es ese mismo/es la misma'.

> Verifier pass 2: All three quotes are verbatim in src/lib/course/sections/s02-basics.ts (p0 line 98, p3 line 101, callout line 107), and the callout quote matches the extractor's `${title}. ${content}` join (course_event_extractor.mts:208). The instrument claim holds when read against the regexes: POST_CUE (line 40) lists only 'es un|es una|…|es el|es la|son los|son las|es aquel|es aquella' — no demonstrative copula — and INDEFINITE_BEFORE (line 88) does fire on 'Una **' while DESCRIBING_VERB (line 103) has no copula, so the definition is invisible. The credited S10-T3-A-E1.preamble is a genuine PAREN_GLOSS false positive: definesTerm tests PAREN_GLOSS before any NEGATED guard (lines 108-115), and '(no un dict improvisado)' passes PAREN_NOT_DEF and looksLikeProse. definitions_all's earlier S08-T4-A-E2.retrospective is credited exactly as claimed — 'si el pipeline falla, aún tien|es el input' matches POST

*Locations (3):* `S02 basics.theory[2].p0`, `S02 basics.theory[2].p3`, `S02 basics.theory[2].callout`

### 36. S02-S10 · `pipeline` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

No concept action. Every use is the taught sense (S07 even spells the steps with arrows). One writing fix for codex, independent of the map: S02 theory uses the feminine ('Una pipeline', 'la pipeline') while S02's own demos (S02-T1-A-DEMO.why 'el pipeline no puede comparar') and every later section use the masculine; pick one gender course-wide so a beginner does not read two words. The dominant usage is masculine.

> Verifier pass 2: Spot-checked quotes are verbatim: S07-T1-A.callout title/content (s07 lines 108-110), S08 youDo.requirement[4] (s08 line 1935), S09 tagline (s09 line 18). Every location follows basics.theory[2].p0 — section index dominates for S03-S10, and inside S02 all seven members are iDo/weDo events, which the extractor pushes after theory. Sampled uses (S05:143, S09:130, S09:183, S10:26) are all the taught sense, not sklearn/HF Pipeline. The gender finding is exact and I reproduced it: the feminine appears three times course-wide, all in S02 theory[2] (lines 98 'Una **pipeline**', 101 'la pipeline', 107 'Una pipeline'), against 176 masculine occurrences ('el/un/del pipeline'), including S02's own demo at line 537 'el pipeline no puede comparar'.

*Locations (51):* `S02 basics.S02-T1-A-DEMO.preamble`, `S02 basics.S02-T1-A-DEMO.why`, `S02 basics.S02-T1-B-DEMO.why`, `S02 basics.S02-T1-B-DEMO.retrospective`, `S02 basics.S02-T1-B-E2.retrospective`, `S02 basics.S02-T2-A-E3.retrospective`, `S02 basics.S02-T4-B-E2.preamble`, `S03 decisions-rules.S03-T1-B-DEMO.preamble`, `S04 iteration-summaries.S04-T1-B.p2`, `S04 iteration-summaries.S04-T1-B-DEMO.why`, `S04 iteration-summaries.S04-T1-B-E3.preamble`, `S05 functions-contracts.S05-T2-B-DEMO.why` …

### 37. S02-S09 · `pipeline` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Taught before all of these, so nothing to add; keep the identifiers, logger names and printed output (declared outputs are pinned, D8). S02-T1-B-E3 is inside the Q3 practice layer because it needs def and a returned dict, but that dependency is about functions and dicts, not pipeline: whichever Q3 route is chosen, the pipeline teaching at basics.theory[2] still precedes it, so there is no route-dependent fix for this concept.

> Verifier pass 2: Every quoted identifier is verbatim: S02-T1-B-E3.instruction (s02 line 1113), S07-T1-B-DEMO code print (s07 line 460, with the declared output at 466), the three S09 logger names (s09 lines 280, 340, 653), S08 youDo starter title 'Client/Transaction ETL Pipeline' (s08 line 1942), and S03-T4-A-E1's starter comment '# CASO-LIM-003 · pipeline edad' (s03 line 1846). Keeping them is correct under D8, which I confirmed in audit/fixer/decisions.md (line 208): declared outputs are compared line by line. The Q3 note is consistent — whichever route is chosen, basics.theory[2] still precedes S02-T1-B-E3.

*Locations (10):* `S02 basics.S02-T1-B-E3.title`, `S02 basics.S02-T1-B-E3.instruction`, `S02 basics.S02-T1-B-E3.starter`, `S03 decisions-rules.S03-T4-A-E1.starter`, `S07 text-unicode-regex.S07-T1-B-DEMO.code`, `S08 files-ingestion.youDo.starter`, `S09 exceptions-logging.S09-T3-A.code`, `S09 exceptions-logging.S09-T3-B.code`, `S09 exceptions-logging.S09-T3-A-DEMO.code`, `S09 exceptions-logging.youDo.starter`

### 38. S02 · `pyodide` · ALREADY_TAUGHT_INSTRUMENT_FN · AMENDED

**Verifier corrected to:** ALREADY_TAUGHT_INSTRUMENT_FN

The detector misses a definite-article appositive. The three later uses need nothing more about Pyodide. Outside this concept: each pairs it with 'CI', which S02 never explains (first glossed at S10-T3-A.p1 'el CI — *Continuous Integration*, el sistema que ejecuta pruebas automáticamente —'); route that to the S02 round or a CI glossary entry. S02-T4-A-E3 is in the Q3 practice layer, but the Pyodide use does not depend on the route decision.

> Verifier pass 1: The detector misses a definite-article appositive. Drop the CI routing note: CI is glossed in S01-T4-A.callout before S02. The only remaining CI point is that there is no glossary entry, so the gate cannot measure it.

> Verifier pass 2: All four quotes verbatim. basics.iDo.intro is display_order 643 and the three later uses are 676, 677 and 886, so the teaching precedes them; it says what Pyodide is and does, matching the glossary. The miss reproduces: after '**Pyodide**' the text is '**, la herramienta que…' and APPOSITIVE requires un|una|unos|unas after the comma, while POST_CUE needs a copula that is not there. The three later uses need nothing beyond that. The CI side-finding is correct and correctly routed out: there is no 'CI' entry in src/lib/glossary/terms.ts, S02 pairs Pyodide with CI exactly three times, and the first gloss 'el CI — *Continuous Integration*, el sistema que ejecuta pruebas automáticamente —' is verbatim in S10. S02-T4-A-E3 is indeed inside the S02–S04 weDo practice layer, and the Pyodide use there does not turn on the Q3 route.

*Locations (4):* `basics.iDo.intro`, `basics.S02-T4-A-DEMO.code`, `basics.S02-T4-A-DEMO.why`, `basics.S02-T4-A-E3.preamble`

### 39. S02, S03 · `return` · REPLACE_PLAIN_WORDS · UPHELD

This is the same throwaway metadata as S01, but code/output pins count both listings. Replace each with a listing that prints the same facts using only constructs the section has taught by then: names bound to literals and print (S03 may add comparisons). No def, return, dict or subscripting. Drop S02's if_for_as_support_syntax flag, which contradicts S02's callout. Equally valid: delete both, lower S02's floor to 40, and turn S03's exact 41 into a floor with a pass/fail proof, per the D6 precedent.

*Locations (2):* `basics.theory[1].code`, `decisions-rules.theory[1].code`

### 40. S02 · `return` · Q3_ROUTE_PENDING · UPHELD

Every location is one of the CP-N1-A functions (safe_int, make_record, parse_monto, simular_intake, parse_client), whose whole purpose is its return value; they move with the Q3 route. These locations have no local, route-independent fix. Route-independent work next to them: unwrap the six `def s02_ido_N():` iDo wrappers (T1-A, T2-A, T2-B, T3-A, T3-B, T4-A). Check first that the Pyodide playground does not rely on the wrappers to keep names apart between demos.

*Locations (11):* `basics.S02-T1-B-DEMO.code`, `basics.S02-T4-B-DEMO.code`, `basics.S02-T1-B-E2.tests`, `basics.S02-T1-B-E3.starter`, `basics.S02-T2-B-E3.starter`, `basics.S02-T3-B-E3.starter`, `basics.S02-T4-A-E3.preamble`, `basics.S02-T4-A-E3.instruction`, `basics.S02-T4-A-E3.starter`, `basics.youDo.requirement[0]`, `basics.youDo.starter`

### 41. S03 · `for` · REMOVE_THROWAWAY · AMENDED

**Verifier corrected to:** REMOVE_THROWAWAY

D6 question 1: the loop is scaffolding that prints several cases. Theory never asks the learner to reason about it, and no route keeps it. Replace each loop with one explicit line per case: a call plus print, or for T4-A and T4-B an `assert` plus print. Every output line must stay the same. test_all_embedded_reference_programs_match_their_output in test_s03_independent_contract runs the code/output blocks and requires exactly 41 of them, so rewrite in place and add or remove none. What must survive: each input shown next to its result, the 80 and 50 boundary values in T2-A, and in T4-A/T4-B the idea that each example or branch is one checked case. These blocks also use `def`, `return` and dicts (S05/S06), so apply this together with the C1 function-cluster decision on S03 theory code. If `def` goes, the harness goes with it.

> Verifier pass 1: Apply as written to the T1-B, T2-A, T2-B, T3-A and T3-B code blocks: one explicit call and print per case, identical output, block count stays at 41. For the T4-A and T4-B blocks, remove the loop only in the same change that rewrites S03-T4-A-E2 (the instruction 'compruébalos en un bucle' and the solution's `for ex in examples:`) and S03-T4-B-E2 (group 6) to explicit per-case checks. Otherwise the practice asks for a construct with no model. In T4-A, dropping the loop leaves regla["examples"] never executed, and the callout 'Ejemplos = especificación ejecutable' depends on executing it. Either check each example with explicit literals and remove the unused list, or state that trade-off. Coordinate with the C1 def/return decision for S03 theory code.

> Verifier pass 2: Same treatment and same rewrite, plus the trade-off that must be named: each of these seven theory blocks has a paired iDo demo teaching the same subtopic, and those demos are parked in group 5 as route-pending. Rewriting theory now leaves S03-T2-A theory calling `classify_score` on five explicit lines while S03-T2-A-DEMO still runs 'for s in [95, 60, 30, 80, 50]:' under a preamble that says 'Corre el bucle y fíjate en las fronteras' (and S03-T2-B-DEMO 'sigue cada caso del bucle hasta el dict de salida'). The programs are already variants rather than twins (T1-B and T2-B use different value lists), so this is a presentation inconsistency inside one subtopic, not a broken contract, and nothing in tests/ compares theory code with demo code. Either accept that gap explicitly for the duration of Q3, or hold this group with group 5 and do both at once.

*Locations (7):* `decisions-rules.S03-T1-B.code`, `decisions-rules.S03-T2-A.code`, `decisions-rules.S03-T2-B.code`, `decisions-rules.S03-T3-A.code`, `decisions-rules.S03-T3-B.code`, `decisions-rules.S03-T4-A.code`, `decisions-rules.S03-T4-B.code`

### 42. S03 · `for` · Q3_ROUTE_PENDING · UPHELD

Harness loops in S03's practice layer, one section before S04 teaches `for`. The learner runs them or edits the loop body or its values, but never has to write a loop. The fix that works under any route is the same as for S03 theory code: one explicit call per case, with the same output. Preambles and instructions that say 'el bucle' must then refer to the test lines. Trade-off: S03-T1-B-E1 becomes twelve explicit lines. Do not shorten its value list, because the pinned success criterion is 'nueve `False` y tres `True`'. The youDo `_run_tests` iterates `r.values()` of a dict and uses a generator expression, so it cannot be separated from the dict/def route decision.

> Verifier pass 2: All quoted evidence verified verbatim in s03-decisions-rules.ts: the two demo preambles (:536, :568), 'for t in lista: print(t, "→", t in TIPOS_DOC)', 'for v in vals:', 'for ex in examples:', '3. Cambia el bucle a 95, 60, 30…', the youDo 'for result in r.values():' and 'assert all(result["code"] == "OK" for result in r6.values())', and Q3's own sentence about 44 `def` uses in audit/fixer/OPEN_QUESTIONS.md. The pinned criterion 'nueve `False` y tres `True`' exists, so the warning not to shorten S03-T1-B-E1's list is real. All 29 locations are iDo/weDo/youDo in S03, which OPEN_QUESTIONS Q3 explicitly extends to ('whatever is decided for S02 applies to S03 and S04's slices of the same project'). For the 29 listed locations the loop is always pre-written in the starter, so 'never has to write a loop' holds there; it does not hold for S03's weDo as a whole (see `missed`: S03-T4-A-E2).

*Locations (29):* `decisions-rules.S03-T1-B-DEMO.code`, `decisions-rules.S03-T2-A-DEMO.code`, `decisions-rules.S03-T2-B-DEMO.code`, `decisions-rules.S03-T3-A-DEMO.code`, `decisions-rules.S03-T3-B-DEMO.code`, `decisions-rules.S03-T4-A-DEMO.code`, `decisions-rules.S03-T4-B-DEMO.code`, `decisions-rules.S03-T1-A-E2.hint`, `decisions-rules.S03-T1-A-E2.hint[0]`, `decisions-rules.S03-T1-A-E2.starter`, `decisions-rules.S03-T1-B-E1.hint`, `decisions-rules.S03-T1-B-E1.hint[0]` …

### 43. S03 · `for` · Q3_ROUTE_PENDING · UPHELD

D3 test: as written, a learner who does not understand `for` cannot solve S03-T4-B-E2. That makes `for` (and tuple unpacking, S06) load-bearing in S03, which would require a D3 subsection there duplicating S04-T1-A. S03 is the wrong place for it (D6 question 2). The fix that works under any route: the exercise's point is 'un caso de prueba por cada rama', and it survives intact as one explicit `assert classify_score(<valor>) == <esperado>` plus a `PASS` print per case (at least 90, 55, 10, 80 and 50). The output is identical, and it arguably shows 'one test per branch' more clearly. Rewrite the preamble, instruction, hint[1] and feedback ('Arma `cases = [(val, expected), ...]`') to match, and remove the `cases` list and loop from the solution. If the Q3 route moves this practice to S04 or later, the loop version is fine there.

> Verifier pass 2: Verified verbatim: preamble 'armar `cases` con `expected` y un bucle que use `assert` e imprima `PASS` sobre `classify_score`', instruction step 3, hint[1] 'for val, expected in cases: assert classify_score(val) == expected', the starter's bare 'for s in [90, 60, 10]:' with no expected value, the feedback 'Arma `cases = [(val, expected), ...]`' and a solution that loops over (value, expected) tuples. Both locations are weDo surfaces, inside Q3. One precision the diagnosis overstates: the exercise is unsolvable as directed, not unsolvable in principle — five explicit `assert`/`print` lines produce the identical pinned output and satisfy the tests field, which is exactly the fix proposed. The D3 conclusion is unaffected, because the preamble, the hint and the solution all require a loop with tuple unpacking one section before S04 teaches either.

*Locations (2):* `decisions-rules.S03-T4-B-E2.hint[1]`, `decisions-rules.S03-T4-B-E2.starter`

### 44. S03 · `outlier` · REPLACE_PLAIN_WORDS · UPHELD

D6 question 1: S03 never has the learner detect anything statistically. The only operation is the comparison `m > 50000`, so the term is unnecessary, while the meaning it stands for is necessary. The meaning that must survive at every location: a present, non-negative amount that passes the strict rule (m >= 0) but exceeds the documented, revisable review threshold, and so goes to review, not reject. The same wording applies in the tri-state list (T3-A.p3), the We Do previews (DEMO and E1 retrospectives), the E2 title, preamble and both hint copies, and the youDo starter comment. The comment is not printed and no assert or the 'tests OK' output depends on it. Keeping 'valor atípico' here would teach that 'atípico' means 'above a fixed number', which S16-T3-B explicitly contradicts. Adds no load: no gloss, no definition. Outside the instrument, for consistency: S03-T2-B-E2.edgeCases 'valor atípico > 10000 → review' (shown with the solution), and the copy of the E2 title in industry_alignment/curriculum_skill_graph.json:1526. Not Q3: the term is none of the Q3 constructs, and the fix is route-independent. If the CP-N1-A practice layer moves, the wording moves with it.

*Locations (8):* `decisions-rules.S03-T3-A.p3`, `decisions-rules.S03-T3-A-DEMO.retrospective`, `decisions-rules.S03-T3-A-E1.retrospective`, `decisions-rules.S03-T3-A-E2.title`, `decisions-rules.S03-T3-A-E2.preamble`, `decisions-rules.S03-T3-A-E2.hint`, `decisions-rules.S03-T3-A-E2.hint[0]`, `decisions-rules.youDo.starter`

### 45. S03 · `pyodide` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Taught in S02 and glossed again here. The detector misses a non-restrictive relative clause right after the term; the guard `/\bque\s+(?:es|son)\b/` in definesTerm discards it. Refinement: accept ', que es un/una/el/la …' when the comma directly follows the term. No content change.

> Verifier pass 2: Quote verbatim. S02's teaching at display_order 643 precedes this S03 use at 1117. The guard claim is exact: POST_CUE does fire on 'es el' seven characters into ', que es el intérprete de Python…', and definesTerm line 115 then discards it because head matches /\bque\s+(?:es|son)\b/. The detector consequently credits S07 (text-unicode-regex.iDo.intro, display_order 2881), which is what definitions_all shows. The proposed refinement — accept ', que es un/una/el/la …' when the comma directly follows the term — is narrower than the existing guard and would not re-open the restrictive-relative case the guard was written for.

*Locations (1):* `decisions-rules.iDo.intro`

### 46. S03 · `return` · TEACH_SUBSECTION_D3 · AMENDED

This is load-bearing, not a gloss case. S03-T2-B's subject is the early return, and S03-T2-B-E2 (refactor a nested pyramid into one if + return per precondition) cannot be solved without knowing that return hands a value back and ends the function. D6 Q2: it is teachable here, and S03 cannot drop functions without losing its guard-clause subtopic. Add a supporting theory block with no subtopicId before S03-T1-B, whose decide_monto is the first theory function. At D3 depth it needs: orientation (a rule packaged under a name so it applies to many values); a worked example with real values and no if (a one-line rule function called with two values, showing the call's value reaching the name in parentheses and return handing the result back to the calling line); the mechanism guard clauses rely on (once return runs, the lines below it do not run); a figure of call -> body -> return arrow back to the caller; and a predict-the-output check. Explain the parameter idea in plain words, and leave the words parámetro/argumento, defaults, docstrings, annotations and 'no return gives None' to S05. Also: S03 intro p3 should describe the early exit without leaning on 'función'/'devuelve', or point forward to the block. T2-B.p1 should say explicitly that lines after a return that runs are skipped. Drop annotations from S03 theory code ('score: int) -> str', 'code: str) -> str'); output does not change. Costs: test_s03_independent_contract pins exactly 41 code/output blocks, so it becomes a floor (D6 precedent); S05-T1-A's bridge should acknowledge the S03 first contact; and `return`'s firstSectionId moves to decisions-rules. Alternative the owner may prefer: move guard clauses to S05 and rewrite S03 theory as top-level if/elif/else. That deletes S03-T2-B's subject and the outcome 'Aplicar guard clauses', and the S03 practice layer (44 def uses) still has to be rewritten.

> Verifier pass 1: 'Every S03 code example is a def with return' / 'Every S03 theory example is a function' is false for S03-T1-A: theory[2]'s code is top-level (region/monto/ALLOWED, comparisons and `in`) with no def at all. It is 7 of the 9 non-optional theory blocks — theory[3] through theory[9] — plus the optional section_contract listing. This strengthens rather than weakens the placement: theory[2] is def-free and theory[3]'s decide_monto is the first theory function, so the new supporting block belongs exactly between them, and S03-T1-A's code must not be rewritten as if it already used a def.

*Locations (12):* `decisions-rules.theory[0].p3`, `decisions-rules.S03-T1-B.code`, `decisions-rules.S03-T2-A.code`, `decisions-rules.S03-T2-A.callout`, `decisions-rules.S03-T2-B.p1`, `decisions-rules.S03-T2-B.p4`, `decisions-rules.S03-T2-B.code`, `decisions-rules.S03-T3-A.code`, `decisions-rules.S03-T3-B.code`, `decisions-rules.S03-T4-A.code`, `decisions-rules.S03-T4-B.code`, `decisions-rules.selfCheck[5].opt[3]`

### 47. S03 · `return` · Q3_ROUTE_PENDING · UPHELD

A local, route-independent fix exists: the S03 D3 block above. Once S03 teaches def/call/return, every return in these iDo/weDo/youDo items is taught in-section, whichever route is chosen. What stays Q3's decision in the same items is outside this cluster: dict results `{status, code}` and `{status, code, message}` (S06), isinstance, and the cumulative youDo starter rules_engine_intake.py.

*Locations (38):* `decisions-rules.S03-T1-B-DEMO.code`, `decisions-rules.S03-T2-A-DEMO.code`, `decisions-rules.S03-T2-B-DEMO.preamble`, `decisions-rules.S03-T2-B-DEMO.code`, `decisions-rules.S03-T3-A-DEMO.code`, `decisions-rules.S03-T3-B-DEMO.code`, `decisions-rules.S03-T4-A-DEMO.code`, `decisions-rules.S03-T4-B-DEMO.preamble`, `decisions-rules.S03-T4-B-DEMO.code`, `decisions-rules.S03-T1-B-E3.instruction`, `decisions-rules.S03-T1-B-E3.starter`, `decisions-rules.S03-T2-A-E1.instruction` …

### 48. S03 · `truthiness` · GLOSS_AT_FIRST_USE · AMENDED

**Verifier corrected to:** GLOSS_AT_FIRST_USE

D1: preview surfaces must gloss. In the tagline, a short gloss of 'falsy': a value Python treats as false in a condition, such as 0, an empty string or None. In outcome[1], a short gloss of 'truthiness': Python's rule for whether a value counts as true or false. The concept is load-bearing for S03-T1-B, but the depth already exists in the theory, so a phrase is enough here. 'presencia semántica' and 'short-circuit' in outcome[1] need the same treatment (other clusters).

> Verifier pass 1: Keep the tagline gloss of falsy and the outcome[1] gloss of truthiness. Record that learners first meet 'truthiness' in S02's figure note, not the S03 tagline. That note needs its own fix in S02, such as removing 'nunca con truthiness' or rephrasing it in plain words. A gloss there would not work, because S02's callout promises no conditionals and the figure's headline 'Qué es falso en un if' already leaks `if`.

> Verifier pass 2: Tagline (s03:18) and outcome[1] (s03:29) verified verbatim, and events.json confirms 'Neither term appears in S01 or S02': the first truthiness mention course-wide is decisions-rules.tagline. D1 makes preview surfaces non-exempt. Applying the D3 test myself: truthiness is load-bearing in S03, but it already has its own subtopic (S03-T1-B with theory, figure-free callout, demo and three exercises), so the depth requirement is met elsewhere and a phrase on the preview surfaces is the correct treatment, not over-treatment. No test pins either string.

*Locations (2):* `decisions-rules.tagline`, `decisions-rules.outcome[1]`

### 49. S03 · `truthiness` · REPLACE_PLAIN_WORDS · AMENDED

**Verifier corrected to:** REPLACE_PLAIN_WORDS

D6 question 1: the opening hook does not need the label. Its meaning, which must survive, is that Python treats both values as false in a condition, while for the operation they tell different stories. Say that in plain words and let p2 introduce the name. This is needed even if the tagline gets a gloss, because p2 is written as the moment the name appears, and using the label earlier spoils that.

> Verifier pass 1: In theory[0].p0, replace 'ambos valores son falsy' with plain words, for example that Python treats both values as false in a condition. p2's '…cuentan como falsos…' then carries that meaning, and p2 names truthiness. The label 'falsy' first appears glossed in the tagline (group 0) and is defined at S03-T1-B.p1. Do not claim p2 introduces 'falsy'.

> Verifier pass 2: theory[0].p0 verified verbatim at s03:39, and p2 does open 'Esa grieta tiene nombre.' at :41, so the narrative reason for holding the label back is real and p0 already ends on 'esa grieta'. Dependency sweep is clean: no live test or gate in tests/ or scripts/ contains 'falsy' or 'truthiness'; the S03 text-first contract pins other anchors. I considered refuting under the 'the term is the section's own subject' rule — truthiness is S03-T1-B's subject — but the proposal does not remove the term from the section: it keeps it in the tagline (glossed by group 0), in p2 where the section deliberately names it, and in every T1-B surface, selfCheck and youDo use. Only the premature label in the opening hook is replaced, which is what D6 question 1 asks for.

*Locations (1):* `decisions-rules.theory[0].p0`

### 50. S03 · `truthiness` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

theory[0].p2 is the teaching, and every other use comes after it. The uses of 'falsy' and 'truthy' (callout, iDo, weDo) also come after T1-B.p1. The detector misses three forms: PRE_CUE has 'se llama' but not 'se le llama' or 'se les llama'; POST_CUE has no ', es decir,'; and a colon gloss after a bold term is not recognised. Instrument fix: allow an optional clitic ('se (le|les) llama') and ', es decir,', both with low false-positive risk. A general colon rule is riskier (lists, labels), so limit it to '**term**: ' followed by prose that contains a function word. No content change.

> Verifier pass 2: theory[0].p2 (display_order 1030) precedes all eleven covered locations (1038 through 1191), and its quote plus S03-T1-B.p1's are verbatim at s03:41 and :106. The three instrument gaps are real in scripts/course_event_extractor.mts: PRE_CUE lists 'se llama'/'se llaman' but not 'se le llama', so the clitic blocks the match; POST_CUE has no ', es decir,'; and no rule reads a colon gloss after a bold term. That is why events.json credits the definition to S03-T1-B-E1.instruction (a weDo instruction) instead. 'No content change' is right.

*Locations (11):* `decisions-rules.theory[0].p2`, `decisions-rules.theory[1].p1`, `decisions-rules.S03-T1-B.p0`, `decisions-rules.S03-T1-B.p1`, `decisions-rules.S03-T1-B.p5`, `decisions-rules.S03-T1-B.callout`, `decisions-rules.S03-T2-A.p1`, `decisions-rules.S03-T1-B-DEMO.preamble`, `decisions-rules.S03-T1-B-DEMO.why`, `decisions-rules.S03-T1-B-E1.title`, `decisions-rules.S03-T1-B-E1.preamble`

### 51. S04 · `dict-comprehension` · Q3_ROUTE_PENDING · UPHELD

A dict use in the S02–S04 practice layer, so the route decision is pending. A local fix exists under any route, because S04's own theory defers other comprehensions to S06: this exercise cannot keep a dict comprehension in S04 whatever is decided. Option 1: cut E3 down to what S04 teaches, a list comprehension of reject ids plus the rate over `len(rows)`, dropping `by` and the `by["C2"]` output (the success line and tests field change). Option 2: move the id→status map into S06-T2-A practice, where the construct is explained. Either way the rows remain dicts (`r["status"]`), which stays with Q3. The title's em-dash gloss is also imprecise: the construct creates a dictionary, one key-value pair per element, not 'pares clave-valor' on their own.

> Verifier pass 2: All quotes verified at s04-iteration-summaries.ts:1424-1437 (title with its em-dash gloss, '**Meta:** dict comprehension + lista de rejects + `len(rejects)/len(rows)`', both hints) and the solution does build `by = {r["id"]: r["status"] for r in rows}` then iterate `by.items()`. S04-T3-B.p2's deferral 'En S06 estudiarás otras estructuras y sus comprensiones' is verbatim at :280, which is what makes this exercise self-contradictory in S04 under any route. The locations are weDo surfaces in S04, inside Q3's scope as OPEN_QUESTIONS defines it. The criticism of the title's gloss is also correct: the construct builds a dictionary, not loose key-value pairs. Both options are honest about their cost (success line and tests field change, or the exercise moves to S06).

*Locations (4):* `iteration-summaries.S04-T3-B-E3.title`, `iteration-summaries.S04-T3-B-E3.preamble`, `iteration-summaries.S04-T3-B-E3.hint`, `iteration-summaries.S04-T3-B-E3.hint[0]`

### 52. S04 · `for` · GLOSS_AT_FIRST_USE · UPHELD

D1: taglines are not exempt. Add a short gloss of `for` in the tagline's own style (em dash or parenthesis): it repeats instructions once for each value of a group. `while` (outside this cluster) needs the same. A phrase is enough, since S04-T1-A teaches it fully. Needed under any Q3 outcome: even if S02/S03 keep their loops, they never explain them.

> Verifier pass 2: Tagline verified verbatim at s04-iteration-summaries.ts:18, and it is the first event of S04 (display_order 1473, ahead of jobRelevance 1474 and outcome[0] 1475), so D1 applies and the em-dash gloss of 'comprensiones' next to an unglossed `for` and `while` is a real asymmetry. No test or gate pins the tagline text (grep across tests/ and scripts/ finds it only in generated audit reports under industry_alignment/ and expert_audit/, which would merely go stale). The claim that the fix is needed under any Q3 outcome is correct: S02 and S03 use `for` 61 learner-visible times without ever explaining it.

*Locations (1):* `iteration-summaries.tagline`

### 53. S04 · `for` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses an infinitive purpose phrase that uses the term as its instrument ('Recorrer X con `term`'): no copula and no article. It is a preview gloss at the D1 floor, and S04-T1-A.p0 gives the full teaching. No content change. Teaching the detector 'VERB … con `term`' is risky, because outcomes often say 'con X' about tools already taught. A safer instrument change: count a roadmap line or heading as covered when a gloss comes earlier in the same section.

> Verifier pass 2: Ordering verified from events.json: outcome[0] 1475 < theory[1].p1 1493 < S04-T1-A.heading 1497, and all quotes are verbatim (outcome[0], outcome[3] 'Usar `continue` para saltar una vuelta', jobRelevance 'por lo común, un bucle los visita uno tras otro', 'T1 trata el recorrido: `for` y `range`', heading 'for, range y secuencias'). 'Recorrer grupos ordenados de valores con `for`' does state what `for` does and sits on an `outcome`, which scripts/concept_map.py counts as a teaching surface by design, so no content change is defensible — but this is the weakest admissible form of a D1 gloss (an instrument phrase, not the copula or appositive D1 describes), and it only carries the heading because S04-T1-A.p0 follows it one event later. The caution against teaching the detector 'VERB … con `term`' is well founded for the same reason.

*Locations (3):* `iteration-summaries.outcome[0]`, `iteration-summaries.theory[1].p1`, `iteration-summaries.S04-T1-A.heading`

### 54. S04 · `for` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

p0 is the teaching, and p2 and the code follow it. What the detector misses is a code span opening the sentence as subject, followed by a describing verb ('entrega'). INDEFINITE_BEFORE requires un/una, and the verb is 13 characters after the alias, one more than DESCRIBING_VERB allows. Instrument fixes: (1) require a non-letter before POST_CUE's cue words, which also removes the false credit at computer-vision.S23-T1-B-DEMO.retrospective; (2) stop PAREN_GLOSS from crediting `for` in S04-T1-A-E2.preamble ('practicar un contador manual en un `for` (base del gate de resúmenes)'), where the parenthesis describes the noun phrase; (3) treat a code span that opens a sentence as a generic subject for DESCRIBING_VERB, measuring distance from the closing backtick. Fixes (1) and (2) alone would drop `for` to L0, so (3) is needed for the map to see the real teaching. No content change.

> Verifier pass 2: Reproduced the whole instrument argument. events.json credits `for` with exactly three definitions — S04-T1-A.callout, S04-T1-A-E2.preamble and S23-T1-B-DEMO.retrospective — so 'all three are false positives' and 'fixes (1) and (2) alone would drop `for` to L0' are both checkable and correct. POST_CUE (/^[^.!?;]{0,45}?(?:…|es el|…)/i) does fire on 'necesites el' 41 characters into the callout's tail, and the same glue fires on 'tienes el' in the S23 retrospective ('no la última i del for) importa, ya tienes el hábito'). PAREN_GLOSS does credit S04-T1-A-E2's '(base del gate de resúmenes)', which describes the exercise, not `for`. And the DESCRIBING_VERB arithmetic is exact: '` x in lista` ' is 13 characters before 'entrega', one more than the {0,12} the rule allows, while INDEFINITE_BEFORE fails because no article precedes the code span. p0 precedes p2 and the code (1498 < 1500 < 1501), s

*Locations (3):* `iteration-summaries.S04-T1-A.p0`, `iteration-summaries.S04-T1-A.p2`, `iteration-summaries.S04-T1-A.code`

### 55. S04 · `list-comprehension` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses an appositive with no article after a comma. No content change. Instrument: accept ', <plural noun> [adjective] de/que/para …,' only when a second comma closes the appositive and it contains a function word. An unrestricted bare-appositive rule would also match ordinary lists. Separately, concept_map could count a theory.heading as covered when the first paragraph of the same block defines the term.

> Verifier pass 2: Both quotes verbatim (outcome[5] at s04:33, heading and theory[7].p0 at :257-259), and the ordering is outcome[5] 1480 < heading 1528 < p0 1529, so the heading really is scored one event before the paragraph that defines the term in its own block. The instrument diagnosis is exact: APPOSITIVE requires 'un|una|unos|unas' after the comma, and ', formas compactas de crear listas,' has no article, while POST_CUE, PAREN_GLOSS and DASH_GLOSS cannot fire on that text either. The proposed restriction (require the closing comma and a function word) is the minimum needed to avoid matching ordinary enumerations. No content change is correct: outcome[5] is a genuine gloss at the D1 floor.

*Locations (2):* `iteration-summaries.outcome[5]`, `iteration-summaries.theory[7].heading`

### 56. S04 · `parameter` · REPLACE_PLAIN_WORDS · UPHELD

Keep the forward bridge, which motivates S05, and replace the three labels with what they mean: what the reusable steps receive, what they hand back and what they promise. 'funciones reutilizables' is fine after S02's gloss and the S03 block.

*Locations (1):* `iteration-summaries.theory[0].p4`

### 57. S04 · `return` · Q3_ROUTE_PENDING · UPHELD

S04 already has a local plain-words mitigation for def ('una receta con nombre') but none for return. With the S03 block, return is taught before S04, so these locations need nothing further for `return`. What stays with Q3: `raise ValueError` (S09), `dict[str, Any]` annotations and `from __future__ import annotations` in the youDo starter.

*Locations (7):* `iteration-summaries.S04-T1-B-DEMO.code`, `iteration-summaries.S04-T1-B-E3.starter`, `iteration-summaries.S04-T3-A-E2.instruction`, `iteration-summaries.S04-T3-A-E2.hint`, `iteration-summaries.S04-T3-A-E2.hint[0]`, `iteration-summaries.S04-T3-A-E2.starter`, `iteration-summaries.youDo.starter`

### 58. S05, S08, S10 · `abc` · ALIAS_FALSE_MATCH · UPHELD

Not the concept. These are code or backticked, so no tooltip appears. No content change: they are values in runnable code and declared outputs. The glossary matcher change above fixes them.

> Verifier pass 2: All eight quotes verbatim (s05 instruction/starter/retrospective; s08 'El contenido del temp sigue siendo `b'abc'`', `p.write_bytes(b'abc')`, `"sha256": "abc"`, `'sha256': 'abc'`; s10 youDo starter `"C2,Luis,abc"`). The senses plainly differ — a length argument, literal bytes, a fake digest and a non-numeric CSV amount, none of them an abstract base class. 'No tooltip appears' verified for all eight by replicating the RichText matcher, which blanks backticked spans before matching. 'No content change' is the right call: three of the eight are runnable code and the rest are backticked prose naming the literal that code uses. Minor looseness worth noting rather than refuting: S05-T2-B-E1.instruction, S05-T2-B-E1.retrospective and S08-T4-A-E1.instruction are prose about those values, not 'values in runnable code and declared outputs' as the detail puts it.

*Locations (8):* `functions-contracts.S05-T2-B-E1.instruction`, `functions-contracts.S05-T2-B-E1.starter`, `functions-contracts.S05-T2-B-E1.retrospective`, `files-ingestion.S08-T4-B.code`, `files-ingestion.S08-T4-A-E1.instruction`, `files-ingestion.S08-T4-A-E1.starter`, `files-ingestion.S08-T4-B-E1.starter`, `modules-packaging-cli.youDo.starter`

### 59. S05 · `annotation` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss 'type hints' in place. Name it once with its Spanish name 'anotaciones de tipo' (the glossary term) and describe it as a note on a parameter or result that states the expected type, which Python does not check while the program runs. 'graduales' means only the public normalizer functions get annotated. 'errores de dominio' is also unglossed here (outside this cluster).

*Locations (1):* `functions-contracts.outcome[3]`

### 60. S05 · `annotation` · GLOSS_AT_FIRST_USE · UPHELD

Same vocabulary gap as `parameter`: add 'anotación de tipo' to theory[1].p1, saying what it is and that Python does not enforce it, so the optional block glosses what it names.

*Locations (1):* `functions-contracts.theory[1].p5`

### 61. S05 · `annotation` · NO_ACTION_JUSTIFIED · UPHELD

A subsection heading names the topic that its own second paragraph defines, which is the orientation D3 asks for. A gloss inside a heading would be noise, and the instrument flags it only because it precedes p1 by one paragraph.

*Locations (1):* `functions-contracts.S05-T2-B.heading`

### 62. S05 · `annotation` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

S05-T2-B.p1 is the definition itself, and the other four uses come after it. Missed forms: a code-only parenthetical between the term and the verb pushes 'describen' past DESCRIBING_VERB's 12-character window, and the generic definite plural 'Los' + term + describing verb is not accepted, because only un/una count. Instrument fix: skip one code-only parenthetical before testing DESCRIBING_VERB, and accept a generic plural 'Los/Las' subject. Content note for the S05 round: p1 should name 'anotaciones de tipo' once next to 'type hints', since p4 switches to 'anotaciones' without the link.

*Locations (5):* `functions-contracts.S05-T2-B.p1`, `functions-contracts.S05-T2-B-DEMO.description`, `functions-contracts.S05-T2-B-E1.starter`, `functions-contracts.selfCheck[1].opt[1]`, `functions-contracts.resources.doc[2]`

### 63. S05 · `parameter` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss 'parámetros' in place as the names a function declares to receive a call's values, consistent with S05-T1-A.p1's parameter/argument split. The same outcome also has 'keyword' and 'defaults' untranslated and unexplained; flag them for the S05 round (outside this cluster).

*Locations (1):* `functions-contracts.outcome[1]`

### 64. S05 · `parameter` · GLOSS_AT_FIRST_USE · UPHELD

The block's vocabulary paragraph exists to gloss the section's terms, covers función and return, and omits parámetro, which the block then uses twice. Add one clause for parámetro to theory[1].p1; the same edit covers anotación de tipo (see annotation). The non-optional teaching stays at S05-T1-A.p1.

*Locations (2):* `functions-contracts.theory[1].p3`, `functions-contracts.theory[1].p5`

### 65. S05 (teach in S03) · `return` · TEACH_EARLIER · UPHELD

With the S03 block the learner has met def and return before S05, and D1 exempts terms met in an earlier section, so this outcome needs no edit. If the owner rejects the S03 block, gloss 'retornar valores' in place per D1 (hand a result back to whoever called the function).

*Locations (1):* `functions-contracts.outcome[0]`

### 66. S05 · `return` · NO_ACTION_JUSTIFIED · UPHELD

The verb names the output p0 has just described ('una salida que otra pieza puede usar'). The learner has read 'X devuelve Y' for calls since S02 ('`input()` siempre devuelve `str`'), and the statement is taught in the same section at S05-T1-A.p1. Rewording a basic verb in the orientation paragraph would cost prose quality and add no understanding, and once the 'devuelve' alias is removed the match disappears.

*Locations (1):* `functions-contracts.theory[0].p1`

### 67. S05 · `return` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

It is taught at theory[1].p1 (optional block), which precedes theory[1].p5, theory[1].code and the T1-A heading. It is taught again, non-optionally, at S05-T1-A.p1 with a worked example and a check. The detector misses the grammatical form 'backticked keyword as a bare subject + describing verb' ('`return` entrega …'): DESCRIBING_VERB is accepted only after INDEFINITE_BEFORE (un/una + term), and a keyword never takes an article. Instrument fix: accept a code-formatted term followed directly by a DESCRIBING_VERB with no article. Separately, the credited first definition S05-T4-A.p3 is false: 'se denomina **función de retorno** (`callback`)' defines callback and matched through the 'retorno' alias. theory[1].code (s05_section_contract) is the same dev-metadata listing as in S01–S03; it is not a surprise here, but it is equally throwaway.

*Locations (23):* `functions-contracts.theory[1].p1`, `functions-contracts.theory[1].p5`, `functions-contracts.theory[1].code`, `functions-contracts.S05-T1-A.heading`, `functions-contracts.S05-T1-A.p1`, `functions-contracts.S05-T1-A.p2`, `functions-contracts.S05-T1-A.p3`, `functions-contracts.S05-T1-A.p4`, `functions-contracts.S05-T1-A.code`, `functions-contracts.S05-T1-A.callout`, `functions-contracts.S05-T1-B.code`, `functions-contracts.S05-T2-A.p2` …

### 68. S06, S10 · `merge` · HOMONYM · UPHELD

The dict sense is taught at S06-T2-A.p2 before every one of these. Nothing to teach. Writing fix: prose should use the Spanish the course already taught ('fusionar', 'fusión'); S06-T2-A-E3's own title is 'Fusionar config sin mutar defaults' while its preamble says 'merge'. Identifiers `merge`, `merge_config.py`, `# merge precedence` stay (outputs pinned).

> Verifier pass 2: The dict-overlay sense is taught at collections.S06-T2-A.p2 (s06 line 166, verbatim) and that paragraph precedes every location in the group: S06-T2-A-E3's preamble is at line 1135, and the S10 locations are a later section. The quoted S10 evidence is verbatim (E2 preamble line 1852, starter `def merge(defaults, file_cfg, env_cfg, flags):`, '# merge precedence'), as is the observation that S06-T2-A-E3's own title says 'Fusionar config sin mutar defaults' while its preamble says 'merge' (line 1133 vs 1135). Identifiers are safe to keep: the alias regex's trailing guard `(?![\p{L}\d_]|\.py)` means 'merge_config' and 'merged' never match, so only the standalone prose uses are at issue.

*Locations (6):* `S06 collections.S06-T2-A-E3.preamble`, `S10 modules-packaging-cli.S10-T4-A-DEMO.retrospective`, `S10 modules-packaging-cli.S10-T4-A-E1.retrospective`, `S10 modules-packaging-cli.S10-T4-A-E2.title`, `S10 modules-packaging-cli.S10-T4-A-E2.instruction`, `S10 modules-packaging-cli.S10-T4-A-E2.starter`

### 69. S06 · `shape` · HOMONYM · AMENDED

S06-T1-B.p0 teaches the S06 sense where it is first used. The detector misses the form 'Spanish noun + (`term`) + colon enumeration', so in that sense no S06 use is actually surprising. The problem is the English label, whose S06 meaning (type inside the shape) contradicts S14. Treatment: in S06 learner-facing prose, replace 'shape' with the Spanish nouns S06 already uses ('forma', as in "Forma y contenido son problemas diferentes", or 'estructura'). Keep T1-B.p0's enumeration (count, order, type per position) as the definition of 'forma de la fila' and drop the parenthetical `shape` label. Apply this at all nine locations: T3-A.callout title, E3 weDo title and E3 starter comment included. Comment changes alter no output. Apply the same change to surfaces the extractor does not read: the feedback of S06-T1-B-E1 ('Unpack documenta el shape esperado de la fila'), S06-T3-A-E1 ('lista vacía es shape OK'), S06-T3-A-E2 ('Shape listo para CSV en S08') and S06-T3-A-E3 ('separa shape de contenido'), plus the youDo portfolioNote ('Incluye el shape del store'). The code title shape_check.py can stay. No test pins these strings: a grep of tests/ and scripts/ found them only in quarantined generators and audit reports. Rejected alternative: keep S06's 'shape' and split the glossary into two terms. That would keep a meaning that S14 contradicts, and writing rule D7 already limits English to code.

> Verifier pass 1: Two more learner-visible S06 surfaces carry the same label and are not in the list: the iDo retrospective of S06-T3-A-DEMO (s06-collections.ts:644, 'En T3-A usarás conteos y shapes para demostrar que el recorrido conserva relaciones') and S06-T3-A-E3's `edgeCases: ["shape roto"]` (:1427). SectionView.tsx renders both edgeCases (:644) and feedback (:653), so they reach the learner; the extractor reads neither. The plural at :644 matters twice over, because the same glossary block proposes adding a 'shapes' alias, which would turn that line into a new S06 surprising use. Also state the ordering constraint: tests/adversarial/glossary-first-use.test.mjs scans only `paragraphs:` and rejects a match preceded by a backtick, so today 'Shape' first appears in prose at S06-T3-A.p0/.p2 and firstSectionId 'collections' passes. Moving firstSectionId to 'security' fails that gate unless these two para

*Locations (9):* `collections.S06-T1-B.p0`, `collections.S06-T3-A.p0`, `collections.S06-T3-A.p2`, `collections.S06-T3-A.callout`, `collections.S06-T1-B-E1.preamble`, `collections.S06-T1-B-E1.retrospective`, `collections.S06-T3-A-E1.retrospective`, `collections.S06-T3-A-E3.title`, `collections.S06-T3-A-E3.starter`

### 70. S06 · `slicing` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

The detector misses a reverse parenthetical, where the gloss comes before '(`term`)'. No content change. Instrument: when an alias stands alone inside a parenthesized code span, credit it if the 3–60 characters before the '(' are prose with a function word (the looksLikeProse test PAREN_GLOSS already uses), excluding cross-references.

> Verifier pass 2: Quotes verbatim at s06-collections.ts (outcome[0], heading 'Listas, tuplas y slicing' :60, and S06-T1-A.p1 'Un recorte (`slice`) es una ventana sobre esa fila…'), ordering 2370 < 2385 < 2387. The instrument claim is confirmed by the code: definesTerm computes `after = text.slice(at + len, …)` and PAREN_GLOSS is anchored with ^, so a gloss that precedes '(`term`)' is unreachable, which is exactly the shape of 'recortes por posiciones (`slicing`)'. The gloss does say what a slice does, so no content change is right, and the proposed reverse-parenthetical rule reuses the existing looksLikeProse test. Note that this group is sound while the concept's glossary verdict is not — see `missed`.

*Locations (2):* `collections.outcome[0]`, `collections.S06-T1-A.heading`

### 71. S07 · `coverage` · ALIAS_FALSE_MATCH · UPHELD

The bare alias 'cobertura' matches an ordinary noun. No content change; remove the bare alias (see glossary).

> Verifier pass 2: Quote verbatim. The sense is plainly the everyday Spanish noun: `fullmatch` requiring the pattern to span the whole string has nothing to do with the share of code executed by tests. No content change is warranted and the remedy belongs in the glossary aliases.

*Locations (1):* `text-unicode-regex.S07-T3-A.p2`

### 72. S07, S13 · `merge` · HOMONYM · UPHELD

Sense taught in Spanish at S07-T4-A. Writing fix: replace the English 'auto-merge'/'merge' with the taught 'fusionar automáticamente'/'fusión'. S13-T1-B.p1 already explains itself in the same clause ('unir cuentas de dos personas distintas'). No definition needed.

> Verifier pass 2: All four quotes verbatim: S07-T4-A.p0 'No la uses para auto-fusionar.' (s07 line 292), p1 'nunca fusiona cuentas automáticamente' (line 293), S07-T4-A-E3.hints[1] 'No auto-merge en review.' (line 1553), and evidence-dashboard.S13-T1-B.p1 'un merge falso puede unir cuentas de dos personas distintas' (s13 line 127). Entity fusion is a different operation from a pandas row join, and S07 does teach it in Spanish before every location. Nothing depends on the English wording: the pinned output for S07-T4-A-E3 is 'review Juan Perez Juan P Perez 0.67' and its `tests` field is 'review'; no active file under tests/ or scripts/ contains 'auto-merge'.

*Locations (4):* `S07 text-unicode-regex.S07-T4-A-E3.preamble`, `S07 text-unicode-regex.S07-T4-A-E3.hint[1]`, `S13 evidence-dashboard.S13-T1-B.p1`, `S13 evidence-dashboard.S13-T1-B-DEMO.preamble`

### 73. S09 · `abc` · ALIAS_FALSE_MATCH · UPHELD

Not the concept. S09-T1-A-E2.instruction is RichText with the list literal outside backticks, so the hover shows the ABC tooltip in S09 today. Backticking that literal is correct code formatting and removes it. Tests render as plain text, so no tooltip there. The real fix is the glossary matcher change above.

> Verifier pass 2: Quotes verbatim: `validate_row({"id": "C001", "monto": "abc"})` and the declared output `cause: ParseError no parseable: 'abc'` both exist in s09-exceptions-logging.ts, and E2's preamble, instruction and tests match word for word. Sense differs — a non-numeric monto fixture, not an abstract base class. The rendering claim is exactly right and is the sharpest check in the group: my replication of the RichText matcher shows S09-T1-A-E2.instruction is the one S09 location that fires the ABC tooltip, because `["10.5", "3,25", "abc", "-1"]` sits outside backticks, while E2.tests (plain text via SectionView.tsx:666) and the theory code block show nothing.

*Locations (4):* `exceptions-logging.S09-T1-A.code`, `exceptions-logging.S09-T1-A-E2.preamble`, `exceptions-logging.S09-T1-A-E2.instruction`, `exceptions-logging.S09-T1-A-E2.tests`

### 74. S09 · `context-manager` · IDENTIFIER_KEEP · AMENDED

**Verifier corrected to:** IDENTIFIER_KEEP

Keep `contextlib`: it is the module name and what the URL points to. The note is written by the course, so it should say in plain words what the page offers (tools for writing the entry and exit steps that `with` runs), consistent with the S38/S09 replacement above. The label is a truncated form of the official title 'contextlib — Utilities for with-statement contexts' and reads as broken English. Restoring the official title is safe because it matches no alias. The books entry 'Fluent Python (Ramalho) — excepciones/context managers' is not extracted (books are not pushed) and is optional reading; no action.

> Verifier pass 1: Keep `contextlib`. Restoring the official title 'contextlib — Utilities for with-statement contexts' adds no new alias match, but 'contextlib' stays an alias hit. That is intended, because it keeps exceptions-logging passing glossary_coverage_audit after the S38/S09 replacement. Rewrite the note in plain words without markdown, because ResourcesPage renders it as raw text. For example: 'herramientas para escribir los pasos de entrada y salida que ejecuta with'. Books entry: no action.

> Verifier pass 2: docs[4] is the contextlib entry (s09-exceptions-logging.ts:2437-2440) and the event text is label+note joined, exactly as the extractor builds it (`${d.label} ${d.note ?? ''}`). The alias attribution is right: 'contextlib' matches, 'Context manager' cannot match the plural in the note. Rendering claim confirmed — ResourcesPage.tsx:2103 prints `{d.note}` as bare text and imports neither RichText nor InlineText, and SectionView never renders resources, so there is no hover. The Fluent Python line is under `resources.books` (s09:2452-2456) and the extractor iterates only `s.resources.docs`, so it is genuinely unextracted. firstSectionId consequence checked by replicating glossary_coverage_audit.py: with firstSectionId 'exceptions-logging' the alias 'contextlib' hits S09, so the section passes.

*Locations (1):* `exceptions-logging.resources.doc[4]`

### 75. S09, S38, S51 · `correlaci-n` · HOMONYM · UPHELD

S09 and S51 need no content change for define-before-use. S09 p3 already teaches its own sense with an em-dash gloss; the gloss is about 135 characters, beyond the extractor's 120-character window, so it is invisible. S51 names trace_id. The remedy is glossary plus instrument, and OPEN_QUESTIONS option 2 (split the entry) is insufficient on its own. course_event_extractor.mts matches every term independently, so a new 'identificador de correlación' term would not stop 'Correlación' matching inside it. The hover sorts by alias length, but the shorter alias still matches inside the annotated span; the replication gave nested markers '⟦TERM:correlation-id⟧identificador de ⟦TERM:correlaci-n⟧correlación⟦/TERM⟧⟦/TERM⟧'. A split needs span claiming in the extractor, in annotateGlossaryTermsPlain and in glossary-first-use.test.mjs, proven in both directions. The new term's aliases must cover the forms used ('identificador de correlación', 'correlation_id', 'trace_id de correlación'). Two bare uses would still match the statistics term: S38's 'trazas, correlación y SLI/SLO' (which also reads ambiguously right after S35's statistical use) and S51's 'Sin correlación no hay auditoría'. Either reword them to name the id being correlated, or accept them as known false mentions. Section-range scoping (option 1) cannot help, because both come after S18.

*Locations (7):* `exceptions-logging.theory[0].p3`, `exceptions-logging.theory[0].p5`, `exceptions-logging.theory[1].p1`, `exceptions-logging.selfCheck[10].explanation`, `performance-extreme.theory[1].p2`, `integrator-final.S51-T1-A.p0`, `integrator-final.S51-T1-A-DEMO.why`

### 76. S09, S11, S12, S13 · `missing-values` · HOMONYM · UPHELD

Not this concept. Code and pinned outputs stay as they are. Split the glossary (see the glossary entry). The split will expose a separate gap, recorded here for its own round: the float sense is load-bearing in S11-T2-A-E3 (the starter assigns float("nan") and the tests expect 'reject_nan') and in S13-T3-B-E2 (the starter's DEFECT lets NaN fall through the `>=` comparisons to 'abstain'), yet it is never explained. The only explanation, 'rompe comparaciones', is in S11's retrospective, after the exercise. It needs a gloss at its first use, S09-T1-A-E2's preamble: the text 'NaN'/'Infinity' parses into special non-finite Decimal values, which is why is_finite is required. The rule that every comparison with NaN is false must be stated before S11-T2-A-E3. S12's use is one item in a list of invalid examples and could simply say non-numeric.

*Locations (18):* `exceptions-logging.S09-T1-A-E2.preamble`, `exceptions-logging.S09-T1-A-E2.hint[1]`, `exceptions-logging.S09-T1-A-E2.tests`, `oop-domain.S11-T3-A.p2`, `oop-domain.S11-T4-B.p2`, `oop-domain.S11-T2-A-E3.preamble`, `oop-domain.S11-T2-A-E3.instruction`, `oop-domain.S11-T2-A-E3.hint[1]`, `oop-domain.S11-T2-A-E3.starter`, `oop-domain.S11-T2-A-E3.retrospective`, `apis-sql-geo.S12-T4-B.p0`, `evidence-dashboard.S13-T3-B.code` …

### 77. S09 · `missing-values` · REPLACE_PLAIN_WORDS · UPHELD

The exercise sorts eight failures into data, config or provider. This label only has to read as a row-level data defect, like its neighbour 'email vacío en fila', so it can say an empty or non-numeric amount. Change the starter list, the solution dict key and the declared output line together, because D8 compares outputs line by line; the tests only require eight lines with the right classes. No test pins the string.

*Locations (3):* `exceptions-logging.S09-T4-A-E1.preamble`, `exceptions-logging.S09-T4-A-E1.starter`, `exceptions-logging.S09-T4-A-E1.retrospective`

### 78. S10 · `apply` · ALIAS_FALSE_MATCH · UPHELD

Not the concept. The label is declared output (D8), so it stays. Writing fix for codex: the instruction ('haz print de apply') and hint ('en cada apply') use the English label as a Spanish noun; refer to it as the printed line in backticks (`apply …`). That reads as output rather than vocabulary and also keeps the hover off, since annotateGlossaryTermsPlain skips backtick code.

> Verifier pass 2: All quotes verbatim in s10-modules-packaging-cli.ts: starter `print(f"apply {name} -> {val}")`, the pinned solution output 'apply defaults -> INFO / apply env -> DEBUG / apply flags -> ERROR', the preamble Meta line, the instruction 'haz print de apply' and the hint 'en cada apply' (lines 1762-1832). This is the English verb as a printed trace label, not pandas: `.apply(` occurs in no active section file — only in the legacy s07-pandas.ts and s11-advanced-topics.ts, neither of which is in the active slug map. The backtick rationale checks out: annotateGlossaryTermsPlain masks `code` spans before matching (RichText.tsx:381-387), and preamble/instruction/hint all render through RichText with sectionId (SectionView.tsx:570, 576, 587), so they do carry hovers today. Output stays under D8.

*Locations (5):* `S10 modules-packaging-cli.S10-T4-A-E1.preamble`, `S10 modules-packaging-cli.S10-T4-A-E1.instruction`, `S10 modules-packaging-cli.S10-T4-A-E1.hint`, `S10 modules-packaging-cli.S10-T4-A-E1.hint[1]`, `S10 modules-packaging-cli.S10-T4-A-E1.starter`

### 79. S10 · `pytest` · REPLACE_PLAIN_WORDS · UPHELD

A teaser that names a tool the learner has not met. The plain meaning must survive: the next exercise separates dependencies needed only while developing from those needed to run the CLI. The tool's name, with its gloss, belongs in E2's preamble.

> Verifier pass 2: Quote verbatim. The dependency sweep is clean: no file under tests/ mentions S10-T2-B-E1, nothing in tests/ or scripts/ contains 'dónde vive pytest' or that retrospective's wording, and E1's own starter, solution, instruction, hints and tests never mention pytest — it appears only in this forward-teaser sentence. pytest is not S10-T2-B's subject (the subtopic is SemVer and dependency structure), so removing the name costs nothing, and the plain meaning the diagnosis says must survive is exactly what E2's retrospective already states ('dev = lo que necesita el autor al testear').

*Locations (1):* `modules-packaging-cli.S10-T2-B-E1.retrospective`

### 80. S10 · `pytest` · GLOSS_AT_FIRST_USE · UPHELD

Needed here: pytest is the example of a development-only dependency in the starter, hints and success line. D3 test: not load-bearing, because build_deps is fixed by not concatenating `dev` into `dependencies`, which is solvable without knowing pytest. Gloss it in the preamble's context line: pytest is the tool the author installs to run the project's automated tests, so the installed CLI never needs it, which is why it goes under dev. Write it as an appositive or parenthetical: 'es herramienta de…' has no article, and the detector would not credit it. Outside this concept, not absorbed: the runtime/dev split and `optional-dependencies` are practised in E2 but never taught in S10-T2-B theory. A packaging reviewer (PyPA; PEP 735) would also note that `optional-dependencies.dev` publishes a user-installable extra, while `[dependency-groups]` now exists for dev-only tools. The S10 round should state or change that.

> Verifier pass 2: All three quotes verbatim. The D3 test applied directly to the source: S10-T2-B-E2's defect is that build_deps returns `list(runtime) + list(dev)`, and the fix is `dependencies: list(runtime)` plus `optional-dependencies: {'dev': list(dev)}` — pytest is only a string inside the input list, so a learner who does not know what pytest is can still solve it. A subsection would be over-treatment; a gloss is the right floor. The term also cannot be removed, since it appears in the success line, the hints and the printed output `{'dev': ['pytest']}`. The wording warning is correct too: 'es herramienta de desarrollo' has no article, so POST_CUE (which knows 'es un/una/el/la' but not a bare noun) would not credit it — the event at display_order 4388 indeed has pytest in mentions and not in defines.

*Locations (4):* `modules-packaging-cli.S10-T2-B-E2.preamble`, `modules-packaging-cli.S10-T2-B-E2.hint[0]`, `modules-packaging-cli.S10-T2-B-E2.hint[1]`, `modules-packaging-cli.S10-T2-B-E2.starter`

### 81. S11 · `apply` · HOMONYM · UPHELD

The exercise already says what this `apply` must do, so no teaching is missing; the name and the pinned output (Ana / ana) stay. The unbackticked 'apply(norm, text)' in the hint currently gets the pandas hover; fixing the glossary entry removes that, and backticking it locally does too.

> Verifier pass 2: Verbatim in s11-oop-domain.ts (lines 1441-1486 region): the preamble, `def apply(norm, text): return text`, the solution `return norm(text)` and the pinned output 'Ana / ana'. The sense really differs from pandas .apply — this is a callable injected into a one-value function, and the exercise text states the contract, so no teaching is missing. The hover claim is checkable and true: hints[0] and `hint` write 'apply(norm, text)' unbackticked, apply's firstSectionId is 'decisions-rules' (S03) so termsAvailableAt makes it available from S03 on (glossary/index.ts:17-25), and the annotate regex matches 'apply' before '(' since '(' is outside its word class.

*Locations (6):* `S11 oop-domain.S11-T3-B-E2.title`, `S11 oop-domain.S11-T3-B-E2.preamble`, `S11 oop-domain.S11-T3-B-E2.instruction`, `S11 oop-domain.S11-T3-B-E2.hint`, `S11 oop-domain.S11-T3-B-E2.hint[0]`, `S11 oop-domain.S11-T3-B-E2.starter`

### 82. S11 · `dunder-method` · GLOSS_AT_FIRST_USE · AMENDED

At this first contact, say what `__repr__` produces: the text Python shows when the object is printed or inspected. That is the `ClientRecord(client_id='C001', ...)` line the demo asks the learner to predict and S11-T1-A-E1 pins. In the same place, add one clause saying that names with two underscores on each side are methods Python calls by itself (when building the object, when showing it). That clause serves `__post_init__`, `__eq__` and `__hash__` later in S11. Do not introduce the word 'dunder', which appears nowhere else in the course. Depth: a gloss, not D3. Each later member is glossed where its exercise needs it; S11-T1-B has '`__post_init__` (el gancho que ejecuta la dataclass justo después de construir el objeto)'. So misunderstanding the category leaves no S11 exercise unsolvable. Also, `__init__` is called 'el constructor' although the course never teaches that word; the same clause can cover it.

> Verifier pass 1: '`__init__` is called el constructor although the course never teaches that word' is true only in the sense of never being defined. The word is already used, unglossed, three times before S11: s02-basics.ts:1015 ('hábito `strip` → constructor `int`'), s02-basics.ts:1786 ('cambió el constructor') and s06-collections.ts:1061 ('`dict(pares)` es el constructor idiomático clave–valor'); there is no 'constructor' entry in terms.ts. So the clause proposed at S11-T1-A.p0 would be a gloss at fourth use, not first use, and the owner should decide whether 'constructor' is handled in S02 instead. The dunder-category gloss itself is unaffected.

> Verifier pass 2: All quotes are verbatim: S11-T1-A.p0, S11-T1-A-E1.tests, S11-T1-B-E1.instruction, S11-T2-B.p2, and the S11-T1-B.p0 `__post_init__` gloss. D3 test, run against starters and solutions: `def __post_init__` is added in S11-T1-B-E1, T2-B-E1, T3-A-E3 and T4-B-E1. Theory is displayed before exercises, so all four follow the S11-T1-B.p0 member gloss. No exercise adds `def __init__`, `__eq__`, `__hash__` or `__repr__` beyond the starter. S11-T2-B-E3 only reads hand-written `__hash__`/`__eq__`, and that comes after the S11-T2-B.p2 gloss. A misunderstanding of the category therefore leaves no exercise unsolvable, so a gloss rather than a subsection is correct. `__repr__` first appears at S11-T1-A.p0, and no `def __x__` occurs before S11. The claim that 'constructor' is never taught holds: it is used without being taught in S02 (weDo preamble, retrospective) and S06 (feedback). The demo output `Clie

*Locations (1):* `oop-domain.S11-T1-A.p0`

### 83. S11 · `dunder-method` · ALREADY_TAUGHT_INSTRUMENT_FN · AMENDED

**Verifier corrected to:** COVERED_BY_GLOSS_AT_FIRST_USE (depends on group 0)

Taught in place for the member the alias matched. The detector misses this grammatical form: a prose parenthetical attached to the preceding token (`repr`) whose last words name the alias ('..., generada por `__repr__`)'). PAREN_GLOSS only looks at text after the matched term. No content change: once the S11-T1-A.p0 gloss lands, this location comes after the definition anyway.

> Verifier pass 1: No content change here. The location stops being surprising only after the S11-T1-A.p0 category gloss lands, and only if that gloss is written in a shape definesTerm detects. Record the instrument false negative (a gloss before the term inside one parenthetical) as a separate detector issue. Do not treat it as evidence that the concept was taught here.

> Verifier pass 2: Quote verbatim at s11-oop-domain.ts:435, and it is the only location the group covers, so the ordering test is trivially met. I ran definesTerm's logic by hand against this text with `__repr__` as the matched alias: `after` is ').  Sin PII real…', so PAREN_GLOSS (anchored ^, needs an opening paren) misses, POST_CUE is stopped by the '.' inside `[^.!?;]{0,45}`, APPOSITIVE needs ',' not '.', PRE_CUE/INDEFINITE_BEFORE/DASH/CONTRAST all miss, and kind is 'ido.preamble' so DICT_KIND cannot apply — definesTerm returns false, which is why the dossier reports definitions_all: [] . The text does say what `__repr__` produces ('la representación textual del objeto'), so it teaches the member sense the group declares, and the group is honest that it does not teach the category. Both `__repr__` occurrences are backticked, and my replication of annotateGlossaryTermsPlain (which blanks `code` spans fir

*Locations (1):* `oop-domain.S11-T1-A-DEMO.preamble`

### 84. S11 · `entity-resolution` · REPLACE_PLAIN_WORDS · UPHELD

S11's work is dataclass identity and equality (frozen, compare=False), not the resolution process, which S13 teaches as a full subtopic. Keep the plain meaning: when records are grouped as the same client (the matching from S07), identity is the stable `entity_id`. Name no process here; teaching ER in S11 would duplicate S13.

> Verifier pass 2: Both quotes verbatim in s11-oop-domain.ts: the demo preamble at line 557 and S11-T2-B.p0's 'usarlo como identidad fusionaría entidades por accidente en el set de resolución (el conjunto donde se agrupan entidades únicas)' at line 199. The alias that fired is 'resolución de entidades', and it only matches at line 557 — line 199's 'set de resolución' is not an alias — which is why the dossier lists exactly one S11 location. S11's subject is dataclass identity (frozen, compare=False), not the resolution process, nothing depends on the phrase, and the pinned outputs are 'size 2' / 'e1==e1b True'.

*Locations (1):* `S11 oop-domain.S11-T2-B-DEMO.preamble`

### 85. S12 · `entity-resolution` · REPLACE_PLAIN_WORDS · UPHELD

A distractor built on an acronym S12 never introduces. Replace it with a wrong option in S12's own vocabulary; the most useful one tests the separation S12 teaches, for example that the distance proves the two records are the same person. No 'ER'.

> Verifier pass 2: Verbatim at s12-apis-sql-geo.ts lines 2094-2098: the question, the four options including 'Borrar el ER score', and the explanation 'Haversine alimenta `relationship_signal_score` (el score de relación)'. correctIndex is 3, so replacing option[2] leaves the key untouched, and no active file under tests/ or scripts/ contains 'Borrar el ER' (only quarantined tool-result dumps). A distractor built on an acronym the section never introduces is the exact failure mode TEACHING_KINDS in scripts/concept_map.py was written to stop crediting, so replacing it with a wrong answer in S12's own vocabulary is right.

*Locations (1):* `S12 apis-sql-geo.selfCheck[4].opt[2]`

### 86. S13, S37 · `dict-comprehension` · TEACH_EARLIER · UPHELD

The use is needed: S37's instruction requires the construct, and S13's hint points at the form of its solution. The right place is S06 (collections), where dicts and the construct already are. At S06-T2-A.p0, or in S06-T2-A-DEMO.why, which already says 'La comprensión transforma…', give the name as 'comprensión de diccionario (dict comprehension)'. Connect it to S04's list comprehension: same reading order, but with braces and `clave: valor`. Add the filtered form with `.items()` and `if` in one sentence or a two-line example, because S13's solution uses it. Depth: a gloss plus an example, not a D3 subsection, since no S06 exercise becomes unsolvable without the name. S13 and S37 then need no change. Optionally, S37's 'un dict comprehension' (code-switching) can use the Spanish form with the English in parentheses.

> Verifier pass 2: Verified verbatim: S13-T3-B-E3 hint 'pop o dict comprehension' (s13:1658,1660) with solution `clean = {k: v for k, v in out.items() if k not in forbidden}` (:1684), and S37-T3-A-E2 instruction '2. Proyecta con un dict comprehension sobre `keep = ["id", "amt"]`.' (s37:1399) and hint (:1401) with solution `subset = {c: row[c] for c in keep}`. events.json shows the name appears in only three sections (S04, S13, S37), so 'no section from S04 to S37 teaches the name' holds, and S06-T2-A.p0 does explain the construct without naming it (`{c['id']: c for c in filas}`), with S06-T2-A-DEMO.why saying 'La comprensión transforma la lista en un mapa ID → fila'. Applying the D3 test: no S06 exercise becomes unsolvable without the name, so a gloss plus the filtered `.items()` form is the right depth rather than a subsection, and S13's hint is genuinely optional there (its instruction also allows `pop`)

*Locations (4):* `evidence-dashboard.S13-T3-B-E3.hint`, `evidence-dashboard.S13-T3-B-E3.hint[0]`, `dbt-bigquery.S37-T3-A-E2.instruction`, `dbt-bigquery.S37-T3-A-E2.hint[0]`

### 87. S13 · `embedding` · REMOVE_THROWAWAY · UPHELD

Forbids tools the learner has not met, and the positive rule (stdlib, deterministic rules) is already stated. Remove the sentence, or cut it down to 'solo reglas deterministas'. The pointer 'p. ej. S30' is also wrong for embeddings.

> Verifier pass 2: Quote verbatim at s13 line 80, and the replacement constraint is verbatim at theory[0].p4 (line 43): 'el trabajo se hace con la biblioteca estándar y las reglas deterministas de S01 a S12'. The cross-reference really is wrong — grepping all 52 active section files for 'embedding' returns S13 (1), S28 (1) and S48 (62), so S30 has none and S48 is the home. Nothing depends on the sentence. One caution for the edit: the sentence also carries 'ni ER probabilístico', which is a real constraint on S13's own method, so the cut-down variant the diagnosis offers ('solo reglas deterministas') is the safer of the two options it names.

*Locations (1):* `S13 evidence-dashboard.S13-T1-A.p3`

### 88. S13 · `entity-resolution` · GLOSS_AT_FIRST_USE · UPHELD

D1, and no hover can help (see root cause). Tagline, which is also shown in the Sidebar and Dashboard outside the section: expand and gloss ER in place (deciding whether two records are the same person). jobRelevance: attach its existing meaning ('saber si dos registros hablan de la misma persona') to the name it uses later in the paragraph. outcome[0]: gloss ER once; outcome[1] ('Evaluar ER…') and outcome[2] ('…separado del ER') can then use the acronym. Pick one Spanish name for the section and use it in the glosses and in theory[0].p1.

> Verifier pass 2: All five quotes verbatim (s13 tagline line 18, jobRelevance line 25, outcomes lines 27-29). The 'no hover can help' premise is verified three ways: InlineText renders the tagline and its own docstring says it is the inline pass 'without block parsing or glossary hints' (RichText.tsx:35-48); jobRelevance and outcomes render as plain strings (SectionView.tsx:208, 234); and annotateGlossaryTermsPlain skips any alias shorter than three characters (RichText.tsx:395), so 'ER' is never annotated anywhere in the course. D1 therefore requires the gloss in the words. The alias audit also holds — I sampled 25 of the 375 standalone 'er' matches across all 52 active files and every one is this sense.

*Locations (5):* `S13 evidence-dashboard.tagline`, `S13 evidence-dashboard.jobRelevance`, `S13 evidence-dashboard.outcome[0]`, `S13 evidence-dashboard.outcome[1]`, `S13 evidence-dashboard.outcome[2]`

### 89. S13 · `entity-resolution` · ALREADY_TAUGHT_INSTRUMENT_FN · AMENDED

**Verifier corrected to:** ALREADY_TAUGHT_INSTRUMENT_FN

Taught two blocks earlier with the naming cue 'se llama' (a PRE_CUE the detector knows), but under a name that is not an alias. Fix is glossary data (add the alias) plus one consistent name; if the section keeps both names, theory[0].p1 should say the English 'entity resolution (ER)' is the same thing so the heading does not introduce a second name.

> Verifier pass 1: No change to the heading. Do not add the rejected alias. Rename the term in theory[0].p1 to the accepted alias 'resolución de entidades' (optionally followed by '(entity resolution, ER)'). The existing PRE_CUE 'se llama' then credits it, and the name matches S11 and the glossary. glossary.missing_aliases should be [], not ['resolución de identidad'].

> Verifier pass 2: Verified: theory[0].p1 'Decidir si dos filas hablan de la misma entidad se llama **resolución de identidad**.' is at s13 line 39, the heading 'Normalización, blocking y entity resolution' at line 67 belongs to the block carrying subtopicId 'S13-T1-A' (line 75), and its first paragraph immediately ties the English name to the concept: '**Ancla:** entity resolution (ER) responde *¿es la misma entidad en dos filas?*' (line 77). So the concept is taught two blocks earlier and the name is glossed one line after the heading; the term string simply never appears at the teaching because 'resolución de identidad' is not among the aliases (`entity resolution`, `ER`, `resolución de entidades`). Two things to carry into the brief rather than treat as settled: the fix is not purely instrument — tying the two names, or settling on one, is a content edit — and the identical shape (heading, then its own

*Locations (1):* `S13 evidence-dashboard.S13-T1-A.heading`

### 90. S14 · `boolean-masking` · NO_ACTION_JUSTIFIED · UPHELD

The D1 gloss is already in place and the detector credits it. The dossier entry is stale.

*Locations (1):* `security.outcome[1]`

### 91. S14, S15, S16 · `boolean-masking` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Forms the detector misses: (a) a colon definition of the shorter noun 'máscara', which is not an alias; (b) indefinite article + term + the verb 'produce', which is not in DESCRIBING_VERB, with a code span between term and verb longer than 12 characters. The S15 and S16 uses (pandas masks) come after S14's teaching. No content change is needed.

*Locations (9):* `security.S14-T1-B.p1`, `security.S14-T3-A.p0`, `security.S14-T1-B-DEMO.description`, `security.S14-T3-A-DEMO.why`, `security.selfCheck[1].q`, `security.selfCheck[1].explanation`, `stdlib-deep.S15-T2-A-DEMO.retrospective`, `stdlib-deep.selfCheck[1].opt[3]`, `wxpython-gui.S16-T3-B-E1.preamble`

### 92. S14 · `broadcasting` · NO_ACTION_JUSTIFIED · UPHELD

The D1 gloss exists and is credited. It relies on 'shapes', which only becomes explained once shape's outcome[0] gloss lands (see shape).

*Locations (1):* `security.outcome[3]`

### 93. S14 · `broadcasting` · TEACH_SUBSECTION_D3 · AMENDED

The subsection already exists: heading, rule, worked code and a check (E3 catches an incompatible broadcast). D3 still needs two things. (a) Before the rule, one orientation sentence on what broadcasting does: the size-1 or missing axis of the smaller array is reused along the other array's axis without copying, which is why (3,2)*(2,) weights every row. (b) A figure showing that stretch for (3,2)*(2,) and for a[:, None]*b producing (4,3). D3 test: a learner who has only the right-to-left rule cannot predict why E2's `a[:, None] * b` yields (4, 3).

> Verifier pass 1: 'The effect is stated only after the exercise, in the S14-T2-B-E1 feedback' is wrong. The glossary entry for Broadcasting already reads 'Permite operar arrays de shapes distintas. NumPy "estira" el más pequeño sin copiar datos.' with firstSectionId 'security', and RichText.tsx:392-406 matches the bolded '**broadcasting**' in T2-B.p0 itself (it masks code spans, not bold), so the hover on that very paragraph states the stretch. The real gap is narrower and should be stated that way: the stretch is nowhere in the section's own prose, and there is no figure — a hover is not teaching under D3, and E1/E2 both depend on it.

*Locations (2):* `security.S14-T2-B.heading`, `security.S14-T2-B.p0`

### 94. S14 · `broadcasting` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Form missed: definite article + term + a verb not in the list ('El **broadcasting** alinea'). These uses come after T2-B and need no edit.

*Locations (4):* `security.youDo.objective[1]`, `security.selfCheck[5].q`, `security.selfCheck[5].explanation`, `security.resources.doc[1]`

### 95. S14 · `dtype` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss dtype in place, at L1: the single type shared by every element of the array (for example float64). Coordinate with shape's gloss in the same outcome so both stay short and the two ideas stay distinct.

*Locations (1):* `security.outcome[0]`

### 96. S14 · `dtype` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Forms missed: (a) an appositive with the definite article 'el' (APPOSITIVE only takes un/una); (b) a bare-noun subject + the verb 'fija' (not in DESCRIBING_VERB), followed by a parenthesis that lists code. Every other location in this group comes after theory[0].p1. No content change is needed.

*Locations (7):* `security.theory[0].p1`, `security.theory[0].callout`, `security.theory[1].p1`, `security.S14-T1-A.heading`, `security.S14-T1-A.p0`, `security.S14-T1-A.p1`, `security.S14-T1-A.code`

### 97. S14 · `missing-values` · GLOSS_AT_FIRST_USE · UPHELD

D1: outcome[5] must gloss NaN at L1 (a floating-point value that marks a missing or non-numeric measurement) and inf. theory[1].p1 is a table-of-contents line that then follows the gloss and needs no edit.

*Locations (2):* `security.outcome[5]`, `security.theory[1].p1`

### 98. S14 · `missing-values` · TEACH_SUBSECTION_D3 · UPHELD

The subsection exists, with a worked example, a demo and three exercises. Change the order so T3-B opens with what NaN is: a special float that NumPy uses to mark a missing measurement (p2's 'no es cero: es ausencia de medición'), which is not equal to itself. Then give the propagation behaviour now in p0. Add a figure (D3/D4), for example mean([1, nan, 3]) propagating NaN beside nanmean. D3 test: unless NaN ≠ NaN is taught before the exercise, E1's bug (`(x == np.nan).sum()` returns 0) can be fixed by following the instruction but not understood.

*Locations (2):* `security.S14-T3-B.heading`, `security.S14-T3-B.p0`

### 99. S14 · `missing-values` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Form missed: a negated copula followed by a copula with no article ('no es cero: es ausencia de medición'). POST_CUE needs es un/una/el/la, and NEGATED blocks the phrase anyway. All 21 locations come after T3-B.p2 in course order. No edit is needed here; how well they are taught depends on the reordering in the previous group.

*Locations (21):* `security.S14-T3-B.p2`, `security.S14-T3-B.code`, `security.iDo.intro`, `security.S14-T3-B-DEMO.preamble`, `security.S14-T3-B-DEMO.description`, `security.S14-T3-B-DEMO.code`, `security.S14-T3-B-DEMO.why`, `security.S14-T3-B-DEMO.retrospective`, `security.S14-T3-A-E3.retrospective`, `security.S14-T3-B-E1.title`, `security.S14-T3-B-E1.preamble`, `security.S14-T3-B-E1.instruction` …

### 100. S14 · `reshape` · REPLACE_PLAIN_WORDS · UPHELD

Only the comments change. They must say that the (1,1) shape comes from inserting an axis with `None`, and that E2's bug is multiplying without inserting that axis. Outputs are unchanged. Do not add a reshape explanation: that is the codex patch already rejected on 2026-09-17.

*Locations (2):* `security.S14-T2-B.code`, `security.S14-T2-B-E2.starter`

### 101. S14 · `shape` · GLOSS_AT_FIRST_USE · UPHELD

D1: the outcome must gloss 'shape' in place, at L1: the array's dimensions, meaning how many elements lie along each axis. The gloss must not fold the element type into shape. dtype is glossed separately in the same outcome (see dtype), and ndarray is also unglossed there (outside this cluster). The broadcasting gloss that 134d90ec added to outcome[3], "(alineación automática de shapes compatibles)", only makes sense once this gloss lands.

*Locations (1):* `security.outcome[0]`

### 102. S14 · `shape` · GLOSS_AT_FIRST_USE · UPHELD

The idea is taught in theory[0].p2, but the English name is never attached to it. Fix: in theory[0].p2, where 'forma' is introduced, add the attribute name `shape` in one clause. The callout, the T1-A heading and T1-A.p0 then all come after a named definition. A lighter alternative is to write 'forma' in the callout, as theory[1].p3 does. It is weaker because the learner calls `arr.shape` from T1-A onward.

*Locations (1):* `security.theory[0].callout`

### 103. S14 · `shape` · NO_ACTION_JUSTIFIED · UPHELD

A subtopic heading names what its first paragraph defines, and nothing reaches the learner in between. Instrument fix: concept_map.py should not count a theory.heading as a surprising use when a paragraph in the same theory block holds the first definition. The point is moot once the previous group lands.

*Locations (1):* `security.S14-T1-A.heading`

### 104. S14 · `vectorizaci-n` · GLOSS_AT_FIRST_USE · UPHELD

D1: the tagline is the first surface the learner reads. Gloss 'vectorizado' there as computing over the whole array at once instead of element by element in a Python loop. jobRelevance already carries that meaning in its second sentence. If the tagline gloss lands, jobRelevance needs no edit; otherwise link 'cómputo vectorizado' to 'sin un bucle explícito' within one sentence. (The hover currently shows the glossary's '50-100x' claim here; see the glossary entry.)

*Locations (2):* `security.tagline`, `security.jobRelevance`

### 105. S14 · `vectorizaci-n` · GLOSS_AT_FIRST_USE · UPHELD

Name the idea theory[0].p1 already teaches (one operation applied to the whole block at once) as 'vectorización' / 'cómputo vectorizado', in p1 or p4, before the callout. One clause, not a new paragraph: D6 question 2 says teach it where the concept is taught. theory[1].p3, T1-B.p0 and T4-A then follow a named definition.

*Locations (3):* `security.theory[0].callout`, `security.theory[1].p3`, `security.S14-T1-B.p0`

### 106. S14 · `vectorizaci-n` · NO_ACTION_JUSTIFIED · UPHELD

A heading directly followed by its defining paragraph (see the instrument fix under shape). It is moot once the previous group lands.

*Locations (1):* `security.S14-T4-A.heading`

### 107. S15 · `dataframe` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss in place, at L1: a table of columns aligned by row labels, where each column can have its own type. Coordinate with the Series gloss in the same outcome.

*Locations (1):* `stdlib-deep.outcome[0]`

### 108. S15 · `dataframe` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Form missed: the term is the predicate of 'es un' (the cue comes before the term), and the definition follows a colon. The other three locations come after it. No content change is needed.

*Locations (4):* `stdlib-deep.theory[0].p1`, `stdlib-deep.theory[1].p1`, `stdlib-deep.theory[1].p2`, `stdlib-deep.S15-T1-A.heading`

### 109. S15 · `eda` · REPLACE_PLAIN_WORDS · AMENDED

D6 question 1: S15's youDo is typed ingestion and reconciliation; no EDA happens here. The parenthetical exists to say what CP-N2-A is. The meaning that must survive: it is stage A of the Competente-level capstone, whose subject is data quality and a first exploratory look at the data before drawing conclusions. The English title adds nothing and also violates the Spanish-prose rules. Apply the same treatment to S14 youDo.portfolioNote, the true first use. Trade-off: the app catalog names the capstone 'Portafolio Ejecutivo de Calidad de Datos y EDA'. If the owner wants that official name in section prose, the alternative is to use it once at S14 with EDA glossed in place, and to make the extractor emit portfolioNote so the gloss is visible. Note the naming is already inconsistent: English in S15, Spanish in the catalog.

> Verifier pass 1: writing_rules.md D7 forbids English-*dominant* sentences and allows English inside code; an italicised English capstone title inside an otherwise Spanish sentence is not by itself a D7 breach, so 'also violates the Spanish-prose rules' overstates. The treatment stands on D6 question 1 (the parenthetical exists only to name CP-N2-A, and no EDA happens in S15's youDo) plus the catalog's own Spanish name at src/lib/capstones/catalog.ts:71, 'Portafolio Ejecutivo de Calidad de Datos y EDA' (contributing S14–S17), which the diagnosis already cites.

*Locations (1):* `stdlib-deep.youDo.context`

### 110. S15 · `groupby` · REPLACE_PLAIN_WORDS · UPHELD

T1-A.p2: the only meaning that must survive is that multi-level aggregations come later, in S17; drop the tool name. selfCheck[8].opt[3]: the distractor must stay plausible and wrong without naming an operation the learner has not met. Keep four options and correctIndex 2.

*Locations (2):* `stdlib-deep.S15-T1-A.p2`, `stdlib-deep.selfCheck[8].opt[3]`

### 111. S15 -> S17 · `merge` · MOVE_USE_LATER · AMENDED

**Verifier corrected to:** MOVE_USE_LATER

The sentence does say what merge does, so a skeptical reader could call it a gloss; it is still a forward mention because nothing in S15 has the learner call merge (LEDGER_NOTES 2026-09-17: find a use the learner acts on before asking for a definition). Move the contrast into S17-T1-A, where it becomes the bridge: in S15 Series arithmetic and concat aligned by Index; merge aligns by the key column named in `on=`. In S15 keep only the Index rule for arithmetic and `concat`.

> Verifier pass 1: Move the merge/join contrast into S17-T1-A as the bridge: arithmetic and concat along columns aligned by Index, and merge aligns by the key column named in `on=`. In S15, keep a bound with no merge in it, so the over-generalisation that a5e0948e closed does not come back. For example: 'this alignment applies when you operate on Series; the ways of joining tables you will see in S17 use columns you choose'. Also correct the kept rule: Series arithmetic and `concat(axis=1)` align by Index, while `concat` along rows stacks without aligning. Trade-off: a named forward reference goes away, and the bound becomes less concrete.

> Verifier pass 2: Quote verbatim at s15-stdlib-deep.ts line 41, and the premise checks out: grepping S15 for merge/join returns exactly three hits (line 41 and the two S15-T1-A-E3 fields in group 3), none of which the learner calls — the exercise is solved with `Series.add(..., fill_value=0)`. The cited note is real: audit/fixer/LEDGER_NOTES.md lines 300-306, dated 2026-09-17, says 'For each term, find a use the learner must *act on* before asking for a definition; if there is none, the treatment is to remove the mention.' Moving the contrast to S17-T1-A, where the learner does act on merge, satisfies that note while preserving the content. Worth stating in the brief, because the diagnosis is thin on it: the sentence is also the scope boundary on the Index rule S15 just taught, so S15 loses the 'and this is where it stops applying' clause; the replacement in S17 has to carry that bridge back ('in S15 the 

*Locations (1):* `S15 stdlib-deep.theory[0].p1`

### 112. S15 · `merge` · REMOVE_THROWAWAY · UPHELD

A limit on a tool the learner has never met; the positive constraint (a Series method that aligns by Index and fills gaps with 0) already rules it out. Remove 'no uses merge/join de tablas', ', no `merge`' and 'no es un join de DataFrames (eso llega después)'. The pinned result {'C001': 1.0, 'C002': 2.5} is unaffected.

> Verifier pass 2: Both quotes verbatim (s15 lines 811 preamble, 813 instruction). This is a prohibition on a tool the learner has not met, and the positive constraint already rules it out — the instruction's own '(método de Series, no `merge`)' is redundant with 'Suma alineando por Index y rellenando huecos con 0'. Nothing depends on the wording: the starter, solution, declared output `{'C001': 1.0, 'C002': 2.5}` and the `tests` field 'out.round(2).to_dict() == {...}' are all untouched by the deletion, and no active file under tests/ or scripts/ contains 'no uses merge' or 'join de DataFrames'.

*Locations (2):* `S15 stdlib-deep.S15-T1-A-E3.preamble`, `S15 stdlib-deep.S15-T1-A-E3.instruction`

### 113. S15 · `series` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss in place, at L1: a single column of values with labels (the Index). Keep it short and coordinated with the DataFrame gloss.

*Locations (1):* `stdlib-deep.outcome[0]`

### 114. S15 · `series` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Forms missed: a reverse copula ('es una **Series**') and a sentence-final em-dash appositive without a closing dash. The later locations come after it. No content change is needed.

*Locations (3):* `stdlib-deep.theory[0].p1`, `stdlib-deep.theory[1].p1`, `stdlib-deep.S15-T1-A.heading`

### 115. S16 · `distribuci-n-normal` · REPLACE_PLAIN_WORDS · UPHELD

D6 question 1: the distractor needs the misconception, 'the method only works if the column's values form a symmetric bell shape', not the technical name. S16 never uses the name anywhere else. Keep that misconception in plain words so the item still discriminates, and drop 'distribución normal'. This removes an S16 forward reference to an S18 concept and keeps selfcheck-vocabulary.test.mjs green, since the term is gone. It deliberately supersedes the 2026-08-25 gloss, which fixed the vocabulary but not the reason. The option becomes answerable for the right reason only when the S16 supporting block (see iqr) states that quartile fences depend only on the order of the values. Trade-off: the existing gloss already meets D1's floor. If the owner prefers to keep the name as a preview, treat this as no action; the map will then keep reporting it until S18 defines the term.

*Locations (1):* `wxpython-gui.selfCheck[3].opt[3]`

### 116. S16 · `groupby` · TEACH_SUBSECTION_D3 · AMENDED

Groupby is needed here: E2 cannot be understood without knowing that `df.groupby("cliente_id")["region"].nunique()` returns one count per client, a Series indexed by cliente_id. Teach one idiom only, in a supporting block next to S16-T2-A with no subtopicId (D6): what groupby does (splits rows into groups sharing a key value), the nunique result printed on the fixture, a figure of rows → groups → count per key, and E2 as the check. Put S16's three forms on that same idiom: replace the theory code's `transform('nunique')` and the demo's `.filter(lambda …)` with the nunique Series plus selecting the ids, keeping the declared outputs (`conflict_ids ['C002']`). Leave transform and filter to S17-T3-A, which teaches them. resources.doc[2] needs no edit. Rejected alternative: detect conflicts with S16's own tools (`drop_duplicates` on [key, attr], then `duplicated(key, keep=False)`). That removes groupby from S16 entirely and matches the cleaning-before-grouping order of McKinney's Python for Data Analysis, but it rewrites E2's starter, solution and hints. The chosen route keeps E2 intact at the cost of a preview block in S16.

> Verifier pass 1: Replacing the theory code's `transform('nunique')` with a key-indexed nunique Series collides with T2-A.p1, which is in this group's own location list and teaches the contract as '`groupby(clave)[attr].transform('nunique')>1` **por cada atributo que deba coincidir** ... combina las máscaras con `|`'. Those per-attribute masks can only be OR-ed because `transform` returns a row-aligned result; a Series indexed by cliente_id cannot be combined with `|` at row level, and the theory code then uses the mask as a row selector (`df.loc[conflict, "cliente_id"]`). So either p1's contract sentence is rewritten in the same patch — it is already in scope — or `transform` stays in the theory code and only the demo's `.filter(lambda ...)` moves. Saying 'Leave transform and filter to S17-T3-A' while leaving p1 naming transform is not a coherent end state.

*Locations (7):* `wxpython-gui.S16-T2-A.p1`, `wxpython-gui.S16-T2-A.code`, `wxpython-gui.S16-T2-A-DEMO.code`, `wxpython-gui.S16-T2-A-E2.hint`, `wxpython-gui.S16-T2-A-E2.hint[0]`, `wxpython-gui.S16-T2-A-E2.starter`, `wxpython-gui.resources.doc[2]`

### 117. S16 · `groupby` · REPLACE_PLAIN_WORDS · AMENDED

E1 is strip + title on a Series; the learner never runs groupby here. The meaning that must survive: without normalisation, ' lima ' and 'Lima' count as different regions, so any per-region count, and T2-A's conflict check, would split one region into several. Say it in those terms and drop 'buckets'. The fix is the same whichever S16-T2-A route is chosen.

> Verifier pass 1: The same sentence recurs in S16-T3-A-E1's `feedback` (s16-wxpython-gui.ts:1178): 'solo strip deja el ruido de mayúsculas para el groupby'. SectionView.tsx:653-655 renders feedback to the learner, but course_event_extractor.mts never pushes it, which is why it is absent from the dossier. It has to be rewritten with the preamble and the retrospective or the fix leaves the term in place on the surface the learner reads right after submitting.

*Locations (2):* `wxpython-gui.S16-T3-A-E1.preamble`, `wxpython-gui.S16-T3-A-E1.retrospective`

### 118. S16 · `iqr` · GLOSS_AT_FIRST_USE · UPHELD

D1: this outcome is the learner's first contact with both IQR and 'outliers' (the plural is invisible to the instrument). Gloss both in place at outcome depth: IQR as the spread of the middle half of a column's values, outlier as a value far from the rest. The same D1 gloss applies to S16 jobRelevance 'outliers con dominio', which is outside this list only because 'outliers' is not an alias.

*Locations (1):* `wxpython-gui.outcome[5]`

### 119. S16 · `iqr` · TEACH_SUBSECTION_D3 · AMENDED

One supporting theory block, shared with the outlier treatment, with no subtopicId (D6), placed immediately before the 'Outliers plausibles vs. errores' block. It must teach: quartiles as cut points of the sorted column (Q1 at 25%, the median at 50% already used for imputation in S16-T1-B, Q3 at 75%), noting that pandas `quantile` interpolates, so Q1 need not be an observed value; IQR = Q3 − Q1 as the width of the middle half; the fences Q1 − 1.5·IQR and Q3 + 1.5·IQR, named as Tukey fences so S18's 'cercas Tukey' becomes recall; and that the fences depend only on the order of the values, not on the mean, with no bell-shape assumption. That last point is exactly what selfCheck[3] opt[1], opt[2] and opt[3] test. Worked example on the existing fixture [10, 12, 11, 13, 5000, -1]: with linear interpolation Q1 = 10.25, Q3 = 12.75, IQR = 2.5, fences 6.5 and 16.5, so both 5000 and -1 fall outside and only the domain rule separates them (confirm by running; D8). Use the same names q1, q3 and iqr as the code. Add a figure (number line with the Q1–Q3 box and both fences, D4) and a check (predict which values of a short series fall outside before running). D3 test: the learner cannot diagnose E2's defect (upper fence only) from the preamble without knowing what q1 and q3 are and why the lower fence sits at q1−1.5·iqr. Today only hint[1] supplies the mask, and a hint is not teaching. E3 applies fences computed on one series to probe values. youDo acceptance item 3 ('No borres solo por IQR') and selfCheck[3] presuppose the concept. It recurs in S18 T1-A, T1-B and T3-B. Remove the untaught 'z-score' from T3-B.p0 and the E2 preamble as a throwaway.

> Verifier pass 1: selfCheck[3] has correctIndex 0, and of the three distractors only opt[2] ('Depende del promedio, así que un extremo desplaza el umbral') and opt[3] (the normality option) are answered by 'the fences depend only on the order of the values'. opt[1] ('Solo detecta valores extremos por arriba, nunca por abajo') tests the bilateral fence instead, so the block must state both fences explicitly — which E2 also drills. Second, 'only hint[1] supplies the mask' is true only of the combined boolean: the singular `hint` field (s16:1337) already gives both fence formulas in words, and hint[0] gives q1/q3/iqr; hint[1] (s16:1340) is the only place the full mask appears.

*Locations (25):* `wxpython-gui.S16-T3-B.p0`, `wxpython-gui.S16-T3-B.p1`, `wxpython-gui.S16-T3-B.p2`, `wxpython-gui.S16-T3-B.callout`, `wxpython-gui.S16-T3-B-DEMO.preamble`, `wxpython-gui.S16-T3-B-DEMO.why`, `wxpython-gui.S16-T3-B-DEMO.retrospective`, `wxpython-gui.S16-T3-B-E1.preamble`, `wxpython-gui.S16-T3-B-E1.retrospective`, `wxpython-gui.S16-T3-B-E2.title`, `wxpython-gui.S16-T3-B-E2.preamble`, `wxpython-gui.S16-T3-B-E2.instruction` …

### 120. S16 · `iqr` · IDENTIFIER_KEEP · UPHELD

`iqr` is a local variable in code the learner runs, and its outputs are pinned line by line (D8), so renaming gains nothing. It matches only because the extractor is case-insensitive and reads code. The prose must carry the meaning: the S16 supporting block uses the same q1/q3/iqr names, so each line of these snippets maps to a sentence the learner has read. Optional instrument change: ignore lowercase identifier matches of an all-caps acronym alias in code kinds.

*Locations (4):* `wxpython-gui.S16-T3-B.code`, `wxpython-gui.S16-T3-B-DEMO.code`, `wxpython-gui.S16-T3-B-E2.starter`, `wxpython-gui.S16-T3-B-E3.starter`

### 121. S16 · `iqr` · TEACH_EARLIER · AMENDED

These uses come two sections after learners already computed IQR in S16. The fix is the S16 supporting block, which makes them post-definition. Once it lands, S18-T1-A.p0 must read as recall of S16 and put the mapping before the formula (Q1 is p25, Q3 is p75, and IQR = Q3 − Q1 is the spread of the middle half), not leave it to p1 and a weDo preamble. S18-T3-B.p0's Tukey interval then recalls S16's fences. No other S18 change is needed for define-before-use.

> Verifier pass 1: The Q1=p25 / Q3=p75 mapping appears in three weDo places, not one: E2.preamble (s18:881), E2.hints[0] 'Cuartiles clásicos: 0.25 y 0.75.' (s18:886) and E2.feedback 'Q1/Q3 son p25/p75; IQR = Q3 − Q1.' (s18:892). The substantive claim survives — no theory paragraph maps them — but `feedback` is a learner-visible surface the extractor never emits, so the applier should not expect the map to register a fix written there.

*Locations (8):* `data-engineering.S18-T1-A.p0`, `data-engineering.S18-T1-A.p2`, `data-engineering.S18-T1-B.p0`, `data-engineering.S18-T1-B.p2`, `data-engineering.S18-T3-B.p0`, `data-engineering.S18-T1-A-DEMO.preamble`, `data-engineering.S18-T1-A-DEMO.why`, `data-engineering.S18-T1-A-DEMO.retrospective`

### 122. S16 · `outlier` · TEACH_SUBSECTION_D3 · UPHELD

The concept must be taught in S16, inside the same supporting block the iqr treatment requires; one block serves both. Per D6 it carries no subtopicId and sits immediately before the 'Outliers plausibles vs. errores' block. Contents (D3/D6 sequence): orientation (why a quality gate needs a data-based notion of 'far', separate from domain bounds); what a statistical outlier/valor atípico is (a value far from the bulk of that column, judged against the column's own spread); how the fences operationalise it (see iqr); a worked example, a figure and a learner check. Also say that a flag is a candidate and the domain decides, which p0 already asserts. D3 test: E2 ('Listar outliers IQR con ambos fences') and E3 ('Etiquetar error, flag u ok') ask the learner to find and label outliers. Without the concept, only hint[1], revealed after the learner is stuck, gives the mask. The concept recurs in S18 (T1-A, T1-B, T3-B) and S36. D1, not in this list because 'outliers' is not an alias: S16 jobRelevance 'outliers con dominio' and outcome[5] 'Clasificar outliers como ...' must each gloss the term in place. Throwaway in the same paragraph: 'z-score' in T3-B.p0 and 'no uses z-score aquí' in the E2 preamble are never taught before or in S16. Remove them.

*Locations (6):* `wxpython-gui.S16-T3-B.p0`, `wxpython-gui.S16-T3-B-DEMO.description`, `wxpython-gui.S16-T3-B-DEMO.why`, `wxpython-gui.S16-T3-B-DEMO.retrospective`, `wxpython-gui.S16-T3-B-E1.preamble`, `wxpython-gui.S16-T3-B-E1.retrospective`

### 123. S17 · `coverage` · HOMONYM · UPHELD

No test-coverage teaching belongs here; fix the glossary entry, which today puts the wrong test-coverage tooltip on these iDo/weDo paragraphs, because S17 is the entry's firstSectionId. Separate issue, not this concept: at first use the data sense is never put in words as a ratio ('qué fracción del maestro tiene al menos una transacción'); S17-T1-B-DEMO.why only implies it ('el stakeholder no sabe a quién le faltan datos'). If the owner wants this sense hovered, it needs its own glossary entry (homonym option 2).

> Verifier pass 2: All three quoted fragments verbatim, and I read the other four locations in the group: S17-T1-A-E1.retrospective ('El KPI de cobertura del maestro se rompe si empiezas con inner'), S17-T1-B-E1.retrospective ('creer que “no hay huecos” de cobertura'), S17-T1-B-E3.preamble ('un entero de cobertura, no la lista cruda de ids') and S17-T1-B-DEMO.retrospective ('unos son cobertura del maestro, el otro es cardinalidad rota') are all the left-join match-coverage sense. Distinct from the glossary's test-coverage sense. The live-tooltip harm is real: termsAvailableAt includes a term when its firstSectionId index is <= the current section, coverage's firstSectionId is 'packaging' which is S17 itself, and RichText is passed sectionId for theory, iDo and weDo prose — so these paragraphs render with 'Porcentaje de líneas de código cubiertas por tests.' The separate note that the data sense is never st

*Locations (7):* `packaging.S17-T1-B-DEMO.preamble`, `packaging.S17-T1-B-DEMO.why`, `packaging.S17-T1-B-DEMO.retrospective`, `packaging.S17-T1-A-E1.retrospective`, `packaging.S17-T1-B-E1.retrospective`, `packaging.S17-T1-B-E3.preamble`, `packaging.S17-T1-B-E3.retrospective`

### 124. S17 · `groupby` · TEACH_EARLIER · UPHELD

Teach it earlier, in S16-T2-A (the TEACH_SUBSECTION_D3 group above). Once that block lands, these uses come a section later and need no S17 edit. Fallback if S16 instead removes groupby: jobRelevance and outcome[4] need D1 glosses, and the callout, theory[1].p1 and the figure caption need either 'groupby' named at theory[0].p3 (which teaches 'Agrupar' in plain Spanish) or the plain verb.

*Locations (5):* `packaging.jobRelevance`, `packaging.outcome[4]`, `packaging.theory[0].callout`, `packaging.theory[1].p1`, `packaging.S17-T2-A.figure`

### 125. S17 · `groupby` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Form missed: code-span subjects joined by '+', the verb 'colapsa' (not in DESCRIBING_VERB), no article. The credited T3-A.p1 match is a false positive. Depth note: p0 says what groupby + agg produce, not what groupby itself does. If the S16 block does not land, add that clause at the start of p0.

*Locations (2):* `packaging.S17-T3-A.heading`, `packaging.S17-T3-A.p0`

### 126. S17 · `merge` · GLOSS_AT_FIRST_USE · UPHELD

D1. jobRelevance and outcomes render as plain text with no hover (SectionView.tsx lines 208 and 234), so the gloss has to be in the words. jobRelevance: at 'merge', say it joins two tables row by row through a shared key column; the next sentence's 'unir tablas con claves' carries the meaning but is not attached to the word. outcome[0]: gloss 'join' in place (combining the rows of two tables that share a key value); '(merge)' only names the pandas method.

> Verifier pass 2: Both quotes verbatim (s17 jobRelevance line 25, outcome[0] line 27), and the rendering claim is exactly right: SectionView.tsx renders jobRelevance as the bare string `{section.jobRelevance}` (line 208) and each outcome as `{lo.text}` (line 234) — neither goes through RichText, so no hover can reach them and D1 forces the gloss into the words. On the GLOSS-versus-D3 test: S17's later exercises are indeed unsolvable without merge, but D3's remedy is a subtopic with orientation, a worked example, a figure and a check, and S17 already has it — S17-T1-A teaches merge with the cli/tx example printing '2 3 3', S17-T1-B adds the S17-join-fanout figure and validate/indicator, and S17-T1-A-E1..E3 exercise it. The residual defect is only that the preview surfaces name the term ahead of that subtopic, which is a D1 gloss, not a second subsection.

*Locations (2):* `S17 packaging.jobRelevance`, `S17 packaging.outcome[0]`

### 127. S17 · `merge` · REPLACE_PLAIN_WORDS · AMENDED

Use the Spanish 'unir' / 'la unión' that theory[0] teaches; the English method name arrives at S17-T1-A.p0. The callout's content duplicates S17-T1-A.p1 ('**antes del merge** verifica dtype alineado… unicidad de la clave en el lado 1'), so deleting the callout is an acceptable alternative with no loss.

> Verifier pass 1: Rephrase only, and keep the content. In theory[2]'s callout use the 'unión' that theory[0] already teaches, and keep the causal sentence: a join between a str key and an int key produces false orphans, and a master with duplicate ids invalidates the 1:1 assumption. Deleting the callout is NOT a no-loss alternative — 'Un join str↔int produce huérfanos falsos' appears nowhere else in S17. If the callout is dropped, that clause has to move into S17-T1-A.p1, which today states the dtype check without its consequence.

> Verifier pass 2: The title and content quotes are verbatim, and theory[0].p0 teaches 'unión'. The content really does duplicate S17-T1-A.p1, and no test depends on it (the only hit is an audit output JSON). One minor error: theory[2] is one block before S17-T1-A (theory[3]), not two.

*Locations (1):* `S17 packaging.theory[2].callout`

### 128. S17 · `merge` · ALREADY_TAUGHT_INSTRUMENT_FN · AMENDED

**Verifier corrected to:** ALREADY_TAUGHT_INSTRUMENT_FN

p0 is the definition; p1 follows it. Form missed: a code-span subject with no article, coordinated by a slash, then the describing verb 'combina'. DESCRIBING_VERB is only tried after un/una and within 12 characters ('`/`join` combina' is 15). The credited S17-T1-A.p2 is a false positive: PAREN_GLOSS reads 'left-merge con `tx` (dos filas C001 y una C003 huérfana de maestro)' as a gloss of merge. No content change.

> Verifier pass 1: p0 is the definition and p1 follows it; no content change. The form the detector misses is a code-span subject with no indefinite article, at the start of a paragraph. DESCRIBING_VERB already matches ('`/`join` combina' puts the verb 9 characters after the term), and the only failing condition is INDEFINITE_BEFORE. Instrument fix: also accept a term that opens the paragraph or sentence as the subject before a describing verb. The S17-T1-A.p2 credit is a PAREN_GLOSS false positive on a parenthetical that glosses `tx`.

> Verifier pass 2: p0 is the definition; p1 follows it. Form missed: a code-span subject with no article, coordinated by a slash, then the describing verb 'combina'. DESCRIBING_VERB's own 12-character window is not the obstacle — '`/`join` ' is nine characters — the obstacle is that the describing-verb path is only tried when INDEFINITE_BEFORE matches un/una/unos/unas immediately before the term, and '`merge`' has no article. Instrument fix: allow a code-span or bolded subject to stand in for the indefinite article on that path. The credited S17-T1-A.p2 remains a PAREN_GLOSS false positive. No content change.

*Locations (2):* `S17 packaging.S17-T1-A.p0`, `S17 packaging.S17-T1-A.p1`

### 129. S17 · `pivot-table` · NO_ACTION_JUSTIFIED · UPHELD

A heading directly followed by its defining paragraph, with the operation itself taught even earlier. See the instrument fix under shape.

*Locations (1):* `packaging.S17-T2-A.heading`

### 130. S17 · `pivot-table` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Forms missed: a code-span subject, the verb 'hacen', and arrow notation as the definition. The figure, T2-B prose and T2-B code all come after it, backed by the melt_pivot.py worked example. No content change is needed.

*Locations (5):* `packaging.S17-T2-A.p0`, `packaging.S17-T2-A.figure`, `packaging.S17-T2-B.p0`, `packaging.S17-T2-B.p2`, `packaging.S17-T2-B.code`

### 131. S17 · `resample` · REMOVE_THROWAWAY · UPHELD

Remove the resample clause. The only fact worth keeping is that a time-based rolling window, such as the '7d' named in T3-B.p1, needs the dates as the index (the code does `set_index("fecha")`). If kept, it should be attached to rolling, not to resample.

*Locations (1):* `packaging.S17-T3-B.p0`

### 132. S17 · `reshape` · HOMONYM · UPHELD

jobRelevance is a preview shown before any theory, so D1 applies. Gloss 'reshape long/wide' in place as moving a table between one row per period and one column per period, or say it in Spanish. Two unaudited surfaces carry the same unglossed anglicism: the section title ('Joins, reshape, groupby y cierre analítico') and outcome[2] ('Reshapear tablas con concat, melt y pivot_table').

*Locations (1):* `packaging.jobRelevance`

### 133. S17 · `reshape` · HOMONYM · UPHELD

All six uses come after theory[0].p2, which teaches the operation, but the English word is never attached to it. Attach 'reshape' once in theory[0].p2 at the sentence saying that switching between long and wide is routine. The pandas user guide calls this chapter 'Reshaping' and S17's resources link to it, so the word is worth keeping. The six uses then need no edit, and the youDo rubric and requirement strings are not pinned by any test. Acceptable alternative: replace the word with Spanish throughout (writing rule D7). The cost is that the learner meets 'reshaping' unexplained in the linked pandas docs.

*Locations (6):* `packaging.S17-T2-A-DEMO.retrospective`, `packaging.S17-T1-B-E3.retrospective`, `packaging.youDo.context`, `packaging.youDo.objective[2]`, `packaging.youDo.requirement[2]`, `packaging.youDo.rubric[1]`

### 134. S18 · `correlaci-n` · GLOSS_AT_FIRST_USE · UPHELD

D1: jobRelevance and outcome[4] each need a short in-place gloss of the statistical meaning: a number that measures how strongly two variables move together, which says nothing about one causing the other. This matters more than usual because the learner's only prior meeting with 'correlación' is S09's logging sense. For the callout, name the concept in theory[0].p3, which already explains 'asociación observada'. One clause is enough: the usual measure of such an association is the correlation, which T3-A teaches to compute and read. That also makes the T3-A heading post-definition. Depth: gloss only; the concept already has its own subsection (S18-T3-A).

*Locations (3):* `data-engineering.jobRelevance`, `data-engineering.outcome[4]`, `data-engineering.theory[0].callout`

### 135. S18 · `correlaci-n` · NO_ACTION_JUSTIFIED · UPHELD

A subtopic heading that names the concept, followed directly by its defining sentence, is orientation, not surprise. After the theory[0].p3 naming (previous group) it is post-definition anyway. Instrument fix: count a theory.heading as covered when its own block's first paragraph defines the term. Ten concepts currently show this exact pattern. Warning for the applier: 'data-engineering.S18-T3-A.heading' also names the p-value block heading at line 344.

*Locations (1):* `data-engineering.S18-T3-A.heading`

### 136. S18, S19, S35 · `correlaci-n` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Instrument: accept a definite article when the term is bolded at the start of a sentence, which is the course's marker for introducing a term. Also add mide/miden, resume/resumen and captura/capturan to DESCRIBING_VERB. Prove it with a negated or anaphoric negative fixture, for example a definite-article sentence that only refers back, so it cannot start crediting mere uses. Content depth, separate from define-before-use: T3-A.p0 never states the coefficient's scale (r between −1 and 1, sign as direction, near 0 meaning no linear association). T3-A-DEMO.preamble ('Un r de 0.97'), E1 ('r 0.934') and selfCheck[1] ('Una correlación alta') all presuppose it. One sentence in T3-A.p0 covers it; no new subsection is needed.

*Locations (14):* `data-engineering.S18-T3-A.p0`, `data-engineering.S18-T3-A.code`, `data-engineering.S18-T3-A.callout`, `data-engineering.iDo.intro`, `data-engineering.S18-T3-A-DEMO.description`, `data-engineering.youDo.objective[3]`, `data-engineering.selfCheck[1].q`, `data-engineering.selfCheck[1].explanation`, `data-engineering.selfCheck[4].opt[2]`, `data-engineering.selfCheck[4].explanation`, `databases-orm.S19-T1-B-E3.preamble`, `system-design.S35-T1-B.heading` …

### 137. S18–S21 · `coverage` · HOMONYM · UPHELD

No content change for this concept. Identifiers and printed strings (`cobertura`, 'cobertura web', the S20 cell text) stay. The harm is the tooltip: prose such as S18-T2-A.p2 renders with the test-coverage definition, so fix the glossary. A terminology note for the S18 round, not decided here: in survey methodology, coverage error means the sampling frame does not match the population. S18's LIMITADA flag is computed from sample-composition bias against quotas, closer to representativeness, so a statistics reviewer may question the label.

> Verifier pass 2: All five quoted fragments verbatim, including the two code strings. I spot-checked across all four sections and every location fits the stated sense: S18 ('Límite de cobertura' in theory[1].p2, S18-T4-A.p1, youDo.rubric[0]; 'cobertura LIMITADA' computed from share bias in the DEMO code), S19 ('El lenguaje no debe exceder la cobertura de la muestra'), S20 (the report cell 'Cobertura: Lima|Madrid|Bogota') and S21 ('cobertura web-only', 'cobertura solo web', 'límites de cobertura'). None is test coverage. Keeping identifiers and printed strings and fixing the glossary instead is the right call, since the harm is the tooltip rather than the prose. The survey-methodology caveat about the LIMITADA flag measuring sample-composition bias rather than frame coverage error is correct and correctly deferred to the S18 round.

*Locations (33):* `data-engineering.jobRelevance`, `data-engineering.theory[1].p2`, `data-engineering.S18-T2-A.p2`, `data-engineering.S18-T4-A.p1`, `data-engineering.S18-T4-A.callout`, `data-engineering.S18-T2-A-DEMO.preamble`, `data-engineering.S18-T2-A-DEMO.code`, `data-engineering.S18-T2-A-DEMO.why`, `data-engineering.S18-T4-A-DEMO.why`, `data-engineering.S18-T2-A-E1.retrospective`, `data-engineering.S18-T2-A-E3.title`, `data-engineering.S18-T2-A-E3.preamble` …

### 138. S18 · `distribuci-n-normal` · GLOSS_AT_FIRST_USE · UPHELD

The concept is needed here: S18 is the statistics section, and the warning is reused in T1-A-DEMO.why, T1-A-E2.retrospective, T2-B.p1 and youDo.requirement[6]. This is the right place, since T1-A is where shape is first discussed. Gloss in place: what the distribution is (symmetric, bell-shaped, mean and median coincide, values thin out evenly on both sides, most within about one to two standard deviations of the mean), and why computing mean and std does not make data normal (the synthetic ticket amounts are right-skewed, like the 120 in T1-A.p2). D3 is not met: no S18 exercise computes or tests normality, and requirement[6] can be satisfied from the starter's checkpoint note. Follow-on in T2-B.p1, outside the instrument: connect 'aproximación z' to that bell shape and say in plain words what 'lognormal' means (skewed amounts whose logarithm is roughly bell-shaped), or the requirement gets recited, not understood. A bell-vs-skewed histogram with mean and median marked is a natural D4 figure.

*Locations (1):* `data-engineering.S18-T1-A.p1`

### 139. S18, S28 · `generator` · HOMONYM · AMENDED

**Verifier corrected to:** HOMONYM

No change for the Python-generator concept; the fix is in the glossary: drop the 'Generator'/'generador' aliases. Until then, the why and both hints show a yield tooltip on a PRNG. One content fix works under any Q3 route: in S18-T2-B-E3.hint[1], `Generator` is NumPy's class name and should be backticked as an identifier, which also stops the hover. The PRNG sense has no glossary entry, so nobody measures whether it is defined before use: `np.random.default_rng(42)` first appears in S14 security code and `random.seed` in S13. That belongs to the audit of that concept, not this one.

> Verifier pass 1: No change for the Python-generator concept. In src/lib/glossary/terms.ts, drop the 'Generator'/'generador' aliases and also change the `term` string, for example to a Spanish name such as 'Generador (función con yield)'. The extractor, glossary_coverage_audit and glossary_intro_audit all match the term string, so otherwise S18-T2-B-E3.hint[1] and data-engineering.resources.doc[7] stay counted. Backticking `Generator` in S18-T2-B-E3.hint[1] is still correct formatting and stops the hover, but it does not affect the measurement. S28-T1-A-E1.feedback is the same PRNG sense and gets the yield tooltip today; the alias removal fixes it.

> Verifier pass 2: All five quotes verbatim (s18:824, s18:1306, s18:2083 label, s28:677, s28:776). Senses verified from the code, not the prose: S18-T2-B-E3's starter is `rng = np.random.default_rng(42)` (s18:1320) so 'Generator' there is numpy.random.Generator, and S28-T1-A-E1's instruction is 'Llama `random.seed(0)` otra vez antes de `b`' so its 'generador' is the stdlib PRNG state — neither is a `yield` generator. hint[1] index confirmed against the extracted event stream. The backticking remedy is sound: my replication of the RichText matcher shows the tooltip currently fires on S18-T4-B-DEMO.why, S18-T2-B-E3.hint[1] and S28-T1-A-E1.hint[1], and that wrapping `Generator` in backticks suppresses it, while S28-T1-A-E3.starter (code) and the S18 resource never had one. 'first appears in S14' checked: `np.random.default_rng` first occurs at s14-security.ts:581 and `random.seed` at s13-evidence-dashboard.ts

*Locations (5):* `data-engineering.S18-T4-B-DEMO.why`, `data-engineering.S18-T2-B-E3.hint[1]`, `data-engineering.resources.doc[7]`, `llm-agents.S28-T1-A-E1.hint[1]`, `llm-agents.S28-T1-A-E3.starter`

### 140. S18 · `iqr` · IDENTIFIER_KEEP · UPHELD

The printed labels, dict keys and variable names are compared line by line under D8, so keep them. The surrounding prose (T1-A.p0, T1-A.p2, T3-B.p0) carries the meaning once it is recall of S16.

*Locations (4):* `data-engineering.S18-T1-A.code`, `data-engineering.S18-T3-B.code`, `data-engineering.S18-T1-A-DEMO.code`, `data-engineering.S18-T3-B-DEMO.code`

### 141. S18 · `p-value` · NO_ACTION_JUSTIFIED · UPHELD

The heading announces the topic, and the next sentence defines it with a copula, with nothing in between. A skeptical reviewer would not call that a surprise. Instrument fix: treat a theory.heading and its own block's first paragraph as one unit. Structural fix, in the D6 spirit, not required for this concept: drop the duplicated subtopicId from the supporting blocks, or key extractor locations by block index. Until then, the applier must address this text by heading or line (s18 line 344), not by location string. Minor and outside the alias: S18-T2-B.p2 quotes '“significativo”' before this block explains significance.

*Locations (1):* `data-engineering.S18-T3-A.heading`

### 142. S22 · `apply` · HOMONYM · UPHELD

S22-T4-A's paragraphs teach the transitions and the code shows the function, so nothing is untaught. Identifiers and output stay. Writing fix: prose that names the function without backticks (S22-T4-A-DEMO.retrospective 'apply con actor en el log', S22-T4-A-E3.hint 'apply + log con actor', E3 title) should backtick `apply` so it reads as the function name.

> Verifier pass 2: Verbatim in s22-rapidfuzz-entity.ts: `def apply(state, action, actor, log):` with `nxt = TRANSITIONS.get(state, {}).get(action)` at lines 394-395, S22-T4-A.p1's TRANSITIONS contract at line 379, and youDo.starter '# Completa: state = apply(state, "submit", "analyst", audit)' at line 1970. A state-machine transition is a genuinely different sense. The fix list is accurate down to which occurrences need backticks: S22-T4-A-DEMO.retrospective (line 724) and S22-T4-A-E3.hint (line 1660) and the E3 title (line 1655) are unbackticked, while S22-T4-A-E2.retrospective (line 1622) already writes '`apply`' and is correctly left out.

*Locations (9):* `S22 rapidfuzz-entity.S22-T4-A.code`, `S22 rapidfuzz-entity.S22-T4-A-DEMO.retrospective`, `S22 rapidfuzz-entity.S22-T4-A-E2.retrospective`, `S22 rapidfuzz-entity.S22-T4-A-E3.title`, `S22 rapidfuzz-entity.S22-T4-A-E3.preamble`, `S22 rapidfuzz-entity.S22-T4-A-E3.instruction`, `S22 rapidfuzz-entity.S22-T4-A-E3.hint`, `S22 rapidfuzz-entity.S22-T4-A-E3.starter`, `S22 rapidfuzz-entity.youDo.starter`

### 143. S24 · `coverage` · HOMONYM · UPHELD

S24 teaches its own sense properly in p1, with a formula and 'mide qué fracción', right after the heading; no content change. Drop the S24-T4-A-E3 credit for the test-coverage concept. That exposes the latent uses in S27 (outcome[6] needs a D1 gloss; theory[1].p1 precedes S27-T4-A.p0), which the S27 round must handle.

> Verifier pass 2: Both quotes verbatim. S24 does teach its own sense properly: S24-T4-A.heading is display_order 10324 and p1 at 10326 gives the formula and the words 'mide qué fracción de documentos pasa sin HITL', so the heading is only two events ahead of its own definition. The credited first definition at S24-T4-A-E3.preamble (display_order 10601) is doubly wrong exactly as claimed — it is the automation sense, and POST_CUE fires on 'es un' 29 characters after 'coverage' in a sentence that predicates ('coverage alta … es un dashboard verde mentiroso') rather than defines. Dropping it does expose the S27 uses: outcome[6] at 11569 and theory[1].p1 at 11580 both precede the real teaching at S27-T4-A.p0 (11621), which is credited and which does define branch coverage against line coverage.

*Locations (6):* `rpa-advanced.S24-T4-A.heading`, `rpa-advanced.S24-T4-A.p1`, `rpa-advanced.S24-T4-A.p2`, `rpa-advanced.S24-T4-A.callout`, `rpa-advanced.S24-T4-A-DEMO.preamble`, `rpa-advanced.S24-T4-A-DEMO.retrospective`

### 144. S24 · `generator` · REMOVE_THROWAWAY · AMENDED

**Verifier corrected to:** REMOVE_THROWAWAY

A stale English fragment in a field that is never rendered. WeDoStep.hint is typed as required ('always present for backward compatibility'), so do not delete it. Set it to hints[0], which is what most exercises do. Instrument: course_event_extractor.mts pushes `hint` even when `hints` is non-empty, but SectionView.tsx renders `hint` only when `hints` is empty (`step.hints && step.hints.length > 0 ? ... : <RichText content={step.hint} />`). All 1,248 single-hint events in .fixer/events.json are shadowed this way; 610 differ from hints[0], and 91 add concept mentions that no rendered text contains.

> Verifier pass 1: Set S24-T4-A-E2.hint to hints[0]; do not delete it, because the field is required. Instrument: the extractor pushes `hint` even when `hints` is non-empty. That covers 1,248 shadowed hint fields; 610 differ from hints[0], and 91 add a concept mention that the step's rendered hints lack. Only 6 add a mention found in no learner-visible extracted text of the section: S16-T4-A-E1, S19-T3-A-E1, S24-T4-A-E2, S30-T3-B-E3, S31-T2-A-E1 and S31-T2-A-E2.

> Verifier pass 2: Verbatim at s24-rpa-advanced.ts:1408 (`hint: "sum generator"`), :1409-1413 (the three hints, word for word) and :1431-1432 (the hidden solution `print(sum(1 for r in rows if r['ruc_pred']==r['ruc_true'])/len(rows))`); the exercise id is S24-T4-A-E2 (s24:1399). REMOVE test passes: the field is never rendered (SectionView.tsx:579), nothing in tests/ or scripts/ references it, and no exercise, printed output ('0.5') or selfCheck needs the words. The typing claim is exact — src/lib/types.ts:93-94 is `/** Primary hint (always present for backward compatibility) */ hint: string`. I reproduced all three counts from the current source: 1,248 `.hint` events shadowed by a non-empty `hints`, 610 of them differing from hints[0], and exactly 91 that carry a concept mention none of the rendered `hints` carry.

*Locations (1):* `rpa-advanced.S24-T4-A-E2.hint`

### 145. S25, S48 · `generator` · HOMONYM · UPHELD

No change for the Python concept. S48-T3-B.p0 renders through RichText and gets the yield tooltip today; the tagline, the self-check question and the callout use InlineText, so they get no tooltip. Two secondary findings belong to whoever owns the LLM/RAG concept, not this cluster. First, S25 theory never calls the component 'generador'; it says "El borrador narrativo del informe devuelve `{hallazgo, n, mediana, evidence_ids, model}`". The self-check therefore names the component differently from the lesson (rule A5). Second, S48 says 'el generador' without saying it is the model that writes the answer; the RAG gloss in jobRelevance implies this but does not name it.

> Verifier pass 2: All four quotes verbatim (s25:18 tagline, s25:1884 selfCheck[1].q, s48:274 p0, s48:294 callout) and the indices match the extracted locations. Senses differ: S48's jobRelevance (s48:25) glosses RAG as 'recupera fragmentos permitidos y responde basándose en ellos', so 'el generador' is the answering model, not a `yield` generator. The rendering split is exactly right and I reproduced it end to end: theory paragraphs go through RichText (SectionView.tsx:407) while the tagline (:243), self-check questions (:884) and theory callouts (TheoryBlockView / SectionView.tsx:428) go through InlineText — only S48-T3-B.p0 gets the tooltip. The S25 naming mismatch is real: s25:59 calls the component 'El borrador narrativo del informe', never 'generador'.

*Locations (4):* `streamlit-dashboards.tagline`, `streamlit-dashboards.selfCheck[1].q`, `ai-governance.S48-T3-B.p0`, `ai-governance.S48-T3-B.callout`

### 146. S25 · `llm` · GLOSS_AT_FIRST_USE · UPHELD

D1: outcomes have no hover. Gloss in place with what an LLM does, not only the expansion: a large language model that generates text from an instruction. Once this gloss exists it precedes, and so covers, the unaliased 'modelo de lenguaje' in theory[0].p0.

> Verifier pass 2: Quote verbatim at s25-streamlit-dashboards.ts line 27; outcomes have no hover (SectionView.tsx:234). The under-reporting claim is verifiable and true: theory[0].p0 (line 40) writes 'pegar el contenido en un modelo de lenguaje', and the alias list holds only the long form 'modelo de lenguaje grande', so that use is invisible to both the map and the hover. The GLOSS call is right rather than D3 — S25-T1-A is the subtopic that teaches the choice, and its p0 expands and bounds the term. Ordering also holds: the extractor pushes outcomes before theory (course_event_extractor.mts:194), so a gloss at outcome[0] precedes and covers the unaliased use.

*Locations (1):* `S25 streamlit-dashboards.outcome[0]`

### 147. S25 · `llm` · NO_ACTION_JUSTIFIED · UPHELD

A subtopic heading that names the choice its own first paragraph explains; heading and gloss are read together, and a gloss inside a heading would duplicate p0. It also stops counting as surprising once outcome[0] carries its D1 gloss, because outcome is a teaching kind that comes earlier.

> Verifier pass 2: Both quotes verbatim: the heading at s25 line 64 and S25-T1-A.p0's '**LLM** (modelo de lenguaje grande, *large language model*) aporta lenguaje…'. A subtopic heading read together with its own first paragraph is not an unexplained first encounter, and the second half of the claim is mechanically true: outcomes are pushed before theory, and a parenthetical gloss at outcome[0] would fire PAREN_GLOSS, so once that gloss exists the heading stops being counted at all. No action is the right call.

*Locations (1):* `S25 streamlit-dashboards.S25-T1-A.heading`

### 148. S27 · `pytest` · GLOSS_AT_FIRST_USE · UPHELD

These are D1 preview surfaces, each read separately (tagline on the dashboard and sidebar, jobRelevance in a popover, outcomes in a sheet, none with hovers). Each needs a few words: the Python tool that finds and runs tests. If the S10 gloss lands, D1's wording ('not met in an earlier section') is technically satisfied, but that meeting would be one weDo preamble 17 sections earlier, in a section about packaging. One clause per surface is the cheaper side of that trade-off.

> Verifier pass 2: All three quotes verbatim, at display_order 11561, 11562 and 11565 — ahead of every theory mention in S27. The D1 case is sound and the surface claims check out at the source: the tagline goes through InlineText (no hovers) and is clamped by line-clamp-1 in SectionView and line-clamp-2 on the Dashboard card; jobRelevance is a bare string in a Popover; learningOutcomes render `{lo.text}` in a Sheet with no renderer. D1 is explicit that these three surfaces are not exempt. The stated trade-off — that the S10 gloss would technically satisfy D1's 'not met in an earlier section' while being one weDo preamble seventeen sections back in a packaging section — is named rather than absorbed.

*Locations (3):* `async-concurrency.tagline`, `async-concurrency.jobRelevance`, `async-concurrency.outcome[2]`

### 149. S27 · `pytest` · TEACH_SUBSECTION_D3 · AMENDED

**Verifier corrected to:** TEACH_IN_PLACE at the opening of S27-T2-A (explicit instruction on the runner itself, no new subtopic)

The section's work depends on pytest; it is in the title. A learner who does not know it is a separately installed runner cannot meet youDo.requirement[3]. Placement: in theory[0], which already explains what a test is, one sentence naming pytest as the tool that runs those tests, so the roadmap in theory[1].p1 is not the first theory mention. Then open S27-T2-A with the D3 sequence: what it is and why it exists, compared with calling test functions by hand as the lab does; installing it into `.venv` with `python -m pip install pytest`; a worked run of the existing S27-T2-A.code file showing real terminal output, one pass and one failure with node id and assert diff; a figure of files → `test_*` functions → run → report; guided practice (S27-T2-A-E1 already exists) and a check. Keep the in-browser modelling explicitly labelled as a stand-in. Also remove the two false-positive credits so the map reports this honestly.

> Verifier pass 1: load_bearing_exercise: none. youDo.requirement[3] and youDo.context both offer an assert-module route. Justify it as the section's subject plus recurrence (S28/S30/S37). In theory[0], add one sentence naming pytest as the third-party tool that finds and runs those tests. Open S27-T2-A.p0 with: what pytest is and why it replaces calling test functions by hand; `python -m pip install pytest` inside `.venv`; one real run of the existing T2-A.code file with terminal output showing a pass and a failure (node id plus assert diff); and keep the in-browser modelling labelled as a stand-in. Reuse E1–E3 and selfCheck[4] as the practice and the check; a figure is optional, not required. Remove the false credits at S27-T2-A.p1 (POST_CUE on 'es una') and youDo.context (PAREN_GLOSS on the aside).

> Verifier pass 2: Keep TEACH_SUBSECTION_D3, but ground it on D6 rather than on an unsolvable exercise. The honest statement is: (a) pytest is the section's own subject — title 'Estrategia de pruebas con pytest', shortTitle 'Pytest y contratos', subtopic heading 'Discovery y assertions de pytest', youDo titled 'Contratos pytest de normalización y matching'; (b) D6's 'A vital working concept gets instruction, not a gloss' applies, since the learner must use the concept to do the section's work; (c) the assessment already depends on pytest specifics the course never grounds — selfCheck asks '¿Cuál es el alcance predeterminado de un fixture de pytest…?' — while the section never says what pytest is, that it is installed with pip, or how it is run. Drop the claim that a learner 'cannot meet youDo.requirement[3]': that requirement offers 'o el módulo de asserts del starter', and S27-T2-A-E1 is a startswith filt

*Locations (3):* `async-concurrency.theory[1].p1`, `async-concurrency.S27-T2-A.heading`, `async-concurrency.S27-T2-A.p0`

### 150. S28 · `embedding` · REPLACE_PLAIN_WORDS · UPHELD

Keep the rule: when a comparator is asymmetric on purpose, name the exception in the test. Replace the parenthetical examples, which the learner has met neither of, with one they can read from S07's token sets: a score measuring how much of `a` is contained in `b`, which changes when the arguments swap.

> Verifier pass 2: Quote verbatim at s28-llm-agents.ts line 121. The rule being taught is comparator symmetry, and the parenthetical examples are the only 'embedding' in the whole section (grep count: 1), so nothing depends on them — S28's own symmetry exercise (line 901, 'Simetría all-pairs de eq casefold') uses casefold equality, not vectors. Substituting a containment score over S07 token sets keeps the rule and uses material the learner has met.

*Locations (1):* `S28 llm-agents.S28-T1-B.p1`

### 151. S32 · `apply` · HOMONYM · AMENDED

**Verifier corrected to:** HOMONYM

The operation is taught in Spanish one paragraph earlier ('Aplicar la mediana de train'); the English noun 'apply' is code-switching. Writing fix: say 'aplicar la mediana' as p0 does, in p1, the demo description and S32-T3-B-DEMO.why; that also removes the false definition credit on 'Apply de mediana de train es el mismo'. `apply_median` in code stays.

> Verifier pass 1: This is the transform step: reuse the train-time median at serve time. In the same change, replace the English noun 'apply' with 'aplicar la mediana' / 'aplicación de la mediana' in every S32 prose use: S32-T3-B.p1, S32-T3-B-DEMO.description, .why and .retrospective, S32-T3-B-E1.preamble and .retrospective, S32-T3-B-E2.title, .preamble, .instruction and .retrospective, S32-T3-B-E3.preamble and .retrospective, and youDo.objective[1]. `apply_median` and code comments can stay. If the glossary entry is not removed at the same time, rewording DEMO.why alone surfaces those uses and the S45/S46 homonyms as new surprising uses.

> Verifier pass 2: Say 'aplicar la mediana' as S32-T3-B.p0 does, in p1, S32-T3-B-DEMO.description and S32-T3-B-DEMO.why — and in the same edit in S32-T3-B-E2's title, preamble and instruction, which carry the identical code-switch and become surprising uses the moment the false 'es el mismo' credit disappears. `apply_median` in code stays; the declared outputs are untouched.

*Locations (2):* `S32 microservices.S32-T3-B.p1`, `S32 microservices.S32-T3-B-DEMO.description`

### 152. S32 · `joblib` · REPLACE_PLAIN_WORDS · UPHELD

D6 question 1: throwaway. Nothing in S32 has the learner use either library. The plain meaning to keep: in production this fitted state is usually saved in a binary format that Python loads back directly, while here JSON keeps the contract readable. Do not keep the claim that they 'cumplen el mismo rol'. Those formats serialise the fitted Python object, not only its statistics, and loading them can run arbitrary code: the Python pickle documentation and joblib.load's documentation both warn never to load untrusted files. A security reviewer would reject treating them as equivalent to readable JSON. If the owner prefers to keep the names as job vocabulary, the alternative is GLOSS_AT_FIRST_USE for both joblib and pickle, including that caveat.

> Verifier pass 2: Quote verbatim, and it is the only occurrence of either library in the active course: 'joblib' appears once in src/lib/course/sections/s32-microservices.ts (line 306) and in no other active section, and 'pickle' first appears in that same sentence (next occurrence is S38). Nothing in S32 has the learner use either, and neither name appears anywhere under tests/ or scripts/, so D6 question 1 (throwaway) applies cleanly. The legacy provenance checks out: s09-sklearn.ts carries 'Model persistence con joblib' at line 336 and s11-advanced-topics.ts 'Joblib para scikit-learn' at line 477, and neither file is imported by src/lib/course/index.ts. The security objection is well founded — joblib and pickle serialise the fitted object and loading an untrusted file can execute arbitrary code, so 'cumplen el mismo rol que este JSON' is not a claim to preserve. Offering GLOSS_AT_FIRST_USE for both nam

*Locations (1):* `microservices.S32-T3-B.p0`

### 153. S32 · `mlops` · REPLACE_PLAIN_WORDS · UPHELD

The learner never acts on MLOps in S32, so no gloss. Plain meaning that must survive: the REQUEST_* / REJECT_* gate vocabulary comes back in later sections, when models are registered, compared and served (S47). Drop the acronym. 'entrevista-relevante' is filler under the writing rules and can go in the same edit. Removing the whole sentence is an acceptable alternative; nothing in S32 depends on it.

> Verifier pass 2: Quote verbatim at s32-microservices.ts line 68, and I confirmed it sits in the block headed 'Diccionario mínimo de la sección', i.e. the section dictionary, as claimed. Nothing depends on the wording: 'entrevista-relevante' and 'MLOps' appear in no active file under tests/ or scripts/ (only quarantined/disabled copies). MLOps is not S32's subject (title 'Feature engineering y pipelines sin leakage'), and S47's title is 'MLOps: experimentos, registro y serving' with the jobRelevance gloss verbatim at line 25. The claim that S24's only occurrence is a resource label the extractor does not record is exactly right, and for a reason worth recording: 'Practical MLOps (data quality chapters)' sits in `resources.books` (s24 lines 1787-1797), and the extractor pushes only `s.resources.docs` (course_event_extractor.mts:252). One loose end for the edit: 'entrevista-relevante' also appears at s32 li

*Locations (1):* `S32 microservices.theory[2].p2`

### 154. S33 · `cross-validation` · MOVE_USE_LATER · UPHELD

Move the link to S33's resources, next to the rolling-origin block. S32 keeps its 'Common ML pitfalls — leakage' link. The move also keeps glossary_intro_audit.py from reporting a forward reference once firstSectionId becomes advanced-models.

*Locations (1):* `microservices.resources.doc[5]`

### 155. S34 · `resample` · HOMONYM · AMENDED

Not this concept. The S34 sense is taught in place before every use, so no content change is needed. Fix the glossary (retarget) so that neither the hover nor the map treats these as pandas resample.

> Verifier pass 1: S34 uses the word twice before T2-A.p0 teaches it, in forms the base-form alias cannot match and the dossier therefore never saw: outcome[2] 'Aplicar class weights o resampling solo dentro del fold de train y documentar la política CV-safe (test intacto)' (s34-cv-ai-integration.ts:35) and the T2-A heading 'Pesos de clase y resampling dentro de CV' (:184). The same glossary block proposes adding 'resampling' as an alias, which converts outcome[2] into a D1 case — an outcome is a preview surface and decisions.md D1 exempts none. So the honest statement is: the six in-section uses after T2-A.p0 need no edit, outcome[2] needs a gloss once the alias lands, and the heading is covered by the heading-before-definition rule.

*Locations (8):* `cv-ai-integration.S34-T2-A.p2`, `cv-ai-integration.S34-T2-A.callout`, `cv-ai-integration.S34-T2-A-DEMO.why`, `cv-ai-integration.S34-T2-A-E2.title`, `cv-ai-integration.S34-T2-A-E2.preamble`, `cv-ai-integration.S34-T2-A-E2.hint`, `cv-ai-integration.S34-T2-A-E2.hint[0]`, `cv-ai-integration.S34-T2-A-E3.retrospective`

### 156. S37 · `generator` · GLOSS_AT_FIRST_USE · AMENDED

**Verifier corrected to:** GLOSS_AT_FIRST_USE

D6 Q1: the learner reads this worked example to follow the paragraph's '`range(10)` en chunks de 3 → `[3,3,3,1]`', so it is acted on by reading. It is also the only code in S37 that actually processes by windows. Treatment: in S37-T3-A, either in the 'Mecanismo' paragraph p1 or in a code explanation for this block, say what `yield` does in `chunks`. The function hands back one slice per turn of the loop and pauses until the caller asks for the next one, so only one chunk exists at a time rather than a list holding all of them. That is the memory property the paragraph claims. Depth: a gloss. The D3 test fails, because no S37 demo or exercise, hidden solutions included, writes or reads `yield`. Rejected alternative: rewriting `chunks` without `yield`, which would leave 'procesa por ventanas' true only as arithmetic. The alias misses two out-of-dossier uses. One is security-infra.S30-T4-B-E1.instruction "Calcula tp y fp con generadores o bucles sobre `zip(y_true, y_pred)`": the real sense, with loops offered as the alternative; plain words or a gloss, depending on the decision below. The other is generator expressions in visible code from S02 (S02-T4-B-DEMO.code, S02-T4-B-E3.hint[1], S03, S04-T4-B-DEMO.code). Whether and where to teach generator expressions is a curriculum decision to raise, not a gloss to bolt on here. S04 is the natural candidate, since `sum(1 for ...)` counting already appears there. Adding an alias for them would change the measurement.

> Verifier pass 1: Put the gloss in rendered prose (S37-T3-A.p1 'Mecanismo' or p2), never in code.explanation, which is extracted as teaching but never rendered. Say that `yield` makes `chunks` hand back one slice at a time and pause until the next one is requested, so the chunks are never all held in one list. The saving on the dataset itself only comes when the source is also read incrementally. Keep the out-of-dossier notes on S30-T4-B-E1 and on generator expressions from S02-S04 as a curriculum decision.

> Verifier pass 2: Code block verbatim at s37-dbt-bigquery.ts:298-311, p0 and p2 verbatim (:290, :292), the demo's `return [size] * (n // size) + ([n % size] if n % size else [])` at :607 and E1's `(n + size - 1) // size` at :1383. The 'no other yield in S37' claim understates the truth: `yield` occurs exactly once in all 52 active section files, s37:301. D3 test applied and it fails — no S37 demo, exercise, starter or hidden solution writes or reads `yield` — so a gloss is the right depth, not a subsection. Both out-of-dossier uses confirmed: security-infra.S30-T4-B-E1.instruction 'Calcula tp y fp con generadores o bucles sobre `zip(y_true, y_pred)`' (s30:1676, invisible because the singular alias's trailing lookahead blocks 'generadores'), and generator expressions at s02:818 `any("nombres" in e for e in r2["errors"])`, s02:2103 (S02-T4-B-E3.hint[1]) and s04:587 `sum(1 for _ in range(n))`.

*Locations (1):* `dbt-bigquery.S37-T3-A.code`

### 157. S38 · `context-manager` · REPLACE_PLAIN_WORDS · UPHELD

D6 Q1: no S38 exercise, demo or check makes the learner act on the term. The retrospective's own question already uses `with`, so one exercise calls one mechanism by two names (writing rule A5). Replace 'context manager' with a reference to the `with` block in all four places. The meaning that must survive: a `with` block runs the object's release step when the block ends, even if the fetch raises, so the release cannot be forgotten the way a hand-written `finally` can. Do not carry over the claim that it 'cierra conexiones'. What `with` releases depends on the object: a file closes, but a sqlite3.Connection used with `with` commits or rolls back and stays open. Keep `hint` identical to `hints[0]`; WeDoStep.hint is required, and the `hint` location is never rendered. Two uses the dossier cannot see get the same treatment. One is S38-T2-B-E2.feedback, "En prod preferirás context manager; aquí fijas el hábito del finally." (feedback is not extracted). The other is S09-T1-B.p0, "vía context managers" (plural, invisible to the alias); drop that phrase, because `with` already carries the sentence. Trade-off: the learner will first meet the term in the Python docs; S38-T2-B.p0 itself names `asyncio.timeout`, which the docs describe as an asynchronous context manager. The rejected alternative is a one-clause gloss at S09-T1-B.p0, where `with` and `finally` are compared. That is better only if the owner wants the docs' vocabulary more than minimal load, and it goes against the 2026-09-17 rule: if the learner never acts on a term, remove it. The hover already shows the glossary entry on S38-T2-B.p0, but that does not replace a gloss: it explains the term through `__enter__`/`__exit__`, which the course never teaches.

> Verifier pass 2: Every quoted string is verbatim: s38-performance-extreme.ts:225 (p0), :1279 (hint), :1281 (hints[0]), :1289 (retrospective), :1287 (the unextracted feedback), plus the instruction '2. Añade `finally: closed = True`.'; the prior teaching at s08-files-ingestion.ts:95 is S08-T1-A paragraph index 2 (p0 pathlib, p1 excepción, p2 with) and s09-exceptions-logging.ts:128 is S09-T1-B.p0. REMOVE/REPLACE test passes: `grep -rn 'context manager' tests/` is empty; the only scripts/ hits (build_roadmap_json.py, roadmap_sections.json, seed_questions_extra.txt) describe a v1 roadmap section, not S38; S38's own starter, solution and declared output ('True / resource conn / ok True') use `finally` only, and no S38 selfCheck or exercise names the term; performance-extreme is not the term's subject. Instrument claims reproduced: the extractor never pushes `feedback`/`edgeCases` (scripts/course_event_extract

*Locations (4):* `performance-extreme.S38-T2-B.p0`, `performance-extreme.S38-T2-B-E2.hint`, `performance-extreme.S38-T2-B-E2.hint[0]`, `performance-extreme.S38-T2-B-E2.retrospective`

### 158. S40 · `fastapi` · REPLACE_PLAIN_WORDS · AMENDED

**Verifier corrected to:** REPLACE_PLAIN_WORDS

S40 never has the learner use FastAPI (only a starter comment), and it is introduced in S41. Replace it with the category S40 already uses ('un framework web', 'la capa HTTP') in the figure caption, T2-B.p0/p2/callout, the demo preamble, the demo code comment, the E1 starter comment and selfCheck[4].opt[3]; the theory code's comment already does ('dominio depende del port, no de SQL/HTTP'). Not in scope for this concept but in the same sentences: `sqlalchemy` must be glossed at first use in S40 (a library for talking to SQL databases, so infrastructure), because S40-T2-B-E2/E3 expect the learner to classify it. Side note: the S40-layer-imports figure (three stacked layers) is attached to S40-T1-A, requirements, though it illustrates S40-T2-A, layers.

> Verifier pass 1: Replace FastAPI with the category S40 already uses ('un framework web', 'la capa HTTP') in the figure caption, T2-B.p0/p2/callout, the demo preamble, the demo code comment, the E1 starter comment and selfCheck[4].opt[3]. Also replace it in the `note` of 'S40-layer-imports' in src/components/course/figures/data/misc.ts. Land this in the same change as the glossary firstSectionId move, or selfcheck-vocabulary.test.mjs fails on S40 selfCheck[4]. SQLAlchemy deserves a D1 gloss where the prose names it, but it is not load-bearing: E2/E3 pass with no knowledge of what sqlalchemy is, because any non-empty domain_imports fails.

> Verifier pass 2: All eight locations exist verbatim in s40-architecture-ddd.ts (figure caption 95, T2-B.p0 213, p2 215, callout 243, demo preamble 489, demo code comment 503, E1 starter comment 1188, selfCheck[4].opt[3] 2300) and they are the complete set — grep for 'fastapi' in S40 returns exactly those eight. S40-T2-A.p0 really does carry the plain words: 'domain no importa drivers de base de datos ni frameworks web' (line 178), and the theory code comment 'dominio depende del port, no de SQL/HTTP' is at line 230. Nothing in S40 has the learner use FastAPI, no declared output prints it, and replacing it in the distractor leaves opt[3] wrong. The SQLAlchemy side note is accurate and worth acting on: there is no glossary entry for it, it appears only in S40 and the legacy s11-advanced-topics.ts, and S40-T2-B-E2/E3 fixtures do carry `"domain_imports":["sqlalchemy"]` with the expected `INVERT_DEPENDENCY` (

*Locations (8):* `S40 architecture-ddd-decisions.S40-T1-A.figure`, `S40 architecture-ddd-decisions.S40-T2-B.p0`, `S40 architecture-ddd-decisions.S40-T2-B.p2`, `S40 architecture-ddd-decisions.S40-T2-B.callout`, `S40 architecture-ddd-decisions.S40-T2-B-DEMO.preamble`, `S40 architecture-ddd-decisions.S40-T2-B-DEMO.code`, `S40 architecture-ddd-decisions.S40-T2-B-E1.starter`, `S40 architecture-ddd-decisions.selfCheck[4].opt[3]`

### 159. S40 · `namedtuple` · REMOVE_THROWAWAY · UPHELD

Remove NamedTuple from the pair, keep the frozen dataclass, and point back to S11's `frozen=True`. The meaning that must survive: the lab flag only asserts immutability and does not make the dict immutable; in production, the value object is a type that cannot be changed after it is created. The retrospective question still works with one option set against the lab flag. Trade-off: this drops a pointer to a second immutable type that Python DDD references use for value objects (Percival & Gregory's Architecture Patterns with Python uses both). That is acceptable because no S40 task uses it. Removing it also fixes a mismatch: today the hover attaches the collections.namedtuple definition to 'NamedTuple' in the why and in the retrospective.

> Verifier pass 2: All three quotes verbatim (s40-architecture-ddd.ts:281, :578, :1715) and the S11 prior teaching verbatim (s11:200 for `frozen=True`, s11:202 for value objects). REMOVE test passes decisively: a case-insensitive scan of all 52 active files finds 'namedtuple' only at those three prose spots plus the two code comments — nothing in any S40 starter, solution, declared output, selfCheck or exercise depends on it, architecture-ddd-decisions is not the term's subject, and tests/ contains no reference. The hover mismatch is real and I reproduced it: the collections.namedtuple tooltip fires on the unbackticked 'NamedTuple' in S40-T3-B-DEMO.why and S40-T3-B-E3.retrospective, but not on p1 where it is backticked — exactly as claimed.

*Locations (3):* `architecture-ddd-decisions.S40-T3-B.p1`, `architecture-ddd-decisions.S40-T3-B-DEMO.why`, `architecture-ddd-decisions.S40-T3-B-E3.retrospective`

### 160. S40 · `namedtuple` · REMOVE_THROWAWAY · UPHELD

A comment-only edit: drop NamedTuple and keep the frozen dataclass wording in line with the prose ('dataclass congelada'). The printed output does not change, so the runtime and strict-output audits are unaffected. No test pins the comment text (searched tests/ and scripts/).

> Verifier pass 2: The comment '# Lab: assert de invariante (en prod: NamedTuple / frozen dataclass)' is verbatim at s40-architecture-ddd.ts:300 and :565, each followed by `vo_frozen = True` (:301, :566) with declared output 'vo_frozen True' (:309, :575); the other two `vo_frozen = True` lines (:1578, :1605) carry no such comment, which matches the two code locations in the dossier. 'No test pins the comment text' verified — grep over tests/ and scripts/ finds NamedTuple nowhere, and the only vo_frozen hits are quarantined generator artifacts under scripts/quarantine_theater/ that never reference the comment. Comment-only, so the runtime and strict-output audits are genuinely unaffected.

*Locations (2):* `architecture-ddd-decisions.S40-T3-B.code`, `architecture-ddd-decisions.S40-T3-B-DEMO.code`

### 161. S41 · `fastapi` · GLOSS_AT_FIRST_USE · UPHELD

D1, with no hover on jobRelevance: gloss in place that FastAPI is a Python web framework for building HTTP APIs, which validates requests and publishes the OpenAPI description.

> Verifier pass 2: Quote verbatim at s41-llm-finetuning.ts line 25, and jobRelevance renders as a bare string with no hover (SectionView.tsx:208), so D1 requires the gloss in place. It is also genuinely the first FastAPI event in S41 — the extractor pushes tagline, jobRelevance and outcomes ahead of theory, and S41's tagline does not name FastAPI. A D1 gloss here and the D3 subsection of group 2 are complementary, not alternatives.

*Locations (1):* `S41 llm-finetuning.jobRelevance`

### 162. S41 · `fastapi` · TEACH_SUBSECTION_D3 · AMENDED

**Verifier corrected to:** TEACH_SUBSECTION_D3

D3 test: a learner who does not know what FastAPI's `@app.post`, `Depends` and generated OpenAPI are cannot write the mapping youDo.requirement[5] asks for, and `@app.post` is never shown. Add a supporting theory block with no subtopicId (keeps the eight-to-eight alignment) right after theory[0]. It needs: what FastAPI is and why S41 models it in stdlib first; a worked mapping of one route (the stdlib `thin_handler(get_store, body)` next to `@app.post("/v1/jobs")` with `Depends(get_store)` and a Pydantic body model that makes FastAPI answer 422 by itself and publish OpenAPI); a figure of that mapping; and a check where the learner names the FastAPI piece for each stdlib function. Trade-off to state: fastapi is not in requirements-content.txt, so a runnable example needs a new pinned content dependency; otherwise the mapping must be a non-executed snippet that the runtime audit accepts.

> Verifier pass 1: Extend the existing S41-T2-A subtopic instead of adding a block after theory[0]. Put a non-executed FastAPI snippet beside the existing `thin_handler(get_store, body)` code: an `@app.post("/v1/jobs")` path operation that takes a `JobCreate` body and `store = Depends(get_store)`. Add a check where the learner names the FastAPI piece for each stdlib function (thin_handler → path operation, get_store → Depends, JobCreate → Pydantic model and 422, public view → OpenAPI response schema). What FastAPI is comes from the jobRelevance gloss (group 1) and can be repeated in one clause of theory[0].p4. Reuse S41-request-path rather than adding a figure. Trade-off unchanged: fastapi is not in requirements-content.txt, so the snippet must be non-executed or a pinned dependency added.

> Verifier pass 2: D3 test: a learner who does not know what FastAPI is, what `@app.post` does, or what OpenAPI it generates cannot write the mapping youDo.requirement[5] asks for, and `@app.post` is named twice (S41-T1-A-DEMO.why and requirement[5]) but never shown in code. `Depends` is already glossed at S41-T2-A.p0, so the new block reinforces rather than introduces it. Add a supporting theory block with no subtopicId right after theory[0]: what FastAPI is and why S41 models it in stdlib first; a worked mapping of one route (the stdlib `thin_handler(get_store, body)` beside `@app.post("/v1/jobs")` with `Depends(get_store)` and a Pydantic body model that makes FastAPI answer 422 by itself and publish OpenAPI); a figure of that mapping; and a check where the learner names the FastAPI piece for each stdlib function. Trade-off to state: fastapi is not in requirements-content.txt, so a runnable example needs

*Locations (2):* `S41 llm-finetuning.theory[0].p4`, `S41 llm-finetuning.S41-T1-A.p0`

### 163. S48 · `embedding` · GLOSS_AT_FIRST_USE · UPHELD

D1: outcomes render as plain text with no hover. Gloss 'embedding' in place: a vector that represents a text's meaning so similar texts end up close. The same wording as theory[0].p1 keeps the two consistent.

> Verifier pass 2: Quote verbatim at s48-ai-governance.ts line 27, and outcomes render as plain `{lo.text}` with no hover (SectionView.tsx:234), so D1 forces the gloss into the words. The GLOSS rather than D3 call is right: S48 already has the subsection — theory[0].p1 defines the term (line 41) and S48-T1-A 'Embeddings y similitud' (line 82) carries the worked dot-product ranking and S48-T1-A-E1..E3. Reusing theory[0].p1's wording keeps the two consistent, and since the extractor pushes outcomes before theory the gloss also lands ahead of the paragraph.

*Locations (1):* `S48 ai-governance.outcome[0]`

### 164. S49 · `generator` · ALIAS_FALSE_MATCH · UPHELD

An everyday word, not a technical sense. No content change. This is a RichText paragraph, so the yield tooltip appears here until the alias is removed.

> Verifier pass 2: Quote verbatim at s49-data-contracts.ts:209. 'un generador de dobles cargos' is ordinary Spanish for a cause, not a Python construct. The tooltip claim is correct and I checked it against the untruncated paragraph (the 400-char cap in the event stream hides the phrase): the RichText matcher marks 'generador' at '…sin key es un generador de dobles cargos…', so the `yield` definition is attached to an everyday word today.

*Locations (1):* `data-contracts.S49-T2-B.p0`

### 165. advanced-models · `cross-validation` · REPLACE_PLAIN_WORDS · UPHELD

Same edit as overfitting's roadmap group. Describe T4 in plain words (repeating the evaluation over several rounds without letting an entity appear on both sides) and let the S33-T4-B heading carry the term. Name plus short gloss is acceptable.

*Locations (1):* `advanced-models.theory[1].p1`

### 166. advanced-models · `cross-validation` · TEACH_SUBSECTION_D3 · UPHELD

D3 test: yes. E2's adverse fixture and its reasoning (why random_split leaks across folds) are not understandable without knowing what a fold is. The concept recurs in S34-T2-A ('solo dentro del fold de train', 'CV-safe') and in the rolling-origin block. Add orientation inside the existing S33-T4-B, in a supporting block without subtopicId placed before the group paragraph. Say what cross-validation is: split the data into k folds; each fold is the validation part once while the rest train; report the mean and spread of the k scores. Worked example: bind the section's existing numbers, the scores [0.6, 0.7, 0.65], to three folds and show which entities train and which validate in each. Fold 0 already exists ('train {e1}', 'valid {e2,e3}'). Figure: S33-T4-B has none; draw k rows with the validation block moving. The check exists (selfCheck[3], 'Group CV por entidad evita:'). Unmatched uses to fix in the same pass: S33 outcome[7] 'Aplicar group CV por entidad con disyunción train/valid y leer n_groups / mean de folds' needs a D1 gloss, and so does S34 outcome[2] ('política CV-safe'). S34-T2-A.p0 should use the name S33 teaches ('validación cruzada'), or the learner may not connect the English term to it. The resource doc[3] resolves once T4-B teaches.

*Locations (3):* `advanced-models.S33-T4-B.heading`, `advanced-models.resources.doc[3]`, `cv-ai-integration.S34-T2-A.p0`

### 167. rpa-advanced · `f1-score` · REPLACE_PLAIN_WORDS · UPHELD

D6 Q1: a forward aside the lesson does not need. Precision and recall have been known since S13, and F1 has not been taught. Drop F1 from the list, or name only the taught metrics. The meaning to keep: per-class metrics and calibrated thresholds are the next step in production.

*Locations (1):* `rpa-advanced.S24-T4-A.p1`

### 168. streamlit-dashboards · `f1-score` · REMOVE_THROWAWAY · UPHELD

D6 Q1: throwaway. A contrast with a metric the learner has never met adds load and no meaning, and the demo preamble even makes it a prediction task. Remove every 'no es F1' clause: p0, both docstrings (removing them changes no output), the demo preamble's F1 prediction, the demo why, the E2 Límites clause, the hints and the retrospective. Also remove it from E2 feedback, 'Esto no es F1 de precisión/recall; es acierto por campo del lab.' The instrument does not extract `feedback`, but SectionView renders it. Keep the other limit, 'no imprimas 1.0 por “casi igual”'. Wording note: 'F1 estadístico' is inaccurate anyway, since F1 is a classification metric, not a statistical test. Trade-off: a learner who already knows F1 from elsewhere loses an explicit warning. The positive definition carries the meaning.

*Locations (9):* `streamlit-dashboards.S25-T4-A.p0`, `streamlit-dashboards.S25-T4-A.code`, `streamlit-dashboards.S25-T4-A-DEMO.preamble`, `streamlit-dashboards.S25-T4-A-DEMO.why`, `streamlit-dashboards.S25-T4-A-E2.preamble`, `streamlit-dashboards.S25-T4-A-E2.hint`, `streamlit-dashboards.S25-T4-A-E2.hint[0]`, `streamlit-dashboards.S25-T4-A-E2.retrospective`, `streamlit-dashboards.youDo.starter`

### 169. security-infra · `f1-score` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss F1 in place, after the S24 and S25 mentions are removed: a single number that combines precision and recall and falls when either one is low.

*Locations (1):* `security-infra.outcome[7]`

### 170. security-infra · `f1-score` · REPLACE_PLAIN_WORDS · UPHELD

The point is metric inflation, not F1 in particular. Say the metrics (or precision and recall, which are known) look better in the notebook. That avoids a forward use one block before the teaching.

*Locations (1):* `security-infra.S30-T4-A.p1`

### 171. security-infra · `f1-score` · TEACH_SUBSECTION_D3 · AMENDED

D3 test: the You Do grades F1, which the learner must implement and interpret ('un F1 pairwise alto puede esconder clusters partidos'). It recurs in S33 (run metrics keys accuracy and f1) and S34. Teach it inside the existing S30-T4-B, in a supporting block without subtopicId or at the opening of p0, with no new subtopicId. Cover what F1 is (the harmonic mean of P and R), why harmonic (with P=1.0 and R=0.5, F1 is 0.667, not the 0.75 average), and a worked example with unequal P and R. D6's instruction sequence also wants a guided step before independent work, and the weDo deliberately has none. Either add a guided check or state that gap. The iDo preambles resolve once theory teaches F1, because the iDo tab follows the theory tab. Considered and not recommended, MOVE_USE_LATER: drop F1 from S30's outcome[7], T4-B, the youDo prf, the rubric and the README requirement, and leave it to S34-T1-A. That is cheaper and avoids duplication. But it changes the CP-N3-A capstone contract, and pairwise F1 is the standard entity-resolution report.

> Verifier pass 1: First, 'its example prints precision 0.667 / recall 0.667 / f1 0.667' is a compression, not a quote: the declared output is three separate lines ('precision 0.667' / 'recall 0.667' / 'f1 0.667', s30 L464-466). The substantive point is right — P equals R, so the worked example cannot show what the harmonic mean does. Second, the diagnosis misses that S30 already contains a one-line F1 definition: S30-T4-B-E2.edgeCases is ['F1 es media armónica de P y R.'] (L1725). SectionView renders edgeCases, and the extractor does not emit them, so it is invisible to the map. It does not defeat the D3 verdict — it arrives inside the exercise that withholds F1, after the learner works, which is not teaching before use — but the new teaching block should absorb or supersede it rather than duplicate it, and the fixer should know it exists.

*Locations (5):* `security-infra.S30-T4-B.p0`, `security-infra.S30-T4-B.code`, `security-infra.S30-T4-A-DEMO.preamble`, `security-infra.S30-T4-B-DEMO.preamble`, `security-infra.S30-T4-B-DEMO.retrospective`

### 172. ai-apis-advanced · `hyperparameter-tuning` · REPLACE_PLAIN_WORDS · UPHELD

D6 Q1: throwaway. The theory already has the plain term, and the lesson never tunes anything. Say 'acuerdo de k', as the theory does. The meaning to keep: both seeds picked the same number of clusters k, which says nothing about whether the points landed in the same clusters (that would need ARI). Apply the same edit to E3.feedback.

*Locations (2):* `ai-apis-advanced.S36-T1-B-DEMO.why`, `ai-apis-advanced.S36-T1-B-E3.retrospective`

### 173. microservices · `onehotencoder` · GLOSS_AT_FIRST_USE · AMENDED

D6 Q1: not throwaway. This is the only place S32 explains what the saved 'vocab' is, and the outcome, T4 and a self-check rely on it. D6 Q2: no S32 exercise encodes categories, so D3 does not apply. Gloss in one or two sentences at this point, using the section's own `canal` feature. One-hot creates one 0/1 column per category value seen in train. That list of values is the vocab saved in the fit state. The `unknown` column catches values that appear only in serve.

> Verifier pass 1: The explanation quoted as belonging to the vocab self-check does not. 'Estadísticas de escalado/encoding se aprenden en fit (train) y se congelan; re-fit en test/serve es leakage o skew.' is the explanation of a different question, 'Al estandarizar amount, μ y σ deben calcularse…' (s32 L2514-2519). The vocab question the diagnosis names ('Si el vocabulario de una categórica crece y cambias el schema del feature set, debes…', L2543) has the explanation 'Cambio de vocab/schema invalida el contrato congelado: version bump y el baseline S33 debe citar el fs-vN nuevo.' (L2547). Both self-checks do lean on the fit-frozen idea, so the dependency argument stands — but they are two different items and the write-up should say so.

*Locations (1):* `microservices.S32-T1-B.p1`

### 174. text-unicode-regex · `overfitting` · REPLACE_PLAIN_WORDS · UPHELD

D6 Q1: throwaway. S07 never has the learner do anything with the ML concept. Keep the plain meaning in both places: the pattern is so strict that it rejects valid addresses. In Límites, say not to propose the over-strict pattern as the solution. In the self-check explanation, say that literal str methods avoid patterns that are too narrow (they reject valid variants) as well as patterns that backtrack. Recommended coupled change: rename the printed label `rejected_by_overfit` and the file title `reject_overfit.py` in the starter, the solution and the Éxito line. The extractor cannot see these names (the underscore lookbehind blocks the match), but the learner reads them. No test outside s07 pins the string: git grep finds only generated course-state capture manifests and learner-run logs. Per D8, the solution's declared output line must change in the same edit. Optional: the theory code comment '# Regla sobreajustada: tan rígida que rechaza casos que el laboratorio debe revisar o aceptar.' is already glossed in place. Changing 'sobreajustada' to a plain adjective would remove S07's last ML borrowing.

*Locations (2):* `text-unicode-regex.S07-T2-B-E3.preamble`, `text-unicode-regex.selfCheck[2].explanation`

### 175. security-infra · `overfitting` · REPLACE_PLAIN_WORDS · UPHELD

D6 Q1: the distractor names a concept S30 never teaches, so the learner cannot weigh it. Keep the distractor's idea in words S30 has taught: a threshold calibrated so closely to the training pairs that it fails on new pairs. The explanation must also say why this option is wrong. A split by entity does not stop a threshold from fitting its training pairs too closely; it only makes that failure measurable on unseen entities. Without that sentence, a careful learner can argue the distractor is partly right.

*Locations (1):* `security-infra.selfCheck[5].opt[0]`

### 176. advanced-models · `overfitting` · GLOSS_AT_FIRST_USE · UPHELD

D1: an outcome must gloss a term the learner has not met. Short parenthetical or appositive: overfitting means the model memorises its training data and does worse on data it has not seen. The phrase 'gap train−valid' needs a few words too: the difference between the score on train and the score on the validation part.

*Locations (1):* `advanced-models.outcome[5]`

### 177. advanced-models · `overfitting` · REPLACE_PLAIN_WORDS · UPHELD

This is a roadmap in an optional reference block. The idea is needed; the term is not. Describe T3 as controlling how much the model memorises (tree depth). The term then arrives at the S33-T3-B heading, two blocks later, where it is defined. Keeping the name with a 3–6 word gloss is an acceptable alternative. The same paragraph is also cross-validation's roadmap location, so fix both in one edit.

*Locations (1):* `advanced-models.theory[1].p1`

### 178. advanced-models · `overfitting` · NO_ACTION_JUSTIFIED · UPHELD

A subsection title that names the concept its first sentence defines is the orientation D3 asks for, not a surprise. It counts only because the extractor emits a heading before its paragraphs. Instrument fix: treat a theory.heading as defined when a paragraph in the same block defines the term.

*Locations (1):* `advanced-models.S33-T3-B.heading`

### 179. advanced-models · `overfitting` · ALREADY_TAUGHT_INSTRUMENT_FN · AMENDED

The term is taught at subsection depth before every one of these uses, in tab order (theory, then iDo, then weDo). Fix three things while in this subsection. (a) Gloss 'valid' at T3-B.p0: it is the held-out part used to choose depth, distinct from S30's test. (b) Move figure S33-overfit-gap from S33-T1-A ('Unidad, target y horizonte') to S33-T3-B. Its caption is 'Con esa brecha, el modelo memorizó. Y apenas supera al baseline: dos problemas, no uno.' and its alt reads 'Tres barras sobre la misma escala: train, test y baseline.'; align the alt text with train/valid. The move makes the concept L3 under D3. (c) S33-T3-A.p0 uses the verb one block before the teaching: 'Profundidad **ilimitada** sobreajusta el dataset sintético y miente frente al dummy.' The alias list misses this form. Use plain words there or point forward to T3-B. Do not generalise colon-gloss detection in the extractor. S13-T1-B.p1 has '**precision**: un merge falso puede unir cuentas de dos personas distintas', where the colon introduces a reason, not a definition. A reviewed allow-list of teaching locations is safer.

> Verifier pass 1: (b) is incomplete: moving S33-overfit-gap needs a second file. The caption and alt live in s33-advanced-models.ts L64-70, but the bar labels ('train', 'test', 'baseline') and the headline 'La distancia entre train y test es el diagnóstico' live in src/components/course/figures/data/misc.ts L523-533. Aligning the figure with train/valid means editing that registry entry in the same change, not just the alt. (No test pins the figure to a block — the only two references to the id are those two files — so the move itself is safe.) Second, the caveat in true_first_teaching that 'valid' is first used as a set name at T3-B.p0 is off by one: outcome[5] uses 'gap train−valid' earlier in the same section, which is why group 2 already has to gloss it there.

*Locations (20):* `advanced-models.S33-T3-B.p0`, `advanced-models.S33-T3-B.p1`, `advanced-models.S33-T3-B.p2`, `advanced-models.S33-T3-B.code`, `advanced-models.iDo.intro`, `advanced-models.S33-T3-B-DEMO.preamble`, `advanced-models.S33-T3-B-DEMO.description`, `advanced-models.S33-T3-B-DEMO.code`, `advanced-models.S33-T3-B-DEMO.why`, `advanced-models.S33-T3-B-DEMO.retrospective`, `advanced-models.S33-T3-B-E1.preamble`, `advanced-models.S33-T3-B-E1.hint` …

### 180. evidence-dashboard · `precision` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss both metrics in place, briefly. Precision: of the pairs you called a match, the fraction that really were. Recall: of the true matches, the fraction you caught. Recall shares this location and treatment; apply one edit.

*Locations (1):* `evidence-dashboard.outcome[1]`

### 181. evidence-dashboard · `precision` · NO_ACTION_JUSTIFIED · UPHELD

This is the title of the subsection that defines the term in its first paragraph, so it orients rather than surprises. It is counted only because of the extractor's heading-first order; see the instrument fix proposed under overfitting.

*Locations (1):* `evidence-dashboard.S13-T1-B.heading`

### 182. evidence-dashboard · `precision` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

Every one of these comes after S13-T1-B.p0 in course order. The S30 uses are 'prec = tp / (tp + fp)' in the theory prf code, '# Caso 30 · precision desde vectores' in the E1 starter and '# Tu implementación: precision, recall, f1' in the youDo starter. The S34 jobRelevance says 'Entregas precision y recall de la cola'. No precision-specific action is needed. While in S13-T1-B.p0, add the plain-words reading of both metrics (what each fraction counts) so that it comes before E1 instead of only in feedback. S34 outcome[0] still needs D1 glosses for F1 and 'average precision', which are new there; that belongs to f1-score and is outside this dossier. S34-T1-B.heading names precision@k, which its own p0 defines. Possible instrument fix: count 'TERM = <expression containing an operator>' as a definition only in theory.paragraph, where code identifiers such as S21's cannot trigger it.

*Locations (38):* `evidence-dashboard.S13-T1-B.p0`, `evidence-dashboard.S13-T1-B.p1`, `evidence-dashboard.S13-T1-B.p2`, `evidence-dashboard.S13-T1-B.code`, `evidence-dashboard.iDo.intro`, `evidence-dashboard.S13-T1-B-DEMO.preamble`, `evidence-dashboard.S13-T1-B-DEMO.code`, `evidence-dashboard.S13-T1-B-DEMO.why`, `evidence-dashboard.S13-T1-B-DEMO.retrospective`, `evidence-dashboard.S13-T1-A-E3.retrospective`, `evidence-dashboard.S13-T1-B-E1.title`, `evidence-dashboard.S13-T1-B-E1.preamble` …

### 183. evidence-dashboard · `precision` · REPLACE_PLAIN_WORDS · UPHELD

This is not a define-before-use problem, since it comes after the teaching, but the label is false. Say what the module offers: simple aggregates such as mean and median, used to summarise metrics across batches. That matches the note. Recall shares this location.

*Locations (1):* `evidence-dashboard.resources.doc[4]`

### 184. fastapi · `precision` · HOMONYM · UPHELD

The match is inside a code block, which the learner hover never annotates, so the only harm is to the count. An optional content fix: rename the local variable to a word meaning decimal places. The printed output never shows the name, so declared outputs are unchanged. The better instrument fix is to stop treating identifier matches in code kinds as surprising uses of an ML metric.

*Locations (1):* `fastapi.S21-T4-A.code`

### 185. cv-ai-integration · `precision` · GLOSS_AT_FIRST_USE · UPHELD

D1 applies to outcomes. In outcome[1], gloss the '@k' part: precision and recall computed only over the first k cases of the ranked queue, where k is the team's daily capacity. In the section-opening callout, precision@k sits in a list with Brier, thr-v* and abstain, each taught in its own subtopic. Plain words are lighter there than four glosses.

*Locations (2):* `cv-ai-integration.outcome[1]`, `cv-ai-integration.theory[0].callout`

### 186. evidence-dashboard · `recall` · GLOSS_AT_FIRST_USE · UPHELD

Same edit as precision's outcome[1] group (D1): recall is the fraction of true matches the rule caught.

*Locations (1):* `evidence-dashboard.outcome[1]`

### 187. evidence-dashboard · `recall` · NO_ACTION_JUSTIFIED · UPHELD

This is the title of the subsection that defines the term. It counts only because of the heading-first extraction order.

*Locations (1):* `evidence-dashboard.S13-T1-B.heading`

### 188. evidence-dashboard · `recall` · ALREADY_TAUGHT_INSTRUMENT_FN · UPHELD

No recall-specific action is needed anywhere in this group. The S24 sentence is rewritten, and the S25 clauses are removed, under f1-score's groups. If those edits keep a mention of recall, it stays correct because S13 taught it. Add the plain-words reading to S13-T1-B.p0 in the same edit as precision.

*Locations (31):* `evidence-dashboard.S13-T1-B.p0`, `evidence-dashboard.S13-T1-B.p1`, `evidence-dashboard.S13-T1-B.p2`, `evidence-dashboard.S13-T1-B.code`, `evidence-dashboard.iDo.intro`, `evidence-dashboard.S13-T1-B-DEMO.preamble`, `evidence-dashboard.S13-T1-B-DEMO.code`, `evidence-dashboard.S13-T1-B-DEMO.retrospective`, `evidence-dashboard.S13-T1-A-E3.retrospective`, `evidence-dashboard.S13-T1-B-E1.title`, `evidence-dashboard.S13-T1-B-E1.preamble`, `evidence-dashboard.S13-T1-B-E1.instruction` …

### 189. evidence-dashboard · `recall` · REPLACE_PLAIN_WORDS · UPHELD

Same single edit as precision's resource group: the label should name what the module actually offers, simple aggregates across batches.

*Locations (1):* `evidence-dashboard.resources.doc[4]`

### 190. cv-ai-integration · `roc-auc` · GLOSS_AT_FIRST_USE · UPHELD

Put the gloss in theory at S34-T1-A.p1, not in the quiz. ROC-AUC summarises, over all thresholds, the true-positive rate against the false-positive rate; equivalently, it is the chance that a random positive scores above a random negative. Because the false-positive rate divides by all negatives, a rare positive class makes many false positives look small, and ROC-AUC can look good while the queue is noisy (Saito & Rehmsmeier 2015). D3 does not apply: no weDo or youDo uses ROC. Also fix selfCheck[0]. Its distractor clause is technically true, since ROC does not change with class prevalence (Fawcett 2006). The explanation must say why that invariance is no reason to prefer ROC-AUC for a rare-positive queue, and reconcile it with T1-A.p1's 'se infla'. Outside this dossier, because 'AUC' is not an alias: S32 uses AUC untaught in its theory intro ('el AUC sube'), in S32-T4-A.p0 ('eso infla AUC offline') and in a self-check option ('solo el AUC offline'), plus demo and weDo texts. Replace those with plain words for the offline model metric.

*Locations (3):* `cv-ai-integration.selfCheck[0].opt[2]`, `cv-ai-integration.selfCheck[6].q`, `cv-ai-integration.selfCheck[6].opt[2]`

### 191. advanced-models · `shap` · REMOVE_THROWAWAY · UPHELD

D6 Q1: throwaway. A distractor the learner cannot evaluate teaches nothing, and the forward pointer names a technique S33 never uses. Replace the distractor with a wrong answer built from S33-T2-B content, such as reading raw coefficient signs as causes (codex authors it). Delete the sentence 'SHAP se reserva a S35.' The first two sentences of the explanation carry the lesson.

*Locations (2):* `advanced-models.selfCheck[2].opt[1]`, `advanced-models.selfCheck[2].explanation`

### 192. ai-apis-advanced · `standardscaler` · IDENTIFIER_KEEP · UPHELD

Keep the label: it is the official API page title. The note must carry the meaning: this is sklearn's class that applies the same z-score as S36-T1-A, with μ and σ learned in fit on train as in S32. No theory change is needed.

*Locations (1):* `ai-apis-advanced.resources.doc[3]`

### 193. security-infra · `train-test-split` · GLOSS_AT_FIRST_USE · UPHELD

D1: gloss train and test in a few words. Train is the part of the labeled pairs used to calibrate weights and thresholds; test is the part kept aside to measure. 'leakage' and 'cross_split' in the same outcome need the same care, outside this concept.

*Locations (1):* `security-infra.outcome[6]`

### 194. security-infra · `train-test-split` · TEACH_SUBSECTION_D3 · UPHELD

D3 test: yes for E3, and the concept recurs in S32–S34. The subsection already exists, with worked code (splits_entity.py: 'train_n 2', 'test_n 2', 'cross_split_n 1') and a callout. What is missing is the base idea at its start, in a supporting block without subtopicId or the opening of p0. Split the labeled pairs before calibrating. Train pairs set weights and thresholds (tie this to T3-B's meaning of 'entrenamiento'). Test pairs never touch calibration and are used only to measure, because measuring on calibration pairs rewards memory; promote the code comment to prose. Then the entity refinement follows. S30-T4-A has no figure; a two-box train/test figure is the missing D3 element, and S32-T1-B's 'S32-leakage' figure already draws a train/test cut. The 80/20 ratio in the glossary is neither taught nor needed. Both locations come after T4-A in tab order, so they resolve once T4-A teaches.

*Locations (2):* `security-infra.S30-T4-A-DEMO.why`, `security-infra.S30-T4-A-E1.starter`

## What the verifiers found that the diagnosers missed

### C1-core-functions

- **annotation** — Glossary claim refuted. The definition_problem says the term should widen because 'S11 annotates dataclass fields ... and S19 annotates ORM columns'. The S11 half is verified (oop-domain.theory[2]-[3] carry ~160 annotated field lines and theory[2].p1 has the quoted 'Campos con **type hints** (anotaciones de tipo, ...)' verbatim). The S19 half is false: src/lib/course/sections/s19-databases-orm.ts is titled 'Visualización y comunicación accesible' and contains zero occurrences of 'class ', 'Column(' or 'Mapped[' — it has no ORM models at all, which is also why its 'una anotación por *insight*' is a chart annotation. The file name is a pre-V3 artefact, the same trap figure-data-schema.test.mjs
- **function** — Glossary alias evidence unsupported, conclusion unaffected. The alias_problems paragraph predicts English matches on 'loss function' and serverless 'Functions' in ML and cloud sections. A scan of every string in all 52 active sections finds zero 'loss function' and zero serverless 'Functions'; the 50 English function/functions matches are pytest fixture scope `function` in s27-async-concurrency.ts (34 of them, e.g. 'El **alcance predeterminado es `function`**' — a genuinely different sense and by far the largest homonym cluster), SQL 'window functions' in s29-mlops.ts, LLM 'function calling' in s25 and s49, and docs.python.org URLs/labels. All fall after 'basics', so the verdict OK survives,
- **if** — Citation error in root_cause (no group affected). '`if monto:` mezcla el cero con la ausencia' is decisions-rules.theory[0].paragraphs[2], not intro p3; p3 is the 'Una **salida temprana** es un `if`...' paragraph that the `return` D3 group cites correctly. Everything else in that sentence checks out: S03's jobRelevance, outcomes 2 and 3, T1-A.p4 and all of T1-B precede S03-T2-A.p1, which is the true first teaching (verbatim).
- **if** — Hidden use with no treatment path. The root_cause correctly lists the uses the false S02 credit hides (all verified verbatim: S02-T2-A-E2 'Corregir `=` por `==` en tres `if`' with its starter's three broken ifs, S02-T1-B-E3.starter, S02-T4-B-DEMO.code, youDo requirement[7] and starter, selfCheck[4]'s options 'if x == None:' / 'if x is None:'), and the groups route most of them — T2-A-E2 with the T2-A-DEMO move, safe_int and the youDo through Q3. basics.selfCheck[4] is left with nothing: it is a self-check, so it sits outside the iDo/weDo/youDo layer Q3 owns and outside every group, yet it presumes `if` syntax in a section whose callout promises no conditionals. It needs its own call in the S
- **function** — Precedent and contradiction the S01 entrypoint groups should cite. tests/adversarial/test_s04_independent_contract.py::test_capstone_starter_preserves_the_typed_entrypoint records that 'S01-F06 removed a check_arg.py demo that taught `def main() -> None:` before indentation, `def` or type annotations were introduced - S04 is the first section where a learner can actually read this', and pins 'def main() -> None:' plus the guard in S04's youDo 'in place of the test that used to pin the removed S01 demo'. This is direct repo precedent for both S01 MOVE groups (a check_arg demo was already moved out of S01 for exactly this reason, leaving the weDo exercise behind), and it contradicts the assump
- **return** — Supporting evidence the REPLACE-over-DELETE choice deserves. The S02 contract listing is titled 's02_map_contract.py' — the very code/output pair whose loss test_s02_independent_contract's floor comment says was 'caught at 40'. Deleting it without lowering the floor reproduces that exact failure, so the group's preference for replacement over deletion is stronger than stated, and the alternative (delete + lower to 40) means retiring the only regression that has ever fired there.

### C2-core-collections

- **for** — S03-T4-A-E2 requires the learner to write a loop and is not in any group. Its instruction says '3. Arma tres ejemplos (`accept` / `review` / `reject`) y compruébalos en un bucle.' (s03-decisions-rules.ts:1897), its starter has no loop, and its solution adds `for ex in examples:`. The 'for' alias does not match 'bucle' on its own, so the map cannot see it. Under D3 this is load-bearing exactly like S03-T4-B-E2, and it contradicts group 5's 'never has to write a loop' for S03 practice. It needs the same explicit per-case rewrite, and it blocks removing the T4-A theory loop (group 4).
- **for** — Other S03 practice-layer uses the map cannot see because they say 'bucle', 'Recorre' or 'iteración' without `for`. Each must be rewritten wherever groups 5 and 6 replace a loop: S03-T1-A-E2.instruction ('Recorre …', 'en cada iteración'), S03-T1-B-E1.instruction ('Recorre la lista `vals`'), S03-T1-B-E3.instruction ('Prueba el bucle dado'), S03-T2-A-E2.instruction, S03-T2-B-E1.instruction ('los cuatro valores del bucle'), S03-T2-B-E2.instruction ('en el bucle de seis casos'), S03-T3-B-E2.instruction ('Recorre el bucle con'), S03-T4-A-E1.instruction ('Recorre examples') and S03-T4-B-E2.preamble ('un bucle que use `assert`').
- **truthiness** — Learners see 'truthiness' in S02, before S03. Figure 'S02-truthiness', attached to the S02-T2-B theory block, renders the note '…nunca con truthiness.' (src/components/course/figures/data/misc.ts:37, rendered by DecisionFigure.tsx:124). Its headline 'Qué es falso en un if' also brings `if` into S02. The extractor only pushes a figure's caption and alt (course_event_extractor.mts:211), so headline, note and branch labels in figure data are invisible to the map course-wide.
- **slicing** — Slice syntax appears before S06 without the term, so the term-based map misses it: `args = sys.argv[1:]` in the S01-T1-B-E2 starter and solution (s01-setup.ts:1179, 1195), `trabajo = original[:]` in an S02-T2-B-E2 hint (s02-basics.ts:1418), and `list(zip(nombres, edades[:1]))` in the S04-T1-B-E2 instruction and solution (s04:791, 823). The glossary's firstSectionId 'collections' is right for the term, but these uses need their own treatment.
- **set** — The case-insensitive 'Set' alias also matches the PowerShell cmdlet 'Set-ExecutionPolicy' in S01-T2-A-E1 edgeCases (s01-setup.ts:1301), because '-' is not a letter. SectionView.tsx:644 renders edgeCases to learners, but the extractor never reads them, so this false match and the S04 'dict comp + tasa' and 'set comprehension' edgeCases are invisible to the dossier. The proposed alias restriction should be checked against edgeCases too.
- **exception** — The list of try/except uses the map cannot see (cause_generalises_to) is incomplete. Also: the S02-T1-B-E3 solution (except ValueError, s02:1137, 1157), the S02-T4-B-E3 solution (s02:2151), the S02-T3-B-E3 instruction, hint and solution ('`except InvalidOperation`', 'try/except InvalidOperation', `except (InvalidOperation, ValueError)` at s02:1775-1814), and the S02-T1-B-E2 preamble and feedback ('sin `except: pass`'). All are in the practice layer and follow Q3.
- **for** — Factual slips outside the groups. The glossary note says 'S04-T1-A's first example is `for i in range(3)`', but the first loop in for_registros.py is `for region in regiones:`; range(3) is the second, and the point about mentioning range still holds. The root cause's '60 uses in S02–S03' does not match the dossier, which has 61 S02/S03 locations; 3 are false matches (group 3), leaving 58 real uses. The claim that 'Python for Everybody' titles occur only in S02–S07 is too narrow: they also occur in S08–S10, S13–S16, S18 and S20.
- **slicing** — The glossary verdict's 'No false matches for Slicing or slice' is wrong, and it is the load-bearing claim of that section. Course-wide, `slice` is used far more often in the ML/evaluation sense of a cohort or subgroup than in the Python sense: security-infra.S30-T4-B.p2 '**Error slices** (rebanadas de error): corta fallos por fuente…' plus a fixture with {"slice": "missing_phone"}, cv-ai-integration.S34-T4-B.p1 'métricas **por slice** (cohorte, región sintética…)', system-design.outcome[2] 'Comparar métricas por cohorte/slice', system-design.S35-T2-A.heading 'Cohortes y métricas por slice' and its contract 'entrada dict `slice→{n, precision}`', tech-leadership.theory[0].p1 'las tareas de eva
- **set** — The alias diagnosis undercounts the loanword class and the proposed fix would over-correct. Beyond S01, SQL `SET` and 'set de calibración', the same bare alias matches 'feature set' (microservices S32 repeatedly, dbt-bigquery S37, integrator-phase2 S39), 'golden set' (rpa-advanced S24 heading and outcome[6], streamlit-dashboards S25), 'gold set' (ai-governance S48), 'label set' (S25), 'training set' (S39), 'set de rúbrica' (tech-leadership S50) and 'evidence set' (career-strategy S52) — dozens of hits, not ten. Conversely, the proposed whitelist (lowercase `set` in a code span or code kinds, `set()`, 'set de literales', 'comprensión de set') would silently drop true prose uses in S06, the se
- **for** — A second load-bearing S03 exercise is invisible to the map and absent from the dossier, so it is absent from every group. S03-T4-A-E2 ('Invariante multi-campo de apellidos') instructs '3. Arma tres ejemplos (`accept` / `review` / `reject`) y compruébalos en un bucle'; its starter contains no loop at all (two bare `print(validate_apellidos(...))` calls) and its solution writes `for ex in examples:` over a list of dicts. S03-T1-A-E2's instruction likewise says '2. Recorre ["DNI", "dni", "RUC"]' and '4. Imprime `t →` y el booleano en cada iteración'. Neither surface is seen by the concept map because bare 'bucle' and 'recorre' are deliberately not aliases (terms.ts:67-69) and those strings cont
- **for** — S02 contradicts the scope callout the S02 groups rely on, and the fix has an edit the diagnosis does not name. The optional contract block's own program (s02-basics.ts:65-86, s02_map_contract.py) returns "if_for_as_support_syntax": True and prints 'if_for_as_support_syntax True' as pinned output — the section explicitly declares if/for as support syntax two paragraphs after the callout 'Todavía no usaremos condicionales ni bucles'. The alias never matches it (the underscore lookbehind blocks `_for_`), which is why it is not in the dossier. So the argument 'do not gloss `for`, it would contradict the section's scope callout' rests on a callout the section already undercuts; and if groups 0-2 

### C3-core-advanced

- **generator** — llm-agents.S28-T1-A-E1.feedback: 'Sin resembrar, el generador avanza: el segundo `random` no es la misma muestra.' This is the PRNG sense, rendered through RichText after 'Ver solución', and my hover simulation shows it gets the yield tooltip. It is missing from the dossier because feedback is not extracted, and the diagnosis lists only five RichText homonyms, so this is a sixth.
- **generator** — The glossary fix must change the `term` string as well as the aliases. course_event_extractor.mts matches [t.term, ...aliases], and glossary_coverage_audit.py prepends the term. With the aliases gone, 'Generator' still matches S18-T2-B-E3.hint[1] and data-engineering.resources.doc[7], backticked or not, so the concept map keeps them.
- **generator** — The root cause misquotes OPEN_QUESTIONS.md. The source reads 'eleven of its twelve uses are NumPy's `Generator`/`default_rng`, a PRNG, or an LLM *generador de narrativa*. One is real.'; the diagnosis quotes a paraphrase inside single quotes.
- **generator** — Instrument defect behind the S37 advice: theory.code.explanation is a TEACHING kind in scripts/concept_map.py and is emitted by the extractor, but TheoryTab in SectionView.tsx never renders block.code.explanation (TheoryBlockView, which does, is never used). A gloss placed there would mark a concept taught although no learner sees it. It is latent today, with 0 such fields.
- **dunder-method** — The recommended member aliases (`__eq__`, `__hash__`, `__post_init__`) conflict with the root cause's rule that a member gloss must not credit the category. The extractor credits defines by term id, so the S11-T1-B.p0 parenthetical '`__post_init__` (el gancho que ejecuta la dataclass...)' would count as the category's first definition. If the new S11-T1-A.p0 category gloss is not written in a shape definesTerm detects, S11-T1-B.p0 becomes first_definition and S11-T1-A.p0 stays a surprising use. Also, the root-cause claim that identifier-only aliases never reach the tooltip is false for unbackticked text. With `__post_init__` as an alias, my hover simulation shows a tooltip on S11-T1-B-E1.hin
- **context-manager** — The '2026-09-17 rule' the diagnosis cites (if the learner never acts on a term, remove it) is a lesson in audit/fixer/LEDGER_NOTES.md, lines 300-305. It is not a standing decision in audit/fixer/decisions.md; the binding source is D6 question 1.
- **context-manager** — Declared code outputs are a rendered surface the extractor never emits, and the diagnosis misses it while building a whole cause_generalises_to entry on the neighbouring cases. CodeBlock.tsx:170-184 renders `output` (with data-output-source), but scripts/course_event_extractor.mts pushes only `b.code.code`, `st.starterCode?.code` and `st.solutionCode?.code` — there is no push of any `output` field anywhere in the file. So any concept named only in a declared output is invisible to the concept map course-wide, exactly as `feedback` and `edgeCases` are. The diagnosis itself quotes two such outputs as evidence (s09 'cause: ParseError no parseable: \'abc\'' and s40 'vo_frozen True') without noti
- **abc** — The three matchers already disagree on word boundaries, not only on case, so the proposed 'per-term case-sensitivity flag that all three matchers honour' would not by itself make them agree. course_event_extractor.mts uses `(?<![\p{L}\d_])`, glossary_intro_audit.py and glossary_coverage_audit.py use `(?<![\w/-])`, and RichText.tsx uses `[^A-Za-z0-9À-ÿ_./-]` — the last two exclude '-' and '/' from the boundary, the first does not. Six of the 'abc' occurrences are hyphen-prefixed (e.g. `"cache_key":"lock-abc"` at s44-multimodal.ts:811, 821, 861, 879): the extractor counts them, the hover and both Python audits do not. Whatever flag is added should be specified alongside a single shared boundar
- **context-manager** — The glossary entry's `example` field is the same dead form as the alias the diagnosis retires, and it is left untouched. terms.ts:175 is `example: 'with open("f.csv") as f:\\n    data = f.read()'`, while the course writes `with path.open(...)` / `with p.open(...)` and never `with open(`. Glossary.tsx:27 maps every GLOSSARY_TERM onto the Glossary page, so a learner who looks the term up sees a call shape the course never uses, next to the `__enter__`/`__exit__` definition the diagnosis does propose to rewrite. The glossary verdict should cover the example, not only the aliases, the definition and firstSectionId.

### C4-tooling

- **git (outside the C4 list, same surface as interprete)** — setup.jobRelevance says 'usar Git' with no in-place gloss. That is the same D1 gap as 'intérprete', but the gate cannot see it: POST_CUE credits git in the tagline ('Git es el sistema…', display 0), and jobRelevance is shown on its own in a popover. The diagnosis's 'glosses its other three terms' misses it.
- **instrument (cluster-wide)** — course_event_extractor.mts does not push weDo `feedback` or `edgeCases`, even though feedback renders through RichText (SectionView.tsx:655). It also pushes only `resources.docs`, not `books` or `courses`. Uses in those fields are unmeasured: for example S10-T2-B-E2.feedback mentions pytest (s10:1309), and S11's resources.courses has 'pytest docs'.
- **instrument (hover claims)** — Theory callouts render with InlineText (SectionView.tsx:427–429) and get no glossary hovers. The hover also marks only the first match per RichText block, including the heading. Claims of wrong tooltips on callout locations (S18-T4-A.callout, S24-T4-A.callout) or on 'every' use should be scoped to the first match in each prose block.
- **coverage** — Dropping the S24-T4-A-E3.preamble credit also turns rpa-advanced.S24-T4-A-E3.instruction, S24-T4-A-E3.hint[2], S24-T4-A-E3.starter and S24-T4-A-E3.retrospective into surprising uses. They are automation-coverage homonyms and belong in the S24 HOMONYM group. The diagnosis names only the S27 and S26 uses.
- **gitignore** — S01-T3-B-E2's hidden solution (s01-setup.ts:1938) and theory[21].p3 assume a working .gitignore at PR time, which is before S01-T4-B. Any change to the S01-T2-A callout must keep the file in place before theory[20]'s first push.
- **github** — The root_cause enumerates three false-positive credits (theory[8].p4, theory[8].code, S01-T2-A.p1) and never classifies the fourth, which reads as if all credits were false. definitions_all for github is [theory[8].p4, theory[8].code, S01-T2-A.p1, theory[20].p0], and setup.theory[20].p0 (display_order 135) is the only TRUE positive among them: '**GitHub** es un sitio web que guarda una copia de un repositorio para compartirla. Git conserva el historial en tu computadora; GitHub recibe una copia cuando tú la envías.' An applier that 'drops the false credits' must keep this one or GitHub will score never-explained. The same shape recurs for pip, whose definitions_all is [S01-T1-B.p2, setup.the
- **pytest** — The diagnosis found the right root cause for joblib — a glossary entry written for an inactive legacy section file — but did not notice that the same cause explains pytest and coverage, and instead attributed their problems to slug drift. src/lib/course/sections/s10-testing.ts (id 'testing', not imported by src/lib/course/index.ts, therefore inactive) contains at line 42: 'pytest es el framework de testing más usado en Python. Más simple que unittest (built-in), más poderoso, con mejor output. Instalación: `pip install pytest pytest-cov`... `pytest --cov=mi_modulo` (cobertura).' and at line 312: 'Coverage mide qué porcentaje de tu código está cubierto por tests. `pip install pytest-cov`...'.
- **pytest** — The hyphen claim in the pytest and pip glossary notes is wrong for the live hover, and the examples do not exist. RichText's annotateGlossaryTermsPlain builds `(^|[^A-Za-z0-9À-ÿ_./-])(alias)(?=[^A-Za-z0-9À-ÿ_./-]|$)`, whose lookahead class DOES exclude a trailing hyphen, so 'pytest-cov', 'pytest-randomly', 'pip-tools' and 'pip-audit' would not be hovered. The claim holds only for scripts/course_event_extractor.mts, whose lookahead is `(?![\p{L}\d_]|\.py)` and does not exclude '-'. Concretely there is nothing to fix on either path: pip-tools, pip-audit and pytest-randomly appear nowhere in the repository, and pytest-cov appears only in the inactive s10-testing.ts. A related gap in the github 
- **coverage** — definitions_all for coverage has a third credit the diagnosis never mentions: ('S35', 'system-design.resources.doc[6]'), display_order 15453, text 'Conformal prediction (mapie docs) Calibración + cobertura (más allá de la banda toy del lab)'. PAREN_GLOSS takes '(más allá de la banda toy del lab)' and looksLikeProse passes it on 'de'/'la'. It is a fourth homonym false positive (the conformal sense) and it shows that resource-list entries are treated as definitions — worth knowing for a round that plans to 'remove the S24 credit', though it does not move the first definition since it falls after S27-T4-A.p0.
- **coverage** — One consequence of dropping the S24 credit is stated only half-way. The diagnosis names async-concurrency.outcome[6] (display_order 11569) and theory[1].p1 (11580) as the uses that then become surprising, and separately observes that S26's youDo.rubric[0] 'Cobertura del pipeline VP y de los criterios de cierre CP-N2-C' uses the everyday sense. That S26 rubric is at display_order 11499 — earlier than both S27 locations — so once the S24 credit is removed it becomes the FIRST surprising use of the concept, not a footnote. It still needs no content change (the sense really is the ordinary one), but the S27 round should expect the map to point at S26 first.

### C5-pipelines-integration

- **entity-resolution** — glossary.missing_aliases ['resolución de identidad'] contradicts audit/fixer/glossary_aliases_es.json, whose 'reject' list (decided 2026-09-14) excludes that exact alias for entity-resolution. The diagnosis neither cites nor revisits that decision. Fix the prose name in S13 theory[0].p1 instead.
- **fastapi** — The rendered figure is not fully covered. src/components/course/figures/data/misc.ts 'S40-layer-imports'.note repeats 'Si el dominio importa FastAPI…' inside the SVG (StackFigure.tsx line 87). The extractor reads only caption and alt, so this use is invisible to the dossier and the map.
- **fastapi** — Unstated test dependency: tests/adversarial/selfcheck-vocabulary.test.mjs keys on glossary `term` + firstSectionId. Moving FastAPI to llm-finetuning makes S40 selfCheck[4] fail the test (simulated) unless the S40 replacement lands at the same time. The other proposed firstSectionId moves (pipeline→basics, mlops→opensource, merge→packaging, embedding→ai-governance, llm→streamlit-dashboards) produce no offenders.
- **merge** — S15 theory[0].p1 states 'cuando dos Series se … concatenan por filas, pandas las alinea por el Index', which is false for row-wise concat: under .venv-content, pd.concat([s1, s2]) stacks and duplicates 'b'. The diagnosis tells codex to keep this rule. The sentence it proposes to move was added by a5e0948e as a factual over-generalisation fix, and that history is not stated.
- **apply** — If the glossary entry is not removed in the same change as the S32 rewording, removing the false credit at S32-T3-B-DEMO.why turns 11 later S32 uses, 10 S45 uses (IaC plan/apply, APPLY token) and 1 S46 use into surprising uses. The S23 'doble apply idempotente' the diagnosis cites sits in an edgeCases field the extractor does not push, so it is not among the 48 counted uses.
- **pipeline** — The alias ['Pipeline'] cannot match the plural: the lookahead (?![\p{L}\d_]) rejects 'pipelines'. S05-T1-A.callout, S07-T3-B-E3.preamble, S10-T1-B-DEMO.retrospective, S10-T3-A-E2.preamble and later sections are therefore invisible to the map and the hover. The accepted practice elsewhere is to add plurals (tuplas, embeddings, LLMs), so missing_aliases should include 'pipelines'.
- **pipeline** — cause_generalises_to overstates one rule. 'POST_CUE has no leading word boundary' does not explain the sameness-predicate case: S32-T3-B-DEMO.why ('Apply de mediana de train es el mismo') still matches with a (?<!\p{L}) boundary (re-ran), so it needs its own guard against 'es el mismo / es la misma'. The count '16 of 103' is also low: recomputing from the extractor gives 18 terms with no visible use in their firstSectionId (adding args-y-kwargs and feature-engineering), or 17 with no use at all.
- **merge** — Minor factual slips in the evidence text. S17 theory[2].callout is one block before S17-T1-A, not two. 'modelos de lenguaje' (a proposed llm alias) occurs nowhere in the course; only the singular appears, in S25 theory[0].p0.
- **__instrument__** — The alias regex's trailing guard `(?![\p{L}\d_]|\.py)` (course_event_extractor.mts:147) makes every inflected form invisible, and the diagnosis catches only one instance of it (llm's missing 'modelos de lenguaje'). Uncounted uses of the very concepts in this cluster: 'pipelines' at s05 line 143 and s10 lines 459 and 1456; 'auto-mergea'/'auto-mergean' at s13 lines 127 and 551; 'merges'/'mergear' at s30 line 2092, s41 lines 1405 and 1407, s44 lines 1808 and 2178. None changes a verdict here, because each concept is already taught earlier — but the rule belongs in cause_generalises_to, because the same guard would hide a plural that happened to be a term's first use.
- **__instrument__** — The extractor pushes only `s.resources.docs` (course_event_extractor.mts:252); `resources.books`, `resources.courses` and `resources.videos` are never emitted. This is the concrete mechanism behind the mlops finding — 'Practical MLOps (data quality chapters)' sits in S24's `books` array (s24 lines 1792-1796), not `docs` — and the diagnosis asserts the outcome without naming the cause. Any term whose only trace in a section is a book, course or video label is invisible to the map the same way, so a firstSectionId keyed on one can never be detected as unused.
- **__glossary__** — The figure repeated across five concepts' cause_generalises_to — '16 of 103 glossary terms declare a firstSectionId where the term is never used' — is short by at least one. 103 terms is right (I parsed src/lib/glossary/terms.ts), but the list omits `args-y-kwargs`: firstSectionId 'basics' (S02), aliases ['args y kwargs', 'kwargs', '**kwargs', '*args'], and s02-basics.ts contains neither 'kwargs' nor '*args' anywhere. The count should read 17, and the fix list should include it.
- **pipeline** — The diagnosis judges S02's teaching adequate while noting it is 'D3's shape minus a figure', then prescribes no content change. D3 lists a figure among the four parts a load-bearing concept gets, and pipeline is load-bearing inside S02 — S02-T1-B-E3 has the learner implement `pipeline(edad_txt, anios_txt)` with a pinned three-line output. The missing figure is a real D3/D5 gap on the course's first-taught pipeline block; it should be named as work left undone rather than absorbed into 'no content change'.
- **mlops** — The edit as written leaves S32 internally inconsistent. 'entrevista-relevante' is called filler and struck from theory[2].p2, but the same phrase survives at s32 line 1214 ('Ese hábito (REQUEST vs. inventar) es entrevista-relevante'). Either both go in the same round or neither does. (Separately, the writing-rules citation for calling it filler is implicit — audit/fixer/writing_rules.md contains no 'entrevista' or filler rule by that name, so the brief should cite the rule it actually rests on.)

### C6-numpy-pandas

- **shape** — The glossary change is gated and the diagnosis does not say so. tests/adversarial/glossary-first-use.test.mjs fails any term whose firstSectionId is later than the first section whose `paragraphs:` prose contains the `term` string (word-boundary, case-insensitive, rejecting a preceding backtick). Today 'Shape' first appears in prose at s06-collections.ts:257 and :259, so firstSectionId 'collections' passes and the suite is green at HEAD (I ran it). Moving it to 'security' without the S06-T3-A.p0/.p2 edits in the same commit turns that gate red. S06-T1-B.p0's '(`shape`)' is backtick-protected and does not count; S07-S13 contain no 'shape' at all, so after the paragraph edits the first prose u
- **groupby** — Same gate, same omission, opposite direction. 'GroupBy' first appears in prose at s15-stdlib-deep.ts:71 ('uniones y groupby'), so retargeting firstSectionId to 'wxpython-gui' or 'packaging' fails glossary-first-use.test.mjs unless the group-0 REPLACE_PLAIN_WORDS edit at S15-T1-A.p2 lands first. Every S16 and S17 prose occurrence is backtick-prefixed and invisible to that gate, so once S15's is gone the term has no prose match at all and either target passes.
- **groupby** — The glossary definition_problem is overstated. The entry reads 'Patrón split-apply-combine. df.groupby("region")["ventas"].sum(). Agrupa por una clave y agrega.' — it does say in Spanish that it groups by a key and aggregates. What is actually missing is only the split-and-combine half (rows are divided into groups sharing a key value, and the per-group results are put back together) and the English label leading. Writing the finding as 'never says in Spanish what happens' will get the whole definition rewritten when one clause is the defect.
- **boolean-masking** — The alias_problems sense attribution is wrong for two of its three sections. S07's 'máscaras' are phone-number formatting separators ('un teléfono sintético llega con máscaras (`.` y `-`)', s07-text-unicode-regex.ts:1024, and :1038), not PII masking. S16's 'máscaras' at s16-wxpython-gui.ts:165 ('combina las máscaras con `|`') and :336 ('devuelve máscara de fallos') are boolean masks — the same sense, not a homonym. Only S09 uses it for PII masking (mask_email, :687, :733). The recommendation not to add a bare 'máscara' alias still holds, on S07's formatting sense plus S09's PII sense; the reason given for it is just not the one in the files.
- **dataframe** — 'The plural DataFrames (used in S16-S17 prose)' does not survive a grep. S16 has zero occurrences. In active sections the only two are weDo preambles, s15-stdlib-deep.ts:811 and s17-packaging.ts:949 — neither is `paragraphs:` prose. The remaining hits are in the inactive legacy files s07-pandas.ts, s10-testing.ts and s11-advanced-topics.ts, which are not in active_section_ids. Adding the alias is still harmless, but it buys two weDo preambles, not a prose problem.
- **reshape** — Two more unextracted learner-visible surfaces carry the unglossed anglicism, beyond the section title and outcome[2] the diagnosis names: the books entry note 'joins, reshape, groupby' (s17-packaging.ts:1740) and the course label 'Kaggle — Pandas (merge, groupby, reshape)' (:1749). course_event_extractor.mts:250 reads only `s.resources.docs`, never `books` or `courses`, so the whole books/courses surface is unaudited under D1 across all 52 sections — a blind spot of the same family as feedback, portfolioNote, edgeCases and section titles, and worth adding to the instrument's cause_generalises_to list.

### C7-statistics

- **iqr** — The extractor blind spot is wider than the diagnosis says, and it bites this cluster twice. Besides youDo.portfolioNote and youDo.retrospective (named under eda), the weDo loop at scripts/course_event_extractor.mts:225-237 emits title, preamble, instruction, hint(s), starter, tests, solution and retrospective, but never `feedback` or `edgeCases`. So S18-T1-A-E2.feedback 'Q1/Q3 son p25/p75; IQR = Q3 − Q1.' (s18:892) — the clearest statement of the mapping anywhere in S18 — and S03-T2-B-E2.edgeCases 'valor atípico > 10000 → review' (s03:1323) are learner-visible text the concept map cannot see in either direction: it will neither credit a gloss written there nor count a surprising use left the
- **outlier** — The glossary note overstates the plural's reach: 'about 20 S18 uses' of 'outliers' is 14 occurrences in the entire s18 file (grep -o), including code comments and hidden solution strings, so adding the alias adds at most 14 S18 events, not ~20. The direction of the claim is right (S16's count rises until the D3 block lands); only the magnitude is wrong.
- **iqr** — Adding the alias 'rango intercuartílico' has a side effect the diagnosis does not mention: S16 youDo.context already writes 'IQR (rango intercuartílico)' (s16:1688), so the new alias matches there too. I ran the real definesTerm on that string — false for both aliases, because PAREN_GLOSS's looksLikeProse requires a function word and 'rango intercuartílico' has none. The alias therefore adds a mention at a location that is already surprising and never adds a definition credit, which is the safe outcome but should be stated before the measurement change.
- **distribuci-n-normal** — Small precision point on 'concept_map rightly refuses to count a distractor as teaching': the detector does credit it. I ran definesTerm on 'una distribución normal (la campana simétrica)' and it returns true via PAREN_GLOSS; what keeps it out of first_definition is that selfcheck.option is absent from TEACHING_KINDS (scripts/concept_map.py:51-64), so the option is filed under `reinforcements` instead. Removing the gloss (group 0) therefore also removes the only record that the course says anything about the term before S18, which strengthens rather than weakens the case for the S18 gloss.

### C8-ml-evaluation

- **f1-score** — S30 already contains a learner-visible one-line definition of F1 that the diagnosis never mentions: S30-T4-B-E2.edgeCases is ['F1 es media armónica de P y R.'] (src/lib/course/sections/s30-security-infra.ts L1725). SectionView renders edgeCases after the solution and the extractor never emits them, which is why it is absent from the map. It does not change the D3 verdict (it arrives inside the very exercise that withholds F1), but the diagnosis asserts S30 gives no definition at all, and the new teaching block should absorb or replace this line rather than leave a second, weaker statement of the same fact downstream of the exercise.
- **cross-validation** — The location id 'advanced-models.S33-T4-B.heading', which this group names as an edit target, is ambiguous. Two consecutive theory blocks in s33-advanced-models.ts both carry subtopicId 'S33-T4-B' (L428 group CV, L466 rolling origin), so the extractor emits two events at each of .heading, .p0, .p1, .p2, .code and .callout. I confirmed the duplicates directly in .fixer/events.json (display_order 14224-14229 vs 14230-14236). A patch keyed by location could land on the wrong block, and any per-location gate will double-count this subsection. Worth naming as an instrument defect alongside the heading-order and PAREN_GLOSS ones.
- **cross-validation** — The root cause wrongly lists 'stratifiedkfold' among the glossary entries written for the retired s09-sklearn.ts. That entry (src/lib/glossary/terms.ts L719-725) has Spanish aliases ['StratifiedKFold', 'split estratificado', 'stratified split'], a definition matching what the active course says, and firstSectionId 'cv-ai-integration' — and S34-T2-A.p3 does teach it in prose ('Un **split estratificado** (*stratified split*, y su versión por folds **StratifiedKFold**) reparte manteniendo en cada fold la misma proporción de clases que en el conjunto completo'). It is the one entry in that list that is aligned with active teaching, so including it weakens an otherwise accurate generalisation.
- **overfitting** — Two numeric details in the root causes do not check out, and one script dependency was not surfaced. (a) Commit 134d90ec is dated 2026-09-17 08:48:17 (author and committer), not 08:46; .fixer/events.json is indeed stale at 00:32:16, so the staleness conclusion stands. (b) The retired s09-sklearn.ts contains 69 case-sensitive (107 case-insensitive) occurrences of cross_val_score/GridSearchCV/StandardScaler/OneHotEncoder/SHAP, not 95 — the file being unimported by src/lib/course/index.ts is confirmed. (c) scripts/anglicism_gloss_audit.py L34 carries 'overfitting' in its audited anglicism list; removing S07's uses cannot break it, but the groups claim a scripts/ sweep and this hit was not repor
