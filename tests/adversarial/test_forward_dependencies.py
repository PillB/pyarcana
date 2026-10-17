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

import json
import re
import tempfile
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


_BINDING_RE = re.compile(r"import \{ (section\d\d) \} from '\./sections/(s\d\d)-([^']+)'")
_ARRAY_RE = re.compile(r"COURSE_SECTIONS: CourseSection\[\] = \[(.*?)\n\]", re.S)


def binding_mismatches(root: Path) -> list[str]:
    """Each way a section's number can disagree with itself, one named string per defect.

    A section's number lives in four places: its import binding (`sectionNN`), its file name
    (`sNN-slug.ts`), its `index:`, and its slot in COURSE_SECTIONS. A renumber that moves some of
    them and not others is the defect G-2 exists for. The array must also list the bindings in
    import order, so a section cannot be orphaned from the course.
    """
    index_ts = (root / "src/lib/course/index.ts").read_text(encoding="utf-8")
    bindings = _BINDING_RE.findall(index_ts)
    array = _ARRAY_RE.search(index_ts)
    if array is None:
        return ["src/lib/course/index.ts: COURSE_SECTIONS array not found"]
    slots = re.findall(r"section\d\d", array.group(1))
    out = []
    if slots != [name for name, _, _ in bindings]:
        out.append(f"COURSE_SECTIONS lists {slots}, which does not follow the import bindings")
    for position, (name, prefix, slug) in enumerate(bindings, start=1):
        out.extend(_number_defects(root, position, name, prefix, slug))
    return out


def _number_defects(root: Path, position: int, name: str, prefix: str, slug: str) -> list[str]:
    where = f"{name} (slot {position})"
    path = root / "src/lib/course/sections" / f"{prefix}-{slug}.ts"
    if not path.exists():
        return [f"{where}: imports ./sections/{prefix}-{slug}, which does not exist"]
    declared = _declared_index(path.read_text(encoding="utf-8"))
    defects = []
    if int(name[-2:]) != position:
        defects.append(f"{where}: the binding is numbered {int(name[-2:])}")
    if int(prefix[1:]) != position:
        defects.append(f"{where}: {path.name} is numbered {int(prefix[1:])}")
    if declared != position:
        defects.append(f"{where}: index: is {declared} in {path.name}")
    return defects


def _declared_index(src: str) -> int | None:
    found = re.search(r"^\s*index:\s*(\d+)", src, re.M)
    return int(found.group(1)) if found else None


PLAYGROUNDS = ROOT / "src/components/course/SectionView.tsx"
CAPSTONES = ROOT / "course-state/capstones"


def playground_sources() -> list[tuple[int, Path, str]]:
    """(section index, path, source) for each Theory-tab playground, keyed by its section id.

    The playground is Python the learner runs on the page, and it lives outside the section
    files, so a sweep of `sections/` alone reports a section clean while the code under its
    Theory tab still shows the construct.
    """
    order = {sid: idx for idx, sid, _, _ in active_sections()}
    src = PLAYGROUNDS.read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r"^\s{4}'([a-z0-9-]+)': \{", src, re.M):
        sid = m.group(1)
        if sid not in order:
            continue
        end = src.find("\n    },", m.end())
        out.append((order[sid], PLAYGROUNDS, src[m.start() : end if end > 0 else len(src)]))
    return out


def capstone_starters() -> list[tuple[int, Path, str]]:
    """(gate section index, path, source) for each capstone STARTER the learner opens.

    A starter is the learner's own file; its gate.json says which section hands it over, and a
    construct in it lands as early as that section does.

    `gate_section` holds the section's SXX tag. It used to be looked up among the slug ids, which
    matched nothing, so until 2026-10-03 this returned no starter at all and the scan reported
    them clean without reading one. An unreadable gate.json or an unknown tag now fails rather
    than being skipped: either way the scan would otherwise be narrower than it says.
    """
    order = {f"S{idx:02d}": idx for idx, _, _, _ in active_sections()}
    out = []
    for gate in sorted(CAPSTONES.glob("*/gate.json")):
        tag = json.loads(gate.read_text(encoding="utf-8")).get("gate_section")
        if tag not in order:
            raise AssertionError(f"{gate.relative_to(ROOT)}: gate_section {tag!r} is no active section")
        for starter in sorted((gate.parent / "STARTER").glob("*.py")):
            out.append((order[tag], starter, starter.read_text(encoding="utf-8")))
    return out


