#!/usr/bin/env python3
"""Generate V3 topic evaluations (4 TE × 52 sections = 208 packages).

Reads topic titles/bodies from learning_roadmap_52_V3.md and writes:
  course-state/topic_evaluations/sNN_te.json

Each TE package:
  - id, topic_id, title
  - 2 authentic tasks (synthetic data only)
  - rubric_0_3: correctness / robustness / maintainability / responsible_use

Español peruano. Regenerable: python3 scripts/generate_topic_evaluations.py
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROADMAP = ROOT / "learning_roadmap_52_V3.md"
OUT_DIR = ROOT / "course-state" / "topic_evaluations"

# Platform section ids (from src/lib/course/sections) keyed by index
SECTION_IDS: dict[int, str] = {
    1: "setup",
    2: "basics",
    3: "data-structures",
    4: "functions-modules",
    5: "oop",
    6: "numpy",
    7: "data-acquisition",
    8: "pandas",
    9: "visualization",
    10: "sklearn",
    11: "testing",
    12: "performance",
    13: "rpa-automation",
    14: "security",
    15: "stdlib-deep",
    16: "wxpython-gui",
    17: "packaging",
    18: "data-engineering",
    19: "databases-orm",
    20: "rag",
    21: "fastapi",
    22: "rapidfuzz-entity",
    23: "computer-vision",
    24: "rpa-advanced",
    25: "streamlit-dashboards",
    26: "integrator-phase1",
    27: "async-concurrency",
    28: "llm-agents",
    29: "mlops",
    30: "security-infra",
    31: "streaming-data",
    32: "microservices",
    33: "advanced-models",
    34: "cv-ai-integration",
    35: "system-design",
    36: "ai-apis-advanced",
    37: "dbt-bigquery",
    38: "performance-extreme",
    39: "integrator-phase2",
    40: "agentic-architecture",
    41: "llm-finetuning",
    42: "graph-rag",
    43: "llmops",
    44: "multimodal",
    45: "iac",
    46: "gpu-computing",
    47: "opensource",
    48: "ai-governance",
    49: "data-contracts",
    50: "tech-leadership",
    51: "integrator-final",
    52: "career-strategy",
}


def parse_roadmap(text: str) -> list[dict]:
    sections: list[dict] = []
    current: dict | None = None
    for line in text.splitlines():
        m = re.match(r"^### S(\d+)\s+[—\-]\s+(.+)$", line)
        if m:
            if current:
                sections.append(current)
            current = {
                "n": int(m.group(1)),
                "title": m.group(2).strip(),
                "topics": [],
            }
            continue
        m = re.match(r"^- T(\d+)\s+([^:]+):\s*(.+)$", line)
        if m and current is not None:
            body = m.group(3).strip()
            # Split U1 / U2 on first semicolon when present
            if ";" in body:
                u1, u2 = [p.strip().rstrip(".") for p in body.split(";", 1)]
            else:
                parts = [p.strip() for p in re.split(r";|, y | y ", body) if p.strip()]
                if len(parts) >= 2:
                    mid = len(parts) // 2
                    u1 = "; ".join(parts[:mid])
                    u2 = "; ".join(parts[mid:])
                else:
                    u1 = body
                    u2 = body
            current["topics"].append(
                {
                    "t": int(m.group(1)),
                    "name": m.group(2).strip(),
                    "body": body,
                    "u1": u1,
                    "u2": u2,
                }
            )
    if current:
        sections.append(current)
    return sections


def privacy_rubric_line(section_n: int) -> str:
    base = (
        "¿Usa solo datos sintéticos o autorizados, sin secretos ni PII real?"
    )
    if section_n >= 7:
        return (
            base
            + " ¿Evita inferir fraude, parentesco o colusión desde matching/scores?"
        )
    return base


def rubric_for(topic_name: str, section_n: int) -> dict[str, str]:
    return {
        "correctness": (
            f"¿Las tareas demuestran dominio correcto de «{topic_name}» "
            "con resultados verificables?"
        ),
        "robustness": (
            "¿Maneja casos vacíos, inválidos o de borde sin romper el flujo?"
        ),
        "maintainability": (
            "¿El artefacto es legible, reproducible y usable por un colega?"
        ),
        "responsible_use": privacy_rubric_line(section_n),
    }


def task_deliverable(section_n: int, topic: dict, which: int) -> tuple[str, str]:
    """Return (title, deliverable) for task 1 or 2 of a topic."""
    name = topic["name"]
    focus = topic["u1"] if which == 1 else topic["u2"]
    sn = f"S{section_n:02d}"
    # Keep focus short for title
    focus_short = focus if len(focus) <= 72 else focus[:69] + "…"

    title = f"Tarea auténtica — {name}: {focus_short}"
    deliverable = (
        f"Artefacto ejecutable o documentado (script/notebook/README) sobre datos "
        f"**sintéticos** que demuestra: {focus}. "
        f"Incluye 3–6 oraciones de justificación en español peruano, comandos de "
        f"reproducción y al menos un caso borde. Sección {sn}, tema T{topic['t']}."
    )
    if section_n >= 13 or any(
        k in (topic["body"] + name).lower()
        for k in ("entity", "match", "relación", "grafo", "fraude", "parentesco", "er")
    ):
        deliverable += (
            " Matching/scores son evidencia para revisión humana; "
            "**no** prueba de fraude, parentesco ni colusión."
        )
    return title, deliverable


def build_te_package(section: dict) -> dict:
    n = section["n"]
    sid = SECTION_IDS.get(n, f"s{n:02d}")
    evaluations = []
    for topic in section["topics"]:
        t = topic["t"]
        tasks = []
        for i in (1, 2):
            title, deliverable = task_deliverable(n, topic, i)
            tasks.append(
                {
                    "id": f"S{n:02d}-T{t}-TE-{i}",
                    "title": title,
                    "authentic": True,
                    "deliverable": deliverable,
                    "synthetic_data_only": True,
                }
            )
        evaluations.append(
            {
                "id": f"S{n:02d}-T{t}-TE",
                "topic_id": f"S{n:02d}-T{t}",
                "title": f"Evaluación formativa — {topic['name']}",
                "subtopics_covered": [f"S{n:02d}-T{t}-A", f"S{n:02d}-T{t}-B"],
                "topic_summary": topic["body"],
                "tasks": tasks,
                "rubric_0_3": rubric_for(topic["name"], n),
                "gate_provisional": {
                    "min_total": 9,
                    "max_total": 12,
                    "min_per_criterion": 2,
                    "note": (
                        "Gate provisional V3: ≥9/12, ningún criterio crítico <2, "
                        "pruebas críticas en verde."
                    ),
                },
            }
        )

    return {
        "version": "3.2",
        "section": f"S{n:02d}",
        "section_id": sid,
        "section_title": section["title"],
        "artifact": "topic_evaluations",
        "platform_note": (
            "Paquetes TE V3 (4 por sección). Datos estructurados para render "
            "TopicEvaluation; CourseSection.topicEvaluations es opcional."
        ),
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "rubric_scale": "0-3 per criterion",
        "language": "es-PE",
        "synthetic_data_only": True,
        "privacy_principle": (
            "Coincidir en apellido, teléfono, email, dirección, distancia o "
            "transacciones es evidencia para revisión, no prueba de parentesco, "
            "colusión o fraude."
        ),
        "topic_evaluations": evaluations,
        "counts": {
            "topic_evaluations": len(evaluations),
            "tasks": sum(len(e["tasks"]) for e in evaluations),
        },
    }


def main() -> int:
    text = ROADMAP.read_text(encoding="utf-8")
    sections = parse_roadmap(text)
    if len(sections) != 52:
        raise SystemExit(f"Expected 52 sections in roadmap, got {len(sections)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total_te = 0
    total_tasks = 0
    written = []

    for section in sections:
        if len(section["topics"]) != 4:
            raise SystemExit(
                f"S{section['n']:02d} has {len(section['topics'])} topics, expected 4"
            )
        pkg = build_te_package(section)
        out = OUT_DIR / f"s{section['n']:02d}_te.json"
        out.write_text(
            json.dumps(pkg, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        total_te += pkg["counts"]["topic_evaluations"]
        total_tasks += pkg["counts"]["tasks"]
        written.append(str(out.relative_to(ROOT)))

    manifest = {
        "version": "3.2",
        "artifact": "topic_evaluations_manifest",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "files": written,
        "totals": {
            "sections": len(sections),
            "topic_evaluations": total_te,
            "tasks": total_tasks,
        },
        "expected": {"sections": 52, "topic_evaluations": 208, "tasks": 416},
    }
    (OUT_DIR / "_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        f"Wrote {len(written)} TE files → {total_te} evaluations, "
        f"{total_tasks} tasks under {OUT_DIR.relative_to(ROOT)}"
    )
    if total_te != 208:
        print(f"WARNING: expected 208 TE packages, got {total_te}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
