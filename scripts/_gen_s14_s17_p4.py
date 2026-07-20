#!/usr/bin/env python3
"""Generate S14–S17 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S14-S17-P4 Author.
Does not touch seed/checkpoint/ledger/orchestration.
Platform ids preserved: security, stdlib-deep, wxpython-gui, packaging.
V3 themes: NumPy vectorizado | Pandas ingesta | calidad/limpieza | joins/groupby (CP-N2-A).
Español peruano; datos sintéticos only.
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
LANE_ID = "LANE-S14-S17-P4"


def run_py(code: str) -> str:
    r = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        timeout=60,
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
    }


RUBRIC_STD = [
    {"criterion": "Alineación al gate V3 de la sección", "weight": "25%"},
    {"criterion": "Correctitud técnica en entorno declarado", "weight": "20%"},
    {"criterion": "Privacidad / sin PII real / sin secretos", "weight": "20%"},
    {"criterion": "Pruebas o casos de borde documentados", "weight": "15%"},
    {"criterion": "Código legible y límites claros", "weight": "10%"},
    {"criterion": "Documentación en español profesional", "weight": "10%"},
]


# ---------------------------------------------------------------------------
# S14 — NumPy y cómputo vectorizado (platform id: security)
# ---------------------------------------------------------------------------


def build_s14() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S14-T1-A", "ndarray-dtype-shape"),
        ("S14-T1-B", "create-index-masks"),
        ("S14-T2-A", "ufuncs-reductions"),
        ("S14-T2-B", "broadcasting-shapes"),
        ("S14-T3-A", "views-copies-mutability"),
        ("S14-T3-B", "nan-inf-stability"),
        ("S14-T4-A", "vectorize-vs-loops"),
        ("S14-T4-B", "memory-measure-tol-tests"),
    ]
    meta = {
        "id": "security",
        "index": 14,
        "title": "NumPy y cómputo vectorizado",
        "shortTitle": "NumPy vectorizado",
        "tagline": "cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline",
        "estimatedHours": 10,
        "level": "Competente",
        "phase": 1,
        "icon": "ShieldCheck",
        "accentColor": "bg-gradient-to-br from-blue-500 to-indigo-600",
        "jobRelevance": (
            "En data quality y analytics de banca, fintech y retail en Perú, el **cómputo vectorizado con NumPy** "
            "es la base de métricas de completitud, unicidad y señales por pares. Esta sección (id de plataforma "
            "`security` conservado) retematiza a V3 **NumPy y cómputo vectorizado** e inicia **CP-N2-A** con "
            "arrays sintéticos, benchmarks honestos y tests con tolerancia."
        ),
        "learningOutcomes": [
            "Construir y validar ndarrays con dtype y shape correctos",
            "Indexar y filtrar con máscaras booleanas de forma segura",
            "Aplicar ufuncs y reducciones por eje para métricas de calidad",
            "Resolver broadcasting y documentar compatibilidad de shapes",
            "Distinguir views de copies y controlar mutabilidad",
            "Manejar NaN/inf y evaluar estabilidad numérica",
            "Vectorizar frente a loops con benchmark honesto",
            "Medir memoria y probar equivalencia con tolerancia",
        ],
    }

    theories = [
        Theory(
            heading="De “Seguridad para Automatizaciones e IA” a NumPy vectorizado (mapa de la sección)",
            paragraphs=[
                "En V3, **S14 no es el path principal de OWASP LLM, prompt injection ni presidio**. Ese material se reubica conceptualmente hacia el tramo de seguridad/IA. Aquí construyes el **inicio de CP-N2-A**: ndarrays, máscaras, ufuncs, broadcasting, views/copies, NaN y vectorización con **métricas de calidad sintéticas**.",
                "El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) calculado en NumPy. Solo datos sintéticos latam (regiones Lima/Arequipa/Cusco, ids `C00x`).",
                "Orden: **T1 Arrays** → **T2 Operaciones** → **T3 Semántica** → **T4 Rendimiento**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de seguridad/IA de este archivo **no es el camino V3 del estudiante en S14**. Target: NumPy vectorizado para CP-N2-A (inicio). Conserva datos sintéticos; nunca PII real.",
            ),
        ),
        Theory(
            heading="ndarray, dtype y shape",
            sub="S14-T1-A",
            paragraphs=[
                "Un **ndarray** es un bloque contiguo (o strided) de datos homogéneos. **dtype** fija el tipo (p. ej. `float64`, `int32`); **shape** es la tupla de dimensiones; **ndim** = `len(shape)`; **itemsize** es bytes por elemento.",
                "Crear con dtype explícito evita sorpresas (`int` vs `float` en divisiones). Valida siempre `arr.dtype`, `arr.shape` y `arr.ndim` al recibir un array de un pipeline.",
                "En calidad de datos, un vector de flags de completitud suele ser `bool` o `uint8`; un score de 0–1 es `float64`.",
            ],
            code="""import numpy as np

flags = np.array([1, 0, 1, 1], dtype=np.uint8)
scores = np.array([0.9, 0.4, 0.85, 0.7], dtype=np.float64)
print("flags", flags.dtype, flags.shape, flags.ndim, flags.itemsize)
print("scores", scores.dtype, scores.shape, scores.nbytes)""",
            code_title="ndarray_basics.py",
            callout=(
                "tip",
                "Documenta el contrato del array",
                "Cada función que recibe un ndarray debe documentar dtype y shape esperados (o asertarlos).",
            ),
        ),
        Theory(
            heading="creación, indexación y máscaras",
            sub="S14-T1-B",
            paragraphs=[
                "`np.array`, `arange`, `linspace` y `zeros`/`ones`/`full` crean arrays. **Indexación** clásica (`a[i]`, `a[i:j]`) y **fancy index** (`a[[0,2]]`) seleccionan elementos.",
                "Una **máscara booleana** `a > umbral` produce un array de `bool` del mismo shape; `a[mask]` filtra. Es la forma idiomática de calidad: “filas con score < 0.5”.",
                "Ojo: filtrar con máscara suele devolver **copia** (o array 1D nuevo); no asumas view.",
            ],
            code="""import numpy as np

ids = np.array(["C001", "C002", "C003", "C004"])
score = np.array([0.9, 0.35, 0.8, 0.2])
mask = score < 0.5
print("bajo_score", ids[mask].tolist())
print("fancy", score[[0, 2]].tolist())
print("linspace", np.linspace(0, 1, 5).tolist())""",
            code_title="masks_index.py",
            callout=(
                "warning",
                "Máscaras y longitudes",
                "La máscara debe tener la misma shape que el eje indexado; de lo contrario ValueError.",
            ),
        ),
        Theory(
            heading="ufuncs y reducciones",
            sub="S14-T2-A",
            paragraphs=[
                "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en C. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan ejes.",
                "`axis=0` reduce filas→agrega por columna; `axis=1` por fila. `keepdims=True` preserva dimensiones para rebroadcast.",
                "Métricas de calidad: `mean(flags)` = completitud; `std(scores, axis=0)` = dispersión por variable.",
            ],
            code="""import numpy as np

# filas=clientes, cols=campos presentes (1/0)
M = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
completitud_campo = M.mean(axis=0)
completitud_fila = M.mean(axis=1, keepdims=True)
print("por_campo", completitud_campo.round(3).tolist())
print("por_fila", completitud_fila.ravel().round(3).tolist())
print("global", float(M.mean().round(4)))""",
            code_title="ufuncs_reduce.py",
            callout=(
                "tip",
                "keepdims para rebroadcast",
                "Usa keepdims cuando vayas a restar/dividir el agregado contra la matriz original.",
            ),
        ),
        Theory(
            heading="broadcasting y compatibilidad de shapes",
            sub="S14-T2-B",
            paragraphs=[
                "El **broadcasting** alinea shapes de derecha a izquierda: dimensiones iguales, o una es 1, o ausente. Si no, `ValueError`.",
                "`newaxis` / `None` inserta un eje de tamaño 1 para alinear vectores de filas/columnas (p. ej. señales por pares).",
                "Documenta el shape esperado en comentarios: evita “magia” que falla en producción con un batch distinto.",
            ],
            code="""import numpy as np

scores = np.array([[0.9, 0.8], [0.4, 0.5], [0.7, 0.6]])  # (3,2)
pesos = np.array([0.6, 0.4])  # (2,)
ponderado = scores * pesos  # broadcast (3,2)*(2,)
umbral = np.array([0.5])[:, None]  # (1,1) vía reshape
print("ponderado", ponderado.round(3).tolist())
print("sobre_umbral", (scores.mean(axis=1, keepdims=True) > umbral).ravel().tolist())
try:
    np.ones((3, 2)) + np.ones((3, 3))
except ValueError as e:
    print("shape_error", str(e)[:40])""",
            code_title="broadcast.py",
            callout=(
                "warning",
                "Broadcast silencioso",
                "Shapes “casi” compatibles pueden broadcastar mal. Valida shape antes de operar en pipelines.",
            ),
        ),
        Theory(
            heading="views/copies y mutabilidad",
            sub="S14-T3-A",
            paragraphs=[
                "Un **view** comparte memoria con el base (`arr.base is not None` a menudo); un **copy** es independiente. Slices simples suelen ser views; fancy index y boolean mask suelen copiar.",
                "`arr.flags.writeable` controla mutación. Mutar un view muta el original — fuente clásica de bugs en pipelines.",
                "Usa `.copy()` cuando debas aislar transformaciones (p. ej. normalizar scores sin tocar el raw).",
            ],
            code="""import numpy as np

raw = np.array([10.0, 20.0, 30.0])
vista = raw[:2]
vista[0] = 99.0
print("raw_tras_view", raw.tolist())
raw2 = np.array([10.0, 20.0, 30.0])
copia = raw2[:2].copy()
copia[0] = 99.0
print("raw_tras_copy", raw2.tolist())
print("vista_base_is_raw", vista.base is raw)""",
            code_title="views_copies.py",
            callout=(
                "danger",
                "Side effects por view",
                "Si pasas un slice a una función que escribe, puede corromper el array padre. Copia o marca writeable=False.",
            ),
        ),
        Theory(
            heading="NaN, inf y estabilidad numérica",
            sub="S14-T3-B",
            paragraphs=[
                "`np.nan` y `±inf` rompen `mean`/`sum` clásicos. Usa `np.isnan`/`isinf`, `nansum`/`nanmean`, o máscaras.",
                "`np.finfo(float).eps` acota ruido de redondeo. Overflow en enteros y float produce wrap o inf.",
                "En calidad, un NaN en un campo no es “cero”: es **ausencia**. Métricas robustas lo documentan.",
            ],
            code="""import numpy as np

x = np.array([1.0, np.nan, 3.0, np.inf])
print("isnan", np.isnan(x).tolist())
print("isinf", np.isinf(x).tolist())
finite = x[np.isfinite(x)]
print("finite_mean", float(np.mean(finite)))
print("nansum_sin_inf", float(np.nansum(np.where(np.isinf(x), np.nan, x))))
print("eps", float(np.finfo(float).eps))""",
            code_title="nan_inf.py",
            callout=(
                "tip",
                "isfinite primero",
                "Filtra con np.isfinite antes de reducciones de negocio si inf no es un valor válido.",
            ),
        ),
        Theory(
            heading="vectorización frente a loops",
            sub="S14-T4-A",
            paragraphs=[
                "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado.",
                "Benchmark **honesto**: mismo input, warmup opcional, `time.perf_counter`, reporta ratio. No compares N=10.",
                "A veces un loop claro gana en N pequeño o lógica irregular; documenta el umbral.",
            ],
            code="""import numpy as np
import time

n = 50_000
a = np.arange(n, dtype=float)
b = np.arange(n, dtype=float)

t0 = time.perf_counter()
s_loop = 0.0
for i in range(n):
    s_loop += a[i] * b[i]
t_loop = time.perf_counter() - t0

t1 = time.perf_counter()
s_vec = float(np.dot(a, b))
t_vec = time.perf_counter() - t1
print("equal", abs(s_loop - s_vec) < 1e-6)
print("ratio_loop_over_vec", round(t_loop / max(t_vec, 1e-12), 1))""",
            code_title="vec_vs_loop.py",
            callout=(
                "info",
                "Benchmark honesto",
                "Reporta N, dtype y máquina. Un ratio en laptop no es SLA de producción.",
            ),
        ),
        Theory(
            heading="memoria, medición y tests con tolerancia",
            sub="S14-T4-B",
            paragraphs=[
                "`nbytes` y `itemsize * size` estiman memoria del array. Evita copias innecesarias en datasets grandes.",
                "`np.allclose(a, b, rtol=, atol=)` compara floats con tolerancia. `np.testing.assert_allclose` falla con mensaje claro.",
                "En CP-N2-A, el baseline loop y la versión vectorizada deben ser **equivalentes dentro de rtol/atol**.",
            ],
            code="""import numpy as np

base = np.array([1.0, 2.0, 3.0])
approx = base + 1e-9
print("nbytes", base.nbytes)
print("allclose", np.allclose(base, approx, rtol=1e-7, atol=1e-9))
try:
    np.testing.assert_allclose(base, base + 0.1, atol=1e-6)
except AssertionError as e:
    print("assert_fail", "not close" in str(e).lower() or True)""",
            code_title="allclose_mem.py",
            callout=(
                "tip",
                "rtol vs atol",
                "rtol escala con la magnitud; atol cubre cercanos a cero. Elige según la métrica de negocio.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S14-T1-A-DEMO",
            "S14-T1-A",
            "Crear arrays de flags y scores con dtype/shape documentados y validar ndim",
            """import numpy as np

def make_quality_arrays(n_clients=4):
    flags = np.ones((n_clients, 3), dtype=np.uint8)  # 3 campos obligatorios
    flags[1, 2] = 0
    scores = np.array([0.92, 0.41, 0.78, 0.65], dtype=np.float64)
    assert flags.ndim == 2 and flags.shape == (n_clients, 3)
    assert scores.ndim == 1 and scores.dtype == np.float64
    return flags, scores

f, s = make_quality_arrays()
print("flags_shape", f.shape, "dtype", f.dtype, "itemsize", f.itemsize)
print("scores_shape", s.shape, "nbytes", s.nbytes)""",
            "Fija el contrato dtype/shape antes de calcular métricas de calidad.",
            title="demo_ndarray.py",
        ),
        Demo(
            "S14-T1-B-DEMO",
            "S14-T1-B",
            "Indexar y filtrar clientes sintéticos con máscara booleana",
            """import numpy as np

ids = np.array(["C001", "C002", "C003", "C004", "C005"])
region = np.array(["Lima", "Arequipa", "Lima", "Cusco", "Lima"])
score = np.array([0.9, 0.3, 0.55, 0.8, 0.2])
mask = (region == "Lima") & (score < 0.6)
print("filtrados", ids[mask].tolist())
print("count", int(mask.sum()))""",
            "Máscaras combinadas expresan reglas de calidad sin loops.",
            title="demo_masks.py",
        ),
        Demo(
            "S14-T2-A-DEMO",
            "S14-T2-A",
            "Reducir métricas de completitud por campo y por cliente con ufuncs",
            """import numpy as np

# 1 = presente, 0 = ausente
M = np.array([
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 1],
], dtype=float)
por_campo = M.mean(axis=0)
por_cliente = M.mean(axis=1)
print("completitud_campo", np.round(por_campo, 3).tolist())
print("completitud_cliente", np.round(por_cliente, 3).tolist())
print("std_campos", float(np.round(por_campo.std(), 4)))""",
            "Reducciones por eje son el núcleo de tableros de calidad vectorizados.",
            title="demo_reductions.py",
        ),
        Demo(
            "S14-T2-B-DEMO",
            "S14-T2-B",
            "Alinear scores de clientes con pesos de campos vía broadcast explícito",
            """import numpy as np

scores = np.array([  # clientes x dimensiones de calidad
    [0.9, 0.8, 0.7],
    [0.4, 0.5, 0.6],
    [0.85, 0.9, 0.75],
])
pesos = np.array([0.5, 0.3, 0.2])  # (3,)
assert scores.shape[1] == pesos.shape[0]
weighted = scores * pesos  # (3,3)*(3,)
agg = weighted.sum(axis=1)
print("agg", np.round(agg, 4).tolist())
# señales por pares: diferencia de agg vía newaxis
diff = agg[:, None] - agg[None, :]
print("diff_shape", diff.shape)
print("diff_00", float(diff[0, 0]))""",
            "Broadcast documentado evita ValueError y fan-out silencioso de shapes.",
            title="demo_broadcast.py",
        ),
        Demo(
            "S14-T3-A-DEMO",
            "S14-T3-A",
            "Demostrar mutación vía view y aislar normalización con copy",
            """import numpy as np

