#!/usr/bin/env python3
"""Generate S06, S07, S08 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S06-S08-P4 Author. Does not touch seed/checkpoint/ledger/s01-s05.
"""
from __future__ import annotations

import json
import subprocess
import sys
import textwrap
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
STATE = ROOT / "course-state"
LANES = STATE / "lanes"


def run_py(code: str) -> str:
    r = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        timeout=30,
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
    env: str = "browser-pyodide"


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
    for crit, w in youdo["rubric"]:
        parts.append(f"      {{ criterion: {ts_str(crit)}, weight: {ts_str(w)} }},")
    parts.append("    ],")
    parts.append("  },")
    parts.append("  selfCheck: {")
    parts.append("    questions: [")
    for q in selfcheck:
        parts.append("      {")
        parts.append(f"        question: {ts_str(q['question'])},")
        parts.append("        options: [")
        for opt in q["options"]:
            parts.append(f"          {ts_str(opt)},")
        parts.append("        ],")
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
    phase_note: str,
    meta_updates: dict,
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
    items = [{"id": k, "status": v, "notes": "python3 executed; output embedded"} for k, v in log.items()]
    return {
        "version": "3.2",
        "section": section,
        "section_id": section_id,
        "phase": "PHASE_4_COMPLETE",
        "lane": "LANE-S06-S08-P4",
        "generated_at": now,
        "prompt_version": "3.2",
        "authority": (
            "PARALLEL_PRODUCTION author agent — does not mark section passed; "
            "does not edit checkpoint/ledger/seed/s01-s05/orchestration"
        ),
        "preamble": {
            "objective": phase_note,
            "scope_in": [
                f"src/lib/course/sections/s{section[1:].zfill(2) if False else ''}",
            ],
            "scope_out": [
                "checkpoint.json",
                "section_ledger.json",
                "issue_registry.json",
                "parallel_orchestration.json",
                "s01-setup.ts",
                "s02-basics.ts",
                "s03-data-structures.ts",
                "s04-functions-modules.ts",
                "s05-oop.ts",
                "prisma/seed.ts",
                "PHASE 5 exam A/B/C stems",
                "section_passed",
            ],
        },
        "meta_updates": meta_updates,
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
        "next_action": f"PHASE 5 exam bank for {section_id} V3 slugs. Do not mark {section} passed from this lane.",
    }


# ═══════════════════════════════════════════════════════════════════════════
# S06 — Colecciones y estructuras de datos (platform id: numpy)
# ═══════════════════════════════════════════════════════════════════════════

S06_THEORY: list[Theory] = [
    Theory(
        heading="De “NumPy vectorizado” a colecciones en memoria (mapa de la sección)",
        paragraphs=[
            "En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**. Ese material se reubica conceptualmente hacia el bloque numérico/DS (p. ej. S14+). Aquí construyes el **modelo tabular en memoria** que CP-N1-B necesita: listas, tuplas, dicts, sets y estructuras anidadas **cliente → contactos → transacciones** con salidas **deterministas**.",
            "El hilo conductor es un **mini almacén en RAM** con datos sintéticos latam (`example.com`, ids `C00x`). Sin pandas ni NumPy en este incremento. En S08 ese modelo se conecta a CSV/JSON y cuarentena.",
            "Orden: **T1 Secuencias** → **T2 Dicts/sets** → **T3 Anidado y missing** → **T4 Orden y elección de estructura**.",
        ],
        callout=(
            "info",
            "Contenido reubicado conceptualmente",
            "Material legado NumPy de este archivo **no es el camino V3 del estudiante en S06**. El target es el **modelo tabular en memoria** (inicio CP-N1-B). NumPy/vectorización se retoma en el tramo DS. Conserva datos sintéticos; nunca PII real.",
        ),
    ),
    Theory(
        heading="Listas, tuplas y slicing",
        sub="S06-T1-A",
        paragraphs=[
            "Una **list** es mutable y ordenada: ideal para filas que crecen (`append`, `extend`). Una **tuple** es inmutable: ideal para **claves estables**, headers fijos o “contratos” de columnas que no deben mutarse por accidente.",
            "El **slicing** `seq[i:j:k]` produce una **ventana** sin mutar el original (en listas/tuplas crea una nueva secuencia). `txs[-3:]` son las últimas tres transacciones. El stop es exclusivo, igual que en `range`.",
            "Membership `x in seq` es O(n) en listas: útil para lotes pequeños de demo; para lookups masivos preferirás **set/dict** en T2.",
        ],
        code=textwrap.dedent(
            """\
            txs = [
                {"id": "T1", "monto": 10},
                {"id": "T2", "monto": 25},
                {"id": "T3", "monto": 7},
                {"id": "T4", "monto": 40},
            ]
            ventana = txs[-3:]
            keys = ("id", "monto")  # contrato estable
            print("ventana ids:", [r["id"] for r in ventana])
            print("keys:", keys)
            print("T2 in slice?", any(r["id"] == "T2" for r in ventana))
            """
        ).strip(),
        code_title="slicing_txs.py",
        callout=(
            "tip",
            "Regla de ventana",
            "Para reportes “últimos N” usa slicing negativo. No copies a mano con bucles salvo que necesites filtrar.",
        ),
    ),
    Theory(
        heading="Unpacking, aliasing y copia",
        sub="S06-T1-B",
        paragraphs=[
            "**Unpacking** `a, b = fila` o `head, *rest = fila` desempaqueta sin índices ruidosos. Falla si el largo no calza: eso es bueno (detecta shape roto).",
            "**Aliasing**: `b = a` no copia; ambas variables apuntan al **mismo** objeto. Si `a` es una lista de dicts y mutas `b[0]['x']`, también cambia `a[0]`. Ese bug aparece al “clonar” clientes en memoria.",
            "`list.copy()` / `seq[:]` hacen **copia superficial**. Para dicts anidados necesitas `copy.deepcopy` o reconstruir. En intake, shallow basta si solo reordenas filas sin mutar campos compartidos.",
        ],
        code=textwrap.dedent(
            """\
            import copy
            clientes = [{"id": "C001", "tags": ["vip"]}]
            alias = clientes
            shallow = clientes.copy()
            deep = copy.deepcopy(clientes)
            alias[0]["tags"].append("alias")
            print("original tras alias:", clientes)
            shallow[0]["tags"].append("shallow")
            print("original tras shallow mut de tags:", clientes)
            deep[0]["tags"].append("solo-deep")
            print("deep aislado:", deep)
            print("original final:", clientes)
            """
        ).strip(),
        code_title="alias_vs_copy.py",
        callout=(
            "warning",
            "Bug clásico de intake",
            "Lista de dicts + copy superficial: los dicts internos siguen compartidos. Si vas a mutar campos anidados, usa deepcopy o dict(...) nuevo por fila.",
        ),
    ),
    Theory(
        heading="Diccionarios y pertenencia",
        sub="S06-T2-A",
        paragraphs=[
            "Un **dict** modela registros y **índices** `id → cliente`. Lookup promedio O(1). Construye índices con `{c['id']: c for c in filas}` cuando harás muchos accesos por clave.",
            "`d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor.",
            "`update` fusiona configs: el segundo dict **pisa** claves del primero. Documenta la precedencia (env > defaults) para no “pisar sin querer” políticas de normalización.",
        ],
        code=textwrap.dedent(
            """\
            filas = [
                {"id": "C001", "region": "Lima"},
                {"id": "C002", "region": "Cusco"},
            ]
            idx = {c["id"]: c for c in filas}
            print("lookup C002:", idx["C002"]["region"])
            print("get missing:", idx.get("C999", {}).get("region", "N/A"))
            base = {"timeout": 30, "retry": 1}
            override = {"retry": 3}
            merged = {**base, **override}
            print("merged:", merged)
            """
        ).strip(),
        code_title="dict_index.py",
        callout=(
            "tip",
            "Índice vs lista",
            "Lista para orden de llegada; dict índice para lookup. Ambos conviven en el modelo CP-N1-B.",
        ),
    ),
    Theory(
        heading="Deduplicación y operaciones de set",
        sub="S06-T2-B",
        paragraphs=[
            "Un **set** guarda elementos únicos (hashables). Ideal para **ids/emails** deduplicados y para **unión/intersección/diferencia** de cohortes de dos lotes.",
            "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero montos distintos deben **reportarse**, no silenciarse. El patrón es `unique` + `conflicts`.",
            "Sets no conservan orden de inserción de forma que debas depender para exports estables en todos los contextos pedagógicos: ordena con `sorted(...)` al exportar.",
        ],
        code=textwrap.dedent(
            """\
            lote_a = {"C001", "C002", "C003"}
            lote_b = {"C002", "C003", "C004"}
            print("intersección:", sorted(lote_a & lote_b))
            print("solo A:", sorted(lote_a - lote_b))
            emails = ["a@ex.com", "b@ex.com", "a@ex.com"]
            print("únicos:", sorted(set(emails)))
            """
        ).strip(),
        code_title="sets_cohortes.py",
        callout=(
            "warning",
            "Conflicto ≠ duplicado inocente",
            "Mismo id + payload distinto → conflicto de calidad. Reporta; no elijas “el último gana” sin dejar traza.",
        ),
    ),
    Theory(
        heading="Estructuras anidadas y recorridos",
        sub="S06-T3-A",
        paragraphs=[
            "El modelo CP-N1-B anida: `cliente = {id, nombre, contacts: [...], txs: [...]}`. Recorres con `for c in clients: for t in c['txs']:`.",
            "**Aplanar** transacciones a filas densas (con `client_id` denormalizado) prepara el shape de export CSV en S08. **Contar** contactos por cliente valida integridad del grafo en memoria.",
            "Shape inconsistente (falta clave `txs`, o no es lista) se detecta con `isinstance` y se manda a review — no asumas que todo dict llegó bien formado.",
        ],
        code=textwrap.dedent(
            """\
            clients = [
                {
                    "id": "C001",
                    "contacts": [{"tipo": "email", "valor": "a@ex.com"}],
                    "txs": [{"id": "T1", "monto": 10}, {"id": "T2", "monto": 5}],
                },
                {
                    "id": "C002",
                    "contacts": [],
                    "txs": [{"id": "T3", "monto": 20}],
                },
            ]
            for c in clients:
                print(c["id"], "n_contacts=", len(c["contacts"]), "n_txs=", len(c["txs"]))
            flat = [
                {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
                for c in clients
                for t in c["txs"]
            ]
            print("flat rows:", flat)
            """
        ).strip(),
        code_title="nested_clients.py",
        callout=(
            "tip",
            "Shape listo para S08",
            "list[dict] plano es el puente natural a CSV. Mantén ids de cliente en cada fila aplanada.",
        ),
    ),
    Theory(
        heading="Acceso seguro y valores faltantes",
        sub="S06-T3-B",
        paragraphs=[
            "Campos opcionales: `contact.get('telefono')` puede devolver `None`. Encadenar `.get` en anidados evita KeyError: `(c.get('profile') or {}).get('phone')`.",
            "Distingue **missing** (`None` / clave ausente) de **vacío falsy** (`''`, `0`, `[]`). Un teléfono `''` no es lo mismo que “no vino el campo”: el reporte de calidad debe etiquetar distinto si la política lo exige.",
            "Helpers `dig(obj, *path)` o `get_nested` centralizan la política y se testean una vez.",
        ],
        code=textwrap.dedent(
            """\
            def get_nested(d, *keys, default=None):
                cur = d
                for k in keys:
                    if not isinstance(cur, dict) or k not in cur:
                        return default
                    cur = cur[k]
                return cur

            c = {"id": "C001", "profile": {"phone": None}, "email": ""}
            print("phone:", get_nested(c, "profile", "phone", default="MISSING"))
            print("email empty:", repr(c.get("email")))
            print("no address:", get_nested(c, "profile", "address", default="MISSING"))
            """
        ).strip(),
        code_title="safe_access.py",
        callout=(
            "warning",
            "Falsy ≠ missing",
            "No uses `if not value` para decidir missing si 0 o '' son valores válidos de negocio.",
        ),
    ),
    Theory(
        heading="Ordenamiento y key",
        sub="S06-T4-A",
        paragraphs=[
            "`sorted(seq, key=fn)` devuelve **nueva** lista. `list.sort(key=fn)` **muta in-place** y retorna `None` — un bug clásico si haces `x = rows.sort(...)`.",
            "`key` multi-campo: `key=lambda r: (r['region'], r['nombre'])` ordena estable por región y luego nombre. La estabilidad de Timsort preserva el orden relativo de empates.",
            "Para montos, asegúrate de que el tipo sea numérico antes de ordenar; strings `'100' < '20'` rompen el ranking.",
        ],
        code=textwrap.dedent(
            """\
            clients = [
                {"nombre": "Zara", "region": "Lima", "monto": 30},
                {"nombre": "Ana", "region": "Lima", "monto": 50},
                {"nombre": "Luis", "region": "Cusco", "monto": 20},
            ]
            by_region_name = sorted(clients, key=lambda r: (r["region"], r["nombre"]))
            print([(r["region"], r["nombre"]) for r in by_region_name])
            by_monto = sorted(clients, key=lambda r: r["monto"], reverse=True)
            print("top monto:", by_monto[0]["nombre"], by_monto[0]["monto"])
            """
        ).strip(),
        code_title="sorted_key.py",
        callout=(
            "tip",
            "Export determinista",
            "Ordena siempre antes de JSON/CSV de demos para que el diff del README sea estable.",
        ),
    ),
    Theory(
        heading="Estructura adecuada, complejidad y determinismo",
        sub="S06-T4-B",
        paragraphs=[
            "Elige estructura por **operación dominante**: muchos appends → list; muchos lookups por id → dict; membership de cohortes → set; contrato fijo inmutable → tuple.",
            "Complejidad: membership en list O(n); en set/dict O(1) promedio. No hagas `if x in big_list` dentro de un loop de n si puedes preindexar.",
            "**Determinismo**: `json.dumps(obj, sort_keys=True, ensure_ascii=False)` + `sorted` de ids produce el mismo string en cada corrida. Reproducibilidad es parte del gate de calidad.",
        ],
        code=textwrap.dedent(
            """\
            import json
            payload = {"b": 2, "a": 1, "ids": ["C002", "C001"]}
            payload["ids"] = sorted(payload["ids"])
            print(json.dumps(payload, sort_keys=True, ensure_ascii=False))
            print(json.dumps(payload, sort_keys=True, ensure_ascii=False))
            """
        ).strip(),
        code_title="determinism.py",
        callout=(
            "info",
            "Sin NumPy aquí",
            "Si tu solución de S06 importa numpy/pandas, está fuera del incremento V3. Vuelve a stdlib.",
        ),
    ),
]

S06_DEMOS: list[Demo] = [
    Demo(
        "S06-T1-A-DEMO",
        "S06-T1-A",
        "Ventana de transacciones con slicing y tupla de keys estables",
        textwrap.dedent(
            """\
            txs = [
                {"id": "T01", "monto": 12.5, "canal": "app"},
                {"id": "T02", "monto": 40.0, "canal": "web"},
                {"id": "T03", "monto": 8.0, "canal": "app"},
                {"id": "T04", "monto": 15.0, "canal": "tienda"},
                {"id": "T05", "monto": 22.0, "canal": "app"},
            ]
            KEYS = ("id", "monto", "canal")
            ultimas = txs[-3:]
            print("keys contrato:", KEYS)
            for row in ultimas:
                print(tuple(row[k] for k in KEYS))
            print("len ventana:", len(ultimas))
            """
        ).strip(),
        "Slicing da la ventana; la tupla de keys fija el contrato de columnas sin mutación accidental.",
        title="S06-T1-A-DEMO — ventana",
    ),
    Demo(
        "S06-T1-B-DEMO",
        "S06-T1-B",
        "Bug de alias al 'copiar' lista de dicts de clientes",
        textwrap.dedent(
            """\
            import copy
            clientes = [
                {"id": "C001", "score": 10},
                {"id": "C002", "score": 20},
            ]
            mal = clientes  # alias, no copia
            mal[0]["score"] = 99
            print("tras alias mut:", clientes[0]["score"])

            bien_shallow = [dict(c) for c in clientes]
            bien_shallow[0]["score"] = 1
            print("original tras shallow dict():", clientes[0]["score"])

            deep = copy.deepcopy(clientes)
            deep[1]["score"] = 0
            print("C002 original:", clientes[1]["score"], "deep:", deep[1]["score"])
            """
        ).strip(),
        "Alias muta el original; dict(c) por fila basta si el nivel 1 es plano; deepcopy para anidados.",
        title="S06-T1-B-DEMO — alias",
    ),
    Demo(
        "S06-T2-A-DEMO",
        "S06-T2-A",
        "Índice id→cliente y lookup seguro",
        textwrap.dedent(
            """\
            filas = [
                {"id": "C001", "nombre": "Ana Quispe", "region": "Lima"},
                {"id": "C002", "nombre": "Luis Huamán", "region": "Arequipa"},
            ]
            idx = {c["id"]: c for c in filas}
            cid = "C002"
            print("encontrado:", idx.get(cid, {}).get("nombre", "N/A"))
            print("missing:", idx.get("C999", {}).get("nombre", "N/A"))
            print("keys ordenadas:", sorted(idx))
            """
        ).strip(),
        "El índice dict hace lookup O(1); get encadenado evita KeyError en demos de intake.",
        title="S06-T2-A-DEMO — index",
    ),
    Demo(
        "S06-T2-B-DEMO",
        "S06-T2-B",
        "ids únicos; intersección de lotes; conflictos = mismo id datos distintos",
        textwrap.dedent(
            """\
            rows = [
                {"id": "C001", "email": "a@ex.com"},
                {"id": "C002", "email": "b@ex.com"},
                {"id": "C001", "email": "a@ex.com"},
                {"id": "C001", "email": "otro@ex.com"},
            ]
            seen = {}
            unique = []
            conflicts = []
            for r in rows:
                rid = r["id"]
                if rid not in seen:
                    seen[rid] = r
                    unique.append(r)
                elif seen[rid] != r:
                    conflicts.append({"id": rid, "a": seen[rid], "b": r})
            print("unique ids:", sorted(seen))
            print("n_conflicts:", len(conflicts))
            print("conflict email pair:", conflicts[0]["a"]["email"], "vs", conflicts[0]["b"]["email"])
            lote1, lote2 = {"C001", "C002"}, {"C002", "C003"}
            print("intersección lotes:", sorted(lote1 & lote2))
            """
        ).strip(),
        "Dedup preserva primera vista; conflictos se listan sin borrar filas del reporte.",
        title="S06-T2-B-DEMO — dedup",
    ),
    Demo(
        "S06-T3-A-DEMO",
        "S06-T3-A",
        "Modelo en memoria Client con contacts[] y txs[]",
        textwrap.dedent(
            """\
            store = [
                {
                    "id": "C001",
                    "nombre": "María Quispe",
                    "contacts": [
                        {"tipo": "email", "valor": "maria@ex.com"},
                        {"tipo": "tel", "valor": "999000111"},
                    ],
                    "txs": [
                        {"id": "T1", "monto": 50},
                        {"id": "T2", "monto": 12},
                    ],
                }
            ]
            c = store[0]
            print("cliente", c["id"], c["nombre"])
            print("contactos:", len(c["contacts"]))
            total = sum(t["monto"] for t in c["txs"])
            print("total txs:", total)
            flat = [
                {"client_id": c["id"], "tx_id": t["id"], "monto": t["monto"]}
                for c in store
                for t in c["txs"]
            ]
            print("flat:", flat)
            """
        ).strip(),
        "El grafo cliente→contactos/txs es el núcleo del modelo tabular CP-N1-B en RAM.",
        title="S06-T3-A-DEMO — modelo",
    ),
    Demo(
        "S06-T3-B-DEMO",
        "S06-T3-B",
        "Extraer teléfono opcional de contacto anidado",
        textwrap.dedent(
            """\
            def dig(d, *path, default=None):
                cur = d
                for k in path:
                    if not isinstance(cur, dict) or k not in cur:
                        return default
                    cur = cur[k]
                return cur

            c1 = {"id": "C001", "profile": {"phone": "999111222"}}
            c2 = {"id": "C002", "profile": {}}
            c3 = {"id": "C003"}
            for c in (c1, c2, c3):
                phone = dig(c, "profile", "phone", default="MISSING")
                flag = "ok" if phone != "MISSING" and phone else ("empty" if phone == "" else "missing")
                if phone == "MISSING":
                    flag = "missing"
                print(c["id"], phone, flag)
            """
        ).strip(),
        "dig() centraliza acceso seguro; etiquetas missing vs empty alimentan el reporte de calidad.",
        title="S06-T3-B-DEMO — dig",
    ),
    Demo(
        "S06-T4-A-DEMO",
        "S06-T4-A",
        "Ordenar clientes por región luego nombre",
        textwrap.dedent(
            """\
            clients = [
                {"id": "C003", "nombre": "Zara", "region": "Lima"},
                {"id": "C001", "nombre": "Ana", "region": "Lima"},
                {"id": "C002", "nombre": "Bruno", "region": "Cusco"},
            ]
            ordered = sorted(clients, key=lambda r: (r["region"], r["nombre"]))
            for r in ordered:
                print(r["region"], r["nombre"], r["id"])
            mutated = clients[:]
            mutated.sort(key=lambda r: r["id"])
            print("sort in-place retorna:", clients[:0].sort(key=lambda r: r["id"]))
            print("ids mutados:", [r["id"] for r in mutated])
            """
        ).strip(),
        "sorted no muta; key multi-campo da orden estable región→nombre para exports.",
        title="S06-T4-A-DEMO — sort",
    ),
    Demo(
        "S06-T4-B-DEMO",
        "S06-T4-B",
        "Mismo input → mismo JSON dump con sort_keys",
        textwrap.dedent(
            """\
            import json
            data = {
                "clients": [
                    {"id": "C002", "region": "Cusco"},
                    {"id": "C001", "region": "Lima"},
                ],
                "generated_by": "s06-demo",
            }
            data["clients"] = sorted(data["clients"], key=lambda c: c["id"])
            a = json.dumps(data, sort_keys=True, ensure_ascii=False)
            b = json.dumps(data, sort_keys=True, ensure_ascii=False)
            print(a)
            print("determinista:", a == b)
            """
        ).strip(),
        "sort de filas + sort_keys hace reproducible el artefacto de demo del modelo en memoria.",
        title="S06-T4-B-DEMO — json",
    ),
]

