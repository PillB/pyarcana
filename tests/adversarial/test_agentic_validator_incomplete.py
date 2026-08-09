"""Regression: agentic validator must reject incomplete / template exercises."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_agentic_validator import (  # noqa: E402
    code_incomplete,
    justification_is_template,
    provenance_issues,
)


class TestIncompleteCode(unittest.TestCase):
    def test_placeholder_underscore(self):
        self.assertIsNotNone(code_incomplete("print(____)"))

    def test_sys_x_placeholder(self):
        self.assertIsNotNone(code_incomplete('import sys\nversion = sys.x.split()[0]\n'))

    def test_todo(self):
        self.assertIsNotNone(code_incomplete("raw = []\n# TODO\nprint(raw)"))

    def test_legitimate_print_x_loop(self):
        code = 'raw = ["  ", "Lima"]\nfor x in raw:\n    if not x.strip():\n        continue\n    print(x)\n'
        self.assertIsNone(code_incomplete(code))

    def test_complete_hello_sys(self):
        code = '''import sys
def main() -> None:
    nombre = "Maria Quispe"
    version = sys.version.split()[0]
    print(f"Hola, soy {nombre}")
    print(f"Python {version}")
if __name__ == "__main__":
    main()
'''
        self.assertIsNone(code_incomplete(code))

    def test_unclosed_paren(self):
        self.assertIsNotNone(code_incomplete("print(json.dumps(manifest, ensure_ascii=False)"))


class TestTemplateJustification(unittest.TestCase):
    def test_template_rejected(self):
        j = "Explorer: ejercicio S01-T1-A-E1. Completé starterCode con patrones del iDo del mismo subtopic en el paquete."
        self.assertTrue(justification_is_template(j))

    def test_rich_justification_ok(self):
        j = (
            "[B1/Explorer] Resuelvo S01-T1-A-E2 siguiendo la instrucción: crea hello_sys.py. "
            "Demo S01-T1-B-DEMO usa import sys y sys.version.split. "
            'Mi código: print(f"Hola, soy {nombre}") y if __name__.'
        )
        self.assertFalse(justification_is_template(j))


def clean_meta():
    return {
        "evidence_origin": "live_agentic_transcript",
        "generation_mode": "fresh_sequential_packet_read",
        "restart_from": "landing",
        "code_execution_used": False,
    }


def clean_live(agent_id: str, answer: str):
    return {
        "method": "live_agentic_packet_only_no_execution",
        "artifact_origin": "direct_agent_output",
        "restart_from": "landing",
        "code_execution_used": False,
        "agent_instance_id": agent_id,
        "exercises": [{"exercise_id": "E1", "answer": answer}],
        "selfcheck": [{"question_index": 0, "chosen_index": 1, "justification": answer}],
    }


class TestProvenance(unittest.TestCase):
    def test_distinct_direct_live_agents_pass_provenance(self):
        issues = provenance_issues(
            clean_meta(),
            {
                "newbie_a": clean_live("agent-a-1234", "respuesta A"),
                "newbie_b": clean_live("agent-b-5678", "respuesta B"),
            },
        )
        self.assertEqual(issues, [])

    def test_rebuild_meta_is_rejected_even_if_method_claims_live(self):
        meta = {**clean_meta(), "source_exercises": "attempt_007b"}
        issues = provenance_issues(
            meta,
            {
                "newbie_a": clean_live("agent-a-1234", "respuesta A"),
                "newbie_b": clean_live("agent-b-5678", "respuesta B"),
            },
            has_rebuild_report=True,
        )
        self.assertIn("TAINTED_ATTEMPT_ORIGIN", {i["tag"] for i in issues})

    def test_same_agent_id_is_rejected(self):
        issues = provenance_issues(
            clean_meta(),
            {
                "newbie_a": clean_live("agent-same-1", "respuesta A"),
                "newbie_b": clean_live("agent-same-1", "respuesta B"),
            },
        )
        self.assertIn("SAME_AGENT_REUSED", {i["tag"] for i in issues})

    def test_code_execution_is_rejected(self):
        a = clean_live("agent-a-1234", "respuesta A")
        a["code_execution_used"] = True
        issues = provenance_issues(
            clean_meta(),
            {"newbie_a": a, "newbie_b": clean_live("agent-b-5678", "respuesta B")},
        )
        self.assertIn("PROVENANCE_AGENT_INVALID", {i["tag"] for i in issues})


if __name__ == "__main__":
    unittest.main()
