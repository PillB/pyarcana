# ADR — CP-N4-C Agentic Harness (fold N4-D in, no fourteenth capstone)
**Status:** Accepted · **Date:** 2026-07-29

`CP-N4-C` is expanded to version **3.0.0** and absorbs the requested production
multi-agent project via three sub-gates: CP-N4-C.1 (S49), CP-N4-C.2 (S50),
CP-N4-C.3 (S51). **S51 remains the principal gate.** A separate CP-N4-D is NOT created.

Required mechanisms (all mandatory): model portability (local+commercial adapters,
provider-neutral contracts, no-key deterministic path), timeouts, retry classification,
budget enforcement, fallback, provider-outage handling, bounded steps, bounded tool
calls, stop conditions, loop detection, typed handoffs, persistent run state, durable
resume, generator/verifier separation, RAG with access controls and citations,
retrieval & answer evaluation, narrow least-privilege tools, idempotency, dry-run,
sandboxing, human approval for sensitive side effects, web and SERP adapters, source
provenance, injection defence, holdout evaluations, trajectory evaluation, red teaming,
traces and spans, sensitive-data redaction, versioned models/prompts/datasets/indexes,
incident handling, rollback, system card, accessible UI.

A chatbot demo without these mechanisms does NOT count as the capstone.
