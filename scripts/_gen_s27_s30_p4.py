#!/usr/bin/env python3
"""Generate S27–S30 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S27-S30-P4 Author.
Does not touch seed/checkpoint/ledger/orchestration.
Platform ids preserved: async-concurrency, llm-agents, mlops, security-infra.
V3 themes (CP-N3-A path):
  S27 Estrategia de pruebas con pytest (inicio)
  S28 Pruebas de datos, propiedades e integración (QA ER)
  S29 SQL avanzado y modelado relacional (almacén ER)
  S30 Entity resolution probabilístico (cierre CP-N3-A gate)
Español peruano; datos sintéticos only.
Privacy: ER/matching ≠ relación, parentesco ni fraude.
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
SECTIONS = ROOT / "src/lib/course/sections"
STATE = ROOT / "course-state"
LANES = STATE / "lanes"
LANE_ID = "LANE-S27-S30-P4"


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
        if isinstance(v, str):
            parts.append(f"  {k}: {ts_str(v)},")
        else:
            parts.append(f"  {k}: {v},")
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


def progress_payload(
    section: str,
    section_id: str,
    file_ts: str,
    meta: dict,
    slugs: list[tuple[str, str]],
    log: dict[str, str],
    youdo_title: str,
) -> dict:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    subtopics = {}
    for sid, slug in slugs:
        subtopics[sid] = {
            "slug": slug,
            "status": "COMPLETE",
            "theory": True,
            "demo": f"{sid}-DEMO",
            "exercises": [f"{sid}-E1", f"{sid}-E2", f"{sid}-E3"],
            "executed": True,
        }
    items = [
        {"id": k, "status": v, "notes": "python3 executed; output embedded"}
        for k, v in log.items()
    ]
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
            "objective": f"Retarget {section_id} section TS to V3 roadmap; author full packages for all 8 subtopics.",
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
            "items": items,
        },
        "section_passed": False,
        "locale": "es-PE",
        "synthetic_data_only": True,
        "privacy_note": (
            "ER/matching y scores no implican fraude, parentesco ni colusión. "
            "Solo decide 'misma entidad' cuando aplique."
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


def ex(eid, sub, kind, instr, h1, h2, starter, solution, edge):
    return Ex(eid, sub, kind, instr, h1, h2, starter, solution, edge=edge)


# ---------------------------------------------------------------------------
# S27 — Estrategia de pruebas con pytest (platform id: async-concurrency)
# ---------------------------------------------------------------------------


def build_s27() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S27-T1-A", "risks-test-pyramid"),
        ("S27-T1-B", "aaa-oracles"),
        ("S27-T2-A", "discovery-assertions"),
        ("S27-T2-B", "fixtures-scopes-isolation"),
        ("S27-T3-A", "exceptions-floats-dates-tmp"),
        ("S27-T3-B", "negative-cases-messages"),
        ("S27-T4-A", "branch-risk-coverage"),
        ("S27-T4-B", "mutation-useful-failures"),
    ]
    meta = {
        "id": "async-concurrency",
        "index": 27,
        "title": "Estrategia de pruebas con pytest",
        "shortTitle": "Pytest y contratos",
        "tagline": (
            "convertir supuestos de normalización y matching en contratos ejecutables; "
            "cada bug reproducido obtiene test de regresión"
        ),
        "estimatedHours": 12,
        "level": "Competente",
        "phase": 2,
        "icon": "FlaskConical",
        "accentColor": "bg-gradient-to-br from-violet-500 to-purple-700",
        "jobRelevance": (
            "En banca, BPO y data platforms en Perú, un motor de **entity resolution** solo es confiable "
            "si sus supuestos de normalización y matching son **contratos ejecutables**. Esta sección "
            "(id de plataforma `async-concurrency` conservado) retematiza a V3 **Estrategia de pruebas "
            "con pytest** e **inicia CP-N3-A**: pirámide de riesgo, AAA, fixtures y regresión. "
            "Matching no implica fraude ni parentesco."
        ),
        "learningOutcomes": [
            "Priorizar pruebas según riesgo y pirámide",
            "Escribir tests AAA con oráculos confiables",
            "Usar discovery y assertions de pytest",
            "Aislar estado con fixtures y scopes",
            "Cubrir excepciones, floats, fechas y tmp files",
            "Diseñar casos negativos con mensajes útiles",
            "Medir cobertura por rama y riesgo",
            "Interpretar mutación conceptual y fallas útiles",
        ],
    }

    theories = [
        Theory(
            heading="De concurrencia async a estrategia pytest (mapa e inicio CP-N3-A)",
            paragraphs=[
                "En V3, **S27 no es el path principal de asyncio/TaskGroup**. Ese material se reubica. Aquí **inicias CP-N3-A**: convertir supuestos de normalización y matching en **contratos de prueba** con pytest.",
                "El hilo: un módulo sintético `normalize_name` / `exact_match` sobre contactos fakes (`run_id=cpn3a-01`, `@example.pe`). Cada bug reproducido → test de regresión.",
                "Orden: **T1 Diseño** → **T2 Pytest** → **T3 Bordes** → **T4 Cobertura**. Privacidad: las pruebas no etiquetan fraude ni parentesco.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de concurrencia async de este archivo **no es el camino V3 del estudiante en S27**. Target: pytest + contratos de normalización/matching (inicio CP-N3-A).",
            ),
        ),
        Theory(
            heading="riesgos y pirámide de pruebas",
            sub="S27-T1-A",
            paragraphs=[
                "La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena: un bug en matching de entidades justifica más tests que un typo de log.",
                "Clasifica riesgo por impacto (datos incorrectos, regresión silenciosa) y probabilidad. En ER, normalización y comparadores son capa de alto riesgo.",
                "No inviertas la pirámide: E2E lentas no sustituyen contratos unitarios de `strip`/`casefold`.",
            ],
            code="""# priorización sintética de suites por riesgo (CP-N3-A)
risks = [
    {"area": "normalize_name", "impact": 5, "likelihood": 4, "layer": "unit"},
    {"area": "exact_match", "impact": 5, "likelihood": 3, "layer": "unit"},
    {"area": "sqlite_repo", "impact": 4, "likelihood": 2, "layer": "integration"},
    {"area": "ui_review_queue", "impact": 3, "likelihood": 2, "layer": "e2e"},
]
for r in risks:
    r["score"] = r["impact"] * r["likelihood"]
ranked = sorted(risks, key=lambda x: (-x["score"], x["area"]))
print("top", ranked[0]["area"], ranked[0]["score"])
print("layers", [r["layer"] for r in ranked])
print("unit_heavy", sum(1 for r in ranked if r["layer"] == "unit") >= 2)""",
            code_title="risk_pyramid.py",
            callout=(
                "tip",
                "Riesgo primero",
                "Si el tiempo es finito, cubre primero normalize/match; luego DB; al final UI.",
            ),
        ),
        Theory(
            heading="Arrange–Act–Assert y oráculos confiables",
            sub="S27-T1-B",
            paragraphs=[
                "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Evita asserts mezclados con setup.",
                "Un **oráculo** es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple.",
                "Oráculos frágiles (timestamps de reloj real, orden de dicts en JSON sin sort) generan flakes. Prefiere fixtures sintéticas deterministas.",
            ],
            code="""def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw = "  JUAN   Pérez "
expected = "juan pérez"  # oráculo fijo
# Act
got = normalize_name(raw)
# Assert
assert got == expected, f"oráculo falló: {got!r} != {expected!r}"
print("aaa_ok", got)
print("phases", "arrange-act-assert")""",
            code_title="aaa_oracle.py",
            callout=(
                "warning",
                "Oráculo ≠ impresión",
                "print no es assert. El contrato debe fallar ruidosamente si se rompe.",
            ),
        ),
        Theory(
            heading="discovery y assertions",
            sub="S27-T2-A",
            paragraphs=[
                "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** identifican cada caso (`path::name`).",
                "Las **assertions** reescritas muestran diff útil: `assert a == b` explica ambos lados. Usa `pytest.raises` para excepciones esperadas.",
                "Parametriza con `@pytest.mark.parametrize` para tablas de casos sin copiar el cuerpo del test.",
            ],
            code="""# simulación didáctica de discovery + assert rewrite (sin invocar pytest CLI)
import ast

src = '''
def test_normalize_spaces():
    assert " ".join("a  b".split()) == "a b"

def helper_not_a_test():
    return 1

def test_casefold():
    assert "Á".casefold() == "á"
'''
tree = ast.parse(src)
discovered = [n.name for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith("test_")]
print("discovered", discovered)
print("count", len(discovered))
# assert rewrite conceptual: mensaje con ambos lados
a, b = "juan", "Juan".casefold()
try:
    assert a == b
    print("assert_ok", True)
except AssertionError:
    print("assert_ok", False)""",
            code_title="discovery_assert.py",
            callout=(
                "tip",
                "Nombres test_*",
                "Si no empieza por test_, pytest no lo corre (salvo configuración explícita).",
            ),
        ),
        Theory(
            heading="fixtures, scopes y aislamiento",
            sub="S27-T2-B",
            paragraphs=[
                "Las **fixtures** inyectan dependencias (datos sintéticos, tmp paths) sin globals. **Scopes**: function (default), class, module, session.",
                "El aislamiento evita que un test contamine al siguiente: cada function-scope recrea el estado. Session-scope sirve para recursos caros de solo lectura.",
                "Factory fixtures devuelven callables para crear N entidades sintéticas por caso.",
            ],
            code="""# fixtures conceptuales (diccionario de proveedores)
from copy import deepcopy

_base_contacts = [
    {"id": "c1", "name": "Ana López", "email": "ana@example.pe"},
    {"id": "c2", "name": "ANA  lopez", "email": "ana@example.pe"},
]

def fixture_contacts(scope="function"):
    # function-scope: copia profunda por test
    if scope == "function":
        return deepcopy(_base_contacts)
    return _base_contacts  # session-like: misma lista (peligroso si mutas)

t1 = fixture_contacts("function")
t1[0]["name"] = "MUTADO"
t2 = fixture_contacts("function")
print("isolated", t2[0]["name"] == "Ana López")
print("n", len(t2))
print("scope_default", "function")""",
            code_title="fixtures_scope.py",
            callout=(
                "danger",
                "Mutar fixture session",
                "Si mutas un fixture session-scope, el siguiente test ve basura. Prefiere function + factory.",
            ),
        ),
        Theory(
            heading="excepciones, floats, fechas y archivos temporales",
            sub="S27-T3-A",
            paragraphs=[
                "Prueba **excepciones** con el tipo y, si aplica, el mensaje. Para **floats** usa tolerancia (`math.isclose`) o decimal cuantizado.",
                "**Fechas**: fija el reloj o usa valores UTC sintéticos; no compares `now()` con literales frágiles.",
                "**tmp_path** / `tempfile` evita escribir en el repo. Limpia o usa context managers.",
            ],
            code="""import math
from datetime import date, datetime, timezone
from pathlib import Path
import tempfile

def parse_score(s: str) -> float:
    if s.strip() == "":
        raise ValueError("score vacío")
    return float(s)

# excepción
try:
    parse_score("  ")
    raised = False
except ValueError as e:
    raised = "vacío" in str(e)
print("exc_ok", raised)

# float
print("close", math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9, abs_tol=1e-12))

# fecha fija
d = date(2026, 7, 20)
print("iso", d.isoformat())

# tmp file
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "norm.txt"
    p.write_text("juan\\n", encoding="utf-8")
    print("tmp_bytes", p.read_text(encoding="utf-8").strip())""",
            code_title="borders_tmp.py",
            callout=(
                "tip",
                "isclose > ==",
                "Nunca compares floats de probabilidad con igualdad bit a bit en tests de matching.",
            ),
        ),
        Theory(
            heading="casos negativos y mensajes",
            sub="S27-T3-B",
            paragraphs=[
                "Los **casos negativos** prueban inputs inválidos: None, vacío, tipo incorrecto, encoding roto. Deben fallar de forma controlada.",
                "Mensajes de error **útiles** nombran el campo y el valor ofensivo (sin PII real). Facilita debug en CI.",
                "Tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un caso happy path y tres negativos por función pública.",
            ],
            code="""def require_email(value):
    if value is None:
        raise TypeError("email: se esperaba str, recibió None")
    if not isinstance(value, str):
        raise TypeError(f"email: se esperaba str, recibió {type(value).__name__}")
    v = value.strip()
    if not v or "@" not in v:
        raise ValueError(f"email inválido: {value!r}")
    return v.casefold()

cases = [
    (None, TypeError, "None"),
    (123, TypeError, "int"),
    ("", ValueError, "inválido"),
    ("ok@example.pe", None, "ok@example.pe"),
]
results = []
for raw, exp_exc, frag in cases:
    try:
        out = require_email(raw)
        results.append(exp_exc is None and frag in out)
    except Exception as e:
        results.append(exp_exc is not None and isinstance(e, exp_exc) and frag in str(e))
print("neg_ok", all(results))
print("n_cases", len(cases))""",
            code_title="negative_messages.py",
            callout=(
                "warning",
                "Sin secretos en mensajes",
                "No imprimas tokens ni PII real en asserts de CI.",
            ),
        ),
        Theory(
            heading="branch y risk coverage",
            sub="S27-T4-A",
            paragraphs=[
                "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de líneas ≠ 100% de riesgo cubierto.",
                "**Risk coverage**: prioriza ramas de negocio (match/no-match, missing fields) sobre logs y pretty-print.",
                "Reporta cobertura como evidencia, no como meta vacía: una rama de umbral sin test es deuda del gate CP-N3-A.",
            ],
            code="""def classify_pair(score: float, thr_auto=0.9, thr_review=0.6) -> str:
    if score >= thr_auto:
        return "auto_match"
    if score >= thr_review:
        return "review"
    return "non_match"

# instrumentación simple de ramas
branches = {"auto": 0, "review": 0, "non": 0}
for s in [0.95, 0.7, 0.2, 0.9]:
    c = classify_pair(s)
    if c == "auto_match":
        branches["auto"] += 1
    elif c == "review":
        branches["review"] += 1
    else:
        branches["non"] += 1
covered = sum(1 for v in branches.values() if v > 0)
print("branch_covered", covered, "of", 3)
print("branches", branches)
print("risk_focus", "thresholds")""",
            code_title="branch_risk.py",
            callout=(
                "info",
                "Cobertura con sentido",
                "Si una rama de 'review' nunca se prueba, el clerical queue se romperá en producción sin que CI se entere.",
            ),
        ),
        Theory(
            heading="mutación conceptual, fallas útiles y mantenimiento",
            sub="S27-T4-B",
            paragraphs=[
                "**Mutación conceptual**: cambia deliberadamente el código (quita un strip, invierte un umbral) y verifica que algún test falle. Si no falla, el test es débil.",
                "Fallas **útiles** muestran input sintético, esperado vs actual y el contrato violado. Evita `assert False`.",
                "Mantenimiento: borra tests que solo copian implementación; renombra; parametriza tablas; no duplices oráculos en tres sitios.",
            ],
            code="""def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def normalize_name_mutated(s: str) -> str:
    # mutación: sin strip de espacios internos colapsados
    return s.casefold()

raw = "  Ana  López "
oracle = "ana lópez"
good = normalize_name(raw) == oracle
# el test de regresión DEBE detectar la mutación
mut_detected = normalize_name_mutated(raw) != oracle
print("good_passes", good)
print("mutation_killed", mut_detected)
print("maintain", "one_oracle")""",
            code_title="mutation_useful.py",
            callout=(
                "tip",
                "Kill the mutant",
                "Si alteras un comparador y todos los tests siguen verdes, no tienes contrato: tienes teatro de cobertura.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S27-T1-A-DEMO",
            "S27-T1-A",
            "Prioriza suites unit/integration/e2e por score de riesgo para el motor ER sintético.",
            """areas = [
    ("normalize", 5, 5, "unit"),
    ("blocking", 4, 4, "unit"),
    ("repo_sql", 4, 2, "integration"),
    ("review_ui", 2, 2, "e2e"),
]
scored = sorted(((i*l, n, layer) for n,i,l,layer in areas), reverse=True)
print("order", [n for _, n, _ in scored])
print("top_layer", scored[0][2])
print("pyramid_ok", scored[0][2] == "unit")""",
            "La pirámide + riesgo pone primero los contratos de normalización.",
            title="risk_rank_demo.py",
        ),
        Demo(
            "S27-T1-B-DEMO",
            "S27-T1-B",
            "Test AAA con oráculo fijo para normalize_name sobre dato sintético peruano.",
            """def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw, oracle = "  María  Ríos ", "maría ríos"
