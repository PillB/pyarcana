import importlib.util
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/glossary_first_use.py"
FIXTURES = ROOT / "tests/fixtures/glossary_first_use_mutations.json"


def load_audit_module():
    spec = importlib.util.spec_from_file_location("glossary_intro_audit", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_mutation_cases_detect_only_their_expected_defects():
    audit = load_audit_module().audit_concept_events
    cases = json.loads(FIXTURES.read_text(encoding="utf-8"))

    for case in cases:
        payload = {
            "active_section_ids": ["s01", "s02"],
            "terms": [
                {
                    "id": "terminal",
                    "firstSectionId": case.get("firstSectionId", "s01"),
                }
            ],
            "events": case["events"],
        }
        result = audit(payload)
        codes = [issue["code"] for issue in result["issues"]]

        assert codes == case["expected_codes"], case["name"]
        assert result["ok"] is (not case["expected_codes"]), case["name"]
