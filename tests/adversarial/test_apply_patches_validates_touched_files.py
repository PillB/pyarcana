"""Contract: tools/fixer/apply_patches.py refuses a patch that breaks any file it touches.

Codex patches can name any file, and the glossary (`src/lib/glossary/terms.ts`) and the exam bank
(`prisma/seed.ts`) are next in line for content rounds. The validator they would have met was
called `typechecks()` and ran `tsx` on the 52 section modules: tsx strips types without checking
them, and no section imports the glossary or the seed, so a patch that broke either file - or
gave a glossary term a category that does not exist - applied cleanly and reported success.

Each case below runs the real `apply_patches.py --apply` on a temporary copy of the repository
(node_modules linked, nothing written to the real tree) and asserts the outcome and the bytes.

Mutation proof: make `validate()` return `sections_load()` alone (the old behaviour) and every
refusal case applies, so each fails here.
"""
from __future__ import annotations

import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COPY = [
    "src", "prisma/seed.ts", "tsconfig.json", "package.json",
    "scripts/learner_text_extractor.mts", "scripts/false_claims_scan.mts", "scripts/lib",
    "tools/fixer/apply_patches.py", "audit/fixer/known_false_claims.json",
]
TERMS = "src/lib/glossary/terms.ts"
SEED = "prisma/seed.ts"
DEFINITION = "definition: 'Una etiqueta que apunta a un valor en memoria. En Python no declaras el tipo — se infiere.',"
KEY = "      correctIndex: 0,\n      explanation:\n        'El síntoma es de intérprete/PATH"


