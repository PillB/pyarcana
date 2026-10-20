"""A temporary course the real fixer gate can measure.

tools/fixer/gate.py measures a section by running the course's own audits through npx, tsx and a Python
3.12, and every one of them reads a whole course. The three-section course of numbering_fixture.py has the
shape the numbering tools read (an id, an index, a title) and nothing else, and the first audit that reads
more, scripts/course_event_extractor.mts, stops on it: "Cannot read properties of undefined (reading
'forEach')". test_fixer_tool_boundaries.py used to put a one-line stand-in where gate.py belongs, which hid
that. The owner's decision O26 (b) is to run the real gate instead, so this module is the setup for real:

  * every section is complete: a tagline, outcomes, a theory block with a code block and its declared
    output, the three practice stages, a self-check and resources;
  * the audit scripts, the glossary the audits match terms against, and the fixer tools are copies of
    the repository's own, so their ROOT is the temporary course and nothing they write reaches the repository;
  * node_modules is the repository's, linked in, because tsx is not installed anywhere else;
  * `.venv-content/bin/python`, which gate.py runs the strict-output audit under, is the interpreter running
    the suite, behind a recorder that logs each call and then runs it for real (content_interpreter; owner
    decision O27 100-Q1). scripts/run_adversarial_py.py already refuses any interpreter but 3.12, and the
    audit refuses any other itself. The packages requirements-content.txt pins are not installed here: the
    temporary course imports none, so those pins stay with `npm run test:python-content`;
  * the badge catalog and the capstone index are one badge and one capstone over these three sections,
    so the readiness audit has the files it reads and nothing to report.

It is not a test file (the runner collects `test_*.py` only).
"""
from __future__ import annotations

import json
import shlex
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from numbering_fixture import ROUND_FILED, build, registry, standing_documents, write  # noqa: E402

SLUGS = ("alpha", "beta", "gamma")

#: The recorder's log, next to the interpreter it records (see content_interpreter).
INTERPRETER_CALLS = ".venv-content/bin/python.calls"

#: A sentence that uses no term of the glossary, so a section holding it has nothing unexplained.
NEUTRAL = "Nothing technical is mentioned here."

#: `lambda` is a term of src/lib/glossary/terms.ts that nothing in a temporary course defines, so a
#: section holding this sentence uses a concept before any definition of it: the course's own concept map
#: lists it as a surprising use, and the concepts brief is built from that list.
UNEXPLAINED = "A lambda appears here and nothing says what it is."


def section_source(number: int, slug: str, paragraph: str) -> str:
    """One complete section: every field course_event_extractor.mts and the audits after it read."""
    return f"""export const section{number}: CourseSection = {{
  id: '{slug}',
  index: {number},
  title: 'Section {number}',
  shortTitle: 'Section {number}',
  tagline: 'A section of the temporary course.',
  estimatedHours: 1,
  level: 'beginner',
  icon: 'Code',
  accentColor: 'from-blue-500 to-cyan-500',
  learningOutcomes: [{{ text: 'Read one short text.' }}],
  jobRelevance: 'It exists so the gate has a course to measure.',
  theory: [
    {{
      subtopicId: 'S{number:02d}-T1-A',
      heading: 'First topic',
      paragraphs: ['{paragraph}'],
      code: {{
        language: 'python',
        code: `print("hello {number}")`,
        explanation: 'It prints a greeting.',
        output: `hello {number}`,
      }},
    }},
  ],
  iDo: {{ intro: 'Watch it done.', steps: [] }},
  weDo: {{ intro: 'Do it together.', steps: [] }},
  youDo: {{
    title: 'Project',
    context: 'A short project.',
    objectives: ['Write one line.'],
    requirements: ['Use one line.'],
    portfolioNote: 'None.',
    rubric: [{{ criterion: 'It works.', weight: '100%' }}],
  }},
  selfCheck: {{ questions: [] }},
  resources: {{ docs: [], books: [], courses: [] }},
}}
"""


