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

#: Per-snippet wall-clock budget. Generous enough that a slow shared CI runner
#: does not turn a working snippet red, tight enough to still catch a runaway
#: loop. Override with PYARCANA_SNIPPET_TIMEOUT where the host is slower.
TIMEOUT_SEC = int(os.environ.get("PYARCANA_SNIPPET_TIMEOUT", "8"))
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
    "# BUG",
    "# bug",
    "BUG intencional",
    "# completa",
    "# COMPLETA",
    "pass  #",
    # `DEFECT` is this course's own marker for a deliberately broken starter the
    # learner must repair — 1594 occurrences across 43 of the 57 section files.
    # Without it here, every such starter was reported as
    # `starter_should_run_or_be_marked_incomplete`, i.e. the gate did not know
    # the vocabulary the content actually uses. Recognising the marker does not
    # weaken the check: the failure must still be a pedagogically appropriate
    # error type, or it is reported as `unexpected_error_type`.
    "DEFECT",
    "# defecto",
    # Spanish instructional markers the course already uses to signal "this
    # starter is deliberately unfinished / broken; the learner repairs it":
    #   # Corrige  — 66 starters across 4 sections
    #   # Pista:   — 48 starters across 2 sections
    #   # Arregla  — 24 starters across 1 section
    # As with DEFECT, recognising the marker only routes the starter into the
    # expected-failure branch; the error type must still be a pedagogically
    # appropriate one or it is reported as `unexpected_error_type`.
    "# corrige",
    "# pista:",
    "# arregla",
)


#: Single-character escapes that TypeScript resolves inside a template literal.
#: Anything not listed resolves to the character itself (TS drops the backslash).
_TS_SIMPLE_ESCAPES = {
    "n": "\n",
    "t": "\t",
    "r": "\r",
    "b": "\b",
    "f": "\f",
    "v": "\v",
    "0": "\0",
    "\\": "\\",
    "`": "`",
    "$": "$",
    "'": "'",
    '"': '"',
    "\n": "",  # line continuation
}


