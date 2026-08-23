#!/usr/bin/env python3
"""Phase E: an independent model sits the self-check, with a control.

The campaign's own validation has always had the same flaw — the writer and the
reviewer were the same agent. This hands the material to a different model
(xAI Grok, via the local `grok` CLI) that has never seen this repository, and
asks it to answer each section's self-check.

Running one condition would prove nothing, so there are two:

  TAUGHT  the model reads the section's teaching prose, then answers.
  BLIND   the model answers the same questions with no teaching text at all.

Both numbers matter, and they measure different things:

  * TAUGHT low   -> the teaching does not convey what the questions ask.
  * BLIND high   -> the questions are answerable without the material, i.e.
                    guessable from general knowledge or from the shape of the
                    options. This is the direct test of the distractor work:
                    before it, S31's options were ethical strawmen and a reader
                    could score from tone alone.
  * TAUGHT - BLIND is the signal actually attributable to the lesson.

Isolation, mirroring scripts/curriculum_learner_firewall.py's contract:

  * run from a neutral cwd, so Grok loads no project instructions — from the
    repo it would otherwise ingest Agents.md and a `pyarcana-curriculum-audit`
    skill, which would defeat the whole point;
  * `--tools ""` so the process is physically unable to read the repo;
  * `--disable-web-search` so it cannot look the answers up;
  * the answer key is never placed in the prompt, only used for scoring here.

Usage:
    python3 scripts/phase_e_independent_learner.py --sections 3,15,31
    python3 scripts/phase_e_independent_learner.py --all --model grok-4.5
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import parsed_active_sections  # noqa: E402
from curriculum_editorial_audit import split_options  # noqa: E402

SECTIONS_DIR = ROOT / "src/lib/course/sections"
OUT = ROOT / "audit/content-campaign-c04/evidence/phase_e_independent_learner.json"
NEUTRAL_CWD = Path("/tmp/pyarcana-phase-e-neutral")

LEARNER_CONTRACT = (
    "Eres una persona que está aprendiendo Python aplicado a datos. "
    "Respondes un cuestionario de autoevaluación. "
    "No tienes acceso a internet, a repositorios ni a ninguna clave de respuestas. "
    "Para cada pregunta eliges exactamente una opción, por su índice empezando en 0. "
    "Si no estás seguro, eliges la que te parezca más probable; no dejas ninguna en blanco. "
    "Respondes únicamente con JSON válido."
)

SCHEMA = json.dumps(
    {
        "type": "object",
        "properties": {
            "answers": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "q": {"type": "integer"},
                        "choice": {"type": "integer"},
                        "confidence": {"type": "string", "enum": ["baja", "media", "alta"]},
                    },
                    "required": ["q", "choice", "confidence"],
                },
            }
        },
        "required": ["answers"],
    }
)


def teaching_text(path: Path) -> str:
    """The section's learner-visible theory prose, without code or metadata."""
    src = path.read_text(encoding="utf-8")
    start = src.find("theory: [")
    # See note in phase_e_independent_review: indentation varies between files.
    m_end = re.search(r"\n\s*iDo:", src[start:]) if start >= 0 else None
    if start < 0 or not m_end:
        return ""
    end = start + m_end.start()
    block = src[start:end]
    block = re.sub(r"code:\s*`[\s\S]*?`", " ", block)
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
    return text[:60000]


def self_check(path: Path) -> list[dict]:
    """Questions with options and the key. The key never reaches the model."""
    src = path.read_text(encoding="utf-8")
    sc = src[src.find("selfCheck:") :] if "selfCheck:" in src else ""
    out = []
    for m in re.finditer(
        r"question:\s*(['\"])((?:\\.|(?!\1).)*)\1[\s\S]{0,200}?options:\s*\[([\s\S]*?)\],\s*correctIndex:\s*(\d)",
        sc,
    ):
        opts = split_options(m.group(3))
        if len(opts) < 2:
            continue
        out.append(
            {
                "question": m.group(2).replace("\\n", " "),
                "options": opts,
                "correct": int(m.group(4)),
            }
        )
    return out


def ask(prompt: str, model: str, timeout: int = 900) -> dict | None:
    NEUTRAL_CWD.mkdir(parents=True, exist_ok=True)
    cmd = [
        "grok",
        "-p",
        prompt,
        "--tools",
        "",
        "--disable-web-search",
        "--system-prompt-override",
        LEARNER_CONTRACT,
        "--json-schema",
        SCHEMA,
        "--output-format",
        "json",
    ]
    if model:
        cmd += ["--model", model]
    try:
        r = subprocess.run(
            cmd, cwd=NEUTRAL_CWD, capture_output=True, text=True, timeout=timeout
        )
    except subprocess.TimeoutExpired:
        return None
    raw = (r.stdout or "").strip()
    if not raw:
        return None
    # The CLI may wrap the structured payload; take the outermost JSON object.
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{[\s\S]*\}", raw)
        if not m:
            return None
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            return None


