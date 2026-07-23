# NEWBIE_A 01–13 — agentic_E2 (Explorer)

**Agent:** Newbie A · persona `explorer`
**Attempt:** `agentic_E2`
**Method:** `live_agentic_packet_only_no_execution`
**Artifact origin:** `direct_agent_output`
**code_execution_used:** false
**restart_from:** landing
**Sections:** 1–13

## Scope
Filled `section_XX/newbie_a_live.json` for S01–S13 from `exercise_batch_*` + per-section `quiz_card.json` / `slim_packet.json` only.
Independent of agentic_E1 lives and D1/D2 artifacts. Forbidden paths honored.

## Meta (every live file)
- attempt_id=agentic_E2
- method=live_agentic_packet_only_no_execution
- artifact_origin=direct_agent_output
- restart_from=landing
- code_execution_used=false
- agent_instance_id=newbie-a-explorer-E2-sXX-live
- persona=explorer
- production_note=live dual-LLM agentic solve from sequential packets only

## Per-section summary

| Sec | Title | Exercises | Selfcheck | chosen_index sequence |
|-----|-------|-----------|-----------|------------------------|
| S01 | Entorno reproducible y trabajo seguro | 24 | 5 | `0,2,3,1,0` |
| S02 | Valores, tipos, operadores e I/O | 24 | 5 | `1,3,0,2,1` |
| S03 | Decisiones y reglas de validación | 24 | 5 | `2,0,1,3,2` |
| S04 | Iteración y resúmenes transaccionales | 24 | 5 | `3,1,2,0,3` |
| S05 | Funciones, contratos y descomposición | 24 | 5 | `0,2,3,1,0` |
| S06 | Colecciones y estructuras de datos | 24 | 5 | `1,3,0,2,1` |
| S07 | Texto, Unicode y expresiones regulares | 24 | 5 | `2,0,1,3,2` |
| S08 | Archivos, CSV, JSON y contratos de ingesta | 24 | 5 | `3,1,2,0,3` |
| S09 | Excepciones, debugging y logging seguro | 24 | 6 | `0,2,3,1,0,2` |
| S10 | Módulos, packaging y CLI profesional | 24 | 6 | `1,3,0,2,1,3` |
| S11 | OOP y modelo de dominio | 24 | 6 | `2,0,1,3,2,0` |
| S12 | APIs, SQL y geodatos responsables | 24 | 5 | `3,1,2,0,3` |
| S13 | Familiarity Evidence Dashboard y cierre de | 24 | 5 | `0,2,3,1,0` |

## Quality checks
- Every exercise: complete `code`, `justification_from_packet` ≥80 chars, `blocked_on: []`
- Every selfcheck: `question_index`, `chosen_index`, `chosen_text`, natural justification ≥80 chars
- Selfcheck answers reasoned from packet theory (not offline keys / not E1 leakage)
- Exercises completed from starters, hints, iDo demos, and Salida/pass / forma esperada contracts

## Explorer notes
- S01–S03: blanks and transfer markdown filled from REPL/venv/Git/Ruff theory.
- S04–S13: TODO bodies + forma esperada references; intake/ER/CLI contracts.
- S14–S26: NumPy/pandas/Excel/RPA/OCR/AI/orchestration pass contracts without code execution.

## Artifacts
- `course-state/newbie_walkthrough/agentic_E2/section_{01..13}/newbie_a_live.json`
- This report: `course-state/newbie_walkthrough/agentic_E2/fixes/NEWBIE_A_01_13.md`
