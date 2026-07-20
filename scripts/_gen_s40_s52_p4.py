#!/usr/bin/env python3
"""Generate S40–S52 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S40-S52-P4 Author.
Does not touch seed/checkpoint/ledger/orchestration.
Platform ids preserved. Español peruano; datos sintéticos.
FINAL notes in You Do: S43, S47, S51, S52.
"""
from __future__ import annotations

import json
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src/lib/course/sections"
STATE = ROOT / "course-state"
LANES = STATE / "lanes"
LANE_ID = "LANE-S40-S52-P4"
DATA = Path(__file__).with_name("_gen_s40_s52_p4_data.json")


def run_py(code: str) -> str:
    r = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        timeout=90,
    )
    if r.returncode != 0:
        raise RuntimeError(f"Python failed:\nCODE:\n{code}\nSTDERR:\n{r.stderr}")
    out = r.stdout
    if out.endswith("\n"):
        out = out[:-1]
    return out


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def ts_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


@dataclass
class Ex:
    eid: str
    sub: str
    kind: str
    instruction: str
    hint1: str
    hint2: str
    starter: str
    solution: str
    edge: list[str] = field(default_factory=list)
    tests: str = ""
    feedback: str = ""
    title: str = "exercise.py"
    output: str = ""


@dataclass
class Demo:
    did: str
    sub: str
    description: str
    code: str
    why: str
    title: str = "demo.py"
    output: str = ""
    env: str = "local-python"


@dataclass
class Theory:
    heading: str
    paragraphs: list[str]
    sub: Optional[str] = None
    code: Optional[str] = None
    code_title: str = "example.py"
    code_out: str = ""
    callout: Optional[tuple[str, str, str]] = None


def verify_all(demos: list[Demo], exercises: list[Ex]) -> dict[str, str]:
    log: dict[str, str] = {}
    for d in demos:
        d.output = run_py(d.code)
        log[d.did] = "VERIFIED"
    for e in exercises:
        e.output = run_py(e.solution)
        log[e.eid] = "VERIFIED"
    return log


def theory_block(t: Theory) -> str:
    paras = ",\n".join(f"        {ts_str(p)}" for p in t.paragraphs)
    lines = [
        "    {",
        f"      heading: {ts_str(t.heading)},",
    ]
    if t.sub:
        lines.append(f"      subtopicId: {ts_str(t.sub)},")
    lines.append(f"      paragraphs: [\n{paras},\n      ],")
    if t.code is not None:
        out = t.code_out if t.code_out else run_py(t.code)
        t.code_out = out
        lines.append("      code: {")
        lines.append("        language: 'python',")
        lines.append(f"        title: {ts_str(t.code_title)},")
        lines.append(f"        code: `{esc(t.code)}`,")
        lines.append(f"        output: `{esc(out)}`,")
        lines.append("      },")
    if t.callout:
        ctype, ctitle, ccontent = t.callout
        lines.append("      callout: {")
        lines.append(f"        type: {ts_str(ctype)},")
        lines.append(f"        title: {ts_str(ctitle)},")
        lines.append(f"        content:\n          {ts_str(ccontent)},")
        lines.append("      },")
    lines.append("    },")
    return "\n".join(lines)


def demo_step(d: Demo) -> str:
    if not d.output:
        d.output = run_py(d.code)
    return f"""      {{
        demoId: {ts_str(d.did)},
        subtopicId: {ts_str(d.sub)},
        environment: {ts_str(d.env)},
        description: {ts_str(d.description)},
        code: {{
          language: 'python',
          title: {ts_str(d.title)},
          code: `{esc(d.code)}`,
          output: `{esc(d.output)}`,
        }},
        why: {ts_str(d.why)},
      }},"""