def _answers_of(payload: dict | None) -> list[dict]:
    if not payload:
        return []
    if isinstance(payload.get("answers"), list):
        return payload["answers"]
    for v in payload.values():
        if isinstance(v, dict) and isinstance(v.get("answers"), list):
            return v["answers"]
        if isinstance(v, str):
            try:
                inner = json.loads(v)
            except (json.JSONDecodeError, TypeError):
                continue
            if isinstance(inner, dict) and isinstance(inner.get("answers"), list):
                return inner["answers"]
    return []


def render(questions: list[dict], teaching: str | None) -> str:
    parts = []
    if teaching:
        parts.append("MATERIAL DE ESTUDIO\n\n" + teaching)
        parts.append(
            "\n\nAhora responde el cuestionario basándote en el material anterior."
        )
    else:
        parts.append(
            "Responde el siguiente cuestionario. No dispones de material de estudio."
        )
    parts.append("\n\nCUESTIONARIO\n")
    for i, q in enumerate(questions):
        parts.append(f"\n{i}. {q['question']}")
        for j, o in enumerate(q["options"]):
            parts.append(f"   [{j}] {o}")
    parts.append(
        '\n\nDevuelve JSON: {"answers":[{"q":0,"choice":0,"confidence":"media"}, ...]} '
        "con una entrada por pregunta."
    )
    return "\n".join(parts)


def score(questions: list[dict], answers: list[dict]) -> tuple[int, int]:
    by_q = {a.get("q"): a.get("choice") for a in answers if isinstance(a, dict)}
    right = sum(1 for i, q in enumerate(questions) if by_q.get(i) == q["correct"])
    return right, len(questions)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sections", default="", help="comma-separated 1-based indices")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--model", default="", help="grok model id; empty uses the CLI default")
    args = ap.parse_args()

    parsed = list(parsed_active_sections())
    files = sorted(SECTIONS_DIR.glob("*.ts"))
    order = [ROOT / p["file"] if "file" in p else None for p in parsed]

    if args.all:
        want = list(range(1, len(parsed) + 1))
    elif args.sections:
        want = [int(x) for x in args.sections.split(",") if x.strip()]
    else:
        want = [3, 15, 31]

    rows = []
    for idx in want:
        path = order[idx - 1]
        if path is None or not Path(path).exists():
            continue
        path = Path(path)
        qs = self_check(path)
        if len(qs) < 4:
            continue
        teach = teaching_text(path)

        taught = _answers_of(ask(render(qs, teach), args.model))
        blind = _answers_of(ask(render(qs, None), args.model))
        tr, tn = score(qs, taught)
        br, bn = score(qs, blind)
        rows.append(
            {
                "index": idx,
                "file": path.name,
                "questions": len(qs),
                "taught_correct": tr,
                "taught_total": tn,
                "blind_correct": br,
                "blind_total": bn,
                "taught_pct": round(100 * tr / tn) if tn else None,
                "blind_pct": round(100 * br / bn) if bn else None,
                "lift": (round(100 * tr / tn) - round(100 * br / bn)) if tn and bn else None,
                "answered_taught": len(taught),
                "answered_blind": len(blind),
            }
        )
        print(
            f"S{idx:02d} {path.name:28s} taught {tr}/{tn}  blind {br}/{bn}",
            flush=True,
        )

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "reviewer": "xAI Grok via local grok CLI",
        "model": args.model or "cli default",
        "isolation": [
            "neutral cwd: no project instructions (Agents.md not loaded)",
            "--tools '': physically unable to read the repository",
            "--disable-web-search: cannot look the answers up",
            "answer key never placed in any prompt",
        ],
        "note": (
            "TAUGHT reads the section prose then answers; BLIND answers the same "
            "questions with no material. Lift is the part attributable to the "
            "lesson. A high BLIND score means the questions are guessable "
            "without the teaching, which is what the distractor pass addressed."
        ),
        "sections": rows,
    }
    if rows:
        report["mean_taught_pct"] = round(sum(r["taught_pct"] for r in rows) / len(rows))
        report["mean_blind_pct"] = round(sum(r["blind_pct"] for r in rows) / len(rows))
        report["mean_lift"] = report["mean_taught_pct"] - report["mean_blind_pct"]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "sections"}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
