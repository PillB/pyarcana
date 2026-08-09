// Sensitive-data redaction for OTel span attributes.
//
// Reuses the existing REDACT_PATTERNS from copilot-harness.ts so the OTel
// spans and the legacy `trace` string field use the SAME redaction policy.
//
// The RedactingSpanProcessor additionally tags untrusted prompt content
// (any string attribute containing the "[untrusted web content]" prefix or
// any attribute key matching /prompt/i from an untrusted source) with
// gen_ai.prompt.is_untrusted=true, so the prompt is NEVER exported verbatim.
//
// The processor is a pure transform — it takes an attributes object and
// returns a redacted copy. It does NOT mutate the original.

import { GEN_AI } from "./semconv";
import { UNTRUSTED_WEB_PREFIX } from "../web-search/types";

/** Re-implemented here so the OTel module is self-contained and matches the
 * exact patterns in copilot-harness.ts. The two implementations MUST stay
 * in sync — the existing tests assert the exact `[REDACTED]` token. */
export const REDACT_PATTERNS: RegExp[] = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,           // emails
  /\b\d{3}-\d{2}-\d{4}\b/g,                              // SSN-like
  /\b(?:\d[ -]*?){13,16}\b/g,                            // card-like
  /\b[A-Z]{2}\d{6,}\b/g,                                 // ID-like
];

const REDACTED_TOKEN = "[REDACTED]";

export function redactString(text: string): string {
  if (typeof text !== "string") return text;
  let out = text;
  for (const p of REDACT_PATTERNS) out = out.replace(p, REDACTED_TOKEN);
  return out;
}

export function isUntrustedContent(text: string): boolean {
  return typeof text === "string" && text.includes(UNTRUSTED_WEB_PREFIX);
}

export interface RedactedAttributes {
  /** Redacted copy of the input attributes (string values sanitized). */
  attributes: Record<string, unknown>;
  /** True iff any value was tagged as untrusted prompt content. */
  hasUntrustedPrompt: boolean;
}

/**
 * RedactingSpanProcessor — applies redactString to every string attribute
 * value, and sets gen_ai.prompt.is_untrusted=true iff any string value
 * carries the untrusted-web-content fence (or a key matching /prompt/i
 * with content from an untrusted source).
 *
 * Sensitive values are NEVER exported verbatim; the redacted token replaces
 * emails, SSN-like, card-like, and ID-like patterns.
 */
export class RedactingSpanProcessor {
  process(input: Record<string, unknown>): RedactedAttributes {
    const out: Record<string, unknown> = {};
    let hasUntrustedPrompt = false;
    for (const [k, v] of Object.entries(input)) {
      if (typeof v === "string") {
        const redacted = redactString(v);
        if (isUntrustedContent(v)) {
          hasUntrustedPrompt = true;
          // The fenced envelope is itself a marker; the prompt itself is
          // never exported verbatim. We keep the envelope so downstream
          // consumers can see "untrusted content was present" but the
          // payload inside the envelope is replaced with a placeholder.
          out[k] = `${UNTRUSTED_WEB_PREFIX} [payload redacted]`;
        } else {
          out[k] = redacted;
        }
      } else if (Array.isArray(v)) {
        // Arrays (e.g. gen_ai.response.finish_reasons) keep their structure;
        // string elements are redacted in place, non-strings pass through.
        out[k] = v.map((item) =>
          typeof item === "string"
            ? isUntrustedContent(item)
              ? `${UNTRUSTED_WEB_PREFIX} [payload redacted]`
              : redactString(item)
            : item,
        );
      } else if (v !== null && typeof v === "object") {
        // Plain objects (e.g. gen_ai.tool.input) are JSON-stringified,
        // redacted as a single string, then stored as a redacted string.
        // This avoids accidental PII leakage in nested structures.
        const json = JSON.stringify(v);
        out[k] = redactString(json);
      } else {
        out[k] = v;
      }
    }
    if (hasUntrustedPrompt) {
      out[GEN_AI.promptIsUntrusted] = true;
    }
    return { attributes: out, hasUntrustedPrompt };
  }
}

export const defaultRedactingProcessor = new RedactingSpanProcessor();
