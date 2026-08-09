"""OTel GenAI semantic-convention-compatible span export.

This module adds an export layer that maps the harness's internal Span
objects to the OpenTelemetry GenAI semantic conventions (gen_ai.* attributes)
so traces can be consumed by OTLP-compatible backends (Datadog, Honeycomb,
Jaeger, etc.).

It does NOT replace the existing tracing.py module; it sits on top of it
and produces an OTLP/JSON-compatible export from the same Span tree.

Reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/
"""
from __future__ import annotations

import json
import time
from typing import Any, Dict, List, Optional

# ───────────────────────── OTel GenAI semantic convention attribute names ─────────────────────────

# Core gen_ai.* attributes (per OTel GenAI semconv)
GEN_AI_SYSTEM = "gen_ai.system"                    # e.g. "pyarcana"
GEN_AI_REQUEST_MODEL = "gen_ai.request.model"       # e.g. "deterministic-double"
GEN_AI_REQUEST_MAX_TOKENS = "gen_ai.request.max_tokens"
GEN_AI_REQUEST_TEMPERATURE = "gen_ai.request.temperature"
GEN_AI_PROMPT = "gen_ai.prompt"
GEN_AI_PROMPT_IS_UNTRUSTED = "gen_ai.prompt.is_untrusted"
GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens"
GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens"
GEN_AI_USAGE_COST_USD = "gen_ai.usage.cost_usd"     # PyArcana extension
GEN_AI_RESPONSE_FINISH_REASONS = "gen_ai.response.finish_reasons"
GEN_AI_RESPONSE_ID = "gen_ai.response.id"
GEN_AI_RESPONSE_MODEL = "gen_ai.response.model"
GEN_AI_TOOL_NAME = "gen_ai.tool.name"
GEN_AI_TOOL_INPUT = "gen_ai.tool.input"
GEN_AI_TOOL_OUTPUT = "gen_ai.tool.output"

# PyArcana-specific extensions (not in the OTel spec, but useful for governance)
PYARCANA_RUN_ID = "pyarcana.run_id"
PYARCANA_PROVIDER_MODE = "pyarcana.provider_mode"
PYARCANA_COST_USD = "pyarcana.cost.usd"
PYARCANA_INDEX_VERSION = "pyarcana.index.version"
PYARCANA_CORPUS_SCOPE = "pyarcana.corpus.scope"
PYARCANA_TOOL_ALLOWLISTED = "pyarcana.tool.allowlisted"
PYARCANA_APPROVAL_REQUIRED = "pyarcana.approval.required"
PYARCANA_VERIFIER_FAITHFULNESS = "pyarcana.verifier.faithfulness"
PYARCANA_VERIFIER_CONTEXT_PRECISION = "pyarcana.verifier.context_precision"
PYARCANA_STEP_N = "pyarcana.step.n"
PYARCANA_BUDGET_REMAINING = "pyarcana.budget.remaining"
PYARCANA_WEB_SEARCH_ENABLED = "pyarcana.web_search.enabled"
PYARCANA_WEB_SEARCH_UNTRUSTED_WRAPPED = "pyarcana.web_search.untrusted_wrapped"


