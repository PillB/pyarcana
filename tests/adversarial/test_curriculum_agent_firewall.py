"""RED/GREEN contracts for the curriculum learner knowledge firewall."""

from __future__ import annotations

import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import newbie_agentic_llm_walk as llm_walk
from scripts import newbie_packet_builder as packet_builder
from scripts import curriculum_learner_firewall as firewall


class PacketBindingTests(unittest.TestCase):
    def test_complete_packet_hash_covers_every_learner_visible_surface(self) -> None:
        packet = packet_builder.build_packet(2, attempt_id="firewall-red")
        baseline = packet_builder.canonical_packet_sha(packet)
        mutations = []

        prior = copy.deepcopy(packet)
        prior["prior_sections"][0]["theory"][0]["paragraphs"][0] += " mutation"
        mutations.append(prior)

        you_do = copy.deepcopy(packet)
        you_do["active"]["youDo"]["requirements"][0] += " mutation"
        mutations.append(you_do)

        self_check = copy.deepcopy(packet)
        self_check["active"]["selfCheck_stems"][0]["question"] += " mutation"
        mutations.append(self_check)

        for mutated in mutations:
            self.assertNotEqual(baseline, packet_builder.canonical_packet_sha(mutated))


class ImmutableAttemptTests(unittest.TestCase):
    def test_existing_attempt_is_never_deleted_or_overwritten(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "existing-run"
            root.mkdir()
            sentinel = root / "sealed-evidence.json"
            sentinel.write_text("immutable evidence\n", encoding="utf-8")

            with patch.object(llm_walk, "attempt_dir", return_value=root):
                with self.assertRaises(FileExistsError):
                    llm_walk.init_attempt("agentic_L_firewall_red")

            self.assertEqual(sentinel.read_text(encoding="utf-8"), "immutable evidence\n")


class PhysicalFirewallTests(unittest.TestCase):
    def test_each_turn_contains_only_manifested_learner_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            stage, manifest = firewall.stage_turn(
                run_id="fresh-a", outer_pass=1, learner_id="LEARNER_A",
                mode="epistemic", section=2, state_root=Path(tmp),
            )
            self.assertEqual(
                sorted(path.name for path in stage.iterdir()),
                ["AGENTS.md", "learner_baseline.json", "packet.json", "prior_knowledge_state.json"],
            )
            self.assertNotIn("context_manifest", {path.name for path in stage.iterdir()})
            firewall.verify_stage(stage, manifest)

    def test_turns_are_immutable_and_independently_named(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            args = dict(run_id="fresh-b", outer_pass=1, learner_id="LEARNER_B",
                        mode="realistic_student", section=1, state_root=Path(tmp))
            firewall.stage_turn(**args)
            with self.assertRaises(FileExistsError):
                firewall.stage_turn(**args)

    def test_codex_invocation_disables_shell_web_and_prior_sessions(self) -> None:
        command = firewall.codex_command(Path("/tmp/stage"), Path("/tmp/schema"), Path("/tmp/out"))
        rendered = " ".join(command)
        self.assertIn("--ephemeral", command)
        self.assertIn("--ignore-user-config", command)
        self.assertIn("--ignore-rules", command)
        self.assertIn("--sandbox read-only", rendered)
        self.assertIn("--disable shell_tool", rendered)
        self.assertIn('web_search="disabled"', command)
        self.assertNotIn("--add-dir", command)

    def test_tampered_or_extra_stage_content_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            stage, manifest = firewall.stage_turn(
                run_id="fresh-c", outer_pass=1, learner_id="LEARNER_A",
                mode="epistemic", section=1, state_root=Path(tmp),
            )
            (stage / "future-answer-canary.txt").write_text("S52 answer", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "file set"):
                firewall.verify_stage(stage, manifest)


if __name__ == "__main__":
    unittest.main()
