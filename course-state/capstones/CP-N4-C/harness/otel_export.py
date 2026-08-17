"""OTLP/JSON export for the CP-N4-C harness Tracer.

Serializes the production :class:`harness.tracing.Tracer` (flat ``spans``
collection, ``parent_id`` linkage, recorded ``start_ms``/``end_ms``) as
OTLP/HTTP JSON protobuf encoding, not a hand-shaped envelope.

Governing contracts
-------------------
* OTLP JSON protobuf encoding
  (https://opentelemetry.io/docs/specs/otlp/#json-protobuf-encoding):
  hex ``traceId``/``spanId``, **numeric** enums, lower-camel field names,
  decimal-string 64-bit timestamps.
* KeyValue / AnyValue / KeyValueList (``kvlistValue.values``).
* Current GenAI attribute names
  (https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/):
  ``gen_ai.provider.name``, ``gen_ai.operation.name``, request/response,
  usage, and ``gen_ai.tool.call.*``. Deprecated ``gen_ai.system``,
  ``gen_ai.prompt``, ``gen_ai.tool.input``, and ``gen_ai.tool.output``
  are not emitted. PyArcana extensions stay under ``pyarcana.*``.

Redaction runs recursively (strings, mappings, lists, tuples) **before**
attribute mapping. Unsupported types are fail-closed by redacting their
representation.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Mapping, Optional, Sequence, Tuple, Union

from harness.tracing import Tracer, Span, generate_trace_id, generate_span_id, redact

# ── Current GenAI semantic-convention keys ──────────────────────────────
GEN_AI_PROVIDER_NAME = "gen_ai.provider.name"
GEN_AI_OPERATION_NAME = "gen_ai.operation.name"
GEN_AI_REQUEST_MODEL = "gen_ai.request.model"
GEN_AI_REQUEST_MAX_TOKENS = "gen_ai.request.max_tokens"
GEN_AI_REQUEST_TEMPERATURE = "gen_ai.request.temperature"
GEN_AI_INPUT_MESSAGES = "gen_ai.input.messages"
GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens"
GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens"
GEN_AI_RESPONSE_FINISH_REASONS = "gen_ai.response.finish_reasons"
GEN_AI_RESPONSE_ID = "gen_ai.response.id"
GEN_AI_RESPONSE_MODEL = "gen_ai.response.model"
GEN_AI_TOOL_NAME = "gen_ai.tool.name"
GEN_AI_TOOL_CALL_ARGUMENTS = "gen_ai.tool.call.arguments"
GEN_AI_TOOL_CALL_RESULT = "gen_ai.tool.call.result"
GEN_AI_TOOL_CALL_ID = "gen_ai.tool.call.id"

# Deprecated keys — kept as named constants so tests can assert absence.
GEN_AI_SYSTEM = "gen_ai.system"
GEN_AI_PROMPT = "gen_ai.prompt"
GEN_AI_TOOL_INPUT = "gen_ai.tool.input"
GEN_AI_TOOL_OUTPUT = "gen_ai.tool.output"

# PyArcana-namespaced extensions
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
PYARCANA_PROMPT_IS_UNTRUSTED = "pyarcana.prompt.is_untrusted"

DEPRECATED_GEN_AI_KEYS = frozenset(
    {GEN_AI_SYSTEM, GEN_AI_PROMPT, GEN_AI_TOOL_INPUT, GEN_AI_TOOL_OUTPUT}
)

# OTLP numeric enums (JSON encoding MUST use integers, not names).
SPAN_KIND_UNSPECIFIED = 0
SPAN_KIND_INTERNAL = 1
SPAN_KIND_SERVER = 2
SPAN_KIND_CLIENT = 3
SPAN_KIND_PRODUCER = 4
SPAN_KIND_CONSUMER = 5

STATUS_CODE_UNSET = 0
STATUS_CODE_OK = 1
STATUS_CODE_ERROR = 2

_HEX32 = re.compile(r"^[0-9a-f]{32}$")
_HEX16 = re.compile(r"^[0-9a-f]{16}$")
_ZERO_TRACE = "0" * 32
_ZERO_SPAN = "0" * 16

_SECRET_MARKERS = (
    "email-redacted",
    "token-redacted",
    "[redacted]",
)

_ATTR_MAP: Dict[str, str] = {
    "provider": GEN_AI_PROVIDER_NAME,
    "system": GEN_AI_PROVIDER_NAME,
    "adapter": GEN_AI_PROVIDER_NAME,  # production Provider.complete span
    "model": GEN_AI_REQUEST_MODEL,
    "request_model": GEN_AI_REQUEST_MODEL,
    "max_tokens": GEN_AI_REQUEST_MAX_TOKENS,
    "temperature": GEN_AI_REQUEST_TEMPERATURE,
    "prompt": GEN_AI_INPUT_MESSAGES,
    "tokens_in": GEN_AI_USAGE_INPUT_TOKENS,
    "input_tokens": GEN_AI_USAGE_INPUT_TOKENS,
    "tokens_out": GEN_AI_USAGE_OUTPUT_TOKENS,
    "output_tokens": GEN_AI_USAGE_OUTPUT_TOKENS,
    "finish_reason": GEN_AI_RESPONSE_FINISH_REASONS,
    "finish_reasons": GEN_AI_RESPONSE_FINISH_REASONS,
    "response_id": GEN_AI_RESPONSE_ID,
    "response_model": GEN_AI_RESPONSE_MODEL,
    "tool_name": GEN_AI_TOOL_NAME,
    "tool.name": GEN_AI_TOOL_NAME,
    "tool": GEN_AI_TOOL_NAME,  # production ToolResult.to_dict()
    "tool_input": GEN_AI_TOOL_CALL_ARGUMENTS,
    "tool.input": GEN_AI_TOOL_CALL_ARGUMENTS,
    "args": GEN_AI_TOOL_CALL_ARGUMENTS,
    "tool_output": GEN_AI_TOOL_CALL_RESULT,
    "tool.output": GEN_AI_TOOL_CALL_RESULT,
    "result": GEN_AI_TOOL_CALL_RESULT,
    "tool_call_id": GEN_AI_TOOL_CALL_ID,
    "run_id": PYARCANA_RUN_ID,
    "provider_mode": PYARCANA_PROVIDER_MODE,
    "mode": PYARCANA_PROVIDER_MODE,
    "cost": PYARCANA_COST_USD,
    "cost_usd": PYARCANA_COST_USD,
    "index_version": PYARCANA_INDEX_VERSION,
    "corpus_scope": PYARCANA_CORPUS_SCOPE,
    "scope": PYARCANA_CORPUS_SCOPE,
    "allowlisted": PYARCANA_TOOL_ALLOWLISTED,
    "tool_allowlisted": PYARCANA_TOOL_ALLOWLISTED,
    "approval_required": PYARCANA_APPROVAL_REQUIRED,
    "requires_approval": PYARCANA_APPROVAL_REQUIRED,
    "faithfulness": PYARCANA_VERIFIER_FAITHFULNESS,
    "context_precision": PYARCANA_VERIFIER_CONTEXT_PRECISION,
    "step": PYARCANA_STEP_N,
    "step_n": PYARCANA_STEP_N,
    "budget_remaining": PYARCANA_BUDGET_REMAINING,
    "web_search_enabled": PYARCANA_WEB_SEARCH_ENABLED,
    "web_search_untrusted_wrapped": PYARCANA_WEB_SEARCH_UNTRUSTED_WRAPPED,
}


class InvalidOtlpIdError(ValueError):
    """Caller supplied a zero or otherwise invalid OTLP identifier."""


def _is_valid_trace_id(value: str) -> bool:
    return bool(_HEX32.fullmatch(value)) and value != _ZERO_TRACE


def _is_valid_span_id(value: str) -> bool:
    return bool(_HEX16.fullmatch(value)) and value != _ZERO_SPAN


def normalize_trace_id(value: Optional[str]) -> str:
    """Return a 32-hex trace ID; generate one if ``value`` is None.

    Rejects empty, wrong-length, non-hex, and all-zero caller IDs.
    """
    if value is None:
        return generate_trace_id()
    tid = str(value).strip().lower()
    if not _is_valid_trace_id(tid):
        raise InvalidOtlpIdError(f"invalid OTLP trace ID: {value!r}")
    return tid


def normalize_span_id(value: Optional[str]) -> str:
    """Return a 16-hex span ID; generate one if ``value`` is None.

    Rejects empty, wrong-length, non-hex, and all-zero caller IDs.
    """
    if value is None:
        return generate_span_id()
    sid = str(value).strip().lower()
    if not _is_valid_span_id(sid):
        raise InvalidOtlpIdError(f"invalid OTLP span ID: {value!r}")
    return sid


def _redact_fail_closed(value: Any) -> Any:
    """Redact recursively; unsupported types become a redacted representation."""
    if isinstance(value, (str, dict, list, tuple)) or value is None or isinstance(value, (int, float, bool)):
        return redact(value)
    return redact(repr(value))


def _to_otlp_value(value: Any) -> Dict[str, Any]:
    """Encode a Python value as an OTLP AnyValue JSON object."""
    if value is None:
        return {"stringValue": ""}
    if isinstance(value, bool):
        return {"boolValue": value}
    if isinstance(value, int) and not isinstance(value, bool):
        return {"intValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, str):
        return {"stringValue": value}
    if isinstance(value, (list, tuple)):
        return {"arrayValue": {"values": [_to_otlp_value(v) for v in value]}}
    if isinstance(value, dict):
        return {
            "kvlistValue": {
                "values": [
                    {"key": str(k), "value": _to_otlp_value(v)}
                    for k, v in value.items()
                ]
            }
        }
    return {"stringValue": redact(repr(value))}


def _infer_operation_name(span_name: str, mapped: Mapping[str, Any]) -> str:
    if GEN_AI_OPERATION_NAME in mapped and mapped[GEN_AI_OPERATION_NAME]:
        return str(mapped[GEN_AI_OPERATION_NAME])
    lower = span_name.lower()
    if "tool" in lower:
        return "execute_tool"
    if "retriev" in lower or "rag" in lower:
        return "retrieval"
    if "embed" in lower:
        return "embeddings"
    if "agent" in lower:
        return "invoke_agent"
    if "llm" in lower or "generate" in lower or "chat" in lower:
        return "generate_content"
    if "provider.call" in lower:
        return "generate_content"
    return "invoke_workflow"


def _looks_untrusted(value: Any) -> bool:
    if isinstance(value, str):
        return "[untrusted" in value.lower()
    if isinstance(value, (list, tuple)):
        return any(_looks_untrusted(v) for v in value)
    if isinstance(value, dict):
        return any(_looks_untrusted(v) for v in value.values())
    return False


def _map_attrs(raw_attrs: Mapping[str, Any], span_name: str) -> List[Dict[str, Any]]:
    """Redact, remap to current GenAI keys, encode as KeyValue list."""
    safe_attrs = _redact_fail_closed(dict(raw_attrs))
    if not isinstance(safe_attrs, dict):
        safe_attrs = {"pyarcana.redacted_attrs": safe_attrs}

    mapped: Dict[str, Any] = {}
    for k, v in safe_attrs.items():
        key = str(k)
        if key in DEPRECATED_GEN_AI_KEYS:
            continue
        otlp_key = _ATTR_MAP.get(key, key)
        if otlp_key in DEPRECATED_GEN_AI_KEYS:
            continue
        if otlp_key == GEN_AI_RESPONSE_FINISH_REASONS and isinstance(v, str):
            mapped[otlp_key] = [v]
        elif otlp_key == GEN_AI_INPUT_MESSAGES and isinstance(v, str):
            mapped[otlp_key] = [{"role": "user", "parts": [{"type": "text", "content": v}]}]
        else:
            mapped[otlp_key] = v

    mapped[GEN_AI_OPERATION_NAME] = _infer_operation_name(span_name, mapped)

    prompt_like = mapped.get(GEN_AI_INPUT_MESSAGES)
    if prompt_like is not None and _looks_untrusted(prompt_like):
        mapped[PYARCANA_PROMPT_IS_UNTRUSTED] = True

    return [{"key": k, "value": _to_otlp_value(v)} for k, v in mapped.items()]


def _ms_to_unix_nano_str(ms: int) -> str:
    return str(int(ms) * 1_000_000)


class _DictSpan:
    """Adapter so persisted Tracer.to_dict() rows can be re-exported."""

    def __init__(self, payload: Mapping[str, Any]) -> None:
        self.span_id = payload.get("span_id")
        self.parent_id = payload.get("parent_id")
        self.name = str(payload.get("name") or "unknown")
        self.start_ms = int(payload.get("start_ms") or 0)
        self.end_ms = payload.get("end_ms")
        self.attrs = dict(payload.get("attrs") or {})


def _coerce_span(item: Any) -> Any:
    if isinstance(item, Span):
        return item
    if isinstance(item, dict):
        return _DictSpan(item)
    return item


def _span_status(span: Any) -> int:
    name = str(getattr(span, "name", "")).lower()
    if "error" in name or "fail" in name:
        return STATUS_CODE_ERROR
    return STATUS_CODE_OK


def _span_to_otlp(span: Any, trace_id: str) -> Dict[str, Any]:
    span = _coerce_span(span)
    start_ms = int(span.start_ms)
    end_ms = int(span.end_ms) if span.end_ms is not None else start_ms
    out: Dict[str, Any] = {
        "traceId": trace_id,
        "spanId": normalize_span_id(span.span_id),
        "name": span.name,
        "kind": SPAN_KIND_INTERNAL,
        "startTimeUnixNano": _ms_to_unix_nano_str(start_ms),
        "endTimeUnixNano": _ms_to_unix_nano_str(end_ms),
        "attributes": _map_attrs(span.attrs, span.name),
        "status": {"code": _span_status(span)},
    }
    if span.parent_id:
        out["parentSpanId"] = normalize_span_id(span.parent_id)
    return out


def _collect_spans(source: Union[Tracer, Span, Sequence[Any], Any]) -> Tuple[List[Any], Optional[str]]:
    if isinstance(source, Tracer):
        return list(source.spans), getattr(source, "trace_id", None)
    if isinstance(source, Span):
        return [source], None
    if isinstance(source, (list, tuple)):
        return [_coerce_span(s) for s in source], None
    spans_attr = getattr(source, "spans", None)
    if spans_attr is not None:
        return [_coerce_span(s) for s in spans_attr], getattr(source, "trace_id", None)
    raise TypeError(f"cannot export OTLP from {type(source).__name__}")


def export_otlp_json(
    source: Union[Tracer, Span, Sequence[Span], Any],
    trace_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Export spans as a strict OTLP/JSON ``ExportTraceServiceRequest``.

    ``source`` should be a production :class:`Tracer` (preferred). A single
    :class:`Span` or a flat list of spans is accepted. Caller-supplied
    ``trace_id`` values that are not 32-hex or that are all-zero are rejected.
    """
    spans, source_trace_id = _collect_spans(source)
    tid = normalize_trace_id(trace_id if trace_id is not None else source_trace_id)
    otlp_spans = [_span_to_otlp(s, tid) for s in spans]
    return {
        "resourceSpans": [{
            "resource": {
                "attributes": [
                    {"key": "service.name", "value": {"stringValue": "pyarcana-copilot"}},
                ]
            },
            "scopeSpans": [{
                "scope": {"name": "pyarcana.harness", "version": "3.0.0"},
                "spans": otlp_spans,
            }],
        }],
    }


