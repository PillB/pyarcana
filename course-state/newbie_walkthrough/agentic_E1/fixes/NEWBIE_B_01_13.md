# Newbie B (Skeptic) — agentic_E1 sections 01–13

## Meta

| Field | Value |
|-------|--------|
| attempt_id | `agentic_E1` |
| agent | `newbie_b_live` |
| persona | skeptic |
| method | `live_agentic_packet_only_no_execution` |
| artifact_origin | `direct_agent_output` |
| restart_from | `landing` |
| code_execution_used | `false` |
| agent_instance_id pattern | `newbie-b-skeptic-E1-sXX-live` |
| production_note | live dual-LLM agentic solve from sequential packets only |
| knowledge boundary | Only landing + prior + active packet (`exercise_batch_01_13.json`, section `quiz_card` / `slim_packet`) |
| forbidden honored | No D1/D2/A*/B*/C*/007b lives, no solutions/correctIndex/TS sources |

## Scope completed

| Section | Title | Exercises | SelfCheck | packet_sha (short) |
|---------|-------|-----------|-----------|--------------------|
| 01 | Entorno reproducible y trabajo seguro | 24 | 5 | acffd96ca937a8e8 |
| 02 | Valores, tipos, operadores e I/O | 24 | 5 | 4954c6038cd0329c |
| 03 | Decisiones y reglas de validación | 24 | 5 | 06e920dd4f6b4cf2 |
| 04 | Iteración y resúmenes transaccionales | 24 | 5 | b6cbd4f5cc46ffab |
| 05 | Funciones, contratos y descomposición | 24 | 5 | 2d6b238f92680c4c |
| 06 | Colecciones y estructuras de datos | 24 | 5 | 2b7e2c730df3d20b |
| 07 | Texto, Unicode y expresiones regulares | 24 | 5 | ee5c9933e094c618 |
| 08 | Archivos, CSV, JSON y contratos de ingesta | 24 | 5 | c234db867d731518 |
| 09 | Excepciones, debugging y logging seguro | 24 | 6 | 3247f8c2a2673b20 |
| 10 | Módulos, packaging y CLI profesional | 24 | 6 | 8b461ffa87af3bfa |
| 11 | OOP y modelo de dominio | 24 | 6 | 5337c2dfbd6c4bfc |
| 12 | APIs, SQL y geodatos responsables | 24 | 5 | f7618f33608a851f |
| 13 | Familiarity Evidence Dashboard y cierre de nivel | 24 | 5 | 5b62429cf1e55f4a |

**Totals:** 13 × 24 = **312** exercises; **68** selfcheck answers.

## Output artifacts

For each section `01`–`13`:

`course-state/newbie_walkthrough/agentic_E1/section_XX/newbie_b_live.json`

### Exercise item shape

```json
{
  "exercise_id": "SXX-T…",
  "answer": "…",
  "code": "…complete code…",
  "confidence": 0.71,
  "blocked_on": [],
  "concepts_used": ["…"],
  "justification_from_packet": "E1-Skeptic: … (≥80 chars, packet-grounded)"
}
```

### Selfcheck item shape

```json
{
  "question_index": 0,
  "chosen_index": 0,
  "chosen_text": "…",
  "confidence": 0.74,
  "blocked_on": [],
  "justification_from_packet": "E1-Skeptic: … (≥80 chars)"
}
```

## Solve method (skeptic)

1. Read only `exercise_batch_01_13.json` plus per-section `quiz_card.json` / `slim_packet.json` under `agentic_E1`.
2. Complete starter blanks and domain contracts from **instruction + hints + theory/iDo** in the active packet.
3. Selfcheck choices reasoned from packet theory wording (no offline keys).
4. Every justification starts with **`E1-Skeptic:`**, natural prose ≥80 characters, citing instruction/theory tokens.
5. No code execution as pass bar (`code_execution_used=false`); no copy from prior attempts.

## Quality gates applied locally

- No empty exercise codes
- No `____` / `# TODO` incomplete fingerprints
- Balanced parentheses in non-comment code lines
- All justifications prefixed `E1-Skeptic:` and length ≥ 80
- All selfcheck entries have `chosen_index` + `chosen_text`
- Provenance fields match E1 live contract

## Independence notes

- Justifications deliberately use the **E1-Skeptic** voice (doubt defaults, insist on packet evidence, reject auto-fraud/family leaps).
- Codes completed from starters/contracts in E1 packets only; not re-voiced from D1/D2.
- Separate `agent_instance_id` per section: `newbie-b-skeptic-E1-s01-live` … `s13-live`.

## Status

- [x] Sections 1–13 `newbie_b_live.json` filled (exercises + selfcheck)
- [x] Justifications `E1-Skeptic:` ≥80 chars
- [x] Complete codes (no blank/TODO fingerprints)
- [x] This report: `agentic_E1/fixes/NEWBIE_B_01_13.md`
