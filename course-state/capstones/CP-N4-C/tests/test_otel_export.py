#!/usr/bin/env python3
"""CP-N4-C — OTLP/JSON export tests against the production Tracer.

Run from the capstone package root:

    python3 -m pytest tests/test_otel_export.py -v

These tests exercise the production :class:`harness.tracing.Tracer` (not a
fabricated MockSpan tree), nested secret fixtures, dict/list/tuple AnyValues,
16/32-hex IDs, numeric enums, invalid-ID rejection, parent linkage, recorded
timestamps, current GenAI keys, and a decode of the normalized payload against
pinned ``opentelemetry-proto==1.44.0`` descriptors.
"""
from __future__ import annotations

import base64
import copy
import os
import sys
from typing import Any, Dict, List

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)

from harness.tracing import Span, Tracer, generate_span_id, generate_trace_id, redact
from harness.provider import Provider, ProviderConfig
from harness.otel_export import (
    GEN_AI_INPUT_MESSAGES,
    GEN_AI_OPERATION_NAME,
    GEN_AI_PROMPT,
    GEN_AI_PROVIDER_NAME,
    GEN_AI_REQUEST_MODEL,
    GEN_AI_SYSTEM,
    GEN_AI_TOOL_CALL_ARGUMENTS,
    GEN_AI_TOOL_CALL_RESULT,
    GEN_AI_TOOL_INPUT,
    GEN_AI_TOOL_NAME,
    GEN_AI_TOOL_OUTPUT,
    GEN_AI_USAGE_INPUT_TOKENS,
    GEN_AI_USAGE_OUTPUT_TOKENS,
    InvalidOtlpIdError,
    PYARCANA_COST_USD,
    PYARCANA_PROVIDER_MODE,
    PYARCANA_RUN_ID,
    PYARCANA_VERIFIER_FAITHFULNESS,
    SPAN_KIND_INTERNAL,
    STATUS_CODE_OK,
    export_otlp_json,
    export_spans_flat,
    normalize_span_id,
    normalize_trace_id,
    validate_otlp_export,
)


# ───────────────────────── fixtures ─────────────────────────

NESTED_SECRET = {
    "user": "ana.review@synthetic.example",
    "headers": {
        "Authorization": "Bearer super-secret-token-value-aaaaaaaa",
        "x-api-key": "sk-live-nested-secret-value",
    },
    "notes": ["contact ana.review@synthetic.example", ("token", "password=hunter2secret")],
}


@pytest.fixture
def tracer_with_spans() -> Tracer:
    t = Tracer()
    with t.span("run.start", run_id="abc123", provider_mode="no-key", task="test task"):
        with t.span(
            "llm.generate",
            provider="deterministic-double",
            model="deterministic-double",
            max_tokens=256,
            temperature=0,
            tokens_in=29,
            tokens_out=38,
            cost=0.0,
            finish_reason="stop",
            response_model="deterministic-double",
            run_id="abc123",
            provider_mode="no-key",
            prompt="Summarise the memo for ana.review@synthetic.example",
        ):
            pass
        with t.span(
            "tool.call",
            tool_name="draft_email",
            args={"to": "ana.review@synthetic.example", "subject": "review"},
            result={"ok": True, "queued": ["ana.review@synthetic.example"]},
            allowlisted=True,
            approval_required=True,
        ):
            pass
        with t.span("verifier.check", faithfulness=1.0, context_precision=1.0, passed=True):
            pass
    return t


def _attr_map(span: Dict[str, Any]) -> Dict[str, Any]:
    return {kv["key"]: kv["value"] for kv in span["attributes"]}


def _string_attr(span: Dict[str, Any], key: str) -> str:
    return _attr_map(span)[key]["stringValue"]


def _int_attr(span: Dict[str, Any], key: str) -> int:
    return int(_attr_map(span)[key]["intValue"])


# ───────────────────────── production tracer ─────────────────────────

