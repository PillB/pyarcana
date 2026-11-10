"""Proposal 09 (approved 2026-11-10): the errors a student hits in S03-S13.

Each class pins one section's fixes. Where the fix is a claim about Python, the test recomputes
it on the running interpreter, so a later edit that brings the error back fails here. The
negative controls run the old code and show it still misbehaves, so a pass cannot be vacuous.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"

DUMP = """
import {{ {name} }} from {path!r};
console.log(JSON.stringify({name}));
"""


@lru_cache(maxsize=None)
def section(file: str, name: str) -> dict:
    script = DUMP.format(name=name, path=str(SECTIONS / file))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read the section through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def theory(file: str, name: str, heading: str) -> dict:
    hits = [b for b in section(file, name)["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one block {heading!r}, found {len(hits)}")
    return hits[0]


def demo(file: str, name: str, demo_id: str) -> dict:
    hits = [d for d in _demos(file, name) if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def _demos(file: str, name: str) -> list:
    ido = section(file, name)["iDo"]
    return ido["steps"] if isinstance(ido, dict) else ido


def run(code: str, *flags: str) -> subprocess.CompletedProcess[str]:
    with tempfile.TemporaryDirectory(prefix="p09_") as scratch:
        script = Path(scratch) / "snippet.py"
        script.write_text(code + "\n", encoding="utf-8")
        return subprocess.run([sys.executable, "-I", *flags, str(script)], cwd=scratch,
                              capture_output=True, text=True, timeout=120)


def stdout_of(code: str) -> str:
    done = run(code)
    if done.returncode != 0:
        raise AssertionError("block raised: " + done.stderr[-600:])
    return done.stdout.rstrip("\n")


def text(file: str) -> str:
    return (SECTIONS / file).read_text(encoding="utf-8")


def assert_pinned_output(case: unittest.TestCase, block: dict) -> None:
    code = block["code"]
    case.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))


class S03(unittest.TestCase):
    F, N = "s03-decisions-rules.ts", "section03"

    def test_or_counterexample_runs_as_pinned(self) -> None:
        block = theory(self.F, self.N, "Contraejemplo: `or` con un texto suelto acepta cualquier región")
        self.assertTrue(block["code"]["code"].startswith("# Error"))
        self.assertIn("# Corrección", block["code"]["code"])
        self.assertNotIn("subtopicId", block)
        assert_pinned_output(self, block)

    def test_negative_control_the_bug_accepts_any_region(self) -> None:
        self.assertEqual(stdout_of('r = "R-OESTE"\nprint(r == "R-NORTE" or "R-SUR")'), "R-SUR")

    def test_syntax_transcript_quotes_what_python_prints(self) -> None:
        code = theory(self.F, self.N, "Contraejemplo: `=` en lugar de `==`, y una rama sin sangría")["code"]["code"]
        eq = run('edad = 18\nif edad = 18:\n    print("tiene 18 años")')
        indent = run('edad = 18\nif edad == 18:\nprint("tiene 18 años")')
        for done in (eq, indent):
            self.assertEqual(done.returncode, 1)
            self.assertIn(done.stderr.strip().splitlines()[-1], code)

    def test_dash_o_transcript_is_what_python_does(self) -> None:
        code = theory(self.F, self.N, "Contraejemplo: `python -O` deja pasar lo que `assert` detenía")["code"]["code"]
        src = 'edad = -5\nassert edad >= 0, "edad negativa"\nprint("edad aceptada:", edad)'
        self.assertEqual(run(src).returncode, 1)
        self.assertIn("AssertionError: edad negativa", run(src).stderr)
        self.assertEqual(run(src, "-O").stdout.strip(), "edad aceptada: -5")
        self.assertIn("edad aceptada: -5", code)
        rule = 'edad = -5\nif edad < 0:\n    print("reject: edad negativa")\nelse:\n    print("edad aceptada:", edad)'
        self.assertEqual(run(rule, "-O").stdout.strip(), "reject: edad negativa")
        self.assertIn("reject: edad negativa", code)

    def test_true_is_1_warning_is_named_and_real(self) -> None:
        done = run("print(True is 1)")
        self.assertIn('SyntaxWarning: "is" with \'int\' literal', done.stderr)
        self.assertIn("SyntaxWarning: \"is\" with \\'int\\' literal", text(self.F))

    def test_return_is_not_named_before_it_is_taught(self) -> None:
        self.assertNotIn("Usa returns con", text(self.F))


class S04(unittest.TestCase):
    F, N = "s04-iteration-summaries.ts", "section04"

    def test_empty_lot_prints_na_instead_of_crashing(self) -> None:
        block = theory(self.F, self.N, "Contadores, acumuladores y búsqueda")
        assert_pinned_output(self, block)
        empty = block["code"]["code"].replace(
            'statuses = ["accept", "reject", "accept", "review", "reject", "accept"]', "statuses = []")
        self.assertIn("total 0 reject 0 tasa N/A", stdout_of(empty))

    def test_comprehension_demo_guards_the_division(self) -> None:
        d = demo(self.F, self.N, "S04-T3-B-DEMO")
        self.assertIn("if len(rows) > 0:", d["code"]["code"])
        assert_pinned_output(self, d)

    def test_words(self) -> None:
        s = text(self.F)
        self.assertNotIn("deflact", s)
        self.assertNotIn("`ZeroDivisionError` silencioso", s)


class S06(unittest.TestCase):
    F, N = "s06-collections.ts", "section06"

    def test_theory_get_nested_takes_keys_like_the_exercises(self) -> None:
        block = theory(self.F, self.N, "Acceso seguro: campos ausentes y campos vacíos")
        assert_pinned_output(self, block)
        code = block["code"]["code"]
        self.assertIn("def get_nested(d, *keys, default=MISSING):", code)
        # The exercises' call style returns the value from the theory's helper too.
        probe = code + '\nprint(get_nested({"profile": {"phone": "999"}}, "profile", "phone"))'
        self.assertEqual(stdout_of(probe).splitlines()[-1], "999")

    def test_negative_control_mixing_styles_was_silent(self) -> None:
        old = ("def get_nested(d, *keys, default=None):\n    cur = d\n    for k in keys:\n"
               "        if not isinstance(cur, dict) or k not in cur:\n            return default\n"
               "        cur = cur[k]\n    return cur\n"
               'print(get_nested({"profile": {"phone": "999"}}, ("profile", "phone")))')
        self.assertEqual(stdout_of(old), "None")

    def test_demo_uses_one_name_and_an_object_sentinel(self) -> None:
        d = demo(self.F, self.N, "S06-T3-B-DEMO")
        self.assertIn("MISSING = object()", d["code"]["code"])
        self.assertNotIn('"MISSING"', d["code"]["code"])
        assert_pinned_output(self, d)
        self.assertIsNone(re.search(r"\bdig\b", json.dumps(section(self.F, self.N), ensure_ascii=False)))

    def test_last_n_precondition_is_true(self) -> None:
        self.assertEqual(stdout_of("rows = [1, 2, 3, 4]\nprint(rows[-(-1):])"), "[2, 3, 4]")
        self.assertIn("con `n = -1`, `rows[1:]` devolvería todas las filas menos la primera", text(self.F))


class S07(unittest.TestCase):
    F, N = "s07-text-unicode-regex.ts", "section07"

    def test_street_matches_the_code(self) -> None:
        self.assertNotIn("Grau 45", text(self.F))

    def test_fp_fn_demo_has_no_pipeline_contradiction(self) -> None:
        d = demo(self.F, self.N, "S07-T4-B-DEMO")
        self.assertNotIn('"José", "b": "Jose"', d["code"]["code"])
        assert_pinned_output(self, d)

    def test_review_counts_as_no_match_is_said(self) -> None:
        self.assertIn("un par que iría a `review` cuenta como `no_match`", text(self.F))


class S08(unittest.TestCase):
    F, N = "s08-files-ingestion.ts", "section08"

    def test_hash_transcript_numbers_are_what_312_prints(self) -> None:
        code = theory(self.F, self.N, "Contraejemplo: hash() cambia entre procesos")["code"]["code"]
        for seed in ("1", "2"):
            env = {**os.environ, "PYTHONHASHSEED": seed}
            got = subprocess.run([sys.executable, "-c", "print(hash(b'abc'))"],
                                 capture_output=True, text=True, env=env).stdout.strip()
            self.assertIn(f'PYTHONHASHSEED={seed} python -c "print(hash(b\'abc\'))"\n{got}\n', code + "\n")

    def test_negative_control_old_numbers_are_not_312s(self) -> None:
        env = {**os.environ, "PYTHONHASHSEED": "1"}
        got = subprocess.run([sys.executable, "-c", "print(hash(b'abc'))"],
                             capture_output=True, text=True, env=env).stdout.strip()
        self.assertNotEqual(got, "7831159276781462151")

    def test_each_hash_block_has_its_own_paragraph(self) -> None:
        first = theory(self.F, self.N, "Contraejemplo: un hex copiado deja de coincidir")["paragraphs"]
        second = theory(self.F, self.N, "Contraejemplo: hash() cambia entre procesos")["paragraphs"]
        self.assertEqual(len(first), 1)
        self.assertEqual(len(second), 1)
        self.assertNotIn("PYTHONHASHSEED", first[0])
        self.assertNotIn("El bloque de Python", second[0])

    def test_quarantine_demo_does_not_call_rebuilt_text_raw(self) -> None:
        d = demo(self.F, self.N, "S08-T2-B-DEMO")
        self.assertNotIn('",".join(row)', d["code"]["code"])
        assert_pinned_output(self, d)

    def test_default_str_error_names_the_type(self) -> None:
        done = run('import json\nfrom decimal import Decimal\njson.dumps({"monto": Decimal("1")})')
        self.assertIn("Object of type Decimal is not JSON serializable", done.stderr)
        self.assertNotIn("qué campo falta tratar", text(self.F))


class S09(unittest.TestCase):
    F = "s09-exceptions-logging.ts"

    def test_caption_says_what_python_keeps(self) -> None:
        done = run("try:\n    raise ValueError('a')\nexcept ValueError:\n    raise RuntimeError('b')")
        self.assertIn("During handling of the above exception", done.stderr)
        self.assertNotIn("reemplazarlo sin encadenar", text(self.F))

    def test_phone_has_nine_digits_after_51(self) -> None:
        self.assertIn("'+51 999 123 456'", text(self.F))
        self.assertIn("phone=***3456", text(self.F))
        self.assertNotIn('"***" if address else "***"', text(self.F))


class S10(unittest.TestCase):
    F = "s10-modules-packaging-cli.ts"

    def test_layout_and_toml_carry_what_the_prose_requires(self) -> None:
        s = text(self.F)
        self.assertIn('"src/familiarity_core/__main__.py",', s)
        self.assertGreaterEqual(s.count('familiarity = "familiarity_core.cli:entrypoint"'), 3)
        self.assertNotIn("buen luck", s)
        self.assertNotIn("que `ingest` necesita al final", s)

    def test_python_m_without_main_fails_as_the_preamble_says(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            pkg = Path(tmp, "familiarity_core")
            pkg.mkdir()
            (pkg / "__init__.py").write_text("", encoding="utf-8")
            done = subprocess.run([sys.executable, "-m", "familiarity_core"], cwd=tmp,
                                  capture_output=True, text=True)
        self.assertEqual(done.returncode, 1)
        self.assertIn("No module named familiarity_core.__main__", done.stderr)


class S11(unittest.TestCase):
    F = "s11-oop-domain.ts"

    def test_text_order_and_sorted_pair(self) -> None:
        self.assertEqual(stdout_of('print("E10" < "E2", sorted(("E2", "E10")))'), "True ['E10', 'E2']")
        self.assertIn("`izq, der = sorted((", text(self.F))

    def test_set_keeps_the_first_label(self) -> None:
        code = ("from dataclasses import dataclass, field\n@dataclass(frozen=True)\nclass R:\n"
                "    entity_id: str\n    display_name: str = field(compare=False)\n"
                's = {R("E1", "Ana")}\ns.add(R("E1", "Ana actualizada"))\nprint([r.display_name for r in s])')
        self.assertEqual(stdout_of(code), "['Ana']")
        self.assertIn("El set conserva el primer objeto", text(self.F))


class S13(unittest.TestCase):
    F, N = "s13-evidence-dashboard.ts", "section13"

    def test_jaccard_numbers(self) -> None:
        def j(a: str, b: str) -> float:
            sa, sb = set(a.casefold().split()), set(b.casefold().split())
            return round(len(sa & sb) / len(sa | sb), 3)
        self.assertEqual(j("Ana Quispe Rojas", "Luis Quispe Díaz"), 0.2)
        self.assertEqual(j("Quispe Rojas", "Quispe Díaz"), 0.333)
        self.assertNotIn("Jaccard de tokens de apellido 0.2", text(self.F))

    def test_er_block_follows_the_prose_contract(self) -> None:
        hits = [b for b in section(self.F, self.N)["theory"] if b.get("code") and "def er_score" in b["code"]["code"]]
        self.assertEqual(len(hits), 1)
        code = hits[0]["code"]["code"]
        assert_pinned_output(self, hits[0])
        probe = code + (
            '\nprint(er_score({"name": "Ana Quispe", "document_id": "D1", "region": "Lima"},'
            ' {"name": "Ana Quispe", "document_id": "d1", "region": "Cusco"}))'
            '\nprint(er_score({"name": "", "document_id": "D1", "region": "Lima"},'
            ' {"name": "Ana Quispe", "document_id": "D1", "region": "Lima"}))')
        self.assertEqual(stdout_of(probe).splitlines()[-2:], ["0.5", "None"])

    def test_missing_phone_is_false_not_a_crash(self) -> None:
        hits = [b for b in section(self.F, self.N)["theory"] if b.get("code") and "def shared_contact" in b["code"]["code"]]
        self.assertEqual(len(hits), 1)
        assert_pinned_output(self, hits[0])
        probe = hits[0]["code"]["code"] + '\nprint(0.5 * shared_contact({}, {"phone": "1"}, "phone"))'
        self.assertEqual(stdout_of(probe).splitlines()[-1], "0.0")

    def test_two_empty_phones_are_not_a_shared_phone(self) -> None:
        # Review finding on #153: `is not None` let "" == "" count as a shared contact.
        hits = [b for b in section(self.F, self.N)["theory"] if b.get("code") and "def shared_contact" in b["code"]["code"]]
        code = hits[0]["code"]["code"]
        probe = code + '\nprint(shared_contact({"phone": ""}, {"phone": ""}, "phone"),' \
            ' shared_contact({"phone": "9"}, {"phone": "9"}, "phone"))'
        self.assertEqual(stdout_of(probe).splitlines()[-1], "False True")
        # Negative control: the `is not None` version does call two empty phones shared.
        broken = code.replace("bool(a.get(field))", "a.get(field) is not None")
        self.assertNotEqual(broken, code)
        self.assertEqual(stdout_of(broken + '\nprint(shared_contact({"phone": ""}, {"phone": ""}, "phone"))').splitlines()[-1], "True")

    def test_demo_cases_match_the_prose(self) -> None:
        s = text(self.F)
        self.assertIn('("CASE-1", "Ana Quispe", 0.92, 0.41,', s)
        self.assertIn('("CASE-2", "Luis Huamán", 0.55, 0.6,', s)
        self.assertNotIn("bloque de Lima", s)
        self.assertNotIn("unir, rechazar, o mandar", s)

    def test_graphlet_keys_are_the_theorys(self) -> None:
        demos = [d for d in _demos(self.F, self.N) if "def graphlet_evidence" in d["code"]["code"]]
        self.assertEqual(len(demos), 1)
        assert_pinned_output(self, demos[0])
        self.assertIn("'pair': ('A', 'B'), 'n': 2", demos[0]["code"]["output"])
        self.assertIn("'entities': ('A', 'C')", demos[0]["code"]["output"])

    def test_threshold_demo_has_the_row_the_preamble_names(self) -> None:
        demos = [d for d in _demos(self.F, self.N) if "samples = [" in d["code"]["code"]]
        self.assertEqual(len(demos), 1)
        assert_pinned_output(self, demos[0])
        self.assertIn("'score': 0.85, 'uncertainty': 'high', 'status': 'needs_review'", demos[0]["code"]["output"])


if __name__ == "__main__":
    unittest.main()
