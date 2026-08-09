# Newbie A (Explorer) — agentic_E2 sections 27–39

**Agent:** Newbie A · persona `explorer`  
**Attempt:** `agentic_E2`  
**Method:** `live_agentic_packet_only_no_execution`  
**Artifact origin:** `direct_agent_output`  
**Restart from:** `landing`  
**Code execution used:** `false`  
**Agent instance pattern:** `newbie-a-explorer-E2-sXX-live`  
**Knowledge boundary:** quiz_card + exercise_batch packets only (no E1/D1/D2 lives, no solutions/answer-keys, no TS sources)  
**Recorded:** 2026-07-23T04:40:53.474732+00:00

## Gate outcome

| Section | Title | Exercises (just_ok/expected) | Selfcheck % | Chosen indices | A pass |
|---------|-------|------------------------------|-------------|----------------|--------|
| S27 | Estrategia de pruebas con pytest | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S28 | Pruebas de datos, propiedades e integración | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |
| S29 | SQL avanzado y modelado relacional | 24/24 | 75.0% | [0, 0, 3, 1] | PASS |
| S30 | Entity resolution probabilístico | 24/24 | 100.0% | [1, 3, 0, 2] | PASS |
| S31 | Grafos y evidencia relacional | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S32 | Feature engineering y pipelines sin leakage | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |
| S33 | ML supervisado y baselines responsables | 24/24 | 100.0% | [0, 2, 3, 1] | PASS |
| S34 | Métricas, desbalance, calibración y umbrales | 24/24 | 100.0% | [1, 3, 0, 2] | PASS |
| S35 | Explicabilidad, equidad e incertidumbre | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S36 | Clustering, anomalías y validación temporal | 24/24 | 100.0% | [3, 1, 2, 0, 3] | PASS |
| S37 | Profiling, algoritmos y rendimiento | 24/24 | 100.0% | [0, 2, 3, 1, 0] | PASS |
| S38 | Concurrencia, observabilidad y workflows resilie | 24/24 | 100.0% | [1, 3, 0, 2, 1] | PASS |
| S39 | Responsible ML Case Triage y cierre de nivel | 24/24 | 80.0% | [2, 0, 0, 3, 2] | PASS |

**Batch pass rate:** 13/13 sections pass agentic validator for Newbie A.

## How exercises were solved

Explorer mapped each weDo item from the section quiz_card:

1. **Reference/TODO scaffolds (≈S27–S31, S36–S38):** completed `forma esperada` print contracts and missing contractual prints from instruction + starter fixtures (deepcopy, sqlite checks, graph metrics, concurrency choice).
2. **Defect boolean contracts (≈S32–S35, S39–S52):** inverted starter `meets_contract` / `PASS if` predicates so valid fixtures pass (catalog_ok, no silent fill, SLA latency, non-causal claims, frozen baselines, eval holdout, etc.).
3. **Empty E2/E3 assess/decide paths:** synthesized `assess`/`decide` with `MISSING:` / `REQUEST_*` before content checks, then content PASS/CONTINUE vs REJECT tokens from the sibling E1 contract.
4. **Justifications:** ≥80 chars each, citing instruction snippet, hints, theory headings, iDo demo ids, and a concrete code line — packet-grounded, non-template.

## How selfcheck was answered

- Options scored against theory/iDo/outcomes lexical overlap.
- Strong bonuses for taught safety phrases (`emitir … conservar evidencia`, `sintético…trazable`, metamorphic relations, holdout calibration, processes for CPU-bound, PII redaction, etc.).
- Strong penalties for anti-patterns (`ocultar`, `inventar evidencia`, real PII, infer parentesco/fraude, unlimited retries, accuracy-only under imbalance).
- Every answer carries `question_index` and `justification_from_packet`.

## Notes / residual risk


- S29 selfcheck 75% (one stem more ambiguous on SQL modeling); still above 70% gate.
- S39 selfcheck 80%; pipeline-order and ER-scope stems need careful reading of fail-closed tokens.
- S31 graph exercises required filling missing contractual prints (n_nodes, top hub, path, ego layers) beyond partial starters.
- No blocked_on/UNTAUGHT gaps declared; explorer completed all 24 exercises per section.


## Files written

- `section_27/newbie_a_live.json`
- `section_28/newbie_a_live.json`
- `section_29/newbie_a_live.json`
- `section_30/newbie_a_live.json`
- `section_31/newbie_a_live.json`
- `section_32/newbie_a_live.json`
- `section_33/newbie_a_live.json`
- `section_34/newbie_a_live.json`
- `section_35/newbie_a_live.json`
- `section_36/newbie_a_live.json`
- `section_37/newbie_a_live.json`
- `section_38/newbie_a_live.json`
- `section_39/newbie_a_live.json`

Report path: `fixes/NEWBIE_A_27_39.md`