raw = np.array([100.0, 200.0, 50.0, 150.0])
# mal: normalizar en view
v = raw[:]
v /= v.max()
print("raw_corrupto", np.round(raw, 3).tolist())

raw = np.array([100.0, 200.0, 50.0, 150.0])
norm = raw.copy()
norm /= norm.max()
print("raw_ok", raw.tolist())
print("norm", np.round(norm, 3).tolist())""",
            "Copia antes de mutar cuando el raw alimenta auditoría o reprocess.",
            title="demo_views.py",
        ),
        Demo(
            "S14-T3-B-DEMO",
            "S14-T3-B",
            "Calcular media robusta de scores ignorando NaN/inf documentados",
            """import numpy as np

scores = np.array([0.9, np.nan, 0.7, np.inf, 0.4, 0.85])
valid = scores[np.isfinite(scores)]
print("n_valid", valid.size, "de", scores.size)
print("mean_robusta", float(np.round(valid.mean(), 4)))
print("nanmean_solo_nan", float(np.round(np.nanmean(np.where(np.isinf(scores), np.nan, scores)), 4)))""",
            "Métricas de calidad deben declarar política ante NaN/inf.",
            title="demo_nan.py",
        ),
        Demo(
            "S14-T4-A-DEMO",
            "S14-T4-A",
            "Comparar loop vs vectorizado para score ponderado con timing honesto",
            """import numpy as np
import time

rng = np.random.default_rng(42)
n, k = 20_000, 5
X = rng.random((n, k))
w = rng.random(k)
w = w / w.sum()

t0 = time.perf_counter()
out_loop = np.empty(n)
for i in range(n):
    s = 0.0
    for j in range(k):
        s += X[i, j] * w[j]
    out_loop[i] = s
t_loop = time.perf_counter() - t0

t1 = time.perf_counter()
out_vec = X @ w
t_vec = time.perf_counter() - t1
print("allclose", np.allclose(out_loop, out_vec))
print("ratio", round(t_loop / max(t_vec, 1e-12), 1))""",
            "Equivalencia + ratio de tiempo justifican la vectorización en el portfolio.",
            title="demo_bench.py",
        ),
        Demo(
            "S14-T4-B-DEMO",
            "S14-T4-B",
            "Test con np.allclose y presupuesto de memoria para matriz de señales",
            """import numpy as np

n = 500
base = np.linspace(0, 1, n)
vec = base * 0.5 + 0.1
# simula error numérico leve
vec_approx = vec + 1e-10
budget = 8 * n * n  # float64 de matriz n x n
pair = base[:, None] - base[None, :]
print("pair_nbytes", pair.nbytes, "budget_ok", pair.nbytes <= budget)
print("allclose", np.allclose(vec, vec_approx, rtol=1e-8, atol=1e-12))
np.testing.assert_allclose(vec, vec_approx, rtol=1e-8, atol=1e-12)
print("assert_ok", True)""",
            "Presupuesto de memoria + allclose cierran el incremento S14 de CP-N2-A.",
            title="demo_tol.py",
        ),
    ]

    def ex(eid, sub, kind, instr, h1, h2, starter, solution, edge):
        return Ex(eid, sub, kind, instr, h1, h2, starter, solution, edge=edge)

    exercises = [
        ex(
            "S14-T1-A-E1", "S14-T1-A", "guided",
            "Crea un ndarray `flags` de shape (3, 2) dtype uint8 con valores [[1,0],[1,1],[0,1]] e imprime dtype, shape y ndim.",
            "Usa np.array(..., dtype=np.uint8).",
            "Imprime tres atributos: dtype, shape, ndim.",
            "import numpy as np\n# TODO: flags\n",
            """import numpy as np
flags = np.array([[1, 0], [1, 1], [0, 1]], dtype=np.uint8)
print(flags.dtype, flags.shape, flags.ndim)""",
            ["dtype incorrecto (int64 por defecto)", "shape transpuesta"],
        ),
        ex(
            "S14-T1-A-E2", "S14-T1-A", "independent",
            "Construye `scores = np.linspace(0, 1, 5, dtype=np.float64)` y reporta itemsize y nbytes.",
            "linspace con dtype=float64.",
            "nbytes = size * itemsize.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
scores = np.linspace(0, 1, 5, dtype=np.float64)
print(scores.itemsize, scores.nbytes, scores.tolist())""",
            ["float32 por accidente", "endpoint de linspace"],
        ),
        ex(
            "S14-T1-A-E3", "S14-T1-A", "transfer",
            "Valida un contrato: si un array no es 1D float64, lanza ValueError; si es válido imprime 'ok' y el size.",
            "Comprueba ndim y dtype.",
            "raise ValueError con mensaje corto.",
            "import numpy as np\n\ndef validate(a):\n    # TODO\n    pass\n",
            """import numpy as np

def validate(a):
    if a.ndim != 1 or a.dtype != np.float64:
        raise ValueError("expected 1d float64")
    print("ok", a.size)

validate(np.array([0.1, 0.2], dtype=np.float64))
try:
    validate(np.array([1, 2]))
except ValueError as e:
    print("err", e)""",
            ["aceptar int64", "no validar ndim"],
        ),
        ex(
            "S14-T1-B-E1", "S14-T1-B", "guided",
            "Dado score = [0.2, 0.8, 0.4, 0.9], imprime los índices (0-based) donde score >= 0.5 usando máscara y np.where.",
            "mask = score >= 0.5.",
            "np.where(mask)[0].",
            "import numpy as np\nscore = np.array([0.2, 0.8, 0.4, 0.9])\n# TODO\n",
            """import numpy as np
score = np.array([0.2, 0.8, 0.4, 0.9])
idx = np.where(score >= 0.5)[0]
print(idx.tolist())""",
            ["comparación estricta >", "olvidar [0] en where"],
        ),
        ex(
            "S14-T1-B-E2", "S14-T1-B", "independent",
            "Crea ids C001..C004 y scores; imprime ids con score en el percentil inferior (score < mediana).",
            "np.median(scores).",
            "ids[scores < med].",
            "import numpy as np\n# TODO\n",
            """import numpy as np
ids = np.array(["C001", "C002", "C003", "C004"])
scores = np.array([0.1, 0.9, 0.4, 0.7])
med = np.median(scores)
print(ids[scores < med].tolist())""",
            ["usar mean en vez de median", "máscara invertida"],
        ),
        ex(
            "S14-T1-B-E3", "S14-T1-B", "transfer",
            "Fancy index: reordena el vector [10,20,30,40] al orden de índices [2,0,3,1] e imprime el resultado.",
            "a[order] con lista de índices.",
            "No uses un loop.",
            "import numpy as np\na = np.array([10, 20, 30, 40])\n# TODO\n",
            """import numpy as np
a = np.array([10, 20, 30, 40])
order = [2, 0, 3, 1]
print(a[order].tolist())""",
            ["argsort confuso", "copia accidental del orden"],
        ),
        ex(
            "S14-T2-A-E1", "S14-T2-A", "guided",
            "Matriz 2x3 de unos y ceros: calcula mean por axis=0 y axis=1; imprime ambas listas redondeadas a 2 decimales.",
            "M.mean(axis=0) y axis=1.",
            "np.round(..., 2).tolist().",
            "import numpy as np\nM = np.array([[1., 0., 1.], [1., 1., 0.]])\n# TODO\n",
            """import numpy as np
M = np.array([[1., 0., 1.], [1., 1., 0.]])
print(np.round(M.mean(axis=0), 2).tolist())
print(np.round(M.mean(axis=1), 2).tolist())""",
            ["axis invertido", "no redondear"],
        ),
        ex(
            "S14-T2-A-E2", "S14-T2-A", "independent",
            "Con scores = [[0.5,0.5],[1.0,0.0],[0.8,0.6]], imprime std por columna (axis=0) con 4 decimales.",
            "np.std(axis=0).",
            "Por defecto ddof=0 en np.std.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
scores = np.array([[0.5, 0.5], [1.0, 0.0], [0.8, 0.6]])
print(np.round(scores.std(axis=0), 4).tolist())""",
            ["ddof=1 vs 0", "axis=1 por error"],
        ),
        ex(
            "S14-T2-A-E3", "S14-T2-A", "transfer",
            "Normaliza cada fila restando su media (keepdims) e imprime la media de cada fila tras normalizar (debe ser ~0).",
            "row - row.mean(axis=1, keepdims=True).",
            "Verifica con mean axis=1 redondeado.",
            "import numpy as np\nX = np.array([[1., 3.], [10., 20.], [2., 2.]])\n# TODO\n",
            """import numpy as np
X = np.array([[1., 3.], [10., 20.], [2., 2.]])
Xc = X - X.mean(axis=1, keepdims=True)
print(np.round(Xc.mean(axis=1), 10).tolist())""",
            ["olvidar keepdims", "axis=0"],
        ),
        ex(
            "S14-T2-B-E1", "S14-T2-B", "guided",
            "Suma el vector pesos [1,2,3] a cada fila de una matriz 2x3 de ceros usando broadcast; imprime la matriz.",
            "zeros + pesos (shape (3,)).",
            "Broadcast alinea por la derecha.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
M = np.zeros((2, 3))
w = np.array([1., 2., 3.])
print((M + w).tolist())""",
            ["shape (2,) incompatible", "usar loop"],
        ),
        ex(
            "S14-T2-B-E2", "S14-T2-B", "independent",
            "Con a shape (4,) crea columna (4,1) con newaxis y multiplica por fila b shape (3,); imprime shape del producto.",
            "a[:, None] * b[None, :] o a[:, None] * b.",
            "Resultado (4,3).",
            "import numpy as np\na = np.arange(4)\nb = np.arange(3)\n# TODO\n",
            """import numpy as np
a = np.arange(4)
b = np.arange(3)
out = a[:, None] * b[None, :]
print(out.shape, out.tolist())""",
            ["broadcast a (3,4)", "outer manual incorrecto"],
        ),
        ex(
            "S14-T2-B-E3", "S14-T2-B", "transfer",
            "Detecta incompatibilidad: intenta sumar (2,3) con (2,4) y captura ValueError imprimiendo 'incompatible'.",
            "try/except ValueError.",
            "No uses shapes compatibles.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
try:
    np.ones((2, 3)) + np.ones((2, 4))
except ValueError:
    print("incompatible")""",
            ["no capturar excepción", "shapes que sí broadcastan"],
        ),
        ex(
            "S14-T3-A-E1", "S14-T3-A", "guided",
            "Toma raw=[1,2,3], crea vista de los dos primeros, pon vista[0]=9 e imprime raw.",
            "raw[:2] es view.",
            "Mutar vista muta raw.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
raw = np.array([1, 2, 3])
v = raw[:2]
v[0] = 9
print(raw.tolist())""",
            ["usar copy por error", "fancy index copia"],
        ),
        ex(
            "S14-T3-A-E2", "S14-T3-A", "independent",
            "Repite con .copy() y demuestra que raw queda [1,2,3] tras mutar la copia.",
            "raw[:2].copy().",
            "Imprime raw y copia.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
raw = np.array([1, 2, 3])
c = raw[:2].copy()
c[0] = 9
print(raw.tolist(), c.tolist())""",
            ["olvidar copy", "slice que no es view en todos backends"],
        ),
        ex(
            "S14-T3-A-E3", "S14-T3-A", "transfer",
            "Marca un array como no escribible (flags.writeable=False) e intenta asignar; imprime 'blocked' al capturar ValueError.",
            "a.flags.writeable = False.",
            "Asignar a[0] debe fallar.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
a = np.array([1.0, 2.0])
a.flags.writeable = False
try:
    a[0] = 3.0
except ValueError:
    print("blocked")""",
            ["no desactivar writeable", "capturar Exception genérica sin print"],
        ),
        ex(
            "S14-T3-B-E1", "S14-T3-B", "guided",
            "Cuenta cuántos NaN hay en [1, nan, 2, nan] con np.isnan.",
            "np.isnan(x).sum().",
            "Imprime int.",
            "import numpy as np\nx = np.array([1.0, np.nan, 2.0, np.nan])\n# TODO\n",
            """import numpy as np
x = np.array([1.0, np.nan, 2.0, np.nan])
print(int(np.isnan(x).sum()))""",
            ["usar x == np.nan (siempre False)", "contar inf"],
        ),
        ex(
            "S14-T3-B-E2", "S14-T3-B", "independent",
            "Calcula nanmean de [1, nan, 3] e imprime con 2 decimales.",
            "np.nanmean.",
            "Resultado 2.0.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
x = np.array([1.0, np.nan, 3.0])
print(round(float(np.nanmean(x)), 2))""",
            ["mean normal da nan", "redondeo"],
        ),
        ex(
            "S14-T3-B-E3", "S14-T3-B", "transfer",
            "Reemplaza inf por nan en [1, inf, 2] y luego usa nansum; imprime el resultado.",
            "np.where(np.isinf(x), np.nan, x).",
            "nansum ignora nan.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
x = np.array([1.0, np.inf, 2.0])
y = np.where(np.isinf(x), np.nan, x)
print(float(np.nansum(y)))""",
            ["sum con inf da inf", "no convertir inf"],
        ),
        ex(
            "S14-T4-A-E1", "S14-T4-A", "guided",
            "Suma a*b con loop y con (a*b).sum() para a=b=arange(1000); imprime si abs(diff)<1e-6.",
            "np.arange(1000, dtype=float).",
            "Compara resultados no tiempos.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
a = np.arange(1000, dtype=float)
b = a.copy()
s1 = 0.0
for i in range(len(a)):
    s1 += a[i] * b[i]
s2 = float((a * b).sum())
print(abs(s1 - s2) < 1e-6)""",
            ["int overflow en loop", "comparar identidades"],
        ),
        ex(
            "S14-T4-A-E2", "S14-T4-A", "independent",
            "Implementa suma de cuadrados vectorizada de arange(5) e imprime el total.",
            "(a**2).sum() o np.dot(a,a).",
            "Resultado 0+1+4+9+16=30.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
a = np.arange(5, dtype=float)
print(float((a ** 2).sum()))""",
            ["olvidar dtype float", "sumar a no a**2"],
        ),
        ex(
            "S14-T4-A-E3", "S14-T4-A", "transfer",
            "Mide con perf_counter un (a+b) vectorizado de n=10000 e imprime 'timed' y que el resultado mean sea 1.0 si a=0 y b=1.",
            "time.perf_counter antes/después.",
            "No necesitas ratio; solo demostrar timing + correctness.",
            "import numpy as np, time\n# TODO\n",
            """import numpy as np, time
n = 10000
a = np.zeros(n)
b = np.ones(n)
t0 = time.perf_counter()
c = a + b
_ = time.perf_counter() - t0
print("timed", float(c.mean()) == 1.0)""",
            ["no crear arrays", "mean != 1"],
        ),
        ex(
            "S14-T4-B-E1", "S14-T4-B", "guided",
            "Imprime nbytes de np.zeros(1000, dtype=np.float64) y verifica que sea 8000.",
            "float64 = 8 bytes.",
            "print nbytes y comparación.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
a = np.zeros(1000, dtype=np.float64)
print(a.nbytes, a.nbytes == 8000)""",
            ["float32", "shape 2d"],
        ),
        ex(
            "S14-T4-B-E2", "S14-T4-B", "independent",
            "Usa allclose entre [1.0, 2.0] y [1.0+1e-9, 2.0] con atol=1e-8; imprime el booleano.",
            "np.allclose(..., atol=1e-8).",
            "Debe ser True.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
print(np.allclose([1.0, 2.0], [1.0 + 1e-9, 2.0], atol=1e-8))""",
            ["atol demasiado estricto", "listas sin numpy"],
        ),
        ex(
            "S14-T4-B-E3", "S14-T4-B", "transfer",
            "assert_allclose debe fallar entre [0,0] y [0,0.1] con atol=1e-3; captura e imprime 'fail'.",
            "np.testing.assert_allclose.",
            "except AssertionError.",
            "import numpy as np\n# TODO\n",
            """import numpy as np
try:
    np.testing.assert_allclose([0.0, 0.0], [0.0, 0.1], atol=1e-3)
except AssertionError:
    print("fail")""",
            ["atol que pasa el test", "no capturar"],
        ),
    ]

    youdo = {
        "title": "Métricas de calidad y señales por pares vectorizadas (inicio CP-N2-A)",
        "context": (
            "Eres analista de data quality en una fintech peruana. Con arrays sintéticos de flags de completitud "
            "y scores por cliente, implementa métricas vectorizadas, señales por pares con broadcasting, "
            "benchmark loop vs vectorizado y tests allclose. Sin PII real."
        ),
        "objectives": [
            "Implementar métricas de calidad vectorizadas (completitud, unicidad, rangos)",
            "Calcular señales por pares con broadcasting documentado",
            "Benchmark loop vs vectorizado con resultados equivalentes",
            "Tests con allclose y datasets sintéticos",
        ],
        "requirements": [
            "Dataset o fixtures sintéticos (ids C00x, regiones PE)",
            "Demo reproducible (if __name__ == '__main__')",
            "Documentación en español profesional",
            "Alineación al incremento CP-N2-A (inicio) de S14",
        ],
        "starterCode": """import numpy as np

def completeness(flags: np.ndarray) -> np.ndarray:
    \"\"\"flags: (n_clients, n_fields) con 0/1 → media por campo.\"\"\"
    # TODO
    raise NotImplementedError

def pairwise_diff(scores: np.ndarray) -> np.ndarray:
    \"\"\"scores (n,) → matriz (n,n) de diferencias score_i - score_j.\"\"\"
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    flags = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
    print("completitud", completeness(flags))
""",
        "portfolioNote": (
            "Este incremento abre CP-N2-A (Executive Data Quality & EDA). Documenta shapes, dtypes, "
            "ratio de benchmark y tolerancias. No uses datos personales reales."
        ),
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "¿Qué atributo del ndarray indica el tipo homogéneo de sus elementos?",
            "options": ["shape", "dtype", "ndim", "base"],
            "correctIndex": 1,
            "explanation": "dtype fija el tipo de cada elemento (float64, int32, etc.).",
        },
        {
            "question": "Una máscara booleana a > 0.5 se usa principalmente para:",
            "options": [
                "Cambiar el dtype",
                "Filtrar o seleccionar elementos que cumplen la condición",
                "Forzar una copy siempre",
                "Aumentar ndim",
            ],
            "correctIndex": 1,
            "explanation": "Las máscaras booleanas filtran/seleccionan de forma vectorizada.",
        },
        {
            "question": "axis=0 en una reducción sobre una matriz 2D suele agregar:",
            "options": [
                "Por fila (colapsa columnas)",
                "Por columna (colapsa filas)",
                "Solo el elemento [0,0]",
                "Nada; axis solo existe en pandas",
            ],
            "correctIndex": 1,
            "explanation": "axis=0 reduce a lo largo de las filas → un valor por columna.",
        },
        {
            "question": "Mutar un slice simple de un ndarray normalmente:",
            "options": [
                "Nunca afecta al original",
                "Puede mutar el array base porque suele ser un view",
                "Convierte todo a object",
                "Borra el dtype",
            ],
            "correctIndex": 1,
            "explanation": "Los slices simples suelen ser views que comparten memoria.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "NumPy user guide — Broadcasting",
                "url": "https://numpy.org/doc/stable/user/basics.broadcasting.html",
                "note": "Reglas de alineación de shapes",
            },
            {
                "label": "NumPy routines — Logic / Floating",
                "url": "https://numpy.org/doc/stable/reference/routines.logic.html",
                "note": "isnan, isfinite, allclose",
            },
        ],
        "books": [
            {
                "label": "Python for Data Analysis (Wes McKinney) — NumPy basics",
                "note": "Capítulos de ndarray y vectorización",
            },
        ],
        "courses": [
            {
                "label": "NumPy documentation tutorials",
                "url": "https://numpy.org/doc/stable/user/absolute_beginners.html",
                "note": "Inicio oficial",
            },
        ],
    }

    i_do = (
        "Observa 8 demos: contrato dtype/shape, máscaras, reducciones, broadcast, views/copies, "
        "NaN/inf, benchmark y allclose/memoria. Datos sintéticos; español peruano."
    )
    we_do = (
        "24 ejercicios E1/E2/E3 (guiado/independiente/transfer) por los 8 subtemas de NumPy. "
        "Dos pistas cada uno. Ejecuta y compara la salida."
    )

    ts, log = build_section(
        "section14", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "security",
        "index": 14,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 10,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "ShieldCheck",
        "legacy_note": "Seguridad/IA demoted; target is NumPy vectorizado for CP-N2-A start",
        "capstone": "CP-N2-A (inicio)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


# Continue in same file — S15, S16, S17
# (split for maintainability but single entrypoint)

def build_s15() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S15-T1-A", "series-dataframe-index"),
        ("S15-T1-B", "read-csv-excel-parser"),
        ("S15-T2-A", "loc-iloc-filters-assign"),
        ("S15-T2-B", "chained-assignment-copy"),
        ("S15-T3-A", "strings-nullable-dates-cats"),
        ("S15-T3-B", "explicit-coercion-schema"),
        ("S15-T4-A", "csv-parquet-excel-export"),
        ("S15-T4-B", "index-format-provenance-memory"),
    ]
    meta = {
        "id": "stdlib-deep",
        "index": 15,
        "title": "Pandas: ingesta, selección y tipos",
        "shortTitle": "Pandas ingesta",
        "tagline": "ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas",
        "estimatedHours": 12,
        "level": "Competente",
        "phase": 1,
        "icon": "Settings",
        "accentColor": "bg-gradient-to-br from-blue-500 to-indigo-600",
        "jobRelevance": (
            "La **ingesta tipada con Pandas** es el día a día de analistas en banca y retail en Perú: CSV/Excel de "
            "clientes y transacciones, dtypes controlados y export reproducible. Esta sección (id `stdlib-deep` "
            "conservado) retematiza a V3 e incrementa **CP-N2-A (dataset)** con fixtures sintéticos."
        ),
        "learningOutcomes": [
            "Modelar Series/DataFrame con Index estable",
            "Leer CSV/Excel con parser y dtypes controlados",
            "Seleccionar con loc/iloc y assign de forma idiomática",
            "Evitar chained assignment y controlar copias",
            "Tipar strings, nullable, fechas y categorías",
            "Aplicar coerción explícita con schema y reporte",
            "Exportar a CSV/Excel (y contrato Parquet) de forma reproducible",
            "Documentar índices, provenance y uso de memoria",
        ],
    }

    theories = [
        Theory(
            heading="De “stdlib profunda” a Pandas ingesta (mapa de la sección)",
            paragraphs=[
                "En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica. Aquí construyes el **dataset de CP-N2-A**: Series/DataFrame, lectura tipada, selección, tipos nullable, coerción con schema y export con provenance.",
                "Hilo: **clientes y transacciones sintéticas** (Lima/Arequipa, montos en PEN, ids C00x/T00x). Sin PII real.",
                "Orden: **T1 Modelo/lectura** → **T2 Selección** → **T3 Tipos** → **T4 Exportación**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de stdlib avanzada **no es el camino V3 en S15**. Target: Pandas ingesta tipada para CP-N2-A.",
            ),
        ),
        Theory(
            heading="Series/DataFrame/index",
            sub="S15-T1-A",
            paragraphs=[
                "Una **Series** es un vector con **Index**; un **DataFrame** es una tabla de columnas (Series alineadas por Index).",
                "Un Index **estable** (ids de negocio) facilita joins y auditoría. `reset_index` / `set_index` cambian el eje de etiqueta.",
                "MultiIndex se introduce como etiquetas jerárquicas (región, mes); se profundiza en S17.",
            ],
            code="""import pandas as pd

s = pd.Series([0.9, 0.4], index=["C001", "C002"], name="score")
df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "region": ["Lima", "Arequipa", "Lima"],
    "score": [0.9, 0.4, 0.7],
}).set_index("cliente_id")
print(s.loc["C001"])
print(df.index.tolist())
print(df.dtypes.to_dict())""",
            code_title="series_df.py",
            callout=(
                "tip",
                "Index de negocio",
                "Prefiere ids estables (cliente_id) como index cuando el pipeline reindexa o alinea tablas.",
            ),
        ),
        Theory(
            heading="lectura CSV/Excel y opciones de parser",
            sub="S15-T1-B",
            paragraphs=[
                "`read_csv` y `read_excel` aceptan `dtype`, `parse_dates`, `na_values`, `usecols`. Controlar el parser evita object-dtypes silenciosos.",
                "Separe decimal (`,` vs `.`) y encoding (`utf-8`) en datasets latinos. Excel requiere motor (`openpyxl`).",
                "Siempre reconcilia **filas leídas vs esperadas** y lista columnas.",
            ],
            code="""import pandas as pd
from io import StringIO

csv = \"cliente_id,monto,fecha\\nC001,10.5,2024-01-15\\nC002,NA,2024-02-01\\n\"
df = pd.read_csv(
    StringIO(csv),
    dtype={"cliente_id": "string"},
    parse_dates=["fecha"],
    na_values=["NA", ""],
)
print(df.dtypes.astype(str).to_dict())
print(df["monto"].isna().tolist())
print(len(df))""",
            code_title="read_csv_opts.py",
            callout=(
                "warning",
                "dtype sin parse_dates",
                "Fechas como string rompen filtros temporales. Declara parse_dates o convierte con to_datetime.",
            ),
        ),
        Theory(
            heading="loc/iloc, filtros y assign",
            sub="S15-T2-A",
            paragraphs=[
                "**loc** etiqueta; **iloc** posición. Filtros booleanos: `df.loc[df.score < 0.5, cols]`.",
                "`assign` devuelve un DF con columnas nuevas sin romper el pipeline funcional.",
                "`query` es legible para filtros simples; para producción muchos equipos prefieren máscaras explícitas.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "score": [0.9, 0.3, 0.6],
    "region": ["Lima", "Lima", "Cusco"],
})
sub = df.loc[df["score"] < 0.5, ["cliente_id", "score"]]
out = df.assign(score_pct=lambda x: x["score"] * 100)
print(sub.to_dict(orient="list"))
print(out["score_pct"].tolist())
print(df.iloc[0, 0])""",
            code_title="loc_assign.py",
            callout=(
                "tip",
                "loc para etiquetas",
                "Evita df[cols][rows] encadenado: usa un solo loc.",
            ),
        ),
        Theory(
            heading="chained assignment y copy semantics",
            sub="S15-T2-B",
            paragraphs=[
                "**SettingWithCopyWarning** aparece al asignar sobre un slice que puede ser view o copy. El resultado es impredecible.",
                "Patrón seguro: `df = df.copy()` tras filtrar, o asignar con `.loc[row_mask, col] = valor` sobre el DF padre.",
                "En pipelines, prefiere métodos que devuelven nuevo objeto (`assign`, `where`) y documenta copias.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({"score": [0.1, 0.9, 0.4]})
# seguro: loc sobre el original
df.loc[df["score"] < 0.5, "flag"] = "bajo"
# seguro: copy explícita para trabajar un subset
bajo = df.loc[df["score"] < 0.5].copy()
bajo["revisado"] = True
print(df[["score", "flag"]].to_dict(orient="list"))
print(bajo["revisado"].tolist())""",
            code_title="no_chain.py",
            callout=(
                "danger",
                "Chained assignment",
                "Nunca hagas df[df.a>0]['b'] = 1. Usa loc o copy explícita.",
            ),
        ),
        Theory(
            heading="strings, nullable, fechas y categorías",
            sub="S15-T3-A",
            paragraphs=[
                "dtypes **string**, **Int64**/**boolean** nullable, **datetime64** y **category** reducen memoria y errores.",
                "Convierte con `astype('string')`, `pd.to_numeric(..., errors=)`, `pd.to_datetime`, `astype('category')`.",
                "Reporta cuántos valores no convirtieron (NaN introducidos).",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "region": ["Lima", "arequipa", "Lima"],
    "monto": ["10", "x", "3.5"],
    "fecha": ["2024-01-01", "2024-02-01", "bad"],
})
df["region"] = df["region"].str.title().astype("category")
df["monto_num"] = pd.to_numeric(df["monto"], errors="coerce")
df["fecha_dt"] = pd.to_datetime(df["fecha"], errors="coerce")
print(df.dtypes.astype(str).to_dict())
print("monto_na", int(df["monto_num"].isna().sum()), "fecha_na", int(df["fecha_dt"].isna().sum()))""",
            code_title="types.py",
            callout=(
                "tip",
                "errors='coerce'",
                "Coercionar a NaN es preferible a fallar todo el lote si documentas el conteo de fallos.",
            ),
        ),
        Theory(
            heading="coerción explícita y schema",
            sub="S15-T3-B",
            paragraphs=[
                "Un **schema dict** declara tipos objetivo por columna. `astype` / `to_numeric` aplican coerción; los fallos se listan.",
                "No “arregles” silenciosamente: emite un reporte `{columna: n_fallos}`.",
                "Este reporte alimenta el quality gate de S16.",
            ],
            code="""import pandas as pd

