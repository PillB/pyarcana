# PyArcana Capstone System — Worklog

## Environment reality (Phase 0)

- Sandbox: `/home/z/my-project` — a fresh Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui project (NOT a clone of PillB/pyarcana).
- Only one local commit exists (`a251060 Initial commit`); no git remote configured.
- `gh` CLI was missing; installed user-space at `~/.local/bin/gh` (v2.65.0). `tmux`/`screen` are NOT installed and there is no sudo.
- Network to github.com is reachable.
- GitHub device-flow auth started in a fully detached background process (`setsid` + `nohup` + `disown`) — the persistence technique the user confirmed worked previously. Process survives across Bash tool calls.
- Dev server already running on port 3000 (`bun run dev`).

## Cardinality invariant (locked)

- Level 1: S01–S13, capstones CP-N1-A (S04), CP-N1-B (S08), CP-N1-C (S13)
- Level 2: S14–S26, capstones CP-N2-A (S17), CP-N2-B (S21), CP-N2-C (S26)
- Level 3: S27–S39, capstones CP-N3-A (S30), CP-N3-B (S34), CP-N3-C (S39)
- Level 4: S40–S52, capstones CP-N4-A (S43), CP-N4-B (S47), CP-N4-C (S51)
- Final: S52, CP-FINAL (transversal, integrates 12 upstream)
- Total: **13 capstones** (12 level + 1 final)

## N4-D decision

Folded into CP-N4-C (default per spec). CP-N4-C gets three sub-gates:
- CP-N4-C.1 · S49 — runtime, adapters, RAG, tools, web/SERP, budgets, approval
- CP-N4-C.2 · S50 — evaluation, red-team, reliability, recovery
- CP-N4-C.3 · S51 — observability, governance, incident-response, UX, final gate
No separate CP-N4-D principal capstone is created.

## Build plan

1. Data layer: 13 capstone contracts + 4 levels + 52 sections + rubrics (JSON).
2. Learner-facing Capstones UI on `/` route (only user-visible route).
3. Runnable CP-N4-C harness (TypeScript reference) + CP-FINAL integration contracts.
4. Stephen Fry Spanish+English redaction on briefs/theory.
5. Automated tests (bun test) + agent-browser verification.
6. Commit locally + push to PillB/pyarcana when auth completes.


---
Task ID: 1
Agent: general-purpose (research)
Task: Phase 1 current-frameworks research for PyArcana capstones

Work Log:
- Read worklog.md to lock context (4 levels, 13 capstones, CP-N4-C three sub-gates, only `/` route user-visible).
- Invoked z-ai web_search CLI (skill) for 12 topic queries + 4 supplementary queries (Dreyfus critiques, OAG, AI Alliance guardrails, LangGraph HITL patterns).
- Stored 16 JSON result files under /tmp/research; extracted top-5 hits (title, URL, snippet, date, citations) for synthesis.
- Cross-referenced authoritative sources: W3C WCAG 2.2, OWASP LLM Top 10 2025, NIST AI 600-1, OpenTelemetry GenAI semconv, Microsoft Azure MLOps Maturity Model, NeurIPS 2024 ERBench, ACM Model Cards (Mitchell 2019), arXiv 2510.23883 (Agentic AI Security survey), arXiv 2405.07437 (RAG eval survey).
- Synthesized brief (below) with 2–4 sources and 3–5 design implications per topic, mapped explicitly to PyArcana capstones (N1→N4 + CP-FINAL + CP-N4-C.1/.2/.3 sub-gates).

Stage Summary:
- Pedagogy: Dreyfus 5-stage + Bloom revised + SOLO provide a defensible 2D rubric (cognitive verb × structural depth) that lets PyArcana label N1–N4 as skill-within-domain WITHOUT conflating them with workplace seniority titles. Constructive alignment (Biggs) mandates ILO↔task↔rubric verb-matching per capstone; authentic assessment requires practitioner artefacts (model card, runbook, eval harness, incident report), not essays.
- ER & RAG: ERBench/OAG-Bench/SMBench give automatic, verifiable gold for entity resolution; RAGAS/ARES/TruLens give 4 core metrics (faithfulness, answer relevance, context precision/recall) + citation grounding. Both feed CP-N4-C.2 eval gate.
- Responsible AI: Model Cards (Mitchell) / Datasheets (Gebru) / System Cards cascade across N2→N3→N4→CP-FINAL; NIST AI 600-1 govern-map-measure-manage = governance template; OWASP LLM Top 10 2025 + arXiv agentic security survey (94.4% prompt-injection vulnerable) define the red-team contract.
- MLOps/LLMOps: Azure maturity model 0→4 + canary/shadow/rollback; CP-N4-C.1 must define SLOs, CP-N4-C.2 must run a canary→rollback drill.
- Multi-agent: LangGraph bounded loops + HITL interrupt + tool allowlist + generator-verifier is the canonical pattern; OpenAI Agents SDK / AutoGen / CrewAI / Google A2A treated as swappable adapters behind a common orchestrator interface.
- Observability: OpenTelemetry GenAI semconv (gen_ai.* spans) + sensitive-data redaction; Fiddler caveat — OTel covers infra not quality, pair with RAGAS.
- Accessibility: WCAG 2.2 AA is the floor for the `/` route and any dashboard capstone — non-colour-only encoding, keyboard nav, 200% reflow, 24px targets, axe/pa11y evidence in rubric.
- Net: research yields a concrete rubric skeleton (Dreyfus behaviour × Bloom verb × SOLO depth × authentic artefact × responsible-AI card × security red-team × observability span × WCAG audit) that the next phase can encode as JSON contracts for the 13 capstones.

