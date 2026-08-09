"""OTel GenAI semantic-convention-compatible span export.

This module exports the harness's internal tracing data to the OpenTelemetry
GenAI semantic conventions (gen_ai.* attributes) in valid OTLP/JSON format.

It accepts a Tracer (or a flat list of Span objects) and produces a
standards-compliant OTLP/JSON envelope.

Key design decisions (informed by Codex review):

1. **Redaction** — every span's attributes pass through redact() from
   tracing.py *before* mapping, so emails, bearer tokens, and API keys
   are scrubbed at the export boundary.

2. **Flat span list** — the production Tracer stores spans in a flat
   _spans list with parent_id linkage. This exporter accepts the Tracer
   (or its flat list) and reconstructs parent-child relationships.

3. **OTLP/JSON protobuf mapping** — attributes are encoded as repeated
   KeyValue objects per the OTLP protobuf JSON specification.

4. **Millisecond timestamps** — Span records start_ms and end_ms (Unix
   epoch milliseconds). This exporter converts to UnixNano for OTLP.

5. **Valid trace ID** — OTLP requires 32 hex chars. UUID4-based.
"""
from __future__ import annotations

import json
import uuid
from typing import Any, Dict, List, Optional, Union

from harness.tracing import redact, Span, Tracer

GEN_AI_SYSTEM = "gen_ai.system"
GEN_AI_REQUEST_MODEL = "gen_ai.request.model"
GEN_AI_REQUEST_MAX_TOKENS = "gen_ai.request.max_tokens"
GEN_AI_REQUEST_TEMPERATURE = "gen_ai.request.temperature"
GEN_AI_PROMPT = "gen_ai.prompt"
GEN_AI_PROMPT_IS_UNTRUSTED = "gen_ai.prompt.is_untrusted"
GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens"
GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens"
GEN_AI_RESPONSE_FINISH_REASONS = "gen_ai.response.finish_reasons"
GEN_AI_RESPONSE_ID = "gen_ai.response.id"
GEN_AI_RESPONSE_MODEL = "gen_ai.response.model"
GEN_AI_TOOL_NAME = "gen_ai.tool.name"
GEN_AI_TOOL_INPUT = "gen_ai.tool.input"
GEN_AI_TOOL_OUTPUT = "gen_ai.tool.output"

PYARCANA_RUN_ID = "pyarcana.run_id"
PYARCANA_PROVIDER_MODE = "pyarcana.provider_mode"
PYARCANA_COST_USD = "pyarcana.cost_usd"
PYARCANA_INDEX_VERSION = "pyarcana.index_version"
PYARCANA_CORPUS_SCOPE = "pyarcana.corpus_scope"
PYARCANA_TOOL_ALLOWLISTED = "pyarcana.tool_allowlisted"
PYARCANA_APPROVAL_REQUIRED = "pyarcana.approval_required"
PYARCANA_VERIFIER_FAITHFULNESS = "pyarcana.verifier_faithfulness"
PYARCANA_VERIFIER_CONTEXT_PRECISION = "pyarcana.verifier_context_precision"
PYARCANA_STEP_N = "pyarcana.step_n"
PYARCANA_BUDGET_REMAINING = "pyarcana.budget_remaining"
PYARCANA_WEB_SEARCH_ENABLED = "pyarcana.web_search_enabled"
PYARCANA_WEB_SEARCH_UNTRUSTED_WRAPPED = "pyarcana.web_search_untrusted_wrapped"

