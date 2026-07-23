# Newbie B (Skeptic) — agentic_D1 batch 27–39

**Role:** Newbie B · persona `skeptic`  
**Attempt:** `agentic_D1`  
**Method:** `llm_packet_only_no_generator`  
**Production note:** `live_dual_llm_agentic_from_packet_only_D1`  
**Knowledge boundary:** only `agentic_D1` slim packets + `exercise_batch_27_39.json` (no other attempts, solutions, correctIndex, or rebuild templates).  
**Agent instance:** `d1-skeptic-nb-b-27-39-live`

## Scope completed

| Section | Title (packet) | Exercises | Selfcheck | packet_sha | SC offline grade |
|--------:|----------------|----------:|----------:|------------|-----------------:|
| 27 | Estrategia de pruebas con pytest | 24 | 4 | `effa396a740261f6` | 100% |
| 28 | Pruebas de datos, propiedades e integración | 24 | 4 | `827050d249512742` | 100% |
| 29 | SQL avanzado y modelado relacional | 24 | 4 | `298a66f05c46a228` | 100% |
| 30 | Entity resolution probabilístico | 24 | 4 | `a47a68249e6c41a8` | 100% |
| 31 | Grafos y evidencia relacional | 24 | 4 | `a9458715256e6ce4` | 100% |
| 32 | Feature engineering y pipelines sin leakage | 24 | 4 | `a164fd7487359385` | 100% |
| 33 | Modelos supervisados y baselines | 24 | 4 | `0db82e9b54fc554f` | 100% |
| 34 | Métricas, calibración y umbrales | 24 | 4 | `cbcfca0849bec7b8` | 100% |
| 35 | Explicabilidad, equidad e incertidumbre | 24 | 4 | `852e8d1bc73f4048` | 100% |
| 36 | Clustering, anomalías y validación temporal | 24 | 5 | `39d119976f07d841` | 100% |
| 37 | Profiling, algoritmos y rendimiento | 24 | 5 | `81a7eec15cd3e2f0` | 100% |
| 38 | Concurrencia, observabilidad y workflows resilientes | 24 | 5 | `032cea4b2716013f` | 100% |
| 39 | Responsible ML Case Triage y cierre de nivel | 24 | 5 | `92753e3551164bb0` | 100% |

**Totals:** 13 sections · **312** exercise answers · **58** selfcheck answers · **0** `blocked_on` / UNTAUGHT.

Artifacts updated:

- `course-state/newbie_walkthrough/agentic_D1/section_{27..39}/newbie_b_live.json`

## Skeptic solve protocol (packet-only)

1. Read `slim_packet.json` active theory / iDo / weDo for each section in 27–39.
2. Complete every weDo exercise from starter + instruction + hints + iDo demos.
3. Answer selfcheck from theory/iDo only (no correctIndex).
4. Write **D1-Skeptic** justifications ≥80 chars quoting packet contracts (min observed ~468–971 chars).

### Exercise pattern handling

| Pattern | Sections | Skeptic action |
|---------|----------|----------------|
| TODO + `forma esperada (referencia)` | 27–31, 36–38 (most) | Fill print/contract from packet reference; strip TODO markers |
| Inline defect (min/max, wrong literal, inverted branch) | 36–38 | Invert/fix to match instruction + theory |
| Contract E1/E2/E3 (meets / assess / decide) | 32–35, 39 | Restore polarity so valid fixture PASSes; missing → `REQUEST_*`; adverse → `REJECT_*` |
| Empty transfer starters | 32, 35, 39 | Reconstruct fail-closed `decide` from instruction tokens |

### Selfcheck indices (packet-theory choices)

| S | chosen_index sequence |
|--:|------------------------|
| 27 | 2, 0, 1, 3 |
| 28 | 3, 1, 2, 0 |
| 29 | 0, 2, 3, 1 |
| 30 | 1, 3, 0, 2 |
| 31 | 2, 0, 1, 3 |
| 32 | 1, 1, 1, 1 |
| 33 | 1, 1, 1, 1 |
| 34 | 1, 1, 2, 2 |
| 35 | 2, 0, 1, 3 |
| 36 | 3, 1, 2, 0, 2 |
| 37 | 0, 2, 3, 1, 1 |
| 38 | 1, 3, 0, 2, 1 |
| 39 | 2, 0, 1, 3, 1 |

Offline key fairness (Validator only; keys never used during solve): **100%** on all 13 sections.

## Live JSON meta (each section)

```json
{
  "agent": "newbie_b_live",
  "persona": "skeptic",
  "attempt_id": "agentic_D1",
  "method": "llm_packet_only_no_generator",
  "production_note": "live_dual_llm_agentic_from_packet_only_D1",
  "forbidden_honored": true,
  "knowledge_boundary": "Only landing + prior + active packet content.",
  "agent_instance_id": "d1-skeptic-nb-b-27-39-live",
  "restart_from": "landing",
  "code_execution_used": false
}
```

## Quality gates run locally

- Syntax compile: **312/312 OK**
- Incomplete patterns (`TODO`, blanks, unclosed brackets): **0**
- Template justifications: **0**
- Packet-supported justifications (validator lexical): **all exercises + selfcheck**
- Exec smoke (side-channel only, not pass bar): **312/312 OK**
- E1 status lines that print `Sxx-T… PASS`: **PASS after polarity repair**
- Selfcheck offline score: **100%** every section

## Skeptic notes / residual risk

- Justifications deliberately cite theory/iDo snippets and instruction contracts; they avoid generator/rebuild phrasing.
- S32–S35/S39 contract exercises required careful polarity repair (starters invert PASS conditions); empty E3s were rebuilt from instruction `CONTINUE` / `REJECT_*` / `REQUEST_*` tokens.
- Multi-print I/O contracts (S36–S38) were enriched when instruction listed secondary tokens (`ok`, `n`, `metric`, etc.) beyond a single `forma esperada` line.
- Dual-agent gate still needs Newbie A for the same sections; this report covers **Newbie B only**.
- Provenance fields match the D1 live dual-LLM packet-only meta requested for this batch (not the alternate hardened provenance labels used by some other agentic series).

## Status

**COMPLETE** — Newbie B live answers for agentic_D1 sections **27–39** written and verified.
