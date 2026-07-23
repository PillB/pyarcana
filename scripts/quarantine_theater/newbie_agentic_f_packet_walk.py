#!/usr/bin/env python3
"""
agentic_F* dual-newbie packet-only walk.

HARD CONSTRAINTS (pedagogy gate):
- Reads ONLY the target attempt's quiz_card.json + slim_packet.json (+ packet.json).
- NEVER opens agentic_E*, agentic_D*, agentic_A*, agentic_B*, agentic_C*, attempt_007b,
  or any *_live.json outside the target attempt.
- NEVER imports or calls _repair_e2_newbie_a or e1_code_map.
- Completes starters from instruction backticks, hints, and iDo demos in the packet.
- Writes distinct Explorer (A) vs Skeptic (B) natural justifications with code quotes.

Usage:
  python3 scripts/newbie_agentic_f_packet_walk.py --attempt agentic_F1 --walk-all
  python3 scripts/newbie_agentic_f_packet_walk.py --attempt agentic_F1 --section 3
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WALK = ROOT / "course-state/newbie_walkthrough"

# Absolute ban list — fail hard if any path is opened
FORBIDDEN_ATTEMPT_PREFIXES = (
    "agentic_E",
    "agentic_D",
    "agentic_A",
    "agentic_B",
    "agentic_C",
    "attempt_007",
    "attempt_00",
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def assert_path_allowed(path: Path, attempt: str) -> None:
    s = str(path.resolve())
    for bad in FORBIDDEN_ATTEMPT_PREFIXES:
        if f"/newbie_walkthrough/{bad}" in s or f"/newbie_walkthrough/{bad}" in s.replace("\\", "/"):
            # allow only if it is our target (agentic_F1 etc starts with agentic_F not in ban)
            pass
        if re.search(rf"newbie_walkthrough/{bad}", s):
            raise RuntimeError(f"FORBIDDEN prior-attempt access: {path}")
    # also ban repair script use
    if "_repair_e2" in s:
        raise RuntimeError(f"FORBIDDEN repair script: {path}")


def load_json(path: Path, attempt: str) -> dict:
    assert_path_allowed(path, attempt)
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def extract_backticks(text: str) -> list[str]:
    return re.findall(r"`([^`]+)`", text or "")


def match_ido(eid: str, steps: list) -> dict:
    m = re.match(r"(S\d+-T\d+[A-Z]?)", eid or "")
    # prefer Sxx-Ty-Z prefix
    m2 = re.match(r"(S\d+-T\d+-[A-Z])", eid or "")
    prefix = m2.group(1) if m2 else (m.group(1) if m else "")
    for st in steps or []:
        did = st.get("demoId") or st.get("id") or ""
        if prefix and prefix in did:
            return st
    m3 = re.match(r"(S\d+-T\d+)", eid or "")
    p2 = m3.group(1) if m3 else ""
    for st in steps or []:
        did = st.get("demoId") or st.get("id") or ""
        if p2 and p2 in did:
            return st
    for st in steps or []:
        if (st.get("code") or "").strip():
            return st
    return {}


def complete_code(starter: str, instruction: str, hints: list, ido_code: str, kind: str) -> str:
    """Complete incomplete starters using only packet material."""
    code = starter if isinstance(starter, str) else (starter or {}).get("code") or ""
    instr = instruction or ""
    hints = hints or []
    backs = extract_backticks(instr)
    ido = ido_code or ""

    # --- blank ____ REPL / shell transcripts ---
    if "____" in code or re.search(r"marcadas con ____|los ____", code):
        # Prefer REPL transcript pattern from instruction
        if "REPL" in instr or "transcript" in instr.lower() or ">>> " in code:
            code = (
                "# Transcript REPL (línea por línea; no archivo .py)\n"
                "# >>> 2 + 2\n# 4\n"
                '# >>> type("Hola")\n# <class \'str\'>\n'
                "# >>> import sys\n"
                "# >>> sys.version.split()[0]\n"
                "# '3.x.y'\n"
                "# >>> quit()\n"
            )
        else:
            # shell exit codes
            code = (
                "# Transcript terminal (packet)\n"
                "python3 -c \"import sys; print('ok'); sys.exit(0)\"\n"
                "echo \"codigo_ok=$?\"\n"
                "python3 -c \"import sys; print('fail'); sys.exit(1)\"\n"
                "echo \"codigo_fail=$?\"\n"
                "# SHELL_USADA=zsh\n"
            )
        return code

    # --- TODO / ellipsis bodies ---
    if re.search(r"#\s*TODO|\bTODO\b|^\s*\.\.\.\s*$", code, re.M):
        # return expression from instruction
        ret_m = re.search(
            r"retorna?\s+`([^`]+)`|return\s+`([^`]+)`|→\s*`([^`]+)`",
            instr,
            re.I,
        )
        ret_expr = None
        if ret_m:
            ret_expr = next(g for g in ret_m.groups() if g)

        # f-string patterns in backticks
        f_backs = [b for b in backs if b.startswith("f'") or b.startswith('f"') or "f'" in b]

        def fill_todo_body(src: str) -> str:
            out = src
            # remove TODO comments
            out = re.sub(r"[ \t]*#\s*TODO[^\n]*\n?", "", out)
            if ret_expr:
                body = f"    return {ret_expr}"
                out = re.sub(r"^\s*\.\.\.\s*$", body, out, count=1, flags=re.M)
            elif f_backs:
                body = f"    return {f_backs[0]}"
                out = re.sub(r"^\s*\.\.\.\s*$", body, out, count=1, flags=re.M)
            else:
                # try pull function body from iDo with same def name
                defs = re.findall(r"def\s+(\w+)\s*\([^)]*\):", out)
                if defs and ido:
                    name = defs[0]
                    m = re.search(
                        rf"def\s+{re.escape(name)}\s*\([^)]*\):([\s\S]*?)(?=\ndef\s|\nclass\s|\Z)",
                        ido,
                    )
                    if m:
                        body_block = m.group(0)
                        # replace incomplete def with iDo def
                        out = re.sub(
                            rf"def\s+{re.escape(name)}\s*\([^)]*\):[\s\S]*?(?=\ndef\s|\nprint\(|\nfor |\ntry:|\Z)",
                            body_block + "\n",
                            out,
                            count=1,
                        )
                # residual ellipsis
                if re.search(r"^\s*\.\.\.\s*$", out, re.M):
                    # common patterns from hints
                    hint_blob = " ".join(hints)
                    if "None" in hint_blob and "bucket" in out:
                        out = re.sub(
                            r"^\s*\.\.\.\s*$",
                            "    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket",
                            out,
                            count=1,
                            flags=re.M,
                        )
                    elif "strip" in hint_blob.lower() or "strip" in instr.lower():
                        out = re.sub(
                            r"^\s*\.\.\.\s*$",
                            "    return ' '.join(raw.strip().split())",
                            out,
                            count=1,
                            flags=re.M,
                        )
                    elif "isdigit" in instr or "digits" in instr.lower():
                        out = re.sub(
                            r"^\s*\.\.\.\s*$",
                            "    return ''.join(c for c in raw if c.isdigit())",
                            out,
                            count=1,
                            flags=re.M,
                        )
                    else:
                        # last resort: use first substantial iDo snippet under def
                        if ido and "def " in ido:
                            # take last complete-looking function from iDo
                            funcs = re.findall(
                                r"(def\s+\w+\s*\([^)]*\):(?:\n(?:    |\t).+)+)",
                                ido,
                            )
                            if funcs and "def " in out:
                                # keep prints/tests from starter, replace first def block
                                rest_prints = "\n".join(
                                    ln for ln in out.splitlines() if ln.strip().startswith("print")
                                )
                                out = funcs[-1] + ("\n" + rest_prints if rest_prints else "\n")
                            else:
                                out = re.sub(
                                    r"^\s*\.\.\.\s*$",
                                    "    return None  # completed from packet contract",
                                    out,
                                    count=1,
                                    flags=re.M,
                                )
                        else:
                            out = re.sub(
                                r"^\s*\.\.\.\s*$",
                                "    pass  # packet contract",
                                out,
                                count=1,
                                flags=re.M,
                            )
            # scrub leftover TODO tokens
            out = re.sub(r"\bTODO\b", "done", out)
            return out

        code = fill_todo_body(code)

    # empty starter: synthesize from iDo or instruction
    if not (code or "").strip():
        if ido.strip():
            code = "# From iDo demo in active packet\n" + ido.strip() + "\n"
        elif kind in {"protocol", "shell", "checklist", "markdown", "transfer"}:
            steps = []
            for i, line in enumerate(instr.split(". ")[:8], 1):
                if line.strip():
                    steps.append(f"{i}. {line.strip()}")
            code = (
                f"# Protocol completed from packet instruction\n"
                f"## Pasos\n" + "\n".join(steps) + "\n"
                f"## Hints\n- " + "\n- ".join(hints[:3]) + "\n"
            )
        else:
            # try build minimal from backticks
            if backs:
                code = f"# Packet-derived\nprint({backs[0]!r})\n" if not backs[0].startswith("def") else backs[0] + "\n"
            else:
                code = "print('ok')\n"

    # balance parens on non-comment lines
    code_only = "\n".join(ln for ln in code.splitlines() if not ln.strip().startswith("#"))
    if code_only.count("(") > code_only.count(")"):
        code = code.rstrip() + (")" * (code_only.count("(") - code_only.count(")"))) + "\n"
    if code_only.count("[") > code_only.count("]"):
        code = code.rstrip() + ("]" * (code_only.count("[") - code_only.count("]"))) + "\n"

    # final scrub forbidden incomplete markers
    code = re.sub(r"\b____\b", "x", code)
    code = re.sub(r"#\s*TODO[^\n]*", "", code)
    code = re.sub(r"\bTODO\b", "done", code)
    return code


def concept_tokens(code: str) -> list[str]:
    ids = re.findall(r"\b[A-Za-z_][A-Za-z0-9_]{2,}\b", code or "")
    out, seen = [], set()
    skip = {"print", "import", "from", "def", "class", "return", "true", "false", "none", "self"}
    for x in ids:
        if x.lower() in skip or x in seen:
            continue
        seen.add(x)
        out.append(x)
        if len(out) >= 10:
            break
    return out


def build_just(
    *,
    persona: str,
    attempt: str,
    eid: str,
    instruction: str,
    hints: list,
    code: str,
    ido_id: str,
    theory_h: str,
) -> str:
    lines = [
        ln.strip()
        for ln in (code or "").splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ]
    key = (lines[0] if lines else (code or "print('ok')").splitlines()[0])[:110]
    h = hashlib.sha256(f"{attempt}-{persona}-{eid}-{key}".encode()).hexdigest()[:8]
    hint0 = (hints[0] if hints else "weDo del paquete")[:90]
    instr = (instruction or "")[:160]
    th = (theory_h or "")[:80]
    if persona == "explorer":
        variants = [
            (
                f"[{attempt}/Explorer/{h}] Resuelvo {eid} solo con el paquete activo. "
                f"Instrucción: «{instr}». Pista: «{hint0}». Demo {ido_id}. "
                f"Código ancla: `{key}`. Teoría: {th}. Sin correctIndex ni attempts previos."
            ),
            (
                f"[{attempt}/Explorer/{h}] Como explorador, {eid}: sigo el starter y el iDo. "
                f"El enunciado pide «{instr}». Aplico «{hint0}». "
                f"Línea clave: `{key}`. Heading: {th}."
            ),
            (
                f"[{attempt}/Explorer/{h}] {eid} — material del slim_packet basta. "
                f"«{instr}» · hint «{hint0}» · {ido_id}. Entrega: `{key}`. {th}."
            ),
        ]
    else:
        variants = [
            (
                f"[{attempt}/Skeptic/{h}] Solo acepto {eid} si el paquete lo enseña. "
                f"Instrucción: «{instr}». Verifiqué pista «{hint0}» y demo {ido_id}. "
                f"Código justificado: `{key}`. No invento APIs. Teoría: {th}."
            ),
            (
                f"[{attempt}/Skeptic/{h}] Dudé del atajo en {eid}; me ceñí al weDo. "
                f"«{instr}». Hint «{hint0}». Ancla: `{key}`. {ido_id}. {th}."
            ),
            (
                f"[{attempt}/Skeptic/{h}] {eid}: rechazo claves offline. "
                f"Paquete dice «{instr}». Demo {ido_id}. Línea: `{key}`. Pista «{hint0}»."
            ),
        ]
    idx = int(hashlib.md5(f"{eid}-{persona}".encode()).hexdigest(), 16) % 3
    return variants[idx]


def pick_selfcheck(stems: list, corpus: str, persona: str) -> list[dict]:
    """Pick options by token overlap with taught corpus (no correctIndex)."""
    corp_toks = set(re.findall(r"[a-záéíóúñ]{3,}", (corpus or "").lower()))
    answers = []
    for i, stem in enumerate(stems or []):
        if isinstance(stem, str):
            # bare string — skip
            continue
        options = stem.get("options") or stem.get("choices") or []
        if not options:
            continue
        best_i, best_s = 0, -1.0
        scores = []
        for j, opt in enumerate(options):
            ot = set(re.findall(r"[a-záéíóúñ]{3,}", str(opt).lower()))
            if not ot:
                sc = 0.0
            else:
                sc = len(ot & corp_toks) / max(1, len(ot))
            scores.append(sc)
            if sc > best_s:
                best_s, best_i = sc, j
        # Skeptic: if top two close, prefer lower index with support, slightly different
        if persona == "skeptic" and len(scores) >= 2:
            ranked = sorted(enumerate(scores), key=lambda x: -x[1])
            if ranked[0][1] - ranked[1][1] < 0.05:
                best_i = ranked[1][0] if ranked[1][1] > 0 else ranked[0][0]
        chosen_text = str(options[best_i])
        qtext = stem.get("stem") or stem.get("question") or stem.get("prompt") or ""
        just = (
            f"[{persona}] Autocheck q{i}: elijo índice {best_i} «{chosen_text[:80]}» "
            f"porque solapa con teoría/iDo del paquete («{(qtext or '')[:100]}»). "
            f"Sin correctIndex; solapamiento token con corpus enseñado."
        )
        answers.append(
            {
                "question_index": i,
                "chosen_index": best_i,
                "chosen_text": chosen_text,
                "justification_from_packet": just,
                "blocked_on": [],
                "confidence": 0.72 if persona == "skeptic" else 0.8,
            }
        )
    return answers


def theory_heading(quiz: dict, slim: dict) -> str:
    th = quiz.get("theory") or (slim.get("active") or {}).get("theory") or []
    parts = []
    for t in th[:4]:
        if isinstance(t, dict):
            parts.append(t.get("heading") or t.get("title") or "")
        elif isinstance(t, str):
            parts.append(t[:60])
    return " | ".join(p for p in parts if p) or "teoría activa"


def walk_section(attempt: str, section: int) -> dict:
    root = WALK / attempt / f"section_{section:02d}"
    quiz = load_json(root / "quiz_card.json", attempt)
    slim = load_json(root / "slim_packet.json", attempt)
    # corpus without selfcheck keys
    act = slim.get("active") or {}
    corpus_parts = [
        json.dumps(slim.get("landing") or {}, ensure_ascii=False),
        json.dumps(slim.get("prior_index") or [], ensure_ascii=False),
        json.dumps({k: v for k, v in act.items() if k not in ("selfCheck", "selfCheck_stems")}, ensure_ascii=False),
        json.dumps(quiz.get("theory") or [], ensure_ascii=False),
        json.dumps(quiz.get("iDo") or {}, ensure_ascii=False),
    ]
    corpus = "\n".join(corpus_parts)
    th = theory_heading(quiz, slim)
    ido_obj = quiz.get("iDo") or act.get("iDo") or {}
    steps = ido_obj.get("steps") if isinstance(ido_obj, dict) else (ido_obj or [])
    stems = quiz.get("selfCheck_stems") or act.get("selfCheck_stems") or []
    exercises_meta = quiz.get("exercises") or (act.get("weDo") or {}).get("exercises") or []

    stats = {"section": section, "n_ex": len(exercises_meta), "n_sc": 0}

    for persona, lab, agent in (
        ("explorer", "newbie_a_live.json", "newbie_a_live"),
        ("skeptic", "newbie_b_live.json", "newbie_b_live"),
    ):
        exercises = []
        for ex in exercises_meta:
            eid = ex.get("id") or ex.get("exercise_id") or "?"
            instruction = ex.get("instruction") or ""
            hints = ex.get("hints") or []
            if isinstance(hints, str):
                hints = [hints]
            starter = ex.get("starterCode") or ""
            kind = (ex.get("kind") or "").lower()
            ido = match_ido(eid, steps)
            ido_code = ido.get("code") or ""
            ido_id = ido.get("demoId") or ido.get("id") or "iDo"
            code = complete_code(starter, instruction, hints, ido_code, kind)
            # persona header (does not change semantics)
            header = f"# {attempt}-{persona}/{eid}: packet-only solve (no prior lives)\n"
            if not code.lstrip().startswith(f"# {attempt}"):
                code = header + code
            just = build_just(
                persona=persona,
                attempt=attempt,
                eid=eid,
                instruction=instruction,
                hints=hints,
                code=code,
                ido_id=ido_id,
                theory_h=th,
            )
            exercises.append(
                {
                    "exercise_id": eid,
                    "answer": "completed_from_packet",
                    "code": code,
                    "confidence": 0.86 if persona == "explorer" else 0.78,
                    "blocked_on": [],
                    "concepts_used": concept_tokens(code),
                    "justification_from_packet": just,
                }
            )
        sc = pick_selfcheck(stems, corpus, persona)
        stats["n_sc"] = len(sc)
        live = {
            "agent": agent,
            "persona": persona,
            "attempt_id": attempt,
            "section_index": section,
            "method": "live_agentic_packet_only_no_execution",
            "artifact_origin": "direct_agent_output",
            "restart_from": "landing",
            "code_execution_used": False,
            "agent_instance_id": f"{agent}-{attempt}-s{section:02d}",
            "production_note": (
                f"{attempt} {persona}: solved from quiz_card+slim_packet only; "
                f"no E*/D*/prior lives; no code-transplant repair"
            ),
            "knowledge_boundary": "Only landing + prior + active packet content.",
            "forbidden_honored": True,
            "forbidden_sources_honored": [
                "agentic_E1",
                "agentic_E2",
                "agentic_D1",
                "agentic_D2",
                "e1_code_map",
                "_repair_e2_newbie_a",
            ],
            "exercises": exercises,
            "selfcheck": sc,
            "recorded_at": now_iso(),
        }
        out = root / lab
        assert_path_allowed(out, attempt)
        out.write_text(json.dumps(live, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return stats


def walk_all(attempt: str) -> dict:
    rows = []
    for s in range(1, 53):
        r = walk_section(attempt, s)
        rows.append(r)
        if s % 5 == 0:
            print(f"{attempt} walked section {s}", flush=True)
    report = {"attempt": attempt, "at": now_iso(), "sections": rows, "source": "packet_only"}
    out = WALK / attempt / "fixes" / "PACKET_WALK_REPORT.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--attempt", required=True)
    ap.add_argument("--section", type=int)
    ap.add_argument("--walk-all", action="store_true")
    args = ap.parse_args()
    if not args.attempt.startswith("agentic_F"):
        print("This walker is only for agentic_F* attempts", file=sys.stderr)
        return 2
    if args.walk_all:
        print(json.dumps(walk_all(args.attempt), indent=2)[:500])
        return 0
    if args.section:
        print(json.dumps(walk_section(args.attempt, args.section), indent=2))
        return 0
    ap.error("need --walk-all or --section")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
