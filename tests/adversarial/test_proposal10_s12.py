"""Proposal 10 (approved 2026-11-11), S12: the P1, P2 and P3 findings of the item-by-item review.

S12 teaches an HTTP adapter, a SQLite store and a geo signal. The review found four shapes.

First, exercises whose visible cases also pass the usual wrong answer: a parser without the type
check, a pager that walks the dict instead of `next`, a retry set that takes 500, a token check
that lets an empty string through, a hard-coded provenance, an f-string UPDATE, a JOIN without
WHERE, quote-stripping instead of a placeholder, an index on the wrong column, a blacklist, and
a flat distance formula. Each exercise now prints the case that separates the two answers, and
these tests plant each wrong answer.

Second, code that contradicts its prose: the P1 sentence that credited `executemany` with the
rollback, a cache that stored a 404, a constant printed as a measured count or as a security
check, two names for one contract key, three contracts for one geocoder, money stored as REAL,
and a validator that crashed on the input it was meant to reject.

Third, words used before they are explained (TTL, hash, FK, PRAGMA, WGS84, radians, data
quality, retail). Fourth, a self-check and bank where the key's length picked it out.

Negative controls: every reference prints its pin, a no-op mutation raises, starters run and
differ from the pin, the You Do reference passes its smoke path, and each You Do mutant fails it.
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
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section12 }} from {path!r};
console.log(JSON.stringify(section12));
"""


@lru_cache(maxsize=None)
def s12() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s12-apis-sql-geo.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S12 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s12()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def block_by_title(title: str) -> dict:
    hits = [b for b in s12()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s12()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s12()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s12()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts += [b["callout"]["title"], b["callout"]["content"]]
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], e.get("hint", ""), *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"], yd["portfolioNote"]]
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
    return [b for b in exam_bank.load_banks() if b["slug"] == "apis-sql-geo"][0]["questions"]


def key_length_ranks(questions: list[dict]) -> list[int]:
    """The key's rank by length among its options (1 = longest). A tie with the key fails."""
    ranks = []
    for i, q in enumerate(questions, 1):
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        assert lengths.count(key) == 1, f"item {i}: the key ties another option at {key} characters"
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


DICT_WALK = '''def collect_all(api):
    out = []
    for page in api:
        out.extend(api[page]["items"])
    return out'''

#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise now rejects.
MUTANTS = {
    "S12-T1-A-E2": [("WEDO-02.1 no type check", "    if not isinstance(payload, dict):\n        return None\n", "")],
    "S12-T1-A-E3": [("WEDO-03.1 an unlisted code gets an action", 'return "unknown"', 'return "fail_server"')],
    "S12-T1-B-E1": [("WEDO-04.1 equality counted as timeout", "if cost_s > timeout_s:", "if cost_s >= timeout_s:")],
    "S12-T1-B-E2": [("WEDO-05.1 the dict is walked instead of next", '''def collect_all(api):
    out = []
    page = 1
    while page is not None:
        chunk = api[page]
        out.extend(chunk["items"])
        page = chunk["next"]
    return out''', DICT_WALK)],
    "S12-T1-B-E3": [("WEDO-06.1 500 treated as transient", "return status in {429, 503}",
                     "return status == 429 or status >= 500")],
    "S12-T2-A-E1": [("WEDO-07.1 only None fails", "if not tok:", "if tok is None:")],
    "S12-T2-A-E3": [("WEDO-09.1 hard-coded status and cache_hit",
                     '"status_code": status,\n        "cache_hit": cache_hit,',
                     '"status_code": 200,\n        "cache_hit": False,')],
    "S12-T2-B-E1": [("WEDO-10.1 unsorted message", "{sorted(missing)}", "{sorted(missing, reverse=True)}")],
    "S12-T2-B-E3": [("WEDO-12.1 only the literal True is online",
                     'return "live_api" if online else "local_file"',
                     'return "live_api" if online is True else "local_file"')],
    "S12-T3-A-E1": [("WEDO-13.1 NOT NULL left out", "entity_id TEXT NOT NULL", "entity_id TEXT")],
    "S12-T3-A-E2": [("WEDO-14.1 an f-string UPDATE",
                     'con.execute("UPDATE clients SET name=? WHERE id=?", ("X", "C001\' OR \'1\'=\'1"))',
                     'uid = "C001\' OR \'1\'=\'1"\ncon.execute(f"UPDATE clients SET name=\'X\' WHERE id=\'{uid}\'")')],
    "S12-T3-A-E3": [("WEDO-15.1 the JOIN without WHERE", " WHERE c.id=? ORDER BY e.kind\",\n    (\"C001\",),",
                     " ORDER BY e.kind\",")],
    "S12-T3-B-E1": [("WEDO-16.1 quotes stripped by hand",
                     'con.execute("SELECT id FROM clients WHERE name = ?", (name,))',
                     'con.execute("SELECT id FROM clients WHERE name = \'" + name.replace("\'", "") + "\'")')],
    "S12-T3-B-E3": [("WEDO-18.1 an index on the wrong column", "ON clients(document_id)", "ON clients(id)")],
    "S12-T4-A-E3": [("WEDO-21.1 a blacklist", "return set(payload) <= ALLOWED",
                     'return not ({"address", "document_id"} & set(payload))')],
    "S12-T4-B-E2": [("WEDO-23.1 a flat formula",
                     "    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2\n"
                     "    return 2 * R * math.asin(math.sqrt(h))",
                     "    return R * math.hypot(dlat, dlon)")],
}

