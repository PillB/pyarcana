#!/usr/bin/env python3
"""Generate S09, S10, S11 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S09-S11-P4 Author. Does not touch seed/checkpoint/ledger/s01-s08.
Platform ids preserved: visualization / sklearn / testing.
V3 themes: exceptions-logging / modules-CLI / OOP domain model (familiarity).
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
LANE_ID = "LANE-S09-S11-P4"


def run_py(code: str) -> str:
    # Host may be Python 3.9: enable postponed annotations for list[str], X | Y, etc.
    if "from __future__ import annotations" not in code:
        code = "from __future__ import annotations\n" + code
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
    ts_path: str,
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
            "objective": phase_note,
            "scope_in": [
                ts_path,
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
        "next_action": (
            f"PHASE 5 exam bank for {section_id} V3 slugs. "
            f"Do not mark {section} passed from this lane."
        ),
    }


# ═══════════════════════════════════════════════════════════════════════════
# S09 — Excepciones, debugging y logging seguro (platform id: visualization)
# ═══════════════════════════════════════════════════════════════════════════

S09_THEORY: list[Theory] = [
    Theory(
        heading="De “Data Visualization” a excepciones, debugging y logging (mapa)",
        paragraphs=[
            "En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**. Ese material se reubica al tramo de reporting/visualización de datos. Aquí arranca **CP-N1-C**: el pipeline de familiaridad necesita **excepciones específicas**, **diagnóstico** y **logging sin PII**.",
            "El hilo conductor es un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`): validar filas, capturar fallos, redactar PII en logs y decidir fail-fast vs cuarentena. Entorno **local-python**.",
            "Orden: **T1 Excepciones** → **T2 Diagnóstico** → **T3 Logging** → **T4 Resiliencia**. Id de plataforma `visualization` se conserva.",
        ],
        callout=(
            "info",
            "Inicio CP-N1-C",
            "Gate de incremento: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
        ),
    ),
    Theory(
        heading="Tipos específicos, raise y chaining",
        sub="S09-T1-A",
        paragraphs=[
            "Prefiere **tipos concretos**: `ValueError` (valor ilegal), `TypeError` (tipo incorrecto), `KeyError` (clave ausente), `OSError`/`FileNotFoundError` (I/O). `except Exception` genérico oculta la causa y complica el triage.",
            "`raise ValueError('monto no numérico: …')` da contexto accionable. **`raise NewError(...) from e`** encadena la causa (`__cause__`) sin perder el traceback original — útil al traducir fallos de parse a errores de dominio.",
            "Una **custom Exception ligera** (`class DataLoadError(Exception): ...`) nombra el borde de tu capa sin reinventar la jerarquía de la stdlib.",
        ],
        code=textwrap.dedent(
            """\
            class ValidationError(Exception):
                pass

            class ParseError(Exception):
                pass

            def parse_monto(raw: str) -> float:
                try:
                    return float(raw.replace(",", "."))
                except ValueError as e:
                    raise ParseError(f"no parseable: {raw!r}") from e

            def validate_row(row: dict) -> float:
                try:
                    m = parse_monto(row["monto"])
                except ParseError as e:
                    raise ValidationError(f"fila {row.get('id')}: monto inválido") from e
                if m < 0:
                    raise ValidationError(f"fila {row.get('id')}: monto negativo")
                return m

            try:
                validate_row({"id": "C001", "monto": "abc"})
            except ValidationError as e:
                print(type(e).__name__, e)
                print("cause:", type(e.__cause__).__name__, e.__cause__)
            """
        ).strip(),
        code_title="raise_chain.py",
        callout=(
            "tip",
            "Mensajes accionables",
            "Incluye id de fila y el valor problemático (redactado si es PII). No digas solo «error».",
        ),
    ),
    Theory(
        heading="Fronteras de recuperación y cleanup",
        sub="S09-T1-B",
        paragraphs=[
            "`try/except/else/finally`: **else** corre solo si no hubo excepción; **finally** siempre (cleanup). `with` garantiza cierre de handles vía context managers.",
            "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide: **manejar** (recuperable: fila mala) vs **propagar** (fatal: config inválida).",
            "Config rota → fail-fast. Fila de datos inválida → cuarentena y continúa el lote. El borde del job es un contrato operativo, no un gusto de estilo.",
        ],
        code=textwrap.dedent(
            """\
            from io import StringIO

            def read_lote(text: str, config_ok: bool) -> list[str]:
                if not config_ok:
                    raise RuntimeError("config inválida: delimiter vacío")
                handle = StringIO(text)
                try:
                    return [ln.strip() for ln in handle if ln.strip()]
                finally:
                    handle.close()
                    print("cleanup: handle cerrado")

            print(read_lote("a\\nb\\n", True))
            try:
                read_lote("x", False)
            except RuntimeError as e:
                print("fatal:", e)
            """
        ).strip(),
        code_title="boundaries.py",
        callout=(
            "warning",
            "No swallow",
            "`except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción.",
        ),
    ),
    Theory(
        heading="Traceback y debugger",
        sub="S09-T2-A",
        paragraphs=[
            "Un **traceback** lista frames del más reciente al más profundo (o viceversa según herramienta). El frame útil suele ser **tu código**, no el de la stdlib.",
            "`breakpoint()` / `pdb` inspeccionan variables en vivo. En demos del curso usamos **`traceback` + prints controlados** cuando no hay TTY interactivo.",
            "Al loguear stacks, **nunca** imprimas secretos ni PII completa que haya en locals. Redacta o omite.",
        ],
        code=textwrap.dedent(
            """\
            import traceback

            def normalize(row: dict) -> str:
                return row["email"].lower().strip()

            def process(batch: list[dict]) -> None:
                for r in batch:
                    normalize(r)

            try:
                process([{"id": "C001"}, {"id": "C002", "email": "a@ejemplo.pe"}])
            except KeyError:
                tb = traceback.format_exc()
                # solo frames de demo: buscar normalize
                for line in tb.splitlines():
                    if "normalize" in line or "KeyError" in line or "process" in line:
                        print(line.strip())
            """
        ).strip(),
        code_title="traceback_read.py",
        callout=(
            "tip",
            "Frame útil",
            "Empieza por la última línea de tu módulo; sube solo si el bug está en un helper compartido.",
        ),
    ),
    Theory(
        heading="Reproducción mínima, hipótesis y causa raíz",
        sub="S09-T2-B",
        paragraphs=[
            "**Minimal repro**: reduce 200 filas a la **menor entrada** que dispara el bug. Facilita tests de regresión y code review.",
            "Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Descartar es progreso.",
            "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo. 5-whys ligero: no pares en el síntoma.",
        ],
        code=textwrap.dedent(
            """\
            def split_apellidos(nombre: str) -> tuple[str, str]:
                parts = nombre.split()
                if len(parts) < 2:
                    raise ValueError("faltan apellidos")
                # bug: asume exactamente 2 tokens
                return parts[0], parts[1]

            # lote "grande" sintético
            lote = [f"Cliente{i} Perez" for i in range(5)] + ["Maria Lopez Garcia"]
            bad = []
            for n in lote:
                try:
                    split_apellidos(n)
                except Exception as e:
                    bad.append((n, type(e).__name__))
            # minimal: la fila con 3 tokens no falla aquí; el bug real es 1 token
            print("bad in lote:", bad)
            try:
                print(split_apellidos("SoloNombre"))
            except ValueError as e:
                print("minimal repro:", e)
            """
        ).strip(),
        code_title="minimal_repro.py",
        callout=(
            "info",
            "Causa raíz",
            "«Falló en prod» no es causa raíz. «split asume 2 tokens y llegó 1» sí lo es.",
        ),
    ),
    Theory(
        heading="Niveles y estructura de logging",
        sub="S09-T3-A",
        paragraphs=[
            "Niveles: **DEBUG** (detalle dev), **INFO** (progreso), **WARNING** (anomalía recuperable), **ERROR** (fallo de unidad), **CRITICAL** (job/proceso).",
            "Usa un **Logger de módulo** (`logging.getLogger(__name__)`) en vez de configurar el root a ciegas. Handlers y formatters se arman una vez en el entrypoint.",
            "Logs **estructurados** (`key=value` o JSON) con campos estables (`stage`, `record_id`, `duration_ms`) se pueden buscar en agregadores. Los prints libres no escalan.",
        ],
        code=textwrap.dedent(
            """\
            import logging
            import io
            import time

            buf = io.StringIO()
            log = logging.getLogger("pipeline.demo")
            log.handlers.clear()
            log.setLevel(logging.DEBUG)
            h = logging.StreamHandler(buf)
            h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
            log.addHandler(h)
            log.propagate = False

            t0 = time.perf_counter()
            stage, record_id = "normalize", "C001"
            log.info("stage=%s record_id=%s event=start", stage, record_id)
            duration_ms = int((time.perf_counter() - t0) * 1000)
            log.info(
                "stage=%s record_id=%s event=done duration_ms=%s",
                stage, record_id, duration_ms,
            )
            print(buf.getvalue().strip())
            """
        ).strip(),
        code_title="structured_log.py",
        callout=(
            "tip",
            "Campos estables",
            "Acuerda un vocabulario (stage, correlation_id, error_class). Cambiar nombres rompe dashboards.",
        ),
    ),
    Theory(
        heading="Correlation IDs y redacción de PII",
        sub="S09-T3-B",
        paragraphs=[
            "Un **correlation_id** (o request_id) viaja por capas (CLI → service → repo) para unir logs del mismo job/lote.",
            "**Nunca** loguees email, teléfono o dirección completos. Usa máscaras: `a***@ejemplo.pe`, `***4567`.",
            "Helpers `mask_email` / `mask_phone` deben ser el **único** camino a logs; audits fallan si alguien hace `log.info(row)`.",
        ],
        code=textwrap.dedent(
            """\
            def mask_email(email: str) -> str:
                local, _, domain = email.partition("@")
                if not domain:
                    return "***"
                head = local[:1] if local else "*"
                return f"{head}***@{domain}"

            def mask_phone(phone: str) -> str:
                digits = "".join(c for c in phone if c.isdigit())
                if len(digits) < 4:
                    return "***"
                return "***" + digits[-4:]

            corr = "job-7f3a"
            email = "ana.rojas@ejemplo.pe"
            print(f"correlation_id={corr} email={mask_email(email)} phone={mask_phone('+51 999 123 4567')}")
            """
        ).strip(),
        code_title="redact_pii.py",
        callout=(
            "danger",
            "PII en logs",
            "Un ERROR con el row completo puede filtrar PII a CloudWatch/Slack. Redacta siempre.",
        ),
    ),
    Theory(
        heading="Fallar rápido vs continuar con cuarentena",
        sub="S09-T4-A",
        paragraphs=[
            "Taxonomía: **data** (fila), **config** (delimiter, schema path), **provider** (timeout de API/archivo remoto). La política difiere.",
            "**Fail-fast** en config: seguir procesando con schema roto multiplica basura. **Cuarentena** en data: una fila mala no debe tumbar el lote entero.",
            "Éxito parcial es válido si el manifest contabiliza `ok + quarantined = input`. Documenta la política en README del job.",
        ],
        code=textwrap.dedent(
            """\
            def process_batch(rows: list[dict], config: dict) -> dict:
                if not config.get("delimiter"):
                    raise RuntimeError("config: delimiter requerido")
                ok, quarantine = [], []
                for r in rows:
                    if "id" not in r or r.get("monto") is None:
                        quarantine.append({"row": r, "reason": "data: campos requeridos"})
                        continue
                    ok.append(r)
                return {"ok": ok, "quarantined": quarantine}

            print(process_batch(
                [{"id": "C001", "monto": 10}, {"nombre": "x"}],
                {"delimiter": ","},
            ))
            try:
                process_batch([], {})
            except RuntimeError as e:
                print("abort:", e)
            """
        ).strip(),
        code_title="failfast_quarantine.py",
        callout=(
            "info",
            "Éxito parcial",
            "Operaciones de intake latam casi siempre tienen filas sucias. Cuarentena + conteos > crash total.",
        ),
    ),
    Theory(
        heading="Idempotencia, retries y cuarentena",
        sub="S09-T4-B",
        paragraphs=[
            "**Retry solo errores transitorios** (`TimeoutError`, 503). `ValueError` de datos **no** se reintenta: va a cuarentena.",
            "Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)`.",
            "Backoff simple (sleep creciente) reduce thundering herd. Tras max_attempts → cuarentena o fail según la política.",
        ],
        code=textwrap.dedent(
            """\
            import time

            def fetch_with_retry(fn, max_attempts=3):
                last = None
                for attempt in range(1, max_attempts + 1):
                    try:
                        return fn(attempt)
                    except TimeoutError as e:
                        last = e
                        time.sleep(0.01 * attempt)  # backoff demo
                    except ValueError:
                        raise  # no retry
                raise last

            calls = {"n": 0}

            def flaky(attempt):
                calls["n"] += 1
                if attempt < 3:
                    raise TimeoutError("simulado")
                return "ok"

            print(fetch_with_retry(flaky), "calls", calls["n"])
            try:
                fetch_with_retry(lambda a: (_ for _ in ()).throw(ValueError("dato malo")))
            except ValueError as e:
                print("no-retry:", e)
            """
        ).strip(),
        code_title="retry_policy.py",
        callout=(
            "warning",
            "Idempotencia",
            "Reintentar un INSERT no idempotente duplica filas. Diseña la clave antes del retry.",
        ),
    ),
]

S09_DEMOS: list[Demo] = [
    Demo(
        "S09-T1-A-DEMO",
        "S09-T1-A",
        "Validar fila de intake y encadenar ParseError → ValidationError.",
        textwrap.dedent(
            """\
            class ParseError(Exception):
                pass

            class ValidationError(Exception):
                pass

            def parse_monto(raw: str) -> float:
                try:
                    return float(str(raw).replace(",", "."))
                except (TypeError, ValueError) as e:
                    raise ParseError(f"monto no parseable: {raw!r}") from e

            def validate_intake(row: dict) -> dict:
                try:
                    monto = parse_monto(row.get("monto"))
                except ParseError as e:
                    raise ValidationError(f"id={row.get('id')}: validación falló") from e
                if monto < 0:
                    raise ValidationError(f"id={row.get('id')}: monto negativo")
                return {"id": row["id"], "monto": monto}

            print(validate_intake({"id": "C001", "monto": "12,50"}))
            try:
                validate_intake({"id": "C002", "monto": "N/A"})
            except ValidationError as e:
                print(type(e).__name__, "->", e)
                print("cause", type(e.__cause__).__name__, e.__cause__)
            """
        ).strip(),
        "El chaining preserva la causa de parse al subir a validación de dominio.",
        title="intake_chain.py",
    ),
    Demo(
        "S09-T1-B-DEMO",
        "S09-T1-B",
        "Leer lote con finally que cierra handle; re-raise si config inválida.",
        textwrap.dedent(
            """\
            from io import StringIO

            class ConfigError(Exception):
                pass

            def leer_lote(payload: str, encoding: str | None) -> list[str]:
                if not encoding:
                    raise ConfigError("encoding requerido")
                handle = StringIO(payload)
                try:
                    return [ln.rstrip("\\n") for ln in handle]
                finally:
                    handle.close()
                    print("finally: recurso cerrado")

            print("ok", leer_lote("fila1\\nfila2\\n", "utf-8"))
            try:
                leer_lote("x", None)
            except ConfigError as e:
                print("fatal config:", e)
            """
        ).strip(),
        "finally corre siempre; config inválida no se traga — se propaga.",
        title="lote_finally.py",
    ),
    Demo(
        "S09-T2-A-DEMO",
        "S09-T2-A",
        "Reproducir KeyError en normalizer y ubicar frame con traceback.",
        textwrap.dedent(
            """\
            import traceback

            def normalize_email(row: dict) -> str:
                return row["email"].strip().lower()

            def run_batch(rows: list[dict]) -> list[str]:
                return [normalize_email(r) for r in rows]

            rows = [{"id": "C001", "email": "a@ejemplo.pe"}, {"id": "C002"}]
            try:
                run_batch(rows)
            except KeyError as e:
                print("error:", type(e).__name__, e)
                # simula inspección de debugger: frames relevantes
                for fr in traceback.extract_tb(e.__traceback__):
                    if fr.name in {"normalize_email", "run_batch", "<module>"}:
                        print(f"frame={fr.name} line={fr.lineno} -> {fr.line}")
            """
        ).strip(),
        "El frame útil es normalize_email: falta la clave email en C002.",
        title="keyerror_frames.py",
    ),
    Demo(
        "S09-T2-B-DEMO",
        "S09-T2-B",
        "De un lote de 200 filas sintéticas al caso mínimo de apellidos.",
        textwrap.dedent(
            """\
            def apellidos(nombre: str) -> list[str]:
                toks = [t for t in nombre.split() if t.lower() not in {"de", "del", "la"}]
                if len(toks) < 3:  # nombre + 2 apellidos
                    raise ValueError(f"nombre incompleto: {nombre!r}")
                return toks[-2:]

            # simula 200 filas: casi todas ok
            lote = [f"Ana Perez Lopez {i}" for i in range(198)]
            lote += ["Juan Perez", "Solo"]
            fallos = []
            for n in lote:
                try:
                    apellidos(n)
                except ValueError as e:
                    fallos.append(str(e))
            print("total_fallos", len(fallos))
            # minimal repro: la entrada más corta
            minimal = min((f.split(": ", 1)[-1].strip("'") for f in fallos), key=len)
            print("minimal_repro", repr(minimal))
            try:
                apellidos(minimal)
            except ValueError as e:
                print("root_symptom", e)
            """
        ).strip(),
        "Reducir a 'Solo' permite un test de regresión de una línea.",
        title="minimal_apellidos.py",
    ),
    Demo(
        "S09-T3-A-DEMO",
        "S09-T3-A",
        "Logger de pipeline con campos stage, record_id, duration_ms.",
        textwrap.dedent(
            """\
            import logging, io, time

            buf = io.StringIO()
            log = logging.getLogger("familiarity.pipeline")
            log.handlers.clear()
            log.setLevel(logging.INFO)
            h = logging.StreamHandler(buf)
            h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
            log.addHandler(h)
            log.propagate = False

            def stage_normalize(record_id: str) -> None:
                t0 = time.perf_counter()
                log.info("stage=normalize record_id=%s event=start", record_id)
                _ = record_id.lower()
                ms = int((time.perf_counter() - t0) * 1000)
                log.info(
                    "stage=normalize record_id=%s event=done duration_ms=%s",
                    record_id, ms,
                )

            stage_normalize("C001")
            print(buf.getvalue().strip())
            """
        ).strip(),
        "Campos estables permiten filtrar por stage y record_id en operación.",
        title="pipeline_logger.py",
    ),
    Demo(
        "S09-T3-B-DEMO",
        "S09-T3-B",
        "Log de error con email enmascarado y correlation_id.",
        textwrap.dedent(
            """\
            import logging, io

            def mask_email(email: str) -> str:
                local, _, domain = email.partition("@")
                return f"{(local[:1] or '*')}***@{domain}" if domain else "***"

            buf = io.StringIO()
            log = logging.getLogger("familiarity.audit")
            log.handlers.clear()
            log.setLevel(logging.ERROR)
            h = logging.StreamHandler(buf)
            h.setFormatter(logging.Formatter("%(message)s"))
            log.addHandler(h)
            log.propagate = False

            corr = "corr-9c2e"
            raw_email = "lucia.mendez@ejemplo.pe"
            log.error(
                "correlation_id=%s stage=validate error_class=data email=%s msg=formato",
                corr, mask_email(raw_email),
            )
            out = buf.getvalue().strip()
            print(out)
            assert "@ejemplo.pe" in out and "lucia.mendez" not in out
            print("pii_completa_ausente=True")
            """
        ).strip(),
        "El log es accionable sin filtrar PII completa.",
        title="masked_error_log.py",
    ),
    Demo(
        "S09-T4-A-DEMO",
        "S09-T4-A",
        "Lote: 1 fila mala a cuarentena; config rota aborta.",
        textwrap.dedent(
            """\
            def process_batch(rows, config):
                if config.get("required_fields") is None:
                    raise RuntimeError("config: required_fields ausente")
                req = config["required_fields"]
                ok, q = [], []
                for r in rows:
                    missing = [k for k in req if not r.get(k)]
                    if missing:
                        q.append({"id": r.get("id"), "reason": f"data:missing:{','.join(missing)}"})
                    else:
                        ok.append(r)
                return {"ok": ok, "quarantined": q, "in": len(rows)}

            rows = [
                {"id": "C001", "email": "a@ejemplo.pe"},
                {"id": "C002"},
            ]
            r = process_batch(rows, {"required_fields": ["id", "email"]})
            print(r)
            assert len(r["ok"]) + len(r["quarantined"]) == r["in"]
            try:
                process_batch(rows, {})
            except RuntimeError as e:
                print("abort", e)
            """
        ).strip(),
        "Data → cuarentena; config → fail-fast. Conteos reconciliados.",
        title="batch_policy.py",
    ),
    Demo(
        "S09-T4-B-DEMO",
        "S09-T4-B",
        "Retry 3× en TimeoutError; ValueError va a cuarentena sin retry.",
        textwrap.dedent(
            """\
            def with_retry(fn, max_attempts=3):
                for attempt in range(1, max_attempts + 1):
                    try:
                        return ("ok", fn(attempt))
                    except TimeoutError:
                        if attempt == max_attempts:
                            return ("fail_timeout", None)
                    except ValueError as e:
                        return ("quarantine", str(e))
                return ("fail", None)

            state = {"t": 0}

            def flaky(attempt):
                state["t"] += 1
                if attempt < 3:
                    raise TimeoutError("red")
                return "payload"

            print(with_retry(flaky), "attempts", state["t"])
            print(with_retry(lambda a: (_ for _ in ()).throw(ValueError("monto"))))
            """
        ).strip(),
        "Transitorio se reintenta; error de datos no gasta reintentos.",
        title="retry_quarantine.py",
    ),
]

S09_EX: list[Ex] = [
    Ex(
        "S09-T1-A-E1",
        "S09-T1-A",
        "guided",
        "Mapea 5 fallos sintéticos al tipo de excepción más adecuado e imprime `fallo -> Tipo`.",
        "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
        "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
        textwrap.dedent(
            """\
            fallos = [
                "int('x')",
                "sumar str + int",
                "dict sin clave email",
                "abrir archivo inexistente",
                "regla de negocio: monto < 0",
            ]
            # TODO: imprimir fallo -> ExceptionType
            """
        ).strip(),
        textwrap.dedent(
            """\
            class ValidationError(Exception):
                pass

            mapping = [
                ("int('x')", "ValueError"),
                ("sumar str + int", "TypeError"),
                ("dict sin clave email", "KeyError"),
                ("abrir archivo inexistente", "FileNotFoundError"),
                ("regla de negocio: monto < 0", "ValidationError"),
            ]
            for fallo, tipo in mapping:
                print(f"{fallo} -> {tipo}")
            """
        ).strip(),
        edge=["No uses Exception genérico para todos", "FileNotFoundError es subclase de OSError"],
        title="map_exceptions.py",
    ),
    Ex(
        "S09-T1-A-E2",
        "S09-T1-A",
        "independent",
        "Implementa `parse_monto(raw)` que hace raise ValueError con mensaje accionable si no parsea o es negativo.",
        "Normaliza coma decimal. Mensaje debe incluir el raw.",
        "Dos raises distintos: no numérico vs negativo.",
        textwrap.dedent(
            """\
            def parse_monto(raw):
                # TODO
                ...

            for v in ["10.5", "3,25", "abc", "-1"]:
                try:
                    print(v, "->", parse_monto(v))
                except ValueError as e:
                    print(v, "ERR", e)
            """
        ).strip(),
        textwrap.dedent(
            """\
            def parse_monto(raw):
                try:
                    n = float(str(raw).replace(",", "."))
                except (TypeError, ValueError):
                    raise ValueError(f"monto no numérico: {raw!r}") from None
                if n < 0:
                    raise ValueError(f"monto negativo no permitido: {n}")
                return n

            for v in ["10.5", "3,25", "abc", "-1"]:
                try:
                    print(v, "->", parse_monto(v))
                except ValueError as e:
                    print(v, "ERR", e)
            """
        ).strip(),
        edge=["'' vacío", "None"],
        title="parse_monto.py",
    ),
    Ex(
        "S09-T1-A-E3",
        "S09-T1-A",
        "transfer",
        "Define `DataLoadError` y `load_text(path_fn)` que captura OSError del lector y re-lanza DataLoadError con `from`.",
        "path_fn es un callable que simula open y puede lanzar OSError.",
        "Imprime type del error y de __cause__.",
        textwrap.dedent(
            """\
            class DataLoadError(Exception):
                pass

            def load_text(path_fn):
                # TODO
                ...

            def bad_reader():
                raise OSError("no such file: data/clientes.csv")

            try:
                load_text(bad_reader)
            except DataLoadError as e:
                print(type(e).__name__, e)
                print(type(e.__cause__).__name__, e.__cause__)
            """
        ).strip(),
        textwrap.dedent(
            """\
            class DataLoadError(Exception):
                pass

            def load_text(path_fn):
                try:
                    return path_fn()
                except OSError as e:
                    raise DataLoadError("fallo al cargar intake") from e

            def bad_reader():
                raise OSError("no such file: data/clientes.csv")

            try:
                load_text(bad_reader)
            except DataLoadError as e:
                print(type(e).__name__, e)
                print(type(e.__cause__).__name__, e.__cause__)
            """
        ).strip(),
        edge=["PermissionError también es OSError"],
        title="data_load_chain.py",
    ),
    Ex(
        "S09-T1-B-E1",
        "S09-T1-B",
        "guided",
        "Completa el `finally` para marcar el recurso como cerrado aunque haya excepción.",
        "El flag `closed` debe quedar True siempre.",
        "Usa try/finally; no captures la excepción.",
        textwrap.dedent(
            """\
            state = {"closed": False}

            def work(fail: bool):
                try:
                    if fail:
                        raise RuntimeError("boom")
                    return "ok"
                finally:
                    # TODO: cerrar
                    pass

            print(work(False), state)
            try:
                work(True)
            except RuntimeError:
                print("err", state)
            """
        ).strip(),
        textwrap.dedent(
            """\
            state = {"closed": False}

            def work(fail: bool):
                try:
                    if fail:
                        raise RuntimeError("boom")
                    return "ok"
                finally:
                    state["closed"] = True

            print(work(False), state)
            try:
                work(True)
            except RuntimeError:
                print("err", state)
            """
        ).strip(),
        edge=["finally corre antes de propagar"],
        title="finally_close.py",
    ),
    Ex(
        "S09-T1-B-E2",
        "S09-T1-B",
        "independent",
        "Clasifica 6 errores en recover o fail-fast e imprime `nombre: política`.",
        "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
        "Timeout de red de un registro puede ser recover+retry (marca recover).",
        textwrap.dedent(
            """\
            errores = [
                "delimiter vacío en config",
                "monto no numérico en fila",
                "schema_path no existe",
                "email mal formado en fila",
                "API_TOKEN ausente",
                "timeout leyendo un record remoto",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            politica = {
                "delimiter vacío en config": "fail-fast",
                "monto no numérico en fila": "recover",
                "schema_path no existe": "fail-fast",
                "email mal formado en fila": "recover",
                "API_TOKEN ausente": "fail-fast",
                "timeout leyendo un record remoto": "recover",
            }
            for k, v in politica.items():
                print(f"{k}: {v}")
            """
        ).strip(),
        edge=["recover no significa ignorar: cuarentena o retry"],
        title="classify_errors.py",
    ),
    Ex(
        "S09-T1-B-E3",
        "S09-T1-B",
        "transfer",
        "Refactoriza el handler bare: captura ValueError (cuarentena) y deja propagar el resto.",
        "No uses except desnudo.",
        "Imprime ok/quarantine/raised según el caso.",
        textwrap.dedent(
            """\
            def bad_handler(fn):
                try:
                    return ("ok", fn())
                except:  # noqa: E722 — malo a propósito
                    return ("swallowed", None)

            def good_handler(fn):
                # TODO
                ...

            def v():
                raise ValueError("fila")

            def r():
                raise RuntimeError("config")

            print("bad", bad_handler(v), bad_handler(r))
            print("good_v", good_handler(v))
            try:
                print(good_handler(r))
            except RuntimeError as e:
                print("good_r raised", e)
            """
        ).strip(),
        textwrap.dedent(
            """\
            def bad_handler(fn):
                try:
                    return ("ok", fn())
                except Exception:
                    return ("swallowed", None)

            def good_handler(fn):
                try:
                    return ("ok", fn())
                except ValueError as e:
                    return ("quarantine", str(e))

            def v():
                raise ValueError("fila")

            def r():
                raise RuntimeError("config")

            print("bad", bad_handler(v), bad_handler(r))
            print("good_v", good_handler(v))
            try:
                print(good_handler(r))
            except RuntimeError as e:
                print("good_r raised", e)
            """
        ).strip(),
        edge=["Exception aún es amplio; preferir tipos de dominio en prod"],
        title="refactor_bare_except.py",
    ),
    Ex(
        "S09-T2-A-E1",
        "S09-T2-A",
        "guided",
        "Dado un traceback sintético en string, anota 3 frames (nombre de función) de afuera hacia adentro.",
        "Busca líneas 'File' o patrones 'in nombre'.",
        "Imprime frame1, frame2, frame3.",
        textwrap.dedent(
            """\
            tb = '''Traceback (most recent call last):
              File "cli.py", line 10, in main
                run()
              File "pipeline.py", line 4, in run
                normalize(row)
              File "normalize.py", line 2, in normalize
                return row["email"]
            KeyError: 'email'
            '''
            # TODO: extraer main, run, normalize
            """
        ).strip(),
        textwrap.dedent(
            """\
            tb = '''Traceback (most recent call last):
              File "cli.py", line 10, in main
                run()
              File "pipeline.py", line 4, in run
                normalize(row)
              File "normalize.py", line 2, in normalize
                return row["email"]
            KeyError: 'email'
            '''
            frames = []
            for line in tb.splitlines():
                if ", in " in line:
                    frames.append(line.rsplit(", in ", 1)[-1].strip())
            print("frame1", frames[0])
            print("frame2", frames[1])
            print("frame3", frames[2])
            """
        ).strip(),
        edge=["most recent call last: el último frame es el más profundo"],
        title="annotate_frames.py",
    ),
    Ex(
        "S09-T2-A-E2",
        "S09-T2-A",
        "independent",
        "Simula un 'breakpoint': en normalize, si falta email, imprime locals seguros (solo id) y lanza KeyError.",
        "No imprimas el row completo si pudiera tener PII.",
        "Usa un flag DEBUG.",
        textwrap.dedent(
            """\
            DEBUG = True

            def normalize(row: dict) -> str:
                # TODO
                ...

            try:
                print(normalize({"id": "C009"}))
            except KeyError as e:
                print("raised", e)
            """
        ).strip(),
        textwrap.dedent(
            """\
            DEBUG = True

            def normalize(row: dict) -> str:
                if "email" not in row:
                    if DEBUG:
                        print("break locals id=", row.get("id"))
                    raise KeyError("email")
                return row["email"].lower()

            try:
                print(normalize({"id": "C009"}))
            except KeyError as e:
                print("raised", e)
            """
        ).strip(),
        edge=["En prod real usa logging + correlation_id"],
        title="simulate_breakpoint.py",
    ),
    Ex(
        "S09-T2-A-E3",
        "S09-T2-A",
        "transfer",
        "Solo con el traceback, imprime la causa raíz en una frase (función + clave faltante).",
        "No re-ejecutes el código original; parsea el texto.",
        "Formato: causa_raiz=normalize falta clave email",
        textwrap.dedent(
            """\
            tb = '''Traceback (most recent call last):
              File "app.py", line 1, in <module>
                normalize({"id": 1})
              File "app.py", line 1, in normalize
                return row["email"].lower()
            KeyError: 'email'
            '''
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            tb = '''Traceback (most recent call last):
              File "app.py", line 1, in <module>
                normalize({"id": 1})
              File "app.py", line 1, in normalize
                return row["email"].lower()
            KeyError: 'email'
            '''
            last_exc = [ln for ln in tb.splitlines() if ln.startswith("KeyError")][-1]
            key = last_exc.split(":", 1)[-1].strip().strip("'")
            print(f"causa_raiz=normalize falta clave {key}")
            """
        ).strip(),
        edge=["No culpes a cli.py si el bug está en normalize"],
        title="root_from_tb.py",
    ),
    Ex(
        "S09-T2-B-E1",
        "S09-T2-B",
        "guided",
        "Recorta la fixture a la fila mínima que hace fallar `parse_dni` (debe ser 8 dígitos).",
        "Encuentra el primer fallido y re-ejecuta solo ese.",
        "Imprime minimal=...",
        textwrap.dedent(
            """\
            def parse_dni(d: str) -> str:
                if not (d.isdigit() and len(d) == 8):
                    raise ValueError(f"dni inválido: {d!r}")
                return d

            fixture = ["12345678", "123", "87654321", "12AB5678"]
            # TODO: minimal repro del primer fallo
            """
        ).strip(),
        textwrap.dedent(
            """\
            def parse_dni(d: str) -> str:
                if not (d.isdigit() and len(d) == 8):
                    raise ValueError(f"dni inválido: {d!r}")
                return d

            fixture = ["12345678", "123", "87654321", "12AB5678"]
            minimal = None
            for d in fixture:
                try:
                    parse_dni(d)
                except ValueError:
                    minimal = d
                    break
            print("minimal=", minimal)
            try:
                parse_dni(minimal)
            except ValueError as e:
                print(e)
            """
        ).strip(),
        edge=["Puede haber varios fallos; el mínimo del primer fallo basta para el test"],
        title="crop_fixture.py",
    ),
    Ex(
        "S09-T2-B-E2",
        "S09-T2-B",
        "independent",
        "Para el bug `normalize_phone` que borra el +51, escribe 2 hipótesis y el experimento que las falsifica.",
        "Imprime H1/H2 y resultado ok/fail de cada experimento sintético.",
        "No necesitas fix real; solo el diseño experimental.",
        textwrap.dedent(
            """\
            def normalize_phone(p: str) -> str:
                # bug: se come el +
                return "".join(c for c in p if c.isdigit())

            # TODO: hipótesis + experimentos
            """
        ).strip(),
        textwrap.dedent(
            """\
            def normalize_phone(p: str) -> str:
                return "".join(c for c in p if c.isdigit())

            print("H1: solo dígitos; pierde '+'")
            exp1 = normalize_phone("+51999111222")
            print("exp1", exp1, "fail" if not exp1.startswith("51") or "+" in "+51999111222" and "+" not in exp1 else "ok")
            # reinterpret: si esperábamos conservar country code con +
            print("H1_result", "fail" if not exp1.startswith("+") else "ok")

            print("H2: el bug es strip de espacios no del +")
            exp2 = normalize_phone("999 111 222")
            print("exp2", exp2, "H2_result", "ok" if exp2 == "999111222" else "fail")
            """
        ).strip(),
        edge=["Hipótesis deben ser falsables con un assert"],
        title="hypotheses.py",
        feedback="H1 se falsifica/confirma según el contrato esperado del normalizer.",
    ),
    Ex(
        "S09-T2-B-E3",
        "S09-T2-B",
        "transfer",
        "Añade un test de regresión: falla en rojo con la función bugueada y pasa tras el fix.",
        "Imprime RED luego GREEN.",
        "Bug: title-case rompe 'de la'.",
        textwrap.dedent(
            """\
            def bad_title(s: str) -> str:
                return s.title()

            def good_title(s: str) -> str:
                # TODO: no capitalizar partículas de/del/la
                ...

            def test(fn):
                out = fn("juan de la cruz")
                assert out == "Juan de la Cruz", out
                return "pass"

            # TODO: red then green
            """
        ).strip(),
        textwrap.dedent(
            """\
            def bad_title(s: str) -> str:
                return s.title()

            def good_title(s: str) -> str:
                parts = []
                for i, t in enumerate(s.split()):
                    if i > 0 and t.lower() in {"de", "del", "la", "los", "las"}:
                        parts.append(t.lower())
                    else:
                        parts.append(t[:1].upper() + t[1:].lower() if t else t)
                return " ".join(parts)

            def test(fn):
                out = fn("juan de la cruz")
                assert out == "Juan de la Cruz", out
                return "pass"

            try:
                test(bad_title)
            except AssertionError:
                print("RED")
            print(test(good_title))
            print("GREEN")
            """
        ).strip(),
        edge=["title() capitaliza De/La incorrectamente para nombres latam"],
        title="regression_test.py",
    ),
    Ex(
        "S09-T3-A-E1",
        "S09-T3-A",
        "guided",
        "Asigna el nivel correcto (DEBUG/INFO/WARNING/ERROR) a 6 eventos e imprime `evento: NIVEL`.",
        "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
        "Config inválida al arrancar también ERROR (o CRITICAL; usa ERROR aquí).",
        textwrap.dedent(
            """\
            eventos = [
                "job iniciado",
                "valor de variable i en loop",
                "fila sin email opcional",
                "no se pudo parsear monto",
                "archivo de config ilegible",
                "lote terminado con conteos",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            niveles = {
                "job iniciado": "INFO",
                "valor de variable i en loop": "DEBUG",
                "fila sin email opcional": "WARNING",
                "no se pudo parsear monto": "ERROR",
                "archivo de config ilegible": "ERROR",
                "lote terminado con conteos": "INFO",
            }
            for e, n in niveles.items():
                print(f"{e}: {n}")
            """
        ).strip(),
        edge=["WARNING no es ERROR si el job continúa"],
        title="assign_levels.py",
    ),
    Ex(
        "S09-T3-A-E2",
        "S09-T3-A",
        "independent",
        "Configura un logger de módulo con StreamHandler a un StringIO y emite un INFO estructurado.",
        "propagate=False; formatter simple.",
        "Mensaje: stage=ingest event=start",
        textwrap.dedent(
            """\
            import logging, io
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            import logging, io
            buf = io.StringIO()
            log = logging.getLogger("familiarity.ingest")
            log.handlers.clear()
            log.setLevel(logging.INFO)
            h = logging.StreamHandler(buf)
            h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
            log.addHandler(h)
            log.propagate = False
            log.info("stage=ingest event=start")
            print(buf.getvalue().strip())
            """
        ).strip(),
        edge=["Limpiar handlers en demos evita duplicados"],
        title="module_logger.py",
    ),
    Ex(
        "S09-T3-A-E3",
        "S09-T3-A",
        "transfer",
        "Convierte prints de un CLI stub a logs estructurados; stdout final solo con el resultado.",
        "Progreso a logger; resultado con print o stdout data.",
        "Debe verse un log INFO y la línea RESULT=3.",
        textwrap.dedent(
            """\
            import logging, io, sys

            def cli_stub_bad(n):
                print("empezando")
                print("sumando")
                print(n + 1)

            # TODO: cli_stub_good
            """
        ).strip(),
        textwrap.dedent(
            """\
            import logging, io

            buf = io.StringIO()
            log = logging.getLogger("cli")
            log.handlers.clear()
            log.setLevel(logging.INFO)
            h = logging.StreamHandler(buf)
            h.setFormatter(logging.Formatter("%(message)s"))
            log.addHandler(h)
            log.propagate = False

            def cli_stub_good(n):
                log.info("event=start op=inc")
                result = n + 1
                log.info("event=done op=inc")
                print(f"RESULT={result}")

            cli_stub_good(2)
            print("LOGS:", buf.getvalue().replace("\\n", " | ").strip())
            """
        ).strip(),
        edge=["No mezclar progress en el stream de datos"],
        title="prints_to_logs.py",
    ),
    Ex(
        "S09-T3-B-E1",
        "S09-T3-B",
        "guided",
        "Implementa `mask_email` y `mask_phone` y demuéstralos con datos sintéticos peruanos.",
        "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
        "Imprime ambas máscaras.",
        textwrap.dedent(
            """\
            def mask_email(email: str) -> str:
                ...

            def mask_phone(phone: str) -> str:
                ...

            print(mask_email("carlos@ejemplo.pe"))
            print(mask_phone("+51 988 777 666"))
            """
        ).strip(),
        textwrap.dedent(
            """\
            def mask_email(email: str) -> str:
                local, _, domain = email.partition("@")
                if not domain:
                    return "***"
                return f"{(local[:1] or '*')}***@{domain}"

            def mask_phone(phone: str) -> str:
                digits = "".join(c for c in phone if c.isdigit())
                if len(digits) < 4:
                    return "***"
                return "***" + digits[-4:]

            print(mask_email("carlos@ejemplo.pe"))
            print(mask_phone("+51 988 777 666"))
            """
        ).strip(),
        edge=["email sin @", "teléfono corto"],
        title="mask_helpers.py",
    ),
    Ex(
        "S09-T3-B-E2",
        "S09-T3-B",
        "independent",
        "Propaga `correlation_id` por 3 capas (cli → service → repo) e imprime el id en cada una.",
        "Pasa el id como argumento explícito (sin global).",
        "Mismo id en las 3 líneas.",
        textwrap.dedent(
            """\
            def repo_save(corr, item):
                ...

            def service_upsert(corr, item):
                ...

            def cli_main(corr, item):
                ...

            cli_main("corr-42", {"id": "C001"})
            """
        ).strip(),
        textwrap.dedent(
            """\
            def repo_save(corr, item):
                print(f"repo correlation_id={corr} id={item['id']}")

            def service_upsert(corr, item):
                print(f"service correlation_id={corr}")
                repo_save(corr, item)

            def cli_main(corr, item):
                print(f"cli correlation_id={corr}")
                service_upsert(corr, item)

            cli_main("corr-42", {"id": "C001"})
            """
        ).strip(),
        edge=["En apps reales: contextvars opcional; aquí explícito es más claro"],
        title="correlation_layers.py",
    ),
    Ex(
        "S09-T3-B-E3",
        "S09-T3-B",
        "transfer",
        "Audita el snippet que loguea PII y reescríbelo de forma segura.",
        "Detecta email/teléfono en el mensaje.",
        "Imprime SAFE: y el log redactado.",
        textwrap.dedent(
            """\
            def unsafe_log(row):
                return f"error en {row['email']} tel={row['phone']}"

            row = {"email": "a@ejemplo.pe", "phone": "999111222"}
            print("UNSAFE", unsafe_log(row))
            # TODO safe_log
            """
        ).strip(),
        textwrap.dedent(
            """\
            def mask_email(email: str) -> str:
                local, _, domain = email.partition("@")
                return f"{local[:1]}***@{domain}"

            def mask_phone(phone: str) -> str:
                d = "".join(c for c in phone if c.isdigit())
                return "***" + d[-4:]

            def unsafe_log(row):
                return f"error en {row['email']} tel={row['phone']}"

            def safe_log(row):
                return f"error en {mask_email(row['email'])} tel={mask_phone(row['phone'])}"

            row = {"email": "a@ejemplo.pe", "phone": "999111222"}
            print("UNSAFE", unsafe_log(row))
            print("SAFE", safe_log(row))
            """
        ).strip(),
        edge=["No loguear address completa tampoco"],
        title="audit_pii_log.py",
    ),
    Ex(
        "S09-T4-A-E1",
        "S09-T4-A",
        "guided",
        "Clasifica 8 fallos en data|config|provider e imprime `fallo: clase`.",
        "Config = arranque/schema; data = fila; provider = red/IO externo.",
        "Sé consistente con la taxonomía de la teoría.",
        textwrap.dedent(
            """\
            fallos = [
                "monto NaN en CSV",
                "YAML de config corrupto",
                "timeout S3",
                "email vacío en fila",
                "required_fields no definido",
                "HTTP 503 del proveedor",
                "dni con letras",
                "variable de entorno ROOT_PATH vacía",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            clase = {
                "monto NaN en CSV": "data",
                "YAML de config corrupto": "config",
                "timeout S3": "provider",
                "email vacío en fila": "data",
                "required_fields no definido": "config",
                "HTTP 503 del proveedor": "provider",
                "dni con letras": "data",
                "variable de entorno ROOT_PATH vacía": "config",
            }
            for f, c in clase.items():
                print(f"{f}: {c}")
            """
        ).strip(),
        edge=["Un 400 del API por payload malo puede ser data; 503 es provider"],
        title="taxonomy.py",
    ),
    Ex(
        "S09-T4-A-E2",
        "S09-T4-A",
        "independent",
        "Implementa `process_batch` que envía filas sin `id` a quarantine y retorna conteos.",
        "Retorno: ok, quarantined, in.",
        "Reconciliación in = len(ok)+len(quarantined).",
        textwrap.dedent(
            """\
            def process_batch(rows):
                # TODO
                ...

            rows = [{"id": 1}, {}, {"id": 2}]
            print(process_batch(rows))
            """
        ).strip(),
        textwrap.dedent(
            """\
            def process_batch(rows):
                ok, q = [], []
                for r in rows:
                    if not r.get("id"):
                        q.append({"row": r, "reason": "data:missing_id"})
                    else:
                        ok.append(r)
                return {"ok": ok, "quarantined": q, "in": len(rows)}

            rows = [{"id": 1}, {}, {"id": 2}]
            r = process_batch(rows)
            print(r)
            assert r["in"] == len(r["ok"]) + len(r["quarantined"])
            """
        ).strip(),
        edge=["id=0 podría ser válido en otros dominios; aquí truthiness simple"],
        title="process_batch.py",
    ),
    Ex(
        "S09-T4-A-E3",
        "S09-T4-A",
        "transfer",
        "Escribe una política en 3 líneas: cuándo abortar el job (imprime POLICY:...).",
        "Cubre config, umbral de cuarentena y provider total down.",
        "Texto claro para operadores no dev.",
        textwrap.dedent(
            """\
            # TODO: imprimir 3 reglas
            """
        ).strip(),
        textwrap.dedent(
            """\
            rules = [
                "POLICY: abortar si falta config crítica (schema, delimiter, paths)",
                "POLICY: abortar si quarantined/in > 0.5 en el lote",
                "POLICY: abortar si provider no responde tras retries; no abortar por 1 fila data",
            ]
            for r in rules:
                print(r)
            """
        ).strip(),
        edge=["El umbral 50% es ejemplo; documenta el de tu org"],
        title="abort_policy.py",
    ),
    Ex(
        "S09-T4-B-E1",
        "S09-T4-B",
        "guided",
        "Tabla error → retry sí/no para 5 tipos e imprime `error: yes|no`.",
        "Solo transitorios: TimeoutError, ConnectionError.",
        "ValueError/KeyError/PermissionError → no.",
        textwrap.dedent(
            """\
            errores = ["TimeoutError", "ValueError", "ConnectionError", "KeyError", "PermissionError"]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            retry = {
                "TimeoutError": "yes",
                "ValueError": "no",
                "ConnectionError": "yes",
                "KeyError": "no",
                "PermissionError": "no",
            }
            for e, r in retry.items():
                print(f"{e}: {r}")
            """
        ).strip(),
        edge=["429 rate limit a veces yes con backoff"],
        title="retry_table.py",
    ),
    Ex(
        "S09-T4-B-E2",
        "S09-T4-B",
        "independent",
        "Implementa `retry_call(fn, max_attempts=3)` que reintenta solo TimeoutError.",
        "Devuelve el resultado o relanza el último TimeoutError.",
        "Cuenta intentos en un cierre.",
        textwrap.dedent(
            """\
            def retry_call(fn, max_attempts=3):
                # TODO
                ...

            n = {"c": 0}

            def flaky():
                n["c"] += 1
                if n["c"] < 3:
                    raise TimeoutError("x")
                return "done"

            print(retry_call(flaky), "calls", n["c"])
            """
        ).strip(),
        textwrap.dedent(
            """\
            def retry_call(fn, max_attempts=3):
                last = None
                for _ in range(max_attempts):
                    try:
                        return fn()
                    except TimeoutError as e:
                        last = e
                raise last

            n = {"c": 0}

            def flaky():
                n["c"] += 1
                if n["c"] < 3:
                    raise TimeoutError("x")
                return "done"

            print(retry_call(flaky), "calls", n["c"])
            """
        ).strip(),
        edge=["max_attempts=1 no reintenta"],
        title="retry_call.py",
    ),
    Ex(
        "S09-T4-B-E3",
        "S09-T4-B",
        "transfer",
        "Diseña la clave de idempotencia para re-ingesta e imprímela para un ejemplo.",
        "Incluye source, record_id y content_hash o version.",
        "Formato: idem_key=...",
        textwrap.dedent(
            """\
            record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            import hashlib, json
            record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
            payload_hash = hashlib.sha256(
                json.dumps(record["payload"], sort_keys=True).encode()
            ).hexdigest()[:12]
            key = f"{record['source']}:{record['id']}:v{record['version']}:{payload_hash}"
            print("idem_key=" + key)
            """
        ).strip(),
        edge=["Misma clave + mismo payload = skip; misma clave + payload distinto = conflicto"],
        title="idempotency_key.py",
    ),
]

S09_YOUDO = textwrap.dedent(
    '''\
    """Bitácora auditable del pipeline — inicio CP-N1-C.
    Datos sintéticos only. Sin PII real. Sin claims de fraude.
    """
    from __future__ import annotations
    import logging
    from typing import Any

    def mask_email(email: str) -> str:
        local, _, domain = email.partition("@")
        return f"{(local[:1] or '*')}***@{domain}" if domain else "***"

    def mask_phone(phone: str) -> str:
        digits = "".join(c for c in phone if c.isdigit())
        return "***" + digits[-4:] if len(digits) >= 4 else "***"

    def classify_error(exc: BaseException) -> str:
        if isinstance(exc, (ValueError, KeyError)):
            return "data"
        if isinstance(exc, RuntimeError) and "config" in str(exc).lower():
            return "config"
        if isinstance(exc, TimeoutError):
            return "provider"
        return "data"

    def process_batch(records: list[dict[str, Any]], correlation_id: str) -> dict:
        log = logging.getLogger("audit")
        ok, quarantined = [], []
        errors_by_class: dict[str, int] = {}
        for r in records:
            try:
                if not r.get("id"):
                    raise ValueError("missing id")
                if "@" not in str(r.get("email", "")):
                    raise ValueError("bad email")
                ok.append(r)
            except Exception as e:
                cls = classify_error(e)
                errors_by_class[cls] = errors_by_class.get(cls, 0) + 1
                quarantined.append({"id": r.get("id"), "reason": str(e), "class": cls})
                log.error(
                    "correlation_id=%s error_class=%s email=%s",
                    correlation_id,
                    cls,
                    mask_email(str(r.get("email", ""))),
                )
        return {
            "ok": ok,
            "quarantined": quarantined,
            "errors_by_class": errors_by_class,
        }

    if __name__ == "__main__":
        logging.basicConfig(level=logging.ERROR)
        demo = [
            {"id": "C001", "email": "ana@ejemplo.pe", "phone": "999111222"},
            {"id": "C002", "email": "no-email", "phone": "999"},
            {"email": "x@ejemplo.pe"},
        ]
        print(process_batch(demo, "job-demo-1"))
    '''
).strip()


# ═══════════════════════════════════════════════════════════════════════════
# S10 — Módulos, packaging y CLI (platform id: sklearn)
# ═══════════════════════════════════════════════════════════════════════════

S10_THEORY: list[Theory] = [
    Theory(
        heading="De “scikit-learn ML pipeline” a módulos, packaging y CLI (mapa)",
        paragraphs=[
            "En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular. Aquí empaquetas **familiarity_core**: módulos limpios, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia**.",
            "Integra el ETL de CP-N1-B y la observabilidad de S09. Entorno **local-python**. Id de plataforma `sklearn` se conserva.",
            "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**.",
        ],
        callout=(
            "info",
            "CP-N1-B empaquetado / base CP-N1-C",
            "Gate: CLI ingest|normalize|compare|report; install editable; ayuda útil; lógica separada de I/O.",
        ),
    ),
    Theory(
        heading="Imports, namespaces y __main__",
        sub="S10-T1-A",
        paragraphs=[
            "`import pkg.mod` y `from pkg.mod import name` cargan el módulo una vez en `sys.modules`. **`__name__`** es el nombre del módulo, o `'__main__'` si se ejecuta como script.",
            "`if __name__ == '__main__':` protege el CLI/demo para que no corra al importar. **`__all__`** documenta la API pública de `from mod import *` (y comunica intención).",
            "Los **imports circulares** se rompen extrayendo un tercer módulo, importando dentro de funciones (lazy) o invirtiendo dependencias. Prefiere diseño a hacks.",
        ],
        code=textwrap.dedent(
            """\
            # simulación en un solo archivo
            __all__ = ["normalize_name"]

            def normalize_name(s: str) -> str:
                return " ".join(s.split()).casefold()

            def _cli():
                print(normalize_name("  Ana  PEREZ "))

            if __name__ == "__main__":
                _cli()
            print("import_safe", normalize_name("José"))
            """
        ).strip(),
        code_title="main_guard.py",
        callout=(
            "tip",
            "python -m",
            "Ejecutar `python -m familiarity_core` usa el paquete como __main__ sin pelear con sys.path.",
        ),
    ),
    Theory(
        heading="Dependencias cíclicas y API pública",
        sub="S10-T1-B",
        paragraphs=[
            "Prefijo `_` marca helpers **privados** (convención). La fachada (`__init__.py` o `api.py`) reexporta solo lo estable.",
            "Una **API pública pequeña** (p. ej. 4 símbolos) reduce breaking changes. Versiona la intención: añadir es minor; renombrar/eliminar es major.",
            "Lazy import dentro de funciones evita ciclos y acelera el import del paquete cuando un submódulo es pesado.",
        ],
        code=textwrap.dedent(
            """\
            def _strip(s: str) -> str:
                return s.strip()

            def normalize(s: str) -> str:
                return _strip(s).casefold()

            def compare(a: str, b: str) -> bool:
                return normalize(a) == normalize(b)

            __all__ = ["normalize", "compare"]
            print("public", __all__)
            print(compare(" Ana ", "ana"))
            """
        ).strip(),
        code_title="public_api.py",
        callout=(
            "warning",
            "No exportes _internals",
            "Si un usuario importa `_strip`, mañana no puedes renombrarlo sin romperlo.",
        ),
    ),
    Theory(
        heading="Layout src, pyproject.toml y builds",
        sub="S10-T2-A",
        paragraphs=[
            "Layout **src/**: `src/familiarity_core/...` evita importar el paquete desde el repo sin instalar. `pyproject.toml` declara name, version, requires-python y el build backend (setuptools/hatchling).",
            "`pip install -e .` instala en editable: cambias código y el import refleja al toque. Ideal en desarrollo del CLI.",
            "Si ves `ModuleNotFoundError` post-install, revisa nombre del paquete, packages discovery y el cwd.",
        ],
        code=textwrap.dedent(
            """\
            # fragmento conceptual de pyproject (como dict)
            pyproject = {
                "project": {
                    "name": "familiarity-core",
                    "version": "0.1.0",
                    "requires-python": ">=3.11",
                    "dependencies": [],
                },
                "build-system": {
                    "requires": ["setuptools>=61"],
                    "build-backend": "setuptools.build_meta",
                },
            }
            print(pyproject["project"]["name"], pyproject["project"]["version"])
            print("layout", "src/familiarity_core/__init__.py")
            """
        ).strip(),
        code_title="pyproject_min.py",
        callout=(
            "info",
            "stdlib first",
            "En N1 el paquete puede no depender de terceros; declara deps solo cuando existan.",
        ),
    ),
    Theory(
        heading="Versionado y compatibilidad",
        sub="S10-T2-B",
        paragraphs=[
            "**SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch. En 0.x es más flexible, pero documenta igual.",
            "`requires-python` y dependencies pinadas con criterio (mínimos, no caos de upper bounds sin razón).",
            "Un **CHANGELOG** stub (Added/Changed/Fixed) evita amnesia entre sprints. Breaking de firma pública se anuncia.",
        ],
        code=textwrap.dedent(
            """\
            def bump(version: str, level: str) -> str:
                maj, minor, patch = map(int, version.split("."))
                if level == "major":
                    return f"{maj+1}.0.0"
                if level == "minor":
                    return f"{maj}.{minor+1}.0"
                if level == "patch":
                    return f"{maj}.{minor}.{patch+1}"
                raise ValueError(level)

            print("0.1.0 + feature subcomando", bump("0.1.0", "minor"))
            print("0.2.0 + fix help text", bump("0.2.0", "patch"))
            print("1.0.0 + rename API", bump("1.0.0", "major"))
            """
        ).strip(),
        code_title="semver_bump.py",
        callout=(
            "tip",
            "Hacia S11",
            "Si el dominio cambia nombres de entidades públicas, es breaking para consumidores del paquete.",
        ),
    ),
    Theory(
        heading="argparse, subcomandos y exit codes",
        sub="S10-T3-A",
        paragraphs=[
            "`argparse.ArgumentParser` + **subparsers** modelan `ingest|normalize|compare|report`. Cada subcomando tiene flags propios.",
            "Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI dependen de esto.",
            "Separa el parse de args de la lógica: `main(argv) -> int` retorna el código; el entrypoint hace `sys.exit(main())`.",
        ],
        code=textwrap.dedent(
            """\
            import argparse

            def build_parser() -> argparse.ArgumentParser:
                p = argparse.ArgumentParser(prog="familiarity")
                sub = p.add_subparsers(dest="cmd", required=True)
                sub.add_parser("ingest", help="ingerir archivos")
                n = sub.add_parser("normalize", help="normalizar registros")
                n.add_argument("--field", default="name")
                sub.add_parser("compare")
                r = sub.add_parser("report")
                r.add_argument("--format", choices=["text", "json"], default="text")
                return p

            for argv in [["normalize", "--field", "email"], ["report", "--format", "json"]]:
                ns = build_parser().parse_args(argv)
                print(ns)
            """
        ).strip(),
        code_title="argparse_subs.py",
        callout=(
            "tip",
            "Ayuda humana",
            "help= y epilog en español claro reducen tickets de operadores.",
        ),
    ),
    Theory(
        heading="stdin/stdout/stderr y ayuda",
        sub="S10-T3-B",
        paragraphs=[
            "**stdout** = datos (JSON, CSV). **stderr** = logs y progreso. Así `cmd > out.json` no contamina el archivo.",
            "Soportar path o **`-`** para stdin habilita pipes: `cat data.json | familiarity normalize`.",
            "No mezcles `print` de debug en stdout. Progress bars y logs van a stderr.",
        ],
        code=textwrap.dedent(
            """\
            import sys
            from io import StringIO

            def normalize_stream(inp: str) -> str:
                return inp.strip().casefold()

            # simula: datos a stdout, log a stderr
            data_in = "  Ana Perez  "
            log = StringIO()
            log.write("stage=normalize event=start\\n")
            out = normalize_stream(data_in)
            log.write("stage=normalize event=done\\n")
            print(out)  # stdout data
            print(log.getvalue().strip(), file=sys.stderr)
            """
        ).strip(),
        code_title="stdio_split.py",
        callout=(
            "warning",
            "Contaminación de stdout",
            "Un print('ok') extra rompe el pipe de quien parsea JSON.",
        ),
    ),
    Theory(
        heading="Archivo/env/flags y precedencia",
        sub="S10-T4-A",
        paragraphs=[
            "Precedencia canónica: **flags CLI > variables de entorno > archivo de config > defaults**.",
            "Documenta la tabla en README. Un flag `--log-level` debe ganar a `FAMILIARITY_LOG_LEVEL`.",
            "Implementa un `merge_config` puro y testeable: dicts por capa, reduce de menor a mayor prioridad.",
        ],
        code=textwrap.dedent(
            """\
            def merge_config(defaults, file_cfg, env_cfg, flags):
                out = {}
                out.update(defaults)
                out.update({k: v for k, v in file_cfg.items() if v is not None})
                out.update({k: v for k, v in env_cfg.items() if v is not None})
                out.update({k: v for k, v in flags.items() if v is not None})
                return out

            cfg = merge_config(
                {"log_level": "INFO", "jobs": 1},
                {"log_level": "WARNING"},
                {"log_level": "DEBUG"},
                {"log_level": "ERROR"},
            )
            print(cfg)
            """
        ).strip(),
        code_title="config_merge.py",
        callout=(
            "info",
            "None vs missing",
            "Trata None en flags como 'no pasado' para no pisar env con nulls.",
        ),
    ),
    Theory(
        heading="Secretos, defaults y validación temprana",
        sub="S10-T4-B",
        paragraphs=[
            "Secretos **fuera del repo**: `.env` en `.gitignore`, nunca en logs. Defaults seguros (TLS on, log level INFO, no debug PII).",
            "`validate_config()` al arranque con errores claros (qué clave falta, qué subcomando la exige).",
            "Fail-fast de config evita procesar 10k filas con un path mal tipeado.",
        ],
        code=textwrap.dedent(
            """\
            def validate_config(cfg: dict, command: str) -> None:
                required_always = ["log_level"]
                for k in required_always:
                    if not cfg.get(k):
                        raise RuntimeError(f"config: falta {k}")
                if command in {"ingest", "report"} and not cfg.get("api_token"):
                    raise RuntimeError(f"config: api_token requerido para {command}")

            validate_config({"log_level": "INFO"}, "normalize")
            print("normalize ok sin token")
            try:
                validate_config({"log_level": "INFO"}, "ingest")
            except RuntimeError as e:
                print(e)
            """
        ).strip(),
        code_title="validate_config.py",
        callout=(
            "danger",
            "Secretos",
            "Si el token aparece en un traceback de DEBUG, ya se filtró. Redacta.",
        ),
    ),
]

S10_DEMOS: list[Demo] = [
    Demo(
        "S10-T1-A-DEMO",
        "S10-T1-A",
        "Separar normalize y cli en funciones; demo con guard __main__.",
        textwrap.dedent(
            """\
            __all__ = ["normalize"]

            def normalize(text: str) -> str:
                return " ".join(text.split()).casefold()

            def main(argv=None) -> int:
                import sys
                args = argv if argv is not None else ["  Ana  "]
                print(normalize(args[0]))
                return 0

            # al importar no corre main; lo invocamos explícito
            assert normalize("X") == "x"
            raise SystemExit(main(["  José Pérez "]))
            """
        ).strip(),
        "La lógica vive en normalize; el entrypoint solo orquesta.",
        title="normalize_cli_split.py",
    ),
    Demo(
        "S10-T1-B-DEMO",
        "S10-T1-B",
        "Fachada que exporta solo 4 símbolos públicos.",
        textwrap.dedent(
            """\
            def _private_token(s: str) -> list[str]:
                return s.split()

            def normalize(s: str) -> str:
                return " ".join(_private_token(s)).casefold()

            def compare(a: str, b: str) -> float:
                return 1.0 if normalize(a) == normalize(b) else 0.0

            def ingest_row(row: dict) -> dict:
                return {**row, "name": normalize(row.get("name", ""))}

            def report(rows: list) -> int:
                return len(rows)

            __all__ = ["normalize", "compare", "ingest_row", "report"]
            print("exports", __all__)
            print(compare("Ana", " ana "))
            print(report([ingest_row({"name": " Luis "})]))
            """
        ).strip(),
        "Cuatro símbolos estables; helpers con _ fuera de la API.",
        title="facade_exports.py",
    ),
    Demo(
        "S10-T2-A-DEMO",
        "S10-T2-A",
        "Modelo mínimo de layout src + metadatos instalables.",
        textwrap.dedent(
            """\
            from pathlib import PurePosixPath

            layout = [
                "src/familiarity_core/__init__.py",
                "src/familiarity_core/normalize.py",
                "src/familiarity_core/cli.py",
                "pyproject.toml",
                "README.md",
            ]
            for p in layout:
                print(PurePosixPath(p))
            meta = {"name": "familiarity-core", "version": "0.1.0"}
            print("editable_install", f"pip install -e .  # {meta}")
            """
        ).strip(),
        "El layout src + pyproject es el contrato de packaging del curso.",
        title="src_layout.py",
    ),
    Demo(
        "S10-T2-B-DEMO",
        "S10-T2-B",
        "Bump 0.1.0 → 0.2.0 por subcomando nuevo (minor).",
        textwrap.dedent(
            """\
            def classify_change(description: str) -> str:
                d = description.lower()
                if "breaking" in d or "rename api" in d:
                    return "major"
                if "add" in d or "subcomando" in d or "feature" in d:
                    return "minor"
                return "patch"

            def bump(v: str, kind: str) -> str:
                a, b, c = map(int, v.split("."))
                return {
                    "major": f"{a+1}.0.0",
                    "minor": f"{a}.{b+1}.0",
                    "patch": f"{a}.{b}.{c+1}",
                }[kind]

            ch = "add subcomando report"
            kind = classify_change(ch)
            print(ch, "->", kind, bump("0.1.0", kind))
            """
        ).strip(),
        "Feature compatible sube minor; documenta en CHANGELOG.",
        title="version_bump_demo.py",
    ),
    Demo(
        "S10-T3-A-DEMO",
        "S10-T3-A",
        "CLI con subcomandos ingest|normalize|compare|report y exit codes.",
        textwrap.dedent(
            """\
            import argparse

            def main(argv: list[str]) -> int:
                p = argparse.ArgumentParser(prog="familiarity")
                sub = p.add_subparsers(dest="cmd", required=True)
                sub.add_parser("ingest")
                sub.add_parser("normalize")
                sub.add_parser("compare")
                r = sub.add_parser("report")
                r.add_argument("--format", default="text")
                try:
                    ns = p.parse_args(argv)
                except SystemExit as e:
                    # argparse ya usa 2 en usage errors cuando no se intercepta;
                    # aquí re-lanzamos código
                    return int(e.code) if e.code is not None else 2
                if ns.cmd == "report":
                    print(f"report format={ns.format}")
                    return 0
                print(f"run {ns.cmd}")
                return 0

            print("code", main(["report", "--format", "json"]))
            print("code", main(["normalize"]))
            """
        ).strip(),
        "Subparsers + return codes hacen la CLI operable en scripts.",
        title="cli_subcommands.py",
    ),
    Demo(
        "S10-T3-B-DEMO",
        "S10-T3-B",
        "Datos a stdout y diagnóstico a stderr (simula pipe normalize).",
        textwrap.dedent(
            """\
            import sys
            from io import StringIO

            def normalize_cmd(raw: str, err: StringIO) -> str:
                err.write("stage=normalize event=start\\n")
                out = raw.strip().casefold()
                err.write("stage=normalize event=done\\n")
                return out

            stderr = StringIO()
            data = normalize_cmd('  {"name": "Ana"}  ', stderr)
            print(data)  # stdout
            print("--- stderr ---")
            print(stderr.getvalue().strip())
            """
        ).strip(),
        "El pipe de datos queda limpio; logs viven en stderr.",
        title="stdio_demo.py",
    ),
    Demo(
        "S10-T4-A-DEMO",
        "S10-T4-A",
        "FAMILIARITY_LOG_LEVEL vs --log-level: gana el flag.",
        textwrap.dedent(
            """\
            def resolve_log_level(default="INFO", env=None, flag=None) -> str:
                level = default
                if env:
                    level = env
                if flag:
                    level = flag
                return level

            print("solo env", resolve_log_level(env="DEBUG"))
            print("flag gana", resolve_log_level(env="DEBUG", flag="ERROR"))
            print("default", resolve_log_level())
            """
        ).strip(),
        "Precedencia flags > env > default documentada y testeable.",
        title="log_level_prec.py",
    ),
    Demo(
        "S10-T4-B-DEMO",
        "S10-T4-B",
        "Abort si falta API_TOKEN solo cuando el subcomando lo requiere.",
        textwrap.dedent(
            """\
            def need_token(command: str) -> bool:
                return command in {"ingest", "report"}

            def validate(command: str, cfg: dict) -> None:
                if need_token(command) and not cfg.get("API_TOKEN"):
                    raise SystemExit(f"config: API_TOKEN requerido para {command}")

            validate("normalize", {})
            print("normalize ok")
            try:
                validate("ingest", {})
            except SystemExit as e:
                print("abort", e)
            validate("ingest", {"API_TOKEN": "secret-demo"})
            print("ingest ok")
            """
        ).strip(),
        "Validación temprana y contextual al subcomando.",
        title="token_validate.py",
    ),
]

S10_EX: list[Ex] = [
    Ex(
        "S10-T1-A-E1",
        "S10-T1-A",
        "guided",
        "Crea un módulo lógico con función pública `clean` y `__all__ = ['clean']`.",
        "Helper privado con _ no va en __all__.",
        "Imprime __all__ y clean('  X ').",
        textwrap.dedent(
            """\
            # TODO: clean + __all__
            """
        ).strip(),
        textwrap.dedent(
            """\
            def _ws(s: str) -> str:
                return " ".join(s.split())

            def clean(s: str) -> str:
                return _ws(s).casefold()

            __all__ = ["clean"]
            print(__all__)
            print(clean("  X "))
            """
        ).strip(),
        edge=["import * no es recomendado; __all__ documenta intención"],
        title="public_module.py",
    ),
    Ex(
        "S10-T1-A-E2",
        "S10-T1-A",
        "independent",
        "Simula un import circular y arréglalo extrayendo un util compartido.",
        "a importa b y b importa a → rompe; mueve la función común a util.",
        "Imprime ok desde ambos lados.",
        textwrap.dedent(
            """\
            # circular roto conceptualmente:
            # a.f -> b.g -> a.f
            # TODO: versión sana con util
            """
        ).strip(),
        textwrap.dedent(
            """\
            def util_norm(s: str) -> str:
                return s.strip().casefold()

            def module_a_process(s: str) -> str:
                return util_norm(s) + ":a"

            def module_b_process(s: str) -> str:
                return util_norm(s) + ":b"

            print(module_a_process(" Hola "))
            print(module_b_process(" Hola "))
            print("ok")
            """
        ).strip(),
        edge=["Lazy import dentro de función es plan B"],
        title="fix_circular.py",
    ),
    Ex(
        "S10-T1-A-E3",
        "S10-T1-A",
        "transfer",
        "Elige import absoluto vs relativo en layout src: imprime la recomendación para 3 casos.",
        "Dentro del paquete: relativo OK; plugins externos: absoluto; scripts: -m.",
        "Formato caso -> recomendación.",
        textwrap.dedent(
            """\
            casos = [
                "normalize.py importa compare en el mismo paquete",
                "plugin externo usa familiarity_core",
                "ejecutar el CLI del paquete",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            recs = {
                "normalize.py importa compare en el mismo paquete": "relativo o absoluto del paquete (from . import compare)",
                "plugin externo usa familiarity_core": "absoluto (import familiarity_core)",
                "ejecutar el CLI del paquete": "python -m familiarity_core",
            }
            for c, r in recs.items():
                print(f"{c} -> {r}")
            """
        ).strip(),
        edge=["Evita manipular sys.path a mano en prod"],
        title="import_style.py",
    ),
    Ex(
        "S10-T1-B-E1",
        "S10-T1-B",
        "guided",
        "Marca helpers privados con _ y deja públicas solo `normalize` y `compare`.",
        "Imprime lista public vs private detectada por nombre.",
        "Usa dir() filtrado o una lista explícita.",
        textwrap.dedent(
            """\
            def tokenize(s):
                return s.split()

            def normalize(s):
                return " ".join(tokenize(s)).lower()

            def compare(a, b):
                return normalize(a) == normalize(b)

            # TODO: renombrar y reportar
            """
        ).strip(),
        textwrap.dedent(
            """\
            def _tokenize(s):
                return s.split()

            def normalize(s):
                return " ".join(_tokenize(s)).lower()

            def compare(a, b):
                return normalize(a) == normalize(b)

            names = ["_tokenize", "normalize", "compare"]
            public = [n for n in names if not n.startswith("_")]
            private = [n for n in names if n.startswith("_")]
            print("public", public)
            print("private", private)
            print(compare("A", "a"))
            """
        ).strip(),
        edge=["Un solo _ es convención, no enforcement del runtime"],
        title="mark_private.py",
    ),
    Ex(
        "S10-T1-B-E2",
        "S10-T1-B",
        "independent",
        "Implementa una fachada que reexporta normalize y compare e imprime __all__.",
        "Las implementaciones pueden ser locales.",
        "from-style reexport simulado.",
        textwrap.dedent(
            """\
            # TODO facade
            """
        ).strip(),
        textwrap.dedent(
            """\
            def normalize(s: str) -> str:
                return s.strip().casefold()

            def compare(a: str, b: str) -> bool:
                return normalize(a) == normalize(b)

            # facade reexport
            __all__ = ["normalize", "compare"]
            print(__all__)
            print(compare("Z", " z "))
            """
        ).strip(),
        edge=["No reexportes _tokenize"],
        title="facade.py",
    ),
    Ex(
        "S10-T1-B-E3",
        "S10-T1-B",
        "transfer",
        "Documenta un breaking change de firma pública: old → new y versión major.",
        "Imprime BREAKING y NEW_VERSION.",
        "Ejemplo: compare(a,b)->bool se vuelve compare(a,b)->float score.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            print("BREAKING: compare(a,b)->bool  =>  compare(a,b)->float score")
            print("NEW_VERSION: 1.0.0 -> 2.0.0")
            print("MIGRATION: usar compare(a,b) == 1.0 en vez de is True")
            """
        ).strip(),
        edge=["Añadir argumento opcional con default puede ser minor"],
        title="breaking_change.py",
    ),
    Ex(
        "S10-T2-A-E1",
        "S10-T2-A",
        "guided",
        "Completa un dict estilo pyproject con name y version e imprímelos.",
        "name=familiarity-core version=0.1.0",
        "Incluye requires-python >=3.11.",
        textwrap.dedent(
            """\
            project = {
                # TODO
            }
            print(project)
            """
        ).strip(),
        textwrap.dedent(
            """\
            project = {
                "name": "familiarity-core",
                "version": "0.1.0",
                "requires-python": ">=3.11",
            }
            print(project)
            """
        ).strip(),
        edge=["El nombre de distribución puede usar guiones; el import usa guion bajo"],
        title="pyproject_fields.py",
    ),
    Ex(
        "S10-T2-A-E2",
        "S10-T2-A",
        "independent",
        "Lista el layout src mínimo de un paquete importable e imprime cada path.",
        "Incluye __init__.py, normalize.py, cli.py, pyproject.toml.",
        "Usa prefijo src/familiarity_core/.",
        textwrap.dedent(
            """\
            # TODO paths
            """
        ).strip(),
        textwrap.dedent(
            """\
            paths = [
                "src/familiarity_core/__init__.py",
                "src/familiarity_core/normalize.py",
                "src/familiarity_core/cli.py",
                "pyproject.toml",
            ]
            for p in paths:
                print(p)
            """
        ).strip(),
        edge=["tests/ fuera de src"],
        title="layout_list.py",
    ),
    Ex(
        "S10-T2-A-E3",
        "S10-T2-A",
        "transfer",
        "Diagnostica ModuleNotFoundError: imprime 3 causas probables post-install.",
        "Piensa en nombre, editable, y cwd.",
        "Formato cause: ...",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            causes = [
                "cause: paquete no instalado (falta pip install -e .)",
                "cause: nombre import != nombre de carpeta (familiarity_core)",
                "cause: se ejecuta un script que tapa el paquete en sys.path",
            ]
            for c in causes:
                print(c)
            """
        ).strip(),
        edge=["venv incorrecto es causa clásica"],
        title="diagnose_mnf.py",
    ),
    Ex(
        "S10-T2-B-E1",
        "S10-T2-B",
        "guided",
        "Clasifica 4 cambios en major/minor/patch.",
        "Breaking → major; feature → minor; fix → patch.",
        "Imprime cambio: nivel.",
        textwrap.dedent(
            """\
            cambios = [
                "renombrar normalize a clean_name (API pública)",
                "añadir flag --format a report",
                "corregir typo en help",
                "eliminar subcomando compare",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            niveles = {
                "renombrar normalize a clean_name (API pública)": "major",
                "añadir flag --format a report": "minor",
                "corregir typo en help": "patch",
                "eliminar subcomando compare": "major",
            }
            for c, n in niveles.items():
                print(f"{c}: {n}")
            """
        ).strip(),
        edge=["Deprecar primero reduce dolor del major"],
        title="semver_classify.py",
    ),
    Ex(
        "S10-T2-B-E2",
        "S10-T2-B",
        "independent",
        "Fija dependencies mínimas del paquete (puede ser lista vacía + note) e imprime requires-python.",
        "Para N1 stdlib: dependencies=[].",
        "requires-python>=3.11.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            deps = {
                "requires-python": ">=3.11",
                "dependencies": [],
                "optional-dependencies": {"dev": ["pytest"]},
            }
            print(deps)
            """
        ).strip(),
        edge=["pytest como optional dev, no runtime"],
        title="deps_pin.py",
    ),
    Ex(
        "S10-T2-B-E3",
        "S10-T2-B",
        "transfer",
        "Escribe una política de compatibilidad hacia S11 dominio (3 bullets).",
        "Cubrir renames de entidades y versiones.",
        "Imprime POLICY líneas.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            for line in [
                "POLICY: renombrar ClientRecord es MAJOR; documentar migración",
                "POLICY: añadir campo opcional con default es MINOR",
                "POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG",
            ]:
                print(line)
            """
        ).strip(),
        edge=["Frozen entities pueden forzar major si cambia equality"],
        title="compat_policy.py",
    ),
    Ex(
        "S10-T3-A-E1",
        "S10-T3-A",
        "guided",
        "Añade subcomando report con --format text|json y parsea un argv de ejemplo.",
        "Usa argparse subparsers.",
        "Imprime el namespace.",
        textwrap.dedent(
            """\
            import argparse
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            import argparse
            p = argparse.ArgumentParser()
            sub = p.add_subparsers(dest="cmd", required=True)
            r = sub.add_parser("report")
            r.add_argument("--format", choices=["text", "json"], default="text")
            ns = p.parse_args(["report", "--format", "json"])
            print(ns)
            """
        ).strip(),
        edge=["required=True en subparsers (py3.7+)"],
        title="report_subcmd.py",
    ),
    Ex(
        "S10-T3-A-E2",
        "S10-T3-A",
        "independent",
        "Mapea situaciones a exit codes 0/1/2 e imprime `caso: code`.",
        "0 éxito, 1 runtime, 2 usage.",
        "Cinco casos.",
        textwrap.dedent(
            """\
            casos = [
                "normalize ok",
                "archivo de input no existe",
                "flag desconocido",
                "subcomando ausente",
                "validación de config falla al arrancar",
            ]
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            codes = {
                "normalize ok": 0,
                "archivo de input no existe": 1,
                "flag desconocido": 2,
                "subcomando ausente": 2,
                "validación de config falla al arrancar": 1,
            }
            for c, code in codes.items():
                print(f"{c}: {code}")
            """
        ).strip(),
        edge=["argparse usa 2 por defecto en errores de parseo"],
        title="exit_codes.py",
    ),
    Ex(
        "S10-T3-A-E3",
        "S10-T3-A",
        "transfer",
        "Escribe 3 líneas de ayuda --help orientadas a operador no dev.",
        "Evita jerga de frameworks.",
        "Imprime HELP: ...",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            for h in [
                "HELP: familiarity ingest --input data/clientes.csv  # carga el archivo de clientes",
                "HELP: familiarity normalize --field name            # limpia espacios y mayúsculas",
                "HELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config",
            ]:
                print(h)
            """
        ).strip(),
        edge=["Ejemplos concretos > descripciones abstractas"],
        title="operator_help.py",
    ),
    Ex(
        "S10-T3-B-E1",
        "S10-T3-B",
        "guided",
        "Escribe resultado a stdout y un log a stderr (capturado con StringIO en la demo).",
        "Función process(n) retorna n*2; log event=done.",
        "Imprime ambos streams.",
        textwrap.dedent(
            """\
            from io import StringIO
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from io import StringIO
            import sys

            def process(n: int, err: StringIO) -> int:
                err.write("event=done\\n")
                return n * 2

            err = StringIO()
            out = process(3, err)
            print(out)
            print("stderr:", err.getvalue().strip())
            """
        ).strip(),
        edge=["En CLI real: print(..., file=sys.stderr)"],
        title="stdout_stderr.py",
    ),
    Ex(
        "S10-T3-B-E2",
        "S10-T3-B",
        "independent",
        "Implementa `read_input(path_or_dash, stdin_text)` que lee path o '-' como stdin.",
        "Si path=='-', usa stdin_text.",
        "Prueba ambos modos.",
        textwrap.dedent(
            """\
            def read_input(path_or_dash, stdin_text="", file_text=None):
                # TODO
                ...

            print(read_input("-", stdin_text="desde stdin"))
            print(read_input("file.csv", file_text="desde file"))
            """
        ).strip(),
        textwrap.dedent(
            """\
            def read_input(path_or_dash, stdin_text="", file_text=None):
                if path_or_dash == "-":
                    return stdin_text
                return file_text if file_text is not None else ""

            print(read_input("-", stdin_text="desde stdin"))
            print(read_input("file.csv", file_text="desde file"))
            """
        ).strip(),
        edge=["En prod usa pathlib.Path.read_text o sys.stdin.read"],
        title="stdin_or_path.py",
    ),
    Ex(
        "S10-T3-B-E3",
        "S10-T3-B",
        "transfer",
        "Revisa un CLI que contamina stdout con prints de progreso y propón la salida limpia.",
        "Imprime BAD y GOOD.",
        "GOOD solo JSON final.",
        textwrap.dedent(
            """\
            def bad_cli():
                print("empezando")
                print('{"ok": true}')
                print("fin")

            # TODO good_cli
            """
        ).strip(),
        textwrap.dedent(
            """\
            from io import StringIO

            def bad_cli():
                return "empezando\\n{\\"ok\\": true}\\nfin"

            def good_cli(err: StringIO) -> str:
                err.write("empezando\\n")
                err.write("fin\\n")
                return '{"ok": true}'

            print("BAD")
            print(bad_cli())
            err = StringIO()
            print("GOOD")
            print(good_cli(err))
            print("stderr_only", err.getvalue().replace("\\n", " | ").strip())
            """
        ).strip(),
        edge=["jq falla si hay basura alrededor del JSON"],
        title="clean_stdout.py",
    ),
    Ex(
        "S10-T4-A-E1",
        "S10-T4-A",
        "guided",
        "Imprime la tabla de precedencia de 4 capas (1=más baja … 4=más alta).",
        "defaults < file < env < flags.",
        "Formato rank:layer",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            layers = ["defaults", "file", "env", "flags"]
            for i, name in enumerate(layers, 1):
                print(f"{i}:{name}")
            """
        ).strip(),
        edge=["Documenta si algún flag es global vs por subcomando"],
        title="precedence_table.py",
    ),
    Ex(
        "S10-T4-A-E2",
        "S10-T4-A",
        "independent",
        "Implementa `merge(defaults, file_cfg, env_cfg, flags)` ignorando None en capas altas.",
        "Prueba con log_level en todas las capas.",
        "El flag debe ganar.",
        textwrap.dedent(
            """\
            def merge(defaults, file_cfg, env_cfg, flags):
                # TODO
                ...

            print(merge(
                {"log_level": "INFO", "jobs": 1},
                {"log_level": "WARNING"},
                {"log_level": "DEBUG", "jobs": None},
                {"log_level": "ERROR"},
            ))
            """
        ).strip(),
        textwrap.dedent(
            """\
            def merge(defaults, file_cfg, env_cfg, flags):
                out = dict(defaults)
                for layer in (file_cfg, env_cfg, flags):
                    for k, v in layer.items():
                        if v is not None:
                            out[k] = v
                return out

            print(merge(
                {"log_level": "INFO", "jobs": 1},
                {"log_level": "WARNING"},
                {"log_level": "DEBUG", "jobs": None},
                {"log_level": "ERROR"},
            ))
            """
        ).strip(),
        edge=["jobs queda 1 porque env manda None"],
        title="merge_config.py",
    ),
    Ex(
        "S10-T4-A-E3",
        "S10-T4-A",
        "transfer",
        "Caso conflictivo: env=DEBUG y flag=INFO — imprime el resultado esperado y por qué.",
        "Una línea result= y una razón.",
        "Español claro.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            print("result=INFO")
            print("razon=el flag CLI tiene mayor precedencia que la variable de entorno")
            """
        ).strip(),
        edge=["Si el flag no se pasó (None), gana env"],
        title="conflict_case.py",
    ),
    Ex(
        "S10-T4-B-E1",
        "S10-T4-B",
        "guided",
        "Checklist de secretos en .gitignore: imprime 4 entradas típicas.",
        "Incluye .env, *.pem, credentials.json, .venv opcional no es secreto pero sí local.",
        "Formato ignore: ...",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            for x in [".env", ".env.*", "*.pem", "credentials.json"]:
                print("ignore:", x)
            """
        ).strip(),
        edge=[".env.example SÍ se commitea sin secretos"],
        title="gitignore_secrets.py",
    ),
    Ex(
        "S10-T4-B-E2",
        "S10-T4-B",
        "independent",
        "Implementa `validate_config(cfg)` que exige log_level y data_dir; errores claros.",
        "Raise RuntimeError con nombre de clave.",
        "Prueba ok y fail.",
        textwrap.dedent(
            """\
            def validate_config(cfg: dict) -> None:
                # TODO
                ...

            validate_config({"log_level": "INFO", "data_dir": "data"})
            print("ok")
            try:
                validate_config({"log_level": "INFO"})
            except RuntimeError as e:
                print(e)
            """
        ).strip(),
        textwrap.dedent(
            """\
            def validate_config(cfg: dict) -> None:
                for k in ("log_level", "data_dir"):
                    if not cfg.get(k):
                        raise RuntimeError(f"config: falta clave requerida '{k}'")

            validate_config({"log_level": "INFO", "data_dir": "data"})
            print("ok")
            try:
                validate_config({"log_level": "INFO"})
            except RuntimeError as e:
                print(e)
            """
        ).strip(),
        edge=["Mensajes con nombre de clave ayudan al operador"],
        title="validate_cfg.py",
    ),
    Ex(
        "S10-T4-B-E3",
        "S10-T4-B",
        "transfer",
        "Dado un default inseguro (log_level=DEBUG y echo_sql=True), propone defaults seguros.",
        "Imprime old → new por clave.",
        "Sin secretos en defaults.",
        textwrap.dedent(
            """\
            inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            inseguro = {"log_level": "DEBUG", "echo_sql": True, "api_token": "hardcoded"}
            seguro = {"log_level": "INFO", "echo_sql": False, "api_token": None}
            for k in inseguro:
                print(f"{k}: {inseguro[k]!r} -> {seguro[k]!r}")
            """
        ).strip(),
        edge=["token default None + validate al usar"],
        title="secure_defaults.py",
    ),
]

S10_YOUDO = textwrap.dedent(
    '''\
    """familiarity_core — packaging + CLI (CP-N1-B/C).
    Este stub simula la estructura; en tu repo real usa src/ + pyproject.toml.
    """
    from __future__ import annotations
    import argparse
    import sys
    from typing import Optional

    __all__ = ["normalize", "compare", "main"]

    def normalize(text: str) -> str:
        return " ".join(text.split()).casefold()

    def compare(a: str, b: str) -> float:
        return 1.0 if normalize(a) == normalize(b) else 0.0

    def build_parser() -> argparse.ArgumentParser:
        p = argparse.ArgumentParser(
            prog="familiarity",
            description="CLI de familiaridad (datos sintéticos).",
        )
        sub = p.add_subparsers(dest="cmd", required=True)
        sub.add_parser("ingest", help="ingerir archivos de entrada")
        n = sub.add_parser("normalize", help="normalizar texto")
        n.add_argument("text")
        c = sub.add_parser("compare", help="comparar dos textos")
        c.add_argument("a")
        c.add_argument("b")
        r = sub.add_parser("report", help="reporte simple")
        r.add_argument("--format", choices=["text", "json"], default="text")
        return p

    def main(argv: Optional[list[str]] = None) -> int:
        ns = build_parser().parse_args(argv)
        if ns.cmd == "normalize":
            print(normalize(ns.text))
            return 0
        if ns.cmd == "compare":
            print(compare(ns.a, ns.b))
            return 0
        if ns.cmd == "report":
            print("{\"status\": \"ok\"}" if ns.format == "json" else "status=ok")
            return 0
        if ns.cmd == "ingest":
            print("ingest: ok", file=sys.stderr)
            return 0
        return 2

    if __name__ == "__main__":
        raise SystemExit(main())
    '''
).strip()


# ═══════════════════════════════════════════════════════════════════════════
# S11 — OOP y modelo de dominio (platform id: testing)
# ═══════════════════════════════════════════════════════════════════════════

S11_THEORY: list[Theory] = [
    Theory(
        heading="De “Testing pytest/CI” a OOP y modelo de dominio (mapa)",
        paragraphs=[
            "En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad). Aquí modelas el **dominio de familiaridad**: `ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`.",
            "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Id de plataforma `testing` se conserva.",
            "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests).",
        ],
        callout=(
            "info",
            "CP-N1-C modelo de dominio",
            "Gate: cuatro tipos explícitos, invariantes, tests sin red/DB, README de límites éticos del modelo.",
        ),
    ),
    Theory(
        heading="Clases, instancias y dataclass",
        sub="S11-T1-A",
        paragraphs=[
            "Una **clase** define el molde; una **instancia** es un objeto concreto. `@dataclass` genera `__init__`, `__repr__` y opcionalmente comparación.",
            "Campos con **type hints** y `default_factory` para mutables (listas/dicts) evitan el clásico bug del default compartido.",
            "Migrar dicts anónimos a tipos nombra el dominio y habilita invariantes en T1-B.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass
            class ClientRecord:
                client_id: str
                full_name: str
                emails: list[str] = field(default_factory=list)

            c = ClientRecord("C001", "Ana Perez", ["ana@ejemplo.pe"])
            print(c)
            print(type(c).__name__, c.client_id)
            """
        ).strip(),
        code_title="client_dataclass.py",
        callout=(
            "tip",
            "Datos sintéticos",
            "Usa ids C00x y dominios ejemplo.pe en demos; nunca PII real de clientes.",
        ),
    ),
    Theory(
        heading="Invariantes y estados válidos",
        sub="S11-T1-B",
        paragraphs=[
            "`__post_init__` en dataclasses valida justo después de construir. Si el estado es inválido, **falla al crear** — no dejes objetos a medias.",
            "Método `validate()` reutilizable ayuda en factories `from_dict`. Sin side-effects de negocio externos (no llama APIs al validar).",
            "Ejemplo: `document_id` no vacío; fechas de transacción coherentes.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str

                def __post_init__(self) -> None:
                    if not self.client_id:
                        raise ValueError("client_id vacío")
                    if not self.document_id.strip():
                        raise ValueError("document_id vacío")

            print(ClientRecord("C001", "DNI-1"))
            try:
                ClientRecord("C002", "  ")
            except ValueError as e:
                print("reject", e)
            """
        ).strip(),
        code_title="invariants.py",
        callout=(
            "warning",
            "Fail on construct",
            "Un objeto inválido en memoria es peor que una excepción temprana.",
        ),
    ),
    Theory(
        heading="Propiedades y métodos",
        sub="S11-T2-A",
        paragraphs=[
            "`@property` expone campos calculados (`display_name`, `masked_email`) sin mutación peligrosa desde afuera.",
            "Métodos de instancia encapsulan consultas (`age_days_since`). Evita exponer PII raw en la superficie pública si puedes ofrecer máscaras.",
            "Setters validados solo cuando la mutación es parte del modelo; si no, prefiere frozen/nuevas instancias.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                first_name: str
                last_name: str
                email: str

                @property
                def display_name(self) -> str:
                    return f"{self.first_name} {self.last_name}"

                @property
                def masked_email(self) -> str:
                    local, _, domain = self.email.partition("@")
                    return f"{local[:1]}***@{domain}"

            c = ClientRecord("Ana", "Perez", "ana@ejemplo.pe")
            print(c.display_name, c.masked_email)
            """
        ).strip(),
        code_title="properties.py",
        callout=(
            "tip",
            "Consulta vs comando",
            "Properties no deberían enviar emails ni escribir a disco.",
        ),
    ),
    Theory(
        heading="Igualdad, hash y mutabilidad consciente",
        sub="S11-T2-B",
        paragraphs=[
            "`__eq__` por **business key** (document_id / entity_id) evita comparar basura de campos opcionales. **`frozen=True`** habilita hash seguro para sets/dicts.",
            "Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas campos del eq.",
            "Value objects (Evidence) suelen ser frozen; agregados con listas pueden ser mutables con cuidado.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class ResolvedEntity:
                entity_id: str
                display_name: str

            a = ResolvedEntity("E1", "Ana")
            b = ResolvedEntity("E1", "Ana Perez")
            s = {a, ResolvedEntity("E2", "Luis")}
            print("same id eq?", a == ResolvedEntity("E1", "otra"))
            # eq por defecto usa todos los campos; demo de set por identidad de valor completo
            print("set size", len(s))
            print("E1 in set", a in s)
            """
        ).strip(),
        code_title="frozen_entity.py",
        callout=(
            "info",
            "eq custom",
            "Si eq es solo por entity_id, implementa __eq__/__hash__ a mano o usa field compare.",
        ),
    ),
    Theory(
        heading="Composición antes que herencia",
        sub="S11-T3-A",
        paragraphs=[
            "**has-a** (composición) suele modelar mejor casos: `CaseFile` tiene lista de `RelationshipEvidence` y una `ResolvedEntity`.",
            "Herencia solo si hay **subtipo real** (is-a). Evita jerarquías frágiles `Client(Person(BaseEntity...))` solo para reutilizar un campo.",
            "Mixins con cautela: complejidad invisible. Prefiere funciones o colaboración entre objetos.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass(frozen=True)
            class RelationshipEvidence:
                left_id: str
                right_id: str
                signal_score: float  # dato, no veredicto

            @dataclass
            class CaseFile:
                entity: object
                evidences: list[RelationshipEvidence] = field(default_factory=list)

                def add(self, ev: RelationshipEvidence) -> None:
                    self.evidences.append(ev)

            cf = CaseFile(entity={"entity_id": "E1"})
            cf.add(RelationshipEvidence("E1", "E2", 0.42))
            print(len(cf.evidences), cf.evidences[0].signal_score)
            """
        ).strip(),
        code_title="composition.py",
        callout=(
            "danger",
            "Sin veredictos",
            "RelationshipEvidence guarda señales; no implementes is_family() automático.",
        ),
    ),
    Theory(
        heading="Protocolos y polimorfismo con propósito",
        sub="S11-T3-B",
        paragraphs=[
            "`typing.Protocol` describe un **puerto** (EntityStore con get/save) sin forzar herencia. Duck typing estructural.",
            "Útil para fakes en tests y para no acoplar dominio a una DB. Evita ABC pesados si Protocol basta.",
            "No introduzcas Protocol 'por si acaso' con una sola implementación y sin tests — YAGNI.",
        ],
        code=textwrap.dedent(
            """\
            from typing import Protocol, runtime_checkable

            @runtime_checkable
            class EntityStore(Protocol):
                def get(self, entity_id: str) -> dict | None: ...
                def save(self, entity: dict) -> None: ...

            class FakeStore:
                def __init__(self):
                    self._d: dict[str, dict] = {}
                def get(self, entity_id: str):
                    return self._d.get(entity_id)
                def save(self, entity: dict) -> None:
                    self._d[entity["entity_id"]] = entity

            store: EntityStore = FakeStore()
            store.save({"entity_id": "E1", "name": "Ana"})
            print(store.get("E1"))
            print(isinstance(store, EntityStore))
            """
        ).strip(),
        code_title="protocol_store.py",
        callout=(
            "tip",
            "Puertos",
            "El dominio habla con Protocol; el adapter SQL llega después sin reescribir reglas.",
        ),
    ),
    Theory(
        heading="Repositorios, servicios y serialización",
        sub="S11-T4-A",
        paragraphs=[
            "**Repository** light: get/save. **Service** light: orquesta dominio sin conocer CLI ni HTTP. `to_dict`/`from_dict` en el borde.",
            "Serializa sin password fields ni PII innecesaria. DTOs de borde no tienen que ser las entidades internas.",
            "CLI (S10) llama al service; el service no imprime ni parsea argparse.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass, asdict

            @dataclass
            class ClientRecord:
                client_id: str
                email: str

                def to_dict(self) -> dict:
                    return {"client_id": self.client_id, "email": self.email}

            class InMemoryClientRepository:
                def __init__(self):
                    self._d: dict[str, ClientRecord] = {}
                def save(self, c: ClientRecord) -> None:
                    self._d[c.client_id] = c
                def get(self, client_id: str) -> ClientRecord | None:
                    return self._d.get(client_id)

            class ClientService:
                def __init__(self, repo: InMemoryClientRepository):
                    self.repo = repo
                def register(self, client_id: str, email: str) -> dict:
                    c = ClientRecord(client_id, email)
                    self.repo.save(c)
                    return c.to_dict()  # no decide fraude

            svc = ClientService(InMemoryClientRepository())
            print(svc.register("C001", "a@ejemplo.pe"))
            """
        ).strip(),
        code_title="repo_service.py",
        callout=(
            "info",
            "Frontera",
            "I/O y formato de archivos quedan fuera del núcleo del dominio.",
        ),
    ),
    Theory(
        heading="Dependencias y pruebas del dominio",
        sub="S11-T4-B",
        paragraphs=[
            "Tests del dominio son **puros**: sin red, sin DB real. Fakes del Protocol bastan.",
            "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`).",
            "Scores de resolución/relación son campos; un test puede verificar que existen como float y que no hay método de veredicto.",
        ],
        code=textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class RelationshipEvidence:
                left_id: str
                right_id: str
                signal_score: float

            def test_no_fraud_api():
                assert not hasattr(RelationshipEvidence, "is_fraud")
                assert not hasattr(RelationshipEvidence, "is_related_family")
                ev = RelationshipEvidence("E1", "E2", 0.5)
                assert 0.0 <= ev.signal_score <= 1.0
                return "pass"

            print(test_no_fraud_api())
            """
        ).strip(),
        code_title="domain_tests.py",
        callout=(
            "danger",
            "Ética de producto",
            "El software de familiaridad no declara parentesco legal ni fraude; solo organiza evidencia.",
        ),
    ),
]