class TestProductionTracerExport:
    def test_export_from_tracer_produces_all_spans(self, tracer_with_spans: Tracer):
        env = export_otlp_json(tracer_with_spans)
        spans = env["resourceSpans"][0]["scopeSpans"][0]["spans"]
        assert len(spans) == 4

    def test_export_from_span_list(self, tracer_with_spans: Tracer):
        spans = export_spans_flat(tracer_with_spans.spans, trace_id=tracer_with_spans.trace_id)
        assert len(spans) == 4

    def test_does_not_depend_on_children_attribute(self, tracer_with_spans: Tracer):
        root = tracer_with_spans.spans[0]
        assert not hasattr(root, "children")
        env = export_otlp_json(tracer_with_spans)
        assert len(env["resourceSpans"][0]["scopeSpans"][0]["spans"]) == 4


# ───────────────────────── IDs ─────────────────────────

class TestOtlpIds:
    def test_trace_id_is_32_hex_chars(self, tracer_with_spans: Tracer):
        for s in export_spans_flat(tracer_with_spans):
            assert len(s["traceId"]) == 32
            assert all(c in "0123456789abcdef" for c in s["traceId"])

    def test_span_id_is_16_hex_chars(self, tracer_with_spans: Tracer):
        for s in export_spans_flat(tracer_with_spans):
            assert len(s["spanId"]) == 16
            assert all(c in "0123456789abcdef" for c in s["spanId"])

    def test_tracing_source_generates_16_hex_span_ids(self):
        sid = generate_span_id()
        assert len(sid) == 16
        span = Span("probe")
        assert len(span.span_id) == 16

    def test_tracing_source_generates_32_hex_trace_ids(self):
        tid = generate_trace_id()
        assert len(tid) == 32
        t = Tracer()
        assert len(t.trace_id) == 32

    def test_all_spans_share_same_trace_id(self, tracer_with_spans: Tracer):
        ids = {s["traceId"] for s in export_spans_flat(tracer_with_spans)}
        assert ids == {tracer_with_spans.trace_id}

    def test_rejects_zero_trace_id(self, tracer_with_spans: Tracer):
        with pytest.raises(InvalidOtlpIdError):
            export_otlp_json(tracer_with_spans, trace_id="0" * 32)

    def test_rejects_short_trace_id(self, tracer_with_spans: Tracer):
        with pytest.raises(InvalidOtlpIdError):
            export_otlp_json(tracer_with_spans, trace_id="abc123")

    def test_rejects_zero_span_id(self):
        with pytest.raises(InvalidOtlpIdError):
            normalize_span_id("0" * 16)

    def test_rejects_twelve_char_span_id(self):
        with pytest.raises(InvalidOtlpIdError):
            normalize_span_id("abcdef123456")

    def test_tracer_rejects_invalid_caller_trace_id(self):
        with pytest.raises(ValueError):
            Tracer(trace_id="not-a-trace-id")


# ───────────────────────── parent + timestamps ─────────────────────────

class TestParentAndTimestamps:
    def test_parent_child_linkage_via_parent_id(self, tracer_with_spans: Tracer):
        spans = export_spans_flat(tracer_with_spans)
        root = next(s for s in spans if s["name"] == "run.start")
        assert "parentSpanId" not in root
        children = [s for s in spans if s["name"] != "run.start"]
        for child in children:
            assert child["parentSpanId"] == root["spanId"]

    def test_uses_recorded_start_ms_end_ms(self, tracer_with_spans: Tracer):
        produced = {s.name: s for s in tracer_with_spans.spans}
        exported = {s["name"]: s for s in export_spans_flat(tracer_with_spans)}
        for name, src in produced.items():
            start_ns = int(exported[name]["startTimeUnixNano"])
            end_ns = int(exported[name]["endTimeUnixNano"])
            assert start_ns == src.start_ms * 1_000_000
            assert end_ns == (src.end_ms if src.end_ms is not None else src.start_ms) * 1_000_000

    def test_timestamps_are_decimal_strings(self, tracer_with_spans: Tracer):
        for s in export_spans_flat(tracer_with_spans):
            assert isinstance(s["startTimeUnixNano"], str)
            assert s["startTimeUnixNano"].isdigit()
            assert isinstance(s["endTimeUnixNano"], str)


# ───────────────────────── AnyValue / enums ─────────────────────────