#: theory heading -> list of (finding, old, new)
THEORY_MUTANTS = {
    "Auth, secretos, caché y provenance": [
        ("THEORY-07.1 a failed fetch is cached", "    if 200 <= status < 300:  # solo un 2xx entra a la caché\n        CACHE[key]",
         "    if True:\n        CACHE[key]"),
    ],
    "Calidad de coordenada, Haversine, caché y política": [
        ("THEORY-16.1 the validator crashes on text", "        if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):\n            return False\n", ""),
    ],
    "Normalización y geocoding autorizado": [
        ("WEDO-20.1 the lookup title-cases the key", "coords = self.TABLE.get(city)", "coords = self.TABLE.get(city.strip().title())"),
    ],
}

DEMO_MUTANTS = {
    "S12-T1-B-DEMO": [("IDO-02.1 a constant page count", "        fetched += 1\n", "")],
    "S12-T2-A-DEMO": [("IDO-03.2 the token leaks into the manifest",
                       '"auth_scheme": "bearer",', '"auth_scheme": "bearer",\n        "token": os.environ["SIG_API_TOKEN"],')],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for e in s12()["weDo"]["steps"]:
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

    def test_starters_run_the_new_cases_and_differ_from_the_pin(self) -> None:
        needles = {
            "S12-T1-A-E2": 'parse_entity(["id", "region"])',
            "S12-T1-A-E3": "503, 401]",
            "S12-T1-B-E1": "fetch(2.0, 2.0)",
            "S12-T1-B-E2": '2: {"items": ["b", "c"], "next": None},\n    1:',
            "S12-T1-B-E3": "200, 500, 502]",
            "S12-T2-A-E1": '{"API_TOKEN": ""}',
            "S12-T2-A-E3": '"https://x", 404, True',
            "S12-T2-B-E1": '["lon", "lat"]',
            "S12-T2-B-E3": "(True, False, 1, 0)",
            "S12-T3-A-E1": '("E2", None, "geo")',
            "S12-T3-A-E2": '("C002", "Luis")',
            "S12-T3-A-E3": "('C002','Luis')",
            "S12-T3-B-E1": "Ana D'Ángelo",
            "S12-T3-B-E3": "index_info('idx_document_id')",
            "S12-T4-A-E3": '"note": "x"',
            "S12-T4-B-E2": "(-12.05, -77.125)",
        }
        for e in s12()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                if e["id"] in needles:
                    self.assertIn(needles[e["id"]], e["starterCode"]["code"])
                    self.assertIn(needles[e["id"]], e["solutionCode"]["code"])
                done = run_py(e["starterCode"]["code"])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_the_mutation_helper_refuses_a_no_op(self) -> None:
        sol = exercise("S12-T1-B-E3")["solutionCode"]
        with self.assertRaises(AssertionError):
            caught(sol["code"], sol["output"], sol["code"])
        # An edit that keeps the behaviour is not reported as a catch.
        self.assertFalse(caught(sol["code"], sol["output"], sol["code"].replace("{429, 503}", "{503, 429}")))


class TheoryAndDemosShowWhatTheySay(unittest.TestCase):
    def _mutate(self, code: dict, finding: str, old: str, new: str) -> None:
        self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not found")
        self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)),
                        f"the block still prints its pin with the mistake: {finding}")

    def test_theory_blocks_reject_their_mistake(self) -> None:
        for heading, mutants in THEORY_MUTANTS.items():
            for finding, old, new in mutants:
                with self.subTest(finding=finding):
                    self._mutate(block(heading)["code"], finding, old, new)

    def test_demos_reject_their_mistake(self) -> None:
        for demo_id, mutants in DEMO_MUTANTS.items():
            for finding, old, new in mutants:
                with self.subTest(finding=finding):
                    self._mutate(demo(demo_id)["code"], finding, old, new)

    def test_no_constant_is_printed_as_a_measurement(self) -> None:
        self.assertNotIn('print("token_logged", False)', demo("S12-T2-A-DEMO")["code"]["code"])
        self.assertNotIn('print("pages_fetched", 3,', demo("S12-T1-B-DEMO")["code"]["code"])

    def test_the_rollback_is_what_reverts_the_batch(self) -> None:
        # IDO-06.1 (P1) and SELFCHECK-07.1: executemany does not revert; the explicit rollback does,
        # and the count returns to the count before the batch.
        tx = block("Parámetros, transacciones, constraints e índices")
        self.assertEqual(tx["code"]["output"], "('rolled_back', 0)\n('sin_rollback', 2)")
        text = " ".join(tx["paragraphs"])
        self.assertIn("es el `ROLLBACK` (deshacer) explícito el que vuelve el lote **atómico**", text)
        self.assertNotIn("COUNT(*)==0", text)
        self.assertIn("conteo previo al lote", text)
        why = demo("S12-T3-B-DEMO")["why"]
        self.assertIn("Lo que revierte **todo** el batch es el `con.rollback()`", why)

    def test_the_cache_keeps_only_a_2xx(self) -> None:
        out = block("Auth, secretos, caché y provenance")["code"]["output"].splitlines()
        self.assertEqual(out[-2:], ["404 cache_hit False", "404 cache_hit False"])
        self.assertIn("second_hit True", out)

    def test_no_token_literal_in_the_secrets_block(self) -> None:
        code = block("Auth, secretos, caché y provenance")["code"]["code"]
        self.assertNotIn('os.environ["API_TOKEN"] =', code)

    def test_the_bash_correction_runs_in_a_new_repository(self) -> None:
        code = block("Contraejemplo: un token pegado en el código queda en el historial")["code"]["code"]
        self.assertIn("git init -q repo-nuevo && cd repo-nuevo", code)

    def test_one_contract_one_key_one_provider(self) -> None:
        theory = block("Contract tests y fallback")["code"]["code"]
        self.assertIn('REQUIRED = {"lat", "lon", "provider"}', theory)
        self.assertIn('REQUIRED = {"lat", "lon", "provider"}', demo("S12-T2-B-DEMO")["code"]["code"])
        text = learner_text()
        code = "\n".join([demo(d["demoId"])["code"]["code"] for d in s12()["iDo"]["steps"]])
        self.assertNotIn("authorized_mock", text + code)
        self.assertNotRegex(code, r"[\"']verdict[\"']")
        self.assertIn("'kinship_verdict': None", demo("S12-T4-B-DEMO")["code"]["output"])
        self.assertNotIn("(o `verdict: None`)", text)

    def test_money_is_text_read_back_as_decimal(self) -> None:
        # IDO-05.1, owner 2026-11-19: Decimal is the course's money type since S02, so S12 stores
        # the amount as TEXT and reads it back with Decimal, and shows why REAL and SQL SUM fail.
        sec = json.dumps(s12(), ensure_ascii=False)
        self.assertNotIn("amount_cents", sec)
        for code in (demo("S12-T3-A-DEMO")["code"]["code"], s12()["youDo"]["starterCode"]):
            self.assertNotIn("amount REAL", code)
            self.assertIn("amount TEXT NOT NULL", code)
        self.assertEqual(demo("S12-T3-A-DEMO")["code"]["output"], "case_row ('Ana', Decimal('120.50'), 'geo')")
        money = block("Contraejemplo: un monto guardado como REAL no vuelve igual")
        self.assertEqual(money["code"]["output"].splitlines(), [
            "REAL → 0.30000000000000004 | igual a 0.3: False",
            "TEXT + Decimal → 0.30 | igual a 0.30: True",
            "SUM en SQL sobre TEXT → 0.30000000000000004"])
        text = " ".join(money["paragraphs"])
        for needle in ("SQLite no tiene un tipo decimal", "siempre desde texto y nunca desde un float",
                       "`SUM` en SQL convierte el texto a float", "céntimos enteros"):
            with self.subTest(needle=needle):
                self.assertIn(needle, text)
        # The corrected half is exact only because the sum runs in Python on Decimal.
        code = money["code"]
        self.assertTrue(caught(code["code"], code["output"], code["code"].replace(
            "total = sum(Decimal(a) for (a,) in filas)", "total = sum(float(a) for (a,) in filas)")))

    def test_the_mock_uses_exact_keys_everywhere(self) -> None:
        out = block("Normalización y geocoding autorizado")["code"]["output"]
        self.assertIn("geo minúsculas None", out)
        self.assertNotIn(".title()` solo", learner_text())

    def test_the_validator_rejects_text_without_raising(self) -> None:
        self.assertIn("invalid_text False", block("Calidad de coordenada, Haversine, caché y política")["code"]["output"])