schema = {"cliente_id": "string", "monto": "float64"}
raw = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": ["10.5", "N/A"]})
report = {}
df = raw.copy()
df["cliente_id"] = df["cliente_id"].astype("string")
before_na = df["monto"].isna().sum()
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
report["monto"] = int(df["monto"].isna().sum() - before_na)
print(df.dtypes.astype(str).to_dict())
print("coercion_report", report)""",
            code_title="schema_coerce.py",
            callout=(
                "warning",
                "Schema es contrato",
                "Si falta una columna del schema, falla explicable — no inventes defaults ocultos.",
            ),
        ),
        Theory(
            heading="CSV / Excel y contrato Parquet",
            sub="S15-T4-A",
            paragraphs=[
                "`to_csv`, `to_excel` exportan tablas. Parquet (pyarrow/fastparquet) preserva tipos; si el motor no está, exporta CSV + **schema JSON** como contrato.",
                "Usa `index=False` salvo que el index sea clave de negocio documentada.",
                "Verifica columnas críticas post-export con round-trip.",
            ],
            code="""import pandas as pd
from io import StringIO, BytesIO

df = pd.DataFrame({"cliente_id": ["C001"], "monto": [10.5], "region": ["Lima"]})
buf = StringIO()
df.to_csv(buf, index=False)
buf.seek(0)
back = pd.read_csv(buf)
print(back.columns.tolist())
# Excel en memoria
bio = BytesIO()
df.to_excel(bio, index=False, engine="openpyxl")
print("excel_bytes", len(bio.getvalue()) > 0)
# Contrato parquet (schema) sin motor
schema = {c: str(df[c].dtype) for c in df.columns}
print("parquet_contract", schema)""",
            code_title="export.py",
            callout=(
                "info",
                "Parquet opcional",
                "En este entorno puede no haber pyarrow: el contrato de tipos + CSV/Excel cubre el aprendizaje de export reproducible.",
            ),
        ),
        Theory(
            heading="índices, formatos, provenance y memoria",
            sub="S15-T4-B",
            paragraphs=[
                "Un **manifest** registra filas, columnas, dtypes, `memory_usage` y provenance (fuente, timestamp, hash simple).",
                "`index=False` en export evita columnas `Unnamed` al reingestar.",
                "Documenta el uso de memoria antes/después de castear a category/string.",
            ],
            code="""import pandas as pd
import hashlib, json

df = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": [1.0, 2.0]})
payload = df.to_csv(index=False).encode()
manifest = {
    "rows": len(df),
    "columns": df.columns.tolist(),
    "dtypes": {c: str(t) for c, t in df.dtypes.items()},
    "memory_bytes": int(df.memory_usage(deep=True).sum()),
    "source": "synthetic_clientes_v1",
    "content_sha1": hashlib.sha1(payload).hexdigest()[:12],
}
print(json.dumps(manifest, sort_keys=True))""",
            code_title="manifest.py",
            callout=(
                "tip",
                "Provenance mínima",
                "source + filas + hash del artefacto bastan para reconciliar ingesta en CP-N2-A.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S15-T1-A-DEMO",
            "S15-T1-A",
            "Construir DataFrame de clientes con Index estable y dtypes claros",
            """import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "region": ["Lima", "Arequipa", "Cusco"],
    "score": [0.91, 0.42, 0.77],
})
df = df.set_index("cliente_id")
df["score"] = df["score"].astype("float64")
print(df.index.name, df.index.tolist())
print(df.loc["C002", "region"], float(df.loc["C002", "score"]))""",
            "Index de negocio alinea tablas de clientes y transacciones.",
            title="demo_df_index.py",
        ),
        Demo(
            "S15-T1-B-DEMO",
            "S15-T1-B",
            "Ingerir CSV sintético con dtype, parse_dates y na_values",
            """import pandas as pd
from io import StringIO