S06_EX: list[Ex] = [
    Ex(
        "S06-T1-A-E1", "S06-T1-A", "guided",
        "E1 (guiado) — Dada `txs` de 5 montos, imprime los **últimos 2** con slicing y la longitud de la ventana. Caso vacío: si `txs=[]`, imprime `ventana=[]` y `len=0`.",
        "Usa txs[-2:] (funciona también si hay menos de 2).",
        "print la lista y luego len(ventana).",
        "txs = [10, 20, 30, 40, 50]\n# TODO\nempty = []\n# TODO empty",
        "txs = [10, 20, 30, 40, 50]\nventana = txs[-2:]\nprint(ventana)\nprint(len(ventana))\nempty = []\nv0 = empty[-2:]\nprint(v0)\nprint(len(v0))",
        edge=["caso vacío"],
        tests="[40, 50] y []",
        feedback="Slicing negativo no lanza error en lista vacía.",
        title="slice_n.py",
    ),
    Ex(
        "S06-T1-A-E2", "S06-T1-A", "independent",
        "E2 (independiente) — Convierte la lista de headers `['id','monto']` a **tuple** `KEYS` (motivo: inmutable). Imprime `KEYS` y demuestra que `KEYS + ('canal',)` crea otra tupla sin mutar `KEYS`.",
        "tuple(lista) o keys = ('id','monto')",
        "KEYS no tiene append; usa + para nueva tupla.",
        "headers = ['id', 'monto']\n# TODO\nprint('KEYS', KEYS)\n# TODO extend conceptual\nprint('KEYS sigue', KEYS)",
        "headers = ['id', 'monto']\nKEYS = tuple(headers)\nprint('KEYS', KEYS)\nmore = KEYS + ('canal',)\nprint('more', more)\nprint('KEYS sigue', KEYS)",
        edge=["inmutabilidad"],
        tests="KEYS estable + more",
        feedback="Tuple = contrato de columnas que no se muta por accidente.",
        title="list_tuple.py",
    ),
    Ex(
        "S06-T1-A-E3", "S06-T1-A", "transfer",
        "E3 (transferencia) — Hay un bug: se trata una tupla de ids como lista y se intenta `.append`. Captura el AttributeError, convierte a list, append 'C003', e imprime el resultado y un mensaje de diagnóstico.",
        "tuple no tiene append → AttributeError",
        "list(ids) para mutar una copia.",
        "ids = ('C001', 'C002')\ntry:\n    ids.append('C003')  # bug intencional si se ejecuta sobre tuple\nexcept Exception as e:\n    # TODO\n    ...",
        "ids = ('C001', 'C002')\ntry:\n    ids.append('C003')\nexcept AttributeError as e:\n    print('diagnóstico:', type(e).__name__, '-', e)\n    mut = list(ids)\n    mut.append('C003')\n    print(mut)",
        edge=["diagnóstico AttributeError"],
        tests="AttributeError + lista mutada",
        feedback="Si necesitas mutar, trabaja con list; guarda tuple solo como snapshot/contrato.",
        title="fix_tuple_mut.py",
    ),
    Ex(
        "S06-T1-B-E1", "S06-T1-B", "guided",
        "E1 (guiado) — Unpacking de fila `('C001', 'Lima', 10)` en `cid, region, monto`. Imprime los tres. Si la fila tuviera 2 valores, el unpack fallaría (no lo fuerces aquí).",
        "a, b, c = fila",
        "Orden posicional importa.",
        "fila = ('C001', 'Lima', 10)\n# TODO unpack\nprint(cid, region, monto)",
        "fila = ('C001', 'Lima', 10)\ncid, region, monto = fila\nprint(cid, region, monto)",
        edge=["largo exacto"],
        tests="C001 Lima 10",
        feedback="Unpack documenta el shape esperado de la fila.",
        title="unpack_row.py",
    ),
    Ex(
        "S06-T1-B-E2", "S06-T1-B", "independent",
        "E2 (independiente) — Demuestra alias vs copy: lista `[1,2]`, `alias = xs`, `copia = xs.copy()`. Mutar alias con append 3; imprimir xs y copia. Luego append 4 a copia e imprimir de nuevo xs.",
        "alias comparte objeto; copy es superficial de la lista de ints.",
        "ints inmutables: shallow basta.",
        "xs = [1, 2]\n# TODO\nprint('xs', xs, 'copia', copia)",
        "xs = [1, 2]\nalias = xs\ncopia = xs.copy()\nalias.append(3)\nprint('tras alias', xs, copia)\ncopia.append(4)\nprint('tras copia', xs, copia)",
        edge=["alias vs copy"],
        tests="xs crece con alias; no con copia tras divergencia",
        feedback="copy() corta el alias de la lista contenedora.",
        title="alias_copy.py",
    ),
    Ex(
        "S06-T1-B-E3", "S06-T1-B", "transfer",
        "E3 (transferencia) — Lista de dicts anidados `[{'id':'C1','tags':['a']}]`. Muestra que `copy()` de la lista **no** aísla `tags`. Usa `copy.deepcopy`, muta tags del deep, e imprime original vs deep.",
        "import copy; deepcopy",
        "shallow[0] is original[0] → True",
        "import copy\nrows = [{'id': 'C1', 'tags': ['a']}]\nshallow = rows.copy()\n# TODO deep + mutaciones\nprint('orig', rows)\nprint('deep', deep)",
        "import copy\nrows = [{'id': 'C1', 'tags': ['a']}]\nshallow = rows.copy()\nshallow[0]['tags'].append('s')\nprint('orig tras shallow tags', rows)\ndeep = copy.deepcopy(rows)\ndeep[0]['tags'].append('d')\nprint('orig', rows)\nprint('deep', deep)",
        edge=["shallow vs deep anidado"],
        tests="deep no contamina original en el append 'd'",
        feedback="En modelo cliente con listas internas, deepcopy (o reconstrucción) evita fugas.",
        title="shallow_deep.py",
    ),
    Ex(
        "S06-T2-A-E1", "S06-T2-A", "guided",
        "E1 (guiado) — Construye un dict desde pares `[('C001','Lima'),('C002','Cusco')]` e imprime el dict y `d['C002']`.",
        "dict(pares) o comprensión",
        "Claves deben ser hashables (str ok).",
        "pares = [('C001', 'Lima'), ('C002', 'Cusco')]\n# TODO\nprint(d)\nprint(d['C002'])",
        "pares = [('C001', 'Lima'), ('C002', 'Cusco')]\nd = dict(pares)\nprint(d)\nprint(d['C002'])",
        edge=["pares→dict"],
        tests="Cusco",
        feedback="dict(pares) es el constructor idiomático desde filas clave-valor.",
        title="dict_from_pairs.py",
    ),
    Ex(
        "S06-T2-A-E2", "S06-T2-A", "independent",
        "E2 (independiente) — Dado `idx` con C001, usa `get` para C001 y C999 (default 'N/A'). Luego muestra un `try/except KeyError` al acceder `idx['C999']` directo.",
        "idx.get('C999','N/A')",
        "KeyError solo en acceso duro.",
        "idx = {'C001': 'Ana'}\n# TODO get\n# TODO KeyError",
        "idx = {'C001': 'Ana'}\nprint(idx.get('C001', 'N/A'))\nprint(idx.get('C999', 'N/A'))\ntry:\n    print(idx['C999'])\nexcept KeyError as e:\n    print('KeyError', e)",
        edge=["get vs KeyError"],
        tests="Ana / N/A / KeyError",
        feedback="get para opcionales; KeyError cuando la ausencia es bug de programación.",
        title="get_vs_keyerror.py",
    ),
    Ex(
        "S06-T2-A-E3", "S06-T2-A", "transfer",
        "E3 (transferencia) — Fusiona `defaults={'retry':1,'timeout':30}` con `override={'retry':5}` **sin** perder timeout. Imprime merged. Luego muestra el peligro de `defaults.update(override)` mutando defaults (usa copia).",
        "{**defaults, **override} o defaults | override (3.9+)",
        "Copia antes de update in-place.",
        "defaults = {'retry': 1, 'timeout': 30}\noverride = {'retry': 5}\n# TODO merged seguro\nprint('merged', merged)\n# TODO no mutar original defaults al fusionar",
        "defaults = {'retry': 1, 'timeout': 30}\noverride = {'retry': 5}\nmerged = {**defaults, **override}\nprint('merged', merged)\nprint('defaults intacto', defaults)\nbase = dict(defaults)\nbase.update(override)\nprint('via copy+update', base)",
        edge=["no pisar sin querer"],
        tests="retry 5 timeout 30; defaults original intacto",
        feedback="Precedencia override > defaults sin mutar la config base compartida.",
        title="merge_config.py",
    ),
    Ex(
        "S06-T2-B-E1", "S06-T2-B", "guided",
        "E1 (guiado) — Deduplica `['a@ex.com','b@ex.com','a@ex.com']` con set y devuelve lista **ordenada** de únicos.",
        "sorted(set(emails))",
        "set no garantiza orden de impresión sin sorted.",
        "emails = ['a@ex.com', 'b@ex.com', 'a@ex.com']\n# TODO\nprint(unicos)",
        "emails = ['a@ex.com', 'b@ex.com', 'a@ex.com']\nunicos = sorted(set(emails))\nprint(unicos)",
        edge=["orden determinista"],
        tests="['a@ex.com', 'b@ex.com']",
        feedback="Dedup + sorted = salida estable para demos.",
        title="dedup_emails.py",
    ),
    Ex(
        "S06-T2-B-E2", "S06-T2-B", "independent",
        "E2 (independiente) — Intersección de contactos `lote_a` y `lote_b` (sets de emails). Imprime sorted de la intersección y de la diferencia simétrica.",
        "a & b ; a ^ b",
        "sorted para determinismo.",
        "a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}\nb = {'b@ex.com', 'c@ex.com', 'd@ex.com'}\n# TODO",
        "a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}\nb = {'b@ex.com', 'c@ex.com', 'd@ex.com'}\nprint('inter', sorted(a & b))\nprint('symdiff', sorted(a ^ b))",
        edge=["cohortes"],
        tests="inter b,c ; symdiff a,d",
        feedback="Intersección = en ambos lotes; symdiff = solo en uno.",
        title="set_inter.py",
    ),
    Ex(
        "S06-T2-B-E3", "S06-T2-B", "transfer",
        "E3 (transferencia) — Implementa `dedup_report(rows, key='id')` que devuelve `{unique: [...], conflicts: [...]}` sin eliminar del reporte los conflictos. Filas sintéticas con C001 repetido distinto.",
        "seen dict; si key existe y row!=prev → conflict",
        "unique guarda primera ocurrencia.",
        "def dedup_report(rows, key='id'):\n    # TODO\n    ...\nrows = [\n    {'id': 'C001', 'v': 1},\n    {'id': 'C002', 'v': 2},\n    {'id': 'C001', 'v': 9},\n]\nprint(dedup_report(rows))",
        "def dedup_report(rows, key='id'):\n    seen = {}\n    unique = []\n    conflicts = []\n    for r in rows:\n        k = r[key]\n        if k not in seen:\n            seen[k] = r\n            unique.append(r)\n        elif seen[k] != r:\n            conflicts.append({'key': k, 'kept': seen[k], 'other': r})\n    return {'unique': unique, 'conflicts': conflicts}\nrows = [\n    {'id': 'C001', 'v': 1},\n    {'id': 'C002', 'v': 2},\n    {'id': 'C001', 'v': 9},\n]\nprint(dedup_report(rows))",
        edge=["conflictos sin borrar traza"],
        tests="1 conflict C001",
        feedback="Patrón del You Do S06: unique + conflicts.",
        title="dedup_report.py",
    ),
    Ex(
        "S06-T3-A-E1", "S06-T3-A", "guided",
        "E1 (guiado) — Cuenta contactos por cliente e imprime `id → n`.",
        "len(c['contacts'])",
        "for c in clients",
        "clients = [\n    {'id': 'C001', 'contacts': [1, 2]},\n    {'id': 'C002', 'contacts': []},\n]\n# TODO",
        "clients = [\n    {'id': 'C001', 'contacts': [1, 2]},\n    {'id': 'C002', 'contacts': []},\n]\nfor c in clients:\n    print(c['id'], '→', len(c['contacts']))",
        edge=["lista vacía de contactos"],
        tests="C001 → 2 ; C002 → 0",
        feedback="Conteo simple valida el grafo anidado.",
        title="count_contacts.py",
    ),
    Ex(
        "S06-T3-A-E2", "S06-T3-A", "independent",
        "E2 (independiente) — Aplana `txs` anidadas a filas `{client_id, tx_id, monto}` e imprime la lista.",
        "doble for o comprehension anidada",
        "conserva client_id en cada fila",
        "clients = [\n    {'id': 'C001', 'txs': [{'id': 'T1', 'monto': 5}]},\n    {'id': 'C002', 'txs': [{'id': 'T2', 'monto': 7}, {'id': 'T3', 'monto': 1}]},\n]\n# TODO flat\nprint(flat)",
        "clients = [\n    {'id': 'C001', 'txs': [{'id': 'T1', 'monto': 5}]},\n    {'id': 'C002', 'txs': [{'id': 'T2', 'monto': 7}, {'id': 'T3', 'monto': 1}]},\n]\nflat = [\n    {'client_id': c['id'], 'tx_id': t['id'], 'monto': t['monto']}\n    for c in clients for t in c['txs']\n]\nprint(flat)",
        edge=["denormalización"],
        tests="3 filas flat",
        feedback="Shape listo para CSV en S08.",
        title="flatten_txs.py",
    ),
    Ex(
        "S06-T3-A-E3", "S06-T3-A", "transfer",
        "E3 (transferencia) — Detecta shape inconsistente: si falta `txs` o no es list, marca `status='review'`. Imprime status por cliente sintético (uno ok, uno malo).",
        "isinstance(c.get('txs'), list)",
        "No asumas claves siempre presentes.",
        "clients = [\n    {'id': 'C001', 'txs': []},\n    {'id': 'C002'},\n    {'id': 'C003', 'txs': 'oops'},\n]\n# TODO",
        "clients = [\n    {'id': 'C001', 'txs': []},\n    {'id': 'C002'},\n    {'id': 'C003', 'txs': 'oops'},\n]\nfor c in clients:\n    txs = c.get('txs')\n    ok = isinstance(txs, list)\n    print(c['id'], 'ok' if ok else 'review')",
        edge=["shape roto"],
        tests="ok / review / review",
        feedback="Validar shape en memoria evita basura silenciosa al exportar.",
        title="shape_check.py",
    ),
    Ex(
        "S06-T3-B-E1", "S06-T3-B", "guided",
        "E1 (guiado) — Implementa `get_nested(d, *keys, default=None)` y úsalo para `profile.phone` en un dict sintético.",
        "Recorre keys; si falta retorna default.",
        "Chequea isinstance dict en cada nivel.",
        "def get_nested(d, *keys, default=None):\n    # TODO\n    ...\nc = {'profile': {'phone': '999'}}\nprint(get_nested(c, 'profile', 'phone'))\nprint(get_nested(c, 'profile', 'email', default='N/A'))",
        "def get_nested(d, *keys, default=None):\n    cur = d\n    for k in keys:\n        if not isinstance(cur, dict) or k not in cur:\n            return default\n        cur = cur[k]\n    return cur\nc = {'profile': {'phone': '999'}}\nprint(get_nested(c, 'profile', 'phone'))\nprint(get_nested(c, 'profile', 'email', default='N/A'))",
        edge=["path incompleto"],
        tests="999 y N/A",
        feedback="Helper reutilizable del modelo anidado.",
        title="get_nested.py",
    ),
    Ex(
        "S06-T3-B-E2", "S06-T3-B", "independent",
        "E2 (independiente) — Para cada cliente, marca en un reporte si `email` es missing (None o ausente) o present. Imprime líneas `id: missing|present`.",
        "'email' not in c or c['email'] is None → missing",
        "'' puede contarse present vacío según política; aquí '' = present.",
        "clients = [\n    {'id': 'C001', 'email': 'a@ex.com'},\n    {'id': 'C002', 'email': None},\n    {'id': 'C003'},\n]\n# TODO",
        "clients = [\n    {'id': 'C001', 'email': 'a@ex.com'},\n    {'id': 'C002', 'email': None},\n    {'id': 'C003'},\n]\nfor c in clients:\n    if 'email' not in c or c['email'] is None:\n        flag = 'missing'\n    else:\n        flag = 'present'\n    print(f\"{c['id']}: {flag}\")",
        edge=["None vs ausente"],
        tests="present/missing/missing",
        feedback="Reporte de missing alimenta tasas de completitud.",
        title="mark_missing.py",
    ),
    Ex(
        "S06-T3-B-E3", "S06-T3-B", "transfer",
        "E3 (transferencia) — Construye tabla mental en prints: para valores `None`, `''`, `0`, `[]` indica si son falsy y si representan missing de negocio (solo None = missing aquí).",
        "bool(x) vs x is None",
        "0 y '' son falsy pero pueden ser datos válidos.",
        "vals = [None, '', 0, []]\n# TODO para cada: falsy? missing?",
        "vals = [None, '', 0, []]\nfor v in vals:\n    print(repr(v), 'falsy=', not bool(v), 'missing=', v is None)",
        edge=["falsy vs missing"],
        tests="solo None missing=True",
        feedback="Política explícita evita bugs de if not value.",
        title="falsy_table.py",
    ),
    Ex(
        "S06-T4-A-E1", "S06-T4-A", "guided",
        "E1 (guiado) — Ordena por monto ascendente con sorted+key e imprime ids en orden.",
        "key=lambda r: r['monto']",
        "sorted no muta la lista original.",
        "rows = [{'id': 'T2', 'monto': 30}, {'id': 'T1', 'monto': 10}]\n# TODO\nprint([r['id'] for r in ordered])",
        "rows = [{'id': 'T2', 'monto': 30}, {'id': 'T1', 'monto': 10}]\nordered = sorted(rows, key=lambda r: r['monto'])\nprint([r['id'] for r in ordered])",
        edge=["monto numérico"],
        tests="T1 luego T2",
        feedback="key extrae el criterio sin reescribir comparadores.",
        title="sort_monto.py",
    ),
    Ex(
        "S06-T4-A-E2", "S06-T4-A", "independent",
        "E2 (independiente) — key multi-campo: ordena por región y luego nombre. Imprime pares región/nombre.",
        "key=lambda r: (r['region'], r['nombre'])",
        "Tupla compara lexicográficamente.",
        "rows = [\n    {'nombre': 'Zed', 'region': 'Lima'},\n    {'nombre': 'Ana', 'region': 'Lima'},\n    {'nombre': 'Bob', 'region': 'Cusco'},\n]\n# TODO",
        "rows = [\n    {'nombre': 'Zed', 'region': 'Lima'},\n    {'nombre': 'Ana', 'region': 'Lima'},\n    {'nombre': 'Bob', 'region': 'Cusco'},\n]\nfor r in sorted(rows, key=lambda r: (r['region'], r['nombre'])):\n    print(r['region'], r['nombre'])",
        edge=["multi-campo"],
        tests="Cusco Bob; Lima Ana; Lima Zed",
        feedback="Patrón de ranking estable multi-columna.",
        title="sort_multi.py",
    ),
    Ex(
        "S06-T4-A-E3", "S06-T4-A", "transfer",
        "E3 (transferencia) — Demuestra que `rows.sort()` retorna None y muta. Imprime tipo del retorno y la lista mutada. Luego usa sorted para obtener copia ordenada sin tocar otra lista `base`.",
        "x = lst.sort() → x is None",
        "sorted(base) no muta base.",
        "rows = [3, 1, 2]\nbase = [3, 1, 2]\n# TODO",
        "rows = [3, 1, 2]\nbase = [3, 1, 2]\nret = rows.sort()\nprint('ret', ret)\nprint('rows', rows)\ncopy_sorted = sorted(base)\nprint('base', base, 'copy', copy_sorted)",
        edge=["in-place vs sorted"],
        tests="None + base intacta",
        feedback="Nunca encadenes .sort() esperando la lista ordenada.",
        title="sort_inplace.py",
    ),
    Ex(
        "S06-T4-B-E1", "S06-T4-B", "guided",
        "E1 (guiado) — Para 3 jobs imprime la estructura elegida: (1) cola de llegada (2) lookup por id (3) cohorte de emails únicos.",
        "list / dict / set",
        "Una línea por job con la elección.",
        "jobs = [\n    'cola de llegada de filas',\n    'lookup frecuente por id',\n    'emails únicos de un lote',\n]\n# TODO print job → estructura",
        "choices = {\n    'cola de llegada de filas': 'list',\n    'lookup frecuente por id': 'dict',\n    'emails únicos de un lote': 'set',\n}\nfor job, st in choices.items():\n    print(job, '→', st)",
        edge=["elección explícita"],
        tests="list/dict/set",
        feedback="Justificar estructura es parte del rubric del You Do.",
        title="choose_struct.py",
    ),
    Ex(
        "S06-T4-B-E2", "S06-T4-B", "independent",
        "E2 (independiente) — Haz determinista un export: ordena ids y `json.dumps(..., sort_keys=True)`. Imprime el JSON una vez.",
        "sorted ids; sort_keys=True",
        "ensure_ascii=False para tildes si hubiera.",
        "import json\npayload = {'z': 1, 'a': 2, 'ids': ['C002', 'C001']}\n# TODO\nprint(s)",
        "import json\npayload = {'z': 1, 'a': 2, 'ids': ['C002', 'C001']}\npayload['ids'] = sorted(payload['ids'])\ns = json.dumps(payload, sort_keys=True, ensure_ascii=False)\nprint(s)",
        edge=["determinismo"],
        tests='{"a": 2, "ids": ["C001", "C002"], "z": 1}',
        feedback="Mismo input → mismo string en cada corrida.",
        title="deterministic_json.py",
    ),
    Ex(
        "S06-T4-B-E3", "S06-T4-B", "transfer",
        "E3 (transferencia) — Justifica tradeoff: membership de 1000 ids en list vs set. Simula con prints de complejidad conceptual y un micro-ejemplo n=5 mostrando `x in set` True.",
        "list O(n) vs set O(1) promedio",
        "No necesitas timeit; razona y demo pequeña.",
        "ids = ['C001', 'C002', 'C003', 'C004', 'C005']\n# TODO set + membership + prints de complejidad",
        "ids = ['C001', 'C002', 'C003', 'C004', 'C005']\nprint('list membership: O(n) por chequeo')\nprint('set membership: O(1) promedio')\ns = set(ids)\nprint('C003 in set', 'C003' in s)\nprint('preindexar set/dict evita O(n²) en loops anidados')",
        edge=["complejidad"],
        tests="O(n) vs O(1) + True",
        feedback="Indexar antes de bucles anidados es el tradeoff memoria/tiempo del modelo.",
        title="tradeoff.py",
    ),
]