def _to_otlp_span(span: Any, trace_id: str, parent_span_id: Optional[str] = None) -> Dict[str, Any]:
    """Convert an internal Span to an OTLP/JSON-compatible span object."""
    span_id = span.span_id if hasattr(span, "span_id") else str(id(span))
    attrs = dict(span.attrs) if hasattr(span, "attrs") else {}

    # Map internal attribute names to OTel GenAI conventions where possible
    mapped: Dict[str, Any] = {}
    for k, v in attrs.items():
        if k in ("provider", "system"):
            mapped[GEN_AI_SYSTEM] = "pyarcana"
        elif k in ("model", "request_model"):
            mapped[GEN_AI_REQUEST_MODEL] = v
        elif k in ("max_tokens",):
            mapped[GEN_AI_REQUEST_MAX_TOKENS] = v
        elif k in ("temperature",):
            mapped[GEN_AI_REQUEST_TEMPERATURE] = v
        elif k in ("tokens_in", "input_tokens"):
            mapped[GEN_AI_USAGE_INPUT_TOKENS] = v
        elif k in ("tokens_out", "output_tokens"):
            mapped[GEN_AI_USAGE_OUTPUT_TOKENS] = v
        elif k in ("cost", "cost_usd"):
            mapped[GEN_AI_USAGE_COST_USD] = v
            mapped[PYARCANA_COST_USD] = v
        elif k in ("finish_reason", "finish_reasons"):
            mapped[GEN_AI_RESPONSE_FINISH_REASONS] = [v] if isinstance(v, str) else v
        elif k in ("response_model", "response.id"):
            mapped[GEN_AI_RESPONSE_MODEL] = v
        elif k in ("tool_name", "tool.name"):
            mapped[GEN_AI_TOOL_NAME] = v
        elif k in ("tool_input", "tool.input"):
            mapped[GEN_AI_TOOL_INPUT] = v
        elif k in ("tool_output", "tool.output"):
            mapped[GEN_AI_TOOL_OUTPUT] = v
        elif k in ("run_id",):
            mapped[PYARCANA_RUN_ID] = v
        elif k in ("provider_mode", "mode"):
            mapped[PYARCANA_PROVIDER_MODE] = v
        elif k in ("index_version",):
            mapped[PYARCANA_INDEX_VERSION] = v
        elif k in ("corpus_scope", "scope"):
            mapped[PYARCANA_CORPUS_SCOPE] = v
        elif k in ("allowlisted", "tool_allowlisted"):
            mapped[PYARCANA_TOOL_ALLOWLISTED] = v
        elif k in ("approval_required", "requires_approval"):
            mapped[PYARCANA_APPROVAL_REQUIRED] = v
        elif k in ("faithfulness",):
            mapped[PYARCANA_VERIFIER_FAITHFULNESS] = v
        elif k in ("context_precision",):
            mapped[PYARCANA_VERIFIER_CONTEXT_PRECISION] = v
        elif k in ("step", "step_n"):
            mapped[PYARCANA_STEP_N] = v
        elif k in ("budget_remaining",):
            mapped[PYARCANA_BUDGET_REMAINING] = v
        elif k in ("web_search_enabled",):
            mapped[PYARCANA_WEB_SEARCH_ENABLED] = v
        elif k in ("web_search_untrusted_wrapped",):
            mapped[PYARCANA_WEB_SEARCH_UNTRUSTED_WRAPPED] = v
        elif k == "prompt":
            # Tag untrusted prompt content
            mapped[GEN_AI_PROMPT] = v
            if isinstance(v, str) and "[untrusted" in v.lower():
                mapped[GEN_AI_PROMPT_IS_UNTRUSTED] = True
        else:
            mapped[k] = v

    # Determine timing
    start_time = getattr(span, "start_time", None) or time.time()
    end_time = getattr(span, "end_time", None) or time.time()
    duration_ms = getattr(span, "duration_ms", None)
    if duration_ms is None:
        duration_ms = (end_time - start_time) * 1000

    return {
        "traceId": trace_id,
        "spanId": span_id,
        "parentSpanId": parent_span_id,
        "name": getattr(span, "name", "unknown"),
        "kind": "INTERNAL",
        "startTimeUnixNano": int(start_time * 1_000_000_000),
        "endTimeUnixNano": int(end_time * 1_000_000_000),
        "attributes": mapped,
        "durationMs": round(duration_ms, 2),
    }


def export_otlp_json(root_span: Any) -> Dict[str, Any]:
    """Export a Span tree as an OTLP/JSON-compatible envelope.

    Returns a dict with the structure:
    {
      "resourceSpans": [{
        "scopeSpans": [{
          "spans": [...]
        }]
      }]
    }
    """
    trace_id = getattr(root_span, "trace_id", None) or str(id(root_span))

    def collect(span: Any, parent_id: Optional[str] = None) -> List[Dict[str, Any]]:
        result = [_to_otlp_span(span, trace_id, parent_id)]
        children = getattr(span, "children", []) or []
        span_id = getattr(span, "span_id", str(id(span)))
        for child in children:
            result.extend(collect(child, span_id))
        return result

    spans = collect(root_span)
    return {
        "resourceSpans": [{
            "resource": {"attributes": {"service.name": "pyarcana-copilot"}},
            "scopeSpans": [{
                "scope": {"name": "pyarcana.harness", "version": "3.0.0"},
                "spans": spans,
            }],
        }],
    }


def export_spans_flat(root_span: Any) -> List[Dict[str, Any]]:
    """Export a flat list of OTel-compatible span dicts (no envelope)."""
    env = export_otlp_json(root_span)
    return env["resourceSpans"][0]["scopeSpans"][0]["spans"]


def validate_otlp_export(exported: Dict[str, Any]) -> List[str]:
    """Validate that an OTLP export has the required structure and gen_ai.* attrs.

    Returns a list of error messages (empty if valid).
    """
    errors: List[str] = []
    if "resourceSpans" not in exported:
        errors.append("missing resourceSpans")
        return errors
    for rs in exported["resourceSpans"]:
        if "scopeSpans" not in rs:
            errors.append("missing scopeSpans in resourceSpan")
            continue
        for ss in rs["scopeSpans"]:
            if "spans" not in ss:
                errors.append("missing spans in scopeSpan")
                continue
            for span in ss["spans"]:
                for required in ("traceId", "spanId", "name", "attributes"):
                    if required not in span:
                        errors.append(f"span {span.get('name','?')} missing {required}")
                # Check that LLM spans have gen_ai.* attributes
                if "llm" in span.get("name", "").lower() or "generate" in span.get("name", "").lower():
                    attrs = span.get("attributes", {})
                    if GEN_AI_SYSTEM not in attrs:
                        errors.append(f"span {span['name']} missing {GEN_AI_SYSTEM}")
                    if GEN_AI_REQUEST_MODEL not in attrs:
                        errors.append(f"span {span['name']} missing {GEN_AI_REQUEST_MODEL}")
    return errors