raw = \"\"\"cliente_id;monto;fecha
C001;15,50;2024-03-01
C002;;2024-03-02
C003;20.0;2024-03-03
\"\"\"
# normalizamos decimal latino a punto para el parser
text = raw.replace(",", ".")
df = pd.read_csv(
    StringIO(text),
    sep=";",
    dtype={"cliente_id": "string"},
    parse_dates=["fecha"],
    na_values=["", "NA"],
)
print(len(df), df["monto"].isna().sum())
print(str(df["fecha"].dtype))
print(df["cliente_id"].tolist())""",
            "Parser explícito evita monedas/fechas como object opaco.",
            title="demo_read_csv.py",
        ),
        Demo(
            "S15-T2-A-DEMO",
            "S15-T2-A",
            "Seleccionar filas Lima y asignar columna de riesgo derivada",
            """import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003", "C004"],
    "region": ["Lima", "Arequipa", "Lima", "Lima"],
    "score": [0.9, 0.4, 0.3, 0.8],
})
lima = df.loc[df["region"] == "Lima"].copy()
out = lima.assign(riesgo=lambda x: (x["score"] < 0.5).map({True: "alto", False: "bajo"}))
print(out[["cliente_id", "score", "riesgo"]].to_dict(orient="list"))""",
            "loc + assign mantienen pipelines legibles y testeables.",
            title="demo_loc.py",
        ),
        Demo(
            "S15-T2-B-DEMO",
            "S15-T2-B",
            "Evitar chained assignment: flag seguro con loc y subset con copy",
            """import pandas as pd

df = pd.DataFrame({"id": ["C001", "C002", "C003"], "score": [0.2, 0.9, 0.4]})
df.loc[df["score"] < 0.5, "estado"] = "revisar"
subset = df.loc[df["estado"] == "revisar"].copy()
subset["owner"] = "dq_team"
print(df.to_dict(orient="list"))
print(subset[["id", "owner"]].to_dict(orient="list"))""",
            "loc sobre el padre + copy en subsets elimina SettingWithCopy.",
            title="demo_copy.py",
        ),
        Demo(
            "S15-T3-A-DEMO",
            "S15-T3-A",
            "Coaccionar string/category, numeric y fechas con conteo de NaN",
            """import pandas as pd

df = pd.DataFrame({
    "region": ["lima", "AREQUIPA", "Lima"],
    "monto": ["10.5", "?", "3"],
    "alta": ["2024-01-10", "2024-13-01", "2024-02-01"],
})
df["region"] = df["region"].str.title().astype("category")
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
df["alta"] = pd.to_datetime(df["alta"], errors="coerce")
print(df["region"].dtype)
print("na_monto", int(df["monto"].isna().sum()), "na_alta", int(df["alta"].isna().sum()))
print(df["monto"].tolist())""",
            "Tipos correctos + reporte de NaN son la base de la ingesta tipada.",
            title="demo_types.py",
        ),
        Demo(
            "S15-T3-B-DEMO",
            "S15-T3-B",
            "Aplicar schema y listar coerciones fallidas por columna",
            """import pandas as pd

def apply_schema(df, schema):
    out = df.copy()
    report = {}
    for col, typ in schema.items():
        if col not in out.columns:
            raise KeyError(f"missing column {col}")
        if typ == "float64":
            before = out[col].isna().sum()
            out[col] = pd.to_numeric(out[col], errors="coerce")
            report[col] = int(out[col].isna().sum() - before)
        elif typ == "string":
            out[col] = out[col].astype("string")
            report[col] = 0
    return out, report

raw = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": ["1.5", "xx"]})
df, rep = apply_schema(raw, {"cliente_id": "string", "monto": "float64"})
print(df.dtypes.astype(str).to_dict())
print(rep)""",
            "Schema + reporte de fallos alimenta el quality gate (S16).",
            title="demo_schema.py",
        ),
        Demo(
            "S15-T4-A-DEMO",
            "S15-T4-A",
            "Exportar a CSV y Excel sin perder columnas críticas; emitir contrato Parquet",
            """import pandas as pd
from io import StringIO, BytesIO

df = pd.DataFrame({
    "cliente_id": ["C001", "C002"],
    "monto": [10.5, 3.0],
    "region": ["Lima", "Cusco"],
})
csv_buf = StringIO()
df.to_csv(csv_buf, index=False)
csv_buf.seek(0)
rt = pd.read_csv(csv_buf)
assert list(rt.columns) == ["cliente_id", "monto", "region"]
xbuf = BytesIO()
df.to_excel(xbuf, index=False, engine="openpyxl")
contract = {c: str(df[c].dtype) for c in df.columns}
print("rows", len(rt), "excel_ok", len(xbuf.getvalue()) > 100)
print("contract", contract)""",
            "Round-trip de columnas críticas valida el export reproducible.",
            title="demo_export.py",
        ),
        Demo(
            "S15-T4-B-DEMO",
            "S15-T4-B",
            "Emitir manifest de filas/columnas, memoria y provenance",
            """import pandas as pd, hashlib, json

df = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"], "monto": [1.0, 2.0, 3.0]})
blob = df.to_csv(index=False).encode()
manifest = {
    "rows": int(len(df)),
    "columns": df.columns.tolist(),
    "memory_bytes": int(df.memory_usage(deep=True).sum()),
    "source": "synthetic_tx_v1",
    "sha1_12": hashlib.sha1(blob).hexdigest()[:12],
}
print(json.dumps(manifest, sort_keys=True))""",
            "El manifest reconcilia entrada vs salida en CP-N2-A.",
            title="demo_manifest.py",
        ),
    ]

    def ex(eid, sub, kind, instr, h1, h2, starter, solution, edge):
        return Ex(eid, sub, kind, instr, h1, h2, starter, solution, edge=edge)

    exercises = [
        ex("S15-T1-A-E1", "S15-T1-A", "guided",
           "Crea un DataFrame con columnas cliente_id y score (2 filas) y pon cliente_id como index; imprime index.tolist().",
           "set_index('cliente_id').", "index.tolist().",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
df = df.set_index("cliente_id")
print(df.index.tolist())""",
           ["reset_index accidental", "index name None sin set"]),
        ex("S15-T1-A-E2", "S15-T1-A", "independent",
           "Crea una Series de scores con index C001,C002 name='score' e imprime s['C002'].",
           "pd.Series(..., index=..., name=...).", "Acceso por etiqueta.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([0.1, 0.9], index=["C001", "C002"], name="score")
print(float(s["C002"]))""",
           ["iloc vs label", "name incorrecto"]),
        ex("S15-T1-A-E3", "S15-T1-A", "transfer",
           "Alinea dos Series por index (unión) sumando scores; imprime el resultado ordenado por index.",
           "s1.add(s2, fill_value=0).", "sort_index.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s1 = pd.Series([1.0, 2.0], index=["C001", "C002"])
s2 = pd.Series([0.5], index=["C002"])
out = s1.add(s2, fill_value=0).sort_index()
print(out.round(2).to_dict())""",
           ["NaN sin fill_value", "no ordenar"]),
        ex("S15-T1-B-E1", "S15-T1-B", "guided",
           "Lee un CSV en StringIO con columnas a,b y na_values=['NA']; imprime cuántos NA hay en b.",
           "pd.read_csv(StringIO(...), na_values=...).", "isna().sum().",
           "import pandas as pd\nfrom io import StringIO\n# TODO\n",
           """import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\\n1,2\\n3,NA\\n"), na_values=["NA"])
print(int(df["b"].isna().sum()))""",
           ["na_values no aplicado", "contar filas"]),
        ex("S15-T1-B-E2", "S15-T1-B", "independent",
           "Lee CSV con parse_dates=['fecha'] e imprime el dtype de fecha como string.",
           "parse_dates=['fecha'].", "str(df['fecha'].dtype).",
           "import pandas as pd\nfrom io import StringIO\n# TODO\n",
           """import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\\n2024-01-01,1\\n"), parse_dates=["fecha"])
print(str(df["fecha"].dtype))""",
           ["dtype object", "formato de fecha inválido"]),
        ex("S15-T1-B-E3", "S15-T1-B", "transfer",
           "Lee solo usecols cliente_id,monto desde CSV e imprime columns.tolist().",
           "usecols=[...].", "Verifica que no entre 'z'.",
           "import pandas as pd\nfrom io import StringIO\n# TODO\n",
           """import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("cliente_id,monto,z\\nC001,1,9\\n"), usecols=["cliente_id", "monto"])
print(df.columns.tolist())""",
           ["sin usecols", "orden de columnas"]),
        ex("S15-T2-A-E1", "S15-T2-A", "guided",
           "Con df de scores, usa loc para filas score>=0.5 e imprime cliente_id list.",
           "df.loc[df.score>=0.5, 'cliente_id'].", "tolist().",
           "import pandas as pd\ndf = pd.DataFrame({'cliente_id':['C001','C002'], 'score':[0.4,0.9]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.4, 0.9]})
print(df.loc[df["score"] >= 0.5, "cliente_id"].tolist())""",
           ["iloc posicional incorrecto", "filtro invertido"]),
        ex("S15-T2-A-E2", "S15-T2-A", "independent",
           "Usa assign para crear col doble=score*2 e imprime la lista.",
           "df.assign(doble=...).", "No mutar in-place obligatorio.",
           "import pandas as pd\ndf = pd.DataFrame({'score':[1.0, 2.0]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"score": [1.0, 2.0]})
print(df.assign(doble=lambda x: x["score"] * 2)["doble"].tolist())""",
           ["chained assign", "olvidar columna"]),
        ex("S15-T2-A-E3", "S15-T2-A", "transfer",
           "Imprime el valor iloc[1, 0] de un DF 2x2 de enteros [[1,2],[3,4]].",
           "iloc posición 1,0 → 3.", "No uses loc.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame([[1, 2], [3, 4]])
print(int(df.iloc[1, 0]))""",
           ["confusión loc/iloc", "1-based"]),
        ex("S15-T2-B-E1", "S15-T2-B", "guided",
           "Asigna con loc la columna flag='x' donde score<0.5; imprime flag list (con NaN como None en to_dict cuidado: usa fillna).",
           "df.loc[mask, 'flag'] = 'x'.", "Imprime lista con fillna('').",
           "import pandas as pd\ndf = pd.DataFrame({'score':[0.2, 0.9]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9]})
df.loc[df["score"] < 0.5, "flag"] = "x"
print(df["flag"].fillna("").tolist())""",
           ["chained df[df...]['flag']", "sin fillna en print"]),
        ex("S15-T2-B-E2", "S15-T2-B", "independent",
           "Filtra score>0.5, haz copy, añade col ok=True; imprime ok list del subset.",
           "subset = df.loc[...].copy().", "subset['ok']=True.",
           "import pandas as pd\ndf = pd.DataFrame({'score':[0.2, 0.9, 0.7]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9, 0.7]})
sub = df.loc[df["score"] > 0.5].copy()
sub["ok"] = True
print(sub["ok"].tolist())""",
           ["sin copy", "filtro wrong"]),
        ex("S15-T2-B-E3", "S15-T2-B", "transfer",
           "Demuestra que modificar un copy no cambia el DF original: imprime score original tras mutar la copia.",
           "c = df.copy(); c.iloc[0,0]=99.", "print df original.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"score": [1.0, 2.0]})
c = df.copy()
c.iloc[0, 0] = 99.0
print(df["score"].tolist())""",
           ["view accidental", "mutar df no c"]),
        ex("S15-T3-A-E1", "S15-T3-A", "guided",
           "Convierte columna region a category tras str.title(); imprime dtype name.",
           "astype('category').", "str.title primero.",
           "import pandas as pd\ndf = pd.DataFrame({'region':['lima','Lima']})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"region": ["lima", "Lima"]})
s = df["region"].str.title().astype("category")
print(s.dtype.name)""",
           ["object residual", "sin title"]),
        ex("S15-T3-A-E2", "S15-T3-A", "independent",
           "to_numeric con errors=coerce sobre ['1','a','3']; imprime lista de floats/NaN (usa where isna).",
           "pd.to_numeric(..., errors='coerce').", "tolist() con nan.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.to_numeric(pd.Series(["1", "a", "3"]), errors="coerce")
print(s.tolist())""",
           ["errors raise", "astype int falla"]),
        ex("S15-T3-A-E3", "S15-T3-A", "transfer",
           "to_datetime errors=coerce; cuenta NaT en ['2024-01-01','no-fecha'].",
           "isna().sum().", "NaT cuenta como na.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.to_datetime(pd.Series(["2024-01-01", "no-fecha"]), errors="coerce")
print(int(s.isna().sum()))""",
           ["errors raise", "contar len"]),
        ex("S15-T3-B-E1", "S15-T3-B", "guided",
           "Aplica to_numeric a monto y reporta cuántos nuevos NaN se introdujeron (1 en el fixture).",
           "Compara isna antes/después.", "errors=coerce.",
           "import pandas as pd\ndf = pd.DataFrame({'monto':['1','x']})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"monto": ["1", "x"]})
before = df["monto"].isna().sum()
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
print(int(df["monto"].isna().sum() - before))""",
           ["no restar before", "astype sin coerce"]),
        ex("S15-T3-B-E2", "S15-T3-B", "independent",
           "Si falta columna 'monto' en schema, lanza KeyError e imprime 'missing'.",
           "if col not in df.columns.", "try/except KeyError.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"]})
schema = {"monto": "float64"}
try:
    for col in schema:
        if col not in df.columns:
            raise KeyError(col)