class WordsAndPolicy(unittest.TestCase):
    def test_timeout_is_retried_with_a_cap_everywhere(self) -> None:
        # WEDO-06.2: one answer to "is a timeout retried?" — yes, with the same cap, then offline.
        text = learner_text()
        self.assertNotIn("En N1: reintenta solo 429 y 503.", text)
        self.assertIn("En N1: reintenta solo 429, 503 y el timeout de red, siempre con tope de intentos.", text)
        self.assertIn("Un timeout no trae status: se reintenta con el mismo tope.", text)
        alt = block("Timeout, paginación, retry/backoff y rate limit")["figure"]["alt"]
        self.assertNotIn("DLQ", alt)
        self.assertNotIn("5xx reintenta", alt)

    def test_glosses_at_first_use(self) -> None:
        text = learner_text()
        for needle in ("data quality (la calidad de los datos)", "retail (comercio minorista)",
                       "con **TTL** (tiempo de vida de cada entrada)", "un hash de URL (un resumen corto",
                       "Una clave foránea (FK, *foreign key*)", "`PRAGMA` es un comando propio de SQLite",
                       "WGS84 (el sistema de latitud y longitud", "`math.radians` (sin y cos esperan radianes",
                       "`(0, 0)` pasa el rango porque es un punto válido"):
            with self.subTest(needle=needle):
                self.assertIn(needle, text)

    def test_hash_is_not_called_anonymous(self) -> None:
        text = learner_text()
        self.assertNotIn("sin volcar PII", text)
        self.assertIn("no lo anonimiza", demo("S12-T2-A-DEMO")["why"])

    def test_names_are_never_sent(self) -> None:
        self.assertNotIn("si la política lo prohíbe", learner_text())

    def test_one_city_list(self) -> None:
        self.assertEqual(exercise("S12-T4-A-E2")["title"], "MockGeocoder: Lima/Quito o None")
        self.assertNotIn("Quito/Santiago", learner_text())

    def test_the_intro_says_to_remove_the_ok_line(self) -> None:
        self.assertIn("Borra la última línea del starter, `print('ok', True)`", s12()["weDo"]["intro"])

    def test_hints_and_steps_name_the_right_thing(self) -> None:
        e = exercise("S12-T2-B-E2")
        self.assertEqual(e["hints"][0], "Mira primero si status es None; después 429 y los códigos 500 o más.")
        self.assertIn("los cinco casos del starter", e["instruction"])


