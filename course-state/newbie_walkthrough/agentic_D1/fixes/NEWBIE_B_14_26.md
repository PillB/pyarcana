# NEWBIE_B_14_26 — Newbie B (Skeptic) agentic_D1

## Meta
- attempt_id: `agentic_D1`
- persona: `skeptic`
- method: `llm_packet_only_no_generator`
- production_note: `live_dual_llm_agentic_from_packet_only_D1`
- agent_instance_id: `nbB-D1-sk-1276a172426694c9`
- knowledge_boundary: landing + prior + active packet only
- forbidden_honored: true
- code_execution_used: false (solve from packet text; no generator)

## Scope
- Sections **14–26** exercises (weDo) + selfCheck
- Source: `agentic_D1/section_XX/slim_packet.json` and `exercise_batch_14_26.json` only
- No other attempts, rebuild templates, or correctIndex

## Summary
- Sections completed: **13**
- Exercises written: **312**
- Selfcheck answers written: **59**
- Justifications: D1-Skeptic style, **≥80 chars**, packet-grounded
- Codes: complete (TODO stripped; starter + packet pattern / forma esperada)

## Per-section

| Sec | Title | Ex | SC | Choices |
|-----|-------|----|----|---------|
| 14 | NumPy y cómputo vectorizado | 24 | 4 | [1, 3, 0, 2] |
| 15 | Pandas: ingesta, selección y tipos | 24 | 4 | [2, 0, 1, 3] |
| 16 | Calidad, limpieza y contratos de datos | 24 | 5 | [1, 1, 1, 1, 1] |
| 17 | Joins, reshape, groupby y cierre analítico | 24 | 5 | [0, 2, 3, 1, 1] |
| 18 | EDA, estadística descriptiva e incertidumbre | 24 | 5 | [1, 3, 0, 2, 1] |
| 19 | Visualización y comunicación accesible | 24 | 5 | [2, 0, 1, 3, 1] |
| 20 | Automatización robusta de Excel | 24 | 5 | [3, 1, 2, 0, 1] |
| 21 | Documentos, plantillas y reportes trazables | 24 | 5 | [0, 2, 3, 1, 1] |
| 22 | Email, identidad y aprobación humana | 24 | 5 | [1, 3, 0, 2, 1] |
| 23 | Browser RPA con Playwright | 24 | 4 | [2, 0, 1, 3] |
| 24 | OCR y Document AI | 24 | 4 | [3, 1, 2, 0] |
| 25 | Endpoints de IA, Hugging Face y prompting evaluado | 24 | 4 | [0, 2, 3, 1] |
| 26 | Orquestación y VP RPA + AI Analyst | 24 | 4 | [1, 3, 0, 2] |

## Skeptic stance
Chose options only when theory/iDo language in the active packet supports them; preferred fail-closed, human-in-the-loop, and non-causal / non-fraud-auto claims. Exercise codes stay within stack limits stated in each instruction (e.g. numpy-only on S14).

## Artifacts
For each section 14–26: `course-state/newbie_walkthrough/agentic_D1/section_XX/newbie_b_live.json`

## Issues
- none flagged by incomplete-pattern scan

## Runtime smoke
- Executed all 312 exercise codes in-process after packet-only completion; **0 fails** post-fixes.
- Patches: S15-T3-B-E2 try/KeyError, S15-T4-B-E3 sha1(to_csv), S20 catalog/groupby, S21 docx/pdf completes, S23-T3-B-E3 fail-3 retries, S22-T3-A-E1 email regex.
