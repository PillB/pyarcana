#!/usr/bin/env python3
"""CP-N4-C — tests for the OTel GenAI export, aligned with actual tracing.py.

Run: python3 -m pytest tests/test_otel_export.py -v
"""
from __future__ import annotations
import os, sys, pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)

from harness.tracing import Span, Tracer, redact
from harness.otel_export import (
    GEN_AI_SYSTEM, GEN_AI_REQUEST_MODEL, GEN_AI_USAGE_INPUT_TOKENS,
    GEN_AI_USAGE_OUTPUT_TOKENS, GEN_AI_RESPONSE_FINISH_REASONS,
    GEN_AI_TOOL_NAME, PYARCANA_RUN_ID, PYARCANA_PROVIDER_MODE,
    PYARCANA_COST_USD, PYARCANA_VERIFIER_FAITHFULNESS,
    export_otlp_json, export_spans_flat, validate_otlp_export,
)


@pytest.fixture
def tracer_with_spans():
    """Create a Tracer with realistic spans matching the production harness."""
    t = Tracer()
    with t.span("run.start", run_id="abc123", provider_mode="no-key", task="test task"):
        with t.span("llm.generate", provider="deterministic-double", model="deterministic-double",
                     max_tokens=256, temperature=0, tokens_in=29, tokens_out=38,
                     cost=0.0, finish_reason="stop", response_model="deterministic-double",
                     run_id="abc123", provider_mode="no-key"):
            pass
        with t.span("tool.propose", tool_name="draft_email",
                     tool_input='{"to": "ana.review@synthetic.example"}',
                     allowlisted=True, approval_required=True):
            pass
        with t.span("verifier.check", faithfulness=1.0, context_precision=1.0, passed=True):
            pass
    return t


class TestOTLPExport:
    def test_export_from_tracer_produces_all_spans(self, tracer_with_spans):
        env = export_otlp_json(tracer_with_spans)
        spans = env["resourceSpans"][0]["scopeSpans"][0]["spans"]
        assert len(spans) == 4  # root + llm + tool + verifier

    def test_export_from_span_list(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        assert isinstance(spans, list)
        assert len(spans) == 4

    def test_trace_id_is_32_hex_chars(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            assert len(s["traceId"]) == 32
            assert all(c in "0123456789abcdef" for c in s["traceId"])

    def test_all_spans_share_same_trace_id(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        trace_ids = {s["traceId"] for s in spans}
        assert len(trace_ids) == 1

    def test_parent_child_linkage_via_parent_id(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        root = spans[0]
        assert root["parentSpanId"] == ""
        children = spans[1:]
        for c in children:
            assert c["parentSpanId"] == root["spanId"]

    def test_span_names_preserved(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        names = {s["name"] for s in spans}
        assert "run.start" in names
        assert "llm.generate" in names
        assert "tool.propose" in names
        assert "verifier.check" in names


class TestGenAIAttributes:
    def test_llm_span_has_gen_ai_system(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        keys = {kv["key"] for kv in llm["attributes"]}
        assert GEN_AI_SYSTEM in keys

    def test_llm_span_has_gen_ai_request_model(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        keys = {kv["key"] for kv in llm["attributes"]}
        assert GEN_AI_REQUEST_MODEL in keys

    def test_llm_span_has_usage_tokens(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        attrs = {kv["key"]: kv["value"] for kv in llm["attributes"]}
        assert GEN_AI_USAGE_INPUT_TOKENS in attrs
        assert GEN_AI_USAGE_OUTPUT_TOKENS in attrs

    def test_tool_span_has_gen_ai_tool_name(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        tool = next(s for s in spans if s["name"] == "tool.propose")
        attrs = {kv["key"]: kv["value"] for kv in tool["attributes"]}
        assert GEN_AI_TOOL_NAME in attrs

    def test_pyarcana_extensions_present(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        keys = {kv["key"] for kv in llm["attributes"]}
        assert PYARCANA_RUN_ID in keys
        assert PYARCANA_PROVIDER_MODE in keys

    def test_verifier_has_faithfulness(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        verifier = next(s for s in spans if s["name"] == "verifier.check")
        keys = {kv["key"] for kv in verifier["attributes"]}
        assert PYARCANA_VERIFIER_FAITHFULNESS in keys


class TestRedaction:
    def test_email_redacted_in_tool_input(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        tool = next(s for s in spans if s["name"] == "tool.propose")
        attrs = {kv["key"]: kv["value"] for kv in tool["attributes"]}
        tool_input = attrs.get("gen_ai.tool.input", {})
        # The email should be redacted
        raw = str(tool_input)
        assert "ana.review@synthetic.example" not in raw
        assert "email-redacted" in raw or "redacted" in raw.lower()

    def test_no_raw_emails_in_any_attr(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            raw = str(s["attributes"])
            assert "@synthetic.example" not in raw


class TestOTLPProtobufFormat:
    def test_attributes_are_keyvalue_objects(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            for attr in s["attributes"]:
                assert "key" in attr
                assert "value" in attr
                assert isinstance(attr["value"], dict)

    def test_string_values_use_stringvalue(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            for attr in s["attributes"]:
                val = attr["value"]
                # Should have a typed value key like stringValue, intValue, etc.
                assert any(k in val for k in ("stringValue", "intValue", "doubleValue", "boolValue", "arrayValue"))

    def test_starttime_is_unix_nano_string(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            assert "startTimeUnixNano" in s
            assert isinstance(s["startTimeUnixNano"], str)
            assert int(s["startTimeUnixNano"]) > 0


class TestValidation:
    def test_valid_export_passes(self, tracer_with_spans):
        env = export_otlp_json(tracer_with_spans)
        errors = validate_otlp_export(env)
        assert errors == [], f"Validation errors: {errors}"

    def test_missing_resource_spans_fails(self):
        errors = validate_otlp_export({})
        assert len(errors) > 0

    def test_trace_id_validation(self, tracer_with_spans):
        env = export_otlp_json(tracer_with_spans)
        errors = validate_otlp_export(env)
        assert not any("traceId" in e for e in errors)


class TestTimestamps:
    def test_uses_actual_start_ms(self, tracer_with_spans):
        """Verify the exporter reads start_ms/end_ms, not start_time/end_time."""
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            start_nano = int(s["startTimeUnixNano"])
            # Should be a realistic millisecond timestamp (not 0 or near-zero)
            assert start_nano > 1_000_000_000_000_000  # > ~2001 in nanoseconds

    def test_end_after_start(self, tracer_with_spans):
        spans = export_spans_flat(tracer_with_spans)
        for s in spans:
            start = int(s["startTimeUnixNano"])
            end = int(s["endTimeUnixNano"])
            assert end >= start


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