def export_spans_flat(
    source: Union[Tracer, Span, Sequence[Span], Any],
    trace_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Export a flat list of OTLP span dicts (no envelope)."""
    env = export_otlp_json(source, trace_id)
    return env["resourceSpans"][0]["scopeSpans"][0]["spans"]


def _walk_any_value(value: Any, path: str, errors: List[str]) -> None:
    if not isinstance(value, dict):
        errors.append(f"{path} is not an AnyValue object")
        return
    allowed = {
        "stringValue", "boolValue", "intValue", "doubleValue",
        "arrayValue", "kvlistValue", "bytesValue",
    }
    present = [k for k in value if k in allowed]
    extra = [k for k in value if k not in allowed]
    if extra:
        errors.append(f"{path} has unknown AnyValue fields: {extra}")
    if len(present) != 1:
        errors.append(f"{path} must have exactly one AnyValue arm, got {present}")
        return
    arm = present[0]
    if arm == "intValue" and not isinstance(value[arm], str):
        errors.append(f"{path}.intValue must be a decimal string")
    if arm == "arrayValue":
        arr = value[arm]
        if not isinstance(arr, dict) or "values" not in arr:
            errors.append(f"{path}.arrayValue missing values")
            return
        for i, item in enumerate(arr["values"]):
            _walk_any_value(item, f"{path}.arrayValue.values[{i}]", errors)
    if arm == "kvlistValue":
        kv = value[arm]
        if not isinstance(kv, dict):
            errors.append(f"{path}.kvlistValue is not an object")
            return
        if "keys" in kv:
            errors.append(f"{path}.kvlistValue used deprecated 'keys'; required field is 'values'")
        if "values" not in kv:
            errors.append(f"{path}.kvlistValue missing values")
            return
        for i, item in enumerate(kv["values"]):
            if not isinstance(item, dict) or "key" not in item or "value" not in item:
                errors.append(f"{path}.kvlistValue.values[{i}] is not a KeyValue")
                continue
            _walk_any_value(item["value"], f"{path}.kvlistValue.values[{i}].value", errors)


def _attr_keys(span: Mapping[str, Any]) -> List[str]:
    attrs = span.get("attributes", [])
    if not isinstance(attrs, list):
        return []
    return [kv.get("key") for kv in attrs if isinstance(kv, dict)]


def _payload_contains_unredacted_secret(obj: Any) -> bool:
    if isinstance(obj, str):
        if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", obj):
            if "email-redacted" not in obj:
                return True
        if re.search(r"(?i)bearer\s+[A-Za-z0-9._\-/+=]+", obj) and "token-redacted" not in obj:
            return True
        return False
    if isinstance(obj, dict):
        return any(_payload_contains_unredacted_secret(v) for v in obj.values())
    if isinstance(obj, (list, tuple)):
        return any(_payload_contains_unredacted_secret(v) for v in obj)
    return False


def validate_otlp_export(exported: Mapping[str, Any]) -> List[str]:
    """Validate IDs, enums, timestamps, parent IDs, AnyValue shapes, GenAI keys, redaction."""
    errors: List[str] = []
    if "resourceSpans" not in exported:
        errors.append("missing resourceSpans")
        return errors

    seen_ids: Dict[str, str] = {}
    for ri, rs in enumerate(exported["resourceSpans"]):
        if not isinstance(rs, dict):
            errors.append(f"resourceSpans[{ri}] is not an object")
            continue
        resource = rs.get("resource", {})
        for ai, attr in enumerate(resource.get("attributes", []) or []):
            if not isinstance(attr, dict) or "key" not in attr or "value" not in attr:
                errors.append(f"resourceSpans[{ri}].resource.attributes[{ai}] is not a KeyValue")
                continue
            _walk_any_value(attr["value"], f"resourceSpans[{ri}].resource.attributes[{ai}].value", errors)
        if "scopeSpans" not in rs:
            errors.append(f"resourceSpans[{ri}] missing scopeSpans")
            continue
        for si, ss in enumerate(rs["scopeSpans"]):
            if "spans" not in ss:
                errors.append(f"resourceSpans[{ri}].scopeSpans[{si}] missing spans")
                continue
            for span in ss["spans"]:
                name = span.get("name", "?")
                for field in ("traceId", "spanId", "name", "attributes", "kind", "startTimeUnixNano", "endTimeUnixNano"):
                    if field not in span:
                        errors.append(f"span '{name}' missing {field}")
                tid = str(span.get("traceId", ""))
                sid = str(span.get("spanId", ""))
                if not _is_valid_trace_id(tid):
                    errors.append(f"span '{name}' traceId is not a non-zero 32-hex ID")
                if not _is_valid_span_id(sid):
                    errors.append(f"span '{name}' spanId is not a non-zero 16-hex ID")
                parent = span.get("parentSpanId")
                if parent is not None and parent != "":
                    if not _is_valid_span_id(str(parent)):
                        errors.append(f"span '{name}' parentSpanId is not a non-zero 16-hex ID")
                kind = span.get("kind")
                if not isinstance(kind, int) or kind not in {
                    SPAN_KIND_UNSPECIFIED, SPAN_KIND_INTERNAL, SPAN_KIND_SERVER,
                    SPAN_KIND_CLIENT, SPAN_KIND_PRODUCER, SPAN_KIND_CONSUMER,
                }:
                    errors.append(f"span '{name}' kind must be a numeric SpanKind enum")
                status = span.get("status")
                if isinstance(status, dict):
                    code = status.get("code")
                    if not isinstance(code, int) or code not in {
                        STATUS_CODE_UNSET, STATUS_CODE_OK, STATUS_CODE_ERROR,
                    }:
                        errors.append(f"span '{name}' status.code must be a numeric StatusCode enum")
                for ts_field in ("startTimeUnixNano", "endTimeUnixNano"):
                    raw = span.get(ts_field)
                    if not isinstance(raw, str) or not raw.isdigit():
                        errors.append(f"span '{name}' {ts_field} must be a decimal-string nanosecond timestamp")
                    elif ts_field == "endTimeUnixNano":
                        start_raw = span.get("startTimeUnixNano")
                        if isinstance(start_raw, str) and start_raw.isdigit() and int(raw) < int(start_raw):
                            errors.append(f"span '{name}' endTimeUnixNano precedes startTimeUnixNano")
                attrs = span.get("attributes", [])
                if not isinstance(attrs, list):
                    errors.append(f"span '{name}' attributes must be a KeyValue list")
                else:
                    keys = []
                    for ai, attr in enumerate(attrs):
                        if not isinstance(attr, dict) or "key" not in attr or "value" not in attr:
                            errors.append(f"span '{name}' attributes[{ai}] is not a KeyValue")
                            continue
                        keys.append(attr["key"])
                        _walk_any_value(attr["value"], f"span '{name}' attributes[{ai}].value", errors)
                    for banned in DEPRECATED_GEN_AI_KEYS:
                        if banned in keys:
                            errors.append(f"span '{name}' emits deprecated attribute {banned}")
                    lower_name = name.lower()
                    if "llm" in lower_name or "generate" in lower_name:
                        if GEN_AI_PROVIDER_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_PROVIDER_NAME}")
                        if GEN_AI_REQUEST_MODEL not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_REQUEST_MODEL}")
                        if GEN_AI_OPERATION_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_OPERATION_NAME}")
                    if "provider.call" in lower_name:
                        if GEN_AI_PROVIDER_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_PROVIDER_NAME}")
                        if GEN_AI_OPERATION_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_OPERATION_NAME}")
                    if "tool" in lower_name:
                        if GEN_AI_TOOL_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_TOOL_NAME}")
                        if GEN_AI_OPERATION_NAME not in keys:
                            errors.append(f"span '{name}' missing {GEN_AI_OPERATION_NAME}")
                seen_ids[sid] = name

    if _payload_contains_unredacted_secret(exported):
        errors.append("export contains unredacted secret-like content")
    return errors