class ApplyPatchesValidatesTouchedFiles(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp = Path(tempfile.mkdtemp(prefix="pyarcana-apply-"))
        for rel in COPY:
            src, dst = ROOT / rel, cls.tmp / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            if src.is_dir():
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
        (cls.tmp / "node_modules").symlink_to((ROOT / "node_modules").resolve())
        (cls.tmp / "notes.md").write_text("una nota\n", encoding="utf-8")
        cls.pristine = {rel: (cls.tmp / rel).read_bytes() for rel in (TERMS, SEED, "notes.md")}
        for rel, anchor in ((TERMS, DEFINITION), (SEED, KEY)):
            assert cls.pristine[rel].decode("utf-8").count(anchor) == 1, f"fixture anchor not unique in {rel}"

    @classmethod
    def tearDownClass(cls) -> None:
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def tearDown(self) -> None:
        for rel, data in self.pristine.items():
            (self.tmp / rel).write_bytes(data)

    def apply(self, file: str, anchor: str, replacement: str) -> tuple[int, dict]:
        result = self.tmp / ".fixer" / "case.result.json"
        result.parent.mkdir(exist_ok=True)
        result.write_text(json.dumps({"section_id": "setup", "patches": [{
            "anchor": anchor, "replacement": replacement, "file": file,
            "finding_ids": ["F1"], "field_path": "probe",
        }]}), encoding="utf-8")
        proc = subprocess.run([sys.executable, "tools/fixer/apply_patches.py", str(result), "--apply"],
                              cwd=self.tmp, capture_output=True, text=True)
        return proc.returncode, json.loads(proc.stdout)

    def assertRefused(self, file: str, anchor: str, replacement: str, why: str) -> None:
        code, report = self.apply(file, anchor, replacement)
        self.assertEqual(code, 1, report)
        self.assertTrue(report.get("rolled_back"), report)
        self.assertEqual(report["applied"], 0)
        self.assertIn(why, report.get("typecheck_error", ""))
        self.assertEqual((self.tmp / file).read_bytes(), self.pristine[file], f"{file} was not restored")

    def test_a_harmless_glossary_edit_applies(self) -> None:
        """The control: without it, a validator that refuses everything would pass every case."""
        code, report = self.apply(TERMS, DEFINITION, DEFINITION.replace("Una etiqueta", "Un nombre"))
        self.assertEqual(code, 0, report)
        self.assertEqual(report["applied"], 1)
        self.assertIn("Un nombre que apunta", (self.tmp / TERMS).read_text(encoding="utf-8"))

    def test_a_syntax_error_in_the_glossary_is_rolled_back(self) -> None:
        self.assertRefused(TERMS, DEFINITION, DEFINITION.replace("Una etiqueta", "Una etiqueta 'rota'"),
                           "terms.ts")

    def test_a_category_that_does_not_exist_is_refused(self) -> None:
        anchor = "    category: 'Python',\n    " + DEFINITION
        bad = anchor.replace("'Python'", "'Estadística'")
        # The gap, recreated: the old validator's probe loads the sections and accepts this.
        (self.tmp / TERMS).write_text(self.pristine[TERMS].decode("utf-8").replace(anchor, bad, 1), encoding="utf-8")
        module = self.copy_module()
        with module.scratch_dir() as scratch:
            self.assertTrue(module.sections_load(scratch)[0], "the recreation no longer shows the tsx-only gap")
        (self.tmp / TERMS).write_bytes(self.pristine[TERMS])
        self.assertRefused(TERMS, anchor, bad, "GlossaryCategory")

    def copy_module(self):
        """apply_patches.py from the temporary copy, so its ROOT is the copy."""
        spec = importlib.util.spec_from_file_location("apply_copy", self.tmp / "tools/fixer/apply_patches.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_two_validations_at_once_check_their_own_files(self) -> None:
        """Codex P1 on #86. Fixer rounds can run side by side, and the scratch tsconfig had a fixed
        name: a second round writing it between the first round's write and its `tsc` made the
        first round type-check the second's files and pass its own broken patch. Here the second
        validation runs exactly in that window, every time."""
        anchor = "    category: 'Python',\n    " + DEFINITION
        bad = self.pristine[TERMS].decode("utf-8").replace(anchor, anchor.replace("'Python'", "'Estadística'"), 1)
        (self.tmp / TERMS).write_text(bad, encoding="utf-8")
        module = self.copy_module()
        section = module.ROOT / "src/lib/course/sections/s01-setup.ts"
        real_run, nested, state = module._run, [], {"done": False}

        def interleaving_run(cmd):
            if cmd[:2] == ["npx", "tsc"] and not state["done"]:
                state["done"] = True
                nested.append(module.validate({section: section.read_text(encoding="utf-8")}))
            return real_run(cmd)

        module._run = interleaving_run
        ok, err = module.validate({module.ROOT / TERMS: self.pristine[TERMS].decode("utf-8")})
        self.assertTrue(state["done"], "the second validation never ran inside the first")
        self.assertEqual(nested[0], (True, ""), "the second validation should pass: its file is unchanged")
        self.assertFalse(ok, "the first validation passed a glossary with a category that does not exist")
        self.assertIn("GlossaryCategory", err)
        self.assertEqual(list((self.tmp / ".fixer").glob("validate-*")), [], "scratch directories were left behind")

    def test_a_seed_patch_outside_the_bank_is_refused(self) -> None:
        """Codex P2 on #86. seed.ts is never type-checked (CI has no Prisma client), so a patch to
        main() that still parses - the insert loop naming an undefined variable - would apply."""
        loop = "Object.entries(QUESTION_BANK)"
        self.assertEqual(self.pristine[SEED].decode("utf-8").count(loop), 1, "fixture anchor not unique")
        self.assertRefused(SEED, loop, "Object.entries(QUESTION_BANKS)", "outside QUESTION_BANK")

    def test_an_answer_key_out_of_range_is_refused(self) -> None:
        self.assertRefused(SEED, KEY, KEY.replace("correctIndex: 0", "correctIndex: 4"), "out of range")

    def test_a_deleted_question_is_refused(self) -> None:
        text = self.pristine[SEED].decode("utf-8")
        start = text.index("  setup: [\n") + len("  setup: [\n")
        start = text.index("    {\n", start)
        end = text.index("\n    },\n", start) + len("\n    },\n")
        self.assertRefused(SEED, text[start:end], "", "question counts changed")

    def test_a_syntax_error_in_the_seed_is_refused(self) -> None:
        self.assertRefused(SEED, KEY, KEY.replace("correctIndex: 0,", "correctIndex: 0,,"), "syntax error")

    def test_a_patch_that_adds_a_known_false_claim_is_refused(self) -> None:
        """KFC-003, verbatim from S10, written into a glossary definition."""
        claim = "`python -m familiarity_core` evita pelear con `sys.path`."
        self.assertRefused(TERMS, DEFINITION, DEFINITION.replace("se infiere.", f"se infiere. {claim}"),
                           "KFC-003 0 -> 1")

    def test_a_second_copy_of_a_claim_in_the_same_string_is_refused(self) -> None:
        """Codex P1 on #88: the scan counted one hit per string, so doubling a claim inside a
        string that already held it changed no count and applied."""
        claim = "Probabilidad de observar el resultado si la hipótesis nula es cierta."
        anchor = f"definition: '{claim}"
        self.assertEqual(self.pristine[TERMS].decode("utf-8").count(anchor), 1, "fixture anchor not unique")
        self.assertRefused(TERMS, anchor, f"definition: '{claim} {claim}", "KFC-001 2 -> 3")

    def test_a_file_that_still_owes_a_claim_can_be_patched_elsewhere(self) -> None:
        """The glossary owes KFC-001 (the p-value hover); an unrelated edit must still apply."""
        code, report = self.apply(TERMS, DEFINITION, DEFINITION.replace("en memoria", "guardado en memoria"))
        self.assertEqual(code, 0, report)

    def test_a_file_with_no_validator_is_refused(self) -> None:
        self.assertRefused("notes.md", "una nota", "otra nota", "no validator for notes.md")


if __name__ == "__main__":
    unittest.main()
