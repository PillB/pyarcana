// OpenTelemetry GenAI-compliant Tracer.
//
// Builds a span tree:
//   root copilot.run (pyarcana.run_id, pyarcana.provider_mode, …)
//     └── agent.step (pyarcana.step.n)
//           ├── retrieval.rag / retrieval.web (gen_ai.operation.name=retrieve)
//           ├── llm.generate (gen_ai.operation.name=generate)
//           └── tool.propose / tool.execute (gen_ai.operation.name=tool)
//
// Each span carries: traceId, spanId, parentSpanId, name, attributes
// (redacted via RedactingSpanProcessor), startUnixNano, endUnixNano.
//
// export() returns an OTLP/JSON-compatible array of span objects. The
// existing text-based `trace` field in copilot-harness.ts is preserved
// for UI backward-compat; the structured `otelSpans` array is the new
// canonical observability surface.

import { randomBytes } from "node:crypto";
import { GEN_AI, GEN_AI_OPERATIONS, OTEL, PYARCANA } from "./semconv";
import { RedactingSpanProcessor, defaultRedactingProcessor } from "./redaction";

export type SpanKind = "internal" | "client" | "server" | "producer" | "consumer";

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  kind: SpanKind;
  attributes: Record<string, unknown>;
  startUnixNano: string;
  endUnixNano: string | null;
  /** True iff endSpan() was called. */
  ended: boolean;
  /** Original (pre-redaction) attributes — kept for in-process audit, never exported. */
  _rawAttributes: Record<string, unknown>;
}

export interface ExportedSpan {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  kind: SpanKind;
  attributes: Record<string, unknown>;
  startUnixNano: string;
  endUnixNano: string;
  durationMs: number;
}

function nowNano(): string {
  // High-resolution monotonic+wall clock nanoseconds (BigInt → string).
  // Note: BigInt literals (1n) require target ES2020+; we use BigInt(...) to
  // stay compatible with the project's ES2017 target.
  const ms = Date.now();
  const million = BigInt(1_000_000);
  const hr = process.hrtime.bigint() % million;
  return String(BigInt(ms) * million + hr);
}

function randHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

export class Tracer {
  private spans: Span[] = [];
  private stack: Span[] = [];
  private root: Span | null = null;
  private readonly processor: RedactingSpanProcessor;
  readonly traceId: string;

  constructor(processor: RedactingSpanProcessor = defaultRedactingProcessor, traceId?: string) {
    this.processor = processor;
    this.traceId = traceId ?? randHex(16); // 128-bit trace id
  }

  /**
   * Start a new span. If `parent` is omitted, the parent is the current top
   * of the stack (or null for the root span).
   */
  startSpan(
    name: string,
    parent?: Span | null,
    attributes: Record<string, unknown> = {},
    kind: SpanKind = "internal",
  ): Span {
    const parentSpan = parent !== undefined ? parent : this.stack[this.stack.length - 1] ?? null;
    const span: Span = {
      traceId: this.traceId,
      spanId: randHex(8), // 64-bit span id
      parentSpanId: parentSpan ? parentSpan.spanId : null,
      name,
      kind,
      attributes: {},
      startUnixNano: nowNano(),
      endUnixNano: null,
      ended: false,
      _rawAttributes: { ...attributes },
    };
    this.spans.push(span);
    this.stack.push(span);
    if (!this.root) this.root = span;
    return span;
  }

  /**
   * End a span. The attributes passed at end time are merged with those
   * passed at start time and then redacted via the RedactingSpanProcessor.
   */
  endSpan(span: Span, endAttributes: Record<string, unknown> = {}): Span {
    if (span.ended) return span;
    const merged = { ...span._rawAttributes, ...endAttributes };
    const { attributes } = this.processor.process(merged);
    span.attributes = attributes;
    span.endUnixNano = nowNano();
    span.ended = true;
    // Pop from the stack if it is the current top.
    const top = this.stack[this.stack.length - 1];
    if (top && top.spanId === span.spanId) this.stack.pop();
    else {
      // Remove the span from the stack regardless of position.
      this.stack = this.stack.filter((s) => s.spanId !== span.spanId);
    }
    return span;
  }

  /** The currently-open span, or null if no span is active. */
  getCurrentSpan(): Span | null {
    return this.stack[this.stack.length - 1] ?? null;
  }

  /** The root span (copilot.run), or null if no span has been started. */
  getRootSpan(): Span | null {
    return this.root;
  }

  /** All spans, in start order (not yet redacted for ended ones — but
   *  `attributes` on ended spans is already redacted). */
  getSpans(): Span[] {
    return [...this.spans];
  }

  /**
   * Export an OTLP/JSON-compatible array of span objects.
   * Ended spans emit their redacted attributes; in-flight spans are force-ended.
   */
  export(): ExportedSpan[] {
    const out: ExportedSpan[] = [];
    for (const s of this.spans) {
      if (!s.ended) this.endSpan(s);
      const startNs = BigInt(s.startUnixNano);
      const endNs = BigInt(s.endUnixNano ?? s.startUnixNano);
      const durationMs = Number(endNs - startNs) / 1_000_000;
      out.push({
        traceId: s.traceId,
        spanId: s.spanId,
        parentSpanId: s.parentSpanId,
        name: s.name,
        kind: s.kind,
        attributes: s.attributes,
        startUnixNano: s.startUnixNano,
        endUnixNano: s.endUnixNano ?? s.startUnixNano,
        durationMs: Math.round(durationMs * 1000) / 1000,
      });
    }
    return out;
  }

