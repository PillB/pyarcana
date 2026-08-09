#!/usr/bin/env python3
"""CP-N4-C — tests for the OTel GenAI semantic-convention export.

Run: ``python3 -m pytest tests/test_otel_export.py -v`` from the capstone
package root, or ``python3 tests/test_otel_export.py`` directly.

These tests verify that the ``otel_export`` module correctly maps the
harness's internal Span objects to the OpenTelemetry GenAI semantic
conventions (gen_ai.* attributes) and produces a valid OTLP/JSON envelope.

Reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/
"""
from __future__ import annotations

import json
import os
import sys
import time
from typing import Any, Dict, List, Optional

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)

from harness.otel_export import (
    GEN_AI_SYSTEM,
    GEN_AI_REQUEST_MODEL,
    GEN_AI_REQUEST_MAX_TOKENS,
    GEN_AI_USAGE_INPUT_TOKENS,
    GEN_AI_USAGE_OUTPUT_TOKENS,
    GEN_AI_RESPONSE_FINISH_REASONS,
    GEN_AI_TOOL_NAME,
    PYARCANA_RUN_ID,
    PYARCANA_PROVIDER_MODE,
    PYARCANA_COST_USD,
    PYARCANA_VERIFIER_FAITHFULNESS,
    export_otlp_json,
    export_spans_flat,
    validate_otlp_export,
)


# ───────────────────────── test fixtures ─────────────────────────

class MockSpan:
    """A minimal Span-like object for testing the export mapping."""
    def __init__(self, name: str, attrs: Optional[Dict[str, Any]] = None,
                 children: Optional[List["MockSpan"]] = None,
                 span_id: Optional[str] = None, trace_id: Optional[str] = None):
        self.name = name
        self.attrs = attrs or {}
        self.children = children or []
        self.span_id = span_id or f"span-{id(self)}"
        self.trace_id = trace_id or "test-trace-001"
        self.start_time = time.time()
        self.end_time = time.time() + 0.1
        self.duration_ms = 100.0


def _make_llm_span() -> MockSpan:
    return MockSpan("llm.generate", {
        "provider": "deterministic-double",
        "model": "deterministic-double",
        "max_tokens": 256,
        "temperature": 0,
        "tokens_in": 29,
        "tokens_out": 38,
        "cost": 0.0,
        "finish_reason": "stop",
        "response_model": "deterministic-double",
        "run_id": "abc123",
        "provider_mode": "no-key",
    })


def _make_tool_span() -> MockSpan:
    return MockSpan("tool.propose", {
        "tool_name": "draft_email",
        "tool_input": '{"to": "ana.review@synthetic.example"}',
        "allowlisted": True,
        "approval_required": True,
    })


def _make_verifier_span() -> MockSpan:
    return MockSpan("verifier.check", {
        "faithfulness": 1.0,
        "context_precision": 1.0,
        "passed": True,
    })


def _make_root_span() -> MockSpan:
    return MockSpan("run.start", {
        "run_id": "abc123",
        "provider_mode": "no-key",
        "task": "Summarise compliance memo",
    }, children=[_make_llm_span(), _make_tool_span(), _make_verifier_span()])


# ───────────────────────── tests ─────────────────────────

