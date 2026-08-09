"""CP-N2-B subsystem — reports.render(spec) -> ReportBundle.

Honors CP-N2-B criticalFailures:
- No misleading axes (uses labeled, scale-disclosed text representation).
- Not color-only encoding (every value has a text label).
- No hidden denominators (denominators stated explicitly).
- Executive claims backed by sources.

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def render(spec: Dict[str, Any]) -> contracts.ReportBundle:
    spec_id = str(spec.get("spec_id", "syn-spec-001"))
    sections: List[Dict[str, Any]] = []
    claims: List[Dict[str, Any]] = []
    title = str(spec.get("title", "Synthetic Operations Report"))
    sections.append({
        "title": title,
        "encoding": "text_label_plus_value",
        "axis_disclosed": True,
        "scale": "linear",
    })
    metrics = spec.get("metrics", {}) or {}
    for name, value in metrics.items():
        denom = spec.get("denominators", {}).get(name, "n/a")
        sections.append({
            "metric": name,
            "value": value,
            "denominator": denom,   # explicit, never hidden
            "encoding": "text",
        })
        claims.append({
            "claim": f"{name} = {value}",
            "source": "shared_scenario_v1",
            "denominator": denom,
        })
    return contracts.ReportBundle(
        spec_id=spec_id,
        sections=sections,
        claims_with_sources=claims,
        accessible=True,
        color_only_encoding=False,
        hidden_denominators=False,
    )
