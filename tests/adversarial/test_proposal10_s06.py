"""Proposal 10 (approved 2026-11-11), S06: the P2 and P3 findings of the item-by-item review.

Three kinds of finding, three kinds of test.

1. A warning or rule that no code runs: the unguarded `last_n(ids, -1)`, `base.update` on a
   shared dict, `ordenadas = filas.sort(...)`, montos sorted as text. The theory blocks now run
   each one; the tests require the printed line and plant the mistake to show it changes the output.
2. An exercise whose reference solution contradicts the section: T3-B-E2 called `None` "missing"
   although learning outcome 5 says missing means the key does not exist; T2-B-E3 used a third
   conflict shape; T1-A-E3 handed back the caller's list. Mutation tests plant the old behaviour
   and require the exercise to notice it.
3. Words the course has not taught (cohorte, arista, denormalizar, preindexar, O(1), shape,
   cuarentena, manifests, defaultdict) and options that give the key away by length. Those tests
   read the section through tsx, so they check what the learner sees.

Negative controls: every reference prints its pin, a mutation that changes nothing raises, an
irrelevant edit is not "caught", a completed You Do runs, and the bank scan really reads 24 items.
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
import {{ section06 }} from {path!r};
console.log(JSON.stringify(section06));
"""


@lru_cache(maxsize=None)
def s06() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s06-collections.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S06 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s06()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def block_by_title(title: str) -> dict:
    hits = [b for b in s06()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s06()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s06()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    """Everything a learner reads, without code: the shape the term scans need."""
    sec = s06()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts.append(b["callout"]["content"])
        if b.get("figure"):
            parts.append(b["figure"]["caption"])
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], *e.get("hints", []), *e.get("edgeCases", [])]
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
                              text=True, timeout=60, encoding="utf-8")


def stdout_of(source: str) -> str:
    done = run_py(source)
    if done.returncode != 0:
        raise AssertionError(done.stderr[-600:])
    return done.stdout


def last_error_line(done: subprocess.CompletedProcess) -> str:
    lines = [ln for ln in done.stderr.strip().splitlines() if ln.strip()]
    return lines[-1] if lines else ""


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "collections"][0]["questions"]


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: an assert stops it or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def sentences(paragraph: str) -> int:
    # Ignore dots inside code spans and in "p. ej."; count sentence ends.
    plain = re.sub(r"`[^`]*`", "X", paragraph).replace("p. ej.", "pej")
    return len(re.findall(r"[.!?»](?:\s|$)", plain))


#: exercise id -> list of (finding, old text, new text): the old behaviour the finding names.
MUTANTS = {
    "S06-T3-B-E2": [
        ("WEDO-17 None counted as missing",
         "    if 'email' not in c:\n        flag = 'missing'\n    elif c['email'] is None:\n        flag = 'nulo'\n",
         "    if 'email' not in c or c['email'] is None:\n        flag = 'missing'\n"),
    ],
    "S06-T2-B-E3": [
        ("WEDO-12 a third conflict shape", "conflicts.append({'id': k,", "conflicts.append({'key': k,"),
    ],
    "S06-T3-B-E3": [
        ("WEDO-17 None labelled missing", "'nulo=', v is None", "'missing=', v is None"),
    ],
}

#: theory code title -> list of (finding, old text, new text).
THEORY_MUTANTS = {
    "slicing_txs.py": [
        ("THEORY-03 the n=-1 case not run", 'print("n=-1:", last_n(ids, -1))', 'print("n=-1:", last_n(ids, 1))'),
    ],
    "dict_index.py": [
        ("THEORY-05 no copy before update", "config_job = dict(base)\n", "config_job = base\n"),
    ],
    "sorted_key.py": [
        ("THEORY-12 montos compared as text", 'sorted(montos_txt, key=int)', "sorted(montos_txt)"),
        ("THEORY-12 .sort() result kept", "ordenadas = copia.sort(key=monto_value)",
         "ordenadas = sorted(copia, key=monto_value)"),
    ],
}


class ExercisesNoticeTheMistakeTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        for ex_id in [*MUTANTS, "S06-T1-A-E2", "S06-T1-A-E3", "S06-T2-A-E1", "S06-T2-A-E3",
                      "S06-T2-B-E2", "S06-T4-B-E2"]:
            with self.subTest(exercise=ex_id):
                sol = exercise(ex_id)["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_named_mistake_is_caught(self) -> None:
        for ex_id, mutants in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutants:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertEqual(sol["code"].count(old), 1, f"{finding}: anchor not in the solution")
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S06-T3-B-E2")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S06-T3-B-E2")["solutionCode"]
        edited = sol["code"].replace("for c in clients:", "# recorrido\nfor c in clients:")
        self.assertFalse(caught(sol["code"], sol["output"], edited))

    def test_missing_keeps_the_meaning_of_outcome_5(self) -> None:
        self.assertIn("`missing`: la clave no existe", s06()["learningOutcomes"][5]["text"])
        e2 = exercise("S06-T3-B-E2")
        self.assertIn("C002: nulo", e2["solutionCode"]["output"])
        self.assertIn("C003: missing", e2["solutionCode"]["output"])
        self.assertNotIn("missing solo si clave ausente o valor `None`", e2["preamble"])
        self.assertNotIn("del I Do", e2["preamble"])
        self.assertNotIn("missing=", exercise("S06-T3-B-E3")["solutionCode"]["output"])

    def test_one_conflict_shape_everywhere(self) -> None:
        theory = block_by_title("sets_y_conflictos.py")["code"]["code"]
        self.assertIn('{"id": rid, "kept": seen[rid], "other": r}', theory)
        self.assertIn('{"id": rid, "kept": seen[rid], "other": r}', demo("S06-T2-B-DEMO")["code"]["code"])
        e3 = exercise("S06-T2-B-E3")
        self.assertIn("{'id': k, 'kept': seen[k], 'other': r}", e3["instruction"])
        self.assertTrue(any("{'id', 'kept', 'other'}" in r for r in s06()["youDo"]["requirements"]))

    def test_tuple_copy_never_aliases_the_callers_list(self) -> None:
        code = exercise("S06-T1-A-E3")["solutionCode"]["code"]
        as_list = code.replace("ids = ('C001', 'C002')", "ids = ['C001', 'C002']") + "\nprint('caller', ids)\n"
        self.assertNotEqual(as_list, code)
        self.assertIn("caller ['C001', 'C002']", stdout_of(as_list))
        aliased = as_list.replace("mut = ids.copy()", "mut = ids")
        self.assertIn("caller ['C001', 'C002', 'C003']", stdout_of(aliased))

    def test_feedback_claims_are_what_python_does(self) -> None:
        tuple_fb = exercise("S06-T1-A-E2")["feedback"]
        self.assertIn("`('canal',)`", tuple_fb)
        done = run_py("KEYS = ('id', 'monto')\nprint(KEYS + ('canal'))")
        self.assertTrue(last_error_line(done).startswith("TypeError"), done.stderr)
        index_fb = exercise("S06-T2-A-E1")["feedback"]
        self.assertIn("`KeyError: 1`", index_fb)
        self.assertEqual(last_error_line(run_py("d = dict([('C001', 'Lima'), ('C002', 'Cusco')])\nd[1]")),
                         "KeyError: 1")
        self.assertNotIn("falla el lookup", index_fb)
        self.assertNotIn("valida el grafo", exercise("S06-T3-A-E1")["feedback"])

    def test_set_retrospective_asks_a_question_that_separates_the_operators(self) -> None:
        retro = exercise("S06-T2-B-E2")["retrospective"]
        self.assertIn("`d@ex.com` en `a - b` y en `a ^ b`", retro)
        out = stdout_of("a = {'a@ex.com', 'b@ex.com', 'c@ex.com'}\nb = {'b@ex.com', 'c@ex.com', 'd@ex.com'}\n"
                        "print('d@ex.com' in a - b, 'd@ex.com' in a ^ b)")
        self.assertEqual(out.strip(), "False True")
        self.assertNotIn("(no aplica)", exercise("S06-T2-B-E2")["instruction"])

    def test_the_third_print_is_asked_for(self) -> None:
        e3 = exercise("S06-T2-A-E3")
        self.assertIn("via copy+update", e3["solutionCode"]["output"])
        self.assertIn("via copy+update", e3["instruction"])
        self.assertIn("via copy+update", e3["preamble"])


