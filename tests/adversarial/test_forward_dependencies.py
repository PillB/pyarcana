"""A construct may not appear before the section that teaches it.

Two of these are decided policy, not preference:

  D9 — `def main()` and `if __name__ == "__main__":` belong where a learner genuinely stops
       treating a file as a script and imports it as a module. S01 asked a beginner to rebuild
       the guard from blanks while its own callout said a script needs neither, and the repo's
       validator *failed* `hello_sys.py` without them.
  D10 — `try`/`except` belongs at the error-handling lesson. It was invisible until a glossary
       alias covered the keyword, and then showed 67 occurrences across S02-S08, several inside
       the cumulative capstone.

The teaching section is resolved by its `id`, not by a number, so a rename cannot silently move
the boundary. `.__name__` on an object is a different thing — S02 prints `type(x).__name__` —
and is deliberately not matched.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"


def active_sections() -> list[tuple[int, str, Path, str]]:
    """(index, id, path, source) for the sections index.ts actually imports, in order."""
    imported = re.findall(r"from '\./sections/([^']+)'", INDEX.read_text(encoding="utf-8"))
    out = []
    for name in imported:
        path = SECTIONS / f"{name}.ts"
        src = path.read_text(encoding="utf-8")
        sid = re.search(r"^\s*id:\s*['\"]([^'\"]+)", src, re.M)
        idx = re.search(r"^\s*index:\s*(\d+)", src, re.M)
        if sid and idx:
            out.append((int(idx.group(1)), sid.group(1), path, src))
    return sorted(out)


def index_of(section_id: str) -> int:
    for idx, sid, _, _ in active_sections():
        if sid == section_id:
            return idx
    raise AssertionError(f"no active section has id {section_id!r}")


def offenders(pattern: re.Pattern[str], before_index: int) -> list[str]:
    found = []
    for idx, sid, path, src in active_sections():
        if idx >= before_index:
            continue
        for m in pattern.finditer(src):
            line = src[: m.start()].count("\n") + 1
            found.append(f"S{idx:02d} {path.name}:{line} {m.group(0)!r}")
    return found


class ForwardDependencyTests(unittest.TestCase):
    def test_entrypoint_guard_waits_for_the_section_that_teaches_modules(self) -> None:
        """D9: no `main()` entrypoint before a learner imports their own module."""
        teaches = index_of("modules-packaging-cli")
        guard = offenders(re.compile(r"if __name__\s*==|def main\s*\("), teaches)
        self.assertEqual(
            guard, [],
            "the entrypoint idiom needs def, if and import; it cannot precede the section that "
            "teaches modules (D9)",
        )

    def test_exception_handling_waits_for_the_section_that_teaches_it(self) -> None:
        """D10: no `try`/`except` before the error-handling lesson."""
        teaches = index_of("exceptions-logging")
        caught = offenders(re.compile(r"\btry\s*:|\bexcept\b"), teaches)
        self.assertEqual(
            caught, [],
            "catching an exception before the section that teaches exceptions is a forward "
            "dependency (D10)",
        )

    def test_the_teaching_sections_still_teach_them(self) -> None:
        """The boundary is only meaningful if the construct is taught on the other side of it."""
        by_id = {sid: src for _, sid, _, src in active_sections()}
        self.assertIn("__name__", by_id["modules-packaging-cli"])
        self.assertRegex(by_id["exceptions-logging"], r"\bexcept\b")


if __name__ == "__main__":
    unittest.main()