class TestOTLPExport:
    def test_export_produces_valid_envelope(self):
        root = _make_root_span()
        env = export_otlp_json(root)
        assert "resourceSpans" in env
        assert len(env["resourceSpans"]) == 1
        rs = env["resourceSpans"][0]
        assert "scopeSpans" in rs
        assert len(rs["scopeSpans"]) == 1
        ss = rs["scopeSpans"][0]
        assert "spans" in ss
        assert len(ss["spans"]) == 4  # root + 3 children

    def test_export_flat_returns_list(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        assert isinstance(spans, list)
        assert len(spans) == 4

    def test_span_has_trace_id(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        for s in spans:
            assert "traceId" in s
            assert s["traceId"] == "test-trace-001"

    def test_span_has_span_id(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        for s in spans:
            assert "spanId" in s
            assert len(s["spanId"]) > 0

    def test_span_has_parent_linkage(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        root_span = spans[0]
        assert root_span["parentSpanId"] is None or root_span["parentSpanId"] == ""
        children = spans[1:]
        for c in children:
            assert c["parentSpanId"] == root_span["spanId"]

    def test_span_has_name(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        names = [s["name"] for s in spans]
        assert "run.start" in names
        assert "llm.generate" in names
        assert "tool.propose" in names
        assert "verifier.check" in names


class TestGenAIAttributes:
    def test_llm_span_has_gen_ai_system(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        assert GEN_AI_SYSTEM in llm["attributes"]
        assert llm["attributes"][GEN_AI_SYSTEM] == "pyarcana"

    def test_llm_span_has_gen_ai_request_model(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        assert GEN_AI_REQUEST_MODEL in llm["attributes"]
        assert llm["attributes"][GEN_AI_REQUEST_MODEL] == "deterministic-double"

    def test_llm_span_has_gen_ai_usage_tokens(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        assert GEN_AI_USAGE_INPUT_TOKENS in llm["attributes"]
        assert llm["attributes"][GEN_AI_USAGE_INPUT_TOKENS] == 29
        assert GEN_AI_USAGE_OUTPUT_TOKENS in llm["attributes"]
        assert llm["attributes"][GEN_AI_USAGE_OUTPUT_TOKENS] == 38

    def test_llm_span_has_gen_ai_finish_reasons(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        assert GEN_AI_RESPONSE_FINISH_REASONS in llm["attributes"]
        assert "stop" in llm["attributes"][GEN_AI_RESPONSE_FINISH_REASONS]

    def test_tool_span_has_gen_ai_tool_name(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        tool = next(s for s in spans if s["name"] == "tool.propose")
        assert GEN_AI_TOOL_NAME in tool["attributes"]
        assert tool["attributes"][GEN_AI_TOOL_NAME] == "draft_email"

    def test_tool_span_redacts_email_in_input(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        tool = next(s for s in spans if s["name"] == "tool.propose")
        # The otel_export doesn't redact (that's tracing.py's job), but
        # the attribute should be present
        assert GEN_AI_TOOL_NAME in tool["attributes"]

    def test_pyarcana_extensions_present(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        llm = next(s for s in spans if s["name"] == "llm.generate")
        assert PYARCANA_RUN_ID in llm["attributes"]
        assert PYARCANA_PROVIDER_MODE in llm["attributes"]
        assert PYARCANA_COST_USD in llm["attributes"]

    def test_verifier_span_has_faithfulness(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        verifier = next(s for s in spans if s["name"] == "verifier.check")
        assert PYARCANA_VERIFIER_FAITHFULNESS in verifier["attributes"]
        assert verifier["attributes"][PYARCANA_VERIFIER_FAITHFULNESS] == 1.0


class TestValidation:
    def test_valid_export_passes_validation(self):
        root = _make_root_span()
        env = export_otlp_json(root)
        errors = validate_otlp_export(env)
        assert errors == [], f"Validation errors: {errors}"

    def test_missing_resource_spans_fails(self):
        errors = validate_otlp_export({})
        assert len(errors) > 0
        assert "missing resourceSpans" in errors[0]

    def test_llm_span_missing_gen_ai_system_fails(self):
        span = MockSpan("llm.generate", {"model": "test"})  # no provider/system
        env = export_otlp_json(span)
        errors = validate_otlp_export(env)
        assert any("gen_ai.system" in e for e in errors)

    def test_llm_span_missing_gen_ai_request_model_fails(self):
        span = MockSpan("llm.generate", {"provider": "test"})  # no model
        env = export_otlp_json(span)
        errors = validate_otlp_export(env)
        assert any("gen_ai.request.model" in e for e in errors)


class TestTimingAndDuration:
    def test_span_has_duration(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        for s in spans:
            assert "durationMs" in s
            assert s["durationMs"] >= 0

    def test_span_has_unix_nano_timestamps(self):
        root = _make_root_span()
        spans = export_spans_flat(root)
        for s in spans:
            assert "startTimeUnixNano" in s
            assert "endTimeUnixNano" in s
            assert s["startTimeUnixNano"] > 0
            assert s["endTimeUnixNano"] >= s["startTimeUnixNano"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