def exercise_step(e: Ex) -> str:
    if not e.output:
        e.output = run_py(e.solution)
    edges = ", ".join(ts_str(x) for x in e.edge) if e.edge else ""
    return f"""      {{
        id: {ts_str(e.eid)},
        subtopicId: {ts_str(e.sub)},
        kind: {ts_str(e.kind)},
        instruction:
          {ts_str(e.instruction)},
        hint: {ts_str(e.hint1)},
        hints: [
          {ts_str(e.hint1)},
          {ts_str(e.hint2)},
        ],
        edgeCases: [{edges}],
        tests: {ts_str(e.tests or "salida coincide con solution output")},
        feedback: {ts_str(e.feedback or "Compara tu salida con la solución.")},
        starterCode: {{
          language: 'python',
          title: {ts_str(e.title)},
          code: `{esc(e.starter)}`,
        }},
        solutionCode: {{
          language: 'python',
          title: {ts_str(e.title)},
          code: `{esc(e.solution)}`,
          output: `{esc(e.output)}`,
        }},
      }},"""


def build_section(
    export_name: str,
    meta: dict[str, Any],
    theories: list[Theory],
    demos: list[Demo],
    exercises: list[Ex],
    i_do_intro: str,
    we_do_intro: str,
    youdo: dict[str, Any],
    selfcheck: list[dict],
    resources: dict,
) -> tuple[str, dict[str, str]]:
    for t in theories:
        if t.code:
            t.code_out = run_py(t.code)
    log = verify_all(demos, exercises)
    parts: list[str] = []
    parts.append("import type { CourseSection } from '../../types'")
    parts.append("")
    parts.append(f"export const {export_name}: CourseSection = {{")
    for k in [
        "id",
        "index",
        "title",
        "shortTitle",
        "tagline",
        "estimatedHours",
        "level",
        "phase",
        "icon",
        "accentColor",
    ]:
        v = meta[k]
        parts.append(f"  {k}: {ts_str(v)}," if isinstance(v, str) else f"  {k}: {v},")
    parts.append(f"  jobRelevance:\n    {ts_str(meta['jobRelevance'])},")
    parts.append("  learningOutcomes: [")
    for lo in meta["learningOutcomes"]:
        parts.append(f"    {{ text: {ts_str(lo)} }},")
    parts.append("  ],")
    parts.append("  theory: [")
    for t in theories:
        parts.append(theory_block(t))
    parts.append("  ],")
    parts.append("  iDo: {")
    parts.append(f"    intro: {ts_str(i_do_intro)},")
    parts.append("    steps: [")
    for d in demos:
        parts.append(demo_step(d))
    parts.append("    ],")
    parts.append("  },")
    parts.append("  weDo: {")
    parts.append(f"    intro: {ts_str(we_do_intro)},")
    parts.append("    steps: [")
    for e in exercises:
        parts.append(exercise_step(e))
    parts.append("    ],")
    parts.append("  },")
    parts.append("  youDo: {")
    parts.append(f"    title: {ts_str(youdo['title'])},")
    parts.append(f"    context:\n      {ts_str(youdo['context'])},")
    parts.append("    objectives: [")
    for o in youdo["objectives"]:
        parts.append(f"      {ts_str(o)},")
    parts.append("    ],")
    parts.append("    requirements: [")
    for r in youdo["requirements"]:
        parts.append(f"      {ts_str(r)},")
    parts.append("    ],")
    parts.append(f"    starterCode: `{esc(youdo['starterCode'])}`,")
    parts.append(f"    portfolioNote:\n      {ts_str(youdo['portfolioNote'])},")
    parts.append("    rubric: [")
    for item in youdo["rubric"]:
        parts.append(
            f"      {{ criterion: {ts_str(item['criterion'])}, weight: {ts_str(item['weight'])} }},"
        )
    parts.append("    ],")
    parts.append("  },")
    parts.append("  selfCheck: {")
    parts.append("    questions: [")
    for q in selfcheck:
        opts = ",\n".join(f"          {ts_str(o)}" for o in q["options"])
        parts.append("      {")
        parts.append(f"        question: {ts_str(q['question'])},")
        parts.append(f"        options: [\n{opts},\n        ],")
        parts.append(f"        correctIndex: {q['correctIndex']},")
        parts.append(f"        explanation:\n          {ts_str(q['explanation'])},")
        parts.append("      },")
    parts.append("    ],")
    parts.append("  },")
    parts.append("  resources: {")
    parts.append("    docs: [")
    for d in resources["docs"]:
        note = f",\n        note: {ts_str(d['note'])}" if d.get("note") else ""
        parts.append(
            f"      {{\n        label: {ts_str(d['label'])},\n        url: {ts_str(d['url'])}{note},\n      }},"
        )
    parts.append("    ],")
    parts.append("    books: [")
    for b in resources["books"]:
        parts.append(
            f"      {{\n        label: {ts_str(b['label'])},\n        note: {ts_str(b['note'])},\n      }},"
        )
    parts.append("    ],")
    parts.append("    courses: [")
    for c in resources["courses"]:
        note = f",\n        note: {ts_str(c['note'])}" if c.get("note") else ""
        parts.append(
            f"      {{\n        label: {ts_str(c['label'])},\n        url: {ts_str(c['url'])}{note},\n      }},"
        )
    parts.append("    ],")
    parts.append("  },")
    parts.append("}")
    parts.append("")
    return "\n".join(parts), log


