# Newbie A (Explorer) — LIVE dual-LLM solve S27–S39

**Agent:** Newbie Subagent A · persona `explorer`  
**Attempt:** `agentic_E1`  
**Method:** `live_agentic_packet_only_no_execution`  
**artifact_origin:** `direct_agent_output`  
**restart_from:** `landing` · **code_execution_used:** `false`  
**agent_instance_id pattern:** `newbie-a-explorer-E1-sXX-live`  
**Packet source (READ ONLY):** `agentic_E1/exercise_batch_27_39.json` + per-section `quiz_card.json`  
**Knowledge boundary:** Only landing + prior + active packet content (theory, iDo, instructions, starters, hints, selfCheck stems)  
**Forbidden honored:** no `agentic_D1`/`agentic_D2`, no other attempts’ solutions, no `correctIndex`/answer keys, no TypeScript section sources  

---

## Summary

| Metric | Value |
|--------|------:|
| Sections | 13 (27–39) |
| Exercises solved | **312** (24 × 13) |
| Selfcheck stems | **56** (4×9 + 5×4) |
| Remaining `# TODO` in codes | **0** |
| Justifications &lt; 80 chars | **0** |
| Empty codes | **0** |
| `blocked_on` (exercises + selfcheck) | **0** |
| Syntax-parse errors (static) | **0** |
| Files updated | `section_XX/newbie_a_live.json` for XX=27..39 |
| Confidence band (exercises) | ~0.88 |
| Confidence band (selfcheck) | ~0.90 |

Each exercise entry includes:

- complete runnable `code` (starter completed; `# TODO` / DEFECTO predicates fixed)
- natural `justification_from_packet` (≥80 chars; instruction quote + iDo/demo + theory heads)
- `concepts_used`, `answer=completed_from_packet`, empty `blocked_on`

Meta on every file:

```
agent=newbie_a_live, persona=explorer, attempt_id=agentic_E1,
method=live_agentic_packet_only_no_execution,
artifact_origin=direct_agent_output, restart_from=landing,
code_execution_used=false,
agent_instance_id=newbie-a-explorer-E1-sXX-live,
forbidden_honored=true, packet_sha=<from section packet>
```

---

## Selfcheck chosen indices (Explorer)

Indices are 0-based into packet `selfCheck_stems[].options`, reasoned from theory/iDo only.

| Sec | Title (short) | Indices |
|----:|---------------|---------|
| 27 | pytest strategy | `[2, 0, 1, 3]` |
| 28 | data/property/integration tests | `[3, 1, 2, 0]` |
| 29 | SQL / relational ER store | `[0, 2, 3, 1]` |
| 30 | probabilistic ER | `[1, 3, 0, 2]` |
| 31 | graphs & relational evidence | `[2, 0, 1, 3]` |
| 32 | features without leakage | `[3, 1, 2, 0]` |
| 33 | supervised baselines | `[0, 2, 3, 1]` |
| 34 | metrics / calibration / thr | `[1, 3, 0, 2]` |
| 35 | explainability / equity | `[2, 0, 1, 3]` |
| 36 | clustering / anomalies / time | `[3, 1, 2, 0, 3]` |
| 37 | profiling / algorithms / perf | `[0, 2, 3, 1, 0]` |
| 38 | concurrency / o11y / workflows | `[1, 3, 0, 2, 1]` |
| 39 | responsible ML triage close | `[2, 0, 1, 3, 2]` |

### Reading of key stems (packet-grounded)

- **S27:** unit base of pyramid; deterministic oracle; surviving mutant ⇒ weak contract; matching tests = entity contracts not fraud.
- **S28:** metamorphic relations; golden drift needs review; over-mock hides bugs; flakes → determinism + fail CI.
- **S29:** canonical pair order; append-only decisions; atomic decision+evidence; repository encapsula SQL.
- **S30:** ER decides same-entity; blocking candidate recall; mid-band → clerical review; entity split avoids leakage.
- **S31:** centrality ≠ guilt; provenance audit; keep transfer detail; shared phone = fact to investigate.
- **S32–S35:** half-open windows, fail-closed transforms, group CV, PR/recall under imbalance, card layers + OOD abstain.
- **S36–S39:** anomaly = rarity signal; warmup/blocking/budgets; processes for CPU; needs_review label_space; human_only on incident.

---

## Per-section solve notes

| Sec | How Explorer completed exercises |
|----:|----------------------------------|
| 27–30 | Mostly `# TODO` + `forma esperada` prints; explicit fills for sqlite/UF/deepcopy/tempfile gaps |
| 31 | Graph drills: inserted missing primary prints (`n_nodes`, top hub, comps, path, redact, scale policy) |
| 32–35 | Fail-closed contracts: inverted `meets_contract` / assess predicates corrected; E3 missing → `REQUEST_*` |
| 36–37 | Clustering/perf drills: forma + multi-line `ok`/`n`/secondary labels; defects (min→max, counts, keys) |
| 38 | Concurrency/o11y: CPU→processes, I/O→async_or_threads, token bucket rate=2, redact, exp backoff |
| 39 | N3 triage: stage order CANON, evidence packet non-empty lists, human override, secrets denied, blameless PM |

Empty starters in the packet (`S32-T1-A-E3`, `S35-T1-A-E3`, `S35-T1-B-E3`, `S35-T4-A-E2`, `S35-T4-A-E3`) were reconstructed from instructions + sibling E1/E2 fixtures only.

---

## Files written

```
course-state/newbie_walkthrough/agentic_E1/section_27/newbie_a_live.json
… through …
course-state/newbie_walkthrough/agentic_E1/section_39/newbie_a_live.json
course-state/newbie_walkthrough/agentic_E1/fixes/NEWBIE_A_27_39.md
```

---

## Provenance checklist

| Field | Value |
|-------|-------|
| attempt_id | `agentic_E1` |
| method | `live_agentic_packet_only_no_execution` |
| artifact_origin | `direct_agent_output` |
| restart_from | `landing` |
| code_execution_used | `false` |
| agent_instance_id | `newbie-a-explorer-E1-sXX-live` |
| persona | `explorer` |
| forbidden_honored | `true` |

No D1/D2 lives read; no offline selfcheck keys; no code execution used to grade or invent outputs.