def offenders(pattern: re.Pattern[str], before_index: int) -> list[str]:
    found = []
    scanned = [(idx, path, src) for idx, _, path, src in active_sections()]
    scanned += playground_sources() + capstone_starters()
    for idx, path, src in scanned:
        if idx >= before_index:
            continue
        for m in pattern.finditer(src):
            line = src[: m.start()].count("\n") + 1
            found.append(f"S{idx:02d} {path.name}:{line} {m.group(0)!r}")
    return sorted(found)


# A ratchet, the same shape as `chore(lint)`'s complexity gate. The target is zero; these are
# the counts still owed, section rounds are removing them, and each number may only go down.
# Two ways to fail, both deliberate:
#   - a new offender appears            -> someone wrote the construct early again;
#   - the count drops below the baseline -> the work landed, so lower the number here, or the
#                                           gate quietly stops protecting what was just fixed.
# 2026-09-17: S01 went from 20 entrypoint sites to 0 (D9).
# 2026-09-21: S02-S08 followed — the You Do starters run their demo at top level and the
# requirements say so. The scan now also reads the Theory-tab playgrounds and the capstone
# STARTER files, which are learner code living outside sections/ (both clean). What is left is
# 2026-09-21 (later the same day): S09 followed. Its guard protected a demo that a separate
# test_audit_log.py imported, so the three checks moved into audit_log.py itself (D11's rewrite
# rung) and S10 now earns `__name__` with that exact case — the learner's own file running its
# demo on import. D9 is at zero across the course and is held there, not ratcheted.
D9_OWED = 0
# 2026-09-21: 98 -> 106, and this is not a relaxation. Widening the scan to the Theory-tab
# playgrounds put 8 `try`/`except` sites under the gate that no scan had ever read
# (SectionView.tsx, the sections before S09). They were unprotected debt; now they are counted
# debt, and the ratchet holds them. The number may only go down from here.
# 2026-09-21: 106 -> 86. S05's twenty are gone: the section keeps every `raise` (a contract
# that refuses bad input is its subject) and stopped catching them — a refused call is now shown
# as the last line of the traceback in a comment, and the batch exercise checks each row before
# calling instead of catching after. S02 and S04's sites wait on the Q3 route, which is an owner
# question; S06, S07, S08 and the playgrounds are next.
# 2026-09-21: 86 -> 64. S06 and S07 followed S05's two patterns — check the type before
# mutating (the tuple's refusal is shown as the message Python prints, not run), and a batch that
# validates each row before calling instead of catching after.
# 2026-09-21: 64 -> 35. S08 was the hard one — the section before S09, whose subject is files
# that may be malformed. Its atomic write is linear, its rows are validated before conversion, a
# `for` replaces `next(reader)` with StopIteration, and each refusal is shown as the line Python
# would print. The four Theory-tab playgrounds before S09 followed. What remains is S02 (24) and
# S04 (11), inside CP-N1-A, which wait on the Q3 route — an owner question.
# 2026-09-26: 13 -> 10. The owner chose route 2: CP-N1-A's parsing-with-recovery half moves to
# S09, and S02's You Do became the raw/clean/value walk, which shows the failing conversion as a
# line to run on its own instead of catching it.
# 2026-10-03: the starter half of the 2026-09-21 widening had read nothing - gate.json holds SXX
# tags and the lookup used slug ids, so "(both clean)" above was never measured. Fixed; the 12
# starters now scanned add no site to D9 or D10, so both numbers stand.
D10_OWED = 10


