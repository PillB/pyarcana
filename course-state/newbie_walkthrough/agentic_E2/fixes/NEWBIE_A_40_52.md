# Newbie A (Explorer) — agentic_E2 sections 40–52

**Agent:** Newbie A · persona `explorer`  
**Attempt:** `agentic_E2`  
**Method:** `live_agentic_packet_only_no_execution`  
**Artifact origin:** `direct_agent_output`  
**Restart from:** `landing`  
**Code execution used:** `false`  
**Agent instance pattern:** `newbie-a-explorer-E2-sXX-live`  
**Knowledge boundary:** quiz_card + exercise_batch packets only (no E1/D1/D2 lives, no solutions/answer-keys, no TS sources)  
**Recorded:** 2026-07-23T04:40:53.486322+00:00

## Gate outcome

| Section | Title | Exercises (just_ok/expected) | Selfcheck % | Chosen indices | A pass |
|---------|-------|------------------------------|-------------|----------------|--------|
| S40 | Arquitectura, DDD y decisiones técnicas | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |
| S41 | APIs con FastAPI y contratos HTTP | 24/24 | 100.0% | [0, 2, 3, 1] | PASS |
| S42 | Schemas, seguridad y privacidad de servicios | 24/24 | 100.0% | [1, 3, 0, 2] | PASS |
| S43 | Contenedores y reproducibilidad operativa | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S44 | CI/CD y seguridad de la cadena de suministro | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |
| S45 | Cloud, almacenamiento, colas e infraestructura | 24/24 | 100.0% | [0, 2, 3, 1] | PASS |
| S46 | Ingeniería de datos y orquestación de producción | 24/24 | 100.0% | [1, 3, 0, 2] | PASS |
| S47 | MLOps: experimentos, registro y serving | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S48 | LLM applications y RAG con evidencia | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |
| S49 | Agentes, herramientas y context engineering | 24/24 | 100.0% | [0, 2, 3, 1] | PASS |
| S50 | Evals, red teaming y fiabilidad de IA | 24/24 | 100.0% | [1, 3, 0, 2] | PASS |
| S51 | Observabilidad, gobernanza y UX del copiloto | 24/24 | 100.0% | [2, 0, 1, 3] | PASS |
| S52 | Enterprise Relationship & Operations Intelligenc | 24/24 | 100.0% | [3, 1, 2, 0] | PASS |

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


- Late sections share a governance quiz pattern (evidence / fail-closed emit / gate proof / synthetic scope); explorer heuristics align with those contracts.
- Empty E2/E3 starters are the majority load; assess/decide synthesis reuses fixed E1 predicates and REQUEST_* routing from hints.
- S50 uses REBUILD_EVAL_DATASET as reject token (domain name, not provenance taint).
- Capstone S52 selfcheck includes full 52/52 + CP-FINAL gate language from the packet outcomes.
- All 13 sections validated PASS for Newbie A with 100% selfcheck except none below 100% in this band after re-voice.


## Files written

- `section_40/newbie_a_live.json`
- `section_41/newbie_a_live.json`
- `section_42/newbie_a_live.json`
- `section_43/newbie_a_live.json`
- `section_44/newbie_a_live.json`
- `section_45/newbie_a_live.json`
- `section_46/newbie_a_live.json`
- `section_47/newbie_a_live.json`
- `section_48/newbie_a_live.json`
- `section_49/newbie_a_live.json`
- `section_50/newbie_a_live.json`
- `section_51/newbie_a_live.json`
- `section_52/newbie_a_live.json`

Report path: `fixes/NEWBIE_A_40_52.md`
