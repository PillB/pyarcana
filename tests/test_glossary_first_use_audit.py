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


def _payload(events):
    return {
        "active_section_ids": ["alpha", "beta"],
        "terms": [{"id": "cuartil", "firstSectionId": "alpha"}],
        "events": events,
    }


def test_a_block_heading_that_names_what_the_block_defines_is_not_a_violation():
    """Name the subject, then teach it — that is how a section is written.

    The events are ordered, and a block's heading is emitted before its paragraphs, so
    "Cuartiles, IQR y cercas de Tukey" followed by the paragraph defining a quartile read as
    use-before-definition to a purely positional audit. It is not one.
    """
    audit = load_audit_module().audit_concept_events
    result = audit(
        _payload(
            [
                {
                    "section_id": "alpha",
                    "display_order": 1,
                    "kind": "theory.heading",
                    "location": "alpha.theory[8].heading",
                    "mentions": ["cuartil"],
                },
                {
                    "section_id": "alpha",
                    "display_order": 2,
                    "kind": "theory.paragraph",
                    "location": "alpha.theory[8].p1",
                    "mentions": ["cuartil"],
                    "defines": ["cuartil"],
                },
            ]
        )
    )
    assert result["ok"], result["issues"]


def test_a_heading_that_names_a_term_a_later_block_defines_is_still_a_violation():
    audit = load_audit_module().audit_concept_events
    result = audit(
        _payload(
            [
                {
                    "section_id": "alpha",
                    "display_order": 1,
                    "kind": "theory.heading",
                    "location": "alpha.theory[2].heading",
                    "mentions": ["cuartil"],
                },
                {
                    "section_id": "alpha",
                    "display_order": 9,
                    "kind": "theory.paragraph",
                    "location": "alpha.theory[8].p1",
                    "mentions": ["cuartil"],
                    "defines": ["cuartil"],
                },
            ]
        )
    )
    codes = [issue["code"] for issue in result["issues"]]
    assert codes == ["USE_BEFORE_DEFINITION"], result["issues"]