S06_YOUDO = '''\
"""memory_model.py — Modelo tabular en memoria (CP-N1-B / S06)
Clientes + contactos + transacciones en estructuras Python puras.
Sin NumPy/pandas. Datos sintéticos latam únicamente.
"""

from __future__ import annotations

import json
from typing import Any, Callable


def dedup_report(rows: list[dict], key_fn: Callable[[dict], Any]) -> dict:
    """Devuelve {unique, conflicts} sin borrar traza de conflictos."""
    # TODO
    raise NotImplementedError


def flatten_txs(clients: list[dict]) -> list[dict]:
    """Aplana txs anidadas a filas con client_id."""
    # TODO
    raise NotImplementedError


def get_nested(d: dict, *keys: str, default=None):
    # TODO
    raise NotImplementedError


def export_deterministic(clients: list[dict]) -> str:
    """JSON estable: sort por id + sort_keys."""
    # TODO
    raise NotImplementedError


def build_demo_store() -> list[dict]:
    return [
        {
            "id": "C001",
            "nombre": "Ana Quispe",
            "contacts": [{"tipo": "email", "valor": "ana@example.com"}],
            "txs": [{"id": "T1", "monto": 10}, {"id": "T2", "monto": 5}],
        },
        {
            "id": "C002",
            "nombre": "Luis Huamán",
            "contacts": [],
            "txs": [{"id": "T3", "monto": 20}],
        },
    ]


def main() -> None:
    store = build_demo_store()
    print("n_clients", len(store))
    print("flat", flatten_txs(store))
    print(export_deterministic(store))
    rows = [
        {"id": "C001", "v": 1},
        {"id": "C001", "v": 9},
        {"id": "C002", "v": 2},
    ]
    print(dedup_report(rows, key_fn=lambda r: r["id"]))


if __name__ == "__main__":
    main()
'''

# ═══════════════════════════════════════════════════════════════════════════
# S07 — Texto, Unicode y regex (platform id: data-acquisition)
# ═══════════════════════════════════════════════════════════════════════════

S07_THEORY: list[Theory] = [
    Theory(
        heading="De “Adquisición multi-fuente” a texto Unicode y regex (mapa)",
        paragraphs=[
            "En V3, **S07 no es el path principal de scraping, SQL ni APIs**. Esos temas se reubican. Aquí el estudiante domina **texto latinoamericano**: normalización Unicode, nombres con dos apellidos, métodos `str` antes de regex, y matching con evidencia **sin afirmar parentesco**.",
            "El incremento CP-N1-B es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Datos sintéticos peruanos/latam; sin PII real.",
            "Orden: **T1 Unicode** → **T2 str ops y contacto** → **T3 regex** → **T4 similitud y FP/FN**.",
        ],
        callout=(
            "info",
            "Contenido reubicado",
            "Scraping/API/SQL del legado de esta sección **no son el camino V3 en S07**. Target: normalización latinoamericana. APIs reaparecen más adelante en el roadmap.",
        ),
    ),
    Theory(
        heading="Code points, normalización y casefold",
        sub="S07-T1-A",
        paragraphs=[
            "Python 3 str es Unicode. `ord('ñ')` / `chr(241)` exploran code points. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) vs **NFD** (base + combining mark).",
            "`unicodedata.normalize('NFC', s)` unifica formas antes de comparar. Sin eso, `'José' == 'Jose\\u0301'` puede ser False aunque se vean iguales.",
            "`casefold()` es más agresivo que `lower()` para comparaciones case-insensitive (mejor para matching de nombres/emails normalizados).",
        ],
        code=textwrap.dedent(
            """\
            import unicodedata
            a = "José"
            b = "Jose\\u0301"
            print("raw equal?", a == b)
            print("NFC equal?", unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))
            print("casefold:", "MAÑANA".casefold())
            print("ord ñ:", ord("ñ"))
            """
        ).strip(),
        code_title="unicode_nfc.py",
        callout=(
            "tip",
            "Pipeline de comparación",
            "normalize NFC → strip/collapse → casefold (si la política lo pide) → comparar.",
        ),
    ),
    Theory(
        heading="Tildes, ñ, partículas y apellidos compuestos",
        sub="S07-T1-B",
        paragraphs=[
            "En Perú y Latam es común **nombre(s) + apellido1 + apellido2**. No fuerces el formato US (first/last único). Conserva el **raw** siempre.",
            "Partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza y aplica heurísticas; si no hay segundo apellido, marca **review** en vez de inventar.",
            "Espacios múltiples se colapsan; tildes y ñ se preservan en la forma normalizada visible (NFC).",
        ],
        code=textwrap.dedent(
            """\
            raw = "  María   del  Carmen  Quispe  Huamán "
            tokens = raw.split()
            print(tokens)
            # Heurística demo: últimos 2 tokens = apellidos si len>=3
            if len(tokens) >= 3:
                ap2, ap1 = tokens[-1], tokens[-2]
                given = " ".join(tokens[:-2])
                print("given:", given)
                print("apellidos:", ap1, ap2)
            """
        ).strip(),
        code_title="parse_nombre.py",
        callout=(
            "warning",
            "Sin convención universal",
            "Cualquier split de apellidos es heurística. Documenta límites; no afirmes identidad legal.",
        ),
    ),
    Theory(
        heading="split / join / search / replace",
        sub="S07-T2-A",
        paragraphs=[
            "Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. El 80% de limpieza de direcciones y tokens se resuelve así.",
            "`' '.join(s.split())` colapsa espacios. `split(',')` parsea CSV-like simple (sin comillas escapadas: ahí entra el módulo csv en S08).",
            "`replace` es literal y predecible; úsalo para normalizar guiones o prefijos antes de invocar regex.",
        ],
        code=textwrap.dedent(
            """\
            dir_raw = "  Av.  Larco   123  ,  Miraflores "
            limpio = " ".join(dir_raw.strip().split())
            print(limpio)
            parts = [p.strip() for p in limpio.split(",")]
            print(parts)
            print(limpio.replace("Av.", "Avenida"))
            """
        ).strip(),
        code_title="str_ops.py",
        callout=("tip", "str primero", "Si un replace/split basta, no escribas regex. Más legible y más seguro."),
    ),
    Theory(
        heading="Nombres, emails y teléfonos sin sobrevalidación",
        sub="S07-T2-B",
        paragraphs=[
            "Email: strip + lower + presencia de `@` suele bastar en intake. Regex hiper-estrictas **rechazan válidos** (plus addressing, dominios nuevos).",
            "Teléfono PE sintético de demo: extraer dígitos; opcionalmente validar longitud 9 para móvil — no inventes validación de operadora.",
            "Nombre: collapse + NFC; title-case es cosmético y puede pelear con partículas (`del` → `Del`). Decide política y documenta.",
        ],
        code=textwrap.dedent(
            """\
            def normalize_email(raw: str) -> str:
                s = raw.strip().lower()
                if "@" not in s:
                    raise ValueError("email sin @")
                return s

            def normalize_phone_pe(raw: str) -> str:
                return "".join(c for c in raw if c.isdigit())

            print(normalize_email("  Ana+test@Example.COM "))
            print(normalize_phone_pe("+51 999-000-111"))
            """
        ).strip(),
        code_title="norm_contact.py",
        callout=(
            "danger",
            "Overvalidation",
            "Una regex de email “perfecta” es un bug de producto. Prefiere validación modesta + review.",
        ),
    ),
    Theory(
        heading="Patrones, grupos y anchors",
        sub="S07-T3-A",
        paragraphs=[
            "Regex cuando el patrón es **regular de verdad**: DNI sintético 8 dígitos, códigos de región, prefijos. Usa `re` con **grupos** `(...)` y anchors `^$` para full match.",
            "`re.fullmatch` ancla inicio y fin. `re.search` encuentra en medio. Confundirlos produce falsos positivos en validación de códigos.",
            "Grupos con nombre `(?P<name>...)` mejoran legibilidad al extraer campos.",
        ],
        code=textwrap.dedent(
            """\
            import re
            pat = re.compile(r"^(?P<dni>\\d{8})$")
            m = pat.fullmatch("12345678")
            print(m.group("dni") if m else None)
            print("search mid:", bool(re.search(r"\\d{8}", "DNI 12345678 PE")))
            print("full mid:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678 PE")))
            """
        ).strip(),
        code_title="regex_groups.py",
        callout=("tip", "fullmatch vs search", "Validar código completo → fullmatch. Extraer de log → search/finditer."),
    ),
    Theory(
        heading="Compilación, extracción y límites",
        sub="S07-T3-B",
        paragraphs=[
            "`re.compile` reutiliza el patrón en loops (claridad + micro-ahorro). `findall` / `finditer` extraen múltiples matches de un log sintético.",
            "Límites: **catastrophic backtracking** con patrones anidados ambiguos; **overfit** de validación que rechaza inputs reales. Prefiere patrones simples.",
            "Si el patrón crece sin control, vuelve a `str` methods o a un parser explícito.",
        ],
        code=textwrap.dedent(
            """\
            import re
            phone = re.compile(r"\\b9\\d{8}\\b")
            log = "llamada 999000111 y fallback 988777666 fin"
            print(phone.findall(log))
            for m in phone.finditer(log):
                print("span", m.span(), m.group())
            """
        ).strip(),
        code_title="compile_find.py",
        callout=(
            "warning",
            "Backtracking",
            "Patrones tipo (a+)+b sobre strings hostiles pueden colgar el proceso. Mantén regex aburridas.",
        ),
    ),
    Theory(
        heading="Exacta y por tokens (Jaccard simple)",
        sub="S07-T4-A",
        paragraphs=[
            "Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse). Si no, **similitud por tokens** (Jaccard) como señal débil.",
            "Jaccard = |A∩B| / |A∪B| sobre sets de tokens. Score medio → **review**, no auto-merge.",
            "Nunca digas “es la misma persona” ni “parentesco” por un score. Conserva evidencia (score, raw A/B).",
        ],
        code=textwrap.dedent(
            """\
            def tokens(s: str) -> set[str]:
                return set(s.casefold().split())

            def token_jaccard(a: str, b: str) -> float:
                A, B = tokens(a), tokens(b)
                if not A and not B:
                    return 1.0
                if not A or not B:
                    return 0.0
                return len(A & B) / len(A | B)

            print(round(token_jaccard("Juan Perez", "Juan P. Perez"), 3))
            print(round(token_jaccard("Ana Quispe", "Luis Huamán"), 3))
            """
        ).strip(),
        code_title="jaccard.py",
        callout=("danger", "Sin claims de identidad", "Score ≠ identidad. Pipeline de match solo sugiere revisión humana."),
    ),
    Theory(
        heading="FP/FN y conservación de evidencia",
        sub="S07-T4-B",
        paragraphs=[
            "**FP** (false positive): el sistema dice match y no debería. **FN**: debería matchear y no lo hizo. En nombres latam, tildes y partículas mueven ambos.",
            "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión puede ser accept/review/reject de matching — **no** etiqueta familiar.",
            "Documenta por qué no se afirma parentesco: falta de fuente autoritativa, riesgo legal/ético, score insuficiente.",
        ],
        code=textwrap.dedent(
            """\
            pairs = [
                ("José Pérez", "Jose Perez", 0.9, "review"),
                ("Ana", "Ana", 1.0, "exact"),
                ("Luis", "Carla", 0.0, "no_match"),
                ("Juan Perez", "Juan P Perez", 0.67, "review"),
            ]
            for a, b, score, dec in pairs:
                # FP demo: exact sobre homónimos sería riesgo; aquí solo tabula
                print(f"{a!r} vs {b!r} score={score} → {dec}")
            print("nota: sin claims de parentesco ni identidad legal")
            """
        ).strip(),
        code_title="fp_fn_table.py",
        callout=(
            "info",
            "Evidencia > etiqueta",
            "Guarda raw y score. El humano decide merges sensibles.",
        ),
    ),
]