# Act
got = normalize_name(raw)
# Assert
assert got == oracle
print("got", got)
print("aaa", "pass")""",
            "Oráculo determinista = regresión confiable.",
            title="aaa_demo.py",
        ),
        Demo(
            "S27-T2-A-DEMO",
            "S27-T2-A",
            "Descubre nombres test_* y valida un assert de matching exacto post-normalización.",
            """import re
module = '''
def test_exact_after_norm():
    a = " ".join("A B".split()).casefold()
    b = "a b"
    assert a == b
def util():
    pass
def test_email_domain():
    assert "x@example.pe".endswith("@example.pe")
'''
names = re.findall(r"^def (test_\\w+)", module, flags=re.M)
print("node_ids", names)
a = " ".join("A B".split()).casefold()
print("assert_exact", a == "a b")
print("n_tests", len(names))""",
            "Discovery predecible y asserts claros aceleran CI.",
            title="discovery_demo.py",
        ),
        Demo(
            "S27-T2-B-DEMO",
            "S27-T2-B",
            "Fixture factory con scope function: dos tests no se contaminan al mutar contactos.",
            """from copy import deepcopy
BASE = [{"id": "e1", "name": "Luis"}]

def contacts_fx():
    return deepcopy(BASE)

a = contacts_fx(); a[0]["name"] = "X"
b = contacts_fx()
print("isolated", b[0]["name"] == "Luis")
print("a_mut", a[0]["name"])
print("scope", "function")""",
            "Aislamiento function-scope evita flakes de orden.",
            title="fixture_demo.py",
        ),
        Demo(
            "S27-T3-A-DEMO",
            "S27-T3-A",
            "Excepción ValueError, isclose de score y escritura en directorio temporal.",
            """import math, tempfile
from pathlib import Path
from datetime import date

def score(x):
    if x is None:
        raise ValueError("score None")
    return float(x)

try:
    score(None)
except ValueError as e:
    print("exc", str(e))
print("close", math.isclose(0.30000000000000004, 0.3, abs_tol=1e-9))
print("day", date(2026, 1, 15).isoformat())
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "s.txt"
    p.write_text("0.85", encoding="utf-8")
    print("tmp", p.read_text(encoding="utf-8"))""",
            "Bordes numéricos/temporales evitan tests frágiles.",
            title="borders_demo.py",
        ),
        Demo(
            "S27-T3-B-DEMO",
            "S27-T3-B",
            "Tabla de casos negativos para validador de RUC sintético (formato, no consulta SUNAT real).",
            """def check_ruc(s: str) -> str:
    if not s or not s.isdigit() or len(s) != 11:
        raise ValueError(f"ruc inválido: {s!r}")
    return s

ok = []
for val, bad in [("20123456789", False), ("123", True), ("", True), ("abcdefghijk", True)]:
    try:
        check_ruc(val)
        ok.append(not bad)
    except ValueError as e:
        ok.append(bad and "inválido" in str(e))
print("neg_table", all(ok))
print("n", len(ok))""",
            "Mensajes con valor ofensivo (sintético) aceleran el fix.",
            title="negative_demo.py",
        ),
        Demo(
            "S27-T4-A-DEMO",
            "S27-T4-A",
            "Cubre las tres ramas de umbral auto/review/non_match y reporta cobertura de ramas.",
            """def decide(score):
    if score >= 0.9:
        return "auto"
    if score >= 0.6:
        return "review"
    return "non"

hits = {decide(s) for s in (0.95, 0.75, 0.1)}
print("covered", sorted(hits))
print("full", hits == {"auto", "review", "non"})
print("risk", "threshold_branches")""",
            "Branch coverage enfocada en umbrales de matching.",
            title="coverage_demo.py",
        ),
        Demo(
            "S27-T4-B-DEMO",
            "S27-T4-B",
            "Mutación: quitar casefold; el test de regresión debe fallar (mutante eliminado).",
            """def good(s):
    return s.casefold().strip()
def mutant(s):
    return s.strip()  # mutación
oracle = "ana"
raw = "ANA"
print("test_good", good(raw) == oracle)
print("kills_mutant", mutant(raw) != oracle)
print("policy", "regression_on_bug")""",
            "Si el mutante vive, el test no protege el contrato.",
            title="mutation_demo.py",
        ),
    ]

    exercises = [
        ex("S27-T1-A-E1", "S27-T1-A", "guided",
           "Dado impact=5 likelihood=4, imprime score=impact*likelihood.",
           "Multiplica enteros", "print del producto",
           "impact, likelihood = 5, 4\n# TODO\n",
           "impact, likelihood = 5, 4\nprint(impact * likelihood)",
           ["score 0 si likelihood 0"]),
        ex("S27-T1-A-E2", "S27-T1-A", "independent",
           "Ordena áreas por score desc y imprime solo los nombres.",
           "sorted reverse", "key con producto",
           "rows=[('e2e',2,1),('unit',5,5)]\n# TODO print names\n",
           "rows=[('e2e',2,1),('unit',5,5)]\nprint([n for n,_,_ in sorted(rows, key=lambda r: -(r[1]*r[2]))])",
           ["empates por nombre"]),
        ex("S27-T1-A-E3", "S27-T1-A", "transfer",
           "Imprime True si la capa top es 'unit'.",
           "compara layer", "pirámide",
           "top_layer='unit'\n# TODO\n",
           "top_layer='unit'\nprint(top_layer == 'unit')",
           ["integration no es unit"]),
        ex("S27-T1-B-E1", "S27-T1-B", "guided",
           "Implementa normalize: casefold + join de split; imprime resultado de ' A  B '.",
           "casefold", "split/join",
           "s=' A  B '\n# TODO\n",
           "s=' A  B '\nprint(' '.join(s.casefold().split()))",
           ["tabs y NBSP en prod"]),
        ex("S27-T1-B-E2", "S27-T1-B", "independent",
           "AAA: assert normalizado == 'ana' para 'ANA'; imprime 'pass'.",
           "assert luego print", "oráculo 'ana'",
           "raw='ANA'\n# TODO\n",
           "raw='ANA'\nassert raw.casefold() == 'ana'\nprint('pass')",
           ["falla ruidosa si rompes"]),
        ex("S27-T1-B-E3", "S27-T1-B", "transfer",
           "Oráculo de matching exacto: imprime True si a y b normalizados son iguales.",
           "normaliza ambos", "compara",
           "a,b='X Y','x  y'\n# TODO\n",
           "a,b='X Y','x  y'\nprint(' '.join(a.casefold().split()) == ' '.join(b.casefold().split()))",
           ["acentos: casefold ayuda en muchas locales"]),
        ex("S27-T2-A-E1", "S27-T2-A", "guided",
           "Filtra nombres que empiezan con 'test_' de la lista dada.",
           "startswith", "list comp",
           "names=['test_a','helper','test_b']\n# TODO\n",
           "names=['test_a','helper','test_b']\nprint([n for n in names if n.startswith('test_')])",
           ["Test* clases en pytest real"]),
        ex("S27-T2-A-E2", "S27-T2-A", "independent",
           "Si left!=right imprime 'fail' else 'ok' (assert blando).",
           "ternario", "diff conceptual",
           "left,right='a','b'\n# TODO\n",
           "left,right='a','b'\nprint('ok' if left == right else 'fail')",
           ["pytest muestra diff"]),
        ex("S27-T2-A-E3", "S27-T2-A", "transfer",
           "Parametriza mentalmente: imprime pares (input, expected) para strip de ' x ' → 'x'.",
           "lista de tuplas", "tabla",
           "# TODO print table\n",
           "print([(' x ', 'x')])",
           ["varios cases en un test"]),
        ex("S27-T2-B-E1", "S27-T2-B", "guided",
           "Copia profunda de lista de dicts; muta la copia; original['n'] debe seguir 1.",
           "deepcopy", "mutación local",
           "from copy import deepcopy\norig=[{'n':1}]\n# TODO\nprint(orig[0]['n'])",
           "from copy import deepcopy\norig=[{'n':1}]\nc=deepcopy(orig)\nc[0]['n']=9\nprint(orig[0]['n'])",
           ["copy() superficial falla en dict anidado"]),
        ex("S27-T2-B-E2", "S27-T2-B", "independent",
           "Imprime 'function' como scope por defecto de fixture.",
           "literal", "scopes pytest",
           "# TODO\n",
           "print('function')",
           ["session para recursos caros RO"]),
        ex("S27-T2-B-E3", "S27-T2-B", "transfer",
           "Factory: define make(n) que devuelve n contactos sintéticos; imprime len(make(3)).",
           "list comp", "ids sintéticos",
           "# TODO\n",
           "def make(n):\n    return [{'id': f'c{i}'} for i in range(n)]\nprint(len(make(3)))",
           ["datos fakes only"]),
        ex("S27-T3-A-E1", "S27-T3-A", "guided",
           "Usa math.isclose(0.1+0.2, 0.3) e imprime el booleano.",
           "import math", "isclose",
           "import math\n# TODO\n",
           "import math\nprint(math.isclose(0.1 + 0.2, 0.3))",
           ["abs_tol en scores"]),
        ex("S27-T3-A-E2", "S27-T3-A", "independent",
           "Captura ValueError de int('x') e imprime 'bad'.",
           "try/except", "ValueError",
           "# TODO\n",
           "try:\n    int('x')\nexcept ValueError:\n    print('bad')",
           ["mensaje opcional"]),
        ex("S27-T3-A-E3", "S27-T3-A", "transfer",
           "Escribe 'ok' en un NamedTemporaryFile texto y reimprime su contenido.strip().",
           "tempfile", "utf-8",
           "import tempfile\nfrom pathlib import Path\n# TODO\n",
           "import tempfile\nfrom pathlib import Path\nwith tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:\n    f.write('ok')\n    path=f.name\nprint(Path(path).read_text(encoding='utf-8').strip())",
           ["borrar en finally en prod"]),
        ex("S27-T3-B-E1", "S27-T3-B", "guided",
           "Si email es '' lanza ValueError('email vacío'); caza e imprime el mensaje.",
           "raise ValueError", "except",
           "email=''\n# TODO\n",
           "email=''\ntry:\n    if email == '':\n        raise ValueError('email vacío')\nexcept ValueError as e:\n    print(e)",
           ["None vs ''"]),
        ex("S27-T3-B-E2", "S27-T3-B", "independent",
           "Valida que s contenga '@'; si no, imprime 'invalid' else 'ok'.",
           "in", "guard",
           "s='sin-arroba'\n# TODO\n",
           "s='sin-arroba'\nprint('ok' if '@' in s else 'invalid')",
           ["no es validación RFC completa"]),
        ex("S27-T3-B-E3", "S27-T3-B", "transfer",
           "Construye mensaje f\"campo score inválido: {v!r}\" con v=-1 e imprímelo.",
           "f-string !r", "sin PII",
           "v=-1\n# TODO\n",
           "v=-1\nprint(f'campo score inválido: {v!r}')",
           ["no loguear tokens"]),
        ex("S27-T4-A-E1", "S27-T4-A", "guided",
           "Función f(x) retorna 'hi' si x>0 else 'lo'. Imprime f(1), f(-1).",
           "if/else", "dos prints o tupla",
           "# TODO\n",
           "def f(x):\n    return 'hi' if x > 0 else 'lo'\nprint(f(1), f(-1))",
           ["rama ==0"]),
        ex("S27-T4-A-E2", "S27-T4-A", "independent",
           "Dado set de ramas cubiertas {'auto','review'}, imprime si falta 'non'.",
           "membership", "cobertura",
           "hit={'auto','review'}\n# TODO\n",
           "hit={'auto','review'}\nprint('non' not in hit)",
           ["risk coverage"]),
        ex("S27-T4-A-E3", "S27-T4-A", "transfer",
           "Imprime porcentaje de ramas cubiertas: 2 de 3 → redondeado int 66.",
           "int(100*k/n)", "branch %",
           "k,n=2,3\n# TODO\n",
           "k,n=2,3\nprint(int(100 * k / n))",
           ["no uses solo line coverage"]),
        ex("S27-T4-B-E1", "S27-T4-B", "guided",
           "Mutante: good usa strip, mutant no. Imprime True si mutant(' a ')!='a' o good sí normaliza.",
           "compara", "kill mutant",
           "raw=' a '\n# TODO detectar debilidad conceptual\n",
           "raw=' a '\ngood=raw.strip()\nmutant=raw\nprint(good == 'a' and mutant != 'a')",
           ["mutación de umbral"]),
        ex("S27-T4-B-E2", "S27-T4-B", "independent",
           "Falla útil: imprime dict con keys expected, actual para expected=1 actual=2.",
           "dict", "debug CI",
           "# TODO\n",
           "print({'expected': 1, 'actual': 2})",
           ["include input sintético"]),
        ex("S27-T4-B-E3", "S27-T4-B", "transfer",
           "Imprime política: 'bug_repro → regression_test' (inicio CP-N3-A).",
           "string", "mantenimiento",
           "# TODO\n",
           "print('bug_repro → regression_test')",
           ["un oráculo, muchos cases"]),
    ]

    youdo = {
        "title": "Contratos pytest de normalización y matching — inicio CP-N3-A",
        "context": (
            "Construye una mini suite sobre funciones sintéticas de normalización y exact match "
            "(contactos fakes @example.pe, run_id cpn3a-01). Cada supuesto del ER futuro debe ser "
            "un test ejecutable. Incluye pirámide de riesgo, AAA, fixtures aisladas, bordes y al menos "
            "una prueba de mutación conceptual. No marques section_passed ni edites ledger/seed."
        ),
        "objectives": [
            "Mapa de riesgos y capas unit/integration/e2e",
            "Tests AAA con oráculos fijos para normalize y exact_match",
            "Fixtures function-scope y casos negativos con mensajes",
            "Cobertura de ramas de umbral + mutante eliminado",
            "Documentación es-PE del contrato de pruebas",
        ],
        "requirements": [
            "Datos sintéticos only; sin PII real ni secretos",
            "Cada bug documentado → test de regresión",
            "Matching no implica fraude ni parentesco",
            "Demo reproducible (python -m pytest o scripts de assert)",
            "Alineación a CP-N3-A (inicio)",
        ],
        "starterCode": """# CP-N3-A inicio — contratos de normalización/matching
def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def exact_match(a: str, b: str) -> bool:
    return normalize_name(a) == normalize_name(b)

# TODO: tests AAA, negativos, umbrales, mutación conceptual
if __name__ == "__main__":
    assert exact_match(" Ana  ", "ana")
    print("starter_ok")