class TheoryRunsItsWarnings(unittest.TestCase):
    PINS = {
        "slicing_txs.py": ["n=0: []", "n=-1: ['T2', 'T3', 'T4']"],
        "dict_index.py": ["base tras update: {'timeout': 30, 'retry': 3}",
                          "base intacta: {'timeout': 30, 'retry': 1} job: {'timeout': 30, 'retry': 3}"],
        "sorted_key.py": ["ordenadas: None", "como texto: ['100', '20', '3']", "como número: ['3', '20', '100']"],
    }

    def test_blocks_print_the_warning_lines(self) -> None:
        for title, lines in self.PINS.items():
            code = block_by_title(title)["code"]
            out = stdout_of(code["code"])
            self.assertEqual(out.rstrip("\n"), code["output"].rstrip("\n"), title)
            for line in lines:
                with self.subTest(block=title, line=line):
                    self.assertIn(line, out.splitlines())

    def test_each_planted_mistake_changes_the_block(self) -> None:
        for title, mutants in THEORY_MUTANTS.items():
            code = block_by_title(title)["code"]
            for finding, old, new in mutants:
                with self.subTest(block=title, finding=finding):
                    self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not in the block")
                    self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)))

    def test_unpacking_block_really_unpacks(self) -> None:
        code = block_by_title("alias_vs_copy.py")["code"]["code"]
        self.assertIn("cid, region, monto, canal = fila", code)
        self.assertNotIn("fila[0], fila[1], fila[2]", code)

    def test_json_dumps_is_explained_before_its_code(self) -> None:
        b = block("Contraejemplo: el orden de un set y de un dict en JSON no es un contrato")
        first_json = next(i for i, p in enumerate(b["paragraphs"]) if "json.dumps" in p)
        self.assertIn("convierte un diccionario en texto con formato JSON", b["paragraphs"][first_json])
        self.assertIn("S08", b["paragraphs"][first_json])

    def test_sort_block_names_reverse(self) -> None:
        b = block("Ordenamiento y key")
        self.assertTrue(any("`reverse=True`, que invierte el orden" in p for p in b["paragraphs"]))


class WordsAreTaughtBeforeUse(unittest.TestCase):
    def test_no_untaught_term_in_learner_text(self) -> None:
        text = learner_text()
        self.assertGreater(len(text), 20000, "the scan must read the whole section")
        for term in ["cohorte", "determinismo de inmovilidad", "Modelo en memoria Client", "d x lanza",
                     "shallow[0] is original", "comprehension", "bien_shallow", "shallow dict()"]:
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_terms_are_glossed_at_first_use(self) -> None:
        text = learner_text()
        glosses = {
            "arista": "arista, es decir, una conexión entre dos registros",
            "denormaliz": "se llama denormalizar",
            "preindexar": "Construir el índice por adelantado (preindexar)",
            "O(1)": "una consulta da casi los mismos pasos sin importar cuántos registros haya",
            "dict(pares)": "convierte cada par `(clave, valor)` en una entrada",
            "^": "`a ^ b` (diferencia simétrica)",
        }
        for term, gloss in glosses.items():
            with self.subTest(term=term):
                first = text.find(term)
                self.assertGreaterEqual(first, 0)
                where = text.find(gloss)
                self.assertGreaterEqual(where, 0, f"gloss for {term!r} missing")
                # the gloss sits at, or in the same sentence as, the first use
                self.assertLess(where - first, 200, f"{term!r} is used {where - first} chars before its gloss")

    def test_outcomes_gloss_their_terms(self) -> None:
        outcomes = [o["text"] for o in s06()["learningOutcomes"]]
        self.assertIn("Deduplicar (quitar filas repetidas)", outcomes[3])
        self.assertIn("transacciones (txs)", outcomes[4])
        self.assertIn("key es el criterio que decide el orden", outcomes[6])

    def test_default_goes_by_name(self) -> None:
        b = block("Acceso seguro: campos ausentes y campos vacíos")
        self.assertTrue(any("el default va con nombre, `default=None`" in p for p in b["paragraphs"]))
        mistake = block_by_title("safe_access.py")["code"]["code"] + \
            '\nprint(get_nested(c3, "profile", "phone", None) is MISSING)'
        self.assertEqual(stdout_of(mistake).splitlines()[-1], "True")

    def test_split_paragraphs_have_one_focus(self) -> None:
        checks = {
            "Tres preguntas antes de abrir un archivo": "La sección sigue la vida de una fila",
            "Unpacking, aliasing y copia": "El desempaquetado convierte posiciones en nombres.",
            "Deduplicación y operaciones de set": "Un `set` se parece a una lista de invitados",
            "Estructuras anidadas y recorridos": "Aplanar no solo cambia la vista.",
            "Acceso seguro: campos ausentes y campos vacíos": "`get_nested` recorre la ruta nivel por nivel.",
        }
        for heading, start in checks.items():
            with self.subTest(heading=heading):
                para = next(p for p in block(heading)["paragraphs"] if p.startswith(start))
                self.assertLessEqual(sentences(para), 5, para)

    def test_sentence_counter_counts(self) -> None:
        """Negative control: the counter sees three sentences, not one."""
        self.assertEqual(sentences("Uno `a.b`. Dos, p. ej. tres. Cuatro."), 3)


