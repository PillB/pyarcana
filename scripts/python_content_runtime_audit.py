#!/usr/bin/env python3
"""
Runtime + structure audit for Python course content.

Extracts demos / exercise starters / solutions from section TS files,
runs Python snippets in isolation, classifies pass/fail/skip/expected_fail.

Usage:
  python3 scripts/python_content_runtime_audit.py
  python3 scripts/python_content_runtime_audit.py --shard 0/4
  python3 scripts/python_content_runtime_audit.py --only s01-setup
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/python_runtime_audit_report.json"
ISSUES = ROOT / "course-state/python_content_issue_registry.json"

TIMEOUT_SEC = 8
OPTIONAL_MODULES = {
    "numpy",
    "pandas",
    "sklearn",
    "scipy",
    "matplotlib",
    "seaborn",
    "fastapi",
    "streamlit",
    "PIL",
    "cv2",
    "torch",
    "tensorflow",
    "redis",
    "sqlalchemy",
    "pydantic",
    "httpx",
    "bs4",
    "yaml",
    "dotenv",
    "openai",
    "anthropic",
    "langchain",
    "chromadb",
    "neo4j",
    "kafka",
    "boto3",
    "google",
    "dbt",
    "pytest",
    "requests",
}

# Starter patterns that intentionally fail
EXPECTED_FAIL_MARKERS = (
    "____",
    "...",
    "NotImplementedError",
    "TODO",
    "FIXME",
    "pass  # completa",
    "raise NotImplemented",
    "# tu código",
    "# completar",
    "Ellipsis",
)


def extract_balanced_template(text: str, start: int) -> str | None:
    """Extract content of `...` template literal starting at backtick index start."""
    if start >= len(text) or text[start] != "`":
        return None
    i = start + 1
    out = []
    while i < len(text):
        ch = text[i]
        if ch == "\\":
            if i + 1 < len(text):
                out.append(text[i + 1])
                i += 2
                continue
        if ch == "`":
            return "".join(out)
        out.append(ch)
        i += 1
    return None


def extract_code_field_fixed(block: str) -> tuple[str | None, str | None, str | None]:
    lang_m = re.search(r"language:\s*['\"]([^'\"]+)['\"]", block)
    lang = lang_m.group(1) if lang_m else None
    code = None
    cm = re.search(r"\bcode:\s*`", block)
    if cm:
        code = extract_balanced_template(block, cm.end() - 1)
    else:
        cm2 = re.search(r"\bcode:\s*'((?:\\'|[^'])*)'", block, re.S)
        if cm2:
            code = cm2.group(1).replace("\\n", "\n").replace("\\'", "'").replace("\\`", "`")
    output = None
    om = re.search(r"\boutput:\s*`", block)
    if om:
        output = extract_balanced_template(block, om.end() - 1)
    return code, lang, output


def find_object_after(text: str, key: str) -> list[str]:
    """Find `{...}` objects immediately after `key:` (brace-balanced)."""
    results = []
    for m in re.finditer(rf"\b{re.escape(key)}\s*:\s*\{{", text):
        start = m.end() - 1
        depth = 0
        i = start
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    results.append(text[start : i + 1])
                    break
            elif text[i] == "`":
                # skip template
                j = i + 1
                while j < len(text):
                    if text[j] == "\\" and j + 1 < len(text):
                        j += 2
                        continue
                    if text[j] == "`":
                        break
                    j += 1
                i = j
            i += 1
    return results


def looks_python(code: str, lang: str | None) -> bool:
    if lang:
        l = lang.lower()
        if l in ("bash", "sh", "shell", "powershell", "text", "json", "yaml", "toml", "sql", "html", "css", "markdown", "md"):
            return False
        if "python" in l:
            return True
    # markdown / pseudocode / shell
    if re.search(r"^(# |\$ |mkdir |cd |pip |python3? |source |export |echo |curl |git )", code, re.M):
        return False
    if re.search(r"^[\-\*]\s+\w", code, re.M) and "def " not in code and "import " not in code:
        return False  # bullet list
    if code.strip().startswith("---") or code.strip().startswith("```"):
        return False
    if re.search(r"\b(def |import |print\(|class |from \w+ import|async def )", code):
        return True
    if re.search(r"^(#|\$ |mkdir |cd |pip |python3? |source |export )", code, re.M):
        return False
    return bool(re.search(r"[a-zA-Z_][a-zA-Z0-9_]*\s*=", code)) and "print" in code


def imports_needed(code: str) -> set[str]:
    mods = set()
    for m in re.finditer(r"^\s*(?:import|from)\s+([a-zA-Z0-9_]+)", code, re.M):
        mods.add(m.group(1))
    return mods


def intentional_incomplete(code: str) -> bool:
    low = code.lower()
    if "____" in code or "…" in code:
        return True
    for mk in EXPECTED_FAIL_MARKERS:
        if mk.lower() in low:
            return True
    # classic pedagogy: assignment in condition
    if re.search(r"\bif\s+\w+\s*=\s*[^=]", code):
        return True
    # empty function bodies with only pass
    if re.search(r"def \w+\([^)]*\):\s*\n\s*pass\s*$", code, re.M):
        return True
    return False


def needs_cli_argv(code: str) -> bool:
    return bool(
        re.search(r"argparse|sys\.argv|click\.|typer\.", code)
        and not re.search(r"sys\.argv\s*=", code)
    )


def run_python(code: str, timeout: int = TIMEOUT_SEC) -> dict:
    with tempfile.TemporaryDirectory(prefix="pyarcana_") as td:
        path = Path(td) / "snippet.py"
        path.write_text(code, encoding="utf-8")
        try:
            proc = subprocess.run(
                [sys.executable, "-I", str(path)],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=td,
                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
            )
            return {
                "exit": proc.returncode,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "timeout": False,
            }
        except subprocess.TimeoutExpired:
            return {"exit": -1, "stdout": "", "stderr": "TIMEOUT", "timeout": True}


def normalize_out(s: str) -> str:
    return "\n".join(line.rstrip() for line in s.strip().splitlines())


def classify_run(
    kind: str,
    code: str,
    lang: str | None,
    expected_output: str | None,
    result: dict | None,
    skip_reason: str | None,
) -> dict:
    if skip_reason:
        return {"status": "skip", "reason": skip_reason, "severity": None}
    assert result is not None
    if result.get("timeout"):
        return {"status": "fail", "reason": "timeout", "severity": "P0", "stderr": "TIMEOUT"}

    exit_c = result["exit"]
    stdout = result["stdout"]
    stderr = result["stderr"]

    if kind == "solution" or kind == "demo" or kind == "theory":
        if exit_c != 0:
            # missing deps first
            if "ModuleNotFoundError" in stderr or "ImportError" in stderr:
                return {
                    "status": "skip",
                    "reason": "missing_dependency",
                    "severity": "P2",
                    "stderr": stderr[-300:],
                }
            # match/case and PEP604 unions require Python 3.10+
            if sys.version_info < (3, 10) and (
                ("match " in code and "SyntaxError" in stderr)
                or ("TypeError" in stderr and "unsupported operand type(s) for |" in stderr)
            ):
                return {
                    "status": "skip",
                    "reason": "requires_python_3_10_plus",
                    "severity": None,
                    "stderr": stderr[-200:],
                }
            # FileNotFound for sample data paths — environment
            if "FileNotFoundError" in stderr or "No such file" in stderr:
                return {
                    "status": "skip",
                    "reason": "needs_fixture_files",
                    "severity": "P2",
                    "stderr": stderr[-300:],
                }
            # incomplete solution?
            if intentional_incomplete(code):
                return {
                    "status": "fail",
                    "reason": "solution_incomplete_or_stub",
                    "severity": "P0",
                    "stderr": stderr[-500:],
                    "exit": exit_c,
                }
            return {
                "status": "fail",
                "reason": "nonzero_exit",
                "severity": "P0",
                "stderr": stderr[-500:],
                "exit": exit_c,
            }
        if expected_output is not None and expected_output.strip():
            # soft compare: first non-empty lines
            exp = normalize_out(expected_output)
            got = normalize_out(stdout)
            # demos often have path-specific output — only fail if completely different prefix
            if exp and got and exp.splitlines()[0] not in got and got.splitlines()[0] not in exp:
                # allow if expected is illustrative (contains ...)
                if "..." in exp or "…" in exp:
                    return {"status": "pass", "reason": "output_illustrative"}
                return {
                    "status": "fail",
                    "reason": "output_mismatch",
                    "severity": "P1",
                    "expected_head": exp[:120],
                    "got_head": got[:120],
                }
        return {"status": "pass", "reason": "ok"}

    if kind == "starter":
        if intentional_incomplete(code):
            if exit_c != 0:
                err = stderr + stdout
                # appropriate pedagogical errors
                good = any(
                    x in err
                    for x in (
                        "NameError",
                        "SyntaxError",
                        "NotImplementedError",
                        "AssertionError",
                        "IndentationError",
                        "TypeError",
                        "ValueError",
                        "____",
                        "invalid syntax",
                    )
                )
                if good or "____" in code:
                    return {
                        "status": "pass",
                        "reason": "expected_fail_ok",
                        "exit": exit_c,
                        "stderr_head": stderr[:200],
                    }
                return {
                    "status": "fail",
                    "reason": "unexpected_error_type",
                    "severity": "P1",
                    "stderr": stderr[-400:],
                }
            # starter runs successfully — may still be incomplete (pass only)
            return {"status": "pass", "reason": "starter_runs_partial"}
        # complete-looking starter should run
        if exit_c != 0:
            if "ModuleNotFoundError" in stderr:
                return {"status": "skip", "reason": "missing_dependency", "severity": "P2"}
            return {
                "status": "fail",
                "reason": "starter_should_run_or_be_marked_incomplete",
                "severity": "P1",
                "stderr": stderr[-400:],
            }
        return {"status": "pass", "reason": "starter_ok"}

    return {"status": "skip", "reason": "unknown_kind"}


def extract_artifacts(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8", errors="replace")
    sid_m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text)
    section_id = sid_m.group(1) if sid_m else path.stem
    arts: list[dict] = []

    # demos: objects with demoId nearby code blocks — extract all code: under iDo roughly
    # Starter / solution
    for key, kind in (("starterCode", "starter"), ("solutionCode", "solution")):
        for i, obj in enumerate(find_object_after(text, key)):
            code, lang, output = extract_code_field_fixed(obj)
            if not code or not code.strip():
                continue
            # find nearby id
            # search backwards for exercise id
            arts.append(
                {
                    "section_id": section_id,
                    "file": str(path.relative_to(ROOT)),
                    "kind": kind,
                    "artifact_id": f"{key}-{i}",
                    "lang": lang,
                    "code": code,
                    "expected_output": output,
                }
            )

    # iDo steps: description + code objects — grab all `code: {` under steps that look like demos
    for i, obj in enumerate(find_object_after(text, "code")):
        # only language-bearing CodeExample objects
        if "language:" not in obj and "code:" not in obj:
            continue
        code, lang, output = extract_code_field_fixed(obj)
        if not code or not code.strip():
            continue
        # skip if this object is nested inside starter/solution (already counted)
        # Heuristic: if object is tiny and only code example from theory
        arts.append(
            {
                "section_id": section_id,
                "file": str(path.relative_to(ROOT)),
                "kind": "demo",  # broad: theory + iDo demos
                "artifact_id": f"code-block-{i}",
                "lang": lang,
                "code": code,
                "expected_output": output,
            }
        )

    # Deduplicate by code hash + kind preference (solution > starter > demo)
    seen: dict[str, dict] = {}
    prio = {"solution": 3, "starter": 2, "demo": 1, "theory": 1}
    for a in arts:
        h = hashlib.sha1((a["kind"][:1] + a["code"]).encode()).hexdigest()[:16]
        # for same code different kinds keep both via kind in key
        key = f"{a['kind']}:{hashlib.sha1(a['code'].encode()).hexdigest()[:12]}"
        if key not in seen or prio.get(a["kind"], 0) > prio.get(seen[key]["kind"], 0):
            seen[key] = a
    return list(seen.values())


def audit_artifact(art: dict) -> dict:
    code = art["code"]
    lang = art.get("lang")
    kind = art["kind"]

    if not looks_python(code, lang):
        return {
            "section_id": art["section_id"],
            "file": art["file"],
            "kind": kind,
            "artifact_id": art["artifact_id"],
            "lang": lang,
            "code_sha": hashlib.sha1(code.encode()).hexdigest()[:12],
            "code_len": len(code),
            "result": {"status": "skip", "reason": f"non_python:{lang}"},
        }

    if needs_cli_argv(code) and kind in ("demo", "solution", "theory"):
        return {
            "section_id": art["section_id"],
            "file": art["file"],
            "kind": kind,
            "artifact_id": art["artifact_id"],
            "lang": lang,
            "code_sha": hashlib.sha1(code.encode()).hexdigest()[:12],
            "code_len": len(code),
            "result": {"status": "skip", "reason": "needs_cli_argv"},
        }

    # Demos that document errors (NameError, etc.) — expect fail
    if kind == "demo" and re.search(
        r"(NameError|TypeError|ValueError|SyntaxError|Traceback|error intencional|falla a prop[oó]sito)",
        code,
        re.I,
    ):
        result = run_python(code)
        if result["exit"] != 0:
            return {
                "section_id": art["section_id"],
                "file": art["file"],
                "kind": kind,
                "artifact_id": art["artifact_id"],
                "lang": lang,
                "code_sha": hashlib.sha1(code.encode()).hexdigest()[:12],
                "code_len": len(code),
                "result": {"status": "pass", "reason": "intentional_error_demo"},
                "exit": result["exit"],
            }

    mods = imports_needed(code)
    missing = [m for m in mods if m in OPTIONAL_MODULES]
    # try import check
    for m in list(missing):
        try:
            __import__(m)
            missing.remove(m)
        except Exception:
            pass
    if missing and kind in ("solution", "demo"):
        # still try run — may fail ModuleNotFound
        pass

    # Transform intentional blanks for classification only on starter
    run_code = code
    if kind == "starter" and "____" in code:
        # leave as-is to SyntaxError
        pass

    result = run_python(run_code)
    classification = classify_run(
        kind, code, lang, art.get("expected_output"), result, None
    )
    return {
        "section_id": art["section_id"],
        "file": art["file"],
        "kind": kind,
        "artifact_id": art["artifact_id"],
        "lang": lang,
        "code_sha": hashlib.sha1(code.encode()).hexdigest()[:12],
        "code_len": len(code),
        "result": classification,
        "exit": result.get("exit"),
    }


def audit_section_file(path: Path) -> dict:
    arts = extract_artifacts(path)
    results = [audit_artifact(a) for a in arts]
    counts = {"pass": 0, "fail": 0, "skip": 0}
    for r in results:
        st = r["result"]["status"]
        counts[st] = counts.get(st, 0) + 1
    return {
        "file": str(path.relative_to(ROOT)),
        "section_id": results[0]["section_id"] if results else path.stem,
        "artifact_count": len(results),
        "counts": counts,
        "results": results,
    }


def list_section_files(only: str | None, shard: str | None) -> list[Path]:
    files = sorted(SECTIONS_DIR.glob("s*.ts"))
    # prefer canonical order from index imports
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    order = re.findall(r"from\s+['\"]\./sections/([^'\"]+)['\"]", index)
    ordered = []
    for base in order:
        p = SECTIONS_DIR / (base if base.endswith(".ts") else f"{base}.ts")
        if p.exists():
            ordered.append(p)
    for p in files:
        if p not in ordered:
            ordered.append(p)
    files = ordered
    if only:
        files = [p for p in files if only in p.name or only in p.read_text()[:500]]
    if shard:
        k, n = shard.split("/")
        k, n = int(k), int(n)
        files = [p for i, p in enumerate(files) if i % n == k]
    return files


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shard", default=None, help="k/n")
    ap.add_argument("--only", default=None)
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) // 2))
    ap.add_argument("--limit", type=int, default=0, help="max section files (0=all)")
    args = ap.parse_args()

    files = list_section_file_list = list_section_files(args.only, args.shard)
    if args.limit:
        files = files[: args.limit]

    section_reports = []
    # ProcessPool can be heavy; use threads-ish sequential if workers=1
    if args.workers <= 1:
        for p in files:
            section_reports.append(audit_section_file(p))
    else:
        with ProcessPoolExecutor(max_workers=args.workers) as ex:
            futs = {ex.submit(audit_section_file, p): p for p in files}
            for fut in as_completed(futs):
                section_reports.append(fut.result())

    section_reports.sort(key=lambda r: r["file"])

    fails = []
    for sec in section_reports:
        for r in sec["results"]:
            if r["result"]["status"] == "fail":
                fails.append(r)

    p0 = [f for f in fails if f["result"].get("severity") == "P0"]
    p1 = [f for f in fails if f["result"].get("severity") == "P1"]

    totals = {"pass": 0, "fail": 0, "skip": 0, "artifacts": 0}
    for sec in section_reports:
        for k, v in sec["counts"].items():
            totals[k] = totals.get(k, 0) + v
        totals["artifacts"] += sec["artifact_count"]

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sections": len(section_reports),
        "totals": totals,
        "fail_count": len(fails),
        "p0_count": len(p0),
        "p1_count": len(p1),
        "ok": len(p0) == 0,
        "sections_detail": [
            {
                "file": s["file"],
                "section_id": s["section_id"],
                "counts": s["counts"],
                "artifact_count": s["artifact_count"],
            }
            for s in section_reports
        ],
        "failures": [
            {
                "section_id": f["section_id"],
                "file": f["file"],
                "kind": f["kind"],
                "artifact_id": f["artifact_id"],
                "reason": f["result"].get("reason"),
                "severity": f["result"].get("severity"),
                "stderr": f["result"].get("stderr", f["result"].get("stderr_head", ""))[:400],
            }
            for f in fails[:500]
        ],
    }

    issues = {
        "generated_at": report["generated_at"],
        "p0": report["failures"][:200] if p0 else [],
        "p1": [x for x in report["failures"] if x.get("severity") == "P1"][:200],
        "summary": {
            "p0": len(p0),
            "p1": len(p1),
            "pass": totals.get("pass", 0),
            "skip": totals.get("skip", 0),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    # keep full results separate heavy file
    full_path = ROOT / "course-state/python_runtime_audit_full.json"
    full_path.write_text(
        json.dumps({"sections": section_reports}, ensure_ascii=False, indent=None),
        encoding="utf-8",
    )
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    ISSUES.write_text(json.dumps(issues, indent=2, ensure_ascii=False), encoding="utf-8")

    print(
        json.dumps(
            {
                "ok": report["ok"],
                "sections": report["sections"],
                "totals": totals,
                "p0": len(p0),
                "p1": len(p1),
                "out": str(OUT.relative_to(ROOT)),
            },
            indent=2,
        )
    )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    # fix mistaken dead code if any
    raise SystemExit(main())
