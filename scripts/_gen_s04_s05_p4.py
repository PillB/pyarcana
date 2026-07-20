#!/usr/bin/env python3
"""Generate S04 and S05 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S04-S05-P4 Author. Does not touch seed/checkpoint/ledger/s01-s03.
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
    """Execute Python code; return stdout (strip trailing newlines carefully)."""
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
    """Escape for TypeScript template literal (backticks)."""
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def ts_str(s: str) -> str:
    """JSON-style string for TS double-quoted strings."""
    return json.dumps(s, ensure_ascii=False)


@dataclass
class Ex:
    eid: str
    sub: str
    kind: str  # guided | independent | transfer
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
    callout: Optional[tuple[str, str, str]] = None  # type, title, content


def verify_all(demos: list[Demo], exercises: list[Ex]) -> dict[str, str]:
    log: dict[str, str] = {}
    for d in demos:
        d.output = run_py(d.code)
        log[d.did] = "VERIFIED"
    for e in exercises:
        e.output = run_py(e.solution)
        log[e.eid] = "VERIFIED"
    for t in []:  # theory codes verified separately when building
        pass
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


# ═══════════════════════════════════════════════════════════════════════════
# S04 — Iteración y resúmenes transaccionales
# ═══════════════════════════════════════════════════════════════════════════

S04_THEORY: list[Theory] = [
    Theory(
        heading="De “Funciones & Módulos” a iteración y resúmenes (mapa de la sección)",
        paragraphs=[
            "En V3, **S04 no es el path principal de decorators, pathlib packaging ni datetime avanzado**. Esos temas viven en **S10** (módulos/CLI) y otras secciones. Aquí el estudiante domina lo que el **cierre de CP-N1-A** necesita: recorrer **múltiples registros**, acumular contadores, evitar loops infinitos y reportar **tasas con denominadores correctos**.",
            "El hilo conductor es un **script de intake por lotes**: lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro con el motor de reglas de S03, imprime por stdout un resumen y **conserva el original** de cada fila. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo.",
            "Orden pedagógico: **T1 Recorrido** (`for`/`range` → `enumerate`/`zip`) → **T2 Repetición** (`while`/centinelas → `break`/`continue`) → **T3 Patrones** (contadores/acumuladores → comprehensions) → **T4 Razonamiento** (trazado de estado → costo y off-by-one).",
        ],
        callout=(
            "info",
            "Contenido reubicado conceptualmente",
            "Material legado de esta sección (decorators, pathlib packaging, datetime timezone, empaquetado profesional) **no es el camino del estudiante en S04 V3**. Se conserva como referencia histórica en el historial del repo. El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A). Decorators/CLI llegan conceptualmente en S10; OOP de dominio en S11.",
        ),
    ),
    Theory(
        heading="for, range y secuencias",
        sub="S04-T1-A",
        paragraphs=[
            "El bucle **`for x in secuencia:`** recorre cada elemento **una vez**, en orden. No necesitas un índice si solo te importa el valor. Las secuencias típicas de intake son: **listas de registros** (dicts), **líneas de texto** y **`range(n)`** cuando quieres un contador 0..n-1.",
            "**`range(stop)`**, **`range(start, stop)`**, **`range(start, stop, step)`** producen enteros sin materializar una lista gigante. El **stop es exclusivo**: `range(3)` → 0,1,2. Eso evita el off-by-one clásico al numerar N filas.",
            "En lotes de clientes sintéticos, el patrón base es `for registro in filas:` y dentro llamar a `validate_record`. No mutes la lista mientras la recorres salvo que sepas lo que haces; acumula resultados en otra lista.",
        ],
        code=textwrap.dedent(
            """\
            filas = [
                {"id": "C001", "region": "Lima"},
                {"id": "C002", "region": "Cusco"},
                {"id": "C003", "region": "Arequipa"},
            ]
            for reg in filas:
                print(reg["id"], "→", reg["region"])

            print("ids con range:", [filas[i]["id"] for i in range(len(filas))])
            print("range(1, 4):", list(range(1, 4)))
            """
        ).strip(),
        code_title="for_registros.py",
        callout=(
            "tip",
            "Regla de intake",
            "Prefiere `for reg in filas` sobre `for i in range(len(filas))` salvo que necesites el índice. Menos índices = menos off-by-one.",
        ),
    ),
    Theory(
        heading="enumerate y zip sin desalinear",
        sub="S04-T1-B",
        paragraphs=[
            "**`enumerate(seq, start=0)`** te da `(índice, valor)` sin armar el índice a mano. Ideal para reportes “fila 1, fila 2…” (usa `start=1` para humanos) y para localizar el registro que falló en un lote.",
            "**`zip(a, b)`** empareja elementos en paralelo. Se detiene en la **secuencia más corta**. Si `nombres` tiene 3 y `edades` tiene 2, el tercer nombre **desaparece en silencio** — un bug de calidad de datos. En Python 3.10+ existe `zip(..., strict=True)`; en cualquier versión puedes validar `len(a)==len(b)` antes de zipear (helper `zip_strict` en el demo).",
            "Nunca asumas que dos columnas CSV llegaron alineadas solo porque “deberían”. Cuenta longitudes en tests de pipeline.",
        ],
        code=textwrap.dedent(
            """\
            ids = ["C001", "C002", "C003"]
            regiones = ["Lima", "Cusco"]  # ¡falta un valor!

            for i, rid in enumerate(ids, start=1):
                print(f"fila {i}: {rid}")

            print("zip corto (silencioso):", list(zip(ids, regiones)))

            # Equivalente pedagógico a zip(..., strict=True) — Py 3.10+
            def zip_strict(a, b):
                if len(a) != len(b):
                    raise ValueError(f"desalineado: {len(a)} vs {len(b)}")
                return list(zip(a, b))

            try:
                zip_strict(ids, regiones)
            except ValueError as e:
                print("zip strict →", type(e).__name__ + ":", e)
            """
        ).strip(),
        code_title="enumerate_zip.py",
        callout=(
            "warning",
            "Gate de alineación",
            "Desalineación en zip produce resúmenes incorrectos y tasas infladas/deflactadas. Valida len(cols) antes de zip o usa zip(..., strict=True) en Python 3.10+.",
        ),
    ),
    Theory(
        heading="while, centinelas y terminación",
        sub="S04-T2-A",
        paragraphs=[
            "**`while condicion:`** repite mientras la condición sea verdadera. Úsalo cuando **no sabes de antemano cuántas** iteraciones habrá: leer hasta línea vacía, reintentar hasta éxito, o procesar un stream.",
            "Un **centinela** es un valor especial que marca el fin (p. ej. `\"\"`, `None`, `\"END\"`). El bucle debe **actualizar el estado** en cada vuelta; si la condición nunca se vuelve falsa, tienes un **loop infinito**.",
            "En demos de browser no usamos `input()` interactivo real; simulamos un buffer de líneas. El patrón es el mismo: leer siguiente, chequear centinela, procesar.",
        ],
        code=textwrap.dedent(
            """\
            lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]  # "" = centinela
            i = 0
            leidas = []
            while i < len(lineas):
                linea = lineas[i]
                i += 1
                if linea == "":
                    break  # fin de lote
                leidas.append(linea)
            print("procesadas:", leidas)
            print("restante no leída:", lineas[i:])
            """
        ).strip(),
        code_title="while_centinela.py",
        callout=(
            "tip",
            "Terminación",
            "Antes de escribir while, responde: ¿qué variable cambia? ¿cuándo es falsa la condición? Si no puedes contestar, reescribe con for o añade un contador de seguridad.",
        ),
    ),
    Theory(
        heading="break, continue y prevención de loops infinitos",
        sub="S04-T2-B",
        paragraphs=[
            "**`break`** sale del bucle actual de inmediato. **`continue`** salta al **siguiente** ciclo sin ejecutar el resto del cuerpo. En intake: `continue` para saltar filas vacías; `break` al encontrar un centinela o un error fatal de configuración.",
            "Prevención de infinito: (1) actualiza la variable de control, (2) pon un **máximo de iteraciones** en prototipos (`MAX = 10_000`), (3) evita `while True` sin break garantizado, (4) no hagas `i = i` por error tipográfico.",
            "Un `while True` con break en el centinela es legítimo si el break es **obvio y testeado**. Documenta la condición de salida.",
        ],
        code=textwrap.dedent(
            """\
            raw_lines = ["  ", "C001|Lima", "SKIP", "C002|Cusco", "END"]
            MAX = 100
            out = []
            n = 0
            for line in raw_lines:
                n += 1
                if n > MAX:
                    raise RuntimeError("guardrail: demasiadas iteraciones")
                s = line.strip()
                if not s:
                    continue
                if s == "END":
                    break
                if s == "SKIP":
                    continue
                out.append(s)
            print(out)
            print("iteraciones efectivas del for:", n)
            """
        ).strip(),
        code_title="break_continue.py",
        callout=(
            "warning",
            "while True sin salida",
            "En producción un loop infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
        ),
    ),
    Theory(
        heading="Contadores, acumuladores y búsqueda",
        sub="S04-T3-A",
        paragraphs=[
            "Un **contador** suma 1 por evento (`n_reject += 1`). Un **acumulador** suma cantidades (`total_monto += m`). Una **búsqueda** recorre hasta hallar (o no) un elemento y a menudo usa `break` o un flag.",
            "Para **tasas** del gate CP-N1-A: `tasa_error = n_error / n_total` solo si **`n_total > 0`**. El denominador es el número de registros **intentados**, no solo los aceptados. Si no hay filas, reporta `None` o “N/A”, no dividas por cero.",
            "Buscar el primer reject es O(n); contar todos también es O(n). No anides dos bucles sobre el mismo lote “por si acaso” sin necesidad.",
        ],
        code=textwrap.dedent(
            """\
            statuses = ["accept", "reject", "accept", "review", "reject", "accept"]
            n_total = 0
            n_reject = 0
            n_accept = 0
            n_review = 0
            first_reject_idx = None
            for i, st in enumerate(statuses):
                n_total += 1
                if st == "reject":
                    n_reject += 1
                    if first_reject_idx is None:
                        first_reject_idx = i
                elif st == "accept":
                    n_accept += 1
                elif st == "review":
                    n_review += 1
            tasa = n_reject / n_total if n_total else None
            print("total", n_total, "reject", n_reject, "tasa", round(tasa, 4))
            print("first_reject_idx", first_reject_idx)
            """
        ).strip(),
        code_title="contadores_tasa.py",
        callout=(
            "tip",
            "Denominador correcto",
            "Tasa de error = errores / procesados. No uses solo aceptados en el denominador: eso infla la tasa y engaña el dashboard de calidad.",
        ),
    ),
    Theory(
        heading="Comprehensions legibles",
        sub="S04-T3-B",
        paragraphs=[
            "Una **list comprehension** `[expr for x in xs if cond]` construye una lista en una línea. Es idiomática cuando la transformación es **simple**. Si hay validación multi-rama o side effects (prints, I/O), usa un `for` explícito.",
            "También existen **dict** y **set** comprehensions: `{k: v for ...}`, `{x for ...}`. No anides comprehensions de tres niveles “porque cabe”: la legibilidad del revisor manda.",
            "En el resumen de intake, es útil: `rejects = [r for r in results if r['status']=='reject']`. El conteo sigue siendo `len(rejects)` con denominador `len(results)`.",
        ],
        code=textwrap.dedent(
            """\
            results = [
                {"id": "C001", "status": "accept"},
                {"id": "C002", "status": "reject"},
                {"id": "C003", "status": "review"},
                {"id": "C004", "status": "reject"},
            ]
            rejects = [r["id"] for r in results if r["status"] == "reject"]
            codes = {r["status"] for r in results}
            by_id = {r["id"]: r["status"] for r in results}
            print("rejects", rejects)
            print("codes", sorted(codes))
            print("by_id C002", by_id["C002"])
            """
        ).strip(),
        code_title="comprehensions_resumen.py",
        callout=(
            "tip",
            "Cuándo no usar comprehension",
            "Si necesitas contadores múltiples, try/except por fila o mensajes, el for clásico es más claro. Comprehension ≠ siempre mejor.",
        ),
    ),
    Theory(
        heading="Trazado de estado",
        sub="S04-T4-A",
        paragraphs=[
            "**Trazar estado** es escribir (o imaginar) una tabla: iteración | variables | salida. Es la herramienta #1 para depurar off-by-one y contadores mal actualizados.",
            "Antes de pedir ayuda, dibuja 3–5 filas de la traza con valores concretos del lote sintético. Si la traza no cuadra con el print, el bug está en la actualización del estado, no en “Python raro”.",
            "En demos usamos `print` de depuración con prefijo `TRACE`. En producción preferirás logging (S09); aquí el objetivo es razonar el bucle.",
        ],
        code=textwrap.dedent(
            """\
            montos = [10, 0, -5, 20]
            total = 0
            n_pos = 0
            print("i | m | total | n_pos")
            for i, m in enumerate(montos):
                if m > 0:
                    total += m
                    n_pos += 1
                print(f"{i} | {m} | {total} | {n_pos}")
            print("final total=", total, "n_pos=", n_pos)
            """
        ).strip(),
        code_title="traza_estado.py",
        callout=(
            "tip",
            "Traza mínima",
            "Columnas: índice, input de la fila, contadores/acumuladores, decisión. Si no puedes llenar la tabla a mano, el código es demasiado opaco.",
        ),
    ),
    Theory(
        heading="Costo lineal/cuadrático y off-by-one",
        sub="S04-T4-B",
        paragraphs=[
            "Un solo `for` sobre n filas es **O(n)** (lineal). Dos bucles anidados sobre el mismo lote (`for a in xs: for b in xs:`) es **O(n²)** (cuadrático). Con 10 filas no se nota; con 100_000, el script “se cuelga”.",
            "**Off-by-one**: `range(len(xs))` es correcto para índices 0..n-1; `range(1, len(xs))` se salta el primero; `range(len(xs)+1)` explota con IndexError. Fronteras inclusivas/exclusivas en filtros (`>=` vs `>`) también son off-by-one de negocio.",
            "Para el gate: cuenta registros con un contador O(n); no recalcules la tasa dentro de un doble bucle. Debuggea índices imprimiendo `i` y `len`.",
        ],
        code=textwrap.dedent(
            """\
            xs = ["a", "b", "c"]
            # Lineal: 3 pasos
            linear = 0
            for _ in xs:
                linear += 1
            # Cuadrático ingenuo: 9 pares
            quad = 0
            for a in xs:
                for b in xs:
                    quad += 1
            print("linear", linear, "quadratic", quad)

            # Off-by-one: último índice válido
            print("last ok", xs[len(xs) - 1])
            try:
                print(xs[len(xs)])
            except IndexError as e:
                print("IndexError en len(xs):", e)
            """
        ).strip(),
        code_title="costo_off_by_one.py",
        callout=(
            "warning",
            "n² en resúmenes",
            "Si tu resumen de calidad anida dos for sobre todos los registros solo para contar, reescribe a un solo pase. El gate CP-N1-A espera un lote procesable y demos rápidas.",
        ),
    ),
]

S04_DEMOS: list[Demo] = [
    Demo(
        "S04-T1-A-DEMO",
        "S04-T1-A",
        "Recorrer lote de registros sintéticos con for y range",
        textwrap.dedent(
            """\
            lote = [
                {"id": "C001", "edad": 30},
                {"id": "C002", "edad": 17},
                {"id": "C003", "edad": 45},
            ]
            for reg in lote:
                print(reg["id"], "edad=", reg["edad"])
            print("n=", len(lote), "range →", list(range(len(lote))))
            """
        ).strip(),
        "Un for por valor es el esqueleto del procesador por lotes; range(len) solo si necesitas índices.",
        title="S04-T1-A-DEMO — for_lote",
    ),
    Demo(
        "S04-T1-B-DEMO",
        "S04-T1-B",
        "enumerate para reportar fila y zip strict para columnas",
        textwrap.dedent(
            """\
            ids = ["C001", "C002", "C003"]
            regiones = ["Lima", "Cusco", "Arequipa"]

            def zip_strict(a, b):
                if len(a) != len(b):
                    raise ValueError("desalineado")
                return zip(a, b)

            for i, (rid, reg) in enumerate(zip_strict(ids, regiones), start=1):
                print(f"fila {i}: {rid} @ {reg}")
            mal = ["Lima", "Cusco"]
            try:
                list(zip_strict(ids, mal))
            except ValueError:
                print("desalineado detectado")
            """
        ).strip(),
        "enumerate numera para humanos; validar len (o zip strict en 3.10+) evita emparejar mal columnas.",
        title="S04-T1-B-DEMO — enumerate_zip",
    ),
    Demo(
        "S04-T2-A-DEMO",
        "S04-T2-A",
        "while con centinela END sobre buffer de líneas",
        textwrap.dedent(
            """\
            buf = ["Ana|Lima", "Luis|Cusco", "END", "ignorada"]
            i = 0
            out = []
            while i < len(buf):
                line = buf[i]
                i += 1
                if line == "END":
                    break
                out.append(line)
            print(out)
            print("indice final", i)
            """
        ).strip(),
        "El centinela corta el lote; lo posterior no se procesa. i avanza siempre → no hay infinito.",
        title="S04-T2-A-DEMO — while_end",
    ),
    Demo(
        "S04-T2-B-DEMO",
        "S04-T2-B",
        "continue salta vacíos; break corta en ERROR fatal",
        textwrap.dedent(
            """\
            lines = ["", "ok:1", "", "ok:2", "ERROR", "ok:3"]
            kept = []
            for ln in lines:
                if not ln.strip():
                    continue
                if ln.startswith("ERROR"):
                    print("fatal, stop")
                    break
                kept.append(ln)
            print("kept", kept)
            """
        ).strip(),
        "continue limpia ruido; break detiene el lote ante error de configuración.",
        title="S04-T2-B-DEMO — break_continue",
    ),
    Demo(
        "S04-T3-A-DEMO",
        "S04-T3-A",
        "Contadores accept/reject/review y tasa con denominador",
        textwrap.dedent(
            """\
            statuses = ["accept", "reject", "review", "accept", "reject"]
            counts = {"accept": 0, "reject": 0, "review": 0}
            for st in statuses:
                counts[st] = counts.get(st, 0) + 1
            n = len(statuses)
            tasa_err = counts["reject"] / n if n else None
            print(counts)
            print("n", n, "tasa_reject", round(tasa_err, 2))
            """
        ).strip(),
        "Un pase O(n) llena contadores; la tasa usa n total, no solo accepts.",
        title="S04-T3-A-DEMO — contadores",
    ),
    Demo(
        "S04-T3-B-DEMO",
        "S04-T3-B",
        "Comprehensions para filtrar rejects del resumen",
        textwrap.dedent(
            """\
            rows = [
                {"id": "C1", "status": "accept"},
                {"id": "C2", "status": "reject"},
                {"id": "C3", "status": "reject"},
            ]
            reject_ids = [r["id"] for r in rows if r["status"] == "reject"]
            n_rej = len(reject_ids)
            print(reject_ids, "tasa", n_rej / len(rows))
            """
        ).strip(),
        "Filtrar con comprehension es legible; el denominador sigue siendo len(rows).",
        title="S04-T3-B-DEMO — comp_rejects",
    ),
    Demo(
        "S04-T4-A-DEMO",
        "S04-T4-A",
        "Tabla TRACE de contador durante el lote",
        textwrap.dedent(
            """\
            flags = [True, False, True, True]
            n_ok = 0
            print("i flag n_ok")
            for i, f in enumerate(flags):
                if f:
                    n_ok += 1
                print(i, f, n_ok)
            print("FINAL", n_ok)
            """
        ).strip(),
        "La traza hace visible cuándo sube el contador; base del debugging de resúmenes.",
        title="S04-T4-A-DEMO — traza",
    ),
    Demo(
        "S04-T4-B-DEMO",
        "S04-T4-B",
        "Detectar O(n²) ingenuo y off-by-one en range",
        textwrap.dedent(
            """\
            n = 4
            steps_linear = 0
            for i in range(n):
                steps_linear += 1
            steps_quad = 0
            for i in range(n):
                for j in range(n):
                    steps_quad += 1
            print("linear", steps_linear, "quad", steps_quad)
            data = [10, 20, 30]
            # off-by-one: range(1, len) salta index 0
            skipped = [data[i] for i in range(1, len(data))]
            print("skipped_first", skipped)
            """
        ).strip(),
        "4 vs 16 pasos; range(1,len) omite el primer registro — bug clásico de resúmenes incompletos.",
        title="S04-T4-B-DEMO — costo_obo",
    ),
]

S04_EX: list[Ex] = [
    # T1-A
    Ex(
        "S04-T1-A-E1", "S04-T1-A", "guided",
        "E1 (guiado) — Dada `regiones = [\"Lima\", \"Cusco\", \"Piura\"]`, imprime cada región en su propia línea con un `for`. Luego imprime `list(range(3))`.",
        "for r in regiones: print(r)",
        "range(3) produce 0,1,2 — stop exclusivo.",
        'regiones = ["Lima", "Cusco", "Piura"]\n# TODO: for + print cada región\n# TODO: print list(range(3))',
        'regiones = ["Lima", "Cusco", "Piura"]\nfor r in regiones:\n    print(r)\nprint(list(range(3)))',
        edge=["range stop exclusivo"],
        tests="3 regiones + [0,1,2]",
        feedback="El for por valor es el default del procesador de lotes.",
        title="for_regiones.py",
    ),
    Ex(
        "S04-T1-A-E2", "S04-T1-A", "independent",
        "E2 (independiente) — `edades = [30, 17, 45, 22]`. Cuenta cuántas son `>= 18` con un for (no uses comprehension todavía). Imprime el contador.",
        "n = 0; for e in edades: if e >= 18: n += 1",
        "Resultado esperado: 3 (30,45,22).",
        "edades = [30, 17, 45, 22]\nn = 0\n# TODO\nprint(n)",
        "edades = [30, 17, 45, 22]\nn = 0\nfor e in edades:\n    if e >= 18:\n        n += 1\nprint(n)",
        edge=["frontera 18 inclusiva"],
        tests="assert n == 3",
        feedback="Contador manual prepara el resumen de tasas del gate.",
        title="contar_mayores.py",
    ),
    Ex(
        "S04-T1-A-E3", "S04-T1-A", "transfer",
        "E3 (transferencia) — Simula un mini-lote: lista de dicts con `id` y `monto`. Imprime solo los `id` cuyo monto sea `> 0` usando for. No mutes la lista original.",
        "for reg in lote: if reg['monto'] > 0: print(reg['id'])",
        "0 no se imprime; negativos tampoco. Conserva lote intacto.",
        'lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]\n# TODO',
        'lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]\nfor reg in lote:\n    if reg["monto"] > 0:\n        print(reg["id"])\nprint("n_original", len(lote))',
        edge=["monto 0 excluido", "lista no mutada"],
        tests="C1 y C4; len 4",
        feedback="Filtrar al reportar sin destruir el raw es hábito de auditoría.",
        title="filtrar_montos.py",
    ),
    # T1-B
    Ex(
        "S04-T1-B-E1", "S04-T1-B", "guided",
        "E1 (guiado) — Con `ids = [\"A\", \"B\", \"C\"]`, usa `enumerate(..., start=1)` e imprime `fila k: id`.",
        "for i, x in enumerate(ids, start=1): print(f'fila {i}: {x}')",
        "start=1 es para humanos; el índice interno de la lista sigue siendo 0-based.",
        'ids = ["A", "B", "C"]\n# TODO enumerate start=1',
        'ids = ["A", "B", "C"]\nfor i, x in enumerate(ids, start=1):\n    print(f"fila {i}: {x}")',
        edge=["start=1"],
        tests="fila 1..3",
        feedback="Numerar filas acelera el diagnóstico de rejects en demos.",
        title="enumerate_filas.py",
    ),
    Ex(
        "S04-T1-B-E2", "S04-T1-B", "independent",
        "E2 (independiente) — `nombres` y `edades` de igual longitud. Emparéjalos con `zip` e imprime `nombre=edad`. Luego muestra qué pasa con zip silencioso si acortas edades a 1 elemento (imprime list(zip(...))).",
        "zip se detiene en la más corta; el resto se pierde.",
        "Compara len antes en código real; aquí solo observa el silencio.",
        'nombres = ["Ana", "Luis", "María"]\nedades = [30, 25, 40]\n# TODO zip print\n# TODO zip con edades[:1]',
        'nombres = ["Ana", "Luis", "María"]\nedades = [30, 25, 40]\nfor n, e in zip(nombres, edades):\n    print(f"{n}={e}")\nprint("zip corto", list(zip(nombres, edades[:1])))',
        edge=["truncamiento silencioso"],
        tests="3 pares + 1 par en zip corto",
        feedback="Ver el truncamiento una vez evita bugs de columnas desalinedas.",
        title="zip_columnas.py",
    ),
    Ex(
        "S04-T1-B-E3", "S04-T1-B", "transfer",
        "E3 (transferencia) — Implementa `zip_strict(a,b)` que lance ValueError si `len(a)!=len(b)` (equivalente pedagógico a `zip(..., strict=True)` en Py 3.10+). Prueba desalineado → `DESALINEADO` y alineado → `OK`.",
        "if len(a) != len(b): raise ValueError(...); return list(zip(a,b))",
        "Dos bloques try/except con prints distintos.",
        "def zip_strict(a, b):\n    # TODO\n    ...\ntry:\n    zip_strict([1, 2, 3], [10, 20])\nexcept ValueError:\n    print(\"DESALINEADO\")\ntry:\n    zip_strict([1, 2], [3, 4])\n    print(\"OK\")\nexcept ValueError:\n    print(\"DESALINEADO\")",
        "def zip_strict(a, b):\n    if len(a) != len(b):\n        raise ValueError(\"desalineado\")\n    return list(zip(a, b))\ntry:\n    zip_strict([1, 2, 3], [10, 20])\nexcept ValueError:\n    print(\"DESALINEADO\")\ntry:\n    zip_strict([1, 2], [3, 4])\n    print(\"OK\")\nexcept ValueError:\n    print(\"DESALINEADO\")",
        edge=["strict alignment"],
        tests="DESALINEADO luego OK",
        feedback="Validar longitudes es un assert de alineación barato en tests de pipeline.",
        title="zip_strict.py",
    ),
    # T2-A
    Ex(
        "S04-T2-A-E1", "S04-T2-A", "guided",
        "E1 (guiado) — Buffer `lines = [\"r1\", \"r2\", \"\", \"r3\"]`. Con while e índice, acumula hasta el string vacío (sin incluirlo). Imprime la lista.",
        "while i < len: leer, i+=1, if line=='': break else append",
        "Resultado: ['r1','r2']; r3 queda fuera del lote.",
        'lines = ["r1", "r2", "", "r3"]\ni = 0\nout = []\n# TODO while\nprint(out)',
        'lines = ["r1", "r2", "", "r3"]\ni = 0\nout = []\nwhile i < len(lines):\n    line = lines[i]\n    i += 1\n    if line == "":\n        break\n    out.append(line)\nprint(out)',
        edge=["centinela vacío"],
        tests="['r1','r2']",
        feedback="El centinela define el fin de lote aunque haya basura después.",
        title="while_vacio.py",
    ),
    Ex(
        "S04-T2-A-E2", "S04-T2-A", "independent",
        "E2 (independiente) — Simula reintentos: `intentos = 0`, `MAX = 3`, `while intentos < MAX`, incrementa e imprime `intento k`. Al salir imprime `done` y el valor final de intentos.",
        "intentos += 1 dentro del while es la variable de control.",
        "Si olvidas incrementar, loop infinito (no lo hagas).",
        "intentos = 0\nMAX = 3\n# TODO\nprint(\"done\", intentos)",
        "intentos = 0\nMAX = 3\nwhile intentos < MAX:\n    intentos += 1\n    print(f\"intento {intentos}\")\nprint(\"done\", intentos)",
        edge=["variable de control"],
        tests="3 intentos + done 3",
        feedback="while con cota superior es el patrón de reintentos seguros.",
        title="while_reintentos.py",
    ),
    Ex(
        "S04-T2-A-E3", "S04-T2-A", "transfer",
        "E3 (transferencia) — Cola simulada: `cola = [\"job1\", \"job2\", \"job3\"]`. Mientras la cola no esté vacía, saca el primero con `pop(0)`, imprímelo, y si el job es `job2` imprime `PAUSE` y break. Muestra la cola restante.",
        "while cola: job = cola.pop(0)",
        "Tras break debe quedar ['job3'].",
        'cola = ["job1", "job2", "job3"]\n# TODO\nprint("rest", cola)',
        'cola = ["job1", "job2", "job3"]\nwhile cola:\n    job = cola.pop(0)\n    print(job)\n    if job == "job2":\n        print("PAUSE")\n        break\nprint("rest", cola)',
        edge=["break deja resto"],
        tests="job1 job2 PAUSE rest [job3]",
        feedback="while + cola modela procesamiento hasta condición de negocio.",
        title="while_cola.py",
    ),
    # T2-B
    Ex(
        "S04-T2-B-E1", "S04-T2-B", "guided",
        "E1 (guiado) — `raw = [\"  \", \"Lima\", \"\", \"Cusco\"]`. Con for, usa continue si `not x.strip()`; imprime las regiones válidas.",
        "if not x.strip(): continue",
        "Solo Lima y Cusco.",
        'raw = ["  ", "Lima", "", "Cusco"]\nfor x in raw:\n    # TODO\n    print(x)',
        'raw = ["  ", "Lima", "", "Cusco"]\nfor x in raw:\n    if not x.strip():\n        continue\n    print(x)',
        edge=["whitespace only"],
        tests="Lima\\nCusco",
        feedback="continue es el filtro de filas vacías del intake por líneas.",
        title="continue_vacios.py",
    ),
    Ex(
        "S04-T2-B-E2", "S04-T2-B", "independent",
        "E2 (independiente) — `codes = [200, 200, 500, 200]`. Recorre; si code >= 500 imprime `STOP` y break; si no, imprime `ok`. Cuenta cuántos ok imprimiste.",
        "break no procesa el 200 final.",
        "n_ok debe ser 2.",
        "codes = [200, 200, 500, 200]\nn_ok = 0\n# TODO\nprint(\"n_ok\", n_ok)",
        "codes = [200, 200, 500, 200]\nn_ok = 0\nfor c in codes:\n    if c >= 500:\n        print(\"STOP\")\n        break\n    print(\"ok\")\n    n_ok += 1\nprint(\"n_ok\", n_ok)",
        edge=["break corta el lote"],
        tests="ok ok STOP n_ok 2",
        feedback="Errores fatales deben cortar el lote, no solo contarse.",
        title="break_fatal.py",
    ),
    Ex(
        "S04-T2-B-E3", "S04-T2-B", "transfer",
        "E3 (transferencia) — Escribe un `while True` que lea de `buf = [\"a\", \"b\", \"END\"]` con índice, break en END, y un guardrail `if i > 10: raise RuntimeError('guard')`. Imprime los valores leídos.",
        "while True no es pecado si break y guardrail están claros.",
        "No proceses END como dato.",
        'buf = ["a", "b", "END"]\ni = 0\nout = []\n# TODO while True\nprint(out)',
        'buf = ["a", "b", "END"]\ni = 0\nout = []\nwhile True:\n    if i > 10:\n        raise RuntimeError("guard")\n    item = buf[i]\n    i += 1\n    if item == "END":\n        break\n    out.append(item)\nprint(out)',
        edge=["while True + break + max"],
        tests="['a','b']",
        feedback="while True documentado + centinela + MAX es aceptable y testeable.",
        title="while_true_guard.py",
    ),
    # T3-A
    Ex(
        "S04-T3-A-E1", "S04-T3-A", "guided",
        "E1 (guiado) — `sts = [\"accept\", \"reject\", \"accept\"]`. Inicializa contadores y en un for incrementa. Imprime n_accept, n_reject, n_total.",
        "n_total = len o +=1 por fila",
        "2 accept, 1 reject, total 3",
        'sts = ["accept", "reject", "accept"]\nn_accept = n_reject = n_total = 0\n# TODO\nprint(n_accept, n_reject, n_total)',
        'sts = ["accept", "reject", "accept"]\nn_accept = n_reject = n_total = 0\nfor s in sts:\n    n_total += 1\n    if s == "accept":\n        n_accept += 1\n    elif s == "reject":\n        n_reject += 1\nprint(n_accept, n_reject, n_total)',
        edge=["un pase"],
        tests="2 1 3",
        feedback="Contadores en un pase son la base del resumen CP-N1-A.",
        title="contadores_base.py",
    ),
    Ex(
        "S04-T3-A-E2", "S04-T3-A", "independent",
        "E2 (independiente) — Calcula `tasa_reject = n_reject / n_total` para sts del E1. Luego calcula tasa para lista vacía sin ZeroDivisionError (imprime None).",
        "if n_total: tasa = n_rej/n_total else None",
        "Primera tasa ~0.333…; segunda None.",
        'def tasa_reject(sts):\n    # TODO\n    ...\nprint(tasa_reject(["accept", "reject", "accept"]))\nprint(tasa_reject([]))',
        'def tasa_reject(sts):\n    n_total = len(sts)\n    if n_total == 0:\n        return None\n    n_reject = sum(1 for s in sts if s == "reject")\n    return n_reject / n_total\nprint(round(tasa_reject(["accept", "reject", "accept"]), 4))\nprint(tasa_reject([]))',
        edge=["división por cero"],
        tests="0.3333 y None",
        feedback="Denominador cero se reporta, no se crashea.",
        title="tasa_segura.py",
    ),
    Ex(
        "S04-T3-A-E3", "S04-T3-A", "transfer",
        "E3 (transferencia) — Busca el índice del primer `status==\"review\"` en una lista de dicts. Si no hay, imprime -1. Si hay, imprime el índice y el id.",
        "first = None; for i,r in enumerate(...): if ...: first=i; break",
        "No uses index() si quieres practicar la búsqueda manual.",
        'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]\n# TODO',
        'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]\nidx = -1\nfor i, r in enumerate(rows):\n    if r["status"] == "review":\n        idx = i\n        break\nif idx == -1:\n    print(-1)\nelse:\n    print(idx, rows[idx]["id"])',
        edge=["primer match", "break"],
        tests="1 C2",
        feedback="Búsqueda lineal con break evita trabajo innecesario.",
        title="buscar_review.py",
    ),
    # T3-B
    Ex(
        "S04-T3-B-E1", "S04-T3-B", "guided",
        "E1 (guiado) — `nums = [1,2,3,4,5]`. Crea con comprehension la lista de cuadrados y la de pares. Imprímelas.",
        "[x*x for x in nums] y [x for x in nums if x%2==0]",
        "Pares: 2,4",
        "nums = [1, 2, 3, 4, 5]\n# TODO",
        "nums = [1, 2, 3, 4, 5]\nprint([x * x for x in nums])\nprint([x for x in nums if x % 2 == 0])",
        edge=["filtro if"],
        tests="cuadrados y pares",
        feedback="Comprehension corta para map/filter simple.",
        title="comp_basica.py",
    ),
    Ex(
        "S04-T3-B-E2", "S04-T3-B", "independent",
        "E2 (independiente) — De `rows` con status, obtén set de statuses distintos ordenados alfabéticamente para el reporte.",
        "sorted({r['status'] for r in rows})",
        "accept, reject, review",
        'rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]\n# TODO print sorted set',
        'rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]\nprint(sorted({r["status"] for r in rows}))',
        edge=["set comprehension"],
        tests="['accept','reject','review']",
        feedback="Set comprehension resume categorías presentes en el lote.",
        title="comp_set_status.py",
    ),
    Ex(
        "S04-T3-B-E3", "S04-T3-B", "transfer",
        "E3 (transferencia) — Construye dict `id -> status` por comprehension y calcula tasa de reject como len de rejects / len rows usando otra comprehension para rejects.",
        "by = {r['id']: r['status'] for r in rows}",
        "tasa 0.5 con 2 reject de 4",
        'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}, {"id": "C3", "status": "accept"}, {"id": "C4", "status": "reject"}]\n# TODO',
        'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}, {"id": "C3", "status": "accept"}, {"id": "C4", "status": "reject"}]\nby = {r["id"]: r["status"] for r in rows}\nrejects = [i for i, st in by.items() if st == "reject"]\ntasa = len(rejects) / len(rows)\nprint(by["C2"], rejects, tasa)',
        edge=["dict comp + tasa"],
        tests="reject [C2,C4] 0.5",
        feedback="Comprehensions + denominador len(rows) cierran el patrón de resumen.",
        title="comp_resumen.py",
    ),
    # T4-A
    Ex(
        "S04-T4-A-E1", "S04-T4-A", "guided",
        "E1 (guiado) — Traza: `vals = [2, -1, 3]`, acumulador `s=0`. En cada paso imprime `i, val, s` después de sumar solo positivos.",
        "if val > 0: s += val; luego print",
        "Final s=5",
        "vals = [2, -1, 3]\ns = 0\n# TODO traza\nprint(\"final\", s)",
        "vals = [2, -1, 3]\ns = 0\nfor i, val in enumerate(vals):\n    if val > 0:\n        s += val\n    print(i, val, s)\nprint(\"final\", s)",
        edge=["no sumar negativos"],
        tests="traza + final 5",
        feedback="La traza confirma que -1 no movió el acumulador.",
        title="traza_acum.py",
    ),
    Ex(
        "S04-T4-A-E2", "S04-T4-A", "independent",
        "E2 (independiente) — Hay un bug: el contador `n` se incrementa dos veces por fila. Traza e identifica; imprime n corregido para 3 filas (debe ser 3).",
        "Busca n += 1 duplicado",
        "Deja un solo incremento.",
        "filas = [\"a\", \"b\", \"c\"]\nn = 0\nfor f in filas:\n    n += 1\n    n += 1  # BUG?\nprint(n)  # debería ser 3",
        "filas = [\"a\", \"b\", \"c\"]\nn = 0\nfor f in filas:\n    n += 1\nprint(n)",
        edge=["doble incremento"],
        tests="3",
        feedback="Traza mental: si n sube 2 por fila, el resumen miente el doble.",
        title="fix_doble_count.py",
    ),
    Ex(
        "S04-T4-A-E3", "S04-T4-A", "transfer",
        "E3 (transferencia) — Simula tres registros y un dict de contadores. Imprime una línea TRACE por registro con el estado completo del dict (copy o str).",
        "counts = dict; al final de cada iter print TRACE",
        "Debe verse el crecimiento paso a paso.",
        'regs = ["accept", "reject", "accept"]\ncounts = {"accept": 0, "reject": 0}\n# TODO',
        'regs = ["accept", "reject", "accept"]\ncounts = {"accept": 0, "reject": 0}\nfor i, st in enumerate(regs):\n    counts[st] = counts.get(st, 0) + 1\n    print("TRACE", i, st, dict(counts))\nprint("FINAL", counts)',
        edge=["estado completo por paso"],
        tests="3 TRACE + FINAL",
        feedback="Trazar el dict entero evita bugs de clave mal escrita.",
        title="traza_dict.py",
    ),
    # T4-B
    Ex(
        "S04-T4-B-E1", "S04-T4-B", "guided",
        "E1 (guiado) — Para n=5, cuenta pasos de un for simple y de un doble for anidado. Imprime ambos números.",
        "linear n, quad n*n",
        "5 y 25",
        "n = 5\nlin = quad = 0\n# TODO\nprint(lin, quad)",
        "n = 5\nlin = quad = 0\nfor i in range(n):\n    lin += 1\nfor i in range(n):\n    for j in range(n):\n        quad += 1\nprint(lin, quad)",
        edge=["n vs n²"],
        tests="5 25",
        feedback="Sentir n² con números chicos prepara el ojo para lotes grandes.",
        title="count_steps.py",
    ),
    Ex(
        "S04-T4-B-E2", "S04-T4-B", "independent",
        "E2 (independiente) — `data = [\"r0\", \"r1\", \"r2\"]`. El código usa `for i in range(1, len(data)+1)` y hace IndexError. Arréglalo para recorrer todos los índices válidos e imprimir cada elemento.",
        "range(len(data)) → 0..n-1",
        "No uses range(1, len+1).",
        'data = ["r0", "r1", "r2"]\nfor i in range(1, len(data) + 1):  # BUG\n    print(data[i])',
        'data = ["r0", "r1", "r2"]\nfor i in range(len(data)):\n    print(data[i])',
        edge=["IndexError off-by-one"],
        tests="r0 r1 r2",
        feedback="stop exclusivo de range es la fuente #1 de IndexError en lotes.",
        title="fix_range_obo.py",
    ),
    Ex(
        "S04-T4-B-E3", "S04-T4-B", "transfer",
        "E3 (transferencia) — Reescribe un conteo de pares reject-reject O(n²) ingenuo a un conteo O(n) de rejects (no necesitas pares). Imprime n_reject y comenta en un print por qué O(n) basta para la tasa.",
        "No necesitas combinar pares para la tasa de error.",
        "tasa = n_reject/n",
        'sts = ["reject", "accept", "reject", "reject", "accept"]\n# versión ingenua (no la uses en la solución final):\n# pairs = 0\n# for i in range(len(sts)):\n#     for j in range(i+1, len(sts)):\n#         if sts[i]=="reject" and sts[j]=="reject": pairs += 1\n# TODO O(n)\n',
        'sts = ["reject", "accept", "reject", "reject", "accept"]\nn = len(sts)\nn_reject = sum(1 for s in sts if s == "reject")\nprint(n_reject, round(n_reject / n, 2))\nprint("nota: la tasa solo necesita conteo O(n), no pares O(n2)")',
        edge=["evitar n² innecesario"],
        tests="3 0.6 + nota",
        feedback="Elegir el algoritmo correcto es parte del gate de calidad.",
        title="rewrite_on.py",
    ),
]

S04_YOUDO_STARTER = '''\
"""intake_quality_batch.py — cierre CP-N1-A (S04)
Procesa múltiples registros sintéticos, resume tasas, conserva raw.
Datos ficticios únicamente. No uses PII real.
"""

from __future__ import annotations

from typing import Any


def validate_record(record: dict[str, Any]) -> dict[str, Any]:
    """Reutiliza lógica tipo S03: status global + detalle por campo.
    Mínimo: edad, region, monto_ingreso con accept|reject|review.
    """
    # TODO
    raise NotImplementedError


def process_batch(records: list[dict[str, Any]]) -> dict[str, Any]:
    """Recorre el lote UNA vez (O(n)).
    Devuelve {
      "n_total", "n_accept", "n_reject", "n_review",
      "tasa_reject",  # None si n_total==0
      "results": [ {"raw": ..., "status": ..., "fields": ...}, ... ]
    }
    Conserva cada raw intacto.
    """
    # TODO
    raise NotImplementedError


def format_report(summary: dict[str, Any]) -> str:
    """Texto stdout legible con contadores y tasa."""
    # TODO
    raise NotImplementedError


def _run_tests() -> None:
    batch = [
        {"edad": 30, "region": "Lima", "monto_ingreso": 0, "raw_line": "30|Lima|0"},
        {"edad": None, "region": "Lima", "monto_ingreso": 10, "raw_line": "|Lima|10"},
        {"edad": 15, "region": "Tacna", "monto_ingreso": -1, "raw_line": "15|Tacna|-1"},
    ]
    s = process_batch(batch)
    assert s["n_total"] == 3
    assert s["results"][0]["raw"]["raw_line"] == "30|Lima|0"
    assert s["tasa_reject"] is None or 0 <= s["tasa_reject"] <= 1
    empty = process_batch([])
    assert empty["tasa_reject"] is None
    print("tests OK")


def main() -> None:
    demo = [
        {"edad": 40, "region": "Cusco", "monto_ingreso": 100, "raw_line": "40|Cusco|100"},
        {"edad": -3, "region": "Lima", "monto_ingreso": 50, "raw_line": "-3|Lima|50"},
    ]
    summary = process_batch(demo)
    print(format_report(summary))
    _run_tests()


if __name__ == "__main__":
    main()
'''

# ═══════════════════════════════════════════════════════════════════════════
# S05 — Funciones, contratos y descomposición
# ═══════════════════════════════════════════════════════════════════════════

S05_THEORY: list[Theory] = [
    Theory(
        heading="De “OOP” a funciones y contratos (mapa de la sección)",
        paragraphs=[
            "En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**. Eso vive en **S11** (OOP y modelo de dominio). Aquí el estudiante domina **funciones con contratos claros**: definición, parámetros seguros, docstrings, type hints graduales, pureza y un poco de LEGB — todo al servicio de **normalizadores** del inicio de **CP-N1-B**.",
            "El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético sin tocar disco ni red. La I/O se inyecta o se deja fuera. Datos ficticios únicamente.",
            "Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor).",
        ],
        callout=(
            "info",
            "Contenido reubicado conceptualmente a S11 / S10",
            "Material legado de OOP (clases Perro, herencia, ABC, dunders) **no es el camino del estudiante en S05 V3**. El target es **normalizadores puros** con idempotencia demostrada. Packaging/CLI → S10; modelo de dominio OOP → S11.",
        ),
    ),
    Theory(
        heading="Definición, llamada y retorno",
        sub="S05-T1-A",
        paragraphs=[
            "Una función se define con **`def nombre(params):`** y devuelve con **`return`**. Sin `return` explícito, Python devuelve **`None`**. Llamar es `nombre(args)`. El nombre debe ser un **verbo** o acción clara: `normalize_email`, no `email2`.",
            "Las funciones son valores: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización.",
            "Un solo `return` temprano por caso de error de dominio es legible; evita funciones de 100 líneas con muchos returns confusos — mejor descomponer (T3).",
        ],
        code=textwrap.dedent(
            """\
            def normalize_nombre(raw: str) -> str:
                return " ".join(raw.strip().split())

            print(normalize_nombre("  María   José  "))
            print(normalize_nombre("QUISPE"))
            # sin return → None
            def noop(x):
                x + 1
            print(noop(1))
            """
        ).strip(),
        code_title="def_return.py",
        callout=(
            "tip",
            "return vs print",
            "Los normalizadores **retornan** el valor; el print es de demo. En pipelines, print dentro de la función pura es un efecto colateral indeseado.",
        ),
    ),
    Theory(
        heading="Posicionales, keyword y defaults seguros",
        sub="S05-T1-B",
        paragraphs=[
            "Argumentos **posicionales** se atan por orden; **keyword** por nombre (`fn(x=1)`). Los **defaults** se evalúan **una vez** en la definición: **nunca uses lista/dict mutable como default** (`def f(xs=[])` es un bug clásico). Usa `None` y crea la lista dentro.",
            "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sites de llamada largos.",
            "Para normalizadores: `def normalize_telefono(raw, *, country=\"PE\")` con keyword-only opcional documenta la política regional sin confundir posiciones.",
        ],
        code=textwrap.dedent(
            """\
            def etiqueta(nombre, prefijo="Sr./Sra.", *, upper=False):
                s = f"{prefijo} {nombre}"
                return s.upper() if upper else s

            print(etiqueta("Quispe"))
            print(etiqueta("Quispe", prefijo="Cliente"))
            print(etiqueta("Quispe", upper=True))

            # Default mutable — MAL (demostración del bug)
            def bad_add(item, bucket=[]):
                bucket.append(item)
                return bucket
            print(bad_add(1), bad_add(2))  # ¡comparte la misma lista!

            def good_add(item, bucket=None):
                if bucket is None:
                    bucket = []
                bucket.append(item)
                return bucket
            print(good_add(1), good_add(2))
            """
        ).strip(),
        code_title="params_defaults.py",
        callout=(
            "danger",
            "Default mutable",
            "Si ves `def f(x, acc=[])` en un PR de normalización, es P1. Usa None + creación local.",
        ),
    ),
    Theory(
        heading="Pre/postcondiciones y docstrings",
        sub="S05-T2-A",
        paragraphs=[
            "Una **precondición** es lo que debe cumplirse **antes** de llamar (p. ej. `raw` es str). Una **postcondición** es lo que garantiza el return (p. ej. sin espacios extremos, minúsculas en email local-domain policy).",
            "El **docstring** (PEP 257) documenta contrato en español o inglés consistente del proyecto: qué hace, parámetros, retorno, errores. No copies la firma; explica la política de negocio.",
            "En intake sintético: pre = tipo str o None; post = forma canónica o ValueError/resultado de error de dominio según el diseño elegido.",
        ],
        code=textwrap.dedent(
            """\
            def normalize_email(raw: str) -> str:
                \"\"\"Normaliza email sintético de intake.

                Pre: raw es str no vacío tras strip.
                Post: devuelve lowercased sin espacios extremos.
                Raises: ValueError si falta '@' o queda vacío.
                \"\"\"
                s = raw.strip().lower()
                if not s or "@" not in s:
                    raise ValueError("email inválido para normalizar")
                return s

            print(normalize_email("  Ana.Perez@Example.COM "))
            try:
                normalize_email("sin-arroba")
            except ValueError as e:
                print("err:", e)
            """
        ).strip(),
        code_title="docstring_email.py",
        callout=(
            "tip",
            "Contrato legible",
            "Si el docstring y el código discrepan, gana el código — pero el revisor te devuelve el PR. Manténlos alineados.",
        ),
    ),
    Theory(
        heading="Type hints graduales y errores de dominio",
        sub="S05-T2-B",
        paragraphs=[
            "Los **type hints** (`def f(x: str) -> str`) no convierten en runtime (salvo herramientas externas). Son documentación verificable con checkers. En S05 usamos hints **graduales**: anota lo público; no atasques con genéricos avanzados.",
            "Un **error de dominio** no es un bug de Python: es un valor de negocio inválido. Opciones: `raise ValueError`, devolver `(ok, value, error)`, o un dict de resultado. Sé consistente en el módulo.",
            "`Optional[str]` / `str | None` documenta ausencia. No uses hints falsos (`-> str` si puedes devolver None).",
        ],
        code=textwrap.dedent(
            """\
            from typing import Optional, Tuple

            def parse_edad(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
                try:
                    n = int(raw.strip())
                except ValueError:
                    return False, None, "no es entero"
                if n < 0 or n > 120:
                    return False, None, "fuera de rango de dominio"
                return True, n, None

            for v in ["34", "abc", "200"]:
                print(v, "→", parse_edad(v))
            """
        ).strip(),
        code_title="hints_dominio.py",
        callout=(
            "tip",
            "ValueError vs return",
            "raise para APIs internas puras; tupla/result object cuando el lote no debe abortar en la primera fila mala.",
        ),
    ),
    Theory(
        heading="Funciones pequeñas y composición",
        sub="S05-T3-A",
        paragraphs=[
            "Una función debe hacer **una cosa** en el nivel de abstracción correcto. Si normalizas nombre y además escribes archivo y logueas, sepáralas. **Componer** es llamar funciones pequeñas desde una orquestadora delgada.",
            "Beneficio: tests unitarios fáciles, reuso en CLI (S10) y en ETL (S08). El orquestador `normalize_record` llama a cuatro normalizadores y arma el dict.",
            "Regla práctica: si necesitas un comentario de sección en medio de la función, probablemente es otra función.",
        ],
        code=textwrap.dedent(
            """\
            def strip_collapse(s: str) -> str:
                return " ".join(s.strip().split())

            def title_case_name(s: str) -> str:
                return strip_collapse(s).title()

            def normalize_nombre(raw: str) -> str:
                return title_case_name(raw)

            def normalize_record(nombres: str, email: str) -> dict:
                return {
                    "nombres": normalize_nombre(nombres),
                    "email": email.strip().lower(),
                }

            print(normalize_record("  maría  josé ", "  X@Y.COM "))
            """
        ).strip(),
        code_title="composicion.py",
        callout=(
            "tip",
            "Orquestador delgado",
            "normalize_record no reimplementa strip: delega. Así un fix en strip_collapse beneficia a todos.",
        ),
    ),
    Theory(
        heading="Pureza, efectos e inyección de I/O",
        sub="S05-T3-B",
        paragraphs=[
            "Una función **pura** devuelve el mismo resultado para los mismos argumentos y **no tiene efectos** (no imprime, no lee disco, no muta globales ni los argumentos mutables del caller sin documentarlo).",
            "La **I/O** (stdin, archivos, red) se queda en el borde: `main`, CLI, o funciones `load_*` / `save_*`. Los normalizadores del gate deben ser puros e **idempotentes**: `f(f(x)) == f(x)` para entradas válidas.",
            "**Inyección**: pasar una función `reader` o un path como argumento en vez de hardcodear `open('data.csv')` dentro del core facilita tests con fakes.",
        ],
        code=textwrap.dedent(
            """\
            def normalize_telefono(raw: str) -> str:
                digits = "".join(ch for ch in raw if ch.isdigit())
                return digits

            # Idempotencia
            x = "999-000-111"
            y = normalize_telefono(x)
            z = normalize_telefono(y)
            print(y, z, "idempotent=", y == z)

            # I/O al borde (simulado)
            def process_line(line: str, norm=normalize_telefono) -> str:
                return norm(line)

            print(process_line(" (01) 234-5678 "))
            """
        ).strip(),
        code_title="pureza_idem.py",
        callout=(
            "warning",
            "Gate CP-N1-B inicio",
            "Si tu normalize_email abre un archivo o imprime, no es puro. Sepáralo antes del review del incremento.",
        ),
    ),
    Theory(
        heading="LEGB y closures básicos",
        sub="S05-T4-A",
        paragraphs=[
            "**LEGB**: orden de búsqueda de nombres — **L**ocal, **E**nclosing (funciones anidadas), **G**lobal, **B**uiltin. Si Python no halla el nombre, `NameError`.",
            "Un **closure** es una función interna que recuerda variables del enclosing scope. Útil para fabricar normalizadores configurados (`make_stripper(chars)`), sin clases todavía.",
            "`global` y `nonlocal` existen pero en S05 casi no los necesitas: prefiere **return** de valores nuevos. Mutar globales complica tests.",
        ],
        code=textwrap.dedent(
            """\
            PREF = "+51"  # global del módulo (demo)

            def make_phone_normalizer(prefix: str):
                def norm(raw: str) -> str:
                    d = "".join(c for c in raw if c.isdigit())
                    if d.startswith("51") and len(d) > 9:
                        d = d[2:]
                    return prefix + d if not d.startswith("+") else d
                return norm

            pe = make_phone_normalizer(PREF)
            print(pe("999000111"))
            print(pe("+51999000111"))

            x = 10
            def outer():
                x = 20
                def inner():
                    return x  # enclosing
                return inner()
            print("LEGB enclosing x →", outer())
            """
        ).strip(),
        code_title="legb_closure.py",
        callout=(
            "tip",
            "Sin global",
            "Pasa la config como argumento o closure factory. Evita `global PREF` en normalizadores.",
        ),
    ),
    Theory(
        heading="Pruebas de ejemplo y refactor sin cambiar conducta",
        sub="S05-T4-B",
        paragraphs=[
            "Antes de refactorizar, fija **ejemplos ejecutables**: `assert normalize_email('A@B.COM') == 'a@b.com'`. Luego cambia la forma interna; si los asserts siguen verdes, la conducta se preservó.",
            "El refactor típico de S05: extraer `strip_collapse`, unificar defaults, renombrar. **No** cambies la política de negocio “de paso” sin actualizar tests y docstring.",
            "Idempotencia se prueba con un loop o doble llamada. Fronteras: vacío, solo espacios, Unicode (`Ñ`, tildes), None si el contrato lo admite.",
        ],
        code=textwrap.dedent(
            """\
            def normalize_email(raw: str) -> str:
                return raw.strip().lower()

            def _examples() -> None:
                assert normalize_email("  A@B.COM ") == "a@b.com"
                assert normalize_email(normalize_email("A@B.COM")) == "a@b.com"
                print("examples OK")

            # refactor interno: misma conducta
            def normalize_email(raw: str) -> str:
                s = raw.strip()
                return s.lower()

            _examples()
            print(normalize_email("Ana@Example.COM"))
            """
        ).strip(),
        code_title="refactor_seguro.py",
        callout=(
            "tip",
            "Rojo-verde-refactor",
            "Si no tienes ejemplos, no refactorices. El gate de normalizadores exige idempotencia demostrada.",
        ),
    ),
]

S05_DEMOS: list[Demo] = [
    Demo(
        "S05-T1-A-DEMO", "S05-T1-A",
        "def + return de normalize_nombre collapsando espacios",
        textwrap.dedent(
            """\
            def normalize_nombre(raw):
                return " ".join(raw.strip().split())

            for s in ["  Ana  ", "María  José", "QUISPE"]:
                print(repr(s), "→", repr(normalize_nombre(s)))
            """
        ).strip(),
        "Una función, un return, casos con espacios y Unicode simple.",
        title="S05-T1-A-DEMO — def_nombre",
    ),
    Demo(
        "S05-T1-B-DEMO", "S05-T1-B",
        "Defaults seguros vs default mutable bug",
        textwrap.dedent(
            """\
            def good(item, bucket=None):
                if bucket is None:
                    bucket = []
                bucket.append(item)
                return bucket

            def bad(item, bucket=[]):
                bucket.append(item)
                return bucket

            print("good", good(1), good(2))
            print("bad ", bad(1), bad(2))
            """
        ).strip(),
        "good crea listas nuevas; bad comparte el default entre llamadas.",
        title="S05-T1-B-DEMO — defaults",
    ),
    Demo(
        "S05-T2-A-DEMO", "S05-T2-A",
        "Docstring + pre/post en normalize_email",
        textwrap.dedent(
            """\
            def normalize_email(raw: str) -> str:
                \"\"\"Pre: str. Post: lower strip con @. Raises ValueError.\"\"\"
                s = raw.strip().lower()
                if "@" not in s:
                    raise ValueError("falta @")
                return s

            print(normalize_email("  X@Y.COM "))
            try:
                normalize_email("x")
            except ValueError as e:
                print("ValueError", e)
            """
        ).strip(),
        "El contrato está en el docstring y se enforce con raise.",
        title="S05-T2-A-DEMO — email_contract",
    ),
    Demo(
        "S05-T2-B-DEMO", "S05-T2-B",
        "Type hints + resultado de dominio sin abortar el lote",
        textwrap.dedent(
            """\
            from typing import Optional, Tuple

            def norm_tel(raw: str) -> Tuple[bool, Optional[str], Optional[str]]:
                d = "".join(c for c in raw if c.isdigit())
                if len(d) != 9:
                    return False, None, "se esperan 9 dígitos"
                return True, d, None

            for v in ["999000111", "123", "999-000-111"]:
                print(v, norm_tel(v))
            """
        ).strip(),
        "Hints documentan la tupla; el lote puede seguir tras un False.",
        title="S05-T2-B-DEMO — hints_tel",
    ),
    Demo(
        "S05-T3-A-DEMO", "S05-T3-A",
        "Componer strip + lower + orquestador de registro",
        textwrap.dedent(
            """\
            def strip_collapse(s: str) -> str:
                return " ".join(s.strip().split())

            def norm_email(s: str) -> str:
                return s.strip().lower()

            def normalize_pair(nombre: str, email: str) -> dict:
                return {"nombre": strip_collapse(nombre).title(), "email": norm_email(email)}

            print(normalize_pair("  ana  perez ", "  Ana@Example.COM "))
            """
        ).strip(),
        "Orquestador delgado reutiliza piezas pequeñas.",
        title="S05-T3-A-DEMO — compose",
    ),
    Demo(
        "S05-T3-B-DEMO", "S05-T3-B",
        "Idempotencia de normalize_telefono puro",
        textwrap.dedent(
            """\
            def normalize_telefono(raw: str) -> str:
                return "".join(c for c in raw if c.isdigit())

            samples = ["999-000-111", "(999) 000 111", "999000111"]
            for s in samples:
                once = normalize_telefono(s)
                twice = normalize_telefono(once)
                print(s, "→", once, "idem=", once == twice)
            """
        ).strip(),
        "f(f(x))==f(x) en los tres samples; sin I/O en la función.",
        title="S05-T3-B-DEMO — idem_tel",
    ),
    Demo(
        "S05-T4-A-DEMO", "S05-T4-A",
        "Closure factory para prefijo de teléfono",
        textwrap.dedent(
            """\
            def make_norm(prefix: str):
                def norm(raw: str) -> str:
                    d = "".join(c for c in raw if c.isdigit())
                    return prefix + d
                return norm

            pe = make_norm("+51")
            print(pe("999000111"))
            print(pe("999-000-111"))
            """
        ).strip(),
        "La interna recuerda prefix del enclosing scope sin global.",
        title="S05-T4-A-DEMO — closure",
    ),
    Demo(
        "S05-T4-B-DEMO", "S05-T4-B",
        "Ejemplos assert antes y después de micro-refactor",
        textwrap.dedent(
            """\
            def normalize_direccion(raw: str) -> str:
                return " ".join(raw.strip().split()).upper()

            def examples(fn):
                assert fn("  av. larco 123 ") == "AV. LARCO 123"
                assert fn(fn("Calle 1")) == fn("Calle 1")
                return True

            assert examples(normalize_direccion)

            def normalize_direccion(raw: str) -> str:
                parts = raw.strip().split()
                return " ".join(parts).upper()

            assert examples(normalize_direccion)
            print("refactor OK", normalize_direccion("  jr. unión 5 "))
            """
        ).strip(),
        "Misma suite de ejemplos en verde tras cambiar la implementación.",
        title="S05-T4-B-DEMO — refactor",
    ),
]

S05_EX: list[Ex] = [
    Ex(
        "S05-T1-A-E1", "S05-T1-A", "guided",
        "E1 (guiado) — Escribe `def doble(n):` que retorne `n*2`. Imprime doble(21).",
        "return n * 2",
        "No uses print dentro de doble.",
        "def doble(n):\n    # TODO\n    ...\nprint(doble(21))",
        "def doble(n):\n    return n * 2\nprint(doble(21))",
        edge=["return vs print"],
        tests="42",
        feedback="return entrega el valor al caller.",
        title="doble.py",
    ),
    Ex(
        "S05-T1-A-E2", "S05-T1-A", "independent",
        "E2 (independiente) — `normalize_nombre(raw)` colapsa espacios internos y strip. Prueba con `'  Juan   Pérez '`.",
        '" ".join(raw.strip().split())',
        "title() es opcional; aquí solo colapsar.",
        "def normalize_nombre(raw):\n    # TODO\n    ...\nprint(normalize_nombre('  Juan   Pérez '))",
        "def normalize_nombre(raw):\n    return \" \".join(raw.strip().split())\nprint(normalize_nombre('  Juan   Pérez '))",
        edge=["espacios múltiples"],
        tests="Juan Pérez",
        feedback="Base del normalizador de nombres del capstone.",
        title="norm_nombre.py",
    ),
    Ex(
        "S05-T1-A-E3", "S05-T1-A", "transfer",
        "E3 (transferencia) — Función `saluda(nombre)` que retorne el string; en main imprime el return. Demuestra que sin return print(saluda(...)) muestra None si olvidas return (arregla para que no sea None).",
        "Si ves None, falta return.",
        "return f'Hola {nombre}'",
        "def saluda(nombre):\n    f'Hola {nombre}'  # BUG?\nprint(saluda('Ana'))",
        "def saluda(nombre):\n    return f'Hola {nombre}'\nprint(saluda('Ana'))",
        edge=["None implícito"],
        tests="Hola Ana",
        feedback="El bug None es el más común al migrar de scripts a funciones.",
        title="return_none.py",
    ),
    Ex(
        "S05-T1-B-E1", "S05-T1-B", "guided",
        "E1 (guiado) — `def present(nombre, titulo='Cliente'):` retorna `f'{titulo}: {nombre}'`. Llama posicional y con keyword titulo=.",
        "default solo se usa si omites el arg",
        "Dos prints distintos",
        "def present(nombre, titulo='Cliente'):\n    # TODO\n    ...\nprint(present('Quispe'))\nprint(present('Quispe', titulo='VIP'))",
        "def present(nombre, titulo='Cliente'):\n    return f'{titulo}: {nombre}'\nprint(present('Quispe'))\nprint(present('Quispe', titulo='VIP'))",
        edge=["keyword override"],
        tests="Cliente: / VIP:",
        feedback="Keyword hace legible la política en el call site.",
        title="present.py",
    ),
    Ex(
        "S05-T1-B-E2", "S05-T1-B", "independent",
        "E2 (independiente) — Reescribe un `bad_add` con default mutable a la versión segura con None. Muestra dos llamadas good(1), good(2) independientes.",
        "if bucket is None: bucket = []",
        "No deben compartir lista.",
        "def good_add(item, bucket=None):\n    # TODO\n    ...\nprint(good_add(1))\nprint(good_add(2))",
        "def good_add(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\nprint(good_add(1))\nprint(good_add(2))",
        edge=["default None"],
        tests="[1] luego [2]",
        feedback="Default mutable es anti-patrón de producción.",
        title="safe_default.py",
    ),
    Ex(
        "S05-T1-B-E3", "S05-T1-B", "transfer",
        "E3 (transferencia) — `normalize_telefono(raw, *, digits_only=True)` keyword-only. Si digits_only, deja solo dígitos; si False, solo strip. Demuestra ambas llamadas por keyword.",
        "El * fuerza keyword para digits_only.",
        "normalize_telefono(' 999-1 ', digits_only=False)",
        "def normalize_telefono(raw, *, digits_only=True):\n    # TODO\n    ...\nprint(normalize_telefono(' 999-000 '))\nprint(normalize_telefono(' 999-000 ', digits_only=False))",
        "def normalize_telefono(raw, *, digits_only=True):\n    s = raw.strip()\n    if digits_only:\n        return ''.join(c for c in s if c.isdigit())\n    return s\nprint(normalize_telefono(' 999-000 '))\nprint(normalize_telefono(' 999-000 ', digits_only=False))",
        edge=["keyword-only"],
        tests="999000 y 999-000",
        feedback="Keyword-only documenta flags de política regional.",
        title="kwonly_tel.py",
    ),
    Ex(
        "S05-T2-A-E1", "S05-T2-A", "guided",
        "E1 (guiado) — Añade docstring de una línea a `def area(w, h): return w*h` e imprime `area.__doc__`.",
        "Triple comillas justo bajo def",
        "Docstring no es un comentario #",
        "def area(w, h):\n    # TODO docstring\n    return w * h\nprint(area.__doc__)\nprint(area(3, 4))",
        "def area(w, h):\n    \"\"\"Retorna el área de un rectángulo w×h.\"\"\"\n    return w * h\nprint(area.__doc__)\nprint(area(3, 4))",
        edge=["__doc__"],
        tests="doc + 12",
        feedback="__doc__ es legible por help() y herramientas.",
        title="doc_area.py",
    ),
    Ex(
        "S05-T2-A-E2", "S05-T2-A", "independent",
        "E2 (independiente) — `normalize_email` con pre/post en docstring: strip+lower; ValueError si no hay @. Prueba OK y error.",
        "if '@' not in s: raise ValueError",
        "Mensaje accionable en español.",
        "def normalize_email(raw: str) -> str:\n    \"\"\"TODO pre/post\"\"\"\n    # TODO\n    ...\nprint(normalize_email('  A@B.COM '))\ntry:\n    normalize_email('x')\nexcept ValueError as e:\n    print('err', e)",
        "def normalize_email(raw: str) -> str:\n    \"\"\"Pre: str. Post: lower/strip con @. Raises ValueError.\"\"\"\n    s = raw.strip().lower()\n    if '@' not in s:\n        raise ValueError('email sin @')\n    return s\nprint(normalize_email('  A@B.COM '))\ntry:\n    normalize_email('x')\nexcept ValueError as e:\n    print('err', e)",
        edge=["ValueError dominio"],
        tests="a@b.com + err",
        feedback="Pre/post en docstring + raise alineados.",
        title="email_prepost.py",
    ),
    Ex(
        "S05-T2-A-E3", "S05-T2-A", "transfer",
        "E3 (transferencia) — Documenta y escribe `normalize_nombre` con postcondición: no empiezan/terminan espacios y no hay dobles espacios. Assert de la postcondición en un ejemplo.",
        "assert result == result.strip() and '  ' not in result",
        "La post se puede chequear en tests.",
        "def normalize_nombre(raw: str) -> str:\n    \"\"\"Post: sin extremos ni dobles espacios.\"\"\"\n    # TODO\n    ...\nr = normalize_nombre('  Ana  María  ')\nprint(r)\nassert r == r.strip() and '  ' not in r\nprint('post OK')",
        "def normalize_nombre(raw: str) -> str:\n    \"\"\"Post: sin extremos ni dobles espacios.\"\"\"\n    return ' '.join(raw.strip().split())\nr = normalize_nombre('  Ana  María  ')\nprint(r)\nassert r == r.strip() and '  ' not in r\nprint('post OK')",
        edge=["postcondición testeable"],
        tests="Ana María + post OK",
        feedback="Contrato + assert de ejemplo = especificación viva.",
        title="post_nombre.py",
    ),
    Ex(
        "S05-T2-B-E1", "S05-T2-B", "guided",
        "E1 (guiado) — Anota `def len_safe(s: str) -> int` y retorna len. Imprime el resultado y un comentario mental de que el hint no valida en runtime.",
        "hints no ejecutan isinstance mágicamente",
        "len_safe(123) fallaría en runtime igual",
        "def len_safe(s: str) -> int:\n    return len(s)\nprint(len_safe('abc'))",
        "def len_safe(s: str) -> int:\n    return len(s)\nprint(len_safe('abc'))\nprint('hint no valida en runtime')",
        edge=["hints graduales"],
        tests="3 + nota",
        feedback="Hints son contrato para humanos y typecheckers.",
        title="hint_len.py",
    ),
    Ex(
        "S05-T2-B-E2", "S05-T2-B", "independent",
        "E2 (independiente) — `parse_monto(raw: str) -> tuple` (ok, value, err). Acepta enteros >=0; error de dominio si negativo o no int.",
        "try int; if n<0 dominio",
        "0 es válido.",
        "from typing import Optional, Tuple\n\ndef parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:\n    # TODO\n    ...\nfor v in ['0', '10', '-1', 'x']:\n    print(v, parse_monto(v))",
        "from typing import Optional, Tuple\n\ndef parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:\n    try:\n        n = int(raw.strip())\n    except ValueError:\n        return False, None, 'no es entero'\n    if n < 0:\n        return False, None, 'negativo no permitido'\n    return True, n, None\nfor v in ['0', '10', '-1', 'x']:\n    print(v, parse_monto(v))",
        edge=["0 válido", "negativo dominio"],
        tests="4 casos",
        feedback="Separar ValueError de parse vs regla de dominio.",
        title="parse_monto.py",
    ),
    Ex(
        "S05-T2-B-E3", "S05-T2-B", "transfer",
        "E3 (transferencia) — Elige raise ValueError **o** tupla para `normalize_email` y documenta por qué en un print. Implementa la opción raise y captura en el caller del lote (for de 2 emails).",
        "Lote: try/except por fila para no abortar todo",
        "Una fila mala no impide la buena",
        "def normalize_email(raw: str) -> str:\n    # TODO raise\n    ...\nfor e in ['ok@ex.com', 'malo']:\n    # TODO try/except print",
        "def normalize_email(raw: str) -> str:\n    s = raw.strip().lower()\n    if '@' not in s:\n        raise ValueError('email inválido')\n    return s\nprint('estrategia: raise + try por fila en el borde')\nfor e in ['ok@ex.com', 'malo']:\n    try:\n        print('OK', normalize_email(e))\n    except ValueError as err:\n        print('SKIP', e, err)",
        edge=["borde I/O vs core"],
        tests="OK + SKIP",
        feedback="Core estricto + borde tolerante es un diseño limpio.",
        title="raise_vs_tuple.py",
    ),
    Ex(
        "S05-T3-A-E1", "S05-T3-A", "guided",
        "E1 (guiado) — Extrae `strip_collapse` y úsalo dentro de `normalize_nombre` que además hace .title().",
        "def strip_collapse; return strip_collapse(raw).title()",
        "Composición de dos pasos.",
        "def strip_collapse(s):\n    # TODO\n    ...\ndef normalize_nombre(raw):\n    # TODO\n    ...\nprint(normalize_nombre('  ana  maría '))",
        "def strip_collapse(s):\n    return ' '.join(s.strip().split())\ndef normalize_nombre(raw):\n    return strip_collapse(raw).title()\nprint(normalize_nombre('  ana  maría '))",
        edge=["title after collapse"],
        tests="Ana María",
        feedback="Piezas pequeñas se testean solas.",
        title="extract_strip.py",
    ),
    Ex(
        "S05-T3-A-E2", "S05-T3-A", "independent",
        "E2 (independiente) — Orquestador `normalize_contact(nombre, email)` devuelve dict usando dos helpers.",
        "return {'nombre': ..., 'email': ...}",
        "email lower strip",
        "def norm_n(s):\n    return ' '.join(s.strip().split()).title()\ndef norm_e(s):\n    return s.strip().lower()\ndef normalize_contact(nombre, email):\n    # TODO\n    ...\nprint(normalize_contact('  luis ', '  L@E.COM '))",
        "def norm_n(s):\n    return ' '.join(s.strip().split()).title()\ndef norm_e(s):\n    return s.strip().lower()\ndef normalize_contact(nombre, email):\n    return {'nombre': norm_n(nombre), 'email': norm_e(email)}\nprint(normalize_contact('  luis ', '  L@E.COM '))",
        edge=["dict orquestado"],
        tests="Luis + l@e.com",
        feedback="El orquestador no reimplementa reglas.",
        title="orch_contact.py",
    ),
    Ex(
        "S05-T3-A-E3", "S05-T3-A", "transfer",
        "E3 (transferencia) — Parte una función monstruo de 10 líneas (nombre+email+tel en un solo def con comentarios) en 3 funciones + orquestador. Misma salida.",
        "Cada campo = una función",
        "Salida dict con 3 claves",
        "# monstruo a reemplazar conceptualmente\ndef normalize_all(n, e, t):\n    # TODO descomponer\n    ...\nprint(normalize_all('  Ana ', 'A@B.COM', '999-1'))",
        "def n_nombre(n):\n    return ' '.join(n.strip().split()).title()\ndef n_email(e):\n    return e.strip().lower()\ndef n_tel(t):\n    return ''.join(c for c in t if c.isdigit())\ndef normalize_all(n, e, t):\n    return {'nombre': n_nombre(n), 'email': n_email(e), 'tel': n_tel(t)}\nprint(normalize_all('  Ana ', 'A@B.COM', '999-1'))",
        edge=["descomposición"],
        tests="3 keys normalizadas",
        feedback="Si el monstruo vuelve, el PR se rechaza en code review.",
        title="split_monster.py",
    ),
    Ex(
        "S05-T3-B-E1", "S05-T3-B", "guided",
        "E1 (guiado) — Escribe `normalize_tel` puro (solo dígitos). Demuestra idempotencia con dos llamadas encadenadas.",
        "once = f(x); twice = f(once); print once==twice",
        "Sin print dentro de normalize_tel.",
        "def normalize_tel(raw):\n    # TODO\n    ...\nx = '999-000'\nonce = normalize_tel(x)\nprint(once, normalize_tel(once) == once)",
        "def normalize_tel(raw):\n    return ''.join(c for c in raw if c.isdigit())\nx = '999-000'\nonce = normalize_tel(x)\nprint(once, normalize_tel(once) == once)",
        edge=["idempotencia"],
        tests="999000 True",
        feedback="Idempotencia es el test mínimo del gate.",
        title="pure_tel.py",
    ),
    Ex(
        "S05-T3-B-E2", "S05-T3-B", "independent",
        "E2 (independiente) — Separa: `normalize_email` puro + `print_report(email)` con efecto de print. No imprimas dentro del normalizador.",
        "print solo en print_report",
        "Core testeable sin capturar stdout",
        "def normalize_email(raw):\n    # TODO puro\n    ...\ndef print_report(raw):\n    # TODO efecto\n    ...\nprint_report('  Z@W.COM ')",
        "def normalize_email(raw):\n    return raw.strip().lower()\ndef print_report(raw):\n    print('email=', normalize_email(raw))\nprint_report('  Z@W.COM ')",
        edge=["efecto al borde"],
        tests="email= z@w.com",
        feedback="Efectos al borde, pureza al centro.",
        title="io_borde.py",
    ),
    Ex(
        "S05-T3-B-E3", "S05-T3-B", "transfer",
        "E3 (transferencia) — Inyecta un normalizador: `process(line, norm=normalize_tel)` usa la fn inyectada. Llama con default y con un norm alternativo que deja todo upper strip.",
        "norm es parámetro con default",
        "Demuestra dos comportamientos",
        "def normalize_tel(raw):\n    return ''.join(c for c in raw if c.isdigit())\ndef process(line, norm=normalize_tel):\n    # TODO\n    ...\nprint(process(' 999-a '))\nprint(process(' 999-a ', norm=lambda s: s.strip().upper()))",
        "def normalize_tel(raw):\n    return ''.join(c for c in raw if c.isdigit())\ndef process(line, norm=normalize_tel):\n    return norm(line)\nprint(process(' 999-a '))\nprint(process(' 999-a ', norm=lambda s: s.strip().upper()))",
        edge=["inyección de dependencia simple"],
        tests="999 y 999-A",
        feedback="Inyectar la fn permite tests con fakes sin monkeypatch.",
        title="inject_norm.py",
    ),
    Ex(
        "S05-T4-A-E1", "S05-T4-A", "guided",
        "E1 (guiado) — Predice LEGB: global x=1; dentro de f, x=2 local; print dentro y fuera.",
        "Local no pisa global sin global keyword",
        "Fuera sigue 1",
        "x = 1\ndef f():\n    x = 2\n    print('in', x)\nf()\nprint('out', x)",
        "x = 1\ndef f():\n    x = 2\n    print('in', x)\nf()\nprint('out', x)",
        edge=["local vs global"],
        tests="in 2 out 1",
        feedback="Asignar dentro crea local; el global no cambia.",
        title="legb_local.py",
    ),
    Ex(
        "S05-T4-A-E2", "S05-T4-A", "independent",
        "E2 (independiente) — `make_multiplier(k)` devuelve función que multiplica por k (closure). Crea *3 y *10.",
        "def inner(n): return n*k; return inner",
        "print(m3(4), m10(4))",
        "def make_multiplier(k):\n    # TODO\n    ...\nm3 = make_multiplier(3)\nm10 = make_multiplier(10)\nprint(m3(4), m10(4))",
        "def make_multiplier(k):\n    def inner(n):\n        return n * k\n    return inner\nm3 = make_multiplier(3)\nm10 = make_multiplier(10)\nprint(m3(4), m10(4))",
        edge=["closure"],
        tests="12 40",
        feedback="Factories por closure evitan clases prematuras.",
        title="closure_mul.py",
    ),
    Ex(
        "S05-T4-A-E3", "S05-T4-A", "transfer",
        "E3 (transferencia) — Factory `make_normalizer(mode)` donde mode 'digits' o 'lower' devuelve la fn adecuada. Úsala en dos prints.",
        "if mode=='digits': return lambda o def digits...",
        "Sin global mode",
        "def make_normalizer(mode):\n    # TODO\n    ...\nd = make_normalizer('digits')\nlo = make_normalizer('lower')\nprint(d('A-1-B-2'), lo('  Hola '))",
        "def make_normalizer(mode):\n    if mode == 'digits':\n        def norm(raw):\n            return ''.join(c for c in raw if c.isdigit())\n        return norm\n    if mode == 'lower':\n        def norm(raw):\n            return raw.strip().lower()\n        return norm\n    raise ValueError('mode')\nd = make_normalizer('digits')\nlo = make_normalizer('lower')\nprint(d('A-1-B-2'), lo('  Hola '))",
        edge=["factory multipolítica"],
        tests="12 hola",
        feedback="Config en el enclosing, no en global mutable.",
        title="factory_norm.py",
    ),
    Ex(
        "S05-T4-B-E1", "S05-T4-B", "guided",
        "E1 (guiado) — Escribe 2 asserts de ejemplo para `normalize_email = lambda s: s.strip().lower()` e imprime OK.",
        "assert normalize_email('A@B.COM')=='a@b.com'",
        "Incluye idempotencia",
        "def normalize_email(s):\n    return s.strip().lower()\n# TODO asserts\nprint('OK')",
        "def normalize_email(s):\n    return s.strip().lower()\nassert normalize_email('  A@B.COM ') == 'a@b.com'\nassert normalize_email(normalize_email('A@B.COM')) == 'a@b.com'\nprint('OK')",
        edge=["assert ejemplos"],
        tests="OK",
        feedback="Ejemplos primero, implementación después.",
        title="examples_email.py",
    ),
    Ex(
        "S05-T4-B-E2", "S05-T4-B", "independent",
        "E2 (independiente) — Refactoriza `normalize_dir` de una línea densa a dos pasos (strip_collapse + upper) sin romper asserts dados.",
        "Corre asserts antes y después mentalmente",
        "Misma salida",
        "def normalize_dir(raw):\n    return ' '.join(raw.strip().split()).upper()\nassert normalize_dir('  av 1 ') == 'AV 1'\nassert normalize_dir(normalize_dir('x')) == normalize_dir('x')\n# TODO reescribir cuerpo\ndef normalize_dir(raw):\n    # TODO\n    ...\nassert normalize_dir('  av 1 ') == 'AV 1'\nprint(normalize_dir(' jr 2 '))",
        "def normalize_dir(raw):\n    return ' '.join(raw.strip().split()).upper()\nassert normalize_dir('  av 1 ') == 'AV 1'\nassert normalize_dir(normalize_dir('x')) == normalize_dir('x')\ndef strip_collapse(s):\n    return ' '.join(s.strip().split())\ndef normalize_dir(raw):\n    return strip_collapse(raw).upper()\nassert normalize_dir('  av 1 ') == 'AV 1'\nprint(normalize_dir(' jr 2 '))",
        edge=["refactor preserva conducta"],
        tests="AV 1 / JR 2",
        feedback="Verde-refactor-verde es el hábito profesional.",
        title="refactor_dir.py",
    ),
    Ex(
        "S05-T4-B-E3", "S05-T4-B", "transfer",
        "E3 (transferencia) — Suite mínima: lista de (input, expected) para normalize_nombre; loop assert. Luego cambia implementación a title-case y actualiza expected si la política cambia conscientemente — aquí **mantén** collapsar sin title y deja expected estables.",
        "No cambies política sin actualizar tests",
        "Todos PASS",
        "def normalize_nombre(raw):\n    return ' '.join(raw.strip().split())\ncases = [('  a  b ', 'a b'), ('X', 'X')]\n# TODO loop\nprint('all PASS')",
        "def normalize_nombre(raw):\n    return ' '.join(raw.strip().split())\ncases = [('  a  b ', 'a b'), ('X', 'X')]\nfor inp, exp in cases:\n    got = normalize_nombre(inp)\n    assert got == exp, (inp, got, exp)\n    print('PASS', inp, '→', got)\nprint('all PASS')",
        edge=["tabla de casos"],
        tests="PASS lines",
        feedback="Tabla de casos = contrato ejecutable del normalizador.",
        title="suite_nombre.py",
    ),
]

S05_YOUDO_STARTER = '''\
"""normalizers_pure.py — inicio CP-N1-B (S05)
Normalizadores puros de nombre, email, teléfono y dirección.
Idempotencia demostrada. Sin I/O en el core.
Datos sintéticos únicamente.
"""

from __future__ import annotations

from typing import Callable


def normalize_nombre(raw: str) -> str:
    """Colapsa espacios; title-case de palabras.
    Pre: str. Post: sin extremos ni dobles espacios.
    """
    # TODO
    raise NotImplementedError


def normalize_email(raw: str) -> str:
    """strip + lower. ValueError si falta @.
    """
    # TODO
    raise NotImplementedError


def normalize_telefono(raw: str) -> str:
    """Solo dígitos (política PE sintética de demo).
    """
    # TODO
    raise NotImplementedError


def normalize_direccion(raw: str) -> str:
    """Colapsa espacios; upper para demo determinista.
    """
    # TODO
    raise NotImplementedError


def normalize_record(nombres: str, email: str, telefono: str, direccion: str) -> dict:
    """Orquestador delgado — solo llama normalizadores puros."""
    # TODO
    raise NotImplementedError


def is_idempotent(fn: Callable[[str], str], sample: str) -> bool:
    once = fn(sample)
    return fn(once) == once


def _run_tests() -> None:
    assert normalize_nombre("  maría  josé ") == "María José"
    assert is_idempotent(normalize_nombre, "  ana  ")
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert is_idempotent(normalize_email, "A@B.COM")
    assert normalize_telefono("999-000-111") == "999000111"
    assert is_idempotent(normalize_telefono, "999-000-111")
    assert normalize_direccion("  av. larco 100 ") == "AV. LARCO 100"
    r = normalize_record("  luis ", "L@E.COM", "(999)111222", " jr unión 1 ")
    assert set(r) >= {"nombres", "email", "telefono", "direccion"}
    print("tests OK")


def main() -> None:
    print(normalize_record(
        "  Ana  Pérez ",
        "  Ana.Perez@Example.COM ",
        "999-000-111",
        "  Av. Larco 123 ",
    ))
    _run_tests()


if __name__ == "__main__":
    main()
'''


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
    # Verify theory code
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
    # youDo
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


def main() -> None:
    s04_meta = {
        "id": "functions-modules",
        "index": 4,
        "title": "Iteración y resúmenes transaccionales",
        "shortTitle": "Iteración & Resúmenes",
        "tagline": "for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A",
        "estimatedHours": 8,
        "level": "Principiante",
        "phase": 0,
        "icon": "Repeat",
        "accentColor": "bg-gradient-to-br from-amber-500 to-orange-600",
        "jobRelevance": (
            "En onboarding de data en bancos, fintech y retail en Perú, el motor de reglas (S03) "
            "debe correr sobre **lotes**: cientos de filas, no un solo dict de demo. Si no dominas "
            "for/while, contadores y tasas con denominador correcto, tu script de calidad miente "
            "en el dashboard. Esta sección cierra el gate **CP-N1-A**: procesar múltiples registros, "
            "resumir errores, conservar originales y entregar una demo reproducible por stdout."
        ),
        "learningOutcomes": [
            "Recorrer secuencias con for y range sin off-by-one en el stop exclusivo",
            "Usar enumerate y zip (incl. strict) sin desalinear columnas de intake",
            "Escribir while con centinelas y condición de terminación explícita",
            "Aplicar break/continue y guardrails contra loops infinitos",
            "Implementar contadores, acumuladores y búsquedas en un pase O(n)",
            "Escribir comprehensions legibles para filtros simples de resumen",
            "Trazar el estado de un bucle para depurar contadores",
            "Distinguir costo lineal vs cuadrático y corregir off-by-one en índices",
        ],
    }
    s04_youdo = {
        "title": "Client Intake & Data Quality Script (cierre CP-N1-A)",
        "context": (
            "Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un "
            "procesador por **lotes**: múltiples registros sintéticos, un pase O(n), contadores "
            "accept/reject/review, **tasa de error con denominador = n_total** (None si vacío), "
            "conservación del **raw** por fila y reporte por stdout. La CLI instalable llega en S10."
        ),
        "objectives": [
            "Procesar ≥3 registros sintéticos en un solo pase",
            "Emitir contadores y tasa_reject con denominador correcto",
            "Conservar el original (raw) de cada registro en el resultado",
            "Reutilizar validación tri-estado por campo (S03)",
            "Demo reproducible con if __name__ == '__main__'",
        ],
        "requirements": [
            "process_batch(records) → summary con n_total, contadores, tasa_reject, results[]",
            "Cada result incluye raw intacto + status agregado + detalle de campos",
            "tasa_reject is None cuando n_total == 0 (sin ZeroDivisionError)",
            "Sin PII real; datos sintéticos embebidos",
            "Sin loops O(n²) innecesarios para el resumen",
            "README o docstring con denominador de tasas explicado en español",
        ],
        "starterCode": S04_YOUDO_STARTER,
        "portfolioNote": (
            "En el README muestra una tabla de ejemplo (3 filas), el cálculo de tasa y una captura "
            "de la demo stdout. Explica por qué el raw se conserva. Eso es evidencia publicable del gate CP-N1-A."
        ),
        "rubric": [
            ("Procesa lote multi-registro en O(n)", "25%"),
            ("Tasas con denominador correcto / vacío seguro", "25%"),
            ("Conserva raw y valida tri-estado", "20%"),
            ("Reporte stdout legible y demo reproducible", "15%"),
            ("Sin infinito / sin n² innecesario", "10%"),
            ("Documentación en español del resumen", "5%"),
        ],
    }
    s04_self = [
        {
            "question": "¿Qué produce list(range(3))?",
            "options": ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "[3]"],
            "correctIndex": 1,
            "explanation": "range(stop) es 0-inclusive y stop-exclusivo: 0,1,2.",
        },
        {
            "question": "zip([1,2,3],[10,20]) sin strict…",
            "options": [
                "Lanza ValueError",
                "Empareja solo (1,10) y (2,20); el 3 se pierde en silencio",
                "Rellena con None el tercero",
                "Empareja en producto cartesiano",
            ],
            "correctIndex": 1,
            "explanation": "zip se detiene en la secuencia más corta. Valida len o usa strict=True (3.10+) para fallar si difieren.",
        },
        {
            "question": "Para la tasa de reject del gate, el denominador debe ser…",
            "options": [
                "Solo n_accept",
                "n_total de registros procesados (intentados)",
                "Siempre 100",
                "n_review únicamente",
            ],
            "correctIndex": 1,
            "explanation": "tasa_reject = n_reject / n_total; si n_total==0 → None, no dividir.",
        },
        {
            "question": "¿Qué hace continue en un for de líneas de intake?",
            "options": [
                "Termina todo el programa",
                "Salta al siguiente ciclo del bucle",
                "Borra la lista",
                "Convierte la línea en None",
            ],
            "correctIndex": 1,
            "explanation": "continue omite el resto del cuerpo y pasa a la siguiente iteración (p. ej. filas vacías).",
        },
        {
            "question": "Un doble for anidado sobre n elementos es aproximadamente…",
            "options": ["O(1)", "O(n)", "O(n²)", "O(log n)"],
            "correctIndex": 2,
            "explanation": "n×n pasos → cuadrático. Los resúmenes de tasa bastan con un pase O(n).",
        },
    ]
    s04_res = {
        "docs": [
            {
                "label": "Python Tutorial — for / range",
                "url": "https://docs.python.org/3/tutorial/controlflow.html#for-statements",
                "note": "for, range, break, continue",
            },
            {
                "label": "enumerate",
                "url": "https://docs.python.org/3/library/functions.html#enumerate",
                "note": "Índices sin range(len) manual",
            },
            {
                "label": "zip",
                "url": "https://docs.python.org/3/library/functions.html#zip",
                "note": "strict=True desde 3.10",
            },
            {
                "label": "List comprehensions",
                "url": "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
                "note": "Forma legible de map/filter simple",
            },
        ],
        "books": [
            {
                "label": "Python Crash Course (Matthes)",
                "note": "Capítulos de loops; aplicar a lotes de intake del curso.",
            },
            {
                "label": "Automate the Boring Stuff",
                "note": "Patrones de procesamiento por líneas; no copiar PII real.",
            },
        ],
        "courses": [
            {
                "label": "CS50P — Loops",
                "url": "https://cs50.harvard.edu/python/",
                "note": "Práctica de for/while; adaptar al dominio sintético CP-N1-A.",
            },
        ],
    }

    print("Building S04…")
    s04_ts, s04_log = build_section(
        "section04",
        s04_meta,
        S04_THEORY,
        S04_DEMOS,
        S04_EX,
        "Ocho demos I Do (uno por subtema). Ejecuta en orden T1→T4. Cada demo es un fragmento del procesador por lotes del gate CP-N1-A. Datos sintéticos; entorno browser-pyodide salvo que se indique.",
        "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara; no inventes salidas. Datos sintéticos únicamente.",
        s04_youdo,
        s04_self,
        s04_res,
    )
    out04 = SECTIONS / "s04-functions-modules.ts"
    out04.write_text(s04_ts, encoding="utf-8")
    print(f"Wrote {out04} ({len(s04_ts.splitlines())} lines)")

    s05_meta = {
        "id": "oop",
        "index": 5,
        "title": "Funciones, contratos y descomposición",
        "shortTitle": "Funciones & Contratos",
        "tagline": "def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B",
        "estimatedHours": 8,
        "level": "Principiante",
        "phase": 0,
        "icon": "FunctionSquare",
        "accentColor": "bg-gradient-to-br from-purple-500 to-fuchsia-600",
        "jobRelevance": (
            "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es "
            "**descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono "
            "y dirección **sin** mezclar lectura de archivos. En bancos y fintech en Perú, un "
            "normalizador no idempotente o con default mutable genera basura silenciosa en el ETL "
            "(CP-N1-B). Esta sección inicia ese camino — OOP de dominio llega en S11."
        ),
        "learningOutcomes": [
            "Definir funciones con def, llamarlas y retornar valores (no None accidental)",
            "Usar parámetros posicionales, keyword y defaults seguros (sin mutables)",
            "Documentar pre/postcondiciones con docstrings alineados al código",
            "Anotar type hints graduales y modelar errores de dominio",
            "Descomponer lógica en funciones pequeñas y orquestadores delgados",
            "Distinguir pureza de efectos e inyectar I/O en el borde",
            "Explicar LEGB y escribir closures/factories simples",
            "Fijar ejemplos/asserts y refactorizar sin cambiar conducta",
        ],
    }
    s05_youdo = {
        "title": "Normalizadores puros (inicio CP-N1-B)",
        "context": (
            "Inicias **CP-N1-B** con el núcleo reutilizable: `normalize_nombre`, `normalize_email`, "
            "`normalize_telefono`, `normalize_direccion` como funciones **puras**, con docstring, "
            "hints graduales e **idempotencia** demostrada. Sin pathlib CSV todavía (S08) y sin "
            "clases de dominio (S11). Solo datos sintéticos."
        ),
        "objectives": [
            "Implementar 4 normalizadores puros + orquestador normalize_record",
            "Demostrar idempotencia f(f(x))==f(x) en cada uno",
            "Docstrings con pre/post; ValueError o política explícita en email",
            "Sin I/O ni prints dentro del core",
            "Suite de ejemplos/asserts ejecutable en __main__",
        ],
        "requirements": [
            "normalize_nombre colapsa espacios y aplica title de palabras",
            "normalize_email: strip+lower; error si no hay @",
            "normalize_telefono: solo dígitos (política de demo)",
            "normalize_direccion: colapsa + upper determinista",
            "is_idempotent helper o asserts equivalentes",
            "Datos sintéticos; sin PII real",
        ],
        "starterCode": S05_YOUDO_STARTER,
        "portfolioNote": (
            "Documenta en español la política de cada normalizador y pega la salida de la suite. "
            "Menciona que la I/O de archivos llegará en S08; aquí solo el core puro."
        ),
        "rubric": [
            ("Cuatro normalizadores correctos", "25%"),
            ("Idempotencia demostrada", "25%"),
            ("Pureza (sin I/O en core)", "20%"),
            ("Docstrings / hints / errores de dominio", "15%"),
            ("Orquestador delgado + tests", "10%"),
            ("Documentación en español", "5%"),
        ],
    }
    s05_self = [
        {
            "question": "Si una función no tiene return, ¿qué devuelve la llamada?",
            "options": ["0", "False", "None", "Error siempre"],
            "correctIndex": 2,
            "explanation": "Python inserta return None implícito.",
        },
        {
            "question": "¿Por qué `def f(xs=[])` es peligroso?",
            "options": [
                "Python no permite defaults",
                "El default mutable se comparte entre llamadas",
                "Solo falla con type hints",
                "Convierte xs en tupla",
            ],
            "correctIndex": 1,
            "explanation": "El objeto default se crea una vez; appends se acumulan entre llamadas.",
        },
        {
            "question": "Una función pura…",
            "options": [
                "Siempre imprime el resultado",
                "Lee un archivo de config global",
                "Mismo input → mismo output, sin efectos colaterales",
                "Solo puede usarse en clases",
            ],
            "correctIndex": 2,
            "explanation": "Pureza = determinismo + sin side effects; ideal para normalizadores.",
        },
        {
            "question": "LEGB significa…",
            "options": [
                "Local, Enclosing, Global, Builtin",
                "List, Else, Generator, Break",
                "Loop, Eval, Global, Binary",
                "Lambda, Except, Goto, Block",
            ],
            "correctIndex": 0,
            "explanation": "Orden de resolución de nombres en Python.",
        },
        {
            "question": "Idempotencia de un normalizador f significa…",
            "options": [
                "f se ejecuta solo una vez en la vida del proceso",
                "f(f(x)) == f(x) para entradas del dominio",
                "f no puede tener defaults",
                "f siempre lanza ValueError",
            ],
            "correctIndex": 1,
            "explanation": "Reaplicar la normalización no cambia el valor ya canónico.",
        },
    ]
    s05_res = {
        "docs": [
            {
                "label": "Python Tutorial — Defining Functions",
                "url": "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
                "note": "def, defaults, return",
            },
            {
                "label": "PEP 257 — Docstring Conventions",
                "url": "https://peps.python.org/pep-0257/",
                "note": "Estilo de documentación de contrato",
            },
            {
                "label": "typing — Support for type hints",
                "url": "https://docs.python.org/3/library/typing.html",
                "note": "Optional, Tuple y hints graduales",
            },
            {
                "label": "Python LEGB rule",
                "url": "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces",
                "note": "Scopes y namespaces (base de LEGB)",
            },
        ],
        "books": [
            {
                "label": "Python Crash Course (Matthes)",
                "note": "Funciones y módulos introductorios; aplicar a normalizadores del curso.",
            },
            {
                "label": "Fluent Python (Ramalho)",
                "note": "Profundidad en funciones de primera clase; consulta selectiva post-S05.",
            },
        ],
        "courses": [
            {
                "label": "CS50P — Functions",
                "url": "https://cs50.harvard.edu/python/",
                "note": "Diseño de funciones; no copiar problem sets con PII.",
            },
        ],
    }

    print("Building S05…")
    s05_ts, s05_log = build_section(
        "section05",
        s05_meta,
        S05_THEORY,
        S05_DEMOS,
        S05_EX,
        "Ocho demos I Do (uno por subtema). Del def al refactor con ejemplos. Los normalizadores son el hilo hacia CP-N1-B. Datos sintéticos; browser-pyodide.",
        "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara. Datos sintéticos únicamente.",
        s05_youdo,
        s05_self,
        s05_res,
    )
    out05 = SECTIONS / "s05-oop.ts"
    out05.write_text(s05_ts, encoding="utf-8")
    print(f"Wrote {out05} ({len(s05_ts.splitlines())} lines)")

    # Progress + lane status
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    def subtopics_block(prefix: str, slugs: list[tuple[str, str]]) -> dict:
        out = {}
        for sid, slug in slugs:
            out[sid] = {
                "slug": slug,
                "status": "COMPLETE",
                "theory": True,
                "demo": f"{sid}-DEMO",
                "exercises": [f"{sid}-E1", f"{sid}-E2", f"{sid}-E3"],
                "executed": True,
            }
        return out

    s04_slugs = [
        ("S04-T1-A", "for-range-sequences"),
        ("S04-T1-B", "enumerate-zip"),
        ("S04-T2-A", "while-sentinels"),
        ("S04-T2-B", "break-continue-guards"),
        ("S04-T3-A", "counters-accumulators"),
        ("S04-T3-B", "comprehensions"),
        ("S04-T4-A", "state-tracing"),
        ("S04-T4-B", "complexity-off-by-one"),
    ]
    s05_slugs = [
        ("S05-T1-A", "def-call-return"),
        ("S05-T1-B", "params-safe-defaults"),
        ("S05-T2-A", "prepost-docstrings"),
        ("S05-T2-B", "type-hints-domain-errors"),
        ("S05-T3-A", "small-functions-compose"),
        ("S05-T3-B", "purity-io-injection"),
        ("S05-T4-A", "legb-closures"),
        ("S05-T4-B", "examples-refactor"),
    ]

    def progress(section, section_id, lane, slugs, log, meta_updates, youdo_note):
        items = [{"id": k, "status": v, "notes": "python3 executed; output embedded"} for k, v in log.items()]
        return {
            "version": "3.2",
            "section": section,
            "section_id": section_id,
            "phase": "PHASE_4_COMPLETE",
            "lane": lane,
            "generated_at": now,
            "prompt_version": "3.2",
            "authority": "PARALLEL_PRODUCTION author agent — does not mark section passed; does not edit checkpoint/ledger/seed/s01-s03/orchestration",
            "preamble": {
                "objective": f"Retarget {section_id} section TS to V3 roadmap; author full packages for all 8 subtopics (T1–T4).",
                "scope_in": [
                    f"src/lib/course/sections/{'s04-functions-modules.ts' if section=='S04' else 's05-oop.ts'}",
                    f"course-state/{section.lower()}_phase4_progress.json",
                    f"course-state/lanes/{lane}.status.json",
                ],
                "scope_out": [
                    "checkpoint.json",
                    "section_ledger.json",
                    "issue_registry.json",
                    "parallel_orchestration.json",
                    "s01-setup.ts",
                    "s02-basics.ts",
                    "s03-data-structures.ts",
                    "prisma/seed.ts",
                    "PHASE 5 exam A/B/C stems",
                    "section_passed",
                ],
            },
            "meta_updates": meta_updates,
            "subtopics_authored": subtopics_block(section, slugs),
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
            "execution_log": {
                "runtime": "python3 local",
                "executed_at": now[:10],
                "UNVERIFIED": [],
                "items": items,
            },
            "youDo": youdo_note,
            "notes": "Español peruano; datos sintéticos; platform id preserved.",
        }

    p04 = progress(
        "S04",
        "functions-modules",
        "LANE-S04-S05-P4",
        s04_slugs,
        s04_log,
        {
            "id": "functions-modules",
            "index": 4,
            "title": "Iteración y resúmenes transaccionales",
            "shortTitle": "Iteración & Resúmenes",
            "tagline": "for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A",
            "estimatedHours": 8,
            "learningOutcomes": 8,
            "youDo": "Client Intake & Data Quality Script (CP-N1-A complete)",
            "icon": "Repeat",
            "legacy_note": "decorators/pathlib packaging demoted; target is iteration + CP-N1-A batch script",
        },
        "Client Intake & Data Quality Script — multi-record, rates, raw preserved",
    )
    p05 = progress(
        "S05",
        "oop",
        "LANE-S04-S05-P4",
        s05_slugs,
        s05_log,
        {
            "id": "oop",
            "index": 5,
            "title": "Funciones, contratos y descomposición",
            "shortTitle": "Funciones & Contratos",
            "tagline": "def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B",
            "estimatedHours": 8,
            "learningOutcomes": 8,
            "youDo": "Normalizadores puros (inicio CP-N1-B)",
            "icon": "FunctionSquare",
            "legacy_note": "OOP classes/inheritance demoted to S11; target is pure normalizers",
        },
        "Pure normalizers name/email/phone/address — CP-N1-B start",
    )

    (STATE / "s04_phase4_progress.json").write_text(
        json.dumps(p04, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s05_phase4_progress.json").write_text(
        json.dumps(p05, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lane = {
        "lane_id": "LANE-S04-S05-P4",
        "parent_lane": None,
        "sections": ["S04", "S05"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S04": {
            "section_id": "functions-modules",
            "subtopics_done": [s[0] for s in s04_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
        },
        "S05": {
            "section_id": "oop",
            "subtopics_done": [s[0] for s in s05_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
        },
        "exercises_done": 48,
        "exercises_target": 48,
        "demos_done": 16,
        "demos_target": 16,
        "files_changed": [
            "src/lib/course/sections/s04-functions-modules.ts",
            "src/lib/course/sections/s05-oop.ts",
            "course-state/s04_phase4_progress.json",
            "course-state/s05_phase4_progress.json",
            "course-state/lanes/LANE-S04-S05-P4.status.json",
        ],
        "execution_summary": (
            "Retargeted S04 to V3 Iteración y resúmenes (CP-N1-A complete) and S05 to V3 Funciones/"
            "contratos (CP-N1-B start). Full packages 8 subtopics each (theory+demo+E1/E2/E3, 2 hints). "
            "Platform ids functions-modules / oop preserved. All demos/solutions executed with python3; "
            "UNVERIFIED=[]. Español peruano; synthetic data only."
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
            "prisma/seed.ts",
        ],
        "next_action": "PHASE 5 exam banks for functions-modules and oop V3 slugs. Do not mark S04/S05 passed from this lane.",
    }
    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / "LANE-S04-S05-P4.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print("S04 verified:", len(s04_log), "S05 verified:", len(s05_log))


if __name__ == "__main__":
    main()