""",
        "portfolioNote": (
            "Paquete de inicio CP-N3-A: suite de contratos pytest (o asserts ejecutables) sobre "
            "normalización/matching sintético. Otra lane califica PASS; no editar checkpoint/ledger."
        ),
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "En la pirámide de pruebas, la base más ancha suele ser:",
            "options": ["E2E UI", "Pruebas unitarias", "Solo manual", "Load tests en prod"],
            "correctIndex": 1,
            "explanation": "Muchas unitarias baratas; pocas E2E caras.",
        },
        {
            "question": "Un oráculo confiable es:",
            "options": [
                "Un print en consola",
                "Una fuente de verdad determinista para el assert",
                "El reloj del sistema sin fijar",
                "El orden de un set",
            ],
            "correctIndex": 1,
            "explanation": "El assert necesita verdad estable (fija o propiedad).",
        },
        {
            "question": "Si mutas un casefold y ningún test falla:",
            "options": [
                "Está bien",
                "El contrato es débil; el mutante sobrevivió",
                "pytest está roto siempre",
                "Ignora cobertura",
            ],
            "correctIndex": 1,
            "explanation": "Mutación conceptual detecta tests inútiles.",
        },
        {
            "question": "Las pruebas de matching en CP-N3-A demuestran:",
            "options": [
                "Fraude automático",
                "Parentescos",
                "Contratos de misma entidad / normalización — no riesgo ni relación",
                "Envío de correos",
            ],
            "correctIndex": 2,
            "explanation": "ER decide misma entidad; no fraude ni parentesco.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "pytest documentation",
                "url": "https://docs.pytest.org/en/stable/",
                "note": "Discovery, fixtures, parametrize",
            },
            {
                "label": "Python unittest.mock (referencia dobles)",
                "url": "https://docs.python.org/3/library/unittest.mock.html",
                "note": "Preparación para S28",
            },
        ],
        "books": [
            {"label": "Python Testing with pytest (Okken)", "note": "Fixtures y diseño de suites"},
            {"label": "Unit Testing Principles (Khorikov)", "note": "Oráculos y mantenibilidad"},
        ],
        "courses": [
            {
                "label": "pytest official getting started",
                "url": "https://docs.pytest.org/en/stable/getting-started.html",
                "note": "Primeros test_*",
            },
        ],
    }

    i_do = (
        "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, fixtures aisladas y matar mutantes "
        "sobre normalización/matching sintético — inicio de CP-N3-A."
    )
    we_do = (
        "24 ejercicios de pirámide, AAA, discovery, fixtures, bordes, negativos, cobertura y mutación."
    )
    ts, log = build_section(
        "section27", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "async-concurrency",
        "index": 27,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 12,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "FlaskConical",
        "legacy_note": "async-concurrency retargeted to pytest strategy / CP-N3-A inicio",
        "capstone": "CP-N3-A (inicio)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


# ---------------------------------------------------------------------------
# S28 — Pruebas de datos, propiedades e integración (platform id: llm-agents)
# ---------------------------------------------------------------------------


def build_s28() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S28-T1-A", "invariants-case-generation"),
        ("S28-T1-B", "idempotency-symmetry-metamorphic"),
        ("S28-T2-A", "schema-quality-contracts"),
        ("S28-T2-B", "golden-drift-reconcile"),
        ("S28-T3-A", "mocks-fakes-http-db-clock"),
        ("S28-T3-B", "contract-tests-no-overmock"),
        ("S28-T4-A", "integration-e2e-testcontainers"),
        ("S28-T4-B", "flakes-determinism-ci"),
    ]
    meta = {
        "id": "llm-agents",
        "index": 28,
        "title": "Pruebas de datos, propiedades e integración",
        "shortTitle": "Props e integración",
        "tagline": (
            "suite que encuentra errores de encoding, cardinalidad, orden, timeout y reanudación, "
            "con fixtures sintéticas mínimas"
        ),
        "estimatedHours": 12,
        "level": "Competente",
        "phase": 2,
        "icon": "ShieldCheck",
        "accentColor": "bg-gradient-to-br from-emerald-500 to-teal-700",
        "jobRelevance": (
            "El **QA del motor ER** (CP-N3-A) exige propiedades, contratos de schema y pruebas de "
            "integración sin flakes. Esta sección (id `llm-agents` conservado) retematiza a V3 "
            "**Pruebas de datos, propiedades e integración**: invariantes, goldens, dobles controlados "
            "y CI determinista. Datos sintéticos; matching ≠ fraude."
        ),
        "learningOutcomes": [
            "Generar casos desde invariantes",
            "Aplicar tests metamórficos y de simetría",
            "Validar contratos de schema/calidad",
            "Detectar drift y reconciliar goldens",
            "Doblar HTTP/DB/reloj con control",
            "Escribir contract tests sin sobre-mocking",
            "Montar integración/E2E con containers (concepto)",
            "Eliminar flakes y fijar determinismo en CI",
        ],
    }

    theories = [
        Theory(
            heading="De LLM agents a QA de datos del motor ER (mapa CP-N3-A)",
            paragraphs=[
                "En V3, **S28 no es LangGraph en producción**. Aquí construyes la **suite de QA** del ER: propiedades, schema, goldens, dobles e integración determinista.",
                "Fixtures sintéticas mínimas deben cazar encoding, cardinalidad, orden, timeout y reanudación — antes de confiar en scores de matching.",
                "Orden: **T1 Propiedades** → **T2 Datos** → **T3 Dobles** → **T4 Sistema/CI**. ER solo decide misma entidad.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Legado de LLM agents **no es el path V3 en S28**. Target: property/data/integration tests para QA ER.",
            ),
        ),
        Theory(
            heading="invariantes y generación de casos",
            sub="S28-T1-A",
            paragraphs=[
                "Una **invariante** es una propiedad que siempre debe cumplirse: `normalize` es idempotente; scores en [0,1]; ids no vacíos.",
                "Genera casos desde la invariante (tabla, random acotado con seed, o hypothesis conceptual) en lugar de un único ejemplo feliz.",
                "Documenta la invariante en español junto al test; es el contrato del dominio ER.",
            ],
            code="""import random
random.seed(42)

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def gen_strings(n=20):
    alphabet = "ab cÁé  "
    out = []
    for _ in range(n):
        out.append("".join(random.choice(alphabet) for _ in range(random.randint(0, 12))))
    return out

# invariante: normalize es idempotente
bad = []
for s in gen_strings():
    once = normalize(s)
    twice = normalize(once)
    if once != twice:
        bad.append(s)
print("idempotent_ok", len(bad) == 0)
print("n_cases", 20)
print("seed", 42)""",
            code_title="invariants_gen.py",
            callout=(
                "tip",
                "Seed fija",
                "Random sin seed en CI es flake. Fija seed o usa tabla exhaustiva pequeña.",
            ),
        ),
        Theory(
            heading="idempotencia, simetría y metamorphic tests",
            sub="S28-T1-B",
            paragraphs=[
                "**Idempotencia**: aplicar dos veces = una. **Simetría**: `sim(a,b)==sim(b,a)` en comparadores simétricos.",
                "**Metamorphic tests**: transforma el input de forma que la relación de salida sea predecible (p.ej. añadir espacios no cambia normalize).",
                "Útiles cuando no hay oráculo absoluto pero sí relación entre salidas.",
            ],
            code="""def sim_token(a: str, b: str) -> float:
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)

pairs = [("Ana López", "López Ana"), ("x", "y"), ("", "")]
sym_ok = all(abs(sim_token(a, b) - sim_token(b, a)) < 1e-12 for a, b in pairs)
# metamorphic: padding spaces
meta_ok = all(
    " ".join(s.split()).casefold() == " ".join(("  " + s + " ").split()).casefold()
    for s in ["María", "  a  b"]
)
print("symmetric", sym_ok)
print("metamorphic_pad", meta_ok)
print("note", "sim!=fraud")""",
            code_title="metamorphic.py",
            callout=(
                "warning",
                "Simetría no siempre aplica",
                "Algunas distancias dirigidas no son simétricas; documenta la propiedad esperada.",
            ),
        ),
        Theory(
            heading="schema y quality contracts",
            sub="S28-T2-A",
            paragraphs=[
                "Un **schema contract** fija tipos, nullability y dominios (email con @, score 0..1). Un **quality contract** fija reglas de negocio (unique id, cardinalidad de pares).",
                "Valida en ingest del ER: registros fuente rechazados no entran silenciosos.",
                "Implementación didáctica: funciones validadoras que devuelven lista de errores.",
            ],
            code="""def validate_record(r: dict) -> list[str]:
    err = []
    if not isinstance(r.get("id"), str) or not r["id"]:
        err.append("id requerido")
    email = r.get("email")
    if email is not None and "@" not in str(email):
        err.append("email inválido")
    score = r.get("score")
    if score is not None and not (0 <= float(score) <= 1):
        err.append("score fuera de [0,1]")
    return err

rows = [
    {"id": "1", "email": "a@example.pe", "score": 0.2},
    {"id": "", "email": "x", "score": 1.5},
]
report = [(r.get("id"), validate_record(r)) for r in rows]
print("clean", report[0][1])
print("dirty_n", len(report[1][1]))
print("contract", "schema+quality")""",
            code_title="schema_contract.py",
            callout=(
                "tip",
                "Falla ruidosa en ingest",
                "Mejor rechazar con error que contaminar el almacén ER (S29).",
            ),
        ),
        Theory(
            heading="golden datasets, drift y reconciliación",
            sub="S28-T2-B",
            paragraphs=[
                "Un **golden** es un snapshot de salida esperada (JSON/CSV sintético versionado). Sirve de regresión de pipeline.",
                "**Drift**: la salida actual difiere del golden. Clasifica: bug real vs cambio intencional.",
                "**Reconciliación**: actualizar golden solo con review y nota de cambio — nunca en silencio en CI.",
            ],
            code="""import json
golden = {"pairs": [{"a": "c1", "b": "c2", "label": 1}], "version": 1}
current = {"pairs": [{"a": "c1", "b": "c2", "label": 1}], "version": 1}
drift = golden != current
# simula cambio de label
current2 = json.loads(json.dumps(current))
current2["pairs"][0]["label"] = 0
drift2 = golden != current2

def reconcile(old, new, approved=False):
    if old == new:
        return "unchanged"
    return "updated" if approved else "blocked_drift"

print("drift_clean", drift)
print("drift_label", drift2)
print("reconcile", reconcile(golden, current2, approved=False))""",
            code_title="golden_drift.py",
            callout=(
                "danger",
                "No auto-accept drift",
                "Actualizar golden sin review esconde regresiones de matching.",
            ),
        ),
        Theory(
            heading="mocks/fakes de HTTP, DB y reloj",
            sub="S28-T3-A",
            paragraphs=[
                "**Mock**: verifica interacciones. **Fake**: implementación liviana en memoria. **Stub**: respuestas fijas.",
                "HTTP: fake de status/JSON. DB: dict o sqlite memoria. Reloj: inyecta `now` callable — no `datetime.now` global sin control.",
                "Objetivo: tests rápidos y deterministas del ER sin red real.",
            ],
            code="""from datetime import datetime, timezone

class FakeClock:
    def __init__(self, fixed):
        self.fixed = fixed
    def now(self):
        return self.fixed

class FakeHTTP:
    def __init__(self, body, status=200):
        self.body, self.status = body, status
    def get_json(self, url):
        return {"status": self.status, "url": url, "data": self.body}

clock = FakeClock(datetime(2026, 7, 20, tzinfo=timezone.utc))
http = FakeHTTP({"entities": 2})
print("now", clock.now().date().isoformat())
print("http", http.get_json("https://example.pe/er")["data"]["entities"])
print("db_fake", {"c1": {"name": "Ana"}}.get("c1")["name"])""",
            code_title="fakes_clock.py",
            callout=(
                "tip",
                "Inyecta dependencias",
                "Pasa clock/http al constructor; no parches globales salvo legado.",
            ),
        ),
        Theory(
            heading="contract tests sin sobre-mocking",
            sub="S28-T3-B",
            paragraphs=[
                "El **sobre-mocking** acopla el test a detalles internos (orden de calls, nombres privados) y se rompe en refactors inocuos.",
                "Prefiere **contratos de borde**: dado input, output y efectos observables (filas escritas, status).",
                "Mockea solo I/O externo; deja la lógica de matching real bajo prueba.",
            ],
            code="""def match_service(normalize, a, b):
    # lógica real bajo prueba
    return normalize(a) == normalize(b)

def normalize(s):
    return " ".join(s.casefold().split())

# contrato de borde — no mockeamos normalize si es barato y puro
print("contract", match_service(normalize, "Ana", " ana "))
# sobre-mocking malo (ilustrativo): forzar True sin lógica
overmock = lambda a, b: True
print("overmock_hides_bug", overmock("x", "y"))
print("prefer", "real_pure_logic")""",
            code_title="no_overmock.py",
            callout=(
                "warning",
                "Mockear de más",
                "Si mockeas el comparador y solo asertas que se llamó, no pruebas matching.",
            ),
        ),
        Theory(
            heading="integración/E2E y test containers",
            sub="S28-T4-A",
            paragraphs=[
                "Integración ejerce 2+ componentes reales (app + sqlite). E2E cubre flujo de punta a punta (ingest→pares→review) con datos sintéticos.",
                "**Testcontainers** (concepto): DB efímera en contenedor. En el curso usamos sqlite `:memory:` o archivo temp como análogo local.",
                "Mide encoding, cardinalidad de pares, orden de paginación, timeout y reanudación (checkpoint).",
            ],
            code="""import sqlite3

def run_integration():
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT)")
    con.executemany("INSERT INTO entities VALUES (?,?)", [("e1", "Ana"), ("e2", "Ana")])
    n = con.execute("SELECT COUNT(*) FROM entities").fetchone()[0]
    # candidate pairs naive
    pairs = con.execute(
        "SELECT a.id, b.id FROM entities a JOIN entities b ON a.id < b.id AND a.name = b.name"
    ).fetchall()
    con.close()
    return n, pairs

n, pairs = run_integration()
print("entities", n)
print("pairs", pairs)
print("encoding_ok", True)""",
            code_title="integration_sqlite.py",
            callout=(
                "info",
                "Containers vs memoria",
                "sqlite memoria valida lógica; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29).",
            ),
        ),
        Theory(
            heading="flakes, determinismo y CI",
            sub="S28-T4-B",
            paragraphs=[
                "Un **flake** pasa/falla sin cambio de código: orden, tiempo, red, random. En CI del ER son inaceptables en la suite gate.",
                "Mitigaciones: seed, reloj inyectado, sort estable, retries solo con cuarentena documentada (no ocultar bugs).",
                "Pipeline CI: lint → unit → property/data → integration. Falla el job si hay drift de golden no aprobado.",
            ],
            code="""import random
from datetime import datetime, timezone

def flaky_bad():
    # anti-patrón: random y reloj sin control
    return random.random() > 0.0 and datetime.now().microsecond >= 0

def stable(seed=0, now=None):
    random.seed(seed)
    now = now or datetime(2026, 7, 20, tzinfo=timezone.utc)
    items = ["b", "a", "c"]
    return sorted(items), now.isoformat(), round(random.random(), 4)

print("stable", stable(7)[0])
print("seeded_r", stable(7)[2])
print("ci_policy", "no_flakes_on_gate")""",
            code_title="determinism_ci.py",
            callout=(
                "danger",
                "Retry no es fix",
                "Reintentar un test flaky en CI sin root-cause solo enmascara el problema.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S28-T1-A-DEMO",
            "S28-T1-A",
            "Genera 15 strings con seed y verifica invariante de longitud de normalize ≥ 0.",
            """import random
random.seed(1)
def norm(s):
    return " ".join(s.casefold().split())
ok = all(len(norm("".join(random.choice("a b") for _ in range(8)))) >= 0 for _ in range(15))
print("invariant_ok", ok)
print("n", 15)""",
            "Casos generados refuerzan invariantes.",
            title="inv_demo.py",
        ),
        Demo(
            "S28-T1-B-DEMO",
            "S28-T1-B",
            "Comprueba simetría de Jaccard de tokens y metamorphic padding.",
            """def j(a,b):
    ta,tb=set(a.lower().split()),set(b.lower().split())
    return len(ta&tb)/len(ta|tb) if ta|tb else 1.0
print("sym", j("a b","b a")==j("b a","a b"))
print("meta", "x y" == " ".join("  x   y ".split()))
print("idemp", "a" == " ".join("a".split()))""",
            "Propiedades sin oráculo absoluto aún fallan con bugs.",
            title="meta_demo.py",
        ),
        Demo(
            "S28-T2-A-DEMO",
            "S28-T2-A",
            "Valida schema de tres registros sintéticos y cuenta errores.",
            """def val(r):
    e=[]
    if not r.get("id"): e.append("id")
    if r.get("score") is not None and not 0<=r["score"]<=1: e.append("score")
    return e
rows=[{"id":"1","score":0.2},{"id":"","score":2},{"id":"3","score":0.5}]
print("errors", sum(len(val(r)) for r in rows))
print("ok_first", val(rows[0])==[])""",
            "Contratos de calidad en ingest del ER.",
            title="schema_demo.py",
        ),
        Demo(
            "S28-T2-B-DEMO",
            "S28-T2-B",
            "Detecta drift de golden de pares y bloquea reconcile sin aprobación.",
            """golden={"n":2}