YOUDO_IMPL = '''
def require_token(env):
    tok = env.get("API_TOKEN")
    if not tok:
        raise ValueError("API_TOKEN missing")
    return tok

def fetch(timeout_s, cost_s):
    return "timeout" if cost_s > timeout_s else "ok"

def should_retry(status):
    return status in {429, 503}

def fetch_with_fallback(status, local_body):
    if status is None or status == 429 or status >= 500:
        return local_body, "offline"
    if 200 <= status < 300:
        return {"online": True}, "online"
    return None, "fail_client"

def get_entity(store, entity_id):
    if entity_id not in store:
        return 404, {"error": "not_found"}
    return 200, store[entity_id]

def cached_get(cache, url, body_factory):
    if url in cache:
        return cache[url], True
    cache[url] = body_factory()
    return cache[url], False

def min_provenance(url, status, cache_hit):
    return {"source_url": url, "fetched_at": "2026-07-20T00:00:00Z",
            "status_code": status, "cache_hit": cache_hit}

def normalize_address(s):
    return re.sub(r"\\s+", " ", s.strip())

def allowed_for_public_geocoder(payload):
    return set(payload) <= {"city", "country"}

def _geocode(self, city):
    if city not in self.DB:
        return None
    lat, lon = self.DB[city]
    return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
MockGeocoder.geocode = _geocode

def haversine_km(a, b):
    R = 6371.0
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))

def as_relationship_signal(km):
    return {"type": "geo_distance_km", "value": km, "kinship_verdict": None}

def build_db():
    con = sqlite3.connect(":memory:")
    con.executescript("""
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT NOT NULL, document_id TEXT UNIQUE);
CREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT NOT NULL, amount TEXT NOT NULL);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL);
CREATE INDEX idx_evidence_entity_id ON evidence(entity_id);
""")
    con.execute("INSERT INTO clients VALUES (?, ?, ?)", ("C001", "Ana", "D-100"))
    con.execute("INSERT INTO transactions VALUES (?, ?, ?)", ("T1", "C001", str(Decimal("120.50"))))
    con.execute("INSERT INTO evidence VALUES (?, ?, ?)", ("E1", "C001", "geo"))
    return con

def case_join(con):
    row = con.execute(
        "SELECT c.name, t.amount, e.kind FROM clients c "
        "JOIN transactions t ON c.id = t.client_id "
        "JOIN evidence e ON c.id = e.entity_id WHERE c.id = ?", ("C001",)).fetchone()
    return (row[0], Decimal(row[1]), row[2]) if row else None
'''

