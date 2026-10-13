"""The exam bank in `prisma/seed.ts`, read by the TypeScript parser, for Python tools and tests.

Every Python reader of the bank used to carry its own regex, and each saw a different part of it
(`tests/adversarial/test_exam_length_cue.py` read only single-quoted keys, so it never measured
`setup` or `basics`). This module is the one way to read it: it runs
`scripts/learner_text_extractor.mts`, which parses the file with the TypeScript compiler, and it
fails closed - a refusal or a crash raises, it never returns an empty bank.

    from exam_bank import load_banks, bank_for
"""
from __future__ import annotations

import json
import subprocess
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "prisma/seed.ts"


class BankReadError(RuntimeError):
    """The extractor refused the bank or failed; nothing it printed can be trusted."""


@lru_cache(maxsize=8)
def _extract(seed: str) -> dict:
    proc = subprocess.run(
        ["npx", "tsx", "scripts/learner_text_extractor.mts", "--question-bank", seed],
        cwd=ROOT, capture_output=True, text=True,
    )
    if proc.returncode != 0:
        raise BankReadError(f"learner_text_extractor.mts exited {proc.returncode}: {proc.stderr.strip()[-1500:]}")
    return json.loads(proc.stdout)


def load_bank_report(seed: Path = SEED) -> dict:
    """{"file", "keyCensus", "banks": [{"slug", "keyStyle", "line", "questions": [...]}]}."""
    return _extract(str(seed))


def load_banks(seed: Path = SEED) -> list[dict]:
    """Every bank in source order. Each question has concept, question, options, correctIndex,
    explanation, variant (1-based within its concept) and line."""
    return load_bank_report(seed)["banks"]


def bank_for(slug: str, seed: Path = SEED) -> list[dict]:
    """The questions of one bank. A missing slug raises instead of returning an empty list."""
    for bank in load_banks(seed):
        if bank["slug"] == slug:
            return bank["questions"]
    raise KeyError(f"no bank {slug!r} in {seed}")


def learner_text(questions: list[dict]) -> str:
    """Every string in these questions a check may scan for a stray label or phrase: concept,
    question, each option and explanation, one per line. Source comments are not read, so a label
    in a comment is not in this text."""
    return "\n".join(
        "\n".join([q["concept"], q["question"], *q["options"], q["explanation"]]) for q in questions
    )