class DemosSayWhatTheyRun(unittest.TestCase):
    def test_ido_labels_match_the_output(self) -> None:
        self.assertIn("`ok` (hay valor), `missing` (falta la ruta) o `empty` (campo vacío)",
                      demo("S06-T3-B-DEMO")["preamble"])
        self.assertIn("copia por fila", demo("S06-T1-B-DEMO")["code"]["output"])
        self.assertNotIn("cohortes", demo("S06-T2-B-DEMO")["preamble"])
        why = demo("S06-T4-B-DEMO")["why"]
        self.assertIn("fija el orden de las claves al serializar", why)
        self.assertIn("`ensure_ascii=False`", why)

    def test_demo_outputs_still_pin(self) -> None:
        for d in s06()["iDo"]["steps"]:
            with self.subTest(demo=d["demoId"]):
                self.assertEqual(stdout_of(d["code"]["code"]).rstrip("\n"), d["code"]["output"].rstrip("\n"))


class YouDoIsReadable(unittest.TestCase):
    def test_starter_lines(self) -> None:
        starter = s06()["youDo"]["starterCode"]
        self.assertNotIn("from __future__", starter)
        self.assertIn('print("contacts C002"', starter)
        self.assertNotIn('default="MISSING"', starter)
        self.assertIn("# Callable[[dict], Any]", starter)

    def test_a_completed_you_do_runs(self) -> None:
        """Negative control: the starter is a working frame once the four stubs are filled."""
        starter = s06()["youDo"]["starterCode"]
        bodies = {
            "dedup_report": (
                "    seen, unique, conflicts = {}, [], []\n"
                "    for r in rows:\n"
                "        k = key_fn(r)\n"
                "        if k not in seen:\n"
                "            seen[k] = r\n"
                "            unique.append(r)\n"
                "        elif seen[k] != r:\n"
                "            conflicts.append({'id': k, 'kept': seen[k], 'other': r})\n"
                "    return {'unique': unique, 'conflicts': conflicts}\n"),
            "flatten_txs": (
                "    return [{'client_id': c['id'], 'tx_id': t['id'], 'monto': t['monto']}\n"
                "            for c in clients for t in c['txs']]\n"),
            "get_nested": (
                "    cur = d\n"
                "    for k in keys:\n"
                "        if not isinstance(cur, dict) or k not in cur:\n"
                "            return default\n"
                "        cur = cur[k]\n"
                "    return cur\n"),
            "export_deterministic": (
                "    return json.dumps(sorted(clients, key=lambda c: c['id']), sort_keys=True, ensure_ascii=False)\n"),
        }
        stub = re.compile(r"    # [^\n]*\n    raise NotImplementedError\n")
        self.assertEqual(len(stub.findall(starter)), 4)
        filled = starter
        for name, body in bodies.items():
            head = filled.index(f"def {name}(")
            m = stub.search(filled, head)
            filled = filled[:m.start()] + body + filled[m.end():]
        out = stdout_of(filled)
        self.assertIn("contacts C002 []", out)
        self.assertIn("missing path None", out)
        self.assertIn("'conflicts': [{'id': 'C001'", out)


class SelfCheckAndBank(unittest.TestCase):
    def q(self, i: int) -> dict:
        return s06()["selfCheck"]["questions"][i]

    def test_keys_are_not_the_longest_option(self) -> None:
        for i in (2, 5):
            with self.subTest(question=i):
                q = self.q(i)
                lengths = [len(o) for o in q["options"]]
                self.assertLess(lengths[q["correctIndex"]], max(lengths))

    def test_get_question_shows_the_code(self) -> None:
        q = self.q(7)
        self.assertIn('`d["x"]` lanza `KeyError`', q["options"][q["correctIndex"]])
        self.assertFalse(any(" d x " in o for o in q["options"]))

    def test_flat_row_key_has_no_bare_jargon(self) -> None:
        q = self.q(8)
        self.assertEqual(q["options"][q["correctIndex"]], "client_id repetido junto a tx_id y monto")

    def test_bank_uses_the_lesson_words(self) -> None:
        items = bank()
        self.assertEqual(len(items), 24, "the scan must read the whole bank")
        blob = json.dumps(items, ensure_ascii=False)
        for term in ["shape", "defaultdict", "Counter", "cuarentena", "manifests"]:
            with self.subTest(term=term):
                self.assertNotIn(term, blob)


if __name__ == "__main__":
    unittest.main()
