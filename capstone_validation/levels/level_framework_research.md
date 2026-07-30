# Level framework research — Phase 1 synthesis

> Governing spec Section 4 — Level framework.
> This file cites the Phase-1 current-frameworks research (Task ID 1 — research
> subagent) that underwrites the four-level design and the per-level Dreyfus
> mappings. The full synthesis is captured in `/home/z/my-project/worklog.md`
> under *Task ID 1 — research*.

## Frameworks consulted

| Topic | Sources used | Design implication for PyArcana |
|---|---|---|
| Skill acquisition (curricular, not workplace) | Dreyfus 5-stage; Bloom revised; SOLO taxonomy | Provides a defensible 2D rubric (cognitive verb × structural depth) so N1–N4 can label *skill-within-domain* without conflating with workplace seniority. |
| Constructive alignment | Biggs, *Teaching for Quality Learning at University* | Mandates ILO ↔ task ↔ rubric verb-matching per capstone. PyArcana encodes this as `learningOutcomes` × `sectionContributions.iDo/weDo/youDo` × `rubric.criteria`. |
| Responsible AI cards | Mitchell et al., *Model Cards for Model Reporting* (ACM FAccT 2019); Gebru et al., *Datasheets for Datasets*; System Cards | Cascade across N2 → N3 → N4 → CP-FINAL: N2 datasheets, N3 model cards, N4 system cards, CP-FINAL aggregated system card. |
| Governance | NIST AI RMF 600-1 (govern–map–measure–manage) | Governance template for CP-N4-C.3 and CP-FINAL. |
| LLM security | OWASP LLM Top 10 (2025); arXiv 2510.23883 (Agentic AI Security survey) | 94.4% prompt-injection vulnerability → defines the CP-N4-C.2 red-team contract. |
| MLOps maturity | Microsoft Azure MLOps Maturity Model (0 → 4); canary/shadow/rollback | CP-N4-C.1 must define SLOs; CP-N4-C.2 must run a canary → rollback drill. |
| Multi-agent orchestration | LangGraph bounded loops + HITL interrupt; OpenAI Agents SDK; AutoGen; CrewAI; Google A2A | Bounded orchestrator with typed handoffs, tool allowlist, generator–verifier — the canonical CP-N4-C pattern. Other agent SDKs treated as swappable adapters. |
| RAG evaluation | RAGAS, ARES, TruLens | Four core metrics (faithfulness, answer relevance, context precision/recall) feed the CP-N4-C.2 eval gate. The harness's `verify()` enforces faithfulness ≥ 0.90 and context precision ≥ 0.70. |
| Entity-resolution benchmarks | ERBench (NeurIPS 2024); OAG-Bench; SMBench | Automatic verifiable gold for CP-N3-A. |
| Observability | OpenTelemetry GenAI semconv (`gen_ai.*` spans); Fiddler caveat | OTel covers infra not quality — pair with RAGAS. CP-N4-C.3 emits `span run.start`, `span rag.retrieve`, `span model.generate`, `span tool.propose`, `span approval.gate`, `span verifier.check`, `span run.end`. |
| Accessibility | W3C WCAG 2.2 AA | Floor for the `/` route and any dashboard capstone. Non-colour-only encoding, keyboard nav, 200% reflow, 24px targets. CP-N2-B rubric encodes accessibility as a critical criterion. |

## Net synthesis (from the research subagent's report)

> Research yields a concrete rubric skeleton (Dreyfus behaviour × Bloom verb ×
> SOLO depth × authentic artefact × responsible-AI card × security red-team ×
> observability span × WCAG audit) that the data layer encodes as JSON contracts
> for the 13 capstones.

The four-level design is therefore *evidence-based*: each level maps to a
curricular Dreyfus band (Novice → Advanced Beginner → Competent → Proficient),
pairs it with Bloom/SOLO structural depth, and requires the authentic artefacts
and responsible-AI cards the research flagged as non-negotiable.
