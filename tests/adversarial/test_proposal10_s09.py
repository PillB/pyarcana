"""Proposal 10 (approved 2026-11-11), S09: the P2 and P3 findings of the item-by-item review.

The two P1 findings (the cause type in the chaining prose, the CRITICAL level for a broken
config) were closed on main by test_proposal10_p1. This file covers the rest.

Most S09 We Do findings share the S07/S08 shape: the check printed only what a wrong answer also
prints. A hard-coded `normalize` passed the "read the stack" exercise, a literal `False` passed
the `+` hypothesis, a global id passed the correlation exercise, `detected = True` passed the
template audit, `>=` and a provider-first order passed the abort policy, an unbounded loop
passed the retry cap, and a missing `sort_keys` passed the idempotency key. Each exercise now
carries the case that separates the two answers, and these tests plant each wrong answer.

The other findings are claims the code did not show (`finally` on the failure path, CRITICAL,
the three error classes, a duplicate without the key), words used before they are defined
(frame, handler, formatter, oráculo, "familiaridad"), and a You Do whose privacy criterion no
assert checked.

Negative controls: every reference prints its pin, a no-op mutation raises, an irrelevant edit
is not caught, starters run and differ from the pin, a leaky You Do fails the privacy assert,
and the bank scan reads the whole bank.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section09 }} from {path!r};
console.log(JSON.stringify(section09));
"""


@lru_cache(maxsize=None)
def s09() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s09-exceptions-logging.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S09 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block_by_title(title: str) -> dict:
    hits = [b for b in s09()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s09()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s09()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s09()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts.append(b["callout"]["content"])
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], e["hint"], *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8", cwd=tmp)


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "exceptions-logging"][0]["questions"]


ABORT_RULES = ('''    if ratio > 0.5:
        return True, "quarantine_ratio"
    if metrics.get("provider_exhausted"):
        return True, "provider"
''')
PROVIDER_FIRST = ('''    if metrics.get("provider_exhausted"):
        return True, "provider"
    if ratio > 0.5:
        return True, "quarantine_ratio"
''')

#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise corrects.
MUTANTS = {
    "S09-T1-A-E2": [
        ("WEDO-02 cause dropped with from None", 'raise ValueError("monto no numérico") from e',
         'raise ValueError("monto no numérico") from None'),
    ],
    "S09-T2-A-E3": [
        ("WEDO-09 function name typed by hand", 'return f"causa_raiz={funcion} falta clave {key}"',
         'return f"causa_raiz=normalize falta clave {key}"'),
    ],
    "S09-T2-B-E2": [
        ("WEDO-11 strips only spaces and +", 'return "".join(c for c in p if c.isdigit())',
         'return p.replace(" ", "").replace("+", "")'),
        ("WEDO-11 keeps the + symbol", 'return "".join(c for c in p if c.isdigit())',
         'return "".join(c for c in p if c.isdigit() or c == "+")'),
    ],
    "S09-T3-A-E3": [
        ("WEDO-15 progress on stdout", "h = logging.StreamHandler(sys.stderr)", "h = logging.StreamHandler(sys.stdout)"),
    ],
    "S09-T3-B-E2": [
        ("WEDO-17 a fixed id instead of the argument", 'print(f"repo correlation_id={corr} id={item[\'id\']}")',
         'print(f"repo correlation_id=corr-42 id={item[\'id\']}")'),
    ],
    "S09-T3-B-E3": [
        ("WEDO-18 detector that always says unsafe", 'return "{email}" in template or "{phone}" in template',
         "return True"),
    ],
    "S09-T4-A-E3": [
        ("WEDO-21 >= at the threshold", "if ratio > 0.5:", "if ratio >= 0.5:"),
        ("WEDO-21 provider checked first", ABORT_RULES, PROVIDER_FIRST),
        ("WEDO-21 division by zero on an empty batch", "ratio = (q / total) if total else 0.0", "ratio = q / total"),
    ],
    "S09-T4-B-E2": [
        ("WEDO-23 no cap on the loop", "for _ in range(max_attempts):", "while True:"),
    ],
    "S09-T4-B-E3": [
        ("WEDO-24 no sort_keys", 'json.dumps(record["payload"], sort_keys=True)', 'json.dumps(record["payload"])'),
    ],
}

