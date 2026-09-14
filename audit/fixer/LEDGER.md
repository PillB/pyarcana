# Fixer ledger

Every box is computed from an artifact, never hand-ticked. Regenerate with
`python3 tools/fixer/ledger.py`; `--check` fails if it is stale.

| step | meaning | done |
|---|---|---:|
| `findings` | codex round applied, registry findings closed | 5/52 |
| `redaction` | grammar and redaction pass applied | 8/52 |
| `concepts` | load-bearing concepts have their own subtopic (D3) | 0/52 |
| `figures` | at least two figures carrying real teaching (D4) | 43/52 |
| `vocab` | no term used before it is defined | 25/52 |
| `ids` | no identifier-shaped synthetic value (D2) | 50/52 |
| `runtime` | every snippet executes under .venv-content | 52/52 |

## Sections

| sec | findings | figs | run-ons | findings | redaction | concepts | figures | vocab | ids | runtime |
|---|---|---:|---:|---|---|---|---|---|---|---|
| **S01** setup | 19/21 | 2 | 10 | [ ] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S02** basics | 21/21 | 0 | 4 | [x] | [x] | [ ] | [ ] | [ ] | [x] | [x] |
| **S03** data-structures | 12/17 | 2 | 2 | [ ] | [x] | [ ] | [x] | [ ] | [ ] | [x] |
| **S04** functions-modules | 18/18 | 2 | 2 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S05** oop | 22/22 | 2 | 0 | [x] | [x] | [ ] | [x] | [x] | [x] | [x] |
| **S06** numpy | 20/20 | 2 | 1 | [x] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S07** data-acquisition | 19/19 | 2 | 4 | [x] | [x] | [ ] | [x] | [x] | [x] | [x] |
| **S08** pandas | 26/27 | 2 | 2 | [ ] | [x] | [ ] | [x] | [ ] | [x] | [x] |
| **S09** visualization | 0/22 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [ ] | [x] |
| **S10** sklearn | 0/22 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S11** testing | 0/22 | 1 | 11 | [ ] | [ ] | [ ] | [ ] | [ ] | [x] | [x] |
| **S12** performance | 0/23 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S13** rpa-automation | 0/27 | 2 | 9 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S14** security | 0/23 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S15** stdlib-deep | 0/18 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S16** wxpython-gui | 0/23 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S17** packaging | 0/23 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S18** data-engineering | 0/24 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S19** databases-orm | 0/24 | 1 | 2 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S20** rag | 0/24 | 1 | 2 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S21** fastapi | 0/25 | 1 | 2 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S22** rapidfuzz-entity | 0/28 | 3 | 5 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S23** computer-vision | 0/27 | 1 | 5 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S24** rpa-advanced | 0/33 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S25** streamlit-dashboards | 0/33 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S26** integrator-phase1 | 0/35 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S27** async-concurrency | 0/30 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S28** llm-agents | 0/35 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S29** mlops | 0/34 | 3 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S30** security-infra | 0/35 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S31** streaming-data | 0/35 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S32** microservices | 0/37 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S33** advanced-models | 0/45 | 3 | 6 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S34** cv-ai-integration | 0/43 | 2 | 10 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S35** system-design | 0/39 | 1 | 6 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S36** ai-apis-advanced | 0/43 | 3 | 3 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S37** dbt-bigquery | 0/36 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S38** performance-extreme | 0/57 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S39** integrator-phase2 | 0/81 | 1 | 3 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |
| **S40** architecture-ddd-decisions | 0/67 | 2 | 4 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S41** llm-finetuning | 0/70 | 2 | 5 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S42** graph-rag | 0/50 | 2 | 1 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S43** llmops | 0/44 | 3 | 0 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S44** multimodal | 0/101 | 2 | 2 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S45** iac | 0/43 | 3 | 9 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S46** gpu-computing | 0/41 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S47** opensource | 0/45 | 4 | 4 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S48** ai-governance | 0/46 | 4 | 2 | [ ] | [ ] | [ ] | [x] | [ ] | [x] | [x] |
| **S49** data-contracts | 0/54 | 3 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S50** tech-leadership | 0/60 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S51** integrator-final | 0/84 | 2 | 3 | [ ] | [ ] | [ ] | [x] | [x] | [x] | [x] |
| **S52** career-strategy | 0/90 | 1 | 3 | [ ] | [ ] | [ ] | [ ] | [x] | [x] | [x] |

## The round, per section

Run in this order. A step that cannot be finished is recorded in
`audit/fixer/OPEN_QUESTIONS.md` rather than skipped silently.

1. **findings** — codex round applied, registry findings closed
2. **redaction** — grammar and redaction pass applied
3. **concepts** — load-bearing concepts have their own subtopic (D3)
4. **figures** — at least two figures carrying real teaching (D4)
5. **vocab** — no term used before it is defined
6. **ids** — no identifier-shaped synthetic value (D2)
7. **runtime** — every snippet executes under .venv-content

Commands: `tools/fixer/run_round.sh SXX --apply`, then
`tools/fixer/build_redaction_prompt.py SXX` for the prose pass.

`concepts` has no automatic proxy: a load-bearing concept needing its own
subtopic (D3) is a judgement, so that column is ticked by a human reading the
section, not by this script.