_ATTR_MAP: Dict[str, str] = {
    "provider": GEN_AI_SYSTEM, "system": GEN_AI_SYSTEM,
    "model": GEN_AI_REQUEST_MODEL, "request_model": GEN_AI_REQUEST_MODEL,
    "max_tokens": GEN_AI_REQUEST_MAX_TOKENS,
    "temperature": GEN_AI_REQUEST_TEMPERATURE,
    "tokens_in": GEN_AI_USAGE_INPUT_TOKENS, "input_tokens": GEN_AI_USAGE_INPUT_TOKENS,
    "tokens_out": GEN_AI_USAGE_OUTPUT_TOKENS, "output_tokens": GEN_AI_USAGE_OUTPUT_TOKENS,
    "cost": PYARCANA_COST_USD, "cost_usd": PYARCANA_COST_USD,
    "finish_reason": GEN_AI_RESPONSE_FINISH_REASONS,
    "finish_reasons": GEN_AI_RESPONSE_FINISH_REASONS,
    "response_model": GEN_AI_RESPONSE_MODEL,
    "tool_name": GEN_AI_TOOL_NAME, "tool.name": GEN_AI_TOOL_NAME,
    "tool_input": GEN_AI_TOOL_INPUT, "tool.input": GEN_AI_TOOL_INPUT,
    "tool_output": GEN_AI_TOOL_OUTPUT, "tool.output": GEN_AI_TOOL_OUTPUT,
    "run_id": PYARCANA_RUN_ID,
    "provider_mode": PYARCANA_PROVIDER_MODE, "mode": PYARCANA_PROVIDER_MODE,
    "index_version": PYARCANA_INDEX_VERSION,
    "corpus_scope": PYARCANA_CORPUS_SCOPE, "scope": PYARCANA_CORPUS_SCOPE,
    "allowlisted": PYARCANA_TOOL_ALLOWLISTED, "tool_allowlisted": PYARCANA_TOOL_ALLOWLISTED,
    "approval_required": PYARCANA_APPROVAL_REQUIRED, "requires_approval": PYARCANA_APPROVAL_REQUIRED,
    "faithfulness": PYARCANA_VERIFIER_FAITHFULNESS,
    "context_precision": PYARCANA_VERIFIER_CONTEXT_PRECISION,
    "step": PYARCANA_STEP_N, "step_n": PYARCANA_STEP_N,
    "budget_remaining": PYARCANA_BUDGET_REMAINING,
    "web_search_enabled": PYARCANA_WEB_SEARCH_ENABLED,
    "web_search_untrusted_wrapped": PYARCANA_WEB_SEARCH_UNTRUSTED_WRAPPED,
}