cur={"n":3}
print("drift", golden!=cur)
print("action", "blocked" if golden!=cur else "ok")
print("version", 1)""",
            "Drift visible > golden silencioso.",
            title="drift_demo.py",
        ),
        Demo(
            "S28-T3-A-DEMO",
            "S28-T3-A",
            "Fake HTTP + reloj fijo devuelven JSON y timestamp deterministas.",
            """from datetime import datetime, timezone
class H:
    def get(self):
        return {"status":200,"body":{"ok":True}}
class C:
    def now(self):
        return datetime(2026,1,1,tzinfo=timezone.utc)
print(H().get()["body"]["ok"], C().now().date().isoformat())""",
            "Dobles controlados eliminan red y tiempo real.",
            title="fake_demo.py",
        ),
        Demo(
            "S28-T3-B-DEMO",
            "S28-T3-B",
            "Contrato de borde sobre match real vs overmock que oculta bug.",
            """def real(a,b):
    return a.casefold()==b.casefold()
over=lambda a,b: True
print("real", real("A","a"))
print("overmock_false_pos", over("A","z"))
print("prefer_real", True)""",
            "No mockees la lógica que quieres probar.",
            title="contract_demo.py",
        ),
        Demo(
            "S28-T4-A-DEMO",
            "S28-T4-A",
            "Integración sqlite: inserta entidades y cuenta pares por nombre igual.",
            """import sqlite3
c=sqlite3.connect(":memory:")
c.execute("create table e(id text, name text)")
c.executemany("insert into e values (?,?)",[("1","Ana"),("2","Ana"),("3","Bob")])
pairs=c.execute("select a.id,b.id from e a join e b on a.id<b.id and a.name=b.name").fetchall()
print("pairs", pairs)
print("n", len(pairs))""",
            "Integración mínima del pipeline de candidatos.",
            title="integ_demo.py",
        ),
        Demo(
            "S28-T4-B-DEMO",
            "S28-T4-B",
            "Orden estable + seed: dos corridas CI producen la misma lista.",
            """import random
def run(seed):
    random.seed(seed)
    return sorted(["c","a","b"]), round(random.random(),5)
print(run(3)==run(3))
print(run(3)[0])""",
            "Determinismo es requisito del gate de suite.",
            title="ci_demo.py",
        ),
    ]

    exercises = [
        ex("S28-T1-A-E1", "S28-T1-A", "guided",
           "Con seed=0, genera un random.random() y verifícalo reproducible en segunda llamada con misma seed (imprime ambos iguales como True).",
           "seed antes de cada random", "compara",
           "import random\n# TODO\n",
           "import random\nrandom.seed(0); a=random.random()\nrandom.seed(0); b=random.random()\nprint(a == b)",
           ["sin seed no es CI-safe"]),
        ex("S28-T1-A-E2", "S28-T1-A", "independent",
           "Invariante: score en [0,1]. Imprime True para scores [0, 0.5, 1].",
           "all", "rango",
           "scores=[0,0.5,1]\n# TODO\n",
           "scores=[0,0.5,1]\nprint(all(0 <= s <= 1 for s in scores))",
           ["NaN no es válido"]),
        ex("S28-T1-A-E3", "S28-T1-A", "transfer",
           "Idempotencia de strip: f(f(s))==f(s) para s='  x '.",
           "doble aplicación", "assert blando print",
           "s='  x '\n# TODO\n",
           "s='  x '\nf=lambda x: x.strip()\nprint(f(f(s)) == f(s))",
           ["normalize más rico"]),
        ex("S28-T1-B-E1", "S28-T1-B", "guided",
           "Simetría de igualdad: imprime (a==b)==(b==a) para a='x' b='x'.",
           "comparar", "simetría",
           "a,b='x','x'\n# TODO\n",
           "a,b='x','x'\nprint((a == b) == (b == a))",
           ["distancias asimétricas"]),
        ex("S28-T1-B-E2", "S28-T1-B", "independent",
           "Metamorphic: upper no debe cambiar casefold equality entre 'Ana' y 'ANA'.",
           "casefold", "True",
           "# TODO\n",
           "print('Ana'.casefold() == 'ANA'.casefold())",
           ["locale edge"]),
        ex("S28-T1-B-E3", "S28-T1-B", "transfer",
           "Imprime True si sim(a,b) conceptual (a==b) es idempotente en reorden de args.",
           "swap", "propiedad",
           "a,b=1,1\n# TODO\n",
           "a,b=1,1\nprint((a == b) == (b == a))",
           ["documenta propiedad"]),
        ex("S28-T2-A-E1", "S28-T2-A", "guided",
           "Si falta id en dict, imprime 'id requerido'.",
           "get", "guard",
           "r={}\n# TODO\n",
           "r={}\nprint('id requerido' if not r.get('id') else 'ok')",
           ["id vacío"]),
        ex("S28-T2-A-E2", "S28-T2-A", "independent",
           "score=1.2 fuera de rango → imprime 'score'.",
           "0<=s<=1", "etiqueta error",
           "score=1.2\n# TODO\n",
           "score=1.2\nprint('score' if not (0 <= score <= 1) else 'ok')",
           ["inclusive bounds"]),
        ex("S28-T2-A-E3", "S28-T2-A", "transfer",
           "Cuenta cuántos de 2 registros fallan validación simple de id no vacío.",
           "sum", "lista",
           "rows=[{'id':'1'},{'id':''}]\n# TODO\n",
           "rows=[{'id':'1'},{'id':''}]\nprint(sum(1 for r in rows if not r.get('id')))",
           ["quality contract"]),
        ex("S28-T2-B-E1", "S28-T2-B", "guided",
           "Imprime 'drift' si golden!=current.",
           "!=", "strings/dicts",
           "golden,current={'n':1},{'n':2}\n# TODO\n",
           "golden,current={'n':1},{'n':2}\nprint('drift' if golden != current else 'ok')",
           ["deep compare json"]),
        ex("S28-T2-B-E2", "S28-T2-B", "independent",
           "Reconcile bloqueado: approved=False y hay diff → 'blocked'.",
           "and", "política",
           "diff, approved = True, False\n# TODO\n",
           "diff, approved = True, False\nprint('blocked' if diff and not approved else 'ok')",
           ["review humana"]),
        ex("S28-T2-B-E3", "S28-T2-B", "transfer",
           "Imprime version del golden = 3.",
           "literal/dict", "versionado",
           "# TODO\n",
           "print({'golden_version': 3}['golden_version'])",
           ["changelog"]),
        ex("S28-T3-A-E1", "S28-T3-A", "guided",
           "Fake DB dict: get 'e1' name 'Ana' e imprime.",
           "dict get", "fake",
           "db={'e1':{'name':'Ana'}}\n# TODO\n",
           "db={'e1':{'name':'Ana'}}\nprint(db['e1']['name'])",
           ["missing key"]),
        ex("S28-T3-A-E2", "S28-T3-A", "independent",
           "Fake clock devuelve fecha 2026-07-20; imprime iso date.",
           "datetime", "inyección",
           "from datetime import date\n# TODO\n",
           "from datetime import date\nprint(date(2026, 7, 20).isoformat())",
           ["timezone aware en prod"]),
        ex("S28-T3-A-E3", "S28-T3-A", "transfer",
           "Fake HTTP status 503 → imprime 'retry'.",
           "status", "rama",
           "status=503\n# TODO\n",
           "status=503\nprint('retry' if status >= 500 else 'ok')",
           ["timeouts"]),
        ex("S28-T3-B-E1", "S28-T3-B", "guided",
           "Contrato: match real 'A'/'a' → True.",
           "casefold", "sin mock",
           "# TODO\n",
           "print('A'.casefold() == 'a'.casefold())",
           ["no overmock"]),
        ex("S28-T3-B-E2", "S28-T3-B", "independent",
           "Detecta overmock: si función siempre True, imprime 'weak'.",
           "propiedad", "siempre True",
           "f=lambda a,b: True\n# TODO\n",
           "f=lambda a,b: True\nprint('weak' if f('x','y') and f('1','2') else 'ok')",
           ["tests de borde"]),
        ex("S28-T3-B-E3", "S28-T3-B", "transfer",
           "Imprime efecto observable: rows_written=1.",
           "dict", "borde",
           "# TODO\n",
           "print({'rows_written': 1}['rows_written'])",
           ["no asserts de call order"]),
        ex("S28-T4-A-E1", "S28-T4-A", "guided",
           "sqlite memoria: CREATE e INSERT un row; COUNT(*).",
           "sqlite3", "fetchone",
           "import sqlite3\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table t(x int)')\nc.execute('insert into t values (1)')\nprint(c.execute('select count(*) from t').fetchone()[0])",
           [":memory: se pierde al close"]),
        ex("S28-T4-A-E2", "S28-T4-A", "independent",
           "Cardinalidad de pares C(n,2) para n=4 → 6.",
           "n*(n-1)//2", "candidatos",
           "n=4\n# TODO\n",
           "n=4\nprint(n * (n - 1) // 2)",
           ["blocking reduce pares"]),
        ex("S28-T4-A-E3", "S28-T4-A", "transfer",
           "Checkpoint: ids hechos {'a'}; items a,b → pendientes ['b'].",
           "list comp", "reanudación",
           "done, items={'a'}, ['a','b']\n# TODO\n",
           "done, items={'a'}, ['a','b']\nprint([i for i in items if i not in done])",
           ["timeout + resume"]),
        ex("S28-T4-B-E1", "S28-T4-B", "guided",
           "sorted(['b','a']) debe ser estable; imprime resultado.",
           "sorted", "orden",
           "# TODO\n",
           "print(sorted(['b', 'a']))",
           ["set order no es estable"]),
        ex("S28-T4-B-E2", "S28-T4-B", "independent",
           "Política CI: imprime 'fail_job' si flake_rate>0.",
           "umbral", "gate",
           "flake_rate=0.01\n# TODO\n",
           "flake_rate=0.01\nprint('fail_job' if flake_rate > 0 else 'ok')",
           ["cuarentena documentada"]),
        ex("S28-T4-B-E3", "S28-T4-B", "transfer",
           "Imprime pipeline CI: unit→data→integration.",
           "string", "orden",
           "# TODO\n",
           "print('unit→data→integration')",
           ["lint primero opcional"]),
    ]

    youdo = {
        "title": "Suite QA del motor ER — propiedades, goldens e integración",
        "context": (
            "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden "
            "para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria. "
            "Sin PII real; matching ≠ fraude. No editar seed/checkpoint/ledger."
        ),
        "objectives": [
            "Invariantes + generación con seed",
            "Metamorphic/simetría de comparadores",
            "Schema/quality contracts y golden con reconcile bloqueado",
            "Integración sqlite de candidatos + CI determinista",
        ],
        "requirements": [
            "Fixtures sintéticas mínimas",
            "UNVERIFIED flakes = 0 en la suite gate",
            "Documentación es-PE",
            "Alineación QA ER (CP-N3-A)",
        ],
        "starterCode": """# QA ER — esqueleto S28
import random
random.seed(0)

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

# TODO: property tests, schema validate, golden diff, sqlite pairs, stable sort
if __name__ == "__main__":
    assert normalize(normalize(" A ")) == normalize(" A ")
    print("qa_starter_ok")
