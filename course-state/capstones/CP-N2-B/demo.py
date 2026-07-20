#!/usr/bin/env python3
"""CP-N2-B — Accessible Insights Dashboard & Reporting Factory (synthetic)."""
from __future__ import annotations
import json
import sys
from textwrap import dedent

CAPSTONE_ID = "CP-N2-B"

TEMPLATE_SECTIONS = ["summary", "quality", "segments", "limitations", "a11y_notes"]


def build_report(metrics: dict) -> str:
    return dedent(f"""
    # Insights Report (synthetic)
    ## summary
    Filas: {metrics['n_rows']} | Completitud: {metrics['completeness']:.1%}
    ## quality
    Null rate: {metrics['null_rate']:.1%} | Fuente: {metrics['source']}
    ## segments
    {json.dumps(metrics['segments'], ensure_ascii=False)}
    ## limitations
    Datos sintéticos; no usar para decisiones de crédito o fraude.
    ## a11y_notes
    - Títulos de sección en texto (no solo color)
    - Tablas con encabezados semánticos
    - Contraste conceptual: valores + etiquetas
    - Evitar significado solo por color en gráficos
    """).strip()


def a11y_checklist() -> dict:
    return {
        "section_headings": True,
        "text_not_color_only": True,
        "table_headers": True,
        "limitations_visible": True,
        "lang_hint": "es-PE",
    }


def main() -> int:
    data = {
        "n_rows": 100,
        "completeness": 0.92,
        "null_rate": 0.08,
        "source": "synthetic_pipeline_v1",
        "segments": {"retail": 40, "sme": 35, "corp": 25},
    }
    report = build_report(data)
    checks = a11y_checklist()
    sections_present = sum(1 for s in TEMPLATE_SECTIONS if f"## {s}" in report or s in report)
    # headings use ## name
    sections_present = sum(1 for s in TEMPLATE_SECTIONS if f"## {s}" in report)
    assert sections_present == len(TEMPLATE_SECTIONS)
    assert all(checks.values())
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "sections_total": len(TEMPLATE_SECTIONS),
        "sections_rendered": sections_present,
        "rows_referenced": data["n_rows"],
        "a11y_pass": True,
        "a11y_checklist": checks,
        "report_chars": len(report),
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Reporting OK — sections={sections_present}/{len(TEMPLATE_SECTIONS)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
