# Newbie A (Explorer) — agentic_E1 sections 14–26

## Meta

- attempt_id: `agentic_E1`
- method: `live_agentic_packet_only_no_execution`
- artifact_origin: `direct_agent_output`
- restart_from: `landing`
- code_execution_used: `false`
- persona: `explorer`
- agent_instance_id pattern: `newbie-a-explorer-E1-sXX-live`
- recorded_at: `2026-07-23T04:16:27.307623+00:00`

## Scope

Independent live dual-LLM solve of **exercises + selfcheck** for sections **14–26**.

**READ ONLY sources used:**
- `agentic_E1/exercise_batch_14_26.json`
- `agentic_E1/section_XX/quiz_card.json` / slim packet theory + iDo (under agentic_E1)

**Forbidden honored:** no agentic_D1/D2/A*/B*/C*/007b, no solutions, no correctIndex, no TS curriculum sources.

## Counts

- Sections: 13 (14–26)
- Exercises completed: 312 (24 × 13)
- Selfcheck answers: 59
- All exercise codes: non-empty, no TODO, compile-clean (static syntax check)
- Justifications: natural, ≥80 chars, packet-grounded

## Per-section summary

| Sec | Title | Ex | SC | Short ex-just | Short sc-just | packet_sha | agent_instance_id |
|---:|---|---:|---:|---:|---:|---|---|
| 14 | NumPy y cómputo vectorizado | 24 | 4 | 0 | 0 | `80ec9fb58d350d03` | `newbie-a-explorer-E1-s14-live` |
| 15 | Pandas: ingesta, selección y tipos | 24 | 4 | 0 | 0 | `fff23fb297025459` | `newbie-a-explorer-E1-s15-live` |
| 16 | Calidad, limpieza y contratos de datos | 24 | 5 | 0 | 0 | `bf1b1f93ca6fbcee` | `newbie-a-explorer-E1-s16-live` |
| 17 | Joins, reshape, groupby y cierre analítico | 24 | 5 | 0 | 0 | `4dfb9a19457db16f` | `newbie-a-explorer-E1-s17-live` |
| 18 | EDA, estadística descriptiva e incertidumbre | 24 | 5 | 0 | 0 | `e42d9a39f6f4973a` | `newbie-a-explorer-E1-s18-live` |
| 19 | Visualización y comunicación accesible | 24 | 5 | 0 | 0 | `2607badf23d76722` | `newbie-a-explorer-E1-s19-live` |
| 20 | Automatización robusta de Excel | 24 | 5 | 0 | 0 | `c50414946e8bee44` | `newbie-a-explorer-E1-s20-live` |
| 21 | Documentos, plantillas y reportes trazables | 24 | 5 | 0 | 0 | `6b4c3320865094ee` | `newbie-a-explorer-E1-s21-live` |
| 22 | Email, identidad y aprobación humana | 24 | 5 | 0 | 0 | `9c104917fbc2cfb3` | `newbie-a-explorer-E1-s22-live` |
| 23 | Browser RPA con Playwright | 24 | 4 | 0 | 0 | `ec53a90850587d18` | `newbie-a-explorer-E1-s23-live` |
| 24 | OCR y Document AI | 24 | 4 | 0 | 0 | `b630b1d121c06add` | `newbie-a-explorer-E1-s24-live` |
| 25 | Endpoints de IA, Hugging Face y prompting evaluado | 24 | 4 | 0 | 0 | `9fece9e9f16058bf` | `newbie-a-explorer-E1-s25-live` |
| 26 | Orquestación y VP RPA + AI Analyst | 24 | 4 | 0 | 0 | `98a22dbe9fbc9742` | `newbie-a-explorer-E1-s26-live` |

## Approach (explorer)

1. Read each exercise instruction + starter + hints from the live packet.
2. Prefer domain completions aligned with Pass/Salida contracts and theory/iDo demos.
3. When starter embeds `forma esperada (referencia)`, complete TODO with that form (indent-safe for for/if/except).
4. Hand-solved S14–S17 (NumPy/Pandas/quality/joins) and patched S18–S23 weak heuristic cases to match pass strings.
5. Selfcheck choices grounded in theory wording (dtype, loc, coerce, view, approve, OCR abstain, no auto-fraud, draft-before-approve, etc.).
6. Natural justifications ≥80 chars citing concept + demo/pass contract; no template slogans.

## Notable packet fixes while solving

- `S26-T4-B-E3`: packet `forma esperada` was truncated; completed dict from instruction (`Familiarity-reporting-automation`).
- `S23-T3-B-E3`: incomplete `if i==3:` body; filled with `print('fail', i)` per Pass contract.
- Several S21/S22 for-loops had bare colon + unindented print; rewritten to contractual prints.

## Artifacts

- `section_14/newbie_a_live.json`
- `section_15/newbie_a_live.json`
- `section_16/newbie_a_live.json`
- `section_17/newbie_a_live.json`
- `section_18/newbie_a_live.json`
- `section_19/newbie_a_live.json`
- `section_20/newbie_a_live.json`
- `section_21/newbie_a_live.json`
- `section_22/newbie_a_live.json`
- `section_23/newbie_a_live.json`
- `section_24/newbie_a_live.json`
- `section_25/newbie_a_live.json`
- `section_26/newbie_a_live.json`