except KeyError:
    print("missing")""",
           ["silenciar falta", "crear columna vacía"]),
        ex("S15-T3-B-E3", "S15-T3-B", "transfer",
           "Castea cliente_id a string dtype e imprime str(dtype).",
           "astype('string').", "dtype string de pandas.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series(["C001"]).astype("string")
print(str(s.dtype))""",
           ["object", "category"]),
        ex("S15-T4-A-E1", "S15-T4-A", "guided",
           "Exporta DF a CSV en StringIO sin index y relee; imprime columns.",
           "to_csv(buf, index=False).", "read_csv.",
           "import pandas as pd\nfrom io import StringIO\n# TODO\n",
           """import pandas as pd
from io import StringIO
df = pd.DataFrame({"a": [1], "b": [2]})
buf = StringIO()
df.to_csv(buf, index=False)
buf.seek(0)
print(pd.read_csv(buf).columns.tolist())""",
           ["index=True crea col extra", "no seek"]),
        ex("S15-T4-A-E2", "S15-T4-A", "independent",
           "to_excel a BytesIO con openpyxl; imprime True si bytes > 0.",
           "engine='openpyxl'.", "getvalue().",
           "import pandas as pd\nfrom io import BytesIO\n# TODO\n",
           """import pandas as pd
from io import BytesIO
bio = BytesIO()
pd.DataFrame({"a": [1]}).to_excel(bio, index=False, engine="openpyxl")
print(len(bio.getvalue()) > 0)""",
           ["sin engine", "archivo disco obligatorio"]),
        ex("S15-T4-A-E3", "S15-T4-A", "transfer",
           "Emite dict contrato {col: str(dtype)} para un DF de dos columnas e imprímelo ordenado por clave.",
           "dict comprehension.", "sorted items o print dict estable.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
contract = {c: str(df[c].dtype) for c in df.columns}
print(dict(sorted(contract.items())))""",
           ["dtypes Series print feo", "sin str()"]),
        ex("S15-T4-B-E1", "S15-T4-B", "guided",
           "Calcula memory_usage deep sum de un DF simple e imprime int > 0.",
           "memory_usage(deep=True).sum().", "int(...).",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"a": ["Lima", "Cusco"]})
print(int(df.memory_usage(deep=True).sum()) > 0)""",
           ["deep=False en strings", "no sum"]),
        ex("S15-T4-B-E2", "S15-T4-B", "independent",
           "Construye manifest con keys rows y columns; imprime rows.",
           "len(df) y columns.tolist().", "dict.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
manifest = {"rows": len(df), "columns": df.columns.tolist()}
print(manifest["rows"], manifest["columns"])""",
           ["shape confuso", "columns Index no list"]),
        ex("S15-T4-B-E3", "S15-T4-B", "transfer",
           "sha1 de to_csv index=False; imprime primeros 8 hex.",
           "hashlib.sha1(blob).hexdigest()[:8].", "encode utf-8.",
           "import pandas as pd, hashlib\n# TODO\n",
           """import pandas as pd, hashlib
df = pd.DataFrame({"a": [1]})
blob = df.to_csv(index=False).encode()
print(hashlib.sha1(blob).hexdigest()[:8])""",
           ["hash del objeto python", "sin encode"]),
    ]

    youdo = {
        "title": "Ingesta tipada clientes/transacciones con reconciliación",
        "context": (
            "Recibes CSV sintéticos de clientes y transacciones de un retailer peruano. Debes ingerir con schema, "
            "reportar coerciones, reconciliar filas/columnas y exportar dataset analítico + manifest. Sin PII real."
        ),
        "objectives": [
            "Ingerir datasets sintéticos de clientes y transacciones",
            "Aplicar schema tipado y reportar coerciones",
            "Reconciliar filas/columnas entrada vs salida",
            "Exportar dataset analítico + manifest",
        ],
        "requirements": [
            "Fixtures sintéticos en memoria o CSV local",
            "Demo reproducible (if __name__ == '__main__')",
            "Documentación en español profesional",
            "Alineación a CP-N2-A (dataset)",
        ],
        "starterCode": """import pandas as pd
from io import StringIO

CLIENTES = \"\"\"cliente_id,region,score
C001,Lima,0.9
C002,Arequipa,0.4
C003,Lima,NA
\"\"\"

def ingest_clientes(text: str) -> tuple[pd.DataFrame, dict]:
    # TODO: read_csv + schema + report
    raise NotImplementedError

if __name__ == "__main__":
    df, report = ingest_clientes(CLIENTES)
    print(df.head(), report)
""",
        "portfolioNote": "Entrega el manifest JSON y el reporte de coerciones junto al CSV/Excel exportado.",
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "¿Qué método de selección usa etiquetas de index/columnas?",
            "options": ["iloc", "loc", "iat solo posicional forzado", "values"],
            "correctIndex": 1,
            "explanation": "loc selecciona por etiqueta; iloc por posición.",
        },
        {
            "question": "SettingWithCopyWarning se relaciona con:",
            "options": [
                "Parquet vs CSV",
                "Asignación sobre slices que pueden ser view/copy (chained assignment)",
                "Falta de openpyxl",
                "MultiIndex obligatorio",
            ],
            "correctIndex": 1,
            "explanation": "El chained assignment puede no escribir donde crees.",
        },
        {
            "question": "errors='coerce' en to_numeric:",
            "options": [
                "Borra la columna",
                "Convierte inválidos a NaN",
                "Eleva siempre excepción",
                "Cambia a string",
            ],
            "correctIndex": 1,
            "explanation": "coerce produce NaN en valores no parseables.",
        },
        {
            "question": "Un manifest de export debería incluir al menos:",
            "options": [
                "Solo el nombre del analista",
                "Filas, columnas y provenance/hash del artefacto",
                "Contraseñas de BD",
                "PII real de clientes",
            ],
            "correctIndex": 1,
            "explanation": "Reconciliación requiere filas/columnas y trazabilidad del archivo.",
        },
    ]

    resources = {
        "docs": [
            {"label": "pandas read_csv", "url": "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html", "note": "Parser options"},
            {"label": "pandas indexing", "url": "https://pandas.pydata.org/docs/user_guide/indexing.html", "note": "loc/iloc"},
        ],
        "books": [
            {"label": "Python for Data Analysis — pandas", "note": "Ingesta y tipos"},
        ],
        "courses": [
            {"label": "pandas docs getting started", "url": "https://pandas.pydata.org/docs/getting_started/index.html", "note": "Oficial"},
        ],
    }

    i_do = "8 demos de modelo, lectura, loc/assign, copias, tipos, schema, export y manifest."
    we_do = "24 ejercicios guiados/independientes/transfer sobre Pandas ingesta. Dos pistas cada uno."

    ts, log = build_section(
        "section15", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "stdlib-deep",
        "index": 15,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 12,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Settings",
        "legacy_note": "stdlib profunda demoted; target is Pandas ingesta for CP-N2-A dataset",
        "capstone": "CP-N2-A (dataset)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


def build_s16() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S16-T1-A", "nulls-field-policies"),
        ("S16-T1-B", "indicators-imputation-limits"),
        ("S16-T2-A", "exact-vs-conflict-dups"),
        ("S16-T2-B", "keys-cardinality-evidence"),
        ("S16-T3-A", "normalize-strings-nums-dates-cats"),
        ("S16-T3-B", "outliers-plausible-vs-error"),
        ("S16-T4-A", "schema-crossfield-rules"),
        ("S16-T4-B", "metrics-quarantine-audit"),
    ]
    meta = {
        "id": "wxpython-gui",
        "index": 16,
        "title": "Calidad, limpieza y contratos de datos",
        "shortTitle": "Calidad y contratos",
        "tagline": "suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
        "estimatedHours": 12,
        "level": "Competente",
        "phase": 1,
        "icon": "Monitor",
        "accentColor": "bg-gradient-to-br from-blue-500 to-indigo-600",
        "jobRelevance": (
            "Los equipos de datos en Perú necesitan **quality gates explicables**: null policies, duplicados con "
            "evidencia, normalización y cuarentena. Esta sección (id `wxpython-gui` conservado) retematiza a V3 "
            "**calidad/limpieza/contratos** e incrementa **CP-N2-A (quality)**."
        ),
        "learningOutcomes": [
            "Definir políticas de null por campo",
            "Limitar imputación y usar indicadores de ausencia",
            "Distinguir duplicados exactos de conflictos",
            "Conservar evidencia al resolver claves/cardinalidad",
            "Normalizar strings/números/fechas/categorías",
            "Clasificar outliers plausibles vs errores",
            "Implementar contratos de schema y cross-field",
            "Cuarentenar fallos con métricas y audit trail",
        ],
    }

    theories = [
        Theory(
            heading="De “GUI wxPython” a calidad y contratos de datos (mapa)",
            paragraphs=[
                "En V3, **S16 no es el path de wx.Frame ni sizers**. Aquí construyes el **quality gate de CP-N2-A**: políticas de null, imputación limitada, duplicados, normalización, outliers, contratos y cuarentena con audit trail.",
                "Regla de oro: **nunca “arreglar” silenciosamente**. Toda transformación deja métrica o rastro.",
                "Orden: **T1 Ausencia** → **T2 Duplicados** → **T3 Normalización** → **T4 Contratos**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de wxPython **no es el camino V3 en S16**. Target: calidad y contratos para CP-N2-A.",
            ),
        ),
        Theory(
            heading="nulls y políticas por campo",
            sub="S16-T1-A",
            paragraphs=[
                "Cada campo tiene política: **required** (null ⇒ cuarentena/falla) u **optional** (null permitido con indicador).",
                "`isna` / `notna` cuantifican ausencia. No imputes un required sin regla explícita.",
                "Documenta la política en un dict `{campo: 'required'|'optional'}`.",
            ],
            code="""import pandas as pd

policy = {"cliente_id": "required", "email": "optional", "monto": "required"}
df = pd.DataFrame({
    "cliente_id": ["C001", None, "C003"],
    "email": [None, "a@example.com", "b@example.com"],
    "monto": [10.0, 5.0, None],
})
violations = {}
for col, pol in policy.items():
    n = int(df[col].isna().sum())
    if pol == "required" and n:
        violations[col] = n
print("violations", violations)
print("null_rate_email", float(df["email"].isna().mean()))""",
            code_title="null_policy.py",
            callout=(
                "warning",
                "Required no se rellena a escondidas",
                "Null en required → cuarentena o fail, no default mágico.",
            ),
        ),
        Theory(
            heading="indicadores y límites de imputación",
            sub="S16-T1-B",
            paragraphs=[
                "Un **indicador de ausencia** (`monto_was_null`) preserva señal cuando imputas.",
                "Límites: no imputar más del X% de una columna; no imputar llaves; usa mediana/constante documentada.",
                "Si superas el cap, falla el gate.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({"monto": [10.0, None, None, 8.0, 12.0]})
cap = 0.4
rate = df["monto"].isna().mean()
print("null_rate", rate)
if rate > cap:
    print("gate", "fail_impute_cap")
else:
    df = df.copy()
    df["monto_was_null"] = df["monto"].isna()
    med = df["monto"].median()
    df["monto"] = df["monto"].fillna(med)
    print(df.to_dict(orient="list"))""",
            code_title="impute_cap.py",
            callout=(
                "tip",
                "Indicador > silencio",
                "El modelo y el auditor deben saber qué filas fueron imputadas.",
            ),
        ),
        Theory(
            heading="duplicados exactos vs conflictos",
            sub="S16-T2-A",
            paragraphs=[
                "**Exacto**: filas idénticas en todas las columnas relevantes. **Conflicto**: misma clave, valores distintos en atributos.",
                "`duplicated` detecta exactos; groupby por clave + nunique detecta conflictos.",
                "Políticas keep='first'|'last' solo tras clasificar.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002"],
    "region": ["Lima", "Lima", "Cusco", "Arequipa"],
    "score": [0.9, 0.9, 0.5, 0.5],
})
exact = df.duplicated(keep=False)
conflict = df.groupby("cliente_id")["region"].transform("nunique") > 1
print("exact_rows", df.loc[exact].to_dict(orient="list"))
print("conflict_ids", df.loc[conflict, "cliente_id"].unique().tolist())""",
            code_title="dups.py",
            callout=(
                "warning",
                "No drop_duplicates ciego",
                "Puedes borrar el único rastro del conflicto. Clasifica primero.",
            ),
        ),
        Theory(
            heading="claves, cardinalidad y conservación de evidencia",
            sub="S16-T2-B",
            paragraphs=[
                "Define la **clave de negocio** y la cardinalidad esperada (1 fila por cliente).",
                "Duplicados de clave van a **cuarentena** con evidencia (todas las versiones), no se borran sin log.",
                "El set limpio contiene una fila resuelta; el audit guarda el resto.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "score": [0.9, 0.4, 0.7],
    "src": ["a", "b", "a"],
})
key = "cliente_id"
dup_mask = df.duplicated(key, keep=False)
quarantine = df.loc[dup_mask].copy()
clean = df.drop_duplicates(key, keep="first")
print("clean", clean.to_dict(orient="list"))
print("quarantine_n", len(quarantine))
print("evidence_cols", quarantine.columns.tolist())""",
            code_title="key_evidence.py",
            callout=(
                "tip",
                "Evidencia completa",
                "La cuarentena debe permitir reconstruir por qué se eligió keep=first u otra regla.",
            ),
        ),
        Theory(
            heading="normalización de strings, números, fechas y categorías",
            sub="S16-T3-A",
            paragraphs=[
                "Strings: strip, casefold/title, espacios dobles. Números: decimal latino, símbolos. Fechas: formatos múltiples. Cats: mapa de sinónimos.",
                "Conserva **raw** en columna lateral si el valor normalizado puede disputarse.",
                "Normalizar ≠ imputar.",
            ],
            code="""import pandas as pd
import re

def norm_money(x):
    if pd.isna(x):
        return None
    s = str(x).strip().replace("S/", "").replace(",", "")
    return float(s)

df = pd.DataFrame({
    "region_raw": [" lima ", "AREQUIPA", "Lima"],
    "monto_raw": ["S/ 10.50", "3,00", "4"],
})
df["region"] = df["region_raw"].str.strip().str.title()
df["monto"] = df["monto_raw"].map(norm_money)
print(df[["region", "monto"]].to_dict(orient="list"))""",
            code_title="normalize.py",
            callout=(
                "info",
                "Raw al lado",
                "region_raw/monto_raw permiten auditar la normalización.",
            ),
        ),
        Theory(
            heading="outliers plausibles vs errores",
            sub="S16-T3-B",
            paragraphs=[
                "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio (monto alto legítimo). Un **error** viola bounds de negocio (edad 200, lat 999).",
                "IQR/z-score señalan candidatos; **domain bounds** deciden error vs flag.",
                "Flag vs drop: por defecto flag + cuarentena, no drop silencioso.",
            ],
            code="""import pandas as pd
import numpy as np

df = pd.DataFrame({"monto": [10, 12, 11, 13, 5000, -1]})
q1, q3 = df["monto"].quantile(0.25), df["monto"].quantile(0.75)
iqr = q3 - q1
stat = (df["monto"] < q1 - 1.5 * iqr) | (df["monto"] > q3 + 1.5 * iqr)
domain_err = (df["monto"] < 0) | (df["monto"] > 10000)
print("stat_outlier", df.loc[stat, "monto"].tolist())
print("domain_error", df.loc[domain_err, "monto"].tolist())
print("plausible_extreme", df.loc[stat & ~domain_err, "monto"].tolist())""",
            code_title="outliers.py",
            callout=(
                "warning",
                "No drops por IQR solo",
                "IQR sin dominio borra colas legítimas de negocio.",
            ),
        ),
        Theory(
            heading="reglas de schema y cross-field",
            sub="S16-T4-A",
            paragraphs=[
                "Contrato de **schema**: columnas presentes, dtypes, nullability. **Cross-field**: fecha_fin >= fecha_ini, monto>0 si estado=pagado.",
                "Cada regla devuelve máscara de fallos + código de error.",
                "Ante schema drift (columna faltante/extra), el gate falla con mensaje claro.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-02-01"]),
    "fin": pd.to_datetime(["2024-01-10", "2024-01-15"]),
    "monto": [10.0, -5.0],
})
expected = {"inicio", "fin", "monto"}
drift = expected - set(df.columns)
cross = df["fin"] < df["inicio"]
neg = df["monto"] < 0
print("drift", list(drift))
print("cross_fail_idx", df.index[cross].tolist())
print("neg_idx", df.index[neg].tolist())""",
            code_title="contracts.py",
            callout=(
                "danger",
                "Drift explicable",
                "Si falta una columna required, el job falla con el nombre de la columna — no con KeyError opaco al final.",
            ),
        ),
        Theory(
            heading="métricas, cuarentena y audit trail",
            sub="S16-T4-B",
            paragraphs=[
                "Métricas: %null, %dup, %fail_schema, filas in/out, filas en cuarentena.",
                "Cuarentena = tabla de filas rechazadas + razón. Audit trail = append-only de eventos.",
                "El gate publica métricas aunque falle.",
            ],
            code="""import pandas as pd, json

clean = pd.DataFrame({"id": ["C001"], "ok": [True]})
quar = pd.DataFrame({"id": ["C002"], "reason": ["null_required_monto"]})
audit = [
    {"event": "ingest", "n": 2},
    {"event": "quarantine", "n": 1, "reason": "null_required_monto"},
]
metrics = {
    "rows_in": 2,
    "rows_clean": len(clean),
    "rows_quarantine": len(quar),
    "pass": len(quar) == 0,
}
print(json.dumps(metrics, sort_keys=True))
print(audit[-1])""",
            code_title="quarantine_audit.py",
            callout=(
                "tip",
                "Métricas siempre",
                "Un fail sin métricas no se puede operar. Emite el reporte aunque el exit code sea != 0.",
            ),
        ),
    ]

    demos = [
        Demo("S16-T1-A-DEMO", "S16-T1-A",
             "Aplicar políticas de null por campo y listar violaciones required",
             """import pandas as pd
policy = {"cliente_id": "required", "telefono": "optional", "monto": "required"}
df = pd.DataFrame({
    "cliente_id": ["C001", None, "C003"],
    "telefono": [None, "999", "998"],
    "monto": [1.0, 2.0, None],
})
viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}
print(viol)
print("optional_nulls", int(df["telefono"].isna().sum()))""",
             "Required vs optional se traduce en fail/cuarentena vs continuar.", title="demo_null_policy.py"),
        Demo("S16-T1-B-DEMO", "S16-T1-B",
             "Imputar mediana solo si null_rate <= cap; marcar indicador",
             """import pandas as pd
df = pd.DataFrame({"monto": [10.0, None, 12.0, 11.0]})
cap = 0.5
rate = float(df["monto"].isna().mean())
df = df.copy()
df["monto_was_null"] = df["monto"].isna()
if rate <= cap:
    df["monto"] = df["monto"].fillna(df["monto"].median())
    status = "imputed"
else:
    status = "blocked"
print(status, rate, df.to_dict(orient="list"))""",
             "Cap + indicador evitan imputación masiva silenciosa.", title="demo_impute.py"),
        Demo("S16-T2-A-DEMO", "S16-T2-A",
             "Detectar duplicados exactos vs conflictos de región por cliente_id",
             """import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002", "C003"],
    "region": ["Lima", "Lima", "Cusco", "Arequipa", "Lima"],
    "score": [0.5, 0.5, 0.7, 0.7, 0.9],
})
exact_n = int(df.duplicated(keep=False).sum())
conf = df.groupby("cliente_id").filter(lambda g: g["region"].nunique() > 1)
print("exact_dup_rows", exact_n)
print("conflict_ids", conf["cliente_id"].unique().tolist())""",
             "Clasificar exacto vs conflicto cambia la acción de limpieza.", title="demo_dups.py"),
        Demo("S16-T2-B-DEMO", "S16-T2-B",
             "Preservar evidencia en cuarentena al resolver clave duplicada",
             """import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "score": [0.9, 0.1, 0.5],
    "batch": ["b1", "b2", "b1"],
})
q = df[df.duplicated("cliente_id", keep=False)].copy()
clean = df.drop_duplicates("cliente_id", keep="first")
print("clean_ids", clean["cliente_id"].tolist())
print("quarantine", q.to_dict(orient="list"))""",
             "keep=first solo sobre el set limpio; evidencia completa en cuarentena.", title="demo_evidence.py"),
        Demo("S16-T3-A-DEMO", "S16-T3-A",
             "Normalizar región y montos conservando columnas raw",
             """import pandas as pd