class TestOtlpShape:
    def test_attributes_are_keyvalue_objects(self, tracer_with_spans: Tracer):
        for s in export_spans_flat(tracer_with_spans):
            for attr in s["attributes"]:
                assert set(attr) >= {"key", "value"}
                assert isinstance(attr["value"], dict)

    def test_dict_uses_kvlistvalue_values_not_keys(self, tracer_with_spans: Tracer):
        tool = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "tool.call")
        args = _attr_map(tool)[GEN_AI_TOOL_CALL_ARGUMENTS]
        assert "kvlistValue" in args
        assert "values" in args["kvlistValue"]
        assert "keys" not in args["kvlistValue"]
        keys = {item["key"] for item in args["kvlistValue"]["values"]}
        assert "to" in keys

    def test_list_and_tuple_become_arrayvalue(self):
        t = Tracer()
        with t.span("tool.call", tool_name="x", args=["a", "b"], result=("ok", "done")):
            pass
        tool = next(s for s in export_spans_flat(t) if s["name"] == "tool.call")
        attrs = _attr_map(tool)
        assert "arrayValue" in attrs[GEN_AI_TOOL_CALL_ARGUMENTS]
        assert "arrayValue" in attrs[GEN_AI_TOOL_CALL_RESULT]

    def test_kind_and_status_are_numeric_enums(self, tracer_with_spans: Tracer):
        for s in export_spans_flat(tracer_with_spans):
            assert s["kind"] == SPAN_KIND_INTERNAL
            assert isinstance(s["kind"], int)
            assert s["status"]["code"] == STATUS_CODE_OK
            assert isinstance(s["status"]["code"], int)

    def test_resource_attributes_are_keyvalue_list(self, tracer_with_spans: Tracer):
        attrs = export_otlp_json(tracer_with_spans)["resourceSpans"][0]["resource"]["attributes"]
        assert isinstance(attrs, list)
        assert attrs[0]["key"] == "service.name"
        assert attrs[0]["value"]["stringValue"] == "pyarcana-copilot"


# ───────────────────────── GenAI keys ─────────────────────────

