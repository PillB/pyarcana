# Newbie A (Explorer) — agentic_D1 sections 01–13

**Agent:** newbie_a_live  
**Persona:** explorer  
**Attempt:** agentic_D1  
**Method:** `llm_packet_only_no_generator`  
**Production note:** `live_dual_llm_agentic_from_packet_only_D1`  
**Knowledge boundary:** Only landing + prior + active packet content under `agentic_D1` (quiz_card / slim_packet / exercise_batch_01_13).  
**Forbidden honored:** No other attempts (A/B/C/007b), no solutions/correctIndex, no TypeScript sources, no rebuild templates.

## Scope completed

| Section | Title (short) | Exercises | Selfcheck | Artifact |
|--------:|---------------|----------:|----------:|----------|
| 01 | Entorno reproducible y trabajo seguro | 24 | 5 | `section_01/newbie_a_live.json` |
| 02 | Valores, tipos, operadores e I/O | 24 | 5 | `section_02/newbie_a_live.json` |
| 03 | Decisiones y reglas de validación | 24 | 5 | `section_03/newbie_a_live.json` |
| 04 | Iteración y resúmenes transaccionales | 24 | 5 | `section_04/newbie_a_live.json` |
| 05 | Funciones, contratos y descomposición | 24 | 5 | `section_05/newbie_a_live.json` |
| 06 | Colecciones y estructuras de datos | 24 | 5 | `section_06/newbie_a_live.json` |
| 07 | Texto, Unicode y expresiones regulares | 24 | 5 | `section_07/newbie_a_live.json` |
| 08 | Archivos, CSV, JSON e ingesta | 24 | 5 | `section_08/newbie_a_live.json` |
| 09 | Excepciones, debugging y logging seguro | 24 | 6 | `section_09/newbie_a_live.json` |
| 10 | Módulos, packaging y CLI profesional | 24 | 6 | `section_10/newbie_a_live.json` |
| 11 | OOP y modelo de dominio | 24 | 6 | `section_11/newbie_a_live.json` |
| 12 | APIs, SQL y geodatos responsables | 24 | 5 | `section_12/newbie_a_live.json` |
| 13 | Familiarity Evidence Dashboard y cierre | 24 | 5 | `section_13/newbie_a_live.json` |

**Totals:** 312 exercises + 67 selfcheck stems, all with `blocked_on: []`.

## Requirements checklist

1. **Selfcheck:** Every stem has `chosen_index`, `chosen_text`, and `justification_from_packet` (natural prose ≥80 chars quoting packet theory). `blocked_on: []`.
2. **Exercises:** Every weDo id has complete `code`/`answer` (no `____`, no `sys.x`, no bare `# TODO`). Justification unique natural language ≥80 chars citing instruction/demo/theory.
3. **Meta:** `attempt_id=agentic_D1`, `method=llm_packet_only_no_generator`, `production_note=live_dual_llm_agentic_from_packet_only_D1`, `persona=explorer`.

## Explorer stance (how answers were produced)

- Read theory paragraphs, iDo demos, starters, and hints **only** from `exercise_batch_01_13.json` / per-section quiz cards under `agentic_D1`.
- Filled guided blanks from the matching demo/theory (e.g. S01 venv/git/ruff, S02 Decimal, S03 allowlists, S04 rates, S05 pure functions, S06 dedup/conflicts, S07 NFC/Jaccard, S08 manifest reconcile, S09 fail-fast vs recover, S10 CLI exit codes, S11 dataclass/Protocol, S12 no-retry 400 + SQL `?`, S13 separated ER vs relationship scores).
- Justifications written as first-person explorer notes quoting packet concepts (venv, `is None`, `n_total`, `sort_keys`, `from e`, CF-1, etc.), avoiding forbidden rebuild template phrases.

## Local integrity gate (pre-validator)

Re-scanned all 13 live files for incomplete fingerprints:

- No `____`, `sys.x`, or `# TODO` remaining after fix of residual comment text in `S01-T1-B-E1`.
- Exercise id lists match batch weDo ids in order.
- Selfcheck counts match stem counts (5 or 6 per section).

## Notes / residual risk

- Answers are **packet-only LLM** solutions (no code execution as source of truth; no generator scripts).
- S08–S13 starters are often sparse (`pass` / TODO body); solutions were completed from iDo demos + instruction contracts, not from hidden solutionCode.
- Dual-agent gate still requires Newbie B artifacts and provenance meta at attempt level if the full agentic validator is run end-to-end.

## Files touched

- `course-state/newbie_walkthrough/agentic_D1/section_01/newbie_a_live.json` … `section_13/newbie_a_live.json`
- `course-state/newbie_walkthrough/agentic_D1/fixes/NEWBIE_A_01_13.md` (this file)