def write_sections(root: Path, paragraphs: dict[int, str] | None = None) -> None:
    """Rewrite each section file of the course `build()` made, keeping its name, id and index.

    `paragraphs` maps a section number to the one paragraph its theory block holds; the others hold NEUTRAL."""
    for number, slug in enumerate(SLUGS, 1):
        paragraph = (paragraphs or {}).get(number, NEUTRAL)
        write(root, f"src/lib/course/sections/s{number:02d}-{slug}.ts", section_source(number, slug, paragraph))


def install_tooling(root: Path) -> None:
    """Copy the fixer tools and the audits' scripts into the course, and give it node and an interpreter."""
    shutil.copytree(ROOT / "tools/fixer", root / "tools/fixer", ignore=shutil.ignore_patterns("__pycache__"))
    (root / "scripts").mkdir()
    for script in sorted((ROOT / "scripts").iterdir()):
        if script.is_file() and script.suffix in (".py", ".mts"):
            shutil.copy(script, root / "scripts" / script.name)
    (root / "src/lib/glossary").mkdir(parents=True)
    shutil.copy(ROOT / "src/lib/glossary/terms.ts", root / "src/lib/glossary/terms.ts")
    shutil.copy(ROOT / "audit/fixer/known_false_claims.json", root / "audit/fixer/known_false_claims.json")

    packages = ROOT / "node_modules"
    if not (packages / ".bin/tsx").exists():
        raise RuntimeError(f"{packages} has no tsx: install the dependencies; the real gate cannot run without them")
    (root / "node_modules").symlink_to(packages, target_is_directory=True)

    content_interpreter(root)


def content_interpreter(root: Path) -> Path:
    """`.venv-content/bin/python` of a temporary course: the suite's own Python 3.12, behind a recorder.

    Owner decision O27 100-Q1: a recorder around a real call is not a test double. The script appends its
    arguments to INTERPRETER_CALLS and then `exec`s the real interpreter with them, so the audit that runs
    under it is the real audit on the real 3.12 and nothing is faked. What the recorder adds is evidence of
    which interpreter a caller chose. A plain link to the same Python could not tell `.venv-content/bin/python`
    from PATH's `python3` (both reach one 3.12), so a gate that ran its strict audit under `python3` kept
    every test green; in the real repository that is whatever `python3` is, 3.9 in older sessions, where the
    audit refuses, the measure is empty, and the gate prints "not measurable" instead of failing.
    """
    interpreter = root / ".venv-content/bin/python"
    interpreter.parent.mkdir(parents=True)
    interpreter.write_text(
        "#!/bin/sh\n"
        "printf '%s\\n' \"$*\" >> \"$0.calls\"\n"
        f"exec {shlex.quote(sys.executable)} \"$@\"\n", encoding="utf-8")
    interpreter.chmod(0o755)
    return interpreter


def interpreter_calls(root: Path) -> list[str]:
    """The arguments of every call made to the course's `.venv-content/bin/python`, one string per call."""
    log = root / INTERPRETER_CALLS
    return log.read_text(encoding="utf-8").splitlines() if log.exists() else []


def gate_ready_course(root: Path, paragraphs: dict[int, str] | None = None) -> None:
    """A three-section course, a stamped registry and everything the real gate and the fixer runners read.

    Nothing the gate regenerates is written here (no concept map, no event cache, no report): a file the
    fixture wrote and the gate then replaced would be a second source of the same fact."""
    build(root, SLUGS)
    registry(root, ROUND_FILED, stamp=len(SLUGS))
    standing_documents(root)
    write_sections(root, paragraphs)
    write(root, "src/lib/eligibility/badge_catalog.json", json.dumps({"badges": [{
        "badge_id": "temporary_badge", "credential_type": "applied_skill",
        "required_sections": ["S01", "S02", "S03"], "required_activities": ["S03-YOUDO"],
        "prerequisite_badges": []}]}, indent=1))
    write(root, "course-state/capstones/INDEX.json", json.dumps({"capstones": [{
        "id": "CP-TEMPORARY", "gate_section": "S03", "formally_ready": True, "execution_status": "ready"}]},
        indent=1))
    install_tooling(root)