#: theory block title -> (finding, old, new)
THEORY_MUTANTS = {
    "boundaries.py": [
        ("THEORY-06 finally only on the success path", "        lineas = read_lote(text, config_ok)", "        lineas = read_lote(text, True)"),
    ],
    "failfast_quarantine.py": [
        ("THEORY-11 no CRITICAL before the abort", '        log.critical("stage=config event=abort reason=required_fields")\n', ""),
    ],
    "retry_policy.py": [
        ("THEORY-20 save_sin_mirar checks the key", "    filas.append((key, payload))  # no busca la clave antes de añadir",
         "    if (key, payload) not in filas:\n        filas.append((key, payload))"),
    ],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for e in s09()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                sol = e["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, mutants in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutants:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertEqual(sol["code"].count(old), 1, f"{finding}: anchor not in the solution")
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_starters_run_and_differ_from_the_pin(self) -> None:
        for e in s09()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                done = run_py(e["starterCode"]["code"])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_progress_goes_to_stderr(self) -> None:
        done = run_py(exercise("S09-T3-A-E3")["solutionCode"]["code"])
        self.assertEqual(done.stdout, "RESULT=3\n")
        self.assertEqual(done.stderr.splitlines(), ["event=start op=inc", "event=done op=inc"])

    def test_the_cause_is_kept(self) -> None:
        out = exercise("S09-T1-A-E2")["solutionCode"]["output"]
        self.assertIn("causa conservada: InvalidOperation", out)

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S09-T4-B-E2")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S09-T4-B-E2")["solutionCode"]
        edited = sol["code"].replace("def retry_call(", "# reintentos\ndef retry_call(")
        self.assertFalse(caught(sol["code"], sol["output"], edited))

    def test_edge_cases_name_inputs(self) -> None:
        for ex_id in ("S09-T2-B-E2", "S09-T3-B-E3"):
            with self.subTest(exercise=ex_id):
                for case in exercise(ex_id)["edgeCases"]:
                    self.assertIn("→", case)


class TheoryShowsWhatItClaims(unittest.TestCase):
    def test_pins_hold(self) -> None:
        for title in THEORY_MUTANTS:
            with self.subTest(block=title):
                code = block_by_title(title)["code"]
                done = run_py(code["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), code["output"].rstrip("\n"))

    def test_each_planted_mistake_changes_the_block(self) -> None:
        for title, mutants in THEORY_MUTANTS.items():
            code = block_by_title(title)["code"]
            for finding, old, new in mutants:
                with self.subTest(block=title, finding=finding):
                    self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not in the block")
                    self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)))

    def test_finally_runs_on_the_failure_path(self) -> None:
        theory = block_by_title("boundaries.py")["code"]["output"].splitlines()
        self.assertEqual(theory.count("finally: contadores listos"), 2)
        self.assertLess(len(theory) - 1 - theory[::-1].index("finally: contadores listos"),
                        theory.index("demo capturada: config inválida: delimiter vacío"))
        ido = demo("S09-T1-B-DEMO")["code"]["output"].splitlines()
        self.assertEqual(ido.count("finally: contadores listos"), 2)
        self.assertEqual(ido[-1], "fatal config: encoding requerido")

    def test_the_three_classes_are_shown(self) -> None:
        out = block_by_title("failfast_quarantine.py")["code"]["output"]
        for needle in ["'error_class': 'data'", "error_class=config:", "error_class=provider:",
                       "CRITICAL stage=config event=abort", "entradas 2 = ok + cuarentena 2"]:
            with self.subTest(needle=needle):
                self.assertIn(needle, out)
        self.assertIn("`required_fields`", block_by_title("failfast_quarantine.py")["paragraphs"][0])

    def test_quarantine_demo_counts_its_attempts(self) -> None:
        self.assertIn("('quarantine', 'monto') attempts 1", demo("S09-T4-B-DEMO")["code"]["output"])

    def test_a_second_import_does_not_rerun_the_module(self) -> None:
        """The THEORY-13 fix says so; this runs it."""
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "conf.py").write_text("print('configurando logging')\n", encoding="utf-8")
            (Path(tmp) / "main.py").write_text("import conf\nimport conf\n", encoding="utf-8")
            done = subprocess.run([sys.executable, "main.py"], cwd=tmp, capture_output=True, text=True)
        self.assertEqual(done.stdout, "configurando logging\n")
        para = block_by_title("handlers_duplicados.py")["paragraphs"][0]
        self.assertNotIn("importar dos veces un módulo que configura logging", para)
        self.assertIn("Importar dos veces el mismo módulo no lo causa", para)