S07_DEMOS: list[Demo] = [
    Demo(
        "S07-T1-A-DEMO", "S07-T1-A",
        "Comparar 'José' vs 'Jose\\u0301' con y sin normalize",
        textwrap.dedent(
            """\
            import unicodedata
            a = "José"
            b = "Jose\\u0301"
            print("sin norm:", a == b, [hex(ord(c)) for c in a], [hex(ord(c)) for c in b])
            na, nb = unicodedata.normalize("NFC", a), unicodedata.normalize("NFC", b)
            print("NFC:", na == nb, na)
            print("casefold mañANA:", "mañANA".casefold())
            """
        ).strip(),
        "NFC alinea formas visualmente idénticas antes de comparar o indexar nombres.",
        title="S07-T1-A-DEMO — nfc",
    ),
    Demo(
        "S07-T1-B-DEMO", "S07-T1-B",
        "Parse suave de 'María del Carmen Quispe Huamán'",
        textwrap.dedent(
            """\
            import unicodedata
            raw = "María del Carmen Quispe Huamán"
            norm = unicodedata.normalize("NFC", " ".join(raw.split()))
            toks = norm.split()
            apellidos = toks[-2:]
            given = " ".join(toks[:-2])
            print("raw:", raw)
            print("given:", given)
            print("apellido1:", apellidos[0], "apellido2:", apellidos[1])
            print("conserva raw en pipeline: sí")
            """
        ).strip(),
        "Heurística de dos apellidos finales; given puede incluir partículas del nombre.",
        title="S07-T1-B-DEMO — nombres",
    ),
    Demo(
        "S07-T2-A-DEMO", "S07-T2-A",
        "Limpiar dirección sintética: strip, colapsar espacios, join tokens",
        textwrap.dedent(
            """\
            raw = "  Jr.  de  la  Unión   450  "
            limpio = " ".join(raw.strip().split())
            print(limpio)
            print(limpio.replace("Jr.", "Jiron"))
            print("find Unión:", limpio.find("Unión"))
            """
        ).strip(),
        "str methods resuelven limpieza de dirección sin regex.",
        title="S07-T2-A-DEMO — dir",
    ),
    Demo(
        "S07-T2-B-DEMO", "S07-T2-B",
        "normalize_email y normalize_phone_pe sintético",
        textwrap.dedent(
            """\
            def normalize_email(raw: str) -> str:
                s = raw.strip().lower()
                if "@" not in s:
                    raise ValueError("sin @")
                return s

            def normalize_phone_pe(raw: str) -> str:
                return "".join(ch for ch in raw if ch.isdigit())

            print(normalize_email("  User+tag@Example.COM "))
            print(normalize_phone_pe("(+51) 999-000-111"))
            # Overvalidation mala (no usar en prod de este curso):
            bad = r"^[a-z]+@[a-z]+\\.com$"
            import re
            print("overfit rejects plus?", re.fullmatch(bad, "user+tag@example.com") is None)
            """
        ).strip(),
        "Validación modesta acepta plus-addressing; regex overfit la rechazaría.",
        title="S07-T2-B-DEMO — contact",
    ),
    Demo(
        "S07-T3-A-DEMO", "S07-T3-A",
        "Extraer DNI sintético 8 dígitos con grupos",
        textwrap.dedent(
            """\
            import re
            pat = re.compile(r"DNI\\s+(?P<dni>\\d{8})\\b")
            text = "Cliente demo DNI 12345678 activo"
            m = pat.search(text)
            print(m.group("dni") if m else None)
            print("fullmatch solo digitos:", bool(re.fullmatch(r"\\d{8}", "12345678")))
            print("fullmatch con prefijo:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678")))
            """
        ).strip(),
        "Grupos nombran la captura; fullmatch exige cadena exacta.",
        title="S07-T3-A-DEMO — dni",
    ),
    Demo(
        "S07-T3-B-DEMO", "S07-T3-B",
        "compile de patrón teléfono; finditer sobre log sintético",
        textwrap.dedent(
            """\
            import re
            phone = re.compile(r"\\b9\\d{8}\\b")
            log = "ok 999111222 noise 12345 otro 988777666"
            print("findall:", phone.findall(log))
            for m in phone.finditer(log):
                print(m.group(), "at", m.start())
            print("riesgo: evita patrones con cuantificadores anidados ambiguos")
            """
        ).strip(),
        "compile + finditer extrae múltiples señales de un log sin overfit de validación.",
        title="S07-T3-B-DEMO — finditer",
    ),
    Demo(
        "S07-T4-A-DEMO", "S07-T4-A",
        "token_jaccard('Juan Perez', 'Juan P. Perez')",
        textwrap.dedent(
            """\
            def token_jaccard(a: str, b: str) -> float:
                A = set(a.replace(".", " ").casefold().split())
                B = set(b.replace(".", " ").casefold().split())
                if not A and not B:
                    return 1.0
                if not A or not B:
                    return 0.0
                return len(A & B) / len(A | B)

            s = token_jaccard("Juan Perez", "Juan P. Perez")
            print("score", round(s, 3))
            print("decision", "review" if 0.4 <= s < 1.0 else ("exact" if s == 1.0 else "no_match"))
            """
        ).strip(),
        "Score medio cae en review; no se auto-fusiona ni se afirma identidad.",
        title="S07-T4-A-DEMO — jaccard",
    ),
    Demo(
        "S07-T4-B-DEMO", "S07-T4-B",
        "Tabla FP/FN de 4 pares sintéticos",
        textwrap.dedent(
            """\
            # truth: same_entity sintético solo para ejercicio de métricas (no legal)
            rows = [
                {"a": "Ana", "b": "Ana", "pred": "match", "truth": "match"},
                {"a": "José", "b": "Jose", "pred": "match", "truth": "match"},
                {"a": "Luis", "b": "Luisa", "pred": "match", "truth": "no"},
                {"a": "María del Carmen", "b": "Maria Carmen", "pred": "no", "truth": "match"},
            ]
            for r in rows:
                if r["pred"] == "match" and r["truth"] == "no":
                    tag = "FP"
                elif r["pred"] == "no" and r["truth"] == "match":
                    tag = "FN"
                elif r["pred"] == "match":
                    tag = "TP"
                else:
                    tag = "TN"
                print(r["a"], "vs", r["b"], "→", tag)
            print("evidencia se conserva; no se afirma parentesco")
            """
        ).strip(),
        "Clasificar FP/FN enseña costo de over/under matching en nombres latam.",
        title="S07-T4-B-DEMO — fpfn",
    ),
]

S07_EX: list[Ex] = [
    Ex(
        "S07-T1-A-E1", "S07-T1-A", "guided",
        "E1 (guiado) — Normaliza a NFC la lista `['José', 'Jose\\u0301', '']` e imprime cada resultado. El vacío permanece vacío.",
        "unicodedata.normalize('NFC', s)",
        "import unicodedata",
        "import unicodedata\nnames = ['José', 'Jose\\u0301', '']\n# TODO",
        "import unicodedata\nnames = ['José', 'Jose\\u0301', '']\nfor n in names:\n    print(repr(unicodedata.normalize('NFC', n)))",
        edge=["caso vacío"],
        tests="NFC iguales visualmente",
        feedback="NFC es el primer paso del normalizador de nombres.",
        title="nfc_names.py",
    ),
    Ex(
        "S07-T1-A-E2", "S07-T1-A", "independent",
        "E2 (independiente) — Usa casefold para decidir si `'MAÑANA'` y `'mañana'` matchean. Imprime True/False.",
        "a.casefold() == b.casefold()",
        "lower también funciona en este caso; prefiere casefold en matching.",
        "a, b = 'MAÑANA', 'mañana'\n# TODO\nprint(match)",
        "a, b = 'MAÑANA', 'mañana'\nmatch = a.casefold() == b.casefold()\nprint(match)",
        edge=["ñ"],
        tests="True",
        feedback="casefold unifica mayúsculas de forma robusta.",
        title="casefold_match.py",
    ),
    Ex(
        "S07-T1-A-E3", "S07-T1-A", "transfer",
        "E3 (transferencia) — Diagnostica mismatch: dos strings que se ven iguales pero fallan `==`. Imprime igualdad cruda, igualdad NFC y un mensaje de causa (NFD residual).",
        "Compara sin/con normalize",
        "Muestra code points con ord si ayuda.",
        "import unicodedata\na = 'José'\nb = 'Jose\\u0301'\n# TODO diagnóstico",
        "import unicodedata\na = 'José'\nb = 'Jose\\u0301'\nprint('raw', a == b)\nprint('nfc', unicodedata.normalize('NFC', a) == unicodedata.normalize('NFC', b))\nprint('causa: formas Unicode distintas (compuesta vs combining mark)')",
        edge=["diagnóstico NFD"],
        tests="raw False nfc True",
        feedback="El bug de matching por NFD es real en datos copiados de PDFs/OS.",
        title="diag_nfd.py",
    ),
    Ex(
        "S07-T1-B-E1", "S07-T1-B", "guided",
        "E1 (guiado) — De `'Ana María Quispe Huamán'` extrae given y dos apellidos (últimos dos tokens). Imprímelos.",
        "tokens[-2:]",
        "given = join tokens[:-2]",
        "raw = 'Ana María Quispe Huamán'\n# TODO",
        "raw = 'Ana María Quispe Huamán'\ntoks = raw.split()\ngiven = ' '.join(toks[:-2])\nap1, ap2 = toks[-2], toks[-1]\nprint(given)\nprint(ap1, ap2)",
        edge=["dos apellidos"],
        tests="Ana María / Quispe Huamán",
        feedback="Heurística base del parse latam.",
        title="split_apellidos.py",
    ),
    Ex(
        "S07-T1-B-E2", "S07-T1-B", "independent",
        "E2 (independiente) — Preserva partículas en given: `'María del Carmen Quispe Ríos'`. given debe incluir `del Carmen`.",
        "No borres tokens del medio al cortar apellidos finales.",
        "Misma heurística últimos 2 = apellidos.",
        "raw = 'María del Carmen Quispe Ríos'\n# TODO\nprint(given)\nprint(ap1, ap2)",
        "raw = 'María del Carmen Quispe Ríos'\ntoks = raw.split()\ngiven = ' '.join(toks[:-2])\nap1, ap2 = toks[-2], toks[-1]\nprint(given)\nprint(ap1, ap2)",
        edge=["partículas"],
        tests="María del Carmen",
        feedback="Partículas del nombre se quedan en given con esta heurística simple.",
        title="particles.py",
    ),
    Ex(
        "S07-T1-B-E3", "S07-T1-B", "transfer",
        "E3 (transferencia) — Si hay menos de 3 tokens, marca `status='review'` y no inventes apellido2. Prueba `'Madonna'` y un nombre completo.",
        "len(toks) < 3 → review",
        "Conserva raw siempre.",
        "def parse_nombre(raw):\n    # TODO return dict\n    ...\nfor s in ['Madonna', 'Luis Quispe Huamán']:\n    print(parse_nombre(s))",
        "def parse_nombre(raw):\n    toks = raw.split()\n    if len(toks) < 3:\n        return {'raw': raw, 'status': 'review', 'given': raw, 'ap1': None, 'ap2': None}\n    return {\n        'raw': raw,\n        'status': 'ok',\n        'given': ' '.join(toks[:-2]),\n        'ap1': toks[-2],\n        'ap2': toks[-1],\n    }\nfor s in ['Madonna', 'Luis Quispe Huamán']:\n    print(parse_nombre(s))",
        edge=["sin segundo apellido"],
        tests="review + ok",
        feedback="Review > inventar campos demográficos.",
        title="review_short.py",
    ),
    Ex(
        "S07-T2-A-E1", "S07-T2-A", "guided",
        "E1 (guiado) — Split CSV-like simple `'C001,Ana,Lima'` en lista de campos strippeados e imprime.",
        "split(',') + strip por campo",
        "Sin comillas en este ejercicio.",
        "line = 'C001, Ana , Lima'\n# TODO\nprint(fields)",
        "line = 'C001, Ana , Lima'\nfields = [p.strip() for p in line.split(',')]\nprint(fields)",
        edge=["espacios alrededor"],
        tests="['C001', 'Ana', 'Lima']",
        feedback="CSV real con comillas → módulo csv en S08.",
        title="split_csvlike.py",
    ),
    Ex(
        "S07-T2-A-E2", "S07-T2-A", "independent",
        "E2 (independiente) — Une tokens `['Jr.', 'Unión', '450']` con espacio estable e imprime. Luego con `'-'`.",
        "' '.join(tokens)",
        "join no inserta al inicio/final.",
        "toks = ['Jr.', 'Unión', '450']\n# TODO",
        "toks = ['Jr.', 'Unión', '450']\nprint(' '.join(toks))\nprint('-'.join(toks))",
        edge=["separador estable"],
        tests="espacio y guion",
        feedback="join es el inverso idiomático de split.",
        title="join_stable.py",
    ),
    Ex(
        "S07-T2-A-E3", "S07-T2-A", "transfer",
        "E3 (transferencia) — Normaliza guiones de teléfono con replace encadenado sin regex: `'999.000-111'` → solo cambia `.` y `-` a vacío para demo de dígitos+… o deja dígitos con filter. Imprime dígitos.",
        "replace('.','').replace('-','') o filter isdigit",
        "str primero.",
        "raw = '999.000-111'\n# TODO print digits",
        "raw = '999.000-111'\nclean = raw.replace('.', '').replace('-', '')\nprint(clean)\nprint(''.join(c for c in raw if c.isdigit()))",
        edge=["sin regex"],
        tests="999000111",
        feedback="replace controlado evita regex prematura.",
        title="replace_phone.py",
    ),
    Ex(
        "S07-T2-B-E1", "S07-T2-B", "guided",
        "E1 (guiado) — `normalize_email` strip+lower; imprime resultado de `'  A@B.COM '`.",
        "strip + lower",
        "No uses regex.",
        "def normalize_email(raw):\n    # TODO\n    ...\nprint(normalize_email('  A@B.COM '))",
        "def normalize_email(raw):\n    return raw.strip().lower()\nprint(normalize_email('  A@B.COM '))",
        edge=["strip lower"],
        tests="a@b.com",
        feedback="Base mínima del normalizador de email.",
        title="email_lower.py",
    ),
    Ex(
        "S07-T2-B-E2", "S07-T2-B", "independent",
        "E2 (independiente) — Teléfono a dígitos: `'(+51) 999-000-111'` → `'51999000111'`.",
        "filter isdigit",
        "No valides operadora.",
        "raw = '(+51) 999-000-111'\n# TODO\nprint(digits)",
        "raw = '(+51) 999-000-111'\ndigits = ''.join(c for c in raw if c.isdigit())\nprint(digits)",
        edge=["símbolos"],
        tests="51999000111",
        feedback="Política modestas de dígitos > regex de formato rígido.",
        title="phone_digits.py",
    ),
    Ex(
        "S07-T2-B-E3", "S07-T2-B", "transfer",
        "E3 (transferencia) — Muestra que la regex `^[a-z]+@[a-z]+\\.com$` rechaza un email válido con `+` y mayúsculas ya lower. Imprime rejected=True y la política recomendada (modest check de @).",
        "fullmatch sobre email lower",
        "Print de política en español.",
        "import re\nemail = 'user+tag@example.com'\npat = r'^[a-z]+@[a-z]+\\.com$'\n# TODO",
        "import re\nemail = 'user+tag@example.com'\npat = r'^[a-z]+@[a-z]+\\.com$'\nrejected = re.fullmatch(pat, email) is None\nprint('rejected_by_overfit', rejected)\nprint('política: strip/lower + requiere @; sin regex hiper-estricta')",
        edge=["overvalidation"],
        tests="rejected True + política",
        feedback="Rechazar válidos es peor que un review posterior.",
        title="reject_overfit.py",
    ),
    Ex(
        "S07-T3-A-E1", "S07-T3-A", "guided",
        "E1 (guiado) — `fullmatch` de código región `^[A-Z]{3}$` sobre `'LIM'` y `'Lima'`. Imprime bools.",
        "re.fullmatch",
        "Case sensitive según patrón.",
        "import re\npat = r'^[A-Z]{3}$'\n# TODO",
        "import re\npat = r'^[A-Z]{3}$'\nprint(bool(re.fullmatch(pat, 'LIM')))\nprint(bool(re.fullmatch(pat, 'Lima')))",
        edge=["anclas"],
        tests="True False",
        feedback="fullmatch exige la cadena completa.",
        title="fullmatch_region.py",
    ),
    Ex(
        "S07-T3-A-E2", "S07-T3-A", "independent",
        "E2 (independiente) — Extrae grupos nombre/apellido de `r'^(?P<nom>\\w+) (?P<ap>\\w+)$'` sobre `'Ana Quispe'`.",
        "groupdict()",
        "fullmatch",
        "import re\npat = re.compile(r'^(?P<nom>\\w+) (?P<ap>\\w+)$')\n# TODO",
        "import re\npat = re.compile(r'^(?P<nom>\\w+) (?P<ap>\\w+)$')\nm = pat.fullmatch('Ana Quispe')\nprint(m.groupdict() if m else None)",
        edge=["grupos nombrados"],
        tests="nom Ana ap Quispe",
        feedback="Grupos nombran campos sin índices mágicos.",
        title="groups_name.py",
    ),
    Ex(
        "S07-T3-A-E3", "S07-T3-A", "transfer",
        "E3 (transferencia) — Contrasta search vs fullmatch del patrón `\\d{8}` sobre `'DNI 12345678'`. Imprime ambos bools y cuándo usarías cada uno (print corto).",
        "search True fullmatch False",
        "Explica en una línea.",
        "import re\ntext = 'DNI 12345678'\n# TODO",
        "import re\ntext = 'DNI 12345678'\nprint('search', bool(re.search(r'\\d{8}', text)))\nprint('fullmatch', bool(re.fullmatch(r'\\d{8}', text)))\nprint('usar search para extraer; fullmatch para validar campo exacto')",
        edge=["anclar vs medio"],
        tests="True/False + nota",
        feedback="Elegir search/fullmatch cambia FP de validación.",
        title="search_vs_full.py",
    ),
    Ex(
        "S07-T3-B-E1", "S07-T3-B", "guided",
        "E1 (guiado) — Compila `\\b9\\d{8}\\b` y reutiliza sobre dos strings; imprime findall de cada uno.",
        "re.compile una vez",
        "reuse en loop",
        "import re\n# TODO",
        "import re\npat = re.compile(r'\\b9\\d{8}\\b')\nfor s in ['tel 999000111', 'no match 123']:\n    print(s, '→', pat.findall(s))",
        edge=["reuse"],
        tests="un match / vacío",
        feedback="compile aclara intención de patrón reutilizado.",
        title="compile_reuse.py",
    ),
    Ex(
        "S07-T3-B-E2", "S07-T3-B", "independent",
        "E2 (independiente) — findall de códigos `[A-Z]{3}-\\d{2}` en un log sintético con dos códigos.",
        "re.findall(pat, log)",
        "Patrón simple.",
        "import re\nlog = 'ok LIM-01 y CUS-02 fin'\n# TODO\nprint(codes)",
        "import re\nlog = 'ok LIM-01 y CUS-02 fin'\ncodes = re.findall(r'[A-Z]{3}-\\d{2}', log)\nprint(codes)",
        edge=["multi match"],
        tests="LIM-01 CUS-02",
        feedback="findall lista todas las apariciones.",
        title="findall_codes.py",
    ),
    Ex(
        "S07-T3-B-E3", "S07-T3-B", "transfer",
        "E3 (transferencia) — Explica en prints el riesgo de backtracking con un patrón malo conceptual `(a+)+b` y por qué preferimos `a+b` o str methods. No necesitas colgar el proceso: solo documenta.",
        "Cuantificadores anidados ambiguos",
        "Mensaje en español peruano/claro.",
        "print('patrón peligroso: (a+)+b sobre strings largos de a\\'s')\n# TODO más líneas de mitigación",
        "print('patrón peligroso: (a+)+b sobre strings largos de a\\'s')\nprint('riesgo: catastrophic backtracking → CPU alta / hang')\nprint('mitigación: patrones simples, timeouts, o str.find/split')\nprint('preferir a+b o validación por pasos')",
        edge=["límites regex"],
        tests="mitigación documentada",
        feedback="Regex aburrida es feature en pipelines de intake.",
        title="backtracking_note.py",
    ),
    Ex(
        "S07-T4-A-E1", "S07-T4-A", "guided",
        "E1 (guiado) — Exact match tras normalize: collapse + casefold de `'  Juan  PEREZ '` vs `'juan perez'`.",
        "join split + casefold",
        "print bool",
        "def norm(s):\n    # TODO\n    ...\nprint(norm('  Juan  PEREZ ') == norm('juan perez'))",
        "def norm(s):\n    return ' '.join(s.split()).casefold()\nprint(norm('  Juan  PEREZ ') == norm('juan perez'))",
        edge=["exact normalizado"],
        tests="True",
        feedback="Primera línea de matching barata y clara.",
        title="exact_norm.py",
    ),
    Ex(
        "S07-T4-A-E2", "S07-T4-A", "independent",
        "E2 (independiente) — Implementa Jaccard de tokens y calcula score redondeado a 3 decimales para `'Juan Perez'` vs `'Juan P Perez'`.",
        "|A∩B|/|A∪B|",
        "set(split)",
        "def token_jaccard(a, b):\n    # TODO\n    ...\nprint(round(token_jaccard('Juan Perez', 'Juan P Perez'), 3))",
        "def token_jaccard(a, b):\n    A, B = set(a.casefold().split()), set(b.casefold().split())\n    if not A and not B:\n        return 1.0\n    if not A or not B:\n        return 0.0\n    return len(A & B) / len(A | B)\nprint(round(token_jaccard('Juan Perez', 'Juan P Perez'), 3))",
        edge=["score parcial"],
        tests="≈0.667",
        feedback="Score parcial → review en el pipeline.",
        title="jaccard_impl.py",
    ),
    Ex(
        "S07-T4-A-E3", "S07-T4-A", "transfer",
        "E3 (transferencia) — Si score está en [0.4, 1.0) decide `review`; si 1.0 `exact`; si <0.4 `no_match`. Aplica a score 0.67 e imprime decisión + raws.",
        "Umbrales explícitos",
        "No auto-merge en review.",
        "a, b, score = 'Juan Perez', 'Juan P Perez', 0.67\n# TODO decision\nprint(decision, a, b, score)",
        "a, b, score = 'Juan Perez', 'Juan P Perez', 0.67\nif score == 1.0:\n    decision = 'exact'\nelif score >= 0.4:\n    decision = 'review'\nelse:\n    decision = 'no_match'\nprint(decision, a, b, score)",
        edge=["score medio"],
        tests="review",
        feedback="Review es el default honesto ante ambigüedad.",
        title="score_review.py",
    ),
    Ex(
        "S07-T4-B-E1", "S07-T4-B", "guided",
        "E1 (guiado) — Clasifica FP/FN: pred match + truth no → FP; pred no + truth match → FN. Dos casos sintéticos.",
        "Tabla de confusión 2x2 simplificada",
        "print tag por caso",
        "cases = [\n    {'pred': 'match', 'truth': 'no'},\n    {'pred': 'no', 'truth': 'match'},\n]\n# TODO",
        "cases = [\n    {'pred': 'match', 'truth': 'no'},\n    {'pred': 'no', 'truth': 'match'},\n]\nfor c in cases:\n    if c['pred'] == 'match' and c['truth'] == 'no':\n        tag = 'FP'\n    elif c['pred'] == 'no' and c['truth'] == 'match':\n        tag = 'FN'\n    else:\n        tag = 'other'\n    print(tag)",
        edge=["FP FN"],
        tests="FP luego FN",
        feedback="Nombrar el error es el primer paso a tunear umbrales.",
        title="classify_fpfn.py",
    ),
    Ex(
        "S07-T4-B-E2", "S07-T4-B", "independent",
        "E2 (independiente) — Empaqueta evidencia `dict(raw_a, raw_b, score, decision, reason)` e imprímelo para un par sintético.",
        "Un dict con 5 claves",
        "reason en español",
        "# TODO evidence = {...}\nprint(evidence)",
        "evidence = {\n    'raw_a': 'Juan Perez',\n    'raw_b': 'Juan P Perez',\n    'score': 0.67,\n    'decision': 'review',\n    'reason': 'similitud parcial por tokens; requiere revisión humana',\n}\nprint(evidence)",
        edge=["evidencia"],
        tests="5 keys",
        feedback="Evidencia estructurada sobrevive al log del ETL.",
        title="pack_evidence.py",
    ),
    Ex(
        "S07-T4-B-E3", "S07-T4-B", "transfer",
        "E3 (transferencia) — Redacta en 2-3 prints por qué el pipeline **no** afirma parentesco ni identidad legal a partir de Jaccard.",
        "Falta fuente autoritativa; riesgo ético; score ≠ prueba",
        "Español claro.",
        "# TODO prints de política ética/producto",
        "print('No afirmamos parentesco: el score textual no es prueba familiar.')\nprint('No afirmamos identidad legal: falta fuente autoritativa (RENIEC/etc.).')\nprint('Solo emitimos evidencia (raw, score, decision=review) para un humano.')",
        edge=["ética"],
        tests="3 líneas de política",
        feedback="Gate de cumplimiento del capstone N1-B sobre claims.",
        title="no_parentesco.py",
    ),
]