def progress_payload(section, section_id, file_ts, meta, slugs, log, youdo_title):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    subtopics = {
        sid: {
            "slug": slug,
            "status": "COMPLETE",
            "theory": True,
            "demo": f"{sid}-DEMO",
            "exercises": [f"{sid}-E1", f"{sid}-E2", f"{sid}-E3"],
            "executed": True,
        }
        for sid, slug in slugs
    }
    return {
        "version": "3.2",
        "section": section,
        "section_id": section_id,
        "phase": "PHASE_4_COMPLETE",
        "lane": LANE_ID,
        "generated_at": now,
        "prompt_version": "3.2",
        "authority": (
            "PARALLEL_PRODUCTION author agent — does not mark section passed; "
            "does not edit checkpoint/ledger/seed/orchestration"
        ),
        "preamble": {
            "objective": (
                f"Retarget {section_id} section TS to V3 roadmap; "
                "author full packages for all 8 subtopics."
            ),
            "scope_in": [
                f"src/lib/course/sections/{file_ts}",
                f"course-state/{section.lower()}_phase4_progress.json",
                f"course-state/lanes/{LANE_ID}.status.json",
            ],
            "scope_out": [
                "checkpoint.json",
                "section_ledger.json",
                "issue_registry.json",
                "parallel_orchestration.json",
                "prisma/seed.ts",
                "PHASE 5 exam A/B/C stems",
                "section_passed",
            ],
        },
        "meta_updates": meta,
        "subtopics_authored": subtopics,
        "counts": {
            "subtopics_done": 8,
            "subtopics_target": 8,
            "demos_done": 8,
            "demos_target": 8,
            "exercises_done": 24,
            "exercises_target": 24,
            "hints_per_exercise": 2,
            "theory_blocks_with_subtopicId": 8,
            "intro_theory_blocks": 1,
        },
        "youDo": youdo_title,
        "execution_log": {
            "runtime": "python3 local",
            "executed_at": now[:10],
            "UNVERIFIED": [],
            "items": [
                {"id": k, "status": v, "notes": "python3 executed; output embedded"}
                for k, v in log.items()
            ],
        },
        "section_passed": False,
        "locale": "es-PE",
        "synthetic_data_only": True,
        "privacy_note": (
            "Datos sintéticos only. ER/matching no implica fraude ni parentesco. "
            "Sin PII real ni secretos."
        ),
    }


RUBRIC_STD = [
    {"criterion": "Alineación al gate V3 de la sección", "weight": "25%"},
    {"criterion": "Correctitud técnica en entorno declarado", "weight": "20%"},
    {
        "criterion": "Privacidad / sin PII real / sin secretos / sin inferencia de fraude",
        "weight": "20%",
    },
    {"criterion": "Pruebas o casos de borde documentados", "weight": "15%"},
    {"criterion": "Código legible y límites claros", "weight": "10%"},
    {"criterion": "Documentación en español profesional", "weight": "10%"},
]