class WordsAreDefinedWhereUsed(unittest.TestCase):
    def test_outcomes_gloss_their_terms(self) -> None:
        outcomes = " ".join(o["text"] for o in s09()["learningOutcomes"])
        self.assertNotIn("minimal repro", outcomes)
        self.assertIn("reproducción mínima (el menor ejemplo que todavía falla)", outcomes)
        self.assertIn("data (una fila), config (la configuración) o provider (un servicio externo)", outcomes)

    def test_frame_handler_formatter_are_defined(self) -> None:
        self.assertIn("Cada **frame** es una entrada de la traza", s09()["theory"][0]["paragraphs"][2])
        levels = " ".join(block_by_title("structured_log.py")["paragraphs"])
        self.assertIn("*handler* (el destino que escribe cada línea)", levels)
        self.assertIn("*formatter* (la plantilla de cada línea)", levels)
        self.assertNotIn("preview suave de S10", levels)
        self.assertIn("Con un `Formatter` por defecto, los campos de `extra` no aparecen", levels)

    def test_error_and_warning_do_not_overlap(self) -> None:
        levels = block_by_title("structured_log.py")["paragraphs"][0]
        error_def = levels[levels.index("**ERROR**"):levels.index("**CRITICAL**")]
        self.assertNotIn("cuarentena", error_def)
        self.assertIn("Una fila que va a cuarentena es **WARNING**", levels)

    def test_paragraphs_keep_one_focus(self) -> None:
        for p in block_by_title("structured_log.py")["paragraphs"]:
            with self.subTest(paragraph=p[:40]):
                self.assertLessEqual(len(re.findall(r"[.!?](?:\s|$)", p)), 5)

    def test_no_untaught_or_house_term(self) -> None:
        text = learner_text()
        for term in ["oráculo", "familiaridad", "familiarity", "INSERT", "preview S10", "RESULT de logs",
                     "La entrada más pequeña que reproduce el bug", "importar dos veces un módulo"]:
            with self.subTest(term=term):
                self.assertNotIn(term, text)


YOU_DO_BODIES = {
    "mask_address": '''
    return "***"''',
    "classify_error": '''
    if isinstance(exc, (TimeoutError, ConnectionError)):
        return "provider"
    if isinstance(exc, RuntimeError):
        return "config"
    return "data"''',
    "process_batch": '''
    log = logging.getLogger("audit")
    required = config.get("required_fields")
    if not required:
        log.critical("correlation_id=%s stage=config event=abort", correlation_id)
        raise RuntimeError("config: required_fields ausente")
    ok, quarantined, errors_by_class = [], [], {}
    for r in records:
        missing = [k for k in required if not r.get(k)]
        if missing:
            clase = classify_error(KeyError(missing[0]))
            errors_by_class[clase] = errors_by_class.get(clase, 0) + 1
            quarantined.append({"id": r.get("id"), "reason": "missing:" + ",".join(missing)})
            log.warning("correlation_id=%s event=quarantine email=%s address=%s", correlation_id,
                        mask_email(r.get("email", "")), mask_address(r.get("address", "")))
        else:
            ok.append(r)
    return {"ok": ok, "quarantined": quarantined, "errors_by_class": errors_by_class, "in": len(records)}''',
}


def complete_you_do(bodies: dict[str, str]) -> str:
    source = s09()["youDo"]["starterCode"]
    for name, body in bodies.items():
        sig = re.search(rf"def {name}\((?:.|\n)*?\)(?: -> [^\n]*)?:\n", source)
        if sig is None:
            raise AssertionError(f"no def {name} in the starter")
        end = source.index("\n\n\n", sig.end())
        source = source[:sig.end()] + body.lstrip("\n") + source[end:]
    return source