S07_YOUDO = '''\
"""latam_normalize.py — Normalización latinoamericana (CP-N1-B / S07)
Conserva raw, produce normalized y lista transforms.
Sin scraping/API. Datos sintéticos.
"""

from __future__ import annotations

import unicodedata
from typing import Any


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def normalize_nombre(raw: str) -> tuple[str, list[str]]:
    """Retorna (normalized, transforms)."""
    # TODO: collapse, nfc; no inventar apellidos
    raise NotImplementedError


def normalize_email(raw: str) -> tuple[str, list[str]]:
    # TODO: strip lower; ValueError si no hay @
    raise NotImplementedError


def normalize_phone(raw: str) -> tuple[str, list[str]]:
    # TODO: solo dígitos
    raise NotImplementedError


def normalize_record(raw: dict[str, Any]) -> dict[str, Any]:
    """→ {raw, normalized, transforms}."""
    # TODO
    raise NotImplementedError


def main() -> None:
    sample = {
        "nombre": "  María del Carmen Quispe Huamán ",
        "email": "  Ana.Perez+demo@Example.COM ",
        "telefono": "+51 999-000-111",
    }
    print(normalize_record(sample))


if __name__ == "__main__":
    main()
'''

# ═══════════════════════════════════════════════════════════════════════════
# S08 — Archivos, CSV, JSON (platform id: pandas) + GATE CP-N1-B
# ═══════════════════════════════════════════════════════════════════════════

S08_THEORY: list[Theory] = [
    Theory(
        heading="De “Pandas EDA” a archivos, CSV/JSON y gate CP-N1-B (mapa)",
        paragraphs=[
            "En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data. Aquí cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pathlib**, **cuarentena**, **hashes**, **manifest** y reconciliación de conteos — en **stdlib**.",
            "Integra normalizadores (S05–S07) y el modelo en memoria (S06). Entorno declarado **local-python** (filesystem). Datos sintéticos en `data/`; salidas en `out/`.",
            "Orden: **T1 Archivos** → **T2 CSV** → **T3 JSON** → **T4 Provenance y manifest**.",
        ],
        callout=(
            "info",
            "Gate CP-N1-B",
            "Al finalizar S08 debes poder demostrar ETL local con clean/quarantine/manifest. CLI instalable se difiere a S10. Sin PII real ni claims de fraude/parentesco.",
        ),
    ),
    Theory(
        heading="pathlib, with, modos y encodings",
        sub="S08-T1-A",
        paragraphs=[
            "`pathlib.Path` unifica rutas. `Path.read_text(encoding='utf-8')` / `write_text` son convenientes; `with path.open(...) as f` da control de modo.",
            "Modos: `r` lectura, `w` trunca, `a` append, `x` crea exclusivo. Siempre declara **`encoding='utf-8'`** en texto. `errors=` (`strict` default, `replace`) debe ser decisión documentada.",
            "`path.exists()` / `is_file()` evitan sorpresas. No asumas el cwd: usa paths relativos al proyecto o `Path(__file__).resolve().parent`.",
        ],
        code=textwrap.dedent(
            """\
            from pathlib import Path
            import tempfile, os
            td = Path(tempfile.mkdtemp())
            p = td / "intake.txt"
            p.write_text("línea1\\njosé\\n", encoding="utf-8")
            print(p.exists(), p.read_text(encoding="utf-8").splitlines())
            with p.open("a", encoding="utf-8") as f:
                f.write("extra\\n")
            print(p.read_text(encoding="utf-8"))
            """
        ).strip(),
        code_title="path_utf8.py",
        callout=("tip", "UTF-8 explícito", "En Windows el default no siempre es UTF-8. Nunca confíes en el locale para intake."),
    ),
    Theory(
        heading="Newlines y escritura atómica",
        sub="S08-T1-B",
        paragraphs=[
            "CSV en Python: abre con `newline=''` para que el módulo csv controle terminadores. Texto universal: prefiere `\\n` en salidas del pipeline.",
            "**Escritura atómica**: escribe a un archivo temporal en el mismo directorio y luego `os.replace(tmp, dest)`. Si el proceso muere a medias, no dejas el destino truncado.",
            "Detectar `\\r\\n` en inputs ayuda a documentar provenance de origen Windows vs Unix.",
        ],
        code=textwrap.dedent(
            """\
            from pathlib import Path
            import os, tempfile
            td = Path(tempfile.mkdtemp())
            dest = td / "out.txt"

            def write_atomic(path: Path, text: str) -> None:
                path = Path(path)
                tmp = path.with_suffix(path.suffix + ".tmp")
                tmp.write_text(text, encoding="utf-8")
                os.replace(tmp, path)

            write_atomic(dest, "hola\\n")
            print(dest.read_text(encoding="utf-8"))
            sample = b"a\\r\\nb\\n"
            print("tiene CRLF", b"\\r\\n" in sample)
            """
        ).strip(),
        code_title="atomic_write.py",
        callout=("warning", "No truncate a medias", "Evita open(dest,'w') largos sin temp si un crash deja basura a consumidores."),
    ),
    Theory(
        heading="Dialectos, headers y tipos",
        sub="S08-T2-A",
        paragraphs=[
            "`csv.DictReader` / `DictWriter` trabajan con headers. Declara `fieldnames`. Cast de tipos (`int`, `float`) es **explícito** y fallos van a reject/cuarentena — no silencies con 0 mágico sin traza.",
            "Fechas pueden quedarse como string ISO en N1-B si no hay parser de calendario aún; lo importante es el **contrato de columnas** documentado.",
            "Dialectos (delimitador `;` vs `,`) se configuran; no asumas Excel latam sin mirar el archivo.",
        ],
        code=textwrap.dedent(
            """\
            import csv, io
            raw = "id,nombre,monto\\nC001,Ana,10.5\\nC002,Luis,20\\n"
            reader = csv.DictReader(io.StringIO(raw))
            for row in reader:
                row["monto"] = float(row["monto"])
                print(row)
            """
        ).strip(),
        code_title="csv_dict.py",
        callout=("tip", "Cast controlado", "try/except ValueError por celda → fila a cuarentena con motivo."),
    ),
    Theory(
        heading="Filas irregulares y cuarentena",
        sub="S08-T2-B",
        paragraphs=[
            "Filas con **más/menos columnas** que el header son irregulares. No las “arregles” en silencio: mándalas a `quarantine.csv` con **motivo** y conserva el raw.",
            "Resumen de motivos (`contador por reason`) alimenta el manifest y el dashboard de calidad.",
            "Good path escribe solo filas que pasaron schema + casts + normalización.",
        ],
        code=textwrap.dedent(
            """\
            import csv, io
            text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nC003\\n"
            reader = csv.reader(io.StringIO(text))
            header = next(reader)
            good, bad = [], []
            for row in reader:
                if len(row) != len(header):
                    bad.append({"raw": row, "reason": f"cols {len(row)}!={len(header)}"})
                else:
                    good.append(dict(zip(header, row)))
            print("good", good)
            print("bad", bad)
            """
        ).strip(),
        code_title="quarantine_rows.py",
        callout=("danger", "Silenciar irregular = deuda", "La fila extra se pierde o desalinea columnas y corrompe métricas."),
    ),
    Theory(
        heading="Objetos/arrays y serialización JSON",
        sub="S08-T3-A",
        paragraphs=[
            "`json.loads` / `dumps` y `load` / `dump` sobre archivos. JSON objects → dict; arrays → list. **JSONL** (un objeto por línea) es útil para streams de txs.",
            "`ensure_ascii=False` preserva tildes legibles. `sort_keys=True` ayuda a determinismo en manifests.",
            "`datetime` no es serializable por defecto: convierte a `isoformat()` o str para evitar TypeError.",
        ],
        code=textwrap.dedent(
            """\
            import json
            from datetime import date
            data = [{"id": "T1", "día": date(2026, 1, 15).isoformat()}]
            s = json.dumps(data, ensure_ascii=False, sort_keys=True)
            print(s)
            print(json.loads(s)[0]["id"])
            """
        ).strip(),
        code_title="json_ser.py",
        callout=("tip", "JSONL", "Para append-friendly logs de txs: una línea = un json.dumps(row)."),
    ),
    Theory(
        heading="Schema, nulls y evolución compatible",
        sub="S08-T3-B",
        paragraphs=[
            "Valida **required keys** antes de normalizar. `null` JSON → `None` en Python. Distingue null explícito de clave ausente si la política lo requiere.",
            "Evolución: añadir campo opcional con **default** no rompe lectores viejos. Quitar required sí es breaking.",
            "`validate_schema(obj, required)` retorna ok/errors para cuarentena.",
        ],
        code=textwrap.dedent(
            """\
            def validate_schema(obj, required):
                missing = [k for k in required if k not in obj]
                return (len(missing) == 0, missing)

            print(validate_schema({"id": "C1", "email": None}, ["id", "email"]))
            print(validate_schema({"id": "C1"}, ["id", "email"]))
            obj = {"id": "C1"}
            obj.setdefault("segment", "default")
            print(obj)
            """
        ).strip(),
        code_title="schema_nulls.py",
        callout=("warning", "null ≠ missing siempre", "Documenta si null borra valor o significa unknown."),
    ),
    Theory(
        heading="Backups, hashes y provenance",
        sub="S08-T4-A",
        paragraphs=[
            "`hashlib.sha256` del contenido del input fija un fingerprint en el manifest. Si el CSV cambia, el hash cambia — detectas reprocesos.",
            "Backup: copia `input.bak` o a `backups/` **antes** de transformar. No mutes el original in place.",
            "Provenance mínima: `{path, sha256, bytes, received_at}` por fuente.",
        ],
        code=textwrap.dedent(
            """\
            from pathlib import Path
            import hashlib, tempfile, shutil
            td = Path(tempfile.mkdtemp())
            src = td / "clients.csv"
            src.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")
            h = hashlib.sha256(src.read_bytes()).hexdigest()
            bak = td / "clients.csv.bak"
            shutil.copy2(src, bak)
            print("sha256", h[:16] + "...")
            print("bak exists", bak.exists())
            print("provenance", {"path": str(src.name), "sha256": h, "bytes": src.stat().st_size})
            """
        ).strip(),
        code_title="hash_backup.py",
        callout=("tip", "Hash del input", "El manifest referencia el hash del archivo crudo, no del clean."),
    ),
    Theory(
        heading="Reconciliación y manifest de corrida",
        sub="S08-T4-B",
        paragraphs=[
            "Manifest JSON de la corrida: timestamps, hashes de inputs, conteos `n_in`, `n_clean`, `n_quarantine`, razones, versión de script.",
            "**Reconciliación**: `n_in == n_clean + n_quarantine` (para un stream). Si no cuadra, **falla la corrida** — no publiques clean a medias.",
            "Evidencia del gate CP-N1-B: scripts + fixtures + manifest de demo + tests + README.",
        ],
        code=textwrap.dedent(
            """\
            import json
            manifest = {
                "n_in": 10,
                "n_clean": 8,
                "n_quarantine": 2,
                "inputs": [{"name": "clients.csv", "sha256": "abc"}],
            }
            ok = manifest["n_in"] == manifest["n_clean"] + manifest["n_quarantine"]
            print("reconcile_ok", ok)
            print(json.dumps(manifest, sort_keys=True))
            """
        ).strip(),
        code_title="manifest.py",
        callout=(
            "success",
            "Cierre CP-N1-B",
            "Si reconcile falla, el pipeline debe exit non-zero. Clean y quarantine siempre explicables.",
        ),
    ),
]