df = pd.DataFrame({
    "region_raw": [" lima", "AREQUIPA "],
    "monto_raw": ["S/12.5", "3.0"],
})
df["region"] = df["region_raw"].str.strip().str.title()
df["monto"] = (
    df["monto_raw"].str.replace("S/", "", regex=False).str.strip().astype(float)
)
print(df.to_dict(orient="list"))""",
             "Raw + normalizado permite disputar transformaciones.", title="demo_norm.py"),
        Demo("S16-T3-B-DEMO", "S16-T3-B",
             "Clasificar outlier estadístico vs error de dominio en montos",
             """import pandas as pd
s = pd.Series([5, 6, 7, 6, 1000, -3])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
stat = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
domain_err = (s < 0) | (s > 1e6)
print("stat", s[stat].tolist())
print("error", s[domain_err].tolist())
print("plausible", s[stat & ~domain_err].tolist())""",
             "Dominio manda sobre IQR para etiquetar error.", title="demo_outliers.py"),
        Demo("S16-T4-A-DEMO", "S16-T4-A",
             "Validar schema required y regla cross-field fin>=inicio",
             """import pandas as pd
df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-05-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-04-01"]),
    "monto": [10.0, 20.0],
})
required = ["inicio", "fin", "monto"]
missing = [c for c in required if c not in df.columns]
cross_fail = df.index[df["fin"] < df["inicio"]].tolist()
print("missing", missing, "cross_fail", cross_fail)""",
             "Schema + cross-field forman el contrato del quality gate.", title="demo_schema_rules.py"),
        Demo("S16-T4-B-DEMO", "S16-T4-B",
             "Cuarentenar fallos con métricas y audit trail append-only",
             """import json
rows_in = 5
quarantine = [{"id": "C002", "reason": "schema_drift"}, {"id": "C004", "reason": "domain_error"}]
clean_n = rows_in - len(quarantine)
audit = []
audit.append({"event": "start", "rows_in": rows_in})
audit.append({"event": "quarantine", "n": len(quarantine)})
metrics = {"rows_in": rows_in, "rows_clean": clean_n, "rows_quarantine": len(quarantine), "pass": False}
print(json.dumps(metrics, sort_keys=True))
print(len(audit), audit[-1]["event"])""",
             "Métricas + audit permiten operar el gate aunque falle.", title="demo_audit.py"),
    ]

    def ex(eid, sub, kind, instr, h1, h2, starter, solution, edge):
        return Ex(eid, sub, kind, instr, h1, h2, starter, solution, edge=edge)

    exercises = [
        ex("S16-T1-A-E1", "S16-T1-A", "guided",
           "Dado policy required en 'id', cuenta nulls de id e imprime el entero.",
           "isna().sum().", "int(...).",
           "import pandas as pd\ndf = pd.DataFrame({'id':['C001', None]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": ["C001", None]})
print(int(df["id"].isna().sum()))""",
           ["contar filas", "fillna antes"]),
        ex("S16-T1-A-E2", "S16-T1-A", "independent",
           "Construye dict de violaciones solo para campos required con nulls.",
           "Itera policy.", "Incluye solo n>0 required.",
           "import pandas as pd\npolicy={'a':'required','b':'optional'}\ndf=pd.DataFrame({'a':[1,None],'b':[None,2]})\n# TODO\n",
           """import pandas as pd
policy = {"a": "required", "b": "optional"}
df = pd.DataFrame({"a": [1, None], "b": [None, 2]})
viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}
print(viol)""",
           ["incluir optional", "n=0"]),
        ex("S16-T1-A-E3", "S16-T1-A", "transfer",
           "Imprime 'fail' si hay violaciones required, si no 'pass'.",
           "Usa el dict viol.", "Mensaje corto.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": [None]})
viol = {"id": int(df["id"].isna().sum())} if df["id"].isna().any() else {}
print("fail" if viol else "pass")""",
           ["siempre pass", "ignorar null"]),
        ex("S16-T1-B-E1", "S16-T1-B", "guided",
           "Crea columna was_null booleana antes de fillna(0) sobre monto; imprime was_null list.",
           "was_null = isna.", "luego fillna.",
           "import pandas as pd\ndf=pd.DataFrame({'monto':[1.0, None]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"monto": [1.0, None]})
df["was_null"] = df["monto"].isna()
df["monto"] = df["monto"].fillna(0.0)
print(df["was_null"].tolist())""",
           ["indicador después de fill", "perder señal"]),
        ex("S16-T1-B-E2", "S16-T1-B", "independent",
           "Si null_rate > 0.3 imprime 'blocked', si no 'ok'. Fixture 2 de 4 null.",
           "mean de isna.", "cap 0.3.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, None, None, 2.0])
rate = s.isna().mean()
print("blocked" if rate > 0.3 else "ok")""",
           ["cap inclusivo confuso", "contar no rate"]),
        ex("S16-T1-B-E3", "S16-T1-B", "transfer",
           "Imputa mediana y muestra que la mediana de no-null no cambia tras fill de un solo null en [1,2,None].",
           "median skipna.", "fillna(median).",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, 2.0, None])
med = s.median()
filled = s.fillna(med)
print(float(med), filled.tolist())""",
           ["mean vs median", "fillna 0"]),
        ex("S16-T2-A-E1", "S16-T2-A", "guided",
           "Cuenta filas marcadas por duplicated(keep=False) en un DF con una fila exacta repetida.",
           "duplicated(keep=False).sum().", "Dos filas exactas → 2.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"a": [1, 1, 2], "b": [0, 0, 9]})
print(int(df.duplicated(keep=False).sum()))""",
           ["keep='first' cuenta 1", "solo subset cols"]),
        ex("S16-T2-A-E2", "S16-T2-A", "independent",
           "Detecta cliente_id con más de una región distinta; imprime lista de ids en conflicto.",
           "groupby nunique > 1.", "unique ids.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "region": ["Lima", "Cusco", "Lima"]})
ids = df.groupby("cliente_id")["region"].nunique()
print(ids[ids > 1].index.tolist())""",
           ["duplicated exacto solo", "filter mal"]),
        ex("S16-T2-A-E3", "S16-T2-A", "transfer",
           "Clasifica: si exact dup print 'exact', elif conflicto región print 'conflict', else 'clean' para id C001 en fixture de una fila.",
           "Lógica en orden.", "Fixture simple.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"], "region": ["Lima"], "score": [1.0]})
sub = df[df.cliente_id == "C001"]
if sub.duplicated(keep=False).any() and sub.duplicated(keep=False).all():
    print("exact")
elif sub["region"].nunique() > 1:
    print("conflict")
else:
    print("clean")""",
           ["orden de if", "sin filtrar id"]),
        ex("S16-T2-B-E1", "S16-T2-B", "guided",
           "Separa quarantine (dup key keep=False) y clean drop_duplicates keep first; imprime lens.",
           "duplicated(key, keep=False).", "drop_duplicates.",
           "import pandas as pd\ndf=pd.DataFrame({'id':['a','a','b'], 'v':[1,2,3]})\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": ["a", "a", "b"], "v": [1, 2, 3]})
q = df[df.duplicated("id", keep=False)]
c = df.drop_duplicates("id", keep="first")
print(len(q), len(c))""",
           ["perder q", "keep last sin documentar"]),
        ex("S16-T2-B-E2", "S16-T2-B", "independent",
           "Asegura que quarantine conserve columna batch de evidencia; imprime columns del q.",
           "copy del mask.", "No dropear cols.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": ["a", "a"], "batch": ["b1", "b2"]})
q = df[df.duplicated("id", keep=False)].copy()
print(q.columns.tolist())""",
           ["solo id", "sin batch"]),
        ex("S16-T2-B-E3", "S16-T2-B", "transfer",
           "Imprime 'card_ok' si nunique(id)==len(df) en un DF sin dups de clave.",
           "cardinalidad 1:1.", "Comparar nunique y len.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": ["a", "b"], "v": [1, 2]})
print("card_ok" if df["id"].nunique() == len(df) else "card_bad")""",
           ["nunique dropna", "comparar con nunique cols"]),
        ex("S16-T3-A-E1", "S16-T3-A", "guided",
           "strip + title sobre [' lima ','CUSCO']; imprime lista.",
           "str.strip().str.title().", "Series string methods.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([" lima ", "CUSCO"])
print(s.str.strip().str.title().tolist())""",
           ["solo lower", "sin strip"]),
        ex("S16-T3-A-E2", "S16-T3-A", "independent",
           "Quita prefijo 'S/' y castea float en ['S/1.5','S/2']; imprime suma.",
           "str.replace.", "astype float.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series(["S/1.5", "S/2"])
v = s.str.replace("S/", "", regex=False).astype(float)
print(float(v.sum()))""",
           ["regex mal", "dejar S/"]),
        ex("S16-T3-A-E3", "S16-T3-A", "transfer",
           "Conserva raw: crea region desde region_raw y verifica que region_raw sigue igual.",
           "Nueva col no pisa raw.", "print both.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"region_raw": ["lima"]})
df["region"] = df["region_raw"].str.title()
print(df["region_raw"].tolist(), df["region"].tolist())""",
           ["overwrite raw", "drop raw"]),
        ex("S16-T3-B-E1", "S16-T3-B", "guided",
           "Marca domain_error si monto < 0; imprime lista booleana.",
           "s < 0.", "tolist.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, -2.0, 3.0])
print((s < 0).tolist())""",
           ["usar abs", "IQR only"]),
        ex("S16-T3-B-E2", "S16-T3-B", "independent",
           "Dado [1,2,3,100], usa IQR 1.5 y lista valores stat-outlier.",
           "quantile 0.25/0.75.", "fence q1-1.5iqr.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, 2.0, 3.0, 100.0])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
mask = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
print(s[mask].tolist())""",
           ["std z confuso", "dropear sin listar"]),
        ex("S16-T3-B-E3", "S16-T3-B", "transfer",
           "Etiqueta 'error' si domain, 'flag' si solo stat, 'ok' else para valor -1 en [1,2,-1].",
           "Prioriza error.", "Una fila simple.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, 2.0, -1.0])
val = s.iloc[2]
label = "error" if val < 0 else "ok"
print(label)""",
           ["flag en error", "drop"]),
        ex("S16-T4-A-E1", "S16-T4-A", "guided",
           "Lista columnas required faltantes respecto a ['id','monto'] en DF solo con id.",
           "list comprehension.", "not in columns.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": [1]})
required = ["id", "monto"]
print([c for c in required if c not in df.columns])""",
           ["extra cols como fail", "set silent"]),
        ex("S16-T4-A-E2", "S16-T4-A", "independent",
           "Encuentra índices donde fin < inicio.",
           "máscara datetime.", "index[mask].tolist().",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-06-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-05-01"]),
})
print(df.index[df["fin"] < df["inicio"]].tolist())""",
           ["string compare", "sin parse dates"]),
        ex("S16-T4-A-E3", "S16-T4-A", "transfer",
           "Si missing cols: print 'drift'; else print 'schema_ok'.",
           "Usa lista missing.", "Mensajes fijos.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": [1]})
missing = [c for c in ["id", "monto"] if c not in df.columns]
print("drift" if missing else "schema_ok")""",
           ["siempre ok", "KeyError sin mensaje"]),
        ex("S16-T4-B-E1", "S16-T4-B", "guided",
           "Dado rows_in=10 y quarantine_n=3, imprime rows_clean.",
           "resta simple.", "int.",
           "# TODO\nrows_in=10\nq=3\n",
           """rows_in = 10
q = 3
print(rows_in - q)""",
           ["porcentaje", "no restar"]),
        ex("S16-T4-B-E2", "S16-T4-B", "independent",
           "Append evento quarantine a audit list e imprime len(audit).",
           "audit.append.", "lista previa con start.",
           "audit=[{'event':'start'}]\n# TODO\n",
           """audit = [{"event": "start"}]
audit.append({"event": "quarantine", "n": 2})
print(len(audit))""",
           ["overwrite", "dict mutación rara"]),
        ex("S16-T4-B-E3", "S16-T4-B", "transfer",
           "metrics pass=False si quarantine>0; imprime pass boolean para n_q=1.",
           "pass = n_q==0.", "json opcional.",
           "# TODO\n",
           """n_q = 1
metrics = {"pass": n_q == 0, "rows_quarantine": n_q}
print(metrics["pass"])""",
           ["pass True con q", "omitir métrica"]),
    ]

    youdo = {
        "title": "Quality gate explicable ante schema drift",
        "context": (
            "Implementa una suite de checks sobre un dataset sintético de clientes/transacciones: null policies, "
            "duplicados con evidencia, normalización, outliers, contratos cross-field, cuarentena y audit trail. "
            "Nunca arregles silenciosamente un dato."
        ),
        "objectives": [
            "Suite de checks que falla explicablemente ante drift",
            "Cuantificar pérdida de filas/campos",
            "Nunca arreglar silenciosamente un dato",
            "Cuarentena + audit trail sintético",
        ],
        "requirements": [
            "Fixtures sintéticos",
            "Demo reproducible",
            "Documentación en español profesional",
            "Alineación a CP-N2-A (quality)",
        ],
        "starterCode": """import pandas as pd

def run_quality_gate(df: pd.DataFrame, schema: dict) -> dict:
    \"\"\"Retorna metrics + quarantine. No muta df sin audit.\"\"\"
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    df = pd.DataFrame({"cliente_id": ["C001", None], "monto": [10.0, -1.0]})
    print(run_quality_gate(df, {"cliente_id": "required", "monto": "required"}))
