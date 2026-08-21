#!/usr/bin/env python3
"""Isolated student runtime that turns a learner execution request into a receipt.

A learner never authors trusted runtime output. It submits code; this module runs
that code in a disposable directory outside the repository with no network and no
repository mount, and writes an immutable receipt binding the exact request, code,
stdin, runtime and result. The sealer later fills the learner's observed output
from the receipt, so fabricated, replayed or mis-bound output cannot be sealed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / "course-state/curriculum-agent"
RECEIPTS = STATE / "execution_receipts"
DEFAULT_TIMEOUT_SECONDS = 20
MAX_CAPTURE_BYTES = 64_000


def _sha_text(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _canonical(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


# The curriculum tells the learner to install Python 3.12, and lessons from S03
# onward use syntax that older interpreters reject. A receipt produced by the
# harness's own interpreter would not describe the learner's runtime.
COURSE_PYTHON_CANDIDATES = ("python3.13", "python3.12")
MINIMUM_COURSE_PYTHON = (3, 12)


def course_interpreter() -> str:
    """Resolve the interpreter that matches the runtime the course prescribes."""
    for candidate in COURSE_PYTHON_CANDIDATES:
        resolved = shutil.which(candidate)
        if resolved:
            return resolved
    if sys.version_info[:2] >= MINIMUM_COURSE_PYTHON:
        return sys.executable
    raise RuntimeError(
        "no interpreter matching the course runtime (Python "
        f"{MINIMUM_COURSE_PYTHON[0]}.{MINIMUM_COURSE_PYTHON[1]}+) is available; "
        "execution receipts would not describe the learner's environment"
    )


def runtime_fingerprint(interpreter: str | None = None) -> dict:
    """Identify the interpreter the receipt is bound to."""
    interpreter = interpreter or course_interpreter()
    version = subprocess.run(
        [interpreter, "-c", "import sys; print(sys.version.split()[0])"],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return {
        "interpreter": interpreter,
        "runtime_version": f"Python {version}",
        "runtime_image_sha256": _sha_text(f"{interpreter}|{version}"),
        "dependency_manifest_sha256": _sha_text("stdlib-only"),
    }


def execute_request(
    request: dict,
    *,
    campaign_id: str,
    outer_pass: int,
    journey_id: str,
    learner_id: str,
    section_id: str,
    receipts_dir: Path = RECEIPTS,
    timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS,
) -> dict:
    """Run one approved request and write its immutable receipt.

    `request` carries `exercise_id`, `code` and optional `stdin`. The learner's
    own claim about what the code prints is never consulted.
    """
    exercise_id = str(request["exercise_id"])
    code = str(request["code"])
    stdin_text = str(request.get("stdin", ""))
    attempt_number = int(request.get("attempt_number", 1))

    request_payload = {
        "exercise_id": exercise_id, "code": code, "stdin": stdin_text,
        "attempt_number": attempt_number,
    }
    request_sha = _sha_text(_canonical(request_payload))
    receipt_id = _sha_text(
        "|".join([campaign_id, str(outer_pass), journey_id, learner_id,
                  section_id, exercise_id, str(attempt_number), request_sha])
    )[:32]

    receipts_dir.mkdir(parents=True, exist_ok=True)
    receipt_path = receipts_dir / f"{receipt_id}.json"
    if receipt_path.exists():
        raise FileExistsError(f"execution receipt already sealed: {receipt_id}")

    workdir = Path(tempfile.mkdtemp(prefix="pyarcana-student-"))
    repository = ROOT.resolve()
    if workdir.resolve() == repository or repository in workdir.resolve().parents:
        shutil.rmtree(workdir, ignore_errors=True)
        raise RuntimeError("student runtime must execute outside the repository")

    environment = {
        "PATH": "/usr/bin:/bin:/usr/sbin:/sbin",
        "HOME": str(workdir),
        "TMPDIR": str(workdir),
        "LANG": "en_US.UTF-8",
        "PYTHONIOENCODING": "utf-8",
        "PYTHONDONTWRITEBYTECODE": "1",
        # No proxy, token, key or repository path is inherited.
        "no_proxy": "*",
    }
    fingerprint = runtime_fingerprint()
    main = workdir / "main.py"
    main.write_text(code, encoding="utf-8")
    command = [fingerprint["interpreter"], "-I", "-S", "main.py"]

    started_at = datetime.now(timezone.utc).isoformat()
    timed_out = False
    try:
        completed = subprocess.run(
            command, cwd=str(workdir), env=environment, input=stdin_text,
            capture_output=True, text=True, timeout=timeout_seconds, check=False,
        )
        stdout, stderr, exit_code = completed.stdout, completed.stderr, completed.returncode
    except subprocess.TimeoutExpired as expired:
        timed_out = True
        stdout = (expired.stdout or b"").decode(errors="replace") if isinstance(expired.stdout, bytes) else (expired.stdout or "")
        stderr = (expired.stderr or b"").decode(errors="replace") if isinstance(expired.stderr, bytes) else (expired.stderr or "")
        stderr += f"\n[student_runtime] timed out after {timeout_seconds}s"
        exit_code = 124
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
    ended_at = datetime.now(timezone.utc).isoformat()

    receipt = {
        "schema_version": 1,
        "receipt_id": receipt_id,
        "campaign_id": campaign_id,
        "outer_pass": outer_pass,
        "journey_id": journey_id,
        "learner_id": learner_id,
        "section_id": section_id,
        "exercise_id": exercise_id,
        "attempt_number": attempt_number,
        "execution_request_sha256": request_sha,
        "submitted_code_sha256": _sha_text(code),
        "stdin_sha256": _sha_text(stdin_text),
        "runtime_image_sha256": fingerprint["runtime_image_sha256"],
        "interpreter": fingerprint["interpreter"],
        "runtime_version": fingerprint["runtime_version"],
        "dependency_manifest_sha256": fingerprint["dependency_manifest_sha256"],
        "network": False,
        "repository_mounted": False,
        "command": command,
        "stdout": stdout[:MAX_CAPTURE_BYTES],
        "stderr": stderr[:MAX_CAPTURE_BYTES],
        "exit_code": exit_code,
        "timed_out": timed_out,
        "started_at": started_at,
        "ended_at": ended_at,
    }
    receipt["receipt_sha256"] = _sha_text(_canonical(receipt))
    with receipt_path.open("x", encoding="utf-8") as handle:
        handle.write(_canonical(receipt) + "\n")
    return receipt


def load_receipt(receipt_id: str, *, receipts_dir: Path = RECEIPTS) -> dict:
    """Read a receipt and verify it has not been edited in place."""
    if not receipt_id or "/" in receipt_id or ".." in receipt_id:
        raise ValueError("invalid receipt id")
    path = receipts_dir / f"{receipt_id}.json"
    if path.is_symlink() or not path.is_file():
        raise ValueError(f"execution receipt not found: {receipt_id}")
    receipt = json.loads(path.read_text(encoding="utf-8"))
    recorded = receipt.pop("receipt_sha256", None)
    if recorded != _sha_text(_canonical(receipt)):
        raise ValueError(f"execution receipt digest mismatch: {receipt_id}")
    receipt["receipt_sha256"] = recorded
    if receipt.get("receipt_id") != receipt_id:
        raise ValueError(f"execution receipt identity mismatch: {receipt_id}")
    return receipt


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--pass", dest="outer_pass", type=int, required=True)
    parser.add_argument("--journey", required=True)
    parser.add_argument("--learner", required=True)
    parser.add_argument("--section", required=True)
    parser.add_argument("--request", type=Path, required=True, help="JSON execution request")
    args = parser.parse_args()

    request = json.loads(args.request.read_text(encoding="utf-8"))
    receipt = execute_request(
        request, campaign_id=args.campaign, outer_pass=args.outer_pass,
        journey_id=args.journey, learner_id=args.learner, section_id=args.section,
    )
    json.dump(
        {k: v for k, v in receipt.items() if k not in {"stdout", "stderr"}},
        sys.stdout, ensure_ascii=False, indent=2, sort_keys=True,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
