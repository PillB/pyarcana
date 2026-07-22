"""Regression: agentic validator must reject incomplete / template exercises."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_agentic_validator import code_incomplete, justification_is_template  # noqa: E402


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


if __name__ == "__main__":
    unittest.main()