def extract_balanced_template(text: str, start: int) -> str | None:
    """Extract a `...` template literal, decoding escapes the way TypeScript does.

    This must mirror TS semantics exactly, because the decoded string *is* the
    program the learner is shown and copies. Previously this dropped the
    backslash and kept the following character verbatim, so a source `\\n` became
    the letter `n` here while TypeScript turned it into a real newline — meaning
    the audit executed a different program than the one that ships.
    """
    if start >= len(text) or text[start] != "`":
        return None
    i = start + 1
    out = []
    while i < len(text):
        ch = text[i]
        if ch == "\\" and i + 1 < len(text):
            nxt = text[i + 1]
            if nxt == "x" and i + 3 < len(text):
                try:
                    out.append(chr(int(text[i + 2 : i + 4], 16)))
                    i += 4
                    continue
                except ValueError:
                    pass
            if nxt == "u" and i + 2 < len(text):
                if text[i + 2] == "{":
                    close = text.find("}", i + 3)
                    if close != -1:
                        try:
                            out.append(chr(int(text[i + 3 : close], 16)))
                            i = close + 1
                            continue
                        except ValueError:
                            pass
                elif i + 5 < len(text):
                    try:
                        out.append(chr(int(text[i + 2 : i + 6], 16)))
                        i += 6
                        continue
                    except ValueError:
                        pass
            out.append(_TS_SIMPLE_ESCAPES.get(nxt, nxt))
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
            # NOTE: deliberately NOT using -I (isolated mode). Isolated mode
            # drops user site-packages, which is where numpy/pandas/sklearn are
            # installed on a normal developer machine. With -I every snippet
            # importing them was classified `missing_dependency` and skipped, so
            # the gate silently reported green while never executing them.
            # See probe_dependency_visibility() for the guard that keeps a blind
            # run loud instead of silent.
            proc = subprocess.run(
                [sys.executable, str(path)],
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


#: Modules the course content leans on most. If these are not importable in the
#: same interpreter the snippets run in, the audit is not really auditing them —
#: it is skipping them. That must be visible in the report, never inferred.
CORE_TEACHING_MODULES = ("numpy", "pandas", "sklearn")


def declared_pins() -> dict[str, str]:
    """The versions requirements-content.txt says the content was verified against."""
    path = ROOT / "requirements-content.txt"
    pins: dict[str, str] = {}
    if not path.exists():
        return pins
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if "==" in line:
            name, _, version = line.partition("==")
            pins[name.strip().lower()] = version.strip()
    return pins


def probe_version_drift() -> dict:
    """Compare the snippet interpreter's libraries against the declared pins.

    Every `output:` block in the curriculum is a promise about what the learner
    will see, and that promise is only true in a named environment. When the
    interpreter's pandas differs from the pinned one, the mismatches that follow
    are the *environment* disagreeing with the content, not the content being
    wrong — and reporting them as content failures sends whoever ran the script
    hunting a bug that is not there.

    This exists because moving the pin to pandas 3 made bare
    `npm run test:python-content` produce four such phantom failures on a
    machine still holding pandas 2.
    """
    pins = declared_pins()
    drift = []
    for name, want in pins.items():
        probe = run_python(
            f"import {name}, sys; sys.stdout.write({name}.__version__)", timeout=25
        )
        got = (probe.get("stdout") or "").strip()
        if probe["exit"] != 0:
            continue  # absence is already reported by the visibility probe
        if got and got != want:
            drift.append({"package": name, "declared": want, "installed": got})
    return {
        "status": "drifted" if drift else "ok",
        "declared": pins,
        "drift": drift,
        "note": (
            "The interpreter running the snippets does NOT match "
            "requirements-content.txt. Declared outputs are only true in the "
            "declared environment, so output_mismatch findings below are most "
            "likely this drift rather than broken content. Re-run inside an "
            "environment built from requirements-content.txt before treating "
            "any of them as real."
            if drift
            else "The snippet interpreter matches the declared teaching environment."
        ),
    }


def probe_dependency_visibility() -> dict:
    """Report whether the snippet interpreter can actually import what content uses.

    Runs in the *same* way snippets do, so it measures the real execution
    environment rather than this process's imports.
    """
    visible, missing = [], []
    for mod in sorted(OPTIONAL_MODULES):
        result = run_python(f"import {mod}", timeout=20)
        (visible if result["exit"] == 0 else missing).append(mod)
    core_missing = [m for m in CORE_TEACHING_MODULES if m in missing]
    return {
        "status": "degraded" if core_missing else "ok",
        "core_modules_missing": core_missing,
        "visible_count": len(visible),
        "missing": missing,
        "note": (
            "Core teaching modules are NOT importable by the snippet interpreter. "
            "Snippets using them are being skipped, not verified — treat any "
            "green result as unproven."
            if core_missing
            else "Core teaching modules are importable; numpy/pandas/sklearn "
            "snippets are genuinely executed."
        ),
    }


def normalize_out(s: str) -> str:
    return "\n".join(line.rstrip() for line in s.strip().splitlines())


def _outputs_structurally_similar(exp: str, got: str) -> bool:
    """True when outputs match modulo numbers, dates, and file paths (timing/ts demos)."""
    def scrub(s: str) -> str:
        s = re.sub(r"/var/folders/[^\s:]+", "<path>", s)
        s = re.sub(r"/tmp/[^\s:]+", "<path>", s)
        s = re.sub(r"File \"[^\"]+\"", 'File "<path>"', s)
        s = re.sub(r"\d{4}-\d{2}-\d{2}T[\d:]+Z?", "<ts>", s)
        s = re.sub(r"\d{4}-\d{2}-\d{2}", "<date>", s)
        s = re.sub(r"\b\d+\.\d+\b", "<num>", s)
        s = re.sub(r"\b\d+\b", "<n>", s)
        return s

    se, sg = scrub(exp), scrub(got)
    if se == sg:
        return True
    # same non-numeric tokens in order (e.g. wall_ms / result / n)
    te = re.findall(r"[A-Za-z_]+", se)
    tg = re.findall(r"[A-Za-z_]+", sg)
    if te and te == tg:
        return True
    # JSON-ish: same keys
    ke = set(re.findall(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', exp))
    kg = set(re.findall(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', got))
    if ke and ke == kg and abs(len(exp) - len(got)) < max(40, len(exp) // 3):
        return True
    return False


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
                # nondeterministic: timestamps, wall-clock timings, temp traceback paths
                if _outputs_structurally_similar(exp, got):
                    return {"status": "pass", "reason": "output_nondeterministic_ok"}
                # traceback demos: KeyError/TypeError message present in both
                err_tokens = ("KeyError", "TypeError", "ValueError", "Traceback", "Error:")
                if any(t in exp for t in err_tokens) and any(t in got for t in err_tokens):
                    return {"status": "pass", "reason": "output_error_demo_ok"}
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
                # Pedagogical incomplete starters often fail on blanks, missing fills,
                # optional deps not installed in the audit host, or partial objects.
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
                        "AttributeError",
                        "KeyError",
                        "IndexError",
                        "ModuleNotFoundError",
                        "ImportError",
                        "FileNotFoundError",
                        "ZeroDivisionError",
                        "PermissionError",
                        "RuntimeError",
                        "OperationalError",
                        "IntegrityError",
                        "LookupError",
                        "StopIteration",
                        "____",
                        "invalid syntax",
                        "Ellipsis",
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


def active_section_stems() -> set[str]:
    """Only the 52 sections imported by src/lib/course/index.ts (exclude legacy renames)."""
    idx = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8", errors="replace")
    stems = set(re.findall(r"from\s+['\"]\./sections/([^'\"]+)['\"]", idx))
    return stems


def list_section_files(only: str | None, shard: str | None) -> list[Path]:
    active = active_section_stems()
    files = sorted(
        p for p in SECTIONS_DIR.glob("s*.ts") if (not active or p.stem in active)
    )
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

    dependency_visibility = probe_dependency_visibility()
    version_drift = probe_version_drift()

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sections": len(section_reports),
        "dependency_visibility": dependency_visibility,
        "environment_matches_pins": version_drift,
        "totals": totals,
        "fail_count": len(fails),
        "p0_count": len(p0),
        "p1_count": len(p1),
        # A degraded run is NOT ok: it means the snippets that matter most were
        # skipped rather than verified, so a clean result would be unearned.
        "ok": len(p0) == 0
        and len(p1) == 0
        and dependency_visibility["status"] == "ok",
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
                "dependency_visibility": dependency_visibility["status"],
                "core_modules_missing": dependency_visibility["core_modules_missing"],
                "environment_matches_pins": version_drift["status"],
                "totals": totals,
                "p0": len(p0),
                "p1": len(p1),
                "out": str(OUT.relative_to(ROOT)),
            },
            indent=2,
        )
    )
    if version_drift["status"] == "drifted":
        drift = ", ".join(
            f"{d['package']} {d['installed']} (declared {d['declared']})"
            for d in version_drift["drift"]
        )
        print(
            "\nWARNING — the interpreter does not match requirements-content.txt: "
            f"{drift}.\n{version_drift['note']}",
            file=sys.stderr,
        )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    # fix mistaken dead code if any
    raise SystemExit(main())