S08_DEMOS: list[Demo] = [
    Demo(
        "S08-T1-A-DEMO", "S08-T1-A",
        "Leer y escribir intake UTF-8 con Path",
        textwrap.dedent(
            """\
            from pathlib import Path
            import tempfile
            td = Path(tempfile.mkdtemp())
            p = td / "intake.txt"
            p.write_text("cliente;José Quispe\\n", encoding="utf-8")
            text = p.read_text(encoding="utf-8")
            print(text.strip())
            print("exists", p.exists(), "size", p.stat().st_size)
            """
        ).strip(),
        "Path + UTF-8 explícito es la base de toda ingesta local del gate.",
        title="S08-T1-A-DEMO — path",
        env="local-python",
    ),
    Demo(
        "S08-T1-B-DEMO", "S08-T1-B",
        "write_atomic(path, text)",
        textwrap.dedent(
            """\
            from pathlib import Path
            import os, tempfile

            def write_atomic(path: Path, text: str) -> None:
                path = Path(path)
                tmp = path.with_name(path.name + ".tmp")
                tmp.write_text(text, encoding="utf-8")
                os.replace(tmp, path)

            td = Path(tempfile.mkdtemp())
            dest = td / "clean.csv"
            write_atomic(dest, "id,nombre\\nC001,Ana\\n")
            print(dest.read_text(encoding="utf-8"))
            print("tmp gone", not (td / "clean.csv.tmp").exists())
            """
        ).strip(),
        "os.replace hace el swap atómico del artefacto de salida.",
        title="S08-T1-B-DEMO — atomic",
        env="local-python",
    ),
    Demo(
        "S08-T2-A-DEMO", "S08-T2-A",
        "Ingesta CSV de clientes con tipos monto/fecha string",
        textwrap.dedent(
            """\
            import csv, io
            raw = "id,nombre,monto,fecha\\nC001,Ana,10.5,2026-01-10\\nC002,Luis,20,2026-01-11\\n"
            rows = []
            for row in csv.DictReader(io.StringIO(raw)):
                row["monto"] = float(row["monto"])
                # fecha queda ISO string (contrato N1-B)
                rows.append(row)
            for r in rows:
                print(r["id"], r["monto"], type(r["monto"]).__name__, r["fecha"])
            """
        ).strip(),
        "DictReader + cast explícito de monto; fecha como string ISO documentado.",
        title="S08-T2-A-DEMO — csv",
        env="local-python",
    ),
    Demo(
        "S08-T2-B-DEMO", "S08-T2-B",
        "Separar good.csv vs quarantine.csv",
        textwrap.dedent(
            """\
            import csv, io
            from pathlib import Path
            import tempfile

            text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nbadonly\\n"
            reader = csv.reader(io.StringIO(text))
            header = next(reader)
            good, quar = [], []
            for row in reader:
                if len(row) != len(header):
                    quar.append({"raw": ",".join(row), "reason": "col_count"})
                else:
                    good.append(dict(zip(header, row)))
            td = Path(tempfile.mkdtemp())
            with (td / "good.csv").open("w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=header)
                w.writeheader()
                w.writerows(good)
            with (td / "quarantine.csv").open("w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=["raw", "reason"])
                w.writeheader()
                w.writerows(quar)
            print("good", good)
            print("quarantine", quar)
            print((td / "good.csv").read_text(encoding="utf-8"))
            """
        ).strip(),
        "Cuarentena con motivo deja audit trail; good solo tiene filas sanas.",
        title="S08-T2-B-DEMO — quar",
        env="local-python",
    ),
    Demo(
        "S08-T3-A-DEMO", "S08-T3-A",
        "Exportar results a JSON array + JSONL",
        textwrap.dedent(
            """\
            import json
            from pathlib import Path
            import tempfile
            rows = [{"id": "T1", "monto": 10}, {"id": "T2", "monto": 5}]
            td = Path(tempfile.mkdtemp())
            (td / "txs.json").write_text(
                json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            with (td / "txs.jsonl").open("w", encoding="utf-8") as f:
                for r in rows:
                    f.write(json.dumps(r, ensure_ascii=False) + "\\n")
            print((td / "txs.json").read_text(encoding="utf-8"))
            print("jsonl lines", (td / "txs.jsonl").read_text(encoding="utf-8").splitlines())
            """
        ).strip(),
        "Array JSON para batch pequeño; JSONL para append y streaming de txs.",
        title="S08-T3-A-DEMO — json",
        env="local-python",
    ),
    Demo(
        "S08-T3-B-DEMO", "S08-T3-B",
        "validate_schema(obj, required) + campo opcional nuevo",
        textwrap.dedent(
            """\
            def validate_schema(obj, required):
                missing = [k for k in required if k not in obj]
                return len(missing) == 0, missing

            required = ["id", "email"]
            print(validate_schema({"id": "C1", "email": None}, required))
            print(validate_schema({"id": "C1"}, required))
            # evolución: campo opcional con default
            obj = {"id": "C1", "email": "a@ex.com"}
            obj.setdefault("segment", "standard")
            print(obj)
            """
        ).strip(),
        "Required estricto + defaults opcionales permiten evolucionar el contrato.",
        title="S08-T3-B-DEMO — schema",
        env="local-python",
    ),
    Demo(
        "S08-T4-A-DEMO", "S08-T4-A",
        "sha256 de input CSV + backup .bak",
        textwrap.dedent(
            """\
            from pathlib import Path
            import hashlib, shutil, tempfile
            td = Path(tempfile.mkdtemp())
            src = td / "clients.csv"
            src.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")
            digest = hashlib.sha256(src.read_bytes()).hexdigest()
            bak = Path(str(src) + ".bak")
            shutil.copy2(src, bak)
            print(digest)
            print("backup_ok", bak.exists() and bak.read_bytes() == src.read_bytes())
            """
        ).strip(),
        "Hash + backup del crudo son la provenance mínima del gate.",
        title="S08-T4-A-DEMO — hash",
        env="local-python",
    ),
    Demo(
        "S08-T4-B-DEMO", "S08-T4-B",
        "manifest.json de una corrida ETL",
        textwrap.dedent(
            """\
            import json
            from pathlib import Path
            import tempfile
            manifest = {
                "run_id": "demo-001",
                "n_in": 5,
                "n_clean": 4,
                "n_quarantine": 1,
                "inputs": [{"name": "clients.csv", "sha256": "deadbeef"}],
                "reconcile_ok": True,
            }
            manifest["reconcile_ok"] = (
                manifest["n_in"] == manifest["n_clean"] + manifest["n_quarantine"]
            )
            td = Path(tempfile.mkdtemp())
            path = td / "manifest.json"
            path.write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
            print(path.read_text(encoding="utf-8"))
            """
        ).strip(),
        "El manifest es la evidencia publicable de la corrida CP-N1-B.",
        title="S08-T4-B-DEMO — manifest",
        env="local-python",
    ),
]

S08_EX: list[Ex] = [
    Ex(
        "S08-T1-A-E1", "S08-T1-A", "guided",
        "E1 (guiado) — En un temp dir, crea `Path` a `demo.txt`, escribe 'hola', comprueba `exists` e imprime True/False.",
        "write_text + exists",
        "encoding utf-8",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\n# TODO",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'demo.txt'\np.write_text('hola', encoding='utf-8')\nprint(p.exists())",
        edge=["exists"],
        tests="True",
        feedback="exists evita abrir a ciegas.",
        title="path_exists.py",
    ),
    Ex(
        "S08-T1-A-E2", "S08-T1-A", "independent",
        "E2 (independiente) — Escribe 3 líneas con with open, luego lee con readlines strip e imprime la lista.",
        "with path.open('w', encoding='utf-8')",
        "newline natural \\n",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'lines.txt'\n# TODO write 3 lines y leer",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'lines.txt'\nwith p.open('w', encoding='utf-8') as f:\n    f.write('a\\nb\\nc\\n')\nwith p.open('r', encoding='utf-8') as f:\n    lines = [ln.strip() for ln in f]\nprint(lines)",
        edge=["with read"],
        tests="['a','b','c']",
        feedback="with cierra el handle aunque falle el cuerpo.",
        title="with_lines.py",
    ),
    Ex(
        "S08-T1-A-E3", "S08-T1-A", "transfer",
        "E3 (transferencia) — Simula UnicodeDecodeError leyendo bytes latinos como utf-8 strict si es latin-1 content… Mejor: escribe bytes no-UTF8 y captura UnicodeDecodeError al read_text utf-8. Imprime tipo de error y sugiere encoding o quarantine.",
        "path.write_bytes(b'\\xff\\xfe') o latin1 bytes inválidos en utf-8",
        "try/except UnicodeDecodeError",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'bad.txt'\n# TODO",
        "from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'bad.txt'\np.write_bytes(b'\\xff\\xfe\\xfa')\ntry:\n    p.read_text(encoding='utf-8')\nexcept UnicodeDecodeError as e:\n    print(type(e).__name__)\n    print('acción: cuarentenar archivo o reintentar con encoding documentado')",
        edge=["diagnóstico encoding"],
        tests="UnicodeDecodeError",
        feedback="Encoding roto → cuarentena de archivo, no crash silencioso a medias.",
        title="diag_decode.py",
    ),
    Ex(
        "S08-T1-B-E1", "S08-T1-B", "guided",
        "E1 (guiado) — Detecta si un `bytes` sample contiene CRLF `\\r\\n`. Imprime True para sample Windows y False para solo `\\n`.",
        "b'\\r\\n' in data",
        "Dos samples.",
        "win = b'a\\r\\nb\\r\\n'\nunix = b'a\\nb\\n'\n# TODO",
        "win = b'a\\r\\nb\\r\\n'\nunix = b'a\\nb\\n'\nprint(b'\\r\\n' in win)\nprint(b'\\r\\n' in unix)",
        edge=["CRLF"],
        tests="True False",
        feedback="Detectar newlines documenta origen del archivo.",
        title="detect_crlf.py",
    ),
    Ex(
        "S08-T1-B-E2", "S08-T1-B", "independent",
        "E2 (independiente) — Implementa `write_atomic` y verifica contenido final.",
        "tmp + os.replace",
        "mismo directorio que dest",
        "from pathlib import Path\nimport os, tempfile\n\ndef write_atomic(path, text):\n    # TODO\n    ...\ntd = Path(tempfile.mkdtemp())\np = td / 'out.txt'\nwrite_atomic(p, 'ok\\n')\nprint(p.read_text(encoding='utf-8'))",
        "from pathlib import Path\nimport os, tempfile\n\ndef write_atomic(path, text):\n    path = Path(path)\n    tmp = path.with_name(path.name + '.tmp')\n    tmp.write_text(text, encoding='utf-8')\n    os.replace(tmp, path)\ntd = Path(tempfile.mkdtemp())\np = td / 'out.txt'\nwrite_atomic(p, 'ok\\n')\nprint(p.read_text(encoding='utf-8'))",
        edge=["atomic"],
        tests="ok",
        feedback="Pieza reutilizable del ETL de salida.",
        title="atomic_impl.py",
    ),
    Ex(
        "S08-T1-B-E3", "S08-T1-B", "transfer",
        "E3 (transferencia) — Simula fallo mid-write: escribe dest parcial 'PARCIAL' y muestra que un atomic replace posterior deja 'COMPLETO'. Imprime ambos estados.",
        "Primero write no atómico parcial; luego write_atomic",
        "Contrasta riesgos.",
        "from pathlib import Path\nimport os, tempfile\ntd = Path(tempfile.mkdtemp())\ndest = td / 'f.txt'\n# TODO parcial luego atomic",
        "from pathlib import Path\nimport os, tempfile\ntd = Path(tempfile.mkdtemp())\ndest = td / 'f.txt'\ndest.write_text('PARCIAL', encoding='utf-8')\nprint('mid', dest.read_text(encoding='utf-8'))\ntmp = dest.with_name(dest.name + '.tmp')\ntmp.write_text('COMPLETO', encoding='utf-8')\nos.replace(tmp, dest)\nprint('final', dest.read_text(encoding='utf-8'))",
        edge=["mid-write vs atomic"],
        tests="PARCIAL luego COMPLETO",
        feedback="Atomic no arregla el pasado parcial; evita el estado intermedio al consumidor.",
        title="midwrite.py",
    ),
    Ex(
        "S08-T2-A-E1", "S08-T2-A", "guided",
        "E1 (guiado) — DictReader sobre StringIO con header id,nombre; imprime filas dict.",
        "csv.DictReader",
        "io.StringIO",
        "import csv, io\nraw = 'id,nombre\\nC001,Ana\\n'\n# TODO",
        "import csv, io\nraw = 'id,nombre\\nC001,Ana\\n'\nfor row in csv.DictReader(io.StringIO(raw)):\n    print(row)",
        edge=["header"],
        tests="C001 Ana",
        feedback="DictReader mapea columnas por nombre.",
        title="dictreader.py",
    ),
    Ex(
        "S08-T2-A-E2", "S08-T2-A", "independent",
        "E2 (independiente) — Escribe CSV con DictWriter (header id,nombre) a StringIO o temp y relee contando filas de datos = 1.",
        "writeheader + writerow",
        "newline='' si usas open file",
        "import csv, io\nbuf = io.StringIO()\n# TODO write y read\nprint(n)",
        "import csv, io\nbuf = io.StringIO()\nw = csv.DictWriter(buf, fieldnames=['id', 'nombre'])\nw.writeheader()\nw.writerow({'id': 'C001', 'nombre': 'Ana'})\nbuf.seek(0)\nrows = list(csv.DictReader(buf))\nn = len(rows)\nprint(n)\nprint(rows[0])",
        edge=["writer header"],
        tests="1 fila",
        feedback="Writer con header estable es contrato de salida clean.",
        title="dictwriter.py",
    ),
    Ex(
        "S08-T2-A-E3", "S08-T2-A", "transfer",
        "E3 (transferencia) — Cast de monto: si float() falla → reject con motivo. Procesa `['10', 'x', '3.5']` e imprime ok/reject.",
        "try float except ValueError",
        "No uses 0 silencioso.",
        "vals = ['10', 'x', '3.5']\n# TODO",
        "vals = ['10', 'x', '3.5']\nfor v in vals:\n    try:\n        m = float(v)\n        print('ok', m)\n    except ValueError:\n        print('reject', v, 'motivo=cast_monto')",
        edge=["cast fallido"],
        tests="ok/reject/ok",
        feedback="Cast fallido alimenta cuarentena con motivo.",
        title="cast_reject.py",
    ),
    Ex(
        "S08-T2-B-E1", "S08-T2-B", "guided",
        "E1 (guiado) — Detecta fila irregular: header len 2, row `['C1','Ana','x']` → irregular True.",
        "len(row) != len(header)",
        "print bool",
        "header = ['id', 'nombre']\nrow = ['C1', 'Ana', 'x']\n# TODO\nprint(irregular)",
        "header = ['id', 'nombre']\nrow = ['C1', 'Ana', 'x']\nirregular = len(row) != len(header)\nprint(irregular)",
        edge=["col count"],
        tests="True",
        feedback="Chequeo barato antes de Dict zip.",
        title="irregular.py",
    ),
    Ex(
        "S08-T2-B-E2", "S08-T2-B", "independent",
        "E2 (independiente) — Escribe una fila de cuarentena `{raw, reason}` a CSV en temp y relee imprimiendo reason.",
        "DictWriter fieldnames raw,reason",
        "newline=''",
        "from pathlib import Path\nimport csv, tempfile\ntd = Path(tempfile.mkdtemp())\n# TODO",
        "from pathlib import Path\nimport csv, tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'quarantine.csv'\nwith p.open('w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['raw', 'reason'])\n    w.writeheader()\n    w.writerow({'raw': 'C2,Luis,EXTRA', 'reason': 'col_count'})\nwith p.open(encoding='utf-8') as f:\n    rows = list(csv.DictReader(f))\nprint(rows[0]['reason'])",
        edge=["escribir cuarentena"],
        tests="col_count",
        feedback="Cuarentena es archivo de primera clase del gate.",
        title="write_quar.py",
    ),
    Ex(
        "S08-T2-B-E3", "S08-T2-B", "transfer",
        "E3 (transferencia) — Dada lista de reasons, imprime resumen contador sorted por reason.",
        "collections.Counter o dict",
        "sorted items",
        "reasons = ['col_count', 'cast_monto', 'col_count', 'schema']\n# TODO resumen",
        "from collections import Counter\nreasons = ['col_count', 'cast_monto', 'col_count', 'schema']\nfor k, v in sorted(Counter(reasons).items()):\n    print(k, v)",
        edge=["resumen motivos"],
        tests="conteos por reason",
        feedback="Resumen de motivos entra al manifest.",
        title="reason_summary.py",
    ),
    Ex(
        "S08-T3-A-E1", "S08-T3-A", "guided",
        "E1 (guiado) — `json.loads` de fixture `'{\"id\":\"C001\"}'` e imprime id.",
        "json.loads",
        "dict access",
        "import json\n# TODO\nprint(obj['id'])",
        "import json\nobj = json.loads('{\"id\":\"C001\"}')\nprint(obj['id'])",
        edge=["loads"],
        tests="C001",
        feedback="loads parsea string; load parsea file.",
        title="loads_fix.py",
    ),
    Ex(
        "S08-T3-A-E2", "S08-T3-A", "independent",
        "E2 (independiente) — `dumps` de `{'nombre':'José'}` con ensure_ascii=False e imprime (debe verse José, no \\u).",
        "ensure_ascii=False",
        "print string",
        "import json\n# TODO\nprint(s)",
        "import json\ns = json.dumps({'nombre': 'José'}, ensure_ascii=False)\nprint(s)",
        edge=["tildes"],
        tests="José legible",
        feedback="ensure_ascii=False para logs latam legibles.",
        title="dumps_utf8.py",
    ),
    Ex(
        "S08-T3-A-E3", "S08-T3-A", "transfer",
        "E3 (transferencia) — Intenta dumps de dict con datetime y captura TypeError; reintenta con isoformat str.",
        "datetime no serializable",
        "convierte a .isoformat()",
        "import json\nfrom datetime import datetime\nobj = {'ts': datetime(2026, 1, 15, 10, 0, 0)}\n# TODO",
        "import json\nfrom datetime import datetime\nobj = {'ts': datetime(2026, 1, 15, 10, 0, 0)}\ntry:\n    json.dumps(obj)\nexcept TypeError as e:\n    print(type(e).__name__)\nfixed = {'ts': obj['ts'].isoformat()}\nprint(json.dumps(fixed))",
        edge=["TypeError datetime"],
        tests="TypeError luego ISO",
        feedback="Serializa tipos no-JSON de forma explícita.",
        title="json_datetime.py",
    ),
    Ex(
        "S08-T3-B-E1", "S08-T3-B", "guided",
        "E1 (guiado) — Rechaza missing required: obj sin email con required [id,email] → ok False.",
        "list comprehension missing",
        "print ok, missing",
        "def validate_schema(obj, required):\n    # TODO\n    ...\nprint(validate_schema({'id': 'C1'}, ['id', 'email']))",
        "def validate_schema(obj, required):\n    missing = [k for k in required if k not in obj]\n    return len(missing) == 0, missing\nprint(validate_schema({'id': 'C1'}, ['id', 'email']))",
        edge=["required"],
        tests="False, ['email']",
        feedback="Schema mínimo del contrato de ingesta.",
        title="schema_required.py",
    ),
    Ex(
        "S08-T3-B-E2", "S08-T3-B", "independent",
        "E2 (independiente) — null explícito: `{'id':'C1','email': None}` tiene clave email (presente) con valor None. Imprime 'in' y valor.",
        "'email' in obj",
        "None is not missing key",
        "obj = {'id': 'C1', 'email': None}\n# TODO",
        "obj = {'id': 'C1', 'email': None}\nprint('email' in obj)\nprint(obj['email'])",
        edge=["null explícito"],
        tests="True / None",
        feedback="null JSON llega como None con clave presente.",
        title="null_explicit.py",
    ),
    Ex(
        "S08-T3-B-E3", "S08-T3-B", "transfer",
        "E3 (transferencia) — Añade campo opcional `segment` con default `'standard'` vía setdefault sin pisar si ya existe. Dos objs.",
        "setdefault",
        "No uses overwrite ciego",
        "a = {'id': 'C1'}\nb = {'id': 'C2', 'segment': 'vip'}\n# TODO setdefault ambos\nprint(a)\nprint(b)",
        "a = {'id': 'C1'}\nb = {'id': 'C2', 'segment': 'vip'}\na.setdefault('segment', 'standard')\nb.setdefault('segment', 'standard')\nprint(a)\nprint(b)",
        edge=["evolución compatible"],
        tests="standard vs vip",
        feedback="Defaults compatibles no rompen productores viejos.",
        title="default_field.py",
    ),
    Ex(
        "S08-T4-A-E1", "S08-T4-A", "guided",
        "E1 (guiado) — Calcula sha256 hex de un archivo temp con contenido conocido e imprime los primeros 8 chars + len digest 64.",
        "hashlib.sha256(path.read_bytes()).hexdigest()",
        "temp file",
        "from pathlib import Path\nimport hashlib, tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'f.bin'\np.write_bytes(b'abc')\n# TODO",
        "from pathlib import Path\nimport hashlib, tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'f.bin'\np.write_bytes(b'abc')\ndig = hashlib.sha256(p.read_bytes()).hexdigest()\nprint(dig[:8], len(dig))",
        edge=["hash file"],
        tests="len 64",
        feedback="Fingerprint del input para el manifest.",
        title="hash_file.py",
    ),
    Ex(
        "S08-T4-A-E2", "S08-T4-A", "independent",
        "E2 (independiente) — Copia backup con shutil.copy2 y verifica igualdad de bytes.",
        "shutil.copy2",
        "read_bytes compare",
        "from pathlib import Path\nimport shutil, tempfile\ntd = Path(tempfile.mkdtemp())\nsrc = td / 'in.csv'\nsrc.write_text('a\\n', encoding='utf-8')\n# TODO bak",
        "from pathlib import Path\nimport shutil, tempfile\ntd = Path(tempfile.mkdtemp())\nsrc = td / 'in.csv'\nsrc.write_text('a\\n', encoding='utf-8')\nbak = td / 'in.csv.bak'\nshutil.copy2(src, bak)\nprint(bak.read_bytes() == src.read_bytes())",
        edge=["backup"],
        tests="True",
        feedback="Backup antes de cualquier mutación del workspace de entrada.",
        title="backup_copy.py",
    ),
    Ex(
        "S08-T4-A-E3", "S08-T4-A", "transfer",
        "E3 (transferencia) — Arma dict de provenance `{path, sha256, bytes}` para un temp file e imprímelo (path solo name).",
        "stat().st_size",
        "sha256 completo ok",
        "from pathlib import Path\nimport hashlib, tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'clients.csv'\np.write_text('id\\nC1\\n', encoding='utf-8')\n# TODO provenance",
        "from pathlib import Path\nimport hashlib, tempfile\ntd = Path(tempfile.mkdtemp())\np = td / 'clients.csv'\np.write_text('id\\nC1\\n', encoding='utf-8')\nprov = {\n    'path': p.name,\n    'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),\n    'bytes': p.stat().st_size,\n}\nprint(prov)",
        edge=["provenance dict"],
        tests="3 keys",
        feedback="Provenance mínima por fuente del gate.",
        title="provenance_dict.py",
    ),
    Ex(
        "S08-T4-B-E1", "S08-T4-B", "guided",
        "E1 (guiado) — Campos mínimos del manifest: imprime un dict con run_id, n_in, n_clean, n_quarantine, inputs.",
        "5 claves mínimas",
        "inputs es lista",
        "manifest = {\n    # TODO\n}\nprint(sorted(manifest))",
        "manifest = {\n    'run_id': 'r1',\n    'n_in': 3,\n    'n_clean': 2,\n    'n_quarantine': 1,\n    'inputs': [{'name': 'clients.csv'}],\n}\nprint(sorted(manifest))",
        edge=["campos mínimos"],
        tests="5 keys sorted",
        feedback="Contrato del artefacto de evidencia.",
        title="manifest_min.py",
    ),
    Ex(
        "S08-T4-B-E2", "S08-T4-B", "independent",
        "E2 (independiente) — Reconcilia conteos: función `reconcile(n_in, n_clean, n_quar) -> bool`.",
        "n_in == n_clean + n_quar",
        "Prueba 5=3+2 y 5=3+1",
        "def reconcile(n_in, n_clean, n_quar):\n    # TODO\n    ...\nprint(reconcile(5, 3, 2))\nprint(reconcile(5, 3, 1))",
        "def reconcile(n_in, n_clean, n_quar):\n    return n_in == n_clean + n_quar\nprint(reconcile(5, 3, 2))\nprint(reconcile(5, 3, 1))",
        edge=["reconciliación"],
        tests="True False",
        feedback="Igualdad contable es el corazón del gate.",
        title="reconcile.py",
    ),
    Ex(
        "S08-T4-B-E3", "S08-T4-B", "transfer",
        "E3 (transferencia) — Si reconcile falla, imprime error y usa `raise SystemExit(1)` o simula con print de exit code 1. Si ok, print OK.",
        "No publiques clean si no cuadra",
        "Dos escenarios.",
        "def run(n_in, n_clean, n_quar):\n    # TODO\n    ...\nrun(4, 2, 2)\nrun(4, 2, 1)",
        "def run(n_in, n_clean, n_quar):\n    if n_in != n_clean + n_quar:\n        print('ERROR reconcile', n_in, n_clean, n_quar)\n        print('exit_code', 1)\n        return 1\n    print('OK')\n    print('exit_code', 0)\n    return 0\nrun(4, 2, 2)\nrun(4, 2, 1)",
        edge=["fail closed"],
        tests="OK luego ERROR",
        feedback="Fail closed protege consumidores del clean.",
        title="fail_reconcile.py",
    ),
]

