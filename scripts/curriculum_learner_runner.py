#!/usr/bin/env python3
"""Execute one physically tool-free (E2) curriculum learner turn.

The runner owns provenance end to end: it stages the turn, copies only the
manifested learner-visible bytes into a disposable directory outside the
repository, launches a Claude CLI session with every tool removed, refuses the
run unless the CLI itself reports an empty capability surface, and seals the
schema-validated response against the immutable context manifest.

The learner never asserts its own isolation and never sees a repository path.
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

sys.path.insert(0, str(Path(__file__).resolve().parent))

import curriculum_learner_firewall as firewall  # noqa: E402

ROOT = firewall.ROOT
STATE = firewall.STATE
SCHEMA = STATE / "schemas/learner_output.schema.json"
DEFAULT_MODEL = "claude-opus-5"


def _sha_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _disposable_stage(stage: Path, manifest: dict) -> Path:
    """Copy manifested learner-visible files to a directory outside the repository."""
    target = Path(tempfile.mkdtemp(prefix="pyarcana-learner-"))
    repository = ROOT.resolve()
    if target.resolve() == repository or repository in target.resolve().parents:
        shutil.rmtree(target, ignore_errors=True)
        raise RuntimeError("disposable learner stage must live outside the repository")
    for row in manifest["allowed_files"]:
        content = (stage / row["path"]).read_bytes()
        if _sha_bytes(content) != row["sha256"]:
            shutil.rmtree(target, ignore_errors=True)
            raise RuntimeError(f"stage integrity failure before dispatch: {row['path']}")
        (target / row["path"]).write_bytes(content)
    copied = sorted(path.name for path in target.iterdir())
    if copied != sorted(row["path"] for row in manifest["allowed_files"]):
        shutil.rmtree(target, ignore_errors=True)
        raise RuntimeError("disposable learner stage file set differs from the context manifest")
    return target


def _learner_environment() -> dict:
    """Strip ambient configuration that could reintroduce context to the learner."""
    env = dict(os.environ)
    for name in (
        "CLAUDE_CODE_SSE_PORT", "CLAUDE_CODE_ENTRYPOINT", "CLAUDECODE",
        "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL", "CLAUDE_CONFIG_DIR",
        "CLAUDE_CODE_EXTRA_BODY", "MCP_TIMEOUT", "CLAUDE_CODE_SIMPLE",
        "CLAUDE_CODE_SAFE_MODE", "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
    ):
        env.pop(name, None)
    env["CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC"] = "1"
    return env


def run_turn(
    *,
    run_id: str,
    campaign_id: str,
    source_revision: str,
    outer_pass: int,
    learner_id: str,
    mode: str,
    section: int,
    prior_output: Path | None,
    execution_capability: Path | None,
    model: str,
    state_root: Path = STATE,
) -> dict:
    stage, manifest_path = firewall.stage_turn(
        run_id=run_id, campaign_id=campaign_id, source_revision=source_revision,
        outer_pass=outer_pass, learner_id=learner_id, mode=mode,
        section=section, prior_output_path=prior_output,
        execution_capability_path=execution_capability, state_root=state_root,
    )
    firewall.verify_stage(stage, manifest_path)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    prompt = firewall.learner_prompt(stage, manifest_path)

    # The CLI validator resolves no remote meta-schema, so the draft reference is
    # dropped for transport only; the repository schema file keeps it.
    schema_document = json.loads(SCHEMA.read_text(encoding="utf-8"))
    schema_document.pop("$schema", None)
    schema_json = json.dumps(schema_document, separators=(",", ":"))
    command = firewall.claude_command(schema_json=schema_json, model=model)

    disposable = _disposable_stage(stage, manifest)
    started_at = datetime.now(timezone.utc).isoformat()
    try:
        completed = subprocess.run(
            command, input=prompt, cwd=str(disposable), env=_learner_environment(),
            capture_output=True, text=True, check=False,
        )
    finally:
        shutil.rmtree(disposable, ignore_errors=True)
    ended_at = datetime.now(timezone.utc).isoformat()

    evidence_root = (
        state_root / "learner_runs" / f"pass_{outer_pass:02d}" / learner_id / mode
        / manifest["context_manifest_id"]
    )
    evidence_root.mkdir(parents=True, exist_ok=True)
    raw_log = evidence_root / "cli_stream.jsonl"
    with raw_log.open("xb") as handle:
        handle.write(completed.stdout.encode())
    if completed.stderr:
        with (evidence_root / "cli_stderr.log").open("xb") as handle:
            handle.write(completed.stderr.encode())

    init_event, result_event = None, None
    for line in completed.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("type") == "system" and event.get("subtype") == "init":
            init_event = event
        elif event.get("type") == "result":
            result_event = event

    attestation = firewall.verify_isolation_init(init_event, expected_cwd=disposable)
    attestation.update({
        "context_manifest_id": manifest["context_manifest_id"],
        "command": [part for part in command],
        "started_at": started_at,
        "ended_at": ended_at,
        "exit_code": completed.returncode,
        "cli_stream_sha256": _sha_bytes(completed.stdout.encode()),
        "prompt_sha256": _sha_bytes(prompt.encode()),
        "schema_sha256": _sha_bytes(schema_json.encode()),
    })
    attestation_path = evidence_root / "isolation_attestation.json"
    with attestation_path.open("xb") as handle:
        handle.write(
            (json.dumps(attestation, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode()
        )

    if completed.returncode != 0 or result_event is None or result_event.get("is_error"):
        detail = (result_event or {}).get("result") or completed.stderr[-800:]
        raise RuntimeError(f"learner turn failed: exit={completed.returncode} detail={detail!r}")

    structured = result_event.get("structured_output")
    if not isinstance(structured, dict):
        raise RuntimeError("learner turn produced no schema-validated structured output")

    response_path = evidence_root / "structured_response.json"
    payload = (
        json.dumps(structured, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n"
    ).encode()
    with response_path.open("xb") as handle:
        handle.write(payload)

    sealed = firewall.seal_output(
        response_path, manifest_path, state_root=state_root,
        receipts_dir=state_root / "execution_receipts",
    )
    return {
        "context_manifest_id": manifest["context_manifest_id"],
        "section_id": manifest["section_id"],
        "packet_sha": manifest["packet_sha"],
        "evidence_tier": attestation["evidence_tier"],
        "sealed_output": str(sealed.relative_to(ROOT)),
        "isolation_attestation": str(attestation_path.relative_to(ROOT)),
        "cli_stream": str(raw_log.relative_to(ROOT)),
        "total_cost_usd": result_event.get("total_cost_usd"),
        "num_turns": result_event.get("num_turns"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run-id", required=True, help="journey id: one learner, one mode, one pass")
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--source-revision", required=True)
    parser.add_argument("--outer-pass", type=int, required=True)
    parser.add_argument("--learner", required=True, choices=sorted(firewall.ALLOWED_LEARNERS))
    parser.add_argument("--mode", required=True, choices=sorted(firewall.ALLOWED_MODES))
    parser.add_argument("--section", type=int, required=True)
    parser.add_argument("--prior-output", type=Path, default=None)
    parser.add_argument("--execution-capability", type=Path, default=None)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    summary = run_turn(
        run_id=args.run_id, campaign_id=args.campaign,
        source_revision=args.source_revision, outer_pass=args.outer_pass,
        learner_id=args.learner,
        mode=args.mode, section=args.section, prior_output=args.prior_output,
        execution_capability=args.execution_capability, model=args.model,
    )
    json.dump(summary, sys.stdout, ensure_ascii=False, indent=2, sort_keys=True)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