S11_DEMOS: list[Demo] = [
    Demo(
        "S11-T1-A-DEMO",
        "S11-T1-A",
        "ClientRecord dataclass desde dict sintético.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass
            class ClientRecord:
                client_id: str
                full_name: str
                emails: list[str] = field(default_factory=list)

                @classmethod
                def from_dict(cls, d: dict) -> "ClientRecord":
                    return cls(d["client_id"], d["full_name"], list(d.get("emails", [])))

            raw = {"client_id": "C001", "full_name": "Ana Perez", "emails": ["ana@ejemplo.pe"]}
            c = ClientRecord.from_dict(raw)
            print(c)
            """
        ).strip(),
        "from_dict nombra el borde dict→dominio.",
        title="client_from_dict.py",
    ),
    Demo(
        "S11-T1-B-DEMO",
        "S11-T1-B",
        "ClientRecord rechaza document_id vacío.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str

                def __post_init__(self) -> None:
                    if not str(self.document_id).strip():
                        raise ValueError("document_id vacío")

            print(ClientRecord("C001", "DNI-100"))
            try:
                ClientRecord("C002", "")
            except ValueError as e:
                print("rejected", e)
            """
        ).strip(),
        "Invariante en construcción: no hay instancia inválida.",
        title="reject_empty_doc.py",
    ),
    Demo(
        "S11-T2-A-DEMO",
        "S11-T2-A",
        "display_name y masked_email como properties.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                first_name: str
                last_name: str
                email: str

                @property
                def display_name(self) -> str:
                    return f"{self.first_name} {self.last_name}"

                @property
                def masked_email(self) -> str:
                    local, _, domain = self.email.partition("@")
                    return f"{local[:1]}***@{domain}"

            c = ClientRecord("Lucía", "Méndez", "lucia@ejemplo.pe")
            print(c.display_name)
            print(c.masked_email)
            """
        ).strip(),
        "La superficie pública no necesita el email completo para mostrar.",
        title="display_props.py",
    ),
    Demo(
        "S11-T2-B-DEMO",
        "S11-T2-B",
        "ResolvedEntity frozen por valor; set de entidades.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class ResolvedEntity:
                entity_id: str
                display_name: str

            e1 = ResolvedEntity("E1", "Ana")
            e1b = ResolvedEntity("E1", "Ana")
            e2 = ResolvedEntity("E2", "Luis")
            s = {e1, e1b, e2}
            print("size", len(s))
            print("e1==e1b", e1 == e1b)
            """
        ).strip(),
        "frozen permite usar entidades en sets sin sorpresas de mutación.",
        title="frozen_set.py",
    ),
    Demo(
        "S11-T3-A-DEMO",
        "S11-T3-A",
        "CaseFile compone list[RelationshipEvidence] + entidad resuelta.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass(frozen=True)
            class ResolvedEntity:
                entity_id: str

            @dataclass(frozen=True)
            class RelationshipEvidence:
                left_id: str
                right_id: str
                signal_score: float

            @dataclass
            class CaseFile:
                entity: ResolvedEntity
                evidences: list[RelationshipEvidence] = field(default_factory=list)

            cf = CaseFile(ResolvedEntity("E1"))
            cf.evidences.append(RelationshipEvidence("E1", "E2", 0.31))
            cf.evidences.append(RelationshipEvidence("E1", "E3", 0.12))
            print(cf.entity.entity_id, "n_ev", len(cf.evidences))
            print("scores", [e.signal_score for e in cf.evidences])
            """
        ).strip(),
        "Composición ensambla el caso sin herencia artificial.",
        title="casefile_compose.py",
    ),
    Demo(
        "S11-T3-B-DEMO",
        "S11-T3-B",
        "Protocol EntityStore con get/save; FakeStore en memoria.",
        textwrap.dedent(
            """\
            from typing import Protocol

            class EntityStore(Protocol):
                def get(self, entity_id: str): ...
                def save(self, entity: dict) -> None: ...

            class FakeStore:
                def __init__(self):
                    self.data = {}
                def get(self, entity_id: str):
                    return self.data.get(entity_id)
                def save(self, entity: dict) -> None:
                    self.data[entity["entity_id"]] = entity

            def upsert(store: EntityStore, entity: dict) -> dict:
                store.save(entity)
                return store.get(entity["entity_id"])

            print(upsert(FakeStore(), {"entity_id": "E9", "name": "Demo"}))
            """
        ).strip(),
        "El service depende del Protocol, no de una clase base pesada.",
        title="fake_store.py",
    ),
    Demo(
        "S11-T4-A-DEMO",
        "S11-T4-A",
        "InMemoryClientRepository + service que no decide fraude.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                email: str
                def to_dict(self):
                    return {"client_id": self.client_id, "email": self.email}

            class InMemoryClientRepository:
                def __init__(self):
                    self._d = {}
                def save(self, c: ClientRecord):
                    self._d[c.client_id] = c
                def get(self, cid: str):
                    return self._d.get(cid)

            class ClientService:
                def __init__(self, repo):
                    self.repo = repo
                def register(self, client_id, email):
                    c = ClientRecord(client_id, email)
                    self.repo.save(c)
                    # deliberadamente no hay is_fraud
                    return c.to_dict()

            print(ClientService(InMemoryClientRepository()).register("C001", "a@ejemplo.pe"))
            print("has_is_fraud", hasattr(ClientService, "is_fraud"))
            """
        ).strip(),
        "Service orquesta persistencia; no emite veredictos de fraude.",
        title="client_service.py",
    ),
    Demo(
        "S11-T4-B-DEMO",
        "S11-T4-B",
        "Tests de RelationshipEvidence: solo señales; sin is_fraud().",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class RelationshipEvidence:
                left_id: str
                right_id: str
                signal_score: float

            def test_signal_bounds():
                ev = RelationshipEvidence("E1", "E2", 0.7)
                assert 0 <= ev.signal_score <= 1
                assert not hasattr(ev, "is_fraud")
                return "pass"

            def test_no_family_verdict():
                assert not hasattr(RelationshipEvidence, "is_related_family")
                return "pass"

            print(test_signal_bounds())
            print(test_no_family_verdict())
            """
        ).strip(),
        "La suite protege el límite ético del modelo.",
        title="evidence_tests.py",
    ),
]

S11_EX: list[Ex] = [
    Ex(
        "S11-T1-A-E1",
        "S11-T1-A",
        "guided",
        "Completa la dataclass ClientRecord con client_id, full_name y phones: list[str].",
        "Usa field(default_factory=list).",
        "Instancia y print.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass
            class ClientRecord:
                client_id: str
                full_name: str
                phones: list[str] = field(default_factory=list)

            print(ClientRecord("C001", "Ana Perez", ["999111222"]))
            """
        ).strip(),
        edge=["default=[] sería mutable compartido"],
        title="complete_client.py",
    ),
    Ex(
        "S11-T1-A-E2",
        "S11-T1-A",
        "independent",
        "Define Transaction con tx_id, client_id, amount: float, currency: str obligatorios.",
        "Sin defaults en campos obligatorios.",
        "Crea una instancia sintética.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Transaction:
                tx_id: str
                client_id: str
                amount: float
                currency: str

            print(Transaction("T1", "C001", 150.5, "PEN"))
            """
        ).strip(),
        edge=["currency ISO como str en N1"],
        title="transaction.py",
    ),
    Ex(
        "S11-T1-A-E3",
        "S11-T1-A",
        "transfer",
        "Migra un dict anónimo a ClientRecord vía from_dict.",
        "classmethod from_dict.",
        "Imprime el tipo y el id.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            raw = {"client_id": "C007", "full_name": "Luis Ramos"}
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                full_name: str

                @classmethod
                def from_dict(cls, d: dict) -> "ClientRecord":
                    return cls(d["client_id"], d["full_name"])

            raw = {"client_id": "C007", "full_name": "Luis Ramos"}
            c = ClientRecord.from_dict(raw)
            print(type(c).__name__, c.client_id)
            """
        ).strip(),
        edge=["KeyError si falta campo — aceptable o validar en T1-B"],
        title="migrate_dict.py",
    ),
    Ex(
        "S11-T1-B-E1",
        "S11-T1-B",
        "guided",
        "Añade invariante: amount de Transaction debe ser > 0.",
        "__post_init__ raise ValueError.",
        "Muestra ok y reject.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Transaction:
                tx_id: str
                amount: float
                # TODO post_init
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Transaction:
                tx_id: str
                amount: float

                def __post_init__(self):
                    if self.amount <= 0:
                        raise ValueError("amount debe ser > 0")

            print(Transaction("T1", 10))
            try:
                Transaction("T2", 0)
            except ValueError as e:
                print("reject", e)
            """
        ).strip(),
        edge=["amount negativo también inválido"],
        title="tx_invariant.py",
    ),
    Ex(
        "S11-T1-B-E2",
        "S11-T1-B",
        "independent",
        "Factory from_dict con validación de client_id y document_id no vacíos.",
        "Raise ValueError con mensaje claro.",
        "Prueba ok y fail.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str

                @classmethod
                def from_dict(cls, d: dict) -> "ClientRecord":
                    # TODO
                    ...
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str

                @classmethod
                def from_dict(cls, d: dict) -> "ClientRecord":
                    cid = str(d.get("client_id", "")).strip()
                    doc = str(d.get("document_id", "")).strip()
                    if not cid:
                        raise ValueError("client_id vacío")
                    if not doc:
                        raise ValueError("document_id vacío")
                    return cls(cid, doc)

            print(ClientRecord.from_dict({"client_id": "C1", "document_id": "D1"}))
            try:
                ClientRecord.from_dict({"client_id": "C2", "document_id": " "})
            except ValueError as e:
                print(e)
            """
        ).strip(),
        edge=["strip evita espacios como id válido"],
        title="from_dict_validate.py",
    ),
    Ex(
        "S11-T1-B-E3",
        "S11-T1-B",
        "transfer",
        "Lista en español 4 invariantes del dominio e imprímelas.",
        "ClientRecord, Transaction, Evidence, Entity.",
        "Formato INV: ...",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            for inv in [
                "INV: ClientRecord.document_id no vacío",
                "INV: Transaction.amount > 0 y currency no vacía",
                "INV: RelationshipEvidence.signal_score entre 0 y 1",
                "INV: ResolvedEntity.entity_id único y no vacío",
            ]:
                print(inv)
            """
        ).strip(),
        edge=["Invariantes de negocio ≠ veredictos de fraude"],
        title="invariants_list.py",
    ),
    Ex(
        "S11-T2-A-E1",
        "S11-T2-A",
        "guided",
        "Property full_name desde first_name y last_name.",
        "@property sin setter.",
        "Print full_name.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Person:
                first_name: str
                last_name: str
                # TODO property
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Person:
                first_name: str
                last_name: str

                @property
                def full_name(self) -> str:
                    return f"{self.first_name} {self.last_name}"

            print(Person("Ana", "Perez").full_name)
            """
        ).strip(),
        edge=["No guardar full_name duplicado si se puede calcular"],
        title="full_name_prop.py",
    ),
    Ex(
        "S11-T2-A-E2",
        "S11-T2-A",
        "independent",
        "Método age_days_since(day: int) en Transaction con campo day_created: int (demo sin datetime).",
        "Retorna day - day_created.",
        "Prueba con números sintéticos.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Transaction:
                tx_id: str
                day_created: int
                # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class Transaction:
                tx_id: str
                day_created: int

                def age_days_since(self, day: int) -> int:
                    return day - self.day_created

            print(Transaction("T1", 10).age_days_since(25))
            """
        ).strip(),
        edge=["En prod usa date/datetime; aquí simplificamos"],
        title="age_days.py",
    ),
    Ex(
        "S11-T2-A-E3",
        "S11-T2-A",
        "transfer",
        "Encapsula mutación de score con setter que solo acepta 0..1.",
        "Property score con setter validado.",
        "Muestra ok y reject.",
        textwrap.dedent(
            """\
            class Signal:
                def __init__(self):
                    self._score = 0.0
                # TODO property score
            """
        ).strip(),
        textwrap.dedent(
            """\
            class Signal:
                def __init__(self):
                    self._score = 0.0

                @property
                def score(self) -> float:
                    return self._score

                @score.setter
                def score(self, value: float) -> None:
                    v = float(value)
                    if not 0.0 <= v <= 1.0:
                        raise ValueError("score fuera de rango")
                    self._score = v

            s = Signal()
            s.score = 0.4
            print("ok", s.score)
            try:
                s.score = 1.5
            except ValueError as e:
                print("reject", e)
            """
        ).strip(),
        edge=["score es señal, no veredicto"],
        title="score_setter.py",
    ),
    Ex(
        "S11-T2-B-E1",
        "S11-T2-B",
        "guided",
        "Implementa eq por business key document_id (dos clientes iguales si mismo doc).",
        "__eq__ custom; no hace falta hash si no frozen.",
        "Print comparaciones.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str
                # TODO eq
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str

                def __eq__(self, other):
                    if not isinstance(other, ClientRecord):
                        return NotImplemented
                    return self.document_id == other.document_id

            a = ClientRecord("C1", "DNI-9")
            b = ClientRecord("C2", "DNI-9")
            c = ClientRecord("C3", "DNI-1")
            print(a == b, a == c)
            """
        ).strip(),
        edge=["Si defines eq sin hash, la clase no es hasheable (OK)"],
        title="eq_document.py",
    ),
    Ex(
        "S11-T2-B-E2",
        "S11-T2-B",
        "independent",
        "Crea Evidence frozen value object y úsalo en un set.",
        "frozen=True dataclass.",
        "Imprime len del set con duplicado.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class Evidence:
                left_id: str
                right_id: str
                signal_score: float

            s = {
                Evidence("E1", "E2", 0.2),
                Evidence("E1", "E2", 0.2),
                Evidence("E1", "E3", 0.1),
            }
            print(len(s))
            """
        ).strip(),
        edge=["Duplicado exacto colapsa en set"],
        title="frozen_evidence.py",
    ),
    Ex(
        "S11-T2-B-E3",
        "S11-T2-B",
        "transfer",
        "Demuestra el bug de entidad mutable como key de dict y la versión frozen segura.",
        "Imprime BUG y SAFE.",
        "Con mutable: cambiar campo rompe lookup.",
        textwrap.dedent(
            """\
            # TODO demo bug + safe
            """
        ).strip(),
        textwrap.dedent(
            """\
            class MutableEntity:
                def __init__(self, eid, name):
                    self.eid = eid
                    self.name = name
                def __hash__(self):
                    return hash((self.eid, self.name))
                def __eq__(self, o):
                    return isinstance(o, MutableEntity) and (self.eid, self.name) == (o.eid, o.name)

            m = MutableEntity("E1", "Ana")
            d = {m: "row"}
            m.name = "Ana P"  # mutó la key
            print("BUG lookup_after_mutate", d.get(m))

            from dataclasses import dataclass

            @dataclass(frozen=True)
            class FrozenEntity:
                eid: str
                name: str

            f = FrozenEntity("E1", "Ana")
            d2 = {f: "row"}
            print("SAFE", d2.get(FrozenEntity("E1", "Ana")))
            """
        ).strip(),
        edge=["No implementes __hash__ en mutables"],
        title="mutable_key_bug.py",
    ),
    Ex(
        "S11-T3-A-E1",
        "S11-T3-A",
        "guided",
        "Reemplaza herencia innecesaria Client(Person) por composición Client tiene person_info dict/objeto.",
        "Imprime el diseño final simple.",
        "Sin class Person base.",
        textwrap.dedent(
            """\
            # malo: class Client(Person): ...
            # TODO composición
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class PersonInfo:
                first_name: str
                last_name: str

            @dataclass
            class Client:
                client_id: str
                person: PersonInfo

            c = Client("C001", PersonInfo("Ana", "Perez"))
            print(c.client_id, c.person.first_name)
            print("design=composition")
            """
        ).strip(),
        edge=["Composición permite cambiar PersonInfo sin romper Client"],
        title="replace_inheritance.py",
    ),
    Ex(
        "S11-T3-A-E2",
        "S11-T3-A",
        "independent",
        "CaseFile agrega evidencias con add_evidence y cuenta.",
        "Lista interna.",
        "Print n=2.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass
            class CaseFile:
                case_id: str
                evidences: list = field(default_factory=list)
                # TODO add_evidence
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass, field

            @dataclass
            class CaseFile:
                case_id: str
                evidences: list = field(default_factory=list)

                def add_evidence(self, ev: dict) -> None:
                    self.evidences.append(ev)

            cf = CaseFile("CF1")
            cf.add_evidence({"score": 0.1})
            cf.add_evidence({"score": 0.2})
            print("n=", len(cf.evidences))
            """
        ).strip(),
        edge=["Validar score en el value object, no solo en CaseFile"],
        title="casefile_add.py",
    ),
    Ex(
        "S11-T3-A-E3",
        "S11-T3-A",
        "transfer",
        "Justifica en 2 líneas por qué no heredar Client de Person; imprime JUST: ...",
        "Piensa en roles y evolución del modelo.",
        "Español profesional.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            print("JUST: un cliente tiene datos de persona, pero también roles, cuentas y evidencias que no son subtipo de Person")
            print("JUST: la composición evita jerarquías frágiles cuando Person cambia sin ser Client")
            """
        ).strip(),
        edge=["is-a real: SavingsAccount is-a Account tal vez; Client is-a Person rara vez aporta"],
        title="why_not_inherit.py",
    ),
    Ex(
        "S11-T3-B-E1",
        "S11-T3-B",
        "guided",
        "Define Protocol Scorer con score(pair: tuple[str,str]) -> float y un FakeScorer.",
        "Imprime el score de un par sintético.",
        "typing.Protocol.",
        textwrap.dedent(
            """\
            from typing import Protocol
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            from typing import Protocol

            class Scorer(Protocol):
                def score(self, pair: tuple[str, str]) -> float: ...

            class FakeScorer:
                def score(self, pair: tuple[str, str]) -> float:
                    return 0.5 if pair[0] != pair[1] else 1.0

            s: Scorer = FakeScorer()
            print(s.score(("E1", "E2")))
            """
        ).strip(),
        edge=["El Protocol no se instancia"],
        title="scorer_protocol.py",
    ),
    Ex(
        "S11-T3-B-E2",
        "S11-T3-B",
        "independent",
        "Dos implementaciones de normalizer (strip vs casefold) usables por la misma función apply.",
        "apply(norm, text) llama norm(text).",
        "Imprime ambos resultados.",
        textwrap.dedent(
            """\
            def apply(norm, text):
                return norm(text)

            # TODO dos normalizers
            """
        ).strip(),
        textwrap.dedent(
            """\
            def apply(norm, text):
                return norm(text)

            def strip_norm(s: str) -> str:
                return s.strip()

            def casefold_norm(s: str) -> str:
                return s.strip().casefold()

            print(apply(strip_norm, " Ana "))
            print(apply(casefold_norm, " Ana "))
            """
        ).strip(),
        edge=["Duck typing: cualquier callable sirve"],
        title="two_normalizers.py",
    ),
    Ex(
        "S11-T3-B-E3",
        "S11-T3-B",
        "transfer",
        "Escribe 2 razones para NO introducir Protocol aún e imprime WHEN_NOT.",
        "YAGNI / una sola implementación.",
        "Español claro.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            print("WHEN_NOT: solo hay una implementación y no hay tests con fake")
            print("WHEN_NOT: el puerto aún no es estable y crear Protocol congela una API prematura")
            """
        ).strip(),
        edge=["Cuando aparece el segundo adapter, el Protocol suele justificar"],
        title="when_not_protocol.py",
    ),
    Ex(
        "S11-T4-A-E1",
        "S11-T4-A",
        "guided",
        "to_dict de ClientRecord sin campos password/secret.",
        "Aunque existan en el objeto, no serializarlos.",
        "Print dict.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                email: str
                password: str = ""
                # TODO to_dict
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                email: str
                password: str = ""

                def to_dict(self) -> dict:
                    return {"client_id": self.client_id, "email": self.email}

            print(ClientRecord("C1", "a@ejemplo.pe", "secret").to_dict())
            """
        ).strip(),
        edge=["password no debería vivir en el dominio de familiaridad idealmente"],
        title="to_dict_safe.py",
    ),
    Ex(
        "S11-T4-A-E2",
        "S11-T4-A",
        "independent",
        "Repository save/get con dict store en memoria.",
        "Clase con save y get.",
        "Roundtrip de un client dict.",
        textwrap.dedent(
            """\
            class Repo:
                # TODO
                ...
            """
        ).strip(),
        textwrap.dedent(
            """\
            class Repo:
                def __init__(self):
                    self._d = {}
                def save(self, row: dict) -> None:
                    self._d[row["client_id"]] = row
                def get(self, client_id: str):
                    return self._d.get(client_id)

            r = Repo()
            r.save({"client_id": "C001", "email": "a@ejemplo.pe"})
            print(r.get("C001"))
            """
        ).strip(),
        edge=["get retorna None si no existe"],
        title="mem_repo.py",
    ),
    Ex(
        "S11-T4-A-E3",
        "S11-T4-A",
        "transfer",
        "Dibuja en texto la frontera dominio vs CLI I/O (3 capas).",
        "cli → service → domain/repo.",
        "Imprime LAYER líneas.",
        textwrap.dedent(
            """\
            # TODO
            """
        ).strip(),
        textwrap.dedent(
            """\
            for line in [
                "LAYER: cli — argparse, stdin/stdout, exit codes",
                "LAYER: service — casos de uso, sin print",
                "LAYER: domain/repo — entidades, invariantes, persistencia abstracta",
            ]:
                print(line)
            """
        ).strip(),
        edge=["Logging puede colgarse del service con correlation_id"],
        title="boundary_layers.py",
    ),
    Ex(
        "S11-T4-B-E1",
        "S11-T4-B",
        "guided",
        "Test de invariante ClientRecord: document_id vacío lanza ValueError; imprime pass.",
        "Usa assert en un try o pytest-style manual.",
        "print('pass') al final.",
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str
                def __post_init__(self):
                    if not self.document_id.strip():
                        raise ValueError("document_id vacío")

            # TODO test
            """
        ).strip(),
        textwrap.dedent(
            """\
            from dataclasses import dataclass

            @dataclass
            class ClientRecord:
                client_id: str
                document_id: str
                def __post_init__(self):
                    if not self.document_id.strip():
                        raise ValueError("document_id vacío")

            def test_empty_document_rejected():
                try:
                    ClientRecord("C1", " ")
                    assert False, "debía fallar"
                except ValueError:
                    return "pass"

            print(test_empty_document_rejected())
            """
        ).strip(),
        edge=["Tests puros: sin I/O"],
        title="test_invariant.py",
    ),
    Ex(
        "S11-T4-B-E2",
        "S11-T4-B",
        "independent",
        "Fake repo en 3 tests de servicio (register, get, missing).",
        "Imprime pass x3.",
        "Service simple con repo inyectado.",
        textwrap.dedent(
            """\
            class FakeRepo:
                def __init__(self):
                    self.d = {}
                def save(self, row):
                    self.d[row["id"]] = row
                def get(self, id):
                    return self.d.get(id)

            class Service:
                def __init__(self, repo):
                    self.repo = repo
                def register(self, id, name):
                    self.repo.save({"id": id, "name": name})
                    return self.repo.get(id)

            # TODO 3 tests
            """
        ).strip(),
        textwrap.dedent(
            """\
            class FakeRepo:
                def __init__(self):
                    self.d = {}
                def save(self, row):
                    self.d[row["id"]] = row
                def get(self, id):
                    return self.d.get(id)

            class Service:
                def __init__(self, repo):
                    self.repo = repo
                def register(self, id, name):
                    self.repo.save({"id": id, "name": name})
                    return self.repo.get(id)

            def test_register():
                s = Service(FakeRepo())
                assert s.register("C1", "Ana")["name"] == "Ana"
                print("pass")

            def test_get():
                repo = FakeRepo()
                Service(repo).register("C1", "Ana")
                assert repo.get("C1")["id"] == "C1"
                print("pass")

            def test_missing():
                assert Service(FakeRepo()).repo.get("X") is None
                print("pass")

            test_register(); test_get(); test_missing()
            """
        ).strip(),
        edge=["Fake no es mock mágico: es implementación en memoria"],
        title="fake_repo_tests.py",
    ),
    Ex(
        "S11-T4-B-E3",
        "S11-T4-B",
        "transfer",
        "Revisa una clase con decide_fraud y propón extracción: imprime ANTES/DESPUÉS conceptual.",
        "Mueve el score a Evidence; elimina el veredicto.",
        "Dos líneas.",
        textwrap.dedent(
            """\
            class BadClient:
                def decide_fraud(self, score):
                    return score > 0.9
            # TODO propuesta
            """
        ).strip(),
        textwrap.dedent(
            """\
            print("ANTES: Client.decide_fraud(score)->bool veredicto en el dominio")
            print("DESPUES: RelationshipEvidence.signal_score: float + revisión humana fuera del modelo")
            """
        ).strip(),
        edge=["Umbrales de producto no son invariantes de entidad"],
        title="extract_fraud.py",
    ),
]