S08_YOUDO = '''\
"""etl_cp_n1_b.py — Client/Transaction ETL Pipeline (cierre CP-N1-B / S08)
Ingesta CSV+JSON sintéticos → clean/quarantine/manifest.
stdlib only. Local-python.
"""

from __future__ import annotations

import csv
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Estructura esperada:
# data/clients.csv
# data/transactions.json
# out/clean/
# out/quarantine/
# out/manifest.json


def sha256_file(path: Path) -> str:
    # TODO
    raise NotImplementedError


def write_atomic(path: Path, text: str) -> None:
    # TODO
    raise NotImplementedError


def load_clients_csv(path: Path) -> tuple[list[dict], list[dict]]:
    """→ (good_rows, quarantine_rows with reason)."""
    # TODO irregular rows + casts
    raise NotImplementedError


def load_transactions_json(path: Path) -> tuple[list[dict], list[dict]]:
    # TODO schema mínimo id, client_id, monto
    raise NotImplementedError


def build_manifest(
    *,
    n_in: int,
    n_clean: int,
    n_quarantine: int,
    inputs: list[dict],
) -> dict[str, Any]:
    # TODO reconcile_ok
    raise NotImplementedError


def run(data_dir: Path, out_dir: Path) -> int:
    """Retorna exit code 0/1."""
    # TODO backup, load, write clean/quar, manifest, fail if not reconcile
    raise NotImplementedError


def main() -> None:
    root = Path(__file__).resolve().parent
    code = run(root / "data", root / "out")
    raise SystemExit(code)


if __name__ == "__main__":
    main()
'''


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # ── S06 ──────────────────────────────────────────────────────────────
    s06_meta = {
        "id": "numpy",
        "index": 6,
        "title": "Colecciones y estructuras de datos",
        "shortTitle": "Colecciones",
        "tagline": "listas, dicts, sets y estructuras anidadas para modelo en memoria",
        "estimatedHours": 6,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Layers",
        "accentColor": "bg-gradient-to-br from-blue-500 to-indigo-600",
        "jobRelevance": (
            "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, "
            "antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y "
            "transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** "
            "y salidas **deterministas**. Esta sección (id de plataforma `numpy` conservado) retematiza "
            "a colecciones V3 e inicia el bloque **CP-N1-B** sin NumPy/pandas."
        ),
        "learningOutcomes": [
            "Usar list/tuple y slicing para ventanas de registros sin copiar de más",
            "Desempaquetar secuencias y distinguir alias vs copia superficial/profunda",
            "Modelar registros con dict, get e índices id→fila",
            "Deduplicar con set y reportar conflictos sin borrarlos",
            "Navegar list[dict] anidados cliente→contactos→txs",
            "Acceder campos opcionales sin KeyError; missing vs vacío",
            "Ordenar con sorted(..., key=) de forma estable",
            "Elegir list/dict/set y producir JSON determinista",
        ],
    }
    s06_youdo = {
        "title": "Modelo tabular en memoria (CP-N1-B)",
        "context": (
            "Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en "
            "estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando "
            "conflictos**, aplanas txs y exportas JSON determinista. En S07–S08 se suma normalización "
            "latam e ingesta por archivos. Solo datos sintéticos."
        ),
        "objectives": [
            "Representar cliente/contacto/tx en list[dict] documentado",
            "Implementar dedup_report → unique + conflicts",
            "Aplanar transacciones con client_id",
            "Acceso seguro a faltantes (get_nested)",
            "Export determinista (sorted + sort_keys)",
        ],
        "requirements": [
            "Tipos list[dict] o índices dict documentados",
            "dedup_report(rows, key_fn) sin borrar conflictos",
            "sorted determinista en exports",
            "Datos sintéticos latam (example.com)",
            "Sin NumPy/pandas en este incremento V3",
        ],
        "starterCode": S06_YOUDO,
        "portfolioNote": (
            "En el README muestra el shape del store, un ejemplo de conflicto de dedup y el JSON "
            "determinista de demo. Eso evidencia el incremento en memoria de CP-N1-B."
        ),
        "rubric": [
            ("Modelo completo cliente/contacto/tx", "25%"),
            ("Dedup sin borrar conflictos", "25%"),
            ("Determinismo de salida", "20%"),
            ("Acceso seguro a faltantes", "15%"),
            ("Elección de estructuras justificada", "15%"),
        ],
    }
    s06_self = [
        {
            "question": "¿Qué produce xs[-2:] si xs = [1,2,3,4]?",
            "options": ["[1,2]", "[3,4]", "[4]", "Error"],
            "correctIndex": 1,
            "explanation": "Slicing negativo toma desde el final: últimos 2 elementos [3,4].",
        },
        {
            "question": "b = a (listas) y mutas b.append(1). ¿Qué pasa con a?",
            "options": [
                "a no cambia",
                "a también ve el append (alias)",
                "se lanza error",
                "a se convierte en tuple",
            ],
            "correctIndex": 1,
            "explanation": "Asignación alias: ambas variables apuntan al mismo objeto lista.",
        },
        {
            "question": "Para reportar dos filas con mismo id y payload distinto debes…",
            "options": [
                "Borrar ambas",
                "Quedarte con la última sin traza",
                "Listar conflicto en conflicts sin silenciar",
                "Convertir a set de dicts",
            ],
            "correctIndex": 2,
            "explanation": "CP-N1-B: unique + conflicts; no borrar la evidencia del choque.",
        },
        {
            "question": "rows.sort(key=...) retorna…",
            "options": ["la lista ordenada", "None (muta in-place)", "una tuple", "un set"],
            "correctIndex": 1,
            "explanation": "list.sort muta y retorna None; usa sorted(...) para copia.",
        },
        {
            "question": "json.dumps(..., sort_keys=True) ayuda a…",
            "options": [
                "comprimir el archivo",
                "salidas deterministas/reproducibles",
                "validar schema JSON Schema",
                "encriptar PII",
            ],
            "correctIndex": 1,
            "explanation": "Orden estable de claves + sort de filas = demos reproducibles.",
        },
    ]
    s06_res = {
        "docs": [
            {
                "label": "Python Tutorial — Data Structures",
                "url": "https://docs.python.org/3/tutorial/datastructures.html",
                "note": "list, dict, set, comprehensions",
            },
            {
                "label": "copy — Shallow and deep copy",
                "url": "https://docs.python.org/3/library/copy.html",
                "note": "alias vs shallow vs deep",
            },
            {
                "label": "json — JSON encoder/decoder",
                "url": "https://docs.python.org/3/library/json.html",
                "note": "sort_keys, ensure_ascii",
            },
        ],
        "books": [
            {
                "label": "Python Crash Course (Matthes)",
                "note": "Capítulos de listas/dicts; aplicar al modelo cliente/tx sintético.",
            },
            {
                "label": "Fluent Python (Ramalho) — selecciones",
                "note": "Secuencias y dicts; profundidad opcional post-S06.",
            },
        ],
        "courses": [
            {
                "label": "CS50P — Data structures",
                "url": "https://cs50.harvard.edu/python/",
                "note": "Práctica de collections; adaptar a CP-N1-B sintético.",
            },
        ],
    }

    print("Building S06…")
    s06_ts, s06_log = build_section(
        "section06",
        s06_meta,
        S06_THEORY,
        S06_DEMOS,
        S06_EX,
        "Ocho demos I Do (uno por subtema). Orden T1→T4. Modelo en memoria del inicio CP-N1-B. Datos sintéticos; browser-pyodide (stdlib).",
        "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara. Sin NumPy/pandas. Datos sintéticos.",
        s06_youdo,
        s06_self,
        s06_res,
    )
    out06 = SECTIONS / "s06-numpy.ts"
    out06.write_text(s06_ts, encoding="utf-8")
    print(f"Wrote {out06} ({len(s06_ts.splitlines())} lines)")

    # ── S07 ──────────────────────────────────────────────────────────────
    s07_meta = {
        "id": "data-acquisition",
        "index": 7,
        "title": "Texto, Unicode y expresiones regulares",
        "shortTitle": "Texto & Unicode",
        "tagline": "Unicode latam, strings y regex sin sobrevalidar",
        "estimatedHours": 14,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Languages",
        "accentColor": "bg-gradient-to-br from-teal-500 to-cyan-600",
        "jobRelevance": (
            "Los datasets de clientes en Latam rompen normalizadores pensados para ASCII/US: tildes, ñ, "
            "dos apellidos y partículas. Si tu matching afirma identidad o parentesco por un score, "
            "creas riesgo de producto y cumplimiento. Esta sección (id `data-acquisition` conservado) "
            "enseña Unicode, str antes que regex, y evidencia sin overvalidation — tramo central de **CP-N1-B**."
        ),
        "learningOutcomes": [
            "Normalizar Unicode (NFC/NFD) y usar casefold en comparaciones",
            "Modelar nombres latam con dos apellidos y partículas sin forzar formato US",
            "Manipular texto con métodos str idiomáticos antes de regex",
            "Normalizar email/teléfono con reglas modestas sin overvalidation",
            "Escribir patrones con grupos y anchors ^$",
            "Compilar patrones, extraer con findall/finditer y conocer límites",
            "Comparar por igualdad normalizada y Jaccard de tokens",
            "Razonar FP/FN y conservar evidencia sin claims de parentesco",
        ],
    }
    s07_youdo = {
        "title": "Normalización latinoamericana (CP-N1-B)",
        "context": (
            "Continúas **CP-N1-B**: un pipeline de texto que conserva **raw**, emite **normalized** y "
            "registra **transforms** por campo. Unicode NFC, nombres con dos apellidos, email/tel modestos, "
            "regex solo donde aporta. Sin scraping/API. Sin afirmar parentesco ni identidad legal."
        ),
        "objectives": [
            "normalize_record → {raw, normalized, transforms}",
            "NFC + casefold donde corresponda",
            "Dos apellidos / review si incompleto",
            "Regex responsable; str primero",
            "Tests de ejemplos latam sintéticos",
        ],
        "requirements": [
            "Firma normalize_record(raw: dict) documentada",
            "Unicode NFC en campos de nombre",
            "Sin scraping/API en este incremento V3",
            "Datos sintéticos peruanos/latam",
            "No overvalidation de email/teléfono",
            "Evidencia de match sin claims de parentesco",
        ],
        "starterCode": S07_YOUDO,
        "portfolioNote": (
            "Muestra en README 3 casos: nombre con partícula, email con +, teléfono con máscara; "
            "tabla raw→normalized→transforms. Subraya la política ética de no-parentesco."
        ),
        "rubric": [
            ("raw + normalized + transforms", "25%"),
            ("Unicode y nombres latam", "25%"),
            ("Regex responsable", "15%"),
            ("Sin overvalidation", "15%"),
            ("Evidencia sin parentesco", "10%"),
            ("Tests de ejemplos latam", "10%"),
        ],
    }
    s07_self = [
        {
            "question": "¿Por qué 'José' y 'Jose\\u0301' pueden fallar en == ?",
            "options": [
                "Python no soporta tildes",
                "Formas Unicode distintas (NFC vs NFD)",
                "casefold borra la é",
                "Son de tipos distintos",
            ],
            "correctIndex": 1,
            "explanation": "Misma apariencia, distinta secuencia de code points; normalize NFC antes de comparar.",
        },
        {
            "question": "En nombres latam, si solo hay un token, la política segura es…",
            "options": [
                "Inventar apellido2 vacío en silencio",
                "Marcar review y conservar raw",
                "Rechazar y borrar el registro",
                "Asumir formato first/last US",
            ],
            "correctIndex": 1,
            "explanation": "Sin datos suficientes → review; no inventar demografía.",
        },
        {
            "question": "¿Cuándo preferir str.replace/split sobre regex?",
            "options": [
                "Nunca",
                "Cuando la transformación es literal/simple",
                "Solo en emails",
                "Solo si el string es ASCII",
            ],
            "correctIndex": 1,
            "explanation": "str methods son más legibles y evitan overfit/backtracking.",
        },
        {
            "question": "fullmatch(r'\\d{8}', 'DNI 12345678') devuelve…",
            "options": ["match del número", "None (no es full match)", "True booleano", "excepción"],
            "correctIndex": 1,
            "explanation": "fullmatch exige que toda la cadena cumpla el patrón.",
        },
        {
            "question": "Un Jaccard 0.67 entre nombres debe…",
            "options": [
                "Fusionar identidades automáticamente",
                "Afirmar parentesco",
                "Ir a review con evidencia (raw, score)",
                "Borrar ambos registros",
            ],
            "correctIndex": 2,
            "explanation": "Score medio → review; sin claims de identidad/parentesco.",
        },
    ]
    s07_res = {
        "docs": [
            {
                "label": "unicodedata — Unicode Database",
                "url": "https://docs.python.org/3/library/unicodedata.html",
                "note": "normalize NFC/NFD",
            },
            {
                "label": "re — Regular expressions",
                "url": "https://docs.python.org/3/library/re.html",
                "note": "fullmatch, groups, compile",
            },
            {
                "label": "Unicode HOWTO",
                "url": "https://docs.python.org/3/howto/unicode.html",
                "note": "Code points y encodings",
            },
        ],
        "books": [
            {
                "label": "Fluent Python — strings/bytes (selección)",
                "note": "Profundizar Unicode tras los ejercicios de S07.",
            },
            {
                "label": "Regular Expressions Cookbook (opcional)",
                "note": "Solo patrones simples; evita catástrofes de backtracking.",
            },
        ],
        "courses": [
            {
                "label": "RegexOne",
                "url": "https://regexone.com/",
                "note": "Práctica interactiva; aplica con moderación al intake.",
            },
        ],
    }

    print("Building S07…")
    s07_ts, s07_log = build_section(
        "section07",
        s07_meta,
        S07_THEORY,
        S07_DEMOS,
        S07_EX,
        "Ocho demos I Do T1→T4. Normalización latam del tramo CP-N1-B. Datos sintéticos; browser-pyodide (stdlib: unicodedata, re).",
        "Andamiaje E1→E2→E3 por subtema (24 ejercicios, 2 hints). str antes que regex; sin overvalidation; sin claims de parentesco.",
        s07_youdo,
        s07_self,
        s07_res,
    )
    out07 = SECTIONS / "s07-data-acquisition.ts"
    out07.write_text(s07_ts, encoding="utf-8")
    print(f"Wrote {out07} ({len(s07_ts.splitlines())} lines)")

    # ── S08 ──────────────────────────────────────────────────────────────
    s08_meta = {
        "id": "pandas",
        "index": 8,
        "title": "Archivos, CSV, JSON y contratos de ingesta",
        "shortTitle": "Archivos & ETL",
        "tagline": "pathlib, CSV/JSON, cuarentena y manifest de ingesta",
        "estimatedHours": 12,
        "level": "Intermedio",
        "phase": 0,
        "icon": "FileStack",
        "accentColor": "bg-gradient-to-br from-green-500 to-emerald-600",
        "jobRelevance": (
            "El gate **CP-N1-B** se cierra cuando puedes **ingerir archivos reales de negocio** (aunque sean "
            "sintéticos en el curso): CSV de clientes, JSON de transacciones, cuarentena con motivo, "
            "hashes, backup y **manifest reconciliado**. En junior data/analytics engineering en Perú "
            "esto pesa más que un groupby de demo. Id de plataforma `pandas` se conserva; el contenido "
            "V3 es stdlib + contratos de ingesta (pandas EDA se difiere al nivel 2)."
        ),
        "learningOutcomes": [
            "Abrir archivos con pathlib/Path y with; encoding utf-8 explícito",
            "Manejar newlines y escritura atómica (temp + replace)",
            "Leer/escribir CSV con headers y casts controlados",
            "Enviar filas irregulares a cuarentena con motivo",
            "Serializar/deserializar JSON (array y JSONL)",
            "Validar schema mínimo, nulls y defaults compatibles",
            "Calcular hashes, backup y provenance de inputs",
            "Emitir manifest con conteos reconciliados in=clean+quarantine",
        ],
    }
    s08_youdo = {
        "title": "Client/Transaction ETL Pipeline (cierre CP-N1-B)",
        "context": (
            "Cierras el gate **CP-N1-B**. Integras normalizadores (S05–S07) y el modelo en memoria (S06) "
            "en un ETL **local-python**: `data/clients.csv` + `data/transactions.json` (sintéticos) → "
            "`out/clean/`, `out/quarantine/`, `out/manifest.json` con hashes y reconciliación. "
            "CLI instalable se difiere a S10. Sin PII real; sin claims de fraude/parentesco."
        ),
        "objectives": [
            "Ingesta CSV y JSON con contratos documentados",
            "Validar/normalizar y cuarentenar rejects con motivo",
            "Manifest con hashes, conteos y provenance",
            "Pruebas normal / borde / error",
            "Fail closed si reconcile no cuadra",
        ],
        "requirements": [
            "Entradas sintéticas clients.csv + transactions.json",
            "Salidas out/clean/, out/quarantine/, out/manifest.json",
            "Integrar normalizadores y modelo en memoria",
            "README + demo local-python reproducible",
            "n_in == n_clean + n_quarantine o exit != 0",
            "Empaquetado CLI diferido a S10",
        ],
        "starterCode": S08_YOUDO,
        "portfolioNote": (
            "Adjunta manifest de demo, 1 fila de cuarentena con motivo, hashes de inputs y un test de "
            "reconciliación fallida (exit 1). Esa carpeta es evidencia del gate CP-N1-B."
        ),
        "rubric": [
            ("Ingesta CSV+JSON correcta", "20%"),
            ("Validación + cuarentena", "20%"),
            ("Manifest y reconciliación", "20%"),
            ("Hashes/backups/provenance", "15%"),
            ("Pruebas normal/borde/error", "15%"),
            ("README y reproducibilidad local", "10%"),
        ],
    }
    s08_self = [
        {
            "question": "¿Por qué declarar encoding='utf-8' al abrir texto?",
            "options": [
                "Es más rápido",
                "Evita depender del locale del SO (p. ej. Windows)",
                "Comprime el archivo",
                "Activa pathlib",
            ],
            "correctIndex": 1,
            "explanation": "El default de texto no es portátil; UTF-8 explícito evita mojibake y DecodeError sorpresa.",
        },
        {
            "question": "Escritura atómica típica es…",
            "options": [
                "open(dest,'w') y escribir directo siempre",
                "escribir temp y os.replace al destino",
                "solo print al stdout",
                "append eterno al mismo file",
            ],
            "correctIndex": 1,
            "explanation": "temp + replace evita dejar dest truncado si hay crash mid-write.",
        },
        {
            "question": "Una fila CSV con columnas de más debe…",
            "options": [
                "Ignorarse en silencio",
                "Rellenarse con None sin traza",
                "Ir a cuarentena con motivo",
                "Pisar el header",
            ],
            "correctIndex": 2,
            "explanation": "Irregular → quarantine + reason; no desalinear en silencio.",
        },
        {
            "question": "Reconciliación del manifest exige…",
            "options": [
                "n_clean > n_in",
                "n_in == n_clean + n_quarantine",
                "solo n_quarantine == 0",
                "hash del clean == hash del input",
            ],
            "correctIndex": 1,
            "explanation": "Toda fila de entrada termina en clean o quarantine (para ese stream).",
        },
        {
            "question": "Si reconcile falla, el pipeline debe…",
            "options": [
                "Publicar clean igual",
                "Fallar (exit non-zero) / fail closed",
                "Borrar el manifest",
                "Convertir a pandas automáticamente",
            ],
            "correctIndex": 1,
            "explanation": "Fail closed protege a consumidores; el gate exige conteos cuadrados.",
        },
    ]
    s08_res = {
        "docs": [
            {
                "label": "pathlib — Object-oriented filesystem paths",
                "url": "https://docs.python.org/3/library/pathlib.html",
                "note": "Path, read_text, write_text",
            },
            {
                "label": "csv — CSV File Reading and Writing",
                "url": "https://docs.python.org/3/library/csv.html",
                "note": "DictReader/Writer, newline=''",
            },
            {
                "label": "json — JSON encoder and decoder",
                "url": "https://docs.python.org/3/library/json.html",
                "note": "load/dump, ensure_ascii",
            },
            {
                "label": "hashlib — Secure hashes",
                "url": "https://docs.python.org/3/library/hashlib.html",
                "note": "sha256 de inputs",
            },
        ],
        "books": [
            {
                "label": "Python Cookbook (Beazley/Jones) — files/csv",
                "note": "Patrones de archivos; adaptar a cuarentena/manifest del curso.",
            },
            {
                "label": "Data Engineering practices (genérico)",
                "note": "Idempotencia, lineage y fail closed — alinear con CP-N1-B.",
            },
        ],
        "courses": [
            {
                "label": "Real Python — Working with files",
                "url": "https://realpython.com/working-with-files-in-python/",
                "note": "pathlib y contextos; practicar en local-python.",
            },
        ],
    }

    print("Building S08…")
    s08_ts, s08_log = build_section(
        "section08",
        s08_meta,
        S08_THEORY,
        S08_DEMOS,
        S08_EX,
        "Ocho demos I Do T1→T4 en **local-python** (filesystem/temp). Cierran piezas del ETL gate CP-N1-B. Datos sintéticos únicamente.",
        "Andamiaje E1→E2→E3 × 8 (24 ejercicios, 2 hints). pathlib/csv/json/hashlib stdlib. Fail closed en reconcile. Sin pandas obligatorio.",
        s08_youdo,
        s08_self,
        s08_res,
    )
    out08 = SECTIONS / "s08-pandas.ts"
    out08.write_text(s08_ts, encoding="utf-8")
    print(f"Wrote {out08} ({len(s08_ts.splitlines())} lines)")

    # ── Progress + lane ──────────────────────────────────────────────────
    s06_slugs = [
        ("S06-T1-A", "list-tuple-slicing"),
        ("S06-T1-B", "unpacking-aliasing-copy"),
        ("S06-T2-A", "dicts-membership"),
        ("S06-T2-B", "sets-dedup"),
        ("S06-T3-A", "nested-traversal"),
        ("S06-T3-B", "safe-access-missing"),
        ("S06-T4-A", "sort-key"),
        ("S06-T4-B", "structure-choice-determinism"),
    ]
    s07_slugs = [
        ("S07-T1-A", "unicode-normalization-casefold"),
        ("S07-T1-B", "latam-names-particles"),
        ("S07-T2-A", "string-ops"),
        ("S07-T2-B", "names-emails-phones"),
        ("S07-T3-A", "regex-patterns-groups"),
        ("S07-T3-B", "compile-extract-limits"),
        ("S07-T4-A", "exact-token-similarity"),
        ("S07-T4-B", "fp-fn-evidence"),
    ]
    s08_slugs = [
        ("S08-T1-A", "pathlib-with-modes"),
        ("S08-T1-B", "newlines-atomic-write"),
        ("S08-T2-A", "csv-dialects-headers"),
        ("S08-T2-B", "irregular-rows-quarantine"),
        ("S08-T3-A", "json-serialize"),
        ("S08-T3-B", "schema-nulls-evolution"),
        ("S08-T4-A", "backups-hashes-provenance"),
        ("S08-T4-B", "reconciliation-manifest"),
    ]

    def make_progress(section, section_id, ts_path, meta_updates, slugs, log, youdo_title, legacy_note):
        items = [
            {"id": k, "status": v, "notes": "python3 executed; output embedded"}
            for k, v in log.items()
        ]
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
            "lane": "LANE-S06-S08-P4",
            "generated_at": now,
            "prompt_version": "3.2",
            "authority": (
                "PARALLEL_PRODUCTION author agent — does not mark section passed; "
                "does not edit checkpoint/ledger/seed/s01-s05/orchestration"
            ),
            "preamble": {
                "objective": f"Retarget {section_id} section TS to V3 roadmap; author full packages for all 8 subtopics.",
                "scope_in": [
                    ts_path,
                    f"course-state/{section.lower()}_phase4_progress.json",
                    "course-state/lanes/LANE-S06-S08-P4.status.json",
                ],
                "scope_out": [
                    "checkpoint.json",
                    "section_ledger.json",
                    "issue_registry.json",
                    "parallel_orchestration.json",
                    "s01-setup.ts",
                    "s02-basics.ts",
                    "s03-data-structures.ts",
                    "s04-functions-modules.ts",
                    "s05-oop.ts",
                    "prisma/seed.ts",
                    "PHASE 5 exam A/B/C stems",
                    "section_passed",
                ],
            },
            "meta_updates": {**meta_updates, "legacy_note": legacy_note},
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
            "next_action": (
                f"PHASE 5 exam bank for {section_id} V3 slugs. "
                f"Do not mark {section} passed from this lane."
            ),
        }

    p06 = make_progress(
        "S06",
        "numpy",
        "src/lib/course/sections/s06-numpy.ts",
        {
            "id": "numpy",
            "index": 6,
            "title": s06_meta["title"],
            "shortTitle": s06_meta["shortTitle"],
            "tagline": s06_meta["tagline"],
            "estimatedHours": 6,
            "learningOutcomes": 8,
            "youDo": "Modelo tabular en memoria (CP-N1-B)",
            "icon": "Layers",
        },
        s06_slugs,
        s06_log,
        "Modelo tabular en memoria (CP-N1-B)",
        "NumPy vectorization demoted; target is in-memory collections for CP-N1-B",
    )
    p07 = make_progress(
        "S07",
        "data-acquisition",
        "src/lib/course/sections/s07-data-acquisition.ts",
        {
            "id": "data-acquisition",
            "index": 7,
            "title": s07_meta["title"],
            "shortTitle": s07_meta["shortTitle"],
            "tagline": s07_meta["tagline"],
            "estimatedHours": 14,
            "learningOutcomes": 8,
            "youDo": "Normalización latinoamericana (CP-N1-B)",
            "icon": "Languages",
        },
        s07_slugs,
        s07_log,
        "Normalización latinoamericana (CP-N1-B)",
        "Scraping/API/SQL demoted; target is Unicode/str/regex latam for CP-N1-B",
    )
    p08 = make_progress(
        "S08",
        "pandas",
        "src/lib/course/sections/s08-pandas.ts",
        {
            "id": "pandas",
            "index": 8,
            "title": s08_meta["title"],
            "shortTitle": s08_meta["shortTitle"],
            "tagline": s08_meta["tagline"],
            "estimatedHours": 12,
            "learningOutcomes": 8,
            "youDo": "Client/Transaction ETL Pipeline (cierre CP-N1-B)",
            "icon": "FileStack",
            "gate": "CP-N1-B",
        },
        s08_slugs,
        s08_log,
        "Client/Transaction ETL Pipeline (cierre CP-N1-B)",
        "pandas EDA demoted to L2; target is stdlib file/CSV/JSON ETL gate CP-N1-B",
    )

    (STATE / "s06_phase4_progress.json").write_text(
        json.dumps(p06, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s07_phase4_progress.json").write_text(
        json.dumps(p07, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s08_phase4_progress.json").write_text(
        json.dumps(p08, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lane = {
        "lane_id": "LANE-S06-S08-P4",
        "parent_lane": None,
        "sections": ["S06", "S07", "S08"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S06": {
            "section_id": "numpy",
            "subtopics_done": [s[0] for s in s06_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
        },
        "S07": {
            "section_id": "data-acquisition",
            "subtopics_done": [s[0] for s in s07_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
        },
        "S08": {
            "section_id": "pandas",
            "subtopics_done": [s[0] for s in s08_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-B",
        },
        "exercises_done": 72,
        "exercises_target": 72,
        "demos_done": 24,
        "demos_target": 24,
        "files_changed": [
            "src/lib/course/sections/s06-numpy.ts",
            "src/lib/course/sections/s07-data-acquisition.ts",
            "src/lib/course/sections/s08-pandas.ts",
            "course-state/s06_phase4_progress.json",
            "course-state/s07_phase4_progress.json",
            "course-state/s08_phase4_progress.json",
            "course-state/lanes/LANE-S06-S08-P4.status.json",
            "scripts/_gen_s06_s07_s08_p4.py",
        ],
        "execution_summary": (
            "Retargeted S06 to V3 Colecciones (CP-N1-B memory model), S07 to V3 Texto/Unicode/regex "
            "(latam normalize), S08 to V3 Archivos CSV/JSON (gate CP-N1-B close). Full packages 8 "
            "subtopics each (theory+demo+E1/E2/E3, 2 hints). Platform ids numpy / data-acquisition / "
            "pandas preserved. All demos/solutions executed with python3; UNVERIFIED=[]. Español "
            "peruano; synthetic data only."
        ),
        "blockers": [],
        "do_not_edit": [
            "course-state/checkpoint.json",
            "course-state/section_ledger.json",
            "course-state/issue_registry.json",
            "course-state/parallel_orchestration.json",
            "src/lib/course/sections/s01-setup.ts",
            "src/lib/course/sections/s02-basics.ts",
            "src/lib/course/sections/s03-data-structures.ts",
            "src/lib/course/sections/s04-functions-modules.ts",
            "src/lib/course/sections/s05-oop.ts",
            "prisma/seed.ts",
        ],
        "next_action": (
            "PHASE 5 exam banks for numpy, data-acquisition, pandas V3 slugs. "
            "Do not mark S06/S07/S08 passed from this lane."
        ),
    }
    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / "LANE-S06-S08-P4.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print(
        "Verified counts:",
        len(s06_log),
        len(s07_log),
        len(s08_log),
        "UNVERIFIED=[]",
    )


if __name__ == "__main__":
    main()
