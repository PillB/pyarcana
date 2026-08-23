#!/usr/bin/env python3
"""Phase E: an independent model reviews the teaching for defects.

## Why this replaces the quiz attempt

The first design had a different model sit each section's self-check, with a
blind control. It scored 100 % taught and 100 % blind — a ceiling effect, not a
result. Grok already knows pandas and entity resolution; asking it to answer a
beginner quiz measures the model, not the material. The blind arm scoring 100 %
proved the instrument could not discriminate, so the numbers were discarded.

A frontier model cannot pretend to be a novice. It can do the thing this
campaign has never had: read the content cold, as an expert, and say what is
wrong with it. The requirement that "the content writer cannot certify itself"
is met by a *different reader*, not by a simulated student.

## What it is asked for

Defects only, each tied to a quoted span so the claim can be checked against the
file rather than believed:

  FACTUAL      a statement about Python, pandas, statistics or tooling that is
               wrong or misleading as written
  UNSUPPORTED  a claim stated more strongly than the evidence given supports
  UNCLEAR      a passage a motivated beginner would not be able to follow
  JARGON       a technical term used before it is explained in Spanish
  CONTRADICTS  two statements in the same section that cannot both be true

Findings are returned with a verbatim quote. Nothing is accepted on the model's
word: every quote is checked back against the source file, and any finding whose
quote does not appear is recorded as UNVERIFIED rather than reported as a defect.

## Isolation

Run from a neutral cwd so no project instructions load — from the repository
Grok would ingest Agents.md and a `pyarcana-curriculum-audit` skill, which would
make the review anything but independent. `--tools ""` leaves it physically
unable to read the repo; `--disable-web-search` stops it looking things up.
The only input is the section prose, pasted into the prompt.

Usage:
    python3 scripts/phase_e_independent_review.py --sections 15,18,31
    python3 scripts/phase_e_independent_review.py --all
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import parsed_active_sections  # noqa: E402

OUT = ROOT / "audit/content-campaign-c04/evidence/phase_e_independent_review.json"
NEUTRAL_CWD = Path("/tmp/pyarcana-phase-e-neutral")

REVIEWER_CONTRACT = (
    "Eres un revisor técnico independiente. Lees material didáctico de un curso "
    "de Python aplicado a datos, escrito en español para personas que empiezan. "
    "Tu trabajo es encontrar defectos, no elogiar el texto. "
    "No tienes acceso a internet ni al repositorio: juzgas solo lo que se te muestra. "
    "Cada hallazgo debe citar textualmente el fragmento problemático, copiado tal cual. "
    "Si el material te parece correcto, devuelves una lista vacía; inventar defectos "
    "es peor que no encontrar ninguno. Respondes únicamente con JSON válido."
)

SCHEMA = json.dumps(
    {
        "type": "object",
        "properties": {
            "findings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "kind": {
                            "type": "string",
                            "enum": [
                                "FACTUAL",
                                "UNSUPPORTED",
                                "UNCLEAR",
                                "JARGON",
                                "CONTRADICTS",
                            ],
                        },
                        "quote": {"type": "string"},
                        "problem": {"type": "string"},
                        "severity": {"type": "string", "enum": ["alta", "media", "baja"]},
                    },
                    "required": ["kind", "quote", "problem", "severity"],
                },
            }
        },
        "required": ["findings"],
    }
)


def teaching_text(path: Path) -> str:
    src = path.read_text(encoding="utf-8")
    start = src.find("theory: [")
    # Section files do not share one indentation: some use two spaces, some one,
    # so a literal "\n  iDo:" silently returned nothing for those and the review
    # skipped the section without saying so. Match the key at any indent.
    m_end = re.search(r"\n\s*iDo:", src[start:]) if start >= 0 else None
    if start < 0 or not m_end:
        return ""
    end = start + m_end.start()
    block = re.sub(r"code:\s*`[\s\S]*?`", " ", src[start:end])
    block = re.sub(r"output:\s*`[\s\S]*?`", " ", block)
    # Only strings that are actually `paragraphs:` entries. Matching every long
    # quoted run swept in structural fragments (callout scaffolding, stray
    # commas), and the reviewer then reported the mangling as a defect in the
    # teaching — a finding about my extractor, not about the course.
    paras = []
    for arr in re.findall(r"paragraphs:\s*\[([\s\S]*?)\n\s*\]", block):
        paras += re.findall(r'"((?:\\.|[^"\\]){40,})"', arr)
        paras += re.findall(r"'((?:\\.|[^'\\]){40,})'", arr)
    # Decode the way TypeScript does, or the reviewer reads escapes as content:
    # `Scripts\\\\Activate.ps1` in source renders as a single backslash, and a
    # reviewer shown the raw form correctly reports a path that is not wrong.
    def _decode(s: str) -> str:
        return (
            s.replace("\\\\", "\x00")
            .replace("\\n", "\n")
            .replace('\\"', '"')
            .replace("\\'", "'")
            .replace("\x00", "\\")
        )

    text = "\n\n".join(_decode(p) for p in paras)
    return text[:55000]


class ReviewCallFailed(RuntimeError):
    """The reviewer never answered. NOT the same as finding no defects.

    Ten sections once came back with zero findings and were nearly reported as
    clean; the cause was an exhausted API balance returning HTTP 402. A failed
    call silently became an empty finding list, which reads exactly like a
    passing review. Failures are now raised, recorded per section, and make the
    whole run not-ok.
    """


#: Codex demands `additionalProperties: false` on every object in the schema,
#: including nested items — a bare schema is rejected with a 400.
STRICT_SCHEMA = json.dumps(
    {
        "type": "object",
        "additionalProperties": False,
        "required": ["findings"],
        "properties": {
            "findings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["kind", "quote", "problem", "severity"],
                    "properties": {
                        "kind": {
                            "type": "string",
                            "enum": ["FACTUAL", "UNSUPPORTED", "UNCLEAR", "JARGON", "CONTRADICTS"],
                        },
                        "quote": {"type": "string"},
                        "problem": {"type": "string"},
                        "severity": {"type": "string", "enum": ["alta", "media", "baja"]},
                    },
                },
            }
        },
    }
)


def ask_codex(prompt: str, model: str, timeout: int = 900) -> dict | None:
    """Review via the Codex CLI, reusing the firewall's own isolation contract.

    scripts/curriculum_learner_firewall.py already defines what a fail-closed
    Codex invocation looks like for a learner turn, and the same flags apply to
    a reviewer: `--sandbox read-only` and `--disable shell_tool` leave it unable
    to touch the repository, `web_search="disabled"` stops it looking anything
    up, and `--ephemeral --ignore-user-config --ignore-rules` refuse ambient
    configuration. `--cd` points at a neutral directory so no project
    instructions load. The prompt is the only input.
    """
    NEUTRAL_CWD.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="phase_e_") as td:
        schema = Path(td) / "schema.json"
        schema.write_text(STRICT_SCHEMA, encoding="utf-8")
        out = Path(td) / "last.json"
        cmd = [
            "codex", "exec", "-", "--ephemeral", "--ignore-user-config", "--ignore-rules",
            "--skip-git-repo-check", "--sandbox", "read-only", "--cd", str(NEUTRAL_CWD),
            "--disable", "shell_tool", "-c", 'web_search="disabled"',
            "--output-schema", str(schema), "--output-last-message", str(out),
        ]
        if model:
            cmd += ["--model", model]
        full = REVIEWER_CONTRACT + "\n\n" + prompt
        try:
            r = subprocess.run(cmd, input=full, cwd=NEUTRAL_CWD,
                               capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            raise ReviewCallFailed(f"codex timed out after {timeout}s")
        # Judge the RESULT, not the transcript. Scanning the whole stream for
        # words like "rate limit" marked S12 as a failed call because that
        # section is about APIs and a genuine finding discussed rate limiting.
        # A run that produced a parseable final message succeeded, whatever
        # vocabulary appeared on the way.
        payload = None
        if out.exists():
            body = out.read_text(encoding="utf-8").strip()
            if body:
                try:
                    payload = json.loads(body)
                except json.JSONDecodeError:
                    payload = None
        if payload is not None:
            return payload

        blob = ((r.stdout or "") + (r.stderr or "")).strip()
        for marker in ("payment required", "usage limit", "rate limit", "quota", "unauthorized"):
            if marker in blob.lower():
                raise ReviewCallFailed(f"{marker}: {blob[-200:]}")
        raise ReviewCallFailed(f"no parseable final message (exit {r.returncode}): {blob[-200:]}")


def ask(prompt: str, model: str, timeout: int = 900) -> dict | None:
    NEUTRAL_CWD.mkdir(parents=True, exist_ok=True)
    cmd = [
        "grok", "-p", prompt,
        "--tools", "",
        "--disable-web-search",
        "--system-prompt-override", REVIEWER_CONTRACT,
        "--json-schema", SCHEMA,
        "--output-format", "json",
    ]
    if model:
        cmd += ["--model", model]
    try:
        r = subprocess.run(cmd, cwd=NEUTRAL_CWD, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        raise ReviewCallFailed(f"timed out after {timeout}s")
    blob = ((r.stdout or "") + (r.stderr or ""))
    for marker in ("Payment Required", "usage balance exhausted", "Internal error", "rate limit"):
        if marker.lower() in blob.lower():
            raise ReviewCallFailed(blob.strip()[:200])
    raw = (r.stdout or "").strip()
    if not raw:
        raise ReviewCallFailed(f"empty stdout (exit {r.returncode}): {(r.stderr or '').strip()[:160]}")
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{[\s\S]*\}", raw)
        try:
            return json.loads(m.group(0)) if m else None
        except json.JSONDecodeError:
            return None


def _findings_of(payload: dict | None) -> list[dict]:
    if not payload:
        return []
    if isinstance(payload.get("findings"), list):
        return payload["findings"]
    for v in payload.values():
        if isinstance(v, dict) and isinstance(v.get("findings"), list):
            return v["findings"]
        if isinstance(v, str):
            try:
                inner = json.loads(v)
            except (json.JSONDecodeError, TypeError):
                continue
            if isinstance(inner, dict) and isinstance(inner.get("findings"), list):
                return inner["findings"]
    return []


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip().lower()


def verify(findings: list[dict], source: str) -> list[dict]:
    """Check every quote against the source. Unverifiable quotes are not defects.

    A reviewer that paraphrases, or invents a passage, must not be able to put a
    finding into the record — the same standard this campaign applied to its own
    claims.
    """
    hay = _norm(source)
    out = []
    for f in findings:
        q = _norm(str(f.get("quote", "")))
        # allow a shortened quote: the first 40 normalised chars must appear
        probe = q[:40]
        verified = bool(probe) and probe in hay
        out.append({**f, "quote_verified": verified})
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sections", default="")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--model", default="")
    ap.add_argument("--backend", default="codex", choices=["codex", "grok"],
                    help="which independent reviewer to use")
    args = ap.parse_args()

    parsed = list(parsed_active_sections())
    if args.all:
        want = list(range(1, len(parsed) + 1))
    elif args.sections:
        want = [int(x) for x in args.sections.split(",") if x.strip()]
    else:
        want = [15, 18, 31]

    rows, all_findings, skipped, failed = [], [], [], []
    for idx in want:
        rec = parsed[idx - 1]
        path = ROOT / rec["file"]
        text = teaching_text(path)
        if len(text) < 400:
            # Never skip in silence. An earlier boundary bug returned empty prose
            # for any file whose indentation differed, and the sweep quietly
            # reviewed fewer sections than it reported.
            skipped.append({"index": idx, "file": path.name, "chars": len(text)})
            print(f"S{idx:02d} {path.name:28s} SKIPPED: only {len(text)} chars extracted", flush=True)
            continue
        prompt = (
            "Revisa el siguiente material didáctico y devuelve los defectos que encuentres.\n\n"
            "=== MATERIAL ===\n" + text + "\n=== FIN DEL MATERIAL ===\n\n"
            'Devuelve JSON: {"findings":[{"kind":"...","quote":"...","problem":"...","severity":"..."}]}. '
            "Lista vacía si no hay defectos reales."
        )
        try:
            caller = ask_codex if args.backend == "codex" else ask
            raw = _findings_of(caller(prompt, args.model))
        except ReviewCallFailed as exc:
            failed.append({"index": idx, "file": path.name, "error": str(exc)})
            print(f"S{idx:02d} {path.name:28s} CALL FAILED: {exc}", flush=True)
            continue
        checked = verify(raw, text)
        verified = [f for f in checked if f["quote_verified"]]
        rows.append(
            {
                "index": idx,
                "file": path.name,
                "title": rec.get("title"),
                "chars_reviewed": len(text),
                "findings_returned": len(checked),
                "findings_verified": len(verified),
                "findings_unverified": len(checked) - len(verified),
                "by_kind": {k: sum(1 for f in verified if f.get("kind") == k)
                            for k in {f.get("kind") for f in verified}},
                "findings": checked,
            }
        )
        for f in verified:
            all_findings.append({"index": idx, "file": path.name, **f})
        print(
            f"S{idx:02d} {path.name:28s} returned {len(checked):2d}  verified {len(verified):2d}",
            flush=True,
        )

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "reviewer": ("OpenAI Codex via local codex CLI" if args.backend == "codex"
                     else "xAI Grok via local grok CLI"),
        "model": args.model or "cli default",
        "method": "independent expert review of learner-visible theory prose",
        "superseded": (
            "An earlier design had this model sit the self-checks with a blind "
            "control. It scored 100% in both arms — a ceiling effect, since the "
            "model already knows the subject. Those numbers were discarded as "
            "uninformative rather than reported as validation."
        ),
        "isolation": [
            "neutral cwd: no project instructions (Agents.md not loaded)",
            "--tools '': physically unable to read the repository",
            "--disable-web-search: cannot look anything up",
            "only the section prose is supplied, in the prompt",
        ],
        "verification": (
            "Every finding must quote the source verbatim; quotes are checked "
            "back against the file. Unverifiable quotes are recorded but not "
            "counted as defects."
        ),
        "sections_reviewed": len(rows),
        "sections_skipped": skipped,
        "sections_failed": failed,
        # Zero findings only means "clean" when every call actually returned.
        "coverage_complete": not skipped and not failed,
        "total_verified_findings": len(all_findings),
        "sections": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "sections"}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