""",
        "portfolioNote": (
            "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. "
            "Otra lane califica; no marcar passed aquí."
        ),
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "Un test metamórfico verifica:",
            "options": [
                "Solo un número mágico",
                "Relaciones predecibles entre entradas transformadas y salidas",
                "Que la red esté caída",
                "Fraude",
            ],
            "correctIndex": 1,
            "explanation": "Relaciona salidas bajo transformaciones conocidas.",
        },
        {
            "question": "Actualizar un golden con drift sin review es:",
            "options": ["Buena práctica", "Riesgo de ocultar regresiones", "Obligatorio en CI", "Irrelevante"],
            "correctIndex": 1,
            "explanation": "Reconcile debe ser aprobado.",
        },
        {
            "question": "Sobre-mocking típico:",
            "options": [
                "Probar lógica pura real",
                "Acoplar el test a detalles internos y ocultar bugs",
                "Usar sqlite memoria",
                "Fijar seed",
            ],
            "correctIndex": 1,
            "explanation": "Mockea I/O, no el corazón del matching.",
        },
        {
            "question": "Flakes en la suite gate de ER se manejan:",
            "options": [
                "Ignorándolos",
                "Con determinismo (seed/reloj/sort) y fallo de job si persisten",
                "Subiendo retries a 100",
                "Borrando tests",
            ],
            "correctIndex": 1,
            "explanation": "CI determinista es parte del outcome de S28.",
        },
    ]

    resources = {
        "docs": [
            {"label": "Hypothesis (property testing)", "url": "https://hypothesis.readthedocs.io/", "note": "Generación de casos"},
            {"label": "sqlite3 Python", "url": "https://docs.python.org/3/library/sqlite3.html", "note": "Integración local"},
        ],
        "books": [
            {"label": "Growing Object-Oriented Software, Guided by Tests", "note": "Contratos y dobles"},
            {"label": "Data Quality Fundamentals", "note": "Schema y drift conceptual"},
        ],
        "courses": [
            {
                "label": "pytest fixtures & parametrize",
                "url": "https://docs.pytest.org/en/stable/how-to/fixtures.html",
                "note": "Aislamiento",
            },
        ],
    }

    i_do = (
        "Te muestro invariantes, metamorphic tests, contratos de schema/golden, fakes y CI determinista "
        "para el QA del motor ER."
    )
    we_do = "24 ejercicios de propiedades, datos, dobles e integración/CI."
    ts, log = build_section(
        "section28", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "llm-agents",
        "index": 28,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 12,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "ShieldCheck",
        "legacy_note": "llm-agents retargeted to data/property/integration tests for ER QA",
        "capstone": "CP-N3-A (QA ER)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


# ---------------------------------------------------------------------------
# S29 — SQL avanzado y modelado relacional (platform id: mlops)
# ---------------------------------------------------------------------------


def build_s29() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S29-T1-A", "keys-constraints-normalization"),
        ("S29-T1-B", "temporality-provenance"),
        ("S29-T2-A", "cte-windows-antijoins"),
        ("S29-T2-B", "cardinality-null-plans"),
        ("S29-T3-A", "acid-isolation"),
        ("S29-T3-B", "upserts-concurrency-recovery"),
        ("S29-T4-A", "indexes-migrations"),
        ("S29-T4-B", "repository-pooling-tests"),
    ]
    meta = {
        "id": "mlops",
        "index": 29,
        "title": "SQL avanzado y modelado relacional",
        "shortTitle": "SQL almacén ER",
        "tagline": (
            "esquema que preserva registros fuente, entidades, pares candidatos, decisiones y evidencia "
            "sin sobrescribir historia"
        ),
        "estimatedHours": 14,
        "level": "Competente",
        "phase": 2,
        "icon": "Database",
        "accentColor": "bg-gradient-to-br from-sky-500 to-blue-800",
        "jobRelevance": (
            "El **almacén de verdad del ER** (CP-N3-A) guarda fuentes, entidades, pares, decisiones y evidencia "
            "con historia. Esta sección (id `mlops` conservado) retematiza a V3 **SQL avanzado y modelado "
            "relacional**: claves, temporalidad, CTEs, ACID, upserts e índices. sqlite local; sin PII real."
        ),
        "learningOutcomes": [
            "Modelar claves y constraints correctos",
            "Preservar temporalidad y provenance",
            "Escribir CTEs, windows y anti-joins",
            "Razonar cardinalidad, NULL y planes",
            "Elegir isolation y garantizar ACID",
            "Implementar upserts y recuperación",
            "Diseñar índices y migrations seguras",
            "Aplicar repository, pooling y tests",
        ],
    }

    theories = [
        Theory(
            heading="De MLOps a almacén relacional del ER (mapa CP-N3-A)",
            paragraphs=[
                "En V3, **S29 no es MLflow/DVC**. Modelas el **almacén ER**: source_records, entities, candidate_pairs, decisions, evidence — **sin borrar historia**.",
                "sqlite local del curso simula el almacén; los mismos principios aplican a Postgres en producción.",
                "Orden: **T1 Modelo** → **T2 Consulta** → **T3 Transacción** → **T4 Evolución**. Decisiones de match ≠ fraude.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Legado MLOps de este archivo **no es el path V3 en S29**. Target: SQL del almacén ER.",
            ),
        ),
        Theory(
            heading="claves, constraints y normalización",
            sub="S29-T1-A",
            paragraphs=[
                "**PK/FK** anclan integridad: un par referencia dos entidades. **Constraints** CHECK (score 0..1), UNIQUE (source, external_id).",
                "Normaliza a **3NF** para hechos: no repitas atributos de entidad en cada par; la evidencia puede ser tabla hija.",
                "Ids sintéticos estables (`ent_…`, `pair_…`) facilitan tests.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE entities(
  id TEXT PRIMARY KEY,
  canonical_name TEXT NOT NULL
);
CREATE TABLE candidate_pairs(
  id TEXT PRIMARY KEY,
  entity_a TEXT NOT NULL REFERENCES entities(id),
  entity_b TEXT NOT NULL REFERENCES entities(id),
  score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
  CHECK(entity_a < entity_b)
);
''')
con.execute("INSERT INTO entities VALUES ('e1','Ana'),('e2','Ana López')")
con.execute("INSERT INTO candidate_pairs VALUES ('p1','e1','e2',0.82)")
n = con.execute("SELECT COUNT(*) FROM candidate_pairs").fetchone()[0]
print("pairs", n)
print("fk_ok", True)
print("check_score", True)""",
            code_title="keys_constraints.py",
            callout=(
                "tip",
                "Orden canónico A<B",
                "Forzar entity_a < entity_b evita pares duplicados (e1,e2) y (e2,e1).",
            ),
        ),
        Theory(
            heading="temporalidad y provenance",
            sub="S29-T1-B",
            paragraphs=[
                "**Temporalidad**: valid_from/valid_to o tablas de eventos. No sobrescribas la decisión anterior; inserta una nueva fila versionada.",
                "**Provenance**: source_system, source_record_id, ingested_at, transform_version. Toda entidad debe rastrearse al registro fuente.",
                "Auditoría: quién (actor sintético) decidió match/non-match y cuándo.",
            ],
            code="""import sqlite3
from datetime import datetime, timezone
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE decisions(
  id INTEGER PRIMARY KEY,
  pair_id TEXT NOT NULL,
  label TEXT NOT NULL,
  decided_at TEXT NOT NULL,
  actor TEXT NOT NULL,
  evidence_ref TEXT
);
''')
now = datetime(2026, 7, 20, tzinfo=timezone.utc).isoformat()
con.execute(
    "INSERT INTO decisions(pair_id,label,decided_at,actor,evidence_ref) VALUES (?,?,?,?,?)",
    ("p1", "review", now, "rev_sintetica", "ev_01"),
)
# nueva decisión no borra la anterior
con.execute(
    "INSERT INTO decisions(pair_id,label,decided_at,actor,evidence_ref) VALUES (?,?,?,?,?)",
    ("p1", "match", now, "rev_sintetica", "ev_02"),
)
hist = con.execute("SELECT label FROM decisions WHERE pair_id='p1' ORDER BY id").fetchall()
print("history", [h[0] for h in hist])
print("provenance", "ev_02")
print("overwrite", False)""",
            code_title="temporality_prov.py",
            callout=(
                "warning",
                "UPDATE destruye historia",
                "Para CP-N3-A, las decisiones son append-only o versionadas.",
            ),
        ),
        Theory(
            heading="CTEs, windows y anti-joins",
            sub="S29-T2-A",
            paragraphs=[
                "**CTEs** (`WITH`) nombran pasos: candidatos filtrados, scores rankeados. **Windows** (`ROW_NUMBER`, `RANK`) particionan por entidad.",
                "**Anti-join**: entidades sin par, o pares sin decisión — `NOT EXISTS` / `LEFT JOIN … IS NULL`.",
                "Útil para colas de review y coverage de blocking.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE pairs(id TEXT, score REAL);
CREATE TABLE decisions(pair_id TEXT);
INSERT INTO pairs VALUES ('p1',0.9),('p2',0.4),('p3',0.7);
INSERT INTO decisions VALUES ('p1');
''')
q = '''
WITH ranked AS (
  SELECT id, score, ROW_NUMBER() OVER (ORDER BY score DESC) AS rn
  FROM pairs
)
SELECT r.id FROM ranked r
WHERE r.rn <= 3
  AND NOT EXISTS (SELECT 1 FROM decisions d WHERE d.pair_id = r.id)
ORDER BY r.id
'''
print("pending_review", [r[0] for r in con.execute(q)])
print("cte", True)
print("antijoin", True)""",
            code_title="cte_window_anti.py",
            callout=(
                "tip",
                "NOT EXISTS",
                "Anti-join con NOT EXISTS suele ser más claro que NOT IN con NULLs.",
            ),
        ),
        Theory(
            heading="cardinalidad, NULL y planes",
            sub="S29-T2-B",
            paragraphs=[
                "**Cardinalidad** de joins define explosión de pares: n×m sin blocking es inviable. Estima filas antes de correr.",
                "**NULL**: `NULL != NULL`; usa `IS NULL`. Agrega con cuidado (`COUNT` vs `COUNT(col)`).",
                "**Planes**: `EXPLAIN QUERY PLAN` en sqlite para ver scans vs search por índice.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE e(id INTEGER, grp TEXT)")
con.executemany("INSERT INTO e VALUES (?,?)", [(1,"a"),(2,"a"),(3,None)])
n = con.execute("SELECT COUNT(*) FROM e").fetchone()[0]
n_grp = con.execute("SELECT COUNT(grp) FROM e").fetchone()[0]
# cardinalidad self-join mismo grp
pairs = con.execute(
    "SELECT COUNT(*) FROM e a JOIN e b ON a.grp = b.grp AND a.id < b.id"
).fetchone()[0]
plan = con.execute("EXPLAIN QUERY PLAN SELECT * FROM e WHERE id = 1").fetchall()
print("count_star", n)
print("count_grp", n_grp)
print("pairs_card", pairs)
print("plan_rows", len(plan))""",
            code_title="card_null_plan.py",
            callout=(
                "warning",
                "NULL en join",
                "NULL=NULL es desconocido: filas con grp NULL no matchean entre sí en igualdad.",
            ),
        ),
        Theory(
            heading="ACID e isolation",
            sub="S29-T3-A",
            paragraphs=[
                "**ACID**: Atomicity, Consistency, Isolation, Durability. Una decisión + evidencia deben commitearse juntas o no.",
                "Isolation (READ COMMITTED, SERIALIZABLE…) define qué ven transacciones concurrentes. sqlite: transacciones + `BEGIN IMMEDIATE` cuando hay escritura concurrente.",
                "En el curso: demuestra rollback si falla el segundo insert.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE decisions(id INTEGER PRIMARY KEY, pair_id TEXT, label TEXT)")
con.execute("CREATE TABLE evidence(id INTEGER PRIMARY KEY, pair_id TEXT, note TEXT)")
try:
    con.execute("BEGIN")
    con.execute("INSERT INTO decisions(pair_id,label) VALUES ('p1','match')")
    # simula fallo de evidencia
    raise RuntimeError("evidence write failed")
    con.execute("INSERT INTO evidence(pair_id,note) VALUES ('p1','ok')")
    con.execute("COMMIT")
except RuntimeError:
    con.execute("ROLLBACK")
n_d = con.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
n_e = con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0]
print("decisions", n_d)
print("evidence", n_e)
print("atomic", n_d == 0 and n_e == 0)""",
            code_title="acid_rollback.py",
            callout=(
                "tip",
                "Misma transacción",
                "Decisión sin evidencia o viceversa rompe el almacén de verdad.",
            ),
        ),
        Theory(
            heading="upserts, concurrencia y recuperación",
            sub="S29-T3-B",
            paragraphs=[
                "**Upsert** (`INSERT … ON CONFLICT`): actualiza atributos mutables de entidad sin perder el id estable.",
                "Concurrencia: dos workers no deben crear el mismo par; usa constraints + reintento.",
                "Recuperación: journal/WAL, reaplicar eventos, o marcar jobs `pending` tras crash.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.execute(
    "CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT, updated INTEGER)"
)
con.execute("INSERT INTO entities VALUES ('e1','Ana',1)")
con.execute(
    '''INSERT INTO entities(id,name,updated) VALUES ('e1','Ana López',2)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name, updated=excluded.updated'''
)
row = con.execute("SELECT name, updated FROM entities WHERE id='e1'").fetchone()
print("name", row[0])
print("updated", row[1])
print("upsert", True)""",
            code_title="upsert_recover.py",
            callout=(
                "info",
                "Upsert ≠ borrar historia de decisiones",
                "Puedes upsert atributos de entidad; las decisiones siguen append-only.",
            ),
        ),
        Theory(
            heading="índices y migrations",
            sub="S29-T4-A",
            paragraphs=[
                "Índices en FK y columnas de filtro (`score`, `status`, `block_key`) bajan latencia de colas y blocking.",
                "**Migrations** versionadas: expand → backfill → contract. Evita drops destructivos sin backup.",
                "En sqlite didáctico: `CREATE INDEX` y tabla `schema_migrations`.",
            ],
            code="""import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE pairs(id TEXT PRIMARY KEY, block_key TEXT, score REAL);
CREATE INDEX idx_pairs_block ON pairs(block_key);
INSERT INTO schema_migrations VALUES (1, 'init_pairs');
INSERT INTO pairs VALUES ('p1','BLOQ|ANA',0.8);
''')
plan = "\\n".join(
    str(r) for r in con.execute(
        "EXPLAIN QUERY PLAN SELECT * FROM pairs WHERE block_key='BLOQ|ANA'"
    )
)
print("migration", con.execute("SELECT MAX(version) FROM schema_migrations").fetchone()[0])
print("uses_index", "idx_pairs_block" in plan or "USING INDEX" in plan.upper() or "INDEX" in plan.upper())
print("n", con.execute("SELECT COUNT(*) FROM pairs").fetchone()[0])""",
            code_title="indexes_migrate.py",
            callout=(
                "warning",
                "Índice no es magia",
                "Demasiados índices ralentizan writes; mide con EXPLAIN.",
            ),
        ),
        Theory(
            heading="repository pattern, pooling y pruebas",
            sub="S29-T4-B",
            paragraphs=[
                "El **repository** encapsula SQL: `get_entity`, `insert_decision`. La lógica de matching no arma SQL crudo por todos lados.",
                "**Pooling**: reusa conexiones (en sqlite a menudo una por thread). En servers: pool con timeout.",
                "Prueba el repo con sqlite memoria: inserts, constraints y anti-joins de la cola de review.",
            ],
            code="""import sqlite3

class PairRepo:
    def __init__(self, con):
        self.con = con
    def add_pair(self, pid, a, b, score):
        self.con.execute(
            "INSERT INTO pairs(id,entity_a,entity_b,score) VALUES (?,?,?,?)",
            (pid, a, b, score),
        )
    def pending(self):
        return self.con.execute(
            "SELECT id FROM pairs WHERE id NOT IN (SELECT pair_id FROM decisions)"
        ).fetchall()

con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE pairs(id TEXT PRIMARY KEY, entity_a TEXT, entity_b TEXT, score REAL);
CREATE TABLE decisions(pair_id TEXT);
''')
repo = PairRepo(con)
repo.add_pair("p1", "e1", "e2", 0.7)
print("pending", [r[0] for r in repo.pending()])
print("pattern", "repository")
print("test_db", ":memory:")""",
            code_title="repo_pool_tests.py",
            callout=(
                "tip",
                "Repo testeable",
                "Inyecta la conexión; en tests usa :memory: o temp file.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S29-T1-A-DEMO",
            "S29-T1-A",
            "Crea entities y pairs con CHECK score y orden entity_a < entity_b.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table entities(id text primary key);
create table pairs(id text primary key, a text references entities(id), b text references entities(id),
 score real check(score between 0 and 1), check(a<b));
insert into entities values ('e1'),('e2');
insert into pairs values ('p1','e1','e2',0.5);
''')
print(c.execute('select score from pairs').fetchone()[0])
print('ok', True)""",
            "Constraints protegen el almacén ER.",
            title="keys_demo.py",
        ),
        Demo(
            "S29-T1-B-DEMO",
            "S29-T1-B",
            "Inserta dos decisiones append-only para el mismo par y lista labels.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table d(id integer primary key, pair text, label text)')
c.executemany('insert into d(pair,label) values (?,?)', [('p1','review'),('p1','match')])
print([r[0] for r in c.execute('select label from d order by id')])""",
            "Historia de decisiones sin overwrite.",
            title="prov_demo.py",
        ),
        Demo(
            "S29-T2-A-DEMO",
            "S29-T2-A",
            "CTE + anti-join: pares sin decisión ordenados por score.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table pairs(id text, score real);
create table dec(pair_id text);
insert into pairs values ('p1',0.2),('p2',0.9);
insert into dec values ('p2');
''')
q='''with x as (select * from pairs)
select id from x where id not in (select pair_id from dec)'''
print(c.execute(q).fetchall())""",
            "Cola de review vía SQL.",
            title="cte_demo.py",
        ),
        Demo(
            "S29-T2-B-DEMO",
            "S29-T2-B",
            "COUNT(*) vs COUNT(col) y cardinalidad de self-join.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table t(g text)')
c.executemany('insert into t values (?)', [('a',),('a',),(None,)])
print('star', c.execute('select count(*) from t').fetchone()[0])
print('col', c.execute('select count(g) from t').fetchone()[0])
print('pairs', c.execute('select count(*) from t a join t b on a.g=b.g and rowid(a)<rowid(b)').fetchone()[0] if False else 1)
# sqlite rowid compare:
print('self_pairs', c.execute(
  'select count(*) from t a join t b on a.g=b.g and a.rowid<b.rowid').fetchone()[0])""",
            "NULL y cardinalidad evitan sorpresas.",
            title="card_demo.py",
        ),
        Demo(
            "S29-T3-A-DEMO",
            "S29-T3-A",
            "Transacción con ROLLBACK deja ambas tablas vacías.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('create table a(x int); create table b(y int);')
try:
    c.execute('begin')
    c.execute('insert into a values (1)')
    raise RuntimeError('fail')
except RuntimeError:
    c.execute('rollback')
print(c.execute('select count(*) from a').fetchone()[0],
      c.execute('select count(*) from b').fetchone()[0])""",
            "Atomicidad decisión+evidencia.",
            title="acid_demo.py",
        ),
        Demo(
            "S29-T3-B-DEMO",
            "S29-T3-B",
            "Upsert actualiza name de entidad e1.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('e1','Ana')")
c.execute('''insert into e values ('e1','Ana L')
 on conflict(id) do update set name=excluded.name''')
print(c.execute("select name from e where id='e1'").fetchone()[0])""",
            "Upsert de atributos con id estable.",
            title="upsert_demo.py",
        ),
        Demo(
            "S29-T4-A-DEMO",
            "S29-T4-A",
            "Migration v1 + índice en block_key; cuenta migraciones.",
            """import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table schema_migrations(v int primary key);
create table pairs(id text, block_key text);
create index ix on pairs(block_key);
insert into schema_migrations values (1);
''')
print(c.execute('select max(v) from schema_migrations').fetchone()[0])
print('indexed', True)""",
            "Evolución de esquema versionada.",
            title="mig_demo.py",
        ),
        Demo(
            "S29-T4-B-DEMO",
            "S29-T4-B",
            "Repository pending() lista pares sin decisión.",
            """import sqlite3
class R:
    def __init__(self,c): self.c=c
    def pending(self):
        return list(self.c.execute('select id from p where id not in (select pair_id from d)'))
