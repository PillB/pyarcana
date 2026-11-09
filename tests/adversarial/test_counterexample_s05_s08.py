"""Proposal 04 counterexamples for S05-S08 (owner-approved 2026-11-09).

Every cluster id from the S05-S08 draft is located by its heading (or demo id) in the TypeScript section
objects, read through `node --import tsx`, never by index. A python block must open with a `# Error` line,
contain `# Corrección`, and print the pinned output; the effect line must appear in that output. Shell
transcripts are checked for presence and key lines only. The negative controls prove the checker fails on
a block with no `# Corrección` and on a stale pin, so a green result cannot come from a probe that never ran.
"""
from __future__ import annotations

import json
import subprocess
import sys
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
S05 = SECTIONS / "s05-functions-contracts.ts"
S06 = SECTIONS / "s06-collections.ts"
S07 = SECTIONS / "s07-text-unicode-regex.ts"
S08 = SECTIONS / "s08-files-ingestion.ts"

NODE_DUMP = """
import {{ section05 }} from {s05!r};
import {{ section06 }} from {s06!r};
import {{ section07 }} from {s07!r};
import {{ section08 }} from {s08!r};
const theory = (s) => s.theory.map((t) => ({{ heading: t.heading ?? null, subtopicId: t.subtopicId ?? null,
  language: t.code?.language ?? null, code: t.code?.code ?? null, output: t.code?.output ?? null }}));
const steps = (xs) => (xs || []).map((x) => ({{ id: x.id ?? null, demoId: x.demoId ?? null,
  preamble: x.preamble ?? '', code: x.code?.code ?? null, output: x.code?.output ?? null, starter: x.starterCode?.code ?? null,
  solution: x.solutionCode?.code ?? null, solutionOutput: x.solutionCode?.output ?? null }}));
const pick = (s) => ({{ theory: theory(s), iDo: steps(s.iDo?.steps), weDo: steps(s.weDo?.steps) }});
console.log(JSON.stringify({{ s05: pick(section05), s06: pick(section06), s07: pick(section07), s08: pick(section08) }}));
"""

PROBE = r'''
import contextlib, io, json, sys
req = json.loads(sys.stdin.read())
ns, buf, error = {"__name__": "__main__"}, io.StringIO(), None
with contextlib.redirect_stdout(buf):
    try:
        exec(compile(req["code"], "snippet", "exec"), ns)
    except Exception as exc:
        error = type(exc).__name__
print(json.dumps({"stdout": buf.getvalue(), "error": error}))
'''


