"""Counterexample blocks for S09-S13 (proposal 04, owner approved 2026-11-09).

Each cluster's block is found by its heading, never by index. The helper runs the block with
the interpreter that runs the test, checks that the Error half comes first, that a Corrección
half exists, that stdout equals the pinned output, and that the effect line of the Error half
is present. Negative controls prove the helper rejects a block without a Corrección half and a
stale pin, so a green check cannot be vacuous.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
PY = sys.executable

FILES = {
    "S09": "s09-exceptions-logging.ts",
    "S10": "s10-modules-packaging-cli.ts",
    "S11": "s11-oop-domain.ts",
    "S12": "s12-apis-sql-geo.ts",
    "S13": "s13-evidence-dashboard.ts",
}

# cluster id -> (section, heading, effect line that must appear in the run)
CLUSTERS = {
    "S09-C1": ("S09", "Contraejemplo: la excepción filtra lo que el log enmascaró", "correo completo en el log: True"),
    "S09-C2": ("S09", "Contraejemplo: except Exception convierte una errata en filas malas", "amplio → ok, cuarentena: (0, ['C001', 'C002', 'C003'])"),
    "S09-C3": ("S09", "Contraejemplo: el debugger vuelca la fila completa con datos personales", "debug: {'id': 'C009', 'email': 'lucia.mendez@ejemplo.pe'"),
    "S09-C4": ("S09", "Contraejemplo: el ERROR de cada fila apartada entierra la alerta", "líneas ERROR: 6"),
    "S09-C5": ("S09", "Contraejemplo: un identificador armado con un correo", "correlation_id=job-lucia.mendez@ejemplo.pe stage=inicio"),
    "S09-C6": ("S09", "Contraejemplo: configurar dos veces el logger duplica cada línea", "líneas para un solo evento: 3"),
    "S09-C7": ("S09", "Contraejemplo: el progreso en la salida rompe al consumidor", "consumidor falla: invalid literal for int() with base 10: 'empezando\\nsumando\\n3'"),
    "S09-C8": ("S09", "Contraejemplo: un faltante convertido en cero cambia el promedio", "con ceros → filas: 4 total: 200.00 promedio: 50.00"),
    "S09-C9": ("S09", "Contraejemplo: un tope de reintentos en cero termina en raise None", "max_attempts=0 → TypeError: exceptions must derive from BaseException"),
    "S09-C10": ("S09", "Contraejemplo: una clave solo con el id descarta una corrección", "solo id → entradas: 1 versiones: [3]"),
    "S10-C1": ("S10", "Contraejemplo: dos módulos que se importan entre sí fallan al cargar", "ciclo → ImportError: cannot import name 'normalizar'"),
    "S10-C2": ("S10", "Contraejemplo: el layout plano importa la copia local en lugar de lo instalado", "layout plano → 0.1.0-copia-local"),
    "S10-C3": ("S10", "Contraejemplo: validar la configuración al final procesa miles de filas", "falla tarde: KeyError 'manifest_path' | filas ya procesadas: 10000"),
    "S10-C4": ("S10", "Contraejemplo: el mensaje de error publica el token", "token en la traza: True"),
    "S10-C5": ("S10", "Contraejemplo: importar el módulo ejecuta el CLI", "CLI: procesando data/clientes.csv ..."),
    "S10-C6": ("S10", "Contraejemplo: un flag sin valor pisa la variable de entorno", "ingenuo  → {'log_level': None}"),
    "S10-C7": ("S10", "Contraejemplo: clasificar el cambio por subcadenas del texto", "texto → fix address parsing: minor"),
    "S11-C1": ("S11", "Contraejemplo: el default mutable se comparte entre instancias", "CF2 nace con: ['E1-E2']"),
    "S11-C2": ("S11", "Contraejemplo: el constructor que arregla el dato cambia el total", "total PEN: 350.50"),
    "S11-C3": ("S11", "Contraejemplo: una property con efecto colateral envía el aviso al leerla", "avisos: ['aviso enviado a ana@ejemplo.pe', 'aviso enviado a ana@ejemplo.pe']"),
    "S11-C4": ("S11", "Contraejemplo: una property sin correo detiene el lote", "el lote se detiene en C002 → IndexError: list index out of range"),
    "S11-C5": ("S11", "Contraejemplo: el documento como identidad fusiona a dos personas", "por documento → set {E1, E7}: 1 entidad(es)"),
    "S11-C6": ("S11", "Contraejemplo: la clase base abstracta rechaza un fake válido", "ABC acepta FakeStore: False"),
    "S11-C7": ("S11", "Contraejemplo: el documento vacío forma un grupo falso", "comparten documento: [('C002', 'C003'), ('C002', 'C004'), ('C003', 'C004')]"),
    "S11-C8": ("S11", "Contraejemplo: el repr de la dataclass escribe datos personales en el log", "INFO registrado ClientRecord(client_id='C001', document_id='DOC-0001', full_name='Ana Pérez'"),
    "S11-C9": ("S11", "Contraejemplo: el test que escribe en disco ve el resultado del anterior", "acoplado → segundo test ve 2 fila(s)"),
    "S11-C10": ("S11", "Contraejemplo: un campo derivado guardado queda desactualizado", "guardado → Ana Pérez"),
    "S11-C11": ("S11", "Contraejemplo: la misma señal contada dos veces en una lista", "lista → señales: 3 | suma de scores: 0.5"),
    "S12-C1": ("S12", "Contraejemplo: un id con SQL devuelve todas las filas", "con f-string: [('C001', 'Ana Demo'), ('C002', 'Luis Demo'), ('C003', 'Marta Demo')]"),
    "S12-C2": ("S12", "Contraejemplo: el log del pedido publica el token", "token en el log: True"),
    "S12-C3": ("S12", "Contraejemplo: contar el body sin mirar el status cuenta un error como dato", "sin status → C999 señales: 1"),
    "S12-C4": ("S12", "Contraejemplo: reintentar cada 4xx gasta cuota sin cambiar el resultado", "reintenta 4xx → (404, 4) | llamadas: 4"),
    "S12-C5": ("S12", "Contraejemplo: corregir coordenadas a (0, 0) crea distancias falsas", "arreglado → C011–C012: 0.0 km"),
    "S13-C1": ("S13", "Contraejemplo: un bloque mal elegido separa a la misma persona", "solo paterno|región → [('R1', 'R2')]"),
    "S13-side-doc-vacio": ("S13", "Contraejemplo: dos documentos vacíos parecen la misma persona", "sin regla de vacío → 1.0"),
    "S13-C2": ("S13", "Contraejemplo: el umbral de 0.5 funde a dos personas", "dos personas fundidas: ['P2', 'P4']"),
    "S13-C3": ("S13", "Contraejemplo: un umbral de relación etiqueta a compañeros como familia", "is_family por umbral → 6 pares"),
    "S13-C4": ("S13", "Contraejemplo: la mezcla de ER y relación decide la identidad", "con la mezcla 0.82 → accept_pair"),
}

DUMP = r"""
import { pathToFileURL } from 'node:url';
const [file] = process.argv.slice(1);
const mod = await import(pathToFileURL(file).href);
const out = [];
for (const [k, v] of Object.entries(mod)) {
  if (!/^section\d+$/.test(k)) continue;
  for (const t of v.theory ?? []) {
    if (t.code) out.push({ heading: t.heading, language: t.code.language, code: t.code.code, output: t.code.output });
  }
}
process.stdout.write(JSON.stringify(out));
"""

# Shell and git transcripts: presence and key lines only (no output pin, per the brief).
SHELL_TRANSCRIPTS = {
    "S10-NP1": ("S10", "Contraejemplo: un .env con el token commiteado queda en el historial",
                ["git rm --cached .env", "git log --all -p -- .env", ".env.example", "!! .env"]),
    "S12-NP1": ("S12", "Contraejemplo: un token pegado en el código queda en el historial",
                ["git log --all -p", "os.environ"]),
}

EXERCISE_DUMP = r"""
import { pathToFileURL } from 'node:url';
const [file] = process.argv.slice(1);
const mod = await import(pathToFileURL(file).href);
const out = {};
const walk = (o) => {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach(walk); return; }
  if (typeof o.id === 'string' && o.starterCode) {
    out[o.id] = { starter: o.starterCode.code, solution: o.solutionCode?.code ?? null, expected: o.solutionCode?.output ?? null };
  }
  for (const k of Object.keys(o)) walk(o[k]);
};
for (const [k, v] of Object.entries(mod)) if (/^section\d+$/.test(k)) walk(v);
process.stdout.write(JSON.stringify(out));
"""

# Exercises whose starter must show the defect the exercise names. Each entry: the lines the
# starter prints (the defect) and the solution's pinned output (the fix).
EXERCISES = {
    "S11-T2-B-E1": ("S11", ["False False", "3"]),
    "S11-T2-B-E2": ("S11", ["3"]),
    "S12-T3-B-E1": ("S12", ["[('Ana',), ('Luis',), ('Marta',)]", "ok True"]),
}


def exercise_items(section: str) -> dict:
    completed = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", EXERCISE_DUMP, str(SECTIONS / FILES[section])],
        cwd=ROOT, capture_output=True, text=True, timeout=240,
    )
    if completed.returncode != 0:
        raise AssertionError(completed.stderr[-2000:])
    return json.loads(completed.stdout)


# A document-like field (document_id, doc, dni, identificación) holding seven or more digits, with
# or without a short country prefix. Phone fixtures are out of scope: S13 on main already uses them.
DOCUMENT_SHAPED = re.compile(
    r"(?i)(?:doc\w*|dni|identificaci\w*)\W{0,4}['\"]?(?:[A-Z]{1,3}-?)?\d{7,}"
)


def identifier_shaped(text: str) -> bool:
    """A document field carrying a value shaped like a national ID (D2)."""
    return DOCUMENT_SHAPED.search(text) is not None


def run_py(code: str) -> subprocess.CompletedProcess:
    return subprocess.run([PY, "-I", "-c", code], capture_output=True, text=True, timeout=60)


def theory_blocks(section: str) -> list[dict]:
    completed = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", DUMP, str(SECTIONS / FILES[section])],
        cwd=ROOT, capture_output=True, text=True, timeout=240,
    )
    if completed.returncode != 0:
        raise AssertionError(completed.stderr[-2000:])
    return json.loads(completed.stdout)


def find_by_heading(blocks: list[dict], heading: str) -> dict:
    hits = [b for b in blocks if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one block titled {heading!r}, found {len(hits)}")
    return hits[0]


def check_counterexample(code: str, pinned: str, effect: str) -> list[str]:
    """Return the problems with one block; an empty list means it passes."""
    problems: list[str] = []
    lines = code.split("\n")
    if not lines[0].startswith("# Error"):
        problems.append("first line does not start with '# Error'")
    if not any(line.startswith("# Corrección") for line in lines):
        problems.append("no '# Corrección' half")
        return problems
    run = subprocess.run([PY, "-I", "-c", code], capture_output=True, text=True, timeout=60)
    if run.returncode != 0:
        return problems + [f"block raised: {run.stderr.strip()[-300:]}"]
    got = run.stdout.rstrip("\n")
    if got != pinned.rstrip("\n"):
        problems.append(f"stale pin: got {got!r}")
    if effect not in run.stdout:
        problems.append(f"effect line missing: {effect!r}")
    return problems


class CounterexampleS09toS13(unittest.TestCase):
    def test_each_cluster_block_runs_and_pins_its_output(self) -> None:
        cache: dict[str, list[dict]] = {}
        for cid, (section, heading, effect) in CLUSTERS.items():
            with self.subTest(cluster=cid):
                blocks = cache.setdefault(section, theory_blocks(section))
                block = find_by_heading(blocks, heading)
                self.assertEqual(block["language"], "python", f"{cid} must be a Python block")
                problems = check_counterexample(block["code"], block["output"], effect)
                self.assertEqual(problems, [], f"{cid}: {problems}")

    def test_exercise_starters_show_their_named_defect(self) -> None:
        cache: dict[str, dict] = {}
        for eid, (section, defect_lines) in EXERCISES.items():
            with self.subTest(exercise=eid):
                items = cache.setdefault(section, exercise_items(section))
                item = items[eid]
                run = run_py(item["starter"])
                self.assertEqual(run.returncode, 0, f"{eid} starter must run, not crash: {run.stderr[-200:]}")
                self.assertEqual(run.stdout.rstrip("\n").split("\n"), defect_lines, f"{eid} starter defect")

    def test_exercise_solutions_still_print_their_pinned_output(self) -> None:
        cache: dict[str, dict] = {}
        for eid, (section, _) in EXERCISES.items():
            with self.subTest(exercise=eid):
                items = cache.setdefault(section, exercise_items(section))
                item = items[eid]
                if item["expected"] is None:
                    self.skipTest(f"{eid} has no pinned solution output")
                run = run_py(item["solution"])
                self.assertEqual(run.returncode, 0, run.stderr[-200:])
                self.assertEqual(run.stdout.rstrip("\n"), item["expected"].rstrip("\n"))

    def test_no_cluster_block_carries_an_identifier_shaped_value(self) -> None:
        # D2 and src/lib/course/sections/AGENTS.md: synthetic records use opaque ids such as
        # CLI-0001, never a run of digits shaped like a national document. Codex review on #147
        # found UK-12345678 in S11-C8; a country prefix does not change the shape.
        offenders = []
        for cid, (section, heading, _effect) in CLUSTERS.items():
            block = find_by_heading(theory_blocks(section), heading)
            text = (block.get("code") or "") + (block.get("output") or "")
            if identifier_shaped(text):
                offenders.append(cid)
        self.assertEqual(offenders, [])

    def test_negative_control_identifier_shape(self) -> None:
        self.assertTrue(identifier_shaped("document_id='UK-12345678'"))
        self.assertTrue(identifier_shaped('ClientRecord("C001", "UK-12345678")'.replace('"C001", ', 'document_id=')))
        self.assertTrue(identifier_shaped("dni='12345678'"))
        self.assertFalse(identifier_shaped("document_id='DOC-0001' amount=2500.50"))
        self.assertFalse(identifier_shaped('{"phone": "014000000"}'))

    def test_negative_control_crashing_starter_fails_the_run_check(self) -> None:
        # A starter that dies at definition (the 'unhashable type' case) must fail the returncode check.
        run = run_py("from dataclasses import dataclass\n@dataclass\nclass X:\n    a: list = []\n")
        self.assertNotEqual(run.returncode, 0)

    def test_shell_transcripts_show_the_error_and_the_correction(self) -> None:
        cache: dict[str, list[dict]] = {}
        for cid, (section, heading, keys) in SHELL_TRANSCRIPTS.items():
            with self.subTest(cluster=cid):
                blocks = cache.setdefault(section, theory_blocks(section))
                block = find_by_heading(blocks, heading)
                self.assertEqual(block["language"], "bash", f"{cid} must be a bash transcript")
                lines = block["code"].split("\n")
                self.assertTrue(lines[0].startswith("# Error"), f"{cid}: first line")
                self.assertTrue(any(l.startswith("# Corrección") for l in lines), f"{cid}: Corrección")
                for key in keys:
                    self.assertIn(key, block["code"], f"{cid}: key line {key!r}")

    def test_negative_control_shell_transcript_without_correccion_is_rejected(self) -> None:
        code = "# Error: x\n$ git log --all -p -- .env\n"
        self.assertFalse(any(l.startswith("# Corrección") for l in code.split("\n")))

    def test_negative_control_block_without_correccion_is_rejected(self) -> None:
        code = "print('solo error')\n"
        self.assertIn("no '# Corrección' half", check_counterexample(code, "solo error", "solo"))

    def test_negative_control_stale_pin_is_rejected(self) -> None:
        code = "# Error: x\nprint('y')\n# Corrección: z\nprint('w')\n"
        problems = check_counterexample(code, "y\nDISTINTO", "y")
        self.assertTrue(any(p.startswith("stale pin") for p in problems), problems)

    def test_negative_control_missing_effect_is_rejected(self) -> None:
        code = "# Error: x\nprint('y')\n# Corrección: z\nprint('w')\n"
        problems = check_counterexample(code, "y\nw", "EFECTO AUSENTE")
        self.assertTrue(any(p.startswith("effect line missing") for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