def _to_otlp_value(value: Any) -> Dict[str, Any]:
    """Encode a Python value as an OTLP AnyValue JSON object."""
    if isinstance(value, bool):
        return {"boolValue": value}
    if isinstance(value, int):
        return {"intValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, str):
        return {"stringValue": value}
    if isinstance(value, (list, tuple)):
        return {"arrayValue": {"values": [_to_otlp_value(v) for v in value]}}
    if isinstance(value, dict):
        return {"kvlistValue": {"keys": [{"key": k, "value": _to_otlp_value(v)} for k, v in value.items()]}}
    return {"stringValue": json.dumps(value, default=str)}


def _map_attrs(raw_attrs: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Map internal attrs to OTLP KeyValue list, applying redaction first."""
    safe_attrs = redact(raw_attrs)
    mapped: Dict[str, Any] = {}
    for k, v in safe_attrs.items():
        otlp_key = _ATTR_MAP.get(k, k)
        if otlp_key == GEN_AI_RESPONSE_FINISH_REASONS and isinstance(v, str):
            mapped[otlp_key] = [v]
        else:
            mapped[otlp_key] = v
    if GEN_AI_PROMPT in mapped and isinstance(mapped[GEN_AI_PROMPT], str):
        if "[untrusted" in mapped[GEN_AI_PROMPT].lower():
            mapped[GEN_AI_PROMPT_IS_UNTRUSTED] = True
    if GEN_AI_SYSTEM not in mapped:
        mapped[GEN_AI_SYSTEM] = "pyarcana"
    return [{"key": k, "value": _to_otlp_value(v)} for k, v in mapped.items()]


def _span_to_otlp(span: Span, trace_id: str) -> Dict[str, Any]:
    """Convert a single Span to an OTLP/JSON span dict."""
    start_ms = span.start_ms
    end_ms = span.end_ms if span.end_ms is not None else start_ms
    return {
        "traceId": trace_id,
        "spanId": span.span_id,
        "parentSpanId": span.parent_id or "",
        "name": span.name,
        "kind": "SPAN_KIND_INTERNAL",
        "startTimeUnixNano": str(start_ms * 1_000_000),
        "endTimeUnixNano": str(end_ms * 1_000_000),
        "attributes": _map_attrs(span.attrs),
        "status": {"code": "STATUS_CODE_OK"},
    }


def export_otlp_json(source: Union[Tracer, Span, List[Span]], trace_id: Optional[str] = None) -> Dict[str, Any]:
    """Export spans as a valid OTLP/JSON envelope.

    Args:
        source: A Tracer, a single Span, or a flat list of Span objects.
        trace_id: Optional 32-hex-char trace ID. Auto-generated if not provided.

    Returns:
        OTLP/JSON envelope with resourceSpans > scopeSpans > spans structure.
        Attributes are encoded as KeyValue objects per OTLP protobuf JSON spec.
    """
    if trace_id is None:
        trace_id = uuid.uuid4().hex  # 32 hex chars
    if isinstance(source, Tracer):
        spans = source.spans
    elif isinstance(source, Span):
        spans = [source]
    elif isinstance(source, list):
        spans = source
    else:
        spans = getattr(source, "spans", [source])
    otlp_spans = [_span_to_otlp(s, trace_id) for s in spans]
    return {
        "resourceSpans": [{
            "resource": {"attributes": [{"key": "service.name", "value": {"stringValue": "pyarcana-copilot"}}]},
            "scopeSpans": [{"scope": {"name": "pyarcana.harness", "version": "3.0.0"}, "spans": otlp_spans}],
        }],
    }


def export_spans_flat(source: Union[Tracer, Span, List[Span]], trace_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Export a flat list of OTLP-compatible span dicts (no envelope)."""
    env = export_otlp_json(source, trace_id)
    return env["resourceSpans"][0]["scopeSpans"][0]["spans"]


def validate_otlp_export(exported: Dict[str, Any]) -> List[str]:
    """Validate that an OTLP export has the required structure and gen_ai.* attrs."""
    errors: List[str] = []
    if "resourceSpans" not in exported:
        errors.append("missing resourceSpans")
        return errors
    for ri, rs in enumerate(exported["resourceSpans"]):
        if "scopeSpans" not in rs:
            errors.append(f"resourceSpans[{ri}] missing scopeSpans")
            continue
        for si, ss in enumerate(rs["scopeSpans"]):
            if "spans" not in ss:
                errors.append(f"resourceSpans[{ri}].scopeSpans[{si}] missing spans")
                continue
            for span in ss["spans"]:
                name = span.get("name", "?")
                for field in ("traceId", "spanId", "name", "attributes"):
                    if field not in span:
                        errors.append(f"span '{name}' missing {field}")
                tid = span.get("traceId", "")
                if len(tid) != 32 or not all(c in "0123456789abcdef" for c in tid):
                    errors.append(f"span '{name}' traceId is not 32 hex chars")
                if "llm" in name.lower() or "generate" in name.lower():
                    attrs = span.get("attributes", [])
                    attr_keys = {kv.get("key") for kv in attrs}
                    if GEN_AI_SYSTEM not in attr_keys:
                        errors.append(f"span '{name}' missing {GEN_AI_SYSTEM}")
                    if GEN_AI_REQUEST_MODEL not in attr_keys:
                        errors.append(f"span '{name}' missing {GEN_AI_REQUEST_MODEL}")
                for attr in span.get("attributes", []):
                    if "key" not in attr or "value" not in attr:
                        errors.append(f"span '{name}' has non-KeyValue attribute")
                        break
    return errors