S11_YOUDO = textwrap.dedent(
    '''\
    """Modelo de dominio Cliente–Transacción–Evidencia (CP-N1-C).
    Ningún método decide fraude ni parentesco. Datos sintéticos.
    """
    from __future__ import annotations
    from dataclasses import dataclass, field
    from typing import Protocol

    @dataclass
    class ClientRecord:
        client_id: str
        document_id: str
        full_name: str
        emails: list[str] = field(default_factory=list)

        def __post_init__(self) -> None:
            if not self.client_id or not self.document_id.strip():
                raise ValueError("client_id/document_id inválidos")

        def to_dict(self) -> dict:
            return {
                "client_id": self.client_id,
                "document_id": self.document_id,
                "full_name": self.full_name,
                "emails": list(self.emails),
            }

    @dataclass(frozen=True)
    class ResolvedEntity:
        entity_id: str
        display_name: str

    @dataclass
    class Transaction:
        tx_id: str
        client_id: str
        amount: float
        currency: str

        def __post_init__(self) -> None:
            if self.amount <= 0:
                raise ValueError("amount debe ser > 0")

    @dataclass(frozen=True)
    class RelationshipEvidence:
        left_id: str
        right_id: str
        signal_score: float  # dato, no veredicto

        def __post_init__(self) -> None:
            if not 0.0 <= self.signal_score <= 1.0:
                raise ValueError("signal_score fuera de rango")

    class ClientRepository(Protocol):
        def save(self, client: ClientRecord) -> None: ...
        def get(self, client_id: str) -> ClientRecord | None: ...

    class InMemoryClientRepository:
        def __init__(self) -> None:
            self._d: dict[str, ClientRecord] = {}

        def save(self, client: ClientRecord) -> None:
            self._d[client.client_id] = client

        def get(self, client_id: str) -> ClientRecord | None:
            return self._d.get(client_id)

    def test_domain() -> None:
        repo = InMemoryClientRepository()
        c = ClientRecord("C001", "DNI-1", "Ana Perez", ["ana@ejemplo.pe"])
        repo.save(c)
        assert repo.get("C001") is not None
        assert not hasattr(RelationshipEvidence, "is_fraud")
        ev = RelationshipEvidence("E1", "E2", 0.4)
        assert ev.signal_score == 0.4
        print("tests_pass")

    if __name__ == "__main__":
        test_domain()
        print(ClientRecord("C002", "DNI-2", "Luis").to_dict())
    '''
).strip()


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # ── S09 ──────────────────────────────────────────────────────────────
    s09_meta = {
        "id": "visualization",
        "index": 9,
        "title": "Excepciones, debugging y logging seguro",
        "shortTitle": "Excepciones & logs",
        "tagline": "Excepciones específicas, diagnóstico, logging sin PII y resiliencia del pipeline de familiaridad",
        "estimatedHours": 8,
        "level": "Intermedio",
        "phase": 0,
        "icon": "ShieldAlert",
        "accentColor": "bg-gradient-to-br from-pink-500 to-rose-600",
        "jobRelevance": (
            "En pipelines de familiaridad y data engineering junior en Perú, un crash opaco o un log con "
            "email completo te cuesta incidentes y cumplimiento. Esta sección (id de plataforma "
            "`visualization` conservado) retematiza S09 a **excepciones, debugging y logging seguro**: "
            "inicio de **CP-N1-C**. matplotlib/seaborn se difieren al tramo de visualización de datos."
        ),
        "learningOutcomes": [
            "Elegir tipos de excepción, raise con contexto y chaining con from",
            "Dibujar fronteras try/except/finally y separar recuperable vs fatal",
            "Leer tracebacks y ubicar el frame útil sin exponer secretos",
            "Reducir fallos a minimal repro con hipótesis y tests de regresión",
            "Configurar logging con niveles y campos estructurados",
            "Propagar correlation_id y redactar email/teléfono/dirección",
            "Decidir fail-fast vs cuarentena según data|config|provider",
            "Reintentar solo errores transitorios con operaciones idempotentes",
        ],
    }
    s09_youdo = {
        "title": "Bitácora auditable del pipeline (inicio CP-N1-C)",
        "context": (
            "Inicias **CP-N1-C**: una bitácora de pipeline que clasifica fallos (data|config|provider), "
            "emite logs estructurados con correlation_id y **nunca** registra PII completa. "
            "Datos sintéticos; sin claims de fraude. Reemplaza el legado de visualización Netflix EDA."
        ),
        "objectives": [
            "Clasificar fallos en data | config | provider",
            "Emitir logs estructurados con correlation_id",
            "Redactar email/teléfono/dirección completos",
            "Cuarentena de filas inválidas sin abortar el lote salvo config fatal",
            "Documentar política fail-fast vs continue en README",
        ],
        "requirements": [
            "Módulo audit_log / process_batch con redact helpers",
            "process_batch(records) → {ok, quarantined, errors_by_class}",
            "Ningún log de demo contiene PII completa",
            "Dataset sintético; if __name__ == '__main__' demo reproducible",
            "Entorno local-python",
            "Sin matplotlib/seaborn en este incremento V3",
        ],
        "starterCode": S09_YOUDO,
        "portfolioNote": (
            "Muestra en README: 1 corrida con correlation_id, 1 log enmascarado, tabla de taxonomía "
            "data/config/provider y política de abort. Subraya privacidad."
        ),
        "rubric": [
            ("Alineación al gate V3 de la sección", "25%"),
            ("Correctitud técnica en entorno declarado", "20%"),
            ("Privacidad / sin PII real / sin secretos", "20%"),
            ("Pruebas o casos de borde documentados", "15%"),
            ("Código legible y límites claros", "10%"),
            ("Documentación en español profesional", "10%"),
        ],
    }
    s09_self = [
        {
            "question": "¿Para qué sirve `raise NewError(...) from e`?",
            "options": [
                "Ignorar el error original",
                "Encadenar la causa en __cause__ sin perder contexto",
                "Convertir todo a SystemExit",
                "Silenciar el traceback",
            ],
            "correctIndex": 1,
            "explanation": "from e preserva la excepción original como causa encadenada.",
        },
        {
            "question": "Un delimiter vacío en config del job debería…",
            "options": [
                "Cuarentenar una fila y seguir",
                "Fail-fast (abortar el job)",
                "Reintentar 3 veces siempre",
                "Loguear el row completo con PII",
            ],
            "correctIndex": 1,
            "explanation": "Fallos de config son fatales; no tiene sentido procesar el lote.",
        },
        {
            "question": "¿Qué va a stdout en una CLI bien diseñada?",
            "options": [
                "Logs DEBUG y el JSON de salida mezclados",
                "Solo datos; diagnóstico a stderr",
                "Solo tracebacks",
                "Secretos de config",
            ],
            "correctIndex": 1,
            "explanation": "Separar streams permite pipes limpios (S10 refuerza esto).",
        },
        {
            "question": "mask_email('ana@ejemplo.pe') de forma segura podría ser…",
            "options": [
                "ana@ejemplo.pe sin cambios",
                "a***@ejemplo.pe",
                "None",
                "El hash MD5 del password",
            ],
            "correctIndex": 1,
            "explanation": "Máscara parcial: accionable sin PII completa.",
        },
        {
            "question": "TimeoutError en un fetch remoto típico…",
            "options": [
                "Nunca se reintenta",
                "Puede reintentarse con backoff; ValueError de datos no",
                "Se convierte en KeyError",
                "Implica fraude",
            ],
            "correctIndex": 1,
            "explanation": "Solo errores transitorios merecen retry.",
        },
        {
            "question": "¿Cuál es un buen minimal repro?",
            "options": [
                "Todo el CSV de producción",
                "La entrada más pequeña que reproduce el bug",
                "Reiniciar el servidor tres veces",
                "Borrar los tests",
            ],
            "correctIndex": 1,
            "explanation": "Minimal repro acelera fix y test de regresión.",
        },
    ]
    s09_res = {
        "docs": [
            {
                "label": "Errors and Exceptions — Python Tutorial",
                "url": "https://docs.python.org/3/tutorial/errors.html",
                "note": "raise, except, finally, chaining",
            },
            {
                "label": "logging — Logging facility",
                "url": "https://docs.python.org/3/library/logging.html",
                "note": "loggers, handlers, levels",
            },
            {
                "label": "traceback — Print or retrieve a stack",
                "url": "https://docs.python.org/3/library/traceback.html",
                "note": "diagnóstico sin filtrar secretos",
            },
        ],
        "books": [
            {
                "label": "Fluent Python (Ramalho) — excepciones/context managers",
                "note": "Profundidad opcional post-S09.",
            },
            {
                "label": "Python Cookbook — error handling recipes",
                "note": "Patrones de re-raise y cleanup.",
            },
        ],
        "courses": [
            {
                "label": "Real Python — Logging",
                "url": "https://realpython.com/python-logging/",
                "note": "Estructura de logs; adaptar a redacción PII del curso.",
            },
        ],
    }

    print("Building S09…")
    s09_ts, s09_log = build_section(
        "section09",
        s09_meta,
        S09_THEORY,
        S09_DEMOS,
        S09_EX,
        "Ocho demos I Do (uno por subtema). Orden T1→T4. Pipeline de familiaridad con excepciones, logs y cuarentena. Datos sintéticos; local-python.",
        "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara. Sin matplotlib. Datos sintéticos; sin PII real.",
        s09_youdo,
        s09_self,
        s09_res,
    )
    out09 = SECTIONS / "s09-visualization.ts"
    out09.write_text(s09_ts, encoding="utf-8")
    print(f"Wrote {out09} ({len(s09_ts.splitlines())} lines)")

    # ── S10 ──────────────────────────────────────────────────────────────
    s10_meta = {
        "id": "sklearn",
        "index": 10,
        "title": "Módulos, packaging y CLI profesional",
        "shortTitle": "Módulos & CLI",
        "tagline": "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia",
        "estimatedHours": 10,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Package",
        "accentColor": "bg-gradient-to-br from-red-500 to-rose-600",
        "jobRelevance": (
            "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta "
            "usable por el equipo. Esta sección (id `sklearn` conservado) retematiza S10 a **módulos, "
            "packaging y CLI**: cierra empaquetado de **CP-N1-B** y base de **CP-N1-C**. scikit-learn se "
            "difiere al tramo ML."
        ),
        "learningOutcomes": [
            "Organizar imports, evitar ciclos y usar if __name__ == '__main__'",
            "Definir API pública estable y helpers privados",
            "Crear paquete instalable con layout src y pyproject.toml",
            "Aplicar semver simple y requires-python / deps con criterio",
            "Implementar subcomandos argparse con exit codes 0/1/2",
            "Separar stdout (datos) de stderr (diagnóstico)",
            "Implementar precedencia flags > env > archivo > defaults",
            "Mantener secretos fuera del repo y validar config al arranque",
        ],
    }
    s10_youdo = {
        "title": "Paquete familiarity_core + CLI profesional",
        "context": (
            "Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos "
            "ingest|normalize|compare|report, config por precedencia y validación temprana. "
            "Sin secretos en repo. Reemplaza el legado de churn sklearn."
        ),
        "objectives": [
            "Layout src/ + pyproject.toml instalable en editable",
            "Subcomandos ingest, normalize, compare, report",
            "Lógica de dominio separada de I/O CLI",
            "Config por precedencia y validación temprana",
            "Ayuda --help y exit codes documentados",
        ],
        "requirements": [
            "pip install -e . funciona en entorno limpio (documentado)",
            "python -m familiarity_core --help o entry point console_scripts",
            "Sin secretos en repo; datos sintéticos",
            "Errores de uso vs runtime distinguibles por exit code",
            "Lógica importable sin side-effects",
            "README de precedencia de config",
        ],
        "starterCode": S10_YOUDO,
        "portfolioNote": (
            "Incluye captura de --help, tabla de exit codes y ejemplo de pipe "
            "`... | normalize > out.json 2> log.txt` con datos sintéticos."
        ),
        "rubric": [
            ("Alineación al gate V3 de la sección", "25%"),
            ("Correctitud técnica en entorno declarado", "20%"),
            ("Privacidad / sin PII real / sin secretos", "20%"),
            ("Pruebas o casos de borde documentados", "15%"),
            ("Código legible y límites claros", "10%"),
            ("Documentación en español profesional", "10%"),
        ],
    }
    s10_self = [
        {
            "question": "¿Para qué sirve `if __name__ == '__main__'`?",
            "options": [
                "Acelerar el interpreter",
                "Ejecutar el CLI/demo solo al correr el módulo, no al importar",
                "Definir __all__",
                "Instalar dependencias",
            ],
            "correctIndex": 1,
            "explanation": "Evita side-effects al importar el paquete.",
        },
        {
            "question": "Precedencia correcta de config…",
            "options": [
                "defaults > flags > env > file",
                "flags > env > file > defaults",
                "env > flags > file > defaults",
                "file > flags > env > defaults",
            ],
            "correctIndex": 1,
            "explanation": "Flags CLI ganan; defaults son la base.",
        },
        {
            "question": "Exit code 2 en CLI argparse suele significar…",
            "options": [
                "Éxito",
                "Error de uso/parseo de argumentos",
                "Timeout de red",
                "Fraude detectado",
            ],
            "correctIndex": 1,
            "explanation": "Convención: 2 usage; 1 runtime; 0 ok.",
        },
        {
            "question": "¿Dónde van los logs de progreso?",
            "options": ["stdout con el JSON", "stderr", "en el nombre del archivo", "en __all__"],
            "correctIndex": 1,
            "explanation": "stderr deja stdout limpio para pipes.",
        },
        {
            "question": "Añadir un subcomando nuevo compatible es tipicamente…",
            "options": ["major", "minor", "borrar el repo", "patch obligatorio siempre"],
            "correctIndex": 1,
            "explanation": "Feature compatible → minor en semver.",
        },
        {
            "question": "¿Qué no debe ir al git del paquete?",
            "options": [".env con API_TOKEN", "README.md", "pyproject.toml", "src/.../__init__.py"],
            "correctIndex": 0,
            "explanation": "Secretos fuera del repo; usa .env.example sin valores reales.",
        },
    ]
    s10_res = {
        "docs": [
            {
                "label": "Modules — Python Tutorial",
                "url": "https://docs.python.org/3/tutorial/modules.html",
                "note": "imports, packages, __main__",
            },
            {
                "label": "argparse — Parser for command-line options",
                "url": "https://docs.python.org/3/library/argparse.html",
                "note": "subparsers, exit codes",
            },
            {
                "label": "Writing pyproject.toml (packaging)",
                "url": "https://packaging.python.org/en/latest/guides/writing-pyproject-toml/",
                "note": "src layout, project table",
            },
        ],
        "books": [
            {
                "label": "Python Packaging User Guide",
                "note": "Referencia de instalación editable y metadata.",
            },
            {
                "label": "Click vs argparse — elegir con criterio",
                "note": "En el curso usamos argparse stdlib; Click es opcional después.",
            },
        ],
        "courses": [
            {
                "label": "PyPA sample project",
                "url": "https://github.com/pypa/sampleproject",
                "note": "Layout de referencia; adaptar a familiarity_core.",
            },
        ],
    }

    print("Building S10…")
    s10_ts, s10_log = build_section(
        "section10",
        s10_meta,
        S10_THEORY,
        S10_DEMOS,
        S10_EX,
        "Ocho demos I Do (uno por subtema). Orden T1→T4. familiarity_core: módulos, packaging, CLI y config. local-python; datos sintéticos.",
        "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Sin scikit-learn en este incremento V3.",
        s10_youdo,
        s10_self,
        s10_res,
    )
    out10 = SECTIONS / "s10-sklearn.ts"
    out10.write_text(s10_ts, encoding="utf-8")
    print(f"Wrote {out10} ({len(s10_ts.splitlines())} lines)")

    # ── S11 ──────────────────────────────────────────────────────────────
    s11_meta = {
        "id": "testing",
        "index": 11,
        "title": "OOP y modelo de dominio",
        "shortTitle": "OOP dominio",
        "tagline": "ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence sin decidir fraude ni parentesco",
        "estimatedHours": 10,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Boxes",
        "accentColor": "bg-gradient-to-br from-cyan-500 to-blue-600",
        "jobRelevance": (
            "Un modelo de dominio claro es la base de productos de matching/familiaridad sin inventar "
            "veredictos legales. Esta sección (id `testing` conservado) retematiza S11 a **OOP y dominio**: "
            "núcleo de **CP-N1-C**. pytest/CI se reubican como soporte de calidad alrededor del dominio."
        ),
        "learningOutcomes": [
            "Modelar entidades con class/dataclass e instancias válidas",
            "Imponer invariantes en construcción sin side-effects externos",
            "Encapsular con properties y métodos de consulta seguros",
            "Definir igualdad/hash y mutabilidad (frozen) consciente",
            "Preferir composición a herencia frágil",
            "Usar Protocol/duck typing para puertos del dominio",
            "Separar dominio de I/O con repo/service y to_dict",
            "Probar dominio puro y evitar APIs de fraude/parentesco",
        ],
    }
    s11_youdo = {
        "title": "Modelo de dominio Cliente–Transacción–Evidencia",
        "context": (
            "Implementas el núcleo de **CP-N1-C**: ClientRecord, ResolvedEntity, Transaction y "
            "RelationshipEvidence con invariantes, serialización y repo en memoria. "
            "**Ninguna clase decide fraude o parentesco.** Reemplaza el legado de test suite churn."
        ),
        "objectives": [
            "Implementar ClientRecord, ResolvedEntity, Transaction, RelationshipEvidence",
            "Invariantes en construcción y equality consciente",
            "Ningún método is_fraud / is_related_family automático",
            "Serialización + repositorio en memoria",
            "Tests unitarios del dominio con datos sintéticos",
        ],
        "requirements": [
            "Cuatro tipos explícitos con type hints",
            "Scores solo como campos de datos si existen — no veredictos",
            "README de límites del modelo",
            "Tests del dominio puros (sin red/DB)",
            "Datos sintéticos ejemplo.pe / C00x",
            "Service sin side-effects de CLI",
        ],
        "starterCode": S11_YOUDO,
        "portfolioNote": (
            "Diagrama textual de entidades + lista de invariantes + badge mental 'sin is_fraud'. "
            "Muestra 3 tests pasando sobre FakeStore."
        ),
        "rubric": [
            ("Alineación al gate V3 de la sección", "25%"),
            ("Correctitud técnica en entorno declarado", "20%"),
            ("Privacidad / sin PII real / sin secretos", "20%"),
            ("Pruebas o casos de borde documentados", "15%"),
            ("Código legible y límites claros", "10%"),
            ("Documentación en español profesional", "10%"),
        ],
    }
    s11_self = [
        {
            "question": "¿Por qué `field(default_factory=list)` y no `= []`?",
            "options": [
                "Es más corto",
                "Evita el default mutable compartido entre instancias",
                "Obliga a usar Protocol",
                "Activa el garbage collector",
            ],
            "correctIndex": 1,
            "explanation": "Un [] compartido muta todas las instancias.",
        },
        {
            "question": "RelationshipEvidence.signal_score representa…",
            "options": [
                "Veredicto legal de parentesco",
                "Una señal/dato numérico, no un veredicto de fraude o familia",
                "Password hasheado",
                "Exit code del CLI",
            ],
            "correctIndex": 1,
            "explanation": "El dominio almacena evidencia; no decide fraude/parentesco.",
        },
        {
            "question": "Un Protocol EntityStore sirve para…",
            "options": [
                "Conectarse solo a Postgres",
                "Definir un puerto get/save implementable por fakes y adapters",
                "Reemplazar dataclass",
                "Serializar a PDF",
            ],
            "correctIndex": 1,
            "explanation": "Puertos estructurales sin herencia forzada.",
        },
        {
            "question": "Objeto inválido: ¿cuándo fallar?",
            "options": [
                "Al final del mes",
                "En la construcción (__post_init__/validate)",
                "Nunca",
                "Solo en producción",
            ],
            "correctIndex": 1,
            "explanation": "Fail on invalid construct evita estados corruptos.",
        },
        {
            "question": "Client hereda de Person…",
            "options": [
                "Siempre es la mejor opción",
                "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar",
                "Es obligatoria en Python",
                "Impide tests",
            ],
            "correctIndex": 1,
            "explanation": "has-a > is-a forzado sin subtipo real.",
        },
        {
            "question": "¿Qué no debe tener el dominio de familiaridad?",
            "options": [
                "to_dict",
                "is_fraud() automático",
                "Invariantes",
                "Tests unitarios",
            ],
            "correctIndex": 1,
            "explanation": "Sin veredictos de fraude en el modelo del curso.",
        },
    ]
    s11_res = {
        "docs": [
            {
                "label": "dataclasses — Data Classes",
                "url": "https://docs.python.org/3/library/dataclasses.html",
                "note": "frozen, field, post_init",
            },
            {
                "label": "typing.Protocol",
                "url": "https://docs.python.org/3/library/typing.html#typing.Protocol",
                "note": "puertos estructurales",
            },
            {
                "label": "unittest — Unit testing framework",
                "url": "https://docs.python.org/3/library/unittest.html",
                "note": "alternativa stdlib a pytest para dominio puro",
            },
        ],
        "books": [
            {
                "label": "Architecture Patterns with Python (Percival & Gregory)",
                "note": "Repo/service/protocol — leer selectivamente.",
            },
            {
                "label": "Fluent Python — object model",
                "note": "eq/hash y data model.",
            },
        ],
        "courses": [
            {
                "label": "pytest docs (soporte de calidad)",
                "url": "https://docs.pytest.org/",
                "note": "Testing se reubica como soporte; el target V3 de S11 es el dominio.",
            },
        ],
    }

    print("Building S11…")
    s11_ts, s11_log = build_section(
        "section11",
        s11_meta,
        S11_THEORY,
        S11_DEMOS,
        S11_EX,
        "Ocho demos I Do (uno por subtema). Orden T1→T4. Modelo de dominio de familiaridad sin veredictos de fraude/parentesco. local-python.",
        "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Tests del dominio; sin red/DB. Datos sintéticos.",
        s11_youdo,
        s11_self,
        s11_res,
    )
    out11 = SECTIONS / "s11-testing.ts"
    out11.write_text(s11_ts, encoding="utf-8")
    print(f"Wrote {out11} ({len(s11_ts.splitlines())} lines)")

    # ── Progress + lane status ───────────────────────────────────────────
    s09_slugs = [
        ("S09-T1-A", "exception-types-raise-chaining"),
        ("S09-T1-B", "recovery-boundaries-cleanup"),
        ("S09-T2-A", "traceback-debugger"),
        ("S09-T2-B", "minimal-repro-hypothesis-rootcause"),
        ("S09-T3-A", "log-levels-structure"),
        ("S09-T3-B", "correlation-ids-pii-redaction"),
        ("S09-T4-A", "failfast-vs-continue"),
        ("S09-T4-B", "idempotency-retries-quarantine"),
    ]
    s10_slugs = [
        ("S10-T1-A", "imports-namespaces-main"),
        ("S10-T1-B", "public-api-dependencies"),
        ("S10-T2-A", "src-layout-pyproject"),
        ("S10-T2-B", "versioning-compatibility"),
        ("S10-T3-A", "argparse-subcommands-exitcodes"),
        ("S10-T3-B", "stdio-streams-help"),
        ("S10-T4-A", "config-precedence"),
        ("S10-T4-B", "secrets-defaults-early-validation"),
    ]
    s11_slugs = [
        ("S11-T1-A", "classes-instances-dataclass"),
        ("S11-T1-B", "invariants-valid-states"),
        ("S11-T2-A", "properties-methods"),
        ("S11-T2-B", "equality-hash-mutability"),
        ("S11-T3-A", "composition-over-inheritance"),
        ("S11-T3-B", "protocols-purposeful-polymorphism"),
        ("S11-T4-A", "repositories-services-serialization"),
        ("S11-T4-B", "domain-deps-tests"),
    ]

    p09 = progress_payload(
        "S09",
        "visualization",
        "Retarget visualization section TS to V3 exceptions/debugging/logging; author full packages for all 8 subtopics.",
        {
            "id": "visualization",
            "index": 9,
            "title": s09_meta["title"],
            "shortTitle": s09_meta["shortTitle"],
            "tagline": s09_meta["tagline"],
            "estimatedHours": 8,
            "learningOutcomes": 8,
            "youDo": s09_youdo["title"],
            "icon": s09_meta["icon"],
            "gate": "CP-N1-C (inicio)",
            "legacy_note": "matplotlib/seaborn/plotly demoted; target is exceptions/logging pipeline observability",
        },
        s09_slugs,
        s09_log,
        s09_youdo["title"],
        "src/lib/course/sections/s09-visualization.ts",
    )
    p10 = progress_payload(
        "S10",
        "sklearn",
        "Retarget sklearn section TS to V3 modules/packaging/CLI; author full packages for all 8 subtopics.",
        {
            "id": "sklearn",
            "index": 10,
            "title": s10_meta["title"],
            "shortTitle": s10_meta["shortTitle"],
            "tagline": s10_meta["tagline"],
            "estimatedHours": 10,
            "learningOutcomes": 8,
            "youDo": s10_youdo["title"],
            "icon": s10_meta["icon"],
            "gate": "CP-N1-B packaging / CP-N1-C package base",
            "legacy_note": "scikit-learn ML pipeline demoted to L2; target is familiarity_core packaging+CLI",
        },
        s10_slugs,
        s10_log,
        s10_youdo["title"],
        "src/lib/course/sections/s10-sklearn.ts",
    )
    p11 = progress_payload(
        "S11",
        "testing",
        "Retarget testing section TS to V3 OOP domain model; author full packages for all 8 subtopics.",
        {
            "id": "testing",
            "index": 11,
            "title": s11_meta["title"],
            "shortTitle": s11_meta["shortTitle"],
            "tagline": s11_meta["tagline"],
            "estimatedHours": 10,
            "learningOutcomes": 8,
            "youDo": s11_youdo["title"],
            "icon": s11_meta["icon"],
            "gate": "CP-N1-C (modelo de dominio)",
            "legacy_note": "pytest/CI demoted to quality support; target is domain model without fraud/kinship verdicts",
        },
        s11_slugs,
        s11_log,
        s11_youdo["title"],
        "src/lib/course/sections/s11-testing.ts",
    )

    (STATE / "s09_phase4_progress.json").write_text(
        json.dumps(p09, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s10_phase4_progress.json").write_text(
        json.dumps(p10, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s11_phase4_progress.json").write_text(
        json.dumps(p11, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lane = {
        "lane_id": LANE_ID,
        "parent_lane": None,
        "sections": ["S09", "S10", "S11"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S09": {
            "section_id": "visualization",
            "subtopics_done": [s[0] for s in s09_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-C (inicio)",
        },
        "S10": {
            "section_id": "sklearn",
            "subtopics_done": [s[0] for s in s10_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-B packaging / CP-N1-C package base",
        },
        "S11": {
            "section_id": "testing",
            "subtopics_done": [s[0] for s in s11_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-C (modelo de dominio)",
        },
        "exercises_done": 72,
        "exercises_target": 72,
        "demos_done": 24,
        "demos_target": 24,
        "files_changed": [
            "src/lib/course/sections/s09-visualization.ts",
            "src/lib/course/sections/s10-sklearn.ts",
            "src/lib/course/sections/s11-testing.ts",
            "course-state/s09_phase4_progress.json",
            "course-state/s10_phase4_progress.json",
            "course-state/s11_phase4_progress.json",
            f"course-state/lanes/{LANE_ID}.status.json",
            "scripts/_gen_s09_s10_s11_p4.py",
        ],
        "execution_summary": (
            "Retargeted S09 to V3 Excepciones/debugging/logging (CP-N1-C inicio), S10 to V3 "
            "Módulos/packaging/CLI (familiarity_core), S11 to V3 OOP modelo de dominio (sin fraude/parentesco). "
            "Full packages 8 subtopics each (theory+demo+E1/E2/E3, 2 hints). Platform ids visualization / "
            "sklearn / testing preserved. All demos/solutions executed with python3; UNVERIFIED=[]. "
            "Español peruano; synthetic data only."
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
            "PHASE 5 exam banks for visualization, sklearn, testing V3 slugs. "
            "Do not mark S09/S10/S11 passed from this lane."
        ),
    }
    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / f"{LANE_ID}.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print(
        "Verified counts:",
        len(s09_log),
        len(s10_log),
        len(s11_log),
        "UNVERIFIED=[]",
    )


if __name__ == "__main__":
    main()