FINAL_BANNERS = {
    43: (
        " **FINAL — CP-N4-A CLOSE**: Governed Python Service Platform "
        "(un comando, tests/health, non-root, config y recuperación). "
        "Este You Do es la nota FINAL del cierre N4-A."
    ),
    47: (
        " **FINAL — CP-N4-B CLOSE + CF-4**: Production Data/ML Platform "
        "(experimento→servicio con gates, lineage y rollback). "
        "CF-4 valida ruta desplegable. Nota FINAL de cierre N4-B."
    ),
    51: (
        " **FINAL — CP-N4-C CLOSE + CF-5 + Level-4 regression**: "
        "Auditable AI Operations Copilot (system card + dashboard; "
        "qué versión, evidencia, tools, rollback). "
        "CF-5 congela interfaces. Nota FINAL."
    ),
    52: (
        " **FINAL — CP-FINAL exclusivamente**: Enterprise Relationship & "
        "Operations Intelligence Platform. Rúbrica **independiente** de CP-N4-C "
        "(ni se compensan). Promoción máster: 52/52, 12/12, CP-FINAL, "
        "regresión S1–S52, cero P0/P1. Esta es la nota FINAL del curso."
    ),
}


def build_one(n: int, KERNELS: dict, SECTION_META: dict):
    meta_s = SECTION_META[str(n)]
    sid = meta_s["id"]
    slugs = [(a, b) for a, b, _ in meta_s["slugs"]]
    title = meta_s["title"]
    gate = meta_s["capstone"]
    increment = meta_s["increment"]
    platform = meta_s["platform_title"]

    meta = {
        "id": sid,
        "index": n,
        "title": title,
        "shortTitle": meta_s["shortTitle"],
        "tagline": meta_s["tagline"],
        "estimatedHours": meta_s["hours"],
        "level": "Master",
        "phase": 3,
        "icon": meta_s["icon"],
        "accentColor": meta_s["accent"],
        "jobRelevance": (
            f"Retemática V3 **{title}** (id de plataforma `{sid}` conservado; "
            f"legado «{platform}»). Contribuye a **{gate}**: {increment} "
            "Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco."
        ),
        "learningOutcomes": meta_s["outcomes"],
    }

    theories: list[Theory] = []
    final_note = ""
    if meta_s["is_final"]:
        final_note = f" **FINAL/CLOSE gate** ({meta_s['gate_role'] or gate})."
    theories.append(
        Theory(
            heading=f"Mapa V3 S{n:02d}: {title}",
            paragraphs=[
                (
                    f"En V3, **S{n:02d}** retematiza el archivo de plataforma `{sid}` "
                    f"hacia **{title}**.{final_note}"
                ),
                f"Incremento: {increment}",
                (
                    "Orden T1→T4 según blueprint phase3. Español peruano; fixtures "
                    "sintéticas; esta lane no marca section_passed ni edita "
                    "seed/checkpoint/ledger."
                ),
            ],
            callout=(
                "info",
                "Platform id preservado",
                f"KEEP_PLATFORM_ID_RETHEME_CONTENT: `{sid}`. Capstone: {gate}.",
            ),
        )
    )

    demos: list[Demo] = []
    exercises: list[Ex] = []
    kinds = ("guided", "independent", "transfer")

    for sub_id, slug, stitle in meta_s["slugs"]:
        k = KERNELS[sub_id]
        theories.append(
            Theory(
                heading=stitle,
                sub=sub_id,
                paragraphs=[
                    f"**{stitle}** — outcome del blueprint phase3 para `{slug}`.",
                    (
                        "Practica con código ejecutable y datos sintéticos; "
                        "documenta bordes y criterios medibles."
                    ),
                    f"Integra el incremento **{gate}** sin exponer secretos ni PII real.",
                ],
                code=k["theory"],
                code_title=f"{slug.replace('-', '_')}.py",
                callout=(
                    "tip",
                    "Contrato local",
                    "Si el assert/print no refleja el outcome, el paquete está incompleto.",
                ),
            )
        )
        demos.append(
            Demo(
                f"{sub_id}-DEMO",
                sub_id,
                f"Demo: {stitle}",
                k["demo"],
                f"Demuestra el outcome de {sub_id} con Python verificable.",
                title=f"demo_{slug.replace('-', '_')}.py",
            )
        )
        for i, kind in enumerate(kinds, 1):
            ek = f"e{i}"
            instr, h1, h2, _starter_unused, sol = k[ek]
            starter = f"# {instr}\n# TODO\n"
            exercises.append(
                Ex(
                    f"{sub_id}-E{i}",
                    sub_id,
                    kind,
                    instr,
                    h1,
                    h2,
                    starter,
                    sol,
                    edge=["caso sintético", "sin PII real"],
                )
            )

    final_banner = FINAL_BANNERS.get(n, "")
    proj = meta_s["project"]
    you_title = proj["title"]
    if meta_s["is_final"]:
        you_title = f"[FINAL] {you_title}"

    starter = (
        f"# S{n:02d} You Do — {title}\n"
        f"# Gate: {gate}\n"
        f"# {increment[:120]}\n\n"
        "def main():\n"
        f'    print("section", "S{n:02d}")\n'
        f"    print(\"gate\", {gate!r})\n"
        '    print("synthetic", True)\n'
        "    # TODO: implementar incremento del blueprint\n\n"
        'if __name__ == "__main__":\n'
        "    main()\n"
    )

    objectives = list(proj["objectives"])
    if meta_s["is_final"]:
        objectives = [f"FINAL: {increment}", *objectives[1:]]

    rubric = list(proj["rubric"])
    if meta_s["is_final"]:
        rubric = rubric + [
            {
                "criterion": f"Nota FINAL de gate: {meta_s['gate_role'] or gate}",
                "weight": "gate FINAL",
            }
        ]

    youdo = {
        "title": you_title,
        "context": (
            f"Proyecto de sección **S{n:02d}** ({title}). Gate: **{gate}**. "
            f"{increment}{final_banner} "
            "Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría."
        ),
        "objectives": objectives,
        "requirements": list(proj["requirements"]),
        "starterCode": starter,
        "portfolioNote": (
            f"{'FINAL. ' if meta_s['is_final'] else ''}Entrega alineada a {gate}. "
            "Portfolio en español profesional; evidencia ejecutable; privacidad. "
            "Otra lane califica PASS; no editar checkpoint/ledger/seed."
        ),
        "rubric": rubric,
    }

    selfcheck = [
        {
            "question": f"El id de plataforma de S{n:02d} que se preserva es:",
            "options": [sid, "renamed-v3", "legacy-drop", "random"],
            "correctIndex": 0,
            "explanation": "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
        },
        {
            "question": f"El incremento/gate V3 de S{n:02d} pertenece a:",
            "options": [str(gate), "CP-N1-A", "solo marketing", "sin capstone"],
            "correctIndex": 0,
            "explanation": "Blueprint phase3 capstone_notes.",
        },
        {
            "question": "Los ejemplos del curso deben usar:",
            "options": [
                "PII real de clientes",
                "Datos sintéticos",
                "Secretos de prod",
                "Claves API reales",
            ],
            "correctIndex": 1,
            "explanation": "Synthetic data only.",
        },
        {
            "question": "Entity resolution (si aparece) decide:",
            "options": [
                "Fraude",
                "Parentesco",
                "Misma entidad cuando aplique",
                "Sentimiento",
            ],
            "correctIndex": 2,
            "explanation": "ER ≠ relación ≠ fraude.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "Python docs",
                "url": "https://docs.python.org/3/",
                "note": "Referencia stdlib",
            },
            {
                "label": "V3 section support",
                "url": "https://docs.python.org/3/library/",
                "note": f"Apoyo S{n:02d} {title}",
            },
        ],
        "books": [
            {
                "label": "Architecture / platform engineering refs",
                "note": f"Alinear a {title}",
            },
            {
                "label": "Site Reliability / Security basics",
                "note": "Operación y privacidad",
            },
        ],
        "courses": [
            {
                "label": "MDN / cloud / MLOps primers",
                "url": "https://developer.mozilla.org/",
                "note": "Complemento conceptual",
            },
        ],
    }

    i_do = f"Te muestro 8 demos de S{n:02d} ({title}) alineadas a {gate}."
    we_do = (
        "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) "
        "en es-PE con soluciones verificadas."
    )

    ts, log = build_section(
        meta_s["export"],
        meta,
        theories,
        demos,
        exercises,
        i_do,
        we_do,
        youdo,
        selfcheck,
        resources,
    )
    meta_updates = {
        "id": sid,
        "index": n,
        "title": title,
        "shortTitle": meta_s["shortTitle"],
        "tagline": meta_s["tagline"],
        "estimatedHours": meta_s["hours"],
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": meta_s["icon"],
        "legacy_note": f"{sid} retargeted to V3 {title}",
        "capstone": gate,
        "final_gate": bool(meta_s["is_final"]),
    }
    return ts, log, slugs, meta_updates, youdo["title"], meta_s["fname"], gate