YOUDO_SMOKE = """token_len 8
timeout timeout
retry 429 True
retry 500 False
fallback 503 ({'lat': -12.05, 'lon': -77.04}, 'offline')
fallback 404 (None, 'fail_client')
entity (200, {'id': 'C001', 'region': 'Lima'})
entity_missing (404, {'error': 'not_found'})
cache_hits False True
prov {'source_url': 'https://api.example.com/s', 'fetched_at': '2026-07-20T00:00:00Z', 'status_code': 200, 'cache_hit': True}
norm av larco 1
egress_ok True
egress_bad False
geo {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}
km 8.95
signal {'type': 'geo_distance_km', 'value': 8.95, 'kinship_verdict': None}
case_row ('Ana', Decimal('120.50'), 'geo')"""

#: (finding, old, new) applied to YOUDO_IMPL: the smoke path must expose each one.
YOUDO_MUTANTS = [
    ("YOUDO-01.3 a 404 path that always answers 200",
     '    if entity_id not in store:\n        return 404, {"error": "not_found"}\n    return 200, store[entity_id]',
     '    return 200, store.get(entity_id, {})'),
    ("YOUDO-01.1 no timeout", 'return "timeout" if cost_s > timeout_s else "ok"', 'return "ok"'),
    ("YOUDO-01.1 the fallback reports online", 'return local_body, "offline"', 'return {"online": True}, "online"'),
    ("IDO-05.1 the amount returned as raw text", "return (row[0], Decimal(row[1]), row[2]) if row else None",
     "return row"),
    ("YOUDO-01.5 the seeds left out", '    con.execute("INSERT INTO evidence VALUES (?, ?, ?)", ("E1", "C001", "geo"))\n', ""),
]


def youdo_program(impl: str) -> str:
    starter = s12()["youDo"]["starterCode"]
    head, guard = starter.split('\n\nif __name__ == "__main__":')
    return head + "\n" + impl + "\n\nmain()\n"