class ForwardDependencyTests(unittest.TestCase):
    def _ratchet(self, found: list[str], owed: int, rule: str) -> None:
        self.assertLessEqual(
            len(found), owed,
            f"{rule}: {len(found)} sites, more than the {owed} still owed — a new one was added:\n"
            + "\n".join(found),
        )
        self.assertEqual(
            len(found), owed,
            f"{rule}: only {len(found)} sites remain — lower the owed count in this file to "
            f"{len(found)} so the ratchet keeps what was fixed",
        )

    def test_entrypoint_guard_waits_for_the_section_that_teaches_modules(self) -> None:
        """D9: no `main()` entrypoint before a learner imports their own module."""
        teaches = index_of("modules-packaging-cli")
        guard = offenders(re.compile(r"if __name__\s*==|def main\s*\("), teaches)
        self._ratchet(guard, D9_OWED, "D9 (the entrypoint idiom before S10 teaches modules)")

    def test_exception_handling_waits_for_the_section_that_teaches_it(self) -> None:
        """D10: no `try`/`except` before the error-handling lesson."""
        teaches = index_of("exceptions-logging")
        caught = offenders(re.compile(r"\btry\s*:|\bexcept\b"), teaches)
        self._ratchet(caught, D10_OWED, "D10 (try/except before S09 teaches exceptions)")

    def test_section_one_is_already_clean(self) -> None:
        """The first section is done, so it is held at zero outright, not by the ratchet."""
        s01 = [x for x in offenders(re.compile(r"if __name__\s*==|def main\s*\(|\btry\s*:|\bexcept\b"),
                                    index_of("basics")) if x.startswith("S01")]
        self.assertEqual(s01, [], "S01 must not carry the entrypoint idiom or exception handling")

    def test_the_teaching_sections_still_teach_them(self) -> None:
        """The boundary is only meaningful if the construct is taught on the other side of it."""
        by_id = {sid: src for _, sid, _, src in active_sections()}
        self.assertIn("__name__", by_id["modules-packaging-cli"])
        self.assertRegex(by_id["exceptions-logging"], r"\bexcept\b")

    def test_every_capstone_starter_is_scanned(self) -> None:
        """The scan is only as wide as this list, and the list was empty for every capstone."""
        on_disk = sorted(p for gate in CAPSTONES.glob("*/gate.json")
                         for p in (gate.parent / "STARTER").glob("*.py"))
        self.assertGreater(len(on_disk), 0, "no capstone STARTER files found to scan")
        self.assertEqual(sorted(p for _, p, _ in capstone_starters()), on_disk)

    def test_each_section_number_agrees_across_its_binding(self) -> None:
        """G-2: the import binding, the file name, `index:` and the array slot agree.

        `active_sections()` sorts by `index:`, so a binding renumbered without its `index:` moves
        every D9 and D10 boundary silently. The real tree must agree, and every disagreement must
        be reported by name.
        """
        self.assertEqual(binding_mismatches(ROOT), [])

    def test_a_renumber_that_leaves_index_behind_is_reported(self) -> None:
        """G-2 recreation on a fixture: each defect a renumber can leave must be named."""
        cases = {
            "stale index:": {"index": {"s02-b": 7}},
            "file renamed alone": {"file": {"s02-b": "s07-b"}},
            "file and import renamed, number kept": {"moved": {"s02-b": "s07-b"}},
            "binding renamed alone": {"binding": {"section02": "section07"}},
        }
        for label, mutation in cases.items():
            with self.subTest(defect=label), tempfile.TemporaryDirectory() as tmp:
                root = write_course_fixture(Path(tmp), **mutation)
                found = binding_mismatches(root)
                self.assertTrue(found, f"a fixture with a {label} defect passed the guard")


def write_course_fixture(root: Path, index=None, file=None, binding=None, moved=None) -> Path:
    """A two-section course tree. Each keyword plants one renumber defect in it.

    `file` renames a section file and leaves its import behind; `moved` renames the file and its
    import together; `index` and `binding` set `index:` and the binding name directly.
    """
    index, file, binding, moved = index or {}, file or {}, binding or {}, moved or {}
    sections = root / "src/lib/course/sections"
    sections.mkdir(parents=True)
    names = {"s01-a": 1, "s02-b": 2}
    for slug, number in names.items():
        stem = file.get(slug, moved.get(slug, slug))
        body = f"export const x = {{\n  id: 'sec-{slug}',\n  index: {index.get(slug, number)},\n}}\n"
        (sections / f"{stem}.ts").write_text(body, encoding="utf-8")
    imports = "".join(
        f"import {{ {binding.get(f'section{n:02d}', f'section{n:02d}')} }} from './sections/{moved.get(slug, slug)}'\n"
        for slug, n in names.items()
    )
    array = ", ".join(binding.get(f"section{n:02d}", f"section{n:02d}") for n in (1, 2))
    (root / "src/lib/course/index.ts").write_text(
        imports + f"export const COURSE_SECTIONS: CourseSection[] = [\n  {array},\n]\n",
        encoding="utf-8",
    )
    return root


if __name__ == "__main__":
    unittest.main()