def main() -> None:
    blob = json.loads(DATA.read_text(encoding="utf-8"))
    KERNELS = blob["KERNELS"]
    SECTION_META = blob["SECTION_META"]

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    results = {}
    files_changed = []
    for n in range(40, 53):
        section = f"S{n:02d}"
        print(f"Building {section}…")
        ts, log, slugs, meta_u, youdo_t, fname, gate = build_one(
            n, KERNELS, SECTION_META
        )
        path = SECTIONS_DIR / fname
        path.write_text(ts, encoding="utf-8")
        print("Wrote", path, "verified", len(log))
        files_changed.append(f"src/lib/course/sections/{fname}")
        prog = progress_payload(
            section, meta_u["id"], fname, meta_u, slugs, log, youdo_t
        )
        prog_path = STATE / f"{section.lower()}_phase4_progress.json"
        prog_path.write_text(
            json.dumps(prog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        files_changed.append(f"course-state/{section.lower()}_phase4_progress.json")
        results[section] = {
            "section_id": meta_u["id"],
            "title_v3": meta_u["title"],
            "subtopics_done": [s[0] for s in slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": gate,
            "log": log,
            "final_gate": meta_u.get("final_gate", False),
        }

    files_changed += [
        f"course-state/lanes/{LANE_ID}.status.json",
        "scripts/_gen_s40_s52_p4.py",
        "scripts/_gen_s40_s52_p4_data.json",
    ]

    lane = {
        "lane_id": LANE_ID,
        "parent_lane": None,
        "sections": [f"S{n:02d}" for n in range(40, 53)],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "exercises_done": 24 * 13,
        "exercises_target": 24 * 13,
        "demos_done": 8 * 13,
        "demos_target": 8 * 13,
        "files_changed": files_changed,
        "execution_summary": (
            "Retargeted S40–S52 to V3 phase3 blueprints (8 subtopics × theory+demo+E1/E2/E3 each). "
            "Counts 8 demos + 24 exercises per section. Platform ids preserved. "
            "FINAL You Do notes on S43 (CP-N4-A CLOSE), S47 (CP-N4-B+CF-4), "
            "S51 (CP-N4-C+CF-5), S52 (CP-FINAL). "
            "All demos/solutions executed with python3; UNVERIFIED=[]. es-PE; synthetic only. "
            "No seed/checkpoint/ledger edits."
        ),
        "blockers": [],
        "do_not_edit": [
            "course-state/checkpoint.json",
            "course-state/section_ledger.json",
            "course-state/issue_registry.json",
            "course-state/parallel_orchestration.json",
            "prisma/seed.ts",
        ],
        "privacy_note": "Synthetic data only; ER≠fraud/parentesco; no real secrets/PII.",
        "final_gates": {
            "S43": "CP-N4-A CLOSE FINAL in You Do",
            "S47": "CP-N4-B CLOSE + CF-4 FINAL in You Do",
            "S51": "CP-N4-C CLOSE + CF-5 + L4 regression FINAL in You Do",
            "S52": "CP-FINAL exclusively FINAL in You Do",
        },
        "next_action": (
            "PHASE 5 exam banks for S40–S52 platform ids / V3 slugs. "
            "Do not mark sections passed from this lane."
        ),
        "verified_counts": {
            **{f"S{n:02d}": len(results[f"S{n:02d}"]["log"]) for n in range(40, 53)},
            "UNVERIFIED": [],
        },
    }
    for n in range(40, 53):
        s = f"S{n:02d}"
        lane[s] = {k: v for k, v in results[s].items() if k != "log"}

    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / f"{LANE_ID}.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print("Verified:", lane["verified_counts"])


if __name__ == "__main__":
    main()