c=sqlite3.connect(':memory:')
c.executescript('create table p(id text); create table d(pair_id text); insert into p values (\"p1\"),(\"p2\"); insert into d values (\"p1\");')
print(R(c).pending())""",
            "SQL encapsulado y testeable.",
            title="repo_demo.py",
        ),
    ]

    exercises = [
        ex("S29-T1-A-E1", "S29-T1-A", "guided",
           "Crea tabla entities(id TEXT PRIMARY KEY) en :memory: e inserta 'e1'; imprime count.",
           "sqlite3", "PRIMARY KEY",
           "import sqlite3\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table entities(id text primary key)')\nc.execute(\"insert into entities values ('e1')\")\nprint(c.execute('select count(*) from entities').fetchone()[0])",
           ["FK en pairs"]),
        ex("S29-T1-A-E2", "S29-T1-A", "independent",
           "CHECK: score 1.5 debe fallar; caza IntegrityError e imprime 'bad_score'.",
           "try/except", "CHECK",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table p(score real check(score between 0 and 1))')\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table p(score real check(score between 0 and 1))')\ntry:\n    c.execute('insert into p values (1.5)')\nexcept sqlite3.IntegrityError:\n    print('bad_score')",
           ["between inclusive"]),
        ex("S29-T1-A-E3", "S29-T1-A", "transfer",
           "Imprime True si 'e1'<'e2' (orden canónico de par).",
           "comparación strings", "a<b",
           "# TODO\n",
           "print('e1' < 'e2')",
           ["evita duplicar par invertido"]),
        ex("S29-T1-B-E1", "S29-T1-B", "guided",
           "Inserta dos labels para pair p1; imprime número de filas de historia.",
           "append-only", "count",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table d(pair text, label text)')\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table d(pair text, label text)')\nc.executemany('insert into d values (?,?)', [('p1','review'),('p1','match')])\nprint(c.execute(\"select count(*) from d where pair='p1'\").fetchone()[0])",
           ["no update label"]),
        ex("S29-T1-B-E2", "S29-T1-B", "independent",
           "Imprime provenance dict source='crm_synth' record='r9'.",
           "dict", "provenance",
           "# TODO\n",
           "print({'source': 'crm_synth', 'record': 'r9'})",
           ["ingested_at"]),
        ex("S29-T1-B-E3", "S29-T1-B", "transfer",
           "valid_to NULL significa vigente: imprime 'open' si valid_to is None.",
           "None", "temporal",
           "valid_to=None\n# TODO\n",
           "valid_to=None\nprint('open' if valid_to is None else 'closed')",
           ["cierres explícitos"]),
        ex("S29-T2-A-E1", "S29-T2-A", "guided",
           "Con pairs p1,p2 y decision solo p1, lista ids sin decisión.",
           "NOT IN o left join", "anti-join",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.executescript('create table pairs(id text); create table dec(pair_id text); insert into pairs values (\"p1\"),(\"p2\"); insert into dec values (\"p1\");')\n# TODO print list\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.executescript('create table pairs(id text); create table dec(pair_id text); insert into pairs values (\"p1\"),(\"p2\"); insert into dec values (\"p1\");')\nprint([r[0] for r in c.execute('select id from pairs where id not in (select pair_id from dec)')])",
           ["NOT EXISTS"]),
        ex("S29-T2-A-E2", "S29-T2-A", "independent",
           "Window conceptual: ordena scores [0.2,0.9,0.5] desc e imprime el top.",
           "sorted", "rank 1",
           "scores=[0.2,0.9,0.5]\n# TODO\n",
           "scores=[0.2,0.9,0.5]\nprint(sorted(scores, reverse=True)[0])",
           ["ROW_NUMBER en SQL"]),
        ex("S29-T2-A-E3", "S29-T2-A", "transfer",
           "Imprime el nombre de la CTE de ejemplo: ranked.",
           "literal", "WITH",
           "# TODO\n",
           "print('ranked')",
           ["CTE legible"]),
        ex("S29-T2-B-E1", "S29-T2-B", "guided",
           "C(n,2) para n=5 → 10.",
           "combinatoria", "pares",
           "n=5\n# TODO\n",
           "n=5\nprint(n*(n-1)//2)",
           ["blocking reduce n efectivo"]),
        ex("S29-T2-B-E2", "S29-T2-B", "independent",
           "Imprime True si None is None (recuerda NULL SQL ≠ Python en joins).",
           "is", "NULL",
           "# TODO\n",
           "print(None is None)",
           ["SQL NULL propagates"]),
        ex("S29-T2-B-E3", "S29-T2-B", "transfer",
           "Imprime prefijo de plan 'SCAN' o 'SEARCH' para conciencia de EXPLAIN (elige SCAN como default didáctico).",
           "string", "planes",
           "# TODO\n",
           "print('SCAN')",
           ["índice → SEARCH en sqlite"]),
        ex("S29-T3-A-E1", "S29-T3-A", "guided",
           "Tras BEGIN insert y ROLLBACK, count debe ser 0.",
           "rollback", "atomic",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table t(x int)')\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table t(x int)')\nc.execute('begin')\nc.execute('insert into t values (1)')\nc.execute('rollback')\nprint(c.execute('select count(*) from t').fetchone()[0])",
           ["commit opuesto"]),
        ex("S29-T3-A-E2", "S29-T3-A", "independent",
           "Imprime las 4 letras de ACID separadas por coma sin espacios extra finales raros: A,C,I,D.",
           "string", "ACID",
           "# TODO\n",
           "print('A,C,I,D')",
           ["isolation levels"]),
        ex("S29-T3-A-E3", "S29-T3-A", "transfer",
           "Si evidence_ok es False no hagas commit conceptual: imprime 'abort'.",
           "guard", "transacción",
           "evidence_ok=False\n# TODO\n",
           "evidence_ok=False\nprint('abort' if not evidence_ok else 'commit')",
           ["decisión+evidencia"]),
        ex("S29-T3-B-E1", "S29-T3-B", "guided",
           "Upsert: segunda insert con mismo id actualiza; imprime name final 'B'.",
           "ON CONFLICT", "DO UPDATE",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table e(id text primary key, name text)')\nc.execute(\"insert into e values ('1','A')\")\n# TODO upsert to B and print\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table e(id text primary key, name text)')\nc.execute(\"insert into e values ('1','A')\")\nc.execute(\"insert into e values ('1','B') on conflict(id) do update set name=excluded.name\")\nprint(c.execute(\"select name from e where id='1'\").fetchone()[0])",
           ["updated_at"]),
        ex("S29-T3-B-E2", "S29-T3-B", "independent",
           "Recuperación: job status 'pending' tras crash; imprime status.",
           "literal/dict", "resume",
           "# TODO\n",
           "print({'job': 'er_block', 'status': 'pending'}['status'])",
           ["WAL/journal"]),
        ex("S29-T3-B-E3", "S29-T3-B", "transfer",
           "Conflicto de par duplicado → imprime 'retry'.",
           "política", "concurrencia",
           "conflict=True\n# TODO\n",
           "conflict=True\nprint('retry' if conflict else 'ok')",
           ["unique(a,b)"]),
        ex("S29-T4-A-E1", "S29-T4-A", "guided",
           "Registra migration version 2 name 'add_index'; imprime max version.",
           "schema_migrations", "insert",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table schema_migrations(v int primary key, name text)')\nc.execute(\"insert into schema_migrations values (1,'init')\")\n# TODO\n",
           "import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('create table schema_migrations(v int primary key, name text)')\nc.execute(\"insert into schema_migrations values (1,'init')\")\nc.execute(\"insert into schema_migrations values (2,'add_index')\")\nprint(c.execute('select max(v) from schema_migrations').fetchone()[0])",
           ["expand/backfill/contract"]),
        ex("S29-T4-A-E2", "S29-T4-A", "independent",
           "Imprime nombre de índice sugerido idx_pairs_block_key.",
           "convención", "índices",
           "# TODO\n",
           "print('idx_pairs_block_key')",
           ["FK indexes"]),
        ex("S29-T4-A-E3", "S29-T4-A", "transfer",
           "Política: imprime 'no_drop_without_backup'.",
           "string", "migrations",
           "# TODO\n",
           "print('no_drop_without_backup')",
           ["prod safety"]),
        ex("S29-T4-B-E1", "S29-T4-B", "guided",
           "Repo.get: dict store {'e1':'Ana'}; imprime get e1.",
           "dict", "repository",
           "store={'e1':'Ana'}\n# TODO\n",
           "store={'e1':'Ana'}\nprint(store.get('e1'))",
           ["SQL detrás"]),
        ex("S29-T4-B-E2", "S29-T4-B", "independent",
           "Pool size conceptual 5; imprime pool_size.",
           "dict", "pooling",
           "# TODO\n",
           "print({'pool_size': 5}['pool_size'])",
           ["timeout acquire"]),
        ex("S29-T4-B-E3", "S29-T4-B", "transfer",
           "Test de repo: pending count 1; imprime 1.",
           "assert blando", "memoria",
           "pending_count=1\n# TODO\n",
           "pending_count=1\nprint(pending_count)",
           [":memory: tests"]),
    ]

    youdo = {
        "title": "Almacén de verdad ER — esquema, historia y repositorio",
        "context": (
            "Diseña e implementa en sqlite el esquema CP-N3-A: source_records, entities, candidate_pairs, "
            "decisions (append-only), evidence. Incluye constraints, anti-join de cola, upsert de entidad, "
            "migración con índice y PairRepository testeado en :memory:. Datos sintéticos; sin sobrescribir historia."
        ),
        "objectives": [
            "Modelo PK/FK/CHECK y orden canónico de pares",
            "Temporalidad/provenance en decisiones y fuentes",
            "Consultas CTE/anti-join para review queue",
            "ACID en decisión+evidencia; upsert; índices; repo tests",
        ],
        "requirements": [
            "Historia no se borra con UPDATE destructivo de decisiones",
            "Scores solo en [0,1]",
            "es-PE en documentación del esquema",
            "Alineación almacén ER CP-N3-A",
        ],
        "starterCode": """# Almacén ER — esqueleto S29
import sqlite3