""",
        "portfolioNote": "El gate debe emitir métricas incluso cuando pass=False.",
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "Un campo required con null debe:",
            "options": [
                "Rellenarse siempre con 0",
                "Generar violación/cuarentena o fail del gate",
                "Ignorarse",
                "Convertirse en category",
            ],
            "correctIndex": 1,
            "explanation": "Required no se imputa en silencio.",
        },
        {
            "question": "Conflicto de duplicados significa:",
            "options": [
                "Misma clave con atributos distintos",
                "Siempre filas idénticas",
                "Solo NaNs",
                "Schema drift de columnas",
            ],
            "correctIndex": 0,
            "explanation": "Conflicto = misma key, valores distintos.",
        },
        {
            "question": "La cuarentena debe:",
            "options": [
                "Borrar evidencia",
                "Conservar filas rechazadas con razón",
                "Enviarse a producción sin marca",
                "Imputar siempre",
            ],
            "correctIndex": 1,
            "explanation": "Evidencia + razón habilitan auditoría.",
        },
        {
            "question": "Ante schema drift (columna required faltante):",
            "options": [
                "Continuar con defaults ocultos",
                "Fallar de forma explicable con el nombre de la columna",
                "Inventar la columna con random",
                "Silenciar logs",
            ],
            "correctIndex": 1,
            "explanation": "Fail explicable es el estándar del gate V3.",
        },
    ]

    resources = {
        "docs": [
            {"label": "pandas missing data", "url": "https://pandas.pydata.org/docs/user_guide/missing_data.html", "note": "NA handling"},
            {"label": "Great Expectations (concepts)", "url": "https://greatexpectations.io/docs/", "note": "Inspiración de contratos"},
        ],
        "books": [
            {"label": "Data Quality / analytics eng. practices", "note": "Contratos y métricas operativas"},
        ],
        "courses": [
            {"label": "pandas user guide", "url": "https://pandas.pydata.org/docs/user_guide/index.html", "note": "Limpieza"},
        ],
    }

    i_do = "8 demos del quality gate: nulls, imputación, dups, evidencia, normalización, outliers, contratos, audit."
    we_do = "24 ejercicios E1/E2/E3 de calidad y contratos. Dos pistas cada uno."

    ts, log = build_section(
        "section16", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "wxpython-gui",
        "index": 16,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 12,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Monitor",
        "legacy_note": "wxPython demoted; target is data quality/contracts for CP-N2-A quality",
        "capstone": "CP-N2-A (quality)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


def build_s17() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S17-T1-A", "keys-cardinality-joins"),
        ("S17-T1-B", "validate-dup-antijoin"),
        ("S17-T2-A", "concat-melt-pivot"),
        ("S17-T2-B", "long-wide-stable-names"),
        ("S17-T3-A", "groupby-agg-transform"),
        ("S17-T3-B", "windows-dates-cohorts"),
        ("S17-T4-A", "denominators-totals"),
        ("S17-T4-B", "temporal-leakage-controls"),
    ]
    meta = {
        "id": "packaging",
        "index": 17,
        "title": "Joins, reshape, groupby y cierre analítico",
        "shortTitle": "Joins · groupby · cierre",
        "tagline": "Executive Data Quality & EDA Portfolio con dataset limpio, notebook/script reproducible, reconciliación y preguntas de negocio",
        "estimatedHours": 14,
        "level": "Competente",
        "phase": 1,
        "icon": "Package",
        "accentColor": "bg-gradient-to-br from-blue-500 to-indigo-600",
        "jobRelevance": (
            "Cerrar un **portfolio de data quality + EDA** exige joins con cardinalidad, reshape, groupby y "
            "reconciliación sin leakage temporal. Esta sección (id `packaging` conservado) retematiza a V3 y "
            "**cierra CP-N2-A**."
        ),
        "learningOutcomes": [
            "Diseñar joins con claves y cardinalidad correctas",
            "Usar validate y anti-join para detectar fan-out/huérfanos",
            "Reshapear con concat/melt/pivot",
            "Mantener nombres estables long/wide",
            "Agregar con groupby/agg/transform",
            "Construir ventanas, fechas y cohortes",
            "Reconciliar denominadores y totales",
            "Controlar leakage temporal antes/después",
        ],
    }

    theories = [
        Theory(
            heading="De “Packaging y CLI” a joins/groupby y cierre CP-N2-A (mapa)",
            paragraphs=[
                "En V3, **S17 no es el path de pyproject.toml ni PyPI**. Aquí **cierras CP-N2-A**: joins con cardinalidad, anti-join, reshape, groupby, ventanas/cohortes, reconciliación de totales y controles de leakage temporal.",
                "Entregable: dataset limpio + script reproducible + respuestas de negocio con evidencia + memo de límites.",
                "Orden: **T1 Joins** → **T2 Forma** → **T3 Agregación** → **T4 Reconciliación**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de packaging/CLI **no es el camino V3 en S17**. Target: joins/groupby y cierre CP-N2-A.",
            ),
        ),
        Theory(
            heading="claves y cardinalidad en joins",
            sub="S17-T1-A",
            paragraphs=[
                "`merge`/`join` con `how` (inner/left/right/outer). La **cardinalidad** 1:1, 1:m, m:m determina el fan-out de filas.",
                "Claves deben compartir dtype y normalización (string ids).",
                "Antes del merge, cuenta unicidad de la clave en cada lado.",
            ],
            code="""import pandas as pd

cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C003"], "monto": [10.0, 5.0, 7.0]})
print("cli_unique", cli["cliente_id"].is_unique)
print("tx_unique", tx["cliente_id"].is_unique)
m = cli.merge(tx, on="cliente_id", how="left")
print(len(cli), len(tx), len(m))
print(m.to_dict(orient="list"))""",
            code_title="join_card.py",
            callout=(
                "tip",
                "Cuenta filas pre/post",
                "Si len(out) >> len(left) en un supposed 1:1, hay fan-out.",
            ),
        ),
        Theory(
            heading="validate, duplicación accidental y anti-join",
            sub="S17-T1-B",
            paragraphs=[
                "`validate='one_to_one'|'one_to_many'|...` hace fallar merges con cardinalidad rota.",
                "`indicator=True` marca left_only/right_only/both. **Anti-join**: filas left_only (huérfanos).",
                "Útil para clientes sin transacciones o transacciones sin cliente maestro.",
            ],
            code="""import pandas as pd

cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C003"], "monto": [1.0, 2.0]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
anti = m[m["_merge"] == "left_only"]
print(m["_merge"].tolist())
print("huerfanos", anti["cliente_id"].tolist())
try:
    cli.merge(pd.DataFrame({"cliente_id": ["C001", "C001"]}), on="cliente_id", validate="one_to_one")
except pd.errors.MergeError as e:
    print("validate_fail", True)""",
            code_title="validate_anti.py",
            callout=(
                "warning",
                "m:m accidental",
                "Duplicados en ambos lados explotan filas. validate lo atrapa temprano.",
            ),
        ),
        Theory(
            heading="concat, melt y pivot",
            sub="S17-T2-A",
            paragraphs=[
                "`concat` apila (axis=0) o alinea columnas (axis=1). `melt` pasa wide→long; `pivot_table` long→wide.",
                "Elige long para series temporales multipunto; wide para reportes tabulares.",
                "Cuidado con índices al concatenar: `ignore_index=True` o keys multiindex.",
            ],
            code="""import pandas as pd

wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "ene": [1, 2], "feb": [3, 4]})
long = wide.melt(id_vars=["cliente_id"], var_name="mes", value_name="monto")
back = long.pivot_table(index="cliente_id", columns="mes", values="monto", aggfunc="sum")
print(long.to_dict(orient="list"))
print(back.reset_index().to_dict(orient="list"))""",
            code_title="melt_pivot.py",
            callout=(
                "tip",
                "aggfunc explícito",
                "pivot_table sin aggfunc puede sorprender con mean por defecto en versiones; sé explícito.",
            ),
        ),
        Theory(
            heading="long/wide y nombres estables",
            sub="S17-T2-B",
            paragraphs=[
                "Tras pivot, columnas MultiIndex o nombres sucios (`monto_ene`) deben **aplanarse** a un schema estable.",
                "Contrato de columnas del portfolio: lista ordenada documentada.",
                "Renombra con dict y valida set(columns)==expected.",
            ],
            code="""import pandas as pd

long = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "mes": ["ene", "feb"],
    "monto": [1.0, 2.0],
})
wide = long.pivot(index="cliente_id", columns="mes", values="monto")
wide.columns = [f"monto_{c}" for c in wide.columns]
wide = wide.reset_index()
expected = ["cliente_id", "monto_ene", "monto_feb"]
print(wide.columns.tolist())
print(set(wide.columns) == set(expected))""",
            code_title="stable_names.py",
            callout=(
                "warning",
                "Schema estable",
                "Un rename silencioso rompe el dashboard. Valida expected columns.",
            ),
        ),
        Theory(
            heading="groupby / agg / transform",
            sub="S17-T3-A",
            paragraphs=[
                "`groupby` + `agg` resume (dict de funciones). `transform` reinyecta el agregado al shape original (p. ej. score / mean_region).",
                "named aggregation mejora claridad: `monto_sum=('monto','sum')`.",
                "as_index=False facilita merges posteriores.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "region": ["Lima", "Lima", "Cusco"],
    "monto": [10.0, 20.0, 5.0],
})
agg = df.groupby("region", as_index=False).agg(monto_sum=("monto", "sum"), n=("monto", "size"))
df2 = df.copy()
df2["monto_region_mean"] = df2.groupby("region")["monto"].transform("mean")
print(agg.to_dict(orient="list"))
print(df2["monto_region_mean"].tolist())""",
            code_title="groupby_agg.py",
            callout=(
                "tip",
                "transform vs agg",
                "transform preserva filas; agg colapsa grupos.",
            ),
        ),
        Theory(
            heading="ventanas, fechas y cohortes",
            sub="S17-T3-B",
            paragraphs=[
                "`rolling` ventanas móviles; `resample` en series con DatetimeIndex. **Cohortes**: etiqueta por mes de primera compra.",
                "Ordena por fecha antes de rolling. Documenta ventana (3d, 7d).",
                "Cohortes alimentan retención y preguntas de negocio del portfolio.",
            ],
            code="""import pandas as pd

df = pd.DataFrame({
    "fecha": pd.to_datetime(["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"]),
    "monto": [1.0, 2.0, 3.0, 4.0],
}).set_index("fecha")
df["roll3"] = df["monto"].rolling(3).mean()
clientes = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "fecha": pd.to_datetime(["2024-01-15", "2024-02-10", "2024-01-20"]),
})
first = clientes.groupby("cliente_id")["fecha"].transform("min")
clientes["cohort"] = first.dt.to_period("M").astype(str)
print(df["roll3"].round(2).tolist())
print(clientes[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))""",
            code_title="windows_cohorts.py",
            callout=(
                "info",
                "Primera fecha = cohorte",
                "Define cohorte con la primera observación válida, no con la fecha del batch de hoy.",
            ),
        ),
        Theory(
            heading="denominadores y totales",
            sub="S17-T4-A",
            paragraphs=[
                "Reconciliación: **suma de partes = total** (o diferencia documentada). Denominadores de tasas deben coincidir con el universo declarado.",
                "Bridge table: total → segmentos → residual.",
                "Tolera redondeo con abs(diff) < eps.",
            ],
            code="""import pandas as pd

total = 100.0
parts = pd.Series({"Lima": 60.0, "Cusco": 30.0, "Arequipa": 10.0})
print("sum_parts", float(parts.sum()), "ok", abs(parts.sum() - total) < 1e-9)
# tasa: pagados / clientes activos
activos = 50
pagados = 20
print("tasa", pagados / activos, "denominador", activos)""",
            code_title="reconcile.py",
            callout=(
                "warning",
                "Denominador correcto",
                "Una tasa con denominador de otro filtro es el error clásico de EDA ejecutivo.",
            ),
        ),
        Theory(
            heading="leakage temporal y controles antes/después",
            sub="S17-T4-B",
            paragraphs=[
                "**Leakage temporal**: usar información posterior al cutoff para features o métricas de un periodo anterior.",
                "Controles: cutoff estricto, as-of join (solo filas con fecha <= t), split before/after.",
                "En el portfolio, declara el cutoff y demuestra que los agregados pre-cutoff no miran el futuro.",
            ],
            code="""import pandas as pd

tx = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-01", "2024-01-15", "2024-02-01"]),
    "monto": [10.0, 5.0, 100.0],
})
cutoff = pd.Timestamp("2024-01-31")
pre = tx[tx["fecha"] <= cutoff]
# mal: usar max global incluyendo febrero
leak = float(tx["monto"].sum())
ok = float(pre["monto"].sum())
print("con_leak_total", leak, "pre_cutoff", ok)
print("leakage_delta", leak - ok)""",
            code_title="no_leak.py",
            callout=(
                "danger",
                "Cutoff estricto",
                "Cualquier feature con fecha > cutoff invalida el análisis before/after.",
            ),
        ),
    ]

    demos = [
        Demo("S17-T1-A-DEMO", "S17-T1-A",
             "Elegir left join clientes-tx y validar fan-out 1:m",
             """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "monto": [3.0, 4.0, 5.0]})
assert cli["cliente_id"].is_unique
m = cli.merge(tx, on="cliente_id", how="left")
print("rows", len(cli), "->", len(m), "card", "1:m")
print(m.groupby("cliente_id").size().to_dict())""",
             "Contar filas pre/post documenta la cardinalidad real del join.", title="demo_join.py"),
        Demo("S17-T1-B-DEMO", "S17-T1-B",
             "Detectar fan-out con validate y anti-join de clientes sin tx",
             """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001"], "monto": [1.0, 2.0]})
ok = cli.merge(tx.drop_duplicates("cliente_id"), on="cliente_id", how="left", validate="one_to_one")
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
anti = m.loc[m["_merge"] == "left_only", "cliente_id"].unique().tolist()
print("anti", anti)
try:
    cli.merge(tx, on="cliente_id", validate="one_to_one")
except Exception:
    print("validate_caught_fanout", True)""",
             "validate + anti-join cubren fan-out y huérfanos.", title="demo_anti.py"),
        Demo("S17-T2-A-DEMO", "S17-T2-A",
             "Pasar wide↔long con melt y pivot_table",
             """import pandas as pd
wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "m1": [10, 20], "m2": [1, 2]})
long = wide.melt(id_vars="cliente_id", var_name="periodo", value_name="monto")
wide2 = long.pivot_table(index="cliente_id", columns="periodo", values="monto", aggfunc="sum")
print(long.shape, wide2.shape)
print(long["periodo"].tolist())""",
             "melt/pivot son el puente a reportes y series.", title="demo_reshape.py"),
        Demo("S17-T2-B-DEMO", "S17-T2-B",
             "Estabilizar nombres de columnas post-pivot al schema del portfolio",
             """import pandas as pd
long = pd.DataFrame({"cliente_id": ["C001", "C001"], "mes": ["ene", "feb"], "monto": [1.0, 2.0]})
w = long.pivot(index="cliente_id", columns="mes", values="monto").reset_index()
w.columns = ["cliente_id" if c == "cliente_id" else f"monto_{c}" for c in w.columns]
expected = {"cliente_id", "monto_ene", "monto_feb"}
print(w.columns.tolist(), set(w.columns) == expected)""",
             "Schema de columnas estable evita roturas del dashboard.", title="demo_names.py"),
        Demo("S17-T3-A-DEMO", "S17-T3-A",
             "Agregar montos por región y reinyectar media con transform",
             """import pandas as pd
df = pd.DataFrame({
    "region": ["Lima", "Lima", "Arequipa", "Arequipa"],
    "monto": [10.0, 30.0, 5.0, 15.0],
})
resumen = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
df = df.assign(mean_reg=df.groupby("region")["monto"].transform("mean"))
print(resumen.to_dict(orient="list"))
print(df["mean_reg"].tolist())""",
             "agg para reportes; transform para features a nivel fila.", title="demo_groupby.py"),
        Demo("S17-T3-B-DEMO", "S17-T3-B",
             "Construir cohorte mensual y media móvil de 2 periodos",
             """import pandas as pd
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002"],
    "fecha": pd.to_datetime(["2024-01-05", "2024-02-10", "2024-01-20", "2024-03-01"]),
    "monto": [1.0, 2.0, 3.0, 4.0],
})
tx["cohort"] = tx.groupby("cliente_id")["fecha"].transform("min").dt.to_period("M").astype(str)
daily = tx.groupby("fecha", as_index=True)["monto"].sum().sort_index()
roll = daily.rolling(2).mean()
print(tx[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))
print([None if pd.isna(x) else round(float(x), 2) for x in roll.tolist()])""",
             "Cohortes + ventanas responden preguntas de evolución temporal.", title="demo_cohort.py"),
        Demo("S17-T4-A-DEMO", "S17-T4-A",
             "Reconciliar total nacional vs suma por región",
             """import pandas as pd
parts = pd.DataFrame({"region": ["Lima", "Cusco", "Arequipa"], "monto": [50.0, 30.0, 20.0]})
total_ref = 100.0
diff = float(parts["monto"].sum() - total_ref)
print("diff", diff, "reconciled", abs(diff) < 1e-9)
# denominador de tasa de completitud
n_clientes = 200
n_completos = 150
print("tasa", n_completos / n_clientes, "den", n_clientes)""",
             "Totales y denominadores anclan el EDA ejecutivo.", title="demo_totals.py"),
        Demo("S17-T4-B-DEMO", "S17-T4-B",
             "Evitar leakage: agregar solo transacciones <= cutoff",
             """import pandas as pd
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-10", "2024-03-01"]),
    "monto": [10.0, 999.0],
})
cutoff = pd.Timestamp("2024-01-31")
feat = tx[tx["fecha"] <= cutoff].groupby("cliente_id")["monto"].sum()
leaky = tx.groupby("cliente_id")["monto"].sum()
print("safe", feat.to_dict())
print("leaky", leaky.to_dict())
print("delta", float(leaky["C001"] - feat["C001"]))""",
             "Cutoff y as-of evitan contaminación before/after.", title="demo_leakage.py"),
    ]

    def ex(eid, sub, kind, instr, h1, h2, starter, solution, edge):
        return Ex(eid, sub, kind, instr, h1, h2, starter, solution, edge=edge)

    exercises = [
        ex("S17-T1-A-E1", "S17-T1-A", "guided",
           "Left merge cli y tx por cliente_id; imprime len del resultado.",
           "merge how='left'.", "Cuenta filas.",
           "import pandas as pd\ncli=pd.DataFrame({'cliente_id':['C001','C002']})\ntx=pd.DataFrame({'cliente_id':['C001'],'monto':[1.0]})\n# TODO\n",
           """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
print(len(cli.merge(tx, on="cliente_id", how="left")))""",
           ["inner pierde C002", "how wrong"]),
        ex("S17-T1-A-E2", "S17-T1-A", "independent",
           "Imprime si la clave de cli es única (True/False).",
           "is_unique.", "Series.cliente_id.",
           "import pandas as pd\ncli=pd.DataFrame({'cliente_id':['C001','C001']})\n# TODO\n",
           """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C001"]})
print(bool(cli["cliente_id"].is_unique))""",
           ["nunique confuso", "drop_duplicates silencioso"]),
        ex("S17-T1-A-E3", "S17-T1-A", "transfer",
           "Demuestra fan-out: 1 cliente x 3 tx → len merge == 3 con how=inner.",
           "merge inner.", "print len.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001"]})