  /** Convenience: serialise to a JSON string (for OTLP/HTTP-JSON export). */
  exportJSON(): string {
    return JSON.stringify({ resourceSpans: [{ scopeSpans: [{ spans: this.export() }] }] });
  }
}

// ─── helper builders for common GenAI spans ───────────────────────────

export interface RunStartAttrs {
  runId: string;
  providerMode: string;
  task: string;
  webSearchEnabled?: boolean;
}

export function startRun(tracer: Tracer, attrs: RunStartAttrs): Span {
  return tracer.startSpan(
    "copilot.run",
    null,
    {
      [GEN_AI.system]: "pyarcana",
      [GEN_AI.operation]: GEN_AI_OPERATIONS.run,
      [PYARCANA.runId]: attrs.runId,
      [PYARCANA.providerMode]: attrs.providerMode,
      [OTEL.serviceName]: "pyarcana-copilot",
      [OTEL.spanKind]: "internal",
      task: attrs.task,
      [PYARCANA.webSearchEnabled]: attrs.webSearchEnabled ?? false,
    },
    "internal",
  );
}

export interface AgentStepAttrs {
  stepN: number;
  stepName: string;
}

export function startAgentStep(tracer: Tracer, parent: Span, attrs: AgentStepAttrs): Span {
  return tracer.startSpan(
    `agent.step.${attrs.stepName}`,
    parent,
    {
      [GEN_AI.operation]: GEN_AI_OPERATIONS.run,
      [PYARCANA.stepN]: attrs.stepN,
      stepName: attrs.stepName,
    },
    "internal",
  );
}

export interface LlmGenerateAttrs {
  provider: string;
  model: string;
  maxTokens: number;
  temperature: number;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  finishReason: string;
  latencyMs: number;
}

export function startLlmGenerate(tracer: Tracer, parent: Span): Span {
  return tracer.startSpan("llm.generate", parent, {
    [GEN_AI.operation]: GEN_AI_OPERATIONS.generate,
    [GEN_AI.system]: "pyarcana",
  }, "client");
}

export interface ToolCallAttrs {
  name: string;
  input: unknown;
  output: unknown;
  allowlisted: boolean;
  requiresApproval: boolean;
}

export interface RagRetrieveAttrs {
  hits: number;
  indexVersion: string;
  scope: string;
}

export interface WebRetrieveAttrs {
  query: string;
  hits: number;
  provider: string;
  costUsd: number;
  untrustedWrapped: boolean;
}

export interface VerifierAttrs {
  passed: boolean;
  faithfulness: number;
  contextPrecision: number;
}

export interface RunEndAttrs {
  stoppedSafely: boolean;
  stopReason: string;
  withinBudget: boolean;
  budgetRemaining: number;
}

/** Helper: build the attributes payload for the model.generate end span. */
export function llmGenerateEndAttrs(a: LlmGenerateAttrs): Record<string, unknown> {
  return {
    [GEN_AI.system]: "pyarcana",
    [GEN_AI.requestModel]: a.model,
    [GEN_AI.requestMaxTokens]: a.maxTokens,
    [GEN_AI.requestTemperature]: a.temperature,
    [GEN_AI.responseModel]: a.model,
    [GEN_AI.usageInputTokens]: Math.round(a.tokensIn),
    [GEN_AI.usageOutputTokens]: Math.round(a.tokensOut),
    [GEN_AI.usageCostUsd]: a.costUsd,
    [GEN_AI.responseFinishReasons]: [a.finishReason],
    [PYARCANA.costUsd]: a.costUsd,
    latencyMs: a.latencyMs,
  };
}

export function ragRetrieveAttrs(a: RagRetrieveAttrs): Record<string, unknown> {
  return {
    [GEN_AI.operation]: GEN_AI_OPERATIONS.retrieve,
    [PYARCANA.indexVersion]: a.indexVersion,
    [PYARCANA.corpusScope]: a.scope,
    hits: a.hits,
  };
}

export function webRetrieveAttrs(a: WebRetrieveAttrs): Record<string, unknown> {
  return {
    [GEN_AI.operation]: GEN_AI_OPERATIONS.retrieve,
    [PYARCANA.costUsd]: a.costUsd,
    [PYARCANA.untrustedWebWrapped]: a.untrustedWrapped,
    query: a.query,
    hits: a.hits,
    provider: a.provider,
  };
}

export function toolCallAttrs(a: ToolCallAttrs): Record<string, unknown> {
  return {
    [GEN_AI.operation]: GEN_AI_OPERATIONS.tool,
    [GEN_AI.toolName]: a.name,
    [GEN_AI.toolInput]: a.input,
    [GEN_AI.toolOutput]: a.output,
    [PYARCANA.toolAllowlisted]: a.allowlisted,
    [PYARCANA.approvalRequired]: a.requiresApproval,
  };
}

export function verifierAttrs(a: VerifierAttrs): Record<string, unknown> {
  return {
    [PYARCANA.verifierFaithfulness]: a.faithfulness,
    [PYARCANA.verifierContextPrecision]: a.contextPrecision,
    passed: a.passed,
  };
}

export function runEndAttrs(a: RunEndAttrs): Record<string, unknown> {
  return {
    stoppedSafely: a.stoppedSafely,
    stopReason: a.stopReason,
    withinBudget: a.withinBudget,
    [PYARCANA.budgetRemaining]: a.budgetRemaining,
  };
}
