#!/usr/bin/env python3
"""Task 8-a — Capstone package content invariant test (Red→Green).

Asserts that every one of the 13 capstone packages under
``course-state/capstones/`` ships the full required artifact set and
that each demo runs and exits 0 with a ``METRICS_JSON:`` line. Also
asserts no ``CP-N4-D`` package exists and that no ``demo.py`` contains
suspicious tokens (real API keys, real PII, real passwords). The
following are explicitly allowed and excluded from the suspicious-token
scan:
  - ``redact(...)`` calls (redaction fixtures)
  - raw-string regex patterns like ``r"sk-..."``
  - the placeholder ``KEYxyz``
  - the ``example.test`` / ``example.com`` / ``x.test`` email domains

Required artifact set (14 files per package):
  BRIEF.md, RUBRIC.json, demo.py, data/generate.py, tests/test_demo.py,
  SECURITY.md, PRIVACY.md, ACCESSIBILITY.md, RESPONSIBLE_USE.md,
  IDO.md, WEDO.md, YOUDO.md, FINAL_INTERFACE.md, STARTER/README.md

Stdlib only. Runnable as ``python3 test_capstone_package_content.py``.
Exits 0 on PASS, non-zero on FAIL, prints a one-line PASS/FAIL summary.
"""
from __future__ import annotations
import json
import os
import re
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PACKAGES_DIR = os.path.join(REPO, "course-state", "capstones")
INDEX_PATH = os.path.join(REPO, "course-state", "capstones", "INDEX.json")

EXPECTED_PACKAGES = [
    "CP-N1-A", "CP-N1-B", "CP-N1-C",
    "CP-N2-A", "CP-N2-B", "CP-N2-C",
    "CP-N3-A", "CP-N3-B", "CP-N3-C",
    "CP-N4-A", "CP-N4-B", "CP-N4-C",
    "CP-FINAL",
]

REQUIRED_ARTIFACTS = [
    "BRIEF.md",
    "RUBRIC.json",
    "demo.py",
    "data/generate.py",
    "tests/test_demo.py",
    "SECURITY.md",
    "PRIVACY.md",
    "ACCESSIBILITY.md",
    "RESPONSIBLE_USE.md",
    "IDO.md",
    "WEDO.md",
    "YOUDO.md",
    "FINAL_INTERFACE.md",
    "STARTER/README.md",
]

FORBIDDEN_PACKAGE = "CP-N4-D"

# Suspicious token patterns. Each is (name, regex, exclusion-rule).
# Real API keys (sk-..., AIza..., AKIA..., ghp_...).
API_KEY_REGEX = re.compile(
    r"(sk-[A-Za-z0-9_-]{10,}"
    r"|AIza[A-Za-z0-9_-]{20,}"
    r"|AKIA[0-9A-Z]{12,}"
    r"|ghp_[A-Za-z0-9]{20,})"
)
# Email addresses.
EMAIL_REGEX = re.compile(
    r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
)
# Password / secret assignments.
SECRET_ASSIGN_REGEX = re.compile(
    r"(?i)(password|passwd|pwd|secret|api_key|apikey|token)\s*=\s*"
    r"['\"]([^'\"]+)['\"]"
)
# Raw-string regex literal detection (r"..." or r'...').
RAW_STRING_REGEX = re.compile(r"""r['"]""")
# Allowed email domains (synthetic / example).
ALLOWED_EMAIL_DOMAINS = (
    "example.test",
    "example.com",
    "x.test",
    "x.com",
    "synth.test",
    "demo.test",
    "test.test",
)
# Allowed placeholder secret values.
ALLOWED_PLACEHOLDERS = {
    "KEYxyz",
    "REDACTED",
    "YOUR_KEY",
    "YOUR_API_KEY",
    "PLACEHOLDER",
    "YOUR_TOKEN",
    "YOUR_SECRET",
    "",
}
# Substrings that indicate a value is a clearly-marked demo/test placeholder
# (not a real secret). Case-insensitive.
SAFE_PLACEHOLDER_SUBSTRINGS = (
    "not-a-secret",
    "notsecret",
    "not_a_secret",
    "demo-",
    "demo_",
    "fake-",
    "fake_",
    "placeholder",
    "example",
    "synth",
    "test-",
    "test_",
    "your_",
    "redacted",
)


def _find_raw_string_spans(line):
    """Return list of (start, end) char spans for raw string literals
    r'...' or r"..." on a single line."""
    spans = []
    for m in re.finditer(r"""r(['"])((?:\\\1|.)*?)\1""", line):
        spans.append((m.start(), m.end()))
    return spans


def _find_redact_call_spans(line):
    """Return list of (start, end) char spans for redact(...) calls.
    Covers balanced parens naively (single line)."""
    spans = []
    for m in re.finditer(r"\bredact\s*\(", line):
        start = m.start()
        depth = 0
        i = m.end() - 1  # at '('
        while i < len(line):
            ch = line[i]
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    spans.append((start, i + 1))
                    break
            i += 1
    return spans


def _in_spans(idx, spans):
    return any(lo <= idx < hi for lo, hi in spans)


