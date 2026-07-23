# NEWBIE_B (Skeptic) — agentic_E2 sections 14–26

**Agent:** Newbie B / persona=`skeptic`
**Attempt:** `agentic_E2`
**Method:** `live_agentic_packet_only_no_execution`
**Artifact origin:** `direct_agent_output`
**Recorded:** 2026-07-23T04:38:42.338183+00:00

## Scope
- LIVE dual-LLM solve of **exercises + selfcheck** for sections **14–26**.
- Source of truth: `exercise_batch_14_26.json` and per-section `slim_packet.json` / `quiz_card.json`.
- Forbidden honored: no agentic_E1 lives, no D1/D2, no solutions/correctIndex, no TypeScript sources.
- Independent of Newbie A (Explorer): Skeptic wording starts with `E2-Skeptic:`.
- `code_execution_used=false`; `restart_from=landing`; `agent_instance_id=newbie-b-skeptic-E2-sXX-live`.

## Artifacts updated
For each section `section_XX/newbie_b_live.json`:
- 24 exercises with complete `code` (no `____`, no `# TODO`)
- selfcheck answers with required `question_index` + `chosen_index` + packet-grounded justifications (≥80 chars)
- metadata: `persona=skeptic`, `attempt_id=agentic_E2`, `method=live_agentic_packet_only_no_execution`,
  `artifact_origin=direct_agent_output`

## Validator results (newbie_b only)

| Sec | Title | SC % | Exercises | Pass |
|-----|-------|------|-----------|------|
| 14 | NumPy y cómputo vectorizado | 100.0 | 24/24 + SC 4 | ✅ |
| 15 | Pandas: ingesta, selección y tipos | 100.0 | 24/24 + SC 4 | ✅ |
| 16 | Calidad, limpieza y contratos de datos | 100.0 | 24/24 + SC 5 | ✅ |
| 17 | Joins, reshape, groupby y cierre analíti | 100.0 | 24/24 + SC 5 | ✅ |
| 18 | EDA, estadística descriptiva e incertidu | 100.0 | 24/24 + SC 5 | ✅ |
| 19 | Visualización y comunicación accesible | 100.0 | 24/24 + SC 5 | ✅ |
| 20 | Automatización robusta de Excel | 100.0 | 24/24 + SC 5 | ✅ |
| 21 | Documentos, plantillas y reportes trazab | 100.0 | 24/24 + SC 5 | ✅ |
| 22 | Email, identidad y aprobación humana | 100.0 | 24/24 + SC 5 | ✅ |
| 23 | Browser RPA con Playwright | 100.0 | 24/24 + SC 4 | ✅ |
| 24 | OCR y Document AI | 100.0 | 24/24 + SC 4 | ✅ |
| 25 | Endpoints de IA, Hugging Face y promptin | 100.0 | 24/24 + SC 4 | ✅ |
| 26 | Orquestación y VP RPA + AI Analyst | 100.0 | 24/24 + SC 4 | ✅ |

Gate check (via `scripts/newbie_agentic_validator.py --attempt agentic_E2 --section N`):
- All S14–S26: `newbie_b.pass=true`, `selfcheck_score_pct=100`, `exercises_done=24/24`
- `incomplete_exercises=[]`, `template_justifications=[]`, `missing_exercises=[]`

## Selfcheck indices chosen (Skeptic, from packet theory)

| Sec | chosen_index sequence |
|-----|----------------------|
| 14 | [1, 3, 0, 2] |
| 15 | [2, 0, 1, 3] |
| 16 | [3, 1, 2, 0, 3] |
| 17 | [0, 2, 3, 1, 0] |
| 18 | [1, 3, 0, 2, 1] |
| 19 | [2, 0, 1, 3, 2] |
| 20 | [3, 1, 2, 0, 3] |
| 21 | [0, 2, 3, 1, 0] |
| 22 | [1, 3, 0, 2, 1] |
| 23 | [2, 0, 1, 3] |
| 24 | [3, 1, 2, 0] |
| 25 | [0, 2, 3, 1] |
| 26 | [1, 3, 0, 2] |

## Reasoning notes (Skeptic posture)
- Prefer explicit packet contracts (venv isolation, `is None` vs truthiness, fail-closed reconcile,
  separate ER vs relationship scores, approve→draft_email, fraud_labels auto = 0).
- Filled starters from iDo demos + instruction/hints; stripped TODO/forma after applying reference prints.
- Justifications quote instruction/option language and reject peeking at keys.
- Codes intentionally carry `# E2-Skeptic/<id>` header (distinct from Explorer).

## Files
- `course-state/newbie_walkthrough/agentic_E2/section_14/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_15/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_16/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_17/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_18/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_19/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_20/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_21/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_22/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_23/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_24/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_25/newbie_b_live.json`
- `course-state/newbie_walkthrough/agentic_E2/section_26/newbie_b_live.json`

## Report path
`course-state/newbie_walkthrough/agentic_E2/fixes/NEWBIE_B_14_26.md`
