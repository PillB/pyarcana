# Task 6-webserp-otel — Work Record

**Agent:** full-stack-developer
**Task:** Implement web/SERP adapter + OTel GenAI structured spans for CP-N4-C

## Context

- Read `/home/z/my-project/worklog.md` (PyArcana capstone system: 4 levels, 13 capstones, CP-N4-C three sub-gates, only `/` route user-visible).
- Read `/home/z/my-project/src/lib/copilot-harness.ts` (existing harness: provider-neutral ModelAdapter, RAG with access filtering, narrow tools, generator-verifier, redaction, budget, loop detection, 527 lines).
- Read `/home/z/my-project/tests/capstones.test.ts` (existing 119 tests — must not break).

## Files Created

### Gap A — Web/SERP adapter (8 files)
- `src/lib/web-search/types.ts` — WebSearchProvider interface, WebSearchResult type, WebSearchBudget, WebSearchOptions, WebSearchQuery, UNTRUSTED_WEB_PREFIX, DEFAULT_WEB_SEARCH_BUDGET.
- `src/lib/web-search/dedup.ts` — normalizeUrl (strip utm_*, sort query params, lowercase host, drop fragment, default-port strip, trailing-slash normalize), urlHash (sha1 hex), domainOf, dedupeResults.
- `src/lib/web-search/budget.ts` — WebSearchBudgetTracker class (reserveQuery, recordResults, addCost, stop, canQuery, snapshot).
- `src/lib/web-search/robots.ts` — RobotsConfig, makeRobotsConfig, isAllowed (denylist wins > allowlist > mode default), filterAllowed, DEFAULT_ROBOTS_ALLOWLIST (owasp.org, w3.org, nist.gov, opentelemetry.io, example.com, synthetic.example), DEFAULT_ROBOTS_DENYLIST (evil.example, attacker.example).
- `src/lib/web-search/providers/no-key.ts` — noKeyWebProvider: deterministic synthetic corpus (OWASP, WCAG, OTel GenAI, NIST AI RMF, PyArcana runbook, evil.example canary). Uses default allowlist when no includeDomains provided.
- `src/lib/web-search/providers/tavily.ts` — tavilyProvider: calls Tavily REST API if TAVILY_API_KEY set, else falls back to no-key. Defense-in-depth domain re-filtering.
- `src/lib/web-search/index.ts` — barrel + searchWeb() facade (picks provider, enforces budget, dedupes, wraps snippets as `[untrusted web content] …`, returns WebSearchResult[] with provenance). Plus pickProvider, wrapUntrusted, toCitation helpers.
- `tests/web-search.test.ts` — 29 tests across 8 describe blocks (no-key provider, budget, domain restrictions, URL dedup, injection treatment, fallback, provenance, citation+idempotency).

### Gap B — OTel GenAI structured spans (5 files)
- `src/lib/otel/semconv.ts` — GEN_AI attribute names (gen_ai.system, gen_ai.request.model, gen_ai.request.max_tokens, gen_ai.request.temperature, gen_ai.prompt, gen_ai.prompt.is_untrusted, gen_ai.usage.input_tokens, gen_ai.usage.output_tokens, gen_ai.usage.cost_usd, gen_ai.response.finish_reasons, gen_ai.response.id, gen_ai.response.model, gen_ai.tool.name, gen_ai.tool.input, gen_ai.tool.output, gen_ai.tool.description), PYARCANA attributes (run_id, provider_mode, cost.usd, index.version, corpus.scope, tool.allowlisted, approval.required, verifier.faithfulness, verifier.context_precision, step.n, budget.remaining, web_search.enabled, web_search.untrusted_wrapped), OTEL common, GEN_AI_OPERATIONS.
- `src/lib/otel/redaction.ts` — REDACT_PATTERNS (email, SSN-like, card-like, ID-like — same as copilot-harness.ts), redactString, isUntrustedContent, RedactingSpanProcessor class (redacts strings, arrays keep structure with redacted string elements, objects JSON-stringified + redacted, untrusted prompt content tagged gen_ai.prompt.is_untrusted=true and payload replaced with placeholder).
- `src/lib/otel/tracer.ts` — Tracer class (startSpan, endSpan, getCurrentSpan, getRootSpan, getSpans, export, exportJSON). Span tree: traceId (32 hex), spanId (16 hex), parentSpanId linkage, startUnixNano/endUnixNano (BigInt via BigInt() constructor for ES2017 compat), durationMs. Plus helper builders: startRun, startAgentStep, startLlmGenerate, llmGenerateEndAttrs, ragRetrieveAttrs, webRetrieveAttrs, toolCallAttrs, verifierAttrs, runEndAttrs.
- `src/lib/otel/index.ts` — barrel export.
- `tests/otel-spans.test.ts` — 21 tests across 6 describe blocks (span tree, gen_ai.* attributes, redaction, token/cost/latency, id format + JSON export, versions + RAG/web retrieval).