def _scan_demo_for_suspicious_tokens(source, capstone_id):
    """Return list of (kind, detail) tuples for suspicious findings."""
    findings = []
    raw_lines = source.splitlines()
    for lineno, line in enumerate(raw_lines, start=1):
        raw_spans = _find_raw_string_spans(line)
        redact_spans = _find_redact_call_spans(line)
        # API keys
        for m in API_KEY_REGEX.finditer(line):
            if _in_spans(m.start(), raw_spans):
                continue
            if _in_spans(m.start(), redact_spans):
                continue
            token = m.group(0)
            if token == "KEYxyz":
                continue
            findings.append(
                ("api_key", f"{capstone_id}/demo.py:{lineno}: {token}")
            )
        # Emails
        for m in EMAIL_REGEX.finditer(line):
            email = m.group(0)
            domain = email.split("@", 1)[1].lower()
            if any(domain.endswith(d) for d in ALLOWED_EMAIL_DOMAINS):
                continue
            if _in_spans(m.start(), redact_spans):
                continue
            findings.append(
                ("email", f"{capstone_id}/demo.py:{lineno}: {email}")
            )
        # Secret assignments
        for m in SECRET_ASSIGN_REGEX.finditer(line):
            val = m.group(2)
            if val in ALLOWED_PLACEHOLDERS:
                continue
            if val.startswith("sk-") and _in_spans(m.start(2), raw_spans):
                continue
            val_lower = val.lower()
            if any(sub in val_lower for sub in SAFE_PLACEHOLDER_SUBSTRINGS):
                continue
            if val == "KEYxyz":
                continue
            findings.append(
                ("secret", f"{capstone_id}/demo.py:{lineno}: "
                           f"{m.group(1)}={val!r}")
            )
    return findings


def _run_demo(capstone_id):
    """Run demo.py and return (exit_code, stdout)."""
    demo_path = os.path.join(PACKAGES_DIR, capstone_id, "demo.py")
    proc = subprocess.run(
        [sys.executable, demo_path],
        capture_output=True,
        text=True,
        timeout=60,
    )
    return proc.returncode, proc.stdout


def main() -> int:
    failures: list[str] = []

    # --- No CP-N4-D package ---
    if os.path.isdir(os.path.join(PACKAGES_DIR, FORBIDDEN_PACKAGE)):
        failures.append(
            f"FORBIDDEN: package directory {FORBIDDEN_PACKAGE}/ exists"
        )

    # --- Every expected package exists ---
    actual_packages = set()
    if os.path.isdir(PACKAGES_DIR):
        for name in os.listdir(PACKAGES_DIR):
            full = os.path.join(PACKAGES_DIR, name)
            if os.path.isdir(full) and name.startswith("CP-"):
                actual_packages.add(name)
    expected_set = set(EXPECTED_PACKAGES)
    missing = expected_set - actual_packages
    extra = actual_packages - expected_set
    if missing:
        failures.append(f"missing packages: {sorted(missing)}")
    if extra:
        failures.append(f"unexpected packages: {sorted(extra)}")

    # --- Each package has the full required artifact set ---
    for cap_id in EXPECTED_PACKAGES:
        pkg_dir = os.path.join(PACKAGES_DIR, cap_id)
        if not os.path.isdir(pkg_dir):
            continue  # already flagged above
        for artifact in REQUIRED_ARTIFACTS:
            artifact_path = os.path.join(pkg_dir, artifact)
            if not os.path.isfile(artifact_path):
                failures.append(f"{cap_id}: missing artifact {artifact}")

    # --- Each demo runs and exits 0 with METRICS_JSON ---
    for cap_id in EXPECTED_PACKAGES:
        demo_path = os.path.join(PACKAGES_DIR, cap_id, "demo.py")
        if not os.path.isfile(demo_path):
            continue  # already flagged above
        try:
            exit_code, stdout = _run_demo(cap_id)
        except subprocess.TimeoutExpired:
            failures.append(f"{cap_id}/demo.py: timed out")
            continue
        except Exception as exc:  # pragma: no cover — defensive
            failures.append(f"{cap_id}/demo.py: error running: {exc}")
            continue
        if exit_code != 0:
            failures.append(
                f"{cap_id}/demo.py: exit code {exit_code} (expected 0)"
            )
        if "METRICS_JSON:" not in stdout:
            failures.append(
                f"{cap_id}/demo.py: no METRICS_JSON: line in stdout"
            )

    # --- No suspicious tokens in any demo.py ---
    for cap_id in EXPECTED_PACKAGES:
        demo_path = os.path.join(PACKAGES_DIR, cap_id, "demo.py")
        if not os.path.isfile(demo_path):
            continue
        with open(demo_path, encoding="utf-8") as fh:
            src = fh.read()
        findings = _scan_demo_for_suspicious_tokens(src, cap_id)
        for kind, detail in findings:
            failures.append(f"suspicious {kind}: {detail}")

    if failures:
        print(f"FAIL test_capstone_package_content — {len(failures)} failure(s)")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(
        "PASS test_capstone_package_content — 13 packages, all 14 required "
        "artifacts present, all demos exit 0 with METRICS_JSON, no CP-N4-D, "
        "no suspicious tokens in demo.py"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
