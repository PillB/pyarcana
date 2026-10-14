"""Contract: prisma/seed.ts is read by one parser, and the files that still bring their own only shrink.

Three tools each read the exam bank with their own regex and each saw a different subset of it:
test_exam_length_cue.py read only single-quoted keys, v3_invariant_validator.py only unquoted
ones, and a report built on a third concluded that five sections had no exam bank. The class fix is
one reader (scripts/lib/learner_text.mts, wrapped for Python by scripts/exam_bank.py). This test
lists every file that names seed.ts in a string - the way a file reads it - outside the sanctioned
readers, and holds that list to an exact owed set: a new private reader fails, and a migrated one
must be struck from the set so it cannot quietly come back.
"""
from __future__ import annotations

import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCOPE = ("scripts/", "tools/", "tests/", "src/")
#: A path string naming seed.ts: `"prisma/seed.ts"`, `'seed.ts'`, `` `.../seed.ts` ``.
NAMES_SEED = re.compile(r"""(['"`])[^'"`\n]*seed\.ts\1""")

#: Files allowed to name seed.ts: the reader itself, its wrapper, and the tests that check it.
SANCTIONED = {
    "scripts/lib/learner_text.mts",
    "scripts/learner_text_extractor.mts",
    "scripts/exam_bank.py",
    "tools/fixer/apply_patches.py",
    "tests/adversarial/learner-text-reader.test.ts",
    "tests/adversarial/seed-insert-oracle.test.ts",
    "tests/adversarial/test_apply_patches_validates_touched_files.py",
    "tests/adversarial/test_exam_bank_loader.py",
    "tests/adversarial/test_seed_readers.py",
    # The known-false-claims scan: reads the bank through readQuestionBank.
    "scripts/lib/false_claims.mts",
    "tests/adversarial/known-false-claims.test.ts",
}

#: Still reading the bank with a private parser. Strike each one as it moves to exam_bank.py.
#: 2026-10-13: empty. #96 migrated the audit, the length cue and the 11 per-section tests; #97
#: migrated v3_invariant_validator.py. Every reader of the seed now goes through exam_bank.py.
SEED_TEXT_READERS_OWED: set[str] = set()


def readers(files: dict[str, str]) -> set[str]:
    """Files whose text names seed.ts in a string, minus the sanctioned readers."""
    return {path for path, text in files.items()
            if path not in SANCTIONED and NAMES_SEED.search(text)}


def tree() -> dict[str, str]:
    listing = subprocess.run(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard", *SCOPE],
                             cwd=ROOT, capture_output=True, check=True).stdout.decode("utf-8")
    out = {}
    for rel in filter(None, listing.split("\0")):
        try:
            out[rel] = (ROOT / rel).read_text(encoding="utf-8")
        except (UnicodeDecodeError, FileNotFoundError, IsADirectoryError):
            continue
    return out


class SeedReaders(unittest.TestCase):
    def test_the_detector_finds_a_private_reader_and_ignores_a_comment(self) -> None:
        """Recreates the defect: a new tool that opens seed.ts itself is flagged."""
        files = {
            "scripts/new_tool.py": 'BANK = (ROOT / "prisma/seed.ts").read_text()\n',
            "tests/x.test.mjs": "const SEED = readFileSync(join(ROOT, 'prisma', 'seed.ts'), 'utf8')\n",
            "tests/y.test.ts": "// Two sections, as prisma/seed.ts builds the bank.\n",
            "scripts/exam_bank.py": 'SEED = ROOT / "prisma/seed.ts"\n',
        }
        self.assertEqual(readers(files), {"scripts/new_tool.py", "tests/x.test.mjs"})

    def test_no_new_private_reader_and_migrated_ones_are_struck(self) -> None:
        found = readers(tree())
        new = sorted(found - SEED_TEXT_READERS_OWED)
        gone = sorted(SEED_TEXT_READERS_OWED - found)
        self.assertEqual(new, [], f"read the bank through scripts/exam_bank.py (load_banks, bank_for) instead: {new}")
        self.assertEqual(gone, [], f"no longer read seed.ts themselves - strike them from SEED_TEXT_READERS_OWED: {gone}")


if __name__ == "__main__":
    unittest.main()
