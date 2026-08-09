// PyArcana OTel GenAI barrel.
//
// The Tracer builds an OTLP/JSON-compatible span tree:
//   copilot.run (root) → agent.step.{plan,retrieve,generate,propose-tool,verify}
//     → {retrieval.rag, retrieval.web, llm.generate, tool.propose, tool.execute}
//
// Every string attribute is redacted via the RedactingSpanProcessor (emails,
// SSN-like, card-like, ID-like → [REDACTED]). Untrusted prompt content is
// tagged gen_ai.prompt.is_untrusted=true so it is never exported verbatim.

export * from "./semconv";
export * from "./redaction";
export * from "./tracer";