class YouDoChecksItsPrivacyRule(unittest.TestCase):
    def test_a_completed_you_do_runs(self) -> None:
        done = run_py(complete_you_do(YOU_DO_BODIES))
        self.assertEqual(done.returncode, 0, done.stderr[-800:])

    def test_a_leaky_log_fails_the_privacy_assert(self) -> None:
        leaky = dict(YOU_DO_BODIES)
        leaky["process_batch"] = leaky["process_batch"].replace(
            'mask_email(r.get("email", ""))', 'r.get("email", "")')
        self.assertNotEqual(leaky, YOU_DO_BODIES)
        done = run_py(complete_you_do(leaky))
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("dato personal completo en el log", done.stderr)

    def test_the_wrong_exception_type_fails_fail_fast(self) -> None:
        wrong = dict(YOU_DO_BODIES)
        wrong["process_batch"] = wrong["process_batch"].replace(
            'raise RuntimeError("config: required_fields ausente")', 'raise ValueError("config")')
        done = run_py(complete_you_do(wrong))
        self.assertNotEqual(done.returncode, 0)

    def test_requirements_name_the_contract(self) -> None:
        yd = s09()["youDo"]
        reqs = "\n".join(yd["requirements"])
        self.assertIn("lanza RuntimeError antes de leer ninguna fila", reqs)
        self.assertIn('classify_error(exc) devuelve "data", "config" o "provider"', reqs)
        self.assertIn("log.warning por fila en cuarentena", reqs)
        self.assertNotIn("Al menos 3 comprobaciones", reqs)
        starter = yd["starterCode"]
        self.assertNotIn("descomenta", starter)
        self.assertNotIn("log.error enmascarado", starter)
        self.assertIn("6) classify_error", starter)


class SelfCheckAndBank(unittest.TestCase):
    def test_always_longest_fails(self) -> None:
        qs = s09()["selfCheck"]["questions"]
        self.assertEqual(len(qs), 11)
        longest = sum(len(q["options"][q["correctIndex"]]) == max(map(len, q["options"])) for q in qs)
        self.assertLessEqual(longest, 2)
        for i in (0, 4, 5, 6, 7, 9, 10):
            with self.subTest(question=i + 1):
                q = qs[i]
                self.assertLess(len(q["options"][q["correctIndex"]]), max(map(len, q["options"])))

    def test_rewritten_options_keep_the_answer_key(self) -> None:
        # Rewriting distractors reorders options; correctIndex must still point at the
        # same answer. Each key below is main's key, except q6, rewritten on purpose.
        keys = {
            1: "Encadenar la causa en __cause__ sin perder contexto",
            5: "Puede reintentarse con backoff; ValueError de datos no",
            6: "El menor ejemplo autocontenido que todavía produce el fallo",
            7: "Traga también KeyboardInterrupt/SystemExit y esconde corrupción",
            8: "Siempre: con éxito, con except y al re-raise",
            10: "Cuando el proceso o el lote entero está en peligro",
            11: "Permiten filtrar y correlacionar eventos en agregadores y post mórtems",
        }
        qs = s09()["selfCheck"]["questions"]
        for n, key in keys.items():
            with self.subTest(question=n):
                q = qs[n - 1]
                self.assertTrue(q["options"][q["correctIndex"]].startswith(key))

    def test_minimal_repro_key_matches_the_theory(self) -> None:
        q = s09()["selfCheck"]["questions"][5]
        key = q["options"][q["correctIndex"]]
        self.assertIn("autocontenido", key)
        self.assertNotIn("más pequeña", key)

    def test_bank_uses_the_lesson_names(self) -> None:
        items = bank()
        self.assertEqual(len(items), 24, "the scan must read the whole bank")
        blob = json.dumps(items, ensure_ascii=False)
        for term in ["familiaridad", "emoji", "Reescribir todo el repositorio"]:
            with self.subTest(term=term):
                self.assertNotIn(term, blob)
        parser = [q for q in items if q["question"].startswith("Al convertir el monto en el parser")]
        self.assertEqual(len(parser), 1)
        key = parser[0]["options"][parser[0]["correctIndex"]]
        self.assertNotIn(" o ", key, "one exception type, not two")
        self.assertLess(len(key), max(map(len, parser[0]["options"])))


if __name__ == "__main__":
    unittest.main()
