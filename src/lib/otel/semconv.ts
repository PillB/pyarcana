// OpenTelemetry GenAI semantic-convention attribute names.
//
// Reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/
// We export the attribute names as `const string` so consumers can build
// span attributes with strong typing (no magic strings scattered around).
//
// Plus PyArcana-specific extensions (pyarcana.*) that carry the harness's
// governance/observability metadata (run id, provider mode, cost, index
// version, corpus scope, tool allowlist flag, approval gate, verifier
// faithfulness/precision, step number, remaining budget).

export const GEN_AI = {
  system: "gen_ai.system",
  operation: "gen_ai.operation.name",
  requestModel: "gen_ai.request.model",
  requestMaxTokens: "gen_ai.request.max_tokens",
  requestTemperature: "gen_ai.request.temperature",
  requestTopP: "gen_ai.request.top_p",
  prompt: "gen_ai.prompt",
  promptIsUntrusted: "gen_ai.prompt.is_untrusted",
  usageInputTokens: "gen_ai.usage.input_tokens",
  usageOutputTokens: "gen_ai.usage.output_tokens",
  usageCostUsd: "gen_ai.usage.cost_usd",
  responseFinishReasons: "gen_ai.response.finish_reasons",
  responseId: "gen_ai.response.id",
  responseModel: "gen_ai.response.model",
  toolName: "gen_ai.tool.name",
  toolInput: "gen_ai.tool.input",
  toolOutput: "gen_ai.tool.output",
  toolDescription: "gen_ai.tool.description",
} as const;

export const PYARCANA = {
  runId: "pyarcana.run_id",
  providerMode: "pyarcana.provider_mode",
  costUsd: "pyarcana.cost.usd",
  indexVersion: "pyarcana.index.version",
  corpusScope: "pyarcana.corpus.scope",
  toolAllowlisted: "pyarcana.tool.allowlisted",
  approvalRequired: "pyarcana.approval.required",
  verifierFaithfulness: "pyarcana.verifier.faithfulness",
  verifierContextPrecision: "pyarcana.verifier.context_precision",
  stepN: "pyarcana.step.n",
  budgetRemaining: "pyarcana.budget.remaining",
  webSearchEnabled: "pyarcana.web_search.enabled",
  untrustedWebWrapped: "pyarcana.web_search.untrusted_wrapped",
} as const;

/** Common OTel attribute names (not GenAI-specific) used by our tracer. */
export const OTEL = {
  serviceName: "service.name",
  spanKind: "span.kind",
  statusCode: "otel.status_code",
  statusDescription: "otel.status_description",
} as const;

/** GenAI operation names (values for gen_ai.operation.name). */
export const GEN_AI_OPERATIONS = {
  generate: "generate",
  embed: "embed",
  tool: "tool",
  rag: "rag",
  retrieve: "retrieve",
  run: "run",
} as const;

export type GenAiAttributeName = typeof GEN_AI[keyof typeof GEN_AI];
export type PyarcanaAttributeName = typeof PYARCANA[keyof typeof PYARCANA];