## Files Modified

### `src/lib/copilot-harness.ts`
- Added imports: `node:crypto` createHash, OTel tracer + helpers, web-search searchWeb + WebSearchResult type.
- Added `otelSpans?: ExportedSpan[]` and `webResults?: WebSearchResult[]` as OPTIONAL fields to CopilotRunResult (existing tests unaffected).
- Added `webSearch?: boolean` to RunOptions.
- `runHarness` now builds a Tracer alongside the legacy `trace` string; creates root `copilot.run` span with pyarcana.run_id / pyarcana.provider_mode / task / pyarcana.web_search.enabled; agent.step.{plan,retrieve,generate,propose-tool,verify} children; retrieval.rag / retrieval.web (when webSearch=true) / llm.generate (with gen_ai.request.model, gen_ai.usage.input_tokens, gen_ai.usage.output_tokens, gen_ai.usage.cost_usd, gen_ai.response.finish_reasons) / tool.propose (with gen_ai.tool.name, gen_ai.tool.input, pyarcana.tool.allowlisted, pyarcana.approval.required) / verifier.check (with pyarcana.verifier.faithfulness, pyarcana.verifier.context_precision) leaves. Result includes `otelSpans: tracer.export()` and `webResults` (when webSearch=true).
- `runCopilotHarness` (sync façade) left UNCHANGED — preserves the idempotency test invariant (deterministic shape, no random IDs/timestamps).
- Legacy `trace: string` field preserved exactly — backward-compat with all existing tests.

### `tests/capstones.test.ts`
- Appended 9 new tests in a new `describe("CP-N4-C web/SERP + OTel integration (Task 6)")` block:
  1. web/SERP adapter integration: web results present when webSearch=true
  2. web results are wrapped as untrusted (injection treatment)
  3. OTel spans present in the result (structured span array)
  4. OTel spans have gen_ai.* attributes (semantic conventions)
  5. OTel spans are redacted (no PII leaks through structured spans)
  6. OTel span tree: root → agent.step.* → leaves (rag/llm/tool/verifier)
  7. webSearch=false (default) produces no webResults field
  8. OTel pyarcana.* governance attributes on root span
  9. OTel export is JSON-serialisable (durable resume invariant)
- Existing 119 tests UNCHANGED.

## Test Results

```
268 pass, 0 fail, 2726 expect() calls
Ran 268 tests across 5 files:
- tests/capstones.test.ts (128 tests: 119 original + 9 new)
- tests/web-search.test.ts (29 tests, NEW)
- tests/otel-spans.test.ts (21 tests, NEW)
- tests/system-card.test.ts (90 tests, pre-existing from Task 5)
- tests/contract/contract-tests.test.ts (pre-existing)
```

## TypeScript

`bunx tsc --noEmit -p tsconfig.json` — zero errors in new code (`src/lib/otel/*`, `src/lib/web-search/*`, modified `src/lib/copilot-harness.ts`). Pre-existing errors in `examples/websocket/*`, `skills/*`, and `tests/*.test.ts` (`bun:test` import + line 512 `requiresApproval`) are unrelated to this task and were present before my changes.

## Lint

`bun run lint` — 0 errors, 0 warnings.

## Invariants Preserved

- All 119 existing capstones tests pass unchanged.
- Provider-neutral contracts (no-key always available).
- Bounded loops, RAG access filtering, narrow tools, generator-verifier, redaction, stop-safely.
- Web snippets wrapped as `[untrusted web content] …` so verifier never treats open-web text as trusted instruction.
- OTel spans redacted via same REDACT_PATTERNS as legacy `trace` string.
- Untrusted prompt content tagged `gen_ai.prompt.is_untrusted=true`, payload never exported verbatim.