def run_youdo(impl: str, token: str | None = "syn-demo") -> subprocess.CompletedProcess:
    env = {k: v for k, v in os.environ.items() if k != "API_TOKEN"}
    if token is not None:
        env["API_TOKEN"] = token
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "cp_n1c_acquisition.py"
        path.write_text(youdo_program(impl), encoding="utf-8")
        return subprocess.run([sys.executable, "-E", "-s", str(path)], capture_output=True, text=True,
                              timeout=60, encoding="utf-8", cwd=tmp, env=env)


class YouDoSmokePath(unittest.TestCase):
    def test_the_starter_keeps_no_token(self) -> None:
        starter = s12()["youDo"]["starterCode"]
        self.assertNotIn("setdefault", starter)
        self.assertNotIn("syn-demo\")", starter)
        self.assertIn("API_TOKEN=syn-demo python cp_n1c_acquisition.py", starter)

    def test_the_starter_names_the_schema_seeds_and_index(self) -> None:
        starter = s12()["youDo"]["starterCode"]
        for needle in ("CREATE INDEX idx_evidence_entity_id ON evidence(entity_id);",
                       "entity_id TEXT NOT NULL, kind TEXT NOT NULL", "amount TEXT NOT NULL", 'str(Decimal("120.50"))',
                       "('Ana', Decimal('120.50'), 'geo')", 'print("entity_missing", get_entity(store, "C999"))',
                       'print("timeout", fetch(1.0, 3.0))', 'print("fallback 503"'):
            with self.subTest(needle=needle):
                self.assertIn(needle, starter)

    def test_the_reference_prints_the_smoke_path(self) -> None:
        done = run_youdo(YOUDO_IMPL)
        self.assertEqual(done.returncode, 0, done.stderr[-600:])
        self.assertEqual(done.stdout.rstrip("\n"), YOUDO_SMOKE)

    def test_without_a_token_it_fails_closed(self) -> None:
        done = run_youdo(YOUDO_IMPL, token=None)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("API_TOKEN missing", done.stderr)

    def test_each_mutant_shows_in_the_smoke_path(self) -> None:
        for finding, old, new in YOUDO_MUTANTS:
            with self.subTest(finding=finding):
                self.assertEqual(YOUDO_IMPL.count(old), 1, finding)
                done = run_youdo(YOUDO_IMPL.replace(old, new))
                self.assertNotEqual(done.stdout.rstrip("\n"), YOUDO_SMOKE, finding)

    def test_the_context_lists_what_main_prints(self) -> None:
        ctx = s12()["youDo"]["context"]
        for label in ("`timeout`", "`fallback`", "`entity_missing`", "`signal`", "`case_row`"):
            with self.subTest(label=label):
                self.assertIn(label, ctx)
        self.assertIn("Lima y Quito", ctx)


class SelfCheckAndBank(unittest.TestCase):
    def test_selfcheck_explanations_match_the_policy(self) -> None:
        qs = s12()["selfCheck"]["questions"]
        self.assertIn("Un 429 también es 4xx, pero es transitorio", qs[0]["explanation"])
        self.assertEqual(qs[6]["options"][qs[6]["correctIndex"]],
                         "COUNT(*) igual al conteo previo al lote (estado revertido)")

    def test_selfcheck_has_no_absurd_distractor(self) -> None:
        opts = [o for q in s12()["selfCheck"]["questions"] for o in q["options"]]
        for absurd in ("Ignorarse como 200", "Borrar el caché", "La forma recomendada en SQLite",
                       "Mejora el Haversine", "Es requerido por SQLite", "Fraude confirmado"):
            with self.subTest(absurd=absurd):
                self.assertNotIn(absurd, opts)

    def test_selfcheck_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(s12()["selfCheck"]["questions"])
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 2, ranks)

    def test_exam_18_names_the_table_without_unique(self) -> None:
        stems = [q["question"] for q in bank()]
        self.assertTrue(any(s.startswith("En la tabla `clients(id, document_id)` sin `UNIQUE` del ejercicio") for s in stems))

    def test_bank_has_no_length_cue(self) -> None:
        qs = bank()
        self.assertEqual(len(qs), 24)
        ranks = key_length_ranks(qs)
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 7, ranks)


if __name__ == "__main__":
    unittest.main()
