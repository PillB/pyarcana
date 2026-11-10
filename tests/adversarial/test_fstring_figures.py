"""Proposal 05 (owner-approved 2026-11-10): f-string carries its own heading and five figures.

The S12 counterexample gave `f-string` its first worked example, which made it load-bearing (used
in 11 sections) and so owed a subtopic heading and five figures (D3, D5). This pins the repair: the
concept is L3 with 5/5 figures, each of the five figures is attached to the block that shows it and
exists in the archetype data, and each caption names the f-string it draws.
"""

from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(ROOT / "scripts"))

import test_concept_depth_ratchets as ratchets  # noqa: E402

# figure id -> (section module, export, heading of the block that carries it)
FIGURES = {
    "S02-fstring-parts": ("s02-basics", "section02", "Construir un mensaje con una f-string"),
    "S02-capture-interpret-report": ("s02-basics", "section02", "Entrada/salida: input, print y f-strings"),
    "S09-fstring-in-raise": ("s09-exceptions-logging", "section09",
                             "Contraejemplo: la excepción filtra lo que el log enmascaró"),
    "S11-fstring-dataclass-repr": ("s11-oop-domain", "section11",
                                   "Contraejemplo: el repr de la dataclass escribe datos personales en el log"),
    "S12-fstring-sql": ("s12-apis-sql-geo", "section12", "Contraejemplo: un id con SQL devuelve todas las filas"),
}

DUMP = """
import {{ FLOW_FIGURES }} from './src/components/course/figures/data/flows.ts';
import {{ MISC_FIGURES }} from './src/components/course/figures/data/misc.ts';
const out = {{ data: Object.keys({{ ...FLOW_FIGURES, ...MISC_FIGURES }}), blocks: {{}} }};
{imports}
console.log(JSON.stringify(out));
"""


def attached() -> dict:
    imports = []
    for i, (mod, export, _) in enumerate(sorted({v for v in FIGURES.values()})):
        imports.append(
            f"const m{i} = await import('./src/lib/course/sections/{mod}.ts');"
            f" for (const t of m{i}.{export}.theory) if (t.figure) out.blocks[t.figure.id] ="
            f" {{ heading: t.heading, caption: t.figure.caption, alt: t.figure.alt }};"
        )
    done = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", DUMP.format(imports="\n".join(imports))],
        cwd=ROOT, capture_output=True, text=True, timeout=300,
    )
    if done.returncode != 0:
        raise RuntimeError("could not read the sections through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def missing_figures(found: dict, expected: dict) -> list[str]:
    """Expected figures that are absent from the data, attached elsewhere, or silent on f-string."""
    problems = []
    for fid, (_, _, heading) in expected.items():
        block = found["blocks"].get(fid)
        if fid not in found["data"]:
            problems.append(f"{fid}: no archetype data")
        if block is None:
            problems.append(f"{fid}: not attached to any block")
        elif block["heading"] != heading:
            problems.append(f"{fid}: attached to {block['heading']!r}")
        elif "f-string" not in block["caption"] + block["alt"]:
            problems.append(f"{fid}: caption and alt never name the f-string")
    return problems


class FStringIsTaughtAtDepth(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.found = attached()

    def test_the_five_figures_exist_and_sit_on_their_blocks(self) -> None:
        self.assertEqual(missing_figures(self.found, FIGURES), [])

    def test_f_string_is_l3_with_five_figures(self) -> None:
        c = ratchets.concepts()["f-string"]
        self.assertTrue(c["load_bearing"])
        self.assertEqual((c["depth"], c["figure_count"], c["figure_gap"]), ("L3", 5, 0))

    def test_detector_reports_a_lost_figure(self) -> None:
        broken = {"data": self.found["data"], "blocks": dict(self.found["blocks"])}
        del broken["blocks"]["S12-fstring-sql"]
        self.assertEqual(missing_figures(broken, FIGURES), ["S12-fstring-sql: not attached to any block"])
        moved = {"data": [], "blocks": {}}
        self.assertEqual(len(missing_figures(moved, FIGURES)), 10)


if __name__ == "__main__":
    unittest.main()