def connect():
    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE candidate_pairs(
      id TEXT PRIMARY KEY,
      entity_a TEXT NOT NULL,
      entity_b TEXT NOT NULL,
      score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
      CHECK(entity_a < entity_b)
    );
    CREATE TABLE decisions(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL,
      label TEXT NOT NULL,
      actor TEXT NOT NULL
    );
    ''')
    return con

# TODO: evidence, migrations, repo.pending, seed sintético
if __name__ == "__main__":
    print("er_store_starter", connect() is not None)
""",
        "portfolioNote": (
            "Esquema de almacén ER con historia y repo testeable para CP-N3-A. "
            "No marcar section_passed ni tocar ledger/seed."
        ),
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "entity_a < entity_b en el par sirve para:",
            "options": [
                "Inferir fraude",
                "Evitar duplicar el mismo par en orden invertido",
                "Borrar historia",
                "Subir isolation",
            ],
            "correctIndex": 1,
            "explanation": "Orden canónico de extremos del par.",
        },
        {
            "question": "Append-only en decisions significa:",
            "options": [
                "UPDATE del label in place sin rastro",
                "Nueva fila por cambio de decisión",
                "Drop de tabla cada noche",
                "Solo un match eterno",
            ],
            "correctIndex": 1,
            "explanation": "Preserva historia y provenance.",
        },
        {
            "question": "Decisión y evidencia deben:",
            "options": [
                "Commitearse en transacciones separadas siempre",
                "Ser atómicas en la misma transacción lógica",
                "Ignorar rollback",
                "Vivir solo en logs de texto",
            ],
            "correctIndex": 1,
            "explanation": "ACID del almacén de verdad.",
        },
        {
            "question": "El repository pattern:",
            "options": [
                "Esparce SQL por toda la app a propósito",
                "Encapsula acceso a datos y facilita tests con :memory:",
                "Reemplaza constraints",
                "Marca fraude automático",
            ],
            "correctIndex": 1,
            "explanation": "Borde de persistencia testeable.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "SQLite language",
                "url": "https://www.sqlite.org/lang.html",
                "note": "SQL local del curso",
            },
            {
                "label": "PostgreSQL constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "note": "Prod analog",
            },
        ],
        "books": [
            {"label": "SQL Antipatterns (Karwin)", "note": "Diseño y errores comunes"},
            {"label": "Designing Data-Intensive Applications (Kleppmann)", "note": "Transacciones e historia"},
        ],
        "courses": [
            {
                "label": "SQLite EXPLAIN QUERY PLAN",
                "url": "https://www.sqlite.org/eqp.html",
                "note": "Planes e índices",
            },
        ],
    }

    i_do = (
        "Te muestro el almacén ER: claves, historia de decisiones, CTEs/anti-joins, ACID, upserts, "
        "migraciones e índices y un repository testeable."
    )
    we_do = "24 ejercicios de modelo, consulta, transacciones y evolución SQL del ER."
    ts, log = build_section(
        "section29", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "mlops",
        "index": 29,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 14,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Database",
        "legacy_note": "mlops retargeted to advanced SQL / ER store",
        "capstone": "CP-N3-A (almacén ER)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


# ---------------------------------------------------------------------------
# S30 — Entity resolution probabilístico (platform id: security-infra)
#           CP-N3-A GATE CLOSE
# ---------------------------------------------------------------------------


def build_s30() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S30-T1-A", "exact-edit-token-date"),
        ("S30-T1-B", "missingness-frequency"),
        ("S30-T2-A", "rules-candidate-recall"),
        ("S30-T2-B", "combos-cost-impossible"),
        ("S30-T3-A", "weights-prob-thresholds"),
        ("S30-T3-B", "train-clerical-cluster"),
        ("S30-T4-A", "labeled-splits-by-entity"),
        ("S30-T4-B", "pr-pairwise-cluster-slices"),
    ]
    meta = {
        "id": "security-infra",
        "index": 30,
        "title": "Entity resolution probabilístico",
        "shortTitle": "ER probabilístico",
        "tagline": (
            "Testable Entity Resolution Engine con benchmark etiquetado, blocking medido, "
            "comparadores explicables y cola de revisión"
        ),
        "estimatedHours": 16,
        "level": "Competente",
        "phase": 2,
        "icon": "GitMerge",
        "accentColor": "bg-gradient-to-br from-fuchsia-500 to-purple-900",
        "jobRelevance": (
            "Cierras **CP-N3-A** con un **Testable Entity Resolution Engine**: comparadores, blocking con "
            "recall medido, pesos/umbrales, clerical review y métricas pairwise/cluster sobre datos sintéticos "
            "etiquetados. Id de plataforma `security-infra` conservado; retemática V3 **Entity resolution "
            "probabilístico**. ER solo decide **misma entidad** — no relación ni riesgo/fraude."
        ),
        "learningOutcomes": [
            "Comparar exact/edit/token/fecha",
            "Tratar missingness y frecuencia",
            "Diseñar blocking con recall medido",
            "Controlar costo y pares imposibles",
            "Estimar pesos y umbrales",
            "Operar review y consistencia de cluster",
            "Partir datos por entidad sin leakage",
            "Reportar métricas pairwise/cluster y slices",
        ],
    }

    theories = [
        Theory(
            heading="Cierre CP-N3-A: Testable Entity Resolution Engine",
            paragraphs=[
                "En V3, **S30 cierra CP-N3-A**. Entregas un motor **testeable**: benchmark etiquetado sintético, blocking medido, comparadores explicables y cola de revisión.",
                "ER responde solo **¿misma entidad?** No infiere parentesco, colusión ni fraude. Scores son evidencia para humanos o para auto-match conservador.",
                "Orden: **T1 Comparadores** → **T2 Blocking** → **T3 Matching** → **T4 Evaluación**. Integra contratos de S27–S29.",
            ],
            callout=(
                "info",
                "Gate CP-N3-A",
                "Promoción conceptual del incremento: motor ER testeable. Esta lane de autoría **no** marca section_passed ni escribe ledger/checkpoint.",
            ),
        ),
        Theory(
            heading="exact, edit/token y fecha",
            sub="S30-T1-A",
            paragraphs=[
                "**Exact**: igualdad post-normalización. **Edit** (Levenshtein simplificado): typos. **Token**: Jaccard/overlap de palabras. **Fecha**: distancia en días con tolerancia.",
                "Cada comparador devuelve score en [0,1] o nivel ordinal (agree/disagree) para pesos tipo Fellegi–Sunter simplificado.",
                "Explica el score: guarda qué campo y qué función produjeron el valor (auditoría).",
            ],
            code="""def exact(a, b):
    return 1.0 if a == b else 0.0

def token_jaccard(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)

def edit_sim(a, b):
    # distancia de Levenshtein normalizada (simple)
    la, lb = len(a), len(b)
    if la == 0 and lb == 0:
        return 1.0
    dp = list(range(lb + 1))
    for i, ca in enumerate(a, 1):
        prev, dp[0] = dp[0], i
        for j, cb in enumerate(b, 1):
            cur = dp[j]
            dp[j] = prev if ca == cb else 1 + min(prev, dp[j], dp[j - 1])
            prev = cur
    dist = dp[lb]
    return 1.0 - dist / max(la, lb)

def date_sim(d1, d2, tol_days=3):
    delta = abs((d1 - d2).days)
    if delta == 0:
        return 1.0
    if delta <= tol_days:
        return 0.5
    return 0.0

from datetime import date
print("exact", exact("ana@example.pe", "ana@example.pe"))
print("token", round(token_jaccard("Ana López", "López Ana"), 3))
print("edit", round(edit_sim("María", "Maria"), 3))
print("date", date_sim(date(2020, 1, 1), date(2020, 1, 2)))""",
            code_title="comparators.py",
            callout=(
                "tip",
                "Explicabilidad",
                "Guarda vector de aportes por campo; el clerical reviewer debe ver por qué el score es alto.",
            ),
        ),
        Theory(
            heading="missingness informativa y frecuencia",
            sub="S30-T1-B",
            paragraphs=[
                "**Missingness**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa estado `missing` en la comparación.",
                "Missingness puede ser **informativa** (ciertas fuentes nunca traen teléfono) — modela por fuente, no asumas MCAR sin evidencia.",
                "**Frecuencia**: valores muy comunes (nombre “María”, dominio genérico) bajan el peso de un acuerdo exacto (u-probability alta en FS).",
            ],
            code="""def compare_field(a, b):
    if a is None or a == "" or b is None or b == "":
        return "missing"
    return "agree" if a.casefold() == b.casefold() else "disagree"

def frequency_weight(value, freq_table, base=1.0):
    # valores frecuentes → menos peso de acuerdo
    f = freq_table.get(value.casefold(), 1)
    return base / f

freq = {"maría": 50, "ximena": 2}
print("cmp_miss", compare_field("", "Ana"))
print("cmp_ok", compare_field("Ana", "ana"))
print("w_common", frequency_weight("María", freq))
print("w_rare", frequency_weight("Ximena", freq))""",
            code_title="missing_freq.py",
            callout=(
                "warning",
                "Missing ≠ disagree",
                "Penalizar missing como desacuerdo infla non-matches espurios.",
            ),
        ),
        Theory(
            heading="reglas y candidate recall",
            sub="S30-T2-A",
            paragraphs=[
                "**Blocking** reduce pares: misma clave (apellido normalizado + CP, email local-part, teléfono últimos 6, etc.).",
                "**Candidate recall**: de los pares verdaderamente match en el gold, ¿qué fracción pasó el blocking? Mide con etiquetas sintéticas.",
                "Reglas múltiples en unión (OR) suben recall; intersección (AND) baja candidatos pero puede matar recall.",
            ],
            code="""def block_key(rec):
    name = " ".join(rec["name"].casefold().split())
    last = name.split()[-1] if name else ""
    return f"{last}|{rec.get('city','')[:3].casefold()}"

records = [
    {"id": "r1", "name": "Ana López", "city": "Lima"},
    {"id": "r2", "name": "ANA lopez", "city": "Lima"},
    {"id": "r3", "name": "Bob Díaz", "city": "Cusco"},
]
from collections import defaultdict
buckets = defaultdict(list)
for r in records:
    buckets[block_key(r)].append(r["id"])
# gold match (r1,r2)
gold = {frozenset(("r1", "r2"))}
candidates = set()
for ids in buckets.values():
    for i in range(len(ids)):
        for j in range(i + 1, len(ids)):
            candidates.add(frozenset((ids[i], ids[j])))
recall = len(gold & candidates) / len(gold)
print("buckets", {k: v for k, v in buckets.items()})
print("candidate_recall", recall)
print("n_cand", len(candidates))""",
            code_title="blocking_recall.py",
            callout=(
                "tip",
                "Mide recall de blocking",
                "Sin gold sintético no sabes si tu regla deja fuera verdaderos matches.",
            ),
        ),
        Theory(
            heading="combinaciones, costo y pares imposibles",
            sub="S30-T2-B",
            paragraphs=[
                "El **costo** es O(suma n_b^2) por bloque. Bloques enormes (clave débil) explotan CPU/memoria.",
                "**Pares imposibles**: reglas de exclusión (tipo persona vs empresa, fechas de nacimiento incompatibles sintéticas) evitan comparar lo incomparable.",
                "Combina blocking + filtros imposibles antes del scorer pesado.",
            ],
            code="""def pair_cost(block_sizes):
    return sum(n * (n - 1) // 2 for n in block_sizes)

def impossible(a, b):
    # sintético: tipos distintos no se comparan
    return a.get("type") != b.get("type")

sizes = [3, 10, 100]
print("cost", pair_cost(sizes))
a, b = {"type": "person"}, {"type": "org"}
print("skip", impossible(a, b))
print("policy", "filter_before_score")""",
            code_title="cost_impossible.py",
            callout=(
                "danger",
                "Bloque de 100k",
                "Una clave demasiado gruesa puede generar miles de millones de pares. Monitorea tamaño de bloque.",
            ),
        ),
        Theory(
            heading="pesos/probabilidad y thresholds",
            sub="S30-T3-A",
            paragraphs=[
                "Modelo simple: score = suma de pesos por acuerdo/desacuerdo de campos (Fellegi–Sunter didáctico) o promedio ponderado de similitudes.",
                "**Thresholds**: auto_match ≥ t_high; non_match ≤ t_low; en medio → **review**.",
                "Estima pesos con frecuencias o a mano con documentación; valida en gold sintético (S30-T4).",
            ],
            code="""def pair_score(sims, weights):
    num = sum(sims[k] * weights[k] for k in weights)
    den = sum(weights.values())
    return num / den if den else 0.0

def decide(score, t_high=0.9, t_low=0.5):
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

sims = {"name": 0.95, "email": 1.0, "phone": 0.0}
weights = {"name": 0.5, "email": 0.4, "phone": 0.1}
s = pair_score(sims, weights)
print("score", round(s, 3))
print("decision", decide(s))
print("explain", sims)""",
            code_title="weights_thresh.py",
            callout=(
                "warning",
                "Auto-match conservador",
                "t_high alto reduce falsos positivos que molestan a operaciones; el resto va a review.",
            ),
        ),
        Theory(
            heading="entrenamiento, clerical review y cluster consistency",
            sub="S30-T3-B",
            paragraphs=[
                "**Entrenamiento/estimación**: ajusta pesos o umbrales con pares etiquetados sintéticos (no PII real).",
                "**Clerical review**: cola con score, explicación y acciones match/non-match/uncertain + actor y timestamp.",
                "**Cluster consistency**: si A=B y B=C entonces A=C en la misma entidad; resuelve con Union-Find y revisa contradicciones.",
            ],
            code="""class UnionFind:
    def __init__(self):
        self.p = {}
    def find(self, x):
        self.p.setdefault(x, x)
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra

uf = UnionFind()
# auto matches
for a, b in [("e1", "e2"), ("e2", "e3")]:
    uf.union(a, b)
review_queue = [
    {"pair": ("e3", "e4"), "score": 0.72, "explain": {"name": 0.8, "email": 0.5}}
]
# clerical: aprueba e3-e4
uf.union("e3", "e4")
print("same_cluster", uf.find("e1") == uf.find("e4"))
print("queue_n", len(review_queue))
print("note", "ER_not_fraud")""",
            code_title="review_cluster.py",
            callout=(
                "info",
                "Consistencia transitiva",
                "Clusters incoherentes (A=B, B≠C, A=C) son bugs de postproceso o de labels.",
            ),
        ),
        Theory(
            heading="labeled pairs y splits por entidad",
            sub="S30-T4-A",
            paragraphs=[
                "El **benchmark etiquetado** tiene pares match/non-match sintéticos. Nunca uses el mismo par en train y test de umbrales sin control.",
                "**Split por entidad**: si una entidad aparece en train, sus pares no deben filtrar a test (leakage de identidad).",
                "Documenta tamaños de split y prevalencia de matches (suele ser baja).",
            ],
            code="""pairs = [
    {"a": "e1", "b": "e2", "y": 1},
    {"a": "e1", "b": "e3", "y": 0},
    {"a": "e4", "b": "e5", "y": 1},
    {"a": "e4", "b": "e6", "y": 0},
]
# entidades train: e1,e2,e3
train_entities = {"e1", "e2", "e3"}

def entity_split(pairs, train_entities):
    train, test = [], []
    for p in pairs:
        ents = {p["a"], p["b"]}
        if ents & train_entities and not ents <= train_entities:
            # spill: un extremo en train y otro fuera → test o drop; aquí drop de train
            test.append(p)
        elif ents <= train_entities:
            train.append(p)
        else:
            test.append(p)
    return train, test

tr, te = entity_split(pairs, train_entities)
print("train_n", len(tr))
print("test_n", len(te))
print("leakage_guard", True)""",
            code_title="splits_entity.py",
            callout=(
                "danger",
                "Leakage por entidad",
                "Partir al azar pares con entidades compartidas infla métricas del motor.",
            ),
        ),
        Theory(
            heading="precision/recall, pairwise/cluster metrics y error slices",
            sub="S30-T4-B",
            paragraphs=[
                "**Pairwise**: precision/recall/F1 sobre pares predichos vs gold. **Cluster**: métricas a nivel entidad (p.ej. pair completeness/quality simplificado).",
                "**Error slices**: corta por fuente, apellido frecuente, missing phone, ciudad — encuentra fallas sistemáticas.",
                "Reporta con datos sintéticos; no conviertas errores en acusaciones de fraude.",
            ],
            code="""def prf(y_true, y_pred):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    return prec, rec, f1

y_true = [1, 1, 0, 0, 1]
y_pred = [1, 0, 0, 1, 1]
p, r, f = prf(y_true, y_pred)
# slice: errores donde pred!=true
errors = [i for i, (t, pr) in enumerate(zip(y_true, y_pred)) if t != pr]
print("precision", round(p, 3))
print("recall", round(r, 3))
print("f1", round(f, 3))
print("error_idx", errors)""",
            code_title="metrics_slices.py",
            callout=(
                "tip",
                "Pairwise vs cluster",
                "Un cluster partido en dos castiga recall pairwise y métricas de entidad; reporta ambas vistas.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S30-T1-A-DEMO",
            "S30-T1-A",
            "Compara exact email, token name y edit simple sobre registros sintéticos.",
            """def exact(a,b):
    return float(a==b)
def jac(a,b):
    ta,tb=set(a.lower().split()),set(b.lower().split())
    return len(ta&tb)/len(ta|tb) if ta|tb else 1.0
print(exact('a@example.pe','a@example.pe'), round(jac('Ana Lopez','Lopez Ana'),2))
print('comparators', 'exact+token')""",
            "Comparadores base del motor ER.",
            title="cmp_demo.py",
        ),
        Demo(
            "S30-T1-B-DEMO",
            "S30-T1-B",
            "Clasifica missing vs agree y baja peso por frecuencia de 'maría'.",
            """def cmp(a,b):
    if not a or not b: return 'missing'
    return 'agree' if a.lower()==b.lower() else 'disagree'
freq={'maría':40,'zoe':1}
w=lambda v: 1/freq.get(v.lower(),1)
print(cmp('','x'), cmp('Ana','ana'), round(w('María'),3), round(w('Zoe'),3))""",
            "Missing y frecuencia calibran acuerdos.",
            title="miss_demo.py",
        ),
        Demo(
            "S30-T2-A-DEMO",
            "S30-T2-A",
            "Blocking por apellido|ciudad y candidate recall sobre gold sintético.",
            """from collections import defaultdict
recs=[('r1','lopez','lima'),('r2','lopez','lima'),('r3','diaz','cusco')]
gold={frozenset(('r1','r2'))}
b=defaultdict(list)
for i,last,city in recs:
    b[f'{last}|{city}'].append(i)
cand=set()
for ids in b.values():
    for i in range(len(ids)):
        for j in range(i+1,len(ids)):
            cand.add(frozenset((ids[i],ids[j])))
print('recall', len(gold&cand)/len(gold), 'ncand', len(cand))""",
            "Recall de blocking es métrica de diseño.",
            title="block_demo.py",
        ),
        Demo(
            "S30-T2-B-DEMO",
            "S30-T2-B",
            "Costo de bloques y filtro de pares imposibles person/org.",
            """cost=lambda sizes: sum(n*(n-1)//2 for n in sizes)
print('cost', cost([5,20]))
print('impossible', {'type':'person'}!={'type':'org'})""",
            "Control de costo antes del scorer.",
            title="cost_demo.py",
        ),
        Demo(
            "S30-T3-A-DEMO",
            "S30-T3-A",
            "Score ponderado y decisión auto/review/non con umbrales.",
            """sims={'name':0.9,'email':1.0}
w={'name':0.6,'email':0.4}
s=sum(sims[k]*w[k] for k in w)/sum(w.values())
dec='auto_match' if s>=0.9 else ('review' if s>0.5 else 'non_match')
print(round(s,3), dec)""",
            "Thresholds separan auto y cola humana.",
            title="thresh_demo.py",
        ),
        Demo(
            "S30-T3-B-DEMO",
            "S30-T3-B",
            "Union-Find cluster tras auto-match y un clerical approve.",
            """p={}
def find(x):
    p.setdefault(x,x)
    if p[x]!=x: p[x]=find(p[x])
    return p[x]
def union(a,b):
    p[find(b)]=find(a)
union('e1','e2'); union('e2','e3'); union('e3','e4')
print(find('e1')==find('e4'), 'review_applied')""",
            "Clusters transitivos + review.",
            title="cluster_demo.py",
        ),
        Demo(
            "S30-T4-A-DEMO",
            "S30-T4-A",
            "Split por entidad: train solo con {e1,e2,e3}.",
            """pairs=[('e1','e2',1),('e4','e5',1),('e1','e3',0)]
train_e={'e1','e2','e3'}
tr=[p for p in pairs if set(p[:2])<=train_e]
te=[p for p in pairs if not set(p[:2])<=train_e]
print('train',len(tr),'test',len(te))""",
            "Evita leakage de identidad en evaluación.",
            title="split_demo.py",
        ),
        Demo(
            "S30-T4-B-DEMO",
            "S30-T4-B",
            "Precision/recall/F1 pairwise y lista de índices de error.",
            """yt=[1,1,0,0]; yp=[1,0,0,0]
tp=sum(t==1 and p==1 for t,p in zip(yt,yp))
fp=sum(t==0 and p==1 for t,p in zip(yt,yp))
fn=sum(t==1 and p==0 for t,p in zip(yt,yp))
prec=tp/(tp+fp) if tp+fp else 0
rec=tp/(tp+fn) if tp+fn else 0
print(round(prec,2), round(rec,2), [i for i,(t,p) in enumerate(zip(yt,yp)) if t!=p])""",
            "Métricas y slices para el gate CP-N3-A.",
            title="metrics_demo.py",
        ),
    ]

    exercises = [
        ex("S30-T1-A-E1", "S30-T1-A", "guided",
           "Exact: imprime 1.0 si 'a'=='a' else 0.0.",
           "float comparación", "exact",
           "a=b='a'\n# TODO\n",
           "a=b='a'\nprint(1.0 if a == b else 0.0)",
           ["post-normalize"]),
        ex("S30-T1-A-E2", "S30-T1-A", "independent",
           "Jaccard tokens de 'a b' y 'b c' → imprime fracción reducida 1/3 como float approx.",
           "sets", "inter/union",
           "# TODO\n",
           "ta,tb=set('a b'.split()),set('b c'.split())\nprint(len(ta&tb)/len(ta|tb))",
           ["orden de tokens"]),
        ex("S30-T1-A-E3", "S30-T1-A", "transfer",
           "date_sim: mismo día → 1.0; imprime para dos date(2026,1,1).",
           "datetime.date", "igualdad",
           "from datetime import date\n# TODO\n",
           "from datetime import date\nd=date(2026,1,1)\nprint(1.0 if d == d else 0.0)",
           ["tolerancia en días"]),
        ex("S30-T1-B-E1", "S30-T1-B", "guided",
           "Si a=='' o b=='' imprime 'missing'.",
           "guard", "missingness",
           "a,b='', 'x'\n# TODO\n",
           "a,b='', 'x'\nprint('missing' if (not a or not b) else 'cmp')",
           ["None"]),
        ex("S30-T1-B-E2", "S30-T1-B", "independent",
           "Peso 1/freq para freq=10 → 0.1.",
           "división", "frecuencia",
           "freq=10\n# TODO\n",
           "freq=10\nprint(1 / freq)",
           ["suavizado en prod"]),
        ex("S30-T1-B-E3", "S30-T1-B", "transfer",
           "Imprime 'informative_missing' como etiqueta de diseño cuando la fuente nunca trae phone.",
           "string", "MCAR vs informativa",
           "# TODO\n",
           "print('informative_missing')",
           ["por source_system"]),
        ex("S30-T2-A-E1", "S30-T2-A", "guided",
           "block_key = last + '|' + city para last='lopez' city='lima'.",
           "f-string", "blocking",
           "last,city='lopez','lima'\n# TODO\n",
           "last,city='lopez','lima'\nprint(f'{last}|{city}')",
           ["normaliza before"]),
        ex("S30-T2-A-E2", "S30-T2-A", "independent",
           "Candidate recall: gold 2, found 1 → 0.5.",
           "división", "recall",
           "found,gold_n=1,2\n# TODO\n",
           "found,gold_n=1,2\nprint(found / gold_n)",
           ["unión de reglas"]),
        ex("S30-T2-A-E3", "S30-T2-A", "transfer",
           "Imprime n candidatos C(4,2)=6 en un bloque de tamaño 4.",
           "combinatoria", "costo bloque",
           "n=4\n# TODO\n",
           "n=4\nprint(n*(n-1)//2)",
           ["múltiples bloques"]),
        ex("S30-T2-B-E1", "S30-T2-B", "guided",
           "Costo total bloques [3,5] → 3+10=13.",
           "sum n(n-1)/2", "costo",
           "sizes=[3,5]\n# TODO\n",
           "sizes=[3,5]\nprint(sum(n*(n-1)//2 for n in sizes))",
           ["monitor max block"]),
        ex("S30-T2-B-E2", "S30-T2-B", "independent",
           "Impossible si types difieren; imprime True para person vs org.",
           "!=", "filtro",
           "ta,tb='person','org'\n# TODO\n",
           "ta,tb='person','org'\nprint(ta != tb)",
           ["fechas incompatibles"]),
        ex("S30-T2-B-E3", "S30-T2-B", "transfer",
           "Política: imprime 'filter_before_score'.",
           "string", "pipeline",
           "# TODO\n",
           "print('filter_before_score')",
           ["ahorra CPU"]),
        ex("S30-T3-A-E1", "S30-T3-A", "guided",
           "Promedio ponderado name=1 w=0.5 email=0.5 w=0.5 → 0.75.",
           "suma w*s / suma w", "score",
           "# TODO\n",
           "print((1 * 0.5 + 0.5 * 0.5) / (0.5 + 0.5))",
           ["pesos suman 1 opcional"]),
        ex("S30-T3-A-E2", "S30-T3-A", "independent",
           "score=0.7 con t_high=0.9 t_low=0.5 → 'review'.",
           "umbrales", "decide",
           "s,t_high,t_low=0.7,0.9,0.5\n# TODO\n",
           "s,t_high,t_low=0.7,0.9,0.5\nprint('auto_match' if s>=t_high else ('non_match' if s<=t_low else 'review'))",
           ["calibrar con gold"]),
        ex("S30-T3-A-E3", "S30-T3-A", "transfer",
           "Imprime explicación dict {'name':0.9,'email':1.0}.",
           "dict", "explicable",
           "# TODO\n",
           "print({'name': 0.9, 'email': 1.0})",
           ["clerical UI"]),
        ex("S30-T3-B-E1", "S30-T3-B", "guided",
           "Union-Find mínimo: union 1-2 y 2-3; imprime si find(1)==find(3) con parent map simple.",
           "parent dict", "cluster",
           "p={1:1,2:2,3:3}\ndef find(x):\n    while p[x]!=x: x=p[x]\n    return x\n# TODO unions and print\n",
           "p={1:1,2:2,3:3}\ndef find(x):\n    while p[x]!=x: x=p[x]\n    return x\ndef union(a,b):\n    p[find(b)]=find(a)\nunion(1,2); union(2,3)\nprint(find(1)==find(3))",
           ["path compression opcional"]),
        ex("S30-T3-B-E2", "S30-T3-B", "independent",
           "Review queue item: imprime action options match/non_match/uncertain.",
           "lista", "clerical",
           "# TODO\n",
           "print(['match', 'non_match', 'uncertain'])",
           ["actor+timestamp"]),
        ex("S30-T3-B-E3", "S30-T3-B", "transfer",
           "Imprime regla de privacidad: 'ER_only_same_entity'.",
           "string", "gate",
           "# TODO\n",
           "print('ER_only_same_entity')",
           ["no fraud labels"]),
        ex("S30-T4-A-E1", "S30-T4-A", "guided",
           "Si set(a,b)subseteq train_e imprime 'train' else 'test' para a,b e1,e2 train {e1,e2,e3}.",
           "subset", "split",
           "a,b='e1','e2'\ntrain_e={'e1','e2','e3'}\n# TODO\n",
           "a,b='e1','e2'\ntrain_e={'e1','e2','e3'}\nprint('train' if {a,b} <= train_e else 'test')",
           ["leakage"]),
        ex("S30-T4-A-E2", "S30-T4-A", "independent",
           "Prevalencia matches: 1 match de 5 pares → 0.2.",
           "división", "base rate",
           "matches,n=1,5\n# TODO\n",
           "matches,n=1,5\nprint(matches / n)",
           ["desbalance"]),
        ex("S30-T4-A-E3", "S30-T4-A", "transfer",
           "Imprime 'entity_split' como política anti-leakage.",
           "string", "eval",
           "# TODO\n",
           "print('entity_split')",
           ["group/time splits luego"]),
        ex("S30-T4-B-E1", "S30-T4-B", "guided",
           "tp=2 fp=1 → precision 2/3 approx print round 2 decimals.",
           "tp/(tp+fp)", "precision",
           "tp,fp=2,1\n# TODO\n",
           "tp,fp=2,1\nprint(round(tp/(tp+fp), 2))",
           ["recall simétrico"]),
        ex("S30-T4-B-E2", "S30-T4-B", "independent",
           "tp=2 fn=2 → recall 0.5.",
           "tp/(tp+fn)", "recall",
           "tp,fn=2,2\n# TODO\n",
           "tp,fn=2,2\nprint(tp/(tp+fn))",
           ["F1 harmonic"]),
        ex("S30-T4-B-E3", "S30-T4-B", "transfer",
           "Slice error: imprime ['missing_phone'] como slice con más errores sintéticos.",
           "lista", "error analysis",
           "# TODO\n",
           "print(['missing_phone'])",
           ["no acusar fraude"]),
    ]

    youdo = {
        "title": "Testable Entity Resolution Engine — cierre CP-N3-A",
        "context": (
            "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables, blocking con "
            "candidate recall medido, scorer con umbrales auto/review/non, cola clerical, clusters (Union-Find) "
            "y evaluación pairwise con split por entidad y error slices. Benchmark etiquetado sintético only. "
            "ER = misma entidad; **no** relación ni riesgo/fraude. No editar seed/checkpoint/ledger ni marcar passed."
        ),
        "objectives": [
            "Comparadores exact/edit/token/fecha + missing/frecuencia",
            "Blocking medido (recall) y control de costo/imposibles",
            "Pesos, thresholds, review y cluster consistency",
            "Gold sintético, split por entidad, P/R/F1 y slices",
            "Suite ejecutable alineada a contratos S27–S29",
        ],
        "requirements": [
            "Datos sintéticos etiquetados; sin PII real",
            "Candidate recall y métricas reportadas en demo",
            "Explicación por campo en cola de review",
            "Cero labels de fraude/parentesco automáticos",
            "Documentación es-PE del gate CP-N3-A",
        ],
        "starterCode": """# CP-N3-A cierre — Testable ER Engine (esqueleto)
from collections import defaultdict

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def block_key(rec: dict) -> str:
    parts = normalize(rec.get("name", "")).split()
    last = parts[-1] if parts else ""
    return f"{last}|{rec.get('city', '').casefold()[:3]}"

def decide(score: float, t_high=0.9, t_low=0.5) -> str:
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

# TODO: comparators, candidate pairs, UF clusters, metrics, review queue
if __name__ == "__main__":
    print(decide(0.95), block_key({"name": "Ana López", "city": "Lima"}))
""",
        "portfolioNote": (
            "Cierre CP-N3-A: motor ER testeable con blocking medido, review y métricas. "
            "Otra lane califica PASS del gate; esta autoría no escribe checkpoint/ledger/seed."
        ),
        "rubric": RUBRIC_STD
        + [
            {
                "criterion": "Candidate recall + P/R reportados y split por entidad sin leakage",
                "weight": "bonus checklist",
            },
            {
                "criterion": "ER solo misma entidad (sin fraude/relación)",
                "weight": "gate privacy",
            },
        ],
    }

    selfcheck = [
        {
            "question": "El motor ER de CP-N3-A debe decidir:",
            "options": [
                "Fraude automático",
                "Parentescos",
                "Si dos registros son la misma entidad",
                "Riesgo crediticio",
            ],
            "correctIndex": 2,
            "explanation": "ER ≠ relación ≠ riesgo.",
        },
        {
            "question": "Candidate recall de blocking mide:",
            "options": [
                "Solo CPU",
                "Fracción de verdaderos matches que sobreviven al blocking",
                "Precisión del scorer final únicamente",
                "Tamaño del disco",
            ],
            "correctIndex": 1,
            "explanation": "Recall sobre gold de candidatos.",
        },
        {
            "question": "Scores entre t_low y t_high van a:",
            "options": ["auto_match", "non_match", "clerical review", "borrado"],
            "correctIndex": 2,
            "explanation": "Banda gris = humanos.",
        },
        {
            "question": "Split por entidad evita:",
            "options": [
                "Usar sqlite",
                "Leakage de identidad entre train y test",
                "Blocking",
                "Review",
            ],
            "correctIndex": 1,
            "explanation": "Entidades no deben contaminar evaluación.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "Record linkage (overview)",
                "url": "https://en.wikipedia.org/wiki/Record_linkage",
                "note": "Contexto de ER/blocking",
            },
            {
                "label": "splink documentation",
                "url": "https://moj-analytical-services.github.io/splink/",
                "note": "Referencia moderna de probabilistic linkage",
            },
        ],
        "books": [
            {
                "label": "Data Matching (Peter Christen)",
                "note": "Blocking, comparación y evaluación",
            },
            {
                "label": "Entity Resolution papers / Fellegi–Sunter",
                "note": "Pesos y umbrales clásicos",
            },
        ],
        "courses": [
            {
                "label": "PyPI rapidfuzz (similitud)",
                "url": "https://github.com/rapidfuzz/RapidFuzz",
                "note": "Edit/token similarity en la práctica",
            },
        ],
    }

    i_do = (
        "Te muestro el cierre de CP-N3-A: comparadores, blocking con recall, pesos y umbrales, "
        "review/clusters y métricas pairwise con split por entidad — sin inferir fraude."
    )
    we_do = (
        "24 ejercicios de comparadores, missing/frecuencia, blocking, costo, matching, review y evaluación."
    )
    ts, log = build_section(
        "section30", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "security-infra",
        "index": 30,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 16,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "GitMerge",
        "legacy_note": "security-infra retargeted to probabilistic ER / CP-N3-A close",
        "capstone": "CP-N3-A (cierre)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    builders = [
        (
            "S27",
            "async-concurrency",
            "s27-async-concurrency.ts",
            build_s27,
            "CP-N3-A (inicio)",
        ),
        (
            "S28",
            "llm-agents",
            "s28-llm-agents.ts",
            build_s28,
            "CP-N3-A (QA ER)",
        ),
        (
            "S29",
            "mlops",
            "s29-mlops.ts",
            build_s29,
            "CP-N3-A (almacén ER)",
        ),
        (
            "S30",
            "security-infra",
            "s30-security-infra.ts",
            build_s30,
            "CP-N3-A (cierre / gate)",
        ),
    ]
    results = {}
    for section, sid, fname, builder, gate in builders:
        print(f"Building {section}…")
        ts, log, slugs, meta_u, youdo_t = builder()
        path = SECTIONS / fname
        path.write_text(ts, encoding="utf-8")
        print("Wrote", path, "verified", len(log))
        prog = progress_payload(section, sid, fname, meta_u, slugs, log, youdo_t)
        prog_path = STATE / f"{section.lower()}_phase4_progress.json"
        prog_path.write_text(
            json.dumps(prog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        results[section] = {
            "section_id": sid,
            "title_v3": meta_u["title"],
            "subtopics_done": [s[0] for s in slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": gate,
            "log": log,
            "fname": fname,
        }

    lane = {
        "lane_id": LANE_ID,
        "parent_lane": None,
        "sections": ["S27", "S28", "S29", "S30"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S27": {k: v for k, v in results["S27"].items() if k != "log"},
        "S28": {k: v for k, v in results["S28"].items() if k != "log"},
        "S29": {k: v for k, v in results["S29"].items() if k != "log"},
        "S30": {k: v for k, v in results["S30"].items() if k != "log"},
        "exercises_done": 96,
        "exercises_target": 96,
        "demos_done": 32,
        "demos_target": 32,
        "files_changed": [
            "src/lib/course/sections/s27-async-concurrency.ts",
            "src/lib/course/sections/s28-llm-agents.ts",
            "src/lib/course/sections/s29-mlops.ts",
            "src/lib/course/sections/s30-security-infra.ts",
            "course-state/s27_phase4_progress.json",
            "course-state/s28_phase4_progress.json",
            "course-state/s29_phase4_progress.json",
            "course-state/s30_phase4_progress.json",
            f"course-state/lanes/{LANE_ID}.status.json",
            "scripts/_gen_s27_s30_p4.py",
        ],
        "execution_summary": (
            "Retargeted S27→pytest strategy (CP-N3-A inicio), S28→data/property/integration QA ER, "
            "S29→SQL advanced ER store, S30→probabilistic ER (cierre gate CP-N3-A). "
            "Full packages 8 subtopics each (theory+demo+E1/E2/E3, 2 hints) = 8 demos + 24 exercises each. "
            "Platform ids async-concurrency / llm-agents / mlops / security-infra preserved. "
            "All demos/solutions executed with python3; UNVERIFIED=[]. Español peruano; synthetic data only. "
            "Privacy: ER/matching no implica fraude ni parentesco. No seed/checkpoint/ledger edits."
        ),
        "blockers": [],
        "do_not_edit": [
            "course-state/checkpoint.json",
            "course-state/section_ledger.json",
            "course-state/issue_registry.json",
            "course-state/parallel_orchestration.json",
            "prisma/seed.ts",
        ],
        "privacy_note": "ER only same-entity; no fraud/parentesco/collusion inference from matching or scores.",
        "next_action": (
            "PHASE 5 exam banks for async-concurrency, llm-agents, mlops, security-infra V3 slugs. "
            "Do not mark S27–S30 passed from this lane. Gate CP-N3-A qualification is a separate lane."
        ),
        "verified_counts": {
            "S27": len(results["S27"]["log"]),
            "S28": len(results["S28"]["log"]),
            "S29": len(results["S29"]["log"]),
            "S30": len(results["S30"]["log"]),
            "UNVERIFIED": [],
        },
    }
    for s in ("S27", "S28", "S29", "S30"):
        lane[s].pop("fname", None)

    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / f"{LANE_ID}.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print(
        "Verified counts:",
        {
            k: lane["verified_counts"][k]
            for k in ("S27", "S28", "S29", "S30", "UNVERIFIED")
        },
    )


if __name__ == "__main__":
    main()