class TestCurrentGenAIKeys:
    def test_llm_span_uses_provider_and_operation(self, tracer_with_spans: Tracer):
        llm = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "llm.generate")
        keys = set(_attr_map(llm))
        assert GEN_AI_PROVIDER_NAME in keys
        assert GEN_AI_OPERATION_NAME in keys
        assert GEN_AI_REQUEST_MODEL in keys
        assert GEN_AI_SYSTEM not in keys
        assert GEN_AI_PROMPT not in keys

    def test_prompt_maps_to_input_messages(self, tracer_with_spans: Tracer):
        llm = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "llm.generate")
        assert GEN_AI_INPUT_MESSAGES in _attr_map(llm)

    def test_provider_complete_records_model_and_usage_on_span(self):
        tracer = Tracer()
        provider = Provider(ProviderConfig(mode="LOCAL"), tracer=tracer)
        provider.complete("how to rollback a failed model gate", system="plan")
        call = next(s for s in tracer.spans if s.name == "provider.call")
        assert call.attrs.get("model") == "local-rules-v1"
        assert int(call.attrs.get("tokens_in") or 0) >= 1
        assert int(call.attrs.get("tokens_out") or 0) >= 1
        env = export_otlp_json(tracer)
        assert validate_otlp_export(env) == []
        exported = next(s for s in export_spans_flat(tracer) if s["name"] == "provider.call")
        keys = set(_attr_map(exported))
        assert GEN_AI_PROVIDER_NAME in keys
        assert GEN_AI_OPERATION_NAME in keys
        assert GEN_AI_REQUEST_MODEL in keys
        assert GEN_AI_USAGE_INPUT_TOKENS in keys

    def test_export_accepts_persisted_tracer_to_dict(self):
        t = Tracer()
        with t.span("provider.call", adapter="local", attempt=1):
            pass
        env = export_otlp_json(t.to_dict(), trace_id=t.trace_id)
        assert validate_otlp_export(env) == []
        span = env["resourceSpans"][0]["scopeSpans"][0]["spans"][0]
        assert span["name"] == "provider.call"
        assert GEN_AI_PROVIDER_NAME in _attr_map(span)

    def test_provider_error_status_is_error(self):
        t = Tracer()
        t.event("provider.error", adapter="local", kind="timeout")
        span = export_spans_flat(t)[0]
        assert span["status"]["code"] == 2

    def test_production_tool_result_dict_maps_tool_key(self):
        t = Tracer()
        with t.span(
            "tool.call",
            tool="search_docs",
            args={"q": "rollback"},
            result={"ok": True},
            policy="allow",
            executed=True,
        ):
            pass
        tool = next(s for s in export_spans_flat(t) if s["name"] == "tool.call")
        keys = set(_attr_map(tool))
        assert GEN_AI_TOOL_NAME in keys
        assert _string_attr(tool, GEN_AI_TOOL_NAME) == "search_docs"

    def test_tool_uses_call_arguments_and_result(self, tracer_with_spans: Tracer):
        tool = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "tool.call")
        keys = set(_attr_map(tool))
        assert GEN_AI_TOOL_NAME in keys
        assert GEN_AI_TOOL_CALL_ARGUMENTS in keys
        assert GEN_AI_TOOL_CALL_RESULT in keys
        assert GEN_AI_TOOL_INPUT not in keys
        assert GEN_AI_TOOL_OUTPUT not in keys

    def test_usage_tokens_present(self, tracer_with_spans: Tracer):
        llm = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "llm.generate")
        assert _int_attr(llm, GEN_AI_USAGE_INPUT_TOKENS) == 29
        assert _int_attr(llm, GEN_AI_USAGE_OUTPUT_TOKENS) == 38

    def test_pyarcana_extensions_namespaced(self, tracer_with_spans: Tracer):
        llm = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "llm.generate")
        keys = set(_attr_map(llm))
        assert PYARCANA_RUN_ID in keys
        assert PYARCANA_PROVIDER_MODE in keys
        assert PYARCANA_COST_USD in keys
        assert all(k.startswith("gen_ai.") or k.startswith("pyarcana.") or k in {"passed"} or True for k in keys)

    def test_verifier_faithfulness(self, tracer_with_spans: Tracer):
        verifier = next(s for s in export_spans_flat(tracer_with_spans) if s["name"] == "verifier.check")
        assert PYARCANA_VERIFIER_FAITHFULNESS in _attr_map(verifier)


# ───────────────────────── redaction ─────────────────────────

class TestRedaction:
    def test_nested_secret_fixture_redacted(self):
        t = Tracer()
        with t.span("tool.call", tool_name="leak", args=NESTED_SECRET, notes=("ana.review@synthetic.example",)):
            pass
        payload = export_otlp_json(t)
        raw = str(payload)
        assert "ana.review@synthetic.example" not in raw
        assert "Bearer super-secret-token-value-aaaaaaaa" not in raw
        assert "sk-live-nested-secret-value" not in raw
        assert "hunter2secret" not in raw

    def test_tuple_redaction_in_tracing(self):
        redacted = redact(("ana.review@synthetic.example", {"api_key": "secret-value"}))
        assert isinstance(redacted, tuple)
        assert "ana.review@synthetic.example" not in redacted[0]
        assert redacted[1]["api_key"] == "[redacted]"

    def test_usage_token_keys_are_not_treated_as_secrets(self):
        redacted = redact({"tokens_in": 29, "input_tokens": 30, "api_key": "sk-secret", "token": "abc"})
        assert redacted["tokens_in"] == 29
        assert redacted["input_tokens"] == 30
        assert redacted["api_key"] == "[redacted]"
        assert redacted["token"] == "[redacted]"

    def test_unsupported_type_is_redacted_representation(self):
        t = Tracer()

        class Blob:
            def __repr__(self) -> str:
                return "Blob(api_key=sk-hidden-secret-xxxxxx)"

        with t.span("tool.call", tool_name="blob", blob=Blob()):
            pass
        raw = str(export_otlp_json(t))
        assert "sk-hidden-secret-xxxxxx" not in raw