@lru_cache(maxsize=1)
def sections() -> dict:
    script = NODE_DUMP.format(s05=str(S05), s06=str(S06), s07=str(S07), s08=str(S08))
    done = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", script],
        cwd=ROOT, capture_output=True, text=True, timeout=300,
    )
    if done.returncode != 0:
        raise RuntimeError("could not read the sections through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def run_python(code: str) -> dict:
    done = subprocess.run(
        [sys.executable, "-I", "-c", PROBE], input=json.dumps({"code": code}),
        capture_output=True, text=True, timeout=60, cwd=ROOT,
    )
    if done.returncode != 0:
        raise RuntimeError("probe process failed: " + done.stderr[-800:])
    return json.loads(done.stdout)


def theory_block(section: str, heading: str) -> dict:
    found = [t for t in sections()[section]["theory"] if t["heading"] == heading]
    if len(found) != 1:
        raise AssertionError(f"expected one {section} theory block titled {heading!r}, found {len(found)}")
    return found[0]


def demo_block(section: str, demo_id: str) -> dict:
    found = [s for s in sections()[section]["iDo"] if s["demoId"] == demo_id]
    if len(found) != 1:
        raise AssertionError(f"expected one {section} demo {demo_id!r}, found {len(found)}")
    return found[0]


def we_do(section: str, step_id: str) -> dict:
    found = [w for w in sections()[section]["weDo"] if w["id"] == step_id]
    if len(found) != 1:
        raise AssertionError(f"expected one {section} We Do step {step_id!r}, found {len(found)}")
    return found[0]


def run_pinned(code: str, pinned: str) -> list[str]:
    """Problems with a solution or demo: it runs without error and prints exactly its pinned output."""
    out = run_python(code)
    problems = [] if not out["error"] else [f"raised {out['error']}"]
    if out["stdout"].rstrip() != pinned.rstrip():
        problems.append(f"stdout {out['stdout']!r} differs from pin {pinned!r}")
    return problems


def counterexample_problems(code: str, pinned: str, keys: list[str], code_keys: list[str] = ()) -> list[str]:
    """Problems with a python counterexample: returns [] when it is well formed and pinned.

    `keys` must appear in the printed output. `code_keys` must appear in the code text, for an Error
    half that is commented because the concept (try/except, S09) is not taught yet."""
    problems = []
    lines = code.split("\n")
    error_at = next((i for i, line in enumerate(lines) if line.startswith("# Error")), None)
    fix_at = next((i for i, line in enumerate(lines) if line.startswith("# Corrección")), None)
    if error_at is None:
        problems.append("no '# Error' half")
    if fix_at is None:
        problems.append("no '# Corrección' half")
    if error_at is not None and fix_at is not None and error_at > fix_at:
        problems.append("'# Corrección' comes before '# Error'")
    out = run_python(code)
    if out["error"]:
        problems.append(f"snippet raised {out['error']}")
    if out["stdout"].rstrip() != pinned.rstrip():
        problems.append(f"stdout {out['stdout']!r} differs from pin {pinned!r}")
    for key in keys:
        if key not in out["stdout"]:
            problems.append(f"effect line {key!r} missing from the output")
    for key in code_keys:
        if key not in code:
            problems.append(f"commented effect {key!r} missing from the code")
    return problems


class CounterexampleContract(unittest.TestCase):
    """One method per approved S05-S08 cluster that adds or changes a python counterexample."""

    def check_theory(self, section: str, heading: str, keys: list[str]) -> None:
        block = theory_block(section, heading)
        self.assertIsNone(block["subtopicId"], "a supporting Contraejemplo block carries no subtopicId")
        self.assertEqual(block["language"], "python")
        self.assertEqual(counterexample_problems(block["code"], block["output"], keys), [])

    def test_S05_KW_keyword_arguments(self) -> None:
        self.check_theory("s05", "Contraejemplo: argumentos intercambiados sin aviso",
                          ["ana@example.com <Ana Ruiz>", "+51CL", "+56987654321"])

    def test_S05_IDEM_idempotent_normalizer(self) -> None:
        self.check_theory("s05", "Contraejemplo: un normalizador que sigue transformando",
                          ["corrida 3 → +515151999000111"])

    def test_S05_HINT_annotation_returns_none(self) -> None:
        self.check_theory("s05", "Contraejemplo: una anotación que promete texto y devuelve None",
                          ["None NoneType"])

    def test_S05_PRINT_print_is_not_return(self) -> None:
        self.check_theory("s05", "Contraejemplo: imprimir no es devolver",
                          ["el caller recibió: None"])

    def test_S05_DUP_copied_rule(self) -> None:
        self.check_theory("s05", "Contraejemplo: una copia de la regla no recibe la corrección",
                          ["'Ana |  ana@example.com '"])

    def test_S05_LEGB_error_half_reads_global(self) -> None:
        block = theory_block("s05", "LEGB y closures básicos")
        self.assertEqual(counterexample_problems(block["code"], block["output"], ["Cliente: Revisar correo"]), [])

    def test_S05_RAISE_commented_error_in_demo(self) -> None:
        demo = demo_block("s05", "S05-T2-B-DEMO")
        self.assertEqual(counterexample_problems(demo["code"], demo["output"],
                                                 [], ["ValueError: se esperan 9 dígitos: 123"]), [])

    def test_S05_ASSERT_transcript_shows_minus_O(self) -> None:
        block = theory_block("s05", "Contraejemplo: un assert desaparece con -O")
        self.assertEqual(block["language"], "bash")
        for key in ["AssertionError: monto negativo", "$ python -O valida.py", "aceptado: -50",
                    "$ python -O valida_ok.py", "ValueError: monto negativo"]:
            self.assertIn(key, block["code"])
        self.assertIsNone(block["subtopicId"])


class S06S07S08Contract(unittest.TestCase):
    """Approved S06, S07 and S08 clusters: blocks, starters and pins."""

    def check_theory(self, section: str, heading: str, keys: list[str], code_keys: list[str] = (),
                     subtopic_free: bool = True) -> None:
        block = theory_block(section, heading)
        if subtopic_free:
            self.assertIsNone(block["subtopicId"], "a supporting Contraejemplo block carries no subtopicId")
        self.assertEqual(block["language"], "python")
        self.assertEqual(counterexample_problems(block["code"], block["output"], keys, code_keys), [])

    # S06
    def test_S06_FALSY_if_not_mixes_missing_and_empty(self) -> None:
        self.check_theory("s06", "Contraejemplo: if not mezcla ausente y vacío",
                          ["missing con if not: ['C002', 'C003']", "empty: ['C003']"])

    def test_S06_ULTIMO_index_drops_repeated_id(self) -> None:
        self.check_theory("s06", "Contraejemplo: un índice por ID pierde la fila repetida",
                          ["C001 → Centro", "repetidos: ['C001']"])

    def test_S06_ORDEN_set_and_dict_order_are_not_a_contract(self) -> None:
        self.check_theory("s06", "Contraejemplo: el orden de un set no es un contrato",
                          ["set: [1, 10, 5]", "mismo texto: False", "mismo texto con sort_keys: True"])

    def test_S06_KEYERROR_commented_error_then_guarded_loop(self) -> None:
        self.check_theory("s06", "Contraejemplo: d[k] sin revisar corta el recorrido",
                          ["C002 review: falta txs"], ["KeyError: 'txs'"])

    def test_S06_ALIAS_starter_shows_the_alias_defect(self) -> None:
        step = we_do("s06", "S06-T1-A-E2")
        out = run_python(step["starter"])
        self.assertFalse(out["error"], out)
        self.assertIn("headers ['id', 'monto', 'canal']", out["stdout"])
        self.assertEqual(run_pinned(step["solution"], step["solutionOutput"]), [])

    def test_S06_wording_names_no_insertion_order_for_a_set(self) -> None:
        step = we_do("s06", "S06-T2-B-E1")
        self.assertIn("un set no tiene orden", step["preamble"])
        self.assertNotIn("orden de inserción del set", step["preamble"])

    # S07
    def test_S07_AUTOMERGE_partial_score_keeps_both_records(self) -> None:
        self.check_theory("s07", "Contraejemplo: fusionar por score borra un registro",
                          ["tras auto-fusión: ['CLI-0001']", "con review: ['CLI-0001', 'CLI-0002']"])

    def test_S07_FIND_zero_is_false(self) -> None:
        self.check_theory("s07", "Contraejemplo: find usado como booleano",
                          ["con find: Av. no aparece", "con find: Jr. aparece"])

    def test_S07_RAW_raw_stays_intact(self) -> None:
        self.check_theory("s07", "Contraejemplo: sobrescribir raw destruye el original",
                          ["la política v2 parte de: María Cruz"])

    def test_S07_REGEX_LITERAL_dot_matches_any_character(self) -> None:
        self.check_theory("s07", "Contraejemplo: el punto de un patrón no es un punto",
                          ["Avenidaa. Sur 45"])

    def test_S07_REGEX_NOMBRES_particles_are_review(self) -> None:
        self.check_theory("s07", "Contraejemplo: un patrón de dos palabras rechaza partículas",
                          ["María del Carmen Quispe → None", "María del Carmen Quispe Ríos → {'raw'"])

    def test_S07_UMBRAL_threshold_declared_before_scores(self) -> None:
        self.check_theory("s07", "Contraejemplo: un umbral elegido después de ver los scores",
                          ["nuevo con umbral a posteriori: exact", "nuevo con umbral declarado: review"])

    def test_S07_T3A_E2_starter_keeps_the_backslashes(self) -> None:
        step = we_do("s07", "S07-T3-A-E2")
        self.assertIn(r"(\w+) (\w+)", step["starter"])

    # S08
    def test_S08_TMPFIJO_fixed_tmp_survives_only_as_the_counterexample(self) -> None:
        self.check_theory("s08", "Contraejemplo: un .tmp fijo mezcla dos escrituras",
                          ["error: publicado = BBAA", "corrección: publicado = BB"],
                          subtopic_free=False)  # S08-TMPFIJO keeps its existing S08-T1-B tag (fixed elsewhere)

    def test_S08_DIRECT_direct_write_leaves_a_truncated_file(self) -> None:
        self.check_theory("s08", "Contraejemplo: escribir directo sobre clean.csv",
                          ["el consumidor lee: 'id,nombre\\nC001,'"])

    def test_S08_FIELDNAMES_positional_values_shift_columns(self) -> None:
        self.check_theory("s08", "Contraejemplo: columnas por posición", ["20.00,C002,Luis"])

    def test_S08_PARECE_decimal_accepts_nan(self) -> None:
        self.check_theory("s08", "Contraejemplo: “parece número” no es número", ["total: NaN"])

    def test_S08_ZIP_zip_drops_columns_silently(self) -> None:
        self.check_theory("s08", "Contraejemplo: zip descarta columnas sin aviso",
                          ["{'id': 'C002', 'nombre': 'Luis'}", "'reason': 'col_count'"])

    def test_S08_FLOAT_json_number_loses_decimal_exactness(self) -> None:
        self.check_theory("s08", "Contraejemplo: un monto JSON como número pierde el cero",
                          ["float: 0.1 + 0.2 = 0.30000000000000004 | igual a 0.30: False"])

    def test_S08_DEFAULTSTR_default_str_hides_the_set(self) -> None:
        self.check_theory("s08", "Contraejemplo: default=str convierte sin avisar",
                          ["tags al releer: \"{'vip'}\""])

    def test_S08_MOJIBAKE_wrong_codec_changes_the_text(self) -> None:
        self.check_theory("s08", "Contraejemplo: leer UTF-8 con otra codificación", ["C001;MuÃ±oz"])

    def test_S08_PATH_pasted_text_drops_the_separator(self) -> None:
        self.check_theory("s08", "Contraejemplo: pegar rutas como texto",
                          ["dataclients.csv", "data/clients.csv | data\\clients.csv"])

    def test_S08_NULL_get_cannot_tell_null_from_missing(self) -> None:
        self.check_theory("s08", "Contraejemplo: get no distingue null de clave ausente",
                          ["indistinguibles: True", "True False"])

    def test_S08_RUNID_fixed_backup_name_overwrites_the_previous_run(self) -> None:
        self.check_theory("s08", "Contraejemplo: un respaldo con nombre fijo pisa la corrida anterior",
                          ["input.bak: 'id\\nC1\\nC2\\n'", "run-001 'id\\nC1\\n'"])

    def test_S08_HASH_copied_hex_goes_stale(self) -> None:
        self.check_theory("s08", "Contraejemplo: un hex copiado deja de coincidir",
                          ["coincide con el hex copiado: False", "coincide: True"])

    def test_S08_HASH_transcript_shows_the_hash_seed(self) -> None:
        block = theory_block("s08", "Contraejemplo: hash() cambia entre procesos")
        self.assertEqual(block["language"], "bash")
        for key in ["PYTHONHASHSEED=1 python -c", "PYTHONHASHSEED=2 python -c",
                    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"]:
            self.assertIn(key, block["code"])
        self.assertIsNone(block["subtopicId"])

    def test_S08_T4A_DEMO_runs_to_its_pin_with_a_run_scoped_backup(self) -> None:
        demo = demo_block("s08", "S08-T4-A-DEMO")
        self.assertEqual(run_pinned(demo["code"], demo["output"]), [])
        self.assertIn('td / "backups" / run_id / "clients.csv"', demo["code"])
        self.assertNotIn("clients.csv.bak", demo["code"])

    def test_S08_T4A_E2_backup_is_run_scoped(self) -> None:
        step = we_do("s08", "S08-T4-A-E2")
        self.assertEqual(run_pinned(step["solution"], step["solutionOutput"]), [])
        self.assertIn("'backups' / run_id / 'in.csv'", step["solution"])
        self.assertNotIn("in.csv.bak", step["solution"])
        self.assertIn("False", run_python(step["starter"])["stdout"])

    def test_S08_SPLIT_starter_shows_the_split_defect(self) -> None:
        step = we_do("s08", "S08-T2-A-E1")
        self.assertIn('"Pérez', run_python(step["starter"])["stdout"])
        self.assertEqual(run_pinned(step["solution"], step["solutionOutput"]), [])

    def test_S08_JSONSLICE_starter_shows_the_slice_defect(self) -> None:
        step = we_do("s08", "S08-T3-A-E1")
        self.assertIn('"C0', run_python(step["starter"])["stdout"])
        self.assertEqual(run_pinned(step["solution"], step["solutionOutput"]), [])

    def test_S08_RECONCILE_starter_shows_the_true_by_hand_defect(self) -> None:
        step = we_do("s08", "S08-T4-B-E1")
        # the fixture must carry a row the source does not explain (n_in 3, n_clean 2, n_quarantine 0)
        self.assertIn("'name': 'transactions.json', 'sha256': 'def', 'n_in': 3", step["starter"])
        self.assertIn("transactions.json True", run_python(step["starter"])["stdout"])
        self.assertEqual(run_pinned(step["solution"], step["solutionOutput"]), [])


class ControlsProveTheChecker(unittest.TestCase):
    """The checker must fail on a block without a Corrección half and on a stale pin."""

    CODE = "# Error: sin corrección\nprint(1)\n"
    FULL = "# Error: x\nprint(1)\n# Corrección: y\nprint(1)\n"

    def test_block_without_correction_is_reported(self) -> None:
        problems = counterexample_problems(self.CODE, "1\n", [])
        self.assertIn("no '# Corrección' half", problems)

    def test_stale_pin_is_reported(self) -> None:
        problems = counterexample_problems(self.FULL, "2\n2\n", [])
        self.assertTrue(any("differs from pin" in p for p in problems), problems)

    def test_correct_pin_passes(self) -> None:
        self.assertEqual(counterexample_problems(self.FULL, "1\n1\n", []), [])


if __name__ == "__main__":
    unittest.main()
