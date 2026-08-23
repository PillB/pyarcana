#!/usr/bin/env python3
"""Phase E, widened: check the learner firewall on every section, not one.

The campaign's Phase E evidence covered S15 alone, and only at harness level.
That proved the machinery runs; it did not prove the property the machinery
exists to guarantee — that a learner packet never carries what the learner is
supposed to work out.

This sweeps all 52. For each section it builds the cumulative packet the
learner would actually receive and asserts, against the shape the builder
really emits (checked against a live packet, not an assumed one):

  * `selfCheck_stems` is present with options, and no stem carries
    `correctIndex`, `answer` or `explanation` — the learner gets the questions
    without the key;
  * `weDo` is present with `starterCode` but no `solutionCode` and no `hint` —
    the learner gets the task, not the answer;
  * prior sections number exactly `index - 1`, so nothing from the future
    leaks backwards into the packet;
  * the packet hashes stably, so the manifest that binds it means something.

Every withholding assertion is paired with a positive one, because a check that
merely finds a field absent would also pass if the learner received nothing at
all. And `negative_control()` plants a leak on purpose: if the check cannot go
red, `ok` is false regardless of the sweep, because a gate that cannot fail is
decoration.

Solutions and answers for *prior* sections are allowed: the learner has already
done that work, and withholding it would be a different (and wrong) firewall.

Writes audit/content-campaign-c04/evidence/phase_e_packet_sweep.json.
Exit 1 on any leak.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import build_packet, canonical_packet_sha  # noqa: E402

OUT = ROOT / "audit/content-campaign-c04/evidence/phase_e_packet_sweep.json"


def _active_of(packet: dict) -> dict:
    """The section under study in this packet, whatever key the builder used."""
    for key in ("active", "active_section", "section"):
        if isinstance(packet.get(key), dict):
            return packet[key]
    return {}


def check_active(active: dict) -> list[str]:
    """Assert the firewall against the shape the builder actually emits.

    Checked against a real packet rather than an assumed one: the builder does
    not ship `selfCheck` at all, it ships `selfCheck_stems` (question + options,
    no key), and it strips `solutionCode`/`hint` from `weDo` while keeping
    `starterCode`. A check phrased against the wrong field names would pass
    vacuously, which is worse than no check — so each assertion below is paired
    with a positive one confirming the learner still receives the material.
    """
    leaks: list[str] = []

    stems = active.get("selfCheck_stems")
    if not isinstance(stems, list) or not stems:
        leaks.append("no selfCheck_stems: the learner receives no questions at all")
    else:
        for i, stem in enumerate(stems):
            if not isinstance(stem, dict):
                continue
            if "correctIndex" in stem or "answer" in stem or "explanation" in stem:
                leaks.append(f"stem {i} carries the answer key")
            if not stem.get("options"):
                leaks.append(f"stem {i} has no options")

    we_do = active.get("weDo")
    if not we_do:
        leaks.append("no weDo: the learner receives no practice")
    else:
        blob = json.dumps(we_do, ensure_ascii=False)
        if '"solutionCode"' in blob:
            leaks.append("weDo ships solutionCode")
        if '"hint"' in blob:
            leaks.append("weDo ships hints")
        if '"starterCode"' not in blob:
            leaks.append("weDo has no starterCode: nothing to work from")

    return leaks


def negative_control() -> bool:
    """Prove the check can fail. A gate that cannot go red is decoration."""
    poisoned = {
        "selfCheck_stems": [{"question": "q", "options": ["a", "b"], "correctIndex": 1}],
        "weDo": {"x": {"starterCode": "...", "solutionCode": "the answer"}},
    }
    found = check_active(poisoned)
    return any("answer key" in f for f in found) and any("solutionCode" in f for f in found)


def _prior_of(packet: dict) -> list:
    for key in ("prior", "prior_sections", "previous"):
        if isinstance(packet.get(key), list):
            return packet[key]
    return []


def sweep() -> dict:
    findings: list[dict] = []
    control_ok = negative_control()
    rows: list[dict] = []

    # Section count comes from the builder itself rather than a constant, so a
    # curriculum that grows does not silently shrink this sweep.
    n = 0
    while True:
        try:
            build_packet(n + 1)
        except ValueError:
            break
        n += 1
        if n > 200:  # runaway guard
            break

    for index in range(1, n + 1):
        packet = build_packet(index)
        active = _active_of(packet)
        prior = _prior_of(packet)
        leaks = check_active(active)
        if len(prior) != index - 1:
            leaks.append(f"prior carries {len(prior)} sections, expected {index - 1}")

        sha = canonical_packet_sha(packet)
        if canonical_packet_sha(build_packet(index)) != sha:
            leaks.append("packet hash is not stable across builds")

        rows.append(
            {
                "index": index,
                "title": active.get("title"),
                "prior_sections": len(prior),
                "packet_sha": sha[:16],
                "leaks": leaks,
            }
        )
        for leak in leaks:
            findings.append({"index": index, "title": active.get("title"), "leak": leak})

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scope": "all active sections",
        "sections_checked": n,
        "note": (
            "Harness-level validation of the learner firewall across the whole "
            "curriculum. This proves the packet withholds answers and future "
            "content; it is NOT a learner journey, and does not substitute for "
            "independent human review of the teaching itself."
        ),
        "negative_control_detects_a_planted_leak": control_ok,
        "leak_count": len(findings),
        # A green result only counts if the check demonstrably can go red.
        "ok": (not findings) and control_ok,
        "findings": findings,
        "sections": rows,
    }


def main() -> int:
    report = sweep()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        json.dumps(
            {k: v for k, v in report.items() if k not in {"sections", "findings"}},
            indent=2,
            ensure_ascii=False,
        )
    )
    for f in report["findings"][:20]:
        print(f"  LEAK S{f['index']:02d}: {f['leak']}", file=sys.stderr)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
