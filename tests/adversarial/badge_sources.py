"""Read the badge catalog and the course source, shared by the badge identity guards.

Not a test module (the runner collects test_*.py only). The course is read from its own source:
the active sections are the COURSE_SECTIONS array of src/lib/course/index.ts, and each section's
`id`, `index`, `phase`, `title` and learningOutcomes text come from its file. Strings are matched
per quote style, so an apostrophe inside a double-quoted title or outcome does not cut it short
(the first version of this reader did, and two outcomes parsed wrongly until it was fixed).
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "src/lib/eligibility/section_manifest.json"
CATALOG = ROOT / "src/lib/eligibility/badge_catalog.json"
COURSE_INDEX = ROOT / "src/lib/course/index.ts"
SECTIONS_DIR = ROOT / "src/lib/course/sections"

#: A required section is a bare tag: credential-gates.ts requiredSectionIds() reads /^S(\d{2})$/
#: and throws on anything else. A required activity may carry a kind (S13-YOUDO, S13-EXAM).
SECTION_TOKEN = re.compile(r"^S(\d{2})$")
TOKEN = re.compile(r"^S(\d{2})(?:-[A-Z]+)?$")
#: A TypeScript string literal in either quote style. Two groups; exactly one is set.
STRING = r"""(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')"""


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _group(match: re.Match) -> str | None:
    return next((g for g in match.groups() if g is not None), None)


def _field(head: str, name: str, value: str) -> str | None:
    match = re.search(rf"^\s+{name}:\s*{value}", head, re.M)
    return match.group(1) if match else None


def _string_field(head: str, name: str) -> str | None:
    match = re.search(rf"^\s+{name}:\s*{STRING}", head, re.M)
    return _group(match) if match else None


def outcomes_of(text: str) -> list[str]:
    """The learningOutcomes texts of one section file, in order."""
    block = re.search(r"learningOutcomes:\s*\[(.*?)\n\s*\]", text, re.S)
    if not block:
        return []
    return [_group(m) for m in re.finditer(rf"\btext:\s*{STRING}", block.group(1))]


def source_sections(course_index: Path = COURSE_INDEX, sections_dir: Path = SECTIONS_DIR) -> list[dict]:
    """The active sections, in COURSE_SECTIONS order, read from their own source files."""
    text = course_index.read_text(encoding="utf-8")
    block = re.search(r"export const COURSE_SECTIONS[^=]*=\s*\[(.*?)\n\]", text, re.S).group(1)
    imports = dict(re.findall(r"import \{ (section\d\d) \} from '\./sections/([^']+)'", text))
    out = []
    for position, var in enumerate(re.findall(r"\b(section\d\d)\b", block), start=1):
        source = (sections_dir / (imports[var] + ".ts")).read_text(encoding="utf-8")
        head = "\n".join(source.splitlines()[:60])
        out.append({
            "position": position,
            "index": int(_field(head, "index", r"(\d+)")),
            "slug": _string_field(head, "id"),
            "phase": int(_field(head, "phase", r"(\d)")),
            "title": _string_field(head, "title"),
            "outcomes": outcomes_of(source),
        })
    return out


def token_number(token: str, pattern: re.Pattern = TOKEN) -> int | None:
    """The section number in a catalog tag, or None when the tag is not shaped like one."""
    match = pattern.match(token)
    return int(match.group(1)) if match else None


def section_number(token: str) -> int | None:
    """The section number in a required_sections tag, which must be a bare `Sxx`."""
    return token_number(token, SECTION_TOKEN)


def cited_numbers(badge: dict) -> set[int]:
    tokens = list(badge.get("required_sections", [])) + list(badge.get("required_activities", []))
    return {n for n in (token_number(t) for t in tokens) if n is not None}


def section_slugs(manifest: dict) -> dict[int, str]:
    """Section number to slug, from the manifest: the one place a number is bound to a section."""
    return {s["index"]: s["slug"] for s in manifest["sections"]}


def normalise(text: str) -> str:
    """Lower case, accents removed: one spelling per word for the lexicon and its matches."""
    decomposed = unicodedata.normalize("NFKD", text)
    return "".join(c for c in decomposed if not unicodedata.combining(c)).lower()