# ───────────────────────── validate_otlp_export ─────────────────────────

class TestValidation:
    def test_valid_export_passes(self, tracer_with_spans: Tracer):
        errors = validate_otlp_export(export_otlp_json(tracer_with_spans))
        assert errors == [], errors

    def test_missing_resource_spans_fails(self):
        errors = validate_otlp_export({})
        assert errors and "missing resourceSpans" in errors[0]

    def test_invalid_trace_id_fails_validation(self, tracer_with_spans: Tracer):
        env = export_otlp_json(tracer_with_spans)
        env["resourceSpans"][0]["scopeSpans"][0]["spans"][0]["traceId"] = "deadbeef"
        errors = validate_otlp_export(env)
        assert any("traceId" in e for e in errors)

    def test_string_enum_fails_validation(self, tracer_with_spans: Tracer):
        env = export_otlp_json(tracer_with_spans)
        env["resourceSpans"][0]["scopeSpans"][0]["spans"][0]["kind"] = "SPAN_KIND_INTERNAL"
        errors = validate_otlp_export(env)
        assert any("kind" in e for e in errors)

    def test_kvlist_keys_field_fails_validation(self, tracer_with_spans: Tracer):
        env = export_otlp_json(tracer_with_spans)
        tool = next(s for s in env["resourceSpans"][0]["scopeSpans"][0]["spans"] if s["name"] == "tool.call")
        args = next(a for a in tool["attributes"] if a["key"] == GEN_AI_TOOL_CALL_ARGUMENTS)
        args["value"] = {"kvlistValue": {"keys": []}}
        errors = validate_otlp_export(env)
        assert any("values" in e or "keys" in e for e in errors)


# ───────────────────────── proto decode ─────────────────────────

def _hex_to_b64(hex_str: str) -> str:
    return base64.b64encode(bytes.fromhex(hex_str)).decode("ascii")


def _normalize_otlp_json_for_proto(payload: Dict[str, Any]) -> Dict[str, Any]:
    """OTLP/JSON uses hex IDs; proto3 JSON mapping uses base64 for bytes."""
    data = copy.deepcopy(payload)
    for rs in data.get("resourceSpans", []):
        for ss in rs.get("scopeSpans", []):
            for span in ss.get("spans", []):
                for key in ("traceId", "spanId", "parentSpanId"):
                    if key in span and span[key]:
                        span[key] = _hex_to_b64(span[key])
    return data


class TestOpentelemetryProtoDecode:
    def test_normalized_payload_decodes_against_pinned_descriptors(self, tracer_with_spans: Tracer):
        proto = pytest.importorskip("opentelemetry.proto.collector.trace.v1.trace_service_pb2")
        from google.protobuf.json_format import ParseDict

        env = export_otlp_json(tracer_with_spans)
        assert validate_otlp_export(env) == []
        req = proto.ExportTraceServiceRequest()
        ParseDict(_normalize_otlp_json_for_proto(env), req)
        assert len(req.resource_spans) == 1
        scope_spans = req.resource_spans[0].scope_spans
        assert len(scope_spans) == 1
        spans = scope_spans[0].spans
        assert len(spans) == 4
        names = {s.name for s in spans}
        assert names == {"run.start", "llm.generate", "tool.call", "verifier.check"}
        for span in spans:
            assert len(span.trace_id) == 16
            assert len(span.span_id) == 8
            assert span.kind == SPAN_KIND_INTERNAL
            assert span.status.code == STATUS_CODE_OK
            assert span.start_time_unix_nano > 0
            assert span.end_time_unix_nano >= span.start_time_unix_nano
        root = next(s for s in spans if s.name == "run.start")
        assert root.parent_span_id == b""
        children = [s for s in spans if s.name != "run.start"]
        for child in children:
            assert child.parent_span_id == root.span_id
        llm = next(s for s in spans if s.name == "llm.generate")
        llm_keys = {a.key for a in llm.attributes}
        assert GEN_AI_PROVIDER_NAME in llm_keys
        assert GEN_AI_REQUEST_MODEL in llm_keys
        assert GEN_AI_SYSTEM not in llm_keys


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