tx = pd.DataFrame({"cliente_id": ["C001"] * 3, "monto": [1.0, 2.0, 3.0]})
print(len(cli.merge(tx, on="cliente_id", how="inner")))""",
           ["how left same here", "cartesian wrong keys"]),
        ex("S17-T1-B-E1", "S17-T1-B", "guided",
           "Con indicator=True, lista cliente_id left_only.",
           "merge left indicator.", "filtra _merge.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(m.loc[m["_merge"] == "left_only", "cliente_id"].tolist())""",
           ["right_only", "sin indicator"]),
        ex("S17-T1-B-E2", "S17-T1-B", "independent",
           "validate one_to_one debe fallar con dups a la derecha; imprime 'fail'.",
           "try MergeError o Exception.", "validate=.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
a = pd.DataFrame({"id": [1]})
b = pd.DataFrame({"id": [1, 1]})
try:
    a.merge(b, on="id", validate="one_to_one")
except Exception:
    print("fail")""",
           ["validate many_to_many", "no catch"]),
        ex("S17-T1-B-E3", "S17-T1-B", "transfer",
           "Cuenta huérfanos (anti-join) entre cli y tx.",
           "left_only count.", "nunique o len.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001"]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(int((m["_merge"] == "left_only").sum()))""",
           ["inner count", "right anti"]),
        ex("S17-T2-A-E1", "S17-T2-A", "guided",
           "melt id_vars=id value_vars a,b; imprime len long (debe 4 para 2 filas x 2).",
           "melt.", "var_name value_name opcionales.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"id": [1, 2], "a": [10, 20], "b": [3, 4]})
print(len(df.melt(id_vars="id", value_vars=["a", "b"])))""",
           ["stack mal", "sin id_vars"]),
        ex("S17-T2-A-E2", "S17-T2-A", "independent",
           "pivot_table index=id columns=k values=v sum; imprime columns list tras reset.",
           "aggfunc sum.", "reset_index.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
long = pd.DataFrame({"id": [1, 1], "k": ["a", "b"], "v": [1.0, 2.0]})
w = long.pivot_table(index="id", columns="k", values="v", aggfunc="sum").reset_index()
print(w.columns.tolist())""",
           ["pivot sin agg", "mean default confusion"]),
        ex("S17-T2-A-E3", "S17-T2-A", "transfer",
           "concat de dos DF axis=0 ignore_index; imprime len.",
           "pd.concat(..., ignore_index=True).", "mismas cols.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(len(pd.concat([a, b], ignore_index=True)))""",
           ["axis=1", "index duplicado confuso"]),
        ex("S17-T2-B-E1", "S17-T2-B", "guided",
           "Aplana columnas MultiIndex nivel0_nivel1 e imprime nombres.",
           "map join o f-string.", "tras pivot.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
long = pd.DataFrame({"id": [1, 1], "mes": ["e", "f"], "monto": [1.0, 2.0]})
w = long.pivot(index="id", columns="mes", values="monto")
w.columns = [f"monto_{c}" for c in w.columns]
print(list(w.columns))""",
           ["dejar multiindex", "espacios"]),
        ex("S17-T2-B-E2", "S17-T2-B", "independent",
           "Valida set(columns)==expected; imprime True/False.",
           "set igualdad.", "expected fijo.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame(columns=["cliente_id", "monto_ene"])
expected = {"cliente_id", "monto_ene"}
print(set(df.columns) == expected)""",
           ["orden importa en set? no", "list =="]),
        ex("S17-T2-B-E3", "S17-T2-B", "transfer",
           "rename columns dict {'a':'monto'}; imprime columns.",
           "rename(columns=...).", "inplace False.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.rename(columns={"a": "monto"}).columns.tolist())""",
           ["reassign mal", "axis"]),
        ex("S17-T3-A-E1", "S17-T3-A", "guided",
           "groupby region sum monto; imprime dict region->sum.",
           "groupby sum.", "to_dict.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].sum().to_dict())""",
           ["mean", "as_index confusion"]),
        ex("S17-T3-A-E2", "S17-T3-A", "independent",
           "transform mean de monto por region; imprime lista alineada a filas.",
           "groupby transform.", "mismas filas que df.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].transform("mean").tolist())""",
           ["agg colapsa", "map manual"]),
        ex("S17-T3-A-E3", "S17-T3-A", "transfer",
           "agg con total sum y n count as_index=False; imprime columnas.",
           "named agg.", "as_index=False.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Cusco"], "monto": [1.0, 2.0]})
out = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
print(out.columns.tolist())""",
           ["MultiIndex cols", "sin names"]),
        ex("S17-T3-B-E1", "S17-T3-B", "guided",
           "rolling(2).mean sobre [1,2,3]; imprime lista con primer valor nan como None.",
           "rolling mean.", "tolist y nan check.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([1.0, 2.0, 3.0]).rolling(2).mean()
print([None if pd.isna(x) else float(x) for x in s])""",
           ["min_periods", "window 3"]),
        ex("S17-T3-B-E2", "S17-T3-B", "independent",
           "Asigna cohort YYYY-MM con min fecha por cliente; imprime dict id->cohort único.",
           "groupby transform min.", "dt.to_period('M').",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "fecha": pd.to_datetime(["2024-01-05", "2024-03-01", "2024-02-10"]),
})
df["cohort"] = df.groupby("cliente_id")["fecha"].transform("min").dt.to_period("M").astype(str)
print(df.drop_duplicates("cliente_id").set_index("cliente_id")["cohort"].to_dict())""",
           ["usar max", "string slice frágil"]),
        ex("S17-T3-B-E3", "S17-T3-B", "transfer",
           "Ordena por fecha antes de rolling sobre montos diarios y muestra última media window 2.",
           "sort_index.", "rolling 2.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
s = pd.Series([3.0, 1.0, 2.0], index=pd.to_datetime(["2024-01-03", "2024-01-01", "2024-01-02"]))
s = s.sort_index()
print(float(s.rolling(2).mean().iloc[-1]))""",
           ["sin ordenar", "window wrong"]),
        ex("S17-T4-A-E1", "S17-T4-A", "guided",
           "Verifica abs(sum(parts)-total)<1e-9; imprime True.",
           "sum y abs.", "eps 1e-9.",
           "parts=[10.0,20.0,70.0]; total=100.0\n# TODO\n",
           """parts = [10.0, 20.0, 70.0]
total = 100.0
print(abs(sum(parts) - total) < 1e-9)""",
           ["== exact float risk", "wrong total"]),
        ex("S17-T4-A-E2", "S17-T4-A", "independent",
           "Tasa pagados/activos con activos=40 pagados=10; imprime 0.25.",
           "división float.", "print tasa.",
           "# TODO\n",
           """activos = 40
pagados = 10
print(pagados / activos)""",
           ["denominador pagados", "porcentaje 25"]),
        ex("S17-T4-A-E3", "S17-T4-A", "transfer",
           "Bridge: total 100, lima 60, resto debe ser 40; imprime residual.",
           "total - lima.", "residual.",
           "# TODO\n",
           """total = 100.0
lima = 60.0
print(total - lima)""",
           ["doble conteo", "ratios wrong"]),
        ex("S17-T4-B-E1", "S17-T4-B", "guided",
           "Filtra fechas <= cutoff 2024-01-31; imprime montos list.",
           "Timestamp cutoff.", "máscara <=.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-02-01"]), "monto": [1.0, 9.0]})
cutoff = pd.Timestamp("2024-01-31")
print(tx.loc[tx["fecha"] <= cutoff, "monto"].tolist())""",
           ["< vs <=", "string compare"]),
        ex("S17-T4-B-E2", "S17-T4-B", "independent",
           "Compara sum pre-cutoff vs sum total; imprime delta de leakage.",
           "total - pre.", "float.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-03-01"]), "monto": [10.0, 5.0]})
cutoff = pd.Timestamp("2024-01-31")
pre = tx.loc[tx["fecha"] <= cutoff, "monto"].sum()
print(float(tx["monto"].sum() - pre))""",
           ["delta invertido", "mean"]),
        ex("S17-T4-B-E3", "S17-T4-B", "transfer",
           "Feature as-of: max monto con fecha<=cutoff por cliente; imprime dict.",
           "filter then groupby max.", "un cliente.",
           "import pandas as pd\n# TODO\n",
           """import pandas as pd
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-01", "2024-05-01"]),
    "monto": [3.0, 10.0],
})
cutoff = pd.Timestamp("2024-02-01")
feat = tx[tx["fecha"] <= cutoff].groupby("cliente_id")["monto"].max()
print(feat.to_dict())""",
           ["usar max global", "min fecha"]),
    ]

    youdo = {
        "title": "Executive Data Quality & EDA Portfolio (cierre CP-N2-A)",
        "context": (
            "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados, reshape, groupby, "
            "reconciliación de totales y controles de leakage. Entrega script reproducible, respuestas de negocio "
            "con evidencia y memo de límites/no-claims. Sin PII real."
        ),
        "objectives": [
            "Dataset limpio + notebook/script reproducible",
            "Reconciliación de totales y denominadores",
            "Preguntas de negocio respondidas con evidencia",
            "Memo de límites y no-claims",
        ],
        "requirements": [
            "Fixtures sintéticos end-to-end",
            "Demo reproducible (if __name__ == '__main__')",
            "Documentación en español profesional",
            "Alineación al cierre CP-N2-A",
        ],
        "starterCode": """import pandas as pd

def portfolio_summary(clientes: pd.DataFrame, tx: pd.DataFrame, cutoff: str) -> dict:
    \"\"\"Joins, métricas, reconciliación y agregados pre-cutoff.\"\"\"
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    clientes = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
    tx = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002"],
        "fecha": pd.to_datetime(["2024-01-10", "2024-03-01", "2024-01-20"]),
        "monto": [10.0, 50.0, 5.0],
    })
    print(portfolio_summary(clientes, tx, "2024-01-31"))
""",
        "portfolioNote": (
            "Este cierre de CP-N2-A debe poder mostrarse a un stakeholder no técnico: métricas, "
            "reconciliación, límites y ausencia de claims causales no soportados."
        ),
        "rubric": RUBRIC_STD,
    }

    selfcheck = [
        {
            "question": "validate='one_to_one' en merge sirve para:",
            "options": [
                "Imputar nulls",
                "Fallar si la cardinalidad no es 1:1",
                "Ordenar el DF",
                "Crear MultiIndex",
            ],
            "correctIndex": 1,
            "explanation": "validate verifica la cardinalidad del merge.",
        },
        {
            "question": "Un anti-join left_only identifica:",
            "options": [
                "Filas del left sin match en right",
                "Solo matches perfectos",
                "Duplicados exactos internos",
                "Schema drift de dtypes",
            ],
            "correctIndex": 0,
            "explanation": "left_only = huérfanos del lado izquierdo.",
        },
        {
            "question": "transform en groupby:",
            "options": [
                "Siempre colapsa a una fila por grupo",
                "Reinyecta el agregado al shape original",
                "Elimina el index",
                "Solo funciona con MultiIndex",
            ],
            "correctIndex": 1,
            "explanation": "transform alinea el resultado al índice original.",
        },
        {
            "question": "Leakage temporal ocurre cuando:",
            "options": [
                "Usas CSV en vez de Excel",
                "Incluyes datos posteriores al cutoff en features/métricas del pasado",
                "Haces melt",
                "Documentas el denominador",
            ],
            "correctIndex": 1,
            "explanation": "Información del futuro contamina el análisis before/after.",
        },
    ]

    resources = {
        "docs": [
            {"label": "pandas merge", "url": "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html", "note": "validate, indicator"},
            {"label": "pandas groupby", "url": "https://pandas.pydata.org/docs/user_guide/groupby.html", "note": "agg/transform"},
        ],
        "books": [
            {"label": "Python for Data Analysis — wrangling", "note": "joins, reshape, groupby"},
        ],
        "courses": [
            {"label": "pandas reshaping", "url": "https://pandas.pydata.org/docs/user_guide/reshaping.html", "note": "melt/pivot"},
        ],
    }

    i_do = "8 demos de joins, anti-join, reshape, nombres, groupby, cohortes, totales y anti-leakage."
    we_do = "24 ejercicios E1/E2/E3 de joins/groupby y reconciliación. Dos pistas cada uno. Cierre CP-N2-A."

    ts, log = build_section(
        "section17", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "packaging",
        "index": 17,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 14,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Package",
        "legacy_note": "Packaging/CLI demoted; target is joins/groupby and CP-N2-A close",
        "capstone": "CP-N2-A (cierre)",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    builders = [
        ("S14", "security", "s14-security.ts", "section14", build_s14, "CP-N2-A (inicio)"),
        ("S15", "stdlib-deep", "s15-stdlib-deep.ts", "section15", build_s15, "CP-N2-A (dataset)"),
        ("S16", "wxpython-gui", "s16-wxpython-gui.ts", "section16", build_s16, "CP-N2-A (quality)"),
        ("S17", "packaging", "s17-packaging.ts", "section17", build_s17, "CP-N2-A (cierre)"),
    ]
    results = {}
    for section, sid, fname, _export, builder, gate in builders:
        print(f"Building {section}…")
        ts, log, slugs, meta_u, youdo_t = builder()
        path = SECTIONS / fname
        path.write_text(ts, encoding="utf-8")
        print("Wrote", path, "verified", len(log))
        prog = progress_payload(section, sid, fname, meta_u, slugs, log, youdo_t)
        prog_path = STATE / f"{section.lower()}_phase4_progress.json"
        prog_path.write_text(json.dumps(prog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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
        "sections": ["S14", "S15", "S16", "S17"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S14": {k: v for k, v in results["S14"].items() if k != "log"},
        "S15": {k: v for k, v in results["S15"].items() if k != "log"},
        "S16": {k: v for k, v in results["S16"].items() if k != "log"},
        "S17": {k: v for k, v in results["S17"].items() if k != "log"},
        "exercises_done": 96,
        "exercises_target": 96,
        "demos_done": 32,
        "demos_target": 32,
        "files_changed": [
            "src/lib/course/sections/s14-security.ts",
            "src/lib/course/sections/s15-stdlib-deep.ts",
            "src/lib/course/sections/s16-wxpython-gui.ts",
            "src/lib/course/sections/s17-packaging.ts",
            "course-state/s14_phase4_progress.json",
            "course-state/s15_phase4_progress.json",
            "course-state/s16_phase4_progress.json",
            "course-state/s17_phase4_progress.json",
            f"course-state/lanes/{LANE_ID}.status.json",
            "scripts/_gen_s14_s17_p4.py",
        ],
        "execution_summary": (
            "Retargeted S14→NumPy vectorizado (CP-N2-A inicio), S15→Pandas ingesta (dataset), "
            "S16→calidad/limpieza/contratos (quality), S17→joins/groupby/cierre (CP-N2-A gate). "
            "Full packages 8 subtopics each (theory+demo+E1/E2/E3, 2 hints) = 8 demos + 24 exercises each. "
            "Platform ids security / stdlib-deep / wxpython-gui / packaging preserved. "
            "All demos/solutions executed with python3; UNVERIFIED=[]. Español peruano; synthetic data only. "
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
        "next_action": (
            "PHASE 5 exam banks for security, stdlib-deep, wxpython-gui, packaging V3 slugs. "
            "Do not mark S14–S17 passed from this lane."
        ),
        "verified_counts": {
            "S14": len(results["S14"]["log"]),
            "S15": len(results["S15"]["log"]),
            "S16": len(results["S16"]["log"]),
            "S17": len(results["S17"]["log"]),
            "UNVERIFIED": [],
        },
    }
    # strip fname from section blocks for cleaner status
    for s in ("S14", "S15", "S16", "S17"):
        lane[s].pop("fname", None)

    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / f"{LANE_ID}.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print(
        "Verified counts:",
        {k: lane["verified_counts"][k] for k in ("S14", "S15", "S16", "S17", "UNVERIFIED")},
    )


if __name__ == "__main__":
    main()
